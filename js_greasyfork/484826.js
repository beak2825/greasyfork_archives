// ==UserScript==
// @name         NZXT
// @namespace    https://nzxt.com/
// @match        https://nzxt.com/assets/*

// @version      1.0
// @description  High resolution photo
// @author       Mykola B.
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484826/NZXT.user.js
// @updateURL https://update.greasyfork.org/scripts/484826/NZXT.meta.js
// ==/UserScript==

(function() {
    'use strict';
	if ( location.search !==""){
		location.href=location.href.replace(location.search, "");
	}
})();