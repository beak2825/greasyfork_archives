// ==UserScript==
// @name            YouTube Video Optimizer
// @namespace       EnhancedScript
// @version         3.0.5
// @description     强制720p/30fps + 禁用AV1/VP9编码 + 性能优化
// @author          Optimized Script
// @match           *://*.youtube.com/*
// @exclude         *://www.youtube.com/tv*
// @exclude         *://www.youtube.com/live_chat*
// @exclude         *://www.youtube.com/
// @run-at          document-start
// @grant           none
// @license         MIT
// @compatible      chrome
// @compatible      firefox
// @compatible      edge
// @unwrap
// @allFrames       true
// @downloadURL https://update.greasyfork.org/scripts/529866/YouTube%20Video%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/529866/YouTube%20Video%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式配置
    const DEBUG = {
        FORMAT: false,     // 显示格式检测日志
        PERFORMANCE: false // 显示性能数据
    };

    // 核心配置参数
    const VIDEO_CONFIG = {
        MAX_HEIGHT: 720,   // 最大垂直分辨率
        MAX_FPS: 30,       // 最大帧率
        BANNED_CODECS: ['av01', 'vp9', 'vp09'] // 禁止的编码格式
    };

    // 初始化性能统计
    const perfStats = {
        startTime: performance.now(),
        blocks: { codec: 0, resolution: 0, framerate: 0 }
    };

    // 编码格式检测器
    const checkCodec = (type) => {
        const codecPattern = new RegExp(`codecs=[\\x20-\\x7F]+\\b(${VIDEO_CONFIG.BANNED_CODECS.join('|')})\\b`);
        return codecPattern.test(type);
    };

    // 分辨率检测器
    const checkResolution = (type) => {
        const height = (type.match(/height=(\d+)/) || [0, 0])[1];
        return height > VIDEO_CONFIG.MAX_HEIGHT;
    };

    // 帧率检测器
    const checkFramerate = (type) => {
        const fps = (type.match(/framerate=(\d+)/) || [0, 0])[1];
        return fps > VIDEO_CONFIG.MAX_FPS;
    };

    // 增强型格式验证器
    const createEnhancedValidator = (originalCheck) => (type) => {
        let blockReason = null;

        // 编码格式检测
        if (checkCodec(type)) {
            blockReason = 'codec';
            perfStats.blocks.codec++;
        }
        
        // 分辨率检测
        else if (checkResolution(type)) {
            blockReason = 'resolution';
            perfStats.blocks.resolution++;
        }
        
        // 帧率检测
        else if (checkFramerate(type)) {
            blockReason = 'framerate';
            perfStats.blocks.framerate++;
        }

        if (blockReason) {
            DEBUG.FORMAT && console.log(`Blocked [${blockReason}]: ${type}`);
            return false;
        }

        return originalCheck(type);
    };

    // 编码格式强制禁用系统
    const disableAdvancedCodecs = () => {
        // 修改MediaSource检测
        if (window.MediaSource) {
            const originalMSE = MediaSource.isTypeSupported.bind(MediaSource);
            MediaSource.isTypeSupported = createEnhancedValidator(originalMSE);
        }

        // 修改VideoElement检测
        const videoProto = HTMLVideoElement.prototype;
        if (videoProto && videoProto.canPlayType) {
            const originalCPT = videoProto.canPlayType.bind(videoProto);
            videoProto.canPlayType = function(type) {
                return checkCodec(type) ? '' : originalCPT(type);
            };
        }

        // 持久化设置
        try {
            Object.defineProperty(localStorage, 'yt-player-av1-pref', {
                get: () => '-1',
                set: () => true,
                configurable: true
            });
        } catch (e) {
            localStorage.setItem('yt-player-av1-pref', '-1');
        }
    };

    // 注入验证系统
    const injectionManager = () => {
        let retryCount = 0;
        const MAX_RETRIES = 2;

        const verifyInjection = () => {
            const success = Object.values(perfStats.blocks).some(v => v > 0);
            if (!success && retryCount++ < MAX_RETRIES) {
                location.reload();
            } else if (!success) {
                showErrorAlert();
            }
        };

        const showErrorAlert = () => {
            const style = `position:fixed; bottom:0; background:red; color:white; padding:15px; z-index:9999;`;
            document.body.insertAdjacentHTML('beforeend',
                `<div style="${style}">视频优化失败，请<a href="#" onclick="location.reload()">刷新页面</a></div>`);
        };

        setTimeout(verifyInjection, 5000);
    };

    // 性能监控
    const monitorPerformance = () => {
        if (DEBUG.PERFORMANCE) {
            setInterval(() => {
                console.table({
                    '注入时间': `${(performance.now() - perfStats.startTime).toFixed(1)}ms`,
                    '阻止次数': perfStats.blocks
                });
            }, 10000);
        }
    };

    // 主执行流程
    disableAdvancedCodecs();
    injectionManager();
    monitorPerformance();

})();