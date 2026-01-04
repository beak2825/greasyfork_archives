// ==UserScript==
// @name         TORN - Employee Stat Totals
// @namespace    https://www.torn.com/factions.php?step=profile&ID=22887
// @version      1.1
// @description  Add it up
// @author       Ayelis
// @match        https://www.torn.com/companies.php
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369486/TORN%20-%20Employee%20Stat%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/369486/TORN%20-%20Employee%20Stat%20Totals.meta.js
// ==/UserScript==

function getVal (val) {
    var multiplier = val.substr(-1).toLowerCase();
    if (multiplier == "k"){
        return parseFloat(val) * 1000;
    }else if (multiplier == "m"){
        return parseFloat(val) * 1000000;
    }else if (multiplier == "b"){
        return parseFloat(val) * 1000000000;
    }else{ return val; }
}
function abbrev(num){
    return num > 999999999 ? (num/1000000000).toFixed(1).replace(/\.0$/, '') + 'b' : num > 999999 ? (num/1000000).toFixed(1).replace(/\.0$/, '') + 'm' : num > 999 ? (num/1000).toFixed(1).replace(/\.0$/, '') + 'k' : num
}
$(document).ready(function(){
    window.setInterval(function(){
        var adder=0;
        $('.stats.t-overflow').each(function( index ) {
            $( this ).children('.span-cont').children().remove();
            adder=0;
            $( this ).children('.span-cont').each(function( index ) {
                var num = parseInt(getVal($( this ).text().trim()));
                adder+=num;
            });
            $( this ).attr( "title", abbrev(adder) );
        });
    }, 1000);
});