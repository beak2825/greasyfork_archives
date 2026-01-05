// ==UserScript==
// @name				WME ME Closure Selector
// @description 		Makes selection based on loaded file (usually a Major Event Closure map)
// @include 			https://www.waze.com/editor*
// @include 			https://www.waze.com/*/editor*
// @include 			https://beta.waze.com/*
// @version 			0.5
// @grant				none
// @copyright			2015, pvo11
// @namespace			https://greasyfork.org/cs/scripts/15018-wme-me-closure-selector
// @downloadURL https://update.greasyfork.org/scripts/15018/WME%20ME%20Closure%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/15018/WME%20ME%20Closure%20Selector.meta.js
// ==/UserScript==


var dist_diff = 5;                    // maximální vzdálenost v metrech
var angle_diff = 7;                   // maximální rozdíl úhlů ve stupních

var uOpenLayers;
var uWaze;
var epsg900913;		// Google Spherical Mercator Projection
var epsg4326;		// WGS 84
var meClosureLayer;
var closureLines = [];
var numLines = 0;

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


function drawLine(line, from, to, color) {
	if (from > to) return;
	var linePoints = [];

	var zoom = uWaze.map.getZoom();
	if (zoom >= lineWidth.length) {
		zoom = lineWidth.length - 1;
	}

	var p = new uOpenLayers.Geometry.Point(line[from - 1].x, line[from - 1].y).transform(epsg4326, epsg900913);
	linePoints.push(p);
	for(var i = from ; i <= to - 1; i++) {
		var lp1 = line[i];
		var lp2 = line[i + 1];

		var dif_lon = Math.abs(lp1.x - lp2.x);
		var dif_lat = Math.abs(lp1.y - lp2.y);

		if (dif_lon < 0.0000001 && dif_lat < 0.0000001) continue;
		p = new uOpenLayers.Geometry.Point(lp1.x, lp1.y).transform(epsg4326, epsg900913);
		linePoints.push(p);
	}
	p = new uOpenLayers.Geometry.Point(line[to].x, line[to].y).transform(epsg4326, epsg900913);
	linePoints.push(p);
	var lineString  = new uOpenLayers.Geometry.LineString(linePoints);
	var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][1]} );
	meClosureLayer.addFeatures(lineFeature);
	lineString  = new uOpenLayers.Geometry.LineString(linePoints);
	
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: color, strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][0] } );
	meClosureLayer.addFeatures(lineFeature);
	lineString  = new uOpenLayers.Geometry.LineString(linePoints);
	lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: lineWidth[zoom][0] } );
	meClosureLayer.addFeatures(lineFeature);
}


function calculateFromTo()
{
	var fromGlob = getId("inMESfrom").value;
	var toGlob = getId("inMESto").value;
	var from1, from2, to1, to2;
	var prev = 1;
	for (var i = 0; i < closureLines.length; i++) {
		if (fromGlob >= prev && fromGlob < closureLines[i].length - 1 + prev) {
			from1 = i;
			from2 = fromGlob - prev + 1;
		}
		if (toGlob >= prev && toGlob < closureLines[i].length - 1 + prev) {
			to1 = i;
			to2 = toGlob - prev + 1;
		}
		prev += closureLines[i].length - 1;
	}
	return {"from1": from1, "from2": from2, "to1": to1, "to2": to2};
}


function setPosition() {
	if (closureLines.length === 0) return;
	var range = calculateFromTo();
	var minx = maxx = closureLines[range.from1][range.from2 - 1].x;
	var miny = maxy = closureLines[range.from1][range.from2 - 1].y;
	for (var i = range.from1; i <= range.to1; i++) {
		var fromJ, toJ;
		if (i === range.from1) {
			fromJ = range.from2;
		} else {
			fromJ = 0;
		}
		if (i === range.to1) {
			toJ = range.to2 + 1;
		} else {
			toJ = closureLines[i].length;
		}
		for (var j = fromJ; j < toJ; j++) {
			minx = Math.min(minx, closureLines[i][j].x);
			maxx = Math.max(maxx, closureLines[i][j].x);
			miny = Math.min(miny, closureLines[i][j].y);
			maxy = Math.max(maxy, closureLines[i][j].y);
		}
	}
	var p1 = new uOpenLayers.Geometry.Point(minx, miny).transform(epsg4326, epsg900913);
	var p2 = new uOpenLayers.Geometry.Point(maxx, maxy).transform(epsg4326, epsg900913);
	uWaze.map.zoomToExtent([p1.x, p1.y, p2.x, p2.y], false);
}


function drawClosure()
{
	meClosureLayer.destroyFeatures();
	var range = calculateFromTo();
	for (var i = 0; i < closureLines.length; i++) {
		if (i < range.from1) {
			drawLine(closureLines[i], 1, closureLines[i].length - 1, '#888888');
		} else if (i === range.from1) {
			if (i === range.to1) {
				drawLine(closureLines[i], 1, range.from2 - 1, '#888888' );
				drawLine(closureLines[i], range.from2, range.to2, '#0000FF');
				drawLine(closureLines[i], range.to2 + 1, closureLines[i].length - 1, '#888888' );
			} else { 
				drawLine(closureLines[i], 1, range.from2 - 1, '#888888' );
				drawLine(closureLines[i], range.from2, closureLines[i].length - 1, '#0000FF');
			}
		} else {
			if (i < range.to1) {
				drawLine(closureLines[i], 1, closureLines[i].length - 1, '#0000FF');
			} else if (i === range.to1) {
				drawLine(closureLines[i], 1, range.to2, '#888888' );
				drawLine(closureLines[i], range.to2 + 1, closureLines[i].length - 1, '#0000FF');
			} else {
				drawLine(closureLines[i], 1, closureLines[i].length - 1, '#888888');
			}
		}
	}
}


function hideClosure()
{
	meClosureLayer.destroyFeatures();
}


function rangeAll()
{
	if (closureLines.length !== 0) {
		getId("inMESfrom").value = 1;
		getId("inMESto").value = numLines;
	} else {
		getId("inMESfrom").value = 0;
		getId("inMESto").value = 0;
	}
}


function loadFile()
{
	var fileList = getId('inMESfile');
	var file = fileList.files[0];

	var reader = new FileReader();

	reader.onload = (function(theFile) {
		return function(e) {
			parseFile (e.target.result);
		}
	})(file);

	reader.readAsText(file);
}


function parseFile(data)
{
	try {
		var fileType = '';
		var name = '';
		var xmlDoc = $.parseXML(data);
		var $xml = $(xmlDoc);
		var first =$xml[0].firstChild.nodeName;

		if (first === 'kml') {
			fileType = 'KML'
			var $placemark = $xml.find("Placemark");
			name = $placemark.find("name")[0].innerHTML;
			var path = $placemark.find("LineString coordinates")[0].innerHTML;
			closureLines = [];
			closureLines[0] = [];
			var points = path.split(' ');
			for (var i = 0; i < points.length; i++) {
				if (points[i].indexOf(',') != -1) {
					var point = points[i].split(',');
					closureLines[0].push({"x": point[0], "y": point[1]});
				}
			}
		} else {
			throw "Unknown: first";   
		}

		numLines = 0
		for (var i = 0; i < closureLines.length; i++) {
			numLines += closureLines[i].length - 1;
		}
		getId("inMESfrom").min = 1;
		getId("inMESfrom").max = numLines;
		getId("inMESto").min = 1;
		getId("inMESto").max = numLines;
		getId('outAttrs').innerHTML = '<b>Typ souboru:</b> ' + fileType + '<br><b>Jméno trasy:</b> ' + name + '<br><b>Počet částí:</b> ' + numLines;
		rangeAll();
		setPosition();
		drawClosure();
	}
	catch(err) {
		getId("inMESfrom").min = 0;
		getId("inMESfrom").max = 0;
		getId("inMESto").min = 0;
		getId("inMESto").max = 0;
		getId('outAttrs').innerHTML = '<b>Neznámý formát souboru!</b>';
		rangeAll();
		hideClosure();
	}
}


function wgs_842s_jstk_lon(lon_in, lat_in) {
	var x = 703011.80672981-14311.19075*(lat_in-50)-71093.69068*(lon_in-15)+0.04527213114*Math.pow(lat_in-50,2)+1469.29752*(lat_in-50)*(lon_in-15)-62.16573827*Math.pow(lon_in-15,2)+1.746024222*Math.pow(lat_in-50,3)+1.482366057*Math.pow(lat_in-50,2)*(lon_in-15)-1.646574057*(lat_in-50)*Math.pow(lon_in-15,2)+1.930950004*Math.pow(lon_in-15,3);
	return x.toFixed();
}


function wgs_842s_jstk_lat(lon_in, lat_in) {
	var x = 1058147.1808238-110295.0611*(lat_in-50)+9224.512054*(lon_in-15)-13.35425822*Math.pow(lat_in-50,2)-192.8902631*(lat_in-50)*(lon_in-15)-473.5502716*Math.pow(lon_in-15,2)-4.564660084*Math.pow(lat_in-50,3)-4.355296392*Math.pow(lat_in-50,2)*(lon_in-15)+8.911019558*(lat_in-50)*Math.pow(lon_in-15,2)+0.3614170182*Math.pow(lon_in-15,3);
	return x.toFixed();
}


function calculateAngle(p1, p2)
{
	var a = p1.x - p2.x;
	var b = p1.y - p2.y;
	var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	var cos;
	if (a < 0) {
		cos = -b/c;
	} else {
		cos = b/c;
	}
	var angle = Math.acos(cos);
	return angle;
}


function checkDistance(bod, p1, p2)
{
	var a = p2.y - p1.y;
	var b = p1.x - p2.x;
	var c = - a * p1.x - b * p1.y;
	
	var dist = Math.abs(a * bod.x + b * bod.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

	if (dist > dist_diff) return false;
	
	var t = -(a*bod.x + b*bod.y + c)/ (Math.pow(a, 2) + Math.pow(b, 2));
	var prx = bod.x + a*t;
	var pry = bod.y + b*t;

	return ((Math.min(p1.x, p2.x) <= prx) && (Math.max(p1.x, p2.x) >= prx) && (Math.min(p1.y, p2.y) <= pry) && (Math.max(p1.y, p2.y) >= pry));
}


function selectSegments()
{
	getId("btnMESselect").disabled = true;
	getId("btnMESselect").style.background='#F00000';
	
	setTimeout(selectSegments2, 100);
}


function selectSegments2()
{
	if (!getId("cbMESline").checked && !getId("cbMEScross").checked) return;

	dist_diff = getId("inMESparmM").value;
	angle_diff = getId("inMESparmDeg").value;

	var foundSegs = {};
	var segment;

	var range = calculateFromTo();
	var noClsr = getId("cbMESnoClsr").checked;
	for (var seg in uWaze.model.segments.objects) {
		segment = uWaze.model.segments.get(seg);
		if (noClsr && segment.hasClosures()) continue;

			var p_wgs = new uOpenLayers.Geometry.Point(segment.geometry.components[0].x, segment.geometry.components[0].y).transform(epsg900913, epsg4326);
			var p1_seg = {"x": -wgs_842s_jstk_lon(p_wgs.x, p_wgs.y), "y": -wgs_842s_jstk_lat(p_wgs.x, p_wgs.y)};

			seg_geometry_loop:
			for (var i = 1; i < segment.geometry.components.length; i++) {
				p_wgs = new uOpenLayers.Geometry.Point(segment.geometry.components[i].x, segment.geometry.components[i].y).transform(epsg900913, epsg4326);
				var p2_seg = {"x": -wgs_842s_jstk_lon(p_wgs.x, p_wgs.y), "y": -wgs_842s_jstk_lat(p_wgs.x, p_wgs.y)};
				ang_seg = calculateAngle(p1_seg, p2_seg);
				
				for (var j = 0; j < closureLines.length; j++) {
					var fromK, toK;
					if (j === range.from1) {
						fromK = range.from2;
					} else {
						fromK = 0;
					}
					if (j === range.to1) {
						toK = range.to2 + 1;
					} else {
						toK = closureLines[j].length;
					}
					var p1_line = {"x": -wgs_842s_jstk_lon(closureLines[j][fromK].x, closureLines[j][fromK].y), "y": -wgs_842s_jstk_lat(closureLines[j][fromK].x, closureLines[j][fromK].y)};
					for (var k = fromK + 1; k < toK; k++) {
						var p2_line = {"x": -wgs_842s_jstk_lon(closureLines[j][k].x, closureLines[j][k].y), "y": -wgs_842s_jstk_lat(closureLines[j][k].x, closureLines[j][k].y)};
						if (p1_line.x != p2_line.x || p1_line.y != p2_line.y) {
							var ang_line = calculateAngle(p1_line, p2_line);
							var ang_sub = Math.min(Math.abs(ang_seg - ang_line), Math.PI - Math.abs(ang_seg - ang_line));
							if (ang_sub < angle_diff * Math.PI / 180) {
								
								if (checkDistance(p1_line, p1_seg, p2_seg) || checkDistance(p2_line, p1_seg, p2_seg) || checkDistance(p1_seg, p1_line, p2_line) || checkDistance(p2_seg, p1_line, p2_line)) {
										foundSegs[String(seg)] = seg;
										break seg_geometry_loop;
								}
							}

						}
						p1_line = p2_line;
					}
				}
				p1_seg = p2_seg;
			}


	}

	var nodeNumSegments = [];
	for (var seg in foundSegs) {
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
	if (getId("cbMESline").checked) {
		for (var seg in foundSegs) {
			segment = uWaze.model.segments.get(seg);
			selectedSegs.push(segment);
		}
	}

	if (getId("cbMEScross").checked) {
		var foundCrosses = {};
		var foundNodes = Object.keys(nodeNumSegments);
		for (var i = 0; i < foundNodes.length; i++) {
			if (nodeNumSegments[foundNodes[i]] > 1) {
				for (var j = 0; j < uWaze.model.nodes.get(foundNodes[i]).attributes.segIDs.length; j++) {
					seg = uWaze.model.nodes.get(foundNodes[i]).attributes.segIDs[j];
					if (typeof(foundSegs[String(seg)]) === "undefined") {
						segment = uWaze.model.segments.get(seg);
						var roadType = segment.attributes.roadType
						if (roadType != 5 && roadType != 10 && roadType != 16 && roadType != 18 && roadType != 19) {
							foundCrosses[String(seg)] = seg;
						}
					}
				}
			}
		}
		

		for (var seg in foundCrosses) {
			segment = uWaze.model.segments.get(seg);
			selectedSegs.push(segment);
		}
	}
	uWaze.selectionManager.select(selectedSegs);

	if (getId("cbMESpermalink").checked) {
		GM_setClipboard($('.WazeControlPermalink a').attr('href'));
	}
	getId("btnMESselect").style.background='#E9E9E9';
	getId("btnMESselect").disabled = false;
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


function getId(node)
{
	return document.getElementById(node);
}


function meClosureSelector_init()
{

	uOpenLayers = unsafeWindow.OpenLayers;
	epsg900913 = new uOpenLayers.Projection("EPSG:900913");
	epsg4326   = new uOpenLayers.Projection("EPSG:4326");

	uWaze = unsafeWindow.Waze;

	meClosureLayer = new uOpenLayers.Layer.Vector("ME closure", {
			displayInLayerSwitcher: true,
			uniqueName: "__DrawMEClosure"
		});

		
	I18n.translations.en.layers.name["__MEMapClosure"] = "ME closure";
	uWaze.map.addLayer(meClosureLayer);
	if (localStorage.DrawMEClosure) {
		meClosureLayer.setVisibility(localStorage.DrawMEClosure == "true");
	} else {
		meClosureLayer.setVisibility(true);
	}

	var addon = document.createElement('section');
	addon.innerHTML  = '<b><u><a href="https://greasyfork.org/cs/scripts/15018-wme-me-closure-selector" target="_blank">WME ME Closure Selector</a></u></b> &nbsp; v' + GM_info.script.version;

	var section = document.createElement('p');
	section.style.paddingTop = "8px";
	section.style.textIndent = "0px";
	section.style.fontSize = "12px";
	section.id = "meClosureSelector";
	section.innerHTML  = '<input type="file" id="inMESfile" style="padding:0px 0px; height:40px" />'
		+ '<br><output id="outAttrs"></output><br>'
		+ '<table width=100%>'
		+ '<tr><td><b>Části od:  </b><input type="number" min="0" max="0" size="3" value="0" id="inMESfrom" style="padding:0px 0px; height:20px; width:50px"/></td>'
		+ '<td><td><b>do:  </b><input type="number" min="0" max="0" size="3" value="0" id="inMESto" style="padding:0px 0px; height:20px; width:50px"/></td>'
		+ '<td><button class="btn btn-default" id="btnMESrangeAll" style="padding:0px 10px; height:25px">Vše</button></td></tr>'
		+ '</table><br>'
		+ '<table width=100%>'
		+ '<td><button class="btn btn-default" id="btnMESshow" style="padding:0px 10px; height:25px">Zobraz</button></td>'
		+ '<td><button class="btn btn-default" id="btnMESHide" style="padding:0px 10px; height:25px">Smaž</button></td>'
		+ '<td><button class="btn btn-default" id="btnMEScenter" style="padding:0px 10px; height:25px">Centruj</button></td></tr>'
		+ '</table><br>'
		+ '<table width=100%>'
		+ '<tr><td rowspan="4" colspan="2"><button class="btn btn-default" id="btnMESselect" style="padding:0px 10px; height:40px">Vybrat segmenty</button></td>'
		+ '<td><input type="checkbox" id="cbMESline" style="padding:0px 0px" checked /> <b>trasa</b></td></tr>'
		+ '<tr"><td><input type="checkbox" id="cbMEScross" style="padding:0px 0px" /> <b>křížení</b></td></tr>'
		+ '<tr style="border-bottom: 1pt solid black"><td><input type="checkbox" id="cbMESnoClsr" style="padding:0px 0px" /> <b>jen bez uzavírky</b></td></tr>'
		+ '<td><input type="checkbox" id="cbMESpermalink" style="padding:0px 0px"/> <b>permalink</b></td></tr>'
		+ '<tr><td colspan="2"><b>tolarance:</b></td></tr>'
		+ '<tr><td><input type="number" min="1" max="99" size="3" value="' + dist_diff + '" id="inMESparmM" style="padding:0px 0px; height:20px; width:50px"/><b>  m</b></td>'
		+ '<td><input type="number" min="1" max="99" size="3" value="' + angle_diff + '" id="inMESparmDeg" style="padding:0px 0px; height:20px; width:50px"/><b>  °</b></td></tr>'
		+ '</table>';
	addon.appendChild(section);

	var userTabs = getId('user-info');
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];

	var newtab = document.createElement('li');
	newtab.innerHTML = '<a href="#sidepanel-meclosrureselector" data-toggle="tab" title="ME Closure Selector">MESel</a>';
	navTabs.appendChild(newtab);

	addon.id = "sidepanel-meclosrureselector";
	addon.className = "tab-pane";
	tabContent.appendChild(addon);

	getId("inMESfile").onchange = loadFile;
	getId("btnMESselect").onclick = selectSegments;
	getId("btnMESshow").onclick = drawClosure;
	getId("btnMESHide").onclick = hideClosure;
	getId("btnMEScenter").onclick = setPosition;
	getId("btnMESrangeAll").onclick = rangeAll;


}


function meClosureSelector_bootstrap()
{
	if ((typeof(unsafeWindow.OpenLayers) === 'undefined') || (typeof(unsafeWindow.Waze) === 'undefined') || (typeof(unsafeWindow.Waze.model) === 'undefined') || getId('user-info') === null) {
		setTimeout(meClosureSelector_bootstrap, 500);
	} else {
		meClosureSelector_init();
	}
}


meClosureSelector_bootstrap();

