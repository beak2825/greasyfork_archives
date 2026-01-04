// ==UserScript==
// @name        eMAG Doar Vandute De Emag
// @description Ascunde rezultatele care nu sunt livrate/vandute de eMAG, din lista cu detalii. Din pacate, cealalta lista nu ofera informatii despre cine vinde de fapt produsul.
// @namespace   Sapioit
// @copyright   Sapioit, 2020 - Present
// @author      sapioitgmail.com
// @license     GPL-2.0-only; http://www.gnu.org/licenses/gpl-2.0.txt
// @match       http://www.emag.ro/search/*
// @match       https://www.emag.ro/search/*
// @match       http://emag.ro/search/*
// @match       https://emag.ro/search/*
// @version     1.0.0.3
// @icon        https://www.emag.ro/favicon.ico
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474802/eMAG%20Doar%20Vandute%20De%20Emag.user.js
// @updateURL https://update.greasyfork.org/scripts/474802/eMAG%20Doar%20Vandute%20De%20Emag.meta.js
// ==/UserScript==
// @downloadURL https://greasyfork.org/scripts/474802-emag-doar-vandute-de-emag/code/eMAG%20Doar%20Vandute%20De%20Emag.user.js
// @updateURL   https://openuserjs.org/install/sapioitgmail.com/eMAG_Doar_Vandute_De_Emag.meta.js

//GM_addStyle('.card-item.card-standard.js-product-data { display: none; }');
//GM_addStyle('.card-item.card-standard.js-product-data:has(a[href^="https://www.emag.ro/emag/1/") { display: block; }');

setTimeout(() => {
// Select all parent div elements
let divs = document.querySelectorAll('.card-item.card-standard.js-product-data');
console.log(divs.length+'<br/>');

// Loop through the divs
for (let i = 0; i < divs.length; i++) {
    let a = divs[i].querySelector('.card-v2.card-list-updated .card-vendor a'); // Get the anchor link
    //console.log(divs[i].outerHTML+'\n');

    if (a) {
        console.log(a.outerHTML+'\n'+a.innerHTML+'\n');
        if ( a.innerHTML !== 'eMAG' ){
            divs[i].style.display = 'none';
            divs[i].style.color = 'red';
        }
    //} else {
    //    divs[i].style.display = 'none';
    }
}
}, 1000); // Adjust the delay (in milliseconds) if needed



