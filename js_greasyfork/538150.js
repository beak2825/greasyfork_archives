// ==UserScript==
// @name         OpenGuessr Localização Correta Hack
// @namespace    https://openguessr.com/
// @version      1.0
// @description  Aperte apenas o botão do teclado "1" e o mapa irá abrir com a localização
// @author       faker
// @license      MIT
// @match        https://openguessr.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538150/OpenGuessr%20Localiza%C3%A7%C3%A3o%20Correta%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/538150/OpenGuessr%20Localiza%C3%A7%C3%A3o%20Correta%20Hack.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Add CSS for the floating iframe
    GM_addStyle(`
        #locationFrameContainer {
            position: fixed;
            bottom: 10px;
            left: 10px; /* Displayed in bottom left */
            width: 600px;
            height: 400px;
            background-color: white;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 1000; /* Ensure it's on top */
            overflow: hidden; /* Hide scrollbars */
        }
 
        #locationFrame {
            width: 100%;
            height: 100%;
            border: none;
        }
 
        #locationFrameHeader {
            background-color: #f0f0f0;
            padding: 5px;
            cursor: move; /* Indicate draggable */
            text-align: center;
            font-weight: bold;
            display: flex; /* Use flexbox for alignment */
            justify-content: space-between; /* Push items to the edges */
            align-items: center; /* Vertically align items */
        }
 
        #closeButton {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            cursor: pointer;
            border-radius: 3px;
        }
    `);
 
    let locationFrameContainer = null;  // Store the iframe container element
    let currentLocation = null; // Store the last known location
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    const zoomLevel = 3; // Adjusted Zoom Level
 
    // Function to create and display the iframe
    function createLocationFrame(location) {
        if (!location) return;  // Prevent creating with null location
 
        if (locationFrameContainer) {
            // Iframe already exists, just update the URL
            const locationFrame = locationFrameContainer.querySelector('#locationFrame');
            locationFrame.src = `https://www.google.com/maps?q=${location}&output=embed&z=${zoomLevel}`;
            currentLocation = location; //Update known location
            return;
        }
 
        // Create the container
        locationFrameContainer = document.createElement('div');
        locationFrameContainer.id = 'locationFrameContainer';
 
        // Create the header (for dragging)
        const locationFrameHeader = document.createElement('div');
        locationFrameHeader.id = 'locationFrameHeader';
        locationFrameHeader.textContent = 'Google Maps Location (Drag to Move)';
 
        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.id = 'closeButton';
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', closeLocationFrame); // Add event listener
 
        // Add elements to the header
        locationFrameHeader.appendChild(document.createTextNode('Google Maps Location (Drag to Move)')); // Text node
        locationFrameHeader.appendChild(closeButton);
 
        locationFrameContainer.appendChild(locationFrameHeader);
 
        // Create the iframe
        const locationFrame = document.createElement('iframe');
        locationFrame.id = 'locationFrame';
        locationFrame.src = `https://www.google.com/maps?q=${location}&output=embed&z=${zoomLevel}`;  // Embedded version of Maps, zoomed out to level 3
        locationFrameContainer.appendChild(locationFrame);
 
        // Add to the document
        document.body.appendChild(locationFrameContainer);
 
        // Make it draggable
        locationFrameHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);
 
        currentLocation = location; // Store initial location.
    }
 
    function dragStart(e) {
        isDragging = true;
        dragOffsetX = e.clientX - locationFrameContainer.offsetLeft;
        dragOffsetY = e.clientY - locationFrameContainer.offsetTop;
    }
 
    function dragEnd() {
        isDragging = false;
    }
 
    function drag(e) {
        if (!isDragging) return;
        locationFrameContainer.style.left = (e.clientX - dragOffsetX) + 'px';
        locationFrameContainer.style.top = (e.clientY - dragOffsetY) + 'px';
        locationFrameContainer.style.right = 'auto'; // prevent weirdness
        locationFrameContainer.style.bottom = 'auto'; // prevent weirdness
    }
 
    function closeLocationFrame() {
        if (locationFrameContainer) {
            locationFrameContainer.remove();
            locationFrameContainer = null; // Clear the reference
            currentLocation = null; // Clear the stored location
        }
    }
 
    // Function to extract location from iframe
    function extractLocation() {
        try {
            const iframe = document.querySelector('#PanoramaIframe');
            const src = iframe.getAttribute('src');
            const url = new URL(src);
            return url.searchParams.get('location');
        } catch (e) {
            return null;
        }
    }
 
    // Key press listener, toggles the map
    document.addEventListener('keydown', function(event) {
        if (event.key === '1') {
            const location = extractLocation();
            if (location) {
                if (locationFrameContainer) {
                    // Iframe exists, update the location if needed or close if current location matches
                    const locationFrame = locationFrameContainer.querySelector('#locationFrame');
                    if (locationFrame.src !== `https://www.google.com/maps?q=${location}&output=embed&z=${zoomLevel}`){
                        locationFrame.src = `https://www.google.com/maps?q=${location}&output=embed&z=${zoomLevel}`;
                    } else {
                        closeLocationFrame();
                    }
                } else {
                    createLocationFrame(location);
                }
                currentLocation = location;
            } else {
                if(locationFrameContainer){
                    closeLocationFrame(); //Close if location cannot be extracted
                }
            }
        }
    });
 
    //Try extracting location every second and update if it changes
    setInterval(() => {
        const location = extractLocation();
        if (location) {
            if (location !== currentLocation) {
                // Location has changed!
                if (locationFrameContainer) {
                    const locationFrame = locationFrameContainer.querySelector('#locationFrame');
                    locationFrame.src = `https://www.google.com/maps?q=${location}&output=embed&z=${zoomLevel}`;
                } else {
                    createLocationFrame(location);
                }
                currentLocation = location; // Update the stored location
            }
        } else if (locationFrameContainer) {
            closeLocationFrame(); // Close the frame if no location can be found.
        }
    }, 1000);
 
})();