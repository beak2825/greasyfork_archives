// ==UserScript==
// @name         TMDB影视资源直通车
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  添加在TDDB内便于用户快速找到影视资源的神器！
// @author       破坏游戏的孩子
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501898/TMDB%E5%BD%B1%E8%A7%86%E8%B5%84%E6%BA%90%E7%9B%B4%E9%80%9A%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/501898/TMDB%E5%BD%B1%E8%A7%86%E8%B5%84%E6%BA%90%E7%9B%B4%E9%80%9A%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加必要的CSS样式
    const style = document.createElement('style');
    style.textContent = `
        section.inner_content section.header ul.actions {
            margin-bottom: 20px;
            width: 100%;
            height: 68px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .tmdb-download-button {
            display: inline-block;
            background-color: transparent;
            color: #fff;
            padding: 8px 16px;
            border: 1px solid #01b4e4;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            margin-right: 8px;
            transition: background-color 0.3s ease;
        }

        .tmdb-download-button:hover {
            background-color: #01b4e4;
        }
    `;
    document.head.appendChild(style);

    // 创建下载按钮元素
    const downloadButton = document.createElement('a');
    downloadButton.classList.add('tmdb-download-button');
    downloadButton.href = '#';
    downloadButton.textContent = '下载资源';

    // 将下载按钮添加到页面
    const actionButtons = document.querySelector('section.inner_content section.header ul.actions');
    if (actionButtons) {
        actionButtons.insertBefore(downloadButton, actionButtons.firstChild);
    } else {
        console.error('Could not find the action buttons container element.');
    }

    // 添加点击事件监听器
    downloadButton.addEventListener('click', () => {
        // 获取当前网页的URL
        const currentUrl = window.location.href;

        // 打开新的页面并传递当前网页的URL作为参数
        window.open(`https://example.com/download?url=${encodeURIComponent(currentUrl)}`, '_blank');
    });
})();