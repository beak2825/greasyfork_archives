// ==UserScript==
// @name         Friendly Sidebar Display of Custom Search API Results
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance your Google search experience by displaying additional search results from the Google Custom Search API in a convenient sidebar. Perfect for power users who want more information at their fingertips.
// @author       Your Name
// @match        https://www.google.com/search?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483011/Friendly%20Sidebar%20Display%20of%20Custom%20Search%20API%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/483011/Friendly%20Sidebar%20Display%20of%20Custom%20Search%20API%20Results.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Add custom styles for the sidebar
    GM_addStyle(`
        #custom-search-sidebar {
            position: fixed;
            right: 0;
            top: 0;
            width: 30%; /* Adjust width as needed */
            height: 100%;
            background-color: white;
            overflow-y: auto;
            border-left: 1px solid #ccc;
            z-index: 9999;
            padding: 10px;
            box-sizing: border-box;
        }
        #settings-form {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: white;
            padding: 10px;
            border: 1px solid #ccc;
            z-index: 10000;
            display: none; /* Initially hidden */
        }
        #show-settings {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10001;
        }
    `);
    // Function to load settings with a default value for dateRestrict
    function loadSettings() {
        return {
            apiKey: localStorage.getItem('apiKey') || '',
            searchEngineId: localStorage.getItem('searchEngineId') || '',
            dateRestrict: localStorage.getItem('dateRestrict') || '' // Default to 'm1' if not set
        };
    }

    // Function to save settings
    function saveSettings(apiKey, searchEngineId, dateRestrict) {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('searchEngineId', searchEngineId);
        localStorage.setItem('dateRestrict', dateRestrict);
    }

    // Function to create settings form
    function createSettingsForm() {
        const form = document.createElement('div');
        form.id = 'settings-form';
        form.innerHTML = `
        <input type="text" id="api-key-input" placeholder="API Key" value="${loadSettings().apiKey}">
        <input type="text" id="search-engine-id-input" placeholder="Search Engine ID" value="${loadSettings().searchEngineId}">
        <button id="save-settings">Save</button>
    `;
        document.body.appendChild(form);

        document.getElementById('save-settings').addEventListener('click', function () {
            const apiKey = document.getElementById('api-key-input').value;
            const searchEngineId = document.getElementById('search-engine-id-input').value;
            saveSettings(apiKey, searchEngineId);
            form.style.display = 'none'; // Hide the form after saving settings
        });
    }

    // Create a button to show/hide the settings form
    const showSettingsButton = document.createElement('button');
    showSettingsButton.id = 'show-settings';
    showSettingsButton.textContent = 'Settings';
    document.body.appendChild(showSettingsButton);

    showSettingsButton.addEventListener('click', function () {
        const form = document.getElementById('settings-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Create settings form on script load
    createSettingsForm();


    // Extract the search query from the URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    // Create the sidebar div
    const sidebar = document.createElement('div');
    sidebar.id = 'custom-search-sidebar';
    document.body.appendChild(sidebar);

    // Use the settings to construct the initial API request URL
    const { apiKey, searchEngineId, dateRestrict } = loadSettings();
    const requestUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&dateRestrict=${dateRestrict}`;

    // ...之前的代码...

    // Make the API request
    GM_xmlhttpRequest({
        method: 'GET',
        url: requestUrl,
        onload: function (response) {
            const results = JSON.parse(response.responseText);
            displayResults(results);
        },
        onerror: function (error) {
            console.error('API Request failed', error);
        }
    });

    // ...之前的代码...

    // Function to display results in the sidebar
    function displayResults(data) {
        const sidebar = document.getElementById('custom-search-sidebar');

        // Save the date restrict select element and remove it temporarily from the sidebar
        const dateRestrictSelect = document.getElementById('date-restrict-select');
        if (dateRestrictSelect && dateRestrictSelect.parentNode) {
            dateRestrictSelect.parentNode.removeChild(dateRestrictSelect);
        }

        // Clear existing results
        sidebar.innerHTML = '';

        // Re-add the date restrict select element to the sidebar
        if (dateRestrictSelect) {
            sidebar.appendChild(dateRestrictSelect);
        }

        if (data.items && data.items.length > 0) {
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.padding = '0';
            list.style.margin = '0';

            data.items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '10px';

                const title = document.createElement('div');
                title.style.fontWeight = 'bold';
                title.textContent = item.title;

                const link = document.createElement('a');
                link.href = item.link;
                link.textContent = item.displayLink;
                link.style.display = 'block';
                link.style.marginBottom = '5px';
                link.style.color = '#1a0dab';
                link.target = '_blank';

                const snippet = document.createElement('div');
                snippet.textContent = item.snippet;

                listItem.appendChild(title);
                listItem.appendChild(link);
                listItem.appendChild(snippet);

                list.appendChild(listItem);
            });

            sidebar.appendChild(list);
        } else {
            sidebar.textContent = 'No results found.';
        }
    }

    // ...之后的代码...


    // ...之前的代码...

    // Function to create the date restrict selector within the sidebar
    function createDateRestrictSelectorInSidebar() {
        const selector = document.createElement('select');
        selector.id = 'date-restrict-select';
        selector.innerHTML = `
        <option value="">Any time</option>
        <option value="d1">Past 24 hours</option>
        <option value="d7">Past week</option>
        <option value="m1">Past month</option>
        <option value="y1">Past year</option>
    `;

        // Pre-select the saved date restrict option
        const savedDateRestrict = loadSettings().dateRestrict;
        if (savedDateRestrict) {
            selector.value = savedDateRestrict;
        }

        // Event listener to update results on change
        selector.addEventListener('change', function () {
            const dateRestrict = selector.value;
            console.log(dateRestrict)
            saveSettings(loadSettings().apiKey, loadSettings().searchEngineId, dateRestrict);
            updateSearchResults();
        });

        // Add the selector to the sidebar
        const sidebar = document.getElementById('custom-search-sidebar');
        sidebar.insertBefore(selector, sidebar.firstChild);
    }

    // Function to update search results
    function updateSearchResults() {
        // Extract the search query from the URL
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');

        console.log(loadSettings())
        // Get updated settings
        const { apiKey, searchEngineId, dateRestrict } = loadSettings();

        // Construct the API request URL
        const requestUrl = dateRestrict
            ? `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&dateRestrict=${dateRestrict}`
            : `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

        // Make the API request and update the sidebar
        GM_xmlhttpRequest({
            method: 'GET',
            url: requestUrl,
            onload: function (response) {
                const results = JSON.parse(response.responseText);
                displayResults(results);
            },
            onerror: function (error) {
                console.error('API Request failed', error);
            }
        });
    }

    // ...之前的代码...


    // Call this function to create the date restrict selector inside the sidebar
    createDateRestrictSelectorInSidebar();

    // Rest of your script...


})();
