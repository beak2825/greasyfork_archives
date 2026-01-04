// ==UserScript==
// @name				Google Analytics Opt-out Add-on (johanb)
// @description		Tells the Google Analytics JavaScript not to send information to Google Analytics.
// @version				1.1
// @author				Google
// @match				http://*/*
// @match				https://*/*
// @run-at				document-start
// @grant				unsafeWindow
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/406699/Google%20Analytics%20Opt-out%20Add-on%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406699/Google%20Analytics%20Opt-out%20Add-on%20%28johanb%29.meta.js
// ==/UserScript==

( function () {
	'use strict';

	unsafeWindow._gaUserPrefs = {
		ioo() {
			return true;
		}
	}
} )();
