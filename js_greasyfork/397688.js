// ==UserScript==
// @name         WaniKani Review Forecast Clock Style
// @namespace    rwesterhof
// @version      0.2.2
// @description  Allows the use of various clock display styles on the review forecast panel
// @match        https://www.wanikani.com/
// @match        https://preview.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @match        https://preview.wanikani.com/dashboard
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397688/WaniKani%20Review%20Forecast%20Clock%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/397688/WaniKani%20Review%20Forecast%20Clock%20Style.meta.js
// ==/UserScript==

/* global $, wkof */

(function() {
    'use strict';

    if (!window.wkof) {
        let response = confirm('WaniKani Review Forecast Clock Style script requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }

        return;
    }

    wkof.include('Menu,Settings');
    wkof.ready('Menu,Settings').then(load_settings).then(install_menu).then(delayUpdate);

    function delayUpdate() {
        onUpdateSettings();
        // due to the way the review forecast loads, loading this script too fast will not always apply
        // all of the stored settings, so we delay a little a give it a second try
        setTimeout(onUpdateSettings, 1000);
    }

    // display the times in the review forecast in a specific clock style
    function updateClockStyle() {
        var selection= $(`.review-forecast__hour-title`);

        for (var index=0; index < selection.length; index++) {
            // the new review forecast panel no longer has a datetime property that indicates the actual raw time
            // so we need to figure out what the time is based on whatever was displayed. In any format that this script supports
            var displayedContent = selection[index].textContent.split(/[ :]/);
            var hour = Number(displayedContent[0]);
            // for 'h' and '00' there is nothing to correct
            if (displayedContent[1] == 'am') {
                if (hour == 12) {
                    // 12 am is midnight by convention
                    hour = hour - 12;
                }
            }
            if (displayedContent[1] == 'pm') {
                hour = hour + 12;
                if (hour == 24) {
                    // 12 pm is noon by convention
                    hour = hour - 12;
                }
            }
            var suffix;
            var prefix = "";

            switch (wkof.settings.rf_clockstyle.clockstyle) {
                case '1':
                    // original 12-hour clock
                    suffix = ' am';
                    if (hour >= 12) {
                        hour = hour - 12;
                        suffix = " pm";
                    }
                    if (hour == 0) {
                        hour = hour + 12;
                    }
                    break;
                case '2':
                    // 24-hour clock
                    suffix = " h";
                    break;
                case '4':
                    // digital clock with leading 0
                    if (hour < 10) {
                        prefix = "0";
                    }
                    suffix = ":00";
                    break;
                default:
                    // digital clock
                    suffix = ":00";
                    break;
            }

            selection[index].innerHTML= prefix + hour + suffix;
        }
    }

    // limits the number of visible days in the review forecast
    function limitVisibleDays() {

        var viewDays = wkof.settings.rf_clockstyle.nrOfForecastDays;
        if (viewDays < 2) {
            viewDays = 2;
        }
        if (viewDays > 7) {
            viewDays = 7;
        }
        for (var i = 1; i <= 7; i++) {
            if (i <= viewDays) {
                $('.review-forecast .review-forecast__day:nth-child(' + i + ')').removeClass('hidden');
            }
            else {
                $('.review-forecast .review-forecast__day:nth-child(' + i + ')').addClass('hidden');
            }
        }
    }

    function onUpdateSettings() {
        limitVisibleDays();
        updateClockStyle();
    }

    // Load settings and set defaults
    function load_settings() {
        var defaults = {
            clockstyle: '3',
            nrOfForecastDays: 7
        };
        return wkof.Settings.load('rf_clockstyle', defaults);
    }

    // Installs the options button in the menu
    function install_menu() {
        var config = {
            name: 'rf_clockstyle_settings',
            submenu: 'Settings',
            title: 'Review Forecast Clock Style',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    // Create the options
    function open_settings(items) {
        var config = {
            script_id: 'rf_clockstyle',
                title: 'Review Forecast Clock Style',
                on_save: onUpdateSettings,
                content: {
                    clockstyle: {
                        type: 'dropdown',
                        label: 'Clock Style',
                        hover_tip: 'Choose your preferred clock style',
                        default: '3',
                        content: {
                            1: '12-hour clock (9 pm)',
                            2: '24-hour clock (21 h)',
                            3: '24-hour digital (21:00)',
                            4: '24-hour digital with leading 0 (05:00)'
                        }
                    },
                    nrOfForecastDays: {
                        type: 'number',
                        label: 'Number of days to display',
			            hover_tip: 'Limit the review forecast to anywhere from 2 - 7 days',
			            default: 7,
                        min: 2,
                        max: 7
			        }
                }
        }
        var dialog = new wkof.Settings(config);
        dialog.open();
    }

})();