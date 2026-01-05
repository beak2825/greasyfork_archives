// ==UserScript==
// @name         Spacom addons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  View zones, editor unlock
// @author       segrey
// @match        https://spacom.ru/?act=map
// @match        https://spacom.ru/?act=design*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/27897/Spacom%20addons.user.js
// @updateURL https://update.greasyfork.org/scripts/27897/Spacom%20addons.meta.js
// ==/UserScript==

(function (w) {
	
	function waitFor(obj, prop, callback) {
		var token = setInterval(function () {
			if (obj[prop] !== undefined) {
				clearInterval(token);
				callback(obj[prop]);
			}
		}, 0);
	}

	function createMapButton (css) {
		var last = $("#radar + div");
		var next = $('<div><i class="fa '+css+' fa-2x"></i></div>').css({
			"z-index": last.css("z-index"),
			"position": last.css("position"),
			"cursor": last.css("cursor"),
			"color": last.css("color"),
			"right": last.css("right"),
			"bottom": (parseInt(last.css("bottom")) + 40) + "px"
		});
		last.before(next);
		return next;
	}
	
	if (!w.Addons) {
		w.Addons = {};
	}

	Addons.ViewZones = {
		button: null,
		circles: null,
		enabled: false,
		createCircles: function () {
			this.circles = {};
			for (var id in map.fleets) {
				var fleet = map.fleets[id];
				if (fleet.owner == "own" && (fleet.turn == 0 || fleet.start_turn - fleet.turn == 0)) {
					var center;
					if (fleet.turn == 0) {
						center = getCenterXY(fleet.x, fleet.y);
					} else {
						center = {x: fleet.start_x, y: fleet.start_y};
					}
					this.circles[id] = new fabric.Circle({
						left: center.x,
						top: center.y,
						radius: fleet.view_radius * box_size,
						fill: 'rgb(40,100,40)',
						opacity: 0.2,
						originX: 'center',
						originY: 'center',
						selectable: false,
						visible:false
					});
					
					scene.add(this.circles[id]);
					scene.sendToBack(this.circles[id]);
				}
			}
		},
		draw: function () {
			if (!this.circles) {
				if (this.enabled) {
					this.createCircles();
				} else {
					return;
				}
			}
			
			var left = current_x;
			var top = current_y;
			var right = current_x + base_width / current_scale;
			var bottom = current_y + base_height / current_scale;
			
			for (var id in this.circles) {
				var circle = this.circles[id];
				var show = this.enabled;
				
				if (show) {
					var raduis = circle.getRadiusX();
					show = this.inBox(
						circle.getLeft(), circle.getTop(), 
						left  - raduis, top    - raduis, 
						right + raduis, bottom + raduis
					);
				}
				
				circle.set({visible:show});
			}
		},
		show: function (flag) {
			this.enabled = flag;
			this.draw();
			scene.renderAll();
		},
		toggle: function () {
			this.show(!this.enabled);
		},
		inBox: function (x, y, left, top, right, bottom) {
			return (x > left && x < right && y > top && y < bottom);
		},
		init: function () {
			var self = this;
			this.button = createMapButton("fa-eye");
			this.button.on("click", this.toggle.bind(this));
			
			var renewMap = map.renewMap;
			map.renewMap = function () {
				renewMap();
				self.draw();
			};
		}
	};
		
	Addons.AllLevels = {
		enable: function () {
			for (var i in design.template_components) {
				design.template_components[i].max_level = 100;
			}
			design.draw();
		},
		disable: function () {
			for (var i in design.template_components) {
				design.template_components[i].max_level = design.template_components[i]._max_level;
			}
			design.draw();
		},
		init: function () {
			var self = this;
			$("#details_list").prepend('<span><input id="all_levels" type="checkbox"> все уровни</span>');
			$("#all_levels").on("change", function () {
				if ($(this).is(":checked")) {
					self.enable();
				} else {
					self.disable();
				}
			});
			for (var i in design.template_components) {
				design.template_components[i]._max_level = design.template_components[i].max_level;
			}
		}
	};
			
	if (w.map) {
		Addons.ViewZones.init();
	} else if (w.Design) {
		waitFor(w, "design", function (design) {
			Addons.AllLevels.init();
		});
	}
})(unsafeWindow);