// ==UserScript==
// @name         Website AutoScroll
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically scroll through any webpage!
// @author       Calvin H
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469006/Website%20AutoScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/469006/Website%20AutoScroll.meta.js
// ==/UserScript==
//原地址：https://greasyfork.org/en/scripts/456472
//改动的地方：keycode从79（k），改为了77（m），不然和chrome，windows的快捷键有冲突。改成m后，可以用ctrl+m触发
(function() {
    'use strict';

    var minClamp = 1;
    var maxClamp = 10000; // Change this to modify max possible pixels per second

    var popupVariable;
    var pixelsPerFrame = 1;

    var scrollState = true;

    window.addEventListener('keydown', function(event) {
        if (event.keyCode === 77 && (event.ctrlKey || event.metaKey)) {
            popupVariable = prompt("How many pixels per second would you like to AutoScroll? (" + minClamp + "-" + maxClamp + "). Just manually scroll in order to stop the AutoScroll.");
            scrollState = false;
            popupVariable = clamp(popupVariable);
            scrollInterval = 1000/popupVariable;
            pixelsPerFrame = 1;
            if (popupVariable > 100) {
                scrollInterval = 10;
                pixelsPerFrame = popupVariable/100
            }
            clearInterval(scrollIntervalId);
            scrollIntervalId = window.setInterval(scrollDown, scrollInterval);
        }
    }, false);

    var scrollIntervalId;
    var scrollInterval;

    function scrollDown() {
        if (!scrollState) {
        window.scrollBy(0, pixelsPerFrame);
            console.log(pixelsPerFrame);
        }
    }

    function clamp(num) {
        return Math.max(minClamp, Math.min(num, maxClamp));
    }

    window.addEventListener('wheel', function(e) {
        if (!scrollState) {
            scrollState = true;
        }
    }, false);
})();