// ==UserScript==
// @name         京东移动端界面跳转到PC版页面
// @namespace    UTsNamespace
// @version      1.5.6
// @description  访问移动版京东页面时,自动转到对应的PC版页面
// @author       UTwelve
// @license      MIT
// @icon         https://www.jd.com/favicon.ico
// @match        *://item.m.jd.com/*
// @match        *://item.jd.com/*
// @run-at       document-start
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/528770/%E4%BA%AC%E4%B8%9C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%95%8C%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0PC%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/528770/%E4%BA%AC%E4%B8%9C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%95%8C%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0PC%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查是否为移动端商品页面
    const isMobileProductPage = (url) => /item\.m\.jd\.com\/product\/(\d+)\.html/.test(url);

    // 转换为PC端商品页面URL
    const toPCUrl = (url) => url.replace(/item\.m\.jd\.com\/product\/(\d+)\.html.*/, "item.jd.com/$1.html");

    // 当前页面URL
    const currentUrl = location.href;

    // 如果是移动端商品页面，跳转到PC端页面
    if (isMobileProductPage(currentUrl)) {
        const pcUrl = toPCUrl(currentUrl);
        if (pcUrl !== currentUrl) location.replace(pcUrl);
    }
})();