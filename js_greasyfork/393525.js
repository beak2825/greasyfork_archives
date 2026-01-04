// ==UserScript==
// @name        Bypass Age Verification - deviantart.com
// @namespace   Prodbydie Script
// @match       put here your deviantart link
// @grant       none
// @version     1.0
// @author      Prodbydie
// @description Bypass age request for NSFW content on Deviantart.
// @downloadURL https://update.greasyfork.org/scripts/393525/Bypass%20Age%20Verification%20-%20deviantartcom.user.js
// @updateURL https://update.greasyfork.org/scripts/393525/Bypass%20Age%20Verification%20-%20deviantartcom.meta.js
// ==/UserScript==
(function() {
	function jsonp(url, callback) {
		var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
		window[callbackName] = function(data) {
			document.body.removeChild(script);
			callback(data);
		};

		var script = document.createElement('script');
		script.src = url + '&format=jsonp&callback=' + callbackName;
		document.body.appendChild(script);
	}

	jsonp("http://backend.deviantart.com/oembed?url=" + encodeURIComponent(document.URL.split("?")[0]), function(data) {
	   window.location.href=data["url"];
	});
}());
