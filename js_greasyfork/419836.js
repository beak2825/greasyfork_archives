// ==UserScript==
// @name PogChamp
// @description Brings back PogChamp
// @namespace b4k
// @version 1.0.0
// @match *://www.twitch.tv/*
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419836/PogChamp.user.js
// @updateURL https://update.greasyfork.org/scripts/419836/PogChamp.meta.js
// ==/UserScript==

(function(){
	var check;
	var script;
	
	script = document.createElement("script");
	
	script.src = (
		"https://b4k.co/pogchamp.js?v=" +
		Math.floor(Date.now()/(1000*60*10))
	);
	
	check = function () {
		if (unsafeWindow.FrankerFaceZ) {
			document.head.appendChild(script);
		} else {
			setTimeout(check, 1000);
		}
	};
	
	setTimeout(check, 2000);
})();
