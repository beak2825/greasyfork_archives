// ==UserScript==
// @name         GeoGuessr Wikipedia link
// @namespace    https://greasyfork.org/users/1486050-osku9
// @author       Osku9
// @version      1.4
// @description  Makes it easy to view nearby Wikipedia articles for the correct location after a GeoGuessr round. Made with the Famous Places map in mind.
// @match        https://www.geoguessr.com/*
// @downloadURL https://update.greasyfork.org/scripts/541033/GeoGuessr%20Wikipedia%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/541033/GeoGuessr%20Wikipedia%20link.meta.js
// ==/UserScript==

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
        div.style.fontSize = '14px';
        div.style.maxWidth = '350px';
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

            const lat = round.lat;
            const lng = round.lng;

            const wikiUrl = `https://wikinearby.toolforge.org/?lang=en&q=${lat}%2C${lng}`;

            const popupContent =
                `<b>Wikipedia articles nearby:</b><br>` +
                `<a href="${wikiUrl}" target="_blank" style="color:#00ffff; text-decoration: underline;">${wikiUrl}</a>`;

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
