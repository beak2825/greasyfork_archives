// ==UserScript==
// @name        Violent Coords
// @namespace   http://violentcoords.com
// @version     0.3
// @description Exchange Corrected Coordinates.
// @author      Violent Cacher
// @resource    coordCSS         https://barnyruilt.alwaysdata.net/style.css
// @resource    homepageHTML     https://barnyruilt.alwaysdata.net/template/homepage.html
// @resource    no_user_infoHTML https://barnyruilt.alwaysdata.net/template/no_user_info.html
// @resource    membershipHTML   https://barnyruilt.alwaysdata.net/template/membership.html
// @resource    user_infoHTML    https://barnyruilt.alwaysdata.net/template/user_info.html
// @resource    script_infoHTML  https://barnyruilt.alwaysdata.net/template/script_info.html
// @match       https://www.geocaching.com/account/settings/membership
// @match       https://www.geocaching.com/geocache/*
// @match       https://www.geocaching.com/map/*
// @match       *://*.barnygeeft.com/*
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @connect     barnyruilt.alwaysdata.net
// @downloadURL https://update.greasyfork.org/scripts/425414/Violent%20Coords.user.js
// @updateURL https://update.greasyfork.org/scripts/425414/Violent%20Coords.meta.js
// ==/UserScript==


// https://github.com/Tampermonkey/tampermonkey/issues/475
(function() {
	'use strict';

	const link_id = 'linkToCorrectedCoords';
	const state_id = 'elementForStateInformation';
	const url = 'https://barnyruilt.alwaysdata.net';
	const wait_time_increase = 200;

	var button_info = {
		error: {
			class: 'gc-pink-background',
			text: '☠',
		},
		found: {
			class: 'gc-green-background',
			text: '✓',
			title: 'Corrected Coordinate found, click to update',
		},
		loading: {
			class: 'gc-gray-background',
			text: '❄',
			//animate: ['◷', '◶', '◵', '◴'],
			//animate: ['▝', '▗', '▖', '▘' ],
			animate: ['⠈⠉', '⠀⠙', '⠀⠸', '⠀⢰', '⠀⣠', '⢀⣀', '⣀⡀', '⣄⠀', '⡆⠀', '⠇⠀', '⠋⠀', '⠉⠁'],
			timeout: 97,
			title: 'Loading',
		},
		location: {
			class: 'gc-blue-background',
			text: '⊕',
			title: 'Click to get Corrected Coordinate at this location',
		},
		min: {
			class: 'gc-yellow-background',
			text: '?',
			title: 'You\'ve requested this coordinate',
		},
		multipleoff: {
			class: 'gc-blue-background',
			text: '⬀ Bulk submit',
			title: 'Enable bulk submit',
		},
		multiplerunning: {
			class: 'gc-green-background',
			text: '⬈ Bulk submit',
			title: 'Bulk submit in progress',
		},
		notfound: {
			class: 'gc-red-background',
			text: '✗',
			title: 'No Corrected Coordinate Available',
		},
		plus: {
			class: 'gc-yellow-background',
			text: '✓',
			title: 'You\'ve contributed this coordinate',
		},
		unknown: {
			class: 'gc-blue-background',
			text: '?',
			title: 'Click to check for Corrected Coordinates',
		},
		wait: {
			class: 'gc-yellow-background',
			text: '◔',
			title: 'Not so fast cowboy',
		},
	};

	var time_period = [
		{ name: 'seconds', factor: 1000 },
		{ name: 'minutes', factor:   60 },
		{ name: 'hours',   factor:   60 },
		{ name: 'days',    factor:   24 },
		{ name: 'months',  factor:   31 },
		{ name: 'years',   factor:   12 },
	]

	var wait_time = 0;
	var button_timeout = null;
	var multiple_timer = null;

	// Geocaching functions
    function geocachePage() {
		//console.debug('geocachePage');
		if ('undefined' === typeof(userInfo)) {
			setTimeout(geocachePage, 50);
			return;
		}
		GM_setValue('userid', userInfo.ID);
		username = document.getElementsByClassName('username').value;
		//userid = userInfo.ID;
		GM_setValue('username', username);
		//GM_setValue('userid', userInfo.ID);
		createButton();
		waitForCorrected();
    }

	function waitForCorrected() {
		//console.debug('waitForCorrected');
		gccode = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').innerHTML;
		coords = document.querySelector('span.myLatLon');
		coords = coords ? coords.innerHTML : ''
		if (coords) {
			note = document.getElementById('viewCacheNote');
			note = note ? note.innerHTML : '';
			updateButton('loading');
			sendCoordinate();
		} else {
			setTimeout(waitForCorrected, 150);
		}
	}

	function postData(data) {
		return Object.keys(data).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
	}

	function updateButton(state, title = '') {
		if (button_timeout) { clearTimeout(button_timeout); button_timeout = null; }
		if (button_info[state].animate) {
			if (!button_info[state].frame) { button_info[state].frame = 0; }
			if (!button_info[state].timeout) { button_info[state].timeout = 314; }
			button_info[state].text = button_info[state].animate[button_info[state].frame];
			button_info[state].frame = (button_info[state].frame + 1) % button_info[state].animate.length;
			button_timeout = setTimeout(() => updateButton(state, title), button_info[state].timeout);
		}
		if (('' === title) && (button_info[state].title)) { title = button_info[state].title }
		var button = document.getElementById(link_id);
		var old_state = button.getAttribute('data-state');
		if (old_state != state) {
			if (old_state) {
				button.classList.remove(button_info[old_state].class);
				button.classList.remove(button_info[old_state].class + '-hover');
			}
			button.setAttribute('data-state', state);
			button.classList.add(button_info[state].class);
			button.classList.add(button_info[state].class + '-hover');
		}
		button.title = title;
		button.innerHTML = button_info[state].text;
	}

	function createButton() {
		var button = document.createElement('div');
		button.id = link_id;
		button.style = 'margin-right: 0.5em';
		button.classList.add('coords-box');
		button.setAttribute('data-state', 'wait');
		button.addEventListener('click', onClick);

		var link = document.getElementById('uxLatLonLink');
		link.parentNode.insertBefore(button, link)
		updateButton('unknown');
	}

	function createLocationButton() {
		var br = document.createElement('br');
		var button = document.createElement('div');
		button.id = link_id;
		button.style = 'margin-right: 0.5em';
		button.classList.add('coords-box');
		button.setAttribute('data-state', 'wait');
		button.addEventListener('click', onClick);
		var span = document.createElement('span');
		span.id = state_id;

		span.innerHTML = 'Click to get closest corrected coordinates';

		var node = document.getElementById('m_cacheTypes')
		insertAfter(button, node);
		insertAfter(span, button);

		updateButton('location')
	}

	function onClick() {
		var args = {}
		switch (document.getElementById(link_id).getAttribute('data-state')) {
			case 'found': getCoordinate(); break;
			case 'location': locationCoordinate(); break;
			case 'multipleoff': multipleStart(); break;
			case 'multiplerunning': multipleStop(); break;
			case 'unknown': checkCoordinate(); break;
		}
		return false
	}

	function checkCoordinate() {
		updateButton('loading');
		console.log('Checking: ' + gccode);
		GM_xmlhttpRequest({
			url: url,
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
			},
			data: postData({ 'gccode': gccode }),
			onload: (data) => {
				if (JSON.parse(data.responseText).hasCorrected) {
					updateButton('found');
				} else {
					updateButton('notfound');
				}
			},
			onerror: (data) => {
				updateButton('error', 'Something went wrong while checking coordinates');
				console.error(data)
			},
		});
	}

	function getCoordinate() {
		updateButton('loading');
		if (requestToken(getCoordinate)) { return; }
		GM_xmlhttpRequest({
			url: url,
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-forms-urlencoded',
				'Accept': 'application/json',
			},
			data: postData({
                'prid': userInfo.ID,
				'gccode': gccode,
				'token': GM_getValue('token_value'),
			}),
			onload: (resp) => {
				var data = JSON.parse(resp.responseText)
				if (data.error) {
					updateButton('error', data.error);
				} else if (data.wait) {
					waitCoordinate(Date.now() + 1000 * data.wait, 'found')
				} else if (data.latitude && data.longitude) {
					if((Math.abs(data.latitude) > 90) || (Math.abs(data.latitude) > 180)) {
						updateButton('error', 'Invalid coordinates');
					} else {
                        updateCoordinate(data)
                    }
				} else {
					updateButton('notfound', 'No coordinates returned');
					console.error(data);
				}
			},
			onerror: (data) => {
				updateButton('error', 'Something went wrong while retreiving coordinates');
				console.error(data)
			},
		});
	}

	function updateCoordinate(data) {
		$.getJSON({
			url: 'https://www.geocaching.com/seek/cache_details.aspx/SetUserCoordinate',
			type: "POST",
			dataType: "json",
			contentType : "application/json",
			data: JSON.stringify({
				dto: {
					data: {
						lat: data.latitude,
						lng: data.longitude,
					},
					ut: userToken,
				}
			}),
			success: () => location.reload(), // Because groundspeak is also to lazy to use the response to update the page
			error: (data) => {
				updateButton('error', 'Something went wrong while updating coordinate');
				console.error(data);
			},
		});
	}


	function locationCoordinate() {
		updateButton('loading');
		if (requestToken(locationCoordinate)) { return; }
		var center = MapSettings.Map.getCenter();
		GM_xmlhttpRequest({
			url: url,
			method: 'POST',
			headers: {
				'Content-type': 'application/x-www-forms-urlencoded',
				'Accept': 'application/json',
			},
			data: postData({
				// Because sometimes center contains functions and sometimes properties
				'lat': (center.lat instanceof Function) ? center.lat() : center.lat,
				'lng': (center.lng instanceof Function) ? center.lng() : center.lng,
				'token': GM_getValue('token_value'),
			}),
			onload: (resp) => {
				var data = JSON.parse(resp.responseText)
				if (data.error) {
					updateButton('error', data.error);
				} else if (data.wait) {
					waitCoordinate(Date.now() + 1000 * data.wait, 'location')
				} else if (data.latitude && data.longitude) {
					console.log(data)
					updateButton('location');
					document.getElementById(state_id).innerHTML = '<a href="https://coord.info/' +data.gccode + '">' + data.gccode + '</a>: ' + data.distance + ' km';
				} else {
					updateButton('error', 'No coordinates returned');
					console.error(data);
				}
			},
			onerror: (data) => {
				updateButton('error', 'Something went wrong while retreiving coordinates');
				console.error(data)
			},
		});
	}

	function multipleClear() {
		GM_deleteValue('multiple_skip');
		_setById('cc_skip', '?')
		_setById('cc_available', '?')
		return false;
	}

	function multipleCoordinate() {
		if (requestToken(multipleCoordinate)) { return; }
		updateButton('loading');
		GM_xmlhttpRequest({
			url: url,
			method: 'POST',
			headers: {
				//'Content-type': 'application/x-www-forms-urlencoded',
				'Accept': 'application/json',
			},
			data: postData({
				'multiple' : 'm',
				'skip' : GM_getValue('multiple_skip') || 0,
				'take' : 50,
				'token': GM_getValue('token_value'),
			}),
			onload: (resp) => {
				var data = JSON.parse(resp.responseText);
				console.log(data);
				GM_setValue('multiple_skip', (GM_getValue('multiple_skip')*1 || 0) + data['count']);
				_addById('cc_set', data['updates']);
				_addById('cc_fullCallsRemaining', -data['count']);
				_setById('cc_available', data['total']);
				_setById('cc_skip', GM_getValue('multiple_skip'));
				updateButton('multiplerunning');
				multiple_timer = setTimeout(multipleCoordinate, 17659);
			},
			error: (data) => {
				updateButton('error', 'Something went wrong while proccesing multiple');
				console.error(data)
			},
		});
	}

	function multipleStart() {
		GM_setValue('multiple', true);
		multipleCoordinate();
	}

	function multipleStop() {
		if (multiple_timer) {
			clearTimeout(multiple_timer);
			multiple_timer = null;
		}
		updateButton('multipleoff');
		GM_setValue('multiple', false);
	}

	function sendCoordinate() {
		//console.debug('sendCoordinate');
		if (requestToken(sendCoordinate)) { return; }
		GM_xmlhttpRequest({
			url: url,
			method: 'POST',
			headers: {
				//'Content-type': 'application/x-www-forms-urlencoded',
				'Accept': 'application/json',
			},
			data: postData({
				'gccode': gccode,
				'note': note,
                'prid': userInfo.ID,
				'token': GM_getValue('token_value'),
			}),
			onload: (data) => {
				var json = JSON.parse(data.responseText);
				console.log(json);
				updateButton((1 == json['direction']) ? 'plus' : 'min');
			},
			error: (data) => {
				updateButton('error', 'Something went wrong while sending coordinates');
				console.error(data)
			},
		});
	}

	function waitCoordinate(timestamp, next) {
		var delta = timestamp - Date.now();
		if (delta > 0) {
			var i = 1;
			delta /= time_period[0].factor;
			var wait = time_period[0].factor / 4;
			while ((delta > 99) && (i < time_period.length)) {
				delta /= time_period[i].factor;
				wait  *= time_period[i].factor;
				i++;
			}

			updateButton('wait', 'Please wait ' + Math.ceil(delta) + ' ' + time_period[i-1].name);
			setTimeout(() => waitCoordinate(timestamp, next), wait);
			return;
		}
		updateButton(next);
	}

	function requestToken(func = null) {
		//console.log("requestToken()");
		//console.log(Date.now() + ' now')
		//console.log(GM_getValue('token_expires') + ' expires');
		//console.log((GM_getValue('token_requested') || 0) + ' requested');

		if (
			((GM_getValue('token_expires') || 0) < (Date.now() + 5*60*1000)) &&
			(
				((GM_getValue('token_requested') || 0) < (Date.now() - 10*60*1000)) ||
				((GM_getValue('token_expires') || 0) >= (GM_getValue('token_requested') || 0))
			)
		) {
			getToken();
		}
		if (func) {
			if (GM_getValue('token_expires') < Date.now()) {
				console.log(GM_getValue('token_expires') + ' expires');
				console.log(GM_getValue('token_requested') + ' requested');
				wait_time += wait_time_increase;
				console.debug('Waiting for token: ' + wait_time)
				setTimeout(func, wait_time);
			} else {
				return false;
			}
		}
		return true;
	}

	function getToken() {
		console.log('getToken()');
		GM_setValue('token_requested', Date.now());
		GM_xmlhttpRequest({
			url: "https://www.geocaching.com/account/oauth/token",
			method: 'POST',
			headers: {
				//'Content-type': 'application/x-www-forms-urlencoded',
				'Accept': 'application/json',
			},
			onload: (resp) => {
				var result = JSON.parse(resp.responseText);
				GM_setValue('token_value', result.access_token);
				GM_setValue('token_expires', Date.now() + 1000 * (result.expires_in - 60)); // - 60 seconds as a safety
			}
		});
	}

	// Homepage functions

	function template(text, vars) {
		return text.replace(/\{\{(\w*)\}\}/g, (_, x) => vars[x]);
	}

	function insertAfter(node, target) {
		target
			.parentNode
			.insertBefore(node, target.nextSibling);
	}

	function infoClear() {
		GM_deleteValue('username');
		GM_deleteValue('userid');
		GM_deleteValue('token_value');
		GM_deleteValue('token_expires');
		GM_deleteValue('token_requested');
		location.reload();
	}

	function setClipboard(event) {
		GM_setClipboard(event.target.getAttribute('data-set-clipboard'));
	}

	function infoUser() {
		var expires = new Date(GM_getValue('token_expires'));

		return template(GM_getResourceText("user_infoHTML"), {
			'expires_iso'       : expires.toISOString(),
			'token_class'       : GM_getValue('token_expires') < Date.now() ? 'strike' : '',
			'token_value'       : GM_getValue('token_value'),
			'token_value_short' : GM_getValue('token_value').substr(0,8) + '...' + GM_getValue('token_value').substr(-16),
			'userid'            : userid,
			'username'          : username,
		})
	}

	function _resetTimeString(seconds) {
		if (!seconds) { return '-'; }
		var date = new Date(Date.now() + 1000 * seconds);
		return [
			('0'+date.getHours()).slice(-2),
			('0'+date.getMinutes()).slice(-2),
			('0'+date.getSeconds()).slice(-2)].join(':');
	}

	function _addById(id, value) {
		//console.log("addById("+id+", "+_getById(id)+" + "+value+")");
		_setById(id, _getById(id)*1 + value)
	}

	function _getById(id, value) {
		var elem = document.getElementById(id);
		if (!elem) { return elem; }
		return elem.innerHTML;
	}

	function _setById(id, value) {
		//console.log('setById('+id+', '+value+')');
		var elem = document.getElementById(id);
		if (elem) { elem.innerHTML = value; }
	}


	function addToMembershipPage(data) {
		if (GM_getValue('multiple_userid') != data['id']) {
			GM_setValue('multiple_skip', 0);
			GM_setValue('multiple_available', '?');
		}
		GM_setValue('multiple_userid', data['id'])
		data['link_id'] = link_id;
		data['premium_display'] = data['premium'] ? 'block' : 'none';
		data['liteCallsResetTime'] = _resetTimeString(data['liteCallsSecondsToLive']);
		data['fullCallsResetTime'] = _resetTimeString(data['fullCallsSecondsToLive']);
		data['skip'] = GM_getValue('multiple_skip')*1 || '?';
		data['available'] =	GM_getValue('multiple_available');
		data['available'] = '?'
		var div = document.createElement('div');
		div.innerHTML = template(GM_getResourceText("membershipHTML"), data)
		var node = document.getElementById('stateIndex');
		insertAfter(div, document.getElementById('stateIndex'));
		GM_getValue('multiple') ? multipleStart() : multipleStop();
		document.getElementById(link_id).addEventListener('click', onClick);
		document.getElementById('bulk_submit_reset').addEventListener('click', multipleClear);
	}

	function membershipPage() {
		if (requestToken(membershipPage)) { return };
		GM_xmlhttpRequest({
			url: url,
			method: 'POST',
			headers: {
				//'Content-type': 'application/x-www-forms-urlencoded',
				'Accept': 'application/json',
			},
			data: postData({
				'stats': 'x',
				'prid': GM_getValue('userid'),
				'token': GM_getValue('token_value'),
			}),
			onload: (resp) =>  {
				console.log(resp);
				addToMembershipPage(JSON.parse(resp.responseText));
			},
			onerror: (data) => {
				console.error('fout');
				console.error(data);
			},
		});
	}

	function infoNoUser() {
		return GM_getResourceText("user_infoHTML");
	}

	function homepage() {
		document.body.innerHTML = '<div class="content">'
			+ GM_getResourceText("homepageHTML")
			+ '<p>' + template(GM_getResourceText("script_infoHTML"), {
				'script_name'    : GM.info.script.name,
				'script_version' : GM.info.script.version,
			}) + '</p>'
			+ '<p>' + (GM_getValue('userid') ? infoUser() : infoNoUser()) + '</p>'
		+ '</div>';

		var clearLink = document.getElementById('info_clear');
		if (clearLink) {
			clearLink.addEventListener('click', infoClear, false);
		}
		document
			.querySelectorAll('[data-set-clipboard]')
			.forEach((elem) => {
				elem.addEventListener('click', setClipboard, false);
			})
		;
	}

	// Main functions
	var coords = '';
	var gccode = '';
	var note = '';
	var userid = '';
	var username = '';

	//GM_deleteValue('token_expires', null);
	//GM_deleteValue('token_requested', null);

	GM_addStyle(GM_getResourceText("coordCSS"));
	switch (window.location.hostname) {
		case 'www.geocaching.com' :
			requestToken();
			console.debug(window.location.pathname)
			if (window.location.pathname.match(/\/geocache/)) {
				geocachePage();
			}
			if (window.location.pathname.match(/\/map/)) {
				createLocationButton()
			}
			if (window.location.pathname.match(/\/account\/settings\/membership/)) {
				membershipPage();
			}
			break;
		case 'barnygeeft.com':
			userid = GM_getValue('userid');
			username = GM_getValue('username');
			homepage();
			break;
	}
})();
