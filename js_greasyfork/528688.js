// ==UserScript==
// @name         洛谷讨论区重定向到 lglg.top
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  洛谷讨论区链接重定向到 lglg.top
// @author       songge888
// @match        https://www.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528688/%E6%B4%9B%E8%B0%B7%E8%AE%A8%E8%AE%BA%E5%8C%BA%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20lglgtop.user.js
// @updateURL https://update.greasyfork.org/scripts/528688/%E6%B4%9B%E8%B0%B7%E8%AE%A8%E8%AE%BA%E5%8C%BA%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20lglgtop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndRedirect() {
        let currentUrl = window.location.href;
        if (currentUrl.startsWith('https://www.luogu.com.cn/discuss/')) {
            let newUrl = currentUrl.replace('https://www.luogu.com.cn/discuss/', 'https://lglg.top/');
            if (currentUrl !== newUrl) { // 避免重复重定向
                window.location.replace(newUrl);
            }
        }
    }

    checkAndRedirect();

    let lastUrl = window.location.href;
    new MutationObserver(() => {
        let currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkAndRedirect();
        }
    }).observe(document, { subtree: true, childList: true });
})();