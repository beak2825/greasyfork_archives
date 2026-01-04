// ==UserScript==
// @name         AnyGuessr - Universal Geoguessr-alike game cheat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get the location in any GeoGuessr-alike game
// @author       daijro
// @license      MIT
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/516953/AnyGuessr%20-%20Universal%20Geoguessr-alike%20game%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/516953/AnyGuessr%20-%20Universal%20Geoguessr-alike%20game%20cheat.meta.js
// ==/UserScript==

let globalCoordinates = {
    lat: 0,
    lng: 0
};

let globalPanoID = undefined;

// Function to fetch the country name using Nominatim API (OpenStreetMap)
async function findCountry({ lat, lon }) {
    let data = null;
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        data = await response.json();
    } catch (e) {
        console.error("Error fetching country data:", e);
        data = { address: { country: "Unknown" }}; // default to unknown if error occurs
    }
    return data?.address?.country ?? "Unknown";
}

// Override XMLHttpRequest open to intercept API calls and extract coordinates
var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (method.toUpperCase() === 'POST' &&
        (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
         url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

        this.addEventListener('load', async function () {
            let interceptedResult = this.responseText;
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)[0];
            let split = match.split(",");

            let lat = Number.parseFloat(split[0]);
            let lng = Number.parseFloat(split[1]);

            globalCoordinates.lat = lat;
            globalCoordinates.lng = lng;
            console.log(`Coordinates: ${JSON.stringify(globalCoordinates)}`);

            // Call function to fetch country name
            const country = await findCountry({ lat, lon: lng });
            console.log(`Detected Country: ${country}`);
        });
    }
    return originalOpen.apply(this, arguments);
};