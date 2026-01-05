// ==UserScript==
// @name        Pardus Starbase Logger
// @author      Math (Orion)
// @namespace   fear.math@gmail.com
// @description Logs various data about starbases such as location, stockpiles, missiles, squads, population, etc.
// @include     http*://orion.pardus.at/main.php*
// @include     http*://orion.pardus.at/starbase_trade.php*
// @include     http*://orion.pardus.at/starbase.php*
// @include     http*://orion.pardus.at/planet.php*
// @include     http*://orion.pardus.at/ship_equipment.php?sort=weapon
// @include     http*://orion.pardus.at/shipyard.php*
// @include     http*://orion.pardus.at/hire_squadrons.php*
// @include     http*://orion.pardus.at/statistics.php*
// @version     2.11.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11014/Pardus%20Starbase%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/11014/Pardus%20Starbase%20Logger.meta.js
// ==/UserScript==

//A whole bunch of giant integers used to match the data we gather with the right box in the google form. Just leave them alone. :P
const idEntry      = 739792085;
const sectorEntry  = 73407189;
const coordsEntry  = 1620987660;
const nameEntry    = 932022425;
const tradeEntry   = 771089909;
const creditsEntry = 429260807;
const workersEntry = 134005076;
const ownerEntry   = 1541790867;
const missileEntry = 902999506;

const shipEntry = {
    'Sabre'              : 579755107,
    'Wasp'               : 1566988664,
    'Rustclaw'           : 1860434988,
    'Adder'              : 954035102,
    'Interceptor'        : 1329130975,
    'Thunderbird'        : 1743300736,
    'Viper Defence Craft': 642938825,
    'Harrier'            : 2110595096,
    'Mercury'            : 1352058358,
    'Babel Transporter'  : 1190389262,
    'Piranha'            : 1240151411,
    'Hercules'           : 1088702902,
    'Hawk'               : 1003315136,
    'Nighthawk'          : 1078301396,
    'Gargantua'          : 34395974,
    'Nighthawk Deluxe'   : 405559882,
    'Mantis'             : 702478293,
    'Extender'           : 718747336,
    'Behemoth'           : 1469810423,
    'Gauntlet'           : 1418836800,
    'Liberator'          : 1859350143,
    'Leviathan'          : 1391451691,
    'Doomstar'           : 802093148,
    'War Nova'           : 718810478
};

const fightersEntry = 1798794895;
const bombersEntry  = 1575901099;
const sbStatsEntry  = [1031727216, 1090285757, 918357285];  // [fed, emp, uni]

const sbBuildingsEntry = {
    '6,4' : 342049662,    //N1
    '8,6' : 1376824638,   //E1
    '6,8' : 74329350,     //S1
    '4,6' : 1679286567,   //W1
    '6,3' : 685061780,    //N2
    '9,6' : 984516563,    //E2
    '6,9' : 1744397113,   //S2
    '3,6' : 1267051523,   //W2
    '6,2' : 1836586568,   //N3
    '10,6': 1343034245,   //E3
    '6,10': 1800559274,   //S3
    '2,6' : 885585088,    //W3
    '6,1' : 1765051363,   //N4
    '11,6': 1132333774,   //E4
    '6,11': 1167393436,   //S4
    '1,6' : 809414536     //W4
};

// Do not send identical logs more than once every 10 minutes.
const MIN_TIME = 10 * 60 * 1000;

var dataStr = '';
var data = {
    starbase : {
        buildings : {},
        commodities : {},
        equipment : {
            weapons : {},
            drives : {},
            armors : {},
            shields : {},
            specials : {}
        },
        ships : {},
        squads : {}
    },
    pardusCluster : {
        PFC : {},
        PEC : {},
        PUC : {}
    }
};

if (location.href.includes("main.php")) {
    // Find the sector, coords, and tile id. If necessary trim away links (such as if QI Augmenter executes first and makes the coordinates a link to a map).
    var sector = document.getElementById("sector").innerHTML;
    if (sector.indexOf("<") > -1) {
        sector = document.getElementById("sector").firstChild.innerHTML;
    }

    var coords = document.getElementById("coords").innerHTML;
    if (coords.indexOf("<") > -1) {
        coords = document.getElementById("coords").firstChild.innerHTML;
    }

    var userLoc = unsafeWindow.userloc;

    if (document.body.innerHTML.indexOf('Exit inner starbase') > -1) {
        // We're inside a SB, so record the different SB buildings we can see and their locations.
        addIdAndSectorAndCoordsToDataStr();

        // Since we're in a SB, the "sector" name is really the SB name.
        var baseName = sector;
        addToDataStr(nameEntry, baseName);
        data.starbase.name = baseName;

        // Define abbreviations for the lengthy SB building names
        const buildingAbbreviations = {
            'armor_factory'            : 'Armor',
            'shield_factory'           : 'Shield',
            'engines_factory'          : 'Drive',
            'weapons_factory'          : 'Weapon',
            'special_equipment_factory': 'Special',
            'shipyard_small'           : 'Sml Ship',
            'shipyard_medium'          : 'Med Ship',
            'shipyard_huge'            : 'Huge Ship',
            'light_defense_artillery'  : 'LDA',
            'defense_artillery'        : 'SDA',
            'heavy_defense_artillery'  : 'HDA',
            'repair_facility'          : 'Repair',
            'warehouse'                : 'Warehouse',
            'scanner'                  : 'SRS'
        };

        var coordsArray = coords.replace(/\[|\]/g, '').split(',');
        var xShip       = parseInt(coordsArray[0]);
        var yShip       = parseInt(coordsArray[1]);
        var topLeftId   = userLoc - 13 * xShip - yShip; // Inner SB is a 13x13 grid.

        //First record all buildings in view.
        var navTable  = document.getElementById('navarea');
        var buildings = navTable.getElementsByClassName('navBuilding');

        var tileId, xBuild, yBuild, buildingCoords;

        for (var i = 0; i < buildings.length; i++) {
            // Figure out building coords by comparing its tile id to the top left id to figure out its relative position.
            let tileLink = buildings[i].firstChild.getAttribute("onclick");

            // If there is no link on the tile, it must be the ship's tile
            if (!tileLink) {
                xBuild = xShip;
                yBuild = yShip;
            }
            else {
                tileId = parseInt(tileLink.match(/\d+/)[0]);
                xBuild = Math.floor((tileId - topLeftId) / 13);
                yBuild = (tileId - 13 * xBuild) - topLeftId;
            }

            buildingCoords = xBuild + ',' + yBuild;

            // If it's one of the player-made SB buildings (i.e. not a hab ring or CC), record the building type.
            if (sbBuildingsEntry[buildingCoords]) {
                let buildingName = 'Error';
                let tileImageUrl = buildings[i].firstChild.firstChild.src;

                Object.keys(buildingAbbreviations).forEach(function(buildingImageUrl) {
                    if (tileImageUrl.indexOf(buildingImageUrl) > -1) {
                        buildingName = buildingAbbreviations[buildingImageUrl];
                    }
                });

                addToDataStr(sbBuildingsEntry[buildingCoords], buildingName);
                data.starbase.buildings[buildingCoords] = buildingName;
            }
        }

        // Next, record any empty building slots in view.
        var notBuildings = navTable.getElementsByClassName('navClear');
        var tileId, xCoord, yCoord, tileCoords, tileType, image;

        for (var i = 0; i < notBuildings.length; i++) {
            //Check if the background image matches an empty slot.
            image = notBuildings[i].firstChild.firstChild.src;
            if (image.indexOf('ground_hor') > -1 || image.indexOf('ground_ver') > -1) {
                //Figure out tile coords by comparing its tile id to the top left id to figure out its relative position.
                tileId = parseInt(notBuildings[i].firstChild.getAttribute("onclick").match(/\d+/)[0]);
                xCoord = Math.floor((tileId - topLeftId) / 13);
                yCoord = (tileId - 13 * xCoord) - topLeftId;
                tileCoords = xCoord + ',' + yCoord;
                addToDataStr(sbBuildingsEntry[tileCoords], 'Empty');
                data.starbase.buildings[tileCoords] = 'Empty';
            }
        }

        //We have to check if our ship is on an empty building slot seperately.
        if (navTable.getElementsByClassName('navShip')[0]) {
            var ourTile = navTable.getElementsByClassName('navShip')[0];
            //Check if the background image matches an empty slot.
            image = ourTile.getAttribute('style');
            if (image.indexOf('ground_hor') > -1 || image.indexOf('ground_ver') > -1) {
                tileCoords = xShip + ',' + yShip;
                addToDataStr(sbBuildingsEntry[tileCoords], 'Empty');
                data.starbase.buildings[tileCoords] = 'Empty';
            }
        }

        //Finally, if we can see the end of any pylon, then we know how many rings there are and thus the outer rings have no slots available.
        var tileId, xCoord, yCoord, tileCoords, tileType, image;
        var foundEnd = false; //Have we found the end of a pylon yet? (Only need to find one.)
        for (var i = 0; i < notBuildings.length; i++) {
            //Check if the background image matches the end of a pylon.
            image = notBuildings[i].firstChild.firstChild.src;
            if (image.indexOf('groundend') > -1) {
                //Figure out tile coords by comparing its tile id to the top left id to figure out its relative position.
                tileId = parseInt(notBuildings[i].firstChild.getAttribute("onclick").match(/\d+/)[0]);
                xCoord = Math.floor((tileId - topLeftId) / 13);
                yCoord = (tileId - 13 * xCoord) - topLeftId;
                foundEnd = true;
                break; //Every end of pylon gives us the same info, so no need to look for more.
            }
        }
        if (!foundEnd) {

            //We have not found the end of a pylon yet. Last place to check is under the ship!
            var ourTile = navTable.getElementsByClassName('navShip')[0];
            //Check if the background image matches the end of a pylon.
            image = ourTile.getAttribute('style');
            if (image.indexOf('groundend') > -1) {
                xCoord = xShip;
                yCoord = yShip;
                foundEnd = true;
            }
        }

        //Based on the coordinates of the pylon ending we found, we know certain rings do no exist.
        if (foundEnd) {
            if (xCoord + yCoord >= 9 && xCoord + yCoord <= 15) {
                //No second ring.
                addToDataStr(sbBuildingsEntry['6,3'], '-');
                addToDataStr(sbBuildingsEntry['9,6'], '-');
                addToDataStr(sbBuildingsEntry['6,9'], '-');
                addToDataStr(sbBuildingsEntry['3,6'], '-');
                data.starbase.buildings['6,3'] = '-';
                data.starbase.buildings['9,6'] = '-';
                data.starbase.buildings['6,9'] = '-';
                data.starbase.buildings['3,6'] = '-';
            }
            if (xCoord + yCoord >= 8 && xCoord + yCoord <= 16) {
                //No third ring.
                addToDataStr(sbBuildingsEntry['6,2'], '-');
                addToDataStr(sbBuildingsEntry['10,6'], '-');
                addToDataStr(sbBuildingsEntry['6,10'], '-');
                addToDataStr(sbBuildingsEntry['2,6'], '-');
                data.starbase.buildings['6,2'] = '-';
                data.starbase.buildings['10,6'] = '-';
                data.starbase.buildings['6,10'] = '-';
                data.starbase.buildings['2,6'] = '-';
            }
            if (xCoord + yCoord >= 7 && xCoord + yCoord <= 17) {
                //No fourth ring.
                addToDataStr(sbBuildingsEntry['6,1'], '-');
                addToDataStr(sbBuildingsEntry['11,6'], '-');
                addToDataStr(sbBuildingsEntry['6,11'], '-');
                addToDataStr(sbBuildingsEntry['1,6'], '-');
                data.starbase.buildings['6,1'] = '-';
                data.starbase.buildings['11,6'] = '-';
                data.starbase.buildings['6,11'] = '-';
                data.starbase.buildings['1,6'] = '-';
            }
        }

        sendData();

    } else {
        //We're not in a SB, so check if we're sitting on one.
        var centreTileNum = (unsafeWindow.fieldsTotal - 1) / 2;
        var centreTileCell = document.getElementById("tdNavField" + centreTileNum);
        if (centreTileCell.classList.contains("navStarbase")) {
            //We're sitting on a SB, so record the sector, coords, and tile id in a local variable.
            GM_setValue("currentSector", sector);
            GM_setValue("currentCoords", coords);
            GM_setValue("currentuserLoc", userLoc);
        }
    }

} else if (location.href.indexOf("starbase_trade.php") > -1) {

    addIdAndSectorAndCoordsToDataStr();

    //Find the name of the SB
    var links = document.getElementsByTagName("A");
    var baseName;
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("starbase.php") > -1) {
            baseName = links[i].innerHTML;
            break;
        }
    }

    addToDataStr(nameEntry, baseName);
    data.starbase.name = baseName;

    //Find the name, amount, min, max, sell, and buy prices of the SB
    var commodity = unsafeWindow.res_names;
    var amount = unsafeWindow.amount;
    var min = unsafeWindow.amount_min;
    var max = unsafeWindow.amount_max;
    var sell = unsafeWindow.player_buy_price; //backwards to switch to SB perspective
    var buy = unsafeWindow.player_sell_price; //backwards to switch to SB perspective

    var tradeData = '';
    for (var index in amount) {
        tradeData += ";" + commodity[index] + ";" + amount[index] + ";" + min[index] + ";" + max[index] + ";" + sell[index] + ";" + buy[index];
        data.starbase.commodities[commodity[index]] = {
            amount : amount[index],
            min : min[index],
            max : max[index],
            sell : sell[index],
            buy : buy[index]
        };
    }

    tradeData = tradeData.replace(/;/, '');
    addToDataStr(tradeEntry, tradeData);

    data.starbase.freeSpace = unsafeWindow.obj_space;

    //Check how many credits are in the SB
    var credits = unsafeWindow.obj_credits;
    addToDataStr(creditsEntry, credits);
    data.starbase.credits = credits;

    //Calculate the (approximate) number of workers
    var foodBal = document.getElementById("baserow1").cells[3].firstChild.firstChild.innerHTML;
    var workers = Math.floor(-1000 * foodBal / 3);
    addWorkersToDataStr(workers, false);

    sendData();

} else if (location.href.indexOf("starbase.php") > -1) {

    addIdAndSectorAndCoordsToDataStr();

    //get SB name
    var baseName;
    var spans = document.getElementsByTagName("span");
    for (i = 0; i < spans.length; i++) {
        if (spans[i].style.cssText === "font-size: 24px; line-height: 29px; font-weight: bold;") {
            baseName = spans[i].innerHTML;
        }
    }

    addToDataStr(nameEntry, baseName);
    data.starbase.name = baseName;

    //get SB owner's name
    var baseOwner, ownerTable;
    var tables = document.getElementsByTagName("table");
    for (i = 0; i < tables.length; i++) {
        if (tables[i].style.cssText === 'margin-bottom: 10px;') {
            ownerTable = tables[i];
            break;
        }
    }

    var links = ownerTable.getElementsByTagName("a");
    for (i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("sendmsg") > -1) {
            baseOwner = links[i].innerHTML;
        }
    }

    addToDataStr(ownerEntry, baseOwner);
    data.starbase.owner = baseOwner;

    //get (exact) number of Workers
    var workers;
    for (i = 0; i < spans.length; i++) {
        if (spans[i].style.cssText === 'font-size: 9px;') {
            workers = spans[i].innerHTML;
            //trim the string to everything before '|'
            workers = workers.substring(0, workers.indexOf('|'));
            //remove all non-digits
            workers = workers.replace(/\D/g, '');
        }
    }
    addWorkersToDataStr(workers, true);

    sendData();

} else if (location.href.indexOf("ship_equipment.php?sort=weapon") > -1) {

    addIdAndSectorAndCoordsToDataStr();

    //get SB or planet's name
    var links = document.getElementsByTagName("a");
    var baseName;
    for (i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("starbase.php") > -1 || links[i].href.indexOf("planet.php") > -1) {
            baseName = links[i].innerHTML;
        }
    }
    //trim "Return to ... 's menu"
    baseName = baseName.substring(10, baseName.indexOf("'"));
    addToDataStr(nameEntry, baseName);
    data.starbase.name = baseName;

    // Get number of missiles
    var table = document.getElementsByClassName("messagestyle")[0];
    var available;
    var missileData = "";
    var text = table.innerHTML;
    if (text.indexOf("Imperial") > -1) {
        for (i = 0; i < 14; i++) {
            available = table.rows[i + 1].cells[6].innerHTML;
            //if 0 are available, it will be red and bold, so trim this extra HTML away
            if (available.indexOf("<") > -1) {
                available = table.rows[i + 1].cells[6].firstChild.firstChild.innerHTML;
            }
            missileData = missileData + "," + available;
        }
    }
    else {
        for (i = 0; i < 5; i++) {
            available = table.rows[i + 1].cells[6].innerHTML;
            //if 0 are available, it will be red and bold, so trim this extra HTML away
            if (available.indexOf("<") > -1) {
                available = table.rows[i + 1].cells[6].firstChild.firstChild.innerHTML;
            }
            missileData = missileData + "," + available;
        }
    }

    for (let i = 1; i < table.rows.length; i++) {
        name = table.rows[i].cells[0].innerText.trim();
        available = Number(table.rows[i].cells[6].innerText);
        data.starbase.equipment.weapons[name] = available;
    }

    missileData = missileData.replace(/,/, ""); //trim the first comma
    addToDataStr(missileEntry, missileData);

    sendData();

} else if (location.href.indexOf("shipyard.php") > -1) {

    addIdAndSectorAndCoordsToDataStr();

    //get SB or planet's name
    var links = document.getElementsByTagName("a");
    var baseName;
    for (i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("starbase.php") > -1 || links[i].href.indexOf("planet.php") > -1) {
            baseName = links[i].innerHTML;
        }
    }
    //trim "Return to ... 's menu"
    baseName = baseName.substring(10, baseName.indexOf("'"));
    addToDataStr(nameEntry, baseName);
    data.starbase.name = baseName;

    //get number of ships in stock
    var tables = document.getElementsByTagName("table");
    var shipTable;
    for (i = 0; i < tables.length; i++) {
        if (tables[i].style.cssText.indexOf('bg.gif') > -1) {
            shipTable = tables[i];
            break;
        }
    }

    var shipName, available;
    for (let i = 1; i < shipTable.rows.length; i++) {
        shipName = shipTable.rows[i].cells[1].innerText;
        available = Number(shipTable.rows[i].cells[2].innerText);

        data.starbase.ships[shipName] = available;

        if (shipEntry[shipName]) {
            addToDataStr(shipEntry[shipName], available);
        }
    }

    sendData();

} else if (location.href.indexOf("hire_squadrons.php") > -1) {

    addIdAndSectorAndCoordsToDataStr();

    //get SB name
    var links = document.getElementsByTagName("a");
    var baseName;
    for (i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("starbase.php") > -1) {
            baseName = links[i].innerHTML;
            break;
        }
    }

    addToDataStr(nameEntry, baseName);
    data.starbase.name = baseName;

    //get array of squad tables
    var tables = document.getElementsByTagName("table");
    var squadTables = [];
    for (i = 0; i < tables.length; i++) {
        if (tables[i].style.cssText.indexOf('bgd.gif') > -1) {
            squadTables.push(tables[i]);
        }
    }

    //get the size of each fighter and bomber
    var fighters = '';
    var bombers = '';
    var squad, size;
    for (i = 0; i < squadTables.length; i++) {
        squad = squadTables[i].rows[0].cells[0].children[1].innerHTML;
        size = Number(squad.split(' ')[0]);
        type = squad.split(' ')[1];
        squadId = squadTables[i].rows[0].cells[0].lastChild.firstChild.firstChild.href.replace(/\D/g, '');

        data.starbase.squads[squadId] = { type, size };

        if (type == 'Fighter') {
            fighters += ", " + size;
        } else {
            bombers += ", " + size;
        }
    }

    //remove leading comma
    fighters = fighters.replace(/, /, '');
    bombers = bombers.replace(/, /, '');
    addToDataStr(fightersEntry, fighters);
    addToDataStr(bombersEntry, bombers);

    sendData();

} else if (location.href.indexOf("statistics.php") > -1) {

    //send userid only, sector and coords are meaningless
    var userid = unsafeWindow.userid;
    addToDataStr(idEntry, userid);
    data.user = userid;

    //get table of PFC, PEC, and PUC SBs
    var tables = document.getElementsByTagName("table");
    var sbTables = [];
    for (i = 0; i < tables.length; i++) {
        if (tables[i].width === '90%') {
            sbTables.push(tables[i]);
        }
    }

    const pardusClusters = ['PFC', 'PEC', 'PUC'];

    //For each P*C, get SB names and populations and combine into one string to send to the google doc.
    for (i = 0; i < 3; i++) {
        var table = sbTables[i];
        var result = '';
        var baseName, workers;
        for (j = 1; j < table.rows.length; j++) {
            baseName = table.rows[j].cells[2].innerHTML;
            workers = table.rows[j].cells[3].innerHTML.replace(/,/g, ''); //remove commas
            data.pardusCluster[pardusClusters[i]][baseName] = Number(workers);
            result += ";" + baseName + ";" + workers;
        }
        result = result.replace(/;/, ''); //remove leading semicolon
        //Add result (i=0,1,2 corresponds to Fed, Emp, Uni) to data string
        addToDataStr(sbStatsEntry[i], result);
    }

    sendData();
}

function sendData() {
    console.log(data);

    //Remove leading ampersand
    dataStr = dataStr.replace(/&/, '');

    // Don't send the same log twice in a short time to prevent nav spam generating thousands of logs
    let lastDataStr     = GM_getValue('sbLoggerDataStr');
    let lastTimestamp   = GM_getValue('sbLoggerTimestamp');

    if (dataStr == lastDataStr && Date.now() - lastTimestamp < MIN_TIME) {
        return;
    }

    GM_setValue('sbLoggerDataStr', dataStr);
    GM_setValue('sbLoggerTimestamp', Date.now());

    //Send data to google form
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://docs.google.com/forms/d/1CoIqDfFOscVUBUSncXJNaDKMkFg5W3ckCwI3N8sZr5I/formResponse",
        data: dataStr,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    });
}

function addIdAndSectorAndCoordsToDataStr() {
    var userid = unsafeWindow.userid;
    addToDataStr(idEntry, userid);
    data.user = userid;
    //Off the nav screen, Pardus will only tell you the tile id, so check that the stored tile id is correct to make sure partial refresh didn't screw us up.
    //If everything is good, grab the stored sector and coords.
    var sector, coords;
    if (GM_getValue("currentuserLoc", "undefined") == unsafeWindow.userloc) {
        sector = GM_getValue("currentSector", "undefined");
        coords = GM_getValue("currentCoords", "undefined");
    }

    if (sector) {
        addToDataStr(sectorEntry, sector);
        data.starbase.sector = sector;
    }

    if (coords) {
        addToDataStr(coordsEntry, coords);
        coords = coords.replace(/\[|\]/g, '').split(',');
        let x = Number(coords[0]);
        let y = Number(coords[1]);
        data.starbase.coords = { x, y };
    }
}

function addToDataStr(entry, value) {
    dataStr += "&entry." + entry + "=" + value;
}

function addWorkersToDataStr(workers, exact) {
    //Based on the number of workers, we can determine which rings cannot have buildings on them.
    if (workers < 30000) {
        addToDataStr(sbBuildingsEntry['6,1'], '-');
        addToDataStr(sbBuildingsEntry['11,6'], '-');
        addToDataStr(sbBuildingsEntry['6,11'], '-');
        addToDataStr(sbBuildingsEntry['1,6'], '-');
        data.starbase.buildings['6,1'] = '-';
        data.starbase.buildings['11,6'] = '-';
        data.starbase.buildings['6,11'] = '-';
        data.starbase.buildings['1,6'] = '-';
    }
    if (workers < 15000) {
        addToDataStr(sbBuildingsEntry['6,2'], '-');
        addToDataStr(sbBuildingsEntry['10,6'], '-');
        addToDataStr(sbBuildingsEntry['6,10'], '-');
        addToDataStr(sbBuildingsEntry['2,6'], '-');
        data.starbase.buildings['6,2'] = '-';
        data.starbase.buildings['10,6'] = '-';
        data.starbase.buildings['6,10'] = '-';
        data.starbase.buildings['2,6'] = '-';
    }
    if (workers < 5000) {
        addToDataStr(sbBuildingsEntry['6,3'], '-');
        addToDataStr(sbBuildingsEntry['9,6'], '-');
        addToDataStr(sbBuildingsEntry['6,9'], '-');
        addToDataStr(sbBuildingsEntry['3,6'], '-');
        data.starbase.buildings['6,3'] = '-';
        data.starbase.buildings['9,6'] = '-';
        data.starbase.buildings['6,9'] = '-';
        data.starbase.buildings['3,6'] = '-';
    }

    data.starbase.population = Number(workers);
    data.starbase.populationIsExact = exact;

    //If the number of workers is not exact (due to calculating it from trade screen data), then add a '~' to denote this.
    if (!exact) {
        workers = '~' + workers;
    }

    //Add workers to data string.
    addToDataStr(workersEntry, workers);
}


//----------GOSSIP LOGGER-----------//


//Tells the script where in the google form to put the data
var gossipEntry = 874984780;

//Find and store the div elements which contain gossip in an array called rumours.
var divs = document.getElementsByTagName("div");
var rumours = [];
var style;
for (var i = 0; i < divs.length; i++) {
    style = divs[i].style.cssText;
    if (style.indexOf('rgba(0, 0, 0, 0.4)') > -1) {
        rumours.push(divs[i]);
    }
}

//For each rumour, check if it's of a type that lists a pilot's location, and if so grab the relevant info.
var gossipData = "";
var name, loc, gossiperType, links, text, start, end, buildingType;
for (var i = 0; i < rumours.length; i++) {
    gossiperType = rumours[i].firstChild.title;
    text = rumours[i].innerHTML;
    if (gossiperType.indexOf("Hunter") > -1 && text.indexOf("Tearing down") > -1) {

        //The Bounty Hunter's message for bountied buildings

        //name
        links = rumours[i].getElementsByTagName("a");
        name = links[0].innerHTML + " Building";

        //building type
        start = text.indexOf('</a> ') + 5; //5 is the length of "</a> "
        end = text.indexOf('</b>', start);
        buildingType = text.substring(start, end);

        //location
        start = text.lastIndexOf('<b>') + 3; //3 is the length of "<b>"
        end = text.lastIndexOf('</b>');
        loc = text.substring(start, end);

        gossipData = gossipData + ":" + name + ";" + buildingType + " at " + loc;

    } else if (gossiperType.indexOf("Activist") > -1 || (gossiperType.indexOf("Trader") > -1 && text.indexOf("starbase") == -1 && text.indexOf("planet") == -1)) {

        //The Trader or Activist's message for a building

        //name
        links = rumours[i].getElementsByTagName("a");
        name = links[0].innerHTML + "'s Building";

        //building type
        start = text.indexOf('<b>') + 3; //3 is the length of "<b>"
        end = text.indexOf('</b>');
        buildingType = text.substring(start, end);

        //location
        start = text.indexOf('<b>', start) + 3; //This is the start of the pilot name
        start = text.indexOf('<b>', start) + 3; //3 is the length of "<b>"
        end = text.indexOf('</b>', start);
        loc = text.substring(start, end);

        gossipData = gossipData + ":" + name + ";" + buildingType + " at " + loc;

    } else if (gossiperType.indexOf("Gossiper") == -1 && gossiperType.indexOf("Trader") == -1) {

        //The gossiper and non-Building Trader give useless info, but everything else left we can treat the same way

        //name
        links = rumours[i].getElementsByTagName("a");
        name = links[0].innerHTML;

        //location
        start = text.lastIndexOf('<b>') + 3; //3 is the length of "<b>"
        end = text.lastIndexOf('</b>');
        loc = text.substring(start, end);

        gossipData = gossipData + ":" + name + ";" + loc;

    }
}

//Send data to spreadsheet
if (gossipData.length > 0) {
    gossipData = "entry." + gossipEntry + "=" + gossipData.replace(/:/, '');
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSedYc0y5T3pfw6FOAWr4ZsRDueuvIk2xhD5NKLpKMMtwxeceQ/formResponse",
        data: gossipData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    });
}
