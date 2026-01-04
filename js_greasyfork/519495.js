// ==UserScript==
// @name         OpenGuessr Hack Location Finder
// @namespace    https://openguessr.com/
// @version      2.2
// @description  Extract and open PanoramaIframe location in OPENGUESSR full site when pressing Control + X + S together
// @author       YourName
// @license      MIT
// @match        https://openguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519495/OpenGuessr%20Hack%20Location%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/519495/OpenGuessr%20Hack%20Location%20Finder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Track pressed keys
    const keysPressed = new Set();

    // Function to handle the key combination
    function handleKeyCombination() {
        if (keysPressed.has('control') && keysPressed.has('x') && keysPressed.has('s')) {
            console.log('Control + X + S detected.');

            // Locate the iframe element by its ID
            const iframe = document.querySelector('#PanoramaIframe');
            if (iframe) {
                const src = iframe.getAttribute('src');
                if (src) {
                    try {
                        // Parse the URL to extract the location parameter
                        const url = new URL(src);
                        const location = url.searchParams.get('location'); // Extract "LAT,LONG"
                        if (location) {
                            // Open the full Google Maps URL
                            const mapsUrl = `https://www.google.com/maps?q=${location}`;
                            console.log('Opening URL:', mapsUrl);
                            window.open(mapsUrl, '_blank');
                        } else {
                            console.error('Location parameter not found in iframe URL.');
                        }
                    } catch (error) {
                        console.error('Error parsing iframe URL:', error);
                    }
                } else {
                    console.error('Iframe src attribute not found.');
                }
            } else {
                console.error('Iframe with ID "PanoramaIframe" not found.');
            }

            // Prevent default browser behavior
            keysPressed.clear();
        }
    }

    // Event listener for keydown
    document.addEventListener('keydown', (event) => {
        keysPressed.add(event.key.toLowerCase());
        console.log('Key down:', event.key);

        // Handle the key combination
        handleKeyCombination();
    });

    // Event listener for keyup to clear the pressed key
    document.addEventListener('keyup', (event) => {
        keysPressed.delete(event.key.toLowerCase());
        console.log('Key up:', event.key);
    });

    // Mutation observer to wait for the iframe to load
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const iframe = document.querySelector('#PanoramaIframe');
                if (iframe) {
                    console.log('PanoramaIframe detected!');
                    observer.disconnect(); // Stop observing once iframe is found
                }
            }
        });
    });

    // Start observing the DOM for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Reset keys when the window loses focus
    window.addEventListener('blur', () => {
        console.log('Window lost focus, clearing keys.');
        keysPressed.clear();
    });
})();
