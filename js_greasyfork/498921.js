// ==UserScript==
// @name         GaiaOnline Quick View ModDog Comments
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      1.0
// @description  Quick view comments on GaiaOnline entries
// @author       kloob
// @match        https://www.gaiaonline.com/moddog/note/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498921/GaiaOnline%20Quick%20View%20ModDog%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/498921/GaiaOnline%20Quick%20View%20ModDog%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show the popup box
    function showPopup(link, event) {
        event.preventDefault(); // Prevent the default action of the link

        // Extract entry ID from the link URL
        const entryId = extractEntryId(link.href);

        // Create the note view URL
        const noteViewUrl = `https://www.gaiaonline.com/moddog/note/view/${entryId}`;

        // Create the popup background overlay
        let popupOverlay = document.createElement('div');
        popupOverlay.style.position = 'fixed';
        popupOverlay.style.top = 0;
        popupOverlay.style.left = 0;
        popupOverlay.style.width = '100%';
        popupOverlay.style.height = '100%';
        popupOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        popupOverlay.style.zIndex = 1000;
        popupOverlay.addEventListener('click', () => {
            document.body.removeChild(popupBox);
            document.body.removeChild(popupOverlay);
        });
        document.body.appendChild(popupOverlay);

        // Create the popup box
        let popupBox = document.createElement('div');
        popupBox.style.position = 'fixed';
        popupBox.style.top = '50%'; // Center vertically
        popupBox.style.left = '50%';
        popupBox.style.transform = 'translate(-50%, -50%)';
        popupBox.style.backgroundColor = '#fff';
        popupBox.style.padding = '0'; // Removed padding to minimize extra space
        popupBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        popupBox.style.zIndex = 1001;
        popupBox.style.overflowY = 'auto'; // Add scrollbar for overflow content
        popupBox.style.maxHeight = '80vh'; // Limit height to 80% of viewport height
        popupBox.style.width = '80%'; // Set the width to 80% of the viewport
        popupBox.style.borderRadius = '10px 10px 0 0'; // Rounded top corners

        // Create fixed header with green background
        let header = document.createElement('div');
        header.style.position = 'sticky'; // Sticky to stay fixed within popupBox
        header.style.top = '0';
        header.style.padding='3px'
        header.style.backgroundColor = '#339966'; // Header background color
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        header.style.zIndex = 1002; // Ensure header is above popupBox
        header.style.borderRadius = '10px 10px 0 0'; // Rounded top corners
        header.style.textAlign = 'center'; // Center align text

        // Fetch page content to scrape details
        const url = `https://www.gaiaonline.com/moddog/note/view/${entryId}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const html = new DOMParser().parseFromString(response.responseText, "text/html");
                const details = scrapeDetails(html);

                // Create link to note page
                let noteLink = document.createElement('a');
                noteLink.href = noteViewUrl;
                noteLink.target = '_blank'; // Open in new tab
                noteLink.textContent = `View Note in New Tab ↗`;
                noteLink.style.marginRight = '10px';
                noteLink.style.color = '#fff'; // Text color
                header.appendChild(noteLink);

                // Create close button (X icon)
                let closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;'; // X icon
                closeButton.style.fontSize = '20px';
                closeButton.style.backgroundColor = 'transparent';
                closeButton.style.border = 'none';
                closeButton.style.cursor = 'pointer';
                closeButton.style.color = '#fff'; // Text color
                closeButton.style.float = 'right'; // Align to right
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(popupBox);
                    document.body.removeChild(popupOverlay);
                });
                header.appendChild(closeButton);

                // Create title for the popupBox with entry details
                const title = document.createElement('div');
                title.style.fontSize = '1.2em';
                title.style.marginBottom = '10px';
                title.style.color = '#fff'; // Text color
                title.textContent = `${details.action} | ${details.flag} @ ${details.date}` ;
                header.appendChild(title);


                // Append fixed header to popupBox
                popupBox.appendChild(header);

                // Scrape comments and append them to popupBox
                const comments = scrapeComments(html);
                const commentsTable = createCommentsTable(comments);
                popupBox.appendChild(commentsTable);
            },
            onerror: function(error) {
                console.error("Error fetching page:", error);
            }
        });

        document.body.appendChild(popupBox);
    }

    // Function to extract entry ID from URL
    function extractEntryId(url) {
        const match = url.match(/\/note\/view\/(\d+)/);
        return match ? match[1] : null;
    }

    // Function to scrape details from the HTML structure
    function scrapeDetails(html) {
        const table = html.querySelector('#notedetail');
        if (!table) {
            console.error("Detail table not found");
            return {};
        }

        const details = {};
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const keyElement = row.querySelector('.fname');
            const valueElement = row.querySelector('.fval');

            if (keyElement && valueElement) {
                const key = keyElement.innerText.trim();
                let value = valueElement.innerText.trim();

                // Special case for User link extraction
                if (key === 'User') {
                    const userLink = valueElement.querySelector('a');
                    if (userLink) {
                        value = userLink.innerText.trim();
                    }
                }

                details[key.toLowerCase()] = value; // Store details in lowercase keys
            }
        });

        return details;
    }

    // Function to create comments table
    function createCommentsTable(comments) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const tbody = document.createElement('tbody');

        // Table headers
        const headers = ['Comment ID', 'Last Updated', 'Moderator', 'Comment'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerCell.style.border = '1px solid #ccc';
            headerCell.style.padding = '8px';
            headerCell.style.backgroundColor = '#f2f2f2';
            headerRow.appendChild(headerCell);
        });
        tbody.appendChild(headerRow);

        // Table rows for comments
        comments.forEach(comment => {
            const row = document.createElement('tr');
            Object.values(comment).forEach(value => {
                const cell = document.createElement('td');
                cell.innerHTML = value; // Use innerHTML to render links and line breaks
                cell.style.border = '1px solid #ccc';
                cell.style.padding = '8px';
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        return table;
    }

    // Function to scrape comments from the HTML structure
    function scrapeComments(html) {
        const table = html.querySelector('#notecomments');
        if (!table) {
            console.error("Comments table not found");
            return [];
        }

        const rows = table.querySelectorAll('tr.rowoff, tr.rowon');
        const comments = [];

        rows.forEach(row => {
            const commentIdElement = row.querySelector('.cid');
            const lastUpdatedElement = row.querySelector('.date');
            const moderatorElement = row.querySelector('.moderator a');
            const commentElement = row.querySelector('.comment');

            if (commentIdElement && lastUpdatedElement && moderatorElement && commentElement) {
                const commentId = commentIdElement.innerText.trim();
                const lastUpdated = lastUpdatedElement.innerText.trim();
                const moderator = moderatorElement.innerText.trim();
                const comment = commentElement.innerHTML.trim(); // Use innerHTML to preserve links and line breaks

                comments.push({
                    'Comment ID': commentId,
                    'Last Updated': lastUpdated,
                    'Moderator': moderator,
                    'Comment': comment
                });
            } else {
                console.log("Missing element in comment row:", row);
            }
        });

        return comments;
    }

    // Add event listener to each link in the "key" column
    const links = document.querySelectorAll('td#key a');
    links.forEach(link => {
        link.addEventListener('click', (event) => showPopup(link, event));
    });
})();
