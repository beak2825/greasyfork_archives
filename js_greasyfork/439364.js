// ==UserScript==
    // @name        enum +1auto
    // @description n+1
    // @include     https://freebitco.in/*
    // @require https://greasyfork.org/scripts/438589-bibln-1/code/bibln+1.js?version=1008853
    // @require https://greasyfork.org/scripts/439370-butonclick/code/butonclick.js?version=1013976
    // @version 1.0.4
    // @license MIT
    // @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439364/enum%20%2B1auto.user.js
// @updateURL https://update.greasyfork.org/scripts/439364/enum%20%2B1auto.meta.js
    // ==/UserScript==
     
      $('#double_your_btc_stake').val("0.00000002"*1);
     $('#double_your_btc_payout_multiplier').val("3.02");

butonclick();

$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("lose")')) {
l();
    
    setTimeout(butonclick(),20000); 
     
 }
 });
 
 
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("win")')) {
w();
   
     setTimeout(butonclick(),45000); 
     
 }
 });