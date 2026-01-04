// ==UserScript==
// @name         ValorantDropFarmer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Farm twitch drops automatically from your browser
// @author       dinglemyberry#6969
// @match        https://www.twitch.tv/*
// @match        https://player.twitch.tv/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/400540/ValorantDropFarmer.user.js
// @updateURL https://update.greasyfork.org/scripts/400540/ValorantDropFarmer.meta.js
// ==/UserScript==

//Settings DO NOT CHANGE
var clientId = '9nksyt83rj58cafwa8m9nkxb9c5qjq';
//Set the id Twitch uses for the game, for Valorant
var gameId = '516575';
//url for getting first 30 english streams of the game specified in gameId from the Twitch API
var gameStreams = 'https://api.twitch.tv/helix/streams?first=30&language=en&game_id=' + gameId;
var cs = 'current_streamer';
var cg = 'current_game';
var autoRun = true;
var retries = -1; // Amount of cycles to try and load your points balance before giving up.

//Actual Valorant Drops (Finding Valorant Streams & Getting new stream when one goes offline)
(function() {
    'use strict';
    var nbForReload = 0;

    function getHttp(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', url, false);
        xmlHttp.setRequestHeader('Client-ID', clientId);
        xmlHttp.send()
        return JSON.parse(xmlHttp.responseText);
    }

    function tmGet(name) {
        let val = GM_getValue(name);
        if(typeof val == 'undefined') {
            val = '';
        }
        return val;
    }

    function tmSet(name, value) {
        let val = value;
        if(typeof value == 'undefined') {
            val = '';
        }
        GM_setValue(name, val);
    }

    function farmTwitch() {
        console.log(tmGet(cs));
        var streamerName = '';
        //Test if we have a valid streamer saved in TamperMonkey's variable
        if (tmGet(cs) && tmGet(cs) != '') {
            let url = 'https://api.twitch.tv/helix/streams?user_id=' + tmGet(cs);
            let stream = getHttp(url).data;
            console.log(stream);
            if(stream[0] && stream[0].type == 'live') {
                //get the variable game_id which comes from the Twitch API response
                tmSet(cg, stream[0].game_id);
                streamerName = stream[0].user_name;
                console.log(stream[0])
                console.log('this is the current game:' + tmGet(cg));
            } else {
                tmSet(cs, '');
                tmSet(cg, '');
            }
        } else {
            tmSet(cg, '');
        }

        var locationWrong = false;

        if ('/' + streamerName != window.location.pathname) {
            locationWrong = true;
            console.log('location is wrong')
        }

        if (tmGet(cg) != gameId || locationWrong) {
            // choose a streamer
            var streams = getHttp(gameStreams).data;
            if (streams) {
                console.log(streams);
                var validStreams = [];

                for(var i=0; i < streams.length; i++) {
                    let viewerCount = streams[i].viewer_count;

                    if(viewerCount > 100) {
                        validStreams.push(streams[i]);
                    }
                }

                if(validStreams.length) {
                    // define random number from valid streams
                    let rnd = Math.floor(Math.random() * validStreams.length);
                    let sid = validStreams[rnd].user_id;
                    tmSet(cs, sid);
                    console.log('Valid stream is: ' + sid);
                    window.location = 'https://www.twitch.tv/' + validStreams[rnd].user_name;
                } else {
                    // go to the second streamer, if everything was filtered out or the first one if only one stream
                    let mini = Math.min(1, streams.length-1);
                    tmSet(cs, validStreams[mini].user_id);
                    console.log('No valid streams');
                    window.location = 'https://www.twitch.tv/' + streams[mini].user_name;
                }
            }
        } else {
            // reload page every 6th check or about 10 min, since we don't check for errors in the stream
            nbForReload++;
            if(nbForReload >= 6) {
                location.reload();
            } else {
                setTimeout(function(){ location.reload(); }, 600*1000);
            }
        }
    }
    setTimeout(farmTwitch, 1000*10);
})();

//Twitch Channel Points AutoClaiming
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

//Tricking Twitch to think that the stream is never tabbed off
// Try to trick the site into thinking it's never hidden
Object.defineProperty(document, 'hidden', {value: false, writable: false});
Object.defineProperty(document, 'visibilityState', {value: 'visible', writable: false});
Object.defineProperty(document, 'webkitVisibilityState', {value: 'visible', writable: false});
document.dispatchEvent(new Event('visibilitychange'));
document.hasFocus = function () { return true; };

// visibilitychange events are captured and stopped
document.addEventListener('visibilitychange', function(e) {
	e.stopImmediatePropagation();
}, true, true);

// Set the player quality to "Source"
window.localStorage.setItem('s-qs-ts', Math.floor(Date.now()));
window.localStorage.setItem('video-quality', '{"default":"chunked"}');