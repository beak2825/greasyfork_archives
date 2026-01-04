// ==UserScript==
// @name        Jira Table Counter
// @namespace   https://github.com/RayWangQvQ/Ray.Tampermonkey/
// @description Displays the total amount of table columns
// @include     https://*jira*
// @author      Ray
// @supportURL  https://github.com/RayWangQvQ/Ray.Tampermonkey/blob/main/JiraTableCounter/README.md
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @version     0.0.1
// @icon        https://raw.githubusercontent.com/RayWangQvQ/Ray.Tampermonkey/main/JiraStoryCounter/jira-software_logo.png
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441209/Jira%20Table%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/441209/Jira%20Table%20Counter.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

waitForKeyElements('.issue-table', getNumPoints);
waitForKeyElements('#issuetable', getNumPoints);

// jNode is the table
function getNumPoints(jNode) {
    var columns = {};

    // init header and set value = 0
    var columnHeaders = jNode.find('.rowHeader');
    columnHeaders.each(function () {
        $(this).children('th').each(function () {
            var id = $(this).attr('data-id');
            columns[id] = 0;
        });
    });

    // count
    var rows = jNode.find('.issuerow');
    rows.each(function () {
        var row = $(this);
        var tds = row.children('td');
        tds.each(function () {
            var td = $(this);
            var columnId = td.attr('class');
            var point = parseFloat(td.context.innerText || 0);

            if (point > 0) {
                columns[columnId] += point;
            }
        })
    });

    // append sum num to header
    columnHeaders.each(function () {
        $(this).children('th').each(function () {
            var id = $(this).attr('data-id');
            var totalCount = columns[id];
            if (totalCount > 0) {
                $(this).children('span').append(' (' + totalCount + ')');
            }
        });
    });
}
