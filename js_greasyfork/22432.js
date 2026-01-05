// ==UserScript==
// @name         Gitlab Default dropdown to Https
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      0.1
// @description  Make default clone method is HTTPS instead of SSH
// @author       Ruphine
// @include      https://gitlab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22432/Gitlab%20Default%20dropdown%20to%20Https.user.js
// @updateURL https://update.greasyfork.org/scripts/22432/Gitlab%20Default%20dropdown%20to%20Https.meta.js
// ==/UserScript==

$(document).ready(function()
{
	if($("#clone-dropdown")[0])
	{
		$("#clone-dropdown")[0].click();
		$(".http-selector")[0].click();
	}
});