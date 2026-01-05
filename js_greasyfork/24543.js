// ==UserScript==
// @name                WME Ростовская область 1.0
// @description         Creates polygons for Ростовская область
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/editor/*
// @include             https://editor-beta.waze.com/*/editor/*
// @version             1.0
// @grant               none
// @license             http://creativecommons.org/licenses/by-nc-sa/3.0/
// @copyright           2014 davielde (https://greasyfork.org/ru/scripts/8565-wme-mapraid-overlay) 2015-2016 alexletov
// @namespace           https://greasyfork.org/ru/scripts/16104-wme-Ростовская-область-1-0
// @require https://greasyfork.org/scripts/24541-wme-%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C-1-0-%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-1/code/WME%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010:%20%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%201.js?version=155985
// @require https://greasyfork.org/scripts/24542-wme-%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C-1-0-%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-2/code/WME%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010:%20%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%202.js?version=155987
// @downloadURL https://update.greasyfork.org/scripts/24543/WME%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/24543/WME%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2010.meta.js
// ==/UserScript==

//---------------------------------------------------------------------------------------

// Using data from http://gis-lab.info/qa/osm-adm.html GisLab OSM

// The list of parameters
// SCRIPT_ID = a2016_041691670311_01421478210622069
// SMALL_NAME = Ros-HL
// UNIQUE_NAME = a2016_041691670311_01421478210622069Rostovskajaoblast
// MAIN_REGION_NAME = Ростовская область
// VERSION = 1.0

var VERSION = 1.0;

function prepare_a2016_041691670311_01421478210622069()
{
    try {
        if (!((typeof window.Waze.map !== undefined) && (undefined !== typeof window.Waze.map.events.register) && (undefined !== typeof window.Waze.selectionManager.events.register ) && (undefined !== typeof window.Waze.loginManager.events.register) )) {
            setTimeout(levelUpdater_init, 1000);
            return;
        }
    } catch (err) {
        setTimeout(prepare_a2016_041691670311_01421478210622069, 1000);
        return;
    }

    console.log('WME GPS Tracer: init');

    var userInfo = getElId("user-info");
    if (userInfo === null) {
      window.setTimeout(prepare_a2016_041691670311_01421478210622069, 500);
      return;
    }

    var navTabs = userInfo.getElementsByTagName("ul");
    if (navTabs.length === 0) {
      window.setTimeout(prepare_a2016_041691670311_01421478210622069, 500);
      return;
    }

    if (typeof navTabs[0] === undefined) {
      window.setTimeout(prepare_a2016_041691670311_01421478210622069, 500);
      return;
    }
    var tabContents = userInfo.getElementsByTagName("div");
    if (tabContents.length === 0) {
      window.setTimeout(prepare_a2016_041691670311_01421478210622069, 500);
      return;
    }

    if (typeof tabContents[0] === undefined) {
      window.setTimeout(prepare_a2016_041691670311_01421478210622069, 500);
      return;
    }
    bootstrap_a2016_041691670311_01421478210622069();
}

function bootstrap_a2016_041691670311_01421478210622069()
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
    addon.innerHTML = '<b>Ростовская область</b> v' + VERSION + 'a2016_041691670311_01421478210622069';


    section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.style.textIndent = "16px";
    section.id = "a2016_041691670311_01421478210622069";
    section.innerHTML = '<table border=1><tr><td>Цвет</td><td>Регион</td></tr><tr><td bgcolor="2219B2"></td><td>Ростов-на-Дону</td></tr><tr><td bgcolor="580EAD"></td><td>Мясниковский район</td></tr><tr><td bgcolor="FFEC00"></td><td>Неклиновский район</td></tr><tr><td bgcolor="FFC300"></td><td>Таганрог</td></tr><tr><td bgcolor="00AF64"></td><td>Целинский район</td></tr><tr><td bgcolor="FF9200"></td><td>Волгодонской район</td></tr><tr><td bgcolor="FF4900"></td><td>Сальский район</td></tr><tr><td bgcolor="4DDE00"></td><td>Егорлыкский район</td></tr><tr><td bgcolor="00A876"></td><td>Кашарский район</td></tr><tr><td bgcolor="FF5900"></td><td>Зерноградский район</td></tr><tr><td bgcolor="EC0033"></td><td>Усть-Донецкий район</td></tr><tr><td bgcolor="CD0074"></td><td>Чертковский район</td></tr><tr><td bgcolor="A66000"></td><td>Миллеровский район</td></tr><tr><td bgcolor="043C6B"></td><td>Тарасовский район</td></tr><tr><td bgcolor="7608AA"></td><td>Каменский район</td></tr><tr><td bgcolor="028E9B"></td><td>Красносулинский район</td></tr><tr><td bgcolor="A1A500"></td><td>Гуково</td></tr><tr><td bgcolor="2219B2"></td><td>Октябрьский район</td></tr><tr><td bgcolor="580EAD"></td><td>Новошахтинск</td></tr><tr><td bgcolor="FFEC00"></td><td>Шахты</td></tr><tr><td bgcolor="FFC300"></td><td>Новочеркасск</td></tr><tr><td bgcolor="00AF64"></td><td>Веселовский район</td></tr><tr><td bgcolor="FF9200"></td><td>Боковский район</td></tr><tr><td bgcolor="FF4900"></td><td>Белокалитвинский район</td></tr><tr><td bgcolor="4DDE00"></td><td>Багаевский район</td></tr><tr><td bgcolor="00A876"></td><td>Заветинский район</td></tr><tr><td bgcolor="FF5900"></td><td>Кагальницкий район</td></tr><tr><td bgcolor="EC0033"></td><td>Родионово-Несветайский район</td></tr><tr><td bgcolor="CD0074"></td><td>Аксайский район</td></tr><tr><td bgcolor="A66000"></td><td>Азовский район</td></tr><tr><td bgcolor="043C6B"></td><td>Куйбышевский район</td></tr><tr><td bgcolor="7608AA"></td><td>Советский район</td></tr><tr><td bgcolor="028E9B"></td><td>Милютинский район</td></tr><tr><td bgcolor="A1A500"></td><td>Обливский район</td></tr><tr><td bgcolor="2219B2"></td><td>Орловский район</td></tr><tr><td bgcolor="580EAD"></td><td>Морозовский район</td></tr><tr><td bgcolor="FFEC00"></td><td>Тацинский район</td></tr><tr><td bgcolor="FFC300"></td><td>Цимлянский район</td></tr><tr><td bgcolor="00AF64"></td><td>Константиновский район</td></tr><tr><td bgcolor="FF9200"></td><td>Семикаракорский район</td></tr><tr><td bgcolor="FF4900"></td><td>Мартыновский район</td></tr><tr><td bgcolor="4DDE00"></td><td>Пролетарский район</td></tr><tr><td bgcolor="00A876"></td><td>Зимовниковский район</td></tr><tr><td bgcolor="FF5900"></td><td>Шолоховский район</td></tr><tr><td bgcolor="EC0033"></td><td>Дубовский район</td></tr><tr><td bgcolor="CD0074"></td><td>Песчанокопский район</td></tr><tr><td bgcolor="A66000"></td><td>Ремонтненский район</td></tr><tr><td bgcolor="043C6B"></td><td>Каменск-Шахтинский</td></tr><tr><td bgcolor="7608AA"></td><td>Донецк</td></tr><tr><td bgcolor="028E9B"></td><td>Зверево</td></tr><tr><td bgcolor="A1A500"></td><td>Верхнедонской район</td></tr><tr><td bgcolor="2219B2"></td><td>Матвеево-Курганский район</td></tr><tr><td bgcolor="580EAD"></td><td>Волгодонск</td></tr><tr><td bgcolor="FFEC00"></td><td>Азов</td></tr><tr><td bgcolor="FFC300"></td><td>Батайск</td></tr></table>';

    addon.appendChild(section);

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    var newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-a2016_041691670311_01421478210622069" data-toggle="tab">Ros-HL</a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-a2016_041691670311_01421478210622069";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    setTimeout(Inita2016_041691670311_01421478210622069, 1000);
}

function AddPolygona2016_041691670311_01421478210622069(raidLayer,groupPoints,groupColor,groupNumber){

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

function CurrentRaidLocationa2016_041691670311_01421478210622069(raid_mapLayer){
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

function Inita2016_041691670311_01421478210622069(){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__a2016_041691670311_01421478210622069Rostovskajaoblast");

    var raid_mapLayer = new mro_OL.Layer.Vector("Районы: Ростовская область", {
        displayInLayerSwitcher: true,
        uniqueName: "__a2016_041691670311_01421478210622069Rostovskajaoblast"
    });

    I18n.translations.en.layers.name["__a2016_041691670311_01421478210622069Rostovskajaoblast"] = "Районы: Ростовская область";
    mro_Map.addLayer(raid_mapLayer);
    raid_mapLayer.setVisibility(true);
    
AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206900 , "#2219B2","Ростов-на-Дону");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206910 , "#580EAD","Мясниковский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206920 , "#FFEC00","Неклиновский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206930 , "#FFC300","Таганрог");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206940 , "#00AF64","Целинский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206950 , "#FF9200","Волгодонской район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206960 , "#FF4900","Сальский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206970 , "#4DDE00","Егорлыкский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206980 , "#00A876","Кашарский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_0142147821062206990 , "#FF5900","Зерноградский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069100 , "#EC0033","Усть-Донецкий район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069110 , "#CD0074","Чертковский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069120 , "#A66000","Миллеровский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069130 , "#043C6B","Тарасовский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069140 , "#7608AA","Каменский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069150 , "#028E9B","Красносулинский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069160 , "#A1A500","Гуково");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069170 , "#2219B2","Октябрьский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069180 , "#580EAD","Новошахтинск");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069190 , "#FFEC00","Шахты");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069200 , "#FFC300","Новочеркасск");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069210 , "#00AF64","Веселовский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069220 , "#FF9200","Боковский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069230 , "#FF4900","Белокалитвинский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069240 , "#4DDE00","Багаевский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069250 , "#00A876","Заветинский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069260 , "#FF5900","Кагальницкий район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069270 , "#EC0033","Родионово-Несветайский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069280 , "#CD0074","Аксайский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069290 , "#A66000","Азовский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069300 , "#043C6B","Куйбышевский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069310 , "#7608AA","Советский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069320 , "#028E9B","Милютинский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069330 , "#A1A500","Обливский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069340 , "#2219B2","Орловский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069350 , "#580EAD","Морозовский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069360 , "#FFEC00","Тацинский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069370 , "#FFC300","Цимлянский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069380 , "#00AF64","Константиновский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069390 , "#FF9200","Семикаракорский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069400 , "#FF4900","Мартыновский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069410 , "#4DDE00","Пролетарский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069420 , "#00A876","Зимовниковский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069430 , "#FF5900","Шолоховский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069440 , "#EC0033","Дубовский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069450 , "#CD0074","Песчанокопский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069460 , "#A66000","Ремонтненский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069470 , "#043C6B","Каменск-Шахтинский");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069480 , "#7608AA","Донецк");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069490 , "#028E9B","Зверево");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069500 , "#A1A500","Верхнедонской район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069510 , "#2219B2","Матвеево-Курганский район");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069520 , "#580EAD","Волгодонск");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069530 , "#FFEC00","Азов");

AddPolygona2016_041691670311_01421478210622069(raid_mapLayer, a2016_041691670311_01421478210622069540 , "#FFC300","Батайск");


    setTimeout(function(){CurrentRaidLocationa2016_041691670311_01421478210622069(raid_mapLayer);}, 3000);
    mro_Map.events.register("moveend", Waze.map, function(){CurrentRaidLocationa2016_041691670311_01421478210622069(raid_mapLayer);});
    mro_Map.events.register("zoomend", Waze.map, function(){CurrentRaidLocationa2016_041691670311_01421478210622069(raid_mapLayer);});

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

prepare_a2016_041691670311_01421478210622069();
