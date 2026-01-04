// ==UserScript==
// @name         屏蔽YouTube手机版主页Shorts
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  仅屏蔽YouTube手机版主页上的Shorts视频，保留其他页面及菜单、标签、导航栏等入口
// @author       你
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535004/%E5%B1%8F%E8%94%BDYouTube%E6%89%8B%E6%9C%BA%E7%89%88%E4%B8%BB%E9%A1%B5Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/535004/%E5%B1%8F%E8%94%BDYouTube%E6%89%8B%E6%9C%BA%E7%89%88%E4%B8%BB%E9%A1%B5Shorts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let debounceTimer = null;
    let observer = null;

    // 检查是否为主页
    function isHomePage() {
        const path = window.location.pathname;
        return path === '/' || path.startsWith('/feed/');
    }

    // 初始化 MutationObserver
    function initObserver() {
        if (observer) {
            observer.disconnect();
        }
        const target = document.querySelector('#contents') || document.body;
        observer = new MutationObserver(() => {
            if (!isHomePage()) return;
            if (debounceTimer) cancelAnimationFrame(debounceTimer);
            debounceTimer = requestAnimationFrame(hideShorts);
        });
        observer.observe(target, { childList: true, subtree: true });
    }

    // 隐藏主页 Shorts 视频
    function hideShorts() {
        if (!isHomePage()) return;
        const shortsLinks = document.querySelectorAll('a[href^="/shorts/"]');
        shortsLinks.forEach(link => {
            if (!link) return;
            // 针对主页的容器选择
            let container = link.closest('ytd-rich-item-renderer, ytm-rich-item-renderer, ytm-compact-video-renderer');
            if (!container) {
                container = findHideableContainer(link);
            }
            if (container && !container.dataset.hiddenByScript) {
                container.style.display = 'none';
                container.dataset.hiddenByScript = 'true';
            }
        });
    }

    // 查找可隐藏的父容器
    function findHideableContainer(element) {
        while (element && element !== document.body) {
            if (
                element.tagName.startsWith('YTD-') ||
                element.tagName.startsWith('YTM-') ||
                element.classList.contains('rich-item-renderer') ||
                element.classList.contains('compact-video-renderer')
            ) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

    // 处理 SPA 导航
    function handleNavigation() {
        initObserver();
        hideShorts();
    }

    // 监听 URL 变化
    window.addEventListener('popstate', handleNavigation);
    let lastPath = window.location.pathname;
    setInterval(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== lastPath) {
            lastPath = currentPath;
            handleNavigation();
        }
    }, 500);

    // 清理资源
    window.addEventListener('unload', () => {
        if (observer) observer.disconnect();
    });

    // 初次执行
    initObserver();
    hideShorts();
})();