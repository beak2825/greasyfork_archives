// ==UserScript==
// @name         Kemono Image Blur on Hover Only (Reliable)
// @namespace    MoodyMonkey Scripts
// @version      1.0
// @description  Blurs post images on Kemono until hover
// @match        *://kemono.su/*
// @match        *://www.kemono.su/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536331/Kemono%20Image%20Blur%20on%20Hover%20Only%20%28Reliable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536331/Kemono%20Image%20Blur%20on%20Hover%20Only%20%28Reliable%29.meta.js
// ==/UserScript==

// === CONFIG ===
const useUrlCheck = true; // Set to false to always blur images or true to unblur only if url is a search result page.

// === CODE ===

(function () {
    'use strict';

    // Exit early if URL should disable the script
    if (useUrlCheck && window.location.href.includes('posts?q=')) {
        console.log('[Kemono Blur] URL matched "posts?q=" — skipping blur');
        return;
    }

    const style = document.createElement('style');
    style.id = 'kemono-image-blur-style';
    style.innerHTML = `
        img.post-card__image {
            filter: blur(15px) !important;
            transition: filter 0.2s ease-in-out !important;
        }

        img.post-card__image:hover {
            filter: none !important;
        }
    `;
    document.head.appendChild(style);
})();