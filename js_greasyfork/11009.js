// ==UserScript==
// @name				WME DI closures
// @description 		Shows road closures from dopravniinfo.cz in WME
// @match 				https://www.waze.com/*editor*
// @match 				https://beta.waze.com/*editor*
// @version 			1.59
// @grant				GM_xmlhttpRequest
// @grant				GM_setClipboard
// @connect 			wazer.cz
// @connect 			waze.com
// @copyright			2015-2025, pvo11
// @namespace			https://greasyfork.org/cs/scripts/11009-wme-di-closures
// @icon				data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNS0wNS0wMVQxNTowNTo2MDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjMuMjwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj41MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNl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
// @downloadURL https://update.greasyfork.org/scripts/11009/WME%20DI%20closures.user.js
// @updateURL https://update.greasyfork.org/scripts/11009/WME%20DI%20closures.meta.js
// ==/UserScript==


/* global jQuery */
const db_server = 'http://jsdi.wazer.cz';

var uOpenLayers;
var uWaze;
var epsg900913; 	// Google Spherical Mercator Projection
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

var lineWidth = [
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

function drawOtherLine(line) {
	var linePoints = [];

	var zoom = uWaze.map.getZoom();
	if (zoom >= lineWidth.length) {
		zoom = lineWidth.length - 1;
	}
	var p = new uOpenLayers.Geometry.Point(line[0][0], line[0][1]).transform(epsg4326, epsg900913);
	linePoints.push(p);
	for(var i = 1; i < line.length-1; i++) {
		var lp1 = line[i];
		var lp2 = line[i + 1];

		var dif_lon = Math.abs(lp1[0] - lp2[0]);
		var dif_lat = Math.abs(lp1[1] - lp2[1]);

		if (dif_lon < 0.0000001 && dif_lat < 0.0000001) continue;
		p = new uOpenLayers.Geometry.Point(lp1[0], lp1[1]).transform(epsg4326, epsg900913);
		linePoints.push(p);
	}
	p = new uOpenLayers.Geometry.Point(line[line.length-1][0], line[line.length-1][1]).transform(epsg4326, epsg900913);
	linePoints.push(p);
	var lineString	= new uOpenLayers.Geometry.LineString(linePoints);
	var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][1]} );
	diClosuresLayer.addFeatures(lineFeature);
	lineString	= new uOpenLayers.Geometry.LineString(linePoints);
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#0000FF', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][0] } );
	diClosuresLayer.addFeatures(lineFeature);
	lineString	= new uOpenLayers.Geometry.LineString(linePoints);
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: lineWidth[zoom][0] } );
	diClosuresLayer.addFeatures(lineFeature);
}


function drawOtherClosure(c) {
	for (var i = 0; i < c.geometry.length; i++) {
		drawOtherLine(c.geometry[i]);
		/*		var line = [];
		for (var j = 0; j < parts[i]; j++) {
			if (idx < points.length) {
				line[j] = points[idx];
			} else {
				return;
			}
			idx++;
		}
		drawLine(line); */
	}
}


function startTest() {
	if (diClosuresLayer.getVisibility()) {
		//		hideAll();
		var extent = uWaze.map.getExtent();

		var oh = 0;

		var pLB = new uOpenLayers.Geometry.Point(extent[0] - oh, extent[3] - oh);
		var pRT = new uOpenLayers.Geometry.Point(extent[2] + oh, extent[1] + oh);
		//		getId('DIClosuresListTable').innerHTML="";

		GM_xmlhttpRequest({
			method: "POST",
			url: db_server + '/o',

			data: JSON.stringify({l:pLB.x,	r:pRT.x, b:pRT.y, t:pLB.y}),
			headers: {
				'Content-Type': 'application/json',
			},
			onload: function(response) {
				if (response.status != 200) {
					return;
				}
				var resp = response.responseText;
				var respJSON = JSON.parse(resp);
				for (var i = 0; i < respJSON.length ; i++) {
					drawOtherClosure(respJSON[i]);
				}
			},
		});
	}
}


function drawRoute() {
	if (typeof(route.response.coords) !== 'undefined') {
		var linePoints = [];

		var zoom = uWaze.map.getZoom();
		if (zoom >= lineWidth.length) {
			zoom = lineWidth.length - 1;
		}

		// Modrá čára
		var p = new uOpenLayers.Geometry.Point(route.response.coords[0].x, route.response.coords[0].y).transform(epsg4326, epsg900913);
		linePoints.push(p);
		for(var i = 1; i < route.response.coords.length-1; i++) {
			var lp1 = route.response.coords[i];
			var lp2 = route.response.coords[i + 1];

			var dif_lon = Math.abs(lp1.x - lp2.x);
			var dif_lat = Math.abs(lp1.y - lp2.y);

			if (dif_lon < 0.0000001 && dif_lat < 0.0000001) continue;
			p = new uOpenLayers.Geometry.Point(lp1.x, lp1.y).transform(epsg4326, epsg900913);
			linePoints.push(p);
		}
		p = new uOpenLayers.Geometry.Point(route.response.coords[route.response.coords.length-1].x, route.response.coords[route.response.coords.length-1].y).transform(epsg4326, epsg900913);
		linePoints.push(p);
		var lineString	= new uOpenLayers.Geometry.LineString(linePoints);
		var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][1]} );
		diClosuresLayer.addFeatures(lineFeature);
		lineString	= new uOpenLayers.Geometry.LineString(linePoints);
		lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#559CAF', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][0] } );
		diClosuresLayer.addFeatures(lineFeature);
		lineString	= new uOpenLayers.Geometry.LineString(linePoints);
		lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: lineWidth[zoom][0] } );
		diClosuresLayer.addFeatures(lineFeature);
	}

	setTimeout(drawClosureSegs, 100);
	setTimeout(drawClosureSegs, 2000);
}


function drawEnds() {
	// Značky začátku a konce uzavírky dle JSDI ("kroužky" s písmeny A, B)
	var start_circle = new uOpenLayers.Geometry.Point(lon_start, lat_start).transform(epsg4326, epsg900913);
	var end_circle = new uOpenLayers.Geometry.Point(lon_end, lat_end).transform(epsg4326, epsg900913);
	var circleStyleStart = {
		strokeColor: "#CEBC4B", strokeWidth: 6, strokeDashstyle: "solid",
		fillColor: "#CEBC4B", fillOpacity: 0.5,
		label: "A", labelOutlineColor: "#000", labelOutlineWidth: "3",
		fontSize: "18px", fontWeight: "bold", fontColor: "#CEBC4B",
		pointRadius: 20 };
	diClosuresLayer.addFeatures(new uOpenLayers.Feature.Vector(start_circle, null, circleStyleStart));
	var circleStyleEnd = Object.create(circleStyleStart);
	circleStyleEnd.label = "B";
	// circleStyleEnd.externalGraphic = "https://www.waze.com/assets/livemap/flag-e5c0843c36b1af1f2951cc541ae646e2.png";
	// circleStyleEnd.fillOpacity = 1;
	diClosuresLayer.addFeatures(new uOpenLayers.Feature.Vector(end_circle, null, circleStyleEnd));
}


function drawClosureSegs() {
	if (typeof(diClosures[sel_id].last_closures) === 'undefined' || diClosures[sel_id].last_closures === null) {return;}

	var zoom = uWaze.map.getZoom();
	if (zoom >= lineWidth.length) {
		zoom = lineWidth.length - 1;
	}

	// Fialová čára
	for (var i = 0; i< diClosures[sel_id].last_closures.length; i++) {
		var seg = diClosures[sel_id].last_closures[i].segid;
		var segment = uWaze.model.segments.getObjectById(seg);
		if (typeof(segment) === 'undefined' || segment === null) {continue;}
		var lineString = new uOpenLayers.Geometry.LineString(segment.getOLGeometry().components);
		var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: (lineWidth[zoom][1]-2)} );
		diClosuresLayer.addFeatures(lineFeature);
		lineString	= new uOpenLayers.Geometry.LineString(segment.getOLGeometry().components);
		lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#A05FA5', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: (lineWidth[zoom][0]-2) } );
		diClosuresLayer.addFeatures(lineFeature);
		lineString	= new uOpenLayers.Geometry.LineString(segment.getOLGeometry().components);
		lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: (lineWidth[zoom][0]-2) } );
		diClosuresLayer.addFeatures(lineFeature);

	}
}


function requestRoute() {
	if (diClosuresLayer.getVisibility() && typeof(lon_start) !== 'undefined' && typeof(lon_end) !== 'undefined' ) {
		var minx = Math.min(lon_start, lon_end) - 0.001;
		var miny = Math.min(lat_start, lat_end) - 0.0005;
		var maxx = Math.max(lon_start, lon_end) + 0.001;
		var maxy = Math.max(lat_start, lat_end) + 0.0005;
		var p1 = new uOpenLayers.Geometry.Point(minx, miny);
		var p2 = new uOpenLayers.Geometry.Point(maxx, maxy);
		uWaze.map.zoomToExtent([p1.x, p1.y, p2.x, p2.y], false);

		var url = 'https://routing-livemap-row.waze.com/RoutingManager/routingRequest';
		var data = {
			from: "x:" + lon_start + " y:" + lat_start,
			to: "x:" + lon_end + " y:" + lat_end,
			returnJSON: true,
			returnGeometries: true,
			returnInstructions: false,
			timeout: 60000,
			at: -859,
			type: "HISTORIC_TIME",
			nPaths: 1,
			clientVersion: '4.0.0',
			options: {AVOID_TOLL_ROADS: false, AVOID_PRIMARIES: false, AVOID_TRAILS: true, ALLOW_UTURNS: false, subscription: "*"}
		};
		GM_xmlhttpRequest({
			method: "GET",
			url: url + "?" + jQuery.param(data),
			headers: {
				"Content-Type": "application/json"
			},
			nocache: true,
			responseType: "json",
			onerror: function(req, textStatus, errorThrown) {
				route = {};
				drawRoute();
			},
			onload: function(r) {
				route = r;
				if (typeof(route.response.response) !== 'undefined') {
					if (route.response.response.results.length === 1) {
						var tmp = route.response.coords[route.response.coords.length-1];
						route.response.coords[route.response.coords.length-1] = route.response.coords[route.response.coords.length-2];
						route.response.coords[route.response.coords.length-2] = tmp;
					}
				}
				drawRoute();
			}
		});
	}
}


function reverseRouting() {
	var tmp = lon_start;
	lon_start = lon_end;
	lon_end = tmp;
	tmp = lat_start;
	lat_start = lat_end;
	lat_end = tmp;

	diClosuresLayer.destroyFeatures();
	drawEnds();
	requestRoute();
}


function requestClosures() {
	if (diClosuresLayer.getVisibility()) {
		hideAll();
		var extent = uWaze.map.getExtent();

		var oh = 0;

		var pLB = new uOpenLayers.Geometry.Point(extent[0] - oh, extent[3] - oh);
		var pRT = new uOpenLayers.Geometry.Point(extent[2] + oh, extent[1] + oh);
		var getOld = getId("cbDIold").checked;
		diClosures = {};
		locks = '';
		var idsJSON = [];
		getId('DIClosuresListTable').innerHTML="";

		GM_xmlhttpRequest({
			method: "POST",
			url: db_server + '/r',

			data: JSON.stringify({l:pLB.x,	r:pRT.x, b:pRT.y, t:pLB.y, old:getOld}),
			headers: {
				'Content-Type': 'application/json',
			},
			onload: function(response) {
				if (response.status != 200) {
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
				var u = uWaze.loginManager.user.getUsername();
				var dicid = u + '-' + Date.now ( );
				locks = JSON.stringify({dicid:dicid, user: u, closures: idsJSON});
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
			if (diClosures[id].feed_condition) {
				// fialová
				showa.innerHTML='<i class="waze-icon-edit" style="background-color: #ee82ee;" title="Vybrat událost"></i>';
			} else if (diClosures[id].probable_closure) {
				// červená
				showa.innerHTML='<i class="waze-icon-edit" style="background-color: #eb7171;" title="Vybrat událost"></i>';
			} else {
				// zelená
				showa.innerHTML='<i class="waze-icon-edit" style="background-color: #19B326;" title="Vybrat událost"></i>';
			}
			if (diClosures[id].in_feed === true && diClosures[id].in_wme !== true) {
				// fialová
				showdiv.style.backgroundColor = "#ee82ee";
			} else if (diClosures[id].in_feed === false && diClosures[id].in_wme === true) {
				// oranžová
				showdiv.style.backgroundColor = "#ffa500";
			} else if (diClosures[id].in_wme === true) {
				// červená
				showdiv.style.backgroundColor = "#eb7171";
			} else if (diClosures[id].in_wme === false) {
				// zelená
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
		var loc = "";
		if (diClosures[id].mesto != "") {
			loc = diClosures[id].mesto;
		}
		if (diClosures[id].ulice != "") {
			if (loc != "") {
				loc += ", ";
			}
			loc += diClosures[id].ulice;
		}
		if (diClosures[id].trida_k != "") {
			if (loc != "") {
				loc += ", ";
			}
			switch (diClosures[id].trida_k) {
				case "0":
					loc += diClosures[id].cislo_k;
					break;
				case "1":
					loc += "I/" + diClosures[id].cislo_k;
					break;
				case "2":
					loc += "II/" + diClosures[id].cislo_k;
					break;
				case "3":
					loc += "III/" + diClosures[id].cislo_k;
					break;
			}
		}
		", " + diClosures[id].trida_k + "/" + diClosures[id].cislo_k
		descrdiv.innerHTML = diClosures[id].typ + "<br>" + diClosures[id].typ_dalsi + "<br><b>"+ diClosures[id].close_time + " - " + diClosures[id].open_time + "</b><br>" + loc;
		closureRow.appendChild(descrdiv);
		getId('DIClosuresListTable').appendChild(closureRow);
	}
	$('.notReload').on('click', function(event) {
		event.preventDefault();
	});
}


function showClosure(id) {
	diClosuresLayer.destroyFeatures();
	getId('DIClDescr').innerHTML = "<b>" + diClosures[id].close_time + " - " + diClosures[id].open_time + "</b><br>" + diClosures[id].popis;
	sel_id = id;
	lon_start = diClosures[id].lon_start;
	lat_start = diClosures[id].lat_start;
	lon_end = diClosures[id].lon_end;
	lat_end = diClosures[id].lat_end;
	showClsrList();
	getStatus();
	drawEnds();
	requestRoute();
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
			if (response.status != 200) {
				getId("DIClStatus").innerHTML = '<span id=locklist style="color: red">Server response ERROR: ' + response.status + '!!!</span>';
			} else {
				var resp = response.responseText;
				var respJSON = JSON.parse(resp);
				html = '<table><tr><td>';
				html += '<input type="text" id="DIClStRemark" style="width: 240px; height:20px" value="' + respJSON[0].remark + '"><button type="button" id="DIClStZapis" style="width: 40px; height:20px">zapiš</button><br>';
				html += '</td></tr><tr><td style="padding-left: .5em;"';
				var txt = respJSON[0].in_wme;
				if (respJSON[0].in_feed == 'ANO' && respJSON[0].in_wme != 'ANO') {
					txt = "FEED zadán";
				}
				if (respJSON[0].in_feed == 'NE' && respJSON[0].in_wme == 'ANO') {
					txt = "FEED smazán";
				}
				switch (respJSON[0].flags) {
					case 0:
						switch (txt) {
							case 'ANO':
								html += ' bgcolor="Salmon"';
								break;
							case 'NE':
								html += ' bgcolor="LightGreen"';
								break;
							case "FEED zadán":
								html += ' bgcolor="Violet"';
								break;
							case "FEED smazán":
								html += ' bgcolor="Orange"';
								break;
							default:
								break;
						}
						break;
					case 1:
						html += ' bgcolor="Yellow"';
						break;
					case 2:
						html += ' bgcolor="Beige"';
						break;
					default:
						break;
				}
				html += '><b>'+ txt + '</b> <button type="button" id="DIClStNe" style="height:20px">ne</button>';
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
				getId("DIClStNe").onclick = sendNe;
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
	json.user = uWaze.loginManager.user.getUsername();

	GM_xmlhttpRequest({
		method: "POST",
		url: db_server + '/u',
		data: JSON.stringify(json),
		headers: {
			'Content-Type': 'application/json',
		},
		onload: function(response) {
			if (response.status != 200) {
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
				if (response.status != 200) {
					users = 'Server response ERROR: ' + response.status + '!!!';
				} else {
					var resp = response.responseText;
					var respJSON = JSON.parse(resp);
					for (var i = 0; i < respJSON.length ; i++) {
						if (users !== '') {
							users += ', ';
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


function hideAll() {
	diClosuresLayer.destroyFeatures();
	getId('DIClDescr').innerHTML = "";
	getId('DIClStatus').innerHTML = "";
	sel_id = 0;
	showClsrList();
}


function selectSegments() {
	getId("btnDISelect").disabled = true;
	setTimeout(selectSegments2, 100);
}


function enableButton() {
	getId("btnDISelect").disabled = false;
}


function selectSegments2() {
	if (!getId("cbDILine").checked && !getId("cbDICross").checked) {enableButton(); return;}
	if (typeof(route.response) === 'undefined' || typeof(route.response.response) === 'undefined'|| typeof(route.error) != 'undefined'){enableButton(); return;}
	if (sel_id === 0) {enableButton(); return;}

	var foundSegs = {};
	var segment;

	for (var i = 0; i < route.response.response.results.length; i++) {
		var seg = route.response.response.results[i].path.segmentId;
		segment = uWaze.model.segments.getObjectById(seg);
		if (typeof(segment) !== 'undefined') {
			foundSegs[String(seg)] = seg;
		}
	}

	var nodeNumSegments = [];
	for (var seg in foundSegs) {
		segment = uWaze.model.segments.getObjectById(seg);
		if (segment !== null) {
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
	}

	var selectedSegs = [];
	if (getId("cbDILine").checked) {
		for (var seg in foundSegs) {
			segment = uWaze.model.segments.getObjectById(seg);
			if (segment !== null) {
				selectedSegs.push(segment);
			}
		}
	}

	if (getId("cbDICross").checked) {
		var foundCrosses = {};
		var foundNodes = Object.keys(nodeNumSegments);
		for (var i = 0; i < foundNodes.length; i++) {
			if (nodeNumSegments[foundNodes[i]] > 1) {
				for (var j = 0; j < uWaze.model.nodes.getObjectById(foundNodes[i]).attributes.segIDs.length; j++) {
					seg = uWaze.model.nodes.getObjectById(foundNodes[i]).attributes.segIDs[j];
					if (typeof(foundSegs[String(seg)]) === "undefined") {
						segment = uWaze.model.segments.getObjectById(seg);
						var roadType = segment.attributes.roadType;
						if (roadType != 5 && roadType != 10 && roadType != 16 && roadType != 18 && roadType != 19) {
							foundCrosses[String(seg)] = seg;
						}
					}
				}
			}
		}

		for (var seg in foundCrosses) {
			segment = uWaze.model.segments.getObjectById(seg);
			selectedSegs.push(segment);
		}
	}

	setTimeout(function() {
		uWaze.selectionManager.setSelectedModels(selectedSegs);
	}, 0);

	if (getId("cbDIPermalink").checked) {
		GM_setClipboard($('.WazeControlPermalink a').attr('href'));
	}
	enableButton();
	createClosure(false);
}


function modifyClosure(del) {
	if (sel_id === 0) {return;}
	if (typeof(diClosures[sel_id].last_closures) === 'undefined') {return;}

	var selectedSegs = [];
	for (var i = 0; i< diClosures[sel_id].last_closures.length; i++) {
		var seg = diClosures[sel_id].last_closures[i].segid;
		var segment = uWaze.model.segments.getObjectById(seg);
		if ((typeof(segment) !== 'undefined') && (segment !== null)){
			selectedSegs.push(segment);
		}
	}

	setTimeout(function() {
		uWaze.selectionManager.setSelectedModels(selectedSegs);
	}, 0);

	if (getId("cbDIPermalink").checked) {
		GM_setClipboard($('.WazeControlPermalink a').attr('href'));
	}
	enableButton();
	if (del) {
		getId("selDIConfl").value = 2;
	}
	createClosure(del);
}

function selectOldSegments() {
	modifyClosure(false)
}


function deleteClosure() {
	modifyClosure(true)
}


function saveSegments (dir, del) {
	if (sel_id === 0) {return;}

	var data = {};
	data.id = sel_id;
	data.user = uWaze.loginManager.user.getUsername();
	data.segids = [];
	for (var segment of uWaze.selectionManager.getSegmentSelection().segments) {
		if (segment.attributes.fwdDirection && (dir === 1 || dir === 3)) {
			data.segids.push({"segid": segment.attributes.id, "forward": true});
		}
		if (segment.attributes.revDirection && (dir === 2 || dir === 3)) {
			data.segids.push({"segid": segment.attributes.id, "forward": false});
		}
	}
	var endTime = $("wz-text-input[id='closure_endDate'] ~ wz-text-input.time-picker-input").data("timepicker").getTime();
	var startTime = $("wz-text-input[id='closure_startDate'] ~ wz-text-input.time-picker-input").data("timepicker").getTime();

	var endDate = $("wz-text-input[id='closure_endDate']").data("daterangepicker").startDate.format('DD.MM.YYYY');
	var startDate = $("wz-text-input[id='closure_startDate']").data("daterangepicker").startDate.format('DD.MM.YYYY');
	data.wme_open_time = endDate + ' ' + endTime;
	data.wme_close_time = startDate + ' ' + startTime;

	var dataTxt = JSON.stringify(data);

	GM_xmlhttpRequest({
		method: "POST",
		url: db_server + '/s',
		data: dataTxt,
		headers: {
			'Content-Type': 'application/json',
		},
		onload: function(response) {
			if (del) {
				sendNe();
			}
		}
	});
}


function createClosure(del) {
	if (getId("cbDIPregen").checked && typeof(diClosures[sel_id]) !== 'undefined') {
		var waitForElem = function(selector) {
			return new Promise((resolve) => {
				const interval = setInterval(() => {
					const element = document.querySelector(selector);
					if (element) {
						clearInterval(interval);
						resolve(element);
					}
				}, 100);
			});
		};
		var waitForShadowElem = function(ElemWithShadow, selector) {
			return new Promise((resolve) => {
				const interval = setInterval(() => {
					const element = ElemWithShadow.shadowRoot.querySelector(selector);
					if (element) {
						clearInterval(interval);
						resolve(element);
					}
				}, 100);
			});
		};

		if (typeof($(".segment-edit-section wz-tabs wz-tab.closures-tab")[0]) !== "undefined") {
			$(".segment-edit-section wz-tabs wz-tab.closures-tab")[0].isActive = true;

			waitForElem(".add-closure-button").then(() => {
				var clsrs = Array.from(document.querySelectorAll("div.closures wz-card")).filter(item => !item.querySelector("wz-image-chip").imageSrc.includes("finished"));
				var sel = getId("selDIConfl").value;

				var btn;
				if (sel == 1 || clsrs.length === 0) {
					btn = document.getElementsByClassName("add-closure-button")[0];
				} else if (sel == 2 && clsrs.length == 1) {
					btn = clsrs[0];
				} else {
					btn = undefined;
				}
				if (typeof(btn) !== 'undefined') {
					btn.click();

					var closeParts = diClosures[sel_id].close_time.match(/(\d+)\.(\d+)\.(\d+) (\d+):(\d+)/);
					var openParts = diClosures[sel_id].open_time.match(/(\d+)\.(\d+)\.(\d+) (\d+):(\d+)/);

					if (closeParts.length === 6 && openParts.length === 6) {
						var duvod = diClosures[sel_id].typ;
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
						var closeDate = new Date(closeParts[3], closeParts[2] - 1, closeParts[1], closeParts[4], closeParts[5]);
						var curDate = new Date();
						var openDate;
						if (del) {
							if (closeDate > curDate) {
								openDate = new Date(closeDate.valueOf() + 60000);
							} else {
								openDate = new Date(curDate.valueOf() + 60000);
							}
							openParts[1] = openDate.getDate();
							openParts[2] = openDate.getMonth() + 1;
							openParts[3] = openDate.getFullYear();
							openParts[4] = openDate.getHours();
							openParts[5] = openDate.getMinutes();
						} else {
							openDate = new Date(openParts[3], openParts[2] - 1, openParts[1], openParts[4], openParts[5]);
						}
						if (openDate.valueOf() - closeDate.valueOf() <= 86400000 || openDate.valueOf() - curDate.valueOf() <= 86400000) {
							doba += parseInt(openParts[4], 10) + ':' + openParts[5];
						} else {
							doba += parseInt(openParts[1], 10) + '.' + parseInt(openParts[2], 10) + '.' + openParts[3];
						}
						waitForElem("#closure_reason").then(() => {
							var elem = document.getElementById('closure_reason');
							waitForShadowElem(elem, ".wz-text-input .wz-text-input-inner-container input").then(() => {
								elem.value = 'Uzavřeno' + doba + ' (JSDI)' + duvod;
							});
							$("wz-text-input[id='closure_reason']").trigger("change");
							var perm = document.getElementById('closure_permanent');
							if (typeof(perm) !== 'undefined') {
								if (!perm.checked) {
									perm.click();
								}
							}
							if (typeof(document.getElementsByName('closure_hasStartDate')[0]) !== 'undefined') {
								document.getElementsByName('closure_hasStartDate')[0].checked = true;
							}

							var startDate = new Date(closeParts[3], closeParts[2] - 1, closeParts[1]);
							var endDate = new Date(openParts[3], openParts[2] - 1, openParts[1]);

							$("wz-text-input[id='closure_startDate']").data("daterangepicker").setStartDate(startDate);
							$("wz-text-input[id='closure_endDate']").data("daterangepicker").setStartDate(endDate);
							$("wz-text-input[id='closure_endDate'] ~ wz-text-input.time-picker-input").data("timepicker").setTime(openParts[4] + ':' + openParts[5]);
							$("wz-text-input[id='closure_startDate'] ~ wz-text-input.time-picker-input").data("timepicker").setTime(closeParts[4] + ':' + closeParts[5]);

							setTimeout(() => {
								$("wz-text-input[id='closure_startDate']").data("daterangepicker").clickApply();
								$("wz-text-input[id='closure_endDate']").data("daterangepicker").clickApply();
								$("wz-text-input[id='closure_endDate']").data("daterangepicker").elementChanged();
								$("wz-text-input[id='closure_startDate']").data("daterangepicker").elementChanged();
							}, 50);

							waitForElem("#closure_eventId").then(() => {
								var evSel = document.getElementById('closure_eventId');
								waitForShadowElem(evSel, "div.wz-select div.select-wrapper div.select-box span").then(() => {
									evSel.shadowRoot.querySelector("div.wz-select div.select-wrapper div.select-box").click();
									evSel.querySelector("wz-option").click();
								});
							});

							$("[id='closure_eventId']").trigger("change");
							var fwd = false;
							var rev = false;
							for (var segment of uWaze.selectionManager.getSegmentSelection().segments) {
								fwd = fwd || segment.attributes.fwdDirection;
								rev = rev || segment.attributes.revDirection;
							}
							var dir_idx;
							if (fwd) {
								if (rev) {
									dir_idx = 3;
								} else {
									dir_idx = 1;
								}
							} else {
								if (rev) {
									dir_idx = 2;
								} else {
									dir_idx = 3;
								}
							}

							var elem1 = document.getElementById('closure_direction');
							waitForShadowElem(elem1, ".wz-select #select-wrapper .select-box .selected-value-wrapper .selected-value").then(() => {
								elem1.value = dir_idx;
							});

							var waitForActiveElem = function(elemActiveId, callback) {
								if (document.activeElement.id == elemActiveId) {
									callback();
								} else {
									setTimeout(function() {
										waitForActiveElem(elemActiveId, callback);
									}, 100);
								}
							};

							waitForElem("div.closure form div.action-buttons wz-button.save-button").then(() => {
								waitForActiveElem("closure_eventId", function() {
									var savebtn = document.querySelector("div.closure form div.action-buttons wz-button.save-button");
									var saveIntervalCounter = 0;
									var saveInterval = setInterval(function() {
										if (document.activeElement !== savebtn) {
											savebtn.focus();
										}

										saveIntervalCounter++;

										if (saveIntervalCounter > 100) {
											clearInterval(saveInterval);
											saveInterval = null;
										}
									}, 10);
									savebtn.tabIndex = 0;
									savebtn.focus();
									//savebtn.addEventListener("click", function(){saveSegments(dir_idx, del);});
									savebtn.addEventListener("keyup", function(e){
										if (!['INPUT','TEXTAREA','WZ-TEXTAREA','WZ-TEXT-INPUT','WZ-AUTOCOMPLETE'].includes(document.activeElement.tagName)) {
											switch (e.which) {
												case 13: // Enter
													savebtn.click();
													break;
												case 32: // SpaceBar
													document.querySelector("#closure_permanent").click();
													break;
												case 33: // PageUp
													document.getElementById('closure_direction').value = 1;
													$("[id='closure_direction']").trigger("change");
													break;
												case 34: // PageDown
													document.getElementById('closure_direction').value = 2;
													$("[id='closure_direction']").trigger("change");
													break;
											}
										}


										clearInterval(saveInterval);
										saveInterval = null;
									});
									var closureForm = document.querySelector("div.closure form");
									closureForm.addEventListener('submit', function() {saveSegments(dir_idx, del);});
								});
							});
						});
					}
				}
			});
		}
	}
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
	css += "#diclosures .kontejner { display: flex; flex-flow: flex-start; justify-content: flex-start; width: 100%; }";
	css += "#diclosures .kontejner div { display: block; width: 150px; }";
	css += "#diclosures button { width: 140px; }";
	css += "#btnDIHideAll { margin-bottom: 10px; }";
	// css += "#diclosures label:first-of-type { margin-top: 10px; }";
	css += "#diclosures hr { margin: 2px; }";
	css += "#DIClStatus, #DIClDescr, #DIClosuresList { padding-top: 8px; font-size: 10px; }";
	cssEl.innerHTML = css;
	document.body.appendChild(cssEl);
}


function getElementsByClassName(classname, node) {
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


function getId(node) {
	return document.getElementById(node);
}


async function diClosures_init() {
	uWaze = unsafeWindow.W;
	uOpenLayers = unsafeWindow.OpenLayers;

	loadCss();

	epsg900913 = new uOpenLayers.Projection("EPSG:900913");
	epsg4326 = new uOpenLayers.Projection("EPSG:4326");

	diClosuresLayer = new uOpenLayers.Layer.Vector("DI closures", {
		displayInLayerSwitcher: true,
		uniqueName: "__DrawDIClosures"
	});

	uWaze.map.addLayer(diClosuresLayer);
	var roadGroupSelector = document.getElementById('layer-switcher-group_road');
	if (roadGroupSelector != null) {
		var roadGroup = roadGroupSelector.parentNode.parentNode.getElementsByTagName("UL")[0];
		var toggler = document.createElement('li');
		var checkbox = document.createElement("wz-checkbox");
		checkbox.id = 'layer-switcher-item_di_closures';
		checkbox.className = "hydrated";
		checkbox.disabled = !roadGroupSelector.checked;
		checkbox.checked = diClosuresLayer.getVisibility();
		checkbox.appendChild(document.createTextNode("DI closures"));
		toggler.appendChild(checkbox);
		roadGroup.appendChild(toggler);
		checkbox.addEventListener('click', function(e) {
			diClosuresLayer.setVisibility(e.target.checked);
		});
		roadGroupSelector.addEventListener('click', function(e) {
			diClosuresLayer.setVisibility(e.target.checked && checkbox.checked);
			checkbox.disabled = !e.target.checked;
		});
	}

	var addon = document.createElement('section');
	addon.innerHTML = '<b><u><a href="https://greasyfork.org/cs/scripts/11009-wme-di-closures" target="_blank">WME DI closures</a></u></b> &nbsp; v' + GM_info.script.version;

	var section = document.createElement('section');
	section.style.paddingTop = "8px";
	section.style.fontSize = "12px";
	section.id = "diclosures";
	section.innerHTML = '<b>Lidé okolo: <span id=locklist style="color:red"></span></b><br>'
		+ '<div class="kontejner">'
		+ '<div><button class="btn btn-success btn-block" id="btnDIReadData">Načíst data</button>'
		+ '<label><input type="checkbox" id="cbDIold"/><b> i ukončené uzavírky</b></label>'
		+ '<button class="btn btn-primary btn-block" id="btnDISelect"><u><b>V</b></u>ybrat segmenty</button>'
		+ '<button class="btn btn-info btn-block" id="btnOldSelect">Minulé se<u><b>G</b></u>menty</button>'
		+ '<button class="btn btn-warning btn-block" id="btnReverse">Otočit routing</button><br>'
		+ '<button class="btn btn-danger" id="btnDIDeleteClosure">Smaž uzavírku</button>'
		+ '</div>'
		+ '<div><button class="btn btn-default" id="btnDIHideAll">Reset</button><br>'
		+ '<b>Vybrat</b><br>'
		+ '<label><input type="checkbox" id="cbDILine" checked /><b>DI čára</b></label><br>'
		+ '<label><input type="checkbox" id="cbDICross" /><b>křížení</b></label><br>'
		+ '<b>Funkce</b><br>'
		+ '<label><input type="checkbox" id="cbDIPermalink" checked /><b>permalink</b></label><br>'
		+ '<label><input type="checkbox" id="cbDIPregen" checked /><b>předvyplnit</b></label><br>'
		+ '<select id="selDIConfl"><option value="0">jen nová</option><option value="1">přidat</option><option value="2">upravit</option></select></select></td></tr>'
		+ '<button class="btn btn-default" id="btnDITest">Data z ŘSD</button>'
		+ '</div>'
		+ '</div>'
		+ '<br><b>Klávesy:</b> <kbd>n</kbd> jen nová uzavírka, <kbd>p</kbd> přidat, <kbd>u</kbd> upravit. <kbd>x</kbd> ukončit'
		+ '<br><b>Tabulky:</b> <a href="http://jsdi.wazer.cz/check" target="_blank"><i class="fa fa-link"></i> check</a>, <a href="http://jsdi.wazer.cz/all" target="_blank"><i class="fa fa-link"></i> all</a>';
	addon.appendChild(section);

	section = document.createElement('section');
	section.id = "DIClStatus";
	addon.appendChild(section);

	section = document.createElement('section');
	section.id = "DIClDescr";
	addon.appendChild(section);

	section = document.createElement('section');
	section.id = "DIClosuresList";
	var diClosuresTable = "<div id='DIClosuresListTable'></div>";
	section.innerHTML = diClosuresTable;
	addon.appendChild(section);

	const { tabLabel, tabPane } = uWaze.userscripts.registerSidebarTab("diclosures");
	tabLabel.innerHTML = '<img src="' + GM_info.script.icon + '" width="16" height="16" style="margin-top: -2px;">';
	tabLabel.title = 'DI closures';
	tabLabel.id = "sidepanel-diclosures";
	tabPane.appendChild(addon);

	await uWaze.userscripts.waitForElementConnected(tabPane);

	getId("btnDIReadData").onclick = requestClosures;
	getId("btnDISelect").onclick = selectSegments;
	getId("btnOldSelect").onclick = selectOldSegments;
	getId("btnDIHideAll").onclick = hideAll;
	getId("btnReverse").onclick = reverseRouting;
	getId("btnDIDeleteClosure").onclick = deleteClosure;
	getId("btnDITest").onclick = startTest;

	url_id = location.search.split('di_id=')[1];
	if (typeof(url_id) !== 'undefined') {
		if (!url_id.includes("tab=userscript_tab")) {
			document.querySelector('.w-icon-script').parentNode.click();
		}
		url_id = url_id.split('&')[0];
		document.querySelector('#sidepanel-diclosures').parentNode.click();
		requestClosures();
	}

	$(document).keypress(function(e) {
		if (!['INPUT','TEXTAREA','WZ-TEXTAREA','WZ-TEXT-INPUT','WZ-AUTOCOMPLETE'].includes(document.activeElement.tagName)) {
			switch (e.which) {
				case 110: // n
				case 78: // N
					getId("selDIConfl").value = 0;
					createClosure(false);
					break;
				case 112: // p
				case 80: // P
					getId("selDIConfl").value = 1;
					createClosure(false);
					break;
				case 117: // u
				case 85: // U
					getId("selDIConfl").value = 2;
					createClosure(false);
					break;
				case 120: // x
				case 88: // X
					getId("selDIConfl").value = 2;
					createClosure(true);
					break;
				case 118: // v
				case 86: // V
					if (getId("DIClStRemark") != document.activeElement) {
						getId("btnDISelect").click();
					}
					break;
				case 103: // g
				case 71: // G
					if (getId("DIClStRemark") != document.activeElement) {
						getId("btnOldSelect").click();
					}
					break;
			}
		}
	});


}


document.addEventListener("wme-map-data-loaded", diClosures_init, {once: true});
