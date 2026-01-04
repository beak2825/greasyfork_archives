// ==UserScript==
// @name         YouTube - Block progress bar click scrolling
// @namespace    https://example.com
// @version      1.12
// @description  Prevent clicks below the red timeline scrolling, but allow control buttons to work
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529332/YouTube%20-%20Block%20progress%20bar%20click%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/529332/YouTube%20-%20Block%20progress%20bar%20click%20scrolling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        // Allow interaction with YouTube menu buttons (three dots, settings, etc.)
        if (e.target.closest('.ytd-menu-renderer, .ytp-button, .ytd-popup-container, .yt-simple-endpoint')) {
            return; // Allow menu interactions
        }

        // Ensure the script runs only on the video player page
        if (!document.querySelector('.html5-video-player')) return;

        // Get the progress bar container
        const progressBar = document.querySelector('.ytp-progress-bar-container');
        if (!progressBar) return; // If not found, do nothing

        // Get the bounding rectangle of the progress bar
        const rect = progressBar.getBoundingClientRect();
        const bufferPixels = 5; // Small buffer to avoid false positives

        // If the click is below the progress bar plus buffer, block the event
        if (e.clientY > rect.bottom + bufferPixels) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);
})();