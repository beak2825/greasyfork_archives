// ==UserScript==
// @name           AO3: Get Current Chapter Word Count
// @namespace      https://github.com/w4tchdoge
// @version        1.2.1-20260102_220051
// @description    Counts and displays the number of words in the current chapter
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
// @history        1.2.1 — Prevent script from running on multi-chapter works which only have 1 chapter published.
// @history        1.2.0 — Replace \w with [\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}] in the regular expession as that is the proper JavaScript equivalent to Ruby's [[:word:]]. Add support for most Unicode scripts supported in regular expressions. Use Array.from() instead of the spread syntax to convert the RegExpStringIterator into a countable array. Add *://archiveofourown.org/*chapters/* as a @match rule so that the script can work on URLs such as https://archiveofourown.org/chapters/141182779. Add *://archiveofourown.org/*works/*/navigate as an @exclude rule so the script does not run on the index page.
// @history        1.1.3 — Get rid of the element containing the words "Chapter Text" using removeChild() so I don't have to use RegEx to get rid of it. Also some miscellaneous cleanup
// @history        1.1.2 — Switch to using Intl.NumberFormat for making the word count thousands separated
// @history        1.1.1 — Modify the match rule so that it matches collections/*/works URLs as well; Add an exlude role so it doesn't work on works/*/bookmarks pages as it isn't designed to
// @history        1.1.0 — Implement a counting method that uses an attempted conversion of the Ruby regex code used by AO3 to JavaScript
// @downloadURL https://update.greasyfork.org/scripts/469161/AO3%3A%20Get%20Current%20Chapter%20Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/469161/AO3%3A%20Get%20Current%20Chapter%20Word%20Count.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	// Get the current chapter count as a integer number
	const curr_chp_cnt = parseInt(document.querySelector(`dd.stats dd.chapters`).textContent.split(`/`).at(0));

	// Execute script only on multi-chapter works which have more than one chapter published and only when a single chapter is being viewed
	if (window.location.pathname.toLowerCase().includes(`chapters`) && curr_chp_cnt > 1) {

		// Get the Chapter Text
		const chapter_text = (function () {
			// Get the HTML element containing the chapter's text content
			let elm_parent = document.querySelector(`[role="article"]:has(> #work)`).cloneNode(true);
			// Remove the child element with the text "Chapter Text"
			elm_parent.removeChild(elm_parent.querySelector(`#work`));

			// Return only the textContent of the HTML element
			return elm_parent.textContent.trim();
		})();

		// Couting and formatting the number of words
		const word_count = (function () {

			// Attempted conversion of the Ruby regex code AO3 uses to JavaScript by looking at:
			// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/config/config.yml#L453
			// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L26
			// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L30C9-L31C95
			// Has not been tested on non-English works, feedback would be appreciated
			// const word_count_regex = /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Thai}|((?!\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Thai})[\p{Letter}\p{Mark}\p{Number}\p{Connector_Punctuation}])+/gu;

			// Add support for most Unicode scripts supported in Regular Expressions
			// Vanilla AO3 compliant script_list:
			// const script_list = [`Han`, `Hiragana`, `Katakana`, `Thai`];
			// Full script_list:
			const script_list = [`Arabic`, `Armenian`, `Balinese`, `Bengali`, `Bopomofo`, `Braille`, `Buginese`, `Buhid`, `Canadian_Aboriginal`, `Carian`, `Cham`, `Cherokee`, `Common`, `Coptic`, `Cuneiform`, `Cypriot`, `Cyrillic`, `Deseret`, `Devanagari`, `Ethiopic`, `Georgian`, `Glagolitic`, `Gothic`, `Greek`, `Gujarati`, `Gurmukhi`, `Han`, `Hangul`, `Hanunoo`, `Hebrew`, `Hiragana`, `Inherited`, `Kannada`, `Katakana`, `Kayah_Li`, `Kharoshthi`, `Khmer`, `Lao`, `Latin`, `Lepcha`, `Limbu`, `Linear_B`, `Lycian`, `Lydian`, `Malayalam`, `Mongolian`, `Myanmar`, `New_Tai_Lue`, `Nko`, `Ogham`, `Ol_Chiki`, `Old_Italic`, `Old_Persian`, `Oriya`, `Osmanya`, `Phags_Pa`, `Phoenician`, `Rejang`, `Runic`, `Saurashtra`, `Shavian`, `Sinhala`, `Sundanese`, `Syloti_Nagri`, `Syriac`, `Tagalog`, `Tagbanwa`, `Tai_Le`, `Tamil`, `Telugu`, `Thaana`, `Thai`, `Tibetan`, `Tifinagh`, `Ugaritic`, `Vai`, `Yi`];
			// Excludes the Unicode scripts "Common" and "Latin" because that messes with the counting somehow
			// Exclude "Inherited" just to be safe
			const script_exclude_list = [`Common`, `Latin`, `Inherited`];
			const word_count_regex = new RegExp((function () {
				// Switch from using alternations in a group (e.g. (a|b|c)) to a character class (e.g. [abc]) for performance reasons (https://stackoverflow.com/a/27791811/11750206)
				const regex_scripts = script_list.filter((elm) => !script_exclude_list.includes(elm)).map((elm) => `\\p{Script=${elm}}`).join(``);
				const full_regex_str = `[${regex_scripts}]|((?![${regex_scripts}])[\\p{Letter}\\p{Mark}\\p{Number}\\p{Connector_Punctuation}])+`;
				return full_regex_str;
			})(), `gv`);

			// Count the number of words
			// Counting method from: https://stackoverflow.com/a/76673564/11750206, https://stackoverflow.com/a/69486719/11750206, and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
			// Regex substitutions from: https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L30C33-L30C68
			const word_count_arr = Array.from(chapter_text.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex), (m) => m[0]);
			const word_count_int = word_count_arr.length;

			// Format the integer number to a thousands separated string (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
			const word_count_str = new Intl.NumberFormat({ style: `decimal` }).format(word_count_int);

			return word_count_str;
		})();

		console.log(`Word Count: ${word_count} words`);

		// Create element with the text "Words in Chapter"
		const chap_word_count_text = Object.assign(document.createElement(`dt`), {
			id: `chapter_words_label`,
			className: `chapter_words`,
			textContent: `Words in Chapter:`
		});

		// Create element with the word count of the chapter
		const chap_word_count_num = Object.assign(document.createElement(`dd`), {
			id: `chapter_words_number`,
			className: `chapter_words`,
			textContent: word_count
		});

		// Get the element where the stats are displayed
		const stats_elem = document.querySelector(`#main dl.work.meta.group dl.stats`);

		// Append the created elements after the element containing the total word count of the fic
		stats_elem.querySelector(`dd.words`).after(chap_word_count_text, chap_word_count_num);
	}
})();
