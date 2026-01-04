// ==UserScript==
// @name         Steam Community, Creatable boosterpacks listings
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://steamcommunity.com//tradingcards/boostercreator*
// @match        https://steamcommunity.com/tradingcards/boostercreator*
// @grant        none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/39720/Steam%20Community%2C%20Creatable%20boosterpacks%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/39720/Steam%20Community%2C%20Creatable%20boosterpacks%20listings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery;
    $(function () {
        var $table = $("<table />").addClass("listings").appendTo(".booster_creator_area");
        var data = CBoosterCreatorPage.sm_rgBoosterData;
        for (var id in data) {
            var d = data[id];
            var $tr = $("<tr />")
            .attr({ appid: id })
            .click(function () {
                var $select = $("#booster_game_selector");
                $select.val($(this).attr("appid"));
                $select.trigger("change");
                $("html,body").animate({ scrollTop: $select.offset().top + "px" },"fast");
            }).appendTo($table);
            $("<td />").text(d.price).appendTo($tr);
            $("<td />").text(d.name).appendTo($tr);
        }

        $("<style />").text(".listings { border-collapse: separate; border-spacing: 0; min-width: 60%; }\
.listings tr:nth-child(2n-1) { background: rgba(255,255,255,0.1); }\
.listings tr { cursor: pointer; }\
.listings tr:hover { background: rgba(100, 150, 200, 0.3); }\
.listings td { padding: 1px 5px; }").appendTo("head");
    });
})();