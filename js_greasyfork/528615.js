// ==UserScript==
// @name        del suno
// @namespace   Violentmonkey Scripts
// @match       https://www.dapenti.com/blog/*
// @grant       none
// @version     1.1
// @author      -
// @description 2025/3/3 15:47:40
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528615/del%20suno.user.js
// @updateURL https://update.greasyfork.org/scripts/528615/del%20suno.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 隐藏包含特定文本的a标签的父元素
    function hideParentElements() {
        const links = document.querySelectorAll('a');
        for (const link of links) {
            if (link.textContent.includes('-suno')) {
                const parent = link.parentElement;
                if (parent) {
                    parent.style.display = 'none'; // 隐藏父元素
                }
            }
        }
    }

    // 初始隐藏
    hideParentElements();

    // 监听DOM变化，动态隐藏
    const observer = new MutationObserver(hideParentElements);
    observer.observe(document.body, { childList: true });
})();