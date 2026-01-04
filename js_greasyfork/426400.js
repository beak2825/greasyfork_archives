// ==UserScript==
// @name         Grepolis Cheat Pack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  All-in-One!
// @author       You
// @match        https://cz72.grepolis.com/game/index?login=1&p=852594&ts=1619676526
// @icon         https://www.google.com/s2/favicons?domain=grepolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426400/Grepolis%20Cheat%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/426400/Grepolis%20Cheat%20Pack.meta.js
// ==/UserScript==


// --------------------------- Constants section ----------------- \\
// Ground units have special names in the game. These names are used to refer to many troop-related things in the game: pictures, orders, queues, amounts. I DISCOURAGE any modifications to their names, because
// it will most likely be like 100% fatal to the script
var GROUND_UNIT_KEYS = ["sword", "slinger", "archer", "hoplite", "rider", "chariot", "catapult", "godsent", "spartoi", "ladon", "zyklop"];
var SEA_UNIT_KEYS = ["big_transporter", "bireme", "attack_ship", "demolition_ship", "small_transporter", "trireme", "colonize_ship"];

// This one is more complex. MAX_LEVELS has buildings' names as keys, and their maximum in-game levels as values.
// Now, the order of buildings also matters. The script will be reading this variable from 'left' to 'right', and it reads MAX_LEVELS varialbe in the building automation section
// So, if you change the order of things from "main": 25, "academy":36 ... to "academy":36, "main": 25, the script WILL ALWAYS try to build the academy first. It will then build
// the senate in only two cases: either the academy is maxed or not available because of the resource shortage. So, changing the order of buildings in this variable is 100% identical to changing
// the priority of that building. Change the order of buildings here if you wish the script to build things in different order.
// If you change values (numbers), it will only have one effect: this building will not be built higher than that level ANYWHERE, in any city. It will not demolish existing buildings, though.
// So change the values if you want to brute force a certain limit to the building level everywhere.
//
// While you can freely change the order of the buildings here, I STRONGLY DISCOURAGE modifying the numbers. There is a config system for that after all! The configs are much more flexible!
// Changing a number here is too rude of a method to do the thing configs were made for!
// * in regard of configs, read info about it in one of the functions below...
var MAX_LEVELS = { "main": 25, "academy": 36, "farm": 45, "storage": 35, "market": 30, "temple": 30, "barracks": 30, "docks": 30, "hide": 10, "storage": 35, "ironer": 40, "lumber": 40, "stoner": 40, "wall": 25,
                  "lighthouse": 1, "oracle": 1, "statue": 1, "trade_office":1, "tower": 1, "theater":1, "library": 1, "thermal": 1 }


// ---------------- Misc. functions ------------ \\
// Forces the script to wait for the specified amount of milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generates a random integer from min to max value. Surprising how such an old language as JavaScript doesn't have its standard rand() function, eh?
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

// RS stands for "random sleep". Forces the script to sleep for a random amount of time between mintime and maxtime
async function rs(mintime, maxtime){
    await sleep(getRandomInt(mintime, maxtime));
}


// -------------- Game Statistics and Data functions ----------- \\
// Gets the currently active city name
async function getCityName(){
    return Game.townName;
}

// Returns an array of all player's cities' names
async function getAllPlayerCitiesNames() {
    //ITowns.getTowns() returns a collection like this: {ID1: city_object1, ID2: city_object2...}. City objects have different kinds of info about the city, including its name.
    return Object.values(ITowns.getTowns()).map(town => town.name);
}

// Same as the function above, except it returns player's cities IDs instead of names
async function getAllPlayerCitiesIds() {
    // Like in the function above, we deal with a simple structure of {ID1: city_object1}, we need the id, so getting just the keys of this object is enough for our purposes
    return Object.keys(ITowns.getTowns());
}

// Gets the currently active city's ID
async function getCityId() {
    return Game.townId;
}

// Returns a collection of city resources, looking exactly like this: {wood: x, stone: y, iron: z, population: n, favour: d }
async function getCityResources(){
    return ITowns.getTown(Game.townId).resources()
}

// Returns a collection of currently active city's units, looking something like that {unitKey1: n, unitKey2: z, unitKey3: ...}
async function getCityUnits() {
    return ITowns.getTown(Game.townId).units();
}

// Returns the maximum storage capacity for the currently active city. The capacity is just one number
async function getCityStorageCapacity() {
    return ITowns.getTown(Game.townId).getStorage();
}

// Get a trade overview object for the currently active town. This object is huge, has tons of info in it.
async function getTradeOverview() {
    return await $.get("https://"+window.location.hostname+
                       "/game/town_overviews?town_id"+Game['townId']+
                       "&action=trade_overview&h="+Game['csrfToken']+
                       "&json="+JSON.stringify({"town_id":590, "nl_init":true})+"&_="+Date.now());
}

// Returns a collection of training units for the currently active city.
// This function ASSUMES the barracks or the docks window had been opened before the call to it was made
// Otherwise it will not return anything, but an empty object!
async function getUnitsInTraining(){
    var units_in_training = {};
    $(".frame-content").find(".text_shadow").each(function(){
        if(units_in_training[$(this).parent().attr("class").replace("item_icon", "").replace("unit_icon40x40", "").replace("js-item-icon", "").trim()] == undefined) {
            units_in_training[$(this).parent().attr("class").replace("item_icon", "").replace("unit_icon40x40", "").replace("js-item-icon", "").trim()] = 0;
        }
        units_in_training[$(this).parent().attr("class").replace("item_icon", "").replace("unit_icon40x40", "").replace("js-item-icon", "").trim()] += parseInt($(this).text());
    });
    return units_in_training;
}

// This function returns a collection of resources arriving to the target town
// The collection returned looks like this: {wood: n, stone: x, iron: z}. It doesn't include gold and favour
async function get_resources_arriving_to_town(target_town_name){
    var trade_overview = await getTradeOverview();
    var arriving_total = {"wood": 0, "stone": 0, "iron": 0};
    var arriving_to_this_city = trade_overview.json.movements.forEach(
        function(movement){
            if(movement.to.link.includes(target_town_name)) {
                arriving_total.wood += movement.res.wood;
                arriving_total.stone += movement.res.stone;
                arriving_total.iron += movement.res.iron;
            } 
        });
    return arriving_total;
}

// Returns a collection of all town buildings' levels. The collection looks like this: {buildingKey1: lvl, buildingKey2: lvl...}
async function getTownBuildingsLevels() {
    return ITowns.getTown(Game.townId).buildings().attributes;
}

// Returns a collection of "ZDARMA!"/(free?) finish buttons for buildings. You can find those in the building queue in the bottom of your screen
async function getInstantFinishButtons() {
    return $(".btn_time_reduction.button_new.js-item-btn-premium-action.js-tutorial-queue-item-btn-premium-action.type_building_queue.type_instant_buy.instant_buy.type_free");
}


// -------------- Game Windows --------------- \\
// Opens the trades window where you exchange resources with your other towns
async function openTradeWindow(){
    $(".toolbar_activity_trades").click();
    await rs(2000, 3000);
}

// Opens the barracks window for the currently active city
async function openBarracks() {
    BarracksWindowFactory.openBarracksWindow();
    await rs(2000, 3000);
}

// Opens the docks window for the currently active city
async function openDocks() {
    DocksWindowFactory.openDocksWindow();
    await rs(2000, 3000);
}


// -------------- Utils -------------- \\
// Returns true if the building mode is on, false otherwise
async function isBuildingMenuActive() {
    // the build hammer adds "active" to its classname when the build mode is on, so that .active in the end of the query is pretty much the heart of the function
    return $(".construction_queue_sprite.queue_button-idle.queue_button.btn_construction_mode.js-tutorial-btn-construction-mode.active").length > 0;
}

// Helper function for logging. Simply returns a string of "HH:MM:SS"
async function getCurrentHourMinuteSecond(){
    var d = new Date();
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

// A function which returns true if the specified script component is currently enabled, false otherwise
async function isOn(setting) {
    return window.localStorage.getItem(setting) == "ON";
}

// Logging function for more stylish printing. Your logs gotta look cool, man, otherwise how will you show the script work off in front of your friends?
async function print(message, prefix="[CheatPack/Info]: "){
    // Prefix is an optional param. Never really changed it since the writing of this function
    console.log(await getCurrentHourMinuteSecond()+" "+prefix+message);
}

// Same as above, but logs things as a script error
async function printErr(message, prefix="[CheatPack/ERROR]: ") {
    console.error(await getCurrentHourMinuteSecond()+" "+prefix+message);
}

// Stands for "Short random sleep", for brevity. Sleeps between 100 and 300 milliseconds
async function srs() {
    await rs(100, 300);
}

// Returns build quotas for the specified city id. If this city doesn't have settings (or settings do not exist) returns undefined.
// For more info on how build quotas are used, refer either to the main_sequence function, or the openGcpSettings function
async function getCityBuildingSettings(cityId){
    try {
        return JSON.parse(window.localStorage.getItem("buildSettings"))[cityId];
    } catch {
        return undefined;
    }
}

// Same as above, except it returns quotas on units. Again, refer either to the main_sequence function or openGcpSettings functions for details on how those quotas are used
async function getCityRecruitingSettings(cityId){
    try {
        return JSON.parse(window.localStorage.getItem("unitSettings"))[cityId];
    } catch {
        return undefined;
    }
}

// Changes the specified city's building quota
async function setCityBuildingSettings(cityId, build_quotas) {
    var settings = JSON.parse(window.localStorage.getItem("buildSettings"));
    if(settings == undefined || settings == null) settings = {}
    settings[cityId] = build_quotas;
    window.localStorage.setItem("buildSettings", JSON.stringify(settings));
}

// Changes the specified city's unit recruiting quota
async function setCityRecruitingSettings(cityId, unit_quotas) {
    var settings = JSON.parse(window.localStorage.getItem("unitSettings"));
    if(settings == undefined || settings == null) settings = {}
    settings[cityId] = unit_quotas;
    window.localStorage.setItem("unitSettings", JSON.stringify(settings));
}

async function getBuildingSettingsOrDefault(cityId) {
    var quotas = await getCityBuildingSettings(cityId);
    if(quotas == undefined || quotas == null) {
        quotas = {};
        var buildings = Object.keys(MAX_LEVELS);
        // If the value of city setting is faulty, assume everything needs to be leveled up, except for walls and special buildings
        for(var c = 0; c < buildings.length; c += 1) quotas[buildings[c]] = MAX_LEVELS[buildings[c]];
        // Set special buildings and walls to 0 by default
        quotas["wall"] = 0; quotas["thermal"] = 0;quotas["library"] = 0; quotas["tower"] = 0; quotas["trade_office"] = 0; quotas["oracle"] = 0;
        quotas["lighthouse"] = 0; quotas["theater"] = 0; quotas["statue"] = 0;
    }
    return quotas;
}

// Either get unit quotas object for the city, or, on failure, return all defaults.
async function getCityRecruitingSettingsOrDefault(cityId){
    var quotas = await getCityRecruitingSettings(cityId);
    if(quotas == undefined || quotas == null){
        quotas = {};
        // First add ground units to the quota
        for(var i = 0; i < GROUND_UNIT_KEYS.length; i+=1) {
            quotas[GROUND_UNIT_KEYS[i]] = 0;
        }
        // Then append sea units
        for(i = 0; i < SEA_UNIT_KEYS.length; i+=1) {
            quotas[SEA_UNIT_KEYS[i]] = 0;
        }
    }
    return quotas;
}

// ------------- Action Functions ------------ \\
// Clicks the available "Zdarma" buttons
async function instantFinishFreeBuildings(){
    (await getInstantFinishButtons()).click(); await rs(1000, 1500);
}
// Click the build hammer to trigger the building mode
async function toggleBuildingMode() {
    $(".construction_queue_sprite.queue_button-idle.queue_button.btn_construction_mode.js-tutorial-btn-construction-mode").click(); await rs(2000, 3000);
}

// Click the arrow to go to the next city
async function nextCity() {
    $(".btn_next_town.button_arrow.right").click(); await rs(1500, 2000);
}

// Given a quota, will try to construct buildings according to it in the current city
async function buildFirstAvailableBuilding(quota) {
    var townBuildings = await getTownBuildingsLevels();
    await instantFinishFreeBuildings();
    if(!await isBuildingMenuActive()) await toggleBuildingMode();
    var buildings = Object.keys(quota);

    // Go through each building. If its level is lower than required and if its construction is available -> construct the building
    for(var i = 0; i < buildings.length; i += 1){
        if(quota[buildings[i]] > townBuildings[buildings[i]]){
            if($(".btn_build.build_button[data-building_id='" + buildings[i] + "']").not(".disabled").length > 0){
                $(".btn_build.build_button[data-building_id='" + buildings[i] + "']").not(".disabled").first().click();
                await rs(500, 750);
            }
        }
    }
}

// Given the type of the ground unit and the desired amount, will try to queue it in the current city's barracks
async function buildGroundUnit(unitType, count) {
    // If such a unit key does not exist, or the amount specified is inadequate or if barracks are not built in the city -> return, we have nothing to do here
    if(!GROUND_UNIT_KEYS.includes(unitType) || count <= 0 || ITowns.getTown(Game.townId).buildings().attributes["barracks"] == 0) return;
    await openBarracks();
    UnitOrder.selectUnit(unitType); await rs(1000, 1500);
    $("#unit_order_min").click(); await rs(1000, 1500);
    $("#unit_order_input").val(count-1); await rs(1000, 1500);
    $("#unit_order_up").click(); await rs(1000, 1500);
    $("#unit_order_confirm").click(); await rs(1000, 1500);
    $(".ui-dialog-titlebar-close.ui-corner-all").click(); await rs(1000, 1500);
}

// Same as above, but for sea units. Operates with the city docks
async function buildSeaUnit(unitType, count) {
    if(!SEA_UNIT_KEYS.includes(unitType) || count <= 0 || ITowns.getTown(Game.townId).buildings().attributes["docks"] == 0) return;
    await openDocks();
    $(".power_icon30x30.call_of_the_ocean.new_ui_power_icon.animated_power_icon.animated_power_icon_30x30.js-power-icon").not(".extendable").click(); await rs(1000, 1500); // Click "Ocean power" -> speed building up
    UnitOrder.selectUnit(unitType); await rs(1000, 1500);
    $("#unit_order_min").click(); await rs(1000, 1500);
    $("#unit_order_input").val(count-1); await rs(1000, 1500);
    $("#unit_order_up").click(); await rs(1000, 1500);
    $("#unit_order_confirm").click(); await rs(1000, 1500);
    $(".ui-dialog-titlebar-close.ui-corner-all").click(); await rs(1000, 1500);
}

// Background functionality of the "Fill to the brim!" button. Calculates the amount of resources needed to fill
// The current city's storage to 100%, tries to get these resources from other towns of the player
async function fillToTheBrim(){
    // Get available resources, as seen on the screen.
    var available = [];
    for(var i = 0; i < 3; i += 1){
        available.push(parseInt($(".amount.ui-game-selectable")[i].innerText));
    }

    // Get city's storage capacity
    var capacity = await getCityStorageCapacity();

    // In the beginning, assume we need STORAGE units of every resource
    var costs = [capacity, capacity, capacity]

    // Add already arriving resources to the available res. We want to avoid overflows as much as possible, so availble resources must include arriving
    // resources for better precision
    var arriving = await get_resources_arriving_to_town(Game.townName);
    available[0] += arriving.wood;
    available[1] += arriving.stone;
    available[2] += arriving.iron;


    // Calculate how much more of each type of resource we need to send
    var difference = [costs[0]-available[0], costs[1]-available[1], costs[2]-available[2]];

    // In case the difference is negative somewhere, just set it to 0.
    // This situation is impossible in theory
    if(difference[0] < 0) difference[0] = 0;
    if(difference[1] < 0) difference[1] = 0;
    if(difference[2] < 0) difference[2] = 0;

    // Get the trade info for this town. TradeOverview object has a lot of info about trades, times of arrival and much more
    var trade_overview = await getTradeOverview();

    // Sorts player's towns by their proximity to the current town. We want resources to arrive as fast as possible,
    // So we will first send resources from the closest towns, moving to the further ones only if it necessary
    var closest_towns = await get_sorted_distances_to_target_city(Game.townId, trade_overview.json.towns.filter(town => town.id != Game.townId).map(town => town.id));

    // Service varialbe for smoother functionality, will only be used in the end.
    var towns_done = 0;

    for(var t = 0; t < closest_towns.length; t+=1){

        // Get the town object. This town will be sending resources to the current town.
        var sending_town = trade_overview.json.towns.filter(town => town.id == closest_towns[t])[0];

        // If the city does not have market lvl 5 or higher, don't trade with it, it will cause unnecessary in-game errors.
        if(ITowns.getTown(closest_towns[t]).buildings().attributes.market >= 5){

            // Get sending town's trade capacity
            capacity = sending_town.cap;

            // If the town's trade capcity allows trade, and if there are still resources to be sent, engage in the trade
            if(capacity > 0 && (difference[0] > 0 || difference[1] > 0 || difference[2] > 0)){
                var trade_data = {"from":closest_towns[t], "to":Game.townId, "town_id":Game.townId, "nl_init":true
                                 };

                // Send the minimum of three: town's trade capacity, town's available resource, the amount of resource still necessary
                // Math.min(...) allows to select the minimum of three, which is vital to make a proper trade request.
                // If we try to send more than we have / more than we can, the request will fail and nothing will be sent at all.
                // Adding difference to the Min(...) helps to avoid overflows: if we can send 15k wood, but only 3k is required, 3k will be sent, and not 15k.
                trade_data.wood = Math.min(capacity, sending_town.res.wood, difference[0]);

                // Decrease the sending town's capacity to make sure we don't go over it
                capacity -= trade_data.wood;

                // Decrease the amount of this resource needed by the amount that will be sent from the sending town
                difference[0] -= trade_data.wood;

                // Repeat for other types of resources
                trade_data.stone = Math.min(capacity, sending_town.res.stone, difference[1]);
                capacity -= trade_data.stone;
                difference[1] -= trade_data.stone;
                trade_data.iron = Math.min(capacity, sending_town.res.iron, difference[2]);
                difference[2] -= trade_data.iron;

                // Sanity check. A bunch of crazy conditions is listed here, I am not sure how likely they are to happen, but
                // Just in case they must be checked, otherwise the trade request will look insane and might not work at all
                // First, check if capacity went below 0. If it didn't, check if we are not trying to send resources from current town to current town (e.g. "Paris" to "Paris")
                // This check is done by both checking the current in-game townId and by comparing sender and receiver in the future request's data
                // Then we must make sure the amount of resources we are trying to send isn't 0
                // Finally, we must check if the total sum of the resources sent surpasses 100. If it doesn't, the game will return an error: "You must send at least 100 resources"
                if(capacity >= 0 && Game.townId != closest_towns[t] && (trade_data.from != trade_data.to)
                   && (trade_data.wood > 0 || trade_data.stone > 0 || trade_data.iron > 0)
                   && (trade_data.wood + trade_data.stone + trade_data.iron > 100)){
                    // In-game requests convert integer resource amounts to strings for whatever reasons. We have to do the same
                    trade_data.wood = trade_data.wood + "";
                    trade_data.stone = trade_data.stone + "";
                    trade_data.iron = trade_data.iron + "";

                    // send the post request to finish trading and send resources
                    $.post("https://"+window.location.hostname+"/game/town_overviews?town_id="+Game['townId']+"&action=trade_between_own_town&h="+Game['csrfToken']+
                           "&json="+JSON.stringify(trade_data));

                    // If this line was reached by the script, then the trade was succesful. Add 1 to towns_done, indicating we have succesfully traded with one more town.
                    towns_done += 1;
                    await rs(20, 30);
                }
            }
        }
    }
    // Finally, after all the trades have been completed, we must check if any of them were succesful. If no town sent resources to the current town,
    // There's no need to refresh the page. Otherwise, we must refresh the page so that the inbound trades are properly displayed by the game
    // The necessity of reloading the page comes from the fact that using direct post requests is a shadowy way of trading, the game's front-end doesn't catch those
    // Thus the game needs to be reloaded so that the front-end requests the updated data from the server and displays it properly
    if(towns_done != 0) window.location.reload(true);
}

// Returns a list of towns, sorted from the closest to the farthest
async function get_sorted_distances_to_target_city(target_city_id, other_town_ids){
    var distances = [];
    for(var i = 0; i < other_town_ids.length; i+=1){
        var distance = await $.get("https://"+window.location.hostname+"/game/town_overviews?town_id"+Game['townId']+"&action=calculate_duration_between_towns&h="+Game['csrfToken']+"&json="+JSON.stringify({"from":other_town_ids[i],"to":Game.townId, "town_id":Game.townId, "nl_init":true})+"&_="+Date.now());
        distance = distance.plain.duration.split(":").map(str => parseInt(str, 10)); // the distance is technically time en route, it comes in the form of "HH:MM:SS"
        distances.push([other_town_ids[i], distance[0]*60*60+distance[1]*60+distance[2]]);
    }
    distances.sort(function(distance1, distance2) { return distance1[1] - distance2[1] });
    return distances.map(distance => distance[0]); // distance => distance[0] will simply return the town id
}

// Accepts the script settings after the "Accept" button was clicked in the settings window
async function acceptGcpSettings(){
    var entries_per_city = GROUND_UNIT_KEYS.length + SEA_UNIT_KEYS.length + Object.keys(MAX_LEVELS).length;
    var entries = document.getElementsByTagName("input");
    var city_index = 0;
    var playerCitiesIds = await getAllPlayerCitiesIds();
    // -------- Make sure empty boxes are filled with zeroes instead of being simply empty ----------- \\
    for(var entryId = 0; entryId < entries.length; entryId += 1) if(entries[entryId].value == "") entries[entryId].value = 0;
    // -------- Now parse the settings and save them ----------- \\
    for(entryId = 0; entryId < entries.length; entryId += 0){
        var build_quot = {};
        var unit_quot = {};
        // Parsing is simple. The first MAX_LEVELS.length input fields are for buildings, then GROUND_UNIT_KEYS.length are for ground unit quotas, same for sea units... and so on.
        for(var buildIndex = 0; buildIndex < Object.keys(MAX_LEVELS).length; buildIndex += 1) build_quot[Object.keys(MAX_LEVELS)[buildIndex]] = parseInt(entries[entryId++].value);
        for(var unitIndex = 0; unitIndex < GROUND_UNIT_KEYS.length; unitIndex += 1) unit_quot[GROUND_UNIT_KEYS[unitIndex]] = parseInt(entries[entryId++].value);
        for(unitIndex = 0; unitIndex < SEA_UNIT_KEYS.length; unitIndex += 1) unit_quot[SEA_UNIT_KEYS[unitIndex]] = parseInt(entries[entryId++].value);
        await setCityBuildingSettings(playerCitiesIds[city_index], build_quot);
        await setCityRecruitingSettings(playerCitiesIds[city_index], unit_quot);
        city_index += 1;
    }
    window.location.reload(true);
}

// Draw the script settings window
async function openGcpSettings(){
    await print("Starting to create the settings page");
    window.acceptGcpSettings = acceptGcpSettings;
    var playerCitiesIds = await getAllPlayerCitiesIds();

    // ----------------- Draw the greeting and brief explanation --------------- \\
    $("body").empty();
    $("body").css("padding-left", "15px").css("padding-right", "15px").css("padding-top", "15px").css("padding-bottom", "15px");
    $("body").append("<p style='font-size: 22px;'>Welcome to the settings page. Down below you can set building and troop recruiting quotas for your cities. 'Main 25/25' means that the senate will be maxed out, 'Main 20/25' would mean you only want 20 levels of the senate to be built. Troops are a little different. Here, you need to specify the quantity of each unit you want recruited. The script recruits 'left to right', starting from swords and ending with colo ships. So, say you desire to build 100 swords and 100 slingers. Script will first recruit all the swords, then all the slingers and so on..</p>");
    $("body").append("<br><br><br>");

    // ----------------------- Draw citiy build and unit quotas --------------------- \\
    for(var i = 0; i < playerCitiesIds.length; i += 1){
        $("body").append("<h2 style='font-weight: bold; font-size: 20px;'>"+ITowns.getTown(playerCitiesIds[i]).name + "</h2>"); // town name header
        var city_buildings = ITowns.getTown(playerCitiesIds[i]).buildings().attributes;
        var building_quotas = await getCityBuildingSettings(playerCitiesIds[i]);

        // If building quotas have not been set or have been corrupted, fall back to the defaults
        if(building_quotas == undefined || building_quotas == null) {
            building_quotas = {};
            var buildings = Object.keys(MAX_LEVELS);
            for(var c = 0; c < buildings.length; c += 1) building_quotas[buildings[c]] = MAX_LEVELS[buildings[c]]; // If the value of city setting is faulty, assume everything needs to be leveled up, except for walls and miracles
            building_quotas["wall"] = 0; building_quotas["thermal"] = 0; building_quotas["library"] = 0; building_quotas["tower"] = 0; building_quotas["trade_office"] = 0; building_quotas["oracle"] = 0;
            building_quotas["lighthouse"] = 0; building_quotas["theater"] = 0; building_quotas["statue"] = 0;
            await setCityBuildingSettings(playerCitiesIds[i], building_quotas);
        }
        var to_draw = "<div style='display: flex; flex-direction: row; flex-wrap: wrap;'>";
        for(c = 0; c < Object.keys(building_quotas).length; c += 1){
            to_draw += "<div style='display: flex; flex-direction: row;  margin-right: 20px; margin-top: 5px; margin-bottom: 5px;'><span style='font-size: 20px'>" + Object.keys(building_quotas)[c] + ":</span>" + "<input style='width: 20px;' value='"+building_quotas[Object.keys(building_quotas)[c]]+"'></input>" + "<span style='font-size: 20px'> / " +
                MAX_LEVELS[Object.keys(building_quotas)[c]] + "</span></div>";
        }
        $("body").append(to_draw + "</div>");
        $("body").append("<br>");

        // Same check for unit quotas. If they are not set or are corrupt, set everything to 0
        var unit_quotas = await getCityRecruitingSettings(playerCitiesIds[i]);
        if(unit_quotas == null || unit_quotas == undefined){
            unit_quotas = {}
            for(c = 0; c < GROUND_UNIT_KEYS.length; c += 1) unit_quotas[GROUND_UNIT_KEYS[c]] = 0;
            for(c = 0; c < SEA_UNIT_KEYS.length; c += 1) unit_quotas[SEA_UNIT_KEYS[c]] = 0;
            await setCityRecruitingSettings(playerCitiesIds[i]);
        }
        to_draw = "<div style='display: flex; flex-direction: row; flex-wrap: wrap;'>";
        for(c = 0; c < Object.keys(unit_quotas).length; c += 1){
            to_draw += "<div style='display: flex; flex-direction: row;  margin-right: 20px; margin-top: 5px; margin-bottom: 5px;'><span style='font-size: 20px'>" + Object.keys(unit_quotas)[c] + ":</span>" + "<input style='width: 35px;' value='"+unit_quotas[Object.keys(unit_quotas)[c]]+"'></input></div>";
        }
        $("body").append(to_draw + "</div>");
        $("body").append("<br><br><br>");
    }

    // --------------------------- Draw Accept and Cancel buttons ------------------ \\
    $("body").append("<div style='display: flex; width: 100%; flex-direction: row; align-items: stretch; align-content: stretch; justify-content: stretch;'><button style='width:50%; font-size: 42px;' onclick=window.acceptGcpSettings()>Accept</button><button style='width:50%; font-size: 42px;' onclick='window.location.reload(true);'>Cancel</button></div>");
    $("body").css("background-color", "white");
    $("body").append("<style>*{background-color: white;}</style>");
}

// Draw script action buttons
async function draw_interface(){
    if($(".gcpElement").length <= 0) {
        var toggle_autobuild_button = $($(".main_menu_item")[8]).clone();
        var toggle_autocollect_button = $($(".main_menu_item")[8]).clone();
        var toggle_autorecruit_button = $($(".main_menu_item")[8]).clone();
        var fill_to_the_brim = $($(".main_menu_item")[8]).clone();
        var auto_celebrations = $($(".main_menu_item")[8]).clone();
        var auto_hide_fill =  $($(".main_menu_item")[8]).clone();
        var settings = $($(".main_menu_item")[8]).clone();

        // --------- Autobuild button --------------
        toggle_autobuild_button[0].children[0].children[1].children[0].innerText = "AutoBuild: "+ (await isOn("autobuild") ? "ON" : "OFF");
        toggle_autobuild_button[0].setAttribute("data-option-id", "");
        toggle_autobuild_button[0].setAttribute("class", toggle_autobuild_button[0].getAttribute("class") + " gcpElement");
        toggle_autobuild_button[0].setAttribute("onclick", "window.localStorage.setItem('autobuild', window.localStorage.getItem('autobuild') == 'ON' ? 'OFF' : 'ON'); $(this.children[0].children[1].children[0]).css('color', window.localStorage.getItem('autobuild') == 'ON' ? 'green' : 'red'); $(this.children[0].children[1].children[0]).text(window.localStorage.getItem('autobuild') == 'ON' ? 'AutoBuild: ON' : 'AutoBuild: OFF');");
        toggle_autobuild_button[0].children[0].children[0].children[0].children[1].setAttribute("data-type", "");
        toggle_autobuild_button[0].children[0].children[0].children[0].children[1].setAttribute("data-subtype", "");
        toggle_autobuild_button[0].children[0].children[0].children[0].children[2].setAttribute("data-indicator-id", "");
        $(toggle_autobuild_button[0].children[0].children[1].children[0]).css("color", await isOn("autobuild") ? "green" : "red");
        toggle_autobuild_button.css("margin-top", "7px");


        // ------------- Autocollect res button ---------------- \\
        toggle_autocollect_button[0].children[0].children[1].children[0].innerText = "AutoCollect: "+ (await isOn("autocollect") ? "ON" : "OFF");
        toggle_autocollect_button[0].setAttribute("data-option-id", "");
        toggle_autocollect_button[0].setAttribute("class", toggle_autocollect_button[0].getAttribute("class") + " gcpElement");
        toggle_autocollect_button[0].setAttribute("onclick", "window.localStorage.setItem('autocollect', window.localStorage.getItem('autocollect') == 'ON' ? 'OFF' : 'ON'); $(this.children[0].children[1].children[0]).css('color', window.localStorage.getItem('autocollect') == 'ON' ? 'green' : 'red'); $(this.children[0].children[1].children[0]).text(window.localStorage.getItem('autocollect') == 'ON' ? 'AutoCollect: ON' : 'AutoCollect: OFF');");
        toggle_autocollect_button[0].children[0].children[0].children[0].children[1].setAttribute("data-type", "");
        toggle_autocollect_button[0].children[0].children[0].children[0].children[1].setAttribute("data-subtype", "");
        toggle_autocollect_button[0].children[0].children[0].children[0].children[2].setAttribute("data-indicator-id", "");
        $(toggle_autocollect_button[0].children[0].children[1].children[0]).css("color", await isOn("autocollect") ? "green" : "red");
        toggle_autocollect_button.css("margin-top", "2px");


        // --------- Autorecruit button --------------
        toggle_autorecruit_button[0].children[0].children[1].children[0].innerText = "AutoRecruit: "+ (await isOn("autorecruit") ? "ON" : "OFF");
        toggle_autorecruit_button[0].setAttribute("data-option-id", "");
        toggle_autorecruit_button[0].setAttribute("class", toggle_autorecruit_button[0].getAttribute("class") + " gcpElement");
        toggle_autorecruit_button[0].setAttribute("onclick", "window.localStorage.setItem('autorecruit', window.localStorage.getItem('autorecruit') == 'ON' ? 'OFF' : 'ON'); $(this.children[0].children[1].children[0]).css('color', window.localStorage.getItem('autorecruit') == 'ON' ? 'green' : 'red'); $(this.children[0].children[1].children[0]).text(window.localStorage.getItem('autorecruit') == 'ON' ? 'AutoRecruit: ON' : 'AutoRecruit: OFF');");
        toggle_autorecruit_button[0].children[0].children[0].children[0].children[1].setAttribute("data-type", "");
        toggle_autorecruit_button[0].children[0].children[0].children[0].children[1].setAttribute("data-subtype", "");
        toggle_autorecruit_button[0].children[0].children[0].children[0].children[2].setAttribute("data-indicator-id", "");
        $(toggle_autorecruit_button[0].children[0].children[1].children[0]).css("color", await isOn("autorecruit") ? "green" : "red");
        toggle_autorecruit_button.css("margin-top", "2px");


        // ------------- Fill to the brim! button ------------------- \\
        fill_to_the_brim[0].children[0].children[1].children[0].innerText = "Fill to the brim!";
        fill_to_the_brim[0].setAttribute("class", fill_to_the_brim[0].getAttribute("class") + " gcpElement");
        fill_to_the_brim[0].setAttribute("data-option-id", "");
        fill_to_the_brim[0].setAttribute("onclick", "window.fill_to_the_brim()");
        window.fill_to_the_brim = fillToTheBrim;
        fill_to_the_brim[0].children[0].children[0].children[0].children[1].setAttribute("data-type", "");
        fill_to_the_brim[0].children[0].children[0].children[0].children[1].setAttribute("data-subtype", "");
        fill_to_the_brim[0].children[0].children[0].children[0].children[2].setAttribute("data-indicator-id", "");
        fill_to_the_brim.css("margin-top", "2px");

        // ------------ Auto-Celebrations button -------------- \\
        auto_celebrations[0].children[0].children[1].children[0].innerText = "AutoCelebration: "+ (await isOn("autocelebration") ? "ON" : "OFF");
        auto_celebrations[0].setAttribute("data-option-id", "");
        auto_celebrations[0].setAttribute("class", auto_celebrations[0].getAttribute("class") + " gcpElement");
        auto_celebrations[0].setAttribute("onclick", "window.localStorage.setItem('autocelebration', window.localStorage.getItem('autocelebration') == 'ON' ? 'OFF' : 'ON'); $(this.children[0].children[1].children[0]).css('color', window.localStorage.getItem('autocelebration') == 'ON' ? 'green' : 'red'); $(this.children[0].children[1].children[0]).text(window.localStorage.getItem('autocelebration') == 'ON' ? 'AutoCelebration: ON' : 'AutoCelebration: OFF');");
        auto_celebrations[0].children[0].children[0].children[0].children[1].setAttribute("data-type", "");
        auto_celebrations[0].children[0].children[0].children[0].children[1].setAttribute("data-subtype", "");
        auto_celebrations[0].children[0].children[0].children[0].children[2].setAttribute("data-indicator-id", "");
        $(auto_celebrations[0].children[0].children[1].children[0]).css("color", await isOn("autocelebration") ? "green" : "red");
        auto_celebrations.css("margin-top", "2px");

        // ------------- Auto-Hide fill button ------------ \\
        auto_hide_fill[0].children[0].children[1].children[0].innerText = "Auto hide fill: "+ (await isOn("autohidefill") ? "ON" : "OFF");
        auto_hide_fill[0].setAttribute("data-option-id", "");
        auto_hide_fill[0].setAttribute("class", auto_celebrations[0].getAttribute("class") + " gcpElement");
        auto_hide_fill[0].setAttribute("onclick", "window.localStorage.setItem('autohidefill', window.localStorage.getItem('autohidefill') == 'ON' ? 'OFF' : 'ON'); $(this.children[0].children[1].children[0]).css('color', window.localStorage.getItem('autohidefill') == 'ON' ? 'green' : 'red'); $(this.children[0].children[1].children[0]).text(window.localStorage.getItem('autohidefill') == 'ON' ? 'Auto hide fill: ON' : 'Auto hide fill: OFF');");
        auto_hide_fill[0].children[0].children[0].children[0].children[1].setAttribute("data-type", "");
        auto_hide_fill[0].children[0].children[0].children[0].children[1].setAttribute("data-subtype", "");
        auto_hide_fill[0].children[0].children[0].children[0].children[2].setAttribute("data-indicator-id", "");
        $(auto_hide_fill[0].children[0].children[1].children[0]).css("color", await isOn("autohidefill") ? "green" : "red");
        auto_hide_fill.css("margin-top", "2px");


        // ------------- Settings button ------------------- \\
        settings[0].children[0].children[1].children[0].innerText = "Settings";
        settings[0].setAttribute("class", fill_to_the_brim[0].getAttribute("class") + " gcpElement");
        settings[0].setAttribute("data-option-id", "");
        settings[0].setAttribute("onclick", "window.openGcpSettings()");
        window.openGcpSettings = openGcpSettings;
        settings[0].children[0].children[0].children[0].children[1].setAttribute("data-type", "");
        settings[0].children[0].children[0].children[0].children[1].setAttribute("data-subtype", "");
        settings[0].children[0].children[0].children[0].children[2].setAttribute("data-indicator-id", "");
        settings.css("margin-top", "2px");

        $(".middle > .content > ul")[0].appendChild(toggle_autobuild_button[0]);
        $(".middle > .content > ul")[0].appendChild(toggle_autocollect_button[0]);
        $(".middle > .content > ul")[0].appendChild(toggle_autorecruit_button[0]);
        $(".middle > .content > ul")[0].appendChild(auto_celebrations[0]);
        $(".middle > .content > ul")[0].appendChild(auto_hide_fill[0]);
        $(".middle > .content > ul")[0].appendChild(fill_to_the_brim[0]);
        $(".middle > .content > ul")[0].appendChild(settings[0]);
    }

}

// Gets ids of villages belonging to the current town
async function getFarmTownsIds(){
    var farm_info = FarmTownOverviewWindowFactory.openFarmTownOverview().collections;
    $(".ui-dialog-titlebar-close.ui-corner-all").click(); await srs();
    // farm_info is a huge object with tons of data. There are two fields - farm_town_models and farm_town_player_relations which are of particular interest to us
    // For the purposes of just getting ids usin just farm_town_models is enough.
    // To understand if a farm belongs to the current town it is necessary to compare city's islands coordinates with those of the village.
    return farm_info.farm_towns.models.filter(farm => farm.attributes.island_x == ITowns.getTown(Game.townId).getIslandCoordinateX() && farm.attributes.island_y == ITowns.getTown(Game.townId).getIslandCoordinateY()).
    map(farm => farm.attributes.id);
}

// the main function, handles the script actions.
async function main_sequence(){

    // isOn(component_name) is checked both in the beginning and in the process for two reasons:
    // 1) The script shouldn't start acting if the component is off (for that part, the IF is responsible)
    // 2) The script must stop as soon as possible if the component was turned off by the player. Hence the second check in the WHILE statement
    // AUTOBUILD component will try to upgrade buildings to the levels specified by the player in the settings
    if(await isOn("autobuild")){
        var starting_city = Game.townName;
        do {
            await buildFirstAvailableBuilding(await getCityBuildingSettings(Game.townId));
            await nextCity();
        } while(Game.townName != starting_city && await isOn("autobuild"));
    }

    // Autocollect component is responsible for automatically collecting resources from villages
    if(await isOn("autocollect")){
        starting_city = Game.townName;
        do {
            var town_ids = await getFarmTownsIds();
            for(var i = 0; i < town_ids.length; i += 1){
                FarmTownWindowFactory.openWindow(town_ids[i]); await rs(500, 1000);
                $(".btn_claim_resources.button.button_new").first().click(); await rs(500, 1000);
                $(".btn_next square.next_prev small.button.button_new").click(); await rs(500, 1000);
                if(! await isOn("autocollect")) break;
            }
            await nextCity();
        } while(Game.townName != starting_city && await isOn("autocollect"))
    }

    // Autorecruiting component will try to recruit units until the player-defined army composition is reached. (e.g. "build 1000 swords, 200 archers").
    if(await isOn("autorecruit")){
        starting_city = Game.townName;
        do {
            var resources = await getCityResources();
            var capacity = await getCityStorageCapacity();

            // the recruiting will only start, if the town has more than 60% of the storage occupied, that is if the storage
            // can hold 10000 of each resource, recruiting will begin when the player's current city has >=6000 stone, silver, wood
            if(resources.wood/capacity > 0.6 && resources.stone/capacity > 0.6 && resources.iron/capacity > 0.6){
                var unit_quotas = await getCityRecruitingSettingsOrDefault(Game.townId);
                var city_troops = await getCityUnits();
                await openBarracks();
                var units_in_training = await getUnitsInTraining();

                // After we got the quotas, current units and units and training, we must see which units we still have to build.
                // the ugly formulation below is a result of a safe check for units in training being undefined, which can be the case
                // In short, the formula reads as follows: if(troops_trained+troops_training < troops_requested) => build (REQUESTED-(trained+in_training)) troops of that type
                for(i = 0; i < GROUND_UNIT_KEYS.length; i += 1) {
                    if(city_troops[GROUND_UNIT_KEYS[i]] + (units_in_training[GROUND_UNIT_KEYS[i]] == undefined ? 0 : units_in_training[GROUND_UNIT_KEYS[i]]) < unit_quotas[GROUND_UNIT_KEYS[i]]){
                        await buildGroundUnit(GROUND_UNIT_KEYS[i], unit_quotas[GROUND_UNIT_KEYS[i]]-city_troops[GROUND_UNIT_KEYS[i]] + (units_in_training[GROUND_UNIT_KEYS[i]] == undefined ? 0 : units_in_training[GROUND_UNIT_KEYS[i]]));
                        if(! await isOn("autorecruit")) break;
                    }
                }
                $(".ui-dialog-titlebar-close.ui-corner-all").click(); await rs(1000, 2000);
                await openDocks();
                units_in_training = await getUnitsInTraining();

                // The same as above applies to the docks.
                for(i = 0; i < SEA_UNIT_KEYS.length; i += 1) {
                    if(city_troops[SEA_UNIT_KEYS[i]] + (units_in_training[SEA_UNIT_KEYS[i]] == undefined ? 0 : units_in_training[SEA_UNIT_KEYS[i]]) < unit_quotas[SEA_UNIT_KEYS[i]]){
                        await buildSeaUnit(SEA_UNIT_KEYS[i], unit_quotas[SEA_UNIT_KEYS[i]]-city_troops[SEA_UNIT_KEYS[i]] + (units_in_training[SEA_UNIT_KEYS[i]] == undefined ? 0 : units_in_training[SEA_UNIT_KEYS[i]]));
                        if(! await isOn("autorecruit")) break;
                    }
                }
            }
            $(".ui-dialog-titlebar-close.ui-corner-all").click(); await rs(1000, 1500);
            await nextCity();
        } while(Game.townName != starting_city && await isOn("autorecruit"))
    }

    // Autocelebration component is responsible for trying to throw celebrations in the city. The celebration is that thing that costs 12k wood 18k stone 12k silver and gives you 1 culture point
    if(await isOn("autocelebration"))
    {
        starting_city = Game.townName;
        do {
            $("#quickbar_dropdown4").click(); await rs(800, 1000);
            $(".btn_city_festival.button_new").click(); await rs(500, 700);
            $(".ui-dialog-titlebar-close.ui-corner-all").click(); await srs();
            await nextCity();
        } while(Game.townName != starting_city && await isOn("autocelebration"))
    }

    // Autohide fill component will add 1000 silver to the spy hide each time the city reaches its maximum silver capacity (only under the condition of the hide being upgraded to level 10)
    if(await isOn("autohidefill")){
        starting_city = Game.townName;
        do{
            if((await getCityResources()).iron == await getCityStorageCapacity() && (await getTownBuildingsLevels()).hide == 10){
                $("#quickbar_dropdown5").click(); await rs(700, 1000); // Open hide
                $(".middle").find("input").last().val("1000"); await rs(500, 700);
                $(".order_confirm.button_new.square").click(); await rs(500, 700);
                $(".btn_wnd.close").click(); await rs(500, 700);
            }
            await nextCity();
        } while(Game.townName != starting_city && await isOn("autohidefill"))
    }

    setTimeout(function(){main_sequence();}, getRandomInt(5000, 10000));
    }


        (function() {
            'use strict';
            $(document).ready(function(){setInterval(function(){draw_interface()}, 1000); setTimeout(function(){main_sequence()}, getRandomInt(5000, 7000));});
            // Your code here...
        })();