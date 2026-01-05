// ==UserScript==
// @name         Otodom Remove Links
// @namespace    http://www.studiopomyslow.com
// @version      20170425
// @description  Umożliwia łatwe skopiowanie nazwy miejscowości.
// @author       Dawid Ciecierski
// @match        https://www.otodom.pl/oferta/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29250/Otodom%20Remove%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/29250/Otodom%20Remove%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.address-links > a').replaceWith(function() { return $(this).text(); });
})();