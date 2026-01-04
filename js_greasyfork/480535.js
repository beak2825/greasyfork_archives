// ==UserScript==
// @name         Taobao Item Display Hover Text
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Display text of elements corresponding to hover effects directly on the page, and copy it to the clipboard on click.
// @author       max5555
// @license      MIT
// @match        https://item.taobao.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480535/Taobao%20Item%20Display%20Hover%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/480535/Taobao%20Item%20Display%20Hover%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adjusted styling for our display box to appear on the left
    GM_addStyle(`
        #hoverTextDisplay {
            position: fixed;
            bottom: 10px;
            left: 10px;
            max-width: 300px;
            max-height: 300px;
            overflow-y: auto;
            background-color: rgba(0,0,0,0.7);
            color: #FFF;
            padding: 10px;
            border-radius: 5px;
            z-index: 999999;
            font-size: 12px;
        }
    `);

    // Create the display box and append to body
    const displayBox = document.createElement('div');
    displayBox.id = 'hoverTextDisplay';
    document.body.appendChild(displayBox);

    let previousElements = new Set();

    const captureHoverElements = () => {
        const allElements = new Set(document.querySelectorAll('*'));
        const newOrVisibleElements = Array.from(allElements).filter(el => {
            const isPreviouslyLogged = previousElements.has(el);
            const isVisible = window.getComputedStyle(el).display !== 'none';

            //return !isPreviouslyLogged && isVisible;
            return isVisible;
        });

        // Display only the text content of the hovered element
        newOrVisibleElements.forEach(el => {
            displayBox.textContent = el.textContent.trim();
            //displayBox.innerHTML = el.outerHTML;
            //displayBox.innerHTML = el.outerHTML.textContent.trim();
            //copyToClipboard(el.outerHTML.textContent.trim());
        });

        // Update the set of known elements
        previousElements = allElements;
    };

    // Function to copy text to the clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    document.body.addEventListener('mouseover', () => {
        setTimeout(captureHoverElements, 500);
    });

    // Added a click event listener to copy the text on click
    displayBox.addEventListener('click', () => {
        copyToClipboard(displayBox.textContent);
    });

})();
