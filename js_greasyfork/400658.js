// ==UserScript==
// @id             IntelHelper
// @name           IITC plugin: Intel Helper
// @author         xZwop
// @category       Layer
// @version        0.4.0.20160215195746
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    [intelhelper-2016-02-15-195746] Intel-Helper is an IITC plugin that allows any intel user to have a better vision of what is going on. Highlight links created and destroyed, allows the user to hover any action done through the chat to visualize it on the map. Also, detect ADA and Jarvis when it is possible.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/400658/IITC%20plugin%3A%20Intel%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/400658/IITC%20plugin%3A%20Intel%20Helper.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START //

window.plugin.intelhelper = function() {};

// Max time default: 1 hour
window.plugin.intelhelper.MAX_TIME = 60*60*1000;
window.plugin.intelhelper.events_ids = {};

window.plugin.intelhelper.refresh_time = 3*60*1000;
// Discard old data all the: 3 mins
window.plugin.intelhelper.time_out = true;

window.plugin.intelhelper.text_colors = {
	'RESISTANCE': "#0088FF",
	'ENLIGHTENED': "#03DC03"
};

window.plugin.intelhelper.link_colors = {
	'res_link_created': '#2e6797',
	'enl_link_created': '#219121',
	'res_link_destroyed': '#000000',
	'enl_link_destroyed': '#919191',
	'res_using_virus': '#eaa679',
	'enl_using_virus': '#f00000'
};

window.plugin.intelhelper.preview_options = {
	color: "#C33",
	opacity: 1,
	weight: 5,
	fill: false,
	dashArray: "1,6",
	radius: 18,
};

window.plugin.intelhelper.Portal = function (id, name, lat, lng) {
	this.id = id;
	this.name = name;
	this.lat = lat;
	this.lng = lng;
	this.events_by_id = {};
	this.events = [];
	this.marker = null;
	this.popup = 
	'<div class="plugin_intelhelper_popup">' +
		'<a style="font-weight:bold;">' + this.name + '</a>' +
		'<table>';
	
	this.add_event = function (id, player, team, time, category, id_to) {
		if (this.events_by_id[id] || time < window.plugin.intelhelper.get_limit()) {
			return;
		}
		var event = {
			id: id, 
			player: player,
			team: team,
			time: time,
			category: category,
			id_to: id_to
		};
		this.events_by_id[id] = event;
		for(var i = 0; i < this.events.length; i++) {
			if(this.events[i].time > time) break;
		}
		this.events.splice(i, 0,  event);
		this.process_event(id);
		this.refresh_popup();
	};
	
	this.discard_old_events = function () {
		var limit = window.plugin.intelhelper.get_limit();		
		for (var i = 0; i < this.events.length; i++) {
			if (this.events[i].time < limit) {
				var id = this.events[i].id;
				this.events.splice(i, 1);
				delete this.events_by_id[id];
				i--;
			}
		}
		this.process_all_events();
	};
	
	this.refresh_popup = function() {
		if (this.events.length === 0) {
			return;
		}
		
		this.popup = 
		'<div class="plugin_intelhelper_popup">' +
			'<a style="font-weight:bold;" onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">' + this.name + '</a>' +
			'<table>';
		var players = {};
		var res = false;
		var enl = false;
		for (var i = 0; i < this.events.length; i++) {
			var event = this.events[i];
			if (event.team == 'RESISTANCE') {
				res = true;
			} else {
				enl = true;
			}
			players[event.player] = 1;
			this.popup += this.retrieve_html(event.id);
		}	
		var different_players = 0;
		for (var j in players) {
			different_players++;
		}
		
		if (!this.marker) {
			this.marker = L.marker(L.latLng(this.lat, this.lng), {icon: this.get_marker(res, enl), id: this.id, title: ''});
			this.marker.addEventListener('spiderfiedclick', window.plugin.intelhelper.marker_on_click);
		}
		this.marker.setIcon(this.get_marker(res, enl));
		
		if (!this.marker._map) {
			this.marker.addTo(window.plugin.intelhelper.actions);
			window.registerMarkerForOMS(this.marker);
		}
		if (this.marker._icon) {
			this.marker._icon.title = different_players + ' agent(s) involved (last action: ' + j +')';
		}
	};
	
	this.get_marker = function(res, enl) {
		if (res && enl) {
			return window.plugin.intelhelper.icon_enl_res;	
		} else if (res) {
			return window.plugin.intelhelper.icon_res;
		} else {
			return window.plugin.intelhelper.icon_enl;	
		}
	};
	
	this.process_all_events = function () {
		for (var i = 0; i < this.events.length; i++) {
			this.process_event(this.events[i].id);
		}
		this.refresh_popup();
	};
	
	this.retrieve_html = function (id) {
		var html = '';
		var event = this.events_by_id[id];
		if (!event) {
			return html;
		}
	
		var portal_to;
		if (event.id_to) {
			portal_to =  window.plugin.intelhelper.portals.get_portal(event.id_to);
		}
		
		switch (event.category) {
			case 'linked':
				html = 'created link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
			break;
			case 'destroyed_link':
				html = 'destroyed link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
			break;
			case 'destroyed_link_ada':
				html = 'destroyed link (<span class=\"plugin_intelhelper_ada\">ADA</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
			break;
			case 'destroyed_link_jarvis':
				html = 'destroyed link (<span class=\"plugin_intelhelper_jarvis\">JARVIS</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
			break;
			case 'captured':
				html = 'captured the portal';
			break;
			case 'created_field':
				html = 'created a field';
			break;
			case 'destroyed_field':
				html = 'destroyed a field';
			break;
			case 'destroyed_resonator':
				html = 'destroyed resonator(s)';
			break;
			case 'destroyed_resonator_ada':
				html = 'destroyed a resonator (<span class=\"plugin_intelhelper_ada\">ADA</span>)';
			break;
			case 'destroyed_resonator_jarvis':
				html = 'destroyed a resonator (<span class=\"plugin_intelhelper_jarvis\">JARVIS</span>)';
			break;
			case 'destroyed_resonator_jarvis':
				html = 'destroyed a resonator (<span class=\"plugin_intelhelper_jarvis\">JARVIS</span>)';
			break;
			case 'deployed_fracker':
				html = 'deployed a fracker (<span class=\"plugin_intelhelper_fracker\">FRACKER</span>)';
			break;
		}
		html = 
		'<tr>' +
			'<td>' +
				'<time title="'+window.unixTimeToDateTimeString(event.time, true)+'" data-timestamp="'+event.time+'">'+unixTimeToHHmm(event.time)+'</time>' +
			'</td>' +
			'<td>' +
				'<mark class="nickname" style="cursor:pointer; color:'+window.plugin.intelhelper.text_colors[event.team]+'">'+event.player+'</mark>' +
			'</td>' +
			'<td>' +
				html +
			'</td>' +
		'</tr>';
		return html;
	};
	
	this.process_event = function (id) {
		var event = this.events_by_id[id];
		if (!event) {
			return;
		}
	
		var portal_to;
		if (event.id_to) {
			portal_to =  window.plugin.intelhelper.portals.get_portal(event.id_to);
		}
		
		var options = {};
		var layer;
		var html;
		var color;
		switch (event.category) {
			case 'linked':
				html = 'created link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
				if (event.team == 'RESISTANCE') {
					options.color = window.plugin.intelhelper.link_colors.res_link_created;
					layer = window.plugin.intelhelper.created_res;
				} else {
					options.color = window.plugin.intelhelper.link_colors.enl_link_created;
					layer = window.plugin.intelhelper.created_enl;
				}
			break;
			case 'destroyed_link':
				html = 'destroyed link from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
				if (event.team == 'ENLIGHTENED') {
					options.color = window.plugin.intelhelper.link_colors.res_link_destroyed;
					layer = window.plugin.intelhelper.destroyed_enl;
				} else {
					options.color = window.plugin.intelhelper.link_colors.enl_link_destroyed;
					layer = window.plugin.intelhelper.destroyed_res;	
				}
				options.dashArray = [5,10];
			break;
			case 'destroyed_link_ada':
				html = 'destroyed link (<span class=\"plugin_intelhelper_ada\">ADA</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
				if (event.team == 'ENLIGHTENED') {
					options.color = window.plugin.intelhelper.link_colors.enl_using_virus;
					layer = window.plugin.intelhelper.destroyed_enl;
				} else {
					options.color = color = window.plugin.intelhelper.link_colors.res_using_virus;
					layer = window.plugin.intelhelper.destroyed_res;	
				}
				options.dashArray = [5,10];
			break;
			case 'destroyed_link_jarvis':
				html = 'destroyed link (<span class=\"plugin_intelhelper_jarvis\">JARVIS</span>) from <a onclick="window.selectPortalByLatLng('+this.lat+', '+this.lng+')">'+this.name+'</a> to <a onclick="window.selectPortalByLatLng('+portal_to.lat+', '+portal_to.lng+')">'+portal_to.name+'</a>';
				if (event.team == 'ENLIGHTENED') {
					options.color = window.plugin.intelhelper.link_colors.enl_using_virus;
					layer = window.plugin.intelhelper.destroyed_enl;
				} else {
					options.color = window.plugin.intelhelper.link_colors.res_using_virus;
					layer = window.plugin.intelhelper.destroyed_res;	
				}
				options.dashArray = [5,10];
			break;
			default: 
				return;
		}
		html = 
		'<tr>' +
			'<td>' +
				'<time title="'+window.unixTimeToDateTimeString(event.time, true)+'" data-timestamp="'+event.time+'">'+unixTimeToHHmm(event.time)+'</time>' +
			'</td>' +
			'<td>' +
				'<mark class="nickname" style="cursor:pointer; color:'+window.plugin.intelhelper.text_colors[event.team]+'">'+event.player+'</mark>' +
			'</td>' +
			'<td>' +
				html +
			'</td>' +
		'</tr>';
		if (options.color) {
			var link_popup = $('<div class="plugin_intelhelper_popup">').append('<table>' + html + '</table>');

			options.opacity = 0.7;
			options.weight = 8;
			options.info = link_popup[0];
			
			var latlng1 = L.latLng(this.lat, this.lng);
			var latlng2 = L.latLng(portal_to.lat, portal_to.lng);
			var poly = L.geodesicPolyline([latlng1, latlng2], options);
			poly.addTo(layer);
			poly.addEventListener('click', window.plugin.intelhelper.link_on_click);
		}
	};
};

window.plugin.intelhelper.Portals = function () {
	this.portals_by_id = {};
	
	this.add_portal = function (name, lat, lng) {
		var id = lat + '_' + lng;
		if (this.get_portal(id)) {
			return this.get_portal(id);
		}
		var portal = new window.plugin.intelhelper.Portal(id, name, lat, lng);
		this.portals_by_id[id] = portal;
		return portal;
	};
	
	this.add_event = function (id_event, player, team, time, category, name1, lat1, lng1, name2, lat2, lng2) {
		if (window.plugin.intelhelper.process_event(id_event, time)) {
			var portal = this.add_portal(name1, lat1, lng1);
			var portal_to_id = null;
			if (name2 && lat2 && lng2) {
				portal_to_id = this.add_portal(name2, lat2, lng2).id;
			}
			portal.add_event(id_event, player, team, time, category, portal_to_id);
		}
	};
	
	this.get_portal_by_latlng = function (lat, lng) {
		var id = lat + '_' + lng;
		return this.get_portal(id);
	};
	
	this.get_portal = function (id) {
		return this.portals_by_id[id];
	};
	
	this.discard_old_events = function () {
		window.plugin.intelhelper.clear_layer();	

		for(var id in this.portals_by_id) {
			this.get_portal(id).discard_old_events();
		}
	};
};

window.plugin.intelhelper.get_limit = function() {
	return new Date().getTime() - window.plugin.intelhelper.MAX_TIME;
};  

window.plugin.intelhelper.process_event = function(id, time) {
	if (window.plugin.intelhelper.events_ids[id] || time < window.plugin.intelhelper.get_limit()) {
		return false;
	}
	return true;
};

window.plugin.intelhelper.process_new_data = function(data) {
	// Jarvis detection: 
	// + SMURF link Jarvis by SMURF
	// + SMURF link Jarvis by FROG
	// + SMURF portal Jarvis by FROG
	// - SMURF portal Jarvis by SMURF
	// ADA detection:
	// + FROG link ADA by SMURF
	// + FROG link ADA by FROG
	// + FROG portal ADA by SMURF
	// - FROG portal ADA by FROG
	
	if (window.plugin.intelhelper.time_out) {
		window.plugin.intelhelper.time_out = false;
		window.plugin.intelhelper.portals.discard_old_events();
		window.setTimeout(function() {
			window.plugin.intelhelper.time_out = true;
		}, window.plugin.intelhelper.refresh_time);
	}
	
	// console.log(data);
	var processed = data.processed;
	$.each(data.raw.result, function(ind, json) {
		var current_data = json[2].plext;
		
		var id_event = json[0];
		var time = json[1];
		
		if (current_data.plextType != 'SYSTEM_BROADCAST') {
			// Not an event (a player is speaking in /all)
			return;
		}
	
		var player = current_data.markup[0][1];
		var category = current_data.markup[1][1].plain;
		var portal = current_data.markup[2][1];
		var portal_name = portal.name;
		var portal_lat = portal.latE6/1E6;
		var portal_lng = portal.lngE6/1E6;
		var text = processed[id_event][2];
		var category_refined;
		var portal_to = null;
		var portal_to_name = null;
		var portal_to_lat = null; 
		var portal_to_lng = null;
		var replace;
		
		// PLAYER: [plain/team]
		// PORTAL: [address/latE6/lngE6/name/plain/team]

		switch(category) {
			case ' linked ':
				// PLAYER + ' linked ' + PORTAL - ' to ' + PORTAL
				category_refined ='linked';
				portal_to = current_data.markup[4][1];
				portal_to_name = portal_to.name;
				portal_to_lat = portal_to.latE6/1E6;
				portal_to_lng = portal_to.lngE6/1E6;
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'" lat2="'+portal_to_lat+'" lng2="'+portal_to_lng+'">linked</a> ';
				text = text.replace(/( linked )/, replace);
			break;
			case ' destroyed the Link ':
				// PLAYER + ' destroyed the Link ' + PORTAL - ' to ' + PORTAL
				category_refined ='destroyed_link';
				portal_to = current_data.markup[4][1];
				portal_to_name = portal_to.name;
				portal_to_lat = portal_to.latE6/1E6;
				portal_to_lng = portal_to.lngE6/1E6;
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'" lat2="'+portal_to_lat+'" lng2="'+portal_to_lng+'">destroyed the Link</a> ';
				if (current_data.team == player.team) {
					if (player.team == 'RESISTANCE') {
						// Jarvis from smurf
						replace += "(<span class=\"plugin_intelhelper_jarvis\">JARVIS</span>) ";
						category_refined ='destroyed_link_jarvis';
					} else {
						// ADA from frog
						replace += "(<span class=\"plugin_intelhelper_ada\">ADA</span>) ";
						category_refined ='destroyed_link_ada';
					}
				} else if (player.team == portal.team || player.team == portal_to.team) {
					if (player.team == 'ENLIGHTENED') {
						// Jarvis from frog
						replace += "(<span class=\"plugin_intelhelper_jarvis\">JARVIS</span>) ";			
						category_refined ='destroyed_link_jarvis';
					} else {
						// ADA from smurf
						replace += "(<span class=\"plugin_intelhelper_ada\">ADA</span>) ";
						category_refined ='destroyed_link_ada';
					}
				} 
				text = text.replace(/( destroyed the Link )/, replace);
			break;			
			case ' deployed a Resonator on ':
				// PLAYER + '  deployed a Resonator on ' + PORTAL
				category_refined ='deployed_resonator';
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">deployed a Resonator on</a> ';
				text = text.replace(/( deployed a Resonator on )/, replace);
			break;
			case ' destroyed a Resonator on ':
				// PLAYER + '  destroyed a Resonator on ' + PORTAL
				category_refined ='destroyed_resonator';
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">destroyed a Resonator on</a> ';
				// Sadly, we only can know when a frog uses a Jarvis on a blue portal and when a smurf uses an ADA on a green portal.
				if (player.team == portal.team) {
					if (player.team == 'ENLIGHTENED') {
						// Jarvis from frog only
						replace += "(<span class=\"plugin_intelhelper_jarvis\">JARVIS</span>) ";
						category_refined ='destroyed_resonator_jarvis';
					} else {
						// ADA from smurf only
						replace += "(<span class=\"plugin_intelhelper_ada\">ADA</span>) ";
						category_refined ='destroyed_resonator_ada';
					}
				}
				text = text.replace(/( destroyed a Resonator on )/, replace);
			break;
			case ' captured ':
				// PLAYER + '  captured ' + PORTAL
				category_refined ='captured';
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">captured</a> ';
				text = text.replace(/( captured )/, replace);
			break;
			case ' created a Control Field @':
				// PLAYER + ' created a Control Field @' + PORTAL - ' +' + VALUE + ' MUs'
				category_refined ='created_field';
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">created a Control Field @</a> ';
				text = text.replace(/( created a Control Field @)/, replace);
			break;
			case ' destroyed a Control Field @':
				// PLAYER + ' destroyed a Control Field @' + PORTAL - ' -' + VALUE + ' MUs'
				category_refined ='destroyed_field';
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">destroyed a Control Field @</a> ';
				text = text.replace(/( destroyed a Control Field @)/, replace);
			break;
			case ' deployed a Portal Fracker on ':
			// PLAYER + ' deployed a Portal Fracker on ' + PORTAL 
				category_refined='deployed_fracker';
				replace = ' <a class="intelhelper_hover help" cat="'+category_refined+'" lat1="'+portal_lat+'" lng1="'+portal_lng+'">deployed a Portal Fracker</a> (<span class=\"plugin_intelhelper_fracker\">FRACKER</span>) on ';
				text = text.replace(/( deployed a Portal Fracker on )/, replace);
        break;
		}
		window.plugin.intelhelper.portals.add_event(id_event, player.plain, player.team, time, category_refined, portal_name, portal_lat, portal_lng, portal_to_name, portal_to_lat, portal_to_lng);
		chat._public.data[id_event][2] = text;
		window.plugin.intelhelper.events_ids[id_event] = 1;
	});
};

window.plugin.intelhelper.on_mouse_over = function() {
	window.plugin.intelhelper.remvove_preview();
	
	var element = $(this);
	var category = element.attr('cat');
	if (!category) return;

	var lat1 = element.attr('lat1');
	var lng1 = element.attr('lng1');
	if (!lat1 || !lng1) return;
	var latlng1 = L.latLng(lat1, lng1);

	
	switch (category) {
		case 'linked':
		case 'destroyed_link':
			var lat2 = element.attr('lat2');
			var lng2 = element.attr('lng2');
			if (!lat2 || !lng2) return;
			var latlng2 = L.latLng(lat2, lng2);
			
			window.plugin.intelhelper.preview = L.layerGroup().addTo(map);
			L.circleMarker(latlng1, window.plugin.intelhelper.preview_options)
				.addTo(window.plugin.intelhelper.preview);
			L.geodesicPolyline([latlng1, latlng2], window.plugin.intelhelper.preview_options)
				.addTo(window.plugin.intelhelper.preview);
		break;
		case 'captured':
		case 'created_field':
		case 'destroyed_field':
		case 'destroyed_resonator':
		case 'deployed_resonator':
			window.plugin.intelhelper.preview = L.layerGroup().addTo(map);
			L.circleMarker(latlng1, window.plugin.intelhelper.preview_options)
				.addTo(window.plugin.intelhelper.preview);
		break;
	}
};

window.plugin.intelhelper.on_mouse_out = function() {
	window.plugin.intelhelper.remvove_preview();
};

window.plugin.intelhelper.on_click = function() {
	var element = $(this);
	var lat1 = element.attr('lat1');
	var lng1 = element.attr('lng1');
	if (!lat1 || !lng1) return;
	var latlng1 = L.latLng(lat1, lng1);

	window.map.setView(latlng1, this._zoom);
};

window.plugin.intelhelper.link_on_click = function(event) {
	var link = event.target;

	if (link.options.info) {
		plugin.intelhelper.link_popup.setContent(link.options.info);
		plugin.intelhelper.link_popup.setLatLng(event.latlng);
		map.openPopup(window.plugin.intelhelper.link_popup);
	}
};

window.plugin.intelhelper.marker_on_click = function(event) {
	var marker = event.target;

	if (marker.options.id) {
		plugin.intelhelper.portal_popup.setContent(window.plugin.intelhelper.portals.get_portal(marker.options.id).popup);
		plugin.intelhelper.portal_popup.setLatLng(marker.getLatLng());
		map.openPopup(window.plugin.intelhelper.portal_popup);
	}
};

window.plugin.intelhelper.remvove_preview = function() {
	if (window.plugin.intelhelper.preview) {
		map.removeLayer(window.plugin.intelhelper.preview);
	}
	window.plugin.intelhelper.preview = null;
};

window.plugin.intelhelper.open_preferences = function() {
	var html = 
	'<div>' +
		'<table>';
	for (var label in window.plugin.intelhelper.link_colors) {
		var title;
		switch (label) {
			case 'res_link_created':
				title = 'Created RES';
			break;
			case 'enl_link_created': 
				title = 'Created ENL';
			break;
			case 'res_link_destroyed': 
				title = 'Destroyed RES';
			break;
			case 'enl_link_destroyed': 
				title = 'Destroyed ENL';
			break;
			case 'res_using_virus': 
				title = 'ADA/Jarvis by RES';
			break;
			case 'enl_using_virus': 
				title = 'ADA/Jarvis by ENL';
			break;
		}
		html +=
			'<tr>' +
				'<td>' +
					title +
				'</td>' +
				'<td>' +
					'<input id="'+label+'_input" size="10" maxlength="7" onkeydown="window.plugin.intelhelper.update_colors()" onkeydown="window.plugin.intelhelper.update_colors()" onkeyup="window.plugin.intelhelper.update_colors()" type="text" value="'+ window.plugin.intelhelper.link_colors[label] +'"/>' +
				'</td>' +
				'<td>' +
					'<canvas class="plugin_intelhelper_canvas" width="100" height="30" id="'+label+'"></canvas>' +
				'</td>' +
			'</tr>' ;
	}
	html +=
		'</table>' +
	'</div>' +
	'<div style="text-align:center">' +
		'<button type="button" onclick="window.plugin.intelhelper.reset_colors()">Reset</button> ' +
		'<button type="button" onclick="window.plugin.intelhelper.save_colors()">Save</button>' +
	'</div>';
	dialog({
		html: html,
		id: 'plugin_intelhelper',
		title: 'Intel Helper',
		width: 'auto'
	});
	window.plugin.intelhelper.update_colors();
};

window.plugin.intelhelper.reset_colors = function() {
	window.plugin.intelhelper.link_colors = {
		'res_link_created': '#2e6797',
		'enl_link_created': '#219121',
		'res_link_destroyed': '#000000',
		'enl_link_destroyed': '#919191',
		'res_using_virus': '#eaa679',
		'enl_using_virus': '#f00000'
	};
	delete localStorage['window.plugin.intelhelper.link_colors'];
	window.plugin.intelhelper.open_preferences();
	window.plugin.intelhelper.portals.discard_old_events();
};

window.plugin.intelhelper.save_colors = function() {
	for (var label in window.plugin.intelhelper.link_colors) {
		window.plugin.intelhelper.link_colors[label] = $('#'+label+'_input').val();
	}
	localStorage['window.plugin.intelhelper.link_colors'] = JSON.stringify(window.plugin.intelhelper.link_colors);
	window.plugin.intelhelper.portals.discard_old_events();
};

window.plugin.intelhelper.update_colors = function() {
	for (var label in window.plugin.intelhelper.link_colors) {
		var canvas = document.getElementById(label);
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.lineWidth = 7;
		context.strokeStyle = $('#'+label+'_input').val();
		switch (label) {
			case 'res_link_created':
			case 'enl_link_created': 
			break;
			case 'res_link_destroyed': 
			case 'enl_link_destroyed': 
			case 'res_using_virus': 
			case 'enl_using_virus': 
				context.setLineDash([10, 5]);
			break;
		}
		// context.globalAlpha=1;
		context.beginPath();
		context.moveTo(0,15);
		context.lineTo(100, 15);
		context.stroke();			
	}
};

window.plugin.intelhelper.clear_layer = function () {
	window.plugin.intelhelper.actions.clearLayers();	
	window.plugin.intelhelper.created_res.clearLayers();	
	window.plugin.intelhelper.destroyed_res.clearLayers();	
	window.plugin.intelhelper.created_enl.clearLayers();	
	window.plugin.intelhelper.destroyed_enl.clearLayers();	
};

window.plugin.intelhelper.clear_history = function () {
	window.plugin.intelhelper.events_ids = {};
	window.plugin.intelhelper.portals = new window.plugin.intelhelper.Portals();
	window.plugin.intelhelper.clear_layer();
	window.plugin.intelhelper.time_out = true;
	window.plugin.intelhelper.reset_chat();
};

window.plugin.intelhelper.reset_chat = function() {
	chat._faction.data = {};
	chat._faction.oldestTimestamp = -1;
	chat._faction.newestTimestamp = -1;

	chat._public.data = {};
	chat._public.oldestTimestamp = -1;
	chat._public.newestTimestamp = -1;

	chat._alerts.data = {};
	chat._alerts.oldestTimestamp = -1;
	chat._alerts.newestTimestamp = -1;

	window.chat.request();
};

window.plugin.intelhelper.max_time_changed = function() {
	window.plugin.intelhelper.MAX_TIME = $('#intel_helper_max_time').val()*60*1000;
	window.plugin.intelhelper.clear_history();
};

var setup = function() {
	
	if (localStorage["window.plugin.intelhelper.link_colors"]) {
		window.plugin.intelhelper.link_colors = JSON.parse(localStorage["window.plugin.intelhelper.link_colors"]);
	} 
	
	var icon_enl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAABmJLR0QAAwDcAAOjeVxBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wURFRwuL7WK2QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABXklEQVQ4y7WVz0rDQBDGv0nyHIUFX0DBqwaFEO0t2GvowXufJfQFJNdKbkIJVtYeevHuqRDIO/RY10tm3TSbTQQdWMifyS/fZL6dAADCMoQZzbmyrrRo5fI5hWUIGUkNk5FUACAyAVtUi4oBBADIE7TgrEJkQolMKH/vWxfft6rz976G9AFsQBNGDUuJTKCe1vhNTF4mXCoFQ4lmDL3IWpKWbixXnueSfL2+oaZ8ovkzVYuqo5LDWdp7/IbLVYLP7T0OywdnWR7+KJygq/UtPmYFDstHePOVE2QtrZ7WEBDYxhvF176eZnBZJAjLkGQklUA7iWGu9msfpQUFMpK9ckcbNE+0s7W7xwDYAuxqWEaIGtpzJ0ZtjZIWzLWBrbu+Oe507Xh2hNmAzixKC0Ke2Nt/MtjGfWBW1UDJlmNOS26AVmM8/C9bpFcNANztzn9+AsmmW9bYiHcXBujVmfsN4vT0uC/vb4wAAAAASUVORK5CYII=';
	var icon_enl_res = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wURFRkTCqoyjQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABp0lEQVQ4y62VPUvDUBSGn5t09S8UAp0LCq4aFELVLehaHITaqZu/wVUctJu4Kt0EKSpXBxe3Dk6FC/0PjvU6NOc2iTexgwdCPjg8ed+cjwAQj2Pykd1b79EdFXLlXsXjGJ1oB9OJtgDRReRy1z7P3PVk2BeAAuA2he6Ihk60S9KJtgKYHcwAaD40F4DoFIB2T4CpzcMaAOE0RLcWEAFURR7oYAKat+YrQcpABwMV1CWLLYC2ua4FK8CrpvnQxAxM4Vm7d+Ws5V8wGfYJqpSYgWH7cUdlL1Pq+F5Nhv1KZY06ua+dFzbvUj7f9vm6PKy1FvBPUQvaetzl42jE1+UJwfFdLchrbXYwIyLirfNs5dn3zZH3YztQPI6VTrSNKFZOYPkRqaoY3ZEK8iPiU1buaG9IZwPKDIwVBX91uLRANsBKrJGpUmZgFpNP9bg4O8uGdquksI/CaUjW7Tachja6iGy7d2U5t4tzeSdl17+qNm/NyRfA92G5Tf3lLy221TpQVHmghVUr69ZZE0vlVfvfI+JVI7H3vr78CaTPv22tGp33jRzoqTb3B2/D1Of1M8J/AAAAAElFTkSuQmCC';
	var icon_res = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAYAAAAGAx/kAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wURFRwCHW3mOgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABa0lEQVQ4y7WVv0vDQBTHvy/pP1LoHFBw1aAQomOwa+ggpPlP3DvEbuJayVyCytmhi1sGp4J/Rcd4DubFO3N3RtAHB7nw8rnvvV8BAIRVCNXavTSutNR8eU9hFUJEooOJSEgACLICJquXOQMIAHCXAGmJkYhE5yQiIRlQj+dGUJAxMJEqjADA3/loJo0MssIK6AHfbj7VpSV1IAC/gvRgAI1+ctTi4ziIbGqU05T42P08l+ST9Sm1hxHN7qle5j2VbM6rPcdPOFoleN1cYL+4dMbLwx+ZE3S8PsPLtMR+cQVvtnKCjFerx3MEGbCJc8nv3m+ncJUIt4g1c670q0WptYhJ2SBTKrur7iEAVspVrXU/w2yFZylUUkeJNo/8nc/qJK6ltoKs6M+k9rmXtWbSIKxCElEueWRos6jtdmP6vw22YQFmVS2UTD7qtOwSwGqUj/+lRaxqAOB8e/D1E0ge+9caavH2UAE9OH0/APDmw5Sw3mGaAAAAAElFTkSuQmCC';
	
	window.plugin.intelhelper.icon_enl_res = new (L.Icon.Default.extend({options: {
		iconUrl: icon_enl_res,
		iconRetinaUrl: icon_enl_res,
		iconSize: [18,23],
		iconAnchor: [9,22]
	}}))();

	window.plugin.intelhelper.icon_res = new (L.Icon.Default.extend({options: {
		iconUrl: icon_res,
		iconRetinaUrl: icon_res,
		iconSize: [18,23],
		iconAnchor: [9,22]
	}}))();
	
	window.plugin.intelhelper.icon_enl = new (L.Icon.Default.extend({options: {
		iconUrl: icon_enl,
		iconRetinaUrl: icon_enl,
		iconSize: [18,23],
		iconAnchor: [9,22]
	}}))();
	
	$("<style>").prop("type", "text/css")
		.html(''+
		'.plugin_intelhelper_ada {'+
			'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArxJREFUeNrEk0tsTGEUx//ffcy9c+/tdB53XqZv7ZSmHiGtd4JIQ7ohESK2W'+
			'BELWwsWIkIirIQFEYQFGyFBvIogqkFDVZV4pO1U606n09478839PrdISNhZOMvznfP7zjn/cwjnHP9iAv7RJH+o6g/nVFXBYKBdFcWaYpF2uYz2C4I0zFgJnHA4kxSMugABREkJ/JZKwJkLVTNSeiR5mpSZG72MhSIhLcSldXCpBsbsEnXz3zv3AET9rQJacuFTlERq2vQ'+
			'HNgTB2bILejRWZXU9G+S5bFicsPzEGoDQ92JfYeDDbkgyJIX8QDEPySU5HDdTN4XWhXVlK9dayfoKva4lyoamKyNvLt0+Z30euVqyxjWledkOmdpLefbLfVExouDezwLnRryqoSO3YlOzvGo9FNHwM8rFHFWE1NxEIrisZcnXR8+zrOPKGefVizNiTXqzbI92C1wUIUhMK'+
			'6+f3ZFpXRNgCeO83fkSsQUmuF/B8K13GO75Ci8M5eFIUIaVFQVamHzfe9xiMhfUkNkUrEzvdULm0fLOy7UNTXIm2taK3iP3MH7tKcbf9mOw28Fgh4WyCpLJFXyAWV2lLm0/GI3Gk5Lm16fNbEgHYpHg/Pj8pnWlz6XVevYx5OS41wbHQ60afem4J90YRnqyMd/6nRfUYHA'+
			'G7by1RyfIkEisGv5AZIFQ2XgYRvlYmTVwJ1TfuCFcmZpHhkah2g7epZrRZ0RANR3czsF37nCbPfTxhmmGQMxEHWTvwdMQxAhtdVINm2xVu1kxK9EfWrx8e0ZvXOJwHcXeXorrZy+SJ9cPjWVHnzJFQ8oM/wToBjwdQRiDtyymN9IDE9HaRZPb9ifV/AhVr5w8Jj2/e8Klh'+
			'U+eMMgXHTBR/guAT62xC+4FlCSlTaydk3Zed52SCM8Lsg8eHqUiRb5g/wL892v8JsAAA+sqvDde8pwAAAAASUVORK5CYII=");'+
			'background-position: 0 0;'+
			'background-repeat: no-repeat;'+
			'height: 16px;'+
			'padding-left: 16px;'+
			'font-weight: bold;'+
			'color: red;'+
		'}'+
		'.plugin_intelhelper_jarvis {'+
			'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAvRJREFUeNqkk99vFFUUx7/33rl7584MO7t2u7jQbsGllQhpsyZSFaKRxBAjU'+
			'ZDIEwkPGsOLj/LiP9Dw5ouJPvlIohh5wPCgMZjUmiA0Qa2Sqiy026XtbvfHMNPdmTtznaqgPvck5+Ek93vO99x8DtFaYzthPFk9jK0mrbYPQ/fB1SYgXGguQbQCY0QEm6rc7weLlMSQ0oLnecA/g43/9yOpKAEotZiwJrkQhwzDPkplNBE3aydV2Lv996tU/9DBv2KNOC0'+
			'3qQkB4gqePc9J7mRobIDafRSMibnW6sKU1snSf9dmQ6VyOhXwg9S+kPssd+y8lR/9EIXBM+qlJnAmaQTL6+f0YpiRcuh1yrmrVNRLEtUilIFUDlShYiq4u+czYRWOx7m1flJtL1lnD4+7O6uw2RhaK4utjV/nv/Fmrn1lNqzTlNs7G/WFaRWHPjNT66HCLqc48m7w4k9O+'+
			'PLczeKrp0q88JxTkdOwiYM9uUMWqQw/tc5/GPGta98qEe0yk8LzQtEvGSd57CiXzrWHa1Fb/Tijr49cnnpj5oxwpUyiCDfvfAHf3sBeYwrNeoe0L954+8QLJw7un5g8bkE2DDzmTniqc78zu3IhzgO5I5VXaCGbH6CD+7XrMJKt/6VoYhXSsX8Ziw8Se6Nyanb264/v/bH'+
			'wiWHZlu64936mnQDTxWNYWxncIO1ue7z+ID88n4fv5IB1gZbzG4L5xm5Zrt66cvXz71aX77xPKQXLZJy2wcWxeH/01mhx7+5xOT5k3l7zKNvxRFPCDqWAShQyXR/1q99nb83OvdPrrn2Q2uoSmjIxWt4HohhUzrngVevvWc/6c9TUNV4qZuXTk0dh2EnYaPDkI8PoXaq9Z'+
			'ujelQxnj0BijnQQ6wi6r0MryHeYFoRvZkdIL348vrtkJcu/Z3FJs+6nvTd95V82OYVBH3KbZnG49BfXJGNDSBeDByHYFmmEH2AZeQRJnPMG3btB5F1MGUfW1DD5o1NIIdzmNVJsM/4UYABhczyLk4yHJgAAAABJRU5ErkJggg==");'+
			'background-position: 0 0;'+
			'background-repeat: no-repeat;'+
			'height: 16px;'+
			'padding-left: 16px;'+
			'font-weight: bold;'+
			'color: red;'+
		'}'+
		'.plugin_intelhelper_fracker {'+
			'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABRFBMVEX+///+/vv///3+/v769/Xz6uX88tXty8XyvbT4+4X053/3QlPkLDfLZTooLjoeNEsdP1kvPFUkR2o1RGQ1UnZjVWBNXX86apFKapVfc'+
			'pJ4kKn//v/9knL9hWX7dWLxa136gFn9qXfrdFLDT1WyP0mmNS+gPkGONEKNJy93LUh1Iy5eHzf8oGH7k2b5sGvrg234dW/RVFb7n2/9nH65Rz38sIvrdmLgbW/6g3b5jVb9uX3qnHLVak78w3D+yoXITkb92IS0TVOmVF2mWzzfYl76t3OgRFCLP1PovWzup2T7c1X8xpB'+
			'HDTb61HjnYFbzZk/8yXvbVEfiZ0zRnJPKcnm+XWHFXk3PZWDom1j1m5HZf1/944vzsqTSjIX+7Jr88oiIRjTvilzggkz8+6D71ZjZs2Tp2XH75cGqaXD40Lj7/JPOlFLHtb1VAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHd'+
			'ElNRQfgAg8QNBhMUzrFAAAAdUlEQVQY02NgQAY+IEIXwbdIBAvEQ3hACX0oS4eBwZWBwQqoAqrSnIFBjoFBMTYbplU3GGRaWpYM3LBkBl8GBlkthOm6YKsCkOzXtWZgMJRFEkiI9lRwRHGii4q2BYqAo7O6OIoAg4UoKp9BkB1NQEKCAQcAAHaAC9+tIFYpAAAAAElFTkS'+
			'uQmCC");'+
			'background-position: 0 0;'+
			'background-repeat: no-repeat;'+
			'height: 16px;'+
			'padding-left: 16px;'+
			'font-weight: bold;'+
			'color: red;'+
		'}'+
		'.intelhelper_hover {'+
			'color: #FFA700'+
		'}'+
		'.plugin_intelhelper_popup a {'+
			'color: #FFA700'+
		'}'+
		'.plugin_intelhelper_canvas {'+
			'background-color:white'+
		'}'
	).appendTo("head");

	$('#chatall')
		.on('mouseover', '.intelhelper_hover', window.plugin.intelhelper.on_mouse_over)
		.on('mouseout', '.intelhelper_hover', window.plugin.intelhelper.on_mouse_out)
		.on('click', '.intelhelper_hover', window.plugin.intelhelper.on_click);

	$('#toolbox').after('<div id="intelhelper-toolbox"></div>');	
	
	$('#intelhelper-toolbox').html(
		' <b style="color:#ffce00">Intel Helper </b>' +
		' <select id="intel_helper_max_time" onchange="window.plugin.intelhelper.max_time_changed()">' +
			'<option value=60 disabled>maximum time</option>' +
			'<option value=5>5 mins</option>' +
			'<option value=10>10 mins</option>' +
			'<option value=20>20 mins</option>' +
			'<option selected value=60>1 hour</option>' +
			'<option value=120>2 hours</option>' +
			'<option value=300>5 hours</option>' +
			'<option value=1440>1 day</option>' +
		'</select>' +
		' <br>' +
		' <a onclick="window.plugin.intelhelper.open_preferences();" title="Open <b>Intel Helper</b> preferences">Preferences</a> - ' +
		' <a onclick="window.plugin.intelhelper.clear_history();">Clear Everything</a> '
	);
	
    window.plugin.intelhelper.actions = new L.LayerGroup();
	window.plugin.intelhelper.created_res = new L.LayerGroup();	
	window.plugin.intelhelper.destroyed_res = new L.LayerGroup();
	window.plugin.intelhelper.created_enl = new L.LayerGroup();	
	window.plugin.intelhelper.destroyed_enl = new L.LayerGroup();	

    window.addLayerGroup('[IH] Actions', window.plugin.intelhelper.actions, true);
    window.addLayerGroup('[IH] create by Res', window.plugin.intelhelper.created_res, true);
    window.addLayerGroup('[IH] create by Enl', window.plugin.intelhelper.created_enl, true);
    window.addLayerGroup('[IH] destroy by Res', window.plugin.intelhelper.destroyed_res, true);
    window.addLayerGroup('[IH] destroy by Enl', window.plugin.intelhelper.destroyed_enl, true);
		
	window.plugin.intelhelper.portals = new window.plugin.intelhelper.Portals();

	// Popups
	window.plugin.intelhelper.link_popup = new L.Popup({offset: L.point([0,-4]), maxWidth: 600});
	window.plugin.intelhelper.portal_popup = new L.Popup({offset: L.point([0,-20]), maxWidth: 600, maxHeight: 300});
	
	window.addHook('publicChatDataAvailable', function(data) {
		window.plugin.intelhelper.process_new_data(data);
	});	
};
		
// PLUGIN END //

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);