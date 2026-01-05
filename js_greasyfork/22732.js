// ==UserScript==
// @name        leboncoin - Titre avec le prix
// @description Ce script ajoute le prix d'une annonce dans le titre. Pratique quand on met en favoris une annonce
// @namespace   *
// @version     1.0
// @include     https://www.leboncoin.fr/*
// @author      35niavlys
// @downloadURL https://update.greasyfork.org/scripts/22732/leboncoin%20-%20Titre%20avec%20le%20prix.user.js
// @updateURL https://update.greasyfork.org/scripts/22732/leboncoin%20-%20Titre%20avec%20le%20prix.meta.js
// ==/UserScript==

var itemPriceList = document.getElementsByClassName("item_price");
if(itemPriceList.length > 0) {
  var valueList = itemPriceList[0].getElementsByClassName("value");
  if(valueList.length > 0) {
    document.title += " - " + valueList[0].innerText;
  }
}