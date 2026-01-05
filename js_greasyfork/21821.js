// ==UserScript==
// @name Sri Lanka 3rd MapRaid Boundary
// @namespace
// @description a script to define border for Sri Lanka MapRaid (01 August to 31 August 2016)
// @include https://www.waze.com/editor/*
// @include https://www.waze.com/*/editor/*
// @include https://editor-beta.waze.com/*
// @version 0.0.1
// @grant none
// @copyright AndyLaode
// @namespace https://greasyfork.org/users/12091
// @downloadURL https://update.greasyfork.org/scripts/21821/Sri%20Lanka%203rd%20MapRaid%20Boundary.user.js
// @updateURL https://update.greasyfork.org/scripts/21821/Sri%20Lanka%203rd%20MapRaid%20Boundary.meta.js
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

var City_mapLayer = new mro_OL.Layer.Vector('Sri Lanka 3rd MapRaid Boundary', {
displayInLayerSwitcher: true,
uniqueName: '__MapCityGroups'
});

I18n.translations.en.layers.name['__MapCityGroups'] = 'Sri Lanka';
mro_Map.addLayer(City_mapLayer);
City_mapLayer.setVisibility(true);

var Group1 = [{lon:'79.244385',lat:'9.147605'},{lon:'79.3295288',lat:'8.763617'},{lon:'80.9710192',lat:'9.4205916'},{lon:'80.765991',lat:'9.743657'},{lon:'80.315552',lat:'10.062924'},{lon:'79.552002',lat:'9.738243'},{lon:'79.244385',lat:'9.147605'}];
var Group2 = [{lon:'79.3295288',lat:'8.763617'},{lon:'79.4565582',lat:'8.2046942'},{lon:'81.2346268',lat:'9.0051297'},{lon:'80.9710192',lat:'9.4205916'},{lon:'79.3295288',lat:'8.763617'}];
var Group3 = [{lon:'79.5907974',lat:'7.6041497'},{lon:'80.599823',lat:'8.0578699'},{lon:'80.3327179',lat:'8.5993527'},{lon:'79.4565582',lat:'8.2046942'},{lon:'79.5907974',lat:'7.6041497'}];
var Group4 = [{lon:'80.599823',lat:'8.0578699'},{lon:'81.6229248',lat:'8.385431'},{lon:'81.2346268',lat:'9.0051297'},{lon:'80.3327179',lat:'8.5993527'},{lon:'80.599823',lat:'8.0578699'}];
var Group5 = [{lon:'79.72641',lat:'6.9983337'},{lon:'80.6719245',lat:'7.5112385'},{lon:'80.59914',lat:'8.0595735'},{lon:'79.5901102',lat:'7.6058535'},{lon:'79.72641',lat:'6.9983337'}];
var Group6 = [{lon:'80.6726074',lat:'7.5095349'},{lon:'81.8756104',lat:'7.7150743'},{lon:'81.815186',lat:'8.083109'},{lon:'81.6229248',lat:'8.385431'},{lon:'80.599823',lat:'8.0578699'},{lon:'80.6726074',lat:'7.5095349'}];
var Group7 = [{lon:'79.72641',lat:'6.9983337'},{lon:'79.8405649',lat:'6.4873393'},{lon:'80.727539',lat:'7.015798'},{lon:'80.6719245',lat:'7.5112385'},{lon:'79.72641',lat:'6.9983337'}];
var Group8 = [{lon:'80.727539',lat:'7.015798'},{lon:'81.968994',lat:'7.17388'},{lon:'81.8756104',lat:'7.7150743'},{lon:'80.6719245',lat:'7.5112385'},{lon:'80.727539',lat:'7.015798'}];

AddMapPoligon(City_mapLayer,Group1,'#FF0033','Group 1');
AddMapPoligon(City_mapLayer,Group2,'#33FF00','Group 2');
AddMapPoligon(City_mapLayer,Group3,'#FFFF00','Group 3');
AddMapPoligon(City_mapLayer,Group4,'#FF0033','Group 4');
AddMapPoligon(City_mapLayer,Group5,'#FFFF00','Group 5');
AddMapPoligon(City_mapLayer,Group6,'#FF00FF','Group 6');
AddMapPoligon(City_mapLayer,Group7,'#FFFF00','Group 7');
AddMapPoligon(City_mapLayer,Group8,'#33FF00','Group 8');

setTimeout(function(){CurrentMapLocation(City_mapLayer)},3000);
mro_Map.events.register('moveend', Waze.map, function(){CurrentMapLocation(City_mapLayer)});
mro_Map.events.register('zoomend', Waze.map, function(){CurrentMapLocation(City_mapLayer)});

}

bootstrap_MapOverlay(); 