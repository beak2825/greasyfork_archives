// ==UserScript==
// @name         Melee PurpleFox Extract
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Extract information about the current Melee round, and format it for PurpleFox.
// @author       Dan Collins <dcollins@batwing.tech>
// @author       Aurélie Violette
// @website      https://github.com/dcollinsn/melee-tampermonkey
// @match        https://mtgmelee.com/Tournament/Control/*
// @match        https://melee.gg/Tournament/Control/*
// @icon         https://eor-us.purple-fox.fr/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/465540/Melee%20PurpleFox%20Extract.user.js
// @updateURL https://update.greasyfork.org/scripts/465540/Melee%20PurpleFox%20Extract.meta.js
// ==/UserScript==

function extractResult() {
    const result = [];
    document.querySelectorAll("#tournament-player-pairings-table tbody tr").forEach((row) => {
        const tableColumn = row.querySelector(".TableNumber-column")?.innerText;
        const tableNumber = tableColumn && parseInt(tableColumn);
        if (tableColumn && tableNumber && !isNaN(tableNumber)) {
            const tableResult = row.querySelector(".AdminResultString-column")?.innerText;
            const playerNames = row.querySelectorAll(".Teams-column .match-table-team-container a");

            const playerName1 = playerNames[0]?.innerText?.trim();
            const playerGameId1 = playerNames[0]?.getAttribute("data-id");
            const playerName2 = playerNames[1]?.innerText?.trim();
            const playerGameId2 = playerNames[1]?.getAttribute("data-id");

            result.push({
                tableNumber,
                playerName1,
                playerGameId1,
                playerName2,
                playerGameId2,
                result: tableResult === "Not reported" ? null : tableResult,
            });
        }
    });
    return result;
}

function doMenuCommand(event) {
    const result = extractResult();
    GM_setClipboard(JSON.stringify(result));
}

(function() {
    'use strict';
    const menu_command_id = GM_registerMenuCommand("PurpleFox Export", doMenuCommand, "e");
})();
