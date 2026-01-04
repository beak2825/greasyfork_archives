// ==UserScript==
// @name        Meneame Shit Remover
// @namespace   tampermonkey.net/
// @version     1.7
// @description Oculta elementos molestos de la web
// @author      Koyadovic & ochoceros
// @match       *://*.meneame.net/*
// @run-at      document-end
// @icon        https://www.meneame.net/favicon.ico
// @grant       none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/434828/Meneame%20Shit%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/434828/Meneame%20Shit%20Remover.meta.js
// ==/UserScript==

(function() {
    const nuisances = [
        '#newswrap aside',
        'div#header-banner',
        '#newswrap .sponsored',
        '#newsletter',
        '#live-window',
        '.ads-interlinks',
        '#live-mobile',
        '.ad-roba-container',
        '#newswrap > div[align="center"] > a[href="https://blog.meneame.net/suscripciones/"]',
    ];

    function removeNuisances() {
        nuisances.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const link = element.querySelector('.pages');
                if (!link) {element.remove();}
            });
        });
    }

    removeNuisances();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                removeNuisances();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();