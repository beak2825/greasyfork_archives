// ==UserScript==
// @name         Script Loader
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0
// @description  Load remote scripts 
// @author       Croned
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31737/Script%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/31737/Script%20Loader.meta.js
// ==/UserScript==

(function(w) {
    'use strict';

	w.sloader = {};
	
	w.sloader.load = function (url, cb) {
		var script = document.createElement("script");
		script.src = url;
		script.onload = cb;
		document.body.appendChild(script);
	};
	
	w.sloader.jquery = function (cb) {
		this.load("https://code.jquery.com/jquery-3.2.1.min.js", cb);
	};	
	
	w.sloader.jqueryui = function (cb) {
		this.load("https://code.jquery.com/ui/1.12.1/jquery-ui.min.js", cb);
	};
})(window);