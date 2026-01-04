// ==UserScript==
// @name        pbibl
// @description n+1
// @include     https://freebitco.in/*
// @require https://greasyfork.org/scripts/438589-bibl/code/bibl.js?version=1008830
// @version 1.0.
// @license MIT
// @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/438590/pbibl.user.js
// @updateURL https://update.greasyfork.org/scripts/438590/pbibl.meta.js
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