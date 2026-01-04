// ==UserScript==
// @name              jd-m URL 重定向
// @name:en           jd-m URL redirector
// @name:zh-TW        jd-m 網址重新導向
// @namespace         http://tampermonkey.net/
// @version           0.1
// @description       自动将类似 item.m.jd.com 的 URL 转换为 jd.com (包括 URL 参数)
// @description:en    Redirect URLs like item.m.jd.com to jd.com (including url arguments)
// @description:zh-TW 自動將類似 item.m.jd.com 的網址轉換為 jd.com (包含網址參數)
// @author            はなちゃん with help by Bing Copilot
// @match             *://item.m.jd.com/*
// @grant             none
// @license           MIT

// @downloadURL https://update.greasyfork.org/scripts/498834/jd-m%20URL%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/498834/jd-m%20URL%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to redirect URLs
    function redirectUrls() {
        // Redirect current window URL
        if (window.location.href.includes("item.m.jd.com/product")) {
            window.location.href = window.location.href.replace("item.m.jd.com/product", "item.jd.com");
        }

        // Redirect URLs in href of a tags
        document.querySelectorAll('a').forEach(a => {
            if (a.href.includes("acg.tv/sm")) {
                a.href = a.href.replace("acg.tv/sm", "nicovideo.jp/watch/sm");
            }
        });
    }

    // Call the function initially
    redirectUrls();

    // Call the function 1s later, for later-render page.
    setInterval(() => { redirectUrls(); }, 1000);
})();