// ==UserScript==
// @name         Deepseek输入框隐藏
// @namespace    none
// @version      3.6
// @description  使用底部的小切换按钮切换聊天输入框的可见性
// @author       留白ฅ
// @match        https://chat.deepseek.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523767/Deepseek%E8%BE%93%E5%85%A5%E6%A1%86%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523767/Deepseek%E8%BE%93%E5%85%A5%E6%A1%86%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 目标元素的选择器（包含所有部分）
    const targetElementSelectors = [
        '.b699646e.dd442025',
        '.fad49dec',
        '.cefa5c26',
        '.aaff8b8f', // 新增的选择器
        '.cbcaa82c' // 新增的选择器
    ];

    // 全局变量
    let targetElements = []; // 目标元素
    let toggleButton = null; // 切换按钮
    let observer = null; // MutationObserver 实例
    let styleElement = null; // 动态添加的样式元素

    // 初始化脚本
    function initScript() {
        // 清理之前的资源
        cleanupScript();

        // 清空 targetElements
        targetElements = [];

        // 尝试查找目标元素
        for (const selector of targetElementSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                targetElements.push(...elements);
                console.log(`Target elements found with selector: ${selector}`);
            }
        }

        // 如果目标元素不存在，尝试动态查找
        if (targetElements.length === 0) {
            console.log('Target elements not found, waiting for dynamic load...');

            // 使用 MutationObserver 监听 DOM 变化
            observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // 检查新增的节点中是否包含目标元素
                        for (const selector of targetElementSelectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                targetElements.push(...elements);
                                console.log(`Target elements found with selector: ${selector}`);
                                observer.disconnect(); // 停止监听
                                initToggleButton(); // 初始化收起按钮
                                break;
                            }
                        }
                    }
                }
            });

            // 监听整个文档的变化
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            initToggleButton(); // 初始化收起按钮
        }
    }

    // 初始化收起按钮
    function initToggleButton() {
        console.log('Initializing toggle button...');

        // 创建收起按钮
        toggleButton = document.createElement('button');
        toggleButton.textContent = '▼'; // 初始状态为展开图标
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '112px'; // 展开状态下的初始位置
        toggleButton.style.left = '50%'; // 展开状态下的初始位置
        toggleButton.style.transform = 'translateX(-50%)'; // 水平居中
        toggleButton.style.zIndex = '1000';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // 浅色半透明背景，透明度为 0.3
        toggleButton.style.color = '#000'; // 文字颜色为黑色
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px 5px 0 0';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.backdropFilter = 'blur(12px)'; // 模糊强度为 12px
        toggleButton.style.webkitBackdropFilter = 'blur(12px)'; // 兼容 Safari

        // 添加点击事件
        toggleButton.addEventListener('click', function () {
            targetElements.forEach(element => {
                if (element.style.transform === 'translateY(100%)') {
                    // 展开状态：恢复默认样式
                    element.style.transform = ''; // 清空 transform
                    toggleButton.style.bottom = '112px'; // 展开状态下的位置
                    toggleButton.textContent = '▼'; // 展开图标
                    console.log('Showing elements (no modification)');
                } else {
                    // 收起状态：隐藏元素
                    element.style.transform = 'translateY(100%)';
                    toggleButton.style.bottom = '0px'; // 收起状态下的位置
                    toggleButton.textContent = '▲'; // 收起图标
                    console.log('Hiding elements');
                }
            });
        });

        // 将收起按钮添加到页面
        document.body.appendChild(toggleButton);
        console.log('Toggle button added to page');

        // 添加 CSS 样式以实现平滑过渡
        styleElement = document.createElement('style');
        styleElement.textContent = `
            ${targetElementSelectors.join(', ')} {
                transition: transform 0.3s ease-in-out;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 1000; /* 确保元素在最上层 */
            }
            button {
                transition: bottom 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(styleElement);
        console.log('CSS styles added');
    }

    // 清理脚本资源
    function cleanupScript() {
        console.log('Cleaning up script resources...');

        // 移除切换按钮
        if (toggleButton && toggleButton.parentNode) {
            toggleButton.parentNode.removeChild(toggleButton);
            toggleButton = null;
        }

        // 移除动态添加的样式
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
            styleElement = null;
        }

        // 停止 MutationObserver
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // 恢复目标元素的样式
        targetElements.forEach(element => {
            element.style.transform = '';
        });
        targetElements = [];
    }

    // 监听路由变化
    let lastUrl = location.href;
    const checkUrlChange = () => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;

            if (currentUrl.includes('https://chat.deepseek.com/a/chat/')) {
                console.log('URL changed to chat page, initializing script...');
                initScript(); // 初始化脚本
            } else if (currentUrl === 'https://chat.deepseek.com/') {
                console.log('URL changed to homepage, cleaning up script...');
                cleanupScript(); // 清理脚本资源
            }
        }
    };

    // 使用 setInterval 定期检查 URL 变化
    setInterval(checkUrlChange, 500); // 每 500ms 检查一次 URL 变化

    // 页面加载时初始化脚本
    if (location.href.includes('https://chat.deepseek.com/a/chat/')) {
        initScript();
    } else if (location.href === 'https://chat.deepseek.com/') {
        cleanupScript(); // 如果当前是主页，清理脚本资源
    }
})();