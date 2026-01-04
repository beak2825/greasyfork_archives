// ==UserScript==
// @name         GALoP Lite Plus
// @namespace    http://tampermonkey.net/
// @version      2.11.0
// @description  GALoP Lite optimizations
// @author       StvnMrtns
// @match        https://portal.police.be/galoplite2/*
// @icon         https://www.google.com/s2/favicons?sz=96&domain=politie.be
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516117/GALoP%20Lite%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/516117/GALoP%20Lite%20Plus.meta.js
// ==/UserScript==

const p = {};
const d = {};
const w = {};

var version_name = '';
var version_number = GM_info.script.version;

var gmc;

(function() {
    'use strict';

    $(window).on('load', function() {

        // configuration
        var gm_config_frame = document.createElement('div');
        document.body.appendChild(gm_config_frame);

        gmc = new GM_config(
        {
            'id': 'GALOPLitePlusConfig',
            'title': 'GALoP Lite Plus | Instellingen',
            'fields':
            {
                'custom_user':
                {
                    'label': 'Gebruiker',
                    'section': ['Algemeen', ''],
                    'type': 'select',
                    'options': ['', 'JBR', 'SME', 'TVE', 'VKR'],
                    'default': ''
                },
                'custom_activity_clock':
                {
                    'section': ['Activiteiten', ''],
                    'type': 'checkbox',
                    'default': false,
                    'label': 'Optie prikklok'
                },
                'custom_activity_bike':
                {
                    'type': 'checkbox',
                    'default': false,
                    'label': 'Optie fietsvergoeding'
                },
                'custom_activity_train':
                {
                    'type': 'checkbox',
                    'default': false,
                    'label': 'Treinwerk'
                },
                'custom_button_timesheet':
                {
                    'section': ['Snelkoppelingen', ''],
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Timesheet'
                },
                'custom_button_neweform':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Nieuw e-formulier'
                },
                'custom_button_paymentfiles':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Loonfiches'
                },
                'custom_button_mealcheques':
                {
                    'type': 'checkbox',
                    'default': true,
                    'label': 'Maaltijdcheques'
                }
            },
            'events':
            {
                'save': function(){
                    window.location.reload(true);
                },
                'reset': function(){
                    window.location.reload(true);
                },
                'init': function(){

                    // global structure
                    editGlobalStructure(version_name, version_number);

                    // definitions
                    editPageTimesheetDefinitions();

                    initPages();
                }
            },
            'frame': gm_config_frame
        });
    });

})();

// ***********************************************
// Init pages
// ***********************************************
function initPages()
{
    var page_url = window.location.href;

    var page_timesheet = page_url.indexOf('/Agenda/Timesheet') >= 0;

    $('body').on('click', '.gm_config_open', function(e){
        e.preventDefault();

        gmc.open();

        GM_addStyle('#GALOPLitePlusConfig { width: 40% !important; height: 500px !important; background-color: #FFFFFF !important; border: 1px solid #21ba45 !important; border-radius: 5px !important; overflow: hidden; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_header { padding: 10px !important; background-color: #21ba45 !important; color: #FFFFFF !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_wrapper .section_header_holder { margin-top: 0px !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_wrapper .section_header_holder .section_header { padding: 5px 5px 5px 10px !important; margin: 0px 0px 5px 0px; background-color: #daf8e1 !important; border: none !important; color: #21ba45 !important; text-align: left !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_wrapper .section_header_holder .section_desc { padding: 5px !important; border: none !important; color: #000000 !important; background: transparent !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_wrapper label { margin: 2px 10px !important; color: #000000 !important; min-width: 150px !important; display: inline-block; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_wrapper input { margin: 2px 10px !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_wrapper select { margin: 2px 10px !important; min-width: 250px !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_buttons_holder { margin-top: 25px !important; background-color: #daf8e1 !important; text-align: center !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_buttons_holder button { padding: 7px 16px !important; line-height: normal !important; }');
        GM_addStyle('#GALOPLitePlusConfig #GALOPLitePlusConfig_resetLink { color: #21ba45 !important; }');
    });

    // global CSS
    editGlobalCSS();


    // wait till dynamic content is loaded
    waitForKeyElements ('a#headerZonename', editGlobalStructure);

    // wait till dynamic content is loaded
    waitForKeyElements ('div.content div.fc-timegrid th.fc-timegrid-axis', editPageTimesheetCalendar);

    // wait till dynamic content is loaded
    waitForKeyElements ('div.q-card.large', editPageTimesheetAdd);
}

// ***********************************************
// Edit global structure
// ***********************************************
function editGlobalStructure()
{
    // GALOP Lite 2.0 Plus
    var el_logoplus = ' <span class="navbar-brand text-subtitle2 q-ml-sm">GALoP Lite Plus '+version_name+'<span class="version"> v'+version_number+'</span></span>';

    var buttons = '';
    var config = '';

    if(gmc.get('custom_button_timesheet') == true)
    {
        buttons += '<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--round text-white q-btn--actionable q-focusable q-hoverable primary bg-green q-ml-lg" href="#/Agenda/Timesheet" title="Timesheet">';
        buttons += '  <span class="q-focus-helper" tabindex="-1"></span>';
        buttons += '  <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon mdi mdi-calendar-edit" aria-hidden="true" role="presentation" style="font-size: 16px;"> </i></span>';
        buttons += '</a>'
    }

    if(gmc.get('custom_button_neweform') == true)
    {
        buttons += '<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--round text-white q-btn--actionable q-focusable q-hoverable primary bg-green q-ml-lg" href="#/Eform/NewEform" title="Nieuw e-formulier">';
        buttons += '  <span class="q-focus-helper" tabindex="-1"></span>';
        buttons += '  <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon mdi mdi-file-multiple" aria-hidden="true" role="presentation" style="font-size: 16px;"> </i></span>';
        buttons += '</a>';
    }

    if(gmc.get('custom_button_paymentfiles') == true)
    {
        buttons += '<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--round text-white q-btn--actionable q-focusable q-hoverable primary bg-green q-ml-lg" href="#/Personal/PaymentFiles" title="Loonfiches">';
        buttons += '  <span class="q-focus-helper" tabindex="-1"></span>';
        buttons += '  <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon mdi mdi-currency-eur" aria-hidden="true" role="presentation" style="font-size: 16px;"> </i></span>';
        buttons += '</a>';
    }

    if(gmc.get('custom_button_mealcheques') == true)
    {
        buttons += '<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--round text-white q-btn--actionable q-focusable q-hoverable primary bg-green q-ml-lg" href="#/Report/MealCheques" title="Maaltijdcheques">';
        buttons += '  <span class="q-focus-helper" tabindex="-1"></span>';
        buttons += '  <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon fas fa-utensils" aria-hidden="true" role="presentation" style="font-size: 16px;"> </i></span>';
        buttons += '</a>';
    }


    config += '<a class="q-btn q-btn-item non-selectable no-outline q-btn--outline q-btn--round text-white q-btn--actionable q-focusable q-hoverable primary bg-green q-ml-sm gm_config_open" href="#/Plus/Settings" title="GALoP Lite Plus Instellingen" style="font-size: 6px;">';
    config += '  <span class="q-focus-helper" tabindex="-1"></span>';
    config += '  <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon fas fa-gear" aria-hidden="true" role="presentation" style="font-size: 10px;"> </i></span>';
    config += '</a>';

    setTimeout(function(){
        if($('header.q-header div.q-toolbar__title span.navbar-brand.text-subtitle2.q-ml-sm').length == 0)
        {
            $('header.q-header div.q-toolbar__title').append(buttons).append(el_logoplus).append(config);
        }
    }, 2000);
}

// ***********************************************
// Edit global CSS
// ***********************************************
function editGlobalCSS()
{
    var page_url = window.location.href;
    var page_timesheet = page_url.indexOf('/Agenda/Timesheet') >= 0;

    var width_card = 0;
    var width_form = 575;
    var width_timesheet = 0;
    var width_timesheet_overview = 150;
    var width_timesheet_days = 0;
    var width_timesheet_scroll = 0;
    //var width_full = 0;
    var width_timesheet_scroll_max = 600;

    var workdays = Object.keys(w).length - 1; // workday_available > hidden

    width_timesheet_days = (100 * workdays);
    width_timesheet_scroll = width_timesheet_days > width_timesheet_scroll_max ? width_timesheet_scroll_max : width_timesheet_days;

    width_timesheet = width_timesheet_overview + width_timesheet_scroll + 10;

    width_card = width_form + width_timesheet + 50;

    //GM_addStyle('body.body--light div.modal-body * { color: #333333; }');
    //GM_addStyle('body.body--dark div.modal-body .q-radio__bg { background-color: #000000; }');


    GM_addStyle('header.q-header div.q-toolbar__title span.navbar-brand.text-subtitle2 { font-weight: 100; }');


    GM_addStyle('span.el_custom_registration_worked_hours { font-weight: normal; position: absolute; top: 5px; right: 5px; }');
    GM_addStyle('span.el_custom_registration_worked_hours sup { font-size: 9px; }');
    GM_addStyle('span.el_custom_header_date_extra { display: block; font-size: 0.8em; }');
    GM_addStyle('button.custom_el_registration.related { opacity: 0.50; }');


    GM_addStyle('body div.modal-body .q-field { border-radius: 5px; }');
    GM_addStyle('body div.modal-body .note { margin-bottom: 10px; }');

    GM_addStyle('div#buttons div { margin-bottom: 10px; }');

    GM_addStyle('div.q-card.large.custom_q-card_width { width: '+width_card+'px !important; max-width: '+width_card+'px !important; }');
    GM_addStyle('div.q-card.large.custom_q-card_width div.modal-body { display: inline-block; width: '+width_form+'px; }'); // width: 45%;

    GM_addStyle('div.q-card.large div.custom_el_overlay { background: rgba(255, 255, 255, 0.15); width: 0px; height: 0px; position: absolute; left: 0px; top: 5px; cursor: wait; }');

    GM_addStyle('div#fkSubdivision span { font-size: 12px; line-height: 10px; }');

    GM_addStyle('div.custom_buttons_timesheet { padding-left: 10px; display: inline-block; width: '+width_timesheet+'px; height: 475px; float: right; position: relative; }'); // width: 55%;
    GM_addStyle('div.custom_buttons_timesheet div.custom_buttons_timesheet_scroll { width: '+width_timesheet_scroll+'px; height: 445px; overflow-x: scroll; }');
    GM_addStyle('div.custom_buttons_timesheet div.custom_buttons_timesheet_days { display: flex; width: '+width_timesheet_days+'px; }');
    //GM_addStyle('div.custom_buttons_timesheet div.custom_buttons_timesheet_days { display: flex; }');
    GM_addStyle('div.custom_buttons_timesheet div.custom_buttons_timesheet_days div.custom_buttons_timesheet_day { flex: 14.28%; }');
    //GM_addStyle('div.custom_buttons_timesheet div.custom_buttons_timesheet_overview { position: absolute; left: 10px; bottom: 0px; }');
    GM_addStyle('div.custom_buttons_timesheet div.custom_buttons_timesheet_overview { float: left; width: '+width_timesheet_overview+'px; }');
    GM_addStyle('div.custom_buttons_timesheet div.custom_buttons_timesheet_overview button.q-btn.q-btn--actionable { width: '+(width_timesheet_overview - 20)+'px; }');

    GM_addStyle('div.custom_buttons_timesheet button.q-btn { margin: 0px 4px 4px 0px; padding: 2px 10px; min-height: 25px; color: #EEEEEE; font-size: 10px; }');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.custom_el_timesheet { min-width: 70px; }');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height2 { min-height: 54px;}');    // (25 * x) + (4 * (x - 1))
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height3 { min-height: 83px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height4 { min-height: 112px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height5 { min-height: 141px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height6 { min-height: 170px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height7 { min-height: 199px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height8 { min-height: 228px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height9 { min-height: 257px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height10 { min-height: 286px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height11 { min-height: 315px;}');
    GM_addStyle('div.custom_buttons_timesheet button.q-btn.height13 { min-height: 373px;}');
    GM_addStyle('div.custom_buttons_timesheet i.q-icon { font-size: 12px; }');
    GM_addStyle('div.custom_buttons_timesheet i.q-icon.icon-right { margin-left: auto; }');
    GM_addStyle('div.custom_buttons_timesheet div.related { opacity: 0.50; }');
    GM_addStyle('div.custom_buttons_timesheet button.disabled { opacity: 0.20 !important; }');

    GM_addStyle('div.custom_buttons_timesheet span.custom_el_activity-spacing { display: block; font-size: 6px; }');

    GM_addStyle('i.custom_icon { margin: 1px 4px 0px -14px; font-size: 12px; vertical-align: text-top; }');
}

// ***********************************************
// Edit Timesheet page: definitions
// ***********************************************
function editPageTimesheetDefinitions()
{
    var type = '';

    // activity
    // +++++++++++++++++++++++++++++++++++++++++++
    //  regular, regular_clock, regular_bike, homework, train, available

    type = 'activity_ict_regular';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'ict';
        d[type].flexwork_type = 'none';

        d[type].button_icon = '<i class="q-icon far fa-building"></i>';
        d[type].button_text = 'ICT | regulier';
        d[type].button_full = 'ICT | regulier';
        d[type].button_color = 'bg-blue';


    type = 'activity_ict_regular_clock';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'ict';
        d[type].times_type = 'clocked';
        d[type].flexwork_type = 'none';

        d[type].button_icon = '<i class="q-icon far fa-building"></i>';
        d[type].button_icon_extra = '<i class="q-icon fas fa-clock icon-right"></i>';
        d[type].button_text = 'ICT | regulier';
        d[type].button_full = 'ICT | regulier op basis van prikklok';
        d[type].button_color = 'bg-cyan-9';


    type = 'activity_ict_regular_clock_bike';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'ict';
        d[type].times_type = 'clocked';
        d[type].compensation_type = 'bike';
        d[type].flexwork_type = 'none';

        d[type].button_icon = '<i class="q-icon far fa-building"></i>';
        d[type].button_icon_extra = '<i class="q-icon fas fa-bicycle icon-right"></i><i class="q-icon fas fa-clock icon-right"></i>';
        d[type].button_text = 'ICT | regulier';
        d[type].button_full = 'ICT | regulier op basis van prikklok met fietsvergoeding';
        d[type].button_color = 'bg-cyan-9';


    type = 'activity_ict_regular_bike';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'ict';
        d[type].compensation_type = 'bike';
        d[type].flexwork_type = 'none';

        d[type].button_icon = '<i class="q-icon far fa-building"></i>';
        d[type].button_icon_extra = '<i class="q-icon fas fa-bicycle icon-right"></i>';
        d[type].button_text = 'ICT | regulier';
        d[type].button_full = 'ICT | regulier met fietsvergoeding';
        d[type].button_color = 'bg-cyan-9';


    type = 'activity_ict_homework';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'ict';
        d[type].flexwork_type = 'home';

        d[type].button_icon = '<i class="q-icon fas fa-house"></i>';
        d[type].button_text = 'ICT | thuiswerk';
        d[type].button_full = 'ICT | thuiswerk';
        d[type].button_color = 'bg-deep-purple-4';


    type = 'activity_ict_trainwork';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'ict';
        d[type].flexwork_type = 'train';

        d[type].button_icon = '<i class="q-icon fas fa-train"></i>';
        d[type].button_text = 'ICT | treinwerk';
        d[type].button_full = 'ICT | treinwerk';
        d[type].button_color = 'bg-amber';


    type = 'activity_available';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'available';
        d[type].flexwork_type = 'none';

        d[type].button_icon = '<i class="q-icon fas fa-phone"></i>';
        d[type].button_text = 'B&T';
        d[type].button_full = 'Bereikbaar & Terugroepbaar';
        d[type].button_color = 'bg-grey';


    type = 'activity_available_clock';
        d[type] = {};
        d[type].type = 'activity';

        d[type].activity_type = 'available';
        d[type].times_type = 'clocked';
        d[type].flexwork_type = 'none';

        d[type].button_icon = '<i class="q-icon fas fa-phone"></i>';
        d[type].button_icon_extra = '<i class="q-icon fas fa-clock icon-right"></i>';
        d[type].button_text = 'B&T';
        d[type].button_full = 'Bereikbaar & Terugroepbaar op basis van prikklok';
        d[type].button_color = 'bg-grey';


    // waitcall
    // +++++++++++++++++++++++++++++++++++++++++++
    //  regular, homework

    type = 'waitcall_regular';
        d[type] = {};
        d[type].type = 'waitcall';

        d[type].activity_type = 'ict_vg';
        d[type].flexwork_type = 'none';
        d[type].freereference_type = 'compensation-yes-waitcall';

        d[type].button_icon = '<i class="q-icon fas fa-car-side"></i>';
        d[type].button_text = 'WOPR | regulier';
        d[type].button_full = 'Wachtoproep | regulier';
        d[type].button_color = 'bg-red';


    type = 'waitcall_homework';
        d[type] = {};
        d[type].type = 'waitcall';

        d[type].activity_type = 'ict_vg';
        d[type].flexwork_type = 'home';
        d[type].freereference_type = 'compensation-yes-waitcall';

        d[type].button_icon = '<i class="q-icon fas fa-house"></i>';
        d[type].button_text = 'WOPR | thuiswerk';
        d[type].button_full = 'Wachtoproep | thuiswerk';
        d[type].button_color = 'bg-red';


    // compensation
    // +++++++++++++++++++++++++++++++++++++++++++
    //  mobilisation, other

    type = 'compensation_mobilisation';
        d[type] = {};
        d[type].type = 'compensation';

        d[type].activity_type = 'ict_vg';
        d[type].flexwork_type = 'none';
        d[type].freereference_type = 'compensation-yes-mobilisation';

        d[type].button_icon = '<i class="q-icon fas fa-bullhorn"></i>';
        d[type].button_text = 'MOBI | regulier';
        d[type].button_full = 'Mobilisatie | regulier';
        d[type].button_color = 'bg-orange';


    type = 'compensation_other';
        d[type] = {};
        d[type].type = 'compensation';

        d[type].activity_type = 'ict_vg';
        d[type].flexwork_type = 'none';
        d[type].freereference_type = 'compensation-yes-other';

        d[type].button_icon = '<i class="q-icon fas fa-sack-dollar"></i>';
        d[type].button_text = 'VGU | regulier';
        d[type].button_full = 'Vergoedingsuren | regulier';
        d[type].button_color = 'bg-orange';


    // comments
    // +++++++++++++++++++++++++++++++++++++++++++
    //  compensation: none, compensation: waitcall, compensation: other
/*
    type = 'comments_compensation_none';
        d[type] = {};
        d[type].type = 'comments';

        d[type].comments_type = 'compensation-none';

        d[type].button_icon = '<i class="q-icon fas fa-sack-xmark"></i>';
        d[type].button_text = 'VGU | geen';
        d[type].button_full = 'Vergoedingsuren | geen';
        d[type].button_color = 'bg-orange';
*/
/*
    type = 'comments_compensation_yes_waitcall';
        d[type] = {};
        d[type].type = 'comments';

        d[type].comments_type = 'compensation-yes-waitcall';

        d[type].button_icon = '<i class="q-icon fas fa-sack-dollar"></i>';
        d[type].button_text = 'VGU | wachtoproep';
        d[type].button_full = 'Vergoedingsuren | wachtoproep';
        d[type].button_color = 'bg-deep-orange';
*/
/*
    type = 'comments_compensation_yes_other';
        d[type] = {};
        d[type].type = 'comments';

        d[type].comments_type = 'compensation-yes-other';

        d[type].button_icon = '<i class="q-icon fas fa-sack-dollar"></i>';
        d[type].button_text = 'VGU | andere';
        d[type].button_full = 'Vergoedingsuren | andere';
        d[type].button_color = 'bg-deep-orange';
*/

    // +++++++++++++++++++++++++++++++++++++++++++


    // timesheet
    // +++++++++++++++++++++++++++++++++++++++++++
    //  available
    type = 'timesheet_avail_clock_in';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '00:00';
        d[type].times_work_end = 'IN';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_clock_out';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = 'OUT';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0000_0530';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '00:00';
        d[type].times_work_end = '05:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0000_0600';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '00:00';
        d[type].times_work_end = '06:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0000_0630';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '00:00';
        d[type].times_work_end = '06:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_available.button_color;


    type = 'timesheet_avail_0000_0700';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '00:00';
        d[type].times_work_end = '07:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_available.button_color;


    type = 'timesheet_avail_0000_0800';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '00:00';
        d[type].times_work_end = '08:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_available.button_color;


    type = 'timesheet_avail_0000_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '00:00';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height13 '+d.activity_available.button_color;


    type = 'timesheet_avail_0745_0900';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '07:45';
        d[type].times_work_end = '09:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0745_1030';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '07:45';
        d[type].times_work_end = '10:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0800_0900';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '08:00';
        d[type].times_work_end = '09:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0800_0930';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '08:00';
        d[type].times_work_end = '09:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_available.button_color;


    type = 'timesheet_avail_0800_1000';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '08:00';
        d[type].times_work_end = '10:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_available.button_color;


    type = 'timesheet_avail_0800_1030';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '08:00';
        d[type].times_work_end = '10:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0815_0900';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '08:15';
        d[type].times_work_end = '09:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_0815_1030';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '08:15';
        d[type].times_work_end = '10:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_1100_1200';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '11:00';
        d[type].times_work_end = '12:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_1230_1330';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '12:30';
        d[type].times_work_end = '13:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_1400_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '14:00';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height4 '+d.activity_available.button_color;


    type = 'timesheet_avail_1415_1430';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '14:15';
        d[type].times_work_end = '14:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_1430_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '14:30';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height4 '+d.activity_available.button_color;


    type = 'timesheet_avail_1500_1515';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '15:00';
        d[type].times_work_end = '15:15';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_1500_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '15:00';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height3 '+d.activity_available.button_color;


    type = 'timesheet_avail_1515_1530';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '15:15';
        d[type].times_work_end = '15:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_available.button_color;


    type = 'timesheet_avail_1515_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '15:15';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height3 '+d.activity_available.button_color;


    type = 'timesheet_avail_1530_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '15:30';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_available.button_color;


    type = 'timesheet_avail_1545_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '15:45';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_available.button_color;


    type = 'timesheet_avail_1600_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '16:00';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height1 '+d.activity_available.button_color;


    type = 'timesheet_avail_1615_2400';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_available.activity_type;
        d[type].flexwork_type = d.activity_available.flexwork_type;
        d[type].times_work_start = '16:15';
        d[type].times_work_end = '24:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_available.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height1 '+d.activity_available.button_color;


    // timesheet
    // +++++++++++++++++++++++++++++++++++++++++++
    //  regular
    type = 'timesheet_regular_0600_1400_1130_1200';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '06:00';
        d[type].times_work_end = '14:00';
        d[type].times_pauze_start = '11:30';
        d[type].times_pauze_end = '12:00';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height8 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0600_1600_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '06:00';
        d[type].times_work_end = '16:00';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height11 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0630_1415_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '06:30';
        d[type].times_work_end = '14:15';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height6 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0630_1500_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '06:30';
        d[type].times_work_end = '15:00';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height7 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0630_1515_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '06:30';
        d[type].times_work_end = '15:15';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height8 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0715_1200';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '07:15';
        d[type].times_work_end = '12:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height6 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0930_1415_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '09:30';
        d[type].times_work_end = '14:15';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height3 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0930_1515_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '09:30';
        d[type].times_work_end = '15:15';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height5 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0945_1415_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '09:45';
        d[type].times_work_end = '14:15';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height3 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0945_1500_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '09:45';
        d[type].times_work_end = '15:00';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height4 '+d.activity_ict_regular.button_color;


    type = 'timesheet_regular_0945_1515_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].times_work_start = '09:45';
        d[type].times_work_end = '15:15';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height5 '+d.activity_ict_regular.button_color;


    // timesheet
    // +++++++++++++++++++++++++++++++++++++++++++
    //  regular_clock
    type = 'timesheet_regular_clock_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular.activity_type;
        d[type].flexwork_type = d.activity_ict_regular.flexwork_type;
        d[type].compensation_type = d.activity_ict_regular.compensation_type;
        d[type].times_work_start = 'IN';
        d[type].times_work_end = 'OUT';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular_clock.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height11 '+d.activity_ict_regular_clock.button_color;

    // timesheet
    // +++++++++++++++++++++++++++++++++++++++++++
    //  regular_bike
    type = 'timesheet_regular_bike_clock_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular_bike.activity_type;
        d[type].flexwork_type = d.activity_ict_regular_bike.flexwork_type;
        d[type].compensation_type = d.activity_ict_regular_bike.compensation_type;
        d[type].times_work_start = 'IN';
        d[type].times_work_end = 'OUT';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular_bike.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height11 '+d.activity_ict_regular_bike.button_color;


    type = 'timesheet_regular_bike_0700_1500_1130_1200';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular_bike.activity_type;
        d[type].flexwork_type = d.activity_ict_regular_bike.flexwork_type;
        d[type].compensation_type = d.activity_ict_regular_bike.compensation_type;
        d[type].times_work_start = '07:00';
        d[type].times_work_end = '15:00';
        d[type].times_pauze_start = '11:30';
        d[type].times_pauze_end = '12:00';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular_bike.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height8 '+d.activity_ict_regular_bike.button_color;


    type = 'timesheet_regular_bike_0800_1600_1130_1200';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_regular_bike.activity_type;
        d[type].flexwork_type = d.activity_ict_regular_bike.flexwork_type;
        d[type].compensation_type = d.activity_ict_regular_bike.compensation_type;
        d[type].times_work_start = '08:00';
        d[type].times_work_end = '16:00';
        d[type].times_pauze_start = '11:30';
        d[type].times_pauze_end = '12:00';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_regular_bike.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height8 '+d.activity_ict_regular_bike.button_color;


    // timesheet
    // +++++++++++++++++++++++++++++++++++++++++++
    //  homework
    type = 'timesheet_homework_0530_0745';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '05:30';
        d[type].times_work_end = '07:45';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        //d[type].freereference_type = d.freereference_compensation_none.freereference_type

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_0530_0800';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '05:30';
        d[type].times_work_end = '08:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        //d[type].freereference_type = d.freereference_compensation_none.freereference_type

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_0530_0815';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '05:30';
        d[type].times_work_end = '08:15';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';
        //d[type].freereference_type = d.freereference_compensation_none.freereference_type

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_0600_1100';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '06:00';
        d[type].times_work_end = '11:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height5 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_0600_1430_1130_1200';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '06:00';
        d[type].times_work_end = '14:30';
        d[type].times_pauze_start = '11:30';
        d[type].times_pauze_end = '12:00';

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height6 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_0900_1515_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '09:00';
        d[type].times_work_end = '15:15';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height6 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_1000_1230_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '10:00';
        d[type].times_work_end = '12:30';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_1030_1530_1200_1230';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '10:30';
        d[type].times_work_end = '15:30';
        d[type].times_pauze_start = '12:00';
        d[type].times_pauze_end = '12:30';
        d[type].freereference_type = '';

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height7 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_1200_1500';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '12:00';
        d[type].times_work_end = '15:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height3 '+d.activity_ict_homework.button_color;


    type = 'timesheet_homework_1330_1515';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_homework.activity_type;
        d[type].flexwork_type = d.activity_ict_homework.flexwork_type;
        d[type].times_work_start = '13:30';
        d[type].times_work_end = '15:15';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_homework.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = 'height2 '+d.activity_ict_homework.button_color;


    // timesheet
    // +++++++++++++++++++++++++++++++++++++++++++
    //  trainwork
    type = 'timesheet_trainwork_0600_0630';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '06:00';
        d[type].times_work_end = '06:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    //  trainwork
    type = 'timesheet_trainwork_0900_0930';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '09:00';
        d[type].times_work_end = '09:30';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    //  trainwork
    type = 'timesheet_trainwork_0915_0945';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '09:15';
        d[type].times_work_end = '09:45';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    //  trainwork
    type = 'timesheet_trainwork_1430_1500';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '14:30';
        d[type].times_work_end = '15:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    //  trainwork
    type = 'timesheet_trainwork_1430_1515';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '14:30';
        d[type].times_work_end = '15:15';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    //  trainwork
    type = 'timesheet_trainwork_1515_1545';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '15:15';
        d[type].times_work_end = '15:45';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    //  trainwork
    type = 'timesheet_trainwork_1530_1600';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '15:30';
        d[type].times_work_end = '16:00';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    //  trainwork
    type = 'timesheet_trainwork_1530_1615';
        d[type] = {};
        d[type].type = 'timesheet';

        d[type].activity_type = d.activity_ict_trainwork.activity_type;
        d[type].flexwork_type = d.activity_ict_trainwork.flexwork_type;
        d[type].times_work_start = '15:30';
        d[type].times_work_end = '16:15';
        d[type].times_pauze_start = '';
        d[type].times_pauze_end = '';

        d[type].button_icon = d.activity_ict_trainwork.button_icon;
        d[type].button_text = d[type].times_work_start+'-'+d[type].times_work_end;
        d[type].button_color = d.activity_ict_trainwork.button_color;


    // +++++++++++++++++++++++++++++++++++++++++++

    // WERKDAGEN JBR
    if(gmc.get('custom_user') == 'JBR')
    {
        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  clock and bik
        type = 'workday_clock_and_bike';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Prikklok met fietsvergoeding';
            w[type].icon = 'fas fa-clock';
            w[type].color = 'cyan-9';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_clock_in');
            w[type].buttons.push('timesheet_regular_bike_clock_1200_1230');
            w[type].buttons.push('timesheet_avail_clock_out');

        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  clock
        type = 'workday_clock';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Prikklok';
            w[type].icon = 'fas fa-clock';
            w[type].color = 'cyan-9';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_clock_in');
            w[type].buttons.push('timesheet_regular_clock_1200_1230');
            w[type].buttons.push('timesheet_avail_clock_out');
    }

    // WERKDAGEN SME
    if(gmc.get('custom_user') == 'SME')
    {
        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  early
        type = 'workday_early_0';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Vroege';
            w[type].icon = 'fas fa-train';
            w[type].color = 'amber';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0600');
            w[type].buttons.push('timesheet_trainwork_0600_0630');
            w[type].buttons.push('timesheet_regular_0630_1515_1200_1230');
            w[type].buttons.push('timesheet_avail_1515_1530');
            w[type].buttons.push('timesheet_trainwork_1530_1600');
            w[type].buttons.push('timesheet_avail_1600_2400');

        type = 'workday_early_1';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Vroege Chill';
            w[type].icon = 'fas fa-train';
            w[type].color = 'amber-4';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0630');
            w[type].buttons.push('timesheet_regular_0630_1515_1200_1230');
            w[type].buttons.push('timesheet_avail_1515_2400');


        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  late
        type = 'workday_late_0';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Late';
            w[type].icon = 'fas fa-briefcase';
            w[type].color = 'orange';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0530');
            w[type].buttons.push('timesheet_homework_0530_0800');
            w[type].buttons.push('timesheet_avail_0800_0900');
            w[type].buttons.push('timesheet_trainwork_0900_0930');
            w[type].buttons.push('timesheet_regular_0930_1515_1200_1230');
            w[type].buttons.push('timesheet_avail_1515_1530');
            w[type].buttons.push('timesheet_trainwork_1530_1600');
            w[type].buttons.push('timesheet_avail_1600_2400');

        type = 'workday_late_1';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Late Chill';
            w[type].icon = 'fas fa-briefcase';
            w[type].color = 'orange-4';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0530');
            w[type].buttons.push('timesheet_homework_0530_0800');
            w[type].buttons.push('timesheet_avail_0800_0930');
            w[type].buttons.push('timesheet_regular_0930_1515_1200_1230');
            w[type].buttons.push('timesheet_avail_1515_2400');


        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  home
        type = 'workday_home_0';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Thuiswerken';
            w[type].icon = 'fas fa-house';
            w[type].color = 'deep-purple-4';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0530');
            w[type].buttons.push('timesheet_homework_0530_0800');
            w[type].buttons.push('timesheet_avail_0800_0900');
            w[type].buttons.push('timesheet_homework_0900_1515_1200_1230');
            w[type].buttons.push('timesheet_avail_1515_2400');

        type = 'workday_home_1';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Thuiswerken';
            w[type].icon = 'fas fa-house';
            w[type].color = 'deep-purple-4';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0530');
            w[type].buttons.push('timesheet_homework_0530_0800');
            w[type].buttons.push('timesheet_avail_0800_1000');
            w[type].buttons.push('timesheet_homework_1000_1230_1200_1230');
            w[type].buttons.push('timesheet_avail_1230_1330');
            w[type].buttons.push('timesheet_homework_1330_1515');
            w[type].buttons.push('timesheet_avail_1515_2400');


        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  wait
        type = 'workday_wait';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Permanentie';
            w[type].icon = 'fas fa-car-side';
            w[type].color = 'blue';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0600');
            w[type].buttons.push('timesheet_regular_0600_1600_1200_1230');
            w[type].buttons.push('timesheet_avail_1600_2400');


        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  short

        type = 'workday_early_short';
            w[type] = {};
            w[type].related = true;
            w[type].name = 'Vroege Kort';
            w[type].icon = 'fas fa-train';
            w[type].color = 'amber';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0600');
            w[type].buttons.push('timesheet_trainwork_0600_0630');
            w[type].buttons.push('timesheet_regular_0630_1415_1200_1230');
            w[type].buttons.push('timesheet_avail_1415_1430');
            w[type].buttons.push('timesheet_trainwork_1430_1500');
            w[type].buttons.push('timesheet_avail_1500_2400');

        type = 'workday_late_short';
            w[type] = {};
            w[type].related = true;
            w[type].name = 'Late Kort';
            w[type].icon = 'fas fa-briefcase';
            w[type].color = 'orange';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0530');
            w[type].buttons.push('timesheet_homework_0530_0800');
            w[type].buttons.push('timesheet_avail_0800_0900');
            w[type].buttons.push('timesheet_trainwork_0900_0930');
            w[type].buttons.push('timesheet_regular_0930_1415_1200_1230');
            w[type].buttons.push('timesheet_avail_1415_1430');
            w[type].buttons.push('timesheet_trainwork_1430_1500');
            w[type].buttons.push('timesheet_avail_1500_2400');


        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  test
        /*
        type = 'workday_test';
            w[type] = {};
            w[type].related = true;
            w[type].name = 'test';
            w[type].icon = 'fas fa-flask';
            w[type].color = 'red';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_2400');
        */
    }

    // WERKDAGEN TVE
    if(gmc.get('custom_user') == 'TVE')
    {
        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  standard
        type = 'workday_standard';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Standaard';
            w[type].icon = 'fas fa-train';
            w[type].color = 'amber';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0800');
            w[type].buttons.push('timesheet_regular_bike_0800_1600_1130_1200');
            w[type].buttons.push('timesheet_avail_1600_2400');


        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  wait
        type = 'workday_wait';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Permanentie';
            w[type].icon = 'fas fa-car-side';
            w[type].color = 'blue';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0600');
            w[type].buttons.push('timesheet_regular_0600_1400_1130_1200');
            w[type].buttons.push('timesheet_avail_1400_2400');


        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  home
        type = 'workday_home';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Thuiswerken';
            w[type].icon = 'fas fa-house';
            w[type].color = 'deep-purple-4';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_avail_0000_0600');
            w[type].buttons.push('timesheet_homework_0600_1430_1130_1200');
            w[type].buttons.push('timesheet_avail_1430_2400');

    }

    // WERKDAGEN VKR
    if(gmc.get('custom_user') == 'VKR')
    {
        // workdays
        // +++++++++++++++++++++++++++++++++++++++++++
        //  standard
        type = 'workday_standard';
            w[type] = {};
            w[type].related = false;
            w[type].name = 'Standaard';
            w[type].icon = 'fas fa-person-biking';
            w[type].color = 'blue';
            w[type].buttons = [];
            w[type].buttons.push('timesheet_regular_0715_1200');

    }

    // WERKDAGEN ELKE/GEEN GEBRUIKER

    // workdays
    // +++++++++++++++++++++++++++++++++++++++++++
    //  available
    type = 'workday_available';
        w[type] = {};
        w[type].related = false;
        w[type].name = 'Bereikbaar & Terugroepbaar';
        w[type].icon = 'fas fa-phone';
        w[type].color = 'grey';
        w[type].buttons = [];
        w[type].buttons.push('timesheet_avail_0000_2400');

    // workdays
    // +++++++++++++++++++++++++++++++++++++++++++
    //  test
    /*
    type = 'test';
        w[type] = {};
        w[type].related = false;
        w[type].name = 'Test';
        w[type].icon = 'fas fa-house';
        w[type].color = 'red';
        w[type].buttons = [];
        w[type].buttons.push('timesheet_avail_0000_0530');
        w[type].buttons.push('timesheet_avail_1530_2400');
    */
}

// ***********************************************
// Edit Timesheet page: calendar
// ***********************************************
function editPageTimesheetCalendar()
{
    //editPageTimesheetDefinitions();
    editPageTimesheetRegistrationButtons();
    editPageTimesheetRegistrationAdd();

    $('h1.page-header button').on('click', function(){
        editPageTimesheetRegistrationButtonsClear();
    });

    // calculate existing and new worked hours (in other weeks)
    // wait till dynamic content is loaded
    waitForKeyElements ('div.fc-timegrid-cols', editPageTimesheetCalendarCalculate);

    // calculate new worked hours (in current week)
    // on change
    var observer = new MutationObserver(function(e) {
        editPageTimesheetRegistrationCalculate();
    });
    observer.observe($('div.fc-timegrid-col-events')[0], {childList : true});// monday
    observer.observe($('div.fc-timegrid-col-events')[2], {childList : true});// tuesday
    observer.observe($('div.fc-timegrid-col-events')[4], {childList : true});// wednesday
    observer.observe($('div.fc-timegrid-col-events')[6], {childList : true});// thursday
    observer.observe($('div.fc-timegrid-col-events')[8], {childList : true});// friday
    observer.observe($('div.fc-timegrid-col-events')[10], {childList : true});// saterday
    observer.observe($('div.fc-timegrid-col-events')[12], {childList : true});// sunday
}
function editPageTimesheetCalendarCalculate()
{
    // content has changed to other week
    // on change
    var observer = new MutationObserver(function(e) {
        // calculate existing worked hours (in other week)
        // wait till dynamic content is loaded
        waitForKeyElements ('span.el_custom_registration_worked_hours:eq(0)', editPageTimesheetRegistrationCalculate);

        // calculate new worked hours (in other week)
        // on change
        var observer_new = new MutationObserver(function(e) {
            editPageTimesheetRegistrationCalculate();
        });
        observer_new.observe($('div.fc-timegrid-col-events')[0], {childList : true});// monday
        observer_new.observe($('div.fc-timegrid-col-events')[2], {childList : true});// tuesday
        observer_new.observe($('div.fc-timegrid-col-events')[4], {childList : true});// wednesday
        observer_new.observe($('div.fc-timegrid-col-events')[6], {childList : true});// thursday
        observer_new.observe($('div.fc-timegrid-col-events')[8], {childList : true});// friday
        observer_new.observe($('div.fc-timegrid-col-events')[10], {childList : true});// saterday
        observer_new.observe($('div.fc-timegrid-col-events')[12], {childList : true});// sunday
    });
    observer.observe($('div.fc-timegrid-cols')[0], {childList: true, subtree: true});
}


// ***********************************************
// Edit Timesheet page: add activity
// ***********************************************
function editPageTimesheetAdd()
{
    if($('div.q-card.large div.q-bar').text().indexOf('prestatie toevoegen') !== -1 || $('div.q-card.large div.q-bar').text().indexOf('prestatie wijzigen') !== -1)
    {
        // --- TEMP ---
        //$('span#divClocking').text('08:08 (in) 16:27 (out) ');

        $('div.q-card.large').addClass('custom_q-card_width');

        //editPageTimesheetDefinitions();
        editPageTimesheetButtons();
        editPageTimesheetActions();
        editPageTimesheetIcons();

        // change width(s)
        if($('div.q-card.large').width() <= '1440' && (Object.keys(w).length - 1) >= 7)
        {
            /*
            var width_timesheet_current = $('div.custom_buttons_timesheet').width();
            var width_timesheet_shorten = (Object.keys(w).length - 1) * 15; // workday_available > hidden
            var width_timesheet_new = width_timesheet_current - width_timesheet_shorten;

            $('button.custom_el_timesheet span.q-btn__content i.q-icon').hide();
            $('button.custom_el_timesheet span.q-btn__content span').css('margin-left','0px');
            $('div.custom_buttons_timesheet').css('width',width_timesheet_new+'px').css('max-width',width_timesheet_new+'px');
            */
            /*
            var width_scroll_current = $('div.custom_buttons_timesheet_scroll').width();
            var width_scroll_shorten = (Object.keys(w).length - 1) * 15; // workday_available > hidden
            var width_scroll_new = width_scroll_current - width_scroll_shorten - 10;

            $('div.custom_buttons_timesheet_scroll').css('width',width_scroll_new+'px').css('max-width',width_scroll_new+'px');
            */
        }

        // on change
        var observer = new MutationObserver(function(e) {
            editPageTimesheetClear();
        });
        observer.observe($('div.modal-body')[0], {attributes : true, attributeFilter : ['style']});
    }
}

// ***********************************************
// Edit Timesheet page: icons clear
// ***********************************************
function editPageTimesheetClear()
{
    if($('div#PrestationPopup').css('opacity') == 1)
    {
        $('i.custom_icon').remove();

        editPageTimesheetIcons();
    }
}


// ***********************************************
// Edit Timesheet page: registration buttons
// ***********************************************
function editPageTimesheetRegistrationButtons()
{
    var columns = '';
    var date = '';
    var style = '';
    var related = '';

    // add extra row with buttons
    columns += '<tr role="row" class="el_custom_registration_buttons">';
    columns += '  <th><div class="fc-timegrid-axis-frame"></div></th>';

    $('div.content div.fc-timegrid table.fc-col-header thead tr th.fc-day').each(function(){
        date = $(this).attr('data-date');
        style = 'q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--round q-btn--dense bg-primary text-white q-btn--actionable q-focusable q-hoverable primary custom_el_registration';

        // new column in extra row per day
        columns += '  <th>';

        $.each(w, function(workday){
            related = w[workday].related ? 'related' : '';

            columns += '    <button data-date="'+date+'" data-workday="'+workday+'" class="'+style+' bg-'+w[workday].color+' '+related+'" tabindex="0" type="button" title="'+w[workday].name+' toevoegen" style="font-size: 6px;">';
            columns += '      <span class="q-focus-helper" tabindex="-1"></span>';
            columns += '      <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon '+w[workday].icon+'" aria-hidden="true" role="presentation" style="font-size: 8px;"> </i><span style="display: none;">Toevoegen</span></span>'
            columns += '    </button>';
        });

        columns += '  </th>';

        // add field for worked hours (filled elsewhere)
        $(this).find('div.fc-scrollgrid-sync-inner').css('position','relative').append(' &nbsp; <span class="el_custom_registration_worked_hours"></span>');
    });

    columns += '</tr>';

    $('div.content div.fc-timegrid table.fc-col-header thead tr').after(columns);
}

// ***********************************************
// Edit Timesheet page: registration buttons clear
// ***********************************************
function editPageTimesheetRegistrationButtonsClear()
{
    $('.el_custom_registration_buttons').remove();

    var observer = new MutationObserver(function(e) {
        editPageTimesheetRegistrationButtons();
        editPageTimesheetRegistrationAdd();

        observer.disconnect();
    });
    observer.observe($('table.fc-col-header thead tr')[0], {childList: true});
}

// ***********************************************
// Edit Timesheet page: registration calculate
// ***********************************************
function editPageTimesheetRegistrationCalculate()
{
    var header_date_full;
    var header_date_extra;
    var header_date_extra_text;

    var column;
    var column_time;
    var column_date;
    var column_pauze;

    var event;
    var event_time;
    var event_title;

    var event_time_array;
    var event_time_minutes;
    var column_time_total;
    var column_time_hours;
    var column_time_minutes;

    $('div.content div.fc-timegrid div.fc-timegrid-col-events').each(function(){
        column = $(this);

        column_date = column.parents('td.fc-day').attr('data-date');

        if(column.html() !== '')
        {
            column_time = '';
            column_pauze = '';
            column_time_total = 0;

            column.find('div.fc-event-main-frame').each(function(){
                event = $(this);

                event_time = event.find('div.fc-event-time').text();
                event_title = event.find('div.fc-event-title').text();

                if(event_title.indexOf('Bereikbaar en terugroepbaar') == -1 && event_title.indexOf('Vakantieverlof') == -1 && event_title.indexOf('Rust') == -1 && event_title.indexOf('Omstandigheidsverlof') == -1)
                {
                    event_time_array = event_time.split(' - ');

                    if(event_time_array[1] == '0:00')
                    {
                        event_time_array[1] = '24:00';
                    }

                    event_time_minutes = (new Date("1970-1-1 "+event_time_array[1])-new Date("1970-1-1 "+event_time_array[0]))/1000/60;

                    column_time_total += event_time_minutes;
                }
            });

            if(column_time_total >= 6*60)
            {
                column_time_total -= 30;
                column_pauze = 'P';
            }

            column_time_hours = Math.floor(column_time_total/60)
            column_time_minutes = column_time_total%60;

            if($.isNumeric(column_time_hours) && $.isNumeric(column_time_minutes) && !(column_time_hours == 0 && column_time_minutes == 0))
            {
                column_time = column_time_hours+':'+(column_time_minutes<10?'0'+column_time_minutes:column_time_minutes)+'<sup>'+column_pauze+'</sup>';
            }

            // add worked hours
            $('div.fc-timegrid thead th.fc-day[data-date="'+column_date+'"] span.el_custom_registration_worked_hours').html(column_time);
        }


        // change day header
        header_date_full = $('div.fc-timegrid thead th.fc-day[data-date="'+column_date+'"] div.fc-scrollgrid-sync-inner a.fc-col-header-cell-cushion').attr('aria-label');
        header_date_extra = $('div.fc-timegrid thead th.fc-day[data-date="'+column_date+'"] div.fc-scrollgrid-sync-inner span.hideGSM');
        header_date_extra.addClass('el_custom_header_date_extra');
        header_date_extra_text = header_date_extra.text();

        // change short date to full date
        if($('div.fc-timegrid thead th.fc-day[data-date="'+column_date+'"] div.fc-scrollgrid-sync-inner').width() > 200)
        {
            $('div.fc-timegrid thead th.fc-day[data-date="'+column_date+'"] div.fc-scrollgrid-sync-inner a[href="#"]').text(header_date_full);
        }
        $('div.fc-timegrid thead th.fc-day[data-date="'+column_date+'"] div.fc-scrollgrid-sync-inner a[href="#"]').attr('title', 'Toon dagoverzicht');

        // change position of extra date info
        $('div.fc-timegrid thead th.fc-day[data-date="'+column_date+'"] div.fc-scrollgrid-sync-inner button').after(header_date_extra);

        // remove () from extra date info
        if(header_date_extra_text.length > 0 && header_date_extra_text.substring(0, 1) == '(')
        {
            header_date_extra.text(header_date_extra_text.substring(1, header_date_extra_text.length - 1));
        }
    });
}


// ***********************************************
// Edit Timesheet page: add registration
// ***********************************************
function editPageTimesheetRegistrationAdd()
{
    $('.custom_el_registration').on('click', async function(){
        p.workday = $(this).attr('data-workday');
        p.date = $(this).attr('data-date');

        for (const button of w[p.workday].buttons) {
            p.button = button;

            await initFunctions()
                .then(editPageTimesheetRegistrationAddProcessStart)
                .then(editPageTimesheetRegistrationAddProcessAction)
                .then(editPageTimesheetRegistrationAddProcessEnd)
        }
    });
}
function editPageTimesheetRegistrationAddProcessStart()
{
    var deferred = $.Deferred();

    // click the "+" button after 500ms
    setTimeout(function(){
        $('div.content div.fc-timegrid table.fc-col-header thead tr th.fc-day[data-date="'+p.date+'"] button').click();

        // wait for form to appear
        //  on change of body style-attribute
        var observer = new MutationObserver(function(e) {
            deferred.resolve();
            observer.disconnect();
        });
        observer.observe($('body')[0], {attributes : true, attributeFilter : ['style']});

    }, 500);

    return deferred;
}
function editPageTimesheetRegistrationAddProcessAction()
{
    var deferred = $.Deferred();

    // click the "Action" button after 500 ms
    setTimeout(function(){

        // scroll day into view
        $('div#timesheet_day_'+p.workday)[0].scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "end" // or "end"
        });

        // change color on icon
        var icon = $('button#timesheet_icon_'+p.workday);
        icon.removeClass('bg-'+icon.attr('data-bg')).addClass('bg-green');

        $('div.q-card.large button#'+p.button+'_'+p.workday).click();

        // wait for actions to complete
        var observer = new MutationObserver(function(e) {
            if($('div.q-card.large button#'+p.button+'_'+p.workday).attr('data-action') == 'end')
            {
                deferred.resolve();
                observer.disconnect();
            }
        });
        observer.observe($('div.q-card.large button#'+p.button+'_'+p.workday)[0], {attributes : true, attributeFilter : ['data-action']});

    }, 500);

    return deferred;
}
function editPageTimesheetRegistrationAddProcessEnd()
{
    var deferred = $.Deferred();

    // click the "Toepassen" button after 1000 ms
    setTimeout(function(){

        $('div.q-card.large button[title="Toepassen"]').click();

        // wait for form to disappear
        //  on change of body style-attribute
        var observer = new MutationObserver(function(e) {
            deferred.resolve();
            observer.disconnect();
        });
        observer.observe($('body')[0], {attributes : true, attributeFilter : ['style']});

    }, 1000);

    return deferred;
}


// ***********************************************
// Edit Timesheet page: buttons
// ***********************************************
function editPageTimesheetButtons()
{
    var buttons = '';
    var related = '';
    var hidden = '';
    var style = '';

    buttons += '<div class="custom_buttons_timesheet">';


    // global buttons
    buttons += '<div class="custom_buttons_timesheet_overview">';


    style = 'q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--round q-btn--dense bg-primary text-white text-center primary custom_el_registration';

    buttons += '    <button class="'+style+' bg-blue" tabindex="0" type="button" title="Basics" style="font-size: 8px;">';
    buttons += '      <span class="q-focus-helper" tabindex="-1"></span>';
    buttons += '      <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon fas fa-star" aria-hidden="true" role="presentation" style="font-size: 10px;"></i></span>'
    buttons += '    </button><br>';


    // button: ICT-ondersteuning (regulier)
    buttons += editPageTimesheetButton('activity_ict_regular');
    if(gmc.get('custom_activity_bike') == true)
    {
        // button: ICT-ondersteuning (regulier met fietsvergoeding)
        buttons += editPageTimesheetButton('activity_ict_regular_bike');
    }
    if(gmc.get('custom_activity_clock') == true)
    {
        // button: ICT-ondersteuning (regulier op basis van prikklok)
        buttons += editPageTimesheetButton('activity_ict_regular_clock');
    }
    if(gmc.get('custom_activity_clock') == true && gmc.get('custom_activity_bike') == true)
    {
        // button: ICT-ondersteuning (regulier rekening houdend met prikklok met fietsvergoeding)
        buttons += editPageTimesheetButton('activity_ict_regular_clock_bike');
    }

    // button: ICT-ondersteuning (thuiswerk)
    buttons += editPageTimesheetButton('activity_ict_homework');
    if(gmc.get('custom_activity_train') == true)
    {
        // button: ICT-ondersteuning (treinwerk)
        buttons += editPageTimesheetButton('activity_ict_trainwork');
    }
    buttons += '<br><br>';

    // button: Bereikbaar en terugroepbaar
    buttons += editPageTimesheetButton('activity_available');
    if(gmc.get('custom_activity_clock') == true)
    {
        // button: Bereikbaar en terugroepbaar (op basis van prikklok)
        buttons += editPageTimesheetButton('activity_available_clock');
    }
    // button: Wachtoproep: ICT-ondersteuning (regulier) + vergoedingsuren
    buttons += editPageTimesheetButton('waitcall_regular');
    // button: Wachtoproep: ICT-ondersteuning (thuiswerk) + vergoedingsuren
    buttons += editPageTimesheetButton('waitcall_homework');
    // button: Mobilisatie: ICT-ondersteuning (regulier) + vergoedingsuren
    buttons += editPageTimesheetButton('compensation_mobilisation');
    // button: Vergoeding: ICT-ondersteuning (regulier) + vergoedingsuren
    buttons += editPageTimesheetButton('compensation_other');
    buttons += '<br><br>';

    // button: Vergoedingsuren: geen
    //buttons += editPageTimesheetButton('comments_compensation_none');
    // button: Vergoedingsuren: wel (wachtoproep)
    //buttons += editPageTimesheetButton('comments_compensation_yes_waitcall');
    // button: Vergoedingsuren: wel (andere)
    //buttons += editPageTimesheetButton('comments_compensation_yes_other');

    /*
    // button: TEST
    buttons += '<span class="custom_el_activity-spacing"><br></span>';

    // button: Periode: 15:30-16:15
    buttons += editPageTimesheetButton('custom_el_times_test');
    buttons += '<br>';
    */

    buttons += '</div>';


    // workdays buttons
    buttons += '<div class="custom_buttons_timesheet_scroll"><div class="custom_buttons_timesheet_days">';


    // button for each defined workday
    $.each(w, function(workday){
        related = w[workday].related ? 'related' : '';
        hidden = workday.indexOf('workday_available') !== -1 ? 'hidden' : '';

        buttons += '<div id="timesheet_day_'+workday+'" class="custom_buttons_timesheet_day '+related+' '+hidden+'">';

        buttons += '    <button id="timesheet_icon_'+workday+'" class="'+style+' bg-'+w[workday].color+' '+related+'" tabindex="0" type="button" title="'+w[workday].name+'" data-bg="'+w[workday].color+'" style="font-size: 6px;">';
        buttons += '      <span class="q-focus-helper" tabindex="-1"></span>';
        buttons += '      <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon '+w[workday].icon+'" aria-hidden="true" role="presentation" style="font-size: 10px;"></i></span>'
        buttons += '    </button><br>';

        $.each(w[workday].buttons, function(i, b){
            buttons += editPageTimesheetButton(b, workday);
        });

        buttons += '</div>';
    });

    buttons += '</div></div>';

    buttons += '</div>';


    // add buttons to form
    $('div.q-card.large div.modal-body').after(buttons);
}

// ***********************************************
// Edit Timesheet page: button
// ***********************************************
function editPageTimesheetButton(id, workday)
{
    workday = typeof workday !== 'undefined' ? workday : 'global';

    var button = '';
    var icon = '';
    var icon_extra = '';
    var text = '';
    var full = '';
    var color = '';
    var type = '';
    var disabled = '';

    if(d[id] !== undefined)
    {
        icon = d[id].button_icon !== undefined ? d[id].button_icon : '<i class="q-icon fas fa-x"></i>';
        icon_extra = d[id].button_icon_extra !== undefined ? d[id].button_icon_extra : '';
        text = d[id].button_text !== undefined ? d[id].button_text : '['+id+']';
        full = d[id].button_full !== undefined ? d[id].button_full : '';
        color = d[id].button_color !== undefined ? d[id].button_color : '';

        type = d[id].type !== undefined ? 'custom_el_' + d[id].type : '';

        if(id.indexOf('_clock') !== -1 && (!$('span#divClocking').length || $('span#divClocking').text() == ''))
        {
            disabled = 'disabled';
        }
    }
    else
    {
        icon = '<i class="q-icon fas fa-question"></i>';
        icon_extra = '';
        text = '['+id+']';
        full = '';
        color = 'bg-white text-black';
    }

    text = icon + '<span>' + text + '</span>' + icon_extra;

    button += '<button id="'+id+'_'+workday+'" data-type="'+id+'" data-workday="'+workday+'" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-primary text-white q-btn--actionable q-focusable q-hoverable primary '+type+' '+color+' '+disabled+'" title="'+full+'">';
    button += '<span class="q-focus-helper" tabindex="-1"></span>';
    button += '<span class="q-btn__content text-left col items-center q-anchor--skip justify-left row">';

    button += text;

    button += '</span>';
    button += '</button>';

    return button;
}


// ***********************************************
// Edit Timesheet page: button
// ***********************************************
function editPageTimesheetIcons()
{
    fillPageTimesheetSetIcon('activity');
    fillPageTimesheetSetIcon('subdivision');
    fillPageTimesheetSetIcon('times');
    fillPageTimesheetSetIcon('duration');
    fillPageTimesheetSetIcon('telework');
    fillPageTimesheetSetIcon('compensations');
    fillPageTimesheetSetIcon('recall');
    fillPageTimesheetSetIcon('comments');
    fillPageTimesheetSetIcon('standardreference');
    fillPageTimesheetSetIcon('freereference');
}

// ***********************************************
// initFunctions
// ***********************************************
function initFunctions()
{
    var deferred = $.Deferred();

    deferred.resolve();
    return deferred;
}


// ***********************************************
// Edit Timesheet page: button start action
// ***********************************************
function editPageTimesheetActionStart()
{
    var deferred = $.Deferred();
    var button = $('button[data-action="start"]');

    button.removeClass (function (index, className) {
        return (className.match (/(^|\s)bg-\S+/g) || []).join(' ');
    });
    button.addClass('bg-white');

    var el_overlay = '';
    var el_overlay_width = $('div.q-card.large div.modal-body').parent().css('width');
    var el_overlay_height = $('div.q-card.large div.modal-body').parent().css('height');

    $('div.q-card.large div.modal-body').parent().append('<div class="custom_el_overlay"></div>');
    $('div.q-card.large div.custom_el_overlay').css('width', el_overlay_width).css('height', el_overlay_height);

    deferred.resolve();
    return deferred;
}

// ***********************************************
// Edit Timesheet page: button end action
// ***********************************************
function editPageTimesheetActionEnd()
{
    var deferred = $.Deferred();
    var button = $('button[data-action="start"]');

    button.removeClass('bg-white').addClass('bg-green');
    button.attr('data-action','end');
    button.find('i.q-icon:first').attr('class','q-icon far fa-circle-check');

    $('div.q-card.large div.custom_el_overlay').remove();

    $('div.q-card.large button[title="Toepassen"]').addClass('bg-green');

    $('div.q-card.large div.q-bar').addClass('bg-green');
    $('div.q-card.large div.q-bar button.q-btn').css('border-color','#666');
    $('div.q-card.large div.q-bar button.q-btn span.q-btn__content').css('color','#666');


    deferred.resolve();
    return deferred;
}

// ***********************************************
// Edit Timesheet page: actions
// ***********************************************
function editPageTimesheetActions()
{
    var type;

    // activity
    // +++++++++++++++++++++++++++++++++++++++++++
    //  regular, regular_clock, regular_bike, homework, train, available
    $('.custom_el_activity').on('click', function(){
        type = $(this).attr('data-type');

        if(d[type] !== undefined)
        {
            if(d[type].times_type !== undefined && d[type].times_type == 'clocked' && $('span#divClocking').length && $('span#divClocking').text() != '')
            {
                //INOUT
                var clocked = fillPageTimesheetTimesProcessClocked($('span#divClocking').text());

                var work_start = '';
                var work_end = '';
                var pauze_start = '';
                var pauze_end = '';

                if(Object.keys(clocked).length == 2)
                {
                    if(type.indexOf('activity_available') !== -1)
                    {
                        work_start = '00:00';
                        work_end = clocked.in;
                    }
                    else
                    {
                        work_start = clocked.in;
                        work_end = clocked.out;
                        pauze_start = '12:00';
                        pauze_end = '12:30';
                    }
                }

                $(this).attr('data-action','start');

                p.activity_type = d[type].activity_type;
                p.times_work_start = work_start;
                p.times_work_end = work_end;
                p.times_pauze_start = pauze_start;
                p.times_pauze_end = pauze_end;
                p.compensation_type = d[type].compensation_type;
                p.flexwork_type = d[type].flexwork_type;

                initFunctions()
                    .then(editPageTimesheetActionStart)
                    .then(fillPageTimesheetActivity)
                    .then(fillPageTimesheetTimes)
                    .then(fillPageTimesheetCompensations)
                    .then(fillPageTimesheetFlexwork)
                    .then(editPageTimesheetActionEnd)
                ;
            }
            else
            {
                $(this).attr('data-action','start');

                p.activity_type = d[type].activity_type;
                p.compensation_type = d[type].compensation_type;
                p.flexwork_type = d[type].flexwork_type;

                initFunctions()
                    .then(editPageTimesheetActionStart)
                    .then(fillPageTimesheetActivity)
                    .then(fillPageTimesheetCompensations)
                    .then(fillPageTimesheetFlexwork)
                    .then(editPageTimesheetActionEnd)
                ;
            }
        }
    });

    // waitcall
    // +++++++++++++++++++++++++++++++++++++++++++
    //  regular, homework
    $('.custom_el_waitcall').on('click', function(){
        type = $(this).attr('data-type');

        if(d[type] !== undefined)
        {
            $(this).attr('data-action','start');

            p.activity_type = d[type].activity_type;
            p.flexwork_type = d[type].flexwork_type;
            p.freereference_type = d[type].freereference_type;

            initFunctions()
                .then(editPageTimesheetActionStart)
                .then(fillPageTimesheetActivity)
                .then(fillPageTimesheetFlexwork)
                .then(fillPageTimesheetRecall)
                .then(fillPageTimesheetStandardReference)
                .then(fillPageTimesheetFreeReference)
                .then(editPageTimesheetActionEnd)
            ;
        }
    });

    // compensation
    // +++++++++++++++++++++++++++++++++++++++++++
    //  mobilisation, other
    $('.custom_el_compensation').on('click', function(){
        type = $(this).attr('data-type');

        if(d[type] !== undefined)
        {
            $(this).attr('data-action','start');

            p.activity_type = d[type].activity_type;
            p.flexwork_type = d[type].flexwork_type;
            p.freereference_type = d[type].freereference_type;

            initFunctions()
                .then(editPageTimesheetActionStart)
                .then(fillPageTimesheetActivity)
                .then(fillPageTimesheetFlexwork)
                .then(fillPageTimesheetFreeReference)
                .then(editPageTimesheetActionEnd)
            ;
        }
    });

    // comments
    // +++++++++++++++++++++++++++++++++++++++++++
    //  compensation: none, compensation: waitcall, compensation: other
    $('.custom_el_comments').on('click', function(){
        type = $(this).attr('data-type');

        if(d[type] !== undefined)
        {
            $(this).attr('data-action','start');

            p.comments_type = d[type].comments_type;

            initFunctions()
                .then(editPageTimesheetActionStart)
                .then(fillPageTimesheetComments)
                .then(editPageTimesheetActionEnd)
            ;
        }
    });

    // free reference
    // +++++++++++++++++++++++++++++++++++++++++++
    //  compensation: none, compensation: waitcall, compensation: other
    $('.custom_el_freereference').on('click', function(){
        type = $(this).attr('data-type');

        if(d[type] !== undefined)
        {
            $(this).attr('data-action','start');

            p.freereference_type = d[type].freereference_type;

            initFunctions()
                .then(editPageTimesheetActionStart)
                .then(fillPageTimesheetFreeReference)
                .then(editPageTimesheetActionEnd)
            ;
        }
    });

    // timesheet
    // +++++++++++++++++++++++++++++++++++++++++++
    $('.custom_el_timesheet').on('click', function(){
        type = $(this).attr('data-type');

        if(d[type] !== undefined)
        {
            $(this).attr('data-action','start');

            var clocked_error = false;

            if(type.indexOf('_clock') !== -1)
            {

                if($('span#divClocking').length && $('span#divClocking').text() != '')
                {
                    var clocked = fillPageTimesheetTimesProcessClocked($('span#divClocking').text());

                    if(Object.keys(clocked).length == 2)
                    {
                        if(d[type].times_work_start == 'IN')
                        {
                            d[type].times_work_start = clocked.in;
                        }
                        if(d[type].times_work_start == 'OUT')
                        {
                            d[type].times_work_start = clocked.out;
                        }
                        if(d[type].times_work_end == 'IN')
                        {
                            d[type].times_work_end = clocked.in;
                        }
                        if(d[type].times_work_end == 'OUT')
                        {
                            d[type].times_work_end = clocked.out;
                        }
                    }
                    else
                    {
                        clocked_error = true;
                    }
                }
                else
                {
                    clocked_error = true;
                }
            }

            if(!clocked_error)
            {
                p.activity_type = d[type].activity_type;
                p.times_work_start = d[type].times_work_start;
                p.times_work_end = d[type].times_work_end;
                p.times_pauze_start = d[type].times_pauze_start;
                p.times_pauze_end = d[type].times_pauze_end;
                p.compensation_type = d[type].compensation_type;
                p.flexwork_type = d[type].flexwork_type;
                p.freereference_type = d[type].freereference_type;

                initFunctions()
                    .then(editPageTimesheetActionStart)
                    .then(fillPageTimesheetActivity)
                    .then(fillPageTimesheetTimes)
                    .then(fillPageTimesheetCompensations)
                    .then(fillPageTimesheetFlexwork)
                    .then(fillPageTimesheetFreeReference)
                    .then(editPageTimesheetActionEnd)
                ;
            }
            else
            {
                // show error
                var el_clocked_error = '';

                el_clocked_error += '<div class="mt-2">';

                el_clocked_error += '  <div data-v-4f2b16c8 class="q-item q-item-type row no-wrap note note-danger" role="listitem">';
                el_clocked_error += '    <div data-v-4f2b16c8 class="q-item__section column q-item__section--side justify-center q-item__section--avatar">';
                el_clocked_error += '      <i data-v-4f2b16c8="" class="q-icon fa-solid fa-triangle-exclamation" aria-hidden="true" role="presentation"> </i>';
                el_clocked_error += '    </div>';
                el_clocked_error += '    <div data-v-4f2b16c8 class="q-item__section column q-item__section--main justify-center note-content">';
                el_clocked_error += '      <span>Geen prikklok gegevens beschikbaar</span>';
                el_clocked_error += '    </div>';
                el_clocked_error += '  </div>';

                el_clocked_error += '</div>';

                $('div#buttons').after(el_clocked_error);
            }
        }
    });
}


// ***********************************************
// Fill Timesheet page: activity
// ***********************************************
function fillPageTimesheetActivity(type)
{
    type = typeof type !== 'undefined' ? type : p.activity_type;

    var deferred = $.Deferred();
    var input_field = $('div#fkActivity_parent input.q-field__input');
    var input_field_dropdown = $('div#fkActivity_parent i.q-select__dropdown-icon');
    var input_field_id = input_field.attr('id');

    var list_id = input_field_id+'_lb';
    var option_id = '';

    var position = 0;
    var scroll = 500;
    var timeout = 0;

    var label_type = {};
    var label_found = false;

    label_type['ict'] = "ICT-ondersteuning";
    label_type['ict_vg'] = "ICT-ondersteuning met vergoeding";
    label_type['available'] = "Bereikbaar en terugroepbaar (209)";
    //label_type['available'] = "Niet bestaande activiteit";
    //label_type['available'] = "werking zorghond";


    input_field.focus();
    input_field_dropdown.click();


    setTimeout(function(){

        // found without scrolling?
        if($('div#'+list_id+' div.q-virtual-scroll__content div.q-item__label').filter(function(){return $(this).text() === label_type[type];}).length != 0)
        {
            label_found = true;
        }
        else
        {
            // start scrolling
            while($('div#'+list_id+' div.q-virtual-scroll__content div.q-item__label').filter(function(){return $(this).text() === label_type[type];}).length == 0 && !label_found && timeout <= 20)
            {
                timeout++;

                setTimeout(function(){

                    if($('div#'+list_id+' div.q-virtual-scroll__content div.q-item__label').filter(function(){return $(this).text() === label_type[type];}).length == 0 && !label_found)
                    {
                        position += scroll;

                        $('div#'+list_id).scrollTop(position);
                    }
                    else
                    {
                        label_found = true;
                    }
                }, 50 * timeout);

            }
        }

    }, 100);

    setTimeout(function(){

        if(!label_found)
        {
            // error message
            $('div#TRActivity label').click();
            $('div#TRActivity').append('<div class="q-pa-md q-gutter-sm col doc-example__content doc-example-typography"><div class="q-banner row items-center q-banner--dense q-banner--dark rounded-borders q-dark text-white bg-orange" role="alert"><div class="q-banner__avatar col-auto row items-center self-start"></div><div class="q-banner__content col text-body2">Activiteit "'+label_type[type]+'" niet gevonden</div><div class="q-banner__actions row items-center justify-end col-auto">Contacteer SM</div></div></div>');
        }
        else
        {
            // get id
            option_id = $('div#'+list_id+' div.q-virtual-scroll__content div.q-item__label').filter(function(){return $(this).text() === label_type[type];}).parents('div.q-item').attr('id');

            // select correct activity
            $('div#'+option_id+' div.q-item__label').click();

            fillPageTimesheetSetIcon('activity', false);

            input_field.blur();
        }

        deferred.resolve();
    }, 1000);

    return deferred;
}

// ***********************************************
// Fill Timesheet page: times
// ***********************************************
function fillPageTimesheetTimes(work_start, work_end, pauze_start, pauze_end)
{
    work_start = typeof work_start !== 'undefined' ? work_start : p.times_work_start;
    work_end = typeof work_end !== 'undefined' ? work_end : p.times_work_end;
    pauze_start = typeof pauze_start !== 'undefined' ? pauze_start : p.times_pauze_start;
    pauze_end = typeof pauze_end !== 'undefined' ? pauze_end : p.times_pauze_end;

    var deferred = $.Deferred();
    var times_work_start = fillPageTimesheetTimesTime(work_start);
    var times_work_end = fillPageTimesheetTimesTime(work_end);
    var times_pauze_start = fillPageTimesheetTimesTime(pauze_start);
    var times_pauze_end = fillPageTimesheetTimesTime(pauze_end);
    var elements = {};
    var el;

    elements['JobBeginHour'] = [times_work_start[0]];
    elements['JobBeginMinute'] = [times_work_start[1]];
    elements['JobEndHour'] = [times_work_end[0]];
    elements['JobEndMinute'] = [times_work_end[1]];

    elements['BreakBeginHour'] = [times_pauze_start[0]];
    elements['BreakBeginMinute'] = [times_pauze_start[1]];
    elements['BreakEndHour'] = [times_pauze_end[0]];
    elements['BreakEndMinute'] = [times_pauze_end[1]];

    var el_count_index = 0;
    var el_count_total = Object.keys(elements).length;
    var timeout = 0;

    $.each(elements, function(element, number){

        timeout++;
        setTimeout(function(){
            // select input
            $('input[name="'+element+'"]').parents('label').trigger('click');

            // set value
            document.execCommand('insertText', false, number);

            // simulate keyboard enter
            el = document.querySelector('input[name="'+element+'"]');
            el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
            el.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
            el.dispatchEvent(new InputEvent('input', { bubbles: true }));

            el_count_index++;
            if(el_count_index == el_count_total)
            {
                fillPageTimesheetSetIcon('times', false);
                fillPageTimesheetSetIcon('duration', false);

                deferred.resolve();
            }
        }, 100 * timeout);

    });

    return deferred;
}
// ***********************************************
// Fill Timesheet page: times - time
// ***********************************************
function fillPageTimesheetTimesTime(time)
{
    var times = [];

    times[0] = '';
    times[1] = '';

    if(time.length > 0 && time.length == 5)
    {
        times = time.split(':');
    }

    return times;
}
// ***********************************************
// Fill Timesheet page: times - round to quarter
// ***********************************************
function fillPageTimesheetTimesRoundToQuarter(time)
{
    var time_array;

    var time_h;
    var time_h_rounded;
    var time_m;
    var time_m_rounded;

    time_array = fillPageTimesheetTimesTime(time);

    time_h = parseInt(time_array[0]);
    time_m = parseInt(time_array[1]);

    // round to quarter
    time_h_rounded = time_m > 52 ? (time_h === 23 ? 0 : ++time_h) : time_h;
    time_m_rounded = (Math.round(time_m/15) * 15) % 60;

    // leading zero
    time_h_rounded = time_h_rounded < 10 ? '0'+parseInt(time_h_rounded) : time_h_rounded;
    time_m_rounded = time_m_rounded < 10 ? '0'+parseInt(time_m_rounded) : time_m_rounded;

    return time_h_rounded+':'+time_m_rounded;
}
// ***********************************************
// Fill Timesheet page: times - get clocked times
// ***********************************************
function fillPageTimesheetTimesProcessClocked(clocked)
{
    // split IN and OUT parts
    var clocked_array = clocked.split(' (in) ');

    var work = {};
    var work_in;
    var work_out;

    work.in = '';
    work.out = '';

    if(clocked_array.length == 2 && clocked_array[0].substring(2, 3) == ':' && clocked_array[1].substring(2, 3) == ':')
    {
        work_in = clocked_array[0].substring(0, 5);
        work_in = fillPageTimesheetTimesRoundToQuarter(work_in);

        work_out = clocked_array[1].substring(0, 5);
        work_out = fillPageTimesheetTimesRoundToQuarter(work_out);

        work.in = work_in;
        work.out = work_out;
    }

    return work;
}

// ***********************************************
// Fill Timesheet page: compensations
// ***********************************************
function fillPageTimesheetCompensations(type)
{
    type = typeof type !== 'undefined' ? type : p.compensation_type;

    var deferred = $.Deferred();

    switch(type)
    {
        case 'bike':
            $('div#TRCompensations div[aria-label="Fietsvergoeding (woon-werkverkeer)"]').click();
            break;
    }

    fillPageTimesheetSetIcon('compensations', false);

    deferred.resolve();

    return deferred;
}

// ***********************************************
// Fill Timesheet page: flexwork
// ***********************************************
function fillPageTimesheetFlexwork(type)
{
    type = typeof type !== 'undefined' ? type : p.flexwork_type;

    var deferred = $.Deferred();
    var private = false;

    switch(type)
    {
        case 'none':
            $('div#TRTelework div[aria-label="Nee"]').click();
            break;

        case 'home':
            $('div#TRTelework div[aria-label="Telewerk"]').click();
            break;

        case 'train':
            $('div#TRTelework div[aria-label="Nee"]').click();
            break;
    }

    fillPageTimesheetSetIcon('telework', false);

    switch(type)
    {
        case 'home':
        case 'train':
            private = true;
            break;
    }

    if(private)
    {
        // add operation
        $('button[name="btnAddOperation"').click();

        setTimeout(function(){
            fillPageTimesheetSetIcon('operations');

            // plaatsonafhankelijk werken op een privélocatie
            var input_field = $('div#operationnonfgp0_parent input.q-field__input');
            var input_field_dropdown = $('div#operationnonfgp0_parent i.q-select__dropdown-icon');
            var input_field_id = input_field.attr('id');
            var option = input_field_id+'_0';

            input_field.focus();

            setTimeout(function(){
                // open operations list
                input_field_dropdown.click();

                setTimeout(function(){
                    // select correct operation
                    $('div#'+option+' div.q-item__label').click();

                    fillPageTimesheetSetIcon('operations', false);

                    input_field.blur();
                    deferred.resolve();
                }, 100);
            }, 100);
        }, 1500); //250
    }
    else
    {
        deferred.resolve();
    }

    return deferred;
}

// ***********************************************
// Fill Timesheet page: recall
// ***********************************************
function fillPageTimesheetRecall()
{
    var deferred = $.Deferred();

    $('div#TRRecall div#fRecall').click();

    fillPageTimesheetSetIcon('recall', false);

    deferred.resolve();

    return deferred;
}

// ***********************************************
// Fill Timesheet page: comments
// ***********************************************
function fillPageTimesheetComments(type)
{
    type = typeof type !== 'undefined' ? type : p.comments_type;

    var deferred = $.Deferred();
    var text = '';

    switch(type)
    {
        case 'compensation-none':
            text = 'Geen vergoedingsuren';
            break;

        case 'compensation-yes-waitcall':
            text = 'Wachtoproep: GLPI';
            break;

        case 'compensation-yes-mobilisation':
            text = 'Mobilisatie: OD?';
            break;

        case 'compensation-yes-other':
            text = 'REDEN?';
            break;
    }

    // select textarea
    $('textarea[name="IndividualRemark"').parents('label').trigger('click');

    // set value
    document.execCommand('selectall');
    document.execCommand('delete');
    document.execCommand('insertText', false, text);

    fillPageTimesheetSetIcon('comments', false);

    deferred.resolve();

    return deferred;
}

// ***********************************************
// Fill Timesheet page: standard reference
// ***********************************************
function fillPageTimesheetStandardReference()
{
    var deferred = $.Deferred();
    var input_field = $('div#fkStandardReference_parent input.q-field__input');
    var input_field_dropdown = $('div#fkStandardReference_parent i.q-select__dropdown-icon');
    var input_field_id = input_field.attr('id');

    var list_id = input_field_id+'_lb';
    var option_id = '';

    input_field.focus();
    input_field_dropdown.click();

    setTimeout(function(){
        // auto scroll to bottom in element
        $('div#'+list_id).scrollTop(10000);

        setTimeout(function(){

            // teruggeroepen bij 'bereikbaarheid en terugroepbaarheid'
            option_id = $('div#'+list_id+' div.q-virtual-scroll__content div.q-item__label:contains("bereikbaarheid en terugroepbaarheid")').parents('div.q-item').attr('id');

            // select correct reference
            $('div#'+option_id+' div.q-item__label').click();

            fillPageTimesheetSetIcon('standardreference', false);

            input_field.blur();
            deferred.resolve();
        }, 200);
    }, 100);

    return deferred;
}

// ***********************************************
// Fill Timesheet page: freereference
// ***********************************************
function fillPageTimesheetFreeReference(type)
{
    type = typeof type !== 'undefined' ? type : p.freereference_type;

    var deferred = $.Deferred();
    var text = '';

    switch(type)
    {
        case 'compensation-none':
            text = 'Geen vergoedingsuren';
            break;

        case 'compensation-yes-waitcall':
            text = 'Wachtoproep: GLPI';
            break;

        case 'compensation-yes-mobilisation':
            text = 'Mobilisatie: OD?';
            break;

        case 'compensation-yes-other':
            text = 'REDEN?';
            break;
    }

    // select input
    $('label[for="freeReference"]').closest('div.row').find('input').closest('label').trigger('click');

    // set value
    document.execCommand('selectall');
    document.execCommand('delete');
    document.execCommand('insertText', false, text);

    fillPageTimesheetSetIcon('freereference', false);

    deferred.resolve();

    return deferred;
}

// ***********************************************
// Fill Timesheet page: set icon
// ***********************************************
function fillPageTimesheetSetIcon(section, start = true)
{
    var icon_id = '';
    var icon_type = '';
    var icon_html = '';
    var label_el;

    switch(section)
    {
        case 'activity':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div#TRActivity label:contains("Activiteit")');
            break;

        case 'subdivision':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle';
            label_el = $('div#TRSubdivision label:contains("Subdivisie")');
            break;

        case 'times':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div#TRTimes label:contains("Uurrooster")');
            break;

        case 'duration':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div#TRDuration label:contains("Duur")');
            break;

        case 'telework':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div#TRTelework label:contains("Flexwerk")');
            break;

        case 'compensations':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div#TRCompensations label:contains("Vergoedingen")');
            break;

        case 'recall':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div#TRRecall label:contains("Terugroeping")');
            break;

        case 'comments':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle';
            label_el = $('div#TRComments label:contains("Opmerking")');
            break;

        case 'standardreference':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div label:contains("Standaardreferentie")');
            break;

        case 'freereference':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div label:contains("Vrije referentie")');
            break;

        case 'operations':
            icon_id = 'custom-icon-'+section;
            icon_type = 'far fa-circle-check';
            label_el = $('div label:contains("Operaties")');
            break;
    }

    if(icon_id.length > 0)
    {
        if(start)
        {
            icon_html = '<i class="q-icon text-grey '+icon_type+' custom_icon" id="'+icon_id+'" name="'+icon_id+'"></i>';
            label_el.prepend(icon_html);
        }
        else
        {
            $('#'+icon_id).removeClass('text-grey').addClass('text-green').removeClass('far').addClass('fas');
        }
    }
}