// ==UserScript==
// @name         百度首页简化器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简化百度首页，只保留搜索框
// @author       Your name
// @match        *://www.baidu.com/
// @match        *://baidu.com/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519275/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/519275/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏不需要的元素 */
        #s-top-left,
        #u1,
        #s_side_wrapper,
        #bottom_layer,
        #s_wrap,
        .s-bottom-layer-content,
        #bottom_container,
        .s-hotsearch-wrapper,
        .s-news-wrapper {
            display: none !important;
        }

        /* 调整logo位置 */
        #lg {
            margin-top: 100px !important;
        }

        /* 调整搜索框位置 */
        #form {
            margin-top: 30px !important;
        }

        /* 保持页面干净 */
        .wrapper_new #head {
            border-bottom: none !important;
        }

        /* 移除背景 */
        #head {
            background: none !important;
        }
    `;

    // 添加样式到页面
    document.head.appendChild(style);

    // 移除多余的DOM元素
    function removeElements() {
        const elementsToRemove = [
            'bottom_layer',
            's_side_wrapper',
            's-bottom-layer-content',
            'bottom_container'
        ];

        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeElements);
    // 也在DOM加载完成后执行一次，以确保元素被移除
    document.addEventListener('DOMContentLoaded', removeElements);
})(); 