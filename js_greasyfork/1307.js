// ==UserScript==
// @name        StumbleOut
// @version     2.3
// @author      raina
// @namespace   raina
// @description Breaks the original link out of StumbleUpon frames and rewrites YouTube embed URLs to their proper video pages.
// @license     http://www.gnu.org/licenses/gpl-3.0.txt
// @include     http://www.stumbleupon.com/su/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1307/StumbleOut.user.js
// @updateURL https://update.greasyfork.org/scripts/1307/StumbleOut.meta.js
// ==/UserScript==
(function() {
	"use strict";


	var ready = function() {
		if ("complete" === document.readyState) {
			observe();
		}
	};


	var observe = function() {
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if ("class" === mutation.attributeName) {
					if ("undefined" === typeof iframe || !iframe) {
						iframe = document.querySelector('.stumble-frame');
					}
					if ("undefined" !== typeof iframe && iframe) {
						if (/youtube\.com\/embed/.test(iframe.src)) {
							var video = iframe.src.replace(/(embed\/)([\w\d-]+)(\?.*$)/, "watch?v=$2");
							var timestamp;
							if (timestamp = iframe.src.match(/t=\d+m\d+s/)) {
								video += "&" + timestamp[0];
							}
							window.location.href = video;
						} else {
							window.location.href = iframe.src;
						}
						observer.disconnect();
					}
				}
			});
		});
		var config = {attributes: true};
		observer.observe(document.body, config);
	}


	if (window.self === window.top) {
		var iframe;
		document.addEventListener("readystatechange", ready, false);
	}
}());
