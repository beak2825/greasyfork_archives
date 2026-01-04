// ==UserScript==
// @name         AVIF to JPG Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  砍掉b站专栏区图片的avif后缀，访问jpg格式的图源
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470679/AVIF%20to%20JPG%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/470679/AVIF%20to%20JPG%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    var currentUrl = window.location.href;

    // 检查 URL 是否匹配特定模式：*.jpg@*.avif
    var pattern = /(.+)\.jpg@.+\.avif$/;
    if (pattern.test(currentUrl)) {
        // 提取原始 JPG 图片的 URL
        var originalUrl = currentUrl.replace(pattern, '$1.jpg');
        
        // 打开新的页面
        window.location.href = originalUrl;
    }
})();