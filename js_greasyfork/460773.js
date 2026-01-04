// ==UserScript==
// @name         EBSCO results auto-save
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto save the search results
// @author       Js
// @match        https://web.p.ebscohost.com/ehost/resultsadvanced*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebscohost.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460773/EBSCO%20results%20auto-save.user.js
// @updateURL https://update.greasyfork.org/scripts/460773/EBSCO%20results%20auto-save.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Click share-results button to save the results on the page
    function saveResults() {
        const saveBtn = document.getElementById("lnkAddAll_ctrlSaveToFolder");
        if (saveBtn) saveBtn.click();
        // add else
    }

    // Click next page
    function nextPage() {
        const nextPageBtn = document.getElementById("ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext");
        if (nextPageBtn) nextPageBtn.click();
    }

    // load page and run functions
    window.onload = function() {
        saveResults();
        nextPage();
    }
})();