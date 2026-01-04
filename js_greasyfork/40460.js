// ==UserScript==
// @name         Exclude sites from Google search results
// @namespace    https://www.google.nl/search/
// @version      0.2
// @description  Excludes specified sites from google search results
// @author       angelo.ndira@gmail.com
// @match        https://www.google.nl/search?*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/40460/Exclude%20sites%20from%20Google%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/40460/Exclude%20sites%20from%20Google%20search%20results.meta.js
// ==/UserScript==


function start() {
    'use strict';
    console.log("Starting Exclude sites from Google search results");
    var exclusionList = " -site:youtube.com site:.nl";

    $(document).find('div#topabar > div#slim_appbar > div#sbfrm_l > div#resultStats').each(function () {
        console.log("Found google search results");
        $(document).find('div#sb_ifc0 > div#gs_lc0 > input#lst-ib').each(function () {
            console.log("Found Google search text box");
            var originalSearch = $(this).val();
            console.log("Original Google search text: " + originalSearch);
            console.log("Check whether original search text is undefined");
            if (typeof (originalSearch) === 'undefined') return;
            console.log("Check whether original search text is null");
            if (originalSearch === null) return;
            console.log("Check whether original search text is empty");
            if (originalSearch.trim() === "")return;

            console.log("Trimming search text");
            var trimmedSearch = originalSearch.replace(exclusionList, "");

            console.log("Checking indexOf exclusion list");
            if(originalSearch.indexOf(exclusionList)>-1)return;

            console.log("Check whether trimmed text is undefined");
            if (typeof (trimmedSearch) === 'undefined') return;
            console.log("Check whether trimmed text is null");
            if (trimmedSearch === null) return;
            console.log("Check whether trimmed text is empty");
            if (trimmedSearch.trim() === "") return;
            console.log("Checking length of trimmed search text");
            if (trimmedSearch.length < originalSearch.lenth) return;
            console.log("Creating new search text");
            var newSearch = originalSearch + exclusionList;
            console.log("Setting new search text");
            $(this).val(newSearch);
            $(document).find('div#sfdiv > button#mKlEF').each(function () {
                console.log("Found google search button");
                $(this).click();
                console.log("Google search button clicked");
            });
        });
    });
    console.log("Complete Exclude sites from Google search results");
}

(function() {
    'use strict';
    console.log("document loaded(). Exclude sites script will start in 2 seconds");
    setTimeout(start, 2000);
})();