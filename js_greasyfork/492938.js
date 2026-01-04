// ==UserScript==
// @name         YouTube Playback Rate Control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change playback rate on YouTube using left and right square brackets
// @author       ChatGPT lmao
// @match        https://www.youtube.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      CC-BY-SA-3.0; http://creativecommons.org/licenses/by-sa/3.0/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492938/YouTube%20Playback%20Rate%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/492938/YouTube%20Playback%20Rate%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playbackRate = 1; // Initial playback rate

    // Function to set the playback rate and update the video element
    const setPlaybackRate = () => {
        playbackRate = Math.max(0.06250, Math.min(playbackRate, 16)); // Cap playback rate between 0.06250 and 10
        $('video').get(0).playbackRate = playbackRate; // Use .get(0) to access the DOM element from jQuery object
        console.log(`Playback rate set to: ${playbackRate}`);
    };

    // Custom function to handle exponential decrease when playback rate is 1
    const decreasePlaybackRate = () => {
        if (playbackRate > 1) {
            playbackRate--;
        } else {
            playbackRate = Math.max(playbackRate / 2, 0.06250); // Ensure the minimum playback rate is 0.06250
        }
        setPlaybackRate();
    };

    // Custom function to handle increasing the playback rate
    const increasePlaybackRate = () => {
        if (playbackRate < 1) {
            playbackRate *= 2; // Double the playback rate until it reaches 1
        } else {
            playbackRate++; // Increase by 1 if it's above 1
        }
        setPlaybackRate();
    };

    // Event listener for keydown event
    document.addEventListener('keydown', function(event) {
        if (event.code === 'BracketRight') { // Right square bracket pressed
            increasePlaybackRate();
        } else if (event.code === 'BracketLeft') { // Left square bracket pressed
            decreasePlaybackRate();
        }
    });
})();
