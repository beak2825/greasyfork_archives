// ==UserScript==
// @name         Skip age verification
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  We're all consenting adults here, skip the annoying age verification pages
// @author       You
// @match        *://*.pornhub.com/*
// @icon         https://icons.duckduckgo.com/ip2/pornhub.com.ico
// @grant        none
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/476394/Skip%20age%20verification.user.js
// @updateURL https://update.greasyfork.org/scripts/476394/Skip%20age%20verification.meta.js
// ==/UserScript==

(function() {
    'use strict';

	// Works for Pornhub, but let me know if you need other sites
	const button = document.querySelector('#modalWrapMTubes > div > div > button');
	if(button)button.click();
})();