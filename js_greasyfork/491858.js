// ==UserScript==
// @name         Flutter pub.dev 重定向到镜像站
// @namespace    https://github.com/
// @version      1.1
// @author       Maicarons
// @icon         https://pub.flutter-io.cn/favicon.ico
// @description  Automatically redirect all URLs from pub.dev to pub-web.flutter-io.cn
// @include      *://pub.dev/*
// @grant        none
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/491858/Flutter%20pubdev%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E9%95%9C%E5%83%8F%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/491858/Flutter%20pubdev%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E9%95%9C%E5%83%8F%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalUrl = new URL(window.location.href);
    const newUrl = new URL(originalUrl.pathname.replace(/^\/(.*)$/, '/$1'), 'https://pub-web.flutter-io.cn');

    // 如果原始URL包含查询参数或哈希值，也要转移到新URL上
    if (originalUrl.search) {
        newUrl.search = originalUrl.search;
    }
    if (originalUrl.hash) {
        newUrl.hash = originalUrl.hash;
    }

    window.location.replace(newUrl.href);
})();