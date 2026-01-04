// ==UserScript==
// @name         自动跳过YouTube广告
// @namespace    youtube
// @version      1.0
// @description  在YouTube网页上自动跳过广告
// @author       Joey Gambler
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479976/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87YouTube%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/479976/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87YouTube%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function skipAd() {
        var skipButton = document.querySelector('.ytp-ad-text.ytp-ad-skip-button-text');
        if (skipButton) {
            skipButton.click();
            console.log("Click button");
        }
    }

    // 设置检测时间间隔
    var timer = setInterval(skipAd, 200); // 1000毫秒 = 1秒
})();