// ==UserScript==
// @name           Geoguessr PPS
// @description    Calculates your PPS on Geoguessr
// @author         Octahedron
// @version        1.0.1
// @icon           http://tampermonkey.net/favicon.ico
// @match          https://geoguessr.com/results/*
// @include        https://www.geoguessr.com/results/*
// @grant          none
// @run-at         document-idle
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @namespace https://greasyfork.org/users/824280
// @downloadURL https://update.greasyfork.org/scripts/434831/Geoguessr%20PPS.user.js
// @updateURL https://update.greasyfork.org/scripts/434831/Geoguessr%20PPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        let scoreBoxes = document.getElementsByClassName("results-highscore__guess-cell-score");
        let timeBoxes = document.getElementsByClassName("results-highscore__guess-cell-details");
        let numPlayers = scoreBoxes.length / 6;
        for(let i = 5; i < scoreBoxes.length; i += 6) {
            let score = parseInt(scoreBoxes[i].innerText.replace(/,/g, ''));
            let time = parseInt(timeBoxes[i].innerText.substring(6).replace(/[^0-9]/g, ''));
            timeBoxes[i].innerText += `\n${(score/time).toFixed(2)} PPS`;
            console.log((score / time).toFixed(2));
        }
    }, 1500);

})();