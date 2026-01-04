// ==UserScript==
// @name        WME Permalink to serveral Maps fork
// @description This script create buttons to permalink page on several Maps.
// @description Based on http://members.aon.at/aneumeister/scripts/waze/testmaps.user.js
// @namespace   https://greasyfork.org/scripts/39937-wme-permalink-to-serveral-maps-fork
// @version     2.00.08.54 [Fork]
// @include     https://*.waze.com/editor*
// @include     https://*.waze.com/*/editor*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39937/WME%20Permalink%20to%20serveral%20Maps%20fork.user.js
// @updateURL https://update.greasyfork.org/scripts/39937/WME%20Permalink%20to%20serveral%20Maps%20fork.meta.js
// ==/UserScript==

// Mini howto:
// 1) install this script as greasemonkey script or chrome extension
// 2) Click on Google Maps Permalink on the sidebar


var p2sm_version = "2.00.08.54";

if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
  (function page_scope_runner() {
    // If we're _not_ already running in the page, grab the full source
    // of this script.
    var my_src = "(" + page_scope_runner.caller.toString() + ")();";

    // Create a script node holding this script, plus a marker that lets us
    // know we are running in the page scope (not the Greasemonkey sandbox).
    // Note that we are intentionally *not* scope-wrapping here.
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.  Use setTimeout to force execution "outside" of
    // the user script scope completely.
    setTimeout(function() {
          document.body.appendChild(script);
          add_buttons();
        }, 3000);
  })();

  // Stop running, because we know Greasemonkey actually runs us in
  // an anonymous wrapper.
  return;
}

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
function getQueryString(link, name)
{
    var pos = link.indexOf( name + '=' ) + name.length + 1;
    var len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return link.substr(pos,len);
}

function CorrectZoom(link)
{
    var found = link.indexOf('livemap');
    return (-1 == found)?13:2;
}

function add_buttons()
{

var btn0 = $('<button style="width: 70px;height: 24px;font-size:70%;">ß-Switch</button>');
btn0.click(function(){
    var mapsUrl;
//    var href = $('.WazeControlPermalink a').attr('href');
	var href = document.getElementsByClassName('WazeControlPermalink')[0].getElementsByClassName('fa fa-link permalink')[0].href;
	var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom'));

//	alert(href);
    var beta = href.indexOf('beta');
    if (beta >= 0){
//		mapsUrl = 'https://www.waze.com/editor/?lon=' + lon + '&lat=' + lat + '&zoom=' + (zoom-12);
		mapsUrl = href.replace('beta','www');
//		alert("beta->www: " + mapsUrl);
    }
    else {
//		mapsUrl = 'https://beta.waze.com/editor/?lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
		mapsUrl = href.replace('www','beta');
//		alert("www->beta: " + mapsUrl);
    }
    window.open(mapsUrl);
});

var btn1 = $('<button style="width: 70px;height: 24px;font-size:70%;">Google</button>');
btn1.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = (zoom > 19) ? 19 : zoom;
    var mapsUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z';
    window.open(mapsUrl,'_blank');
});

var btn5 = $('<button style="width: 70px;height: 24px;font-size:70%;">GoogleSat</button>');
btn5.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z/data=!3m1!1e3!5m1!1e1';
    window.open(mapsUrl,'_blank');
});

var btn2 = $('<button style="width: 70px;height: 24px;font-size:70%;">Bing</button>');
btn2.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = ' http://www.bing.com/maps/default.aspx?v=2&cp=' + lat + '~' + lon + '&lvl=' + zoom + '&sty=h';
    window.open(mapsUrl,'_blank');
});

var btn3 = $('<button style="width: 70px;height: 24px;font-size:70%;">sautter.com</button>');
btn3.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 17 ? 17 : zoom;
    var mapsUrl = 'http://sautter.com/map/?zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '&layers=B000TFFFFFFF';
    window.open(mapsUrl,'_blank');
});

var btn3a = $('<button style="width: 70px;height: 24px;font-size:70%;">OSM</button>');
btn3a.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href) - 2;

    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = 'http://www.openstreetmap.org/#map=' + zoom + '/'+ lat + '/' + lon;
    //var mapsUrl = 'http://www.openstreetmap.org/?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom + '&layers=M';
    //var mapsUrl = 'http://osm.clapps.net/?ll=' + lat + ',' + lon + '&z=' + zoom;
    window.open(mapsUrl,'_blank');
});

var btn3b = $('<button style="width: 70px;height: 24px;font-size:70%;">OSM/bing</button>');
btn3b.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = 'http://mvexel.dev.openstreetmap.org/bingimageanalyzer/?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom;
    window.open(mapsUrl,'_blank');
});

var btn4 = $('<button style="width: 70px;height: 24px;font-size:70%;">GEOPORTAIL</button>');
btn4.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) ;
    // Waze 2 -> GEO 14
    // Waze 7 -> GEO 19
    zoom = zoom + 1;
    var mapsUrl = 'https://www.geoportail.gouv.fr/carte?c='+lon+','+lat+'&z='+zoom+'&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD::GEOPORTAIL:OGC:WMTS(1)&l2=COMMUNES.ACTUELLES::GEOPORTAIL:OGC:WMS(1)&permalink=yes';
    // var mapsUrl = 'http://www.oeamtc.at/maps/?lat='+lat+'&lon='+lon+'&zoom='+zoom+'';
    // https://www.geoportail.gouv.fr/carte?c='+lon+','+lat+'&z='+zoom+'&l0=ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1)&l1=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD::GEOPORTAIL:OGC:WMTS(1)&l2=COMMUNES.ACTUELLES::GEOPORTAIL:OGC:WMS(1)&permalink=yes
    window.open(mapsUrl,'_blank');
});

var btn6 = $('<button style="width: 70px;height: 24px;font-size:70%;">geo.admin</button>');
btn6.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href); // +5
    var phi1 = ((lat * 3600)-169028.66)/10000;
    var lmd1 = ((lon * 3600)-26782.5)/10000;
    var x = 200147.07 + 308807.95 * phi1 + 3745.25 * lmd1 * lmd1 + 76.63 * phi1 * phi1 + 119.79 * phi1 * phi1 * phi1 - 194.56 * lmd1 * lmd1 * phi1;
    var y = 600072.37 + 211455.93  * lmd1 - 10938.51  * lmd1  * phi1 - 0.36 * lmd1  * phi1 * phi1 - 44.54 * lmd1 * lmd1 * lmd1;
    var mapsUrl = 'http://map.geo.admin.ch/?Y='+y.toFixed(0)+'&X='+x.toFixed(0)+'&zoom='+zoom+'&bgLayer=ch.swisstopo.pixelkarte-farbe&time_current=latest&lang=de';
    window.open(mapsUrl,'_blank');
});

/*
  Basemap (EPSG:3857)
  double x = lon * 20037508.34 / 180;
  double y = Math.Log(Math.Tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  return new double[] {x, y};
 */
var btn7 = $('<button style="width: 70px;height: 24px;font-size:70%;">basemap.at</button>');
btn7.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);
    if (zoom>19) zoom=19;
    var x = lon / 180 * 20037508.34;
    var y = Math.log(Math.tan((90 + lat*1) * Math.PI / 360)) / Math.PI;
    y = y * 20037508.34;
    var mapsUrl = 'http://www.basemap.at/application/index.html#{"center":['+x.toFixed(10)+','+y.toFixed(10)+'],"zoom":'+zoom+',"rotation":0,"layers":"1000000000"}';
    window.open(mapsUrl,'_blank');
});

// http://map.connectpr.org/?center=-7347637.4238354815,2079399.6776592892&scale=9027.977411&layers=
var btn8 = $('<button style="width: 70px;height: 24px;font-size:70%;">PR</button>');
btn8.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);
    var x = lon / 180 * 20037508.34;
    var y = Math.log(Math.tan((90 + lat*1) * Math.PI / 360)) / Math.PI;
    y = y * 20037508.34;
    if (zoom > 8) zoom = 8;
    zoom = 100000/(Math.pow(2,zoom-1));
    var mapsUrl = 'http://map.connectpr.org/?center='+x.toFixed(10)+','+y.toFixed(10)+'&scale='+zoom.toFixed(1)+'&layers={"layers":[{"name":"Layers","show": [14]}], "alpha": 1}';
    window.open(mapsUrl,'_blank');
});

// http://www.viamichelin.com/print/map?latitude=48.2638198&longitude=16.423198&zoom=16&address=&departure&arrival
var btn9 = $('<button style="width: 70px;height: 24px;font-size:70%;">ViaMichelin</button>');
btn9.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;

    //var mapsUrl = 'http://www.viamichelin.com/1.34.1/html/michelinmap.html?lat=' + lat + '&longitude=' + lon + '&zoom=' + zoom + '&headerLabel=Karten %26 Routenplaner&apiJsConfigUrl=%2Fapijs%2F1.11.0%2Fapi%2Fjs%3Fkey%3DJSBS20110216111214120400892678%24166489%26lang%3Ddeu';
    //window.open(mapsUrl,'_blank');

    //var mapsUrl = 'http://www.viamichelin.com/print/map?latitude=' + lat + '&longitude=' + lon + '&zoom=' + zoom + '&address=&departure&arrival';
    //window.open(mapsUrl,'_blank');
    var mapsUrl = 'http://www.viamichelin.com/web/Traffic?position=' + lat + ';' + lon + ';' + zoom ;
    window.open(mapsUrl,'_blank');
});

// https://maps.here.com/?map=53.24623,7.77117,18,satellite
var btn10 = $('<button style="width: 70px;height: 24px;font-size:70%;">Here</button>');
btn10.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;

    var mapsUrl = 'https://maps.here.com/?map=' + lat + ',' + lon + ',' + zoom  + ',satellite';
    window.open(mapsUrl,'_blank');
});

// https://www.mapillary.com/map/search/48.16835487301262/48.17466323162981/16.44409459864721/16.46633909357095
// https://www.mapillary.com/map/search/48.47014533728486/48.47247656698522/15.419126436821301/15.427395260415778
// https://www.mapillary.com/app/?lat=47.92577487099999&lng=15.06136310300002&z=7.7016369
var btn11 = $('<button style="width: 70px;height: 24px;font-size:70%;">Mapillary</button>');
btn11.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon')*1.0;
    var lat = getQueryString(href, 'lat')*1.0;
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href) - 3;

    zoom = zoom > 19 ? 19 : zoom;
	// zoom = 20.0 - zoom;
	// var lat1 = lat - (0.0010 * zoom);
	// var lat2 = lat + (0.0010 * zoom);
	// var lon1 = lon - (0.0005 * zoom);
	// var lon2 = lon + (0.0005 * zoom);

    // var mapsUrl = 'https://www.mapillary.com/map/search/' + lat1.toFixed(5) + '/' + lat2.toFixed(5) + '/' + lon1.toFixed(5) + '/' + lon2.toFixed(5);
    var mapsUrl = 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
	// alert(mapsUrl);
    window.open(mapsUrl,'_blank');
});

// http://product.itoworld.com/map/35?lon=16.47633&lat=48.14758&zoom=15
// http://product.itoworld.com/map/35?lon=15.68745&lat=48.48674&zoom=18
var btn12 = $('<button style="width: 70px;height: 24px;font-size:70%;">ITO!</button>');
btn12.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 17 ? 17 : zoom;

    var mapsUrl = 'http://product.itoworld.com/map/35?lon=' + lon + '&lat=' + lat + '&zoom=' + zoom + '&fullscreen=true';
    window.open(mapsUrl,'_blank');
});

// https://en.mappy.com/#/12/M2/THome/N0,0,15.69021,48.4738/Z19/
var btn13 = $('<button style="width: 70px;height: 24px;font-size:70%;">Mappy</button>');
btn13.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;

    var mapsUrl = 'https://en.mappy.com/#/12/M2/THome/N0,0,' + lon + ',' + lat + '/Z' + zoom + '/';
    window.open(mapsUrl,'_blank');
});

// http://map.scdb.info/speedcameramap/ll/51.563412,9.997559/z/12
var btn14 = $('<button style="width: 70px;height: 24px;font-size:70%;">SpeedCam</button>');
btn14.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;

    var mapsUrl = 'http://map.scdb.info/speedcameramap/ll/' + lat + ',' + lon + '/z/' + zoom;
    window.open(mapsUrl,'_blank');
});

// http://beta.map1.eu/#zoom=14&lat=47.66229&lon=14.48784&layers=BT
var btn15 = $('<button style="width: 70px;height: 24px;font-size:70%;">beta.map1</button>');
btn15.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 15 ? 15 : zoom;

    var mapsUrl = 'http://beta.map1.eu/#zoom=' + zoom + '&lat=' + lat + '&lon=' + lon + '&layers=BT';
    window.open(mapsUrl,'_blank');
});

// http://frink.bplaced.de/blitzer/#map=11/51.9026/10.5036
var btn16 = $('<button style="width: 70px;height: 24px;font-size:70%;">OSM-Blitzer</button>');
btn16.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 18 ? 18 : zoom;

    var mapsUrl = 'http://frink.bplaced.de/blitzer/#map=' + zoom + '/' + lat + '/' + lon;
    window.open(mapsUrl,'_blank');
});

// add new box to left of the map
var addon = document.createElement("section");
addon.id = "p2sm-addon";

addon.innerHTML  =
    '<b><a href="https://greasyfork.org/scripts/3080-wme-permalink-to-serveral-maps/code/WME%20Permalink%20to%20serveral%20Maps.user.js" target="_blank">Permalink to several maps / V' + p2sm_version + '</b></a>';

//alert("Create Tab");
var userTabs = document.getElementById('user-info');
var navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
var tabContent = document.getElementsByClassName('tab-content', userTabs)[0];

newtab = document.createElement('li');
newtab.innerHTML = '<a href="#sidepanel-p2sm" data-toggle="tab">P2SM</a>';
navTabs.appendChild(newtab);

addon.id = "sidepanel-p2sm";
addon.className = "tab-pane";
tabContent.appendChild(addon);

$("#sidepanel-p2sm").append('<br>');
$("#sidepanel-p2sm").append(btn1);
$("#sidepanel-p2sm").append(btn5);
$("#sidepanel-p2sm").append(btn9);
$("#sidepanel-p2sm").append(btn4);
$("#sidepanel-p2sm").append(btn2);
$("#sidepanel-p2sm").append(btn13);
$("#sidepanel-p2sm").append(btn3a);
$("#sidepanel-p2sm").append(btn10);
//$("#sidepanel-p2sm").append('<br>');
//$("#sidepanel-p2sm").append(btn3);
//$("#sidepanel-p2sm").append(btn8);
//$("#sidepanel-p2sm").append(btn6);
//$("#sidepanel-p2sm").append(btn0);
//$("#sidepanel-p2sm").append(btn7);
//$("#sidepanel-p2sm").append(btn12);
//$("#sidepanel-p2sm").append(btn14);
//$("#sidepanel-p2sm").append(btn15);
//$("#sidepanel-p2sm").append(btn3b);
//$("#sidepanel-p2sm").append(btn11);
//$("#sidepanel-p2sm").append(btn16);
}
