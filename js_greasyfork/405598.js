// ==UserScript==
// @name         Shoptet klávesová zkratka #1
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.03
// @description  Přidává klávesovou zkratku pro administraci Shoptetu. Klávesou ESC se skryje náhled objednávky a náhled komentářů objednávky.
// @author       Zuzana Nyiri
// @match        */admin/prehled-objednavek/*
// @match        */admin/prehlad-objednavok/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405598/Shoptet%20kl%C3%A1vesov%C3%A1%20zkratka%201.user.js
// @updateURL https://update.greasyfork.org/scripts/405598/Shoptet%20kl%C3%A1vesov%C3%A1%20zkratka%201.meta.js
// ==/UserScript==

(function(){
    document.addEventListener('keydown', function(e) {
        'use strict';
        if (e.keyCode == 27) {
            $("#item-preview").remove();
        }
    }, false);
})();