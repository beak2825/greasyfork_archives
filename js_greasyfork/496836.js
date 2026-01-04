// ==UserScript==
// @name         南+ 手机版网页自动跳转到电脑版网页
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  Click a specific link of South-Plus
// @author       me
// @match        *://*.east-plus.net/simple/*
// @match        *://east-plus.net/simple/*
// @match        *://*.south-plus.net/simple/*
// @match        *://south-plus.net/simple/*
// @match        *://*.south-plus.org/simple/*
// @match        *://south-plus.org/simple/*
// @match        *://*.white-plus.net/simple/*
// @match        *://white-plus.net/simple/*
// @match        *://*.north-plus.net/simple/*
// @match        *://north-plus.net/simple/*
// @match        *://*.level-plus.net/simple/*
// @match        *://level-plus.net/simple/*
// @match        *://*.soul-plus.net/simple/*
// @match        *://soul-plus.net/simple/*
// @match        *://*.snow-plus.net/simple/*
// @match        *://snow-plus.net/simple/*
// @match        *://*.spring-plus.net/simple/*
// @match        *://spring-plus.net/simple/*
// @match        *://*.summer-plus.net/simple/*
// @match        *://summer-plus.net/simple/*
// @match        *://*.blue-plus.net/simple/*
// @match        *://blue-plus.net/simple/*
// @match        *://*.imoutolove.me/simple/*
// @match        *://imoutolove.me/simple/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496836/%E5%8D%97%2B%20%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E7%89%88%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/496836/%E5%8D%97%2B%20%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E7%89%88%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用正则表达式选中超链接
    var links = Array.from(document.querySelectorAll('a')).filter(a => a.href.match(/read\.php\?tid=\d+/));
    // 模拟点击事件
    if (links.length > 0) {
        links[0].click();
        // 关闭网页
        window.close();
    }
})();