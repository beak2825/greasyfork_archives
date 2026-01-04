// ==UserScript==
// @name         Facebook Mobile Smart Blocker (Safe Match)
// @namespace    http://tampermonkey.net/
// @version      6
// @license      MIT
// @description  Ukrywa dokładnie: sponsorowane, rolki, znajomych — tylko jeśli występują w nagłówkach; nie ukrywa losowo wszystkiego.
// @author       ChatGPT
// @match        https://m.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536997/Facebook%20Mobile%20Smart%20Blocker%20%28Safe%20Match%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536997/Facebook%20Mobile%20Smart%20Blocker%20%28Safe%20Match%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PHRASES = [
        'Sponsorowane',
        'Rolki',
        'Reels',
        'Osoby, które możesz znać'
    ];

    function hideByHeaderText() {
        const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6, span, strong, b');

        headers.forEach(header => {
            if (!header.innerText) return;

            const match = PHRASES.some(phrase => header.innerText.trim().includes(phrase));
            if (match) {
                const container = header.closest('article, section, div');
                if (container && container.offsetParent !== null) {
                    container.style.display = 'none';
                }
            }
        });
    }

    // Działa cyklicznie, dla iOS Safari
    setInterval(hideByHeaderText, 1500);
})();
