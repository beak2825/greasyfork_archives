// ==UserScript==
// @name        Geotastic Helper
// @match       *://*.geotastic.net/*
// @grant       none
// @version     1.0
// @license GPL-3
// @author      dharmik2319
// @description Helps you in the game Geotastic
// @run-at      document-start
// @namespace getreadytoslumbeeeeeeeeeerrrrrrrrrrrrrrrrrrrr
// @downloadURL https://update.greasyfork.org/scripts/490133/Geotastic%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/490133/Geotastic%20Helper.meta.js
// ==/UserScript==

window.myMap;

let map;

// Hijacking the `google` module so that we can access an initialized google.maps.Map instance
var checkInterval = setInterval(function() {
    if (typeof google === 'object' && typeof google.maps === 'object' && typeof google.maps.Map === 'function') {
        var originalMap = google.maps.Map;
        google.maps.Map = function() {
            var instance = new originalMap(...arguments);
            window.myMap = instance
            return instance
        }
        clearInterval(checkInterval); // Stop checking once the module is loaded
    }
}, 10); // Check every 10 ms


let globalCoordinates = { // keep this stored globally, and we'll keep updating it for each API call.
    lat: 0,
    lng: 0
}

var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata')) {
        this.addEventListener('load', function () {
            let interceptedResult = this.responseText
            let parsed = interceptedResult.replace("null","")
            const pattern = /-*\d+\.\d+,-*\d+\.\d+/g;
            let match = parsed.match(pattern)[0];
            let split = match.split(",")

            let lat = Number.parseFloat(split[0])
            let lng = Number.parseFloat(split[1])
            globalCoordinates.lat = lat
            globalCoordinates.lng = lng
            markers();
        });
    }
    // Call the original open function
    return originalOpen.apply(this, arguments);

};

function mapsFromCoords() { // opens new Google Maps location using coords.

    const {lat,lng} = globalCoordinates;
    window.open(`https://www.google.com/maps/place/${lat},${lng}`);

}
let optsMarker;
let marker;
function markers() {
  if (typeof marker!="undefined") {
    marker.setMap(null)
    marker = null
  }
  map = window.myMap
  optsMarker = {type:"drop",position:new google.maps.LatLng(globalCoordinates.lat,globalCoordinates.lng),clickable:!1,map:map,id:"test"}
  marker = new google.maps.Marker(optsMarker)

}



let onKeyDown = (e) => {
    if (e.keyCode === 50) {
	    mapsFromCoords();
    }
    if (e.keyCode === 49) {
	    alert(`${globalCoordinates.lat}, ${globalCoordinates.lng}`);
    }
}
document.addEventListener("keydown", onKeyDown);

