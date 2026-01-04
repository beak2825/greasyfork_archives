// ==UserScript==
// @name        Elster mobile fix
// @namespace   Violentmonkey Scripts
// @match       https://www.elster.de/eportal/login/npa
// @grant       none
// @version     1.0
// @author      -
// @description 1/1/2023, 3:41:25 AM
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/457424/Elster%20mobile%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/457424/Elster%20mobile%20fix.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const login = document.getElementById("npaButtonStartLogin");
	const url = login.dataset.url;

	if (!url.startsWith("eid://")) {
		login.dataset.url = url.replace(/^https?/u, "eid");
	}
})();
