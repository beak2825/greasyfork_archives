// ==UserScript==
// @name         WME Grid
// @namespace    https://greasyfork.org/en/scripts/21548-wme-grid
// @version      1.1
// @description  diplays a grid on WME
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/editor/*
// @include         https://beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21548/WME%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/21548/WME%20Grid.meta.js
// ==/UserScript==
//---------------------------------------------------------------------------------------

setTimeout(InitMapOverlay, 1000);

function AddPolygon(layer,groupPoints,groupColor,groupNumber){

    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;
    var groupLabel = groupNumber;
    var groupName = groupNumber;

    var style = {
        strokeColor: "Black",
        strokeOpacity: 0.8,
        strokeWidth: 3,
        fillColor: groupColor,
        fillOpacity: 0.00,
        label: groupLabel,
        labelOutlineColor: "White",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: "Black",
        fontOpacity: 0.85,
        fontWeight: "bold"
    };

    var attributes = {
        name: groupName,
        number: groupNumber,
        holes: "false"
    };

    var pnt= [];
    for(i=0;i<groupPoints.length;i++){
        convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
        pnt.push(convPoint);
    }

    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);

    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    layer.addFeatures([feature]);

}

function InitMapOverlay(){

    var mro_Map = Waze.map;
    var mro_OL = OpenLayers;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","Grid");

    var mapLayer = new mro_OL.Layer.Vector("WME Grid", {
        displayInLayerSwitcher: true,
        uniqueName: "Grid"
    });

    I18n.translations.en.layers.name.Grid = "WME Grid";
    mro_Map.addLayer(mapLayer);
    mapLayer.setVisibility(true);

    //Grid spacing in Miles. Change this for a different grid spacing.
    var step = 6;

    //The starting LATitude and LONGitude. Change these coordinates to the South-East corner of your desired grid area.
    var latStart = 40.985;
    var longStart = -107.5;

    //The ending LATitude and LONGitude. Change these coordinates to the North-West corner of your desired grid area
    var latEnd = 42.27564;
    var longEnd = -111.0755;

    var latStep = 0.01449275 * step;
    var x = 1;

    var longStep = -0.018867917 * step;
    var y = 1;

    var lat = latStart;
    var long = longStart;

    while(long > longEnd){

        while(lat < latEnd){

            var a = "R" + x + "-C" +y;
            var VGrid0 = [{lon:long,lat:lat},{lon:long,lat:lat + latStep},{lon:long + longStep,lat:lat + latStep},{lon:long + longStep,lat:lat}];
            AddPolygon(mapLayer, VGrid0,"#",a);
            lat = lat + latStep;
            x = x + 1;

        }

        lat = latStart;
        x = 1;
        long = long + longStep;
        y = y + 1;
    }

}