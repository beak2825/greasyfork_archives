// ==UserScript==
// @name         Freebitco low balance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://freebitco.in/?op=home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392902/Freebitco%20low%20balance.user.js
// @updateURL https://update.greasyfork.org/scripts/392902/Freebitco%20low%20balance.meta.js
// ==/UserScript==

(function() {
var startValue = '0.00000002', // Don't lower the decimal point more than 4x of current balance
    stopPercentage = 0.0001, // In %. I wouldn't recommend going past 0.08 and initial per 0.0001
    stopLossVal = 0.00001000;//stop loss value
    maxWait = 5235, // In milliseconds, 554 my magic key as high wining ration
    stopped = false,
    fixedHiLo = 0, //0 random, 1 hi fixed, 2 lo fixed
    stopBefore = 5; // In minutes
var accu = 0, contLoseCnt = 0, maxLose = 0, winCnt = 0, loseCnt = 0, winRatio = 0.0, hilo = 1;//1 : hi, 0:lo
var $loButton = $('#double_your_btc_bet_lo_button'), $hiButton = $('#double_your_btc_bet_hi_button');
function multiply(){
  var current = $('#double_your_btc_stake').val();
  var multiply = (current * 2.2).toFixed(8);
  $('#double_your_btc_stake').val(multiply);
}
function getRandomWait(){
  var wait = Math.floor(Math.random() * maxWait ) + 100;
  // console.log('Waiting for ' + wait + 'ms before next bet.');
  return wait ;
}
function getHilo(){
  if(fixedHiLo == 1){
    hilo = 1; //hi
  }else if(fixedHiLo == 2){
    hilo = 0; //lo
  }else {
    hilo = Math.floor(Math.random() * 2);//random
  }
  return hilo ;
}
function rollDice(){
  console.log('Game started!');
  reset();
  if (getHilo() == 1) {
    $hiButton.trigger('click');
  } else {
    $hiButton.trigger('click');
  }
}
function stopGame(){
  console.log('IAN M TAMVAN MAX :-).');
  stopped = true;
}
function reset(){
  $('#double_your_btc_stake').val(startValue);
}
// quick and dirty hack if you have very little bitcoins like 0.0000001
function deexponentize(number){
  return number * 1000000;
}
function iHaveEnoughMoni(){
  var balance = deexponentize(parseFloat($('#balance').text()));
  var current = deexponentize($('#double_your_btc_stake').val());
  // console.log("balance : "+balance);console.log("current : "+current);
  return ((balance*2)/100) * (current*2) > stopPercentage/100;
}
function stopBeforeRedirect(){
  var minutes = parseInt($('title').text());
  if( minutes < stopBefore ) {
    console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
    stopGame();
    return true;
  }
  return false;
}
// Unbind old shit
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();
// Loser
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){
  if( $(event.currentTarget).is(':contains("lose")') )
  {
    maxLose += 1;
    loseCnt += 1;
    if(maxLose > contLoseCnt) {contLoseCnt = maxLose;}
    winRatio = ((winCnt / (winCnt+loseCnt))*100).toFixed(2);
    accu -= parseFloat($('#double_your_btc_stake').val());
    console.log('Stop Lose Bangke!'+' cumulative : '+(accu).toFixed(8)+' odds : '+winRatio+'%'+' cont lose : '+contLoseCnt);
    multiply();
    if (getHilo() == 1) {
      setTimeout(function(){
              $loButton.trigger('click');
      }, getRandomWait());
    } else {
      setTimeout(function(){
              $hiButton.trigger('click');
      }, getRandomWait());
    }
  }
});
// Winner
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
  if( $(event.currentTarget).is(':contains("win")') ) {
    if( stopBeforeRedirect()) {
            return;
    }
    maxLose = 0 ;
    accu += parseFloat($('#double_your_btc_stake').val());
    if( iHaveEnoughMoni()) {
            winCnt += 1;
            winRatio = ((winCnt / (winCnt+loseCnt))*100).toFixed(2);
            console.log('Ian M TamVan'+' cumulative : '+(accu).toFixed(8)+' odds : '+winRatio+'%'+' cont lose : '+contLoseCnt);
            reset();
            if( stopped) {
                    stopped = false;
                    return false;
            }
    } else {//reset
            winCnt += 1;
            winRatio = ((winCnt / (winCnt+loseCnt))*100).toFixed(2);
            console.log('Ian M TamVan Total'+' cumulative : '+(accu).toFixed(8)+' odds : '+winRatio+'%'+' cont lose : '+contLoseCnt);
            winCnt = 0, loseCnt = 0, winRatio = 0.0;
    }
    if (getHilo() == 1) {
      setTimeout(function(){
              $loButton.trigger('click');
      }, getRandomWait());
      //hilo = 0;
    }else {
      setTimeout(function(){
              $hiButton.trigger('click');
      }, getRandomWait());
      //hilo = 1;
    }
  }
});rollDice();
})();