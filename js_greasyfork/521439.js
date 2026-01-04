// ==UserScript==
// @name         Blooket Anti-Bot
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Block blots in blooket
// @author       Neonate
// @match        http://*.blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521439/Blooket%20Anti-Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/521439/Blooket%20Anti-Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of known bot usernames or patterns
    const  botUsernames = ['bot1', 'bot2', 'bot3']; // Add more bot usernames or patterns

    // Function to check and block bots
    function blockbots() {
        const players = document.querySelectorAll('.player-name'); //Adjust the selector based on the actual class or ID
        players.forEach(player => {
        const username = player.textContent;
        if (botUsernames.some(bot => username.includes(bot))) {
            console.log( 'Blocking bot: ${username}');
            // Add your  logic to block the bot, e.g., remove the player element
            player.parentElement.remove();
        }
    });
    }

    // Run the blockBots function periodically
    setInterval(blockBots, 5000); // Adjust the interval as needed
})();
