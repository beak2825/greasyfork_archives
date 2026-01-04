// ==UserScript==
// @name         DexScreener Auto Expand
// @namespace    https://dexscreener.com/
// @version      2024-02-25
// @description  Dexscreener Auto Expand
// @author       You
// @match        https://dexscreener.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dexscreener.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488288/DexScreener%20Auto%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/488288/DexScreener%20Auto%20Expand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时器，每秒执行一次
    setInterval(function() {
        // 定位按钮
        var button = document.evaluate('//*[@id="root"]/div/nav/div[3]/div[2]/div/div[1]/div[1]/button[2]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
        // 检查按钮是否存在以及标题属性是否匹配
        if (button && button.getAttribute('title') === 'Expand watchlist') {
            button.click(); // 点击按钮
        }
    }, 1000); // 每1000毫秒（1秒）执行一次
})();

