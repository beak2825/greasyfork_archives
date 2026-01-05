// ==UserScript==
// @name        Kasi Player Fix
// @namespace   charliet@gmail.com
// @include     http://kasimp3.co.za/*
// @version     1.2
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/swfobject/2.2/swfobject.min.js
// @description:en     Fixes the broken flash player on pages like http://kasimp3.co.za/144116
// @description Fixes the broken flash player on pages like http://kasimp3.co.za/144116
// @downloadURL https://update.greasyfork.org/scripts/19743/Kasi%20Player%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/19743/Kasi%20Player%20Fix.meta.js
// ==/UserScript==

$(document).ready(function(){
	track_url = $('meta[property="og:audio"]').attr('content');

	var flashvars = {
		mp3: track_url,
		wmode: "transparent"
	};
	var params = {wmode: "transparent"};
	var attributes = {};
	var callback = function (e){};

	swfobject.embedSWF("http://kasimp3.co.za/flash/dewplayer-bubble-vol.swf", 
			   "dewplayer", 
			   "250", 
			   "65", 
			   "9", 
			   "https://cdnjs.cloudflare.com/ajax/libs/html5media/1.1.8/expressInstall.swf", 
			   flashvars, 
			   params, 
			   attributes, 
			   callback);
});