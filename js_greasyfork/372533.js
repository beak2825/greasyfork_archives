// ==UserScript==
// @name        fredo.in cert
// @description BET BET BETttt
// @include     https://freedoge.co.in/*
// @copyright   2018+, ggg
// @version     1.12
// @namespace Dekpiano
// @downloadURL https://update.greasyfork.org/scripts/372533/fredoin%20cert.user.js
// @updateURL https://update.greasyfork.org/scripts/372533/fredoin%20cert.meta.js
// ==/UserScript==
bconfig = {
  maxBet: 3,
  wait: 300,
  toggleHilo:false
};


hilo = 'hi';
multiplier = 2;
rollDice = function() {


  if ($('#double_your_doge_bet_lose').html() !== '') {
    $('#double_your_doge_2x').click();
    $('#double_your_doge_3x').click();
    $('#double_your_doge_4x').click();
    $('#double_your_doge_5x').click();

    multiplier++;
    if(bconfig.toggleHilo)toggleHiLo();
  } else {
    $('#double_your_doge_min').click();
    multiplier = 3;
  }


  if (parseFloat($('#balance').html()) < (parseFloat($('#double_your_doge_stake').val()) * 2) ||
    parseFloat($('#double_your_doge_stake').val()) > bconfig.maxBet) {
    $('#double_your_doge_min').click();
  }


  $('#double_your_doge_bet_' + hilo + '_button').click();


  setTimeout(rollDice, (multiplier * bconfig.wait) + Math.round(Math.random() * 100));
};


toggleHiLo = function() {
  if (hilo === 'lo') {
    hilo = 'lo';
  } else {
    hilo = 'lo';
  }
};


rollDice();