// ==UserScript==
// @name         YouTube Auto Speed
// @namespace    https://github.com/teperyaemo/youtube-auto-speed
// @version      1.0
// @description  Auto-adjust playback speed on YouTube videos (excluding music). Uses structured description detection, supports blacklist.
// @author       teperyaemo
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/f893a131/img/logos/favicon_144x144.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @homepage     https://github.com/teperyaemo/youtube-auto-speed
// @supportURL   https://github.com/teperyaemo/youtube-auto-speed/issues
// @downloadURL https://update.greasyfork.org/scripts/541409/YouTube%20Auto%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/541409/YouTube%20Auto%20Speed.meta.js
// ==/UserScript==

// 🧠 Smart YouTube Auto Speed
// - Default speed: 1.25x
// - If music block is detected → DO NOT change speed
// - Supports blacklist (channel IDs)
// - Supports SPA navigation
// - Lightweight, clean logs ("AutoSpeed:" prefix)

(function () {
    'use strict';

    const defaultSpeed = 1.25;
    const logPrefix = '[AutoSpeed]';
    let blacklist = [];

    // === CONFIG: Channel blacklist ===
    const stored = localStorage.getItem('yt_auto_speed_blacklist');
    if (stored) {
        blacklist = stored.split(',').map(x => x.trim());
    }

    function isMusicVideo() {
        const blocks = Array.from(document.querySelectorAll('ytd-horizontal-card-list-renderer'));
        return blocks.some(block => {
            const titleEl = block.querySelector('#title');
            return titleEl && /музыка|music/i.test(titleEl.textContent);
        });
    }

    function getChannelId() {
        const meta = document.querySelector('meta[itemprop="channelId"]');
        return meta?.content || null;
    }

    function applySpeed() {
        const video = document.querySelector('video');
        if (!video) return;

        const channelId = getChannelId();
        if (channelId && blacklist.includes(channelId)) {
            console.log(`${logPrefix} Skipped (blacklisted channel): ${channelId}`);
            return;
        }

        if (isMusicVideo()) {
            console.log(`${logPrefix} Skipped (music video detected)`);
            return;
        }

        if (video.playbackRate !== defaultSpeed) {
            video.playbackRate = defaultSpeed;
            console.log(`${logPrefix} Set speed to ${defaultSpeed}`);
        }
    }

    function observeChanges() {
        let lastUrl = location.href;

        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(applySpeed, 1000);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        applySpeed();
    }

    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(applySpeed, 1000);
    });

    document.addEventListener('DOMContentLoaded', () => {
        observeChanges();
    });
})();
