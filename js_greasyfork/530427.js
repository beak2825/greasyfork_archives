// ==UserScript==
// @name         YouTube-adb
// @name:zh-CN   YouTube去广告
// @namespace    https://github.com/yutian81/greasyfork-js
// @version      7.0
// @description  移除YouTube广告，包括静态广告、视频广告和Shorts广告，兼容最新YouTube页面结构。
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530427/YouTube-adb.user.js
// @updateURL https://update.greasyfork.org/scripts/530427/YouTube-adb.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let video;
    const CSS_SELECTORS = [
        `#masthead-ad`, // 首页顶部横幅广告
        `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`, // 首页视频排版广告
        `.video-ads.ytp-ad-module`, // 播放器底部广告
        `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`, // 会员促销广告
        `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`, // 播放页右上方推荐广告
        `#related #player-ads`, // 播放页评论区右侧推广广告
        `#related ytd-ad-slot-renderer`, // 播放页评论区右侧视频排版广告
        `ytd-ad-slot-renderer`, // 搜索页广告
        `yt-mealbar-promo-renderer`, // 播放页会员推荐广告
        `ytd-popup-container:has(a[href="/premium"])`, // 会员拦截广告
        `ad-slot-renderer`, // 移动端第三方推荐广告
        `ytm-companion-ad-renderer`, // 移动端可跳过的视频广告链接处
        `ytd-reel-player-renderer #ad-container`, // YouTube Shorts广告
    ];

    window.dev = false; // 开发模式开关

    /**
     * 格式化时间
     */
    function formatTime(date) {
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    /**
     * 输出日志
     */
    function log(message) {
        if (window.dev) {
            console.log(`[${formatTime(new Date())}] ${message}`);
        }
    }

    /**
     * 生成移除广告的CSS样式
     */
    function generateCSS() {
        const style = document.createElement('style');
        style.id = 'youtube-adblocker-style';
        style.textContent = CSS_SELECTORS.map(selector => `${selector}{display:none!important}`).join(' ');
        (document.head || document.body).appendChild(style);
        log('生成屏蔽广告样式成功');
    }

    /**
     * 跳过广告
     */
    function skipAd() {
        const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern');
        const shortAdMsg = document.querySelector('.video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon');

        if (skipButton) {
            skipButton.click();
            log('点击跳过广告按钮');
        } else if (shortAdMsg) {
            video.currentTime = video.duration;
            log('强制结束广告');
        }
    }

    /**
     * 处理视频广告
     */
    function handleVideoAds() {
        video = document.querySelector('.ad-showing video') || document.querySelector('video');
        if (video && video.classList.contains('ad-showing')) {
            skipAd();
        }
    }

    /**
     * 监听DOM变化
     */
    function observeDOM() {
        const observer = new MutationObserver(() => {
            handleVideoAds();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        log('开始监听DOM变化');
    }

    /**
     * 主函数
     */
    function main() {
        generateCSS();
        observeDOM();
        log('YouTube去广告脚本已启动');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();