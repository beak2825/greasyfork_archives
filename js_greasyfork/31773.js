// ==UserScript==
// @name WME_Assist_Scanner
// @author borman84 (Boris Molodenkov)
// @description Waze Map Editor Assist Scanner
// @match     https://world.waze.com/editor/*
// @match     https://*.waze.com/editor/*
// @match     https://*.waze.com/*/editor/*
// @match     https://world.waze.com/map-editor/*
// @match     https://world.waze.com/beta_editor/*
// @match     https://www.waze.com/map-editor/*
// @grant     none
// @include   https://editor-beta.waze.com/*
// @include   https://*.waze.com/editor/editor/*
// @include   https://*.waze.com/*/editor/*
// @version   0.5.22
// @namespace WazeRus
// ==/UserScript==

var WME_Assist = WME_Assist || {}

WME_Assist.Scaner = function (wazeapi) {
    var model = wazeapi.model;
    var map = wazeapi.map;
    var controller = wazeapi.controller;

    var getData = function (e, cb) {
        console.log(e);
        $.get(wazeapi.Config.paths.features, e).done(cb);
    }

    var splitExtent = function (extent, zoom) {
        var result = [];

        var ratio = map.getResolution() / map.getResolutionForZoom(zoom);
        var dx = extent.getWidth() / ratio;
        var dy = extent.getHeight() / ratio;

        var x, y;
        for (x = extent.left; x < extent.right; x += dx) {
            for (y = extent.bottom; y < extent.top; y += dy) {
                var bounds = new OpenLayers.Bounds();
                bounds.extend(new OpenLayers.LonLat(x, y));
                bounds.extend(new OpenLayers.LonLat(x + dx, y + dy));

                result.push(bounds);
            }
        }

        return result;
    }

    var zoomToRoadType = function (zoom) {
        var s = wazeapi.Config.segments.zoomToRoadType[zoom] || [];
        if (-1 === s) {
            s = W.Config.segments.allTypes;
        }

        var r = [];
        Object.keys(wazeapi.Config.segments.zoomToRoadType).forEach(function (t) {
            t = parseInt(t, 10);
            var i = s.contains(t);
            if (i) {
                r.push(t);
            }
        })

        return (r.length == 0) ? null : { roadTypes: s.toString() }
    }

    this.scan = function (bounds, zoom, analyze, progress) {
        var boundsArray = splitExtent(bounds, zoom);
        var completed = 0;

        if (boundsArray.length > 20 && !confirm('Script will scan ' + boundsArray.length + ' peaces. Are you OK?')) {
            return;
        }

        progress = progress || function () {}

        WME_Assist.series(boundsArray, 0, function (bounds, next) {
            var peace = bounds.transform(map.getProjectionObject(), map.displayProjection);

            var e = {
                bbox: peace.toBBOX(),
                language: I18n.locale,
                venueFilter: '1',
                venueLevel: wazeapi.Config.venues.zoomToSize[zoom],
            };

            OL.Util.extend(e, zoomToRoadType(zoom));

            getData(e, function (data) {
                analyze(peace, zoom, data);
                progress(++completed*100/boundsArray.length);
                next();
            });
        });
    }
}
