// ==UserScript==
// @name           中文wikipedia移动端重定向
// @namespace      sqliuchang
// @version        0.2
// @author         sqliuchang
// @description    重定向至桌面端
// @match        *://zh.m.wikipedia.org/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/448518/%E4%B8%AD%E6%96%87wikipedia%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448518/%E4%B8%AD%E6%96%87wikipedia%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHost = window.location.hostname;
    const targetHost = "zh.wikipedia.org";


    if (currentHost !== targetHost) {
        const newUrl = window.location.protocol + "//" + targetHost + window.location.pathname + window.location.search + window.location.hash;

        console.log(`Wikipedia Redirect: Redirecting from ${window.location.href} to ${newUrl}`);
        window.location.replace(newUrl);
    }
})();