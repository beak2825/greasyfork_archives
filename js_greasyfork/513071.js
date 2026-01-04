// ==UserScript==
// @name         Geoguessr Google Maps Auto Opener with Country Info 
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically opens Google Maps with the current GeoGuessr location, fetches country name, flag, TLD, driving side, language, currency, and phone prefix, and displays this info in a new window.
// @author       0x978 (modified)
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513071/Geoguessr%20Google%20Maps%20Auto%20Opener%20with%20Country%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/513071/Geoguessr%20Google%20Maps%20Auto%20Opener%20with%20Country%20Info.meta.js
// ==/UserScript==

let globalCoordinates = {
    lat: 0,
    lng: 0
};

let googleMapsTab = null;  // Store the reference to the Google Maps tab
let countryWindow = null;  // Store the reference to the country info window

// Open or refresh Google Maps with the latest coordinates
function mapsFromCoords() {
    const { lat, lng } = globalCoordinates;
    if (!lat || !lng) {
        return;
    }

    const mapUrl = `https://maps.google.com/?output=embed&q=${lat},${lng}&ll=${lat},${lng}&z=5`;

    // If no Google Maps tab is open, open a new one
    if (!googleMapsTab || googleMapsTab.closed) {
        googleMapsTab = window.open(mapUrl, '_blank', 'width=800,height=600,left=1920,top=0');
        if (googleMapsTab) {
            googleMapsTab.focus();
        } else {
            console.error('Unable to open the new tab. Your browser may block popups.');
        }
    } else {
        // If the tab is open, update its location with the new coordinates
        googleMapsTab.location.href = mapUrl;
    }
}

// Fetch the country info (name, flag, TLD, driving side, language, currency, phone prefix) using Nominatim and REST Countries APIs
async function getCountryInfo(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.address && data.address.country) {
            const country = data.address.country;
            const countryCode = data.address.country_code.toUpperCase();  // ISO 3166-1 alpha-2 country code
            console.log(`Location: ${lat}, ${lng} - Country: ${country}`);

            // Fetch country information from REST Countries API
            const countryInfo = await getCountryInfoFromREST(countryCode);
            console.log(countryInfo);

            // Open a new window and display the country info
            if (!countryWindow || countryWindow.closed) {
                countryWindow = window.open('', '_blank', 'width=600,height=400,left=1920,top=0');
            }
            countryWindow.document.open();
            countryWindow.document.write(`
                <html>
                    <head>
                        <title>Country Information</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                padding: 20px;
                            }
                            .country-info {
                                margin-top: 20px;
                            }
                            .flag {
                                width: 100px;
                                height: auto;
                            }
                            .info {
                                margin-top: 10px;
                                font-size: 16px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Country: ${country}</h1>
                        <p><strong>TLD:</strong> ${countryInfo.tld}</p>
                        <p><strong>Driving Side:</strong> ${countryInfo.drivesOn}</p>
                        <p><strong>Languages:</strong> ${countryInfo.languages.join(', ')}</p>
                        <p><strong>Currency:</strong> ${countryInfo.currency}</p>
                        <p><strong>Phone Prefix:</strong> ${countryInfo.phonePrefix}</p>
                        <div class="country-info">
                            <img src="https://flagcdn.com/w320/${countryCode.toLowerCase()}.png" class="flag" alt="Flag of ${country}" />
                        </div>
                    </body>
                </html>
            `);
            countryWindow.document.close();
        } else {
            console.error('Country not found in Nominatim response.');
        }
    } catch (error) {
        console.error('Error fetching country info:', error);
    }
}

// Fetch detailed country info (TLD, driving side, language, currency, phone prefix) using REST Countries API
async function getCountryInfoFromREST(countryCode) {
    const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        const countryData = data[0];
        const tld = countryData.tld ? countryData.tld[0] : 'Unknown TLD';
        const drivesOn = countryData.car && countryData.car.side ? (countryData.car.side === 'left' ? 'Left' : 'Right') : 'Unknown';
        const languages = Object.values(countryData.languages || {});
        const currency = countryData.currencies ? Object.values(countryData.currencies)[0].name : 'Unknown';
        const phonePrefix = countryData.idd && countryData.idd.root && countryData.idd.suffixes
            ? countryData.idd.root + countryData.idd.suffixes[0]
            : 'Unknown';

        // Debug logs to check the fetched data
        console.log({
            countryCode,
            tld,
            drivesOn,
            languages,
            currency,
            phonePrefix
        });

        return {
            tld,
            drivesOn,
            languages,
            currency,
            phonePrefix
        };
    } catch (error) {
        console.error('Error fetching country info from REST Countries API:', error);
        return {
            tld: 'Unknown TLD',
            drivesOn: 'Unknown',
            languages: ['Unknown'],
            currency: 'Unknown',
            phonePrefix: 'Unknown'
        };
    }
}

// Intercept API call to get coordinates
var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (method.toUpperCase() === 'POST' &&
        (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
         url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

        this.addEventListener('load', function () {
            let interceptedResult = this.responseText;
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)[0];
            let split = match.split(",");

            globalCoordinates.lat = Number.parseFloat(split[0]);
            globalCoordinates.lng = Number.parseFloat(split[1]);

            // Automatically update Google Maps when new coordinates are received
            mapsFromCoords();

            // Get the country info based on the coordinates
            getCountryInfo(globalCoordinates.lat, globalCoordinates.lng);
        });
    }
    return originalOpen.apply(this, arguments);
};
