// ==UserScript==
// @name         百度搜索跳转到google
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  百度搜索跳转到google，快捷跳转
// @author       You
// @match        *://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465892/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%88%B0google.user.js
// @updateURL https://update.greasyfork.org/scripts/465892/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%88%B0google.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 使用常量存储样式
    const BUTTON_STYLES = {
        width: '100px',
        height: '38px',
        background: 'linear-gradient(136deg, #286aff, #4e6ef2, #7274f9, #9f66ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        marginLeft: '10px',
        position: 'relative',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'box-shadow 0.2s',
        border: 'none',
        outline: 'none'
    };

    const DROPDOWN_STYLES = {
        position: 'absolute',
        top: '100%',
        left: '0',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'none',
        width: '100%',
        zIndex: '1000',
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden',
    };

    const DROPDOWN_ITEM_STYLES = {
        padding: '8px 12px',
        cursor: 'pointer',
        color: '#333',
        backgroundColor: '#fff',
        fontSize: '14px',
        borderBottom: '1px solid #f0f0f0'
    };

    // 创建按钮
    function createGoogleButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'google-button-container';
        Object.assign(buttonContainer.style, BUTTON_STYLES);

        buttonContainer.innerHTML = `
            <span style="flex: 1; text-align: left; padding-left: 15px;" class="google-text">Google</span>
            <div style="width: 1px; height: 20px; background-color: rgba(255,255,255,0.3);"></div>
            <span style="padding: 0 8px; cursor: pointer; transform: scaleY(0.6);" class="arrow">▼</span>
        `;

        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, DROPDOWN_STYLES);

        const sites = [
            { name: 'Bilibili', url: 'https://search.bilibili.com/all?keyword=' },
            { name: 'GitHub', url: 'https://github.com/search?q=' }
        ];

        sites.forEach((site, index) => {
            const item = document.createElement('div');
            Object.assign(item.style, DROPDOWN_ITEM_STYLES);
            if (index === sites.length - 1) {
                item.style.borderBottom = 'none';
            }
            item.textContent = site.name;

            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#f0f0f0';
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = '#fff';
            });
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const searchText = getSearchText();
                if (searchText) {
                    window.open(`${site.url}${encodeURIComponent(searchText)}`);
                }
            });
            dropdown.appendChild(item);
        });

        buttonContainer.appendChild(dropdown);

        const arrow = buttonContainer.querySelector('.arrow');
        const googleText = buttonContainer.querySelector('.google-text');

        // 事件处理
        arrow.addEventListener('mouseenter', () => {
            dropdown.style.display = 'block';
        });

        googleText.addEventListener('mouseenter', () => {
            dropdown.style.display = 'none';
        });

        buttonContainer.addEventListener('mouseleave', () => {
            dropdown.style.display = 'none';
        });

        buttonContainer.addEventListener('click', (e) => {
            if (!e.target.classList.contains('arrow')) {
                const searchText = getSearchText();
                if (searchText) {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchText)}`);
                }
            }
        });

        // 悬停效果
        buttonContainer.addEventListener('mouseenter', () => {
            buttonContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });

        buttonContainer.addEventListener('mouseleave', () => {
            buttonContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });

        return buttonContainer;
    }

    // 获取搜索文本
    function getSearchText() {
        const selectors = ['#kw', 'input[name="wd"]', '.s_ipt', 'input[type="text"]'];
        for (const selector of selectors) {
            const input = document.querySelector(selector);
            if (input && input.value.trim()) {
                return input.value.trim();
            }
        }
        return '';
    }

    // 插入按钮到目标元素的同级后面
    function insertButton(targetElement, button) {
        try {
            const parentElement = targetElement.parentElement;
            if (!parentElement) {
                console.log('目标元素没有父元素');
                return false;
            }

            // 尝试不同的插入方式
            const insertMethods = [
                // 方法1: 使用 insertAdjacentElement 插入到目标元素后面
                () => {
                    targetElement.insertAdjacentElement('afterend', button);
                    return true;
                },

                // 方法2: 通过父元素的 insertBefore 方法插入
                () => {
                    const nextSibling = targetElement.nextSibling;
                    if (nextSibling) {
                        parentElement.insertBefore(button, nextSibling);
                    } else {
                        parentElement.appendChild(button);
                    }
                    return true;
                },

                // 方法3: 创建包装div并插入到目标元素后面
                () => {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'inline-flex';
                    wrapper.style.alignItems = 'center';
                    wrapper.style.marginLeft = '10px'; // 添加一些间距
                    wrapper.appendChild(button);
                    
                    targetElement.insertAdjacentElement('afterend', wrapper);
                    return true;
                }
            ];

            for (let i = 0; i < insertMethods.length; i++) {
                try {
                    if (insertMethods[i]()) {
                        console.log(`按钮插入成功，使用方法${i + 1}`);
                        return true;
                    }
                } catch (e) {
                    console.warn(`插入方法${i + 1}失败:`, e);
                }
            }

            return false;
        } catch (e) {
            console.error('插入按钮时出错:', e);
            return false;
        }
    }

    // 初始化函数
    function init() {
        try {
            // 检查是否已经存在按钮
            if (document.querySelector('.google-button-container')) {
                console.log('按钮已存在');
                return true;
            }

            // 查找目标元素
            const targetElement = document.querySelector('#chat-submit-button');
            if (!targetElement) {
                console.log('未找到 #chat-submit-button 元素');
                return false;
            }

            console.log('找到目标元素:', targetElement);

            // 创建并插入按钮到目标元素的同级后面
            const googleButton = createGoogleButton();
            const success = insertButton(targetElement, googleButton);

            if (success) {
                console.log('Google按钮初始化成功');
                return true;
            } else {
                console.log('按钮插入失败');
                return false;
            }
        } catch (e) {
            console.error('初始化过程中出错:', e);
            return false;
        }
    }

    // 带重试的初始化
    function initWithRetry() {
        let retryCount = 0;
        const maxRetries = 10;
        const retryInterval = 500;

        function tryInit() {
            console.log(`尝试初始化 (第${retryCount + 1}次)`);

            if (init()) {
                console.log('初始化成功');
                return;
            }

            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`初始化失败，${retryInterval}ms后重试...`);
                setTimeout(tryInit, retryInterval);
            } else {
                console.log('达到最大重试次数，初始化失败');
            }
        }

        // 立即尝试一次
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryInit);
        } else {
            tryInit();
        }

        // 监听页面变化（适用于SPA应用）
        const observer = new MutationObserver((mutations) => {
            let shouldRetry = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldRetry = true;
                    break;
                }
            }

            if (shouldRetry && !document.querySelector('.google-button-container')) {
                setTimeout(() => {
                    if (!document.querySelector('.google-button-container')) {
                        console.log('检测到页面变化，重新初始化');
                        retryCount = 0;
                        tryInit();
                    }
                }, 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动初始化
    initWithRetry();
})();