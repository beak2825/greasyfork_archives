// ==UserScript==
// @name         Art Monthly fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove markers for galleries that do not have shows
// @author       Enrico Costanza
// @match        https://www.artmonthly.co.uk/magazine/site/london-gallery-map
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502063/Art%20Monthly%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/502063/Art%20Monthly%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'esversion: 9';

    // remove markers
    for (const [key, value] of Object.entries(map._layers)) {
        console.log(`${key}: ${value._icon}`);
        if (value._icon !== undefined) {
            map.removeLayer(value);
        }
    }

    // loop through the array and add a marker for each
    // only add markers for galleries that have shows
    for (var i = 0; i < galleries.length; i++) {
        //console.log(galleries[i][4]);
        if (galleries[i][4] === undefined) {
            continue;
        }
        if (galleries[i][4].includes(' to ') === false) {
            continue;
        }
        marker = new L.marker([galleries[i][1], galleries[i][2], galleries[i][0]], {icon: galleryIcon})
            .bindPopup(galleries[i][4], PopupClass)
            .bindTooltip(galleries[i][0], {permanent: true, ...TooltipClass})
            .openTooltip()
            .addTo(map);
	}
})();