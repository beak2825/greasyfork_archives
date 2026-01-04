// ==UserScript==
// @name         CS-Dashboard-Fix-Reload-Bug
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix the reload bug so it shows today's stats instead of an empty page
// @author       my-cs-account
// @match        https://work.crowdsurfwork.com/reports/work_data/*
// @downloadURL https://update.greasyfork.org/scripts/421793/CS-Dashboard-Fix-Reload-Bug.user.js
// @updateURL https://update.greasyfork.org/scripts/421793/CS-Dashboard-Fix-Reload-Bug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mdy_re = /^(\d?\d)\/(\d?\d)\/(\d\d\d\d)$/;
    let start_date_input;
    let end_date_input;

    function get_input_elements()
    {
        start_date_input = document.getElementById('start_date_range');
        end_date_input = document.getElementById('end_date_range');
    }

    function same_start_and_end_date()
    {
        if (null == start_date_input || null == end_date_input)
        { return false; }

        return start_date_input.value === end_date_input.value;
    }

    function mdy_to_yyyymmdd(mdy)
    {
        let result = mdy.match(mdy_re);
        if (!result) return mdy;

        let m = zero_pad(result[1]);
        let d = zero_pad(result[2]);
        let y = result[3];

        return y + '-' + m + '-' + d;
    }

    function zero_pad(value)
    {
        return ('0' + value).slice(-2);
    }

    function date_to_yyyymmdd(date)
    {
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth() + 1; // 0-based :-p
        let day = date.getUTCDate();

        return year + '-' + zero_pad(month) + '-' + zero_pad(day);
    }

    function set_today_and_tomorrow()
    {
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        // if there's a way to get JavaScript to format dates in yyyy-mm-dd format automatically, I couldn't find it
        start_date_input.value = mdy_to_yyyymmdd(today.toLocaleDateString('en-US', {timeZone: 'America/Los_Angeles'}));
        end_date_input.value = mdy_to_yyyymmdd(tomorrow.toLocaleDateString('en-US', {timeZone: 'America/Los_Angeles'}));
    }

    function add_a_day_to_end_date()
    {
        // get current end date
        let end_date = new Date(end_date_input.value);

        // add a day to it, and put it back in the end date input
        end_date.setDate(end_date.getDate() + 1);
        end_date_input.value = date_to_yyyymmdd(end_date);
    }

    function trigger_filter()
    {
        let filter_button = document.getElementById('apply_filter');
        if (null == filter_button) return;
        filter_button.click();
    }

    function script_init()
    {
        if (document.readyState !== 'complete') return false;

        get_input_elements();
        if (same_start_and_end_date())
        {
            // switch to add_a_day_to_end_date() to go back to old way
            //add_a_day_to_end_date();
            set_today_and_tomorrow();
            trigger_filter();
            //console.log('CS-Dashboard-Fix-Reload-Bug script completed');
        }

        return true;
    }

    if (!script_init())
    { document.addEventListener('readystatechange', (event) => script_init()); }

})();