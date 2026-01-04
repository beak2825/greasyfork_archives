// ==UserScript==
// @name         Wanikani: Progress Percentages
// @namespace    https://greasyfork.org/en/users/1364747
// @version      1.2.9
// @description  Calculates the percentage of known kanji for each JLPT level, Joyo grade, Frequency bracket, and various other sources.
// @author       sarmientoF
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @require      https://greasyfork.org/scripts/377613-wanikani-open-framework-jlpt-joyo-and-frequency-filters/code/Wanikani%20Open%20Framework%20JLPT,%20Joyo,%20and%20Frequency%20filters.user.js
// @license      MIT; http://opensource.org/licenses/MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507418/Wanikani%3A%20Progress%20Percentages.user.js
// @updateURL https://update.greasyfork.org/scripts/507418/Wanikani%3A%20Progress%20Percentages.meta.js
// ==/UserScript==

(function () {
    // Make sure WKOF is installed
    var wkof = window.wkof;
    if (!wkof) {
        var response = confirm(
            'Wanikani: JLPT Progress requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.'
        );
        if (response)
            window.location.href =
                "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
        return;
    } else {
        // Install menu
        wkof.include("Menu,Settings");
        wkof.ready("Menu,Settings").then(load_settings).then(install_menu);

        // Initiate progress variable
        var progress = {
            jlpt: {
                1: { learned: 0, total: 1232 },
                2: { learned: 0, total: 367 },
                3: { learned: 0, total: 367 },
                4: { learned: 0, total: 166 },
                5: { learned: 0, total: 79 },
            },
            joyo: {
                1: { learned: 0, total: 80 },
                2: { learned: 0, total: 160 },
                3: { learned: 0, total: 200 },
                4: { learned: 0, total: 200 },
                5: { learned: 0, total: 185 },
                6: { learned: 0, total: 181 },
                9: { learned: 0, total: 1130 },
            },
            freq: {
                500: { learned: 0, total: 500 },
                1000: { learned: 0, total: 500 },
                1500: { learned: 0, total: 500 },
                2000: { learned: 0, total: 500 },
                2500: { learned: 0, total: 500 },
            },
            other: {
                nhk: { learned: 0, total: 0 },
                news: { learned: 0, total: 0 },
                aozora: { learned: 0, total: 0 },
                twitter: { learned: 0, total: 0 },
                wikipedia: { learned: 0, total: 0 },
            },
        };

        // Fetch lesson info then process it
        wkof.include("ItemData");
        wkof
            .ready("ItemData")
            .then(update_progress)
            .then(calculate_percentages)
            .then(display_data);
    }

    // Loads settings
    function load_settings() {
        var defaults = { cumulative: false, threshold: 1, position: "top" };
        wkof.Settings.load("progress_percentages", defaults);
    }

    // Installs the options button in the menu
    function install_menu() {
        var config = {
            name: "progress_percentages_settings",
            submenu: "Settings",
            title: "Progress Percentages",
            on_click: open_settings,
        };
        wkof.Menu.insert_script_link(config);
    }

    // Creates the options
    function open_settings(items) {
        var config = {
            script_id: "progress_percentages",
            title: "Progress Percentages",
            content: {
                cumulative: {
                    type: "checkbox",
                    label: "Cumulative percentages",
                    hover_tip: "Eg. N3 = N3 + N4 + N4",
                    default: false,
                },
                threshold: {
                    type: "list",
                    label: "Learned threshold",
                    hover_tip:
                        "Items at or above this SRS level will be counted as learned",
                    multi: false,
                    size: 9,
                    default: "1",
                    content: {
                        1: "Apprentice 1",
                        2: "Apprentice 2",
                        3: "Apprentice 3",
                        4: "Apprentice 4",
                        5: "Guru 1",
                        6: "Guru 2",
                        7: "Master",
                        8: "Enlightened",
                        9: "Burned",
                    },
                },
                position: {
                    type: "dropdown",
                    label: "Position",
                    hover_tip:
                        "Position of the Progress Percentages element on the dashboard",
                    default: "search",
                    content: {
                        top: "Top of page",
                        below_srs: "Below SRS boxes",
                    },
                    on_change: (setting, value) => {
                        let elem = $(".progress_percentages");
                        elem.toggleClass("span12", value == "top");
                        if (value == "top") $("#search-form").before(elem);
                        if (value == "below_srs") $(".srs-progress").append(elem);
                    },
                },
            },
            on_save: () => {
                progress = {
                    jlpt: {
                        1: { learned: 0, total: 1232 },
                        2: { learned: 0, total: 367 },
                        3: { learned: 0, total: 367 },
                        4: { learned: 0, total: 166 },
                        5: { learned: 0, total: 79 },
                    },
                    joyo: {
                        1: { learned: 0, total: 80 },
                        2: { learned: 0, total: 160 },
                        3: { learned: 0, total: 200 },
                        4: { learned: 0, total: 200 },
                        5: { learned: 0, total: 185 },
                        6: { learned: 0, total: 181 },
                        9: { learned: 0, total: 1130 },
                    },
                    freq: {
                        500: { learned: 0, total: 500 },
                        1000: { learned: 0, total: 500 },
                        1500: { learned: 0, total: 500 },
                        2000: { learned: 0, total: 500 },
                        2500: { learned: 0, total: 500 },
                    },
                    other: {
                        nhk: { learned: 0, total: 0 },
                        news: { learned: 0, total: 0 },
                        aozora: { learned: 0, total: 0 },
                        twitter: { learned: 0, total: 0 },
                        wikipedia: { learned: 0, total: 0 },
                    },
                };
                update_progress().then(calculate_percentages).then(update_element);
            },
        };
        var dialog = new wkof.Settings(config);
        dialog.open();
    }

    // Updates element
    function update_element(percentages) {
        console.log("percentages", percentages);
        for (var key in percentages) {
            console.log("key", key);
            for (var level in percentages[key]) {
                console.log("level", level);
                var stage = key == "jlpt" ? 6 - level : level;
                var elem = $("#" + key + "_" + stage)[0];
                console.log("elem", elem);
                elem.title =
                    percentages[key][stage].learned +
                    (key != "other" ? " of " + percentages[key][stage].total : "") +
                    " learned";
                elem.children[1].innerText = percentages[key][stage].percent + "%";
            }
        }
    }

    // Retreives lesson data
    function update_progress() {
        var resolve,
            promise = new Promise((res, rej) => {
                resolve = res;
            });
        var config = {
            wk_items: {
                options: { assignments: true },
                filters: {
                    item_type: "kan",
                    include_jlpt_data: true,
                    include_joyo_data: true,
                    include_frequency_data: true,
                },
            },
        };
        wkof.ItemData.get_items(config).then((data) => {
            for (var key in data) {
                if (data[key].assignments && data[key].assignments.started_at != null) {
                    var keys = [
                        ["jlpt_level", "jlpt"],
                        ["joyo_grade", "joyo"],
                        ["frequency", "freq"],
                        ["nhk_frequency", "nhk"],
                        ["news_frequency", "news"],
                        ["aozora_frequency", "aozora"],
                        ["twitter_frequency", "twitter"],
                        ["wikipedia_frequency", "wikipedia"],
                    ];
                    keys.forEach((val, i) => {
                        var level = data[key][val[0]];
                        if (
                            level &&
                            data[key].assignments.srs_stage >=
                            wkof.settings.progress_percentages.threshold
                        ) {
                            if (level < 1) {
                                progress.other[val[1]].learned++;
                                progress.other[val[1]].total += level;
                            } else progress[val[1]][level].learned++;
                        }
                    });
                }
            }
            resolve();
        });
        return promise;
    }

    function calculate_percentages() {
        var show_cum = wkof.settings.progress_percentages.cumulative;
        var percentages = {
            jlpt: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
            joyo: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 9: {} },
            freq: { 500: {}, 1000: {}, 1500: {}, 2000: {}, 2500: {} },
            other: { nhk: {}, news: {}, aozora: {}, twitter: {}, wikipedia: {} },
        };
        for (var key in percentages) {
            var cumulative = [0, 0];
            for (var level in percentages[key]) {
                var stage = key == "jlpt" ? 6 - level : level;
                var learned = progress[key][stage].learned;
                var total = progress[key][stage].total;
                cumulative[0] += learned;
                cumulative[1] += total;
                let percent;
                if (key != "other")
                    percent = show_cum ? cumulative[0] / cumulative[1] : learned / total;
                else percent = total;
                percent =
                    percent < 0.1
                        ? Math.floor(percent * 1000) / 10
                        : Math.floor(percent * 100);
                percentages[key][stage].percent = percent;
                percentages[key][stage].learned = show_cum ? cumulative[0] : learned;
                percentages[key][stage].total = show_cum ? cumulative[1] : total;
            }
        }
        return percentages;
    }

    function display_data(percentages) {
        // Add css
        $("head").append(`<style id="progress_percentages">
    .progress_percentages {
        display: flex;
        height: 28px;
        background: #434343;
        color: rgb(240, 240, 240);
        line-height: 28px;
        //margin-bottom: 0;
        border-radius: 5px;
        text-align: center;
        grid-row: 1;
        grid-column: 1 / span 2;
        //margin-top: 15px;
    }
    .srs-progress .progress_percentages {
        margin-top: 5px;
    }
    #search-form {
        grid-row: 1;
    }
    .progress_percentages .PPprogress {
        display: flex;
        width: 100%;
        justify-content: space-around;
    }
    .progress_percentages .PPbtn {
        width: 20px;
        height: auto;
        color: rgb(240,240,240);
        padding: 0 5px;
        cursor: pointer;
        font-size: 16px;
        z-index: 10;
    }
    .progress_percentages .level {
        font-weight: bold;
    }
    .progress_percentages .percent {
        font-weight: normal !important;
    }
    .progress_percentages span {
        font-size: 16px !important;
        display: inline !important;
    }
    </style>`);
        if (is_dark_theme()) {
            $("head").append(`<style id="progress_percentages_dark">
    .progress_percentages {
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7), 2px 2px 2px rgba(0, 0, 0, 0.7);
    }
    .progress_percentages > div {
        background: #232629 !important;
    }
    </style>`);
        }
        // Add elements
        console.log("percentages", percentages);
        var section = document.createElement("section");
        section.className = "progress_percentages";

        var active_set =
            localStorage.getItem("WKProgressPercentagesActiveSet") || "jlpt";
        var [next, prev] = get_new_sets(active_set);

        var next_button = document.createElement("div");
        next_button.className = "next PPbtn";
        next_button.innerHTML = '<i class="link icon-chevron-right">></i>';
        next_button.onclick = toggle_percentages;
        next_button.current = active_set;
        next_button.next = next;

        var prev_button = document.createElement("div");
        prev_button.className = "prev PPbtn";
        prev_button.innerHTML = '<i class="link icon-chevron-left"><</i>';
        prev_button.onclick = toggle_percentages;
        prev_button.current = active_set;
        prev_button.next = prev;

        var list = document.createElement("div");
        list.className = "PPprogress";
        for (var key in percentages) {
            for (var level in percentages[key]) {
                var stage = key == "jlpt" ? 6 - level : level;
                var prefix =
                    key == "jlpt" ? "N" : key == "joyo" ? "G" : key == "freq" ? "F" : "";
                var label =
                    key == "other"
                        ? stage == "nhk"
                            ? "NHK"
                            : stage.charAt(0).toUpperCase() + stage.slice(1)
                        : key == "freq"
                            ? stage / 500
                            : stage;
                $(list).append(
                    '<div class="' +
                    key +
                    "_percentages stage " +
                    (key == active_set ? "" : "hidden") +
                    '" id="' +
                    key +
                    "_" +
                    stage +
                    '" title="' +
                    percentages[key][stage].learned +
                    (key != "other" ? " of " + percentages[key][stage].total : "") +
                    ' learned"><span class="level">' +
                    prefix +
                    label +
                    ' </span><span class="percent">' +
                    percentages[key][stage].percent +
                    "%</span></div>"
                );
            }
        }
        section.appendChild(prev_button);
        section.appendChild(list);
        section.appendChild(next_button);
        if (wkof.settings.progress_percentages.position == "top") {
            //section.className += ' span12'
            $(".dashboard").before(section);
        } else if (wkof.settings.progress_percentages.position == "below_srs")
            $(".srs-progress").append(section);
        else $(".srs-progress__stages").before(section);
    }

    // Switches which percentages are showing
    function toggle_percentages(event) {
        var button = event.target;
        if (button.nodeName == "I") button = button.parentElement;
        var current_set = button.current;
        var next_set = button.next;
        $("." + current_set + "_percentages").toggleClass("hidden");
        $("." + next_set + "_percentages").toggleClass("hidden");
        var next_button = $(".progress_percentages .next")[0];
        var prev_button = $(".progress_percentages .prev")[0];
        var [next, prev] = get_new_sets(next_set);
        next_button.next = next;
        next_button.current = next_set;
        prev_button.next = prev;
        prev_button.current = next_set;
        localStorage.setItem("WKProgressPercentagesActiveSet", next_set);
    }

    // Returns the next and previous sets
    function get_new_sets(current_set) {
        var sets = ["jlpt", "joyo", "freq", "other"];
        var current_index = sets.indexOf(current_set);
        return [sets[(current_index + 1) % 4], sets[(current_index + 3) % 4]];
    }

    // Handy little function that rfindley wrote. Checks whether the theme is dark.
    function is_dark_theme() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return (
            $("body")
                .css("background-color")
                .match(/\((.*)\)/)[1]
                .split(",")
                .slice(0, 3)
                .map((str) => Number(str))
                .reduce((a, i) => a + i) /
            (255 * 3) <
            0.5
        );
    }
})();
