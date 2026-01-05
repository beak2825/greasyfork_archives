// ==UserScript==
// @id             iitc-plugin-cop@jeanSorte
// @name           IITC plugin: Clearing OP Tool
// @category       Layer
// @version        0.4.3
// @description    [jeansorte-2014-07-23] Helps in planning Clearing by showing "destroyed" Links of Bookmarked Portals
// @description    Ingress OP Tool [BETA-VERSION]
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// @namespace https://greasyfork.org/users/122356
// @downloadURL https://update.greasyfork.org/scripts/29588/IITC%20plugin%3A%20Clearing%20OP%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/29588/IITC%20plugin%3A%20Clearing%20OP%20Tool.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
	// ensure plugin framework is there, even if iitc is not yet loaded
	if (typeof window.plugin !== 'function') window.plugin = function() {};

	//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
	//(leaving them in place might break the 'About IITC' page or break update checks)
	//plugin_info.buildName = 'jonatkins';
	//plugin_info.dateTimeVersion = '20131111.231646';
	//plugin_info.pluginId = 'draw-commKeys';
	//END PLUGIN AUTHORS NOTE
	// PLUGIN START ////////////////////////////////////////////////////////
	// use own namespace for plugin
	window.plugin.clearOPTool = function() {};

	window.plugin.clearOPTool.layerGroup = new L.FeatureGroup();
	window.plugin.clearOPTool.directionsLayerGroup = new L.FeatureGroup();
	window.plugin.clearOPTool.directionsLayers = {};
	window.plugin.clearOPTool.layerGroup.clearLayers();
	window.plugin.clearOPTool.layerGroupGuids = [];
	plugin.clearOPTool.routeRequest = {};
	plugin.clearOPTool.routeRequest.elem = null;


	window.plugin.clearOPTool.createLayer = function() {
		window.addLayerGroup('COP links', window.plugin.clearOPTool.layerGroup, true);
		window.addLayerGroup('COP directions', window.plugin.clearOPTool.directionsLayerGroup, true);
		window.plugin.clearOPTool.layerGroup.clearLayers();
	}

	window.plugin.clearOPTool.onMapDataRefreshEnd = function () {
	    if (window.plugin.clearOPTool.disabled) return;
		plugin.clearOPTool.checkBookmarks();
	    window.plugin.clearOPTool.layerGroup.bringToFront();
	}

	window.plugin.clearOPTool.checkAllLinks = function() {
		//if (window.plugin.crossLinks.disabled) return;
		console.debug("Destroyed-Links: checking all links");
		//plugin.crossLinks.linkLayer.clearLayers();
		window.plugin.clearOPTool.layerGroupLinkGuids = {};

		$.each(window.links, function(guid, link) {
			if ($.inArray(link.options.data.oGuid, window.plugin.clearOPTool.layerGroupGuids) != -1 || $.inArray(link.options.data.dGuid, window.plugin.clearOPTool.layerGroupGuids) != -1) {
				plugin.clearOPTool.showDestroyedLink(link);
			}
		});
	}

	window.plugin.clearOPTool.showDestroyedLink = function(link) {
		var poly = L.geodesicPolyline(link.getLatLngs(), {
			color: '#bbb',
			opacity: 0.8,
			weight: 5,
			clickable: false,
			dashArray: [8, 2],

			guid: link.options.guid
		});
		console.log("adding destroyed link");
		poly.addTo(window.plugin.clearOPTool.layerGroup);
		plugin.clearOPTool.layerGroupLinkGuids[link.options.guid] = poly;

	}

	window.plugin.clearOPTool.checkBookmarks = function() {
		var mobTerms = {'pedestrian':'Foot','bicycle':'Bike','fastest':'Car'};
		$.each(window.plugin.bookmarks.bkmrksObj['portals'], function(id, folder) {
			if (folder.mobility) {
		    	$("#"+id+ ' .COPmobility').html(mobTerms[folder.mobility]);
			}
			if (folder.showDestroyed == 1 || folder.label == "Others") {
				$.each(folder.bkmrk, function(id, bkmrk) {
					plugin.clearOPTool.layerGroupGuids.push(bkmrk.guid);
				})
			}
		})
		plugin.clearOPTool.checkAllLinks();
		if ($(".COPselector").length == 0) {
			plugin.clearOPTool.setupMenus();
		}
	}

	window.plugin.clearOPTool.calcRoute = function(elem) {
		if (plugin.clearOPTool.routeRequest.elem != null) {
			alert("Nur ein Route-Request pro Zeit!");
			return;
		}
		var id = $(elem).parent().parent('li').attr('id');
		$(elem).html("loading...");
		var locations = [];
		var ids = [];
		$.each(window.plugin.bookmarks.bkmrksObj['portals'][id].bkmrk, function(bkmrk_id, bkmrk) {
			var loc = bkmrk.latlng.split(",");
			locations.push({
				"latLng": {
					"lat": loc[0],
					"lng": loc[1]
				}
			});
			ids.push(bkmrk_id);
		})
		console.log("calculate route for: " + locations);
		//console.log(ids);
		plugin.clearOPTool.routeRequest.elem = $(elem);
		plugin.clearOPTool.routeRequest.ids = ids;
		plugin.clearOPTool.getDirections(locations, id);
	}

	window.plugin.clearOPTool.getDirections = function(points, folder_id) {
		var routeType = plugin.bookmarks.bkmrksObj['portals'][folder_id].mobility || "pedestrian";
		console.log("Routetype = "+routeType);
		$.ajax({
			dataType: "json",
			url: 'https://open.mapquestapi.com/directions/v2/optimizedroute?key=Fmjtd|luur2q62lu%2Crw%3Do5-9a2l1r',
			type: 'POST',
			contentType: 'json',

			data: JSON.stringify({
				options: {
					routeType: routeType,
					shapeFormat: "raw",
					fullShape: true
				},
				locations: points
			}),
			success: plugin.clearOPTool.getDirectionsCallback,
			error: plugin.clearOPTool.getDirectionsError,
		});
	}

	window.plugin.clearOPTool.getDirectionsError = function(data, stat, err) {
		console.log("Error in mapquest-Request: " + err);
		alert("Error in mapquest-Request");
		plugin.clearOPTool.routeRequest.elem.html("Route");
		plugin.clearOPTool.routeRequest.elem = null;
	}

	window.plugin.clearOPTool.getDirectionsCallback = function(data) {
		try {
			console.log("Das Team braucht " + data.route.formattedTime);
			plugin.clearOPTool.routeRequest.elem.html("Route:" + data.route.formattedTime);
			console.log(data.route.locationSequence);
			plugin.clearOPTool.reorderBookmarks(plugin.clearOPTool.routeRequest.ids, data.route.locationSequence);
			var shape = [];
			if (data.route.shape) {
				for (var i = 0; i < data.route.shape.shapePoints.length; i += 2) {
					shape.push(L.latLng(data.route.shape.shapePoints[i], data.route.shape.shapePoints[i + 1]));
				}
				var routeShape = L.polyline(shape, {
					color: '#f80',
					weight: 8
				});
				if (plugin.clearOPTool.directionsLayers[plugin.clearOPTool.routeRequest.elem.parent().parent('li').attr('id')]) {
					plugin.clearOPTool.directionsLayerGroup.removeLayer(plugin.clearOPTool.directionsLayers[plugin.clearOPTool.routeRequest.elem.parent().parent('li').attr('id')]);
				}
				plugin.clearOPTool.directionsLayers[plugin.clearOPTool.routeRequest.elem.parent().parent('li').attr('id')] = routeShape;
				plugin.clearOPTool.directionsLayerGroup.addLayer(routeShape);
			}
			plugin.clearOPTool.routeRequest.elem = null;
		} catch (e) {
			plugin.clearOPTool.getDirectionsError(data, "error", e)
		}
	}

	window.plugin.clearOPTool.reorderBookmarks = function(ids, order) {
		console.log("reorder " + ids + " to " + order);
		var notOrdered = true;
		for (var i = 1; i < order.length; i++) {
			$("#" + ids[order[i]]).insertAfter($("#" + ids[order[i - 1]]));
		}
	}

	window.plugin.clearOPTool.toggleDestroy = function(elem) {
		var id = $(elem).parent().parent('li').attr('id');
		$(elem).toggleClass("COPhigh", window.plugin.bookmarks.bkmrksObj['portals'][id].showDestroyed == 0);
		console.log(window.plugin.bookmarks.bkmrksObj['portals'][id]);
		if (window.plugin.bookmarks.bkmrksObj['portals'][id].showDestroyed == 1) {
			window.plugin.bookmarks.bkmrksObj['portals'][id].showDestroyed = 0;
		} else {
			window.plugin.bookmarks.bkmrksObj['portals'][id].showDestroyed = 1;
		};
		console.log(window.plugin.bookmarks.bkmrksObj['portals'][id].showDestroyed);
		plugin.clearOPTool.bookmarksHook();
	}

	window.plugin.clearOPTool.toggleMobility = function(elem) {
		var id = $(elem).parent().parent('li').attr('id');
		if (!window.plugin.bookmarks.bkmrksObj['portals'][id].mobility) window.plugin.bookmarks.bkmrksObj['portals'][id].mobility = "pedestrian";
		switch (window.plugin.bookmarks.bkmrksObj['portals'][id].mobility) {
		case "pedestrian":
			window.plugin.bookmarks.bkmrksObj['portals'][id].mobility = "bicycle";
			$(elem).html("Bike");
			break;
		case "bicycle":
			window.plugin.bookmarks.bkmrksObj['portals'][id].mobility = "fastest";
			$(elem).html("Car");
			break;
		case "fastest":
			window.plugin.bookmarks.bkmrksObj['portals'][id].mobility = "pedestrian";
			$(elem).html("Foot");
			break;
		};
		console.log(window.plugin.bookmarks.bkmrksObj['portals'][id].mobility);
		window.plugin.bookmarks.saveStorage();
		//plugin.clearOPTool.bookmarksHook();
	}

	window.plugin.clearOPTool.saveSquadToPortalCallback = function(data) {
		// $('#squadSelect div.wrap').html("<div style='text-align:center'>done!</div>");
		// if (sop_docked) {
		// 	renderPortalDetails(null);
		// }
		if (JSON.parse(data).squad_id == "0") window.plugin.squadOP.saveIssueToPortalCallback(data);
		else window.plugin.squadOP.reloadSquadTargets(data);
	}

	window.plugin.clearOPTool.saveToPoolCallback = function(data) {
		// $('#squadSelect div.wrap').html("<div style='text-align:center'>done!</div>");
		// if (sop_docked) {
		// 	renderPortalDetails(null);
		// }
		window.plugin.squadOP.saveIssueToPortalCallback(data);
	}

	window.plugin.clearOPTool.saveSquadToPortal = function(squad_id, guid, action, comment, title, latlng) {
		// with assigning Portals in SOP directly, the portal is in iitc-portals-array and details are present
		// with cop details might not be present and even the portal might not be in portals-array (after IITC-reload)
		// in this case we have to use the label and latlng property of the bookmark instead - details will be empty
		try {
			console.log('clearOPTool.saveSquadToPortal: ' + squad_id + ', ' + guid);
			try {
				var default_portal = {
					title: title,
					latE6: latlng.split(",")[0] * 1e6,
					lngE6: latlng.split(",")[1] * 1e6,
					health: "UNKNOWN",
					captured: true,
					mods: "UNKNOWN",
					team: "UNKNOWN",
					level: "UNKNOWN",
					resCount: "UNKNOWN",
					capturingPlayerId: "UNKNOWN"
				};
				selectPortal(window.portals[guid] ? guid : null);
				var portal = window.portals[guid] ? window.portals[guid].options.data : default_portal;
				var details = portalDetail.get(guid);
				console.log("details: " + JSON.stringify(details));
				if (typeof details != 'undefined') {
					if (details.owner) {
						portal.capturingPlayerId = details.owner;
						portal.mods = window.plugin.squadOP.getPortalModString(details.mods);
					} else {
						details.captured = false;
					}
				} else {
					details = {};
					details.captured = false;
				}
				console.log("saving");
				var requestType = (squad_id == "0") ? 'assignIssue' : 'assignPortal';
				window.plugin.squadOP.saveData.push({
					requestType: requestType,
					guid: guid,
					portal: portal,
					details: details,
					squad: squad_id,
					action: action,
					comment: window.plugin.nl2br(comment || ''),
					callback: window.plugin.clearOPTool.saveSquadToPortalCallback
				});

				// $('#squadSelect div.wrap').html("<div style='text-align:center'>saving..</div>");
				// plugin.squadOP.drawnDirections.clearLayers();
				if (window.plugin.squadOP.xhrSaveSquad != false) {
					window.plugin.squadOP.xhrSaveSquad.abort();
				}
				// $( this ).dialog( "close" );
			} catch (e) {
				alert("error in clearOPTool.saveSquadToPortal:" + e);
			}
		} catch (e) {
			console.log("saveSquadToPortal:" + e);
			window.plugin.squadOP.showLoader(false);
		}
	}

	window.plugin.clearOPTool.saveToPool = function(guid, action, comment) {
		try {
			console.log('clearOPTool.saveToPool: ' + guid);
			try {
				selectPortal(window.portals[guid] ? guid : null);
				var portal = window.portals[guid].options.data;
				var details = portalDetail.get(guid);
				if (typeof details != 'undefined') {
					if (details.owner) {
						portal.mods = window.plugin.squadOP.getPortalModString(details.mods);
					} else {
						details.captured = false;
					}
				} else {
					details = {};
					details.captured = false;
				}
				console.log("call assignIssue");
				window.plugin.squadOP.saveData.push({
					requestType: 'assignIssue',
					guid: guid,
					portal: portal,
					details: details,
					squad: 0,
					action: action,
					comment: window.plugin.nl2br(comment || ''),
					callback: window.plugin.clearOPTool.saveToPoolCallback
				});
				console.log(window.plugin.squadOP.saveData);

				// $('#squadSelect div.wrap').html("<div style='text-align:center'>saving..</div>");
				// plugin.squadOP.drawnDirections.clearLayers();
				if (window.plugin.squadOP.xhrSaveSquad != false) {
					window.plugin.squadOP.xhrSaveSquad.abort();
				}

				// $( this ).dialog( "close" );
			} catch (e) {
				alert("error in clearOPTool.saveToPool:" + e);
			}

		} catch (e) {
			console.log("saveToPool:" + e);
			window.plugin.squadOP.showLoader(false);
		}

	}

	/**
	 * saveSquadToPortal
	 */
	window.plugin.clearOPTool.openSquadDialog = function(elem) {
		var folder_id = $(elem).parent().parent('li').attr('id');

		try {
			win = "<table style='width:100%'  id='sop_directions'>";
			win += "<tr><td width='85' align='right'>" + soplng.team + ":</td><td colspan='2'><select id='COPsquadSel' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' style='width:100%;'><option value='0'>Pool</option>"+ window.plugin.squadOP.drawTeamSelect(true) + "</select></td></tr>";
			win += "<tr><td width='85' align='right'>" + soplng.targetportal + ":</td><td colspan='2'><b>" + window.plugin.bookmarks.bkmrksObj['portals'][folder_id].label + "</b></td></tr>";
			win += "<tr><td align='right'>" + soplng.task + ":</td><td colspan='2'><select id='COPactionSel'>" + window.plugin.squadOP.drawActionsOption() + "</select></td></tr>";
			win += "<tr><td align='right'>" + soplng.comment + ":</td><td colspan='2'><textarea style='width:100%' rows='2' id='cop_comment'></textarea></td></tr>";
			// win+= "<tr id='sop_squad_get_directions'><td align='right'>&nbsp;</td><td colspan='2' style='vertical-align:middle;'><select id='sop_squad_directions_select'><option value='0'>current position</option><option value='1'>next portal</option></select>";
			// win+= '<button onclick="window.plugin.squadOP.getSquadDirectionsStart()" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">get directions</button></td></tr>';
			// win+= "<tr id='sop_squad_directions_loader'><td align='right'><div style='height:52px;'>&nbsp;</div></td><td colspan='2' style='vertical-align:middle;'>directions loading..</td></tr>";
			win += "</table>";

			dialog({
				text: win,
				title: soplng.assignbookmarkstoteam,
				id: 'assign-squad-folder',
				width: 470,
				position: ['middle', 15],
				close: function() {
					//plugin.squadOP.drawnDirections.clearLayers();
					$(this).dialog("close");
				},
				buttons: [{
					text: soplng.save,
					click: function() {
						try {
							console.log("Assigning Folder " + folder_id + " to Squad " + $('#COPsquadSel').val() + " with Task " + $('#COPactionSel').val() + " and Comment " + $('#cop_comment').val())
							$.each(window.plugin.bookmarks.bkmrksObj['portals'][folder_id].bkmrk, function(bkmrk_id, bkmrk) {
								var guid = bkmrk.guid;
								console.log("guid = " + guid);
								plugin.clearOPTool.saveSquadToPortal($('#COPsquadSel').val(), guid, $('#COPactionSel').val(), $('#cop_comment').val(), bkmrk.label, bkmrk.latlng);
							})
							$(this).dialog("close");
						} catch (e) {
							alert("error in clearOPTool.openSquadDialog:" + e);
						}

					}
				}]
			});
		} catch (e) {
			console.log("saveSquadToPortal:" + e);
			window.plugin.squadOP.showLoader(false);
		}

	}
	/**
	 * saveSquadToPortal
	 */
	window.plugin.clearOPTool.openPoolDialog = function(elem) {
		var folder_id = $(elem).parent().parent('li').attr('id');

		try {
			win = "<table style='width:100%'>";
			win += "<tr><td width='85' align='right'>" + soplng.targetportal + ":</td><td colspan='2'><b>" + window.plugin.bookmarks.bkmrksObj['portals'][folder_id].label + "</b></td></tr>";
			win += "<tr><td align='right'>" + soplng.task + ":</td><td colspan='2'><select id='COPactionSel'>" + window.plugin.squadOP.drawActionsOption() + "</select></td></tr>";
			win += "<tr><td align='right'>" + soplng.comment + ":</td><td><textarea style='width:100%' rows='2' id='cop_comment'></textarea></td></tr>";
			win += "</table>";

			dialog({
				text: win,
				title: soplng.assignbookmarkstopool,
				id: 'assign-pool-folder',
				width: 470,
				position: ['middle', 15],
				close: function() {
					//plugin.squadOP.drawnDirections.clearLayers();
					$(this).dialog("close");
				},
				buttons: [{
					text: soplng.save,
					click: function() {
						try {
							console.log("Assigning Folder " + folder_id + " to Pool with Task " + $('#COPactionSel').val() + " and Comment " + $('#cop_comment').val())
							$.each(window.plugin.bookmarks.bkmrksObj['portals'][folder_id].bkmrk, function(bkmrk_id, bkmrk) {
								var guid = bkmrk.guid;
								console.log("guid = " + guid);
								plugin.clearOPTool.saveToPool(guid, $('#COPactionSel').val(), $('#cop_comment').val());
							})
							$(this).dialog("close");
						} catch (e) {
							alert("error in clearOPTool.openPoolDialog:" + e);
						}

					}
				}]
			});
		} catch (e) {
			console.log("saveToPool:" + e);
			window.plugin.squadOP.showLoader(false);
		}

	}

	window.plugin.clearOPTool.bookmarksHook = function() {
		window.plugin.clearOPTool.layerGroup.clearLayers();
		plugin.clearOPTool.layerGroupGuids = [];
		plugin.clearOPTool.checkBookmarks();
	}

	window.plugin.clearOPTool.setupCSS = function() {
		$('<style>').prop('type', 'text/css').html('#bookmarksBox{\n width: 250px\n} \n .COPhigh {\n color: yellow;\n} \n #bookmarksBox .COPselector {\n display: inline; \n padding-left: 7px;\n} \n .COPselector2 {\n display: block; \n}').appendTo("head");
	}

	window.plugin.clearOPTool.setupMenus = function() {
		var a = '<a class="COPselector" title="Destroy Links" onclick="window.plugin.clearOPTool.toggleDestroy(this);return false;"> Destroy </a>';
		var b = '<a class="COPselector" title="Calculate Route" onclick="window.plugin.clearOPTool.calcRoute(this);return false;">Route </a>';
		var c = '<a class="COPselector COPmobility" title="Mobility" onclick="window.plugin.clearOPTool.toggleMobility(this);return false;">Foot </a>';
		var d = '<a class="COPselector" title="Assign to SOP" onclick="window.plugin.clearOPTool.openSquadDialog(this);return false;">SOP </a>';
		var e = '<a class="COPselector" title="Assign to SOP-Issue Pool" onclick="window.plugin.clearOPTool.openPoolDialog(this);return false;">SOP-P </a>';
		$("#bkmrk_portals .bookmarkFolder > span ").after('<span class="folderLabel">' + a + b + c + d + '</span>');
	}

	window.plugin.nl2br = function(str, is_xhtml) {
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}

	var setup = function() {
			window.plugin.clearOPTool.createLayer();
			window.plugin.clearOPTool.setupCSS();
			window.plugin.clearOPTool.setupMenus();
			window.addHook('pluginBkmrksEdit', window.plugin.clearOPTool.bookmarksHook);
		    window.addHook('mapDataRefreshEnd', window.plugin.clearOPTool.onMapDataRefreshEnd);
		}

		// PLUGIN END //////////////////////////////////////////////////////////
		setup.info = plugin_info; //add the script info data to the function as a property
	if (!window.bootPlugins) window.bootPlugins = [];
	window.bootPlugins.push(setup);
	// if IITC has already booted, immediately run the 'setup' function
	if (window.iitcLoaded && typeof setup === 'function') setup();
}
// wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {
	version: GM_info.script.version,
	name: GM_info.script.name,
	description: GM_info.script.description
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
