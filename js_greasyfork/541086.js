// ==UserScript==
// @name         复制网页标题和链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在网页左上角显示复制按钮，点击后复制标题和链接到剪贴板
// @author       studio
// @license      MIT
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541086/%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/541086/%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #copy-title-url-container {
            position: fixed;
            top: 40px;
            left: 0;
            z-index: 9999;
            transition: transform 0.3s;
            transform: translateX(-85%); /* 调整为只隐藏大部分，但保留一点可见区域 */
        }

        #copy-title-url-container:hover {
            transform: translateX(0);
        }

        #copy-title-url-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.26);
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            white-space: nowrap;
        }

        #copy-title-url-btn:hover {
            background-color: #45a049;
        }

        #copy-title-url-toast {
            position: fixed;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            background-color: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
        }
    `);

    // 创建容器
    const container = document.createElement('div');
    container.id = 'copy-title-url-container';
    document.body.appendChild(container);

    // 创建按钮
    const button = document.createElement('button');
    button.id = 'copy-title-url-btn';
    button.textContent = '复制标题和链接';
    container.appendChild(button);

    // 创建提示框
    const toast = document.createElement('div');
    toast.id = 'copy-title-url-toast';
    toast.textContent = '已复制到剪贴板';
    document.body.appendChild(toast);

    // 点击事件
    button.addEventListener('click', function() {
        const title = document.title;
        const url = window.location.href;
        const text = `${title} - ${url}`;

        // 复制到剪贴板
        GM_setClipboard(text);

        // 显示提示
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    });
})();
