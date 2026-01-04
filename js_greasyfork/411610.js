// ==UserScript==
// @name         Shoptet "barva textu stavu objednávek"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.02
// @description  Změní barvu textu v celém řádku podle barvy textu stavu objednávky
// @author       Zuzana Nyiri
// @match        */admin/prehled-objednavek/*
// @match        */admin/prehlad-objednavok/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411610/Shoptet%20%22barva%20textu%20stavu%20objedn%C3%A1vek%22.user.js
// @updateURL https://update.greasyfork.org/scripts/411610/Shoptet%20%22barva%20textu%20stavu%20objedn%C3%A1vek%22.meta.js
// ==/UserScript==


 (function() {
    'use strict';
    var tbl = document.querySelectorAll('table.checkbox-table.std-table.std-table-listing')[0];
    if (!(tbl === undefined)){
        var col1 = document.getElementsByClassName('item-code');
        for (var a = 1; a < tbl.rows.length-1; a++) {
            var myColor = col1[a-1].style.color;
            for (var b = 0; b < tbl.rows[0].cells.length; b++) {
                tbl.rows[a].cells[b].style.color = myColor;
            };
        };
    };
})();