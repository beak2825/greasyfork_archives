// ==UserScript==
// @name         youtube-adb-optimized
// @namespace    https://github.com/cleondev/youtube-adb-optimized
// @version      1.2
// @author       Cleon
// @source       https://github.com/cleondev/youtube-adb-optimized
// @description  Safely remove YouTube ads (UI banners, in-stream video ads, and overlays) with optimized performance and reliability.
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535214/youtube-adb-optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/535214/youtube-adb-optimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Development flag: toggle via URL param '?ytadb-dev' or localStorage 'ytadb-dev'
    const dev = location.search.includes('ytadb-dev') || localStorage.getItem('ytadb-dev') === '1';
    const runFlags = new Set();
    let observer;

    // List of selectors for UI ads
    const uiSelectors = [
        '#masthead-ad',
        'ytd-display-ad-renderer',
        '.video-ads.ytp-ad-module',
        'yt-mealbar-promo-renderer',
        '.ytd-popup-container a[href="/premium"]',
        'ytd-ad-slot-renderer',
        'ytm-companion-ad-renderer'
    ];

    function log(msg) {
        if (!dev) return;
        console.log('[youtube-adb]', msg);
    }

    function checkRunFlag(name) {
        if (runFlags.has(name)) return true;
        runFlags.add(name);
        return false;
    }

    // Inject CSS to hide UI ads
    function injectUICSS() {
        if (checkRunFlag('ui-css')) return;
        const style = document.createElement('style');
        const rules = uiSelectors.map(s => `${s}{display:none!important}`).join(' ');
        style.textContent = rules;
        document.head.appendChild(style);
        log('Injected UI CSS');
    }

    // Check if an ad is currently playing
    function isAdPlaying() {
        return document.querySelector('.ad-showing') !== null;
    }

    // Skip video ads: click only when skip button is available
    function attemptSkipAd() {
        if (!isAdPlaying()) return;
        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern');
        if (skipBtn) {
            skipBtn.click();
            skipBtn.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
            skipBtn.dispatchEvent(new TouchEvent('touchend',   { bubbles: true, cancelable: true }));
            log('Clicked skip button');
        }
    }

    // Close overlays/premium popups
    function closeOverlays() {
        document.querySelectorAll('tp-yt-iron-overlay-backdrop, .ytd-popup-container').forEach(el => el.remove());
        log('Removed overlays');
    }

    // Single observer callback, debounced
    let debounceTimer;
    function observerCallback() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            closeOverlays();
            attemptSkipAd();
        }, 100);
    }

    // Setup MutationObserver on YouTube player container
    function setupObserver() {
        if (checkRunFlag('main-observer')) return;
        const container = document.getElementById('player') || document.body;
        observer = new MutationObserver(observerCallback);
        observer.observe(container, { childList: true, subtree: true });
        log('Observer started');

        // Cleanup and re-init on SPA navigation
        window.addEventListener('yt-navigate-finish', () => {
            observer.disconnect();
            runFlags.clear();
            log('Disconnected observer on navigate');
            init();
        });
    }

    // Main initialization
    function init() {
        injectUICSS();
        setupObserver();
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();