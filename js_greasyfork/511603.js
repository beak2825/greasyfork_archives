// ==UserScript==
// @name         Pixiv Tags Artwork Links Button
// @namespace    https://www.pixiv.net
// @version      1.8
// @description  Adds clickable button to Pixiv artwork that's shown for tags. Coded with ChatGPT cause I suck.
// @author       OptimismRequired
// @match        https://www.pixiv.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511603/Pixiv%20Tags%20Artwork%20Links%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/511603/Pixiv%20Tags%20Artwork%20Links%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the clickable links
    function addLinks() {
        const divs = document.querySelectorAll('.sc-1m5awoc-1.hZYbGX');
        if (divs.length === 0) return; // Exit if no relevant divs found

        divs.forEach(div => {
            const links = div.getElementsByTagName('a'); // Get all <a> elements inside the <div>
            Array.from(links).forEach(link => {
                // Check if the button already exists to avoid adding multiple
                if (!link.querySelector('a[data-artwork-link]')) {
                    // Find the <img> element within the current <a> element
                    const img = link.querySelector('img');

                    // If there's an <img> element, proceed to extract the URL
                    if (img) {
                        const url = img.src;

                        // Clean the URL and extract the artwork ID
                        const cleanedUrl = url.replace(/(_p0)?(_square1200\.jpg|_custom1200\.jpg)$/, ''); // Remove unwanted suffixes
                        const lastNumber = cleanedUrl.substring(cleanedUrl.lastIndexOf('/') + 1); // Extract the last number
                        const finalUrl = `https://www.pixiv.net/en/artworks/${lastNumber}`; // Create the final URL

                        const buttonLink = document.createElement('a'); // Create an <a> element
                        buttonLink.href = finalUrl; // Set the href attribute
                        // Removed target="_blank" to not open in new tab
                        buttonLink.style.width = '15px'; // Set width
                        buttonLink.style.height = '15px'; // Set height
                        buttonLink.style.position = 'absolute'; // Position absolute
                        buttonLink.style.top = '2px'; // Adjust top position to center vertically
                        buttonLink.style.right = '2px'; // Adjust right position to center horizontally
                        buttonLink.style.zIndex = '10'; // Ensure it appears above other elements
                        buttonLink.style.border = 'none'; // Remove default border
                        buttonLink.style.backgroundColor = 'lightblue'; // Button background color
                        buttonLink.style.cursor = 'pointer'; // Change cursor on hover
                        buttonLink.style.borderRadius = '3px'; // Optional: round edges
                        buttonLink.style.fontSize = '12px'; // Set font size
                        buttonLink.style.lineHeight = '15px'; // Center the "+" vertically
                        buttonLink.style.textAlign = 'center'; // Center the "+" horizontally
                        buttonLink.textContent = '+'; // Set the text content

                        // Add hover effect styles
                        buttonLink.style.transition = 'background-color 0.3s, color 0.3s'; // Smooth transition
                        buttonLink.addEventListener('mouseover', () => {
                            buttonLink.style.backgroundColor = 'rgba(0, 0, 139, 0.5)'; // Change background to 50% dark blue
                            buttonLink.style.color = 'white'; // Change text color to white
                        });
                        buttonLink.addEventListener('mouseout', () => {
                            buttonLink.style.backgroundColor = 'lightblue'; // Revert background
                            buttonLink.style.color = 'black'; // Revert text color
                        });

                        // Set a custom data attribute to avoid duplication
                        buttonLink.setAttribute('data-artwork-link', 'true');

                        // Prevent the click event on the button from bubbling up
                        buttonLink.addEventListener('click', (event) => {
                            event.stopPropagation(); // Prevent the event from bubbling up to the parent <a>
                        });

                        // Set relative position for parent <a> to position the new <a> correctly
                        link.style.position = 'relative';

                        link.appendChild(buttonLink); // Append the new <a> element to the existing <a>
                    }
                }
            });
        });
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // Check if new nodes have been added and look for specific divs
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                addLinks(); // Call the function to add links
            }
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
