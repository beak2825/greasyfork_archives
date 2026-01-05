// ==UserScript==
// @name            eRep Energy Recovery
// @name:ro         Recuperare energie eRep
// @description     Energy recovery for eRebuglik
// @description:ro  Recuperare energie pentru eRebuglik
// @namespace       http://www.linuxmint.ro/
// @version         2.0
// @license         CC BY 4.0
// @author          Nicolae Crefelean
// @include         http*://www.erepublik.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/25388/eRep%20Energy%20Recovery.user.js
// @updateURL https://update.greasyfork.org/scripts/25388/eRep%20Energy%20Recovery.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var gameInactivity = 0,
        gameRefresh = 0;

    // returns true|false whether energy can be recovered (bar not filled)
    function energyAvailable() {
        let energyToLoad = getMaxEnergy() - getEnergy(),
            available = recoverableEnergy() > 1 && energyToLoad > 1;
        return available;
    }

    // returns the amount of recoverable energy
    function recoverableEnergy() {
        let energy = document.querySelector(".tooltip_health_limit");
        return energy !== null ? Number(document.querySelector(".tooltip_health_limit").textContent) : 0;
    }

    // return the maximum recoverable energy
    function getMaxEnergy() {
        let data = document.querySelector('#current_health');
        let maxEnergy = data !== null ? Number(data.textContent.split("/")[1].trim()) : 0;
        return maxEnergy;
    }

    // return currently loaded energy
    function getEnergy() {
        let data = document.querySelector('#current_health');
        let loadedEnergy = data !== null ? Number(data.textContent.split("/")[0].trim()) : 0;
        return loadedEnergy ;
    }

    // return true|false whether the energy can be recovered with food
    function foodAvailable() {
        let foodText = document.querySelector("#foodText");
        let healButton = document.querySelector("#heal_btn");
        let consumptionTrigger = document.querySelector("#DailyConsumtionTrigger");
        return (foodText !== null && document.querySelector("#eat_food_text").value.trim() == foodText.textContent.trim()) || healButton !== null && healButton.getAttribute("class") == "food_btn" || consumptionTrigger.hasClass("recoverEnergyBtn");
    }

    // resets the inactivity counter if the user is active in the game
    ["click", "mousemove", "keyup", "keydown", "keypress"].forEach(
        event => document.addEventListener(event, resetInactivity, false)
    );

    function resetInactivity() {
        gameInactivity = 0;
    };

    // check the user's game activity and feed if not active for more than 5 seconds; also, refresh if inactive for more than 1 hour
    setInterval(function() {
        if (energyAvailable() && foodAvailable() && gameInactivity >= 5) {
            console.log("Eating food...");
            energy.eatFood();
            if (gameRefresh > 3600) {
                location.reload();
                gameRefresh = 0;
            }
            gameInactivity = 0;
        }
        gameInactivity++;
        gameRefresh++;
    }, 1000);
})();
