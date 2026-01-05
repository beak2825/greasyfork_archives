// ==UserScript==
// @name         HTTPS-to-HTTP by Mandy
// @namespace    http://userscripts.org/users/522904
// @description  Redirect HTTPS to HTTP
// @include        http://*
// @include        https://*
// @grant        none
// @run-at       document-start

// @version      1.0.0

// @downloadURL https://update.greasyfork.org/scripts/1295/HTTPS-to-HTTP%20by%20Mandy.user.js
// @updateURL https://update.greasyfork.org/scripts/1295/HTTPS-to-HTTP%20by%20Mandy.meta.js
// ==/UserScript==

(function(){
	if(document.location.href.indexOf("https://")==0)
		document.location.href=document.location.href.replace('https://','http://');
})();