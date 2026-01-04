// ==UserScript==
// @name         JavDB图片下载
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Download all images from a JavDB gallery page
// @author       Anonymous
// @match        https://javdb.com/v/*
// @grant        GM_download
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523740/JavDB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523740/JavDB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to download an image
    function downloadImage(url, filename) {
        GM_download({
            url: url,
            name: filename,
            saveAs: false
        });
    }

    // Function to download all images
    function downloadAllImages() {
        // 获取页面的 ID
        const pageId = window.location.pathname.split('/v/')[1];

        // 检查页面 ID 是否有效
        if (!pageId) {
            GM_notification({
                text: '无法获取页面 ID。',
                title: '下载失败',
                timeout: 4000
            });
            return;
        }

        // 从页面 ID 提取前两位的小写字母作为文件夹前缀
        const prefix = pageId.slice(0, 2).toLowerCase(); // 获取页面 ID 的前两位小写字母
        const baseUrl = `https://c0.jdbstatic.com/samples/${prefix}/${pageId}_l_`;

        // 通过页面中的图片数量动态设置总图像数
        const totalImages = 50; // 假设有 50 张图片，你可以动态调整这个值

        let images = [];

        // 生成图片的 URL
        for (let i = 0; i < totalImages; i++) {  // 从 0 开始
            let imgUrl = `${baseUrl}${i}.jpg`;
            images.push(imgUrl);
        }

        // 下载每一张图片
        images.forEach((imgUrl, index) => {
            let filename = `image_${index}.jpg`;
            downloadImage(imgUrl, filename);
        });

        // 提醒用户下载完成
        GM_notification({
            text: '所有图片已开始下载。',
            title: '下载完成',
            timeout: 4000
        });
    }

    // 创建一个按钮来触发下载所有图片
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download All Images';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '50%'; // 垂直居中
    downloadButton.style.right = '10px'; // 右侧
    downloadButton.style.transform = 'translateY(-50%)'; // 使其精确居中
    downloadButton.style.padding = '10px';
    downloadButton.style.backgroundColor = '#007bff';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.zIndex = '9999'; // 确保它在其他元素上方
    downloadButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 增加阴影效果

    // 添加点击事件来触发下载过程
    downloadButton.addEventListener('click', downloadAllImages);

    // 将按钮添加到页面中
    document.body.appendChild(downloadButton);
})();
