// ==UserScript==
// @name           AO3: Clear User Tags
// @namespace      https://github.com/w4tchdoge
// @version        1.0.4-20260102_220051
// @description    Adds a button for clearing user added tags on a bookmark. Script does not work on bookmark pages (i.e. pages with the url archiveofourown.org/bookmarks/{BOOKMARK_ID}) as the #bookmark-form element is not present on page load. Script is guarenteed to work when editing a bookmark from a work page.
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://archiveofourown.org/works*
// @match          *://archiveofourown.org/bookmarks*/edit
// @match          *://archiveofourown.gay/works*
// @match          *://archiveofourown.gay/bookmarks*/edit
// @icon           https://archiveofourown.org/favicon.ico
// @license        AGPL-3.0-or-later
// @history        1.0.4 — Make script work on bookmark pages. Replace usage of var with const or let
// @downloadURL https://update.greasyfork.org/scripts/467410/AO3%3A%20Clear%20User%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/467410/AO3%3A%20Clear%20User%20Tags.meta.js
// ==/UserScript==

(function () {
	`use strict`;
	/*
	<TODO>
	- Add a user definable list of whitelisted tags

	</TODO>
	*/

	// Check if bookmark form exists
	if (document.querySelector(`#bookmark-form`)) {

		// define main element to use with all subsequent querySelector operations
		const main = document.querySelector(`#main`);

		// Get element in bookmark form to append button to
		const
			yourTags_xp = `.//div[@id="main"]//div[@id="bookmark-form"]//dt/label[text() = 'Your tags']`,
			yourTags_elem = document.evaluate(yourTags_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

		// Create button element
		const clearTags_btn_elem = Object.assign(document.createElement(`label`), {
			id: `clearUserTags_elem`,
			className: `actions`,
			style: `font-size: 0.85em`,
			innerHTML: `<a id='clearUserTags_btn'>Clear User Tags</a>`
		});

		// Append button element
		yourTags_elem.after(clearTags_btn_elem);

		// Select the parent dt element to which the button will be a child of
		const
			yourTags_parent_dt_xp = `.//div[@id="main"]//div[@id="bookmark-form"]//dt[./label[text() = 'Your tags']]`,
			yourTags_parent_dt_elem = document.evaluate(yourTags_parent_dt_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;;

		// Change the display style of the parent dt of the yourTags_elems to contents
		yourTags_parent_dt_elem.style.display = `contents`;

		// Add click listener to clearTags_btn_elem
		clearTags_btn_elem.addEventListener(`click`, clearTags_func);

		// Define var to indicate whether user tags exist
		let UserTagsExist, UserTagsNodeList;

		// Check if user tags exist
		if (main.querySelectorAll(`div#main div#bookmark-form ul.autocomplete > li.added.tag`).length == 0) {
			// assign false when user tags dont exist
			UserTagsExist = false;
		}
		else if (!(main.querySelectorAll(`div#main div#bookmark-form ul.autocomplete > li.added.tag`).length == 0)) {
			// assign true when user tags do exist
			UserTagsExist = true;
			// assign user tags to UserTagsNodeList
			UserTagsNodeList = main.querySelectorAll(`div#main div#bookmark-form ul.autocomplete > li.added.tag`);
		}

		// Define function to be executed when clearTags_btn_elem is clicked
		function clearTags_func() {

			// Check if UserTagsExist is true or false
			if (!UserTagsExist) { // if User Tags do not exist

				// Console log and alert user that there are no tags to be cleared
				console.log(`
AO3 Clear User Tags UserScript – Log
No user tags to clear`
				);
				alert(`No User Tags to Clear`);

			}
			else if (UserTagsExist) { // if User Tags do exist

				// Add Tag Names to an array
				const tagNames_arr = Array.from(UserTagsNodeList).map(x => x.textContent.trim().replace(/\s×/, ``));

				// Confirm removal of user tags
				confirm(`Confirm the removal of the following user tags from your bookmark:
${tagNames_arr.join(`, `)}`
				);

				// Remove user tags and log in the console
				UserTagsNodeList.forEach(function (x) {
					const remove_btn = x.querySelector(`span.delete > a`);
					console.log(`Removing Tag: "${x.textContent.trim().replace(/\s×/, ``)}"`);
					remove_btn.click();
				});

				// Alert the end user to the tags that have been removed
				alert(`The following user tags have been removed from your bookmark:
${tagNames_arr.join(`, `)}`
				);
			}
		}
	}
})();