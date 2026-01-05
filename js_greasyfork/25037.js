/* global OL */
/* global W */
// ==UserScript==
// @name            WME CS
// @description     Shows the closest segment to a place
// @version         1.0.2
// @author          SAR85
// @copyright       SAR85
// @license         CC BY-NC-ND
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/*
// @namespace       https://greasyfork.org/users/9321
// @require         https://greasyfork.org/scripts/9794-wlib/code/wLib.js?version=106098
// @downloadURL https://update.greasyfork.org/scripts/25037/WME%20CS.user.js
// @updateURL https://update.greasyfork.org/scripts/25037/WME%20CS.meta.js
// ==/UserScript==
 
(function () {
    var alertUpdate = true,
        closestVersion = '1.0.2',
        closestChanges = 'WME Closest Segment has been updated to version ' +
            closestVersion + '.\n\n' +
            '[*] Updated for beta editor compatibility.',
        closestLayerName = 'WME Closest Segment',
        debugLevel = 0,
        segmentsInExtent = {},
        navPoint,
        selectedItem,
        lineStyle = {
            strokeWidth: 4,
            strokeColor: null, /* gets set in drawLine() */
            strokeLinecap: 'round'
        },
        pointStyle = {
            pointRadius: 6,
            fillColor: 'white',
            fillOpacity: 1,
            strokeColor: null, /* gets set in drawLine() */
            strokeWidth: '3',
            strokeLinecap: 'round'
        };
 
    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('WME CS: ' + message);
        }
    }
 
    function getSegmentsInExtent() {
        'use strict';
        var i,
            s,
            segments,
            mapExtent;
 
        log('Getting segments in map extent.', 2);
 
        segments = W.model.segments.objects;
        mapExtent = W.map.getExtent();
        segmentsInExtent = {};
 
        for (i in segments) {
            if (!segments.hasOwnProperty(i)) {
                continue;
            }
            s = W.model.segments.get(i);
            if (mapExtent.intersectsBounds(s.geometry.getBounds())) {
                segmentsInExtent[i] = s;
            }
        }
        return segmentsInExtent;
    }
 
    function inMapExtent(geometry) {
        if (!geometry || 'undefined' === typeof geometry.getBounds) {
            return false;
        }
        return W.map.getExtent().intersectsBounds(geometry.getBounds());
    }
 
    function clearLayerFeatures() {
        'use strict';
        var layer = W.map.getLayersByName(closestLayerName)[0];
        return layer.features.length > 0 && layer.removeAllFeatures();
    }
 
    function handleNavPointOffScreen() {
        if (selectedItem !== W.selectionManager.selectedItems.first() ||
            inMapExtent(navPoint.lonlat.toPoint())) {
            log('Selection changed or navPoint on screen.', 2);
            W.map.events.unregister('moveend', window, handleNavPointOffScreen);
            checkSelection();
        }
    }
 
    function checkConditions() {
        'use strict';
        var a = W.map.getZoom() > 3,
            b = W.map.landmarkLayer.getVisibility(),
            c = W.map.getLayersByName(closestLayerName)[0].getVisibility(),
            d = !$('#map-lightbox').is(':visible'); /* Check for HN editing */
 
        if (a && b && c && d) {
            log('Conditions are perfect.', 2);
            return true;
        } else {
            log('Conditions not met.', 2);
            return false;
        }
    }
 
    function removeDragCallbacks() {
        if(!W.geometryEditing.activeEditor == null){
            W.geometryEditing.activeEditor.dragControl.onDrag = function (e, t) {
                W.geometryEditing.activeEditor.venue.dragVertex.apply(W.geometryEditing.activeEditor, [e, t]);
            };
            if (null !== typeof navPoint) {
                try {
                    navPoint.events.unregister('drag', W.geometryEditing.activeEditor, findNearestSegment);
                } catch (err) { }
            }
        }
        clearLayerFeatures();
    }
 
    function drawLine(closestSegment) {
        'use strict';
        var start = closestSegment.featureStop,
            end = closestSegment.point,
            lineFeature,
            pointFeature;
 
        if (closestSegment.featureIsPoint) {
            lineStyle.strokeColor = '#00ece3';
            pointStyle.strokeColor = '#00ece3';
        } else {
            lineStyle.strokeColor = '#00d8ff';
            pointStyle.strokeColor = '#00d8ff';
        }
 
        lineFeature = new OL.Feature.Vector(new OL.Geometry.LineString([start, end]), {}, lineStyle);
        pointFeature = new OL.Feature.Vector(end, {}, pointStyle);
        W.map.getLayersByName(closestLayerName)[0].addFeatures([lineFeature, pointFeature]);
    }
 
    function findNearestSegment() {
        'use strict';
        var s,
            minDistance = Infinity,
            distanceToSegment,
            segmentType,
            closestSegment = {};
 
        if (selectedItem.model.isPoint()) {
            closestSegment.featureStop = selectedItem.model.geometry;
            closestSegment.featureIsPoint = true;
        } else {
            closestSegment.featureStop = W.geometryEditing.activeEditor.navigationPoint.lonlat.toPoint();
            closestSegment.featureIsPoint = false;
        }
        for (s in segmentsInExtent) {
            if (!segmentsInExtent.hasOwnProperty(s)) {
                continue;
            }
            /* Ignore pedestrian boardwalk, stairways, runways, and railroads */
            segmentType = segmentsInExtent[s].attributes.roadType;
            if (segmentType === 10 ||
                segmentType === 16 ||
                segmentType === 18 ||
                segmentType === 19) {
                continue;
            }
            if (selectedItem.model.isPoint()) {
                distanceToSegment = selectedItem.geometry.distanceTo(segmentsInExtent[s].geometry, {
                    details: true
                });
            } else {
                distanceToSegment = W.geometryEditing.activeEditor.navigationPoint.lonlat.toPoint().distanceTo(
                    segmentsInExtent[s].geometry, {
                        details: true
                    });
            }
            if (distanceToSegment.distance < minDistance) {
                minDistance = distanceToSegment.distance;
                closestSegment.seg = s;
                closestSegment.point = new OL.Geometry.Point(distanceToSegment.x1, distanceToSegment.y1);
            }
        }
 
        clearLayerFeatures();
        drawLine(closestSegment);
    }
 
    function checkSelection() {
        'use strict';
        log('Selection change called.', 2);
 
 
        if (!checkConditions()) {
            removeDragCallbacks();
        } else {
            if (W.selectionManager.hasSelectedItems()) {
                selectedItem = W.selectionManager.selectedItems[0];
                if ('venue' !== selectedItem.model.type) {
                    log('Selection is not a place.', 2);
                    removeDragCallbacks();
                    clearLayerFeatures();
                } else {
                    navPoint = W.geometryEditing.activeEditor.navigationPoint;
                    getSegmentsInExtent();
                    if (selectedItem.model.isPoint()) {
                        log('Selection is point venue.', 2);
                        W.geometryEditing.activeEditor.dragControl.onDrag = function (e, t) {
                            //W.geometryEditing.activeEditor.venue.dragVertex.apply(W.geometryEditing.activeEditor, [e, t]);
                            findNearestSegment();
                        };
                        findNearestSegment();
                    } else {
                        log('Selection is area venue.', 2);
                        if (null !== typeof navPoint) {
                            navPoint.events.register('drag', W.geometryEditing.activeEditor, findNearestSegment);
                            if (inMapExtent(navPoint.lonlat.toPoint())) {
                                findNearestSegment();
                            } else {
                                log('navPoint not on screen.', 2);
                                W.map.events.register('moveend', window, handleNavPointOffScreen);
                            }
                        }
                    }
                }
            } else {
                log('No item selected.', 2);
                removeDragCallbacks();
                clearLayerFeatures();
            }
        }
    }
 
    function init() {
        'use strict';
        var closestLayer;
 
        /* Check version and alert on update */
        if (alertUpdate && ('undefined' === window.localStorage.closestVersion ||
            closestVersion !== window.localStorage.closestVersion)) {
            alert(closestChanges);
            window.localStorage.closestVersion = closestVersion;
        }
 
        /* Add map layer */
        closestLayer = new OL.Layer.Vector(closestLayerName);
        closestLayer.events.register('visibilitychanged', closestLayer, checkSelection);
        W.map.addLayer(closestLayer);
 
        /* Event listeners */
        W.loginManager.events.register('afterloginchanged', this, init);
        W.model.actionManager.events.register('afterundoaction', this, checkSelection);
        W.model.actionManager.events.register('afteraction', this, checkSelection);
        W.selectionManager.events.register('selectionchanged', this, checkSelection);
 
        checkSelection();
 
        log('Initialized.', 0);
    }
 
    function bootstrap() {
        if (window.W && window.W.loginManager &&
            window.W.loginManager.events.register &&
            window.W.map) {
            log('Initializing...', 0);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 0);
            window.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }
    log('Bootstrap...', 0);
    bootstrap();
} ());
