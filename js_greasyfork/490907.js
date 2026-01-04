// ==UserScript==
// @name         Attacks available
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Extract and display the value of 'x' from a dynamically generated element divided by 25
// @author       Shaitan
// @match        http://www.torn.com/*
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490907/Attacks%20available.user.js
// @updateURL https://update.greasyfork.org/scripts/490907/Attacks%20available.meta.js
// ==/UserScript==

(function() {
    'use strict';

function extractValue(valueText) {
    if (valueText) {
        var xValue = parseInt(valueText.split('/')[0], 10); // Parse the value of E as an integer
        var dividedValue = xValue / 25; // Divide the value of energy by 25
        return dividedValue < 1 ? 0 : Math.floor(dividedValue); // If the result is less than 1, return 0, otherwise round it
    } else {
        return null;
    }
}


    // Function to display the extracted value in a small box at the top right of the page
    function displayValueAtTop(x) {
        var topDisplayElement = document.getElementById('topDisplayValue');
        if (!topDisplayElement) {
            topDisplayElement = document.createElement('div');
            topDisplayElement.id = 'topDisplayValue';
            topDisplayElement.style.cssText = 'position: fixed; top: 10px; right: 10px; background-color: black; color: white; padding: 5px; border-radius: 5px; z-index: 9999;';
            document.body.appendChild(topDisplayElement);
        }
        topDisplayElement.textContent = 'Hits: ' + x;
    }

    // Function to observe changes to the text content of the target element
    function observeChanges(targetElement) {
        var observer = new MutationObserver(function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    var extractedValue = extractValue(targetElement.textContent.trim());
                    if (extractedValue !== null) {
                        displayValueAtTop(extractedValue);
                    }
                }
            }
        });

        var config = { characterData: true, subtree: true };

        observer.observe(targetElement, config);
    }

    // Find the target element
    var targetElement = document.querySelector('p.bar-value___NTdce');

    // If the target element is found, start observing changes to its text content
    if (targetElement) {
        observeChanges(targetElement);
        var initialExtractedValue = extractValue(targetElement.textContent.trim());
        if (initialExtractedValue !== null) {
            displayValueAtTop(initialExtractedValue);
        } else {
            console.log('Value not found.');
        }
    } else {
        console.log('Element with class "bar-value___NTdce" not found.');
    }
})();
