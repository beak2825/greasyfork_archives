// ==UserScript==
// @name         Linux.do 可折叠侧边栏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 Linux.do 论坛添加可折叠的侧边栏功能
// @author       yueliusu
// @match        https://linux.do/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529884/Linuxdo%20%E5%8F%AF%E6%8A%98%E5%8F%A0%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529884/Linuxdo%20%E5%8F%AF%E6%8A%98%E5%8F%A0%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

/* MIT License
 * 
 * Copyright (c) 2025 yueliusu
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // 添加必要的样式
    GM_addStyle(`
        /* 确保样式应用到整个侧边栏容器及其子元素 */
        body .sidebar-wrapper {
            overflow: hidden;
        }

        .sidebar-wrapper {
            position: relative;
            transition: width 0.3s ease;
        }

        .sidebar-collapsed {
            width: 50px !important;
            overflow: hidden;
        }

        .sidebar-collapsed .sidebar-section-wrapper,
        .sidebar-collapsed .sidebar-footer-wrapper,
        .sidebar-collapsed .chat-footer-item {
            opacity: 0;
            pointer-events: none;
        }

        /* 隐藏底部聊天按钮 */
        .sidebar-collapsed .sidebar-footer-wrapper {
            transform: translateX(-100%);
        }

        .toggle-sidebar {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 20px;
            height: 20px;
            background-color: #e9e9e9;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 1000;
            border: 1px solid #ccc;
        }

        .toggle-sidebar:hover {
            background-color: #d9d9d9;
        }

        .toggle-sidebar svg {
            width: 12px;
            height: 12px;
        }

        .main-content {
            transition: margin-left 0.3s ease;
        }

        .main-content-expanded {
            margin-left: 50px !important;
        }
    `);

    // 等待DOM完全加载
    function waitForElement(selector, callback, maxTries = 20, interval = 500) {
        let tries = 0;

        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            } else if (tries < maxTries) {
                tries++;
                setTimeout(check, interval);
            }
        }

        check();
    }

    // 创建折叠/展开按钮
    function createToggleButton() {
        const toggleButton = document.createElement('div');
        toggleButton.className = 'toggle-sidebar';
        toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
        toggleButton.title = '折叠/展开侧边栏';
        return toggleButton;
    }

    // 主函数
    function initCollapsibleSidebar() {
        waitForElement('.sidebar-wrapper', (sidebar) => {
            // 添加折叠按钮
            const toggleButton = createToggleButton();
            sidebar.appendChild(toggleButton);

            // 获取主内容区域
            const mainContent = document.querySelector('.main-content');

            // 折叠状态（从localStorage读取状态，默认为展开）
            let isCollapsed = localStorage.getItem('linux_do_sidebar_collapsed') === 'true';

            // 初始化侧边栏状态
            if (isCollapsed) {
                sidebar.classList.add('sidebar-collapsed');
                if (mainContent) {
                    mainContent.classList.add('main-content-expanded');
                }
                toggleButton.style.transform = 'rotate(180deg)';
            }

            // 点击事件处理
            toggleButton.addEventListener('click', () => {
                isCollapsed = !isCollapsed;

                // 保存状态到localStorage
                localStorage.setItem('linux_do_sidebar_collapsed', isCollapsed);

                // 切换侧边栏类
                sidebar.classList.toggle('sidebar-collapsed', isCollapsed);

                // 调整主内容区域
                if (mainContent) {
                    mainContent.classList.toggle('main-content-expanded', isCollapsed);
                }

                // 处理底部聊天按钮
                const chatFooter = document.querySelector('.sidebar-footer-wrapper');
                if (chatFooter) {
                    if (isCollapsed) {
                        chatFooter.style.visibility = 'hidden';
                    } else {
                        setTimeout(() => {
                            chatFooter.style.visibility = 'visible';
                        }, 300); // 等待折叠动画完成
                    }
                }

                // 旋转图标
                toggleButton.style.transform = isCollapsed ? 'rotate(180deg)' : '';
            });
        });
    }

    // 初始化脚本
    initCollapsibleSidebar();

    // 监听页面变化，处理SPA导航
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查是否需要重新初始化
                if (!document.querySelector('.toggle-sidebar')) {
                    initCollapsibleSidebar();
                }
            }
        }
    });

    // 监听body元素变化
    observer.observe(document.body, { childList: true, subtree: true });
})();