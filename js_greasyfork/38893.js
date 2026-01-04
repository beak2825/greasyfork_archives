// ==UserScript==
// @name         Agar.io Trident Extension
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Change white background color to gray, show current time, countdown sound in Battle Royale mode, mouse controls
// @author       Trident 🔱
// @match        *://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/38893/Agario%20Trident%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/38893/Agario%20Trident%20Extension.meta.js
// ==/UserScript==

(function() {
'use strict';

var soundEnabled = true;

var New_WhiteBackgroundColor = '#bbbbbb';

var old_fillRect = CanvasRenderingContext2D.prototype.fillRect;
CanvasRenderingContext2D.prototype.fillRect = function() {
    var x = arguments[0];
    var y = arguments[1];
    var w = arguments[2];
    var h = arguments[3];

    if (x==0 && y==0 && w==this.canvas.width && h==this.canvas.height) {
        if (this.fillStyle == '#f2fbff') { // agar.io white background color
            this.fillStyle = New_WhiteBackgroundColor;
        }
    }

    return old_fillRect.apply(this, arguments);
};

function calculateRemain(text) {
    if (text.endsWith('s')) {
        var match;

        match = / in:? (\d+)s$/.exec(text);
        if (match !== null) {
            return parseInt(match[1], 10);
        }

        match = /^((\d+)m)? ?(\d+)s$/.exec(text);
        if (match !== null) {
            return (parseInt(match[2], 10) || 0) * 60 + parseInt(match[3], 10); // "x || 0" is "0 if x undefined"
        }
    }

    return null;
}

var old_fillText = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function() {
    if (arguments[0]=='Leaderboard') {
        arguments[0] = 'Leaders ' + new Date().toLocaleTimeString('en', {hour12: false, hour: 'numeric', minute: 'numeric'});
    }
    else if (window.location.href.indexOf('#battleroyale') >= 0 || window.location.href.indexOf('#teams') >= 0) {
        var PREFIX;
        PREFIX = 'Players ';
        if (arguments[0].indexOf(PREFIX) == 0) {
            arguments[0] = new Date().toLocaleTimeString('en', {hour12: false, hour: 'numeric', minute: 'numeric'}) + ' ' + arguments[0].slice(PREFIX.length);
        }
        else if (soundEnabled) {
            var remain = calculateRemain(arguments[0]);

            if (remain !== null) {
                var minRemain, maxRemain;

                if (remain > 30 && remain % 30 == 0) { // every 30s: 2m (120s), 1m30s (90s), 1m (60s)
                    remain = remain/30 - 2;
                    maxRemain = 2; // 2m
                    minRemain = 0; // 1m
                    remainingBeep('sine', remain, minRemain, maxRemain, 1, 1, 400, 500, 0.2, 1, 'triangle');
                }
                else if (remain <= 30 && remain >= 10 && remain % 10 == 0) { // every 10s: 30s, 20s, 10s
                    remain = remain/10 - 1;
                    maxRemain = 2; // 30s
                    minRemain = 0; // 10s
                    remainingBeep('triangle', remain, minRemain, maxRemain, 1, 1, 500, 600, 0.2, 1, 'sawtooth');
                }
                else if (remain < 10) { // every 1s
                    maxRemain = 9;
                    minRemain = 0;
                    remainingBeep('sawtooth', remain, minRemain, maxRemain, 1, 1, 600, 900, 0.2, 1, 'square');
                }
            }
        }
    }

    return old_fillText.apply(this, arguments);
};

function remainingBeep(type, remain, minRemain, maxRemain, startVol, endVol, startFreq, endFreq, startDuration, endDuration, endingType) {
    var coef = (maxRemain-remain) / (maxRemain-minRemain); // increases from 0 (0%) to 1 (100%)
    if (coef == 1) {
        type = endingType;
    }
    scaledBeep(coef, startVol, endVol, startFreq, endFreq, startDuration, endDuration, type);
}

function scaledBeep(coef, startVol, endVol, startFreq, endFreq, startDuration, endDuration, type) {
    beep(scale(startVol, endVol, coef), scale(startFreq, endFreq, coef), scale(startDuration, endDuration, coef), type);
}

function scale(startValue, endValue, coef) {
  return startValue + (endValue-startValue)*coef;
}

var audioCtx = null;

function beep(vol, freq, duration, type) {
    if (soundEnabled) {
        doBeep(vol, freq, duration, type);
    }
}

function doBeep(vol, freq, duration, type) {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }

    var gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = vol;

    var osc = audioCtx.createOscillator();
    osc.connect(gainNode);
    osc.type = type;
    osc.frequency.value = freq; // hz

    osc.start();

    gainNode.gain.exponentialRampToValueAtTime(0.00001/*can't be 0*/, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
}

function freeze() {
    canvas.dispatchEvent(new MouseEvent("mousemove", {
        clientX: innerWidth / 2,
        clientY: innerHeight / 2
    }));
}

// mouse controls

canvas.addEventListener("mousedown", ({button}) => {
    if (button === 0) { // left click
        core.split();
    }
    else if (button === 1) { // mouse wheel click
        freeze();
    }
    else if (button === 2) { // right click
        core.eject();
    }
});
canvas.addEventListener("mouseup", ({button}) => {
    if (button === 2) {
        clearInterval(intervalID);
        intervalID = null;
    }
});

const prevent = event => event.preventDefault();
canvas.addEventListener("contextmenu", prevent);
canvas.addEventListener("drag", prevent);

window.addEventListener('keydown', keydown);
function keydown(event) {
    if (event.keyCode == 83) { // S
        freeze();
    }
}

})();