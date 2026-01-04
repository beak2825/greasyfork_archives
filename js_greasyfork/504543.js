// ==UserScript==
// @name        Github Pull Requests - Always Hide Whitespace
// @namespace   github-hide-whitespace
// @match       *://*.github.com/*/pull/*/files*
// @run-at      document-start
// @grant       none
// @version     1.0.0
// @description Always add the "hide whitespace" when viewing Github PR diffs
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/504543/Github%20Pull%20Requests%20-%20Always%20Hide%20Whitespace.user.js
// @updateURL https://update.greasyfork.org/scripts/504543/Github%20Pull%20Requests%20-%20Always%20Hide%20Whitespace.meta.js
// ==/UserScript==

/*
This script will always add the "hide whitespace" url param when viewing Github
pull request diffs, with ?w=1 or &w=1.

You can override to show whitespace diffs by manually changing to w=0 in your
query instead of w=1, and script will leave it alone
*/

var oldUrlSearch = window.location.search;

// Test if "&w=" or "?w=" is in the search params
if ( !/[?&]w=/.test(oldUrlSearch) ) {
    // if there were already other search params, just add on with '&'
    var ampersandOrQuestionMark = !!oldUrlSearch ? '&' : '?';

    var newURL = window.location.protocol + "//"
                + window.location.host
                + window.location.pathname
                + oldUrlSearch + ampersandOrQuestionMark + "w=1"
                + window.location.hash;

    window.location.replace(newURL);
}
