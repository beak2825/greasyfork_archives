// ==UserScript==
// @name         WME Permalink para diversos Mapas 2
// @description Este script cria botões para abrir uma página no Google Maps/LiveMap/OSM, na mesma área visível do WME.
// @namespace	https://greasyfork.org/scripts/4373-wme-permalink-to-google-maps
// @version     0.0.1
// @include     https://*.waze.com/editor/*
// @include     https://*.waze.com/*/editor/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/14900/WME%20Permalink%20para%20diversos%20Mapas%202.user.js
// @updateURL https://update.greasyfork.org/scripts/14900/WME%20Permalink%20para%20diversos%20Mapas%202.meta.js
// ==/UserScript==

// Copiado do script original do AlexN-114 https://greasyfork.org/scripts/3080-wme-permalink-to-serveral-maps
// Mini howto:
// 1) install this script as greasemonkey script or chrome extension
// 2) Click on Google Maps Permalink on the sidebar
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
          document.body.removeChild(script);
        }, 0);
  })();

  // Stop running, because we know Greasemonkey actually runs us in
  // an anonymous wrapper.
  return;
}

function getQueryString(link, name)
{
    var pos = link.indexOf( name + '=' ) + name.length + 1;
    var len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return link.substr(pos,len);
}

var btn0 = $('<button>GMaps</button>');
btn0.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom'));

    zoom = zoom > 6 ? 19 : zoom + 12;
    var mapsUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z';
    window.open(mapsUrl,'_blank')
});

var btn1 = $('<button>OSM</button>');
btn1.click(function(){
	var href = $('.WazeControlPermalink a').attr('href');
	
	var lon = getQueryString(href, 'lon');
	var lat = getQueryString(href, 'lat');
	var zoom = parseInt(getQueryString(href, 'zoom'));
	
	zoom = zoom > 6 ? 19 : zoom + 12;		
	var mapsUrl = 'http://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
	//http://www.openstreetmap.org/#map=17/-27.80793/-50.30916
	//var mapsUrl = 'http://www.openstreetmap.org/?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom + '&layers=M';
	//var mapsUrl = 'http://osm.clapps.net/?ll=' + lat + ',' + lon + '&z=' + zoom;
	window.open(mapsUrl,'_blank')
});

var btn2 = $('<button>ß-Switch</button>');
btn2.click(function(){
    var mapsUrl;
    var href = $('.WazeControlPermalink a').attr('href');

    var beta = href.indexOf('editor-beta.waze.com');
    if (beta == -1){
      mapsUrl = href.replace('www.waze.com','editor-beta.waze.com');
    }
    else {
      mapsUrl = href.replace('editor-beta.waze.com','www.waze.com');
    }
    window.open(mapsUrl);
});

var btn3 = $('<button>LiveMap</button>');
btn3.click(function(){
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom'));

    zoom = zoom > 5 ? 17 : zoom + 12;
    var mapsUrl = 'https://www.waze.com/livemap?lon=' + lon + '&lat=' + lat + '&zoom=' + zoom;
    // https://www.waze.com/livemap?lon=-40.94918&lat=-18.56958&zoom=17
    window.open(mapsUrl,'_blank')
});

$("#sidebar").append(btn0);
$("#sidebar").append(btn1);
$("#sidebar").append(btn2);
$("#sidebar").append(btn3);
// $("#sidebar").append('<br><a href="http://userscripts.org:8080/scripts/show/175262" target="_blank">Permalink to several maps (original)</a>');