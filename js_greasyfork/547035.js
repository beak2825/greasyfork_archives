// ==UserScript==
// @name         Smart Auto Skip YouTube Ads (Ultra Optimized 2026)
// @namespace    https://github.com/tientq64/userscripts
// @version      9.0.0
// @description  优化版：采用进度强跳、深度Shadow DOM检测与静音降噪技术，规避倍速拦截
// @author       tientq64 + enhanced by Gemini
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @exclude      https://studio.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547035/Smart%20Auto%20Skip%20YouTube%20Ads%20%28Ultra%20Optimized%202026%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547035/Smart%20Auto%20Skip%20YouTube%20Ads%20%28Ultra%20Optimized%202026%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置与状态 ---
    let originalVolume = 1;
    let originalMuted = false;
    let isAdActive = false;

    // --- 核心工具函数 ---

    // 检查是否正在播放广告
    const isAdPlaying = () => {
        return document.querySelector('.ad-showing, .ytp-ad-player-overlay, [class*="ad-countdown"]');
    };

    // 递归寻找按钮（穿透 Shadow DOM）
    const findButtons = (root) => {
        const selectors = [
            '.ytp-ad-skip-button', 
            '.ytp-ad-skip-button-modern', 
            '.ytp-skip-ad-button',
            '[id^="skip-button"]',
            'button[aria-label*="Skip"], button[aria-label*="跳过"]'
        ];
        
        let found = [];
        selectors.forEach(sel => {
            const elements = root.querySelectorAll(sel);
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && getComputedStyle(el).display !== 'none') {
                    found.push(el);
                }
            });
        });

        // 递归探测 ShadowRoot
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                found = found.concat(findButtons(el.shadowRoot));
            }
        });
        return found;
    };

    // 模拟真实点击
    const forceClick = (el) => {
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
        });
    };

    // --- 核心逻辑 ---

    const skipLogic = () => {
        const video = document.querySelector('video.html5-main-video');
        const moviePlayer = document.querySelector('#movie_player');
        const adPlayingNow = !!isAdPlaying();

        if (adPlayingNow) {
            // 1. 首次进入广告状态：保存音量并静音
            if (!isAdActive) {
                if (video) {
                    originalVolume = video.volume;
                    originalMuted = video.muted;
                    video.muted = true;
                }
                isAdActive = true;
                console.log('[AutoSkip] 广告开始：已静音');
            }

            // 2. 进度强跳：将广告直接拉到最后 0.1s（绕过倍速限制）
            if (video && !isNaN(video.duration)) {
                // 如果广告没结束，强制跳转
                if (video.currentTime < video.duration - 0.2) {
                    video.currentTime = video.duration - 0.1;
                }
                // 确保视频在广告期间不被 YouTube 暂停
                if (video.paused) video.play().catch(() => {});
            }

            // 3. 尝试底层 API 跳过
            if (moviePlayer && typeof moviePlayer.skipAd === 'function') {
                try { moviePlayer.skipAd(); } catch(e) {}
            }

            // 4. 深度检测并点击按钮
            const btns = findButtons(document);
            btns.forEach(btn => {
                forceClick(btn);
                console.log('[AutoSkip] 成功点击跳过按钮');
            });

        } else {
            // 5. 广告结束：恢复音量状态
            if (isAdActive) {
                if (video) {
                    video.volume = originalVolume;
                    video.muted = originalMuted;
                }
                isAdActive = false;
                console.log('[AutoSkip] 广告结束：恢复音量');
            }
        }
    };

    // --- 清理 UI ---
    const removeAdsUI = () => {
        const adSelectors = [
            '#player-ads', '#masthead-ad', '.ytp-ad-overlay-container', 
            'ytd-ad-slot-renderer', 'ytd-promoted-video-renderer'
        ];
        adSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
    };

    // --- 执行循环 ---

    // 使用高频心跳保证响应速度
    const mainInterval = setInterval(skipLogic, 300);

    // 辅助 UI 清理
    const uiInterval = setInterval(removeAdsUI, 1000);

    // 监听页面切换（YouTube 是 SPA，需要监听 URL 变化重置状态）
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            isAdActive = false; // 重置广告状态
        }
    }, 1000);

    // 注入 CSS 隐藏广告位
    const style = document.createElement('style');
    style.textContent = `
        .video-ads, .ytp-ad-module, .ytp-ad-overlay-open { display: none !important; }
        #player-ads, ytd-ad-slot-renderer { height: 0 !important; visibility: hidden !important; }
    `;
    document.head.appendChild(style);

})();