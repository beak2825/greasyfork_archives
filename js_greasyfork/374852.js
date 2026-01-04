// ==UserScript==
// @name         Kápětka
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Přidá k=5 kategorii pro stránky danyk.cz
// @author       MK
// @match        http://www.danyk.cz/*
// @match        https://www.danyk.cz/*
// @match        http://danyk.cz/*
// @match        https://danyk.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374852/K%C3%A1p%C4%9Btka.user.js
// @updateURL https://update.greasyfork.org/scripts/374852/K%C3%A1p%C4%9Btka.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Ahoj
    console.log('Spouštím skript na implementaci tlačítka kápětka');

    // Získej parametr k z URL
    var url_string = document.URL;
    var url = new URL(url_string);
    var k = url.searchParams.get("k");

    // Sestav potřebný HTML kód k vložení
    var state = k==5 ? 'menuaktiv' : 'menutext';
    var htmlCode = '<a href=\"kniha.php?k=5\" title=\"Kápětka - tajná skupina iluminátů =D\"> <span class=\"' + state + '\">Kápětka </span></a>';

    // Vlož kód do HTML stránky
    var locateText = 'Píseček </span></a>'; //HTML kód co předchází vložení
    var html = document.getElementById("levy").innerHTML;
    var htmlNew = html.replace(locateText, locateText + htmlCode);
    document.getElementById("levy").innerHTML = htmlNew;

})();