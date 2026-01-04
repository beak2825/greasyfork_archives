// ==UserScript==
// @name         Grepolis Discord Integratie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Integreren van Grepolis met Discord
// @author       boodtrap
// @match        https://*.grepolis.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/517885/Grepolis%20Discord%20Integratie.user.js
// @updateURL https://update.greasyfork.org/scripts/517885/Grepolis%20Discord%20Integratie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Functie om gegevens naar je server (of een Discord API) te sturen
    function sendDataToDiscord(data) {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'http://jouw-server.com/notify', // URL van je server die communiceert met de Discord bot
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log('Gegevens naar Discord gestuurd: ', response.responseText);
            }
        });
    }

    // Voeg een eenvoudige gebeurtenis toe (bijvoorbeeld het winnen van een gevecht)
    // Je kunt deze logica aanpassen op basis van gebeurtenissen die je in Grepolis wilt volgen.
    let winButton = document.querySelector('#battle-result-win-button'); // pas dit aan op de juiste ID
    if (winButton) {
        winButton.addEventListener('click', () => {
            sendDataToDiscord({ event: 'battle_won', details: 'Je hebt gewonnen in Grepolis!' });
        });
    }
})();
