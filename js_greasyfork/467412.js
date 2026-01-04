// ==UserScript==
// @name           AO3: Bookmarks Button on Main Navbar
// @namespace      https://github.com/w4tchdoge
// @version        1.0.5-20260102_220051
// @description    Adds a button called "Bookmarked Fics" to the main navbar (where the search bar is). Inspired by elli-lili-lunch's "Put Bookmarks Button on AO3 Home", which can be found at https://greasyfork.org/en/scripts/440048
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://archiveofourown.org/*
// @match          *://archiveofourown.gay/*
// @icon           https://archiveofourown.org/favicon.ico
// @run-at         document-idle
// @license        AGPL-3.0-or-later
// @history        1.0.5 — Some minor cleanup, details are: make initial bkmrks_btn clone the node instead of giving me a live node; make bkmrks_url, bkmrks_txt, and srch_bar consts because i'm not changing them in any way; change the single quotes used in the innerHTML of Object.assign to be double quotes so as to reflect the created element which uses double quotes; use .trim() on bkmrks_btn.textContent as a just-in-case
// @history        1.0.4 — Rollback 1.0.2 because I've realised that having this script running sidewide was the intention and I was a big dumb by removing that
// @history        1.0.3 — Modify the XPath to get the existing "My Bookmarks" button to accommodate the DOM element with id "greeting" not being a div element
// @history        1.0.2 — Modify the match rule so that it matches collections/*/works URLs as well; Add an exlude role so it doesn't work on works/*/bookmarks pages as it isn't designed to
// @history        1.0.1 — Change the displayed text to be the same as in the original bookmarks button from the user dropdown area
// @history        1.0.0 — Initial Release
// @downloadURL https://update.greasyfork.org/scripts/467412/AO3%3A%20Bookmarks%20Button%20on%20Main%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/467412/AO3%3A%20Bookmarks%20Button%20on%20Main%20Navbar.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	// Get the user bookmark page button from the user dropdown
	var bkmrks_btn = document.evaluate(`.//*[@id="greeting"]//li//a[text()[contains(.,'My Bookmarks')]]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.cloneNode(true);

	// Get the URL and displayed text from the user bookmarks button
	const
		bkmrks_url = bkmrks_btn.getAttribute(`href`),
		bkmrks_txt = bkmrks_btn.textContent.trim();

	// Create the new Bookmark button element
	var bkmrks_btn = Object.assign(document.createElement(`li`), {
		id: `navbar_bookmarks_button`,
		innerHTML: `<a href="${bkmrks_url}"><span class="dropdown-toggle">${bkmrks_txt}</span></a>`
	});

	// Find Search bar
	const srch_bar = document.querySelector(`ul.primary.navigation.actions li.search`);

	// Add created element before search bar
	srch_bar.before(bkmrks_btn);

})();
