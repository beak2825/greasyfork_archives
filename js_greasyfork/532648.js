// ==UserScript==
// @name         网站信息复制助手
// @namespace    your-namespace
// @version      1.0
// @description  在浏览器右侧添加一个可拖拽的图标，点击后可以复制网站名称和链接
// @author       Gibber1977
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532648/%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532648/%E7%BD%91%E7%AB%99%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式
    GM_addStyle(`
        #copyHelperIcon {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background-color: #eee;
            border: 1px solid #ccc;
            border-radius: 5px 0 0 5px;
            padding: 10px;
            cursor: grab;
            opacity: 0.7;
            z-index: 9999;
            font-size: 16px;
            line-height: 1;
        }
        #copyHelperIcon:hover {
            opacity: 1;
        }
        #copyHelperMenu {
            position: fixed;
            top: 50%;
            right: 40px; /* 稍微偏移，不与图标重叠 */
            transform: translateY(-50%);
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 10000;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
            display: none; /* 初始隐藏 */
        }
        #copyHelperMenu button {
            display: block;
            width: 100%;
            padding: 8px 10px;
            margin-bottom: 5px;
            border: none;
            background-color: transparent;
            text-align: left;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        }
        #copyHelperMenu button:last-child {
            border-bottom: none;
        }
        #copyHelperMenu button:hover {
            background-color: #f0f0f0;
        }
    `);

    // 创建图标元素
    const copyHelperIcon = document.createElement('div');
    copyHelperIcon.id = 'copyHelperIcon';
    copyHelperIcon.innerText = '🔗'; // 使用网络链接图标
    document.body.appendChild(copyHelperIcon);

    // 创建菜单元素
    const copyHelperMenu = document.createElement('div');
    copyHelperMenu.id = 'copyHelperMenu';
    document.body.appendChild(copyHelperMenu);

    // 添加菜单选项
    const copyNameButton = document.createElement('button');
    copyNameButton.innerText = 'Copy Name';
    copyNameButton.addEventListener('click', () => {
        GM_setClipboard(document.title);
        copyHelperMenu.style.display = 'none';
    });
    copyHelperMenu.appendChild(copyNameButton);

    const copyLinkButton = document.createElement('button');
    copyLinkButton.innerText = 'Copy Link';
    copyLinkButton.addEventListener('click', () => {
        GM_setClipboard(window.location.href);
        copyHelperMenu.style.display = 'none';
    });
    copyHelperMenu.appendChild(copyLinkButton);

    const copyNameAndLinkButton = document.createElement('button');
    copyNameAndLinkButton.innerText = 'Copy Name & Link';
    copyNameAndLinkButton.addEventListener('click', () => {
        const text = `${document.title}\n${window.location.href}`;
        GM_setClipboard(text);
        copyHelperMenu.style.display = 'none';
    });
    copyHelperMenu.appendChild(copyNameAndLinkButton);

    const copyMarkdownButton = document.createElement('button');
    copyMarkdownButton.innerText = 'Copy Name & Link in Markdown';
    copyMarkdownButton.addEventListener('click', () => {
        const text = `[${document.title}](${window.location.href})`;
        GM_setClipboard(text);
        copyHelperMenu.style.display = 'none';
    });
    copyHelperMenu.appendChild(copyMarkdownButton);

    // 添加更多你认为有必要的功能按钮
    const copyAsHtmlButton = document.createElement('button');
    copyAsHtmlButton.innerText = 'Copy as HTML Link';
    copyAsHtmlButton.addEventListener('click', () => {
        const text = `<a href="${window.location.href}">${document.title}</a>`;
        GM_setClipboard(text);
        copyHelperMenu.style.display = 'none';
    });
    copyHelperMenu.appendChild(copyAsHtmlButton);

    // 图标点击事件：显示/隐藏菜单
    copyHelperIcon.addEventListener('click', () => {
        copyHelperMenu.style.display = copyHelperMenu.style.display === 'none' ? 'block' : 'none';
    });

    // 实现图标的拖拽功能（垂直方向）
    let isDragging = false;
    let startY = 0;
    let currentY = 0;

    copyHelperIcon.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY - copyHelperIcon.offsetTop;
        copyHelperIcon.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentY = e.clientY - startY;
        // 限制只能在垂直方向移动
        copyHelperIcon.style.top = currentY + 'px';
        copyHelperIcon.style.bottom = 'auto'; // 防止同时设置 top 和 bottom 导致冲突
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        copyHelperIcon.style.cursor = 'grab';
    });

    // 防止拖拽时选中文字
    copyHelperIcon.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

})();