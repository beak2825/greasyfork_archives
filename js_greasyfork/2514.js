// ==UserScript==
// @name		SSForder
// @description		Showing SSF orders!
// @version		4.0
// @namespace		ssforder
// @include		http://*.erepublik.com/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/2514/SSForder.user.js
// @updateURL https://update.greasyfork.org/scripts/2514/SSForder.meta.js
// ==/UserScript==

function GM_wait() {
	if (typeof unsafeWindow.jQuery == 'undefined') {
		window.setTimeout(GM_wait, 100);
	} else {
		$ = unsafeWindow.jQuery;
		StartFunctions();
	}
}
GM_wait();

function StartFunctions() {
	$.get("https://docs.google.com/document/d/1y39n_TzCyhX2oAZiAFj1w4rU6uC3F4EeT3q9izt0t-4/export?format=txt&id=1y39n_TzCyhX2oAZiAFj1w4rU6uC3F4EeT3q9izt0t-4&token=AC4w5ViYBIYfdJVQEANSF35fRFW15TzRhA%3A1402861441759", function(data) {
		var Order = data;
		var LepOrder = "<h1><center>"+ Order +"</center></h1>";
		$("div.user_finances").after('<center><div id="SSForder"><marquee width="150" height="30" scrolldelay="1" scrollamount="2">' + LepOrder + '</marquee></div><center>');
	});
}