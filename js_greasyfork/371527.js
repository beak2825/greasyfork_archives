// ==UserScript==
// @author			Rainbow-Spike
// @version			1.0
// @name			LJ AccessKeys
// @description			Add an accesskey S to Submit button in LJ editor (hit twice for work)
// @include			https://www.livejournal.com/editjournal.bml*
// @icon			https://www.google.com/s2/favicons?domain=livejournal.com
// @grant			none
// @run-at			document-end
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/371527/LJ%20AccessKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/371527/LJ%20AccessKeys.meta.js
// ==/UserScript==

function AccessKeys() {
	var butt = document.getElementsByName("action:update");
	for (var i = 0; i < butt.length; i++) {
		butt[i].accessKey = "s";
	};
};

setTimeout(AccessKeys,2000);
