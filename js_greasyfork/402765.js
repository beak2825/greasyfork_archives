// ==UserScript==
// @name         WaniKani Dashboard Cockpit
// @namespace    rwesterhof
// @version      0.7.5
// @description  Complete alternate dashboard style for the basic panels
// @include      /^https:\/\/(www|preview)\.wanikani\.com(\/(#)?dashboard)?(\/)?$/
// @run-at       document-end
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/402765/WaniKani%20Dashboard%20Cockpit.user.js
// @updateURL https://update.greasyfork.org/scripts/402765/WaniKani%20Dashboard%20Cockpit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* global $, wkof */

    if (!window.wkof) {
        let response = confirm('WaniKani Dashboard Cockpit script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    wkof.include('Menu,Settings,ItemData');
    wkof.ready('Menu,Settings')
        .then(load_settings)
        .then(install_menu)
        .then(add_css)
        .then(createPanels)
        .then(createPanelContents)
        .then(displayCache)
        .then(wkof.ready('ItemData').then(fetch_and_update));

    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    //-------------------------------------------------------------------LOGIC AND RULES-------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    var CACHE_VERSION = '0.2';
    var CACHE_KEY = 'db_cockpit_cache';
    function displayCache() {
        var cached_json = localStorage.getItem(CACHE_KEY);
        if (cached_json) {
            var cached = JSON.parse(cached_json);
            if (cached.version == CACHE_VERSION) {
                lockedCount = cached.lockedCount;
                update_display(cached.itemBreakdown);
            }
            else if (cached.version == '0.1') {
                cached.itemBreakdown.allPassed = false;
                lockedCount = cached.lockedCount;
                update_display(cached.itemBreakdown);
            }
        }
    }

    function fetch_and_update() {
        fetch_locked_items()
            .then(processLockedItems)
            .then(fetch_assignment_items)
            .then(constructItemBreakdown)
            .then(update_display);
    }

    function update_display(itemBreakdown) {
        repositionMainPanel();
        loadSizes();
        clearCanvas();
        drawSRSProgress(itemBreakdown);
        drawSRSProgressDetail(itemBreakdown);
        drawSRSProgressLeechCounts(itemBreakdown);
        drawSRSProgressLevel(itemBreakdown);
        // works on global var because of dual wkof retrieve
        createLockedCount(itemBreakdown);
        createTotalProgressIndication(itemBreakdown);
        displayGrid(itemBreakdown.allPassed);
        reOffsetCanvas();

        // fires a custom event to signal cockpit loaded
        const event = document.createEvent('Event');
        event.initEvent("dashboard-cockpit-loaded", true, true);
        $('#cockpitPanel')[0].dispatchEvent(event);
    }

    // Fetches the relevant items
    function fetch_assignment_items() {
        var config = {
            wk_items: {
                options: { review_statistics: true, assignments: true },
			    filters: { srs: '0,1,2,3,4,5,6,7,8,9' }
			}
		};
		return wkof.ItemData.get_items(config);
	}

    function fetch_locked_items() {
        const config = {
            wk_items: {
                options: { assignments: true },
                filters: { srs: '-1' }
            }
        };
        return wkof.ItemData.get_items(config);
    }

    // filtering by srs abbrev (App|Mas|Guru1|...)
	function filterBySRSCountOnAbbrev(counts, abbrev) {
		return counts.filter(function(countItem) {
            return countItem.name.slice(0, abbrev.length) == abbrev;
        });
	}

    var lockedCount = { name: "Loc", total: 0, radical: 0, kanji: 0, vocabulary: 0 };
    const SUBJECT_TYPE_MAP = { 'radical': 'radical', 'kanji': 'kanji', 'vocabulary': 'vocabulary', 'kana_vocabulary': 'vocabulary' };
    function processLockedItems(data) {
        const type = wkof.ItemData.get_index(data, 'item_type');
        lockedCount = { name: "Loc", total: 0, radical: 0, kanji: 0, vocabulary: 0 };
        lockedCount.total = data.length;
        Object.keys(SUBJECT_TYPE_MAP).forEach(itemType => {
            var mappedType = SUBJECT_TYPE_MAP[itemType];
            lockedCount[mappedType] += (type[itemType]||[]).length;
        });
    }

    // helper function to construct the counts overview objects
    function constructBreakdown() {
        return {
            total: 0,
            progressScore: 0,
            bySRSArray: [
                { name: "Loc", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Ini", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Appr1", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Appr2", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Appr3", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Appr4", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Guru1", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Guru2", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Mas", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Enl", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 },
                { name: "Bur", total: 0, radical: 0, kanji: 0, vocabulary: 0, leech: 0 }
            ]
        };
    }

    // constants for the intervals
    var srsConstants = {
        duration: [ 0, 14400, 28800, 82800, 169200, 601200, 1206000, 2588400, 10364400, 0 ],
        stageWeight: [ 0, 1, 3, 5, 7, 10, 14, 20, 28, 36 ],
        stageProgressWeight: [ 0, 1, 1, 1, 1, 2, 2, 4, 4, 0 ]
    }

    // run past the list of items (data) to produce the various counts we need
    function constructItemBreakdown(data) {
        var itemBreakdown = {
            level: 0,
            allPassed: true, // start optimistically
            countBySRS: constructBreakdown(),
            countByLevel: []
        };

        var now = new Date();
        // get the setting, but enforce range 1-4
        var leechThreshold = Math.min(4, Math.max(1, wkof.settings.db_cockpit.leechThreshold));
        var leechMinWrong = Math.min(10, Math.max(1, wkof.settings.db_cockpit.leechMinWrong));

        var processItem = function(item) {
            var level = item.data.level;
            if (!itemBreakdown.countByLevel[level]) {
                itemBreakdown.countByLevel[level] = constructBreakdown();
            }

            if (item.assignments) {
                var srsStage = item.assignments.srs_stage;

                itemBreakdown.countByLevel[level].bySRSArray[srsStage+1][SUBJECT_TYPE_MAP[item.assignments.subject_type]]++;
                itemBreakdown.countByLevel[level].bySRSArray[srsStage+1].total++;
                itemBreakdown.countBySRS.bySRSArray[srsStage+1][SUBJECT_TYPE_MAP[item.assignments.subject_type]]++;
                itemBreakdown.countBySRS.bySRSArray[srsStage+1].total++;

                // calculate progress score for this item
                var stageScore = srsConstants.stageWeight[item.assignments.srs_stage];
                if (item.assignments.available_at != undefined) {
                    stageScore += srsConstants.stageProgressWeight[srsStage] * (1 - (Math.max(((new Date(item.assignments.available_at) - now)), 0) / (1000 * srsConstants.duration[srsStage])));
                }
                itemBreakdown.countByLevel[level].progressScore += stageScore;

                // check for leech status
                if (isLeech(item, leechThreshold, leechMinWrong)) {
//                    console.log(\"Item \" + item.data.characters + \" identified as leech due to (meaning, reading) (\" + item.review_statistics.meaning_incorrect + \", \" + item.review_statistics.reading_incorrect + \") wrong answers\");
                    itemBreakdown.countBySRS.bySRSArray[srsStage+1].leech++;
                }

                // check for passed
                itemBreakdown.allPassed = itemBreakdown.allPassed && (item.assignments.passed == undefined ? item.assignments.passed_at != null : item.assignments.passed);
            }
            else {
                // for locked items we have no information on type - this will need to be retrieved separately to display locked detail info
                itemBreakdown.countByLevel[level].bySRSArray[0].total++;
                itemBreakdown.countBySRS.bySRSArray[0].total++;
                itemBreakdown.allPassed = false;
            }
            itemBreakdown.countByLevel[level].total++;
            itemBreakdown.countBySRS.total++;
		}

        data.forEach(processItem);

        // and grab the user's current level
        itemBreakdown.level = $('li.user-summary__attribute a')[0].href.split('/level/')[1];

        // cache the results for next page load
        var json = { version: CACHE_VERSION, itemBreakdown: itemBreakdown, lockedCount: lockedCount };
        localStorage.setItem(CACHE_KEY, JSON.stringify(json));
        return itemBreakdown;
    }

	function isLeech(item, threshold, leechMinWrong) {
		if (item.review_statistics === undefined) {
			return false;
		}

        // don't treat items that you got wrong once or twice as leeches immediately
        var sufficientErrors = ((item.review_statistics.meaning_incorrect + item.review_statistics.reading_incorrect) >= leechMinWrong);
        if (!sufficientErrors) {
            return false;
        }

        let reviewStats = item.review_statistics;
		let meaningScore = getLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
		let readingScore = getLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

		return meaningScore >= threshold || readingScore >= threshold;
	}

	function getLeechScore(incorrect, currentStreak) {
		return incorrect / Math.pow((currentStreak || 0.5), 1.5);
	}

    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------------------------INTEGRATION WITH EXTRA STUDY MOVER----------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    // detects if the Extra Study Mover script is present. It should execute BEFORE the cockpit
    function isESMPresent() {
        return $('.es-mover').length;
    }

    // get the configured location from the Extra Study Mover added class
    // note: this also retrieves the applied style, but we can ignore that later
    function getESMLocation() {
        if (isESMPresent()) {
            var classList = $('.wk-panel--extra-study')[0].classList;
            return Array.from([... classList]).filter(name => name.startsWith('es-mover-')).map(name => name.slice(9));
        }

        return [];
    }

    // true if Extra Study Mover is present and it isn't configured for header or none
    // false if it is configured for header or none
    // AND false if Extra Study Mover does not exist
    function moveToESMLocation(esmLocations) {
        var useLocations = esmLocations;
        if (!useLocations) useLocations = getESMLocation();
        return !(useLocations.filter(name => (name == "header"))).length;
    }

    // true if the cockpit should move the Extra Study Panel at all
    function moveExtraStudy() {
        return !isESMPresent() || moveToESMLocation();
    }

    // translates both the ESM location (if present) and the cockpit setting (if needed)
    // to an equivalent cockpit setting
    function getExtraStudyLocationSetting() {
        if (!isESMPresent()) {
            return wkof.settings.db_cockpit.showExtraStudy;
        }
        else {
            var esmLocations = getESMLocation();
            if (moveToESMLocation(esmLocations)) {
                for (var loc in esmLocations) {
                    if (esmLocations[loc] == 'top')      return '7';  // cockpit doesn't have a proper top position available, so center top will have to do
                    if (esmLocations[loc] == 'above-rm') return '8';
                    if (esmLocations[loc] == 'above-lp') return '1';
                    if (esmLocations[loc] == 'below-lp') return '6';
                    if (esmLocations[loc] == 'above-ib') return '5';
                    if (esmLocations[loc] == 'below-ib') return '2';
                    if (esmLocations[loc] == 'above-rf') return '3';
                    if (esmLocations[loc] == 'below-rf') return '4';
                    if (esmLocations[loc] == 'none')     return '0';
                    // else zip, this might be a style, so go for the next one
                }
            }
            else {
                // not allowed to move (header)
                return '-1';
            }
        }

        // we only get here if ESM adds an extra location that we
        // don't recognise. Default to Above Level Progress
        console.log("Unknown Extra Study Panel location. Defaulting to Above Level Progress");
        return '1';
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------------------------INTEGRATION WITH REVIEW SUMMARY-------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    // detects if the Review Summary script is present. It should execute BEFORE the cockpit
    function isRSPresent() {
        return $('#reviewSummaryDiv').length;
    }
    function isRSVisible() {
        return isRSPresent() && wkof.settings.db_cockpit.showReviewSummary;
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------------------------------COMBINATION VISIBILITY----------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//

    function hasFutureLessons() {
        var lessonCount = parseInt($('.navigation-shortcut--lessons')[0].getAttribute("data-count"));
        return ((lockedCount.total + lessonCount) > 0);
    }

    function showLessonsButton() {
        return (   wkof.settings.db_cockpit.showMainButtons
                && (   !wkof.settings.db_cockpit.lvl60Lessons
                    || hasFutureLessons()
                   )
               );
    }

    function showLockedCount(optionalSpecificType) {
        var mustBeVisible = (wkof.settings.db_cockpit.showSrsLocked != '0');
        if (optionalSpecificType != undefined) {
            mustBeVisible = (wkof.settings.db_cockpit.showSrsLocked == optionalSpecificType);
        }
        return (   mustBeVisible
                && (   !wkof.settings.db_cockpit.lvl60Lessons
                    || hasFutureLessons()
                   )
               );
    }

    function showLevelProgress(allPassed) {
        return (   !allPassed
                || !wkof.settings.db_cockpit.lvl60Progress
               );
    }

    // true if either the forecast is visible or the extra study panel is displayed above/below the forecast position
    // included here as the latter is now possibly dependent on the ESM setting
    function isRightGridVisible(allPassed) {
        // need to show review forecast
        if (wkof.settings.db_cockpit.showForecast) {
            return true;
        }

        // need to show extra study
        var esLocation = getExtraStudyLocationSetting();
        if (   esLocation == '3'
            || esLocation == '4'
           ) {
            return true;
        }

        // need to show review button
        if (   wkof.settings.db_cockpit.showMainButtons
            && !isLeftGridVisible(allPassed)
           ) {
            return true;
        }

        if (   isRSVisible()
            && !isLeftGridVisible(allPassed)
            ) {
            return true;
        }

        return false;
    }

    function isLeftGridVisible(allPassed) {
        if (
            // need to show level progress panel
               showLevelProgress(allPassed)
            // need to show lessons button
            || showLessonsButton()
            // need to show locked count
            || showLockedCount()
           ) {
            return true;
        }

        // need to show extra study
        var esLocation = getExtraStudyLocationSetting();
        if (   esLocation == '-1'    // invisible extra study is visible recent mistakes on the left!
            || esLocation == '1'
            || esLocation == '6'
           ) {
            return true;
        }

        return false;
    }

    // NOTE! this function does not check for moving the reviews button to the left grid
    // always check isRightGridVisible() first
    function isTopRightCellVisible() {
        return (
            // need to show review button
            wkof.settings.db_cockpit.showMainButtons
            // or the review summary
            || isRSVisible()
           );
    }

    // NOTE this function only makes sense if leftGrid is known to be visible
    // it will block on a moved reviews button
    function isTopLeftCellVisible() {
        return (
            // need to show lessons button
               showLessonsButton()
            // need to show locked count
            || showLockedCount()
            // need to show reviews button or the summary
            || (   (   wkof.settings.db_cockpit.showMainButtons
                    || isRSVisible()
                   )
                && !isRightGridVisible(false)
               )
           );
    }

    function getLeftColumnWidth(allPassed) {
        var minWidth = 0;
        var marginToApply = 0;
        if (showLockedCount()) {
            minWidth += 120;
            marginToApply = 5;
        }
        if (showLessonsButton()) {
            minWidth += marginToApply;
            minWidth += 200;
            marginToApply = 10;
        }
        if (   !isRightGridVisible(allPassed)
            && wkof.settings.db_cockpit.showMainButtons
           ) {
            minWidth += marginToApply;
            minWidth += 200;
            marginToApply = 10;
            if (isRSVisible()) {
                minWidth += marginToApply;
                minWidth += 120;
                marginToApply = 10;
            }
        }

        if (minWidth < BASE_COLUMN_WIDTH) {
            var esLocation = getExtraStudyLocationSetting();
            if (   esLocation == '-1'   // invisible extra study is visible recent mistakes on the left!
                || esLocation == '1'
                || esLocation == '6'
                || showLevelProgress(allPassed)
               ) {
                minWidth = BASE_COLUMN_WIDTH;
            }
        }

        return minWidth;
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    //-----------------------------------------------------------------UTILITY FUNCTIONS-------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    function containsSection(element, component) {
        return (element.querySelector(component) != null);
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    //--------------------------------------------------------------------PRESENTATION---------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    var CANVAS_SIZE = [ 481, 401, 321 ]; // odd numbers to give it a center pixel
    function getCanvasSize() {
        var configured = wkof.settings.db_cockpit.srsSize ? parseInt(wkof.settings.db_cockpit.srsSize) : 0;
        return CANVAS_SIZE[configured];
    }
    function getCanvasGridWidth() {
        return (getCanvasSize() - 11) / 2;
    }
    var BASE_COLUMN_WIDTH = 335;

    // size definitions we'll populate after loading the settings
    var MAINBAR_WIDTH;
    var HELPERBAR_WIDTH;
    var canvasCenter = {
        "x": 0,
        "y": 0
    };

    // main srs circle
    var srsOutsideRadius;
    var srsInsideRadius;
    var srsTextRadius;
    // srs detail circle
    var srsOutsideDetailRadius;
    var srsInsideDetailRadius;
    var srsDetailTextRadius;
    // srs level circle
    var srsOutsideLevelRadius;
    var srsInsideLevelRadius;
    var srsLevelTextRadius;
    var levelProgressTextRadius;
    // additionalInfo
    var addInfo1TextRadius;

    function loadSizes() {
        MAINBAR_WIDTH = getCanvasSize() / 7;
        HELPERBAR_WIDTH = MAINBAR_WIDTH / 2;

        // pre calculations
        canvasCenter.x = (getCanvasSize() / 2);
        canvasCenter.y = (getCanvasSize() / 2);

        // main srs circle
        srsOutsideRadius = (getCanvasSize() - 1) / 2 - HELPERBAR_WIDTH;
        srsInsideRadius = srsOutsideRadius - MAINBAR_WIDTH;
        srsTextRadius = (srsOutsideRadius + srsInsideRadius) / 2;

        // srs detail circle
        srsOutsideDetailRadius = srsOutsideRadius + HELPERBAR_WIDTH;
        srsInsideDetailRadius = srsOutsideRadius;
        srsDetailTextRadius = (srsOutsideDetailRadius + srsInsideDetailRadius) / 2;

        // srs level circle
        srsOutsideLevelRadius = srsInsideRadius;
        srsInsideLevelRadius = srsInsideRadius - HELPERBAR_WIDTH;
        srsLevelTextRadius = (srsOutsideLevelRadius + srsInsideLevelRadius) / 2;
        levelProgressTextRadius = srsInsideRadius - (7 * HELPERBAR_WIDTH / 12);

        // additionalInfo
        addInfo1TextRadius = srsOutsideRadius - (HELPERBAR_WIDTH / 2);

        // and all the font sizes!!!
        var configured = wkof.settings.db_cockpit.srsSize ? parseInt(wkof.settings.db_cockpit.srsSize) : 0;
        var levelFontSize = 80 - 10*configured;
        var srsFontSize = 24 - 3*configured;
        var helperFontSize = 14 - 1.5*configured;
        var leechFontSize = 12 - configured;
        var levelProgressFontSize = 12 - configured;

        levelFont.fontStyle= "bold " + levelFontSize + "px Arial, sans-serif";
        levelFont.fontSize= calculateFontSize(levelFont.fontStyle);
        srsFont.fontStyle="bold " + srsFontSize + "px Arial, sans-serif";
        srsFont.fontSize= calculateFontSize(srsFont.fontStyle);
        helperFont.fontStyle= helperFontSize + "px Arial, sans-serif";
        helperFont.fontSize= calculateFontSize(helperFont.fontStyle);
        leechFont.fontStyle= leechFontSize + "px Arial, sans-serif";
        leechFont.fontSize= calculateFontSize(leechFont.fontStyle);
        levelProgressFont.fontStyle= "bold " + levelProgressFontSize + "px Arial, sans-serif";
        levelProgressFont.fontSize= calculateFontSize(levelProgressFont.fontStyle);
    }

    var srsStartAngle = [ 3.5, 2 ];
    var arcWidth = Math.PI * 2 / 6;

    var srsFont = {
        color: "#ffffff",
        fontStyle: "bold 24px Arial, sans-serif",
        fontSize: calculateFontSize("bold 24px Arial, sans-serif")
    }
    var levelFont = {
        color: function() {
            if (wkof.settings.db_cockpit.presetLevelColor == '0') {
                return {
                    start: "#dd0093",
                    end: "#0093dd"
                }
            }

            return {
                start: wkof.settings.db_cockpit.levelNrInside,
                end: wkof.settings.db_cockpit.levelNrOutside
            }
        },
        colorOld: {
            start: "#dd0093",
            end: "#0093dd"
        },
        fontStyle: "bold 80px Arial, sans-serif",
        fontSize: calculateFontSize("bold 80px Arial, sans-serif"),
        opacity: function() {
            if (wkof.settings.db_cockpit.presetLevelColor == '2') {
                return 0.6;
            }

            return 0.2;
        },
        lineWidth: 3
    }

    // srs detail circle
    var helperFont = {
        color: "#ffffff",
        fontStyle: "14px Arial, sans-serif",
        fontSize: calculateFontSize("14px Arial, sans-serif")
    }
    var leechFont = {
        color: "#ffffff",
        fontStyle: "12px Arial, sans-serif",
        fontSize: calculateFontSize("12px Arial, sans-serif"),
        bgColor: "#000000",
        opacity: function() {
            var leechDisplay = parseInt(wkof.settings.db_cockpit.leechDisplay);
            switch (leechDisplay) {
                case 0:
                    return 0.4;
                case 1:
                    return 0.4;
                case 2:
                    return 1.0;
                case 3:
                    return 0.6;
            }
        },
        highlightOpacity: 1.0,
        bgOpacity: 0.3,
        rounded: function() {
            return (wkof.settings.db_cockpit.leechDisplay == '3');
        },
        colorScheme: function() {
            if (wkof.settings.db_cockpit.leechDisplay == '3') {
                return {
                    color: "#000000",
                    bgColor: "#ffffff"
                }
            }
            else {
                return null;
            }
        }
    }
    var appOpacity = 0.7;
    var gurOpacity = 0.9;
    var opacityFactor = 0.85;

    // srs level circle
    var srsLevelColors = {
        bgColor: "#434343",
        darkBgColor: "#232629"
    }
    var levelProgressFont = {
        color: "#9df",
        fontStyle: "bold 12px Arial, sans-serif",
        fontSize: calculateFontSize("bold 12px Arial, sans-serif")
    };
    var dashLength = 8;
    var dashFont = {
        color: "#ddff99",
        lineWidth: 2
    }

    // additionalInfo
    var srsDrawing = [
        {
            srsAbbrev: "App",
            srsName: "Apprentice",
            srsLevel: 1,
            srsLogo: "apprentice",
            color: function() {
                return {
                    start: "#f0a",
                    end: "#dd0093"
                }
            }
        },
        {
            srsAbbrev: "Gur",
            srsName: "Guru",
            srsLevel: 5,
            srsLogo: "guru",
            color: function() {
                return {
                    start: "#aa38c6",
                    end: "#882d9e"
                }
            }
        },
        {
            srsAbbrev: "Mas",
            srsName: "Master",
            srsLevel: 7,
            srsLogo: "master",
            color: function() {
                return {
                    start: "#5571e2",
                    end: "#294ddb"
                }
            }
        },
        {
            srsAbbrev: "Enl",
            srsName: "Enlightened",
            srsLevel: 8,
            srsLogo: "enlightened",
            color: function() {
                return {
                    start: "#0af",
                    end: "#0093dd"
                }
            }
        },
        {
            srsAbbrev: "Bur",
            srsName: "Burned",
            srsLevel: 9,
            srsLogo: "burned",
            color:  function() {
                if (wkof.settings.db_cockpit.goldenBurn) {
                    return {
                        start: "#fbc550",
                        end: "#faac05",
                        progressText: "#777"
                    }
                }
                else {
                    return {
                        start: "#555",
                        end: "#434343"
                    }
                }
            }
        }
    ];

    var srsDetailSrs = [ [
        {
            srsAbbrev: "Appr1",
            color: "#dd0093",
            opacity: appOpacity * opacityFactor * opacityFactor * opacityFactor
        },
        {
            srsAbbrev: "Appr2",
            color: "#dd0093",
            opacity: appOpacity * opacityFactor * opacityFactor
        },
        {
            srsAbbrev: "Appr3",
            color: "#dd0093",
            opacity: appOpacity * opacityFactor
        },
        {
            srsAbbrev: "Appr4",
            color: "#dd0093",
            opacity: appOpacity
        }
    ],
    [
        {
            srsAbbrev: "Guru1",
            color: "#882d9e",
            opacity: gurOpacity * opacityFactor
        },
        {
            srsAbbrev: "Guru2",
            color: "#882d9e",
            opacity: gurOpacity
        }
    ] ];

    // create the main panels
    function createPanels() {
       var cockpitPanel = document.createElement("div");
       cockpitPanel.id="cockpitPanel";

       var dbc_gas = document.createElement("div");
       dbc_gas.id="dbc_gas";
       cockpitPanel.append(dbc_gas);

       var dbc_currentLevel = document.createElement("div");
       dbc_currentLevel.id="dbc_currentLevel";
       cockpitPanel.append(dbc_currentLevel);

       var dbc_core = document.createElement("div");
       dbc_core.id="dbc_core";
       cockpitPanel.append(dbc_core);

       var dbc_bar60 = document.createElement("div");
       dbc_bar60.id="dbc_bar60";
       cockpitPanel.append(dbc_bar60);

       var dbc_cruise = document.createElement("div");
       dbc_cruise.id="dbc_cruise";
       cockpitPanel.append(dbc_cruise);

       var dbc_forecast = document.createElement("div");
       dbc_forecast.id="dbc_forecast";
       cockpitPanel.append(dbc_forecast);

       if ($('#timeline').length) {
           $('#timeline').after(cockpitPanel);
       }
       else {
           $('.dashboard__content').before(cockpitPanel);
       }
    }

    // that turbo frame is obnoxious
    function restyleLessonsButton() {
        // button section update addition styling
        $('.todays-lessons').css("padding", "var(--spacing-tight)");

        $('.todays-lessons__content').css('display', 'inline');
        $('.todays-lessons__content').css("position", "relative");
        $('.todays-lessons__text-content').css("position", "absolute");
        $('.todays-lessons__text-content').css("bottom", "0px");
        $('.todays-lessons__text-content').css("right", "0px");

        $('.todays-lessons__text').detach();
        $('.todays-lessons__subtitle').detach();
        $('.todays-lessons__title-text').detach();

        $('.todays-lessons__image-content').css("margin-bottom", "0px");

        var buttons = $('.todays-lessons__button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style["width"] = "100%";
            var buttonInternal = buttons[i].querySelector('.wk-button');
            buttonInternal.style["padding"] = "var(--spacing-tight)";
        }
    }

    // due to the way the lessons section loads, this must be done later
    // and since we can't tell which is the lesson and which is the review button until AFTER
    // the lesson turboframe loads, we delay both of 'm
    function delayedButtonStyling() {
        var lessonsButton = null;
        var reviewsButton = null;
        var buttonSections = document.querySelectorAll('.dashboard__lessons-and-reviews-section');
        buttonSections.forEach(section => {
            if (containsSection(section, '.todays-lessons')) {
                lessonsButton = section.parentNode.removeChild(section);
            }
            if (containsSection(section, '.reviews-dashboard')) {
                reviewsButton = section.parentNode.removeChild(section);
            }
        });

        $('#dbc_gas').append(lessonsButton);
        $('#dbc_gas .dashboard__lessons-and-reviews-section').css("width", "168px");
        $('#dbc_gas .dashboard__lessons-and-reviews-section').css("float", "right");

        // delay further
        setTimeout(restyleLessonsButton, 1000);
        // and twice for safety
        setTimeout(restyleLessonsButton, 2000);

        var reviewButtonBlock = document.createElement("div");
        reviewButtonBlock.id="reviewButtonBlock";
        $('#dbc_cruise').append(reviewButtonBlock);
        $('#reviewButtonBlock').append(reviewsButton);
        reviewsButton.style["width"] = "168px";

        // button section update addition styling
        $('.reviews-dashboard').css("padding", "var(--spacing-tight)");

        $('.reviews-dashboard__content').css('display', 'inline');
        $('.reviews-dashboard__content').css("position", "relative");
        $('.reviews-dashboard__text-content').css("position", "absolute");
        $('.reviews-dashboard__text-content').css("bottom", "0px");
        $('.reviews-dashboard__text-content').css("right", "0px");

        $('.reviews-dashboard__text').detach();
        $('.reviews-dashboard__title-text').detach();

        $('.reviews-dashboard__image-content').css("margin-bottom", "0px");

        var buttons = $('.reviews-dashboard__button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style["width"] = "100%";
            var buttonInternal = buttons[i].querySelector('.wk-button');
            buttonInternal.style["padding"] = "var(--spacing-tight)";
        }

        // integration with Kumirei's Review Hover Details
        var reviewHoverDetails = $('.dashboard #review_hover_details');
        if (reviewHoverDetails) {
            reviewHoverDetails.detach();
            $('.lessons-and-reviews__reviews-button').after(reviewHoverDetails);
        }
        if (isRSPresent()) {
            var summaryDiv = $('#reviewSummaryDiv').detach();
            $('#dbc_cruise').append(summaryDiv);
            $('#reviewSummaryTile').css("float", "right");
            $('#reviewSummaryTile').css("width", "120px");
            $('#reviewSummaryTile').css("height", "100px");
            $('#reviewSummaryTile #rs_tile_span_header').css("font-size", "14px");
            $('#reviewSummaryTile #rs_tile_span_header').css("top", "6px");
            $('#reviewSummaryTile #rs_tile_span_percentage').css("font-size", "28px");
            $('#reviewSummaryTile #rs_tile_span_percentage').css("top", "16px");
            $('#reviewSummaryTile #rs_tile_icon_percentage').css("top", "-2px");
        }
    }

    // create the panel contents
    function createPanelContents() {
        var speedometer = document.createElement("canvas");
        speedometer.id="speedometer";
        $('#dbc_core').append(speedometer);
        var canvasTooltips = document.createElement("div");
        canvasTooltips.id="canvasTooltips";
        canvasTooltips.className="db_cockpit_tooltips";
        $('#dbc_core').append(canvasTooltips);
        var canvasClicktips = document.createElement("div");
        canvasClicktips.id="canvasClicktips";
        canvasClicktips.className="db_cockpit_tooltips";
        $('#dbc_core').append(canvasClicktips);

        // temporarily relocate the button sections until we can figure out which is which
        var buttonSections = document.querySelectorAll('.dashboard__lessons-and-reviews-section');
        buttonSections.forEach(section => {
            $('#dbc_cruise').append(section.parentNode.removeChild(section));
        });

        // lessons button is now a turbo frame and can load late
        setTimeout(delayedButtonStyling, 1000);

        var extraRecentStudy = document.createElement("div");
        extraRecentStudy.id="extraRecentStudy";
        $('#dbc_currentLevel').append(extraRecentStudy);
        var recentMistakes = $('.wk-panel--recent-mistakes');
        recentMistakes.detach();
        recentMistakes.css("margin-bottom", "10px");
        $('#extraRecentStudy').append(recentMistakes);
        if (moveExtraStudy()) {
            var extraStudy = $('.wk-panel--extra-study');
            extraStudy.detach();
            $('#extraRecentStudy').append(extraStudy);
        }
        var currentLevelProgress = $('.wk-panel--level-progress').detach();
        $('#dbc_currentLevel').append(currentLevelProgress);

        var forecast = $('.wk-panel--review-forecast').detach();
        $('#dbc_forecast').append(forecast);
        forecast.css("margin-bottom", "10px");

        // clean up items that are no longer needed
        // new dashboard update, all are individual sections now. I can't just hide these, because they occupy individual
        // cells in the dashboard content grid. Removing them allows me to remove the grid rows
        $('.dashboard__lessons-and-reviews').detach();
        $('.dashboard__recent-mistakes').detach();
        $('.dashboard__extra-study').detach();
        $('.dashboard__level-progress').detach();
        $('.dashboard__review-forecast').detach();
        // and move the rest up
        $('.dashboard__srs-progress').css("grid-row", "1/2");
        $('.dashboard__item-lists').css("grid-row", "2/3");
        $('.dashboard__community-banner').css("grid-row", "3/4");
        // tricky tricky. New dashboard update puts a section around srs-progress (dashboard__srs-progress), which I ideally
        // want to hide, but other scripts that place around the srs-progress would be hidden as well, so we keep it at this for now
        $('.srs-progress').addClass('hidden');

        $("#speedometer").mouseenter(function(e) { reOffsetCanvas(e); });
        $("#speedometer").mousemove(function(e) { handleCanvasMouseMove(e); });
        $("#speedometer").mouseleave(function(e) {
            // hide all tooltips
            $('.db_cockpit_tooltipText_visible').removeClass('db_cockpit_tooltipText_visible');
        });
        $("#speedometer").click(function(e) { handleCanvasMouseClick(e); });
        $("body").click(hideClickTips);
    }

    function repositionMainPanel() {
        // ultimate timeline does not have a margin at the bottom, so we insert margin top if needed
        if ($('#timeline').length) {
            $("#cockpitPanel").css("margin-top", "10px");
        }
        else {
            $("#cockpitPanel").css("margin-top", "0px");
        }
    }

    // empty the canvas for redrawing
    function clearCanvas() {
        var speedometer = $('#speedometer')[0];
        speedometer.width = getCanvasSize();
        speedometer.height = getCanvasSize();

        var ctx = speedometer.getContext("2d");
        ctx.clearRect(0, 0, getCanvasSize(), getCanvasSize());
        hotspots = [];
        clickHotspots = [];
        highlightHotspots = [];
        currentHighlight = null;
        $('#canvasTooltips div').detach();
        $('#canvasTooltips span').detach();
        $('#canvasClicktips div').detach();
    }

    // creates a linear gradient for an arc shape (between opposing corners)
    function createArcGradient(ctx, centerX, centerY, outsideRadius, insideRadius, startAngle, endAngle, color) {
        if (color.start != undefined) {
            var ctxGradient = ctx.createLinearGradient(
                Math.cos(endAngle) * outsideRadius + centerX,
                Math.sin(endAngle) * outsideRadius + centerY,
                Math.cos(startAngle) * insideRadius + centerX,
                Math.sin(startAngle) * insideRadius + centerY
                );

            ctxGradient.addColorStop(0, color.start);
            ctxGradient.addColorStop(1, color.end);

            return ctxGradient;
        }
        else {
             return color;
        }
    }

    // draws and fill the arc sections
    function drawSRSArc(ctx, centerX, centerY, outsideRadius, insideRadius, startAngle, endAngle, color, opacity) {

        ctx.save();

        ctx.fillStyle = createArcGradient(ctx, centerX, centerY, outsideRadius, insideRadius, startAngle, endAngle, color);
        if (opacity != undefined) {
            ctx.globalAlpha=opacity;
        }

	    ctx.beginPath();
	    ctx.moveTo(centerX,centerY);
	    ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
	    ctx.closePath();

	    ctx.fill();

        ctx.restore();
    }

    function calculateFontSize(font) {
        var fontsize = font.match(/[\d|\.]+\s?px/g);
        if (fontsize != undefined) {
            fontsize = fontsize[0].match(/[\d|\.]+/g);
            if (fontsize != undefined) {
                fontsize = fontsize[0];
            }
        }
        else {
            fontsize = font.match(/[\d|\.]+\s?em/g);
            if (fontsize.length != undefined) {
                fontsize = fontsize[0].match(/[\d|\.]+/g);
                if (fontsize.length != undefined) {
                    // estimate is good enough, we're only shifting by 1/4 of these pixels
                    fontsize = fontsize[0] * 16;
                }
            }
        }
        if (fontsize == undefined) {
            fontsize = 16;
        }

        return fontsize;
    }

    // adds text to the canvas
    function drawCenteredText(ctx, textX, textY, text, textFont, bright) {

        ctx.save();

        ctx.font = textFont.fontStyle;
        if (textFont.lineWidth != undefined) {
            ctx.lineWidth = textFont.lineWidth;
        }

        var metrics = ctx.measureText(text);
        var placeX = textX - metrics.width / 2;
        var fontsize = textFont.fontSize;
        var placeY = textY + fontsize / 4;

        var resultDimensions = {
            minX: placeX - 2,
            minY: placeY - parseInt(fontsize) + 1,
            width: metrics.width + 4,
            height: parseInt(fontsize) + 2
        };

        // background opacity
        if (textFont.bgOpacity != undefined) {
            ctx.globalAlpha = textFont.bgOpacity;
        }
        // draw background for the text if required
        if (textFont.bgColor != undefined) {
            ctx.fillStyle = prioritiseColorSchemeBgColor(textFont);
            if (textFont.rounded()) {
                ctx.beginPath();
                ctx.ellipse(resultDimensions.minX + resultDimensions.width/2, resultDimensions.minY + resultDimensions.height/2, resultDimensions.width * 0.6, resultDimensions.height * 0.6, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
            else {
                ctx.fillRect(resultDimensions.minX, resultDimensions.minY, resultDimensions.width, resultDimensions.height);
            }
        }

        // foreground opacity
        if (textFont.opacity != undefined) {
            if ((bright != undefined) && bright && (textFont.highlightOpacity != undefined)) {
                ctx.globalAlpha = textFont.highlightOpacity;
            }
            else {
                ctx.globalAlpha = textFont.opacity();
            }
        }

        var resolvedColor = textFont.color;
        if (typeof resolvedColor == 'function') {
            resolvedColor = textFont.color();
        }
        if (resolvedColor.start != undefined) {
            var ctxGradient = ctx.createRadialGradient(
                textX,
                textY,
                1,
                textX,
                textY,
                fontsize
            );

            ctxGradient.addColorStop(0, resolvedColor.start);
            ctxGradient.addColorStop(1, resolvedColor.end);

            ctx.fillStyle = ctxGradient;
            ctx.strokeStyle = ctxGradient;
        }
        else {
            ctx.strokeStyle = prioritiseColorSchemeColor(textFont);
            ctx.fillStyle = prioritiseColorSchemeColor(textFont);
        }

        if (textFont.lineWidth != undefined) {
            ctx.strokeText(text, placeX, placeY);
        }
        else {
            ctx.fillText(text, placeX, placeY);
        }

        ctx.restore();

        return resultDimensions;
    }

    function prioritiseColorSchemeColor(font) {
        if (font.colorScheme && font.colorScheme() && font.colorScheme().color) {
            return font.colorScheme().color;
        }
        return font.color;
    }
    function prioritiseColorSchemeBgColor(font) {
        if (font.colorScheme && font.colorScheme() && font.colorScheme().bgColor) {
            return font.colorScheme().bgColor;
        }
        return font.bgColor;
    }

    // adds arrow heads to the canvas
    function drawArrowHead(ctx, radius, angle, color, fontSize) {

        ctx.save();

        // we're going to rotate around the center point
        ctx.translate(canvasCenter.x, canvasCenter.y);
        ctx.rotate(angle);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(radius-fontSize, 0.5*fontSize);
        ctx.lineTo(radius-(2*fontSize/3), 0);
        ctx.lineTo(radius-fontSize, -0.5*fontSize);
        ctx.closePath();

        ctx.fill();

        ctx.restore();
    }

    // adds a line to the canvas
    function drawLine(ctx, startPoint, endPoint, lineFont) {

        ctx.save();

        if (lineFont.lineWidth != undefined) {
            ctx.lineWidth = lineFont.lineWidth;
        }
        ctx.strokeStyle = lineFont.color;

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();

        ctx.restore();
    }

    // keep track of the canvas position on scrolling/resizing
    function reOffsetCanvas(){
        if ($('#speedometer').length) {
            var BB = $('#speedometer')[0].getBoundingClientRect();
            offsetX = BB.left;
            offsetY = BB.top;
            windowOffsetX = $(window).scrollLeft();
            windowOffsetY = $(window).scrollTop();
        }
    }
    var offsetX, offsetY;
    var windowOffsetX, windowOffsetY;
    window.onscroll = function(e) { reOffsetCanvas(); }
    window.onresize = function(e) { reOffsetCanvas(); }

    function handleCanvasMouseMove(e){
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        var mouseX = parseInt(e.clientX - offsetX);
        var mouseY = parseInt(e.clientY - offsetY);

        for(var i = 0; i < hotspots.length; i++) {
            var h = hotspots[i];
            var dx = mouseX - h.x;
            var dy = mouseY - h.y;
            if(dx * dx + dy * dy < h.radius * h.radius) {
                showTooltip(hotspots[i]);
                highlightSpot(currentHighlight, false);
                return;
            }
        }

        // if no hotspot matches, hide all tooltips
        var visibleTT = $('.db_cockpit_tooltipText_visible');
        visibleTT.removeClass('db_cockpit_tooltipText_visible');

        // highlighting only for option 1
        if (wkof.settings.db_cockpit.leechDisplay != '1') { return; }

        // then check for highlights
        for (i = 0; i < highlightHotspots.length; i++) {
            h = highlightHotspots[i];
            if (   (mouseX > h.textBg.minX) && (mouseX < (h.textBg.minX + h.textBg.width))
                && (mouseY > h.textBg.minY) && (mouseY < (h.textBg.minY + h.textBg.height))
               ) {
                highlightSpot(h, true);
                return;
            }
        }

        // if no highlights, then remove any current
        highlightSpot(currentHighlight, false);
    }

    function showTooltip(hotspot) {
        // hide all other tooltips
        var visibleTT = $('.db_cockpit_tooltipText_visible:not(#' + hotspot.id + ')');
        visibleTT.removeClass('db_cockpit_tooltipText_visible');

        // expose current tooltip if it wasn't already
        if (!$('.db_cockpit_tooltipText_visible #' + hotspot.id).length) {
            var spanWidth = $('#' + hotspot.id).width();
            var spanHeight = $('#' + hotspot.id).height();
            var offsetLeft = Math.floor(hotspot.x + offsetX + windowOffsetX - spanWidth * 0.4);
            var offsetTop = Math.floor(hotspot.y + offsetY + windowOffsetY - spanHeight - 30);

            $('#' + hotspot.id).css('left', offsetLeft + 'px');
            $('#' + hotspot.id).css('top', offsetTop + 'px');
            $('#' + hotspot.id).addClass('db_cockpit_tooltipText_visible');
        }
    }

    var hotspots = [];
    function createHotspot(spotX, spotY, spotRadius, spotText) {
        var spotId = "tt" + Math.floor(spotX) + "_" + Math.floor(spotY);
        hotspots.push( { x: spotX, y: spotY, radius: spotRadius, id: spotId } );
        $('#canvasTooltips').append(
            '<span class="db_cockpit_tooltipText" id="' + spotId + '">' + spotText + '</span>'
        );
    }
    function createBreakDownHotspot(spotX, spotY, spotRadius, logo, rTotal, kTotal, vTotal) {
        var spotId = "tt" + Math.floor(spotX) + "_" + Math.floor(spotY);
        hotspots.push( { x: spotX, y: spotY, radius: spotRadius, id: spotId } );
        $('#canvasTooltips').append(
            '<div class="db_cockpit_tooltipBreakdownText" id="' + spotId + '">'
          +   '<div class="srs-logo ' + logo + '"></div>'
          +   '<div class="tt_bd_totals"><ul>'
          +     '<li>rad:<span>' + rTotal + '</span></li>'
          +     '<li>kan:<span>' + kTotal + '</span></li>'
          +     '<li>voc:<span>' + vTotal + '</span></li>'
          +   '</ul></div>'
          + '</div>'
        );
    }

    function handleCanvasMouseClick(e){
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        var mouseX = parseInt(e.clientX - offsetX);
        var mouseY = parseInt(e.clientY - offsetY);

        for(var i = 0; i < clickHotspots.length; i++) {
            var h = clickHotspots[i];
            var dx = mouseX - h.x;
            var dy = mouseY - h.y;
            if(dx * dx + dy * dy < h.radius * h.radius) {
                showClicktip(clickHotspots[i]);
                return;
            }
        }

        // if no clickHotspot matches, hide all clicktips
        var visibleTT = $('.db_cockpit_clicktipText_visible');
        visibleTT.removeClass('db_cockpit_clicktipText_visible');

        // temp addition to test level up animation
//        dx = mouseX - canvasCenter.x;
//        dy = mouseY - canvasCenter.y;
//        if (dx * dx + dy * dy < 6400) {
//            levelUpAnimation(11, 12);
//        }
    }

    function hideClickTips(e){
        // hide all click tips
        var visibleTT = $('.db_cockpit_clicktipText_visible');
        visibleTT.removeClass('db_cockpit_clicktipText_visible');
    }

    function showClicktip(hotspot) {
        // hide all other clicktips
        var visibleTT = $('.db_cockpit_clicktipText_visible:not(#' + hotspot.id + ')');
        visibleTT.removeClass('db_cockpit_clicktipText_visible');

        // expose current clicktip if it wasn't already
        if (!$('.db_cockpit_clicktipText_visible #' + hotspot.id).length) {
            var spanWidth = $('#' + hotspot.id).width();
            var spanHeight = $('#' + hotspot.id).height();
            var offsetLeft = Math.floor(hotspot.x + offsetX + windowOffsetX - spanWidth * 0.4);
            var offsetTop = Math.floor(hotspot.y + offsetY + windowOffsetY - spanHeight - 30);

            $('#' + hotspot.id).css('left', offsetLeft + 'px');
            $('#' + hotspot.id).css('top', offsetTop + 'px');
            $('#' + hotspot.id).addClass('db_cockpit_clicktipText_visible');
        }
    }

    function scrollDialLevel(e, currentSpotId, toLevel) {

        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        // get current spot
        var currentDialDiv = $('#' + currentSpotId);
        // get next dial div and position
        var nextDialDiv = $('#' + createDialDivId(toLevel));
        nextDialDiv.css('left', currentDialDiv.css('left'));
        nextDialDiv.css('top', currentDialDiv.css('top'));

        // swap visibility
        currentDialDiv.removeClass('db_cockpit_clicktipText_visible');
        nextDialDiv.addClass('db_cockpit_clicktipText_visible');
    }

    function hideZero(value) {
        if (value == 0) {
            return "&nbsp;";
        }
        else {
            return value;
        }
    }

    var clickHotspots = [];
    function addDialHotspot(spotX, spotY, spotRadius, levelData) {
        var spotId = createDialDivId(levelData.level);
        clickHotspots.push( { x: spotX, y: spotY, radius: spotRadius, id: spotId } );
    }

    function createDialDiv(levelData, dialDiv) {
        var spotId = createDialDivId(levelData.level);

        var dialDivElem =
            '<div class="db_cockpit_tooltipDialText" id="' + spotId + '">'
          +   '<table><tr>'
          +     '<td class="db_cockpit_ctd_summary" colspan="2" style="width:100px">level</td>'
          +     '<td style="width:20px">&nbsp;</td><td class="db_cockpit_ctd_header">passed</td>'
          +     '<td class="db_cockpit_ctd_header">rad</td><td class="db_cockpit_ctd_header">kan</td><td class="db_cockpit_ctd_header">voc</td>'
          +     '</tr><tr>'
          +     '<td class="db_cockpit_ctd_level db_cockpit_ctd_summary" colspan="2" rowspan="3">'
          +     '<span class="db_cockpit_ctd_link" id="db_cockpit_' + levelData.level + '_previousLink">&nbsp;</span> '
          +      levelData.level
          +      ' <span class="db_cockpit_ctd_link" id="db_cockpit_' + levelData.level + '_nextLink">&nbsp;</span></td>'
          +     '<td class="db_cockpit_ctd_category" style="width:20px">-</td><td>&nbsp;</td>'
          +     '<td>' + hideZero(levelData.unstarted.radical) + '</td><td>' + hideZero(levelData.unstarted.kanji) + '</td><td>' + hideZero(levelData.unstarted.vocabulary) + '</td>'
          +     '</tr><tr>'
          +     '<td class="db_cockpit_ctd_category" style="width:20px">A</td><td>' + levelData.App.passed + '%</td>'
          +     '<td>' + hideZero(levelData.App.radical) + '</td><td>' + hideZero(levelData.App.kanji) + '</td><td>' + hideZero(levelData.App.vocabulary) + '</td>'
          +     '</tr><tr>'
          +     '<td class="db_cockpit_ctd_category" style="width:20px">G</td><td>' + levelData.Gur.passed + '%</td>'
          +     '<td>' + hideZero(levelData.Gur.radical) + '</td><td>' + hideZero(levelData.Gur.kanji) + '</td><td>' + hideZero(levelData.Gur.vocabulary) + '</td>'
          +     '</tr><tr>'
          +     '<td class="db_cockpit_ctd_summary" colspan="2">progress</td>'
          +     '<td class="db_cockpit_ctd_category" style="width:20px">M</td><td>' + levelData.Mas.passed + '%</td>'
          +     '<td>' + hideZero(levelData.Mas.radical) + '</td><td>' + hideZero(levelData.Mas.kanji) + '</td><td>' + hideZero(levelData.Mas.vocabulary) + '</td>'
          +     '</tr><tr>'
          +     '<td class="db_cockpit_ctd_score db_cockpit_ctd_summary" colspan="2" rowspan="2">' + levelData.score + '%</td>'
          +     '<td class="db_cockpit_ctd_category" style="width:20px">E</td><td>' + levelData.Enl.passed + '%</td>'
          +     '<td>' + hideZero(levelData.Enl.radical) + '</td><td>' + hideZero(levelData.Enl.kanji) + '</td><td>' + hideZero(levelData.Enl.vocabulary) + '</td>'
          +     '</tr><tr>'
          +     '<td class="db_cockpit_ctd_category" style="width:20px">B</td><td>' + levelData.Bur.passed + '%</td>'
          +     '<td>' + hideZero(levelData.Bur.radical) + '</td><td>' + hideZero(levelData.Bur.kanji) + '</td><td>' + hideZero(levelData.Bur.vocabulary) + '</td>'
          +   '</tr></table>'
          + '</div>';

        $('#canvasClicktips').append(dialDivElem);

        if (dialDiv.previousLevel) {
            $('#db_cockpit_' + levelData.level + '_previousLink').click(function(e) { scrollDialLevel(e, spotId, dialDiv.previousLevel); });
            $('#db_cockpit_' + levelData.level + '_previousLink').addClass("db_cockpit_ctd_clickable");
            $('#db_cockpit_' + levelData.level + '_previousLink').html("&lt;");
        }
        if (dialDiv.nextLevel) {
            $('#db_cockpit_' + levelData.level + '_nextLink').click(function(e) { scrollDialLevel(e, spotId, dialDiv.nextLevel); });
            $('#db_cockpit_' + levelData.level + '_nextLink').addClass("db_cockpit_ctd_clickable");
            $('#db_cockpit_' + levelData.level + '_nextLink').html("&gt;");
        }
    }

    var highlightHotspots = [];
    var currentHighlight;
    function createHighlightHotspot(centerX, centerY, outsideRadius, insideRadius, startAngle, endAngle, color, opacity,
                                    minX, minY, width, height, textX, textY, text, font) {
        var spotId = "hl" + Math.floor(minX) + "_" + Math.floor(minY);
        highlightHotspots.push({ id: spotId,
                                 arc: { centerX: centerX, centerY: centerY, outsideRadius: outsideRadius, insideRadius: insideRadius,
                                        startAngle: startAngle, endAngle: endAngle, color: color, opacity: opacity },
                                 textBg: { minX: minX, minY: minY, width: width, height: height },
                                 text: { textX: textX, textY: textY, text: text, font: font }
                               });
    }

    function highlightSpot(highlightHotspot, bright) {
        if (bright && (currentHighlight != undefined)) {
            if (currentHighlight.id == highlightHotspot.id) {
                // done
                return;
            }
            highlightSpot(currentHighlight, false);
        }
        if (!bright && (currentHighlight == undefined)) {
            // also done
            return;
        }

        drawHighlightSpot(highlightHotspot, bright);
        if (bright) {
            currentHighlight = highlightHotspot;
        }
        else {
            currentHighlight = null;
        }
    }

    function drawHighlightSpot(spot, bright) {
        var ctx = $('#speedometer')[0].getContext("2d");

        ctx.save();
        // clear the area
        ctx.clearRect(spot.textBg.minX, spot.textBg.minY, spot.textBg.width, spot.textBg.height);
        // and redraw the background arc
        if (spot.arc.opacity != undefined) {
            ctx.globalAlpha = spot.arc.opacity;
        }
        ctx.fillStyle = createArcGradient(ctx, spot.arc.centerX, spot.arc.centerY, spot.arc.outsideRadius, spot.arc.insideRadius, spot.arc.startAngle, spot.arc.endAngle, spot.arc.color);
        ctx.fillRect(spot.textBg.minX, spot.textBg.minY, spot.textBg.width, spot.textBg.height);
        ctx.restore();

        // then redraw the text, highlighted or not
        drawCenteredText(ctx, spot.text.textX, spot.text.textY, spot.text.text, spot.text.font, bright);
    }

    // main srs progress blocks
    var levelUp = false;
    var oldLevel;
    function drawSRSProgress(itemBreakdown) {
        var ctx = $('#speedometer')[0].getContext("2d");
        var countsBySRS = itemBreakdown.countBySRS.bySRSArray;

        var totalCount = 0;
        var radicalCount = 0;
        var kanjiCount = 0;
        var vocabularyCount = 0;
        var sumFunction = function(countItem) {
            totalCount += countItem.total;
            radicalCount += countItem.radical;
            kanjiCount += countItem.kanji;
            vocabularyCount += countItem.vocabulary;
        };

        var barStartAngle = srsStartAngle[parseInt(wkof.settings.db_cockpit.srsOrientation)];
        for(var srsLvl in srsDrawing) {
            drawSRSArc(ctx, canvasCenter.x, canvasCenter.y, srsOutsideRadius, srsInsideRadius,
                       ((barStartAngle + parseInt(srsLvl))) * arcWidth, ((barStartAngle + parseInt(srsLvl) + 1)) * arcWidth, srsDrawing[srsLvl].color());

            var relatedCounts = filterBySRSCountOnAbbrev(countsBySRS, srsDrawing[srsLvl].srsAbbrev);
            totalCount = 0;
            radicalCount = 0;
            kanjiCount = 0;
            vocabularyCount = 0;
            relatedCounts.forEach(sumFunction);

            var textX = Math.cos((barStartAngle + parseInt(srsLvl) + 0.5) * arcWidth) * srsTextRadius + canvasCenter.x;
            var textY = Math.sin((barStartAngle + parseInt(srsLvl) + 0.5) * arcWidth) * srsTextRadius + canvasCenter.y;
            drawCenteredText(ctx, textX, textY, totalCount, srsFont);
            createBreakDownHotspot(textX, textY, srsFont.fontSize, srsDrawing[srsLvl].srsLogo, radicalCount, kanjiCount, vocabularyCount);
        }

        if (levelUp) {
            // previous level was drawn earlier, draw it again in its previous form and prepare level up animation
            drawCenteredText(ctx, canvasCenter.x, canvasCenter.y, oldLevel, levelFont);
            setTimeout("window.db_cockpit_levelUpAnimation(" + oldLevel + ", " + itemBreakdown.level + ")", 100);
            // don't recelebrate upon redraw. Note that we do 'celebrate' upon a reset as well - but the animation isn't too festive,
            // so it can be considered an update instead of a celebration.
            levelUp = false;
        }
        else {
            var newLevel = $('li.user-summary__attribute a')[0].href.split('/level/')[1];
            if (newLevel != itemBreakdown.level) {
                // we just leveled OR just reset and are drawing the old level from the cache
                levelUp = true;
                oldLevel = itemBreakdown.level;
            }
            // draw the user level in the center
            drawCenteredText(ctx, canvasCenter.x, canvasCenter.y, itemBreakdown.level, levelFont);
        }
    }

    var FRAME_DURATION = 80;
    function levelUpAnimation(oldLevel, newLevel) {
        var ctx = $('#speedometer')[0].getContext("2d");
        ctx.font = levelFont.fontStyle;
        ctx.lineWidth = levelFont.lineWidth;
        var metrics = ctx.measureText(oldLevel);
        var rectWidth = metrics.width;
        metrics = ctx.measureText(newLevel);
        if (metrics.width > rectWidth) {
            rectWidth = metrics.width;
        }
        var levelFontSize = levelFont.fontSize;
        var offsetTop = levelFontSize * 3 / 4;
        var clearRectangle = "{ fromX: " + ((canvasCenter.x - rectWidth / 2 - 1)) +
                             ", fromY: " + ((canvasCenter.y - offsetTop - 1)) +
                             ", width: " + ((rectWidth + 2)) +
                             ", height: " + ((parseInt(levelFontSize) + 5)) + " }";

        var frame = 1;
        for (var tempSize = levelFontSize; tempSize > 0; tempSize -= 10) {
            setTimeout("window.db_cockpit_levelUpAnimationFrame(" + clearRectangle + ", " + tempSize + ", " + oldLevel + ", " + frame + ")", frame * FRAME_DURATION);
            frame++;
        }

        for (tempSize = levelFontSize % 10; tempSize <= levelFontSize; tempSize += 10) {
            setTimeout("window.db_cockpit_levelUpAnimationFrame(" + clearRectangle + ", " + tempSize + ", " + newLevel + ", " + frame + ")", frame * FRAME_DURATION);
            frame++;
        }
    }
    window.db_cockpit_levelUpAnimation = levelUpAnimation;

    function levelUpAnimationFrame(rectangle, fontSize, text, frame) {
        var ctx = $('#speedometer')[0].getContext("2d");
        ctx.clearRect(rectangle.fromX, rectangle.fromY, rectangle.width, rectangle.height);
        var tempFont = { color: levelFont.color, opacity: levelFont.opacity, lineWidth: levelFont.lineWidth,
                         fontStyle: levelFont.fontStyle.replace(/[\d|\.]+\s?px/g, fontSize + "px"),
                         fontSize: fontSize }
        drawCenteredText(ctx, canvasCenter.x, canvasCenter.y, text, tempFont);
    }
    window.db_cockpit_levelUpAnimationFrame = levelUpAnimationFrame;

     // srs detail progress, dependent on setting
    function drawSRSProgressDetail(itemBreakdown) {
        var ctx = $('#speedometer')[0].getContext("2d");
        var countsBySRS = itemBreakdown.countBySRS.bySRSArray;

        if (wkof.settings.db_cockpit.showSrsDetail) {
            var barStartAngle = srsStartAngle[parseInt(wkof.settings.db_cockpit.srsOrientation)];
            for (var srsIndex in srsDetailSrs) {
                for(var srsLvl in srsDetailSrs[srsIndex]) {
                    drawSRSArc(ctx, canvasCenter.x, canvasCenter.y, srsOutsideDetailRadius , srsInsideDetailRadius,
                               (barStartAngle + parseInt(srsIndex) + parseInt(srsLvl) * 0.25 * (parseInt(srsIndex) + 1)) * arcWidth,
                               (barStartAngle + parseInt(srsIndex) + (parseInt(srsLvl) + 1) * 0.25 * (parseInt(srsIndex) + 1)) * arcWidth,
                               srsDetailSrs[srsIndex][srsLvl].color, srsDetailSrs[srsIndex][srsLvl].opacity);

                    var relatedCounts = filterBySRSCountOnAbbrev(countsBySRS, srsDetailSrs[srsIndex][srsLvl].srsAbbrev);
                    var textX = Math.cos((barStartAngle + parseInt(srsIndex) + (2 * parseInt(srsLvl) + 1) * 0.125 * (parseInt(srsIndex) + 1)) * arcWidth) * srsDetailTextRadius + canvasCenter.x;
                    var textY = Math.sin((barStartAngle + parseInt(srsIndex) + (2 * parseInt(srsLvl) + 1) * 0.125 * (parseInt(srsIndex) + 1)) * arcWidth) * srsDetailTextRadius + canvasCenter.y;
                    drawCenteredText(ctx, textX, textY, relatedCounts[0].total, helperFont);
                }
            }
        }
    }

    function drawSRSProgressLeechCounts(itemBreakdown) {
        if (!wkof.settings.db_cockpit.showLeechCount) {
            return;
        }

        var ctx = $('#speedometer')[0].getContext("2d");
        var countsBySRS = itemBreakdown.countBySRS.bySRSArray;

        var leechCount = 0;
        var sumFunction = function(countItem) {
            leechCount += countItem.leech;
        };

        var barStartAngle = srsStartAngle[parseInt(wkof.settings.db_cockpit.srsOrientation)];
        for(var srsLvl in srsDrawing) {
            if (srsDrawing[srsLvl].srsAbbrev == 'Bur') { continue; }
            var relatedCounts = filterBySRSCountOnAbbrev(countsBySRS, srsDrawing[srsLvl].srsAbbrev);
            leechCount = 0;
            relatedCounts.forEach(sumFunction);

            var textRadius = (3 * srsOutsideRadius + srsInsideRadius) / 4;
            var textX = Math.cos((barStartAngle + parseInt(srsLvl) + 0.875) * arcWidth) * textRadius + canvasCenter.x;
            var textY = Math.sin((barStartAngle + parseInt(srsLvl) + 0.875) * arcWidth) * textRadius + canvasCenter.y;
            var resultDimensions = drawCenteredText(ctx, textX, textY, leechCount, leechFont);

            createHighlightHotspot(canvasCenter.x, canvasCenter.y, srsOutsideRadius, srsInsideRadius,
                                   ((barStartAngle + parseInt(srsLvl))) * arcWidth, ((barStartAngle + parseInt(srsLvl) + 1)) * arcWidth, srsDrawing[srsLvl].color(), null,
                                   resultDimensions.minX, resultDimensions.minY, resultDimensions.width, resultDimensions.height,
                                   textX, textY, leechCount, leechFont);
        }

        // then draw it for the details if visible and only if non-zero
        if (wkof.settings.db_cockpit.showSrsDetail) {
            for (var srsIndex in srsDetailSrs) {
                var stage = parseInt(srsIndex);
                for(srsLvl in srsDetailSrs[srsIndex]) {
                    relatedCounts = filterBySRSCountOnAbbrev(countsBySRS, srsDetailSrs[srsIndex][srsLvl].srsAbbrev);
                    if (relatedCounts[0].leech == 0) { continue; }

                    textRadius = ((2 - stage) * srsOutsideDetailRadius + srsInsideDetailRadius) / (3 - stage);
                    textX = Math.cos((barStartAngle + stage + (parseInt(srsLvl) + 1) * 0.25 * (stage + 1) - ((stage + 1)/20)) * arcWidth) * textRadius + canvasCenter.x;
                    textY = Math.sin((barStartAngle + stage + (parseInt(srsLvl) + 1) * 0.25 * (stage + 1) - ((stage + 1)/20)) * arcWidth) * textRadius + canvasCenter.y;
                    resultDimensions = drawCenteredText(ctx, textX, textY, relatedCounts[0].leech, leechFont);

                    createHighlightHotspot(canvasCenter.x, canvasCenter.y, srsOutsideDetailRadius, srsInsideDetailRadius,
                                           (barStartAngle + parseInt(srsIndex) + parseInt(srsLvl) * 0.25 * (parseInt(srsIndex) + 1)) * arcWidth,
                                           (barStartAngle + parseInt(srsIndex) + (parseInt(srsLvl) + 1) * 0.25 * (parseInt(srsIndex) + 1)) * arcWidth,
                                           srsDetailSrs[srsIndex][srsLvl].color, srsDetailSrs[srsIndex][srsLvl].opacity,
                                           resultDimensions.minX, resultDimensions.minY, resultDimensions.width, resultDimensions.height,
                                           textX, textY, relatedCounts[0].leech, leechFont);
                }
            }
        }
    }

    // level by SRS
    function drawSRSProgressLevel(itemBreakdown) {
        var showSrsLevelBar = parseInt(wkof.settings.db_cockpit.showSrsLevelBar);
        switch (showSrsLevelBar) {
            case 0:
                // no display
                break;
            case 1:
                // level indications per SRS stage
                drawSRSProgressLevelBySrs(itemBreakdown);
                break;
            case 2:
                // level arrowheads
                drawSRSProgressLevelDials(itemBreakdown);
                break;
        }
    }

    function drawSRSProgressLevelBySrs(itemBreakdown) {
        var ctx = $('#speedometer')[0].getContext("2d");
        var barStartAngle = srsStartAngle[parseInt(wkof.settings.db_cockpit.srsOrientation)];

        // level indications per SRS stage
        drawSRSArc(ctx, canvasCenter.x, canvasCenter.y, srsOutsideLevelRadius , srsInsideLevelRadius,
                   barStartAngle * arcWidth, (barStartAngle - 1) * arcWidth, srsLevelColors.bgColor);

        var lvlIndex = 1;
        var totalCount = 0;
        var sumFunction = function(countItem) { totalCount += countItem.total; };
        var fractionFinished = wkof.settings.db_cockpit.srsLevelThreshold/100;

        for(var srsIndex = srsDrawing.length - 1; srsIndex >= 0; srsIndex--) {
            var srsLevel = srsDrawing[srsIndex];

            FIND_LEVEL_LOOP: while(true) {

                var textX = Math.cos((barStartAngle + parseInt(srsIndex) + 0.5) * arcWidth) * srsLevelTextRadius + canvasCenter.x;
                var textY = Math.sin((barStartAngle + parseInt(srsIndex) + 0.5) * arcWidth) * srsLevelTextRadius + canvasCenter.y;
                if (!itemBreakdown.countByLevel[lvlIndex]) {
                    // we've run out of levels, paint the last one and be done
                    drawCenteredText(ctx, textX, textY, "L"+(lvlIndex-1), helperFont);
                    createHotspot(textX, textY, helperFont.fontSize, '0% to level ' + lvlIndex);
                    break FIND_LEVEL_LOOP;
                }

                // select all elements of the countbySRS for the current level that have passed the current srs stage (note: bySRSArray is off by 1 due to locked count)
                var relatedCounts = itemBreakdown.countByLevel[lvlIndex].bySRSArray.slice(srsLevel.srsLevel+1, itemBreakdown.countByLevel[lvlIndex].bySRSArray.length);
                totalCount = 0;
                relatedCounts.forEach(sumFunction);

                if (totalCount / itemBreakdown.countByLevel[lvlIndex].total >= fractionFinished) {
                    // go up a level
                    lvlIndex++;
                }
                else {
                    // previous level was our max
                    drawCenteredText(ctx, textX, textY, "L"+(lvlIndex-1), helperFont);
                    var tooltip = Math.floor(100*totalCount/itemBreakdown.countByLevel[lvlIndex].total) + '% to level ' + lvlIndex + ' (' + totalCount + ' of ' + itemBreakdown.countByLevel[lvlIndex].total + ')';
                    createHotspot(textX, textY, helperFont.fontSize, tooltip);
                    break FIND_LEVEL_LOOP;
                }
            }
        }
    }

    function getLevelCounts(remainingItems) {
        var levelCounts = { passed: 0, total: 0, radical: 0, kanji: 0, vocabulary: 0 };
        levelCounts.passed = remainingItems;
        return levelCounts;
    }

    function createDialDivId(level) {
        return "ct_dial" + level;
    }

    function drawSRSProgressLevelDials(itemBreakdown) {
        var ctx = $('#speedometer')[0].getContext("2d");
        var barStartAngle = srsStartAngle[parseInt(wkof.settings.db_cockpit.srsOrientation)];

        // level arrowheads
        drawSRSArc(ctx, canvasCenter.x, canvasCenter.y, srsOutsideLevelRadius , srsInsideLevelRadius,
                   barStartAngle * arcWidth, (barStartAngle - 1.5) * arcWidth, srsLevelColors.bgColor);

        if (wkof.settings.db_cockpit.showLevelGridLines) {
            // draw target dashes
            for(var srsLvl in srsDrawing) {
                var dashAngle = (barStartAngle + parseInt(srsLvl) + 0.5) * arcWidth;
                var startX = Math.cos(dashAngle) * (srsInsideRadius - dashLength*3/4) + canvasCenter.x;
                var startY = Math.sin(dashAngle) * (srsInsideRadius - dashLength*3/4) + canvasCenter.y;
                var endX = Math.cos(dashAngle) * (srsInsideRadius + dashLength/4) + canvasCenter.x;
                var endY = Math.sin(dashAngle) * (srsInsideRadius + dashLength/4) + canvasCenter.y;

                drawLine(ctx, { x: startX, y: startY }, { x: endX, y: endY }, dashFont);
            }
        }

        var previousDialScores = [];
        // get the minimum dial separation from the settings, but enforce 0-10% range
        var minimumSeparation = Math.min(3.6, Math.max(0, wkof.settings.db_cockpit.srsLevelSeparation * 0.36));

        var levelCounts = getLevelCounts(0);
        var levelFunction = function(countItem) {
            levelCounts.total += countItem.total;
            levelCounts.radical += countItem.radical;
            levelCounts.kanji += countItem.kanji;
            levelCounts.vocabulary += countItem.vocabulary;
        }
        var totalCount = 0;
        var totalFunction = function(countItem) { totalCount += countItem.total; };

        // first create a list of divs and cross link them (previous - next)
        var dialDivs = {};
        var previousLevel = null;
        for(var lvl = 1; lvl < itemBreakdown.countByLevel.length; lvl++) {

            // check if the level requires a dial div
            var averageScore = itemBreakdown.countByLevel[lvl].progressScore / itemBreakdown.countByLevel[lvl].total;
            if ((averageScore == 0) || (averageScore == 36)) {
                // don't paint unstarted or completely burnt
                continue;
            }

            dialDivs[lvl] = {
                previousLevel: previousLevel,
                nextLevel: null
            };
            if (dialDivs[previousLevel]) {
                dialDivs[previousLevel].nextLevel = lvl;
            }
            previousLevel = lvl;
        }

        LEVEL_LOOP: for(lvl = 1; lvl < itemBreakdown.countByLevel.length; lvl++) {

            // check if the level requires a dial
            averageScore = itemBreakdown.countByLevel[lvl].progressScore / itemBreakdown.countByLevel[lvl].total;
            if ((averageScore == 0) || (averageScore == 36)) {
                // don't paint unstarted or completely burnt
                continue LEVEL_LOOP;
            }

            // create the dial div
            var levelData = {
                level: lvl,
                score: (100*averageScore/36).toFixed(1)
            };
            var relatedCounts = itemBreakdown.countByLevel[lvl].bySRSArray.slice(0,2);
            relatedCounts.forEach(levelFunction);
            var nextSrsCount = getLevelCounts(levelCounts.passed - levelCounts.total);
            levelData.unstarted = levelCounts;
            levelCounts = nextSrsCount;
            for(srsLvl in srsDrawing) {
                relatedCounts = filterBySRSCountOnAbbrev(itemBreakdown.countByLevel[lvl].bySRSArray, srsDrawing[srsLvl].srsAbbrev);
                relatedCounts.forEach(levelFunction);
                nextSrsCount = getLevelCounts(levelCounts.passed - levelCounts.total);
                levelCounts.passed = (100 * (levelCounts.passed + itemBreakdown.countByLevel[lvl].total) / itemBreakdown.countByLevel[lvl].total).toFixed(0);
                levelData[srsDrawing[srsLvl].srsAbbrev] = levelCounts;
                levelCounts = nextSrsCount;
            }
            // init for next level loop
            levelCounts = getLevelCounts(0);

            createDialDiv(levelData, dialDivs[lvl]);

            // check if this info needs a dial
            for (var previousDialScore in previousDialScores) {
                if (Math.abs(previousDialScores[previousDialScore] - averageScore) < minimumSeparation) {
                    // don't paint if too close to previous dials
                    continue LEVEL_LOOP;
                }
            }
            previousDialScores.push(averageScore);

            // calculate angle at which to draw
            var angle = arcWidth * (0.125 * averageScore + barStartAngle);
            var lvlTextX = Math.cos(angle) * levelProgressTextRadius + canvasCenter.x;
            var lvlTextY = Math.sin(angle) * levelProgressTextRadius + canvasCenter.y;

            // draw the dial and add the hover and click hotspots
            drawCenteredText(ctx, lvlTextX, lvlTextY, lvl, levelProgressFont);
            drawArrowHead(ctx, srsInsideRadius, angle, levelProgressFont.color, levelProgressFont.fontSize);
            createHotspot(lvlTextX, lvlTextY, levelProgressFont.fontSize, "L" + lvl + " progress " + (100*averageScore/36).toFixed(1) + "%");
            addDialHotspot(lvlTextX, lvlTextY, levelProgressFont.fontSize, levelData);
        }
    }

    function createLockedCountDiv() {
        if (!$('#lockedCount').length) {
            var lockedCount = document.createElement("div");
            lockedCount.id="lockedCount";
            lockedCount.className="db_cockpit_locked";
            $('#dbc_gas').append(lockedCount);
            $('#lockedCount').append(
                '<span id="lockedCountSpan"></span>'
              + '<span class="title">Locked</span>'
              + '<div class="db_cockpit_tooltipBreakdownText" style="top:60px">'
              +   '<div class="srs-logo apprentice"></div>'
              +   '<div class="tt_bd_totals"><ul>'
              +     '<li>rad:<span>0</span></li>'
              +     '<li>kan:<span>0</span></li>'
              +     '<li>voc:<span>0</span></li>'
              +   '</ul></div>'
              + '</div>'
            );
        }
        if (!$('#fuelgauge').length) {
            var fuelgaugeDiv = document.createElement("div");
            fuelgaugeDiv.id = "fuelgaugeDiv";
            fuelgaugeDiv.className = "db_cockpit_fuelgauge";
            $('#dbc_gas').append(fuelgaugeDiv);

            var fuelgauge = document.createElement("canvas");
            fuelgauge.id="fuelgauge";
            fuelgauge.width = 120;
            fuelgauge.height = 100;
            $('#fuelgaugeDiv').append(fuelgauge);
            $('#fuelgaugeDiv').append(
            '<div class="db_cockpit_tooltipText">'
          +   '<table><tr>'
          +     '<td style="width:80px">radicals</td><td style="align:right;">0</td>'
          +     '</tr><tr>'
          +     '<td style="width:80px">kanji</td><td>0</td>'
          +     '</tr><tr>'
          +     '<td style="width:80px">vocabulary</td><td>0</td>'
          +     '</tr>'
          +   '<table>'
          + '</div>'
        );

        }
    }

    function createLockedCount(itemBreakdown) {
        createLockedCountDiv();
        var showSrsLocked = parseInt(wkof.settings.db_cockpit.showSrsLocked);
        switch (showSrsLocked) {
            case 1:
                $('#lockedCountSpan').html(lockedCount.total);
                $('#lockedCount .tt_bd_totals li:first-child span').html(lockedCount.radical);
                $('#lockedCount .tt_bd_totals li:nth-child(2) span').html(lockedCount.kanji);
                $('#lockedCount .tt_bd_totals li:last-child span').html(lockedCount.vocabulary);
                break;
            default: // case 2:
                drawFuelGauge(itemBreakdown);
                $('#fuelgaugeDiv table tr:first-child td:last-child').html(lockedCount.radical);
                $('#fuelgaugeDiv table tr:nth-child(2) td:last-child').html(lockedCount.kanji);
                $('#fuelgaugeDiv table tr:last-child td:last-child').html(lockedCount.vocabulary);
                break;
        }
    }

    var FUELGAUGE_SIZE = { width: 120, height: 100 };
    var FUELGAUGE_DIAL = {
        x: FUELGAUGE_SIZE.width/2 - 5,
        y: FUELGAUGE_SIZE.height/2 + 1,
        radius: FUELGAUGE_SIZE.height/2 - 10,
        centerRadius: 5,
        angleFull: 10 * Math.PI / 6,
        angleEmpty: 13 * Math.PI / 6
    };
    var FUELGAUGE_ICON = {
        x: 34,
        y: 22,
        size: 16
    };
    var FUELGAUGE_NR = {
        x: 51,
        y: 74,
        font: {
            color: '#ffffff',
            fontStyle: "bold 20px Arial, sans-serif",
            fontSize: calculateFontSize("bold 20px Arial, sans-serif")
        }
    }

    function drawFuelGauge(itemBreakdown) {
        emptyFuelGauge();
        var ctx = $('#fuelgauge')[0].getContext("2d");
        ctx.save();

        // dial for locked items
        var totalItems = lockedCount.total + itemBreakdown.countBySRS.total - filterBySRSCountOnAbbrev(itemBreakdown.countBySRS.bySRSArray, "Loc")[0].total;
        var dialAngle = FUELGAUGE_DIAL.angleEmpty - (Math.abs(FUELGAUGE_DIAL.angleFull - FUELGAUGE_DIAL.angleEmpty) * lockedCount.total / totalItems);
        var dialLeftLocation = {
            x: Math.cos(dialAngle - Math.PI/180) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.x,
            y: Math.sin(dialAngle - Math.PI/180) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.y
        };
        var dialRightLocation = {
            x: Math.cos(dialAngle + Math.PI/180) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.x,
            y: Math.sin(dialAngle + Math.PI/180) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.y
        };
        var leftAttach = {
            x: Math.cos(dialAngle - Math.PI / 2) * FUELGAUGE_DIAL.centerRadius + FUELGAUGE_DIAL.x,
            y: Math.sin(dialAngle - Math.PI / 2) * FUELGAUGE_DIAL.centerRadius + FUELGAUGE_DIAL.y
        };
        var rightAttach = {
            x: Math.cos(dialAngle + Math.PI / 2) * FUELGAUGE_DIAL.centerRadius + FUELGAUGE_DIAL.x,
            y: Math.sin(dialAngle + Math.PI / 2) * FUELGAUGE_DIAL.centerRadius + FUELGAUGE_DIAL.y
        };

        var ctxGradient = ctx.createRadialGradient(
            FUELGAUGE_DIAL.x,
            FUELGAUGE_DIAL.y,
            5,
            FUELGAUGE_DIAL.x,
            FUELGAUGE_DIAL.y,
            FUELGAUGE_DIAL.radius - 5
        );

        ctxGradient.addColorStop(0, "#882d9e");
        ctxGradient.addColorStop(1, "#aa38c6");

        ctx.fillStyle = ctxGradient;
        ctx.beginPath();
        ctx.moveTo(leftAttach.x, leftAttach.y);
        ctx.lineTo(dialLeftLocation.x, dialLeftLocation.y);
        ctx.lineTo(dialRightLocation.x, dialRightLocation.y);
        ctx.lineTo(rightAttach.x, rightAttach.y);
        ctx.closePath();
        ctx.fill();

        // dial center to cover the nasty end of the dial
        var centerGradient = ctx.createRadialGradient(
            FUELGAUGE_DIAL.x - 2,
            FUELGAUGE_DIAL.y - 2,
            0,
            FUELGAUGE_DIAL.x - 2,
            FUELGAUGE_DIAL.y - 2,
            FUELGAUGE_DIAL.centerRadius + 3
        );

        centerGradient.addColorStop(0, "#999999");
        centerGradient.addColorStop(1, "#666666");

        ctx.fillStyle = centerGradient;
	    ctx.beginPath();
	    ctx.arc(FUELGAUGE_DIAL.x, FUELGAUGE_DIAL.y, FUELGAUGE_DIAL.centerRadius, 0, 2 * Math.PI);
	    ctx.fill();

        ctx.restore();

        // add the locked count
        drawCenteredText(ctx, FUELGAUGE_NR.x, FUELGAUGE_NR.y, lockedCount.total, FUELGAUGE_NR.font);
    }

    function emptyFuelGauge() {
        var ctx = $('#fuelgauge')[0].getContext("2d");
        ctx.clearRect(0, 0, FUELGAUGE_SIZE.width, FUELGAUGE_SIZE.height);
        ctx.save();

        // background
        ctx.fillStyle = '#bbbbbb';
	    ctx.beginPath();
	    ctx.arc(FUELGAUGE_SIZE.width/2, FUELGAUGE_SIZE.height/2, FUELGAUGE_SIZE.height/2 - 2, 0, 2 * Math.PI);
	    ctx.fill();

        // rim
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 3;
        ctx.beginPath();
	    ctx.arc(FUELGAUGE_SIZE.width/2, FUELGAUGE_SIZE.height/2, FUELGAUGE_SIZE.height/2 - 2, 0, 2 * Math.PI);
        ctx.stroke();

        // scale
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(FUELGAUGE_DIAL.x, FUELGAUGE_DIAL.y, FUELGAUGE_DIAL.radius, FUELGAUGE_DIAL.angleFull, FUELGAUGE_DIAL.angleEmpty);
        ctx.stroke();

        // indicator markers
        // full
        ctx.beginPath();
        ctx.moveTo(Math.cos(FUELGAUGE_DIAL.angleFull) * (FUELGAUGE_DIAL.radius - 5) + FUELGAUGE_DIAL.x, Math.sin(FUELGAUGE_DIAL.angleFull) * (FUELGAUGE_DIAL.radius - 5) + FUELGAUGE_DIAL.y);
        ctx.lineTo(Math.cos(FUELGAUGE_DIAL.angleFull) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.x, Math.sin(FUELGAUGE_DIAL.angleFull) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.y);
        ctx.stroke();

        // 3/4
        ctx.beginPath();
        ctx.moveTo(Math.cos((3 * FUELGAUGE_DIAL.angleFull + FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius - 3) + FUELGAUGE_DIAL.x, Math.sin((3 * FUELGAUGE_DIAL.angleFull + FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius - 3) + FUELGAUGE_DIAL.y);
        ctx.lineTo(Math.cos((3 * FUELGAUGE_DIAL.angleFull + FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius + 0) + FUELGAUGE_DIAL.x, Math.sin((3 * FUELGAUGE_DIAL.angleFull + FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius + 0) + FUELGAUGE_DIAL.y);
        ctx.stroke();

        // 1/2
        ctx.beginPath();
        ctx.moveTo(Math.cos(23 * Math.PI / 12) * (FUELGAUGE_DIAL.radius - 3) + FUELGAUGE_DIAL.x, Math.sin(23 * Math.PI / 12) * (FUELGAUGE_DIAL.radius - 3) + FUELGAUGE_DIAL.y);
        ctx.lineTo(Math.cos(23 * Math.PI / 12) * (FUELGAUGE_DIAL.radius + 3) + FUELGAUGE_DIAL.x, Math.sin(23 * Math.PI / 12) * (FUELGAUGE_DIAL.radius + 3) + FUELGAUGE_DIAL.y);
        ctx.stroke();

        // 1/4
        ctx.beginPath();
        ctx.moveTo(Math.cos((FUELGAUGE_DIAL.angleFull + 3 * FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius - 3) + FUELGAUGE_DIAL.x, Math.sin((FUELGAUGE_DIAL.angleFull + 3 * FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius - 3) + FUELGAUGE_DIAL.y);
        ctx.lineTo(Math.cos((FUELGAUGE_DIAL.angleFull + 3 * FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius + 0) + FUELGAUGE_DIAL.x, Math.sin((FUELGAUGE_DIAL.angleFull + 3 * FUELGAUGE_DIAL.angleEmpty) / 4) * (FUELGAUGE_DIAL.radius + 0) + FUELGAUGE_DIAL.y);
        ctx.stroke();

        // empty
        ctx.beginPath();
        ctx.moveTo(Math.cos(FUELGAUGE_DIAL.angleEmpty) * (FUELGAUGE_DIAL.radius - 5) + FUELGAUGE_DIAL.x, Math.sin(FUELGAUGE_DIAL.angleEmpty) * (FUELGAUGE_DIAL.radius - 5) + FUELGAUGE_DIAL.y);
        ctx.lineTo(Math.cos(FUELGAUGE_DIAL.angleEmpty) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.x, Math.sin(FUELGAUGE_DIAL.angleEmpty) * (FUELGAUGE_DIAL.radius + 5) + FUELGAUGE_DIAL.y);
        ctx.stroke();

        // indicators
        var indicatorFont = {
            color: '#666666',
            fontStyle: "10px Arial, sans-serif",
            fontSize: 10
        };
        drawCenteredText(ctx, Math.cos(FUELGAUGE_DIAL.angleFull - Math.PI / 12) * FUELGAUGE_DIAL.radius + FUELGAUGE_DIAL.x, Math.sin(FUELGAUGE_DIAL.angleFull - Math.PI / 12) * FUELGAUGE_DIAL.radius + FUELGAUGE_DIAL.y, "F", indicatorFont);
        drawCenteredText(ctx, Math.cos(FUELGAUGE_DIAL.angleEmpty + Math.PI / 12) * FUELGAUGE_DIAL.radius + FUELGAUGE_DIAL.x, Math.sin(FUELGAUGE_DIAL.angleEmpty + Math.PI / 12) * FUELGAUGE_DIAL.radius + FUELGAUGE_DIAL.y, "E", indicatorFont);

        // icon
        ctx.fillStyle = '#888888';
        ctx.strokeStyle = '#666666';
        // head
        ctx.beginPath();
        ctx.moveTo(41, 22);
        ctx.lineTo(50, 22);
        ctx.lineTo(50, 28);
        ctx.lineTo(41, 28);
        ctx.lineTo(41, 22);
        ctx.stroke();

        // body
        ctx.fillRect(42, 28, 8, 9);

        // fuel line
        ctx.beginPath();
        ctx.moveTo(49, 31);
        ctx.lineTo(50, 31);
        ctx.lineTo(51, 32);
        ctx.lineTo(51, 35);
        ctx.lineTo(52, 35);
        ctx.lineTo(53, 34);
        ctx.lineTo(53, 26);
        ctx.lineTo(52, 26);
        ctx.lineTo(52, 25);
        ctx.lineTo(50, 25);
        ctx.stroke();

        ctx.restore();
    }

    function createTotalProgressDiv() {
        if (!$('#totalProgressBar').length) {
            var totalProgressBar = document.createElement("div");
            totalProgressBar.id="totalProgressBar";
            totalProgressBar.className='hidden';
            $('#dbc_bar60').append(totalProgressBar);
            $('#totalProgressBar').css("z-index", "0");
        }
    }

    function createTotalProgressIndication(itemBreakdown) {
        createTotalProgressDiv();
        populateTotalProgressIndication(itemBreakdown);
    }

    function populateTotalProgressIndication(itemBreakdown) {
        // emtpy the bar
        $('#totalProgressBar').html('');

        // sum all locked items, all items up to the current level and subtract the current level locked items
        var allItems = lockedCount.total + itemBreakdown.countBySRS.total - itemBreakdown.countBySRS.bySRSArray[0].total;
        // unstarted is locked and init (ready for lessons)
        var totalUnstarted = lockedCount.total + itemBreakdown.countBySRS.bySRSArray[1].total;

        var totalCount = 0;
        var cumulativePercentage = 0;
        var sumFunction = function(countItem) {
            totalCount += countItem.total;
        };
        var zindex = 7;
        var previousName;

        // burn -> apprentice only if not reversed
        if(!wkof.settings.db_cockpit.reverseTotalProgress) {
            for(var srsLvl = srsDrawing.length - 1; srsLvl >= 0; srsLvl--) {
                var relatedCounts = filterBySRSCountOnAbbrev(itemBreakdown.countBySRS.bySRSArray, srsDrawing[srsLvl].srsAbbrev);
                totalCount = 0;
                relatedCounts.forEach(sumFunction);

                var percentage = (100 * totalCount / allItems).toFixed(4);
                createSrsProgressBar(srsDrawing[srsLvl].srsName, srsDrawing[srsLvl].color(), srsDrawing[srsLvl].color().progressText, percentage, cumulativePercentage, zindex--, previousName);
                cumulativePercentage += parseFloat(percentage);
                previousName = srsDrawing[srsLvl].srsName;
            }

            // and add the srs-unstaged part
            if (totalUnstarted > 0) {
                // draw it as 'the rest' to prevent white horizontal line due to rounding differences
                var remainingPercentage = 100 - cumulativePercentage;
                createSrsProgressBar("Locked/Lessons", { start: "#545454", end: "#545454" }, "#efefef", remainingPercentage, cumulativePercentage, zindex--, previousName);
            }
        }

        // apprentice -> burn only if reversed
        if(wkof.settings.db_cockpit.reverseTotalProgress) {
            // the srs-unstaged part
            var unstartedPercentage = (100 * totalUnstarted / allItems).toFixed(4);
            createSrsProgressBar("Locked/Lessons", { start: "#545454", end: "#545454" }, "#efefef", unstartedPercentage, cumulativePercentage, zindex--, previousName);
            cumulativePercentage += parseFloat(unstartedPercentage);
            previousName = "Locked/Lessons";

            for(srsLvl = 0; srsLvl < srsDrawing.length - 1; srsLvl++) {
                relatedCounts = filterBySRSCountOnAbbrev(itemBreakdown.countBySRS.bySRSArray, srsDrawing[srsLvl].srsAbbrev);
                totalCount = 0;
                relatedCounts.forEach(sumFunction);

                percentage = (100 * totalCount / allItems).toFixed(4);
                createSrsProgressBar(srsDrawing[srsLvl].srsName, srsDrawing[srsLvl].color(), srsDrawing[srsLvl].color().progressText, percentage, cumulativePercentage, zindex--, previousName);
                cumulativePercentage += parseFloat(percentage);
                previousName = srsDrawing[srsLvl].srsName;
            }

            // and add the burnt part as 'the rest'
            srsLvl = srsDrawing.length - 1;
            relatedCounts = filterBySRSCountOnAbbrev(itemBreakdown.countBySRS.bySRSArray, srsDrawing[srsLvl].srsAbbrev);
            totalCount = 0;
            relatedCounts.forEach(sumFunction);

            if (totalCount > 0) {
                remainingPercentage = 100 - cumulativePercentage;
                // draw it as 'the rest' to prevent white horizontal line due to rounding differences
                createSrsProgressBar(srsDrawing[srsLvl].srsName, srsDrawing[srsLvl].color(), srsDrawing[srsLvl].color().progressText, remainingPercentage, cumulativePercentage, zindex--, previousName);
            }
        }
    }

    var timeout = {};
    function createSrsProgressBar(name, color, altTextColor, percentage, offsetLeft, zindex, previousName) {

        // bloody pass as string, give me the numbers
        var nrPercentage = parseFloat(percentage);
        var nrOffset = parseFloat(offsetLeft);
        var totalWidth = ((nrPercentage + nrOffset));
        var idName = name.slice(0,3);

        var textColor = '#efefef';
        if (altTextColor != undefined) {
            textColor = altTextColor;
        }

        $('#totalProgressBar').append(
            '<div id="tpb_' + idName + '" title="' + name + ': ' + nrPercentage.toFixed(2)
            + '%" style="width: ' + totalWidth
            + '%; background-image: linear-gradient(' + color.start + ', ' + color.end
            + '); color: ' + textColor
            + '; margin-left: 0; z-index: ' + zindex
            + ';"><span style="margin-left: ' + (totalWidth == 0 ? 0 : (100 * nrOffset / totalWidth))
            + '%; align: center;" displayvalues=":' + nrPercentage.toFixed(2) + '%_:' + nrPercentage.toFixed(1)
            + '%_0:&nbsp;">$nbsp;</span></div>');

        $('#cockpitPanel')[0].addEventListener('dashboard-cockpit-loaded', e => window.db_cockpit_calcAndDisplayTotalProgressBarPercentage('tpb_' + idName, previousName ? 'tpb_' + previousName.slice(0,3) : null));
        timeout[idName] = false;
        window.addEventListener('resize', function() {
            clearTimeout(timeout[''+idName]);
            timeout[''+idName] = setTimeout(() => window.db_cockpit_displayTotalProgressBarPercentage('tpb_' + idName, previousName ? 'tpb_' + previousName.slice(0,3) : null), 250);
        });
    }

    function calcAndDisplayTotalProgressBarPercentage(divId, blockingDivId) {
        var tpbSpan = $('#' + divId + ' span')[0];
        var original = tpbSpan.getAttribute("displayvalues");
        var sizeValues = tpbSpan.getAttribute("displayvalues").split("_").map(stringValue => stringValue.split(":"));
        if (sizeValues[0][0] == '') {
            tpbSpan.innerHTML = sizeValues[0][1];
            sizeValues[0][0] = tpbSpan.getBoundingClientRect().width;

            tpbSpan.innerHTML = sizeValues[1][1];
            sizeValues[1][0] = tpbSpan.getBoundingClientRect().width;

            tpbSpan.setAttribute("displayvalues", sizeValues.map(sizeValue => sizeValue.join(":")).join("_"));
        }

        window.db_cockpit_displayTotalProgressBarPercentage(divId, blockingDivId);
    }
    window.db_cockpit_calcAndDisplayTotalProgressBarPercentage = calcAndDisplayTotalProgressBarPercentage;

    function displayTotalProgressBarPercentage(divId, blockingDivId) {
        var tpbDiv = $('#' + divId)[0];
        var tbpSpan = $('#' + divId + ' span')[0];
        var sizeValues = tbpSpan.getAttribute("displayvalues").split("_").map(stringValue => stringValue.split(":"));
        if (sizeValues[0][0] == '') {
            // not ready to display
            return;
        }

        var subtractSize = 0;
        if (blockingDivId) {
            var tpbBlockingDiv = $('#' + blockingDivId);
            subtractSize = $('#' + blockingDivId)[0].getBoundingClientRect().width;
        }
        var availableSize = $('#' + divId)[0].getBoundingClientRect().width - subtractSize;
        availableSize = Math.max(availableSize, 0);

        for (var i = 0; i < sizeValues.length; i++) {
            if (sizeValues[i][0] <= availableSize) {
                tbpSpan.innerHTML = sizeValues[i][1];
                return;
            }
        }
    }
    window.db_cockpit_displayTotalProgressBarPercentage = displayTotalProgressBarPercentage;

    function displayGrid(allPassed) {
        resetGridDefaults(allPassed);
        structureGrid(allPassed);
        showOrHidePanels(allPassed);
    }

    function resetGridDefaults(allPassed) {
        //  default layout:
        //  -------------------|------------------|------------------|-------------------
        //  | dbc_gas          | dbc_core                            | dbc_cruise       |
        //  |-------------------                                     -------------------|
        //  | dbc_currentLevel |                                     | dbc_forecast     |
        //  --------------------------------------|-------------------                  -
        //  | dbc_bar60                                              |                  |
        //  -------------------|------------------|-------------------                  -
        //                                                           |                  |
        //                                                           |-------------------

        // GRID CELL PLACEMENTS
        $('#dbc_bar60').css('grid-row-start', '4');
        $('#dbc_core').css('grid-row-start', '1');
        $('#dbc_currentLevel').css('grid-row-start', '2');
        $('#dbc_currentLevel').css('grid-row-end', '3');
        $('#dbc_forecast').css('grid-row-start', '2');
        $('#dbc_forecast').css('grid-row-end', '5');
        $('#dbc_bar60').css('grid-column-start', '1');
        $('#dbc_bar60').css('grid-column-end', 'span 3');
        $('#dbc_bar60').css('grid-row-start', '3');

        // GRID CELL VISIBILITY
        $('#dbc_gas').removeClass('hidden');
        $('#dbc_cruise').removeClass('hidden');

        // GRID SIZING AND RESIZING
        $('#cockpitPanel').css('grid-template-columns', 'auto ' + getCanvasGridWidth() + 'px ' + getCanvasGridWidth() + 'px ' + BASE_COLUMN_WIDTH + 'px');
        $('#cockpitPanel').css('min-width', ((getLeftColumnWidth(allPassed) + 30 + getCanvasSize() + BASE_COLUMN_WIDTH)));   // left column, 3xmargin(10), canvas and forecast (335)

        // MOVE CELL CONTENTS
        var reviewButtonBlock = $('#reviewButtonBlock').detach();
        $('#dbc_cruise').append(reviewButtonBlock);
        if (isRSPresent()) {
            var reviewSummaryDiv = $('#reviewSummaryDiv').detach();
            $('#dbc_cruise').append(reviewSummaryDiv);
        }

        // MARGINS AND STYLING
        $('#dbc_core').css('margin-top', '');
        $('#dbc_bar60').css('margin-top', '');

        reviewButtonBlock.css("float", "left");
        reviewButtonBlock.css("margin-left", "0px");

        $('#dbc_forecast').css('min-height', '');
        $('.wk-panel--review-forecast').height("56.5%");

        if (moveExtraStudy()) {
            var recentMistakes = $('.wk-panel--recent-mistakes');
            recentMistakes.css("margin-bottom", "10px");
            var extraStudy = $('.wk-panel--extra-study');
            extraStudy.detach();
            extraStudy.css('max-width', '');
            extraStudy.css('margin-top', '');
            extraStudy.css('margin-bottom', '');
            var extraRecentStudy = $('#extraRecentStudy');
            extraRecentStudy.append(extraStudy);
        }
    }


    function structureGrid(allPassed) {

        var tpIndicator = parseInt(wkof.settings.db_cockpit.showTotalProgress);
        switch(tpIndicator) {
            case 0: // not visible
                // place in center beneath arc
                $('#dbc_bar60').css('grid-column-end', 'span 2');
                $('#dbc_bar60').css('grid-column-start', '2');
                $('#dbc_bar60').css('grid-row-start', '3');
                // and adjust size col heights
                $('#dbc_currentLevel').css('grid-row-end', '4');
                $('#dbc_forecast').css('grid-row-end', '4');
                break;
            case 1: // long bar with extended review forecast
                // is the default
                break;
            case 2: // short bar
                // place in center beneath arc
                $('#dbc_bar60').css('grid-column-end', 'span 2');
                $('#dbc_bar60').css('grid-column-start', '2');
                $('#dbc_bar60').css('grid-row-start', '3');
                // and adjust size col heights
                $('#dbc_currentLevel').css('grid-row-end', '4');
                break;
            case 3: // long bar with extended level progress panel
                // shrink col height
                $('#dbc_forecast').css('grid-row-end', '3');
                // shift bar
                $('#dbc_bar60').css('grid-column-start', '2');
                // and adjust size col heights
                $('#dbc_currentLevel').css('grid-row-end', '5');
                break;
            case 4: // full bar over whole screen width
                // shrink col height
                $('#dbc_forecast').css('grid-row-end', '3');
                // extend bar
                $('#dbc_bar60').css('grid-column-end', 'span 4');
                break;
            case 5: // top bar above the arc
                createTotalProgressDiv();
                // shift bar out of the way
                $('#dbc_bar60').css('grid-row-start', '4');
                // move arc down
                $('#dbc_core').css('grid-row-start', '2');
                $('#dbc_core').css('margin-top', '-50px');

                // position bar
                $('#dbc_bar60').css('grid-column-end', 'span 2');
                $('#dbc_bar60').css('grid-column-start', '2');
                $('#dbc_bar60').css('grid-row-start', '1');
                $('#dbc_bar60').css('margin-top', '4px');

                // and adjust col height
                $('#dbc_currentLevel').css('grid-row-end', '5');
                break;
        }

        var applyRightGridWidth = BASE_COLUMN_WIDTH + 10;
        var applyLeftGridWidth = getLeftColumnWidth(allPassed) + 10;

        if (!isRightGridVisible(allPassed)) {
            if (wkof.settings.db_cockpit.showMainButtons) {
                // 1. shift reviewsbutton to left of the speedometer
                var reviewButtonBlock = $('#reviewButtonBlock').detach();
                $('#dbc_gas').prepend(reviewButtonBlock);
                reviewButtonBlock.css("float", "right");
                reviewButtonBlock.css("margin-left", "10px");
            }
            if (isRSVisible()) {
                var reviewSummaryDiv = $('#reviewSummaryDiv').detach();
                $('#dbc_gas').prepend(reviewSummaryDiv);
                $('#reviewSummaryTile').css("margin-left", "10px");
            }

            // 2. restructure column
            applyRightGridWidth = 0;

            // also occupy the review forecast space so we fill out until the margin
            switch(tpIndicator) {
                case 1: // long bar with extended review forecast
                    $('#dbc_bar60').css('grid-column-end', 'span 4');
                    break;
                case 2: // short bar
                    $('#dbc_bar60').css('grid-column-end', 'span 3');
                    break;
                case 5: // top bar above the arc
                    $('#dbc_bar60').css('grid-column-end', 'span 3');
                    break;
            }
        }
        else if (!isTopRightCellVisible(allPassed)) {
            $('#dbc_cruise').addClass('hidden');
            $('#dbc_forecast').css('grid-row-start', '1');
        }

        if (!isLeftGridVisible(allPassed)) {
            // 1. restructure column
            applyLeftGridWidth = 0;

            // 2. hide dbc_gas because of the min width configurations
            $('#dbc_gas').addClass('hidden');

            // also occupy the level progress space so we fill out until the margin
            switch(tpIndicator) {
                case 2: // short bar
                    $('#dbc_bar60').css('grid-column-start', '1');
                    $('#dbc_bar60').css('grid-column-end', 'span 3');
                    break;
                case 3: // long bar with extended level progress panel
                    $('#dbc_bar60').css('grid-column-start', '1');
                    $('#dbc_bar60').css('grid-column-end', 'span 4');
                    break;
                case 5: // top bar above the arc
                    $('#dbc_bar60').css('grid-column-start', '1');
                    $('#dbc_bar60').css('grid-column-end', 'span 3');
                    break;
            }
        }
        else if (!isTopLeftCellVisible(allPassed)) {
            $('#dbc_gas').addClass('hidden');
            $('#dbc_currentLevel').css('grid-row-start', '1');
        }

        // restructure columns based on visibility
        $('#cockpitPanel').css('grid-template-columns', (applyLeftGridWidth > 0 ? 'auto ' : '0px ') + getCanvasGridWidth() + 'px ' + getCanvasGridWidth() + 'px ' + (applyRightGridWidth > 0 ? applyRightGridWidth-10 : 0) + 'px');
        $('#cockpitPanel').css('min-width', ((applyLeftGridWidth + 10 + getCanvasSize() + applyRightGridWidth)));   // left col, 2xmargin(10) and canvas

        var extraRecentStudy = $('#extraRecentStudy');
        if (moveExtraStudy()) {
            // place the new extra study panel
            var locationSetting = parseInt(getExtraStudyLocationSetting());
            var forecast = $('.wk-panel--review-forecast');
            var extraStudy = $('.wk-panel--extra-study');

            switch(locationSetting) {
                case 1: // default, above dashboard progress panel
                    extraRecentStudy.detach();
                    extraStudy.css('margin-bottom', '10px');
                    $('#dbc_currentLevel').prepend(extraRecentStudy);
                    break;
                case 2: // below main arc
                    extraRecentStudy.detach();
                    extraStudy.css('max-width', (getCanvasGridWidth() * 2 + 10) + 'px');
                    $('#dbc_core').append(extraRecentStudy);
                    break;
                case 3: // above review forecast
                    extraRecentStudy.detach();
                    extraStudy.css('margin-bottom', '10px');
                    forecast.height("267px");
                    $('#dbc_forecast').prepend(extraRecentStudy);
                    if (wkof.settings.db_cockpit.showForecast) {
                        $('#dbc_forecast').css('min-height', ((327 + extraStudy.outerHeight())) + 'px');
                    }
                    break;
                case 4: // below review forecast
                    extraRecentStudy.detach();
                    forecast.height("267px");
                    $('#dbc_forecast').append(extraRecentStudy);
                    if (wkof.settings.db_cockpit.showForecast) {
                        $('#dbc_forecast').css('min-height', ((327 + extraStudy.outerHeight())) + 'px');
                    }
                    break;
                case 5: // above main arc
                    extraRecentStudy.detach();
                    extraStudy.css('margin-bottom', '10px');
                    extraStudy.css('max-width', (getCanvasGridWidth() * 2 + 10) + 'px');
                    $('#dbc_core').css('margin-top', '');
                    $('#dbc_core').prepend(extraRecentStudy);
                    break;
                case 6: // below dashboard progress panel
                    extraRecentStudy.detach();
                    extraStudy.css('margin-top', '10px');
                    $('#dbc_currentLevel').append(extraRecentStudy);
                    break;
                case 7: // center top. This position DOES NOT EXIST in the cockpit itself, but only as a translation from ESM
                    extraRecentStudy.detach();
                    extraStudy.css('margin-bottom', '10px');
                    extraStudy.css('max-width', (getCanvasGridWidth() * 2 + 10) + 'px');
                    // if total progress bar setting is top, we put extra study above that
                    if (wkof.settings.db_cockpit.showTotalProgress == '5') {
                        $('#dbc_bar60').prepend(extraRecentStudy);
                        var shiftHeight = $('.wk-panel--extra-study').outerHeight() + $('#totalProgressBar').outerHeight() - 100 + 20;
                        $('#dbc_core').css('margin-top', shiftHeight + 'px');
                    }
                    // else above the arc (same as option 5)
                    else {
                        $('#dbc_core').prepend(extraRecentStudy);
                    }
                    break;
                case 8: // same as 1, but above recent mistakes
                    extraRecentStudy.detach();
                    $('#dbc_currentLevel').prepend(extraRecentStudy);
                    extraStudy.detach();
                    extraStudy.css('margin-bottom', '10px');
                    extraRecentStudy.prepend(extraStudy);
                    break;
            }
        }
        else {
            // still take care of recent mistakes, put it above level progress
            extraRecentStudy.detach();
            $('#dbc_currentLevel').prepend(extraRecentStudy);
        }
    }

    function showOrHidePanels(allPassed) {

        applyVisibility((wkof.settings.db_cockpit.showTotalProgress != '0'), $('#totalProgressBar'));
        applyVisibility(wkof.settings.db_cockpit.showForecast, $('.wk-panel--review-forecast'));
        applyVisibility(wkof.settings.db_cockpit.showMainButtons, $('#reviewButtonBlock'));
        applyVisibility(wkof.settings.db_cockpit.showReviewSummary, $('#reviewSummaryDiv'));

        applyVisibility(showLessonsButton(), $('.dashboard__lessons-and-reviews-section'));
        applyVisibility(showLockedCount('1'), $('#lockedCount'));
        applyVisibility(showLockedCount('2'), $('#fuelgaugeDiv'));
        applyVisibility(showLevelProgress(allPassed), $('.wk-panel--level-progress'));

        // place the new extra study panel if it exists and is not governed by the Extra study mover script
        if(moveExtraStudy()) {
            var locationSetting = parseInt(getExtraStudyLocationSetting());
            applyVisibility((locationSetting != 0), $('#extraRecentStudy'));
        }

        // 4 bottom panels, hide or show
        applyVisibility(wkof.settings.db_cockpit.showRecentUnlocks, $('.wk-panel--dashboard-list-unlocks'));
        applyVisibility(wkof.settings.db_cockpit.showCriticalItems, $('.wk-panel--dashboard-list-critical'));
        applyVisibility(wkof.settings.db_cockpit.showRecentBurns, $('.wk-panel--dashboard-list-burned'));
        applyVisibility(wkof.settings.db_cockpit.showForumTopics, $('.dashboard__community-banner'));
    }

    function applyVisibility(setting, panel) {
        if (setting) {
            panel.removeClass('hidden');
        }
        else {
            panel.addClass('hidden');
        }
    }

    // Adds the script's CSS to the page
    function add_css() {
        $('head').append(
            `<style id="db_cockpit_CSS">
                 #cockpitPanel {
                     display: grid; grid-template-columns: auto 19.5% 19.5% 29%; grid-template-rows: 240px auto; grid-gap: 10px 10px; margin-bottom: 10px;
                 }
                 #dbc_gas {
                     grid-column-start: 1; grid-column-end: 2; grid-row-start: 1; grid-row-end: 2;
                 }
                 #dbc_currentLevel {
                     grid-column-start: 1; grid-column-end: 2; grid-row-start: 2; grid-row-end: 3;
                 }
                 #dbc_core {
                     grid-column-start: 2; grid-column-end: span 2; grid-row-start: 1; grid-row-end: span 2; aligh: center; margin: 0 auto;
                 }
                 #dbc_bar60 {
                     grid-column-start: 1; grid-column-end: span 3; grid-row-start: 3; grid-row-end: span 1;
                 }
                 #dbc_cruise {
                     grid-column-start: 4; grid-column-end: 5; grid-row-start: 1; grid-row-end: 2;
                 }
                 #dbc_forecast {
                     grid-column-start: 4; grid-column-end: 5; grid-row-start: 2; grid-row-end: span 2;
                 }
                 .progression { display: block; }
                 .db_cockpit_locked {
                     height: 70px;
                     width: 120px;
                     position: relative;
                     float: left;
                     font: bold 24px Arial, sans-serif;
                     color: #fff;
                     background-color: #aaa;
                     padding-top: 30px;
                     text-align: center;
                 }
                 .db_cockpit_locked .db_cockpit_tooltipBreakdownText {
                     top: -60px;
                     left: -10px;
                 }
                 .db_cockpit_locked .title {
                     font-size: 14px;
                     font-weight: normal;
                     color: rgba(0,0,0,0.3);
                     text-shadow: none;
                     position: absolute;
                     bottom: 0;
                     left: 0;
                     width: 100%;
                     padding-bottom: 20px;
                     margin-bottom: 2.5px;
                 }
                 .db_cockpit_fuelgauge {
                     height: 100px;
                     width: 120px;
                     float: left;
                  }
                 .db_cockpit_tooltips { height: 0px; }
                 .db_cockpit_tooltipText {
                     visibility: hidden;
                     border: 1px solid #555;
                     background-color: #f8f8db;
                     color: #555;
                     font: 12px Segoe UI;
                     text-align: left;
                     padding: 3px 7px;
                     position: absolute;
                     z-index: 1;
                 }
                  .db_cockpit_fuelgauge .db_cockpit_tooltipText {
                     top: -80px;
                     left: 95px;
                     position: relative;
                  }
                  .db_cockpit_fuelgauge .db_cockpit_tooltipText tr td:last-child {
                     text-align: right;
                  }
                 .db_cockpit_tooltipBreakdownText {
                     visibility: hidden;
                     border: 3px solid rgba(75,75,75,0.8);
                     border-radius: 5px;
                     background-color: #333;
                     width: 150px;
                     color: rgba(255,255,255,0.7);
                     font: 14px Arial, sans-serif;
                     text-align: left;
                     padding: 0;
                     position: absolute;
                     z-index: 3;
                     display: grid; grid-template-columns: 50% 50%; grid-template-rows: 81px auto; grid-gap: 0px;
                 }
                 .db_cockpit_tooltipBreakdownText .srs-logo {
                     grid-column-start: 1; grid-column-end: 2; grid-row-start: 1; grid-row-end: 2;
                 }
                 .db_cockpit_tooltipBreakdownText .tt_bd_totals {
                     grid-column-start: 2; grid-column-end: 3; grid-row-start: 1; grid-row-end: 2;
                 }
                 .db_cockpit_tooltipBreakdownText ul {
                     list-style-type:none;
                     margin: 0 0 0 0;
                 }
                 .db_cockpit_tooltipBreakdownText li:first-child {
                     background-image: linear-gradient(to bottom, #0af, #0093dd);
                 }
                 .db_cockpit_tooltipBreakdownText li:nth-child(2) {
                     background-image: linear-gradient(to bottom, #f0a, #dd0093);
                 }
                 .db_cockpit_tooltipBreakdownText li:nth-child(3) {
                     background-image: linear-gradient(to bottom, #a0f, #9300dd);
                 }
                 .db_cockpit_tooltipBreakdownText li {
                     line-height: 27px;
                     padding-left: 5px;
                     padding-right: 5px;
                 }
                 .db_cockpit_tooltipBreakdownText li span {
                     font-weight: bold;
                     float: right;
                 }
                 .db_cockpit_tooltipDialText {
                     font: 12px Arial, sans-serif;
                     visibility: hidden;
                     border-radius: 5px;
                     background-color: #333;
                     color: #aaa;
                     text-align: right;
                     padding: 0;
                     position: absolute;
                     z-index: 2;
                 }
                 .db_cockpit_tooltipDialText table {
                     margin: 5px;
                 }
                 .db_cockpit_ctd_summary {
                     text-align: center;
                 }
                 .db_cockpit_tooltipDialText table tr td {
                     width: 40px;
                 }
                 .db_cockpit_ctd_level {
                     font: bold 36px Arial, sans-serif;
                 }
                 .db_cockpit_ctd_link {
                     font: 12px Arial, sans-serif;
                     vertical-align: middle;
                 }
                 .db_cockpit_ctd_clickable {
                     cursor: pointer;
                 }
                 .db_cockpit_ctd_score {
                     font: bold 16px Arial, sans-serif
                 }
                 .db_cockpit_ctd_header {
                     font-weight: bold;
                 }
                 .db_cockpit_ctd_category {
                     font-weight: bold;
                     text-align: left;
                 }
                 .db_cockpit_tooltipText_visible {
                     visibility: visible;
                 }
                 .db_cockpit_clicktipText_visible {
                     visibility: visible;
                 }
                 .db_cockpit_locked:hover .db_cockpit_tooltipBreakdownText {
                     visibility: visible;
                 }
                 .db_cockpit_fuelgauge:hover .db_cockpit_tooltipText {
                     visibility: visible;
                 }
                 #totalProgressBar {
                     height: 30px;
                     box-shadow: 0 0 2pt 2pt #BBBBBB;
                     position: relative;
                     width: 99.99%;
                 }
                 #totalProgressBar div {
                     height: 30px;
                     position: absolute;
                     text-align: center;
                     vertical-align: middle;
                     line-height: 30px;
                     color: #efefef;
                 }
             </style>`);
		}
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------MENU AND SETTINGS------------------------------------------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------------------------------------//

    function consoleLog(obj) {
        $.each(obj, function(key, element) {
            console.log('key: ' + key + ', value: ' + element);
        });
    }

    // Load settings and set defaults
    function load_settings() {
        var defaults = {
            srsOrientation: '0',
            srsSize: '0',
            goldenBurn: true,
            presetLevelColor: '0',
            levelNrInside: '#dd0093',
            levelNrOutside: '#0093dd',
            showSrsLocked: '2',
            showMainButtons: true,
            lvl60Lessons: false,
            lvl60Progress: false,

            showSrsDetail: false,
            showLeechCount: false,
            leechThreshold: 1,
            leechMinWrong: 1,
            leechDisplay: '0',
            showSrsLevelBar: '1',
            srsLevelThreshold: 90,
            srsLevelSeparation: 2,
            showLevelGridLines: false,
            showTotalProgress: '1',
            reverseTotalProgress: false,

            showForecast: true,
            showRecentUnlocks: false,
            showCriticalItems: true,
            showRecentBurns: true,
            showForumTopics: true,
            showExtraStudy: '1',
            showReviewSummary: true
        };
        return wkof.Settings.load('db_cockpit', defaults);
    }

    // Installs the options button in the menu
    function install_menu() {
        var config = {
            name: 'db_cockpit_settings',
            submenu: 'Settings',
            title: 'Dashboard Cockpit',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    // Create the options
    function open_settings(items) {
        var config = {
            script_id: 'db_cockpit',
            title: 'Dashboard Cockpit Settings',
            on_save: fetch_and_update,
            content: {
                tabs: {
                    type: 'tabset',
                    content: {
                        srsProgressPage: {
                            type: 'page',
                            label: 'SRS Progress',
                            hover_tip: 'Settings for the SRS Progress display',
                            content: {
                                srsStyle_group: {
                                    type: 'group',
                                    label: 'Display Style',
                                    content: {
                                        srsOrientation: {
                                            type: 'dropdown',
                                            label: 'Orientation',
                                            hover_tip: 'Tilts the SRS progress overview',
                                            default: '0',
                                            content: {
                                               0: 'left',
                                               1: 'down'
                                            }
                                        },
                                        srsSize: {
                                            type: 'dropdown',
                                            label: 'Size',
                                            hover_tip: 'Size of the SRS progress arc',
                                            default: '0',
                                            content: {
                                               0: 'large',
                                               1: 'medium',
                                               2: 'small'
                                            }
                                        },
                                        goldenBurn: {
                                            type: 'checkbox',
                                            label: 'Golden Burn',
                                            hover_tip: 'Display golden Burn background',
                                            default: true
                                        },
                                        presetLevelColor: {
                                            type: 'dropdown',
                                            label: 'Level number display',
                                            hover_tip: 'Display method for the center level number',
                                            default: '0',
                                            content: {
                                                0: 'default (pale pink-blue)',
                                                1: 'pale with selected colors',
                                                2: 'bright with selected colors'
                                            }
                                        },
                                        levelNrInside: {
                                            type: 'color',
                                            label: 'Level center color',
                                            hover_tip: 'Color of the center of the level number',
                                            default: '#dd0093'
                                        },
                                        levelNrOutside: {
                                            type: 'color',
                                            label: 'Level outside color',
                                            hover_tip: 'Color the level number fades into on the edges',
                                            default: '#0093dd'
                                        }
                                    }
                                },
                                srsLocked_group: {
                                    type: 'group',
                                    label: 'Locked items',
                                    content: {
                                        showSrsLocked: {
                                            type: 'dropdown',
                                            label: 'Locked Count',
                                            hover_tip: 'Display the Locked count',
                                            default: '2',
                                            content: {
                                                0: 'none',
                                                1: 'Tile',
                                                2: 'Fuel Gauge (car)'
                                            }
                                        }
                                    }
                                },
                                lessonsReviews_group: {
                                    type: 'group',
                                    label: 'Lessons and Reviews buttons',
                                    content: {
                                        showMainButtons: {
                                            type: 'checkbox',
                                            label: 'Show lessons/reviews buttons',
                                            hover_tip: 'Provided for users running scripts that display alternate buttons. Cockpit does not move the buttons elsewhere!',
                                            default: true
                                        }
                                    }
                                },
                                level60_group: {
                                    type: 'group',
                                    label: 'Level 60 options',
                                    content: {
                                        lvl60Lessons: {
                                            type: 'checkbox',
                                            label: 'Auto hide lessons section',
                                            hover_tip: 'Hides the locked count and lessons button if neither has items left',
                                            default: false
                                        },
                                        lvl60Progress: {
                                            type: 'checkbox',
                                            label: 'Auto hide level progress',
                                            hover_tip: 'Hides the level progress panel when locked count and lessons are zero, and all items have reached Guru at least once (passed)',
                                            default: false
                                        }
                                    }
                                }
                            }
                        },
                        srsPluginsPage: {
                            type: 'page',
                            label: 'Progress Details',
                            hover_tip: 'Features that provide more details',
                            content: {
                                srsDetail_group: {
                                    type: 'group',
                                    label: 'SRS Details',
                                    content: {
                                        showSrsDetail: {
                                           type: 'checkbox',
                                           label: 'Show SRS Detail',
                                           hover_tip: 'Display the Apprentice and Guru detail splits',
                                           default: false
                                        },
                                        showLeechCount: {
                                           type: 'checkbox',
                                           label: 'Show Leech Count',
                                           hover_tip: 'Displays counts of the identified leeches per stage',
                                           default: false
                                        },
                                        leechThreshold: {
                                            type: 'number',
				                         	label: 'Leech threshold',
			                           		hover_tip: 'Higher threshold considers fewer items as leeches (1-4)',
			                         		default: 1
			                            },
                                        leechMinWrong: {
                                            type: 'number',
                                            label: 'Leech min. incorrect attempts',
                                            hover_tip: 'Consider only items with at least this many incorrect answers (1-10)',
                                            default: 1
                                        },
                                        leechDisplay: {
                                            type: 'dropdown',
                                            label: 'Brightness of Leech display',
                                            hover_tip: 'Select the desired brightness',
                                            default: '0',
                                            content: {
                                               0: 'dull',
                                               1: 'bright on hover',
                                               2: 'bright',
                                               3: 'inverted ellipse'
                                            }
                                        },
                                    }
                                },
                                srsLevel_group: {
                                    type: 'group',
                                    label: 'Level by SRS',
                                    content: {
                                        showSrsLevelBar: {
                                            type: 'dropdown',
                                            label: 'Display Level by SRS',
                                            hover_tip: 'Display user level SRS progression',
                                            default: '0',
                                            content: {
                                               0: 'none',
                                               1: 'Level by SRS stage',
                                               2: 'Level dials'
                                            }
                                        },
                                        srsLevelThreshold: {
                                            type: 'number',
				                         	label: 'Level by SRS threshold',
			                           		hover_tip: 'Percentage to consider level done',
			                         		default: 90
			                            },
                                        srsLevelSeparation: {
                                            type: 'number',
				                         	label: 'Level dials minimum separation',
			                           		hover_tip: 'Only display dials that are this far apart (0-10)',
			                         		default: 2
			                            },
                                        showLevelGridLines: {
                                           type: 'checkbox',
                                           label: 'Level dials gridlines',
                                           hover_tip: 'Display indicators for the middle of the SRS levels',
                                           default: false
                                        }
                                    }
                                },
                                srsTotalProgress_group: {
                                    type: 'group',
                                    label: 'Total Progress Bar',
                                    content: {
                                        showTotalProgress: {
                                            type: 'dropdown',
                                            label: 'Display Total Progress Bar',
                                            hover_tip: 'Total progress bar display style',
                                            default: '1',
                                            content: {
                                               0: 'none',
                                               1: 'Long bar (extend under level progress panel)',
                                               2: 'Short bar (center only)',
                                               3: 'Long bar (extend under review forecast)',
                                               4: 'Full bar (full width)',
                                               5: 'Top bar (center only)'
                                            }
                                        },
                                        reverseTotalProgress: {
                                           type: 'checkbox',
                                           label: 'Reverse order',
                                           hover_tip: 'Display locked->burn (true) or burn->locked (false)',
                                           default: false
                                        }
                                    }
                                },
                            }
                        },
                        panelPage: {
                            type: 'page',
                            label: 'Panels',
                            hover_tip: 'Show or Hide Panels',
                            content: {
                                showForecast: {
                                    type: 'checkbox',
                                    label: 'Review forecast',
                                    hover_tip: 'Display or hide this panel',
                                    default: true
                                },
                                showRecentUnlocks: {
                                    type: 'checkbox',
                                    label: 'New unlocks in the last 30 days',
                                    hover_tip: 'Display or hide this panel',
                                    default: false
                                },
                                showCriticalItems: {
                                    type: 'checkbox',
                                    label: 'Critical condition items',
                                    hover_tip: 'Display or hide this panel',
                                    default: true
                                },
                                showRecentBurns: {
                                    type: 'checkbox',
                                    label: 'Burned items in the last 30 days',
                                    hover_tip: 'Display or hide this panel',
                                    default: true
                                },
                                showForumTopics: {
                                    type: 'checkbox',
                                    label: 'Community banner',
                                    hover_tip: 'Display or hide this panel',
                                    default: true
                                },
                                showExtraStudy: getShowExtraStudySettingObject(),
                                showReviewSummary: {
                                    type: 'checkbox',
                                    label: 'Review Summary Tile',
                                    hover_tip: 'Display or hide this panel',
                                    default: true
                                }
                            }
                        }
                    }
                }
            }
        }

        var dialog = new wkof.Settings(config);
        dialog.open();
    }

    function getShowExtraStudySettingObject() {
        if (isESMPresent()) {
            return {
                type: 'html',
                label: 'Extra Study',
                hover_tip: 'Location of Extra Study panel',
                html: '<div class="right"><label style="text-align: left; margin: 5px; color: grey;">Governed by Extra Study Mover</label></div>',
                wrapper: 'row'
            }
        }
        else {
            return {
                type: 'dropdown',
                label: 'Extra Study',
                hover_tip: 'Location of Extra Study panel',
                default: '1',
                content: {
                    0: 'none',
                    1: 'Above level progress',
                    6: 'Below level progress',
                    5: 'Above SRS progress arc',
                    2: 'Below SRS progress arc',
                    3: 'Above review forecast',
                    4: 'Below review forecast'
                }
            }
        }
    }
})();