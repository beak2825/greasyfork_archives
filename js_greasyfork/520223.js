// ==UserScript==
// @name         打开Obsidian笔记(from bangumi)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在bgm.tv/subject页面添加一个按钮，点击后在Obsidian中打开笔记
// @author       Sedoruee
// @match        https://bgm.tv/subject/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520223/%E6%89%93%E5%BC%80Obsidian%E7%AC%94%E8%AE%B0%28from%20bangumi%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520223/%E6%89%93%E5%BC%80Obsidian%E7%AC%94%E8%AE%B0%28from%20bangumi%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取网页标题元素
    const nameSingleLink = document.querySelector('.nameSingle > a');
    const nameSingleDiv = document.querySelector('.nameSingle');

    if (nameSingleLink) {
        const title = nameSingleLink.textContent;

        // 清理标题
        const cleanTitle = title.replace(/[<>,:"|?*/\\ ]/g, '_');

        // 构建 Obsidian URI
        const obsidianURI = `obsidian://open?vault=Obsidian&file=${cleanTitle}`;

        // 创建按钮
        const createButton = (text, link, clickHandler) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.marginLeft = '5px';
            button.addEventListener('click', clickHandler);
            nameSingleDiv.appendChild(button);
        }

        // 绑定点击事件
        createButton('打开Obsidian笔记', obsidianURI, () => {
            window.location.href = obsidianURI;
        });
    } else {
        console.error("未找到标题元素");
    }
})();