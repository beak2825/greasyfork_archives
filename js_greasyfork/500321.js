// ==UserScript==
// @name         Only Disqus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ///
// @author       You
// @match        https://asuratoon.com/*
// @match        https://rizzfables.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/500321/Only%20Disqus.user.js
// @updateURL https://update.greasyfork.org/scripts/500321/Only%20Disqus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var originalElements = []; // Array to store original elements and their original display styles
    var scriptEnabled = true; // Flag to control whether the script is enabled or disabled

    // Function to apply a display style to an element
    function applyEffect(element, display) {
        // Uncomment the following line for debugging purposes
        // console.log(element.style.display + ' |||' + display)
        if (element && display !== null) {
            element.style.display = display;
        }
    }

    // Function to restore original styles of elements
    function restoreOriginalStyles() {
        originalElements.forEach(originalElement => applyEffect(originalElement[0], originalElement[1]));
        originalElements = [];
    }
    
    // Function to disable the script
    function disableScript() {
        scriptEnabled = false;
        console.log('SCRIPT DISABLED');
        restoreOriginalStyles();
    }

    // Function to enable the script
    function enableScript() {
        scriptEnabled = true;
        console.log('SCRIPT ENABLED');
        hideAllExceptDisqus();
    }

    // Function to check if an element is a Disqus iframe
    function isDisqusIframe(element) {
        return element.id.startsWith('dsq-app');
    }

    // Function to create a button that enables/disables the script
    function createButton(){
        // Create the button
        var button = document.createElement('button');
        button.textContent = 'Disqus Button';
        button.id = 'fixedButton';

        // Apply styles to the button to position it fixed at the bottom center of the screen
        var style = document.createElement('style');
        style.textContent = `
            #fixedButton {
                position: fixed;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                z-index: 1000;
            }
            #fixedButton:hover {
                background-color: #0056b3;
            }
        `;
        document.head.appendChild(style);

        // Add the button to the document body
        document.body.appendChild(button);

        // Add an event listener to the button
        button.addEventListener('click', function() {
            console.log('Button clicked');
            if (scriptEnabled) {
                disableScript();
            } else {
                enableScript();
            }
        });
    }

    // Function to hide all elements except the Disqus iframe
    function hideAllExceptDisqus() {
        // Select the Disqus iframe whose ID starts with 'dsq-app'
        var disqusIframe = Array.from(document.getElementsByTagName('iframe')).find(isDisqusIframe);

        if (disqusIframe) {
            // Stop the search interval once the Disqus iframe is found
            clearInterval(searchInterval);

            console.log('Disqus URL found!: ', disqusIframe.src);

            // Start with the outermost element (the body)
            var outer_element = document.body;
            var on_loop = true;

            // Loop to traverse the DOM and hide elements
            while (on_loop) {

                // Get all child elements of the current outer element
                var allElements = outer_element.children;
                for (var i = 0; i < allElements.length; i++) {
                    // Skip the 'Disqus Button' element to keep it visible
                    if (allElements[i].textContent === 'Disqus Button') {
                        continue;
                    }
                    // Check if the current element does not contain the Disqus iframe
                    if (!allElements[i].contains(disqusIframe)) {
                        // Get the current display style of the element
                        const style = window.getComputedStyle(allElements[i]);
                        const filterValue = style.getPropertyValue('display'); 
                        // Store the element and its original display style
                        originalElements.push([allElements[i], filterValue]);
                        // Hide the element
                        allElements[i].style.display = 'none';

                    } else {
                        // If the element contains the Disqus iframe, set it as the new outer element
                        outer_element = allElements[i];
                        // If the outer element is the Disqus iframe, stop the loop
                        if (outer_element === disqusIframe) {
                            on_loop = false;
                        }
                    }
                }
            }

            console.log('Element List: ', originalElements);

        } else {
            // If the Disqus iframe is not found, log a message and retry in 2 seconds
            console.log('Disqus iframe not found. Retrying again in 2 seconds...');
        }
    }

    // Interval to repeatedly try to find and hide elements except Disqus iframe
    var searchInterval = setInterval(hideAllExceptDisqus, 2000);

    // Create the toggle button
    createButton();
})();