/* global simplify */
// ==UserScript==
// @name         WME Simplify Place Geometry
// @description  Simplifies geometry of area places in WME
// @version      2018.05.07.02
// @author       SAR85
// @copyright	 SAR85
// @license		 CC BY-NC-ND
// @grant		 none
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @namespace 	 https://greasyfork.org/en/scripts/367660-wme-simplify-place-geometry
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/367660/WME%20Simplify%20Place%20Geometry.user.js
// @updateURL https://update.greasyfork.org/scripts/367660/WME%20Simplify%20Place%20Geometry.meta.js
// ==/UserScript==
/* global W */
/* global OpenLayers */

(function () {
    'use strict';
    /* Global vars */
    var DEFAULT_SIMPLIFICATION_FACTOR = 5;
    var simplify;
    var simplifyVersion = '2018.05.07.01';
    var simplifyChanges = 'WME Simplify Area Geometry has been updated to version ' +
        simplifyVersion + '.\n' +
        '[*] Updated for editor compatibility.';
    var UpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
    var UpdateObject = require('Waze/Action/UpdateObject');

    function simpBootstrap() {
        if (W && W.loginManager && W.loginManager.events &&
            W.loginManager.events.register && $ && WazeWrap.Ready &&
            $('#map').size()) {
            simpInit();
        } else {
            window.setTimeout(function () {
                simpBootstrap();
            }, 1000);
        }
    }

    function initializeSimplifyFunc() {
		/*
		(c) 2013, Vladimir Agafonkin
		Simplify.js, a high-performance JS polyline simplification library
		mourner.github.io/simplify-js
        */
        function getSqDist(p1, p2) {

            var dx = p1.x - p2.x,
                dy = p1.y - p2.y;

            return dx * dx + dy * dy;
        }
        function getSqSegDist(p, p1, p2) {

            var x = p1.x,
                y = p1.y,
                dx = p2.x - x,
                dy = p2.y - y;

            if (dx !== 0 || dy !== 0) {

                var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

                if (t > 1) {
                    x = p2.x;
                    y = p2.y;

                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }

            dx = p.x - x;
            dy = p.y - y;

            return dx * dx + dy * dy;
        }
        function simplifyRadialDist(points, sqTolerance) {

            var prevPoint = points[0],
                newPoints = [prevPoint],
                point;

            for (var i = 1, len = points.length; i < len; i++) {
                point = points[i];

                if (getSqDist(point, prevPoint) > sqTolerance) {
                    newPoints.push(point);
                    prevPoint = point;
                }
            }

            if (prevPoint !== point) { newPoints.push(point); }
            return newPoints;
        }
        function simplifyDouglasPeucker(points, sqTolerance) {

            var len = points.length,
                MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
                markers = new MarkerArray(len),
                first = 0,
                last = len - 1,
                stack = [],
                newPoints = [],
                i,
                maxSqDist,
                sqDist,
                index;

            markers[first] = markers[last] = 1;
            while (last) {

                maxSqDist = 0;

                for (i = first + 1; i < last; i++) {
                    sqDist = getSqSegDist(points[i], points[first], points[last]);

                    if (sqDist > maxSqDist) {
                        index = i;
                        maxSqDist = sqDist;
                    }
                }

                if (maxSqDist > sqTolerance) {
                    markers[index] = 1;
                    stack.push(first, index, index, last);
                }

                last = stack.pop();
                first = stack.pop();
            }

            for (i = 0; i < len; i++) {
                if (markers[i]) { newPoints.push(points[i]); }
            }

            return newPoints;
        }
        function simplify(points, tolerance, highestQuality) {
            if (points.length <= 1) { return points; }
            var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
            points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
            points = simplifyDouglasPeucker(points, sqTolerance);
            return points;
        }
        return simplify;
    }

    function simpInit() {
        /* HTML */
        var content = '<div id="simplifyarea"><p id="simplifyhelp" style="text-align: center; margin-bottom: 2px; text-decoration: underline; font-weight: bold; cursor: help;">WME Simplify Area Geometry</p><p style="text-align: center; margin: 0px;">Simplification factor: <input type="number" min="1" max="20" id="simpE" style="height: 20px; background-color: rgba(0,0,0,0.8); padding-left: 2px; border: 1px solid white; color: white; width: 50px"></p><p style="color: white;margin: 2px 0 0 0;"><a id="simplifylink" style="cursor:pointer; color: rgb(27,237,30)">Simplify Geometry</a> | <a id="clearlink" style="cursor:pointer; color: red;">Clear Geometry</a></p></div>';
        var css = {
            "display": "none",
            "position": "absolute",
            "top": "120px",
            "left": "73px",
            "padding": "4px",
            "background-color": "rgba(0,0,0,0.8)",
            "border-radius": "5px",
            "border": "none",
            "color": "white",
            "font-size": "0.9em"
        };

        /* Initialize simplification library */
        simplify = initializeSimplifyFunc();

        /* Add HTML to page and initialize*/
        $('#map').append(content);
        $('#simplifyarea').css(css);
        $('#simpE').val(localStorage.simplifyE ||
            DEFAULT_SIMPLIFICATION_FACTOR);
        $('#simplifylink').click(simplifyFeatureGeometry);
        $('#clearlink').click(clearFeatureGeometry);
        try {
            $('#simplifyarea').draggable();
        } catch (err) { }

        /* Event listeners */
        W.loginManager.events.register('afterloginchanged', null, simpInit);
        $('#simplifyhelp').click(function () {
            alert('To use WME Simplify Place Geometry: \n' +
                '1. Select an area place \n' +
                '2. Select an appropriate simplification factor (usually 5-10) \n' +
                '3. Click the link to simplify or clear the geometry');
        });
        $('#simpE').change(function () {
            localStorage.simplifyE = $('#simpE').val();
        });
        W.selectionManager.events.register('selectionchanged', null,
            function () {
                if (W.selectionManager.hasSelectedFeatures()) {
                    var selectedItem = W.selectionManager.getSelectedFeatures()[0].model;
                    if (!(selectedItem.geometry instanceof OpenLayers.Geometry.Polygon)) {
                        return;
                    }
                    $('#simplifyarea').fadeIn('fast');
                } else {
                    $('#simplifyarea').fadeOut('fast');
                }
            });

        /* Shortcut key = shift+j for simplifying */
        new WazeWrap.Interface.Shortcut('simplifyFeatureGeometry', 'editing', 'S+j', simplifyFeatureGeometry, this).add();

        /* Shortcut key = ctrl+shift+j for clearing */
        new WazeWrap.Interface.Shortcut('clearFeatureGeometry', 'editing', 'CS+j', clearFeatureGeometry, this).add();

        console.log('WME Simplify Area Geometry Initialized');

        /* Update Alert */
        if (typeof window.localStorage.simplifyVersion === 'undefined' || window.localStorage.simplifyVersion !== simplifyVersion) {
            alert(simplifyChanges);
            window.localStorage.simplifyVersion = simplifyVersion;
        }
    }

    function simplifyFeatureGeometry(e) {
        var place = W.selectionManager.getSelectedFeatures()[0];
        var oldGeometry = place.geometry.clone();
        var newGeometry = oldGeometry.clone();

        if (!W.selectionManager.hasSelectedFeatures() || W.selectionManager.getSelectedFeatures()[0].model.type !== 'venue' ||
            !W.selectionManager.getSelectedFeatures()[0].model.isGeometryEditable() ||
            !(W.selectionManager.getSelectedFeatures()[0].model.geometry instanceof OpenLayers.Geometry.Polygon)) {
            return;
        }
        e = $('#simpE').val() || DEFAULT_SIMPLIFICATION_FACTOR;

        newGeometry.components[0].components = simplify(oldGeometry.components[0].components, e, false);
        if (newGeometry.components[0].components.length <
            oldGeometry.components[0].components.length &&
            newGeometry.components[0].components.length > 2) {
            W.model.actionManager.add(new UpdateFeatureGeometry(
                place.model, W.model.venues, oldGeometry, newGeometry));
            console.log('WME Simplify Area Geometry: ' +
                place.model.attributes.name + ' simplified from ' +
                oldGeometry.components[0].components.length + ' to ' +
                newGeometry.components[0].components.length +
                ' geo nodes using factor ' + e + '.');
        } else {
            console.log('Geo nodes cannot be simplified from ' +
                oldGeometry.components[0].components.length + ' to ' +
                newGeometry.components[0].components.length + '.');
        }
    }

    function clearFeatureGeometry() {
        var newGeometry,
            navAction;
        var venue = W.selectionManager.getSelectedFeatures()[0].model;
        var newEntryExitPoint = {
            entry: true,
            exit: true
        };
        var oldGeometry = venue.geometry;

        if (!W.selectionManager.hasSelectedFeatures() ||
            W.selectionManager.getSelectedFeatures()[0].model.type !== 'venue' ||
            !W.selectionManager.getSelectedFeatures()[0].model.isGeometryEditable() ||
            !(W.selectionManager.getSelectedFeatures()[0].model.geometry instanceof
                OpenLayers.Geometry.Polygon)) {
            return;
        }

        if (oldGeometry.components[0].components.length > 4) {
            newGeometry = oldGeometry.getBounds().toGeometry();
            if (newGeometry.getArea() > 160) {
                newGeometry.resize(0.5, newGeometry.getCentroid());
            }
            newEntryExitPoint.point = newGeometry.getCentroid();
            W.model.actionManager.add(new UpdateFeatureGeometry(
                venue, W.model.venues, oldGeometry, newGeometry));
            navAction = new UpdateObject(venue, {
                entryExitPoints: [newEntryExitPoint]
            });
            navAction.eachGeometryField = function (e, t) {
                var i,
                    n,
                    s,
                    r,
                    o;
                for (r = e.entryExitPoints, o = [], n = 0, s = r.length;
                    s > n; n++) {
                    i = r[n], o.push(t.call(this, 'point', i.point, i));
                }
                return o;
            };
            W.model.actionManager.add(navAction);
        }
    }
    simpBootstrap();
} ());
