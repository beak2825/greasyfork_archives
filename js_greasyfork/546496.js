// ==UserScript==
// @name         网页归档
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取当前页面 URL 并归档到 Archive.is 
// @author       点灯
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546496/%E7%BD%91%E9%A1%B5%E5%BD%92%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/546496/%E7%BD%91%E9%A1%B5%E5%BD%92%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建菜单命令
    GM_registerMenuCommand("归档到 Archive.is ", function() {
        // 获取当前页面的 URL
        var currentUrl = window.location.href;
        
        // 构造 Archive.is 提交页面的 URL
        var archiveUrl = "https://archive.is/submit/?url=" + encodeURIComponent(currentUrl);
        
        // 跳转到 Archive.is 提交页面
        window.location.href = archiveUrl;
    });
})();
