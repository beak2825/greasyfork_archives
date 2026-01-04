// ==UserScript==
// @name              Niconico URL 重定向
// @name:en           Niconico URL redirector
// @name:zh-TW        Niconico 網址重新導向
// @namespace         http://tampermonkey.net/
// @version           0.1
// @description       自动将类似 acg.tv/sm* 的 URL 转换为 nicovideo.jp/watch/sm* (包括 URL 参数)
// @description:en    Redirect URLs like acg.tv/sm* to nicovideo.jp/watch/sm* (including url arguments)
// @description:zh-TW 自動將類似 acg.tv/sm* 的網址轉換為 nicovideo.jp/watch/sm* (包含網址參數)
// @author            はなちゃん with help by Bing Copilot
// @match             *://*/*
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/489215/Niconico%20URL%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/489215/Niconico%20URL%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to redirect URLs
    function redirectUrls() {
        // Redirect current window URL
        if (window.location.href.includes("acg.tv/sm")) {
            window.location.href = window.location.href.replace("acg.tv/sm", "nicovideo.jp/watch/sm");
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