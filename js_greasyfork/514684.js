// ==UserScript==
// @name           AO3: Go To Latest Chapter
// @namespace      https://github.com/w4tchdoge
// @version        2.0.0-20260102_220051
// @description    Adds a link to the chapter navigation bar to go to the latest chapter of a work. Alternative method is to add `/latest` to the end of an AO3 work URL. e.g. https://archiveofourown.org/works/{AO3_WORK_ID}/chapters/{AO3_CHAPTER_ID}/latest
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://archiveofourown.org/*works/*
// @match          *://archiveofourown.org/*works/*/latest
// @match          *://archiveofourown.org/*works/*/nav
// @match          *://archiveofourown.org/*works/*/nav/*
// @match          *://archiveofourown.gay/*works/*
// @match          *://archiveofourown.gay/*works/*/latest
// @match          *://archiveofourown.gay/*works/*/nav
// @match          *://archiveofourown.gay/*works/*/nav/*
// @exclude        *://archiveofourown.org/*works/*/bookmarks
// @exclude        *://archiveofourown.org/*works/*/navigate
// @exclude        *://archiveofourown.gay/*works/*/bookmarks
// @exclude        *://archiveofourown.gay/*works/*/navigate
// @license        AGPL-3.0-or-later
// @run-at         document-start
// @history        2.0.0 — Add features to take you to the nav page or a specific chapter of the work using `/nav` and `/nav/{number}` respectively
// @history        1.1.1 — Make the "Latest ↠" button automatically take you to the start of the chapter text instead of the start of the webpage, making it consistent with the behaviour of the next & previous chapter buttons
// @history        1.1.0 — Use the chapter index dropdown to get the latest chapter ID when already viewing a multi chapter work instead of making an fetch request to the work's /navigate page
// @history        1.0.0 — Move the `latest_url` stuff to a function. Comment the code to the point where hopefully someone that doesn't know JS can understand what it's doing. Clean up old commented code that's no longer used. Add a description
// @history        0.0.1 — Initial commit
// @downloadURL https://update.greasyfork.org/scripts/514684/AO3%3A%20Go%20To%20Latest%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/514684/AO3%3A%20Go%20To%20Latest%20Chapter.meta.js
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

	// Gets URL of the latest chapter of a work
	// Input is the work ID as a string
	// Output is an array of URL objects of the the chapter URLs of the work
	async function getChapterURLsArr(ao3_work_id, base_url = `https://archiveofourown.org`) {
		// Define the URL to be fetched
		const fetch_url = `https://archiveofourown.org/works/${ao3_work_id}/navigate`;
		// Fetch the URL as UTF-8 HTML and wait for the response from the server
		const fetch_resp = await fetch(fetch_url, { headers: { 'Content-Type': 'text/html; charset=utf-8', } });
		// Save the Response stream as a UTF-8 string
		const resp_text = await fetch_resp.text();

		// Create a new DOM parser
		const html_parser = new DOMParser();
		// Parse the response text as HTML and saves the output
		const html = html_parser.parseFromString(resp_text, `text/html`);

		// Search the parsed HTML of the navigate page for all links that go to a chapter, and create an "ordered" array containing all of the aforementioned links as URL objects
		const chapter_urls_arr = Array.from(html.querySelectorAll(`#main .chapter.index.group > li > a[href^="/works"]`))
			.map(e => new URL(`${e.getAttribute(`href`)}#workskin`, base_url));

		return chapter_urls_arr;
	}


	// Get current page url as a URL object
	const curr_url = new URL(window.location);
	const curr_url_domain = curr_url.hostname;

	// Get AO3 work ID
	const work_id = (() => {

		// Split path of current URL on all forward slashes
		const pathname_segments = curr_url.pathname.split(`/`);
		// Get the index of the last element which is a string equal to 'works'
		// Add 1 to it to get the index of the work ID
		const wid_index = (pathname_segments.findLastIndex(elm => elm === `works`)) + 1;
		// Get work ID using the above index
		const wid = pathname_segments.at(wid_index);

		return wid;

	})();

	const url_latest = curr_url.pathname.split(`/`).at(-1).toString().toLowerCase() == `latest`;
	const url_nav_end = curr_url.pathname.split(`/`).at(-1).toString().toLowerCase() == `nav`;
	const url_nav = (() => {
		const segments = curr_url.pathname.split(`/`);
		const nav_seg = segments.at(-2).toString().toLowerCase() == `nav`;
		const nav_num = Number.isInteger(parseInt(segments.at(-1)));
		if (nav_seg && nav_num) { return true; } else { return false; }
	})();


	// Check if URL ends in latest
	if (url_latest) { // If URL ends in latest

		// Stop further loading of webpage
		window.stop();

		// Get URL for the latest chapter
		const latest_url = (await getChapterURLsArr(work_id, `https://${curr_url_domain}`)).at(-1);

		// console.log(`latest`, curr_url, work_id, latest_url);

		// Redirect to latest chapter
		window.location.replace(latest_url);

	}
	if (url_nav_end) {

		window.stop();
		window.location.replace(`https://${curr_url_domain}/works/${work_id}/navigate`);

	}
	if (url_nav) {

		window.stop();

		const work_chapter_urls = await getChapterURLsArr(work_id, `https://${curr_url_domain}`);

		const nav_idx = (() => {
			const usr_nav_num = parseInt(curr_url.pathname.split(`/`).at(-1));
			if (usr_nav_num < 1) {
				throw new Error("Please pass a value greater than 0 for the chapter you are attempting to navigate to");
			}
			if (usr_nav_num > work_chapter_urls.length) {
				throw new Error("Please pass a value less than or equal to the number of published chapters for the chapter you are attempting to navigate to");
			}
			const idx = usr_nav_num - 1;
			return idx;
		})();
		const nav_url = work_chapter_urls.at(nav_idx);

		window.location.replace(nav_url);

	}
	if (!url_latest && !url_nav_end && !url_nav) {

		// Get the current page's hostname
		const curr_pg_hostname = (new URL(window.location)).hostname;

		// Wait for the main content of the webpage to be loaded into the DOM
		const main = await waitForElm(`#main`);

		// Get the navbar where all the chapter navigation buttons are
		const work_nav_actions = main.querySelector(`.work.navigation.actions`);

		// Check to see if this is the latest chapter by checking for the presense of the 'Next Chapter →' button
		if (work_nav_actions.querySelector(`.chapter.next`)) { // If not on latest chapter

			// Get latest chapter ID & current work ID from DOM
			const
				latest_ch_id = work_nav_actions.querySelector(`#chapter_index form select#selected_id > option:last-of-type`).getAttribute(`value`),
				curr_work_id = work_nav_actions.querySelector(`#chapter_index form`).getAttribute(`action`).split(`/`).filter(e => e).at(1);

			// Construct URL for the latest chapter
			const latest_url = new URL(`works/${curr_work_id}/chapters/${latest_ch_id}#workskin`, `https://${curr_pg_hostname}`);

			// Get next chapter elements
			const next_chapter_elm_arr = Array.from(main.querySelectorAll(`li`)).filter(elm => elm.textContent === `Next Chapter →`);

			// console.log(next_chapter_elm_arr);

			// Create latest chapter element using the next chapter element as a base
			const latest_chapter_elm = ((input_elm) => {

				// Clone the node so the original stays unmodified
				let base_elm = input_elm.cloneNode(true);

				// Add the latest class to the button
				base_elm.classList.add(`latest`);

				// Get the actual link element present in the main element
				let link = base_elm.querySelector(`a`);
				// Set the href of the link element to the pathname of the URL to the latest chapter
				link.setAttribute(`href`, latest_url.href.toString().replace(latest_url.origin, ``));
				// Set the text of the link to indicate the button goes to the latest chapter
				link.textContent = `Latest ↠`;

				return base_elm;

			})(next_chapter_elm_arr.at(0));

			// console.log(latest_chapter_elm);

			// Add latest chapter elm after the next chapter elms
			next_chapter_elm_arr.forEach(element => {
				// Clone the latest chapter element while adding it so it can be put in two separate places
				element.after(latest_chapter_elm.cloneNode(true));
			});

		} else { console.log(`\nYou are already on the latest chapter.`); } // If on latest chapter

	}

})();