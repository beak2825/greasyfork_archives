// ==UserScript==
// @name        Filehippo - Replace Download Manager with Direct Links
// @namespace   filehippo-directlinks
// @author      conquerist
// @description Replaces download manager links on filehippo.com with direct download links. Works on download pages and update checker results page.
// @include     /^https?://update\.filehippo\.com/update/check/.*$/
// @include     /^https?://filehippo\.com/download.*$/
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4985/Filehippo%20-%20Replace%20Download%20Manager%20with%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/4985/Filehippo%20-%20Replace%20Download%20Manager%20with%20Direct%20Links.meta.js
// ==/UserScript==
// 1.3 - 20140914 - Improved Chrome / Tampermonkey compatibility
// 1.2 - 20140914 - Improved Chrome / Tampermonkey compatibility
// 1.1 - 20140913 - Fix for formatting of "Your computer is up-to-date!" message
// 1.0 - 20140913 - Initial version 

if( window.location.pathname.match(/^\/update\/check/) ) {
	// point links on update checker results to direct download
	var as = document.querySelectorAll('a.update-download-link');
	for(var i = 0; i < as.length; i++) {
		as[i].href += '/?direct';
	}
	
	// fix "Your computer is up-to-date!" message
	var e = document.querySelector('#no-updates-message-container');
	e.className = e.className.replace(/\s*hidden/,'');
}
else if( window.location.pathname.match(/^\/download/) ) {
	var e = document.querySelector('#program-header-download-link-dm-text');
	if(e) {
		// remove text "Download Manager Enabled"
		e.parentNode.removeChild(e);

		// remove additional direct download link
		e = document.getElementById('direct-download-link-container');
		a = e.querySelector('a');
		var direct_onclick = a.getAttribute('onclick');
		var direct_href = a.getAttribute('href');
		e.parentNode.removeChild(e);

		// modify regular download links
		var div = document.querySelector('div.program-header-download-link-container');
		as = div.querySelectorAll('a');
		as[0].setAttribute('href', direct_href);
		as[0].setAttribute('onclick', direct_onclick);
		as[1].setAttribute('href', direct_href);
		as[1].setAttribute('onclick', direct_onclick);
		div.className = div.className.replace(/\s+download-manager-enabled/,'');
		as[0].className = as[0].className.replace(/\s+download-manager-enabled/,'');
	}
}