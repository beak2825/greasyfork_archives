// ==UserScript==
// @name         Bilibili 影片截圖
// @namespace    https://tiejeng.com/
// @version      1.3
// @description  在 Bilibili 影片頁面左下角插入影片截圖按鈕，擷取當下畫面並保存為 Png 圖片。
// @author       鐵定有好貨
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @grant        none
// @license CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/517952/Bilibili%20%E5%BD%B1%E7%89%87%E6%88%AA%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/517952/Bilibili%20%E5%BD%B1%E7%89%87%E6%88%AA%E5%9C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Create screenshot button
    const btn = document.createElement('button');
    btn.innerHTML = '影片截圖';
    btn.style.cssText = `
        position: fixed;
        left: 20px;
        bottom: 20px;
        z-index: 9999;
        padding: 8px 16px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    // Screenshot functionality
    btn.addEventListener('click', function() {
        const video = document.querySelector('video');
        if (!video) {
            alert('找不到影片元素');
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const link = document.createElement('a');
        link.download = `screenshot_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    document.body.appendChild(btn);
})();