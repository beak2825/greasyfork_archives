// ==UserScript==
// @name         Chaturbate.com + VLC Media Player 
// @namespace    
// @version      1.1
// @description  Open Chaturbate.com stream in VLC Media Player,'web interface' must be enabled in VLC Preferences on default 8080 port
// @author       obscenelysad@gmail.com
// @include      https://chaturbate.com/*
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/17979/Chaturbatecom%20%2B%20VLC%20Media%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/17979/Chaturbatecom%20%2B%20VLC%20Media%20Player.meta.js
// ==/UserScript==


var cam_page = document.getElementsByClassName('nextcam');



if (cam_page.length > 0) {



	var a = document.documentElement.innerHTML;
	var b = a.split('.m3u8');
	var c = b[0].split('"src=\'');

	var stream_url = c[c.length-1] + '.m3u8'

	var vlc_url = 'http://localhost:8080/requests/status.json?command=in_play&input=' + encodeURIComponent(stream_url);

	console.log(vlc_url);


	GM_xmlhttpRequest({
		method: 'GET',
		url: vlc_url,
		onload: function(response) {

		}
	});



}