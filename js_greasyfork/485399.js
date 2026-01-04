// ==UserScript==
// @name           Royal Road: Add Word Count to Statistics Section
// @namespace      https://github.com/w4tchdoge
// @version        1.1.0-20250611_121836
// @description    Adds the word count of a fiction (taken from the information tooltip in the Pages statistic) as it's own statistic
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://*.royalroad.com/fiction/*
// @exclude        *://*.royalroad.com/fiction/*/*/chapter/*
// @license        AGPL-3.0-or-later
// @run-at         document-start
// @history        1.1.0 — Add word count next to chapter count in the ToC header bar thing
// @history        1.0.0 — Initial release
// @downloadURL https://update.greasyfork.org/scripts/485399/Royal%20Road%3A%20Add%20Word%20Count%20to%20Statistics%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/485399/Royal%20Road%3A%20Add%20Word%20Count%20to%20Statistics%20Section.meta.js
// ==/UserScript==

(async function () {
	`use strict`;

	// modified from https://stackoverflow.com/a/61511955/11750206
	function waitForElm(selector, search_root = document) {
		return new Promise(resolve => {
			if (search_root.querySelector(selector)) {
				return resolve(search_root.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (search_root.querySelector(selector)) {
					observer.disconnect();
					resolve(search_root.querySelector(selector));
				}
			});

			// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		});
	}

	// wait for fic info section to load in
	const ficinfo = await waitForElm(`div.fiction-info`);

	// Get the element which contains the word "Pages" and which also contains the word count in an informational tooltip
	const statsPage_pages_elem = ficinfo.querySelector(`.fiction-stats .stats-content .list-unstyled li:has(> i)`);

	// Get Word Count
	const word_count_str = statsPage_pages_elem.querySelector(`i`).getAttribute(`data-content`).replace(/.*calculated from (.*) words./gmi, `$1`);
	console.log(`
RR WORD COUNT SCRIPT
WORD COUNT: ${word_count_str}`);

	// Make the "Heading" element that describes the data below it. i.e. it says "Words"
	const elm_wordcount_title = (() => {
		let outelm = Object.assign(document.createElement(`li`), {
			id: `userscript-words-title`,
			innerHTML: `Words :`
		});

		// Add the bold and uppercase classes to make it look like the other stats page entries
		outelm.classList.add(`bold`, `uppercase`);

		return outelm;
	})();

	// Make the "Data" element that has the actual data. i.e. it says the word count
	const elm_wordcount_data = (() => {
		let outelm = Object.assign(document.createElement(`li`), {
			id: `userscript-words-data`,
			innerHTML: `${word_count_str}`
		});

		// Add the bold and uppercase classes to make it look like the other stats page entries
		outelm.classList.add(`bold`, `uppercase`, `font-red-sunglo`);

		return outelm;
	})();

	// Add the word count elements before the page count elements
	statsPage_pages_elem.before(elm_wordcount_title, elm_wordcount_data);

	const tocbar_ch_cnt = (() => {
		const tocbar = ficinfo.querySelector(`div.portlet > .portlet-title:has(> .caption > a#toc)`);
		const xpath = `.//*[contains(concat(" ",normalize-space(@class)," ")," actions ")]/span[contains(normalize-space(),"Chapter")]`;
		const chcntpar = document.evaluate(xpath, tocbar, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		return chcntpar;
	})();

	const tocbar_wc = (() => {
		let base_elm = tocbar_ch_cnt.cloneNode(true);
		base_elm.textContent = `${word_count_str} Words`;
		base_elm.style.marginRight = `0.25em`;
		return base_elm;
	})();

	tocbar_ch_cnt.after(tocbar_wc);
})();