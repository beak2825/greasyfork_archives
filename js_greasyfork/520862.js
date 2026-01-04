// ==UserScript==
// @name         Auto Scroll YouTube Shorts
// @namespace    https://github.com/Navist/YouTubeShortsAutoScroll
// @version      1.0a
// @description  Automatically scrolls to the next YouTube short when the current one finishes.
// @author       Navist (AI Generated)
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Navist/YouTubeShortsAutoScroll
// @supportURL   https://github.com/Navist/YouTubeShortsAutoScroll/issues
// @downloadURL https://update.greasyfork.org/scripts/520862/Auto%20Scroll%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/520862/Auto%20Scroll%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveToNextShort() {
        // Target the "Next" button by its class and aria-label
        const nextButton = document.querySelector(
            'button.yt-spec-button-shape-next[aria-label="Next video"]'
        );

        if (nextButton) {
            nextButton.click(); // Simulate a click on the "Next" button
            console.log("Moved to next video.");
        } else {
            console.log("Next button not found!");
        }
    }

    function checkVideoProgress() {
        const video = document.querySelector('video');
        if (video) {
            // Check if the video is about to finish (within 0.5 seconds of the duration)
            if (video.duration - video.currentTime <= 0.5) {
                moveToNextShort();
            }
        }
    }

    // Run the check every 500ms
    setInterval(checkVideoProgress, 500);
})();
