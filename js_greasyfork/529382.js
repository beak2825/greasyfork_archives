// ==UserScript==
// @name         TikTok AutoPlay & Next Video
// @namespace    https://www.tiktok.com/
// @version      0.6
// @description  Automatically plays TikTok videos and scrolls to the next one after it finishes.
// @author       MumuAlpaka
// @match        *://www.tiktok.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529382/TikTok%20AutoPlay%20%20Next%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/529382/TikTok%20AutoPlay%20%20Next%20Video.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function autoplayNextVideo() {
        const video = document.querySelector('video');

        if (!video) return;

        video.onended = () => {
            console.log('Video ended. Moving to next...');
            const nextButton = document.querySelector('[data-e2e="arrow-right"]');

            if (nextButton) {
                nextButton.click(); // Click next video button
            } else {
                window.scrollBy(0, window.innerHeight); // Scroll down (alternative method)
            }
        };
    }

    function waitForVideo() {
        const observer = new MutationObserver(() => {
            autoplayNextVideo();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForVideo();
})();
