// ==UserScript==
    // @name        enum +1auto(ukr)
    // @description n+1
    // @include     https://freebitco.in/*
    // @require https://greasyfork.org/scripts/438589-bibln-1/code/bibln+1.js?version=1008853
    // @version 1.0.1
    // @license MIT
    // @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439365/enum%20%2B1auto%28ukr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439365/enum%20%2B1auto%28ukr%29.meta.js
    // ==/UserScript==
     
      $('#double_your_btc_stake').val("0.00000002"*1);
     $('#double_your_btc_payout_multiplier').val("3.02");
$(document).ready(function($){
$('#double_your_btc_bet_lo_button').click();
});
 
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("lose")')) {
l();
    
    setTimeout($('#double_your_btc_bet_lo_button').click(),15000); 
     
 }
 });
 
 
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("win")')) {
w();
   
     setTimeout($('#double_your_btc_bet_lo_button').click(),35000); 
     
 }
 });