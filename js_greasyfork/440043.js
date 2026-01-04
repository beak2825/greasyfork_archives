// ==UserScript==
// @name        Zoom redirect to web client
// @namespace   https://github.dev/jblz/user-script-zoom-webclient
// @include     /^https:\/\/([[a-zA-z\d-]+\.)?zoom.us\/[js]\/\d+/
// @version     1.0.3
// @author      jblz
// @description 2/14/2022, 2:21:23 PM
// @license     gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/440043/Zoom%20redirect%20to%20web%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/440043/Zoom%20redirect%20to%20web%20client.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
	const { origin, pathname, search } = document.location;
	const [_, verb, meetingID] = pathname.match( /^\/([js])\/(\d+)/i );
	if ( ! meetingID ) {
		return;
	}
	document.location = `${ origin }/wc/` +
		`${ verb === 's' ? 'start' : 'join' }/` +
		encodeURIComponent( meetingID ) +
		search || '';
})();
