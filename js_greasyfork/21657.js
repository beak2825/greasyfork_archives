// ==UserScript==
// @name         Fix Middle Click on 16personalities.com
// @namespace    https://greasyfork.org/users/649
// @version      1.1.4
// @description  Fix middle click acting the same as left click
// @author       Adrien Pyke
// @match        *://www.16personalities.com/personality-types
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/21657/Fix%20Middle%20Click%20on%2016personalitiescom.user.js
// @updateURL https://update.greasyfork.org/scripts/21657/Fix%20Middle%20Click%20on%2016personalitiescom.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var types = Array.from(document.querySelectorAll('div.type-item'));
	types.forEach(function(type) {
		type.removeAttribute('onclick');
		var link = type.querySelector('a');
		if (link) {
			link.onclick = function(e) {
				e.preventDefault();
				return false;
			};
			type.onmousedown = function(e) {
				if(e.button === 1) {
					e.preventDefault();
				}
			};
			type.onclick = function(e) {
				console.log(e.target);
				e.preventDefault();
				if(e.button === 1) {
					GM_openInTab(link.href, true);
				} else if (e.button === 0) {
					window.location.href = link.href;
				}
				return false;
			};
			type.onauxclick = type.onclick;
		}
	});
})();