// ==UserScript==
// @name         Geoguessr Location Retriever
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Retrieve the location of the current game in Geoguessr
// @author       Your name here
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485209/Geoguessr%20Location%20Retriever.user.js
// @updateURL https://update.greasyfork.org/scripts/485209/Geoguessr%20Location%20Retriever.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getLocation() {
        const locationElement = document.querySelector('.location-name');
        if (locationElement) {
            return locationElement.innerText;
        }
        return null;
    }

    function displayLocation() {
        const location = getLocation();
        if (location) {
            alert(`The location is: ${location}`);
        } else {
            alert('Could not find the location.');
        }
    }

    const button = document.createElement('button');
    button.innerText = 'Get Location';
    button.onclick = displayLocation;

    const toolbar = document.querySelector('.toolbar');
    toolbar.appendChild(button);
})();
