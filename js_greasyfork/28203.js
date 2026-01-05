// ==UserScript==
// @name			WME Miami Grid Overlay
// @namespace		https://greasyfork.org/en/users/107283-will-danner-willdanneriv-3
// @description		Creates polygons for the Miami Grid Overlay "Miami Grid" layer
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor/*
// @match          https://www.waze.com/editor/*
// @version			0.1
// @grant			none
// @copyright		2017 willdanneriv, based on work by 2016 Glodenox, based on work by 2015 rickzabel, based on work by 2014 davielde
// @downloadURL https://update.greasyfork.org/scripts/28203/WME%20Miami%20Grid%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/28203/WME%20Miami%20Grid%20Overlay.meta.js
// ==/UserScript==
setTimeout(initMapRaidOverlay, 1000);
var raid_mapLayer;

function addRaidPolygon(raidLayer, groupPoints, color, name) {
    var style = {
        strokeColor: "Red",
        strokeOpacity: '.8',
        strokeWidth: 3,
        fillColor: '#FFFFFF', // Doesn't matter, opacity is set to 0
        fillOpacity: 0,
        label: name,
        labelOutlineColor: "Black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: "Red",
        fontOpacity: '.85',
        fontWeight: "bold"
    };

    var attributes = {
        name: name
    };

    var pnt = [];
    for (i = 0; i < groupPoints.length; i++) {
        convPoint = new OL.Geometry.Point(groupPoints[i][0], groupPoints[i][1]).transform(
            new OL.Projection("EPSG:4326"), Waze.map.getProjectionObject());
        pnt.push(convPoint);
    }

    var ring = new OL.Geometry.LinearRing(pnt);
    var polygon = new OL.Geometry.Polygon([ring]);

    var feature = new OL.Feature.Vector(polygon, attributes, style);
    raidLayer.addFeatures([feature]);
}

function displayCurrentRaidLocation() {
    var raidMapCenter = Waze.map.getCenter();
    var raidCenterPoint = new OL.Geometry.Point(raidMapCenter.lon, raidMapCenter.lat);
    var locationDiv = document.querySelector(
        '#topbar-container > div > div > div.location-info-region > div');
    var mapRaidDiv = locationDiv.querySelector('strong');
    if (mapRaidDiv === null) {
        mapRaidDiv = document.createElement('strong');
        mapRaidDiv.style.marginLeft = '5px';
        locationDiv.appendChild(mapRaidDiv);
    }

    for (i = 0; i < raid_mapLayer.features.length; i++) {
        if (raid_mapLayer.features[i].geometry.components[0].containsPoint(
            raidCenterPoint)) {
            mapRaidDiv.textContent = '[Overlay Miami Grid: ' + raid_mapLayer.features[i]
                .attributes.name + ']';
            break;
        }
    }
}

function initMapRaidOverlay() {
    var mro_mapLayers = Waze.map.getLayersBy("uniqueName", "__Miami_Grid");
    var aLat = '25.5600';
    var bLat = '25.6600';
    var cLat = '25.7000';
    var dLat = '25.7000';
    var eLat = '25.7600';
    var fLat = '26.0800';
    var gLat = '26.0800';
    var hLat = '26.0800';
    var jLat = '26.0800';
    var kLat = '26.0800';
    var lLat = '26.0800';
    var mLat = '26.0800';
    var nLat = '26.0800';
    var oLat = '26.0800';
    var pLat = '26.0800';
    var qLat = '26.0800';
    var rLat = '26.0800';
    var sLat = '26.0800';

    raid_mapLayer = new OL.Layer.Vector("Miami Grid", {
        displayInLayerSwitcher: true,
        uniqueName: "__Miami_Grid"
    });

    I18n.translations.en.layers.name["__Miami.Grid"] = "Miami Grid";
    Waze.map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);

    for (var a=1, al=9; a<al; a++) {
        addRaidPolygon(raid_mapLayer, [
            [-80.5600, aLat-'.0200'],
            [-80.5600, aLat],
            [-80.5350, aLat],
            [-80.5350, aLat-'.0200']
        ], '#000000', 'A' + a);

        aLat = aLat-'.0200';
    }

    for (b=1, bl=14; b<bl; b++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.5350, bLat-'.0200'],
            [-80.5350, bLat],
            [-80.5100, bLat],
            [-80.5100, bLat-'.0200']
        ], '#000000', 'B' + b);

        bLat = bLat-'.0200';
    }

    for (c=1, cl=16; c<cl; c++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.5100, cLat-'.0200'],
            [-80.5100, cLat],
            [-80.4850, cLat],
            [-80.4850, cLat-'.0200']
        ], '#000000', 'C' + c);

        cLat = cLat-'.0200';
    }

    for (d=1, dl=14; d<dl; d++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.4850, dLat-'.0200'],
            [-80.4850, dLat],
            [-80.4600, dLat],
            [-80.4600, dLat-'.0200']
        ], '#000000', 'D' + d);

        dLat = dLat-'.0200';
    }

    for (e=1, el=17; e<el; e++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.4600, eLat-'.0200'],
            [-80.4600, eLat],
            [-80.4350, eLat],
            [-80.4350, eLat-'.0200']
        ], '#000000', 'E' + e);

        eLat = eLat-'.0200';
    }

    for (f=1, fl=33; f<fl; f++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.4350, fLat-'.0200'],
            [-80.4350, fLat],
            [-80.4100, fLat],
            [-80.4100, fLat-'.0200']
        ], '#000000', 'F' + f);

        fLat = fLat-'.0200';
    }

    for (g=1, gl=33; g<gl; g++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.4100, gLat-'.0200'],
            [-80.4100, gLat],
            [-80.3850, gLat],
            [-80.3850, gLat-'.0200']
        ], '#000000', 'G' + g);

        gLat = gLat-'.0200';
    }

    for (h=1, hl=32; h<hl; h++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.3850, hLat-'.0200'],
            [-80.3850, hLat],
            [-80.3600, hLat],
            [-80.3600, hLat-'.0200']
        ], '#000000', 'H' + h);

        hLat = hLat-'.0200';
    }

    for (j=1, jl=28; j<jl; j++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.3600, jLat-'.0200'],
            [-80.3600, jLat],
            [-80.3350, jLat],
            [-80.3350, jLat-'.0200']
        ], '#000000', 'J' + j);

        jLat = jLat-'.0200';
    }

    for (k=1, kl=27; k<kl; k++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.3350, kLat-'.0200'],
            [-80.3350, kLat],
            [-80.3100, kLat],
            [-80.3100, kLat-'.0200']
        ], '#000000', 'K' + k);

        kLat = kLat-'.0200';
    }

    for (l=1, ll=25; l<ll; l++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.3100, lLat-'.0200'],
            [-80.3100, lLat],
            [-80.2850, lLat],
            [-80.2850, lLat-'.0200']
        ], '#000000', 'L' + l);

        lLat = lLat-'.0200';
    }

    for (m=1, ml=23; m<ml; m++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.2850, mLat-'.0200'],
            [-80.2850, mLat],
            [-80.2600, mLat],
            [-80.2600, mLat-'.0200']
        ], '#000000', 'M' + m);

        mLat = mLat-'.0200';
    }

    for (n=1, nl=21; n<nl; n++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.2600, nLat-'.0200'],
            [-80.2600, nLat],
            [-80.2350, nLat],
            [-80.2350, nLat-'.0200']
        ], '#000000', 'N' + n);

        nLat = nLat-'.0200';
    }

    for (o=1, ol=18; o<ol; o++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.2350, oLat-'.0200'],
            [-80.2350, oLat],
            [-80.2100, oLat],
            [-80.2100, oLat-'.0200']
        ], '#000000', 'O' + o);

        oLat = oLat-'.0200';
    }

    for (p=1, pl=18; p<pl; p++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.2100, pLat-'.0200'],
            [-80.2100, pLat],
            [-80.1850, pLat],
            [-80.1850, pLat-'.0200']
        ], '#000000', 'P' + p);

        pLat = pLat-'.0200';
    }

    for (q=1, ql=22; q<ql; q++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.1850, qLat-'.0200'],
            [-80.1850, qLat],
            [-80.1600, qLat],
            [-80.1600, qLat-'.0200']
        ], '#000000', 'Q' + q);

        qLat = qLat-'.0200';
    }

    for (r=1, rl=22; r<rl; r++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.1600, rLat-'.0200'],
            [-80.1600, rLat],
            [-80.1350, rLat],
            [-80.1350, rLat-'.0200']
        ], '#000000', 'R' + r);

        rLat = rLat-'.0200';
    }

    for (s=1, sl=17; s<sl; s++) {

        addRaidPolygon(raid_mapLayer, [
            [-80.1350, sLat-'.0200'],
            [-80.1350, sLat],
            [-80.1100, sLat],
            [-80.1100, sLat-'.0200']
        ], '#000000', 'S' + s);

        sLat = sLat-'.0200';
    }

    setTimeout(displayCurrentRaidLocation, 3000);
    Waze.map.events.register("moveend", Waze.map, function() {
        setTimeout(displayCurrentRaidLocation, 1500);
    });
    Waze.map.events.register("zoomend", Waze.map, function() {
        setTimeout(displayCurrentRaidLocation, 1500);
    });
}
