// ==UserScript==
// @version      0.0.3
// @author       nam.d02th@gmail.com
// @match        https://freebitco.in/*
// @name         aubet Kenzo
// @namespace    0.0.3
// @description  namtt007
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/402349/aubet%20Kenzo.user.js
// @updateURL https://update.greasyfork.org/scripts/402349/aubet%20Kenzo.meta.js
// ==/UserScript==

var startValue = '0.00000002', // Don't lower the decimal point more than 4x of current balance
    stopPercentage = 0.0001, // In %. I wouldn't recommend going past 0.08 and initial per 0.0001
    stopLossVal = '0.00000080',//stop loss value
    stopped = false,
//    fixedHiLo = 0, //0 random, 1 hi fixed, 2 lo fixed
    stopBefore = 3; // 5, In minutes
	
var accu = 0, contLoseCnt = 0, maxLose = 0, winCnt = 0, loseCnt = 0, winRatio = 0.0, hilo = 1;//1 : hi, 0:lo
var $loButton = $('#double_your_btc_bet_lo_button'), $hiButton = $('#double_your_btc_bet_hi_button');
document.getElementById("disable_animation_checkbox").checked = true;

var lowOdd = 1.01 + Math.random() * 0.2; // odds should be from 1.01 -> 1.21
var highOdd = 2.7 + Math.random() * 2.3; // odds should be from 2.7 -> 5.0
var wager = 0;

function multiply(){
  var current = $('#double_your_btc_stake').val();
  var multiply = (current * 1.5).toFixed(8);
  $('#double_your_btc_stake').val(multiply);
}
function getRandomWait(){
  var wait = 1047;
  // console.log('Waiting for ' + wait + 'ms before next bet.');
  return wait ;
}

function getRandomWaitWhenLose(){
  var wait = Random_integer(5047,10096);
  console.log('Waiting for ' + wait + 'ms before next bet.');
  return wait ;
}

function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
}
function onTimerTrigger() {
	var random = getRandomInt(2);
	if (random == 0) {
	$loButton.trigger('click');
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
  document.getElementById("double_your_btc_payout_multiplier").value = lowOdd;
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
  if( minutes != null){
	console.log("stopBeforeRedirect minutes:" + minutes);
  } else {
	console.log("minutes null");
  }
	
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
	if(loseCnt == 1)
	{
		lowOdd = 1.01 + Math.random() * 0.2; // odds should be from 1.01 -> 1.21
		highOdd = 2.7 + Math.random() * 2.3; // odds should be from 2.7 -> 5.0
		console.log("lowOdd: " + lowOdd);
		console.log("highOdd: " + highOdd);
	}
	
    if(maxLose > contLoseCnt) {
		contLoseCnt = maxLose;
	}
    winRatio = ((winCnt / (winCnt+loseCnt))*100).toFixed(2);
    accu -= parseFloat($('#double_your_btc_stake').val());
	wager += parseFloat($('#double_your_btc_stake').val());
    console.log('Stop Lose Bangke!' + ' wager: ' + wager.toFixed(8) +' cumulative : '+(accu).toFixed(8)+' winRatio : '+winRatio+'%'+' cont lose : '+contLoseCnt);
    multiply();
    var stake = document.getElementById("double_your_btc_stake").value;
    if (stake > stopLossVal) {
    reset();
	setTimeout(function(){
              var random1 = getRandomInt(2);
               if (random1 == 0) {
                   $loButton.trigger('click');
               } else {
                   $hiButton.trigger('click');
               }
      }, getRandomWaitWhenLose());
    } else {
	  highOdd = 2.7 + Math.random() * 2.3; // odds should be from 2.7 -> 5.0
      document.getElementById("double_your_btc_payout_multiplier").value = highOdd;
      setTimeout(function(){
              var random2 = getRandomInt(2);
               if (random2 == 0) {
                   $loButton.trigger('click');
               } else {
                   $hiButton.trigger('click');
               }
      }, getRandomWaitWhenLose());
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
	wager += parseFloat($('#double_your_btc_stake').val());
    if( iHaveEnoughMoni()) {
            winCnt += 1;
            winRatio = ((winCnt / (winCnt+loseCnt))*100).toFixed(2);
            console.log('Ian M TamVan' + ' wager: ' + wager.toFixed(8)  +' cumulative : '+(accu).toFixed(8) +' winRatio : '+winRatio+'%'+' cont lose : '+contLoseCnt);
            reset();
            if( stopped) {
                    stopped = false;
                    return false;
            }
    } else {//reset
            winCnt += 1;
            winRatio = ((winCnt / (winCnt+loseCnt))*100).toFixed(2);
            console.log('Ian M TamVan Total' + ' wager: ' + wager.toFixed(8) +' cumulative : '+(accu).toFixed(8)+' winRatio : '+winRatio+'%'+' cont lose : '+contLoseCnt);
            winCnt = 0, loseCnt = 0, winRatio = 0.0;
    }
    setTimeout(function(){
              var random3 = getRandomInt(2);
               if (random3 == 0) {
                   $loButton.trigger('click');
               } else {
                   $hiButton.trigger('click');
               }
			   
      }, getRandomWait());
  }
});
onTimerTrigger();