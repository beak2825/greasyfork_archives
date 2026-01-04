// ==UserScript==
// @name        archive.today auto-click
// @namespace   http://tampermonkey.net/ // Changed namespace to a generic placeholder
// @match       https://archive.today/?*
// @match       https://archive.fo/?*
// @match       https://archive.is/?*
// @match       https://archive.li/?*
// @match       https://archive.md/?*
// @match       https://archive.ph/?*
// @match       https://archive.vn/?*
// @match       https://archiveiya74codqgiixo33q62qlrqtkgmcitqx5u2oeqnmn5bpcbiyd.onion/?*
// @grant       none
// @icon        https://archive.today/apple-touch-icon.png
// @version     1.3
// @author      ccuser44, richd
// @license     CC0
// @description Helper for loading archive.today URLs - auto-clicks the 'save' button to go to the archive
// @downloadURL https://update.greasyfork.org/scripts/535531/archivetoday%20auto-click.user.js
// @updateURL https://update.greasyfork.org/scripts/535531/archivetoday%20auto-click.meta.js
// ==/UserScript==

/*
 * This script is a modified version of "archive.today quick archive" v1.2
 * originally by ccuser44.
 * Source of original script: https://greasyfork.org/scripts/512123-archivetoday-quick-archive
 *
 * Modifications by Rich include:
 * - Updating @match patterns to explicitly list domains for better reliability.
 * - Adding check to only click save button if URL input is pre-populated.
 * - Removing unnecessary DOMContentLoaded listener and setTimeout.
 * - Adding a simple emoji indicator appended to the button text when clicked.
 * - Updating description and author list.
 *
 * Original license (CC0) is retained.
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide.
 * This software is distributed without any warranty.
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.archive.org/publicdomain/zero/1.0/>.
 */

(function() {
    'use strict';
    console.debug("archive.today auto-click script started");
    const form = document.getElementById('submiturl');
    const urlInput = document.getElementById('url');
    if (form && urlInput) {
        // Only click the form if there is a populated URL, which will happen when the page is loaded with 'url=<URL>' as a query parameter
        const urlValue = urlInput.value;
        if (urlValue && urlValue.trim() !== '') {
            console.log(`Loading archive for: "${urlValue}"...`);
            const saveButton = form.querySelector('input[type="submit"][value="save"]');
            if (saveButton) {
                saveButton.value = saveButton.value + ' ⏳'; // Add emoji to indicate loading
                saveButton.click();
                console.debug("Clicked the Save button.");

            } else {
                console.error("Failed to find Save button for auto-clicking.");
            }
        } else {
            console.debug("No URL set, so not auto-clicking.");
        }
    } else {
        console.error("Failed to find form needed for auto-clicking.");
    }
})();