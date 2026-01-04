// ==UserScript==
// @name         Wanikani Dashboard Progress Plus 2
// @namespace    Wanikani prouleau
// @version      4.2.2
// @description  Display detailed level progress
// @author       prouleau, adapted from Robin Findley
// @match        https://www.wanikani.com/*
// @copyright    2015-2023, Robin Findley; 2025 prouleau
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531933/Wanikani%20Dashboard%20Progress%20Plus%202.user.js
// @updateURL https://update.greasyfork.org/scripts/531933/Wanikani%20Dashboard%20Progress%20Plus%202.meta.js
// ==/UserScript==

(function(gobj) {
    'use strict';

    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    let script_name = 'Dashboard Progress Plus';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    //========================================================================
    // Global variables
    //-------------------------------------------------------------------
    let settings, settings_dialog;

    //========================================================================
    // Init sequence
    //-------------------------------------------------------------------
    wkof.set_state('dpp_init', 'ongoing');
    wkof.include('ItemData, Menu, Settings, Jquery');
    wkof.ready('ItemData, Menu, Settings, Jquery')
        .then(load_settings)
        .then(startup)

    window.addEventListener("turbo:load", (e) => {
        if (e.detail.url !== 'https://www.wanikani.com/dashboard' && e.detail.url !== 'https://www.wanikani.com/#' &&
            e.detail.url !== 'https://www.wanikani.com/'){
            return;
        };
        if (wkof.get_state('dpp_init') !== 'ready'){return;} // page load is triggered when startup is already ongoing
        wkof.set_state('dpp_init', 'ongoing')
        setTimeout(init, 0);
    });


    //========================================================================
    // Load the script settings.
    //-------------------------------------------------------------------
    function load_settings() {
        let defaults = {
            position: 'Bottom',
            afterBefore: 'inCell',
            sortOrder: 'Ascending',
            show_90percent: true,
            show_char: true,
            enable_popup: true,
            show_meaning: true,
            show_reading: true,
            show_srs: true,
            show_next_review: true,
            show_passed: true,
            time_format: '12hour',
        };
        return wkof.Settings.load('dpp', defaults).then(function(data){
            settings = wkof.settings.dpp;
        });
    };

    //========================================================================
    // Open the settings dialog
    //------------------------------------------------------------------------
    var oldPosition, old_afterBefore;
    function open_settings() {
        oldPosition = settings.position;
        old_afterBefore = settings.afterBefore;
        let config = {
            script_id: 'dpp',
            title: 'Dashboard Progress Plus',
            on_save: settings_saved,
            content: {
                tabs: {type:'tabset', content: {
                    pgLayout: {type:'page', label:'Main View', hover_tip:'Settings for the main view.', content: {
                        position:{type: 'dropdown', label: 'Position', default: 1, hover_tip: 'Where on the dashboard to install Dashboard Progress Plus 2',
                                  content: {0: "Top", 1: "Bottom", 2: '1st widget row', 3: '2nd widget row',
                                            4: '3rd widget row', 5: '4th widget row', 6: '5th widget row',
                                            7: '6th widget row', 8: '7th widget row', 9: '8th widget row',},
                                 },
                        afterBefore: {type: 'dropdown', label: 'After/Before the Selected Row', default: 'inCell',
                                      hover_tip: 'Insert Dashboard Progress Plus after or before the selected row.\nIn Widget Cell will attempt to place the script in an\nempty widget cell.',
                                      content: {After: 'After', Before: 'Before', inCell: 'In widget Cell'},
                                     },
                        sortOrder:{type: 'dropdown', label: 'Sort Order', default: 'Ascending', hover_tip: 'the order of srs stage Afterused to display item',
                                  content:{Ascending: 'Ascending', Descending: 'Descending'},},
                        show_90percent: {type:'checkbox', label:'Show 90% Bracket', default:true, hover_tip:'Show the bracket around 90% of items.'},
                        show_char: {type:'checkbox', label:'Show Kanji/Radical', default:true, hover_tip:'Show the kanji or radical inside each tile.'},
                    }},
                    pgPopupInfo: {type:'page', label:'Pop-up Info', hover_tip:'Information shown in the popup box.', content: {
                        enable_popup: {type:'checkbox', label:'Enable Pop-up Info Box', default:true, hover_tip:'Choose whether to show pop-up info box when hovering over an item.'},
                        grpPopupInfo: {type:'group', label:'Pop-up Info', hover_tip:'Information to display in the pop-up box.', content:{
                            show_meaning: {type:'checkbox', label:'Show Meaning', default:true, hover_tip:'Choose whether to show the item\'s meaning in the pop-up info.'},
                            show_reading: {type:'checkbox', label:'Show Reading', default:true, hover_tip:'Choose whether to show the item\'s reading in the pop-up info.'},
                            show_srs: {type:'checkbox', label:'Show SRS Level', default:true, hover_tip:'Choose whether to show the item\'s SRS level in the pop-up info.'},
                            show_next_review: {type:'checkbox', label:'Show Next Review Date', default:true, hover_tip:'Choose whether to show the item\'s next review date in the pop-up info.'},
                            show_passed: {type:'checkbox', label:'Show Passed Date', default:true, hover_tip:'Choose whether to show the date that the item passed in the pop-up info.'},
                            time_format: {type:'dropdown', label:'Time Format', default:'12hour', content:{'12hour':'12-hour','24hour':'24-hour'}, hover_tip:'Display time in 12 or 24-hour format.'},
                        }}
                    }}
                }}
            }
        };
        let settings_dialog = new wkof.Settings(config);
        settings_dialog.open();
    };

    //========================================================================
    // Handler for when user clicks 'Save' in the settings window.
    //-------------------------------------------------------------------
    async function settings_saved(new_settings) {
        await wkof.wait_state('dpp_init', 'ready');
        wkof.set_state('dpp_init', 'ongoing');
        if (oldPosition !== settings.position || old_afterBefore !== settings.afterBefore) {
            insert_container();
        } else {
            let $container = $('#dppContainer');
            $container.empty();
        };
        populate_dashboard().then(function(){wkof.set_state('dpp_init', 'ready')});
    };

    //========================================================================
    // Startup
    //-------------------------------------------------------------------
    function startup() {
        install_css();
        return wkof.ready('document').then(init);
   };

    var items;
    function init(){
        if (document.querySelector('.dashboard__content') === null) {
            setTimeout(init, 200);
            return Promise.resolved;
        } else {
            install_menu();

            return wkof.ItemData.get_items({
                wk_items:{
                    options:{
                        assignments:true
                    },
                    filters:{
                        level:'+0',
                        item_type:'radical,kanji',
                    }
                }
            })
            .then(function(data){items = data;
                    insert_container();
                    setThemeWatcher()
                    populate_dashboard().then(function(){wkof.set_state('dpp_init', 'ready')})
                    });
        };
    };

    //========================================================================
    // Handy little function that rfindley wrote. Checks whether the theme is dark.
    // must be MIT license
    //------------------------------------------------------------------------
    function is_dark_theme() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return $('body').css('background-color').match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
    }

    //========================================================================
    // A mutation observer detects the change of style and set classes accordingly
    //------------------------------------------------------------------------

    var themeWatcher;
    function setThemeWatcher(){
        setThemeClasses(null, null)
        themeWatcher = new MutationObserver(setThemeClasses);
        themeWatcher.observe($('html')[0], {childList: true, subtree: false, attributes: false, characterData: false});
        themeWatcher.observe($('head')[0], {childList: true, subtree: false, attributes: false, characterData: false});
    };

    function setThemeClasses(mutations, caller){
        const BreezeDarkBackground = 'rgb(49, 54, 59)';
        const ElementaryDarkColor = 'rgb(244, 244, 244)';

        let is_dark = is_dark_theme();
        let elem = document.getElementById('dppContainer');
        if (elem === null){
            // Turbo has changed page, the observer must be stopped
            if (themeWatcher !== null && themeWatcher !== undefined) {
                try {
                    themeWatcher.disconnect();
                } catch({name, message}) {
                    console.log(name);
                    console.log(message);
                };
                themeWatcher = null;
            };
        } else {
            let is_container_dark = window.getComputedStyle(elem).backgroundColor
                                               .toString().match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
            if (!is_dark && !is_container_dark){
                elem.classList.remove('dpp_Dark', 'dpp_Breeze', 'dpp_Elementary',);
                elem.classList.add('dpp_Light');
            } else {
                let backgroundColor = $('body').css('background-color');
                if (backgroundColor === BreezeDarkBackground){
                        elem.classList.remove('dpp_Light', 'dpp_Dark', 'dpp_Elementary');
                        elem.classList.add('dpp_Breeze');
               } else if (backgroundColor === ElementaryDarkColor){
                        elem.classList.remove('dpp_Light', 'dpp_Dark');
                        elem.classList.add('dpp_Breeze','dpp_Elementary');
               } else {
                    elem.classList.remove('dpp_Light', 'dpp_Elementary');
                    elem.classList.add('dpp_Dark', 'dpp_Breeze');
                };
            };
        };
    };


    //========================================================================
    // CSS Styling
    //-------------------------------------------------------------------
    let progress_css =
        '#dppContainer {padding: 16px; --dpp-color-ring-background: color-mix(in srgb, var(--color-widget-background) 90%, white 10%); '+
                       '--dpp-color-ring-border : color-mix(in srgb, var(--color-widget-background) 30%, white 70%); '+
                       '--dpp-color-popup-border: color-mix(in srgb, rgb(245 241 249) 30%, black 70%); '+
                       '--dpp-color-popup-background: black; '+
                       '--dpp-color-radical-background: color-mix(in srgb, var(--color-radical, #56638a) 40%, black 60%); '+
                       '--dpp-color-radical-border: color-mix(in srgb, var(--color-radical, #56638a) 70%, black 30%); '+
                       '--dpp-color-radical-border-elementary: color-mix(in srgb, var(--color-radical, #56638a), white 25%); '+
                       '--dpp-color-radical-background-elementary:  color-mix(in srgb, var(--color-radical, #56638a), transparent 75%); '+
                       '--dpp-color-kanji-background: color-mix(in srgb, var(--color-kanji, #9c4644) 40%, black 60%); '+
                       '--dpp-color-kanji-border: color-mix(in srgb, var(--color-kanji, #9c4644) 70%, black 30%); '+
                       '--dpp-color-kanji-border-elementary: color-mix(in srgb, var(--color-kanji, #9c4644), white 25%);'+
                       '--dpp-color-kanji-background-elementary: color-mix(in srgb, var(--color-kanji, #9c4644), transparent 75%);} '+
        '#dppContainer {background-color: var(--color-widget-background); border-color:var(--color-widget-border); '+
                       'border-width: 1px; border-radius: 16px; border-style: solid; width:100%;}'+
        '#dppContainer.dppFullWidth {margin-bottom: 24px;}'+
        '#dppContainer .dppTopHeader {font-size:18px; font-weight:700;}'+
        '#dppContainer .dppLowerHeader {font-size:16px; font-weight:700;}'+
        '#dppContainer .dppItemList {display:flex; flex-basis:0px; flex-grow:1; flex-shrink:1; flex-wrap:wrap;}'+

        '#dppContainer .dppBlockItem {padding: 5px; margin-top:5px; position:relative;}'+
        '#dppContainer .dppItem {width: 50px; height:50px; border-radius:8px; color:var(--color-character-text); font-size:24px; font-weigth:350; text-align:center; '+
                                'padding-top:13px;}'+

        '#dppContainer .dppItem.dppReviewedItem.radical {background-color:var(--color-radical);}'+
        '#dppContainer .dppItem.dppInitiateItem.radical {color:rgb(0,105,172); border-color:rgb(0,105,172); border-style:solid; border-width:1px; background-color:rgb(203,235,255);}'+
        '#dppContainer.dpp_Breeze .dppItem.dppInitiateItem.radical {color:var(--color-radical); border-color:var(--dpp-color-radical-border, #3c4561); border-style:solid; '+
                                                                 'border-width:1px; background-color:var(--dpp-color-radical-background, #222837);}'+
        '#dppContainer.dpp_Breeze.dpp_Elementary .dppItem.dppInitiateItem.radical {color:var(--color-character-text); border-color:var(--dpp-color-radical-border-elementary, #808aa7); '+
                                                                                'border-style:solid; border-width:1px; '+
                                                                                'background-color:var(--dpp-color-radical-background-elementary, #56638a);}'+

        '#dppContainer .dppItem.dppReviewedItem.kanji {background-color:var(--color-kanji);}'+
        '#dppContainer .dppItem.dppInitiateItem.kanji {color:rgb(185,0,123); border-color:rgb(185,0,123); border-style:solid; border-width:1px; background-color:rgb(255,212,241);}'+
        '#dppContainer.dpp_Breeze .dppItem.dppInitiateItem.kanji {color:var(--color-kanji); border-color:var(--dpp-color-kanji-border, #6d3130); border-style:solid; '+
                                                                 'border-width:1px; background-color:var(--dpp-color-kanji-background, #3e1c1b);}'+
        '#dppContainer.dpp_Breeze.dpp_Elementary .dppItem.dppInitiateItem.kanji {color:var(--color-character-text); border-color:var(--dpp-color-kanji-border-elementary, #b57473); '+
                                                                                'border-style:solid; border-width:1px; '+
                                                                                'background-color: var(--dpp-color-kanji-background-elementary, #9c4644); }'+
        '#dppContainer .dppItem.dppLockedItem.kanji {color:rgb(185,0,123); background-color: rgb(233,231,235); border-color: rgba(0,0,0,0); background-repeat: no-repeat; '+
                                                     'background-size: 1px 100%, 100% 1px, 1px 100%, 100% 1px; background-position: 0 0, 0 0, 100% 0, 0 100%; '+
                                                    'background-image: repeating-linear-gradient(0deg, var(--color-kanji), var(--color-pink) 10px, transparent 10px, transparent 14px, var(--color-kanji) 14px), '+
                                                                      'repeating-linear-gradient(90deg, var(--color-kanji), var(--color-pink) 10px, transparent 10px, transparent 14px, var(--color-kanji) 14px), '+
                                                                      'repeating-linear-gradient(180deg, var(--color-kanji), var(--color-pink) 10px, transparent 10px, transparent 14px, var(--color-kanji) 14px), '+
                                                                      'repeating-linear-gradient(270deg, var(--color-kanji), var(--color-pink) 10px, transparent 10px, transparent 14px, var(--color-kanji) 14px);} '+
        '#dppContainer.dpp_Breeze .dppItem.dppLockedItem.kanji {color:var(--color-kanji); background-color: var(--dpp-color-kanji-background, #3e1c1b);} '+
        '#dppContainer.dpp_Breeze.dpp_Elementary .dppItem.dppLockedItem.kanji {color:var(--color-character-text); background-color: var(--dpp-color-kanji-background, #3e1c1b);}'+

         '#dppContainer svg.radical {width: 1em; fill: none; stroke: currentColor; stroke-width: 88; stroke-linecap: square; stroke-miterlimit: 2; '+
                                    'vertical-align: middle; pointer-events: none; /* remove the effect of the title tag within these images */}'+


        '#dppContainer .dppFootnote.dppNoteText {line-height:14px; font-size:14px; font-weight:350; color: rgb(107,112,121); text-align:center;}'+
        '#dppContainer.dpp_Breeze .dppFootnote.dppNoteText {color: var(--text-color);}'+
        '#dppContainer .dppFootnote.dppProgress {display:flex; padding-bottom:7px;}'+
        '#dppContainer .dppSrsBullet.dppGurued {background-color: rgb(8,198,108); border-radius:4px; height: 4px; width: 50px; margin-top:3px;}'+
        '#dppContainer.dpp_Elementary .dppSrsBullet.dppGurued {background-color: var(--color-subject-srs-progress-stage-complete-background);}'+
        '#dppContainer .dppSrsBullet.dppSrsPassed {background-color: rgb(8,198,108); border-radius:4px; height: 4px; width: 10px; margin-top:3px;}'+
        '#dppContainer.dpp_Elementary .dppSrsBullet.dppSrsPassed {background-color: var(--color-subject-srs-progress-stage-complete-background);}'+
        '#dppContainer .dppSrsBullet.dppSrsNotPassed {background-color: rgb(233,231,235); border-radius:4px; height: 4px; width: 10px; margin-top:3px;}'+
        '#dppContainer.dpp_Elementary .dppSrsBullet.dppSrsNotPassed {background-color: var(--color-subject-srs-progress-stage-background);}'+

        '#dppContainer .dppIn90pct {background-color:rgb(245 241 249); border-radius:0; border-color:#777; border-style:solid; border-bottom-width:1px; border-top-width:1px; padding-top:3px; padding-bottom:2px;}'+
        '#dppContainer.dpp_Breeze .dppIn90pct {background-color:var(--dpp-color-ring-background, #3d3d3d); border-color: var(--dpp-color-ring-border, #bfbfbf)}'+
        '#dppContainer .dppMin90pct {border-left-style: solid; border-left-width:1px; border-top-left-radius:7px; border-bottom-left-radius:7px;}'+
        '#dppContainer .dppMax90pct {border-right-style: solid; border-right-width:1px; border-top-right-radius:7px; border-bottom-right-radius:7px;}'+

        '#dppContainer .dppBlockItem .dppPopup {visibility: hidden; position: absolute; bottom: 110%; left: -120%; background-color:rgb(245 241 249); border-radius:5px; '+
                                              'border-color:#777; border-style:solid; border-width:3px; padding: 3px;}'+
        '#dppContainer.dpp_Breeze .dppBlockItem .dppPopup {background-color: var(--dpp-color-popup-background); border-color: var(--dpp-color-popup-border, #49484b);}'+
        '#dppContainer .dppBlockItem:hover .dppPopup {visibility: visible; z-index: 20000; transition-delay: 0.2s;}'+
        '#dppContainer .dppBlockItem .dppPopup::after {content: " "; position: absolute; border-width: 7px; border-style:solid; top: calc(100% + 2px); left:5.8em; '+
                                                     'border-color:  black transparent transparent transparent ;}'+
        '#dppContainer.dpp_Breeze .dppBlockItem .dppPopup::after {border-color:  var(--dpp-color-popup-border, #49484b) transparent transparent transparent;}'+
        '#dppContainer .dppPopup td {font-size: 14px; padding: 2px 3px 2px 3px; min-width: 5em; white-space: pre;}';

    //========================================================================
    // Install stylesheet.
    //-------------------------------------------------------------------
    function install_css() {
        $('head').append('<style>'+progress_css+'</style>');
    };

    //========================================================================
    // Install menu link
    //-------------------------------------------------------------------
    function install_menu() {
		// Set up menu item to open script.
		wkof.Menu.insert_script_link({name:'dpp',submenu:'Settings',title:'Dashboard Progress Plus',on_click:open_settings});
    };

    //========================================================================
    // Inserting this script to the dashboard
    //------------------------------------------------------------------------
    function insert_container(){
        let $dppContainer = $('#dppContainer');
        if ($dppContainer) {
            $dppContainer.empty();
            $dppContainer.remove();
        };
        let dppContainer = "<div id='dppContainer' class='dppFullWidth'></div>";
        let position = settings.position;
        let dasboardPosition = '.dashboard__content';
        if (position == 0){
            // Top
            $(dasboardPosition).before(dppContainer);
        } else if (position == 1){
            // Bottom
            $(dasboardPosition).after(dppContainer);
        } else {
            // Must insert on nth line of widgets
            let settingPosition = Number(position) - 2;

            let cssPosition = '.dashboard__content > .dashboard__row';
            let $cssPosition = $(cssPosition).eq(settingPosition);
            if ($cssPosition.length !== 0 && settings.afterBefore === 'inCell') {
                let $childPosition = $cssPosition.children();
                let found = false;
                let n, $cellPosition;
                for (n = 0; n < $childPosition.length; n++) {
                    $cellPosition = $($childPosition[n]);
                    if ($cellPosition.children().length === 0){
                        found = true;
                        break;
                    };
                };
                if (found) {
                    let dppContainerInCell = "<div id='dppContainer'></div>";
                    $cellPosition.append(dppContainerInCell);
                } else {
                    $cssPosition.before(dppContainer);
                };
            } else if (settings.afterBefore === "After"){
                $cssPosition.after(dppContainer);
            } else {
                $cssPosition.before(dppContainer);
            };
        };
    };

    //========================================================================
    // Populating the dashboard with items data
    //------------------------------------------------------------------------
    async function populate_dashboard(){
        let $container = $('#dppContainer');
        let content = "<div class='dppTopHeader'>Progress to Level Up</div>";

        $container.append(content);
        content = "<br><div class='dppLowerHeader'>Radicals</div>";
        $container.append(content);
        content = "<br><div id='dppRadicalList' class='dppItemList'></div>"
        $container.append(content);
        let a = await makeItemList('radical')
        $('#dppRadicalList').append(a);

        content = "<br><div class='dppLowerHeader'>Kanji</div>";
        $container.append(content);
        content = "<br><div id='dppKanjiList' class='dppItemList'></div>"
        $container.append(content);
        a = await makeItemList('kanji')
        $('#dppKanjiList').append(a);
    };

    //========================================================================
    // Making a list of item html data
    //------------------------------------------------------------------------
    async function makeItemList(itemType){
        let descriptors = [];
        let item;
        for (item of items){
            if (item.object !== itemType) continue;

            let descriptor = {item: null, available: null, srs_stage: null, topClasses: null, body:null, popup: null};
            descriptor.item = item;
            descriptor.available = (item.assignments ? item.assignments.available_at ? item.assignments.available_at : 'Unscheduled' : 'Unscheduled');
            if (settings.enable_popup) descriptor.popup = makePopup(item);

            let characters = '';
            if (settings.show_char) {
                if (item.data.characters !== null){
                    characters = '<span lang="JP">'+item.data.characters+'</span>';
                } else {
                    characters = await svgData(item);
                };
            };

            let blockItem = '';

            console.log('dpp checking item', item.object);
            if (!item.assignments || item.assignments.unlocked_at === null){ //locked item
                descriptor.srs_stage = -1;
                blockItem += '<div class="dppItem dppLockedItem '+item.object+'">'+characters+'</div>';
                blockItem += '<div class="dppFootnote dppNoteText">Locked</div>';
            } else if (item.assignments.srs_stage === 0) { // initiate item
                descriptor.srs_stage = 0;
                blockItem += '<div class="dppItem dppInitiateItem '+item.object+'">'+characters+'</div>';
                blockItem += '<div class="dppFootnote dppNoteText">Lesson</div>';
            } else {
                blockItem += '<div class="dppItem dppReviewedItem '+item.object+'">'+characters+'</div>';
                blockItem += '<div class="dppFootnote dppProgress">';
                if (item.assignments.passed_at !==null) { // Gurued item
                    descriptor.srs_stage = Math.max(5, item.assignments.srs_stage);
                    blockItem += '<div class="dppSrsBullet dppGurued"></div>';
                } else { // Not yet gurued item
                    descriptor.srs_stage = item.assignments.srs_stage;
                    let srs = Number(item.assignments.srs_stage);
                    let max = 5;
                    let i;
                    for (i = 0; i < srs; i++) {
                        blockItem += '<div class="dppSrsBullet dppSrsPassed"></div>';
                    };
                    for (i = i; i < max; i++) {
                        blockItem += '<div class="dppSrsBullet dppSrsNotPassed"></div>';
                    };
                };
                blockItem += '</div>';
            };
            descriptor.body = blockItem;
            descriptors.push(descriptor);
        };

        if (settings.sortOrder === 'Descending'){
            descriptors.sort(sortDescending);

            if (itemType !== 'radical'){
                let cutoff90pct = Math.ceil(0.9 * descriptors.length) - 1;// Need subtracting 1 because index starts at 0 and is inclcuded in the 90% series;
                for (let index in descriptors){
                    let descriptor = descriptors[index];
                    if (!settings.show_90percent) {
                        descriptor.topClasses = '';
                        continue;
                    };
                    if (index == 0) {descriptor.topClasses = 'dppMin90pct dppIn90pct'};
                    if (index > 0 && index < cutoff90pct) {descriptor.topClasses = 'dppIn90pct'};
                    if (index == cutoff90pct) {descriptor.topClasses = 'dppMax90pct dppIn90pct'};
                    if (index > cutoff90pct) {descriptor.topClasses = ''};
                };
            };
        } else {
            // Ascending sort order
            descriptors.sort(sortAscending);

            if (itemType !== 'radical'){
                let cutoff90pct = Math.ceil(0.9 * descriptors.length);// Index 0 is not in the 90% series of item so no need for subtracting 1 here
                cutoff90pct = descriptors.length - cutoff90pct;
                let maxIndex = descriptors.length - 1;
                for (let index in descriptors){
                    let descriptor = descriptors[index];
                    if (!settings.show_90percent) {
                        descriptor.topClasses = '';
                        continue;
                    };
                    if (index < cutoff90pct) {descriptor.topClasses = ''};
                    if (index == cutoff90pct) {descriptor.topClasses = 'dppMin90pct dppIn90pct'};
                    if (index > cutoff90pct && index < maxIndex) {descriptor.topClasses = 'dppIn90pct'};
                    if (index == maxIndex) {descriptor.topClasses = 'dppMax90pct dppIn90pct'};
                };
            };
        }

        let content = [];
        for (let descriptor of descriptors){
            content.push('<div class="dppBlockItem'+(descriptor.topClasses ? ' '+descriptor.topClasses : '')+'">');
            content.push(descriptor.body);
            if (settings.enable_popup) content.push(descriptor.popup);
            content.push('</div>');
        };

        return content.join('');
    };

    //========================================================================
    // Sorting functions for descriptors
    //------------------------------------------------------------------------
    function sortDescending(a, b){
        if (a.srs_stage < b.srs_stage){
            return 1;
        } else if (b.srs_stage < a.srs_stage){
            return -1;
        } else if (a.available < b.available){
            return -1;
        } else if (b.available < a.available){
            return 1;
        } else {
            return 0;
        };
    };

    function sortAscending(a, b){
        if (a.srs_stage < b.srs_stage){
            return -1;
        } else if (b.srs_stage < a.srs_stage){
            return 1;
        } else if (a.available < b.available){
            return 1;
        } else if (b.available < a.available){
            return -1;
        } else {
            return 0;
        };
    };

    //========================================================================
    // Create the html for the item popup
    //------------------------------------------------------------------------
    function makePopup(item){
        let html = '<div class="dppPopup"><table class="dppTable"><tbody>';
        let assignments = item.assignments;

        if (settings.show_meaning) {html += '<tr><td class="dppLabel">Meaning</td><td class="dppValue">'+findMeaning(item)+'</td></tr>';};
        if (item.object !== 'radical' && settings.show_reading) {
            html += '<tr><td class="dppLabel">Reading</td><td class="dppValue"><span lang="JP">'+findReading(item)+'</span></td></tr>';
        };
        if (settings.show_srs) {html += '<tr><td class="dppLabel">SRS Stage</td><td class="dppValue">'+findSrsStage(item)+'</td></tr>';};
        if (!assignments || assignments.available_at === null){
            if (settings.show_next_review) {html += '<tr><td class="dppLabel">Next Review</td><td class="dppValue">Not yet</td></tr>';};
        } else {
            let d = new Date(assignments.available_at);
            if (settings.show_next_review) {html += '<tr><td class="dppLabel">Next Review</td><td class="dppValue">'+formatDate(d, true)+'</td></tr>';};
        };
        if (!assignments || assignments.passed_at === null) {
            if (settings.show_passed) {html += '<tr><td class="dppLabel">Date Gurued</td><td class="dppValue">Not yet</td></tr>';};
        } else {
            let d = new Date(assignments.passed_at);
            if (settings.show_passed) {html += '<tr><td class="dppLabel">Date Gurued</td><td class="dppValue">'+formatDate(d, false)+'</td></tr>';};
        };

        html += '</tbody></table></div>';
        return html;
    };

    function findMeaning(item){
        var meaning = item.data.meanings[0].meaning;
        for (let k = 0; k < item.data.meanings.length; k++){if (item.data.meanings[k].primary){meaning = item.data.meanings[k].meaning}};
        return meaning;
    };

    function findReading(item) {
        var reading = item.data.readings[0].reading;
        for (let k = 0; k < item.data.readings.length; k++){if (item.data.readings[k].primary){reading = item.data.readings[k].reading}};
        return reading;
    };

    let srs_stages = ['Lesson','Apprentice 1','Apprentice 2','Apprentice 3','Apprentice 4','Guru 1','Guru 2','Master','Enlightened','Burned'];
    function findSrsStage(item) {
        if (!item.assignments || item.assignments.unlocked_at === null) {return 'Locked';};
        if (item.assignments.started_at === null){return 'Lesson';};
        return srs_stages[item.assignments.srs_stage];
    };

    //========================================================================
    // Create the svg for image only radicals
    //------------------------------------------------------------------------
    async function svgData(item){
        let svgForRadicalsFile = item.data.character_images.find((file) => (file.content_type === 'image/svg+xml')).url;
        let svgImage = await wkof.load_file(svgForRadicalsFile, false)
                             .then((function(data){let processed = data
                                                   processed = processed.replace(/\<defs\>.*\<\/defs\>/, '');
                                                   processed = processed.replace(/style="(.*?)"/g, '');
                                                   processed = processed.replace(/class="(.*?)"/g , "");
                                                   processed = processed.replace(/\<svg/ , '<svg class="radical"');
                                                   return processed;
                                                  }
                                    ));
        return svgImage;
    };

    //========================================================================
    // Print date in pretty format.
    //-------------------------------------------------------------------
    function formatDate(d, is_next_date){
        let s = '';
        let now = new Date();
        let YY = d.getFullYear(),
            MM = d.getMonth(),
            DD = d.getDate(),
            hh = d.getHours(),
            mm = d.getMinutes(),
            one_day = 24*60*60*1000;

        if (is_next_date && d < now) return "Available Now";
        let same_day = ((YY == now.getFullYear()) && (MM == now.getMonth()) && (DD == now.getDate()) ? 1 : 0);

        //    If today:  "Today 8:15pm"
        //    otherwise: "Wed, Apr 15, 8:15pm"
        if (same_day) {
            s += 'Today ';
        } else {
            s += ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]+', '+
                ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][MM]+' '+DD+', ';
        };
        if (settings.time_format === '24hour') {
            s += ('0'+hh).slice(-2)+':'+('0'+mm).slice(-2);
        } else {
            s += (((hh+11)%12)+1)+':'+('0'+mm).slice(-2)+['am','pm'][Math.floor(d.getHours()/12)];
        };

        // Append "(X days)".
        if (is_next_date && !same_day) {
            let days = (Math.floor((d.getTime()-d.getTimezoneOffset()*60*1000)/one_day)-Math.floor((now.getTime()-d.getTimezoneOffset()*60*1000)/one_day));
            if (days) s += ' ('+days+' day'+(days>1?'s':'')+')';
        };

        return s;
    };

})(window.dpp);
