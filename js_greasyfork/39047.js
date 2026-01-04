var meta = function () {/*
// ==UserScript==
// @name                WME Route Speeds (2018 development)
// @description         Shows segment's speed in a route.
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @version             2018.02.04.001
// @grant               none
// @namespace           https://greasyfork.org/pl/scripts/
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js?version=229392
// @author              wlodek76 (forked by MapOMatic), further tweaks by tonestertm
// @copyright           2014, 2015 wlodek76
// @contributor         2014, 2015 FZ69617
// @downloadURL https://update.greasyfork.org/scripts/39047/WME%20Route%20Speeds%20%282018%20development%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39047/WME%20Route%20Speeds%20%282018%20development%29.meta.js
// ==/UserScript==
*/};

/*Version history:
 * 2018 Feb development
 *  - New: added support for vehicle types
 *  - ***experimental*** pass/permit support
 *  - removed deprecated shortest route option (no longer supported by routing server)
 *  - Detect Puerto Rico location
 *
 * 2017.12.09.001 (20171209)
 * - New: Added Avoid Ferries option (tonestertm)
 *   Fixed longstanding bug which never allowed U-turns
 *
 * 2017.11.15.001 (20171115)
 * - New: Added Avoid Difficult Turns option (tonestertm)
 * - New: Added a checkbox and functionality to place results in Livemap's natural sort order, to help with troubleshooting around penalties.
 *   Note that when Routing Order is checked, the Try More option is ignored, to better approximate Livemap results (tonestertm)
 *
 * 2017.11.10.001 (20171011)
 * - Changing to use WazeWrap.Interface.Tab to load the Route Speeds tab so it can recover from changing the map units (Imperial/Metric)
 *   and coming back from event mode
 *
 * 1.4.8-momfork (20170123)
 * - Updated formatting in options panel to fix checkbox alignment issues.
 *
 * 1.4.7-momfork (20170118)
 * - [FIXED] International translations set to english by default. Causing critical failures.
 *
 * 1.4.6-momfork (20170104)
 * - Restored original marker functionality (*HUGE* thanks to JustinS83 for doing ALL the work to figure out a workaround).
 *
 * 1.4.5-momfork (20161228)
 * - Fixed @include so script will work in WME Beta again.
 *
 * 1.4.4-momfork (20161228)
 * - This is a temporary fix to restore some basic functionality.  The original script may work again if Waze
 *   devs fix an issue on their end.  Had to remove markers for now.
 *
 *
 * 1.4.3 (20150505)
 * - script didn't work when only WME Route Speeds was installed (removed unnecessary unsafeWindow definition)
 *
 * 1.4.2 (20150424)
 * - Added: Paste LiveMap permalink into A/B marker input.
 * - Improved: 'Reset to Livemap Route' did not reset correctly when Shortest route was selected.
 * - Fixed: Layout of A-B button accordingly to browser's size.
 * - Fixed: Translation of internal AVOID_TRAILS option to Dirt roads.
 *
 * 1.4.1.1 (20150424)
 * - Improvement: Fixed options styling minor issues.
 * - Minor Fix: Drawing two-way traffic on segments with sharp angle
 *
 * 1.4.0 (20150424)
 * - New: Displaying traffic on two-way segments
 * - Improved: Faster display of recalculated routes
 * - Improved: First route is selected always by default
 * - Gui: Reorganize of options
 * - Fixed: Waiting for WME initialization
 * - Added: Option for ALLOW_UTURNS
 *
 * 1.3.0 (20150421)
 * - Fix: ALLOW UTURNS in routes
 *
 * 1.2.9.1 (20150419)
 * - Fix: Road Closures icons hides Route Speeds speed/time info
 *
 * 1.2.9 (20150114)
 * - New: Centering the map on the A/B markers.
 * - New: Routing options reset to the Livemap Route equivalents.
 * - New: Experimental "Fastest (no history)" route type option.
 *
 * 1.2.8.1 (20150102)
 * - Bug fix: Routing request options fixed.
 *
 * 1.2.8 (20150101)
 * - New: Added "Route type" routing option.
 * - New: Added "Try more" alternative routes option.
 * - Change: Controls' styling.
 * - Improvement: Route list sorting.
 * - Improvement: Route list selection can now be toggled.
 * - Improvement: Better handling of route request errors.
 * - Other: Minor code changes.
 *
 * 1.2.7.1 (20141211)
 * - Bug fix: Routing request options corrected.
 *
 * 1.2.7 (20141210)
 * - New: Added "Avoid toll roads" routing option.
 * - New: Added "Avoid freeways" routing option.
 * - New: Added "Allow dirt roads" routing option.
 * - Other: Minor code improvements.
 *
 * 1.2.6.1 (20141001)
 * - Fix for new WME by tkr85.
 */

var wmech_version = meta.toString().match(/@version\s+(\S+)/)[1];

var epsg900913 = new OL.Projection("EPSG:900913");
var epsg4326   = new OL.Projection("EPSG:4326");

var selected = 0;
var routewsp1 = [];
var routewsp2 = [];
var routewsp3 = [];
var routewsp4 = [];
var routewsp5 = [];
var routeodc1 = [];
var routeodc2 = [];
var routeodc3 = [];
var routeodc4 = [];
var routeodc5 = [];
var routewait = 0;
var routeSelected = 1;
var routeSelectedLast = 0;

var markerA;
var markerB;
var markerA_offset_click = [0, 0];
var markerB_offset_click = [0, 0];

var routespeedsoption1 = false;
var routespeedsoption2 = false;
var routespeedsoption3 = false;
var routespeedsoption4 = false;
var routespeedsoption5 = false;
var routespeedsoption6 = 3;
var routespeedsoption7 = true;
var routespeedsoption8 = false;
var routespeedsoption9 = false;
var routespeedsoption10 = false;
var routespeedsoption11 = false;
var routespeedsoption12 = false;
var routespeedsoption13 = 1;
var routespeedsoption14 = true;
var routespeedsoption15 = false; // Routing Order
var routespeedsoption16 = false; // Difficult Turns
var routespeedsoption17 = false; // Ferries
var routespeedsoption18 = 'PRIVATE'; // Vehicle Type
var routespeedsoption19 = 'None'; // Express Passes

var lastmapcenter = [0, 0];
var panningX = 0;
var panningY = 0;
var acceleration = 1.6;
var accelerationmin = 10;
var accelerationmax = 200;
var accelerationmargin = 30;
var accelerationbackstop = 3;

var koloractive = [
	"#808080",  // 0 km/h
	"#271308",  // 10 km/h
	"#813b27",  // 20 km/h
	"#e22700",  // 30 km/h
	"#ef7200",  // 40 km/h
	"#ffd307",  // 50 km/h
	"#6cf104",  // 60 km/h
	"#2fa035",  // 70 km/h
	"#0bbbe9",  // 80 km/h
	"#0f77e0",  // 90 km/h
	"#0346fc",  // 100 km/h
	"#3918d7",  // 110 km/h
	"#8c07f7",  // 120 km/h
	"#ea0ae7",  // 130 km/h
	"#b00094",  // 140 km/h
	"#670055"   // 200 km/h
];

var jqueryinfo = 0;
var tabswitched = 0;
var closurelayer = null;
var closurelayerZINDEX = [];
var leftHand = false;
var isHovRoute = false;
var isHovSegment = false;

//------------------------------------------------------------------------------------------------
function bootstrapWMERouteSpeeds()
{
	if(!window.W.map) {
		console.log('WME Route Speeds: Waiting for WME...');
		setTimeout(bootstrapWMERouteSpeeds, 1000);
		return;
	}

	setTimeout(initialiseWMERouteSpeeds, 1000);

	console.log("WME Route Speeds " + wmech_version + " loaded.");
}
//------------------------------------------------------------------------------------------------
function panningWMERouteSpeeds() {
	var WM = window.W.map;

	//var operationPending = W.vent._events.listeners.operationPending[0];
	//if (operationPending == undefined) return;
	//var pending = operationPending.obj.pending[0];

	//var lastcenterX = lastmapcenter[0];
	//var lastcenterY = lastmapcenter[1];
	//var centerX = WM.getCenter().lon;
	//var centerY = WM.getCenter().lat;

	//if (lastcenterX == 0) lastcenterX = centerX;
	//if (lastcenterY == 0) lastcenterY = centerY;

	//if ( lastcenterX==centerX && lastcenterY==centerY && pending == undefined ) {
		if (panningX || panningY) {
			var accelX =  panningX;
			var accelY =  panningY;

			if (accelX < 0) accelX = -Math.pow( Math.abs(accelX) , acceleration) - accelerationmin;
			if (accelX > 0) accelX =  Math.pow( Math.abs(accelX) , acceleration) + accelerationmin;

			if (accelY < 0) accelY = -Math.pow( Math.abs(accelY) , acceleration) - accelerationmin;
			if (accelY > 0) accelY =  Math.pow( Math.abs(accelY) , acceleration) + accelerationmin;

			if (accelX < -accelerationmax) accelX = -accelerationmax;
			if (accelY < -accelerationmax) accelY = -accelerationmax;
			if (accelX >  accelerationmax) accelX =  accelerationmax;
			if (accelY >  accelerationmax) accelY =  accelerationmax;

			WM.pan(accelX, accelY);
		}
	//}
}
//------------------------------------------------------------------------------------------------
function saveRouteSpeedsOptions() {

	var obj1  = getId('routespeeds-option1');
	var obj2  = getId('routespeeds-option2');
	var obj3  = getId('routespeeds-option3');
	var obj4  = getId('routespeeds-option4');
	var obj5  = getId('routespeeds-option5');
	var obj6  = getId('routespeeds-option6');
	var obj7  = getId('routespeeds-option7');
	var obj8  = getId('routespeeds-option8');
	var obj9  = getId('routespeeds-option9');
	var obj10 = getId('routespeeds-option10');
	var obj11 = getId('routespeeds-option11');
	var obj12 = getId('routespeeds-option12');
	var obj13 = getId('routespeeds-option13');
	var obj14 = getId('routespeeds-option14');
    var obj15 = getId('routespeeds-option15');
    var obj16 = getId('routespeeds-option16');
	var obj17 = getId('routespeeds-option17');
	var obj18 = getId('routespeeds-option18');
	var obj19 = getId('routespeeds-option19');

	if (obj1 !== undefined) {
		localStorage.setItem("RouteSpeedsOption1",  obj1.checked);
		localStorage.setItem("RouteSpeedsOption2",  obj2.checked);
		localStorage.setItem("RouteSpeedsOption3",  obj3.checked);
		localStorage.setItem("RouteSpeedsOption4",  obj4.checked);
		localStorage.setItem("RouteSpeedsOption5",  obj5.checked);
		localStorage.setItem("RouteSpeedsOption6",  obj6.value);
		localStorage.setItem("RouteSpeedsOption7",  obj7.checked);
		localStorage.setItem("RouteSpeedsOption8",  obj8.checked);
		localStorage.setItem("RouteSpeedsOption9",  obj9.checked);
		localStorage.setItem("RouteSpeedsOption10", obj10.checked);
		localStorage.setItem("RouteSpeedsOption11", obj11.checked);
		localStorage.setItem("RouteSpeedsOption12", obj12.checked);
		localStorage.setItem("RouteSpeedsOption13", obj13.value);
		localStorage.setItem("RouteSpeedsOption14", true);  // ALLOW_UTURNS is by default always true
        localStorage.setItem("RouteSpeedsOption15", obj15.checked);
        localStorage.setItem("RouteSpeedsOption16", obj16.checked);
		localStorage.setItem("RouteSpeedsOption17", obj17.checked);
		localStorage.setItem("RouteSpeedsOption18", obj18.value);
		localStorage.setItem("RouteSpeedsOption19", obj19.value);
	}
}
//---------------------------------------------------------------------------------------
function loadRouteSpeedsOptions() {

	if (localStorage.RouteSpeedsOption1)  routespeedsoption1  = (localStorage.RouteSpeedsOption1  == "true");
	if (localStorage.RouteSpeedsOption2)  routespeedsoption2  = (localStorage.RouteSpeedsOption2  == "true");
	if (localStorage.RouteSpeedsOption3)  routespeedsoption3  = (localStorage.RouteSpeedsOption3  == "true");
	if (localStorage.RouteSpeedsOption4)  routespeedsoption4  = (localStorage.RouteSpeedsOption4  == "true");
	if (localStorage.RouteSpeedsOption5)  routespeedsoption5  = (localStorage.RouteSpeedsOption5  == "true");
	if (localStorage.RouteSpeedsOption6)  routespeedsoption6  = (localStorage.RouteSpeedsOption6);
	if (localStorage.RouteSpeedsOption7)  routespeedsoption7  = (localStorage.RouteSpeedsOption7  == "true");
	if (localStorage.RouteSpeedsOption8)  routespeedsoption8  = (localStorage.RouteSpeedsOption8  == "true");
	if (localStorage.RouteSpeedsOption9)  routespeedsoption9  = (localStorage.RouteSpeedsOption9  == "true");
	if (localStorage.RouteSpeedsOption10) routespeedsoption10 = (localStorage.RouteSpeedsOption10 == "true");
	if (localStorage.RouteSpeedsOption11) routespeedsoption11 = (localStorage.RouteSpeedsOption11 == "true");
	if (localStorage.RouteSpeedsOption12) routespeedsoption12 = (localStorage.RouteSpeedsOption12 == "true");
	if (localStorage.RouteSpeedsOption13) routespeedsoption13 = (localStorage.RouteSpeedsOption13);
	if (localStorage.RouteSpeedsOption14) routespeedsoption14 = (localStorage.RouteSpeedsOption14 == "true");
    if (localStorage.RouteSpeedsOption15) routespeedsoption15 = (localStorage.RouteSpeedsOption15 == "true");
    if (localStorage.RouteSpeedsOption16) routespeedsoption16 = (localStorage.RouteSpeedsOption16 == "true");
	if (localStorage.RouteSpeedsOption17) routespeedsoption17 = (localStorage.RouteSpeedsOption17 == "true");
	if (localStorage.RouteSpeedsOption18) routespeedsoption18 = (localStorage.RouteSpeedsOption18);
    if (localStorage.RouteSpeedsOption19) routespeedsoption19 = (localStorage.RouteSpeedsOption19);


	getId('routespeeds-option1').checked  = routespeedsoption1;
	getId('routespeeds-option2').checked  = routespeedsoption2;
	getId('routespeeds-option3').checked  = routespeedsoption3;
	getId('routespeeds-option4').checked  = routespeedsoption4;
	getId('routespeeds-option5').checked  = routespeedsoption5;
	getId('routespeeds-option6').value    = routespeedsoption6;
	getId('routespeeds-option7').checked  = routespeedsoption7;
	getId('routespeeds-option8').checked  = routespeedsoption8;
	getId('routespeeds-option9').checked  = routespeedsoption9;
	getId('routespeeds-option10').checked = routespeedsoption10;
	getId('routespeeds-option11').checked = routespeedsoption11;
	getId('routespeeds-option12').checked = routespeedsoption12;
	getId('routespeeds-option13').value   = routespeedsoption13;
	getId('routespeeds-option14').checked = routespeedsoption14;
    getId('routespeeds-option15').checked = routespeedsoption15;
    getId('routespeeds-option16').checked = routespeedsoption16;
	getId('routespeeds-option17').checked = routespeedsoption17;
	getId('routespeeds-option18').value   = routespeedsoption18;
	getId('routespeeds-option19').value   = routespeedsoption19;

	update_adv_switches();
}
//---------------------------------------------------------------------------------------
function update_adv_switches() {

	getId('routespeeds-option5-span').style.display = routespeedsoption5 ? 'inline' : 'none';
//    getId('routespeeds-option5-span').style.display = routespeedsoption15 ? 'none' : 'inline';  // FIXIT
	getId('routespeeds-option10-span').style.display = routespeedsoption10 ? 'inline' : 'inline';
}
//---------------------------------------------------------------------------------------
function getRoutingManager() {
	if (W.model.countries.get(235) || W.model.countries.get(40) || W.model.countries.get(182)) { // US, Canada, & PR
		return '/RoutingManager/routingRequest';
	} else if (W.model.countries.get(106)) { // Israel
		return '/il-RoutingManager/routingRequest';
	} else {
		return '/row-RoutingManager/routingRequest';
	}
}
//------------------------------------------------------------------------------------------------
function getSegmentMidPoint(seg, end) {

	var points, p1, p2, dx, dy, x, y;
	points = seg.geometry.components.length;

	if (points == 2) {
		p1 = seg.geometry.components[0];
		p2 = seg.geometry.components[1];

		x = p1.x + (p2.x - p1.x) * 0.5;
		y = p1.y + (p2.y - p1.y) * 0.5;
		return OL.Layer.SphericalMercator.inverseMercator(x, y);
	}

	var length = 0;
	for(var i=0; i<points-1; i++) {
		p1 = seg.geometry.components[i + 0];
		p2 = seg.geometry.components[i + 1];
		dx = p2.x - p1.x;
		dy = p2.y - p1.y;
		length += Math.sqrt(dx*dx + dy*dy);
	}
	var midlen = length / 2.0;

	var length1 = 0;
	var length2 = 0;
	for(i=0; i<points-1; i++) {
		p1 = seg.geometry.components[i + 0];
		p2 = seg.geometry.components[i + 1];
		dx = p2.x - p1.x;
		dy = p2.y - p1.y;
		length1 = length2;
		length2 = length2 + Math.sqrt(dx*dx + dy*dy);

		if (midlen >= length1 && midlen < length2) {
			var proc = (midlen - length1) / (length2 - length1);
			x = p1.x + (p2.x - p1.x) * proc;
			y = p1.y + (p2.y - p1.y) * proc;
			return OL.Layer.SphericalMercator.inverseMercator(x, y);
		}
	}

	if (end === 0) {
		p1 = seg.geometry.components[0];
		p2 = seg.geometry.components[1];
	}
	else {
		p1 = seg.geometry.components[points - 2];
		p2 = seg.geometry.components[points - 1];
	}

	x = p1.x + (p2.x - p1.x) * 0.5;
	y = p1.y + (p2.y - p1.y) * 0.5;
	return OL.Layer.SphericalMercator.inverseMercator(x, y);
}
//------------------------------------------------------------------------------------------------
function getColor(speed) {
	if (speed === 0)  return koloractive[0];
	var k = parseInt(speed / 10.0) + 1;
	if (k > 15) k = 15;
	return koloractive[k];
}
//------------------------------------------------------------------------------------------------
function addLabel(lines, speedtekst, routespeedsoption2, odctime, odclen, routespeedsoption4, id) {

	var speed = parseInt(speedtekst);

	var kolor1 = '#F0F0F0';
	var kolor2 = '#000000';
    var p1, p2, pt, textFeature, k, sx, sy;
	if (speed >= 40 && speed < 50) { kolor1 = '#404040'; kolor2 = '#FFFFFF'; }
	if (speed >= 50 && speed < 60) { kolor1 = '#404040'; kolor2 = '#FFFFFF'; }

	if (routespeedsoption4) speedtekst = parseInt(speedtekst / 1.609 + 0.5);
	if (speedtekst === 0) speedtekst = "?";

	var numlines = lines.length;
	if (numlines >= 2) {
        var line;
		var ps = parseInt(numlines) >> 1;
		p1 = lines[ps].components[0];
		p2 = lines[ps].components[1];
		var proc = 0.5;

		var dist = [];
		var dsum = 0;
		for(k=0; k<numlines; k++) {
			line = lines[k];
			var d = line.getGeodesicLength( epsg900913 );
			dsum += d;
			dist.push(d);
		}
		var dmid = dsum / 2.0;
		var d1 = 0;
		var d2 = 0;
		for(k=0; k<numlines; k++) {
			line = lines[k];
			d1  = d2;
			d2 += dist[k];
			if (dmid >= d1 && dmid < d2) {
				p1 = lines[k].components[0];
				p2 = lines[k].components[1];
				proc = (dmid - d1) / (d2 - d1);
			}
		}

		sx = p1.x + (p2.x - p1.x) * proc;
		sy = p1.y + (p2.y - p1.y) * proc;

		if (routespeedsoption2) speedtekst = odctime + "s ";
        if (routespeedsoption19 && isHovSegment) speedtekst = '\u25ca ' + speedtekst;

		pt = new OL.Geometry.Point(sx, sy);
		textFeature = new OL.Feature.Vector( pt, {labelText: speedtekst, fontColor: kolor1, pointRadius: 0 } );
		return textFeature;
	}
	else if (numlines==1) {
		p1 = lines[0].components[0];
		p2 = lines[0].components[1];

		sx = (p1.x + p2.x) * 0.5;
		sy = (p1.y + p2.y) * 0.5;

		if (routespeedsoption2) speedtekst = odctime + "s ";
        if (routespeedsoption19 && isHovSegment) speedtekst = '\u25ca ' + speedtekst;

		pt = new OL.Geometry.Point(sx, sy);
		textFeature = new OL.Feature.Vector( pt, {labelText: speedtekst, fontColor: kolor1, pointRadius: 0 } );
		return textFeature;
	}
	else return null;
}
//------------------------------------------------------------------------------------------------
function panmap(draggingobj, x, y)
{
	var maxX  = draggingobj.map.viewPortDiv.clientWidth;
	var maxY  = draggingobj.map.viewPortDiv.clientHeight;
	var lastx = draggingobj.last.x;
	var lasty = draggingobj.last.y;
	var mx = x - lastx;
	var my = y - lasty;

	if (x < accelerationmargin) {
		if (mx < 0)                     panningX = x - accelerationmargin;
		if (mx > accelerationbackstop)  panningX = 0;
	}
	else if (x > maxX-accelerationmargin) {
		if (mx > 0)                     panningX = x - (maxX-accelerationmargin);
		if (mx < -accelerationbackstop) panningX = 0;
	}
		else panningX = 0;

	if (y < accelerationmargin) {
		if (my < 0)                     panningY = y - (accelerationmargin);
		if (my > accelerationbackstop)  panningY = 0;
	}
	else if (y > maxY-accelerationmargin-25) {
		if (my > 0)                     panningY = y - (maxY-accelerationmargin-25);
		if (my < -accelerationbackstop) panningY = 0;
	}
		else panningY = 0;
}
//------------------------------------------------------------------------------------------------
function createMarkers(lon1, lat1, lon2, lat2, disp) {

	var WM = window.W.map;
	var OL = window.OL;

	var mlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeedsMarkers");
	var markerLayer = mlayers[0];
    var p1, p2, lonlat;

	if (markerA === undefined && markerB === undefined) {
		var di = WazeWrap.Require.DivIcon;
		var iconA = new di("routespeedsmarkerA");
		var iconB = new di("routespeedsmarkerB");

		p1 = new OL.Geometry.Point(lon1, lat1).transform(epsg4326, epsg900913);
		p2 = new OL.Geometry.Point(lon2, lat2).transform(epsg4326, epsg900913);

		var lonlatA = new OL.LonLat( p1.x, p1.y );
		var lonlatB = new OL.LonLat( p2.x, p2.y );

		markerA = new OL.Marker(lonlatA, iconA );
		markerB = new OL.Marker(lonlatB, iconB );

		var wh = WazeWrap.Require.DragElement();//require("Waze/Handler/DragElement");
		markerA.dragging = new wh(WM);
		markerB.dragging = new wh(WM);

		markerA.dragging.down = function(e) {
			lonlat = this.map.getLonLatFromViewPortPx(e.xy);
			if (lonlat === null) return;
			markerA_offset_click[0] = markerA.lonlat.lon - lonlat.lon;
			markerA_offset_click[1] = markerA.lonlat.lat - lonlat.lat;
		};
		markerB.dragging.down = function(e) {
			lonlat = this.map.getLonLatFromViewPortPx(e.xy);
			if (lonlat === null) return;
			markerB_offset_click[0] = markerB.lonlat.lon - lonlat.lon;
			markerB_offset_click[1] = markerB.lonlat.lat - lonlat.lat;
		};

		markerA.dragging.move = function(e) {
			lonlat = this.map.getLonLatFromViewPortPx(e.xy);
			markerA.lonlat.lon = lonlat.lon + markerA_offset_click[0];
			markerA.lonlat.lat = lonlat.lat + markerA_offset_click[1];
			markerLayer.drawMarker(markerA);
			panmap(this, e.xy.x, e.xy.y);
		};
		markerB.dragging.move = function(e) {
			lonlat = this.map.getLonLatFromViewPortPx(e.xy);
			markerB.lonlat.lon = lonlat.lon + markerB_offset_click[0];
			markerB.lonlat.lat = lonlat.lat + markerB_offset_click[1];
			markerLayer.drawMarker(markerB);
			panmap(this, e.xy.x, e.xy.y);
		};

		markerA.dragging.done = function(e) {

			if (routespeedsoption1) return;

			panningX = 0;
			panningY = 0;

			var lonlatA = new OL.LonLat( markerA.lonlat.lon, markerA.lonlat.lat ).transform(epsg900913, epsg4326);
			var lonlatB = new OL.LonLat( markerB.lonlat.lon, markerB.lonlat.lat ).transform(epsg900913, epsg4326);

			lon1 = parseInt(lonlatA.lon * 1000000.0 + 0.5) / 1000000.0;
			lat1 = parseInt(lonlatA.lat * 1000000.0 + 0.5) / 1000000.0;
			lon2 = parseInt(lonlatB.lon * 1000000.0 + 0.5) / 1000000.0;
			lat2 = parseInt(lonlatB.lat * 1000000.0 + 0.5) / 1000000.0;

			if (getId('sidepanel-routespeeds-a') !== undefined) {
				getId('sidepanel-routespeeds-a').value = lon1 + ", " + lat1;
				getId('sidepanel-routespeeds-b').value = lon2 + ", " + lat2;
			}

			var objprog1 = getId('routespeeds-button-livemap');
			if (objprog1.style.backgroundColor === '') objprog1.style.backgroundColor = '#FF8000';

			requestRouteFromLiveMap(lon1, lat1, lon2, lat2);
		};
		markerB.dragging.done = function(e) {

			if (routespeedsoption1) return;

			panningX = 0;
			panningY = 0;

			var lonlatA = new OL.LonLat( markerA.lonlat.lon, markerA.lonlat.lat ).transform(epsg900913, epsg4326);
			var lonlatB = new OL.LonLat( markerB.lonlat.lon, markerB.lonlat.lat ).transform(epsg900913, epsg4326);

			lon1 = parseInt(lonlatA.lon * 1000000.0 + 0.5) / 1000000.0;
			lat1 = parseInt(lonlatA.lat * 1000000.0 + 0.5) / 1000000.0;
			lon2 = parseInt(lonlatB.lon * 1000000.0 + 0.5) / 1000000.0;
			lat2 = parseInt(lonlatB.lat * 1000000.0 + 0.5) / 1000000.0;

			if (getId('sidepanel-routespeeds-a') !== undefined) {
				getId('sidepanel-routespeeds-a').value = lon1 + ", " + lat1;
				getId('sidepanel-routespeeds-b').value = lon2 + ", " + lat2;
			}

			var objprog1 = getId('routespeeds-button-livemap');
			if (objprog1.style.backgroundColor === '') objprog1.style.backgroundColor = '#FF8000';

			requestRouteFromLiveMap(lon1, lat1, lon2, lat2);
		};

		markerA.dragging.activate(iconA.$div);
		markerB.dragging.activate(iconB.$div);

		markerA.display(disp);
		markerB.display(disp);

		markerLayer.addMarker(markerA);
		markerLayer.addMarker(markerB);
	}
	else {
		p1 = new OL.Geometry.Point(lon1, lat1).transform(epsg4326, epsg900913);
		p2 = new OL.Geometry.Point(lon2, lat2).transform(epsg4326, epsg900913);

		markerA.lonlat.lon = p1.x;
		markerA.lonlat.lat = p1.y;
		markerB.lonlat.lon = p2.x;
		markerB.lonlat.lat = p2.y;

		markerA.display(disp);
		markerB.display(disp);

		markerLayer.drawMarker(markerA);
		markerLayer.drawMarker(markerB);
	}

	markerA.created = disp;
	markerB.created = disp;
}
//------------------------------------------------------------------------------------------------
function showLayers(disp)
{
	var WM = window.W.map;

	var rlayers1 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
	var rlayers2 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds2");
	var rlayers3 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds3");
	var rlayers4 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds4");
	var rlayers5 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds5");
	var routeLayer1 = rlayers1[0];
	var routeLayer2 = rlayers2[0];
	var routeLayer3 = rlayers3[0];
	var routeLayer4 = rlayers4[0];
	var routeLayer5 = rlayers5[0];

	if (routeLayer1 === undefined) return;
	if (routeLayer2 === undefined) return;
	if (routeLayer3 === undefined) return;
	if (routeLayer4 === undefined) return;
	if (routeLayer5 === undefined) return;

	routeLayer1.setVisibility(disp);
	routeLayer2.setVisibility(disp);
	routeLayer3.setVisibility(disp);
	routeLayer4.setVisibility(disp);
	routeLayer5.setVisibility(disp);
}
//--------------------------------------------------------------------------------------------------------
function showMarkers(disp)
{
	var WM = window.W.map;

	var mlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeedsMarkers");
	var markerLayer = mlayers[0];

	if (markerLayer === undefined) return false;
	if (markerA === undefined) return false;
	if (markerB === undefined) return false;

	if (markerA.created) markerA.display(disp);
	if (markerB.created) markerB.display(disp);

	return (markerA.created && markerB.created);
}
//------------------------------------------------------------------------------------------------
function reverseMarkers()
{
	var WM = window.W.map;

	var mlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeedsMarkers");
	var markerLayer = mlayers[0];

	if (markerLayer === undefined) return;
	if (markerA === undefined || !markerA.created) return;
	if (markerB === undefined || !markerB.created) return;

	var copy = markerA.lonlat;
	markerA.lonlat = markerB.lonlat;
	markerB.lonlat = copy;

	markerLayer.drawMarker(markerA);
	markerLayer.drawMarker(markerB);
}
//------------------------------------------------------------------------------------------------
function loopWMERouteSpeeds() {

	if (routespeedsoption1) return;

	var tabOpen = $('#user-tabs > .nav-tabs > li > a[href="#sidepanel-routespeeds"]').attr('aria-expanded') == "true";
	if (!tabOpen) {
		if (tabswitched !== 1) {
			tabswitched = 1;
			showLayers(false);
			showMarkers(false);
			showClosures(0);
		}
		return;
	}
	else {
		if (tabswitched !== 2) {
			tabswitched = 2;
			showLayers(true);
			showMarkers(true);
			showClosures(1);
		}
	}

	//var routespeedsbutton = getId('routespeeds-button-livemap');
	//if (routespeedsbutton == 'undefined') return;
	//var routespeedsbutton_ofsW = routespeedsbutton.offsetWidth;
	//var routespeedsbutton_ofsH = routespeedsbutton.offsetHeight;
	//console.log(routespeedsbutton_ofsW, routespeedsbutton_ofsH);
	//if (routespeedsbutton_ofsW == 0 || routespeedsbutton_ofsH==0) return;


	var WM = window.W.map;
	var OL = window.OL;

	var rlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
	if(rlayers.length === 0) {

		var drc_style1 = new OL.Style({
			strokeDashstyle: 'solid',
			strokeColor : "${strokeColor}",
			strokeOpacity: 1.0,
			strokeWidth: "${strokeWidth}",
			fillColor: '#0040FF',
			fillOpacity: 1.0,
			pointRadius: "${pointRadius}",
			label : "${labelText}",
			fontFamily: "Tahoma, Courier New",
			labelOutlineColor: '#FFFFFF',
			labelOutlineWidth: 0,
			fontColor: "${fontColor}",
			fontOpacity: 1.0,
			fontSize: "10px",
			display: 'block'
		});

		var drc_style2 = new OL.Style({
			strokeDashstyle: 'solid',
			strokeColor : "${strokeColor}",
			strokeOpacity: 1.0,
			strokeWidth: "${strokeWidth}",
			fillColor: '#0040FF',
			fillOpacity: 1.0,
			pointRadius: "${pointRadius}",
			label : "${labelText}",
			fontFamily: "Tahoma, Courier New",
			labelOutlineColor: '#FFFFFF',
			labelOutlineWidth: 0,
			fontColor: "${fontColor}",
			fontOpacity: 1.0,
			fontSize: "10px",
			display: 'block'
		});

		var drc_style3 = new OL.Style({
			strokeDashstyle: 'solid',
			strokeColor : "${strokeColor}",
			strokeOpacity: 1.0,
			strokeWidth: "${strokeWidth}",
			fillColor: '#0040FF',
			fillOpacity: 1.0,
			pointRadius: "${pointRadius}",
			label : "${labelText}",
			fontFamily: "Tahoma, Courier New",
			labelOutlineColor: '#FFFFFF',
			labelOutlineWidth: 0,
			fontColor: "${fontColor}",
			fontOpacity: 1.0,
			fontSize: "10px",
			display: 'block'
		});

		var drc_style4 = new OL.Style({
			strokeDashstyle: 'solid',
			strokeColor : "${strokeColor}",
			strokeOpacity: 1.0,
			strokeWidth: "${strokeWidth}",
			fillColor: '#0040FF',
			fillOpacity: 1.0,
			pointRadius: "${pointRadius}",
			label : "${labelText}",
			fontFamily: "Tahoma, Courier New",
			labelOutlineColor: '#FFFFFF',
			labelOutlineWidth: 0,
			fontColor: "${fontColor}",
			fontOpacity: 1.0,
			fontSize: "10px",
			display: 'block'
		});

		var drc_style5 = new OL.Style({
			strokeDashstyle: 'solid',
			strokeColor : "${strokeColor}",
			strokeOpacity: 1.0,
			strokeWidth: "${strokeWidth}",
			fillColor: '#0040FF',
			fillOpacity: 1.0,
			pointRadius: "${pointRadius}",
			label : "${labelText}",
			fontFamily: "Tahoma, Courier New",
			labelOutlineColor: '#FFFFFF',
			labelOutlineWidth: 0,
			fontColor: "${fontColor}",
			fontOpacity: 1.0,
			fontSize: "10px",
			display: 'block'
		});

		var drc_mapLayer1 = new OL.Layer.Vector("Route Speeds", {
			displayInLayerSwitcher: true,
			uniqueName: "__DrawRouteSpeeds1",
			styleMap: new OL.StyleMap(drc_style1)
		});

		var drc_mapLayer2 = new OL.Layer.Vector("Route Speeds 2", {
			displayInLayerSwitcher: false,
			uniqueName: "__DrawRouteSpeeds2",
			styleMap: new OL.StyleMap(drc_style2)
		});

		var drc_mapLayer3 = new OL.Layer.Vector("Route Speeds 3", {
			displayInLayerSwitcher: false,
			uniqueName: "__DrawRouteSpeeds3",
			styleMap: new OL.StyleMap(drc_style3)
		});

		var drc_mapLayer4 = new OL.Layer.Vector("Route Speeds 4", {
			displayInLayerSwitcher: false,
			uniqueName: "__DrawRouteSpeeds4",
			styleMap: new OL.StyleMap(drc_style4)
		});

		var drc_mapLayer5 = new OL.Layer.Vector("Route Speeds 5", {
			displayInLayerSwitcher: false,
			uniqueName: "__DrawRouteSpeeds5",
			styleMap: new OL.StyleMap(drc_style5)
		});

		I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeeds1"] = "Route Speeds";
		I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeeds2"] = "Route Speeds 2";
		I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeeds3"] = "Route Speeds 3";
		I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeeds4"] = "Route Speeds 4";
		I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeeds5"] = "Route Speeds 5";

		drc_mapLayer1.setVisibility(true);
		drc_mapLayer2.setVisibility(true);
		drc_mapLayer3.setVisibility(true);
		drc_mapLayer4.setVisibility(true);
		drc_mapLayer5.setVisibility(true);

		WM.addLayer(drc_mapLayer1);
		WM.addLayer(drc_mapLayer2);
		WM.addLayer(drc_mapLayer3);
		WM.addLayer(drc_mapLayer4);
		WM.addLayer(drc_mapLayer5);

		return;
	}

	var mlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeedsMarkers");
	if (mlayers.length === 0) {

		var drc_mapLayer = new OL.Layer.Markers("Route Speeds Markers", {
			displayInLayerSwitcher: false,
			uniqueName: "__DrawRouteSpeedsMarkers"
		});

		I18n.translations[I18n.currentLocale()].layers.name["__DrawRouteSpeedsMarkers"] = "Route Speeds Markers";
		WM.addLayer(drc_mapLayer);
		drc_mapLayer.setVisibility(true);

		createMarkers(16, 52, 17, 53, false);

		return;
	}

	if (jqueryinfo === 1) {
		jqueryinfo = 2;
		console.log('WME Route Speeds: jQuery reloaded ver. ' + jQuery.fn.jquery);
	}
	if (jqueryinfo === 0) {
		if (typeof jQuery === 'undefined') {
			console.log('WME Route Speeds: jQuery current ver. ' + jQuery.fn.jquery);

			var script   = document.createElement('script');
			script.type  = "text/javascript";
			script.src   = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
			//script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js";
			document.getElementsByTagName('head')[0].appendChild(script);
			jqueryinfo = 1;
		}
	}


	var rlayers1 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
	var rlayers2 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds2");
	var rlayers3 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds3");
	var rlayers4 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds4");
	var rlayers5 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds5");
	var routeLayer1 = rlayers1[0];
	var routeLayer2 = rlayers2[0];
	var routeLayer3 = rlayers3[0];
	var routeLayer4 = rlayers4[0];
	var routeLayer5 = rlayers5[0];
	if (routeLayer1 === undefined) return;
	if (routeLayer2 === undefined) return;
	if (routeLayer3 === undefined) return;
	if (routeLayer4 === undefined) return;
	if (routeLayer5 === undefined) return;

	if (routeLayer1.getVisibility() === false) {
		if (routeLayer2.getVisibility() === true) {
			routeLayer2.setVisibility(false);
			routeLayer3.setVisibility(false);
			routeLayer4.setVisibility(false);
			routeLayer5.setVisibility(false);
		}
	}
	else {
		if (routeLayer2.getVisibility() === false) {
			routeLayer2.setVisibility(true);
			routeLayer3.setVisibility(true);
			routeLayer4.setVisibility(true);
			routeLayer5.setVisibility(true);
		}
	}

	var numSelected = Waze.selectionManager.selectedItems.length;
	var seg1 = Waze.selectionManager.selectedItems[0];
	var seg2 = Waze.selectionManager.selectedItems[1];

	if (seg1 !== undefined && seg2 !== undefined) {
		if (!selected) {
			selected = 1;

			var coords1 = getSegmentMidPoint(seg1, 0);
			var coords2 = getSegmentMidPoint(seg2, 1);

			var lon1 = parseInt(coords1.lon * 1000000.0 + 0.5) / 1000000.0;
			var lat1 = parseInt(coords1.lat * 1000000.0 + 0.5) / 1000000.0;
			var lon2 = parseInt(coords2.lon * 1000000.0 + 0.5) / 1000000.0;
			var lat2 = parseInt(coords2.lat * 1000000.0 + 0.5) / 1000000.0;

			if (getId('sidepanel-routespeeds-a') !== undefined) {
				getId('sidepanel-routespeeds-a').value = lon1 + ", " + lat1;
				getId('sidepanel-routespeeds-b').value = lon2 + ", " + lat2;
			}

			createMarkers(lon1, lat1, lon2, lat2, true);

			leftHand = false;
			if (seg1.model.model.isLeftHand) leftHand = true;
			if (seg2.model.model.isLeftHand) leftHand = true;

			requestRouteFromLiveMap(lon1, lat1, lon2, lat2);
		}
	}
	else {
		if (seg1 !== undefined || seg2 !== undefined) {
			if (selected) {
				selected = 0;

				routeLayer1.removeAllFeatures();
				routeLayer2.removeAllFeatures();
				routeLayer3.removeAllFeatures();
				routeLayer4.removeAllFeatures();
				routeLayer5.removeAllFeatures();

				getId('routespeeds-summary1').style.visibility = 'hidden';
				getId('routespeeds-summary2').style.visibility = 'hidden';
				getId('routespeeds-summary3').style.visibility = 'hidden';
				getId('routespeeds-summary4').style.visibility = 'hidden';
				getId('routespeeds-summary5').style.visibility = 'hidden';

				getId('routespeeds-summary1').className = 'routespeeds_summary_classA';
				getId('routespeeds-summary2').className = 'routespeeds_summary_classA';
				getId('routespeeds-summary3').className = 'routespeeds_summary_classA';
				getId('routespeeds-summary4').className = 'routespeeds_summary_classA';
				getId('routespeeds-summary5').className = 'routespeeds_summary_classA';
			}
		}
	}
}
//--------------------------------------------------------------------------------------------------------
function createRouteFeatures(id, routewsp, routeodc) {

	var WM = window.W.map;
	var OL = window.OL;

	var layers;
	if (id==1) rlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
	if (id==2) rlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeeds2");
	if (id==3) rlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeeds3");
	if (id==4) rlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeeds4");
	if (id==5) rlayers = WM.getLayersBy("uniqueName","__DrawRouteSpeeds5");
	var routeLayer = rlayers[0];
	if (routeLayer === undefined) return;

	var lineFeatures  = [];
	var labelFeatures = [];
	var lines = [];
	var outlinepoints = [];

	var odc = 0;
	var odclen  = routeodc[odc].length;
	var odctime = 0;
	if (routespeedsoption7) odctime = routeodc[odc].crossTime;
	else                    odctime = routeodc[odc].crossTimeWithoutRealTime;
	var odcx = 0;
	var odcy = 0;
	if (odc + 1 < routeodc.length) {
		odcx    = routeodc[odc + 1].path.x;
		odcy    = routeodc[odc + 1].path.y;
	}

	var speed = 0;
	if (odctime > 0) speed = 3.6 * odclen / odctime;
	var speedtekst = parseInt(speed);
	var kolor   = getColor(speed);

	var ptA = new OL.Geometry.Point(0, 0);
	var ptB = new OL.Geometry.Point(0, 0);

	var doubletraffic = false;
	var p1 = null;
	var p2 = null;
	var doublepoints = {};
    var wsp1, wsp2, dlon, dlat, dx, dy, label, len, i;


	//wykrycie czy trasa przechodzi dwa razy przez te same punkty, jeżeli tak to rysowanie trasy z odstępem, aby był widoczny przebieg trasy
	for(i=0; i<routewsp.length-1; i++) {
		wsp1 = routewsp[i + 0];
		wsp2 = routewsp[i + 1];

		dlon = Math.abs(wsp1.x - wsp2.x);
		dlat = Math.abs(wsp1.y - wsp2.y);

		if (dlon < 0.0000001 && dlat < 0.0000001) continue;

		var s1 = parseInt(wsp1.x * 10000000 + 0.5) + ',' + parseInt(wsp1.y * 10000000 + 0.5);
		var s2 = parseInt(wsp2.x * 10000000 + 0.5) + ',' + parseInt(wsp2.y * 10000000 + 0.5);

		if (s1 === s2) continue;

		if (doublepoints[s1] === undefined) doublepoints[s1] = 0;
		if (doublepoints[s2] === undefined) doublepoints[s2] = 0;
		doublepoints[s1]++;
		doublepoints[s2]++;

		if (doublepoints[s2] >= 2) {
			doubletraffic = true;
			break;
		}
	}

	var doubletrafficoffset = 0;
	if (doubletraffic) {
		doubletrafficoffset = 11 * Math.pow(2.0, 5-W.map.zoom);
	}


	for(i=0; i<routewsp.length-1; i++) {
		wsp1 = routewsp[i + 0];
		wsp2 = routewsp[i + 1];

		if (i === 0) {
			ptA.x = wsp1.x;
			ptA.y = wsp1.y;
			ptA = ptA.transform(epsg4326, epsg900913);
			//var p = new drc_OL.Geometry.Point(wsp1.x, wsp1.y).transform(epsg4326, epsg900913);
			//var pt = new drc_OL.Geometry.Point(p.x, p.y);
			//var textFeature = new drc_OL.Feature.Vector( ptA, {labelText: "A", pointRadius: 8, fontColor: '#FFFFFF' } );
			//labelFeatures.push(textFeature);
		}
		if (i === routewsp.length-2) {
			ptB.x = wsp2.x;
			ptB.y = wsp2.y;
			ptB = ptB.transform(epsg4326, epsg900913);
			//var p = new drc_OL.Geometry.Point(wsp2.x, wsp2.y).transform(epsg4326, epsg900913);
			//var pt = new drc_OL.Geometry.Point(p.x, p.y);
			//var textFeature = new drc_OL.Feature.Vector( ptB, {labelText: "B", pointRadius: 8, fontColor: '#FFFFFF' } );
			//labelFeatures.push(textFeature);
		}

		dx = Math.abs(wsp1.x - odcx);
		dy = Math.abs(wsp1.y - odcy);

		//console.log(wsp1, odcx, odcy, dx, dy);

		if (dx < 0.000001 && dy < 0.000001) {

			if (!routespeedsoption3) {
				label = addLabel(lines, speedtekst, routespeedsoption2, odctime, odclen, routespeedsoption4, id);
				if (label !== null) labelFeatures.push(label);
			}
			while (lines.length > 0) lines.pop();

			if (odc + 1 < routeodc.length) {
				odc++;
				odclen  = routeodc[odc].length;
				if (routespeedsoption7) odctime = routeodc[odc].crossTime;
				else                    odctime = routeodc[odc].crossTimeWithoutRealTime;
				if (odc + 1 < routeodc.length) {
					odcx    = routeodc[odc + 1].path.x;
					odcy    = routeodc[odc + 1].path.y;
				}

				speed = 0;
				if (odctime > 0) speed = 3.6 * odclen / odctime;
				speedtekst = parseInt(speed);
				kolor   = getColor(speed);

			}
		}

		dlon = Math.abs(wsp1.x - wsp2.x);
		dlat = Math.abs(wsp1.y - wsp2.y);

		if (dlon < 0.0000001 && dlat < 0.0000001) continue;

		var p3 = new OL.Geometry.Point(wsp1.x, wsp1.y).transform(epsg4326, epsg900913);
		var p4 = new OL.Geometry.Point(wsp2.x, wsp2.y).transform(epsg4326, epsg900913);

		if (doubletraffic) {
			dx = p4.x - p3.x;
			dy = p4.y - p3.y;
			var r = Math.sqrt(dx*dx + dy*dy);
			var angle = Math.acos( dx / r );
			if (dy < 0) angle = -angle;
			angle = angle - 0.5 * Math.PI;
			if (leftHand) angle += Math.PI;

			p3.x += doubletrafficoffset * Math.cos(angle) * 0.6;
			p3.y += doubletrafficoffset * Math.sin(angle) * 0.6;
			p4.x += doubletrafficoffset * Math.cos(angle) * 0.6;
			p4.y += doubletrafficoffset * Math.sin(angle) * 0.6;

			if (p1!==null && p2!==null) {

				var Ax = p1.x;
				var Ay = p1.y;
				var Bx = p2.x;
				var By = p2.y;
				var Cx = p3.x;
				var Cy = p3.y;
				var Dx = p4.x;
				var Dy = p4.y;

				dx = Cx - Bx;
				dy = Cy - By;

				var delta = Math.sqrt(dx*dx + dy*dy);

				var mx = ((By-Ay)*(Dx-Cx)-(Dy-Cy)*(Bx-Ax));
				var my = ((Dy-Cy)*(Bx-Ax)-(By-Ay)*(Dx-Cx));

				if ( Math.abs(mx) > 0.000000001 && Math.abs(my) > 0.000000001 && delta > 0.1 ) {

					var x = ((Bx-Ax)*(Dx*Cy-Dy*Cx)-(Dx-Cx)*(Bx*Ay-By*Ax)) / mx;
					var y = ((Dy-Cy)*(Bx*Ay-By*Ax)-(By-Ay)*(Dx*Cy-Dy*Cx)) / my;

					var dx2 = x - Bx;
					var dy2 = y - By;
					var delta2 = Math.sqrt(dx2*dx2 + dy2*dy2);

					if (delta2 < 1000) {      // checking if point of crossing is close to segments

						len = lineFeatures.length;
						if (len>0) {
							var lf = lineFeatures[len-1];
							lf.geometry.components[1].x = x;
							lf.geometry.components[1].y = y;
						}

						p3.x = x;
						p3.y = y;
					}
				}
			}
		}

		outlinepoints.push(p3);
		outlinepoints.push(p4);

		var points = [];
		points.push(p3);
		points.push(p4);

		var line = new OL.Geometry.LineString(points);
		lines.push(line);

		var lineFeature = new OL.Feature.Vector(line, { strokeColor: kolor, labelText: '', strokeWidth: 10 } );

		lineFeatures.push(lineFeature);

		p1 = p3;
		p2 = p4;
	}

	if (!routespeedsoption3) {
		label = addLabel(lines, speedtekst, routespeedsoption2, odctime, odclen, routespeedsoption4, id);
		if (label !== null) labelFeatures.push(label);
	}
	while (lines.length > 0) lines.pop();

	var outlinestring  = new OL.Geometry.LineString(outlinepoints);
	var outlineFeature = new OL.Feature.Vector(outlinestring, { strokeColor: '#404040', labelText: '', strokeWidth: 12 } );
	routeLayer.addFeatures(outlineFeature);

	routeLayer.addFeatures(lineFeatures);
	routeLayer.addFeatures(labelFeatures);



	var summarylen = 0;
	var summarysec = 0;
	if (routespeedsoption7) {
		for(i=0; i<routeodc.length; i++) {
			summarylen += routeodc[i].length;
			summarysec += routeodc[i].crossTime;
		}
	}
	else {
		for(i=0; i<routeodc.length; i++) {
			summarylen += routeodc[i].length;
			summarysec += routeodc[i].crossTimeWithoutRealTime;
		}
	}
	len = summarylen / 1000.0;
	var sec = summarysec % 60;
	var min = (summarysec - sec) % 3600;
	var hou = (summarysec - sec - min) % 216000;
	min = (min / 60) % 60;
	hou = (hou / 3600);

	var t = '';
	if (hou < 10) t += '0' + hou + ":"; else t += hou + ":";
	if (min < 10) t += '0' + min + ":"; else t += min + ":";
	if (sec < 10) t += '0' + sec;
	else t += sec;

	var lenmph = len / 1.609;

	var avgspeed = (summarylen / 1000.0) / (summarysec / 3600.0);
	if (routespeedsoption4) avgspeed = avgspeed / 1.609;

	var summaryobj;
	if (id==1) summaryobj = getId('routespeeds-summary1');
	if (id==2) summaryobj = getId('routespeeds-summary2');
	if (id==3) summaryobj = getId('routespeeds-summary3');
	if (id==4) summaryobj = getId('routespeeds-summary4');
	if (id==5) summaryobj = getId('routespeeds-summary5');

	var html;
	if (id==1) html = '<div class=routespeeds_header style="background: #4d4dcd; color: #e0e0e0; "></div>' + '<span style="color: #404040;">Route 1</span> ';
	if (id==2) html = '<div class=routespeeds_header style="background: #d34f8a; color: #e0e0e0; "></div>' + '<span style="color: #404040;">Route 2</span> ';
	if (id==3) html = '<div class=routespeeds_header style="background: #188984; color: #e0e0e0; "></div>' + '<span style="color: #404040;">Route 3</span> ';
	if (id==4) html = '<div class=routespeeds_header style="background: #cafa27; color: #404040; "></div>' + '<span style="color: #404040;">Route 4</span> ';
	if (id==5) html = '<div class=routespeeds_header style="background: #ffca3f; color: #e0e0e0; "></div>' + '<span style="color: #404040;">Route 5</span> ';

    if (id==3 && isHovRoute) html = html + "\u25ca";

	var lenstr = precFloat(len,2);
	var u1 = 'km';
	var u2 = 'km&#47;h';
	if (routespeedsoption4) {
		lenstr = precFloat(lenmph,2);
		u1 = 'miles';
		u2 = 'mph';
	}

	html += '<div style="min-width:50px; display:inline-block; text-align:right;" ><b>' + lenstr + '</b></div>';
	html += '<span style="font-size:11px;"> ' + u1 + '</span> &nbsp;<b>' + t + '</b>';
	html += '<div style="display:inline-block; min-width:40px; text-align:right; color:#404040" >' + precFloat(avgspeed,1) + '</div> <span style="font-size:11px;">' + u2 + '</span>';

	summaryobj.innerHTML = html;

	if (id === routeSelected) summaryobj.className = 'routespeeds_summary_classB';
	summaryobj.style.visibility = 'visible';
}
//--------------------------------------------------------------------------------------------------------
function precFloat(f, prec)
{
	if (!isFinite(f)) return "&mdash;";

	if (f < 0) {
		f -= Math.pow(0.1, prec) * 0.5;
	}
	else {
		f += Math.pow(0.1, prec) * 0.5;
	}

	var ipart = parseInt(f);
	var fpart = Math.abs(f - ipart);
	f = ipart;

	if (fpart === '0') fpart = '0.0';
	fpart += '0000000000000000';
	if (prec) f += fpart.substr(1, prec + 1);

	return f;
}
//--------------------------------------------------------------------------------------------------------
function getElementsByClassName(classname, node) {
	if(!node) node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
		return a;
}
//--------------------------------------------------------------------------------------------------------
function getId(node) {
	return document.getElementById(node);
}
//--------------------------------------------------------------------------------------------------------
function getnowtoday()
{
	var hour = getId('routespeeds-hour').value;
	var day  = getId('routespeeds-day').value;
	if (hour === '---') hour = 'now';
	if (day  === '---') day = 'today';
	if (hour === '') hour = 'now';
	if (day  === '') day = 'today';

	var t = new Date();
	var thour = (t.getHours() * 60) + t.getMinutes();
	var tnow = (t.getDay() * 1440) + thour;
	var tsel = tnow;

	if (hour === 'now') {
		if (day === "0")     tsel = (parseInt(day) * 1440) + thour;
		if (day === "1")     tsel = (parseInt(day) * 1440) + thour;
		if (day === "2")     tsel = (parseInt(day) * 1440) + thour;
		if (day === "3")     tsel = (parseInt(day) * 1440) + thour;
		if (day === "4")     tsel = (parseInt(day) * 1440) + thour;
		if (day === "5")     tsel = (parseInt(day) * 1440) + thour;
		if (day === "6")     tsel = (parseInt(day) * 1440) + thour;
	}
	else {
		if (day === "today") tsel = (t.getDay()    * 1440) + parseInt(hour);
		if (day === "0")     tsel = (parseInt(day) * 1440) + parseInt(hour);
		if (day === "1")     tsel = (parseInt(day) * 1440) + parseInt(hour);
		if (day === "2")     tsel = (parseInt(day) * 1440) + parseInt(hour);
		if (day === "3")     tsel = (parseInt(day) * 1440) + parseInt(hour);
		if (day === "4")     tsel = (parseInt(day) * 1440) + parseInt(hour);
		if (day === "5")     tsel = (parseInt(day) * 1440) + parseInt(hour);
		if (day === "6")     tsel = (parseInt(day) * 1440) + parseInt(hour);
	}

	//console.log(tsel, tnow, tsel-tnow);

	return tsel - tnow;
}
//--------------------------------------------------------------------------------------------------------
function requestRouteFromLiveMap(x1, y1, x2, y2)
{
	var atTime = getnowtoday();

	var numRoutes = 1;
	if (routespeedsoption5) numRoutes = parseInt(routespeedsoption6);
	var numPaths = (routespeedsoption5 && routespeedsoption12 && !routespeedsoption15) ? numRoutes * 10 : numRoutes; //Routing Order - last condition disables Try More option

	var routeType = (routespeedsoption13 === 3) ? "TIME" : "HISTORIC_TIME";

	var avoidTollRoads  = routespeedsoption8;
	var avoidPrimaries  = routespeedsoption9;
	var avoidTrails     = routespeedsoption10;
	var avoidLongTrails = routespeedsoption11;
	var allowUTurns     = routespeedsoption14;
    var avoidDifficult  = routespeedsoption16;
	var avoidFerries    = routespeedsoption17;
	var vehType         = routespeedsoption18;
	var expressPass     = routespeedsoption19;

	var options = {
		data: [],
		add: function (name, value, defaultValue) {
			if (value !== defaultValue) {
				this.data.push(name + (value ? ":t" : ":f"));
			}
		},
		put: function (name, value) {
			this.data.push(name + (value ? ":t" : ":f"));
		},
		get: function () {
			return this.data.join(",");
		}
	};

	options.add("AVOID_TOLL_ROADS",      avoidTollRoads,  false);
	options.add("AVOID_PRIMARIES",       avoidPrimaries,  false);
    options.add("AVOID_DANGEROUS_TURNS", avoidDifficult,  false);
    options.add("AVOID_FERRIES",         avoidFerries,    false);
    options.add("ALLOW_UTURNS",          allowUTurns,     true);

	if (avoidLongTrails) 	{ options.put("AVOID_LONG_TRAILS", true);  }
	else if (avoidTrails)	{ options.put("AVOID_TRAILS",      true);  }
	else 					{ options.put("AVOID_LONG_TRAILS", false); }


	var url = getRoutingManager();
	var data = {
		from: "x:" + x1 + " y:" + y1,
		to: "x:" + x2 + " y:" + y2,
		returnJSON: true,
		returnGeometries: true,
		returnInstructions: true,
		timeout: 60000,
		at: atTime,
		type: routeType,
		nPaths: numPaths,
		clientVersion: '4.0.0',
        options: options.get(),
        vehicleType: vehType,
        subscription: expressPass
	};

	routewait = 1;

	getId('routespeeds-error').innerHTML = "";

	console.time('WME Route Speeds: routing time');

	$.ajax({
		dataType: "json",
		cache: false,
		url: url,
		data: data,
		dataFilter: function(data, dataType) {
			return data.replace(/NaN/g, '0');
		},
		error: function(req, textStatus, errorThrown) {
			var str = "Route request failed" + (textStatus !== null ? " with " + textStatus : "") + "!";
			str += "<br>" + errorThrown;
			handleRouteRequestError(str);
		},
		success: function(json) {
			if (json.error !== undefined) {
				var str = json.error;
				str = str.replace("|", "<br>");
				handleRouteRequestError(str);
			}
			else {

				routewsp1 = [];
				routeodc1 = [];
                routehov1=  [];
				routewsp2 = [];
				routeodc2 = [];
                routehov2 = [];
				routewsp3 = [];
				routeodc3 = [];
                routehov3 = [];
				routewsp4 = [];
				routeodc4 = [];
                routehov4 = [];
				routewsp5 = [];
				routeodc5 = [];
                routehov5 = [];


				if (json.coords !== undefined) {
					console.log("WME Route Speeds: 1 route received" + " (" + numPaths + " requested)");

					if (routeSelected > 1) routeSelected = 1;

					routewsp1 = json.coords;
					routeodc1 = json.response.results;
                    routehov1 = json.reponse.laneTypes;   // FIXIT - not needed?

				}
				if (json.alternatives !== undefined) {
					console.log("WME Route Speeds: " + json.alternatives.length + " routes received" + " (" + numPaths + " requested)");

					var sortByField = routespeedsoption7 ? "crossTime"	: "crossTimeWithoutRealTime";

					if (!routespeedsoption15) {                                    // Routing Order no sort
                        json.alternatives.sort(function(a, b) {
							var valField = "total_" + sortByField;
							var val = function(r) {
								if (r[valField] !== undefined) return r[valField];
								var val = 0;
								for (var i = 0; i < r.results.length; ++i) {
									val += r.results[i][sortByField];
								}
								return r[valField] = val;
							};
							return val(a.response) - val(b.response);
						});
                    }                                                             // Routing Order


						if (json.alternatives.length > numRoutes) {
						json.alternatives = json.alternatives.slice(0, numRoutes);
					}

					if (routeSelectedLast) routeSelected = routeSelectedLast;
					if (routeSelected > json.alternatives.length) routeSelected = json.alternatives.length;

					for(var n=0; n<json.alternatives.length; n++) {

						if (n===0) routewsp1 = json.alternatives[n].coords;
						if (n===0) routeodc1 = json.alternatives[n].response.results;
                        if (n===0) routehov1 = json.alternatives[n].response.laneTypes;
console.log("Route " + n + " " + routehov1);
						if (n===1) routewsp2 = json.alternatives[n].coords;
						if (n===1) routeodc2 = json.alternatives[n].response.results;
                        if (n===1) routehov2 = json.alternatives[n].response.laneTypes;
console.log("Route 2 " + routehov2);
						if (n===2) routewsp3 = json.alternatives[n].coords;
						if (n===2) routeodc3 = json.alternatives[n].response.results;
                        if (n===2) routehov3 = json.alternatives[n].response.laneTypes;
console.log("Route 3 " + routehov3);
						if (n===3) routewsp4 = json.alternatives[n].coords;
						if (n===3) routeodc4 = json.alternatives[n].response.results;
                        if (n===3) routehov4 = json.alternatives[n].response.laneTypes;

						if (n===4) routewsp5 = json.alternatives[n].coords;
						if (n===4) routeodc5 = json.alternatives[n].response.results;
                        if (n===4) routehov5 = json.alternatives[n].response.laneTypes;
					}
				}

				rezoom();
			}

			getId('routespeeds-button-livemap').style.backgroundColor = '';
			getId('routespeeds-button-reverse').style.backgroundColor = '';
		},
		complete: function() {
			console.timeEnd('WME Route Speeds: routing time');
			routewait = 0;
		}
	});
}
//--------------------------------------------------------------------------------------------------------
function handleRouteRequestError(message)
{
	console.log("WME Route Speeds: route request error: " + message.replace("<br>", "\n"));

	getId('routespeeds-button-livemap').style.backgroundColor = '';
	getId('routespeeds-button-reverse').style.backgroundColor = '';

	getId('routespeeds-summary1').innerHTML = '';
	getId('routespeeds-summary2').innerHTML = '';
	getId('routespeeds-summary3').innerHTML = '';
	getId('routespeeds-summary4').innerHTML = '';
	getId('routespeeds-summary5').innerHTML = '';

	getId('routespeeds-summary1').style.visibility = 'hidden';
	getId('routespeeds-summary2').style.visibility = 'hidden';
	getId('routespeeds-summary3').style.visibility = 'hidden';
	getId('routespeeds-summary4').style.visibility = 'hidden';
	getId('routespeeds-summary5').style.visibility = 'hidden';

	var WM = window.W.map;
	var rlayers1 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
	var rlayers2 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds2");
	var rlayers3 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds3");
	var rlayers4 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds4");
	var rlayers5 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds5");
	var routeLayer1 = rlayers1[0];
	var routeLayer2 = rlayers2[0];
	var routeLayer3 = rlayers3[0];
	var routeLayer4 = rlayers4[0];
	var routeLayer5 = rlayers5[0];
	if (routeLayer1 !== undefined) routeLayer1.removeAllFeatures();
	if (routeLayer2 !== undefined) routeLayer2.removeAllFeatures();
	if (routeLayer3 !== undefined) routeLayer3.removeAllFeatures();
	if (routeLayer4 !== undefined) routeLayer4.removeAllFeatures();
	if (routeLayer5 !== undefined) routeLayer5.removeAllFeatures();

	getId('routespeeds-error').innerHTML = "<br>" + message;
}
//--------------------------------------------------------------------------------------------------------
function livemapRouteClick()
{
	routeSelected = 1;
	routeSelectedLast = 0;

	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function get_coords_from_livemap_link(link) {

	var lon1 = '';
	var lat1 = '';
	var lon2 = '';
	var lat2 = '';

	var opt = link.split('&');
	for(var i=0; i<opt.length; i++) {
		var o = opt[i];

		if (o.indexOf('from_lon=')===0) lon1 =        o.substring(9, 30);
		if (o.indexOf('from_lat=')===0) lat1 = ', ' + o.substring(9, 30);
		if (o.indexOf('to_lon=')===0)   lon2 =        o.substring(7, 30);
		if (o.indexOf('to_lat=')===0)   lat2 = ', ' + o.substring(7, 30);
	}

	getId('sidepanel-routespeeds-a').value = lon1 + lat1;
	getId('sidepanel-routespeeds-b').value = lon2 + lat2;
}
//--------------------------------------------------------------------------------------------------------
function livemapRoute() {

	if (routespeedsoption1) return;
	if (routewait) return;

	routewsp1 = [];
	routeodc1 = [];
	routewsp2 = [];
	routeodc2 = [];
	routewsp3 = [];
	routeodc3 = [];
	routewsp4 = [];
	routeodc4 = [];
	routewsp5 = [];
	routeodc5 = [];

	var stra = getId('sidepanel-routespeeds-a').value;
	var strb = getId('sidepanel-routespeeds-b').value;

	var pastedlink = false;

	//sprawdzenie czy wklejono link z LiveMap, jeżeli tak to sparsowanie i przeformatowanie współrzędnych oraz przeniesienie widoku mapy na miejsce wklejonej trasy
	if (stra.indexOf('livemap?')>=0 || stra.indexOf('livemap/?')>=0) {
		get_coords_from_livemap_link(stra);
		stra = getId('sidepanel-routespeeds-a').value;
		strb = getId('sidepanel-routespeeds-b').value;
		pastedlink = true;
	}
	else if (strb.indexOf('livemap?')>=0 || strb.indexOf('livemap/?')>=0) {
		get_coords_from_livemap_link(strb);
		stra = getId('sidepanel-routespeeds-a').value;
		strb = getId('sidepanel-routespeeds-b').value;
		pastedlink = true;
	}

	stra = getId('sidepanel-routespeeds-a').value;
	strb = getId('sidepanel-routespeeds-b').value;
	if (stra === "") return;
	if (strb === "") return;

	var p1 = stra.split(",");
	var p2 = strb.split(",");

	if (p1.length < 2) return;
	if (p2.length < 2) return;

	var x1 = p1[0].trim();
	var y1 = p1[1].trim();
	var x2 = p2[0].trim();
	var y2 = p2[1].trim();

	x1 = parseFloat(x1);
	y1 = parseFloat(y1);
	x2 = parseFloat(x2);
	y2 = parseFloat(y2);

	if (isNaN(x1)) return;
	if (isNaN(y1)) return;
	if (isNaN(x2)) return;
	if (isNaN(y2)) return;

	if (x1 < -180 || x1 > 180) x1 = 0;
	if (x2 < -180 || x2 > 180) x2 = 0;
	if (y1 < -90  || y1 > 90)  y1 = 0;
	if (y2 < -90  || y2 > 90)  y2 = 0;

	var objprog1 = getId('routespeeds-button-livemap');
	objprog1.style.backgroundColor = '#FF8000';

	createMarkers(x1, y1, x2, y2, true);

	if (pastedlink) {
		clickA();
	}

	requestRouteFromLiveMap(x1, y1, x2, y2);
}
//--------------------------------------------------------------------------------------------------------
function reverseRoute() {

	if (routespeedsoption1) return;
	if (routewait) return;

	routewsp1 = [];
	routeodc1 = [];
	routewsp2 = [];
	routeodc2 = [];
	routewsp3 = [];
	routeodc3 = [];
	routewsp4 = [];
	routeodc4 = [];
	routewsp5 = [];
	routeodc5 = [];

	var stra = getId('sidepanel-routespeeds-b').value;
	var strb = getId('sidepanel-routespeeds-a').value;
	if (stra === "") return;
	if (strb === "") return;

	getId('sidepanel-routespeeds-a').value = stra;
	getId('sidepanel-routespeeds-b').value = strb;

	var p1 = stra.split(",");
	var p2 = strb.split(",");

	if (p1.length < 2) return;
	if (p2.length < 2) return;

	var x1 = p1[0].trim();
	var y1 = p1[1].trim();
	var x2 = p2[0].trim();
	var y2 = p2[1].trim();

	x1 = parseFloat(x1);
	y1 = parseFloat(y1);
	x2 = parseFloat(x2);
	y2 = parseFloat(y2);

	if (isNaN(x1)) return;
	if (isNaN(y1)) return;
	if (isNaN(x2)) return;
	if (isNaN(y2)) return;

	if (x1 < -180 || x1 > 180) x1 = 0;
	if (x2 < -180 || x2 > 180) x2 = 0;
	if (y1 < -90  || y1 > 90)  y1 = 0;
	if (y2 < -90  || y2 > 90)  y2 = 0;

	var objprog2 = getId('routespeeds-button-reverse');
	objprog2.style.backgroundColor = '#FF8000';

	createMarkers(x1, y1, x2, y2, true);

	requestRouteFromLiveMap(x1, y1, x2, y2);
}
//--------------------------------------------------------------------------------------------------------
function resetOptions() {

	getId('routespeeds-option5').checked  = routespeedsoption5  = true;
	getId('routespeeds-option6').value    = routespeedsoption6  = 3;
	getId('routespeeds-option12').checked = routespeedsoption12 = false;

	getId('routespeeds-option7').checked  = routespeedsoption7  = false;

	getId('routespeeds-option13').value   = routespeedsoption13 = 1;

	getId('routespeeds-option8').checked  = routespeedsoption8  = false;
	getId('routespeeds-option9').checked  = routespeedsoption9  = false;
	getId('routespeeds-option10').checked = routespeedsoption10 = true;
	getId('routespeeds-option11').checked = routespeedsoption11 = false;
	getId('routespeeds-option14').checked = routespeedsoption14 = true;
    getId('routespeeds-option15').checked = routespeedsoption15 = true;
    getId('routespeeds-option16').checked = routespeedsoption16 = false;
    getId('routespeeds-option17').checked = routespeedsoption17 = false;
    getId('routespeeds-option18').value   = routespeedsoption18 = 'PRIVATE';
    getId('routespeeds-option19').value   = routespeedsoption19 = '';

	update_adv_switches();
}
//--------------------------------------------------------------------------------------------------------
function resetOptionsToLivemapRouteClick() {
	if (routewait) return;

	resetOptions();

	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function hourChange() {

	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function dayChange() {

	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickA() { gotoMarker(markerA); }
function clickB() { gotoMarker(markerB); }
//--------------------------------------------------------------------------------------------------------
function gotoMarker(marker) {

	if (routespeedsoption1 || marker === undefined || !marker.created) return;

	var pt = marker.lonlat.toPoint();
	var zoom = window.W.map.getZoom();

	window.W.map.setCenter([pt.x, pt.y], zoom);
}
//--------------------------------------------------------------------------------------------------------
function clickOption1()
{
	var WM = window.W.map;

	routespeedsoption1 = (getId('routespeeds-option1').checked === true);

	if (routespeedsoption1) {
		getId('sidepanel-routespeeds').style.color = "#A0A0A0";

		getId('routespeeds-summary1').innerHTML = '';
		getId('routespeeds-summary2').innerHTML = '';
		getId('routespeeds-summary3').innerHTML = '';
		getId('routespeeds-summary4').innerHTML = '';
		getId('routespeeds-summary5').innerHTML = '';

		getId('routespeeds-summary1').style.visibility = 'hidden';
		getId('routespeeds-summary2').style.visibility = 'hidden';
		getId('routespeeds-summary3').style.visibility = 'hidden';
		getId('routespeeds-summary4').style.visibility = 'hidden';
		getId('routespeeds-summary5').style.visibility = 'hidden';

		var rlayers1 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
		var rlayers2 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds2");
		var rlayers3 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds3");
		var rlayers4 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds4");
		var rlayers5 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds5");
		var routeLayer1 = rlayers1[0];
		var routeLayer2 = rlayers2[0];
		var routeLayer3 = rlayers3[0];
		var routeLayer4 = rlayers4[0];
		var routeLayer5 = rlayers5[0];

		if (routeLayer1 !== undefined) routeLayer1.removeAllFeatures();
		if (routeLayer2 !== undefined) routeLayer2.removeAllFeatures();
		if (routeLayer3 !== undefined) routeLayer3.removeAllFeatures();
		if (routeLayer4 !== undefined) routeLayer4.removeAllFeatures();
		if (routeLayer5 !== undefined) routeLayer5.removeAllFeatures();

		showMarkers(false);
		showClosures(0);
	}
	else {
		getId('sidepanel-routespeeds').style.color = "";

		if (showMarkers(true)) livemapRoute();
		showClosures(1);
	}
}
//--------------------------------------------------------------------------------------------------------
function clickOption2()
{
	routespeedsoption2 = (getId('routespeeds-option2').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption3()
{
	routespeedsoption3 = (getId('routespeeds-option3').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption4()
{
	routespeedsoption4 = (getId('routespeeds-option4').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption5()
{
	routeSelected = 1;
	routeSelectedLast = 0;

	routespeedsoption5 = (getId('routespeeds-option5').checked === true);
	getId('routespeeds-option5-span').style.display = routespeedsoption5 ? 'inline' : 'none';
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption6()
{
	routespeedsoption5 = (getId('routespeeds-option5').checked === true);
	update_adv_switches();

	routespeedsoption6 = parseInt(getId('routespeeds-option6').value);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption7()
{
	routespeedsoption7 = (getId('routespeeds-option7').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption8()
{
	routespeedsoption8 = (getId('routespeeds-option8').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption9()
{
	routespeedsoption9 = (getId('routespeeds-option9').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption10()
{
	routespeedsoption10 = (getId('routespeeds-option10').checked === true);

	routespeedsoption11 = false;
	getId('routespeeds-option11').checked = false;

	update_adv_switches();
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption11()
{
	routespeedsoption11 = (getId('routespeeds-option11').checked === true);

	routespeedsoption10 = false;
	getId('routespeeds-option10').checked = false;

	update_adv_switches();
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption12()
{
	routespeedsoption12 = (getId('routespeeds-option12').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption13()
{
	routespeedsoption13 = parseInt(getId('routespeeds-option13').value);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption14()
{
	routespeedsoption14 = (getId('routespeeds-option14').checked === true);
	livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption15()
{
    routespeedsoption15 = (getId('routespeeds-option15').checked === true);
    livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption16()
{
    routespeedsoption16 = (getId('routespeeds-option16').checked === true);
    livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption17()
{
    routespeedsoption17 = (getId('routespeeds-option17').checked === true);
    livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption18()
{
    routespeedsoption18 = (getId('routespeeds-option18').value);
    livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickOption19()
{
    routespeedsoption19 = (getId('routespeeds-option19').value);
    livemapRoute();
}
//--------------------------------------------------------------------------------------------------------
function clickRoute1() { toggleRoute(1); }
function clickRoute2() { toggleRoute(2); }
function clickRoute3() { toggleRoute(3); }
function clickRoute4() { toggleRoute(4); }
function clickRoute5() { toggleRoute(5); }
//--------------------------------------------------------------------------------------------------------
function toggleRoute(routeNo) {
	if (routeSelected === routeNo) routeNo = 0;
	routeSelectedLast = routeSelected = routeNo;
	switchRoute();
}
//--------------------------------------------------------------------------------------------------------
function switchRoute()
{
	var WM = window.W.map;
	var OL = window.OL;

	if (routeSelected==1)   getId('routespeeds-summary1').className = 'routespeeds_summary_classB';
	else                    getId('routespeeds-summary1').className = 'routespeeds_summary_classA';
	if (routeSelected==2)   getId('routespeeds-summary2').className = 'routespeeds_summary_classB';
	else                    getId('routespeeds-summary2').className = 'routespeeds_summary_classA';
	if (routeSelected==3)   getId('routespeeds-summary3').className = 'routespeeds_summary_classB';
	else                    getId('routespeeds-summary3').className = 'routespeeds_summary_classA';
	if (routeSelected==4)   getId('routespeeds-summary4').className = 'routespeeds_summary_classB';
	else                    getId('routespeeds-summary4').className = 'routespeeds_summary_classA';
	if (routeSelected==5)   getId('routespeeds-summary5').className = 'routespeeds_summary_classB';
	else                    getId('routespeeds-summary5').className = 'routespeeds_summary_classA';

	var rlayers1 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
	var rlayers2 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds2");
	var rlayers3 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds3");
	var rlayers4 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds4");
	var rlayers5 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds5");
	var routeLayer1 = rlayers1[0];
	var routeLayer2 = rlayers2[0];
	var routeLayer3 = rlayers3[0];
	var routeLayer4 = rlayers4[0];
	var routeLayer5 = rlayers5[0];
	if (routeLayer1 === undefined) return;
	if (routeLayer2 === undefined) return;
	if (routeLayer3 === undefined) return;
	if (routeLayer4 === undefined) return;
	if (routeLayer5 === undefined) return;

	var style1 = routeLayer1.styleMap.styles.default.defaultStyle;
	var style2 = routeLayer2.styleMap.styles.default.defaultStyle;
	var style3 = routeLayer3.styleMap.styles.default.defaultStyle;
	var style4 = routeLayer4.styleMap.styles.default.defaultStyle;
	var style5 = routeLayer5.styleMap.styles.default.defaultStyle;

	var s1 = style1.strokeColor;
	var s2 = style2.strokeColor;
	var s3 = style3.strokeColor;
	var s4 = style4.strokeColor;
	var s5 = style5.strokeColor;

	var t1 = style1.label;
	var t2 = style2.label;
	var t3 = style3.label;
	var t4 = style4.label;
	var t5 = style5.label;

	style1.strokeColor = '#4d4dcd';
	style2.strokeColor = '#d34f8a';
	style3.strokeColor = '#188984';
	style4.strokeColor = '#cafa27';
	style5.strokeColor = '#ffca3f';
	//style1.strokeColor = '#76768f';
	//style2.strokeColor = '#917682';
	//style3.strokeColor = '#6b8a88';
	//style4.strokeColor = '#998f73';
	//style5.strokeColor = '#769178';
	//style1.strokeColor = '#7070a0';
	//style2.strokeColor = '#a07070';
	//style3.strokeColor = '#70a070';
	//style4.strokeColor = '#a0a070';
	//style5.strokeColor = '#a070a0';
	style1.strokeWidth = 5;
	style2.strokeWidth = 5;
	style3.strokeWidth = 5;
	style4.strokeWidth = 5;
	style5.strokeWidth = 5;
	style1.label = '';
	style2.label = '';
	style3.label = '';
	style4.label = '';
	style5.label = '';

	if (routeSelected === 0 || routeSelected === 1) { style1.strokeColor = '${strokeColor}'; style1.strokeWidth = '${strokeWidth}'; style1.label = '${labelText}'; }
	if (routeSelected === 0 || routeSelected === 2) { style2.strokeColor = '${strokeColor}'; style2.strokeWidth = '${strokeWidth}'; style2.label = '${labelText}'; }
	if (routeSelected === 0 || routeSelected === 3) { style3.strokeColor = '${strokeColor}'; style3.strokeWidth = '${strokeWidth}'; style3.label = '${labelText}'; }
	if (routeSelected === 0 || routeSelected === 4) { style4.strokeColor = '${strokeColor}'; style4.strokeWidth = '${strokeWidth}'; style4.label = '${labelText}'; }
	if (routeSelected === 0 || routeSelected === 5) { style5.strokeColor = '${strokeColor}'; style5.strokeWidth = '${strokeWidth}'; style5.label = '${labelText}'; }

	var z1 = parseInt(routeLayer1.getZIndex());
	var z2 = parseInt(routeLayer2.getZIndex());
	var z3 = parseInt(routeLayer3.getZIndex());
	var z4 = parseInt(routeLayer4.getZIndex());
	var z5 = parseInt(routeLayer5.getZIndex());
    var z;

	if (z1 > z2) { z = z1; z1 = z2; z2 = z; }
	if (z1 > z3) { z = z1; z1 = z3; z3 = z; }
	if (z1 > z4) { z = z1; z1 = z4; z4 = z; }
	if (z1 > z5) { z = z1; z1 = z5; z5 = z; }
	if (z2 > z3) { z = z2; z2 = z3; z3 = z; }
	if (z2 > z4) { z = z2; z2 = z4; z4 = z; }
	if (z2 > z5) { z = z2; z2 = z5; z5 = z; }
	if (z3 > z4) { z = z3; z3 = z4; z4 = z; }
	if (z3 > z5) { z = z3; z3 = z5; z5 = z; }
	if (z4 > z5) { z = z4; z4 = z5; z5 = z; }

	//wlodek76: finding closure layer and changing its zindex to hide it under Route Speeds layer
	//          we cannot easily set route speed layer over markers because it will block access to elements on these layers
	var clayers = WM.getLayersBy( "uniqueName", "closures" );
	if (clayers[0] !== undefined && closurelayer === null) {

		closurelayer          = clayers[0];
		closurelayerZINDEX[0] = clayers[0].getZIndex();
		closurelayerZINDEX[1] = z1 - 5;

		closurelayer.setZIndex( closurelayerZINDEX[1] );
		closurelayer.redraw();
	}

	if (routeSelected <= 1) { routeLayer1.setZIndex(z5); routeLayer2.setZIndex(z4); routeLayer3.setZIndex(z3); routeLayer4.setZIndex(z2); routeLayer5.setZIndex(z1); }
	if (routeSelected === 2) { routeLayer1.setZIndex(z4); routeLayer2.setZIndex(z5); routeLayer3.setZIndex(z3); routeLayer4.setZIndex(z2); routeLayer5.setZIndex(z1); }
	if (routeSelected === 3) { routeLayer1.setZIndex(z4); routeLayer2.setZIndex(z3); routeLayer3.setZIndex(z5); routeLayer4.setZIndex(z2); routeLayer5.setZIndex(z1); }
	if (routeSelected === 4) { routeLayer1.setZIndex(z4); routeLayer2.setZIndex(z3); routeLayer3.setZIndex(z2); routeLayer4.setZIndex(z5); routeLayer5.setZIndex(z1); }
	if (routeSelected === 5) { routeLayer1.setZIndex(z4); routeLayer2.setZIndex(z3); routeLayer3.setZIndex(z2); routeLayer4.setZIndex(z1); routeLayer5.setZIndex(z5); }

	if (t1 !== style1.label || s1 !== style1.strokeColor) routeLayer1.redraw();
	if (t2 !== style2.label || s2 !== style2.strokeColor) routeLayer2.redraw();
	if (t3 !== style3.label || s3 !== style3.strokeColor) routeLayer3.redraw();
	if (t4 !== style4.label || s4 !== style4.strokeColor) routeLayer4.redraw();
	if (t5 !== style5.label || s5 !== style5.strokeColor) routeLayer5.redraw();
}
//--------------------------------------------------------------------------------------------------------
function showClosures(mode) {
	if (closurelayer !== null && closurelayerZINDEX.length==2) {
		closurelayer.setZIndex( closurelayerZINDEX[mode] );
		closurelayer.redraw();
	}
}
//--------------------------------------------------------------------------------------------------------
function rezoom() {

	var WM = window.W.map;
	var OL = window.OL;

	var rlayers1 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds1");
	var rlayers2 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds2");
	var rlayers3 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds3");
	var rlayers4 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds4");
	var rlayers5 = WM.getLayersBy("uniqueName","__DrawRouteSpeeds5");

	var routeLayer1 = rlayers1[0];
	var routeLayer2 = rlayers2[0];
	var routeLayer3 = rlayers3[0];
	var routeLayer4 = rlayers4[0];
	var routeLayer5 = rlayers5[0];

	if (routeLayer1 !== undefined) routeLayer1.removeAllFeatures();
	if (routeLayer2 !== undefined) routeLayer2.removeAllFeatures();
	if (routeLayer3 !== undefined) routeLayer3.removeAllFeatures();
	if (routeLayer4 !== undefined) routeLayer4.removeAllFeatures();
	if (routeLayer5 !== undefined) routeLayer5.removeAllFeatures();

	getId('routespeeds-summary1').innerHTML = '';
	getId('routespeeds-summary2').innerHTML = '';
	getId('routespeeds-summary3').innerHTML = '';
	getId('routespeeds-summary4').innerHTML = '';
	getId('routespeeds-summary5').innerHTML = '';

	getId('routespeeds-summary1').className = 'routespeeds_summary_classA';
	getId('routespeeds-summary2').className = 'routespeeds_summary_classA';
	getId('routespeeds-summary3').className = 'routespeeds_summary_classA';
	getId('routespeeds-summary4').className = 'routespeeds_summary_classA';
	getId('routespeeds-summary5').className = 'routespeeds_summary_classA';

	getId('routespeeds-summary1').style.visibility = 'hidden';
	getId('routespeeds-summary2').style.visibility = 'hidden';
	getId('routespeeds-summary3').style.visibility = 'hidden';
	getId('routespeeds-summary4').style.visibility = 'hidden';
	getId('routespeeds-summary5').style.visibility = 'hidden';

	switchRoute();

	if (routewsp1.length>=2 && routeodc1.length>=1) {
		createRouteFeatures(1, routewsp1, routeodc1);
	}

	if (routewsp2.length>=2 && routeodc2.length>=1) {
		createRouteFeatures(2, routewsp2, routeodc2);
	}

	if (routewsp3.length>=2 && routeodc3.length>=1) {
		createRouteFeatures(3, routewsp3, routeodc3);
	}

	if (routewsp4.length>=2 && routeodc4.length>=1) {
		createRouteFeatures(4, routewsp4, routeodc4);
	}

	if (routewsp5.length>=2 && routeodc5.length>=1) {
		createRouteFeatures(5, routewsp5, routeodc5);

	}
}
//--------------------------------------------------------------------------------------------------------
function enterAB(ev) {
	if (ev.keyCode === 13) {
		livemapRoute();
	}
}
//--------------------------------------------------------------------------------------------------------
function initialiseWMERouteSpeeds()
{
	var line_div_break = '<br>';
		line_div_break += '</div>';
		line_div_break += '<div style="margin-left:55px">';

	if (typeof W === 'undefined')              W = window.W;
	if (typeof W.loginManager === 'undefined') W.loginManager = window.W.loginManager;
	if (typeof W.loginManager === 'undefined') W.loginManager = window.loginManager;
	if (W.loginManager !== null && W.loginManager.isLoggedIn()) {
		var user = W.loginManager.user;
		//console.log(user);

		//wlodek76: I prefer more condensed lines for avoid options, so I've added a personal switch here
		if(user !== null) {
			if (user.userName === "wlodek76" && user.id === 203457007) {
				line_div_break = '';
			}
		}
	}


	var addon       = document.createElement('section');
	addon.id        = "routespeeds-addon";
	addon.innerHTML = '' +
        '<b style="margin:0px; padding:0px;"><a href="https://greasyfork.org/en/scripts/5402-wme-route-speeds" target="_blank"><u>WME Route Speeds</u></a></b> &nbsp; v' + wmech_version +
        '<style>\n'	+
        '#sidepanel-routespeeds select { margin-left:20px; font-size:12px; height:22px; border:1px solid; border-color:rgb(169, 169, 169); border-radius:4px; border: 1px solid; border-color: rgb(169, 169, 169); -webkit-border-radius:4px; -moz-border-radius:4px; }\n' +
        '#sidepanel-routespeeds select, #sidepanel-routespeeds input { margin-top:2px; margin-bottom:2px; width:initial; }\n' +
        '#sidepanel-routespeeds input[type="checkbox"] { margin-bottom:0px; }\n'	+
        '#sidepanel-routespeeds label ~ label, #sidepanel-routespeeds span label { margin-left:20px; }\n' +
        '</style>' +

        '<br><br>'	+
        '<div style="float:left; display:inline-block;">'	+
        '<a id="routespeeds-button-A" onclick="return false;" style="cursor:pointer; width:20px; display:inline-block; vertical-align:middle;" title="Center map on A marker">A:</a>'	+
        '<input id="sidepanel-routespeeds-a" class="form-control" style="width:165px; padding:6px; margin:0px; display:inline;" type="text" name=""/>'	+
        '<br><div style="height: 4px;"></div>'	+
        '<a id="routespeeds-button-B" onclick="return false;" style="cursor:pointer; width:20px; display:inline-block; vertical-align:middle;" title="Center map on B marker">B:</a>'	+
        '<input id="sidepanel-routespeeds-b" class="form-control" style="width:165px; padding:6px; margin:0px; display:inline;" type="text" name=""/>'	+
        '</div>' +
        '<div style="float:right; padding-right:20px; padding-top:6%; ">'	+
        '<button id=routespeeds-button-reverse class="btn btn-default" style="padding-left:15px; padding-right:15px;" title="Calculate reverse route" >A &#8596; B</button></div>'	+
        '<div style="clear:both; "></div>'	+

        '<div style="margin-top:8px;">'	+
        '<select id=routespeeds-hour>'	+
        '<option value="now">Now</option>'	+
        '<option value="0"  >00:00</option>'	+
        '<option value="30" >00:30</option>' +
        '<option value="60" >01:00</option>' +
        '<option value="90" >01:30</option>' +
        '<option value="120">02:00</option>' +
        '<option value="150">02:30</option>' +
        '<option value="180">03:00</option>' +
        '<option value="210">03:30</option>' +
        '<option value="240">04:00</option>' +
        '<option value="270">04:30</option>' +
        '<option value="300">05:00</option>' +
        '<option value="330">05:30</option>' +
        '<option value="360">06:00</option>' +
        '<option value="390">06:30</option>' +
        '<option value="420">07:00</option>' +
        '<option value="450">07:30</option>' +
        '<option value="480">08:00</option>' +
        '<option value="510">08:30</option>' +
        '<option value="540">09:00</option>' +
        '<option value="570">09:30</option>' +
        '<option value="600">10:00</option>' +
        '<option value="630">10:30</option>' +
        '<option value="660">11:00</option>' +
        '<option value="690">11:30</option>' +
        '<option value="720">12:00</option>' +
        '<option value="750">12:30</option>' +
        '<option value="780">13:00</option>' +
        '<option value="810">13:30</option>' +
        '<option value="840">14:00</option>' +
        '<option value="870">14:30</option>' +
        '<option value="900">15:00</option>' +
        '<option value="930">15:30</option>' +
        '<option value="960">16:00</option>' +
        '<option value="990">16:30</option>' +
        '<option value="1020">17:00</option>' +
		'<option value="1050">17:30</option>' +
		'<option value="1065">17:45</option>' +
		'<option value="1080">18:00</option>' +
        '<option value="1110">18:30</option>' +
        '<option value="1140">19:00</option>' +
        '<option value="1170">19:30</option>' +
        '<option value="1200">20:00</option>' +
        '<option value="1230">20:30</option>' +
        '<option value="1260">21:00</option>' +
        '<option value="1290">21:30</option>' +
        '<option value="1320">22:00</option>' +
        '<option value="1350">22:30</option>' +
        '<option value="1380">23:00</option>' +
        '<option value="1410">23:30</option>' +
        '</select>'	+
        '<select id=routespeeds-day style="margin-left:5px;" >'	+
        '<option value="today">Today</option>'	+
        '<option value="1">Monday</option>'	+
        '<option value="2">Tuesday</option>'	+
        '<option value="3">Wednesday</option>'	+
        '<option value="4">Thursday</option>'	+
        '<option value="5">Friday</option>'	+
        '<option value="6">Saturday</option>'	+
        '<option value="0">Sunday</option>'	+
        '</select>'	+
        '</div>' +

        '<div style="padding:20px; padding-top: 15px; padding-bottom: 15px; ">'	+
        '<button id=routespeeds-button-livemap class="btn btn-default" style="width:100%;">Calculate Route</button>'	+
        '</div>'	+

        '<div style="margin-bottom:4px;">'	+
        '<b>Options:</b>'	+
        '<a id="routespeeds-reset-options-to-livemap-route" onclick="return false;" style="cursor:pointer; float:right; margin-right:20px;" title="Reset routing options to the Livemap Route equivalents">Reset to Livemap Route</a>'	+
        '</div>' +

        '<div><label class=""><input id="routespeeds-option1" type="checkbox"/>Disable script</label></div>'	+
        '<div><label class=""><input id="routespeeds-option3" type="checkbox"/>Hide labels</label></div>'	+
        '<div><label class=""><input id="routespeeds-option2" type="checkbox"/>Show cross-times through segments</label></div>'	+
        '<div><label class=""><input id="routespeeds-option4" type="checkbox"/>Speed in mph</label></div>'	+

        '<div>'	+
        '<label class="" style="display:inline-block;"><input id="routespeeds-option5" type="checkbox"/>Alternative routes</label>'	+
        '<select id=routespeeds-option6 style="margin-left:10px; display:inline-block;" >'	+
        '<option id=routespeeds-option6-v1 value="1">1</option>'	+
        '<option id=routespeeds-option6-v2 value="2">2</option>'	+
        '<option id=routespeeds-option6-v3 value="3">3</option>'	+
        '<option id=routespeeds-option6-v4 value="4">4</option>'	+
        '<option id=routespeeds-option6-v5 value="5">5</option>'	+
        '</select>'	+
        '<span id="routespeeds-option5-span" style="display:none;">'	+
        '<label class="" style="margin-left:15px; display:inline-block;" title="When enabled, ten times more alternative routes are requested from the routing server.&#13;This usually increases the request time, but sometimes provides interesting routes..."><input id="routespeeds-option12" type="checkbox"/>Try more</label>'	+
        '</span>'	+
        '</div>'	+

        '<div><label class="" title="note: this only has an effect within about 30 minutes in the past"><input id=routespeeds-option7 type="checkbox"/>Real-Time Traffic</label></div>'	+

        '<div>'	+
        'Route type:<select id=routespeeds-option13 style="margin-left:10px;" >'	+
        '<option value="1">Fastest</option>'	+
        '<option value="3">Fastest (no history)</option>'	+
        '</select>'	+
		'<br>'	+
        'Vehicle type:<select id=routespeeds-option18 style="margin-left:10px;" >'	+
        '<option id=routespeeds-option18-v1 value="PRIVATE">Private</option>'	+
        '<option id=routespeeds-option18-v2 value="TAXI">Taxi</option>'	+
        '<option id=routespeeds-option18-v3 value="MOTORCYCLE">Motorcycle</option>'	+
        '</select>'	+
        '</div>'	+
        '<br>'	+

        '<div>'	+
        '<div style="min-width:55px; display:inline-block;"><b>Avoid:</b></div>'	+
        '<label class=""><input id=routespeeds-option8 type="checkbox"/>Tolls</label>'	+
        line_div_break	+
        '<label class=""><input id=routespeeds-option9 type="checkbox"/>Freeways</label>'	+
         line_div_break	+
        '<label class=""><input id=routespeeds-option16 type="checkbox"/>Difficult Turns</label>'	+
         line_div_break	+
        '<label class=""><input id=routespeeds-option17 type="checkbox"/>Ferries</label>'	+
        '</div>'	+

        '<div style="margin-left:55px">'	+
        '<label class=""><input id=routespeeds-option10 type="checkbox"/>Dirt (Unpaved)</label>'	+
        '<span id=routespeeds-option10-span style="display:none;">'	+
        '<label class=""><input id=routespeeds-option11 type="checkbox"/>Long dirt roads</label>'	+
        '</span>'	+
        '</div>'	+

        '<div>'  +
        '<div style="min-width:55px; display:inline-block;"><b>Allow:</b></div>'	+
        '<label class=""><input id=routespeeds-option14  type="checkbox"/>U-Turns</label>'	+
        line_div_break +
//        '<label class=""><input id=routespeeds-option19  type="checkbox"/>Express/HOT/Fast</label>'	+
//        '</div>'	+
        'Express Pass:<select id=routespeeds-option19 style="margin-left:10px;" >'	+
        '<option id=routespeeds-option19 value="">None</option>'	+
        '<option id=routespeeds-option19 value="*">All</option>'	+
        '<option id=routespeeds-option19 value="fastrak-flex-us">Fastrak Flex</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ktag-us">K-Tag</option>'	+
/*        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
        '<option id=routespeeds-option19 value="ezpass-us">EZ Pass</option>'	+
*/
        '</select>'	+
        '</div>'	+
        '<br>'	+
        '<br>' +
        '<div>'+
        '<div style="margin-left:55px"></div>'	+
        '<label class="" title="Sorts routes in the same order they would appear in the app or livemap"><b>Use Routing Order <b><input id="routespeeds-option15" type="checkbox"/></label>'   +
        '</div>' +                                                                                                 // New Checkbox for Routing Order

        '<b><p id=routespeeds-error style="color:#FF0000"></p></b>'	+

        '<div id=routespeeds-summary1 class=routespeeds_summary_classA></div>'	+
        '<div id=routespeeds-summary2 class=routespeeds_summary_classA></div>'	+
        '<div id=routespeeds-summary3 class=routespeeds_summary_classA></div>'	+
        '<div id=routespeeds-summary4 class=routespeeds_summary_classA></div>'	+
        '<div id=routespeeds-summary5 class=routespeeds_summary_classA></div>'	+
        '<style>'	+
        '.routespeedsmarkerA                  { display:block; width:27px; height:36px; margin-left:-13px; margin-top:-34px; }'	+
        '.routespeedsmarkerB                  { display:block; width:27px; height:36px; margin-left:-13px; margin-top:-34px; }' +
	//+ '.routespeedsmarkerA                  { background:url("http://341444cc-a-62cb3a1a-s-sites.googlegroups.com/site/wazeaddons/routespeeds_marker_a.png"); }'
	//+ '.routespeedsmarkerB                  { background:url("http://341444cc-a-62cb3a1a-s-sites.googlegroups.com/site/wazeaddons/routespeeds_marker_b.png"); }'
        '.routespeedsmarkerA                  { background-image:url(data:image/png;base64,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); }'	+
        '.routespeedsmarkerB                  { background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAkCAYAAAB4+EEtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD/mlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjajZTPbxRlGMc/u/POrAk4B1MBi8GJP4CQQrZgkAZBd7vLtlDLZtti25iY7ezb3bHT2fGd2fIjPXHRG6h/gIocPJh4MsFfES7AQQMJQUNsSEw4lPgjRBIuhtTDTHcHaMX39Mzzfp/v9/s875OBzOdV33fTFsx6oaqU8tb4xKSVuUGaZ1hDN2uqduDnyuUhgKrvuzxy7v1MCuDa9pXv//OsqcnAhtQTQLMW2LOQOga6a/sqBOMWsOdo6IeQeRboUuMTk5DJAl31KC4AXVNRPA50qdFKP2RcwLQb1Rpk5oGeqUS+nogjDwB0laQnlWNblVLeKqvmtOPKhN3HXP/PM+u2lvU2AWuDmZFDwFZIHWuogUocf2JXiyPAi5C67If5CrAZUn+0ZsZywDZIPzWtDoxF+PSrJxqjbwLrIF1zwsHROH/Cmxo+HNWmz8w0D1VizGU76J8Enof0zYYcHIr8aNRkoQj0gLap0RqI+bWDwdxIcZnnRKN/OOLR1DvVg2WgG7T3VbNyOPKsnZFuqRLxaxf9sBx70BY9d3go4hSmDIojy/mwMToQ1YrdoRqNa8XktHNgMMbP+255KPImzqpWZSzGXK2qYiniEX9Lbyzm1DfUqoVDwA7Q93MkVUXSZAqJjcd9LCqUyGPho2gyjYNLCYmHROGknmQGZxVcGYmK4w6ijsRjEYWDvQomUrgdY5pivciKXSIr9oohsU/sEX1Y4jXxutgvCiIr+sTedm05oW9R53ab511aSCwqHCF/uru1taN3Ur3t2FdO3XmguvmIZ7nsJzkBAmbayO3J/i/Nf7ehw3FdnHvr2tpL8xx+3Hz1W/qifl2/pd/QFzoI/Vd9QV/Qb5DDxaWOZBaJg4ckSDhI9nABl5AqLr/h0UzgHlCc9k53d27sK6fuyPeG7w1zsqeTzf6S/TN7Pftp9mz294emvOKUtI+0r7Tvta+1b7QfsbTz2gXtB+2i9qX2beKtVt+P9tuTS3Qr8VactcQ18+ZG8wWzYD5nvmQOdfjM9WavOWBuMQvmxva7JfWSvThM4LanurJWhBvDw+EoEkVAFReP4w/tf1wtNoleMfjQ1u4Re0XbpVE0CkYOy9hm9Bm9xkEj1/FnbDEKRp+xxSg+sHX2Kh3IBCrZ53amkATMoHCYQ+ISIEN5LATob/rHlVNvhNbObPYVK+f7rrQGPXtHj1V1XUs59UYYWEoGUs3J2g7GJyat6Bd9t0IKSK270smFb8C+v0C72slNtuCLANa/3Mlt7YanP4Zzu+2Wmov/+anUTxBM79oZfa3Ng35zaenuZsh8CPc/WFr658zS0v3PQFuA8+6/WQBxeLnbzNAAAAAgY0hSTQAAbZgAAHOOAADyewAAhNoAAG6UAADlGgAAMycAABkXmUkcfwAABqNJREFUeNqsV11Mm+cVfj7bTYkH5tdAiGwwdgy2l6wZFAku4qCY8le1Fx29KZO2i1ai4gapF1RF2bKqkwH1rrIoN3BT5FAKUiONlhExatVkaJpT2/rQFMxsxwhDMTj8uIV88OzCsBIKBJIe6ejT9/6c5z3nfd5z3lfAU4SkAkAagAwAKgBKAAoAEoAEgDUAcQDrgiBIJ9lSnADyIoDspaUlXSAQuDo3N3d1cXFRt7GxkS1J0jmFQrGdmpoay8/PDxYXF3v0er2H5ByAmCAIW6cCIykDkBYOhy8HAoEar9d73e12l7pcruyFhQX54fF5eXk7Vqv11aqqqpkrV678Q6/X/52kb8/T3ZNCJiOp9vl8bzocjjuNjY2rAGg2m3nz5k26XC5GIhGSZCQSocvl4q1bt2g2mwmAjY2Nqw6H447P53uTpHpv4UcCCSSzvV7vW3a7/dvc3FxJq9XS6XRyl2R4mfz6PtkzRv7pdvL79f1k+y5Jp9NJrVbL3NxcyW63f+v1et8imU1SOAoszev1vt7V1fWNSqXasVqtjMfjXFghP75D3rhF6t4l035P4nfJr+7dZPvHd8j5FTIej9NqtVKlUu10dXV94/V6XyeZdhjohdXV1av9/f23CwsLH1dUVDCRSPCfD8iGv5LZf0wCHKdZf0iOm/oPmUgkWFFRwcLCwsf9/f23V1dXr5J8AQD2Y5oeDAavTU5OXovFYorh4WEEY+fx50Hgb/8GYusnH4+VjeS4vwwBwdh5DA8PIxaLKSYnJ68Fg8FrANIPguX5/f7rQ0NDee3t7cjJvYjuL4Gx7w6F+vMn9bCMfQd0fwnk5F5Ee3s7hoaG8vx+/3UAeQAgI6mIRCJan89nSSQSQktLC8Z9wL8CwM4RxBWaftLDgDu7yXnjPqClpQWJRELw+XyWSCSiJamQAVCGQiG9KIo5lZWVyMjMwrgX8IXxTOILA+NeICMzC5WVlRBFMScUCukBKGUAlEtLSxfD4fD5kpISPNoEQt/juST0PfBoEygpKUEoFDq/tLR0EYBSAUC+tbWl3NzclKnVamxsAWs/nJArP3862NoPwMYWkJ+fj83NTfn29vavACgUAB4rlcq19PR0KRqNnpPLALnseENC08/BD7ft25ifn0dmZqaUkpKyBmBbBmDzwoULc0ajcX16ehrKc0BqyvOFMTUFUJ4DpqencenSpbWCgoIAgE0ZgB+LiopmzWZzRBRFLM4/gDbn+cC0OcDi/AOIogiz2RwpKiqaBfCjTBCEHbVavWAymfwajUbq/bQHVjNg0Ry/Zwf1cAgtGqD610Dvpz3QaDSSyWTyq9XqBUEQdvZ3Z7m0tPReTU3N8sDAAF75zS5e1gOCcPwZ29cn+gXgZT1gu7yLgYEB1NTULJeWlt4DsHwwg6xrtVpPeXm5GI1G8cXgZ3jvNaDupbOFr+4l4L3XgC8GP0M0GkV5ebmo1Wo9ANb/DyYIwo5KpQpbLBZXQ0PDI7vdDosG6HgDaPgtkK48GSRdmRzX8UYyjHa7HQ0NDY8sFotLpVKFBUHYOegZAMSMRuNkdXW1XxRFjIyMoKoE6HkHuNkE3LgM6HJ/YmpqSvL/xuVkf887QFUJMDIyAlEUUV1d7TcajZMAYscV0IKxsbGPbDbbWllZGfflYPF0fJUsno6vniye+1JWVkabzbY2Njb2EcmCk64FL4ZCIVt3d7cbAJ1OJ88iTqeTANjd3e0OhUK2vUvTiVe3gomJiQ/r6+vjBoOBkiSdCkiSJBoMBtbX18cnJiY+PMqroxJTzGAw3K2rq7s/OzuL3t7eUzGxt7cXs7OzqKuru28wGO4eu1dHeJfndrvfb2pqWs7KymIsFjvRq1gsxqysLDY1NS273e73SeYdZfe4lLtaXFw8UVtbe0+SJHZ0dJy4uI6ODkiSxNra2nvFxcUTAFbPdEBJZs7MzLzd2toalsvl9Hg8R3rl8Xgol8vZ2toanpmZeZtk5pmTKUk5SdPg4GCfyWTaqqio+BlZJEliZWUlTSbT1uDgYB9JE0n5M2VvkkpRFBs7OzunANDhcDwB5nA4CICdnZ1TMzMzr5JUPle5IJk/NTX1wWGyHCTF1NTUByTzn2ZLdgq8FZ1Od/cwWQ6SQqfT3QWwgl9C9snS1tYWlMvl7Ovro1wuZ1tbW/CZSfE0soyOjn7S3NwcNRqN283NzdHR0dFPzkIK4SxkefjwoTkQCNji8bguIyPjv3q9flyj0YiCICR+UbA9wHN7z13l3hM3LgjC9mnn/28AJu5zt7kjbz8AAAAASUVORK5CYII=); }' +
        '.routespeedsmarkerA:hover            { cursor:move }'	+
        '.routespeedsmarkerB:hover            { cursor:move }'	+
        '.routespeeds_summary_classA          { visibility:hidden; display:inline-block; color:#000000; margin:2px 0px 2px 0px; padding:2px 6px 2px 4px; border:1px solid #c0c0c0; background:#F8F8F8; border-radius:4px; vertical-align:middle; white-space:nowrap; }' +
        '.routespeeds_summary_classB          { visibility:hidden; display:inline-block; color:#000000; margin:2px 0px 2px 0px; padding:2px 6px 2px 4px; border:1px solid #c0c0c0; background:#d0fffe; border-radius:4px; vertical-align:middle; white-space:nowrap; }'	+
        '.routespeeds_summary_classA:hover    { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }'	+
        '.routespeeds_summary_classB:hover    { cursor:pointer; border:1px solid #808080; xbackground:#a0fffd; }'	+
        '.routespeeds_header                  { display:inline-block; width:14px; height:14px; text-align:center; border-radius:2px; margin-right:2px; position:relative; top:2px; }'	+
        '</style>';

	/*var userTabs = getId('user-info');
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];

	newtab = document.createElement('li');
	newtab.innerHTML = '<a id=sidepanel-routespeeds href="#sidepanel-routespeeds" data-toggle="tab" style="" >Route Speeds</a>';
	navTabs.appendChild(newtab);

	addon.id = "sidepanel-routespeeds";
	addon.className = "tab-pane";
	tabContent.appendChild(addon);*/

    new WazeWrap.Interface.Tab('Route Speeds', addon.innerHTML, init);

	window.addEventListener("beforeunload", saveRouteSpeedsOptions, true);
}

function init()
{
	resetOptions();
	loadRouteSpeedsOptions();

	if (routespeedsoption1) getId('sidepanel-routespeeds').style.color = "#A0A0A0";
	else                    getId('sidepanel-routespeeds').style.color = "";

	getId('routespeeds-option6').value  = routespeedsoption6;
	getId('routespeeds-option13').value = routespeedsoption13;
    getId('routespeeds-option18').value = routespeedsoption18;

	getId('routespeeds-option1').onclick        = clickOption1;
	getId('routespeeds-option2').onclick        = clickOption2;
	getId('routespeeds-option3').onclick        = clickOption3;
	getId('routespeeds-option4').onclick        = clickOption4;
	getId('routespeeds-option5').onclick        = clickOption5;
	getId('routespeeds-option6').onchange       = clickOption6;
	getId('routespeeds-option7').onclick        = clickOption7;
	getId('routespeeds-option8').onclick        = clickOption8;
	getId('routespeeds-option9').onclick        = clickOption9;
	getId('routespeeds-option10').onclick       = clickOption10;
	getId('routespeeds-option11').onclick       = clickOption11;
	getId('routespeeds-option12').onclick       = clickOption12;
	getId('routespeeds-option13').onchange      = clickOption13;
	getId('routespeeds-option14').onclick       = clickOption14;
    getId('routespeeds-option15').onclick       = clickOption15;
    getId('routespeeds-option16').onclick       = clickOption16;
    getId('routespeeds-option17').onclick       = clickOption17;
    getId('routespeeds-option18').onchange      = clickOption18;
    getId('routespeeds-option19').onchange      = clickOption19;

	getId('routespeeds-summary1').onclick       = clickRoute1;
	getId('routespeeds-summary2').onclick       = clickRoute2;
	getId('routespeeds-summary3').onclick       = clickRoute3;
	getId('routespeeds-summary4').onclick       = clickRoute4;
	getId('routespeeds-summary5').onclick       = clickRoute5;

	getId('sidepanel-routespeeds-a').onkeydown  = enterAB;
	getId('sidepanel-routespeeds-b').onkeydown  = enterAB;

	getId('routespeeds-button-livemap').onclick = livemapRouteClick;
	getId('routespeeds-button-reverse').onclick = reverseRoute;
	getId('routespeeds-reset-options-to-livemap-route').onclick = resetOptionsToLivemapRouteClick;

	getId('routespeeds-hour').onchange          = hourChange;
	getId('routespeeds-day').onchange           = dayChange;

	getId('routespeeds-button-A').onclick       = clickA;
	getId('routespeeds-button-B').onclick       = clickB;

	window.W.map.events.register("zoomend", null, rezoom);

	window.setInterval(loopWMERouteSpeeds, 500);
	window.setInterval(panningWMERouteSpeeds, 100);
}
//--------------------------------------------------------------------------------------------------------------
bootstrapWMERouteSpeeds();