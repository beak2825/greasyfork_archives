// ==UserScript==
// @name         Small Cams Stumblechat
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Makes stumblechat webcams 320x240
// @author       You
// @match        https://stumblechat.com/*
// @grant        GM_addStyle
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/524372/Small%20Cams%20Stumblechat.user.js
// @updateURL https://update.greasyfork.org/scripts/524372/Small%20Cams%20Stumblechat.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log("Script started.");

    // Add styles using GM_addStyle for compacting video wrappers and camera badges
    let css = `
        #videos-content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
        }
        .videos-items > .js-video {
            width: 100%;
        }
        .video-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
        }
        #regularvideos {
            display: grid;
            grid-template-columns: repeat(5, 320px);  // 5 columns of 320px each
            grid-template-rows: repeat(5, 240px);  // 5 rows of 240px each
            gap: 5px;
            width: 100%;
            height: 100%;
        }
        .video-cell {
            box-sizing: border-box;
            position: relative;
        }
        .video-badge {
            width: 16px;
            height: 16px;
            background-image: url(../styles/svg/webcam.svg);
            background-position: center center;
            background-repeat: no-repeat;
            position: absolute;
            top: 5px;
            left: 5px;
        }
    `;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    // Create a 5x5 grid table for webcam videos
    const videosContent = document.getElementById("videos-content");

    // Adjust positioning of the videos-content div
    videosContent.style.position = 'absolute';
    videosContent.style.bottom = '0';
    videosContent.style.left = '0';
    videosContent.style.width = '100%';

    const table = document.createElement("table");
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    // Create rows and cells in a 5x5 grid (320x240 per cell)
    for (let i = 0; i < 5; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("td");
            cell.style.padding = '5px';
            cell.style.textAlign = 'center';
            cell.style.border = '1px solid #ddd';
            cell.style.height = '240px';
            cell.style.width = '320px';
            cell.classList.add('video-cell');
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Insert the table into the "regularvideos" div inside the "videos-content" container
    const regularVideosDiv = videosContent.querySelector("#regularvideos");
    if (!regularVideosDiv) {
        console.error("Could not find #regularvideos container.");
        return;
    }
    regularVideosDiv.appendChild(table);

    // Function to find the first empty cell in the grid
    function findEmptyCell() {
        const cells = table.getElementsByTagName("td");
        for (let cell of cells) {
            if (!cell.hasChildNodes()) {
                return cell;
            }
        }
        return null; // If no empty cells are found
    }

    // Function to add the camera badge
    function addCameraBadge(userElement) {
        const videoBadge = document.createElement('div');
        videoBadge.classList.add('video-badge');
        const statusElement = userElement.querySelector('.status');
        if (statusElement) {
            statusElement.appendChild(videoBadge); // Append it to the user's status element
        }
    }

    // MutationObserver to monitor DOM for video-wrapper additions
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('js-video') && !node.classList.contains('hidden')) {
                    console.log("New video-wrapper detected:", node);

                    // Modify the video element within the wrapper
                    const videoElement = node.querySelector('video');
                    if (videoElement) {
                        console.log("Video element found:", videoElement);

                        // Find an empty cell in the 5x5 grid and place the entire video wrapper
                        const emptyCell = findEmptyCell();
                        if (emptyCell) {
                            console.log("Placing video wrapper in empty cell...");
                            // Move the entire js-video element into the table cell
                            emptyCell.appendChild(node);

                            // Ensure the video takes up 100% of the cell's width and height
                            videoElement.style.width = '100%';
                            videoElement.style.height = '100%';

                            // Adjust video wrapper styles if needed
                            const videoWrapper = node.querySelector('.video-wrapper');
                            if (videoWrapper) {
                                videoWrapper.style.width = '100%';
                                videoWrapper.style.height = '100%';
                            }

                            // Add camera badge if the user has their camera on
                            const userElement = node.closest('.user-item'); // Replace with the correct selector for user elements
                            const cameraStatus = userElement ? userElement.getAttribute('data-camera-status') : null; // Replace with the appropriate attribute or logic
                            if (cameraStatus === 'active') { // Check if camera is active
                                addCameraBadge(userElement);
                            }
                        }

                    } else {
                        console.warn("No video element found inside video-wrapper.");
                    }
                }
            });
        });
    });

    // Start observing the DOM
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    console.log("Observer initialized. Watching for js-video elements.");

    // Adding placeholder if needed (ensure vertical <br> appears in empty cells)
    function addPlaceholders() {
        const cells = table.getElementsByTagName("td");
        for (let cell of cells) {
            if (!cell.hasChildNodes()) {
                const placeholder = document.createElement('br');
                cell.appendChild(placeholder);
            }
        }
    }

    // Periodically check for empty cells and add placeholders
    setInterval(addPlaceholders, 1000);

})();
