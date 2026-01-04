// ==UserScript==
// @name         Wanikani Level-Up Time Assistant
// @namespace    https://greasyfork.org/en/users/1364747
// @version      1.4.1
// @description  Shows the earliest date and time you can level up if your reviews are correct. Adds an indication if you have items available for lesson/review that are needed to advance your current level.
// @author       Inserio
// @match        https://www.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507407/Wanikani%20Level-Up%20Time%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/507407/Wanikani%20Level-Up%20Time%20Assistant.meta.js
// ==/UserScript==
/* global wkof */
/* jshint esversion: 6 */

window.lu = {};

(function (lu_obj) {
    // ========================================================================
    // Initialization of the Wanikani Open Framework.
    // -------------------------------------------------------------------

    const scriptName = 'Wanikani Level-Up Time Assistant', scriptId = 'level_up_time_assistant', containerId = 'lu-container', wkof_version_needed = '1.0.53';
    if (!window.wkof) {
        if (confirm(scriptName + ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'))
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    if (window.wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(scriptName + ' requires Wanikani Open Framework version ' + wkof_version_needed + '.\nDo you want to be forwarded to the update page?'))
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        return;
    }
    const wkofTurboEventsScriptUrl = 'https://update.greasyfork.org/scripts/501980/1426667/Wanikani%20Open%20Framework%20Turbo%20Events.user.js';

    // ========================================================================
    // Globals
    // -------------------------------------------------------------------

    // TODO: Perhaps make the logging option configurable in a settings menu?
    const config = {
        log: {
            enabled: false,
            detailed: true
        },
        callback: null
    };
    const srs_stages = ['Unlocked', 'Apprentice 1', 'Apprentice 2', 'Apprentice 3', 'Apprentice 4', 'Guru 1', 'Guru 2', 'Master', 'Enlighten', 'Burn'];
    let items_by_type;

    // ========================================================================
    // Startup
    // -------------------------------------------------------------------
    lu_obj.items_with_soonest_assignments = null;
    lu_obj.items_not_passed_with_assignments_available = null;
    install_css();

    wkof.load_script(wkofTurboEventsScriptUrl, /* use_cache */ true);
    wkof.include('ItemData');
    wkof.ready('TurboEvents').then(configureEventHandler);

    function configureEventHandler() {
        wkof.turbo.on.common.dashboard(startup);
    }

    function startup() {
        init_ui();
        wkof.ready('ItemData').then(fetch_items);
    }

    /**
     * Install stylesheet.
     */
    function install_css() {
        if (document.getElementById(scriptId) != null) return;
        const lu_css = `<style id="${scriptId}">
#lu-container{display:flex;align-items:center;justify-content:space-evenly;margin:0 5px 12px 5px;}
#lu-container #lu-arrow-up{height:20px;width:20px;padding:3px;font-size:14px;font-family:"Noto Sans JP","Noto Sans SC",sans-serif;color:white;background-color:darkgray;cursor:default;border-radius:14px;}
#lu-container #lu-arrow-up.levelup-items{background-color:#00ff00;cursor:pointer;animation:lu-pulse 1s infinite;}
.hidden {visibility:hidden;}
@keyframes lu-pulse{
    0%,100%{-ms-transform:scale(1);-o-transform:scale(1);-webkit-transform:scale(1);-moz-transform:scale(1);transform:scale(1);}
    50%{-ms-transform:scale(1.25);-o-transform:scale(1.25);-webkit-transform:scale(1.25);-moz-transform:scale(1.25);transform:scale(1.25);}
}</style>`;
        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', lu_css);
    }

    /**
     * Initialize the user interface.
     */
    function init_ui() {
        if (document.getElementById(containerId) != null) return;
        const lu_html = `<div id="${containerId}" class="hidden"><span id="lu-arrow-up" title="${get_text_for_icon_tooltip()}">&#x2B06;</span><strong>Earliest Level Up: </strong><span id="lu-level-up-date"></span></div>`;
        document.querySelector('.dashboard__review-forecast > .wk-panel--review-forecast > :first-child').insertAdjacentHTML('beforebegin', lu_html);
    }

    // ========================================================================
    // Populate level info from API.
    // -------------------------------------------------------------------
    function fetch_items() {
        // Fetch only radicals and kanji for current level.
        // Include /subjects and /assignments endpoints
        wkof.ItemData.get_items({
            wk_items: {
                options: {
                    assignments: true
                },
                filters: {
                    level: '+0',
                    item_type: 'rad,kan'
                }
            }
        }).then(prepare_items);
    }

    function prepare_items(items) {
        lu_obj.load_time = new Date();

        console.log('😀 Items:', items);
        items_by_type = get_items_by_index(items, 'object');
        // items_by_subject_id = get_items_by_index(items, 'id');

        // Add "is_locked", "earliest_study_date", "current_earliest_study_date", and "earliest_guru_date" properties to the `scriptId` property of items
        // Need to parse radicals first so that locked kanji get the proper dates assigned to them

        add_dates_to_items((items_by_type.radical ? items_by_type.radical : []).concat(items_by_type.kanji));

        // Sort the items by the current_earliest_study_date, then the earliest_guru_date, then the id. This will determine how they appear in the console.
        lu_obj.items = items.sort(get_sort_method(`+${scriptId}.current_earliest_study_date`, `+${scriptId}.earliest_guru_date`, '+id'));

        // Cache these filters for quick lookups
        lu_obj.items_not_locked_and_not_passed = Array.from(get_not_locked_but_not_passed_items(lu_obj.items));
        lu_obj.items_not_passed_with_assignments_available = Array.from(get_not_passed_items_with_available_assignments(lu_obj.items));
        lu_obj.items_with_soonest_assignments = get_next_soonest_study_items(lu_obj.items_not_locked_and_not_passed);

        // Log the results to the console
        log_base_items_stats();

        // Get the level up date and update the UI
        process_items();

        // Setup a callback to fetch new data and re-run the UI updates when current level radicals/kanji become available
        setup_next_reviews_callback();
    }

    function process_items() {
        lu_obj.level_up_date = get_level_up_date();
        let lu_container = document.getElementById('lu-container');
        if (!lu_container)
            return;
        if (lu_container.classList.contains('hidden'))
            lu_container.classList.remove('hidden');
        update_ui();
        let lu_level_up_date = document.getElementById('lu-level-up-date');
        let lu_arrow_up = document.getElementById('lu-arrow-up');
        if (lu_arrow_up)
            lu_arrow_up.onmouseover = function () { update_ui('lu-arrow-up'); };
        if (lu_level_up_date) {
            lu_level_up_date.onmouseover = function () { update_ui('lu-level-up-date'); };
            lu_level_up_date.onclick = function () { config.log.enabled = true; fetch_items(); };
        }
    }

    function update_date_title() {
        let lu_level_up_date = document.getElementById('lu-level-up-date');
        if (!lu_level_up_date) return;
        let dateOutput = format_date_to_standard_output(lu_obj.level_up_date, false);
        let wait_time = format_two_dates_diff_to_minimal_output(lu_obj.level_up_date, lu_obj.load_time, true);
        lu_level_up_date.innerHTML = dateOutput;
        lu_level_up_date.title = (wait_time === 'Now' ? 'Available now' : wait_time) + '\nClick to update data and log results to the console';
    }

    function update_arrow_title() {
        let lu_arrow_up = document.getElementById('lu-arrow-up');
        if (!lu_arrow_up) return;
        let title = '';
        let next_items = lu_obj.items_with_soonest_assignments;
        let item_count = next_items ? next_items.length : 0;
        if (item_count > 0) {
            let review_time = format_date_to_standard_output(next_items[0][scriptId].current_earliest_study_date, true, true);
            if (review_time === 'Now') {
                title = `${item_count} item${item_count === 1 ? ' needed to pass this level is' : 's needed to pass this level are'}` +
                    ' currently available to study\nClick here to proceed to a new session';
                next_items = unique_from(get_next_soonest_study_items(lu_obj.items_not_locked_and_not_passed, next_items));
                item_count = next_items.length;
                if (item_count > 0) {
                    title += '\n\n';
                    review_time = format_date_to_standard_output(next_items[0][scriptId].current_earliest_study_date, true, true);
                }
            }
            if (item_count > 0) {
                title += `The next ${item_count} item${item_count > 1 ? 's' : ''} of the ones needed to pass this level will arrive at:\n${(review_time)}`;
            }
        } else {
            title = get_text_for_icon_tooltip();
        }
        lu_arrow_up.title = title;
        if (lu_obj.items_not_passed_with_assignments_available && lu_obj.items_not_passed_with_assignments_available.length > 0) {
            let destination = lu_obj.items_not_passed_with_assignments_available.find(a => !a.assignments.available_at) ? 'lesson' : 'review';
            lu_arrow_up.onclick = function () { window.location = 'https://www.wanikani.com/subjects/' + destination; };
            lu_arrow_up.classList.add('levelup-items');
        } else {
            lu_arrow_up.onclick = null;
            lu_arrow_up.classList.remove('levelup-items');
        }
    }

    function update_ui(element_id) {
        lu_obj.load_time = new Date();
        if (!element_id || element_id === 'lu-level-up-date')
            update_date_title();
        if (!element_id || element_id === 'lu-arrow-up')
            update_arrow_title();
    }

    function setup_next_reviews_callback() {
        if (config.callback) {
            clearTimeout(config.callback);
            config.callback = null;
        }
        if (!lu_obj.items_with_soonest_assignments || lu_obj.items_with_soonest_assignments.length === 0) return;
        let time_diff = lu_obj.items_with_soonest_assignments[0][scriptId].current_earliest_study_date.getTime() - (new Date()).getTime();
        if (time_diff <= 0) return;
        config.callback = setTimeout(function () {
            config.callback = null;
            let log_enabled = config.log.enabled;
            config.log.enabled = false;
            fetch_items();
            config.log.enabled = log_enabled;
        }, time_diff);
    }

    function log_base_items_stats() {
        if (!config.log.enabled) return;
        const items_not_passed_by_type = get_items_by_index(get_not_passed_items(lu_obj.items), 'object');
        const get_item_name = itm => (itm.data.characters ? itm.data.characters : itm.data.slug);
        const get_item_stage = itm => (itm[scriptId].is_locked ? '🔒' : srs_stages[itm.assignments.srs_stage]);
        const get_next_study = itm => format_date_to_standard_output(itm[scriptId].current_earliest_study_date, true);
        const get_earliest_guru = itm => format_date_to_standard_output(itm[scriptId].earliest_guru_date, true);
        for (const itype of Object.keys(items_not_passed_by_type).sort((a, b) => b.localeCompare(a))) {
            const not_passed_items = items_not_passed_by_type[itype];
            if (!not_passed_items || not_passed_items.length === 0) continue;
            const locked_items = Array.from(get_locked_items(not_passed_items));
            const str = [];
            if (config.log.detailed) {
                const output_table = not_passed_items.map(itm => ({
                    name: get_item_name(itm),
                    stage: get_item_stage(itm),
                    nextStudy: get_next_study(itm),
                    earliestGuru: get_earliest_guru(itm),
                    url: itm.data.document_url
                }));
                output_table.unshift({ name: 'Name', stage: 'SRS Stage', nextStudy: 'Next Study Date', earliestGuru: 'Earliest Guru Date', url: 'URL' });
                const max_name_len = output_table.reduce((a, b) => b.name.length > a ? b.name.length : a, 0) + 1;
                const max_stage_len = output_table.reduce((a, b) => b.stage.length > a ? b.stage.length : a, 0) + 1;
                const max_study_len = output_table.reduce((a, b) => b.nextStudy.length > a ? b.nextStudy.length : a, 0) + 1;
                const max_guru_len = output_table.reduce((a, b) => b.earliestGuru.length > a ? b.earliestGuru.length : a, 0) + 1;
                for (const { name, stage, nextStudy, earliestGuru, url } of output_table) {
                    str.push(name.padEnd(max_name_len, ' ') + '\t' +
                        stage.padEnd(max_stage_len, ' ') + '\t' +
                        nextStudy.padEnd(max_study_len, ' ') + '\t' +
                        earliestGuru.padEnd(max_guru_len, ' ') + '\t' +
                        url);
                }
            }
            console.log('%s%s%o\n%s',
                `${not_passed_items.length} remaining ${itype}${itype === 'radical' && not_passed_items.length > 1 ? 's' : ''} to guru`,
                locked_items.length > 0 ? ` (${locked_items.length} of which are still locked)` : '',
                not_passed_items,
                str.join('\n')
            );
        }
    }

    // ========================================================================
    // Formatting
    // -------------------------------------------------------------------

    function get_text_for_icon_tooltip() {
        let items = lu_obj.items_not_passed_with_assignments_available;
        return (items && items.length > 0 ? `${items.length} item${items.length === 1 ? '' : 's'} needed to level ${(items.length === 1 ? 'is' : 'are')} currently available to study` : '');
    }

    function format_two_dates_diff_to_minimal_output(date, date2, include_seconds) {
        let diff = Math.max(0, Math.trunc(date.getTime() / 1000) - Math.trunc(date2.getTime() / 1000));
        let dd = Math.floor(diff / 86400);
        diff -= dd * 86400;
        let hh = Math.floor(diff / 3600);
        diff -= hh * 3600;
        let mm = Math.floor(diff / 60);
        diff -= mm * 60;
        let ss = diff;
        if (dd > 0) {
            return dd + ' day' + (dd === 1 ? '' : 's') + ', ' + hh + ' hour' + (hh === 1 ? '' : 's') + ', ' + mm + ' min' + (mm === 1 ? '' : 's') + (include_seconds ? ', ' + ss + ' sec' + (ss === 1 ? '' : 's') : '');
        } else if (hh > 0) {
            return hh + ' hour' + (hh === 1 ? '' : 's') + ', ' + mm + ' min' + (mm === 1 ? '' : 's') + (include_seconds ? ', ' + ss + ' sec' + (ss === 1 ? '' : 's') : '');
        } else if (mm > 0 || ss > 0) {
            if (!include_seconds && ss > 30) mm++;
            return mm + ' min' + (mm === 1 ? '' : 's') + (include_seconds ? ', ' + ss + ' sec' + (ss === 1 ? '' : 's') : '');
        } else {
            return 'Now';
        }
    }

    function format_date_to_standard_output(date, include_differential, include_seconds) {
        if (!(date instanceof Date)) date = new Date(date);
        if (date.getTime() === (new Date(0)).getTime()) return 'N/A';
        if (date.getTime() <= lu_obj.load_time.getTime()) return "Now";
        let str = date.toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour12: false, hour: "numeric", minute: "numeric" });
        if (!include_differential) return str;
        return str + ' (' + format_two_dates_diff_to_minimal_output(date, lu_obj.load_time, include_seconds) + ')';
    }

    // ========================================================================
    // Transformers and Helpers
    // -------------------------------------------------------------------

    /**
     * Returns a non-destructive Array of elements that are not found in
     * any of the parameter arrays.
     * Assumes all items have a property named "id"
     *
     * @param {...Array} var_args   Arrays to compare.
     */
    function unique_from(arr1, ...args) {
        if (!args.length) return [];
        let out = [];
        let map = new Map();
        for (let n = 0; n < args.length; n++) {
            let a2 = args[n];
            if (!(a2 instanceof Array))
                throw new TypeError('argument [' + n + '] must be an Array');
            // Add existing id from the array to the map
            for (let i = 0; i < a2.length; i++)
                map.set(a2[i].id, true);
        }
        // Add to the new array all items that aren't included in the map (map lookUp is O(1) complexity)
        for (let i = 0; i < arr1.length; i++)
            if (!map.get(arr1[i].id))
                out.push(arr1[i]);
        return out;
    }

    /**
     * Get an Array sort function with multiple subarray fields.
     *   Prefix letter allows specifying whether to sort ascending "+" or descending "-" (default: ascending)
     *   Splits and recurses properties properly on periods
     *   e.g.
     *    let arr = [{obj:{prop1:'1'}, prop2: 3},{obj:{prop1:'3'}, prop2: 4},{obj:{prop1:'3'}, prop2: 2},{obj:{prop1:'4'}, prop2: 2}];
     *    arr.sort(get_sort_method('+prop2','-obj.prop1'));
     *    // [{obj:{prop1:'4'}, prop2: 2},{obj:{prop1:'3'}, prop2: 2},{obj:{prop1:'1'}, prop2: 3},{obj:{prop1:'3'}, prop2: 4}]
     */
    function get_sort_method() {
        let argsArr = Array.prototype.slice.call(arguments);
        return function (a, b) {
            for (let x in argsArr) {
                let strStart = 1;
                let op = argsArr[x].substring(0, 1);
                if (op !== "-" && op !== "+") { op = "+"; strStart = 0; }
                let prop = argsArr[x].substring(strStart);
                prop = prop.split('.');
                let len = prop.length;
                let i = 0;
                let ax = a;
                let bx = b;
                let cx;
                while (i < len) { ax = ax[prop[i]]; bx = bx[prop[i]]; i++; }
                ax = (typeof ax == "string" ? ax.toLowerCase() : ax / 1);
                bx = (typeof bx == "string" ? bx.toLowerCase() : bx / 1);
                if (op === "-") { cx = ax; ax = bx; bx = cx; }
                if (ax !== bx) { return ax < bx ? -1 : 1; }
            }
        };
    }

    function add_dates_to_items(items) {
        for (const itm of items) {
            if (!itm) continue;
            itm[scriptId] = { is_locked: (!itm.assignments || !itm.assignments.unlocked_at) };
            itm[scriptId].earliest_study_date = (!itm[scriptId].is_locked ?
                new Date((itm.assignments.started_at ?
                    itm.assignments.available_at :
                    itm.assignments.unlocked_at)) :
                get_earliest_unlock_date(itm, items));
            itm[scriptId].current_earliest_study_date = new Date(Math.max(itm[scriptId].earliest_study_date.getTime(), lu_obj.load_time.getTime()));
            itm[scriptId].earliest_guru_date = get_item_guru_date(itm);
        }
    }

    function* get_not_passed_items(items) {
        for (const itm of items)
            if (itm && (!itm.assignments || !itm.assignments.passed_at))
                yield itm;
    }

    function* get_not_locked_but_not_passed_items(items) {
        for (const itm of items)
            if (itm && itm.assignments && itm.assignments.unlocked_at && !itm.assignments.passed_at)
                yield itm;
    }

    function* get_not_passed_items_with_available_assignments(items) {
        for (const itm of items)
            if (itm && itm.assignments && itm.assignments.unlocked_at && !itm.assignments.passed_at && itm[scriptId].current_earliest_study_date.getTime() <= lu_obj.load_time.getTime())
                yield itm;
    }

    function* get_locked_items(items) {
        for (const itm of items)
            if (itm && (!itm.assignments || !itm.assignments.unlocked_at))
                yield itm;
    }

    function get_items_by_index(items, field) {
        const index = {};
        for (const itm of items) {
            if (itm[field] === undefined) { console.debug(`${itm}.${field} was undefined.`); continue; }
            if (index[itm[field]] === undefined) index[itm[field]] = [];
            index[itm[field]].push(itm);
        }
        return index;
    }

    function get_next_soonest_study_items(items) {
        return items.reduce((acc, itm) => {
            let min_date = acc.length > 0 ? acc[0][scriptId].current_earliest_study_date : itm[scriptId].current_earliest_study_date;
            if (itm[scriptId].current_earliest_study_date.getTime() > lu_obj.load_time.getTime() && itm[scriptId].current_earliest_study_date.getTime() < min_date.getTime()) {
                min_date = itm[scriptId].current_earliest_study_date;
                acc.length = 0;
            }
            if (itm[scriptId].current_earliest_study_date.getTime() <= lu_obj.load_time.getTime() || itm[scriptId].current_earliest_study_date.getTime() === min_date.getTime())
                acc.push(itm);
            itm[scriptId].earliest_guru_date = get_item_guru_date(itm);
            return acc;
        }, []);
    }

    /**
     * Gets the earliest date that the provided item can be unlocked if all components are gurued as soon as possible
     */
    function get_earliest_unlock_date(item, items) {
        let min_date;
        for (const id of item.data.component_subject_ids) {
            const radical = items.find(itm => itm.id === id);
            if ((radical) && (!min_date || radical[scriptId].earliest_guru_date.getTime() > min_date.getTime()))
                min_date = new Date(radical[scriptId].earliest_guru_date);
        }
        return min_date;
    }

    /**
     * Calculate item guru date
     * TODO: Double-check whether the next guru time should be rounded up to the nearest hour
     */
    function get_item_guru_date(item) {
        let hours_to_guru = 0;
        if (!item || !item[scriptId] || !item[scriptId].current_earliest_study_date && (!item.assignments || !item.assignments.unlocked_at))
            return new Date(0); // This is mostly for debugging. If you see the 12/31/1969 date anywhere, this is where it went wrong.
        if (item.assignments && item.assignments.passed_at)
            return new Date(item.assignments.passed_at);
        switch ((item.assignments ? item.assignments.srs_stage : 0) || 0) {
            case 0: hours_to_guru += 4 + 8 + 23 + 47; break;
            case 1: hours_to_guru += 8 + 23 + 47; break;
            case 2: hours_to_guru += 23 + 47; break;
            case 3: hours_to_guru += 47; break;
        }
        // Add the hours to the available date, or the unlock date if the item is locked, or current date something went wrong
        // Create a new date object so we don't modify the existing one
        const earliest_guru_date = (item[scriptId].current_earliest_study_date.getTime() > lu_obj.load_time.getTime() ?
            new Date(item[scriptId].current_earliest_study_date) :
            new Date(lu_obj.load_time));
        earliest_guru_date.setHours(earliest_guru_date.getHours() + hours_to_guru);
        return earliest_guru_date;
    }

    /**
     * Get earliest possible level up date
     * Calculated by sorting the kanji by earliest possible guru date and taking the time from the 90% to last kanji
     */
    function get_level_up_date() {
        if (!items_by_type.kanji) return new Date(0);
        let kanji_items = items_by_type.kanji.sort((a, b) => a[scriptId].earliest_guru_date.getTime() - b[scriptId].earliest_guru_date.getTime());
        return new Date(kanji_items[Math.ceil(kanji_items.length * 0.9) - 1][scriptId].earliest_guru_date);
    }

})(window.lu);