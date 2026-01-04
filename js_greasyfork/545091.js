// ==UserScript==
// @name         RRC API Search Helper
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Helper for RRC oil and gas well records search with cross-app integration
// @author       You
// @match        https://rrcsearch3.neubus.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/545091/RRC%20API%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545091/RRC%20API%20Search%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Function to perform the search
    function performSearch(apiNumber) {
        if (apiNumber && apiNumber.length > 0) {
            console.log('Performing search for API:', apiNumber);

            // Fill the API field
            const apiField = document.getElementById('api_ftTEXT');
            if (apiField) {
                apiField.value = apiNumber;

                // Trigger the search after a short delay to ensure the page is ready
                setTimeout(() => {
                    const searchButton = document.getElementById('docSearchButton');
                    if (searchButton) {
                        searchButton.click();
                    }
                }, 500);
            }
        }
    }

    // Check for API parameter in URL when page loads
    window.addEventListener('load', function() {
        console.log('RRC API Search Helper loaded');

        // Check for API number in URL parameter
        const urlApiNumber = getUrlParameter('api');
        if (urlApiNumber) {
            console.log('Found API in URL:', urlApiNumber);
            performSearch(urlApiNumber);

            // Clean up the URL parameter
            const url = new URL(window.location);
            url.searchParams.delete('api');
            window.history.replaceState({}, document.title, url);
            return; // Don't add the quick search form if we're auto-searching
        }

        // Check for stored API number from cross-application communication
        const storedApiNumber = GM_getValue('pendingApiSearch', '');
        if (storedApiNumber) {
            console.log('Found stored API:', storedApiNumber);
            GM_deleteValue('pendingApiSearch'); // Clean up
            performSearch(storedApiNumber);
            return; // Don't add the quick search form if we're auto-searching
        }

        // Add the quick-fill form (original functionality)
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            const quickFillDiv = document.createElement('div');
            quickFillDiv.innerHTML = `
                <hr>
                <h3>Quick API Search</h3>
                <input type="text" id="quickApiInput" placeholder="Enter API Number" maxlength="8">
                <button id="quickSearchBtn">Quick Search</button>
                <button id="openInNewTabBtn">Open in New Tab</button>
            `;
            searchForm.appendChild(quickFillDiv);

            // Add click handlers
            document.getElementById('quickSearchBtn').addEventListener('click', function() {
                const apiNumber = document.getElementById('quickApiInput').value;
                if (apiNumber) {
                    performSearch(apiNumber);
                }
            });

            // Add handler for opening in new tab
            document.getElementById('openInNewTabBtn').addEventListener('click', function() {
                const apiNumber = document.getElementById('quickApiInput').value;
                if (apiNumber) {
                    const newUrl = window.location.origin + window.location.pathname + '?api=' + encodeURIComponent(apiNumber);
                    window.open(newUrl, '_blank');
                }
            });

            // Allow Enter key to trigger search
            document.getElementById('quickApiInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const apiNumber = this.value;
                    if (apiNumber) {
                        performSearch(apiNumber);
                    }
                }
            });
        }
    });

    // Global function for other applications to call
    window.searchRRCAPI = function(apiNumber) {
        if (window.location.href.includes('rrcsearch3.neubus.com')) {
            // We're already on the RRC site, perform search directly
            performSearch(apiNumber);
        } else {
            // Store the API number and open the RRC site
            GM_setValue('pendingApiSearch', apiNumber);
            const rrcUrl = 'https://rrcsearch3.neubus.com/index.php?_module_=esd&_action_=keysearch&profile=17&api=' + encodeURIComponent(apiNumber);
            window.open(rrcUrl, '_blank');
        }
    };

})();
