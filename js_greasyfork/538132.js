// ==UserScript==
// @name         雪球港股自动点击实时行情
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  每秒自动刷新
// @author       daimiaopeng
// @match        https://xueqiu.com/S/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://xueqiu.com&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538132/%E9%9B%AA%E7%90%83%E6%B8%AF%E8%82%A1%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AE%9E%E6%97%B6%E8%A1%8C%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/538132/%E9%9B%AA%E7%90%83%E6%B8%AF%E8%82%A1%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AE%9E%E6%97%B6%E8%A1%8C%E6%83%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function clickRealTimeQuote() {
        const quoteElements = document.querySelectorAll('.stock-refresh');

        for (const el of quoteElements) {
            if (el.textContent.includes("实时行情")) {
                console.log("点击实时行情按钮");
                el.click();
                break;
            }
        }
    }

    window.addEventListener('load', function () {
        // 每秒点击一次
        setInterval(clickRealTimeQuote, 1000);
    });
})();
