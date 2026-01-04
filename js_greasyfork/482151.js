// ==UserScript==
// @name         恢复 Bing 的平滑滚动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bing 通过代码对 document.body 的 wheel 事件 preventDefault，再 window.scrollBy 来滚动规避平滑滚动，此脚本禁止 document.body 添加 wheel 事件，从而恢复 Bing 的平滑滚动。
// @author       Ganlv
// @match        https://cn.bing.com/search*
// @icon         https://cn.bing.com/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482151/%E6%81%A2%E5%A4%8D%20Bing%20%E7%9A%84%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482151/%E6%81%A2%E5%A4%8D%20Bing%20%E7%9A%84%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://cn.bing.com/rp/PlrO1RtL8nfFK8jh0CYhnDweJq0.br.js
    // https://cn.bing.com/rp/pJ_uqq16yjPWj6aeSkVcULsMM7M.br.js
    const addEventListener = document.body.addEventListener.bind(document.body);
    document.body.addEventListener = (...args) => {
        if (args.length > 0 && args[0] === 'wheel') {
            console.log('恢复 Bing 的平滑滚动');
            return;
        }
        addEventListener(...args);
    }
})();