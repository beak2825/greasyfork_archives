// ==UserScript==
// @name         Travsport Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Länkar till ATG.se från Travsport.se automatiskt 
// @author       You
// @include      https://sportapp.travsport.se/sportinfo/horse/*
// @include      https://sportapp.travsport.se/race/raceday/*
// @icon         https://www.google.com/s2/favicons?domain=travsport.se
// @grant        none
// @license      MIT   
// @downloadURL https://update.greasyfork.org/scripts/477970/Travsport%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/477970/Travsport%20Redirect.meta.js
// ==/UserScript==

const URL = "https://api.travsport.se/webapi/raceinfo/startlists/organisation/TROT/sourceofdata/SPORT/racedayid/";
const TO_URL = "https://www.atg.se/spel";

const redirect = async (split) => {
    const parts = split[1].split("/");
    const raceID = parts[0];
    const raceNumber = parts[2];


    fetch(URL + raceID)
        .then(response => response.json())
        .then(data => {
        const {raceDayDate, trackName} = data;
        window.location = `${TO_URL}/${raceDayDate}/vinnare/${trackName.toLowerCase()}/lopp${raceNumber}`
    });
}

const attemptToRedirect = () => {
    const split = location.href.split("raceday/ts");

    if (split.length > 1) redirect(split)
}

(function () {
    'use strict';
    attemptToRedirect();
    setInterval(attemptToRedirect, 1000);
})();