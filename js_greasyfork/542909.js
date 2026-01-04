// ==UserScript==
// @name         e621 Deleted Post Source Opener
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  If an e621 post has "status: deleted", this script opens the first available source URL in a new tab.
// @author       Gemini
// @match        https://e621.net/posts/*
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542909/e621%20Deleted%20Post%20Source%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/542909/e621%20Deleted%20Post%20Source%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Check if the post is deleted.
    // Search for the list item containing "Status:" and check if it includes the word "Deleted".
    const infoListItems = document.querySelectorAll('#post-information ul li');
    let isDeleted = false;

    infoListItems.forEach(li => {
        const text = li.innerText.trim();
        if (text.startsWith('Status:') && text.includes('Deleted')) {
            isDeleted = true;
        }
    });

    // If the post is not deleted, do nothing.
    if (!isDeleted) {
        console.log('e621 Deleted Opener: Post not deleted.');
        return;
    }

    console.log('e621 Deleted Opener: Post is deleted. Searching for source...');

    // 2. Find the available source links.
    const sourceLinkElements = document.querySelectorAll('li.source-links a');

    // 3. If a source is found, open the first one in a new tab.
    if (sourceLinkElements.length > 0) {
        const firstSource = sourceLinkElements[0].href;
        console.log(`e621 Deleted Opener: Found source: ${firstSource}`);

        // A short delay to avoid issues with pop-up blockers.
        setTimeout(() => {
            console.log(`e621 Deleted Opener: Opening ${firstSource} in a new tab.`);
            GM_openInTab(firstSource, { active: true });
        }, 500);
    } else {
        console.log('e621 Deleted Opener: Source links not found.');
    }
})();