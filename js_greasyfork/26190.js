// ==UserScript==
// @name                WME MagicPlaces
// @description         Clone, Orthogonalize (mini version from MagicPlaces)
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://beta.waze.com/*
// @version             1.1.1
// @grant               none
// @license             CC BY 4.0
// @namespace https://greasyfork.org/users/68507
// @downloadURL https://update.greasyfork.org/scripts/26190/WME%20MagicPlaces.user.js
// @updateURL https://update.greasyfork.org/scripts/26190/WME%20MagicPlaces.meta.js
// ==/UserScript==


function run_magicwand() {
	var wmelmw_version = "1.1.0";

	/* bootstrap, will call initialiseHighlights() */
	function bootstraMagicPlaces() {
		var bGreasemonkeyServiceDefined = false;

		/* begin running the code! */
		setTimeout(initialiseMagicPlaces, 500);
	}

	/* helper function */
	function getElClass(classname, node) {
		if (!node) node = document.getElementsByTagName("body")[0];
		var a = [];
		var re = new RegExp('\\b' + classname + '\\b');
		var els = node.getElementsByTagName("*");
		for (var i = 0, j = els.length; i < j; i++)
			if (re.test(els[i].className)) a.push(els[i]);
		return a;
	}

	function getElId(node) {
		return document.getElementById(node);
	}

	/* =========================================================================== */

	function initialiseMagicPlaces() {
		try {
			if (!((typeof window.Waze.map != undefined) && (undefined != typeof window.Waze.map.events.register) && (undefined != typeof window.Waze.selectionManager.events.register ) && (undefined != typeof window.Waze.loginManager.events.register) )) {
				setTimeout(initialiseMagicPlaces, 1000);
				return;
			}
		} catch (err) {
			setTimeout(initialiseMagicPlaces, 1000);
			return;
		}

		var userInfo = getElId('user-info');
		var userTabs = getElId('user-tabs');

		if(!getElClass('nav-tabs', userTabs)[0]) {
			setTimeout(initialiseMagicPlaces, 1000);
			return;
		}

		var navTabs = getElClass('nav-tabs', userTabs)[0];
		var tabContent = getElClass('tab-content', userInfo)[0];

		var newtab = document.createElement('li');
		newtab.innerHTML = '<a href="#sidepanel-magicwand" data-toggle="tab">MagicPlaces</a>';
		navTabs.appendChild(newtab);

		 // add new box to left of the map
		var addon = document.createElement('section');
		addon.innerHTML = '<b>WME Magic Wand</b> v' + wmelmw_version + '<br>'
			+ '<label>Максимальный угол <input type="text" id="_cMagicPlacesAngleThreshold" name="_cMagicPlacesAngleThreshold" value="12" size="3" maxlength="2" /></label><br/>'
			+ 'Значение, на которое скрипт может исправить угол, если для выпремления тербуется больше - не меняет (по умолчанию 12)<br><br>'
			+ '<label>Степень выпрямления <input type="text" id="_cMagicPlacesSimplification" name="_cMagicPlacesSimplification" value="3" size="5" maxlength="4" /></label><br/><br/>'
			+ 'Значение угла со значение котрого имли меньше, убираются узлы рекомендовано от 0 до 5 (по умолчанию 4)<br><br>';

		addon.id = "sidepanel-magicwand";
		addon.className = "tab-pane";
		tabContent.appendChild(addon);

		loadWMEMagicPlacesSettings();

		// Event listeners
		Waze.selectionManager.events.register("selectionchanged", null, insertLandmarkSelectedButtons);
		window.addEventListener("beforeunload", saveWMEMagicPlacesOptions, false);

		// Hotkeys
		registerKeyShortcut("WMEMagicPlaces_CloneLandmark", "Clone Landmark", cloneLandmark, {"C+c": "WMEMagicPlaces_CloneLandmark"});
		registerKeyShortcut("WMEMagicPlaces_OrthogonalizeLandmark", "Orthogonalize Landmark", Orthogonalize, {"C+x": "WMEMagicPlaces_OrthogonalizeLandmark"});
		registerKeyShortcut("WMEMagicPlaces_SimplifyLandmark", "Simplify Landmark", simplifySelectedLandmark, {"C+j": "WMEMagicPlaces_SimplifyLandmark"});
	}


	function registerKeyShortcut(action_name, annotation, callback, key_map) {
		Waze.accelerators.addAction(action_name, {group: 'default'});
		Waze.accelerators.events.register(action_name, null, callback);
		Waze.accelerators._registerShortcuts(key_map);
	}

	function loadWMEMagicPlacesSettings () {
		if (localStorage.WMEMagicPlacesScript) {
			console.log("WME MagicPlaces: loading options");
			var options = JSON.parse(localStorage.WMEMagicPlacesScript);

			getElId('_cMagicPlacesAngleThreshold').value = typeof options[0] != 'undefined' ? options[0] : 12;
			getElId('_cMagicPlacesSimplification').value = typeof options[1] != 'undefined' ? options[1] : 4;
		}
	}

	function saveWMEMagicPlacesOptions() {
		if (localStorage) {
			console.log("WME MagicPlaces: saving options");
			var options = [];

			// preserve previous options which may get lost after logout
			if (localStorage.WMEMagicPlacesScript)
				options = JSON.parse(localStorage.WMEMagicPlacesScript);

			options[0] = getElId('_cMagicPlacesAngleThreshold').value;
			options[1] = getElId('_cMagicPlacesSimplification').value;

			localStorage.WMEMagicPlacesScript = JSON.stringify(options);
		}
	}

	var insertLandmarkSelectedButtons = function(e)
	{
		if(Waze.selectionManager.selectedItems.length == 0 || Waze.selectionManager.selectedItems[0].model.type != 'venue') return;
		if(getElId('_bMagicPlacesEdit_CloneLandmark') != null) return;

		$('#landmark-edit-general').prepend(
			'<div class="form-group"> \
			  <div class="controls"> \
				<input style="padding: 6px 8px;" type="button" id="_bMagicPlacesEdit_CloneLandmark" name="_bMagicPlacesEdit_CloneLandmark" class="btn btn-default" value="Клонировать" title="Ctrl+C (default)" /> \
				<input style="padding: 6px 8px;" type="button" id="_bMagicPlacesEdit_Corners" name="_bMagicPlacesEdit_Corners" class="btn btn-default" value="Выровнять" title="Ctrl+X (default)"/>\
				<input style="padding: 6px 8px;" type="button" id="_bMagicPlacesEdit_Simplify" name="_bMagicPlacesEdit_Simplify" class="btn btn-default" value="Упростить" title="Ctrl+J (default)"/>\
			  </div> \
			</div>'
		);

		$('#_bMagicPlacesEdit_CloneLandmark').click(cloneLandmark);
		$('#_bMagicPlacesEdit_Corners').click(Orthogonalize);
		$('#_bMagicPlacesEdit_Simplify').click(simplifySelectedLandmark);
	};

	var simplifySelectedLandmark = function () {
		var selectorManager = Waze.selectionManager;
		if (!selectorManager.hasSelectedItems() || selectorManager.selectedItems[0].model.type !== "venue" || !selectorManager.selectedItems[0].model.isGeometryEditable()) {
			return;
		}
		var simplifyFactor = $('#_cMagicPlacesSimplification').val();
		var SelectedLandmark = selectorManager.selectedItems[0];
		var oldGeometry = SelectedLandmark.geometry.clone();

		var LineString = new OpenLayers.Geometry.LineString(oldGeometry.components[0].components);
		LineString = LineString.simplify(simplifyFactor);
		var newGeometry = new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(LineString.components));

		if (newGeometry.components[0].components.length < oldGeometry.components[0].components.length) {
			var UpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
			W.model.actionManager.add(new UpdateFeatureGeometry(SelectedLandmark.model, W.model.venues, oldGeometry, newGeometry));
		}
	};

	var cloneLandmark = function () {
		var selectorManager = Waze.selectionManager;
		if (!selectorManager.hasSelectedItems() || selectorManager.selectedItems[0].model.type != 'venue') {
			return;
		}

		var SelectedLandmark = selectorManager.selectedItems[0];
		var ClonedLandmark = SelectedLandmark.clone();
		ClonedLandmark.geometry.move(50, 50); // move to some offset
		ClonedLandmark.geometry.clearBounds();

		var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
		var wazeActionAddLandmark = require("Waze/Action/AddLandmark");

		var NewLandmark = new wazefeatureVectorLandmark();
		NewLandmark.geometry = ClonedLandmark.geometry;
		NewLandmark.attributes.categories = SelectedLandmark.model.attributes.categories;

		Waze.model.actionManager.add(new wazeActionAddLandmark(NewLandmark));
		selectorManager.select([NewLandmark]);
	};

	var Orthogonalize = function() {
		if (Waze.selectionManager.selectedItems.length <= 0 || Waze.selectionManager.selectedItems[0].model.type != 'venue') {
			return;
		}

		var SelectedLandmark = Waze.selectionManager.selectedItems[0];

		var geom = SelectedLandmark.geometry.clone();
		var components = geom.components[0].components;
		var functor = new OrthogonalizeId(components);

		var newWay = functor.action();
		var wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");

		var removeVertices = [];
		var undoGeometry = SelectedLandmark.geometry.clone();
		for (var i = 0; i < newWay.length; i++) {
			if (newWay[i] === false) {
				removeVertices.push(SelectedLandmark.geometry.components[0].components[i]);
			} else {
				SelectedLandmark.geometry.components[0].components[i].x = newWay[i].x;
				SelectedLandmark.geometry.components[0].components[i].y = newWay[i].y;
			}
		}

		if (removeVertices) {
			SelectedLandmark.geometry.components[0].removeComponents(removeVertices);
		}

		SelectedLandmark.geometry.components[0].clearBounds();

		var action = new wazeActionUpdateFeatureGeometry(SelectedLandmark.model, Waze.model.venues, undoGeometry, SelectedLandmark.geometry);
		Waze.model.actionManager.add(action);

		delete undoGeometry;
	};

	var OrthogonalizeId = function (way) {
		var threshold = getElId('_cMagicPlacesAngleThreshold').value, // degrees within right or straight to alter
			lowerThreshold = Math.cos((90 - threshold) * Math.PI / 180),
			upperThreshold = Math.cos(threshold * Math.PI / 180);

		this.way = way;

		this.action = function () {
			var nodes = this.way,
				points = nodes.slice(0, nodes.length - 1).map(function (n) {
					var t = n.clone();
					var p = t.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
					p.y = lat2latp(p.y);
					return p;
				}),
				corner = {i: 0, dotp: 1},
				epsilon = 1e-4,
				i, j, score, motions;

			// Triangle
			if (nodes.length === 4) {
				for (i = 0; i < 1000; i++) {
					motions = points.map(calcMotion);

					var tmp = addPoints(points[corner.i], motions[corner.i]);
					points[corner.i].x = tmp.x;
					points[corner.i].y = tmp.y;

					score = corner.dotp;
					if (score < epsilon) {
						break;
					}
				}

				var n = points[corner.i];
				n.y = latp2lat(n.y);
				var pp = n.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

				var id = nodes[corner.i].id;
				for (i = 0; i < nodes.length; i++) {
					if (nodes[i].id != id) {
						continue;
					}

					nodes[i].x = pp.x;
					nodes[i].y = pp.y;
				}

				return nodes;
			} else {
				var best,
					originalPoints = nodes.slice(0, nodes.length - 1).map(function (n) {
						var t = n.clone();
						var p = t.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
						p.y = lat2latp(p.y);
						return p;
					});
					score = Infinity;

				for (i = 0; i < 1000; i++) {
					motions = points.map(calcMotion);
					for (j = 0; j < motions.length; j++) {
						var tmp = addPoints(points[j], motions[j]);
						points[j].x = tmp.x;
						points[j].y = tmp.y;
					}
					var newScore = squareness(points);
					if (newScore < score) {
						best = points.clone();
						score = newScore;
					}
					if (score < epsilon) {
						break;
					}
				}

				points = best;

				for (i = 0; i < points.length; i++) {
					// only move the points that actually moved
					if (originalPoints[i].x !== points[i].x || originalPoints[i].y !== points[i].y) {
						var n = points[i];
						n.y = latp2lat(n.y);
						var pp = n.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

						var id = nodes[i].id;
						for (j = 0; j < nodes.length; j++) {
							if (nodes[j].id != id) {
								continue;
							}

							nodes[j].x = pp.x;
							nodes[j].y = pp.y;
						}
					}
				}

				// remove empty nodes on straight sections
				for (i = 0; i < points.length; i++) {
					var dotp = normalizedDotProduct(i, points);
					if (dotp < -1 + epsilon) {
						id = nodes[i].id;
						for (j = 0; j < nodes.length; j++) {
							if (nodes[j].id != id) {
								continue;
							}

							nodes[j] = false;
						}
					}
				}

				return nodes;
			}

			function calcMotion(b, i, array) {
				var a = array[(i - 1 + array.length) % array.length],
					c = array[(i + 1) % array.length],
					p = subtractPoints(a, b),
					q = subtractPoints(c, b),
					scale, dotp;

				scale = 2 * Math.min(euclideanDistance(p, {x: 0, y: 0}), euclideanDistance(q, {x: 0, y: 0}));
				p = normalizePoint(p, 1.0);
				q = normalizePoint(q, 1.0);

				dotp = filterDotProduct(p.x * q.x + p.y * q.y);

				// nasty hack to deal with almost-straight segments (angle is closer to 180 than to 90/270).
				if (array.length > 3) {
					if (dotp < -0.707106781186547) {
						dotp += 1.0;
					}
				} else if (dotp && Math.abs(dotp) < corner.dotp) {
					corner.i = i;
					corner.dotp = Math.abs(dotp);
				}

				return normalizePoint(addPoints(p, q), 0.1 * dotp * scale);
			}
		};

		function squareness(points) {
			return points.reduce(function (sum, val, i, array) {
				var dotp = normalizedDotProduct(i, array);

				dotp = filterDotProduct(dotp);
				return sum + 2.0 * Math.min(Math.abs(dotp - 1.0), Math.min(Math.abs(dotp), Math.abs(dotp + 1)));
			}, 0);
		}

		function normalizedDotProduct(i, points) {
			var a = points[(i - 1 + points.length) % points.length],
				b = points[i],
				c = points[(i + 1) % points.length],
				p = subtractPoints(a, b),
				q = subtractPoints(c, b);

			p = normalizePoint(p, 1.0);
			q = normalizePoint(q, 1.0);

			return p.x * q.x + p.y * q.y;
		}

		function subtractPoints(a, b) {
			return {x: a.x - b.x, y: a.y - b.y};
		}

		function addPoints(a, b) {
			return {x: a.x + b.x, y: a.y + b.y};
		}

		function euclideanDistance(a, b) {
			var x = a.x - b.x, y = a.y - b.y;
			return Math.sqrt((x * x) + (y * y));
		}

		function normalizePoint(point, scale) {
			var vector = {x: 0, y: 0};
			var length = Math.sqrt(point.x * point.x + point.y * point.y);
			if (length !== 0) {
				vector.x = point.x / length;
				vector.y = point.y / length;
			}

			vector.x *= scale;
			vector.y *= scale;

			return vector;
		}

		function filterDotProduct(dotp) {
			if (lowerThreshold > Math.abs(dotp) || Math.abs(dotp) > upperThreshold) {
				return dotp;
			}

			return 0;
		}

		this.isDisabled = function (nodes) {
			var points = nodes.slice(0, nodes.length - 1).map(function (n) {
				var p = n.toLonLat().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
				return {x: p.lat, y: p.lon};
			});

			return squareness(points);
		};
	};

	function lat2latp(lat) {
		return 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * (Math.PI / 180) / 2));
	}

	function latp2lat(a) {
		return 180 / Math.PI * (2 * Math.atan(Math.exp(a * Math.PI / 180)) - Math.PI / 2);
	}

	// Point class
	function Point(x, y) {
		this.x = x;
		this.y = y;

		this.toString = function () {
			return "x: " + x + ", y: " + y;
		};
		this.rotateRight = function (p1, p2) {
			// cross product, + is counterclockwise, - is clockwise
			return ((p2.x * y - p2.y * x) - (p1.x * y - p1.y * x) + (p1.x * p2.y - p1.y * p2.x)) < 0;
		};
	}

	Point.prototype.add = function(v){
		return new Point(this.x + v.x, this.y + v.y);
	};
	Point.prototype.clone = function(){
		return new Point(this.x, this.y);
	};
	Point.prototype.degreesTo = function(v){
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var angle = Math.atan2(dy, dx); // radians
		return angle * (180 / Math.PI); // degrees
	};
	Point.prototype.distance = function(v){
		var x = this.x - v.x;
		var y = this.y - v.y;
		return Math.sqrt(x * x + y * y);
	};
	Point.prototype.equals = function(toCompare){
		return this.x == toCompare.x && this.y == toCompare.y;
	};
	Point.prototype.interpolate = function(v, f){
		return new Point((this.x + v.x) * f, (this.y + v.y) * f);
	};
	Point.prototype.length = function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	Point.prototype.normalize = function(thickness){
		var l = this.length();
		this.x = this.x / l * thickness;
		this.y = this.y / l * thickness;
	};
	Point.prototype.orbit = function(origin, arcWidth, arcHeight, degrees){
		var radians = degrees * (Math.PI / 180);
		this.x = origin.x + arcWidth * Math.cos(radians);
		this.y = origin.y + arcHeight * Math.sin(radians);
	};
	Point.prototype.offset = function(dx, dy){
		this.x += dx;
		this.y += dy;
	};
	Point.prototype.subtract = function(v){
		return new Point(this.x - v.x, this.y - v.y);
	};
	Point.prototype.toString = function(){
		return "(x=" + this.x + ", y=" + this.y + ")";
	};

	Point.interpolate = function(pt1, pt2, f){
		return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
	};
	Point.polar = function(len, angle){
		return new Point(len * Math.cos(angle), len * Math.sin(angle));
	};
	Point.distance = function(pt1, pt2){
		var x = pt1.x - pt2.x;
		var y = pt1.y - pt2.y;
		return Math.sqrt(x * x + y * y);
	};

	/* engage! =================================================================== */
	bootstraMagicPlaces();
}

/* end ======================================================================= */

var DLscript = document.createElement("script");
DLscript.textContent = run_magicwand.toString() + ' \n' + 'run_magicwand();';
DLscript.setAttribute("type", "application/javascript");
document.body.appendChild(DLscript);