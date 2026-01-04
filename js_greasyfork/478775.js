// ==UserScript==
// @name          Youtube - force 'sort by date' on searches
// @description   Automates the 'sort by date' filter on YouTube search results.
// @author        dhaden
// @version       1.0
// @match         *://www.youtube.com/results?search_query=*
// @grant         none
// @noframes
// @license       MIT
// @namespace https://greasyfork.org/users/186630
// @downloadURL https://update.greasyfork.org/scripts/478775/Youtube%20-%20force%20%27sort%20by%20date%27%20on%20searches.user.js
// @updateURL https://update.greasyfork.org/scripts/478775/Youtube%20-%20force%20%27sort%20by%20date%27%20on%20searches.meta.js
// ==/UserScript==

var oldUrlPath  = window.location.pathname;
var oldSearch   = window.location.search;

// Test that 'CAI%253D' does not already exist in URL
if ( ! /\CAI%253D/.test (oldSearch) ) {

    var newURL  = window.location.protocol + '//'
                + window.location.host
                + window.location.pathname
                + window.location.search + '&sp=CAI%253D&search_sort=video_date_uploaded'
                + window.location.hash;

    // replace() puts the good page in the history
    window.location.replace (newURL);
}