// ==UserScript==
// @name         把B站评论区挪到右边，边看视频边看评论
// @namespace    http://tampermonkey.net/
// @version      2025.08.01
// @description  将B站评论区移动到右侧容器
// @author       FruitJellies
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/523728/%E6%8A%8AB%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%8C%AA%E5%88%B0%E5%8F%B3%E8%BE%B9%EF%BC%8C%E8%BE%B9%E7%9C%8B%E8%A7%86%E9%A2%91%E8%BE%B9%E7%9C%8B%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/523728/%E6%8A%8AB%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%8C%AA%E5%88%B0%E5%8F%B3%E8%BE%B9%EF%BC%8C%E8%BE%B9%E7%9C%8B%E8%A7%86%E9%A2%91%E8%BE%B9%E7%9C%8B%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const path = window.location.pathname;

    // 配置对象
    const CONFIG = {
        containerSelector: "#mirror-vdcon > div.right-container",
        playlistContainerSelector: "#mirror-vdcon > div.playlist-container--right",
        commentAppSelector: "#commentapp",
        playlistTargetPositionSelector:"#mirror-vdcon > div.playlist-container--right > div.recommend-list-container",
        targetPositionSelector: ".recommend-list-v1",
        observerConfig: {
            childList: true,
            subtree: true,
            attributes: false
        },
        timeoutDuration: 9999999999, // 999……秒超时
        styleSettings: {
            containerWidth: "23%",
            containerHeight: "110vh",
            hideScrollbar: true // 默认隐藏滚动条
        }
    };

    // 全局变量
    let observer = null;
    let timeoutId = null;
    let isCommentsMoved = false;
    let originalPosition = null;
    let cachedElements = {};

    // 缓存DOM元素
    function getCachedElement(selector) {
        if (!cachedElements[selector]) {
            cachedElements[selector] = document.querySelector(selector);
        }
        return cachedElements[selector];
    }

    // 安全DOM操作
    function safeDOMOperation(operation) {
        try {
            return operation();
        } catch (error) {
            console.error('[BCTR] DOM操作失败:', error);
            return null;
        }
    }

    // 初始化容器样式
    function initContainerStyles() {
            // 从存储中读取用户配置，若无则使用默认值
    const hideScrollbar = GM_getValue('hideScrollbar', CONFIG.styleSettings.hideScrollbar);
        const commonStyles = `
            width: ${CONFIG.styleSettings.containerWidth};
            height: ${CONFIG.styleSettings.containerHeight};
            overflow-y: scroll !important;
            ${hideScrollbar ? 'scrollbar-width: none;' : ''}
            pointer-events: auto !important;
        `;
    // 动态生成滚动条隐藏样式
    const scrollbarStyle = hideScrollbar ? `
        ${CONFIG.playlistContainerSelector}::-webkit-scrollbar,
        ${CONFIG.containerSelector}::-webkit-scrollbar {
            display: none;
        }
    ` : '';
        GM_addStyle(`
            ${CONFIG.playlistContainerSelector}, ${CONFIG.containerSelector} {
                ${commonStyles}
            }
       ${scrollbarStyle}
            body {
                overflow: auto !important;
            }
        `);
    }

    // 处理评论区移动
    function handleCommentsMove() {
        return safeDOMOperation(() => {
            const commentApp = getCachedElement(CONFIG.commentAppSelector);
            const shadowContent = commentApp?.querySelector('bili-comments')?.shadowRoot?.querySelector('#contents');

            const targetPositionSelector = path.startsWith('/list/')
            ? CONFIG.playlistTargetPositionSelector
            : CONFIG.targetPositionSelector;

            const targetPosition = getCachedElement(targetPositionSelector);

            if (!commentApp || !targetPosition || !shadowContent) {
                return false;
            }

            // 保存原始位置
            if (!originalPosition) {
                originalPosition = commentApp.parentNode;
            }

            targetPosition.parentNode.insertBefore(commentApp, targetPosition);
            console.log('[BCTR] 评论区移动成功');
            isCommentsMoved = true;
            return true;
        });
    }

    // 恢复评论区到原始位置
    function restoreCommentsPosition() {
        return safeDOMOperation(() => {
            const commentApp = getCachedElement(CONFIG.commentAppSelector);

            if (!commentApp || !originalPosition) {
                return false;
            }

            originalPosition.appendChild(commentApp);
            console.log('[BCTR] 评论区恢复成功');
            isCommentsMoved = false;
            return true;
        });
    }

    // 切换评论区位置
    function toggleCommentsPosition() {
        isCommentsMoved ? restoreCommentsPosition() : handleCommentsMove();
    }

    // 创建切换按钮
    function createToggleButton() {
        const titleElement = path.startsWith('/list/')
        ?getCachedElement("#playlistToolbar > div.video-toolbar-right > div.video-note.video-toolbar-right-item.toolbar-right-note")
        :getCachedElement("#arc_toolbar_report > div.video-toolbar-right > div.video-note.video-toolbar-right-item.toolbar-right-note");
        if (!titleElement) return;
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'comment-toggle-btn';
        toggleBtn.textContent = '⇄';
        toggleBtn.title = '切换评论区位置';
        toggleBtn.addEventListener('click', toggleCommentsPosition);

        titleElement.appendChild(toggleBtn);
        const style = document.createElement('style');
        style.textContent = `
    .comment-toggle-btn {
        border-radius: 6px !important;
            display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-left: 12px;
    background-color: #fb7299;
    color: white;
    border: none;
    cursor: pointer;
    vertical-align: middle;
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 1;
    }

@media (prefers-color-scheme: dark) {
    .comment-toggle-btn {
        background-color: #ff85ad;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;
        document.head.appendChild(style);
    }

    // 清理资源
    function cleanupResources() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        cachedElements = {};
        console.log('[BCTR] 已释放观察器和定时器');
    }

    // MutationObserver回调
    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && handleCommentsMove()) {
                cleanupResources();
                createToggleButton();
                break;
            }
        }
    }

    //禁用标题超链接
    function disableTitleLink() {
        const titleLink = document.querySelector("#mirror-vdcon > div.playlist-container--left > div.video-info-container.mac > div.video-info-title > div > h1 > a");
        if (titleLink) {
            titleLink.removeAttribute('href');
            titleLink.style.cursor = 'default';
            titleLink.style.textDecoration = 'none';
            titleLink.style.color = 'inherit';
            console.log('[BCTR] 已禁用标题超链接');
        }
    }

    //脚本设置
    function registerSettingsMenu() {
    GM_registerMenuCommand("⚙️ 脚本设置", function() {
        const currentValue = GM_getValue('hideScrollbar', CONFIG.styleSettings.hideScrollbar);
        const newValue = confirm(`当前滚动条设置：${currentValue ? '隐藏' : '显示'}\n\n是否切换？`);

        if (newValue !== null) {
            GM_setValue('hideScrollbar', !currentValue);
            alert('设置已保存！刷新页面后生效');
        }
    });
}

    // 初始化函数
    function init() {

        if (path.startsWith('/list/')) disableTitleLink();
        // 更精确地选择观察目标
        const observeTarget = document.body || document.documentElement;
        observer = new MutationObserver(mutationCallback);
        observer.observe(observeTarget, CONFIG.observerConfig);

        timeoutId = setTimeout(() => {
            console.warn('[BCTR] 操作超时，终止检测');
            cleanupResources();
        }, CONFIG.timeoutDuration);
    registerSettingsMenu();
    initContainerStyles();
        console.log('[BCTR] 脚本初始化完成');
    }

    // 启动脚本
    try {
        init();
    } catch (error) {
        console.error('[BCTR] 脚本初始化失败:', error);
        cleanupResources();
    }
})();
