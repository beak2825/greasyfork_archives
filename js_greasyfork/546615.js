// ==UserScript==
// @name         Bilibili Buffer Unlocker(B站缓冲解限)
// @name:zh      B站缓冲解限
// @name:en      Bilibili Buffer Unlocker
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Increase Bilibili player video buffer duration, intelligently prevent memory overflow, and integrate with player statistics UI\n解限B站播放器缓冲时长，智能防止内存溢出，播放器统计信息UI集成
// @description:zh 解限B站播放器缓冲时长，智能防止内存溢出，播放器统计信息UI集成
// @description:en Increase Bilibili player video buffer duration, intelligently prevent memory overflow, and integrate with player statistics UI
// @author       \7. with Gemini 3 Pro
// @match        *://*.bilibili.com/*
// @match        *://bilibili.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546615/Bilibili%20Buffer%20Unlocker%28B%E7%AB%99%E7%BC%93%E5%86%B2%E8%A7%A3%E9%99%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546615/Bilibili%20Buffer%20Unlocker%28B%E7%AB%99%E7%BC%93%E5%86%B2%E8%A7%A3%E9%99%90%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 配置区域 ===
    const CONFIG = {
        MAX_TIME_LIMIT: 300,                // 时间上限 300秒
        SAFE_BYTE_LIMIT: 120 * 1024 * 1024, // 空间上限 120MB
        CHECK_INTERVAL: 3000,               // 内核检查间隔 3000毫秒
        UI_REFRESH_RATE: 1000               // UI 刷新间隔 1000毫秒
    };

    const Utils = {
        version: (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '2.0',
        formatTime: (s) => {
            if (!Number.isFinite(s) || s < 0) return '0s';
            if (s < 60) return Math.floor(s) + 's';
            return Math.floor(s / 60) + 'm' + Math.floor(s % 60) + 's';
        },
        formatSize: (bytes) => {
            if (bytes === 0) return '0M';
            return (bytes / (1024 * 1024)).toFixed(0) + 'M';
        }
    };

    const CoreManager = {
        getCore: () => window.player && window.player.__core ? window.player.__core() : null,

        getCurrentBytesPerSecond: () => {
            try {
                const core = CoreManager.getCore();
                if (!core || !core.state || !core.state.mediaInfo) return 0;
                return ((core.state.mediaInfo.videoDataRate || 0) + (core.state.mediaInfo.audioDataRate || 0)) / 8;
            } catch (e) { return 0; }
        },

        calculateSafeDuration: () => {
            const bps = CoreManager.getCurrentBytesPerSecond();
            if (bps <= 0) return CONFIG.MAX_TIME_LIMIT;
            const safeSeconds = CONFIG.SAFE_BYTE_LIMIT / bps;
            return Math.max(10, Math.min(CONFIG.MAX_TIME_LIMIT, Math.floor(safeSeconds)));
        },

        applyOptimization: () => {
            try {
                const core = CoreManager.getCore();
                if (!core || typeof core.setStableBufferTime !== 'function') return;

                const currentSafeTarget = CoreManager.calculateSafeDuration();
                const currentSetting = core.getStableBufferTime();

                if (Math.abs(currentSetting - currentSafeTarget) > 3 || currentSetting < currentSafeTarget) {
                    core.setStableBufferTime(currentSafeTarget);
                }
            } catch (e) { }
        },

        getStats: () => {
            try {
                const core = CoreManager.getCore();
                const video = document.querySelector('video');
                const bps = CoreManager.getCurrentBytesPerSecond();

                // 1. 基础目标计算 (基于内存和时间上限)
                let baseTargetTime = CONFIG.MAX_TIME_LIMIT;
                if (core && core.getStableBufferTime) {
                    baseTargetTime = CoreManager.calculateSafeDuration();

                    // 顺手修正一下设置 (注意：设置给内核的值不需要被剩余时间截断，内核自己会处理 EOF)
                    if (core.getStableBufferTime() !== baseTargetTime) {
                        CoreManager.applyOptimization();
                    }
                }

                // 2. 获取实际缓冲时间与剩余时间
                let bufferedTime = 0;
                let remainingTime = 9999;

                if (video) {
                    if (Number.isFinite(video.duration) && Number.isFinite(video.currentTime)) {
                        remainingTime = Math.max(0, video.duration - video.currentTime);
                    }

                    if (video.buffered.length > 0) {
                        const end = video.buffered.end(video.buffered.length - 1);
                        bufferedTime = Math.max(0, end - video.currentTime);
                    } else if (core && typeof core.getBufferLength === 'function') {
                        bufferedTime = core.getBufferLength('video');
                    }
                }

                // 如果剩余时间小于目标时间，则以剩余时间为准，避免误导
                const finalTargetTime = Math.min(baseTargetTime, remainingTime);

                return {
                    time: {
                        current: bufferedTime || 0,
                        target: finalTargetTime,
                        percent: finalTargetTime > 1 ? (bufferedTime / finalTargetTime) * 100 : 100
                    },
                    memory: {
                        current: bufferedTime * bps,
                        // 显存上限显示也跟随实际目标动态变化
                        limit: finalTargetTime * bps
                    }
                };
            } catch (e) {
                return null;
            }
        }
    };

    const UIManager = {
        timer: null,
        inject: () => {
            const container = document.querySelector('#bilibili-player .bpx-player-info-container');
            if (!container) return;
            if (!container.querySelector('.info-line .info-title')) return;

            let myPanel = container.querySelector('#my-buffer-overlay');
            if (!myPanel) {
                myPanel = document.createElement('div');
                myPanel.id = 'my-buffer-overlay';
                // 字体样式优化：继承父元素字体，确保与B站一致
                myPanel.style.cssText = `margin:0;padding:8px 12px;border-top:1px solid rgba(255,255,255,0.2);font-size:12px;color:#fff;display:block;font-family:inherit;`;
                container.appendChild(myPanel);
            }

            const stats = CoreManager.getStats();
            if (stats) {
                const isTimeHealthy = stats.time.current > 10 && stats.time.percent > 30;
                const timeColor = isTimeHealthy ? '#52c41a' : '#faad14';
                const memColor = '#bae637';
                myPanel.innerHTML = `
                    <div class="info-line" style="display:flex; align-items:center;">
                        <span class="info-title" style="color:#999; margin-right:8px;">缓冲</span>
                        <span class="info-data" style="font-weight:bold;">
                            <span style="color:${timeColor}">${Utils.formatTime(stats.time.current)}</span>
                            <span style="color:#666; margin:0 1px;">/</span>
                            <span style="color:#888">${Utils.formatTime(stats.time.target)}</span>
                            
                            <span style="display:inline-block; width:1px; height:10px; background:#444; margin:0 6px;"></span>
                            
                            <span style="color:${memColor}">${Utils.formatSize(stats.memory.current)}</span>
                            <span style="color:#666; margin:0 1px;">/</span>
                            <span style="color:#888; font-size:11px;">${Utils.formatSize(stats.memory.limit)}</span>
                        </span>
                    </div>
                `;
            }
        },
        start: () => {
            if (!UIManager.timer) UIManager.timer = setInterval(UIManager.inject, CONFIG.UI_REFRESH_RATE);
        }
    };

    const main = () => {
        console.log(`[B站缓冲解限] 🚀 脚本已加载 (v${Utils.version})`);
        setInterval(CoreManager.applyOptimization, CONFIG.CHECK_INTERVAL);
        UIManager.start();
        setTimeout(CoreManager.applyOptimization, 2000);
    };

    main();
})();
