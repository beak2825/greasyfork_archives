// ==UserScript==
// @name         (Outdated/Got Patched)YouTube Anti‑AdBlock Bypass + Block Ads
// @version      2.5.1
// @description  Ad‑block bypass + buffer‑kick + block in-video ads via CSS hiding & auto-skip
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @icon         https://www.gstatic.com/youtube/img/branding/favicon/favicon_192x192.png
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @namespace https://e-z.bio/yaw
// @downloadURL https://update.greasyfork.org/scripts/542720/%28OutdatedGot%20Patched%29YouTube%20Anti%E2%80%91AdBlock%20Bypass%20%2B%20Block%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/542720/%28OutdatedGot%20Patched%29YouTube%20Anti%E2%80%91AdBlock%20Bypass%20%2B%20Block%20Ads.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // ——— SETTINGS ———
    const settings = {
        interval:      await GM.getValue('interval', 150),
        animatedTitle: await GM.getValue('animatedTitle', true),
        accentColor:   await GM.getValue('accentColor', '#FE2020'),
    };
    GM.registerMenuCommand('Bypasser Settings', async () => {
        const i = prompt('Search interval in ms:', settings.interval);
        if (i != null) settings.interval = parseInt(i,10);
        settings.animatedTitle = confirm('Animated title?');
        const c = prompt('Accent hex color:', settings.accentColor);
        if (c && /^#([0-9A-F]{3}){1,2}$/i.test(c)) settings.accentColor = c;
        await GM.setValue('interval', settings.interval);
        await GM.setValue('animatedTitle', settings.animatedTitle);
        await GM.setValue('accentColor', settings.accentColor);
        alert('Saved. Reload page.');
    });

    // Animated title toggle
    if (settings.animatedTitle) {
        let t = 0;
        setInterval(() => {
            document.title = ['Enjoying YouTube with','Dr Sex, CEO of SexCorp'][t ^= 1];
        }, 1000);
    }

    // ——— BLOCK ADS VIA CSS ———
    const css = `
    .video-ads,
    .ytp-ad-module,
    .ytp-ad-player-overlay,
    .ytp-paid-content-overlay-renderer,
    .ytp-overlay-container,
    ytd-player-legacy-desktop-watch-ads-renderer,

    /* hide the enforcement “you must disable AdBlock” popup */
    ytd-playability-error-supported-renderers,
    ytd-enforcement-message-view-model {
        display: none !important;
    }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // ——— AD‑BLOCK BYPASS & SKIP ———
    function initAdObserver() {
        const player = document.querySelector('.html5-video-player');
        if (!player) return;
        new MutationObserver(muts => {
            muts.forEach(m => {
                if (m.attributeName === 'class' && player.classList.contains('ad-showing')) {
                    // click "Not Interested" if present
                    player.querySelector('#efyt-not-interested')?.click();
                    // click skip button if available
                    document.querySelector('.ytp-ad-skip-button')?.click();
                    // force skip by seeking to end
                    const v = player.querySelector('video');
                    if (v) v.currentTime = v.duration;
                    console.log('[YT Bypass] ad blocked/skipped');
                }
            });
        }).observe(player, { attributes: true });
    }

    // ——— BUFFER KICK ———
    const SEEK = 0.1;
    new MutationObserver(() => {
        document.querySelectorAll('video').forEach(v => {
            if (!v._kicked) {
                v.addEventListener('loadedmetadata', () => {
                    v.currentTime = Math.min(v.duration * 0.01, SEEK);
                    v._kicked = true;
                    console.debug('[Kick] at', v.currentTime);
                }, { once: true });
            }
        });
    }).observe(document.documentElement, { childList: true, subtree: true });

    // Initialize only ad bypass & block
    function initTools() {
        initAdObserver();
    }

    // SPA nav watcher
    new MutationObserver(() => {
        if (document.querySelector('ytd-watch-flexy[page-loaded]')) initTools();
    }).observe(document.documentElement, { childList: true, subtree: true });

    initTools();
    console.log('YT Bypass+Block+Kick v2.5.1 blockads loaded');
})();