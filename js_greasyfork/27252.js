// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.101
// @description  try to take over the world!
// @author       You
// @match        https://graph-na02-useast1.api.smartthings.com/api/smartapps/installations/*/launch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27252/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/27252/New%20Userscript.meta.js
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

            //var e1 = $('<div class="video smv tile h2 w3"></div>')
            //$(e1).insertAfter("#3-2");
            var e2 = $('<div id="map" style="height:300px; width:400px; top: 200px; left: 200px;"></div>');
            $('body').append(e2);

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 11,
                center: {lat: 33.004994, lng:  -117.161949}
            });

            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
        });
    }

    // load jQuery and execute the main function
    addJQuery(main);
})();