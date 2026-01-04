// ==UserScript==
// @name         Download X Videos with 200dB Boost
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to download X videos with a 200dB audio boost using yt-dlp
// @author       Your Name
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&amp;clien
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539055/Download%20X%20Videos%20with%20200dB%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/539055/Download%20X%20Videos%20with%20200dB%20Boost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the download button
    function addDownloadButton() {
        // Find all articles which contain tweets
        const articles = document.querySelectorAll('article');

        articles.forEach(article => {
            // Check if the article contains a video
            const video = article.querySelector('video');
            if (video && !article.querySelector('.download-video-button')) { // Prevent adding multiple buttons
                const actionsDiv = article.querySelector('div[role="group"]'); // Find the actions div (like, retweet, etc.)
                if (actionsDiv) {
                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Download (200dB)';
                    downloadButton.className = 'download-video-button'; // Add a class for easy identification
                    downloadButton.style.marginLeft = '10px'; // Add some spacing
                    downloadButton.style.padding = '5px 10px';
                    downloadButton.style.border = '1px solid #ccc';
                    downloadButton.style.borderRadius = '5px';
                    downloadButton.style.backgroundColor = '#fff';
                    downloadButton.style.cursor = 'pointer';
                    downloadButton.style.fontSize = '12px';

                    downloadButton.addEventListener('click', () => {
                        // Find the tweet permalink within the article
                        const permalinkElement = article.querySelector('a[href*="/status/"]');
                        if (permalinkElement) {
                            const tweetUrl = permalinkElement.href;
                            console.log('Attempting to download:', tweetUrl);
                            // Use a simple prompt for demonstration. A better approach would be to send this URL to a local script.
                            alert(`To download with 200dB boost, copy this command and run it in your terminal:\n\nyt-dlp "${tweetUrl}" -f bestaudio --extract-audio --audio-format mp3 -o "%(title)s.%(ext)s" --postprocessor-args "-filter:a volume=200dB"`);
                        } else {
                            alert('Could not find tweet permalink.');
                        }
                    });

                    // Append the button to the actions div
                    actionsDiv.appendChild(downloadButton);
                }
            }
        });
    }

    // Observe changes in the DOM to add buttons to dynamically loaded content
    const observer = new MutationObserver(addDownloadButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to add buttons to already loaded content
    addDownloadButton();

})();
