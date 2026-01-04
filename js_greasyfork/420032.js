// ==UserScript==
// @name         yohoho.io mods
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use keys 1-3 to change your stats, and more. You can actually spend these coins! Good luck shed_modz
// @author       shed_modz_
// @match        yohoho.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420032/yohohoio%20mods.user.js
// @updateURL https://update.greasyfork.org/scripts/420032/yohohoio%20mods.meta.js
// ==/UserScript==

var username = document.getElementById('username');
username.placeholder = "Made By shed_modz_";
username.maxlength = 99999;

//kills
var lastkillsa = document.getElementById('last-kills');
var bestkillsa = document.getElementById('best-kills');
var totalkillsa = document.getElementById('totalkills');

//score
var lastscorea = document.getElementById('last-score');
var bestscorea = document.getElementById('best-score');
var totalscorea = document.getElementById('total-score');

//time survived
var lastgametimea = document.getElementById('last-game-time');
var bestgametimea = document.getElementById('best-game-time');
var totalgametimea = document.getElementById('total-game-time');

//ui/other style...
var skinbtna = document.getElementById('skin-button');
var playbtna = document.getElementById('play-button');

var homepagebooty = document.getElementById('homepage-booty');

window.onbeforeunload = function() {
    localStorage.coinsOwned = 999999999;
    localStorage.playerXP = 50000;
    localStorage.gamesStarted = 19343;
    localStorage.abBotSkillLevel = 1;
    localStorage.lastGameTime = 134;
    localStorage.length = 500;
    localStorage.totalGameTime = 12349922;
    localStorage.totalKills = 105324;
    localStorage.totalScore = 6783632;
    localStorage.totalWins = 32967;
};
window.onload = function() {
    localStorage.getItem('coinsOwned');
    localStorage.getItem('playerXP');
    localStorage.getItem('length');
    localStorage.getItem('abBotSkillLevel');
};

window.addEventListener("keydown", mod, false);

function mod(i) {
    //kill stats
    if(i.keyCode === 49) {//key one
        var lastkills = window.prompt("Set your last kills to");
        lastkillsa.innerHTML = lastkills;
        var bestkills = window.prompt("Set your best kills to");
        bestkillsa.innerHTML = bestkills;
        var totalkills = window.prompt("Set your total kills to");
        totalkillsa.innerHTML = totalkills;
        localStorage.length = 100;
    }
    //score stats
    if(i.keyCode === 50){
        var lastscore = window.prompt("Set your last score/loot to");
        lastscorea.innerHTML = lastscore;
        var bestscore = window.prompt("Set your best score/loot to");
        bestscorea.innerHTML = bestscore;
        var totalscore = window.prompt("Set your best score/loot to");
        totalscorea.innerHTML = totalscore; 
    }
}