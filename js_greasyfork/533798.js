// ==UserScript==
// @name         YouTube 广告跳过与移除
// @namespace    https://example.com/
// @version      1.3
// @description  自动跳过广告、点击跳过按钮、隐藏横幅和首页视频广告，并显示提示
// @match        *://www.youtube.com/*
// @match        *://music.youtube.com/*
// @match        *://m.youtube.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533798/YouTube%20%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87%E4%B8%8E%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/533798/YouTube%20%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87%E4%B8%8E%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isYouTubeMobile = location.hostname === 'm.youtube.com';
    const isYouTubeMusic = location.hostname === 'music.youtube.com';
    const isYouTubeVideo = !isYouTubeMusic;

    function getCurrentTimeString() {
        return new Date().toTimeString().split(' ', 1)[0];
    }

    function checkIsYouTubeShorts() {
        return location.pathname.startsWith('/shorts/');
    }

    function addCss() {
        const adsSelectors = [
            '#player-ads',
            '#masthead-ad',
            '.yt-mealbar-promo-renderer',
            '.ytp-featured-product',
            'ytd-merch-shelf-renderer',
            'ytmusic-mealbar-promo-renderer',
            'ytmusic-statement-banner-renderer',
            '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]'
        ];
        const css = `${adsSelectors.join(',')} { display: none !important; }`;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function removeAdElements() {
        const adSelectors = [
            ['ytd-reel-video-renderer', '.ytd-ad-slot-renderer'],
            ['tp-yt-paper-dialog', '#feedback.ytd-enforcement-message-view-model']
        ];
        for (const [parent, child] of adSelectors) {
            const adEl = document.querySelector(parent);
            if (!adEl) continue;
            const neededEl = adEl.querySelector(child);
            if (!neededEl) continue;
            adEl.remove();
        }
    }

    function removeHomepageAdBlocks() {
        const adCandidates = document.querySelectorAll('ytd-rich-item-renderer');

        adCandidates.forEach(item => {
            const adLabel = item.querySelector(
                'ytd-ad-slot-renderer, ytd-promoted-sparkles-web-renderer, .badge-style-type-ad'
            );
            if (adLabel) {
                item.remove();
                console.log('[增强] 移除了首页广告视频卡片');
            }
        });
    }

    function showAdSkipToast(msg = "广告已跳过") {
        const toast = document.createElement('div');
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '60px',
            right: '20px',
            background: '#111',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: '999999',
            opacity: '0.9',
            transition: 'opacity 0.5s'
        });
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 1500);
    }

    function skipAd() {
        if (checkIsYouTubeShorts()) return;

        const adShowing = document.querySelector('.ad-showing');
        const pieCountdown = document.querySelector('.ytp-ad-timed-pie-countdown-container');
        const surveyQuestions = document.querySelector('.ytp-ad-survey-questions');

        if (!adShowing && !pieCountdown && !surveyQuestions) return;

        // 自动点击“跳过广告”按钮
        const skipBtn = document.querySelector('.ytp-ad-skip-button.ytp-button');
        if (skipBtn) {
            skipBtn.click();
            console.log('[增强] 自动点击跳过广告按钮');
            showAdSkipToast("已点击跳过广告按钮");
            return;
        }

        let playerEl;
        let player;
        if (isYouTubeMobile || isYouTubeMusic) {
            playerEl = document.querySelector('#movie_player');
            player = playerEl;
        } else {
            playerEl = document.querySelector('#ytd-player');
            player = playerEl && playerEl.getPlayer();
        }

        if (!playerEl || !player) {
            console.log({
                message: 'Player not found',
                timeStamp: getCurrentTimeString()
            });
            return;
        }

        let adVideo = document.querySelector(
            '#ytd-player video.html5-main-video, #song-video video.html5-main-video'
        );

        if (adVideo && adVideo.src && !adVideo.paused && !isNaN(adVideo.duration)) {
            adVideo.currentTime = adVideo.duration;
            console.log({
                message: '[优化] 快进跳过广告',
                timeStamp: getCurrentTimeString()
            });
            showAdSkipToast();
            return;
        }

        const videoData = player.getVideoData();
        const videoId = videoData.video_id;
        const start = Math.floor(player.getCurrentTime());

        if ('loadVideoWithPlayerVars' in playerEl) {
            playerEl.loadVideoWithPlayerVars({ videoId, start });
        } else {
            playerEl.loadVideoByPlayerVars({ videoId, start });
        }

        console.table({
            message: 'Ad skipped via reload fallback',
            videoId,
            start,
            title: videoData.title,
            timeStamp: getCurrentTimeString()
        });
        showAdSkipToast("广告已跳过（重载方式）");
    }

    function initAdBlocker() {
        addCss();
        if (isYouTubeVideo) {
            setInterval(removeAdElements, 1000);
            setInterval(removeHomepageAdBlocks, 2000);
            removeAdElements();
            removeHomepageAdBlocks();
        }
        setInterval(skipAd, 500);
        skipAd();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdBlocker);
    } else {
        initAdBlocker();
    }

})();
