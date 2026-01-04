// ==UserScript==
// @name         京东移动端跳转到电脑端商品页
// @namespace    https://jd.com/
// @version      1.0
// @description  自动将京东移动端商品链接跳转到电脑端链接，方便电脑浏览。
// @match        https://item.m.jd.com/product/*
// @run-at       document-start
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/536454/%E4%BA%AC%E4%B8%9C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E7%AB%AF%E5%95%86%E5%93%81%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/536454/%E4%BA%AC%E4%B8%9C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E7%AB%AF%E5%95%86%E5%93%81%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 从当前 URL 中提取商品 SKU ID
    const match = location.pathname.match(/\/product\/(\d+)\.html/);
    if (match && match[1]) {
        const skuId = match[1];
        const pcUrl = `https://item.jd.com/${skuId}.html`;
        location.replace(pcUrl);
    }
})();
