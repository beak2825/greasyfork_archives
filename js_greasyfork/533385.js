// ==UserScript==
// @name         Google Amazon.sa Search Button (Desktop & Mobile)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds an Amazon.sa search button. Desktop: next to Google Search button. Mobile: inside search bar as an icon. (Desktop fix)
// @author       abadi718
// @match        *://*.google.com/*
// @match        *://*.google.com.sa/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.sa
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533385/Google%20Amazonsa%20Search%20Button%20%28Desktop%20%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533385/Google%20Amazonsa%20Search%20Button%20%28Desktop%20%20Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const amazonDomain = 'https://www.amazon.sa';
    const desktopButtonText = 'Search Amazon.sa';
    const desktopSpaceBetweenButtons = '4px';
    const mobileIconContent = 'amazon'; // Simple text icon
    const mobileIconSize = '28px'; // Size of the mobile icon button
    const mobileIconRightOffset = '45px'; // Pixels from the right edge of the search bar container
    // --- End Configuration ---

    const checkInterval = 300;
    const maxAttempts = 25;
    let attempts = 0;
    const scriptId = 'amazon-sa-search-button-userscript'; // Unique ID for elements

    function getSearchQuery() {
        const searchInput = document.querySelector('textarea[name="q"], input[name="q"]');
        return searchInput ? searchInput.value.trim() : null;
    }

    function performAmazonSearch() {
        const searchTerm = getSearchQuery();
        if (searchTerm) {
            const searchUrl = `${amazonDomain}/s?k=${encodeURIComponent(searchTerm)}`;
            window.location.href = searchUrl;
        } else {
            const searchInput = document.querySelector('textarea[name="q"], input[name="q"]');
            if (searchInput) searchInput.focus();
        }
    }

    // --- Desktop Button Logic ---
    function addDesktopButton(googleSearchButton) {
        try {
            const googleButtonStyles = window.getComputedStyle(googleSearchButton);
            const amazonButton = document.createElement('input');
            amazonButton.type = 'button';
            amazonButton.value = desktopButtonText;
            amazonButton.id = scriptId + '-desktop';

            // Apply styles dynamically from the Google button
            amazonButton.style.backgroundColor = googleButtonStyles.backgroundColor;
            amazonButton.style.color = googleButtonStyles.color;
            amazonButton.style.fontFamily = googleButtonStyles.fontFamily;
            amazonButton.style.fontSize = googleButtonStyles.fontSize;
            amazonButton.style.height = googleButtonStyles.height;
            amazonButton.style.lineHeight = googleButtonStyles.lineHeight;
            amazonButton.style.padding = googleButtonStyles.padding;
            amazonButton.style.margin = googleButtonStyles.margin;
            amazonButton.style.marginLeft = desktopSpaceBetweenButtons; // Override left margin
            amazonButton.style.border = googleButtonStyles.border;
            amazonButton.style.borderRadius = googleButtonStyles.borderRadius;
            amazonButton.style.cursor = 'pointer';
            amazonButton.style.display = googleButtonStyles.display;
            amazonButton.style.textAlign = googleButtonStyles.textAlign;
            amazonButton.style.verticalAlign = googleButtonStyles.verticalAlign;

            // Store original styles for hover/active effects restoration
            const originalBgColor = amazonButton.style.backgroundColor;
            const originalBorder = amazonButton.style.border; // Store the full border property
            let originalBoxShadow = amazonButton.style.boxShadow || 'none'; // Default to 'none'

             // --- Approximate Hover/Active effects (based on common Google light theme) ---
            // These might need adjustment if Google changes themes significantly or for dark mode perfection
            const hoverBorderColor = '#dadce0'; // Typical light theme hover border
            const hoverBoxShadow = '0 1px 1px rgba(0,0,0,.1)'; // Typical light theme hover shadow
            const activeBgColor = '#f1f3f4'; // Typical light theme active background


            amazonButton.onmouseover = function() {
                try { this.style.borderColor = hoverBorderColor; } catch(e){}
                try { this.style.boxShadow = hoverBoxShadow; } catch(e){}
            };
            amazonButton.onmouseout = function() {
                try { this.style.border = originalBorder; } catch(e){} // Restore original full border
                try { this.style.boxShadow = originalBoxShadow; } catch(e){}
            };
            amazonButton.onmousedown = function() {
                try { this.style.backgroundColor = activeBgColor; } catch(e){}
                try { this.style.borderColor = hoverBorderColor; } catch(e){} // Keep hover border color
                try { this.style.boxShadow = 'none'; } catch(e){} // Usually no shadow when pressed
            };
             amazonButton.onmouseup = function() {
                try { this.style.backgroundColor = originalBgColor; } catch(e){} // Restore original background
                 // Re-apply hover effect if mouse is still over the button
                 if (this.matches(':hover')) {
                     this.onmouseover(); // Trigger hover styles again
                 } else {
                     this.onmouseout(); // Restore default non-hover styles
                 }
             };

            // Add click listener
            amazonButton.addEventListener('click', performAmazonSearch);

            // Insert the button
            googleSearchButton.parentNode.insertBefore(amazonButton, googleSearchButton.nextSibling);
            // console.log('[Amazon.sa Button Userscript] Added Desktop Button.');
            return true;
        } catch (error) {
             console.error('[Amazon.sa Button Userscript] Error adding desktop button:', error);
             return false;
        }
    }

    // --- Mobile Icon Button Logic ---
    function addMobileIconButton(searchInput) {
         try {
             // Find the container - often a form or a div wrapping the input
             const searchContainer = searchInput.closest('div[jscontroller]'); // Specific common wrapper
             // Fallback to form or parent div
             const container = searchContainer || searchInput.closest('form') || searchInput.parentNode;

            if (!container) {
                 console.log('[Amazon.sa Button Userscript] Mobile container not found.');
                 return false;
            }

            // Ensure container can host absolutely positioned elements
            const containerPosition = window.getComputedStyle(container).position;
            if (containerPosition === 'static') {
                container.style.position = 'relative';
            }

            const amazonIcon = document.createElement('div');
            amazonIcon.id = scriptId + '-mobile';
            amazonIcon.textContent = mobileIconContent;

            // Style the icon button
            amazonIcon.style.position = 'absolute';
            amazonIcon.style.right = mobileIconRightOffset;
            amazonIcon.style.top = '50%';
            amazonIcon.style.transform = 'translateY(-50%)';
            amazonIcon.style.width = mobileIconSize;
            amazonIcon.style.height = mobileIconSize;
            amazonIcon.style.borderRadius = '50%';
            amazonIcon.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            amazonIcon.style.display = 'flex';
            amazonIcon.style.alignItems = 'center';
            amazonIcon.style.justifyContent = 'center';
            amazonIcon.style.cursor = 'pointer';
            amazonIcon.style.color = '#ff9900';
            amazonIcon.style.fontSize = '14px';
            amazonIcon.style.fontWeight = 'bold';
            amazonIcon.style.zIndex = '10';
            amazonIcon.style.textAlign = 'center';
            amazonIcon.style.userSelect = 'none';

            // Simple hover effect for mobile icon
            amazonIcon.onmouseover = function() { this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; };
            amazonIcon.onmouseout = function() { this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'; };

            // Add click listener
            amazonIcon.addEventListener('click', performAmazonSearch);

            // Append to container
            container.appendChild(amazonIcon);
            // console.log('[Amazon.sa Button Userscript] Added Mobile Icon Button.');
            return true;
        } catch (error) {
            console.error('[Amazon.sa Button Userscript] Error adding mobile icon:', error);
            return false;
        }
    }


    // --- Main Initialization Logic ---
    function initialize() {
        // Check if button/icon already exists
        if (document.getElementById(scriptId + '-desktop') || document.getElementById(scriptId + '-mobile')) {
            return true; // Already added
        }

        const googleSearchButton = document.querySelector('input[name="btnK"]'); // Desktop button selector
        const searchInput = document.querySelector('textarea[name="q"], input[name="q"]'); // General search input

        if (!searchInput) {
             // console.log('[Amazon Script Debug] Search input not found yet.');
            return false; // Search input is essential, wait if not found
        }

        // --- Decision Logic ---
        // If the Google Search button element (btnK) exists, assume Desktop view.
        // This is the key change: Removed the offsetParent check.
        if (googleSearchButton) {
            // console.log('[Amazon Script Debug] Assuming Desktop view (found btnK).');
            return addDesktopButton(googleSearchButton);
        }
        // Otherwise, assume Mobile view (or a layout without btnK).
        else {
             // console.log('[Amazon Script Debug] Assuming Mobile view (btnK not found).');
             // Check if we are likely on a search results page where input might be in header (mobile)
             const mobileHeaderSearchInput = document.querySelector('header input[name="q"], header textarea[name="q"]');
             if (mobileHeaderSearchInput) {
                 // console.log('[Amazon Script Debug] Found mobile header search input.');
                 return addMobileIconButton(mobileHeaderSearchInput);
             }
             // Check for main page input if not in header (already stored in searchInput)
             else if (searchInput) {
                 // console.log('[Amazon Script Debug] Using main search input for mobile view.');
                 return addMobileIconButton(searchInput);
             } else {
                  // console.log('[Amazon Script Debug] Mobile view assumed, but no suitable search input found.');
                  return false; // No suitable input found for mobile logic either
             }
        }
    }

    // --- Polling to Initialize ---
    const intervalId = setInterval(() => {
        attempts++;
        try {
            if (initialize() || attempts >= maxAttempts) {
                clearInterval(intervalId);
                if (attempts >= maxAttempts && !document.getElementById(scriptId + '-desktop') && !document.getElementById(scriptId + '-mobile')) {
                    console.log('[Amazon.sa Button Userscript] Could not find suitable target element after multiple attempts.');
                }
            }
        } catch (error) {
            console.error("[Amazon.sa Button Userscript] Error during initialization check:", error);
            clearInterval(intervalId); // Stop polling on error
        }
    }, checkInterval);

})();