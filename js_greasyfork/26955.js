// ==UserScript==
// @name         JIRA Rapid Board highlighter
// @namespace    http://www.kalee.hu
// @version      0.0.4
// @description  Highlight closed stories on JIRA Rapid Board.
// @author       Moondancer83
// @homepage     https://github.com/Moondancer83/JIRARapidBoardHighlighter
// @include      /jira.*/secure/RapidBoard.jspa*/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26955/JIRA%20Rapid%20Board%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/26955/JIRA%20Rapid%20Board%20highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var colors = {
        done: "#e0efdc",
        my: "#efdce0"
    };
    var head = $("head");
    var username = $("#header-details-user-fullname").data('username');

    setTimeout(function() {
        setStyles();
        markMyIssues();
    }, 2000);

    function setStyles() {
        head.append("<style>" +
                    ".js-issue.ghx-issue-compact.ghx-done {background-color:" + colors.done+ "} " +
                    ".js-issue.ghx-issue-compact.ghx-issue-my {background-color: " + colors.my + "}" +
                    "</style>");
    }
    function markMyIssues() {
        $(".ghx-end img[src*=" + username +"].ghx-avatar-img").closest(".js-issue:not('.ghx-done')").addClass("ghx-issue-my");
    }
})();