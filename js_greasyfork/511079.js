// ==UserScript==
// @name         Waze Manage Bookmarks with Backup (API Version)
// @namespace    https://greasyfork.org/ja/users/735907-cauliflower-carrot
// @version      2.6
// @description  Displays a UI for managing bookmarks in the Waze editor using the Userscript API, with export/import features and paste buttons.
// @author       aoi
// @match        https://www.waze.com/*/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511079/Waze%20Manage%20Bookmarks%20with%20Backup%20%28API%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511079/Waze%20Manage%20Bookmarks%20with%20Backup%20%28API%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'waze-bookmarks-manager';
    const defaultFontSize = '16px';
    let allowedUrls = JSON.parse(localStorage.getItem('allowedUrls')) || [];

    // Wait for WME to be fully ready
    function waitForWmeReady() {
        if (W?.userscripts?.state.isReady) {
            initializeScript();
        } else {
            document.addEventListener('wme-ready', initializeScript, { once: true });
        }
    }

    async function initializeScript() {
        // Register sidebar tab
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);

        // Set tab label
        tabLabel.innerText = 'BM';
        tabLabel.title = 'Bookmark Manager';

        // Create tab content with paste buttons
        tabPane.innerHTML = `
            <div style="padding: 10px;">
                <h3 style="margin: 0 0 10px 0;">Bookmark Management</h3>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <input type="text" id="urlInput" placeholder="Enter URL" style="flex: 1; padding: 5px; box-sizing: border-box;">
                    <button id="pasteUrlButton" style="margin-left: 5px; padding: 5px 10px; background-color: #9C27B0; color: white; border: none; border-radius: 3px;" title="Paste from clipboard">Paste</button>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <input type="text" id="nameInput" placeholder="Enter Bookmark Name" style="flex: 1; padding: 5px; box-sizing: border-box;">
                    <button id="pasteNameButton" style="margin-left: 5px; padding: 5px 10px; background-color: #9C27B0; color: white; border: none; border-radius: 3px;" title="Paste from clipboard">Paste</button>
                </div>
                <button id="addUrlButton" style="width: 100%; margin-top: 5px; padding: 5px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">Add Bookmark</button>
                <ul id="urlList" style="list-style: none; padding: 0; margin: 10px 0 0 0; max-height: 200px; overflow-y: auto;"></ul>
                <button id="clearCacheButton" style="width: 100%; margin-top: 15px; padding: 5px; background-color: #2196F3; color: white; border: none; border-radius: 5px;">Clear Cache</button>
                <button id="exportButton" style="width: 100%; margin-top: 10px; padding: 5px; background-color: #FF9800; color: white; border: none; border-radius: 5px;">Export Bookmarks</button>
                <input type="file" id="importButton" accept=".json" style="width: 100%; margin-top: 10px;" title="Import Bookmarks">
            </div>
        `;

        // Wait for tab to be connected to DOM
        await W.userscripts.waitForElementConnected(tabPane);

        // Update bookmark list
        updateUrlList();

        // Set up event listeners
        setupEventListeners();
    }

    // Function to update bookmark list
    function updateUrlList() {
        const urlList = document.getElementById('urlList');
        urlList.innerHTML = '';
        allowedUrls.forEach((item) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '5px';
            li.innerHTML = `<span style="flex: 1; font-size: ${defaultFontSize};"><a href="${item.url}" style="color: #2196F3;" class="bookmarkLink" data-url="${item.url}">${item.name || item.url}</a></span>`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.style.marginLeft = '10px';
            removeButton.style.backgroundColor = '#F44336';
            removeButton.style.color = 'white';
            removeButton.style.border = 'none';
            removeButton.style.borderRadius = '3px';
            removeButton.style.padding = '2px 5px';
            removeButton.addEventListener('click', () => {
                allowedUrls = allowedUrls.filter(i => i.url !== item.url);
                localStorage.setItem('allowedUrls', JSON.stringify(allowedUrls));
                updateUrlList();
            });
            li.appendChild(removeButton);
            urlList.appendChild(li);
        });
    }

    // Function to clear cache and navigate
    function clearCacheAndNavigate(url) {
        caches.keys().then(names => {
            return Promise.all(names.map(name => caches.delete(name)));
        }).then(() => {
            window.location.href = url;
        });
    }

    // Function to paste from clipboard
    async function pasteFromClipboard(inputId) {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById(inputId).value = text;
        } catch (err) {
            console.error('Failed to paste from clipboard:', err);
            alert('Failed to paste from clipboard. Please ensure clipboard permissions are enabled.');
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        document.getElementById('addUrlButton').addEventListener('click', () => {
            const urlInput = document.getElementById('urlInput');
            const nameInput = document.getElementById('nameInput');
            const newUrl = urlInput.value.trim();
            const newName = nameInput.value.trim();

            if (newUrl && !allowedUrls.some(item => item.url === newUrl)) {
                allowedUrls.push({ url: newUrl, name: newName });
                localStorage.setItem('allowedUrls', JSON.stringify(allowedUrls));
                urlInput.value = '';
                nameInput.value = '';
                updateUrlList();
            } else if (allowedUrls.some(item => item.url === newUrl)) {
                alert('This bookmark already exists.');
            } else {
                alert('Please enter a URL.');
            }
        });

        document.getElementById('clearCacheButton').addEventListener('click', () => {
            clearCacheAndNavigate(window.location.href);
        });

        document.getElementById('exportButton').addEventListener('click', () => {
            const dataStr = JSON.stringify(allowedUrls);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', 'bookmarks.json');
            linkElement.click();
        });

        document.getElementById('importButton').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    allowedUrls = JSON.parse(e.target.result);
                    localStorage.setItem('allowedUrls', JSON.stringify(allowedUrls));
                    updateUrlList();
                };
                reader.readAsText(file);
            }
        });

        document.getElementById('pasteUrlButton').addEventListener('click', () => {
            pasteFromClipboard('urlInput');
        });

        document.getElementById('pasteNameButton').addEventListener('click', () => {
            pasteFromClipboard('nameInput');
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('bookmarkLink')) {
                e.preventDefault();
                const targetUrl = e.target.getAttribute('data-url');
                clearCacheAndNavigate(targetUrl);
            }
        });
    }

    // Start script initialization
    waitForWmeReady();
})();