// ==UserScript==
// @name         Semantic Scholar Citation Badge Generator
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动生成Semantic Scholar上一篇文章的引用数牌，可以粘贴到md文档中使用。生成按钮在我文章界面左上角。
// @match        https://www.semanticscholar.org/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461939/Semantic%20Scholar%20Citation%20Badge%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/461939/Semantic%20Scholar%20Citation%20Badge%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否为指定的文章页面
    const isPaperPage = /^https:\/\/www\.semanticscholar\.org\/paper\/.+\/[0-9a-f]+$/.test(window.location.href);

    // 如果不是指定的文章页面，则退出
    if (!isPaperPage) {
        return;
    }

    // 获取当前页面 URL 的最后一段字符串
    const urlLastPart = window.location.pathname.split('/').pop();


    // 生成 API URL
    const apiUrl = `[![](https://img.shields.io/badge/dynamic/json?label=citation&query=citationCount&url=https://api.semanticscholar.org/graph/v1/paper/${urlLastPart}?fields=citationCount)](https://www.semanticscholar.org/paper/${urlLastPart})`;

    // 创建要保存到剪贴板的字符串
    const clipboardStr = apiUrl;

    // 添加按钮到页面
    const button = document.createElement('button');
    button.textContent = 'Generate Citation Badge';
    button.style.position = 'fixed';
    button.style.top = '100px';
    button.style.left = '20px';
    button.addEventListener('click', () => {
        GM_setClipboard(clipboardStr);
        button.textContent = 'Citation Badge Copied!';
        window.setTimeout(() => {
            button.textContent = 'Generate Citation Badge';
        }, 1000); // 1秒钟后将按钮文本更改回 "Generate Citation Badge"
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
