// ==UserScript==
// @name         BOKA - Renommage + Masquage RDV vides (léger)
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Renomme les types de RDV IKEA et masque les blocs vides. Optimisé pour de bonnes performances.
// @match        https://boka.ingka.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536200/BOKA%20-%20Renommage%20%2B%20Masquage%20RDV%20vides%20%28l%C3%A9ger%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536200/BOKA%20-%20Renommage%20%2B%20Masquage%20RDV%20vides%20%28l%C3%A9ger%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const map = new Map([
        ['Groupe 3', 'Groupe 3 - Rendez-vous classiques'],
        ['Groupe 4', 'Groupe 4 - Rendez-vous avec financement'],
        ['CALENDAR_1', 'Rendez-vous de commande avec installation'],
        ['CALENDAR_2', 'Rendez-vous de financement'],
        ['CALENDAR_3', 'Rendez-vous de financement avec installation'],
        ['PLANNING_KITCHEN_REMOTE', 'Rendez-vous de conception'],
        ['ORDER_FINALIZATION_KITCHEN_REMOTE', 'Rendez-vous de commande'],
    ]);

    const replaceText = n => {
        if (n.nodeType === 3) {
            let t = n.nodeValue;
            map.forEach((v, k) => t.includes(k) && (t = t.replaceAll(k, v)));
            n.nodeValue = t;
        } else if (n.nodeType === 1 && !['SCRIPT', 'STYLE', 'IFRAME', 'NOSCRIPT'].includes(n.tagName)) {
            n.childNodes.forEach(replaceText);
        }
    };

    const hideEmptyBlocks = () => {
        document.querySelectorAll('div.sc-bxjEGZ.iYWPGb').forEach(b => {
            if (!b.querySelector('.sc-Qotzb.OIREG')) {
                b.style.display = 'none';
            }
        });
    };

    new MutationObserver(m => m.forEach(e => e.addedNodes.forEach(n => {
        replaceText(n);
    }))).observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        replaceText(document.body);
        hideEmptyBlocks();
        setInterval(() => {
            replaceText(document.body);
            hideEmptyBlocks();
        }, 3000);
    });
})();
