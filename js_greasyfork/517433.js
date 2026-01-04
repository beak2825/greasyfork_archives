// ==UserScript==
// @name         Google Search Results Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在谷歌搜索网址后面自动加上&num=1000
// @author       pianha
// @match        https://www.google.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517433/Google%20Search%20Results%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/517433/Google%20Search%20Results%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听页面加载事件
    window.addEventListener('load', function() {
        let url = new URL(window.location.href);
        // 无论是否已有num参数，都添加&num=1000
        url.searchParams.set('num', '1000');
        // 检查是否已经添加过参数，避免无限重定向
        if (!window.location.href.includes('&num=1000')) {
            window.location.replace(url.toString());
        }
    });
})(); 
