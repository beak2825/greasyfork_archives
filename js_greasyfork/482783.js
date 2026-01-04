// ==UserScript==
// @name         youtube自动跳过广告
// @namespace    https://t.me/redlou123
// @version      2023-12-21-1
// @description  none
// @author       redlou123
// @match        *://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482783/youtube%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/482783/youtube%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function skipAd() {
        var skipButton = document.querySelector('.ytp-ad-text.ytp-ad-skip-button-text-centered.ytp-ad-skip-button-text');
        if (skipButton) {
            skipButton.click();
        }
    }

    var timer = setInterval(skipAd, 1000);

    // Your code here...
})();