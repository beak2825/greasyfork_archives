// ==UserScript==
// @name         YouTube Time Parameter Remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the &t=*s parameter from YouTube URLs
// @author       Rehan Ahmad
// @match        https://www.youtube.com/*
// @icon         https://raw.githubusercontent.com/r280822a/YouTube-Time-Parameter-Remover/refs/heads/main/icon/icon.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540028/YouTube%20Time%20Parameter%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/540028/YouTube%20Time%20Parameter%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function cleanURL() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // If 't' parameter exists, remove it
        if (params.has('t')) {
            params.delete('t');
            const cleanUrl = url.origin + url.pathname + '?' + params.toString();

            // Replace the URL without reloading the page
            window.history.replaceState({}, '', cleanUrl);
            console.log('Replaced timestamp parameter in URL');
        }
    }

    // Run on page load
    window.addEventListener('load', cleanURL);

    // Detect URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            cleanURL();
        }
    }).observe(document, { subtree: true, childList: true });
})();