// ==UserScript==
// @name         Auto Bypass YouTube Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Automatically bypass YouTube ads for uninterrupted video watching.
// @author       joybarmon329620
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494237/Auto%20Bypass%20YouTube%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/494237/Auto%20Bypass%20YouTube%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove YouTube video ads
    function bypassAds() {
        // Check if an ad is present
        var adElement = document.querySelector('.video-ads');
        if (adElement) {
            // Skip the ad by clicking on the skip button or video overlay
            var skipButton = document.querySelector('.ytp-ad-skip-button-container button');
            if (skipButton) {
                skipButton.click();
            } else {
                var overlay = document.querySelector('.ytp-ad-overlay-close-button');
                if (overlay) {
                    overlay.click();
                }
            }
        }
    }

    // Call bypassAds function every 5 seconds to check for ads
    setInterval(bypassAds, 5000);
})();
