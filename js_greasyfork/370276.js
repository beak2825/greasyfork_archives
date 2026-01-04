// ==UserScript==
// @name         MouseHunt - Display Hunter ID on Profiles
// @author       Jia Hao (Limerence#0448 @Discord)
// @namespace    https://greasyfork.org/en/users/165918-jia-hao
// @version      1.3
// @description  Display the Hunter ID at the profile page (even for hunters that you have not added). Useful for inviting a person to your map without asking for their Hunter ID.
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/370276/MouseHunt%20-%20Display%20Hunter%20ID%20on%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/370276/MouseHunt%20-%20Display%20Hunter%20ID%20on%20Profiles.meta.js
// ==/UserScript==

function initHunterID() {

    var rankColors = {
        "Fabled": "#ffd52d",
        "Sage": "#86ffe8",
        "Elder": "#4cfafa",
        "Viceroy": "#b13ed8",
        "Archduke": "#e281f1",
        "Archduchess": "#e281f1",
        "Archduke/Archduchess": "#e281f1",
        "Grand Duke": "#65da8c",
        "Grand Duchess": "#65da8c",
        "Grand Duke/Duchess": "#65da8c",
        "Duke": "#ff9a47",
        "Duchess": "#ff9a47",
        "Duke/Duchess": "#ff9a47",
        "Count": "#f36858",
        "Countess": "#f36858",
        "Count/Countess": "#f36858",
        "Baron": "#e4c461",
        "Baroness": "#e4c461",
        "Baron/Baroness": "#e4c461",
        "Lord": "#30c1cf",
        "Lady": "#30c1cf",
        "Lord/Lady": "#30c1cf",
        "Knight": "#c7c355",
        "Hero": "#db4883",
        "Legendary": "#40af5f",
        "Grandmaster": "#3f6ebd",
        "Master": "#8a4bb3",
        "Journeyman": "#fd6807",
        "Journeywoman": "#fd6807",
        "Journeyman/Journeywoman": "#fd6807",
        "Initiate": "grey",
        "Apprentice": "grey",
        "Recruit": "grey"
    };

    //Thanks to Tsitu for finding a cleaner way to grep the ID and Rank. :D
    var hunterRank = document.querySelector("meta[property='og:description']").content.split(" in MouseHunt")[0].split("is a ")[1];
    var hunterID = document.querySelector("meta[property='og:url']").content.split("uid=")[1];

    //In case the data is not available.
    //Getting the rank was trickier than expected. Future reference: https://stackoverflow.com/questions/3442394/using-text-to-retrieve-only-text-not-nested-in-child-tags
    if (!hunterRank) hunterRank = $('div:contains("Hunter\'s Title: ")').clone().children().remove().end().text().trim().substring(12).split(" (")[0];
    if (!hunterID) hunterID = $(".messageBoardView").data("owner-unique-id");

    var color = rankColors[hunterRank];

    //Little easter egg here... :P
    var easterEggs = {
        "5770707": "#6ab5f8",
        "4503423": "#6ab5f8",
        "5101478": "#6ab5f8",
        "53772": "#d81212"
    };
    var easterList = ["5770707", "4503423", "5101478", "53772"];
    for (var i = 0; i < easterList.length; i++) {
        if (hunterID == easterList[i]) {
            color = easterEggs[hunterID];
            break;
        }
    }

    //Creating the hunter id label
    var idLabel = "<br><span id='hid' class='label' style='font-size: 1.2em; font-weight: bold; color:" + color + "'>Hunter ID: " + hunterID + "</span>";

    //Handle adding the label differently for MH dev profiles and regular user profiles.
    if ($(".blackTooltip").length == 1) $(".blackTooltip").after(idLabel);
    else $(".hunterInfoView-userName").after(idLabel);

    //Remove duplicate hunter id in own profile
    if ($("#hid").parent().find(".label")[1].textContent.indexOf('Hunter ID:') != -1) $("#hid").parent().find(".label")[1].remove();
}

$(document).ready(function() {

    //If current page is a profile page
    if ($(this).attr('title').includes("Hunter's Profile")) {
        initHunterID();
    }

});