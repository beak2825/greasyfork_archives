// ==UserScript==
// @name         B站稍后再看跳转普通视频页的简单实现
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  自动从稍后再看列表跳转到实际视频页面
// @match        *://www.bilibili.com/list/watchlater*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526620/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%B7%B3%E8%BD%AC%E6%99%AE%E9%80%9A%E8%A7%86%E9%A2%91%E9%A1%B5%E7%9A%84%E7%AE%80%E5%8D%95%E5%AE%9E%E7%8E%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/526620/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%B7%B3%E8%BD%AC%E6%99%AE%E9%80%9A%E8%A7%86%E9%A2%91%E9%A1%B5%E7%9A%84%E7%AE%80%E5%8D%95%E5%AE%9E%E7%8E%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const bvid = urlParams.get('bvid');

    // 如果存在bvid参数且当前路径符合要求
    if (bvid && window.location.pathname.startsWith('/list/watchlater')) {
        // 构建新URL并立即跳转
        const newUrl = `https://www.bilibili.com/video/${bvid}/`;
        window.location.replace(newUrl); // 使用replace避免历史记录残留
    }
})();