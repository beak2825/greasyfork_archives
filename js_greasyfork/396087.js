// ==UserScript==
// @name         Steam Filter Games by Geforce NOW Availability/Compatibility
// @namespace    driver8.net
// @version      0.1.3
// @description  Adds a button to Steam Community games list pages (https://steamcommunity.com/id/<user_id>/games/?tab=all) that will filter out all games that are not supported by Geforce NOW, leaving only supported games visible.
// @author       driver8
// @match        *://*.steamcommunity.com/id/*/games*
// @match        *://*.steamcommunity.com/my/games*
// @match        *://*.steamcommunity.com/profiles/*/games*
// @grant        GM.xmlHttpRequest
// @connect      static.nvidiagrid.net
// @downloadURL https://update.greasyfork.org/scripts/396087/Steam%20Filter%20Games%20by%20Geforce%20NOW%20AvailabilityCompatibility.user.js
// @updateURL https://update.greasyfork.org/scripts/396087/Steam%20Filter%20Games%20by%20Geforce%20NOW%20AvailabilityCompatibility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('hi gfn filter');

    let supportedGames = [],
        notSupportedGames = [],
        insAt = document.querySelector('#mainContents > .sectionTabs'),
        newDiv = document.createElement('div');
    var gfnSteamIds = {};

    newDiv.innerHTML = `<a class="sectionTab "><span>Geforce NOW Compatible</span></a>`;
    let newA = newDiv.firstElementChild;
    newA.onclick = () => {
        checkJSON();
        newA.innerHTML = '<span>Filtering...</span>';
        newA.onclick = null;
    };
    insAt.appendChild(newA);

    function filterGames() {
        if (!gfnSteamIds) return;
        let allGameRows = Array.from(document.querySelectorAll('.gameListRow'));
        for (let row of allGameRows) {
            let m = row.id.match(/game_(\d+)/); // steam ID
            let isSupported = m && gfnSteamIds.hasOwnProperty(m[1]);
            (isSupported ? supportedGames : notSupportedGames).push(row);
        }
        for (let div of notSupportedGames) {
            div.style.display = 'none';
        }
        window.dispatchEvent(new Event('resize')); // hacky fix for images not lazy-loading
        console.log('Supported games', supportedGames);
        newA.innerHTML = `<span>${supportedGames.length} games supported by Geforce NOW</span>`;
    }

    function checkJSON() {
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://static.nvidiagrid.net/supported-public-game-list/gfnpc.json",
            reponseType: "JSON",
            onload: function(response) {
                let gfnJSON = JSON.parse(response.responseText);
                console.log('json', gfnJSON);
                for (let game of gfnJSON) {
                    let m = game.steamUrl.match(/\/(\d+)$/i);
                    if (m) {
                        gfnSteamIds[m[1]] = game;
                    }
                }
                filterGames();
            }
        });
    }
})();
