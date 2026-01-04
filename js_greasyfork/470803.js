// ==UserScript==
// @name         動畫瘋自動點擊彈幕設定
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在進入網頁時自動點擊彈幕設定按鈕
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470803/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%BD%88%E5%B9%95%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/470803/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%BD%88%E5%B9%95%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查 localStorage 中是否已經記錄過是否點擊過彈幕設定按鈕
    if (!localStorage.getItem('danmuSettingClicked')) {
        // 檢查是否有彈幕設定按鈕
        const danmuSettingButton = document.querySelector('#setting-danmu a');
        if (danmuSettingButton) {
            // 點擊彈幕設定按鈕
            danmuSettingButton.click();
            // 將點擊記錄存入 localStorage
            localStorage.setItem('danmuSettingClicked', true);
        }
    }
})();