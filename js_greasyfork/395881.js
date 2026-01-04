// ==UserScript==
// @name         WME Manual JAI
// @namespace    https://www.waze.com/user/editor/B4ckTrace
// @version      1.0
// @description  Manually automatically, find avoided angles
// @author       B4ckTrace
// @include      https://www.waze.com/*/editor*
// @include      https://www.waze.com/editor*
// @include      https://beta.waze.com/*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395881/WME%20Manual%20JAI.user.js
// @updateURL https://update.greasyfork.org/scripts/395881/WME%20Manual%20JAI.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var GRAY_ZONE = 1.5;			//Gray zone angle intended to prevent from irregularities observed on map.
	var U_TURN_ANGLE = 168.24;		//U-Turn angle based on map experiments.
	var TURN_ANGLE = 45.50;			//Turn vs. keep angle - based on map experiments (45.04 specified in Wiki).
	var OVERLAPPING_ANGLE = 0.666;	//Experimentally measured overlapping angle.
	
	
	var ja_routing_type = {
		BC: "junction_none",
		KEEP: "junction_keep",
		KEEP_LEFT: "junction_keep_left",
		KEEP_RIGHT: "junction_keep_right",
		TURN: "junction_turn",
		TURN_LEFT: "junction_turn_left",
		TURN_RIGHT: "junction_turn_right",
		EXIT: "junction_exit",
		EXIT_LEFT: "junction_exit_left",
		EXIT_RIGHT: "junction_exit_right",
		U_TURN: "junction_u_turn",
		PROBLEM: "junction_problem",
		NO_TURN: "junction_no_turn",
		NO_U_TURN: "junction_no_u_turn",
		ROUNDABOUT: "junction_roundabout",
		ROUNDABOUT_EXIT: "junction_roundabout_exit",
		
		OverrideBC: "Override_none",
		OverrideCONTINUE: "Override_continue",
		OverrideKEEP_LEFT: "Override_keep_left",
		OverrideKEEP_RIGHT: "Override_keep_right",
		OverrideTURN_LEFT: "Override_turn_left",
		OverrideTURN_RIGHT: "Override_turn_right",
		OverrideEXIT: "Override_exit",
		OverrideEXIT_LEFT: "Override_exit_left",
		OverrideEXIT_RIGHT: "Override_exit_right",
		OverrideU_TURN: "Override_u_turn"
	};

	var ja_road_type = {
		//Streets
		NARROW_STREET: 22,
		STREET: 1,
		PRIMARY_STREET: 2,
		//Highways
		RAMP: 4,
		FREEWAY: 3,
		MAJOR_HIGHWAY: 6,
		MINOR_HIGHWAY: 7,
		//Other drivable
		DIRT_ROAD: 8,
		FERRY: 14,
		PRIVATE_ROAD: 17,
		PARKING_LOT_ROAD: 20,
		//Non-drivable
		WALKING_TRAIL: 5,
		PEDESTRIAN_BOARDWALK: 10,
		STAIRWAY: 16,
		RAILROAD: 18,
		RUNWAY: 19
	};
	
	function bootstrap(tries) {
        tries = tries || 1;

        if (W &&
			W.map &&
            W.model &&
			W.loginManager.user &&
            $
			) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        console.log("*** WME New Angle ***");
		
		// window.setInterval(Helper, 2000);

		//W.selectionManager.events.register("selectionchanged", null, Helper);
		// Action on zoom end
		// W.map.events.register("moveend", null, Helper);
		
		// Helper();
		
		
		
		// Add new tab item
		var userTabs = getId('user-info');
		var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
		var tabContent = getElementsByClassName('tab-content', userTabs)[0];
		var newtab = document.createElement('li');
		newtab.innerHTML = '<a href="#sidepanel-manual-jai" data-toggle="tab">Manual JAI</a>';
		var addon = document.createElement('section');
		addon.id = "sidepanel-manual-jai";
		addon.className = "tab-pane";
		var section = document.createElement('p');
		section.style.paddingTop = "0px";
		section.id = "manual-jai-box";
		section.className = 'input';
		section.innerHTML  = '<div><fieldset style="border: 1px solid silver; padding: 8px; border-radius: 4px;">'							 
							 + '<button id="manual-jai-scan">Find Yellow Angles</button>'
							 + '</fieldset></div>'
							 + '</div>'
		
		addon.appendChild(section);
		navTabs.appendChild(newtab);
		tabContent.appendChild(addon);
		
		getId('manual-jai-scan').onclick = Helper;
		
	}
	
	var ja_mapLayer = null;
	function Helper()
	{
		var lineFeature=[];
		if (window.W.map.getLayersBy("uniqueName","my_junction_angles").length === 0) {
			// Create a vector layer and give it your style map.
			ja_mapLayer = new OL.Layer.Vector("my_junction_angles", {uniqueName: "my_junction_angles"});
            W.map.addLayer(ja_mapLayer);
			
			//Set visibility according to user preference
			//ja_mapLayer.setVisibility(ja_getOption("defaultOn"));

			window.W.map.addLayer(ja_mapLayer);
		}
		
		ja_mapLayer.destroyFeatures();
		
		var ja_nodes = [];
		var restart = false;
		var ja_last_restart = 0;
		
		
		for (var seg in W.model.segments.objects) {	
			ja_nodes = [];
			var segment = W.model.segments.getObjectById(seg);
			if (!W.map.getExtent().intersectsBounds(segment.geometry.getBounds())){
				continue;
			}

			var attributes = segment.attributes;
			var line = getId(segment.geometry.id);

			if (line === null) {
			  continue;
			}
			
			
			if (segment.attributes.fromNodeID != null && ja_nodes.indexOf(segment.attributes.fromNodeID) === -1) {
				ja_nodes.push(segment.attributes.fromNodeID);
			}
			if (segment.attributes.toNodeID != null && ja_nodes.indexOf(segment.attributes.toNodeID) === -1) {
				ja_nodes.push(segment.attributes.toNodeID);
			}
			
			
			
			/**
			 * Collect double-turn (inc. U-turn) segments info
			 */
			var doubleTurns = {

				data: {}, //Structure: map<s_id, map<s_out_id, list<{s_in_id, angle, turn_type}>>>

				collect: function (s_id, s_in_id, s_out_id, angle, turn_type) {
					var info = this.data[s_id];
					if (info === undefined) {
						info = this.data[s_id] = {};
					}
					var list = info[s_out_id];
					if (list === undefined) {
						list = info[s_out_id] = [];
					}
					list.push({ s_in_id: s_in_id, angle: angle, turn_type: turn_type });
				},

				forEachItem: function (s_id, s_out_id, fn) {
					var info = this.data[s_id];
					if (info !== undefined) {
						var list = info[s_out_id];
						if (list !== undefined) {
							list.forEach(function(item, i) {
								fn(item, i);
							});
						}
					}
				}
			};

			//Loop through all 15m or less long segments and collect double-turn disallowed ones
			if (ja_nodes.length > 1) {
				function calc_segment(segmentId) {
					//var segmentId = selectedSegment.model.attributes.id;
					var segment = window.W.model.segments.objects[segmentId];
					console.log("Checking " + segmentId + " for double turns ...", 2);

					var len = ja_segment_length(segment);
					console.log("Segment " + segmentId + " length: " + len, 2);

					if (Math.round(len) <= 15) {

						var fromNode = getByID(window.W.model.nodes,segment.attributes.fromNodeID);
						var toNode = getByID(window.W.model.nodes,segment.attributes.toNodeID);
						var a_from = ja_getAngleMidleSeg(segment.attributes.fromNodeID, segment);
						var a_to = ja_getAngleMidleSeg(segment.attributes.toNodeID, segment);

						fromNode.attributes.segIDs.forEach(function (fromSegmentId) {
							if (fromSegmentId === segmentId) return;
							var fromSegment = window.W.model.segments.objects[fromSegmentId];
							if(!ja_is_up_to_primary_road(fromSegment)) return;
							var from_a = ja_getAngle(segment.attributes.fromNodeID, fromSegment);
							var from_angle = ja_angle_diff(from_a, a_from, false);
							console.log("Segment from " + fromSegmentId + " angle: " + from_a + ", turn angle: " + from_angle, 2);

							toNode.attributes.segIDs.forEach(function (toSegmentId) {
								if (toSegmentId === segmentId) return;
								var toSegment = window.W.model.segments.objects[toSegmentId];
								if(!ja_is_up_to_primary_road(toSegment)) return;
							  var to_a = ja_getAngle(segment.attributes.toNodeID, toSegment);
								var to_angle = ja_angle_diff(to_a, a_to, false);
								console.log("Segment to " + toSegmentId + " angle: " + to_a + ", turn angle: " + to_angle, 2);

								var angle = Math.abs(to_angle - from_angle);
								console.log("Angle from " + fromSegmentId + " to " + toSegmentId + " is: " + angle, 2);

								//Determine whether a turn is disallowed
								if (angle >= 175 - GRAY_ZONE && angle <= 185 + GRAY_ZONE) {
									var turn_type = (angle >= 175 + GRAY_ZONE && angle <= 185 - GRAY_ZONE) ?
											ja_routing_type.NO_U_TURN : ja_routing_type.PROBLEM;

									if (ja_is_turn_allowed(fromSegment, fromNode, segment) &&
											ja_is_turn_allowed(segment, toNode, toSegment)) {
										doubleTurns.collect(segmentId, fromSegmentId, toSegmentId, angle, turn_type);
									}
									if (ja_is_turn_allowed(toSegment, toNode, segment) &&
											ja_is_turn_allowed(segment, fromNode, fromSegment)) {
										doubleTurns.collect(segmentId, toSegmentId, fromSegmentId, angle, turn_type);
									}
								}
							});
						});
					}
				}
				calc_segment(seg);
			}
			
			//Start looping through selected nodes
			for (var i = 0; i < ja_nodes.length; i++) {
				var gline = null;
				var node = getByID(window.W.model.nodes,ja_nodes[i]);
				var angles = [];
				var ja_selected_segments_count = 0;
				var ja_selected_angles = [];
				var a;

				if (node == null || !node.hasOwnProperty('attributes')) {
					//Oh oh.. should not happen? We want to use a node that does not exist
					console.log("Oh oh.. should not happen?",2);
					console.log(node, 2);
					console.log(ja_nodes[i], 2);
					console.log(window.W.model, 3);
					console.log(window.W.model.nodes, 3);
					continue;
				}
				//check connected segments
				var ja_current_node_segments = node.attributes.segIDs;
				console.log(node, 2);

				//ignore of we have less than 2 segments
				if (ja_current_node_segments.length <= 1) {
					console.log("Found only " + ja_current_node_segments.length + " connected segments at " + ja_nodes[i] +
						", not calculating anything...", 2);
					continue;
				}

				console.log("Calculating angles for " + ja_current_node_segments.length + " segments", 2);
				console.log(ja_current_node_segments, 3);

				ja_current_node_segments.forEach(function (nodeSegment, j) {
					var s = window.W.model.segments.objects[nodeSegment];
					if(typeof s === 'undefined') {
						//Meh. Something went wrong, and we lost track of the segment. This needs a proper fix, but for now
						// it should be sufficient to just restart the calculation
						console.log("Failed to read segment data from model. Restarting calculations.", 1);
						if(ja_last_restart === 0) {
							ja_last_restart = new Date().getTime();
							setTimeout(function(){ja_calculate();}, 500);
						}
						restart = true;
					}
					a = ja_getAngle(ja_nodes[i], s);
					console.log("Segment " + nodeSegment + " angle is " + a, 2);
					angles[j] = [a, nodeSegment, s == null ? false : (s.attributes.id == seg)];
					// angles[j] = [a, nodeSegment, s == null ? false : true];
					if (s == null ? false : (s.attributes.id == seg)) {
					// if (s == null ? false : true) {
						ja_selected_segments_count++;
					}
				});

				if(restart) { return; }

				//make sure we have the selected angles in correct order
				console.log(ja_current_node_segments, 3);
				function angle_order(selectedSegmentId) {
					//var selectedSegmentId = selectedSegment.model.attributes.id;
					console.log("Checking if " + selectedSegmentId + " is in current node", 3);
					if(ja_current_node_segments.indexOf(selectedSegmentId) >= 0) {
						console.log("It is!", 4);
						//find the angle
						for(var j=0; j < angles.length; j++) {
							if(angles[j][1] === selectedSegmentId) {
								ja_selected_angles.push(angles[j]);
								break;
							}
						}
					} else {
						console.log("It's not..", 4);
					}
				}
				
				angle_order(seg);

				console.log(angles, 3);

				var ha, point;
				//if we have two connected segments selected, do some magic to get the turn angle only =)

				//sort angle data (ascending)
				angles.sort(function (a, b) {
					return a[0] - b[0];
				});
				console.log(angles, 3);
				console.log(ja_selected_segments_count, 3);

				//get all segment angles
				angles.forEach(function(angle, j) {
					a = (360 + (angles[(j + 1) % angles.length][0] - angle[0])) % 360;
					ha = (360 + ((a / 2) + angle[0])) % 360;
					var a_in = angles.filter(function(a) {
						return !!a[2];
					})[0];

					//Show only one angle for nodes with only 2 connected segments and a single selected segment
					// (not on both sides). Skipping the one > 180
					// if (ja_selected_segments_count === 1 && angles.length === 2 && a >=180 && ja_getOption("angleMode") !== "aDeparture" ) {
						// console.log("Skipping marker, as we need only one of them", 2);
						// return;
					// }
					if(ja_selected_segments_count > 0) {
						if(a_in[1] === angle[1]) {
							console.log("in == out. skipping.", 2);
							return;
						}
						console.log("Angle in:",2);
						console.log(a_in,2);
						// console.log("*** Type is: " + ja_guess_routing_instruction(node, a_in[1], angle[1], angles));
						var ja_junction_type = ja_guess_routing_instruction(node, a_in[1], angle[1], angles);
						if (ja_junction_type == ja_routing_type.PROBLEM)
						{
							var my_segment = window.W.model.segments.objects[a_in[1]];
							gline = my_segment.attributes.geometry.getVertices();
						}

						//draw double turn markers
						doubleTurns.forEachItem(a_in[1], angle[1], function(item) {
							// ja_draw_marker(point, node, ja_label_distance, item.angle, ha, true, item.turn_type);
							console.log(item.turn_type);
							if (item.turn_type == ja_routing_type.PROBLEM)
							{
								var my_segment = window.W.model.segments.objects[a_in[1]];
								gline = my_segment.attributes.geometry.getVertices();
							}
						});

					} else {
						console.log("Angle between " + angle[1] + " and " + angles[(j + 1) % angles.length][1] + " is " +
							a + " and position for label should be at " + ha, 3);
						point = new window.OL.Geometry.Point(
								node.geometry.x + (ja_label_distance * 1.25 * Math.cos((ha * Math.PI) / 180)),
								node.geometry.y + (ja_label_distance * 1.25 * Math.sin((ha * Math.PI) / 180))
						);
						// ja_draw_marker(point, node, ja_label_distance, a, ha);
						console.log(ha);
					}
				});
			}
			//testLayerZIndex();	 
			ja_last_restart = 0;
			
			
			
			if (gline) {				
				var style={
					strokeWidth: 3,
					strokeColor: "#ff7700",
					strokeOpacity: 0.95
				};
				var points=[];
				for (var i=0; i<gline.length; i++) { points.push(new window.OL.Geometry.Point(gline[i].x, gline[i].y)); }
				var newline=new window.OL.Geometry.LineString(points);
				lineFeature.push(new window.OL.Feature.Vector(newline, null, style));
				ja_mapLayer.addFeatures(lineFeature);
				alert(" پیدا شد ")
			}
			
	
		} // End of for
	} // End of Helper function
	
	function getByID(obj, id){
        if (typeof(obj.getObjectById) == "function"){
          return obj.getObjectById(id);
        }else if (typeof(obj.getObjectById) == "undefined"){
          return obj.get(id);
        }
    }
	
	function ja_getAngle(ja_node, ja_segment) {
		console.log("node: " + ja_node, 2);
		console.log("segment: " + ja_segment, 2);
		if (ja_node == null || ja_segment == null) { return null; }
		var ja_dx, ja_dy;
		if (ja_segment.attributes.fromNodeID === ja_node) {
			ja_dx = ja_get_second_point(ja_segment).x - ja_get_first_point(ja_segment).x;
			ja_dy = ja_get_second_point(ja_segment).y - ja_get_first_point(ja_segment).y;
		} else {
			ja_dx = ja_get_next_to_last_point(ja_segment).x - ja_get_last_point(ja_segment).x;
			ja_dy = ja_get_next_to_last_point(ja_segment).y - ja_get_last_point(ja_segment).y;
		}
		console.log(ja_node + " / " + ja_segment + ": dx:" + ja_dx + ", dy:" + ja_dy, 2);
		var ja_angle = Math.atan2(ja_dy, ja_dx);
		return ((ja_angle * 180 / Math.PI)) % 360;
	}
	
	function ja_getAngleMidleSeg(ja_node, ja_segment) {
		console.log("node: " + ja_node, 2);
		console.log("segment: " + ja_segment, 2);
		if (ja_node == null || ja_segment == null) { return null; }
		var ja_dx, ja_dy;
		if (ja_segment.attributes.fromNodeID === ja_node) {
			ja_dx = ja_get_last_point(ja_segment).x - ja_get_first_point(ja_segment).x;
			ja_dy = ja_get_last_point(ja_segment).y - ja_get_first_point(ja_segment).y;
		} else {
			ja_dx = ja_get_first_point(ja_segment).x - ja_get_last_point(ja_segment).x;
			ja_dy = ja_get_first_point(ja_segment).y - ja_get_last_point(ja_segment).y;
		}
		console.log(ja_node + " / " + ja_segment + ": dx:" + ja_dx + ", dy:" + ja_dy, 2);
		var ja_angle = Math.atan2(ja_dy, ja_dx);
		return ((ja_angle * 180 / Math.PI)) % 360;
	}
	
	function ja_is_primary_road(seg) {
		var t = seg.attributes.roadType;
		return t === ja_road_type.FREEWAY || t === ja_road_type.MAJOR_HIGHWAY || t === ja_road_type.MINOR_HIGHWAY;
	}
	
	function ja_is_up_to_primary_road(seg) {
		var t = seg.attributes.roadType;
		return t === ja_road_type.FREEWAY || t === ja_road_type.RAMP || t === ja_road_type.MAJOR_HIGHWAY || t === ja_road_type.MINOR_HIGHWAY || t === ja_road_type.PRIMARY_STREET;
	}

	function ja_is_ramp(seg) {
		var t = seg.attributes.roadType;
		return t === ja_road_type.RAMP;
	}

	function ja_is_turn_allowed(s_from, via_node, s_to) {
		console.log("Allow from " + s_from.attributes.id +
			" to " + s_to.attributes.id +
			" via " + via_node.attributes.id + "? " +
			via_node.isTurnAllowedBySegDirections(s_from, s_to) + " | " + s_from.isTurnAllowed(s_to, via_node), 2);

		//Is there a driving direction restriction?
		if(!via_node.isTurnAllowedBySegDirections(s_from, s_to)) {
			console.log("Driving direction restriction applies", 3);
			return false;
		}

		//Is turn allowed by other means (e.g. turn restrictions)?
		if(!s_from.isTurnAllowed(s_to, via_node)) {
			console.log("Other restriction applies", 3);
			return false;
		}

		if(s_to.attributes.fromNodeID === via_node.attributes.id) {
			console.log("FWD direction",3);
			return ja_is_car_allowed_by_restrictions(s_to.attributes.fwdRestrictions);
		} else {
			console.log("REV direction",3);
			return ja_is_car_allowed_by_restrictions(s_to.attributes.revRestrictions);
		}
	}
	
	function ja_angle_diff(aIn, aOut, absolute) {
		var a = parseFloat(aOut) - parseFloat(aIn);
		if(a > 180) { a -= 360; }
		if(a < -180) { a+= 360; }
		return absolute ? a : (a > 0 ? a - 180 : a + 180);
	}

	function ja_angle_dist(a, s_in_angle) {
		console.log("Computing out-angle " + a + " distance to in-angle " + s_in_angle, 4);
		var diff = ja_angle_diff(a, s_in_angle, true);
		console.log("Diff is " + diff + ", returning: " + (diff < 0 ? diff + 360 : diff), 4);
		return diff < 0 ? diff + 360 : diff;
	}
	
	function ja_get_first_point(segment) {
		return segment.geometry.components[0];
	}

	function ja_get_last_point(segment) {
		return segment.geometry.components[segment.geometry.components.length - 1];
	}

	function ja_get_second_point(segment) {
		return segment.geometry.components[1];
	}

	function ja_get_next_to_last_point(segment) {
		return segment.geometry.components[segment.geometry.components.length - 2];
	}
	
	function getId(node) {
	  return document.getElementById(node);
	}	
	
	function ja_segment_length(segment) {
		var len = segment.geometry.getGeodesicLength(window.W.map.olMap.projection);
		console.log("segment: " + segment.attributes.id
				+ " computed len: " + len + " attrs len: " + segment.attributes.length, 3);
		return len;
	}
	
	

	
	
	
	function ja_guess_routing_instruction(node, s_in_a, s_out_a, angles) {
	/**********************************************************************************
	 * @param node Junction node
	 * @param s_in_a "In" segment id
	 * @param s_out_a "Out" segment id
	 * @param angles array of segment absolute angles [0] angle, [1] segment id, 2[?]
	 * @returns {string}
	 **********************************************************************************/
		var s_n = {}, s_in = null, s_out = {}, street_n = {}, street_in = null, angle;
		var s_in_id = s_in_a;
		var s_out_id = s_out_a;

		console.log("Guessing routing instructions from " + s_in_a + " via node " + node.attributes.id + " to " + s_out_a,2);
		console.log(node, 4);
		console.log(s_in_a, 4);
		console.log(s_out_a, 4);
		console.log(angles, 3);

		s_in_a = window.$.grep(angles, function(element){
			return element[1] === s_in_a;
		});
		s_out_a = window.$.grep(angles, function(element){
			return element[1] === s_out_a;
		});

		node.attributes.segIDs.forEach(function(element) {
			if (element === s_in_id) {
				s_in = getByID(node.model.segments,element);
				street_in = ja_get_streets(element);
				//Set empty name for streets if not defined
				if(typeof street_in.primary === 'undefined') { street_in.primary = {}; }
				if(typeof street_in.primary.name === 'undefined') {
					street_in.primary.name = "";
				}
			} else {
				if(element === s_out_id) {
					//store for later use
					s_out[element] = getByID(node.model.segments,element);
					//Set empty name for streets if not defined
					if(typeof s_out[element].primary === 'undefined') {
						s_out[element].primary = { name: "" };
					}
				}
				s_n[element] = getByID(node.model.segments,element);
				street_n[element] = ja_get_streets(element);
				if(typeof street_n[element].primary === 'undefined') {
					street_n[element].primary = { name: ""};
				}
			}
		});

		console.log(s_n, 3);
		console.log(street_n,3);
		console.log(s_in,3);
		console.log(street_in,2);
		if (s_in === null || street_in === null) {
			//Should never happen, but adding to make code validation happy
			return ja_routing_type.PROBLEM;
		}

		angle = ja_angle_diff(s_in_a[0], (s_out_a[0]), false);
		console.log("turn angle is: " + angle, 2);

		//Check turn possibility first
		if(!ja_is_turn_allowed(s_in, node, s_out[s_out_id])) {
			console.log("Turn is disallowed!", 2);
			return ja_routing_type.NO_TURN;
		}


		//Roundabout - no true instruction guessing here!
		if (s_in.attributes.junctionID) {
			if (s_out[s_out_id].attributes.junctionID) {
				console.log("Roundabout continuation - no instruction", 2);
				return ja_routing_type.BC;
			} else {
				console.log("Roundabout exit - no instruction", 2);
				//exit just to visually distinguish from roundabout continuation
				return ja_routing_type.ROUNDABOUT_EXIT;
			}
		} else if (s_out[s_out_id].attributes.junctionID) {
			console.log("Roundabout entry - no instruction", 2);
			//no instruction since it's normally the only continuation - true instruction can be computed for
			//entry-exit selection only
			return ja_routing_type.BC;
		}

		//Check for U-turn, which is emitted even if there is only one s-out
		if (Math.abs(angle) > U_TURN_ANGLE + GRAY_ZONE) {
			console.log("Angle is >= 170 - U-Turn", 2);
			return ja_routing_type.U_TURN;
		} else if (Math.abs(angle) > U_TURN_ANGLE - GRAY_ZONE) {
			console.log("Angle is in gray zone 169-171", 2);
			return ja_routing_type.PROBLEM;
		}

		//No other possible turns
		if(node.attributes.segIDs.length <= 2) {
			console.log("Only one possible turn - no instruction", 2);
			return ja_routing_type.BC;
		} //No instruction

		/*
		 *
		 * Here be dragons!
		 *
		 */
		if(Math.abs(angle) < TURN_ANGLE - GRAY_ZONE) {
			console.log("Turn is <= 44", 2);

			/*
			 * Filter out disallowed and non-"BC eligible" turns.
			 */
			console.log("Original angles and street_n:", 2);
			console.log(angles, 2);
			console.log(street_n, 2);
			console.log(s_n, 2);
			angles = angles.filter(function (a) {
				console.log("Filtering angle: " + ja_angle_diff(s_in_a, a[0], false), 2);
				if(s_out_id === a[1] ||
					(typeof s_n[a[1]] !== 'undefined' &&
						ja_is_turn_allowed(s_in, node, s_n[a[1]]) &&
						Math.abs(ja_angle_diff(s_in_a, a[0], false)) < TURN_ANGLE //Any angle above 45.04 is not eligible
						)) {
					console.log(true, 4);
					return true;
				} else {
					console.log(false, 4);
					if(street_n[a[1]]) {
						delete s_n[a[1]];
						delete street_n[a[1]];
					}
					return false;
				}
			});
			console.log("Filtered angles and street_n:", 2);
			console.log(angles, 2);
			console.log(street_n, 2);
			console.log(s_n, 2);

			if(angles.length <= 1) {
				console.log("Only one allowed turn left", 2);
				return ja_routing_type.BC;
			} //No instruction

			/*
			 * Apply simplified BC logic
			 */
			var bc_matches = {}, bc_prio = 0, bc_count = 0;
			var bc_collect = function(a, prio) {
				console.log("Potential BC = " + prio, 2);
				console.log(a, 2);
				if (prio > bc_prio) { //highest priority wins now
					bc_matches = {};
					bc_prio = prio;
					bc_count = 0;
				}
				if (prio === bc_prio) {
					bc_matches[a[1]] = a;
					bc_count++;
				}
				console.log("BC candidates:", 2);
				console.log(bc_matches, 2);
			};

			//Check each eligible turn against routing rules
			for(var k=0; k< angles.length; k++) {
				var a = angles[k];

				console.log("Checking angle " + k, 2);
				console.log(a, 2);

				var tmp_angle = ja_angle_diff(s_in_a[0], a[0], false);
				console.log(tmp_angle, 2);

				var tmp_s_out = {};
				tmp_s_out[a[1]] = s_n[a[1]];
				var tmp_street_out = {};
				tmp_street_out[a[1]] = street_n[a[1]];

				var name_match = ja_primary_name_match(street_in, tmp_street_out) ||
						ja_alt_name_match(street_in, tmp_street_out) ||
						ja_cross_name_match(street_in, tmp_street_out);

				if(name_match && ja_segment_type_match(s_in, tmp_s_out)) {
					console.log("BC name and type match", 2);
					bc_collect(a, 3);
				} else if(name_match) {
					console.log("BC name match", 2);
					bc_collect(a, 2);
				} else if(ja_segment_type_match(s_in, tmp_s_out)) {
					console.log("BC type match", 2);
					bc_collect(a, 1);
				}
				//Else: Non-BC
			}

			//If s-out is the only BC, that's it.
			if (bc_matches[s_out_id] !== undefined && bc_count === 1) {
				console.log("\"straight\": no instruction", 2);
				return ja_routing_type.BC;
			}

			console.log("BC logic did not apply; using old default rules instead.", 2);

			//FZ69617: Sort angles in left most first order
			console.log("Unsorted angles", 4);
			console.log(angles, 4);
			angles.sort(function(a, b) { return ja_angle_dist(a[0], s_in_a[0][0]) - ja_angle_dist(b[0], s_in_a[0][0]); });
			console.log("Sorted angles", 4);
			console.log(angles, 4);

			//wlodek76: FIXING KEEP LEFT/RIGHT regarding to left most segment
			//WIKI WAZE: When there are more than two segments less than 45.04°, only the left most segment will be
			// KEEP LEFT, all the rest will be KEEP RIGHT
			//FZ69617: Wiki seems to be wrong here - experiments shows that "more than two" must be read as "at least two"
			//FZ69617: Wiki also does not mention differences between RHT and LHT countries for this consideration,
			// but map experiments seem to prove that we have to use reverse logic for LHT countries.
			if (!s_in.model.isLeftHand) { //RHT
				if (angles[0][1] === s_out_id) { //s-out is left most segment

					//wlodek76: KEEP LEFT/RIGHT overlapping case
					//WIKI WAZE: If the left most segment is overlapping another segment, it will also be KEEP RIGHT.
					if (!ja_overlapping_angles(angles[0][0], angles[1][0])) {
						console.log("Left most <45 segment: keep left", 2);
						return ja_routing_type.KEEP_LEFT;
					}
				}
			} else { //LHT
				//FZ69617: KEEP RIGHT/LEFT logic for right most segment
				//MISSING IN WIKI: When there are at least two segments less than 45.04°, only the right most segment will
				// be KEEP RIGHT, all the rest will be KEEP LEFT
				if (angles[angles.length - 1][1] === s_out_id) { //s-out is right most segment

					//FZ69617: KEEP RIGHT/LEFT overlapping case
					//MISSING IN WIKI: If the right most segment is overlapping another segment, it will also be KEEP LEFT.
					if (!ja_overlapping_angles(angles[angles.length - 1][0], angles[angles.length - 2][0])) {
						console.log("Right most <45 segment: keep right", 2);
						return ja_routing_type.KEEP_RIGHT;
					}
				}
			}

			//FZ69617: Two overlapping segments logic
			//WAZE WIKI: If the only two segments less than 45.04° overlap each other, neither will get an instruction.
			//...
			//wlodek76: Three overlapping segments logic
			//MISSING IN WIKI: If the ONLY THREE segments less than 45.04° overlap each other, neither will get an instruction.
			//...
			//FZ69617: Two or more overlapping segments logic
			//MISSING IN WIKI: If there are two or more segments less than 45.04° and all these segmentes overlap each other,
			// neither will get an instruction.
			var overlap_i = 1;
			while(overlap_i < angles.length &&
					ja_overlapping_angles(angles[0][0], angles[overlap_i][0])) {
				++overlap_i;
			}
			if(overlap_i > 1 && overlap_i === angles.length) {
				console.log("Two or more overlapping segments only: no instruction", 2);
				return ja_routing_type.BC;
			}

			//Primary to non-primary
			if(ja_is_primary_road(s_in) && !ja_is_primary_road(s_out[s_out_id])) {
				console.log("Primary to non-primary = exit", 2);
				return s_in.model.isLeftHand ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
			}

			//Ramp to non-primary or non-ramp
			if(ja_is_ramp(s_in) && !ja_is_primary_road(s_out[s_out_id]) && !ja_is_ramp(s_out[s_out_id]) ) {
				console.log("Ramp to non-primary and non-ramp = exit", 2);
				return s_in.model.isLeftHand ? ja_routing_type.EXIT_LEFT : ja_routing_type.EXIT_RIGHT;
			}

			console.log("DEFAULT: keep", 2);
			return s_in.model.isLeftHand ? ja_routing_type.KEEP_LEFT : ja_routing_type.KEEP_RIGHT;
		} else if (Math.abs(angle) < TURN_ANGLE + GRAY_ZONE) {
			console.log("Angle is in gray zone 44-46", 2);
			return ja_routing_type.PROBLEM;
		} else {
			console.log("Normal turn", 2);
			return ja_routing_type.TURN; //Normal turn (left|right)
		}
	}
	
	function ja_get_streets(segmentId) {
		var primary =
			window.W.model.streets.objects[window.W.model.segments.objects[segmentId].attributes.primaryStreetID];
		var secondary = [];
		window.W.model.segments.objects[segmentId].attributes.streetIDs.forEach(function (element) {
			secondary.push(window.W.model.streets.objects[element]);
		});
		console.log(primary, 3);
		console.log(secondary, 3);
		return { primary: primary, secondary: secondary };
	}
	
	function ja_is_car_allowed_by_restrictions(restrictions) {
		console.log("Checking restrictions for cars", 2);
		if(typeof restrictions === 'undefined' || restrictions == null || restrictions.length === 0) {
			console.log("No car type restrictions to check...", 3);
			return true;
		}
		console.log(restrictions, 3);

		return !restrictions.some(function(element) {
			/*jshint bitwise: false*/
			console.log("Checking restriction " + element, 3);
			//noinspection JSBitwiseOperatorUsage
			var ret = element.allDay &&				//All day restriction
				element.days === 127 &&				//Every week day
				( element.vehicleTypes === -1 ||	//All vehicle types
					element.vehicleTypes & ja_vehicle_types.PRIVATE //or at least private cars
					);
			if (ret) {
				console.log("There is an all-day-all-week restriction", 3);
				var fromDate = Date.parse(element.fromDate);
				var toDate = Date.parse(element.toDate);
				console.log("From: " + fromDate + ", to: " + toDate + ". " + ret, 3);
				if(isNaN(fromDate && isNaN(toDate))) {
					console.log("No start nor end date defined");
					return false;
				}
				var fRes, tRes;
				if(!isNaN(fromDate) && new Date() > fromDate) {
					console.log("From date is in the past", 3);
					fRes = 2;
				} else if(isNaN(fromDate)) {
					console.log("From date is invalid/not set", 3);
					fRes = 1;
				} else {
					console.log("From date is in the future: " + fromDate, 3);
					fRes = 0;
				}
				if(!isNaN(toDate) && new Date() < toDate) {
					console.log("To date is in the future", 3);
					tRes = 2;
				} else if(isNaN(toDate)) {
					console.log("To date is invalid/not set", 3);
					tRes = 1;
				} else {
					console.log("To date is in the past: " + toDate, 3);
					tRes = 0;
				}
				// Car allowed unless
				// - toDate is in the future and fromDate is unset or in the past
				// - fromDate is in the past and toDate is unset in the future
				// Hope I got this right ;)
				return (fRes <= 1 && tRes <= 1);
			}
			return ret;
		});
	}
	
	function ja_primary_name_match(street_in, streets) {
		console.log("PN", 2);
		console.log(street_in, 2);
		console.log(streets, 2);
		return Object.getOwnPropertyNames(streets).some(function (id, index, array) {
			var element = streets[id];
			console.log("PN Checking element " + index + " of " + array.length, 2);
			console.log(element, 2);
			return (element.primary.name === street_in.primary.name);
		});
	}
	
	function ja_segment_type_match(segment_in, segments) {
		console.log(segment_in, 2);
		console.log(segments, 2);

		return Object.getOwnPropertyNames(segments).some(function (segment_n_id, index) {
			var segment_n = segments[segment_n_id];
			console.log("PT Checking element " + index, 2);
			console.log(segment_n, 2);
			if(segment_n.attributes.id === segment_in.attributes.id) { return false; }
			console.log("PT checking sn.rt " + segment_n.attributes.roadType +
				" vs i.pt: " + segment_in.attributes.roadType, 2);
			return (segment_n.attributes.roadType === segment_in.attributes.roadType);
		});
	}
	
	function ja_overlapping_angles(a1, a2) {
		// If two angles are close < 2 degree they are overlapped.
		// Method of recognizing overlapped segment by server is unknown for me yet, I took this from WME Validator
		// information about this.
		// TODO: verify overlapping check on the side of routing server.
		return Math.abs(ja_angle_diff(a1, a2, true)) < OVERLAPPING_ANGLE;
	}
	
	function ja_cross_name_match(street_in, streets) {
		console.log("CN: init", 2);
		console.log(street_in, 2);
		console.log(streets, 2);
		return Object.getOwnPropertyNames(streets).some(function (street_n_id, index) {
			var street_n_element = streets[street_n_id];
			console.log("CN: Checking element " + index, 2);
			console.log(street_n_element, 2);
			return (street_in.secondary.some(function (street_in_secondary){
				console.log("CN2a: checking n.p: " + street_n_element.primary.name +
					" vs in.s: " + street_in_secondary.name, 2);

				//wlodek76: CROSS-MATCH works when two compared segments contain at least one ALT NAME
				//when alt name is empty cross-match does not work
				//FZ69617: This no longer seems to be needed
				//if (street_n_element.secondary.length === 0) { return false; }

				return street_n_element.primary.name === street_in_secondary.name;
			}) || street_n_element.secondary.some(function (street_n_secondary) {
				console.log("CN2b: checking in.p: " + street_in.primary.name + " vs n.s: " + street_n_secondary.name, 2);

				//wlodek76: CROSS-MATCH works when two compared segments contain at least one ALT NAME
				//when alt name is empty cross-match does not work
				//FZ69617: This no longer seems to be needed
				//if (street_in.secondary.length === 0) { return false; }

				//wlodek76: missing return from checking primary name with alternate names
				return street_in.primary.name === street_n_secondary.name;
			}));
		});
	}

	function ja_alt_name_match(street_in, streets) {
		return Object.getOwnPropertyNames(streets).some(function (street_n_id, index) {
			var street_n_element = streets[street_n_id];
			console.log("AN alt name check: Checking element " + index, 2);
			console.log(street_n_element, 2);

			if(street_in.secondary.length === 0) { return false; }
			if(street_n_element.secondary.length === 0) { return false; }

			return street_in.secondary.some(function (street_in_secondary, index2) {
				console.log("AN2 checking element " + index2, 2);
				console.log(street_in_secondary, 2);
				return street_n_element.secondary.some(function (street_n_secondary_element, index3) {
					console.log("AN3 Checking in.s: " + street_in_secondary.name +
						" vs n.s." + index3 + ": " + street_n_secondary_element.name, 2);
					return street_in_secondary.name === street_n_secondary_element.name;
				});
			});
		});
	}
	
	function getElementsByClassName(classname, node) {
	  if(!node) node = document.getElementsByTagName("body")[0];
	  var a = [];
	  var re = new RegExp('\\b' + classname + '\\b');
	  var els = node.getElementsByTagName("*");
	  for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	  return a;
	};


	bootstrap();
})();