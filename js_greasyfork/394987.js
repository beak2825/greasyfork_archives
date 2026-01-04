// ==UserScript==
// @name         Drains Tournament Manager Favorites Highlighter
// @namespace    https://www.neverdrains.com/
// @version      0.7
// @description  Highlights your favorited players in tournaments so that you can more easily follow their ranking.
// @author       David Hosier
// @match        https://www.neverdrains.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_addStyle
// @grant		GM_getMetadata
// @grant		GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/394987/Drains%20Tournament%20Manager%20Favorites%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/394987/Drains%20Tournament%20Manager%20Favorites%20Highlighter.meta.js
// ==/UserScript==
/* globals $ */
(function() {
    'use strict';

    var cfg = new MonkeyConfig({
        title: 'Drains Favorites Configuration',
        menuCommand: true,
        params: {
            highlight_color: {
                type: 'color',
                default: '#9932CC'
            },
            page_refresh: {
                type: 'number',
                default: 0
            }
        }
    });

    if (cfg.get("page_refresh") > 0) {
        setTimeout(function() {
            window.location.reload();
        }, cfg.get("page_refresh") * 1000);
    }

    var $favorites = $('a.menu:contains("Player Standings / History")').parent();

    var faves = [];
    var $fav = $favorites.next();
    var keepLooking = true;
    while (keepLooking) {
        if ($fav.children('a[href^="playerIndex.php?disp=player&pid="]').length > 0) {
            faves.push($fav);
            $fav = $fav.next();
        } else {
            keepLooking = false;
        }
    }

    $.each(faves, function(key, value) {
        value.children('a').css("color", cfg.get("highlight_color"));
        var playerName = value.children('a').html().trim();

        // Highlights players in the standings tables
        var $playerLink = $('tr > td > a:contains("' + playerName + '")');
        var $playerCell = $playerLink.parent();
        var $playerRow = $playerCell.parent();
        if ($playerRow.length > 0) {
            let $selectedElement = $playerRow.find('td').length == 2 ? $playerCell : $playerRow;
            $selectedElement.css("background-color", cfg.get("highlight_color"));
            $selectedElement.children().css("font-style", "italic");
            $selectedElement.children().children().css("font-style", "italic");
        }

        // Highlights players in playoffs tables
        var $finalsPlayer = $('div.participant > span[title="' + playerName + '"]');
        if ($finalsPlayer.length > 0) {
            var $playersList = $finalsPlayer.parent().parent().parent();
            var $finalsMatch = $playersList.parent();
            var clss = $finalsPlayer.parent().attr("class");
            var slctr = "div." + clss.replace(" ", ".");
            var $playerDivs = $finalsMatch.find(slctr);
            $playerDivs.css("font-weight", "bold").css("background-color", cfg.get("highlight_color"));
        }
    });

    $("div.participant").children("em").css("line-height", "2");

})();
