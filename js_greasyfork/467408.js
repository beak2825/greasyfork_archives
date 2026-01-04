// ==UserScript==
// @name           AO3: Visible Full-page Index Button
// @namespace      https://github.com/w4tchdoge
// @version        1.3.5-20260102_220051
// @description    Moves or copies (setting is user configurable) the "Full-page index" button to the main work navigation bar for ease of access
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://archiveofourown.org/*chapters/*
// @match          *://archiveofourown.org/*works/*
// @match          *://archiveofourown.gay/*chapters/*
// @match          *://archiveofourown.gay/*works/*
// @exclude        *://archiveofourown.org/*works/*/bookmarks
// @exclude        *://archiveofourown.org/*works/*/navigate
// @exclude        *://archiveofourown.gay/*works/*/bookmarks
// @exclude        *://archiveofourown.gay/*works/*/navigate
// @icon           https://archiveofourown.org/favicon.ico
// @license        AGPL-3.0-or-later
// @history        1.3.5 — Change ini_fpi_btn to use querySelector with a hopefully more reliable CSS selector since the XPath broke
// @history        1.3.4 — Add @exclude rule so that userscript doesn't run on /navigate pages. Add match rule so that userscript runs on chaptes pages that don't include "works" in the URL
// @history        1.3.3 — Minor cleanup
// @history        1.3.2 — Modify the match rule so that it matches collections/*/works URLs as well; Add an exlude role so it doesn't work on works/*/bookmarks pages as it isn't designed to
// @downloadURL https://update.greasyfork.org/scripts/467408/AO3%3A%20Visible%20Full-page%20Index%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/467408/AO3%3A%20Visible%20Full-page%20Index%20Button.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	/* IMPORTANT – Change this value depending on whether or not you want the initial "Full-page index" button remove from the "Chapter Index" dropdown – IMPORTANT */
	const remove_ini_fpi_btn = true;

	/* IMPORTANT- Change this value to false if you do not want a "Full-page index" button when viewing an entire work */
	const enti_wrk_fpi_btn = true;


	// Only execute the rest of the script if the "Chapter Index" element exists (this is so it doesn't throw an error in the console when viewing an entire work or a single chapter work)
	if (document.querySelector(`ul.work.navigation.actions li[class="chapter"]`) != null) {

		// Find the "Chapter Index" button on the main work navbar
		const ch_indx_btn = document.querySelector(`ul.work.navigation.actions li[class="chapter"]`);

		// Get the "Full-page index" button using XPATH
		const ini_fpi_btn = ch_indx_btn.querySelector(`#chapter_index > li:has(> a[href$="navigate"])`);

		// Get the href attribute of the "Full-page index" button that normally lives within the "Chapter Index" dropdown
		const fpi_href = ini_fpi_btn.querySelector(`a`).getAttribute(`href`);

		// Create a slightly modified copy of the "Full-page index" button element
		const fpi_button = Object.assign(document.createElement(`a`), {
			id: `navbar_full_page_index_btn`,
			href: fpi_href,
			innerHTML: `Full-page index`
		});

		// Append the modified copy to the "Chapter Index" button element such that it appears to the right of it in the main work navbar
		ch_indx_btn.append(fpi_button);

		// Code to run if the original "Full-page index" button is to be removed
		if (remove_ini_fpi_btn == true) {
			// Remove the "Full-page index" button from the "Chapter Index" dropdown if remove_ini_fpi_btn is set to true
			ini_fpi_btn.remove();

			// Remove the padding-right on the "Go" button in the "Chapter Index" dropdown
			document.querySelector(`ul#chapter_index select#selected_id+span`).setAttribute(`style`, `padding-right: 0 !important;`);
		}
	}

	// Add a "Full-page index" button when viewing an entire work (enti_wrk_fpi_btn must be set to true)
	if (document.querySelector(`ul.work.navigation.actions li.chapter.bychapter`) != null && enti_wrk_fpi_btn) {

		// Find the "Chapter by Chapter" button on the main work navbar
		const ch_by_ch_btn = document.querySelector(`ul.work.navigation.actions li.chapter.bychapter`);

		// Construct href for the "Full-page Index" button
		const fpi_href = (function () {
			const
				curr_page_url = new URL(window.location),
				fpi_href = `${curr_page_url.pathname}/navigate`;
			return fpi_href;
		})();

		// Create the "Full-page index" button element
		const fpi_button = Object.assign(document.createElement(`a`), {
			id: `navbar_full_page_index_btn`,
			href: fpi_href,
			style: `margin-left: 0.3em`,
			innerHTML: `Full-page index`
		});

		// Append the "Full-page index" button to the "Chapter by Chapter" button
		ch_by_ch_btn.append(fpi_button);
	}

})();
