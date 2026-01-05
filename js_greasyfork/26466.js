// ==UserScript==
// @name         Hide Steam VR Games
// @namespace    http:/ghoulmind.com
// @version      0.1
// @description  Hide all vr games from search result
// @author       greatghoul
// @match        http://store.steampowered.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26466/Hide%20Steam%20VR%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/26466/Hide%20Steam%20VR%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isVRGame(game) {
        return game.querySelector('.htcvive, .oculusrift, .razerosvr') !== null;
    }

    function checkVRGames() {
        var games = document.querySelectorAll('.search_result_row');
        games.forEach(function(game) {
            if (isVRGame(game)) {
                game.remove();
            }
        });
    }

    setInterval(checkVRGames, 500);
})();