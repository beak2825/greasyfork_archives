// ==UserScript==
// @name         PYS++
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Display green cards for valid TACE
// @author       Matthieu Auger
// @match        https://app.pickyourskills.com/reporting/staffing_dashboard?view=user
// @match        https://app.pickyourskills.com/reporting/staffing_dashboard?view=user&tribe=lyon
// @match        https://app.pickyourskills.com/reporting/staffing_dashboard?view=user&tribe=kumo
// @icon         https://www.google.com/s2/favicons?domain=pickyourskills.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @downloadURL https://update.greasyfork.org/scripts/433115/PYS%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/433115/PYS%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var currentWeekNumber = getCurrentWeekNumber();
    var currentYear = new Date().getFullYear();

    var displayExceedingTacesInOrange = false;
    var displayWeekStandard = false;
    var defaultTaces = {
        Dev: 100,
        Sales: 0,
        'Growth Team': 0,
        Architecte: 90,
        'Head of Tribe': 0,
        'VP Tech': 50,
        'CA / PO': 100,
        'DP / PM / AM': 100,
        'Externe': 0
    }

    var tacesByTribe = {
        'Theodo Lyon': {
            ...defaultTaces,
            'Head of Tribe': 50,
            'CA / PO': 50,
            'DP / PM / AM': 50
        },
        'Kumo': {
            ...defaultTaces,
            Dev: 90,
            Architecte: 80
        }
    }

    var defaultWeekStandard = 9;
    var weekStandardByTribe = {
        'Theodo Lyon': 9,
        'Kumo': 3,
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tribe') === 'kumo') {
        displayExceedingTacesInOrange = true;
        displayWeekStandard = true;
    }

    if (urlParams.get('tribe') === 'lyon') {
        displayWeekStandard = true;
    }



    function colorizeRowBasedOnStaffingAndTace(jNode) {
        var role = jNode.find('[label=Position]').text();
        var tribe = jNode.find('[label=Tribe]').text();

        jNode.find('div.cell.main_cell[width=85] > div > div').each(function(jNode) {
            var staffing = $(this).text();

            if (staffing.endsWith('%')) {
                var staffingNumber = parseInt(staffing.slice(0, -1));

                var taces = defaultTaces;
                if (tribe in tacesByTribe) {
                    taces = tacesByTribe[tribe];
                }

                if (staffingNumber === taces[role]) {
                    displayGreen($(this));
                } else if (staffingNumber > taces[role]) {
                    if (displayExceedingTacesInOrange) {
                        displayOrange($(this));
                    } else {
                        displayGreen($(this));
                    }
                } else {
                    displayRed($(this));
                }
            }

            if (displayWeekStandard) {
                // we want to add a border x weeks after current and works even with new years, hence the modulo
                var weekStandard = defaultWeekStandard;
                if (tribe in weekStandardByTribe) {
                    weekStandard = weekStandardByTribe[tribe];
                }
                var weekNumberInStandard = currentWeekNumber + weekStandard;

                var yearNumberInStandard = currentYear;
                if (weekNumberInStandard > 52) {
                    weekNumberInStandard = weekNumberInStandard % 52;
                    yearNumberInStandard++
                }

                var twoDigitsWeekStandard = ("0" + weekNumberInStandard).slice(-2);

                if ($(this).parent().data('cy') === 'date-' + yearNumberInStandard + '-W' + twoDigitsWeekStandard) {
                    $(this).parent().css('border-right', '3px solid orange');
                }
            }
        });

    }

    function getCurrentWeekNumber() {
        var today = new Date();
        var d = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    }

    function displayGreen(_this) {
        _this.css('color', 'rgb(112, 215, 98)');
        _this.css('background-color', 'rgba(112, 215, 98, 0.1)');
    }

    function displayOrange(_this) {
        _this.css('color', 'rgb(255, 165, 0)');
        _this.css('background-color', 'rgba(255, 165, 0, 0.1)');
    }

    function displayRed(_this) {
        _this.css('color', 'rgb(219, 40, 40)');
        _this.css('background-color', 'rgba(219, 40, 40, 0.1)');
    }

    waitForKeyElements("#individual_staffing_reporting_table_export .row", colorizeRowBasedOnStaffingAndTace);
})();