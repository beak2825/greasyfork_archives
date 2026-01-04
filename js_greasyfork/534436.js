// ==UserScript==
// @name         Manarion
// @namespace    http://tampermonkey.net/
// @version      2025-05-30
// @description  Displays calculated values for XP, Dust, Shards, and Quest progress in Manarion game
// @license      MIT
// @author       Rook
// @match        *://manarion.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manarion.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534436/Manarion.user.js
// @updateURL https://update.greasyfork.org/scripts/534436/Manarion.meta.js
// ==/UserScript==

/*
 ======= Changelog =======
 v2025-05-30
 Reworked many things to read from game instead of scraping HTML, patterned after Elnaeth's work:
 https://greasyfork.org/en/scripts/535505-stats-shards-xp-dust-quest-res-loot-and-level-tracker
 Will continue to improve this script, but it is now functional again and should avoid breaking with further UI updates.
*/


"use strict";

(function() {
    //'use strict';

    const debug = false;

    const actionsPerMin = 20;//Every 3 seconds

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    let grid = document.querySelector('#root > div > div.flex > div.border-primary > div.grid');

    // 1. Define ItemTypes for easy reference
    const ItemTypes = Object.freeze({
        MANA_DUST: { id: 1, name: "Mana Dust", rarity: "common" },
        ELEMENTAL_SHARDS: { id: 2, name: "Elemental Shards", rarity: "common" },
        CODEX: { id: 3, name: "Codex", rarity: "epic" },

        FIRE_ESSENCE: { id: 4, name: "Fire Essence", rarity: "rare" },
        WATER_ESSENCE: { id: 5, name: "Water Essence", rarity: "rare" },
        NATURE_ESSENCE: { id: 6, name: "Nature Essence", rarity: "rare" },

        FISH: { id: 7, name: "Fish", rarity: "common" },
        WOOD: { id: 8, name: "Wood", rarity: "common" },
        IRON: { id: 9, name: "Iron", rarity: "common" },

        ASBESTOS: { id: 10, name: "Asbestos", rarity: "uncommon" },
        IRONBARK: { id: 11, name: "Ironbark", rarity: "uncommon" },
        FISH_SCALES: { id: 12, name: "Fish Scales", rarity: "uncommon" },

        TOME_OF_FIRE: { id: 13, name: "Tome of Fire", rarity: "uncommon" },
        TOME_OF_WATER: { id: 14, name: "Tome of Water", rarity: "uncommon" },
        TOME_OF_NATURE: { id: 15, name: "Tome of Nature", rarity: "uncommon" },

        TOME_OF_MANA_SHIELD: { id: 16, name: "Tome of Mana Shield", rarity: "epic" },

        ENCHANT_FIRE_RESISTANCE: { id: 17, name: "Formula: Fire Resistance", rarity: "epic" },
        ENCHANT_WATER_RESISTANCE: { id: 18, name: "Formula: Water Resistance", rarity: "epic" },
        ENCHANT_NATURE_RESISTANCE: { id: 19, name: "Formula: Nature Resistance", rarity: "epic" },
        ENCHANT_INFERNO: { id: 20, name: "Formula: Inferno", rarity: "epic" },
        ENCHANT_TIDAL_WRATH: { id: 21, name: "Formula: Tidal Wrath", rarity: "epic" },
        ENCHANT_WILDHEART: { id: 22, name: "Formula: Wildheart", rarity: "epic" },
        ENCHANT_INSIGHT: { id: 23, name: "Formula: Insight", rarity: "epic" },
        ENCHANT_BOUNTIFUL_HARVEST: { id: 24, name: "Formula: Bountiful Harvest", rarity: "epic" },
        ENCHANT_PROSPERITY: { id: 25, name: "Formula: Prosperity", rarity: "epic" },
        ENCHANT_FORTUNE: { id: 26, name: "Formula: Fortune", rarity: "epic" },
        ENCHANT_GROWTH: { id: 27, name: "Formula: Growth", rarity: "epic" },
        ENCHANT_VITALITY: { id: 28, name: "Formula: Vitality", rarity: "epic" },

        REAGENT_ELDERWOOD: { id: 29, name: "Elderwood", rarity: "uncommon" },
        REAGENT_LODESTONE: { id: 30, name: "Lodestone", rarity: "uncommon" },
        REAGENT_WHITE_PEARL: { id: 31, name: "White Pearl", rarity: "uncommon" },
        REAGENT_FOUR_LEAF_CLOVER: { id: 32, name: "Four Leaf Clover", rarity: "uncommon" },
        REAGENT_ENCHANTED_DROPLET: { id: 33, name: "Enchanted Droplet", rarity: "uncommon" },
        REAGENT_INFERNAL_HEART: { id: 34, name: "Infernal Heart", rarity: "uncommon" },

        ORB_OF_POWER: { id: 35, name: "Orb of Power", rarity: "rare" },
        ORB_OF_CHAOS: { id: 36, name: "Orb of Chaos", rarity: "epic" },
        ORB_OF_DIVINITY: { id: 37, name: "Orb of Divinity", rarity: "legendary" },

        SUNPETAL: { id: 39, name: "Sunpetal", rarity: "rare" },
        SAGEROOT: { id: 40, name: "Sageroot", rarity: "common" },
        BLOOMWELL: { id: 41, name: "Bloomwell", rarity: "common" },
    });

    //let manaDustGain = 0;
    let manaDustForSpellpower = 0;
    let manaDustForWard = 0;

    const STORAGE_KEY = 'manarionShardTrackerData';
    const MAX_LOOT_ENTRIES = 100;

    // Load from localStorage
    let stored = localStorage.getItem(STORAGE_KEY);
    let shardDrops = stored ? JSON.parse(stored) : [];
    let seenEntries = new Set(shardDrops.map(e => `${e.timestamp}|${e.shardAmount}`));
    let lootDropCount = 0;

    //let xpGain, lastXP = 0;
    let levelsPerHour = 0;
    let minsToLevel = 0;

    let questActionsRemaining = -1;

    // 2. Centralized gain tracking
    let lastXP = 0, lastDust = 0, lastResource = 0;
    let xpGain = 0, manaDustGain = 0, resourceGain = 0;



    addEventListener("load", main)
    setTimeout(main, 5000)

    function main() {
         if (!manarion || !manarion.player) return false;
        grid = document.querySelector('#root > div > div.flex > div.border-primary > div.grid');

        if (isBattling()) trackLastBattleGains();
        if (isGathering()) trackLastGatheringGains();

        perHour("XP",xpGain);
        perHour("Levels",levelsPerHour, "", false);
        perHour("Dust",manaDustGain);
        perHour("Shards", shardsPerHour(), "", false);
        etaUntil("Level", Math.round(minsToLevel));

        // 4. Main tick/update loop
        setInterval(mainTick, 3000);
    }

    // keep track of what kind of thing we're doing right now
    const isBattling = () => manarion.player.ActionType === "battle";
    const isGathering = () => ["mining", "fishing", "woodcutting"].includes(manarion.player.ActionType);

    const trackLastBattleGains = () => {
        lastXP = 0;
        lastDust = 0;
        lastResource = 0;
        if (!manarion.battle) return;
        const lastBattle = manarion.battle;

        xpGain = lastXP = lastBattle.ExperienceGained ? parseInt(lastBattle.ExperienceGained) : 0;
        manaDustGain = lastDust = lastBattle.Loot ? parseInt(lastBattle.Loot[ItemTypes.MANA_DUST.id]) : 0;
    };

    const trackLastGatheringGains = () => {
        lastXP = 0;
        lastResource = 0;
        lastDust = 0;

        if (!manarion.gather) return;
        const lastGather = manarion.gather;

        xpGain = lastXP = lastGather.ExperienceGained ? parseFloat(lastGather.ExperienceGained) : 0;

        switch (manarion.player.ActionType) {
            case "mining":
                lastResource = lastGather.Loot ? parseFloat(lastGather.Loot[ItemTypes.IRON.id]) : 0;
                break;
            case "fishing":
                lastResource = lastGather.Loot ? parseFloat(lastGather.Loot[ItemTypes.FISH.id]) : 0;
                break;
            case "woodcutting":
                lastResource = lastGather.Loot ? parseFloat(lastGather.Loot[ItemTypes.WOOD.id]) : 0;
                break;
        }
    };


    function timeToQuest(){
        /*const questElement = document.querySelector("#root > div > div.flex.max-w-screen > div.border-primary.w-full > div.grid.grid-cols-4 > div:nth-child(2) > div > p")
              //document.querySelector("#root > div > div.flex > div.border-primary > div.grid.grid-cols-4 > div:nth-child(1) > div > p")

        const questText = questElement.textContent;//"Defeat 21/333 enemies."
        const questNums = questText.match(/\d+/g);
        const questProgress = questNums[0];
        const questGoal = questNums[1];*/
        questActionsRemaining = getQuestActionsRemaining();

        const minsToQuest = Math.round(questActionsRemaining / actionsPerMin, 1);

        etaUntil("Quest", minsToQuest);
    }
    function shardsPerHour() {
        if (shardDrops.length < 2) {
            return 0; // Not enough data to calculate rate
        }

        const times = shardDrops.map(d => new Date(d.timestamp));
        const firstTime = times[0];
        const lastTime = times[times.length - 1];

        const totalTimeMs = lastTime - firstTime;
        if (totalTimeMs <= 0) return 0;

        const totalShards = shardDrops.reduce((sum, drop) => sum + drop.shardAmount, 0);
        const avgShards = totalShards / shardDrops.length;

        const totalTimeHours = totalTimeMs / (1000 * 60 * 60);
        const shardsPerHour = totalShards / totalTimeHours;

        if(debug){
            console.log(`Total Shards: ${totalShards}`);
            console.log(`Average Shards per Drop: ${avgShards.toFixed(2)}`);
            console.log(`Duration: ${totalTimeHours.toFixed(2)} hours`);
            console.log(`Shards per Hour: ${shardsPerHour.toFixed(2)}`);
        }

        return shardsPerHour;
    }
    function resourceGathering(){
        const ul = document.querySelector("#root > div > div.flex > main > div > div.mt-4 > ul");
        if(!ul){
            console.log("ul = ", ul);
            return;
        }

        const liElements = ul.querySelectorAll('li');

        let results = [];

        liElements.forEach(li => {
            const spanWithTitle = li.querySelector('span[title]');
            const resourceSpan = li.querySelector('span.rarity-common');

            if (!spanWithTitle || !resourceSpan) return;

            const title = spanWithTitle.getAttribute('title');
            const gain = parseFloat(title);

            // Extract resource name from text content: "[Iron]" → "Iron"
            const resourceText = resourceSpan.textContent.trim();
            const nameMatch = resourceText.match(/\[(.*?)\]/);
            const name = nameMatch ? nameMatch[1] : null;

            if (name && !isNaN(gain)) {
                results.push({ resourceName: name, resourceGain: gain });
            }
            let resourceName = results[0].resourceName;
            let resourceGain = results[0].resourceGain;

            let resourceOptions = ["Iron","Fish","Wood"];
            results.forEach(result => {
                if(resourceOptions.includes(result.resourceName)){
                    resourceName = result.resourceName;
                    resourceGain = result.resourceGain;
                    perHour(resourceName, resourceGain, "Resources");
                    return;
                }
            });

        });
    }
    function scanLootTracker() {
        const lootTrackerHeader = Array.from(document.querySelectorAll('div.relative.mb-1.text-center.text-lg'))
        .find(div => div.textContent.includes('Loot Tracker'));
        if (!lootTrackerHeader) return;

        const lootContainer = lootTrackerHeader.nextElementSibling;
        if (!lootContainer) return;

        const allLootRows = Array.from(lootContainer.children);
        const totalEntries = allLootRows.length;

        const lootEntries = lootContainer.querySelectorAll('div.rarity-common');
        let elementalShardCount = 0;
        let newDataAdded = false;

        lootEntries.forEach(entry => {
            if (!entry.textContent.includes('[Elemental Shards]')) return;

            elementalShardCount++;

            const spans = entry.querySelectorAll('span[title]');
            let timestamp = null;
            let shardAmount = null;

            spans.forEach(span => {
                const title = span.getAttribute('title');
                if (/\d{1,2}:\d{2}:\d{2}/.test(span.textContent)) {
                    timestamp = span.textContent.trim();
                } else if (/[\d,]+/.test(title)) {
                    shardAmount = parseInt(title.replace(/,/g, ''), 10);
                }
            });

            if (timestamp && shardAmount !== null) {
                const dateObj = parseTimeString(timestamp);
                const iso = dateObj.toISOString();

                const key = `${iso}|${shardAmount}`;
                if (!seenEntries.has(key)) {
                    seenEntries.add(key);
                    shardDrops.push({ timestamp: iso, shardAmount });
                    newDataAdded = true;
                }
            }
        });

        // 🧹 Remove legacy-format entries (non-ISO timestamps)
        const cleaned = shardDrops.filter(entry => {
            const isValid = typeof entry.timestamp === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(entry.timestamp);
            if (!isValid) seenEntries.delete(`${entry.timestamp}|${entry.shardAmount}`);
            return isValid;
        });
        if (cleaned.length !== shardDrops.length) {
            shardDrops.length = 0;
            shardDrops.push(...cleaned);
            newDataAdded = true;
        }

        // 🔃 Sort by timestamp (oldest first)
        shardDrops.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // ✂ Trim to MAX_ENTRIES
        if (shardDrops.length > MAX_LOOT_ENTRIES) {
            const removed = shardDrops.splice(0, shardDrops.length - MAX_LOOT_ENTRIES);
            removed.forEach(e => seenEntries.delete(`${e.timestamp}|${e.shardAmount}`));
            newDataAdded = true;
        }

        const shardRatio = (elementalShardCount / totalEntries * 100).toFixed(2);

        if (newDataAdded) {
            saveToLocalStorage();
            console.log(`Shards: ${elementalShardCount}, Total: ${totalEntries}, Ratio: ${shardRatio}%`);
            perHour("Shards", shardsPerHour(), "", false);
        }



    }
    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shardDrops));
    }
    function onHarvestPage(){
        const harvestDiv = document.querySelector("#root > div > div.flex > main > div > div:nth-child(1)");
        if(!harvestDiv){return false;}

        const text = harvestDiv.textContent.trim();
        const regex = /You went (woodcutting|mining|fishing) and gained .* experience/i;
        return regex.test(text);
    }
    function timeToLevel() {

        //const xpGainTextElementBattle = document.querySelector("#root > div > div.flex.max-w-screen > main > div > div:nth-child(3) > p.text-green-400")
        //const xpGainTextElementHarvest = document.querySelector("#root > div > div.flex > main > div > div:nth-child(1) span[title]");

        //let xpGainText = "";

        let xp;
        let xpGoal;

        if(isBattling()){

            xp = manarion.player.Experience;
            xpGoal = manarion.player.ExperienceToLevel;



            //manaDustGain = detectFloat(document.querySelector('#root > div > div.flex > main > div > div:nth-child(4) > ul > li > span:nth-child(1)').title);

            //xpGainText = xpGainTextElementBattle.textContent;
            //console.log(xpGainText);
            //xpGain = detectInt(xpGainText);
        }
        else if(isGathering()){
            resourceGathering();


            switch (manarion.player.ActionType) {
                case "mining":
                    xp = manarion.player.MiningExperience;
                    xpGoal = manarion.player.MiningExperienceToLevel;
                    break;

                case "fishing":
                    xp = manarion.player.FishingExperience;
                    xpGoal = manarion.player.FishingExperienceToLevel;
                    break;

                case "woodcutting":
                    xp = manarion.player.WoodcuttingExperience;
                    xpGoal = manarion.player.WoodcuttingExperienceToLevel;
                    break;
            }

            //xpGainText = xpGainTextElementHarvest.title;
            //xpGain = detectFloat(xpGainText);
        }
        //const xp = parseInt(document.querySelector('#root > div > div.flex > div.border-primary > div.grid > div:nth-child(5) > span.break-all > span:nth-child(1)').title.replace(/,/g, ""));

        //const xpGoal = parseInt(document.querySelector('#root > div > div.flex > div.border-primary > div.grid > div:nth-child(5) > span.break-all > span:nth-child(2)').title.replace(/,/g, ""));

        const xpDiff = xpGoal - xp;
        const xpPerMinute = xpGain * actionsPerMin;
        const xpPerHour = xpGain * actionsPerMin * 60;

        if (!xpGain || xpPerMinute === 0) {
            console.warn("xpGain is zero or falsy, can't compute time.");
            minsToLevel = Infinity;
            levelsPerHour = 0;
        } else {
            minsToLevel = xpDiff / xpPerMinute;
            levelsPerHour = xpPerHour / xpGoal;
        }

        if(debug){
            //console.log(xpGainText);
            console.log("XpGain: " + xpGain);
            console.log("Current XP: " + xp);
            console.log("XP Goal: " + xpGoal);
            console.log("XP Diff: " + xpDiff);
            console.log("MinsToLevel: " + minsToLevel);
            console.log("ManaDustGain: " + manaDustGain);
            console.log("minsToEntireLevel: " + minsToEntireLevel);
            console.log("levelsPerHour: " + levelsPerHour);
        }

        perHour("XP",xpGain);
        perHour("Levels",levelsPerHour, "", false);
        perHour("Dust",manaDustGain);
        perHour("Shards", shardsPerHour(), "", false);
        etaUntil("Level", Math.round(minsToLevel));


    }
    function research(){
        const onResearchPage = document.querySelector('div.space-y-5');

        if(onResearchPage){
            if(debug){
                console.log("On the Research page");
            }

            const manaDust = parseInt(document.querySelector("#root > div > div.flex > div.border-primary > div.grid > div:nth-child(6) > span:nth-child(2) > span").title.replace(/,/g, ""));

            const manaDustForSpellpowerElement = document.querySelector("div.space-y-5 > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > span:nth-child(1)");
            if(manaDustForSpellpowerElement){
                if(debug){
                    console.log("Spellpower");
                }
                manaDustForSpellpower = parseInt(manaDustForSpellpowerElement.title.replace(/,/g, ""));

                manaDustForSpellpower -= manaDust;

                const minsToSpellpower = Math.round(manaDustForSpellpower / (actionsPerMin * manaDustGain), 1);

                etaUntil("Spellpower", minsToSpellpower);
            }

            const manaDustForWardElement = document.querySelector("div.space-y-5 > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) > span:nth-child(1)");
            if(manaDustForWardElement){
                if(debug){
                    console.log("Ward");
                }
                manaDustForWard = parseInt(manaDustForWardElement.title.replace(/,/g, ""));
                manaDustForWard -= manaDust;

                const minsToWard = Math.round(manaDustForWard / (actionsPerMin * manaDustGain),1);
                etaUntil("Ward", minsToWard);
            }
        }
    }
    function updateTitle(){
        if(questActionsRemaining<0){return;}

        let docTitle = document.title;
        const endIndex = indexOfEndOfWord(docTitle, "Manarion");
        docTitle = trimStringAtIndex(docTitle, endIndex);

        if(questActionsRemaining==0){
            docTitle += " | QUEST";
        }
        else{
            docTitle += " | " + questActionsRemaining;
        }
        document.title = docTitle;
    }
    function indexOfEndOfWord(text, word) {
        const index = text.indexOf(word);
        if (index === -1) {
            return -1;
        }
        return index + word.length;
    }
    function trimStringAtIndex(str, index) {
        if (index < 0 || index >= str.length) {
            return str;
        }
        return str.slice(0, index);
    }
    function insertString(originalString, stringToInsert, index) {
        if (index < 0 || index > originalString.length) {
            return "Index is out of bounds";
        }
        return originalString.slice(0, index) + stringToInsert + originalString.slice(index);
    }
    function perHour(name, value, alternateId = "", doCalc = true){
        if(doCalc)
        {
            value = formatNumberWithCommas(value * actionsPerMin * 60);
        }
        if(typeof value === 'number')
        {
            value = value.toFixed(2);
        }
        addGridRow(name + "/Hour", value, alternateId);
    }
    function etaUntil(event, minutes){
        let eta = "";
        if (!isFinite(minutes)) {
            eta = "Unknown";
        }
        else if(minutes > 0){
            eta = "(" + etaPhrase(minutes) + ") " + timeStamp(timePlusMinutes(minutes));
        }
        else if (minutes == 0)
        {
            eta = "<1m";
        }
        else{
            eta = "Ready";
        }
        addGridRow("Next " + event, eta);
    }
    function etaPhrase(minutes){
        let min = minutes;
        let days = Math.floor(min / (60 * 24));
        min = min - (days * (60 * 24));
        let hours = Math.floor((min / 60));
        min = min - (hours * 60);

        let result = "";
        if (days>0)
        {
            result += days + "d:";
        }
        if (hours>0)
        {
            result += hours + "h:";
        }
        if (min>0)
        {
            result += min + "m";
        }
        return result;
    }
    function timePlusMinutes(minutesToAdd) {

        minutesToAdd = Number(minutesToAdd);
        if (!isFinite(minutesToAdd)) {
            console.warn("minutesToAdd is not a valid finite number:", minutesToAdd);
            return new Date(NaN);
        }

        const now = new Date();
        const msToAdd = minutesToAdd * 60 * 1000;
        const newTime = new Date(now.getTime() + msToAdd);

        return newTime;
    }
    function timeStamp(time){
        try {
            return timeFormatter.format(time);
        } catch (error) {
            if (error instanceof RangeError) {
                // Handle the RangeError specifically
                console.error("RangeError caught for time: " + time + ":", error.message);
            } else {
                // Handle other types of errors, or re-throw if necessary
                console.error("An unexpected error occurred:", error);
            }
        }
    }
    function parseTimeString(t) {
        const [h, m, s] = t.split(':').map(Number);
        const now = new Date();
        now.setHours(h, m, s, 0);
        return new Date(now); // Defensive copy
    }
    function formatNumberWithCommas(number) {
        return number.toLocaleString('en-US');
    }
    function detectInt(str) {
        const regex = /\d+/;
        const match = str.replace(/,/g, "").match(regex);
        return match ? parseInt(match[0], 10) : null;
    }
    function detectFloat(str) {
        const regex = /[+-]?\d+(\.\d+)?/;  // Match integers or decimals, optionally signed
        const match = str.replace(/,/g, "").match(regex);
        return match ? parseFloat(match[0]) : null;
    }
    function addGridRow(label, value, alternateId = "") {
        let oldDiv = document.getElementById(label);
        let hasAlternateId = false;
        let spanId = label.toLowerCase().replace(" ", "-");
        let labelSpan = undefined;
        if(alternateId.length > 0){
            hasAlternateId = true;
            spanId = alternateId.toLowerCase().replace(" ", "-");
            oldDiv = document.getElementById(alternateId);
        }

        if(oldDiv){
            //If it already exists, just update the existing content
            labelSpan = oldDiv.querySelector("span:nth-child(1)");
            labelSpan.textContent = label;
            const span = document.getElementById(spanId);
            span.textContent = value;
            span.title = value;
            return;
        }
        const newDiv = document.createElement('div');

        if(hasAlternateId){
            newDiv.setAttribute('id', alternateId);
        }
        else
        {
            newDiv.setAttribute('id', label);
        }
        newDiv.classList.add("col-span-2", "flex", "justify-between");

        labelSpan = document.createElement('span');
        labelSpan.textContent = label;

        const valueSpan = document.createElement('span');
        valueSpan.setAttribute('id', spanId);
        valueSpan.textContent = value;
        valueSpan.title = value;

        const wrapper = document.createElement('span');

        wrapper.appendChild(valueSpan);
        newDiv.appendChild(labelSpan);
        newDiv.appendChild(wrapper);

        grid.appendChild(newDiv);
    }


    // 3. Use manarion for quest progress
    function getQuestActionsRemaining() {
        if (!manarion || !manarion.player) return -1;
        if (manarion.player.ActionType === "battle") {
            return manarion.player.BattleQuestCompleted - manarion.player.BattleQuestProgress;
        } else if (["mining", "fishing", "woodcutting"].includes(manarion.player.ActionType)) {
            return manarion.player.GatherQuestCompleted - manarion.player.GatherQuestProgress;
        }
        return -1;
    }

    // 4. Main tick/update loop
    function mainTick() {
        if (isBattling()) {
            trackLastBattleGains();
        } else if (isGathering()) {
            trackLastGatheringGains();
        }

        // XP/Hour, Dust/Hour, Resource/Hour
        perHour("XP", xpGain);
        perHour("Dust", Math.round(manaDustGain));

        // Quest ETA


        timeToLevel();
        //research();
        resourceGathering();
        //scanLootTracker();
        timeToQuest();
    }

    setInterval(mainTick, 3000);

})();