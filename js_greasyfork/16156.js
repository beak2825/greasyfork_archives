// ==UserScript==
// @name         Slackbot Filter for SER Editors
// @namespace    
// @version      0.55
// @description  Set preferences to filter bot keywords out by state and status
// @author       bmtg
// @include	     https://usaregions.slack.com/*
// @require https://greasyfork.org/scripts/16162-slackbot-filter-function/code/Slackbot%20Filter%20Function.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16156/Slackbot%20Filter%20for%20SER%20Editors.user.js
// @updateURL https://update.greasyfork.org/scripts/16156/Slackbot%20Filter%20for%20SER%20Editors.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';




var filterClosed = false;  // Remove any bot messages that are already closed
var filterReopened = true;  // Remove any bot messages that are reopened (green check)
var filterThumbsDown = true;  // Remove any bot messages with the thumbs-down, red X, or repeat icons
var filterStates = 1;
/* 

Change the options above to get these rules:

1: No state filtering (for editors in all 3 regions)
2: Filter FLC (editors who operate in both GA and AL)
3: Filter GAC (editors who operate in both FL and AL)
4: Filter ALC (editors who operate in both GA and FL)
5: Filter FLC & GAC (AL only editors)
6: Filter GAC & ALC (FL only editors)
7: Filter ALC & FLC (GA only editors)



--------Don't modify below this line--------
*/



var filteringTerms = [];
if (filterStates === 2) {
    filteringTerms = ['FLC'];
} else if (filterStates === 3) {
    filteringTerms = ['GAC'];
} else if (filterStates === 4) {
    filteringTerms = ['ALC'];
} else if (filterStates === 5) {
    filteringTerms = ['FLC','GAC'];
} else if (filterStates === 6) {
    filteringTerms = ['ALC','GAC'];
} else if (filterStates === 7) {
    filteringTerms = ['FLC','ALC'];
}

setTimeout(filterGo, 3000);
