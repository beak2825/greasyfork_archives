// ==UserScript==
// @name         Atlassian Jira RapidBoard Planning Story Points Total
// @namespace    KoryPaulsen
// @version      0.0.1
// @description  Sums up all the story points on the "planning" view of a Jira project's RapidBoard (i.e. Backlog) .
// @author       Kory Paulsen
// @match        https://*.atlassian.net/secure/RapidBoard.jspa?rapidView=*&view=planning*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390789/Atlassian%20Jira%20RapidBoard%20Planning%20Story%20Points%20Total.user.js
// @updateURL https://update.greasyfork.org/scripts/390789/Atlassian%20Jira%20RapidBoard%20Planning%20Story%20Points%20Total.meta.js
// ==/UserScript==

console.log("UserScript - Atlassian Jira RapidBoard Planning Story Points Total");
document.addEventListener('DOMContentLoaded', function() {
    (function($) {
        // Add up all the story points on a RapidBoard Planning view page 
        let storyPtsCount = function() {
            let storyHeader = $('#ghx-content-group .header-left');
            if (storyHeader.length === 0) {
                setTimeout(storyPtsCount, 500);
            } else {
                let storyPts = 0;
                $('[title="Story Points"]').each(function() {
                    storyPts += parseInt($(this).html());
                });
                console.log("UserScript - Atlassian Jira RapidBoard Planning Story Points Total - Total story points", storyPts);
                $('.ghx-issue-count', storyHeader).append('<span class="Resource-Override story-points"> - Points: ' + storyPts + '</span>');
            }
        }
        storyPtsCount();
    })(jQuery);
});