// ==UserScript==
// @name         troopcounter nl117
// @version      1.0.0
// @description  troopcounter
// @author       Egelman
// @match        https://nl117.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/502789/troopcounter%20nl117.user.js
// @updateURL https://update.greasyfork.org/scripts/502789/troopcounter%20nl117.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // wait for scripts to load
    const sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(3000);



   function fetchPlayerData() {
       const desired_attributes = ["alliance_id", "alliance_name", "available_cultural_points", "cultural_points", "cultural_step", "id", "name", "needed_cultural_points_for_next_step"];
       const desired_names_map = {"alliance_id": "allianceId", "alliance_name": "allianceName", "available_cultural_points": "availableCulturePoints", "cultural_points": "culturePoints", "cultural_step": "culturalStep", "id": "playerId", "name": "name", "needed_cultural_points_for_next_step": "neededCulturalPointsForNextStep"};

       let player = MM.getModels().Player[Game.player_id].attributes;

       player = Object.fromEntries(
           Object.entries(player).filter(([key, value]) => desired_attributes.includes(key))
       );

       player = renameKeys(player, desired_names_map);

       player.TroopRecords = fetchTownTroopData();
       player.towns = fetchTownData();

       return player;
   }

    function fetchTownData() {
        const desired_attributes = ["abs_x", "abs_y", "available_population", "god", "id", "island_id", "island_x", "island_y", "name", "points", "max_population", "used_population", "sea_id"];
        const desired_names_map = {"abs_x": "absX", "abs_y": "absY", "available_population": "availablePopulation", "god": "god", "id": "townId", "island_id": "islandId", "island_x": "islandX", "island_y": "islandY", "name": "name", "points": "points", "max_population": "maxPopulation", "used_population": "usedPopulation", "sea_id": "seaId"};

        let towns = Object.values(MM.getModels().Town).map(town => town.attributes);

        for (let i = 0; i < towns.length; i++) {
            towns[i]["max_population"] = towns[i]["population"]["max"];
            towns[i]["used_population"] = towns[i]["population"]["blocked"];

            towns[i] = Object.fromEntries(
                Object.entries(towns[i]).filter(([key, value]) => desired_attributes.includes(key))
            );

            towns[i] = renameKeys(towns[i], desired_names_map);

            towns[i]['townTroopRecords'] = fetchTownTroopData();
        }


        return towns;
    }


    function fetchTownTroopData() {
        Object.values(ITowns.getTowns()).map(town =>
                                             {
            let homeUnits = town.units();
            let outerUnits = town.unitsOuter();

            let totalUnits = mergeObjects(homeUnits, outerUnits);

            totalUnits['townId'] = town.id;
            totalUnits['date'] = Date.now().toString();

            return totalUnits;
        }
                                            )
    }

    async function sendPlayerData(player) {
        await fetch("https://16.171.6.215:8080/player", {
            method: "POST",
            body: JSON.stringify(player),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(console.log(`New player data for player ${Game.player_name} is sent!`));
    }


    function renameKeys(obj, newKeys) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    function mergeObjects(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] += src[key];
        }

        return obj;
    }

    function add_button() {
        $('<div class="activity_wrap"><div class="activity send_data"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

        let btn = $('div .send_data');

        btn.css({'background': 'DodgerBlue no-repeat scroll -2px -3px'});
        btn.on('click', async () => (await sendPlayerData(fetchPlayerData())));
    }

    add_button();
})();