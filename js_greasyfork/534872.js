// ==UserScript==
// @name         Twitch URL & Link Cleaner (Full)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes query parameters from Twitch URLs and all <a href> links (absolute and relative) on the page (everything after "?").
// @author       DiCK
// @match        https://www.twitch.tv/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534872/Twitch%20URL%20%20Link%20Cleaner%20%28Full%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534872/Twitch%20URL%20%20Link%20Cleaner%20%28Full%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Remove query parameters from the current page URL
    const cleanCurrentUrl = () => {
        const url = window.location.href;
        const clean = url.split('?')[0];
        if (url !== clean) {
            history.replaceState(null, '', clean);
        }
    };

    // Remove query parameters from all <a> hrefs
    const cleanAllLinks = () => {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            // Check if it's a Twitch-related link (absolute or relative)
            const isTwitchLink =
                href.startsWith('/') || href.startsWith('https://www.twitch.tv/');

            if (isTwitchLink && href.includes('?')) {
                const cleanHref = href.split('?')[0];
                link.setAttribute('href', cleanHref);
            }
        });
    };

    // Initial cleanup
    cleanCurrentUrl();
    cleanAllLinks();

    // Observe the DOM for new/changed <a> tags (Twitch is a dynamic site)
    const observer = new MutationObserver(() => {
        cleanAllLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Re-run cleaning after pushState / replaceState
    const patchHistoryMethod = (method) => {
        const original = history[method];
        history[method] = function () {
            original.apply(this, arguments);
            setTimeout(() => {
                cleanCurrentUrl();
                cleanAllLinks();
            }, 0);
        };
    };

    patchHistoryMethod('pushState');
    patchHistoryMethod('replaceState');

    // Back/forward button
    window.addEventListener('popstate', () => {
        cleanCurrentUrl();
        cleanAllLinks();
    });
})();
