// ==UserScript==
// @name         DAZ3D Newsletter Popup Killer
// @namespace    https://levicki.net/
// @version      1.0
// @description  Removes monthly nagging to subscribe for users that are not logged in
// @author       Igor Levicki
// @match        *://www.daz3d.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423211/DAZ3D%20Newsletter%20Popup%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/423211/DAZ3D%20Newsletter%20Popup%20Killer.meta.js
// ==/UserScript==

(function() {
	'use strict';
	if (!document.cookie.split('; ').find(row => row.startsWith('popupDismissed'))) {
		let d = new Date();
		d.setFullYear(d.getFullYear() + 100);
		document.cookie = 'popupDismissed=true; expires=' + d.toUTCString() + '; path=/';
		location.reload(true);
	}
})();