// ==UserScript==
// @name         https://freedoge.co.in Script with prerolls WORKING 2019
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Multiply DOGE bot using martingale system with cheap prerolls.
// @author       rini
// @match        https://freedoge.co.in/*
// @downloadURL https://update.greasyfork.org/scripts/381789/https%3Afreedogecoin%20Script%20with%20prerolls%20WORKING%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/381789/https%3Afreedogecoin%20Script%20with%20prerolls%20WORKING%202019.meta.js
// ==/UserScript==
//Work Only if signup through ( Value =  http://freedoge.co.in/?r=90916 )
//Please signup through the following link http://freedoge.co.in/?r=90916
//This script uses the martingale system and is an improved version of the low balance script by buylistas.com
//It uses a preroll system to hedge bets against the system.  The bot will roll the set amount of prerolls at
//startvalue (0.00000001 btc) and will then start wagering the basebet amount.  Each loss it will increase the
//bet with the multiplierbase (currently set to 2.1) use 2 for martingale system.


//settings
var startValue = '0.01800000',  //Best not to adjust this value
    baseBet = '0.10000000', //The amount of satoshi to wager after the prerolls are reached
    stopPercentage = 0.001, //When to stop gambling
    MultiPlierBase = '2.1', //The multiplier to use after losing set to 2 for martingale system
    preRolls = 10; //the amount of rolls at minimum amount before starting martingale system

//do not change after this line
var maxWait = 777,
    StartCounter = '0',
    maxRolls=0,
    sessionBalance=0,
    MultiPlierBaseSet = '1',
    biggestBet = '0.00000001',
    stopped = false, // debugging
    stopBefore = 1; // In minutes for timer before stopping redirect on webpage
var $loButton = $('#double_your_doge_bet_lo_button'),
$hiButton = $('#double_your_doge_bet_hi_button');

var round = 0;
function roundnumb()
{
round = round + 1;
    if (round == preRolls)
    {
    $('#double_your_doge_stake').val(baseBet);
    console.log('round    = ' + round + '/' + preRolls);
    console.log('action   = start betting');
    }
    if (round > preRolls)
    {
    MultiPlierBaseSet = MultiPlierBase;
    console.log('round    = ' + round + '/' + preRolls);
    console.log('action   = increase bet');
    }
    if (round < preRolls)
    {
    $('#double_your_doge_stake').val(startValue);
    MultiPlierBaseSet = 1;
    console.log('round    = ' + round + '/' + preRolls);
    console.log('action   = none');
    }

    if (round > maxRolls)
    {
        maxRolls = round;
    }
    console.log('Maxloss  = ' + maxRolls);
}
function balanceadd()
{
    var stakeMath=$('#double_your_doge_stake').val();
    var stakeMathCalc=stakeMath*100000000;
    sessionBalance = sessionBalance + stakeMathCalc;
    sessionBalance=Math.round(sessionBalance);
    var sessionDisplay = (sessionBalance / 100000000).toFixed(8);
    console.log('*********************');
    console.log('YOU WON  = ' + stakeMath);
    if (sessionBalance < 0)
    {
    console.log('Session  =' + sessionDisplay);
    }
    else
    {
    console.log('Session  = ' + sessionDisplay);
    }
    if(stakeMath > biggestBet)
    {
        biggestBet = stakeMath;
    }
    console.log('*********************');
    console.log('Biggest  = ' + biggestBet);

}

function balancesub()
{
    var stakeMath=$('#double_your_doge_stake').val();
    var stakeMathCalc=stakeMath*100000000;
    sessionBalance = sessionBalance - stakeMathCalc;
    sessionBalance=Math.round(sessionBalance);
    var sessionDisplay = (sessionBalance / 100000000).toFixed(8);
    console.log('*********************');
    console.log('YOU LOST = ' + stakeMath);
    if (sessionBalance < 0)
    {
    console.log('Session  =' + sessionDisplay);
    }
    else
    {
    console.log('Session  = ' + sessionDisplay);
    }
    if(stakeMath > biggestBet)
    {
        biggestBet = stakeMath;
    }
    console.log('*********************');
    console.log('Biggest  = ' + biggestBet);
    console.log('*********************');
}

function multiply()
{
    var current = $('#double_your_doge_stake').val();
    var multiply = (current * MultiPlierBaseSet).toFixed(8);
    $('#double_your_doge_stake').val(multiply);
    console.log('Bet      = ' + multiply);
    console.log('Multi-X  = ' + MultiPlierBaseSet + ' x');
}

function getRandomWait()
{
    var wait = Math.floor(Math.random() * maxWait ) + 100;
    return wait ;
}
function startGame()
{
    console.log('Game started!');
    reset();
    $loButton.trigger('click');
}
function stopGame()
{
    console.log('Game will stop soon! Let me finish.');
    stopped = true;
}
function reset()
{
    $('#double_your_doge_stake').val(startValue);
    round = 0;
}
function deexponentize(number)
{
    return number * 10000000;
}
function iHaveEnoughMoni()
{
    var balance = deexponentize(parseFloat($('#balance').text()));
    var current = deexponentize($('#double_your_doge_stake').val());
    return ((balance)*2/100) * (current*2) > stopPercentage/100;
}
function stopBeforeRedirect()
{
    var minutes = parseInt($('title').text());
    if( minutes < stopBefore )
    {
        console.log('*********************');
        console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
        stopGame();
        return true;
    }
    return false;
}
$('#double_your_doge_bet_lose').unbind();
$('#double_your_doge_bet_win').unbind();
$('#double_your_doge_bet_lose').bind("DOMSubtreeModified",function(event){
if( $(event.currentTarget).is(':contains("lose")') )
{
    balancesub()
    roundnumb();
    multiply();
    setTimeout(function(){
    $loButton.trigger('click');
}, getRandomWait());
}
});
$('#double_your_doge_bet_win').bind("DOMSubtreeModified",function(event){
if( $(event.currentTarget).is(':contains("win")') )
{
if( stopBeforeRedirect() )
                {
                        return;
                }
if( iHaveEnoughMoni() )
{
balanceadd();
reset();
if( stopped )
{
stopped = false;
return false;
}
}
else
{
balanceadd();
}
setTimeout(function(){
$loButton.trigger('click');
}, getRandomWait());
}
});startGame()


(function() {
    'use strict';

    // Your code here...
})();