// ==UserScript==
// @name        DeviantArt Viewed Deviations (API Enhanced)
// @namespace   http://tampermonkey.net/
// @version     0.2
// @description Adds a button to track viewed deviations, fetching details via API
// @author      Your Name
// @license MIT
// @match       https://www.deviantart.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/543672/DeviantArt%20Viewed%20Deviations%20%28API%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543672/DeviantArt%20Viewed%20Deviations%20%28API%20Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ** IMPORTANT: Replace with your actual Client ID and Client Secret **
    const CLIENT_ID = 'YOUR_CLIENT_ID';
    const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

    const API_BASE_URL = 'https://www.deviantart.com/api/v1/oauth2/';
    let accessToken = null;

    // Function to obtain an access token using Client Credentials Grant
    async function getAccessToken() {
        if (accessToken) return accessToken;

        const response = await fetch(`${API_BASE_URL}token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            })
        });

        const data = await response.json();
        if (data.access_token) {
            accessToken = data.access_token;
            return accessToken;
        } else {
            console.error('Failed to get access token:', data);
            return null;
        }
    }

    // Function to add a button to the page
    function addButton() {
        const button = document.createElement('button');
        button.innerText = 'Viewed Deviations';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';

        button.addEventListener('click', displayViewedDeviations);
        document.body.appendChild(button);
    }

    // Function to store a viewed deviation's URL
    async function storeViewedDeviation() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('deviantart.com/view/')) {
            const deviationIdMatch = currentUrl.match(/deviantart.com\/view\/(\d+)/);
            if (!deviationIdMatch) return;

            const deviationId = deviationIdMatch[1];
            let viewedDeviations = GM_getValue('viewedDeviations', []);

            // Check if deviation is already stored
            if (!viewedDeviations.some(dev => dev.id === deviationId)) {
                const token = await getAccessToken();
                if (!token) return;

                try {
                    const response = await fetch(`${API_BASE_URL}deviation/${deviationId}?access_token=${token}`);
                    const data = await response.json();

                    if (response.ok && data.deviationid) {
                        viewedDeviations.push({
                            id: deviationId,
                            url: currentUrl,
                            title: data.title,
                            thumbnail: data.thumbs && data.thumbs.length > 0 ? data.thumbs[0].src : null // Use first thumbnail if available
                        });
                        GM_setValue('viewedDeviations', viewedDeviations);
                        console.log('Stored viewed deviation:', currentUrl);
                    } else {
                        console.warn(`Deviation ${deviationId} not found or inaccessible via API.`);
                    }
                } catch (error) {
                    console.error('Error fetching deviation details:', error);
                }
            }
        }
    }

    // Function to display the UI with viewed deviations
    async function displayViewedDeviations() {
        const uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.top = '0';
        uiContainer.style.left = '0';
        uiContainer.style.width = '100%';
        uiContainer.style.height = '100%';
        uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        uiContainer.style.zIndex = '10000';
        uiContainer.style.overflowY = 'auto';

        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.placeholder = 'Search deviations...';
        searchBar.style.width = 'calc(100% - 20px)';
        searchBar.style.padding = '10px';
        searchBar.style.margin = '10px';
        searchBar.addEventListener('keyup', debounce(filterDeviations, 300));
        uiContainer.appendChild(searchBar);

        const deviationGrid = document.createElement('div');
        deviationGrid.id = 'deviationGrid'; // Add ID for easier selection
        deviationGrid.style.display = 'grid';
        deviationGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
        deviationGrid.style.gap = '10px';
        deviationGrid.style.padding = '10px';
        uiContainer.appendChild(deviationGrid);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.addEventListener('click', () => uiContainer.remove());
        uiContainer.appendChild(closeButton);

        document.body.appendChild(uiContainer);

        // Fetch and display deviations
        await updateDeviationGrid(deviationGrid);
    }

    // Function to update the deviation grid (can be called after filtering or initial load)
    async function updateDeviationGrid(gridElement) {
        gridElement.innerHTML = ''; // Clear previous content
        let viewedDeviations = GM_getValue('viewedDeviations', []);
        const token = await getAccessToken();

        for (const dev of viewedDeviations) {
            // Check if deviation still exists via API before displaying
            if (await checkDeviationExistence(dev.id, token)) {
                const img = document.createElement('img');
                img.src = dev.thumbnail || 'https://www.deviantart.com/favicon.ico'; // Placeholder if no thumbnail
                img.alt = dev.title;
                img.title = dev.title; // Add title for tooltip
                img.style.width = '100%';
                img.style.height = '150px';
                img.style.objectFit = 'cover';
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => window.open(dev.url, '_blank'));
                gridElement.appendChild(img);
            } else {
                // If deviation is deleted, remove it from storage
                viewedDeviations = viewedDeviations.filter(d => d.id !== dev.id);
                GM_setValue('viewedDeviations', viewedDeviations);
                console.log(`Removed deleted deviation: ${dev.id}`);
            }
        }
    }

    // Function to check if a deviation exists via API
    async function checkDeviationExistence(deviationId, token) {
        if (!token) return false;

        try {
            const response = await fetch(`${API_BASE_URL}deviation/${deviationId}?access_token=${token}`);
            // If the response is not ok (e.g., 404), the deviation likely doesn't exist
            return response.ok;
        } catch (error) {
            console.error(`Error checking deviation ${deviationId}:`, error);
            return false;
        }
    }

    // Function to filter displayed deviations based on search input
    function filterDeviations(event) {
        const searchTerm = event.target.value.toLowerCase();
        const deviationGrid = document.getElementById('deviationGrid');
        if (!deviationGrid) return;

        const deviationImages = deviationGrid.querySelectorAll('img');

        deviationImages.forEach(img => {
            const deviationTitle = img.title.toLowerCase();
            if (deviationTitle.includes(searchTerm)) {
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });
    }

    // Debounce function to limit API calls on search input
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Initialize the script
    getAccessToken().then(() => {
        addButton();
        storeViewedDeviation();
    });
})();