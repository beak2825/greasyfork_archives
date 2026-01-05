// ==UserScript==
// @name         MyAnimeList Add Friends' Statistics to Main Page
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      1.0.8
// @description  Adds your Friends' Statistics to each MyAnimeList entry page .
// @author       PurplePinapples
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/anime/php?id=*
// @match        https://myanimelist.net/manga/php?id=*
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26869/MyAnimeList%20Add%20Friends%27%20Statistics%20to%20Main%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/26869/MyAnimeList%20Add%20Friends%27%20Statistics%20to%20Main%20Page.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var statsURL = "";
    var thisURL = window.location.href; //current URL
    var regex = "Characters & Voice Actors";
    if (thisURL.indexOf("myanimelist.net/manga") > -1) {
        regex = "Characters"; //change regex if its on a manga page
    }
    if (thisURL.indexOf(".php?id=") > -1) {
        if (thisURL.indexOf("myanimelist.net/anime") > -1) {
            statsURL = "https://myanimelist.net/anime/" + thisURL.split("id=")[1] + "/a/stats";
        } else {
            statsURL = "https://myanimelist.net/manga/" + thisURL.split("id=")[1] + "/a/stats";
        }
    } else {
        if (thisURL.indexOf("myanimelist.net/anime") > -1) {
            statsURL = "https://myanimelist.net/anime/" + thisURL.split("anime/")[1].split("/")[0] + "/a/stats";
        } else {
            statsURL = "https://myanimelist.net/manga/" + thisURL.split("manga/")[1].split("/")[0] + "/a/stats";
        }
    }

    var terminateSearching = false;
    $(".pb24").find(":header").each(function () { //loop through each header (h1/h2/h3)
        if ($(this).text().indexOf(regex) > -1 && !(terminateSearching)) { //match Characters/Characters & Voice Actors
            $("<div id=\"insert_stats\" style=\"display: none;\"></div><br><br>").insertBefore(this);
            terminateSearching = true; //stop looping through once it inserts placeholder div
        }
    });

    $.get(statsURL, function (statsHTML) { //store HTML in a string
        if ((statsHTML.match(/di-tc va-m al pl4/g) || []).length === 0) { //if no one has it on their list
            if (thisURL.indexOf("\/manga\/") > -1) {
                $("div#insert_stats").append("<h2>Recently Updated By</h2>No friends found with this Manga on their list.");
            } else {
                $("div#insert_stats").append("<h2>Recently Updated By</h2>No friends found with this Anime on their list.");
            }
            $("div#insert_stats").css("display", "block"); //show div
        } else {
            var statsTable = $($.parseHTML(statsHTML)).find("table.table-recently-updated");
            $("<h2>Recently Updated By<small style=\"font-weight: normal;\"> (<a href=\"javascript: void(0)\" id=\"slide\">show</a>)</small></h2>").insertBefore("#insert_stats"); //insert header
            $("#insert_stats").append(statsTable);
            $("a#slide").click(function () { //show/hide
                $("div#insert_stats").slideToggle();
                $(this).text($(this).text() == "show" ? "hide" : "show");
                return false;
            });
        }
    });
})();