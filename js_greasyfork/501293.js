// ==UserScript==
// @name         微信读书黑夜模式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击按钮改变weread.qq.com网页背景主色调
// @author       RicardoPu
// @match        *://weread.qq.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/501293/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/501293/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并插入按钮到页面
    const button = document.createElement('button');
    button.textContent = '改变背景色';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#fff';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 定义一个颜色数组，可以根据需要添加更多颜色
    const colors = [ '#000000'];

    // 为按钮添加点击事件监听器
    button.addEventListener('click', () => {
        // 随机选择一个颜色
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        // 更改页面中心阅读区域的背景色
        const readingArea = document.querySelector('.app_content'); // 使用 .app_content 选择器
        if (readingArea) {
            readingArea.style.backgroundColor = randomColor;
        }
    });
})();
