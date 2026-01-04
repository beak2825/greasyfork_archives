// ==UserScript==
// @name        WME Permalink to several Maps CH
// @description WME P2SM für die Schweiz
// @namespace   https://greasyfork.org/de/users/863740-horst-wittlich
// @version     2022.22.07.01
// @match       https://*.waze.com/editor*
// @match       https://*.waze.com/*/editor*
// @icon        https://i.ibb.co/ckSvk59/waze-icon.png
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448195/WME%20Permalink%20to%20several%20Maps%20CH.user.js
// @updateURL https://update.greasyfork.org/scripts/448195/WME%20Permalink%20to%20several%20Maps%20CH.meta.js
// ==/UserScript==

// Mini howto:
// 1) install this script as GitHub script
// 2) Click on buttons on the sidebar to open selected map service with coordinates coming from WME

var p2sm_version = "2022.21.07.01";
function getQueryString (link, name)
{
    var pos = link.indexOf(name + '=' ) + name.length + 1;
    var len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return link.substr(pos,len);
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

var btn0 = $('<button style="width: 90px;height: 24px;font-size:90%;">ß-Switch</button>');
btn0.click(function(){
    var mapsUrl;
//    var href = $('.WazeControlPermalink a').attr('href');
   var href = document.getElementsByClassName('WazeControlPermalink')[0].getElementsByClassName('fa fa-link permalink')[0].href;
   var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom'));
    var newzoom = document.W.map.zoom;


//   alert(href);
    var beta = href.indexOf('beta');
    if (beta >= 0){
//      mapsUrl = 'https://www.waze.com/editor/?lon=' + lon + '&lat=' + lat + '&zoom=' + (zoom-12);
      mapsUrl = href.replace('beta','www');
//      alert("beta->www: " + mapsUrl);

    }
    else {
//      mapsUrl = 'https://beta.waze.com/editor/?lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
      mapsUrl = href.replace('www','beta');
//      alert("www->beta: " + mapsUrl);
    }
    window.open(mapsUrl);
});

var btn1 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://bit.ly/3bltdQi);background-repeat: no-repeat;border-radius: 7px">Google</button>');
btn1.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    zoom = W.map.getOLMap().getZoom()
    var mapsUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z';

    window.open(mapsUrl,'_blank');
});

var btn5 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://i.ibb.co/WsH15zC/Apple-Jetzt.png);background-repeat: no-repeat;border-radius: 7px">  Apple</button>');
btn5.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);
    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = 'https://duckduckgo.com/?q=' + lat + ',' + lon + ',' + zoom + '&iaxm=maps';

    window.open(mapsUrl,'_blank');
});


var btn2 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://bit.ly/2ESClzU);background-repeat: no-repeat;border-radius: 7px">  Bing</button>');
btn2.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = ' http://www.bing.com/maps/default.aspx?v=2&cp=' + lat + '~' + lon + '&lvl=' + (zoom-1) + '&sty=h';
    window.open(mapsUrl,'_blank');
});

var btn3a = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://bit.ly/3jCiB2j);background-repeat: no-repeat;border-radius: 7px">OSM</button>');
btn3a.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    zoom = W.map.getOLMap().getZoom()

    var mapsUrl = 'http://www.openstreetmap.org/#map=' + zoom + '/'+ lat + '/' + lon;
    //var mapsUrl = 'http://www.openstreetmap.org/?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom + '&layers=M';
    //var mapsUrl = 'http://osm.clapps.net/?ll=' + lat + ',' + lon + '&z=' + zoom;
    window.open(mapsUrl,'_blank');
});

var btn3b = $('<button style="width: 90px;height: 24px;font-size:90%;color: Crimson">OSM/bing</button>');
btn3b.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;
    var mapsUrl = 'http://mvexel.dev.openstreetmap.org/bingimageanalyzer/?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom;
    window.open(mapsUrl,'_blank');
});

var btn4 = $('<button style="width: 90px;height: 24px;font-size:90%;">Ã–AMTC</button>');
btn4.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = 10-2*zoom;
    zoom = (zoom<2)? 1 : zoom;
    var mapsUrl = 'http://www.oeamtc.at/maps/?lat='+lat+'&lon='+lon+'&zoom='+zoom;
    window.open(mapsUrl,'_blank');
});

var btn6 = $('<button style="width: 90px;height: 24px;font-size:90%;color: Crimson">geo.admin</button>');
btn6.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href); // +5
    var phi1 = ((lat * 3600)-169028.66)/10000;
    var lmd1 = ((lon * 3600)-26782.5)/10000;
    var x = 200147.07 + 308807.95 * phi1 + 3745.25 * lmd1 * lmd1 + 76.63 * phi1 * phi1 + 119.79 * phi1 * phi1 * phi1 - 194.56 * lmd1 * lmd1 * phi1;
    var y = 600072.37 + 211455.93 * lmd1 - 10938.51 * lmd1 * phi1 - 0.36 * lmd1 * phi1 * phi1 - 44.54 * lmd1 * lmd1 * lmd1;
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
var btn7 = $('<button style="width: 90px;height: 24px;font-size:90%;">basemap.at</button>');
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
var btn8 = $('<button style="width: 90px;height: 24px;font-size:90%;">PR</button>');
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

// http://www.viamichelin.de/print/map?latitude=48.2638198&longitude=16.423198&zoom=16&address=&departure&arrival
var btn9 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://bit.ly/3hSLI0O);background-repeat: no-repeat;border-radius: 7px"">  ViaM</button>');
btn9.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom;

    //var mapsUrl = 'http://www.viamichelin.de/1.34.1/html/michelinmap.html?lat=' + lat + '&longitude=' + lon + '&zoom=' + zoom + '&headerLabel=Karten %26 Routenplaner&apiJsConfigUrl=%2Fapijs%2F1.11.0%2Fapi%2Fjs%3Fkey%3DJSBS20110216111214120400892678%24166489%26lang%3Ddeu';
    //window.open(mapsUrl,'_blank');

    //var mapsUrl = 'http://www.viamichelin.de/print/map?latitude=' + lat + '&longitude=' + lon + '&zoom=' + zoom + '&address=&departure&arrival';
    //window.open(mapsUrl,'_blank');
    var mapsUrl = 'http://www.viamichelin.de/web/Traffic?position=' + lat + ';' + lon + ';' + (zoom-1) ;
    window.open(mapsUrl,'_blank');
});

// https://wego.here.com/?map=53.24623,7.77117,18,satellite&x=ep
var btn10 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://bit.ly/2YZi7eS);background-repeat: no-repeat;border-radius: 7px"">  Here</button>');
btn10.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 19 ? 19 : zoom-1;

    var mapsUrl = 'https://wego.here.com/?map=' + lat + ',' + lon + ',' + zoom + ',satellite&x=ep';
    window.open(mapsUrl,'_blank');
});


var btn95 = $('<button style="width: 90px;height: 24px;font-size:90%;color: CornflowerBlue;background-image: url(http://rf.revolvermaps.com/w/3/s/a/0/40/2/ffffff/010020/aa0000/5d8h9swr38l.png);background-repeat: no-repeat;border-radius: 7px">&nbsp;&nbsp;Stats</button>');
btn95.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');
    var mapsUrl = 'https://www.revolvermaps.com/livestats/5d8h9swr38l/';
    window.open(mapsUrl,'_blank');
});

var btn11 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkGreen;background-image: url(https://bit.ly/2DlCYBo);background-repeat: no-repeat;border-radius: 7px">&nbsp;&nbsp;&nbsp;&nbsp;Mapillary</button>');
btn11.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);


    zoom = zoom-3;
//   zoom = 20.0 - zoom;
//   var lat1 = lat - (0.0010 * zoom);
//   var lat2 = lat + (0.0010 * zoom);
//   var lon1 = lon - (0.0005 * zoom);
//   var lon2 = lon + (0.0005 * zoom);

//  var mapsUrl = 'https://www.mapillary.com/app/?lat=' + lat1.toFixed(5) + '&lng=' + lat2.toFixed(5) + '&focus=mapnu=false'
   var mapsUrl = 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon +'&z=' + zoom;
   // alert(mapsUrl);
    window.open(mapsUrl,'_blank');
});

// https://www.openstreetbrowser.org/#map=18/51.18321/6.71228&categories=car_maxspeed
var btn12 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkGreen;background-image: url(https://bit.ly/2Gfre4s);background-repeat: no-repeat;border-radius: 7px">&nbsp;&nbsp;&nbsp;OSBrowser</button>');
btn12.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    zoom = W.map.getOLMap().getZoom() -1;

    var mapsUrl = 'https://www.openstreetbrowser.org/#map=' + zoom + '/' + lat + '/' + lon + '&categories=car_maxspeed';
    window.open(mapsUrl,'_blank');
});

// https://en.mappy.com/#/12/M2/THome/N0,0,15.69021,48.4738/Z19/
var btn13 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://bit.ly/2EVea3B);background-repeat: no-repeat;border-radius: 7px">  Mappy</button>');
btn13.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    zoom = W.map.getOLMap().getZoom() -1;

    var mapsUrl = 'https://en.mappy.com/#/12/M2/THome/N0,0,' + lon + ',' + lat + '/Z' + zoom + '/';
    window.open(mapsUrl,'_blank');
});

// https://www.msn.com/de-de/traffic?locale=de-de&cp=51.23013,%206.82414&lvl=19&sty=h
var btn15 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://i.ibb.co/zsMRVGB/Microsoft-23401-20.png);background-repeat: no-repeat;border-radius: 7px">&nbsp;MSN</button>');
btn15.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    zoom = W.map.getOLMap().getZoom()

    var mapsUrl = 'https://www.msn.com/de-de/traffic?locale=de-de&cp=' + lat + ',%20' + lon + '&lvl=' + zoom;
    window.open(mapsUrl,'_blank');
});

var btn16 = $('<button style="width: 90px;height: 24px;font-size:90%;color: CornflowerBlue;background-image: url(https://i.ibb.co/Np5chv4/CH-Icon-20.png);background-repeat: no-repeat;border-radius: 7px">&nbsp;&nbsp;GeoAdmin</button>');
btn16.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);

    zoom = zoom > 11 ? 19 : zoom;
    var phi1 = ((lat * 3600)-169028.66)/10000;
    var lmd1 = ((lon * 3600)-26782.5)/10000;
    var x = 200147.07 + 308807.95 * phi1 + 3745.25 * lmd1 * lmd1 + 76.63 * phi1 * phi1 + 119.79 * phi1 * phi1 * phi1 - 194.56 * lmd1 * lmd1 * phi1;
    var y = 600072.37 + 211455.93  * lmd1 - 10938.51  * lmd1  * phi1 - 0.36 * lmd1  * phi1 * phi1 - 44.54 * lmd1 * lmd1 * lmd1;
    var mapsUrl = 'https://map.geo.admin.ch/?zoom=11&topic=ech&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&layers=ch.bfs.gebaeude_wohnungs_register,ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissimage-product&catalogNodes=457,532,687,458,477,485,491,510,527,1743&layers_visibility=false,false,true&layers_timestamp=,,current&Y='+y.toFixed(0)+'&X='+x.toFixed(0);
    window.open(mapsUrl,'_blank');
});

var btn19 = $('<button style="width: 90px;height: 24px;font-size:90%;color: CornflowerBlue;background-image: url(https://bit.ly/2QJJ8OZ);background-repeat: no-repeat;border-radius: 7px">&nbsp;&nbsp;WebAtlas</button>');
btn19.click(function(){
   var href = $('.WazeControlPermalink a').attr('href');

    var lon = parseFloat(getQueryString(href, 'lon'));
    var lat = parseFloat(getQueryString(href, 'lat'));
    var zoom = parseInt(getQueryString(href, 'zoom')) + CorrectZoom(href);
   zoom = zoom -6.5;

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
       var mapsUrl = 'https://sg.geodatenzentrum.de/web_bkg_webmap/applications/webatlasde/webatlasde.html?zoom=' + zoom + '&lon=' + utm[0] + '&lat=' + utm[1] + '&layers=B0T';
       window.open(mapsUrl,'_blank');
     }
   }

});

    // https://mydrive.tomtom.com/de_de/#mode=viewport+viewport=49.76137,9.70753,15,0,-0+ver=3
var btn18 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkSlateGrey;background-image: url(https://bit.ly/2QJPZry);padding-left: 10px;padding-right: 2px;background-repeat: no-repeat;border-radius: 7px;title="TomTom">&nbsp;  TomTom</button>');
btn18.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    zoom = W.map.getOLMap().getZoom() -1;

    var mapsUrl = 'https://mydrive.tomtom.com/de_de/#mode=viewport+viewport=' + lat +',' + lon +',' + zoom + ',0,-0+ver=3';
    window.open(mapsUrl,'_blank');

});

    // Waze Reportingtool: https://www.waze.com/reporting/location?lat=49.50939698036761&lng=6.743288040161134&zoom=16
    var btn20 = $('<button style="width: 90px;height: 24px;font-size:90%;color: LightSeaGreen;background-image: url(https://bit.ly/3jEtjWg);padding-left: 10px;padding-right: 2px;background-repeat: no-repeat;border-radius: 7px;title="Reporting">&nbsp;  Reporting</button>');
btn20.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

     var lon = getQueryString(href, 'lon');
     var lat = getQueryString(href, 'lat');
     var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
     zoom = W.map.getOLMap().getZoom() -1;

     var mapsUrl = 'https://www.waze.com/reporting/location?lat=' + lat + '&lng=' + lon + '&zoom=' + zoom;
     window.open(mapsUrl,'_blank');
});

    // https://kartaview.org/map/@48.110432829485546,11.527876853942873,16z
var btn21 = $('<button style="width: 90px;height: 24px;font-size:90%;color: DarkGreen;background-image: url(https://bit.ly/3sNABM3);background-repeat: no-repeat;border-radius: 7px">&nbsp;&nbsp;    KartaView</button>');
btn21.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    zoom = W.map.getOLMap().getZoom() -1;

    var mapsUrl = 'https://kartaview.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
    window.open(mapsUrl,'_blank');
});

var txtbtn1 = $('<button style="width: 285px;height: 24px; border: 1px solid silver; font-size:80%; font-weight: bold; color: DarkSlateGrey; background-color: ghostwhite; border-radius: 7px;">ALLGEMEINE KARTEN</button>');
var txtbtn3 = $('<button style="width: 285px;height: 24px; border: 1px solid silver; font-size:80%; font-weight: bold; color: DarkGreen; background-color: ghostwhite; border-radius: 7px">GESCHWINDIGKEITEN / BILDER</button>');
var txtbtn4 = $('<button style="width: 285px;height: 24px; border: 1px solid silver; font-size:80%; font-weight: bold; color: CornflowerBlue; background-color: ghostwhite; border-radius: 7px">GEOPORTALE</button>');
var txtbtn5 = $('<button style="width: 285px;height: 24px; border: 1px solid silver; font-size:80%; font-weight: bold; color: LightSeaGreen; background-color: ghostwhite; border-radius: 7px;">MISC</button>');
var spacer = '<p style="margin-bottom:10px">'
var safeSourcesText = $('<div><i class="w-icon w-icon-warning" style="font-size: 30px;float: left;margin-right: 5px;margin-bottom: 20px;"></i> Hinweis: Einige der externen Karten sind als Informationsquelle zur Kartenbearbeitung nicht zulässig!</div>');

// add new box to left of the map
var addon = document.createElement("section");
addon.id = "p2sm-addon";

addon.innerHTML =
    '<a href="https://greasyfork.org/de/scripts/448195-wme-permalink-to-several-maps-ch" target="_blank">Auf Updates überprüfen / V' + p2sm_version + '</a><p>';

//alert("Create Tab");
var userTabs = document.getElementById('user-info');
var navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
var tabContent = document.getElementsByClassName('tab-content', userTabs)[0];
var newtab = '';

newtab = document.createElement('li');
newtab.innerHTML = '<a href="#sidepanel-p2sm" data-toggle="tab">P2SM</a>';
navTabs.appendChild(newtab);

addon.id = "sidepanel-p2sm";
addon.className = "tab-pane";
tabContent.appendChild(addon);

$("#sidepanel-p2sm").append(txtbtn1); // ■■■■■ "ALLGEMEINE KARTEN" ■■■■■
$("#sidepanel-p2sm").append(spacer);
$("#sidepanel-p2sm").append(btn1); //GOOGLE
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn2); // BING
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn3a); //OSM

$("#sidepanel-p2sm").append('<br><br>');
$("#sidepanel-p2sm").append(btn9); //VIAM
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn10); //HERE
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn13); //MAPPY

$("#sidepanel-p2sm").append('<br><br>');
$("#sidepanel-p2sm").append(btn18); //TOMTOM
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn15); //MSN
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn5); //Apple

$("#sidepanel-p2sm").append('<br><br>'); // ■■■■■ "GESCHWINDIGKEITEN / BILDER" ■■■■■
$("#sidepanel-p2sm").append(txtbtn3);
$("#sidepanel-p2sm").append(spacer);
$("#sidepanel-p2sm").append(btn11); //MAPILLARY
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn12); //OSBROWSER
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn21); //KARTAVIEW

$("#sidepanel-p2sm").append('<br><br>'); // ■■■■■ "GEOPORTALE" ■■■■■
$("#sidepanel-p2sm").append(txtbtn4);
$("#sidepanel-p2sm").append(spacer);
$("#sidepanel-p2sm").append(btn16); //GEOADMIN

$("#sidepanel-p2sm").append('<br><br>'); // ■■■■■ "Misc" ■■■■■
$("#sidepanel-p2sm").append(txtbtn5);
$("#sidepanel-p2sm").append(spacer);
$("#sidepanel-p2sm").append(btn20);
$("#sidepanel-p2sm").append('&nbsp;&nbsp;');
$("#sidepanel-p2sm").append(btn95);//REPORTING

$("#sidepanel-p2sm").append('<br><br>'); //SAFE SOURCES WARNING
$("#sidepanel-p2sm").append(safeSourcesText);
}

add_buttons();