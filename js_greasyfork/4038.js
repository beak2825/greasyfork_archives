// ==UserScript==
// @name           Loopy for YouTube
// @namespace      CDM
// @description    Displays a link below YouTube videos to enable/disable auto replay.
// @include        http*://*.youtube.com/watch?*v=*
// @credits        QuaraMan (embed code)
// @version 0.0.1.20140811015305
// @downloadURL https://update.greasyfork.org/scripts/4038/Loopy%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/4038/Loopy%20for%20YouTube.meta.js
// ==/UserScript==

myScript = function() {

	var ytLoop = false;
	var ytPlayList;
	var ytPLIndex;

	a = document.createElement("button");
	a.setType = "button";
	a.setAttribute("z-index", "9999999");
if (ytLoop) {
	a.id = "eOnOff"; a.innerHTML = "Repeat On"; a.title = "Toggle auto replay";
	a.setAttribute("onClick", "LoopyOnOff(); return false;");
	a.setAttribute("class", "yt-uix-tooltip-reverse yt-uix-button yt-uix-tooltip yt-uix-button-active");
} else {
	a.id = "eOnOff"; a.innerHTML = "Repeat Off"; a.title = "Toggle auto replay";
	a.setAttribute("onClick", "LoopyOnOff(); return false;");
	a.setAttribute("class", "yt-uix-tooltip-reverse yt-uix-button yt-uix-tooltip");
}

	if (window.location.href.toLowerCase().indexOf("feature=playlist") > 0) {
		a.innerHTML = "Loop PlayList";

		urlArgs = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < urlArgs.length; i++) {
			arg = urlArgs[i].split('=');
			if (arg[0].toLowerCase() == "p") {
				ytPlayList = arg[1];
			} else if (arg[0].toLowerCase() == "index") {
				ytPLIndex = parseInt(arg[1])+1;
			}
		}

		if(ytPlayList == getCookie("LoopyPL")) {
			a.title = "Disable auto replay";
			a.setAttribute("class", "yt-uix-button-active");
			ytLoop = true;
		}
	}

//	loopy.appendChild(a);

	window.setTimeout(function() { initLoopy(true); }, 500);
	window.setTimeout(function() { initLoopy(false); }, 1500);
	window.setTimeout(function() { initLoopy(false); }, 3500);

	function initLoopy(addElement) {
		if (addElement) { document.getElementById("watch-actions").appendChild(a); }
		ytPlayer = document.getElementById("movie_player");
		ytPlayer.addEventListener("onStateChange", "onPlayerStateChange");
	}

	onPlayerStateChange = function(newState) {
		if (ytLoop && newState == "0") {
			if (typeof ytPlayList != "undefined") {
				if (ytPLIndex == document.getElementById("playlistVideoCount_PL").innerHTML) {
					var url = document.getElementById("playlistRow_PL_0").getElementsByTagName("a")[0].href + "&playnext=1";
					window.setTimeout(function() { window.location = url}, 60);
				}
			} else {
				window.setTimeout(function() { ytPlayer.playVideo(); }, 60);
			}
		}
	}

	LoopyOnOff = function() {
		if (ytLoop) {
			if (typeof ytPlayList != "undefined") setCookie("LoopyPL", null);
			document.getElementById("eOnOff").setAttribute("class", "yt-uix-tooltip-reverse yt-uix-button yt-uix-tooltip");
			document.getElementById("eOnOff").innerHTML = "Repeat Off";
			ytLoop = false;
		} else {
			if (typeof ytPlayList != "undefined") setCookie("LoopyPL", ytPlayList);
			document.getElementById("eOnOff").setAttribute("class", "yt-uix-tooltip-reverse yt-uix-button yt-uix-tooltip yt-uix-button-active");
			document.getElementById("eOnOff").innerHTML = "Repeat On";
			ytLoop = true;
		}
	}

	function getCookie(name) {
		var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		if (results) {
			return unescape(results[2]);
		} else {
			return null;
		}
	}

	function setCookie(name, value) {
		document.cookie = name + "=" + escape(value);
	}

	if (typeof GM_addStyle == "undefined") {
		GM_addStyle = function(text) {
			var head = document.getElementsByTagName("head")[0];
			var style = document.createElement("style");
			style.setAttribute("type", "text/css");
			style.textContent = text;
			head.appendChild(style);
		}
	}

	GM_addStyle("						\
		#eOnOff {					\
			margin-left:0.4em;\
			vertical-align:top;\
		#eOnOff:hover {				\
			-moz-box-shadow:0 0 3px #999999;\
			background:-moz-linear-gradient(center top , #FFFFFF, #EBEBEB) repeat scroll 0 0 #F3F3F3;\
			border-color:#999999;\
			outline:0 none; }   \
		#eOnOff:active {					\
			background:-moz-linear-gradient(center top , #CCCCCC, #FFFFFF) repeat scroll 0 0 #DDDDDD;\
			border-color:#999999; }"
	);
};

document.body.appendChild(document.createElement("script")).innerHTML = "("+myScript+")()";