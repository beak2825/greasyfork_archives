// ==UserScript==
// @name         Lessons touchpad swipe navigation
// @namespace    wanikani
// @version      0.1
// @description  Navigate your lessons with swipe gesture ("wheel" event)
// @author       mrowqa
// @match        https://www.wanikani.com/lesson/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24424/Lessons%20touchpad%20swipe%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/24424/Lessons%20touchpad%20swipe%20navigation.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';

    function touchpadScrollHandler(event) {
        //console.log("X: " + event.deltaX + ", " + event.deltaY + ", " + event.deltaZ);
        if (touchpadScrollHandler.locked === true) {
            return;
        }
        //console.log("next");

        var threshold = 3;  // for mouse event deltaX value, 10-20 slow swipe, >100 fast swipes
        var cooldown = 2000; // in miliseconds
        var leftKeyCode = 37;
        var rightKeyCode = 39;

        var scroll = function (keyCode) {
            $("body").trigger(
                $.Event("keyup", {keyCode: keyCode, which: keyCode})
            );
            touchpadScrollHandler.locked = true;
            setTimeout(function() {
                touchpadScrollHandler.locked = false;
            }, cooldown);
        };

        if (event.deltaX < -threshold) {
            scroll(leftKeyCode);
        }
        if (event.deltaX > threshold) {
            scroll(rightKeyCode);
        }
    }

    touchpadScrollHandler.locked = false;
    document.addEventListener("wheel", touchpadScrollHandler, {passive: true});
});
