// ==UserScript==
// @name         MapGenie - Smaller Icon Size
// @namespace    https://github.com/Auncaughbove17/my-userscripts/
// @version      0.3.3
// @description  Makes the icons smaller on the map, so you can see more of the map at once.
// @author       Alistair1231
// @match        https://mapgenie.io/*
// @icon         https://icons.duckduckgo.com/ip2/mapgenie.io.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464497/MapGenie%20-%20Smaller%20Icon%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/464497/MapGenie%20-%20Smaller%20Icon%20Size.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/464497-mapgenie-smaller-icon-size
// https://openuserjs.org/scripts/Alistair1231/MapGenie_-_Smaller_Icon_Size
(function () {

    function adjustIconSize() {
        // Get the current zoom level
        var zoom = map.getZoom();
        var maxZoom = map.getMaxZoom();
        var minZoom = map.getMinZoom();
        // Loop through all the symbols on the 'locations' layer

        var iconSizeAtMaxZoom = .9; // replace with actual value
        var iconSizeAtMinZoom = .7; // replace with actual value

        var logarithmicScale = Math.max(0, Math.log(iconSizeAtMaxZoom / iconSizeAtMinZoom) / Math.log(maxZoom / minZoom) * Math.log(zoom / minZoom)) * 2.5;

        // var newZoom= Math.max(0.15, Math.min(1, (zoom - 5) / maxZoom));
        console.log(`zoom detected, adjusting icon size to ${logarithmicScale}`);
        mapManager.setIconSize(logarithmicScale); // Adjust the minimum and maximum size as needed)


    }
    if (typeof map !== "undefined") {
        adjustIconSize();
        map.on('zoom', function () {
            adjustIconSize();
        });
    }
})();