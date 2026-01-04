// ==UserScript==
// @name         JavDB Actor Info Copier
// @namespace    https://javdb.com/
// @version      1.8.1
// @description  Copy the first part of the title and current URL to clipboard
// @author       YourName
// @include      https://javdb*.com/*
// @exclude      https://javdb*.com/
// @exclude      https://javdb*.com/v/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513262/JavDB%20Actor%20Info%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/513262/JavDB%20Actor%20Info%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '复制 RSS';
    button.style.position = 'fixed';
    button.style.top = '80px';
    button.style.right = '40px';
    button.style.zIndex = '0';
    button.style.padding = '12px'; // 调整按钮的内边距，变大
    button.style.fontSize = '20px'; // 调整按钮字体大小
    button.style.backgroundColor = '#ff450050';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '8px'; // 边框圆角
    button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; // 添加阴影使其更显眼
    // button.style.transition = 'transform 0.1s'; // 添加过渡效果

    // 鼠标按下事件
    button.addEventListener('mousedown', () => {
        button.style.transform = 'translateY(6px)'; // 向下移动5像素
    });

    // 鼠标松开事件
    button.addEventListener('mouseup', () => {
        button.style.transform = 'translateY(0)'; // 恢复原位
    });

    // 点击按钮事件
    button.addEventListener('click', () => {
        const title = document.title.split(' ')[0]; // 取网页标题从开头到第一个空格之前的部分
        const encodedUrl = encodeURIComponent(window.location.href); // 当前网址
        const textToCopy = `https://feed-go.lzhh.duckdns.org/?url=${encodedUrl}`;

        // 复制到剪贴板
        GM_setClipboard(textToCopy);
        // alert('已复制: ' + textToCopy);
    });

    // 将按钮添加到页面
    document.body.appendChild(button);

})();
