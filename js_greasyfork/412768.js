// ==UserScript==
// @name          WaniKani Open Framework Statistics Filters
// @namespace     https://www.wanikani.com
// @description   Additional statistics filters for the WaniKani Open Framework
// @author        prouleau
// @version       1.5.0
// @match         https://www.wanikani.com/*
// @license       MIT; http://opensource.org/licenses/MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/412768/WaniKani%20Open%20Framework%20Statistics%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/412768/WaniKani%20Open%20Framework%20Statistics%20Filters.meta.js
// ==/UserScript==

(function(wkof) {
	'use strict';

	var wkofMinimumVersion = '1.0.52';

	if (!wkof) {
		var response = confirm('WaniKani Open Framework Date Filters requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}
	var settingsDialog;
	var settingsScriptId = 'statsFilters';
	var settingsTitle = 'Statistics Filters';

	var needToRegisterFilters = true;

	var filterNamePrefix = 'statsFilters_';
	var leechLteqFilterName = filterNamePrefix + 'LeechLteq';
	var meaningCorAnsLteqFilterName = filterNamePrefix + 'meaningCorAnsLteq';
	var meaningCorAnsGteqFilterName = filterNamePrefix + 'meaningCorAnsGteq';
	var readingCorAnsLteqFilterName = filterNamePrefix + 'readingCorAnsLteq';
	var readingCorAnsGteqFilterName = filterNamePrefix + 'readingCorAnsGteq';
	var meaningIncorAnsLteqFilterName = filterNamePrefix + 'meaningIncorAnsLteq';
	var meaningIncorAnsGteqFilterName = filterNamePrefix + 'meaningIncorAnsGteq';
	var readingIncorAnsLteqFilterName = filterNamePrefix + 'readingIncorAnsLteq';
	var readingIncorAnsGteqFilterName = filterNamePrefix + 'readingIncorAnsGteq';
	var totalCorAnsLteqFilterName = filterNamePrefix + 'totalCorAnsLteq';
	var totalCorAnsGteqFilterName = filterNamePrefix + 'totalCorAnsGteq';
	var totalIncorAnsLteqFilterName = filterNamePrefix + 'totalIncorAnsLteq';
	var totalIncorAnsGteqFilterName = filterNamePrefix + 'totalIncorAnsGteq';
	var percentageTotalCorLteqFilterName = filterNamePrefix + 'percentageTotalCorLteq';
	var percentageTotalCorGteqFilterName = filterNamePrefix + 'percentageTotalCorGteq';
	var percentageMeaningCorLteqFilterName = filterNamePrefix + 'pecentagerMeaningCorLteq';
	var percentageMeaningCorGteqFilterName = filterNamePrefix + 'percentageMeaningCorGteq';
	var percentageReadingCorLteqFilterName = filterNamePrefix + 'percentageReadingCorLteq';
	var percentageReadingCorGteqFilterName = filterNamePrefix + 'percentageReadingCorGteq';
	var meaningCurStrLteqFilterName = filterNamePrefix + 'meaningCurStrLteq';
	var meaningCurStrGteqFilterName = filterNamePrefix + 'meaningCurStrGteq';
	var meaningMaxStrLteqFilterName = filterNamePrefix + 'meaningMaxStrLteq';
	var meaningMaxStrGteqFilterName = filterNamePrefix + 'meaningMaxStrGteq';
	var readingCurStrLteqFilterName = filterNamePrefix + 'readingCurStrLteq';
	var readingCurStrGteqFilterName = filterNamePrefix + 'readingCurStrGteq';
	var readingMaxStrLteqFilterName = filterNamePrefix + 'readingMaxStrLteq';
	var readingMaxStrGteqFilterName = filterNamePrefix + 'readingMaxStrGteq';
	var bothCurStrLteqFilterName = filterNamePrefix + 'bothCurStrLteq';
	var bothCurStrGteqFilterName = filterNamePrefix + 'bothCurStrGteq';
	var minCurStrLteqFilterName = filterNamePrefix + 'minCurStrLteq';
	var minCurStrGteqFilterName = filterNamePrefix + 'minCurStrGteq';
	var numReviewsLteqFilterName = filterNamePrefix + 'numReviewsLteq';
	var numReviewGteqFilterName = filterNamePrefix + 'numReviewsGteq';

	var supportedFilters = [leechLteqFilterName, meaningCorAnsLteqFilterName, meaningCorAnsGteqFilterName, readingCorAnsLteqFilterName, readingCorAnsGteqFilterName,
                            meaningIncorAnsLteqFilterName, meaningIncorAnsGteqFilterName, readingIncorAnsLteqFilterName, readingIncorAnsGteqFilterName,
                            totalCorAnsLteqFilterName, totalCorAnsGteqFilterName, totalIncorAnsLteqFilterName, totalIncorAnsGteqFilterName,
                            percentageTotalCorLteqFilterName, percentageTotalCorGteqFilterName, percentageMeaningCorLteqFilterName, percentageMeaningCorGteqFilterName,
                            percentageReadingCorLteqFilterName, percentageReadingCorGteqFilterName, meaningCurStrLteqFilterName, meaningCurStrGteqFilterName,
                            meaningMaxStrLteqFilterName, meaningMaxStrGteqFilterName, readingCurStrLteqFilterName, readingCurStrGteqFilterName,
                            readingMaxStrLteqFilterName, readingMaxStrGteqFilterName, bothCurStrLteqFilterName, bothCurStrGteqFilterName,
                            minCurStrLteqFilterName, minCurStrGteqFilterName, numReviewsLteqFilterName, numReviewGteqFilterName];

	function updateFiltersWhenReady() {
        wkof.set_state(settingsScriptId, 'loading');
		needToRegisterFilters = true;
		waitForItemDataRegistry().then(registerFilters);
	}

	function waitForItemDataRegistry() {
		return wkof.wait_state('wkof.ItemData.registry', 'ready');
	}

	function registerFilters() {
		if (!needToRegisterFilters) {
			return;
		}

		supportedFilters.forEach(function(filterName) {
			delete wkof.ItemData.registry.sources.wk_items.filters[filterName];
		});

		registerLeechLteqFilter();
		registerMeaningCorAnsGteqFilter();
		registerMeaningCorAnsLteqFilter();
		registerReadingCorAnsGteqFilter();
		registerReadingCorAnsLteqFilter();
		registerMeaningIncorAnsGteqFilter();
		registerMeaningIncorAnsLteqFilter();
		registerReadingIncorAnsGteqFilter();
		registerReadingIncorAnsLteqFilter();
		registerTotalCorAnsGteqFilter();
		registerTotalCorAnsLteqFilter();
		registerTotalIncorAnsGteqFilter();
		registerTotalIncorAnsLteqFilter();
		registerPercentageTotalCorGteqFilter();
		registerPercentageTotalCorLteqFilter();
		registerPercentageMeaningCorGteqFilter();
		registerPercentageMeaningCorLteqFilter();
		registerPercentageReadingCorGteqFilter();
		registerPercentageReadingCorLteqFilter();
		registerMeaningCurStrGteqFilter();
		registerMeaningCurStrLteqFilter();
		registerMeaningMaxStrGteqFilter();
		registerMeaningMaxStrLteqFilter();
		registerReadingCurStrGteqFilter();
		registerReadingCurStrLteqFilter();
		registerReadingMaxStrGteqFilter();
		registerReadingMaxStrLteqFilter();
		registerBothCurStrGteqFilter();
		registerBothCurStrLteqFilter();
		registerMinCurStrGteqFilter();
		registerMinCurStrLteqFilter();
		registerNumberReviewsGteqFilter();
		registerNumberReviewsLteqFilter();

		needToRegisterFilters = false;
        wkof.set_state(settingsScriptId, 'ready');
	}

	// BEGIN Leech
    let leechLteqHover_tip = 'Select items that have a leech value less than or equal to the stated value.';

	function registerLeechLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[leechLteqFilterName] = {
			type: 'number',
			label: 'Leech value <=',
			default: 10,
			filter_func: leechLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: leechLteqHover_tip,
		};
	}

	function leechLteqFilter(filterValue, item) {
		if (item.review_statistics === undefined) {
			return false;
		}

		var reviewStats = item.review_statistics;
		var meaningScore = getLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
		var readingScore = getLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

		return meaningScore <= filterValue && readingScore <= filterValue;
	}

    // Leech scores a rounded because otherwise the behavior of the filter is not consistent with rounded values presented to users in scripts.
    // In other words, data would be not filtered when based on user facing data it appears that it should be.
	function getLeechScore(incorrect, currentStreak) {
		return Math.round((incorrect / Math.pow((currentStreak || 0.5), 1.5)) * 100) / 100;
	}
	// END Leech


	// BEGIN Meaning correct answers
    let meaningCorAnsGteqFilterHover_tip = 'Selects items where the number of correct\nanswers for Meaning is &gt;= this value.';
    let meaningCorAnsLteqFilterHover_tip = 'Selects items where the number of correct\nanswers for Meaning is &lt;= this value.';

	function registerMeaningCorAnsGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningCorAnsGteqFilterName] = {
			type: 'number',
			label: 'Meaning Cor. Ans. &gt;=',
			default: 0,
            filter_func: meaningCorAnsGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningCorAnsGteqFilterHover_tip,
		};
	}

	function meaningCorAnsGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.meaning_correct >= filterValue;
	}

	function registerMeaningCorAnsLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningCorAnsLteqFilterName] = {
			type: 'number',
			label: 'Meaning Cor. Ans. &lt;=',
			default: 100,
			filter_func: meaningCorAnsLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningCorAnsLteqFilterHover_tip,
		};
	}

	function meaningCorAnsLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		};
		return review_statistics.meaning_correct <= filterValue;
	};
    // END Meaning correct answers

	// BEGIN Reading correct answers
    let readingCorAnsGteqFilterHover_tip = 'Selects items where the number of correct\nanswers for Reading is &gt;= this value.';
    let readingCorAnsLteqFilterHover_tip = 'Selects items where the number of correct\nanswers for Reading is &lt;= this value.';

	function registerReadingCorAnsGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingCorAnsGteqFilterName] = {
			type: 'number',
			label: 'Reading Cor. Ans. &gt;=',
			default: 0,
            filter_func: readingCorAnsGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingCorAnsGteqFilterHover_tip,
		};
	};

	function readingCorAnsGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		};
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        };
		return review_statistics.reading_correct >= filterValue;
	};

	function registerReadingCorAnsLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingCorAnsLteqFilterName] = {
			type: 'number',
			label: 'Reading Cor. Ans. &lt;=',
			default: 100,
			filter_func: readingCorAnsLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingCorAnsLteqFilterHover_tip,
		};
	}

	function readingCorAnsLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return review_statistics.reading_correct <= filterValue;
	}
	// END Reading correct answers

	// BEGIN Meaning incorrect answers
    let meaningIncorAnsGteqFilterHover_tip = 'Selects items where the number of incorrect\nanswers for Meaning is &gt;= this value.';
    let meaningIncorAnsLteqFilterHover_tip = 'Selects items where the number of incorrect\nanswers for Meaning is &lt;= this value.';

	function registerMeaningIncorAnsGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningIncorAnsGteqFilterName] = {
			type: 'number',
			label: 'Meaning Incor. Ans. &gt;=',
			default: 0,
            filter_func: meaningIncorAnsGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningIncorAnsGteqFilterHover_tip,
		};
	}

	function meaningIncorAnsGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.meaning_incorrect >= filterValue;
	}

	function registerMeaningIncorAnsLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningIncorAnsLteqFilterName] = {
			type: 'number',
			label: 'Meaning Incor. Ans. &lt;=',
			default: 100,
			filter_func: meaningIncorAnsLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningIncorAnsLteqFilterHover_tip,
		};
	}

	function meaningIncorAnsLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.meaning_incorrect <= filterValue;
	}
	// END Meaning incorrect answers

	// BEGIN Reading incorrect answers
    let readingIncorAnsGteqFilterHover_tip = 'Selects items where the number of incorrect\nanswers for Reading is &gt;= this value.';
    let readingIncorAnsLteqFilterHover_tip = 'Selects items where the number of incorrect\nanswers for Reading is &lt;= this value.';

	function registerReadingIncorAnsGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingIncorAnsGteqFilterName] = {
			type: 'number',
			label: 'Reading Incor. Ans. &gt;=',
			default: 0,
            filter_func: readingIncorAnsGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingIncorAnsGteqFilterHover_tip,
		};
	}

	function readingIncorAnsGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return review_statistics.reading_incorrect >= filterValue;
	}

	function registerReadingIncorAnsLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingIncorAnsLteqFilterName] = {
			type: 'number',
			label: 'Reading Incor. Ans. &lt;=',
			default: 100,
			filter_func: readingIncorAnsLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingIncorAnsLteqFilterHover_tip,
		};
	}

	function readingIncorAnsLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return review_statistics.reading_incorrect <= filterValue;
	}
	// END Reading incorrect answers

	// BEGIN Total correct answers
    let totalCorAnsGteqFilterHover_tip = 'Selects items where the total number\nof correct answers is &gt;= this value.';
    let totalCorAnsLteqFilterHover_tip = 'Selects items where the total number\nof correct answers is &lt;= this value.';

	function registerTotalCorAnsGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[totalCorAnsGteqFilterName] = {
			type: 'number',
			label: 'Total Cor. Ans. &gt;=',
			default: 0,
            filter_func: totalCorAnsGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: totalCorAnsGteqFilterHover_tip,
		};
	}

	function totalCorAnsGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_correct >= filterValue;
        }
		return review_statistics.meaning_correct + review_statistics.reading_correct >= filterValue;
	}

	function registerTotalCorAnsLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[totalCorAnsLteqFilterName] = {
			type: 'number',
			label: 'Total Cor. Ans. &lt;=',
			default: 100,
			filter_func: totalCorAnsLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: totalCorAnsLteqFilterHover_tip,
		};
	}

	function totalCorAnsLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_correct <= filterValue;
        }
		return review_statistics.meaning_correct + review_statistics.reading_correct <= filterValue;
	}
	// END Total correct answers

	// BEGIN Number of reviews
    // The number of reviews is always equal to the total correct answers because
    // you need to answer correctly exactly once to terminate a review
    // Therefore this is the same filters as Total correct answer with a different user
    // interface to inform the user of what they are doing

    let numberReviewsGteqFilterHover_tip = 'Selects items where the total number\nof reviews is &gt;= this value.';
    let numberReviewsLteqFilterHover_tip = 'Selects items where the total number\nof reviews is &lt;= this value.';

	function registerNumberReviewsGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[numReviewGteqFilterName] = {
			type: 'number',
			label: 'Number of Reviews &gt;=',
			default: 0,
            filter_func: totalCorAnsGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: numberReviewsGteqFilterHover_tip,
		};
	}

	function registerNumberReviewsLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[numReviewsLteqFilterName] = {
			type: 'number',
			label: 'Number of Reviews &lt;=',
			default: 100,
			filter_func: totalCorAnsLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: numberReviewsLteqFilterHover_tip,
		};
	}

	// END Number of reviews

	// BEGIN Total incorrect answers
    let totalIncorAnsGteqFilterHover_tip = 'Selects items where the total number\nof incorrect answers is &gt;= this value.';
    let totalIncorAnsLteqFilterHover_tip = 'Selects items where the total number\nof incorrect answers is &lt;= this value.';

	function registerTotalIncorAnsGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[totalIncorAnsGteqFilterName] = {
			type: 'number',
			label: 'Total Incor. Ans. &gt;=',
			default: 0,
            filter_func: totalIncorAnsGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: totalIncorAnsGteqFilterHover_tip,
		};
	}

	function totalIncorAnsGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_incorrect >= filterValue;
        }
		return review_statistics.meaning_incorrect + review_statistics.reading_incorrect >= filterValue;
	}

	function registerTotalIncorAnsLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[totalIncorAnsLteqFilterName] = {
			type: 'number',
			label: 'Total Incor. Ans. &lt;=',
			default: 100,
			filter_func: totalIncorAnsLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: totalIncorAnsLteqFilterHover_tip,
		};
	}

	function totalIncorAnsLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_incorrect <= filterValue;
        }
		return review_statistics.meaning_incorrect + review_statistics.reading_incorrect <= filterValue;
	}
	// END Total incorrect answers

    //==============================================
    // Percentages filters
    //
    // Needs rounding because otherwise user facing data is usually floored and inconsistencies in displayed data will occur
    // Flooring is used instead of rounding because otherwise we could have 100% correct while missing some answers due to rounding

	function percentageRounding(value){return Math.floor(value * 100)};

	// BEGIN Percentage Total Correct
    let percentageTotalCorGteqFilterHover_tip = 'Selects items where % of correct answers\non Total is &gt;= this value.';
    let percentageTotalCorLteqFilterHover_tip = 'Selects items where % of correct answers\non Total is &lt;= this value.';

	function registerPercentageTotalCorGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[percentageTotalCorGteqFilterName] = {
			type: 'number',
			label: '%Total Correct &gt;=',
			default: 0,
            filter_func: percentageTotalCorGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: percentageTotalCorGteqFilterHover_tip,
		};
	}

	function percentageTotalCorGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.percentage_correct >= filterValue;
	}

	function registerPercentageTotalCorLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[percentageTotalCorLteqFilterName] = {
			type: 'number',
			label: '%Total Correct &lt;=',
			default: 100,
			filter_func: percentageTotalCorLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: percentageTotalCorLteqFilterHover_tip,
		};
	}

	function percentageTotalCorLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.percentage_correct <= filterValue;
	}
	// END Percentage Total Correct

    // BEGIN Percentage Meaning Correct
    let percentageMeaningCorGteqFilterHover_tip = 'Selects items where % of correct answers\non Meaning is &gt;= this value.';
    let percentageMeaningCorLteqFilterHover_tip = 'Selects items where % of correct answers\non Meaning is &lt;= this value.';

	function registerPercentageMeaningCorGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[percentageMeaningCorGteqFilterName] = {
			type: 'number',
			label: '%Meaning Correct &gt;=',
			default: 0,
            filter_func: percentageMeaningCorGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: percentageMeaningCorGteqFilterHover_tip,
		};
	}

	function percentageMeaningCorGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return percentageRounding(review_statistics.meaning_correct / (review_statistics.meaning_correct + review_statistics.meaning_incorrect)) >= filterValue;
	}

	function registerPercentageMeaningCorLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[percentageMeaningCorLteqFilterName] = {
			type: 'number',
			label: '%Meaning Correct &lt;=',
			default: 100,
			filter_func: percentageMeaningCorLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: percentageMeaningCorLteqFilterHover_tip,
		};
	}

	function percentageMeaningCorLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return percentageRounding(review_statistics.meaning_correct / (review_statistics.meaning_correct + review_statistics.meaning_incorrect)) <= filterValue;
	}
	// END Percentage Meaning Correct

	// BEGIN Percentage Reading Correct
    let percentageReadingCorGteqFilterHover_tip = 'Selects items where % of correct answers\non Reading is &gt;= this value.';
    let percentageReadingCorLteqFilterHover_tip = 'Selects items where % of correct answers\non Reading is &lt;= this value.';

	function registerPercentageReadingCorGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[percentageReadingCorGteqFilterName] = {
			type: 'number',
			label: '%Reading Correct &gt;=',
			default: 0,
            filter_func: percentageReadingCorGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: percentageReadingCorGteqFilterHover_tip,
		};
	}

	function percentageReadingCorGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return percentageRounding(review_statistics.reading_correct / (review_statistics.reading_correct + review_statistics.reading_incorrect)) >= filterValue;
	}

	function registerPercentageReadingCorLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[percentageReadingCorLteqFilterName] = {
			type: 'number',
			label: '%Reading Correct &lt;=',
			default: 100,
			filter_func: percentageReadingCorLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: percentageReadingCorLteqFilterHover_tip,
		};
	}

	function percentageReadingCorLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return percentageRounding(review_statistics.reading_correct / (review_statistics.reading_correct + review_statistics.reading_incorrect)) <= filterValue;
	}
	// END Percentage Reading Correct

    //======================================================
    // Streak Filters
    //
    // Wanikani starts the streak count at 1, that is when the last review is failed, the streak is 1, not 0.
    // User facing data is adjusted in Item Inspector to start the streak count at 0 because starting at 1 is not intuitive.
    // The filters do so too because the filter value in the settings panel is also user facing data that may be correlated with Item Inspector data.
    // This is done by adjusting the filter value through passing streakValueAdjustment to the filter_value_map: registering option.
    // This adjustment is not made in leech calculations because a- this use of streaks is not user facing data - and b- there is an history of
    // calculating leech values this way and it would be disruptive to change it.

    function streakValueAdjustment(param){return param + 1};


	// BEGIN Meaning Current Streak
    let meaningCurStrGteqFilterHover_tip = 'Selects items where current Meaning streak is &gt;= this value.';
    let meaningCurStrLteqFilterHover_tip = 'Selects items where current Meaning streak is &lt;= this value.';

	function registerMeaningCurStrGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningCurStrGteqFilterName] = {
			type: 'number',
			label: 'Meaning Cur. Str. &gt;=',
			default: 0,
            filter_value_map: streakValueAdjustment,
            filter_func: meaningCurStrGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningCurStrGteqFilterHover_tip,
		};
	}

	function meaningCurStrGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.meaning_current_streak >= filterValue;
	}

	function registerMeaningCurStrLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningCurStrLteqFilterName] = {
			type: 'number',
			label: 'Meaning Cur. Str. &lt;=',
			default: 100,
            filter_value_map: streakValueAdjustment,
			filter_func: meaningCurStrLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningCurStrLteqFilterHover_tip,
		};
	}

	function meaningCurStrLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.meaning_current_streak <= filterValue;
	}
	// END Meaning Current Streak

	// BEGIN Meaning Maximum Streak
    let meaningMaxStrGteqFilterHover_tip = 'Selects items where maximum Meaning streak is &gt;= this value.';
    let meaningMaxStrLteqFilterHover_tip = 'Selects items where maximum Meaning streak is &lt;= this value.';

	function registerMeaningMaxStrGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningMaxStrGteqFilterName] = {
			type: 'number',
			label: 'Meaning Max. Str. &gt;=',
			default: 0,
            filter_value_map: streakValueAdjustment,
            filter_func: meaningMaxStrGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningMaxStrGteqFilterHover_tip,
		};
	}

	function meaningMaxStrGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.meaning_max_streak >= filterValue;
	}

	function registerMeaningMaxStrLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[meaningMaxStrLteqFilterName] = {
			type: 'number',
			label: 'Meaning Max. Str. &lt;=',
			default: 100,
            filter_value_map: streakValueAdjustment,
			filter_func: meaningMaxStrLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: meaningMaxStrLteqFilterHover_tip,
		};
	}

	function meaningMaxStrLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
		return review_statistics.meaning_max_streak <= filterValue;
	}
	// END Meaning Maximum Streak

    // BEGIN Reading Current Streak
    let readingCurStrGteqFilterHover_tip = 'Selects items where current Reading streak is &gt;= this value.';
    let readingCurStrLteqFilterHover_tip = 'Selects items where current Reading streak is &lt;= this value.';

	function registerReadingCurStrGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingCurStrGteqFilterName] = {
			type: 'number',
			label: 'Reading Cur. Str. &gt;=',
			default: 0,
            filter_value_map: streakValueAdjustment,
            filter_func: readingCurStrGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingCurStrGteqFilterHover_tip,
		};
	}

	function readingCurStrGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return review_statistics.reading_current_streak	 >= filterValue;
	}

	function registerReadingCurStrLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingCurStrLteqFilterName] = {
			type: 'number',
			label: 'Reading Cur. Str. &lt;=',
			default: 100,
            filter_value_map: streakValueAdjustment,
			filter_func: readingCurStrLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingCurStrLteqFilterHover_tip,
		};
	}

	function readingCurStrLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return review_statistics.reading_current_streak	 <= filterValue;
	}
	// END Reading Current Streak

	// BEGIN Reading Maximum Streak
    let readingMaxStrGteqFilterHover_tip = 'Selects items where maximum Reading streak is &gt;= this value.';
    let readingMaxStrLteqFilterHover_tip = 'Selects items where maximum Reading streak is &lt;= this value.';

	function registerReadingMaxStrGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingMaxStrGteqFilterName] = {
			type: 'number',
			label: 'Reading Max. Str. &gt;=',
			default: 0,
            filter_value_map: streakValueAdjustment,
            filter_func: readingMaxStrGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingMaxStrGteqFilterHover_tip,
		};
	}

	function readingMaxStrGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return review_statistics.reading_max_streak >= filterValue;
	}

	function registerReadingMaxStrLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[readingMaxStrLteqFilterName] = {
			type: 'number',
			label: 'Reading Max. Str. &lt;=',
			default: 100,
            filter_value_map: streakValueAdjustment,
			filter_func: readingMaxStrLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: readingMaxStrLteqFilterHover_tip,
		};
	}

	function readingMaxStrLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return true;
        }
		return review_statistics.reading_max_streak <= filterValue;
	}
	// END Reading Maximum Streak

	// BEGIN Both Current Streaks
    let bothCurStrGteqFilterHover_tip = 'Selects items where both current Meaning streak\nand current Reading streak are &gt;= this value.';
    let bothCurStrLteqFilterHover_tip = 'Selects items where both current Meaning streak\nand current Reading streak are &lt;= this value.';

	function registerBothCurStrGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[bothCurStrGteqFilterName] = {
			type: 'number',
			label: 'Both Cur. Str. &gt;=',
			default: 0,
            filter_value_map: streakValueAdjustment,
            filter_func: bothCurStrGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: bothCurStrGteqFilterHover_tip,
		};
	}

	function bothCurStrGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_current_streak >= filterValue;
        } else {
		    return review_statistics.meaning_current_streak >= filterValue && review_statistics.reading_current_streak >= filterValue;
        }
	}

	function registerBothCurStrLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[bothCurStrLteqFilterName] = {
			type: 'number',
			label: 'Both Cur. Str. &lt;=',
			default: 100,
            filter_value_map: streakValueAdjustment,
			filter_func: bothCurStrLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: bothCurStrLteqFilterHover_tip,
		};
	}

	function bothCurStrLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_current_streak <= filterValue;
        } else {
		    return review_statistics.meaning_current_streak <= filterValue && review_statistics.reading_current_streak <= filterValue;
        }
	}
	// END Both Current Streaks

	// BEGIN Minimum Current Streaks
    let minCurStrGteqFilterHover_tip = 'Selects items where the minimum of current Meaning streak\nand current Reading streak is &gt;= this value.';
    let minCurStrLteqFilterHover_tip = 'Selects items where the minimum of current Meaning streak\nand current Reading streak is &lt;= this value.';

	function registerMinCurStrGteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[minCurStrGteqFilterName] = {
			type: 'number',
			label: 'Minimum Cur. Str. &gt;=',
			default: 0,
            filter_value_map: streakValueAdjustment,
            filter_func: minCurStrGteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: minCurStrGteqFilterHover_tip,
		};
	}

	function minCurStrGteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_current_streak >= filterValue;
        } else {
		    return review_statistics.meaning_current_streak >= filterValue && review_statistics.reading_current_streak >= filterValue;
        };
	}

	function registerMinCurStrLteqFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[minCurStrLteqFilterName] = {
			type: 'number',
			label: 'Minimum Cur. Str. &lt;=',
			default: 100,
            filter_value_map: streakValueAdjustment,
			filter_func: minCurStrLteqFilter,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: minCurStrLteqFilterHover_tip,
		};
	}

	function minCurStrLteqFilter(filterValue, item) {
        let review_statistics = item.review_statistics;
		if (review_statistics === undefined) {
			return false;
		}
        if (item.object === 'radical' || item.object === 'kana_vocabulary'){
	    	return review_statistics.meaning_current_streak <= filterValue;
        } else {
	    	return review_statistics.meaning_current_streak <= filterValue || review_statistics.reading_current_streak <= filterValue;
        }
	}
	// END Minimum Current Streaks

    updateFiltersWhenReady();
})(window.wkof);