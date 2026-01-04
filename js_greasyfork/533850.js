// ==UserScript==
// @name         NodeSeek Addon
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  NodeSeek 插件
// @author       forever
// @match        https://www.nodeseek.com/*
// @match        http://www.nodeseek.com/*
// @match        https://www.deepflood.com/*
// @match        http://www.deepflood.com/*
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @connect      oiapi.net
// @connect      imgdd.com
// @downloadURL https://update.greasyfork.org/scripts/533850/NodeSeek%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/533850/NodeSeek%20Addon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 主题控制函数
    function applyTheme() {
        // 检查当前主题
        const isDarkMode = document.body.classList.contains('dark-layout');

        // 更新主题相关的CSS变量
        const themeStyles = document.createElement('style');
        themeStyles.id = 'ns-theme-styles';

        // 移除已存在的主题样式
        const existingStyles = document.getElementById('ns-theme-styles');
        if (existingStyles) {
            existingStyles.remove();
        }

        // 设置主题相关的CSS变量
        themeStyles.textContent = `
            :root {
                --ns-bg-color: ${isDarkMode ? '#272727' : '#FFFFFF'};
                --ns-text-color: ${isDarkMode ? '#f0f0f0' : '#333333'};
                --ns-border-color: ${isDarkMode ? '#444444' : '#dddddd'};
                --ns-hover-bg-color: ${isDarkMode ? '#383838' : '#f5f5f5'};
                --ns-card-bg-color: ${isDarkMode ? 'rgba(39, 39, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
                --ns-card-bg-hover: ${isDarkMode ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
                --ns-card-shadow: ${isDarkMode ? '0 4px 15px rgba(0, 0, 0, 0.5)' : '0 4px 15px rgba(0, 0, 0, 0.2)'};
                --ns-card-text-color: ${isDarkMode ? '#e0e0e0' : '#333'};
                --ns-card-secondary-text: ${isDarkMode ? '#a0a0a0' : '#666'};
                --ns-overlay-bg: ${isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
                --ns-loader-bg: ${isDarkMode ? '#272727' : 'white'};
                --ns-loader-border: ${isDarkMode ? '#444444' : '#f3f3f3'};
                --ns-emoji-results-bg: ${isDarkMode ? '#333333' : '#f9f9f9'};
                --ns-emoji-item-bg: ${isDarkMode ? '#3a3a3a' : 'white'};
                --ns-emoji-item-border: ${isDarkMode ? '#555555' : '#eeeeee'};
                --ns-debug-bg: ${isDarkMode ? '#333333' : '#f8f9fa'};
                --ns-debug-border: ${isDarkMode ? '#444444' : '#dddddd'};
            }
        `;

        document.head.appendChild(themeStyles);

        console.log(`NodeSeek Addon: 应用${isDarkMode ? '深色' : '浅色'}主题`);
    }

    // 监听主题变化
    function observeThemeChanges() {
        // 使用MutationObserver监听body的class变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    applyTheme();
                }
            });
        });

        // 开始观察body的class变化
        observer.observe(document.body, { attributes: true });
    }

    // 样式
    const style = document.createElement('style');
    style.textContent = `
        /* 刷新按钮样式 */
        .ns-refresh-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
            padding: 5px 10px;
            background-color: #2ea44f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
            position: relative;
            line-height: 1;
        }

        .ns-refresh-btn:hover {
            background-color: #2c974b;
        }

        .ns-refresh-btn svg {
            margin-right: 5px;
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }

        .ns-refresh-btn.loading svg {
            animation: refresh-spin 1s linear infinite;
        }

        .ns-refresh-btn.loading {
            pointer-events: none;
            opacity: 0.8;
        }

        @keyframes refresh-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .ns-iframe-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--ns-overlay-bg);
            z-index: 9999;
            display: flex;
            justify-content: flex-end; /* 调整为靠右对齐 */
            align-items: center;
        }

        .ns-iframe-wrapper {
            position: relative;
            width: 70%;
            height: 100%;
            background: var(--ns-bg-color);
            border-radius: 8px;
            overflow: hidden;
        }

        /* 添加左侧信息卡片样式 */
        .ns-sidebar-info {
            position: fixed;
            left: 15%;
            top: 30%;
            transform: translate(-50%, -50%);
            width: 280px;
            background: var(--ns-card-bg-color);
            border-radius: 8px;
            padding: 20px;
            box-shadow: var(--ns-card-shadow);
            z-index: 9998;
            display: none; /* 初始状态为隐藏 */
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        /* 添加前后帖子导航卡片样式 */
        .ns-post-nav-card {
            position: fixed;
            left: 5%;
            width: 250px;
            background: var(--ns-card-bg-color);
            border-radius: 8px;
            padding: 15px;
            box-shadow: var(--ns-card-shadow);
            z-index: 9997;
            display: none; /* 初始状态为隐藏 */
            flex-direction: column;
            align-items: center;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.7;
        }

        .ns-post-nav-card:hover {
            opacity: 1;
            background: var(--ns-card-bg-hover);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .ns-post-nav-card.prev {
            top: 10%;
            transform: translateY(-50%);
        }

        .ns-post-nav-card.next {
            top: 50%;
            transform: translateY(-50%);
        }

        .ns-post-nav-card .nav-label {
            display: block;
            font-size: 13px;
            color: var(--ns-card-secondary-text);
            margin-bottom: 5px;
        }

        .ns-post-nav-card .nav-title {
            font-size: 15px;
            color: var(--ns-card-text-color);
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }

        .ns-sidebar-info .avatar-container {
            margin-bottom: 15px;
        }

        .ns-sidebar-info .avatar-container img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #2ea44f;
        }

        .ns-sidebar-info .title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 15px 0;
            color: var(--ns-card-text-color);
        }

        .ns-sidebar-info .user-info {
            margin-bottom: 10px;
            color: var(--ns-card-secondary-text);
            font-size: 14px;
        }

        /* 添加媒体查询，小屏幕使用100%宽度 */
        @media screen and (max-width: 800px) {
            .ns-iframe-wrapper {
                width: 100%;
                border-radius: 0;
            }

            .ns-iframe-container {
                justify-content: center;
            }

            .ns-sidebar-info {
                display: none !important; /* 小屏幕隐藏左侧信息 */
            }

            /* 小屏幕下隐藏上一篇/下一篇导航卡片 */
            .ns-post-nav-card {
                display: none !important;
            }

            .ns-quick-reply {
                display: none !important;
            }
        }

        .ns-iframe {
            width: 100%;
            height: 100%;
            border: none;
            opacity: 0; /* 初始隐藏iframe */
            transition: opacity 0.3s ease;
        }

        .ns-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }

        /* 评论按钮样式 */
        .ns-to-comment-btn {
            width: 50px;
            height: 50px;
            background: rgba(46, 164, 79, 0.8);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.2s ease, transform 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            align-self: center;
        }

        .ns-to-comment-btn:hover {
            background: rgba(46, 164, 79, 1);
            transform: scale(1.05);
        }

        /* 新增按钮显示动画 */
        .ns-btn-show {
            opacity: 1;
        }

        /* 新增样式 - 使列表项可点击并添加悬停效果 */
        .post-list-item {
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .post-list-item:hover {
            background-color: var(--ns-hover-bg-color);
        }

        /* 添加外部链接图标样式 */
        .ns-external-link {
            display: none;
            cursor: pointer;
            margin-left: 5px;
            color: var(--ns-card-secondary-text);
            vertical-align: middle;
            transition: color 0.2s ease;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }

        .post-title {
            position: relative;
        }

        .post-title:hover .ns-external-link {
            display: inline-block;
        }

        .post-list-item:hover .ns-external-link {
            display: inline-block;
        }

        .ns-external-link:hover {
            color: #2ea44f;
        }

        /* 加载指示器 */
        .ns-loader {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border: 2px solid var(--ns-loader-border);
            border-top: 2px solid #2ea44f;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 5;
        }

        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* 表情包搜索样式 */
        .ns-emoji-search {
            position: relative;
            margin-top: 5px;
            margin-bottom: 5px;
            padding: 0 1% 0 1%;
            width: 98%;
            display: flex;
            align-items: center;
        }

        .ns-emoji-search input {
            flex: 1;
            padding: 6px 10px;
            border: 1px solid var(--ns-border-color);
            border-radius: 4px;
            font-size: 14px;
            margin-right: 5px;
            background-color: var(--ns-bg-color);
            color: var(--ns-text-color);
        }

        /* 搜索按钮样式 - 保留用于自定义exp-item */
        .exp-item.ns-emoji-btn {
            cursor: pointer;
            background-color: #2ea44f !important;
            color: white !important;
            transition: background-color 0.2s;
        }

        .exp-item.ns-emoji-btn:hover {
            background-color: #2c974b !important;
            opacity: 0.9;
        }

        .ns-emoji-results {
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            margin-bottom: 5px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            max-height: 300px;
            overflow-y: auto;
            padding: 10px;
            background-color: var(--ns-emoji-results-bg);
            border: 1px solid var(--ns-border-color);
            border-radius: 4px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            z-index: 100;
        }

        .ns-emoji-results-header {
            width: 100%;
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: var(--ns-card-secondary-text);
        }

        .ns-emoji-item {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.2s;
            border: 1px solid var(--ns-emoji-item-border);
            background-color: var(--ns-emoji-item-bg);
            flex-shrink: 0;
        }

        .ns-emoji-item:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border-color: #2ea44f;
            z-index: 1;
        }

        .ns-emoji-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* 调试信息样式 */
        .ns-debug-info {
            background-color: var(--ns-debug-bg);
            border: 1px solid var(--ns-debug-border);
            border-radius: 4px;
            padding: 8px;
            margin-top: 5px;
            font-family: monospace;
            font-size: 12px;
            max-height: 100px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
            color: var(--ns-text-color);
        }

        /* 自定义滚动条样式 */
        .ns-custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        .ns-custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }

        .ns-custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(128, 128, 128, 0.35);
            border-radius: 3px;
        }

        .ns-custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(128, 128, 128, 0.5);
        }

        /* 深色模式滚动条 */
        .dark-layout .ns-custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(180, 180, 180, 0.35);
        }

        .dark-layout .ns-custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(180, 180, 180, 0.5);
        }

        /* 新的固定评论区样式 */
        .md-editor.ns-fixed-editor {
            position: fixed;
            bottom: 2%;
            left: 5%;
            width: 85%;
            z-index: 1000;
            background-color: var(--ns-bg-color);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            padding: 2px;
            border-radius: 8px;
        }

        .ns-editor-placeholder {
            min-height: 200px;
            background-color: rgba(200, 200, 200, 0.1);
            border: 1px dashed var(--ns-border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--ns-card-secondary-text);
            font-style: italic;
        }

        /* 添加快捷回复按钮样式 */
        .ns-quick-reply {
            position: fixed;
            left: 15%;
            bottom: 5%;
            transform: translateX(-50%);
            z-index: 9998;
            display: none; /* 初始状态为隐藏 */
            flex-direction: column;
            gap: 8px;
            width: 200px;
        }

        .ns-quick-reply-title {
            font-size: 14px;
            color: var(--ns-card-secondary-text);
            margin-bottom: 5px;
            text-align: center;
        }

        .ns-quick-reply-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
        }

        .ns-quick-reply-btn {
            color: white;
            font-size: 13px;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 5px 12px;
            transition: all 0.2s ease;
            opacity: 0.8;
            white-space: nowrap;
        }

        .ns-quick-reply-btn:hover {
            color: white;
            opacity: 1;
            background-color: rgba(46, 164, 79, 0.8);
            border-color: rgba(46, 164, 79, 0.6);
        }

        @media screen and (max-width: 800px) {
            .ns-iframe-wrapper {
                width: 100%;
                border-radius: 0;
            }
        }

        /* 回到顶部/底部按钮样式 */
        .ns-scroll-btns {
            position: fixed;
            right: 20px;
            bottom: 50px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
            transition: opacity 0.3s ease;
        }

        /* 评论菜单样式修正 */
        .comment-menu {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .comment-menu .menu-item {
            display: flex;
            align-items: center;
            margin-right: 15px;
            cursor: pointer;
        }

        .comment-menu .menu-item svg {
            margin-right: 4px;
        }

        .ns-scroll-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(46, 164, 79, 0.8);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            opacity: 0.8;
        }

        .ns-scroll-btn:hover {
            background-color: rgba(46, 164, 79, 1);
            opacity: 1;
            transform: scale(1.05);
        }

        .ns-scroll-btn svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .ns-scroll-btn.hidden {
            opacity: 0;
            pointer-events: none;
        }

        /* 适配小屏幕 */
        @media screen and (max-width: 800px) {
            .ns-scroll-btns {
                right: 10px;
                bottom: 30px;
            }

            .ns-scroll-btn {
                width: 35px;
                height: 35px;
            }
        }

        /* 帖子列表快捷回复样式 */
        .ns-quick-reply-icon {
            display: none;
            cursor: pointer;
            margin-left: 25px;
            color: var(--ns-card-secondary-text);
            vertical-align: middle;
            transition: color 0.2s ease;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }

        .post-title:hover .ns-quick-reply-icon {
            display: inline-block;
        }

        .post-list-item:hover .ns-quick-reply-icon {
            display: inline-block;
        }

        .ns-quick-reply-icon:hover {
            color: #2ea44f;
        }

        /* 列表快捷回复面板样式 */
        .ns-list-reply-panel {
            position: fixed;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background-color: var(--ns-card-bg-color);
            border-radius: 8px;
            box-shadow: var(--ns-card-shadow);
            padding: 15px;
            z-index: 9999;
            display: none;
            flex-direction: column;
            gap: 10px;
        }

        .ns-list-reply-panel.active {
            display: flex;
        }

        /* 背景遮罩样式调整 */
        .ns-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .ns-list-reply-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .ns-list-reply-title {
            font-weight: bold;
            color: var(--ns-card-text-color);
        }

        .ns-list-reply-close {
            cursor: pointer;
            color: var(--ns-card-secondary-text);
            font-size: 18px;
            line-height: 1;
            padding: 0 5px;
        }

        .ns-list-reply-close:hover {
            color: #f44336;
        }

        .ns-list-reply-textarea {
            width: 95%;
            min-height: 80px;
            resize: vertical;
            border: 1px solid var(--ns-border-color);
            border-radius: 4px;
            padding: 8px;
            background-color: var(--ns-bg-color);
            color: var(--ns-text-color);
        }

        .ns-list-reply-btns {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ns-list-emoji-btn {
            cursor: pointer;
            padding: 5px 10px;
            background-color: rgba(255, 184, 0, 0.8);
            color: white;
            border: none;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }

        .ns-list-emoji-btn:hover {
            background-color: rgba(255, 184, 0, 1);
        }

        .ns-list-submit-btn {
            cursor: pointer;
            padding: 5px 12px;
            background-color: #2ea44f;
            color: white;
            border: none;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }

        .ns-list-submit-btn:hover {
            background-color: #2c974b;
        }

        .ns-list-emoji-results {
            display: none;
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            margin-bottom: 5px;
            background-color: var(--ns-emoji-results-bg);
            border: 1px solid var(--ns-border-color);
            border-radius: 4px;
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 100;
            flex-wrap: wrap;
            gap: 10px;
        }

        .ns-list-emoji-item {
            width: 60px;
            height: 60px;
            border-radius: 4px;
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.2s;
            border: 1px solid var(--ns-emoji-item-border);
            background-color: var(--ns-emoji-item-bg);
            flex-shrink: 0;
        }

        .ns-list-emoji-item:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border-color: #2ea44f;
            z-index: 1;
        }

        .ns-list-emoji-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .ns-list-quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
        }

        .ns-list-quick-reply-btn {
            cursor: pointer;
            padding: 3px 8px;
            background-color: rgba(0, 0, 0, 0.1);
            color: var(--ns-card-text-color);
            border: 1px solid var(--ns-border-color);
            border-radius: 12px;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .ns-list-quick-reply-btn:hover {
            background-color: rgba(46, 164, 79, 0.2);
            border-color: rgba(46, 164, 79, 0.5);
        }

        /* 确保所有回复面板在其他元素之上 */
        .ns-list-reply-panel {
            z-index: 9999;
        }

        // 修改定位回复面板的函数
        function positionReplyPanel(panel, triggerElement) {
            // 不再需要根据按钮位置调整面板位置
            // 已通过CSS将面板固定在屏幕中央

            // 仅设置宽度的自适应调整
            if (window.innerWidth < 600) {
                panel.style.width = '90%';
            } else {
                panel.style.width = '400px';
            }
        }

        .ns-reply-success {
            padding: 10px;
            background-color: rgba(46, 164, 79, 0.1);
            border: 1px solid rgba(46, 164, 79, 0.3);
            border-radius: 4px;
            color: var(--ns-card-text-color);
            text-align: center;
            margin-top: 5px;
            display: none;
        }

        .ns-reply-error {
            padding: 10px;
            background-color: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            border-radius: 4px;
            color: var(--ns-card-text-color);
            text-align: center;
            margin-top: 5px;
            display: none;
        }
    `;
    document.head.appendChild(style);

    // 异步刷新帖子列表
    async function refreshPostList() {
        // 获取当前页面URL
        const currentUrl = window.location.href;

        // 找到刷新按钮并添加加载状态
        const refreshBtn = document.querySelector('.ns-refresh-btn');
        if (refreshBtn) {
            // 更新为加载状态
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;

            // 清空按钮内容
            refreshBtn.textContent = '';

            // 创建SVG元素
            const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIcon.setAttribute("width", "16");
            svgIcon.setAttribute("height", "16");
            svgIcon.setAttribute("viewBox", "0 0 24 24");
            svgIcon.setAttribute("fill", "none");
            svgIcon.setAttribute("stroke", "currentColor");
            svgIcon.setAttribute("stroke-width", "2");
            svgIcon.setAttribute("stroke-linecap", "round");
            svgIcon.setAttribute("stroke-linejoin", "round");

            // 添加路径
            const paths = [
                "M23 4v6h-6",
                "M1 20v-6h6",
                "M3.51 9a9 9 0 0 1 14.85-3.36L23 10",
                "M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
            ];

            paths.forEach(d => {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", d);
                svgIcon.appendChild(path);
            });

            // 添加SVG和文本到按钮
            refreshBtn.appendChild(svgIcon);
            refreshBtn.appendChild(document.createTextNode(" 刷新中..."));
        }

        try {
            // 异步获取当前页面内容
            const response = await fetch(currentUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 获取页面HTML
            const html = await response.text();

            // 创建临时DOM解析HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 找到新的帖子列表
            const newPostList = doc.querySelector('.post-list');
            if (!newPostList) {
                throw new Error('无法找到帖子列表');
            }

            // 找到当前的帖子列表
            const currentPostList = document.querySelector('.post-list');
            if (!currentPostList) {
                throw new Error('无法找到当前帖子列表');
            }

            // 获取nsk-body-left容器
            const bodyLeft = document.querySelector('#nsk-body-left');
            const newBodyLeft = doc.querySelector('#nsk-body-left');

            if (bodyLeft && newBodyLeft) {
                // 获取bodyLeft中的所有子元素
                const bodyLeftChildren = Array.from(bodyLeft.children);

                // 保存当前bodyLeft中所有元素的顺序和类型
                const originalOrder = bodyLeftChildren.map(child => {
                    return {
                        isPostList: child.classList.contains('post-list'),
                        className: child.className,
                        element: child
                    };
                });

                // 获取新页面中的所有元素
                const newElements = Array.from(newBodyLeft.children).map(child => {
                    return {
                        isPostList: child.classList.contains('post-list'),
                        className: child.className,
                        element: child.cloneNode(true)
                    };
                });

                // 创建最终的元素数组，保持原始顺序
                const finalElements = [];

                // 按照原始顺序处理每个元素
                originalOrder.forEach(original => {
                    if (original.isPostList) {
                        // 如果是帖子列表，使用新的帖子列表
                        const newPostListClone = newPostList.cloneNode(true);
                        finalElements.push(newPostListClone);
                    } else {
                        // 如果不是帖子列表，查找匹配的新元素
                        const matchingNewElement = newElements.find(newEl =>
                            !newEl.isPostList && newEl.className === original.className
                        );

                        if (matchingNewElement) {
                            // 如果找到匹配的新元素，使用新元素
                            finalElements.push(matchingNewElement.element);
                            // 从newElements中移除已处理的元素
                            const index = newElements.indexOf(matchingNewElement);
                            if (index > -1) {
                                newElements.splice(index, 1);
                            }
                        } else {
                            // 如果没有找到匹配的新元素，保留原始元素
                            finalElements.push(original.element);
                        }
                    }
                });

                // 查找新页面中有但原页面没有的非帖子列表元素
                const newUniqueElements = newElements.filter(newEl => !newEl.isPostList);

                // 将新元素分为两类：底部翻页元素和其他元素
                const bottomPagerElements = [];
                const otherNewElements = [];

                if (newUniqueElements.length > 0) {
                    newUniqueElements.forEach(newEl => {
                        // 检查元素是否是底部翻页元素或其容器
                        const isPagerBottom = newEl.element.classList.contains('pager-bottom');
                        const hasPagerBottom = newEl.element.querySelector && newEl.element.querySelector('.pager-bottom');
                        const hasFlexEndStyle = newEl.element.getAttribute && newEl.element.getAttribute('style') &&
                            newEl.element.getAttribute('style').includes('justify-content: flex-end');
                        const hasBottomInClassName = newEl.className && newEl.className.includes('bottom');

                        // 如果是底部翻页元素，放入底部翻页数组
                        if (isPagerBottom || hasPagerBottom || hasFlexEndStyle || hasBottomInClassName) {
                            bottomPagerElements.push(newEl.element);
                        } else {
                            // 否则放入其他元素数组
                            otherNewElements.push(newEl.element);
                        }
                    });
                }

                // 找到帖子列表在finalElements中的位置
                let finalPostListIndex = -1;
                for (let i = 0; i < finalElements.length; i++) {
                    if (finalElements[i].classList && finalElements[i].classList.contains('post-list')) {
                        finalPostListIndex = i;
                        break;
                    }
                }

                // 将其他新元素添加到帖子列表前面
                if (finalPostListIndex !== -1 && otherNewElements.length > 0) {
                    finalElements.splice(finalPostListIndex, 0, ...otherNewElements);
                } else if (otherNewElements.length > 0) {
                    // 如果找不到帖子列表，添加到末尾
                    finalElements.push(...otherNewElements);
                }

                // 将底部翻页元素添加到最后
                if (bottomPagerElements.length > 0) {
                    finalElements.push(...bottomPagerElements);
                }

                // 清空bodyLeft
                while (bodyLeft.firstChild) {
                    bodyLeft.removeChild(bodyLeft.firstChild);
                }

                // 按照确定的顺序添加所有元素
                finalElements.forEach(element => {
                    bodyLeft.appendChild(element);
                });

                // 更新currentPostList引用为新添加的post-list
                const updatedPostList = bodyLeft.querySelector('.post-list');
            } else {
                // 如果找不到容器，只替换帖子列表内容
                const newPostItems = newPostList.querySelectorAll('li.post-list-item');

                // 清空当前帖子列表
                while (currentPostList.firstChild) {
                    currentPostList.removeChild(currentPostList.firstChild);
                }

                // 添加新的帖子列表项
                newPostItems.forEach(item => {
                    currentPostList.appendChild(item.cloneNode(true));
                });
            }

            // 重新初始化帖子列表功能
            initPostList();

            // 重新添加刷新按钮
            addRefreshButton();

            console.log('帖子列表刷新成功');
        } catch (error) {
            console.error('刷新帖子列表失败:', error);
            alert('刷新帖子列表失败: ' + error.message);
        } finally {
            // 恢复按钮状态
            if (refreshBtn) {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;

                // 清空按钮内容
                refreshBtn.textContent = '';

                // 创建SVG元素
                const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgIcon.setAttribute("width", "16");
                svgIcon.setAttribute("height", "16");
                svgIcon.setAttribute("viewBox", "0 0 24 24");
                svgIcon.setAttribute("fill", "none");
                svgIcon.setAttribute("stroke", "currentColor");
                svgIcon.setAttribute("stroke-width", "2");
                svgIcon.setAttribute("stroke-linecap", "round");
                svgIcon.setAttribute("stroke-linejoin", "round");

                // 添加路径
                const paths = [
                    "M23 4v6h-6",
                    "M1 20v-6h6",
                    "M3.51 9a9 9 0 0 1 14.85-3.36L23 10",
                    "M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                ];

                paths.forEach(d => {
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", d);
                    svgIcon.appendChild(path);
                });

                // 添加SVG和文本到按钮
                refreshBtn.appendChild(svgIcon);
                refreshBtn.appendChild(document.createTextNode(" 刷新"));
            }
        }
    }

    // 初始化帖子列表功能
    function initPostList() {
        // 找到所有帖子列表项
        const postItems = document.querySelectorAll('.post-list-item');

        // 创建帖子列表映射，用于获取前后帖子
        const postMap = new Map();
        let postOrder = [];

        // 将所有帖子信息存入映射
        postItems.forEach((item, index) => {
            const postLink = item.querySelector('.post-title a[href^="/post-"]');
            if (postLink) {
                const href = postLink.href;
                const title = postLink.textContent.trim();
                postMap.set(href, {
                    title: title,
                    element: item,
                    index: index
                });
                postOrder.push(href);
            }
        });

        // 为每个帖子列表项添加点击事件处理
        postItems.forEach(item => {
            // 移除现有的点击事件处理器（如果有）
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);


            newItem.addEventListener('click', function (e) {
                // 检查点击的是否是头像或头像的容器
                const isAvatarClick = e.target.classList.contains('avatar') ||
                    e.target.classList.contains('avatar-normal') ||
                    e.target.closest('a[href^="/space/"]') !== null ||
                    e.target.closest('.avatar-wrapper') !== null;

                // 如果点击的是头像相关元素，不阻止默认行为，允许正常跳转
                if (isAvatarClick) {
                    return; // 直接返回，不阻止事件，允许正常导航
                }

                // 检查点击的是否是快捷回复图标
                const isQuickReplyClick = e.target.closest('.ns-quick-reply-icon');
                if (isQuickReplyClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    return; // 快捷回复图标的点击在单独的事件处理函数中处理
                }

                // 找到当前列表项中的帖子信息 - 与普通点击相同的方式收集信息
                const postLink = newItem.querySelector('.post-title a[href^="/post-"]');

                // 检查是否点击的是评论时间链接
                const commentTimeLink = e.target.closest('.info-last-comment-time');
                if (commentTimeLink) {
                    // 阻止默认行为
                    e.preventDefault();
                    e.stopPropagation();

                    // 收集评论链接URL
                    const commentUrl = commentTimeLink.href;

                    if (postLink) {
                        const postTitle = postLink.textContent.trim();
                        const avatarImg = newItem.querySelector('.avatar-normal, img.avatar');
                        const userElement = newItem.querySelector('.author-name, .post-username, .username');
                        const postInfoElement = newItem.querySelector('.post-info, .info');

                        // 获取前后帖子信息
                        const currentPostUrl = postLink.href;
                        const currentIndex = postMap.get(currentPostUrl)?.index;

                        let prevPost = null;
                        let nextPost = null;

                        if (currentIndex !== undefined) {
                            // 获取前一篇帖子
                            if (currentIndex > 0) {
                                const prevUrl = postOrder[currentIndex - 1];
                                const prevInfo = postMap.get(prevUrl);
                                if (prevInfo) {
                                    prevPost = {
                                        url: prevUrl,
                                        title: prevInfo.title
                                    };
                                }
                            }

                            // 获取后一篇帖子
                            if (currentIndex < postOrder.length - 1) {
                                const nextUrl = postOrder[currentIndex + 1];
                                const nextInfo = postMap.get(nextUrl);
                                if (nextInfo) {
                                    nextPost = {
                                        url: nextUrl,
                                        title: nextInfo.title
                                    };
                                }
                            }
                        }

                        // 使用评论链接URL在iframe中打开
                        openInIframe(commentUrl, {
                            title: postTitle,
                            avatarElement: avatarImg,
                            userElement: userElement,
                            infoElement: postInfoElement,
                            prevPost: prevPost,
                            nextPost: nextPost,
                            postMap: postMap,
                            postOrder: postOrder
                        });
                    }
                    return;
                }

                if (postLink) {
                    // 阻止事件冒泡和默认行为
                    e.preventDefault();
                    e.stopPropagation();

                    // 收集帖子信息 - 直接使用原有DOM元素
                    const postTitle = postLink.textContent.trim();
                    const avatarImg = newItem.querySelector('.avatar-normal, img.avatar');
                    const userElement = newItem.querySelector('.author-name, .post-username, .username');
                    const postInfoElement = newItem.querySelector('.post-info, .info');

                    // 获取前后帖子信息
                    const currentPostUrl = postLink.href;
                    const currentIndex = postMap.get(currentPostUrl)?.index;

                    let prevPost = null;
                    let nextPost = null;

                    if (currentIndex !== undefined) {
                        // 获取前一篇帖子
                        if (currentIndex > 0) {
                            const prevUrl = postOrder[currentIndex - 1];
                            const prevInfo = postMap.get(prevUrl);
                            if (prevInfo) {
                                prevPost = {
                                    url: prevUrl,
                                    title: prevInfo.title
                                };
                            }
                        }

                        // 获取后一篇帖子
                        if (currentIndex < postOrder.length - 1) {
                            const nextUrl = postOrder[currentIndex + 1];
                            const nextInfo = postMap.get(nextUrl);
                            if (nextInfo) {
                                nextPost = {
                                    url: nextUrl,
                                    title: nextInfo.title
                                };
                            }
                        }
                    }

                    // 在iframe中打开帖子，传入原始DOM元素和前后帖子信息
                    openInIframe(postLink.href, {
                        title: postTitle,
                        avatarElement: avatarImg,
                        userElement: userElement,
                        infoElement: postInfoElement,
                        prevPost: prevPost,
                        nextPost: nextPost,
                        postMap: postMap,
                        postOrder: postOrder
                    });
                }
            });

            // 找到当前列表项中的帖子信息 - 与普通点击相同的方式收集信息
            const postLink = newItem.querySelector('.post-title a[href^="/post-"]');

            // 添加外部链接图标
            const postTitle = newItem.querySelector('.post-title');
            if (postTitle && postLink) {
                // 检查是否已经有外部链接图标
                if (!postTitle.querySelector('.ns-external-link')) {
                    const externalIcon = document.createElement('span');
                    externalIcon.className = 'ns-external-link';
                    externalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
                    externalIcon.title = '在新标签页中打开';

                    // 添加点击事件处理，直接打开原始链接
                    externalIcon.addEventListener('click', function (e) {
                        e.stopPropagation(); // 阻止冒泡，避免触发父级点击事件
                        // 创建一个临时链接元素，模拟正常点击行为
                        const tempLink = document.createElement('a');
                        tempLink.href = postLink.href;
                        tempLink.target = '_blank'; // 在新标签页中打开
                        tempLink.rel = 'noopener noreferrer';
                        tempLink.click();
                    });

                    postTitle.appendChild(externalIcon);
                }

                // 添加快捷回复图标
                if (!postTitle.querySelector('.ns-quick-reply-icon')) {
                    const quickReplyIcon = document.createElement('span');
                    quickReplyIcon.className = 'ns-quick-reply-icon';
                    quickReplyIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;
                    quickReplyIcon.title = '快捷回复';

                    // 从链接中提取帖子ID
                    let postId = null;
                    if (postLink && postLink.href) {
                        const match = postLink.href.match(/\/post-(\d+)/);
                        if (match && match[1]) {
                            postId = parseInt(match[1], 10);
                        }
                    }

                    // 添加点击事件
                    if (postId) {
                        quickReplyIcon.addEventListener('click', function (e) {
                            e.stopPropagation(); // 阻止冒泡

                            // 查找并移除现有的遮罩
                            const existingBackdrop = document.querySelector('.ns-backdrop');
                            if (existingBackdrop) {
                                document.body.removeChild(existingBackdrop);
                            }

                            // 关闭所有打开的快捷回复面板
                            const openPanels = document.querySelectorAll('.ns-list-reply-panel.active');
                            openPanels.forEach(panel => {
                                panel.classList.remove('active');
                            });

                            // 获取或创建回复面板
                            let replyPanel = document.querySelector(`.ns-list-reply-panel[data-post-id="${postId}"]`);

                            if (!replyPanel) {
                                // 创建回复面板
                                replyPanel = createReplyPanel(postId, postLink.textContent.trim());
                                document.body.appendChild(replyPanel);

                                // 定位面板
                                positionReplyPanel(replyPanel, quickReplyIcon);
                            } else {
                                // 重新定位面板
                                positionReplyPanel(replyPanel, quickReplyIcon);
                            }

                            // 直接激活面板
                            replyPanel.classList.add('active');

                            // 添加背景遮罩
                            const backdrop = document.createElement('div');
                            backdrop.className = 'ns-backdrop';
                            document.body.appendChild(backdrop);

                            backdrop.addEventListener('click', function () {
                                replyPanel.classList.remove('active');
                                document.body.removeChild(backdrop);
                            });
                        });
                    }

                    postTitle.appendChild(quickReplyIcon);
                }
            }
        });
    }

    // 添加刷新按钮函数
    function addRefreshButton() {
        // 检查是否已经存在刷新按钮，如果存在则不重复添加
        if (document.querySelector('.ns-refresh-btn')) {
            return;
        }

        // 查找按钮的父元素
        const postListController = document.querySelector('.post-list-controler');
        if (postListController) {
            const sorter = postListController.querySelector('.sorter');
            if (sorter) {
                const refreshBtn = document.createElement('button');
                refreshBtn.className = 'ns-refresh-btn';

                // 创建SVG元素
                const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgIcon.setAttribute("width", "16");
                svgIcon.setAttribute("height", "16");
                svgIcon.setAttribute("viewBox", "0 0 24 24");
                svgIcon.setAttribute("fill", "none");
                svgIcon.setAttribute("stroke", "currentColor");
                svgIcon.setAttribute("stroke-width", "2");
                svgIcon.setAttribute("stroke-linecap", "round");
                svgIcon.setAttribute("stroke-linejoin", "round");

                // 添加路径
                const paths = [
                    "M23 4v6h-6",
                    "M1 20v-6h6",
                    "M3.51 9a9 9 0 0 1 14.85-3.36L23 10",
                    "M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                ];

                paths.forEach(d => {
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", d);
                    svgIcon.appendChild(path);
                });

                // 添加SVG和文本到按钮
                refreshBtn.appendChild(svgIcon);
                refreshBtn.appendChild(document.createTextNode(" 刷新"));
                refreshBtn.title = '异步刷新帖子列表';
                refreshBtn.addEventListener('click', refreshPostList);
                sorter.parentNode.insertBefore(refreshBtn, sorter.nextSibling);
            }
        }
    }

    // 处理跳转页面的aff参数
    function handleJumpPage() {
        // 检查当前页面是否是跳转页面
        if (window.location.pathname.startsWith('/jump')) {
            console.log('NodeSeek Addon: 检测到跳转页面，开始处理aff参数');

            // 获取所有a标签
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                try {
                    // 检查链接是否有href
                    if (link.href) {
                        const url = new URL(link.href);
                        // 检查是否有aff参数
                        if (url.searchParams.has('aff')) {
                            // 修改aff参数为6145
                            url.searchParams.set('aff', '6145');
                            // 更新链接href，但不改变显示文本
                            link.href = url.toString();
                            console.log(`NodeSeek Addon: 已修改链接 ${link.href}`);
                        }
                    }
                } catch (e) {
                    // 忽略无效URL
                    console.error('NodeSeek Addon: 处理链接出错', e);
                }
            });
        }
    }

    // 主函数
    function init() {
        // 应用暗色主题检测和处理
        applyTheme();

        // 观察主题变化
        observeThemeChanges();

        // 添加刷新按钮
        addRefreshButton();

        // 初始化帖子列表
        initPostList();

        // 处理跳转页面
        handleJumpPage();
    }

    // 表情包搜索API
    async function searchEmojis(query) {
        // 使用提供的API
        const url = `https://oiapi.net/API/EmoticonPack/?keyword=${encodeURIComponent(query)}`;

        console.log('搜索表情包，请求URL:', url);

        // 使用GM_xmlhttpRequest绕过CORS限制
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000, // 10秒超时
                onload: function (response) {
                    console.log('API响应状态:', response.status);

                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('API返回数据:', data);

                            // 检查是否有数据 - 注意这里API返回的成功code是1而不是200
                            if (data.code === 1 && Array.isArray(data.data) && data.data.length > 0) {
                                console.log(`找到${data.data.length}个表情包`);
                                resolve({
                                    error: null,
                                    data: data.data.map(item => ({
                                        url: item.url,
                                        preview: item.url,
                                        width: item.width,
                                        height: item.height,
                                        type: item.type,
                                        size: item.size
                                    }))
                                });
                            } else {
                                console.log('API返回成功但无数据:', data);
                                resolve({
                                    error: '未找到相关表情包',
                                    data: []
                                });
                            }
                        } catch (error) {
                            console.error('解析API响应出错:', error);
                            resolve({ error: '解析响应失败: ' + error.message, data: [] });
                        }
                    } else {
                        console.error('API响应非200:', response.status, response.statusText);
                        resolve({ error: `API响应错误: ${response.status}`, data: [] });
                    }
                },
                onerror: function (error) {
                    console.error('请求出错:', error);
                    resolve({ error: '请求出错: ' + (error.error || '未知错误'), data: [] });
                },
                ontimeout: function () {
                    console.error('请求超时');
                    resolve({ error: '请求超时', data: [] });
                }
            });
        });
    }

    // 在iframe中打开链接
    function openInIframe(url, domElements = null) {
        // 禁用父页面滚动
        const originalBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // 创建容器
        const container = document.createElement('div');
        container.className = 'ns-iframe-container';

        // 创建iframe包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'ns-iframe-wrapper';

        // 创建加载指示器容器
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'ns-loader-container';
        loaderContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: var(--ns-loader-bg);
            z-index: 10;
        `;

        // 如果有帖子信息，创建并添加左侧信息卡片
        if (domElements) {
            // 创建左侧信息卡片
            const sidebarInfo = document.createElement('div');
            sidebarInfo.className = 'ns-sidebar-info';

            // 创建并添加前一篇帖子导航卡片（如果有）
            if (domElements.prevPost) {
                const prevNav = document.createElement('div');
                prevNav.className = 'ns-post-nav-card prev';
                prevNav.innerHTML = `
                    <span class="nav-label">上一篇</span>
                    <div class="nav-title">${domElements.prevPost.title}</div>
                `;
                prevNav.setAttribute('data-url', domElements.prevPost.url);
                prevNav.addEventListener('click', function () {
                    loadNewPost(this.getAttribute('data-url'), domElements);
                });
                container.appendChild(prevNav);
            }

            // 添加帖子标题
            if (domElements.title) {
                const titleElement = document.createElement('div');
                titleElement.className = 'title';
                titleElement.textContent = domElements.title;
                titleElement.style.cssText = `
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0 0 15px 0;
                    text-align: center;
                    color: var(--ns-card-text-color);
                    width: 100%;
                `;
                sidebarInfo.appendChild(titleElement);
            }

            // 添加头像
            if (domElements.avatarElement) {
                const avatarContainer = document.createElement('div');
                avatarContainer.className = 'avatar-container';

                // 克隆原始头像并添加样式
                const avatarClone = domElements.avatarElement.cloneNode(true);
                avatarContainer.appendChild(avatarClone);
                sidebarInfo.appendChild(avatarContainer);
            }

            // 添加用户名和其他信息
            if (domElements.userElement) {
                const userInfo = document.createElement('div');
                userInfo.className = 'user-info';

                const usernameClone = domElements.userElement.cloneNode(true);
                userInfo.appendChild(usernameClone);
                sidebarInfo.appendChild(userInfo);
            }

            // 添加帖子信息
            if (domElements.infoElement) {
                const postInfo = document.createElement('div');
                postInfo.className = 'post-info';

                const infoClone = domElements.infoElement.cloneNode(true);
                postInfo.appendChild(infoClone);
                sidebarInfo.appendChild(postInfo);
            }

            // 将信息卡片添加到容器中
            container.appendChild(sidebarInfo);

            // 创建并添加下一篇帖子导航卡片（如果有）
            if (domElements.nextPost) {
                const nextNav = document.createElement('div');
                nextNav.className = 'ns-post-nav-card next';
                nextNav.innerHTML = `
                    <span class="nav-label">下一篇</span>
                    <div class="nav-title">${domElements.nextPost.title}</div>
                `;
                nextNav.setAttribute('data-url', domElements.nextPost.url);
                nextNav.addEventListener('click', function () {
                    loadNewPost(this.getAttribute('data-url'), domElements);
                });
                container.appendChild(nextNav);
            }

            // 添加快捷回复按钮（仅在大屏模式下）
            const quickReplyContainer = document.createElement('div');
            quickReplyContainer.className = 'ns-quick-reply';

            // 添加标题
            const quickReplyTitle = document.createElement('div');
            quickReplyTitle.className = 'ns-quick-reply-title';
            quickReplyTitle.textContent = '快捷回复';
            quickReplyContainer.appendChild(quickReplyTitle);

            // 创建按钮容器
            const quickReplyButtons = document.createElement('div');
            quickReplyButtons.className = 'ns-quick-reply-buttons';

            // 定义快捷回复内容
            const quickReplies = [
                { text: 'bd', title: '快速回复bd' },
                { text: '前排', title: '快速回复前排' },
                { text: '牛逼', title: '快速回复牛逼' },
                { text: '好鸡', title: '快速回复好鸡' },
                { text: '围观', title: '快速回复围观' },
                { text: '支持', title: '快速回复支持' }
            ];

            // 为每个快捷回复创建按钮
            quickReplies.forEach(reply => {
                const replyBtn = document.createElement('div');
                replyBtn.className = 'ns-quick-reply-btn';
                replyBtn.textContent = reply.text;
                replyBtn.title = reply.title;

                // 添加点击事件
                replyBtn.addEventListener('click', function () {
                    // 获取iframe文档对象
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                    // 找到评论编辑器
                    const editor = iframeDoc.querySelector('.CodeMirror');
                    if (editor && editor.CodeMirror) {
                        // 设置评论内容为快捷回复文本
                        editor.CodeMirror.setValue(reply.text);

                        // 找到提交按钮并点击
                        const submitBtn = iframeDoc.querySelector('.md-editor .submit.btn');
                        if (submitBtn) {
                            submitBtn.click();
                        }
                    } else {
                        // 如果找不到编辑器，提示用户
                        alert('找不到评论编辑器，请手动评论');
                    }
                });

                quickReplyButtons.appendChild(replyBtn);
            });

            // 将按钮容器添加到快捷回复容器
            quickReplyContainer.appendChild(quickReplyButtons);

            // 添加表情包功能到快捷回复区域 - 使用按钮而不是搜索框
            const emojiSearchContainer = document.createElement('div');
            emojiSearchContainer.className = 'ns-quick-emoji-search';
            emojiSearchContainer.style.cssText = `
                margin-top: 10px;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            `;

            // 创建按钮容器，使两个按钮水平排列
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = `
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: 15px;
                margin-top: 10px;
            `;

            // 创建表情按钮
            const emojiBtn = document.createElement('button');
            emojiBtn.className = 'ns-emoji-btn';
            emojiBtn.innerHTML = '😊';
            emojiBtn.title = '表情包';
            emojiBtn.style.cssText = `
                width: 50px;
                height: 50px;
                background: rgba(255, 184, 0, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background-color 0.2s ease, transform 0.2s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;

            // 添加按钮悬停效果
            emojiBtn.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.05)';
                this.style.backgroundColor = 'rgba(255, 184, 0, 1)';
            });

            emojiBtn.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
                this.style.backgroundColor = 'rgba(255, 184, 0, 0.8)';
            });

            // 点击表情按钮直接搜索
            emojiBtn.addEventListener('click', async () => {
                // 显示"正在搜索"提示
                emojiResultsContainer.innerHTML = '<div style="text-align:center;padding:10px;">正在加载表情包...</div>';
                emojiResultsContainer.style.display = 'block';

                // 搜索表情包 - 使用空字符串搜索以获取默认表情包
                const response = await searchEmojis("");

                // 显示结果
                if (response.error || response.data.length === 0) {
                    emojiResultsContainer.innerHTML = `<div style="text-align:center;padding:10px;">${response.error || '加载表情包失败'}</div>`;
                    return;
                }

                // 清空结果容器
                emojiResultsContainer.innerHTML = '';

                // 创建表情包结果布局
                const emojiGrid = document.createElement('div');
                emojiGrid.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    justify-content: space-between;
                `;

                // 添加表情包元素
                response.data.forEach(emoji => {
                    const emojiItem = document.createElement('div');
                    emojiItem.className = 'ns-emoji-item';

                    const img = document.createElement('img');
                    img.src = emoji.url;
                    img.setAttribute('data-url', emoji.url);
                    img.setAttribute('title', `${emoji.width}x${emoji.height} ${(emoji.size / 1024).toFixed(1)}KB`);

                    // 添加加载错误处理
                    img.onerror = function () {
                        this.onerror = null;
                        this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E图片加载失败%3C%2Ftext%3E%3C%2Fsvg%3E';
                    };

                    emojiItem.appendChild(img);

                    // 点击表情包插入到评论编辑器
                    emojiItem.addEventListener('click', () => {
                        const imgUrl = emoji.url;
                        const markdownImg = `![表情包](${imgUrl})`;

                        // 获取当前iframe的document对象
                        const currentIframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // 在当前iframe中查找编辑器
                        const editorArea = currentIframeDoc.querySelector('.md-editor');
                        if (editorArea) {
                            const cmElement = editorArea.querySelector('.CodeMirror');
                            if (cmElement && cmElement.CodeMirror) {
                                // 使用找到的编辑器实例插入内容
                                const currentEditor = cmElement.CodeMirror;
                                const cursor = currentEditor.getCursor();
                                currentEditor.replaceRange(markdownImg, cursor);
                                currentEditor.focus();

                                // 如果需要自动发送，可以找到提交按钮并点击
                                const submitBtn = editorArea.querySelector('.submit.btn');
                                if (submitBtn) {
                                    submitBtn.click();
                                }
                            } else {
                                // 找不到编辑器，尝试使用剪贴板
                                try {
                                    navigator.clipboard.writeText(markdownImg).then(() => {
                                        alert('已复制表情包Markdown到剪贴板，请粘贴到评论框');
                                    });
                                } catch (err) {
                                    console.error('无法复制到剪贴板:', err);
                                    alert('无法自动插入表情包，请手动复制: ' + markdownImg);
                                }
                            }
                        } else {
                            // 找不到编辑区域，尝试使用剪贴板
                            try {
                                navigator.clipboard.writeText(markdownImg).then(() => {
                                    alert('已复制表情包Markdown到剪贴板，请粘贴到评论框');
                                });
                            } catch (err) {
                                console.error('无法复制到剪贴板:', err);
                                alert('无法自动插入表情包，请手动复制: ' + markdownImg);
                            }
                        }

                        // 隐藏结果
                        emojiResultsContainer.style.display = 'none';
                    });

                    emojiGrid.appendChild(emojiItem);
                });

                emojiResultsContainer.appendChild(emojiGrid);
            });

            // 创建发表评论按钮
            const toCommentBtn = document.createElement('button');
            toCommentBtn.className = 'ns-to-comment-btn';
            toCommentBtn.innerHTML = '💬';
            toCommentBtn.title = '发表评论';

            // 存储函数引用而不是直接调用，这样在iframe加载完成后我们可以获取正确的iframeDoc
            toCommentBtn.onclick = function () {
                // 获取当前iframe的document对象
                const currentIframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                // 创建或显示浮动评论框
                toggleFloatingCommentBox(currentIframeDoc);
            };

            // 添加按钮到水平容器
            buttonsContainer.appendChild(emojiBtn);
            buttonsContainer.appendChild(toCommentBtn);

            // 将按钮容器添加到搜索容器
            emojiSearchContainer.appendChild(buttonsContainer);

            // 创建结果显示区域
            const emojiResultsContainer = document.createElement('div');
            emojiResultsContainer.className = 'ns-quick-emoji-results';
            emojiResultsContainer.style.cssText = `
                display: none;
                position: absolute;
                right: -400px;
                top: -150px;
                width: 360px;
                height: 300px;
                background: white;
                border-radius: 8px;
                border: 1px solid var(--ns-border-color);
                padding: 15px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                max-height: 450px;
                overflow-y: auto;
                background-color: var(--bs-body-bg, white);
                color: var(--bs-body-color, black);
            `;

            // 添加结果容器
            emojiSearchContainer.appendChild(emojiResultsContainer);

            // 将表情包搜索容器添加到快捷回复容器
            quickReplyContainer.appendChild(emojiSearchContainer);

            // 点击页面其他区域关闭结果框
            document.addEventListener('click', (e) => {
                if (!emojiSearchContainer.contains(e.target)) {
                    emojiResultsContainer.style.display = 'none';
                }
            });

            // 将快捷回复容器添加到页面
            container.appendChild(quickReplyContainer);

            // 将信息卡片添加到容器中
            container.appendChild(sidebarInfo);

            // 创建简单信息容器用于加载界面
            const infoContainer = document.createElement('div');
            infoContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                max-width: 600px;
                padding: 10px 20px 20px;
                margin-bottom: 20px;
                text-align: center;
            `;

            // 直接复制头像元素，保留原有类名和样式，放在第一行居中
            if (domElements.avatarElement) {
                const avatarContainer = document.createElement('div');
                avatarContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    margin-bottom: 15px;
                    width: 100%;
                `;
                const avatarClone = domElements.avatarElement.cloneNode(true);
                avatarContainer.appendChild(avatarClone);
                infoContainer.appendChild(avatarContainer);
            }

            // 添加标题，放在第二行居中
            if (domElements.title) {
                const titleElement = document.createElement('div');
                titleElement.textContent = domElements.title;
                titleElement.style.cssText = `
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0 0 15px 0;
                    text-align: center;
                    color: var(--ns-card-text-color);
                    width: 100%;
                `;
                infoContainer.appendChild(titleElement);
            }

            // 用户名和帖子信息，放在第三行居中
            const infoWrapper = document.createElement('div');
            infoWrapper.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                margin-bottom: 20px;
            `;

            // 直接复制用户名元素，保留原有类名和样式
            if (domElements.userElement) {
                const usernameContainer = document.createElement('div');
                usernameContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    margin-bottom: 5px;
                `;
                const usernameClone = domElements.userElement.cloneNode(true);
                usernameContainer.appendChild(usernameClone);
                infoWrapper.appendChild(usernameContainer);
            }

            // 直接复制帖子信息元素，保留原有类名和样式
            if (domElements.infoElement) {
                const infoElementContainer = document.createElement('div');
                infoElementContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    width: 100%;
                `;
                const infoClone = domElements.infoElement.cloneNode(true);
                infoElementContainer.appendChild(infoClone);
                infoWrapper.appendChild(infoElementContainer);
            }

            infoContainer.appendChild(infoWrapper);

            // 创建加载指示器
            const loader = document.createElement('div');
            loader.className = 'ns-loader';
            loader.style.cssText = `
                width: 40px;
                height: 40px;
                margin: 100px 0;
                border: 2px solid var(--ns-loader-border);
                border-top: 2px solid #2ea44f;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            `;

            infoContainer.appendChild(loader);
            loaderContainer.appendChild(infoContainer);
        } else {
            // 如果没有元素信息，只显示加载指示器
            const loader = document.createElement('div');
            loader.className = 'ns-loader';
            loader.style.cssText = `
                width: 40px;
                height: 40px;
                border: 2px solid var(--ns-loader-border);
                border-top: 2px solid #2ea44f;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            `;
            loaderContainer.appendChild(loader);
        }

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ns-close-btn';
        closeBtn.innerHTML = '✕';
        closeBtn.title = 'ESC'; // 添加悬停提示，显示ESC快捷键
        closeBtn.onclick = function (e) {
            e.stopPropagation(); // 防止事件传递到container
            closeIframe();
        };

        // 创建iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'ns-iframe';
        iframe.src = url;

        // 防止滚动穿透
        iframe.addEventListener('load', function () {
            try {
                // 尝试阻止iframe内部滚动穿透到父页面
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeBody = iframeDoc.body;

                // 在iframe中滚动到底部或顶部时，阻止继续滚动影响父页面
                iframeDoc.addEventListener('wheel', function (e) {
                    const scrollingElement = iframeDoc.scrollingElement || iframeBody;
                    const scrollTop = scrollingElement.scrollTop;
                    const scrollHeight = scrollingElement.scrollHeight;
                    const clientHeight = scrollingElement.clientHeight;

                    // 如果已经滚动到底部，并且继续向下滚动
                    if (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0) {
                        e.preventDefault();
                    }

                    // 如果已经滚动到顶部，并且继续向上滚动
                    if (scrollTop <= 0 && e.deltaY < 0) {
                        e.preventDefault();
                    }
                }, { passive: false });

            } catch (error) {
                console.error('无法阻止iframe滚动穿透:', error);
            }
        });

        // iframe加载完成后处理页面内容
        iframe.onload = function () {
            try {
                // 获取iframe文档对象
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // 添加表情包搜索功能到评论框
                addEmojiSearchToCommentBox(iframeDoc);

                // 添加关闭表情包结果框的点击监听
                iframeDoc.addEventListener('click', function () {
                    // 如果表情包结果容器存在，点击时隐藏它
                    const emojiResults = document.querySelector('.ns-quick-emoji-results');
                    if (emojiResults) {
                        emojiResults.style.display = 'none';
                    }
                });

                // 移除header和footer
                const header = iframeDoc.querySelector('header');
                const footer = iframeDoc.querySelector('footer');

                if (header) header.style.display = 'none';
                if (footer) footer.style.display = 'none';

                // 移除右侧面板
                const rightPanel = iframeDoc.getElementById('nsk-right-panel-container');
                if (rightPanel) rightPanel.style.display = 'none';

                // 检测iframe内的主题并应用相同主题
                const isDarkMode = document.body.classList.contains('dark-layout');
                const iframeIsDark = iframeDoc.body.classList.contains('dark-layout');

                // 如果主题不一致，同步iframe内部主题与父页面
                if (isDarkMode !== iframeIsDark) {
                    if (isDarkMode) {
                        iframeDoc.body.classList.add('dark-layout');
                        iframeDoc.body.classList.remove('light-layout');
                    } else {
                        iframeDoc.body.classList.add('light-layout');
                        iframeDoc.body.classList.remove('dark-layout');
                    }
                }

                // 添加自定义样式到iframe内部
                const styleElement = iframeDoc.createElement('style');
                styleElement.textContent = `
                    /* 隐藏可能的导航和页脚 */
                    header, .header, #header,
                    footer, .footer, #footer,
                    nav, .nav, #nav,
                    .site-header, .site-footer,
                    .main-header, .main-footer,
                    .page-header, .page-footer,
                    #nsk-right-panel-container {
                        display: none !important;
                    }

                    /* 调整主要内容区域 */
                    body {
                        padding-top: 0 !important;
                        margin-top: 0 !important;
                    }

                    /* 让内容区域占满整个空间 */
                    .container, .main-content, .content,
                    #content, .page-content, .site-content,
                    main, .main, #main {
                        padding-top: 10px !important;
                        margin-top: 0 !important;
                        max-width: 100% !important;
                    }

                    /* 调整文章内容宽度，右侧面板被移除后 */
                    .post-detail-card {
                        width: 100% !important;
                        max-width: 100% !important;
                    }

                    /* 强制设置nsk-container的margin为0 */
                    .nsk-container {
                        margin: 0 !important;
                    }

                    /* 新增：让iframe内#nsk-body宽度撑满屏幕 */
                    #nsk-body {
                        width: 100vw !important;
                        max-width: 100vw !important;
                        box-sizing: border-box;
                    }

                    #fast-nav-button-group {
                        display: none;
                    }

                    /* 平滑滚动效果 */
                    html {
                        scroll-behavior: smooth;
                    }

                    /* 自定义滚动条样式 */
                    ::-webkit-scrollbar {
                        width: 6px;
                        height: 6px;
                    }

                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    ::-webkit-scrollbar-thumb {
                        background: rgba(128, 128, 128, 0.35);
                        border-radius: 3px;
                    }

                    ::-webkit-scrollbar-thumb:hover {
                        background: rgba(128, 128, 128, 0.5);
                    }

                    /* 深色模式滚动条 */
                    body.dark-layout ::-webkit-scrollbar-thumb {
                        background: rgba(180, 180, 180, 0.35);
                    }

                    body.dark-layout ::-webkit-scrollbar-thumb:hover {
                        background: rgba(180, 180, 180, 0.5);
                    }
                `;
                iframeDoc.head.appendChild(styleElement);

                // 应用自定义滚动条样式到主文档和iframe
                iframeDoc.documentElement.classList.add('ns-custom-scrollbar');
                iframeDoc.body.classList.add('ns-custom-scrollbar');

                // 应用自定义滚动条到主要内容区域
                const mainContainers = iframeDoc.querySelectorAll('.container, .main-content, .content, #content, .page-content, .site-content, main, .main, #main, .post-detail-card, .comment-container');
                mainContainers.forEach(container => {
                    container.classList.add('ns-custom-scrollbar');
                });

                // 处理评论按钮
                setupCommentButtons(iframeDoc);

                // 处理翻页链接，拦截点击实现无刷新翻页
                setupPagination(iframeDoc, iframe);

                // 添加回到顶部和底部按钮
                addScrollButtons(iframeDoc);

                // 处理完成后移除加载指示器并显示iframe
                wrapper.removeChild(loaderContainer);
                iframe.style.opacity = 1;

                // 只在窗口宽度大于800px时才显示左侧信息卡片和导航卡片
                if (window.innerWidth > 800) {
                    // 显示左侧信息卡片（仅在iframe加载完成后）
                    const sidebarInfo = container.querySelector('.ns-sidebar-info');
                    if (sidebarInfo) {
                        sidebarInfo.style.display = 'flex';
                    }

                    // 显示前后帖子导航卡片
                    const prevNavCard = container.querySelector('.ns-post-nav-card.prev');
                    if (prevNavCard) {
                        prevNavCard.style.display = 'flex';
                    }

                    const nextNavCard = container.querySelector('.ns-post-nav-card.next');
                    if (nextNavCard) {
                        nextNavCard.style.display = 'flex';
                    }

                    // 显示快捷回复按钮
                    const quickReplyBtn = container.querySelector('.ns-quick-reply');
                    if (quickReplyBtn) {
                        quickReplyBtn.style.display = 'flex';
                        // 不再在这里添加评论按钮，因为已经添加到表情按钮旁边了
                    }
                }

                // 监听iframe内部主题变化并同步到外部UI
                const iframeObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class') {
                            // 检查iframe内的主题
                            const iframeIsDark = iframeDoc.body.classList.contains('dark-layout');
                            const parentIsDark = document.body.classList.contains('dark-layout');

                            // 如果主题不一致，同步父页面主题与iframe
                            if (iframeIsDark !== parentIsDark) {
                                if (iframeIsDark) {
                                    document.body.classList.add('dark-layout');
                                    document.body.classList.remove('light-layout');
                                } else {
                                    document.body.classList.add('light-layout');
                                    document.body.classList.remove('dark-layout');
                                }
                                // 应用新主题
                                applyTheme();
                            }
                        }
                    });
                });

                // 开始观察iframe内body的class变化
                iframeObserver.observe(iframeDoc.body, { attributes: true });

            } catch (error) {
                console.error('无法修改iframe内容:', error);
                // 出错时也显示iframe，确保用户能看到内容
                wrapper.removeChild(loaderContainer);
                iframe.style.opacity = 1;

                // 即使出错也显示左侧信息卡片
                const sidebarInfo = container.querySelector('.ns-sidebar-info');
                if (sidebarInfo) {
                    sidebarInfo.style.display = 'flex';
                }

                // 即使出错也显示前后帖子导航卡片
                const prevNavCard = container.querySelector('.ns-post-nav-card.prev');
                if (prevNavCard) {
                    prevNavCard.style.display = 'flex';
                }

                const nextNavCard = container.querySelector('.ns-post-nav-card.next');
                if (nextNavCard) {
                    nextNavCard.style.display = 'flex';
                }
            }
        };

        // 组装元素
        wrapper.appendChild(closeBtn);
        wrapper.appendChild(loaderContainer); // 先添加加载指示器容器
        wrapper.appendChild(iframe);
        container.appendChild(wrapper);
        document.body.appendChild(container);

        // 点击遮罩层关闭iframe
        container.addEventListener('click', function (e) {
            // 只有点击遮罩层本身才关闭，点击iframe内部不触发
            if (e.target === container) {
                closeIframe();
            }
        });

        // 阻止iframe包装器的点击事件冒泡
        wrapper.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // 关闭iframe的函数
        function closeIframe() {
            document.body.removeChild(container);
            document.removeEventListener('keydown', escListener);
            // 恢复父页面滚动
            document.body.style.overflow = originalBodyOverflow;
        }

        // 按ESC键关闭iframe
        function escListener(e) {
            if (e.key === 'Escape') {
                closeIframe();
            }
        }

        document.addEventListener('keydown', escListener);

        // 加载新帖子的函数 - 移到openInIframe内部以便访问container变量
        function loadNewPost(url, currentDomElements) {
            // 获取当前的postMap和postOrder
            const postMap = currentDomElements.postMap;
            const postOrder = currentDomElements.postOrder;

            if (!postMap || !postOrder) return;

            // 获取新帖子的信息
            const newPostInfo = postMap.get(url);
            if (!newPostInfo) return;

            const newPostIndex = newPostInfo.index;
            const newPostElement = newPostInfo.element;

            if (!newPostElement) return;

            // 获取新帖子的详细信息
            const postLink = newPostElement.querySelector('.post-title a[href^="/post-"]');
            if (!postLink) return;

            const postTitle = postLink.textContent.trim();
            const avatarImg = newPostElement.querySelector('.avatar-normal, img.avatar');
            const userElement = newPostElement.querySelector('.author-name, .post-username, .username');
            const postInfoElement = newPostElement.querySelector('.post-info, .info');

            // 获取新帖子的前后帖子信息
            let prevPost = null;
            let nextPost = null;

            // 获取前一篇帖子
            if (newPostIndex > 0) {
                const prevUrl = postOrder[newPostIndex - 1];
                const prevInfo = postMap.get(prevUrl);
                if (prevInfo) {
                    prevPost = {
                        url: prevUrl,
                        title: prevInfo.title
                    };
                }
            }

            // 获取后一篇帖子
            if (newPostIndex < postOrder.length - 1) {
                const nextUrl = postOrder[newPostIndex + 1];
                const nextInfo = postMap.get(nextUrl);
                if (nextInfo) {
                    nextPost = {
                        url: nextUrl,
                        title: nextInfo.title
                    };
                }
            }

            // 更新左侧信息卡片
            const sidebarInfo = container.querySelector('.ns-sidebar-info');
            if (sidebarInfo) {
                // 临时隐藏侧边栏，避免旧内容闪烁
                sidebarInfo.style.display = 'none';

                // 清空现有内容
                sidebarInfo.innerHTML = '';

                // 添加帖子标题
                if (postTitle) {
                    const titleElement = document.createElement('div');
                    titleElement.className = 'title';
                    titleElement.textContent = postTitle;
                    titleElement.style.cssText = `
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0 0 15px 0;
                        text-align: center;
                        color: var(--ns-card-text-color);
                        width: 100%;
                    `;
                    sidebarInfo.appendChild(titleElement);
                }

                // 添加头像
                if (avatarImg) {
                    const avatarContainer = document.createElement('div');
                    avatarContainer.className = 'avatar-container';

                    // 克隆原始头像并添加样式
                    const avatarClone = avatarImg.cloneNode(true);
                    avatarContainer.appendChild(avatarClone);
                    sidebarInfo.appendChild(avatarContainer);
                }

                // 添加用户名和其他信息
                if (userElement) {
                    const userInfo = document.createElement('div');
                    userInfo.className = 'user-info';

                    const usernameClone = userElement.cloneNode(true);
                    userInfo.appendChild(usernameClone);
                    sidebarInfo.appendChild(userInfo);
                }

                // 添加帖子信息
                if (postInfoElement) {
                    const postInfo = document.createElement('div');
                    postInfo.className = 'post-info';

                    const infoClone = postInfoElement.cloneNode(true);
                    postInfo.appendChild(infoClone);
                    sidebarInfo.appendChild(postInfo);
                }
            }

            // 更新前后帖子导航卡片
            // 移除旧的导航卡片
            const oldPrevCard = container.querySelector('.ns-post-nav-card.prev');
            if (oldPrevCard) {
                container.removeChild(oldPrevCard);
            }

            const oldNextCard = container.querySelector('.ns-post-nav-card.next');
            if (oldNextCard) {
                container.removeChild(oldNextCard);
            }

            // 添加新的前一篇导航卡片（如果有）
            if (prevPost) {
                const prevNav = document.createElement('div');
                prevNav.className = 'ns-post-nav-card prev';
                prevNav.innerHTML = `
                    <span class="nav-label">上一篇</span>
                    <div class="nav-title">${prevPost.title}</div>
                `;
                prevNav.setAttribute('data-url', prevPost.url);
                prevNav.addEventListener('click', function () {
                    loadNewPost(this.getAttribute('data-url'), {
                        postMap: postMap,
                        postOrder: postOrder
                    });
                });
                container.appendChild(prevNav);
            }

            // 添加新的下一篇导航卡片（如果有）
            if (nextPost) {
                const nextNav = document.createElement('div');
                nextNav.className = 'ns-post-nav-card next';
                nextNav.innerHTML = `
                    <span class="nav-label">下一篇</span>
                    <div class="nav-title">${nextPost.title}</div>
                `;
                nextNav.setAttribute('data-url', nextPost.url);
                nextNav.addEventListener('click', function () {
                    loadNewPost(this.getAttribute('data-url'), {
                        postMap: postMap,
                        postOrder: postOrder
                    });
                });
                container.appendChild(nextNav);
            }

            // 显示加载指示器
            const newLoaderContainer = document.createElement('div');
            newLoaderContainer.className = 'ns-loader-container';
            newLoaderContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: var(--ns-loader-bg);
                z-index: 10;
            `;

            // 添加帖子信息到加载指示器，与初始加载时保持一致
            if (postTitle || avatarImg || userElement || postInfoElement) {
                // 创建简单信息容器用于加载界面
                const infoContainer = document.createElement('div');
                infoContainer.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    max-width: 600px;
                    padding: 10px 20px 20px;
                    margin-bottom: 20px;
                    text-align: center;
                `;

                // 添加头像元素，放在第一行居中
                if (avatarImg) {
                    const avatarContainer = document.createElement('div');
                    avatarContainer.style.cssText = `
                        display: flex;
                        justify-content: center;
                        margin-bottom: 15px;
                        width: 100%;
                    `;
                    const avatarClone = avatarImg.cloneNode(true);
                    avatarContainer.appendChild(avatarClone);
                    infoContainer.appendChild(avatarContainer);
                }

                // 添加标题，放在第二行居中
                if (postTitle) {
                    const titleElement = document.createElement('div');
                    titleElement.textContent = postTitle;
                    titleElement.style.cssText = `
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0 0 15px 0;
                        text-align: center;
                        color: var(--ns-card-text-color);
                        width: 100%;
                    `;
                    infoContainer.appendChild(titleElement);
                }

                // 用户名和帖子信息，放在第三行居中
                const infoWrapper = document.createElement('div');
                infoWrapper.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    margin-bottom: 20px;
                `;

                // 添加用户名元素
                if (userElement) {
                    const usernameContainer = document.createElement('div');
                    usernameContainer.style.cssText = `
                        display: flex;
                        justify-content: center;
                        width: 100%;
                        margin-bottom: 5px;
                    `;
                    const usernameClone = userElement.cloneNode(true);
                    usernameContainer.appendChild(usernameClone);
                    infoWrapper.appendChild(usernameContainer);
                }

                // 添加帖子信息元素
                if (postInfoElement) {
                    const infoElementContainer = document.createElement('div');
                    infoElementContainer.style.cssText = `
                        display: flex;
                        justify-content: center;
                        width: 100%;
                    `;
                    const infoClone = postInfoElement.cloneNode(true);
                    infoElementContainer.appendChild(infoClone);
                    infoWrapper.appendChild(infoElementContainer);
                }

                infoContainer.appendChild(infoWrapper);

                // 创建加载指示器
                const loader = document.createElement('div');
                loader.className = 'ns-loader';
                loader.style.cssText = `
                    width: 40px;
                    height: 40px;
                    margin: 100px 0;
                    border: 2px solid var(--ns-loader-border);
                    border-top: 2px solid #2ea44f;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                `;

                infoContainer.appendChild(loader);
                newLoaderContainer.appendChild(infoContainer);
            } else {
                // 如果没有帖子信息，只显示加载指示器
                const loader = document.createElement('div');
                loader.className = 'ns-loader';
                loader.style.cssText = `
                    width: 40px;
                    height: 40px;
                    border: 2px solid var(--ns-loader-border);
                    border-top: 2px solid #2ea44f;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                `;
                newLoaderContainer.appendChild(loader);
            }

            // 更新iframe的src
            iframe.style.opacity = 0;
            wrapper.appendChild(newLoaderContainer);
            iframe.src = url;

            // iframe加载完成后，移除加载指示器并显示左侧信息卡片
            iframe.onload = function () {
                try {
                    // 原有的iframe加载完成处理代码...
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                    // 移除header和footer
                    const header = iframeDoc.querySelector('header');
                    const footer = iframeDoc.querySelector('footer');

                    if (header) header.style.display = 'none';
                    if (footer) footer.style.display = 'none';

                    // 移除右侧面板
                    const rightPanel = iframeDoc.getElementById('nsk-right-panel-container');
                    if (rightPanel) rightPanel.style.display = 'none';

                    // 添加自定义样式到iframe内部
                    const styleElement = iframeDoc.createElement('style');
                    styleElement.textContent = `
                        /* 隐藏可能的导航和页脚 */
                        header, .header, #header,
                        footer, .footer, #footer,
                        nav, .nav, #nav,
                        .site-header, .site-footer,
                        .main-header, .main-footer,
                        .page-header, .page-footer,
                        #nsk-right-panel-container {
                            display: none !important;
                        }

                        /* 调整主要内容区域 */
                        body {
                            padding-top: 0 !important;
                            margin-top: 0 !important;
                        }

                        /* 让内容区域占满整个空间 */
                        .container, .main-content, .content,
                        #content, .page-content, .site-content,
                        main, .main, #main {
                            padding-top: 10px !important;
                            margin-top: 0 !important;
                            max-width: 100% !important;
                        }

                        /* 调整文章内容宽度，右侧面板被移除后 */
                        .post-detail-card {
                            width: 100% !important;
                            max-width: 100% !important;
                        }

                        /* 强制设置nsk-container的margin为0 */
                        .nsk-container {
                            margin: 0 !important;
                        }

                        /* 平滑滚动效果 */
                        html {
                            scroll-behavior: smooth;
                        }

                        /* 自定义滚动条样式 */
                        ::-webkit-scrollbar {
                            width: 6px;
                            height: 6px;
                        }

                        ::-webkit-scrollbar-track {
                            background: transparent;
                        }

                        ::-webkit-scrollbar-thumb {
                            background: rgba(128, 128, 128, 0.35);
                            border-radius: 3px;
                        }

                        ::-webkit-scrollbar-thumb:hover {
                            background: rgba(128, 128, 128, 0.5);
                        }

                        /* 深色模式滚动条 */
                        body.dark-layout ::-webkit-scrollbar-thumb {
                            background: rgba(180, 180, 180, 0.35);
                        }

                        body.dark-layout ::-webkit-scrollbar-thumb:hover {
                            background: rgba(180, 180, 180, 0.5);
                        }
                    `;
                    iframeDoc.head.appendChild(styleElement);

                    // 应用自定义滚动条样式到主文档和iframe
                    iframeDoc.documentElement.classList.add('ns-custom-scrollbar');
                    iframeDoc.body.classList.add('ns-custom-scrollbar');

                    // 应用自定义滚动条到主要内容区域
                    const mainContainers = iframeDoc.querySelectorAll('.container, .main-content, .content, #content, .page-content, .site-content, main, .main, #main, .post-detail-card, .comment-container');
                    mainContainers.forEach(container => {
                        container.classList.add('ns-custom-scrollbar');
                    });

                    // 添加表情包搜索功能到评论框
                    addEmojiSearchToCommentBox(iframeDoc);

                    // 处理翻页链接，拦截点击实现无刷新翻页
                    setupPagination(iframeDoc, iframe);

                    // 添加回到顶部和底部按钮
                    addScrollButtons(iframeDoc);

                    // 处理完成后移除加载指示器并显示iframe
                    wrapper.removeChild(newLoaderContainer);
                    iframe.style.opacity = 1;

                    // 只在窗口宽度大于800px时才显示左侧信息卡片和导航卡片
                    if (window.innerWidth > 800) {
                        // 显示左侧信息卡片
                        if (sidebarInfo) {
                            sidebarInfo.style.display = 'flex';
                        }

                        // 显示前后帖子导航卡片
                        const prevNavCard = container.querySelector('.ns-post-nav-card.prev');
                        if (prevNavCard) {
                            prevNavCard.style.display = 'flex';
                        }

                        const nextNavCard = container.querySelector('.ns-post-nav-card.next');
                        if (nextNavCard) {
                            nextNavCard.style.display = 'flex';
                        }

                        // 显示快捷回复按钮
                        const quickReplyBtn = container.querySelector('.ns-quick-reply');
                        if (quickReplyBtn) {
                            quickReplyBtn.style.display = 'flex';
                            // 不再在这里添加评论按钮，因为已经添加到表情按钮旁边了
                        }
                    }

                } catch (error) {
                    console.error('无法修改iframe内容:', error);
                    // 出错时也显示iframe，确保用户能看到内容
                    wrapper.removeChild(newLoaderContainer);
                    iframe.style.opacity = 1;

                    // 即使出错也显示左侧信息卡片
                    if (sidebarInfo) {
                        sidebarInfo.style.display = 'flex';
                    }

                    // 即使出错也显示前后帖子导航卡片
                    const prevNavCard = container.querySelector('.ns-post-nav-card.prev');
                    if (prevNavCard) {
                        prevNavCard.style.display = 'flex';
                    }

                    const nextNavCard = container.querySelector('.ns-post-nav-card.next');
                    if (nextNavCard) {
                        nextNavCard.style.display = 'flex';
                    }
                }
            };
        }
    }

    // 添加表情包搜索功能到评论框
    function addEmojiSearchToCommentBox(doc) {
        // 监听评论框加载
        const checkCommentBox = setInterval(() => {
            const commentBox = doc.querySelector('.md-editor');
            if (commentBox) {
                clearInterval(checkCommentBox);

                // 找到表情选择区域
                const expressionArea = commentBox.querySelector('.expression');
                if (!expressionArea) return;

                // 检查是否已经存在搜索框，避免重复添加
                const existingSearchContainer = expressionArea.parentNode.querySelector('.ns-emoji-search');
                if (existingSearchContainer) return;

                // 创建表情包搜索容器
                const searchContainer = doc.createElement('div');
                searchContainer.className = 'ns-emoji-search';
                searchContainer.style.position = 'relative';
                searchContainer.style.display = 'flex'; // 直接显示

                // 创建搜索输入框
                const searchInput = doc.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = '搜索表情包...';

                // 创建结果显示区域
                const resultsContainer = doc.createElement('div');
                resultsContainer.className = 'ns-emoji-results';
                resultsContainer.style.display = 'none';

                // 创建调试信息区域
                const debugContainer = doc.createElement('div');
                debugContainer.className = 'ns-debug-info';
                debugContainer.style.display = 'none';

                // 组装元素
                searchContainer.appendChild(searchInput);
                searchContainer.appendChild(resultsContainer);
                searchContainer.appendChild(debugContainer);

                // 将搜索容器直接添加到expression元素后面
                expressionArea.parentNode.insertBefore(searchContainer, expressionArea.nextSibling);

                // 获取编辑器实例
                const editorArea = commentBox.querySelector('#code-mirror-editor');
                let cmEditor = null;
                let textarea = null;

                // 尝试获取CodeMirror编辑器实例
                if (editorArea) {
                    const cmElement = editorArea.querySelector('.CodeMirror');
                    if (cmElement && cmElement.CodeMirror) {
                        cmEditor = cmElement.CodeMirror;
                    }
                }
                // 兼容textarea
                if (!cmEditor) {
                    textarea = commentBox.querySelector('textarea');
                }

                // ========== 新增：上传图片按钮 ==========
                const uploadImgBtn = doc.createElement('button');
                uploadImgBtn.type = 'button';
                uploadImgBtn.className = 'ns-list-upload-img-btn';
                uploadImgBtn.innerHTML = '🖼️ 上传图片';
                uploadImgBtn.style.marginRight = '8px';
                uploadImgBtn.title = '上传图片';

                // 隐藏的文件选择框
                const fileInput = doc.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';

                uploadImgBtn.addEventListener('click', function () {
                    fileInput.value = '';
                    fileInput.click();
                });

                fileInput.addEventListener('change', function () {
                    if (fileInput.files && fileInput.files[0]) {
                        handleImageUpload(fileInput.files[0]);
                    }
                });

                // ========== 新增：粘贴图片支持 ==========
                let pasteTarget = cmEditor ? cmEditor.getInputField() : textarea;
                if (pasteTarget) {
                    pasteTarget.addEventListener('paste', function (e) {
                        if (e.clipboardData && e.clipboardData.items) {
                            for (let i = 0; i < e.clipboardData.items.length; i++) {
                                const item = e.clipboardData.items[i];
                                if (item.kind === 'file' && item.type.startsWith('image/')) {
                                    const file = item.getAsFile();
                                    if (file) {
                                        e.preventDefault();
                                        handleImageUpload(file);
                                    }
                                }
                            }
                        }
                    });
                }

                // ========== 新增：图片上传处理函数 ==========
                function handleImageUpload(file) {
                    if (!file || !file.type.startsWith('image/')) return;
                    // 插入上传中提示
                    let insertFn, removeUploadingFn;
                    if (cmEditor) {
                        const cursor = cmEditor.getCursor();
                        const uploadingText = '\n![图片上传中...](正在上传)\n';
                        cmEditor.replaceRange(uploadingText, cursor);
                        // 记录插入前后位置
                        const startPos = { line: cursor.line, ch: cursor.ch };
                        // 计算插入后的位置
                        let endPos = cmEditor.posFromIndex(cmEditor.indexFromPos(startPos) + uploadingText.length);
                        insertFn = (url) => {
                            cmEditor.replaceRange(`![图片](${url})\n`, startPos, endPos);
                        };
                        removeUploadingFn = () => {
                            cmEditor.replaceRange('', startPos, endPos);
                        };
                    } else if (textarea) {
                        const oldValue = textarea.value;
                        const cursorPos = textarea.selectionStart;
                        const uploadingText = '\n![图片上传中...](正在上传)\n';
                        textarea.value = oldValue.slice(0, cursorPos) + uploadingText + oldValue.slice(cursorPos);
                        const insertPos = cursorPos;
                        insertFn = (url) => {
                            const before = textarea.value.slice(0, insertPos);
                            const after = textarea.value.slice(insertPos + uploadingText.length);
                            textarea.value = before + `![图片](${url})\n` + after;
                        };
                        removeUploadingFn = () => {
                            const before = textarea.value.slice(0, insertPos);
                            const after = textarea.value.slice(insertPos + uploadingText.length);
                            textarea.value = before + after;
                        };
                    }
                    // 用GM_xmlhttpRequest上传图片
                    const formData = new FormData();
                    formData.append('image', file);
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://imgdd.com/upload',
                        data: formData,
                        responseType: 'json',
                        onload: function (response) {
                            let url = '';
                            if (response.status === 200 && response.response && response.response.url) {
                                url = response.response.url;
                            } else if (response.responseText) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    url = data.url;
                                } catch { }
                            }
                            if (url) {
                                insertFn(url);
                            } else {
                                removeUploadingFn();
                                alert('图片上传失败');
                            }
                        },
                        onerror: function () {
                            removeUploadingFn();
                            alert('图片上传失败');
                        }
                    });
                }

                // ========== 新增：将上传按钮插入到表情区前面 ==========
                expressionArea.parentNode.insertBefore(uploadImgBtn, expressionArea);
                expressionArea.parentNode.appendChild(fileInput);

                // 回车键搜索
                searchInput.addEventListener('keydown', async (e) => {
                    if (e.key === 'Enter') {
                        const query = searchInput.value.trim();
                        if (!query) return;

                        // 显示"正在搜索"提示
                        resultsContainer.innerHTML = '<div style="text-align:center;padding:10px;">正在搜索表情包...</div>';
                        resultsContainer.style.display = 'flex';

                        // 搜索表情包
                        const response = await searchEmojis(query);

                        // 显示结果
                        if (response.error || response.data.length === 0) {
                            resultsContainer.innerHTML = `<div style="text-align:center;padding:10px;">${response.error || '未找到相关表情包'}</div>`;
                            return;
                        }

                        // 清空结果容器
                        resultsContainer.innerHTML = '';

                        // 创建表情包结果布局
                        const emojiGrid = document.createElement('div');
                        emojiGrid.style.cssText = `
                            display: flex;
                            flex-wrap: wrap;
                            gap: 12px;
                            justify-content: space-between;
                        `;

                        // 添加表情包元素
                        response.data.forEach(emoji => {
                            const emojiItem = document.createElement('div');
                            emojiItem.className = 'ns-emoji-item';

                            const img = document.createElement('img');
                            img.src = emoji.url;
                            img.setAttribute('data-url', emoji.url);
                            img.setAttribute('title', `${emoji.width}x${emoji.height} ${(emoji.size / 1024).toFixed(1)}KB`);

                            // 添加加载错误处理
                            img.onerror = function () {
                                // 图片加载失败时显示错误提示
                                this.onerror = null;
                                this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E图片加载失败%3C%2Ftext%3E%3C%2Fsvg%3E';
                            };

                            emojiItem.appendChild(img);

                            // 点击表情包插入到编辑器
                            emojiItem.addEventListener('click', () => {
                                const imgUrl = emoji.url;
                                // 使用搜索关键词作为图片alt文本，而不是固定的"表情包"
                                const markdownImg = `![${query}](${imgUrl})`;

                                // 如果找到了CodeMirror编辑器，则插入到编辑器中
                                if (cmEditor) {
                                    const cursor = cmEditor.getCursor();
                                    cmEditor.replaceRange(markdownImg, cursor);
                                    cmEditor.focus();
                                } else {
                                    // 找不到编辑器，尝试使用剪贴板
                                    try {
                                        navigator.clipboard.writeText(markdownImg).then(() => {
                                            alert('已复制表情包Markdown到剪贴板，请粘贴到评论框');
                                        });
                                    } catch (err) {
                                        console.error('无法复制到剪贴板:', err);
                                        alert('无法自动插入表情包，请手动复制: ' + markdownImg);
                                    }
                                }

                                // 隐藏结果
                                resultsContainer.style.display = 'none';
                            });

                            emojiGrid.appendChild(emojiItem);
                        });

                        resultsContainer.appendChild(emojiGrid);
                    }
                });

                // 点击页面其他区域关闭结果框
                doc.addEventListener('click', (e) => {
                    if (!searchContainer.contains(e.target)) {
                        resultsContainer.style.display = 'none';
                    }
                });
            }
        }, 500);
    }

    // 设置翻页功能
    function setupPagination(iframeDoc, iframe) {
        // 检查是否已添加无限滚动标记，防止重复添加
        if (iframeDoc.querySelector('.ns-infinite-scroll-active')) {
            return;
        }

        // 给文档添加无限滚动标记
        const infiniteScrollMark = iframeDoc.createElement('div');
        infiniteScrollMark.className = 'ns-infinite-scroll-active';
        infiniteScrollMark.style.display = 'none';
        iframeDoc.body.appendChild(infiniteScrollMark);

        // 添加加载状态指示器
        const loadingIndicator = iframeDoc.createElement('div');
        loadingIndicator.className = 'ns-comment-loading-indicator';
        loadingIndicator.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; padding: 15px; font-size: 14px; color: var(--ns-card-secondary-text);">
                <div style="width: 20px; height: 20px; border: 2px solid var(--ns-loader-border); border-top: 2px solid #2ea44f; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
                <span>正在加载更多评论...</span>
            </div>
        `;
        loadingIndicator.style.display = 'none';

        // 找到评论容器
        const commentContainer = iframeDoc.querySelector('.comment-container');
        if (commentContainer) {
            // 添加加载指示器到评论容器末尾
            commentContainer.appendChild(loadingIndicator);

            // 当前正在加载的状态标记
            let isLoading = false;
            // 没有更多评论的标记
            let noMoreComments = false;

            // 监听滚动事件
            iframeDoc.addEventListener('scroll', function () {
                // 如果正在加载或已经没有更多评论，则不处理
                if (isLoading || noMoreComments) return;

                const commentList = commentContainer.querySelector('ul.comments');
                if (!commentList) return;

                // 计算滚动位置，判断是否接近底部
                const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop;
                const scrollHeight = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight;
                const clientHeight = iframeDoc.documentElement.clientHeight || iframeDoc.body.clientHeight;

                // 当滚动到距离底部200px时触发加载
                if (scrollHeight - scrollTop - clientHeight < 200) {
                    loadNextPage();
                }
            });

            // 加载下一页评论
            function loadNextPage() {
                // 获取下一页链接
                const nextPageLink = commentContainer.querySelector('.pager-next');
                if (!nextPageLink || !nextPageLink.href) {
                    noMoreComments = true;
                    return;
                }

                isLoading = true;
                loadingIndicator.style.display = 'block';

                fetch(nextPageLink.href)
                    .then(response => {
                        if (!response.ok) throw new Error('网络响应不正常');
                        return response.text();
                    })
                    .then(htmlText => {
                        // 解析HTML
                        const parser = new DOMParser();
                        const newDoc = parser.parseFromString(htmlText, 'text/html');

                        // 获取新页面的评论列表
                        const newCommentList = newDoc.querySelector('.comment-container ul.comments');
                        if (!newCommentList) throw new Error('无法找到评论列表');

                        // 获取当前评论列表
                        const currentCommentList = commentContainer.querySelector('ul.comments');
                        if (!currentCommentList) throw new Error('无法找到当前评论列表');

                        // 获取新评论并添加到当前列表
                        const newComments = Array.from(newCommentList.children);
                        newComments.forEach(comment => {
                            // 检查评论ID是否已存在，避免重复添加
                            const commentId = comment.getAttribute('data-comment-id');
                            if (!commentId || !currentCommentList.querySelector(`[data-comment-id="${commentId}"]`)) {
                                currentCommentList.appendChild(comment.cloneNode(true));
                            }
                        });

                        // 处理新加载评论中的评论菜单挂载点
                        setupCommentButtons(iframeDoc);

                        // 更新分页控件
                        updatePagination(newDoc);

                        // 处理引用和回复按钮
                        // setupCommentButtons(iframeDoc); -- 已移除

                        // 更新URL(但不刷新页面)
                        if (iframe.contentWindow.history && iframe.contentWindow.history.replaceState) {
                            iframe.contentWindow.history.replaceState({}, '', nextPageLink.href);
                        }

                        // 检查是否有下一页
                        const hasNextPage = newDoc.querySelector('.pager-next');
                        if (!hasNextPage) {
                            noMoreComments = true;
                            // 移除底部分页控件，因为已经加载了所有评论
                            const bottomPager = commentContainer.querySelector('.post-bottom-pager');
                            if (bottomPager) {
                                bottomPager.style.display = 'none';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('加载下一页评论失败:', error);
                    })
                    .finally(() => {
                        isLoading = false;
                        loadingIndicator.style.display = 'none';
                    });
            }

            // 更新分页控件
            function updatePagination(newDoc) {
                // 获取新页面的顶部和底部分页控件
                const newTopPager = newDoc.querySelector('.post-top-pager');
                const newBottomPager = newDoc.querySelector('.post-bottom-pager');

                // 获取当前页面的顶部和底部分页控件
                const curTopPager = commentContainer.querySelector('.post-top-pager');
                const curBottomPager = commentContainer.querySelector('.post-bottom-pager');

                // 更新顶部分页控件
                if (newTopPager && curTopPager) {
                    curTopPager.innerHTML = newTopPager.innerHTML;
                }

                // 更新底部分页控件
                if (newBottomPager && curBottomPager) {
                    curBottomPager.innerHTML = newBottomPager.innerHTML;
                }
            }
        }

        // 获取所有分页链接 - 保留原有的点击处理，作为备选
        const paginationLinks = iframeDoc.querySelectorAll('.nsk-pager a');

        if (paginationLinks.length === 0) return;

        // 拦截所有分页链接点击事件
        paginationLinks.forEach(link => {
            link.addEventListener('click', async function (e) {
                e.preventDefault();

                // 显示加载状态
                const pageContent = iframeDoc.querySelector('.comment-container');
                if (pageContent) {
                    // 创建加载指示器
                    const loadingIndicator = iframeDoc.createElement('div');
                    loadingIndicator.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.8);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    `;

                    const spinner = iframeDoc.createElement('div');
                    spinner.style.cssText = `
                        width: 40px;
                        height: 40px;
                        border: 4px solid var(--ns-loader-border);
                        border-top: 4px solid #2ea44f;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    `;

                    // 添加动画样式
                    const animStyle = iframeDoc.createElement('style');
                    animStyle.textContent = `                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `;
                    iframeDoc.head.appendChild(animStyle);

                    loadingIndicator.appendChild(spinner);

                    // 设置相对定位以便于放置加载指示器
                    if (window.getComputedStyle(pageContent).position === 'static') {
                        pageContent.style.position = 'relative';
                    }

                    pageContent.appendChild(loadingIndicator);
                }

                const targetUrl = this.href;
                try {
                    // 使用fetch异步获取新页面内容
                    const response = await fetch(targetUrl);
                    if (!response.ok) throw new Error('网络响应不正常');

                    const htmlText = await response.text();

                    // 创建临时DOM解析HTML
                    const parser = new DOMParser();
                    const newDoc = parser.parseFromString(htmlText, 'text/html');

                    // 提取主要内容区域
                    const newContent = newDoc.querySelector('.comment-container');
                    if (!newContent) throw new Error('无法找到评论内容');

                    // 获取当前评论容器
                    const currentContent = iframeDoc.querySelector('.comment-container');
                    if (currentContent) {
                        // 替换内容
                        currentContent.innerHTML = newContent.innerHTML;

                        // 更新页面URL(但不刷新页面)
                        if (iframe.contentWindow.history && iframe.contentWindow.history.pushState) {
                            iframe.contentWindow.history.pushState({}, '', targetUrl);
                        }

                        // 重新绑定新页面中的分页链接
                        setupPagination(iframeDoc, iframe);

                        // 移除评论区内可能存在的旧表情搜索框，避免重复添加
                        const oldSearchContainers = iframeDoc.querySelectorAll('.ns-emoji-search');
                        oldSearchContainers.forEach(container => {
                            if (container && container.parentNode) {
                                container.parentNode.removeChild(container);
                            }
                        });

                        // 添加表情包搜索功能到新页面的评论框
                        addEmojiSearchToCommentBox(iframeDoc);

                        // 处理引用和回复按钮
                        // setupCommentButtons(iframeDoc); -- 已移除

                        // 翻页后滚动到顶部
                        iframeDoc.documentElement.scrollTop = 0;

                        // 触发滚动事件，以便更新按钮状态
                        const scrollEvent = new Event('scroll');
                        iframeDoc.dispatchEvent(scrollEvent);
                    } else {
                        throw new Error('无法找到当前评论容器');
                    }
                } catch (error) {
                    console.error('异步加载页面失败:', error);
                    // 加载失败时回退到传统导航方式
                    iframe.src = targetUrl;
                }

                // 删除加载指示器
                const loadingIndicator = iframeDoc.querySelector('.comment-container > div[style*="position: absolute"]');
                if (loadingIndicator) {
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                }
            });
        });
    }



    // 当DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 添加一个新函数，用于创建和显示浮动评论框
    function showFloatingCommentBox(iframeDoc) {
        // 检查是否已存在浮动评论框
        let floatingBox = iframeDoc.querySelector('.ns-floating-comment-box');
        let backdrop = iframeDoc.querySelector('.ns-comment-backdrop');

        // 如果不存在，创建浮动评论框
        if (!floatingBox) {
            // 创建背景遮罩
            backdrop = iframeDoc.createElement('div');
            backdrop.className = 'ns-comment-backdrop';
            iframeDoc.body.appendChild(backdrop);

            // 创建浮动评论框
            floatingBox = iframeDoc.createElement('div');
            floatingBox.className = 'ns-floating-comment-box';

            // 创建评论框头部（标题和关闭按钮）
            const header = iframeDoc.createElement('div');
            header.className = 'ns-floating-comment-header';

            const title = iframeDoc.createElement('div');
            title.className = 'ns-floating-comment-title';
            title.textContent = '发表评论';

            const closeBtn = iframeDoc.createElement('div');
            closeBtn.className = 'ns-floating-comment-close';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = () => {
                floatingBox.classList.remove('active');
                backdrop.classList.remove('active');
            };

            header.appendChild(title);
            header.appendChild(closeBtn);
            floatingBox.appendChild(header);

            // 查找页面中的评论编辑器
            const originalEditor = iframeDoc.querySelector('.md-editor');
            if (originalEditor) {
                // 克隆评论编辑器到浮动框
                const editorClone = originalEditor.cloneNode(true);

                // 处理克隆的编辑器中的事件和交互
                // 设置提交评论按钮的点击事件
                const submitBtn = editorClone.querySelector('.submit.btn');
                if (submitBtn) {
                    submitBtn.onclick = (e) => {
                        // 获取原始提交按钮并触发点击
                        const originalSubmitBtn = originalEditor.querySelector('.submit.btn');
                        if (originalSubmitBtn) {
                            // 将浮动编辑器中的内容复制到原始编辑器
                            // 这里需要特殊处理CodeMirror编辑器
                            try {
                                const textContent = editorClone.querySelector('textarea')?.value;
                                if (textContent) {
                                    // 找到原编辑器中的CodeMirror实例
                                    const cmElement = originalEditor.querySelector('.CodeMirror');
                                    if (cmElement && cmElement.CodeMirror) {
                                        // 在原编辑器中设置内容
                                        cmElement.CodeMirror.setValue(textContent);
                                    }
                                }
                                // 点击原始提交按钮
                                originalSubmitBtn.click();
                                // 关闭浮动框
                                floatingBox.classList.remove('active');
                                backdrop.classList.remove('active');
                            } catch (e) {
                                console.error('无法提交评论:', e);
                            }
                        }
                    };
                }

                floatingBox.appendChild(editorClone);

                // 添加表情包搜索框
                addEmojiSearchToCommentBox(floatingBox);
            } else {
                // 没有找到评论编辑器，显示提示信息
                const message = iframeDoc.createElement('div');
                message.style.padding = '20px';
                message.style.textAlign = 'center';
                message.style.color = 'var(--ns-card-secondary-text)';
                message.textContent = '未找到评论编辑器，请尝试滚动到页面底部';
                floatingBox.appendChild(message);
            }

            // 添加浮动评论框到文档
            iframeDoc.body.appendChild(floatingBox);

            // 点击背景遮罩关闭评论框
            backdrop.onclick = () => {
                floatingBox.classList.remove('active');
                backdrop.classList.remove('active');
            };
        }

        // 显示评论框
        setTimeout(() => {
            backdrop.classList.add('active');
            floatingBox.classList.add('active');

            // 尝试让编辑器获得焦点
            const textarea = floatingBox.querySelector('textarea');
            if (textarea) {
                textarea.focus();
            }
        }, 50);
    }

    // 添加一个切换浮动评论框显示/隐藏的函数
    function toggleFloatingCommentBox(iframeDoc) {
        let originalEditor = iframeDoc.querySelector('.md-editor');

        // 如果没有找到评论编辑器，直接返回
        if (!originalEditor) {
            console.log('未找到评论编辑器');
            return;
        }

        // 判断编辑器是否已经是固定状态
        if (originalEditor.classList.contains('ns-fixed-editor')) {
            // 如果是，取消固定
            unfixEditor();
        } else {
            // 如果不是，设置为固定
            fixEditor();
        }

        // 设置为固定定位
        function fixEditor() {
            // 创建占位符（如果不存在）
            let editorPlaceholder = iframeDoc.getElementById('ns-editor-placeholder');
            if (!editorPlaceholder) {
                editorPlaceholder = iframeDoc.createElement('div');
                editorPlaceholder.id = 'ns-editor-placeholder';
                editorPlaceholder.className = 'ns-editor-placeholder';
                editorPlaceholder.textContent = '评论编辑器已固定在视图中...';

                // 插入占位符
                originalEditor.parentNode.insertBefore(editorPlaceholder, originalEditor.nextSibling);
            }

            // 显示占位符
            editorPlaceholder.style.display = 'block';

            // 将编辑器设置为固定定位
            originalEditor.classList.add('ns-fixed-editor');

            // 尝试让编辑器获得焦点
            try {
                const cmEditor = originalEditor.querySelector('.CodeMirror');
                if (cmEditor && cmEditor.CodeMirror) {
                    setTimeout(() => {
                        cmEditor.CodeMirror.focus();
                        cmEditor.CodeMirror.refresh();
                    }, 100);
                }
            } catch (e) {
                console.error('无法使编辑器获得焦点:', e);
            }

            // 添加ESC键监听
            iframeDoc.addEventListener('keydown', escKeyHandler);
        }

        // 取消固定定位
        function unfixEditor() {
            // 移除fixed类
            originalEditor.classList.remove('ns-fixed-editor');

            // 隐藏占位符
            const editorPlaceholder = iframeDoc.getElementById('ns-editor-placeholder');
            if (editorPlaceholder) {
                editorPlaceholder.style.display = 'none';
            }

            // 移除ESC键监听
            iframeDoc.removeEventListener('keydown', escKeyHandler);
        }

        // ESC键处理函数
        function escKeyHandler(e) {
            if (e.key === 'Escape' && originalEditor.classList.contains('ns-fixed-editor')) {
                unfixEditor();
            }
        }
    }

    // 处理评论菜单按钮
    function setupCommentButtons(iframeDoc) {
        // 处理已有的评论菜单
        const commentMenus = iframeDoc.querySelectorAll('.comment-menu');
        processExistingMenus(commentMenus);

        // 处理需要挂载的评论菜单
        const commentMenuMounts = iframeDoc.querySelectorAll('.comment-menu-mount');
        processMenuMounts(commentMenuMounts);

        // 获取data-v属性值
        function getDataVAttribute() {
            // 尝试从现有菜单获取data-v属性
            const existingMenu = iframeDoc.querySelector('.comment-menu[data-v]');
            if (existingMenu) {
                // 找到所有data-v-开头的属性
                for (let attr of existingMenu.attributes) {
                    if (attr.name.startsWith('data-v-')) {
                        return attr.name;
                    }
                }
            }
            // 默认使用已知的属性名
            return 'data-v-372de460';
        }

        // 处理已有的评论菜单
        function processExistingMenus(menus) {
            menus.forEach(menu => {
                // 跳过已处理的菜单
                if (menu.getAttribute('data-ns-processed')) return;

                // 标记为已处理
                menu.setAttribute('data-ns-processed', 'true');

                // 获取评论ID
                const commentLi = menu.closest('li[data-comment-id]');
                if (!commentLi) return;

                const commentIdStr = commentLi.getAttribute('data-comment-id');
                if (!commentIdStr) return;

                // 确保commentId是整数
                const commentId = parseInt(commentIdStr, 10);
                if (isNaN(commentId)) return;

                // 获取各个按钮
                const likeBtn = menu.querySelector('.menu-item [href="#chicken-leg"]')?.closest('.menu-item');
                const dislikeBtn = menu.querySelector('.menu-item [href="#bad-one"]')?.closest('.menu-item');
                const quoteBtn = menu.querySelector('.menu-item [href="#quote"]')?.closest('.menu-item');
                const replyBtn = menu.querySelector('.menu-item [href="#back"]')?.closest('.menu-item');

                // 绑定按钮事件
                bindMenuButtonEvents(commentId, commentLi, likeBtn, dislikeBtn, quoteBtn, replyBtn);
            });
        }

        // 处理需要挂载的评论菜单
        function processMenuMounts(mounts) {
            // 获取data-v属性
            const dataVAttr = getDataVAttribute();

            mounts.forEach(mount => {
                // 跳过已处理的挂载点
                if (mount.getAttribute('data-ns-processed')) return;

                // 标记为已处理
                mount.setAttribute('data-ns-processed', 'true');

                // 获取评论ID
                const commentLi = mount.closest('li[data-comment-id]');
                if (!commentLi) return;

                const commentIdStr = commentLi.getAttribute('data-comment-id');
                if (!commentIdStr) return;

                // 确保commentId是整数
                const commentId = parseInt(commentIdStr, 10);
                if (isNaN(commentId)) return;

                // 创建评论菜单HTML
                mount.className = 'comment-menu';
                // 添加data-v属性
                mount.setAttribute(dataVAttr, '');

                mount.innerHTML = `
                    <div title="加鸡腿" class="menu-item" ${dataVAttr}>
                        <svg class="iconpark-icon" ${dataVAttr}><use href="#chicken-leg"></use></svg>
                        <span ${dataVAttr}>0</span>
                    </div>
                    <div title="反对" class="menu-item" ${dataVAttr}>
                        <svg class="iconpark-icon" ${dataVAttr}><use href="#bad-one"></use></svg>
                        <span ${dataVAttr}>0</span>
                    </div>
                    <div class="menu-item" ${dataVAttr}>
                        <svg class="iconpark-icon" ${dataVAttr}><use href="#quote"></use></svg>
                        <span ${dataVAttr}>引用</span>
                    </div>
                    <div class="menu-item" ${dataVAttr}>
                        <svg class="iconpark-icon" ${dataVAttr}><use href="#back"></use></svg>
                        <span ${dataVAttr}>回复</span>
                    </div>
                `;

                // 获取各个按钮
                const likeBtn = mount.querySelector('.menu-item [href="#chicken-leg"]')?.closest('.menu-item');
                const dislikeBtn = mount.querySelector('.menu-item [href="#bad-one"]')?.closest('.menu-item');
                const quoteBtn = mount.querySelector('.menu-item [href="#quote"]')?.closest('.menu-item');
                const replyBtn = mount.querySelector('.menu-item [href="#back"]')?.closest('.menu-item');

                // 绑定按钮事件
                bindMenuButtonEvents(commentId, commentLi, likeBtn, dislikeBtn, quoteBtn, replyBtn);
            });
        }

        // 绑定菜单按钮事件
        function bindMenuButtonEvents(commentId, commentLi, likeBtn, dislikeBtn, quoteBtn, replyBtn) {
            // 加鸡腿功能
            if (likeBtn) {
                likeBtn.addEventListener('click', async () => {
                    // 创建确认对话框
                    const confirmDialog = createConfirmDialog(iframeDoc, '是否投喂鸡腿，本次投喂免费');

                    // 点击确认
                    confirmDialog.querySelector('.msc-ok').addEventListener('click', async () => {
                        try {
                            // 发送加鸡腿请求
                            const response = await fetch('https://www.nodeseek.com/api/statistics/like', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                body: JSON.stringify({
                                    commentId: commentId, // 这里已确保是整数
                                    action: 'add'
                                }),
                                credentials: 'include'
                            });

                            const result = await response.json();

                            // 检查响应结果
                            if (result.success === false) {
                                // 创建错误提示对话框
                                const errorDialog = createErrorDialog(iframeDoc, result.message || '操作失败');

                                // 点击确认关闭对话框
                                errorDialog.querySelector('.msc-ok').addEventListener('click', () => {
                                    iframeDoc.body.removeChild(errorDialog);
                                });

                                // 添加错误对话框到文档
                                iframeDoc.body.appendChild(errorDialog);
                            } else {
                                // 成功时更新数量显示和按钮状态
                                // 更新为服务器返回的数量，而不是简单地+1
                                const countSpan = likeBtn.querySelector('span');
                                if (countSpan && result.current) {
                                    countSpan.textContent = result.current.toString();
                                }
                                // 添加clicked类表示已点击
                                likeBtn.classList.add('clicked');
                            }
                        } catch (error) {
                            console.error('加鸡腿失败:', error);
                        }

                        // 移除确认对话框
                        iframeDoc.body.removeChild(confirmDialog);
                    });

                    // 点击取消
                    confirmDialog.querySelector('.msc-cancel').addEventListener('click', () => {
                        iframeDoc.body.removeChild(confirmDialog);
                    });

                    // 点击关闭
                    confirmDialog.querySelector('.msc-close').addEventListener('click', () => {
                        iframeDoc.body.removeChild(confirmDialog);
                    });

                    // 添加确认对话框到文档
                    iframeDoc.body.appendChild(confirmDialog);
                });
            }

            // 反对功能
            if (dislikeBtn) {
                dislikeBtn.addEventListener('click', async () => {
                    // 创建确认对话框
                    const confirmDialog = createConfirmDialog(iframeDoc, '是否反对此评论');

                    // 点击确认
                    confirmDialog.querySelector('.msc-ok').addEventListener('click', async () => {
                        try {
                            // 发送反对请求
                            const response = await fetch('https://www.nodeseek.com/api/statistics/dislike', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                body: JSON.stringify({
                                    commentId: commentId, // 这里已确保是整数
                                    action: 'add'
                                }),
                                credentials: 'include'
                            });

                            const result = await response.json();

                            // 检查响应结果
                            if (result.success === false) {
                                // 创建错误提示对话框
                                const errorDialog = createErrorDialog(iframeDoc, result.message || '操作失败');

                                // 点击确认关闭对话框
                                errorDialog.querySelector('.msc-ok').addEventListener('click', () => {
                                    iframeDoc.body.removeChild(errorDialog);
                                });

                                // 添加错误对话框到文档
                                iframeDoc.body.appendChild(errorDialog);
                            } else {
                                // 成功时更新数量显示和按钮状态
                                // 更新为服务器返回的数量，而不是简单地+1
                                const countSpan = dislikeBtn.querySelector('span');
                                if (countSpan && result.current) {
                                    countSpan.textContent = result.current.toString();
                                }
                                // 添加clicked类表示已点击
                                dislikeBtn.classList.add('clicked');
                            }
                        } catch (error) {
                            console.error('反对失败:', error);
                        }

                        // 移除确认对话框
                        iframeDoc.body.removeChild(confirmDialog);
                    });

                    // 点击取消
                    confirmDialog.querySelector('.msc-cancel').addEventListener('click', () => {
                        iframeDoc.body.removeChild(confirmDialog);
                    });

                    // 点击关闭
                    confirmDialog.querySelector('.msc-close').addEventListener('click', () => {
                        iframeDoc.body.removeChild(confirmDialog);
                    });

                    // 添加确认对话框到文档
                    iframeDoc.body.appendChild(confirmDialog);
                });
            }

            // 引用功能
            if (quoteBtn) {
                quoteBtn.addEventListener('click', () => {
                    // 获取评论内容
                    const postContent = commentLi.querySelector('.post-content');
                    if (!postContent) return;

                    // 获取用户名
                    const authorName = commentLi.querySelector('.author-name');
                    const username = authorName ? authorName.textContent.trim() : '用户';

                    // 获取评论文本
                    const contentText = postContent.textContent.trim();

                    // 创建引用Markdown
                    let quoteText = `> @${username} #${commentLi.querySelector('.floor-link')?.textContent || ''}\n`;
                    const contentLines = contentText.split('\n').map(line => `> ${line}`);
                    quoteText += contentLines.join('\n') + '\n\n';

                    // 找到编辑器并插入引用内容
                    const editorArea = iframeDoc.querySelector('.md-editor');
                    if (editorArea) {
                        const cmElement = editorArea.querySelector('.CodeMirror');
                        if (cmElement && cmElement.CodeMirror) {
                            const cm = cmElement.CodeMirror;
                            const cursor = cm.getCursor();
                            cm.replaceRange(quoteText, cursor);
                            cm.focus();

                            // 滚动到编辑器
                            editorArea.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }

            // 回复功能
            if (replyBtn) {
                replyBtn.addEventListener('click', () => {
                    // 获取用户名
                    const authorName = commentLi.querySelector('.author-name');
                    const username = authorName ? authorName.textContent.trim() : '用户';

                    // 创建@回复
                    const replyText = `@${username} `;

                    // 找到编辑器并插入回复内容
                    const editorArea = iframeDoc.querySelector('.md-editor');
                    if (editorArea) {
                        const cmElement = editorArea.querySelector('.CodeMirror');
                        if (cmElement && cmElement.CodeMirror) {
                            const cm = cmElement.CodeMirror;
                            const cursor = cm.getCursor();
                            cm.replaceRange(replyText, cursor);
                            cm.focus();

                            // 滚动到编辑器
                            editorArea.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }
        }
    }

    // 创建确认对话框
    function createConfirmDialog(doc, title) {
        const dialog = doc.createElement('div');
        dialog.className = 'msc-confirm';
        dialog.style.display = 'block';

        dialog.innerHTML = `
            <div class="msc-overlay"><button class="msc-close">×</button></div>
            <div class="msc-content msc-confirm--animate">
                <h3 class="msc-title">${title}</h3>
                <div class="msc-body"><p class="msc-sub"></p></div>
                <div class="msc-action">
                    <button class="msc-ok">OK</button>
                    <button class="msc-cancel">Cancel</button>
                </div>
            </div>
        `;

        return dialog;
    }

    // 创建错误提示对话框（只有OK按钮）
    function createErrorDialog(doc, title) {
        const dialog = doc.createElement('div');
        dialog.className = 'msc-confirm';
        dialog.style.display = 'block';

        dialog.innerHTML = `
            <div class="msc-overlay"></div>
            <div class="msc-content msc-confirm--animate">
                <h3 class="msc-title">${title}</h3>
                <div class="msc-body"><p class="msc-sub"></p></div>
                <div class="msc-action">
                    <button class="msc-ok">OK</button>
                </div>
            </div>
        `;

        return dialog;
    }

    // 添加回到顶部和底部按钮功能
    function addScrollButtons(iframeDoc) {
        // 检查是否已存在滚动按钮
        if (iframeDoc.querySelector('.ns-scroll-btns')) return;

        // 创建按钮容器
        const scrollBtns = iframeDoc.createElement('div');
        scrollBtns.className = 'ns-scroll-btns';

        // 创建回到顶部按钮
        const topBtn = iframeDoc.createElement('div');
        topBtn.className = 'ns-scroll-btn ns-to-top hidden';
        topBtn.title = '回到顶部';
        topBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;

        // 创建回到底部按钮
        const bottomBtn = iframeDoc.createElement('div');
        bottomBtn.className = 'ns-scroll-btn ns-to-bottom hidden';
        bottomBtn.title = '回到底部';
        bottomBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;

        // 添加按钮到容器
        scrollBtns.appendChild(topBtn);
        scrollBtns.appendChild(bottomBtn);

        // 添加按钮容器到文档
        iframeDoc.body.appendChild(scrollBtns);

        // 回到顶部功能
        topBtn.addEventListener('click', () => {
            iframeDoc.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // 回到底部功能
        bottomBtn.addEventListener('click', () => {
            const scrollHeight = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.documentElement.scrollHeight
            );

            iframeDoc.documentElement.scrollTo({
                top: scrollHeight,
                behavior: 'smooth'
            });
        });

        // 监听滚动事件，控制按钮显示/隐藏
        function updateButtonVisibility() {
            const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop;
            const windowHeight = iframeDoc.documentElement.clientHeight;
            const docHeight = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.documentElement.scrollHeight
            );

            // 计算距离顶部和底部的距离
            const distanceFromTop = scrollTop;
            const distanceFromBottom = docHeight - (scrollTop + windowHeight);

            // 顶部按钮：当滚动超过300px时显示
            if (distanceFromTop > 300) {
                topBtn.classList.remove('hidden');
            } else {
                topBtn.classList.add('hidden');
            }

            // 底部按钮：当距离底部超过300px时显示
            if (distanceFromBottom > 300) {
                bottomBtn.classList.remove('hidden');
            } else {
                bottomBtn.classList.add('hidden');
            }
        }

        // 页面加载时更新按钮状态
        updateButtonVisibility();

        // 监听滚动事件
        iframeDoc.addEventListener('scroll', updateButtonVisibility);

        // 适应页面大小变化
        iframeDoc.defaultView.addEventListener('resize', updateButtonVisibility);

        return scrollBtns;
    }

    // 创建回复面板
    function createReplyPanel(postId, postTitle) {
        const panel = document.createElement('div');
        panel.className = 'ns-list-reply-panel';
        panel.setAttribute('data-post-id', postId);

        // 面板头部
        const header = document.createElement('div');
        header.className = 'ns-list-reply-header';

        const title = document.createElement('div');
        title.className = 'ns-list-reply-title';
        title.textContent = `回复: ${postTitle}`;

        const closeBtn = document.createElement('div');
        closeBtn.className = 'ns-list-reply-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', function () {
            panel.classList.remove('active');
            // 移除背景遮罩
            const backdrop = document.querySelector('.ns-backdrop');
            if (backdrop) {
                document.body.removeChild(backdrop);
            }
        });

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 快捷回复按钮
        const quickReplies = document.createElement('div');
        quickReplies.className = 'ns-list-quick-replies';

        // 定义快捷回复内容
        const quickReplyTexts = ['bd', '前排', '牛逼', '好鸡', '围观', '支持'];

        quickReplyTexts.forEach(text => {
            const btn = document.createElement('div');
            btn.className = 'ns-list-quick-reply-btn';
            btn.textContent = text;
            btn.addEventListener('click', function () {
                textarea.value = text;
            });
            quickReplies.appendChild(btn);
        });

        // 文本输入框
        const textarea = document.createElement('textarea');
        textarea.className = 'ns-list-reply-textarea';
        textarea.placeholder = '输入回复内容... / 支持直接粘贴截图';

        // ========== 新增：上传图片按钮 ==========
        const uploadImgBtn = document.createElement('button');
        uploadImgBtn.type = 'button';
        uploadImgBtn.className = 'ns-list-upload-img-btn';
        uploadImgBtn.innerHTML = '🖼️ 上传图片';
        uploadImgBtn.style.marginRight = '8px';
        uploadImgBtn.title = '上传图片';

        // 隐藏的文件选择框
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        uploadImgBtn.addEventListener('click', function () {
            fileInput.value = '';
            fileInput.click();
        });

        fileInput.addEventListener('change', function () {
            if (fileInput.files && fileInput.files[0]) {
                handleImageUpload(fileInput.files[0]);
            }
        });

        // ========== 新增：粘贴图片支持 ==========
        textarea.addEventListener('paste', function (e) {
            if (e.clipboardData && e.clipboardData.items) {
                for (let i = 0; i < e.clipboardData.items.length; i++) {
                    const item = e.clipboardData.items[i];
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            e.preventDefault();
                            handleImageUpload(file);
                        }
                    }
                }
            }
        });

        // ========== 新增：图片上传处理函数 ==========
        function handleImageUpload(file) {
            if (!file || !file.type.startsWith('image/')) return;
            // 显示上传中提示
            const oldValue = textarea.value;
            const cursorPos = textarea.selectionStart;
            const uploadingText = '\n![图片上传中...](正在上传)\n';
            textarea.value = oldValue.slice(0, cursorPos) + uploadingText + oldValue.slice(cursorPos);
            // 记录插入位置
            const insertPos = cursorPos;

            // 用GM_xmlhttpRequest上传图片
            const formData = new FormData();
            formData.append('image', file);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://imgdd.com/upload',
                data: formData,
                responseType: 'json',
                onload: function (response) {
                    let url = '';
                    if (response.status === 200 && response.response && response.response.url) {
                        url = response.response.url;
                    } else if (response.responseText) {
                        try {
                            const data = JSON.parse(response.responseText);
                            url = data.url;
                        } catch { }
                    }
                    if (url) {
                        // 替换"上传中"那一行
                        const before = textarea.value.slice(0, insertPos);
                        const after = textarea.value.slice(insertPos + uploadingText.length);
                        textarea.value = before + `![图片](${url})\n` + after;
                    } else {
                        // 上传失败，只弹窗，不插入任何内容
                        const before = textarea.value.slice(0, insertPos);
                        const after = textarea.value.slice(insertPos + uploadingText.length);
                        textarea.value = before + after;
                        alert('图片上传失败');
                    }
                },
                onerror: function () {
                    // 上传失败，只弹窗，不插入任何内容
                    const before = textarea.value.slice(0, insertPos);
                    const after = textarea.value.slice(insertPos + uploadingText.length);
                    textarea.value = before + after;
                    alert('图片上传失败');
                }
            });
        }

        // 表情包按钮和提交按钮
        const buttonRow = document.createElement('div');
        buttonRow.className = 'ns-list-reply-btns';

        const emojiBtn = document.createElement('button');
        emojiBtn.className = 'ns-list-emoji-btn';
        emojiBtn.innerHTML = '😊 表情';

        // 表情包结果容器
        const emojiResults = document.createElement('div');
        emojiResults.className = 'ns-list-emoji-results';

        // 表情包按钮点击事件
        emojiBtn.addEventListener('click', async function () {
            // 检查是否已经有表情包数据
            if (emojiResults.children.length === 0) {
                // 显示加载中
                emojiResults.innerHTML = '<div style="width:100%;text-align:center;padding:10px;">加载表情包中...</div>';
                emojiResults.style.display = 'flex';

                // 搜索表情包
                const response = await searchEmojis("");

                // 显示结果
                if (response.error || response.data.length === 0) {
                    emojiResults.innerHTML = `<div style="width:100%;text-align:center;padding:10px;">${response.error || '加载表情包失败'}</div>`;
                    return;
                }

                // 清空结果容器
                emojiResults.innerHTML = '';

                // 添加表情包
                response.data.forEach(emoji => {
                    const emojiItem = document.createElement('div');
                    emojiItem.className = 'ns-list-emoji-item';

                    const img = document.createElement('img');
                    img.src = emoji.url;
                    img.setAttribute('data-url', emoji.url);
                    img.setAttribute('title', `${emoji.width}x${emoji.height} ${(emoji.size / 1024).toFixed(1)}KB`);

                    // 添加加载错误处理
                    img.onerror = function () {
                        this.onerror = null;
                        this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E图片加载失败%3C%2Ftext%3E%3C%2Fsvg%3E';
                    };

                    emojiItem.appendChild(img);

                    // 点击表情包插入到输入框
                    emojiItem.addEventListener('click', function () {
                        const imgUrl = emoji.url;
                        const markdownImg = `![表情包](${imgUrl})`;

                        // 插入到光标位置或追加到末尾
                        const cursorPos = textarea.selectionStart;
                        const textBefore = textarea.value.substring(0, cursorPos);
                        const textAfter = textarea.value.substring(cursorPos);

                        textarea.value = textBefore + markdownImg + textAfter;

                        // 隐藏表情结果
                        emojiResults.style.display = 'none';
                    });

                    emojiResults.appendChild(emojiItem);
                });
            }

            // 切换表情包结果显示状态
            emojiResults.style.display = emojiResults.style.display === 'flex' ? 'none' : 'flex';
        });

        // 提交按钮
        const submitBtn = document.createElement('button');
        submitBtn.className = 'ns-list-submit-btn';
        submitBtn.textContent = '发送';
        submitBtn.addEventListener('click', function () {
            submitComment(postId, textarea.value, panel);
        });

        // 成功和错误消息容器
        const successMsg = document.createElement('div');
        successMsg.className = 'ns-reply-success';

        const errorMsg = document.createElement('div');
        errorMsg.className = 'ns-reply-error';

        // 组装面板
        buttonRow.appendChild(uploadImgBtn);
        buttonRow.appendChild(emojiBtn);
        buttonRow.appendChild(submitBtn);
        panel.appendChild(header);
        panel.appendChild(quickReplies);
        panel.appendChild(textarea);
        panel.appendChild(buttonRow);
        panel.appendChild(fileInput);
        panel.appendChild(emojiResults);
        panel.appendChild(successMsg);
        panel.appendChild(errorMsg);

        return panel;
    }

    // 定位回复面板
    function positionReplyPanel(panel, triggerElement) {
        // 不再需要根据按钮位置调整面板位置
        // 已通过CSS将面板固定在屏幕中央

        // 仅设置宽度的自适应调整
        if (window.innerWidth < 600) {
            panel.style.width = '90%';
        } else {
            panel.style.width = '400px';
        }
    }

    // 生成随机csrf-token，仅用于列表快捷回复
    function generateSecureCsrfToken(length) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from(array, byte => characters[byte % characters.length]).join('');
    }

    // 提交评论
    async function submitComment(postId, content, panel) {
        // 检查内容是否为空
        if (!content || content.trim() === '') {
            const errorMsg = panel.querySelector('.ns-reply-error');
            errorMsg.textContent = '评论内容不能为空';
            errorMsg.style.display = 'block';

            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 3000);

            return;
        }

        const successMsg = panel.querySelector('.ns-reply-success');
        const errorMsg = panel.querySelector('.ns-reply-error');
        const submitBtn = panel.querySelector('.ns-list-submit-btn');
        const textarea = panel.querySelector('.ns-list-reply-textarea');

        // 禁用提交按钮
        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';

        try {
            // 仅列表快捷回复使用随机csrf-token
            const csrfToken = generateSecureCsrfToken(16);
            // 发送评论请求
            const response = await fetch('https://www.nodeseek.com/api/content/new-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'csrf-token': csrfToken // 仅此处用随机token
                },
                body: JSON.stringify({
                    content: content,
                    mode: 'new-comment',
                    postId: postId
                }),
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                // 评论成功
                successMsg.textContent = '评论发送成功';
                successMsg.style.display = 'block';

                // 清空输入框
                textarea.value = '';

                // 3秒后关闭面板
                setTimeout(() => {
                    panel.classList.remove('active');
                    successMsg.style.display = 'none';

                    // 移除背景遮罩
                    const backdrop = document.querySelector('.ns-backdrop');
                    if (backdrop) {
                        document.body.removeChild(backdrop);
                    }
                }, 1000);
            } else {
                // 评论失败
                errorMsg.textContent = result.message || '评论发送失败';
                errorMsg.style.display = 'block';

                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('提交评论出错:', error);

            // 显示错误信息
            errorMsg.textContent = '网络错误，请稍后再试';
            errorMsg.style.display = 'block';

            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 3000);
        } finally {
            // 恢复提交按钮
            submitBtn.disabled = false;
            submitBtn.textContent = '发送';
        }
    }

})();

