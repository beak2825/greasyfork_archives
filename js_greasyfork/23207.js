// ==UserScript==
// @name            wLib test
// @description     A WME developers library
// @version         0.1a
// @author          SAR85,tm
// @copyright       SAR85
// @license         CC BY-NC-ND
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/*
// ==/UserScript==

(function () {
	/**
	* The wLib namespace.
	* @namespace
	* @global
	*/
	this.wLib = {VERSION: '0.1'};
}).call(this);

(function () {
	/*** GEOMETRY ***/
	/**
	* Namespace for functions related to geometry.
	* @memberof wLib
	* @namespace
	* @name wLib.Geometry
	*/
	this.Geometry = {
		/**
		* Determines if an {OpenLayers.Geometry} is within the map view.
		* @memberof wLib.Geometry
		* @param geometry {OpenLayers.Geometry}
		* @return {Boolean} Whether or not the geometry is in the map extent.
		*/
		isGeometryInMapExtent: function (geometry) {
			'use strict';
			return geometry && geometry.getBounds &&
			W.map.getExtent().intersectsBounds(geometry.getBounds())
		},
		/**
		 * Determines if an {OpenLayers.LonLat} is within the map view.
		 * @memberof wLib.Geometry
		 * @param {OpenLayers.LonLat} lonlat
		 * @return {Boolean} Whether or not the LonLat is in the map extent.
		 */
		isLonLatInMapExtent: function (lonlat) {
			'use strict';
			return lonlat && W.map.getExtent().containsLonLat(lonlat);
		}
	};
}).call(wLib);

(function() {
	/*** MODEL ***/
	/**
	* Namespace for functions related to the model.
	* @memberof wLib
	* @namespace
	* @name wLib.Model
	*/
	this.Model = {};
	
	/**
	* Gets the IDs of any selected segments.
	* @memberof wLib.Model
	* @return {Array} Array containing the IDs of selected segments.
	*/
	this.Model.getSelectedSegmentIDs = function () {
		'use strict';
		var i, n, selectedItems, item, segments = [];
		if (!W.selectionManager.hasSelectedItems()) {
			return false;
		} else {
			selectedItems = W.selectionManager.selectedItems;
			for (i = 0, n = selectedItems.length; i < n; i++) {
				item = selectedItems[i].model;
				if ('segment' === item.type) {
					segments.push(item.attributes.id);
				}
			}
			return segments.length === 0 ? false : segments;
		}
	};	
	
	/**
	 * Retrieves a route from the Waze Live Map.
	 * @class
	 * @name wLib.Model.RouteSelection
	 * @param firstSegment The segment to use as the start of the route.
	 * @param lastSegment The segment to use as the destination for the route.
	 * @param {Array|Function} callback A function or array of functions to be executed after the route
	 * is retrieved. 'This' in the callback functions will refer to the RouteSelection object.
	 * @param {Object} options A hash of options for determining route. Valid options are:
	 * fastest: {Boolean} Whether or not the fastest route should be used. Default is false,
	 * which selects the shortest route.
	 * freeways: {Boolean} Whether or not to avoid freeways. Default is false.
	 * dirt: {Boolean} Whether or not to avoid dirt roads. Default is false.
	 * longtrails: {Boolean} Whether or not to avoid long dirt roads. Default is false.
	 * uturns: {Boolean} Whether or not to allow U-turns. Default is true.
	 * @return {wLib.Model.RouteSelection} The new RouteSelection object.
	 * @example: // The following example will retrieve a route from the Live Map and select the segments in the route.
	 * selection = W.selectionManager.selectedItems;
	 * myRoute = new wLib.Model.RouteSelection(selection[0], selection[1], function(){this.selectRouteSegments();}, {fastest: true});
	 */
	this.Model.RouteSelection = function (firstSegment, lastSegment, callback, options) {
	    var i,
			n,
			start = this.getSegmentCenterLonLat(firstSegment),
			end = this.getSegmentCenterLonLat(lastSegment);
	    this.options = {
	        fastest: options && options.fastest || false,
	        freeways: options && options.freeways || false,
	        dirt: options && options.dirt || false,
			longtrails: options && options.longtrails || false,
	        uturns: options && options.uturns || true
	    };
	    this.requestData = {
	        from: 'x:' + start.x + ' y:' + start.y + ' bd:true',
	        to: 'x:' + end.x + ' y:' + end.y + ' bd:true',
	        returnJSON: true,
	        returnGeometries: true,
	        returnInstructions: false,
	        type: this.options.fastest ? 'HISTORIC_TIME' : 'DISTANCE',
	        clientVersion: '4.0.0',
	        timeout: 60000,
	        nPaths: 3,
	        options: this.setRequestOptions(this.options)
	    };
		this.callbacks = [];
		if (callback) {
			if (!(callback instanceof Array)) {
				callback = [callback];
			}
			for (i = 0, n = callback.length; i < n; i++) {
				if ('function' === typeof callback[i]) {
					this.callbacks.push(callback[i])
				}
			}
		}
	    this.routeData = null;
		this.getRouteData();
		return this;
	};
	this.Model.RouteSelection.prototype = /** @lends wLib.Model.RouteSelection.prototype */ {
		/**
		 * Formats the routing options string for the ajax request.
		 * @private
		 * @param {Object} options Object containing the routing options.
		 * @return {String} String containing routing options.
		 */
	    setRequestOptions: function (options) {
	        return 'AVOID_TOLL_ROADS:' + (options.tolls ? 't' : 'f') + ',' +
	      		'AVOID_PRIMARIES:' + (options.freeways ? 't' : 'f') + ',' +
	      		'AVOID_TRAILS:' + (options.dirt ? 't' : 'f') + ',' +
				'AVOID_LONG_TRAILS:' + (options.longtrails ? 't' : 'f') + ',' +
	      		'ALLOW_UTURNS:' + (options.uturns ? 't' : 'f');
	    },
		/**
		 * Gets the center of a segment in LonLat form.
		 * @private
		 * @param segment A Waze model segment object.
		 * @return {OpenLayers.LonLat} The LonLat object corresponding to the
		 * center of the segment.
		 */
	    getSegmentCenterLonLat: function (segment) {
			var x, y, componentsLength, midPoint;
			if (segment) {
				componentsLength = segment.geometry.components.length;
				midPoint = Math.floor( componentsLength / 2);
				if (componentsLength % 2 === 1) {
					x = segment.geometry.components[midPoint].x;
					y = segment.geometry.components[midPoint].y;
				} else {
					x = (segment.geometry.components[midPoint - 1].x +
						segment.geometry.components[midPoint].x) / 2;
					y = (segment.geometry.components[midPoint - 1].y +
						segment.geometry.components[midPoint].y) / 2;
				}
				return new OL.Geometry.Point(x, y).transform(W.map.getProjectionObject(), 'EPSG:4326');
			}
	        
	    },
		/**
		 * Gets the route from Live Map and executes any callbacks upon success.
		 * @private
		 * @returns The ajax request object. The responseJSON property of the returned object
		 * contains the route information.
		 * 
		 */
	    getRouteData: function () {
			var i,
				n,
				that = this;
	        return $.ajax({
	            dataType: "json",
	            url: this.getURL(),
	            data: this.requestData,
	            dataFilter: function (data, dataType) {
	                return data.replace(/NaN/g, '0');
	            },
				success: function(data) {
					that.routeData = data;
					for (i = 0, n = that.callbacks.length; i < n; i++) {
						that.callbacks[i].call(that);
					}
				}
	        });
	    },
		/**
		 * Extracts the IDs from all segments on the route.
		 * @private
		 * @return {Array} Array containing an array of segment IDs for
		 * each route alternative.
		 */
	    getRouteSegmentIDs: function () {
	        var i, j, route, len1, len2, segIDs = [], 
	            routeArray = [],
	            data = this.routeData;
	        if ('undefined' !== typeof data.alternatives) {
	            for (i = 0 , len1 = data.alternatives.length; i < len1; i++) {
	                route = data.alternatives[i].response.results;
	                for (j = 0, len2 = route.length; j < len2; j++) {
	                    routeArray.push(route[j].path.segmentId);
	                }
	                segIDs.push(routeArray);
	                routeArray = [];
	            }
	        } else {
	            route = data.response.results;
	            for (i = 0 , len1 = route.length; i < len1; i++) {
	                routeArray.push(route[i].path.segmentId);
	            }
	            segIDs.push(routeArray);
	        }
	        return segIDs;
	    },
		/**
		 * Gets the URL to use for the ajax request based on country.
		 * @private
		 * @return {String} Relative URl to use for route ajax request.
		 */
	    getURL: function () {
	        if (W.model.countries.get(235) || W.model.countries.get(40)) {
	            return '/RoutingManager/routingRequest';
	        } else if (W.model.countries.get(106)) {
	            return '/il-RoutingManager/routingRequest';
	        } else {
	            return '/row-RoutingManager/routingRequest';
	        }
	    },
		/**
		 * Selects all segments on the route in the editor.
		 * @param {Integer} routeIndex The index of the alternate route.
		 * Default route to use is the first one, which is 0.
		 */
	    selectRouteSegments: function (routeIndex) {
	        var i, n, seg,
				segIDs = this.getRouteSegmentIDs()[Math.floor(routeIndex) || 0],
	        	segments = [];
	        if (undefined === typeof segIDs) {
	            return;
	        }
	        for (i = 0, n = segIDs.length; i < n; i++) {
				seg = W.model.segments.get(segIDs[i])
	            if (undefined !== seg) {
					segments.push(seg);
				}
	        }
	        return W.selectionManager.select(segments);
	    }
	};
}).call(wLib);

(function() {
	/*** INTERFACE ***/
	/**
	* Namespace for functions related to the WME interface
	* @memberof wLib
	* @namespace
	* @name wLib.Interface
	*/
	this.Interface = {};

	this.Interface.Shortcut = OL.Class(this.Interface,
		/** @lends wLib.Interface.Shortcut.prototype */
		{name: null,
		group: null,
		shortcut: {},
		callback: null,
		scope: null,
		groupExists: false,
		actionExists: false,
		eventExists: false,
		/**
		* Creates a new {wLib.Interface.Shortcut}.
		* @class
		* @name wLib.Interface.Shortcut
		* @param name {String} The name of the shortcut.
		* @param group {String} The name of the shortcut group.
		* @param shortcut {String} The shortcut key(s). The shortcut should be of the form
		* 'i' where i is the keyboard shortuct or include modifier keys such as'CSA+i',
		* where C = the control key, S = the shift key, A = the alt key, and
		* i = the desired keyboard shortcut. The modifier keys are optional.
		* @param callback {Function} The function to be called by the shortcut.
		* @param scope {Object} The object to be used as this by the callback.
		* @return {wLib.Interface.Shortcut} The new shortcut object.
		* @example //Creates new shortcut and adds it to the map.
		* shortcut = new wLib.Interface.Shortcut('myName', 'myGroup', 'C+p', callbackFunc, null).add();
		*/
		initialize: function (name, group, shortcut, callback, scope) {
			var defaults = {group: 'default'};
			this.CLASS_NAME = 'wLib Shortcut';
			if ('string' === typeof name && name.length > 0 &&
				'string' === typeof shortcut && shortcut.length > 0 &&
				'function' === typeof callback) {
				this.name = name;
				this.group = group || defaults.group;
				this.callback = callback;
				this.shortcut[shortcut] = name;
				if ('object' !== typeof scope) {
					this.scope = null;
				} else {
					this.scope = scope;
				}
				return this;
			}
		},
		/**
		* Determines if the shortcut's group already exists.
		* @private
		*/
		doesGroupExist: function () {
			this.groupExists = 'undefined' !== typeof W.accelerators.Groups[this.group] &&
			undefined !== typeof W.accelerators.Groups[this.group].members &&
			W.accelerators.Groups[this.group].length > 0;
			return this.groupExists;
		},
		/**
		* Determines if the shortcut's action already exists.
		* @private
		*/
		doesActionExist: function () {
			this.actionExists = 'undefined' !== typeof W.accelerators.Actions[this.name];
			return this.actionExists;
		},
		/**
		* Determines if the shortcut's event already exists.
		* @private
		*/
		doesEventExist: function () {
			this.eventExists = 'undefined' !== typeof W.accelerators.events.listeners[this.name] &&
				W.accelerators.events.listeners[this.name].length > 0 &&
				this.callback === W.accelerators.events.listeners[this.name][0].func &&
				this.scope === W.accelerators.events.listeners[this.name][0].obj;
			return this.eventExists;
		},
		/**
		* Creates the shortcut's group.
		* @private
		*/
		createGroup: function () {
			W.accelerators.Groups[this.group] = [];
			W.accelerators.Groups[this.group].members = [];
		},
		/**
		* Registers the shortcut's action.
		* @private
		*/
		addAction: function () {
			W.accelerators.addAction(this.name, {group: this.group});
		},
		/**
		* Registers the shortcut's event.
		* @private
		*/
		addEvent: function () {
			W.accelerators.events.register(this.name, this.scope, this.callback);
		},
		/**
		* Registers the shortcut's keyboard shortcut.
		* @private
		*/
		registerShortcut: function () {
			W.accelerators.registerShortcuts(this.shortcut);
		},
		/**
		* Adds the keyboard shortcut to the map.
		* @return {wLib.Interface.Shortcut} The keyboard shortcut.
		*/
		add: function () {
			/* If the group is not already defined, initialize the group. */
			if (!this.doesGroupExist()) {
				this.createGroup();
			}

			/* Clear existing actions with same name */
			if (this.doesActionExist()) {
				W.accelerators.Actions[this.name] = null;
			}
			this.addAction();

			/* Register event only if it's not already registered */
			if (!this.doesEventExist()) {
				this.addEvent();
			}

			/* Finally, register the shortcut. */
			this.registerShortcut();
			return this;
		},
		/**
		* Removes the keyboard shortcut from the map.
		* @return {wLib.Interface.Shortcut} The keyboard shortcut.
		*/
		remove: function () {
			if (this.doesEventExist()) {
				W.accelerators.events.unregister(this.name, this.scope, this.callback);
			}
			if (this.doesActionExist()) {
				delete W.accelerators.Actions[this.name];
			}
			//remove shortcut?
			return this;
		},
		/**
		* Changes the keyboard shortcut and applies changes to the map.
		* @return {wLib.Interface.Shortcut} The keyboard shortcut.
		*/
		change: function (shortcut) {
			if (shortcut) {
				this.shortcut = {};
				this.shortcut[shortcut] = this.name;
				this.registerShortcut();
			}
			return this;
		}
	});
}).call(wLib);