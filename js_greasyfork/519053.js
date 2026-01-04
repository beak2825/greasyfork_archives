// ==UserScript==
// @name         Gelbooru Tag Saver with Download Button
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Save and download tags from Gelbooru pages as filenames
// @author       You
// @match        https://*.gelbooru.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/519053/Gelbooru%20Tag%20Saver%20with%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/519053/Gelbooru%20Tag%20Saver%20with%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to combine text from <a> elements inside <li> with 'tag-type' class
    function getTagsFromPage() {
        let combinedText = "";
        const anchorElements = document.querySelectorAll("li[class*='tag-type'] > a");

        anchorElements.forEach(anchor => {
            let text = anchor.textContent.replace(/\?/g, "").trim(); // Remove "?" characters
            combinedText += text + " ";
        });

        return combinedText.trim();
    }

    // Function to clean up the tags and remove special characters
    function cleanTags(tags) {
        // Remove any non-alphanumeric characters and trim spaces
        return tags.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 250);
    }

    // Check if the current URL contains "images"
    if (window.location.href.includes("images")) {
        // Get saved tags from GM_setValue
        const savedTags = GM_getValue("tags", "");

        if (savedTags) {
            // Create a download button
            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Download with Tags";
            downloadButton.style.position = "fixed";
            downloadButton.style.top = "10px";
            downloadButton.style.right = "10px";
            downloadButton.style.padding = "15px 30px";  // Larger button size
            downloadButton.style.backgroundColor = "#4CAF50";
            downloadButton.style.color = "white";
            downloadButton.style.border = "none";
            downloadButton.style.borderRadius = "5px";
            downloadButton.style.cursor = "pointer";
            downloadButton.style.zIndex = "9999";  // Make sure the button is on top
            document.body.appendChild(downloadButton);

            // Set up the download button click event
            downloadButton.addEventListener("click", function() {
                const currentUrl = window.location.href; // Get the current URL (direct link to image/video)
                const fileExtension = currentUrl.split('.').pop().split('?')[0]; // Get the file extension
                let filename = cleanTags(savedTags); // Clean and format the tags for filename

                // Ensure we have a valid extension
                const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'avi', 'mov'];
                const extension = validExtensions.includes(fileExtension) ? fileExtension : "jpg";

                // Create an anchor element for downloading the file
                const downloadLink = document.createElement("a");
                downloadLink.href = currentUrl;  // The URL of the media
                downloadLink.download = filename + "." + extension;  // Filename with extension
                downloadLink.click();  // Simulate a click on the link to trigger the download
            });
        }
    } else {
        // On other pages, check if the tags are already saved
        const tags = getTagsFromPage();

        if (tags) {
            // Save the tags using GM_setValue
            GM_setValue("tags", tags);
            console.log("Tags saved: " + tags);
        }
    }
})();
