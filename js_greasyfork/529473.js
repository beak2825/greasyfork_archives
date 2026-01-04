// ==UserScript==
// @name         Steam Workshop Copy SteamCMD Button
// @namespace    http://steamcommunity.com/
// @version      1.1
// @description  Adds a button to copy SteamCMD workshop download commands
// @author       TheFantasticLoki
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        https://steamcommunity.com/workshop/filedetails/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529473/Steam%20Workshop%20Copy%20SteamCMD%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529473/Steam%20Workshop%20Copy%20SteamCMD%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to extract item ID from URL
    function getWorkshopItemIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    // Function to find game ID
    function getGameId() {
        // Look for game ID in breadcrumbs
        const breadcrumbs = document.querySelectorAll('.breadcrumbs a');
        for (const crumb of breadcrumbs) {
            const href = crumb.getAttribute('href');
            if (href && href.includes('/app/')) {
                const match = href.match(/\/app\/(\d+)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        
        // Alternative method: look for game app link
        const appLinks = document.querySelectorAll('a[href*="/app/"]');
        for (const link of appLinks) {
            const match = link.href.match(/\/app\/(\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    function createCopyButton(gameId, workshopItemId) {
        // Create styles for our custom elements
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .steam_cmd_copy_btn {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                width: 33px;
                height: 33px;
                background: #3d6c8d;
                border-radius: 4px;
                margin: 0 5px;
                transition: background 0.2s;
                position: relative;
            }
            .steam_cmd_copy_btn:hover {
                background: #67c1f5;
            }
            .steam_cmd_copy_btn svg {
                width: 25px;
                height: 25px;
                vertical-align: middle;
                fill: white;
            }
            .steam_cmd_copy_tooltip {
                display: none;
                position: fixed;
                background-color: #171a21;
                color: #fff;
                text-align: center;
                border-radius: 3px;
                padding: 8px 12px;
                z-index: 9999;
                border: 1px solid #4d4d4d;
                white-space: nowrap;
                font-size: 12px;
                box-shadow: 0 0 5px rgba(0,0,0,0.3);
                pointer-events: none;
            }
            .steam_cmd_command {
                font-family: monospace;
                background: #32353c;
                padding: 4px 6px;
                border-radius: 2px;
                margin-top: 5px;
                display: block;
            }
        `;
        document.head.appendChild(styleEl);
        
        // Create the button element
        const copyButton = document.createElement('div');
        copyButton.className = 'steam_cmd_copy_btn';
        
        // Create SVG icon for clipboard
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
        `;
        
        // Create tooltip as a separate element attached to body
        const tooltip = document.createElement('div');
        tooltip.className = 'steam_cmd_copy_tooltip';
        tooltip.innerHTML = `Copy SteamCMD<span class="steam_cmd_command">workshop_download_item ${gameId} ${workshopItemId}</span>`;
        document.body.appendChild(tooltip);
        
        // Handle tooltip positioning
        copyButton.addEventListener('mouseenter', function(e) {
            const rect = copyButton.getBoundingClientRect();
            tooltip.style.display = 'block';
            
            // Position tooltip above the button
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            // If tooltip would go off the top, show it below instead
            if (rect.top - tooltip.offsetHeight < 0) {
                tooltip.style.top = rect.bottom + 10 + 'px';
            }
        });
        
        copyButton.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
        
        // Add click event to copy the command
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const command = `workshop_download_item ${gameId} ${workshopItemId}`;
            GM_setClipboard(command);
            
            // Visual feedback
            tooltip.innerHTML = 'Copied!';
            setTimeout(function() {
                tooltip.innerHTML = `Copy SteamCMD<span class="steam_cmd_command">workshop_download_item ${gameId} ${workshopItemId}</span>`;
            }, 2000);
        });
        
        // Clean up tooltip when button is removed
        const cleanupTooltip = new MutationObserver(function(mutations) {
            if (!document.body.contains(copyButton)) {
                tooltip.remove();
                cleanupTooltip.disconnect();
            }
        });
        cleanupTooltip.observe(document.body, { childList: true, subtree: true });
        
        return copyButton;
    }
    
    
    // Main function to run when page is loaded
    function addCopyButtons() {
        // Check if we've already run
        if (document.querySelector('.steam_cmd_copy_btn')) {
            return; // Skip if buttons already exist
        }
        
        const gameId = getGameId();
        if (!gameId) {
            console.log('Could not find game ID');
            return;
        }
        
        // First check for single item page
        const singleSubscribeButton = document.getElementById('SubscribeItemBtn');
        if (singleSubscribeButton) {
            const workshopItemId = getWorkshopItemIdFromUrl();
            if (workshopItemId) {
                // Find the parent div of the subscribe button
                const subscribeButtonContainer = singleSubscribeButton.closest('div');
                if (subscribeButtonContainer && subscribeButtonContainer.parentNode) {
                    // Create a new container div for our button
                    const copyButtonContainer = document.createElement('div');
                    copyButtonContainer.style.display = 'inline-block';
                    copyButtonContainer.style.marginLeft = '5px';
                    
                    // Add the copy button to its container
                    const copyButton = createCopyButton(gameId, workshopItemId);
                    copyButtonContainer.appendChild(copyButton);
                    
                    // Insert after the subscribe button's container
                    subscribeButtonContainer.parentNode.insertBefore(
                        copyButtonContainer, 
                        subscribeButtonContainer.nextSibling
                    );
                }
            }
            return;
        }
        
        // Collection page handling - targeting the exact structure seen in collections
        const subscriptionControls = document.querySelectorAll('.subscriptionControls');
        subscriptionControls.forEach(controlsDiv => {
            // Check if we already added a button here
            if (controlsDiv.querySelector('.steam_cmd_copy_btn')) {
                return;
            }

            // Find the subscribe button inside this controls div
            const subscribeButton = controlsDiv.querySelector('[id^="SubscribeItemBtn"]');
            if (subscribeButton) {
                // Extract workshop ID from button ID (format: SubscribeItemBtn###)
                const match = subscribeButton.id.match(/SubscribeItemBtn(\d+)/);
                if (match && match[1]) {
                    const workshopItemId = match[1];

                    // Create copy button
                    const copyButton = createCopyButton(gameId, workshopItemId);

                    // Directly append to the controls div instead of creating a new container
                    controlsDiv.appendChild(copyButton);
                }
            }
        });
    }
    
    // Use mutation observer to run when content changes (for dynamic loading)
    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    addCopyButtons();
                }
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Check if the page is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        addCopyButtons();
        initObserver();
    } else {
        // Wait for page to load
        window.addEventListener('DOMContentLoaded', () => {
            addCopyButtons();
            initObserver();
        });
    }
})();
