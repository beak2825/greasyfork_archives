// ==UserScript==
// @name         Geoguessr Europe-centric map
// @description  Centers the guess map of world maps around longitude 0° instead of the default Pacific-centric position
// @version      0.0.4
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @require      https://openuserjs.org/src/libs/xsanda/Google_Maps_Promise.js
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @icon         https://www.svgrepo.com/download/399323/world-map-alt.svg
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459676/Geoguessr%20Europe-centric%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/459676/Geoguessr%20Europe-centric%20map.meta.js
// ==/UserScript==

googleMapsPromise.then(() => {
    const oldMap = google.maps.Map;
    google.maps.Map = Object.assign(function (...args) {
        const oldFitBounds = google.maps.Map.prototype.fitBounds
        this.fitBounds = function (...args) {
            const json = args[0].toJSON();
            if (json.west == 180 && json.east == 180) {
                args[0] = new google.maps.LatLngBounds({lat: -90, lng: -180}, {lat: 90, lng: 180});
            } else if (json.east - json.west < -180 && json.north - json.south > 90) {
                args[0] = new google.maps.LatLngBounds({lat: json.south, lng: json.east}, {lat: json.north, lng: json.west});
            }
            return oldFitBounds.call(this, ...args);
        }
        return oldMap.apply(this, args);
    }, {
        prototype: Object.create(oldMap.prototype)
    });
});
