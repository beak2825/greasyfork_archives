// ==UserScript==
// @name           Optimisation de l’impression sur lemonde.fr
// @name:en        Print optimization on lemonde.fr
// @namespace      http://tampermonkey.net/
// @version        0.1
// @description    Retire les éléments étrangers au contenu des articles lors de l’impression ou l’export en PDF à partir de lemonde.fr
// @description:en Removes the elements unrelated to articles content when printing or exporting as PDF from lemonde.fr
// @author         Olivier Croquette
// @match          https://www.lemonde.fr/*
// @require        https://code.jquery.com/jquery-3.7.1.min.js
// @icon           https://www.lemonde.fr/bucket/assets/8158900ace61db3c0dca20c33d835d7d78b6c2f7/img/landing_page_mobile/applis/icon-jelec.png
// @grant          GM_addStyle
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/476871/Optimisation%20de%20l%E2%80%99impression%20sur%20lemondefr.user.js
// @updateURL https://update.greasyfork.org/scripts/476871/Optimisation%20de%20l%E2%80%99impression%20sur%20lemondefr.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';
    GM_addStyle(`@media print {
                .catcher { display: none !important; }
                .inread { display: none !important; }
                .services { display: none !important; }
                .services-carousel { display: none !important; }
                }`);
})();

