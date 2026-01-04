// ==UserScript==
// @name         Shoptet "Přesun ikony univerzity"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.4
// @description  Prostě přesune tlačítko univerzity až na konec řádku
// @author       Zuzana Nyiri
// @match        */admin/*

// @downloadURL https://update.greasyfork.org/scripts/420489/Shoptet%20%22P%C5%99esun%20ikony%20univerzity%22.user.js
// @updateURL https://update.greasyfork.org/scripts/420489/Shoptet%20%22P%C5%99esun%20ikony%20univerzity%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elementToMove = $('.headerNavigation__item.headerNavigation__item--university');
    var targetPosition = $('.headerNavigation');//.last();
    elementToMove.detach().appendTo(targetPosition);
})();