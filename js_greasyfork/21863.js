// ==UserScript==
// @name        ROBLOX - Skip video ads
// @namespace   https://greasyfork.org/en/users/58051-roblox
// @description Allows you to start games immediately without waiting for the video ad to finish
// @match       https://*.roblox.com/games/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21863/ROBLOX%20-%20Skip%20video%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/21863/ROBLOX%20-%20Skip%20video%20ads.meta.js
// ==/UserScript==

function inject(func) {
	var source = func.toString();
	var script = document.createElement('script');
	script.innerHTML = "("+ source +")()";
	document.body.appendChild(script);
}

function goodbyeVideoAd() {
	Roblox.VideoPreRollDFP.isExcluded = function(e) { return true; };
}

inject(goodbyeVideoAd);