// ==UserScript==
// @name         CubeRealm Special Block Finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight special blocks on CubeRealm.io when holding down the 'v' key for 3 seconds
// @author       Your Name
// @match        https://cuberealm.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508526/CubeRealm%20Special%20Block%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/508526/CubeRealm%20Special%20Block%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keyDownTime = 0;
    let isHighlighting = false;
    const highlightDuration = 3000; // 3 seconds

    // Define the special block types you want to highlight
    const specialBlocks = ['gold', 'diamond', 'platinum']; // Add more as needed

    // Function to highlight special blocks
    function highlightSpecialBlocks() {
        const blocks = document.querySelectorAll('.block'); // Assuming special blocks have a common class like 'block'

        blocks.forEach(block => {
            const blockType = block.getAttribute('data-type'); // Assuming block type is stored in a data attribute like 'data-type'

            if (specialBlocks.includes(blockType)) {
                block.style.border = '2px solid red'; // Apply a red border to highlight the block
            }
        });
    }

    // Event listener for keydown event
    document.addEventListener('keydown', function(event) {
        if (event.key === 'v') {
            keyDownTime = new Date().getTime();
            isHighlighting = true;
        }
    });

    // Event listener for keyup event
    document.addEventListener('keyup', function(event) {
        if (event.key === 'v') {
            let keyUpTime = new Date().getTime();
            if (isHighlighting && keyUpTime - keyDownTime >= highlightDuration) {
                highlightSpecialBlocks();
            }
            isHighlighting = false;
        }
    });

    // Array of special block selectors from the other script
    const specialBlockSelectors = [
        ".gold-block",
        ".diamond-block",
        ".platinum-block",
        // Add more selectors as needed
    ];

    // Function to highlight a block and extract its name
    function highlightAndGetName(selector) {
        const blocks = document.querySelectorAll(selector);
        blocks.forEach(block => {
            block.style.backgroundColor = "yellow";
            block.style.border = "2px solid orange";

            // Extract the block name from its element (adjust based on HTML structure)
            const blockNameElement = block.querySelector(".block-name");
            const blockName = blockNameElement ? blockNameElement.textContent : "Unknown";

            console.log(`Highlighted ${selector}: ${blockName}`);
        });
    }

    // Loop through the selectors and highlight the corresponding blocks
    specialBlockSelectors.forEach(selector => {
        highlightAndGetName(selector);
    });
})();