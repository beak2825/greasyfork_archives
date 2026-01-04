// ==UserScript==
// @name         B站自动宽屏模式
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  进入视频详情页后自动快速切换至宽屏模式，自动开播时也能更快地切换，动画流畅迅速，提升用户体验
// @author
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526349/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526349/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        ACTIVATE_INTERVAL: 20,       // 每次尝试间隔 20ms
        ACTIVATE_MAX_ATTEMPTS: 20,     // 最多尝试 20 次（约 400ms 内完成）
        MUTATION_THROTTLE: 100         // MutationObserver 防抖延迟
    };

    // 尽早注入宽屏及过渡动画样式
    function injectStyles() {
        if (document.getElementById('wideModeEnhancedStyle')) return;
        const style = document.createElement('style');
        style.id = 'wideModeEnhancedStyle';
        style.textContent = `
            /* 基础样式及动画：仅对宽度、高度、transform 进行过渡 */
            .bpx-player-container,
            #bilibili-player,
            #playerWrap,
            .bpx-player-video-wrap,
            .player-wrap {
                transition: width 100ms ease-in-out, height 100ms ease-in-out, transform 100ms ease-in-out !important;
                transform-origin: center center;
                position: relative;
                will-change: width, height, transform;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            /* 宽屏模式激活样式 */
            .bpx-player-container[data-screen="wide"],
            .player-wrap[data-screen="wide"] {
                width: 100% !important;
                height: 100% !important;
                max-width: 100% !important;
                max-height: 100% !important;
                transform: none !important;
            }
            /* 全屏模式优化（不影响宽屏动画） */
            .bpx-player-container[data-screen="full"] {
                position: fixed !important;
                z-index: 999999 !important;
                left: 0 !important;
                top: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 判断是否已经进入宽屏或全屏状态
    function isWideMode() {
        return document.fullscreenElement !== null ||
               document.querySelector('[aria-label="退出宽屏"], .bpx-player-container[data-screen="wide"], .player-wrap[data-screen="wide"]');
    }

    // 查找并点击宽屏按钮
    function tryActivateWideMode() {
        const wideButton = document.querySelector('[aria-label="宽屏"], .bpx-player-ctrl-wide-enter');
        if (wideButton) {
            wideButton.click();
        }
    }

    // 轮询激活宽屏模式：在短时间内多次尝试，确保快速响应
    function activateWideMode(maxAttempts = CONFIG.ACTIVATE_MAX_ATTEMPTS, interval = CONFIG.ACTIVATE_INTERVAL) {
        let attempts = 0;
        function attempt() {
            if (isWideMode()) return; // 如果已经宽屏则停止
            tryActivateWideMode();
            attempts++;
            if (!isWideMode() && attempts < maxAttempts) {
                setTimeout(attempt, interval);
            }
        }
        attempt();
    }

    // 利用 MutationObserver 监控 DOM，当宽屏按钮因加载延迟未出现时立即触发
    function observeForWideButton() {
        const observer = new MutationObserver((mutations) => {
            if (!isWideMode()) {
                tryActivateWideMode();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化流程：注入样式、激活宽屏、并监控 DOM 变化
    function initialize() {
        injectStyles();
        activateWideMode();
        observeForWideButton();
    }

    // 根据文档加载状态尽早执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 监听 URL 变化，适应单页应用场景
    window.addEventListener('popstate', initialize);
    window.addEventListener('pushstate', initialize);
})();
