// ==UserScript==
// @name         微博帖子强制新标签页打开（支持无限滚动）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  强制微博所有链接（包括滚动加载的内容）在新标签页打开
// @author       ziyouzhiyi
// @match        *://weibo.com/*
// @match        *://*.weibo.com/*
// @icon         https://www.weibo.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535015/%E5%BE%AE%E5%8D%9A%E5%B8%96%E5%AD%90%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E6%94%AF%E6%8C%81%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535015/%E5%BE%AE%E5%8D%9A%E5%B8%96%E5%AD%90%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E6%94%AF%E6%8C%81%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加视觉提示（可选）
    GM_addStyle(`
        a[target="_blank"]:after {
            content: " ↗";
            color: #ff6b81;
            font-size: 0.8em;
        }
    `);

    // 处理所有符合条件的链接
    function processLinks() {
        document.querySelectorAll('a[href^="http"]:not([target="_blank"])').forEach(link => {
            // 排除特殊情况（如微博的JS按钮）
            if (link.classList.contains('ignore-new-tab') || link.href.includes('javascript:')) {
                return;
            }
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // 强制拦截点击事件（关键！）
    function handleClick(event) {
        const link = event.target.closest('a[href^="http"]');
        if (link && link.getAttribute('target') === '_blank') {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation(); // 阻止其他监听器
            window.open(link.href, '_blank');
        }
    }

    // 初始化
    function init() {
        processLinks();
        document.addEventListener('click', handleClick, true); // 捕获阶段拦截

        // 高性能的MutationObserver配置
        const observer = new MutationObserver(function(mutations) {
            let needsProcess = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) needsProcess = true;
            });
            if (needsProcess) processLinks();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // 智能启动（页面加载完成后或直接运行）
    if (document.readyState === 'complete') {
        setTimeout(init, 1500);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1500));
    }
})();