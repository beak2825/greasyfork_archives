// ==UserScript==
// @name		webnovelpub/lightnovelworld banner remover
// @version		0.2
// @description	removes the annoying banners
// @author		Sarusei
// @match		https://www.webnovelpub.com/novel/*/chapter-*
// @match		https://www.lightnovelworld.com/novel/*/chapter-*
// @icon		https://www.google.com/s2/favicons?sz=64&domain=webnovelpub.com
// @grant		none
// @license		MIT
// @namespace https://greasyfork.org/users/4493
// @downloadURL https://update.greasyfork.org/scripts/464575/webnovelpublightnovelworld%20banner%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/464575/webnovelpublightnovelworld%20banner%20remover.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function getAllElements(element) {
		var toDelete = Array.from(document.querySelectorAll(element));
		if (toDelete) {
			return toDelete;
		} else {
			return 0;
		}
	}

	function deleteNuisances() {
        var i = 0;
		var toDelete = getAllElements(".container");
		if (toDelete) {
			for (i = 0; i < toDelete.length; i++) {
				toDelete[i].remove();
			}
		}

		toDelete = getAllElements(".flex_row");
		if (toDelete) {
			for (i = 0; i < toDelete.length; i++) {
				toDelete[i].parentElement.remove();
			}
		}
	}

	function stopTimer() {
		window.clearTimeout(_timer)
	}

	var _timer = window.setInterval(deleteNuisances, 50)
	//stop the timer after 5 seconds
	window.setTimeout(stopTimer, 5000)


})();