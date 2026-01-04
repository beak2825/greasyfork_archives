// ==UserScript==
// @name        genesis3 auto
// @name:ru     genesis3 auto
// @description:ru  genesis3
// @description genesis3
// @include     https://freebitco.in/*
// @require https://greasyfork.org/scripts/439615-zip3/code/zip3.js?version=1015753
// @require https://greasyfork.org/scripts/439370-butonclick/code/butonclick.js?version=1013976
// @version 1.0.0
// @license MIT
// @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439616/genesis3%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/439616/genesis3%20auto.meta.js
// ==/UserScript==
 
$('#double_your_btc_payout_multiplier').val("19.00");
$('#double_your_btc_stake').val("0.00000001"*3);
butonclick();
 
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("lose")')) {
zip();
    
    setTimeout(butonclick(),20000); 
     
 }
 });
 
 
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("win")')) {
$('#double_your_btc_payout_multiplier').val("19.00");
$('#double_your_btc_stake').val("0.00000003"*1);
   
     setTimeout(butonclick(),45000); 
     
 }
 });