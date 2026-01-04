// ==UserScript==
// @name         抖音视频采集（简洁版）
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  抖音切换到我的喜欢和收藏列表，提取当前页面抖音视频链接，采集到第三方场景上，可以定制相关插件
// @author       qqlcx5
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        GM_setClipboard
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517736/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E9%87%87%E9%9B%86%EF%BC%88%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/517736/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E9%87%87%E9%9B%86%EF%BC%88%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 Font Awesome 图标库
    function addFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }

    /**
     * 存储提取到的视频链接和点赞数
     * Stores the extracted video links and like counts
     */
    let videoLinks = [];

    /**
     * 提取用户主页中的所有视频链接和点赞数
     * Extracts all video links and like counts from the user's profile page
     */
    function extractVideoLinks() {
        // 定义需要提取链接的节点选择器
        const selectors = [
            'div[data-e2e="user-post-list"]',
            'div[data-e2e="user-like-list"]'
        ];
        const videoListContainer = document.querySelector(selectors);

        if (!videoListContainer) {
            console.warn('未找到视频列表元素');
            return;
        }

        const videoAnchorElements = videoListContainer.querySelectorAll('a[href^="/video/"]');
        videoLinks = Array.from(videoAnchorElements).map(anchor => {
            const videoElement = anchor.closest('li');
            const likeCountElement = videoElement ? videoElement.querySelector('.b3Dh2ia8') : null;
            const likeCount = likeCountElement ? parseLikeCount(likeCountElement.textContent) : 0;

            // 获取视频标题（如果有）
            const titleElement = videoElement ? videoElement.querySelector('div[data-e2e="video-title"]') : null;
            const title = titleElement ? titleElement.textContent.trim() : '无标题';

            // 获取视频封面（如果有）
            const imgElement = videoElement ? videoElement.querySelector('img') : null;
            const thumbnail = imgElement ? imgElement.src : '';

            // 构建完整URL
            const url = new URL(anchor.href, window.location.origin);

            return {
                href: url.toString(),
                likeCount: likeCount,
                title: title,
                thumbnail: thumbnail,
                id: url.pathname.split('/').pop() // 提取视频ID
            };
        });

        console.info(`提取到 ${videoLinks.length} 个视频链接`);
    }

    /**
     * 将点赞数文本转换为数字
     * Converts like count text to a number
     * @param {string} text - 点赞数文本 (Like count text)
     * @returns {number} - 转换后的点赞数 (Converted like count)
     */
    function parseLikeCount(text) {
        if (!text) return 0;
        if (text.includes('万')) {
            return parseFloat(text) * 10000;
        }
        return parseInt(text, 10) || 0;
    }

    /**
     * 按点赞数排序视频链接
     * Sorts video links by like count
     * @param {boolean} ascending - 是否升序排序 (Whether to sort in ascending order)
     */
    function sortVideoLinksByLikes(ascending = false) {
        videoLinks.sort((a, b) => {
            return ascending ? a.likeCount - b.likeCount : b.likeCount - a.likeCount;
        });
    }

    /**
     * 复制所有视频链接到剪贴板
     * Copies all video links to the clipboard
     * @param {boolean} shouldSort - 是否按点赞数排序 (Whether to sort by like count)
     */
    function copyAllVideoLinks(shouldSort = false) {
        extractVideoLinks();

        if (videoLinks.length === 0) {
            showNotification('未找到视频链接', 'error');
            return;
        }

        if (shouldSort) {
            sortVideoLinksByLikes();
            showNotification('已按点赞数降序排序', 'info');
        }

        const linksText = videoLinks.map(video => video.href).join('\n');
        GM_setClipboard(linksText);
        showNotification(`已复制 ${videoLinks.length} 个视频链接`, 'success');
    }

    /**
     * 复制JSON到剪贴板
     * Copy JSON to clipboard
     */
    function copyAsJSON() {
        extractVideoLinks();

        if (videoLinks.length === 0) {
            showNotification('未找到视频链接', 'error');
            return;
        }

        const jsonData = JSON.stringify(videoLinks, null, 2);
        GM_setClipboard(jsonData);
        showNotification(`已复制 ${videoLinks.length} 个视频的JSON数据`, 'success');
    }

    /**
     * 导出为JSON文件
     * Export to JSON file
     */
    function exportToJSON() {
        extractVideoLinks();

        if (videoLinks.length === 0) {
            showNotification('未找到视频链接', 'error');
            return;
        }

        const jsonData = JSON.stringify(videoLinks, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const date = new Date();
        const filename = `douyin_videos_${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.json`;

        GM_download({
            url: url,
            name: filename,
            onload: function() {
                showNotification(`已导出 ${videoLinks.length} 个视频到JSON文件`, 'success');
                URL.revokeObjectURL(url);
            },
            onerror: function(error) {
                showNotification('导出失败: ' + error.error, 'error');
                URL.revokeObjectURL(url);
            }
        });
    }

    /**
     * 导出为CSV文件
     * Export to CSV file
     */
    function exportToCSV() {
        extractVideoLinks();

        if (videoLinks.length === 0) {
            showNotification('未找到视频链接', 'error');
            return;
        }

        // 创建CSV标题行
        let csvContent = "标题,链接,点赞数,视频ID\n";

        // 添加数据行
        videoLinks.forEach(video => {
            // 处理标题中的逗号（用引号包裹）
            const title = video.title.includes(',') ? `"${video.title}"` : video.title;
            csvContent += `${title},${video.href},${video.likeCount},${video.id}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const date = new Date();
        const filename = `douyin_videos_${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.csv`;

        GM_download({
            url: url,
            name: filename,
            onload: function() {
                showNotification(`已导出 ${videoLinks.length} 个视频到CSV文件`, 'success');
                URL.revokeObjectURL(url);
            },
            onerror: function(error) {
                showNotification('导出失败: ' + error.error, 'error');
                URL.revokeObjectURL(url);
            }
        });
    }

    /**
     * 创建并添加悬浮按钮组到页面
     * Creates and adds a floating button group to the page
     */
    function createFloatingButtonGroup() {
        const buttonGroup = document.createElement('div');
        buttonGroup.id = 'floating-button-group';

        Object.assign(buttonGroup.style, {
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: '10000',
        });

        // 主按钮 - 导出选项
        const mainButton = createButton('<i class="fas fa-download"></i>', '#007AFF', () => {
            toggleExportMenu();
        });

        // 导出选项菜单
        const exportMenu = document.createElement('div');
        exportMenu.id = 'export-menu';
        exportMenu.style.display = 'none';
        exportMenu.style.flexDirection = 'column';
        exportMenu.style.gap = '10px';

        Object.assign(exportMenu.style, {
            display: 'none',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: '#FFFFFF',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E0E0E0'
        });

        // 创建各种导出按钮
        const normalButton = createMenuButton('<i class="fas fa-link"></i> 复制链接', () => {
            copyAllVideoLinks(false);
            hideExportMenu();
        });

        const sortButton = createMenuButton('<i class="fas fa-sort-amount-down"></i> 按点赞数复制', () => {
            copyAllVideoLinks(true);
            hideExportMenu();
        });

        const copyJsonButton = createMenuButton('<i class="fas fa-clipboard"></i> 复制JSON', () => {
            copyAsJSON();
            hideExportMenu();
        });

        const jsonButton = createMenuButton('<i class="fas fa-file-code"></i> 导出JSON', () => {
            exportToJSON();
            hideExportMenu();
        });

        const csvButton = createMenuButton('<i class="fas fa-file-csv"></i> 导出CSV', () => {
            exportToCSV();
            hideExportMenu();
        });

        exportMenu.appendChild(normalButton);
        exportMenu.appendChild(sortButton);
        exportMenu.appendChild(copyJsonButton);
        exportMenu.appendChild(jsonButton);
        exportMenu.appendChild(csvButton);

        buttonGroup.appendChild(mainButton);
        buttonGroup.appendChild(exportMenu);

        document.body.appendChild(buttonGroup);

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!buttonGroup.contains(e.target) && exportMenu.style.display === 'flex') {
                hideExportMenu();
            }
        });
    }

    /**
     * 切换导出菜单的显示/隐藏
     * Toggle export menu visibility
     */
    function toggleExportMenu() {
        const exportMenu = document.getElementById('export-menu');
        if (exportMenu.style.display === 'flex') {
            hideExportMenu();
        } else {
            showExportMenu();
        }
    }

    /**
     * 显示导出菜单
     * Show export menu
     */
    function showExportMenu() {
        const exportMenu = document.getElementById('export-menu');
        exportMenu.style.display = 'flex';
    }

    /**
     * 隐藏导出菜单
     * Hide export menu
     */
    function hideExportMenu() {
        const exportMenu = document.getElementById('export-menu');
        exportMenu.style.display = 'none';
    }

    /**
     * 创建菜单按钮
     * Creates a menu button
     * @param {string} html - 按钮HTML内容
     * @param {function} onClick - 点击事件
     * @returns {HTMLElement} - 按钮元素
     */
    function createMenuButton(html, onClick) {
        const button = document.createElement('button');
        button.innerHTML = html;

        Object.assign(button.style, {
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: '#333333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.2s ease',
            textAlign: 'left',
            width: '100%',
            whiteSpace: 'nowrap'
        });

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#F0F0F0';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'transparent';
        });

        button.addEventListener('click', onClick);

        return button;
    }

    /**
     * 创建按钮
     * Creates a button
     * @param {string} html - 按钮HTML内容
     * @param {string} color - 按钮背景色
     * @param {function} onClick - 点击事件
     * @returns {HTMLElement} - 按钮元素
     */
    function createButton(html, color, onClick) {
        const button = document.createElement('button');
        button.innerHTML = html;

        Object.assign(button.style, {
            padding: '16px',
            backgroundColor: color,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0, 122, 255, 0.15)',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '500',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            WebkitAppearance: 'none',
            margin: '0',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05) translateY(-1px)';
            button.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.2)';
            button.style.backgroundColor = '#0066D6';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'none';
            button.style.boxShadow = '0 2px 8px rgba(0, 122, 255, 0.15)';
            button.style.backgroundColor = color;
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.05) translateY(-1px)';
        });

        button.addEventListener('click', function(e) {
            e.stopPropagation();
            onClick();
        });

        return button;
    }

    function showNotification(message, type = 'info') {
        const colors = {
            success: '#34C759',
            error: '#FF3B30',
            info: '#007AFF'
        };

        const notification = document.createElement('div');
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            backgroundColor: '#FFFFFF',
            color: colors[type],
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            opacity: '0',
            transform: 'translateY(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: '10000',
            fontSize: '15px',
            fontWeight: '500',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            border: `1px solid ${colors[type]}20`
        });

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function initializeScript() {
        addFontAwesome();
        createFloatingButtonGroup();
        console.info('抖音视频链接提取器已启用');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeScript, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeScript, 1000);
        });
    }
})();