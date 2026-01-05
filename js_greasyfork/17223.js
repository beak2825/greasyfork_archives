// ==UserScript==
// @name			5sing Auto-Redirect
// @namespace		xuyiming.open@outlook.com
// @description		Redirect from old domain *.5sing.com to new domain 5sing.kugou.com/*
// @author			依然独特
// @version			0.1
// @grant			none
// @run-at			document-start
// @include			*://*.5sing.com/*
// @match			*://*.5sing.com/*
// @license			BSD 2-Clause License
// @downloadURL https://update.greasyfork.org/scripts/17223/5sing%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/17223/5sing%20Auto-Redirect.meta.js
// ==/UserScript==

"use strict";

( function( location ) {
	var protocol, hostname, port, pathname, search, hash,
		labels = location.hostname.split( "." );
	
	if ( labels.length === 3 ) {
		protocol = location.protocol;
		hostname = "5sing.kugou.com";
		port = location.port;
		pathname = "/" + labels[0] + location.pathname;
		search = location.search;
		hash = location.hash;
		
		location.href = protocol + "//" + hostname + ( port ? ":" + port : "" ) + pathname + search + hash;
	}
} )( window.location );
