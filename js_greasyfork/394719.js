// ==UserScript==
// @name         CDM : GHI+
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Rajoute les heures estimées dans le widget GHI
// @author       Flamby67
// @match        http://lsrh-si.cm-cic.fr/lsrhdvb/devbooster.aspx?modeAutonome=O&action=GHIDESK*
// @match        https://lsrh-si.cm-cic.fr/lsrhdvb/devbooster.aspx?modeAutonome=O&action=GHIDESK*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394719/CDM%20%3A%20GHI%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/394719/CDM%20%3A%20GHI%2B.meta.js
// ==/UserScript==

(function() {
    var typical_workday = "07:48";

    var morning_arrival = "09:00";
    var morning_departure = "11:35";
    var afternoon_arrival = "12:30";

    function toMinutes(hour_string)
    {
        var elements = hour_string.split(":");
        return Number(elements[0]) * 60 + Number(elements[1]);
    }

    function toString(minutes)
    {
        return Math.floor(minutes / 60).toString().padStart(2, '0') + ":" + (minutes % 60).toString().padStart(2, '0');
    }

    var $j = jQueryWlib;
    $j(document).ready(function() {
        var blocks = $j(".bigger_screen_ghidesk .ei_fnblock_body").children();
        var actual_morning_arrival = $j(blocks[0]).hasClass("ei_tile_theme_low") ? $j(blocks[0]).find("span.ei_tile_subtitle").text() : morning_arrival;
        var actual_morning_departure = $j(blocks[1]).hasClass("ei_tile_theme_low") ? $j(blocks[1]).find("span.ei_tile_subtitle").text() : morning_departure;
        var actual_afternoon_arrival = $j(blocks[2]).hasClass("ei_tile_theme_low") ? $j(blocks[2]).find("span.ei_tile_subtitle").text() : afternoon_arrival;

        if (!$j(blocks[1]).hasClass("ei_tile_theme_low"))
        {
            $j(blocks[1]).find("span.ei_tile_subtitle").append($j("<div style='text-align:center;color:grey;font-weight:normal;'>" + morning_departure + "</div>"));
        }

        if (!$j(blocks[2]).hasClass("ei_tile_theme_low"))
        {
            $j(blocks[2]).find("span.ei_tile_subtitle").append($j("<div style='text-align:center;color:grey;font-weight:normal;'>" + afternoon_arrival + "</div>"));
        }

        if (!$j(blocks[3]).hasClass("ei_tile_theme_low"))
        {
            var morning_minutes = toMinutes(actual_morning_departure) - toMinutes(actual_morning_arrival);
            var afternoon_minutes = toMinutes(typical_workday) - morning_minutes;
            var estimated_afternoon_departure = toString(toMinutes(actual_afternoon_arrival) + afternoon_minutes);
            $j(blocks[3]).find("span.ei_tile_subtitle").append($j("<div style='text-align:center;color:grey;font-weight:bold;'>" + estimated_afternoon_departure + "</div>"));
        }
    });
})();