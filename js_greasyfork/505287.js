// ==UserScript==
// @name         北邮邮大师学号隐藏
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Hide specific elements on the page
// @author       cactus
// @match        https://umaster.bupt.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505287/%E5%8C%97%E9%82%AE%E9%82%AE%E5%A4%A7%E5%B8%88%E5%AD%A6%E5%8F%B7%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/505287/%E5%8C%97%E9%82%AE%E9%82%AE%E5%A4%A7%E5%B8%88%E5%AD%A6%E5%8F%B7%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function hideElement() {
        const elementToHide = document.querySelector("#app > div.h-full.w-full.flex.md\\:flex-row.flex-col-reverse > div > div > div > div.w-full.flex-1.min-h-0 > div > div:nth-child(2)")
        if (elementToHide) {
            elementToHide.setAttribute('hidden', 'true');
        }
    }

    // 确保脚本在页面完全加载完成后运行
    window.addEventListener('load', function() {
        hideElement();

        // 监控 DOM 变化
        const observer = new MutationObserver(() => {
            hideElement();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();