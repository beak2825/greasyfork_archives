// ==UserScript==
// @name         Web Toon autoscroll
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically scroll through webcomics on webtoons
// @author       NotACoder
// @match        https://www.webtoons.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487208/Web%20Toon%20autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/487208/Web%20Toon%20autoscroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the scroll speed (adjust as needed)
    var scrollSpeed = 1;

    // Variable to track whether scrolling is paused
    var isPaused = false;

    // Function to scroll the page automatically
    function autoScroll() {
        if (!isPaused) {
            window.scrollBy(0, scrollSpeed);
        }
    }

    // Toggle pause on "p" key press
    function togglePause() {
        isPaused = !isPaused;
    }

    // Set the interval for scrolling (adjust as needed)
    setInterval(autoScroll, 10); // Scroll every 1000 milliseconds (1 second)

    // Add event listener for "p" key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'p') {
            togglePause();
        }
    });

    // Add event listener for click on the page to pause
    document.addEventListener('click', function() {
        togglePause();
    });
})();