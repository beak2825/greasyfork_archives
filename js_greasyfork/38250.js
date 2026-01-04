// ==UserScript==
// @name         Navigate Jira Issues on Swimlanes with Cmd/Ctrl Up / Down
// @namespace    http://tedmor.in/
// @version      0.3.0
// @description  Navigate between open issues on the Jira current sprint with y (up) and n (down). Add shift to jump to first or last.
// @author       Ted Morin
// @match        https://*.atlassian.net/secure/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38250/Navigate%20Jira%20Issues%20on%20Swimlanes%20with%20CmdCtrl%20Up%20%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/38250/Navigate%20Jira%20Issues%20on%20Swimlanes%20with%20CmdCtrl%20Up%20%20Down.meta.js
// ==/UserScript==
// jshint asi:true

(function() {
    'use strict'
    let issueNumber = 0
    /* Open issues */
    function openIssues() {
        return $('.ghx-swimlane .ghx-swimlane-header') // Get all headers
            .filter((i, el) => !$(el).find('.jira-issue-status-lozenge:contains("Closed")').length) // Filter out the closed ones
            .map((i, el) => $(el).parent())
    }
    /* Return the open issue at given index */
    function issueAt(index) {
        return openIssues()[index] // Return the parent, which is the actual swimlane element
    }
    /* Scroll to an issue by index */
    function scrollToIssue(index) {
        console.log('Scrolling to', index)
        $('#ghx-pool').animate({scrollTop: issueAt(index).offset().top - $('.ghx-first').offset().top + 1}, 200)
    }
    $(document).keydown(function(e) {
        let doIt = true
        switch (e.which) {
            case 38: // Up
                if (e.metaKey || e.ctrlKey) {
                    if (e.shiftKey) {
                        issueNumber = 0
                    } else if (issueAt(issueNumber - 1)) {
                        issueNumber -= 1
                    }
                }
                break;
            case 40: // Down
                if (e.metaKey || e.ctrlKey) {
                    if (e.shiftKey) {
                        issueNumber = openIssues().length - 1
                    } else if (issueAt(issueNumber + 1)) {
                        issueNumber += 1
                    }
                }
                break;
            default:
                doIt = false;
        }
        if (doIt) {
            e.preventDefault()
            scrollToIssue(issueNumber)
        }
    })
})();