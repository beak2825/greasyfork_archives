// ==UserScript==
// @name        CODESMarket - GMTools
// @namespace   Violentmonkey Scripts
// @match       https://www.eldarya.com/marketplace*
// @match       https://www.eldarya.com.br/marketplace*
// @match       https://www.eldarya.de/marketplace*
// @match       https://www.eldarya.es/marketplace*
// @match       https://www.eldarya.fr/marketplace*
// @match       https://www.eldarya.hu/marketplace*
// @match       https://www.eldarya.it/marketplace*
// @match       https://www.eldarya.pl/marketplace*
// @match       https://www.eldarya.ru/marketplace*
// @grant       none
// @version     1.0
// @author      -
// @description 29/6/2022, 4:54:53
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447207/CODESMarket%20-%20GMTools.user.js
// @updateURL https://update.greasyfork.org/scripts/447207/CODESMarket%20-%20GMTools.meta.js
// ==/UserScript==

$(function() {
  $("body").on("click", ".marketplace-search-item", function() {
    $(this).find(".abstract-icon span").remove();
    var code = $(this).attr("data-wearableitemid");
    $(this).find(".abstract-icon").append('<span style="background-color: #000;color: #fff;padding:5px; pointer-events:none; user-select:all; z-index:5; position: relative;">' + code + '</span>');
  });
  
  $("body").on("click", ".marketplace-itemsForSale-item", function() {
  $(this).find(".abstract-icon span").remove();
    var code = JSON.parse($(this).attr("data-item"));
    code = code.id;
    $(this).find(".abstract-icon").append('<span style="background-color: #000;color: #fff;padding:5px; pointer-events:none; user-select:all; z-index:5; position: relative;">' + code + '</span>');
  });
});