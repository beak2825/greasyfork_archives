// ==UserScript==
// @name         JIRA Backlog Story Points Sum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sum story points in the backlog panel
// @author       You
// @match        https://<yourJiraInstance>/RapidBoard*view=planning*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468279/JIRA%20Backlog%20Story%20Points%20Sum.user.js
// @updateURL https://update.greasyfork.org/scripts/468279/JIRA%20Backlog%20Story%20Points%20Sum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ensure jQuery is available
    if (typeof $ == 'undefined') {
        if (window.jQuery) {
            $ = window.jQuery;
        } else {
            return;
        }
    }

    function calculateStoryPoints() {
        var total = 0;

        // Only sum story points in the backlog, not in sprints
        $('#ghx-content-group > div.ghx-backlog-group > div.ghx-backlog-container.ghx-open.ghx-everything-else.ui-droppable > div.ghx-issues.js-issue-list.ghx-has-issues span.ghx-end.ghx-estimate aui-badge')
            .each(function() {
                var points = parseFloat($(this).text());
                if (!isNaN(points)) {
                    total += points;
                }
            });

        return total;
    }

    function addStoryPointsToBacklogHeader() {
        // Remove any existing badge to prevent duplicates
        $('#ghx-content-group > div.ghx-backlog-group > div.ghx-backlog-container.ghx-open.ghx-everything-else.ui-droppable > div.ghx-backlog-header.js-marker-backlog-header aui-badge')
            .remove();

        var total = calculateStoryPoints();

        // Create the badge and add it to the backlog panel header
        var badgeHtml = '<aui-badge>' + total + ' story points</aui-badge>';

        $('#ghx-content-group > div.ghx-backlog-group > div.ghx-backlog-container.ghx-open.ghx-everything-else.ui-droppable > div.ghx-backlog-header.js-marker-backlog-header')
            .append(badgeHtml);
    }

    // Add badge when the page loads
    $(document).ready(function() {
        addStoryPointsToBacklogHeader();
    });

    // Update badge when the page changes (e.g. when moving an issue)
    $(document).ajaxComplete(function() {
        addStoryPointsToBacklogHeader();
    });
})();
