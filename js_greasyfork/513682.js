// ==UserScript==
// @name         YouTube pink progress bar remover
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Replace gradient red-pink color in YouTube player to just old good red
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513682/YouTube%20pink%20progress%20bar%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/513682/YouTube%20pink%20progress%20bar%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replaceGradient = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .ytp-play-progress {
                background: #f00 !important;
            }
            .ytp-cairo-refresh .ytp-swatch-background-color {
                background-color: #f00 !important; /* lub inny kolor, który chcesz */
            }
        `;
        document.head.appendChild(styleElement);
    };

    // DOM Observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            const progressBar = document.querySelector('.ytp-play-progress');
            const swatchBackground = document.querySelector('.ytp-cairo-refresh .ytp-swatch-background-color');
            if (progressBar || swatchBackground) {
                replaceGradient();
                observer.disconnect();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
