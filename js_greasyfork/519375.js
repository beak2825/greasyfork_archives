// ==UserScript==
// @name         查找Steam高清视频链接
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  查找页面中的 max.mp4 链接并展示
// @author       Apeng
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519375/%E6%9F%A5%E6%89%BESteam%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/519375/%E6%9F%A5%E6%89%BESteam%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取整个页面的HTML内容
    const htmlContent = document.documentElement.innerHTML;

    // 使用正则表达式匹配以"https:"开头，且包含"max.mp4"的链接
    const regex = /https:[^"']*max\.mp4[^"']*/g;

    // 执行匹配
    const matches = htmlContent.match(regex);

    // 创建显示结果的元素
    const displayDiv = document.createElement('div');
    displayDiv.style.position = 'fixed';
    displayDiv.style.top = '10px';
    displayDiv.style.left = '10px';
    displayDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    displayDiv.style.border = '1px solid #000';
    displayDiv.style.padding = '10px';
    displayDiv.style.zIndex = '9999';
    displayDiv.style.maxHeight = '300px';
    displayDiv.style.overflowY = 'auto';
    displayDiv.style.fontSize = '14px';
    displayDiv.style.fontFamily = 'Arial, sans-serif';
    displayDiv.style.color = 'black'; // 设置字体颜色为黑色
    displayDiv.innerHTML = "<strong>已找到的视频链接（下载需要使用科学上网）:</strong><br>";

    // 如果找到链接
    if (matches && matches.length > 0) {
        matches.forEach(link => {
            const linkElement = document.createElement('div'); // 使用 div 包裹链接和按钮

            const urlElement = document.createElement('a');
            urlElement.href = link; // 设置链接
            urlElement.textContent = link; // 显示的文本
            urlElement.style.color = 'black'; // 设置链接字体颜色为黑色
            urlElement.target = '_blank'; // 在新标签页中打开
            urlElement.style.display = 'block'; // 使每个链接在新行显示
            linkElement.appendChild(urlElement);

            // 创建下载按钮
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载';
            downloadButton.style.marginLeft = '10px';
            downloadButton.onclick = function() {
                window.location.href = link; // 跳转下载
            };
            linkElement.appendChild(downloadButton);

            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.textContent = '复制';
            copyButton.style.marginLeft = '10px';
            copyButton.onclick = function() {
                navigator.clipboard.writeText(link).then(() => {
                    alert('链接已复制到剪切板！');
                });
            };
            linkElement.appendChild(copyButton);

            displayDiv.appendChild(linkElement);
        });
    } else {
        displayDiv.textContent += '没有找到视频链接。';
    }

    // 将结果添加到页面中
    document.body.appendChild(displayDiv);
})();
