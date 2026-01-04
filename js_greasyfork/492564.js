// ==UserScript==
// @name         Google Search Auto-Redirect / Google 搜尋直接跳轉至目標網頁
// @name:zh-TW   Google 搜尋直接跳轉至目標網頁
// @namespace    https://github.com/jmsch23280866/
// @version      1.2
// @description  This script is used to remove the prefix https://www.google.com/url?q= and direct to the target URL. (Script assisted by ChatGPT)
// @description:zh-TW 此腳本用於刪除前綴https://www.google.com/url?q= 並直接導向目標網址。(此腳本由ChatGPT協助撰寫)
// @author       特務E04
// @match        *://*.google.*
// @noframes
// @supportURL   https://github.com/jmsch23280866/Feeling-Lucky-Redirect/issues
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492564/Google%20%E6%90%9C%E5%B0%8B%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%89%E8%87%B3%E7%9B%AE%E6%A8%99%E7%B6%B2%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/492564/Google%20%E6%90%9C%E5%B0%8B%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%89%E8%87%B3%E7%9B%AE%E6%A8%99%E7%B6%B2%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查當前網址是否包含指定的前段
    if (window.location.href.includes("/url?q=")) {
        // 提取目標網址，去除前綴部分
        var url = window.location.href.split("/url?q=")[1];
        
        // 移除所有 '&' 後的部分，僅保留目標網址
        if (url.includes("&")) {
            url = url.split("&")[0];
        }

        // 解碼網址並進行跳轉
        window.location.replace(decodeURIComponent(url));
    }

    // 處理頁面中的所有鏈接，去除前綴並清理參數
    document.querySelectorAll('a[href*="/url?q="]').forEach(function(link) {
        var originalUrl = link.href.split("/url?q=")[1];

        if (originalUrl.includes("&")) {
            originalUrl = originalUrl.split("&")[0];
        }

        link.href = decodeURIComponent(originalUrl);
    });
})();
