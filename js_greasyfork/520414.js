// ==UserScript==
// @name         Player Count Detector Diep.io
// @namespace    http://tampermonkey.net/
// @version      2024-11-22
// @description  Check the current player count
// @author       Comma
// @match        https://diep.io/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/520414/Player%20Count%20Detector%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/520414/Player%20Count%20Detector%20Diepio.meta.js
// ==/UserScript==

(function() {
'use strict';

// HOLD Q TO TOGGLE VISIBILITY
// You can change the key toggle here:
          var keyy = "q"



        var val = "null"
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === keyy.toLowerCase()) {
        event.preventDefault();
    }
});

    var count = document.createElement('div');
    var countt = document.createElement('div');
    var counttt = document.createElement('div');
    var display = false;
    var intervalId = null;

    count.textContent = "Region Count:"
    count.style.position = "relative";
    countt.textContent = "Gamemode Count: ";
    countt.style.position = "relative";
    counttt.textContent = "Player Counter By Comma";
    counttt.style.color = "white";
    counttt.style.position = "relative";
    counttt.style.zIndex = "9999";
    counttt.style.top = "25%";
    counttt.style.left = "50%";
    counttt.style.transform = "translate(-50%, -50%)";
    counttt.style.backgroundColor = "black";
    counttt.style.width = "fit-content";
    counttt.style.height = "fit-content";
    counttt.style.padding = "2vh";
    count.style.fontFamily = "arial"
    countt.style.fontFamily = "arial"
    counttt.style.fontFamily = "arial"
    counttt.style.display = "none";
    counttt.style.borderRadius = "12px";
    counttt.style.boxShadow = '0 0 20px rgba(72, 171, 224, 1), 0 0 40px rgba(72, 171, 224, 0.8)';
    counttt.style.transition = 'box-shadow 0.3s ease';
    counttt.style.letterSpacing = "1.5px";
    document.body.appendChild(counttt);
    counttt.appendChild(count);
    counttt.appendChild(countt);

    let isTabHeldDown = false;

        async function fetchData() {
    if (!display) return;
        var regionn = window.__common__.active_region;
        var gamemode = window.__common__.active_gamemode;
    try {
        console.log('fetched');
        const response = await fetch('https://lb.diep.io/api/lb/pc');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const sydneyRegion = data.regions.find(region => region.region === regionn);
        if (!sydneyRegion) {
            console.log('Region not found');
            return;
        }

        const sydneyPlayers = sydneyRegion.numPlayers;

        const lobbies = sydneyRegion.lobbies;
        const index = lobbies.findIndex(lobby => lobby.gamemode === gamemode);

        if (index !== -1) {
            const sydneyLobby = lobbies[index];
            const numPlayers = sydneyLobby.numPlayers;

            count.textContent = `Region Count: ${sydneyPlayers} ${regionn}`;
            countt.textContent = `${gamemode}: ${numPlayers} Players`;
        } else {
            console.log(`${gamemode} lobby not found.`);
        }
    } catch (error) {
        console.log("Too many fetch requests to api");
    }
}
    var interval; var timeout;
        document.addEventListener('keydown', (event) => {
        if ((event.key === keyy.toLowerCase() || event.key === keyy.toUpperCase()) && !isTabHeldDown) {
            isTabHeldDown = true;
            display = true;
            counttt.style.display = "block";
           fetchData()
            if(val !== null){
          var timeout = setTimeout(function() {
          interval = setInterval(fetchData, 1000);
           }, 1000);
            }
        }
    });
    document.addEventListener('keyup', (event) => {
        if ((event.key === keyy.toLowerCase() || event.key === keyy.toUpperCase()) && isTabHeldDown) {
            isTabHeldDown = false;
            display = false;
            counttt.style.display = "none";
            val = null;
        }
    });
})();