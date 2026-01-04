// ==UserScript==
// @name         YouTube Shorts to Watch Redirect (SPA Safe)
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Automatically redirects YouTube Shorts URLs to the traditional watch page, even with SPA navigation on YouTube.
// @author       Tadaky
// @match        *://*.youtube.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542842/YouTube%20Shorts%20to%20Watch%20Redirect%20%28SPA%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542842/YouTube%20Shorts%20to%20Watch%20Redirect%20%28SPA%20Safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const redirectShorts = () => {
        const path = location.pathname;
        if (path.startsWith("/shorts/")) {
            const videoId = path.split("/")[2];
            const params = location.search;
            const targetUrl = `https://www.youtube.com/watch?v=${videoId}${params}`;
            if (location.href !== targetUrl) {
                window.location.replace(targetUrl);
            }
        }
    };

    // Redireciona ao carregar a página
    redirectShorts();

    // Observa mudanças na URL (SPA do YouTube)
    const observeUrlChange = () => {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                redirectShorts();
            }
        }).observe(document.body, { childList: true, subtree: true });
    };

    // Espera o body carregar antes de observar
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", observeUrlChange);
    } else {
        observeUrlChange();
    }
})();
