// ==UserScript==
// @name         Twitch ChannelPoints Autoclaim
// @version      0.2.1
// @description  Automate claiming of bonus chests
// @author       Evanito
// @include      *://*.twitch.tv/*
// @namespace    https://github.com/Evanito/twCPAuto
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/496490/Twitch%20ChannelPoints%20Autoclaim.user.js
// @updateURL https://update.greasyfork.org/scripts/496490/Twitch%20ChannelPoints%20Autoclaim.meta.js
// ==/UserScript==
// TO USE: automatically starts when watching a stream with userpoints, triggers once every 5 seconds <-----

// ==== SETTINGS ====
var autoRun = true;
var retries = -1; // Amount of cycles to try and load your points balance before giving up.
// == END SETTINGS ==

// Do not edit below this line!
// ==========================================
var balance = -1;
var balanceSet = false;
(function() {
    console.log(timeString() + " [CPA] Begin ChannelPoints Autoclaim by Evanito.");
    if (autoRun) {
        console.log(timeString() + " [CPA] Running...");
        run();
    }
})();

function run() {
    clickChest();
    var oldBalance = balance;
    balance = getBalance();
    if (balance > -1) {balanceSet = true; retries = 999;}
    if (balance != oldBalance && oldBalance != -1) {
        console.log(timeString() + " [CPA] Balance has changed by: " + (balance - oldBalance));
    }
    if (retries-- > 0 || retries < -1) {
        setTimeout(function(){ run(); }, 5000);
    } else {
        console.log(timeString() + " [CPA] No channel points found. Shutting down.");
    }
}

function clickChest() {
    var plays = document.getElementsByClassName("claimable-bonus__icon");
    for (var i = 0; i < plays.length; i++) {
        plays[i].click();
        console.log(timeString() + " [CPA] Clicked a bonus chest.");
    }
}

function getBalance() { // Returns user's balance as int, or -1 if cannot be found yet.
    var balances = document.getElementsByClassName("tw-tooltip tw-tooltip--align-center tw-tooltip--right");
    var balance = -1;
    if (balances.length >= 3) { // For some reason, the balances div is always third, unless it hasn't loaded.
        try {
            var balanceHTML = balances[2].innerHTML;
            var patt = /\d*,?\d*/;
            var balanceRegEx = patt.exec(balanceHTML)[0];
            balance = parseInt(balanceRegEx.replace(",", ""));
        } catch(err) {
            console.log(timeString() + " [CPA] Couldn't find balance, err: " + err);
        }
    }
    return balance;
}

function getRewards() { // WIP: get objects for each of the rewards for further processing.
    try {
    var rewardBox = document.getElementsByClassName("rewards-list");
    if (rewardBox.length >= 1) {
        var rewards = rewardBox[0].getElementsByClassName("reward-list-item");
        return rewards; // Outputs an array of the reward HTML objects, need to clean this up.
    }
    return -1;
    } catch(err) {
        console.log(timeString() + " [CPA] Error getting channel's rewards. Err: " + err);
        return -1;
    }
}

function timeString() {
    let d = new Date();
    let h = (d.getHours()<10?'0':'') + d.getHours();
    let m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    let s = (d.getSeconds()<10?'0':'') + d.getSeconds();
    let dstr = h + ':' + m + ":" + s;
    return dstr;
}