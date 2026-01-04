// ==UserScript==
// @version      1.2
// @author       Abdallah Elroby
// @match        https://freebitco.in/*
// @name         Freebitco.in Multiply your bitcoins every 3 days free 2020
// @namespace    https://greasyfork.org/en/users/470639
// @description  Best Proven Script for multiplying your balance every 3 days
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/398869/Freebitcoin%20Multiply%20your%20bitcoins%20every%203%20days%20free%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/398869/Freebitcoin%20Multiply%20your%20bitcoins%20every%203%20days%20free%202020.meta.js
// ==/UserScript==

var startValue = "0.00000001",
  stopPercentage = 0.0001,
  maxWait = 777,
  stopped = false,
  stopBefore = 1,
  startLoss = 5,
  losses = 0,
  baseMultiply = 0.00000256; // This should be your balance * 0.00021 at least to insure it doesn't consume your balance
var $loButton = $("#double_your_btc_bet_lo_button"),
  $hiButton = $("#double_your_btc_bet_hi_button");
function multiply() {
  var current = $("#double_your_btc_stake").val();
  if (current < baseMultiply) {
    current = baseMultiply;
  }
  var multiply = (current * 2).toFixed(8);
  $("#double_your_btc_stake").val(multiply);
}
function getRandomWait() {
  var wait = Math.floor(Math.random() * maxWait) + 100;
  console.log("Waiting for " + wait + "ms before next bet.");
  return wait;
}
function startGame() {
  console.log("Game started!");
  reset();
  $hiButton.trigger("click");
}
function stopGame() {
  console.log("Game will stop soon! Let me finish.");
  stopped = true;
}
function reset() {
  losses = 0;
  $("#double_your_btc_stake").val(startValue);
}
function deexponentize(number) {
  return number * 10000000;
}
function iHaveEnoughMoni() {
  var balance = deexponentize(parseFloat($("#balance").text()));
  var current = deexponentize($("#double_your_btc_stake").val());
  return ((balance * 2) / 100) * (current * 2) > stopPercentage / 100;
}
function stopBeforeRedirect() {
  var minutes = parseInt($("title").text());
  if (minutes < stopBefore) {
    console.log(
      "Approaching redirect! Stop the game so we don't get redirected while loosing."
    );
    stopGame();
    return true;
  }
  return false;
}
$("#double_your_btc_bet_lose").unbind();
$("#double_your_btc_bet_win").unbind();
$("#double_your_btc_bet_lose").bind("DOMSubtreeModified", function(event) {
  if ($(event.currentTarget).is(':contains("lose")')) {
    losses++;
    if (losses >= startLoss) {
      console.log("You LOST! Multiplying your bet and betting again.");
      multiply();
    }
    setTimeout(function() {
      $hiButton.trigger("click");
    }, getRandomWait());
  }
});
$("#double_your_btc_bet_win").bind("DOMSubtreeModified", function(event) {
  if ($(event.currentTarget).is(':contains("win")')) {
    if (stopBeforeRedirect()) {
      return;
    }
    if (iHaveEnoughMoni()) {
      console.log("You WON! But don't be greedy. Restarting!");
      reset();
      if (stopped) {
        stopped = false;
        return false;
      }
    } else {
      console.log("You WON! Betting again");
    }
    setTimeout(function() {
      $hiButton.trigger("click");
    }, getRandomWait());
  }
});
startGame();