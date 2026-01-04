// ==UserScript==
// @name         手机虎扑内容自动跳转网页版
// @version      0.4
// @description  手机虎扑hupu内容自动跳转网页版
// @author       GeBron
// @match        *://m.hupu.com/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @grant        none
// @namespace    http://tampermonkey.net/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528195/%E6%89%8B%E6%9C%BA%E8%99%8E%E6%89%91%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528195/%E6%89%8B%E6%9C%BA%E8%99%8E%E6%89%91%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href;

    // 匹配 m.hupu.com 的链接，并捕获帖子 ID（去掉 -数字 部分）
    var pattern = /https:\/\/m\.hupu\.com\/(bbs-share|bbs)\/(\d+)(?:-\d+)?(\.html)/;
    var match = url.match(pattern);

    if (match) {
        // 组合成电脑版链接（去掉 -数字 部分，跳转到第一页）
        var newUrl = `https://bbs.hupu.com/${match[2]}${match[3]}`;
        location.href = newUrl;
    }
})();