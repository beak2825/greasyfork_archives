// ==UserScript==
// @name        Something Awful Dark Mode Smilies
// @namespace   https://forums.somethingawful.com/
// @description Wraps SA smilies in a light background span to allow text smilies to be seen in dark mode
// @match       https://forums.somethingawful.com/showthread.php
// @grant       GM_openInTab
// @version     1.1.1
// @author      Althalin
// @run-at      document-idle
// @icon        http://forums.somethingawful.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/431428/Something%20Awful%20Dark%20Mode%20Smilies.user.js
// @updateURL https://update.greasyfork.org/scripts/431428/Something%20Awful%20Dark%20Mode%20Smilies.meta.js
// ==/UserScript==

var Util = {
	/**
	 * Initialise the page, find smilies
	 */
	initialise: function(target) {
		// Select images from the page
		var images = document.querySelectorAll('td.postbody img');

		for (var index in images) {
			var image = images[index];

			if (typeof image !== 'object') continue;

			var src = image.getAttribute('src');

			// Only affect smilies:
			if (/somethingawful[.]com[/](images|safs[/]smilies|forumsystem)[/]/.test(src)) {
				let placeholder = document.createElement('span');
        placeholder.setAttribute('style', 'background-color:WhiteSmoke !important');
                
        image.parentNode.replaceChild(placeholder, image);
        
        placeholder.appendChild(image)
			}
		}
  }
}

try {
	// Redirect the page:
	if (document.querySelectorAll('meta[http-equiv=refresh]').length) {
		var rule = document.querySelectorAll('meta[http-equiv=refresh]')[0].getAttribute('content');

		if (/URL=(.+)$/.test(rule)) {
			window.location = /URL=(.+)$/.exec(rule)[1];
		}
	}

	// Jump to appropriate place on page:
	else if (!!window.location.hash && document.querySelectorAll(window.location.hash).length) {
		Util.initialise(document.querySelectorAll(window.location.hash)[0]);
	}

	// Load the page normally:
	else {
		Util.initialise();
	}
}

catch (e) {
	console.log("Exception: " + e.name + " Message: " + e.message);
}