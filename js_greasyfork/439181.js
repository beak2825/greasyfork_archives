// ==UserScript==
    // @name        stack
    // @description n+1(a to b)
    // @include     https://freebitco.in/*
    // @require https://greasyfork.org/scripts/439178-betodds-1/code/betodds+1.js?version=1012883
    // @version 1.0.1
    // @license MIT
    // @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439181/stack.user.js
// @updateURL https://update.greasyfork.org/scripts/439181/stack.meta.js
    // ==/UserScript==

var contribution_rate=prompt("укажите границу стека", "4950");
var initial_rate=prompt("укажите вход стека", "2");
$('#double_your_btc_payout_multiplier').val((initial_rate).toString()+".00");
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("lose")')) {
     odds(contribution_rate,initial_rate);
   }
 });
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("win")')) {
     $('#double_your_btc_payout_multiplier').val((initial_rate).toString()+".00");
   }
 });
