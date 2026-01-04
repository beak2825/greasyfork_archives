// ==UserScript==
// @name            Youtube: Auto-sort search results by upload date
// @description     Rewrites the URL of a YouTube search results page to automatically sort by video upload date, if the sort order is not already present
// @author          Archangel1C
// @license         GPL-3.0-only
// @namespace       https://github.com/Archangel1C
// @version         0.1
// @match           *://*.youtube.com/results*
// @run-at          document-start
// @grant           none
// @compatible      chrome
// @contributionURL https://flattr.com/@Archangel1C
// @downloadURL https://update.greasyfork.org/scripts/376985/Youtube%3A%20Auto-sort%20search%20results%20by%20upload%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/376985/Youtube%3A%20Auto-sort%20search%20results%20by%20upload%20date.meta.js
// ==/UserScript==
//
// Sources/Influences:
// - https://stackoverflow.com/a/28956498/4423698


(function() {
// debugger instruction lets Chrome stop here
//  debugger;

    // https://www.w3schools.com/js/js_strict.asp
    // https://stackoverflow.com/a/1335881/4423698
    'use strict';

    var query = new URLSearchParams(window.location.search);
    // for(let param of query.entries()) console.log(param);

    // - do not change the sort order, if there is already one defined
    // - avoid infinite recursion
    if(query.get("search_sort") == null) {
        query.append("search_sort", "video_date_uploaded");
        window.location.search = "?" + query.toString();
    }
})();
