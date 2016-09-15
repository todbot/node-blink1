/**
 * Example of making your own color pattern player with node-blink1
 *  Tod E. Kurt, todbot.com / thingm.com
 */

var Blink1 = require('./blink1');
var tinycolor = require('tinycolor2');

function PatternPlayer(blink1) {
    this.count = 0;
    this.pos = 0;
    this.pattern = null;
    this.blink1 = blink1;

    /**
     * Play a color pattern
     * @param  {Pattern}    pattern a color pattern, see below for example
     */
    this.play = function(pattern,callback) {
        this.pattern = pattern;
        this.pos = 0;
        this.count = 0;
        this.pattern = pattern;
        this.callback = callback;
        this._playStep();
    };

    this.stop = function() {
        clearTimeout(this.timer);
    };

    // internal function
    this._playStep = function() {
        var step = this.pattern.steps[this.pos];
        // console.log("playStep:", this.pos,step);
        var c = tinycolor(step.color).toRgb();
        this.blink1.fadeToRGB( step.time*1000, c.r,c.g,c.b, step.led );
        this.pos++;
        if( this.pos === this.pattern.steps.length ) { // end of pattern
            this.pos = 0;
            this.count++;
        }
        if( this.count < this.pattern.repeats ) {
            this.timer = setTimeout( this._playStep.bind(this), step.time*1000 );
        }
        else {
            if( this.callback ) { this.callback(this.pattern); }
        }
    };
}

// for demo when called with "node ./patternPlayer.js"
if (require.main === module) {

    var blink1 = new Blink1();
    var player = new PatternPlayer(blink1);

    // the pattern you want to play
    var pattern1 = {
        name: "pattern1",
        steps: [
            {color: "#ff00ff", time:0.3, led:0},
            {color: "#0000ff", time:0.5, led:0},
            {color: "#ff0000", time:0.5, led:0},
            {color: "#00ff00", time:0.5, led:1},
            {color: "#000000", time:0.5, led:1},
            {color: "#00ff00", time:0.5, led:2},
            {color: "#000000", time:0.5, led:2},
        ],
        repeats: 2
    };

    var callback = function(oldpattern) {
        console.log("pattern "+ oldpattern.name + " done playing");
    };

    player.play(pattern1, callback);
}

module.exports = PatternPlayer;
