// ==UserScript==
// @name        OSM Maximyzer
// @namespace   osmmaximyzer
// @description Displays the MAP on openstreetmap.de in full page size and hides the annoying layer selector.
// @include     https://www.openstreetmap.de/karte.html*
// @author      Evil.2000
// @version     0.9
// @run-at      document-idle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/401876/OSM%20Maximyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/401876/OSM%20Maximyzer.meta.js
// ==/UserScript==

/**
 * This little Tampermonkey script resizes the map on openstreetmap.de to full page size and
 * hides the annoying layer selector. It gives the possibility to inital set the coordinates
 * and zoom level by specifying it in the loction hash:
 * https://www.openstreetmap.de/karte.html#<Zoom>/<Latitute>/<Longitute>
 * Example for the center of Germany:
 * https://www.openstreetmap.de/karte.html#12/51.164305/10.4541205
 */

var $ = unsafeWindow.jQuery;
var s = `
div.olControlLayerSwitcher {

}

div.olControlPanZoomBar {
	margin-top: 20px;
}

#karte_nav {
	display: none;
}

#osm_logo_link {
	display: none;
}

#Route {
	display: none;
}

#editMap {
	display: none;
}

#errorMap {
	display: none;
}

#slider {
	width: 320px;
	position: fixed;
	top: 40px;
	height: 90% !important;
}

#search {
	position: fixed;
	top: 6px;
	z-index: 1;
	left: 6px;
	/*height: 90%;*/
}

#resultBox {
	position: relative;
	height: 100%;
	margin-left: auto;
}

#map {
	bottom: 0;
	left: 0;
	position: fixed;
	right: 0;
	top: 0;
}

#copyright {
	bottom: 0;
	right: 0;
	z-index: 1;
	position: absolute;
	margin-right: 90px;
}`;

$("head link[rel='stylesheet']").last().after('<style type="text/css">'+s+'</style>');

// Set the center of the map to coordinates and zoom level given by the location hash.
var initMoveMap = function() {
    var map = unsafeWindow.map
    var initZoomLatLong = unsafeWindow.location.hash.substring(1).split('/');
    var lon = parseFloat(initZoomLatLong[2]);
    var lat = parseFloat(initZoomLatLong[1]);
    var zom = parseFloat(initZoomLatLong[0]);
    map.setCenter(new unsafeWindow.OpenLayers.LonLat(lon,lat).transform(unsafeWindow.proj4326,unsafeWindow.projmerc),zom);

    map.events.register('move', null, function() {
        var lonlat = map.getCenter().clone().transform(unsafeWindow.projmerc, unsafeWindow.proj4326);
        unsafeWindow.location.hash = '#' + map.getZoom() + '/' + lonlat.lat.toFixed(5) + '/' + lonlat.lon.toFixed(5);
    });
}

// Wait until the map is loaded. Then do magic :-).
var t = setInterval(function(){
  try {
  	var ctrls = unsafeWindow.map.controls;
    if (ctrls.length == 0) return;
    for (let ctrl of ctrls) {
    	if(ctrl.displayClass == "olControlLayerSwitcher") {
        ctrl.minimizeControl();
        clearTimeout(t);
        unsafeWindow.map.removeLayer(unsafeWindow.groups);
      }
    }
    initMoveMap();
  } catch (e) {
    return;
  }
}, 100);
