// ==UserScript==
// @name         DS VillageDistance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds a new Column Distance on a players profile to the villages list, displaying the distance from your current village.
// @author       D. Hirsch
// @include      https://de*.die-staemme.de/game.php?village=*&screen=info_player&id=*
// @match        https://de*.die-staemme.de/game.php?village=*&screen=info_player&id=*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/396611/DS%20VillageDistance.user.js
// @updateURL https://update.greasyfork.org/scripts/396611/DS%20VillageDistance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dev = false;
    var start = { 'x': 500, 'y': 500};
    var dest = { 'x': 500, 'y': 500};
    var regex = RegExp('[1-9]{3}\|[1-9]{3}');

    var homeCoords = $("b")[0].innerText.substring(1,8);
    debug(setCoordinates(start, homeCoords));

    $("#villages_list").find("thead>tr").append("<th>Distance from "+ homeCoords +"</th>");

    var villageCount = $("#villages_list").find("thead")[0].innerText.substring(8,9);
    for (var i = 0; i < villageCount; i++)
        {
            var coordTd = $("#villages_list").find("tbody")[0].rows[i].cells[1].innerText;

            if(!regex.test(coordTd))
            {
                coordTd = $("#villages_list").find("tbody")[0].rows[i].cells[2].innerText;
            }
            debug(setCoordinates(dest, coordTd));
            var dist = calcDist(start, dest);
            debug(dist, "rounded distance: ");
            $("#villages_list").find("tbody")[0].rows[i].insertCell(-1).append(dist);
        }

    /*
     * Sets the coordinates from a given ds coordinates string into an given object.
     */
    function setCoordinates(obj, str) {
        obj.x = str.substring(0,3);
        obj.y = str.substring(4,7);
        return obj;
    }

    /*
     * Calculates the distance between two villages rounded to the next integer.
     */
    function calcDist(objA, objB)
    {
        var distX = Math.abs(objA.x - objB.x);
        var distY = Math.abs(objA.y - objB.y);
        var _dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        debug(_dist, "not rounded distance: ");
        return Math.floor(_dist);
    }

    /*
     * Custom debug log to console when dev set to true.
     */
    function debug(str, opt) {
        if (dev = true)
        {
            console.log(opt + str);
        }
    }
})();