// ==UserScript==
// @name         Bilibili 动态视频提取器
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  在Bilibili动态页(t.bilibili.com)右侧创建一个可收起的工具面板，使用图标按钮扫描并提取视频的标题和链接，支持按“标题链接”格式批量复制。
// @author       Gemini Code Assist
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541487/Bilibili%20%E5%8A%A8%E6%80%81%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541487/Bilibili%20%E5%8A%A8%E6%80%81%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Icon Definitions ---
    const ICONS = {
        scan: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        copy: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    };

    let extractedVideos = []; // 用于存储提取的视频信息

    /**
     * 扫描当前页面的视频并更新UI
     */
    function scanAndDisplayVideos() {
        const resultsContainer = document.getElementById('bili-feed-extractor-results');
        const statusElement = document.getElementById('bili-feed-extractor-status');
        const copyButton = document.getElementById('bili-feed-copy-button');

        if (!resultsContainer || !statusElement) return;

        // 清空上一次的结果
        resultsContainer.innerHTML = '';
        extractedVideos = [];
        const seenLinks = new Set(); // 用于链接去重

        // B站动态页视频卡的CSS选择器，改为选择包含链接的<a>标签
        const videoCards = document.querySelectorAll('a.bili-dyn-card-video');

        videoCards.forEach(card => {
            // 'card' is now the <a> element
            const titleElement = card.querySelector('.bili-dyn-card-video__title');

            // 如果没有找到标题元素，则跳过
            if (!titleElement) {
                return;
            }

            const title = titleElement.innerText.trim();
            let link = card.href;

            // 健壮性检查。如果获取不到有效的链接，则跳过此卡片。
            if (typeof link !== 'string' || !link) {
                return; // 相当于 forEach 循环中的 'continue'
            }

            // 清理链接，去掉跟踪参数
            link = link.split('?')[0];

            // 去重
            if (title && !seenLinks.has(link)) {
                seenLinks.add(link); // Bug fix: was adding object instead of link string
                extractedVideos.push({ title, link });

                // 根据您的要求，此处不再将视频信息添加到面板的列表中。
                // 数据仍然会收集，以便“一键复制”功能可以正常工作。
            }
        });

        // 更新状态
        if (extractedVideos.length > 0) {
            statusElement.innerText = `扫描到 ${extractedVideos.length} 个视频。`;
            copyButton.disabled = false;
            copyButton.style.opacity = '1';
        } else {
            statusElement.innerText = '未扫描到视频。请尝试向下滚动页面再试。';
            copyButton.disabled = true;
            copyButton.style.opacity = '0.5';
        }
    }

    /**
     * 复制所有结果到剪贴板
     */
    function copyAllResults() {
        if (extractedVideos.length === 0) return;

        // 按照 "标题链接" 格式拼接，每个视频占一行
        const textToCopy = extractedVideos.map(v => `${v.title} ${v.link}`).join('\n');
        GM_setClipboard(textToCopy, 'text');

        const copyButton = document.getElementById('bili-feed-copy-button');
        copyButton.innerHTML = ICONS.check;
        copyButton.title = '已复制!';
        copyButton.disabled = true; // 暂时禁用以防重复点击

        setTimeout(() => {
            copyButton.innerHTML = ICONS.copy;
            copyButton.title = '一键复制所有信息';
            copyButton.disabled = false;
        }, 2000);
    }

    /**
     * 创建并注入UI面板
     */
    function createPanel() {
        const container = document.createElement('div');
        container.id = 'bili-feed-extractor-container';
        container.innerHTML = `
            <div id="bili-feed-extractor-header">
                <button id="bili-feed-toggle-button" title="收起/展开面板">收起</button>
            </div>
            <div id="bili-feed-extractor-body">
                <div class="button-group">
                    <button id="bili-feed-scan-button" title="扫描视频">${ICONS.scan}</button>
                    <button id="bili-feed-copy-button" title="一键复制所有信息" disabled>${ICONS.copy}</button>
                </div>
                <p id="bili-feed-extractor-status">尚未扫描</p>
                <hr>
                <div id="bili-feed-extractor-results"></div>
            </div>
        `;

        document.body.appendChild(container);
        addStyles(); // 添加样式

        // 绑定事件
        document.getElementById('bili-feed-scan-button').addEventListener('click', scanAndDisplayVideos);
        document.getElementById('bili-feed-copy-button').addEventListener('click', copyAllResults);

        const toggleButton = document.getElementById('bili-feed-toggle-button');
        const body = document.getElementById('bili-feed-extractor-body');
        toggleButton.addEventListener('click', () => {
            const isCollapsed = body.style.display === 'none';
            if (isCollapsed) {
                body.style.display = 'block';
                toggleButton.innerText = '收起';
            } else {
                body.style.display = 'none';
                toggleButton.innerText = '展开';
            }
        });


        // 初始时禁用复制按钮
        const copyButton = document.getElementById('bili-feed-copy-button');
        copyButton.style.opacity = '0.5';
    }

    /**
     * 添加UI样式
     */
    function addStyles() {
        GM_addStyle(`
            #bili-feed-extractor-container {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 50px;
                max-height: 70vh;
                background-color: #ffffff;
                border: 1px solid #e3e5e7;
                border-radius: 8px;
                padding: 16px;
                z-index: 9999;
                font-size: 14px;
                color: #18191c;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                transition: max-height 0.3s ease-in-out;
            }
            #bili-feed-extractor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            #bili-feed-extractor-container h3 {
                margin: 0;
                font-size: 16px;
                color: #fb7299;
            }
            #bili-feed-toggle-button {
                background: none;
                border: 1px solid #e3e5e7;
                color: #61666d;
                padding: 2px 8px;
                font-size: 12px;
                border-radius: 4px;
                cursor: pointer;
            }
            #bili-feed-toggle-button:hover {
                background-color: #f1f2f3;
            }
            #bili-feed-extractor-container .button-group {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            #bili-feed-extractor-container .button-group button {
                width: 42px;
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #00a1d6;
                color: white;
                border: none;
                padding: 0;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.2s, opacity 0.2s;
            }
            #bili-feed-extractor-container button:hover:not(:disabled) {
                background-color: #00b5e5;
            }
            #bili-feed-extractor-container button:disabled {
                cursor: not-allowed;
            }
            #bili-feed-extractor-container #bili-feed-extractor-status {
                text-align: center;
                color: #61666d;
                font-size: 12px;
                margin: 0;
            }
            #bili-feed-extractor-container hr {
                border: none;
                border-top: 1px solid #e3e5e7;
                margin: 12px 0;
            }
            #bili-feed-extractor-results {
                overflow-y: auto;
                flex-grow: 1;
            }
            #bili-feed-extractor-results .video-item {
                border-bottom: 1px solid #f1f2f3;
                padding-bottom: 10px;
                margin-bottom: 10px;
            }
            #bili-feed-extractor-results .video-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            #bili-feed-extractor-results p {
                margin: 0 0 5px 0;
                word-wrap: break-word;
                line-height: 1.5;
            }
            #bili-feed-extractor-results strong {
                color: #61666d;
            }
            #bili-feed-extractor-results a {
                color: #00a1d6;
                text-decoration: none;
            }
            #bili-feed-extractor-results a:hover {
                text-decoration: underline;
            }
        `);
    }

    // 页面加载后直接创建面板
    createPanel();

})();
