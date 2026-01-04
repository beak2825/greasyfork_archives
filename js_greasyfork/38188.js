// ==UserScript==
// @name         Novel Updates Filter
// @namespace    https://www.zerpr.net/
// @version      3
// @description  Filters table rows based on origin
// @author       Zerpr
// @match        *://*.novelupdates.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require     https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38188/Novel%20Updates%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/38188/Novel%20Updates%20Filter.meta.js
// ==/UserScript==
//referenced https://stackoverflow.com/questions/31758115/how-to-hide-table-rows-containing-certain-keywords
//Usage: Must be logged into Novel Updates and "Enable Origin Tagging" option (either one) selected in your profile settings


//Add keywords to filter out in novel titles, such as the origin tag
//escape brackets using double backward-slash: \\
var keywords = [
    "\\[KR\\]",
    "\\[CN\\]",
    "\\[FIL\\]",
    "\\[MY\\]"
];

//table class used for novels table
var tableClass = ".tablesorter";

//Allows for use of multiple keywords
var keyW_Regex = new RegExp (keywords.join('|'));


waitForKeyElements (
    tableClass+" td:nth-of-type(1)", hideTargetedRowAsNeeded
);

function hideTargetedRowAsNeeded (jNode) {
    if (keyW_Regex.test (jNode.text () ) ) {
        jNode.parent ().hide ();
    }
}