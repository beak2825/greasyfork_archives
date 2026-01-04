// ==UserScript==
// @name         Onionplay Spoiler Remover
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes spoilers and replaces cover image on OnionPlay without delay or flash, now fully working again 😤🛠️
// @author       Loki
// @match        https://onionplay.ch/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539167/Onionplay%20Spoiler%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/539167/Onionplay%20Spoiler%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const customImageURL = 'https://static.vecteezy.com/system/resources/thumbnails/025/132/511/small_2x/background-gradient-black-overlay-abstract-background-black-night-dark-evening-with-space-for-text-for-a-background-free-photo.jpg';

    // Pre-block the original image flash with CSS (but without breaking JS logic)
    const style = document.createElement('style');
    style.textContent = `
        img.cover[src*="https://image.tmdb.org"] {
            visibility: hidden;
        }
    `;
    document.head.appendChild(style);

    function cleanUpPage() {
        // Remove all .extra_note elements
        const spoilers = document.querySelectorAll('.extra_note');
        spoilers.forEach(el => el.remove());

        // Replace the cover image only if it's not already replaced
        const coverImg = document.querySelector('img.cover');
        if (coverImg && !coverImg.src.includes(customImageURL)) {
            coverImg.src = customImageURL;
            coverImg.style.visibility = 'visible';
        }
    }

    // Run once DOM is loaded
    document.addEventListener('DOMContentLoaded', cleanUpPage);

    // Observe for dynamic page content
    const observer = new MutationObserver(() => {
        cleanUpPage();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run once in case things are already in place
    cleanUpPage();
})();
