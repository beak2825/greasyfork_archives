// ==UserScript==
// @name         Soundgasm Downloader
// @namespace    https://github.com/diggtrap
// @author       diggtrap
// @description  Adds a Download Audio button to Soundgasm.net audio posts.
// @include      https://soundgasm.net/*
// @icon         https://i.imgur.com/BwX91V0.png
// @version      0.401
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/491510/Soundgasm%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/491510/Soundgasm%20Downloader.meta.js
// ==/UserScript==

// Main function to add download button
function addDownloadButton() {
    // Fetch the page content asynchronously
    fetch(window.location.href)
        .then(response => response.text())
        .then(html => {
            // Parse the HTML content to extract the M4A link
            const m4aLinkRegex = /m4a:\s*"(.*?)"/;
            const m4aMatch = html.match(m4aLinkRegex);
            const m4aUrl = m4aMatch ? m4aMatch[1] : null;

            if (m4aUrl) {
                // Find the title of the audio post
                const audioTitleElement = document.querySelector('div.jp-title');
                const audioTitleText = audioTitleElement ? audioTitleElement.textContent.trim() : "";

                // Extract the text before the second set of square brackets
                const match = audioTitleText.match(/\[.*?\](.*?)(?=\[|$)/);
                const audioTitle = match ? match[0] : audioTitleText;

                // Find the creator's username from the URL
                const audioCreatorMatch = window.location.href.match(/\/u\/([^\/]+)/);
                const audioCreator = audioCreatorMatch ? audioCreatorMatch[1] : "";

                // Create download link with post title, creator, and default text style
                const downloadButton = document.createElement('a');
                downloadButton.href = m4aUrl;
                downloadButton.target = "_blank";
                downloadButton.title = "Click to open in a New Tab; Right-click and 'Save link as' to Download";
                downloadButton.textContent = `Download ${audioTitle} by ${audioCreator}`;
                downloadButton.style.position = "fixed";
                downloadButton.style.bottom = "20px";
                downloadButton.style.right = "20px";
                downloadButton.style.padding = "10px";
                downloadButton.style.backgroundColor = "#444";
                downloadButton.style.color = "white";
                downloadButton.style.border = "none";
                downloadButton.style.borderRadius = "5px";
                downloadButton.style.cursor = "pointer";
                downloadButton.style.textDecoration = "none";
                downloadButton.style.fontWeight = "normal";
                downloadButton.style.fontSize = "14px";

                document.body.appendChild(downloadButton);
            }
        });
}

// Call the main function
addDownloadButton();
