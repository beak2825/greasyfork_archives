// ==UserScript==
// @name         淘宝商品视频下载助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在淘宝商品详情页添加视频下载按钮
// @author       Your name
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519520/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519520/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮样式
    GM_addStyle(`
        .video-download-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 999;
            background: #ff4400;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            transition: background 0.3s ease;
        }
        .video-download-btn:hover {
            background: #ff5500;
        }
    `);

    // 主函数
    function init() {
        // 等待视频元素加载
        const checkVideo = setInterval(() => {
            const videoContainer = document.querySelector('.lib-video');
            if (videoContainer) {
                clearInterval(checkVideo);
                addDownloadButton(videoContainer);
            }
        }, 1000);
    }

    // 添加下载按钮
    function addDownloadButton(container) {
        const video = container.querySelector('video');
        if (!video) return;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'video-download-btn';
        downloadBtn.textContent = '下载视频';
        downloadBtn.onclick = () => downloadVideo(video.src);

        container.style.position = 'relative';
        container.appendChild(downloadBtn);
    }

    // 下载视频
    function downloadVideo(videoUrl) {
        if (!videoUrl) {
            alert('未找到视频地址');
            return;
        }

        // 获取商品标题作为文件名
        const title = document.querySelector('.tb-main-title')?.textContent.trim() ||
                     document.querySelector('.tb-detail-hd h1')?.textContent.trim() ||
                     '淘宝商品视频';

        const fileName = `${title}.mp4`;

        try {
            GM_download({
                url: videoUrl,
                name: fileName,
                onload: () => alert('下载开始'),
                onerror: (error) => alert('下载失败：' + error)
            });
        } catch (error) {
            // 如果GM_download不可用，使用传统方法
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    // 监听页面变化（因为淘宝使用了动态加载）
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                init();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化
    init();
})();