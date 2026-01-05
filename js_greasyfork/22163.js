// ==UserScript==
// @name         Fix middle click on First We Feast
// @namespace    https://greasyfork.org/users/649
// @version      1.0.3
// @description  Fixes middle click on First We Feast
// @author       Adrien Pyke
// @match        *://firstwefeast.com/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/22163/Fix%20middle%20click%20on%20First%20We%20Feast.user.js
// @updateURL https://update.greasyfork.org/scripts/22163/Fix%20middle%20click%20on%20First%20We%20Feast.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var processLink = function(link) {
		var handleLink = function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			var url = location.protocol + "//" + location.host + link.getAttribute('navigate-to');
			if (e.button === 1) {
				GM_openInTab(url, true);
			} else {
				window.location.href = url;
			}
			return false;
		};
		link.onmousedown = function(e) {
			if (e.button === 1) {
				e.preventDefault();
			}
		};
		link.onclick = handleLink;
		link.onauxclick = link.onclick;
		Array.from(link.querySelectorAll('*')).forEach(function(elem) {
			elem.onclick = handleLink;
			elem.onauxclick = elem.onclick;
		});
	};

	waitForElems('.viewport-image', processLink);
})();