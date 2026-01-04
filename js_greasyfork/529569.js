// ==UserScript==
// @name         Bing-去除红色标记，改蓝链
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除搜索结果中的strong标记，将字体改成蓝色#4773e0
// @author       kang
// @license MIT
// @match        https://*.bing.com/*
// @icon         https://img.icons8.com/?size=64&id=C5vHoF1T9Sqf&format=png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529569/Bing-%E5%8E%BB%E9%99%A4%E7%BA%A2%E8%89%B2%E6%A0%87%E8%AE%B0%EF%BC%8C%E6%94%B9%E8%93%9D%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/529569/Bing-%E5%8E%BB%E9%99%A4%E7%BA%A2%E8%89%B2%E6%A0%87%E8%AE%B0%EF%BC%8C%E6%94%B9%E8%93%9D%E9%93%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 强制所有链接为蓝色
    const forceBlueLinks = () => {
        const style = document.createElement('style');
        style.textContent = `
            #b_results a, .b_algo a {
                color: #4773e0 !important;
                text-decoration-color: #4773e0 !important;
            }
            strong[style*="red"], /* 兼容旧版红标 */
            em { /* 去除斜体强调 */
                color: inherit !important;
                font-style: normal !important;
            }
        `;
        document.head.appendChild(style);
    };

    // 执行函数
    forceBlueLinks();

    // 动态内容监控
    new MutationObserver(() => {
    }).observe(document, { subtree: true, childList: true });

//------------------------------------------------------------------

     // 配置参数
    const SELECTORS = {
        linkContainer: 'h2 > a[href]',  // 链接容器选择器
        targetTag: 'strong'             // 需要移除的标签
    };

    // 主处理函数
    const removeStrongTags = () => {
        const links = document.querySelectorAll(SELECTORS.linkContainer);
        links.forEach(a => {
            const regex = new RegExp(`</?${SELECTORS.targetTag}>`, 'gi');
            a.innerHTML = a.innerHTML.replace(regex, '');
        });
    };

    // 初始处理
    removeStrongTags();

    // 动态内容处理（使用防抖优化性能）
    let timeout;
    const observer = new MutationObserver(mutations => {
        clearTimeout(timeout);
        timeout = setTimeout(removeStrongTags, 300);
    });

    // 监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();