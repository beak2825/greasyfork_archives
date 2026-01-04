// ==UserScript==
// @name         YouTube Current Timestamp and Duration to Seconds
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Displays the current YouTube video timestamp and full video length as total seconds, updating every second.
// @author       Deepseek AI (propagated by Cris M)
// @license      gpl-3.0
// @match        *://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530318/YouTube%20Current%20Timestamp%20and%20Duration%20to%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/530318/YouTube%20Current%20Timestamp%20and%20Duration%20to%20Seconds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert H:mm:ss or mm:ss to total seconds
    function convertTimestampToSeconds(timestamp) {
        const parts = timestamp.split(':').map(Number);
        if (parts.some(isNaN)) return null; // Return null for invalid timestamps
        if (parts.length === 3) { // HH:MM:SS
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) { // MM:SS
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 1) { // SS
            return parts[0];
        }
        return null;
    }

    // Function to create or update a custom display for seconds
    function createOrUpdateDisplay(element, seconds) {
        let customDisplay = element.nextElementSibling;
        if (!customDisplay || !customDisplay.classList.contains('custom-seconds-display')) {
            customDisplay = document.createElement('span');
            customDisplay.classList.add('custom-seconds-display');
            customDisplay.style.marginLeft = '5px';
            customDisplay.style.color = '#aaa';
            element.insertAdjacentElement('afterend', customDisplay);
        }
        customDisplay.textContent = `(${seconds}s)`;
    }

    // Function to update the timestamp and duration display
    function updateTimestampDisplay() {
        // Find the current timestamp and duration elements in the YouTube player
        const timeDisplay = document.querySelector('.ytp-time-current');
        const durationDisplay = document.querySelector('.ytp-time-duration');
        if (!timeDisplay || !durationDisplay) return;

        // Get the current timestamp and duration text (e.g., "4:55" or "1:20:38")
        const currentTimestamp = timeDisplay.textContent.trim();
        const durationTimestamp = durationDisplay.textContent.trim();

        // Convert the timestamps to total seconds
        const currentSeconds = convertTimestampToSeconds(currentTimestamp);
        const durationSeconds = convertTimestampToSeconds(durationTimestamp);

        // Update the custom displays for current time and duration
        if (currentSeconds !== null) {
            createOrUpdateDisplay(timeDisplay, currentSeconds);
        }
        if (durationSeconds !== null) {
            createOrUpdateDisplay(durationDisplay, durationSeconds);
        }
    }

    // Start observing the video player for changes
    const observer = new MutationObserver(() => {
        // Check if the video is playing
        const video = document.querySelector('video');
        if (video && !video.paused) {
            // Update the timestamp display every second
            setInterval(updateTimestampDisplay, 1000);
        }
    });

    // Observe the YouTube player container for changes
    const playerContainer = document.querySelector('#movie_player');
    if (playerContainer) {
        observer.observe(playerContainer, { childList: true, subtree: true });
    }

    // Initial run to start the timer if the video is already playing
    const video = document.querySelector('video');
    if (video && !video.paused) {
        setInterval(updateTimestampDisplay, 1000);
    }

    // Convert the duration on page load
    updateTimestampDisplay();
})();