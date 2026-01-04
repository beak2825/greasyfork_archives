// ==UserScript==
// @name         Choppy Orc Framestepper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Press `q` to toggle pause and `z` to frame-advance within pause mode.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384329/Choppy%20Orc%20Framestepper.user.js
// @updateURL https://update.greasyfork.org/scripts/384329/Choppy%20Orc%20Framestepper.meta.js
// ==/UserScript==

var delayedCallback = null;
var paused = false;

var scheduler = window.requestAnimationFrame;

var fakeTime = 0;

performance.now = function() { return fakeTime; }

window.requestAnimationFrame = function(callback) {
    fakeTime += 20;
    if (paused) {
        delayedCallback = callback;
    } else {
        delayedCallback = null;
        scheduler(callback);
    }
}

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   if (key == 90 && paused && delayedCallback) { // z key
       delayedCallback();
   }

    if (key == 81) { // q key
        paused = !paused;
        if (!paused) delayedCallback();
    }
}