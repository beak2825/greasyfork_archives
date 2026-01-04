// ==UserScript==
// @name         GEM PurpleFox Extract
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Extract information about the current GEM round, and format it for PurpleFox.
// @author       Dan Collins <dcollins@batwing.tech>
// @author       Aurélie Violette
// @website      https://github.com/dcollinsn/gem-tampermonkey
// @match        https://gem.fabtcg.com/gem/*/run/*/report/
// @icon         https://eor-us.purple-fox.fr/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/465536/GEM%20PurpleFox%20Extract.user.js
// @updateURL https://update.greasyfork.org/scripts/465536/GEM%20PurpleFox%20Extract.meta.js
// ==/UserScript==

function extractResult() {
    const PLAYER_REGEXP = /^\s+(.+) \((\d+)\)/
    const result = [];
    document.querySelectorAll(".match-row").forEach((row) => {
        const cells = row.querySelectorAll(".match-element");
        const [,playerName1 = null, playerGameId1 = null] = cells[1].children[0].innerHTML.match(PLAYER_REGEXP) || []
        const [,playerName2 = null, playerGameId2 = null] = cells[2].children[0].innerHTML.match(PLAYER_REGEXP) || []
        result.push({
            tableNumber: parseInt(cells[0].innerHTML),
            playerName1,
            playerGameId1,
            playerName2,
            playerGameId2,
            result: cells[3].querySelector("select").value || null
        });
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
