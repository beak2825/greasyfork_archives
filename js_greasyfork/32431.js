// ==UserScript==
// @name        Chopcoin.io Auto-Faucet
// @namespace   chopcoin.autofaucet
// @description Automatically "clicks" the "Claim free BTC!" button when ready
// @include     https://www.chopcoin.io/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32431/Chopcoinio%20Auto-Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/32431/Chopcoinio%20Auto-Faucet.meta.js
// ==/UserScript==

// Config
var faucetWaitIfAlreadyReady = 15000; // our check first fires while Chopcoin still shows the loading indicator if the countdown is already reached right on login, just to be sure we wait this amount of ms...
var randomWait = {    // ... in case you fear bot detection
    enabled: true,    // boolean
    min: 1,           // seconds
    max: 120          // seconds
};
var debug = false;
// END Config

function isFaucetReady() {
    return faucetTimer.innerHTML.includes("Ready");
}

function isLoggedIn() {
    return !(!!$('#notloggedin').length);
}

function isSessionExpired() {
    return $('span.warning').text().includes("not logged in");
}

function closeCongrats() {
    $('span.winnings_btc').text("0"); // the api itself doesn't reset it, but we want to be sure we don't double-add winnings
    $('.winningsclose').click();
}

function getWonBtc() {
    return Number($('span.winnings_btc').text());
}

function timerTextToMillisecs() {
    var millisecs;
    
    if (isFaucetReady()) {
        if (debug) console.debug("timerTextToMillisecs() - faucet already ready, returning " + faucetWaitIfAlreadyReady + "ms [config var faucetWaitIfAlreadyReady]");
        millisecs = faucetWaitIfAlreadyReady;
    }
  
    var arr = faucetTimer.innerHTML.split(":");
    millisecs = ( (parseInt(arr[0])*60*60) + (parseInt(arr[1])*60) + parseInt(arr[2]) ) * 1000;
    if (debug) console.debug("timerTextToMillisecs() - returning " + millisecs + "ms");
  
    return (randomWait.enabled) ? millisecs + (getRandomInt(randomWait.min, randomWait.max) * 1000) : millisecs;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function scheduleFaucetLoop() {
    var nextCheckTimer = timerTextToMillisecs() + 500; // we add 500ms to be sure
    if (debug) console.debug("scheduleFaucetLoop() - scheduling faucetLoop() for " + nextCheckTimer/1000 + "s from now on");
    if (faucetLoopTimeout !== null) {
        clearTimeout(faucetLoopTimeout);
    }
  
    faucetLoopTimeout = setTimeout(faucetLoop, nextCheckTimer); 
}

function faucetLoop() {
    if (isSessionExpired()) {
        console.error("Your session expired, deactivating. Please reload the page after logging in again");
        if (faucetLoopTimeout !== null) {
            clearTimeout(faucetLoopTimeout);
        }
        return;
    }
    
    if (isFaucetReady()) {
        if (debug) console.info("faucetLoop() found a ready faucet");
        $('.timer').parent()[0].click();
        setTimeout(function() {
            scheduleFaucetLoop();
            totalWinnings += getWonBtc();
            console.info("Got " + formatBtc(getWonBtc()) + " BTC, total winnings in this session: " + formatBtc(totalWinnings) + " BTC");
            closeCongrats();
        }, 2000); //@todo: somehow check for api completion instead of "wait-and-pray"
    } else {
        if (debug) console.info("faucetLoop() found a non-ready faucet, rescheduling faucetLoop");
        scheduleFaucetLoop();
    }
}

function formatBtc(val) {
    return val.toFixed(8);
}

var faucetLoopTimeout = null;
var faucetTimer = null;
var totalWinnings = 0.00000000;
// window.open = function(a,b,c) {}; // triggers "f.open(...) is undefined" in game.js on faucet click 
document.addEventListener("DOMContentLoaded", function() { // Let the circle of life begin...
    faucetTimer = document.getElementsByClassName("timer")[0];
    if (isLoggedIn()) {
        var firstCheckTimeout = timerTextToMillisecs();
        if (debug) console.debug("DOMContentLoaded fired, running first check in " + firstCheckTimeout/1000 + "s"); //You are not logged in, only registered users can claim the faucet...
        setTimeout(faucetLoop, firstCheckTimeout); 
    } else {
        console.error("You're not logged in, deactivating. Please reload the page after logging in");
    }
});

console.info("Chopcoin.io Auto-Faucet UserScript loaded and ready to fire!");
if (debug) console.warn("Kaboom! Peng! Pewpew!");
console.info("If you like this UserScript, please consider a small (or large) BTC donation to 1LzdqbzT9XixrKKXACpYMqkbFGKZWcyrEN ;-)");
