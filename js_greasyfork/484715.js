// ==UserScript==
// @name YouTube移除廣告
// @namespace youtube
// @version 1.0
// @description 免費合法永久有效YouTube廣告移除代碼
// @author 羊羊想睡覺SleepySheep
// @match *://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/484715/YouTube%E7%A7%BB%E9%99%A4%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/484715/YouTube%E7%A7%BB%E9%99%A4%E5%BB%A3%E5%91%8A.meta.js
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

    // 設置檢測時間間隔
    var timer = setInterval(skipAd, 1000); // 1000毫秒 = 1秒
})();

