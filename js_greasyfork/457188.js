// ==UserScript==
// @name          ADS-B Exchange link to FlightAware
// @description   Look up FlightAware info on an aircraft you're watching on ADS-B Exchange
// @version       0.21
// @namespace	  pony-pasture-aviation/gm-scripts
// @grant         GM.openInTab
// @match         https://globe.adsbexchange.com/*
// @license       GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/457188/ADS-B%20Exchange%20link%20to%20FlightAware.user.js
// @updateURL https://update.greasyfork.org/scripts/457188/ADS-B%20Exchange%20link%20to%20FlightAware.meta.js
// ==/UserScript==

    'use strict';
    let callsignElement = document.getElementById('selected_callsign');
    callsignElement.style.textDecoration = 'underline';
    callsignElement.style.cursor = 'pointer';
    callsignElement.onclick = function(e) {
        GM.openInTab('https://flightaware.com/live/flight/'+callsignElement.textContent, false);
    };
