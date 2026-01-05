// ==UserScript==
// @name         WME GPS Tracer
// @namespace    https://greasyfork.org/ru/users/26764-alexletov-wme-gps-tracer
// @version      0.1
// @description  Load and show tracks in WME
// @author       alexletov
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/*
// @license      https://opensource.org/licenses/BSD-3-Clause
// @copyright    2016 alexletov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17486/WME%20GPS%20Tracer.user.js
// @updateURL https://update.greasyfork.org/scripts/17486/WME%20GPS%20Tracer.meta.js
// ==/UserScript==

var VERSION = '0.1 beta';

var server_url;

var start, end;

function gpsTracer_init() {
    try {
        if (!((typeof window.Waze.map !== undefined) && (undefined !== typeof window.Waze.map.events.register) && (undefined !== typeof window.Waze.selectionManager.events.register ) && (undefined !== typeof window.Waze.loginManager.events.register) )) {
            setTimeout(gpsTracer_init, 1000);
            return;
        }
    } catch (err) {
        setTimeout(gpsTracer_init, 1000);
        return;
    }

    console.log('WME GPS Tracer: init');
    
    var userInfo = getElId("user-info");
    if (userInfo === null) {
      window.setTimeout(gpsTracer_init, 500);
      return;
    }
    
    var navTabs = userInfo.getElementsByTagName("ul");
    if (navTabs.length === 0) {
      window.setTimeout(gpsTracer_init, 500);
      return;
    }
    
    if (typeof navTabs[0] === undefined) {
      window.setTimeout(gpsTracer_init, 500);
      return;
    }
    var tabContents = userInfo.getElementsByTagName("div");
    if (tabContents.length === 0) {
      window.setTimeout(gpsTracer_init, 500);
      return;
    }

    if (typeof tabContents[0] === undefined) {
      window.setTimeout(gpsTracer_init, 500);
      return;
    }
    gpsTracer_loadSettings();
    gpsTracer_init_showUI();
    $('#_bGPSTProcessSave').click(gpsTracer_saveSettings);
}

function gpsTracer_init_showUI() {
    addon = document.createElement('section');
    addon.innerHTML = '<b>WME GPS Tracer</b> v' + VERSION;

    section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.style.textIndent = "16px";
    section.id = "gpstracer_settings";
    section.innerHTML += 'Select track to show: <select id="_iGPST_track_list" name="_iGPST_track_list" disabled></select><br />';
    section.innerHTML += '<button id="_bGPSTProcessLoadTrack" name="_bGPSTProcessLoadTrack" width="100%" disabled>Load track</button><br/>';
    section.innerHTML += '<button id="_bGPSTGoToStartOfTrack" name="_bGPSTGoToStartOfTrack" width="100%" disabled>Go to start</button><br/>';
    section.innerHTML += '<button id="_bGPSTGoToEndOfTrack" name="_bGPSTGoToEndOfTrack" width="100%" disabled>Go to end</button><br/>';
    section.innerHTML += '<br/><br/><hr /><br/><br/>';
    section.innerHTML += 'Server url: <input id="_iGPSTServerUrl" name="_iGPSTServerUrl" type="text" value="' + ((server_url === undefined || server_url === null) ? '' : server_url ) + '" /><br />';
    section.innerHTML += '<button id="_bGPSTProcessSave" name="_bGPSTProcessSave" width="100%">Save</button><br/>';

    addon.appendChild(section);
    
    userTabs = getElId("user-tabs");
    userInfo = getElId("user-info");
    sidePanelPrefs = getElId("sidepanel-prefs");
    navTabs = getElClass("nav-tabs", userTabs)[0];
    tabContent = sidePanelPrefs.parentNode;    

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-gpstracer" data-toggle="tab">GPS-T</a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-gpstracer";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);
}

function gpsTracer_request_track_list() {
    if (server_url !== null) {
        $.ajax({
            url: server_url + '/track_list.php',
            type: "POST",
            dataType: "jsonp",
            data: null,
            success: function (resp) {
                gpsTracer_update_track_list(resp.tracks);
                console.log(resp);
            },
            error: function (xhr, status) {
                alert("Error: " + status);
            }
        });
    } else {
        console.log("server url is null");
    }
}

function gpsTracer_update_track_list(list) {
    $('#_iGPST_track_list').empty();
    for (var i = 0; i < list.length; i++) {
        $('#_iGPST_track_list').append( new Option(list[i].name, list[i].id) );
    };
    $("#_iGPST_track_list").removeAttr("disabled");
    $("#_bGPSTProcessLoadTrack").removeAttr("disabled");
    $('#_bGPSTProcessLoadTrack').click(gpsTracer_load_track);
}

function isValidURL(s) {    
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);    
}

function gpsTracer_loadSettings() {
    server_url = localStorage.getItem("GPST_Server_Url");
    gpsTracer_request_track_list();
}

function gpsTracer_load_track() {
    if (server_url !== null) {
        $.ajax({
            url: server_url + '/' + $('#_iGPST_track_list').val() + '.php',
            type: "POST",
            dataType: "jsonp",
            data: null,
            success: function (resp) {
                gpsTracer_show_track(resp);
    
                $('#_bGPSTGoToStartOfTrack').click(gpsTracer_goto_start);
                $("#_bGPSTGoToStartOfTrack").removeAttr("disabled");
                $('#_bGPSTGoToEndOfTrack').click(gpsTracer_goto_end);
                $("#_bGPSTGoToEndOfTrack").removeAttr("disabled");
            },
            error: function (xhr, status) {
                alert("Error: " + status);
            }
        });
    } else {
        console.log("server url is null");
    }
}

function gpsTracer_saveSettings() {
    url = $('#_iGPSTServerUrl').val();
    if (!isValidURL(url)) {
        $('#_iGPSTServerUrl').val(server_url === null ? '' : server_url);
        alert(url + ' is not valid URL!');
        return;
    }
    
    server_url = url;

    localStorage.setItem("GPST_Server_Url", url);
    gpsTracer_request_track_list();
}

function gpsTracer_goto_start() {
    Waze.map.setCenter([start.x, start.y], 4);
}

function gpsTracer_goto_end() {
    Waze.map.setCenter([end.x, end.y], 4);
}

function gpsTracer_show_track(coordinates) {
    var points = [];
    var lineFeatures = [];
    var proj1 = new OpenLayers.Projection('EPSG:4326');
    var proj2 = Waze.map.getProjectionObject();
    var numPoints = 0;
    
    gpsTracer_clear_track();

    for (var i = 0; i < coordinates.length; i++) {
        var point = new OpenLayers.Geometry.Point(coordinates[i].lat, coordinates[i].lon).transform(proj1, proj2);
        points.push(point);
        if (i == 0) {
            start = point;
        }
        end = point;
        numPoints++;
    }

    var line = new OpenLayers.Geometry.LineString(points);
    var size = 6;
    var lineFeature = new OpenLayers.Feature.Vector(line, {strokeColor: '#ff0000'} );
    lineFeatures.push(lineFeature);

    var layers = Waze.map.getLayersBy("uniqueName","__WME_GPS_Tracer");
    var gps_mapLayer;
    if(layers.length == 0) {
        var new_layer_style = new OpenLayers.Style({
                strokeDashstyle: 'solid',
                strokeColor : "${strokeColor}",
                strokeOpacity: 1.0,
                strokeWidth: "${lineWidth}",
                //strokeLinecap: 'square',
                fillColor: '#000000',
                fillOpacity: 1.0,
                pointRadius: 2,
                fontWeight: "normal",
                label : "${labelText}",
                fontFamily: "Tahoma, Courier New",
                labelOutlineColor: "#FFFFFF",
                labelOutlineWidth: 2,
                fontColor: '#000000',
                fontSize: "10px"
        });

        gps_mapLayer = new OpenLayers.Layer.Vector("GPS Tracer", {
            displayInLayerSwitcher: true,
            uniqueName: "__WME_GPS_Tracer",
            styleMap: new OpenLayers.StyleMap(new_layer_style)
        });

        I18n.translations.en.layers.name["__WME_GPS_Tracer"] = "GPS Tracer";
        Waze.map.addLayer(gps_mapLayer);
    } else {
        gps_mapLayer = layers[0];
    }
    
    gps_mapLayer.setVisibility(true);
    
    if (lineFeatures.length > 0)  gps_mapLayer.addFeatures(lineFeatures);

    // go to the center of added features
    if (lineFeatures.length > 0 || pointFeatures.length > 0) {
        var bounds = new OpenLayers.Bounds();

        for (var i = 0; i < lineFeatures.length; ++i) {
            var line = lineFeatures[i];
            bounds.extend(line.geometry.bounds);
        }

        var center = bounds.getCenterPixel();
        var zoom = Waze.map.getZoom();
        Waze.map.setCenter([center.x, center.y], zoom);
    }
}

function gpsTracer_clear_track()
{
    var layers = Waze.map.getLayersBy("uniqueName","__WME_GPS_Tracer");
    if(layers.length != 0) {        
        var gps_layer = layers[0];        
        gps_layer.removeAllFeatures();
    }
}

/* helper function */
function getElClass(classname, node) {
    if (!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}

function getElId(node) {
    return document.getElementById(node);
}

gpsTracer_init();
