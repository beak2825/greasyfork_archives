// ==UserScript==
// @name        Proveiling Totals
// @namespace   nl.veiling.pro
// @description Adds totals per auction on mylots of proveiling.nl
// @include     http://www.proveiling.nl/MyLots.aspx
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19762/Proveiling%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/19762/Proveiling%20Totals.meta.js
// ==/UserScript==

var ch = $("td");
var cost = 0;

$("#itemPlaceholderContainer tr").each(function() {
  if ($(this).data("type") === "header") {   	
    cost = 0;    
    ch = $(this).children("td");
    ch.append($("<strong class='total right'>-</strong>"))
  }
  if ($(this).hasClass("clickable")) {
    cost = cost + parseFloat($(this).find("#next").text().replace(/,/, '.'));
    ch.children(".total").text("€ " + parseFloat(Math.round(cost * 100) / 100).toFixed(2).replace('.', ','));
  }
});