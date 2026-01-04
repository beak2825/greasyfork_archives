// ==UserScript==
// @name         Torn Dump Auto Search
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Automatically searches the dump on Torn.com repeatedly, picks up items, searches again, and stops when energy is insufficient
// @author       Leanna
// @match        https://www.torn.com/dump.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521754/Torn%20Dump%20Auto%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/521754/Torn%20Dump%20Auto%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isActive = false;
    let initialSearchCompleted = false;

    // Function to perform the search cycle
    function performSearchCycle() {
        if (isActive && checkDumpPage()) {
            if (checkEnergy()) {
                toggleScriptOff();
                return;
            }

            if (!initialSearchCompleted) {
                const searchButton = document.querySelector('.btn.torn-btn[href*="step=search"]:not([i-data="i_318_170_96_33"])');
                if (searchButton) {
                    searchButton.click(); // Simulate a click event
                    console.log("Initial search...");

                    setTimeout(() => {
                        initialSearchCompleted = true;
                        if (isActive) {
                            performSearchCycle();
                        }
                    }, 5000); // Set to 5000 milliseconds (5 seconds)
                } else {
                    console.log("Search button not found.");
                }
            } else {
                // Perform pick up
                const pickUpButton = document.querySelector('.btn.torn-btn[href*="step=pickUp"]');
                if (pickUpButton) {
                    pickUpButton.click(); // Simulate a click event
                    console.log("Picking up items...");

                    setTimeout(() => {
                        // Perform search again
                        const searchAgainButton = [...document.querySelectorAll('.btn.torn-btn[href*="step=search"]')]
                            .find(el => el.querySelector('span')?.textContent === 'SEARCH AGAIN');

                        if (searchAgainButton) {
                            searchAgainButton.click(); // Simulate a click event
                            console.log("Searching the dump again...");

                            // Wait for the page to update, then restart the cycle
                            setTimeout(() => {
                                if (isActive) {
                                    performSearchCycle();
                                }
                            }, 5000); // Set to 5000 milliseconds (5 seconds)
                        } else {
                            console.log("Search Again button not found.");
                        }
                    }, 2000); // Set to 2000 milliseconds (2 seconds)
                } else {
                    console.log("Pick up button not found.");
                }
            }
        }
    }

    // Check if we are on the dump page
    function checkDumpPage() {
        return window.location.href.includes("torn.com/dump.php");
    }

    // Check if there is enough energy to search the dump
    function checkEnergy() {
        const energyMessage = document.body.textContent.includes('You do not have enough energy to search the dump.');
        return energyMessage;
    }

    // Function to toggle the script off
    function toggleScriptOff() {
        isActive = false;
        initialSearchCompleted = false;
        button.innerHTML = 'OFF';
        button.style.backgroundColor = 'green';
        console.log("Not enough energy. Stopping search.");
    }

    // Create a toggle button element
    const button = document.createElement('button');
    button.innerHTML = 'OFF';
    button.style.position = 'fixed';
    button.style.top = '20%'; // Adjusted position
    button.style.right = '0%';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '6px';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';

    // Add a click event listener to toggle the search functionality
    button.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent page reload
        isActive = !isActive;
        initialSearchCompleted = false; // Reset initial search state
        if (isActive) {
            button.innerHTML = 'ON';
            button.style.backgroundColor = 'red';
            performSearchCycle();
        } else {
            button.innerHTML = 'OFF';
            button.style.backgroundColor = 'green';
            console.log("Stopped searching.");
        }
    });

    // Add the button to the page
    document.body.appendChild(button);

})();
