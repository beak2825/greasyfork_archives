// ==UserScript==
// @name         iThome Mobile to Desktop Redirect
// @namespace    github.com/awdrgyj8
// @version      1.1
// @description  將 iThome 行動版網址自動轉換為電腦版網址
// @author       Zhenyuan
// @match        https://ithelp.ithome.com.tw/m/*
// @run-at       document-start
// @noframes     true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536501/iThome%20Mobile%20to%20Desktop%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/536501/iThome%20Mobile%20to%20Desktop%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 停止頁面載入，加速重定向
    window.stop();

    // 目前的網址
    const currentUrl = window.location.href;
    const currentHost = window.location.host;

    // 修正：使用正確的 includes() 方法檢查字符串
    if (currentUrl.includes('questions')) {
        // 問題頁面的特殊處理
        window.location.replace('https://' + currentHost);
    } else {
        // 其他頁面：移除 '/m' 部分
        const desktopUrl = currentUrl.replace('/m/', '/');
        window.location.replace(desktopUrl);
    }
})();
