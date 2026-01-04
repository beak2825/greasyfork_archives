// ==UserScript==
// @name         馒头已读标记
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Track and mark viewed items in M-Team torrents list
// @author       nobody
// @match        https://kp.m-team.cc/browse*
// @match        https://kp.m-team.io/browse*
// @match        https://kp.m-team.cc/detail/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523638/%E9%A6%92%E5%A4%B4%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/523638/%E9%A6%92%E5%A4%B4%E5%B7%B2%E8%AF%BB%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 配置项
    const config = {
        listPagePattern: /\/browse/,
        detailPagePattern: /\/detail\/(\d+)/,
        itemSelector: 'tbody > tr',
        readMarkStyle: `
            background-color: #52c41a;
            color: white;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 12px;
            margin-right: 4px;
            display: inline-block;
        `,
        floatingButtonStyle: `
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 10000;
            padding: 4px 15px;
            font-size: 12px;
            border-radius: 4px;
            background-color: #1677ff;
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `
    };

    // 获取已查看的项目ID列表
    function getViewedItems() {
        return GM_getValue('mtViewedItems', []);
    }

    // 从URL中提取种子ID
    function extractTorrentId(url) {
        const match = url.match(/\/detail\/(\d+)/);
        return match ? match[1] : null;
    }

    // 添加项目到已查看列表并立即更新显示
    function markItemAsViewed(itemId) {
        const viewedItems = getViewedItems();
        if (!viewedItems.includes(itemId)) {
            viewedItems.push(itemId);
            GM_setValue('mtViewedItems', viewedItems);
            // 立即更新显示
            if (location.pathname.match(config.listPagePattern)) {
                applyReadMarks();
            }
        }
    }

    // 处理详情页面并返回到列表页时立即显示标记
    function handleDetailPage() {
        const itemId = extractTorrentId(location.href);
        if (itemId) {
            markItemAsViewed(itemId);
        }
    }

    // 添加已读标记
    function addReadMark(titleElement) {
        if (titleElement.querySelector('.read-mark')) return;

        const readMark = document.createElement('span');
        readMark.className = 'read-mark';
        readMark.textContent = '【已读】';
        readMark.style.cssText = config.readMarkStyle;

        const titleTextSpan = titleElement.querySelector('span:last-child');
        if (titleTextSpan) {
            titleTextSpan.parentElement.insertBefore(readMark, titleTextSpan);
        }
    }

    // 应用已读标记到已查看的项目
    function applyReadMarks() {
        const viewedItems = getViewedItems();
        const rows = document.querySelectorAll(config.itemSelector);

        rows.forEach(row => {
            const link = row.querySelector('a[href*="/detail/"]');
            if (!link) return;

            const itemId = extractTorrentId(link.href);
            if (itemId && viewedItems.includes(itemId)) {
                const titleElement = link.querySelector('.ant-typography strong');
                if (titleElement) {
                    addReadMark(titleElement);
                }
            }
        });
    }

    // 添加浮动的清除历史记录按钮
function addFloatingButton() {
    if (document.getElementById('clear-viewed-items')) return;

    const clearButtonHTML = `<button id="clear-viewed-items" class="css-3dxeyb ant-float-btn ant-float-btn-default ant-float-btn-circle" type="button"><div class="ant-float-btn-body"><div class="ant-float-btn-content">清</div></div></button>`;

    const observer = new MutationObserver(function(mutations) {
        const targetContainer = document.querySelector('.ant-float-btn-group');
        if (targetContainer) {
            // 创建一个临时元素来解析 HTML 字符串
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = clearButtonHTML;
            const newClearButton = tempDiv.firstChild;

            // 添加事件监听器
            newClearButton.onclick = () => {
                if (confirm('确定要清除所有已读记录吗？')) {
                    GM_setValue('mtViewedItems', []);
                    location.reload();
                }
            };

            newClearButton.onmouseover = () => {
                newClearButton.style.opacity = '1';
                newClearButton.style.boxShadow = '3px 3px 7px rgba(0, 0, 0, 0.4)';
                newClearButton.style.transform = 'scale(1.1)';
            };
            newClearButton.onmouseout = () => {
                newClearButton.style.opacity = '0.8';
                newClearButton.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
                newClearButton.style.transform = 'scale(1)';
            };


            targetContainer.appendChild(newClearButton);
            observer.disconnect(); // 找到目标后停止监听
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

    // 给列表页面的链接添加点击事件，实现即时标记
    function addClickHandlers() {
        const rows = document.querySelectorAll(config.itemSelector);
        rows.forEach(row => {
            const link = row.querySelector('a[href*="/detail/"]');
            if (!link || link.dataset.hasClickHandler) return;

            link.dataset.hasClickHandler = 'true';
            link.addEventListener('click', () => {
                const itemId = extractTorrentId(link.href);
                if (itemId) {
                    markItemAsViewed(itemId);
                }
            });
        });
    }

    // 初始化
    function init() {
        if (location.pathname.match(config.detailPagePattern)) {
            handleDetailPage();
            return;
        }

        if (location.pathname.match(config.listPagePattern)) {
            requestAnimationFrame(() => {
                applyReadMarks();
                addClickHandlers();
                addFloatingButton();
            });

            // 使用 MutationObserver 监听动态内容变化
            const observer = new MutationObserver((mutations) => {
                requestAnimationFrame(() => {
                    applyReadMarks();
                    addClickHandlers();
                });
            });

            observer.observe(document.querySelector('tbody') || document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 使用 requestAnimationFrame 确保尽快初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(init));
    } else {
        requestAnimationFrame(init);
    }
})();