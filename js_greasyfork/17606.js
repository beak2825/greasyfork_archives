// ==UserScript==
// @name         NoFixup!
// @namespace    http://www.budw.in/
// @version      0.3.2
// @description  Disable the merge pull request button when fixup! commits exist in the current PR and haven't been squashed yet and hide the "Update branch" button.
// @author       Drew Budwin
// @match        http*://github.com/*
// @require      https://code.jquery.com/jquery-2.2.1.js
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/17606/NoFixup%21.user.js
// @updateURL https://update.greasyfork.org/scripts/17606/NoFixup%21.meta.js
// ==/UserScript==
/* jshint -W097 */
/* globals $:false */
/* global waitForKeyElements */
'use strict';

waitForKeyElements (".merge-message", disableMergeButton);
waitForKeyElements (".branch-action-item", hideUpdateBranchButton);

function hideUpdateBranchButton()
{    
    var updateBranchButton = $('button:contains("Update branch")').hide();
    
    if (updateBranchButton !== null)
    {        
        updateBranchButton.hide();
    }
    else
    {
        console.log("WARNING: Can't locate active update branch button on page!");
    }
}

function disableMergeButton()
{
    var mergeButton = $('button:contains("Merge pull request")');

    if (mergeButton !== null && doesPRContainFixupCommits())
    {        
        mergeButton.text("Are there fixup! commits?");
        mergeButton.prop("disabled", true);
    }
    else
    {
        console.log("WARNING: Can't locate active merge button on page!");
    }
}

function doesPRContainFixupCommits()
{    
    return $('.timeline-commits:contains("fixup!")').length >= 1;
}