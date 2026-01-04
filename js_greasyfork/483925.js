// ==UserScript==
// @name           Royal Road: Follow List in Top Nav Bar
// @namespace      https://github.com/w4tchdoge
// @version        1.1.1-20240712_174213
// @description    Add a button to go to your Follow List next to the notification bell in the top navigation bar
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://*.royalroad.com/*
// @run-at         document-start
// @license        AGPL-3.0-or-later
// @history        1.1.1 — Only add the follow list icon to the top nav bar when the user is logged in
// @history        1.1.0 — Have script wait only until the notification element exists as opposed to waiting until everything loaded
// @history        1.0.1 — Change padding values to make it more aesthetically pleasing
// @history        1.0.0 — Initial userscript creation
// @downloadURL https://update.greasyfork.org/scripts/483925/Royal%20Road%3A%20Follow%20List%20in%20Top%20Nav%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/483925/Royal%20Road%3A%20Follow%20List%20in%20Top%20Nav%20Bar.meta.js
// ==/UserScript==

(async function () {
	`use strict`;

	// from https://stackoverflow.com/a/61511955/11750206
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

	// Wait for page header to load
	const page_header = await waitForElm(`.page-header-top`);
	// Get login state; true is logged in
	console.log(`
Royal Road Follow List in Top Nav Bar UserScript
------------------------
Checking Login Status`
	);
	const login_state = (function () {
		try {
			const login_state = page_header.querySelectorAll(`a[href*="account/login"]`).length;
			return ((login_state > 0 == false) ? true : false);
		} catch (error) {
			return false;
		}
	})();
	// console.log(page_header, login_state);
	// console.log(login_state);

	// Run the rest of the script only when logged in
	if (login_state == true) {
		console.log(`
Royal Road Follow List in Top Nav Bar UserScript
------------------------
User is Logged In
Running the rest of the UserScript`
		);
		// Create a "Follow List" element that is to go in the top nav bar next to the notification bell
		const navBar_follow_list_main = Object.assign(document.createElement(`li`), {
			id: `userscript-navbutton-followlist-main`,
			className: `dropdown`,
			innerHTML: `<a href="/my/follows" class="dropdown-toggle"><i class="fas fa-bookmark" id="userscript-navbutton-followlist-icon"></i></a>`
		});

		// Code for changing padding based on media query modified from example at https://www.w3schools.com/howto/howto_js_media_queries.asp
		// Create function to change padding
		function PaddingChange(media_query) {
			if (media_query.matches) {
				navBar_follow_list_main.querySelector(`a`).style.padding = `17px 6px 10px 2px`;
			} else {
				navBar_follow_list_main.querySelector(`a`).style.padding = `17px 8px 10px 6px`;
			}
		}

		// Create media query used to trigger PaddingChange
		const media_query = window.matchMedia(`(max-width: 767px)`);

		// Calling PaddingChange at script runtime
		PaddingChange(media_query);

		// Make script listen for changes in width that would trigger the media query
		media_query.addEventListener(`change`, function () {
			PaddingChange(media_query);
		});

		// Find the notification bell
		const navBar_notifications = await waitForElm(`#header_notification_bar`, page_header);

		// Put the "Follow List" element after the notification bell
		navBar_notifications.after(navBar_follow_list_main);

	} else { console.log(`\nRoyal Road Follow List in Top Nav Bar UserScript\n------------------------\nUser is Not Logged In\nHalting Script Execution`); }

})();
