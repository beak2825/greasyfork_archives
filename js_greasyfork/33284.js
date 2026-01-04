// ==UserScript==
// @name        Fanatical skip age confirmation
// @description Removes the age verification prompt on Fanatical
// @namespace   bundlestars
// @match       *://*.fanatical.com/*
// @version     2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/33284/Fanatical%20skip%20age%20confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/33284/Fanatical%20skip%20age%20confirmation.meta.js
// ==/UserScript==

(function () {
	"use strict";

	try {
		localStorage.setItem("bsageGating", '{"success":true}');
	} catch (ignore) {}
})();
