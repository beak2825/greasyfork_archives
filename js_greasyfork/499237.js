// ==UserScript==
// @name         WME Parking Lot Opening Hours Highlighter
// @namespace    tbrks
// @version      0.0.1
// @description  Highlight parking lots without opening hours set
// @author       tbrks
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499237/WME%20Parking%20Lot%20Opening%20Hours%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/499237/WME%20Parking%20Lot%20Opening%20Hours%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightPlaces() {
        const places = W.model.venues.objects;

        for (const placeID in places) {
            if (places.hasOwnProperty(placeID)) {
                const place = places[placeID];

                if (place.attributes.categories.includes('PARKING_LOT')) {
                    if (
                        place.attributes.openingHours.length === 0 &&
                        place.attributes.categoryAttributes.PARKING_LOT.parkingType !== 'PRIVATE'
                    ) {
                        setStroke(place, 'blue');
                    }
                }
            }
        }
    }

    function setStroke(place, color) {
        const polygon = W.userscripts.getFeatureElementByDataModel(place);
        if (polygon) {
            polygon.setAttribute('stroke', color);
        }
    }

    function init() {
        const wazeMap = W.map;
        if (!wazeMap) {
            setTimeout(init, 1000);
            return;
        }

        wazeMap.events.register('moveend', null, highlightPlaces);
        wazeMap.events.register('zoomend', null, highlightPlaces);
        wazeMap.events.register('changelayer', null, highlightPlaces);

        console.log('[tbrks] place highlighter active')

        highlightPlaces();
    }

    function waitForWaze() {
        if (typeof W !== 'undefined' && typeof W.model !== 'undefined' && typeof W.model.venues !== 'undefined') {
            init();
        } else {
            setTimeout(waitForWaze, 1000);
        }
    }

    waitForWaze();
})();
