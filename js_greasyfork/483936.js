// ==UserScript==
// @name         Coliseum Familiar Collection Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add icons beside the monsters in Stages in the Game Database if the user owns them.
// @author       floppa2k2
// @match        https://www1.flightrising.com/game-database/stage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483936/Coliseum%20Familiar%20Collection%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/483936/Coliseum%20Familiar%20Collection%20Tracker.meta.js
// ==/UserScript==


// Your player ID here (in your clan profile URL).
const PLAYER_ID = 000000;

// Check your Bestiary for your ownership status of each monster's corresponding familiar. 
async function checkIfFamiliarOwned(monsterName) {
    const BESTIARY_URL = encodeURI('https://www1.flightrising.com/bestiary/'+PLAYER_ID+'?view=all&name='+monsterName);

    const data = await $.get(BESTIARY_URL);
    const familiars = $(data).find('.bestiary-familiar');

    for (var familiar of familiars) {
        const familiarName = $(familiar).find('.bestiary-familiar-name').text().trim();
        const familiarIcons = $(familiar).find('.bestiary-icons').html();

        if (familiarName === monsterName) {
            return familiarIcons;
        }
    }
    return null;
}

// Insert the hoard/lair collection icons from the Bestiary into the database page.
async function labelFamiliars() {
    const MONSTER_LINKS = $('.common-plain-table > tbody > tr > td > a');
    var iconPromises = [];

    for (var monsterLink of MONSTER_LINKS) {
        const monsterName = monsterLink.text.trim();
        iconPromises.push(checkIfFamiliarOwned(monsterName));
    }

    Promise.all(iconPromises).then((familiarIcons) => {
        Object.values(MONSTER_LINKS).forEach((link, index) => {
            $(link).append(familiarIcons[index]);
        });
    });
}

$(document).ready(function() {
    labelFamiliars();
});