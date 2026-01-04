// ==UserScript==
// @name    WME Link to German States Geo Portals
// @description This script create buttons to open Geo portals of German states, using the WME paramenters where supported.
// @namespace  https://github.com/iridium1-waze/WME-L2DEGEO/blob/main/WME%20L2DEGEO.user.js
// @version   2025.08.02.01
// @include   https://*.waze.com/editor*
// @include   https://*.waze.com/*/editor*
// @license   MIT
// @syncURL   https://github.com/iridium1-waze/WME-L2DEGEO/raw/main/WME%20L2DEGEO.user.js
// @author	Iridium1
// @icon    https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/de-map.png
// @downloadURL https://update.greasyfork.org/scripts/511908/WME%20Link%20to%20German%20States%20Geo%20Portals.user.js
// @updateURL https://update.greasyfork.org/scripts/511908/WME%20Link%20to%20German%20States%20Geo%20Portals.meta.js
// ==/UserScript==
// Mini howto:
// 1) install this script as GitHub script
// 2) Click on any of the links includes to open the state GEO portal, PL Data will be handed over where supported.
var l2degeo_version = "2025.08.02.01";
// by Iridium1 (contact either PM or iridium1.waze@gmail.com)
// 2021.01.17.01: Initial release
// 2021.04.12.01: Changed URL for Brandenburg Viewer
// 2021.04.14.01: Added Support for Tim-Online opening at current WME Postion (with default zoom of tim-online) Thanks to abusimber! (Peter)
// 2021.04.20.01: Fixed issues with script loading in Firefox
// 2021.11.20.01: Added Geoportal Schleswig Holstein (Thanks to DieCookieEnte - Jan!)
// 2021.12.29.01: Changed Link for Bremen (Thanks to hiwi234!)
// 2022.04.22.01: Added Katasterkarte Niedersachsen (Thanks to Benjamin Bruns!)
// 2022.10.02.01: Fixed Link for GeoPortal Hamburg (Thanks to s.jay.m!)
// 2022.10.02.02: Changed Zoomlevel for GeoPortal Hamburg
// 2022.11.20.01: Removed handing over of coordinates to Portal Thüringen as no longer supported (Thanks for the hint FasterinoSpeederino!)
// 2022.11.20.01: Re-Added Thüringen Portal - Hint from LostEmber (Thanks for your contribution!) of how to (still) hand over coordinates.
// 2023.01.15.01: Replaced Webatlas (depreciated) with basemap.de
// 2023.10.04.01: Fixed typo in state Baden-Württemberg
// 2023.10.05.01: Fixed broken link to Geportal Sachsen-Anhalt after they changed to basemap - Thanks to pox_online!
// 2024.02.27.01: Fixed broken link to Geobasis Bremen
// 2024.10.08.01: Added webhook for Greasy Fork - thanks to Dancingman81!
// 2024.12.15.01: Updated link Geoportal Bayern
// 2025.08.02.01: Updated link to Geoportal Sachsen to the new one - thanks to PoxOnline!

/* eslint-env jquery */ //we are working with jQuery
//indicate used variables to be assigned
/*global W*/
/*global proj4*/
/*global firstProj*/
/*global newtab*/

//currently not in use, but leaving code as a claculation reference
/*
double[] WGS84toGoogleBing(double lon, double lat) {
  double x = lon * 20037508.34 / 180;
  double y = Math.Log(Math.Tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  return new double[] {x, y};
}

double[] GoogleBingtoWGS84Mercator (double x, double y) {
  double lon = (x / 20037508.34) * 180;
  double lat = (y / 20037508.34) * 180;

  lat = 180/Math.PI * (2 * Math.Atan(Math.Exp(lat * Math.PI / 180)) - Math.PI / 2);
  return new double[] {lon, lat};
}
*/

function getQueryString (link, name)
{
  var pos = link.indexOf(name + '=' ) + name.length + 1;
  var len = link.substr(pos).indexOf('&');
  if (-1 == len) len = link.substr(pos).length;
  return link.substr(pos,len);
}
function BasemapZoom(met, lat) {
    // https://docs.mapbox.com/help/glossary/zoom-level/#zoom-levels-and-geographical-distance
    // 78271.484 meters/pixel basis
    // met = meter per pixel in destination
    // lat = latitude of destination
    // returns Basemap zoom factor
    return Math.log2( 78271.484 / met * Math.cos( lat / 180 * Math.PI ) )
}

function CorrectZoom (link)
{
  var found = link.indexOf('livemap');
  return (-1 == found)?13:2;
}

function add_buttons()
{
  if (document.getElementById('user-info') == null) {
    setTimeout(add_buttons, 500);
    console.log('user-info element not yet available, page still loading');
    return;
  }
  if (!W.loginManager.user) {
    W.loginManager.events.register('login', null, add_buttons);
    W.loginManager.events.register('loginStatus', null, add_buttons);
    // Double check as event might have triggered already
    if (!W.loginManager.user) {
      return;
    }
  }

var baw_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Baden-Württemberg</button>');
baw_btn.click(function(){

  var mapsUrl = 'https://www.geoportal-bw.de' ;
  window.open(mapsUrl,'_blank');
});

var bay_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">BayernAtlas</button>');
bay_btn.click(function(){
  var href = $('.WazeControlPermalink a').attr('href');

  var lon = parseFloat(getQueryString(href, 'lon'));
  var lat = parseFloat(getQueryString(href, 'lat'));
  var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

  zoom = zoom-1.5;

  // Using Proj4js to transform coordinates. See http://proj4js.org/
  var script = document.createElement("script"); // dynamic load the library from https://cdnjs.com/libraries/proj4js
  script.type = 'text/javascript';
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js';
  document.getElementsByTagName('head')[0].appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
  script.onload = popAtlas; //wait till the script is downloaded & executed
  function popAtlas() {
  //just a wrapper for onload
     if (proj4) {
       var firstProj ='';
         firstProj = "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
       var utm = proj4(firstProj,[lon,lat]);
  var mapsUrl = 'https://atlas.bayern.de/?c=' + utm[0] + ',' + utm[1] + '&z=' + zoom + '&r=0&l=atkis&t=ba';
  window.open(mapsUrl,'_blank');
   }
  }
});

var ber_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Karten für Berlin</button>');
ber_btn.click(function(){

  var mapsUrl = 'https://fbinter.stadt-berlin.de/fb/index.jsp' ;
  window.open(mapsUrl,'_blank');
});

var bra_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Brandenburg</button>');
bra_btn.click(function(){

  var mapsUrl = 'https://geoportal.brandenburg.de/de/cms/portal/start' ;
  window.open(mapsUrl,'_blank');
});

var bre_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Bremen</button>');
bre_btn.click(function(){

  var mapsUrl = 'https://geoportal.bremen.de/geoportal' ;
  window.open(mapsUrl,'_blank');
});

var ham_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Hamburg</button>');
ham_btn.click(function(){
var href = $('.WazeControlPermalink a').attr('href');

  var lon = parseFloat(getQueryString(href, 'lon'));
  var lat = parseFloat(getQueryString(href, 'lat'));
  var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

  zoom = zoom-12;

  // Using Proj4js to transform coordinates. See http://proj4js.org/
  var script = document.createElement("script"); // dynamic load the library from https://cdnjs.com/libraries/proj4js
  script.type = 'text/javascript';
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js';
  document.getElementsByTagName('head')[0].appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
  script.onload = popAtlas; //wait till the script is downloaded & executed
  function popAtlas() {
     //just a wrapper for onload
     if (proj4) {
       var firstProj ='';
         firstProj = "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
       var utm = proj4(firstProj,[lon,lat]);
  var mapsUrl = 'https://geoportal-hamburg.de/geo-online/?Map/layerIds=12883,12884,16101,19969&visibility=true,true,true,true&transparency=0,0,0,0&Map/center=[' + utm[0] +',' + utm [1] + ']&Map/zoomLevel=' +zoom+2 ;
  window.open(mapsUrl,'_blank');
   }
  }
});

var hes_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Hessen</button>');
hes_btn.click(function(){

  var mapsUrl = 'http://www.geoportal.hessen.de/portal/karten.html' ;
  window.open(mapsUrl,'_blank');
});

var mev_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Mecklenburg-Vorpommern</button>');
mev_btn.click(function(){

  var mapsUrl = 'https://www.geoportal-mv.de/portal/Geodatenviewer/GAIA-MVlight' ;
  window.open(mapsUrl,'_blank');
});

var nie_btn1 = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geobasis Niedersachsen</button>');
nie_btn1.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = 'https://www.geobasis.niedersachsen.de/?x=' + lon + '&y=' + lat + '&z=' + (zoom-1);
    window.open(mapsUrl,'_blank');

});

var nie_btn2 = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Katasterkarte Niedersachsen</button>');
nie_btn2.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoomNie2 = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    var hrefMap = {
        19: 2000,
        18: 5000,
        17: 7500,
        16: 15000,
        15: 50000,
        14: 75000,
        13: 100000,
        12: 250000,
        11: 500000,
        10: 1250000,
        9: 3000000
    };
zoomNie2 = hrefMap[zoomNie2];

    var mapsUrl = 'https://maps.lgln.niedersachsen.de/katasterkarten-online/mapbender/application/katasterkarten-online?#'+zoomNie2+'@'+lon+'/'+lat+'r0@EPSG:25832';
    window.open(mapsUrl,'_blank');

});

var nrw_btn1 = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Nordrhein-Westfalen</button>');
nrw_btn1.click(function(){

  var mapsUrl = 'https://www.geoportal.nrw' ;
  window.open(mapsUrl,'_blank');
});

var nrw_btn2 = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">TIM Online</button>');
nrw_btn2.click(function(){
  var href = $('.WazeControlPermalink a').attr('href');

  var lon = parseFloat(getQueryString(href, 'lon'));
  var lat = parseFloat(getQueryString(href, 'lat'));

  // Using Proj4js to transform coordinates. See http://proj4js.org/
  var script = document.createElement("script"); // dynamic load the library from https://cdnjs.com/libraries/proj4js
  script.type = 'text/javascript';
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js';
  document.getElementsByTagName('head')[0].appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
  script.onload = popAtlas; //wait till the script is downloaded & executed
  function popAtlas() {
  //just a wrapper for onload
   if (proj4) {
    firstProj= "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    var utm = proj4(firstProj,[lon,lat]);
  var mapsUrl = 'https://www.tim-online.nrw.de/tim-online2/?bg=webatlas&center='+utm[0]+','+utm[1] ;
  window.open(mapsUrl,'_blank');
   }
  }
});

var nrw_btn3 = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Rhein-Kreis-Neuss Geoportal</button>');
nrw_btn3.click(function(){

  var mapsUrl = 'https://maps.rhein-kreis-neuss.de/rknportale/geoportal' ;
  window.open(mapsUrl,'_blank');
});

var rhe_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Rheinland-Pfalz</button>');
rhe_btn.click(function(){

  var mapsUrl = 'https://www.geoportal.rlp.de' ;
  window.open(mapsUrl,'_blank');
});

var saa_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Saarland</button>');
saa_btn.click(function(){

  var mapsUrl = 'https://geoportal.saarland.de/map?WMC=4331' ;
  window.open(mapsUrl,'_blank');
});

var sac_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Sachsen</button>');
sac_btn.click(function(){

  var mapsUrl = 'https://geoportal.sachsen.de/mapviewer/resources/apps/sachsenatlas/index.html';
  window.open(mapsUrl,'_blank');
});

var san_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: DarkSlateGrey;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Sachsen-Anhalt-Viewer</button>');
san_btn.click(function(){

  var mapsUrl = 'https://www.geodatenportal.sachsen-anhalt.de/mapapps/resources/apps/viewer_v40/index.html?lang=de';
  window.open(mapsUrl,'_blank');
});

var sho_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Digitaler Atlas Nord</button>');
sho_btn.click(function(){

  var href = $('.WazeControlPermalink a').attr('href');

  var lon = parseFloat(getQueryString(href, 'lon'));
  var lat = parseFloat(getQueryString(href, 'lat'));

  // Using Proj4js to transform coordinates. See http://proj4js.org/
  var script = document.createElement("script"); // dynamic load the library from https://cdnjs.com/libraries/proj4js
  script.type = 'text/javascript';
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js';
  document.getElementsByTagName('head')[0].appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
  script.onload = popAtlas; //wait till the script is downloaded & executed
function popAtlas() {

 //just a wrapper for onload
 if (proj4) {
  firstProj= "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  var utm = proj4(firstProj,[lon,lat]);

  var mapsUrl = 'https://danord.gdi-sh.de/viewer/resources/apps/Anonym/index.html?lang=de&vm=2D&s=2000&c='+utm[0]+'%2C'+utm[1]+'#/';
  window.open(mapsUrl,'_blank');
 }
}
});


var thu_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">Geoportal Thüringen</button>');
thu_btn.click(function(){

  var href = $('.WazeControlPermalink a').attr('href');

  var lon = parseFloat(getQueryString(href, 'lon'));
  var lat = parseFloat(getQueryString(href, 'lat'));
  var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

  zoom = zoom-9;

  // Using Proj4js to transform coordinates. See http://proj4js.org/
  var script = document.createElement("script"); // dynamic load the library from https://cdnjs.com/libraries/proj4js
  script.type = 'text/javascript';
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js';
  document.getElementsByTagName('head')[0].appendChild(script); // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
  script.onload = popAtlas; //wait till the script is downloaded & executed
  function popAtlas() {
   //just a wrapper for onload
     if (proj4) {
       var firstProj ='';
         firstProj = "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
           var utm = proj4(firstProj,[lon,lat]);

  var mapsUrl = 'https://thueringenviewer.thueringen.de/thviewer/?center=' + utm[0] + ',' + utm [1] +'&zoomlevel=' +zoom;
  window.open(mapsUrl,'_blank');
   }
  }

});

var deu_btn = $('<button style="width: 285px;height: 24px; font-size:85%;color: Green;border-radius: 5px;border: 0.5px solid lightgrey; background: white">basemap.de Deutschland</button>');
deu_btn.click(function(){
   var href = $('.WazeControlPermalink a').attr('href');

   var scale = $(".olControlScaleLineTop");
   var scaleText = scale.text();
   var scaleWidth = scale.width();
   var meter = parseInt(scaleText) * (scaleText.includes("k")?1000:1) / parseInt(scaleWidth);

   var lon = getQueryString(href, 'lon');
   var lat = getQueryString(href, 'lat');
   var zoom = BasemapZoom(meter, lat);

   window.open("https://basemap.de/viewer?config=" + btoa('{"lat":' + lat + ',"lon":' + lon + ',"zoom":' + zoom + ',"styleID":0,"pitch":0,"bearing":0,"saturation":0,"brightness":0,"hiddenControls":[],"hiddenLayers":[],"changedLayers":[],"hiddenSubGroups":[],"changedSubGroups":[],"externalStyleURL":""}'), "basemap");
});

var txt_btn1 = $('<button style="width: 285px;height: 24px; ; border: 1px solid silver; font-size:85%; font-weight: bold; color: DarkSlateGrey; background-color: ghostwhite; border-radius: 5px;border: 0.5px solid lightgrey; background: white;">GEOPORTALE BUNDESLÄNDER</button>');
var txt_btn2 = $('<button style="width: 285px;height: 24px; ; border: 1px solid silver; font-size:85%; font-weight: bold; color: DarkSlateGrey; background-color: ghostwhite; border-radius: 5px;border: 0.5px solid lightgrey; background: white">WEBATLAS DEUTSCHLAND</button>');

var spacer = '<p style="margin-bottom:5px">'

// create the content of the side-panel tab
var addon = document.createElement('section');
addon.id = "l2degeo-addon";

addon.innerHTML =
    '<a href="https://github.com/iridium1-waze/WME-L2DEGEO/blob/main/WME%20L2DEGEO.user.js" target="_blank"><b>Links to DE Geo Portals </b>v ' + l2degeo_version + '</a><p>';

//alert("Create Tab");
var userTabs = document.getElementById('user-info');
var navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
var tabContent = document.getElementsByClassName('tab-content', userTabs)[0];

var newtab = '';

newtab = document.createElement('li');
newtab.innerHTML = '<a href="#sidepanel-l2degeo" data-toggle="tab">L2DEGEO</a>';
navTabs.appendChild(newtab);

addon.id = "sidepanel-l2degeo";
addon.className = "tab-pane";
tabContent.appendChild(addon);

$("#sidepanel-l2degeo").append('<b><p style="font-family:verdana"; "font-size:16px">GEOPORTALE DER BUNDESLÄNDER</b></p>'); // ■■■■■ "GEOPORTALE DER BUNDESLÄNDER" ■■■■■
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append('<p style="font-size:75%">Portale mit grüner Schrift unterstützen die Übergabe der Koordinaten aus dem WME</p>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/baden-wuerttemberg.png" width="16"><b>&nbsp;&nbsp;BADEN-WÜRTTEMBERG</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(baw_btn); //Baden-Würtemberg
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/bayern.png" width="16"><b>&nbsp;&nbsp;BAYERN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(bay_btn); //Bayern
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/berlin.png" width="16"><b>&nbsp;&nbsp;BERLIN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(ber_btn); //Berlin
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/brandenburg.png" width="16"><b>&nbsp;&nbsp;BRANDENBURG</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(bra_btn); //Brandenburg
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/bremen.png" width="16"><b>&nbsp;&nbsp;BREMEN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(bre_btn); //Bremen
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/hamburg.png" width="16"><b>&nbsp;&nbsp;HAMBURG</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(ham_btn); //Hamburg
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/hessen.png" width="16"><b>&nbsp;&nbsp;HESSEN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(hes_btn); //Hessen
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/mecklenburg-vorpommern.png" width="16"><b>&nbsp;&nbsp;MECKLENBURG-VORPOMMERN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(mev_btn); //Mecklenburg-Vorpommern
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/niedersachsen.png" width="16"><b>&nbsp;&nbsp;NIEDERSACHSEN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(nie_btn1); //Geobasis Niedersachsen
$("#sidepanel-l2degeo").append(nie_btn2); //Niedersachsen Katasterkarte
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/nordrhein-westfalen.png" width="16"><b>&nbsp;&nbsp;NORDRHEIN-WESTFALEN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(nrw_btn1); //Nordrhein-Westfalen - gesamt
$("#sidepanel-l2degeo").append(nrw_btn2); //Nordrhein-Westfalen - TIM Online
$("#sidepanel-l2degeo").append(nrw_btn3); //Nordrhein-Westfalen - Rhein-Kreis-Neuss
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/rheinland-pfalz.png" width="16"><b>&nbsp;&nbsp;RHEINLAND-PFALZ</b>');
$("#sidepanel-l2degeo").append(spacer);$("#sidepanel-l2degeo").append(rhe_btn); //Rheinland-Pfalz
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/saarland.png" width="16"><b>&nbsp;&nbsp;SAARLAND</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(saa_btn); //Saarland
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/sachsen.png" width="16"><b>&nbsp;&nbsp;SACHSEN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(sac_btn); //Sachsen
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/sachsen-anhalt.png" width="16"><b>&nbsp;&nbsp;SACHSEN-ANHALT</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(san_btn); //Sachsen-Anhalt
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/schleswig-holstein.png" width="16"><b>&nbsp;&nbsp;SCHLESWIG-HOLSTEIN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(sho_btn); //Schleswig-Holstein
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/thueringen.png" width="16"><b>&nbsp;&nbsp;THÜRINGEN</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(thu_btn); //Thüringen
$("#sidepanel-l2degeo").append('<br><br>');
$("#sidepanel-l2degeo").append('<b><p style="font-family:verdana"; "font-size:16px">GEOPORTAL DEUTSCHLAND</b></p>'); // ■■■■■ "GEOPORTAL DE" ■■■■■
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append('<img src="https://raw.githubusercontent.com/iridium1-waze/WME-L2DEGEO/main/deutschland.png" width="16"><b>&nbsp;&nbsp;basemap.de</b>');
$("#sidepanel-l2degeo").append(spacer);
$("#sidepanel-l2degeo").append(deu_btn); //basemap.de

}
add_buttons();
