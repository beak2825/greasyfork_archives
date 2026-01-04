// ==UserScript==
// @name         YouTube AutoPlaylist Manager
// @namespace    http://tampermonkey.net/
// @version      1.3.13
// @description  Create a custom YouTube playlist and play videos automatically in sequence with countdown and pause option. client download link https://www.icloud.com/shortcuts/86fd7faf174845a8b07090a703a196bf
// @author       looz38
// @license      CC BY-NC 4.0
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521222/YouTube%20AutoPlaylist%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/521222/YouTube%20AutoPlaylist%20Manager.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const PLAYLIST_KEY = "Custom_playlist"; // LocalStorage key for playlist
    // JSONBin Configuration
    const JSONBIN_API_URL = "https://api.jsonbin.io/v3/b"; // JSONBin API URL
    const collectionId = "6773978cad19ca34f8e37887";
    const JSONBIN_API_KEY =
        "$2a$10$ZNuWfqMh1EHdAOran5uwH.EhsrZkFvD7bnobdc6/6m0jPJaebLaVK"; // Replace with your JSONBin API Key

    // Update MutationObserver to include the new button
    const observer = new MutationObserver(() => {
        addItemToVideos();
        playNextButton();
        showPlaylistButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Utility: Get playlist from localStorage
    function getPlaylist() {
        return JSON.parse(localStorage.getItem(PLAYLIST_KEY) || "[]");
    }

    // Utility: Save playlist to localStorage
    function savePlaylist(playlist) {
        localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlist));
    }

    // Utility: Remove the first video from the playlist
    function popFromPlaylist() {
        const playlist = getPlaylist();
        if (playlist.length > 0) {
            const nextVideo = playlist.shift();
            savePlaylist(playlist);
            return nextVideo;
        }
        return null;
    }

    // Utility: Add a video to the playlist and remove the "Add to Playlist" button
    function addToPlaylist(videoId, title, videoType, button) {
        if (!videoId) {
            alert("Error: Video ID is missing!");
            return;
        }
        title = title || `Video (${videoId})`;
        const playlist = getPlaylist();

        // Check for duplicates
        const isDuplicate = playlist.some((video) => video.videoId === videoId);
        if (isDuplicate) {
            alert("This video is already in the playlist!");
            return;
        }

        playlist.push({ videoId, title, videoType });
        savePlaylist(playlist);

        if (button) {
            button.remove();
        }
    }

    function extractVideoId(link) {
        try {
            const url = new URL(link.href, window.location.origin);
            if (url.pathname.includes("/shorts/")) {
                return url.pathname.split("/shorts/")[1];
            } else {
                return url.searchParams.get("v");
            }
        } catch (error) {
            console.error("Invalid link:", link.href, error);
            return null; // Return null if unable to parse
        }
    }

    function extractTitle(link) {
        try {
            // Check if it is a Shorts video
            const isShorts = new URL(
                link.href,
                window.location.origin
            ).pathname.includes("/shorts/");

            if (isShorts) {
                // For Shorts video, find the parent title element
                const parentRenderer = link.closest(
                    "ytd-rich-item-renderer, ytm-shorts-lockup-view-model-v2"
                );
                const titleElement = parentRenderer?.querySelector(
                    'h3 a[title], h3 span[role="text"]'
                );
                return titleElement?.textContent.trim() || "Untitled Video";
            } else {
                // For regular videos, continue using the existing logic
                const titleElement = link
                    .closest("ytd-rich-item-renderer, ytd-video-renderer")
                    ?.querySelector("#video-title");
                return titleElement?.textContent.trim() || "Untitled Video";
            }
        } catch (error) {
            console.error("Error extracting title:", link.href, error);
            return "Untitled Video";
        }
    }

    // Add "Add to Playlist" button to each video thumbnail
    function addItemToVideos() {
        const videoLinks = document.querySelectorAll(
            '#thumbnail, a[href*="/shorts/"]'
        );
        videoLinks.forEach((link) => {
            if (!link.dataset.playlistButtonAdded) {
                link.dataset.playlistButtonAdded = true; // Avoid adding duplicate buttons

                const videoId = extractVideoId(link);
                const title = extractTitle(link);
                const videoType = link.href.includes("/shorts/") ? "shorts" : "regular";

                // Create "Add to Playlist" button
                const button = document.createElement("button");
                button.textContent = "Add to Playlist";
                button.style.cssText = `
                    position: absolute;
                    bottom: 5px;
                    left: 5px;
                    z-index: 999;
                    padding: 5px;
                    font-size: 10px;
                    background-color: #FF00005C;
                    color: white;
                    border: none;
                    cursor: pointer;
                `;
                button.onclick = (e) => {
                    e.preventDefault();
                    addToPlaylist(videoId, title, videoType, button); // Pass the videoType
                };

                // Append button to the video thumbnail
                link.parentElement.style.position = "relative";
                link.parentElement.appendChild(button);
            }
        });
    }

    // Add "Play Playlist" button near the search box
    function playNextButton() {
        const searchBox = document.querySelector(
            ".ytSearchboxComponentSearchButton"
        );
        if (searchBox && !document.querySelector("#play-playlist-button")) {
            const buttonContainer = document.createElement("div");
            buttonContainer.id = "button-container";
            buttonContainer.style.cssText = `
                display: flex;
                gap: 4px;
                position: absolute;
                top: 28%;
                left: 12%;
            `;

            const playNextButton = document.createElement("button");
            playNextButton.id = "play-playlist-button";
            playNextButton.textContent = "Next";
            playNextButton.style.cssText = `
                padding: 5px 10px;
                background-color: #FF0000;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 7px;
                width: 68px;
            `;
            playNextButton.onclick = () => {
                const nextVideo = popFromPlaylist();
                if (nextVideo) {
                    window.open(
                        `https://www.youtube.com/watch?v=${nextVideo.videoId}`,
                        "_blank"
                    );
                } else {
                    alert("The playlist is empty!");
                }
            };

            const addCurrentVideoButton = document.createElement("button");
            addCurrentVideoButton.id = "add-current-video-button";
            addCurrentVideoButton.textContent = "Append";
            addCurrentVideoButton.style.cssText = `
                padding: 5px 10px;
                background-color: #28a745;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 7px;
                width: 68px;
            `;
            addCurrentVideoButton.onclick = () => {
                const videoId = new URLSearchParams(window.location.search).get("v");
                const title =
                    document
                        .querySelector(
                            "h1.style-scope.ytd-watch-metadata yt-formatted-string"
                        )
                        ?.textContent.trim() || "Untitled Video";
                const videoType = window.location.href.includes("/shorts/")
                    ? "shorts"
                    : "regular";
                addToPlaylist(videoId, title, videoType);
            };

            buttonContainer.appendChild(playNextButton);
            buttonContainer.appendChild(addCurrentVideoButton);

            const masthead = document.querySelector("ytd-masthead");
            if (masthead) {
                masthead.appendChild(buttonContainer);
            }
        }
    }

    // Fetch the latest playlist from JSONBin
    async function fetchLatestPlaylistFromJSONBin() {
        try {
            const binId = localStorage.getItem("jsonBinId");
            if (!binId) {
                alert("No playlist found to sync!");
                return null;
            }

            const response = await fetch(`${JSONBIN_API_URL}/${binId}/latest`, {
                headers: {
                    "X-Access-Key": JSONBIN_API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch playlist: ${response.statusText}`);
            }

            const data = await response.json();
            return data.record;
        } catch (error) {
            console.error("Error fetching playlist from JSONBin:", error);
            return null;
        }
    }

    // Add "View Playlist" button near the search box
    function showPlaylistButton() {
        const searchBox = document.querySelector(
            ".ytSearchboxComponentSearchButton"
        );
        if (searchBox && !document.querySelector("#view-playlist-button")) {
            const buttonContainer = document.querySelector("#button-container");

            const viewPlaylistButton = document.createElement("button");
            viewPlaylistButton.id = "view-playlist-button";
            viewPlaylistButton.textContent = "List";
            viewPlaylistButton.style.cssText = `
                padding: 5px 10px;
                background-color: #007BFF;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 7px;
                width: 68px;
            `;
            viewPlaylistButton.onclick = showPlaylistUI;

            const syncPlaylistButton = document.createElement("button");
            syncPlaylistButton.id = "sync-playlist-button";
            syncPlaylistButton.textContent = "Sync";
            syncPlaylistButton.style.cssText = `
                padding: 5px 10px;
                background-color: #17a2b8;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 7px;
                width: 68px;
            `;
            syncPlaylistButton.onclick = async () => {
                const latestPlaylist = await fetchLatestPlaylistFromJSONBin();
                if (latestPlaylist) {
                    savePlaylist(latestPlaylist);
                    alert("Playlist synced successfully!");
                } else {
                    alert("Failed to sync playlist!");
                }
            };

            buttonContainer.appendChild(viewPlaylistButton);
            buttonContainer.appendChild(syncPlaylistButton);
        }
    }

    // Function to show the playlist UI (floating div with video list)
    function showPlaylistUI() {
        // Check if the UI is already added
        if (document.querySelector("#custom-playlist-ui")) return;

        // Create the UI container for the playlist
        const playlistContainer = document.createElement("div");
        playlistContainer.id = "custom-playlist-ui";
        playlistContainer.style.cssText = `
            position: fixed;
            top: 6%;
            left: 10px;
            width: 320px;
            max-height: 80%;
            overflow-y: auto;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        playlistContainer.style.scrollbarWidth = "thick"; // For Firefox
        playlistContainer.style.scrollbarColor = "#888 #ccc"; // For Firefox

        // Prevent page scrolling when the playlist UI is open
        document.body.style.overflow = "hidden";

        // Add a title to the container
        const title = document.createElement("h3");
        title.textContent = "Playlist";
        title.style.cssText = "margin-top: 0; text-align: center;";
        playlistContainer.appendChild(title);

        // Add the playlist items
        const playlist = getPlaylist();
        const list = document.createElement("ul");
        list.style.cssText = "list-style-type: none; padding: 0; margin: 0;";
        list.id = "playlist-items";
        playlist.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
                cursor: pointer;
            `;
            listItem.draggable = true;
            listItem.dataset.index = index;
            listItem.textContent = `${index + 1}. ${item.title}`;

            if (item.videoType === "shorts") {
                listItem.style.color = "blue";
            }

            // Play the selected video on click
            listItem.onclick = () => {
                const baseUrl =
                    item.videoType === "shorts"
                        ? "https://www.youtube.com/shorts/"
                        : "https://www.youtube.com/watch?v=";
                window.location.href = baseUrl + item.videoId;

                // Remove the video from the playlist
                const updatedPlaylist = getPlaylist();
                updatedPlaylist.splice(index, 1);
                savePlaylist(updatedPlaylist);

                // Refresh the UI
                playlistContainer.remove();
                showPlaylistUI();
            };

            // Add delete button to each item
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.cssText = `
                margin-left: 10px;
                padding: 2px 5px;
                background-color: #FF0000;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 3px;
            `;
            deleteButton.onclick = (e) => {
                e.stopPropagation(); // Prevent triggering the play action
                const updatedPlaylist = getPlaylist();
                updatedPlaylist.splice(index, 1);
                savePlaylist(updatedPlaylist);

                // Refresh the UI
                playlistContainer.remove();
                showPlaylistUI();
            };

            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
        playlistContainer.appendChild(list);

        // Add QR Code button
        const qrButton = document.createElement("button");
        qrButton.textContent = "Generate QR Code";
        qrButton.style.cssText = `
            display: block;
            margin: 10px auto;
            padding: 5px 10px;
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 3px;
        `;
        qrButton.onclick = () => generateQRCode(playlist);
        playlistContainer.appendChild(qrButton);

        // Append the container to the body
        document.body.appendChild(playlistContainer);

        // Close the UI when clicking outside
        function handleClickOutside(event) {
            if (!playlistContainer.contains(event.target)) {
                playlistContainer.remove();
                document.removeEventListener("click", handleClickOutside);
                document.body.style.overflow = ""; // Restore page scrolling
            }
        }

        // Add event listener to detect outside clicks
        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 100); // Add a 100ms delay to prevent immediate closure

        // Add drag-and-drop functionality
        const playlistItems = document.getElementById("playlist-items");
        let draggedItem = null;

        playlistItems.addEventListener("dragstart", (e) => {
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/html", e.target.innerHTML);
        });

        playlistItems.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        playlistItems.addEventListener("drop", (e) => {
            e.stopPropagation();
            if (draggedItem && draggedItem !== e.target) {
                const fromIndex = parseInt(draggedItem.dataset.index, 10);
                const toIndex = parseInt(e.target.dataset.index, 10);

                const updatedPlaylist = getPlaylist();
                const [movedItem] = updatedPlaylist.splice(fromIndex, 1);
                updatedPlaylist.splice(toIndex, 0, movedItem);
                savePlaylist(updatedPlaylist);

                // Refresh the UI
                playlistContainer.remove();
                showPlaylistUI();
            }
            draggedItem = null;
        });
    }

    // Generate QR Code for playlist JSON URL
    async function generateQRCode(playlist) {
        const playlistUrl = await uploadPlaylistToJSONBin(playlist);

        if (!playlistUrl) {
            return; // Abort if upload fails
        }

        // Create the QR Code UI
        const qrContainer = document.createElement("div");
        qrContainer.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        // Create the QR code image
        const qrImage = document.createElement("img");
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            playlistUrl
        )}&size=300x300`;
        qrContainer.appendChild(qrImage);

        // Add a close button for the QR Code popup
        const closeQrButton = document.createElement("button");
        closeQrButton.textContent = "Close";
        closeQrButton.style.cssText = `
            display: block;
            margin: 10px auto;
            padding: 5px 10px;
            background-color: #FF0000;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 3px;
        `;
        closeQrButton.onclick = () => qrContainer.remove();
        qrContainer.appendChild(closeQrButton);

        // Append the QR Code container to the body
        document.body.appendChild(qrContainer);
    }

    // Automatically play the next video when one ends with countdown
    function autoPlayNextVideo() {
        const videoElement = document.querySelector("video");
        if (videoElement) {
            videoElement.addEventListener("ended", () => {
                const nextVideo = popFromPlaylist();
                if (nextVideo) {
                    startCountdown(nextVideo); // Start countdown before autoplaying
                }
            });
        }
    }

    // Start a countdown before automatically playing the next video
    function startCountdown(nextVideo) {
        const countdownContainer = document.createElement("div");
        countdownContainer.id = "countdown-container";
        countdownContainer.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 20px;
            border-radius: 5px;
            z-index: 9999;
        `;
        document.body.appendChild(countdownContainer);

        let countdownTime = 8; // Set countdown time to 8 seconds
        let isCountdownPaused = false; // Flag to track pause state
        let timeoutId;

        // Add "Pause" button to stop the countdown
        const pauseButton = document.createElement("button");
        pauseButton.textContent = "Pause AutoPlay";
        pauseButton.style.cssText = `
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #FF0000;
            color: white;
            border: none;
            cursor: pointer;
        `;
        pauseButton.onclick = () => {
            isCountdownPaused = !isCountdownPaused;
            pauseButton.textContent = isCountdownPaused
                ? "Resume AutoPlay"
                : "Pause AutoPlay";
        };

        // Function to update countdown
        function updateCountdown() {
            if (!isCountdownPaused) {
                countdownContainer.textContent = `Next video in: ${countdownTime}s`;
                // Append the pause button to countdown container
                countdownContainer.appendChild(pauseButton);
                countdownTime--;
                if (countdownTime < 0) {
                    clearTimeout(timeoutId);

                    // Decide the correct URL based on videoType
                    let baseUrl;
                    if (nextVideo.videoType === "shorts") {
                        baseUrl = "https://www.youtube.com/shorts/";
                    } else {
                        baseUrl = "https://www.youtube.com/watch?v=";
                    }

                    // Navigate to the next video
                    window.location.href = baseUrl + nextVideo.videoId;
                } else {
                    timeoutId = setTimeout(updateCountdown, 1000); // Update countdown every second
                }
            }
        }

        // Initialize countdown
        updateCountdown();

        // Ensure the countdown container remains visible
        countdownContainer.style.display = "block";
    }

    // Initialize on video page
    if (window.location.href.includes("watch")) {
        autoPlayNextVideo();
    }

    // Upload playlist to JSONBin and generate a sharable URL
    async function uploadPlaylistToJSONBin(playlist) {
        if (!playlist || playlist.length === 0) {
            alert("The playlist is empty!");
            return null;
        }

        try {
            let binId = localStorage.getItem("jsonBinId");
            const method = binId ? "PUT" : "POST";
            const url = binId ? `${JSONBIN_API_URL}/${binId}` : JSONBIN_API_URL;
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Key": JSONBIN_API_KEY,
                    "X-Bin-Name": "playlist",
                    "X-Collection-Id": collectionId,
                },
                body: JSON.stringify(playlist),
            });

            if (!response.ok) {
                throw new Error(`Failed to upload playlist: ${response.statusText}`);
            }

            const data = await response.json();
            if (!binId && data.metadata) {
                binId = data.metadata.id;
                localStorage.setItem("jsonBinId", binId);
            }
            return `${JSONBIN_API_URL}/${binId}/latest`; // Public URL for JSONBin
        } catch (error) {
            console.error("Error uploading playlist to JSONBin:", error);
            alert("Failed to upload playlist to server!");
            return null;
        }
    }

    console.log("[YouTube Playlist Manager] Script initialized.");
})();
