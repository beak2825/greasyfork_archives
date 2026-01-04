// ==UserScript==
// @name         Alternate timer for eRepublik
// @namespace    https://greasyfork.org/en/users/10060-lisugera
// @version      1.3
// @description  Replaces title with alternate timer that is better than eRepublik's shitty broken timer in the page.
// @author       lisugera
// @match        https://*.erepublik.com/*/military/battlefield/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370431/Alternate%20timer%20for%20eRepublik.user.js
// @updateURL https://update.greasyfork.org/scripts/370431/Alternate%20timer%20for%20eRepublik.meta.js
// ==/UserScript==

var atUrl = "https://www.erepublik.com/en/military/campaigns-new";
var atBattleID = window.location.href.match(/\d+/g)[0];
var atRefreshTimer;
var atBattleTimer;

function secToHR(seconds) {
    var negative = false;
    if (seconds < 0) {
        negative = true;
        seconds = -seconds;
    }
    var secs = seconds % 60;
    var minutes = (seconds - secs) / 60;
    var mins = minutes % 60;
    if(negative) {
        return "-" + mins + ":" + ("0" + secs).slice(-2);
    }
    var hours = (minutes - mins) / 60;
    return (hours + ":" + ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2));
}

function atRun(){
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', atUrl, true);
    req.onload = function() {
        var result = JSON.parse(req.responseText);
        atBattleTimer = result.time - result.battles[atBattleID].start;
        document.title = secToHR(atBattleTimer);
        atRefreshTimer = setInterval(function() {
            document.title = secToHR(++atBattleTimer);
        }, 1000);
    };
    req.send(null);
    setTimeout(function() {
        clearInterval(atRefreshTimer);
        atRun();
    },
    20000);
}

atRun();