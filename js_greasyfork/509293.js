// ==UserScript==
// @name         YouTube Ad Remover and Auto-Resume
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove ads from YouTube and resume video playback immediately
// @author       Your Name
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509293/YouTube%20Ad%20Remover%20and%20Auto-Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/509293/YouTube%20Ad%20Remover%20and%20Auto-Resume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements
    function hideElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    }

    // Remove ads and resume video
    const removeAdsAndResume = () => {
        const adOverlay = document.querySelector('.ytp-ad-overlay-container');
        const adPlayerOverlay = document.querySelector('.ytp-ad-player-overlay');

        // Remove ad overlays
        if (adOverlay || adPlayerOverlay) {
            if (adPlayerOverlay) {
                // Pause the video
                const video = document.querySelector('video');
                if (video) {
                    video.pause();
                    const currentTime = video.currentTime;

                    // Remove ads
                    hideElement('.ytp-ad-overlay-container');
                    hideElement('.ytp-ad-player-overlay');

                    // Resume video
                    video.currentTime = currentTime;
                    video.play();
                }
            } else {
                hideElement('.ytp-ad-overlay-container');
                hideElement('.ytp-ad-player-overlay');
            }
        }
    };

    // Observe DOM changes to remove ads dynamically
    const observer = new MutationObserver(removeAdsAndResume);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run on page load
    window.addEventListener('load', removeAdsAndResume);
})();
