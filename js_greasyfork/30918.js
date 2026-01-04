// ==UserScript==
// @name				WME DI closures (feed preview)
// @description 		Shows road closures from dopravniinfo.cz in WME
// @include 			https://www.waze.com/editor*
// @include 			https://www.waze.com/*/editor*
// @include 			https://editor-beta.waze.com/*
// @version 			0.82.feed.preview
// @grant				GM_xmlhttpRequest
// @grant				GM_setClipboard
// @connect 			wazer.cz
// @connect 			waze.com
// @copyright			2015-2017, pvo11
// @namespace			https://greasyfork.org/cs/scripts/11009-wme-di-closures-feed
// @downloadURL https://update.greasyfork.org/scripts/30918/WME%20DI%20closures%20%28feed%20preview%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30918/WME%20DI%20closures%20%28feed%20preview%29.meta.js
// ==/UserScript==


const db_server = 'http://jsdi.wazer.cz';

const last_color = '#A05FA5';
const route_color = '#559CAF';
const rsd_color = '#0000FF';


var uOpenLayers;
var uWaze;
var epsg900913;		// Google Spherical Mercator Projection
var epsg4326;		// WGS 84
var diClosuresLayer;
var diClosures = {};

var locks = '';
var locksTimer = -1;

var url_id;
var sel_id = 0;

var route;
var lon_start;
var lat_start;
var lon_end;
var lat_end;


lineWidth = [
	[4, 5],
	[5, 6],
	[6, 7],
	[7, 8],
	[8, 9],
	[10, 12],
	[12, 14],
	[14, 16],
	[15, 17],
	[16, 18],
	[17, 19]
];


function drawLine(line, color, xy) {
	var linePoints = [];

	var zoom = uWaze.map.getZoom();
	if (zoom >= lineWidth.length) {
		zoom = lineWidth.length - 1;
	}
	var p;
	if (xy) {
		p = new uOpenLayers.Geometry.Point(line[0].x, line[0].y).transform(epsg4326, epsg900913);
	} else {
		p = new uOpenLayers.Geometry.Point(line[0][0], line[0][1]).transform(epsg4326, epsg900913);
	}
	linePoints.push(p);
	for(var i = 1; i < line.length-1; i++) {
		var lp1 = line[i];
		var lp2 = line[i + 1];
		
		var dif_lon;
		var dif_lat;
		if (xy) {
			dif_lon = Math.abs(lp1.x - lp2.x);
			dif_lat = Math.abs(lp1.y - lp2.y);
		} else {
			dif_lon = Math.abs(lp1[0] - lp2[0]);
			dif_lat = Math.abs(lp1[1] - lp2[1]);
		}
		
		if (dif_lon < 0.0000001 && dif_lat < 0.0000001) continue;
		
		if (xy) {
			p = new uOpenLayers.Geometry.Point(lp1.x, lp1.y).transform(epsg4326, epsg900913);
		} else {
			p = new uOpenLayers.Geometry.Point(lp1[0], lp1[1]).transform(epsg4326, epsg900913);
		}
		linePoints.push(p);
	}
	if (xy) {
		p = new uOpenLayers.Geometry.Point(line[line.length-1].x, line[line.length-1].y).transform(epsg4326, epsg900913);
	} else {
		p = new uOpenLayers.Geometry.Point(line[line.length-1][0], line[line.length-1][1]).transform(epsg4326, epsg900913);
	}
	linePoints.push(p);
	
	var lineString  = new uOpenLayers.Geometry.LineString(linePoints);
	var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][1]} );
	diClosuresLayer.addFeatures(lineFeature);
	lineString  = new uOpenLayers.Geometry.LineString(linePoints);
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: color, strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][0] } );
	diClosuresLayer.addFeatures(lineFeature);
	lineString  = new uOpenLayers.Geometry.LineString(linePoints);
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: lineWidth[zoom][0] } );
	diClosuresLayer.addFeatures(lineFeature);
}


function showRSDLines()
{
	if (diClosuresLayer.getVisibility()) {
		var extent = uWaze.map.getExtent();

		var oh = 0;
		var pLB = new uOpenLayers.Geometry.Point(extent.left - oh, extent.bottom - oh).transform(epsg900913, epsg4326);
		var pRT = new uOpenLayers.Geometry.Point(extent.right + oh, extent.top + oh).transform(epsg900913, epsg4326);

		GM_xmlhttpRequest({
			method: "POST",
			url: db_server + '/o',
			data: JSON.stringify({l:pLB.x,  r:pRT.x, t:pRT.y, b:pLB.y}),
			headers: {
				'Content-Type': 'application/json',
			},	
			onload: function(response) {
				if (response.status  != 200) {
					return;
				}
				var resp = response.responseText;
				var respJSON = JSON.parse(resp);
				for (var i = 0; i < respJSON.length ; i++) {
					var c = respJSON[i];
					for (var j = 0; j < c.geometry.length; j++) {
						drawLine(c.geometry[j], rsd_color);
					}
				}
			},
		});
	}
}


function drawClosureSegs() {
	if (typeof(diClosures[sel_id].last_segments) === 'undefined') {return;}
	if (diClosures[sel_id].last_segments === null) {return;}

	var zoom = uWaze.map.getZoom();
	if (zoom >= lineWidth.length) {
		zoom = lineWidth.length - 1;
	}

	// Fialová čára
	for (var i = 0; i< diClosures[sel_id].last_segments.length; i++) {
		var seg = diClosures[sel_id].last_segments[i];
		var segment = uWaze.model.segments.get(seg);
		if (typeof(segment) === 'undefined') {continue;}
		var lineString = new uOpenLayers.Geometry.LineString(segment.geometry.components);
		var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: (lineWidth[zoom][1]-2)} );
		diClosuresLayer.addFeatures(lineFeature);
		lineString  = new uOpenLayers.Geometry.LineString(segment.geometry.components);
		lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: last_color, strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: (lineWidth[zoom][0]-2) } );
		diClosuresLayer.addFeatures(lineFeature);
		lineString  = new uOpenLayers.Geometry.LineString(segment.geometry.components);
		lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: (lineWidth[zoom][0]-2) } );
		diClosuresLayer.addFeatures(lineFeature);
		
	}
}


function drawEndPoints() {
	// Značky začátku a konce uzavírky dle JSDI ("kroužky" s písmeny A, B)
	var start_circle = new uOpenLayers.Geometry.Point(lon_start, lat_start).transform(epsg4326, epsg900913);
	var end_circle =  new uOpenLayers.Geometry.Point(lon_end, lat_end).transform(epsg4326, epsg900913);
	var circleStyleStart = {
		strokeColor: "#CEBC4B", strokeWidth: 6, strokeDashstyle: "solid",
		fillColor: "#CEBC4B", fillOpacity: 0.5,
		label: "A", labelOutlineColor: "#000", labelOutlineWidth: "3",
		fontSize: "18px", fontWeight: "bold", fontColor: "#CEBC4B",
		pointRadius: 20 };
	diClosuresLayer.addFeatures(new uOpenLayers.Feature.Vector(start_circle, null, circleStyleStart));
	var circleStyleEnd = Object.create(circleStyleStart);
	circleStyleEnd.label = "B";
	diClosuresLayer.addFeatures(new uOpenLayers.Feature.Vector(end_circle, null, circleStyleEnd));
}


function requestRoute()
{
	if (diClosuresLayer.getVisibility() && typeof(lon_start) !== 'undefined' && typeof(lon_end) !== 'undefined' ) {
		var minx = Math.min(lon_start, lon_end) - 0.001;
		var miny = Math.min(lat_start, lat_end) - 0.0005;
		var maxx = Math.max(lon_start, lon_end) + 0.001;
		var maxy = Math.max(lat_start, lat_end) + 0.0005;
		var p1 = new uOpenLayers.Geometry.Point(minx, miny).transform(epsg4326, epsg900913);
		var p2 = new uOpenLayers.Geometry.Point(maxx, maxy).transform(epsg4326, epsg900913);
		uWaze.map.zoomToExtent([p1.x, p1.y, p2.x, p2.y], false);
		
		var routing_url = 'https://www.waze.com/row-RoutingManager/routingRequest?from=x%3A' + lon_start + '+y%3A' + lat_start + '+bd%3Atrue&to=x%3A' + lon_end + '+y%3A' + lat_end + '+bd%3Atrue&returnJSON=true&returnGeometries=true&returnInstructions=false&type=DISTANCE&clientVersion=4.0.0&timeout=60000&nPaths=1&options=AVOID_TOLL_ROADS%3Af%2CAVOID_PRIMARIES%3Af%2CAVOID_TRAILS%3Af%2CALLOW_UTURNS%3At';

		GM_xmlhttpRequest({
			method: "GET",
			url: routing_url,
			onload: function(response) {
				if (response.status  != 200) {
					return;
				}
				route = JSON.parse(response.responseText);
				if (typeof(route.response) !== 'undefined') {
					if (route.response.results.length === 1) {
						var tmp = route.coords[route.coords.length-1];
						route.coords[route.coords.length-1] = route.coords[route.coords.length-2];
						route.coords[route.coords.length-2] = tmp;
					}
					drawLine(route.coords, route_color, true);
					drawEndPoints();
				}
			},
		});
	}

}


function reverseRouting()
{
	var tmp;
	
	tmp = lon_start;
	lon_start = lon_end;
	lon_end = tmp;
	tmp = lat_start;
	lat_start = lat_end;
	lat_end = tmp;
	
	diClosuresLayer.destroyFeatures();
	requestRoute();
}


function requestClosures()
{
	if (diClosuresLayer.getVisibility()) {
		hideAll();
		var extent = uWaze.map.getExtent();

		var oh = 0;
		var pLB = new uOpenLayers.Geometry.Point(extent.left - oh, extent.bottom - oh).transform(epsg900913, epsg4326);
		var pRT = new uOpenLayers.Geometry.Point(extent.right + oh, extent.top + oh).transform(epsg900913, epsg4326);
		var getOld = getId("cbDIold").checked;
		diClosures = {};
		locks = '';
		var idsJSON = [];
		getId('DIClosuresListTable').innerHTML="";

		GM_xmlhttpRequest({
			method: "POST",
			url: db_server + '/r',
			data: JSON.stringify({l:pLB.x,  r:pRT.x, t:pRT.y, b:pLB.y, old:getOld}),
			headers: {
				'Content-Type': 'application/json',
			},	
			onload: function(response) {
				if (response.status  != 200) {
					return;
				}
				var resp = response.responseText;
				var respJSON = JSON.parse(resp);
				var urlInList = false;
				for (var i = 0; i < respJSON.length ; i++) {
					var id = respJSON[i].id;
					diClosures[String(id)] = respJSON[i];
					idsJSON.push(id);
					if (id === url_id) {
						urlInList = true;
					}
				}
				if (urlInList) {
					showClosure(url_id);
				} else {
					showClsrList();
				}
				var u = uWaze.loginManager.getLoggedInUser().userName;
				dicid = u + '-' + Date.now ( );
				locks = JSON.stringify({dicid: dicid, user: u, closures: idsJSON});
				handleLocks();
				if (locksTimer === -1) {
					locksTimer = setInterval(handleLocks, 30000);
				}
			},
		});
	}
}

function showClsrList() {
	getId('DIClosuresListTable').innerHTML = '';
	for (var id in diClosures) {
		var closureRow = document.createElement('div');
		closureRow.className="divDIClRow";
		closureRow.id = "DIClosureRow_"+id;
		
		var showdiv = document.createElement('div');
		showdiv.className="divDIClShow";
		var showa = document.createElement('a');
		var openParts = diClosures[id].open_time.match(/(\d+)\.(\d+)\.(\d+) (\d+):(\d+)/);
		var openTime = new Date(openParts[3], openParts[2] - 1, openParts[1], openParts[4], openParts[5]);
		var currentTime = new Date();

		if (openTime > currentTime) {
			if (diClosures[id].probable_closure) {
				showa.innerHTML='<i class="waze-icon-edit" style="background-color: #eb7171;" title="Vybrat událost"></i>';
			} else {
				showa.innerHTML='<i class="waze-icon-edit" style="background-color: #19B326;" title="Vybrat událost"></i>';
			}
			if (diClosures[id].in_wme === true) {
				showdiv.style.backgroundColor = "#eb7171";
			} else if (diClosures[id].in_wme === false) {
				showdiv.style.backgroundColor = "#19B326";
			}
		} else {
			showa.innerHTML='<i class="waze-icon-edit" style="background-color: #cc9900;" title="Vybrat událost"></i>';
		}
		showa.href = 'https://www.waze.com/cs/editor/?env=row&lon=' + diClosures[id].lon_start + '&lat=' + diClosures[id].lat_start + '&layers=25988&zoom=5&di_id=' + id;
		showa.onclick = getFunctionWithArgs(showClosure, [id]);
		showa.className = "notReload";
		showdiv.appendChild(showa);
		showa = document.createElement('a');
		showa.innerHTML='<i class="fa fa-link"></i>';
		showa.target = "_blank";
		showa.href = "http:jsdi.wazer.cz/history?id=" + id;
		showa.title = "Historie události";
		showdiv.appendChild(showa);
		closureRow.appendChild(showdiv); 

		var descrdiv = document.createElement('div');
		if (id == url_id) {
			descrdiv.className="divDIClDescUrl";
		} else if (id == sel_id) {
			descrdiv.className="divDIClDescSel";
		} else {
			descrdiv.className="divDIClDesc";
		}
		descrdiv.innerHTML = diClosures[id].txtmce + "<br><b>"+ diClosures[id].close_time + " - " + diClosures[id].open_time + "</b><br>" + diClosures[id].txpl;
		closureRow.appendChild(descrdiv);
		getId('DIClosuresListTable').appendChild(closureRow);
	}
	$('.notReload').on('click', function(event) {
		event.preventDefault();
	});
}

function showClosure(id)
{
	diClosuresLayer.destroyFeatures();
	sel_id = id;
	showClsrList();

	var clDialog = getId("DIClDialog");
	if (clDialog === null) {
		clDialog = document.createElement('section');
		clDialog.id = 'DIClDialog';
		clDialog.className = 'sectDIClDialog';
		clDialog.style.display = "block";
		clDialog.innerHTML  = '<div class="divDIClKontejner">' +
			'<div>'+
			'<button class="btn btn-info btn-block" id="btnDILastSelect">Minulé segmenty</button>' +
			'<button class="btn btn-primary btn-block" id="btnDIRouteSelect">Vybrat routing</button>' +
			'<button class="btn btn-warning btn-block" id="btnDIReverse">Otočit routing</button><br>' +
			'<button class="btn btn-info btn-block" id="btnDIRSDLines" style="background-color: ' + rsd_color + ';">ŘSD čáry</button>' +
			'</div><br>' +
			'<div>' +
			'<button class="btn btn-default" id="btnDIClose" style="float: right">Zavřít</button><br><br>' +
			'<b>Vybrat</b><br>' +
			'&nbsp;&nbsp;<label><input type="checkbox" id="cbDILine" checked /><b>DI čára</b></label><br>' +
			'&nbsp;&nbsp;<label><input type="checkbox" id="cbDICross" /><b>křížení</b></label><br>' +
			'</div>' +
			'</div><br>' + 
			'<div class="divDIClKontejner">' +
			'<div>'+
			'<button class="btn btn-success btn-block" id="btnDIDeleteClosure" >Smaž uzavírku / NE</button>' +
			'</div>' +
			'<div>'+
			'<button class="btn btn-danger btn-block" id="btnDIUpdateClosure" >Přidej / Uprav</button>' +
			'</div>' +
			'</div>' +
			'<div class="form-group">' +
			'<label class="control-label" for="closure_reason">Popis</label>' +
			'<div class="controls">' +
			'<input id="DIClReason" class="form-control" name="closure_reason" type="text">' +
			'</div>' +
			'</div>' +
			'<div class="form-group">' +
			'<label class="control-label" for="closure_direction">Směr</label>' +
			'<div style="width: 60%;" class="controls">' +
			'<select id="DIClDirection" class="form-control" name="closure_direction">' +
			'<option value="1">Obousměrný ( &#xf0ec; )</option><option value="2">Jednosměrný (A&#8594;B)</option><option value="3">Jednosměrný (B&#8594;A)</option><option value="4">Smíšený (?)</option></select>' +
			'</div>' +
			'</div>' +
			'<div class="form-group">' +
			'<label class="control-label" for="closure_startDate">Začátek</label>' +
			'<div class="controls">' +
			'<div style="width: 58%" class="date date-input-group input-group pull-left">' +
			'<input id="DIClStartDate" class="form-control start-date" type="text" name="closure_startDate">' +
			'<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
			'</div>' +
			'</div>' +
			'<div style="width: 42%;" class="bootstrap-timepicker input-group pull-left">' +
			'<input id="DIClStartTime" class="form-control start-time" type="text" name="closure_startTime">' +
			'<span class="input-group-addon"><i class="fa fa-clock-o"></i></span>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="form-group">' +
			'<label class="control-label" for="closure_endDate">Konec</label>' +
			'<div class="controls">' +
			'<div style="width: 58%" class="date date-input-group input-group pull-left">' +
			'<input id="DIClEndDate" class="form-control end-date" type="text" name="closure_endDate">' +
			'<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
			'</div>' +
			'</div>' +
			'<div style="width: 42%;" class="bootstrap-timepicker input-group pull-left">' +
			'<input id="DIClEndTime" class="form-control start-time" type="text" name="closure_endTime">' +
			'<span class="input-group-addon"><i class="fa fa-clock-o"></i></span>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<br>' +
			'<section id="DIClStatus"></section>' + 
			'<section id="DIClDescr"></section>';
		uWaze.map.div.appendChild(clDialog);
		
		$("#DIClStartDate,#DIClEndDate").daterangepicker({singleDatePicker:!0, locale:{format:"DD.MM.YYYY"}});
		$("#DIClStartTime,#DIClEndTime").timepicker({defaultTime:"00:00", showMeridian:!1, template:!1});

		
	} else {
		clDialog.style.display = "block";
	}

	getId("btnDILastSelect").onclick = selectLastSegments;
	getId("btnDIRouteSelect").onclick = selectRoutingSegments;
	getId("btnDIReverse").onclick = reverseRouting;
	getId("btnDIDeleteClosure").onclick = deleteClosure;
	getId("btnDIUpdateClosure").onclick = updateClosure;
	getId("btnDIRSDLines").onclick = showRSDLines;
	getId("btnDIClose").onclick = closeDIClDialog;

	var closeParts = diClosures[sel_id].close_time.match(/(\d+)\.(\d+)\.(\d+) (\d+):(\d+)/);
	var openParts = diClosures[sel_id].open_time.match(/(\d+)\.(\d+)\.(\d+) (\d+):(\d+)/);

	if (closeParts.length === 6 && openParts.length === 6) {
		var duvod = diClosures[sel_id].txtmce;
		if (duvod.length > 9) {
			if (duvod.substr(0,9) === 'uzavřeno ') {
				duvod = duvod.substr(9);
			} else if (duvod.substr(0,10) === 'uzavřeno, ') {
				duvod = duvod.substr(10);
			} else if (duvod.substr(0,9) === 'uzavřeno,') {
				duvod = duvod.substr(9);
			}
		} else if (duvod === 'uzavřeno') {
			duvod = '';
		}
		if (duvod !== '') {
			duvod = ' ' + duvod;
		}
		var doba = ' do ';
		if ((closeParts[1] === openParts[1]) && (closeParts[2] === openParts[2]) && (closeParts[3] === openParts[3])) {
			doba += parseInt(openParts[4], 10) + ':' + openParts[5];
		} else {
			doba += parseInt(openParts[1], 10) + '.' + parseInt(openParts[2], 10) + '.' + openParts[3];
		}
		getId('DIClReason').value = 'Uzavřeno' + doba + ' (JSDI)' + duvod;

		var months = (parseInt(openParts[3], 10) - parseInt(closeParts[3], 10)) * 12 + parseInt(openParts[2], 10) - parseInt(closeParts[2], 10);
		if (parseInt(openParts[1], 10) >= parseInt(closeParts[1], 10)) {
			months++;
		}
		var startDate;
		var endDate;
		if (months > 6) {
			startDate = new Date(closeParts[3], closeParts[2] - 1, closeParts[1]);
			currDate = new Date();
			if (startDate.getTime() < currDate.getTime()) {
				startDate = currDate;
				closeParts[4] = '0';
				closeParts[5] = '0';
				months = (parseInt(openParts[3], 10) - startDate.getFullYear()) * 12 + parseInt(openParts[2], 10) - startDate.getMonth() - 1;
				if (parseInt(openParts[1], 10) >= startDate.getDate()) {
					months++;
				}
				if (months > 6) {
					endDate = plus6months(startDate.getFullYear(), startDate.getMonth());
				} else {
					endDate = new Date(openParts[3], openParts[2] - 1, openParts[1]);
				}
			} else {
				endDate = plus6months(startDate.getFullYear(), startDate.getMonth());
			}
		} else {
			startDate = new Date(closeParts[3], closeParts[2] - 1, closeParts[1]);
			endDate = new Date(openParts[3], openParts[2] - 1, openParts[1]);
		}
		$("#DIClStartDate").data('daterangepicker').setStartDate(startDate);
		$("#DIClStartTime").timepicker('setTime', closeParts[4] + ':' + closeParts[5]);
		$("#DIClEndDate").data('daterangepicker').setStartDate(endDate);
		$("#DIClEndTime").timepicker('setTime', openParts[4] + ':' + openParts[5]);
	}
				
	getStatus();

	getId('DIClDescr').innerHTML = "<b>" + diClosures[id].close_time + " - " + diClosures[id].open_time + "</b><br>" + diClosures[id].mtxt;

	lon_start = diClosures[id].lon_start;
	lat_start = diClosures[id].lat_start;
	lon_end = diClosures[id].lon_end;
	lat_end = diClosures[id].lat_end;
	requestRoute();

	setTimeout(drawClosureSegs, 100);
	setTimeout(drawClosureSegs, 2000);
}


function closeDIClDialog() {
	diClosuresLayer.destroyFeatures();
	var clDialog = getId("DIClDialog");
	clDialog.style.display = "none";
}


function deleteClosure() {
}


function updateClosure() {
}


function getStatus() {

	GM_xmlhttpRequest({
		method: "POST",
		url: db_server + '/st',
		data: JSON.stringify({id:sel_id}),
		headers: {
			'Content-Type': 'application/json',
		},
		onload: function(response) {
			var html = '';
			if (response.status  != 200) {
				getId("DIClStatus").innerHTML = '<span id=locklist style="color: red">Server response ERROR: ' + response.status + '!!!</span>';
			} else {
				var resp = response.responseText;
				var respJSON = JSON.parse(resp);
				html = '<table><tr><td>';
				html += '<input type="text" id="DIClStRemark" style="width: 240px; height:20px" value="' + respJSON[0].remark + '"><button type="button" id="DIClStZapis" style="width: 40px; height:20px">zapiš</button><br>';
				html += '</td></tr><tr><td style="padding-left: .5em;"';
				switch (respJSON[0].flags) {
					case 0:
						switch (respJSON[0].in_wme) {
							case 'ANO':
								html += ' bgcolor="Salmon"';
								break;
							case 'NE':
								html += ' bgcolor="LightGreen"';
								break;
							default:
								break;
						}
						break;
					case 1:
						html += ' bgcolor="Yellow"';
						break;
					case 2:
					case 3:
					case 4:
						html += ' bgcolor="Beige"';
						break;
					default:
						break;
				}
				html += '><b>'+ respJSON[0].in_wme + '</b>';
				html += '<select id="DIClStFlags" style="height:20px; margin-left: 2em;"><option value=0';
				if (respJSON[0].flags === 0) {
					html += ' selected=true';
				}
				html += '></option><option value=1';
				if (respJSON[0].flags === 1) {
					html += ' selected=true';
				}
				html += '>hlídat!</option><option value=2';
				if (respJSON[0].flags === 2) {
					html += ' selected=true';
				}
				html += '>před koncem</option><option value=3';
				if (respJSON[0].flags === 3) {
					html += ' selected=true';
				}
				html += '>po skončení</option><option value=4';
				if (respJSON[0].flags === 4) {
					html += ' selected=true';
				}
				html += '>po upd. mapy</option></select><button type="button" id="DIClStNastav" style="height:20px">nastav</button>';
				html += '<button type="button" id="DIClIimesOk" style="height:20px">časy OK</button>';
				html += '</td></tr></table>';
				getId("DIClStatus").innerHTML = html;
				getId("DIClStZapis").onclick = sendRemark;
				getId("DIClStNastav").onclick = sendFlags;
				getId("DIClIimesOk").onclick = sendTimesOk;
			}
		},
		ontimeout: function(response) {
			getId("DIClStatus").innerHTML = '<span id=locklist style="color: red">Server timeout!!!</span>';
		},
		onerror: function(response) {
			getId("DIClStatus").innerHTML = '<span id=locklist style="color: red">Request error!!!</span>';
		}
	});
}


function postUpdate(json) {
	json.id = sel_id;
	json.user = uWaze.loginManager.getLoggedInUser().userName;
	
	GM_xmlhttpRequest({
		method: "POST",
		url: db_server + '/u',
		data: JSON.stringify(json),
		headers: {
			'Content-Type': 'application/json',
		},
		onload: function(response) {
			if (response.status  != 200) {
			}
			getStatus();
		}
	});
}


function sendRemark() {
	postUpdate({remark: getId("DIClStRemark").value}); 
}


function sendNe() {
	postUpdate({in_wme: false}); 
}


function sendFlags() {
	postUpdate({flags: getId("DIClStFlags").value}); 
}

function sendTimesOk() {
	postUpdate({wme_times_ok: true}); 
}


function handleLocks() {

	if (locks !== '') {
		GM_xmlhttpRequest({
			method: "POST",
			url: db_server + '/l',
			data: locks,
			headers: {
				'Content-Type': 'application/json',
			},
			onload: function(response) {
				var users = '';
				if (response.status  != 200) {
					users = 'Server response ERROR: ' + response.status + '!!!';
				} else {
					var resp = response.responseText;
					var respJSON = JSON.parse(resp);
					for (var i = 0; i < respJSON.length ; i++) {
						if (users !== '') {
							users  += ', ';
						}
						users += respJSON[i];
					}
				}
				getId("locklist").innerHTML = users;
			},
			ontimeout: function(response) {
				getId("locklist").innerHTML = 'Server timeout!!!';
			},
			onerror: function(response) {
				getId("locklist").innerHTML = 'Request error!!!';
			}
		});
	}
}

	
function hideAll()
{
	diClosuresLayer.destroyFeatures();
	sel_id = 0;
	showClsrList();
}


function selectRoutingSegments()
{
	if (!getId("cbDILine").checked && !getId("cbDICross").checked) {return;}
	if (typeof(route) === 'undefined' || typeof(route.error) != 'undefined') {return;}
	if (sel_id === 0) {return;}

	var foundSegs = {};
	var segment, seg, i;
	
	for (i = 0; i < route.response.results.length; i++) {
		seg = route.response.results[i].path.segmentId;
		segment = uWaze.model.segments.get(seg);
		if (typeof(segment) !== 'undefined') {
			foundSegs[String(seg)] = seg;
		}
	}

	var nodeNumSegments = [];
	for (seg in foundSegs) {
				segment = uWaze.model.segments.get(seg);
		if (typeof(nodeNumSegments[segment.attributes.fromNodeID]) === "undefined") {
			nodeNumSegments[segment.attributes.fromNodeID] = 1;
		} else {
			nodeNumSegments[segment.attributes.fromNodeID]++;
		}
		if (typeof(nodeNumSegments[segment.attributes.toNodeID]) === "undefined") {
			nodeNumSegments[segment.attributes.toNodeID] = 1;
		} else {
			nodeNumSegments[segment.attributes.toNodeID]++;
		}
	}

	selectedSegs = [];
	if (getId("cbDILine").checked) {
		for (seg in foundSegs) {
			segment = uWaze.model.segments.get(seg);
			selectedSegs.push(segment);
		}
	}

	if (getId("cbDICross").checked) {
		var foundCrosses = {};
		var foundNodes = Object.keys(nodeNumSegments);
		for (i = 0; i < foundNodes.length; i++) {
			if (nodeNumSegments[foundNodes[i]] > 1) {
				for (var j = 0; j < uWaze.model.nodes.get(foundNodes[i]).attributes.segIDs.length; j++) {
					seg = uWaze.model.nodes.get(foundNodes[i]).attributes.segIDs[j];
					if (typeof(foundSegs[String(seg)]) === "undefined") {
						segment = uWaze.model.segments.get(seg);
						var roadType = segment.attributes.roadType;
						if (roadType != 5 && roadType != 10 && roadType != 16 && roadType != 18 && roadType != 19) {
							foundCrosses[String(seg)] = seg;
						}
					}
				}
			}
		}


		for (seg in foundCrosses) {
			segment = uWaze.model.segments.get(seg);
			selectedSegs.push(segment);
		}
	}
	uWaze.selectionManager.select(selectedSegs);
}


function selectLastSegments()
{
	if (sel_id === 0) {return;}
	if (typeof(diClosures[sel_id].last_segments) === 'undefined') {return;}
	if (diClosures[sel_id].last_segments === null) {return;}

	selectedSegs = [];
	for (var i = 0; i< diClosures[sel_id].last_segments.length; i++) {
		var seg = diClosures[sel_id].last_segments[i];
		var segment = uWaze.model.segments.get(seg);
		selectedSegs.push(segment);
	}
	uWaze.selectionManager.select(selectedSegs);
}


function plus6months (year, month)
{
	var m = month + 6;
	var y = year;
	if (m > 11) {
		m -= 12;
		y += 1;
	}
	var d = new Date(y, m, 1);
	d.setDate(d.getDate()-1);
	return (d);
}


function loadCss() {
	var cssEl = document.createElement("style");
	cssEl.type = "text/css";
	var css = ".divDIClRow { display: flex; flex-flow: flex-start; justify-content: flex-start; line-height:16px; border-top: 1px solid #D6D9DC; }";
	css += ".divDIClShow { display: block; text-align: center; width: 22px; margin-right: 8px; }";
	css += ".divDIClShow .waze-icon-edit { display:inline-block; width: 18px; height: 18px; margin: 4px 0; padding-top: 1px; font-size: 14px; color: #FFF; text-align: center; border-radius: 50%; }";
	css += ".divDIClShow .fa-link { display:inline-block; width: 18px; height: 18px; margin: 3px 0 0; padding-top: 3px; font-size: 13px; color: #FFF; background-color: #5BABBD; text-align: center; border-radius: 50%; }";
	css += ".divDIClDesc { display: block; text-align:left; width: 270px; flex: flex-shrink; }";
	css += ".divDIClDescUrl { float:left; text-align:left; padding-left: 0; max-width:270px; background-color:Yellow; }";
	css += ".divDIClDescSel { float:left; text-align:left; padding-left: 0; width:270px; background-color:LemonChiffon; }";
	css += ".sectDIClDialog { border: 2px solid #eff1f7; width: 100%; float: left; display: none; position: absolute; padding: 0 0px;  border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-top-left-radius: 10px; border-top-right-radius: 10px; background-color: #f2f6fc; width: 300px; z-index: 9999; left: 10px; top: 10px;}";
	css += ".divDIClKontejner { display: flex; flex-flow: flex-start; justify-content: flex-start; width: 100%; }";
	css += ".divDIClKontejner div { display: block; width: 150px; }";
	css += "#diclosures button { width: 140px; }";
	css += "#diclosures hr { margin: 2px; }";
	css += "#DIClStatus, #DIClDescr, #DIClosuresList { padding-top: 8px; font-size: 10px; }";
	cssEl.innerHTML = css;
	document.body.appendChild(cssEl);
}


function getElementsByClassName(classname, node)
{
	if(!node) {
		node = document.getElementsByTagName("body")[0];
	}
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++) {
		if (re.test(els[i].className)) {
			 a.push(els[i]);
		 }
	 }
	return a;
}


function getFunctionWithArgs(func, args) {
    return (
        function () {
            var json_args = JSON.stringify(args);
            return function() {
                var args = JSON.parse(json_args);
                func.apply(this, args);
            };
        }
    )();
}


function getId(node)
{
	return document.getElementById(node);
}


function diClosures_init()
{

	loadCss();

	uOpenLayers = unsafeWindow.OpenLayers;
	epsg900913 = new uOpenLayers.Projection("EPSG:900913");
	epsg4326   = new uOpenLayers.Projection("EPSG:4326");

	uWaze = unsafeWindow.Waze;

	diClosuresLayer = new uOpenLayers.Layer.Vector("DI closures", {
		displayInLayerSwitcher: true,
		uniqueName: "__DrawDIClosures"
	});

	uWaze.map.addLayer(diClosuresLayer);
	var roadGroupSelector = document.getElementById('layer-switcher-group_road');
	if (roadGroupSelector !== null) {
		var roadGroup = roadGroupSelector.parentNode.parentNode.querySelector('.children');
		var toggler = document.createElement('li');
		var togglerContainer = document.createElement('div');
		togglerContainer.className = 'controls-container toggler';
		var checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = 'layer-switcher-item_di_closures';
		checkbox.className = 'toggle';
		checkbox.checked = diClosuresLayer.getVisibility();
		checkbox.addEventListener('click', function(e) {
			diClosuresLayer.setVisibility(e.target.checked);
		});
		togglerContainer.appendChild(checkbox);
		var label = document.createElement('label');
		label.htmlFor = checkbox.id;
		var labelText = document.createElement('span');
		labelText.className = 'label-text';
		labelText.appendChild(document.createTextNode('DI closures'));
		label.appendChild(labelText);
		togglerContainer.appendChild(label);
		toggler.appendChild(togglerContainer);
		roadGroup.appendChild(toggler);
	}

	var addon = document.createElement('section');
	addon.innerHTML  = '<b><u><a href="https://greasyfork.org/cs/scripts/11009-wme-di-closures" target="_blank">WME DI closures</a></u></b> &nbsp; v' + GM_info.script.version;

	var section = document.createElement('section');
	section.style.paddingTop = "8px";
	section.style.fontSize = "12px";
	section.id = "diclosures";
	section.innerHTML  = '<b>Lidé okolo: <span id=locklist style="color:red"></span></b><br>' +
		'<div class="divDIClKontejner">' +
		'<div>' +
		'<button class="btn btn-default btn-block" id="btnDIReadData">Načíst data</button>' +
		'<label><input type="checkbox" id="cbDIold"/><b> i ukončené uzavírky</b></label>' +
		'</div>' +
		'<div>' +
		'<b>Tabulky:</b> <a href="http://jsdi.wazer.cz/check" target="_blank"><i class="fa fa-link"></i> check</a>, <a href="http://jsdi.wazer.cz/all" target="_blank"><i class="fa fa-link"></i> all</a>' +
		'</div>' +
		'</div>';
	addon.appendChild(section);
	
	section = document.createElement('section');
	section.id = "DIClosuresList";
	var diClosuresTable = "<div id='DIClosuresListTable'></div>";
	section.innerHTML  = diClosuresTable;
	addon.appendChild(section);

	var userTabs = getId('user-info');
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];

	newtab = document.createElement('li');
	newtab.innerHTML = '<a href="#sidepanel-diclosures" data-toggle="tab" title="DI closures">DIC</a>';
	navTabs.appendChild(newtab);

	addon.id = "sidepanel-diclosures";
	addon.className = "tab-pane";
	tabContent.appendChild(addon);

	getId("btnDIReadData").onclick = requestClosures;
	
	url_id = location.search.split('di_id=')[1];
	if (typeof(url_id) !== 'undefined') {
		url_id = url_id.split('&')[0];
		$('#user-info a[href="#sidepanel-diclosures"]').tab('show');
		requestClosures();
	}
	

}


function diClosures_bootstrap()
{
	if ((typeof(unsafeWindow.OpenLayers) === 'undefined') || (typeof(unsafeWindow.Waze) === 'undefined') || (typeof(unsafeWindow.Waze.model) === 'undefined') ||
		(getId('user-info') === null) || (document.querySelector('.list-unstyled.togglers .group') === null)) {
		setTimeout(diClosures_bootstrap, 500);
	} else {
		diClosures_init();
	}
}


diClosures_bootstrap();
