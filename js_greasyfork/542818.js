// ==UserScript==
// @name         WME Openers
// @version      1.0.5
// @description  Opens StreetView.vn (Ctrl+Alt+F), Mapillary (Ctrl+Alt+G), OSM (Ctrl+Alt+H), or Google Maps (Ctrl+Alt+J) at the current WME map center and zoom level.
// @author       Minh Tan
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @exclude      https://www.waze.com/*/user/editor*
// @grant        none
// @noframes
// @license      none
// @namespace https://greasyfork.org/users/1440408
// @downloadURL https://update.greasyfork.org/scripts/542818/WME%20Openers.user.js
// @updateURL https://update.greasyfork.org/scripts/542818/WME%20Openers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SHORTCUTS = {
        F: (lat, lng, z) => `https://www.streetview.vn/?lat=${lat}&lng=${lng}&z=${z}`,
        G: (lat, lng, z) => `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=${z}`,
        H: (lat, lng, z) => `https://www.openstreetmap.org/edit#map=${z}/${lat}/${lng}`,
        J: (lat, lng, z) => `https://www.google.com/maps/@${lat},${lng},${z}z/data=!3m1!1e3`
    };

    function getWGS84Center() {
        if (!window.W?.map?.getCenter) {
            console.error("WME Openers: WME map object not available.");
            return null;
        }

        const center = window.W.map.getCenter();
        try {
            const proj900913 = new OpenLayers.Projection("EPSG:900913");
            const proj4326 = new OpenLayers.Projection("EPSG:4326");
            const lonLat = new OpenLayers.LonLat(center.lon, center.lat);
            const transformed = lonLat.transform(proj900913, proj4326);

            return { lat: transformed.lat, lng: transformed.lon };
        } catch (e) {
            console.error("WME Openers: Transform error:", e);
            return null;
        }
    }

    function getWazeZoom() {
        return window.W?.map?.getZoom?.() ?? null;
    }

    function handleShortcut(e) {
        const isMod = e.ctrlKey || e.metaKey;
        if (!isMod || !e.altKey) return;

        const key = e.key.toUpperCase();
        if (!SHORTCUTS[key]) return;

        e.preventDefault();
        e.stopPropagation();

        const coords = getWGS84Center();
        const zoom = getWazeZoom();

        if (!coords || zoom === null) {
            console.warn("WME Openers: Could not retrieve coordinates or zoom.");
            return;
        }

        const url = SHORTCUTS[key](coords.lat, coords.lng, zoom);
        window.open(url, '_blank');
    }

    function init() {
        document.addEventListener('keydown', handleShortcut);
        console.log("WME Openers loaded. Shortcuts: Ctrl+Alt+[F,G,H,J]");
    }

    if (window.W?.map) {
        init();
    } else {
        document.addEventListener('wme-initialized', init, { once: true });
    }
})();