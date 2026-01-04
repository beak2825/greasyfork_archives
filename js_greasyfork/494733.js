// ==UserScript==
// @name         东软智慧平台视频助手
// @namespace    ukpkmkk
// @version      0.5
// @description  Skip your video
// @author       Yx
// @match       https://neustudydl.neumooc.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494733/%E4%B8%9C%E8%BD%AF%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/494733/%E4%B8%9C%E8%BD%AF%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 添加CSS样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    /* 基础按钮样式 */
    .button {
        display: inline-block;
        border-radius: 4px;
        background-color: #4CAF50; /* 按钮背景色 */
        border: none;
        color: #FFFFFF; /* 文字颜色 */
        text-align: center;
        font-size: 16px;
        padding: 10px 20px; /* 内边距 */
        transition: all 0.6s; /* 过渡效果 */
        cursor: pointer; /* 鼠标样式 */
        margin: 5px;
        position: fixed;
        bottom: 100px; /* 将按钮放在右下角 */
        right: 10px;
        z-index: 10000;
    }

    /* 按钮悬停效果 */
    .button:hover {
        background-color: #337ab7; /* 按钮悬停时的背景色 */
        color: #FFFF00; /* 按钮悬停时的文字颜色 */
    }

    /* 按钮点击效果 */
    .button:active {
        background-color: #555555; /* 按钮按下时的背景色 */
        box-shadow: 0 5px #666; /* 按钮按下时的阴影效果 */
        transform: translateY(4px); /* 按钮按下时的位移效果 */
    }
    `;
    document.head.appendChild(style);

    // 创建跳到视频末尾的按钮
    var buttonSkipToEnd = document.createElement('button');
    buttonSkipToEnd.textContent = '跳到视频末尾';
    buttonSkipToEnd.className = 'button'; 
    buttonSkipToEnd.style.bottom = '160px'; // 调整位置避免重叠

    // 添加点击事件
    buttonSkipToEnd.addEventListener('click', function() {
        let videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++) {
            videos[i].currentTime = videos[i].duration;
        }
    });

    document.body.appendChild(buttonSkipToEnd);
})();