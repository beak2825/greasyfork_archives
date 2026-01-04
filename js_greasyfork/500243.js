// ==UserScript==
// @name         Wanikani Show Level-up Time
// @namespace    http://tampermonkey.net/
// @version      2024-08-09
// @description  Adds the earliest date and time you can level-up to the level progress bar on the front page.
// @author       https://www.wanikani.com/users/ctmf
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      Don't post me on coding horror websites. Other than that, knock yourself out, this isn't that earth-shattering
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500243/Wanikani%20Show%20Level-up%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/500243/Wanikani%20Show%20Level-up%20Time.meta.js
// ==/UserScript==

// bugs or potential problems
// doesn't ignore previously-guru, but now apprentice items
// a level with a previously-done kanji on it is going to screw up the start time

(function() {
    // time spent on each srs level, in ms
    const TIME_ON_4 = 169200000;
    const TIME_ON_3 = 82800000;
    const TIME_ON_2 = 28800000;
    const TIME_ON_1 = 14400000;

    var TTLU_output_date;

    function fetch_items() {
        var config = {
            wk_items: {
                options: {assignments: true},
                filters: {item_type: 'kan, rad',}
            }};
        wkof.ItemData.get_items(config)
            .then(process_items)
            .then(display_results);
    }

    function process_items(items) {

        function time_until_guru(obj) {
            if (obj.assignments == undefined) obj.assignments = {'srs_stage': 0};
            return obj.assignments.srs_stage >= 5 // item is already guru+
                ? 0
                : obj.assignments.srs_stage > 0 // item is in review stages below guru
                ? add_levels_time(obj.assignments.srs_stage, obj.assignments.available_at)
                : obj.data.component_subject_ids == undefined // item is already a radical, no components
                ? TIME_ON_1 + TIME_ON_2 + TIME_ON_3 + TIME_ON_4
                : add_longest_radical(obj.data.component_subject_ids) + TIME_ON_1 + TIME_ON_2 + TIME_ON_3 + TIME_ON_4;
        }

        function add_levels_time(stage, next_rev) {
            var result = new Date(Date.parse(next_rev)) - new Date(); // time remaining in current stage
            switch (stage) {
                case 1: result += TIME_ON_2; // add the rest of the stages needed for guru
                case 2: result += TIME_ON_3;
                case 3: result += TIME_ON_4;
            }
            return result;
        }

        function add_longest_radical(components) {
            function isInList(element, list) {return !((list.find((e) => e === element)) == undefined);} // for filtering
            return items
                .filter((e) => isInList(e.id, components)) // filter all items to only the ones in the component list
                .map(time_until_guru) // calculate time to guru for each component
                .reduce((a, b) => Math.max(a, b)); // reduce the array to the max value and return it
        }

        function ttg_to_date(obj) {
            if (obj.ttg == 0) {
                obj.guru_date = new Date(obj.assignments.passed_at);
            } else {
                obj.guru_date = new Date(Date.now() + obj.ttg);
                obj.guru_date.setMinutes(0);
                obj.guru_date.setSeconds(0);
                obj.guru_date.setMilliseconds(0);
            }
            return obj;
        }

        // Process items:
        var sorted = items
            .filter((item) => item.object == "kanji" && item.data.level == wkof.user.level)
            .map(function(e) { e.ttg = time_until_guru(e); return ttg_to_date(e);}) // get the time-to-guru for each kanji on the level
            .sort((a, b) => a.guru_date - b.guru_date); // sort the list by how long to guru

        // calculate how many kanji I need to level up (90% of the total number)
        var last_index = Math.ceil(sorted.length * .9) - 1; // don't forget to account for zero-based counting
        sorted[last_index].guru_last = 1; // gonna use this later

        TTLU_output_date = sorted[last_index].guru_date;
        return sorted;
    }

    function display_results(output) {
        const srs_level_classes = ["not-started", "apprentice", "apprentice", "apprentice",
                                   "apprentice", "guru", "guru", "master", "enlightened", "burned"];

        // fix later: this is a guess, could be wrong if there were previously-guru'd kanji
        // more accurate, but kind of a PITA would be to pull /level-progressions/data/unlocked_at
        // but that's a completely different API endpoint we don't already have.
        const level_start = new Date(output[0].assignments.unlocked_at);

        // format summary output text
        const TTLU_output1 = `Started on ${level_start.toDateString()}.`
        const TTLU_output2 = `-- Earliest Level-Up here on ${toBetterString(TTLU_output_date)}`+
              ` (${levelElapsed(level_start, TTLU_output_date)} days on level)`;
        function toBetterString(date_obj) {return `${date_obj.toDateString()} at ${date_obj.getHours()}:00`;}
        function levelElapsed (start, end) {
            // round up the start date
            start.setDate(start.getDate()+1);
            start.setHours(0); start.setMinutes(0); start.setSeconds(0); start.setMilliseconds(0);
            let elapsedDays = Math.ceil((end - start) / 1000 / 60 / 60 / 24);
            return elapsedDays;
        }

       // Generate the data table
        let tablecode = "<div class=\"ttlu ttlu-table\">";
        output.forEach(function(kanji) {
            kanji.display_class = srs_level_classes[kanji.assignments.srs_stage];
            if (kanji.guru_last == 1) kanji.display_class += " last-index";
            tablecode += `<div class=\"${kanji.display_class}\" title=\"Calculated guru time: ${toBetterString(kanji.guru_date)}\">`;
            tablecode += kanji.data.slug + "</div>";
            // experimental
            if (kanji.guru_last == 1) tablecode += `</div><p class=\"ttlu lu\">${TTLU_output2}</p>`+
                `<div class=\"ttlu ttlu-table after-lu\">`;
        });

        // Output to page
        const location = document.querySelector(".level-progress-bar").parentNode;
        const new_element = document.createElement("div");
        var message_element = location.appendChild(new_element);
        message_element.innerHTML = TTLU_output1;
        message_element.setAttribute("id", "ttlu-id");
        message_element.setAttribute("class", "ttlu ttlu-text");
        message_element.insertAdjacentHTML("afterend", tablecode);
    }

    function install_css() {
        var ttlu_css =
            "div.ttlu-text {margin-top: 0.5lh; scroll-margin-top: 175px; line-height: 1.5;}"+
            ".ttlu-table {display:flex; flex-direction: row; flex-wrap: wrap; margin: 10px 0px;}"+
            "div.ttlu-table div {display: inline-flex; padding: 8px; margin: 4px; border-radius: 4px;"+
            "  width: 40px; height: 40px; font-size: 24px;}"+
            ".ttlu .not-started {color:black; background-color: lightgrey;}"+
            ".ttlu .apprentice {color: white; background-color: var(--color-srs-progress-apprentice);}"+
            ".ttlu .guru {color: white; background-color: var(--color-srs-progress-guru);}"+
            ".ttlu .master {color: white; background-color: var(--color-srs-progress-master);}"+
            ".ttlu .enlightened {color: white; background-color: var(--color-srs-progress-enlightened);}"+
            ".ttlu .burned {color: white; background-color: var(--color-srs-progress-burned);}";
        const style_element = document.createElement("style");
        const inserted_css = document.head.appendChild(style_element);
        inserted_css.innerHTML = ttlu_css;
    }

    function init(turbo = false) {
        // one-time setup, skipped on turbo reloads
        if (!turbo) {
            install_css();
            if (!window.wkof) {
                alert('\"Wanikani Show Level-up Time\" requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
                return;
            }
            wkof.include('ItemData');
        };

        // check we're on the right page and it isn't putting a second copy
        if (!(document.URL.endsWith("wanikani.com/") || document.URL.endsWith("/dashboard"))) return;
        if (document.querySelector("#ttlu-id")) return;

        // Kick off the whole thing when wkof is ready
        wkof.ready('ItemData').then(fetch_items);
    }

    // Make trigger for turbo reloads
	addEventListener("turbo:render", (e) => {
        setTimeout(() => init(true), 0);
    });

    // run everything first time
    init();
})();