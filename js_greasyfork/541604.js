// ==UserScript==
// @name         韩网辅助输入
// @namespace    http://tampermonkey.net/
// @version      1.51
// @description  Suggests specific text input on kiosk.ac and nahida.live password inputs
// @author       Henry W
// @author       zzx114
// @match        https://kiosk.ac/*
// @match        https://kio.ac/*
// @match        https://nahida.live/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541604/%E9%9F%A9%E7%BD%91%E8%BE%85%E5%8A%A9%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/541604/%E9%9F%A9%E7%BD%91%E8%BE%85%E5%8A%A9%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let suggestionBox = null;
    const suggestions = ['gayshin', 'ㅎ묘노ㅑㅜ', 'GAYSHIN', '0731', '添加新密码'];

    function createSuggestions(input, buttonSelector) {
        if (suggestionBox) {
            suggestionBox.remove();
        }

        suggestionBox = document.createElement('div');
        suggestionBox.style.cssText = `
            position: fixed;
            background: #2b2b2b;
            border: 2px solid #4a4a4a;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 999999;
            font-size: 14px;
            min-width: 120px;
            pointer-events: auto;
        `;

        // 计算输入框的位置并定位建议框
        const rect = input.getBoundingClientRect();
        suggestionBox.style.left = rect.left + 'px';
        suggestionBox.style.top = (rect.bottom + 5) + 'px';

        suggestions.forEach(text => {
            const item = document.createElement('div');
            item.textContent = text;
            item.style.cssText = `
                padding: 8px 12px;
                margin: 4px 0;
                color: #ffffff;
                background: #3a3a3a;
                border-radius: 3px;
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
            `;

            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#4a4a4a';
                item.style.transform = 'translateX(5px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '#3a3a3a';
                item.style.transform = 'translateX(0)';
            });

            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 设置输入框的值
                input.value = text;
                input.dispatchEvent(new Event('input', { bubbles: true }));

                // 查找并点击确认（添加5s延迟）
                const button = buttonSelector(input);
                if (button) {
                    setTimeout(() => {
                        button.click();
                    }, 5000);
                }

                // 移除建议框
                suggestionBox.remove();
                suggestionBox = null;
            });

            suggestionBox.appendChild(item);
        });

        // 将建议框附加到 body 以避免被容器剪裁
        document.body.appendChild(suggestionBox);
    }

    function initializeKiosk() {
        const input = document.querySelector('input[placeholder="Password"]') || document.querySelector('input.file\\:text-foreground');
        if (input) {
            input.addEventListener('focus', () => createSuggestions(input, (input) => input.closest('div').querySelector('button.dark\\:border-input')));
        }
    }

    function initializeNahida() {
        const observer = new MutationObserver((mutations) => {
            console.log('Mutation detected:', mutations);
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        const dialog = node.querySelector('[role=dialog]') || node.closest('.modal') || node;
                        if (dialog) {
                            console.log('Dialog found:', dialog);
                            const input = dialog.querySelector('input[placeholder=Password]') || dialog.querySelector('input.block.w-full.rounded-lg') || dialog.querySelector('input.file\\:text-foreground');
                            if (input) {
                                console.log('Input found:', input);
                                setTimeout(() => createSuggestions(input, (input) => dialog.querySelector('button.dark\\:border-input')), 500);
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    window.addEventListener('load', () => {
        if (window.location.hostname === 'kiosk.ac') {
            initializeKiosk();
        } else if (window.location.hostname === 'nahida.live') {
            initializeNahida();
        }
    });

    // 清理函数
    function cleanup() {
        if (suggestionBox) {
            suggestionBox.remove();
        }
    }

    // 页面卸载时清理
    window.addEventListener('unload', cleanup);
})();