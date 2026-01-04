// ==UserScript==
// @name         屏蔽B站擦边推荐-大家围观的直播
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动屏蔽B站页面中class包含pop-live-small-mode的div
// @author       Chatgpt
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517961/%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%93%A6%E8%BE%B9%E6%8E%A8%E8%8D%90-%E5%A4%A7%E5%AE%B6%E5%9B%B4%E8%A7%82%E7%9A%84%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/517961/%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%93%A6%E8%BE%B9%E6%8E%A8%E8%8D%90-%E5%A4%A7%E5%AE%B6%E5%9B%B4%E8%A7%82%E7%9A%84%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义屏蔽函数
    function blockPopLiveDivs() {
        // 获取所有包含 pop-live-small-mode 的元素
        const popLiveDivs = document.querySelectorAll('div.pop-live-small-mode');
        popLiveDivs.forEach(div => {
            div.style.display = 'none'; // 隐藏元素
        });
    }

    // 观察页面变化的 MutationObserver
    const observer = new MutationObserver((mutationsList, observer) => {
        blockPopLiveDivs(); // 页面更新时再次调用
    });

    // 配置 MutationObserver 观察整个 body
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始调用屏蔽函数
    blockPopLiveDivs();
})();
