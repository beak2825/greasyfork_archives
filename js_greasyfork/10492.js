// ==UserScript==
// @name        	URL Redirector
// @namespace   	https://greasyfork.org/en/scripts/10489-url-redirector
// @version     	1.0.0.0
// @description 	Redirect URL to another URL. 
// @author       	euverve/thatskie
// @include         http://*
// @include         https://*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/10492/URL%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/10492/URL%20Redirector.meta.js
// ==/UserScript==

//RegEx for sites to redirect.
var regexp = new RegExp("(glarysoft|msn).(com|net)");		
var results = regexp.exec(window.location.href);

if(results){
	//Redirect page to Google
    //window.location.href = "http://www.google.com";		
	//window.location.replace ("http://www.google.com")
	
	//Display blank page
	window.location.replace ("about:blank")
}

