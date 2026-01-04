// ==UserScript==
// @name        AO3: Kudos/average hits per chapter ratio
// @description Replace hitcount with kudos/average hits per chapter percentage. Sort works on the page by this ratio.
// @namespace	https://greasyfork.org/en/scripts/39361-ao3-kudos-average-hits-per-chapter-ratio
// @author	Min, with updates by ObliqueRed
// @version	1.0
// @history	1.0 - Customization of the script AO3: Kudos/hits ratio by Min, version 1.4. Changes percentages to use periods instead of commas (12.3% instead of 12,3%). Changes how percentages are calculated to better reflect multi-chapter stories.
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/433198/AO3%3A%20Kudosaverage%20hits%20per%20chapter%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/433198/AO3%3A%20Kudosaverage%20hits%20per%20chapter%20ratio.meta.js
// ==/UserScript==

// Notes:     This is a customization of Min's AO3: Kudos/hits ratio. The original script expresses the ratio of kudos to total hits on a work. This version expresses the ratio of kudos to the average number of hits per chapter.
//            New or altered portions of Min's original code are commented.
// Reasoning: Each reader of a multi-chaptered story will generate at least one hit per chapter of the story, but can only leave kudos once (or twice if they leave both a guest kudo and a logged in kudo.)
//            Because of this, the original version artificially deflated the ratio for multi-chaptered stories, making them seem to be less liked by their readers than they really are. This altered version divides the number of hits on the work
//            by the number of chapters to arrive at an average hits per chapter number, and displays the ratio of kudos to that. This gives a rough approximation of "kudos per reader."
// Caveats:   Every hit on a work is not a unique reader. Hits can be produced by bots, downloaders, and reloads as well as readers. Therefore, this is only a rough approximation. However, this variant will hopefully give a more apples-to-apples comparison
//            between one-shot and multi-chapter stories, since multi-chapter stories will have significantly more hits as readers click through. However, this script may still underestimate the popularity of stories that are re-read many times, because those
//            re-reads will gradually keep increasing the hit count without increasing the kudos (since readers can't leave a kudo every time they read a story.)

// ~~ SETTINGS ~~ //

// count kudos/hits automatically: true/false
var always_count = true;

// sort works on this page by kudos/hits ratio in descending order automatically: true/false
var always_sort = false;

// hide hitcount: true/false
var hide_hitcount = false;

// colour background depending on percentage: true/false
var colourbg = false;

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
                // new: gets the chapter count in the format x/y, where x is a number and y is either a number or a ?
                var chapters_value = $(this).find('dd.chapters');
                var chapters_value_string = chapters_value.text();

                // new: extracts the current number of chapters in the work  - x - from the chapter count
                     // where in the string is the / character?
                     var position_of_slash = chapters_value_string.indexOf('/');
                     // slice off the part of the string before the / - this is the current number of chapters
                     var current_chapter_value = chapters_value_string.slice(0, position_of_slash);


				// if hits and kudos were found
				if (kudos_value.length && hits_value.length && hits_value.text() !== '0') {

					// get counts
					var hits_count = parseInt(hits_value.text());
					var kudos_count = parseInt(kudos_value.text());
                    // new: turns the string into a number
                    var chapters_count = parseInt(current_chapter_value);

					//altered: calculate hits per chapter
                    var hits_per_chapter = hits_count/chapters_count;

                    // count percentage of kudos to hits per chapter
					var percents = kudos_count/hits_per_chapter*100;

					// get percentage with one decimal point
					var percents_print = percents.toFixed(1);
                    // If you want a comma instead of a period in your percents (12,4% instead of 12.4%) use this line instead of the previous one
                    // var percents_print = percents.toFixed(1).replace('.',',');

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
