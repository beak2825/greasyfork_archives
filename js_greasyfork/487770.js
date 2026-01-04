// ==UserScript==
// @name         Změna barev stavu platby v Shoptet administraci
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  podle class a stavu platby změní barvu kolečka se stavem platby, sloupec PLATBA
// @author       Adam Černý
// @match        */admin/prehled-objednavek/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487770/Zm%C4%9Bna%20barev%20stavu%20platby%20v%20Shoptet%20administraci.user.js
// @updateURL https://update.greasyfork.org/scripts/487770/Zm%C4%9Bna%20barev%20stavu%20platby%20v%20Shoptet%20administraci.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setCustomColor(statusType, color) {
    // Definice selektorů pro jednotlivé statusy
    const statusClassMap = {
        'paid': '.status--paid',
        'unpaid': '.status--unpaid',
        'overPaid': '.status--overPaid',
        'badAmount': '.status--badAmount'
    };

    // Získání selektoru pro daný status
    const selector = statusClassMap[statusType];

    // Kontrola, zda existuje selektor pro daný status
    if (!selector) {
        console.error('Neplatný typ statusu:', statusType);
        return;
    }

    // Nastavení barvy pro všechny elementy s daným selektorem
    document.querySelectorAll(selector).forEach(element => {
        element.style.backgroundColor = color;
    });
}

// Příklad použití
setCustomColor('paid', '##00A300'); // Nastaví barvu pro všechny elementy s třídou .status--paid
setCustomColor('unpaid', '#C0C0C0'); // Nastaví barvu pro všechny elementy s třídou .status--unpaid
setCustomColor('overPaid', '#FFA600'); // Nastaví barvu pro všechny elementy s třídou .status--overPaid
setCustomColor('badAmount', '#FF0000'); // Nastaví barvu pro všechny elementy s třídou .status--badAmount

})();