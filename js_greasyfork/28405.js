
// ==UserScript==
// @name         irodexx
// @namespace    http://tampermonkey.net/
// @version      0.101
// @description  try to take over the world!
// @author       You
// @match      https://*.api.smartthings.com/api/smartapps/installations/*/launch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28405/irodexx.user.js
// @updateURL https://update.greasyfork.org/scripts/28405/irodexx.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // a function that loads jQuery and calls a callback function when jQuery has finished loading
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }
    
    // the guts of this userscript
    function main() {        
        
        $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAlFR9IWx_HfMinS3mJZhAvGEtz-uz0aAs", function() {

            $('body').append('<iframe class="weather-iframe" src="https://www.meteoblue.com/en/weather/widget/daily/rancho-bernardo_united-states-of-america_5385913?geoloc=fixed&days=6&tempunit=FAHRENHEIT&windunit=KILOMETER_PER_HOUR&coloured=coloured&pictoicon=0&maxtemperature=0&maxtemperature=1&mintemperature=1&windspeed=0&windgust=0&winddirection=0&uv=0&humidity=0&precipitation=0&precipitationprobability=0&precipitationprobability=1&spot=0&pressure=0&layout=light"  frameborder="0" scrolling="NO" allowtransparency="true" sandbox="allow-same-origin allow-scripts allow-popups" style="width: 216px;height: 170px"></iframe><div><!-- DO NOT REMOVE THIS LINK --><a href="https://www.meteoblue.com/en/weather/forecast/week/palo-alto-hills-golf-and-country-club_united-states-of-america_5380758?utm_source=weather_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget" target="_blank">meteoblue</a></div>');
            
            $('body').append("<div class='weather-image-container'><div class='weather-image-container-inner'><div class='weather-image-container-radar'></div><div class='weather-image-container-road'></div><div class='weather-image-container-cities'></div><div class='weather-image-container-roads'></div></div></div>");
            
            var e2 = $('<div id="map" style="height:270px; width:340px; top: 383px; left: 386px;"></div>');
            $('body').append(e2);
            
            var e3 = $('<div id="map2" style="height:270px; width:150px; top: 113px; left: 731px;"></div>');
            $('body').append(e3);            

            var e4 = $('<div id="map3" style="height:270px; width:136px; top: -157px; left: 885px;"></div>');
            $('body').append(e4);                 
            
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 11,
                center: {lat: 33.004994, lng:  -117.181949},
                disableDefaultUI: true
            });
            
            var map2 = new google.maps.Map(document.getElementById('map2'), {
                zoom: 14,
                center: {lat: 33.069830, lng:   -117.073052},
                disableDefaultUI: true
            });  
            
            var map3 = new google.maps.Map(document.getElementById('map3'), {
                zoom: 8,
                center: {lat: 33.389088, lng:    -117.562174},
                disableDefaultUI: true
            });             

            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
            
            var trafficLayer2 = new google.maps.TrafficLayer();
            trafficLayer2.setMap(map2);   
            
            var trafficLayer3 = new google.maps.TrafficLayer();
            trafficLayer3.setMap(map3);              
            
            
        });
    }

    // load jQuery and execute the main function
    addJQuery(main);
})();