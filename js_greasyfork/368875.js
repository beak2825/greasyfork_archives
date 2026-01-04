// ==UserScript==
// @name         WME Client Tile Borders
// @namespace    https://greasyfork.org/en/users/32336-joyriding
// @version      1.10
// @description  Displays grid lines representing tile borders in the client.
// @author       Joyriding
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368875/WME%20Client%20Tile%20Borders.user.js
// @updateURL https://update.greasyfork.org/scripts/368875/WME%20Client%20Tile%20Borders.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global $ */
/* global WazeWrap */

(function() {
    'use strict';

    var settings = {};
    var wmeCtbLayer;

    var projection=new OpenLayers.Projection("EPSG:900913");
    var displayProjection=new OpenLayers.Projection("EPSG:4326");

    function bootstrap(tries) {
        tries = tries || 1;

        if (W && W.map &&
            W.model && W.loginManager.user &&
            WazeWrap.Ready && $ ) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        console.log("WME CTB Init");
        loadSettings();
        WazeWrap.Interface.AddLayerCheckbox("display", "Client Tile Borders", settings.Enabled, onLayerCheckboxChanged);
        onLayerCheckboxChanged(settings.Enabled);
    }

    function onLayerCheckboxChanged(checked) {
        settings.Enabled = checked;
        if (wmeCtbLayer) {
            wmeCtbLayer.setVisibility(settings.Enabled);
        }
        if (settings.Enabled)
        {
            if (!wmeCtbLayer) {
                wmeCtbLayer = new OpenLayers.Layer.Vector("wmeCtbLayer",{uniqueName: "__wmeCtbLayer"});
                W.map.addLayer(wmeCtbLayer);
            }
            W.map.events.register("moveend",W.map,drawGridLines);
            drawGridLines();
        } else {
            W.map.events.unregister("moveend",W.map,drawGridLines);
            if (wmeCtbLayer) {
                wmeCtbLayer.removeAllFeatures();
                W.map.removeLayer(wmeCtbLayer);
                wmeCtbLayer = null;
            }
        }
        saveSettings();
    }

    function getOLMapextent()
    {
        var extent = new OpenLayers.Bounds(W.map.getExtent());
        extent = extent.transform('EPSG:4326', 'EPSG:3857');
        return extent;
    }

    function drawGridLines()
    {
        wmeCtbLayer.removeAllFeatures();

        // Zoom-dependant line style options
        var lineWidth = 2;
        var lineColor = 'gray';
        if (W.map.getZoom() <= 1)
        {
            lineWidth = 1;
        }
        else if (W.map.getZoom() >= 15)
        {
            lineColor = '#EDEDED';
        }

        var e=getOLMapextent();
        var geoNW=new OpenLayers.Geometry.Point(e.left,e.top);
        var geoSE=new OpenLayers.Geometry.Point(e.right,e.bottom);

        geoNW=geoNW.transform(projection, displayProjection);
        geoSE=geoSE.transform(projection, displayProjection);

        // Drop everything to the right of the hundredth decimal place
        var latStart = parseFloat(fixedDigits(geoNW.y));
        var latEnd = parseFloat(fixedDigits(geoSE.y));
        var lonStart = parseFloat(fixedDigits(geoNW.x));
        var lonEnd = parseFloat(fixedDigits(geoSE.x));

        // Convert decimal coordinates to positive integer "index" number to make calculations easier and help prevent errors from floating point rounding
        // index = (decimal coordinate * 100) + (180 or 90 * 100)
        var latIndexStart = Number(toLatIndex(latStart));
        var latIndexEnd = Number(toLatIndex(latEnd));
        var lonIndexStart = Number(toLonIndex(lonStart));
        var lonIndexEnd = Number(toLonIndex(lonEnd));

        // Ensure that we're starting with the lower of the latitude coordinates
        var latIndex;
        if (latIndexStart > latIndexEnd)
        {
            latIndex = latIndexEnd;
            latIndexEnd = latIndexStart;
            latIndexStart = latIndex;
        }
        // Expand start and end by 1/100's of a degree so that grid extends beyond visible screen
        latIndexStart--;
        latIndexEnd++;

        // Ensure that we're starting with the lower of the longitude coordinates
        var lonIndex;
        if (lonIndexStart > lonIndexEnd)
        {
            lonIndex = lonIndexEnd;
            lonIndexEnd = lonIndexStart;
            lonIndexStart = lonIndex;
        }
        // Expand start and end by 1/100's of a degree so that grid extends beyond visible screen
        lonIndexStart--;
        lonIndexEnd++;

        // Draw latitude lines every 0.01 degrees
        latIndex = latIndexStart;
        while (latIndex <= latIndexEnd)
        {
            drawDashedLine(true, latIndex, latIndexStart, latIndexEnd, lonIndexStart, lonIndexEnd, lineWidth, lineColor);
            latIndex++;
        }

        // Draw longitude lines every 0.01 degrees
        lonIndex = lonIndexStart;
        while (lonIndex <= lonIndexEnd)
        {
            drawDashedLine(false, lonIndex, latIndexStart, latIndexEnd, lonIndexStart, lonIndexEnd, lineWidth, lineColor);
            lonIndex++;
        }
    }

    // Drop (not round) digits after the hundredths decimal place
    function fixedDigits(num) {
        var fixed = 2;
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    // Convert decimal degrees to and from an index number so that we're always dealing with a positive integer. lat + 180* and long + 90*.
    // When converting from the index number, round to nearest hundredths decimal.
    function toLatIndex(lat) {
        return Number.parseFloat((lat * 100) + 18000).toFixed(0);
    }

    function fromLatIndex(lat) {
        return Number.parseFloat((lat - 18000) / 100).toFixed(2);
    }

    function toLonIndex(lon) {
        return Number.parseFloat((lon * 100) + 9000).toFixed(0);
    }

    function fromLonIndex(lon) {
        return Number.parseFloat((lon - 9000) / 100).toFixed(2);
    }

    function drawDashedLine(isLatLine, lineIndex, latIndexStart, latIndexEnd, lonIndexStart, lonIndexEnd, lineWidth, lineColor) {
        var pointStart = new OpenLayers.Geometry.Point();
        var pointEnd   = new OpenLayers.Geometry.Point();

        if (isLatLine) {
            pointStart.x = Number(fromLonIndex(lonIndexStart));
            pointStart.y = Number(fromLatIndex(lineIndex));
            pointEnd.x = Number(fromLonIndex(lonIndexEnd));
            pointEnd.y = Number(fromLatIndex(lineIndex));
        } else {
            pointStart.x = Number(fromLonIndex(lineIndex));
            pointStart.y = Number(fromLatIndex(latIndexStart));
            pointEnd.x = Number(fromLonIndex(lineIndex));
            pointEnd.y = Number(fromLatIndex(latIndexEnd));
        }

        pointStart.transform(displayProjection, projection);
        pointEnd.transform(displayProjection, projection);

        let lsLine1 = new OpenLayers.Geometry.LineString([pointStart, pointEnd]);

        var lineFeature1 = new OpenLayers.Feature.Vector(lsLine1, {}, {
            strokeWidth: lineWidth,
            strokeDashstyle: '4 4',
            strokeColor: lineColor
        });
        wmeCtbLayer.addFeatures([lineFeature1]);
    }

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                Enabled: settings.Enabled
            };

            localStorage.setItem("wmeCtb_Settings", JSON.stringify(localsettings));
        }
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("wmeCtb_Settings"));
        var defaultSettings = {
            Enabled: true
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }
    }

    bootstrap();
})();
