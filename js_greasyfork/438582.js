// ==UserScript==
// @name        proekt
// @description n+1
// @include     https://freebitco.in/*
// @require https://greasyfork.org/scripts/438589-bibln-1/code/bibln+1.js?version=1008853
// @version 1.0.3.
// @license MIT
// @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/438582/proekt.user.js
// @updateURL https://update.greasyfork.org/scripts/438582/proekt.meta.js
// ==/UserScript==

  $('#double_your_btc_stake').val("0.00000002"*1);


$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("lose")')) {
l();
 }
 });


$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("win")')) {
w();
 }
 });
