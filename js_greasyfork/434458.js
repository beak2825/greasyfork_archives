// ==UserScript==
// @name         Freebitco.in Low balance and roll speed MULTIPLY BTC Script 2021
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  To support please register on my free bitco.in reffer https://freebitco.in/?r=10276558
// @author       Cyber community
// @match        https://freebitco.in/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434458/Freebitcoin%20Low%20balance%20and%20roll%20speed%20MULTIPLY%20BTC%20Script%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/434458/Freebitcoin%20Low%20balance%20and%20roll%20speed%20MULTIPLY%20BTC%20Script%202021.meta.js
// ==/UserScript==

// Autoroll script
var minstake   = 0.00000002;  // valor base
//-----------------------------------------
var autorounds = 30;         // n° of rolls
//======================================================
// if (PROFIT > profit_max) {
    //     error_title = "Maximum profit exceeded";
    //     error_info = "Maximum profit: " + number_format(profit_max, devise_decimal);
    //     error_value = "Maximum profit exceeded - Maximum profit: " + number_format(profit_max, devise_decimal);
    //     error = true;
    // } SCRIPT 2021 auto resolve captcha / low balance script
    // else if (amount > balance) {
    //     error_title = "Bet amount";
    //     error_info = "Maximum bet: " + number_format(balance, devise_decimal);
    //     error_value = "Bet amount - Maximum bet: " + number_format(balance, devise_decimal);
    //     error = true;
    // }
var handbrake  = 0.00800000;  // valor lose pause game
var autoruns   = 1;
    // else if (amount > bet_max) {
    //     error_title = "Bet amount";
    //     error_info = "Maximum bet: " + number_format(bet_max, devise_decimal);
    //     error_value = "Bet amount - Maximum bet: " + number_format(bet_max, devise_decimal);
    //     error = true;
    // }
    // else if (amount < bet_min) {
    //     error_title = "Bet amount";
    //     error_info = "Minimum bet: " + number_format(bet_min, devise_decimal);
    //     error_value = "Bet amount - Minimum bet: " + number_format(bet_min, devise_decimal);
    //     error = true;
    // }
function playnow() {
       if (autoruns > autorounds ) { console.log('Limit reached'); return; }
       document.getElementById('double_your_btc_bet_lo_button').click();
       setTimeout(checkresults, 7);
       return;}
function checkresults() {
       if (document.getElementById('double_your_btc_bet_lo_button').disabled === true) {
              setTimeout(checkresults, 666);
              return;
       }
       var stake = document.getElementById('double_your_btc_stake').value * 2;
       var won = document.getElementById('double_your_btc_bet_win').innerHTML;
       if (won.match(/(\d+\.\d+)/) !== null) { won = won.match(/(\d+\.\d+)/)[0]; } else { won = false; }
       var lost = document.getElementById('double_your_btc_bet_lose').innerHTML;
       if (lost.match(/(\d+\.\d+)/) !== null) { lost = lost.match(/(\d+\.\d+)/)[0]; } else { lost = false; }
       if (won && !lost) { stake = won * 2.8; console.log('Bet #' + autoruns + '/' + autorounds + ': Won  ' + won  + ' Stake: ' + stake.toFixed(8)); }
       if (lost && !won) { stake = lost * 1.6; console.log('Bet #' + autoruns + '/' + autorounds + ': Lost ' + lost + ' Stake: ' + stake.toFixed(8)); }
       if (!won && !lost) { console.log('Something went wrong'); return; }
       document.getElementById('double_your_btc_stake').value = stake.toFixed(8);
       autoruns++;
       if (stake >= handbrake) {
              document.getElementById('handbrakealert').play();
              console.log('Handbrake triggered! Execute playnow() to override');
           return;
       }
       setTimeout(playnow, 3333);
       return;
      
       }playnow()