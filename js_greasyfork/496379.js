// ==UserScript==
// @name         WKStats Levelup Fix
// @namespace    https://greasyfork.org/en/users/11878
// @version      2.0.2
// @description  Fix weird issues with the levelups on wkstats that are assumed to be caused by new additions of kanji to levels
// @author       Inserio
// @match        https://www.wkstats.com/progress/dashboard
// @match        https://www.wkstats.com/progress/level-up
// @match        https://www.wkstats.com/progress/projections
// @match        https://www.wkstats.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wkstats.com
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496379/WKStats%20Levelup%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/496379/WKStats%20Levelup%20Fix.meta.js
// ==/UserScript==
/*global wkof, wkdata, wkstats, calc_levelups, log, yyyymmdd, duration, wklogs*/
(function() {
    'use strict';
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    function init() {
        const calc_stats = wkof.support_files['calc_stats.js'];
        if (calc_stats === undefined || calc_stats === null || !calc_stats.includes('1.0.7')) // only run on this version
            return;
        wkof.wait_state(/* state_var */ "wkof.wkstats.levelups",/* value */ "ready",/* callback */ overwriteFunction,/* persistent */ false);
    }

    function overwriteFunction() {
        console.log('Overriding the calc_levelups() function definition');
        // eslint-disable-next-line no-global-assign
        calc_levelups = function() {
            wklogs['levelups'].length = 0; // clear existing logs (comment out if you want to compare results with the default version, which gets run first)
            log('levelups', 'Overriding previous data of calc_levelups() with modified version');
            let level_times = wkstats.level_times = [];

            // For each level, initialize a valid range of possible level times (initial = any time)
            for (let level = 1; level <= wkof.user.subscription.max_level_granted; level++) {
                level_times[level] = {
                    min: new Date(0),
                    max: wkdata.load_time,
                    dates: [],
                    source: 'unknown',
                };
            }

            // Using level resets, throw out old level start times (by marking the min start time)
            for (let reset_idx = 0; reset_idx < wkdata.resets.length; reset_idx++) {
                let reset = wkdata.resets[reset_idx];
                let reset_time = new Date(reset.confirmed_at);
                for (let level = reset.target_level; level <= wkof.user.level; level++) {
                    let level_time = level_times[level];

                    // Ignore resets that happened before this level-up.
                    if (reset_time < level_time.min) continue;

                    // Update the min start time.
                    level_time.min = reset_time;
                    delete level_times[level].reset_time;
                }
                level_times[reset.target_level].reset_time = reset_time;
            }

            // Using the newest levelup record for each level, set known start times.
            let oldest_levelup = {index: -1, time: new Date('2999-01-01')};
            for (let levelup_idx = 0; levelup_idx < wkdata.levelups.length; levelup_idx++) {
                let levelup = wkdata.levelups[levelup_idx];
                let level = levelup.level;
                if (level > wkof.user.level) continue;
                let unlocked_time = new Date(levelup.unlocked_at);
                let level_time = level_times[level];

                // Check if this is the oldest recorded level-up, which may be invalid.
                if (unlocked_time < oldest_levelup.time) {
                    oldest_levelup = {index: levelup_idx, time: unlocked_time, level: level};
                }

                // Ignore levelups that were invalidated by a reset.
                if (unlocked_time < level_time.min) continue;

                // Update the level start time.
                level_time.min = unlocked_time;
                level_time.source = 'APIv2 level_progressions';
                if (!levelup.abandoned_at && levelup.passed_at) {
                    level_time.max = new Date(levelup.passed_at);
                } else if (level === wkof.user.level) {
                    level_time.max = new Date();
                }
            }

            let items = wkdata.items;
            let level_progressions = wkdata.levelups;
            let first_recorded_date = level_progressions[Math.min(...Object.keys(level_progressions))].unlocked_at;
            // Find indefinite level ups by looking at lesson history

            // Sort lessons by level then unlocked date
            items.forEach((item) => {
                if (
                    (item.object !== 'kanji' && item.object !== 'radical') ||
                    !item.assignments ||
                    !item.assignments.unlocked_at ||
                    item.assignments.unlocked_at >= first_recorded_date
                )
                    return;
                let date = new Date(item.assignments.unlocked_at);
                if (!level_times[item.data.level]) {
                    level_times[item.data.level] = {};
                }
                if (!level_times[item.data.level].dates[date.toDateString()]) {
                    level_times[item.data.level].dates[date.toDateString()] = [date];
                }
                else {
                    level_times[item.data.level].dates[date.toDateString()].push(date);
                }
            });
            // Discard dates with less than 10 unlocked
            // then discard levels with no dates
            // then keep earliest date for each level
            for (let [level, {min, max, dates, source}] of Object.entries(level_times)) {
                for (let [date, data] of Object.entries(dates)) {
                    if (data.length < 10)
                        delete dates[date];
                }
                if (Object.keys(level_times[level].dates).length === 0) {
                    delete level_times[level].dates;
                    continue;
                }
                //level_times[level].min = Object.values(dates).reduce((low, curr) => (low < curr ? low : curr), Date.now()).sort((a, b) => (a.getTime() - b.getTime()))[0];
                level_times[level].min = Object.values(dates).reduce((acc,item)=>{let smallest=item.reduce((a,b)=>a<b?a:b);return acc<smallest ? acc : smallest;}, new Date());
            }
            // Map to array of [[level0, date0], [level1, date1], ...] Format
            //levels = Object.entries(levels).map(([level, date]) => [Number(level), date]);

            // Add definite level ups from API
            Object.values(level_progressions).forEach(lev => {
                                                      if (level_times[lev.level].source === 'APIv2 level_progressions') return;
                                                      level_times[lev.level] = {
                                                          min: new Date(lev.unlocked_at),
                                                          max: (lev.passed_at ? new Date(lev.passed_at) : wkdata.load_time),
                                                          source: 'APIv2 level_progressions'
            };});

            for (let level = 1; level <= wkof.user.level; level++) {
                let level_data = level_times[level];
                if (level_data.source === 'APIv2 level_progressions') continue;
                if (level < level_times.length - 1) {
                    let next_level_data = level_times[level+1];
                    if (level_data.max.getTime() === wkdata.load_time.getTime())
                        level_data.max = next_level_data.min;
                }
            }

            // Calculate durations
            let durations = wkstats.level_durations = [];
            for (let level = 1; level <= wkof.user.level; level++) {
                let level_time = level_times[level];
                durations[level] = (level_time.max - level_time.min) / 86400000;
            }

            log('levelups','--[ Level-ups ]----------------');
            let level_durations = wkstats.level_durations;
            // Log the current level statuses.
            log('levelups','Started: '+yyyymmdd(wkof.user.started_at));
            if (wkof.user.restarted_at) {
                log('levelups','Restarted: '+yyyymmdd(wkof.user.restarted_at));
            }
            for (let level = 1; level <= wkof.user.level; level++) {
                let level_time = level_times[level];
                let level_duration = level_durations[level];
                if (level_time.reset_time) {
                    log('levelups','Reset');
                }
                // Flag any unusual level durations.
                if (level < wkof.user.level && (level_duration < 3.0 || level_duration > 2000))
                    log('levelups','###################');
                log('levelups','Level '+level+': ('+yyyymmdd(level_time.min)+' - '+yyyymmdd(level_time.max)+') - '+
                    duration(level_duration)+' (source: '+level_time.source+')');
            }
            wkof.set_state('wkof.wkstats.levelups', 'ready');
        };
        // Immediately run in order to overwrite all of the configurations from the default run
        calc_levelups();
    }
})();
