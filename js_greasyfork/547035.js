// ==UserScript==
// @name         YouTube Ad-Master
// @namespace    https://github.com/tientq64/userscripts
// @version      9.5.2
// @description  综合历史所有有效逻辑：API劫持、深度影子DOM探测、动态倍速调节、UI穿透屏蔽
// @author       tientq64 + Gemini
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

    // --- 全局状态控制 ---
    let state = {
        savedVolume: 1,
        savedMuted: false,
        isAdActive: false,
        adDetectedAt: 0,
        volumeLocked: false // 新增音量锁，防止广告期间误读
    };

    // --- 逻辑模块 1：深度影子 DOM 探测器 ---
    const findButtonsRecursive = (root) => {
        const selectors = [
            '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern', 
            '.ytp-skip-ad-button', '.ytp-ad-skip-button-container button',
            '[class*="skip-button"]', '[aria-label*="跳过"]', '[aria-label*="Skip"]',
            '.ytp-ad-overlay-close-button'
        ];
        let found = [];
        selectors.forEach(s => root.querySelectorAll(s).forEach(el => found.push(el)));
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) found = found.concat(findButtonsRecursive(el.shadowRoot));
        });
        return found;
    };

    const fastClick = (el) => {
        if (!el) return;
        ['mousedown', 'mouseup', 'click'].forEach(name => {
            el.dispatchEvent(new MouseEvent(name, { bubbles: true, cancelable: true, view: window }));
        });
    };

    // --- 逻辑模块 2：核心引擎 ---
    const runSkipEngine = () => {
        const video = document.querySelector('video.html5-main-video');
        const moviePlayer = document.querySelector('#movie_player');
        const adShowing = document.querySelector('.ad-showing, .ytp-ad-player-overlay, .ytp-ad-player-overlay-layout');

        if (adShowing && video) {
            // A. 进入广告：精确备份音量并锁定
            if (!state.isAdActive) {
                // 只有在确定不是广告时抓取的值才可靠
                if (!video.muted && video.volume > 0) {
                    state.savedVolume = video.volume;
                    state.savedMuted = video.muted;
                    state.volumeLocked = true;
                }
                state.adDetectedAt = Date.now();
                state.isAdActive = true;
                console.log('[Master] 拦截开始，已保护音量配置');
            }

            // B. 静音并尝试极速播放
            video.muted = true;
            try {
                // 仅在前 2 秒使用 16 倍速，减少播放器报错导致的生硬感
                const timeInAd = Date.now() - state.adDetectedAt;
                video.playbackRate = (timeInAd < 2000) ? 16 : 4;
            } catch (e) {}

            // C. 进度微调
            if (!isNaN(video.duration) && video.currentTime < video.duration - 0.2) {
                video.currentTime = video.duration - 0.1;
            }

            // D. 交互触发
            findButtonsRecursive(document).forEach(btn => fastClick(btn));
            if (moviePlayer && typeof moviePlayer.skipAd === 'function') {
                try { moviePlayer.skipAd(); } catch(e) {}
            }
            if (video.paused) video.play().catch(() => {});

        } else if (video && state.isAdActive) {
            // E. 广告结束：平滑恢复逻辑
            state.isAdActive = false;
            video.playbackRate = 1;

            // 延迟 100ms 恢复音量，避开 YouTube 视频切换时的自动静音指令
            setTimeout(() => {
                if (state.volumeLocked) {
                    video.volume = state.savedVolume;
                    video.muted = state.savedMuted;
                    // 强制纠正可能的残留静音
                    if (video.muted) video.muted = false;
                }
                console.log('[Master] 恢复播放，音量已同步');
            }, 100);
            
            state.volumeLocked = false;
        }

        // F. 正常播放期间：持续更新备份数据（仅限非静音状态）
        if (video && !adShowing && !video.muted && video.volume > 0) {
            state.savedVolume = video.volume;
            state.savedMuted = video.muted;
        }
    };

    // --- 逻辑模块 3：UI 穿透 ---
    const applyUIPenetration = () => {
        const styleId = 'yt-master-integrated-css';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .ytp-ad-player-overlay-layout, .ytp-ad-player-overlay, .ytp-ad-module,
                #player-ads, ytd-ad-slot-renderer { 
                    visibility: hidden !important; 
                    opacity: 0 !important; 
                    pointer-events: none !important; 
                }
                yt-upsell-dialog-renderer, #pigeon-messaging-container { display: none !important; }
            `;
            document.documentElement.appendChild(style);
        }

        const dismiss = document.querySelectorAll('#dismiss-button, [aria-label="No thanks"], [aria-label="不用了，谢谢"]');
        dismiss.forEach(btn => btn.click());
    };

    // --- 驱动启动 ---
    const tick = () => {
        runSkipEngine();
        requestAnimationFrame(tick);
    };

    setInterval(applyUIPenetration, 500);
    requestAnimationFrame(tick);

    window.addEventListener('yt-navigate-finish', () => {
        state.isAdActive = false;
        state.volumeLocked = false;
    });
})();