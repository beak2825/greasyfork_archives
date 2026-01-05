// ==UserScript==
// @name    Uncheck Include McAfee on Adobe downloads
// @namespace   albionresearch
// @description Disable Adobe's default inclusion of optional McAfee software in downloads.
// @include     http://get.adobe.com/*
// @include     https://get.adobe.com/*
// @version     1.1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11612/Uncheck%20Include%20McAfee%20on%20Adobe%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/11612/Uncheck%20Include%20McAfee%20on%20Adobe%20downloads.meta.js
// ==/UserScript==
// http://stackoverflow.com/questions/11195658/run-greasemonkey-script-on-the-same-page-multiple-times/11197969#11197969

function uncheckOffer(jNode) {
	if (document.getElementById("offerCheckbox").checked) {
		document.getElementById("offerCheckbox").click();
		// By faking a click() the download size gets recalculated and text gets updated.
		//alert( "Got it" );
	}
}

waitForKeyElements( "#offerCheckbox", uncheckOffer );
