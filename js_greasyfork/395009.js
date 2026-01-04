// ==UserScript==
// @name            WME P2SMapsChine
// @name:fr         WME P2SMapsChine
// @icon		    data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADZ2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE5LTEyLTMwVDEyOjAzOjQyWjwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIFBybyAxLjUuNDwveG1wOkNyZWF0b3JUb29sPgogICAgICA8L3JkZjpEZXNjcmlw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
// @description     This script create buttons to permalink page on several Maps.
// @description:fr  Ce script crée des boutons pour vous permettre d'accéder à des cartes externes.
// @namespace       https://greasyfork.org/fr/scripts/395009-wme-p2smapschine
// @version         0.9
// @include 	    /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant           none
// @author          TXS
// @require         https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.6.0/proj4-src.js
// @downloadURL https://update.greasyfork.org/scripts/395009/WME%20P2SMapsChine.user.js
// @updateURL https://update.greasyfork.org/scripts/395009/WME%20P2SMapsChine.meta.js
// ==/UserScript==

/* global $ */

const Maps_version = GM_info.script.version;
let gps,mapsUrl,token,gz,coord,href,addon,userTabs,navTabs,tabContent,newtab;

function MapsCn_bootstrap() {
if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
    (function page_scope_runner() {
        const my_src = "(" + page_scope_runner.caller.toString() + ")();";
        const script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;
        document.body.appendChild(script);
        setTimeout(function() {
          add_buttons();

        }, 3000);
            return; })(); }
}

function getQueryString(link, name) {
    let pos = link.indexOf( name ) + name.length;
    let len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return parseFloat(link.substr(pos,len)); }
function getGps(z) {
    let href = document.getElementsByClassName('permalink')[0].href;
    let lon = getQueryString(href, 'lon=');
    let lat = getQueryString(href, 'lat=');
    let zoom = parseInt(getQueryString(href, 'zoomLevel=')) + z;
    return {lon, lat, zoom}; }


function MapqqZoom(gz) {
         if (gz >= 18) {gz = 18;}
         return gz;
}

function add_buttons()
{

let btn1 = $('<button style="background-color:#74D0F1; width:70px; height:24px; font-size:70%;">Google</button>');
    btn1.click(function(){
    let {lon, lat, zoom} = getGps(0);
    mapsUrl = `https://www.google.com/maps/@${lat},${lon},${zoom}z`;
    window.open(mapsUrl,'_blank');
});

// https://map.baidu.com/@12099745.515655888,4048961.128913972,13z
let btn2 = $('<button style="background-color:#EC684E; width:70px; height: 24px;font-size:70%;">Baidu</button>');
    btn2.click(function(){

proj4.defs("EPSG:3395","+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");

    let {lon, lat, zoom} = getGps(0);
    lon = lon + 0.01;
    lat = lat + 0.001;
    let chine = proj4.Proj('EPSG:3395');
    let latlon = (proj4(chine, proj4.WSG84).forward([lon,lat]));
    mapsUrl = `https://map.baidu.com/@${latlon},${zoom}z`;
    window.open(mapsUrl,'_blank');
});

//http://ditu.amap.com/regeo?lng=104.06074583530426&lat=30.5379691198173&src=uriapi
//https://uri.amap.com/marker?position=116.473195,39.993253
let btn3 = $('<button style="background-color:#F9E79F; width: 70px;height: 24px;font-size:70%;">Amap</button>');
    btn3.click(function(){
    let {lon, lat, zoom} = getGps(0);
    mapsUrl = `http://ditu.amap.com/regeo?lng=${lon}&lat=${lat}&src=uriapi`;
    window.open(mapsUrl,'_blank');
});


//https://coordinates-gps.gosur.com/en/?ll=49.394428713153104,30.00451739986329&z=4.220318335058216&t=streets
let btn4 = $('<button style="background-color:#D5F5E3; width: 70px;height: 24px;font-size:70%;">GoSur</button>');
    btn4.click(function(){
    let {lon, lat, zoom} = getGps(-1);
    mapsUrl = `https://coordinates-gps.gosur.com/en/?ll=${lat},${lon}&z=${zoom}&t=streets`;
    window.open(mapsUrl,'_blank');
});

// https://satellites.pro/France_map#48.85824,2.29451,17
let btn5 = $('<button style="width: 70px;height: 24px;font-size:70%;">SatellitesPro</button>');
    btn5.click(function(){
    let {lon, lat, zoom} = getGps(0);
    mapsUrl = `https://satellites.pro/France_map#${lat},${lon},${zoom}`;
    window.open(mapsUrl,'_blank');
});

// https://www.openstreetmap.org/#map=17/48.85824/2.29451
let btn6 = $('<button style="width: 70px;height: 24px;font-size:70%;">OpenStreetM</button>');
    btn6.click(function(){
    let {lon, lat, zoom} = getGps(0);
    mapsUrl = `http://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`;
    window.open(mapsUrl,'_blank');
});

// https://maps.here.com/?map=53.24623,7.77117,18,satellite
let btn7 = $('<button style="width: 70px;height: 24px;font-size:70%;">Here</button>');
    btn7.click(function(){
    let {lon, lat, zoom} = getGps(0);
    mapsUrl = `https://maps.here.com/?map=${lat},${lon},${zoom},satellite`;
    window.open(mapsUrl,'_blank');
});

// https://www.mapillary.com/app/?lat=47.92577487099999&lng=15.06136310300002&z=7.7016369
let btn8 = $('<button style="width: 70px;height: 24px;font-size:70%;">Mapillary</button>');
    btn8.click(function(){
    let {lon, lat, zoom} = getGps(-1);
    mapsUrl = `https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${zoom}`;
    window.open(mapsUrl,'_blank');
});

// https://www.bing.com/maps?v=2&cp=48.85824~2.29451&lvl=17&sty=h
let btn9 = $('<button style="width: 70px;height: 24px;font-size:70%;">Bing</button>');
    btn9.click(function(){
    let {lon, lat, zoom} = getGps(0);
    mapsUrl = `http://www.bing.com/maps/default.aspx?v=2&cp=${lat}~${lon}&lvl=${zoom}&sty=h`;
    window.open(mapsUrl,'_blank');
});

// https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#14.5/48.84891/2.35251
let btn10 = $('<button style="width: 70px;height: 24px;font-size:70%;">MapboxStr</button>');
    btn10.click(function(){
    let {lon, lat, zoom} = getGps(-1);
    token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'
    mapsUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?title=true&access_token=${token}#${zoom}/${lat}/${lon}`;
    window.open(mapsUrl,'_blank');
});

// https://api.mapbox.com/styles/v1/mapbox/satellite-v9.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#14.5/48.84891/2.35251
let btn11 = $('<button style="width: 70px;height: 24px;font-size:70%;">MapboxSat</button>');
    btn11.click(function(){
    let {lon, lat, zoom} = getGps(-1);
    token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'
    mapsUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9.html?title=true&access_token=${token}#${zoom}/${lat}/${lon}`;
    window.open(mapsUrl,'_blank');
});

//https://epsg.io/map#srs=4326&x=2.346547&y=48.859639&z=17&layer=satellite
let btn12 = $('<button style="width: 70px;height: 24px;font-size:70%;">EpsgSat</button>');
    btn12.click(function(){
    let {lon, lat, zoom} = getGps(-1);
    mapsUrl = `https://epsg.io/map#srs=4326&x=${lon}&y=${lat}&z=${zoom}&layer=streets`;
    window.open(mapsUrl,'_blank');
});

// https://map.qq.com/?center=116.181521,39.806898&l=10
let btn13 = $('<button style="width: 70px;height: 24px;font-size:70%;">Map.qq</button>');
    btn13.click(function(){
    let {lon, lat, zoom} = getGps(0);
    let gz = MapqqZoom(zoom);
    mapsUrl = `https://map.qq.com/?center=${lon},${lat}&l=${gz}`;
    window.open(mapsUrl,'_blank');
});

// https://ditu.so.com/?q=25.090062098499573,104.90819403918454
let btn14 = $('<button style="background-color:#00FFFF; width:70px; height:24px; font-size:70%;"">Q360</button>');
    btn14.click(function(){
    let {lon, lat, zoom} = getGps(0);
    mapsUrl = `https://ditu.so.com/?q=${lat},${lon}`;
    window.open(mapsUrl,'_blank');
});

   addon = document.createElement("section");
   addon.id = "Maps-addon";
   addon.innerHTML = `<b>Maps Cn V ${Maps_version}</b><br>`;
   userTabs = document.getElementById('user-info');
   navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
   tabContent = document.getElementsByClassName('tab-content', userTabs)[0];
   newtab = document.createElement('li');
   newtab.innerHTML = '<a title="Maps Chine" href="#sidepanel-Maps" data-toggle="tab">&#x1F1E8;&#x1F1F3;</a>';
   navTabs.appendChild(newtab);
   addon.id = "sidepanel-Maps";
   addon.className = "tab-pane";
   tabContent.appendChild(addon);

$("#sidepanel-Maps").append('<br>');
$("#sidepanel-Maps").append(btn1);
$("#sidepanel-Maps").append(btn2);
$("#sidepanel-Maps").append(btn3);
//$("#sidepanel-Maps").append('<br>');
$("#sidepanel-Maps").append(btn4);
$("#sidepanel-Maps").append(btn5);
$("#sidepanel-Maps").append(btn6);
$("#sidepanel-Maps").append(btn7);
$("#sidepanel-Maps").append(btn8);
$("#sidepanel-Maps").append(btn9);
$("#sidepanel-Maps").append(btn10);
$("#sidepanel-Maps").append(btn11);
$("#sidepanel-Maps").append(btn12);
$("#sidepanel-Maps").append(btn13);
$("#sidepanel-Maps").append(btn14);

$("#sidepanel-Maps").append('<br>');
$("#sidepanel-Maps").append('<br><center><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg" width=100></center>');


}

MapsCn_bootstrap();

