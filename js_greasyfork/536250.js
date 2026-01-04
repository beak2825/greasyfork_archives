// ==UserScript==
// @name         YouTube 去广告优化版
// @version      1.1
// @description  移除 YouTube 广告：视频前中贴片广告、横幅广告、会员弹窗等，兼容桌面与移动端，增强稳定性与兼容性。防止误暂停
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1471001
// @downloadURL https://update.greasyfork.org/scripts/536250/YouTube%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536250/YouTube%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const cssSelectors = [
        '#masthead-ad',
        '.video-ads.ytp-ad-module',
        'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)',
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
        '#related #player-ads',
        '#related ytd-ad-slot-renderer',
        'ytd-ad-slot-renderer',
        'yt-mealbar-promo-renderer',
        'ytd-popup-container:has(a[href="/premium"])',
        'ad-slot-renderer',
        'ytm-companion-ad-renderer'
    ];

    const injectAdBlockStyle = () => {
        if (document.getElementById('yt-adblock-style')) return;
        const style = document.createElement('style');
        style.id = 'yt-adblock-style';
        style.textContent = cssSelectors.map(sel => `${sel} { display: none !important; }`).join('\n');
        document.head.appendChild(style);
    };

    const trySkipAds = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern');
        const overlay = document.querySelector('.ytp-ad-player-overlay, .ytp-ad-button-icon');
        const adShowing = document.querySelector('.ad-showing');

        // 广告判断条件严格限制：需要 ad-showing 且存在跳过按钮或广告层
        const isAd = adShowing && (skipBtn || overlay);

        if (!isAd) return;  // 正常视频不处理

        video.muted = true;

        if (skipBtn) {
            setTimeout(() => {
                if (video.currentTime < 1 && video.duration < 60) {
                    video.currentTime = video.duration;
                    skipBtn.click();
                }
            }, 500);
        } else if (overlay && video.duration < 60) {
            video.currentTime = video.duration;
        }
    };

    const removePremiumPopups = () => {
        document.querySelectorAll('ytd-popup-container a[href="/premium"]').forEach(el => {
            el.closest('ytd-popup-container')?.remove();
        });

        document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(el => {
            el.className = '';
            el.removeAttribute('opened');
            el.remove();
        });
    };

    const observeDOM = () => {
        const observer = new MutationObserver(() => {
            injectAdBlockStyle();
            trySkipAds();
            removePremiumPopups();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', observeDOM)
        : observeDOM();
})();