// ==UserScript==
// @name         aricneto's Report+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds new features and calculations to CoTG scouting reports
// @author       aricneto
// @match        https://*.crownofthegods.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405698/aricneto%27s%20Report%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/405698/aricneto%27s%20Report%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function() {
        //create a button
        var copyReportButton = "<button class='greenb tooltip tooltipstered' style='position: absolute; top: 30px; margin-left: 20px;' id='aric_copyReport'>Copy Report</button>";
        //add it to the game
        $("#reportnextbut").after(copyReportButton);

        //make the button do something
        $('#aric_copyReport').off('click');
        $('#aric_copyReport').click(function () {
            parseScoutInfo().toStringParsing();
        });
    });

    function parseScoutInfo() {
        let scoutReport = {
            reportSubject: document.getElementById("reportSubject").innerText,
            reportDate: document.getElementById("reportDate").innerText,
            success: { 
                units: document.getElementById("unitscoutre").innerText,
                resources: document.getElementById("resscoutre").innerText,
                buildings: document.getElementById("buildscoutre").innerText,
                fortifications: document.getElementById("battlementscoutre").innerText,
            },
            attacker: {
                name: document.getElementById("reportattackerplayer").innerText,
                city: document.getElementById("reportattackercity").innerText.replace(/,/g, ""),
                continent: document.getElementById("reportattackercont").innerText,
                coords: {
                    x: document.getElementById("reportattackercoords").innerText.split(":")[0],
                    y: document.getElementById("reportattackercoords").innerText.split(":")[1],
                }
            },
            defender: {
                name: document.getElementById("reportdefenderplayer").innerText,
                city: document.getElementById("reportdefendercity").innerText.replace(/,/g, ""),
                continent: document.getElementById("reportdefendercont").innerText,
                coords: {
                    x: document.getElementById("reportdefendercoords").innerText.split(":")[0],
                    y: document.getElementById("reportdefendercoords").innerText.split(":")[1],
                }
            },
            resources: {
                wood: document.getElementById("spiedWoodnum").innerText.replace(/,/g, ""),
                stone: document.getElementById("spiedStonenum").innerText.replace(/,/g, ""),
                iron: document.getElementById("spiedIronnum").innerText.replace(/,/g, ""),
                food: document.getElementById("spiedFoodnum").innerText.replace(/,/g, "")
            },
            reportCode: document.getElementsByClassName("shRep")[0].getAttribute("data"),
            buildings: parseBuildings(),
            troops: parseTroops(),
            toStringParsing: function () { // unformatted string for easier parsing with excel sheets (single line)
                var builds = [];
                if (this.buildings != undefined) {
                    for (let i = 0; i < buildingNames.length; i++) {
                        let building = this.buildings[i];
                        builds[i] = [building != undefined ? building : ""];
                    }
                } else {
                    for (let i = 0; i < buildingNames.length; i++) {
                        builds[i] = "";
                    }
                }

                var rtroops = [];
                if (this.troops != undefined) {
                    for (let i = 0; i < simpleTroopNames.length; i++) {
                        let troop = this.troops[i];
                        rtroops[i] = [troop != undefined ? troop : ""];
                    }
                } else {
                    for (let i = 0; i < simpleTroopNames.length; i++) {
                        rtroops[i] = "";
                    }
                }

                //TODO: use COTG API to gather player info (alliance, etc.)
                
                let csvContent = [
                    "START",
                    this.reportDate,
                    this.success.units, this.success.resources, this.success.buildings, this.success.fortifications,
                    this.attacker.name, this.attacker.city, this.attacker.continent, this.attacker.coords.x, this.attacker.coords.y,
                    this.defender.name, this.defender.city, this.defender.continent, this.defender.coords.x, this.defender.coords.y,
                    this.resources.wood, this.resources.stone, this.resources.iron, this.resources.food,
                    builds,
                    rtroops,
                    this.reportCode,
                    "END"
                ];

                navigator.clipboard.writeText(csvContent.join(","));
            }
        }
        return scoutReport;
    }

    var buildingNames = ["Forester\'s Hut","Cabin","Storehouse","Stone Mine","Sentinel Post","Hideaway","Farm Estate","Guard House","Ranger Post","Barracks","Iron Mine","Training Arena","Forum","Villa","Snag Barricade","Sawmill","Stable","Triari Post","Mason\'s Hut","Sorcerer\’s Tower","Equine Barricade","Grain Mill","Academy","Castle","Priestess Post","Rune Barricade","Temple","Smelter","Blacksmith","Ballista Post","Veiled Barricade","Port","Shipyard", "City Wall", "Basilica"];

    var simpleBuildingNames = ["foresterHut", "cabin", "storehouse", "stoneMine", "sentinelPost", "hideaway", "farmEstate", "guardhouse", "rangerPost", "barracks", "ironMine", "trainingArena", "forum", "villa", "snagBarricade", "sawmill", "stable", "triariPost", "masonHut", "sorcererTower", "equineBarricade", "grainMill", "academy", "castle", "priestessPost", "runeBarricade", "temple", "smelter", "blacksmith", "ballistaPost", "veiledBarricade", "port", "shipyard", "cityWall", "basilica"];

    // Parse Scout building rebort
    function parseBuildings() {
        let buildings = [];
    
        let spyTable = document.getElementById("buildSpiedtable");
        // check if buildings have been scouted
        if (spyTable != undefined) {
            spyTable = spyTable.getElementsByTagName("tbody");
        } else {
            return;
        }

        for (let entry of spyTable) {
            let tags = entry.getElementsByTagName("td");
            if (tags.length == 2 && tags[1].id == "buildSpiedTotLev") {
                let i = buildingNames.indexOf(tags[0].title);
                if (i != undefined) {
                    buildings[i] = tags[1].innerText;
                }
            }
        }

       return buildings;
    }
    

    var simpleTroops = ["guardtooltip", "vanqtooltip", "rangtooltip", "triatooltip", "scouttooltip", "arbtooltip", "horstooltip", "sorctooltip", "druitooltip", "legitooltip", "praetooltip", "senatooltip", "ramtooltip", "balltooltip", "scortooltip", "stintooltip", "galtooltip", "wstooltip"];

    var simpleTroopNames = ["guard", "vanq", "rang", "tria", "scout", "arb", "hors", "sorc", "drui", "legi", "prae", "sena", "ram", "ball", "scor", "stin", "gal", "ws"];

    function parseTroops() {
        let troops = [];

        let spyTable = document.getElementById("reportdefendTStable");
        let survived = document.getElementsByClassName("repnumtrb");

        if (spyTable != undefined && survived[3] != undefined) {
            spyTable = spyTable.getElementsByClassName("repimgrow");
            survived = survived[3].getElementsByClassName("repnumrow");
        } else {
            return;
        }
        
        for (let i = 0; i < spyTable.length; i++){
            let troop = spyTable[i].classList;
            let numSurvived = survived[i].innerText;
            if (troop.length == 2){
                let i = simpleTroops.indexOf(troop[1]);
                troops[i] = numSurvived.replace(/,/g, "");
            }
        }

        return troops;
    }
    
    // Turns array onto csv and writes it into clipboard
    function toCsv(infoArray) {
        var csvContent = "";

        infoArray.forEach(function (rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        // Write to clipboard
        navigator.clipboard.writeText(csvContent);

        return csvContent;
    }

})();