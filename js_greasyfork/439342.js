// ==UserScript==
// @name        fenix auto
// @description 3||4||5 fenix
// @include     https://freebitco.in/*
// @require https://greasyfork.org/scripts/439341-profitrunesfenix/code/profitrunesfenix.js?version=1013847
// @require https://greasyfork.org/scripts/439340-nextrun-1/code/nextrun-1.js?version=1013843
// @require https://greasyfork.org/scripts/439370-butonclick/code/butonclick.js?version=1013976
// @version 1.0.3
// @license MIT
// @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439342/fenix%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/439342/fenix%20auto.meta.js
// ==/UserScript==
 
 
var profit = prompt("укажите усредненный доход блока от 3 до 5 чтобы начать автоигру", "3");
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