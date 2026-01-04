// ==UserScript==
// @name         Giveaway Auto Enter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically enter giveaways on extrasforamazon.com
// @author       sacrosaunt
// @match        https://extrasforamazon.com/app/giveaways*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547667/Giveaway%20Auto%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/547667/Giveaway%20Auto%20Enter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Creates and injects the auto-enter button into the navigation bar
     * This function handles the UI setup for the giveaway automation tool
     */
    function createButton() {
        // Check if button already exists to avoid duplicates
        let existingButton = document.getElementById('giveaway-auto-enter-btn');
        if (existingButton) {
            return; // Button already exists, don't recreate
        }

        // Find the navigation container on the right side of the page
        // Try multiple selectors for compatibility across different page layouts
        const navRightContainer = document.querySelector('.nav_top_inner-wrap-right') || 
                                  document.querySelector('.nav_top-content > div:last-child');
        
        // If navigation container found, create button immediately
        if (navRightContainer) {
            createButtonElement(navRightContainer);
            return;
        }

        // If navigation container not found, keep checking until it appears
        // This ensures the button is added as soon as the container element is available
        const checkInterval = setInterval(() => {
            const container = document.querySelector('.nav_top_inner-wrap-right') || 
                             document.querySelector('.nav_top-content > div:last-child');
            
            if (container) {
                clearInterval(checkInterval); // Stop checking
                createButtonElement(container);
            }
        }, 100); // Check every 100ms for better responsiveness
        
        // Add a timeout to prevent infinite checking (10 seconds max)
        setTimeout(() => {
            clearInterval(checkInterval);
            // If still no container found after timeout, create fallback button
            if (!document.getElementById('giveaway-auto-enter-btn')) {
                const fallbackContainer = document.createElement('div');
                fallbackContainer.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                `;
                document.body.appendChild(fallbackContainer);
                createButtonElement(fallbackContainer);
            }
        }, 10000);
    }

    /**
     * Creates the actual button element and adds it to the specified container
     * @param {Element} container - The container to add the button to
     */
    function createButtonElement(container) {
        // Create the auto-enter button element
        const button = document.createElement('button');
        button.id = 'giveaway-auto-enter-btn';
        button.className = 'themeButton primaryLinkButton';
        button.title = 'Enter All Giveaways';
        button.disabled = true; // Initially disabled until DOM is ready
        
        // Apply custom styling to match the site's design
        button.style.cssText = `
            color: rgb(34, 51, 68);
            border: none;
            background: transparent;
            padding: 12px 16px;
            border-radius: 4px;
            cursor: not-allowed;
            font-size: 18px;
            margin-right: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            opacity: 0.6;
        `;
        
        // Add gift icon to the button
        button.innerHTML = '<i class="fal fa-gift" style="font-size: 2.8rem;"></i>';
        
        // Add hover effects for better user experience (only when enabled)
        button.addEventListener('mouseenter', () => {
            if (!button.disabled) {
                button.style.opacity = '0.8';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
                button.style.opacity = '1';
            }
        });
        
        // Insert button at the beginning of the container
        container.insertBefore(button, container.firstChild);
        
        // Check if button should be enabled immediately
        checkAndEnableButton();
    }

    /**
     * Checks if the button should be enabled and enables it if conditions are met
     * This ensures buttons are enabled regardless of when they're created
     */
    function checkAndEnableButton() {
        const button = document.getElementById('giveaway-auto-enter-btn');
        if (button && document.readyState !== 'loading') {
            enableGiveawayAutomation();
        }
    }

    /**
     * Main function that automates entering all eligible giveaways
     * This is the core functionality that processes giveaways one by one
     */
    function autoEnterGiveaways() {
        /**
         * Creates a toast notification system for user feedback
         * Shows success, info, and error messages during the automation process
         * @returns {Object} Toast system with show method
         */
        function createToastSystem() {
            // Check if toast container already exists
            let toastContainer = document.getElementById('giveaway-extension-toasts');
            if (!toastContainer) {
                // Create toast container for notifications
                toastContainer = document.createElement('div');
                toastContainer.id = 'giveaway-extension-toasts';
                toastContainer.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 10px;
                `;
                document.body.appendChild(toastContainer);
            }
            
            // Add CSS styles for toast notifications
            const style = document.createElement('style');
            style.textContent = `
                .giveaway-toast {
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 4px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    max-width: 300px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.3s, transform 0.3s;
                }
                .giveaway-toast.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .giveaway-toast.success {
                    border-left: 4px solid #4CAF50;
                }
                .giveaway-toast.info {
                    border-left: 4px solid #2196F3;
                }
                .giveaway-toast.error {
                    border-left: 4px solid #F44336;
                }
            `;
            document.head.appendChild(style);
            
            // Return toast system with show method
            return {
                show: function(message, type = 'info', duration = 3000) {
                    const toast = document.createElement('div');
                    toast.className = `giveaway-toast ${type}`;
                    toast.textContent = message;
                    
                    toastContainer.appendChild(toast);
                    
                    // Animate toast in
                    setTimeout(() => toast.classList.add('show'), 10);
                    
                    // Auto-remove toast after duration
                    setTimeout(() => {
                        toast.classList.remove('show');
                        setTimeout(() => toastContainer.removeChild(toast), 300);
                    }, duration);
                    
                }
            };
        }
        
        /**
         * Waits for an element to appear in the DOM
         * Uses MutationObserver for efficient element detection
         * @param {string} selector - CSS selector for the target element
         * @param {number} timeout - Maximum time to wait in milliseconds
         * @returns {Promise<Element>} Promise that resolves with the found element
         */
        function waitForElement(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                // Check if element already exists
                const element = document.querySelector(selector);
                if (element) {
                    return resolve(element);
                }
                
                // Set up observer to watch for DOM changes
                const observer = new MutationObserver((mutations, obs) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        obs.disconnect();
                        resolve(element);
                    }
                });
                
                // Start observing DOM changes
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
                
                // Set timeout to prevent infinite waiting
                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Timeout waiting for ${selector}`));
                }, timeout);
            });
        }
        
        /**
         * Waits for the page to fully load
         * @returns {Promise} Promise that resolves when page is loaded
         */
        function waitForPageLoad() {
            return new Promise(resolve => {
                if (document.readyState === 'complete') {
                    return resolve();
                }
                
                window.addEventListener('load', resolve, { once: true });
            });
        }
        
        /**
         * Waits for the DOM to become stable (no more rapid changes)
         * This prevents issues with elements being modified while we're trying to interact with them
         * @param {number} timeoutMs - Time to wait for stability in milliseconds
         * @returns {Promise} Promise that resolves when DOM is stable
         */
        function waitForDomStable(timeoutMs = 100) {
            return new Promise(resolve => {
                let timeout;
                
                // Watch for DOM mutations and reset timer
                const observer = new MutationObserver(() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        observer.disconnect();
                        resolve();
                    }, timeoutMs);
                });
                
                // Start observing DOM changes
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
                
                // Fallback timeout if no mutations occur
                timeout = setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, timeoutMs);
            });
        }
        
        /**
         * Main processing loop that enters giveaways one by one
         * Handles the entire workflow from finding eligible giveaways to completing entries
         */
        async function processGiveaways() {
            const toast = createToastSystem();

            // Show initial status message
            toast.show('Starting...', 'info', 2000);
            
            let continueProcessing = true;
            
            // Main processing loop
            while (continueProcessing) {
                // Wait for page to be ready before processing
                await waitForPageLoad();
                await waitForDomStable();
                
                // Find all eligible giveaways (those that can be entered)
                const eligibleGiveaways = document.querySelectorAll('button.giveaway-tile.eligible');
                
                // If no eligible giveaways found, we're done
                if (eligibleGiveaways.length === 0) {
                    toast.show('All giveaways have been entered!', 'success', 5000);
                    continueProcessing = false;
                    break;
                }
                
                try {
                    // Process the first eligible giveaway
                    const giveaway = eligibleGiveaways[0];
                    
                    // Extract giveaway name for user feedback
                    const nameElement = giveaway.querySelector('.giveaway-tile_name');
                    const giveawayName = nameElement?.textContent?.trim() || "giveaway";
                    
                    // Click on the giveaway to open it
                    giveaway.click();
                    
                    // Wait for and click the enter button
                    const enterButton = await waitForElement('div.giveaway-enter-form button[type="submit"]');
                    
                    // Small delay to ensure form is ready
                    await new Promise(r => setTimeout(r, 100));
                    
                    enterButton.click();
                    toast.show(`Successfully entered ${giveawayName}!`, 'success');
                    
                    // Wait for DOM to stabilize after entry
                    await waitForDomStable();
                    
                    // Find and click back button to return to giveaway list
                    const backButton = await waitForElement('div.giveaway-overlay_header button');
                    backButton.click();
                    
                    // Wait for page to stabilize before continuing
                    await waitForDomStable();
                    
                } catch (error) {
                    // Handle errors during giveaway processing
                    toast.show(`Error: ${error.message}`, 'error', 5000);
                    
                    // Try to recover by clicking back button if possible
                    try {
                        const backButton = document.querySelector('div.giveaway-overlay_header button');
                        if (backButton) backButton.click();
                        await waitForDomStable();
                    } catch (e) {
                        toast.show("Couldn't find back button, trying to continue...", 'info');
                    }
                    
                    // Implement retry logic (one retry)
                    if (continueProcessing === true) {
                        continueProcessing = "last_try";
                        toast.show("Encountered an error, will try once more", 'info');
                    } else {
                        continueProcessing = false;
                        toast.show("Too many errors, stopping process", 'error', 5000);
                    }
                }
            }
        }
        
        // Start the giveaway processing
        processGiveaways();
    }

    // Initialize the button immediately for better user experience
    // The button will be visible early, but giveaway automation will wait for DOM to be ready
    createButton();

    // Wait for DOM content to be fully loaded before allowing giveaway automation to start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Enable the button functionality once DOM is ready
            enableGiveawayAutomation();
        });
    } else {
        // DOM is already loaded, enable immediately
        enableGiveawayAutomation();
    }

    /**
     * Enables the giveaway automation functionality once the DOM is ready
     * This ensures all necessary elements are available before processing begins
     */
    function enableGiveawayAutomation() {
        const button = document.getElementById('giveaway-auto-enter-btn');
        if (button) {
            // Remove any existing listeners and add the main one
            button.removeEventListener('click', autoEnterGiveaways);
            button.addEventListener('click', autoEnterGiveaways);
            
            // Enable the button (remove any disabled state)
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }

})();
