// ==UserScript==
// @name         Google Lens Plus
// @version      1.0
// @description  Scroll to the bottom of the page [disabled], waits for the page to fully load, extract and arrange unique resolutions,
// @description  and display them in a column on the right side of the page with tap-to-copy functionality.
// @author       LF2005
// @license      MIT
// @match        https://www.google.com/search?*
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/731843
// @downloadURL https://update.greasyfork.org/scripts/533357/Google%20Lens%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/533357/Google%20Lens%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to verify the correct page structure
    function verifyPageStructure() {
        // Check if the div with id="rso" exists
        const rsoDiv = document.getElementById('rso');
        if (!rsoDiv) {
            console.log('No div with id="rso" found. Exiting script.');
            return false;
        }

        // Check if the rso div contains divs with class "ULSxyf"
        const ulsxyfDivs = rsoDiv.querySelectorAll('div.ULSxyf');
        if (ulsxyfDivs.length === 0) {
            console.log('No divs with class "ULSxyf" found inside rso. Exiting script.');
            return false;
        }

        return true;
    }

    // Function to scroll to the bottom of the page and detect when no new content is loaded
    function scrollToBottom() {
        return new Promise((resolve) => {
            let previousHeight = document.body.offsetHeight;
            let attempts = 0;
            const maxAttempts = 40; // Maximum attempts to scroll before giving up

            const scrollInterval = setInterval(() => {
                window.scrollBy(0, window.innerHeight * 2); // Scroll down by two viewport heights
                const newHeight = document.body.offsetHeight;

                // Check if the page height has changed
                if (newHeight === previousHeight) {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        clearInterval(scrollInterval); // Stop scrolling if no new content is loaded after max attempts
                        resolve();
                    }
                } else {
                    attempts = 0; // Reset attempts if new content is loaded
                }

                previousHeight = newHeight; // Update the previous height

                // Stop scrolling if we're at the bottom
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, 300); // Adjust the interval (in milliseconds) for faster scrolling
        });
    }

    // Function to extract unique resolutions
    function extractResolutions() {
        const outerSpans = document.querySelectorAll('span.cyspcb.DH9lqb.VBZLA');
        const resolutions = new Set(); // Use a Set to automatically filter duplicates

        outerSpans.forEach(outerSpan => {
            const innerSpan = outerSpan.querySelector('span');
            if (innerSpan && !innerSpan.innerHTML.endsWith('ago')) {
                resolutions.add(innerSpan.innerHTML); // Add to the Set
            }
        });

        return Array.from(resolutions); // Convert Set to array
    }

    // Function to sort resolutions by size (from largest to smallest)
    function sortResolutions(resolutions) {
        return resolutions.sort((a, b) => {
            // Remove commas temporarily for comparison
            const [aWidth, aHeight] = a.replace(/,/g, '').split('x').map(Number);
            const [bWidth, bHeight] = b.replace(/,/g, '').split('x').map(Number);
            const aArea = aWidth * aHeight;
            const bArea = bWidth * bHeight;
            return bArea - aArea; // Sort in descending order
        });
    }

    // Function to copy text to clipboard using the Clipboard API
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied to clipboard:', text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }

    // Function to inject the results into a column on the right side of the page
    function injectResultsColumn(resolutions) {
        // Create a new div for the column
        const column = document.createElement('div');
        column.id = 'resolutions-column';
        column.style.position = 'fixed';
        column.style.top = '0';
        column.style.right = '0';
        column.style.width = '100px';
        column.style.height = '100vh';
        column.style.backgroundColor = 'black';
        column.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';
        column.style.padding = '20px';
        column.style.overflowY = 'auto';
        column.style.zIndex = '1000';

        // Add a title to the column
        const title = document.createElement('h1');
        title.textContent = 'Resolutions';
        title.style.marginTop = '0';
        column.appendChild(title);

        // Add each resolution to the column with tap-to-copy functionality
        resolutions.forEach(resolution => {
            const resolutionElement = document.createElement('div');
            resolutionElement.textContent = resolution;
            resolutionElement.style.marginBottom = '1px';
            resolutionElement.style.cursor = 'pointer';
            resolutionElement.style.padding = '1px';
            resolutionElement.style.borderRadius = '1px';
            resolutionElement.style.backgroundColor = '#000000';
            resolutionElement.style.transition = 'background-color 0.2s';

            // Add hover effect
            resolutionElement.addEventListener('mouseenter', () => {
                resolutionElement.style.backgroundColor = '#0a0359';
            });
            resolutionElement.addEventListener('mouseleave', () => {
                resolutionElement.style.backgroundColor = '#000000';
            });

            // Add tap-to-copy functionality (now copies with commas)
            resolutionElement.addEventListener('click', async () => {
                const success = await copyToClipboard(resolution); // Copy the resolution WITH commas
                if (success) {
                    resolutionElement.textContent = 'Copied!'; // Provide feedback
                    setTimeout(() => {
                        resolutionElement.textContent = resolution; // Reset after 1 second
                    }, 1000);
                }
            });

            column.appendChild(resolutionElement);
        });

        // Append the column to the body
        document.body.appendChild(column);
    }

    // Main function
    async function main() {
        // Verify page structure first
        if (!verifyPageStructure()) {
            return;
        }

        console.log('Scrolling to the bottom of the page...');
        //await scrollToBottom(); // Scroll to the bottom
        console.log('Finished scrolling. Extracting resolutions...');

        const uniqueResolutions = extractResolutions(); // Extract resolutions
        console.log('Unique Resolutions (unsorted):', uniqueResolutions);

        const sortedResolutions = sortResolutions(uniqueResolutions); // Sort resolutions
        console.log('Unique Resolutions (sorted):', sortedResolutions);

        injectResultsColumn(sortedResolutions); // Inject the results into a column
    }

    // Wait for the page to load, then run the main function
    window.addEventListener('load', main);
})();