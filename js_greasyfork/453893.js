// ==UserScript==
// @name         百度搜索引擎推广参数移除
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description 屏蔽百度搜索引擎推广参数
// @author       捈荼
// @license Apache License 2.0
// @match        https://www.baidu.com/s?*tn=*
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/453893/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%8E%A8%E5%B9%BF%E5%8F%82%E6%95%B0%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/453893/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%8E%A8%E5%B9%BF%E5%8F%82%E6%95%B0%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

// commented by ChatGPT

(function () {
    "use strict";

    // Stop the loading of the current page
    window.stop();
    // Replace the "tn" parameter and its value in the URL with an empty string
    document.location.href = document.location.href.replace(/(tn=[^&]*&)|(&tn=[^&]*)/g, '');
})();