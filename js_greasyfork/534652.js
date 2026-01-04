// ==UserScript==
// @name         Youtube Video Downloader (YT-DLP) + Real Progress
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds buttons to download YouTube audio/video using YT-DLP and shows real download progress overlay from local Python backend
// @author       You
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534652/Youtube%20Video%20Downloader%20%28YT-DLP%29%20%2B%20Real%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/534652/Youtube%20Video%20Downloader%20%28YT-DLP%29%20%2B%20Real%20Progress.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add buttons to all existing video elements
    document.querySelectorAll("video").forEach(addButtons);

    // Observe page for dynamically loaded video elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === "VIDEO") {
                    addButtons(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Inject audio/video buttons on top of video
    function addButtons(videoNode) {
        if (document.getElementById("ytdlp-wrapper")) return; // prevent duplicates

        const wrapper = document.createElement("div");
        wrapper.id = "ytdlp-wrapper";
        wrapper.style = `
            position: absolute;
            top: 0.7rem;
            left: 0.7rem;
            display: flex;
            gap: 0.5rem;
            z-index: 9999;
            transition: opacity 0.3s;
        `;

        const audioButton = createDownloadButton("Download Audio 🎵", () => {
            startDownload("audio");
        });

        const videoButton = createDownloadButton("Download Video 🎥", () => {
            startDownload("video");
        });

        wrapper.appendChild(audioButton);
        wrapper.appendChild(videoButton);
        videoNode.parentElement.appendChild(wrapper);

        // Fade in/out on hover
        videoNode.parentElement.addEventListener("mouseenter", () => {
            wrapper.style.opacity = 1;
        });
        videoNode.parentElement.addEventListener("mouseleave", () => {
            wrapper.style.opacity = 0;
        });
    }

    function createDownloadButton(label, onClick) {
        const button = document.createElement("button");
        button.textContent = label;
        button.style = `
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            padding: 0.5rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            backdrop-filter: blur(0.5rem);
        `;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });
        return button;
    }

    function getVideoUrl() {
        const videoId = new URLSearchParams(window.location.search).get("v");
        return `https://www.youtube.com/watch?v=${videoId}`;
    }

    function startDownload(type) {
        const url = btoa(getVideoUrl());
        const schemeUrl = `yt-dlp-wrapper://?url=${url}&${type}=1`;
        window.open(schemeUrl);

        showRealTimeProgress();
    }

    function showRealTimeProgress() {
    let statusDiv = document.getElementById("ytdlp-status");
    if (!statusDiv) {
        statusDiv = document.createElement("div");
        statusDiv.id = "ytdlp-status";
        statusDiv.style = `
            position: fixed;
            bottom: 40px; /* pushed a bit more up */
            left: 50%;
            transform: translateX(-50%) scale(2); /* 2x scale */
            transform-origin: bottom center;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            font-size: 1.2rem;
            z-index: 99999;
            box-shadow: 0 0 10px black;
        `;
        document.body.appendChild(statusDiv);
    }

    statusDiv.textContent = "sabar ya bntr lagi download ajg";

    const interval = setInterval(async () => {
        try {
            const res = await fetch("http://127.0.0.1:2025/progress");
            const data = await res.json();

            if (data.status === "downloading") {
                statusDiv.textContent = `Downloading: ${data.percent}`;
            } else if (data.status === "done") {
                statusDiv.textContent = "✅ Download selesai ajg";
                clearInterval(interval);
                setTimeout(() => statusDiv.remove(), 4000);
            }
        } catch (err) {
            statusDiv.textContent = "yt-dlp mana nih ajg";
        }
    }, 1000);
}
})();
