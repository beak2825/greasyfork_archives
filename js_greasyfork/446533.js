// ==UserScript==
// @name        Wanikani Unnecessary Forecast Details
// @namespace   https://www.wanikani.com
// @author      jc04tu
// @description Adds markup & tooltips for item types, srs stages, critical reviews to the forecast and review buttons
// @version     1.0
// @include     /^https://(www|preview).wanikani.com/(dashboard)?$/
// @copyright   2020+, Felix Kern
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/446533/Wanikani%20Unnecessary%20Forecast%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/446533/Wanikani%20Unnecessary%20Forecast%20Details.meta.js
// ==/UserScript==

//CREDITS
//Original script by kernfel (https://greasyfork.org/en/scripts/397661-wanikani-forecast-details)

(function() {

    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Unnecessary Forecast Details';
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
            crit_highlight_color: '#cbecd3',
            crit_review_highlight_color: '#59c274',
            crit_highlight: true,
            crit_highlight_now: true,
            add_crit_icon: true,
            add_crit_icon_now: true,
            crit_icon: '🔺',
            showCritTooltip: true,

            allApprentice_highlight_color: '#fde6f5',
            allApprentice_review_highlight_color: '#e60099',
            allApprentice_highlight: true,
            allApprentice_highlight_now: true,
            add_allApprentice_icon: true,
            add_allApprentice_icon_now: true,
            allApprentice_icon: '🔰',

            guru_highlight_color: '#e9d6ee',
            guru_review_highlight_color: '#8f2fa6',
            guru_highlight: true,
            guru_highlight_now: true,
            add_guru_icon: true,
            add_guru_icon_now: true,
            guru_icon: '🍇',

            master_highlight_color: '#d7def8',
            master_review_highlight_color: '#3759dd',
            master_highlight: true,
            master_highlight_now: true,
            add_master_icon: true,
            add_master_icon_now: true,
            master_icon: '🌀',

            burn_highlight_color: '#feebc4',
            burn_review_highlight_color: '#fbc042',
            burn_highlight: true,
            burn_highlight_now: true,
            add_burn_icon: true,
            add_burn_icon_now: true,
            burn_icon: '🔥',
            showBurnTooltip: true,

            radical_bar_color: '#00AAFF',
            showRadical: true,
            kanji_bar_color: '#FF00AA',
            showKanji: true,
            vocab_bar_color: '#AA00FF',
            showVocab: true,

            allApprentice_bar_color: '#dd0093',
            showApprentice: true,
            guru_bar_color: '#882d9e',
            showGuru: true,
            master_bar_color: '#294ddb',
            showMaster: true,
            enlightened_bar_color: '#0093dd',
            showEnlightened: true,

            bar_colours: 'srs'
        };
        wkof.Settings.load('unnecessary_forecast_details', defaults).then(function(){
            settings = wkof.settings.unnecessary_forecast_details
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
        '.fcr_master { background: #3658dd30; }'+
        '.fcr_guru { background: #9030a830; }'+
        '.fcr_allApprentice { background: #e6009930; }'+
        '.fcr_burn { background: #fbc04250; }'+
        '.fcr_apprentice { background: #59c27450; }'+
        '.fcr_burn.fcr_apprentice { background: #aac15b50; }'+

        // Review buttons
        '.lessons-and-reviews__button span.fcr_master, .navigation-shortcut a.fcr_master { background: #3759dd; text-shadow: none; color: white; }'+
        '.lessons-and-reviews__button span.fcr_guru, .navigation-shortcut a.fcr_guru { background: #8f2fa6; text-shadow: none; color: white; }'+
        '.lessons-and-reviews__button span.fcr_allApprentice, .navigation-shortcut a.fcr_allApprentice { background: #e60099; text-shadow: none; color: white; }'+
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

            // Add tooltips and master highlights
            if (counts[rtime][7]) {
                if (settings.master_highlight) {
                    tr.css('background', settings.master_highlight_color);
                }
                if (settings.add_master_icon) {
                    tr.children('th').append('<span class="fcr_icon fcr_icon_master">' + settings.master_icon + '</span>');
                }
            }
            // Add tooltips and guru highlights
            if (counts[rtime][5]) {
                if (settings.guru_highlight) {
                    tr.css('background', settings.guru_highlight_color);
                }
                if (settings.add_guru_icon) {
                    tr.children('th').append('<span class="fcr_icon fcr_icon_guru">' + settings.guru_icon + '</span>');
                    tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_master">🌀</span>','');
                }
            }
            // Add tooltips and apprentice highlights
            if (counts[rtime][4]) {
                if (settings.allApprentice_highlight) {
                    tr.css('background', settings.allApprentice_highlight_color);
                }
                if (settings.add_allApprentice_icon) {
                    tr.children('th').append('<span class="fcr_icon fcr_icon_allApprentice">' + settings.allApprentice_icon + '</span>');
                    tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_guru">🍇</span>','');
                    tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_master">🌀</span>','');
                }
            }
            // Add tooltips and burn highlights
            tr.attr('title', setTitle(counts[rtime]))
                .attr('title', setTitleByLevel(counts[rtime]));
            if ( counts[rtime].hasBurn ) {
                tr.attr('title', setTitle(counts[rtime].burn, 'Burn'));
                if ( settings.burn_highlight ) {
                    tr.css('background', settings.burn_highlight_color);;
                }
                if ( settings.add_burn_icon ) {
                    tr.children('th').append('<span class="fcr_icon fcr_icon_burn">' + settings.burn_icon + '</span>');
                    tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_allApprentice">🔰</span>','');
                    tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_guru">🍇</span>','');
                    tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_master">🌀</span>','');
                }
            }
        }

        // Add currently available info & burns the review buttons
        if ( 'now' in counts ) {
            review_btn = $('a.lessons-and-reviews__reviews-button, li.navigation-shortcut--reviews')
                .attr('title', setTitle(counts.now))
                .attr('title', setTitleByLevel(counts.now));
            if ( counts.now.hasBurn ) {
                review_btn.attr('title', setTitle(counts.now.burn, 'Burn'));
            }
        }

        // Add currently available master to review buttons
        if ('now' in counts) {
            if (counts.now[7] > 0) {
                if (settings.master_highlight_now) {
                    review_btn.children().addClass('fcr_master').css({'background':settings.master_review_highlight_color,'text-shadow':'none','color':'white'});
                }
                if ( settings.add_master_icon_now && !(counts.now.hasBurn && settings.add_burn_icon_now)) {
                    review_btn.children().append(settings.master_icon);
                }
            }
        }

        // Add currently available guru to review buttons
        if ('now' in counts) {
            if (counts.now[5] > 0) {
                if (settings.guru_highlight_now) {
                    review_btn.children().addClass('fcr_guru').css({'background':settings.guru_review_highlight_color,'text-shadow':'none','color':'white'});
                }
                if ( settings.add_guru_icon_now && !(counts.now.hasBurn && settings.add_burn_icon_now)) {
                    review_btn.children().append(settings.guru_icon);
                    review_btn.children().prevObject[0].innerHTML = review_btn.children().prevObject[0].innerHTML.replace('🌀','');
                    review_btn.children().prevObject[1].innerHTML = review_btn.children().prevObject[1].innerHTML.replace('🌀','');
                }
            }
        }

        // Add currently available apprentice to review buttons
        if ('now' in counts) {
            if (counts.now[4] > 0) {
                if (settings.allApprentice_highlight_now) {
                    review_btn.children().addClass('fcr_allApprentice').css({'background':settings.allApprentice_review_highlight_color,'text-shadow':'none','color':'white'});
                }
                if ( settings.add_allApprentice_icon_now && !(counts.now.hasBurn && settings.add_burn_icon_now)) {
                    review_btn.children().append(settings.allApprentice_icon);
                    review_btn.children().prevObject[0].innerHTML = review_btn.children().prevObject[0].innerHTML.replace('🍇','');
                    review_btn.children().prevObject[0].innerHTML = review_btn.children().prevObject[0].innerHTML.replace('🌀','');
                    review_btn.children().prevObject[1].innerHTML = review_btn.children().prevObject[1].innerHTML.replace('🍇','');
                    review_btn.children().prevObject[1].innerHTML = review_btn.children().prevObject[1].innerHTML.replace('🌀','');
                }
            }
        }
        // Add currently available info & burns the review buttons
        if ( 'now' in counts ) {
            if ( counts.now.hasBurn ) {
                if ( settings.burn_highlight_now ) {
                    review_btn.children().css({'background':settings.burn_review_highlight_color,'text-shadow':'none','color':'white'});
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
                tr.css('background', settings.crit_highlight_color);
            }
            if ( settings.add_crit_icon ) {
                tr.children('th').append('<span class="fcr_icon fcr_icon_critical">' + settings.crit_icon + '</span>');
                tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_allApprentice">🔰</span>','');
                tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_guru">🍇</span>','');
                tr.children()[0].innerHTML = tr.children()[0].innerHTML.replace('<span class="fcr_icon fcr_icon_master">🌀</span>','');
            }
        }

        // Add currently available crits to review buttons
        if ( 'now' in counts ) {
            review_btn = $('a.lessons-and-reviews__reviews-button, li.navigation-shortcut--reviews')
                .attr('title', setTitle(counts.now, 'Critical')).children();
            if ( settings.crit_highlight_now ) {
                review_btn.addClass('fcr_apprentice').css({'background':settings.crit_review_highlight_color ,'text-shadow':'none','color':'white'});
            }
            if ( settings.add_crit_icon_now ) {
                review_btn.append(settings.crit_icon);
                review_btn.children().prevObject[0].innerHTML = review_btn.children().prevObject[0].innerHTML.replace('🔰','');
                review_btn.children().prevObject[0].innerHTML = review_btn.children().prevObject[0].innerHTML.replace('🍇','');
                review_btn.children().prevObject[0].innerHTML = review_btn.children().prevObject[0].innerHTML.replace('🌀','');
                review_btn.children().prevObject[1].innerHTML = review_btn.children().prevObject[1].innerHTML.replace('🔰','');
                review_btn.children().prevObject[1].innerHTML = review_btn.children().prevObject[1].innerHTML.replace('🍇','');
                review_btn.children().prevObject[1].innerHTML = review_btn.children().prevObject[1].innerHTML.replace('🌀','');
            }
        }
    }

    //========================================================================
    // Helper functions
    //-------------------------------------------------------------------
    var setTitle = function(countObj, name){
        return function(idx, title){
            if (name != 'undefined' && name != 'Burn' && name != 'Critical') {
                title = '';
                if (settings.showRadical && countObj.radical > 0) {
                    title += '[' + countObj.radical + ' radicals] ';
                }
                if (settings.showKanji && countObj.kanji > 0) {
                    title += '[' + countObj.kanji + ' kanji] ';
                }
                if (settings.showVocab && countObj.vocabulary != undefined ) {
                    title += '[' + countObj.vocabulary + ' vocabulary]';
                }
            }


            if ((name == 'Burn') && (settings.showBurnTooltip && (countObj.radical > 0 || countObj.kanji > 0 || countObj.vocabulary > 0))) {
                title = (title ? title + '\n' : '')
                title += name + ': '

                if (countObj.radical > 0) {
                    title += '[' + countObj.radical + ' radicals] ';
                }
                if (countObj.kanji > 0) {
                    title += '[' + countObj.kanji + ' kanji] ';
                }
                if (countObj.vocabulary != undefined ) {
                    title += '[' + countObj.vocabulary + ' vocabulary]';
                }
            }
            if ((name == 'Critical') && (settings.showCritTooltip && (countObj.radical > 0 || countObj.kanji > 0 || countObj.vocabulary > 0))) {
                title = (title ? title + '\n' : '')
                title += name + ': '

                if (countObj.radical > 0) {
                    title += '[' + countObj.radical + ' radicals] ';
                }
                if (countObj.kanji > 0) {
                    title += '[' + countObj.kanji + ' kanji] ';
                }
                if (countObj.vocabulary != undefined ) {
                    title += '[' + countObj.vocabulary + ' vocabulary]';
                }
            }
            return title;
        }
    }
    var setTitleByLevel = function(countObj){
        return function(idx, title){
            if (countObj[4] > 0 && settings.showApprentice) {
                title = (title ? title + '\n' : '')
                    + 'Apprentice: ' + countObj[4]
            }
            if (countObj[5] > 0 && settings.showGuru) {
                title = (title ? title + '\n' : '')
                    + 'Guru: ' + countObj[5]
            }
            if (countObj[7] > 0 && settings.showMaster) {
                title = (title ? title + '\n' : '')
                    + 'Master: ' + countObj[7]
            }
            if (countObj[8] > 0 && settings.showEnlightened) {
                title = (title ? title + '\n' : '')
                    + 'Enlightened: ' + countObj[8]
            }
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
        if ( counts.radical && settings.showRadical && settings.bar_colours == 'type') {
            bar.clone().css({'background':settings.radical_bar_color,'width':counts.radical * w0 / n + '%'}).appendTo(bar.parent());
        }
        if ( counts.kanji && settings.showKanji && settings.bar_colours == 'type') {
            bar.clone().css({'background':settings.kanji_bar_color,'width':counts.kanji * w0 / n + '%'}).appendTo(bar.parent());
        }
        if ( counts.vocabulary && settings.showVocab && settings.bar_colours == 'type') {
            bar.clone().css({'background':settings.vocab_bar_color,'width':counts.vocabulary * w0 / n + '%'}).appendTo(bar.parent());
        }
        if ( counts.radical && !settings.showRadical && settings.bar_colours == 'type') {
            bar.clone().addClass('background: #60c474').css('width', counts.radical * w0 / n + '%').appendTo(bar.parent());
        }
		if ( counts.kanji && !settings.showKanji && settings.bar_colours == 'type') {
            bar.clone().addClass('background: #60c474').css('width', counts.kanji * w0 / n + '%').appendTo(bar.parent());
        }
		if ( counts.vocabulary && !settings.showVocab && settings.bar_colours == 'type') {
            bar.clone().addClass('background: #60c474').css('width', counts.vocabulary * w0 / n + '%').appendTo(bar.parent());
        }
        if ( counts[4] && settings.showApprentice && settings.bar_colours == 'srs') {
            bar.clone().css({'background':settings.allApprentice_bar_color,'width':counts[4] * w0 / n + '%'}).appendTo(bar.parent());
        }
        if ( counts[5] && settings.showGuru && settings.bar_colours == 'srs') {
            bar.clone().css({'background':settings.guru_bar_color,'width':counts[5] * w0 / n + '%'}).appendTo(bar.parent());
        }
        if ( counts[7] && settings.showMaster && settings.bar_colours == 'srs') {
            bar.clone().css({'background':settings.master_bar_color,'width':counts[7] * w0 / n + '%'}).appendTo(bar.parent());
        }
        if ( counts[8] && settings.showEnlightened && settings.bar_colours == 'srs') {
            bar.clone().css({'background':settings.enlightened_bar_color,'width':counts[8] * w0 / n + '%'}).appendTo(bar.parent());
        }
        if ( counts[4] && !settings.showApprentice && settings.bar_colours == 'srs') {
            bar.clone().addClass('background: #60c474').css('width', counts[4] * w0 / n + '%').appendTo(bar.parent());
        }
        if ( counts[5] && !settings.showGuru && settings.bar_colours == 'srs') {
            bar.clone().addClass('background: #60c474').css('width', counts[5] * w0 / n + '%').appendTo(bar.parent());
        }
        if ( counts[7] && !settings.showMaster && settings.bar_colours == 'srs') {
            bar.clone().addClass('background: #60c474').css('width', counts[7] * w0 / n + '%').appendTo(bar.parent());
        }
        if ( counts[8] && !settings.showEnlightened && settings.bar_colours == 'srs') {
            bar.clone().addClass('background: #60c474').css('width', counts[8] * w0 / n + '%').appendTo(bar.parent());
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
            name: 'unnecessary_forecast_details',
            title: 'Unnecessary Forecast Details',
            submenu: 'Settings',
            on_click: open_settings
        });
    }

    function open_settings() {
        var config = {
            script_id: 'unnecessary_forecast_details',
            title: 'Unnecessary Forecast Details settings',
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
                                crit_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#cbecd3',
                                },
                                crit_highlight: {
                                    type: 'checkbox',
                                    label: 'Highlight bars',
                                },
                                add_crit_icon: {
                                    type: 'checkbox',
                                    label: 'Add icons',
                                },
                                sec_now: {
                                    type: 'section',
                                    label: 'Review buttons (currently available items)'
                                },
                                crit_review_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#59c274'
                                },
                                crit_highlight_now: {
                                    type: 'checkbox',
                                    label: 'Add highlight',
                                },
                                add_crit_icon_now: {
                                    type: 'checkbox',
                                    label: 'Add icon',
                                },
                                sec_additional: {
                                    type: 'section',
                                    label: 'Tooltip details'
                                },
                                showCritTooltip: {
                                    type: 'checkbox',
                                    label: 'Show Item Type'
                                },
                            }
                        },
                        allApprentice: {
                            type: 'page',
                            label: 'Apprentice reviews',
                            content: {
                                allApprentice_icon: {
                                    type: 'text',
                                    label: 'Icon (Default: 🔰)',
                                },
                                sec_forecast: {
                                    type: 'section',
                                    label: 'Forecast'
                                },
                                allApprentice_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#fde6f5',
                            },
                                allApprentice_highlight: {
                                    type: 'checkbox',
                                    label: 'Highlight bars',
                                },
                                add_allApprentice_icon: {
                                    type: 'checkbox',
                                    label: 'Add icons',
                                },
                                sec_now: {
                                    type: 'section',
                                    label: 'Review buttons (currently available items)'
                                },
                                allApprentice_review_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#e60099',
                                },
                                allApprentice_highlight_now: {
                                    type: 'checkbox',
                                    label: 'Add highlight',
                                },
                                add_allApprentice_icon_now: {
                                    type: 'checkbox',
                                    label: 'Add icon',
                                }
                            }
                        },
                        guru: {
                            type: 'page',
                            label: 'Guru reviews',
                            content: {
                                guru_icon: {
                                    type: 'text',
                                    label: 'Icon (Default: 🍇)',
                                },
                                sec_forecast: {
                                    type: 'section',
                                    label: 'Forecast'
                                },
                                guru_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#e9d6ee',
                                },
                                guru_highlight: {
                                    type: 'checkbox',
                                    label: 'Highlight bars',
                                },
                                add_guru_icon: {
                                    type: 'checkbox',
                                    label: 'Add icons'
                                },
                                sec_now: {
                                    type: 'section',
                                    label: 'Review buttons (currently available items)'
                                },
                                guru_review_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#8f2fa6',
                                },
                                guru_highlight_now: {
                                    type: 'checkbox',
                                    label: 'Add highlight'
                                },
                                add_guru_icon_now: {
                                    type: 'checkbox',
                                    label: 'Add icon'
                                }
                            }
                        },
                        master: {
                            type: 'page',
                            label: 'Master reviews',
                            content: {
                                master_icon: {
                                    type: 'text',
                                    label: 'Icon (Default: 🌀)',
                                },
                                sec_forecast: {
                                    type: 'section',
                                    label: 'Forecast'
                                },
                                master_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#d7def8',
                                },
                                master_highlight: {
                                    type: 'checkbox',
                                    label: 'Highlight bars',
                                },
                                add_master_icon: {
                                    type: 'checkbox',
                                    label: 'Add icons'
                                },
                                sec_now: {
                                    type: 'section',
                                    label: 'Review buttons (currently available items)'
                                },
                                master_review_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#3759dd',
                                },
                                master_highlight_now: {
                                    type: 'checkbox',
                                    label: 'Add highlight'
                                },
                                add_master_icon_now: {
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
                                burn_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#feebc4',
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
                                burn_review_highlight_color: {
                                    type: 'color',
                                    label: 'Highlight Color',
                                    default: '#fbc042',
                                },
                                burn_highlight_now: {
                                    type: 'checkbox',
                                    label: 'Add highlight'
                                },
                                add_burn_icon_now: {
                                    type: 'checkbox',
                                    label: 'Add icon'
                                },
                                sec_additional: {
                                    type: 'section',
                                    label: 'Tooltip details'
                                },
                                showBurnTooltip: {
                                    type: 'checkbox',
                                    label: 'Show Item Type'
                                },
                            }
                        },
                        misc: {
                            type: 'page',
                            label: 'Other Forecast Details',
                            content: {
                                bar_colours: {
                                    type: 'dropdown',
                                    label: 'Colour bars by',
                                    content: {
                                        none: 'None',
                                        type: 'Item type',
                                        srs: 'SRS stage',
                                    }
                                },

                                item_type: {
                                    type: 'group',
                                    label: 'Item type',
                                    content: {
                                        radicalDetails: {
                                            type: 'section',
                                            label: 'Radical',
                                        },
                                        radical_bar_color: {
                                            type: 'color',
                                            label: 'Bar Color',
                                            default: '#00AAFF',
                                        },
                                        showRadical: {
                                            type: 'checkbox',
                                            label: 'Show Details',
                                            hover_tip: 'Item type bars ー Display color\nAll tooltips include Radical Totals',
                                        },
                                        kanjiDetails: {
                                            type: 'section',
                                            label: 'Kanji',
                                        },
                                        kanji_bar_color: {
                                            type: 'color',
                                            label: 'Bar Color',
                                            default: '#FF00AA',
                                        },
                                        showKanji: {
                                            type: 'checkbox',
                                            label: 'Show Details',
                                            hover_tip: 'Item type bars ー Display color\nAll tooltips include Kanji Totals',
                                        },
                                        vocabDetails: {
                                            type: 'section',
                                            label: 'Vocabulary',
                                        },
                                        vocab_bar_color: {
                                            type: 'color',
                                            label: 'Bar Color',
                                            default: '#AA00FF',
                                        },
                                        showVocab: {
                                            type: 'checkbox',
                                            label: 'Show Details',
                                            hover_tip: 'Item type bars ー Display color\nAll tooltips include Vocab Totals',
                                        },

                                    },
                                },

                                srs_stage: {
                                    type: 'group',
                                    label: 'SRS Stages',
                                    content: {
                                        apprenticeDetails: {
                                            type: 'section',
                                            label: 'Apprentice',
                                        },
                                        allApprentice_bar_color: {
                                            type: 'color',
                                            label: 'Bar Color',
                                            default: '#dd0093'
                                        },
                                        showApprentice: {
                                            type: 'checkbox',
                                            label: 'Show Details',
                                            hover_tip: 'SRS stage bars ー Display color\nAll tooltips include Apprentice Totals',
                                        },
                                        divider: {
                                            type: 'divider',
                                        },
                                        guruDetails: {
                                            type: 'section',
                                            label: 'Guru',
                                        },
                                        guru_bar_color: {
                                            type: 'color',
                                            label: 'Bar Color',
                                            default: '#882d9e',
                                        },
                                        showGuru: {
                                            type: 'checkbox',
                                            label: 'Show Details',
                                            hover_tip: 'SRS stage bars ー Display color\nAll tooltips include Guru Totals',
                                        },
                                        masterDetails: {
                                            type: 'section',
                                            label: 'Master',
                                        },
                                        master_bar_color: {
                                            type: 'color',
                                            label: 'Bar Color',
                                            default: '#294ddb',
                                        },
                                        showMaster: {
                                            type: 'checkbox',
                                            label: 'Show Details',
                                            hover_tip: 'SRS stage bars ー Display color\nAll tooltips include Master Totals',
                                        },
                                        enlightenedDetails: {
                                            type: 'section',
                                            label: 'Enlightened',
                                        },
                                        enlightened_bar_color: {
                                            type: 'color',
                                            label: 'Bar Color',
                                            default: '#0093dd',
                                        },
                                        showEnlightened: {
                                            type: 'checkbox',
                                            label: 'Show Details',
                                            hover_tip: 'SRS stage bars ー Display color\nAll tooltips include Enlightened Totals',
                                        }
                                    },
                                },
                            },
                        },
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