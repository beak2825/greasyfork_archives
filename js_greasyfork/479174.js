// ==UserScript==
// @name         Audio Autoplay for Everything
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically enable audio playback on any videos
// @author       Leon Theremin
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479174/Audio%20Autoplay%20for%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/479174/Audio%20Autoplay%20for%20Everything.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to enable audio playback
    function enableAudio(video) {
        video.muted = false;
    }

    // Define a function to check for new videos and enable audio playback
    function checkForNewVideos() {
        // Get all video elements on the page
        const videos = document.getElementsByTagName('video');

        // Loop through each video element and enable audio playback
        for (let i = 0; i < videos.length; i++) {
            // Check if the video has already been processed
            if (!videos[i].hasAttribute('data-audio-enabled')) {
                // Enable audio playback
                enableAudio(videos[i]);

                // Mark the video as processed
                videos[i].setAttribute('data-audio-enabled', true);
            }
        }
    }

    // Check for new videos every 500 milliseconds
    setInterval(checkForNewVideos, 500);
})();
