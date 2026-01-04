// ==UserScript==
// @name         EU4CN wiki 强制使用简体中文
// @namespace    https://greasyfork.org/zh-CN
// @version      1.1
// @description  把 www.eu4cn.com 网站的页面的重定向，替换 url 中的 /zh-tw/、/zh-hk/ 和 /wiki/ 替换为 /zh/
// @match        https://www.eu4cn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487434/EU4CN%20wiki%20%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/487434/EU4CN%20wiki%20%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 url
    var url = window.location.href;

    // 如果 url 中包含 /zh-tw/ 、/zh-hk/ 或 /wiki/，则替换为 /zh/ 并重新加载页面
    if (url.includes("/zh-tw/") || url.includes("/wiki/")|| url.includes("/zh-hk/") ) {
        url = url.replace("/zh-tw/", "/zh/").replace("/wiki/", "/zh/").replace("/zh-hk/", "/zh/");
        window.location.href = url;
    }
})();
