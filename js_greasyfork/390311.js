// ==UserScript==
// @name         MouseHunt - Geyser Map Helper
// @author       Minka
// @namespace    https://https://greasyfork.org/en/users/354176-rj-min
// @version      1.0
// @description  Colour codes the mice on the Geyser Map according to hunt area
// @include      http://code.jquery.com/jquery-1.7.2.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/390311/MouseHunt%20-%20Geyser%20Map%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/390311/MouseHunt%20-%20Geyser%20Map%20Helper.meta.js
// ==/UserScript==

function displayHeader() {

    var miceTab = $(".treasureMapPopup-tabHeader").eq(0);

    if (miceTab.hasClass("active")) { //display header if user looking at mice list
        $(".treasureMapPopup-leftBlock-content-default.qgMapHeader").css("display", "inline-flex");
    } else { //hide header
        $(".treasureMapPopup-leftBlock-content-default.qgMapHeader").css("display", "none");
    }

}

function highlightMice() {

    if ($("#highlightMice").is(":checked")) {
        window.localStorage.setItem('highlightPref', 'uncaught-only');
        for (var i = 0; i < 20; i++) {
            var mouseObj = $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex").eq(i);
            if (mouseObj.hasClass("complete")) {
                $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "");
            }
        }
    } else {
        window.localStorage.setItem('highlightPref', 'all');
        colorize();
    }

}

function colorize() {

    var qRiver = [
		"Sleepy Merchant",
        "Tiny Saboteur",
        "Pump Raider",
        "Croquet Crusher",
        "Queso Extractor",
        "Queen Quesada"
    ];


    var pPlains = [
        "Spice Seer",
        "Old Spice Collector",
        "Spice Farmer",
        "Granny Spice",
        "Spice Sovereign",
        "Spice Finder",
        "Spice Raider",
        "Spice Reaper",
        "Inferna, The Engulfed"
    ];

    var cQuarry = [
        "Chip Chiseler",
        "Tiny Toppler",
        "Ore Chipper",
        "Rubble Rummager",
        "Nachore Golem",
        "Rubble Rouser",
        "Grampa Golem",
        "Fiery Crusher",
        "Nachous, The Molten"
    ];

    var qGeyserCork = [
        "Fuzzy Drake",
        "Cork Defender",
        "Burly Bruiser",
        "Corky, the Collector",
        "Horned Cork Hoarder",
        "Rambunctious Rain Rumbler",
        "Corkataur"
    ];

    var qGeyserPressure = [
        "Steam Sailor",
        "Warming Wyvern",
        "Vaporior",
        "Pyrehyde",
        "Emberstone Scaled"
    ];

    var qGeyserHunter = [
        "Mild Spicekin",
        "Sizzle Pup",
        "Smoldersnap",
        "Bearded Elder",
        "Ignatia",
        "Cinderstorm",
        "Bruticus, the Blazing",
        "Stormsurge, the Vile Tempest",
        "Kalor'ignis of the Geyser"
    ];

    var QGMaps = [
        "Queso Geyser Treasure Map",
        "Rare Queso Geyser Treasure Map",
        "Queso Canyon Grand Tour Treasure Chest",
        "Rare Queso Canyon Grand Tour Treasure Chest"
    ];

    var mapName = $(".treasureMapPopup-header-title.mapName").text(); //only show QG headers if it's a QG map.
    if (QGMaps.indexOf(mapName) < 0) { //exit function if ajax call is not displaying a QG map
        return;
    }

    var riverCount = 0;
    var plainsCount = 0;
    var quarryCount = 0;
    var gcorkCount = 0;
    var gpressureCount = 0;
    var ghunterCount = 0;

    for (var i = 0; i < 20; i++) {

        var mouseObj = $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex").eq(i);
        var mouseName = mouseObj.data("search-term");

        if (qRiver.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#35b9a6");
            if (!mouseObj.hasClass("complete")) {
                riverCount++;
            }
        } else if (pPlains.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#df8bb9");
            if (!mouseObj.hasClass("complete")) {
                plainsCount++;
            }
        } else if (cQuarry.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#a88663");
            if (!mouseObj.hasClass("complete")) {
                quarryCount++;
            }
        } else if (qGeyserCork.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#a3c1d6");
            if (!mouseObj.hasClass("complete")) {
                gcorkCount++;
            }
        } else if (qGeyserPressure.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#c3a253");
            if (!mouseObj.hasClass("complete")) {
                gpressureCount++;
            }
        } else if (qGeyserHunter.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#c35b53");
            if (!mouseObj.hasClass("complete")) {
                ghunterCount++;
            }
        } 

    }

    var riverColor = riverCount > 0 ? "#35b9a6" : "#949494";
    var plainsColor = plainsCount > 0 ? "#df8bb9" : "#949494";
    var quarryColor = quarryCount > 0 ? "#a88663" : "#949494";
    var gcorkColor = gcorkCount > 0 ? "#a3c1d6" : "#949494";
    var gpressureColor = gpressureCount > 0 ? "#c3a253" : "#949494";
    var ghunterColor = ghunterCount > 0 ? "#c35b53" : "#949494";

    if ($(".treasureMapPopup-leftBlock-content-default.qgMapHeader").size() == 0) { //only add header if it does not exist

        var isChecked = "";
        try { //get stored checked preference
            if (window.localStorage.getItem('highlightPref') === "uncaught-only") {
                isChecked = "checked";
            }
        } catch (e) {
            console.log('Browser does not support localStorage.');
        }

        var htmlString = "<div class='treasureMapPopup-leftBlock-content-default qgMapHeader' style='display: inline-flex;margin-bottom: 10px;width: 100%;text-align: center;line-height: 1.5;overflow: hidden'>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + riverColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>River<br>" + riverCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + plainsColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Plains<br>" + plainsCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + quarryColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Quarry<br>" + quarryCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + gcorkColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Cork<br>" + gcorkCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + gpressureColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Pressure<br>" + gpressureCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + ghunterColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Hunters<br>" + ghunterCount + "</span>" +
            "</div><span style='vertical-align: middle;float: right'><input id='highlightMice' type='checkbox' style='vertical-align: middle; '" + isChecked + ">Highlight uncaught mice only.</span>";
        $("[data-tab='map_mice'] .treasureMapPopup-leftBlock-content").prepend(htmlString);
        highlightMice();
    }

    $("#highlightMice").change(highlightMice);
    $(".treasureMapPopup-tabHeaderContainer").on("click", displayHeader);

}

$(document).ajaxSuccess(colorize);