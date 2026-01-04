// ==UserScript==
// @name         TM Compare Others' Players
// @namespace    https://trophymanager.com
// @version      1.0
// @description  TrophyManager: Allow managers to compare two other clubs' players
// @author       UNITE eM (Club ID: 551050)
// @match        https://trophymanager.com/players/*
// @exclude      https://trophymanager.com/players/
// @exclude      https://trophymanager.com/players/compare/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449192/TM%20Compare%20Others%27%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/449192/TM%20Compare%20Others%27%20Players.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var playerId = player_id;
    var compareId = -1;
    var isDifferent = false;
 
    var existingEntry = JSON.parse(localStorage.getItem('comparePlayer'));
    if (existingEntry != null) {
        compareId = existingEntry.id;
        if (compareId != playerId) isDifferent = true;
    }
 
    var buttonImage = (playerId == compareId) ? "/pics/mini_green_check.png" : "/pics/icons/pen.gif";
    var buttonText = (playerId == compareId) ? "Added" : "Add to Compare";
    var addCompare =
        "<br><span id=\"addCompare_button\" class=\"button\" style=\"width:170px;\">" +
        "<span class=\"button_border\" style=\"width:168px; padding: 0;\"><img src=\"" + buttonImage + "\">&nbsp;" + buttonText + "</span>" +
        "</span>";
    $("div.column3_a > div:nth-child(2) > div.box_body > div:nth-child(4)").append(addCompare);
 
    if (isDifferent) {
        var compareUrl = "https://trophymanager.com/players/compare/" + playerId + "/" + compareId + "/";
        var compareCountry = existingEntry.country;
        var compareName = existingEntry.name;
        var doCompare =
            "<br><a href=\"" + compareUrl + "\"><span id=\"doCompare_button\" class=\"button\" style=\"width:170px;\">" +
            "<span class=\"button_border\" style=\"width:168px; padding: 0;\">Compare to<br><ib class=\"flag-img-" + compareCountry + " \"></ib>&nbsp;" + compareName + "</span></span>" +
            "</a>";
        $("div.column3_a > div:nth-child(2) > div.box_body > div:nth-child(4)").append(doCompare);
    }
 
    document.getElementById('addCompare_button').addEventListener('click', (e) => {
        addPlayerInfo(playerId);
        if (isDifferent) document.getElementById("doCompare_button").style.display = 'none';
    });
 
    function addPlayerInfo(playerId) {
        var elem = document.getElementById("addCompare_button");
        elem.innerHTML = "<span class=\"button_border\" style=\"width:168px; padding: 0;\"><img src=\"/pics/mini_green_check.png\">&nbsp;Added</span>";
 
        var playerName = player_name;
        if (playerName.length > 18) playerName = playerName.substring(0, 17) + "...";
 
        var playerCountry = player_country;
 
        var entry = {
            id: playerId,
            name: playerName,
            country: playerCountry
        }
        localStorage.setItem('comparePlayer', JSON.stringify(entry));
    }
 
})();