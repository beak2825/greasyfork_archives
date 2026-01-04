// ==UserScript==
// @name         Betsapi
// @namespace    http://tampermonkey.net/
// @version      1.03
// @author       MK
// @match        https://betsapi.com/r/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=betsapi.com
// @grant        none
// @description  Betsapi Winner Alert - Just for fun
// @downloadURL https://update.greasyfork.org/scripts/467967/Betsapi.user.js
// @updateURL https://update.greasyfork.org/scripts/467967/Betsapi.meta.js
// ==/UserScript==

(function() {
    'use strict';
var away = document.querySelectorAll('[class*="team_name text-away"]')[0].textContent;
var home = document.querySelectorAll('[class*="team_name text-home"]')[0].textContent;
var list = document.querySelectorAll('[class="list-group"]')[0].textContent;
var winnerAway = list.match("Map 1 - Winner - " + away)
var winnerHome = list.match("Map 1 - Winner - " + home)
if (winnerAway == "Map 1 - Winner - " + away) {alert("Away team has won")}
if (winnerHome == "Map 1 - Winner - " + home) {alert("Home team has won")}
})();