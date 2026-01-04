// ==UserScript==
// @name        Fineco invasives banner removal - finecobank.com
// @name:it     Rimozione banner pubblicitari invasivi di Fineco - finecobank.com
// @namespace   Violentmonkey Scripts
// @match       https://finecobank.com/*
// @grant       none
// @version     1.1
// @author      Seb Seb Seb
// @description Removes the invasives banner that Fineco bank just injects into each damn page, nothing less, nothing more!
// @description:it Rimuove i banner invasivi su Fineco bank in ogni singola pagina, nulla di più o di meno!
// @downloadURL https://update.greasyfork.org/scripts/414909/Fineco%20invasives%20banner%20removal%20-%20finecobankcom.user.js
// @updateURL https://update.greasyfork.org/scripts/414909/Fineco%20invasives%20banner%20removal%20-%20finecobankcom.meta.js
// ==/UserScript==

window.onload = function () {
  var ids = ['floating-banner','promo-trading-portfolio-box','bannersContainer','banner','promo-advertisement'];
  ids.forEach(function (el){
    var sel = document.getElementById(el);
    if(sel !== null) {
      sel.remove();
    }
  });

}
