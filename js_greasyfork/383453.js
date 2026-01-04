// ==UserScript==
// @name         Wanikani: Judgement Day
// @namespace    Wanikani: Judgement Day
// @version      1.1.2
// @description  Changes the lesson and review numbers' colors based on how many items you have pending
// @author       Kumirei
// @include      https://www.wanikani.com*
// @include      *preview.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383453/Wanikani%3A%20Judgement%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/383453/Wanikani%3A%20Judgement%20Day.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function() {
    // Make sure WKOF is installed
    if (!wkof) {
        var response = confirm('Wanikani: Judgement Day requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
        if (response) window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    else {
        wkof.include('Menu,Settings');
        wkof.ready('Menu,Settings').then(load_settings).then(install_menu).then(judge_user);
    }

    // Brings down the hammer and sentence users to death
    function judge_user() {
        var types = ['lessons', 'reviews', 'levels'];
        for (var i = 0; i<types.length; i++) {
            var type = types[i];
            if (wkof.settings.wanikani_judgement[type].judge) {
                let target, count;
                if (type != "levels") {
                    target = '.navigation-shortcut--'+type+' span';
                    count = Number($(target)[0].innerText);
                }
                else {
                    target = '.sitemap .sitemap__section:first-child';
                    count = Number($('li.user-summary__attribute a')[0].href.split('/level/')[1]);
                }
                let color;
                if (wkof.settings.wanikani_judgement[type].gradient) {
                    var max = wkof.settings.wanikani_judgement[type].max;
                    var start_color = wkof.settings.wanikani_judgement[type].start;
                    var end_color = wkof.settings.wanikani_judgement[type].end;
                    color = get_gradient_color(count, max, end_color, start_color);
                }
                else {
                    var intervals = wkof.settings.wanikani_judgement[type].intervals;
                    var colors = wkof.settings.wanikani_judgement[type].colors;
                    color = get_interval_color(count, intervals, colors);
                }
                if (type == "levels") target = ".dashboard-level";
                if ($(target)) $(target)[0].style.background = color;
            }
        }
    }

    // Returns the corresponding color from the gradient
    function get_gradient_color(count, max, color1, color2) {
        var severity = count/max;
        if (severity > 1) severity = 1;
        var color = gradient_color(hex_to_rgb(color1), hex_to_rgb(color2), severity);
        return 'rgb('+color.join()+')';
    }


    // Returns a color between the two given ones, based on the provided weight
    function gradient_color(color1, color2, weight) {
        var w1 = weight;
        var w2 = 1 - w1;
        var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
        return rgb;
    }

    // Returns the corresponding color from the interval
    function get_interval_color(count, intervals, colors) {
        intervals = intervals.replace(/ /g, '').split(',');
        colors = colors.replace(/ /g, '').split(',');
        var color;
        for (var i = 0; i < intervals.length; i++) {
            if (count >= intervals[i]) color = colors[i];
        }
        return color;
    }

    // SETTINGS
    // ----------------------------------------------------------------------------------------------------------

    // Loads settings from storage or uses defaults
    const wk_colors = "#8c8c8c, #DD0093, #882D9E, #294DDB, #0093DD, #434343, #fbc042";
    const bd_colors = "#8c8c8c, #1d99f3, #1cdc9a, #C9CE3B, #F67400, #DA4453, #fbc042";
    var clrs = ($('body').css('background-color') == 'rgb(49, 54, 59)') ? bd_colors : wk_colors;
    function load_settings() {
        var defaults = {
            lessons: {
                judge: true,
                gradient: false,
                start: "#ffffff",
                end: "#000000",
                max: 150,
                intervals: "0, 10, 20, 40, 80, 120",
                colors: clrs,
                test_color: "#ffffff"
            },
            reviews: {
                judge: true,
                gradient: false,
                start: "#ffffff",
                end: "#000000",
                max: 700,
                intervals: "0, 50, 100, 200, 500, 700",
                colors: clrs,
                test_color: "#ffffff"
            },
            levels: {
                judge: true,
                gradient: false,
                start: "#ffffff",
                end: "#000000",
                max: 60,
                intervals: "0, 10, 20, 30, 40, 50, 60",
                colors: clrs,
                test_color: "#ffffff"
            }
        };
        return wkof.Settings.load('wanikani_judgement', defaults);
    }

    // Add settings menu to the menu
    function install_menu() {
        var config = {
            name: 'wanikani_judegement_settings',
            submenu: 'Settings',
            title: 'Judgement Day',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    // Define settings menu layout
    function open_settings(items) {
        var config = {
            script_id: 'wanikani_judgement',
            title: 'Judgement Day',
            content: {
                tabs: {
                    type: 'tabset',
                    content: {
                        lessons: {
                            type: 'page',
                            label: 'Lessons',
                            content: {
                                general_group: {
                                    type: 'group',
                                    label: 'General',
                                    content: {
                                        lesson_judge: {
                                            type: 'checkbox',
                                            label: 'Judge Lessons',
                                            default: true,
                                            hover_tip: 'Apply script on lesson count',
                                            path: '@lessons.judge'
                                        }
                                    }
                                },
                                gradient_group: {
                                    type: 'group',
                                    label: 'Gradient',
                                    content: {
                                        lesson_gradient: {
                                            type: 'checkbox',
                                            label: 'Gradient',
                                            default: false,
                                            hover_tip: 'Determine the color based on an even gradient',
                                            path: '@lessons.gradient'
                                        },
                                        lesson_start_color: {
                                            type: 'color',
                                            label: 'Start color',
                                            hover_tip: 'The start of the gradient',
                                            default: "#ffffff",
                                            on_change: update_label,
                                            path: '@lessons.start'
                                        },
                                        lesson_end_color: {
                                            type: 'color',
                                            label: 'End color',
                                            hover_tip: 'The end of the gradient',
                                            default: "#000000",
                                            on_change: update_label,
                                            path: '@lessons.end'
                                        },
                                        lesson_max_value: {
                                            type: 'number',
                                            label: 'Max value',
                                            hover_tip: 'The end of the gradient',
                                            default: 150,
                                            path: '@lessons.max'
                                        }
                                    }
                                },
                                interval_group: {
                                    type: 'group',
                                    label: 'Intervals',
                                    content: {
                                        lesson_intervals: {
                                            type: 'text',
                                            label: 'Intervals',
                                            hover_tip: 'Comma separated list of upper bounds for the different colors. I.E "0, 50, 100," and so on.',
                                            default: "0, 10, 20, 40, 80, 120",
                                            path: '@lessons.intervals'
                                        },
                                        lesson_colors: {
                                            type: 'text',
                                            label: 'Interval Colors',
                                            hover_tip: 'Comma separated list of color codes for the intervals.',
                                            default: clrs,
                                            path: '@lessons.colors'
                                        },
                                        lessons_test_color: {
                                            type: 'color',
                                            label: 'Color Picker',
                                            hover_tip: 'Not a setting, just a color picker.',
                                            default: "#ffffff",
                                            on_change: update_label,
                                            path: '@lessons.test_color'
                                        }
                                    }
                                }
                            }
                        },
                        reviews: {
                            type: 'page',
                            label: 'Reviews',
                            content: {
                                general_group: {
                                    type: 'group',
                                    label: 'General',
                                    content: {
                                        review_judge: {
                                            type: 'checkbox',
                                            label: 'Judge Reviews',
                                            default: true,
                                            hover_tip: 'Apply script on review count',
                                            path: '@reviews.judge'
                                        }
                                    }
                                },
                                gradient_group: {
                                    type: 'group',
                                    label: 'Gradient',
                                    content: {
                                        review_gradient: {
                                            type: 'checkbox',
                                            label: 'Gradient',
                                            default: false,
                                            hover_tip: 'Determine the color based on an even gradient',
                                            path: '@reviews.gradient'
                                        },
                                        review_start_color: {
                                            type: 'color',
                                            label: 'Start color',
                                            hover_tip: 'The start of the gradient',
                                            default: "#ffffff",
                                            on_change: update_label,
                                            path: '@reviews.start'
                                        },
                                        review_end_color: {
                                            type: 'color',
                                            label: 'End color',
                                            hover_tip: 'The end of the gradient',
                                            default: "#000000",
                                            on_change: update_label,
                                            path: '@reviews.end'
                                        },
                                        review_max_value: {
                                            type: 'number',
                                            label: 'Max value',
                                            hover_tip: 'The end of the gradient',
                                            default: 700,
                                            path: '@reviews.max'
                                        }
                                    }
                                },
                                interval_group: {
                                    type: 'group',
                                    label: 'Intervals',
                                    content: {
                                        review_intervals: {
                                            type: 'text',
                                            label: 'Intervals',
                                            hover_tip: 'Comma separated list of upper bounds for the different colors. I.E "0, 50, 100," and so on.',
                                            default: "0, 50, 100, 200, 500, 700",
                                            path: '@reviews.intervals'
                                        },
                                        review_colors: {
                                            type: 'text',
                                            label: 'Interval Colors',
                                            hover_tip: 'Comma separated list of color codes for the intervals.',
                                            default: clrs,
                                            path: '@reviews.colors'
                                        },
                                        reviews_test_color: {
                                            type: 'color',
                                            label: 'Color Picker',
                                            hover_tip: 'Not a setting, just a color picker.',
                                            default: "#ffffff",
                                            on_change: update_label,
                                            path: '@reviews.test_color'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        if ($('.dashboard-level').length) {
            config.content.tabs.content.levels = {
                type: 'page',
                label: 'Levels',
                content: {
                    general_group: {
                        type: 'group',
                        label: 'General',
                        content: {
                            level_judge: {
                                type: 'checkbox',
                                label: 'Judge Level',
                                default: true,
                                hover_tip: 'Apply script on level',
                                path: '@levels.judge'
                            }
                        }
                    },
                    gradient_group: {
                        type: 'group',
                        label: 'Gradient',
                        content: {
                            level_gradient: {
                                type: 'checkbox',
                                label: 'Gradient',
                                default: false,
                                hover_tip: 'Determine the color based on an even gradient',
                                path: '@levels.gradient'
                            },
                            level_start_color: {
                                type: 'color',
                                label: 'Start color',
                                hover_tip: 'The start of the gradient',
                                default: "#ffffff",
                                on_change: update_label,
                                path: '@levels.start'
                            },
                            level_end_color: {
                                type: 'color',
                                label: 'End color',
                                hover_tip: 'The end of the gradient',
                                default: "#000000",
                                on_change: update_label,
                                path: '@levels.end'
                            },
                            level_max_value: {
                                type: 'number',
                                label: 'Max value',
                                hover_tip: 'The end of the gradient',
                                default: 60,
                                path: '@levels.max'
                            }
                        }
                    },
                    interval_group: {
                        type: 'group',
                        label: 'Intervals',
                        content: {
                            level_intervals: {
                                type: 'text',
                                label: 'Intervals',
                                hover_tip: 'Comma separated list of upper bounds for the different colors. I.E "0, 50, 100," and so on.',
                                default: "0, 10, 20, 30, 40, 50, 60",
                                path: '@levels.intervals'
                            },
                            level_colors: {
                                type: 'text',
                                label: 'Interval Colors',
                                hover_tip: 'Comma separated list of color codes for the intervals.',
                                default: clrs,
                                path: '@levels.colors'
                            },
                            levels_test_color: {
                                type: 'color',
                                label: 'Color Picker',
                                hover_tip: 'Not a setting, just a color picker.',
                                default: "#ffffff",
                                on_change: update_label,
                                path: '@levels.test_color'
                            }
                        }
                    }
                }
            };
        }

        var dialog = new wkof.Settings(config);
        dialog.open();
        add_color_codes();
    }

    // Add color codes to settings menu colors
    function add_color_codes() {
        $('head').append('<style id="JudgementDayCSS">'+
        '#wkof_ds .ui-dialog[aria-describedby="wkofs_wanikani_judgement"] .wkof_settings .color_label {'+
        '    position: absolute;'+
        '    line-height: 30px;'+
        '    text-align: center;'+
        '    text-shadow: none;'+
        '    background: transparent !important;'+
        '    width: 80px !important;'+
        '    left: 50%;'+
        '    transform: translate(-50%, 0);'+
        '    box-shadow: none !important;'+
        '    border: none !important;'+
        '}'+
        '</style>');
        $('.wkof_settings input[type="color"]').each((i, e)=>{
            e.parentElement.style.position = "relative";
            var color = e.value;
            var text_color = contrast_color(color);
            var label = $('<input class="color_label" style="color:'+text_color+' !important"></input>')[0];
            label.value = color;
            label.onkeyup = (event)=>{
                var hex = event.target.value;
                if (validate_hex(hex)) {
                    e.value = hex;
                    update_label(e.name, hex);
                    var name = e.name.replace(/reviews_|lessons_/,'');
                    wkof.settings.wanikani_heatmap[$('#wkofs_wanikani_judgement .ui-tabs-active')[0].innerText.toLowerCase()][name] = hex;
                }
            };
            $(e).before(label);
        });
    }

    // Updates the label of the color input
    function update_label(name, value) {
        var e = $('#wanikani_judgement_'+name)[0].previousSibling;
        e.value = value;
        $(e).attr('style', 'color: '+contrast_color(value)+' !important');
    }

    // Choses black or white as a contrast to the given color
    function contrast_color(color) {
        var [r, g, b] = hex_to_rgb(color);
        return (r+b+g)/(255*3) > 0.5 ? '#000000' : '#FFFFFF';
    }
    // Converts a hex color to rgb
    function hex_to_rgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    }
})();
