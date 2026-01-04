// ==UserScript==
// @name         WaniKani Workload Graph
// @namespace    rwesterhof
// @version      1.4.13
// @description  adds a button to the heatmap that displays your average workload over time
// @include      /^https:\/\/(www|preview)\.wanikani\.com(\/(#)?dashboard)?(\/)?$/
// @match        https://preview.wanikani.com/subjects/review*
// @match        https://www.wanikani.com/subjects/review*
// @require      https://greasyfork.org/scripts/410909-wanikani-review-cache/code/Wanikani:%20Review%20Cache.js?version=1183366
// @run-at       document-end
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422380/WaniKani%20Workload%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/422380/WaniKani%20Workload%20Graph.meta.js
// ==/UserScript==
;
(function(wkof, review_cache) {
    'use strict';

    /* global $, wkof */

    // Temporary measure to allow the review cache script to load on the review page to track reviews while the /reviews endpoint is unavailable
    if (/^https:\/\/(www|preview)\.wanikani\.com(\/(#)?dashboard)?(\/)?$/.test(window.location.href)) {

        if (!wkof) {
            let response = confirm('WaniKani Workload Graph script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

            if (response) {
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            }

            return;
        }

        // --------------------------- //
        // -------- TRIGGER ---------- //
        // --------------------------- //
        var graphButton =
            '<li id="wlg_header_position" class="sitemap__section"><button id="headerGraphButton" class="sitemap__section-header" data-navigation-section-toggle="" data-expanded="false" aria-expanded="false" type="button" onclick="window.graphReviews()">'
        +     '<span lang="ja">図表</span><span lang="en" class="font-sans">Graph</span>'
        + '</button></li>';

        var heatmapButton =
            '<button class="graph-button hover-wrapper-target button" onclick="window.graphReviews()">'
        +    '<div class="hover-wrapper above">Workload graph</div>'
        +    '<i class="fa fa-bar-chart"></i>'
        + '</button>';
        // put graph button in header initially
        add_css();
        $('#sitemap > li:first-child').after(graphButton);
        // add event listener
        $('.dashboard')[0].addEventListener('heatmap-loaded', moveButtonToHeatmap);
    }

    // eventlistener that moves the graph button to the heatmap once it is loaded
    function moveButtonToHeatmap(event) {
        $('#headerGraphButton').detach();
        $(heatmapButton).insertBefore('#heatmap .buttons .left .help-button');
        // and clean up the header button
        $('#wlg_header_position').detach();
    }

    // --------------------------- //
    // -- VARIABLES & CONSTANTS -- //
    // --------------------------- //
    const msInDay = 24 * 60 * 60 * 1000;
    const maxWidth = 900;
    const minWidth = maxWidth / 2;
    const maxPointSize = 10;
    const xAxisPadding = 50;
    const yAxisPadding = 50;
    // graph colors for detail stages (WLG, AT)
    const reviewStageColor = [ "#ff00b5", "#ee00a4", "#dd0093", "#cc0082", "#9439aa", "#882d9e", "#294ddb", "#0093dd" ];
    // graph colors for non-detail stages (WLG, AT)
    const reviewCategoryColor = [ "#dd0093", "#882d9e", "#294ddb", "#0093dd" ];
    // graph fill colors for level stage progression (LD)
    const stageColor = [ "#dd0093", "#dd0093", "#dd0093", "#dd0093", "#dd0093", "#dd0093", "#882d9e", "#882d9e", "#294ddb", "#0093dd", "#faac05" ];
    const stageThreshold = 0.05; // min fraction of items must pass to be considered at stage X - prevent (some) weird coloring for moved items
    // graph colors for reset shadow graphs (LD)
    const resetColors = ["#0000cc", "#00cc00", "#cccc00", "#cc00cc", "#00cccc", "#999999", "#0000aa", "#00aa00", "#aaaa00", "#aa00aa", "#00aaaa", "#666666", "#000099", "#009900", "#999900", "#990099", "#009999", "#660000", "#aaaaaa" ];
    const labelAll = { type: "all" };
    const labelTime = [ { type: "time", signal: 12 },   // show year labels, no dashes
                        { type: "time", signal: 3 },    // show year labels and quarterly dashes
                        { type: "time", signal: 1 } ];  // show year labels and monthly dashes
    const labelLevel = { type: "level", signal: 5 };    // x axis labels every signalLevel
    const labelToD = [ { type:"tod", signal: 3, format: "24h" },
                       { type:"tod", signal: 3, format: "12h" } ];
    const NOVALUE = -1;
    const MIN_REVIEWS_ACTUAL_LEVEL = 25;

    // constants determined during script run
    var startDate = null;  // the day of your first reviews

    // OPTIONS
    var CACHE_VERSION = '1.4';
    var CACHE_KEY = 'workload_graph_cache';
    function readCache() {
        var cached_json = localStorage.getItem(CACHE_KEY);
        if (cached_json) {
            var cached = JSON.parse(cached_json);
            if (cached.version == CACHE_VERSION) {
                options = cached;
                options.startAtDate[0]=new Date(options.startAtDate[0]); // de-json doesn't know this is supposed to be a date object
                options.startAtDate[2]=new Date(options.startAtDate[2]); // de-json doesn't know this is supposed to be a date object
                options.startAtDate[3]=new Date(options.startAtDate[3]); // de-json doesn't know this is supposed to be a date object
            }
            else if (cached.version == "1.3") {   // backwards compatible to 1.3
                options = cached;                                  // take the cached options
                options.startAtDate[0]=new Date(options.startAtDate[0]); // de-json doesn't know this is supposed to be a date object
                options.startAtDate[2]=new Date(options.startAtDate[2]); // de-json doesn't know this is supposed to be a date object
                options.version = CACHE_VERSION;                   // up the version
                                                                   // and add the new graph
                options.runningAverageDays(defaultOptions.runningAverageDays[3]);
                options.fillInd(defaultOptions.fillInd[3]);
                options.stageColorFill(defaultOptions.stageColorFill[3]);
                options.wlgReverse(defaultOptions.wlgReverse[3]);
                options.startAtDate(defaultOptions.startAtDate[3]);
                options.chosenTimeLabels(defaultOptions.chosenTimeLabels[3]);
                options.showDetailStages(defaultOptions.showDetailStages[3]);
                options.cumulativeReviews(defaultOptions.cumulativeReviews[3]);
                options.hideMovedItems.push(defaultOptions.hideMovedItems[3]);
            }
            else if (cached.version == "1.2") {   // backwards compatible to 1.2
                options = defaultOptions;
                options.runningAverageDays[0] = cached.runningAverageDays;
                options.fillInd[0] = cached.fillInd[0];
                options.fillInd[1] = cached.fillInd[1];
                options.stageColorFill[0] = cached.stageColorFill[0];
                options.stageColorFill[1] = cached.stageColorFill[1];
                options.wlgReverse[0] = cached.wlgReverse;
                options.startAtDate[0] = new Date(cached.startAtDate);
                options.chosenTimeLabels[0] = cached.chosenTimeLabels;
                options.showDetailStages[0] = cached.showDetailStages;
                options.cumulativeReviews[0] = cached.cumulativeReviews[0];
                options.cumulativeReviews[1] = cached.cumulativeReviews[1];
                options.hideMovedItems[1] = cached.hideMovedItems;
            }
        }
        else {
            options = defaultOptions;
        }
    }
    function cacheOptions() {
        // cache the options for next page load
        localStorage.setItem(CACHE_KEY, JSON.stringify(options));
    }
    var defaultOptions = {
        version: CACHE_VERSION,
                            // WLG               LD                AT                TOD
        runningAverageDays:  [ 7,                /*unused*/ 1,     30,               /*unused*/ 1     ],
        fillInd:             [ true,             false,            false,            false            ],
        stageColorFill:      [ false,            false,            false,            false            ],
        wlgReverse:          [ false,            /*unused*/ false, /*unused*/ false, /*unused*/ false ], // set to true to put enlightened on bottom and apprentice on top
        startAtDate:         [ null,             /*unused*/ null,  null,             null             ], // the chosen start date in the options
        chosenTimeLabels:    [ 1,                /*unused*/ 0,     1,                /*unused*/ 0,    ],
        showDetailStages:    [ false,            /*unused*/ false, false,            /*unused*/ false ],
        cumulativeReviews:   [ true,             false,            false,            false            ],
        hideMovedItems:      [ /*unused*/ false, true,             /*unused*/ false, /*unused*/ false ]
    };
    var options;
    function option(name) {
        return options[name][currentGraph];
    }
    function setOption(name, value) {
        options[name][currentGraph] = value;
    }


    // ------------------------------------ //
    // ----- RETRIEVAL AND STRIPPING ------ //
    // ------------------------------------ //
    var retrieved = false;
    var cachedStrippedData = null;
    // main button entry point takes care of retrieval and shows the workload graph
    async function graphReviews() {
        if (!options) readCache();

        if (!retrieved) {
            wkof.include('ItemData');
            await wkof.ready('ItemData')
                .then(displayProgressPane)
                .then(stripData);
           retrieved = true;
        }
        displayGraph();
    }
    window.graphReviews = graphReviews;

    // produces an empty stripped data object
    function getBlankStrippedData() {
         return { lastReviewDate: 0, reviewDays: [], reviewsPerLevel: [], levelUps: [], stagesPerLevel: [] };
    }

    // convert stage to category
    const categories = [ -1, 0, 0, 0, 0, 1, 1, 2, 3, 4 ];
    function toCategory(stage) {
        return categories[stage];
    }

    // produces an empty stripped data review day
    function getBlankReviewDayObj() {
        return { day: 0,
                 date: 0,
                 year: 0,
                 month: -1,
                 reviewsPerHour: Array(24).fill(0),
                 reviewsPerStage: [0, 0, 0, 0, 0, 0, 0, 0],
                 reviewsPerCategory: [0, 0, 0, 0],
                 reviewsTotal: 0,
                 errorsPerHour: Array(24).fill(0),
                 errorsPerStage: [0, 0, 0, 0, 0, 0, 0, 0],
                 errorsPerCategory: [0, 0, 0, 0],
                 errorsTotal: 0
        };
    }

    // gets an inited count per level per day
    function getReviewsPerLevel(strippedData, level) {
        var curList = strippedData.reviewsPerLevel.pop();
        if (!curList) {
            curList = new Array(61);
        }
        strippedData.reviewsPerLevel.push(curList);
        if (!curList[level]) {
            curList[level] = { level: level, total: 0, errors: 0 };
        }
        return curList[level];
    }

    // pushes all > reset level reviews to a pre-reset review overview
    // keeps all < reset level reviews for the "current run" overview
    function processResetToLevel(strippedData, level) {
        var curList = strippedData.reviewsPerLevel.pop();
        if (!curList) {
            curList = new Array(61);
        }
        else {
            var preResetReviews = new Array(61);
            for (var index = level; index < curList.length; index++) {
                preResetReviews[index] = curList[index];
                delete curList[index];
            }
            strippedData.reviewsPerLevel.push(preResetReviews);
        }
        strippedData.reviewsPerLevel.push(curList);
    }

    // strips the review_cache down to what is needed for the current script
    async function stripData() {
        var data = await Promise.all([review_cache.get_reviews(), wkof.ItemData.get_items('assignments, include_hidden')]);

        var strippedData = getBlankStrippedData();
        if (data.length < 1 || data[0].length < 1 || data[0][0].length < 1) return strippedData;

        // get the item stage counts
        strippedData.stagesPerLevel = countStagesPerLevel(data[1]);

        // get the level ups
        strippedData.levelUps = await get_level_ups(data[1]);
        // then determine the resetTimestamps (if any)
        var previousLevel = 0;
        var resetTimestamps = strippedData.levelUps.reduce((resultObj, levelItem) => {
                if (levelItem[0] <= previousLevel) resultObj.push([ levelItem[0], levelItem[1].minTs ]);
                previousLevel = levelItem[0];
                return resultObj;
            }, []);

        // testing
//        var reviews = data[0].slice(0, 5000);
         var reviews = data[0];
        var minDate = new Date(data[0][0][0]);
        minDate.setHours(0,0,0,0);
        var minMs = minDate.getTime();
        startDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        var curYear = 0;
        var curMonth = -1;

        var wkDays = 0;
        var progressCounter = data[0].length;
        var resetToProcess = 0;
        const itemsById = await wkof.ItemData.get_index(await wkof.ItemData.get_items('include_hidden'), 'subject_id');

        var stripFunction = function(item) {
            if (--progressCounter % 100000 == 50000) {
                console.log("Processing... " + progressCounter + " reviews left");
            }
            var nextDateMs = minMs + (wkDays * msInDay);
            while (item[0] >= nextDateMs) {
                var nextReviewDay = getBlankReviewDayObj();
                nextReviewDay.date = nextDateMs;
                var tempDate = new Date(nextReviewDay.date);
                var reviewYear = tempDate.getFullYear();
                if (reviewYear > curYear) {
                    nextReviewDay.year = reviewYear;
                    curYear = reviewYear;
                }
                var reviewMonth = tempDate.getMonth(); // 0-11
                if (reviewMonth != curMonth) {
                    nextReviewDay.month = reviewMonth;
                    curMonth = reviewMonth;
                }
                wkDays++;
                nextDateMs += msInDay;

                nextReviewDay.day = wkDays;
                strippedData.reviewDays.push(nextReviewDay);
            }

            var reviewDay = strippedData.reviewDays[wkDays - 1];
            var resolvedCategory = toCategory(item[2]);
            reviewDay.reviewsPerStage[item[2] - 1]++;  // you never do reviews on locked (-1), unlessoned (0) or burned (9) items, so we push stages 1-8 into array slots 0-7
            reviewDay.reviewsPerCategory[resolvedCategory]++;
            reviewDay.reviewsTotal++;

            var errorCountToAdd = (item[3]+item[4]==0?0:1);
            reviewDay.errorsPerStage[item[2] - 1] += errorCountToAdd;
            reviewDay.errorsPerCategory[resolvedCategory] += errorCountToAdd;
            reviewDay.errorsTotal += errorCountToAdd;

            if (   (resetToProcess < resetTimestamps.length)
                && (resetTimestamps[resetToProcess][1] <= item[0])
               ) {
                processResetToLevel(strippedData, resetTimestamps[resetToProcess][0]);
                resetToProcess++;
            }
            var fullItem = itemsById[item[1]];
            var level = (fullItem && fullItem.data) ? fullItem.data.level : 0;
            var reviewsPerLevel = getReviewsPerLevel(strippedData, level);
            reviewsPerLevel.total++;
            reviewsPerLevel.errors += errorCountToAdd;

            strippedData.lastReviewDate = item[0];
        };

        reviews.forEach(stripFunction);

        cachedStrippedData = strippedData;
        return strippedData;
    }

    // plain copy from the heatmap script - wonder if we can store this somewhere so it can be reused rather than refetched. Also
    // requires retrieval of all the items from wkof.
    // ...and we adapted it. I'm using this method to also determine the exact (as exact as possible) timestamps of resets
    // Get level up dates from API and lesson history
    async function get_level_ups(items) {
        let level_progressions = await wkof.Apiv2.get_endpoint('level_progressions');
        let first_recorded_date = level_progressions[Math.min(...Object.keys(level_progressions))].data.unlocked_at;
        // Find indefinite level ups by looking at lesson history
        let levels = {};
        // Sort lessons by level then unlocked date
        items.forEach(item => {
            if (item.object !== "kanji" || !item.assignments || !item.assignments.unlocked_at || item.assignments.unlocked_at >= first_recorded_date) return;
            let date = new Date(item.assignments.unlocked_at).toDateString();
            if (!levels[item.data.level]) levels[item.data.level] = {};
            // altered : store an object with count and min timestamp instead of just a count
            if (!levels[item.data.level][date]) levels[item.data.level][date] = { minTs: item.assignments.unlocked_at, count: 1 };
            else {
                // altered: store an object with count and min timestamp instead of just a count
                levels[item.data.level][date].count++;
                if (item.assignments.unlocked_at < levels[item.data.level][date].minTs) levels[item.data.level][date].minTs = item.assignments.unlocked_at;
            }
        });
        // Discard dates with less than 10 unlocked
        // then discard levels with no dates
        // then keep earliest date for each level
        for (let [level, data] of Object.entries(levels)) {
            // altered as we now have a object in stead of just a count
            for (let [date, countObj] of Object.entries(data)) {
                if (countObj.count < 10) delete data[date];
            }
            if (Object.keys(levels[level]).length == 0) {
                delete levels[level];
                continue;
            }
            // altered, instead of a resulting date we store date and min timestamp per level
            var minDate = Object.keys(data).reduce((low, curr) => low < curr ? low : curr, Date.now());
            var minData = levels[level][minDate];
            levels[level] = { date: minDate, minTs: Date.parse(minData.minTs) };
        }
        // Map to array of [[level0, date0], [level1, date1], ...] Format
        levels = Object.entries(levels).map(([level, date]) => [Number(level), date]);
        // Add definite level ups from API
        // altered to provide the same object format (date + min Timestamp)
        Object.values(level_progressions).forEach(level => levels.push([level.data.level, { date: new Date(level.data.unlocked_at).toDateString(), minTs: Date.parse(level.data.unlocked_at) }]));
        return levels;
    }

    function countStagesPerLevel(items) {
        return items.reduce((counts, item) => {
                if (item.assignments && !item.assignments.hidden) {
                    var level = item.data.level;
                    if (!counts[level]) counts[level] = { level: level, total: 0, stages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }; // locked, init and 9 stages, shifted 1 up (locked == -1)
                    var stage = item.assignments.srs_stage;
                    counts[level].stages[stage+1]++;
                    counts[level].total++; // total on level
                }
                return counts;
            }, new Array(61));
    }

    // -------------------------------------- //
    // ------------- PROCESSING ------------- //
    // -------------------------------------- //
    var init = [ false, false, false ];
    var graphs = [ "workloadGraph", "levelDifficultyGraph", "accuracyOverTimeGraph" ];
    var currentGraph = 0;
    // determines if the current graph must be redrawn or simply displayed
    function displayGraph() {
        if (!init[currentGraph]) {
            var progressPane = $('#' + graphs[currentGraph]);
            progressPane.removeClass('hidden');

            var dataPoints = toDataPoints(cachedStrippedData);
            var graphPoints = scaleGraph(dataPoints);
            drawGraph(graphPoints);
            init[currentGraph] = true;
        }
        else {
            $('#' + graphs[currentGraph]).removeClass('hidden');
        }
    }

    // inits a blank data point object
    // used in both WLG and AT graphs
    function getBlankWLGATDataPointObj() {
        return { point: 0,
                 year: 0,
                 month: -1,
                 levelUp: 0,
                 nrOfDays: 0,
                 reviewsPerStage: [0, 0, 0, 0, 0, 0, 0, 0],
                 reviewsPerCategory: [0, 0, 0, 0],
                 reviewsTotal: 0,
                 errorsPerStage: [0, 0, 0, 0, 0, 0, 0, 0],
                 errorsPerCategory: [0, 0, 0, 0],
                 errorsTotal: 0
        };
    }

    // retrieves the matching data point object from the array. Inits if not yet existing
    function getWLGATDataPoint(dataPoints, index) {
        if (index >= dataPoints.length) return null;

        if (!dataPoints[index]) {
            dataPoints[index] = getBlankWLGATDataPointObj();
            dataPoints[index].point = index;
        }
        return dataPoints[index];
    }

    // adds the values of two arrays together
    function addArrayTotals(arrayOne, arrayTwo) {
        if (arrayOne == null) return arrayTwo;
        if (arrayTwo == null) return arrayOne;
        if (arrayTwo.length < arrayOne.length) return addArrayTotals(arrayTwo, arrayOne);
        for (var index = 0; index < arrayOne.length; index++) {
            arrayOne[index] += arrayTwo[index];
        }
        return arrayOne;
    }

    function toDataPoints(strippedData) {
        switch(currentGraph) {
            case 0:
                return toWLGDataPoints(strippedData);
            case 1:
                return toLDDataPoints(strippedData);
            case 2:
                return toATDataPoints(strippedData);
            default:
                return [];
        }
    }

    // accumulate reviewdata to data points
    function toWLGDataPoints(strippedData) {

        var reviewDays = strippedData.reviewDays;
        var moveInitialYearLabel = false;
        // chop for startAtDate
        if (option("startAtDate")) {
            var startMs = option("startAtDate").getTime();
            reviewDays = reviewDays.filter((reviewDay) => (reviewDay.date >= startMs));
            moveInitialYearLabel = true;
        }

        var nrOfEntries = reviewDays.length;
        console.log("Scaling for " + nrOfEntries + " review days");
        var daysPerPoint = Math.floor(nrOfEntries / maxWidth);
        if ((nrOfEntries % maxWidth > 0) || (daysPerPoint == 0)) {
            daysPerPoint++;
        }
        var totalPoints = Math.floor(nrOfEntries / daysPerPoint);
        if (nrOfEntries % daysPerPoint > 0) {
            totalPoints++;
        }

        var dataPoints = new Array(totalPoints + 1);
        var dayNr = 0; // can't use reviewDay.day anymore as we may not start at 1. Current approach requires a sorted listed though.
        var cookFunction = function(reviewDay) {
            dayNr++;
            for (var countDay = dayNr; countDay < dayNr + option("runningAverageDays"); countDay++) {
                var xValue = Math.ceil(countDay / daysPerPoint);
                var dataPoint = getWLGATDataPoint(dataPoints, xValue);
                if (!dataPoint) break;
                dataPoint.nrOfDays++;
                dataPoint.reviewsPerStage = addArrayTotals(dataPoint.reviewsPerStage, reviewDay.reviewsPerStage);
                dataPoint.reviewsPerCategory = addArrayTotals(dataPoint.reviewsPerCategory, reviewDay.reviewsPerCategory);
                dataPoint.reviewsTotal += reviewDay.reviewsTotal;

                // add xAxis labels for this point, if any
                if (countDay == dayNr) {
                    if (reviewDay.year != 0) {
                        dataPoint.year = reviewDay.year;
                    }
                    if (reviewDay.month != -1) {
                        dataPoint.month = reviewDay.month;
                    }
                    // when starting at a specific date we may have lost the initial year indicator
                    if (moveInitialYearLabel && dataPoint.point == 1) {
                        dataPoint.year = option("startAtDate").getFullYear();
                    }
                    const searchDate = new Date(reviewDay.date).toDateString();
                    let level = (strippedData.levelUps.find(a=>a[1].date==searchDate) || [undefined])[0];
                    // note that we overwrite any previous level label (if you level up and reset on the same day or on consecutive days that are merged)
                    // because we're only interested in the latest label that goes with this data point
                    if (level) {
                        dataPoint.levelUp = level;
                    }
                }
            }
        };
        reviewDays.forEach(cookFunction);

        // now we have datapointed the xaxis points properly, now do the same for yaxis points
        var dataPointSeries = new Array(dataPoints.length);
        var xAxisYears = new Array();
        var xAxisLevelUps = new Array();
        var yAxisMaxValue = 0;
        var pointFunction = function(dataPoint) {
            if (dataPoint == null) return;

            if (option("showDetailStages")) dataPointSeries[dataPoint.point] = [0, 0, 0, 0, 0, 0, 0, 0];
            else dataPointSeries[dataPoint.point] = [0, 0, 0, 0];

            var divider = dataPoint.nrOfDays;
            for (var index = 0; index < dataPointSeries[dataPoint.point].length; index++) {
                var useArray = dataPoint.reviewsPerCategory;
                if (option("showDetailStages")) useArray = dataPoint.reviewsPerStage;
                var startIndex = 0;
                var endIndex = useArray.length;
                if (option("wlgReverse") || !option("cumulativeReviews")) startIndex = index;
                if (!option("wlgReverse") || !option("cumulativeReviews")) endIndex = index;

                dataPointSeries[dataPoint.point][index] = getArraySum(useArray, startIndex, endIndex) / dataPoint.nrOfDays;
            }
            if (option("wlgReverse")) dataPointSeries[dataPoint.point].reverse();

            if (dataPoint.year != 0) {
                xAxisYears.push([ dataPoint.point, dataPoint.year ]);
            }
            else if (dataPoint.month != -1) {
                xAxisYears.push([ dataPoint.point, -1 * dataPoint.month ]); // month labels are negative numbers
            }

            if (dataPoint.levelUp != 0) {
                xAxisLevelUps.push([ dataPoint.point, dataPoint.levelUp ]);
            }

            yAxisMaxValue = dataPointSeries[dataPoint.point].reduce((max, item) => { return ((item > max) ? item : max); }, yAxisMaxValue);
        };

        dataPoints.forEach(pointFunction);

        var xAxisLabels = new Array();
        xAxisLabels.push({ labelType: labelTime[option("chosenTimeLabels")], labels: xAxisYears });
        xAxisLabels.push({ labelType: labelLevel, labels: xAxisLevelUps }); // by going in the array later, the labels overwrite the previous labels

        // drawing color for the series
        var seriesColors = null;
        if (option("showDetailStages")) seriesColors = [...reviewStageColor];
        else seriesColors = [...reviewCategoryColor];
        if (option("wlgReverse")) seriesColors.reverse();

        return { dataPointSeries: dataPointSeries, seriesColors: seriesColors, xAxisLabels: xAxisLabels, yAxisMaxValue: yAxisMaxValue, graphTitle: "Workload - reviews per day" };
    }

    // sums array values from index to index inclusive
    function getArraySum(array, fromIndexIncl, toIndexIncl) {
        if (!array) return 0;
        const minIndex = Math.min(Math.max(0, fromIndexIncl), array.length);
        const maxIndex = Math.min(array.length, toIndexIncl + 1);
        var result = 0;
        for (var index = minIndex; index < maxIndex; index++) {
            result += array[index];
        }
        return result;
    }

    // accumulate reviewdata to data points
    function toLDDataPoints(strippedData) {

        var maxLevel = 0;
        var maxFinder = function(levelList) {
            if ((levelList.length > 0) && levelList[0] && (levelList[0].total > 0)) {
                console.warn("Ignoring " + levelList[0].total + " reviews for unknown items. This can be an indication that the locally cached item list is corrupt. You can force a reload by removing the 'wkof.file_cache' from the indexedDB (note: this will also reset all script settings to default)");
            }
            var reviewMax = levelList.reduce((max, item) => {
                            // item exists
                return ((   item
                            // item's level is higher than what we've found so far
                         && (item.level > max)
                                // either we don't hide moved items
                         && (   !option("hideMovedItems")
                                // or this level has the required min MIN_REVIEWS_ACTUAL_LEVEL reviews (weeds out single items that were moved to a higher level)
                             || (item.total > MIN_REVIEWS_ACTUAL_LEVEL)
                            )
                        ) ? item.level : max);
            }, 1);

            if (reviewMax > maxLevel) {
                maxLevel = reviewMax;
            }
        }
        strippedData.reviewsPerLevel.forEach(maxFinder);
        console.log("Scaling for " + maxLevel + " levels");

        var dataPoints = new Array(maxLevel + 1);
        var yAxisMaxValue = 0;
        // convert levels by reset series to reset series by level
        var cookFunction = function(levelList) {
            for (var levelNr = 1; levelNr < dataPoints.length; levelNr++) {
                var seriesLevelInfo = levelList[levelNr];
                if (!dataPoints[levelNr]) dataPoints[levelNr] = new Array();
                if (!seriesLevelInfo) {
                    dataPoints[levelNr].push(NOVALUE);
                }
                else {
                    var yValue = 100 * seriesLevelInfo.errors / seriesLevelInfo.total; // error percentage per level
                    dataPoints[levelNr].push(yValue);
                    yAxisMaxValue = Math.max(yValue, yAxisMaxValue);
                }
            }
        };

        strippedData.reviewsPerLevel.forEach(cookFunction);
        // reverse the series to draw them in proper order
        dataPoints.forEach(item => item.reverse());

        var dataPointFillColors = new Array(maxLevel + 1);
        var calculateFillPerPoint = function(stagesPerLevel) {
            if (stagesPerLevel.level <= maxLevel) { // ignore higher level assignments in case of resets
                var fraction = 0;
                var cumulative = 0;
                for (var index = stagesPerLevel.stages.length - 1; index >= 0; index--) {
                    cumulative += stagesPerLevel.stages[index];
                    fraction = cumulative / stagesPerLevel.total;
                    if (fraction >= stageThreshold) {
                        // note that if stage if f.i. Guru2, then we don't count Guru1 items, even though both are colored as Guru... but this is such a small portion that
                        // I dare say it won't matter much. Most important is to get Bur, Enl and Mas correct
                        dataPointFillColors[stagesPerLevel.level] = { stage: index, fraction: fraction };
                        return;
                    }
                }
            }
        };
        strippedData.stagesPerLevel.forEach(calculateFillPerPoint);

        // x axis labels
        var xAxisLevelUps = new Array();
        for (var i = 1; i <= maxLevel; i++) {
            xAxisLevelUps.push([ i, i ]);
        }
        var xAxisLabels = new Array();
        xAxisLabels.push({ labelType: labelLevel, labels: xAxisLevelUps });

        // drawing color for the series
        var seriesColors = [...resetColors];

        return { dataPointSeries: dataPoints, seriesColors: seriesColors, dataPointFillColors: dataPointFillColors, xAxisLabels: xAxisLabels, yAxisMaxValue: yAxisMaxValue, graphTitle: "Level difficulty - error percentage", seriesOpacity: 0.4 };
    }

    // accumulate reviewdata to data points
    function toATDataPoints(strippedData) {

        var reviewDays = strippedData.reviewDays;
        var moveInitialYearLabel = false;
        // chop for startAtDate
        if (option("startAtDate")) {
            var startMs = option("startAtDate").getTime();
            reviewDays = reviewDays.filter((reviewDay) => (reviewDay.date >= startMs));
            moveInitialYearLabel = true;
        }

        var nrOfEntries = reviewDays.length;
        console.log("Scaling for " + nrOfEntries + " review days");
        var daysPerPoint = Math.floor(nrOfEntries / maxWidth);
        if ((nrOfEntries % maxWidth > 0) || (daysPerPoint == 0)) {
            daysPerPoint++;
        }
        var totalPoints = Math.floor(nrOfEntries / daysPerPoint);
        if (nrOfEntries % daysPerPoint > 0) {
            totalPoints++;
        }

        var dataPoints = new Array(totalPoints + 1);
        var dayNr = 0; // can't use reviewDay.day anymore as we may not start at 1. Current approach requires a sorted listed though.
        var cookFunction = function(reviewDay) {
            dayNr++;
            for (var countDay = dayNr; countDay < dayNr + option("runningAverageDays"); countDay++) {
                var xValue = Math.ceil(countDay / daysPerPoint);
                var dataPoint = getWLGATDataPoint(dataPoints, xValue);
                if (!dataPoint) break;
                dataPoint.nrOfDays++;
                dataPoint.reviewsPerStage = addArrayTotals(dataPoint.reviewsPerStage, reviewDay.reviewsPerStage);
                dataPoint.reviewsPerCategory = addArrayTotals(dataPoint.reviewsPerCategory, reviewDay.reviewsPerCategory);
                dataPoint.reviewsTotal += reviewDay.reviewsTotal;
                dataPoint.errorsPerStage = addArrayTotals(dataPoint.errorsPerStage, reviewDay.errorsPerStage);
                dataPoint.errorsPerCategory = addArrayTotals(dataPoint.errorsPerCategory, reviewDay.errorsPerCategory);
                dataPoint.errorsTotal += reviewDay.errorsTotal;

                // add xAxis labels for this point, if any
                if (countDay == dayNr) {
                    if (reviewDay.year != 0) {
                        dataPoint.year = reviewDay.year;
                    }
                    if (reviewDay.month != -1) {
                        dataPoint.month = reviewDay.month;
                    }
                    // when starting at a specific date we may have lost the initial year indicator
                    if (moveInitialYearLabel && dataPoint.point == 1) {
                        dataPoint.year = option("startAtDate").getFullYear();
                    }
                    const searchDate = new Date(reviewDay.date).toDateString();
                    let level = (strippedData.levelUps.find(a=>a[1].date==searchDate) || [undefined])[0];
                    // note that we overwrite any previous level label (if you level up and reset on the same day or on consecutive days that are merged)
                    // because we're only interested in the latest label that goes with this data point
                    if (level) {
                        dataPoint.levelUp = level;
                    }
                }
            }
        };
        reviewDays.forEach(cookFunction);

        // now we have datapointed the xaxis points properly, now do the same for yaxis points
        var dataPointSeries = new Array(dataPoints.length);
        var xAxisYears = new Array();
        var xAxisLevelUps = new Array();
        var yAxisMaxValue = 0;
        var pointFunction = function(dataPoint) {
            if (dataPoint == null) return;

            if (option("showDetailStages")) dataPointSeries[dataPoint.point] = [0, 0, 0, 0, 0, 0, 0, 0];
            else dataPointSeries[dataPoint.point] = [0, 0, 0, 0];

            var divider = dataPoint.nrOfDays;
            for (var index = 0; index < dataPointSeries[dataPoint.point].length; index++) {
                var reviewArray = dataPoint.reviewsPerCategory;
                var errorArray = dataPoint.errorsPerCategory;
                if (option("showDetailStages")) {
                    reviewArray = dataPoint.reviewsPerStage;
                    errorArray = dataPoint.errorsPerStage;
                }
                if (reviewArray[index] == 0) {
                    dataPointSeries[dataPoint.point][index] = NOVALUE;
                }
                else {
                    dataPointSeries[dataPoint.point][index] = 100*(reviewArray[index] - errorArray[index]) / reviewArray[index];
                }
            }

            if (dataPoint.year != 0) {
                xAxisYears.push([ dataPoint.point, dataPoint.year ]);
            }
            else if (dataPoint.month != -1) {
                xAxisYears.push([ dataPoint.point, -1 * dataPoint.month ]); // month labels are negative numbers
            }

            if (dataPoint.levelUp != 0) {
                xAxisLevelUps.push([ dataPoint.point, dataPoint.levelUp ]);
            }

            yAxisMaxValue = dataPointSeries[dataPoint.point].reduce((max, item) => { return ((item > max) ? item : max); }, yAxisMaxValue);
        };

        dataPoints.forEach(pointFunction);

        var xAxisLabels = new Array();
        xAxisLabels.push({ labelType: labelTime[option("chosenTimeLabels")], labels: xAxisYears });
        xAxisLabels.push({ labelType: labelLevel, labels: xAxisLevelUps }); // by going in the array later, the labels overwrite the previous labels

        // drawing color for the series
        var seriesColors = null;
        if (option("showDetailStages")) seriesColors = [...reviewStageColor];
        else seriesColors = [...reviewCategoryColor];

        return { dataPointSeries: dataPointSeries, seriesColors: seriesColors, xAxisLabels: xAxisLabels, yAxisMaxValue: yAxisMaxValue, graphTitle: "Accuracy over time" };
    }


    // ---------------------------------------------- //
    // -------------- DISPLAY ----------------------- //
    // ---------------------------------------------- //
    function add_css() {
        $('head').append(
            `<style id="workload_graph_css">
                 div.wlg_graph {
                     background-color: var(--section-background,#f4f4f4);
                     position: fixed;
                     top: 100px;
                     left: 100px;
                     z-index: 1;
                     border: 1px solid var(--page-background);
                 }
                 .wlg_graph div:not(.wlg_canvas) {
                     position: absolute;
                     right:20px;
                     top:15%;
                     max-width:160px;
                 }
                 div.wlg_graph div {
                     color: var(--text-color);
                 }
                 div.wlg_graph div.wlg_canvas {
                     position: absolute;
                     background-color: var(--page-background);
                     top: 0px;
                     bottom: 0px;
                 }
                 div.wlg_graph div canvas {
                     color: var(--text-color,#000000);
                     --label-color: var(--vocabulary-color,#007700);
                 }
                 div.wlg_infoDiv {
                     font-size: 11px;
                 }
                 div.wlg_graph div input[type='checkbox'] {
                     vertical-align:top;
                 }
                 div.wlg_graph div input.indented {
                     margin-left:15px;
                 }
                 div.wlg_graph div input[maxLength='4'] {
                     width:100px;
                 }
                 div.wlg_graph div input[maxLength='4'].yearInput {
                     width:50px;
                 }
                 div.wlg_graph div input[maxLength='2'] {
                     width:25px;
                 }
                 div.wlg_graph div select {
                     width:100px;
                 }
                 div.wlg_graph div button {
                     cursor:pointer;
                 }
                 div.wlg_graph button.iconButton {
                     cursor:pointer;
                     position:absolute;
                     top: 10px;
                     right: 10px;
                     border: 0px;
                     width: 24px;
                 }
             </style>`);
    }

    const graphDiv = [
        '<div id="workloadGraph" class="wlg_graph"></div>',
        '<div id="levelDifficultyGraph" class="wlg_graph hidden" ></div>',
        '<div id="accuracyOverTimeGraph" class="wlg_graph hidden"></div>'
    ];
    const infoDiv = [
        '<div id="workloadGraphInfoDiv" class="wlg_infoDiv hidden">'
        + 'X-axis: date and level you were at that date<br/> Y-axis: number of reviews completed on the given date<br/>'
        + 'Reviews per stage<br/>'
        + '<span style="color:#dd0093;">Apprentice</span><br/>'
        + '<span style="color:#882d9e;">Guru</span><br/>'
        + '<span style="color:#294ddb;">Master</span><br/>'
        + '<span style="color:#0093dd;">Enlightened</span><br/>'
        + 'Note: burned items are never reviewed and thus not visible in this graph'
        + '</div>',
        '<div id="levelDifficultyGraphInfoDiv" class="wlg_infoDiv hidden">'
        + 'X-axis: level of items in WK<br/> Y-axis: error percentage for items of the given level<br/> Shadow graphs indicate stats prior to your resets.<br/>'
        + 'Note: as items are reviewed until burned, percentages from lower levels can still change. The graph shows a current snapshot.<br/>Highest stage achieved per level<br/>'
        + '<span style="color:#dd0093;">Apprentice</span><br/>'
        + '<span style="color:#882d9e;">Guru</span><br/>'
        + '<span style="color:#294ddb;">Master</span><br/>'
        + '<span style="color:#0093dd;">Enlightened</span><br/>'
        + '<span style="color:#faac05;">Burned</span><br/>'
        + '</div>',
        '<div id="accuracyOverTimeGraphInfoDiv" class="wlg_infoDiv hidden">'
        + 'X-axis: date and level you were at that date<br/> Y-axis: review accuracy (%)<br/>'
        + 'Accuracy per stage<br/>'
        + '<span style="color:#dd0093;">Apprentice</span><br/>'
        + '<span style="color:#882d9e;">Guru</span><br/>'
        + '<span style="color:#294ddb;">Master</span><br/>'
        + '<span style="color:#0093dd;">Enlightened</span><br/>'
        + '</div>'
    ];

    const optionDiv = [
        '<div id="workloadGraphOptionsDiv" class="">'
        + '<input type="checkbox" id="cumulativeWLG" title="Show cumulative reviews" checked> Cumulative reviews</input><br/>'
        + '<input type="checkbox" id="reverseLayers" class="indented" title="Check to put enlightened on the bottom and apprentice at the top"> Reverse layers</input><br/>'
        + '<input type="checkbox" id="fillWLG" class="indented" title="Check to fill the graph, uncheck to use a line graph" checked> Fill graph</input><br/>'
        + '<input type="checkbox" id="detailStagesWLG" title="Split out Apprentice and Guru sub stages"> Detail stages</input><p/>'
        + '<span title="Number of days the running average of reviews is calculated over. A higher number leads to a smoother graph">Running average days</span><br/>'
        + '<input id="runningAverageInputWLG" maxlength="4"/><p/>'
        + '<input type="checkbox" id="startDateWLG" title="Uncheck to display all data"> <span title="Start date of graph in YYYY-MM-DD format">Start graph at date</span><br/>'
        + '<input id="startYearWLG" maxLength="4" class="yearInput" />-<input id="startMonthWLG" maxLength="2" />-<input id="startDayWLG" maxLength="2" /><p/>'
        + '<span title="Frequency of x Axis time labels">Time labels per</span><br/>'
        + '<select id="timeLabelsWLG"><option value="0">year</option><option value="1" selected>quarter</option><option value="2">month</option></select><p/>'
        + '<button onclick="window.adjustWLGOptions()">Redraw</button></div>',

        '<div id="levelDifficultyGraphOptionsDiv" class="">'
        + '<input type="checkbox" id="fillLD" title="Check to fill the graph base on stage progress, uncheck to use a line graph"> Add stage colors</input><br/>'
        + '<input type="checkbox" id="hideMovedItemsLD" title="Hide items that were moved to a higher level you have not yet reached"> Hide moved items</input><p/>'
        + '<button onclick="window.adjustLDOptions()">Redraw</button></div>',

        '<div id="accuracyOverTimeGraphOptionsDiv" class="">'
        + '<input type="checkbox" id="detailStagesAT"  title="Split out Apprentice and Guru sub stages"> Detail stages</input><p/>'
        + '<span title="Number of days the running average of reviews is calculated over. A higher number leads to a smoother graph">Running average days</span><br/>'
        + '<input id="runningAverageInputAT" maxlength="4" /><p/>'
        + '<input type="checkbox" id="startDateAT" title="Uncheck to display all data"> <span title="Start date of graph in YYYY-MM-DD format">Start graph at date</span><br/>'
        + '<input id="startYearAT" maxLength="4" class="yearInput" />-<input id="startMonthAT" maxLength="2" />-<input id="startDayAT" maxLength="2" /><p/>'
        + '<span title="Frequency of x Axis time labels">Time labels per</span><br/>'
        + '<select id="timeLabelsAT"><option value="0">year</option><option value="1" selected>quarter</option><option value="2">month</option></select><p/>'
        + '<button onclick="window.adjustATOptions()">Redraw</button></div>'
    ];
    const optionDivWidth = 180;
    const closeGraphButton = '<button id="closeGraphButton" onclick="window.hideGraph()" title="Close window" class="iconButton"><i class="fa fa-minus"></i></button>';
    const toggleGraphButton = [
        '<button id="workloadGraphButton" onclick="window.toggleGraph(0)" title="Workload" class="iconButton"><i class="fa fa-bar-chart"></i></button>',
        '<button id="levelDifficultyGraphButton" onclick="window.toggleGraph(1)" title="Level Difficulty" class="iconButton"><i class="fa fa-flask"></i></button>',
        '<button id="accuracyOverTimeGraphButton" onclick="window.toggleGraph(2)" title="Accuracy over Time" class="iconButton"><i class="fa fa-percent"></i></button>'
    ];
    const infoGraphButton = [
        '<button id="workloadGraphInfoButton" onclick="window.toggleInfoOnGraph(0)" title="toggle help" class="iconButton"><i class="fa fa-question"></i></button>',
        '<button id="levelDifficultyGraphInfoButton" onclick="window.toggleInfoOnGraph(1)" title="toggle help" class="iconButton"><i class="fa fa-question"></i></button>',
        '<button id="accuracyOverTimeGraphInfoButton" onclick="window.toggleInfoOnGraph(2)" title="toggle help" class="iconButton"><i class="fa fa-question"></i></button>'
    ];
    function hideGraph() {
        $('#' + graphs[currentGraph]).addClass('hidden');
    }
    window.hideGraph = hideGraph;
    function toggleGraph(toGraph) {
        hideGraph();
        currentGraph = toGraph;
        displayGraph();
    }
    window.toggleGraph = toggleGraph;

    function toggleInfoOnGraph(toGraph) {
        if($('#' + graphs[toGraph] + 'InfoDiv').hasClass('hidden')) {
            $('#' + graphs[toGraph] + 'OptionsDiv').addClass('hidden');
            $('#' + graphs[toGraph] + 'InfoDiv').removeClass('hidden');
        }
        else {
            $('#' + graphs[toGraph] + 'InfoDiv').addClass('hidden');
            $('#' + graphs[toGraph] + 'OptionsDiv').removeClass('hidden');
        }
    }
    window.toggleInfoOnGraph = toggleInfoOnGraph;

    // shorthand to parse input
    function parseWithDefault(value, defaultValue) {
        if (isNaN(value) || value == "") {
            return defaultValue;
        }
        return parseInt(value);
    }
    function minToDefault(value, minValue, defaultValue) {
        return (value < minValue) ? defaultValue : value;
    }
    function boundValue(value, minValue, maxValue) {
        return Math.min(Math.max(value, minValue), maxValue);
    }

    const minYear = 2017;
    const minDate = new Date(2017, 7, 1);
    // process new options and redraw
    function adjustWLGOptions() {
        var newDays = parseWithDefault($('#runningAverageInputWLG')[0].value, -1);
        newDays = minToDefault(newDays, 1, defaultOptions.runningAverageDays[0]);
        $('#runningAverageInputWLG')[0].value = newDays;
        setOption("runningAverageDays", newDays);

        setOption("cumulativeReviews", $('#cumulativeWLG').is(":checked"));
        if (!option("cumulativeReviews")) {
            setOption("fillInd", false);
        }
        else {
            setOption("fillInd", $('#fillWLG').is(":checked"));
        }
        setOption("wlgReverse", $('#reverseLayers').is(":checked"));
        setOption("showDetailStages", $('#detailStagesWLG').is(":checked"));

        // startDateWLG startYearWLG startMonthWLG startDayWLG
        // get date items from input if checked
        if ($('#startDateWLG').is(":checked")) {
            var useYear = parseWithDefault($('#startYearWLG')[0].value, -1);
            // minYear-1, maxYear+1, because the minDate/maxDate check will force the proper date without keeping strange dates and only altering the year
            useYear = boundValue(useYear, minYear-1, new Date().getFullYear()+1);
            var useMonth = parseWithDefault($('#startMonthWLG')[0].value, -1);
            useMonth = boundValue(useMonth, 1, 12);
            useMonth--; // Date uses months 0-11
            var useDay = parseWithDefault($('#startDayWLG')[0].value, -1);
            useDay = boundValue(useDay, 1, 31);

            var useDate = new Date(useYear, useMonth, useDay);
            var maxDate = new Date();
            maxDate.setDate(maxDate.getDate() - 7); // roll back a week;
            if (useDate.getTime() > maxDate.getTime()) useDate = maxDate;
            if (useDate.getTime() < minDate.getTime()) useDate = minDate;

            setOption("startAtDate", useDate);
        }
        else {
            setOption("startAtDate", startDate);
        }
        $('#startYearWLG')[0].value = option("startAtDate").getFullYear();
        $('#startMonthWLG')[0].value = option("startAtDate").getMonth() + 1;
        $('#startDayWLG')[0].value = option("startAtDate").getDate();

        setOption("chosenTimeLabels", $('#timeLabelsWLG')[0].value);

        // cache the options for next page load
        cacheOptions();

        init[currentGraph] = false;
        displayGraph();
    }
    window.adjustWLGOptions = adjustWLGOptions;

    // process new options and redraw
    function adjustLDOptions() {
        setOption("stageColorFill", $('#fillLD').is(":checked"));
        setOption("hideMovedItems", $('#hideMovedItemsLD').is(":checked"));

        // cache the options for next page load
        cacheOptions();

        init[currentGraph] = false;
        displayGraph();
    }
    window.adjustLDOptions = adjustLDOptions;

    // process new options and redraw
    function adjustATOptions() {
        var newDays = parseWithDefault($('#runningAverageInputAT')[0].value, -1);
        newDays = minToDefault(newDays, 1, defaultOptions.runningAverageDays[2]);
        $('#runningAverageInputAT')[0].value = newDays;
        setOption("runningAverageDays", newDays);

        setOption("showDetailStages", $('#detailStagesAT').is(":checked"));

        // startDateAT startYearAT startMonthAT startDayAT
        // get date items from input if checked
        if ($('#startDateAT').is(":checked")) {
            var useYear = parseWithDefault($('#startYearAT')[0].value, -1);
            // minYear-1, maxYear+1, because the minDate/maxDate check will force the proper date without keeping strange dates and only altering the year
            useYear = boundValue(useYear, minYear-1, new Date().getFullYear()+1);
            var useMonth = parseWithDefault($('#startMonthAT')[0].value, -1);
            useMonth = boundValue(useMonth, 1, 12);
            useMonth--; // Date uses months 0-11
            var useDay = parseWithDefault($('#startDayAT')[0].value, -1);
            useDay = boundValue(useDay, 1, 31);

            var useDate = new Date(useYear, useMonth, useDay);
            var maxDate = new Date();
            maxDate.setDate(maxDate.getDate() - 7); // roll back a week;
            if (useDate.getTime() > maxDate.getTime()) useDate = maxDate;
            if (useDate.getTime() < minDate.getTime()) useDate = minDate;

            setOption("startAtDate", useDate);
        }
        else {
            setOption("startAtDate", startDate);
        }
        $('#startYearAT')[0].value = option("startAtDate").getFullYear();
        $('#startMonthAT')[0].value = option("startAtDate").getMonth() + 1;
        $('#startDayAT')[0].value = option("startAtDate").getDate();

        setOption("chosenTimeLabels", $('#timeLabelsAT')[0].value);

        // cache the options for next page load
        cacheOptions();

        init[currentGraph] = false;
        displayGraph();
    }
    window.adjustATOptions = adjustATOptions;

    function initOptions() {
        switch (currentGraph) {
            case 0:
                // WLG options
                $('#runningAverageInputWLG')[0].value = options.runningAverageDays[0];

                $('#cumulativeWLG').prop("checked", options.cumulativeReviews[0]);
                $('#fillWLG').prop("checked", options.fillInd[0]);
                $('#reverseLayers').prop("checked", options.wlgReverse[0]);
                $('#detailStagesWLG').prop("checked", options.showDetailStages[0]);

                // startDateWLG startYearWLG startMonthWLG startDayWLG
                if (   (options.startAtDate[0].getFullYear() == startDate.getFullYear())
                    && (options.startAtDate[0].getMonth() == startDate.getMonth())
                    && (options.startAtDate[0].getDate() == startDate.getDate())
                   ) {
                    // no start date selected
                    $('#startDateWLG').prop("checked", false);
                }
                else {
                    $('#startDateWLG').prop("checked", true);
                    $('#startYearWLG')[0].value = options.startAtDate[0].getFullYear();
                    $('#startMonthWLG')[0].value = options.startAtDate[0].getMonth() + 1;
                    $('#startDayWLG')[0].value = options.startAtDate[0].getDate();
                }

                $('#timeLabelsWLG')[0].value = options.chosenTimeLabels[0];
                break;
            case 1:
                // LD options
                $('#fillLD').prop("checked", options.stageColorFill[1]);
                $('#hideMovedItemsLD').prop("checked", options.hideMovedItems[1]);
                break;
            case 2:
                // AT options
                $('#runningAverageInputAT')[0].value = options.runningAverageDays[2];
                $('#detailStagesAT').prop("checked", options.showDetailStages[2]);

                // startDateAT startYearAT startMonthAT startDayAT
                if (   (options.startAtDate[2].getFullYear() == startDate.getFullYear())
                    && (options.startAtDate[2].getMonth() == startDate.getMonth())
                    && (options.startAtDate[2].getDate() == startDate.getDate())
                   ) {
                    // no start date selected
                    $('#startDateAT').prop("checked", false);
                }
                else {
                    $('#startDate').prop("checked", true);
                    $('#startYearAT')[0].value = options.startAtDate[2].getFullYear();
                    $('#startMonthAT')[0].value = options.startAtDate[2].getMonth() + 1;
                    $('#startDayAT')[0].value = options.startAtDate[2].getDate();
                }

                $('#timeLabelsAT')[0].value = options.chosenTimeLabels[2];
                break;
        }
    }

    // indicate the user clicked the button by showing the init... pane - and set up all the graph divs
    function displayProgressPane() {
        for (var index = 0; index < graphs.length; index++) {
            $('.srs-progress').before(graphDiv[index]);
            var graphCanvas = document.createElement("canvas");
            graphCanvas.id = graphs[index] + "Canvas";
            graphCanvas.width = 200;
            graphCanvas.height = 200;
            var graphCanvasDiv = document.createElement("div");
            graphCanvasDiv.classList.add("wlg_canvas");
            graphCanvasDiv.append(graphCanvas);
            graphCanvasDiv.width = 200;
            graphCanvasDiv.height = 200;

            var progressPane = $('#' + graphs[index]);
            progressPane.append(graphCanvasDiv);
        }

        progressPane = $('#' + graphs[currentGraph]);
        progressPane.removeClass('hidden');
        clearGraph("Init..."); // turns out the graph refresh during processing doesn't want to trigger, so we log instead
    }

    // draws a single point on the canvas
    function drawPointBar(ctx, toX, zeroY, toY, xAxisPointSize, mockValue, useDataPointFillColors) {
        if (!useDataPointFillColors || mockValue) return;

        ctx.save();
        ctx.globalAlpha = useDataPointFillColors.fraction;
        ctx.strokeStyle = stageColor[useDataPointFillColors.stage];
        ctx.fillStyle = stageColor[useDataPointFillColors.stage];

        if (xAxisPointSize > 1) {
            ctx.fillRect(toX, toY, xAxisPointSize, (zeroY - toY));
        }
        else {
            ctx.moveTo(toX, zeroY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
        }

        ctx.restore();
    }

    // draws a single point on the canvas
    function drawPoint(ctx, toX, toY, xAxisPointSize, fillIndicator, sameValue, firstPointInd) {
        if (fillIndicator || (!firstPointInd && !sameValue)) {
            ctx.lineTo(toX, toY);
        }
        else {
            ctx.moveTo(toX, toY);
        }
        if (xAxisPointSize > 1) {
            toX += xAxisPointSize - 1;
            if (fillIndicator || !sameValue) {
                ctx.lineTo(toX, toY);
            }
            else {
                ctx.moveTo(toX, toY);
            }
        }
    }

    // clears the current graph and optionally adds progress text
    function clearGraph(text) {
        var graphCanvas = $('#' + graphs[currentGraph] + 'Canvas')[0];
        var ctx = graphCanvas.getContext("2d");
        ctx.save();

        ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.rect(0, 0, graphCanvas.width, graphCanvas.height);
        ctx.stroke();

        if (text) {
            ctx.strokeText(text, xAxisPadding, yAxisPadding);
        }

        ctx.restore();
    }

    // translate review datapoints to graph points
    function scaleGraph(dataPoints) {

        // scaling of axes
        var xAxisMaxSize = dataPoints.dataPointSeries.length;
        var xAxisPointSize = 1;
        if (xAxisMaxSize < minWidth) {
            xAxisPointSize = Math.ceil(minWidth / xAxisMaxSize);
            xAxisMaxSize = xAxisPointSize * dataPoints.dataPointSeries.length;
            if (xAxisPointSize > maxPointSize) {
                xAxisPointSize = maxPointSize;
                xAxisMaxSize = minWidth;
            }
        }
        var yAxisMaxSize = Math.ceil(xAxisMaxSize * 9 / 16); // take a standard aspect ratio
        var yScale = 1;
        var decimalPlaces = 2;
        while (yScale < dataPoints.yAxisMaxValue) {
            yScale *=10;
            decimalPlaces--;
        }
        yScale /= 100;
        decimalPlaces = Math.max(0, decimalPlaces);
        var yAxisMaxValue = Math.ceil(dataPoints.yAxisMaxValue * 1.2 / yScale) * yScale; // let the values climb to abou 80% of the graph
        var yAxisPointValue = yAxisMaxValue / yAxisMaxSize; // not an integer

        // scale the y values of the series
        var graphPointSeries = new Array(dataPoints.dataPointSeries.length);
        for (var index = 0; index < dataPoints.dataPointSeries.length; index++) {
            var dataPoint = dataPoints.dataPointSeries[index];
            if (dataPoint == null) continue;
            graphPointSeries[index] = dataPoint.map((a) => (a == NOVALUE) ? NOVALUE : (a / yAxisPointValue));
        };

        // yAxis labels
        var nrOfDashes = 3;
        var yIndicatorsPer = Math.ceil(yAxisMaxValue / ((nrOfDashes+1) * yScale)) * yScale;
        var yAxisValues = new Array();
        for (var dash = 1; dash <= nrOfDashes; dash++) {
            yAxisValues.push([ ((yIndicatorsPer * dash) / yAxisPointValue), (yIndicatorsPer * dash).toFixed(decimalPlaces) ]);
        }
        var yAxisLabels = new Array();
        yAxisLabels.push({ labelType: labelAll, labels: yAxisValues });

        // return the accumulated graph data for drawing
        return {
            xAxisMaxSize: xAxisMaxSize,
            xAxisPointSize: xAxisPointSize,
            xAxisLabels: dataPoints.xAxisLabels,
            yAxisMaxSize: yAxisMaxSize,
            yAxisPointValue: yAxisPointValue,
            yAxisLabels: yAxisLabels,
            graphPointSeries: graphPointSeries,
            seriesColors: dataPoints.seriesColors,
            dataPointFillColors: dataPoints.dataPointFillColors,
            title: dataPoints.graphTitle,
            seriesOpacity: dataPoints.seriesOpacity
        };
    }

    // display the graph on canvas
    function drawGraph(graphData) {

        // resize and empty the canvas for redrawing
        var graphCanvas = $('#' + graphs[currentGraph] + 'Canvas')[0];
        graphCanvas.width = graphData.xAxisMaxSize + 2*xAxisPadding;
        graphCanvas.height = graphData.yAxisMaxSize + 2*yAxisPadding;
        var canvasDiv = $('#' + graphs[currentGraph] + ' div.wlg_canvas')[0];
        canvasDiv.width = graphData.xAxisMaxSize + 2*xAxisPadding;
        canvasDiv.height = graphData.yAxisMaxSize + 2*yAxisPadding;
        clearGraph();

        var ctx = graphCanvas.getContext("2d");
        if (graphData.graphPointSeries.length < 2) {
            ctx.strokeText("No data", xAxisPadding, yAxisPadding);
            return;
        }
        ctx.save();

        var baseY = graphCanvas.height - yAxisPadding;
        var useDataPointFillColors = null;
        for (var cat = graphData.graphPointSeries[1].length - 1; cat >= 0; cat--) {

            if ((cat > 0) && (graphData.seriesOpacity)) {
                // seriesOpacity is defined only if series beyond the first are 'greyed out'
                ctx.globalAlpha = graphData.seriesOpacity;
            }
            else {
                // first series is always full opacity
                ctx.globalAlpha = 1;
                if ((cat == 0) && option("stageColorFill")) {
                    useDataPointFillColors = graphData.dataPointFillColors;
                }
            }

            var currentX = xAxisPadding;
            var colorIndex = cat % graphData.seriesColors.length;

            ctx.fillStyle = graphData.seriesColors[colorIndex];
            ctx.strokeStyle = graphData.seriesColors[colorIndex];
            ctx.beginPath();
            ctx.moveTo(currentX, baseY);
            currentX++;

            // nb: 0th entry is not a point!
            var endPointIndicator = true;
            for (var pointIndex = 1; pointIndex < graphData.graphPointSeries.length; pointIndex++) {
                var mockValue = (graphData.graphPointSeries[pointIndex][cat] == NOVALUE);
                endPointIndicator = (endPointIndicator || mockValue);
                var currentY = baseY;
                if (!mockValue) {
                    currentY = baseY - graphData.graphPointSeries[pointIndex][cat];
                }
                var sameValue = option("cumulativeReviews") && (graphData.graphPointSeries[pointIndex][cat] == ((cat > 0) ? graphData.graphPointSeries[pointIndex][cat - 1] : 0));
                if (useDataPointFillColors) {
                    drawPointBar(ctx, currentX, baseY, currentY, graphData.xAxisPointSize, mockValue, useDataPointFillColors[pointIndex]);
                }
                drawPoint(ctx, currentX, currentY, graphData.xAxisPointSize, options.fillInd[currentGraph], (sameValue || mockValue), endPointIndicator);
                currentX += graphData.xAxisPointSize;
                endPointIndicator = (endPointIndicator && mockValue);
            }

            if (option("fillInd")) {
                ctx.lineTo(currentX - 1, baseY);
                ctx.lineTo(xAxisPadding, baseY);
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }

        // set context back to default foreground color (css governed)
        var defaultForegroundColor = getComputedStyle(graphCanvas).getPropertyValue("color");
        // default to black
        if (defaultForegroundColor == 'transparent') {
            defaultForegroundColor = '#000000';
        }
        var defaultLabelColor = getComputedStyle(graphCanvas).getPropertyValue("--label-color");
        // default to dark green
        if (defaultLabelColor == 'transparent') {
            defaultLabelColor = '#007700';
        }

        // draw axes
        ctx.strokeStyle = defaultForegroundColor;
        // x-axis
        ctx.beginPath();
        ctx.moveTo(xAxisPadding, baseY);
        ctx.lineTo(xAxisPadding + graphData.xAxisMaxSize, baseY);
        ctx.stroke();
        // y-axis
        ctx.beginPath();
        ctx.moveTo(xAxisPadding, baseY);
        ctx.lineTo(xAxisPadding, baseY - graphData.yAxisMaxSize);
        ctx.stroke();

        var middleCorrection = Math.floor(graphData.xAxisPointSize / 2);
        // x axis labels
        var labelColors = [ defaultLabelColor, defaultForegroundColor ];
        var xColorOffset = labelColors.length - graphData.xAxisLabels.length % labelColors.length;
        for (var index = 0 ; index < graphData.xAxisLabels.length; index++) {
            colorIndex = (xColorOffset + index) % labelColors.length;
            ctx.strokeStyle = labelColors[colorIndex];

            var labelObj = graphData.xAxisLabels[index];
            for (var dashIndex = 0; dashIndex < labelObj.labels.length; dashIndex++) {
                var atX = xAxisPadding + labelObj.labels[dashIndex][0] * graphData.xAxisPointSize - middleCorrection;
                var addDashInd = true;
                var addLabelTextInd = true;
                var overrideLabelText = false;
                if (labelObj.labelType.type == "level") {
                    var levelLabel = parseInt(labelObj.labels[dashIndex][1]);
                    addLabelTextInd = (levelLabel % labelObj.labelType.signal == 0);
                    overrideLabelText = (   ((dashIndex > 0) && (levelLabel <= parseInt(labelObj.labels[dashIndex - 1][1])))   // add label upon reset
                                         || ((dashIndex == 0) && (levelLabel > 1))                                             // add label for first level if not 1 (pre 2017 starters)
                                        );
                }
                else if (labelObj.labelType.type == "time") {
                    var timeLabel = parseInt(labelObj.labels[dashIndex][1]);
                    if (timeLabel < 0) { // postive time labels are years, negative ones are month indicators
                        addDashInd = ((-1 * timeLabel) % labelObj.labelType.signal == 0);
                        addLabelTextInd = false;
                    }
                }

                if (addDashInd) {
                    var dashLength = (graphData.xAxisLabels.length - index - 1) * 15;
                    ctx.beginPath();
                    ctx.moveTo(atX, baseY);
                    ctx.lineTo(atX, baseY + dashLength + (addLabelTextInd ? 10 : 5));
                    ctx.stroke();
                    if (addLabelTextInd || overrideLabelText) {
                        var labelOffset = (labelObj.labels[dashIndex][1] + "").length * 3;
                        ctx.strokeText(labelObj.labels[dashIndex][1], atX - labelOffset, baseY + dashLength + 20);
                    }
                }
            }
        }

        // y axis labels
        var yColorOffset = labelColors.length - graphData.yAxisLabels.length % labelColors.length;
        for (index = 0 ; index < graphData.yAxisLabels.length; index++) {
            colorIndex = (yColorOffset + index) % labelColors.length;
            ctx.strokeStyle = labelColors[colorIndex];

            labelObj = graphData.yAxisLabels[index];
            for (dashIndex = 0; dashIndex < labelObj.labels.length; dashIndex++) {
                var atY = baseY - labelObj.labels[dashIndex][0];
                if (atY < yAxisPadding) break; // no labels above graph size
                var signalInd = true;
                var override = true;
                if (labelObj.labelType.type == "level") {
                    levelLabel = parseInt(labelObj.labels[dashIndex][1]);
                    signalInd = (levelLabel % labelObj.labelType.signal == 0);
                    override = (dashIndex > 0) && (levelLabel <= parseInt(labelObj.labels[dashIndex - 1][1]));
                }
                dashLength = (graphData.yAxisLabels.length - index - 1) * 30;
                ctx.beginPath();
                ctx.moveTo(xAxisPadding, atY);
                ctx.lineTo(xAxisPadding - dashLength - 5, atY); // no long dashes for signal levels
                ctx.stroke();
                if (signalInd || override) {
                    labelOffset = (labelObj.labels[dashIndex][1] + "").length * 7;
                    ctx.strokeText(labelObj.labels[dashIndex][1], xAxisPadding - labelOffset - 6, atY + 3);
                }
            }
        }

        // title
        ctx.font = "bold 24px Arial, sans-serif";
        ctx.fillStyle=defaultLabelColor;
        var titleOffset = graphData.title.length * 6;
        ctx.fillText(graphData.title, Math.floor(graphData.xAxisMaxSize / 2) - titleOffset + xAxisPadding, yAxisPadding - 10);
        ctx.restore();

        // complete the graph window
        var currentGraphDiv = $('#' + graphs[currentGraph]);
        // +20 px for the option div padding
        currentGraphDiv.css('width', graphCanvas.width + optionDivWidth + 20);

        // allow closing of the graph
        if (!$('#' + graphs[currentGraph] + ' #closeGraphButton')[0]) {
            currentGraphDiv.append(closeGraphButton);
        }
        if (!$('#' + graphs[currentGraph] + 'OptionsDiv')[0]) {
            currentGraphDiv.append(optionDiv[currentGraph]);
        }
        if (!$('#' + graphs[currentGraph] + 'InfoDiv')[0]) {
            currentGraphDiv.append(infoDiv[currentGraph]);
        }
        currentGraphDiv.css('height', Math.max(graphCanvas.height, 1.3 * $('#' + graphs[currentGraph] + 'OptionsDiv')[0].offsetHeight));

        // help/info button
        if (!$('#' + graphs[currentGraph] + 'InfoButton')[0]) {
            currentGraphDiv.append(infoGraphButton[currentGraph]);
            $('#' + graphs[currentGraph] + 'InfoButton').css('right', '38px');
        }
        // allow toggling of graph type
        var currentLocation = 38;
        for (index = toggleGraphButton.length - 1; index >= 0; index--) {
            if (index == currentGraph) continue;
            currentLocation +=28;
            if (!$('#' + graphs[currentGraph] + ' #' + graphs[index] + 'Button')[0]) {
                currentGraphDiv.append(toggleGraphButton[index]);
                $('#' + graphs[currentGraph] + ' #' + graphs[index] + 'Button').css('right', currentLocation + 'px');
            }
        }

        initOptions();
    }

    function consoleLog(obj) {
        $.each(obj, function(key, element) {
            console.log('key: ' + key + ', value: ' + element);
        });
    }


})(window.wkof, window.review_cache);