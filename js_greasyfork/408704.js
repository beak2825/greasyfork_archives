// ==UserScript==
// @name         BiteFight
// @namespace    https://s31-br.bitefight.gameforge.com
// @version      0.1
// @description  Auto-play for BiteFight game. This script will help hunting, training and working automatically for you. (Only tested for Werewolves)
// @author       MrLeonix
// @match        https://s31-br.bitefight.gameforge.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/408704/BiteFight.user.js
// @updateURL https://update.greasyfork.org/scripts/408704/BiteFight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    const DEFAULT_REQUEST_DELAY_IN_MILLISECONDS = 1000 + (Math.random() * 100);
    const SKILLS = ["STR", "DEF", "DEX", "RES", "CHA"];

    // Script storage keys
    const KEY_CHARACTER = 'character';

    // Define character object
    const CHARACTER = GM_getValue(KEY_CHARACTER, {
        energy: 0,
        fragments: 0,
        gold: 0,
        health: 0,
        hellStones: 0,
        skills: {
            STR: 0,
            DEF: 0,
            DEX: 0,
            RES: 0,
            CHA: 0
        }
    });

    // Get Stats
    var allStatsElement = document.getElementsByClassName("gold")[0];
    var statsValues = allStatsElement.textContent.split("\n");
    statsValues = statsValues.map(value => value.trim());
    statsValues.shift();

    // Separate and assign values
    var energy = formatNumber(statsValues[3].substr(0, statsValues[3].indexOf("/") - 1));
    if (energy) CHARACTER.energy = parseInt(energy);
    var fragments = formatNumber(statsValues[2]);
    if (fragments) CHARACTER.fragments = parseInt(fragments);
    var gold = formatNumber(statsValues[0]);
    if (gold) CHARACTER.gold = parseInt(gold);
    var health = formatNumber(statsValues[4].substr(0, statsValues[4].indexOf("/") - 1));
    if (health) CHARACTER.health = parseInt(health);
    var hellStones = formatNumber(statsValues[1]);
    if (hellStones) CHARACTER.hellStones = parseInt(hellStones);

    updateCharacter();

    setTimeout(() => {
        switch (location.pathname) {
            case "/profile":
            case "/profile/index":
                var auxValue = Math.min();
                var chosenSkill = 0;

                var skillsTable = document.querySelector("div#skills_tab > div > div > div > table");
                for (let i = 0; i < SKILLS.length; i++) {
                    let value = getSkillValue(skillsTable.rows[i].cells[1]);
                    CHARACTER.skills[SKILLS[i]] = parseInt(value);
                    if (value < auxValue) {
                        auxValue = value;
                        chosenSkill = i;
                    }
                }
                updateCharacter();

                if (skillsTable.rows[chosenSkill].cells[2].textContent.indexOf("Não tem Ouro suficiente") > -1) {
                    CHARACTER.energy > 0 ? goHunting() : goToWork();
                } else {
                    skillsTable.rows[chosenSkill].cells[2].querySelector("div > a").click();
                }
                break;
            case "/robbery/index":
                var cost = 1;
                var huntChances = [];
                var huntOptions = [];
                document.querySelectorAll("div.mjs").forEach(node => huntOptions.push(node));
                huntOptions.forEach(option => {
                    var lookupText = "Possibilidade de êxito: ";
                    var text = option.innerHTML;
                    cost = parseInt(option.innerText.substring(option.innerText.indexOf("(") + 1, option.innerText.indexOf(")")).trim());
                    huntChances.push(parseInt(text.substr(text.indexOf(lookupText) + lookupText.length, 2)));
                });
                var chosenHunt = 1;
                for (let i = 0; i < huntChances.length; i++) {
                    if (huntChances[i] >= 70 && CHARACTER.energy >= cost) chosenHunt = i + 1;
                }

                doHunt(chosenHunt);
                break;
            case "/robbery/humanhunt/1":
            case "/robbery/humanhunt/2":
            case "/robbery/humanhunt/3":
            case "/robbery/humanhunt/4":
            case "/robbery/humanhunt/5":
                if (CHARACTER.energy > 0) document.forms[0].submit();
                else location = "https://s31-br.bitefight.gameforge.com/profile/index#tabs-2";
                break;
            case "/city/graveyard":
                if (CHARACTER.energy < 1) {
                    var workOptions = document.getElementsByName("workDuration")[0];
                    if (workOptions) {
                        workOptions.value = 8;
                        document.forms[0].submit();
                    }
                } else goHunting();
                break;
            default:
                if(location.pathname.indexOf("/report/fightreport") > -1){
                    goHunting();
                }
                break;
        }
    }, DEFAULT_REQUEST_DELAY_IN_MILLISECONDS);

    // Format texts to return as numbers (no thousand separators)
    function formatNumber(value) {
        while (value.indexOf(".") > 0) value = value.replace(".", "");
        return value;
    }

    function goHunting() {
        location = "https://s31-br.bitefight.gameforge.com/robbery/index";
    }

    function goToWork(){
        location = "https://s31-br.bitefight.gameforge.com/city/graveyard";
    }

    // Gets the basic value for a skill in given table cell.
    function getSkillValue(cell) {
        return parseInt(cell.querySelector("table > tbody > tr:nth-child(5n) > td:nth-child(2n)").textContent);
    }

    // Update character in local storage
    function updateCharacter() {
        GM_setValue(KEY_CHARACTER, CHARACTER);
    }
})();