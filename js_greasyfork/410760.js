// ==UserScript==
// @name         Shoptet "otevření filtrů v přehledu objednávek"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.31
// @description  Automaticky otevře filtry v přehledu objednávek
// @author       Zuzana Nyiri
// @match        */admin/prehled-objednavek/*
// @match        */admin/prehlad-objednavok/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410760/Shoptet%20%22otev%C5%99en%C3%AD%20filtr%C5%AF%20v%20p%C5%99ehledu%20objedn%C3%A1vek%22.user.js
// @updateURL https://update.greasyfork.org/scripts/410760/Shoptet%20%22otev%C5%99en%C3%AD%20filtr%C5%AF%20v%20p%C5%99ehledu%20objedn%C3%A1vek%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!$('#filter').is(':visible')) {
        $('#filter-toggle > a').each(function(index){
            this.click();
        });
    }
})();