// ==UserScript==
// @name         虎扑手机版自动跳转网页版
// @version      1.0
// @description  兼容 Google 搜索链接与 App 分享链接，自动跳转 PC 网页版
// @author       GeBron
// @match        *://m.hupu.com/bbs-share/*
// @match        *://m.hupu.com/bbs/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @run-at       document-start
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/528195/%E8%99%8E%E6%89%91%E6%89%8B%E6%9C%BA%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528195/%E8%99%8E%E6%89%91%E6%89%8B%E6%9C%BA%E7%89%88%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 优化后的正则：
    // 1. (?:bbs-share|bbs) 非捕获组匹配路径
    // 2. (\d+) 捕获纯数字 ID
    // 3. (?:-\d+)? 忽略可能存在的页码（如 -1）
    // 4. (?:\.html)? 关键点：将 .html 设为可选，兼容 Google 搜索页链接
    const pattern = /\/(?:bbs-share|bbs)\/(\d+)(?:-\d+)?(?:\.html)?/;
    const match = location.pathname.match(pattern);

    if (match && match[1]) {
        const postId = match[1];
        const newUrl = `https://bbs.hupu.com/${postId}.html`;
        
        // 使用 replace 替换历史记录，防止回退死循环
        location.replace(newUrl);
    }
})();