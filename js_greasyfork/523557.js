// ==UserScript==
// @name         AirBnB result aggregator and GeoJson export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stores all search results in local storage while browsing AirBnB and allow the user to export a GeoJson file with all the results using this bookmark: javascript:document.dispatchEvent(new Event('downloadGeoJSON'));
// @author       Vincent Chalnot
// @match        https://*.airbnb.*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523557/AirBnB%20result%20aggregator%20and%20GeoJson%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/523557/AirBnB%20result%20aggregator%20and%20GeoJson%20export.meta.js
// ==/UserScript==

(function () {
    const domain = 'https://www.airbnb.fr';
    const searchParameters = 'adults=2&children=0&infants=0&search_mode=regular_search&check_in=2025-04-25&check_out=2025-05-04'
    
    const dbName = "geoDataDB";
    const storeName = "geoDataFeatures";
    let db;

    // Open a connection to the IndexedDB
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
    };

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch(...args);
        if (!response.url.startsWith(`${domain}/api/v3/StaysSearch/`)) {
            return response;
        }
        const clonedResponse = response.clone();

        clonedResponse.json().then(data => {
            data.data.presentation.staysSearch.results.searchResults.forEach(result => {
                if (result.__typename !== 'StaySearchResult') {
                    return;
                }
                const listing = result.listing;
                const price = result.pricingQuote.structuredStayDisplayPrice.secondaryLine.price.replace(' au total', '');
                let pictures = [];
                result.contextualPictures.forEach(picture => {
                    pictures.push(picture.picture);
                });
                const geoDataFeature = {
                    id: listing.id,
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [listing.coordinate.longitude, listing.coordinate.latitude]
                    },
                    properties: {
                        name: listing.name,
                        price: price,
                        url: `${domain}/rooms/${listing.id}?${searchParameters}`,
                        pictures: pictures
                    }
                };

                const transaction = db.transaction([storeName], "readwrite");
                const objectStore = transaction.objectStore(storeName);
                objectStore.put(geoDataFeature);

                transaction.oncomplete = function () {
                    console.log("GeoDataFeature stored successfully.");
                };

                transaction.onerror = function (event) {
                    console.error("Transaction error:", event.target.errorCode);
                };
            });
        }).catch(err => {
            console.error('Failed to parse response:', err);
        });

        return response;
    };

    // Function to create and download the GeoJSON file
    function downloadGeoJSON() {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
            const geoJSON = {
                type: "FeatureCollection",
                features: event.target.result
            };

            const blob = new Blob([JSON.stringify(geoJSON)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'airbnb_geo.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        request.onerror = function (event) {
            console.error("Failed to retrieve data from IndexedDB:", event.target.errorCode);
        };
    }

    // Add event listener for the custom event
    document.addEventListener('downloadGeoJSON', downloadGeoJSON);

})();