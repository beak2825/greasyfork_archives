// ==UserScript==
// @name         抖音关注作者提取 (简洁版) 
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  打开抖音关注作者列表弹窗，滚动到底部， 提取抖音用户关注的所有作者的信息，并提供复制为JSON和下载JSON的悬浮按钮
// @author       qqlcx5
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519364/%E6%8A%96%E9%9F%B3%E5%85%B3%E6%B3%A8%E4%BD%9C%E8%80%85%E6%8F%90%E5%8F%96%20%28%E7%AE%80%E6%B4%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519364/%E6%8A%96%E9%9F%B3%E5%85%B3%E6%B3%A8%E4%BD%9C%E8%80%85%E6%8F%90%E5%8F%96%20%28%E7%AE%80%E6%B4%81%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 存储提取到的作者信息
     * Stores the extracted author information
     */
    let authorInfoList = [];

    /**
     * 提取用户关注的所有作者信息
     * Extracts all followed authors' information from the user's profile page
     */
    function extractAuthorInfo() {
        // 定义关注作者列表的容器选择器
        const containerSelector = 'div[data-e2e="user-fans-container"]';
        const container = document.querySelector(containerSelector);

        if (!container) {
            console.warn('未找到关注作者的容器元素 (Followed authors container not found)');
            return;
        }

        // 定义每个作者信息的项选择器
        // 根据提供的DOM结构，每个作者的信息在 `div.i5U4dMnB` 中
        const authorItems = container.querySelectorAll('div.i5U4dMnB');

        if (!authorItems.length) {
            console.warn('未找到任何关注作者的信息项 (No followed authors found)');
            return;
        }

        authorInfoList = Array.from(authorItems).map(item => {
            // 提取个人主页链接
            const linkElement = item.querySelector('a.uz1VJwFY');
            const profileUrl = linkElement
                ? (linkElement.href.startsWith('http') ? linkElement.href : `https:${linkElement.href}`)
                : 'N/A';

            // 提取用户名
            const nameElement = item.querySelector('a.uz1VJwFY > span > span.arnSiSbK span span span span');
            const username = nameElement ? nameElement.textContent.trim() : 'N/A';

            // 提取头像图片链接
            const avatarImg = item.querySelector('span[data-e2e="live-avatar"] img');
            const avatarUrl = avatarImg
                ? (avatarImg.src.startsWith('http') ? avatarImg.src : `https:${avatarImg.src}`)
                : 'N/A';

            // 提取用户简介
            const descriptionElement = item.querySelector('div.B_5R_Mpq span.arnSiSbK span span span span');
            const description = descriptionElement ? descriptionElement.textContent.trim() : 'N/A';

            return {
                username,
                profileUrl,
                avatarUrl,
                description
            };
        });

        console.info(`提取到 ${authorInfoList.length} 个关注作者的信息。`);
    }

    /**
     * 复制所有作者信息到剪贴板（JSON 格式）
     * Copies all author information to the clipboard in JSON format
     */
    function copyAllAuthorInfoAsJSON() {
        extractAuthorInfo();

        if (authorInfoList.length === 0) {
            alert('未提取到关注作者的信息，请确保页面已完全加载后重试。');
            return;
        }

        const jsonContent = JSON.stringify(authorInfoList, null, 2);
        GM_setClipboard(jsonContent);
        notifyUser(`已复制 ${authorInfoList.length} 个作者的信息 (JSON) 到剪贴板。`);
    }

    /**
     * 下载所有作者信息为JSON文件
     * Downloads all author information as a JSON file
     */
    function downloadAllAuthorInfoAsJSON() {
        extractAuthorInfo();

        if (authorInfoList.length === 0) {
            alert('未提取到关注作者的信息，请确保页面已完全加载后重试。');
            return;
        }

        const jsonContent = JSON.stringify(authorInfoList, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const filename = `douyin_followed_authors_${timestamp}.json`;

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 释放URL对象
        URL.revokeObjectURL(url);

        notifyUser(`已生成并下载 ${authorInfoList.length} 个作者的信息 (JSON)。`);
    }

    /**
     * 创建并添加悬浮复制和下载按钮到页面
     * Creates and adds floating copy and download buttons to the page
     */
    function createFloatingButtons() {
        // 创建容器
        const container = document.createElement('div');
        container.id = 'author-info-buttons-container';
        Object.assign(container.style, {
            position: 'fixed',
            right: '20px',
            bottom: '110px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: '10000'
        });

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.id = 'copy-author-info-btn';
        copyButton.textContent = '复制为JSON';
        Object.assign(copyButton.style, {
            padding: '10px 15px',
            backgroundColor: '#52c41a',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s, transform 0.3s',
            width: '150px'
        });

        // 创建下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-author-info-btn';
        downloadButton.textContent = '下载为JSON';
        Object.assign(downloadButton.style, {
            padding: '10px 15px',
            backgroundColor: '#1890FF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s, transform 0.3s',
            width: '150px'
        });

        // 鼠标悬停效果（复制按钮）
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.backgroundColor = '#73d13d';
            copyButton.style.transform = 'scale(1.05)';
        });
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.backgroundColor = '#52c41a';
            copyButton.style.transform = 'scale(1)';
        });

        // 鼠标悬停效果（下载按钮）
        downloadButton.addEventListener('mouseenter', () => {
            downloadButton.style.backgroundColor = '#40a9ff';
            downloadButton.style.transform = 'scale(1.05)';
        });
        downloadButton.addEventListener('mouseleave', () => {
            downloadButton.style.backgroundColor = '#1890FF';
            downloadButton.style.transform = 'scale(1)';
        });

        // 点击事件（复制按钮）
        copyButton.addEventListener('click', copyAllAuthorInfoAsJSON);

        // 点击事件（下载按钮）
        downloadButton.addEventListener('click', downloadAllAuthorInfoAsJSON);

        // 添加按钮到容器
        container.appendChild(copyButton);
        container.appendChild(downloadButton);

        // 添加容器到页面主体
        document.body.appendChild(container);
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
            bottom: '220px',
            right: '20px',
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '5px',
            opacity: '0',
            transition: 'opacity 0.5s',
            zIndex: '10000',
            fontSize: '13px',
            maxWidth: '300px',
            wordWrap: 'break-word'
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
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500); // 等待淡出完成
        }, 3000); // 显示3秒
    }

    /**
     * 初始化脚本
     * Initializes the userscript
     */
    function initializeScript() {
        createFloatingButtons();
        console.info('抖音关注作者信息提取器 (JSON 导出版) 已启用。');
    }

    // 等待页面内容加载完毕后初始化脚本
    // Wait for the DOM to be fully loaded before initializing
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeScript();
    } else {
        document.addEventListener('DOMContentLoaded', initializeScript);
    }

})();
