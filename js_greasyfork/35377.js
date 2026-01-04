// ==UserScript==
// @name			Jalup NEXT Replace App.js
// @namespace		nelemnaru
// @include		https://jalupnext.com/*
// @version		1
// @description	Replaces app.js with my own version
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35377/Jalup%20NEXT%20Replace%20Appjs.user.js
// @updateURL https://update.greasyfork.org/scripts/35377/Jalup%20NEXT%20Replace%20Appjs.meta.js
// ==/UserScript==

// Note: Need to block app.js script with uBlock first

$.getScript("https://ginkage.000webhostapp.com/jalupnext/modified_app.php", function() {
	$.getScript("https://code.responsivevoice.org/responsivevoice.js");
	$.getScript("https://ginkage.000webhostapp.com/jalupnext/kustom.js");
});
