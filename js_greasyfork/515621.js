// ==UserScript==
// @name         YouTube Simpler Homepage
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Only show one recommended video at a time with navigation buttons.
// @author       Maksi
// @match        https://www.youtube.com/
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515621/YouTube%20Simpler%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/515621/YouTube%20Simpler%20Homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for grid and buttons
    GM_addStyle(`
        ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 1 !important;
        }
        ytd-feed-filter-chip-bar-renderer[fluid-width] #chips-content.ytd-feed-filter-chip-bar-renderer {
            max-width: fit-content !important;
        }

        .nav-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            background-color: #333;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            border: 1px solid #d3d3d3;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
            margin-top: 20px;
            margin-bottom: 20px;
            width: calc(100% - 20px);
            box-shadow: none;
        }
        .nav-button:hover {
            background-color: #555;
            border-color: #a3a3a3;
        }
        .nav-button.disabled {
            background-color: #666;
            color: #aaa;
            border-color: #666;
            cursor: not-allowed;
        }

        ytd-menu-renderer {
            display: none !important;
        }

        /* Expand container so buttons are visible */
        #content.style-scope.ytd-app {
            display: flex;
            flex-direction: column;
            min-height: 100vh; /* Ensure full viewport height */
            padding-bottom: 20px; /* Add padding to ensure button visibility */
        }

        /* Fix stretching by overriding height */
        #content.style-scope.ytd-rich-item-renderer {
            height: auto !important; /* Only use as much height as needed */
        }
    `);

    let optionsButtonClicked = false;

    // Function to hide the current video and show the previous one
    function showPreviousVideo(currentVideo) {
        const videos = Array.from(document.querySelectorAll("ytd-rich-item-renderer"));
        const currentIndex = videos.indexOf(currentVideo);

        if (currentIndex > 0) {
            currentVideo.style.display = "none"; // Hide current video
            // Show the previous visible video
            for (let i = currentIndex - 1; i >= 0; i--) {
                videos[i].style.display = "";
                const style = window.getComputedStyle(videos[i]);
                if (!style.display.includes("none")) {
                    const popups = document.querySelector("ytd-popup-container");
                    const menu = currentVideo.querySelector("tp-yt-iron-dropdown");
                    if (popups && menu) {
                        popups.appendChild(menu);
                    }
                    optionsButtonClicked = false;
                    break;
                }
            }
        }
    }

    // Function to hide the current video and show the next one
    function showNextVideo(currentVideo) {
        const videos = Array.from(document.querySelectorAll("ytd-rich-item-renderer"));
        const currentIndex = videos.indexOf(currentVideo);

        if (currentIndex !== -1) {
            currentVideo.style.display = "none"; // Hide current video

            if (currentIndex + 1 == videos.length) {
                const continuationItem = document.querySelector("ytd-continuation-item-renderer");
                if (continuationItem) {
                    continuationItem.style.display = ""; // Unhide the continuation item
                    return;
                }
            }

            // Show the next visible video
            for (let i = currentIndex + 1; i < videos.length; i++) {
                videos[i].style.display = ""; // Show next video
                const style = window.getComputedStyle(videos[i]);
                if (!style.display.includes("none")) {
                    const popups = document.querySelector("ytd-popup-container");
                    const menu = currentVideo.querySelector("tp-yt-iron-dropdown");
                    if (popups && menu) {
                        popups.appendChild(menu);
                    }
                    optionsButtonClicked = false;
                    break; // Exit the loop after showing the next video
                }
            }
        }
    }

    function addMenu(video) {
        const optionsButton = video.querySelector("ytd-rich-grid-media div#menu ytd-menu-renderer yt-icon-button#button.dropdown-trigger button#button.style-scope.yt-icon-button");

        if (optionsButton) {
            // Create a new mouse event
            optionsButton.click();
            optionsButtonClicked = true;

            const popupsObserver = new MutationObserver(() => {
                const menu = document.querySelector("tp-yt-iron-dropdown.ytd-popup-container");
                const contentWrapper = menu?.querySelector("#contentWrapper");

                if (menu && contentWrapper && contentWrapper.children.length > 0) {

                    // Append the cloned menu to the video container
                    video.appendChild(menu);

                    // Immediately set the CSS styles after appending
                    setTimeout(() => {
                        menu.style.position = "absolute"; // Make it position absolute
                        menu.style.top = "50%"; // Align it vertically to the middle
                        menu.style.left = "100%"; // Position it to the right of the video
                        menu.style.transform = "translateY(-50%)"; // Center it vertically
                        menu.style.zIndex = "1000"; // Bring it above other elements
                        menu.style.width = "auto"; // Set the width as needed
                        menu.style.padding = "10px"; // Add padding to the menu
                        menu.style.pointerEvents = "auto";
                        menu.style.setProperty("display", "inline", "important");
                    }, 0);

                    // Disconnect the observer once the menu is successfully moved
                    popupsObserver.disconnect();
                } else {
                    console.log("Menu or contentWrapper not found or empty. Waiting...");
                }
            });

            // Start observing the menu for changes
            const popups = document.querySelector("ytd-popup-container");
            if (popups) {
                popupsObserver.observe(popups, { attributes: true, childList: true, subtree: true });
            } else {
                console.log("Popup Container not found.");
            }
        }
    }

    // Wait until the page is fully loaded
    window.addEventListener("load", function() {
        // Create an observer to monitor changes in the body
        const observer = new MutationObserver(() => {
            const recommendedVideos = document.querySelectorAll("ytd-rich-item-renderer");
            const continuationItem = document.querySelector("ytd-continuation-item-renderer");

            if (recommendedVideos.length) {
                if (continuationItem) {
                    continuationItem.style.display = "none"; // Hide the continuation item
                }


                // Track if we found a visible video

                let firstVisibleVideoFound = false;
                recommendedVideos.forEach((video, index) => {

                    const style = window.getComputedStyle(video);

                    // Check if the video is already hidden
                    if (!style.display.includes("none")) {

                        // Create a "Next Video" button if it doesn't exist
                        if (!video.querySelector('.next-button')) {
                            const nextButton = document.createElement('button');
                            nextButton.className = 'nav-button next-button';
                            nextButton.innerText = 'Next Video';
                            nextButton.onclick = () => showNextVideo(video);
                            video.appendChild(nextButton);
                        }

                        // Create a "Previous Video" button if it doesn't exist
                        if (!video.querySelector('.previous-button')) {
                            const prevButton = document.createElement('button');
                            prevButton.className = 'nav-button previous-button';
                            prevButton.innerText = 'Previous Video';
                            if (!firstVisibleVideoFound) {
                                prevButton.classList.add('disabled'); // Disable if it's the first video
                            } else {
                                prevButton.onclick = () => showPreviousVideo(video);
                            }
                            video.insertBefore(prevButton, video.firstChild);
                        }

                        // Hide all but the first visible video
                        if (firstVisibleVideoFound) {
                            video.style.display = "none";
                        } else {
                            firstVisibleVideoFound = true;

                            if (optionsButtonClicked == false) {
                                addMenu(video);
                            }

                            const menu = video.querySelector("tp-yt-iron-dropdown");
                            if (menu) {
                                menu.style.position = "absolute"; // Make it position absolute
                                menu.style.top = "50%"; // Align it vertically to the middle
                                menu.style.left = "100%"; // Position it to the right of the video
                                menu.style.transform = "translateY(-50%)"; // Center it vertically
                                menu.style.zIndex = "1000"; // Bring it above other elements
                                menu.style.width = "auto"; // Set the width as needed
                                menu.style.padding = "10px"; // Add padding to the menu
                                menu.style.pointerEvents = "auto";
                                menu.style.setProperty("display", "inline", "important");
                            }
                        }
                    }
                });
            }
        });

        // Start observing the body for changes
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    });
})();
