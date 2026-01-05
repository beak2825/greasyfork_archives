// ==UserScript==
// @name 			Clean Loopy For Youtube (Improved)
// @namespace 		VolkanK_CL_YT
// @locale          en-US
// @description 	Displays a link below YouTube videos to enable/disable auto replay.
// @include 	*://*.youtube.com/*
// @match 		*://*.youtube.com/*
// @credits 	QuaraMan (embed code) .Paradise (List Loop Support) RowenStipe (GreasyFork mirror)
// @version		2.5
// @author 		Volkan K.
// @run-at 		document-end
// @grant 		unsafeWindow
// @grant 		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25441/Clean%20Loopy%20For%20Youtube%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25441/Clean%20Loopy%20For%20Youtube%20%28Improved%29.meta.js
// ==/UserScript==

myScript = function() {

	var ytLoop = false;
	var ytPlayList;
	var ytPLIndex;
	var lpButton = "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon action-panel-trigger   yt-uix-button-opacity yt-uix-tooltip"; // Button stuff
	var lpConOff = "LoopyOff"
	var lpConOn = "LoopyOn";

	loopy = document.createElement("button");
	loopy.id = "eLoopy";
	loopy.setAttribute("onClick", "LoopyOnOff(); return false;");
	loopy.setAttribute("class", lpButton);
	loopy.setAttribute("role", "button");
	loopy.setAttribute("data-button-toggle", "true");
	loopy.setAttribute("type", "button");
	loopy.setAttribute("data-tooltip-text", "Enable auto replay")
	loopy.id = "loopyButton";

	a = document.createElement("span");
	 a.innerHTML = '<img height=18 width=30 id="loopyContent" class="LoopyOff" src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif" alt="Loopy"/><span class="yt-uix-button-valign">Auto Replay</span>';


	loopy.appendChild(a);

	window.setTimeout(function() { initLoopy(true); }, 2500);
	window.setTimeout(function() { initLoopy(false); }, 3000);
	window.setTimeout(function() { initLoopy(false); }, 3500);

	function initLoopy(addElement) {
		if (addElement) { document.getElementById("watch8-secondary-actions").appendChild(loopy); }
		is_frame=false;
		ytPlayer = document.getElementById("movie_player");
		if (ytPlayer == null) {
			ytPlayer = document.getElementById("movie_player_neo");
		}
		if (ytPlayer == null) {
			is_frame=true;
			ytPlayer = document.getElementById("ytplayer").contentDocument.getElementsByClassName("html5-video-player")[0];
		}
		if (is_frame == true) {
			ytPlayer.addEventListener("onStateChange", "window.parent.onPlayerStateChange");
		} else {
			ytPlayer.addEventListener("onStateChange", "onPlayerStateChange");
		}
	}

	onPlayerStateChange = function(newState) {
		if (ytLoop && newState == "0"){
			window.setTimeout(function() { ytPlayer.playVideo(); }, 60);
		}
	}

	LoopyOnOff = function() {
		if (ytLoop) {
			document.getElementById("loopyButton").setAttribute("data-tooltip-text", "Enable auto loop");
			document.getElementById("loopyButton").setAttribute("data-button-toggle", "true");
			document.getElementById("loopyContent").setAttribute("class", lpConOff);

			ytLoop = false;
		} else {
			document.getElementById("loopyButton").setAttribute("data-tooltip-text", "Disable auto loop");
			document.getElementById("loopyButton").setAttribute("data-button-toggle", "false");
			document.getElementById("loopyContent").setAttribute("class", lpConOn);
			ytLoop = true;
			if((apbut = document.querySelectorAll('.playlist-nav-controls .yt-uix-button-player-controls.toggle-autoplay')) && (apbut = apbut[0]) && apbut.classList.contains('yt-uix-button-toggled')){
				apbut.click(); // Turn off Playlist Autoplay so we can loop the current video.
			}
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
loopyButton:hover {\
		border: 0px none;} \
 		img.LoopyOff{\
		background: url(\"//i.imgur.com/jlhKt.png\") -0px -0px no-repeat transparent !important;\
		height: 18px;\
		width: 30px;}\
		img.LoopyOn{\
		background: url(\"//i.imgur.com/jlhKt.png\") -0px -18px no-repeat transparent !important;\
		height: 18px;\
		width: 30px;}"		

	);
};

var uw;

// unwraps the element so we can use its methods freely
function unwrap(elem) {
	if (elem) {
		if ( typeof XPCNativeWrapper === 'function' && typeof XPCNativeWrapper.unwrap === 'function' ) {
			return XPCNativeWrapper.unwrap(elem);
		} else if (elem.wrappedJSObject) {
			return elem.wrappedJSObject;
		}
	}
	return elem;
}

// get the raw window object of the YouTube page
uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : unwrap(window);

// disable Red Bar aka SPF
if (uw._spf_state && uw._spf_state.config) {
	uw._spf_state.config['navigate-limit'] = 0;
	uw._spf_state.config['navigate-part-received-callback'] = function (targetUrl) {
		location.href = targetUrl;
	};
}

if ( /^\/?watch/i.test(window.location.pathname) ) {
	document.body.appendChild(document.createElement("script")).innerHTML = "("+myScript+")()";
}