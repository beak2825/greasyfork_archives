// ==UserScript==
// @name        AO3: Bookmarks/Kudos ratio, or 'How likely you are to enjoy a fic.'
// @description Replace hitcount with bookmarks/kudos percentage. Sort works on the page by this ratio.
// @namespace	https://greasyfork.org/scripts/3144-ao3-bookmarks-kudos-ratio
// @author	Original author Min, modified by Neeve @ BTSContentIndex
// @version	2.1
// @history	1.4 - always show kudos on stats page, require jquery (for firefox)
// @history	1.3 - works for statistics, option to show hitcount
// @history	1.2 - makes use of new stats classes
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/375705/AO3%3A%20BookmarksKudos%20ratio%2C%20or%20%27How%20likely%20you%20are%20to%20enjoy%20a%20fic%27.user.js
// @updateURL https://update.greasyfork.org/scripts/375705/AO3%3A%20BookmarksKudos%20ratio%2C%20or%20%27How%20likely%20you%20are%20to%20enjoy%20a%20fic%27.meta.js
// ==/UserScript==

// ~~ SETTINGS ~~ //

// count bookmarks/kudos automatically: true/false
var always_count = true;

// sort works on this page by bookmarks/kudos ratio in descending order automatically: true/false
var always_sort = true;

// hide hitcount: true/false
var hide_hitcount = false;

// colour background depending on percentage: true/false
var colourbg = true;

// lvl1 & lvl2 - percentage levels separating red, yellow and green background; ratio_red, ratio_yellow, ratio_green - background colours
// THIS IS WHERE YOU CHANGE YOUR PERCENTAGE TO FIT YOUR OWN SETTINGS. Anything above 27 = Green, anything between 18 and 27 = yellow.
var ratio_red = '#ffdede';
var lvl1 = 18;
var ratio_yellow = '#fdf2a3';
var lvl2 = 27;
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

		if (always_sort_set == 'yes') {
			always_sort = true;
		}

		if (hide_hitcount_set == 'no') {
			hide_hitcount = false;
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

		if (always_sort) {
			sortByRatio();
		}
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

				var kudos_value = $(this).find('dd.kudos');
				var bookmarks_value = $(this).find('dd.bookmarks');

				// if kudos and bookmarks were found
				if (bookmarks_value.length && kudos_value.length && kudos_value.text() !== '0') {

					// get counts
					var kudos_count = parseInt(kudos_value.text());
					var bookmarks_count = parseInt(bookmarks_value.text());

					// count percentage
					var percents = 100*bookmarks_count/kudos_count;

					// get percentage with one decimal point
					var percents_print = percents.toFixed(0).replace('.','.');

					// add ratio stats
					var ratio_label = $('<dt class="bookmarkskudos"></dt>').text('Bookmarks/Kudos Value:');
					var ratio_value = $('<dd class="bookmarkskudos"></dd>').text(percents_print + ' %');
					kudos_value.after('\n', ratio_label, '\n', ratio_value);

					if (colourbg) {
						// colour background depending on percentage
						if (percents >= lvl2) {
							ratio_value.css('background-color', ratio_green);
						}
						else if (percents >= lvl1) {
							ratio_value.css('background-color', ratio_yellow);
						}
						else {
							ratio_value.css('background-color', ratio_red);
						}
					}

					if (hide_hitcount && !stats_page) {
						// hide hitcount label and value
						$(this).find('.kudos').css('display', 'none');
					}

					// add attribute to the blurb for sorting
					$(this).closest('li').attr('bookmarkspercent', percents);
				}
				else {
					// add attribute to the blurb for sorting
					$(this).closest('li').attr('bookmarkspercent', 0);
				}
			});
		}
	}


	function sortByRatio(ascending) {

		if (sortable) {

			var sortable_lists = $('dl.stats').closest('li').parent();

			sortable_lists.each(function() {

				var list_elements = $(this).children('li');

				// sort by bookmarks/kudos ratio in descending order
				list_elements.sort(function(a, b) {
					return parseFloat(b.getAttribute('bookmarkspercent')) - parseFloat(a.getAttribute('bookmarkspercent'));
				});

				if (ascending) {
					$(list_elements.get().reverse()).detach().appendTo($(this));
				}
				else {
					list_elements.detach().appendTo($(this));
				}
			});
		}
	}


	// attach the menu
	function addRatioMenu() {

		// get the header menu
		var header_menu = $('ul.primary.navigation.actions');

		// create and insert menu button
		var ratio_menu = $('<li class="dropdown"></li>').html('<a>bookmarks/kudos</a>');
		header_menu.find('li.search').before(ratio_menu);

		// create and append dropdown menu
		var drop_menu = $('<ul class="menu dropdown-menu"></li>');
		ratio_menu.append(drop_menu);

		// create button - count
		var button_count = $('<li></li>').html('<a>Count on this page</a>');
		button_count.click(function() {countRatio();});

		// create button - sort
		var button_sort = $('<li></li>').html('<a>Sort on this page</a>');
		button_sort.click(function() {sortByRatio();});

		// create button - settings
		var button_settings = $('<li></li>').html('<a style="padding: 0.5em 0.5em 0.25em; text-align: center; font-weight: bold;">&mdash; Settings (click to change): &mdash;</a>');

		// create button - always count
		var button_count_yes = $('<li class="count-yes"></li>').html('<a>Count automatically: YES</a>');
		drop_menu.on('click', 'li.count-yes', function() {
			localStorage.setItem('alwayscountlocal', 'no');
			button_count_yes.replaceWith(button_count_no);
		});

		// create button - not always count
		var button_count_no = $('<li class="count-no"></li>').html('<a>Count automatically: NO</a>');
		drop_menu.on('click', 'li.count-no', function() {
			localStorage.setItem('alwayscountlocal', 'yes');
			button_count_no.replaceWith(button_count_yes);
		});

		// create button - always sort
		var button_sort_yes = $('<li class="sort-yes"></li>').html('<a>Sort automatically: YES</a>');
		drop_menu.on('click', 'li.sort-yes', function() {
			localStorage.setItem('alwayssortlocal', 'no');
			button_sort_yes.replaceWith(button_sort_no);
		});

		// create button - not always sort
		var button_sort_no = $('<li class="sort-no"></li>').html('<a>Sort automatically: NO</a>');
		drop_menu.on('click', 'li.sort-no', function() {
			localStorage.setItem('alwayssortlocal', 'yes');
			button_sort_no.replaceWith(button_sort_yes);
		});

		// create button - hide hitcount
		var button_hide_yes = $('<li class="hide-yes"></li>').html('<a>Hide kudos: YES</a>');
		drop_menu.on('click', 'li.hide-yes', function() {
			localStorage.setItem('hidehitcountlocal', 'no');
			$('.stats .kudos').css('display', '');
			button_hide_yes.replaceWith(button_hide_no);
		});

		// create button - don't hide hitcount
		var button_hide_no = $('<li class="hide-no"></li>').html('<a>Hide kudos: NO</a>');
		drop_menu.on('click', 'li.hide-no', function() {
			localStorage.setItem('hidehitcountlocal', 'yes');
			$('.stats .kudos').css('display', 'none');
			button_hide_no.replaceWith(button_hide_yes);
		});

		// append buttons to the dropdown menu
		drop_menu.append(button_count);

		if (sortable) {
			drop_menu.append(button_sort);
		}

		if (typeof(Storage) !== 'undefined') {

			drop_menu.append(button_settings);

			if (always_count) {
				drop_menu.append(button_count_yes);
			}
			else {
				drop_menu.append(button_count_no);
			}

			if (always_sort) {
				drop_menu.append(button_sort_yes);
			}
			else {
				drop_menu.append(button_sort_no);
			}

			if (hide_hitcount) {
				drop_menu.append(button_hide_yes);
			}
			else {
				drop_menu.append(button_hide_no);
			}
		}

		// add button for statistics
		if ($('#main').is('.stats-index')) {

			var button_sort_stats = $('<li></li>').html('<a>↓&nbsp;bookmarks/kudos</a>');
			button_sort_stats.click(function() {
				sortByRatio();
				button_sort_stats.after(button_sort_stats_asc).detach();
			});

			var button_sort_stats_asc = $('<li></li>').html('<a>↑&nbsp;bookmarks/kudos</a>');
			button_sort_stats_asc.click(function() {
				sortByRatio(true);
				button_sort_stats_asc.after(button_sort_stats).detach();
			});

			$('ul.sorting.actions li:nth-child(3)').after('\n', button_sort_stats);
		}
	}

})(jQuery);