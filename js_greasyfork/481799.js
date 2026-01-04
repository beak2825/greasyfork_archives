// ==UserScript==
// @name         Chicken-Nuggies-Zkill
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2023-12-09
// @description  Changes ISK values to amount of nuggies you could buy with said ISK. (According to this reddit post https://www.reddit.com/r/Eve/comments/18dvcls/ships_are_worth_chicken_nuggets/)
// @author       Fisk Hrin Hakuli
// @match        https://zkillboard.com/kill/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/481799/Chicken-Nuggies-Zkill.user.js
// @updateURL https://update.greasyfork.org/scripts/481799/Chicken-Nuggies-Zkill.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const tableRows = document.getElementsByTagName('tr');
     const pattern = /Ship\+Fit/;
     const iskToNuggies = 0.000000296272593

     for (let i = 1; i < tableRows.length; i++) {
        if (pattern.test(tableRows[i].innerText)) {
            for (let x = 0; x < 4; x++) {
                var current = parseFloat(tableRows[i+x].getElementsByTagName('td')[0].innerText.replace(/,/g, '')) * iskToNuggies;
                tableRows[i+x].getElementsByTagName('td')[0].innerText = String(current).concat(" Nuggies");
            }
          }

     }
})();