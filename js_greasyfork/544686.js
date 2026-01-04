// ==UserScript==
// @name         SkidrowCodex Full Unlock: Overlay, Deblur, Adult Reveal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Instantly removes overlay blocks, deblurs preview videos, and reveals adult content (bye warning-text 😏) — no clicks needed, just full exposure 😈
// @author       Pythius-Demon
// @match        https://www.skidrowcodex.net/*
// @icon         https://files.catbox.moe/c6knn3.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544686/SkidrowCodex%20Full%20Unlock%3A%20Overlay%2C%20Deblur%2C%20Adult%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/544686/SkidrowCodex%20Full%20Unlock%3A%20Overlay%2C%20Deblur%2C%20Adult%20Reveal.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const removeOverlay = () => {
        document.querySelectorAll('.overlay').forEach(el => {
            el.remove();
            console.log('[Overlay Remover] Removed .overlay');
        });
    };

    const deblurVideos = () => {
        document.querySelectorAll('video.blurred-img').forEach(video => {
            video.classList.remove('blurred-img');
            video.style.filter = 'none';
            video.style.backdropFilter = 'none';
            console.log('[Deblur] Cleared blur from video');
        });
    };

    const revealAdultContent = () => {
        // Remove the warning-text blocker
        document.querySelectorAll('.warning-text').forEach(el => {
            el.remove();
            console.log('[Adult Reveal] Removed .warning-text');
        });

        // Optional: Reveal hidden content if it's being masked by warning-text
        document.querySelectorAll('.blurred-img, .click-to-reveal, .adult_content, .adult-content').forEach(el => {
            el.classList.remove('blurred-img', 'click-to-reveal', 'adult_content', 'adult-content');
            el.style.filter = 'none';
            el.style.backdropFilter = 'none';
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            el.querySelectorAll('button, .cover, .click-overlay').forEach(e => e.remove());
            console.log('[Adult Reveal] Revealed hidden adult content');
        });
    };

    const initStyleOverride = () => {
        const style = document.createElement('style');
        style.textContent = `
            video.blurred-img {
                filter: none !important;
                backdrop-filter: none !important;
            }
            .adult_content, .adult-content, .click-to-reveal {
                filter: none !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }
            .warning-text {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    };

    const fullCleanup = () => {
        removeOverlay();
        deblurVideos();
        revealAdultContent();
    };

    // Initial cleanup
    initStyleOverride();
    fullCleanup();

    // Watch for any dynamic changes
    const observer = new MutationObserver(() => {
        fullCleanup();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
