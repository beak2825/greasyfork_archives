// ==UserScript==
// @name                WME Калужская область 1.0
// @namespace           https://greasyfork.org/ru/users/26764-alexletov-Kal-HL
// @description         Creates polygons for Калужская область
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/editor/*
// @include             https://editor-beta.waze.com/*/editor/*
// @version             1.0
// @grant               none
// @license             http://creativecommons.org/licenses/by-nc-sa/3.0/
// @copyright           2014 davielde (https://greasyfork.org/ru/scripts/8565-wme-mapraid-overlay) 2015-2016 alexletov
// @require             https://greasyfork.org/scripts/18201-wme-%D0%9A%D0%B0%D0%BB%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C-1-0-%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-1/code/WME%20%D0%9A%D0%B0%D0%BB%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010:%20%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%201.js?version=114923
// @require             https://greasyfork.org/scripts/18202-wme-%D0%9A%D0%B0%D0%BB%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C-1-0-%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-2/code/WME%20%D0%9A%D0%B0%D0%BB%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010:%20%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%202.js?version=114924
// @downloadURL https://update.greasyfork.org/scripts/18203/WME%20%D0%9A%D0%B0%D0%BB%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/18203/WME%20%D0%9A%D0%B0%D0%BB%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010.meta.js
// ==/UserScript==

//---------------------------------------------------------------------------------------

// Using data from http://gis-lab.info/qa/osm-adm.html GisLab OSM

// The list of parameters
// SCRIPT_ID = a2016_236368992803_03331458692913970
// SMALL_NAME = Kal-HL
// UNIQUE_NAME = a2016_236368992803_03331458692913970Kaluzhskajaoblast
// MAIN_REGION_NAME = Калужская область
// VERSION = 1.0

var VERSION = 1.0;

function prepare_a2016_236368992803_03331458692913970()
{
    try {
        if (!((typeof window.Waze.map !== undefined) && (undefined !== typeof window.Waze.map.events.register) && (undefined !== typeof window.Waze.selectionManager.events.register ) && (undefined !== typeof window.Waze.loginManager.events.register) )) {
            setTimeout(levelUpdater_init, 1000);
            return;
        }
    } catch (err) {
        setTimeout(prepare_a2016_236368992803_03331458692913970, 1000);
        return;
    }

    console.log('WME GPS Tracer: init');

    var userInfo = getElId("user-info");
    if (userInfo === null) {
      window.setTimeout(prepare_a2016_236368992803_03331458692913970, 500);
      return;
    }

    var navTabs = userInfo.getElementsByTagName("ul");
    if (navTabs.length === 0) {
      window.setTimeout(prepare_a2016_236368992803_03331458692913970, 500);
      return;
    }

    if (typeof navTabs[0] === undefined) {
      window.setTimeout(prepare_a2016_236368992803_03331458692913970, 500);
      return;
    }
    var tabContents = userInfo.getElementsByTagName("div");
    if (tabContents.length === 0) {
      window.setTimeout(prepare_a2016_236368992803_03331458692913970, 500);
      return;
    }

    if (typeof tabContents[0] === undefined) {
      window.setTimeout(prepare_a2016_236368992803_03331458692913970, 500);
      return;
    }
    bootstrap_a2016_236368992803_03331458692913970();
}

function bootstrap_a2016_236368992803_03331458692913970()
{
    var bGreasemonkeyServiceDefined = false;

    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    } catch (err) { /* Ignore */ }

    if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
        unsafeWindow = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }

    var addon = document.createElement('section');
    addon.innerHTML = '<b>Калужская область</b> v' + VERSION + 'a2016_236368992803_03331458692913970';


    section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.style.textIndent = "16px";
    section.id = "a2016_236368992803_03331458692913970";
    section.innerHTML = '<table border=1><tr><td>Цвет</td><td>Регион</td></tr><tr><td bgcolor="2219B2"></td><td>Боровский район</td></tr><tr><td bgcolor="580EAD"></td><td>Мещовский район</td></tr><tr><td bgcolor="FFEC00"></td><td>Бабынинский район</td></tr><tr><td bgcolor="FFC300"></td><td>Жуковский район</td></tr><tr><td bgcolor="00AF64"></td><td>Малоярославецкий район</td></tr><tr><td bgcolor="FF9200"></td><td>Барятинский район</td></tr><tr><td bgcolor="FF4900"></td><td>Кировский район</td></tr><tr><td bgcolor="4DDE00"></td><td>Куйбышевский район</td></tr><tr><td bgcolor="00A876"></td><td>Людиновский район</td></tr><tr><td bgcolor="FF5900"></td><td>Ульяновский  район</td></tr><tr><td bgcolor="EC0033"></td><td>Сухиничский район</td></tr><tr><td bgcolor="CD0074"></td><td>Хвастовичский район</td></tr><tr><td bgcolor="A66000"></td><td>Думиничский район</td></tr><tr><td bgcolor="043C6B"></td><td>Жиздринский район</td></tr><tr><td bgcolor="7608AA"></td><td>Калуга</td></tr><tr><td bgcolor="028E9B"></td><td>Перемышльский район</td></tr><tr><td bgcolor="A1A500"></td><td>Дзержинский район</td></tr><tr><td bgcolor="2219B2"></td><td>Мосальский район</td></tr><tr><td bgcolor="580EAD"></td><td>Юхновский район</td></tr><tr><td bgcolor="FFEC00"></td><td>Износковский район</td></tr><tr><td bgcolor="FFC300"></td><td>Медынский район</td></tr><tr><td bgcolor="00AF64"></td><td>Козельский район</td></tr><tr><td bgcolor="FF9200"></td><td>Ферзиковский район</td></tr><tr><td bgcolor="FF4900"></td><td>Тарусский район</td></tr><tr><td bgcolor="4DDE00"></td><td>Спас-Деменский район</td></tr><tr><td bgcolor="00A876"></td><td>Обнинск</td></tr></table>';

    addon.appendChild(section);

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    var newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-a2016_236368992803_03331458692913970" data-toggle="tab">Kal-HL</a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-a2016_236368992803_03331458692913970";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    setTimeout(Inita2016_236368992803_03331458692913970, 1000);
}

function AddPolygona2016_236368992803_03331458692913970(raidLayer,groupPoints,groupColor,groupNumber){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;
    var raidGroupLabel = groupNumber;
    var groupName = groupNumber;

    var style = {
        strokeColor: groupColor,
        strokeOpacity: 0.8,
        strokeWidth: 3,
        fillColor: groupColor,
        fillOpacity: 0.15,
        label: raidGroupLabel,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: groupColor,
        fontOpacity: 0.85,
        fontWeight: "bold"
    };

    var attributes = {
        name: groupName,
        number: groupNumber
    };

    var pnt= [];
    for(i=0;i<groupPoints.length;i++){
        convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon, groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
        pnt.push(convPoint);
    }

    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);

    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    raidLayer.addFeatures([feature]);

}

function CurrentRaidLocationa2016_236368992803_03331458692913970(raid_mapLayer){
    var mro_Map = unsafeWindow.Waze.map;

    for(i=0;i<raid_mapLayer.features.length;i++){
        var raidMapCenter = mro_Map.getCenter();
        var raidCenterPoint = new OpenLayers.Geometry.Point(raidMapCenter.lon, raidMapCenter.lat);
        var raidCenterCheck = raid_mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint);

        if(raidCenterCheck === true){
            var raidLocationLabel = raid_mapLayer.features[i].attributes.number + ' - ' + $('.WazeControlLocationInfo').text();

            setTimeout(function(){$('.WazeControlLocationInfo').text(raidLocationLabel);}, 50);
            var str = $('.WazeControlLocationInfo').text();

            var n2 = str.indexOf(" - ");

            if(n2 > 0){
                var n = str.length;
                var res = str.substring(n2+2, n);
                var rescount = res.indexOf(" - ");
                var res2 = '';
                if(rescount>0){
                    var n3 = res.length;
                    res2 = res.substring(rescount+2, n3);

                }
                raidLocationLabel = raid_mapLayer.features[i].attributes.number + ' - ' + res2;
            } else {
                raidLocationLabel = raid_mapLayer.features[i].attributes.number + ' - ' + $('.WazeControlLocationInfo').text();
            }
            setTimeout(function(){$('.WazeControlLocationInfo').text(raidLocationLabel);}, 200);
        }
    }
}

function Inita2016_236368992803_03331458692913970(){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__a2016_236368992803_03331458692913970Kaluzhskajaoblast");

    var raid_mapLayer = new mro_OL.Layer.Vector("Районы: Калужская область", {
        displayInLayerSwitcher: true,
        uniqueName: "__a2016_236368992803_03331458692913970Kaluzhskajaoblast"
    });

    I18n.translations.en.layers.name["__a2016_236368992803_03331458692913970Kaluzhskajaoblast"] = "Районы: Калужская область";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397000 , "#2219B2","Боровский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397010 , "#580EAD","Мещовский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397020 , "#FFEC00","Бабынинский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397030 , "#FFC300","Жуковский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397040 , "#00AF64","Малоярославецкий район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397050 , "#FF9200","Барятинский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397060 , "#FF4900","Кировский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397070 , "#4DDE00","Куйбышевский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397080 , "#00A876","Людиновский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_0333145869291397090 , "#FF5900","Ульяновский  район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970100 , "#EC0033","Сухиничский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970110 , "#CD0074","Хвастовичский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970120 , "#A66000","Думиничский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970130 , "#043C6B","Жиздринский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970140 , "#7608AA","Калуга");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970150 , "#028E9B","Перемышльский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970160 , "#A1A500","Дзержинский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970170 , "#2219B2","Мосальский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970180 , "#580EAD","Юхновский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970190 , "#FFEC00","Износковский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970200 , "#FFC300","Медынский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970210 , "#00AF64","Козельский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970220 , "#FF9200","Ферзиковский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970230 , "#FF4900","Тарусский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970240 , "#4DDE00","Спас-Деменский район");

AddPolygona2016_236368992803_03331458692913970(raid_mapLayer, a2016_236368992803_03331458692913970250 , "#00A876","Обнинск");


    setTimeout(function(){CurrentRaidLocationa2016_236368992803_03331458692913970(raid_mapLayer);}, 3000);
    mro_Map.events.register("moveend", Waze.map, function(){CurrentRaidLocationa2016_236368992803_03331458692913970(raid_mapLayer);});
    mro_Map.events.register("zoomend", Waze.map, function(){CurrentRaidLocationa2016_236368992803_03331458692913970(raid_mapLayer);});

}

                      function getElClass(classname, node) {
    if (!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}

function getElementsByClassName(classname, node) {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i=0,j=els.length; i<j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
        return a;
}

function getId(node) {
    return document.getElementById(node);
}

function getElId(node) {
    return document.getElementById(node);
}

prepare_a2016_236368992803_03331458692913970();
