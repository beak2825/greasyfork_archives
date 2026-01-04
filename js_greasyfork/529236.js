// ==UserScript==
// @name         Chub Agnai Import Button
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  Add an Agnai import button to character pages on characterhub.org and chub.ai
// @author       EliseWindbloom
// @match        https://www.characterhub.org/*
// @match        https://characterhub.org/*
// @match        https://chub.ai/*
// @match        https://*.chub.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529236/Chub%20Agnai%20Import%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529236/Chub%20Agnai%20Import%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config
    const DEBUG = false; // Set to true to enable debug logging
    const CHECK_INTERVAL = 2000; // Interval for periodic checks in ms

    // Debug logging function
    function log(message) {
        if (DEBUG) {
            console.log(`[Agnai Import Button] ${message}`);
        }
    }

    // Check if we're on a character page
    function isCharacterPage() {
        return window.location.pathname.includes('/characters/');
    }

    // Determine which site we're on
    function getSiteType() {
        const hostname = window.location.hostname;
        if (hostname.includes('characterhub.org')) {
            return 'characterhub';
        } else if (hostname.includes('chub.ai')) {
            return 'chub';
        }
        return 'unknown';
    }

    // Extract the character identifier from the URL
    function getCharacterIdentifier() {
        const path = window.location.pathname;
        if (path.includes('/characters/')) {
            return path.split('characters/')[1];
        }
        return null;
    }

    // Check if we're on a numeric ID page (like https://chub.ai/characters/2535134)
    function isNumericIdPage() {
        const identifier = getCharacterIdentifier();
        return identifier && /^\d+$/.test(identifier);
    }

    // Extract full character identifier from image source - with safety checks
    function extractIdentifierFromImage() {
        try {
            // For chub.ai, look for the character image
            const charImage = document.querySelector('.ant-image-img');
            if (charImage && charImage.src) {
                const match = charImage.src.match(/avatars\/(.*?)\/chara_card/);
                if (match && match[1]) {
                    log(`Extracted identifier from image: ${match[1]}`);
                    return match[1];
                }
            }
        } catch (err) {
            console.error("[Agnai Import Button] Error extracting identifier from image:", err);
        }
        return null;
    }

    // Get the proper identifier, handling numeric ID pages
    function getProperIdentifier() {
        if (getSiteType() === 'chub' && isNumericIdPage()) {
            // For numeric IDs, we need to extract from the image
            const imageId = extractIdentifierFromImage();
            if (imageId) return imageId;
        }
        // Otherwise or as fallback use the URL path
        return getCharacterIdentifier();
    }

    // Construct the Agnai import URL
    function getImportUrl(identifier) {
        if (!identifier) return null;
        return `https://agnai.chat/character/create?import=${encodeURIComponent(identifier)}`;
    }

    // Function to create the button element for CharacterHub
    function createCharacterHubButton(importUrl) {
        if (!importUrl) return null;

        // Create the tooltip wrapper
        const tooltipDiv = document.createElement('div');
        tooltipDiv.className = 'tooltip';

        // Add the tooltip text
        const tooltipText = document.createElement('div');
        tooltipText.className = 'tooltiptext text-xs';
        tooltipText.textContent = 'Import to Agnai';
        tooltipDiv.appendChild(tooltipText);

        // Create the button (as an <a> tag)
        const button = document.createElement('a');
        button.href = importUrl;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'primary-button mr-1 max-w-xs max-h-sm inline-flex justify-center rounded-md px-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 py-1 agnai-import-button';
        button.style.cssText = 'display: inline-flex !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 9999 !important; background: #0066cc !important; transition: background 0.2s, transform 0.2s !important;';

        // Add hover effects
        button.addEventListener('mouseover', () => {
            button.style.background = '#004d99 !important'; // Darker blue on hover
            button.style.transform = 'scale(1.05)';
            button.style.cursor = 'pointer';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = '#0066cc !important'; // Original darker blue
            button.style.transform = 'scale(1)';
        });

        // Add the icon
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 's16 icon');
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('href', '/assets/download_icon-41be3d17.svg');
        svg.appendChild(image);
        button.appendChild(svg);

        // Add the "Ag" text, bigger and bolder
        const textDiv = document.createElement('div');
        textDiv.className = '-mt-0.5 s18 ml-2';
        textDiv.textContent = 'Ag';
        button.appendChild(textDiv);

        // Append the button to the tooltip wrapper
        tooltipDiv.appendChild(button);
        return tooltipDiv;
    }

    // Function to create the button element for Chub.ai
    function createChubButton(importUrl) {
        if (!importUrl) return null;

        // Create the button (using ant design to match the site's style)
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ant-btn css-ug5vhh ant-btn-default ant-btn-block mt-2 agnai-import-button';
        button.setAttribute('data-import-url', importUrl);

        // Set initial styles
        button.style.cssText = `
            background-color: #0066cc !important;
            color: white !important;
            border-color: #0066cc !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin-top: 8px !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
        `;

        // Add hover effects with inline styles to ensure they take precedence
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#004d99 !important';
            button.style.borderColor = '#004d99 !important';
            button.style.transform = 'scale(1.03)';
            button.style.boxShadow = '0 2px 8px rgba(0, 77, 153, 0.3)';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#0066cc !important';
            button.style.borderColor = '#0066cc !important';
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });

        // Create onclick event to open in new tab
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(importUrl, '_blank');
        });

        // Create content with icon and text
        const span = document.createElement('span');
        span.textContent = 'Import to Agnai';
        span.style.marginLeft = '8px';

        // Create "Ag" logo/text
        const logoSpan = document.createElement('span');
        logoSpan.textContent = 'Ag';
        logoSpan.style.fontWeight = 'bold';
        logoSpan.style.fontSize = '16px';

        // Add elements to button
        button.appendChild(logoSpan);
        button.appendChild(span);

        return button;
    }

    // Function to add or re-add the button for CharacterHub
    function ensureCharacterHubButtonExists() {
        try {
            const container = document.querySelector('.download-buttons');
            if (!container) {
                log('CharacterHub container not found yet');
                return false;
            }

            // Check if button already exists
            const existingButton = container.querySelector('.agnai-import-button');
            if (existingButton) {
                log('CharacterHub button already exists');
                return true;
            }

            // Create new button
            const identifier = getProperIdentifier();
            if (!identifier) {
                log('No character identifier found');
                return false;
            }

            const importUrl = getImportUrl(identifier);
            log(`Import URL: ${importUrl}`);

            const button = createCharacterHubButton(importUrl);
            if (button) {
                container.appendChild(button);
                log('CharacterHub button added');
                return true;
            }
        } catch (err) {
            console.error("[Agnai Import Button] Error adding CharacterHub button:", err);
        }
        return false;
    }

    // Function to add or re-add the button for Chub.ai
    function ensureChubButtonExists() {
        try {
            // Find the container with the import-chat button
            let importButtonContainer = null;
            const containers = document.querySelectorAll('.mt-4');
            for (let i = 0; i < containers.length; i++) {
                if (containers[i].querySelector('.import-chat')) {
                    importButtonContainer = containers[i];
                    break;
                }
            }

            if (!importButtonContainer) {
                log('Chub.ai container not found yet');
                return false;
            }

            // Get proper identifier
            const identifier = getProperIdentifier();
            if (!identifier) {
                log('No character identifier found');
                return false;
            }

            const importUrl = getImportUrl(identifier);
            log(`Import URL: ${importUrl}`);

            // Check if button exists already
            const existingButton = importButtonContainer.querySelector('.agnai-import-button');
            if (existingButton) {
                // If we're on a numeric ID page, check if we need to update the button
                if (getSiteType() === 'chub' && isNumericIdPage()) {
                    const currentUrl = existingButton.getAttribute('data-import-url');
                    // Only update if the URLs differ
                    if (currentUrl !== importUrl) {
                        log('Updating button with new identifier from image');
                        const newButton = createChubButton(importUrl);
                        if (newButton) {
                            importButtonContainer.replaceChild(newButton, existingButton);
                            return true;
                        }
                    }
                }
                log('Chub.ai button already exists');
                return true;
            }

            // Create new button
            const button = createChubButton(importUrl);
            if (button) {
                importButtonContainer.appendChild(button);
                log('Chub.ai button added');
                return true;
            }
        } catch (err) {
            console.error("[Agnai Import Button] Error adding Chub.ai button:", err);
        }
        return false;
    }

    // Main function to ensure button exists based on site
    function ensureButtonExists() {
        try {
            if (!isCharacterPage()) {
                log('Not on a character page, skipping button addition');
                return false;
            }

            const siteType = getSiteType();
            log(`Site detected: ${siteType}`);

            if (siteType === 'characterhub') {
                return ensureCharacterHubButtonExists();
            } else if (siteType === 'chub') {
                return ensureChubButtonExists();
            }
        } catch (err) {
            console.error("[Agnai Import Button] Error ensuring button exists:", err);
        }
        return false;
    }

    // Set up a MutationObserver to watch for DOM changes
    function setupObserver() {
        try {
            const observer = new MutationObserver((mutations) => {
                // Only run if we're on a character page
                if (isCharacterPage()) {
                    // Check for significant changes in the DOM that would warrant adding the button
                    for (const mutation of mutations) {
                        // Only proceed if nodes were added
                        if (mutation.addedNodes.length > 0) {
                            // Check if these nodes affect our target containers
                            let shouldCheck = false;
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === 1) { // Element node
                                    // Look for our target containers or images
                                    if ((node.classList && (node.classList.contains('download-buttons') ||
                                                          node.classList.contains('mt-4') ||
                                                          node.classList.contains('ant-image-img'))) ||
                                        node.querySelector) {
                                        shouldCheck = true;
                                        break;
                                    }
                                }
                            }

                            if (shouldCheck) {
                                log('Relevant DOM change detected, checking for button');
                                setTimeout(ensureButtonExists, 100); // Small delay to let DOM settle
                                break;
                            }
                        }
                    }
                }
            });

            // Start observing with a more focused approach
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            log('Observer set up to monitor DOM changes');
        } catch (err) {
            console.error("[Agnai Import Button] Error setting up observer:", err);
        }
    }

    // Check for URL changes
    function setupUrlChangeDetection() {
        try {
            let lastUrl = window.location.href;
            let checkUrlInterval = null;

            // Create a function that checks if the URL has changed
            const checkForUrlChange = () => {
                if (lastUrl !== window.location.href) {
                    log('URL changed from:', lastUrl, 'to:', window.location.href);
                    lastUrl = window.location.href;

                    // Add a delay to let the page render
                    setTimeout(() => {
                        ensureButtonExists();
                    }, 500);
                }
            };

            // Check every 200ms - less frequent to reduce CPU usage
            checkUrlInterval = setInterval(checkForUrlChange, 200);

            // Clear interval when page unloads to prevent memory leaks
            window.addEventListener('unload', () => {
                if (checkUrlInterval) {
                    clearInterval(checkUrlInterval);
                }
            });
        } catch (err) {
            console.error("[Agnai Import Button] Error setting up URL change detection:", err);
        }
    }

    // Add CSS to the document for any global styles
    function addGlobalStyles() {
        try {
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .agnai-import-button {
                    transition: all 0.3s ease !important;
                }
            `;
            document.head.appendChild(styleElement);
        } catch (err) {
            console.error("[Agnai Import Button] Error adding global styles:", err);
        }
    }

    // Initialize with a self-cleaning periodic check
    let periodicCheckInterval = null;

    function startPeriodicCheck() {
        if (periodicCheckInterval) {
            clearInterval(periodicCheckInterval);
        }

        periodicCheckInterval = setInterval(() => {
            if (isCharacterPage()) {
                const result = ensureButtonExists();

                // If on a numeric ID page and the button exists but we're still waiting for the image
                if (getSiteType() === 'chub' && isNumericIdPage() && !extractIdentifierFromImage()) {
                    log('Still waiting for image to load on numeric ID page');
                }
                // If the button was successfully added and we're not on a numeric ID page waiting for image
                else if (result && !(getSiteType() === 'chub' && isNumericIdPage() && !extractIdentifierFromImage())) {
                    log('Button successfully added, stopping periodic check');
                    clearInterval(periodicCheckInterval);
                    periodicCheckInterval = null;
                }
            } else {
                clearInterval(periodicCheckInterval);
                periodicCheckInterval = null;
            }
        }, CHECK_INTERVAL);

        // Clean up on page unload
        window.addEventListener('unload', () => {
            if (periodicCheckInterval) {
                clearInterval(periodicCheckInterval);
            }
        });
    }

    // Initialize
    function init() {
        try {
            log('Script initialized');
            log(`Current site: ${getSiteType()}`);

            // Add global styles
            addGlobalStyles();

            // Setup URL change detection
            setupUrlChangeDetection();

            // Setup DOM observer
            setupObserver();

            // Initial check
            ensureButtonExists();

            // Start periodic check
            startPeriodicCheck();
        } catch (err) {
            console.error("[Agnai Import Button] Error initializing script:", err);
        }
    }

    // Wait for the page to fully load before initializing
    if (document.readyState === 'loading') {
        window.addEventListener('load', init);
    } else {
        init();
    }
})();