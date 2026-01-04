// ==UserScript==
// @name         通用视频信息显示3.0
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  显示任意网页中的视频分辨率、播放时间等信息
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512693/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA30.user.js
// @updateURL https://update.greasyfork.org/scripts/512693/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA30.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建视频信息面板
    function createInfoPanel(video) {
        const infoPanel = document.createElement('div');
        infoPanel.style.position = 'fixed';
        infoPanel.style.top = '10px';
        infoPanel.style.right = '10px';
        infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        infoPanel.style.color = 'white';
        infoPanel.style.padding = '10px';
        infoPanel.style.fontSize = '14px';
        infoPanel.style.zIndex = '9999';
        infoPanel.style.borderRadius = '5px';
        infoPanel.style.pointerEvents = 'none'; // 防止面板阻挡交互

        document.body.appendChild(infoPanel);

        // 更新视频信息
        const updateInfo = () => {
            if (video.readyState >= 1) {  // 确保视频元数据已加载
                const resolution = `${video.videoWidth} x ${video.videoHeight}`;
                const currentTime = video.currentTime.toFixed(2);
                const duration = video.duration.toFixed(2);
                
                infoPanel.innerHTML = `
                    <strong>视频信息:</strong><br/>
                    分辨率: ${resolution}<br/>
                    播放时间: ${currentTime}s / ${duration}s
                `;
            }
            requestAnimationFrame(updateInfo);  // 平滑更新信息
        };

        updateInfo();  // 启动信息更新
    }

    // 监听视频元素加载
    function monitorVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // 只有当视频元数据加载后才能显示信息
            if (video.readyState >= 1) {
                createInfoPanel(video);
            } else {
                video.addEventListener('loadedmetadata', () => createInfoPanel(video));
            }
        });
    }

    // 延迟检测视频，以确保页面加载完成
    window.addEventListener('load', () => {
        setTimeout(monitorVideos, 1000);  // 延迟一秒等待所有资源加载
    });
})();
