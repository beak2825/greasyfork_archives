// ==UserScript==
// @name         4chan /pol/ Poster Count (Auto-updating)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Counts and displays all posters who made more than 1 reply in a thread. Auto-updates every minute. If you use 4chan-X or XT, hit Alt+X to show it.
// @author       LeafAnon
// @match        https://boards.4chan.org/pol/thread/*
// @grant        none
// @run-at       document-end
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/534031/4chan%20pol%20Poster%20Count%20%28Auto-updating%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534031/4chan%20pol%20Poster%20Count%20%28Auto-updating%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables
    let updateInterval = null;
    let lastPostCount = 0;
    let isAutoUpdateActive = false;
    let dialogElement = null;

    // Function to collect all unique IDs, their post counts, and flags
    function collectPosterIDs() {
        // Use a more specific selector to avoid counting duplicates
        // Select only IDs from the desktop version to avoid double counting
        const posterInfoElements = document.querySelectorAll('.postInfo.desktop .posteruid');
        const idCounts = {};
        const idFlags = {};

        console.log(`Found ${posterInfoElements.length} unique poster elements`);

        posterInfoElements.forEach(element => {
            // Extract the ID directly from the inner text
            const idText = element.textContent || element.innerText;
            const idMatch = idText.match(/ID: ([a-zA-Z0-9+/]+)/);

            if (idMatch && idMatch[1]) {
                const posterId = idMatch[1];

                // Increment post count
                idCounts[posterId] = (idCounts[posterId] || 0) + 1;

                // Find the flag for this post if not already stored
                if (!idFlags[posterId]) {
                    // Navigate up to find the postInfo container, then find the flag
                    const postInfo = element.closest('.postInfo') || element.closest('.postInfoM');
                    if (postInfo) {
                        // First try real flags
                        let flagElement = postInfo.querySelector('.flag');
                        let isMemeFlag = false;

                        // If no standard flag found, try for memeflags (bfl class)
                        if (!flagElement) {
                            flagElement = postInfo.querySelector('.bfl');
                            isMemeFlag = true;
                        }

                        if (flagElement) {
                            const flagTitle = flagElement.getAttribute('title');

                            // Get class differently based on flag type
                            let flagClass;
                            if (isMemeFlag) {
                                // For meme flags, get the second class (bfl-xx)
                                flagClass = flagElement.className.split(' ')[1];
                            } else {
                                // For standard flags, get the second class (flag-xx)
                                flagClass = flagElement.className.split(' ')[1];
                            }

                            idFlags[posterId] = {
                                title: flagTitle || '',
                                class: flagClass || '',
                                isMeme: isMemeFlag
                            };
                        }
                    }
                }
            }
        });

        console.log(`Found ${Object.keys(idCounts).length} unique IDs`);
        return { idCounts, idFlags };
    }

    // Function to sort IDs by post count and get all multi-posters
    function getMultiPosters(idCounts) {
        return Object.entries(idCounts)
            .filter(poster => poster[1] > 1) // Only include posters with more than 1 post
            .sort((a, b) => b[1] - a[1]);    // Sort by post count (highest first)
    }

    // Function to create and display a dialog with the results
    function displayResults(multiPosters, totalUnique, idFlags) {
        // Remove any existing dialog or update existing one
        if (dialogElement) {
            // Update existing dialog
            updateExistingDialog(multiPosters, totalUnique, idFlags);
            return;
        }

        // Create dialog container
        const dialog = document.createElement('div');
        dialog.id = 'id-counter-dialog';
        dialog.className = 'extPanel reply';
        dialog.style.position = 'fixed';
        dialog.style.top = '50px';
        dialog.style.right = '20px';
        dialog.style.width = '270px';  // Slightly wider
        dialog.style.maxHeight = '80vh'; // Limit maximum height
        dialog.style.overflowY = 'auto'; // Add scrolling if needed
        dialog.style.zIndex = '9999';
        dialog.style.opacity = '0.95';

        // Create header
        const header = document.createElement('div');
        header.className = 'postInfo';
        header.style.cursor = 'move';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';

        // Create header content with update status indicator
        const headerContent = document.createElement('span');
        headerContent.id = 'id-counter-header';
        headerContent.innerHTML = `<span>Multi-Posters (${totalUnique} unique IDs)</span>`;
        header.appendChild(headerContent);

        // Create controls container
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '5px';

        // Create auto-update toggle
        const autoUpdateToggle = document.createElement('span');
        autoUpdateToggle.id = 'auto-update-toggle';
        autoUpdateToggle.textContent = '🔄';
        autoUpdateToggle.title = 'Toggle auto-update (every 60s)';
        autoUpdateToggle.style.cursor = 'pointer';
        autoUpdateToggle.style.fontWeight = 'bold';
        autoUpdateToggle.style.opacity = '0.5'; // Start inactive
        autoUpdateToggle.onclick = toggleAutoUpdate;
        controls.appendChild(autoUpdateToggle);

        // Create manual update button
        const updateButton = document.createElement('span');
        updateButton.textContent = '↻';
        updateButton.title = 'Update now';
        updateButton.style.cursor = 'pointer';
        updateButton.style.fontWeight = 'bold';
        updateButton.onclick = main;
        controls.appendChild(updateButton);

        // Create close button
        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.title = 'Close';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.fontSize = '20px';
        closeButton.style.lineHeight = '15px';
        closeButton.onclick = function() {
            stopAutoUpdate();
            document.body.removeChild(dialog);
            dialogElement = null;
        };
        controls.appendChild(closeButton);

        header.appendChild(controls);

        // Create content
        const content = document.createElement('div');
        content.className = 'message';
        content.style.padding = '10px';
        content.id = 'id-counter-content';

        // Create update status indicator
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'update-status-indicator';
        statusIndicator.style.fontSize = '10px';
        statusIndicator.style.color = '#999';
        statusIndicator.style.textAlign = 'right';
        statusIndicator.style.padding = '2px 5px';
        statusIndicator.style.borderTop = '1px solid #d9bfb7';
        statusIndicator.style.marginTop = '5px';
        content.appendChild(statusIndicator);

        // Create and populate the content
        populateDialogContent(content, multiPosters, totalUnique, idFlags);

        // Assemble dialog
        dialog.appendChild(header);
        dialog.appendChild(content);
        document.body.appendChild(dialog);
        dialogElement = dialog;

        // Make dialog draggable
        makeDraggable(dialog, header);

        // Update last post count tracker
        lastPostCount = document.querySelectorAll('.post').length;

        // Update the status indicator
        updateStatusIndicator();
    }

    // Function to populate dialog content
    function populateDialogContent(contentElement, multiPosters, totalUnique, idFlags) {
        // Clear existing content except the status indicator
        const statusIndicator = document.getElementById('update-status-indicator');
        contentElement.innerHTML = '';

        // Show message if no multi-posters
        if (multiPosters.length === 0) {
            contentElement.innerHTML = '<p>No posters with multiple posts found.</p>';
            if (statusIndicator) contentElement.appendChild(statusIndicator);
            return;
        }

        // Create table for multi-posters
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Add table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const rankHeader = document.createElement('th');
        rankHeader.textContent = 'Rank';
        rankHeader.style.textAlign = 'left';
        rankHeader.style.width = '40px';

        const flagHeader = document.createElement('th');
        flagHeader.textContent = 'Flag';
        flagHeader.style.textAlign = 'center';
        flagHeader.style.width = '30px';

        const idHeader = document.createElement('th');
        idHeader.textContent = 'ID';
        idHeader.style.textAlign = 'left';

        const postsHeader = document.createElement('th');
        postsHeader.textContent = 'Posts';
        postsHeader.style.textAlign = 'right';
        postsHeader.style.width = '40px';

        headerRow.appendChild(rankHeader);
        headerRow.appendChild(flagHeader);
        headerRow.appendChild(idHeader);
        headerRow.appendChild(postsHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Add table body with multi-posters
        const tbody = document.createElement('tbody');
        multiPosters.forEach((poster, index) => {
            const posterId = poster[0];
            const postCount = poster[1];
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = `${index + 1}.`;

            const flagCell = document.createElement('td');
            flagCell.style.textAlign = 'center';

            // Add flag if available
            if (idFlags[posterId]) {
                const flagSpan = document.createElement('span');
                if (idFlags[posterId].isMeme) {
                    // For meme flags
                    flagSpan.className = `bfl ${idFlags[posterId].class}`;
                } else {
                    // For standard flags
                    flagSpan.className = `flag ${idFlags[posterId].class}`;
                }
                flagSpan.title = idFlags[posterId].title || '';
                flagSpan.style.display = 'inline-block';
                flagCell.appendChild(flagSpan);
            }

            const idCell = document.createElement('td');
            idCell.textContent = posterId;

            const postsCell = document.createElement('td');
            postsCell.textContent = postCount;
            postsCell.style.textAlign = 'right';

            row.appendChild(rankCell);
            row.appendChild(flagCell);
            row.appendChild(idCell);
            row.appendChild(postsCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        contentElement.appendChild(table);

        // Re-add the status indicator
        if (statusIndicator) contentElement.appendChild(statusIndicator);
    }

    // Function to update existing dialog
    function updateExistingDialog(multiPosters, totalUnique, idFlags) {
        // Update header information
        const headerElement = document.getElementById('id-counter-header');
        if (headerElement) {
            headerElement.innerHTML = `<span>Multi-Posters (${totalUnique} unique IDs)</span>`;
        }

        // Update content
        const contentElement = document.getElementById('id-counter-content');
        if (contentElement) {
            populateDialogContent(contentElement, multiPosters, totalUnique, idFlags);
        }

        // Update last post count
        lastPostCount = document.querySelectorAll('.post').length;

        // Update the status indicator
        updateStatusIndicator();
    }

    // Function to update the status indicator
    function updateStatusIndicator() {
        const indicator = document.getElementById('update-status-indicator');
        if (indicator) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString();
            indicator.textContent = isAutoUpdateActive ?
                `Auto-update active | Last: ${timeStr}` :
                `Last updated: ${timeStr}`;
        }
    }

    // Function to toggle auto-update
    function toggleAutoUpdate() {
        if (isAutoUpdateActive) {
            stopAutoUpdate();
        } else {
            startAutoUpdate();
        }

        // Update visual indication
        const toggle = document.getElementById('auto-update-toggle');
        if (toggle) {
            toggle.style.opacity = isAutoUpdateActive ? '1' : '0.5';
        }

        // Update the status indicator
        updateStatusIndicator();
    }

    // Function to start auto-update
    function startAutoUpdate() {
        if (updateInterval) {
            clearInterval(updateInterval);
        }

        updateInterval = setInterval(checkForUpdates, 60000); // Check every 60 seconds
        isAutoUpdateActive = true;
        console.log("Auto-update started");
    }

    // Function to stop auto-update
    function stopAutoUpdate() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
        isAutoUpdateActive = false;
        console.log("Auto-update stopped");
    }

    // Function to check if there are new posts before updating
    function checkForUpdates() {
        const currentPostCount = document.querySelectorAll('.post').length;

        // Only update if there are new posts
        if (currentPostCount > lastPostCount) {
            console.log(`New posts detected (${currentPostCount - lastPostCount}), updating...`);
            main();
        } else {
            console.log("No new posts, skipping update");
            // Still update the timestamp
            updateStatusIndicator();
        }
    }

    // Function to make the dialog draggable
    function makeDraggable(element, dragHandle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Main function to execute when page is loaded
    function main() {
        console.log("Running ID counter main function");
        const { idCounts, idFlags } = collectPosterIDs();
        const totalUnique = Object.keys(idCounts).length;
        const multiPosters = getMultiPosters(idCounts);
        displayResults(multiPosters, totalUnique, idFlags);
    }

    // Add button to the thread to trigger the analysis
    function addButton() {
        console.log("Attempting to add ID Counter button");

        // Create our button elements
        const countButton = document.createTextNode('[');
        const button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.textContent = 'Count IDs';
        button.title = "Count and display unique poster IDs";
        button.onclick = main;
        const closeButton = document.createTextNode('] ');

        // Try multiple ways to insert the button for better compatibility

        // First attempt: Insert into navtopright
        const navTopRight = document.getElementById('navtopright');
        if (navTopRight) {
            // Directly insert at the beginning of navtopright
            navTopRight.insertBefore(closeButton, navTopRight.firstChild);
            navTopRight.insertBefore(button, navTopRight.firstChild);
            navTopRight.insertBefore(countButton, navTopRight.firstChild);
            console.log("Button added to navtopright");
            return;
        }

        // Second attempt: Try boardNavDesktop
        const boardNavDesktop = document.getElementById('boardNavDesktop');
        if (boardNavDesktop) {
            // Create a span to hold our button
            const buttonSpan = document.createElement('span');
            buttonSpan.style.marginLeft = '5px';
            buttonSpan.appendChild(countButton);
            buttonSpan.appendChild(button);
            buttonSpan.appendChild(closeButton);

            // Append to boardNavDesktop
            boardNavDesktop.appendChild(buttonSpan);
            console.log("Button added to boardNavDesktop");
            return;
        }

        // Final fallback: Create a floating button
        console.log("Creating floating button as fallback");
        const floatingButton = document.createElement('div');
        floatingButton.style.position = 'fixed';
        floatingButton.style.top = '10px';
        floatingButton.style.right = '10px';
        floatingButton.style.backgroundColor = '#f0e0d6';
        floatingButton.style.border = '1px solid #d9bfb7';
        floatingButton.style.padding = '5px 10px';
        floatingButton.style.zIndex = '9999';
        floatingButton.style.cursor = 'pointer';
        floatingButton.textContent = 'Count IDs';
        floatingButton.onclick = main;
        document.body.appendChild(floatingButton);
    }

    // Add a direct execution option for debugging
    function init() {
        console.log("4chan ID Counter script initialized");

        // Create direct keyboard shortcut to trigger the counter
        document.addEventListener('keydown', function(e) {
            // Alt+C to count IDs
            if (e.altKey && e.key === 'c') {
                console.log("Keyboard shortcut detected, running counter");
                main();
            }
        });

        // Add button with a slight delay to ensure page is ready
        setTimeout(addButton, 1000);

        // Also run immediately if URL contains a special parameter
        if (window.location.href.includes('autocount=true')) {
            console.log("Auto-count parameter detected");
            setTimeout(() => {
                main();
                // Also start auto-update if parameter is present
                startAutoUpdate();
            }, 1500);
        }
    }

    // Load required CSS for flags if not already present
    function ensureFlagCSSLoaded() {
        // Check if flag CSS is already loaded
        const flagCSSExists = Array.from(document.styleSheets).some(sheet => {
            try {
                return sheet.href && (sheet.href.includes('flags.css') || sheet.href.includes('flags.2.css'));
            } catch (e) {
                return false;
            }
        });

        if (!flagCSSExists) {
            console.log("Adding flag CSS");
            const flagCSS = document.createElement('link');
            flagCSS.rel = 'stylesheet';
            flagCSS.href = '//s.4cdn.org/css/flags.690.css';
            document.head.appendChild(flagCSS);

            const polFlagCSS = document.createElement('link');
            polFlagCSS.rel = 'stylesheet';
            polFlagCSS.href = '//s.4cdn.org/image/flags/pol/flags.2.css';
            document.head.appendChild(polFlagCSS);
        }
    }

    // Initialize the script
    ensureFlagCSSLoaded();
    init();
})();