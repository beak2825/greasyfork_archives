// ==UserScript==
    // @name        stock
    // @description a1||a2||...||an||{lose...}=const
    // @include     https://freebitco.in/*
    // @require https://greasyfork.org/scripts/439167-betodds-1/code/betodds-1.js?version=1012834
    // @version 1.0.4
    // @license MIT
    // @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439168/stock.user.js
// @updateURL https://update.greasyfork.org/scripts/439168/stock.meta.js
    // ==/UserScript==
var betodss=prompt("задайте константу вероятности", "2");
$('#double_your_btc_payout_multiplier').val((betodss).toString()+".00");

$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("lose")')) {

     odds(betodss);
   }
 });
 
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("win")')) {

     $('#double_your_btc_payout_multiplier').val((betodss).toString()+".00");
   }
 });