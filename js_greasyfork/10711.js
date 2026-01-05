// ==UserScript==
// @name        Steam - Enable and Set Video Volume
// @description Turn on audio and set a default volume for videos on Steam
// @namespace   valacar.steam.video-volume
// @author      valacar
// @include     http://store.steampowered.com/*
// @version     0.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10711/Steam%20-%20Enable%20and%20Set%20Video%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/10711/Steam%20-%20Enable%20and%20Set%20Video%20Volume.meta.js
// ==/UserScript==

var defaultVolumePercent = 50.0;


function cookieSetNoExpire(name,value) {
	document.cookie = name + "=" + value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

function cookieExists(name) {
	if (!name) { return false; }
	return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}


// enable audio
cookieSetNoExpire("bGameHighlightAudioEnabled", true);

// set volume slider if it hasn't been set
if (!cookieExists('flGameHighlightPlayerVolume')) {
	cookieSetNoExpire("flGameHighlightPlayerVolume", defaultVolumePercent);
}
