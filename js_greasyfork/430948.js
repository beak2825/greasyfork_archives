// ==UserScript==
// @name         幻听网
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  幻听网小说广告剔除
// @author       gwbc
// @match        http://www.ting89.com/*
// @icon         http://www.ting89.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430948/%E5%B9%BB%E5%90%AC%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/430948/%E5%B9%BB%E5%90%AC%E7%BD%91.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

	var iframes = document.querySelectorAll('iframe');
	for (var i = 0; i < iframes.length; ++i) {
		iframes[i].remove();
	}

	var c = 0;
	var t = setInterval(function() {
		if (c > 200) {
			clearInterval(t);
			return
		}
		
		c++;

		var div = document.getElementById('cs_DIV_cscpvrich9121B')
		if (div != null) {
			div.remove();
		}
	}, 10);
})();
