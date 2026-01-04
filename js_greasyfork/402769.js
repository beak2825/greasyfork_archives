// ==UserScript==
// @version      0.0.1 (04/05/2020)
// @author       N/A
// @match        N/A
// @name         10k x3
// @namespace    0.3.2
// @description  0.0.1
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/402769/10k%20x3.user.js
// @updateURL https://update.greasyfork.org/scripts/402769/10k%20x3.meta.js
// ==/UserScript==

var startValue = '0.00000011', // Don't lower the decimal point more than 4x of current balance
    stopPercentage = 0.0001, // In %. I wouldn't recommend going past 0.08 and initial per 0.0001
    stopLossVal = '1.00005000',//stop loss value
	stopWinVal = '0.00030000',//stop loss value
    stopped = false,
//    fixedHiLo = 0, //0 random, 1 hi fixed, 2 lo fixed
    stopBefore = 5; // In minutes
var accu = 0, contLoseCnt = 0, maxLose = 0, winCnt = 0, loseCnt = 0, winRatio = 0.0, hilo = 1;//1 : hi, 0:lo
var $loButton = $('#double_your_btc_bet_lo_button'), $hiButton = $('#double_your_btc_bet_hi_button');
var balance_one = 0;
document.getElementById("disable_animation_checkbox").checked = true;
function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
function client_seed() {
  var text = document.getElementById("next_server_seed_hash").value;
  var text_change = text.substr(Random_integer(0,text.length/2), text.length - 1);
  document.getElementById("next_client_seed").value = text_change;
  //console.log("client_seed(): " + text_change);
}
function multiply(){
  var current = $('#double_your_btc_stake').val();
  var multiply = (current * 1.12).toFixed(8);
  $('#double_your_btc_stake').val(multiply);
}
function getRandomWait(){
  var wait = 4047;
  // console.log('Waiting for ' + wait + 'ms before next bet.');
  return wait ;
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
  document.getElementById("double_your_btc_payout_multiplier").value = "1.01";
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
	balance_one = parseFloat(document.getElementById("balance2").innerHTML);
	console.log("balance: " + balance_one);
	if(balance_one > stopWinVal)
		return;
	client_seed();
    maxLose += 1;
    loseCnt += 1;
    if(maxLose > contLoseCnt) {contLoseCnt = maxLose;}
    winRatio = ((winCnt / (winCnt+loseCnt))*100).toFixed(2);
    accu -= parseFloat($('#double_your_btc_stake').val());
    console.log('Stop Lose Bangke!'+' cumulative : '+(accu).toFixed(8)+' odds : '+winRatio+'%'+' cont lose : '+contLoseCnt);
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
      }, getRandomWait());
    } else {
      document.getElementById("double_your_btc_payout_multiplier").value = "10";
      setTimeout(function(){
              var random2 = getRandomInt(2);
               if (random2 == 0) {
                   $loButton.trigger('click');
               } else {
                   $hiButton.trigger('click');
               }
      }, getRandomWait());
    }
	
	
  }
});


// Winner
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
  if( $(event.currentTarget).is(':contains("win")') ) {
	balance_one = parseFloat(document.getElementById("balance2").innerHTML);
	console.log("balance: " + balance_one);
	if(balance_one > stopWinVal)
		return;
    client_seed();
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