// ==UserScript==
// @name         申论字数无限制
// @namespace    https://github.com/NPC2000
// @version      1.0.0
// @description  去除粉笔申论输入框字数限制（纯娱乐）
// @author       NPC
// @match        https://www.fenbi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fenbi.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512426/%E7%94%B3%E8%AE%BA%E5%AD%97%E6%95%B0%E6%97%A0%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/512426/%E7%94%B3%E8%AE%BA%E5%AD%97%E6%95%B0%E6%97%A0%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modifyTextareas = () => {
        const textareas = document.querySelectorAll('textarea[maxlength]');
        textareas.forEach(textarea => {
            textarea.setAttribute('maxlength', '9999');
        });
    };

    // 监测 DOM 变化
    const observer = new MutationObserver(modifyTextareas);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行
    modifyTextareas();
})();