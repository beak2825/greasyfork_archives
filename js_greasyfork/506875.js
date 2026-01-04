// ==UserScript==
// @name         GitHub 在新标签页中打开链接
// @namespace    http://example.com/your-namespace
// @version      1.0
// @description  默认在新标签页中打开所有 GitHub 链接
// @author       YuChujiu
// @match        https://github.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506875/GitHub%20%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/506875/GitHub%20%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数，将所有链接设置为在新标签页中打开
    function openLinksInNewTab() {
        document.querySelectorAll('a').forEach(function(link) {
            // 如果链接没有设置 target 属性，则设置 target="_blank"
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
        });
    }

    // 页面加载时立即执行该函数
    openLinksInNewTab();

    // 使用 MutationObserver 监听页面的变化（处理 GitHub 动态加载的内容）
    const observer = new MutationObserver(openLinksInNewTab);

    // 监控整个页面的变化，子节点和嵌套子节点的变化都会触发
    observer.observe(document.body, { childList: true, subtree: true });

})();
