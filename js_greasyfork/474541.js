// ==UserScript==
// @name           Worm Story Search: Link AO3 Stories to Work Page
// @namespace      https://github.com/w4tchdoge
// @version        1.0.2-20240823_161521
// @description    Changes the link of the story to go to the work page of the story on AO3 instead of the navigate page
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://wormstorysearch.com/*
// @match          *://www.wormstorysearch.com/*
// @icon           http://wormstorysearch.com/favicon.png
// @run-at         document-idle
// @license        AGPL-3.0-or-later
// @history        1.0.2 — Remove the `if (el.href.includes('archiveofourown'))` in favour of moving the check to the selector of `storyELM.querySelectorAll`
// @history        1.0.1 — Fix script replacing non-AO3 links in the blue tag boxes
// @history        1.0.0 — Initial Release
// @downloadURL https://update.greasyfork.org/scripts/474541/Worm%20Story%20Search%3A%20Link%20AO3%20Stories%20to%20Work%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/474541/Worm%20Story%20Search%3A%20Link%20AO3%20Stories%20to%20Work%20Page.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	// Get Table Rows
	const table_rows = document.querySelector('#stories-searchable-table tbody.rows');

	// Get Array of Stories
	const stories_arr = Array.from(table_rows.children);

	// Iterate on the array of Stories
	stories_arr.forEach((storyELM) => {

		// Try to get the blue box next to the title that says AO3
		const AO3_tag = (() => {
			const xpath = `.//td[contains(concat(" ",normalize-space(@class)," ")," title ")]//a[contains(@href,"archiveofourown.org")]`;
			const out_elm = document.evaluate(xpath, storyELM, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			return out_elm;
		})();

		if (Boolean(AO3_tag)) { // Run only if said blue box exists
			// Regex for extracting work URL without specific chapter
			const re_wu = /(^https?:\/\/)(.*\.)?(archiveofourown\.org)(.*?)(\/works\/\d+)\/?.*$/gmi;

			// Get the AO3 link and all extraneous parts of the URL, leaving you with a URL in the format https://archiveofourown.org/works/{WORK_ID}
			const AO3_link = AO3_tag.getAttribute('href').replace(re_wu, '$1$3$5');

			// Replace all instances of old AO3 URL with the new one
			Array.from(storyELM.querySelectorAll('td.title a[data-track][href*="archiveofourown.org"]')).forEach((el) => {
				el.href = AO3_link;
			});

			// Make the title link also go to the AO3 work instead of SB or any other source
			storyELM.querySelector('td.title a[data-track]').href = AO3_link;

			// Debug line of code, you can ignore it
			// console.log(`${storyELM.querySelector('td.title a[data-track]').href} - ${storyELM.querySelector('td.title a[data-track]').textContent}`);
		}
	});

})();