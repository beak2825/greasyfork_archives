// ==UserScript==
// @name         Personal Stats: Extended Player Graph Periods
// @namespace    https://greasyfork.org/users/3898
// @version      1.6
// @description  Add more options [3 years and Max] to player graph period selection.
// @author       Xiphias[187717]
// @match        http://www.torn.com/personalstats.php*
// @match        https://www.torn.com/personalstats.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367614/Personal%20Stats%3A%20Extended%20Player%20Graph%20Periods.user.js
// @updateURL https://update.greasyfork.org/scripts/367614/Personal%20Stats%3A%20Extended%20Player%20Graph%20Periods.meta.js
// ==/UserScript==

'use strict';

(function() {

    /**
     * Adds a new option to a select widget. The new option is placed last in the list.
     */
    function addSelectOption(selectWidgetId, option, value, beforeLast) {

        var select_widget = document.getElementById(selectWidgetId);
        var item_option = document.createElement('option');
        item_option.setAttribute('value', value);
        item_option.innerHTML = option;
        var name_option;
        if (beforeLast) {
            name_option = select_widget.lastChild.previousSibling;
        } else {
            name_option = select_widget.lastChild;
        }

        select_widget.insertBefore(item_option, name_option);

        // Only refresh the widget if the period-stats-button id exists
        if (document.getElementById("period-stats-button")) {
            $("#" + selectWidgetId).selectmenu(); // Refresh the selectmenu widget
        }
    }

    function optionExists(selectWidgetId, text) {
        return $("#" + selectWidgetId + " option").filter(function() {
            return this.text === text;
        }).length !== 0;
    }

    Date.daysBetween = function(date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    var today = new Date();

    var added_an_option = false;

    if (!optionExists("period-stats", "3 years")) {
        var three_years_ago = new Date();
        three_years_ago.setFullYear(three_years_ago.getFullYear() - 3);
        var days_since_three_years_ago = Date.daysBetween(three_years_ago, today);
        addSelectOption("period-stats", "3 years", days_since_three_years_ago, true);

        added_an_option = true;
    }


    if (!optionExists("period-stats", "Max")) {
        var epoch = new Date(2009, 11, 1);
        var daysSinceEpoch = Date.daysBetween(epoch, today);;
        addSelectOption("period-stats", "Max", daysSinceEpoch, false);

        added_an_option = true;
    }


    if (added_an_option) {
        $(".select-list.period-stats").find(".list").css("background-size", "contain");
        $(".select-list.period-stats").find(".list > .l").css("background-size", "cover");
        $(".select-list.period-stats").find(".list > .r").css("background-size", "cover");
    }
})();