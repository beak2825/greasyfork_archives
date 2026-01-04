// ==UserScript==
// @name         Wanikani: Critical Review Countdown
// @namespace    Wanikani: Critical Review Countdown
// @version      1.0.7.
// @description  Displays time until the next review needed to pass level as soon as possible.
// @author       Chris Pitman
// @include      https://www.wanikani.com/
// @include      https://www.wanikani.com/dashboard*
// @include      https://preview.wanikani.com/
// @include      https://preview.wanikani.com/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392851/Wanikani%3A%20Critical%20Review%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/392851/Wanikani%3A%20Critical%20Review%20Countdown.meta.js
// ==/UserScript==

(function() {
    //check that the Wanikani Framework is installed
    var script_name = 'Critical Review Countdown';
    if (!window.wkof) {
            if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
                    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            return;
    }
    //if it's installed then do the stuffs
    else {
            // Include the Menu module, and wait for it to be ready.
            wkof.include('Apiv2');
            wkof.ready('Apiv2')
                    .then(fetch_data);
    }

    //fetches and processes the level's unlock date
    function fetch_data(data) {
        wkof.Apiv2.fetch_endpoint('user').then(function (response) {
            var level = response.data.level;

            var assignment_filters = {levels: [level], subject_types: ['radical', 'kanji']};
            wkof.Apiv2.fetch_endpoint('assignments', {filters: assignment_filters}).then(function (ass_response) {
                //Missing Radicals
                var radicals = ass_response.data.filter((item) => item.data.subject_type == 'radical')
                .sort((a, b) => a.data.srs_stage < b.data.srs_stage ||
                    (a.data.srs_stage == b.data.srs_stage && a.data.available_at > b.data.available_at) ?
                    1 : -1);

                var last_radical = radicals.length > 0 ? radicals[radicals.length-1] : false;
                if (!last_radical || last_radical.data.passed) {
                    var kanji = ass_response.data.filter((item) => item.data.subject_type == 'kanji')
                                .sort((a, b) => a.data.srs_stage < b.data.srs_stage ||
                                    (a.data.srs_stage == b.data.srs_stage && a.data.available_at > b.data.available_at) ?
                                    1 : -1);

                    var critical_kanji_count = Math.ceil(kanji.length * .9);
                    var critical_kanji = kanji[critical_kanji_count-1];

                    console.log(critical_kanji);

                    if (critical_kanji.data.available_at) {
                        display_critical_countdown(critical_kanji.data.available_at);
                    } else {
                        display_lesson_notice();
                    }
                } else if (last_radical.data.available_at) {
                    display_critical_countdown(last_radical.data.available_at);
                } else {
                    display_lesson_notice();
                }
            })
        });
    }

    function set_header_width() {
        var header_count = $('.dashboard section.review-status ul li').length;
        var width = (100/header_count) - .1;
        $('.dashboard section.review-status ul li').css('width', width + '%');
    }

    function display_lesson_notice() {
        if (!$('.lesson-notice').length) {
                var elem = document.createElement('li');
                elem.className = "lesson-notice";
                elem.innerHTML = '<span>Complete Lessons!</span><i class="icon-time"></i> Next Critical Review';
                $('.next').after(elem);

                set_header_width();
        }
    }

    function display_critical_countdown(available_at) {
            if (!$('.critical-countdown').length) {
                    var elem = document.createElement('li');
                    elem.className = "critical-countdown";
                    elem.innerHTML = '<time class="timeago" datetime="' + available_at + '" data-show-past="false">' + jQuery.timeago(available_at) + '</time><i class="icon-time"></i> Next Critical Review';
                    $('.next').after(elem);

                    set_header_width();
            }
            else {
                    $('.critical-countdown > time')[0].attr('datetime', available_at);
            }
    }
})();