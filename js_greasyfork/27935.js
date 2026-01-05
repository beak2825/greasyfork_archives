// ==UserScript==
// @name        FreeBitco.in auto bet
// @namespace   org.vaurelios.freebtc.autobet
// @description Auto Bet in FreeBitco.in
// @include     https://freebitco.in
// @include     https://freebitco.in/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27935/FreeBitcoin%20auto%20bet.user.js
// @updateURL https://update.greasyfork.org/scripts/27935/FreeBitcoin%20auto%20bet.meta.js
// ==/UserScript==

console.log("AutoBetJS running...");

// Main code
function multiply() {
    var a = $("#double_your_btc_stake").val(),
        b = (2 * a).toFixed(8);
    $("#double_your_btc_stake").val(b)
}

function getRandomWait() {
    var a = Math.floor(Math.random() * maxWait) + 100;
    return console.log("Waiting for " + a + "ms before next bet."), a
}

function startGame() {
    console.log("Game started!"), reset(), $loButton.trigger("click")
}

function stopGame() {
    console.log("Game will stop soon! Let me finish."), stopped = !0
}

function reset() {
    $("#double_your_btc_stake").val(startValue)
}

function deexponentize(a) {
    return 1e7 * a
}

function iHaveEnoughMoni() {
    var a = deexponentize(parseFloat($("#balance").text())),
        b = deexponentize($("#double_your_btc_stake").val());
    return 2 * a / 100 * (2 * b) > stopPercentage / 100
}

function stopBeforeRedirect() {
    var a = parseInt($("title").text());
    return a < stopBefore && (console.log("Approaching redirect! Stop the game so we don't get redirected while loosing."), stopGame(), !0)
}
var startValue = "0.00000001",
    stopPercentage = .001,
    maxWait = 777,
    stopped = !1,
    stopBefore = 1,
    $loButton = $("#double_your_btc_bet_lo_button"),
    $hiButton = $("#double_your_btc_bet_hi_button");
$("#double_your_btc_bet_lose").unbind(), $("#double_your_btc_bet_win").unbind(), $("#double_your_btc_bet_lose").bind("DOMSubtreeModified", function(a) {
    $(a.currentTarget).is(':contains("lose")') && (console.log("You LOST! Multiplying your bet and betting again."), multiply(), setTimeout(function() {
        $loButton.trigger("click")
    }, getRandomWait()))
}), $("#double_your_btc_bet_win").bind("DOMSubtreeModified", function(a) {
    if ($(a.currentTarget).is(':contains("win")')) {
        if (stopBeforeRedirect()) return;
        if (iHaveEnoughMoni()) {
            if (console.log("You WON! But don't be greedy. Restarting!"), reset(), stopped) return stopped = !1, !1
        } else console.log("You WON! Betting again");
        setTimeout(function() {
            $loButton.trigger("click")
        }, getRandomWait())
    }
});

// Create start button
$liStartButton = $('<li/>');
$liStartButton.append($('<a/>').attr('href', '#').text('ST').click(function () {
  startGame();
}));
$ulMenu = $('.top-bar-section').find('ul');
$ulMenu.append($liStartButton);