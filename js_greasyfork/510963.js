// ==UserScript==
// @name         Search Engine Replacement
// @description  Replace the duckduckgo search engine with any other search engine by providing the URL
// @author       SijosxStudio
// @author       http://tinyurl.com/BuySijosxStudioCoffee
// @version      1.1
// @match        *://*/*
// @grant        none
// @inject-into  auto
// @run-at		 document-start
// @namespace https://greasyfork.org/users/1375139
// @downloadURL https://update.greasyfork.org/scripts/510963/Search%20Engine%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/510963/Search%20Engine%20Replacement.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const searchEngineURL = "https://startpage.com/search";

	if (window.location.href.search("duckduckgo") >= 0) {
		window.location.href = searchEngineURL + window.location.search;
	}
})();
