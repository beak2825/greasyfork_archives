// ==UserScript==
// @name        AO3: Estimated reading time
// @description Add an estimated reading time to a fic description.
// @author	    oulfis
// @version	    1.0
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @namespace https://greasyfork.org/users/394634
// @downloadURL https://update.greasyfork.org/scripts/391940/AO3%3A%20Estimated%20reading%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/391940/AO3%3A%20Estimated%20reading%20time.meta.js
// ==/UserScript==

// This script is adapted from Min's very useful kudos/hits ratio script, https://greasyfork.org/scripts/3144-ao3-kudos-hits-ratio
// It might still contain some vestigial code from that script (sorry)

// ~~ SETTINGS ~~ //

// how many words per minute do you want to say your reading speed is?
var wpm = 250;

// count readtime automatically: true/false
var always_count = true;

// colour background depending on readtime: true/false
var colourbg = true;

// lvl1 & lvl2 - time levels separating red, yellow and green background (in minutes)
var lvl1 = 30;  // fics that take more than this many minutes to read will be yellow or read
var lvl2 = 90; // fics that take more than this many minutes to read will be red

// ratio_red, ratio_yellow, ratio_green - background colours
var ratio_red = '#ffdede';
var ratio_yellow = '#fdf2a3';
var ratio_green = '#c4eac3';

// ~~ END OF SETTINGS ~~ //



// STUFF HAPPENS BELOW //

(function($) {

	// check user settings
	if (typeof(Storage) !== 'undefined') {

		var always_count_set = localStorage.getItem('alwayscountlocal');
		var always_sort_set = localStorage.getItem('alwayssortlocal');
		var hide_hitcount_set = localStorage.getItem('hidehitcountlocal');

		if (always_count_set == 'no') {
			always_count = false;
		}

	}

	// set defaults for countableness and sortableness
	var countable = false;
	var sortable = false;
	var stats_page = false;

	// check if it's a list of works or bookmarks, or header on work page, and attach the menu
	checkCountable();

	// if set to automatic
	if (always_count) {
		countRatio();
	}




	// check if it's a list of works/bookmarks/statistics, or header on work page
	function checkCountable() {

		var found_stats = $('dl.stats');

		if (found_stats.length) {

			if (found_stats.closest('li').is('.work') || found_stats.closest('li').is('.bookmark')) {
				countable = true;
				sortable = true;

				addRatioMenu();
			}
			else if (found_stats.parents('.statistics').length) {
				countable = true;
				sortable = true;
				stats_page = true;

				addRatioMenu();
			}
			else if (found_stats.parents('dl.work').length) {
				countable = true;

				addRatioMenu();
			}
		}
	}


	function countRatio() {

		if (countable) {

			$('dl.stats').each(function() {

                var words_value = $(this).find('dd.words'); // for some reason this can't read past the comma, and gets just the thousands

				// if hits and kudos were found
				if (words_value.length !== '0') {

					// get counts
                    var words_count = parseInt(words_value.text().replace(/,/g, ''));

                    // count minutes
                    var minutes = words_count/250;

					// get minutes with zero decimal points
                    var minutes_print = minutes.toFixed(0);

                    // add readtime stats
					var ratio_label = $('<dt class="kudoshits"></dt>').text('Readtime:');
					var ratio_value = $('<dd class="kudoshits"></dd>').text(minutes_print + ' min');
					words_value.after('\n', ratio_label, '\n', ratio_value);

					if (colourbg) {
						// colour background depending on percentage
						if (minutes <= lvl1) {
							ratio_value.css('background-color', ratio_green);
						}
						else if (minutes <= lvl2) {
							ratio_value.css('background-color', ratio_yellow);
						}
						else {
							ratio_value.css('background-color', ratio_red);
						}
					}

				}
			});
		}
	}


	// attach the menu
	function addRatioMenu() {

		// get the header menu
		var header_menu = $('ul.primary.navigation.actions');

		// create and insert menu button
		var ratio_menu = $('<li class="dropdown"></li>').html('<a>Readtime</a>');
		header_menu.find('li.search').before(ratio_menu);

		// create and append dropdown menu
		var drop_menu = $('<ul class="menu dropdown-menu"></li>');
		ratio_menu.append(drop_menu);

		// create button - count
		var button_count = $('<li></li>').html('<a>Count readtime now on this page</a>');
		button_count.click(function() {countRatio();});

		// create button - always count
		var button_count_yes = $('<li class="count-yes"></li>').html('<a>Always count (click to change): YES</a>');
		drop_menu.on('click', 'li.count-yes', function() {
			localStorage.setItem('alwayscountlocal', 'no');
			button_count_yes.replaceWith(button_count_no);
		});

		// create button - not always count
		var button_count_no = $('<li class="count-no"></li>').html('<a>Always count (click to change): NO</a>');
		drop_menu.on('click', 'li.count-no', function() {
			localStorage.setItem('alwayscountlocal', 'yes');
			button_count_no.replaceWith(button_count_yes);
		});


		// append buttons to the dropdown menu
		drop_menu.append(button_count);

		if (typeof(Storage) !== 'undefined') {

			if (always_count) {
				drop_menu.append(button_count_yes);
			}
			else {
				drop_menu.append(button_count_no);
			}

		}
	}

})(jQuery);
