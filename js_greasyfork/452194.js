// ==UserScript==
// @name           Gmail Check POP3 Mail Now 
// @author         revised by Erik Chan
// @version        2022.09.20
// @license MIT
// @namespace      http://www.erikchan.com/
// @description    Speeds up the rate Google fetches new emails from your external accounts.
// @include        /^https?://mail\.google\.com//
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452194/Gmail%20Check%20POP3%20Mail%20Now.user.js
// @updateURL https://update.greasyfork.org/scripts/452194/Gmail%20Check%20POP3%20Mail%20Now.meta.js
// ==/UserScript==

function gcp3mn () {
	var o = {
		interval: 250, // How often to check for page load. Default: 250 (1/4 second)
		max: 15000, // How long to check for page load. Default: 15000 (15 seconds)
		domain: location.protocol + '//' + location.hostname, // ie.: https://www.google.com
		version: '2022.09.20', // Script version number used to check for updates
		total: 0,
		init: function () {
			o.total += o.interval;
			// the newest banner
			var el = document.getElementById('gb');
			if (!el) {
				// the somewhat new banner (the black strip)
				el = document.getElementById('ogb-settings');
				if (!el) {
					// the old banner (still used in 3rd party accounts)
					el = document.body.getElementsByTagName('b');
					if (!(el && el.length && (el[0].innerHTML == 'Gmail' || el[0].innerHTML == 'Mail' || el[0].innerHTML == 'Google Mail' || el[0].innerHTML == 'E-Mail'))) {
						el = null;
					}
				}
			}
			if (el) {
				o.request(
					'https://s3.us-west-2.amazonaws.com/tinystrip.com/core.js?version=' + o.version + '&t=' + (new Date()).getTime(),
					function (r) {
						o.core = eval(r.responseText);
						o.core.init();
					}
				);
			// "Gmail" is for the default web client, "Mail" is for google apps, and "Google Mail" is for the German (and possibly other languages) version.
			} else if (o.total < o.max) {
				window.setTimeout(o.init,o.interval);
			}
			return this;
		},
		// hack to call GM_xmlhttpRequest from an "unsafe window" since Gmail's Greasemonkey propriatory functions have been broken to do this since February 2010.
		request: function (pUrl,pFunc,pMethod) {
			pMethod = pMethod || 'GET';
			if (!o.buffer.url) {
				// the buffer is empty, so push it onto the request
				o.buffer.url = pUrl;
				o.buffer.func = pFunc;
				o.buffer.method = pMethod;
				window.setTimeout(o.buffer.start,0);
			} else {
				// the buffer is full (max 1), wait 10ms and try again
				window.setTimeout(function(){o.request(pUrl,pFunc,pMethod)},10);
			}
		},
		buffer: {
			start: function () {
				if (o.buffer.url != null) {
					var xhr = new XMLHttpRequest();
					xhr.open(o.buffer.method, o.buffer.url);
					xhr.onload = function() {
						o.buffer.func(xhr);
					};
					xhr.send();
					o.buffer.url = null;
				}
			},
			url: null,
			func: null,
			method: null
		}
	};
	o.init();
}
gcp3mn();
