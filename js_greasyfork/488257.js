// ==UserScript==
// @name         creed auto battle
// @namespace    Devinho_
// @version      11
// @description  https://www.youtube.com/@wdevinho_
// @author       Devinho_
// @license      MIT
// @match        https://eclipserpg.com/battle.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokemoncreed.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488257/creed%20auto%20battle.user.js
// @updateURL https://update.greasyfork.org/scripts/488257/creed%20auto%20battle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var battleInterval;
    var battleTimes = 0;

    function selectAttack() {
        var attackButton = document.querySelector('button:contains("Attack")');
        if (attackButton) {
            attackButton.click();
            battleTimes++;
        }
    }

    function restartBattle() {
        var restartButton = document.querySelector('button.button:contains("Restart")');
        if (restartButton) {
            restartButton.click();
            battleTimes = 0;
        }
    }

    function startAutoBattle() {
        battleInterval = setInterval(function() {
            selectAttack();
            if (battleTimes === 2) {
                console.log("Battle times:", battleTimes);
                restartBattle();
            }
        }, 1000);
    }

    // Start auto battle when the page is fully loaded
    window.addEventListener('load', startAutoBattle);

    // Stop auto battle when navigating away from the battle page
    window.addEventListener('beforeunload', function() {
        clearInterval(battleInterval);
    });

})();
