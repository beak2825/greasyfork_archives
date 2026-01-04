// ==UserScript==
// @name         Shoptet "Velký font do rozevíracího menu v detailu objednávky"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.0
// @description  Zvětší písmo v seznamu stavů objednávek, způsobů platby a stavu (ne)zaplaceno v detailu objednávky.
// @author       Zuzana Nyiri
// @match        */admin/objednavky-detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410754/Shoptet%20%22Velk%C3%BD%20font%20do%20rozev%C3%ADrac%C3%ADho%20menu%20v%20detailu%20objedn%C3%A1vky%22.user.js
// @updateURL https://update.greasyfork.org/scripts/410754/Shoptet%20%22Velk%C3%BD%20font%20do%20rozev%C3%ADrac%C3%ADho%20menu%20v%20detailu%20objedn%C3%A1vky%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    dropDownMenuFont(document.getElementById('status-id')); // stav objednávky
    dropDownMenuFont(document.getElementById('invoice-billing-method-id')); // způsob platby
    dropDownMenuFont(document.getElementById('paid')); // stav placeno
})();

function dropDownMenuFont(list) {
    list.style.fontSize = "larger"; // velikost písma vybrané položky
    var i;
    for (i = 0; i < list.options.length; i++) {
        list.options[i].style.fontSize = "large"; // velikost písma položek po rozevření menu
    }
}