// ==UserScript==
// @name         Bonk.io Top Hat Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a top hat to all players in Bonk.io
// @author       Studz
// @match        https://bonk.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476986/Bonkio%20Top%20Hat%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/476986/Bonkio%20Top%20Hat%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the CSS for the top hat
    var topHatStyle = `
        .player {
            position: relative;
        }

        .top-hat {
            position: absolute;
            width: 30px;
            height: 20px;
            background-color: black;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
        }
    `;

    // Create a style element and append it to the document
    var styleElement = document.createElement('style');
    styleElement.innerHTML = topHatStyle;
    document.head.appendChild(styleElement);

    // Add a top hat to each player
    var players = document.querySelectorAll('.player');
    players.forEach(function(player) {
        var topHat = document.createElement('div');
        topHat.classList.add('top-hat');
        player.appendChild(topHat);
    });
})();
