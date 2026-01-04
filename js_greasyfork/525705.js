// ==UserScript==
// @name         智慧教育平台辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  辅助学习功能演示
// @author       AI助手
// @match        https://www.smartedu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525705/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525705/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数（谨慎调整）
    const config = {
        playbackRate: 1.0,   // 播放速度（部分平台可能限制）
        waitEleTimeout: 5000,// 元素等待超时
        checkInterval: 2000  // 进度检查间隔
    };

    // 等待元素工具函数
    const waitForEle = (selector, timeout=config.waitEleTimeout) => {
        return new Promise((resolve) => {
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (Date.now() - start > timeout) return resolve(null);
                setTimeout(check, 100);
            };
            check();
        });
    };

    // 核心逻辑
    const init = async () => {
        // 等待播放器加载
        const videoPlayer = await waitForEle('video');
        if (!videoPlayer) {
            console.log('未检测到视频播放器');
            return;
        }

        // 设置播放参数
        try {
            videoPlayer.playbackRate = config.playbackRate;
            videoPlayer.play();
        } catch (e) {
            console.warn('播放控制受限:', e);
        }

        // 监听播放结束
        videoPlayer.addEventListener('ended', async () => {
            console.log('当前视频播放完成');
            const nextBtn = await waitForEle('.next-button-selector');
            nextBtn?.click();
        });

        // 定期检查进度
        setInterval(async () => {
            const progress = document.querySelector('.progress-indicator');
            console.log('当前学习进度:', progress?.innerText);
        }, config.checkInterval);
    };

    // 延迟启动
    setTimeout(init, 3000);
})();