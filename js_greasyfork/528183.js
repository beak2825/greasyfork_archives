// ==UserScript==
// @name         WME GGM Layer
// @name:vi      WME GGM Layer
// @namespace    https://waze.com/minhtanz1
// @version      2.3
// @description  Adds a GGM layer overlay to the Waze Map Editor. Syncs with WME’s map center and zoom level. - Shift+P: Toggle layer visibility. - Shift+L: Toggle interactivity (enable/disable pointer events). - Shift+T to toggle the traffic jams on the layer
// @description:vi Thêm lớp phủ địa điểm của Google Maps vào Waze Map Editor. Đồng bộ với trung tâm bản đồ và mức thu phóng của WME. - Shift+P: Chuyển đổi chế độ hiển thị lớp. - Shift+L: Chuyển đổi tính tương tác (bật/tắt sự kiện con trỏ). - Shift+T bặt lớp tình trạng giao thông.
// @author       Minh Tan
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528183/WME%20GGM%20Layer.user.js
// @updateURL https://update.greasyfork.org/scripts/528183/WME%20GGM%20Layer.meta.js
// ==/UserScript==

/* global W, OpenLayers, google, WazeWrap */

(function() {
    'use strict';
    let gmap;
    let placeDiv;
    let layerEnabled = (localStorage.getItem("WMEGoogleLayer-enabled") ?? false) === 'true';
    let interactivityEnabled = false; // Default: interactivity disabled

    let trafficLayer;
    let trafficLayerEnabled = true;

    function toggleLayer() {
        layerEnabled = !layerEnabled;
        const checkbox = document.querySelector("#layer-switcher-item_google_place_layer");
        if (checkbox) {
            checkbox.checked = layerEnabled;
        }
        if (placeDiv) {
            placeDiv.style.display = layerEnabled ? "block" : "none";
        }
        localStorage.setItem("WMEGoogleLayer-enabled", layerEnabled);
    }

    // Toggle pointer events (i.e. interactivity) on the overlay
    function toggleInteractivity() {
        interactivityEnabled = !interactivityEnabled;
        if (placeDiv) {
            placeDiv.style.pointerEvents = interactivityEnabled ? 'auto' : 'none';
        }
        console.log("Google Map interactivity " + (interactivityEnabled ? "enabled" : "disabled"));
    }

    // Toggle the display of the Google Traffic Layer
    // function toggleTrafficLayer() {
    //     trafficLayerEnabled = !trafficLayerEnabled;
    //     if (trafficLayer) {
    //         trafficLayer.setMap(trafficLayerEnabled ? gmap : null);
    //         console.log("Google Traffic Layer " + (trafficLayerEnabled ? "enabled" : "disabled"));
    //     } else {
    //         console.warn("Traffic Layer not yet initialized.");
    //     }
    // }

    // Initialize the Google Maps overlay
    function initLayer() {

        trafficLayer = new google.maps.TrafficLayer();

        placeDiv = document.createElement('div');
        placeDiv.id = "trafficDiv";
        placeDiv.style.position = 'absolute';
        placeDiv.style.top = '0';
        placeDiv.style.left = '0';
        placeDiv.style.right = '0';
        placeDiv.style.bottom = '0';
        placeDiv.style.opacity = '0.65'; // transparent layer
        // Start with interactivity disabled so WME controls work
        placeDiv.style.pointerEvents = 'none';

        // Append to Waze Map Viewport
        const viewport = W.map.olMap ? W.map.olMap.getViewport() : document.getElementById('WazeMap');
        viewport.appendChild(placeDiv);

        // Transform coordinates
        let centerLon = W.map.getCenter().lon;
        let centerLat = W.map.getCenter().lat;

        const lonlat = new OpenLayers.LonLat(centerLon, centerLat);
        lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));

        gmap = new google.maps.Map(placeDiv, {
            zoom: W.map.getZoom(),
            center: { lat: lonlat.lat, lng: lonlat.lon },
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeId: 'roadmap',
            styles: [ // ADDED MISSING 'styles:' KEY HERE
                // DON'T CHANGE ANYTHING FROM THIS
                { featureType: 'landscape', stylers: [{ visibility: 'off' }] },
                // TO THIS

                // Link get style json: https://mapstyle.withgoogle.com/
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        { "color": "#fc2eff" },
                        { "weight": 2 }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        { "color": "#d6e6ff" },
                        { "visibility": "on" },
                        { "weight": 2 }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels.text",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#000000" }]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels.text.stroke",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "poi.attraction",
                    "elementType": "labels.icon",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "poi.attraction",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#209d2f" }]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "labels.icon",
                    "stylers": [
                        { "visibility": "simplified" },
                        { "visibility": "on" }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "labels.text",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "poi.government",
                    "elementType": "labels.icon",
                    "stylers": [{ "color": "#b90e0e" }]
                },
                {
                    "featureType": "poi.government",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#b90e0e" }]
                },
                {
                    "featureType": "poi.medical",
                    "elementType": "geometry.fill",
                    "stylers": [{ "color": "#f8a0a0" }]
                },
                {
                    "featureType": "poi.medical",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "poi.school",
                    "stylers": [
                        { "color": "#4400ff" },
                        { "saturation": 55 },
                        { "lightness": -15 },
                        { "visibility": "on" },
                        { "weight": 1 }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "geometry.fill",
                    "stylers": [
                        { "color": "#4400ff" },
                        { "visibility": "on" }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        { "color": "#ffffff" },
                        { "visibility": "on" }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        { "color": "#4400ff" },
                        { "lightness": -10 },
                        { "weight": 5.5 }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        { "color": "#ffffff" },
                        { "weight": 4 }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                        { "color": "#e9ec18" },
                        { "visibility": "on" },
                        { "weight": 2 }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [
                        { "color": "#0a68ff" },
                        { "visibility": "off" },
                        { "weight": 2.5 }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        { "visibility": "on" },
                        { "weight": 2.5 }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [
                        { "color": "#ff0000" },
                        { "visibility": "on" },
                        { "weight": 2 }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "transit.station.airport",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "transit.station.bus",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "transit.station.rail",
                    "stylers": [{ "visibility": "on" }]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.geometry",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text",
                    "stylers": [{ "color": "#ffffff" }]
                }
            ]
        });

        // Apply Traffic Layer status
        // trafficLayer.setMap(trafficLayerEnabled ? gmap : null);

        // Remove Google white background if possible
        google.maps.event.addListenerOnce(gmap, 'idle', function(){
            const canvas = placeDiv.querySelector('div');
            if(canvas) canvas.style.backgroundColor = 'transparent';
        });

        if (!layerEnabled) {
            placeDiv.style.display = "none";
        }

        // Sync Google Maps center with WME map movements
        WazeWrap.Events.register('moveend', null, function() {
            if(!gmap) return;
            const center = W.map.getCenter();
            const lonlat = new OpenLayers.LonLat(center.lon, center.lat);
            lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
            gmap.panTo({ lat: lonlat.lat, lng: lonlat.lon });
        });

        // Sync Google Maps zoom with WME zoom events
        WazeWrap.Events.register('zoomend', null, function() {
            if(!gmap) return;
            gmap.setZoom(W.map.getZoom());
        });

        window.gmap = gmap; // for testing

        // Register Interface
        WazeWrap.Interface.AddLayerCheckbox(
            "display",
            "Google GG Layer",
            layerEnabled,
            toggleLayer,
            null // Passing null here because this isn't a native OL layer
        );

        new WazeWrap.Interface.Shortcut(
            'WMEGoogleLayer',
            'Toggle GG Layer',
            'layers',
            'layersToggleWMEGoogleLayer',
            "Shift+P",
            toggleLayer,
            null
        ).add();

        new WazeWrap.Interface.Shortcut(
            'WMEGoogleInteractivityToggle',
            'Toggle Google Map Interactivity',
            'layers',
            'layersToggleGoogleInteractivity',
            'Shift+L',
            toggleInteractivity,
            null
        ).add();

        // new WazeWrap.Interface.Shortcut(
        //     'WMEGoogleTrafficLayer',
        //     'Toggle Google Traffic Layer',
        //     'layers',
        //     'layersToggleGoogleTrafficLayer',
        //     'Shift+T',
        //     toggleTrafficLayer,
        //     null
        // ).add();
    }

    if (W && W.userscripts && W.userscripts.state && W.userscripts.state.isReady) {
        initLayer();
    } else {
        document.addEventListener('wme-ready', initLayer, { once: true });
    }
})();