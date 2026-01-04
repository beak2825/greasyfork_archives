// ==UserScript==
// @name         MissAV 防止自動暫停 (兼容新旧域名)-ai制造
// @namespace    https://github.com/DonkeyBear
// @version      0.5
// @description  防止 MissAV 在切換視窗/標籤時自動暫停，支持 missav.ai 和 missav.live
// @author       DonkeyBear
// @match        https://missav.ai/*
// @match        https://missav.live/*
// @match        https://missav.live/dm15/cn/*
// @icon         https://missav.ai/img/favicon.ico/*
// @match        https://missav.live/cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538349/MissAV%20%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C%20%28%E5%85%BC%E5%AE%B9%E6%96%B0%E6%97%A7%E5%9F%9F%E5%90%8D%29-ai%E5%88%B6%E9%80%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/538349/MissAV%20%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C%20%28%E5%85%BC%E5%AE%B9%E6%96%B0%E6%97%A7%E5%9F%9F%E5%90%8D%29-ai%E5%88%B6%E9%80%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // 配置参数
    const CONFIG = {
        // 新域名视频选择器 (根据实际页面结构调整)
        VIDEO_SELECTOR: 'video.vjs-tech',
        // 旧域名备用选择器
        FALLBACK_SELECTOR: 'video.player',
        // 检测间隔(毫秒)
        CHECK_INTERVAL: 1000,
        // 最大检测次数
        MAX_CHECKS: 10
    };

    // 只在视频页面运行 (如 /dm45, /dm22 等)
    if (!window.location.pathname.match(/\/dm\d+/i)) {
        return;
    }

    // 等待视频加载的简单实现
    const waitForVideo = (callback) => {
        const maxAttempts = 10;
        let attempts = 0;

        const checkVideo = () => {
            // 尝试两种选择器
            const video = document.querySelector('video.vjs-tech') ||
                          document.querySelector('video.player');

            if (video && video.readyState > 0) {
                callback(video);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkVideo, 500);
            }
        };

        checkVideo();
    };

    // 主功能
    const initAntiPause = (videoPlayer) => {
        let windowIsBlurred = false;

        window.onblur = () => {
            windowIsBlurred = true;
        };

        window.onfocus = () => {
            windowIsBlurred = false;
        };

        videoPlayer.onpause = () => {
            if (windowIsBlurred) {
                videoPlayer.play();
            }
        };

        console.log('[MissAV防暂停] 脚本已激活');
    };

    // 页面加载完成后启动
    if (document.readyState === 'complete') {
        waitForVideo(initAntiPause);
    } else {
        window.addEventListener('load', () => {
            waitForVideo(initAntiPause);
        });
    }
})();