// ==UserScript==
// @name         Gladiatus
// @namespace    https://s39-br.gladiatus.gameforge.com/game/index.php
// @version      0.1
// @description  Auto-play for Gladiatus game. This script will help in expeditions, dungeons, training and working automatically for you.
// @author       MrLeonix
// @match        https://s39-br.gladiatus.gameforge.com/game/index.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/408705/Gladiatus.user.js
// @updateURL https://update.greasyfork.org/scripts/408705/Gladiatus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HOST = "https://s39-br.gladiatus.gameforge.com/game/index.php?";

    const QUERY_PARAMETER_TOKEN = getQueryParameterValue("sh");

    // Constants
    const DEFAULT_REQUEST_DELAY_IN_MILLISECONDS = 1000 + (Math.random() * 100);
    const STATS = ["STR", "DEX", "AGI", "CON", "CHA", "INT"];


    // Script storage keys
    const KEY_CHARACTER = 'character';
    const KEY_COOLDOWNS = 'cooldowns';

    // Define character object
    const CHARACTER = GM_getValue(KEY_CHARACTER, {
        dungeonPoints: 0,
        expeditionPoints: 0,
        fragments: 0,
        gold: 0,
        health: 0,
        hellStones: 0,
        stats: {
            STR: 0, DEX: 0, AGI: 0, CON: 0, CHA: 0, INT: 0,
        },
        canTrain: true,
        isWorking: false
    });

    // Define character object
    const COOLDOWNS = GM_getValue(KEY_COOLDOWNS, {
        arena: 0,
        circus: 0,
        dungeon: 0,
        expedition: 0,
    });

    CHARACTER.dungeonPoints = formatNumber(document.getElementById("dungeonpoints_value_point").innerText);
    CHARACTER.expeditionPoints = formatNumber(document.getElementById("expeditionpoints_value_point").innerText);
    CHARACTER.gold = formatNumber(document.getElementById("sstat_gold_val").innerText);
    CHARACTER.health = formatNumber(document.getElementById("header_values_hp_bar").dataset.value);

    setTimeout(() => {
        if (isDungeonOnCooldown()) {
            COOLDOWNS.dungeon = getTimeLeftForDungeon();
        }
        if (isExpeditionOnCooldown()) {
            COOLDOWNS.expedition = getTimeLeftForExpedition();
        }
        updateCooldowns();
    }, 750)

    updateCharacter();

    setTimeout(() => {
        switch (getQueryParameterValue("mod")) {
            case "training":
                var auxCost = Math.min();
                var chosenTraining = -1;
                var cost = 0;
                var chosenTrainingCost = 0;
                var trainingOptions = [];
                var divs = document.getElementById("training_box").children;
                for (let i = 0; i < divs.length; i++) {
                    trainingOptions.push(divs[i]);
                }

                // Remove details
                trainingOptions.shift();
                trainingOptions.pop();
                trainingOptions.pop();

                for (let i = 0; i < trainingOptions.length; i++) {
                    CHARACTER.stats[STATS[i]] = formatNumber(trainingOptions[i].querySelector(`span#char_f${i} div`).innerText);
                    cost = formatNumber(trainingOptions[i].querySelector("div div.training_costs").innerText);
                    if (cost < auxCost) {
                        chosenTraining = i;
                        auxCost = chosenTrainingCost = cost;
                    }
                }
                updateCharacter();
                if (chosenTraining > -1 && CHARACTER.gold >= chosenTrainingCost) {
                    CHARACTER.stats[STATS[chosenTraining]] += 1;
                    updateCharacter();
                    trainingOptions[chosenTraining].querySelector("div a.training_button").click();
                } else {
                    CHARACTER.canTrain = false;
                    updateCharacter();
                    goToExpedition();
                }
                break;
            case "location":
                if (!isExpeditionOnCooldown()) {
                    attack(null, '0', 3, 1, '');
                } else if (CHARACTER.dungeonPoints > 0 && COOLDOWNS.dungeon < 1) {
                    goToDungeon();
                } else if (CHARACTER.dungeonPoints < 1 && CHARACTER.expeditionPoints < 1) {
                    goToWork();
                } else {
                    setTimeout(() => {
                        COOLDOWNS.dungeon > COOLDOWNS.expedition ?
                            goToExpedition() :
                            goToDungeon();
                    }, Math.min(COOLDOWNS.dungeon, COOLDOWNS.expedition) * 1000);
                }
                break;
            case "dungeon":
                if (!isDungeonOnCooldown()) {
                    document.querySelector("div.map_label").click();
                } else {
                    COOLDOWNS.dungeon = getTimeLeftForDungeon();
                    GM_setValue(KEY_COOLDOWNS, COOLDOWNS);
                }

                if (CHARACTER.expeditionPoints > 0 && COOLDOWNS.expedition < 1) {
                    goToExpedition();
                } else if (CHARACTER.dungeonPoints < 1 && CHARACTER.expeditionPoints < 1) {
                    goToWork();
                } else {
                    setTimeout(() => {
                        COOLDOWNS.dungeon > COOLDOWNS.expedition ?
                            goToExpedition() :
                            goToDungeon();
                    }, Math.min(COOLDOWNS.dungeon, COOLDOWNS.expedition) * 1000);
                }
                break;
            case "reports":
                goToExpedition();
                if (document.getElementById("menue_packages").querySelector("div.menue_new_count") !== null) {
                    //document.getElementById("menue_packages").click();
                }
                break;
            case "work":
                if (document.getElementById("content").innerHTML.indexOf("Ainda não terminou seu trabalho") < 0 && CHARACTER.expeditionPoints < 1) {
                    CHARACTER.canTrain = true;
                    CHARACTER.isWorking = true;
                    updateCharacter();
                    setWorkTime(2, 1, 8, 'Hora', 'Horas', 'Trabalhar no estábulo', 1);
                    document.getElementById("workTime").value = document.getElementById("workTime").children[document.getElementById("workTime").childElementCount - 1].value;
                    document.getElementById("doWork").click();
                } else {
                    CHARACTER.isWorking = false;
                    updateCharacter();
                    goTraining();
                }
                break;
            default: break;
        }
    }, DEFAULT_REQUEST_DELAY_IN_MILLISECONDS);

    // Format texts to return as numbers (no thousand separators)
    function formatNumber(value) {
        while (value.indexOf(".") > 0) value = value.replace(".", "");
        return parseInt(value);
    }

    function getQueryParameterValue(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function goToDungeon() {
        CHARACTER.dungeonPoints > 0 && !CHARACTER.isWorking ?
            goTo("dungeon") :
            goTo("work");
    }

    function goToExpedition() {
        CHARACTER.expeditionPoints > 0 && !CHARACTER.isWorking ?
            goTo("location&loc=0") :
            goTo("work");
    }

    function goToWork() {
        goTo("work");
    }

    function goTraining() {
        if (!CHARACTER.canTrain) return;
        goTo("training");
    }

    function goTo(loc) {
        location = `${HOST}mod=${loc}&sh=${QUERY_PARAMETER_TOKEN}`;
    }

    // Gets the basic value for a skill in given table cell.
    function getSkillValue(cell) {
        return parseInt(cell.querySelector("table > tbody > tr:nth-child(5n) > td:nth-child(2n)").textContent);
    }

    function getTimeLeftForDungeon() {
        var time = document.getElementById("cooldown_bar_text_dungeon").innerText;
        time = (parseInt(time.substr(0, 2)) * 3600) + (parseInt(time.substr(3, 2)) * 60) + parseInt(time.substr(5, 2));
        return time;
    }

    function getTimeLeftForExpedition() {
        var time = document.getElementById("cooldown_bar_text_expedition").innerText;
        time = (parseInt(time.substr(0, 2)) * 3600) + (parseInt(time.substr(3, 2)) * 60) + parseInt(time.substr(5, 2));
        return time;
    }

    function isDungeonOnCooldown() {
        return document.getElementById("cooldown_bar_text_dungeon").innerText !== "Ir para a Masmorra";
    }

    function isExpeditionOnCooldown() {
        return document.getElementById("cooldown_bar_text_expedition").innerText !== "Ir em Expedição";
    }

    // Update character in local storage
    function updateCharacter() {
        GM_setValue(KEY_CHARACTER, CHARACTER);
    }

    function updateCooldowns() {
        GM_setValue(KEY_COOLDOWNS, COOLDOWNS);
    }
})();