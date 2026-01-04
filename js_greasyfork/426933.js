// ==UserScript==
// @name         Ball Sizes + Extra Rounds
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows you to change ball size from -100000000 to 100000000
// @author       MYTH_doglover
// @match        https://supercarstadium.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426933/Ball%20Sizes%20%2B%20Extra%20Rounds.user.js
// @updateURL https://update.greasyfork.org/scripts/426933/Ball%20Sizes%20%2B%20Extra%20Rounds.meta.js
// ==/UserScript==

let ballslider = document.getElementById('newbonklobby_ballsizeslider');
ballslider.type = "text";
ballslider.classList.add("mapeditor_field");
ballslider.classList.add("fieldShadow");
ballslider.classList.remove("compactSlider");
ballslider.max = "100000000";
ballslider.min = "-100000000";

let scorething = document.getElementById('newbonklobby_scorelimitslider');
scorething.type = "text";
scorething.classList.add("mapeditor_field");
scorething.classList.add("fieldShadow");
scorething.classList.remove("compactSlider");
scorething.max = "100000000";
scorething.min = "-100000000";


