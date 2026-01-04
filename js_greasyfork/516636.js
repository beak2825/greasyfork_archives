// ==UserScript==
// @name         Simple Youtube Video Downloader
// @namespace    https://www.youtube.com/
// @version      1.5.0
// @description  Opens an embedded popup with the download page URL for MP3 or MP4
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch*
// @match        https://cejoapsoo.net/4/6534656*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516636/Simple%20Youtube%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/516636/Simple%20Youtube%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Malicious URL to detect
    const maliciousUrl = "https://cejoapsoo.net/4/6534656";

    // Check if the current URL matches the malicious URL
    if (window.location.href.includes(maliciousUrl)) {
        console.log("Malicious URL detected! Closing the tab...");
        window.close(); // Attempt to close the tab
        return; // Stop further execution if malicious URL is detected
    }

    // Function to extract the YouTube video ID from the URL
    function getVideoId(url) {
        const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
        return match ? match[1] : null;
    }

    // Function to create the download popup with an embedded iframe
    function showDownloadPopup(videoId, fileType) {
        // Remove any existing popup
        let existingPopup = document.getElementById("youtubeDL-popup");
        if (existingPopup) existingPopup.remove();

        // Create popup background
        const popupBackground = document.createElement("div");
        popupBackground.id = "youtubeDL-popup-bg";
        Object.assign(popupBackground.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        });

        // Create popup container
        const popupContainer = document.createElement("div");
        popupContainer.id = "youtubeDL-popup";
        Object.assign(popupContainer.style, {
            width: "80%",
            height: "80%",
            maxWidth: "800px",
            maxHeight: "600px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        });

        // Create close button
        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        Object.assign(closeButton.style, {
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            alignSelf: "flex-end",
        });
        closeButton.onclick = () => popupBackground.remove();

        // Create iframe to embed download page
        const iframe = document.createElement("iframe");
        iframe.src = `https://download.y2api.com/api/button/${fileType}?url=https://www.youtube.com/watch?v=${videoId}`;
        Object.assign(iframe.style, {
            width: "100%",
            height: "100%",
            border: "none",
            flex: "1",
        });

        // Append elements to popup and background
        popupContainer.appendChild(closeButton);
        popupContainer.appendChild(iframe);
        popupBackground.appendChild(popupContainer);
        document.body.appendChild(popupBackground);

        // Close popup when background is clicked
        popupBackground.onclick = (event) => {
            if (event.target === popupBackground) {
                popupBackground.remove();
            }
        };
    }

    // Function to create a format selection popup for MP3/MP4
    function showFormatSelectionPopup(videoId) {
        // Remove any existing popup
        let existingPopup = document.getElementById("youtubeDL-format-popup");
        if (existingPopup) existingPopup.remove();

        // Create popup background
        const popupBackground = document.createElement("div");
        popupBackground.id = "youtubeDL-popup-bg";
        Object.assign(popupBackground.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        });

        // Create popup container
        const popupContainer = document.createElement("div");
        popupContainer.id = "youtubeDL-format-popup";
        Object.assign(popupContainer.style, {
            width: "300px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
        });

        // Popup title
        const popupTitle = document.createElement("h3");
        popupTitle.innerText = "Download as";
        popupContainer.appendChild(popupTitle);

        // Style for buttons
        const buttonStyle = {
            padding: "10px 20px",
            margin: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            color: "#fff",
        };

        // MP3 button
        const mp3Button = document.createElement("button");
        mp3Button.innerText = "MP3";
        Object.assign(mp3Button.style, buttonStyle, { backgroundColor: "#0073e6" });
        mp3Button.onclick = () => {
            popupBackground.remove();
            showDownloadPopup(videoId, "mp3");
        };

        // MP4 button
        const mp4Button = document.createElement("button");
        mp4Button.innerText = "MP4";
        Object.assign(mp4Button.style, buttonStyle, { backgroundColor: "#28a745" });
        mp4Button.onclick = () => {
            popupBackground.remove();
            showDownloadPopup(videoId, "mp4");
        };

        // Append buttons to popup
        popupContainer.appendChild(mp3Button);
        popupContainer.appendChild(mp4Button);

        // Append popup to background
        popupBackground.appendChild(popupContainer);
        document.body.appendChild(popupBackground);

        // Close popup when background is clicked
        popupBackground.onclick = (event) => {
            if (event.target === popupBackground) {
                popupBackground.remove();
            }
        };
    }

    // Function to add the download button to the YouTube player
    function addDownloadButton() {
        const videoId = getVideoId(window.location.href);
        if (!videoId) return;

        // Remove any existing download button
        const existingButton = document.getElementById("youtubeDL-download-button");
        if (existingButton) existingButton.remove();

        // Create the download button
        const button = document.createElement("button");
        button.id = "youtubeDL-download-button";
        button.innerText = "Download";
        button.style.marginLeft = "10px";
        button.style.borderRadius = "8px";
        button.style.border = "none";
        button.style.backgroundColor = "#0073e6";
        button.style.color = "#fff";
        button.style.padding = "5px 10px";
        button.style.cursor = "pointer";
        button.onclick = () => {
            showFormatSelectionPopup(videoId);
        };

        // Find YouTube's video control panel and insert the button
        const controls = document.querySelector(".ytp-left-controls");
        if (controls) {
            controls.appendChild(button);
        }
    }

    // Wait for the YouTube page to load fully, then add the button
    window.addEventListener('yt-navigate-finish', addDownloadButton);

    // Initial load in case the page is already loaded
    addDownloadButton();
})();
