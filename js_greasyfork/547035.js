// ==UserScript==
// @name         YouTube Ad-Buster (Pro Max 2026)
// @namespace    https://github.com/tientq64/userscripts
// @version      9.2.0
// @description  采用属性劫持技术，解决不可跳过广告及音量恢复失效问题
// @author       tientq64 + Gemini
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @exclude      https://studio.youtube.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547035/YouTube%20Ad-Buster%20%28Pro%20Max%202026%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547035/YouTube%20Ad-Buster%20%28Pro%20Max%202026%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let originalVolume = 1;
    let originalMuted = false;
    let isAdActive = false;

    // --- 1. 底层拦截：音量与速率保障 ---
    // 劫持播放器属性，防止广告逻辑恶意覆盖
    const injectPropertyHijack = () => {
        const originalPlay = HTMLVideoElement.prototype.play;
        HTMLVideoElement.prototype.play = function() {
            if (document.querySelector('.ad-showing')) {
                this.muted = true;
                this.playbackRate = 16; // 遇到顽固广告强制提速
            }
            return originalPlay.apply(this, arguments);
        };
    };

    // --- 2. 状态备份与恢复 ---
    const updateStats = (video) => {
        if (!document.querySelector('.ad-showing')) {
            originalVolume = video.volume;
            originalMuted = video.muted;
        }
    };

    // --- 3. 强力跳过逻辑 ---
    const forceSkip = () => {
        const video = document.querySelector('video.html5-main-video');
        const adShowing = document.querySelector('.ad-showing, .ytp-ad-player-overlay');

        if (!video) return;

        if (adShowing) {
            if (!isAdActive) {
                updateStats(video);
                isAdActive = true;
            }

            // 策略 A: 极速播放 + 进度拉满 (应对不可跳过广告)
            video.muted = true;
            if (video.playbackRate < 16) video.playbackRate = 16;

            // 策略 B: 强制跳转
            if (!isNaN(video.duration) && video.currentTime < video.duration - 0.1) {
                video.currentTime = video.duration - 0.1;
            }

            // 策略 C: 模拟点击所有潜在按钮 (包括隐藏的)
            const skipBtns = document.querySelectorAll(`
                .ytp-ad-skip-button,
                .ytp-ad-skip-button-modern,
                .ytp-skip-ad-button,
                .ytp-ad-overlay-close-button
            `);
            skipBtns.forEach(btn => btn.click());

            // 策略 D: 调用 YT 内部接口
            const player = document.querySelector('#movie_player');
            if (player && player.skipAd) player.skipAd();

        } else {
            if (isAdActive) {
                // 广告消失瞬间，强制还原
                video.playbackRate = 1;
                video.volume = originalVolume;
                video.muted = originalMuted;
                isAdActive = false;
                console.log('[Success] 广告清除，音量已恢复');
            }
            updateStats(video);
        }
    };

    // --- 4. 视觉清理 (针对横幅广告) ---
    const autoCleanUI = () => {
        const css = `
            #masthead-ad, ytd-ad-slot-renderer, .ytp-ad-overlay-container,
            .ytp-ad-message-container, #player-ads { display: none !important; }
        `;
        if (!document.getElementById('yt-ad-buster-style')) {
            const style = document.createElement('style');
            style.id = 'yt-ad-buster-style';
            style.textContent = css;
            document.head.appendChild(style);
        }
    };

    // --- 5. 启动引擎 ---
    injectPropertyHijack();

    // 高频扫描 (每 100ms 检查一次，比 requestAnimationFrame 在后台标签页更稳定)
    setInterval(() => {
        forceSkip();
        autoCleanUI();
    }, 100);

    // 处理页面跳转重置
    window.addEventListener('yt-navigate-start', () => {
        isAdActive = false;
    });

})();