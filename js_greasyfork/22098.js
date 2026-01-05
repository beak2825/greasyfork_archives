// ==UserScript==
// @name         OGame: Przeprowadzane badania i budynki na gorze
// @namespace    Vess
// @description  Badane badania lub budynki zawsze na gorze
// @include      http://ogame1304.de/game/index.php?page=buildings*
// @include      http://ogame1304.de/game/index.php?page=b_building*
// @grant        none
// @version 0.0.1.20160807104140
// @downloadURL https://update.greasyfork.org/scripts/22098/OGame%3A%20Przeprowadzane%20badania%20i%20budynki%20na%20gorze.user.js
// @updateURL https://update.greasyfork.org/scripts/22098/OGame%3A%20Przeprowadzane%20badania%20i%20budynki%20na%20gorze.meta.js
// ==/UserScript==

(function ()
{
	var url = document.location.href;
	// The following "if" is not really necessary but with it this script will work for Opera too
	if (((url.indexOf ('/game/index.php?page=buildings') != -1) && (url.indexOf ('&mode=Forschung') != -1)) ||
	    (url.indexOf ('/game/index.php?page=b_building') != -1))
	{
		var running = document.getElementById ('bxx').parentNode.parentNode;
		var index = (url.indexOf ('/game/index.php?page=b_building') != -1) ? 0 : 0;
		if (running)
			running.parentNode.insertBefore (running, running.parentNode.rows [index]);
	}
}
)();