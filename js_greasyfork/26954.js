// ==UserScript==
// @name         JIRA Rapid Board Issue Tracker
// @namespace    http://www.kalee.hu
// @version      0.0.2
// @description  Tracking issues on JIRA Rapid Board.
// @author       Moondancer83
// @homepage     https://github.com/Moondancer83/JIRARapidBoardIssueTracker
// @include      /jira.*/secure/RapidBoard.jspa*/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26954/JIRA%20Rapid%20Board%20Issue%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/26954/JIRA%20Rapid%20Board%20Issue%20Tracker.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var head = $("head");

    setTimeout(function() {
        setStyles();
        issueCounter();
    }, 2000);

    function setStyles() {
        head.append("<style>" +
                    ".ghx-badge-group {zoom: 145%;} " +
                    "</style>");
    }
    function issueCounter() {
        var sprintIssues = $(".ghx-backlog-container.ghx-sprint-active.js-sprint-container .js-issue.ghx-issue-compact").length;
        var issuesToGo = $(".ghx-backlog-container.ghx-sprint-active.js-sprint-container .js-issue.ghx-issue-compact:not(.ghx-done)").length;
        var badge = '<span class="aui-badge issue-counter" title=Issues (to go/all): "' + issuesToGo + ' / ' + sprintIssues + '">' + issuesToGo + ' / ' + sprintIssues + '</span>';
        $('.ghx-badge-group').prepend(badge);
    }
})();