// ==UserScript==
// @name Sri Lanka MapRaid 2 Boundary
// @namespace
// @description a script to define border for Sri Lanka MapRaid (12 June - 10 July 2016)
// @include https://www.waze.com/editor/*
// @include https://www.waze.com/*/editor/*
// @include https://editor-beta.waze.com/*
// @version 0.0.1
// @grant none
// @copyright AndyLaode
// @namespace https://greasyfork.org/users/12091
// @downloadURL https://update.greasyfork.org/scripts/20491/Sri%20Lanka%20MapRaid%202%20Boundary.user.js
// @updateURL https://update.greasyfork.org/scripts/20491/Sri%20Lanka%20MapRaid%202%20Boundary.meta.js
// ==/UserScript==

//---------------------------------------------------------------------------------------
function bootstrap_MapOverlay()
{
var bGreasemonkeyServiceDefined = false;

try {
bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === 'object');
}
catch (err) { /* Ignore */ }

if (typeof unsafeWindow === 'undefined' || ! bGreasemonkeyServiceDefined) {
unsafeWindow = ( function () {
var dummyElem = document.createElement('p');
dummyElem.setAttribute('onclick', 'return window;');
return dummyElem.onclick();
}) ();
}

/* begin running the code! */
setTimeout(InitMapOverlay, 1000);
}

function AddMapPoligon(mapLayer,CityPoints,CityColor,CityNumber){

var mro_Map = unsafeWindow.Waze.map;
var mro_OL = unsafeWindow.OpenLayers;
var mapGroupLabel = '' + CityNumber;
var mapName = 'mapGroup' + CityNumber;

var style = {
strokeColor: CityColor,
strokeOpacity: '1',
strokeWidth: 7,
fillColor: CityColor,
fillOpacity: 0.15,
label: mapGroupLabel,
labelOutlineColor: 'black',
labelOutlineWidth: 3,
fontSize: 100,
fontColor: CityColor,
fontOpacity: '.9',
fontWeight: 'bold' 
};

var attributes = {
name: mapName,
number: CityNumber
};

var pnt= [];
for(i=0;i<CityPoints.length;i++){
convPoint = new OpenLayers.Geometry.Point(CityPoints[i].lon,CityPoints[i].lat).transform(new OpenLayers.Projection('EPSG:4326'), mro_Map.getProjectionObject());
pnt.push(convPoint);
}

var ring = new mro_OL.Geometry.LinearRing(pnt);
var polygon = new mro_OL.Geometry.Polygon([ring]);

var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
mapLayer.addFeatures([feature]);

}

function CurrentMapLocation(City_mapLayer){
var mro_Map = unsafeWindow.Waze.map;

for(i=0;i < City_mapLayer.features.length;i++){
var CityMapCenter= mro_Map.getCenter();
var mapCenterPoint = new OpenLayers.Geometry.Point(CityMapCenter.lon,CityMapCenter.lat);
var mpCenterCheck = City_mapLayer.features[i].geometry.components[0].containsPoint(mapCenterPoint);
//console.log('MapRaid: ' + City_mapLayer.features[i].attributes.number + ': ' + mpCenterCheck);
if(mpCenterCheck === true){
var mapLocationLabel = ('.WazeControlLocationInfo').text();
setTimeout(function(){$('.WazeControlLocationInfo').text(mapLocationLabel)},200);
}
}
}

function InitMapOverlay(){

var mro_Map = unsafeWindow.Waze.map;
var mro_OL = unsafeWindow.OpenLayers;

if (mro_Map === null) return;
if (mro_OL === null) return;

var mro_mapLayers = mro_Map.getLayersBy('uniqueName','__MapCityGroups');

var City_mapLayer = new mro_OL.Layer.Vector('Sri Lanka MapRaid 2 Boundary', {
displayInLayerSwitcher: true,
uniqueName: '__MapCityGroups'
});

I18n.translations.en.layers.name['__MapCityGroups'] = 'Sri Lanka';
mro_Map.addLayer(City_mapLayer);
City_mapLayer.setVisibility(true);

var Group1 = [{lon:'79.568481',lat:'8.434338'},{lon:'79.7291565',lat:'7.2916388'},{lon:'80.469017',lat:'7.3028767'},{lon:'80.3114319',lat:'8.2672141'}];
var Group2 = [{lon:'80.3114319',lat:'8.2672141'},{lon:'80.469017',lat:'7.3028767'},{lon:'81.1724854',lat:'7.3038984'},{lon:'81.1268234',lat:'8.0940712'}];
var Group3 = [{lon:'81.1268234',lat:'8.0940712'},{lon:'81.1724854',lat:'7.3038984'},{lon:'81.974487',lat:'7.32433'},{lon:'81.655884',lat:'7.977638'}];
var Group4 = [{lon:'79.7291565',lat:'7.2916388'},{lon:'79.876099',lat:'6.266158'},{lon:'80.5970764',lat:'6.409472'},{lon:'80.469017',lat:'7.3028767'}];
var Group5 = [{lon:'80.469017',lat:'7.3028767'}, {lon:'80.5970764',lat:'6.409472'}, {lon:'81.2232971',lat:'6.5350095'}, {lon:'81.1724854',lat:'7.3038984'}];
var Group6 = [{lon:'81.1724854',lat:'7.3038984'}, {lon:'81.2232971',lat:'6.5350095'}, {lon:'81.8687439',lat:'6.6577874'}, {lon:'81.974487',lat:'7.32433'}];
var Group7 = [{lon:'79.876099',lat:'6.266158'}, {lon:'80.414429',lat:'5.75264'}, {lon:'81.809692',lat:'6.249776'}, {lon:'81.8687439',lat:'6.6577874'}];

AddMapPoligon(City_mapLayer,Group1,'#FF0033','Group 1');
AddMapPoligon(City_mapLayer,Group2,'#33FF00','Group 2');
AddMapPoligon(City_mapLayer,Group3,'#FFFF00','Group 3');
AddMapPoligon(City_mapLayer,Group4,'#FF0033','Group 4');
AddMapPoligon(City_mapLayer,Group5,'#FFFF00','Group 5');
AddMapPoligon(City_mapLayer,Group6,'#FF00FF','Group 6');
AddMapPoligon(City_mapLayer,Group7,'#FFFF00','Group 7');
  
setTimeout(function(){CurrentMapLocation(City_mapLayer)},3000);
mro_Map.events.register('moveend', Waze.map, function(){CurrentMapLocation(City_mapLayer)});
mro_Map.events.register('zoomend', Waze.map, function(){CurrentMapLocation(City_mapLayer)});

}

bootstrap_MapOverlay(); 