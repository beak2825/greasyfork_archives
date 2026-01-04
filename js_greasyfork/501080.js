// ==UserScript==
// @name         Fort Presence
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Fort presence script for The West
// @author       Claw
// @license MIT
// @match        https://*.the-west.ro/game.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501080/Fort%20Presence.user.js
// @updateURL https://update.greasyfork.org/scripts/501080/Fort%20Presence.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(() => {
        console.log("loaded")
        async function getFortProps(fortID) {
            return new Promise((resolve, reject) => {
                Ajax.remoteCallMode('fort_battlepage', 'index', { fort_id: fortID }, function (r) {
                    if (r.error) {
                        console.error(r.error);
                        reject(r.error);
                        return;
                    }
                    resolve(r);
                });
            });
        }

        async function getPresentPlayers(x, y) {
            return new Promise((resolve, reject) => {
                console.log(x,y);
                Ajax.remoteCallMode('players', 'get_data', {x:x,y:y}, function (r) {
                    console.log(r);
                    if (r.error) {
                        console.log(r.error);
                        reject(r.error);
                        return;
                    }
                    resolve(r.players);
                });
            });
        }

        let notificationBattle = document.querySelector('.fort_battle_notification');
        notificationBattle.addEventListener('click', async function(event) {
            var notificationClasses = notificationBattle.getAttribute('class');
            const fortID = notificationClasses.match(/\d+/g)[0];
            console.log(fortID);

            try {
                const fort = await getFortProps(fortID);
                var enroledPlayers = fort.playerlist;
                var fortCoords = fort.fortCoords;

                if (fortCoords) {
                    console.log("coords",fortCoords);
                    var presentPlayers = await getPresentPlayers(fortCoords.x, fortCoords.y);

                    var enroledPlayerNames = enroledPlayers.map(player => player.name);
                    var presentPlayerNames = presentPlayers.map(player => player.name);

                    // Find intersection
                    var alliedPresentPlayers = enroledPlayerNames.filter(name => presentPlayerNames.includes(name));

                    let paragraph = document.createElement('p');
                    paragraph.textContent="La fort: " + alliedPresentPlayers.length;
                    let anchor= document.querySelector('.show_players');
                    anchor.parentElement.insertBefore(paragraph, anchor.nextSibling);
                } else {
                    console.error('Fort coordinates are undefined.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        });
    }, 3000);
})();
