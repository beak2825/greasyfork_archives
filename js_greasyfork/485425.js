// ==UserScript==
// @name         B站插件提示删除
// @namespace    http://tampermonkey.net/
// @version      2024-01-18
// @description  用于删除使用插件后b站顶部出现的提示横幅
// @author       You
// @license      MIT
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485425/B%E7%AB%99%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/485425/B%E7%AB%99%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除 adblock-tips div
    const removeAdblockTips = () => {
        const adblockTipsDiv = document.querySelector('.adblock-tips');
        if (adblockTipsDiv) {
            adblockTipsDiv.remove();
        }
    };

    // 监听整个文档的变化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                removeAdblockTips();
            }
        }
    });

    // 在页面加载完成后删除 adblock-tips div
    window.addEventListener('load', () => {
        removeAdblockTips();
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();