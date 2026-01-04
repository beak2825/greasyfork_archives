// ==UserScript==
// @name         抖音视频合集专栏导出URL（文本版）
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  提取抖音视频合集专栏的URL，并添加复制所有信息的悬浮按钮
// @author       qqlcx5
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519379/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E4%B8%93%E6%A0%8F%E5%AF%BC%E5%87%BAURL%EF%BC%88%E6%96%87%E6%9C%AC%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519379/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E4%B8%93%E6%A0%8F%E5%AF%BC%E5%87%BAURL%EF%BC%88%E6%96%87%E6%9C%AC%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 存储提取到的视频合集信息
     * Array to store extracted video collection information
     * @type {Array<Object>}
     */
    let videoCollections = [];

    /**
     * 提取页面上的所有视频合集信息
     * Extracts all video collection information from the page
     */
    function extractVideoCollections() {
        // 根据页面的DOM结构，选择包含视频合集信息的容器
        // 请根据实际的DOM结构更新选择器
        const container = document.querySelector('div[data-e2e="aweme-mix"]');

        if (!container) {
            console.warn('未找到视频合集列表容器 (Video collection list container not found)');
            return;
        }

        // 选择所有视频合集列表项
        const collectionItems = container.querySelectorAll('ul > li.YGmRi0kR');

        if (collectionItems.length === 0) {
            console.warn('未找到任何视频合集 (No video collections found)');
            return;
        }

        videoCollections = []; // 清空之前的记录

        collectionItems.forEach((item, index) => {
            try {
                // 提取视频合集的链接
                const anchor = item.querySelector('a.uz1VJwFY');
                const collectionUrl = anchor ? anchor.href.trim() : null;

                // 提取视频合集的标题
                const titleElement = item.querySelector('.arnSiSbK'); // 请根据实际情况替换为准确的选择器
                const collectionTitle = titleElement ? titleElement.textContent.trim() : '未知合集';

                if (collectionUrl) {
                    videoCollections.push({
                        index: index + 1,
                        title: collectionTitle,
                        url: collectionUrl.startsWith('http') ? collectionUrl : `https:${collectionUrl}`
                    });
                }
            } catch (error) {
                console.error('提取视频合集信息时出错:', error);
            }
        });

        console.info(`提取到 ${videoCollections.length} 个视频合集。`);
    }

    /**
     * 复制所有视频合集的信息到剪贴板
     * Copies all video collection information to the clipboard
     */
    function copyAllCollectionsInfo() {
        extractVideoCollections();

        if (videoCollections.length === 0) {
            alert('未提取到任何视频合集信息，请确保页面已正确加载。');
            return;
        }

        // 将信息格式化为易读的文本
        const infoText = videoCollections.map(collection =>
            `序号: ${collection.index}\n标题: ${collection.title}\nURL: ${collection.url}`
        ).join('\n\n');

        // 复制到剪贴板
        GM_setClipboard(infoText);

        notifyUser(`已复制 ${videoCollections.length} 个视频合集的信息到剪贴板。`);
    }

    /**
     * 创建并添加悬浮复制按钮到页面
     * Creates and adds a floating copy button to the page
     */
    function createFloatingCopyButton() {
        const button = document.createElement('button');
        button.id = 'copy-collections-info-btn';
        button.textContent = '复制合集URL';

        // 样式设计 (Styling)
        Object.assign(button.style, {
            position: 'fixed',
            right: '20px',
            bottom: '250px',
            padding: '12px 20px',
            backgroundColor: '#409EFF',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: '10000',
            transition: 'background-color 0.3s, transform 0.3s',
        });

        // 鼠标悬停效果 (Hover Effects)
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#66b1ff';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#409EFF';
            button.style.transform = 'scale(1)';
        });

        // 点击事件 (Click Event)
        button.addEventListener('click', copyAllCollectionsInfo);

        // 添加按钮到页面主体 (Append button to the body)
        document.body.appendChild(button);
    }

    /**
     * 显示提示通知给用户
     * Displays a notification to the user
     * @param {string} message - 要显示的消息 (Message to display)
     */
    function notifyUser(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.textContent = message;

        // 样式设计 (Styling)
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '300px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '5px',
            opacity: '0',
            transition: 'opacity 0.5s',
            zIndex: '10000',
            fontSize: '13px',
            maxWidth: '300px',
            wordWrap: 'break-word',
        });

        document.body.appendChild(notification);

        // 触发动画
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100); // Slight delay to allow transition

        // 自动淡出和移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500); // 等待淡出完成
        }, 3000); // 显示3秒
    }

    /**
     * 初始化脚本
     * Initializes the userscript
     */
    function initializeScript() {
        createFloatingCopyButton();
        console.info('抖音视频合集专栏导出器已启用。');
    }

    // 等待页面内容加载完毕后初始化脚本
    // Wait for the DOM to be fully loaded before initializing
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeScript();
    } else {
        document.addEventListener('DOMContentLoaded', initializeScript);
    }

})();
