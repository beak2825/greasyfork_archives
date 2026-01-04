// ==UserScript==
// @name         Mousehunt Birthday Map Color Coder
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  MH Birthday event map colour coder
// @author       Lim Yi Qin (@Chirpphixel#8006)
// @match        https://www.mousehuntgame.com/*
// @include      https://apps.facebook.com/mousehunt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379354/Mousehunt%20Birthday%20Map%20Color%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/379354/Mousehunt%20Birthday%20Map%20Color%20Coder.meta.js
// ==/UserScript==

//credits to @Limerence#0448 for his GWH Map Colour Coder! 
//check out his GWH Map Colour Coder here : https://greasyfork.org/en/scripts/375676-mousehunt-gwh-map-color-coder

function displayHeader() {

    var miceTab = $(".treasureMapManagerView-header").eq(0);

    if (miceTab.hasClass("active")) { //display header if user looking at mice list
        $(".treasureMapView-block-content.bdMapHeader").css("display", "inline-flex");
    } else { //hide header
        $(".treasureMapView-block-content.bdMapHeader").css("display", "none");
    }

}

function highlightMice() {

    if ($("#highlightMice").is(":checked")) {
        window.localStorage.setItem('highlightPref', 'uncaught-only');
        for (var i = 0; i < 40; i++) {
            var mouseObj = $(".treasureMapView-goals-group-goal").eq(i);
            if (mouseObj.hasClass("complete")) {
                $(".treasureMapView-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "");
            }
        }
    } else {
        window.localStorage.setItem('highlightPref', 'all');
        colorize();
    }

}

function colorize() {

    var specialMice = [
        "Factory Technician",
        "Vincent, The Magnificent"
    ];

    var standardMice = [
        "Birthday",
        "Buckethead",
        "Dinosuit",
        "Pintail",
        "Present",
        "Sleepwalker",
        "Terrible Twos",
    ];

    var sbMice = [
        "Cheesy Party"
    ];

    var mixingMice = [
         "Force Fighter Blue",
        "Force Fighter Green",
        "Force Fighter Yellow",
        "Force Fighter Red",
        "Force Fighter Pink",
        "Super FighterBot MegaSupreme"
    ];

    var breakMice = [
         "Dance Party",
        "Para Para Dancer",
        "Breakdancer",
        "El Flamenco",
        "Fete Fromager"
    ];

    var pumpMice = [
         "Time Punk",
        "Time Tailor",
        "Time Thief",
        "Reality Restitch"
    ];

    var qaMice = [
        "Cupcake Runner",
        "Cupcake Cutie",
        "Cupcake Candle Thief",
        "Cupcake Camo",
        "Sprinkly Sweet Cupcake Cook"
    ];

    var bdMaps = [
        "Birthday Event Map",
        "Rare Birthday Event Map",
        "Gilded Birthday Event Map",
        "Rare Gilded Birthday Event Map"
    ];


    var mapName = $(".treasureMapManagerView-task.active > .treasureMapManagerView-task-name").text(); //only show gwh decoration headers if it's a BD map.

    if (bdMaps.indexOf(mapName) < 0) { //exit function if ajax call is not displaying a GWH map
        return;
    }


    var specialMiceCount = 0;
    var standardMiceCount = 0;
    var sbMiceCount = 0;
    var mixingMiceCount = 0;
    var breakMiceCount = 0;
    var pumpMiceCount = 0;
    var qaMiceCount = 0;

    for (var i = 0; i < 40; i++) {
        var mouseObj = $(".treasureMapView-goals-group-goal").eq(i);
        var mouseName = $(".treasureMapView-goals-group-goal").eq(i).find(".treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name").text();

        if (specialMice.indexOf(mouseName) > -1) {
            $(".treasureMapView-goals-group-goal > .treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name > span").eq(i).css("background-color", "#c97c49");
            if (!mouseObj.hasClass("complete")) {
                specialMiceCount++;
            }
        } else if (standardMice.indexOf(mouseName) > -1) {
            $(".treasureMapView-goals-group-goal > .treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name > span").eq(i).css("background-color", "#f06a60");
            if (!mouseObj.hasClass("complete")) {
                standardMiceCount++;
            }
        } else if (sbMice.indexOf(mouseName) > -1) {
            $(".treasureMapView-goals-group-goal > .treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name > span").eq(i).css("background-color", "#5ae031");
            if (!mouseObj.hasClass("complete")) {
                sbMiceCount++;
            }
        } else if (mixingMice.indexOf(mouseName) > -1) {
            $(".treasureMapView-goals-group-goal > .treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name > span").eq(i).css("background-color", "#4fcaf0");
            if (!mouseObj.hasClass("complete")) {
                mixingMiceCount++;
            }
        } else if (breakMice.indexOf(mouseName) > -1) {
            $(".treasureMapView-goals-group-goal > .treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name > span").eq(i).css("background-color", "#cd87ff");
            if (!mouseObj.hasClass("complete")) {
                breakMiceCount++;
            }
        }else if (pumpMice.indexOf(mouseName) > -1) {
            $(".treasureMapView-goals-group-goal > .treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name > span").eq(i).css("background-color", "#d3e530");
            if (!mouseObj.hasClass("complete")) {
                pumpMiceCount++;
            }
        } else if (qaMice.indexOf(mouseName) > -1) {
            $(".treasureMapView-goals-group-goal > .treasureMapView-goals-group-goal-padding > .treasureMapView-goals-group-goal-name > span").eq(i).css("background-color", "#30e5ae");
            if (!mouseObj.hasClass("complete")) {
                qaMiceCount++;
            }
        }

    }

    var specialMiceColor = specialMiceCount > 0 ? "#c97c49" : "#949494";
    var standardMiceColor = standardMiceCount > 0 ? "#f06a60" : "#949494";
    var sbMiceColor = sbMiceCount > 0 ? "#5ae031" : "#949494";
    var mixingMiceColor = mixingMiceCount > 0 ? "#4fcaf0" : "#949494";
    var breakMiceColor = breakMiceCount > 0 ? "#cd87ff" : "#949494";
    var pumpMiceColor = pumpMiceCount > 0 ? "#d3e530" : "#949494";
    var qaMiceColor = qaMiceCount > 0 ? "#30e5ae" : "#949494";

    if ($(".treasureMapView-block.bdMapHeader").size() == 0) { //only add header if it does not exist

        var isChecked = "";
        try { //get stored checked preference
            if (window.localStorage.getItem('highlightPref') === "uncaught-only") {
                isChecked = "checked";
            }
        } catch (e) {
            console.log('Browser does not support localStorage.');
        }

        var htmlString = "<div class='treasureMapView-block bdMapHeader' style='display: inline-flex;margin-bottom: 10px;width: 100%;text-align: center;line-height: 1.5;overflow: hidden'>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + specialMiceColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Special<br>" + specialMiceCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + standardMiceColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Standard<br>" + standardMiceCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + sbMiceColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>SB<br>" + sbMiceCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + mixingMiceColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Mixing<br>" + mixingMiceCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + breakMiceColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Break<br>" + breakMiceCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + pumpMiceColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Pump<br>" + pumpMiceCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + qaMiceColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>QA<br>" + qaMiceCount + "</span>" +
            "</div><span style='vertical-align: middle;float: right'>";
        $(".treasureMapView-leftBlock > .treasureMapView-block > .treasureMapView-block-content").prepend(htmlString);
        highlightMice();
    }

    $("#highlightMice").change(highlightMice);
    $(".mousehuntHud-userStat treasureMap").on("click", displayHeader);

}

$(document).ajaxSuccess(colorize);