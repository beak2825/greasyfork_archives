// ==UserScript==
// @name         手机版京东跳转电脑
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  访问到手机版京东时重定向到电脑版并去除跟踪参数
// @author       JSSM
// @match        *://*.item.m.jd.com/product/*.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496857/%E6%89%8B%E6%9C%BA%E7%89%88%E4%BA%AC%E4%B8%9C%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91.user.js
// @updateURL https://update.greasyfork.org/scripts/496857/%E6%89%8B%E6%9C%BA%E7%89%88%E4%BA%AC%E4%B8%9C%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当页面加载完成后执行重定向
    window.onload = function() {
        // 提取当前URL中的商品ID
        var currentUrl = window.location.href;
        var itemIdMatch = currentUrl.match(/product\/([^/]+)\.html/i);

        if (itemIdMatch && itemIdMatch[1]) {
            // 构造新的标准JD商品页面URL
            var itemId = itemIdMatch[1];
            var newUrl = 'https://item.jd.com/' + itemId + '.html';

            // 执行重定向
            window.location.href = newUrl;
        }
    };
})();