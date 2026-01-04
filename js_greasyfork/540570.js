// ==UserScript==
// @name         ChatGPT GPT项目列表滚动条修复
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给 GPT 项目列表添加滚动条，解决项目过多时无法滚动的问题
// @match        https://chatgpt.com/g/*/project*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540570/ChatGPT%20GPT%E9%A1%B9%E7%9B%AE%E5%88%97%E8%A1%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/540570/ChatGPT%20GPT%E9%A1%B9%E7%9B%AE%E5%88%97%E8%A1%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STYLE_CSS = `
    div.mt-6.mb-14.contain-inline-size {
        overflow-y: auto !important;
        max-height: 60vh !important; /* 使用视口高度，兼容更多屏幕 */
        scroll-behavior: smooth;
    }`;

    // 注入样式
    const style = document.createElement('style');
    style.textContent = STYLE_CSS;
    document.head.appendChild(style);

    // 可选：触发一次 scrollTop 以激活浏览器对 overflow 的识别
    const scrollFix = () => {
        const el = document.querySelector('div.mt-6.mb-14.contain-inline-size');
        if (el) el.scrollTop = 1;
    };

    window.addEventListener('load', () => setTimeout(scrollFix, 1000));

    const observer = new MutationObserver(scrollFix);
    observer.observe(document.body, { childList: true, subtree: true });
})();
