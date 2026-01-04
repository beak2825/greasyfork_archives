// ==UserScript==
// @name         Torn City Dynamic HP Bar Enhancement
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a vertical line to the HP bar based on a percentage of the actual HP. Black line for PC, red line for PDA.
// @author       _God_
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490186/Torn%20City%20Dynamic%20HP%20Bar%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/490186/Torn%20City%20Dynamic%20HP%20Bar%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add line to HP bar
    function addLineToHPBar() {
        try {
            // Find the defender's health bar element
            const hpBarWrapper = document.querySelector('#defender .pbWrap___K0uUO');

            if (!hpBarWrapper) {
                console.error('Defender health bar element not found.');
                return;
            }

            console.log('Defender health bar element found.');

            // Get the total width/height of the defender's health bar
            const totalSize = hpBarWrapper.offsetWidth || hpBarWrapper.offsetHeight;

            console.log(`Total Size: ${totalSize}`);

            // Calculate the desired position of the line (18% mark of the total width/height)
            const desiredPosition = (18 / 100) * totalSize;

            console.log(`Desired Position: ${desiredPosition}`);

            // Create and style the line element
            const line = document.createElement('div');
            line.style.position = 'absolute';
            line.style.top = '0';
            line.style.height = '6px'; // Ensure that the line covers the entire height of the HP bar
            line.style.width = '2px'; // Adjust the width of the line to 2 pixels
            line.style.zIndex = '9999'; // Ensure that the line is displayed on top

            // Check if the platform is Torn PDA or PC
            if (navigator.userAgent.includes('Torn PDA')) {
                // If the platform is Torn PDA, use a red line
                line.style.background = 'red';
            } else {
                // If the platform is PC, use a black line
                line.style.background = 'black';
            }

            // Position the line at the desired percentage
            line.style.left = `${desiredPosition}px`;

            // Append the line to the defender's health bar
            hpBarWrapper.appendChild(line);

            console.log('Line appended.');
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }

    // Function to handle mutations in the DOM
    function handleMutations(mutationsList, observer) {
        // Check if defender's health bar wrapper element is now available
        if (document.querySelector('#defender .pbWrap___K0uUO')) {
            // Add line to defender's health bar
            addLineToHPBar();
            // Disconnect the observer once the defender's health bar wrapper element is found
            observer.disconnect();
        }
    }

    // Mutation observer to watch for changes to the DOM
    const observer = new MutationObserver(handleMutations);

    // Start observing changes to the DOM
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();

