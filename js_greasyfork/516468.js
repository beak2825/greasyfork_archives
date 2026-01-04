// ==UserScript==
// @name         Chiphell 隐藏勋章
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏 Chiphell 网站上的用户勋章
// @author       YourName
// @match        https://www.chiphell.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516468/Chiphell%20%E9%9A%90%E8%97%8F%E5%8B%8B%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/516468/Chiphell%20%E9%9A%90%E8%97%8F%E5%8B%8B%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 CSS 样式插入的方法隐藏所有 'md_ctrl' 类的元素
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'p.md_ctrl { display: none; }';
    document.head.appendChild(style);

    console.log('初始加载完成，已隐藏元素');

    // 监测 DOM 变化以隐藏动态加载的元素
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.matches('p.md_ctrl')) {
                    node.style.display = 'none';
                    console.log('隐藏新的勋章元素');
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
