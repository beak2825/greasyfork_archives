// ==UserScript==
// @name         Nhentai.net Errors Automatically resolve
// @name:zh-TW   Nhentai.net 錯誤自動排除
// @name:zh-CN   Nhentai.net 错误自动排除
// @version      1.1
// @description  Automatically resolves "403 - CSRF Token Invalid" or "429 Too Many Requests" or "404 - Not Found" displayed on nhentai.net web pages. (Script assisted by ChatGPT)
// @description:zh-TW  自動解決 nhentai.net 網頁上顯示 "403 – CSRF Token Invalid" 或 "429 Too Many Requests" 或 "404 – Not Found"(此腳本由ChatGPT協助撰寫)
// @description:zh-CN  自动解决 nhentai.net 网页上显示 "403 – CSRF Token Invalid" 或 "429 Too Many Requests" 或 "404 – Not Found"(此脚本由ChatGPT协助撰写)
// @author       特務E04
// @match        https://nhentai.net/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @noframes
// @supportURL   https://github.com/jmsch23280866/Nhentai-403-404-429-automate/issues
// @license      MIT
// @namespace    https://github.com/jmsch23280866
// @downloadURL https://update.greasyfork.org/scripts/497823/Nhentainet%20%E9%8C%AF%E8%AA%A4%E8%87%AA%E5%8B%95%E6%8E%92%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/497823/Nhentainet%20%E9%8C%AF%E8%AA%A4%E8%87%AA%E5%8B%95%E6%8E%92%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查網頁是否顯示 "403 – CSRF Token Invalid" 或 "ERR_CACHE_MISS"
    function checkFor403OrCacheMiss() {
        if ($('body:contains("403 – CSRF Token Invalid")').length > 0 || $('body:contains("ERR_CACHE_MISS")').length > 0) {
            console.log("Detected 403 – CSRF Token Invalid or ERR_CACHE_MISS, changing URL from https to http in 2 seconds...");
            setTimeout(function() {
                let newUrl = window.location.href.replace(/^https:/, 'http:');
                window.location.href = newUrl; // 將網址中的 https 改為 http 並重新加載
            }, 1000); // 1秒後修改網址並重新加載
        }
    }

    // 檢查網頁是否顯示 "429 Too Many Requests"
    function checkFor429() {
        if ($('body:contains("429 Too Many Requests")').length > 0) {
            console.log("Detected 429 Too Many Requests, refreshing in 2 seconds...");
            setTimeout(function() {
                location.reload(); // 普通重新整理
            }, 1000); // 1秒後重新整理
        }
    }

    // 檢查網頁是否顯示 "404 – Not Found"
    function checkFor404() {
        if ($('body:contains("404 – Not Found")').length > 0) {
            console.log("Detected 404 – Not Found, redirecting to Web Archive in 2 seconds...");
            setTimeout(function() {
                let currentUrl = window.location.href;
                let archiveUrl = 'https://web.archive.org/web/' + currentUrl;
                window.location.href = archiveUrl; // 跳轉到 Web Archive 的對應頁面
            }, 1000); // 1秒後跳轉
        }
    }

    // 當頁面加載完成後檢查一次
    document.addEventListener('DOMContentLoaded', function() {
        checkFor403OrCacheMiss();
        checkFor429();
        checkFor404();
    });
})();
