// ==UserScript==
// @name         FTP Index to M3U8 Playlist Converter
// @namespace    http://tampermonkey.net/
// @version      2.6.6
// @description  Convert HTTP index directory to M3U8 playlist
// @author       Beluga
// @contributor  MadZacK(TBD)
// @license      MIT
// @match        http*://*.circleftp.net/*
// @match        http*://172.16.50.4/*
// @match        http*://172.16.50.7/*
// @match        http*://172.16.50.9/*
// @match        http*://172.16.50.12/*
// @match        http*://172.16.50.14/*
// @match        http*://*.ftpbd.net/*
// @match        http*://10.16.100.244/*
// @match        http*://freedrivemovie.com/*
// @match        http*://*.discoveryftp.net/*
// @match        http*://172.19.178.62:48781/*
// @match        http*://cdn.dflix.live:5050/*
// @match        http*://fs.ebox.live/*
// @match        http*://cdn.nagordola.com.bd/*
// @match        http*://nagordola.com.bd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530480/FTP%20Index%20to%20M3U8%20Playlist%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/530480/FTP%20Index%20to%20M3U8%20Playlist%20Converter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const videoFormats = ['mp4', '3gp', 'mkv', 'wav', 'wmv', 'avi', 'flv', 'mov', 'ts'];

    function cleanFileName(fileName) {
        return fileName.replace(/S(\d{1,2})E\d{1,3}/i, 'S$1').trim();
    }

    function getPlaylistName(links) {
        if (links.length === 0) return "Playlist";
        let firstFileName = decodeURIComponent(links[0].split('/').pop());
        firstFileName = cleanFileName(firstFileName);
        return firstFileName.replace(/\.\w+$/, '') + ".m3u8";
    }

    function createM3U8Content(links) {
        let content = "#EXTM3U\n";
        links.forEach(link => {
            let fileName = decodeURIComponent(link.split('/').pop()).replace(/\s+/g, '.');
            content += `#EXTINF:-1,${fileName}\n${link}\n`;
        });
        return content;
    }

    function downloadM3U8(content, filename) {
        const userFilename = prompt("Saving the playlist as:", filename);
        if (!userFilename) return;

        const blob = new Blob([content], { type: 'application/x-mpegURL' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = userFilename.endsWith('.m3u8') ? userFilename : userFilename + ".m3u8";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function gatherVideoLinks() {
        const links = [];
        let searchScope = document; // Default to searching the whole page

        // Site-specific logic for the new circleftp.net layout
        if (window.location.hostname.includes('new.circleftp.net')) {
            const activeTabContent = document.querySelector('div.tab-pane.active');
            if (activeTabContent) {
                console.log("CircleFTP tabbed layout detected. Scoping search to the active season.");
                searchScope = activeTabContent; // Change scope to only the active tab
            }
        }

        // Search for links within the determined scope (either the whole page or the active tab)
        searchScope.querySelectorAll('a').forEach(anchor => {
            // Check for a valid video file extension in the href
            try {
                const url = new URL(anchor.href, document.baseURI);
                const ext = url.pathname.split('.').pop().toLowerCase();
                if (videoFormats.includes(ext)) {
                    links.push(url.href);
                }
            } catch (error) {
                console.warn(`Skipping invalid URL: ${anchor.href}`);
            }
        });
        return links.sort();
    }


    function createDownloadButton() {
        let existingButton = document.getElementById("playlistDownloadBtn");
        if (existingButton) return existingButton; // Prevent duplicate buttons

        const button = document.createElement('button');
        button.id = "playlistDownloadBtn";
        button.textContent = "Download Playlist";
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            color: white;
            background: linear-gradient(135deg, #ff6a00, #ee0979);
            border: none;
            cursor: pointer;
            text-align: center;
            border-radius: 6px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease-in-out;
            z-index: 1000;
        `;
        button.addEventListener('mouseover', () => button.style.background = 'linear-gradient(135deg, #ff4500, #d70270)');
        button.addEventListener('mouseout', () => button.style.background = 'linear-gradient(135deg, #ff6a00, #ee0979)');
        document.body.appendChild(button);
        return button;
    }

    function generatePlaylist() {
        const links = gatherVideoLinks();
        if (links.length === 0) {
            alert('No video files found in this directory.');
            return;
        }

        console.log(`Found ${links.length} video links.`);
        const button = document.getElementById("playlistDownloadBtn");
        if (button) {
            button.textContent = "Generating...";
            button.disabled = true;
            button.style.opacity = "0.6";
        }

        setTimeout(() => {
            const filename = getPlaylistName(links);
            const content = createM3U8Content(links);
            downloadM3U8(content, filename);
            if (button) {
                button.textContent = "Download Playlist";
                button.disabled = false;
                button.style.opacity = "1";
            }
        }, 1000);
    }

    function addDownloadFunctionality() {
        let downloadButton = createDownloadButton();
        if (!downloadButton) return;

        downloadButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            generatePlaylist();
        });

        document.addEventListener('keydown', (event) => {
            if (event.shiftKey && event.altKey && event.code === 'KeyD') {
                console.log("Shortcut Shift+Alt+D triggered");
                generatePlaylist();
            }
        });
    }

    // Use MutationObserver to wait for the file list to be loaded dynamically
    const observer = new MutationObserver((mutations, obs) => {
        // Look for the links once a change happens
        const links = document.querySelectorAll('a');
        let hasVideoLink = false;
        for (const anchor of links) {
            const ext = anchor.href.split('.').pop().toLowerCase();
            if (videoFormats.includes(ext)) {
                hasVideoLink = true;
                break;
            }
        }

        // If video links are found, add the button and stop observing
        if (hasVideoLink) {
            addDownloadFunctionality();
            obs.disconnect(); // Stop watching for more changes
        }
    });

    // Start observing the body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();