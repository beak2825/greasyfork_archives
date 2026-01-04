// ==UserScript==
// @name         Github Gist Compact View (With Private Gists)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Displays Gists (including private ones) in a compact view with clickable links, visibility status, and last update date
// @author       Sergi0
// @match        https://gist.github.com/*
// @grant        none
// @icon         https://gist.github.com/favicon.ico
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/529737-github-gist-compact-view
// @supportURL   https://greasyfork.org/en/scripts/529737-github-gist-compact-view/feedback
// @downloadURL https://update.greasyfork.org/scripts/529737/Github%20Gist%20Compact%20View%20%28With%20Private%20Gists%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529737/Github%20Gist%20Compact%20View%20%28With%20Private%20Gists%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("UserScript GitHub Gist Compact View started...");

    // Replace with your personal access token (PAT)
    const personalAccessToken = 'YOUR_PERSONAL_ACCESS_TOKEN_HERE';

    // Function to load the Gists and display them in the container
    function loadGists() {
        // Extract the username from the URL
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const username = pathParts.length > 0 ? pathParts[0] : null;

        if (!username) {
            console.warn("No username found in the URL.");
            return;
        }

        console.log(`Detected user: ${username}`);

        // Find the container to display the information
        const container = document.querySelector("#gist-pjax-container > div > div > div.col-9.col-md-9.col-12");

        if (!container) {
            console.warn("Container not found, will retry...");
            return;
        }

        // Avoid processing multiple times
        if (container.querySelector('.custom-gist-container')) {
            console.log("Already processed, skipping...");
            return;
        }

        fetch(`https://api.github.com/users/${username}/gists`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${personalAccessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(gists => {
            if (gists.length === 0) {
                console.warn("The user has no Gists.");
                return;
            }

            // Clear the container
            container.innerHTML = "";

            // Create a new container for the Gists
            const newContainer = document.createElement("div");
            newContainer.className = "custom-gist-container";
            newContainer.innerHTML = `<h3>Gists of ${username} (${gists.length})</h3><ul>`;

            // Add each Gist as a clickable link with visibility and last update date
            gists.forEach(gist => {
                const listItem = document.createElement("li");
                const gistLink = document.createElement("a");
                gistLink.href = gist.html_url;
                gistLink.target = "_blank";
                gistLink.textContent = gist.description || "No description";
                
                // Determine visibility (public or private)
                const visibility = gist.public ? 'Public' : 'Private';

                // Get the last update date or creation date
                const lastUpdated = new Date(gist.updated_at);
                const lastUpdatedDate = lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                // Append visibility and last update date
                listItem.innerHTML = `
                    ${gistLink.outerHTML} 
                    <span>(${visibility})</span> 
                    <span>Last updated: ${lastUpdatedDate}</span>
                `;
                newContainer.appendChild(listItem);
            });

            // Close the list and insert the new container into the page
            newContainer.innerHTML += "</ul>";
            container.appendChild(newContainer);
            console.log("New Gist view successfully inserted.");
        })
        .catch(error => console.error("Error loading Gists:", error));
    }

    // Function to check if we should run the script
    function checkAndRun() {
        // Only run on the main gists page (not on individual gist pages)
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        if (pathParts.length === 1) {
            loadGists();
        }
    }

    // Use MutationObserver to detect when the container appears
    const observer = new MutationObserver(() => {
        checkAndRun();
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run immediately on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndRun);
    } else {
        checkAndRun();
    }

    // Also run on page load (in case DOMContentLoaded already fired)
    window.addEventListener('load', checkAndRun);

    // Listen for PJAX navigation events (GitHub-specific)
    document.addEventListener('pjax:end', checkAndRun);

})();