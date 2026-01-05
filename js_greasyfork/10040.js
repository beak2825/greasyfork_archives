// ==UserScript==
// @name                WME Iceland Overlay
// @namespace           https://greasyfork.org/it/scripts/10040-wme-iceland-overlay
// @description         Creates polygons on the map of Iceland with info for editors
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.14
// @grant               none
// @license             http://creativecommons.org/licenses/by-nc-sa/3.0/
// @copyright           2015-2016 tbk0
// @downloadURL https://update.greasyfork.org/scripts/10040/WME%20Iceland%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/10040/WME%20Iceland%20Overlay.meta.js
// ==/UserScript==


function IcelandDrawLayers(raid_mapLayer)
{
//START_AUTOMATIC_SCRIPT




var layer1Points = [{lon:'-14.8122',lat:'65.7400'},{lon:'-14.9122',lat:'65.7400'},{lon:'-14.9122',lat:'65.7900'},{lon:'-14.8122',lat:'65.7900'}];
var layer2Points = [{lon:'-15.1200',lat:'65.6160'},{lon:'-15.0200',lat:'65.6160'},{lon:'-15.0200',lat:'65.6660'},{lon:'-15.1200',lat:'65.6660'}];
var layer3Points = [{lon:'-18.2450',lat:'65.7610'},{lon:'-18.1450',lat:'65.7610'},{lon:'-18.1450',lat:'65.8610'},{lon:'-18.2450',lat:'65.8610'}];
var layer4Points = [{lon:'-23.0000',lat:'65.5600'},{lon:'-22.7500',lat:'65.5600'},{lon:'-22.7500',lat:'65.6200'},{lon:'-23.0000',lat:'65.6200'}];
var layer5Points = [{lon:'-21.7500',lat:'65.7100'},{lon:'-21.5500',lat:'65.7100'},{lon:'-21.5500',lat:'65.8100'},{lon:'-21.7500',lat:'65.8100'}];
var layer6Points = [{lon:'-20.8110',lat:'65.6260'},{lon:'-20.9610',lat:'65.6260'},{lon:'-20.9610',lat:'65.5260'},{lon:'-20.8110',lat:'65.5260'}];
var layer7Points = [{lon:'-21.6040',lat:'64.9790'},{lon:'-21.5040',lat:'64.9790'},{lon:'-21.5040',lat:'65.0290'},{lon:'-21.6040',lat:'65.0290'}];
var layer8Points = [{lon:'-21.6940',lat:'65.1500'},{lon:'-21.5940',lat:'65.1500'},{lon:'-21.5940',lat:'64.9800'},{lon:'-21.6940',lat:'64.9800'}];
var layer9Points = [{lon:'-22.1790',lat:'65.2000'},{lon:'-22.0000',lat:'65.2000'},{lon:'-22.0000',lat:'65.1000'},{lon:'-22.1790',lat:'65.1000'}];
var layer10Points = [{lon:'-22.0000',lat:'65.4250'},{lon:'-21.8000',lat:'65.4250'},{lon:'-21.8000',lat:'65.3250'},{lon:'-22.0000',lat:'65.3250'}];
var layer11Points = [{lon:'-18.0700',lat:'65.6910'},{lon:'-17.9000',lat:'65.7200'},{lon:'-17.9000',lat:'65.7300'},{lon:'-18.0700',lat:'65.7010'}];
var layer12Points = [{lon:'-17.6750',lat:'63.6800'},{lon:'-17.6750',lat:'64.0200'},{lon:'-17.5450',lat:'64.0200'},{lon:'-17.5450',lat:'63.6800'}];
var layer13Points = [{lon:'-16.9760',lat:'63.8610'},{lon:'-16.9760',lat:'64.0970'},{lon:'-16.8750',lat:'64.0970'},{lon:'-16.8750',lat:'63.8610'}];
var layer14Points = [{lon:'-15.4410',lat:'64.2940'},{lon:'-15.4860',lat:'64.3100'},{lon:'-15.4860',lat:'64.4000'},{lon:'-15.2470',lat:'64.4000'},{lon:'-15.2460',lat:'64.3620'},{lon:'-15.3500',lat:'64.3630'},{lon:'-15.3520',lat:'64.3380'},{lon:'-15.3840',lat:'64.3370'},{lon:'-15.3840',lat:'64.3040'},{lon:'-15.3950',lat:'64.3030'},{lon:'-15.3940',lat:'64.2650'},{lon:'-15.4170',lat:'64.2650'},{lon:'-15.4220',lat:'64.2740'},{lon:'-15.4280',lat:'64.2740'}];
var layer15Points = [{lon:'-14.7730',lat:'64.3580'},{lon:'-14.7720',lat:'64.4390'},{lon:'-14.7690',lat:'64.5930'},{lon:'-14.9940',lat:'64.5870'},{lon:'-14.9960',lat:'64.9390'},{lon:'-15.1550',lat:'64.9340'},{lon:'-14.6820',lat:'65.0950'},{lon:'-14.5780',lat:'65.1000'},{lon:'-14.5760',lat:'64.9960'},{lon:'-14.6790',lat:'64.9900'},{lon:'-14.6790',lat:'64.9510'},{lon:'-14.6370',lat:'64.9480'},{lon:'-14.2890',lat:'64.9410'},{lon:'-14.0490',lat:'65.0386'},{lon:'-13.6870',lat:'64.9300'},{lon:'-14.0790',lat:'64.9210'},{lon:'-14.0810',lat:'64.8610'},{lon:'-14.0820',lat:'64.7640'},{lon:'-14.0780',lat:'64.7320'},{lon:'-14.1100',lat:'64.7070'},{lon:'-14.1100',lat:'64.6160'},{lon:'-14.4620',lat:'64.3940'}];
var layer16Points = [{lon:'-14.4670',lat:'65.1860'},{lon:'-14.3870',lat:'65.1560'},{lon:'-14.4980',lat:'65.1200'},{lon:'-14.5470',lat:'65.1610'}];
var layer17Points = [{lon:'-14.0480',lat:'65.0386'},{lon:'-13.9280',lat:'65.1100'},{lon:'-13.6980',lat:'65.1140'},{lon:'-13.6960',lat:'65.2150'},{lon:'-13.6890',lat:'65.2260'},{lon:'-13.6960',lat:'65.2810'},{lon:'-13.5540',lat:'65.2740'},{lon:'-13.4440',lat:'65.0900'},{lon:'-13.6870',lat:'64.9310'}];
var layer18Points = [{lon:'-21.1100',lat:'65.2660'},{lon:'-21.0910',lat:'65.2660'},{lon:'-21.0870',lat:'65.2700'},{lon:'-21.0830',lat:'65.2760'},{lon:'-21.0480',lat:'65.2850'},{lon:'-20.9920',lat:'65.2980'},{lon:'-20.9950',lat:'65.3240'},{lon:'-21.2060',lat:'65.3160'},{lon:'-21.1450',lat:'65.2430'},{lon:'-21.1360',lat:'65.2420'}];
var layer19Points = [{lon:'-19.6510',lat:'63.9830'},{lon:'-19.6510',lat:'64.7180'},{lon:'-19.0545',lat:'64.8711'},{lon:'-19.0517',lat:'64.3367'},{lon:'-18.8417',lat:'64.3394'},{lon:'-18.8440',lat:'64.1690'},{lon:'-19.4270',lat:'64.0460'},{lon:'-19.4240',lat:'63.9130'}];
var layer20Points = [{lon:'-15.9212',lat:'65.3063'},{lon:'-15.4887',lat:'65.1100'},{lon:'-15.5163',lat:'65.1056'},{lon:'-15.5737',lat:'65.0870'},{lon:'-15.6071',lat:'65.0220'},{lon:'-15.6775',lat:'65.0057'},{lon:'-15.6960',lat:'65.0147'},{lon:'-15.7218',lat:'65.0180'},{lon:'-15.7510',lat:'65.0046'},{lon:'-15.7739',lat:'64.9449'},{lon:'-15.7847',lat:'64.9395'},{lon:'-15.8148',lat:'64.9081'},{lon:'-15.8968',lat:'64.8714'},{lon:'-16.2677',lat:'64.9732'},{lon:'-16.2685',lat:'65.0258'},{lon:'-16.5331',lat:'65.0320'},{lon:'-16.5367',lat:'65.3074'},{lon:'-16.3336',lat:'65.3091'}];
var layer21Points = [{lon:'-15.6856',lat:'65.4673'},{lon:'-14.6922',lat:'65.7633'},{lon:'-14.6820',lat:'65.0950'},{lon:'-14.8874',lat:'65.0253'},{lon:'-15.0502',lat:'65.0173'},{lon:'-15.6778',lat:'65.4377'}];
var layer22Points = [{lon:'-18.6348',lat:'64.1709'},{lon:'-18.6320',lat:'64.5861'},{lon:'-18.6346',lat:'64.8764'},{lon:'-18.0751',lat:'64.7261'}];

AddRaidPolygon(raid_mapLayer,layer1Points,"#FFFF00",1,'New roads: 2014');
AddRaidPolygon(raid_mapLayer,layer2Points,"#FFFF00",2,'New roads: 2014');
AddRaidPolygon(raid_mapLayer,layer3Points,"#00FF00",3,'Area shifted: +80 / +40');
AddRaidPolygon(raid_mapLayer,layer4Points,"#FFFF00",4,'New roads: 2015');
AddRaidPolygon(raid_mapLayer,layer5Points,"#00FF00",5,'Area shifted: +140 / +110');
AddRaidPolygon(raid_mapLayer,layer6Points,"#00FF00",6,'Area shifted: +110 / +130');
AddRaidPolygon(raid_mapLayer,layer7Points,"#00FF00",7,'Area shifted: +140 / +130');
AddRaidPolygon(raid_mapLayer,layer8Points,"#008000",8,'Area shifted: +130 / +120 - provisional');
AddRaidPolygon(raid_mapLayer,layer9Points,"#00FF00",9,'Area Shifted: +140 / +110');
AddRaidPolygon(raid_mapLayer,layer10Points,"#00FF00",10,'Area Shifted: +140 / +110');
AddRaidPolygon(raid_mapLayer,layer11Points,"#FFFF00",11,'New roads: 2017 Tunnel Akureyri Húsavik');
AddRaidPolygon(raid_mapLayer,layer12Points,"#00FF00",12,'Area shifted: +80 / +30');
AddRaidPolygon(raid_mapLayer,layer13Points,"#00FF00",13,'Area shifted: +80 / +60');
AddRaidPolygon(raid_mapLayer,layer14Points,"#00FF00",14,'Area shifted: +70 / +110');
AddRaidPolygon(raid_mapLayer,layer15Points,"#FF0000",15,'Area shifted: +70 / +100 overlapping');
AddRaidPolygon(raid_mapLayer,layer16Points,"#00FF00",16,'Area shifted: +60 / +20');
AddRaidPolygon(raid_mapLayer,layer17Points,"#00FF00",17,'Area shifted: +70 / -20');
AddRaidPolygon(raid_mapLayer,layer18Points,"#FF0000",18,'Area shifted: +170 / +130 overlapping');
AddRaidPolygon(raid_mapLayer,layer19Points,"#00FF00",19,'Area shifted: +160 / +80');
AddRaidPolygon(raid_mapLayer,layer20Points,"#00FF00",20,'Area shifted: +110 / +70');
AddRaidPolygon(raid_mapLayer,layer21Points,"#00FF00",21,'Area shifted: +120 / +40');
AddRaidPolygon(raid_mapLayer,layer22Points,"#00FF00",22,'Area shifted: +90 / +80');



//END_AUTOMATIC_SCRIPT
}


function bootstrap_IcelandOverlay()
{
   var bGreasemonkeyServiceDefined = false;

   try
   {
      bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
   }
   catch (err) { /* Ignore */ }

   if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined)
   {
      unsafeWindow = ( function () {
         var dummyElem = document.createElement('p');
         dummyElem.setAttribute('onclick', 'return window;');
         return dummyElem.onclick();
      }) ();
   }

    /* begin running the code! */
    setTimeout(InitMapRaidOverlay, 1000);
}


function AddRaidPolygon(raidLayer,groupPoints,groupColor,groupNumber,groupComment)
{
    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;
    var groupName = 'Layer' + groupNumber;
    var pointLabel;

    var style = 
    {
        strokeColor: groupColor,
        strokeOpacity: 0.8,
        strokeWidth: 3,
        fillColor: groupColor,
        fillOpacity: 0.15,
        label: groupComment,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: groupColor,
        fontOpacity: 0.85,
        fontWeight: "bold"
    };

    var attributes = 
    {
        name: groupName,
        number: groupNumber
    };

    var pnt= [];
    for(i=0;i<groupPoints.length;i++)
    {
       convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
       //console.log('MapRaid: ' + JSON.stringify(groupPoints[i]) + ', ' + groupPoints[i].lon + ', ' + groupPoints[i].lat);
       pnt.push(convPoint);
       if ( groupComment.substring(0,12) === "Area shifted" )
       {
           pointLabel = '' + groupNumber + ' (' + (i+1) + ')' + groupComment.substring(12);
       }
       else
       {
           pointLabel = '' + (i+1);
       };
       AddRaidString(raidLayer,convPoint,groupColor,groupNumber,i,pointLabel);
   }

    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);

    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    raidLayer.addFeatures([feature]);
}


function AddRaidString(raidLayer,convPoint,groupColor,groupNumber,pointNumber,pointLabel)
{
    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;
    var groupName = 'Layer' + groupNumber;

    var style = 
    {
        strokeColor: groupColor,
        strokeOpacity: 0.8,
        strokeWidth: 3,
        fillColor: groupColor,
        fillOpacity: 0.15,
        label: pointLabel,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: groupColor,
        fontOpacity: 0.85,
        fontWeight: "bold"
    };

    var attributes =
    {
        name: groupName,
        number: groupNumber * 1000 + pointNumber + 1
    };

    var pnt= [];
    pnt.push(convPoint);

    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);

    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    raidLayer.addFeatures([feature]);
}


function CurrentRaidLocation(raid_mapLayer)
{
    var mro_Map = unsafeWindow.Waze.map;

    for(i=0;i<raid_mapLayer.features.length;i++)
    {
        var raidMapCenter = mro_Map.getCenter();
        var raidCenterPoint = new OpenLayers.Geometry.Point(raidMapCenter.lon,raidMapCenter.lat);
        var raidCenterCheck = raid_mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint);
        //console.log('MapRaid: ' + raid_mapLayer.features[i].attributes.number + ': ' + raidCenterCheck);
        if(raidCenterCheck === true)
        {
            var raidLocationLabel = 'Layer ' + raid_mapLayer.features[i].attributes.number + ' - ' + $('.WazeControlLocationInfo').text();
    		    setTimeout(function(){$('.WazeControlLocationInfo').text(raidLocationLabel)},200);
        }
    }
}


function InitMapRaidOverlay()
{
    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    //create overlay layer and add to WME map
    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__MapRaidGroups");
    var raid_mapLayer = new mro_OL.Layer.Vector("WME Iceland Overlay", {
        displayInLayerSwitcher: true,
        uniqueName: "__MapRaidGroups"
    });
    I18n.translations.en.layers.name["__MapRaidGroups"] = "WME Iceland Overlay";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
   IcelandDrawLayers(raid_mapLayer);
//--------------------------------------------------------------------------------------------------------------------------------------------------------------

    //obtains current map center location to determine which group label to apply
    setTimeout(function(){CurrentRaidLocation(raid_mapLayer)},3000);
    mro_Map.events.register("moveend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer)});
    mro_Map.events.register("zoomend", Waze.map, function(){CurrentRaidLocation(raid_mapLayer)});
}

bootstrap_IcelandOverlay();
