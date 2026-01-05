// ==UserScript==
// @name         CSGO Double bot By TechnoManiac98 @ Nulled.io 
// @namespace    http://steamcommunity.com/id/technomaniac98/
// @version      0.1
// @description  try to take over the world!
// @author       TechnoManiac98
// @match        http://steamcommunity.com/id/technomaniac98/
// @grant        none
// @include      http://www.csgodouble.com/index.php
// @include      http://www.csgodouble.com/*
// @include      http://www.csgodouble.com
// @downloadURL https://update.greasyfork.org/scripts/15782/CSGO%20Double%20bot%20By%20TechnoManiac98%20%40%20Nulledio.user.js
// @updateURL https://update.greasyfork.org/scripts/15782/CSGO%20Double%20bot%20By%20TechnoManiac98%20%40%20Nulledio.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// CONFIG ////////////////
var initialBetAmount = 50;
var mode = 'martingale'; // can be 'martingale' or 'anti-martingale' (WAT? https://en.wikipedia.org/wiki/Martingale_(betting_system) )
var betColor = 'red';    // can be 'red' or 'black'
//////////////////////////

function tick(){var a=getStatus();if(a!==lastStatus&&"unknown"!==a){switch(a){case"waiting":bet();break;case"rolled":rolled()}lastStatus=a,printInfo()}}function checkBalance(){return getBalance()<currentBetAmount?(console.warn("BANKRUPT! Not enough balance for next bet, aborting."),clearInterval(refreshIntervalId),!1):!0}function printInfo(){var a=" \nStatus: "+lastStatus+"\nRolls played: "+currentRollNumber+"\nInitial bet amount: "+initialBetAmount+"\nCurrent bet amount: "+currentBetAmount+"\nLast roll result: "+(null===wonLastRoll()?"-":wonLastRoll()?"won":"lost");console.log(a)}function rolled(){return"anti-martingale"===mode?void antiMartingale():(martingale(),void currentRollNumber++)}function antiMartingale(){currentBetAmount=wonLastRoll()?2*currentBetAmount:initialBetAmount}function martingale(){currentBetAmount=wonLastRoll()?initialBetAmount:2*currentBetAmount}function bet(){checkBalance()&&(setBetAmount(currentBetAmount),setTimeout(placeBet,50))}function setBetAmount(a){$betAmountInput.val(a)}function placeBet(){return"red"===betColor?($redButton.click(),void(lastBetColor="red")):($blackButton.click(),void(lastBetColor="black"))}function getStatus(){var a=$statusBar.text();if(hasSubString(a,"Rolling in"))return"waiting";if(hasSubString(a,"***ROLLING***"))return"rolling";if(hasSubString(a,"rolled")){var b=parseInt(a.split("rolled")[1]);return lastRollColor=getColor(b),"rolled"}return"unknown"}function getBalance(){return parseInt($balance.text())}function hasSubString(a,b){return a.indexOf(b)>-1}function getColor(a){return 0==a?"green":a>=1&&7>=a?"red":"black"}function wonLastRoll(){return lastBetColor?lastRollColor===lastBetColor:null}var currentBetAmount=initialBetAmount,currentRollNumber=1,lastStatus,lastBetColor,lastRollColor,$balance=$("#balance"),$betAmountInput=$("#betAmount"),$statusBar=$(".progress #banner"),$redButton=$("#panel1-7 .betButton"),$blackButton=$("#panel8-14 .betButton"),refreshIntervalId=setInterval(tick,500);