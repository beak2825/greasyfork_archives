// ==UserScript==
// @name         MAL Conversation Button Adder (Async, DOMParser)
// @namespace    ConversationMAL
// @version      2
// @description  Adds a conversation button to each comment on a MAL profile using async/await and DOMParser to extract numerical user IDs.
// @author       Indochina
// @match        https://myanimelist.net/profile/*
// @match        https://myanimelist.net/comments.php?id=*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525602/MAL%20Conversation%20Button%20Adder%20%28Async%2C%20DOMParser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525602/MAL%20Conversation%20Button%20Adder%20%28Async%2C%20DOMParser%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- STEP 1: Extract the Profile Owner’s Numerical ID ---
    // Look for the Report link and extract the "id" parameter.
    const reportLink = document.querySelector('a.header-right[href*="/modules.php?go=report"]');
    let ownerId = null;
    if (reportLink) {
        const match = reportLink.href.match(/id=(\d+)/);
        if (match) {
            ownerId = match[1];
            console.log(`Profile owner ID extracted: ${ownerId}`);
        }
    }
    if (!ownerId) {
        console.error("Could not determine the profile owner's numerical ID from the Report link.");
        return;
    }

    // --- STEP 2: Define a helper to fetch and extract a commenter's numerical ID ---
    // We use a cache to avoid refetching the same profile.
    const userIdCache = {};

    async function getUserId(username) {
        if (userIdCache[username]) return userIdCache[username];
        try {
            // Fetch the commenter's profile page
            const response = await fetch(`https://myanimelist.net/profile/${username}`);
            const text = await response.text();

            // Parse the HTML response to a document
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // Look for the Report link on the fetched profile page.
            // (This should work for profiles that include it.)
            const reportLink = doc.querySelector('a.header-right[href*="/modules.php?go=report"]');
            if (reportLink) {
                const match = reportLink.href.match(/id=(\d+)/);
                if (match) {
                    const userId = match[1];
                    userIdCache[username] = userId;
                    console.log(`Extracted user id for ${username} via report link: ${userId}`);
                    return userId;
                }
            }

            // If the Report link wasn't found, log an error.
            console.error(`Could not extract user_id for ${username}`);
            return null;
        } catch (error) {
            console.error(`Error fetching profile for ${username}:`, error);
            return null;
        }
    }

    // --- STEP 3: Process each comment ---
    // We target each comment container. In many MAL pages, the comment content is within a <div class="text"> element.
    const commentDivs = document.querySelectorAll('div.text');
    for (const commentDiv of commentDivs) {
        // Find the comment author’s profile link; usually an <a class="fw-b"> element.
        const profileLink = commentDiv.querySelector('a.fw-b[href*="/profile/"]');
        if (!profileLink) continue;

        // Extract the username from the URL.
        // For example: "https://myanimelist.net/profile/Indochina"
        const urlParts = profileLink.href.split('/profile/');
        if (urlParts.length < 2) continue;
        const username = urlParts[1].split('?')[0];
        console.log(`Processing comment by: ${username}`);

        // Find or create the container for action links.
        let actionsDiv = commentDiv.querySelector('div.postActions');
        if (!actionsDiv) {
            actionsDiv = document.createElement("div");
            actionsDiv.className = "postActions ar mt4";
            actionsDiv.style.clear = "both";
            actionsDiv.style.paddingTop = "10px";
            commentDiv.appendChild(actionsDiv);
        }

        // If a Conversation link already exists, skip this comment.
        if (actionsDiv.querySelector('a.ml8[href*="comtocom.php"]')) {
            console.log(`Conversation link already exists for ${username}`);
            continue;
        }

        // --- STEP 4: Fetch the commenter's numerical ID and create the button ---
        const commenterId = await getUserId(username);
        if (!commenterId) continue;

        // Create the Conversation button.
        // id1 is the profile owner's id and id2 is the commenter's id.
        const convoLink = document.createElement("a");
        convoLink.className = "ml8";
        convoLink.href = `https://myanimelist.net/comtocom.php?id1=${ownerId}&id2=${commenterId}`;
        convoLink.textContent = "Conversation";
        convoLink.style.marginLeft = "10px";

        // Append the button to the actions container.
        actionsDiv.appendChild(convoLink);
    }
})();
