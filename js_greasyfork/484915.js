// ==UserScript==
// @name         FuckYoutubeAds
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Automatically mute and blur video YouTube ads and hide YouTube static ads from feed
// @author       John Doe & Chaban MB
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484915/FuckYoutubeAds.user.js
// @updateURL https://update.greasyfork.org/scripts/484915/FuckYoutubeAds.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_NAME = GM.info.script.name;
    let latestVolume = 100;
    let inAd = false;
    let playerObserver = null;
    const adSelectors = [
        '.ytd-in-feed-ad-layout-renderer', // Ads on main feed
        'ytd-banner-promo-renderer', // Premium ad banner on top of main feed
        '.ytp-ad-avatar-lockup-card', // Ads slot on /watch feed
        'ytd-ad-slot-renderer', // Another ads slot on /watch feed
        '#player-ads' // Sponsored container on /watch
    ].join(', ');

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: #0f0f0f;
        color: white;
        border: 1px solid white;
        padding: 8px;
        border-radius: 8px;
        z-index: 9999;
    `;
    messageDiv.textContent = 'Ad muted and blurred by FuckYoutubeAds. Keep your mind ad-free. 🧠🕊️';

    const hideStaticAds = () => {
        document.querySelectorAll(adSelectors).forEach(ad => {
            if (ad.style.display !== 'none') {
                ad.style.display = 'none';
            }
        });
    };

    const handleAdStateChange = (isAdShowing) => {
        const player = document.getElementById('movie_player');
        const innerPlayer = document.querySelector('.html5-video-container');
        if (!player || !innerPlayer) return;
        if (isAdShowing) {
            if (!inAd) {
                inAd = true;
                latestVolume = player.getVolume();
                document.body.appendChild(messageDiv);
                console.log(`[${SCRIPT_NAME}] ▶️ Ad started. Storing volume: ${latestVolume}`);
            }
            innerPlayer.style.filter = 'blur(45px)';
            if (player.getVolume() > 0) {
                player.setVolume(0);
            }
        } else {
            if (inAd) {
                inAd = false;
                player.setVolume(latestVolume);
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
                console.log(`[${SCRIPT_NAME}] ⏹️ Ad ended. Restoring volume: ${latestVolume}`);
            }
            innerPlayer.style.filter = '';
        }
    };

    const initialize = () => {
        if (playerObserver) {
            playerObserver.disconnect();
        }
        hideStaticAds();
        if (window.location.pathname.includes('/watch')) {
            const player = document.getElementById('movie_player');
            if (player) {
                handleAdStateChange(player.classList.contains('ad-showing'));

                playerObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.attributeName === 'class') {
                            const isAd = mutation.target.classList.contains('ad-showing');
                            handleAdStateChange(isAd);
                        }
                    }
                });
                playerObserver.observe(player, { attributes: true });
            }
        }
    };

    const bodyObserver = new MutationObserver(hideStaticAds);
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('yt-navigate-finish', initialize);
    if (document.body) {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }
})();