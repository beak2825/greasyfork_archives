// ==UserScript==
// @name           Scribble Hub: Display Current Chapter Word Count
// @namespace      https://github.com/w4tchdoge
// @version        1.1.2-20240513_200521
// @description    Adds the word count of the current chapter underneath the chapter statistics
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://*.scribblehub.com/read/*/chapter/*
// @license        AGPL-3.0-or-later
// @history        1.1.2 — Fix script not working on chapters without an author note
// @history        1.1.1 — Switch to using Intl.NumberFormat for making the word count thousands separated
// @history        1.1.0 — Change position of word count element and change wording of word count
// @history        1.0.0 — Initial release
// @downloadURL https://update.greasyfork.org/scripts/485537/Scribble%20Hub%3A%20Display%20Current%20Chapter%20Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/485537/Scribble%20Hub%3A%20Display%20Current%20Chapter%20Word%20Count.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	// Attempted conversion of the Ruby regex code AO3 uses to JavaScript by looking at:
	// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/config/config.yml#L453
	// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L26
	// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L30C9-L31C95
	// Has not been tested on non-English works, feedback would be appreciated
	const word_count_regex = /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Thai}|((?!\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Thai})\w)+/gu;

	// Get element that contains the chapter stats
	const chp_stats = document.querySelector(`#main\\ read\\ chapter .chapter_stats`);

	// Def vars used in word counting
	// var chp_raw_node, auth_note_node, chp_raw_text, auth_note_text, chp_raw_word_count, auth_note_word_count, word_count;
	var chp_raw_node, auth_note_node, chp_raw_text, auth_note_text, chp_raw_word_count, auth_note_word_count, word_count;

	// Get 1st elem to be word counted
	chp_raw_node = document.querySelector(`#chp_raw`).cloneNode(true);

	// Get the text context of the elements to be counted
	// chp_raw_text = chp_raw_node.textContent;
	// auth_note_text = auth_note_node.textContent;

	// Count the number of words
	// Counting method from:
	// https://stackoverflow.com/a/76673564/11750206
	// Regex substitutions from:
	// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L30C33-L30C68
	// chp_raw_word_count = [...chp_raw_text.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex)].length;
	// auth_note_word_count = [...auth_note_text.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex)].length;

	// if-else for the case that the author note does not exist
	if (Boolean(document.querySelector(`#chp_raw div .wi_authornotes_body`))) { // if author notes exists

		// Remove auth note from chp_raw_node
		chp_raw_node.removeChild(chp_raw_node.querySelector(`div.wi_authornotes`));

		// Get chp text to be counted
		chp_raw_text = chp_raw_node.textContent;

		// Get 2nd elem to be word counted
		auth_note_node = document.querySelector(`#chp_raw div .wi_authornotes_body`).cloneNode(true);

		// Get auth note text to be counted
		auth_note_text = auth_note_node.textContent;

		// Count the number of words
		// Counting method from:
		// https://stackoverflow.com/a/76673564/11750206
		// Regex substitutions from:
		// https://github.com/otwcode/otwarchive/blob/943f585818005be8df269d84ca454af478150e75/lib/word_counter.rb#L30C33-L30C68
		chp_raw_word_count = [...chp_raw_text.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex)].length;
		auth_note_word_count = [...auth_note_text.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex)].length;

		// Check if chapter word count is very small
		// If true use auth_note_word_count as word count
		// const chp_raw_frac_total_count = chp_raw_word_count / (chp_raw_word_count + auth_note_word_count);
		const chp_raw_frac_total_count = chp_raw_word_count / (chp_raw_word_count + auth_note_word_count);
		if (chp_raw_frac_total_count < 0.05) {
			word_count = auth_note_word_count;
		} else {
			word_count = chp_raw_word_count;
		}

	}
	else {
		// Get the text to be counted
		chp_raw_text = chp_raw_node.textContent;
		// count the text
		word_count = [...chp_raw_text.replaceAll(/--/g, `—`).replaceAll(/['’‘-]/g, ``).matchAll(word_count_regex)].length;
	}

	// Add thousands seperators to the word count
	// Reference for Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
	word_count = new Intl.NumberFormat({ style: "decimal" }).format(word_count);

	// console.log(`SH Ch Word Counter Output: ${word_count}`);

	// Create element that will display the current chapter word count
	var WordCount_elm = Object.assign(document.createElement(`span`), {
		id: `userscript-word-count-span`,
		style: `display: block; text-align: center; margin: 0.5em 0 0 0`,
		innerHTML: `Words in Chapter: ${word_count}`
	});

	// Add the word count element
	chp_stats.after(WordCount_elm);
})();
