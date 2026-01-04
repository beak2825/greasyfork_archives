// ==UserScript==
// @name         YouTube Auto Skip Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically skips video ads and closes overlay ads on YouTube
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/532915/YouTube%20Auto%20Skip%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/532915/YouTube%20Auto%20Skip%20Ads.meta.js
// ==/UserScript==pppurpleytvr

(function() {
    'use strict';

    function skipAds() {
        const skipBtn = document.querySelector('.ytp-ad-skip-button.ytp-button');
        if (skipBtn) {
            skipBtn.click();
            console.log("✅ Skipped an ad.");
        }

        const overlayClose = document.querySelector('.ytp-ad-overlay-close-button');
        if (overlayClose) {
            overlayClose.click();
            console.log("❌ Closed overlay ad.");
        }
    }

    setInterval(skipAds, 1000);
})();
