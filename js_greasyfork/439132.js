
// ==UserScript==
// @name        enigma
// @description 3||4||5
// @include     https://freebitco.in/*
// @require https://greasyfork.org/scripts/439122-profitrunes/code/profitrunes.js?version=1012529
// @require https://greasyfork.org/scripts/439109-nextrun/code/nextrun.js?version=1012491
// @require https://greasyfork.org/scripts/439370-butonclick/code/butonclick.js?version=1013976
// @version 1.0.4
// @license MIT
// @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439132/enigma.user.js
// @updateURL https://update.greasyfork.org/scripts/439132/enigma.meta.js
// ==/UserScript==


var profit = prompt("укажите доход блока от 3 до 5 чтобы начать автоигру", "3");
profitrunes(profit);
butonclick();
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("lose")')) {
next();
    
    setTimeout(butonclick(),20000); 
     
 }
 });
 
 
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
   if ($(event.currentTarget).is(':contains("win")')) {
profitrunes(profit);
   
     setTimeout(butonclick(),45000); 
     
 }
 });
