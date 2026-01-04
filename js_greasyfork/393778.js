// ==UserScript==
// @name         Easy Targets THE BEST!
// @namespace    https://mainlybackstabbers.000webhostapp.com/
// @version      1.1
// @description  Easy Targets troops count!
// @author       Big Papa
// @match        https://www.tampermonkey.net/index.php?version=4.9.6095&ext=fire&updated=true
// @include 			 https://en129.grepolis.com/*
// @exclude        forum.*.grepolis.*/*
// @exclude        wiki.*.grepolis.*/*
// @connect        mainlybackstabbers.000webhostapp.com
// @grant          GM.xmlHttpRequest
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393778/Easy%20Targets%20THE%20BEST%21.user.js
// @updateURL https://update.greasyfork.org/scripts/393778/Easy%20Targets%20THE%20BEST%21.meta.js
// ==/UserScript==


function makeCount() {
    setTimeout(function() {
        'use strict';


        function addToMap(key, value, map) {
            map[key] = map[key] || [];
            map[key].push(value);
        }

        function getTownTroopsAtHome (id) {
            var intermediate = new Map();
            var output = new Map();
            var homeU = new Map();
            for (let v in models['Units'])
            {
                if((models['Units'][v]['attributes']['current_town_id'] == models['Units'][v]['attributes']['home_town_id']) &&
                   (models['Units'][v]['attributes']['current_town_player_name'] == name) &&
                   (models['Units'][v]['attributes']['current_town_id'] == id)){
                    for (let homeU in models['Units'][v]['attributes'])
                    {
                        if (interest.indexOf(homeU) >= 0)
                            addToMap(homeU, models['Units'][v]['attributes'][homeU],  intermediate);
                    }
                }
            }
            for (var at in intermediate){
                addToMap(at, intermediate[at].reduce(function(acc, val) { return acc + val; }, 0), output);
            }
            return output;
        }

        function getAllTownTroops (id) {
            var intermediate = new Map();
            var output = new Map();
            var homeU = new Map();
            for (let v in models['Units'])
            {
                if(models['Units'][v]['attributes']['home_town_id'] == id){
                    for (let homeU in models['Units'][v]['attributes'])
                    {
                        if (interest.indexOf(homeU) >= 0)
                            addToMap(homeU, models['Units'][v]['attributes'][homeU],  intermediate);
                    }
                }
            }
            for (var at in intermediate){
                addToMap(at, intermediate[at].reduce(function(acc, val) { return acc + val; }, 0), output);
            }
            return output;
        }

        function getAllTownTroopsPlusSupport (id) {
            var intermediate = new Map();
            var output = new Map();
            var homeU = new Map();
            for (let v in models['Units'])
            {
                if(models['Units'][v]['attributes']['current_town_id'] == id){
                    for (let homeU in models['Units'][v]['attributes'])
                    {
                        if (interest.indexOf(homeU) >= 0)
                            addToMap(homeU, models['Units'][v]['attributes'][homeU],  intermediate);
                    }
                }
            }
            for (var at in intermediate){
                addToMap(at, intermediate[at].reduce(function(acc, val) { return acc + val; }, 0), output);
            }
            return output;
        }

        function getWallLevelAndGod (id) {
            var intermediate = new Map();
            var output = new Map();
            var wall = new Map();
            for (let v in models['Buildings'])
            {
                if(v == id){
                    addToMap('Wall', models['Buildings'][v]['attributes']['wall'],  output);
                    addToMap('Tower', models['Buildings'][v]['attributes']['tower'],  output);
                }
            }
            for (let v in models['Town'])
            {
                if(v == id){
                    addToMap('God', models['Town'][v]['attributes']['god'],  output);
                }
            }
            return output;
        }


        function doSum(map) {
            map.reduce(function(acc, val) { return acc + val; }, 0)
        }

        let homeUnits = new Map();
        var suma = new Map();
        var interest = ['archer', 'attack_ship', 'big_transporter', 'bireme', 'calydonian_boar', 'catapult', 'centaur', 'cerberus', 'chariot', 'colonize_ship', 'demolition_ship', 'fury', 'godsent', 'griffin', 'harpy', 'hoplite', 'manticore', 'medusa', 'minotaur', 'pegasus', 'rider', 'sea_monster', 'slinger', 'small_transporter', 'sword', 'trireme', 'zyklop'];
        var allUnits = new Map();
        var name;
        var slotsTot;
        var slots;
        var sumaAllUnits = new Map();
        var townIds = new Map();
        var townsMap = new Map();
        var townId = new Map();
        var townTroops = new Map();
        var numberOfCities;

        let collections = MM.getCollections();
        console.log("Start fetching collections");
        console.log(collections);

        let models = MM.getModels();
        console.log("Start fetching models");
        console.log(models);


        for (let v in models['Player'])
        {
            name = models['Player'][v]['attributes']['name'];

        }

        for (let v in models.Player)
        {
            slotsTot = models['Player'][v]['attributes']['cultural_step'];

        }

        for (let v in models['Units'])
        {
            if( models['Units'][v]['attributes']['current_town_id'] == models['Units'][v]['attributes']['home_town_id'] && models['Units'][v]['attributes']['current_town_player_name'] == name)
                for (let homeU in models['Units'][v]['attributes'])
                {
                    if (interest.indexOf(homeU) >= 0)
                        addToMap(homeU, models['Units'][v]['attributes'][homeU],  homeUnits);
                }
        }

        for (var it in homeUnits){
            addToMap(it, homeUnits[it].reduce(function(acc, val) { return acc + val; }, 0), suma);
        }

        for (let v in models['TownIdList'])
        {
            townIds = models['TownIdList'][v]['attributes']['town_ids'];
            numberOfCities = models['TownIdList'][v]['attributes']['town_ids'].length;

        }

        for (let v in models['Units'])
        {
            for (let all in models['Units'][v]['attributes'])
            {
                if(townIds.indexOf(models['Units'][v]['attributes']['home_town_id']) >= 0)
                    if (interest.indexOf(all) >= 0){
                        addToMap(all, models['Units'][v]['attributes'][all],  allUnits);
                    }
            }
        }

        for (var at in allUnits){
            addToMap(at, allUnits[at].reduce(function(acc, val) { return acc + val; }, 0), sumaAllUnits);
        }

        sumaAllUnits.forEach((value, key) => {
            var keys = key.split('.'),
                last = keys.pop();
            keys.reduce((r, a) => r[a] = r[a] || {}, object)[last] = value;
        });



        for (let v in models.Town)
        {
            addToMap('name',models['Town'][v]['attributes']['name'],townId);
            addToMap('unitsAtHome',getTownTroopsAtHome(models['Town'][v]['attributes']['id']),townId);
            addToMap('unitsTotal',getAllTownTroops(models['Town'][v]['attributes']['id']),townId);
            addToMap('unitsTotalPlusSupport',getAllTownTroopsPlusSupport(models['Town'][v]['attributes']['id']),townId);
            addToMap('GodAndTower',getWallLevelAndGod(models['Town'][v]['attributes']['id']),townId);
            addToMap(models['Town'][v]['attributes']['id'], townId,  townsMap);

            townId = new Map();
        }
        console.log(townsMap);
        console.log("==============================================================================================");

        slots = slotsTot - numberOfCities;
        addToMap('name', name,  sumaAllUnits);
        addToMap('slots', slots,  sumaAllUnits);
        addToMap('townStats', townsMap,  sumaAllUnits);

        var seri = JSON.stringify(sumaAllUnits);


        //console.log(seri);
        var server_url = 'https://mainlybackstabbers.000webhostapp.com/units.php';

        GM.xmlHttpRequest({
            method:     "POST",
            url:        server_url,
            data:       seri,
            headers:    {
                "Content-Type": "application/json"
            },
            onload:     function (response) {

            },
            onerror:    function(reponse) {

            }
        });
    }, 20000);
}
makeCount();
setInterval(makeCount, 1000*1800);






































































