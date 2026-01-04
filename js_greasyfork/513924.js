// ==UserScript==
// @name        Melvor Idle Unlimited Offline
// @namespace    https://greasyfork.org/en/users/1148791-vuccala
// @icon        http://melvoridle.com/assets/media/main/logo_no_text.png
// @match       https://melvoridle.com/index_game.php*
// @grant       none
// @version     1.0
// @author      Vuccala
// @description Removes the 24hr offline time cap
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/513924/Melvor%20Idle%20Unlimited%20Offline.user.js
// @updateURL https://update.greasyfork.org/scripts/513924/Melvor%20Idle%20Unlimited%20Offline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set up the game context
    function setup(gameContext) {
        gameContext.MAX_OFFLINE_TIME = Infinity;
        loadedLangJson.MENU_TEXT_MAX_OFFLINE_TIME = ' ';
    }

    // Wait for the game context to be available
    const interval = setInterval(() => {
        if (typeof game !== 'undefined' && typeof loadedLangJson !== 'undefined') {
            setup(game);
            clearInterval(interval);
        }
    }, 1000); // Check every second
})();