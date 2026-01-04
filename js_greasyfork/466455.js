// ==UserScript==
// @name         Lightweight YouTube AdBlock
// @version      1.12
// @description  Blocks ads on YouTube without eating up your resources
// @author       equmaq
// @match        https://www.youtube.com/*
// @license      CC BY
// @namespace https://greasyfork.org/users/990886
// @downloadURL https://update.greasyfork.org/scripts/466455/Lightweight%20YouTube%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/466455/Lightweight%20YouTube%20AdBlock.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to remove video ads
    function removeAds() {
        const adSelectors = [
            '.video-ads',
            '.ytp-ad-module',
            '.ytp-ad-overlay-slot',
            '.ytp-ad-overlay-close-button',
            '.ytp-ad-player-overlay',
            '.ytp-ad-player-overlay-instream-info',
            '.ytp-ad-player-overlay-instream-info-renderer',
            '.ytp-ad-player-overlay-instream-info-renderer-title',
            '.ytp-ad-player-overlay-instream-info-renderer-actions'
        ];

        adSelectors.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => {
                ad.style.display = 'none';
            });
        });
    }

    // Wait for the page to load and remove ads
    window.addEventListener('load', removeAds);
    // Also, listen for AJAX navigation changes and remove ads accordingly
    window.addEventListener('yt-navigate-finish', removeAds);
})();