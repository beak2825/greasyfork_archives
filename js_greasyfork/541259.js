// ==UserScript==
// @name         n-tv.de Werbefilter (korrigiert)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Entfernt Werbung und unerwünschte Bilder von n-tv.de
// @author       Ihr Name
// @match        https://www.n-tv.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541259/n-tvde%20Werbefilter%20%28korrigiert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541259/n-tvde%20Werbefilter%20%28korrigiert%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Liste der zu entfernenden Elemente (CSS-Selektoren)
    const selectorsToRemove = [
        // Allgemeine Werbung (Beispiele - anpassen!)
        '.ad', '.advertisement', '.banner', '.teaser--ad',
        // Bilder von bilder.n-tv.de blockieren
        'img[src*="bilder.n-tv.de"]',
        // Iframes und Skripte blockieren
        'iframe[src*="ads"]', 'script[src*="adservice"]'
    ];

    // Funktion zum Entfernen der Elemente
    function removeElements() {
        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
                console.log('Entfernt: ' + selector);
            });
        });
    }

    // MutationObserver für dynamisch nachgeladene Inhalte
    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // Sofortige Ausführung + Verzögerung (für initiale Ladung)
    removeElements();
    setTimeout(removeElements, 2000);
})();