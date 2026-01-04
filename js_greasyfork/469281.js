// ==UserScript==
// @name         Instagram Explore and Reels Button Remover (German and English)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the Explore and Reels button on Instagram (supports German and English language settings)
// @author       You
// @match        https://www.instagram.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469281/Instagram%20Explore%20and%20Reels%20Button%20Remover%20%28German%20and%20English%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469281/Instagram%20Explore%20and%20Reels%20Button%20Remover%20%28German%20and%20English%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        const exploreButtonGerman = document.querySelector('svg[aria-label="Entdecken"]');
        const exploreButtonEnglish = document.querySelector('svg[aria-label="Explore"]');
        const exploreButton = exploreButtonGerman || exploreButtonEnglish;
        if (exploreButton) {
            exploreButton.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        }

        const reelsButton = document.querySelector('svg[aria-label="Reels"]');
        if (reelsButton) {
            reelsButton.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
