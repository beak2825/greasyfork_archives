// ==UserScript==
// @name         WME Place NavPoints
// @namespace    WazeDev
// @version      2024.09.20.000
// @description  Add place entry point indicators to the map
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @grant        GM_xmlhttpRequest
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/387498/WME%20Place%20NavPoints.user.js
// @updateURL https://update.greasyfork.org/scripts/387498/WME%20Place%20NavPoints.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global WazeWrap */
/* global turf */

(function main() {
    'use strict';

    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version;
    const DOWNLOAD_URL = 'https://update.greasyfork.org/scripts/387498/WME%20Place%20NavPoints.user.js';

    const _settings = {
        visible: true,
        plaVisible: true
    };

    let _layer;

    // NOTE: There are occasions where the street is not loaded in the model yet, and
    // the WazeWrap getStreetName function will throw an error.  This function will
    // just return null instead.
    // function getStreetName(primaryStreetID) {
    //     const street = W.model.streets.getObjectById(primaryStreetID);
    //     if (street) {
    //         return street.name;
    //     }
    //     return null;
    // }

    function getOLMapExtent() {
        let extent = new OpenLayers.Bounds(W.map.getExtent());
        extent = extent.transform('EPSG:4326', 'EPSG:3857');
        return extent;
    }

    function drawLines() {
        _layer.removeAllFeatures();
        if (!_settings.visible) return;

        const features = [];
        const bounds = getOLMapExtent().scale(2.0);
        const zoom = W.map.getZoom();
        W.model.venues.getObjectArray()
            .filter(venue => (
                _settings.plaVisible || !venue.isParkingLot())
                && bounds.intersectsBounds(venue.getOLGeometry().getBounds())
                && (zoom >= 6 || (venue.isResidential() && !venue.attributes.entryExitPoints.length)))
            .forEach(venue => {
                const pts = [];
                let mainColor = venue.isPoint() ? '#0FF' : '#0FF';
                let endPoint;

                // Get the places location.
                const placePoint = venue.getOLGeometry().getCentroid();
                pts.push(placePoint);

                // Get the main entry/exit point, if it exists.
                let entryExitPoint;
                if (venue.attributes.entryExitPoints.length) {
                    entryExitPoint = W.userscripts.toOLGeometry(venue.attributes.entryExitPoints[0].getPoint());
                    endPoint = entryExitPoint;
                    pts.push(entryExitPoint);
                } else {
                    endPoint = placePoint;
                }

                const geoJsonEndPoint = W.userscripts.toGeoJSONGeometry(endPoint);
                const closestSegment = findClosestSegment(geoJsonEndPoint, false, false);
                if (closestSegment) {
                    // Find the closest point on the closest segment (the stop point).
                    const stopPoint = turf.nearestPointOnLine(closestSegment.getGeometry(), geoJsonEndPoint).geometry;
                    pts.push(W.userscripts.toOLGeometry(stopPoint));

                    const placeStreetID = venue.attributes.streetID;
                    if (placeStreetID) {
                        // The intent here was to highlight places that route to a street with a name
                        // other than the place's street name, but I believe that is too common
                        // of a scenario and distracting.  Leaving this code here in case we
                        // can tweak it to be more useful somehow.

                        // const segmentStreetID = closestSegment.attributes.primaryStreetID;
                        // const segmentStreetName = getStreetName(segmentStreetID);
                        // const placeStreetName = getStreetName(placeStreetID);
                        // if (segmentStreetName !== placeStreetName) {
                        //     mainColor = '#FFA500';
                        // }
                    } else {
                        // If the place has no street listed, make the lines red.
                        mainColor = '#F00';
                    }

                    // Draw the lines.
                    features.push(new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.LineString(pts),
                        { isNavLine: true },
                        {
                            strokeColor: mainColor,
                            strokeWidth: 2,
                            strokeDashstyle: '6 4'
                        }
                    ));

                    // Draw the stop point.
                    features.push(
                        new OpenLayers.Feature.Vector(
                            pts[pts.length - 1],
                            { isNavLine: true },
                            {
                                pointRadius: 4,
                                strokeWidth: 2,
                                fillColor: '#A00',
                                strokeColor: mainColor,
                                fillOpacity: 1
                            }
                        )
                    );

                    // Draw the entry/exit point, if it exists.
                    if (entryExitPoint) {
                        features.push(
                            new OpenLayers.Feature.Vector(
                                entryExitPoint,
                                { isNavLine: true },
                                {
                                    pointRadius: 4,
                                    strokeWidth: 2,
                                    strokeColor: mainColor,
                                    fillColor: '#FFF',
                                    fillOpacity: 1
                                }
                            )
                        );
                    }
                }
            });

        _layer.addFeatures(features);
    }

    function findClosestSegment(mygeometry, ignorePLR, ignoreUnnamedPR) {
        const segments = W.model.segments.getObjectArray();
        let minDistance = Infinity;
        let closestSegment;

        segments.forEach(segment => {
            const { roadType } = segment.attributes;
            const segmentStreetID = segment.attributes.primaryStreetID;

            if (!segment.isDeleted()
                && ![10, 16, 18, 19].includes(roadType) // 10 ped boardwalk, 16 stairway, 18 railroad, 19 runway, 3 freeway
                && !(ignorePLR && roadType === 20) // PLR
                && !(ignoreUnnamedPR && roadType === 17 && WazeWrap.Model.getStreetName(segmentStreetID) === null)) { // PR
                const distanceToSegment = W.userscripts.toOLGeometry(mygeometry).distanceTo(segment.getOLGeometry(), { details: true });
                if (distanceToSegment.distance < minDistance) {
                    minDistance = distanceToSegment.distance;
                    closestSegment = segment;
                }
            }
        });
        return closestSegment;
    }

    function saveSettings() {
        localStorage.setItem('wme_place_navpoints', JSON.stringify(_settings));
    }

    function errorHandler(callback) {
        try {
            callback();
        } catch (ex) {
            console.error(ex);
        }
    }

    function onPlacesLayerCheckedChanged(checked) {
        _settings.visible = checked;
        $('#layer-switcher-item_pla_navpoints').attr('disabled', checked ? null : true);
        saveSettings();
        drawLines();
    }

    function onPlaLayerCheckedChanged(checked) {
        _settings.plaVisible = checked;
        saveSettings();
        drawLines();
    }

    function loadScriptUpdateMonitor() {
        try {
            const updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error('WME Place NavPoints:', ex);
        }
    }

    function init() {
        loadScriptUpdateMonitor();
        const loadedSettings = JSON.parse(localStorage.getItem('wme_place_navpoints'));
        $.extend(_settings, loadedSettings);
        const drawLinesFunc = () => errorHandler(drawLines);
        W.model.events.register('mergeend', null, drawLinesFunc);
        W.map.events.register('zoomend', null, drawLinesFunc);
        W.model.venues.on('objectschanged', drawLinesFunc);
        W.model.venues.on('objectsadded', drawLinesFunc);
        W.model.venues.on('objectsremoved', drawLinesFunc);
        W.model.segments.on('objectschanged', drawLinesFunc);
        W.model.segments.on('objectsadded', drawLinesFunc);
        W.model.segments.on('objectsremoved', drawLinesFunc);
        _layer = new OpenLayers.Layer.Vector('Place NavPoints Layer', {
            uniqueName: '__PlaceNavPointsLayer',
            displayInLayerSwitcher: false
        });
        W.map.addLayer(_layer);
        drawLines();
        WazeWrap.Interface.AddLayerCheckbox('Display', 'Place NavPoints', _settings.visible, onPlacesLayerCheckedChanged, null);
        WazeWrap.Interface.AddLayerCheckbox('Display', 'PLA NavPoints', _settings.visible, onPlaLayerCheckedChanged, null);
        $('#layer-switcher-item_pla_navpoints').attr('disabled', _settings.visible ? null : true).parent().css({ 'margin-left': '10px' });
    }

    function onWmeReady() {
        if (WazeWrap && WazeWrap.Ready) {
            init();
        } else {
            setTimeout(onWmeReady, 100);
        }
    }

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            onWmeReady();
        } else {
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    bootstrap();
})();
