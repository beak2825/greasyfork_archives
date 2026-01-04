// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Create More Games
// @version      1.02
// @description  Creates 3 to 5 games when loaded in, bypassing the 1 game limit. Disable after it's been ran.
// @match        *://www.brick-hill.com/*
// @run-at       document-idle
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhcreatemoregames
// @downloadURL https://update.greasyfork.org/scripts/498263/%5BBrick-Kill%5D%20Create%20More%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/498263/%5BBrick-Kill%5D%20Create%20More%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*-    SETTINGS    -*/

    const Spam_amount = 11 // Number of attempts to make a game, may only make 3-5 games.

    /*-                -*/




    const token = document.querySelector('input[name="_token"]').value;

    const params = new URLSearchParams();
    params.append('name', 'yeah yeah yeah');
    params.append('description', 'yeayeayaeyea');
    params.append('_token', token);

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    function createGames() {
        return fetch("https://www.brick-hill.com/play/create", {
            method: "POST",
            headers: headers,
            body: params.toString()
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
            .catch(error => console.error('Error joining clan:', error));
    }

    Promise.all(Array.from({ length: Spam_amount }, createGames))
        .then(() => console.log('All requests completed'))
        .catch(error => console.error('One or more requests failed:', error));

})();