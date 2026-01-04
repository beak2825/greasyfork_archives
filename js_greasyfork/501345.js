// ==UserScript==
// @name         PostgreSQL Doc Title Shortener
// @namespace    https://xtexx.eu.org/
// @version      0.1.1
// @description  Make the title of PostgreSQL Documentation shorter!
// @author       xtex
// @match        https://www.postgresql.org/docs/*
// @icon         https://www.postgresql.org/favicon.ico
// @grant        none
// @run-at document-body
// @noframes
// @supportURL   https://codeberg.org/xtex/gadgets/issues
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/501345/PostgreSQL%20Doc%20Title%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/501345/PostgreSQL%20Doc%20Title%20Shortener.meta.js
// ==/UserScript==

(function () {
	'use strict';

	if (document.title.startsWith('PostgreSQL: Documentation: ')) {
		document.title = document.title
			.replace(/^PostgreSQL: Documentation: \d+:\s*/, 'PGDoc: ')
			.replace('PGDoc: Chapter', 'PGDoc:');
	}
})();
