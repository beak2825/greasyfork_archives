// ==UserScript==
// @name         WaniKani Dashboard Level Progress Detail
// @version      1.6.2
// @description  Show detailed progress bars.
// @author       UInt2048
// @match        https://preview.wanikani.com/
// @match        https://preview.wanikani.com/dashboard
// @match        https://preview.wanikani.com/dashboard/
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @match        https://www.wanikani.com/dashboard/
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/437450/WaniKani%20Dashboard%20Level%20Progress%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/437450/WaniKani%20Dashboard%20Level%20Progress%20Detail.meta.js
// ==/UserScript==
/*eslint max-len: ["error", { "code": 120 }]*/

(function() {
    'use strict';

    if (!window.wkof) {
        alert('WK Dashboard Level Progress Detail requires Wanikani Open Framework.\n' +
            'You will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    window.wkof.include('ItemData, Apiv2, Menu, Settings, Jquery');

    const locked_data_url = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEX////" +
        "p6emlmyooAAAAAnRSTlMAgJsrThgAAAA1SURBVDjLY3huea54DpQ4wIBgnyuewDAHSdKAAUnhuQIGJIVzHjCMmjJqyqgpo6aMmkKkKQC" +
        "2XQWeSEU1BQAAAABJRU5ErkJggg==')";

    const defaults = {
        progress_hidden: 2,
        progress_hidden_percentage: 90,
        unconditional_progressions: 0,
        border_radius: 10,
        hide_current_level: true,
        hide_kana_only: false,
        hide_halfway_marker: false,
        require_learned: true,
        require_some_learned: false,
        distinguish_beyond_guru: false,
        slim_view: false,
        zero_left: false,
        keep_progress_bar: false,
        colorcode_apprentice: '#f300a2',
        colorcode_guru: '#9d34b7',
        colorcode_master: '#4867e0',
        colorcode_enlightened: '#00a5f7',
        colorcode_burned: '#fbb41c',
        opacity_apprentice: 100,
        opacity_guru: 100,
        opacity_master: 100,
        opacity_enlightened: 100,
        opacity_burned: 100,
        opacity_multiplier_apprentice: 70,
        opacity_multiplier_guru: 70,
        highlight_level_threshold: true,
        use_gradient: false,
        gradient_apprentice: '#222222',
        gradient_guru: '#222222',
        gradient_master: '#222222',
        gradient_enlightened: '#222222',
        gradient_burned: '#222222'
    };

    function render(json) {
        const burnStage = 9;
        const enlightenedStage = 8;
        const masterStage = 7;
        const guruStage = 5;
        const apprenticeStage = 1;
        const stageNames = ['', 'Apprentice I', 'Apprentice II', 'Apprentice III', 'Apprentice IV',
            'Guru I', 'Guru II', 'Master', 'Enlightened', 'Burned'
        ];

        function getDesiredLevel() {
            switch (settings.progress_hidden) {
                case 3:
                case 4:
                    return masterStage;
                case 5:
                case 6:
                    return enlightenedStage;
                case 7:
                case 8:
                    return burnStage;
                case 1:
                case 2:
                default:
                    return guruStage;
            }
        }

        const settings = window.wkof.settings.level_progress_detail;
        const usePassed = settings.progress_hidden % 2 == 0;
        const desiredLevel = getDesiredLevel();

        const burnedOpacity = 0.01 * settings.opacity_burned;
        const enlightenedOpacity = 0.01 * settings.opacity_enlightened;
        const masterOpacity = 0.01 * settings.opacity_master;
        const initialGuruOpacity = 0.01 * settings.opacity_guru;
        const guruOpacityChange = 0.01 * settings.opacity_multiplier_guru;
        const initialApprenticeOpacity = 0.01 * settings.opacity_apprentice;
        const apprenticeOpacityChange = 0.01 * settings.opacity_multiplier_apprentice;
        const markerThreshold = 0.97;

        const levelThreshold = settings.highlight_level_threshold;
        const thinHeader = settings.slim_view;
        const zeroLeft = settings.zero_left;
        const slimBar = settings.slim_view;

        const keepProgressBar = settings.keep_progress_bar;

        function getColorCode(stage) {
            if (stage >= burnStage) return settings.colorcode_burned;
            else if (stage >= enlightenedStage) return settings.colorcode_enlightened;
            else if (stage >= masterStage) return settings.colorcode_master;
            else if (stage >= guruStage) return settings.colorcode_guru;
            else if (stage >= apprenticeStage) return settings.colorcode_apprentice;
        }

        function getGradient(stage) {
            if (stage >= burnStage) return settings.gradient_burned;
            else if (stage >= enlightenedStage) return settings.gradient_enlightened;
            else if (stage >= masterStage) return settings.gradient_master;
            else if (stage >= guruStage) return settings.gradient_guru;
            else if (stage >= apprenticeStage) return settings.gradient_apprentice;
        }

        function totalAtLeast(progress, stage) {
            return progress.srs_level_totals.slice(stage).reduce((a, b) => a + b, 0);
        }

        const progressComponent = window.$(".wk-panel--level-progress > .wk-panel__content > .level-progress-dashboard");
        const scoreIndex = progressComponent.children().get().findIndex(obj => obj.id === "scoreboard");
        const score = scoreIndex == -1 ? null : progressComponent.children().slice(scoreIndex, scoreIndex + 1).detach();
        const index = keepProgressBar ? -3 : -2;
        progressComponent.children().slice(0, index).remove();
        if (settings.hide_current_level) {
            progressComponent.children().slice(-2).remove();
            progressComponent.append("<div/><div/>");
        }
        if (scoreIndex != -1) score.appendTo(progressComponent);
        progressComponent.children().eq(index).css("margin-top", "18px"); // Add space to element after last progression

        let progresses = [];
        while (json.progresses.length > settings.unconditional_progressions) {
            const progress = json.progresses[0];
            const total_learned = totalAtLeast(progress, apprenticeStage);
            const desiredPlusTotal = totalAtLeast(progress, desiredLevel);
            const learnedRequired = settings.require_learned ? progress.max : 0;
            const percentageTotal = usePassed ? progress.passed_total : desiredPlusTotal;

            if (!(percentageTotal * 100.0 / progress.max >= settings.progress_hidden_percentage &&
                    total_learned >= learnedRequired) && progress.max !== 0 &&
                (!settings.require_some_learned || total_learned > 0)) {
                progresses.push(progress);
            }
            json.progresses = json.progresses.slice(1);
        }

        json.progresses = progresses.concat(json.progresses);

        let runningHTML = "";
        json.progresses.forEach(function(progress) {
            const user_specified_marker = 0.01 * settings.progress_hidden_percentage;
            const fontFamily = '\'Open Sans\', \'Helvetica Neue\', Helvetica, Arial, sans-serif;'
            const commonMarkerStyle = 'height:100% !important;position:absolute !important;padding-right:0.5em ' +
                    '!important;font-family:' + fontFamily + 'text-align:right;-webkit-box-sizing:border-box;' +
                    '-moz-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:1px 0 0 #eee;' +
                    '-moz-box-shadow:1px 0 0 #eee;box-shadow:1px 0 0 #eee;text-shadow:0 1px 0 rgba(255,255,255,0.5);' +
                    'margin-top:2px;';
            let html =
                '<div id="progress-' + progress.level + '-' + progress.type + '" class="vocab-progress"><h3 ' +
                (thinHeader ? 'style="font-size:14px;font-weight:300;line-height:0.2;letter-spacing:0px;margin:9px 0;' +
                    'font-family:' + fontFamily + '"' :
                    'style="font-size:18px;font-weight:300;line-height:1.4;letter-spacing:-1px;margin:9px 0;' +
                    'font-family:' + fontFamily + '"') +
                '>Level ' + progress.level + ' ' + progress.type.charAt(0).toUpperCase() + progress.type.slice(1) +
                ' Progress</h3><div class="chart" style="position:relative;">' +
                // ===== USER-SPECIFIED % MARKER =====
                (progress.max < 10 || Math.round(progress.max * user_specified_marker) == progress.max ? "" :
                    '<div class="threshold" style="' + commonMarkerStyle + 'width: ' +
                    Math.round(progress.max * user_specified_marker) * 100 / progress.max + '% !important; ' +
                    'color:#a6a6a6 !important;border-right:1px solid rgba(0,0,0,0.1);">' +
                    '<div style="position:absolute;bottom:0;right:0;">' +
                    (user_specified_marker <= markerThreshold ? Math.round(progress.max * user_specified_marker) : "") +
                    '&nbsp;</div></div>') +
                // ===== CURRENT LEVEL KANJI PASSING MARKER =====
                (progress.max < 10 || progress.type != "kanji" || progress.passed_total >=
                    Math.ceil(progress.max * 0.9) ? "" : '<div class="threshold" style="' + commonMarkerStyle +
                    'width: ' + Math.ceil(progress.max * 0.9) * 100 / progress.max + '% !important;color:' +
                    (levelThreshold ? 'rgb(0, 220, 0, 1)' : '#a6a6a6') + ' !important;border-right:1px solid rgba(0,' +
                    (levelThreshold ? '220' : '0') + ',0,1);"><div style="font-weight:' +
                    (levelThreshold ? 'bold;' : 'normal;') + 'position:absolute;bottom:0;right:0;">' +
                    Math.ceil(progress.max * 0.9) + '&nbsp;</div></div>') +
                // ===== 50% MARKER =====
                (progress.max < 2 || settings.hide_halfway_marker ? "" :
                    '<div class="threshold" style="' + commonMarkerStyle + 'width: ' +
                     Math.ceil(progress.max * 0.5) * 100 / progress.max + '% !important;color:#a6a6a6 !important;' +
                    'border-right:1px solid rgba(0,0,0,0.1);"><div style="position:absolute;bottom:0;right:0;">' +
                    Math.ceil(progress.max * 0.5) + '&nbsp;</div></div>') +
                // ==== UNSTARTED BAR ====
                '<div class="level-progress-bar" title="Unstarted (' + progress.srs_level_totals[0] + '/' +
                     progress.max + ')" style="border-radius:' + settings.border_radius + 'px !important;' +
                     (slimBar ? 'height:10px;' : '') + '">';

            const beyondGuru = settings.distinguish_beyond_guru;
            const gurued_plus_total = totalAtLeast(progress, guruStage);
            let opacity = beyondGuru ? burnedOpacity : initialGuruOpacity;
            for (let i = beyondGuru ? stageNames.length - 1 : guruStage; i >= apprenticeStage; i--) {
                const name = (!beyondGuru && i == guruStage) ? "Guru+" : stageNames[i];
                const total = (!beyondGuru && i == guruStage) ? gurued_plus_total : progress.srs_level_totals[i];
                const percentage = total * 100.0 / progress.max;
                const gradient = "linear-gradient(to bottom, " + getColorCode(i) + ", " +
                      (settings.use_gradient ? getGradient(i) : getColorCode(i)) + ")";

                // ==== SRS STAGE BAR ====
                html +=
                    '<div class="bar bar-supplemental"  title="' + name + ' (' + total + '/' + progress.max +
                    ')" style="float: left !important; opacity: ' + opacity + ' !important; background-color: #a100f1' +
                    ' !important; background-image: ' + gradient + ' !important; width: ' + (percentage) +
                    '% !important; height: 100% !important; margin:0px !important; border-radius:' +
                    settings.border_radius + 'px !important;">' +
                    '<span class="dark" style="display: none;"></span>' +
                    '</div>';

                if (i == burnStage) opacity = enlightenedOpacity;
                else if (i == enlightenedStage) opacity = masterOpacity;
                else if (i == masterStage) opacity = initialGuruOpacity;
                else if (i > guruStage) opacity *= guruOpacityChange;
                else if (i == guruStage) opacity = initialApprenticeOpacity;
                else opacity *= apprenticeOpacityChange;
            }

            let unlockedCount = 0;
            progress.srs_level_totals.forEach(function(srs_level_total) {
                unlockedCount += srs_level_total;
            });
            const lockedCount = progress.max - unlockedCount;
            const notStartedWidth = progress.srs_level_totals[0] * 100.0 / progress.max;
            const lockedWidth = lockedCount * 100.0 / progress.max;

            // ==== LOCKED BAR ====
            html +=
                '<div class="bar bar-supplemental" title="Locked (' + lockedCount + '/' + progress.max +
                ')" style="float:left !important; background-color: #a8a8a8 !important; background-image: ' +
                locked_data_url + ' !important; width: ' + lockedWidth + '% !important; height: 100% !important; ' +
                'margin:0px !important; margin-left: ' + notStartedWidth + '% !important; border-radius:' +
                settings.border_radius + 'px !important;"> <span class="dark" style="display: none;"></span>' +
                '</div>';

            const total = gurued_plus_total == progress.max || zeroLeft ? 0 : gurued_plus_total;
            // ==== TOTAL ====
            html +=
                '</div><span class="total" style="position:relative !important; bottom:-2px">' + total + '</span>' +
                '<span class="pull-right total" style="margin-top:2px; float:right;">' + progress.max + '</span>' +
                '</div>' +
                '</div>';

            runningHTML += html;
        });
        progressComponent.prepend(runningHTML);
    }

    function prepareForRender() {
        const cached_json = localStorage.getItem('level-progress-cache');
        if (cached_json) render(JSON.parse(cached_json));

        window.wkof.ready('ItemData, Apiv2').then(() => {
            window.wkof.Apiv2.get_endpoint('level_progressions').then(levels => {
                let level_list = [];
                for (let id in levels) {
                    level_list.push(levels[id]);
                }
                const top_level = (level_list.find(l => l.data.abandoned_at == null &&
                        l.data.passed_at == null && l.data.unlocked_at != null) ||
                    level_list.slice(-1)[0]).data.level;
                window.wkof.ItemData.get_items('assignments').then(items => {
                    let collection = [];
                    if (window.wkof.settings.level_progress_detail.hide_kana_only) {
                        items = items.filter(item => item.object !== 'kana_vocabulary');
                    } else {
                        items = items.map(item => Object.assign({}, item, {object: item.object === 'kana_vocabulary' ? 'vocabulary' : item.object}));
                    }
                    items.forEach(item => {
                        let prog = collection.find(p => p.level == item.data.level && p.type == item.object);
                        if (prog == undefined) {
                            prog = {
                                level: item.data.level,
                                type: item.object,
                                srs_level_totals: Array(10).fill(0),
                                passed_total: 0,
                                max: 0
                            };
                            collection.push(prog);
                        }
                        if (item.assignments != undefined && item.assignments.unlocked_at != null) {
                            prog.srs_level_totals[item.assignments.srs_stage]++;
                            if (item.assignments.passed_at != null) {
                                prog.passed_total++;
                            }
                        }
                        prog.max++;
                    });
                    collection = collection.filter(p => p.level <= top_level).sort((a, b) => {
                        let order = ['radical', 'kanji', 'vocabulary'];
                        return a.level - b.level + (order.indexOf(a.type) - order.indexOf(b.type)) / 10;
                    });
                    const json = {
                        progresses: collection
                    };
                    localStorage.setItem('level-progress-cache', JSON.stringify(json));
                    if (cached_json != json) {
                        render(json);
                    }
                }); // assignments
            }); // level progressions
        }); // Item Data, APIv2
    }

    window.wkof.ready('Menu,Settings').then(load_settings).then(install_menu).then(prepareForRender);

    // Load settings and set defaults
    function load_settings() {
        return window.wkof.Settings.load('level_progress_detail', defaults);
    }

    // Installs the options button in the menu
    function install_menu() {
        const config = {
            name: 'level_progress_detail_settings',
            submenu: 'Settings',
            title: 'Dashboard Level Progress Detail',
            on_click: open_settings
        };
        window.wkof.Menu.insert_script_link(config);
    }

    // Create the options
    function open_settings() {
        const config = {
            script_id: 'level_progress_detail',
            title: 'Dashboard Level Progress Detail',
            content: {
                tabs: {
                    type: 'tabset',
                    content: {
                        pgFilter: {
                            type: 'page',
                            label: 'Filters',
                            content: {
                                progress_hidden: {
                                    type: 'dropdown',
                                    label: 'Progress hidden criteria',
                                    hover_tip: 'Choose criteria for what progress to hide',
                                    default: defaults.progress_hidden,
                                    content: {
                                        1: 'Guru or higher right now',
                                        2: 'Has been guru or higher at any point',
                                        3: 'Master or higher right now',
                                        4: 'Has been master or higher at any point',
                                        5: 'Enlightened or higher right now',
                                        6: 'Has been enlightened or higher at any point',
                                        7: 'Burnt right now',
                                        8: 'Has been burnt at any point'
                                    },
                                    on_change: prepareForRender
                                },
                                progress_hidden_percentage: {
                                    type: 'number',
                                    label: 'Progress hidden percentage',
                                    hover_tip: 'Determines the percentage of progress necessary to hide',
                                    min: 0,
                                    max: 100,
                                    step: 1,
                                    default: defaults.progress_hidden_percentage,
                                    on_change: prepareForRender
                                },
                                unconditional_progressions: {
                                    type: 'number',
                                    label: 'Progressions shown unconditionally',
                                    hover_tip: '3 always shows current level radical, kanji, & vocab progress',
                                    min: 0,
                                    default: defaults.unconditional_progressions,
                                    on_change: prepareForRender
                                },
                                border_radius: {
                                    type: 'number',
                                    label: 'Roundedness of progression (in pixels)',
                                    hover_tip: 'Choose zero for no roundedness, and 10 for maximum roundedness.',
                                    min: 0,
                                    default: defaults.border_radius,
                                    on_change: prepareForRender
                                },
                                hide_current_level: {
                                    type: 'checkbox',
                                    label: 'Hide current level items',
                                    hover_tip: 'Enable to hide the list of radicals and kanji.',
                                    default: defaults.hide_current_level,
                                    on_change: prepareForRender
                                },
                                hide_kana_only: {
                                    type: 'checkbox',
                                    label: 'Hide kana-only vocab',
                                    hover_tip: 'Enable to exclude kana-only vocab from vocabulary.',
                                    default: defaults.hide_kana_only,
                                    on_change: prepareForRender
                                },
                                hide_halfway_marker: {
                                    type: 'checkbox',
                                    label: 'Hide halfway marker',
                                    hover_tip: 'Enable to remove 50% marker.',
                                    default: defaults.hide_halfway_marker,
                                    on_change: prepareForRender
                                },
                                require_learned: {
                                    type: 'checkbox',
                                    label: 'Require all items to be learned to hide',
                                    hover_tip: 'Enable to require all items of a progression to have lessons complete.',
                                    default: defaults.require_learned,
                                    on_change: prepareForRender
                                },
                                require_some_learned: {
                                    type: 'checkbox',
                                    label: 'Require one item to be learned to show',
                                    hover_tip: 'Enable to require some item of a progression to have lessons complete.',
                                    default: defaults.require_some_learned,
                                    on_change: prepareForRender
                                },
                                distinguish_beyond_guru: {
                                    type: 'checkbox',
                                    label: 'Distinguish beyond Guru',
                                    hover_tip: 'Show different colored bars for Guru, Master, Enlightened and Burned',
                                    default: defaults.distinguish_beyond_guru,
                                    on_change: prepareForRender
                                },
                                slim_view: {
                                    type: 'checkbox',
                                    label: 'Slim view',
                                    hover_tip: 'Make script view take up less space',
                                    default: defaults.slim_view,
                                    on_change: prepareForRender
                                },
                                zero_left: {
                                    type: 'checkbox',
                                    label: 'Zero left',
                                    hover_tip: 'Replace guru or above total with zero',
                                    default: defaults.zero_left,
                                    on_change: prepareForRender
                                },
                                keep_progress_bar: {
                                    type: 'checkbox',
                                    label: 'Keep unmodified progress bar',
                                    hover_tip: 'Keep unmodified progress bar for script compatibility',
                                    default: defaults.keep_progress_bar,
                                    on_change: prepareForRender
                                }
                            }
                        },
                        pgColor: {
                            type: 'page',
                            label: 'Colors',
                            content: {
                                colorcode_apprentice: {
                                    type: 'color',
                                    label: 'Color Apprentice',
                                    hover_tip: 'Color for your Apprentice Progression bar',
                                    default: defaults.colorcode_apprentice,
                                    on_change: prepareForRender
                                },
                                colorcode_guru: {
                                    type: 'color',
                                    label: 'Color Guru',
                                    hover_tip: 'Color for your Guru Progression bar',
                                    default: defaults.colorcode_guru,
                                    on_change: prepareForRender
                                },
                                colorcode_master: {
                                    type: 'color',
                                    label: 'Color Master',
                                    hover_tip: 'Color for your Master Progression bar',
                                    default: defaults.colorcode_master,
                                    on_change: prepareForRender
                                },
                                colorcode_enlightened: {
                                    type: 'color',
                                    label: 'Color Enlightened',
                                    hover_tip: 'Color for your Enlightend Progression Bar',
                                    default: defaults.colorcode_enlightened,
                                    on_change: prepareForRender
                                },
                                colorcode_burned: {
                                    type: 'color',
                                    label: 'Color Burned',
                                    hover_tip: 'Color for your Burned Progression Bar',
                                    default: defaults.colorcode_burned,
                                    on_change: prepareForRender
                                },
                                opacity_apprentice: {
                                    type: 'number',
                                    label: 'Apprentice Opacity',
                                    hover_tip: 'Integer between 1 and 100 to set opacity of highest Apprentice rank',
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    default: defaults.opacity_apprentice,
                                    on_change: prepareForRender
                                },
                                opacity_guru: {
                                    type: 'number',
                                    label: 'Guru Opacity',
                                    hover_tip: 'Integer between 1 and 100 to set opacity of highest Guru rank',
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    default: defaults.opacity_guru,
                                    on_change: prepareForRender
                                },
                                opacity_master: {
                                    type: 'number',
                                    label: 'Master Opacity',
                                    hover_tip: 'Integer between 1 and 100 to set opacity of Master rank',
                                    min: 1,
                                    max: 100,
                                    step: '1',
                                    default: defaults.opacity_master,
                                    on_change: prepareForRender
                                },
                                opacity_enlightened: {
                                    type: 'number',
                                    label: 'Enlightened Opacity',
                                    hover_tip: 'Integer between 1 and 100 to set opacity of Enlightened rank',
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    default: defaults.opacity_enlightened,
                                    on_change: prepareForRender
                                },
                                opacity_burned: {
                                    type: 'number',
                                    label: 'Burned Opacity',
                                    hover_tip: 'Integer between 1 and 100 to set opacity of Burned rank',
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    default: defaults.opacity_burned,
                                    on_change: prepareForRender
                                },
                                opacity_multiplier_apprentice: {
                                    type: 'number',
                                    label: 'Fading multiplier Apprentice',
                                    hover_tip: 'Integer between 1 and 100 to set speed of Apprentice rank color fade',
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    default: defaults.opacity_multiplier_apprentice,
                                    on_change: prepareForRender
                                },
                                opacity_multiplier_guru: {
                                    type: 'number',
                                    label: 'Fading multiplier Guru',
                                    hover_tip: 'Integer between 1 and 100 to set speed of Guru rank color fade',
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    default: defaults.opacity_multiplier_guru,
                                    on_change: prepareForRender
                                },
                                highlight_level_threshold: {
                                    type: 'checkbox',
                                    label: 'Highlight level-up threshold',
                                    hover_tip: 'Show level-up threshold in bold green font',
                                    default: defaults.highlight_level_threshold,
                                    on_change: prepareForRender
                                }
                            }
                        },
                        pgGradient: {
                            type: 'page',
                            label: 'Gradients',
                            content: {
                                use_gradient: {
                                    type: 'checkbox',
                                    label: 'Use Gradient (3D effect)',
                                    hover_tip: 'If enabled, bars use a gradient: main on top, gradient color on bottom',
                                    default: defaults.use_gradient,
                                    on_change: prepareForRender
                                },
                                gradient_apprentice: {
                                    type: 'color',
                                    label: 'Bottom color Apprentice',
                                    hover_tip: 'Bottom color for Apprentice Progress bar if "Use Gradient" is active',
                                    default: defaults.gradient_apprentice,
                                    on_change: prepareForRender
                                },
                                gradient_guru: {
                                    type: 'color',
                                    label: 'Bottom color Guru',
                                    hover_tip: 'Bottom color for Guru Progress bar if "Use Gradient" is active',
                                    default: defaults.gradient_guru,
                                    on_change: prepareForRender
                                },
                                gradient_master: {
                                    type: 'color',
                                    label: 'Bottom color Master',
                                    hover_tip: 'Bottom color for Master Progress bar if "Use Gradient" is active',
                                    default: defaults.gradient_master,
                                    on_change: prepareForRender
                                },
                                gradient_enlightened: {
                                    type: 'color',
                                    label: 'Bottom color Enlightened',
                                    hover_tip: 'Bottom color for Enlightened Progress bar if "Use Gradient" is active',
                                    default: defaults.gradient_enlightened,
                                    on_change: prepareForRender
                                },
                                gradient_burned: {
                                    type: 'color',
                                    label: 'Bottom color Burned',
                                    hover_tip: 'Bottom color for Burned Progress bar if "Use Gradient" is active',
                                    default: defaults.gradient_burned,
                                    on_change: prepareForRender
                                }
                            }
                        }
                    }
                }
            }
        }
        const dialog = new window.wkof.Settings(config);
        dialog.open();
    }
})();
