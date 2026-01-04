// ==UserScript==
// @name         Invidious Injector for YouTube
// @namespace    https://tampermonkey.net/
// @license      CC-BY-4.0; https://creativecommons.org/licenses/by/4.0/
// @version      1.0
// @description  Injects Invidious embed player instead of YouTube's native one (resistant to SPA reloads and overwrites)
// @author       ilumn
// @match        *://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539545/Invidious%20Injector%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/539545/Invidious%20Injector%20for%20YouTube.meta.js
// ==/UserScript==
// original author: ilumn: https://github.com/ilumn/Invidious-Injector

(function () {
    'use strict';

    const INVIDIOUS_BASE = 'https://inv.nadeko.net';
    let lastInjectedVideoId = null;

    function getVideoId() {
        const params = new URLSearchParams(window.location.search);
        const v = params.get('v');
        return v && v.length === 11 ? v : null;
    }

    function injectIframe(videoId) {
        const playerWrap = document.getElementById('player');
        if (!playerWrap || lastInjectedVideoId === videoId) return;

        // double injection safety
        lastInjectedVideoId = videoId;

        console.log('[InvidiousInjector] Injecting iframe for video:', videoId);

        playerWrap.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.src = `${INVIDIOUS_BASE}/embed/${videoId}?autoplay=1`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;

        playerWrap.appendChild(iframe);
    }

    function watchForPlayerAndInject() {
        const videoId = getVideoId();
        if (!videoId) return;

        const maxAttempts = 40;
        let attempts = 0;
        const interval = setInterval(() => {
            const player = document.getElementById('player');
            const yVideo = document.querySelector('video');

            if (player && yVideo && yVideo.parentElement.closest('#player')) {
                console.log('[InvidiousInjector] YouTube player found, replacing...');
                player.style.height = "800px"
                clearInterval(interval);
                injectIframe(videoId);
            }

            if (++attempts > maxAttempts) {
                console.warn('[InvidiousInjector] Timed out waiting for player.');
                clearInterval(interval);
            }
        }, 250);
    }

    // detect spa navigations
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            lastInjectedVideoId = null;
            setTimeout(watchForPlayerAndInject, 500);
        }
    }).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(watchForPlayerAndInject, 500);
    });
})();
