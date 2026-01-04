// ==UserScript==
// @name        AO3: Estimated Reading Time v2
// @description Add an estimated reading time to a fic description in hours and minutes.
// @author      lomky
// @version	1.0
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @namespace https://greasyfork.org/users/718789
// @downloadURL https://update.greasyfork.org/scripts/433083/AO3%3A%20Estimated%20Reading%20Time%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/433083/AO3%3A%20Estimated%20Reading%20Time%20v2.meta.js
// ==/UserScript==

// This script adapted from oulfis' original Estimated Reading Time https://greasyfork.org/en/scripts/391940-ao3-estimated-reading-time
// Fixes initial WPM bug and removes vestigle code from their adaption of 
// Min's kudos/hits ratio script, https://greasyfork.org/scripts/3144-ao3-kudos-hits-ratio

// ~~ SETTINGS ~~ //

// how many words per minute do you want to say your reading speed is?
var wpm = 375;

// count readtime automatically: true/false
var always_count = true;

// colour background depending on readtime: true/false
var colourbg = true;

// lvl1 & lvl2 - time levels separating red, yellow and green background (in minutes)
var lvl1 = 60;  // fics that take more than this many minutes to read will be yellow or read
var lvl2 = 160; // fics that take more than this many minutes to read will be red

// highlight_red, highlight_yellow, highlight_green - background colours
var highlight_red = '#ffdede';
var highlight_yellow = '#fdf2a3';
var highlight_green = '#c4eac3';

// ~~ END OF SETTINGS ~~ //



// STUFF HAPPENS BELOW //

(function($) {

	// check user settings
	if (typeof(Storage) !== 'undefined') {

		var always_count_set = localStorage.getItem('alwayscountlocal');
		
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
		calculateReadtime();
	}




	// check if it's a list of works/bookmarks/statistics, or header on work page
	function checkCountable() {

		var found_stats = $('dl.stats');

		if (found_stats.length) {

			if (found_stats.closest('li').is('.work') || found_stats.closest('li').is('.bookmark')) {
				countable = true;
				sortable = true;

				addReadtimeMenu();
			}
			else if (found_stats.parents('.statistics').length) {
				countable = true;
				sortable = true;
				stats_page = true;

				addReadtimeMenu();
			}
			else if (found_stats.parents('dl.work').length) {
				countable = true;

				addReadtimeMenu();
			}
		}
	}


	function calculateReadtime() {

		if (countable) {

			$('dl.stats').each(function() {

                var words_value = $(this).find('dd.words'); // for some reason this can't read past the comma, and gets just the thousands

				// if hits and kudos were found
				if (words_value.length !== '0') {

					// get counts
                    var words_count = parseInt(words_value.text().replace(/,/g, ''));

          // count minutes
          var minutes = words_count/(wpm);

          var hrs = Math.floor(minutes/60);
          var mins = (minutes%60).toFixed(0);
          
					// get minutes with zero decimal points
          var minutes_print = hrs > 0 ? hrs + "h" + mins + "m" : mins + "m"

                    // add readtime stats
					var readtime_label = $('<dt class="kudoshits"></dt>').text('Readtime:');
					var readtime_value = $('<dd class="kudoshits"></dd>').text(minutes_print);
					words_value.after('\n', readtime_label, '\n', readtime_value);

					if (colourbg) {
						// colour background depending on percentage
						if (minutes <= lvl1) {
							readtime_value.css('background-color', highlight_green);
						}
						else if (minutes <= lvl2) {
							readtime_value.css('background-color', highlight_yellow);
						}
						else {
							readtime_value.css('background-color', highlight_red);
						}
					}

				}
			});
		}
	}


	// attach the menu
	function addReadtimeMenu() {

		// get the header menu
		var header_menu = $('ul.primary.navigation.actions');

		// create and insert menu button
		var readtime_menu = $('<li class="dropdown"></li>').html('<a>Readtime</a>');
		header_menu.find('li.search').before(readtime_menu);

		// create and append dropdown menu
		var drop_menu = $('<ul class="menu dropdown-menu"></li>');
		readtime_menu.append(drop_menu);

		// create button - count
		var button_count = $('<li></li>').html('<a>Calculate readtime now on this page</a>');
		button_count.click(function() {calculateReadtime();});

		// create button - always count
		var button_count_yes = $('<li class="count-yes"></li>').html('<a>Always calculate (click to change): YES</a>');
		drop_menu.on('click', 'li.count-yes', function() {
			localStorage.setItem('alwayscountlocal', 'no');
			button_count_yes.replaceWith(button_count_no);
		});

		// create button - not always count
		var button_count_no = $('<li class="count-no"></li>').html('<a>Always calculate (click to change): NO</a>');
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
