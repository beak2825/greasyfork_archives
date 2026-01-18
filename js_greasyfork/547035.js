// ==UserScript==
// @name         YouTube Ad-Master
// @namespace    https://github.com/tientq64/userscripts
// @version      9.9.8.3
// @description  解决Trusted Types与Class构造报错，优化广告跳过逻辑
// @author       tientq64 + Gemini + Copilot
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @exclude      https://studio.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547035/YouTube%20Ad-Master.user.js
// @updateURL https://update.greasyfork.org/scripts/547035/YouTube%20Ad-Master.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. 解决 Trusted Types 策略错误 (修复图2/图3报错) ---
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        if (!window.trustedTypes.defaultPolicy) {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string) => string,
                createScriptURL: (string) => string,
                createScript: (string) => string,
            });
        }
    }

    let state = {
        savedVolume: 1,
        savedMuted: false,
        isAdActive: false,
        volumeLocked: false
    };

    // --- 2. 安全点击与错误捕获 (修复图4 Class构造报错) ---
    const safeClick = (el) => {
        if (!el) return;
        try {
            // 优先尝试标准点击
            el.click();
            // 辅助模拟指针事件
            ['pointerdown', 'mousedown', 'mouseup'].forEach(name => {
                el.dispatchEvent(new MouseEvent(name, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    buttons: 1
                }));
            });
        } catch (e) {
            // 捕获并忽略来自受保护组件（如 sl-popup）的构造错误
            console.debug('Skip error during click:', e.message);
        }
    };

    // --- 3. 深度 Shadow DOM 探测器 ---
    const findButtonsRecursive = (root) => {
        const selectors = [
            'button[id^="skip-button"]',
            '.ytp-ad-skip-button',
            '.ytp-ad-skip-button-modern',
            '[aria-label*="跳过"]',
            '[aria-label*="Skip"]',
            ".ytp-ad-overlay-close-button",
        ];
        let found = [];
        try {
            selectors.forEach(s => root.querySelectorAll(s).forEach(el => found.push(el)));
            root.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) found = found.concat(findButtonsRecursive(el.shadowRoot));
            });
        } catch (e) {}
        return found;
    };

    // --- 4. 动态透明度控制 ---
    const toggleAdVisibility = (isAd) => {
        const player = document.querySelector('#movie_player');
        if (!player) return;
        if (isAd) {
            player.style.setProperty('opacity', '0', 'important');
            player.style.setProperty('filter', 'brightness(0)', 'important');
            player.style.setProperty('pointer-events', 'none', 'important');
        } else {
            player.style.removeProperty('opacity');
            player.style.removeProperty('filter');
            player.style.removeProperty('pointer-events');
        }
    };

    // --- 5. 核心跳过引擎 ---
    const runSkipEngine = () => {
        const video = document.querySelector('video.html5-main-video');
        const moviePlayer = document.querySelector('#movie_player');

        const adShowing = moviePlayer && (
            moviePlayer.classList.contains('ad-showing') ||
            moviePlayer.classList.contains('ad-interrupting') ||
            document.querySelector('.ytp-ad-player-overlay')
        );

        if (adShowing && video) {
            if (!state.isAdActive) {
                state.savedVolume = video.volume;
                state.savedMuted = video.muted;
                state.isAdActive = true;
                state.volumeLocked = true;
                toggleAdVisibility(true);
            }
            video.muted = true;
            video.playbackRate = 16.0;

            // 自动点击所有发现的跳过按钮
            findButtonsRecursive(document).forEach(btn => safeClick(btn));

            // 调用内部 API
            if (moviePlayer && typeof moviePlayer.skipAd === 'function') {
                try { moviePlayer.skipAd(); } catch(e) {}
            }
        } else if (video && state.isAdActive) {
            state.isAdActive = false;
            video.playbackRate = 1.0;
            toggleAdVisibility(false);
            setTimeout(() => {
                if (state.volumeLocked && video) {
                    video.volume = state.savedVolume;
                    video.muted = state.savedMuted;
                }
            }, 200);
            state.volumeLocked = false;
        }
    };

    // --- 6. 稳健的 UI 净化 ---
    const injectStyles = () => {
        const styleId = 'yt-master-transparent-css';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .ytp-ad-player-overlay, .ytp-ad-module, ytd-ad-slot-renderer,
            #masthead-ad, ytd-banner-promo-renderer {
                opacity: 0 !important;
                pointer-events: none !important;
            }
            yt-upsell-dialog-renderer, #pigeon-messaging-container { display: none !important; }
        `;

        // 确保在适当的时机插入，不干扰初始化
        const target = document.head || document.documentElement;
        if (target) {
            target.appendChild(style);
        }
    };

    // --- 7. 循环与监听 ---
    const tick = () => {
        runSkipEngine();
        requestAnimationFrame(tick);
    };

    // 初始执行
    injectStyles();
    requestAnimationFrame(tick);

    // 辅助功能：每秒清理弹窗和错误层
    setInterval(() => {
        // 自动关闭“不用了”等弹窗
        const dismiss = document.querySelectorAll('#dismiss-button, [aria-label*="thanks"], [aria-label*="不用了"]');
        dismiss.forEach(btn => safeClick(btn));

        // 刷新播放错误层
        if (document.querySelector('.yt-playability-error-supported-renderers')) {
            location.reload();
        }
    }, 1500);

    window.addEventListener('yt-navigate-finish', () => {
        state.isAdActive = false;
        state.volumeLocked = false;
        toggleAdVisibility(false);
    });
})();