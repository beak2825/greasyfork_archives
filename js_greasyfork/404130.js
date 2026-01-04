// ==UserScript==
// @name         ValorantDropAutomator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  farms twitch drops automatically
// @author       painerp based on ValorantDropFarmer from dinglemyberry#6969 
// @match        https://www.twitch.tv/*
// @match        https://player.twitch.tv/*
// @exclude      https://www.twitch.tv/settings/connections*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/404130/ValorantDropAutomator.user.js
// @updateURL https://update.greasyfork.org/scripts/404130/ValorantDropAutomator.meta.js
// ==/UserScript==

//Settings DO NOT CHANGE
var clientId = '9nksyt83rj58cafwa8m9nkxb9c5qjq';
//Set the id Twitch uses for the game, for Valorant
var gameId = '516575';
//url for getting first 30 english streams of the game specified in gameId from the Twitch API
var gameStreams = 'https://api.twitch.tv/helix/streams?first=30&language=en&game_id=' + gameId;
var autoRun = true;
var retries = -1; // Amount of cycles to try and load your points balance before giving up.
var csid = '';
var csgid = '';
var csname = '';
var ctname = getCookie("name");
var ctfd = '';

if (ctname == "") {
  throw new Error("Exiting - not logged in");
}

//Cookie Helper
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Actual Valorant Drops (Finding Valorant Streams & Getting new stream when one goes offline)
(function() {
  'use strict';
  var nbForReload = 0;

  function getHttp(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false);
    xmlHttp.setRequestHeader('Client-ID', clientId);
    xmlHttp.send();
    return JSON.parse(xmlHttp.responseText);
  }

  function tmGet(name) {
    let val = GM_getValue(name);
    if (typeof val == 'undefined') {
      val = '';
    }
    return val;
  }

  function tmSet(name, value) {
    let val = value;
    if (typeof value == 'undefined') {
      val = '';
    }
    GM_setValue(name, val);
  }
  //Update Array Variables
  function UpdateTMArray() {
    tmSet(ctname, [csid, '', '', '', '', '']);
  }
  //Get Array Variables
  function GetTMArray() {
    let tmp = tmGet(ctname);
    csid = tmp[0];

  }


  function farmTwitch() {
    var resetloc = false;
    //Check for mature Audience:
    var butarr = document.getElementsByClassName("tw-flex-grow-0");
    for (var i = 0; i < butarr.length; i++) {
      if (butarr[i].innerHTML == "Start Watching" || butarr[i].innerHTML == "Anschauen") {
        butarr[i].click();
        console.log("Mature Content Warning Found and clicked!");
      }
    }
    //Check if Drops are enabled
    if (document.getElementsByClassName("drops-campaign-details__drops-success").length == 0) {
      resetloc = true;
      console.log("No Drops Found: resetting");
    } else {
      console.log("Drops Found!");
    }
    //Twitch Site reload on error:
    var errarr = document.getElementsByClassName('content-overlay-gate__allow-pointers');
    if (errarr.length > 0) {
      for (var i = 0; i < errarr.length; i++) {
        if ((errarr[i].innerHTML).includes("Error")) {
          console.log("Error detected: resetting");
          resetloc = true;
        }
      }
    }

    GetTMArray();
    var curloc = window.location.pathname.substr(1);
    if (curloc != "" && !(curloc.includes("/")) && csid != "") {
      let url = 'https://api.twitch.tv/helix/streams?user_id=' + csid;
      let stream = getHttp(url).data;
      console.log(stream);
      if (stream[0] && stream[0].type == 'live') {
        csgid = stream[0].game_id;
        console.log(stream[0]);
        console.log('this is the current game:' + csid);
      } else {
        resetloc = true;
      }
    } else {
      resetloc = true;
    }

    if (csgid != gameId || resetloc) {
      //Check if Modal is open to create new accounts
      if (document.getElementsByClassName("ReactModal__Overlay").length > 0) {
        return;
      }

      // choose a streamer
      var streams = getHttp(gameStreams).data;
      if (streams) {
        console.log(streams);
        var validStreams = [];

        var tmplength = 20;
        if (streams.length < 20) {
          tmplength = streams.length;
        }
        for (var i = 0; i < tmplength; i++) {
          let viewerCount = streams[i].viewer_count;

          if (viewerCount > 100) {
            validStreams.push(streams[i]);
          }
        }

        if (validStreams.length) {
          // define random number from valid streams
          let rnd = Math.floor(Math.random() * validStreams.length);
          csid = validStreams[rnd].user_id;
          UpdateTMArray();
          console.log('Valid stream is: ' + csid);
          window.location = 'https://www.twitch.tv/' + validStreams[rnd].user_name;
        } else {
          // go to the second streamer, if everything was filtered out or the first one if only one stream
          let mini = Math.min(1, streams.length - 1);
          csid = validStreams[mini].user_id;
          UpdateTMArray();
          console.log('No valid streams');
          window.location = 'https://www.twitch.tv/' + streams[mini].user_name;
        }
      }
    } else {
      // reload page every 6th check or about 10 min, since we don't check for errors in the stream
      nbForReload++;
      if (nbForReload >= 6) {
        location.reload();
      } else {
        setTimeout(function() {
          location.reload();
        }, 600 * 1000);
      }
    }
  }
  setTimeout(farmTwitch, 1000 * 20);
})();

//Twitch Channel Points AutoClaiming
var balance = -1;
var balanceSet = false;
(function() {
  console.log(timeString() + " [CPA] Begin ChannelPoints Autoclaim");
  if (autoRun) {
    run();
  }
})();

function run() {
  clickChest();
  var oldBalance = balance;
  balance = getBalance();
  if (balance > -1) {
    balanceSet = true;
    retries = 999;
  }
  if (balance != oldBalance && oldBalance != -1) {
    console.log(timeString() + " [CPA] Balance has changed by: " + (balance - oldBalance));
  }
  if (retries-- > 0 || retries < -1) {
    setTimeout(function() {
      run();
    }, 5000);
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
    } catch (err) {
      console.log(timeString() + " [CPA] Couldn't find balance, err: " + err);
    }
  }
  return balance;
}

function timeString() {
  let d = new Date();
  let h = (d.getHours() < 10 ? '0' : '') + d.getHours();
  let m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  let s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  let dstr = h + ':' + m + ":" + s;
  return dstr;
}

// Try to trick the site into thinking it's never hidden
Object.defineProperty(document, 'hidden', {
  value: false,
  writable: false
});
Object.defineProperty(document, 'visibilityState', {
  value: 'visible',
  writable: false
});
Object.defineProperty(document, 'webkitVisibilityState', {
  value: 'visible',
  writable: false
});
document.dispatchEvent(new Event('visibilitychange'));
document.hasFocus = function() {
  return true;
};

// visibilitychange events are captured and stopped
document.addEventListener('visibilitychange', function(e) {
  e.stopImmediatePropagation();
}, true, true);

// Set the player quality to 160p and disable low latency
window.localStorage.setItem('s-qs-ts', Math.floor(Date.now()));
window.localStorage.setItem('video-quality', '{"default":"160p30"}');
window.localStorage.setItem('lowLatencyModeEnabled', 0);
