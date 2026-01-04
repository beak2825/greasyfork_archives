// ==UserScript==
// @name         Crunchyroll True Fullscreen Fix for Opera GX
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Forces video element fullscreen instead of browser fullscreen in Crunchyroll on Opera GX
// @license      MIT
// @author       theoxl
// @match        https://www.crunchyroll.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541367/Crunchyroll%20True%20Fullscreen%20Fix%20for%20Opera%20GX.user.js
// @updateURL https://update.greasyfork.org/scripts/541367/Crunchyroll%20True%20Fullscreen%20Fix%20for%20Opera%20GX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funksjon for å finne den virkelige fullskjermknappen
    function findRealFullscreenButton() {
        // Prøv flere måter å finne knappen på
        const buttons = Array.from(document.querySelectorAll('button'));

        // 1. Søk etter aria-label som inneholder "full screen" eller liknende
        let btn = buttons.find(b => {
            const label = b.getAttribute('aria-label') || '';
            return label.toLowerCase().includes('fullscreen') ||
                   label.toLowerCase().includes('full screen');
        });

        if (btn) return btn;

        // 2. Søk etter SVG som brukes i fullskjermknappen
        btn = buttons.find(b => {
            return b.querySelector('svg path[d*="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"]');
        });

        return btn || null;
    }

    function fixFullscreenButton() {
        const video = document.querySelector('video');
        if (!video) {
            setTimeout(fixFullscreenButton, 1000);
            return;
        }

        const fullscreenBtn = findRealFullscreenButton();
        if (!fullscreenBtn) {
            console.log('Fullskjermknapp ikke funnet, prøver igjen...');
            setTimeout(fixFullscreenButton, 1000);
            return;
        }

        // Sjekk om vi allerede har fikset denne knappen
        if (fullscreenBtn.dataset.fixedByScript) return;
        fullscreenBtn.dataset.fixedByScript = 'true';

        // Lag en kopi for å fjerne eksisterende event listeners
        const newBtn = fullscreenBtn.cloneNode(true);
        fullscreenBtn.parentNode.replaceChild(newBtn, fullscreenBtn);

        newBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();

            try {
                if (video.classList.contains('fullscreen')) {
                    await document.exitFullscreen();
                } else {
                    await video.requestFullscreen();
                }
            } catch (err) {
                console.warn('Fullskjerm feil:', err);
                // Fallback til vanlig fullskjerm hvis video fullskjerm feiler
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        });

        console.log('Fullskjermknappen er nå fikset!');
    }

    // Start observatør for endringer i DOM
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('video')) {
            fixFullscreenButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Kjør umiddelbart hvis video allerede er lastet
    if (document.querySelector('video')) {
        fixFullscreenButton();
    }
})();