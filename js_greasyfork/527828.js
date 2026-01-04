// ==UserScript==
// @name         Youtube actual video time, time left
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Youtube actual video time, time left on fullscreen
// @author       You
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527828/Youtube%20actual%20video%20time%2C%20time%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/527828/Youtube%20actual%20video%20time%2C%20time%20left.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Check if the timeDisplay div already exists, if not, create it
if (!document.getElementById('video-time-display')) {
    let timeDisplay = document.createElement('div');
    timeDisplay.id = 'video-time-display'; // Set an ID to avoid redeclaration
    timeDisplay.style.position = 'fixed';
    timeDisplay.style.top = '10px';
    timeDisplay.style.left = '10px';
    timeDisplay.style.padding = '10px';
    timeDisplay.style.fontSize = '18px';
    timeDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    timeDisplay.style.color = 'white';
    timeDisplay.style.borderRadius = '5px';
    timeDisplay.style.zIndex = '1000';
    document.body.appendChild(timeDisplay);
}

// Function to update the time display
function updateVideoTime() {
    let video = document.querySelector('video');
    if (video) {
        let currentTime = video.currentTime;
        let duration = video.duration;

        // If the video is loaded (i.e., duration is finite)
        if (isFinite(duration)) {
            let minutesElapsed = Math.floor(currentTime / 60);
            let secondsElapsed = Math.floor(currentTime % 60);
            let minutesRemaining = Math.floor((duration - currentTime) / 60);
            let secondsRemaining = Math.floor((duration - currentTime) % 60);

            let formattedElapsedTime = `${minutesElapsed}:${secondsElapsed < 10 ? '0' + secondsElapsed : secondsElapsed}`;
            let formattedRemainingTime = `${minutesRemaining}:${secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining}`;

            // Update the time display text content
            document.getElementById('video-time-display').textContent =
                `Current Time: ${formattedElapsedTime} | Time Remaining: ${formattedRemainingTime}`;
        }
    }
}

// Update the time every second
setInterval(updateVideoTime, 1000);

})();