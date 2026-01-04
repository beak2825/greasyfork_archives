// ==UserScript==
// @name         OST Torrents Collector
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Collects and saves torrents with 'ost.' in their name from uploaded pages, manages them by user ID
// @author       SleepingGiant
// @license      MIT
// @match        https://gazellegames.net/torrents.php?type=uploaded*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/517115/OST%20Torrents%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/517115/OST%20Torrents%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const USER_UPLOADED_STORAGE_KEY = "UserUploadedTorrents";
    const USER_ID = new URLSearchParams(window.location.search).get('userid');  // Get the current user ID from the URL

    // Function to create the 'Start OST Collection' button
    function createStartButton() {
        const button = document.createElement('button');
        setDefaultButtonCSS(button);
        button.textContent = 'Start OST Collection';
        button.style.top = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.onclick = startCollection;
        document.body.appendChild(button);
    }

    function createCopyToClipboardButton() {
        const storedData = JSON.parse(localStorage.getItem(`UserUploadedTorrents_${USER_ID}`)) || [];
        const prettifiedJson = JSON.stringify(storedData, null, 2); // Prettify the JSON

        const buttonText = `Copy Torrents to Clipboard (${storedData.length})`;
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.style.top = '50px';
        button.style.backgroundColor = '#2196F3';
        setDefaultButtonCSS(button);

        button.onclick = function() {
            GM_setClipboard(prettifiedJson); // Copy the prettified JSON to clipboard
            alert('Torrents data copied to clipboard!');
        };

        document.body.appendChild(button);
    }

    function createClearStorageButton() {
        const button = document.createElement('button');
        button.textContent = 'Clear All Stored Torrents';
        button.style.top = '100px';
        button.style.backgroundColor = '#f44336';
        button.onclick = clearAllStoredData;
        setDefaultButtonCSS(button);
        document.body.appendChild(button);
    }

    function setDefaultButtonCSS(button) {
        button.style.position = 'fixed';
        button.style.height = '50px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
    }

    // Function to start the collection process
    function startCollection() {
        checkAndProceed();
    }

    // Function to get the current page number from URL
    function getCurrentPageFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('page'), 10) || 1;
    }

    // Function to load the next page
    async function loadNextPage() {
        const currentPage = getCurrentPageFromUrl() + 1;
        const url = new URL(window.location.href);
        url.searchParams.set('page', currentPage);
        window.location.href = url.href;
    }

    // Function to store torrents uniquely for each user ID in localStorage
    function storeTorrentRow(torrentData) {
        const userTorrentsKey = `UserUploadedTorrents_${USER_ID}`;
        let storedData = JSON.parse(localStorage.getItem(userTorrentsKey)) || [];
        storedData.push(torrentData);
        localStorage.setItem(userTorrentsKey, JSON.stringify(storedData));
    }

    // Function to extract OST torrents from the page
    function extractOstTorrents() {
        const table = document.getElementById("uploaded_table");
        if (table) {
            const rows = table.querySelectorAll("tr[id^='torrent']");
            rows.forEach(row => {
                const torrentLink = row.querySelector("a[title='View Torrent']");
                const categoryDiv = row.querySelector("div[class]");

                if (torrentLink && categoryDiv) {
                    const categoryTitle = categoryDiv.getAttribute("class").toLowerCase();
                    if (categoryTitle.includes("ost")) {
                        const torrentData = {
                            url: torrentLink.href,
                            name: torrentLink.textContent.trim()
                        };
                        storeTorrentRow(torrentData);
                    }
                }
            });
        }
    }

    // Function to check for progress and decide next steps
    function checkAndProceed() {
        const errorElement = document.querySelector("#error");
        if (errorElement && errorElement.textContent.includes("No results found")) {
            const storedData = localStorage.getItem(`UserUploadedTorrents_${USER_ID}`);
            GM_setClipboard(storedData);
            alert("Data collection complete. Torrents copied to clipboard.");
        } else {
            extractOstTorrents();
            loadNextPage();
        }
    }


    // Function to clear all localStorage items starting with 'UserUploadedTorrents'
    function clearAllStoredData() {
        // Loop through all localStorage items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(USER_UPLOADED_STORAGE_KEY)) {
                localStorage.removeItem(key);  // Remove item if it starts with 'UserUploadedTorrents'
            }
        }
        createCopyToClipboardButton();

    }

    // Initialize the script
    window.addEventListener('load', () => {
        createStartButton();
        createCopyToClipboardButton(); // Create the copy button
        createClearStorageButton();     // Create the clear storage button
    });
})();
