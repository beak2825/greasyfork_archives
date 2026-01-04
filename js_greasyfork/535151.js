// ==UserScript==
// @name         Hacker News Show HN Open Source Filter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Filters Hacker News Show submissions to only show open-source projects, removes clutter, and re-ranks items.
// @author       sm18lr88 (https://github.com/sm18lr88)
// @license      MIT
// @match        https://news.ycombinator.com/show
// @match        https://news.ycombinator.com/show*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535151/Hacker%20News%20Show%20HN%20Open%20Source%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/535151/Hacker%20News%20Show%20HN%20Open%20Source%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OPEN_SOURCE_HOSTS = [
        "github.com",
        "gitlab.com",
        "bitbucket.org",
        "sourceforge.net",
        "github.io",
        "codeberg.org",
        // Add more known open-source hosting domain suffixes if needed
    ];

    /**
     * Removes the "Show HN: " prefix from titles.
     */
    function removeShowHnPrefix() {
        const titles = document.querySelectorAll('#hnmain .titleline > a');
        titles.forEach(title => {
            if (title.textContent.startsWith('Show HN: ')) {
                title.textContent = title.textContent.replace('Show HN: ', '');
            }
        });
    }

    /**
     * Checks if a URL points to a known open-source repository or project page.
     * @param {string} urlString - The URL to check.
     * @returns {boolean} True if it's considered an open-source link, false otherwise.
     */
    function isRepoLink(urlString) {
        if (!urlString) return false;
        try {
            const url = new URL(urlString); // Handles absolute URLs
            const hostname = url.hostname.toLowerCase();
            // Check if the hostname or a parent domain is in our list
            if (OPEN_SOURCE_HOSTS.some(host => hostname === host || hostname.endsWith('.' + host))) {
                return true;
            }
        } catch (e) {
            // Likely a relative URL (e.g., "item?id=...") or invalid.
            // These are not considered direct open-source repo links.
            return false;
        }
        return false;
    }

    /**
     * Filters submissions to keep only those linking to open-source projects.
     * Removes the submission row, its subtext row, and its spacer row if not open source.
     */
    function filterSubmissions() {
        const submissions = document.querySelectorAll('#hnmain tr.athing.submission');
        submissions.forEach(submissionRow => {
            const titleLink = submissionRow.querySelector('.titleline > a');
            if (titleLink) {
                const url = titleLink.href;
                if (!isRepoLink(url)) {
                    const subtextRow = submissionRow.nextElementSibling; // This is the row with score, user, comments
                    const spacerRow = subtextRow ? subtextRow.nextElementSibling : null; // This is the <tr class="spacer">

                    submissionRow.remove();
                    if (subtextRow) {
                        subtextRow.remove();
                    }
                    // Ensure spacerRow is indeed a spacer before removing
                    if (spacerRow && spacerRow.classList.contains('spacer')) {
                        spacerRow.remove();
                    }
                }
            }
        });
    }

    /**
     * Removes unnecessary clutter from the page, like the intro "rules" div and footer links.
     */
    function removePageClutter() {
        // Remove the "Please read the Show HN rules..." div
        // This div is a child of a TD and contains a link to 'showhn.html'
        const allTdDivs = document.querySelectorAll('#hnmain td > div');
        allTdDivs.forEach(div => {
            if (div.querySelector('a[href="showhn.html"]') && div.textContent.includes("Please read the Show HN rules")) {
                div.remove();
            }
        });

        // Remove the footer yclinks (Guidelines, FAQ, Lists, API, etc.)
        const yclinksSpan = document.querySelector('span.yclinks');
        if (yclinksSpan) {
            // Optionally remove the <br> tags and Search form if the whole center block is to be cleaned.
            // For now, just removing the yclinks span itself.
            yclinksSpan.remove();
            // If you want to remove the surrounding <center> tag that also contains the search bar:
            // const centerContainer = yclinksSpan.closest('center');
            // if (centerContainer) centerContainer.remove();
        }
    }

    /**
     * Re-numbers the rank of the remaining visible items.
     */
    function updateRanks() {
        const remainingRanks = document.querySelectorAll('#hnmain tr.athing.submission .rank');
        remainingRanks.forEach((rankSpan, index) => {
            rankSpan.textContent = `${index + 1}.`;
        });
    }

    // --- Execute the functions ---
    removeShowHnPrefix();
    filterSubmissions();
    removePageClutter();
    updateRanks();

})();