// ==UserScript==
// @name         nba.com boxscore
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects NBA game preview links to the box score page automatically on nba.com (including middle click support). Works on dynamically loaded content too (SPA support). 🏀📊
// @author       You
// @license      MIT
// @match        https://www.nba.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543894/nbacom%20boxscore.user.js
// @updateURL https://update.greasyfork.org/scripts/543894/nbacom%20boxscore.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function attachRedirectListeners() {
        const links = document.querySelectorAll('a[href^="/game/"]');

        links.forEach(link => {
            if (link.dataset.tmBound) return;

            const href = link.getAttribute('href');
            const match = href.match(/^\/game\/([a-z\-0-9]+)$/i);

            if (match) {
                const baseUrl = match[1];
                const fullUrl = `/game/${baseUrl}/box-score`;

                // Update href for middle-clicks, ctrl+click etc.
                link.setAttribute('href', fullUrl);

                // Handle left-clicks
                link.addEventListener('click', function (e) {
                    const isLeftClick = e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey;

                    if (isLeftClick) {
                        e.preventDefault();
                        console.log(`[TM] Redirecting to: ${fullUrl}`);
                        window.location.href = fullUrl;
                    }
                });

                link.dataset.tmBound = "true";
            }
        });
    }

    // Run on initial load
    attachRedirectListeners();

    // Observe changes (for dynamic content)
    const observer = new MutationObserver(() => {
        attachRedirectListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();