// ==UserScript==
// @name         优课在线防暂停
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  防止优课在线视频在失去焦点时自动暂停
// @author       Your Name
// @match        https://www.uooc.net.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532108/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%E9%98%B2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/532108/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%E9%98%B2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个定时器来持续检查视频状态
    let checkInterval = null;

    function startVideoCheck() {
        if (checkInterval) return;
        
        checkInterval = setInterval(() => {
            const video = document.querySelector('.video-js video');
            if (video) {
                // 如果视频暂停了，自动播放
                if (video.paused) {
                    video.play().catch(e => console.log('播放失败:', e));
                }
                
                // 移除video.js的blur事件监听
                const player = video.closest('.video-js');
                if (player) {
                    player.removeEventListener('blur', () => {});
                }
            }
        }, 1000);
    }

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const video = document.querySelector('.video-js video');
            if (video && video.paused) {
                video.play().catch(e => console.log('播放失败:', e));
            }
        }
    });

    // 监听页面加载完成
    window.addEventListener('load', startVideoCheck);

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                startVideoCheck();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 重写video.js的pause方法
    const originalPause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.pause = function() {
        // 检查是否是优课在线的视频
        if (this.closest('.video-js')) {
            // 如果页面隐藏，继续播放
            if (document.hidden) {
                this.play().catch(e => console.log('播放失败:', e));
                return;
            }
        }
        // 调用原始pause方法
        originalPause.call(this);
    };
})();