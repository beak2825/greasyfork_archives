// ==UserScript==
// @name		Always Gaming On Youtube
// @namespace	https://www.megacoder.com
// @version		0.0.0rc2
// @description	Force youtube.com dark theme
// @author		Tommy Reynolds <oldest.software.guy@gmail.com>
// @match		https?://www.youtube.com/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/368826/Always%20Gaming%20On%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/368826/Always%20Gaming%20On%20Youtube.meta.js
// ==/UserScript==

(function()	{
	var gaming_url = document.URL.replace( 'www.youtube.com', 'gaming.youtube.com' );
	location.href( gaming_url );
})();
