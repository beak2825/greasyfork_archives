// ==UserScript==
// @name          WaniKani Review Hover Details
// @namespace     https://www.wanikani.com
// @description   Show extensive breakdown of review count
// @author        Kumirei
// @version       1.1.1
// @include       /^https://(www|preview).wanikani.com*/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/404252/WaniKani%20Review%20Hover%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/404252/WaniKani%20Review%20Hover%20Details.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function(wkof) {
    let header = document.getElementsByClassName('global-header')[0];
    if (!header) return;

    // Make sure WKOF is installed
    if (!wkof) {
        var response = confirm('WaniKani Review Hover Details script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    // Run script
    wkof.include('Apiv2,ItemData');
    wkof.ready('Apiv2,ItemData')
        .then(fetch_data)
        .then(count_reviews)
        .then(install_element);

    // Fetches the current reviews and the item database
    function fetch_data() {
        return fetch_reviews().then(fetch_subjects).then(combine_reviews_subjects);
    }

    // Fetches the current review queue
    function fetch_reviews() {
        return wkof.Apiv2.fetch_endpoint('summary').then(reviews=>reviews.data.reviews[0].subject_ids);
    }

    // Fetches the item database
    function fetch_subjects(reviews) {
        return wkof.ItemData.get_items('assignments').then(assignments=>[reviews, assignments]);
    }

    // Retrieves info from the data base and maches with the current review items
    function combine_reviews_subjects(data) {
        let [reviews, assignments] = data;
        let items = {};
        for (let i=0; i<reviews.length; i++) items[reviews[i]] = {};
        for (let i=0; i<assignments.length; i++) {
            let ass = assignments[i];
            if (items[ass.id]) items[ass.id] = {type: ass.object.slice(0,3), srs: ["Ini", "App", "App", "App", "App", "Gur", "Gur", "Mas", "Enl", "Bur"][ass.assignments.srs_stage], level: ass.data.level};
        }
        return items;
    }

    // Find the counts that are to be presented
    function count_reviews(items) {
        let counts = {
            total: 0,
            type: {rad: 0, kan: 0, voc: 0,},
            srs: {
                App: {total: 0, rad: 0, kan: 0, voc: 0,},
                Gur: {total: 0, rad: 0, kan: 0, voc: 0,},
                Mas: {total: 0, rad: 0, kan: 0, voc: 0,},
                Enl: {total: 0, rad: 0, kan: 0, voc: 0,},
            },
            levels: {},
        };
        for (let i=1; i<=60; i++) counts.levels[i] = {total: 0, rad: 0, kan: 0, voc: 0, App: 0, Gur: 0, Mas: 0, Enl: 0,};
        for (let id in items) {
            let item = items[id];
            counts.total++;
            counts.type[item.type]++;
            counts.srs[item.srs].total++;
            counts.srs[item.srs][item.type]++;
            counts.levels[item.level].total++;
            counts.levels[item.level][item.type]++;
            counts.levels[item.level][item.srs]++;
        }
        return counts;
    }

    // Present data
    function install_element(counts) {
        install_css();
        let levels = '', level_count = 0, level_cum = 0;
        for (let i=1; i<=60; i++) {
            if (counts.levels[i].total == 0) continue;
            level_cum += counts.levels[i].total;
            levels += table_row(counts, 'levels', i, level_cum);
            level_count++;
        }
        let HTML = `
        <div id="review_hover_details" class="${level_count>=53?"smallest":level_count>=45?"smaller":level_count>=40?"small":level_count>30?"smol":""}">
            <table>
                <tr class="table-header"><th></th><th>Tot</th><th>Rad</th><th>Kan</th><th>Voc</th></tr>
                ${table_row(counts, 'srs', 'App')}
                ${table_row(counts, 'srs', 'Gur')}
                ${table_row(counts, 'srs', 'Mas')}
                ${table_row(counts, 'srs', 'Enl')}
                <tr><th>Tot</th><td>${counts.total}</td><td>${counts.type.rad}</td><td>${counts.type.kan}</td><td>${counts.type.voc}</td></tr>
            </table>
            <table>
                <tr class="table-header"><th>Lvl</th><th>Tot</th><th>Rad</th><th>Kan</th><th>Voc</th><th>App</th><th>Gur</th><th>Mas</th><th>Enl</th><th>Cum</th></tr>
                ${levels}
            </table>
        </div>
        `;
        document.getElementsByClassName('navigation-shortcut--reviews')[0].insertAdjacentHTML('beforeend', HTML);
        document.getElementsByClassName('lessons-and-reviews__reviews-button')[0].insertAdjacentHTML('beforeend', HTML);
    }

    function table_row(counts, table_type, row_type, cumulative) {
        let count = counts[table_type][row_type];
        switch (table_type) {
            case ('type'): return `<tr><th>${row_type.slice(0,1).toUpperCase()+row_type.slice(1)}</th>${table_cell(count)}</tr>`;
            case ('srs'): return `<tr><th>${row_type}</th>${table_cell(count.total) + table_cell(count.rad) + table_cell(count.kan) + table_cell(count.voc)}</tr>`;
            case ('levels'): return `<tr><th>${row_type}</th>${table_cell(count.total) + table_cell(count.rad) + table_cell(count.kan) + table_cell(count.voc) + table_cell(count.App) + table_cell(count.Gur) + table_cell(count.Mas) + table_cell(count.Enl) + table_cell(cumulative)}</tr>`;
        }
    }

    function table_cell(count) {
        return '<td data-count="'+count+'">'+count+'</td>';
    }

    function install_css() {
        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
        <style id="ReviewHoverDetailsCSS">
        .navigation-shortcut--reviews {
            position: relative;
        }
        .navigation-shortcut--reviews:hover #review_hover_details,
        #review_hover_details:hover,
        .lessons-and-reviews__reviews-button:hover #review_hover_details {
            display: table;
        }
        .lessons-and-reviews__reviews-button #review_hover_details {
            top: 100%;
        }
        #review_hover_details {
            display: none;
            position: absolute;
            padding: 10px;
            border-radius: 5px;
            background-color: #4d4d4d !important;
            width: max-content;
            text-align: center;
            margin-top: 10px;
            z-index: 11;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 2px 2px rgba(0,0,0,0.3);
        }
        #review_hover_details::before {
            position: absolute;
            border-bottom: 20px solid #4d4d4d;
            border-right: 20px solid transparent;
            border-left: 20px solid transparent;
            content: " ";
            top: -10px;
            transform: translateX(-50%);
        }
        #review_hover_details table tr:nth-child(2n+3) {
            background-color: rgba(240, 240, 240, 0.15) !important;
        }
        #review_hover_details table:not(:last-child) {
            margin-bottom: 20px;
        }
        #review_hover_details table tr:first-child th {
            border-bottom: 1px solid rgb(240, 240, 240);
            color: rgb(240, 240, 240);
        }
        #review_hover_details table:first-child tr:last-child * {
            border-top: 1px solid rgb(240, 240, 240);
        }
        #review_hover_details th {
            color: rgb(240, 240, 240);
            width: 30px;
        }
        #review_hover_details td {
            color: #ddd;
        }
        #review_hover_details table tr :first-child,
        #review_hover_details table tr :nth-child(2),
        #review_hover_details table:nth-child(2) tr :nth-child(5),
        #review_hover_details table:nth-child(2) tr :nth-child(9) {
            border-right: 1px solid white;
        }
        #review_hover_details td[data-count="0"] {
            color: transparent;
        }
        #review_hover_details {
            font-size: 14px;
            line-height: 20px;
            font-weight: normal;
        }
        #review_hover_details.smol {
            line-height: 16px;
        }
        #review_hover_details.small {
            font-size: 12px;
            line-height: 14px;
        }
        #review_hover_details.smaller {
            font-size: 12px;
            line-height: 12px;
        }
        #review_hover_details.smallest {
            font-size: 12px;
            line-height: 10px;
        }
        </style>
        `);
    }
})(window.wkof);
