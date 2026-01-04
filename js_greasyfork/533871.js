// ==UserScript==
// @name         AniList List Card Title Shortener
// @namespace    plennhar-anilist-list-card-title-shortener
// @version      1.0.2
// @description  Trim overly long manga/anime titles on AniList entry cards
// @author       Plennhar
// @match        https://anilist.co/*
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533871/AniList%20List%20Card%20Title%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/533871/AniList%20List%20Card%20Title%20Shortener.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2025 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(function () {
    'use strict';

    // Hook into React Router to enable shortening when navigating
    function wrap(type) {
        const orig = history[type];
        return function (...args) {
            const res = orig.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
            return res;
        };
    }
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });

    window.addEventListener('locationchange', () => {
        setTimeout(processAll, 100);
    });

    const maxLen = 100;  // Max characters for a title if it doesn't want to be shortened
    const displayLen = 100;   // Max number of title characters to show

    // Shortening function
    function shortenTitle(a) {
        let txt = a.textContent.trim();
        if (txt.length > maxLen) {
            a.textContent = txt.slice(0, displayLen) + '…';
        }
    }

    // Scan the page for all entry-card title links
    function processAll() {
        document
            .querySelectorAll('.entry-card .title a[href*="/manga/"], .entry-card .title a[href*="/anime/"]')
            .forEach(shortenTitle);
    }

    // Run on initial load
    processAll();

    // Watch for DOM injections and shorten if new cards appear
    const obs = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                if (!(n instanceof Element)) continue;
                if (n.matches('.entry-card') || n.querySelector('.entry-card')) {
                    processAll();
                    return;
                }
            }
        }
    });

    obs.observe(document.body, { childList: true, subtree: true });
})();