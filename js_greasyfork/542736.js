// ==UserScript==
// @name         YouTube Music Seekbar Enhancer
// @namespace    YTMSeekEnhancer
// @version      1.0.0
// @description  Seek 5 seconds forward/backward with mouse wheel over the seekbar in YouTube Music
// @author       Farhan Sakib Socrates
// @match        https://music.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542736/YouTube%20Music%20Seekbar%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/542736/YouTube%20Music%20Seekbar%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SEEK_STEP = 5; // seconds

    function addWheelSeek() {
        const seekbar = document.querySelector('#progress-bar');
        if (!seekbar) return;

        // Avoid adding multiple listeners
        if (seekbar.dataset.wheelSeekAttached) return;
        seekbar.dataset.wheelSeekAttached = "true";

        seekbar.addEventListener('wheel', (e) => {
            e.preventDefault();
            const video = document.querySelector('video');
            if (!video) return;

            // Scroll up = forward, Scroll down = backward
            if (e.deltaY < 0) {
                video.currentTime = Math.min(video.duration, video.currentTime + SEEK_STEP);
            } else {
                video.currentTime = Math.max(0, video.currentTime - SEEK_STEP);
            }
        }, { passive: false });
    }

    // Try attaching repeatedly in case it's not yet rendered
    const observer = new MutationObserver(addWheelSeek);
    observer.observe(document.body, { childList: true, subtree: true });
})();
