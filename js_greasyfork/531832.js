// ==UserScript==
// @name         LingQ Subtitle Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Download subtitles (transcript with timestamp) from LingQ reader pages
// @author       Yuxin with ChatGPT
// @match        https://www.lingq.com/*
// @match        https://*lingq.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531832/LingQ%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/531832/LingQ%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("LingQ Subtitle Downloader Active Request script started.");

    // Extract API URL from the current page URL.
    // For example, from "https://www.lingq.com/en/learn/es/web/listen/1003504" we derive:
    //   - content language: es
    //   - lesson ID: 1003504
    // and build: "https://www.lingq.com/api/v3/es/lessons/1003504/simple/?"
    function getApiUrl() {
        const m = window.location.href.match(/^https:\/\/www\.lingq\.com\/([^\/]+)\/learn\/([^\/]+)\/web\/(listen|reader)\/(\d+)/);
        if (m) {
            const contentLang = m[2]; // second segment after "learn"
            const lessonId = m[4];
            const apiUrl = `https://www.lingq.com/api/v3/${contentLang}/lessons/${lessonId}/simple/?`;
            console.log("Constructed API URL:", apiUrl);
            return apiUrl;
        }
        console.warn("Could not parse lesson API URL from:", window.location.href);
        return null;
    }

    // Convert seconds to SRT timestamp format (HH:MM:SS,mmm)
    function formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = Math.floor(seconds % 60);
        let ms = Math.floor((seconds % 1) * 1000);
        return (hours < 10 ? "0" + hours : hours) + ":" +
               (minutes < 10 ? "0" + minutes : minutes) + ":" +
               (secs < 10 ? "0" + secs : secs) + "," +
               (ms < 100 ? (ms < 10 ? "00" + ms : "0" + ms) : ms);
    }

    // Build SRT content from the fetched lesson data
    function buildSRT(data) {
        let srtContent = "";
        let index = 1;
        data.tokenizedText.forEach(segment => {
            if (segment.length > 0) {
                let item = segment[0];
                let start = item.timestamp[0];
                let end = item.timestamp[1];
                srtContent += index + "\n";
                srtContent += formatTime(start) + " --> " + formatTime(end) + "\n";
                srtContent += item.text + "\n\n";
                index++;
            }
        });
        return srtContent;
    }

    // Trigger download of the SRT file
    function downloadSRT(srtContent, fileName) {
        const blob = new Blob([srtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Create and insert the Download Button with improved styling.
    function addDownloadButton() {
        if (document.getElementById('lingqDownloadButton')) return; // Prevent duplicates

        const button = document.createElement('button');
        button.id = 'lingqDownloadButton';
        button.innerText = "Download Subtitle";
        // Style: bottom right with background, outline, and custom text color.
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = 9999;
        button.style.padding = '10px 15px';
        button.style.fontSize = '14px';
        button.style.background = '#007bff';
        button.style.color = '#ffffff';
        button.style.border = '2px solid #0056b3';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '2px 2px 6px rgba(0,0,0,0.2)';

        button.addEventListener('click', function() {
            const apiUrl = getApiUrl();
            if (!apiUrl) {
                alert("Unable to determine lesson API URL.");
                return;
            }
            console.log("Sending request to API URL:", apiUrl);
            fetch(apiUrl, {
                headers: {
                    'accept': 'application/json',
                    'x-lingq-app': 'Web/6.0.10'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("Received lesson data:", data);
                const srtContent = buildSRT(data);
                console.log("Generated SRT content:\n", srtContent);
                const fileName = data.title.replace(/[\\\/:*?"<>|]/g, '_') + ".srt";
                downloadSRT(srtContent, fileName);
            })
            .catch(error => {
                console.error("Error fetching lesson data:", error);
                alert("Error fetching lesson data.");
            });
        });

        document.body.appendChild(button);
    }

    // Remove the download button (used when leaving allowed pages)
    function removeDownloadButton() {
        const btn = document.getElementById('lingqDownloadButton');
        if (btn) {
            btn.remove();
        }
    }

    // Update button visibility based on allowed pages (listen/reader pages)
    function updateButtonVisibility() {
        const allowedPattern = /^https:\/\/www\.lingq\.com\/[^\/]+\/learn\/[^\/]+\/web\/(listen|reader)\//;
        if (allowedPattern.test(window.location.href)) {
            addDownloadButton();
        } else {
            removeDownloadButton();
        }
    }

    // Monitor URL changes using history API overrides and popstate events.
    (function() {
        const _wr = function(type) {
            let orig = history[type];
            return function() {
                let rv = orig.apply(this, arguments);
                window.dispatchEvent(new Event('locationchange'));
                return rv;
            };
        };
        history.pushState = _wr('pushState');
        history.replaceState = _wr('replaceState');
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    })();

    window.addEventListener('locationchange', () => {
        console.log("Location changed to:", window.location.href);
        updateButtonVisibility();
    });

    window.addEventListener('DOMContentLoaded', () => {
        updateButtonVisibility();
    });
})();