// ==UserScript==
// @name         Gapless Playback for YouTube Shorts
// @namespace    https://greasyfork.org/en/users/1413127-tumoxep
// @version      1.0
// @description  An attempt to eliminate the gap between youtube short video replays. Doesn't work for background tabs.
// @license      WTFPL
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524382/Gapless%20Playback%20for%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/524382/Gapless%20Playback%20for%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Based on perception. Tune for yourself
    const TRIGGER_THRESHOLD = 0.2;

    let pollingStarted = false;

    function enableGaplessPlayback() {
        const videoElement = document.querySelector('video');
        if (pollingStarted) {
            return;
        }
        if (!videoElement) {
            return;
        }
        function checkVideoTime() {
            if (videoElement.duration - videoElement.currentTime < TRIGGER_THRESHOLD) {
                pollingStarted = false;
                videoElement.currentTime = 0;
                videoElement.play();
                enableGaplessPlayback();
            } else {
                // Continue polling
                requestAnimationFrame(checkVideoTime);
            }
        }
        console.log('setting up gapless playback');
        // Start polling
        pollingStarted = true;
        requestAnimationFrame(checkVideoTime);
    }

    // Run the filter when the page loads or updates
    const observer = new MutationObserver(enableGaplessPlayback);
    observer.observe(document.body, { childList: true, subtree: true });
    // Initial filter run
    enableGaplessPlayback();
})();
