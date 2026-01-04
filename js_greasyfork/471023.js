// ==UserScript==
// @name         posMultiIncremental [[xXx MiTy DEV xXx]]
// @namespace    https://freebitco.in/*
// @version      1.0
// @description  Incremental on Base Bet as a 10x10 grid
// @author       MiTySDK
// @match        https://freebitco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471023/posMultiIncremental%20%5B%5BxXx%20MiTy%20DEV%20xXx%5D%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/471023/posMultiIncremental%20%5B%5BxXx%20MiTy%20DEV%20xXx%5D%5D.meta.js
// ==/UserScript==

// Support my work by registering at https://freebitco.in/?r=10071414

/* ------------- CONFIG ------------- */
var posPlacement = 1;
var minBalanceToPlay = 0.0002; //In full BTC value
var multiplier = 10;
var minTimeToReload = 15;
var stopBalance = 0.003;
/* ------------- LOAD PRESETS ------------- */
var bonusBalance = parseFloat($('#bonus_account_balance').text());
var myBalance = parseFloat($('#balance').html());
var currentNonce = parseFloat($('#previous_nonce').html());
var currentBalance = bonusBalance + myBalance;
var newBalance = currentBalance;
var nextNonce = currentNonce;
var button = 0;
var timeout = 0;
var posStake = [];
var posWin = [];
var pos = 0;
var step = 1;
var sum = 0;
var roll = 0;
var avg = 0;
var even = 100000000;
/* ------------- UserValues ------------- */

    console.log(minBalanceToPlay);
    minBalanceToPlay = minBalanceToPlay.toString();
var satoshis = posPlacement;
var satisfiedProfit = (satoshis / even).toFixed(8);
var satisfiedBalance = posPlacement * 0.001;
/* ------------- TIMER ------------- */
setInterval(function(){
  timeout = ($('head > title').text()).substr(0,2);
    if(timeout == 59){
       location.reload();
      }

},10000);

/*----------------------------------------
         PREDEFINED FUNCTIONS
----------------------------------------*/

/* ------------- LOCATION ------------- */
function Locationz(){
  var a = document.querySelectorAll('a');
  a[6].click();
}

function GenerateArrays(){
    for(var x=1; x <= multiplier; x++){
        posStake.push(posPlacement);
        posWin.push(0);
    }
}
GenerateArrays();
/* ------------- RANDOM NUMBER GENERATOR BETWEEN MIN & MAX INCLUSIVE ------------- */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
/* ------------- NonceVerifier ------------- */
function CheckNonce(){
  nextNonce = parseFloat($('#next_nonce').html());
}

/* ------------- Balance Verifier ------------- */
function CheckBalance(){
  newBalance = parseFloat($('#bonus_account_balance').text()) + parseFloat($('#balance').html());
}

function chooseButton(){
  if(getRndInteger(0,10001) >=5000){
    button = $('#double_your_btc_bet_hi_button');
  }else{
    button = $('#double_your_btc_bet_lo_button');
  }

}
function updateAverage(){
    setTimeout(function(){
        step = step + 1;
        roll = parseFloat($('#previous_roll').html());
        sum = sum + roll;
        avg = sum / step;
    }, 4000);
}
/*----------------------------------------
         END OF PREDEFINED FUNCTIONS

         START OF STRATEGY
----------------------------------------*/
function gameLoader(){
  if(timeout > minTimeToReload && newBalance >= currentBalance){
    setTimeout(function(){
      Locationz();
      CheckBalance();
      if(currentBalance > minBalanceToPlay && currentBalance < satisfiedBalance){
        $('#double_your_btc_payout_multiplier').val(multiplier);
        LinkStart();
      }else{
        console.log('minimum balance not met.');
      }

    },getRndInteger(2500,10000));

  }
}

function LinkStart(){
  if(newBalance > parseFloat(currentBalance + satisfiedProfit)){
    console.log('Congrats you made a Profit.' + (newBalance - parseFloat(currentBalance + satisfiedProfit)));
      location.reload();
  }else{
    CheckNonce();
    if(!nextNonce == currentNonce + 1){
      console.log('Nonce Incorrect restart.');
      LinkStart();
    }else{
      if(newBalance > satisfiedBalance){

      }else{
        $('#double_your_btc_stake').val(parseFloat(posStake[pos] / even).toFixed(8));
        button.click();
        updateAverage();
        setTimeout(function(){
          if($('#double_your_btc_bet_win').is(':visible')){
            posStake[pos] = posPlacement;
          }else{
            posStake[pos] *= 2;
          }
          pos += 1;
          if(pos == multiplier){
            pos = 0;
          }
          $('#double_your_btc_bet_hi_button').html((avg).toFixed(2));
          CheckBalance();
          LinkStart();
        },getRndInteger(5000,10000));
      }
    }
  }
}
/* ------------- Check if website is ready  ------------- */
setTimeout(function(){
  if($( document ).ready()){
      if(currentBalance < stopBalance){
          console.clear();
          console.log(currentBalance);
          chooseButton();
          if(timeout == 59){
              location.reload();
          }else{
              gameLoader();
          }
      }
  }
},15000);
