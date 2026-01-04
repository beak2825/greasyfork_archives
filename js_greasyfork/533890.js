// ==UserScript==
// @name         闲鱼聊天界面优化 - 去除默认聊天样式
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  去除闲鱼网页版默认聊天窗口样式，简化界面，专为工作时间摸鱼而生。
// @author       paopao233
// @match        https://www.goofish.com/*
// @grant        GM_addStyle
// @license      MIT
// @homepage     https://github.com/paopao233/
// @homepageURL  https://github.com/paopao233/
// @supportURL   https://github.com/paopao233/issues
// @downloadURL https://update.greasyfork.org/scripts/533890/%E9%97%B2%E9%B1%BC%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%20-%20%E5%8E%BB%E9%99%A4%E9%BB%98%E8%AE%A4%E8%81%8A%E5%A4%A9%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/533890/%E9%97%B2%E9%B1%BC%E8%81%8A%E5%A4%A9%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%20-%20%E5%8E%BB%E9%99%A4%E9%BB%98%E8%AE%A4%E8%81%8A%E5%A4%A9%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改网站标题和图标
    function updateTitleAndFavicon() {
        // 修改标题
        document.title = "paopao工作站";

        // 移除原有图标
        const existingFavicon = document.querySelector("link[rel*='icon']");
        if (existingFavicon) {
            existingFavicon.remove();
        }

        // 添加自定义图标
        const link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjRkZDMTA3IiBkPSJNNDMuNjExLDIwLjA4M0g0MlYyMEgyNHY4aDExLjMwM2MtMS42NDksNC42NTctNi4wOCw4LTExLjMwMyw4Yy02LjYyNywwLTEyLTUuMzczLTEyLTEyYzAtNi42MjcsNS4zNzMtMTIsMTItMTJjMy4wNTksMCw1Ljg0MiwxLjE1NCw3Ljk2MSwzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYsNi4wNTMsMjkuMjY4LDQsMjQsNEMxMi45NTUsNCw0LDEyLjk1NSw0LDI0YzAsMTEuMDQ1LDguOTU1LDIwLDIwLDIwYzExLjA0NSwwLDIwLTguOTU1LDIwLTIwQzQ0LDIyLjY1OSw0My44NjIsMjEuMzUsNDMuNjExLDIwLjA4M3oiLz48L3N2Zz4=';
        document.head.appendChild(link);
    }

    GM_addStyle(`
        /* 清理页面干扰元素 */
        .header-main--kEIzsFTr, .container--dgZTBkgv, .right-container--AxSGn7lz, .ant-badge img, .conversation-item--JReyg97P img, .avatar--e05bt3Ju {
            display: none !important;
        }

        /* 主聊天界面 */
        .im-main--kaKv06s8 {
            background-color: #f4f7fa !important;
            border-radius: 12px !important;
            margin: 10px !important;
            padding: 20px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(10px) !important;
        }

        /* 聊天消息 */
        .message-text--zV88pB7N {
            background-color: #ffffff !important;
            border-radius: 18px !important;
            padding: 12px 16px !important;
            margin: 6px 8px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
            max-width: 70%;
        }

        /* 发送者消息样式 */
        .message-text-right--Vhy6k0cY {
            background: #0084FF !important;
            color: white !important;
            border-radius: 18px !important;
            align-self: flex-end !important;
        }

        /* 时间戳 */
        .message-time {
            font-size: 12px !important;
            color: #999 !important;
            text-align: center;
            margin-top: 4px;
        }

        /* 输入框 */
        .chat-input-area {
            background-color: #ffffff !important;
            border: 1px solid #ddd !important;
            border-radius: 18px !important;
            padding: 10px 16px !important;
            margin-top: 12px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        /* 发送按钮 */
        .im-chat-send {
            background-color: #0084FF !important;
            color: white !important;
            border: none !important;
            border-radius: 18px !important;
            padding: 8px 20px !important;
            font-weight: 500 !important;
        }

        /* 折叠按钮样式 */
        .collapse-btn {
            position: fixed;
            left: 250px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            width: 16px;
            height: 50px;
            background: #f0f0f0;
            border: 1px solid #d9d9d9;
            border-left: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }

        .collapse-btn:hover {
            background: #e6e6e6;
        }

        .collapse-btn::after {
            content: "◀";
            font-size: 12px;
            color: #666;
        }

        .collapse-btn.collapsed::after {
            content: "▶";
        }

        .conv-list-scroll--Bn4G27Nb {
            transition: all 0.3s ease;
        }

        .conv-list-scroll--Bn4G27Nb.collapsed {
            width: 0 !important;
            overflow: hidden;
        }
    `);

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                removeElements();
            }
        });
        if (!document.querySelector('.collapse-btn')) {
            addCollapseButton();
        }
    });

    // 添加折叠按钮
    function addCollapseButton() {
        const listContainer = document.querySelector('.conv-list-scroll--Bn4G27Nb');
        if (!listContainer) return;

        const collapseBtn = document.createElement('div');
        collapseBtn.className = 'collapse-btn';
        listContainer.parentElement.appendChild(collapseBtn);

        collapseBtn.addEventListener('click', () => {
            listContainer.classList.toggle('collapsed');
            collapseBtn.classList.toggle('collapsed');

            // 保存折叠状态
            localStorage.setItem('chatListCollapsed', listContainer.classList.contains('collapsed'));
        });

        // 恢复之前的折叠状态
        const isCollapsed = localStorage.getItem('chatListCollapsed') === 'true';
        if (isCollapsed) {
            listContainer.classList.add('collapsed');
            collapseBtn.classList.add('collapsed');
        }
    }

    // 移除不需要的元素
    function removeElements() {
        const elementsToRemove = [
            '.header-main--kEIzsFTr',
            '.container--dgZTBkgv',
            '.right-container--AxSGn7lz',
            '.ant-badge img',
            '.conversation-item--JReyg97P img',
            '.avatar--e05bt3Ju'
        ];
        elementsToRemove.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.display = 'none';
        });
    }

    // 开始观察文档变化
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        removeElements();
        updateTitleAndFavicon();
    });

    // 确保标题和图标修改生效
    document.addEventListener('DOMContentLoaded', updateTitleAndFavicon);
})();
