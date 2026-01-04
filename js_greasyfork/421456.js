// ==UserScript==
// @name         Shoptet "Strankovani nahore"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.03
// @description  Vloží stránkování i na začátek stránky
// @author       Zuzana Nyiri
// @license      MIT
// @match        */admin/*
// @exclude      */admin/naskladneni/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421456/Shoptet%20%22Strankovani%20nahore%22.user.js
// @updateURL https://update.greasyfork.org/scripts/421456/Shoptet%20%22Strankovani%20nahore%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".pagination")[0]){
        $('.pagination').clone(true).insertAfter($('.breadcrumbNav'));
    }
})();