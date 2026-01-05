// ==UserScript==
// @name        Tripwire SearchHotkey
// @namespace   dstech.tripwire
// @description Hotkey to select "search" field in Tripwire
// @include     https://tripwire.eve-apps.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19765/Tripwire%20SearchHotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/19765/Tripwire%20SearchHotkey.meta.js
// ==/UserScript==

$(document).keydown(function(e)	{
	if (e.keyCode == 70) {
		//Abort - user is in input or textarea
		if ($(document.activeElement).is("textarea, input")) return;

		e.preventDefault();
		$(".systemsAutocomplete").val("");
		$("#search").click();

	} else if (e.keyCode == 27) {
		if (!($(document.activeElement).hasClass("systemsAutocomplete"))) return;

		e.preventDefault();
		$("#search").click();
		$(".systemsAutocomplete").val("").blur();
	}
});
