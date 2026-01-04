// ==UserScript==
// @name         隐藏github blob页面的header
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Hides the header section of a specific GitHub page.
// @match        https://github.com/*/blob/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515748/%E9%9A%90%E8%97%8Fgithub%20blob%E9%A1%B5%E9%9D%A2%E7%9A%84header.user.js
// @updateURL https://update.greasyfork.org/scripts/515748/%E9%9A%90%E8%97%8Fgithub%20blob%E9%A1%B5%E9%9D%A2%E7%9A%84header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素
    const style = document.createElement('style');
    style.textContent = `
        .AppHeader {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 监听 DOM 变化，处理动态加载的元素
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const appHeaders = document.getElementsByClassName('AppHeader');
            for (let header of appHeaders) {
                header.style.display = 'none';
            }
        });
    });

    // 配置观察选项
    const config = {
        childList: true,
        subtree: true
    };

    // 开始观察文档变化
    observer.observe(document.body, config);
})();