// ==UserScript==
// @name         Nhentai 錯誤自動解決
// @version      1.1
// @description  自動解決 nhentai.net 網頁上顯示的 "403 – CSRF Token Invalid" 或 "429 Too Many Requests" 或 "404 – Not Found" 錯誤。(此腳本由ChatGPT協助撰寫)
// @author       特務E04
// @match        https://nhentai.net/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @noframes
// @supportURL   https://github.com/jmsch23280866/Nhentai-403-404-429-automate/issues
// @license      MIT
// @namespace    https://github.com/jmsch23280866
// @downloadURL https://update.greasyfork.org/scripts/518227/Nhentai%20%E9%8C%AF%E8%AA%A4%E8%87%AA%E5%8B%95%E8%A7%A3%E6%B1%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/518227/Nhentai%20%E9%8C%AF%E8%AA%A4%E8%87%AA%E5%8B%95%E8%A7%A3%E6%B1%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查網頁是否顯示 "403 – CSRF Token Invalid" 或 "ERR_CACHE_MISS"
    function checkFor403OrCacheMiss() {
        if ($('body:contains("403 – CSRF Token Invalid")').length > 0 || $('body:contains("ERR_CACHE_MISS")').length > 0) {
            console.log("偵測到 403 – CSRF Token Invalid 或 ERR_CACHE_MISS，2 秒後將 URL 從 https 更改為 http...");
            setTimeout(function() {
                let newUrl = window.location.href.replace(/^https:/, 'http:');
                window.location.href = newUrl; // 將網址中的 https 改為 http 並重新載入
            }, 2000); // 2秒後修改網址並重新載入
        }
    }

    // 檢查網頁是否顯示 "429 Too Many Requests"
    function checkFor429() {
        if ($('body:contains("429 Too Many Requests")').length > 0) {
            console.log("偵測到 429 Too Many Requests，2 秒後重新整理...");
            setTimeout(function() {
                location.reload(); // 普通重新整理
            }, 2000); // 2秒後重新整理
        }
    }

    // 檢查網頁是否顯示 "404 – Not Found"
    function checkFor404() {
        if ($('body:contains("404 – Not Found")').length > 0) {
            console.log("偵測到 404 – Not Found，2 秒後將重定向到 Web Archive...");
            setTimeout(function() {
                let currentUrl = window.location.href;
                let archiveUrl = 'https://web.archive.org/web/' + currentUrl;
                window.location.href = archiveUrl; // 跳轉到 Web Archive 的對應頁面
            }, 2000); // 2秒後跳轉
        }
    }

    // 當頁面載入完成後檢查一次
    document.addEventListener('DOMContentLoaded', function() {
        checkFor403OrCacheMiss();
        checkFor429();
        checkFor404();
    });
})();
