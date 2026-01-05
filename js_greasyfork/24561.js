// ==UserScript==
// @name         Klikalne kategorie Allegro
// @namespace    http://www.studiopomyslow.com
// @version      20180313
// @description  Przywraca możliwość kliknięcia na ostatni element okruszków listujących kategorie.
// @author       Dawid Ciecierski
// @match        http*://allegro.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24561/Klikalne%20kategorie%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/24561/Klikalne%20kategorie%20Allegro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the last breadcrumb item
    var ol = document.querySelector('.breadcrumb');
    var liToDecorate = ol.lastElementChild;
    if (liToDecorate === undefined) return;
    // Modify!
    var url = window.location.pathname;
    var name = liToDecorate.getElementsByTagName('span')[0].innerHTML;
    liToDecorate.innerHTML = '<a class="dropdown-toggle" href="' + url + '" style="cursor:pointer;pointer-events:all;color:#0083ff"><span>' + name + '</span></a>';

})();