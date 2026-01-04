// ==UserScript==
// @name         删除阿里云下载界面的无用元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除阿里云下载界面的无用
// @match        *://*.alipan.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523305/%E5%88%A0%E9%99%A4%E9%98%BF%E9%87%8C%E4%BA%91%E4%B8%8B%E8%BD%BD%E7%95%8C%E9%9D%A2%E7%9A%84%E6%97%A0%E7%94%A8%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/523305/%E5%88%A0%E9%99%A4%E9%98%BF%E9%87%8C%E4%BA%91%E4%B8%8B%E8%BD%BD%E7%95%8C%E9%9D%A2%E7%9A%84%E6%97%A0%E7%94%A8%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义删除目标函数
    function removeYellowTip() {
        const yellowTip = document.querySelector('#root > div > div.page--W3d1U > div.share-list-banner--o0-5U');
        if (yellowTip) {
            yellowTip.remove(); // 从 DOM 中直接移除元素
            console.log("黄色提示已删除"); // 输出调试信息
        }
    }

    // 页面加载完成后立即尝试删除
    removeYellowTip();

    // 监听动态加载的情况
    const observer = new MutationObserver(() => {
        removeYellowTip();
    });

    // 监听整个文档的变动
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
