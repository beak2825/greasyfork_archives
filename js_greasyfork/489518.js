// ==UserScript==
// @name         MRPG - Map Custom Location Saver
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  try to take over the world!
// @author       You
// @match        https://mrpg.io/map/*
// @icon         https://mrpg.io/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489518/MRPG%20-%20Map%20Custom%20Location%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/489518/MRPG%20-%20Map%20Custom%20Location%20Saver.meta.js
// ==/UserScript==

// CUSTOMISE THESE
let customLocations = [
    {"y":2796,"x":924,"text":"Mountain Peak","id":"0"},
    {"y":1841,"x":3445,"text":"Wraith Dungeon","id":"1"},
    {"y":1675,"x":1807,"text":"Feitoria Sewers","id":"2"},
];

// DON'T TOUCH
let changed = false;

let existingIDs = new Set();
let existingLocations = localStorage.getItem('customMarkers');
existingLocations = JSON.parse(existingLocations) || [];
existingLocations.forEach(existingLocation => existingIDs.add(existingLocation.id));

customLocations.forEach(customLocation => {
    let existingLocationIndex = existingLocations.findIndex(loc => loc.id === customLocation.id);
    if (existingLocationIndex !== -1) {
        let existingLocation = existingLocations[existingLocationIndex];
        if (existingLocation.x !== customLocation.x || existingLocation.y !== customLocation.y || existingLocation.text !== customLocation.text) {
            changed = true;
            console.log("Updating", customLocation.text);
            existingLocations[existingLocationIndex] = customLocation;
        }
    } else {
        changed = true;
        console.log("Adding", customLocation.text);
        existingLocations.push(customLocation);
    }
});

if (changed) {
    localStorage.setItem('customMarkers', JSON.stringify(existingLocations));
    location.reload();
}
