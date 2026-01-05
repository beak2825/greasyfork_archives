// ==UserScript==
// @name          Vertical Stream Magic
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       4
// @description   Adjust Twitch streams for a vertical orientated monitor.
// @include       *://www.twitch.tv/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant         none
// @updateVersion 4
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/25612/Vertical%20Stream%20Magic.user.js
// @updateURL https://update.greasyfork.org/scripts/25612/Vertical%20Stream%20Magic.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
	'use strict';
	function resizeIframes() {
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		var streamFrameHeight = Math.floor((_width / 16) * 9);
		$("iframe#vsmStream").attr("width", _width).attr("height", streamFrameHeight);
		$("iframe#vsmChat").attr("width", _width).attr("height", _height - streamFrameHeight);
	}
	var notchannels = ["dashboard", "directory", "friends", "jobs", "login", "logout", "manager", "store", "subscriptions", "settings", "videos"];
	function channelCatcher() {
		var channelName = document.URL.split("twitch.tv/")[1].split("/")[0].split("&")[0].split("#")[0];
		if(document.URL.split("twitch.tv/")[1].length > 0 && document.URL.split("twitch.tv/")[1].split("/").length == 1 && notchannels.indexOf(channelName) == -1){
			window.location.assign(document.URL.replace("twitch.tv/", "twitch.tv/vsm/"));
		}
	}
	if(document.URL.indexOf("twitch.tv/vsm/") != -1){
		var channelName = document.URL.split("twitch.tv/vsm/")[1].split("/")[0].split("&")[0].split("#")[0];
		$('script').each(function () { $(this).remove(); });
		$('body').html('' +
			'<iframe src="https://player.twitch.tv/?channel='+channelName+'" id="vsmStream" height="450" width="800" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>' +
			'<iframe src="https://www.twitch.tv/'+channelName+'/chat?popout=" id="vsmChat" height="450" width="800" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>' +
		'');
		$('head').html('<title>'+channelName+'</title>');
		$('<style></style>').prop('type', 'text/css').html('' +
			'html{height:100%;}body{padding:0 0 0 0;margin:0 0 0 0;background-color:#333;}iframe#vsmStream, iframe#vsmChat{padding:0 0 0 0;margin:0 0 0 0;display:block;}' +
		'').appendTo('head');
		resizeIframes();
		$(window).resize(resizeIframes);
	}else{
		channelCatcher();
		var observer = new MutationObserver(channelCatcher);
		observer.observe(document.body, {childList: true});
	}
});