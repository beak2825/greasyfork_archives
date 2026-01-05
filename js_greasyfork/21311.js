// ==UserScript==
// @name         Sort JIRA comments.
// @namespace    https://github.com/skehlet/jira-sort-comments-tampermonkey
// @version      0.7
// @description  Force JIRA comments to be sorted in the order you prefer.
// @author       @skehlet (Steve Kehlet)
// @contributor  @saurabhere
// @contributor  @catholicon
// @match        https://jira.atlassian.com/browse/*
// ... include more match statements here, including your private JIRA repos
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21311/Sort%20JIRA%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/21311/Sort%20JIRA%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var desiredSortOrder = 'asc'; // change me to 'desc' if you prefer

    // apparently sometimes $ isn't available and jQuery is there (e.g. issues.apache.org/jira)
    $ = $ || jQuery;

    // some jira setups (e.g. issues.apache.org/jira) have sort toggle button as
    // class="icon icon-sort-down ajax-activity-content" OR class="icon icon-sort-up ajax-activity-content"
    // depending on the context. So, using those selectors too.
    $('.issue-activity-sort-link')
    .add($('.icon-sort-down.ajax-activity-content'))
    .add($('.icon-sort-up.ajax-activity-content'))
    .each(function () {
        var sortLink = $(this);
        // the link shows the order that will result if you click on it
        if (sortLink.attr('data-order') == desiredSortOrder || sortLink.attr('href').endsWith(desiredSortOrder)) {
            // use .issue-view if present (there's a sidebar and scrollable frame to the right), otherwise window
            var selector = $('.issue-view').length > 0 ? '.issue-view' : window;
            var scrollPos = $(selector).scrollTop();
            // scroll back to where we were after clicking
            $(selector).one('scroll', function () {
                $(selector).scrollTop(scrollPos);
            });
            sortLink.click();
        }
    });
})();
