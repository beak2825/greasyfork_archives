// ==UserScript==
// @name       Redmine Status Highlighter Extended
// @namespace  http://deeagle.de
// @version    0.3.0
// @description  Highlight issue status etc. in redmine issue list and details. It's based on the 'Redmine Status Highlighter' v0.2.1 of cbaoth (see https://greasyfork.org/de/scripts/8752-redmine-status-highlighter). 
//
// Change "mydomain" or path "/redmine/" if needed:
// @match      *://*/*/issues*
// @match      *://*/issues/*
// @match      *://*/redmine/*/issues*
// @match      *://*/redmine/issues/*
//
// @require    https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @copyright  2017, code@deeagle.de
// @downloadURL https://update.greasyfork.org/scripts/34209/Redmine%20Status%20Highlighter%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/34209/Redmine%20Status%20Highlighter%20Extended.meta.js
// ==/UserScript==

// Basis: http://userscripts.org/scripts/source/177488.user.js

// Change the colors as desired (examples below)

// prevent jQuery version conflicts (with page)
this.$ = this.jQuery = jQuery.noConflict(true);

// CONFIG
/** to enable/disable the debug option (to console.log) */
var DEBUG = false;
/** highlight priority */
var ENABLE_PRIORITY = true;
/** highlight status (and custome fields) */
var ENABLE_STATUS = true;
/** highlight in issue list */
var ENABLE_IN_LIST = true;
/** highlight in issue detail view */
var ENABLE_IN_DETAILS = true;
/** just highlight things that could be dev todos */
var DEV_TODO_ONLY = false;
/** for 'assigned to' highlighting */
var MY_NAME = "Heroic Horst";
/** Highlights the name on all pages */
var FULL_NAME_HIGHLIGHT = true;

// Redmine element labels
var REDMINE_PRIO_IMMEDIATE = "Immediate";
var REDMINE_PRIO_URGENT = "Urgent";
var REDMINE_PRIO_HIGH = "High";
var REDMINE_PRIO_NORMAL = "Normal";
var REDMINE_PRIO_LOW = "Low";

var REDMINE_STATE_NEW = "New";
var REDMINE_STATE_FEEDBACK = "Feedback";
var REDMINE_STATE_IN_PROGRESS = "In Progress";
var REDMINE_STATE_RESOLVED = "Resolved";
var REDMINE_STATE_CLOSED = "Closed";
var REDMINE_STATE_REJECTED = "Rejected";

var COLOR_RED = "#FBA";
var COLOR_PINK = "#FBF";
var COLOR_GOLD = "#FE8";
var COLOR_LIGHT_MINT = "#DFE";
var COLOR_GREY = "#DDD";
var COLOR_ORANGE = "#FB9";
var COLOR_LIGHT_BLUE = "#Dff7FF";


/**
 * Main
 */
(function () {

    // which screen are we in
    var screen = 0;
    if (/\/issues\//.test(window.location.pathname)) {
        screen = 2; // detail screen
    } else {
        screen = 1; // list screen
    }
    // not enabled for current screen?
    if ((screen === 1 && !ENABLE_IN_LIST) || (screen === 2 && !ENABLE_IN_DETAILS)) {
        return;
    } else
    {
        _log("you are on page " + screen);
    }

    // -- PRIORITY ----------------------------------------------------------------
    if (ENABLE_PRIORITY) {
        var priorityList = $('.priority');
        highlightPriority(priorityList);
    }

    // -- STATUS ------------------------------------------------------------------
    // we have to show for this on sub pages     $('td.subject').next()
    if (ENABLE_STATUS) {
        _log("[INFO] Status highlight enabled");
        var taskOverviewList = $('td.subject').next();
//        if (taskOverviewList.length === 0)
//        {
//            //console.log("[INFO] is not an overview task");
//            var statusList = $('.status');
//            highlightStates(statusList);
//        } else
        {
            _log("[INFO] is an overview task!");
            highlightStates(taskOverviewList);
            
            var statusList = $('td.status');
            highlightStates(statusList);
        }
    }

    // Assigned To
    var assignedTo = $('.assigned_to');
    if (FULL_NAME_HIGHLIGHT)
    {
        if (assignedTo.length === 0)
        {
            assignedTo = $('.user');
        }
    }
    highlightAuthor(assignedTo);
})();


/**
 * Prints the given msg to {@code console.log} (if {@code DEBUG} is enabled).
 * 
 * @param {String} msg
 */
function _log(msg)
{
    if (msg !== undefined)
    {
        if (DEBUG)
        {
            console.log("[DEBUG] " + msg);
        }
    }
}


/**
 * Highlights the redmine states in the given page elements.
 * 
 * @param {type} elements
 */
function highlightStates(elements)
{
    if (elements === undefined)
    {
        _log("[highlightStates] elements must not be undefined");
        return;
    }

    jQuery.each(elements, function (i, elem) {
        text = $(elem).text().trim();
        _log("[INFO] elem test is: " + text);
        if (text === REDMINE_STATE_NEW)
            $(elem).css("background-color", COLOR_RED);
        if (text === REDMINE_STATE_FEEDBACK)
            $(elem).css("background-color", COLOR_PINK);
        if (text === REDMINE_STATE_IN_PROGRESS)
            $(elem).css("background-color", COLOR_GOLD);
        if (!DEV_TODO_ONLY) { // ignore the following (not critical for devs)
            if (text === REDMINE_STATE_RESOLVED)
                $(elem).css("background-color", COLOR_LIGHT_MINT);
            if (text === REDMINE_STATE_CLOSED)
                $(elem).css("background-color", COLOR_GREY);
            if (text === REDMINE_STATE_REJECTED)
                $(elem).css("background-color", COLOR_ORANGE);
        }
    });
}


/** 
 * Highlights the redmine priority in the given page elements.
 * 
 * @param {type} elements
 */
function highlightPriority(elements)
{
    if (elements === undefined)
    {
        _log("[highlightPrioriy] elements must not be undefined");
        return;
    }

    jQuery.each(elements, function (i, elem) {
        text = $(elem).text().trim();
        if (text === REDMINE_PRIO_IMMEDIATE)
            $(elem).css("background-color", COLOR_RED);
        if (text === REDMINE_PRIO_URGENT)
            $(elem).css("background-color", COLOR_ORANGE);
        if (text === REDMINE_PRIO_HIGH)
            $(elem).css("background-color", COLOR_GOLD);
        if (text === REDMINE_PRIO_NORMAL)
            $(elem).css("background-color", COLOR_LIGHT_BLUE);
        if (text === REDMINE_PRIO_LOW)
            $(elem).css("background-color", COLOR_LIGHT_MINT);
    });
}


/** 
 * Highlights the author in the given page elements.
 * @param {type} elements
 */
function highlightAuthor(elements)
{
    if (elements === undefined)
    {
        _log("[highlightAuthor] elements must not be undefined");
        return;
    }

    jQuery.each(elements, function (i, elem) {
        text = $(elem).text().trim();
        if (text === MY_NAME)
            $(elem).css("background-color", COLOR_GOLD);
    });
}