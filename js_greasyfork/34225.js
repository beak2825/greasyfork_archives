// ==UserScript==
// @name         Seriesfeed Episode Inverter
// @namespace    https://www.seriesfeed.com
// @version      1.3
// @description  Allows you to invert the broadcast schedule, watchlist and episode list on a series.
// @match        https://*.seriesfeed.com/**/episodes
// @match        https://*.seriesfeed.com/**/episodes/*
// @match        https://www.seriesfeed.com/series/schedule
// @match        https://www.seriesfeed.com/series/schedule/*
// @match        https://www.seriesfeed.com/series/schedule/history
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @author       Tom
// @copyright    2017 - 2018, Tom
// @downloadURL https://update.greasyfork.org/scripts/34225/Seriesfeed%20Episode%20Inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/34225/Seriesfeed%20Episode%20Inverter.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global $, console, GM */
'use strict';

(async function() { // jshint ignore:line
	let sortButton;

	if (window.location.href.indexOf("episodes") > -1) {
		const onClick = async () => { // jshint ignore:line
			const shouldDescend = await GM.getValue("seriesShouldDescend"); // jshint ignore:line
			await GM.setValue("seriesShouldDescend", !shouldDescend); // jshint ignore:line
			sortEpisodes(!shouldDescend);
		};
		sortButton = buttonFactory(onClick);
		$(".container .row .col-xs-12.col-sm-6.col-md-4").prepend(sortButton);

		const shouldDescend = await GM.getValue("seriesShouldDescend"); // jshint ignore:line
		if (shouldDescend) {
			invertEpisodes();
			updateButton(false, "aflopend");
		} else {
			updateButton(true, "oplopend");
		}
	}

	function sortEpisodes(shouldDescend) {
		invertEpisodes();

		if (shouldDescend) {
			updateButton(false, "aflopend");
		} else {
			updateButton(true, "oplopend");
		}
	}

	function invertEpisodes() {
		const episodes = $('#afleveringen tbody');
		episodes.each(function(element, index) {
			const array = $.makeArray($("tr", this).detach());
			array.reverse();
			$(this).append(array);
		});
	}

	function updateButton(rotateIcon180, text) {
		const icon = sortButton.find('i');
		if (rotateIcon180) {
			icon.css({ transform: 'rotate(180deg)' });
		} else {
			icon.css({ transform: 'rotate(0)' });
		}
		sortButton.find('span').text(text);
	}

	function buttonFactory(onClick) {
		const button = $('<button/>').addClass('btn btn-default');
		const icon = $('<i/>').addClass('fa fa-angle-up');
		const text = $('<span/>');
		button
			.append(icon)
			.append(text)
			.click(onClick);

		icon
			.css({
			    transform: 'rotate(0)',
			    transition: 'transform .3s ease'
		    });

		return button;
	}

	if (window.location.href.indexOf("series/schedule") > -1 && window.location.href.indexOf("series/schedule/history") <= -1) {
		const onClick = async () => { // jshint ignore:line
			const shouldDescend = await GM.getValue("scheduleShouldDescend"); // jshint ignore:line
			await GM.setValue("scheduleShouldDescend", !shouldDescend); // jshint ignore:line
			sortEpisodes(!shouldDescend);
		};
		sortButton = buttonFactory(onClick);
		sortButton.addClass('largeFilter').css({ float: 'right' });
		$(".largeFilter").css({ display: 'inline-block', width: '400px' });
		$(".largeFilter").after(sortButton);

		const scheduleShouldDescend = await GM.getValue("scheduleShouldDescend"); // jshint ignore:line
		if (scheduleShouldDescend) {
			invertEpisodes();
			updateButton(false, "aflopend");
		} else {
			updateButton(true, "oplopend");
		}
	}

	if (window.location.href.indexOf("series/schedule/history") > -1) {
		const onClick = async () => {
			const shouldAscend = await GM.getValue("watchlistShouldAscend");
			await GM.setValue("watchlistShouldAscend", !shouldAscend);
			sortEpisodes(shouldAscend);
		};
		sortButton = buttonFactory(onClick);
		$(".container .rightButtons").prepend(sortButton);

		const watchlistShouldAscend = await GM.getValue("watchlistShouldAscend");
		if (watchlistShouldAscend) {
			invertEpisodes();
			updateButton(true, "oplopend");
		} else {
			updateButton(false, "aflopend");
		}
	}
})();