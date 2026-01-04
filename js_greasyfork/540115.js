// ==UserScript==
// @name         Middle Click Auto Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scrolls page down at a set speed when middle mouse button is clicked
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540115/Middle%20Click%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/540115/Middle%20Click%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrolling = false;
    let scrollInterval = null;

    function startScrolling(speed) {
        if (scrolling) return;
        scrolling = true;
        scrollInterval = setInterval(() => {
            window.scrollBy(0, 1);
        }, 1000 / speed);
    }

    
    function stopScrolling() {
        scrolling = false;
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = null;
    }

    window.addEventListener('mousedown', function(e) {
        if (e.button === 1 && !scrolling) {
            e.preventDefault();
            let speed = parseInt(prompt('Enter scroll speed (pixels per second):', '100'), 10);
            //assitance from github copilot
        if (!isNaN(speed) && speed > 0) {
            startScrolling(speed);
            }
        } else if (e.button === 1 && scrolling) {
            stopScrolling();
        }
    });
    //assistance from github copilot


    window.addEventListener('keydown', function() {
        if (scrolling) stopScrolling();
    });
})();