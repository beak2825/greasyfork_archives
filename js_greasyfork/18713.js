// ==UserScript==
// @name         googleusercontent
// @namespace    http://qqboxy.blogspot.com/
// @version      0.0.2
// @description  Google image get full resolution
// @author	     QQBoxy
// @match        http://*.googleusercontent.com/*
// @match        https://*.googleusercontent.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18713/googleusercontent.user.js
// @updateURL https://update.greasyfork.org/scripts/18713/googleusercontent.meta.js
// ==/UserScript==

(function(){
	var URL = document.URL;
	var PARAM = URL.match(/(w\d+\-h\d+)((?:\-[rw|p|no]+)+)/);
	if(PARAM) {
		URL = URL.replace(PARAM[0],"s0");
		document.location = URL;
	}
})();