// ==UserScript==
// @name			Microsoft support always open en-us version
// @namespace		dexter86
// @description		If you hate those autotranslate KB support articles, then this script will always load english version
// @include			http://support.microsoft.com/*
// @include			https://support.microsoft.com/*
// @run-at			document-start
// @grant			none
// @version			1.5
// @downloadURL https://update.greasyfork.org/scripts/27284/Microsoft%20support%20always%20open%20en-us%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/27284/Microsoft%20support%20always%20open%20en-us%20version.meta.js
// ==/UserScript==

var abc = window.location.href.split("/");
if (abc[4] === "help")
{
	if (abc[3] !== "en-us")
	{
		window.location = "https://support.microsoft.com/en-us/help/" + abc[5];
	}
}
