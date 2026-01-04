// ==UserScript==
// @name         Kanji Visualizer
// @namespace    https://marumori.io/
// @version      0.1
// @description  Kanji Visualizer with persistent dropdown
// @author       Matskye
// @match        https://marumori.io/*
// @grant        GM.xmlHttpRequest
// @connect      public-api.marumori.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511590/Kanji%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/511590/Kanji%20Visualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to log messages with a prefix
    function log(message) {
        console.log(`[Kanji-Visualizer]: ${message}`);
    }

    // Function to inject the "Scripts" dropdown into the navbar
    function injectScriptsDropdown() {
        // Potential navbar selectors based on site inspection
        const navbarSelectors = [
            'nav',
            '[role="navigation"]',
            '.navbar',
            '.nav',
            '[aria-label="main navigation"]',
            '[data-testid="navbar"]',
            '#main-navbar'
        ];

        let navbar = null;

        // Find the navbar element
        for (const selector of navbarSelectors) {
            navbar = document.querySelector(selector);
            if (navbar) {
                log(`Navbar found using selector: "${selector}"`);
                break;
            }
        }

        if (!navbar) {
            log('Navbar not found. Will retry...');
            return; // Exit if navbar not found; observer will handle retries
        }

        // Check if the "Scripts" dropdown is already injected
        if (document.getElementById('scripts-dropdown-wrapper')) {
            log('"Scripts" dropdown already exists. Skipping injection.');
            return;
        }

        // Create the dropdown wrapper matching existing site structure
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.className = 'sub-menu-wrapper svelte-pchasl';
        dropdownWrapper.id = 'scripts-dropdown-wrapper'; // Unique ID to prevent duplication
        dropdownWrapper.style.position = 'relative'; // Establish positioning context

        // Create the profile list container
        const profileList = document.createElement('ul');
        profileList.className = 'profile-list-wrapper svelte-pchasl';

        // Create the "Scripts" button
        const scriptsLi = document.createElement('li');

        const scriptsButton = document.createElement('button');
        scriptsButton.className = 'svelte-1irkqfc';
        scriptsButton.setAttribute('aria-haspopup', 'true');
        scriptsButton.setAttribute('aria-expanded', 'false');

        const scriptsLink = document.createElement('a');
        scriptsLink.href = '#'; // Prevent default navigation
        scriptsLink.className = 'link svelte-1irkqfc';
        scriptsLink.innerHTML = `
            <svg class="icon undefined" style="width: 1.5rem; height: 1.5rem;" viewBox="0 0 24 24" fill="var(--dark-gray)" xmlns="http://www.w3.org/2000/svg">
                <!-- Replace the path below with the actual SVG path from the site's existing dropdown icons -->
                <path d="M7 10l5 5 5-5H7z"></path>
            </svg>
            <span class="text svelte-1irkqfc">Scripts</span>
        `;

        scriptsButton.appendChild(scriptsLink);
        scriptsLi.appendChild(scriptsButton);
        profileList.appendChild(scriptsLi);

        // Append the profile list to the dropdown wrapper
        dropdownWrapper.appendChild(profileList);

        // Create the dropdown content container
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'sub-menu-content svelte-pchasl'; // Assuming similar class for dropdown content
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.top = '100%'; // Position directly below the button
        dropdownContent.style.left = '0';
        dropdownContent.style.zIndex = '1000'; // Ensure it overlays other content
        dropdownContent.style.display = 'none'; // Hidden by default
        dropdownContent.style.backgroundColor = 'var(--navbar-background, #808080)'; // Match navbar background
        dropdownContent.style.minWidth = '160px'; // Minimum width
        dropdownContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        dropdownContent.style.borderRadius = '4px';
        dropdownContent.style.padding = '5px 0'; // Optional padding

        // Create the list for dropdown items
        const dropdownUl = document.createElement('ul');
        dropdownUl.className = 'profile-list-wrapper svelte-pchasl';
        dropdownUl.style.listStyle = 'none'; // Remove default list styles
        dropdownUl.style.margin = '0';
        dropdownUl.style.padding = '0';

        // Create the "Start Kanji Visualizer" item
        const kanjiLi = document.createElement('li');

        const kanjiButton = document.createElement('button');
        kanjiButton.className = 'svelte-1irkqfc';
        kanjiButton.id = 'start-kanji-visualizer';
        kanjiButton.setAttribute('aria-label', 'Start Kanji Visualizer');
        kanjiButton.style.width = '100%'; // Make button full width
        kanjiButton.style.background = 'none';
        kanjiButton.style.border = 'none';
        kanjiButton.style.padding = '10px 20px';
        kanjiButton.style.textAlign = 'left';
        kanjiButton.style.cursor = 'pointer';
        kanjiButton.style.fontSize = '16px';

        const kanjiLink = document.createElement('a');
        kanjiLink.href = '#'; // Prevent default navigation
        kanjiLink.className = 'link svelte-1irkqfc';
        kanjiLink.innerHTML = `
            <svg class="icon undefined" style="width: 1.5rem; height: 1.5rem; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="var(--dark-gray)" xmlns="http://www.w3.org/2000/svg">
                <!-- Replace the path below with the actual SVG path from the site's existing dropdown icons -->
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
            </svg>
            <span class="text svelte-1irkqfc">Start Kanji Visualizer</span>
        `;

        kanjiButton.appendChild(kanjiLink);
        kanjiLi.appendChild(kanjiButton);
        dropdownUl.appendChild(kanjiLi);
        dropdownContent.appendChild(dropdownUl);

        // Append the dropdown content to the wrapper
        dropdownWrapper.appendChild(dropdownContent);

        // Append the dropdown wrapper to the navbar
        navbar.appendChild(dropdownWrapper);
        log('"Scripts" dropdown injected successfully.');

        // Attach event listeners for accessibility and functionality
        scriptsButton.addEventListener('click', function(event) {
            event.preventDefault();
            const expanded = scriptsButton.getAttribute('aria-expanded') === 'true';
            scriptsButton.setAttribute('aria-expanded', !expanded);
            dropdownContent.style.display = expanded ? 'none' : 'block';
        });

        // Close the dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdownWrapper.contains(event.target)) {
                scriptsButton.setAttribute('aria-expanded', 'false');
                dropdownContent.style.display = 'none';
            }
        });

        // Attach event listener to "Start Kanji Visualizer"
        kanjiButton.addEventListener('click', function(event) {
            event.preventDefault();
            showApiPopup();
        });
    }

    // Function to show the API key popup
    function showApiPopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '1000';

        // Create popup container
        const popup = document.createElement('div');
        popup.id = 'api-popup';
        popup.innerHTML = `
            <div style="background-color: var(--background-color, #fff); padding: 20px; border-radius: 8px; width: 300px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="margin-top: 0; text-align: center;">Enter Your API Key</h2>
                <label for="api-key">API Key:</label>
                <input type="text" id="api-key" style="width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box;" />
                <button id="submit-api" style="width: 100%; padding: 10px; background-color: var(--primary-color, #007BFF); color: #fff; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
                <div id="error-message" style="color: red; margin-top: 10px; text-align: center;"></div>
            </div>
        `;
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = '1001'; // Higher than overlay

        // Append overlay and popup to the body
        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        // Handle API key submission
        document.getElementById('submit-api').addEventListener('click', function() {
            const apiKey = document.getElementById('api-key').value.trim();
            if (!apiKey) {
                displayError('Please enter your API key.');
                return;
            }
            log('API key submitted.');
            overlay.remove();
            popup.remove();
            fetchKanjiData(apiKey);
        });

        // Close popup when clicking outside the popup container
        overlay.addEventListener('click', function() {
            overlay.remove();
            popup.remove();
        });

        function displayError(message) {
            const errorDiv = document.getElementById('error-message');
            if (errorDiv) {
                errorDiv.textContent = message;
            }
        }

        // Reuse the log function from the main script
        function log(message) {
            console.log(`[Kanji-Visualizer]: ${message}`);
        }
    }

    function fetchKanjiData(apiKey) {
        log('Fetching Kanji data with API key...');
        GM.xmlHttpRequest({
            method: 'GET',
            url: 'https://public-api.marumori.io/known/kanji',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                log(`API response status: ${response.status}`);
                if (response.status === 200) {
                    try {
                        const kanjiData = JSON.parse(response.responseText);
                        log('Parsed Kanji data successfully.');
                        if (kanjiData && Array.isArray(kanjiData.items)) {
                            log(`Kanji data received. Total items: ${kanjiData.items.length}`);
                            openNewTabWithKanji(kanjiData.items);
                        } else {
                            alert('Unexpected response format, no kanji data found.');
                            log('Response data does not contain "items" array.');
                        }
                    } catch (error) {
                        console.error('Error parsing Kanji data:', error);
                        alert('Error parsing Kanji data. Check the console for more details.');
                    }
                } else {
                    alert(`Failed to fetch Kanji data. Status: ${response.status}`);
                    log('Response text:', response.responseText);
                }
            },
            onerror: function(error) {
                console.error('Error fetching Kanji:', error);
                alert('Error fetching Kanji. Check the console for more details.');
            }
        });
    }

    // Function to open a new tab and display Kanji data as an image
    function openNewTabWithKanji(kanjiData) {
        log('Opening new tab for Kanji display...');
        const newTab = window.open('', '_blank');
        if (!newTab) {
            alert('Unable to open a new tab. Please enable pop-ups.');
            return;
        }

        // Serialize the Kanji data to pass to the new tab
        const kanjiDataJSON = JSON.stringify(kanjiData);

        // Write the HTML content to the new tab
        newTab.document.open();
        newTab.document.write(`
            <html>
                <head>
                    <title>Kanji Visualizer</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            background-color: #000000; /* Black background */
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            color: #FFFFFF;
                            font-family: Arial, sans-serif;
                        }
                        #kanjiCanvas {
                            border: 2px solid #FFFFFF;
                        }
                        #downloadBtn {
                            margin-top: 20px;
                            padding: 10px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            background-color: #444444;
                            color: #FFFFFF;
                            border: none;
                            border-radius: 5px;
                        }
                        #downloadBtn:hover {
                            background-color: #666666;
                        }
                    </style>
                </head>
                <body>
                    <canvas id="kanjiCanvas"></canvas>
                    <button id="downloadBtn">Download Image</button>
                    <script>
                        // Parse the Kanji data passed from the parent window
                        const kanjiData = ${kanjiDataJSON};

                        // Function to map level to color
                        function getColor(level) {
                            level = parseInt(level, 10); // Ensure level is integer
                            const colors = {
                                1: '#8B0000', // Dark Red
                                2: '#FF0000', // Red
                                3: '#FF4500', // Orange Red
                                4: '#FFA500', // Orange
                                5: '#FFD700', // Gold
                                6: '#008000', // Green
                                7: '#00CED1', // Dark Turquoise (a shade of blue)
                                8: '#0000FF', // Blue
                                9: '#ADD8E6'  // Light Blue
                            };
                            return colors[level] || '#FFFFFF'; // Default to white
                        }

                        // Function to draw Kanji on canvas
                        function drawKanji() {
                            const canvas = document.getElementById('kanjiCanvas');
                            const ctx = canvas.getContext('2d');

                            // Define canvas dimensions based on number of Kanji
                            const kanjiPerRow = 30; // Adjust as needed
                            const kanjiSize = 30;    // Font size in pixels
                            const padding = 10;      // Padding between Kanji
                            const rows = Math.ceil(kanjiData.length / kanjiPerRow);

                            canvas.width = kanjiPerRow * (kanjiSize + padding);
                            canvas.height = rows * (kanjiSize + padding);

                            // Fill background with black
                            ctx.fillStyle = '#000000';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            // Set Kanji font
                            ctx.font = \`\${kanjiSize}px Arial\`;
                            ctx.textBaseline = 'top';

                            kanjiData.forEach((item, index) => {
                                const row = Math.floor(index / kanjiPerRow);
                                const col = index % kanjiPerRow;
                                const x = col * (kanjiSize + padding);
                                const y = row * (kanjiSize + padding);

                                // Set color based on level
                                ctx.fillStyle = getColor(item.level);
                                // Optional: Add shadow for better visibility
                                ctx.shadowColor = '#000000';
                                ctx.shadowBlur = 2;
                                ctx.shadowOffsetX = 1;
                                ctx.shadowOffsetY = 1;

                                // Draw Kanji character
                                ctx.fillText(item.item, x, y);
                            });

                            log('Kanji rendered on canvas.');
                        }

                        // Logging function
                        function log(message) {
                            console.log(\`[Kanji-Visualizer]: \${message}\`);
                        }

                        // Draw Kanji when the page loads
                        window.onload = drawKanji;

                        // Handle download button click
                        document.getElementById('downloadBtn').addEventListener('click', function() {
                            const canvas = document.getElementById('kanjiCanvas');
                            const link = document.createElement('a');
                            link.download = 'kanji_visualizer.png';
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        });
                    </script>
                </body>
            </html>
        `);
        newTab.document.close();

        log('Kanji rendering script injected into new tab.');
    }

    // Function to observe navbar mutations and inject dropdown when necessary
    function observeNavbar() {
        // Potential navbar selectors based on site inspection
        const navbarSelectors = [
            'nav',
            '[role="navigation"]',
            '.navbar',
            '.nav',
            '[aria-label="main navigation"]',
            '[data-testid="navbar"]',
            '#main-navbar' // Adjust if there's a unique ID
        ];

        // Function to find and inject the dropdown
        function findAndInject() {
            let navbar = null;
            for (const selector of navbarSelectors) {
                navbar = document.querySelector(selector);
                if (navbar) {
                    log(`Navbar found using selector: "${selector}"`);
                    break;
                }
            }

            if (navbar) {
                injectScriptsDropdown();
            } else {
                log('Navbar not found during observation.');
            }
        }

        // Create a MutationObserver to watch for changes in the navbar
        const observer = new MutationObserver((mutations, obs) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    log('Navbar mutation detected. Checking for dropdown...');
                    findAndInject();
                }
            }
        });

        // Start observing each navbar selector
        navbarSelectors.forEach(selector => {
            const targetNode = document.querySelector(selector);
            if (targetNode) {
                observer.observe(targetNode, { childList: true, subtree: true });
                log(`Observing changes to navbar using selector: "${selector}"`);
            }
        });

        // Fallback: Observe the entire document for navbar additions
        observer.observe(document.body, { childList: true, subtree: true });
        log('Started observing the document for navbar changes.');
    }

    // Initialize the script
    function init() {
        // Initial injection attempt
        injectScriptsDropdown();

        // Start observing for dynamic changes
        observeNavbar();
    }

    // Run the initializer after the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
