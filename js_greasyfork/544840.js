// ==UserScript==
// @name               YouTube Ad Auto-Skipper by Domopremo
// @namespace          DomopremoScripts
// @version            1.1.0
// @description        Skips all YouTube ads instantly and quietly. Smart, fast, and stealthy — optimized by Domopremo.
// @author             Domopremo
// @match              https://www.youtube.com/*
// @match              https://m.youtube.com/*
// @match              https://music.youtube.com/*
// @exclude            https://studio.youtube.com/*
// @grant              none
// @license            MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/544840/YouTube%20Ad%20Auto-Skipper%20by%20Domopremo.user.js
// @updateURL https://update.greasyfork.org/scripts/544840/YouTube%20Ad%20Auto-Skipper%20by%20Domopremo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isMobile = location.hostname === 'm.youtube.com';
    const isMusic = location.hostname === 'music.youtube.com';

    const DEBUG = false;
    const log = (...args) => DEBUG && console.log('[Domopremo AdSkipper]', ...args);

    let lastSkipTime = 0;
    const SKIP_COOLDOWN_MS = 3000;

    const skipAds = () => {
        const now = Date.now();
        if (now - lastSkipTime < SKIP_COOLDOWN_MS) return;
        lastSkipTime = now;

        if (location.pathname.startsWith('/shorts/')) return;

        const adActive = document.querySelector('.ad-showing');
        const countdown = document.querySelector('.ytp-ad-timed-pie-countdown-container');
        const survey = document.querySelector('.ytp-ad-survey-questions');
        if (!adActive && !countdown && !survey) return;

        const moviePlayer = document.querySelector('#movie_player');
        const playerRoot = document.querySelector('#ytd-player');
        const player = isMobile || isMusic ? moviePlayer : playerRoot?.getPlayer?.() || moviePlayer;

        if (!moviePlayer || !player) return;

        const adVideo = document.querySelector('video.html5-main-video');
        if (adVideo && adVideo.src && !adVideo.paused && !isNaN(adVideo.duration)) {
            adVideo.muted = true;
            log('Ad detected, skipping...');

            if (isMusic) {
                adVideo.currentTime = adVideo.duration;
            } else {
                const videoData = player.getVideoData?.();
                const start = Math.floor(player.getCurrentTime?.());
                const videoId = videoData?.video_id;

                if (moviePlayer.isSubtitlesOn?.()) {
                    setTimeout(() => moviePlayer.toggleSubtitlesOn?.(), 1000);
                }

                if (player.loadVideoWithPlayerVars) {
                    player.loadVideoWithPlayerVars({ videoId, start });
                } else {
                    player.loadVideoByPlayerVars?.({ videoId, start });
                }
            }
        }
    };

    const injectCSS = () => {
        const css = `
            #player-ads,
            #masthead-ad,
            .ytp-featured-product,
            .ytp-ad-timed-pie-countdown-container,
            .ytp-ad-survey-questions,
            .yt-mealbar-promo-renderer,
            ytd-merch-shelf-renderer,
            ytmusic-mealbar-promo-renderer,
            ytmusic-statement-banner-renderer {
                display: none !important;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const removeAdSlots = () => {
        const targets = [
            ['ytd-reel-video-renderer', '.ytd-ad-slot-renderer']
        ];

        for (const [parentSel, childSel] of targets) {
            const parent = document.querySelector(parentSel);
            const child = parent?.querySelector(childSel);
            if (child) {
                log('Removing ad slot:', parentSel);
                parent.remove();
            }
        }
    };

    injectCSS();
    if (!isMusic) setInterval(removeAdSlots, 1500);
    setInterval(skipAds, 500);
})();
