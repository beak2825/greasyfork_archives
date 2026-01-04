// ==UserScript==
// @name         Shoptet "přesun tlačítka #1"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.1
// @description  Přesune tlačítko, pro přidání produktu do objednávky, nahoru.
// @author       Zuzana Nyiri
// @match        */admin/objednavky-detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410796/Shoptet%20%22p%C5%99esun%20tla%C4%8D%C3%ADtka%201%22.user.js
// @updateURL https://update.greasyfork.org/scripts/410796/Shoptet%20%22p%C5%99esun%20tla%C4%8D%C3%ADtka%201%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.std-filter').append( $('div.open-menu.standalone') );
    $('div.open-menu.standalone').css({'top': '2px', 'left': '5px'});
})();