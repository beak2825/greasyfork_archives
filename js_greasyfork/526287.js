// ==UserScript==
// @name         Empornium Torrent ID Collector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Collect torrent IDs from forum threads, copy their URLs to clipboard, and clear stored IDs
// @author       Papaxsmurf
// @match        https://www.empornium.is/forum/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526287/Empornium%20Torrent%20ID%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/526287/Empornium%20Torrent%20ID%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the buttons
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    container.style.border = '1px solid #ccc';
    container.style.padding = '5px';
    container.style.borderRadius = '4px';

    // Define button styling
    const btnStyle = "margin: 3px; padding: 5px 10px; font-size: 14px; cursor: pointer;";

    // Button 1: Collect IDs
    const collectBtn = document.createElement('button');
    collectBtn.textContent = 'Collect IDs';
    collectBtn.style.cssText = btnStyle;
    collectBtn.addEventListener('click', () => {
        // Retrieve any IDs already stored in sessionStorage
        let storedIDs = [];
        const stored = sessionStorage.getItem('torrent_ids');
        if (stored) {
            try {
                storedIDs = JSON.parse(stored);
                if (!Array.isArray(storedIDs)) {
                    storedIDs = [];
                }
            } catch (e) {
                storedIDs = [];
            }
        }
        // Use a Set for easy uniqueness
        const idSet = new Set(storedIDs);
        const initialCount = idSet.size;
        let newIDsCount = 0;

        // Find all <a> tags with href starting with "/torrents.php?id="
        const anchors = document.querySelectorAll('a[href^="/torrents.php?id="]');

        anchors.forEach(anchor => {
            // Only proceed if the anchor contains a <span class="taglabel">
            const span = anchor.querySelector('span.taglabel');
            if (!span) return;
            // Check if the span's text, after trimming, starts with "Torrent:"
            if (!span.textContent.trim().startsWith("Torrent:")) return;

            const href = anchor.getAttribute('href');
            // Use regex to extract numeric ID
            const match = href.match(/\/torrents\.php\?id=(\d+)/);
            if (match && match[1] && !idSet.has(match[1])) {
                idSet.add(match[1]);
                newIDsCount++;
            }
        });

        // Convert the Set to an Array and store in sessionStorage
        const updatedIDs = Array.from(idSet);
        sessionStorage.setItem('torrent_ids', JSON.stringify(updatedIDs));

        // Build an alert message based on what was stored before
        if (initialCount === 0) {
            alert(`Collected ${newIDsCount} unique ID${newIDsCount !== 1 ? 's' : ''}.`);
        } else if (newIDsCount > 0) {
            alert(`There were already ${initialCount} ID${initialCount !== 1 ? 's' : ''} stored.\nAdded ${newIDsCount} new ID${newIDsCount !== 1 ? 's' : ''}.\nTotal: ${updatedIDs.length} unique IDs.`);
        } else {
            alert(`No new IDs were found. The list already contains ${initialCount} unique ID${initialCount !== 1 ? 's' : ''}.`);
        }
    });

    // Button 2: Copy URLs
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy URLs';
    copyBtn.style.cssText = btnStyle;
    copyBtn.addEventListener('click', () => {
        const stored = sessionStorage.getItem('torrent_ids');
        if (!stored) {
            alert("No IDs stored. Please click 'Collect IDs' first.");
            return;
        }

        let ids;
        try {
            ids = JSON.parse(stored);
        } catch (e) {
            alert("Stored IDs are invalid.");
            return;
        }
        if (!Array.isArray(ids) || ids.length === 0) {
            alert("No IDs stored.");
            return;
        }

        // Build a list of URLs (one per line)
        const urls = ids.map(id => `https://www.empornium.is/torrents.php?id=${id}`).join('\n');

        // Attempt to copy the URLs to the clipboard
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(urls);
            alert("URLs copied to clipboard using GM_setClipboard.");
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(urls)
                .then(() => alert("URLs copied to clipboard."))
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert("Failed to copy URLs.");
                });
        } else {
            // Fallback: create a temporary textarea element to copy text
            const textArea = document.createElement('textarea');
            textArea.value = urls;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert("URLs copied to clipboard.");
            } catch (err) {
                console.error('Fallback copy failed: ', err);
                alert("Failed to copy URLs.");
            }
            document.body.removeChild(textArea);
        }
    });

    // Button 3: Clear IDs
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear IDs';
    clearBtn.style.cssText = btnStyle;
    clearBtn.addEventListener('click', () => {
        sessionStorage.removeItem('torrent_ids');
        alert("Stored IDs have been cleared.");
    });

    // Append buttons to the container
    container.appendChild(collectBtn);
    container.appendChild(copyBtn);
    container.appendChild(clearBtn);

    // Append the container to the document body
    document.body.appendChild(container);
})();
