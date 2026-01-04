// ==UserScript==
// @name         Přesměrování URL na Synottip
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměruje URL pro Synottip
// @author       Jiří
// @match        ://m.synottip.cz/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483697/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20URL%20na%20Synottip.user.js
// @updateURL https://update.greasyfork.org/scripts/483697/P%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20URL%20na%20Synottip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro přesměrování URL
    function presmerovatURL() {
        // Získáme aktuální URL
        var currentURL = window.location.href;

        // Regulární výraz pro hledání čísel v URL
        var match = currentURL.match(/\/zapas\/(\d+)/);

        if (match) {
            // Získáme číslo z URL
            var matchNumber = match[1];

            // Vytvoříme novou URL s příslušným číslem
            var newURL = 'https://m.synottip.cz/live-zapas/' + matchNumber;

            // Přesměrujeme na novou URL
            window.location.href = newURL;
        }
    }

    // Spustíme funkci presmerovatURL ihned po načtení skriptu
    presmerovatURL();

    // Nastavíme interval na 1.5 sekund (1500 milisekund)
    setInterval(presmerovatURL, 1500);

})();