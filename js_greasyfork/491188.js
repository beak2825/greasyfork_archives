// ==UserScript==
// @name	 Metal Archives - Remove review information
// @description	 Remove review information from the band and album pages.
// @version	 1.1
// @include	 /^https?://www\.metal-archives\.com/.*$/
// @grant	 none
// @license	 Unlicense
// @namespace	 https://github.com/quaepoena/MA-remove-review-info
// @downloadURL https://update.greasyfork.org/scripts/491188/Metal%20Archives%20-%20Remove%20review%20information.user.js
// @updateURL https://update.greasyfork.org/scripts/491188/Metal%20Archives%20-%20Remove%20review%20information.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let albumIntervalId = null;
    let stored_tables = [];

    /* Find the description term with the value "Reviews:" and set the
       corresponding description detail to "None yet". Remove the setInterval()
       loop afterward. Note that albumIntervalId is not set to null so that
       future load events don't cause this function to run again. */
    function remove_review_info_album_page() {
        let desc_terms = document.querySelectorAll("dt");
        let desc_details = document.querySelectorAll("dd");

        for (let i = 0; i < desc_terms.length; i++) {
            if (desc_terms[i].textContent == "Reviews:") {
                desc_details[i].textContent = "None yet";
                window.clearInterval(albumIntervalId);
            }
        }
    }

    /* Begin the setInterval() loop only once. */
    function album_page() {
        if (!albumIntervalId) {
            albumIntervalId = window.setInterval(
                remove_review_info_album_page, 50)
        }
    }

    /* Adapted from:
       https://dmitripavlutin.com/how-to-compare-objects-in-javascript/
       Return true if the array of tables has changed. This happens when the
       user clicks on, e.g., "Main" or "Lives" in the discography tab. */
    function change_in_tables(current_tables) {
        const keys1 = Object.keys(stored_tables);
        const keys2 = Object.keys(current_tables);

        if (keys1.length !== keys2.length) {
            return true;
        }

        for (let key of keys1) {
            if (stored_tables[key] !== current_tables[key]) {
                return true;
            }
        }

        return false;
    }

    /* For each release, set the textContent of the Element
       to an empty string. */
    function remove_reviews_band_page(discog_table) {
        let releases = discog_table.children[1].rows;
        for (let i = 0; i < releases.length; i++) {
            releases[i].children[3].textContent = "";
        }
    }

    /* Create loop with setInterval() that watches for changes in the tables
       present in the document. */
    function band_page() {
        window.setInterval(function() {
            let current_tables = document.querySelectorAll("table");
            if (!change_in_tables(current_tables)) {
                return;
            }

            for (let i = 0; i < current_tables.length; i++) {
                if (current_tables[i].className == "display discog") {
                    remove_reviews_band_page(current_tables[i]);
                }
            }

            stored_tables = current_tables;

        }, 250);
    }

    window.onload = function start() {
        if (document.URL.includes("/bands/")) {
            band_page();
        } else if (document.URL.includes("/albums/")) {
            album_page();
        }
    }

})();
