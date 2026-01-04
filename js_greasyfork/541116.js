// ==UserScript==
// @name         MissAV Cleaner & Playback Enhancer
// @version      1.0
// @description  Remove ads, auto mute, prevent pause on tab switch, redirect to missav.live, enhance titles and add tag links
// @author       GiantSnake
// @match        https://missav.com/*
// @match        https://missav123.com/*
// @match        https://missav.ws/*
// @match        https://missav.live/*
// @match        https://missav.ai/*
// @match        https://thisav.com/*
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1465070
// @downloadURL https://update.greasyfork.org/scripts/541116/MissAV%20Cleaner%20%20Playback%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/541116/MissAV%20Cleaner%20%20Playback%20Enhancer.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const origin = window.location.origin;

    // 1. Redirect from missav.com to missav.live
    if (/^https:\/\/(missav|thisav)\.com/.test(location.href)) {
        location.href = location.href.replace('missav.com', 'missav.live').replace('thisav.com', 'missav.live');
        return;
    }

    // 2. Remove all known ad containers
    function removeAds() {
        const selectors = [
            'div[class^="root"]',
            'div[class*="fixed"][class*="right-"][class*="bottom-"]',
            'div[class*="pt-"][class*="pb-"][class*="px-"]:not([class*="sm:"])',
            'div[class*="lg:hidden"]',
            'div[class*="lg:block"]',
            'div.ts-outstream-video',
            'iframe',
            'ul.mb-4.list-none.text-nord14',
            '.prose',
            'img[alt="MissAV takeover Fanza"]'
        ];
        document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());
    }

    // 3. Title enhancement - Remove truncation from video titles
    function enhanceTitles() {
        const titleElements = document.querySelectorAll('div.my-2.text-sm.text-nord4.truncate');
        titleElements.forEach(div => {
            const a = div.querySelector('a');
            if (a && a.href.includes(window.location.hostname)) {
                div.className = div.className.replace('truncate', '');
                console.log('[MissAV Enhanced] Title truncation removed');
            }
        });
    }

    // 4. Tag link conversion - Convert homepage tags to clickable links
    function convertTagsToLinks() {
        const tagContainers = document.querySelectorAll('div.flex-1.min-w-0');
        tagContainers.forEach(div => {
            const h2 = div.querySelector('h2');
            if (h2 && h2.innerText && !h2.querySelector('a')) {
                const text = h2.innerText.trim();
                if (text) {
                    const link = document.createElement('a');
                    link.href = `${origin}/genres/${text}`;
                    link.innerText = text;
                    link.style.color = 'inherit';
                    link.style.textDecoration = 'none';
                    h2.innerHTML = '';
                    h2.appendChild(link);
                    console.log(`[MissAV Enhanced] Tag "${text}" converted to link`);
                }
            }
        });
    }

    // 5. Combined enhancement function
    function enhanceContent() {
        enhanceTitles();
        convertTagsToLinks();
    }

    const throttle = (fn, delay) => {
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last > delay) {
                last = now;
                fn(...args);
            }
        };
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Observe DOM for dynamically added ads and content
        const observer = new MutationObserver(throttle(() => {
            removeAds();
            enhanceContent();
        }, 500));
        observer.observe(document, { childList: true, subtree: true });

        // Initial enhancement
        enhanceContent();

        // 6. Auto mute and autoplay video
        const player = document.querySelector('video.player');
        if (player) {
            player.muted = true;
            player.play().catch(console.warn);
        }

        // 7. Disable auto-pause when tab is not focused
        let isBlurred = false;
        window.addEventListener('blur', () => { isBlurred = true });
        window.addEventListener('focus', () => { isBlurred = false });

        if (player) {
            const originalPause = player.pause.bind(player);
            player.pause = () => {
                if (!isBlurred) {
                    originalPause();
                } else {
                    console.log('Auto-pause blocked while tab is unfocused.');
                }
            };
        }

        // Prevent visibility change logic
        Object.defineProperty(document, 'hidden', { get: () => false });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
        document.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
    });

    // Remove popup window behavior
    unsafeWindow.open = () => {};
})();