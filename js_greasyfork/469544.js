// ==UserScript==
// @name         WME Google Traffic Layer
// @namespace    https://fxzfun.com/waze
// @version      1.1
// @description  Adds Google Maps traffic layer as an overlay to the Waze Map Editor
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469544/WME%20Google%20Traffic%20Layer.user.js
// @updateURL https://update.greasyfork.org/scripts/469544/WME%20Google%20Traffic%20Layer.meta.js
// ==/UserScript==

/* global W, OpenLayers, google, WazeWrap */

(function() {
    'use strict';
    let gmap;
    let trafficDiv;
    let layerEnabled = (localStorage.getItem("WMEGoogleTrafficLayer-enabled") ?? false) === 'true';

    function toggleLayer() {
        layerEnabled = !layerEnabled;
        document.querySelector("#layer-switcher-item_google_traffic_layer").checked = layerEnabled;
        if (layerEnabled) trafficDiv.style.display = "block";
        else trafficDiv.style.display = "none";
        localStorage.setItem("WMEGoogleTrafficLayer-enabled", layerEnabled);
    }

    // Callback function to initialize traffic layer
    function initTrafficLayer() {
        // Create a new TrafficLayer instance
        const trafficLayer = new google.maps.TrafficLayer();

        trafficDiv = document.createElement('div');
        trafficDiv.id = "trafficDiv";
        trafficDiv.style.position = 'absolute';
        trafficDiv.style.top = '0';
        trafficDiv.style.left = '0';
        trafficDiv.style.right = '0';
        trafficDiv.style.bottom = '0';
        W.map.olMap.getViewport().appendChild(trafficDiv);

        const lonlat = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat);
        lonlat.transform(new OpenLayers.Projection ('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));

        gmap = new google.maps.Map(trafficDiv, {
            zoom: W.map.getZoom(),
            center: { lat: lonlat.lat, lng: lonlat.lon },
            disableDefaultUI: true,
            zoomControl: false,
            styles: [
                { elementType: 'labels', stylers: [{ visibility: 'off' }] },
                { featureType: 'administrative', stylers: [{ visibility: 'off' }] },
                { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
                { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
                { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
                { featureType: 'landscape', stylers: [{ visibility: 'off' }] },
                { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
                { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
                { featureType: 'road', elementType: 'geometry', stylers: [{ color: 'rgba(200, 200, 200, 0.2)' }] },
                { featureType: 'transit', stylers: [{ visibility: 'off' }] },
                { featureType: 'water', stylers: [{ visibility: 'off' }] }
            ]
        });

        // Show the traffic layer
        trafficLayer.setMap(gmap);
        trafficDiv.firstElementChild.style.backgroundColor = 'rgb(229 227 223 / 0%)';
        trafficDiv.style.pointerEvents = 'none';
        if (!layerEnabled) trafficDiv.style.display = "none";

        WazeWrap.Events.register('moveend', null, function() {
            const lonlat = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat);
            lonlat.transform(new OpenLayers.Projection ('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
            gmap.panTo({ lat: lonlat.lat, lng: lonlat.lon });
        });

        WazeWrap.Events.register('zoomend', null, function() {
            gmap.setZoom(W.map.getZoom());
        });

        // window.gmap = gmap; // for testing

        WazeWrap.Interface.AddLayerCheckbox(
            "display",
            "Google Traffic Layer",
            layerEnabled,
            toggleLayer,
            W.map.getLayerByName("Google Traffic Layer"));

        new WazeWrap.Interface.Shortcut('WMEGoogleTrafficLayer', 'Toggle Traffic Layer',
                                        'layers', 'layersToggleWMEGoogleTrafficLayer', "Shift+T", toggleLayer, null).add();
    }

    if (W && W.userscripts && W.userscripts.state && W.userscripts.state.isReady) {
        initTrafficLayer();
    } else {
        document.addEventListener('wme-ready', initTrafficLayer, { once: true });
    }
})();