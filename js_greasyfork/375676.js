// ==UserScript==
// @name         MouseHunt - GWH Map Color Coder
// @author       Jia Hao (Limerence#0448 @Discord)
// @namespace    https://greasyfork.org/en/users/165918-jia-hao
// @version      1.7
// @description  Colour codes the mice on the GWH map according to the decorations needed to attract them.
// @include      http://code.jquery.com/jquery-1.7.2.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/375676/MouseHunt%20-%20GWH%20Map%20Color%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/375676/MouseHunt%20-%20GWH%20Map%20Color%20Coder.meta.js
// ==/UserScript==

function displayHeader() {

    var miceTab = $(".treasureMapPopup-tabHeader").eq(0);

    if (miceTab.hasClass("active")) { //display header if user looking at mice list
        $(".treasureMapPopup-leftBlock-content-default.gwhMapHeader").css("display", "inline-flex");
    } else { //hide header
        $(".treasureMapPopup-leftBlock-content-default.gwhMapHeader").css("display", "none");
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

    var winterSportsMice = [
        "Sporty Ski Instructor",
        "Young Prodigy Racer",
        "Toboggan Technician",
        "Free Skiing",
        "Nitro Racer",
        "Rainbow Racer",
        "Double Black Diamond Racer",
        "Black Diamond Racer"
    ];

    var toysMice = [
        "Nutcracker",
        "Toy",
        "Slay Ride",
        "Squeaker Claws",
        "Destructoy",
        "Toy Tinkerer",
        "Mad Elf",
        "Elf"
    ];

    var ornamentsMice = [
        "Christmas Tree",
        "Stocking",
        "Candy Cane",
        "Ornament",
        "Missile Toe",
        "Wreath Thief",
        "Ribbon",
        "Snowglobe"
    ];

    var snowMice = [
        "Snow Fort",
        "Snowball Hoarder",
        "S.N.O.W. Golem",
        "Snow Sorceress",
        "Reinbo",
        "Tundra Huntress",
        "Stuck Snowball",
        "Snow Boulder"
    ];

    var fireworksMice = [
        "Frightened Flying Fireworks",
        "New Year's",
        "Party Head"
    ];

    var gwhMaps = [
        "Nice List",
        "Rare Nice List",
        "Naughty List",
        "Rare Naughty List"
    ];

    var mapName = $(".treasureMapPopup-header-title.mapName").text(); //only show gwh decoration headers if it's a GWH map.
    if (gwhMaps.indexOf(mapName) < 0) { //exit function if ajax call is not displaying a GWH map
        return;
    }

    var winterSportsCount = 0;
    var toysCount = 0;
    var ornamentsCount = 0;
    var snowCount = 0;
    var fireworksCount = 0;

    for (var i = 0; i < 20; i++) {

        var mouseObj = $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex").eq(i);
        var mouseName = mouseObj.data("search-term");

        if (winterSportsMice.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#c97c49");
            if (!mouseObj.hasClass("complete")) {
                winterSportsCount++;
            }
        } else if (toysMice.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#f06a60");
            if (!mouseObj.hasClass("complete")) {
                toysCount++;
            }
        } else if (ornamentsMice.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#5ae031");
            if (!mouseObj.hasClass("complete")) {
                ornamentsCount++;
            }
        } else if (snowMice.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#4fcaf0");
            if (!mouseObj.hasClass("complete")) {
                snowCount++;
            }
        } else if (fireworksMice.indexOf(mouseName) > -1) {
            $(".treasureMapPopup-goals-group-goal.treasureMapPopup-searchIndex > div > div > span").eq(i).css("background-color", "#cd87ff");
            if (!mouseObj.hasClass("complete")) {
                fireworksCount++;
            }
        }

    }

    var winterSportsColor = winterSportsCount > 0 ? "#c97c49" : "#949494";
    var toysColor = toysCount > 0 ? "#f06a60" : "#949494";
    var ornamentsColor = ornamentsCount > 0 ? "#5ae031" : "#949494";
    var snowColor = snowCount > 0 ? "#4fcaf0" : "#949494";
    var fireworksColor = fireworksCount > 0 ? "#cd87ff" : "#949494";

    if ($(".treasureMapPopup-leftBlock-content-default.gwhMapHeader").size() == 0) { //only add header if it does not exist

        var isChecked = "";
        try { //get stored checked preference
            if (window.localStorage.getItem('highlightPref') === "uncaught-only") {
                isChecked = "checked";
            }
        } catch (e) {
            console.log('Browser does not support localStorage.');
        }

        var htmlString = "<div class='treasureMapPopup-leftBlock-content-default gwhMapHeader' style='display: inline-flex;margin-bottom: 10px;width: 100%;text-align: center;line-height: 1.5;overflow: hidden'>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + winterSportsColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Winter Sports<br>" + winterSportsCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + toysColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Toys<br>" + toysCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + ornamentsColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Ornaments<br>" + ornamentsCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + snowColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Snow<br>" + snowCount + "</span>" +
            "<span class='treasureMapPopup-goals-group-goal-name' style='background-color: " + fireworksColor + ";width: 20%;font-weight: bold;font-size: 13.5px;'>Fireworks<br>" + fireworksCount + "</span>" +
            "</div><span style='vertical-align: middle;float: right'><input id='highlightMice' type='checkbox' style='vertical-align: middle; '" + isChecked + ">Highlight uncaught mice only.</span>";
        $("[data-tab='map_mice'] .treasureMapPopup-leftBlock-content").prepend(htmlString);
        highlightMice();
    }

    $("#highlightMice").change(highlightMice);
    $(".treasureMapPopup-tabHeaderContainer").on("click", displayHeader);

}

$(document).ajaxSuccess(colorize);