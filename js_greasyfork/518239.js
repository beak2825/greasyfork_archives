// ==UserScript==
// @name         Change rotation of animation in ADP to clockwise
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ändert die Animationseigenschaft für .adpPrime .spin
// @author       4lc4tr4y
// @match        https://adpworld.adp.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518239/Change%20rotation%20of%20animation%20in%20ADP%20to%20clockwise.user.js
// @updateURL https://update.greasyfork.org/scripts/518239/Change%20rotation%20of%20animation%20in%20ADP%20to%20clockwise.meta.js
// ==/UserScript==

// MIT License
// Copyright (c) [2024] [4lc4tr4y]
//
// Erlaubt wird hiermit, kostenlos die Software zu verwenden, zu kopieren, zu ändern,
// zusammenzuführen, zu veröffentlichen, zu verbreiten, zu unterlizenzieren und/oder zu verkaufen,
// solange die folgenden Bedingungen erfüllt sind:
// - Der obige Copyright-Hinweis und dieser Lizenzhinweis müssen in allen Kopien oder wesentlichen
//   Teilen der Software enthalten sein.
//
// DIE SOFTWARE WIRD "WIE BESEHEN" UND OHNE GARANTIEN ODER BEDINGUNGEN JEGLICHER ART, AUSDRÜCKLICH ODER
// IMPLIZIERT, EINGESCHLOSSEN DER IMPLIZITEN GARANTIEN DER MARKTFÄHIGKEIT UND EIGNUNG FÜR EINEN
// BESTIMMTEN ZWECK.


(function() {
    'use strict';

    // Warten, bis die Seite vollständig geladen ist
    window.addEventListener('load', function() {
        // Sicherstellen, dass die CSS-Änderungen korrekt angewendet werden
        GM_addStyle(`
            .adpPrime .spin {
                -moz-animation: rotating 60s steps(60) infinite !important;
                -webkit-animation: rotating 60s steps(60) infinite !important;
                animation: rotating 60s steps(60) infinite !important;
            }
        `);
    });

    // MutationObserver einrichten, um Änderungen nach dem Laden zu überwachen
    const observer = new MutationObserver(() => {
        const spinElement = document.querySelector('.adpPrime .spin');
        if (spinElement) {
            spinElement.style.animation = 'rotating 60s steps(60) infinite !important'; // reverse entfernt
        }
    });

    // Beobachte den gesamten Body, um Änderungen zu erfassen
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();