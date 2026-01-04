// ==UserScript==
// @name         Reddit to Teddit
// @namespace    fke9fgjew89gjwe89
// @version      0.2
// @description  Redirect reddit to teddit
// @author       anon
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421734/Reddit%20to%20Teddit.user.js
// @updateURL https://update.greasyfork.org/scripts/421734/Reddit%20to%20Teddit.meta.js
// ==/UserScript==

(function () {
	'use strict';
	top.location.hostname = "teddit.net";
})();