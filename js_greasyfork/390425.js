// ==UserScript==
// @name         Wanikani: R/K/V Tiny Bars
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Adds colored bars to individually track radicals / kanji / vocab
// @author       Thalanor
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @match        https://preview.wanikani.com/
// @match        https://preview.wanikani.com/dashboard
// @license      MIT; http://opensource.org/licenses/MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390425/Wanikani%3A%20RKV%20Tiny%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/390425/Wanikani%3A%20RKV%20Tiny%20Bars.meta.js
// ==/UserScript==


(function() {
    // Code snippet like in most other userscripts - check for WKOF
    var wkof = window.wkof;
    var display_position = 'replace_vanilla';
    var recent_failure_threshold = 95;
    var show_global_bars = 1;
    var show_recent_failures = 1;
    var show_failed_properties = 1;
    var show_vocab_backlog = 1;
    var show_vocab_progression = 1;
    var show_kanji_progression = 1;
    var show_radical_progression = 1;
    var reverse_color_order = 0;
    var display_size = 0;
    var hide_guru_items = 1;
    var collapse_locked_items = 1;

    if (!wkof) {
        var response = confirm('Wanikani: Global wkof_data Bars requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
        if (response) window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    else {
        var wkof_data = {
            counts: {0: {burned: 0, enlightened: 0, master: 0, guru1: 0, guru2: 0, apprentice1: 0, apprentice2: 0, apprentice3: 0, apprentice4: 0, total: 0},
                     1: {burned: 0, enlightened: 0, master: 0, guru1: 0, guru2: 0, apprentice1: 0, apprentice2: 0, apprentice3: 0, apprentice4: 0, total: 0},
                     2: {burned: 0, enlightened: 0, master: 0, guru1: 0, guru2: 0, apprentice1: 0, apprentice2: 0, apprentice3: 0, apprentice4: 0, total: 0}
                    },
            //srs_info: {},
            recent_failures: {},
            backlog_vocab: {},
            lvl_radical: {},
            lvl_kanji: {},
            lvl_vocab: {},
            vocab_backlog_locked: 0,
            vocab_backlog_initiate: 0,
            vocab_backlog_remaining: 0,
            vocab_backlog_lowest_level: 60,
            vocab_backlog_highest_level: 0,
            failed_count: 0,
            failed_lowest_level: 60,
            failed_highest_level: 0,
            radicals_total: 0,
            radicals_learned: 0,
            kanji_total: 0,
            kanji_needed: 0,
            kanji_learned: 0,
            kanji_locked: 0,
            vocab_total: 0,
            vocab_learned: 0,
            vocab_locked: 0,
        }
        var flg_darktheme = is_dark_theme_rfindley();

        wkof.include('Menu, Settings, ItemData');
        wkof.ready('Menu, Settings, ItemData')
            .then(load_settings)
            .then(install_menu)
            .then(init_data)
            .then(calc_bars)
            .then(make_html);
    }

    // This function is called when the Settings module is ready to use.
    function load_settings() {
        var defaults = {
            display_position : 'replace_vanilla',
            recent_failure_threshold : 95,
            show_global_bars : 1,
            show_recent_failures : 1,
            show_failed_properties : 1,
            show_vocab_backlog : 1,
            show_vocab_progression : 1,
            show_kanji_progression : 1,
            show_radical_progression : 1,
            reverse_color_order : 0,
            display_size : 0,
            hide_guru_items : 1,
            collapse_locked_items : 1
        };
        wkof.Settings.load('wanikani_rkvtinybars', defaults)
            .then(update_settings);
    }

    // Add settings menu to the menu
    function install_menu() {
        var config = {
            name: 'wanikani_rkvtinybars',
            submenu: 'Settings',
            title: 'RKV Tiny Bars',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    // Define settings menu layout
    function open_settings(items) {
        var config = {
            script_id: 'wanikani_rkvtinybars',
            title: 'RKV Tiny Bars',
            on_save: update_settings,
            on_close: update_settings,
            content: {/*
                tabset_settings: {
                    type: 'tabset',
                    content: {
                        page_general: {
                            type: 'page',
                            label:         'Layout',
                            content: {*/
                module_settings: {
                    type: 'group',
                    label: 'Module Settings',
                    content: {
                        display_position: {
                            type: 'dropdown',
                            label:          'Display position',
                            hover_tip:      'Choose where to display the script card',
                            default:        'replace_vanilla',
                            content: {
                                replace_vanilla: 'Replace default progression',
                                below_vanilla: 'Dedicated card below default'
                            }
                        },
                    }
                },
                level_progression: {
                    type: 'group',
                    label: 'Level progression',
                    content: {
                        display_size: {
                            type: 'dropdown',
                            label:          'Item display size',
                            hover_tip:      'Choose the size of individual item tiles',
                            default:        0,
                            content: {
                                0: 'Standard',
                                1: 'Compact'
                            }
                        },
                        show_radical_progression: {
                            type: 'checkbox',
                            label:          'Show current level radicals',
                            hover_tip:      'Show the current level radical progression (radicals SRS)',
                            default:        'true'
                        },
                        show_kanji_progression: {
                            type: 'checkbox',
                            label:          'Show current level kanji',
                            hover_tip:      'Show the current level kanji progression (kanji SRS)',
                            default:        'true'
                        },
                        show_vocab_progression: {
                            type: 'checkbox',
                            label:          'Show current level vocabulary',
                            hover_tip:      'Show the current level vocabulary progression (vocab SRS)',
                            default:        'true'
                        },
                        show_vocab_backlog: {
                            type: 'checkbox',
                            label:          'Show backlog vocabulary',
                            hover_tip:      'Show apprentice vocabulary of previous levels remaining',
                            default:        'true'
                        },
                        hide_guru_items: {
                            type: 'checkbox',
                            label:          'Show only apprentice items',
                            hover_tip:      'Only show apprentice stages of current level radicals and kanji',
                            default:        'true'
                        },
                        collapse_locked_items: {
                            type: 'checkbox',
                            label:          'Sum up and collapse locked items',
                            hover_tip:      'Display the number of locked items instead of showing them individually',
                            default:        'true'
                        }
                    }
                },
                global_progression: {
                    type: 'group',
                    label: 'Global progression',
                    content: {
                        show_global_bars: {
                            type: 'checkbox',
                            label:          'Show the R/K/V progress bars',
                            hover_tip:      'Show colored progress bars for radicals, kanji and vocabulary',
                            default:        'true'
                        },
                        reverse_color_order: {
                            type: 'checkbox',
                            label:          'Reverse bar section order',
                            hover_tip:      'Change color ordering from apprentice -> burned to burned -> apprentice',
                            default:        'false'
                        }

                    }

                },
                recently_failed: {
                    type: 'group',
                    label: 'Recently failed',
                    content: {
                        show_recent_failures: {
                            type: 'checkbox',
                            label:          'Show recently failed items',
                            hover_tip:      'Show items recently failed (meaning or reading) in reviews',
                            default:        'true'
                        },
                        show_failed_properties: {
                            type: 'checkbox',
                            label:          'Show failed meaning or reading',
                            hover_tip:      'Show either or both meaning or reading, depending on what was failed',
                            default:        'true'
                        },
                        recent_failure_threshold: {
                            type: 'dropdown',
                            label:          'Recent failure threshold',
                            hover_tip:      'How much time of SRS interval must be remaining for the failed item to show.',
                            default:        95,
                            content: {
                                99: '99% of SRS',
                                95: '95% of SRS',
                                90: '90% of SRS',
                                75: '75% of SRS',
                                50: '50% of SRS'
                            }
                        }
                    }
                }
            }
        }
        var dialog = new wkof.Settings(config);
        dialog.open();
    }

    function update_settings(settings) {
        display_position = settings.display_position;
        recent_failure_threshold = settings.recent_failure_threshold;
        show_global_bars = settings.show_global_bars;
        show_recent_failures = settings.show_recent_failures;
        show_failed_properties = settings.show_failed_properties;
        show_vocab_backlog = settings.show_vocab_backlog;
        show_vocab_progression = settings.show_vocab_progression;
        show_kanji_progression = settings.show_kanji_progression;
        show_radical_progression = settings.show_radical_progression;
        reverse_color_order = settings.reverse_color_order;
        display_size = settings.display_size;
        hide_guru_items = settings.hide_guru_items;
        collapse_locked_items = settings.collapse_locked_items;

        wkof.Settings.save("wanikani_rkvtinybars");
    }

    function init_data() {
        var resolve, promise = new Promise((res, rej)=>{resolve=res;});
        var config = {wk_items: {options: {assignments: true, review_statistics: true}
                                }
                     };
        wkof.ItemData.get_items(config).then((data)=>{

            var user_level = wkof.user.level;
            var backlog_vocabs = 0;
            var lvl_radicals = 0;
            var lvl_kanji = 0;
            var lvl_vocab = 0;
            var recent_failures = 0;
            //var debug = 0;
            for (var key in data) {
                const item = data[key];
                //debug++;
                var id = item.id;
                var srs_stage = 0;

                var item_level = item.data.level;
                var item_type = item.object;
                var item_key = -1;

                if (item.assignments) {
                    srs_stage = item.assignments.srs_stage;

                    if ((item.review_statistics !== null) && (item.assignments.available_at !== null)) {
                        var reading_failed = item.review_statistics.reading_current_streak === 1;
                        var meaning_failed = item.review_statistics.meaning_current_streak === 1;
                        if (reading_failed || meaning_failed) {
                            var availableAt = new Date(item.assignments.available_at);
                            var intervalStart = new Date(item.assignments.available_at);
                            var secondsUntilReview = seconds_between(new Date(Date.now()), availableAt);
                            var secondsInSRS = getSecondsInSRS(srs_stage);
                            var percentUntil = Math.ceil(secondsUntilReview*100/secondsInSRS);
                            var itemReading = null;
                            if (item.data.readings !== undefined && item.data.meanings !== null) {
                                itemReading = item.data.readings[0].reading;
                            }
                            var itemMeaning = null;
                            if (item.data.meanings !== undefined && item.data.meanings !== null) {
                                itemMeaning = item.data.meanings[0].meaning;
                            }
                            if (percentUntil >= recent_failure_threshold) {
                                wkof_data.recent_failures[recent_failures] = {"id": id, "chars": item.data.characters, "images": item.data.character_images, "srs": srs_stage,
                                                                              "reading": reading_failed ? itemReading : null, "meaning": meaning_failed ? itemMeaning : null};
                                recent_failures++;
                                wkof_data.failed_count++;
                                wkof_data.failed_lowest_level = Math.min(wkof_data.failed_lowest_level, item_level);
                                wkof_data.failed_highest_level = Math.max(wkof_data.failed_highest_level, item_level);
                            }
                        }

                    }

                } else {
                    srs_stage = -1;
                }

                if (item_type === "radical") {
                    item_key = 0;
                } else if (item_type === "kanji") {
                    item_key = 1;
                } else if (item_type === "vocabulary") {
                    item_key = 2;
                } else if (item_type === "kana_vocabulary") {
                    item_key = 2;
                }

                //wkof_data.srs_info[id] = {"key": item_key, "srs": srs_stage};

                if (item_level === user_level) {
                    if (item_key === 0) {
                        wkof_data.lvl_radical[lvl_radicals] = {"id": id, "chars": item.data.characters, "images": item.data.character_images, "srs": srs_stage};
                        lvl_radicals++;
                        wkof_data.radicals_total++;
                        if (srs_stage > 4) {
                            wkof_data.radicals_learned++;
                        }
                    }
                    if (item_key === 1) {
                        lvl_kanji++;
                        wkof_data.kanji_total++;
                        if (srs_stage >= (collapse_locked_items ? 0 : -1)) {
                        wkof_data.lvl_kanji[lvl_kanji] = {"chars": item.data.characters, "images": item.data.character_images, "srs": srs_stage};
                            if (srs_stage > 4) {
                                wkof_data.kanji_learned++;
                            }
                        } else {
                            wkof_data.kanji_locked++;
                        }
                    }
                    if (item_key === 2) {
                        lvl_vocab++;
                        wkof_data.vocab_total++;
                        if (srs_stage >= (collapse_locked_items ? 0 : -1)) {
                            wkof_data.lvl_vocab[lvl_vocab] = {"chars": item.data.characters, "images": item.data.character_images, "srs": srs_stage};
                            if (srs_stage > 4) {
                                wkof_data.vocab_learned++;
                            }
                        } else {
                            wkof_data.vocab_locked++;
                        }
                    }
                }

                if (show_vocab_backlog && item_level < user_level && srs_stage < 5) {
                    if (item_key === 2) {
                        wkof_data.backlog_vocab[backlog_vocabs] = {"chars": item.data.characters, "images": item.data.character_images, "srs": srs_stage};
                        backlog_vocabs++;
                        wkof_data.vocab_backlog_remaining++;
                        wkof_data.vocab_backlog_lowest_level = Math.min(wkof_data.vocab_backlog_lowest_level, item_level);
                        wkof_data.vocab_backlog_highest_level = Math.max(wkof_data.vocab_backlog_highest_level, item_level);

                        if (srs_stage < 0) {
                            wkof_data.vocab_backlog_locked++;
                        } else if (srs_stage === 0) {
                            wkof_data.vocab_backlog_initiate++;
                        }
                    }
                }

                wkof_data.kanji_needed = Math.ceil(wkof_data.kanji_total*9/10);

                if (srs_stage == 1) {
                    wkof_data.counts[item_key].apprentice1++;
                } else if (srs_stage == 2) {
                    wkof_data.counts[item_key].apprentice2++;
                } else if (srs_stage == 3) {
                    wkof_data.counts[item_key].apprentice3++;
                } else if (srs_stage == 4) {
                    wkof_data.counts[item_key].apprentice4++;
                } else if (srs_stage == 5) {
                    wkof_data.counts[item_key].guru1++;
                } else if (srs_stage == 6) {
                    wkof_data.counts[item_key].guru2++;
                } else if (srs_stage === 7) {
                    wkof_data.counts[item_key].master++;
                } else if (srs_stage === 8) {
                    wkof_data.counts[item_key].enlightened++;
                } else if (srs_stage === 9) {
                    wkof_data.counts[item_key].burned++;
                }

                wkof_data.counts[item_key].total++;
            }
            resolve();
        })
        return promise;
    }

    function calc_bars() {
        var bardata = {bars: {0: {burned: 0, enlightened: 0, master: 0, guru1: 0, guru2: 0, apprentice1: 0, apprentice2: 0, apprentice3: 0, apprentice4: 0, count_learned: 0, count_learned_progress_since_last: 0, count_total: 0, label: "Radicals"},
                              1: {burned: 0, enlightened: 0, master: 0, guru1: 0, guru2: 0, apprentice1: 0, apprentice2: 0, apprentice3: 0, apprentice4: 0, count_learned: 0, count_learned_progress_since_last: 0, count_total: 0, label: "Kanji"},
                              2: {burned: 0, enlightened: 0, master: 0, guru1: 0, guru2: 0, apprentice1: 0, apprentice2: 0, apprentice3: 0, apprentice4: 0, count_learned: 0, count_learned_progress_since_last: 0, count_total: 0, label: "Vocabulary"}
                             },
                       backlog_vocab: {},
                       lvl_radical: {},
                       lvl_kanji: {},
                       lvl_vocab: {},
                       vocab_backlog_remaining: 0,
                       vocab_backlog_locked: 0,
                       vocab_backlog_initiate: 0,
                       vocab_backlog_lowest_level: 0,
                       vocab_backlog_highest_level: 0,
                       failed_count: 0,
                       failed_lowest_level: 0,
                       failed_highest_level: 0,
                       radicals_total: 0,
                       radicals_learned: 0,
                       kanji_total: 0,
                       kanji_needed: 0,
                       kanji_learned: 0,
                       kanji_locked: 0,
                       vocab_total: 0,
                       vocab_learned: 0,
                       vocab_locked: 0,
                      }

        var prevdata = JSON.parse(localStorage.getItem('WKRKVTinyBarsLearnedProgressV020'));
        if (prevdata == null) {
            prevdata = {0: 0, 1: 0, 2: 0};
        }

        for (var key in bardata["bars"]) {

            bardata["bars"][key].burned = wkof_data.counts[key].burned * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].enlightened = wkof_data.counts[key].enlightened * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].master = wkof_data.counts[key].master * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].guru2 = wkof_data.counts[key].guru2 * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].guru1 = wkof_data.counts[key].guru1 * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].apprentice4 = wkof_data.counts[key].apprentice4 * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].apprentice3 = wkof_data.counts[key].apprentice3 * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].apprentice2 = wkof_data.counts[key].apprentice2 * 100 / wkof_data.counts[key].total;
            bardata["bars"][key].apprentice1 = wkof_data.counts[key].apprentice1 * 100 / wkof_data.counts[key].total;

            bardata["bars"][key].count_total = wkof_data.counts[key].total;
            bardata["bars"][key].count_learned = wkof_data.counts[key].burned + wkof_data.counts[key].enlightened + wkof_data.counts[key].master + wkof_data.counts[key].guru2 + wkof_data.counts[key].guru1;

            bardata["bars"][key].count_learned_progress_since_last = bardata["bars"][key].count_learned - prevdata[key];
            prevdata[key] = bardata["bars"][key].count_learned;

        }

        bardata["lvl_radical"] = wkof_data.lvl_radical;
        bardata["lvl_kanji"] = wkof_data.lvl_kanji;
        bardata["lvl_vocab"] = wkof_data.lvl_vocab;
        bardata["recent_failures"] = wkof_data.recent_failures;
        bardata.backlog_vocab = wkof_data.backlog_vocab;
        bardata.vocab_backlog_locked = wkof_data.vocab_backlog_locked;
        bardata.vocab_backlog_initiate = wkof_data.vocab_backlog_initiate;
        bardata.vocab_backlog_remaining = wkof_data.vocab_backlog_remaining;
        bardata.vocab_backlog_lowest_level = wkof_data.vocab_backlog_lowest_level;
        bardata.vocab_backlog_highest_level = wkof_data.vocab_backlog_highest_level;
        bardata.failed_count = wkof_data.failed_count;
        bardata.failed_lowest_level = wkof_data.failed_lowest_level;
        bardata.failed_highest_level = wkof_data.failed_highest_level;
        bardata.radicals_learned = wkof_data.radicals_learned;
        bardata.radicals_total = wkof_data.radicals_total;
        bardata.kanji_learned = wkof_data.kanji_learned;
        bardata.kanji_needed = wkof_data.kanji_needed;
        bardata.kanji_total = wkof_data.kanji_total;
        bardata.kanji_locked = wkof_data.kanji_locked;
        bardata.vocab_learned = wkof_data.vocab_learned;
        bardata.vocab_total = wkof_data.vocab_total;
        bardata.vocab_locked = wkof_data.vocab_locked;

        localStorage.setItem('WKRKVTinyBarsLearnedProgressV020', JSON.stringify(prevdata));

        return bardata;
    }


    function make_html(bardata) {
        $('head').append('<style id="rkv_bars">'+
                         '.rkv_bars {'+
                         '    margin: 15px 0 15px;'+
                         '    position: relative;'+
                         '}'+
                         //'.rkv_bars .sidebar {'+
                         //'    position: absolute;'+
                         //'    left: -320px;'+
                         //'    top: 0px;'+
                         //'}'+
                         '.rkv_bars .headline {'+
                         '    font-size: 14px;'+
                         '    font-weight: 700;'+
                         '}'+
                         '.dashboard-progress {'+
                         (display_position === "replace_vanilla" ? '    padding: 0px !important;' : '')+
                         '}'+
                         '.rkv_bars .rkvbars_container {'+
                         '    border-radius: 5px;'+
                         (!flg_darktheme ? 'background: #ffffff !important;' : 'background: #232629 !important;') +
                         '    padding: 2px;'+
                         '    overflow: visible;'+
                         '    position: relative;'+
                         '    font-size: ' + (display_size == 0 ? 14 : 12) + 'px;'+
                         '}'+
                         '.rkv_bars .label {'+
                         '    border-radius: 0px;'+
                         '    background: transparent;'+
                         '    font-size: 12px; ' +
                         '    line-height: 12px; ' +
                         (!flg_darktheme ? 'color: #ffffff !important;' : 'color: #000000 !important;') +
                         '    position: absolute;' +
                         '    text-shadow: none;'+
                         '    top: 0px;'+
                         '    z-index: 10;'+
                         '}'+
                         '.rkv_bars .label-left {'+
                         '    left: 0px;'+
                         '}'+
                         '.rkv_bars .label-right {'+
                         '    right: 0px;'+
                         '}'+
                         '.rkv_bars .label-change {'+
                         '    right: -38px;'+
                         '    width: 30px;'+
                         '    height: 12px;'+
                         '    font-size: 12px; ' +
                         '    line-height: 12px; ' +
                         '    border-top-left-radius: 0px;'+
                         '    border-bottom-left-radius: 0px;'+
                         '    border-top-right-radius: 7px;'+
                         '    border-bottom-right-radius: 7px;'+
                         '}'+
                         '.rkv_bars .label-change-good {'+
                         (!flg_darktheme ? 'background: #33bb33;' : 'background: #66ff66;') +
                         '}'+
                         '.rkv_bars .label-change-bad {'+
                         (!flg_darktheme ? 'background: #bb3333;' : 'background: #ff6666;') +
                         '}'+
                         '.rkv_bars .rkvbars_bar {'+
                         '    border-radius: 0px;'+
                         (!flg_darktheme ?
                          'background-image: linear-gradient(135deg, #a7a7a7 25%, #a0a0a0 25%, #a0a0a0 50%, #a7a7a7 50%, #a7a7a7 75%, #a0a0a0 75%, #a0a0a0 100%);' :
                          'background-image: linear-gradient(135deg, #878787 25%, #808080 25%, #808080 50%, #878787 50%, #878787 75%, #808080 75%, #808080 100%);') +
                         '    background-size: 20px 20px;'+
                         '    margin: 5px;'+
                         '    position: relative; '+
                         '    height: 16px;' +
                         '    overflow: visible ;' +
                         '}'+
                         '.rkv_bars .shadow {'+
                         '    -moz-box-shadow:    inset 0px 3px 4px -3px #666;'+
                         '    -webkit-box-shadow:  inset 0px 3px 4px -3px #666;'+
                         '    box-shadow:          inset 0px 3px 4px -3px #666;'+
                         '}'+
                         '.rkv_bars .element {'+
                         '    border-radius: 0px;'+
                         '    padding: 0px;'+
                         '    float: left;'+
                         '    height: 16px;'+
                         '}'+
                         '.rkv_bars .charbox_element {'+
                         '    border-radius: 2px;' +
                         '    margin: 2px;'+
                         '    -moz-box-shadow:    1px 1px 2px 0px rgba(0, 0, 0, 0.7);' +
                         '    -webkit-box-shadow:  1px 1px 2px 0px rgba(0, 0, 0, 0.7);' +
                         '    box-shadow:          1px 1px 2px 0px rgba(0, 0, 0, 0.7);' +
                         '    padding-left: ' + (display_size == 0 ? 2 : 1) + 'px;'+
                         '    padding-right: ' + (display_size == 0 ? 2 : 0) + 'px;'+
                         '    padding-top: ' + (display_size == 0 ? 4 : 0) + 'px;'+
                         '    padding-bottom: 0px;'+
                         '    float: left;'+
                         '    height: ' + (display_size == 0 ? 24 : 20) + 'px;'+
                         '    font-size: ' + (display_size == 0 ? 20 : 14) + 'px;'+
                         '    text-align: center;'+
                         '    color: #000000 !important;'+
                         '}'+
                         '.rkv_bars .reading_meaning {'+
                         '    border-radius: 2px;' +
                         '    margin-top: ' + (display_size == 0 ? 0 : 2) + 'px;'+
                         '    margin-left: 2px;'+
                         '    margin-right: 2px;'+
                         '    padding-left: 2px;'+
                         '    padding-right: 2px;'+
                         '    float: right;'+
                         '    height: ' + (display_size == 0 ? 20 : 16) + 'px;'+
                         '    font-size: ' + (display_size == 0 ? 12 : 10) + 'px;'+
                         '    text-align: center;'+
                         '    color: #000000 !important;'+
                         '    background-color: #ffffff !important;'+
                         '}'+
                         '.rkv_bars .charbox {'+
                         '    min-width: ' + (display_size == 0 ? 24 : 20) + 'px;'+
                         '}'+
                         '.rkv_bars .levelup_separator {'+
                         '    width: 4px;'+
                         '    margin-left: ' + (display_size == 0 ? 12 : 10) + 'px;'+
                         '    margin-right: ' + (display_size == 0 ? 12 : 10) + 'px;'+
                         (!flg_darktheme ?
                          '    background-image: linear-gradient(135deg, #B351CC 25%, #9130A9 25%, #9130A9 50%, #B351CC 50%, #B351CC 75%, #9130A9 75%, #9130A9 100%);' :
                          '    background-image: linear-gradient(135deg, #239950 25%, #5BCC8A 25%, #5BCC8A 50%, #239950 50%, #239950 75%, #5BCC8A 75%, #5BCC8A 100%);') +
                         '    background-size: 10px 10px;'+
                         '}'+
                         '.rkv_bars .charcard {'+
                         '    padding-top: 16px;'+
                         '    margin: 8px;'+
                         '    position: relative; '+
                         '    overflow: visible;' +
                         '}'+
                         '.rkv_bars .locked {'+
                         (!flg_darktheme ?
                          '    background-image: linear-gradient(135deg, #a7a7a7 25%, #a0a0a0 25%, #a0a0a0 50%, #a7a7a7 50%, #a7a7a7 75%, #a0a0a0 75%, #a0a0a0 100%);' :
                          '    background-image: linear-gradient(135deg, #878787 25%, #808080 25%, #808080 50%, #878787 50%, #878787 75%, #808080 75%, #808080 100%);') +
                         '    background-size: 10px 10px;'+
                         '}'+
                         '.rkv_bars .srs-1 {'+
                         (!flg_darktheme ?
                          '    background-image: linear-gradient(135deg, #a7a7a7 25%, #a0a0a0 25%, #a0a0a0 50%, #a7a7a7 50%, #a7a7a7 75%, #a0a0a0 75%, #a0a0a0 100%);' :
                          '    background-image: linear-gradient(135deg, #878787 25%, #808080 25%, #808080 50%, #878787 50%, #878787 75%, #808080 75%, #808080 100%);') +
                         '}'+
                         '.rkv_bars .srs0 {'+
                         (!flg_darktheme ? '    background: #EEEEEE !important;' : 'background: #CCCCCC !important;') +
                         '}'+
                         '.rkv_bars .srs1 {'+
                         (!flg_darktheme ? '    background: #DDBCD2 !important;' : 'background: #A0C8E5 !important;') +
                         '}'+
                         '.rkv_bars .srs2 {'+
                         (!flg_darktheme ? '    background: #DD9BC7 !important;' : 'background: #7CB8E2 !important;') +
                         '}'+
                         '.rkv_bars .srs3 {'+
                         (!flg_darktheme ? '    background: #E070BB !important;' : 'background: #4EA6E0 !important;') +
                         '}'+
                         '.rkv_bars .srs4 {'+
                         (!flg_darktheme ? '    background: #F200A1 !important;' : 'background: #1187DB !important;') +
                         '}'+
                         '.rkv_bars .srs5 {'+
                         (!flg_darktheme ? '    background: #C351EC !important;' : 'background: #1EAA77 !important;') +
                         '}'+
                         '.rkv_bars .srs6 {'+
                         (!flg_darktheme ? '    background: #A130D9 !important;' : 'background: #1EDD4D !important;') +
                         '}'+
                         '.rkv_bars .srs7 {'+
                         (!flg_darktheme ? '    background: #3758DD !important;' : 'background: #FDBC4B !important;') +
                         '}'+
                         '.rkv_bars .srs8 {'+
                         (!flg_darktheme ? '    background: #009CEA !important;' : 'background: #F67400 !important;') +
                         '}'+
                         '.rkv_bars .srs9 {'+
                         (!flg_darktheme ? '    background: #FAB319 !important;' : 'background: #DA4453 !important;') +
                         '}'+
                         '</style>');


        var section = document.createElement('section');
        section.className = 'rkv_bars inner_section';

        var container = document.createElement('div');
        container.className = 'rkvbars_container';

        if (show_global_bars) {
            for (var key in bardata["bars"]) {

                var list = document.createElement('div');
                list.className = 'rkvbars_bar shadow';

                var progress_since_last = bardata["bars"][key].count_learned_progress_since_last;

                if (progress_since_last > 0) {
                    $(list).append('<div class="label label-change label-change-good">'+ '+' + progress_since_last + '</div>');
                } else if (progress_since_last < 0) {
                    $(list).append('<div class="label label-change label-change-bad">'+ '−' + Math.abs(progress_since_last) + '</div>');
                }

                var percentage = Math.round((bardata["bars"][key].count_learned / bardata["bars"][key].count_total * 100) * 100) / 100
                $(list).append('<div class="label label-left">'+ bardata["bars"][key].label + '</div>');
                $(list).append('<div class="label label-right">'+ bardata["bars"][key].count_learned + ' / ' + bardata["bars"][key].count_total + ' (' + percentage + '%)' + '</div>');

                if (reverse_color_order) {
                    $(list).append('<div class="srs1 element shadow" style="width: '+ bardata["bars"][key].apprentice1 + '%"></div>');
                    $(list).append('<div class="srs2 element shadow" style="width: '+ bardata["bars"][key].apprentice2 + '%"></div>');
                    $(list).append('<div class="srs3 element shadow" style="width: '+ bardata["bars"][key].apprentice3 + '%"></div>');
                    $(list).append('<div class="srs4 element shadow" style="width: '+ bardata["bars"][key].apprentice4 + '%"></div>');
                    $(list).append('<div class="srs5 element shadow" style="width: '+ bardata["bars"][key].guru1 + '%"></div>');
                    $(list).append('<div class="srs6 element shadow" style="width: '+ bardata["bars"][key].guru2 + '%"></div>');
                    $(list).append('<div class="srs7 element shadow" style="width: '+ bardata["bars"][key].master + '%"></div>');
                    $(list).append('<div class="srs8 element shadow" style="width: '+ bardata["bars"][key].enlightened + '%"></div>');
                    $(list).append('<div class="srs9 element shadow" style="width: '+ bardata["bars"][key].burned + '%"></div>');
                } else {
                    $(list).append('<div class="srs9 element shadow" style="width: '+ bardata["bars"][key].burned + '%"></div>');
                    $(list).append('<div class="srs8 element shadow" style="width: '+ bardata["bars"][key].enlightened + '%"></div>');
                    $(list).append('<div class="srs7 element shadow" style="width: '+ bardata["bars"][key].master + '%"></div>');
                    $(list).append('<div class="srs6 element shadow" style="width: '+ bardata["bars"][key].guru2 + '%"></div>');
                    $(list).append('<div class="srs5 element shadow" style="width: '+ bardata["bars"][key].guru1 + '%"></div>');
                    $(list).append('<div class="srs4 element shadow" style="width: '+ bardata["bars"][key].apprentice4 + '%"></div>');
                    $(list).append('<div class="srs3 element shadow" style="width: '+ bardata["bars"][key].apprentice3 + '%"></div>');
                    $(list).append('<div class="srs2 element shadow" style="width: '+ bardata["bars"][key].apprentice2 + '%"></div>');
                    $(list).append('<div class="srs1 element shadow" style="width: '+ bardata["bars"][key].apprentice1 + '%"></div>');
                }

                $(container).append(list);
            }
        }

        if (show_recent_failures && bardata.failed_count > 0) {
            var faillist = document.createElement('div');
            faillist.className = 'charcard';

            $(faillist).append('<span class="headline">Level ' + bardata.failed_lowest_level + '-' + bardata.failed_highest_level + ' Recently failed items (> ' + recent_failure_threshold + '% of SRS interval remaining)</span><br>');

            for(var i = 9; i >= 0; i--) {
                for (var failed in bardata["recent_failures"]) {
                    var srs_level = bardata["recent_failures"][failed]["srs"];
                    if (srs_level == i) {
                        var chars = bardata["recent_failures"][failed]["chars"];
                        var images = bardata["recent_failures"][failed]["images"];
                        failed_properties = "";
                        if (show_failed_properties) {
                            var reading = bardata["recent_failures"][failed]["reading"];
                            var meaning = bardata["recent_failures"][failed]["meaning"];
                            var readingDiv = '<span class="reading_meaning">' + reading + '</span>';
                            var meaningDiv = '<span class="reading_meaning">' + meaning + '</span>';
                            failed_properties = (reading !== null ? readingDiv : "") + (meaning !== null ? meaningDiv : "");
                        }
                        var srs_class = "srs" + srs_level;
                        if (chars) {
                            $(faillist).append('<div class="charbox_element charbox ' + srs_class + '">' + chars + failed_properties + '</div>');
                        } else if (images) {
                            $(faillist).append('<div class="charbox_element charbox ' + srs_class + '"><img src="' + bardata["recent_failures"][failed]["images"][8]["url"] + '" width="' + (display_size == 0 ? 20 : 14) + 'px" height="' + (display_size == 0 ? 20 : 14) + 'px"></img></div>');
                        }
                    }
                }
            }
            $(faillist).append('<br clear="all" />');
            $(container).append(faillist);
        }

        if (show_vocab_backlog && bardata.vocab_backlog_remaining > 0) {
            var voclist_backlog = document.createElement('div');
            voclist_backlog.className = 'charcard';

            $(voclist_backlog).append('<span class="headline">Level ' +  bardata.vocab_backlog_lowest_level + '-' +  bardata.vocab_backlog_highest_level + ' Vocabulary backlog (' + bardata.vocab_backlog_remaining + ' remaining from earlier levels, ' + bardata.vocab_backlog_initiate + ' not started, ' + bardata.vocab_backlog_locked + ' locked)</span><br>');

            for(var i = 9; i >= 0; i--) {
                for (var voc_b in bardata["backlog_vocab"]) {
                    var srs_level = bardata["backlog_vocab"][voc_b]["srs"];
                    if (srs_level == i) {
                        var vocbchars = bardata["backlog_vocab"][voc_b]["chars"];
                        var srs_class = "srs" + srs_level;
                        $(voclist_backlog).append('<div class="charbox_element charbox ' + srs_class + '">' + vocbchars + '</div>');
                    }
                }
            }
            if (bardata.vocab_backlog_locked > 0) {
                $(voclist_backlog).append('<div class="charbox_element locked">&nbsp+' + bardata.vocab_backlog_locked + '&nbsp;</div>');
            }
            $(voclist_backlog).append('<br clear="all" />');
            $(container).append(voclist_backlog);
        }

        if (show_radical_progression && bardata.radicals_learned < bardata.radicals_total) {
            var radlist = document.createElement('div');
            radlist.className = 'charcard';

            $(radlist).append('<span class="headline">Level ' + wkof.user.level + ' Radicals Progression (' + bardata.radicals_learned + ' of ' + bardata.radicals_total + ' learned)</span><br>');

            for(var i = 9; i >= -1; i--) {
                for (var rad in bardata["lvl_radical"]) {
                    var srs_level = bardata["lvl_radical"][rad]["srs"];
                    if (!hide_guru_items || srs_level < 5) {
                        if (srs_level == i) {
                            var radchars = bardata["lvl_radical"][rad]["chars"];
                            var images = bardata["lvl_radical"][rad]["images"];
                            var srs_class = "srs" + srs_level;
                            if (radchars) {
                                $(radlist).append('<div class="charbox_element charbox ' + srs_class + '">' + radchars + '</div>');
                            } else if (images) {
                                $(radlist).append('<div class="charbox_element charbox ' + srs_class + '"><img src="' + bardata["lvl_radical"][rad]["images"][8]["url"] + '" width="' + (display_size == 0 ? 20 : 14) + 'px" height="' + (display_size == 0 ? 20 : 14) + 'px"></img></div>');
                            }
                        }
                    }
                }
            }
            $(radlist).append('<br clear="all" />');
            $(container).append(radlist);
        }


        if (show_kanji_progression && bardata.kanji_learned < bardata.kanji_total) {
            var kanlist = document.createElement('div');
            kanlist.className = 'charcard';

            $(kanlist).append('<span class="headline">Level ' + wkof.user.level + ' Kanji Progression (' + bardata.kanji_learned + ' of ' + bardata.kanji_total + ' learned, ' + (bardata.kanji_needed - bardata.kanji_learned) + ' more required)</span><br>');

            var kanji_count = 0;
            var levelup_threshold_marker = bardata.kanji_needed;
            if (hide_guru_items) {
                levelup_threshold_marker -= bardata.kanji_learned;
            }
            for(var i = 9; i >= -1; i--) {
                for (var kan in bardata["lvl_kanji"]) {
                    var srs_level = bardata["lvl_kanji"][kan]["srs"];
                    if (!hide_guru_items || srs_level < 5) {
                        if (srs_level == i) {
                            if (kanji_count == levelup_threshold_marker) {
                                $(kanlist).append('<div class="charbox_element levelup_separator"></div>');
                            }
                            var kanchars = bardata["lvl_kanji"][kan]["chars"];
                            var srs_class = "srs" + srs_level;
                            if (kanchars) {
                                $(kanlist).append('<div class="charbox_element charbox ' + srs_class + '">' + kanchars + '</div>');
                            }
                            kanji_count++;
                        }
                    }
                }
            }
            if (bardata.kanji_locked > 0) {
                $(kanlist).append('<div class="charbox_element locked">&nbsp+' + bardata.kanji_locked + '&nbsp;</div>');
            }
            $(kanlist).append('<br clear="all" />');
            $(container).append(kanlist);
        }

        if (show_vocab_progression && bardata.vocab_learned < bardata.vocab_total) {
            var voclist = document.createElement('div');
            voclist.className = 'charcard';

            $(voclist).append('<span class="headline">Level ' + wkof.user.level + ' Vocabulary Progression (' + bardata.vocab_learned + ' of ' + bardata.vocab_total + ' learned)</span><br>');

            var vocab_count = 0;
            for(var i = 9; i >= -1; i--) {
                for (var voc in bardata["lvl_vocab"]) {
                    var srs_level = bardata["lvl_vocab"][voc]["srs"];
                    if (!hide_guru_items || srs_level < 5) {
                        if (srs_level == i) {
                            var vocchars = bardata["lvl_vocab"][voc]["chars"];
                            var srs_class = "srs" + srs_level;
                            if (vocchars) {
                                $(voclist).append('<div class="charbox_element charbox ' + srs_class + '">' + vocchars + '</div>');
                            }
                            vocab_count++;
                        }
                    }
                }
            }
            if (bardata.vocab_locked > 0) {
                $(voclist).append('<div class="charbox_element locked">&nbsp+' + bardata.vocab_locked + '&nbsp;</div>');
            }
            $(voclist).append('<br clear="all" />');
            $(container).append(voclist);
        }




        section.appendChild(container);


        if (display_position === "replace_vanilla") {
            $('.progress-component').after(section);
            $('.progress-component').remove();
        } else {
            $('.srs-progress').after(section);
        }


    }

    // Handy little function that rfindley wrote. Checks whether the theme is dark.
    function is_dark_theme_rfindley() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return $('body').css('background-color').match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
    }

    function seconds_between(d1, d2) {
        if (d1 == "Invalid Date") return 1;
        var diff = d2.getTime()-d1.getTime(); // milliseconds
        var tzd = d1.getTimezoneOffset()-d2.getTimezoneOffset(); // minutes
        diff += tzd*60*1000+1;
        return Math.ceil(diff/1000);
    }

    function getSecondsInSRS(srs_stage) {
        var hours;
        switch(srs_stage) {
            case 1: hours = 4; break;
            case 2: hours = 8; break;
            case 3: hours = 1*24; break;
            case 4: hours = 2*24; break;
            case 5: hours = 7*24; break;
            case 6: hours = 14*24; break;
            case 7: hours = 30*24; break;
            case 8: hours = 4*30*24; break;
            default: hours = 1; break;
        }
        return hours*60*60;
    }
})();