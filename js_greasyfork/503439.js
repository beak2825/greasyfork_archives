// ==UserScript==
// @name         大众点评跳转至电脑版
// @namespace    polonium.dianpingtopc
// @version      0.1
// @description  微信上大众点评分享的店直接点进去是手机版网页，这个可以跳转到电脑版
// @author       chemPolonium
// @include      http*://m.dianping.com/*
// @run-at       document-start
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/503439/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E8%B7%B3%E8%BD%AC%E8%87%B3%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/503439/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E8%B7%B3%E8%BD%AC%E8%87%B3%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let replacedUrl = document.URL;

    replacedUrl = replacedUrl.replace(/m\.dianping\.com\/shopshare\/([a-zA-Z0-9]*)\?.*/, 'www.dianping.com/shop/$1');

    if (replacedUrl !== document.URL) {
        window.location = replacedUrl;
    }
})();