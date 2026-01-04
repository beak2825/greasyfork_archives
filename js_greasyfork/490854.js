// ==UserScript==
// @name         Zigs Marathon Counter
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Silly script for zigs
// @author       You
// @match        https://www.geoguessr.com/challenge/*
// @match        https://www.geoguessr.com/game/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490854/Zigs%20Marathon%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/490854/Zigs%20Marathon%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(getProfile, 3000);
    var gamesPlayed = 0;
    var gamesRemaining = 0;
    var p = document.createElement("p");
    var ele;
    function getProfile() {
        fetch("https://geoguessr.com/api/v3/profiles/stats", {
            method: 'GET',
            credentials: "include"
        })
            .then((response) => response.json())
            .then((json) => gamesPlayed = json.gamesPlayed);
        gamesRemaining = 22867 - gamesPlayed;
        ele = document.getElementsByClassName("status_inner__1eytg");

        p.innerHTML = `<div class=\"status_section__8uP8o\" data-qa=\"score\"><div class=\"ZigCounter\">Games Remaining</div><div class=\"status_value__xZMNY\">${gamesRemaining}</div></div>`;

        if (document.getElementById("ZigCounter")) {
            var e = document.getElementById("ZigCounter");
            e.innerHTML = `<div class=\"status_section__8uP8o\" data-qa=\"score\"><div class=\"ZigCounter\">Games Remaining</div><div class=\"status_value__xZMNY\">${gamesRemaining}</div></div>`;
        }
        else {
            ele[0].appendChild(p)
        }
    }
})();