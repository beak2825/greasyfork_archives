// ==UserScript==
// @name         YouTube Shorts Addiction Helper
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Monitors and displays the count of YouTube shorts watched, providing visual cues to encourage moderation. Allows watch one video without blocking element
// @author       ktonel475
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486350/YouTube%20Shorts%20Addiction%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486350/YouTube%20Shorts%20Addiction%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to update the total count
    function updateShortsCount() {
        const currentDate = new Date().toLocaleDateString();
        const lastUpdateDate = GM_getValue('lastUpdateDate', '');

        // Check if one calendar day has passed since the last update
        if (currentDate !== lastUpdateDate) {
            // Reset count and update the date
            GM_setValue('shortsWatchedCount', 0);
            GM_setValue('lastUpdateDate', currentDate);
        } else {
            if(window.location.href.includes('/shorts')){
            // Increment the count
                const currentCount = getShortsWatchedCount();
                GM_setValue('shortsWatchedCount', currentCount + 1);
            }
        }

        // Display count based on the URL
        displayCountBasedOnURL();
    }

    function getShortsWatchedCount() {
        return GM_getValue('shortsWatchedCount', 0);
    }

    // Function to display count near the video display with a slight delay
            // Function to display count near the video display with a loop
    // Function to display count near the video display with dynamic font size and vertical Shorts shape
    function displayCountAtmiddle() {
        // Create a new element for displaying count
        const newElement = document.createElement('div');
        newElement.id = 'shorts-watch-count-display';
        newElement.style.position = 'fixed';
        newElement.style.bottom = '10px';
        newElement.style.right = '500px';
        newElement.style.backgroundColor = '#333'; // Dark background color
        newElement.style.color = '#fff'; // White text color
        newElement.style.padding = '10px'; // Increased padding for larger size
        newElement.style.border = '2px solid #555'; // Dark border color
        newElement.style.fontSize = '16px'; // Increased font size
        newElement.textContent = `Shorts Watched: ${getShortsWatchedCount()}`;

        const count = getShortsWatchedCount();
        const rectangleElement = document.createElement('div');
        rectangleElement.id = 'shorts-watch-rectangle';
        rectangleElement.style.position = 'fixed';
        rectangleElement.style.bottom = '10px';
        rectangleElement.style.right = '20%';
        rectangleElement.style.width = '813px'; // Initial width
        rectangleElement.style.height = `${4 * count}%`; // Dynamic height based on the count
        rectangleElement.style.backgroundColor = '#555'; // Dark color
        rectangleElement.style.display = 'flex';
        rectangleElement.style.alignItems = 'center';
        rectangleElement.style.justifyContent = 'center';
        rectangleElement.style.textAlign = 'center';

        const existingCountElement = document.getElementById('shorts-watch-count-display');
        if (existingCountElement) {
            existingCountElement.remove();
        }

        // Create a new element for the text content
        if (count > 0){
            const textElement = document.createElement('div');
            textElement.style.color = '#fff'; // White text color
            textElement.style.fontSize = '16px'; // Base font size
            textElement.textContent = 'You are wasting time on Shorts\nPlease stop right now';
            rectangleElement.appendChild(textElement);
        }

        // Remove existing counter and rectangle elements if they exist

        const existingRectangleElement = document.getElementById('shorts-watch-rectangle');
        if (existingRectangleElement) {
            existingRectangleElement.remove();
        }

        // Append both elements to the document body
        document.body.appendChild(rectangleElement);
        document.body.appendChild(newElement);
    }

    function displayCountAtBottomRight() {
        // Create a new element for displaying count
        const newElement = document.createElement('div');
        newElement.id = 'shorts-watch-count-display';
        newElement.style.position = 'fixed';
        newElement.style.bottom = '10px';
        newElement.style.right = '10px';
        newElement.style.backgroundColor = '#333'; // Dark background color
        newElement.style.color = '#fff'; // White text color
        newElement.style.padding = '10px'; // Increased padding for larger size
        newElement.style.border = '2px solid #555'; // Dark border color
        newElement.style.fontSize = '16px'; // Increased font size
        newElement.textContent = `Shorts Watched: ${getShortsWatchedCount()}`;

        // Remove existing counter element if it exists
        const existingElement = document.getElementById('shorts-watch-count-display');
        if (existingElement) {
            existingElement.remove();
        }

        document.body.appendChild(newElement);
    }

    function displayCountAtBottomLeft() {
        // Create a new element for displaying count
        const newElement = document.createElement('div');
        newElement.id = 'shorts-watch-count-display';
        newElement.style.position = 'fixed';
        newElement.style.bottom = '10px';
        newElement.style.left = '10px';
        newElement.style.backgroundColor = '#333'; // Dark background color
        newElement.style.color = '#fff'; // White text color
        newElement.style.padding = '10px'; // Increased padding for larger size
        newElement.style.border = '2px solid #555'; // Dark border color
        newElement.style.fontSize = '16px'; // Increased font size
        newElement.textContent = `Shorts Watched: ${getShortsWatchedCount()}`;

        // Remove existing counter element if it exists
        const existingElement = document.getElementById('shorts-watch-count-display');
        if (existingElement) {
            existingElement.remove();
        }

        document.body.appendChild(newElement);
    }

    // Function to display count based on the URL
    function displayCountBasedOnURL() {
        const currentURL = window.location.href;

        if (currentURL.includes('/shorts/')) {
            displayCountAtmiddle();
        } else if (currentURL.includes('/watch')) {
            displayCountAtBottomLeft();
            removeElementById('shorts-watch-rectangle');
        } else {
            displayCountAtBottomRight();
            removeElementById('shorts-watch-rectangle');
        }
    }

    function removeElementById(elementId) {
        var targetElement = document.getElementById(elementId);

        if (targetElement) {
            targetElement.parentNode.removeChild(targetElement);
            console.log('Element with ID ' + elementId + ' removed successfully.');
        } else {
            console.log('Element with ID ' + elementId + ' not found.');
        }
    }
    function RemoveElementButton() {
        const resetButton = document.createElement('button');
        resetButton.id = 'watch-this-only-button';
        resetButton.textContent = 'Watch this one only';
        resetButton.style.position = 'fixed';
        resetButton.style.top = '60px'; // Adjust the position as needed
        resetButton.style.right = '10px';
        resetButton.style.padding = '10px';
        resetButton.style.fontSize = '14px';

        // Event listener to reset the counter when the button is clicked
        resetButton.addEventListener('click', function () {
            removeElementById('shorts-watch-rectangle'); // Update the display after resetting
        });

        document.body.appendChild(resetButton);
    }

     RemoveElementButton();
    // Display count near the video display initially
    displayCountBasedOnURL();
    function removeElementOnFullScreen() {
        var elementToRemove = document.getElementById('shorts-watch-count-display');
        if (elementToRemove) {
            elementToRemove.remove();
        }
        var elementToRemove1 = document.getElementById('watch-this-only-button');
        if (elementToRemove1) {
            elementToRemove1.remove();
        }
    }

// Event listener for fullscreenchange event
    document.addEventListener('fullscreenchange', function () {
        if (document.fullscreenElement) {
            removeElementOnFullScreen();
        } else {
            displayCountBasedOnURL();
            RemoveElementButton();
        }
    });
    // Event listener for video end and URL change
    document.addEventListener('yt-navigate-finish', function () {
        // Update the count whenever a video finishes playing or URL changes
        updateShortsCount();
    });
    // Event listener for DOM content loaded
    document.addEventListener('DOMContentLoaded', function () {
        // Display count based on the URL when the DOM content is loaded
        displayCountBasedOnURL();
    });
})();
