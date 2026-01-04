// ==UserScript==
// @name        AO3: Kudos/hits ratio
// @description Replace hitcount with kudos/hits percentage. Sort works on the page by this ratio.
// @namespace	https://greasyfork.org/scripts/3144-ao3-kudos-hits-ratio
// @author	Min
// @version	1.4
// @history	1.4 - always show hits on stats page, require jquery (for firefox)
// @history	1.3 - works for statistics, option to show hitcount
// @history	1.2 - makes use of new stats classes
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/39466/AO3%3A%20Kudoshits%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/39466/AO3%3A%20Kudoshits%20ratio.meta.js
// ==/UserScript==

// ~~ SETTINGS ~~ //

// count kudos/hits automatically: true/false
var always_count = true;

// sort works on this page by kudos/hits ratio in descending order automatically: true/false
var always_sort = false;

// hide hitcount: true/false
var hide_hitcount = true;

// colour background depending on percentage: true/false
var colourbg = true;

// lvl1 & lvl2 - percentage levels separating red, yellow and green background; ratio_red, ratio_yellow, ratio_green - background colours
var ratio_red = '#ffdede';
var lvl1 = 4;
var ratio_yellow = '#fdf2a3';
var lvl2 = 7;
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

				var hits_value = $(this).find('dd.hits');
				var kudos_value = $(this).find('dd.kudos');

				// if hits and kudos were found
				if (kudos_value.length && hits_value.length && hits_value.text() !== '0') {

					// get counts
					var hits_count = parseInt(hits_value.text());
					var kudos_count = parseInt(kudos_value.text());

					// count percentage
					var percents = 100*kudos_count/hits_count;

					// if work is long, double ratio
					if (hits_count >= 1000) {
						percents = percents*2
					}

					// get percentage with one decimal point
					var percents_print = percents.toFixed(1).replace('.',',');

					// add ratio stats
					var ratio_label = $('<dt class="kudoshits"></dt>').text('Kudos/Hits:');
					var ratio_value = $('<dd class="kudoshits"></dd>').text(percents_print + '%');
					hits_value.after('\n', ratio_label, '\n', ratio_value);

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
						$(this).find('.hits').css('display', 'none');
					}

					// add attribute to the blurb for sorting
					$(this).closest('li').attr('kudospercent', percents);
				}
				else {
					// add attribute to the blurb for sorting
					$(this).closest('li').attr('kudospercent', 0);
				}
			});
		}
	}


	function sortByRatio(ascending) {

		if (sortable) {

			var sortable_lists = $('dl.stats').closest('li').parent();

			sortable_lists.each(function() {

				var list_elements = $(this).children('li');

				// sort by kudos/hits ratio in descending order
				list_elements.sort(function(a, b) {
					return parseFloat(b.getAttribute('kudospercent')) - parseFloat(a.getAttribute('kudospercent'));
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
		var ratio_menu = $('<li class="dropdown"></li>').html('<a>Kudos/hits</a>');
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
		var button_hide_yes = $('<li class="hide-yes"></li>').html('<a>Hide hitcount: YES</a>');
		drop_menu.on('click', 'li.hide-yes', function() {
			localStorage.setItem('hidehitcountlocal', 'no');
			$('.stats .hits').css('display', '');
			button_hide_yes.replaceWith(button_hide_no);
		});

		// create button - don't hide hitcount
		var button_hide_no = $('<li class="hide-no"></li>').html('<a>Hide hitcount: NO</a>');
		drop_menu.on('click', 'li.hide-no', function() {
			localStorage.setItem('hidehitcountlocal', 'yes');
			$('.stats .hits').css('display', 'none');
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

			var button_sort_stats = $('<li></li>').html('<a>↓&nbsp;Kudos/hits</a>');
			button_sort_stats.click(function() {
				sortByRatio();
				button_sort_stats.after(button_sort_stats_asc).detach();
			});

			var button_sort_stats_asc = $('<li></li>').html('<a>↑&nbsp;Kudos/hits</a>');
			button_sort_stats_asc.click(function() {
				sortByRatio(true);
				button_sort_stats_asc.after(button_sort_stats).detach();
			});

			$('ul.sorting.actions li:nth-child(3)').after('\n', button_sort_stats);
		}
	}

})(jQuery);