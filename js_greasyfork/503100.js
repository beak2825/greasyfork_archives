// ==UserScript==
// @name         Elo tracker
// @version      0.4.1
// @description  Adds an elo tracker to the GeoGuessr website
// @match        https://www.geoguessr.com/*
// @run-at document-start
// @author       eru
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @namespace https://greasyfork.org/users/1348455
// @downloadURL https://update.greasyfork.org/scripts/503100/Elo%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/503100/Elo%20tracker.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

const API_URL = 'https://ggstats.eu';

let nick = null;
let hexId = null;
let pinUrl = null;
let level = null;
let rating = null;
let moveRating = null;
let noMoveRating = null;
let nmpzRating = null;

function updateElo(data) {
    fetch(API_URL+'/add-elo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => console.log('Success:', data)).catch((error) => console.error('Error:', error));
}

(function() {
    'use strict';

    function startWatching() {

        let titleObserver = new MutationObserver(() => {
            if (document.title === "Ongoing duel - GeoGuessr") {
                fetch('https://www.geoguessr.com/api/v3/profiles')
                .then(response => response.json())
                .then(data => {
                    nick = data.user.nick;
                    hexId = data.user.id;
                    pinUrl = data.user.pin.url;
                    level = parseInt(data.user.br.level);
                    fetch('https://www.geoguessr.com/api/v4/ranked-system/progress/'+hexId)
                    .then(response => response.json())
                    .then(fata => {
                        rating = parseInt(fata.rating);
                        moveRating = parseInt(fata.gameModeRatings.standardDuels);
                        noMoveRating = parseInt(fata.gameModeRatings.noMoveDuels);
                        nmpzRating = parseInt(fata.gameModeRatings.nmpzDuels);
                    })
                    .catch((error) => console.error('Error:', error));
                })
                .catch((error) => console.error('Error:', error));
                titleObserver.disconnect();


                let bodyObserver = new MutationObserver(() => {
                    let targetElement = document.querySelector('div[class*="status-box_gameResult__"]');
                    if (targetElement) {
                        fetch('https://www.geoguessr.com/api/v4/ranked-system/progress/'+hexId)
                        .then(response => response.json())
                        .then(fata => {
                            let newRating = parseInt(fata.rating);
                            const data = {
                                name: nick,
                                playerHexId: hexId,
                                elo: newRating,
                                pinUrl: pinUrl,
                                level: level,
                                mode: null,
                                modeElo: null
                            };
                            let newMoveRating = parseInt(fata.gameModeRatings.standardDuels);
                            let newNoMoveRating = parseInt(fata.gameModeRatings.noMoveDuels);
                            let newNmpzRating = parseInt(fata.gameModeRatings.nmpzDuels);
                            if ((!isNaN(newMoveRating)) && (newMoveRating != moveRating)) {
                                data.mode = 'move';
                                data.modeElo = newMoveRating;
                            }
                            else if ((!isNaN(newNoMoveRating)) && (newNoMoveRating != noMoveRating)) {
                                data.mode = 'nm';
                                data.modeElo = newNoMoveRating;
                            }
                            else if ((!isNaN(newNmpzRating)) && (newNmpzRating != nmpzRating)) {
                                data.mode = 'nmpz';
                                data.modeElo = newNmpzRating;
                            }
                            console.log(data);
                            updateElo(data);
                        })
                        .catch((error) => console.error('Error:', error));
                        bodyObserver.disconnect();
                        startWatching();
                    }
                });

                bodyObserver.observe(document.body, { childList: true, subtree: true });
            }
        });

        titleObserver.observe(document.querySelector('title'), { childList: true });
    }


    startWatching();
})();