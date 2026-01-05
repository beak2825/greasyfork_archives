// ==UserScript==
// @name        ALL THE LINKS in new windows
// @namespace   http://www.onfocus.com/
// @include     http://*.metafilter.com/*
// @version     1
// @description This will force all the links at MetaFilter.com sites to open in a new tab, even internal links.
// @downloadURL https://update.greasyfork.org/scripts/2536/ALL%20THE%20LINKS%20in%20new%20windows.user.js
// @updateURL https://update.greasyfork.org/scripts/2536/ALL%20THE%20LINKS%20in%20new%20windows.meta.js
// ==/UserScript==

(function(){
	var script = document.createElement("script");
	script.type = "application/javascript";
	script.innerHTML = "$(function(){$('a').attr('target', '_blank');});";
	document.body.appendChild(script);
})();