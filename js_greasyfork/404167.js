// ==UserScript==
// @name        Geizhals Netto
// @description Nettopreise für Geizhals
// @match       https://geizhals.at/*
// @match       https://geizhals.de/*
// @match       https://geizhals.eu/*
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @version     2
// @grant       none
// @namespace https://greasyfork.org/users/572927
// @downloadURL https://update.greasyfork.org/scripts/404167/Geizhals%20Netto.user.js
// @updateURL https://update.greasyfork.org/scripts/404167/Geizhals%20Netto.meta.js
// ==/UserScript==

$(function() {
  $("span.gh_price").each(function(){

    price = parseFloat($(this).text().replace("ab \u20ac ","").replace("from \u20ac ","").replace("\u20ac ","").replace(",--","").replace(",","."));
    price = price/1.2;
    formatedPrice = "(n) \u20ac "+price.toFixed(2).toString().replace(".",",");
    
    $(this).css("text-decoration","line-through").css("color","grey");
    
    $("<span class='gh_price gh_price_netto' style='display:block;'></span>").insertAfter($(this)).text(formatedPrice);
  });
});