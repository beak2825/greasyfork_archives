// ==UserScript==
// @name         AlienwareArena Twitch Helper
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  Closes tab after reaching maximum ARP
// @author       gortik
// @license      MIT
// @match        https://www.twitch.tv/OMGchad
// @match        https://www.twitch.tv/Wickerrman
// @match        https://www.twitch.tv/hazeleyedchic
// @match        https://www.twitch.tv/Yun0gaming
// @match        https://www.twitch.tv/AvronDoodles
// @match        https://www.twitch.tv/Liddles
// @match        https://www.twitch.tv/PirateGray
// @match        https://www.twitch.tv/TheBlackHokage
// @match        https://www.twitch.tv/EllyEN
// @match        https://www.twitch.tv/runJDrun
// @match        https://www.twitch.tv/MoonlitCharlie
// @match        https://www.twitch.tv/REDinFamy
// @match        https://www.twitch.tv/DamienHaas
// @match        https://www.twitch.tv/Alixxa
// @match        https://www.twitch.tv/MaudeGarrett
// @match        https://www.twitch.tv/Lovinurstyle
// @match        https://www.twitch.tv/Kelsi
// @match        https://www.twitch.tv/SypherPK
// @match        https://www.twitch.tv/TrishaHershberger
// @match        https://www.twitch.tv/RogersBase
// @match        https://www.twitch.tv/FooYa
// @match        https://www.twitch.tv/snoodyboo
// @match        https://www.twitch.tv/DeMu
// @match        https://www.twitch.tv/SirhcEz
// @match        https://www.twitch.tv/Acie
// @match        https://www.twitch.tv/TheGeekEntry
// @match        https://www.twitch.tv/snoodyboo
// @match        https://www.twitch.tv/Areliann
// @match        https://www.twitch.tv/MatthewSantoro
// @match        https://www.twitch.tv/Alienware
// @match        https://www.twitch.tv/Eiya
// @match        https://www.twitch.tv/RedBeard
// @match        https://www.twitch.tv/Rogue
// @match        https://www.twitch.tv/Sydeon
// @match        https://ehc5ey5g9hoehi8ys54lr6eknomqgr.ext-twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ext-twitch.tv
// @downloadURL https://update.greasyfork.org/scripts/488266/AlienwareArena%20Twitch%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/488266/AlienwareArena%20Twitch%20Helper.meta.js
// ==/UserScript==

/*
  Works only without @grant none
  0.21: added notif when streamer is offline before max points
*/


/*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener

function GM_onMessage(label, callback) {
	GM_addValueChangeListener(label, function() {
		callback.apply(undefined, arguments[2]);
	});
}

GM_onMessage('_.unique.name.greetings', function(src, message) {
  console.log('[onMessage]', src, '=>', message);
});

function GM_sendMessage(label) {
	GM_setValue(label, Array.from(arguments).slice(1));
}

GM_onMessage('_.unique.name.greetings', function(src, message) {
  console.log('[onMessage]', src, '=>', message);
});

//GM_sendMessage('_.unique.name.greetings', 'hello', window.location.href);
*/

var notifHandler = (function () {
	_checkNotifPermission();

	function _checkNotifPermission() {
		if (Notification.permission !== "granted")
			Notification.requestPermission();
		else
			return true;
	}

	function notifyMe(title, body) {
		if (!_checkNotifPermission)
			return;

		var notification = new Notification( title, {
			icon: '',
			body: body,
			requireInteraction: true
		});
	}

	return {
		notifyMe: notifyMe
    };
})();

let log_prefix = '::AWA_ext:: ',
	extension_url = 'https://ehc5ey5g9hoehi8ys54lr6eknomqgr.ext-twitch.tv',
	// in ms
	interval_check = 60e3;

function sendMsgFromExtension( data ) {
	window.parent.parent.postMessage( data, 'https://www.twitch.tv' )
}

function extension() {
	console.log( 'AWA extension check.' );
	let extension_state = document.querySelector('span.state:not(.hidden)').id;
	//sendMsgFromExtension( extension_state );

	switch ( extension_state ) {
		case 'streamer_online':
		case 'grant_permission':
		case 'no_channel_found':
		case 'logged_out':
			break;
		case 'streamer_offline':sendMsgFromExtension( extension_state );
		case 'daily_cap_reached': sendMsgFromExtension( 'OK' );
	}
}

function closeTab() {
	try {
		window.opener = window;
		var win = window.open("","_self");
		win.close();
		top.close();
	} catch (e) {		}
}

function addMessageListener() {
	window.addEventListener(
		'message',
		(event) => {
			// AWA twitch extension
			if ( event.origin !== extension_url ) return;
			console.log( log_prefix + event.data );
			if ( event.data ) {
				if ( event.data === 'streamer_offline' )
					notifHandler.notifyMe( 'AWA', 'Streamer offline!' );
				closeTab();
			}
		}
	);
}



(function() {
    'use strict';
    // Your code here...
	console.log( 'twitch|| ' + window.location.hostname);
	if ( window.location.hostname === 'www.twitch.tv' || window.location.hostname === 'www.dsl.sk' ) {
		addMessageListener();
		return;
	}
	// hostname == without https://
	if ( window.location.origin === extension_url ) {
		extension();
		setInterval( extension, interval_check );
		return;
	}
})();


