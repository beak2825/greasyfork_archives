// ==UserScript==
// @name         Munzee Gardens
// @version      0.4
// @description  Show some more munzee garden infos
// @author       rabe85
// @match        https://www.munzee.com/gardens
// @match        https://www.munzee.com/gardens/*
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/40727/Munzee%20Gardens.user.js
// @updateURL https://update.greasyfork.org/scripts/40727/Munzee%20Gardens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_garden() {

        var count_marker = 0;
        var latest_gardens = "";
        var count_marker_class = document.getElementsByClassName("col-md-12")[0];
        if(count_marker_class) {
            var count_marker_array = count_marker_class.querySelector("script").innerHTML.split(" .setLngLat([ ");
            count_marker = count_marker_array.length -1;
            if(count_marker != 0) {
                var count_marker_text = count_marker_class.getElementsByClassName("margin-bottom-30")[0];
                if(count_marker_text) {
                    count_marker_text.insertAdjacentHTML("afterbegin", count_marker + " ");
                }
            }
            for(var cms = count_marker - 10, count_marker_string; !!(count_marker_string=count_marker_array[cms]); cms++) {
                var count_marker_string_array = count_marker_string.split("])");
                var count_marker_string_lnglat = count_marker_string_array[0].split(",");
                var count_marker_string_latlng = count_marker_string_lnglat[1] + "," + count_marker_string_lnglat[0];
                var count_marker_string_zoom = 16;
                var count_marker_string_geohash = geohash.encode(count_marker_string_lnglat[1],count_marker_string_lnglat[0],count_marker_string_zoom);
                latest_gardens += "<div>&nbsp;<a href='https://www.munzee.com/map/" + count_marker_string_geohash + "/" + count_marker_string_zoom + "'>Garden " + cms + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Location Details: " + count_marker_string_latlng + ")<br><a href='https://www.munzee.com/map/" + count_marker_string_geohash + "/" + count_marker_string_zoom + "'><img src='https://maps.googleapis.com/maps/api/staticmap?center=" + count_marker_string_latlng + "&zoom=8&size=400x400&markers=icon:https://www.otb-server.de/munzee/virtual_emerald64.png%7C" + count_marker_string_latlng + "&key=AIzaSyAwL_7unh8TPye2SaZ5DdTu2gyE4VpThqU' alt='Garden " + cms + "'></a><br><br><br></div>";
            }
            count_marker_class.insertAdjacentHTML("beforeend", "<div><div class='page-header'><h1>The newest 10 gardens</h1></div>" + latest_gardens + "</div>");
        }

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_garden();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_garden, false);
    }

})();