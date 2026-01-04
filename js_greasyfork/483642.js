// ==UserScript==
// @name         Quests - SMMO
// @namespace    Violentmonkey Scripts
// @match        https://web.simple-mmo.com/quests/view/*
// @grant        none
// @version      1.0
// @author       ama
// @description  2/1/2024, 2:46:22 am
// @downloadURL https://update.greasyfork.org/scripts/483642/Quests%20-%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/483642/Quests%20-%20SMMO.meta.js
// ==/UserScript==

function performQuestIfPossible() {
    const questEnergyElement = document.querySelector('span[x-text="$store.quest_points"]');
    const questButton = document.getElementById('questButton');

    if (questEnergyElement && questButton) {
        const questEnergy = parseInt(questEnergyElement.textContent, 10);
        if (questEnergy > 0 && !questButton.disabled) {
            questButton.click();
        }
    }
}

setInterval(performQuestIfPossible, 1000);
