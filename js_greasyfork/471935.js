// ==UserScript==
// @name         [AO3] Hide Bookmarks/Kudos from Search Results
// @namespace    ao3
// @version      1.0
// @description  Works you've already kudos'd or bookmarked are hidden from search results. Requires "AO3: Kudosed and Seen History" by Min_.
// @author       DREAMBONES
// @match        https://archiveofourown.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471935/%5BAO3%5D%20Hide%20BookmarksKudos%20from%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/471935/%5BAO3%5D%20Hide%20BookmarksKudos%20from%20Search%20Results.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.URL.startsWith("https://archiveofourown.org/works") || document.URL.startsWith("https://archiveofourown.org/tags")) {
        var worksList = document.querySelector(".work, .index, .group").children;
        for (var i = 0; i < (worksList.length); i++) {
            if (worksList[i].classList.contains("is-bookmarked") || worksList[i].classList.contains("has-kudos")) {
                worksList[i].style.display = "none";
            }
        }
    }
})();