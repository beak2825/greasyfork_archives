// ==UserScript==
// @name         WME Auto Update URL
// @namespace    https://fxzfun.com/
// @version      0.1
// @description  updates the url as the map is moved
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456233/WME%20Auto%20Update%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/456233/WME%20Auto%20Update%20URL.meta.js
// ==/UserScript==

/* global W, OL, WazeWrap */

(function() {
    'use strict';

    (() => {
        var i = setInterval(function () {
            if (WazeWrap != null && WazeWrap.Ready) {
                clearInterval(i);
                setTimeout(function() {
                    addAutoUpdateUrl();
                }, 1000);
            }
        }, 1000);
    })();

    function addAutoUpdateUrl() {
        WazeWrap.Events.register("moveend", null, fxz_UpdateUrl);
        WazeWrap.Events.register("zoomend", null, fxz_UpdateUrl);
        WazeWrap.Events.register("selectionchanged", null, fxz_UpdateUrl);
    }

    function fxz_UpdateUrl() {
        var lonlat = new OL.LonLat(W.map.getCenter().lon, W.map.getCenter().lat);
        lonlat.transform(new OL.Projection('EPSG:900913'), new OL.Projection('EPSG:4326'));
        var zoom = W.map.getZoom();

        var segments = [];
        var venues = [];
        W.selectionManager.getSelectedFeatures().forEach(item => {
            if (item.model.type == "segment") {
                segments.push(item.model.attributes.id);
            } else if (item.model.type == "venue") {
                venues.push(item.model.attributes.id);
            }
        });

        var url = `?env=${W.app._urlParams.env}&lat=${lonlat.lat}&lon=${lonlat.lon}&zoomLevel=${zoom}`;
        if (segments.length > 0) url += "&segments=" + segments.join(",");
        if (venues.length > 0) url += "&venues=" + venues.join(",");

        history.replaceState(null, window.title, url);
    }
})();