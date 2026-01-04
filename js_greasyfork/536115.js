// ==UserScript==
// @name         B站导航栏显示控制
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  让B站顶部导航栏可手动隐藏/显示，按钮位于右侧中间
// @author       你
// @match        https://www.bilibili.com/*
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/536115/B%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/536115/B%E7%AB%99%E5%AF%BC%E8%88%AA%E6%A0%8F%E6%98%BE%E7%A4%BA%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从本地存储获取导航栏状态
    const isHidden = localStorage.getItem('bilibiliHeaderHidden') === 'true';

    // 等待目标元素出现的工具函数
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const observer = new MutationObserver(mutations => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 创建控制按钮
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'bilibili-header-toggle';
        button.textContent = '+';

        button.style.cssText = `
            position: fixed;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            z-index: 9999;
            background-color: transparent;
            color: #cccccc;
            border: 1px solid rgba(200, 200, 200, 0.5);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            padding: 0;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: none;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.color = '#ffffff';
            button.style.transform = 'translateY(-50%) scale(1.1)';
            button.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.color = '#cccccc';
            button.style.transform = 'translateY(-50%)';
            button.style.borderColor = 'rgba(200, 200, 200, 0.5)';
        });

        button.addEventListener('click', toggleHeader);
        document.body.appendChild(button);
    }

    // 切换导航栏显示状态
    function toggleHeader() {
        const headers = document.querySelectorAll(
            '.bili-header.fixed-header, ' +
            '.bili-main-header, ' +
            '.bili-header-m, ' +
            '.z-top-container'
        );

        let allHidden = true;

        headers.forEach(header => {
            if (header) {
                if (header.style.display === 'none') {
                    header.style.display = 'block';
                    header.style.opacity = '0';
                    header.style.transform = 'translateY(-100%)';
                    header.style.transition = 'all 0.3s ease-out';

                    setTimeout(() => {
                        header.style.opacity = '1';
                        header.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    header.style.opacity = '0';
                    header.style.transform = 'translateY(-100%)';
                    header.style.transition = 'all 0.3s ease-in';

                    setTimeout(() => {
                        header.style.display = 'none';
                    }, 300);
                }

                allHidden = allHidden && (header.style.display === 'none');
            }
        });

        // 检测并修改 #biliMainHeader 的 min-height
        const biliMainHeader = document.getElementById('biliMainHeader');
        if (biliMainHeader) {
            if (allHidden) {
                biliMainHeader.style.minHeight = '64px';
            } else {
                biliMainHeader.style.minHeight = '0px';
            }
        }

        localStorage.setItem('bilibiliHeaderHidden', allHidden);
    }

    // 页面加载完成后初始化
    window.addEventListener('load', () => {
        const headers = document.querySelectorAll(
            '.bili-header.fixed-header, ' +
            '.bili-main-header, ' +
            '.bili-header-m, ' +
            '.z-top-container'
        );

        headers.forEach(header => {
            if (header && isHidden) {
                header.style.display = 'none';
            }
        });

        // 页面加载时检测并修改 #biliMainHeader 的 min-height
        const biliMainHeader = document.getElementById('biliMainHeader');
        if (biliMainHeader && isHidden) {
            biliMainHeader.style.minHeight = '0px';
        }

        waitForElement('body', createToggleButton);

        new MutationObserver(mutations => {
            if (!document.getElementById('bilibili-header-toggle')) {
                createToggleButton();
            }
        }).observe(document.body, { childList: true, subtree: true });
    });
})();