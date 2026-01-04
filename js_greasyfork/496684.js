// ==UserScript==
// @name         YouTube add Channel RSS Link
// @namespace    https://greasyfork.org/en/users/4612-gdorn
// @version      1.0.1
// @description  Add an RSS feed link to the video owner section on YouTube video pages
// @author       GDorn
// @license      MIT
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527120/YouTube%20add%20Channel%20RSS%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/527120/YouTube%20add%20Channel%20RSS%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentVideoId = null; // Tracks the video ID for which the RSS link was added
    let isRunning = false; // Semaphore to prevent concurrent execution

    /**
     * Extracts the channel ID from available data sources.
     */
    const getChannelId = () => {
        let channelId = null;

        // First, try to get it from ytInitialPlayerResponse
        if (window.ytInitialPlayerResponse && window.ytInitialPlayerResponse.videoDetails) {
            channelId = window.ytInitialPlayerResponse.videoDetails.channelId;
        }

        // If not found, try to get it from ytInitialData
        if (!channelId && window.ytInitialData) {
            const data = window.ytInitialData;
            if (data && data.contents && data.contents.twoColumnWatchNextResults) {
                const owner = data.contents.twoColumnWatchNextResults.results.contents[0].videoOwnerRenderer;
                if (owner && owner.ownerEndpoint) {
                    channelId = owner.ownerEndpoint.browseEndpoint.browseId.replace('UC', '');
                }
            }
        }

        // If no channelId found yet, fall back to script tag parsing
        if (!channelId) {
            const scriptTags = Array.from(document.querySelectorAll('script'));
            for (const script of scriptTags) {
                if (script.innerHTML.includes('channelId":"UC')) {
                    const match = script.innerHTML.match(/"channelId":"(UC[0-9A-Za-z-_]+)"/);
                    if (match) {
                        channelId = match[1].replace('UC', '');
                        break;
                    }
                }
            }
        }

        return channelId;
    };

    /**
     * Adds an RSS link to the video owner's section, with retry logic for when the owner box isn't found.
     */
    const addRssLink = () => {
        const ownerBox = document.querySelector('#owner');
        if (ownerBox) {
            const existingLink = ownerBox.querySelector('.rss-link');
            if (existingLink) existingLink.remove();

            // Extract channel ID dynamically
            const channelId = getChannelId();
            if (!channelId) {
                console.log("Failed to find channel ID.");
                setTimeout(addRssLink, 500); // Retry if channelId is not found
                return;
            }

            const rssLink = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
            const rssElement = document.createElement('a');
            rssElement.href = rssLink;
            rssElement.textContent = 'RSS Feed';
            rssElement.target = '_blank';
            rssElement.className = 'rss-link';
            rssElement.style.display = 'block';
            rssElement.style.marginTop = '10px';

            ownerBox.appendChild(rssElement);
            isRunning = false;
            console.log("Added RSS link");
        } else {
            // Retry after 500ms if owner box is not found
            console.log("Owner box not found, retrying...");
            setTimeout(addRssLink, 500);
        }
    };

    /**
     * Replaces the existing RSS link with a reload link.
     */
    const replaceWithReloadLink = () => {
        const ownerBox = document.querySelector('#owner');
        if (ownerBox) {
            const existingLink = ownerBox.querySelector('.rss-link');
            if (existingLink) existingLink.remove();

            const reloadElement = document.createElement('a');
            reloadElement.href = location.href;
            reloadElement.textContent = 'Reload to update RSS link';
            reloadElement.target = '_self';
            reloadElement.className = 'rss-link';
            reloadElement.style.display = 'block';
            reloadElement.style.marginTop = '10px';
            ownerBox.appendChild(reloadElement);
            isRunning = false;

            console.log("Added reload link because video ID changed.");
        } else {
            // Retry after 500ms if owner box is not found
            console.log("Owner box not found, retrying...");
            setTimeout(replaceWithReloadLink, 500);
        }

    };

    /**
     * Processes the current video page and handles RSS/reload link updates.
     * If the owner box is not yet present, it retries every 500ms.
     */
    const processVideo = () => {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return; // No valid video ID

        // If the video ID has changed, replace the RSS link with the reload link.
        if (videoId !== currentVideoId) {
            if (currentVideoId !== null) {
                console.log("Video ID changed. Replacing RSS link with reload link.");
                replaceWithReloadLink(); // Replace the RSS link with a reload link
                currentVideoId = videoId;
                return;
            }

            currentVideoId = videoId;
            isRunning = true;

            addRssLink(); // Start the retry logic to wait for the #owner box and add the RSS link
        }
    };

    // Observe DOM changes to detect navigation to a new video
    const observer = new MutationObserver(() => {
        if (!isRunning) {
            processVideo(); // Process the video when necessary
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log("YouTube Channel RSS Link script initialized.");
    processVideo(); // Initial run
})();
