// ==UserScript==
// @name          WaniKani Open Framework Date Filters
// @namespace     https://www.wanikani.com
// @description   Additional date filters for the WaniKani Open Framework
// @author        prouleau
// @version       1.3.1
// @include       https://www.wanikani.com/*
// @license       MIT; http://opensource.org/licenses/MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/412570/WaniKani%20Open%20Framework%20Date%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/412570/WaniKani%20Open%20Framework%20Date%20Filters.meta.js
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
	var settingsScriptId = 'dateFilters';
	var settingsTitle = 'Date Filters';

	var needToRegisterFilters = true;

	var filterNamePrefix = 'dateFilters_';
	var reviewIsScheduledFilterName = filterNamePrefix + 'reviewIsScheduled';
	var reviewAfterFilterName = filterNamePrefix + 'reviewAfter';
	var reviewBeforeFilterName = filterNamePrefix + 'reviewBefore';
	var hadLastReviewFilterName = filterNamePrefix + 'hadLastReviewScheduled';
	var lastReviewAfterFilterName = filterNamePrefix + 'lastReviewAfter';
	var lastReviewBeforeFilterName = filterNamePrefix + 'lastReviewBefore';
	var hadLessonFilterName = filterNamePrefix + 'hadLesson';
	var lessonAfterFilterName = filterNamePrefix + 'lessonAfter';
	var lessonBeforeFilterName = filterNamePrefix + 'lessonBefore';
	var hadPassedGuruFilterName = filterNamePrefix + 'hadPassedGuru';
	var passedGuruAfterFilterName = filterNamePrefix + 'passedGuruAfter';
	var passedGuruBeforeFilterName = filterNamePrefix + 'passedGuruBefore';
	var burnedAfterFilterName = filterNamePrefix + 'burnedAfter';
	var burnedBeforeFilterName = filterNamePrefix + 'burnedBefore';
	var hadResurrectedFilterName = filterNamePrefix + 'hadResurrected';
	var resurrectedAfterFilterName = filterNamePrefix + 'resurrectedAfter';
	var resurrectedBeforeFilterName = filterNamePrefix + 'resurrectedBefore';
	var isUnlLockedFilterName = filterNamePrefix + 'isUnlocked';
	var unlockedAfterFilterName = filterNamePrefix + 'unlockedAfter';
	var unlockedBeforeFilterName = filterNamePrefix + 'unlockedBefore';

	var supportedFilters = [reviewIsScheduledFilterName, reviewAfterFilterName, reviewBeforeFilterName, hadLessonFilterName, lessonAfterFilterName, lessonBeforeFilterName,
                            hadPassedGuruFilterName, passedGuruAfterFilterName, passedGuruBeforeFilterName, burnedAfterFilterName, burnedBeforeFilterName,
                            hadResurrectedFilterName, resurrectedAfterFilterName, resurrectedBeforeFilterName,
                            isUnlLockedFilterName, unlockedAfterFilterName, unlockedBeforeFilterName,
                            hadLastReviewFilterName, lastReviewAfterFilterName, lastReviewBeforeFilterName];

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

		registerReviewIsScheduledFilter();
		registerReviewAfterFilter();
		registerReviewBeforeFilter();
		registerHadLastReviewFilter();
		registerLastReviewAfterFilter();
		registerLastReviewBeforeFilter();
		registerHadLessonFilter();
		registerLessonAfterFilter();
		registerLessonBeforeFilter();
		registerHadPassedGuruFilter();
		registerPassedGuruAfterFilter();
		registerPassedGuruBeforeFilter();
		registerBurnedAfterFilter();
		registerBurnedBeforeFilter();
		registerHadResurrectedFilter();
		registerResurrectedAfterFilter();
		registerResurrectedBeforeFilter();
		registerHadUnlockedFilter();
		registerUnockedAfterFilter();
		registerUnockedBeforeFilter();

		needToRegisterFilters = false;
        wkof.set_state(settingsScriptId, 'ready');
	}

    //=======================================
    // Date Validation and Parsing Functions
    //=======================================

   //=======================================
    // All time validation functions and the parsing function accept
    // YYYY-MM-DD 24:00 to mean next day at 00:00
    // According to wikipedia this is part of the 24 hours time comvention
    //=======================================

    //=======================================
    // This group of functions nails the format to YYYY-MM-DD something
    //=======================================
    // Error messages
    const errorWrongDateTimeFormat = 'Use YYYY-MM-DD HH:MM [24h, 12h]';
    const errorWrongDateTimeRelativeFormat = 'Use YYYY-MM-DD HH:MM [24h, 12h]<br>Or +10d3h45m or -4h12h30m<br>+- needed, rest may be omitted';
    const errorWrongDateTimeFullFormat = 'Use YYYY-MM-DD HH:MM:SS.mmm<br>Seconds and milliseconds optional';
    const errorWrongDateTimeFullRelativeFormat = 'Use YYYY-MM-DD HH:MM:SS.mmm<br>Seconds and milliseconds optional<br>Or +10d3h45m12s -4h12h30m10s<br>+- needed, rest may be omitted';
    const errorWrongDateFormat = 'Invalid date - Use YYYY-MM-DD';
    const errorWrongDateRelativeFormat = 'Invalid date - Use YYYY-MM-DD<br>Or +10d or -2d';
    const errorOutOfRange = 'Number out of range';

    //=======================================
    // Validates datetime in YYYY-MM-DD HH:MM format
    // Accepts both 24h and 12h formats (am pm)
    // Accepts YYYY-MM-DD (HH:MM omitted)
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDateTime(dateString, config){
        dateString = dateString.trim();
        if (dateString.length > 18){
           return errorWrongDateTimeFormat;
        } else {
            let result = validateDate(dateString.slice(0,10), config);
            if (result === errorOutOfRange) return errorOutOfRange;
            if (result !== true) return errorWrongDateTimeFormat;
            if (dateString.length === 10) return true; //Valid YYY-MM-DD and nothing else
            result = validateTime(dateString.slice(0,16));
            if (result === errorOutOfRange) return errorOutOfRange;
            if (result !== true) return errorWrongDateTimeFormat;
            if (dateString.length === 16){
                return true
            } else {
                if (dateString.length === 18){
                    let suffix = dateString.slice(16)
                    if (suffix === 'am' || suffix === 'pm'){
                        let hh = Number(dateString.slice(11, 13))
                        if (hh < 1 || hh > 12){return errorOutOfRange}
                        return true
                    } else {
                        return errorWrongDateTimeFormat;
                    }
                }
                return errorWrongDateTimeFormat;
            };
        };
        return errorWrongDateTimeFormat;
    };

    //=======================================
    // Validates datetime in YYYY-MM-DD HH:MM format or relative time format
    // Accepts both 24h and 12h formats (am pm)
    // Accepts YYYY-MM-DD (HH:MM omitted)
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDateTimeRelative(dateString, config){
        dateString = dateString.trim();
        if (dateString.match(/^([+-])(?:(\d+)[dD])?(?:(\d+)[hH])?(?:(\d+)[mM])?$/) !== null){
            if (dateString === '+' || dateString === '-') return errorWrongDateTimeRelativeFormat
            return true;
        } else {
            let result = validateDateTime(dateString, config)
            if (result === true || result === errorOutOfRange) return result;
            return errorWrongDateTimeRelativeFormat;
        }
    };

    //=======================================
    // Validates dates in YYYY-MM-DD format
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDate(dateString, config, keyword) {
        dateString = dateString.trim();
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return errorWrongDateFormat; // Invalid format
        let d = new Date(dateString);
        let dNum = d.getTime();
        if(!dNum && dNum !== 0) return errorOutOfRange; // NaN value, Invalid date
        let r = d.toISOString().slice(0,10) === dateString;
        if (r) {
            return true
        } else {
            return errorOutOfRange
        };
    }

    //=======================================
    // Helper function to validate time in HH:MM format
    // It should not be publicly exposed
    function validateTime(timeString) {
      let regEx = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
      if(!timeString.match(regEx)) return 'No match'; // Invalid format
      let d = new Date(timeString);
      let dNum = d.getTime();
      if(!dNum && dNum !== 0) return errorOutOfRange; // NaN value, Invalid date
      return true
    }

    //=======================================
    // Parses a validated date in YYYY-MM-DD format
    // Also parse a validated datetime in YYYY-MM-DD HH:MM format
    // Parses datetime in both 12h and 24h formats
    // Parses optional seconds and milliseconds
    // Returns the corresponding date object for this date/datetime in the local time zone
    // May return an invalid date if presented with empty or invalid data - but not always
    // If there is doubt about the quality of the data, validate first
    // Suitable to parse a validated date from a text component in a setting
    function parseDateTime(dateString) {
        dateString = dateString.trim(); // validation allows leading and trailing blanks
        try {
            if (dateString === '') return new Date('###'); // returns an invalid date
            let match = dateString.match(/^([+-])(?:(\d+)[dD])?(?:(\d+)[hH])?(?:(\d+)[mM])?(?:(\d+)[sS])?$/);
            if (match !== null){
                if (dateString === '+' || dateString === '-') return new Date('###'); // returns an invalid date
                let date = Date.now();
                let sign = (match[1] === '+' ? 1 : -1);
                let days = (match[2] || 0) * 86400000;
                let hrs = (match[3] || 0) * 3600000;
                let min = (match[4] || 0) * 60000;
                let sec = (match[5] || 0) * 1000;
                return new Date(date + sign * (days + hrs + min + sec));
            }
            // new Date() uses local time zone when the parameters are separated
            let YY = Number(dateString.substring(0, 4));
            let MM = Number(dateString.substring(5, 7))-1;
            let DD = Number(dateString.substring(8, 10));
            let hh = (dateString.length >= 13) ? Number(dateString.substring(11, 13)) : 0;
            let mm = (dateString.length >= 16) ? Number(dateString.substring(14, 16)) : 0;
            let ss = (dateString.length >= 19) ? Number(dateString.substring(17, 19)) : 0;
            let ml = (dateString.length === 23) ? Number(dateString.substring(20, 23)) : 0;

            let suffix = (dateString.length === 18) ? dateString.substring(16, 18) : ''
            if (suffix === 'am' || suffix === 'pm'){ // if 12 hours format, convert to 24 hours
                if (hh === 12) hh = 0;
                if (suffix === 'pm') hh += 12;
            }
            return new Date(YY, MM, DD, hh, mm, ss, ml);
        } catch (e) {
            return new Date('###'); // returns an invalid date in case of error
        }
    }

    function filter_value_map_wrapper(funct){
        return function(param){return funct(param).getTime()}
    }

	// BEGIN Reviews
    let reviewIsScheduledHover_tip = 'If checked selects items for which a review is scheduled.\nIf unchecked selects the items for which no review is scheduled.';
    let reviewAfterFilterHover_tip = 'Selects items whose review date is at or after this date';
    let reviewBeforeFilterHover_tip = 'Selects items whose review date is at or before this date';

	function registerReviewIsScheduledFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[reviewIsScheduledFilterName] = {
			type: 'checkbox',
			label: 'Review Is Scheduled',
			default: true,
			filter_func: reviewIsScheduledFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: reviewIsScheduledHover_tip,
		};
	}

	function reviewIsScheduledFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return !filterValue;
		};
		return filterValue ? (item.assignments.available_at !== null) : (item.assignments.available_at === null);
	}

	function registerReviewAfterFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[reviewAfterFilterName] = {
			type: 'text',
			label: 'Review After',
			default: '2000-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: reviewAfterFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: reviewAfterFilterHover_tip,
		};
	}

	function reviewAfterFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.available_at === null) {
			return false;
		}
        let d = new Date(item.assignments.available_at)
        d = d.getTime();
		return d >= filterValue;
	}

	function registerReviewBeforeFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[reviewBeforeFilterName] = {
			type: 'text',
			label: 'Review Before',
			default: '2100-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: reviewBeforeFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: reviewBeforeFilterHover_tip,
		};
	}

	function reviewBeforeFilter(filterValue, item) {
        let r = new Date(filterValue);
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.available_at === null) {
			return false;
		}
        let d = new Date(item.assignments.available_at)
        d = d.getTime();
		return d <= filterValue;
	}
	// END Reviews

	// BEGIN Last Reviews

    const regularSrsIntervals = [0, 4, 8, 23, 47, 167, 335, 719, 2879];
    const acceleratedSrsIntervals = [0, 2, 4, 8, 23, 167, 335, 719, 2879];
    const acceleratedLevels = [1, 2];

    function computeLastReviewDate(item){
        let srsStage = item.assignments.srs_stage;
        if (srsStage === 0 || srsStage === 9) return false;
        let srsInvervals = acceleratedLevels.includes(item.data.level) ? acceleratedSrsIntervals : regularSrsIntervals;
		let deltaTime = parseInt(srsInvervals[srsStage]) * 1000 * 60 * 60; // convert hours to in milliseconds
        return new Date(item.assignments.available_at) - deltaTime;
    }

    let hadLastReviewHover_tip = 'If checked selects items for which you had a review.\nIf unchecked selects the items for which you never had a review.';
    let lastReviewAfterFilterHover_tip = 'Selects items whose last review date is at or after this date';
    let lastReviewBeforeFilterHover_tip = 'Selects items whose last review date is at or before this date';

	function registerHadLastReviewFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[hadLastReviewFilterName] = {
			type: 'checkbox',
			label: 'Had a Review',
			default: true,
			filter_func: hadLastReviewFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: hadLastReviewHover_tip,
		};
	}

	function hadLastReviewFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return !filterValue;
		};
		return filterValue ? (item.assignments.available_at !== null) : (item.assignments.available_at === null);
	}

	function registerLastReviewAfterFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[lastReviewAfterFilterName] = {
			type: 'text',
			label: 'Last Review After',
			default: '2000-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: lastReviewAfterFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: lastReviewAfterFilterHover_tip,
		};
	}

	function lastReviewAfterFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.available_at === null) {
			return false;
		}
        let d = computeLastReviewDate(item);
        if (d === false) return false;
		return d >= filterValue;
	}

	function registerLastReviewBeforeFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[lastReviewBeforeFilterName] = {
			type: 'text',
			label: 'Last Review Before',
			default: '2100-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: lastReviewBeforeFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: lastReviewBeforeFilterHover_tip,
		};
	}

	function lastReviewBeforeFilter(filterValue, item) {
        let r = new Date(filterValue);
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.available_at === null) {
			return false;
		}
        let d = computeLastReviewDate(item);
        if (d === false) return false;
		return d <= filterValue;
	}
	// END Last Reviews

	// BEGIN Lessons
    let hadLessonFilterHover_tip = 'If checked selects items for which a lesson has been taken.\nIf unchecked selects the items for which no lesson were taken.';
    let lessonAfterFilterHover_tip = 'Selects items whose lesson date is at or after this date';
    let lessonBeforeFilterHover_tip = 'Selects items whose lesson date is at or before this date';

	function registerHadLessonFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[hadLessonFilterName] = {
			type: 'checkbox',
			label: 'Had Lessons',
			default: true,
			filter_func: hadLessonFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: hadLessonFilterHover_tip,
		};
	}

	function hadLessonFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return !filterValue;
		}
		return filterValue ? (item.assignments.started_at !== null) : (item.assignments.started_at === null);
	}

	function registerLessonAfterFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[lessonAfterFilterName] = {
			type: 'text',
			label: 'Lesson After',
			default: '2000-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: lessonAfterFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: lessonAfterFilterHover_tip,
		};
	}

	function lessonAfterFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.started_at === null) {
			return false;
		}
        let d = new Date(item.assignments.started_at)
        d = d.getTime()
		return d >= filterValue;
	}

	function registerLessonBeforeFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[lessonBeforeFilterName] = {
			type: 'text',
			label: 'Lesson Before',
			default: '2100-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: lessonBeforeFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: lessonBeforeFilterHover_tip,
		};
	}

	function lessonBeforeFilter(filterValue, item) {
        let r = new Date(filterValue);
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.started_at === null) {
			return false;
		}
        let d = new Date(item.assignments.started_at)
        d = d.getTime()
		return d <= filterValue;
	}
	// END Lessons

	// BEGIN Passed Guru
    let hadPassedGuruFilterHover_tip = 'If checked selects items that have passed guru.\nIf unchecked selects the items that have never passed guru.';
    let passedGuruAfterFilterHover_tip = 'Selects items whose passed guru date is at or after this date';
    let passedGuruBeforeFilterHover_tip = 'Selects items whose passed guru date is at or before this date';

	function registerHadPassedGuruFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[hadPassedGuruFilterName] = {
			type: 'checkbox',
			label: 'Had Passed Guru',
			default: true,
			filter_func: hadPassedGuruFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: hadPassedGuruFilterHover_tip,
		};
	}

	function hadPassedGuruFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return !filterValue;
		}
		return filterValue ? (item.assignments.passed_at !== null) : (item.assignments.passed_at === null);
	}

	function registerPassedGuruAfterFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[passedGuruAfterFilterName] = {
			type: 'text',
			label: 'Passed Guru After',
			default: '2000-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: passedGuruAfterFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: passedGuruAfterFilterHover_tip,
		};
	}

	function passedGuruAfterFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.passed_at === null) {
			return false;
		}
        let d = new Date(item.assignments.passed_at)
        d = d.getTime()
		return d >= filterValue;
	}

	function registerPassedGuruBeforeFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[passedGuruBeforeFilterName] = {
			type: 'text',
			label: 'Passed Guru Before',
			default: '2100-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: passedGuruBeforeFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: passedGuruBeforeFilterHover_tip,
		};
	}

	function passedGuruBeforeFilter(filterValue, item) {
        let r = new Date(filterValue);
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.passed_at === null) {
			return false;
		}
        let d = new Date(item.assignments.passed_at)
        d = d.getTime()
		return d <= filterValue;
	}
	// END Passed Guru

	// BEGIN Burned
    //let hadPassedGuruFilterHover_tip = 'If checked selects items that have passed guru.\nIf unchecked selects the items that have never passed guru.';
    let burnedAfterFilterHover_tip = 'Selects items who were burned at or after this date';
    let burnedBeforeFilterHover_tip = 'Selects items who were burned at or before this date';

	function registerBurnedAfterFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[burnedAfterFilterName] = {
			type: 'text',
			label: 'Burned After',
			default: '2000-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: burnedAfterFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: burnedAfterFilterHover_tip,
		};
	}

	function burnedAfterFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.burned_at === null) {
			return false;
		}
        let d = new Date(item.assignments.burned_at)
        d = d.getTime()
		return d >= filterValue;
	}

	function registerBurnedBeforeFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[burnedBeforeFilterName] = {
			type: 'text',
			label: 'Burned Before',
			default: '2100-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: burnedBeforeFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: burnedBeforeFilterHover_tip,
		};
	}

	function burnedBeforeFilter(filterValue, item) {
        let r = new Date(filterValue);
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.burned_at === null) {
			return false;
		}
        let d = new Date(item.assignments.burned_at)
        d = d.getTime()
		return d <= filterValue;
	}
	// END Burned

	// BEGIN Resurrected
    let hadResurrectedFilterHover_tip = 'If checked selects items that have been resurrected.\nIf unchecked selects the items that have never been resurrected.';
    let resurrectedAfterFilterHover_tip = 'Selects items who were resurrected at or after this date';
    let resurrectedBeforeFilterHover_tip = 'Selects items who were resurrected at or before this date';

	function registerHadResurrectedFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[hadResurrectedFilterName] = {
			type: 'checkbox',
			label: 'Has Been Resurrected',
			default: true,
			filter_func: hadResurrectedFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: hadResurrectedFilterHover_tip,
		};
	}

	function hadResurrectedFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return !filterValue;
		}
		return filterValue ? (item.assignments.resurrected_at !== null) : (item.assignments.resurrected_at === null);
	}

	function registerResurrectedAfterFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[resurrectedAfterFilterName] = {
			type: 'text',
			label: 'Resurrected After',
			default: '2000-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: resurrectedAfterFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: resurrectedAfterFilterHover_tip,
		};
	}

	function resurrectedAfterFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.resurrected_at === null) {
			return false;
		}
        let d = new Date(item.assignments.resurrected_at)
        d = d.getTime()
		return d >= filterValue;
	}

	function registerResurrectedBeforeFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[resurrectedBeforeFilterName] = {
			type: 'text',
			label: 'Resurrected Before',
			default: '2100-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: resurrectedBeforeFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: resurrectedBeforeFilterHover_tip,
		};
	}

	function resurrectedBeforeFilter(filterValue, item) {
        let r = new Date(filterValue);
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.resurrected_at === null) {
			return false;
		}
        let d = new Date(item.assignments.resurrected_at)
        d = d.getTime()
		return d <= filterValue;
	}
	// END Resurrected

	// BEGIN Unlocked
    let hadUnlockedFFilterHover_tip = 'If checked selects items that have been unlocked.\nIf unchecked selects the items that are locked.';
    let unlockedAfterFilterHover_tip = 'Selects items who were unlocked at or after this date';
    let unlockedBeforeFilterHover_tip = 'Selects items who were unlocked at or before this date';

	function registerHadUnlockedFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[isUnlLockedFilterName] = {
			type: 'checkbox',
			label: 'Has Been Unlocked',
			default: true,
			filter_func: hadUnlockedFilter,
			set_options: function(options) { options.assignments = true; },
			hover_tip: hadUnlockedFFilterHover_tip,
		};
	}

	function hadUnlockedFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return !filterValue;
		}
		return filterValue ? (item.assignments.unlocked_at !== null) : (item.assignments.unlocked_at === null);
	}

	function registerUnockedAfterFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[unlockedAfterFilterName] = {
			type: 'text',
			label: 'Unlocked After',
			default: '2000-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func: unlockedAfterFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: unlockedAfterFilterHover_tip,
		};
	}

	function unlockedAfterFilter(filterValue, item) {
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.unlocked_at === null) {
			return false;
		}
        let d = new Date(item.assignments.unlocked_at)
        d = d.getTime()
		return d >= filterValue;
	}

	function registerUnockedBeforeFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[unlockedBeforeFilterName] = {
			type: 'text',
			label: 'Unlocked Before',
			default: '2100-01-01',
			placeholder: 'YYYY-MM-DD HH:MM [24h 12h]',
            validate: validateDateTimeRelative,
			filter_func:  unlockedBeforeFilter,
            filter_value_map: filter_value_map_wrapper(parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip:  unlockedBeforeFilterHover_tip,
		};
	}

	function unlockedBeforeFilter(filterValue, item) {
        let r = new Date(filterValue);
		if (item.assignments === undefined) {
			return false;
		}
		if (item.assignments.unlocked_at === null) {
			return false;
		}
        let d = new Date(item.assignments.unlocked_at)
        d = d.getTime()
		return d <= filterValue;
	}
	// END Unlocked

    updateFiltersWhenReady();
})(window.wkof);