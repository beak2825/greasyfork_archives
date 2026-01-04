// ==UserScript==
// @name         Rate My Professor Ratings 
// @description  Rate My Professor Extension for University of Rochester
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Alex Witkowski
// @match        https://cdcs.ur.rochester.edu/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479489/Rate%20My%20Professor%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/479489/Rate%20My%20Professor%20Ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Pattern to find all instructor elements
    const pattern = /rpResults_ctl\d+_lblInstructors/;

    // URL of pastebin content
    const pastebinURL = 'https://pastebin.com/raw/k8hFxfhe';

    // Initialize an empty hashmap
    const dataMap = {};

    // Function to fetch data from Pastebin
    function fetchDataFromPastebin(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    // Split the content into lines
                    const lines = response.responseText.split('\n');

                    // Create the hashmap
                    lines.forEach(line => {
                        const words = line.split(' ');
                        const key = words.slice(0, 2).join(' ');
                        dataMap[key] = line;
                    });
                } else {
                    console.error('Error fetching data from Pastebin. Status Code:', response.status);
                }
            },
            onerror: function(error) {
                console.error('Error fetching data from Pastebin:', error);
            }
        });
    }
    function findInstructorNames() {
        // Find all span elements with IDs matching the pattern
        const elements = document.querySelectorAll('span[id]');

        // Loop through the found elements and add a hover event listener
        elements.forEach((element) => {
            if (pattern.test(element.id)) {
                const instructorName = element.textContent;
                const data = dataMap[instructorName];
                if (data) {
                    // Create a popup with the information
                    element.addEventListener('mouseenter', function() {
                        const tooltip = document.createElement('div');
                        tooltip.textContent = data;
                        tooltip.style.position = 'absolute';
                        tooltip.style.background = 'aqua';
                        tooltip.style.padding = '5px';
                        tooltip.style.border = '1px solid #ccc';
                        tooltip.style.zIndex = '1000';

                        element.appendChild(tooltip);
                    });

                    // Remove the popup on mouse leave
                    element.addEventListener('mouseleave', function() {
                        const tooltip = element.querySelector('div');
                        if (tooltip) {
                            tooltip.remove();
                        }
                    });
                } else {
                    // If no data is found
                    element.addEventListener('mouseenter', function() {
                        const message = document.createElement('div');
                        message.textContent = 'No information found for this professor';
                        message.style.position = 'absolute';
                        message.style.background = 'aqua';
                        message.style.padding = '5px';
                        message.style.border = '1px solid #ccc';
                        message.style.zIndex = '1000';

                        element.appendChild(message);
                    });

                    // Remove the popup on mouse leave
                    element.addEventListener('mouseleave', function() {
                        const message = element.querySelector('div');
                        if (message) {
                            message.remove();
                        }
                    });
                }
            }
        });
    }

    // Call the function to fetch and process data from Pastebin
    fetchDataFromPastebin(pastebinURL);
    // Reloads data every 3 seconds
    setInterval(findInstructorNames, 3000);
})();
