// ==UserScript==
// @name         Path of Exile Trading Style Script
// @namespace    https://www.pathofexile.com/
// @version      2024-06-14
// @description  Style assist to the style I made.
// @author       Jvne
// @match        https://www.pathofexile.com/trade/*
// @icon         https://www.pathofexile.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498010/Path%20of%20Exile%20Trading%20Style%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/498010/Path%20of%20Exile%20Trading%20Style%20Script.meta.js
// ==/UserScript==

function debounce(fn) {
    let frame;

    return (...params) => {
        if (frame) {
            window.cancelAnimationFrame(frame);
        }

        frame = window.requestAnimationFrame(() => {
            fn(...params);
        });
    };
}

function storeScroll() {
    document.documentElement.dataset.scroll = window.scrollY;
}

(function() {
    'use strict';

    document.addEventListener('scroll', debounce(storeScroll), { passive: true });
    storeScroll();
})();