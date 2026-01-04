// ==UserScript==
// @name         Köppen class helper for GeoGuessr
// @namespace    https://greasyfork.org/users/1486050-osku9
// @author       Osku9
// @version      1.2.6
// @description  Shows Köppen climate class after guess.
// @match        https://www.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @connect      climateapi.scottpinkelman.com
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/vdjkaa7tizol1abvgyo6x4aaxtas
// @downloadURL https://update.greasyfork.org/scripts/540110/K%C3%B6ppen%20class%20helper%20for%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/540110/K%C3%B6ppen%20class%20helper%20for%20GeoGuessr.meta.js
// ==/UserScript==

// test testing. HELLO DOES THE UPDATE FEATURE WORK?
// test result: YAY IT WORKS. Great. Let's go!

(function() {
    'use strict';

    let lastPopupContent = null;

    function createPopup(content) {
        const minimap = document.querySelector('.guess-map_zoomControl___E_vn');
        if (minimap && minimap.offsetParent !== null) return; // Don't show popup when minimap is visible

        const oldPopup = document.getElementById('koppen-popup');
        if (oldPopup) oldPopup.remove();

        const div = document.createElement('div');
        div.id = 'koppen-popup';
        div.style.position = 'fixed';
        div.style.bottom = '155px';
        div.style.right = '65px';
        div.style.backgroundColor = 'rgba(0,0,0,0.85)';
        div.style.color = 'white';
        div.style.padding = '25px';
        div.style.borderRadius = '10px';
        div.style.zIndex = 10000;
        div.style.fontSize = '16px';
        div.style.maxWidth = '480px';
        div.style.lineHeight = '1.5';
        div.innerHTML = content;
        document.body.appendChild(div);
        lastPopupContent = content;
    }

    function removePopup() {
        const popup = document.getElementById('koppen-popup');
        if (popup) popup.remove();
        lastPopupContent = null;
    }

    function getKoppenClass(lat, lng) {
        const apiUrl = `http://climateapi.scottpinkelman.com/api/v1/location/${lat}/${lng}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const koppen = data.return_values[0].koppen_geiger_zone || 'No data';
                        const desc = data.return_values[0].zone_description || 'No description';
                        resolve({koppen, desc});
                    } catch (e) {
                        resolve({koppen: 'Error', desc: 'Köppen API error or invalid response'});
                    }
                },
                onerror: function() {
                    resolve({koppen: 'Error', desc: 'API request failed'});
                }
            });
        });
    }

    // Custom short description generator
    function koppenDescription(koppen) {
        if (!koppen || koppen.length < 1) return "";

        const first = koppen[0];
        const second = koppen.length > 1 ? koppen[1] : "";
        const third = koppen.length > 2 ? koppen[2] : "";

        let desc = "";
        switch (first) {
            case "A":
                desc = "Tropical";
                break;
            case "B":
                desc = "Arid (dry)";
                break;
            case "C":
                desc = "Temperate";
                break;
            case "D":
                desc = "Cold";
                break;
            case "E":
                desc = "Polar";
                break;
            default:
                desc = "Unknown";
        }

        if (first === "B") {
            if (second === "W") desc += ", desert";
            else if (second === "S") desc += ", steppe";
        } else if (first === "E") {
            if (second === "T") desc += ", tundra";
            else if (second === "F") desc += ", frost";
        } else {
            if (second === "f") desc += ", no dry season";
            else if (second === "s") desc += ", dry summer";
            else if (second === "w") desc += ", dry winter";
        }

        if (third) {
            switch (third) {
                case "h":
                    desc += ", hot";
                    break;
                case "k":
                    desc += ", cold";
                    break;
                case "a":
                    desc += ", hot summer";
                    break;
                case "b":
                    desc += ", warm summer";
                    break;
                case "c":
                    desc += ", cold summer";
                    break;
                case "d":
                    desc += ", very cold winter";
                    break;
            }
        }

        return desc.trim();
    }

    async function checkGuess() {
        const gameId = window.location.pathname.split("/game/")[1]?.split("/")[0];
        if (!gameId) return;

        const apiUrl = `https://www.geoguessr.com/api/v3/games/${gameId}`;

        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('API error ' + res.status);
            const data = await res.json();

            const guesses = data.player?.guesses || [];
            if (guesses.length === 0) return;

            const roundIndex = guesses.length - 1;
            const rounds = data.rounds || [];
            if (roundIndex >= rounds.length) return;

            const round = rounds[roundIndex];
            const guess = guesses[roundIndex];

            const [roundKoppen, guessKoppen] = await Promise.all([
                getKoppenClass(round.lat, round.lng),
                getKoppenClass(guess.lat, guess.lng)
            ]);

            const popupContent =
                `<b>Correct location:</b><br>` +
                `${roundKoppen.koppen} — ${koppenDescription(roundKoppen.koppen)}<br><br>` +
                `<b>Your guess:</b><br>` +
                `${guessKoppen.koppen} — ${koppenDescription(guessKoppen.koppen)}`;

            const popup = document.getElementById('koppen-popup');
            if (!popup || lastPopupContent !== popupContent) {
                createPopup(popupContent);
            }
        } catch(e) {
            console.error(e);
        }
    }

    let lastGuessCount = 0;
    setInterval(async () => {
        const gameId = window.location.pathname.split("/game/")[1]?.split("/")[0];
        if (!gameId) return;

        const apiUrl = `https://www.geoguessr.com/api/v3/games/${gameId}`;
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error('API error ' + res.status);
            const data = await res.json();

            const guesses = data.player?.guesses || [];
            if (guesses.length > lastGuessCount) {
                lastGuessCount = guesses.length;
                await checkGuess();
            }
        } catch(e) {
            // Silent failure, no popup spam
        }
    }, 5000);

    setInterval(() => {
        const minimap = document.querySelector('.guess-map_zoomControl___E_vn');
        const popup = document.getElementById('koppen-popup');

        if (minimap && minimap.offsetParent !== null) {
            if (popup) removePopup();
        } else {
            if (!popup) {
                checkGuess();
            }
        }
    }, 500);

})();
