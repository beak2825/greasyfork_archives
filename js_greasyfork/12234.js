// ==UserScript==
// @name Free Piano Sheet Music Unblocker
// @namespace http://freepianosongs.blogspot.com/p/download-page.html
// @description Prevent Free Piano Sheet Music from blocking due to copyright
// @include http://freepianosongs.blogspot.com/*
// @version 0.0.3
// @run-at document-start
// @require https://greasyfork.org/scripts/12317-checkforbadjavascripts-js/code/checkForBadJavascriptsjs.js?version=73234
// @downloadURL https://update.greasyfork.org/scripts/12234/Free%20Piano%20Sheet%20Music%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/12234/Free%20Piano%20Sheet%20Music%20Unblocker.meta.js
// ==/UserScript==

checkForBadJavascripts ( [
	[   false, 
		/download-page_08/, 
		function () {
			addJS_Node ('console.log("Intercepted");');
		} 
	]
] );