// ==UserScript==
// @name           手电大家谈重定向
// @namespace      sqliuchang
// @version        0.3
// @author         sqliuchang
// @description    重定向手电大家谈相关域名 (包括 shoudian.org 的所有子域名) 至 www.shoudian.org
// @match          *://shoudian.org/*
// @match          *://*.shoudianbbs.com/*
// @match          *://*.shoudianbbs.org/*
// @match          *://*.shoudian.org/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/448517/%E6%89%8B%E7%94%B5%E5%A4%A7%E5%AE%B6%E8%B0%88%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448517/%E6%89%8B%E7%94%B5%E5%A4%A7%E5%AE%B6%E8%B0%88%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHost = window.location.hostname;
    const targetHost = "www.shoudian.org";


    if (currentHost !== targetHost) {
        const newUrl = window.location.protocol + "//" + targetHost + window.location.pathname + window.location.search + window.location.hash;

        console.log(`Shoudian Redirect: Redirecting from ${window.location.href} to ${newUrl}`);
        window.location.replace(newUrl);
    }
})();