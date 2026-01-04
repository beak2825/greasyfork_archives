// ==UserScript==
// @name         Mandøe's snitberegner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bestemmer dit vægtede gennemsnit på STADS. Ændrer titlen på siden til at vise gennemsnittet.
// @author       Andreas Mandøe
// @match        https://sbstads.au.dk/sb_STAP/sb/resultater/studresultater.jsp
// @icon         https://raw.githubusercontent.com/amandoee/amandoee.github.io/main/logo%20(3).ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458867/Mand%C3%B8e%27s%20snitberegner.user.js
// @updateURL https://update.greasyfork.org/scripts/458867/Mand%C3%B8e%27s%20snitberegner.meta.js
// ==/UserScript==

(function() {
    'use strict';

let ovre = 0;
let ovre_sum = 0;
let samlet_vaegt = 0;


let table = jQuery('table tr td').each( function( cmp ) {
    jQuery(this).text();
} );

let i =13;
let counter = 0;

    for (i=13; i<=table.length; i++) {
        if (counter==3) {
            counter=counter+1;
        }
        else if (counter==4) {
            counter=0;
        } else {

            if (counter ==0) {
                ovre=table[i].innerHTML;
            }

            if (counter==2) {
                ovre_sum+=(ovre*parseFloat(table[i].innerHTML));
                samlet_vaegt+=parseFloat(table[i].innerHTML);
            }

            console.log(table[i].innerHTML);
            counter=counter+1;
        }
    }
//alert("Dit vægtede gennemsnit er: "+(ovre_sum)/samlet_vaegt);
table[5].innerHTML=table[5].innerHTML+". Vægtede gennemsnit: "+ovre_sum/samlet_vaegt;
    //Find alle værdier

})();