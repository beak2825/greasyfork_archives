// ==UserScript==
// @name        Always open spotify desktop app
// @namespace   Violentmonkey Scripts
// @match       https://open.spotify.com/*
// @grant       none
// @version     1.1
// @author      liliantdn
// @license MIT
// @description Always open spotify links in the desktop app
// @downloadURL https://update.greasyfork.org/scripts/450925/Always%20open%20spotify%20desktop%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/450925/Always%20open%20spotify%20desktop%20app.meta.js
// ==/UserScript==
(function() {
  let a = location.href.split("/");
	if (a[3] != "search"){
		location.href = "spotify:"+a[3]+":"+a[4];
		window.close();
	}
})();