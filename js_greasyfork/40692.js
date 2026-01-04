// ==UserScript==
// @name          WaniKani Open Framework Additional Filters
// @namespace     https://www.wanikani.com
// @description   Additional filters for the WaniKani Open Framework
// @author        seanblue
// @version       1.3.3
// @include       https://www.wanikani.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/40692/WaniKani%20Open%20Framework%20Additional%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/40692/WaniKani%20Open%20Framework%20Additional%20Filters.meta.js
// ==/UserScript==

(function(wkof) {
	'use strict';

	var wkofMinimumVersion = '1.0.18';

	if (!wkof) {
		var response = confirm('WaniKani Open Framework Additional Filters requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}

	if (!wkof.version || wkof.version.compare_to(wkofMinimumVersion) === 'older') {
		alert('WaniKani Open Framework Additional Filters requires at least version ' + wkofMinimumVersion + ' of WaniKani Open Framework.');
		return;
	}

	var settingsDialog;
	var settingsScriptId = 'additionalFilters';
	var settingsTitle = 'Additional Filters';

	var needToRegisterFilters = true;
	var settingsLoadedPromise = promise();

	var filterNamePrefix = 'additionalFilters_';
	var recentLessonsFilterName = filterNamePrefix + 'recentLessons';
	var leechTrainingFilterName = filterNamePrefix + 'leechTraining';
	var timeUntilReviewFilterName = filterNamePrefix + 'timeUntilReview';
	var failedLastReviewName = filterNamePrefix + 'failedLastReview';
	var relatedItemsName = filterNamePrefix + 'relatedItems';

	var supportedFilters = [recentLessonsFilterName, leechTrainingFilterName, timeUntilReviewFilterName, failedLastReviewName, relatedItemsName];

	var defaultSettings = {};
	defaultSettings[recentLessonsFilterName] = true;
	defaultSettings[leechTrainingFilterName] = true;
	defaultSettings[timeUntilReviewFilterName] = true;
	defaultSettings[failedLastReviewName] = true;
	defaultSettings[relatedItemsName] = true;

	var recentLessonsHoverTip = 'Only include lessons taken in the last X hours.';
	var leechesSummaryHoverTip = 'Only include leeches. Formula: incorrect / currentStreak^1.5.';
	var leechesHoverTip = leechesSummaryHoverTip + '\n * The higher the value, the fewer items will be included as leeches.\n * Setting the value to 1 will include items that have just been answered incorrectly for the first time.\n * Setting the value to 1.01 will exclude items that have just been answered incorrectly for the first time.';

	var timeUntilReviewSummaryHoverTip = 'Only include items that have at least X% of their SRS interval remaining.';
	var timeUntilReviewHoverTip = timeUntilReviewSummaryHoverTip + '\nValid values are from 0 to 100. Examples:\n "75": At least 75% of an item\'s SRS interval must be remaining.';

	var failedLastReviewSummaryHoverTip = 'Only include items where the most recent review was failed.';
	var failedLastReviewHoverTip = failedLastReviewSummaryHoverTip + '\nOnly look at items whose most recent review was in the last X hours.';

	var relatedItemsSummaryHoverTip = 'Only include items that contain at least one of the given kanji.';
	var relatedItemsHoverTip = relatedItemsSummaryHoverTip + ' Examples:\n "金": All items containing the kanji 金.\n "金髪 -曜": All items containing the kanji 金 or 髪, but not 曜.';

	var msPerHour = 3600000;

	var nowForTimeUntilReview;
	var nowForFailedLastReview;
	var regularSrsIntervals = [0, 4, 8, 23, 47, 167, 335, 719, 2879];
	var acceleratedSrsIntervals = [0, 2, 4, 8, 23, 167, 335, 719, 2879];
	var acceleratedLevels = [1, 2];

	function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}

	function getSrsIntervalInHours(srsStage, level) {
		var srsInvervals = acceleratedLevels.includes(level) ? acceleratedSrsIntervals : regularSrsIntervals;
		return srsInvervals[srsStage];
	}

	wkof.include('Menu, Settings');

	wkof.ready('Menu').then(installMenu);
	waitForItemDataRegistry().then(installSettings);

	function waitForItemDataRegistry() {
		return wkof.wait_state('wkof.ItemData.registry', 'ready');
	}

	function installMenu() {
		loadSettings().then(function() {
			addMenuItem();
		});
	}

	function addMenuItem() {
		wkof.Menu.insert_script_link({
			script_id: settingsScriptId,
			submenu: 'Settings',
			title: settingsTitle,
			on_click: function() { settingsDialog.open(); }
		});
	}

	function installSettings() {
		wkof.ItemData.pause_ready_event(true);

		loadSettings().then(function() {
			wkof.ItemData.pause_ready_event(false);
		});
	}

	function loadSettings(postLoadAction) {
		wkof.ready('Settings').then(function() {
			if (settingsDialog) {
				return;
			}

			var settings = {};
			settings[recentLessonsFilterName] = { type: 'checkbox', label: 'Recent Lessons', hover_tip: recentLessonsHoverTip };
			settings[leechTrainingFilterName] = { type: 'checkbox', label: 'Leech Training', hover_tip: leechesSummaryHoverTip };
			settings[timeUntilReviewFilterName] = { type: 'checkbox', label: 'Time Until Review', hover_tip: timeUntilReviewSummaryHoverTip };
			settings[failedLastReviewName] = { type: 'checkbox', label: 'Failed Last Review', hover_tip: failedLastReviewSummaryHoverTip };
			settings[relatedItemsName] = { type: 'checkbox', label: 'Related Items', hover_tip: relatedItemsSummaryHoverTip };

			settingsDialog = new wkof.Settings({
				script_id: settingsScriptId,
				title: settingsTitle,
				on_save: saveSettings,
				settings: settings
			});

			settingsDialog.load(defaultSettings).then(function() {
				updateFiltersWhenReady();
				settingsLoadedPromise.resolve();
			});
		});

		return settingsLoadedPromise;
	}

	function saveSettings(){
		settingsDialog.save().then(function() {
			updateFiltersWhenReady();
		});
	}

	function updateFiltersWhenReady() {
		needToRegisterFilters = true;
		waitForItemDataRegistry().then(registerFilters);
	}

	function registerFilters() {
		if (!needToRegisterFilters) {
			return;
		}

		supportedFilters.forEach(function(filterName) {
			delete wkof.ItemData.registry.sources.wk_items.filters[filterName];
		});

		if (wkof.settings[settingsScriptId][recentLessonsFilterName]) {
			registerRecentLessonsFilter();
		}

		if (wkof.settings[settingsScriptId][leechTrainingFilterName]) {
			registerLeechTrainingFilter();
		}

		if (wkof.settings[settingsScriptId][timeUntilReviewFilterName]) {
			registerTimeUntilReviewFilter();
		}

		if (wkof.settings[settingsScriptId][failedLastReviewName]) {
			registerFailedLastReviewFilter();
		}

		if (wkof.settings[settingsScriptId][relatedItemsName]) {
			registerRelatedItemsFilter();
		}

		needToRegisterFilters = false;
	}

	// BEGIN Recent Lessons
	function registerRecentLessonsFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[recentLessonsFilterName] = {
			type: 'number',
			label: 'Recent Lessons',
			default: 24,
			placeholder: '24',
			filter_func: recentLessonsFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: recentLessonsHoverTip
		};
	}

	function recentLessonsFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}

		var startedAt = item.assignments.started_at;
		if (startedAt === null || startedAt === undefined) {
			return false;
		}

		var startedAtDate = new Date(startedAt);
		var timeSinceStart = Date.now() - startedAtDate;

		return (timeSinceStart / msPerHour) < filterValue;
	}
	// END Recent Lessons

	// BEGIN Leeches
	function registerLeechTrainingFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[leechTrainingFilterName] = {
			type: 'number',
			label: 'Leech Training',
			default: 1,
			placeholder: '1',
			filter_func: leechTrainingFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: leechesHoverTip
		};
	}

	function leechTrainingFilter(filterValue, item) {
		if (item.review_statistics === undefined) {
			return false;
		}

		var reviewStats = item.review_statistics;
		var meaningScore = getLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
		var readingScore = getLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

		return meaningScore >= filterValue || readingScore >= filterValue;
	}

	function getLeechScore(incorrect, currentStreak) {
		return incorrect / Math.pow((currentStreak || 0.5), 1.5);
	}
	// END Leeches

	// BEGIN Time Until Review
	function registerTimeUntilReviewFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[timeUntilReviewFilterName] = {
			type: 'number',
			label: 'Time Until Review',
			default: 50,
			placeholder: '50',
			prepare: timeUntilReviewPrepare,
			filter_value_map: convertPercentageToDecimal,
			filter_func: timeUntilReviewFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: timeUntilReviewHoverTip
		};
	}

	function timeUntilReviewPrepare() {
		// Only set "now" once so that all items use the same value when filtering.
		nowForTimeUntilReview = Date.now();
	}

	function convertPercentageToDecimal(percentage) {
		if (percentage < 0) {
			return 0;
		}

		if (percentage > 100) {
			return 1;
		}

		return percentage / 100;
	}

	function timeUntilReviewFilter(decimal, item) {
		if (item.assignments === undefined) {
			return false;
		}

		var srsStage = item.assignments.srs_stage;
		if (srsStage === 0) {
			return false;
		}

		if (srsStage === 9) {
			return true;
		}

		var level = item.data.level;
		var reviewAvailableAt = item.assignments.available_at;
		var srsInvervalInHours = getSrsIntervalInHours(srsStage, level);

		return isAtLeastMinimumHoursUntilReview(srsInvervalInHours, reviewAvailableAt, decimal);
	}

	function isAtLeastMinimumHoursUntilReview(srsInvervalInHours, reviewAvailableAt, decimal) {
		var hoursUntilReview = (Date.parse(reviewAvailableAt) - nowForTimeUntilReview) / msPerHour;
		var minimumHoursUntilReview = srsInvervalInHours * decimal;

		return minimumHoursUntilReview <= hoursUntilReview;
	}
	// END Time Until Review

	// BEGIN Failed Last Review
	function registerFailedLastReviewFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[failedLastReviewName] = {
			type: 'number',
			label: 'Failed Last Review',
			default: 24,
			placeholder: '24',
			prepare: failedLastReviewPrepare,
			filter_func: failedLastReviewFilter,
			set_options: function(options) { options.review_statistics = true; options.assignments = true; },
			hover_tip: failedLastReviewHoverTip
		};
	}

	function failedLastReviewPrepare() {
		// Only set "now" once so that all items use the same value when filtering.
		nowForFailedLastReview = Date.now();
	}

	function failedLastReviewFilter(filterValue, item) {
		// review_statistics is undefined for new lessons.
		if (item.assignments === undefined || item.review_statistics === undefined) {
			return false;
		}

		var assignments = item.assignments;
		var srsStage = assignments.srs_stage;

		if (srsStage === 0) {
			return false;
		}

		if (srsStage === 9) {
			return false;
		}

		if (!failedLastReview(item.review_statistics)) {
			return false;
		}

		var srsInvervalInHours = getSrsIntervalInHours(srsStage, item.data.level);
		var lastReviewTimeInMs = getLastReviewTimeInMs(srsInvervalInHours, assignments.available_at);
		var hoursSinceLastReview = (nowForFailedLastReview - lastReviewTimeInMs) / msPerHour;

		return hoursSinceLastReview <= filterValue;
	}

	function failedLastReview(reviewStats) {
		return failedLastReviewOfType(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak) || failedLastReviewOfType(reviewStats.reading_incorrect, reviewStats.reading_current_streak);
	}

	function failedLastReviewOfType(totalIncorrect, currentStreak) {
		return totalIncorrect > 0 && currentStreak === 1;
	}

	function getLastReviewTimeInMs(srsInvervalInHours, reviewAvailableAt) {
		var srsIntervalInMs = srsInvervalInHours * msPerHour;

		return Date.parse(reviewAvailableAt) - srsIntervalInMs;
	}
	// END Failed Last Review

	// BEGIN Related Items
	function registerRelatedItemsFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[relatedItemsName] = {
			type: 'text',
			label: 'Related Items',
			default: '',
			placeholder: '入力',
			filter_value_map: relatedItemsMap,
			filter_func: relatedItemsFilter,
			hover_tip: relatedItemsHoverTip
		};
	}

	function relatedItemsMap(kanjiString) {
		var parts = kanjiString.split(' ');

		var includeList = [];
		var excludeList = [];

		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			if (part.startsWith('-')) {
				concat(excludeList, part.substr(1).split(''));
			}
			else {
				concat(includeList, part.split(''));
			}
		}

		return {
			include: includeList,
			exclude: excludeList
		};
	}

	function concat(array1, array2) {
		Array.prototype.push.apply(array1, array2);
	}

	function relatedItemsFilter(filterValue, item) {
		var characters = item.data.characters;
		if (characters === null || characters === undefined) {
			return false;
		}

		var itemCharacterArray = characters.split('');

		return containsAny(filterValue.include, itemCharacterArray) && !containsAny(filterValue.exclude, itemCharacterArray);
	}

	function containsAny(filterValueArray, itemCharacterArray) {
		return itemCharacterArray.some(function(itemCharacter) {
			return filterValueArray.includes(itemCharacter);
		});
	}
	// END Related Items
})(window.wkof);
