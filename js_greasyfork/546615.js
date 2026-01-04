// ==UserScript==
// @name         B站缓冲解限
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  解限B站播放器缓冲时长，将缓冲状态集成到播放器统计信息中。
// @author       \7. with GPT-5
// @match        *://*.bilibili.com/*
// @match        *://bilibili.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546615/B%E7%AB%99%E7%BC%93%E5%86%B2%E8%A7%A3%E9%99%90.user.js
// @updateURL https://update.greasyfork.org/scripts/546615/B%E7%AB%99%E7%BC%93%E5%86%B2%E8%A7%A3%E9%99%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置：缓冲时间设置（秒），以及检查间隔（秒）
    const BUFFER_TIME = 300;
    const SETTING_RECHECK_INTERVAL = 10; // 设置检查间隔
    const MONITOR_RECHECK_INTERVAL = 1;  // 监控更新间隔

    // 状态标记
    let isRunning = false;
    let isMonitoring = false;

    // 日志函数
    function log(message) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[B站缓冲解限] [${timestamp}] ${message}`);
    }

    // 获取播放器实例的核心函数
    function getPlayer() {
        try {
            if (window.player && typeof window.player.__core === 'function') {
                const core = window.player.__core();
                if (typeof core.setStableBufferTime === 'function') {
                    return core;
                }
            }
        } catch (e) {}
        return null;
    }

    // 应用缓冲优化（此函数现在会定期被调用）
    function applyBufferOptimization(player) {
        if (isRunning) {
            return;
        }

        isRunning = true;

        if (!player) {
            isRunning = false;
            return;
        }

        try {
            const currentBuffer = player.getStableBufferTime();
            if (currentBuffer < BUFFER_TIME) {
                player.setStableBufferTime(BUFFER_TIME);
                log(`✅ 缓冲设置已更新: ${currentBuffer}s → ${BUFFER_TIME}s`);
            } else {
                // log(`✅ 缓冲时间已是目标值: ${currentBuffer}s`);
            }
        } catch (e) {
            log(`❌ 应用优化失败: ${e.message}`);
        } finally {
            isRunning = false;
        }
    }

    // 监听统计面板的显示/隐藏，并注入信息
    function monitorStatsPanelVisibility(player) {
        if (isMonitoring) return;
        isMonitoring = true;

        const containerSelector = '#bilibili-player .bpx-player-info-container';
        try {
            if (window.__biliBufferInfoVisibilityPoll) clearInterval(window.__biliBufferInfoVisibilityPoll);
        } catch (e) {}

        window.__biliBufferInfoVisibilityPoll = setInterval(() => {
            try {
                const container = document.querySelector(containerSelector);
                if (!container) return;
                const panelLikelyVisible = !!container.querySelector('.info-line .info-title');
                const overlay = container.querySelector('.bilibili-buffer-info-overlay');
                if (panelLikelyVisible) {
                    if (!overlay) {
                        injectBufferInfo(container, player);
                    } else if (overlay.style.display === 'none') {
                        overlay.style.display = 'block';
                    }
                } else if (overlay) {
                    overlay.style.display = 'none';
                }
            } catch (e) {}
        }, MONITOR_RECHECK_INTERVAL * 1000);
    }

    // 注入缓冲信息到统计面板容器
    function injectBufferInfo(statsPanel, player) {
        try {
            log('🔍 开始注入缓冲信息...');
            const container = statsPanel.closest('#bilibili-player .bpx-player-info-container') || statsPanel.parentElement;
            if (!container) {
                log('❌ 未找到统计面板容器，放弃注入');
                return;
            }

            let bufferLayer = container.querySelector('.bilibili-buffer-info-overlay');
            if (!bufferLayer) {
                bufferLayer = document.createElement('div');
                bufferLayer.className = 'bilibili-buffer-info-overlay';
                bufferLayer.style.cssText = [
                    'margin: 0', 'padding: 8px 12px', 'border-top: 1px solid rgba(255,255,255,0.2)',
                    'font-size: 12px', 'color: #fff', 'display: block'
                ].join(';');
                container.appendChild(bufferLayer);
                log('✅ 已创建缓冲信息覆盖层');
            } else {
                log('ℹ️ 缓冲信息覆盖层已存在，复用');
                bufferLayer.style.display = 'block';
            }

            const updateBufferInfo = () => {
                try {
                    const currentBufferTarget = (() => {
                        try {
                            const val = Number(player.getStableBufferTime ? player.getStableBufferTime() : NaN);
                            return Number.isFinite(val) && val > 0 ? val : BUFFER_TIME;
                        } catch (_) {
                            return BUFFER_TIME;
                        }
                    })();

                    const bufferedTime = player.getBufferLength("video");
                    const formatTime = (seconds) => {
                        if (!Number.isFinite(seconds) || seconds < 0) return '0s';
                        if (seconds < 60) return Math.floor(seconds) + 's';
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = Math.floor(seconds % 60);
                        return minutes + 'm' + remainingSeconds + 's';
                    };

                    const percentRaw = currentBufferTarget > 0 ? (bufferedTime / currentBufferTarget) * 100 : 0;
                    const percentClamped = Math.max(0, Math.min(100, percentRaw));
                    const percentText = (Number.isFinite(percentClamped) ? (percentClamped < 10 ? percentClamped.toFixed(1) : Math.round(percentClamped)) : 0) + '%';

                    bufferLayer.innerHTML = '<div class="info-line">\n                <span class="info-title">缓冲状态:</span>\n                <span class="info-data" style="color: #52c41a; font-weight: bold;">' +
                        formatTime(bufferedTime) + ' / ' + formatTime(currentBufferTarget) + ' [' + percentText + ']' +
                        '</span>\n            </div>';
                } catch (e) {
                    bufferLayer.innerHTML = '<div class="info-line">\n                <span class="info-title">缓冲状态:</span>\n                <span class="info-data" style="color: #faad14;">获取失败</span>\n            </div>';
                }
            };

            if (bufferLayer.dataset.bufferUpdater === 'active') {
                updateBufferInfo();
                return;
            }

            updateBufferInfo();
            const updateInterval = setInterval(updateBufferInfo, 1000);
            bufferLayer.dataset.bufferUpdater = 'active';

            const gcObserver = new MutationObserver(() => {
                if (!document.body.contains(container)) {
                    clearInterval(updateInterval);
                    delete bufferLayer.dataset.bufferUpdater;
                    gcObserver.disconnect();
                    log('📊 统计面板容器已移除，停止缓冲信息更新');
                }
            });
            gcObserver.observe(document.body, { childList: true, subtree: true });

        } catch (e) {
            log(`❌ 注入缓冲信息失败: ${e.message}`);
        }
    }

    // 页面加载完成后执行
    function main() {
        log('🚀 脚本启动，启动定时任务...');

        let player = getPlayer();

        // 定期检查并应用缓冲设置
        applyBufferOptimization(player);
        setInterval(() => {
            if (!player) {
                player = getPlayer();
            }
            if (player) {
                applyBufferOptimization(player);
            }
        }, SETTING_RECHECK_INTERVAL * 1000);

        // 定期监控并注入面板信息
        setInterval(() => {
            if (!player) {
                player = getPlayer();
            }
            if (player) {
                monitorStatsPanelVisibility(player);
            }
        }, MONITOR_RECHECK_INTERVAL * 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // 监听页面变化（SPA应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            log('🔄 页面变化，重新启动任务...');
            main();
        }
    }).observe(document, {subtree: true, childList: true});

})();