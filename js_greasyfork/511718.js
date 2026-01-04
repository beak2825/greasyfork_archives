// ==UserScript==
// @name         Real-time Download Link Finder with Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Finds and displays all download links, and allows copying them to clipboard
// @author       motoe
// @match        https://making-new-thing-testing-pushing-huginface-yl-dl-1.hf.space/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511718/Real-time%20Download%20Link%20Finder%20with%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/511718/Real-time%20Download%20Link%20Finder%20with%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a small floating window to show the download links
    let windowDiv = document.createElement("div");
    windowDiv.style.position = "fixed";
    windowDiv.style.bottom = "10px";
    windowDiv.style.right = "10px";
    windowDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    windowDiv.style.color = "white";
    windowDiv.style.padding = "10px";
    windowDiv.style.zIndex = "1000";
    windowDiv.style.maxHeight = "200px";
    windowDiv.style.overflowY = "scroll";
    windowDiv.style.fontSize = "12px";
    windowDiv.style.borderRadius = "5px";
    windowDiv.style.width = "300px";
    windowDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(windowDiv);

    // Create a copy button and append it to the window
    let copyButton = document.createElement("button");
    copyButton.textContent = "Copy URLs to Clipboard";
    copyButton.style.display = "block";
    copyButton.style.marginTop = "10px";
    copyButton.style.padding = "5px";
    copyButton.style.backgroundColor = "#28a745";
    copyButton.style.color = "white";
    copyButton.style.border = "none";
    copyButton.style.borderRadius = "4px";
    copyButton.style.cursor = "pointer";
    windowDiv.appendChild(copyButton);

    let linksArray = []; // To store all the found URLs

    // Function to check the page for download links in <a> elements with the 'download' attribute
    function scanForDownloadLinks() {
        let downloadLinks = document.querySelectorAll('a[download]');
        downloadLinks.forEach(link => {
            let href = link.getAttribute('href');
            if (href && !link.dataset.found) {
                link.dataset.found = "true";
                let fullUrl = new URL(href, window.location.origin).href;
                linksArray.push(fullUrl);
                let linkElement = document.createElement("div");
                linkElement.style.wordWrap = "break-word";
                linkElement.textContent = fullUrl;
                windowDiv.appendChild(linkElement);
            }
        });
    }

    // Function to copy all URLs to clipboard
    copyButton.addEventListener("click", async () => {
        if (linksArray.length > 0) {
            try {
                await navigator.clipboard.writeText(linksArray.join('\n'));
                alert('URLs copied to clipboard!');
            } catch (err) {
                alert('Failed to copy URLs: ' + err);
            }
        } else {
            alert('No URLs found to copy!');
        }
    });

    // Continuously scan for new download links every second
    setInterval(scanForDownloadLinks, 1000);

})();
