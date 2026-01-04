// ==UserScript==
// @name         Norsko Basketbal2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirects live match URLs to the correct format
// @author       Michal a Martin
// @match        https://kamper.basket.no/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513056/Norsko%20Basketbal2.user.js
// @updateURL https://update.greasyfork.org/scripts/513056/Norsko%20Basketbal2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro dynamické přidání skriptu na stránku
    function appendScript() {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                'use strict';

                const liveMatchRegex = /https:\\/\\/kamper\\.basket\\.no\\/match\\?seasonId=(\\d+)&tournamentId=(\\d+)&matchId=(\\d+)/;

                function checkUrlAndRedirect() {
                    const currentUrl = window.location.href;

                    if (liveMatchRegex.test(currentUrl)) {
                        const newUrl = currentUrl.replace('match', 'livematch');
                        if (currentUrl !== newUrl) {
                            window.history.replaceState({}, document.title, newUrl);
                            console.log('URL přegenerována na:', newUrl);
                        }
                    }
                }

                window.addEventListener('load', () => {
                    checkUrlAndRedirect();

                    const observer = new MutationObserver(() => {
                        checkUrlAndRedirect();
                    });

                    observer.observe(document.body, { childList: true, subtree: true });

                    setInterval(checkUrlAndRedirect, 2000);
                });
            })();
        `;
        document.head.appendChild(script);
    }

    // Spustit po načtení stránky
    appendScript();
})();
