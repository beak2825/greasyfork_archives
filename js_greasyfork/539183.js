// ==UserScript==
// @name         YouTube :: MediaSession Nexttrack + AutoPlay
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  MediaSession nexttrack, tự bấm play khi tự dừng, trừ khi tự bấm Pause(tắt autoplay).
// @author       Rpyon
// @icon         https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/botim-icon.png
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539183/YouTube%20%3A%3A%20MediaSession%20Nexttrack%20%2B%20AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/539183/YouTube%20%3A%3A%20MediaSession%20Nexttrack%20%2B%20AutoPlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoplayDisabled = false;

    function setupMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('nexttrack', nextSong);
        }
    }

    function nextSong() {
        const btnYtb = document.querySelector('.ytp-next-button.ytp-button');
        if (btnYtb && !btnYtb.disabled) {
            btnYtb.click();
            window.focus();
            setTimeout(setupMediaSession, 100);
        }
    }

    function autoResumeVideo() {
        const video = document.querySelector('video');
        if (!video) return;

        // Chỉ gắn 1 lần mỗi video
        video.addEventListener('pause', () => {
            setTimeout(() => {
                if (autoplayDisabled) return;
                if (video.paused && !video.ended && !video.seeking) {
                    video.play().catch(() => {});
                }
            }, 500);
        }, { once: true });

        video.addEventListener('playing', () => {
            if (autoplayDisabled) {
                console.log('[Tampermonkey] Video playing again — re-enable autoplay');
                autoplayDisabled = false;
            }
        }, { once: true });
    }


    function monitorPlaylistPlayButton() {
        const btn = document.querySelector('.ytp-play-button-playlist');
        if (btn) {
            btn.addEventListener('click', () => {
                autoplayDisabled = true;
                console.log('[Tampermonkey] Playlist play button clicked: AutoPlay disabled');
            }, { once: true });
        }
    }

    function monitorManualPlayButton() {
        const btn = document.querySelector('.ytp-play-button.ytp-button');
        if (btn) {
            btn.addEventListener('click', () => {
                autoplayDisabled = true;
                console.log('[Tampermonkey] Manual play/pause clicked: AutoPlay disabled');
            }, { once: true });
        }
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            autoplayDisabled = false;
            setTimeout(() => {
                setupMediaSession();
                autoResumeVideo();
                monitorPlaylistPlayButton();
                monitorManualPlayButton();
            }, 500);
        }
    }).observe(document, { subtree: true, childList: true });

    setInterval(() => {
        setupMediaSession();
        autoResumeVideo();
        monitorPlaylistPlayButton();
        monitorManualPlayButton();
    }, 2000);

    setupMediaSession();
    autoResumeVideo();
    monitorPlaylistPlayButton();
    monitorManualPlayButton();
})();
