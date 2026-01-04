// ==UserScript==
// @name         Geoguessr Coordinates Downloader for Computer Vision
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Features: Downloads a text with the round coordinates
// @author       ratusminus
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @downloadURL https://update.greasyfork.org/scripts/489898/Geoguessr%20Coordinates%20Downloader%20for%20Computer%20Vision.user.js
// @updateURL https://update.greasyfork.org/scripts/489898/Geoguessr%20Coordinates%20Downloader%20for%20Computer%20Vision.meta.js
// ==/UserScript==


// =================================================================================================================
// Obtaining latitude and longitude would not be possible without the work of 0x978 on Geoguessr Location Resolver :
// https://github.com/0x978/GeoGuessr_Resolver
// I kept their comments for clarity
// ================================================================================================================

let globalCoordinates = { // keep this stored globally, and we'll keep updating it for each API call.
    lat: 0,
    lng: 0
}

let globalPanoID = undefined

// Below, I intercept the API call to Google Street view and view the result before it reaches the client.
// Then I simply do some regex over the response string to find the coordinates, which Google gave to us in the response data
// I then update a global variable above, with the correct coordinates, each time we receive a response from Google.

var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    // Geoguessr now calls the Google Maps API multiple times each round, with subsequent requests overwriting
    // the saved coordinates. Calls to this exact API path seems to be legitimate for now. A better solution than panoID currently?
    // Needs testing.
    if (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata')) {

        this.addEventListener('load', function () {
            let interceptedResult = this.responseText
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)[0];
            let split = match.split(",")

            let lat = Number.parseFloat(split[0])
            let lng = Number.parseFloat(split[1])


            globalCoordinates.lat = lat
            globalCoordinates.lng = lng

            

        });
    }
    // Call the original open function
    return originalOpen.apply(this, arguments);
};


// ====================================Open In Google Maps====================================

function mapsFromCoords() { // opens new Google Maps location using coords.

    const {lat,lng} = globalCoordinates
    if (!lat || !lng) {
        return;
    }

    // Reject any attempt to call an overridden window.open, or fail .
    if(nativeOpen && nativeOpen.toString().indexOf('native code') === 19){
        nativeOpen(`https://maps.google.com/?output=embed&q=${lat},${lng}&ll=${lat},${lng}&z=5`);
    }
}

function showCoordinates() {
    const {lat, lng} = globalCoordinates;
    alert("Latitude : " + lat + "\nLongitude : " + lng);
}


// ====================================Controls,setup, etc.====================================



let onKeyDown = (e) => {
    if (e.keyCode === 49) {
        e.stopImmediatePropagation(); // tries to prevent the key from being hijacked by geoguessr
        showCoordinates();
    }
}

document.addEventListener("keydown", onKeyDown);