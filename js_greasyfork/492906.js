// ==UserScript==
// @name         知乎暗色模式
// @namespace    http://tampermonkey.net/
// @version      2024-04-16
// @description  自动打开知乎夜间模式
// @author       You
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492906/%E7%9F%A5%E4%B9%8E%E6%9A%97%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/492906/%E7%9F%A5%E4%B9%8E%E6%9A%97%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var urlObj = new URL(location.href);
    var url = urlObj.href
    // 当前url后缀不带有开启darkMode参数而且当前页面主题不为darkMode
    if(!url.endsWith("?theme=dark") && document.documentElement.getAttribute('data-theme') !== 'dark') {
        url = url + "?theme=dark";
        // 停止加载当前页面
        window.stop();
        // 从当前页面会转为新页面
        window.location.href = url;
    }
})();