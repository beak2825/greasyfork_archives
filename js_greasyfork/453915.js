// ==UserScript==
// @name         Google Reject All
// @namespace    GoogleReject
// @version      1.0
// @description  Automatically clicks the Reject All button on Google's prompt for cookies and advertising.
// @author       BoffinBrain
// @license      MIT
// @match        https://consent.google.com/m*
// @icon         https://google.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453915/Google%20Reject%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/453915/Google%20Reject%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var btn = document.querySelector('[aria-label="Reject all"]');
	if (btn) btn.click();
})();
