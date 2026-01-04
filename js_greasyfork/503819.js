// ==UserScript==
// @name         Universal Auto Scroll with Toggle
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically scrolls any webpage with a double-tap to start/stop toggle
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503819/Universal%20Auto%20Scroll%20with%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/503819/Universal%20Auto%20Scroll%20with%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scrollAmount = 1;   // Pixels to scroll each time
    const scrollInterval = 50; // Time in milliseconds between scrolls
    let isScrolling = false;
    let scrollTimeout;

    function autoScroll() {
        if (isScrolling) {
            window.scrollBy(0, scrollAmount);

            // Continue scrolling if not at the bottom of the page
            if (window.innerHeight + window.scrollY < document.body.scrollHeight) {
                scrollTimeout = setTimeout(autoScroll, scrollInterval);
            }
        }
    }

    function toggleScroll() {
        if (isScrolling) {
            // Stop scrolling
            isScrolling = false;
            clearTimeout(scrollTimeout);
        } else {
            // Start scrolling
            isScrolling = true;
            autoScroll();
        }
    }

    let lastTapTime = 0;
    document.addEventListener('touchend', function(event) {
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapTime;

        if (tapInterval < 300 && tapInterval > 0) { // Double-tap detected
            toggleScroll();
            event.preventDefault();
        }

        lastTapTime = currentTime;
    });

})();
