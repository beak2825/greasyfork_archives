// ==UserScript==
// @name        hasn
// @description n+1
// @include     https://freebitco.in/*
// @version 1.0.
// @license MIT
// @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/438588/hasn.user.js
// @updateURL https://update.greasyfork.org/scripts/438588/hasn.meta.js
// ==/UserScript==

  $('#double_your_btc_stake').val("0.00000002"*1);

function l(){
 $('#double_your_btc_stake').val($('#double_your_btc_stake').val()*1+"0.00000001"*1); 
}


function w(){
  $('#double_your_btc_stake').val("0.00000002"*1);  
}


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