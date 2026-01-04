// ==UserScript==
// @name         YouTube Filter: Remove Low View Count Videos
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hide YouTube videos with less than 1,000 views on the homepage and sidebar.
// @author       IvyOnGreasy
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524512/YouTube%20Filter%3A%20Remove%20Low%20View%20Count%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/524512/YouTube%20Filter%3A%20Remove%20Low%20View%20Count%20Videos.meta.js
// ==/UserScript==
const VIEW_THRESHOLD = 1000; // Minimum view count threshold

// Function to parse view count text into a number
function parseViewCount(text) {
    const match = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)/i); // Matches view count patterns
    if (!match) return 0;

    let [, count, multiplier] = match;
    count = parseFloat(count.replace(/,/g, '')); // Remove commas and parse as float

    switch (multiplier?.toUpperCase()) {
        case 'K': return count * 1000; // Thousand multiplier
        case 'M': return count * 1000000; // Million multiplier
        case 'B': return count * 1000000000; // Billion multiplier
        default: return count; // Raw number
    }
}

// Function to check if a video has low views
function isBadVideo(video) {
    // Get the view count element
    const viewElement = video.querySelector(".ytd-video-meta-block span");

    // Skip items that don't have a valid view count element
    if (!viewElement || !viewElement.innerText) {
        return false; // If no view count is found, don't hide
    }

    const viewCount = parseViewCount(viewElement.innerText); // Parse the view count text
    return viewCount < VIEW_THRESHOLD; // Return true if below threshold
}

// Function to filter videos based on view count
function filterVideosOnHomepageAndSidebar() {
    const videoSelectors = [];

    // Apply filter only on the homepage and sidebar recommendations
    if (location.pathname === "/") {
        videoSelectors.push("ytd-rich-item-renderer"); // Homepage grid
    } else if (location.pathname.startsWith("/watch")) {
        videoSelectors.push("ytd-compact-video-renderer"); // Sidebar recommendations
    }

    const videos = document.querySelectorAll(videoSelectors.join(", "));
    videos.forEach(video => {
        if (isBadVideo(video)) {
            video.style.display = "none"; // Hide videos below the view threshold
        }
    });
}

// Throttled MutationObserver
let observerTimeout;
const observerCallback = () => {
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(filterVideosOnHomepageAndSidebar, 100); // Throttle updates
};

const observer = new MutationObserver(observerCallback);
observer.observe(document.body, {
    childList: true, // Watch for added/removed child nodes
    subtree: true // Include changes in all descendants
});

// Initial execution on page load
window.addEventListener("load", filterVideosOnHomepageAndSidebar); // Run filterVideos on page load
document.addEventListener("yt-navigate-finish", () => setTimeout(filterVideosOnHomepageAndSidebar, 350)); // Run filterVideos after YouTube navigation events