// ==UserScript==
// @name        Mathias' CSGOLounge W/L/C Bets
// @namespace   Mathias
// @description Allows you to calculate your W/L/C ratio on bets.
// @include     http://csgolounge.com/*
// @version     1.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/3609/Mathias%27%20CSGOLounge%20WLC%20Bets.user.js
// @updateURL https://update.greasyfork.org/scripts/3609/Mathias%27%20CSGOLounge%20WLC%20Bets.meta.js
// ==/UserScript==
// ---- Wins & Losses @ Bets
var wAmounts = 0;
var lAmounts = 0;
var cAmounts = 0;
$('.button').click(function() {
});
$('.box-shiny').append("<a class='button' id='butt'>Calculate Bets</button>")
$('#butt').click(function() {
var wins = $('.won');
var losses = $('.lost');
var closed = $(".box span:not([class]), .box span[class='']");
closed.each(function() {
   cAmounts++; 
});
wins.each(function() {
    wAmounts++;
});
losses.each(function() {
   lAmounts++; 
});
if(wAmounts == 0 && lAmounts == 0) {
    $('#butt').html("Calculate Bets <font color='red' size='1'>Use this after you've clicked on Bet History!</font>");
} else {
    console.log('Wins: ' + wAmounts + ' Losses: ' + lAmounts + ' Closed: ' + cAmounts);
    $('#butt').html("Calculate Bets <font color='green'>" + wAmounts + "</font>/<font color='red'>" + lAmounts + "</font>" + "/<font color='grey'>" + cAmounts + "</font>");
    wAmounts = 0;
    lAmounts = 0;
    cAmounts = 0;
}
});