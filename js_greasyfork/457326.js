// ==UserScript==
// @name        reddit: hide email banner
// @namespace   94k5v95227tm3x3obar9
// @match       https://*.reddit.com/*
// @grant       none
// @version     1.0
// @description Stops new reddit from constantly asking for your email address
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/457326/reddit%3A%20hide%20email%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/457326/reddit%3A%20hide%20email%20banner.meta.js
// ==/UserScript==

(function () {
	"use strict";

	try {
		localStorage.setItem("email-collection-reprompt-store", Number.MAX_SAFE_INTEGER);
		localStorage.removeItem("email.verification_prompt");
	} catch {}
})();
