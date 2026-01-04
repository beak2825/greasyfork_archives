// ==UserScript==
// @name         Youtube Video Downloader (YT-DLP)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds buttons to download the video and audio of a Youtube video using YT-DLP, needs the YT-DLP Wrapper to work (https://gist.github.com/lolxnn/cfdfe72d0c5f6445ce8d846aa4bf9bcb)
// @author       lolxnn
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498609/Youtube%20Video%20Downloader%20%28YT-DLP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498609/Youtube%20Video%20Downloader%20%28YT-DLP%29.meta.js
// ==/UserScript==

// Check existing video elements on page load
document.querySelectorAll("video").forEach(addButtons);

// Set up a mutation observer to detect newly added video elements
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === "VIDEO") {
                addButtons(node);
            }
        });
    });
});

// Start observing
const config = { childList: true, subtree: true };
observer.observe(document.body, config);

function getWrapperStyle() {
    return `
        position: absolute;
        top: 0.7rem;
        left: 0.7rem;
        display: flex;
        z-index: 9999;
        flex-direction: row;
        gap: 0.5rem;
        transition: opacity 0.3s;
    `;
}

function addButtons(node) {
    const videoDownloadButton = getVideoDownloadButton();
    const audioDownloadButton = getAudioDownloadButton();

    const wrapper = document.createElement("div");
    wrapper.style = getWrapperStyle();
    wrapper.id = "ytdlp-wrapper";

    wrapper.appendChild(audioDownloadButton);
    wrapper.appendChild(videoDownloadButton);

    node.parentElement.appendChild(wrapper);

    // Set up event listeners to show the button on hover
    node.parentElement.addEventListener("mouseenter", (e) => {
        const wrapperElement = e.target.querySelector("#ytdlp-wrapper");
        wrapperElement.style.opacity = 1;
    });

    node.parentElement.addEventListener("mouseleave", (e) => {
        const wrapperElement = e.target.querySelector("#ytdlp-wrapper");
        wrapperElement.style.opacity = 0;
    });
}

// Button style
function getButtonStyle() {
    return `
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 0.5rem;
        font-size: 1rem;
        cursor: pointer;
        backdrop-filter: blur(0.5rem);
    `;
}

// Function to get the video URL
function getVideoUrl() {
    // On youtube we need the base address and only the video ID, otherwise in case of a playlist multiple videos will be downloaded
    const videoId = new URLSearchParams(window.location.search).get("v");

    return `https://www.youtube.com/watch?v=${videoId}`;
}

// Function to handle the presence of a video
function getVideoDownloadButton() {
    // You can add more code here to interact with the video element
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Video 🎥";
    downloadButton.id = "ytdlp-video-download"
    downloadButton.style = getButtonStyle();

    downloadButton.addEventListener("click", (e) => {
        // Get the video URL
        const videoUrl = getVideoUrl();

        // Open the YTDL-PL link
        openYTDLPLink(videoUrl, "video");

        // Prevent the video from stopping
        e.preventDefault();
        e.stopPropagation();
    });

    return downloadButton;
}

function getAudioDownloadButton() {
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Audio 🎵";
    downloadButton.id = "ytdlp-audio-download"
    downloadButton.style = getButtonStyle();

    downloadButton.addEventListener("click", (e) => {
        // Get the video URL
        const videoUrl = getVideoUrl();

        // Open the YTDL-PL link
        openYTDLPLink(videoUrl, "audio");

        // Prevent the video from stopping
        e.preventDefault();
        e.stopPropagation();
    });

    return downloadButton;
}

function openYTDLPLink(url, type) {
    switch (type) {
        case "video":
            window.open(`yt-dlp-wrapper://?url=${btoa(url)}&video=1`);
            break;
        case "audio":
            window.open(`yt-dlp-wrapper://?url=${btoa(url)}&audio=1`);
            break;
        default:
            break;
    }
}
