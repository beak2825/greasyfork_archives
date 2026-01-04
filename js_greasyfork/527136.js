// ==UserScript==
// @name           w4tchdoge's AO3 Bookmark Maker
// @namespace      https://github.com/w4tchdoge
// @version        2.12.1-20250103_123810
// @description    Modified/Forked from "Ellililunch AO3 Bookmark Maker" (https://greasyfork.org/en/scripts/458631). Script is out-of-the-box setup to automatically add title, author, status, summary, and last read date to the description in an "collapsible" section so as to not clutter the bookmark.
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://archiveofourown.org/*chapters/*
// @match          *://archiveofourown.org/*works/*
// @exclude        *://archiveofourown.org/*works/*/bookmarks
// @exclude        *://archiveofourown.org/*works/*/navigate
// @exclude        *://archiveofourown.org/*works/*/latest
// @match          *://archiveofourown.org/series/*
// @match          *://archiveofourown.org/users/*/preferences*
// @icon           https://archiveofourown.org/favicon.ico
// @require        https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js
// @run-at         document-end
// @license        GNU GPLv3
// @history        2.12.1 — Fix BSP_conditional and TSP_conditional always being true because it was checking for `on_summary_page != null` instead of `on_summary_page == false`
// @history        2.12.0 — Add setting to toggle whether script always runs on any work page or only runs on the summary page of work
// @history        2.11.1 — Add an exclude rule for compatibility with my go to latest chapter userscript
// @history        2.11.0 — Add settings for automatically marking a bookmark as a rec, running autotag, and adding bookmark to collection(s)
// @history        2.10.2 — Have the canon AO3 word count autotag method fetch the tags from the tag search page instead of hardcoding them. Fallback to the hardcoded values when something in the fetch fails
// @history        2.10.1 — Restrict the userscript to `/users/*/preferences` pages instead of all `/users/*` pages
// @history        2.10.0 — Add four new variables to be used in `workInfo`: fform_tags_list_HTML, fform_tags_list_TXT, fform_tags_comma_HTML, and fform_tags_comma_TXT. These variables add the freeform/additional tags of a work into the bookmark in a collapsible <details> element. Additional details are provided in the Bookmark content configuration section
// @history        2.9.0 — Add functionality to switch between the original AutoTag implementation (https://greasyfork.org/en/scripts/467885/discussions/198028) and the implementation that uses the canonical AO3 `Wordcount: Over *` tags (https://greasyfork.org/en/scripts/467885/discussions/255399)
// @history        2.8.5 — Rename `series_works_summaries` to `series_works_titles_summaries` to indicate that it's functionality has been changed such that for series with more than 10 works it outputs just the title instead of the title and the summary, as the summaries for more than 10 works are unlikely to fit inside a bookmark
// @history        2.8.4 — Fix missing authors on Anonymous works
// @history        2.8.3 — Fix script erroring at series_works_summaries when series contains a work whose title is not a hyperlink (e.g. Mystery Works)
// @history        2.8.2 — Replace the old AutoTag functionality with a new one (https://greasyfork.org/en/scripts/467885/discussions/255399) with plans to add settings to switch between the two in 2.9.0
// @history        2.8.1 — Add @exclude rule so that userscript doesn't run on /navigate pages
// @history        2.8.0 — Refactor/rewrite the portions of the script related to exctracting all the information needed for the bookmark from the current page. Ensure the Summary Page button is added when reading a chapter from a page that does not include "works" in the URL (e.g. https://archiveofourown.org/chapters/141155299)
// @history        2.7.3 — Make bottom and top summary page appear when reading a chapter from a URL such as https://archiveofourown.org/chapters/142383091
// @history        2.7.2 — Update all the other presets to reflect changes made to the default preset
// @history        2.7.1 — Clarify how the 'relationships' variable in workInfo now functions, especially with regards to it's new functionality in series bookmarks
// @history        2.7.0 — Add all unique relationship tags in all the works on a series page to the series bookmark
// @history        2.6.3 — Fix some minor messups I made in 2.6.2 before they break something or the other
// @history        2.6.2 — Fix author_HTML only retrieving the first author in multi-author works/series
// @history        2.6.1 — Fixes incompatibilty with users's skins caused by not using cloneNode(true) when retrieving relationship tags and subsequently removing all classes from them. credit to @notdoingthateither on Greasy Fork for the fix
// @history        2.6.0 — Add a new default variable author_HTML that can be used in the workInfo customisation function. for more details about author_HTML please refer to line 1496
// @history        2.5.0 — Add toggle in the dropdown present on the user's preferences page for showing/not showing the AutoTag button when making/editing a bookmark
// @history        2.4.5 — Add exlude rule for pages listing bookmarks as the script isn't designed to run on those pages
// @history        2.4.4 — Add a fallback for retrieving the "Entire Work" button in case it's been modified but is still somewhat recognisable in the DOM
// @history        2.4.3 — Fix script not working on Firefox browsers due to a lack of support for the :has() CSS selector and a Firefox specific error caused by not using Optional Chaining
// @history        2.4.2 — Fix a bug where the script errored on single chapter works
// @history        2.4.1 — Add an option to have a version of the "Summary Page" button in the top nav buttons. Defaults to false
// @history        2.4.0 — Add an Auto Tag button that automatically adds the completion status and word count to the user tags area
// @history        2.3.0 — Fairly large reworks of series summaries which includes the addition of the series_works_summaries var (which only does anything when bookmarking a series) that can be used in workInfo to add the summaries of the works in the series to the series bookmark; Added moment.js as a library in case anyone wants to use it to set their own date var
// @history        2.2.2 — Fix a possible styling issue that may occur with the dropdown menu
// @history        2.2.1 — Fix Relationships subsection for works with no relationship tags by adding a "No Relationships" to the subsection when there are no relationship tags
// @history        2.2.0 — Add a 'relationships' var that can be used in workInfo to add the work's relationship tags to the bookmark. Default config now set to include said var in workInfo
// @history        2.1.2 — Replace the bottom entire work button with a summary page button that works better on large works
// @history        2.1.1 — Adjusted script execution condition to allow for works with no summary
// @history        2.1.0 — Tweaked the bookmarking process which should hopefully make it easier to configure. Also rewrote *some* of the code to hopefully make it better perfoming
// @history        2.0.9 — Add functionality to retrieve the ID of the work or series being bookmarked
// @history        2.0.8 — Make some if statements in the localStorage section more readable
// @history        2.0.7 — Fix bottomEntireWork not functioning because of the placement of the code responsible for putting the button there being inside an if statement that only executes on specific pages
// @history        2.0.6 — Fix even more localStorage issues, this time caused by my own incompetence
// @history        2.0.5 — Fixing localStorage stuff
// @history        2.0.4 — More summary related bugfixes
// @history        2.0.3 — Fix the script replacing an existing summary in the bookmark notes with 'undefined'
// @history        2.0.2 — Alert the user that their input for a new divider value has been accepted + Minor styling changes in the setting dropdown
// @history        2.0.1 — Fix if statements that used variables that needed to be true or false by using a function to convert the 'true' & 'false' strings from localStorage to booleans
// @history        2.0.0 — Implement localStorage for the majority of user settings. Presets must still be set via editing the script
// @history        1.0.0 — Initial Publishing to GresyFork
// @downloadURL https://update.greasyfork.org/scripts/527136/w4tchdoge%27s%20AO3%20Bookmark%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/527136/w4tchdoge%27s%20AO3%20Bookmark%20Maker.meta.js
// ==/UserScript==

/*
// THIS USERSCRIPT RELIES HEAVILY ON TEMPLATE LITERALS
// FOR INFORMATION ON WHETHER YOUR BROWSER IS COMPATIBLE WITH TEMPLATE LITERALS PLEASE VISIT THE FOLLOWING WEBPAGE
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#browser_compatibility
*/

// NOTICE TO NEW USERS
// Configuration area for the autogenerated portion of the bookmark at the bottom of the userscript
// Various settings that can be tweaked by the end user are accessible in a menu on your Preferences page:
// (https://archiveofourown.org/users/{YOUR_USERNAME}/preferences)
// IF YOU HAVE ANY QUESTIONS AT ALL DO NOT HESITATE TO PM ME ON GREASYFORK

(function () {

	const s_t = performance.now();

	console.log(`Starting w4BM userscript execution: ${performance.now() - s_t}ms`);

	/* Dictionary of "constants" that can be changed by the end user to affect how the script functions */
	let ini_settings_dict = {
		divider: `</details>\n\n`,
		autoPrivate: true,
		autoRecommend:false,
		autoAutoTag: true,
		autoCollections: ``,
		showAutoTagButton: true,
		bottomSummaryPage: true,
		topSummaryPage: false,
		simpleWorkSummary: false,
		FWS_asBlockquote: true,
		alwaysInjectBookmark: true,
		AutoTag_type: 1,
		splitSelect: 1,
	};

	/* EXPLANATION OF THE "CONSTANTS" THAT CAN BE CHANGED BY THE END USER

divider               : String which is used to indicate where the bookmark should be split in half


autoPrivate           : If true, automatically checks the checkbox to private the bookmark


showAutoTagButton     : If true, shows the "Auto Tag" button when bookmarking a work


bottomSummaryPage     : If true, checks if the current page is an entire work page or a work page that is not on the first chapter.
If the aforementioned checks are passed, Adds a "Summary Page" button to the bottom nav bar to easily navigate to a page where the summary exists so it can be picked up by the userscript.
This is done due to the fact that the last read date will not update when updating a bookmark from the latest chapter.


topSummaryPage        : If true, also adds a Summary Page button to the top nav bar next to the "Entire Work" button


simpleWorkSummary     : If true, uses the original method to retrieve the work summary (least hassle, but includes the 'Summary' heading element which some users may find annoying).
If false, retrieves the work summary in a way (which I call the fancy way) that allows more flexibility when customising newBookmarkNotes


FWS_asBlockquote      : If using the fancy work summary method, set whether you want to retrieve the summary as a blockquote.
For more information on the effects of changing simpleWorkSummary and FWS_asBlockquote, please look at where simpleWorkSummary is first used in the script, it should be around line 1308


AutoTag_type          : Determines how the AutoTag function works.
0 indicates it is using the original behaviour of the AutoTag function suggested by `oliver t` in https://greasyfork.org/en/scripts/467885/discussions/198028 that was present when AutoTag was first added to the userscript
1 indicates it is using the behaviour suggested by `prismbox` in https://greasyfork.org/en/scripts/467885/discussions/255399 where canonical AO3 Wordcount tags are used for the word count tagging


splitSelect           : splitSelect changes which half of bookmarkNotes your initial bookmark is supposed to live in.
Valid values are 0 and 1.

e.g.
If you want the final bookmark (after pasting of autogenerated text) to look like the below text (and have configured it as such at the bottom of the script):

{bookmarkNotes}
<hr />
{title} by {author}<br />
{AO3_status}<br />
{summary}<br />

Then you can set divider = '<hr />' and splitSelect = 0
What this does is it replaces anything AFTER the <hr /> with the autogenerated bookmark text you've defined at the bottom while keeping your own text (e.g. "@ Chapter 2" or "Chapter 8 ripped my heart out").

If you instead want something like the following:

{title} by {author}<br />
{AO3_status}<br />
{summary}<br />
<hr />
{bookmarkNotes}

Then you can set divider = '<hr />' and splitSelect = 1, which replaces everything BEFORE your bookmark notes.

Another way to explain it is that the script works by taking the current contents of your bookmark and splitting it into two pieces along a user defined "divider", thus creating an array. Depending on the way you want the bookmark to be structured, the part of the bookmark that you want to keep could be before the divider or after the divider. splitSelect lets you tell the script which half of the array contains the bit of the bookmark you want to keep. If it's the first half splitSelect is 0, if it's the last half splitSelect is 1.

	*/

	// from https://stackoverflow.com/a/1414175/11750206 ; used to convert the 'true' & 'false' strings in localStorage to actual booleans
	const stringToBoolean = (stringValue) => {
		switch (stringValue?.toLowerCase()?.trim()) {
			case "true":
			case "yes":
			case "1":
				return true;

			case "false":
			case "no":
			case "0":
			case null:
			case undefined:
				return false;

			default:
				return JSON.parse(stringValue);
		}
	};

	// Declare user-configurable variables
	let
		divider,
		autoPrivate,
		autoRecommend,
		autoAutoTag,
		autoCollections,
		showAutoTagButton,
		bottomSummaryPage,
		topSummaryPage,
		simpleWorkSummary,
		FWS_asBlockquote,
		alwaysInjectBookmark,
		AutoTag_type,
		splitSelect,
		workInfo;

	// localStorage stuff
	if (typeof Storage != `undefined`) { // If localStorage exists

		console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
localStorage exists`
		);


		switch (Boolean(localStorage.getItem(`w4BM_divider`))) {
			// Execute if statement only if w4BM_divider is not set in localStorage
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_divider' is not set in the localStorage
Now setting it to '${ini_settings_dict.divider.replace(/\n/gi, `\\n`).replace(/\t/gi, `\\t`).replace(/\r/gi, `\\r`)}'`
				);

				// set the divider in localStorage and current script execution to the default value
				// this will only happen on the first ever execution of the script, because this action only happens when:
				// a) localStorage exists
				// b) w4BM_divider does not exist in the localStorage
				divider = ini_settings_dict.divider;
				localStorage.setItem(`w4BM_divider`, ini_settings_dict.divider);

				break;

			// Execute if statement only if w4BM_divider is set in localStorage
			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_divider' IS SET in the localStorage`
				);

				divider = localStorage.getItem(`w4BM_divider`);

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_divider`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_autoPrivate`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoPrivate' is not set in the localStorage
Now setting it to '${ini_settings_dict.autoPrivate}'`
				);

				autoPrivate = ini_settings_dict.autoPrivate;
				localStorage.setItem(`w4BM_autoPrivate`, ini_settings_dict.autoPrivate);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoPrivate' IS SET in the localStorage`
				);

				autoPrivate = stringToBoolean(localStorage.getItem(`w4BM_autoPrivate`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_autoPrivate`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_autoRecommend`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoRecommend' is not set in the localStorage
Now setting it to '${ini_settings_dict.autoRecommend}'`
				);

				autoRecommend = ini_settings_dict.autoRecommend;
				localStorage.setItem(`w4BM_autoRecommend`, ini_settings_dict.autoRecommend);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoRecommend' IS SET in the localStorage`
				);

				autoRecommend = stringToBoolean(localStorage.getItem(`w4BM_autoRecommend`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_autoRecommend`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_autoAutoTag`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoAutoTag' is not set in the localStorage
Now setting it to '${ini_settings_dict.autoAutoTag}'`
				);

				autoAutoTag = ini_settings_dict.autoAutoTag;
				localStorage.setItem(`w4BM_autoAutoTag`, ini_settings_dict.autoAutoTag);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoAutoTag' IS SET in the localStorage`
				);

				autoAutoTag = stringToBoolean(localStorage.getItem(`w4BM_autoAutoTag`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_autoAutoTag`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_autoCollections`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoCollections' is not set in the localStorage
Now setting it to '${ini_settings_dict.autoCollections}'`
				);

				autoCollections = ini_settings_dict.autoCollections;
				localStorage.setItem(`w4BM_autoCollections`, ini_settings_dict.autoCollections);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_autoCollections' IS SET in the localStorage`
				);

				autoCollections = localStorage.getItem(`w4BM_autoCollections`);

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_autoCollections`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_showAutoTagButton`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_showAutoTagButton' is not set in the localStorage
Now setting it to '${ini_settings_dict.showAutoTagButton}'`
				);

				showAutoTagButton = ini_settings_dict.showAutoTagButton;
				localStorage.setItem(`w4BM_showAutoTagButton`, ini_settings_dict.showAutoTagButton);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_showAutoTagButton' IS SET in the localStorage`
				);

				showAutoTagButton = stringToBoolean(localStorage.getItem(`w4BM_showAutoTagButton`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_showAutoTagButton`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_bottomSummaryPage`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_bottomSummaryPage' is not set in the localStorage
Now setting it to '${ini_settings_dict.bottomSummaryPage}'`
				);

				bottomSummaryPage = ini_settings_dict.bottomSummaryPage;
				localStorage.setItem(`w4BM_bottomSummaryPage`, ini_settings_dict.bottomSummaryPage);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_bottomSummaryPage' IS SET in the localStorage`
				);

				bottomSummaryPage = stringToBoolean(localStorage.getItem(`w4BM_bottomSummaryPage`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_bottomSummaryPage`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_topSummaryPage`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_topSummaryPage' is not set in the localStorage
Now setting it to '${ini_settings_dict.topSummaryPage}'`
				);

				topSummaryPage = ini_settings_dict.topSummaryPage;
				localStorage.setItem(`w4BM_topSummaryPage`, ini_settings_dict.topSummaryPage);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_topSummaryPage' IS SET in the localStorage`
				);

				topSummaryPage = stringToBoolean(localStorage.getItem(`w4BM_topSummaryPage`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_topSummaryPage`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_simpleWorkSummary`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_simpleWorkSummary' is not set in the localStorage
Now setting it to '${ini_settings_dict.simpleWorkSummary}'`
				);

				simpleWorkSummary = ini_settings_dict.simpleWorkSummary;
				localStorage.setItem(`w4BM_simpleWorkSummary`, ini_settings_dict.simpleWorkSummary);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_simpleWorkSummary' IS SET in the localStorage`
				);

				simpleWorkSummary = stringToBoolean(localStorage.getItem(`w4BM_simpleWorkSummary`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_simpleWorkSummary`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_FWS_asBlockquote`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_FWS_asBlockquote' is not set in the localStorage
Now setting it to '${ini_settings_dict.FWS_asBlockquote}'`
				);

				FWS_asBlockquote = ini_settings_dict.FWS_asBlockquote;
				localStorage.setItem(`w4BM_FWS_asBlockquote`, ini_settings_dict.FWS_asBlockquote);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_FWS_asBlockquote' IS SET in the localStorage`
				);

				FWS_asBlockquote = stringToBoolean(localStorage.getItem(`w4BM_FWS_asBlockquote`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_FWS_asBlockquote`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_alwaysInjectBookmark`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_alwaysInjectBookmark' is not set in the localStorage
Now setting it to '${ini_settings_dict.alwaysInjectBookmark}'`
				);

				alwaysInjectBookmark = ini_settings_dict.alwaysInjectBookmark;
				localStorage.setItem(`w4BM_alwaysInjectBookmark`, ini_settings_dict.alwaysInjectBookmark);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_alwaysInjectBookmark' IS SET in the localStorage`
				);

				alwaysInjectBookmark = stringToBoolean(localStorage.getItem(`w4BM_alwaysInjectBookmark`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_alwaysInjectBookmark`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_AutoTag_type`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_AutoTag_type' is not set in the localStorage
Now setting it to '${ini_settings_dict.AutoTag_type}'`
				);

				AutoTag_type = ini_settings_dict.AutoTag_type;
				localStorage.setItem(`w4BM_AutoTag_type`, ini_settings_dict.AutoTag_type);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_AutoTag_type' IS SET in the localStorage`
				);

				AutoTag_type = parseInt(localStorage.getItem(`w4BM_AutoTag_type`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_AutoTag_type`);
				break;
		}

		// doing the same thing as the first if else on line 197
		switch (Boolean(localStorage.getItem(`w4BM_splitSelect`))) {
			case false:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_splitSelect' is not set in the localStorage
Now setting it to '${ini_settings_dict.splitSelect}'`
				);

				splitSelect = ini_settings_dict.splitSelect;
				localStorage.setItem(`w4BM_splitSelect`, ini_settings_dict.splitSelect);

				break;

			case true:
				console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
'w4BM_splitSelect' IS SET in the localStorage`
				);

				splitSelect = parseInt(localStorage.getItem(`w4BM_splitSelect`));

				break;

			default:
				console.log(`Error in retrieving localStorage variable w4BM_splitSelect`);
				break;
		}

	}
	else { // if localStorage does not exist

		divider = ini_settings_dict.divider;
		autoPrivate = ini_settings_dict.autoPrivate;
		autoRecommend = ini_settings_dict.autoRecommend;
		autoAutoTag = ini_settings_dict.autoAutoTag;
		autoCollections = ini_settings_dict.autoCollections;
		showAutoTagButton = ini_settings_dict.showAutoTagButton;
		bottomSummaryPage = ini_settings_dict.bottomSummaryPage;
		topSummaryPage = ini_settings_dict.topSummaryPage;
		simpleWorkSummary = ini_settings_dict.simpleWorkSummary;
		FWS_asBlockquote = ini_settings_dict.FWS_asBlockquote;
		AutoTag_type = ini_settings_dict.AutoTag_type;
		splitSelect = ini_settings_dict.splitSelect;

	}


	// Log the current value of the vars in localStorage
	let log_string = `
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
Logging the current state of vars used by the script

localStorage vars:`;

	const log_string_localStorage_maxSpacing = Object.keys(ini_settings_dict).reduce((a, b) => a.length <= b.length ? b : a).length + 1;

	Object.keys(ini_settings_dict).forEach((key) => {
		let spacing = log_string_localStorage_maxSpacing - key.toString().length;
		if (key == `divider`) {
			log_string += `\n${key.toString()}${" ".repeat(spacing)}: ${localStorage.getItem(`w4BM_${key}`).replace(/\n/gi, `\\n`).replace(/\t/gi, `\\t`).replace(/\r/gi, `\\r`)}`;
		} else {
			log_string += `\n${key.toString()}${" ".repeat(spacing)}: ${localStorage.getItem(`w4BM_${key}`)}`;
		}
	});

	log_string += `

current script vars (list may be incomplete):
divider              : ${divider.replace(/\n/gi, `\\n`).replace(/\t/gi, `\\t`).replace(/\r/gi, `\\r`)}
autoPrivate          : ${autoPrivate}
showAutoTagButton    : ${showAutoTagButton}
bottomSummaryPage    : ${bottomSummaryPage}
topSummaryPage       : ${topSummaryPage}
simpleWorkSummary    : ${simpleWorkSummary}
FWS_asBlockquote     : ${FWS_asBlockquote}
alwaysInjectBookmark : ${alwaysInjectBookmark}
AutoTag_type         : ${AutoTag_type}
splitSelect          : ${splitSelect}`;

	console.log(log_string);


	// add main element that all querySelector operations will be done on
	const main = document.querySelector(`div#main`);


	// Get current page URL
	// const currPgURL = window.location.href;
	const currPgURL = new URL(window.location);

	if (currPgURL.pathname.includes(`users`) && currPgURL.pathname.includes(`preferences`)) {
		addPrefDropdown();
	}

	// Create and add dropdown menu to configure the script
	function addPrefDropdown() {

		// unescapeSlashes is from https://stackoverflow.com/a/48855846/11750206
		function unescapeSlashes(str) {
			// add another escaped slash if the string ends with an odd
			// number of escaped slashes which will crash JSON.parse
			let parsedStr = str.replace(/(^|[^\\])(\\\\)*\\$/, "$&\\");

			// escape unescaped double quotes to prevent error with
			// added double quotes in json string
			parsedStr = parsedStr.replace(/(^|[^\\])((\\\\)*")/g, "$1\\$2");

			try {
				parsedStr = JSON.parse(`"${parsedStr}"`);
			} catch (e) {
				return str;
			}
			return parsedStr;
		}

		// get the header menu
		const header_menu = document.querySelector(`ul.primary.navigation.actions`);

		// create and insert the menu button
		const w4BM_settingMenu = Object.assign(document.createElement(`li`), {
			className: `dropdown`,
			id: `w4BM_settings_dropdown`,
			innerHTML: `<a>Bookmark Maker Settings</a>`
		});
		if (document.querySelector(`#navbar_bookmarks_button`) !== null) {
			document.querySelector(`#navbar_bookmarks_button`).before(w4BM_settingMenu);
		} else {
			header_menu.querySelector(`li.search`).before(w4BM_settingMenu);
		}

		// create and append dropdown menu
		const w4BM_dropMenu = Object.assign(document.createElement(`ul`), {
			className: `menu dropdown-menu`,
			style: `width: auto;`
		});
		w4BM_settingMenu.append(w4BM_dropMenu);

		// create a more info li element to dropdown
		const w4BM_moreInfo_liElm = Object.assign(document.createElement(`li`), {
			style: `padding: 0.5em; text-align: left;`,
			innerHTML: `<div><em><p>This menu is for changing values of constants.</p><br /><p>Preset selection is still done via editing the userscript.</p><br /><p>For more info on setup check script code.</p><br /><p>If you have any questions, don't hesitate to PM me on Greasy Fork</p></em></div>`
		});

		// append the more info li element to dropdown
		w4BM_dropMenu.append(w4BM_moreInfo_liElm);

		// create the "— Settings —" li element to dropdown
		const w4BM_settings_liElm = Object.assign(document.createElement(`li`), {
			innerHTML: `<a style="padding: 0.5em 0.5em 0.25em; text-align: center; font-weight: bold;">&mdash; Settings &mdash;</a>`
		});

		// append the "— Settings —" li element to dropdown
		w4BM_dropMenu.append(w4BM_settings_liElm);

		// create the general area where the divider input will go
		const w4BM_divider_input_area = Object.assign(document.createElement(`li`), {
			className: `w4BM_divider_input_area`,
			id: `w4BM_divider_input_area`,
			style: `padding-top: .75em;`,
			innerHTML: `<p style='padding: .75em .5em .5em;'>Divider text:<br /></p>`
		});

		// create the text input box for the divider value
		const w4BM_divider_input_box = (function () {
			let div_in_box = Object.assign(document.createElement(`input`), {
				type: `text`,
				id: `w4BM_divider_input_box`,
				name: `w4BM_divider_input_box`,
				style: `width: 16em; margin-left: 0.2em;`
			});

			div_in_box.setAttribute(`value`, localStorage.getItem(`w4BM_divider`).replace(/\n/gi, `\\n`).replace(/\t/gi, `\\t`).replace(/\r/gi, `\\r`) || `divider\\n\\n`);

			return div_in_box;
		})();

		// Add the text input box inside the input area
		w4BM_divider_input_area.append(w4BM_divider_input_box);

		// create divider input submit button
		const w4BM_divider_input_btn = Object.assign(document.createElement(`button`), {
			id: `w4BM_divider_input_btn`,
			style: `margin-left: 0.3em;`,
			innerHTML: `Enter`
		});

		// append divider input submit button
		w4BM_divider_input_box.after(w4BM_divider_input_btn);

		// make the divider input submit button actually do what it's supposed to
		w4BM_divider_input_btn.addEventListener(`click`, function () {
			const input_value = unescapeSlashes(document.querySelector(`#w4BM_divider_input_box`).value);
			localStorage.setItem(`w4BM_divider`, input_value);
			console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
New value set for the 'divider' variable in localStorage.
New value: '${input_value.replace(/\n/gi, `\\n`).replace(/\t/gi, `\\t`).replace(/\r/gi, `\\r`)}'`
			);
			alert(`w4tchdoge's AO3 Bookmark Maker
New value set for the 'divider' variable in localStorage.
New value: '${input_value.replace(/\n/gi, `\\n`).replace(/\t/gi, `\\t`).replace(/\r/gi, `\\r`)}'`
			);
		});

		// append divider input area to dropdown
		w4BM_settings_liElm.after(w4BM_divider_input_area);


		// create the general area where the collections input will go
		const w4BM_autoCollections_input_area = Object.assign(document.createElement(`li`), {
			className: `w4BM_autoCollections_input_area`,
			id: `w4BM_autoCollections_input_area`,
			style: `padding-top: .75em;`,
			innerHTML: `<p style='padding: .75em .5em .5em;'>List of collections (comma separated):<br /></p>`
		});

		// create the text input box for the comma separated list of collections
		const w4BM_autoCollections_input_box = (function () {
			let div_in_box = Object.assign(document.createElement(`input`), {
				type: `text`,
				id: `w4BM_autoCollections_input_box`,
				name: `w4BM_autoCollections_input_box`,
				style: `width: 16em; margin-left: 0.2em;`
			});

			div_in_box.setAttribute(`value`, localStorage.getItem(`w4BM_autoCollections`));

			return div_in_box;
		})();

		// Add the text input box inside the input area
		w4BM_autoCollections_input_area.append(w4BM_autoCollections_input_box);

		// create divider input submit button
		const w4BM_autoCollections_input_btn = Object.assign(document.createElement(`button`), {
			id: `w4BM_autoCollections_input_btn`,
			style: `margin-left: 0.3em;`,
			innerHTML: `Enter`
		});

		// append divider input submit button
		w4BM_autoCollections_input_box.after(w4BM_autoCollections_input_btn);

		// make the divider input submit button actually do what it's supposed to
		w4BM_autoCollections_input_btn.addEventListener(`click`, function () {
			const input_value = document.querySelector(`#w4BM_autoCollections_input_box`).value.split(`,`).filter(elm => elm.length !== 0).map(elm => elm.trim()).join(`, `);
			localStorage.setItem(`w4BM_autoCollections`, input_value);
			console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
New value set for the 'autoCollections' variable in localStorage.
New value:
${input_value}`
			);
			alert(`w4tchdoge's AO3 Bookmark Maker
New value set for the 'autoCollections' variable in localStorage.
New value:
${input_value}`
			);
		});

		// append autocollections input area to dropdown
		w4BM_divider_input_area.after(w4BM_autoCollections_input_area);


		// create button - auto private bookmarks - yes
		const w4BM_autoPrivate_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_autoPrivate_yes`,
			id: `w4BM_autoPrivate_yes`,
			innerHTML: `<a>Auto Private Bookmarks: YES</a>`
		});
		w4BM_autoPrivate_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_autoPrivate`, false);
			w4BM_autoPrivate_yes.replaceWith(w4BM_autoPrivate_no);
		});

		// create button - auto private bookmarks - no
		const w4BM_autoPrivate_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_autoPrivate_no`,
			id: `w4BM_autoPrivate_no`,
			innerHTML: `<a>Auto Private Bookmarks: NO</a>`
		});
		w4BM_autoPrivate_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_autoPrivate`, true);
			w4BM_autoPrivate_no.replaceWith(w4BM_autoPrivate_yes);
		});

		// create button - auto recommend bookmarks - yes
		const w4BM_autoRecommend_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_autoRecommend_yes`,
			id: `w4BM_autoRecommend_yes`,
			innerHTML: `<a>Auto Recommend Bookmarks: YES</a>`
		});
		w4BM_autoRecommend_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_autoRecommend`, false);
			w4BM_autoRecommend_yes.replaceWith(w4BM_autoRecommend_no);
		});

		// create button - auto recommend bookmarks - no
		const w4BM_autoRecommend_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_autoRecommend_no`,
			id: `w4BM_autoRecommend_no`,
			innerHTML: `<a>Auto Recommend Bookmarks: NO</a>`
		});
		w4BM_autoRecommend_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_autoRecommend`, true);
			w4BM_autoRecommend_no.replaceWith(w4BM_autoRecommend_yes);
		});

		// create button - auto autotag bookmarks - yes
		const w4BM_autoAutoTag_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_autoAutoTag_yes`,
			id: `w4BM_autoAutoTag_yes`,
			innerHTML: `<a>Auto-run AutoTag: YES</a>`
		});
		w4BM_autoAutoTag_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_autoAutoTag`, false);
			w4BM_autoAutoTag_yes.replaceWith(w4BM_autoAutoTag_no);
		});

		// create button - auto autotag bookmarks - no
		const w4BM_autoAutoTag_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_autoAutoTag_no`,
			id: `w4BM_autoAutoTag_no`,
			innerHTML: `<a>Auto-run AutoTag: NO</a>`
		});
		w4BM_autoAutoTag_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_autoAutoTag`, true);
			w4BM_autoAutoTag_no.replaceWith(w4BM_autoAutoTag_yes);
		});

		// create button - show AutoTag button - yes
		const w4BM_showAutoTagButton_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_showAutoTagButton_yes`,
			id: `w4BM_showAutoTagButton_yes`,
			innerHTML: `<a>Show AutoTag Button: YES</a>`
		});
		w4BM_showAutoTagButton_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_showAutoTagButton`, false);
			w4BM_showAutoTagButton_yes.replaceWith(w4BM_showAutoTagButton_no);
		});

		// create button - show AutoTag button - no
		const w4BM_showAutoTagButton_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_showAutoTagButton_no`,
			id: `w4BM_showAutoTagButton_no`,
			innerHTML: `<a>Show AutoTag Button: NO</a>`
		});
		w4BM_showAutoTagButton_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_showAutoTagButton`, true);
			w4BM_showAutoTagButton_no.replaceWith(w4BM_showAutoTagButton_yes);
		});

		// create button - AutoTag type 0
		const w4BM_AutoTagType_0 = Object.assign(document.createElement(`li`), {
			className: `w4BM_AutoTagType_0`,
			id: `w4BM_AutoTagType_0`,
			innerHTML: `<a>AutoTag Type: Original</a>`
		});
		w4BM_AutoTagType_0.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_AutoTag_type`, 1);
			w4BM_AutoTagType_0.replaceWith(w4BM_AutoTagType_1);
		});

		// create button - AutoTag type 1
		const w4BM_AutoTagType_1 = Object.assign(document.createElement(`li`), {
			className: `w4BM_AutoTagType_1`,
			id: `w4BM_AutoTagType_1`,
			innerHTML: `<a>AutoTag Type: Canon AO3 Wordcount tags</a>`
		});
		w4BM_AutoTagType_1.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_AutoTag_type`, 0);
			w4BM_AutoTagType_1.replaceWith(w4BM_AutoTagType_0);
		});

		// create button - add "Summary Page" button to bottom navbar
		const w4BM_bottomSummaryPage_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_bottomSummaryPage_yes`,
			id: `w4BM_bottomSummaryPage_yes`,
			innerHTML: `<a>"Summary Page" button in bottom navbar: YES</a>`
		});
		w4BM_bottomSummaryPage_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_bottomSummaryPage`, false);
			w4BM_bottomSummaryPage_yes.replaceWith(w4BM_bottomSummaryPage_no);
		});

		// create button - do not add "Summary Page" button to bottom navbar
		const w4BM_bottomSummaryPage_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_bottomSummaryPage_no`,
			id: `w4BM_bottomSummaryPage_no`,
			innerHTML: `<a>"Summary Page" button in bottom navbar: NO</a>`
		});
		w4BM_bottomSummaryPage_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_bottomSummaryPage`, true);
			w4BM_bottomSummaryPage_no.replaceWith(w4BM_bottomSummaryPage_yes);
		});

		// create button - add "Summary Page" button to top navbar
		const w4BM_topSummaryPage_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_topSummaryPage_yes`,
			id: `w4BM_topSummaryPage_yes`,
			innerHTML: `<a>"Summary Page" button in top navbar: YES</a>`
		});
		w4BM_topSummaryPage_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_topSummaryPage`, false);
			w4BM_topSummaryPage_yes.replaceWith(w4BM_topSummaryPage_no);
		});

		// create button - do not add "Summary Page" button to top navbar
		const w4BM_topSummaryPage_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_topSummaryPage_no`,
			id: `w4BM_topSummaryPage_no`,
			innerHTML: `<a>"Summary Page" button in top navbar: NO</a>`
		});
		w4BM_topSummaryPage_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_topSummaryPage`, true);
			w4BM_topSummaryPage_no.replaceWith(w4BM_topSummaryPage_yes);
		});

		// create button - use simple summary
		const w4BM_simpleWorkSummary_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_simpleWorkSummary_yes`,
			id: `w4BM_simpleWorkSummary_yes`,
			innerHTML: `<a>Use a simpler work summary: YES</a>`
		});
		w4BM_simpleWorkSummary_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_simpleWorkSummary`, false);
			w4BM_simpleWorkSummary_yes.replaceWith(w4BM_simpleWorkSummary_no);
		});

		// create button - don't use simple summary
		const w4BM_simpleWorkSummary_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_simpleWorkSummary_no`,
			id: `w4BM_simpleWorkSummary_no`,
			innerHTML: `<a>Use a simpler work summary: NO</a>`
		});
		w4BM_simpleWorkSummary_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_simpleWorkSummary`, true);
			w4BM_simpleWorkSummary_no.replaceWith(w4BM_simpleWorkSummary_yes);
		});

		// create button - always overwrite bookmark notes
		const w4BM_alwaysInjectBookmark_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_alwaysInjectBookmark_no`,
			id: `w4BM_alwaysInjectBookmark_no`,
			innerHTML: `<a>Always run script on valid pages: NO</a>`
		});
		w4BM_alwaysInjectBookmark_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_alwaysInjectBookmark`, true);
			w4BM_alwaysInjectBookmark_no.replaceWith(w4BM_alwaysInjectBookmark_yes);
		});

		// create button - don't always overwrite bookmark notes
		const w4BM_alwaysInjectBookmark_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_alwaysInjectBookmark_yes`,
			id: `w4BM_alwaysInjectBookmark_yes`,
			innerHTML: `<a>Always run script on valid pages: YES</a>`
		});
		w4BM_alwaysInjectBookmark_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_alwaysInjectBookmark`, false);
			w4BM_alwaysInjectBookmark_yes.replaceWith(w4BM_alwaysInjectBookmark_no);
		});

		// create button - use blockquotes when using fancy work summary
		const w4BM_FWS_asBlockquote_yes = Object.assign(document.createElement(`li`), {
			className: `w4BM_FWS_asBlockquote_yes`,
			id: `w4BM_FWS_asBlockquote_yes`,
			innerHTML: `<a>Use blockquote w/ fancy work summary: YES</a>`
		});
		w4BM_FWS_asBlockquote_yes.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_FWS_asBlockquote`, false);
			w4BM_FWS_asBlockquote_yes.replaceWith(w4BM_FWS_asBlockquote_no);
		});

		// create button - dont use blockquotes when using fancy work summary
		const w4BM_FWS_asBlockquote_no = Object.assign(document.createElement(`li`), {
			className: `w4BM_FWS_asBlockquote_no`,
			id: `w4BM_FWS_asBlockquote_no`,
			innerHTML: `<a>Use blockquote w/ fancy work summary: NO</a>`
		});
		w4BM_FWS_asBlockquote_no.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_FWS_asBlockquote`, true);
			w4BM_FWS_asBlockquote_no.replaceWith(w4BM_FWS_asBlockquote_yes);
		});

		// create button - set splitSelect to 1
		const w4BM_splitSelect_1 = Object.assign(document.createElement(`li`), {
			className: `w4BM_splitSelect_1`,
			id: `w4BM_splitSelect_1`,
			innerHTML: `<a>splitSelect: 1</a>`
		});
		w4BM_splitSelect_1.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_splitSelect`, 0);
			w4BM_splitSelect_1.replaceWith(w4BM_splitSelect_0);
		});

		// create button - set splitSelect to 0
		const w4BM_splitSelect_0 = Object.assign(document.createElement(`li`), {
			className: `w4BM_splitSelect_0`,
			id: `w4BM_splitSelect_0`,
			innerHTML: `<a>splitSelect: 0</a>`
		});
		w4BM_splitSelect_0.addEventListener(`click`, function (event) {
			localStorage.setItem(`w4BM_splitSelect`, 1);
			w4BM_splitSelect_0.replaceWith(w4BM_splitSelect_1);
		});

		// append binary choice buttons to the dropdown menu
		if (typeof (Storage) !== `undefined`) {

			// auto privating bookmarks
			if (autoPrivate == true || autoPrivate == `true`) {
				w4BM_dropMenu.append(w4BM_autoPrivate_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_autoPrivate_no);
			}

			// auto recommending bookmarks
			if (autoRecommend == true || autoRecommend == `true`) {
				w4BM_dropMenu.append(w4BM_autoRecommend_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_autoRecommend_no);
			}

			// auto autotagging bookmarks
			if (autoAutoTag == true || autoAutoTag == `true`) {
				w4BM_dropMenu.append(w4BM_autoAutoTag_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_autoAutoTag_no);
			}

			// showing AutoTag button
			if (showAutoTagButton == true || showAutoTagButton == `true`) {
				w4BM_dropMenu.append(w4BM_showAutoTagButton_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_showAutoTagButton_no);
			}

			// choosing AutoTag type button
			if (AutoTag_type === 0 || AutoTag_type == 0 || AutoTag_type == `0`) {
				w4BM_dropMenu.append(w4BM_AutoTagType_0);
			} else {
				w4BM_dropMenu.append(w4BM_AutoTagType_1);
			}

			// adding "Summary Page" to bottom navbar
			if (bottomSummaryPage == true || bottomSummaryPage == `true`) {
				w4BM_dropMenu.append(w4BM_bottomSummaryPage_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_bottomSummaryPage_no);
			}

			// adding "Summary Page" to top navbar
			if (topSummaryPage == true || topSummaryPage == `true`) {
				w4BM_dropMenu.append(w4BM_topSummaryPage_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_topSummaryPage_no);
			}

			// using a simple work summary
			if (simpleWorkSummary == true || simpleWorkSummary == `true`) {
				w4BM_dropMenu.append(w4BM_simpleWorkSummary_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_simpleWorkSummary_no);
			}

			// using blockquotes w/ fancy work summary
			if (FWS_asBlockquote == true || FWS_asBlockquote == `true`) {
				w4BM_dropMenu.append(w4BM_FWS_asBlockquote_yes);
			}
			else {
				w4BM_dropMenu.append(w4BM_FWS_asBlockquote_no);
			}

			// always injecting into bookmark
			if (alwaysInjectBookmark == true || alwaysInjectBookmark == `true`) {
				w4BM_dropMenu.append(w4BM_alwaysInjectBookmark_yes);
			} else {
				w4BM_dropMenu.append(w4BM_alwaysInjectBookmark_no);
			}

			// setting the splitSelect
			if (splitSelect == 1) {
				w4BM_dropMenu.append(w4BM_splitSelect_1);
			}
			else {
				w4BM_dropMenu.append(w4BM_splitSelect_0);
			}
		}

	}

	// ------------------------------------------------------

	// move the summary page check into its own boolean variable because it's going to be used for more than just BSP_conditional and TSP_conditional
	const on_summary_page = !Boolean(main.querySelector(`li.chapter.previous`));

	const
		BSP_conditional = (currPgURL.pathname.includes(`chapters`) && on_summary_page == false && bottomSummaryPage),
		TSP_conditional = (currPgURL.pathname.includes(`chapters`) && on_summary_page == false && topSummaryPage);

	console.log(`
All conditions met for "Summary Page" button in the bottom nav bar?: ${BSP_conditional}
All conditions met for "Summary Page" button in the top nav bar?: ${TSP_conditional}`
	);

	function CreateSummaryPageButton() {
		// Creating the "Summary Page" buttons
		// Make the href for the "Summary Page" button
		const sum_pg_href = (new URL(main.querySelector(`li.chapter.entire a`)?.href)).pathname;

		// Create the bottom "Summary Page" button
		const btm_sum_pg = Object.assign(document.createElement(`li`), {
			className: `bottomSummaryPage`,
			id: `bottomSummaryPage`,
			style: `padding-left: 0.5663em;`,
			innerHTML: `<a href="${sum_pg_href}">Summary Page</a>`
		});

		// Create the top "Summary Page" button
		const top_sum_pg = Object.assign(document.createElement(`li`), {
			className: `topSummaryPage`,
			id: `topSummaryPage`,
			style: `padding-left: 0.31696592em;`,
			innerHTML: `<a href="${sum_pg_href}">SP</a>`
		});

		// Get the "↑ Top" button that's in the bottom nav bar
		const toTop_xp = `.//*[@id="feedback"]//*[@role="navigation"]//li[*[text()[contains(.,"Top")]]]`;
		const toTop_btn = document.evaluate(toTop_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

		// Get the Entire Work button in the top nav bar
		// Define the var which the Entire Work button will be stored in
		const entiWork_topnavBTN = (function () {
			// At least one script modifies the top navigation bar to the extent that the original XPath doesn't work, so this is me adding a fallback
			// Original XPath
			const entiWork_topnavBTN_xPath = `.//*[contains(concat(" ",normalize-space(@class)," ")," work ")][contains(concat(" ",normalize-space(@class)," ")," navigation ")][contains(concat(" ",normalize-space(@class)," ")," actions ")]//*[contains(concat(" ",normalize-space(@class)," ")," chapter ")][contains(concat(" ",normalize-space(@class)," ")," entire ")][count(.//a[contains(@href,"view_full_work=true")]) > 0]`;
			let entiWork_topnavBTN = document.evaluate(entiWork_topnavBTN_xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (Boolean(entiWork_topnavBTN) == false) {
				// Fallback XPath
				const entiWork_topnavBTN_xPath = `.//li[contains(concat(" ",normalize-space(@class)," ")," entire ")][count(.//a[contains(@href,"view_full_work=true")]) > 0]`;
				entiWork_topnavBTN = document.evaluate(entiWork_topnavBTN_xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				return entiWork_topnavBTN;
			} else {
				return entiWork_topnavBTN;
			}
		})();

		// Debug code
		// console.log(btm_sum_pg);
		// console.log(top_sum_pg);
		// console.log(toTop_btn);
		// console.log(entiWork_topnavBTN);

		return [toTop_btn, entiWork_topnavBTN, top_sum_pg, btm_sum_pg];
	}

	if (BSP_conditional) {
		// If true, add a "Summary Page" button after the "↑ Top" button in the bottom navbar to take you to a page where the summary exists and can be used by the userscript
		const [toTop_btn, , , btm_sum_pg] = CreateSummaryPageButton();

		// console.log(`\ntoTop_btn:\n${toTop_btn.outerHTML}\n\nbtm_sum_pg:\n${btm_sum_pg.outerHTML}`);
		toTop_btn.after(btm_sum_pg);
	}
	if (TSP_conditional) {
		// If true, adds summary page btn to top navbar
		const [, entiWork_topnavBTN, top_sum_pg,] = CreateSummaryPageButton();

		// console.log(`\nentiWork_topnavBTN:\n${entiWork_topnavBTN.outerHTML}\n\ntop_sum_pg:\n${top_sum_pg.outerHTML}`);
		entiWork_topnavBTN.after(top_sum_pg);
	}


	// determine whether the current page is one where the bookmark script can run
	// adds onto the old method of just checking whether the URL has works or series by also taking into account whether the user always wants the script to run
	const script_execute_conditional = (() => {
		const worksInURL = currPgURL.pathname.includes(`works`), seriesInURL = currPgURL.pathname.includes(`series`);
		let output = Boolean(worksInURL || seriesInURL);

		if (alwaysInjectBookmark == true) {
			// output = Boolean(worksInURL || seriesInURL);
			return output;
		}
		if (alwaysInjectBookmark == false) {
			output = Boolean((worksInURL && on_summary_page) || seriesInURL);
			return output;
		}

		// Fallback to the normal boolean expression in case the if statements dont run
		return output;
	})();

	if (script_execute_conditional) {

		if (autoPrivate) { // for auto-privating your bookmarks
			main.querySelector(`#bookmark_private`).checked = true;
		}
		if (autoRecommend) { // for auto-recommending your bookmarks
			main.querySelector(`#bookmark_rec`).checked = true;
		}

		if (Boolean(autoCollections) == true) {
			console.log(`AUTOCOLLECTIONS ARE DEFINED`);
			const coll_lstor = localStorage.getItem(`w4BM_autoCollections`);
			let coll_input = document.evaluate(`.//dd[count(preceding-sibling::dt[count(.//label[starts-with(@for,"bookmark_collection")]) > 0]) > 0]/ul/li/input`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			coll_input.value = coll_lstor;
		} else {
			console.log(`AUTOCOLLECTIONS ARE NOT DEFINED`);
		}

		// Define variables used in date configuration
		const
			currdate = new Date(),
			dd = String(currdate.getDate()).padStart(2, `0`),
			mm = String(currdate.getMonth() + 1).padStart(2, `0`), //January is 0
			yyyy = currdate.getFullYear(),
			hh = String(currdate.getHours()).padStart(2, `0`),
			mins = String(currdate.getMinutes()).padStart(2, `0`);

		// Get already existing bookmark notes
		const curr_notes = main.querySelector(`#bookmark_notes`).textContent.split(divider).at(`-${splitSelect}`);

		// Define function used in the Auto Tag feature
		function StatusForAutoTag() {
			// Look for HTML DOM element only present on series pages
			const seriesTrue = document.evaluate(`.//*[@id="main"]//span[text()="Series"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

			// Check if current page is a series page
			if (seriesTrue != undefined) {
				const
					statusCheck_XPath = `//dl[contains(concat(" ",normalize-space(@class)," ")," series ")][contains(concat(" ",normalize-space(@class)," ")," meta ")][contains(concat(" ",normalize-space(@class)," ")," group ")]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[contains(text(), "Complete")]/following-sibling::*[1]`,
					status_check = document.evaluate(statusCheck_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;

				switch (status_check) {
					case `Yes`:
						return `Complete`;

					case `No`:
						return `Work In Progress`;

					default:
						break;
				}
			}
			else {
				const status_check = document.querySelector(`.work.meta.group dl.stats dt.status`);

				if (Boolean(status_check) == false) { // For single chapter works which are always complete
					return `Complete`;
				}
				else { // For multi chapter works
					switch (status_check.textContent) {
						case `Completed:`:
							return `Complete`;

						case `Updated:`:
							return `Work in Progress`;

						default:
							break;
					}
				}
			}
		}

		// Make the button used in Auto Tag
		if (document.querySelector(`#bookmark-form`) && showAutoTagButton) {

			// Get element in bookmark form to append button to
			const
				yourTags_xp = `.//div[@id="main"]//div[@id="bookmark-form"]//dt/label[text() = 'Your tags']`,
				yourTags_elem = document.evaluate(yourTags_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

			// Create button element
			const autoTag_btn_elem = Object.assign(document.createElement(`label`), {
				id: `w4BM_autoTag_elem`,
				className: `actions`,
				style: `font-size: 0.85em`,
				innerHTML: `<a id='w4BM_autoTag_btn'>Auto Tag</a>`
			});

			// Append button element
			yourTags_elem.after(autoTag_btn_elem);

			// Select the parent dt element to which the button will be a child of
			let yourTags_parent_dt_elem = (function () {
				const yourTags_parent_dt_xp = `.//div[@id="main"]//div[@id="bookmark-form"]//dt[./label[text() = 'Your tags']]`;
				const parent_elm = document.evaluate(yourTags_parent_dt_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;;
				return parent_elm;
			})();

			// Change the display style of the parent dt of the yourTags_elems to contents
			yourTags_parent_dt_elem.style.display = `contents`;

			// Add click listener to autoTag_btn_elem
			autoTag_btn_elem.addEventListener(`click`, AutoTag);

			// for automatically triggering the autotag function
			if (autoAutoTag) {
				autoTag_btn_elem.click();
			}
		}


		// Look for HTML DOM element only present on series pages
		const seriesTrue = document.evaluate(`.//*[@id="main"]//span[text()="Series"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

		// Extract all details used in bookmark configuration and assign them to variables

		const title = (function () {
			if (seriesTrue != undefined) {
				// Retrieve series title
				const srs_title = main.querySelector(`:scope > h2.heading`).textContent.trim();
				return srs_title;
			}
			else {
				// Retrieve work title
				const wrk_title = main.querySelector(`#workskin .title.heading`).textContent.trim();
				return wrk_title;
			}
		})();

		const [author, author_HTML] = (function () {
			function AnonCheck(input) {
				const array = Array.from(input.querySelectorAll(`a`));
				return (!Array.isArray(array) || !array.length);
			}

			if (seriesTrue != undefined) {
				// Retrieve series author
				const
					series_author_xpath = `.//*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," series ")][contains(concat(" ",normalize-space(@class)," ")," meta ")][contains(concat(" ",normalize-space(@class)," ")," group ")]//dt[text()[contains(.,"Creator")]]/following-sibling::*[1]/self::dd`,
					series_author_element = document.evaluate(series_author_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				const srs_authors = series_author_element.textContent.trim();

				// check if series_author_element contains a link
				// if it does, assign contents of the outerHTML of the <a> tag to author_HTML as a string
				// if it doesnt, make author_HTML identical to author
				if (AnonCheck(series_author_element)) {
					const srs_authors_HTML = srs_authors;
					return [srs_authors, srs_authors_HTML];
				} else {
					let auth_str_arr = [];
					Array.from(series_author_element.querySelectorAll(`a`)).forEach(function (el) {
						const el_c = el.cloneNode(true);
						el_c.removeAttribute(`rel`);
						auth_str_arr.push(el_c.outerHTML);
					});
					const srs_authors_HTML = auth_str_arr.join(`, `);
					return [srs_authors, srs_authors_HTML];
				}
			}
			else {
				// Retrieve work author
				const work_author_element = main.querySelector(`#workskin > .preface .byline`);
				const wrk_authors = work_author_element.textContent.trim(); // fic author

				// check if work_author_element contains a link
				// if it does, assign contents of the outerHTML of the <a> tag to author_HTML as a string
				// if it doesnt, make author_HTML identical to author
				if (AnonCheck(work_author_element)) {
					const wrk_authors_HTML = wrk_authors;
					return [wrk_authors, wrk_authors_HTML];
				} else {
					let auth_str_arr = [];
					Array.from(work_author_element.querySelectorAll(`a`)).forEach(function (el) {
						const el_c = el.cloneNode(true);
						el_c.removeAttribute(`rel`);
						auth_str_arr.push(el_c.outerHTML);
					});
					const wrk_authors_HTML = auth_str_arr.join(`, `);
					return [wrk_authors, wrk_authors_HTML];
				}
			}
		})();

		const AO3_status = (function () {
			if (seriesTrue != undefined) {
				// Get the last updated date of the series
				const updated = main.querySelectorAll(`.series.meta.group dd`)[2].textContent;

				// Retrieve series completion status
				const pub_xp = `//dl[contains(concat(" ",normalize-space(@class)," ")," series ")][contains(concat(" ",normalize-space(@class)," ")," meta ")][contains(concat(" ",normalize-space(@class)," ")," group ")]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[contains(text(), "Complete")]/following-sibling::*[1]`;
				const complete = document.evaluate(pub_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.toLowerCase();

				if (complete == `no`) {
					const srs_AO3_status = `Updated: ${updated}`;
					return srs_AO3_status;
				}
				if (complete == `yes`) {
					const srs_AO3_status = `Completed: ${updated}`;
					return srs_AO3_status;
				}

			}
			else {
				// Retrieve work status
				if (Boolean(main.querySelector(`.status`))) {
					// Retrieval method for multi-chapter works
					const wrk_AO3_status = `${main.querySelector(`dt.status`).textContent} ${main.querySelector(`dd.status`).textContent}`;
					return wrk_AO3_status;
				}
				else {
					// Retrieval method for single chapter works
					const wrk_AO3_status = `${main.querySelector(`dt.published`).textContent} ${main.querySelector(`dd.published`).textContent}`;
					return wrk_AO3_status;
				}

			}
		})();

		const relationships = (function () {
			if (seriesTrue != undefined) {
				// Get all relationship tags present in series' works and add them to series bookmark
				// Retrieve relationship tags
				const raw_rels_arr = Array.from(document.querySelectorAll(`ul.tags > li.relationships > a.tag`));
				let rels_arr = [];

				raw_rels_arr.forEach(function (element, index, array) {
					const element_clone = element.cloneNode(true);
					element_clone.removeAttribute(`class`);

					const rel_string = element_clone.outerHTML;
					// console.log(`Content in array ${array} at index ${index}: ${array[index]}`);
					// console.log(element_clone.outerHTML);

					rels_arr.push(`• ${rel_string}`);
				});

				// Remove duplicates in rels_arr
				rels_arr = [...new Set(rels_arr)];

				// const srs_relationships = (function () {
				// 	// Attempt to add entries from rels_arr to relationships regardless of whether rels_arr is empty or not
				// 	let srs_rels = `<details><summary>Relationship Tags:</summary>\n${rels_arr.join(`\n`)}</details>`;

				// 	// Check if rels_arr is empty, indicating no relationship tags
				// 	if (!Array.isArray(rels_arr) || !rels_arr.length) {
				// 		// If empty, set 'relationships' var to indicate no relationship tags
				// 		srs_rels = `<details><summary>Relationship Tags:</summary>\n• <em><strong>No Relationship Tags</strong></em></details>`;
				// 	}

				// 	return srs_rels;
				// })();

				// return srs_relationships

				// Check if rels_arr is empty, indicating no relationship tags
				if (!Array.isArray(rels_arr) || !rels_arr.length) {
					// If empty, set 'relationships' var to indicate no relationship tags
					const srs_rels = `<details><summary>Relationship Tags:</summary>\n• <em><strong>No Relationship Tags</strong></em></details>`;
					return srs_rels;
				} else {
					// If not empty, use values in rels_arr to set 'relationships'
					const srs_rels = `<details><summary>Relationship Tags:</summary>\n${rels_arr.join(`\n`)}</details>`;
					return srs_rels;
				}
			}
			else {
				// Retrieve relationship tags
				const raw_rels_arr = Array.from(document.querySelectorAll(`.relationship.tags ul a`));
				let rels_arr = [];
				raw_rels_arr.forEach(function (el) {
					const el_c = el.cloneNode(true);
					el_c.removeAttribute(`class`);

					const rel_string = `• ${el_c.outerHTML}`;

					rels_arr.push(rel_string);
				});

				// Add Relationship tags to 'relationships' var

				// Check if rels_arr is empty, indicating no relationship tags
				if (!Array.isArray(rels_arr) || !rels_arr.length) {
					// If empty, set 'relationships' var to indicate no relationship tags
					const wrk_rels = `<details><summary>Relationship Tags:</summary>\n• <em><strong>No Relationship Tags</strong></em></details>`;
					return wrk_rels;
				} else {
					// If not empty, fill 'relationships' var using rels_arr
					const wrk_rels = `<details><summary>Relationship Tags:</summary>\n${rels_arr.join(`\n`)}</details>`;
					return wrk_rels;
				}
			}
		})();

		const [fform_tags_comma_TXT] = (function () {
			if (seriesTrue != undefined) { return [``, ``, ``, ``]; }
			else {
				// Retrieve relationship tags
				const raw_freeform_arr = Array.from(document.querySelectorAll(`.freeform.tags > ul a`));

				let
					freeform_arr_comma_TXT = [];

				raw_freeform_arr.forEach(function (el) {
					const el_c = el.cloneNode(true);
					el_c.removeAttribute(`class`);

					const fform_ct_str = `${el_c.textContent.trim()}`;

					freeform_arr_comma_TXT.push(fform_ct_str);
				});

				// Add Relationship tags to 'relationships' var

				// Check if rels_arr is empty, indicating no relationship tags
				if (!Array.isArray(raw_freeform_arr) || !raw_freeform_arr.length) {
					// If empty, set 'relationships' var to indicate no relationship tags
					const wrk_fforms = `<details><summary>Additional Tags:</summary>\n• <em><strong>No Additional Tags</strong></em></details>`;
					return [wrk_fforms, wrk_fforms, wrk_fforms, wrk_fforms];
				} else {
					// If not empty, fill 'relationships' var using rels_arr
					const wrk_fforms_ct = `<details><summary>Additional Tags:</summary>\n${freeform_arr_comma_TXT.join(`, `)}</details>`;
					return [wrk_fforms_ct];
				}
			}
		})();

		// console.log([fform_tags_list_HTML, fform_tags_list_TXT, fform_tags_comma_HTML, fform_tags_comma_TXT]);

		const summary_default_value = `<em><strong>NO SUMMARY</strong></em>`;

		const summary = ((function () {
			if (seriesTrue != undefined) {
				// Check if there is a series summary
				let series_summary;
				switch (Boolean(main.querySelector(`.series.meta.group .userstuff`))) {
					case true: // If series summary exists, retrieve summary
						series_summary = main.querySelector(`.series.meta.group .userstuff`).innerHTML;
						break;

					case false: // Else fill in var with NO SUMMARY string
						series_summary = summary_default_value;
						break;

					default: // If error, fill var asking for bug report
						series_summary = `<em>Error in retrieving series summary, please report this bug at</em> https://greasyfork.org/en/scripts/467885`;
						break;
				}

				// Check if there are series notes
				const series_notes_dt_xp = `.//*[contains(concat(" ",normalize-space(@class)," ")," series ")][contains(concat(" ",normalize-space(@class)," ")," meta ")][contains(concat(" ",normalize-space(@class)," ")," group ")]//dt[text()[contains(.,"Notes:")]]`;
				let series_notes;
				switch (Boolean(document.evaluate(series_notes_dt_xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)) {
					case true: // If series notes exists, retrieve notes
						series_notes = document.evaluate(`${series_notes_dt_xp}/following-sibling::*[1]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
						series_notes = `<details><summary>Series Notes:</summary>\n${series_notes}\n</details>`;
						break;

					case false:
						series_notes = ``;
						break;

					default:
						series_notes = ``;
						break;
				}

				// Join series summary and series notes
				const srs_summary = series_summary + series_notes;

				return srs_summary;

			}
			else {
				// Retrieve work summary
				if (simpleWorkSummary) { // the original methos to retrieve the work's summary
					const wrk_summary = main.querySelector(`.summary`).innerHTML;
					return wrk_summary;

					// Example output of the above method:
					// summary will be a var equal to the following string
					// '\n          <h3 class="heading">Summary:</h3>\n            <blockquote class="userstuff">\n              <p>Lorem ipsum dolor...</p>\n            </blockquote>\n        '

				}
				else if (!simpleWorkSummary && FWS_asBlockquote && main.querySelector(`.summary blockquote`) != null) { // new method #1
					const wrk_summary = main.querySelector(`.summary blockquote`).outerHTML;
					return wrk_summary;

					// Example output of the above method:
					// summary will be a var equal to the following string
					// '<blockquote class="userstuff">\n              <p>Lorem ipsum dolor...</p>\n            </blockquote>'

				}
				else if (!simpleWorkSummary && !FWS_asBlockquote && main.querySelector(`.summary blockquote`) != null) { // new method #2
					const wrk_summary = main.querySelector(`.summary blockquote`).innerHTML.trim();
					return wrk_summary;

					// Example output of the above method:
					// summary will be a var equal to the following string
					// '<p>Lorem ipsum dolor...</p>'

				}
			}
		})() || summary_default_value);

		const series_works_titles_summaries = (function () {
			function GetPadAmount(input_array) {
				const pad_amt = input_array.length.toString().length;
				if (pad_amt < 2) {
					return 2;
				} else {
					return pad_amt;
				}
			}

			if (seriesTrue != undefined) {
				// Get summaries for each work in series
				const series_children = Array.from(main.querySelector(`.series.work.index.group`).children);
				let srsWkSum_arr = [];
				series_children.forEach((child, index) => {
					let srs_work_sum = summary_default_value;
					const workname = (() => {
						try {
							let work_title = child.querySelector(`.heading a[href*="works"]`).innerText;
							return work_title;
						} catch (error) {
							let work_title = child.querySelector(`.header > h4.heading`).innerText;
							return work_title;
						}
					})();
					const summary_elem = child.querySelector(`.userstuff.summary`);
					if (Boolean(summary_elem) == true) {
						srs_work_sum = summary_elem.outerHTML;
					}

					const series_pagination_mult = (() => {
						const pagination_nav = main.querySelector(`ol.pagination:has(+ .series.work.index.group)`);
						try {
							if (Object.is(pagination_nav, null) || Object.is(pagination_nav, undefined)) {
								throw new Error("Series is not Paginated");
							} else {
								return ((parseInt(pagination_nav.querySelector(`.current`).textContent.trim())) - 1);
							}
						} catch (error) {
							return 0;
						}
					})();

					const wrk_num = (index + (20 * series_pagination_mult) + 1).toString().padStart(GetPadAmount(series_children), `0`);

					if (series_children.length > 10) {
						srsWkSum_arr.push(`• Work ${wrk_num}. ${workname}<br />`);
					} else {
						srsWkSum_arr.push(`<details><summary>Work ${wrk_num}. ${workname} - Summary</summary>\n${srs_work_sum}</details>`);
					}
				});

				const ser_wor_sum = `\n${srsWkSum_arr.join(`\n`)}\n`;
				return ser_wor_sum;
			}
			else {
				const ser_wor_sum = ``;
				return ser_wor_sum;
			}
		})();

		const words = (function () {
			if (seriesTrue != undefined) {
				// Retrieve series word count
				const srs_words = document.evaluate(`.//*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Words:"]/following-sibling::*[1]/self::dd`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
				return srs_words;
			}
			else {
				// Retrieve work work count
				const wrk_words = document.evaluate(`.//*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Words:"]/following-sibling::*[1]/self::dd`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
				return wrk_words;
			}
		})();

		const ws_id = (function () {
			function FindID(search_term) {
				const currPg_pathname_arr = currPgURL.pathname.split(`/`);
				// let results = [];
				let pathname_idx = currPg_pathname_arr.indexOf(`${search_term}`);

				// while (pathname_idx !== -1) {
				// 	results.push(pathname_idx);
				// 	pathname_idx = currPg_pathname_arr.indexOf(`${search_term}`, pathname_idx + 1);
				// }

				// const AO3_id = currPg_pathname_arr.at(parseInt(results[0] + 1)).toString();
				const AO3_id = currPg_pathname_arr.at(parseInt(pathname_idx + 1)).toString();
				return AO3_id;
			}

			if (seriesTrue != undefined) {
				const srs_AO3_id = FindID(`series`);
				return srs_AO3_id;
			}
			else {
				const wrk_AO3_id = FindID(`works`);
				return wrk_AO3_id;
			}
		})();

		const lastChapter = (function () {
			if (seriesTrue != undefined) {
				// Have lastChapter be an empty string for series
				const srs_lastChapter = ``;
				return srs_lastChapter;
			}
			else {

				const latest_chapter_number = (function () {
					// XPath for the chapter count element
					const chapter_count_elem_XPath = `.//*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Chapters:"]/following-sibling::*[1]/self::dd`;

					const chapter_count_elem_Text = document.evaluate(chapter_count_elem_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();

					const latest_chapter_num = chapter_count_elem_Text.split(`/`).at(0);

					return latest_chapter_num;
				})();


				// Calculate appropriate padding count for lastChapter
				const chapNumPadCount = (function () {
					if (latest_chapter_number.length >= 3) {
						return 3;
					} else {
						return 2;
					}
				})();


				// Retrieve last chapter of work
				const wrk_lastChapter = `Chapter ${latest_chapter_number.padStart(chapNumPadCount, `0`)}`;

				return wrk_lastChapter;

			}
		})();


		// define autotag_status for use in AutoTag()
		const autotag_status = StatusForAutoTag();


		/* ///////////////// USER CONFIGURABLE SETTINGS ///////////////// */
		/*
		// Below are the configurations for the autogenerated bookmark content, including the date configuraton
		// THE CONFIGURATION RELIES HEAVILY ON TEMPLATE LITERALS
		// FOR MORE INFORMATION ON TEMPLATE LITERALS PLEASE VISIT THE FOLLOWING WEBPAGE
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		*/

		/* ///////////////// Bookmark content configuration section ///////////////// */
		/*

		Variables that can be used when creating the string for newBookmarkNotes:
		- date_string               // String to show when the work was last read – User configurable in the Date configuration sub-section
		- title                     // Title of the work or series
		- author                    // Author of the work or series
		- author_HTML               // Author of the work or series, as an HTML <a> element (a link). e.g. the author_HTML string for AO3 work 54769867 would be '<a rel="author" href="/users/nescias/pseuds/nescias">nescias</a>'
		- AO3_status                // Status of the work or series. i.e. Completed: 2020-08-23, Updated: 2022-05-08, Published: 2015-06-29
		- relationships             // For work bookmarks, it's the Relationship tags present in the work and it will be a collapsible element in your work bookmark. For series bookmarks, it's all of the unique Relationship tags present in all the works in a series and it will be a collapsible element in your series bookmark
		- summary                   // Summary of the work or series
		- words                     // Current word count of the work or series
		- ws_id                     // ID of the work/series being bookmarked

		Variables specific to series:
		- series_works_titles_summaries    // Adds all of the summaries of the works in the series to the series bookmark

		Variables specific to works:
		- lastChapter               // Last published chapter of the work or series
		- fform_tags_list_HTML      // The freeform tags of a work as links in a list similar to that in the relationships variable
		- fform_tags_list_TXT       // The freeform tags of a work as plaintext (so you don't run into the character limit) in a list similar to that in the relationships variable
		- fform_tags_comma_HTML     // The freeform tags of a work as comma separated links
		- fform_tags_comma_TXT      // The freeform tags of a work as comma separated plaintext (so you don't run into the character limit)

		*/

		/* //// Date configuration sub-section //// */
		/*
		// THE CONFIGURATION RELIES HEAVILY ON TEMPLATE LITERALS
		// FOR MORE INFORMATION ON TEMPLATE LITERALS PLEASE VISIT THE FOLLOWING WEBPAGE
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		*/

		// Setting the date
		// Feel free to use your own date format, you don't need to stick to the presets here.
		// If you dont like the predefined vars for date, and your device supports the require field,
		// I've added the moment.js library which you can use to define your own date var.
		// e.g.
		// const date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
		// would give you something like the following string:
		// "Thursday, August 31st 2023, 4:38:35 pm"
		//
		// format guide available here: https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/

		const
			date = `${yyyy}/${mm}/${dd}`, // Date without time
			date_string = (function () {
				// Make the date string an empty string for series because it doesnt make sense there
				if (Boolean(seriesTrue)) {
					return ``;
				} else {
					return `(Approximate) Last Read: ${date}`;
				}
			})();
		// date = `${yyyy}/${mm}/${dd} ${hh}${mm}hrs`; // Date with time
		console.log(`
w4tchdoge's AO3 Bookmark Maker UserScript – Log
--------------------
Date Generated: ${date}
Date String Generated: ${date_string}`
		);

		/* ///////////// Select from Presets ///////////// */

		// To stop using a preset, wrap it in a block comment (add /* to the start and */ to the end); To start using a preset, do the opposite.
		// Remember to make sure the variables are set correctly for that preset
		// divider and splitSelect are set in the dropdown menu on your User Preferences page
		// new_notes is set at the bottom of the script
		// If you're experiencing any issues with the script, please do not hesitate to PM me on GreasyFork
		// I could have simply made a mistake in the documentation which is messing everything up (I am not infallible XD)

		// ------------------------

		// Preset 1 – With last read date
		// To use this preset, scroll to the top where the constants are defined and set divider and splitSelect to the following values:
		// divider = `</details>\n\n`
		// splitSelect = 1
		// new_notes = `${workInfo}\n\n${curr_notes}`

		workInfo = `<details><summary>Work/Series Details</summary>
\t${title} by ${author_HTML}
\t${AO3_status}
\tWork/Series ID: ${ws_id}
\t${relationships}
\t${fform_tags_comma_TXT}
\t<details><summary>Work/Series Summary:</summary>
\t${summary}</details>
${date_string}</details>`;

		// ------------------------

		// Preset 2 – Without last read date
		// To use this preset, scroll to the top where the constants are defined and set divider and splitSelect to the following values:
		// divider = `</details>\n\n`
		// splitSelect = 1
		// new_notes = `${workInfo}\n\n${curr_notes}`

		/* workInfo = `<details><summary>Work/Series Details</summary>
\t${title} by ${author_HTML}
\t${AO3_status}
\tWork/Series ID: ${ws_id}
\t${relationships}
\t<details><summary>Work/Series Summary:</summary>
\t${summary}</details>
</details>`; */

		// ------------------------

		// Preset 3 – Preset 1 but reversed
		// To use this preset, scroll to the top where the constants are defined and set divider and splitSelect to the following values:
		// divider = `<br />\n<details>`
		// splitSelect = 0
		// new_notes = `${curr_notes}<br />\n${workInfo}`

		/* workInfo = `<details><summary>Work/Series Details</summary>
\t${title} by ${author_HTML}
\t${AO3_status}
\tWork/Series ID: ${ws_id}
\t${relationships}
\t<details><summary>Work/Series Summary:</summary>
\t${summary}</details>
${date_string}</details>`; */

		// ------------------------

		// Preset 4 – Preset 2 but reversed
		// To use this preset, scroll to the top where the constants are defined and set divider and splitSelect to the following values:
		// divider = `<br />\n<details>`
		// splitSelect = 0
		// new_notes = `${curr_notes}<br />\n${workInfo}`

		/* workInfo = `<details><summary>Work/Series Details</summary>
\t${title} by ${author_HTML}
\t${AO3_status}
\tWork/Series ID: ${ws_id}
\t${relationships}
\t<details><summary>Work/Series Summary:</summary>
\t${summary}</details>
</details>`; */

		// ------------------------

		// Auto Tag Feature

		async function AutoTag() {

			function inRange(input, minimum, maximum) {
				return input >= minimum && input <= maximum;
			}

			let tag_input_box = document.querySelector('.input #bookmark_tag_string_autocomplete');

			// Original AutoTag Behaviour
			// As suggested by `oliver t` @ https://greasyfork.org/en/scripts/467885/discussions/198028
			if (inRange(AutoTag_type, 0, 1) && AutoTag_type == 0) {
				let word_count_tag = ``;

				const AT_words = (function () {
					let
						AT_words_XPath = './/*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Words:"]/following-sibling::*[1]/self::dd',
						AT_words = document.evaluate(AT_words_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.toString().replaceAll(/[, \s]/gi, '');

					AT_words = parseInt(AT_words);
					return AT_words;
				})();

				// Define Word Count Tag
				// In case you want to add more tags or change the word count range for each tag,
				// here are some recourses on how comparators work in JavaScript:
				// StackOverflow answer that shows you how equalities work: https://stackoverflow.com/a/14718577/11750206
				// An overview of JavaScript's Comparison and Logical Operators: https://www.w3schools.com/js/js_comparisons.asp
				if (AT_words < 1000) { word_count_tag = 'Word Count: Word Count: 0-1.000'; }
				if (AT_words < 5000 && AT_words >= 1000) { word_count_tag = 'Word Count: 1.000-5.000'; }
				if (AT_words < 10000 && AT_words >= 5000) { word_count_tag = 'Word Count: 5.000-10.000'; }
				if (AT_words < 15000 && AT_words >= 10000) { word_count_tag = 'Word Count: 10.000-15.000'; }
               	if (AT_words < 20000 && AT_words >= 15000) { word_count_tag = 'Word Count: 15.000-20.000'; }
               	if (AT_words < 25000 && AT_words >= 20000) { word_count_tag = 'Word Count: 20.000-25.000'; }
               	if (AT_words < 30000 && AT_words >= 25000) { word_count_tag = 'Word Count: 25.000-30.000'; }
               	if (AT_words < 35000 && AT_words >= 30000) { word_count_tag = 'Word Count: 30.000-35.000'; }
               	if (AT_words < 40000 && AT_words >= 35000) { word_count_tag = 'Word Count: 35.000-40.000'; }
                if (AT_words < 45000 && AT_words >= 40000) { word_count_tag = 'Word Count: 40.000-45.000'; }
                if (AT_words < 50000 && AT_words >= 45000) { word_count_tag = 'Word Count: 45.000-50.000'; }
                if (AT_words < 55000 && AT_words >= 50000) { word_count_tag = 'Word Count: 55.000-60.000'; }
                if (AT_words < 60000 && AT_words >= 55000) { word_count_tag = 'Word Count: 60.000-65.000'; }
                if (AT_words < 65000 && AT_words >= 60000) { word_count_tag = 'Word Count: 65.000-70.000'; }
                if (AT_words < 70000 && AT_words >= 65000) { word_count_tag = 'Word Count: 70.000-75.000'; }
                if (AT_words < 75000 && AT_words >= 70000) { word_count_tag = 'Word Count: 75.000-80.000'; }
                if (AT_words < 80000 && AT_words >= 75000) { word_count_tag = 'Word Count: 80.000-85.000'; }
                if (AT_words < 85000 && AT_words >= 80000) { word_count_tag = 'Word Count: 85.000-90.000'; }
                if (AT_words < 90000 && AT_words >= 95000) { word_count_tag = 'Word Count: 90.000-95.000'; }
                if (AT_words < 100000 && AT_words >= 95000) { word_count_tag = 'Word Count: 95.000-100.000'; }
                if (AT_words < 150000 && AT_words >= 100000) { word_count_tag = 'Word Count: 100k+'; }
                if (AT_words < 20000 && AT_words >= 150000) { word_count_tag = 'Word Count: 150k+'; }
				if (AT_words >= 200000) { word_count_tag = 'Word Count: 200k+'; }

				// Put the Auto Tags into the User Tags field
				tag_input_box.value = `${autotag_status}, ${word_count_tag}`;
			}

			// AutoTag using canonical AO3 "Wordcount Over *" tags for the word count
			// As suggested by `prismbox` @ https://greasyfork.org/en/scripts/467885/discussions/255399
			if (inRange(AutoTag_type, 0, 1) && AutoTag_type == 1) {
				let word_count_tag_arr = [];

				const AT_words = (function () {
					let
						AT_words_XPath = './/*[@id="main"]//dl[contains(concat(" ",normalize-space(@class)," ")," stats ")]//dt[text()="Words:"]/following-sibling::*[1]/self::dd',
						AT_words = document.evaluate(AT_words_XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.toString().replaceAll(/[, \s]/gi, '');

					AT_words = parseInt(AT_words);
					return AT_words;
				})();

				const canon_AO3_wc_lims = await (async () => {
					// Try to fetch the "Canon AO3 Wordcount Over *" tag page to get the canon wordcounts
					try {
						// Fetch word count page
						const canon_wc_over_pg_resp_text = await (async () => {
							const fetch_url = `https://archiveofourown.org/tags/search?tag_search[name]=wordcount+over&tag_search[fandoms]=&tag_search[type]=&tag_search[canonical]=T&tag_search[sort_column]=name&tag_search[sort_direction]=asc&commit=Search+Tags`;
							const fetch_resp = await fetch(fetch_url);
							const resp_text = await fetch_resp.text();
							return resp_text;
						})();

						// Parse fetched page to get word counts as an array of ints
						const html_parser = new DOMParser();
						const cwco_pg_HTML = html_parser.parseFromString(canon_wc_over_pg_resp_text, `text/html`);
						const cwco_tags_int_arr = Array.from(cwco_pg_HTML.querySelectorAll(`#main .tag.index.group li`))
							.map(elm => parseInt(elm.firstChild.textContent.trim().replace(/^Freeform: Wordcount: Over | \u200e\(\d+\)$/g, ``).replace(`.`, ``)))
							.sort((a, b) => a.toString().localeCompare(b, undefined, { numeric: true }));

						// Throw error if array is empty
						if (!Array.isArray(cwco_tags_int_arr) || !cwco_tags_int_arr.length) {
							throw new Error(`Fetching of "Canon AO3 Wordcount Over *" tags failed! Switching to hardcoded fallback.`);
						}

						return cwco_tags_int_arr;

					}
					// Catch any thrown error and fallback to hardcoded wordcounts when the above fails
					catch (arrempty_error) {
						console.error(arrempty_error);
						return [1, 10, 20, 30, 50, 100, 150, 200, 500].map(x => x * 1000);
					}

				})();

				// Define Word Count Tag
				// In case you want to add more tags or change the word count range for each tag,
				// here are some recourses on how comparators work in JavaScript:
				// StackOverflow answer that shows you how equalities work: https://stackoverflow.com/a/14718577/11750206
				// An overview of JavaScript's Comparison and Logical Operators: https://www.w3schools.com/js/js_comparisons.asp
				canon_AO3_wc_lims.forEach(element => {
					if (AT_words > element) {
						word_count_tag_arr.push(`Wordcount: Over ${(new Intl.NumberFormat({ style: `decimal` }).format(element)).replaceAll(`,`, `.`)}`);
					}
				});

				// Put the Auto Tags into the User Tags field
				tag_input_box.value = `${autotag_status}, ${word_count_tag_arr.join(`, `)}`;
			}

			if (!inRange(AutoTag_type, 0, 1)) { console.log(`AutoTag_type is not between 0 and 1. Please contact me (the script author) on GreasyFork for troubleshooting`); }

		}

		// ------------------------

		// You are free to define your own string for the new_notes variable as you see fit

		// Fills the bookmark box with the autogenerated bookmark
		const new_notes = `${workInfo}\n\n${curr_notes}`;
		document.getElementById("bookmark_notes").innerHTML = new_notes;

	}

	console.log(`Ending w4BM userscript execution: ${performance.now() - s_t}ms`);

})();
