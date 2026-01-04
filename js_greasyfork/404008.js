// ==UserScript==
// @name         AO3: Page Count
// @namespace    https://greasyfork.org/en/scripts/404008-ao3-page-count
// @version      0.1
// @description  Displays AO3 works' word counts as the equivalent page count in traditionally published works.
// @author       AlexSeanchai
// @match        https://archiveofourown.org/*
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404008/AO3%3A%20Page%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/404008/AO3%3A%20Page%20Count.meta.js
// ==/UserScript==

// ~~ SETTINGS ~~ //

// how many words per page?

var words_per = 350;

// ~~ END OF SETTINGS ~~ //

// STUFF HAPPENS BELOW; mostly stolen wholesale from Min at https://greasyfork.org/en/scripts/3144-ao3-kudos-hits-ratio/code //

(function($) {

	// set default for countableness
	var countable = false;

	// check if it's a list of works or bookmarks, or header on work page
	checkCountable();

	// check if it's a list of works/bookmarks/statistics, or header on work page
	function checkCountable() {

		var found_stats = $('dl.stats');

		if (found_stats.length) {

			countable = true;
		}
	}

    countPages();

	function countPages() {

		if (countable) {

			$('dl.stats').each(function() {

				var words_value = $(this).find('dd.words');
                console.log(words_value);

				// if words were found
				if (words_value.length !== '0') {

                    // ditch commas
                    var words_str = words_value[0].textContent.replace(",", "");
                    console.log(words_str);

                    // get counts
					var words_count = parseInt(words_str);
                    console.log(words_count);

					// count pages
					var pages = words_count / words_per;
                    console.log(pages);

					// round up to nearest integer
					var pages_print = Math.ceil(pages);

					// add page count
					var pages_label = $('<dt class="pagecount"></dt>').text('Page Count:');
					var pages_value = $('<dd class="pagecount"></dd>').text(pages_print);
					words_value.after('\n', pages_label, '\n', pages_value);

                    // add attribute to the blurb for sorting
					$(this).closest('li').attr('pagescount', pages);
				}
				else {
				}
			});
		}
	}

})(jQuery);