// ==UserScript==
// @name         MyAnimeList: Mass-delete your Plan to Watch list
// @namespace    plennhar-myanimelist-mass-delete-your-plan-to-watch-list
// @version      1.0
// @description  When on the Plan to Watch page, goes through and deletes every single entry until there's none left.  Should work with the majority of list styles, but could break if the default modern style isn't used.  Make sure to disable this script after you're done using it.
// @author       Plennhar
// @match        https://myanimelist.net/animelist/*?status=6
// @match        https://myanimelist.net/ownlist/anime/*/edit?hideLayout
// @match        https://myanimelist.net/ownlist/anime/*/delete?hideLayout=1
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/501055/MyAnimeList%3A%20Mass-delete%20your%20Plan%20to%20Watch%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/501055/MyAnimeList%3A%20Mass-delete%20your%20Plan%20to%20Watch%20list.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2024 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(function() {
    'use strict';

    // Automatically click OK to confirm deletions
    window.confirm = function() {
        return true;
    };

    // Check if the page is a Plan to Watch page
    function checkUrl() {
        return window.location.search.includes('?status=6');
    }

    // Clicking edit
    function handleDeletion(editButtons, index, originalUrl) {
        if (index < editButtons.length) {
            window.location.href = editButtons[index].href;
            localStorage.setItem('malDeleteIndex', index);
            localStorage.setItem('malOriginalUrl', originalUrl);
        } else {
            localStorage.removeItem('malDeleteIndex');
            localStorage.removeItem('malOriginalUrl');
        }
    }

    // Clicking the Delete button
    function processDeletion() {
        const deleteButton = document.querySelector('input[value="Delete"]');
        if (deleteButton) {
            deleteButton.click();
        } else {
            setTimeout(processDeletion, 500);
        }
    }

    // Redirect back to original page after deletion
    function handleRedirection() {
        const originalUrl = localStorage.getItem('malOriginalUrl');
        if (originalUrl) {
            window.location.href = originalUrl;
        }
    }

    // Main function
    function startScript() {
        if (checkUrl()) {
            const editButtons = document.querySelectorAll('span.edit a');
            if (editButtons.length === 0) return;

            const index = localStorage.getItem('malDeleteIndex') ? parseInt(localStorage.getItem('malDeleteIndex')) : 0;
            const originalUrl = window.location.href;

            handleDeletion(editButtons, index, originalUrl);
        } else if (window.location.href.includes('/edit?hideLayout')) {
            processDeletion();
        } else if (window.location.href.includes('/delete?hideLayout=1')) {
            handleRedirection();
        }
    }

    setTimeout(startScript, 1000); // Delay to ensure page load
})();