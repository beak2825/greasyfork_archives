// ==UserScript==
// @name         Trent Dethloff
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *s3.amazonaws.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23374/Trent%20Dethloff.user.js
// @updateURL https://update.greasyfork.org/scripts/23374/Trent%20Dethloff.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".panel-body:contains('Enter the exact lat/long for each location using Google Maps.')").length) {
        console.log("Trent Dethloff");
        var addy = $("td:contains('AddressLine1:')").next().html();
        var city = $("td:contains('City:')").next().text();
        var state = $("td:contains('State:')").next().text();
        var zip = $("td:contains('PostalCode:')").next().text();
        var address = addy + ", " + city + ", " + state;
        console.log(address);
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address +"&sensor=true";

        $.getJSON(url, function(data)
        {
            var myLat = data.results[0].geometry.location.lat;
            var myLong = data.results[0].geometry.location.lng;
            $("div:contains('Latitude:')").append("<a href='https://www.google.com/maps/place/" + myLat + ", " + myLong + "' target='_blank'>" + myLat + ", " + myLong + "</a>");
            $('[name="Latitude"]').val(myLat);
            $('[name="Longitude"]').val(myLong);
        });
    }
})();