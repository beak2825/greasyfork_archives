// ==UserScript==
// @name         Cookie Clicker Hack
// @namespace    *://*.tampermonkey.net/*
// @version      0.1
// @description  Get infinite cookies!
// @author      adam
// @match       http://evolutionism.ro/cookie-clicker-unblocked/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465956/Cookie%20Clicker%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/465956/Cookie%20Clicker%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

	window.addEventListener("load", function () {
		Game.earn(999999999999999999999999999999);
	}, false);
})();
