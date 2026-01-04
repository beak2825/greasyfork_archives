// ==UserScript==
// @name         DeepSeek紧凑化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DeepSeek紧凑化，使得小屏幕可以显示更多内容
// @author       zhuoy
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524056/DeepSeek%E7%B4%A7%E5%87%91%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/524056/DeepSeek%E7%B4%A7%E5%87%91%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义全局样式
    const globalStyles = `
        .be88ba8a {
            max-height: 40px !important;
            overflow: hidden !important;
        }
        .f8d1e4c0 {
            max-height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            flex-wrap: nowrap !important;
        }
        .d8ed659a {
            max-height: 40px !important;
            line-height: 1 !important;
            font-size: 16px !important;
        }
        .ds-icon {
            font-size: 16px !important;
            width: 16px !important;
            height: 16px !important;
        }
        .e886deb9 {
            display: none !important;
        }
        .cbcaa82c {
            height: 40px !important;
        }
    `;

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);

    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 检查是否有新元素被添加到DOM中
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 确保是元素节点
                        // 重新应用样式
                        const elements = {
                            be88ba8a: node.querySelector('.be88ba8a'),
                            f8d1e4c0: node.querySelector('.f8d1e4c0'),
                            d8ed659a: node.querySelector('.d8ed659a'),
                            dsIcons: node.querySelectorAll('.ds-icon'),
                            e886deb9: node.querySelector('.e886deb9'),
                            cbcaa82c: node.querySelector('.cbcaa82c')
                        };

                        if (elements.e886deb9) {
                            elements.e886deb9.remove();
                            console.log('开启新对话已移除');
                        }
                    }
                });
            }
        });
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();