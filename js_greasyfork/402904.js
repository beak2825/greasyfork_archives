// ==UserScript==
// @name        Wanikani Forecast Details
// @namespace   https://www.wanikani.com
// @author      kernfel
// @description Adds markup & tooltips for item types, critical reviews, burn reviews to the forecast and review buttons
// @version     1.5.5
// @include     /^https://(www|preview).wanikani.com/(dashboard)?$/
// @copyright   2020+, Felix Kern
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/397661/Wanikani%20Forecast%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/397661/Wanikani%20Forecast%20Details.meta.js
// ==/UserScript==

(function() {

    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Forecast Details';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    wkof.include('ItemData,Menu,Settings');
    wkof.ready('document,ItemData,Settings')
        .then(install_menu)
        .then(load_settings)
        .then(startup);

    //========================================================================
    // Settings
    //-------------------------------------------------------------------
    var settings;
    function load_settings() {
        var defaults = {
            crit_highlight: true,
            crit_highlight_now: true,
            add_crit_icon: true,
            add_crit_icon_now: true,
            crit_icon: '🔺',

            burn_highlight: true,
            burn_highlight_now: true,
            add_burn_icon: true,
            add_burn_icon_now: true,
            burn_icon: '🔥',

            bar_colours: 'type'
        };
        wkof.Settings.load('forecast_details', defaults).then(function(){
            settings = wkof.settings.forecast_details
        });
    }

    //========================================================================
    // Startup
    //-------------------------------------------------------------------
    function startup() {
        install_css();

        wkof.ItemData.get_items({
            wk_items:{
                options:{
                    assignments:true
                },
                filters:{
                    srs: '1,2,3,4,5,6,7,8',
                    level: '1..+0'
                }
            }
        })
        .then(process_items);

        wkof.ItemData.get_items({
            wk_items:{
                options:{
                    assignments:true
                },
                filters:{
                    srs: '1,2,3,4',
                    level: '+0',
                    item_type: 'rad,kan'
                }
            }
        })
        .then(process_crits);
    }

    //========================================================================
    // CSS Styling
    //-------------------------------------------------------------------
    var fcr_css =
        // Bar highlights
        '.fcr_apprentice { background: #59c27450; }'+
        '.fcr_burn { background: #fbc04250; }'+
        '.fcr_burn.fcr_apprentice { background: #aac15b50; }'+

        // Review buttons
        '.lessons-and-reviews__button span.fcr_apprentice, .navigation-shortcut a.fcr_apprentice { background: #59c274; text-shadow: none; color: white; }'+
        '.lessons-and-reviews__button span.fcr_burn, .navigation-shortcut a.fcr_burn { background: #fbc042; text-shadow: none; color: white; }'+
        '.lessons-and-reviews__button span.fcr_apprentice.fcr_burn, .navigation-shortcut a.fcr_apprentice.fcr_burn { background: #aac15b; }'+

        // Item type bar split
        '.fcr_radical { background: #00AAFF; }'+
        '.fcr_kanji { background: #FF00AA; }'+
        '.fcr_vocab { background: #AA00FF; }'+

        // SRS level bar split
        '.fcr_bar_apprentice { background: #dd0093; }'+
        '.fcr_bar_guru { background: #882d9e; }'+
        '.fcr_bar_master { background: #294ddb; }'+
        '.fcr_bar_enlightened { background: #0093dd; }'+

        // Crit/burn icons
        '.fcr_icon { float: right; padding-right: 1px; }'+

        // Layout details
        '.fcr_split_bar { display: inline-block; }'+
        '.review-forecast__bar { min-width: 6px; }'+
        '.fcr_lineheight_fix { line-height: 0; }'+
        '.review-forecast__day.mb-3 { padding-bottom: 12px; }'+
        '.review-forecast__day.mb-3.is-collapsed { padding-bottom: 0; }'+
        '.review-forecast__hour.pb-2 { padding-bottom: 0 !important; }'+
        '.review-forecast__hour:last-child>* { padding-bottom: 0 !important; }'
    ;

    //========================================================================
    // Install stylesheet.
    //-------------------------------------------------------------------
    function install_css() {
        $('head').append('<style>'+fcr_css+'</style>');
    }

    //========================================================================
    // Add detailed information and burns to forecast bars & review buttons
    //-------------------------------------------------------------------
    function process_items(data) {
        var now = new Date(), rtime, counts = {}, stage;
        // Count typed reviews in each hour
        for ( var idx in data ) {
            if ( Date.parse(data[idx].assignments.available_at) - 7*24*3600*1000 < now ) {
                rtime = data[idx].assignments.available_at.split('.')[0];
                if ( Date.parse(data[idx].assignments.available_at) < now ) {
                    rtime = 'now';
                }
                if ( ! (rtime in counts) ) {
                    counts[rtime] = {
                        'radical':0,
                        'kanji':0,
                        'vocabulary':0,

                        'burn': {
                            'radical':0,
                            'kanji':0,
                            'vocabulary':0
                        },
                        'hasBurn': false,

                        4: 0, // Apprentice
                        5: 0, // Guru
                        7: 0, // Master
                        8: 0 // Enlightened
                    };
                }
                counts[rtime][data[idx].object]++; // counts by type
                stage = data[idx].assignments.srs_stage;
                if ( stage < 5 ) stage = 4;
                if ( stage == 6 ) stage = 5;
                counts[rtime][stage]++; // counts by srs stage
                if ( data[idx].assignments.srs_stage == 8 ) {
                    counts[rtime].burn[data[idx].object]++;
                    counts[rtime].hasBurn = true;
                }
            }
        }

        // Split forecast bars into types, add informative titles, and add burn markup
        var bar, tr, review_btn, w0, n, title;
        for ( rtime in counts ) {
            // Locate the review bar
            bar = $('section.forecast tr.review-forecast__hour time[datetime="' + rtime + 'Z"]')
                .parents('th').first().siblings('td').first().children('span').first();
            if ( !bar.length ) {
                continue;
            }
            tr = bar.parents('tr').first();

            // Split the bar into typed segments
            if ( settings.bar_colours == 'type' ) {
                split_bar(bar, counts[rtime], barsplit_type);
            } else if ( settings.bar_colours == 'srs' ) {
                split_bar(bar, counts[rtime], barsplit_srs);
            }

            // Add tooltips and burn highlights
            tr.attr('title', setTitle(counts[rtime], 'Total reviews'))
                .attr('title', setTitleByLevel(counts[rtime]));
            if ( counts[rtime].hasBurn ) {
                tr.attr('title', setTitle(counts[rtime].burn, 'Burn'));
                if ( settings.burn_highlight ) {
                    tr.addClass('fcr_burn');
                }
                if ( settings.add_burn_icon ) {
                    tr.children('th').append('<span class="fcr_icon fcr_icon_burn">' + settings.burn_icon + '</span>');
                }
            }
        }

        // Add currently available info & burns the review buttons
        if ( 'now' in counts ) {
            review_btn = $('a.lessons-and-reviews__reviews-button, li.navigation-shortcut--reviews')
                .attr('title', setTitle(counts.now, 'Total reviews'))
                .attr('title', setTitleByLevel(counts.now));
            if ( counts.now.hasBurn ) {
                review_btn.attr('title', setTitle(counts.now.burn, 'Burn'));
                if ( settings.burn_highlight_now ) {
                    review_btn.children().addClass('fcr_burn');
                }
                if ( settings.add_burn_icon_now ) {
                    review_btn.children().append(settings.burn_icon);
                }
            }
        }
    }

    //========================================================================
    // Add level-critical information to forecast bars & review buttons
    //-------------------------------------------------------------------
    function process_crits(data) {
        var now = new Date(), rtime, counts = {};
        // Count typed reviews in each hour
        for ( var idx in data ) {
            if ( data[idx].assignments.passed_at === null && Date.parse(data[idx].assignments.available_at) - 7*24*3600*1000 < now ) {
                rtime = data[idx].assignments.available_at.split('.')[0];
                if ( Date.parse(data[idx].assignments.available_at) < now ) {
                    rtime = 'now';
                }
                if ( ! (rtime in counts) ) {
                    counts[rtime] = {
                        'radical':0,
                        'kanji':0
                    };
                }
                counts[rtime][data[idx].object]++; // crit counts by type
            }
        }

        // Add crit markup to forecast
        var tr, review_btn, w0, n, title;
        for ( rtime in counts ) {
            // Locate the review bar
            tr = $('section.forecast tr.review-forecast__hour time[datetime="' + rtime + 'Z"]')
                .parents('tr').first();
            if ( !tr.length ) {
                continue;
            }

            // Add tooltips and markup
            tr.attr('title', setTitle(counts[rtime], 'Critical'));
            if ( settings.crit_highlight ) {
                tr.addClass('fcr_apprentice');
            }
            if ( settings.add_crit_icon ) {
                tr.children('th').append('<span class="fcr_icon fcr_icon_critical">' + settings.crit_icon + '</span>');
            }
        }

        // Add currently available crits to review buttons
        if ( 'now' in counts ) {
            review_btn = $('a.lessons-and-reviews__reviews-button, li.navigation-shortcut--reviews')
                .attr('title', setTitle(counts.now, 'Critical')).children();
            if ( settings.crit_highlight_now ) {
                review_btn.addClass('fcr_apprentice');
            }
            if ( settings.add_crit_icon_now ) {
                review_btn.append(settings.crit_icon);
            }
        }
    }

    //========================================================================
    // Helper functions
    //-------------------------------------------------------------------
    var setTitle = function(countObj, name){
        return function(idx, title){
            title = (title ? title + '\n' : '') + name + ': ' + countObj.radical + ' radicals, '
                + countObj.kanji + ' kanji';
            if ( countObj.vocabulary != undefined ) {
                title += ', ' + countObj.vocabulary + ' vocabulary';
            }
            return title;
        }
    }
    var setTitleByLevel = function(countObj){
        return function(idx, title){
            title = (title ? title + '\n' : '')
                + countObj[4] + ' apprentice, '
                + countObj[5] + ' guru, '
                + countObj[7] + ' master, '
                + countObj[8] + ' enlightened';
            return title;
        }
    }

    function split_bar(bar, counts, config) {
        var n = 0, w0, c;
        for ( c in config ) {
            n += counts[c]
        }
        bar.removeClass('rounded-r-lg').addClass('fcr_split_bar');
        w0 = parseFloat(bar.attr('style').match("width: ([0-9.]+)%")[1]);
        for ( c in config ) {
            if ( counts[c] ) {
                bar.clone().addClass(config[c]).css('width', counts[c] * w0 / n + '%').appendTo(bar.parent());
            }
        }
        bar.siblings().last().addClass('rounded-r-lg').parent().addClass('fcr_lineheight_fix');
        if ( w0 > 95 ) {
            bar.siblings().css('min-width', 0);
        }
        bar.remove();
    }
    var barsplit_type = {
        radical: 'fcr_radical',
        kanji: 'fcr_kanji',
        vocabulary: 'fcr_vocab'
    };
    var barsplit_srs = {
        4: 'fcr_bar_apprentice',
        5: 'fcr_bar_guru',
        7: 'fcr_bar_master',
        8: 'fcr_bar_enlightened'
    };

    //========================================================================
    // Menu
    //-------------------------------------------------------------------
    function install_menu() {
        wkof.Menu.insert_script_link({
            name: 'forecast_details',
            title: 'Forecast Details',
            submenu: 'Settings',
            on_click: open_settings
        });
    }

    function open_settings() {
        var config = {
            script_id: 'forecast_details',
            title: 'Forecast Details settings',
            content: {
                tabset: {
                    type: 'tabset',
                    content: {
                        crits: {
                            type: 'page',
                            label: 'Level-critical reviews',
                            content: {
                                crit_icon: {
                                    type: 'text',
                                    label: 'Icon (Default: 🔺)',
                                },
                                sec_forecast: {
                                    type: 'section',
                                    label: 'Forecast'
                                },
                                crit_highlight: {
                                    type: 'checkbox',
                                    label: 'Highlight bars',
                                },
                                add_crit_icon: {
                                    type: 'checkbox',
                                    label: 'Add icons'
                                },
                                sec_now: {
                                    type: 'section',
                                    label: 'Review buttons (currently available items)'
                                },
                                crit_highlight_now: {
                                    type: 'checkbox',
                                    label: 'Add highlight'
                                },
                                add_crit_icon_now: {
                                    type: 'checkbox',
                                    label: 'Add icon'
                                }
                            }
                        },
                        burns: {
                            type: 'page',
                            label: 'Burn reviews',
                            content: {
                                burn_icon: {
                                    type: 'text',
                                    label: 'Icon (Default: 🔥)',
                                },
                                sec_forecast: {
                                    type: 'section',
                                    label: 'Forecast'
                                },
                                burn_highlight: {
                                    type: 'checkbox',
                                    label: 'Highlight bars',
                                },
                                add_burn_icon: {
                                    type: 'checkbox',
                                    label: 'Add icons'
                                },
                                sec_now: {
                                    type: 'section',
                                    label: 'Review buttons (currently available items)'
                                },
                                burn_highlight_now: {
                                    type: 'checkbox',
                                    label: 'Add highlight'
                                },
                                add_burn_icon_now: {
                                    type: 'checkbox',
                                    label: 'Add icon'
                                }
                            }
                        },
                        misc: {
                            type: 'page',
                            label: 'Other forecast details',
                            content: {
                                bar_colours: {
                                    type: 'dropdown',
                                    label: 'Colour bars by',
                                    content: {
                                        none: 'None',
                                        type: 'Item type',
                                        srs: 'SRS stage',
                                    }
                                }
                            }
                        }
                    }
                },
                divider: {
                    type: 'divider'
                },
                note: {
                    type: 'section',
                    label: 'Note, changes come into effect when the page is reloaded.',
                }
            }
        };
        var dialog = new wkof.Settings(config);
        dialog.open();
    }
})();