// ==UserScript==
// @name         Wanikani: Expected Daily Number of Reviews
// @namespace    Wanikani: Expected Daily Number of Reviews
// @version      1.0.5
// @description  Displays the expected number of daily reviews given the current SRS distribution
// @author       Kumirei
// @match        https://www.wanikani.com
// @match        https://www.wanikani.com/dashboard
// @include      *preview.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39195/Wanikani%3A%20Expected%20Daily%20Number%20of%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/39195/Wanikani%3A%20Expected%20Daily%20Number%20of%20Reviews.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

;(function () {
    //check that the Wanikani Framework is installed
    var script_name = 'Expected Daily Number of Reviews'
    if (!window.wkof) {
        if (
            confirm(
                script_name +
                    ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?',
            )
        )
            window.location.href =
                'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549'
        return
    }
    //if it's installed then do the stuffs
    wkof.include('ItemData')
    wkof.ready('ItemData').then(fetch_items)

    //retrieves the data
    function fetch_items() {
        wkof.ItemData.get_items('subjects,assignments').then(function (items) {
            var srs_counts = {}
            var by_srs = wkof.ItemData.get_index(items, 'srs_stage')
            Object.keys(by_srs).forEach(function (srs_name) {
                srs_counts[srs_name] = by_srs[srs_name].length
            })
            display_info(srs_counts)
        })
    }

    //adds the info to the dashboard
    function display_info(srs_counts) {
        var daily_count = 0
        var srs_intervals = [0, 0.5, 1, 1, 2, 7, 14, 30, 120, 0]
        //This list means that for each SRS level this is how many days it takes until the item comes back
        //For example: only 1/30 of master items are expected to be reviewed in any given day
        //Notable figures
        //Lessons: 0 days (they are not accounted for)
        //Apprentice 1: 0.5 days (they come back as Apprentice 2 and will count as two reviews)
        //Burned: 0 days
        for (var i = 1; i < 9; i++) {
            daily_count += (srs_counts[i] || 0) / srs_intervals[i]
        }
        daily_count = Math.round(daily_count)
        $('head').append(
            '<style id="dailyExpectedCss">' +
                '    .review-status>ul>li {border-left: 0 !important;}' +
                '    .review-status .timeago {height: auto !important; overflow-x: visible !important; white-space: normal !important;}' +
                '    .progress-and-forecast .expected-daily {opacity: 0.7; font-size: 1rem; float: right; line-height: 30px;}' +
                '</style>',
        )
        if ($('.progress-and-forecast').length)
            $('.wk-panel--review-forecast .wk-panel__header').append(
                '<span class="expected-daily">' + daily_count + ' Expected Daily</span>',
            )
        else
            $('.review-status > ul').append(
                '<li class="expected-daily"><span>' +
                    daily_count +
                    '</span><i class="icon-inbox"></i> Expected Daily</li>',
            )
        set_header_width()
    }

    function set_header_width() {
        var header_count = $('.dashboard section.review-status ul li').length
        var width = 100 / header_count - 0.1
        $('.dashboard section.review-status ul li').css('width', width + '%')
    }
})()
