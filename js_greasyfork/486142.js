// ==UserScript==
// @name         Money Calculator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Count the occurrences of the $ symbol on a webpage and display the count and total in a draggable box
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486142/Money%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/486142/Money%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #dollarCountContainer {
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px;
            background: #ccebff; /* Light Blue */
            border: 1px solid #ccc;
            z-index: 9999;
            cursor: move;
            min-width: 250px;
        }

        #dollarCountContainer input {
            width: 100%;
            font-weight: bold;
            font-size: 14px;
        }

        #dollarCountContainer a {
            color: #00cc00; /* Green */
            font-weight: bold;
            font-size: 14px;
            text-decoration: none;
        }

        #dollarCountContainer a:hover {
            text-decoration: underline;
        }
    `);

    // Function to count occurrences of the $ symbol and display the count and total in a draggable box
    function countDollars() {
        // Get all text content on the page
        const pageText = document.body.innerText;

        // Find all occurrences of the $ symbol with optional commas and decimals
        const matches = pageText.match(/\$\d{1,3}(,\d{3})*(\.\d{1,2})?/g) || [];

        // Count and calculate the total value
        const dollarCount = matches.length;
        const totalValue = matches.reduce((sum, match) => sum + parseFloat(match.slice(1).replace(/,/g, '')), 0);

        // Display the count and total value in a draggable box
        if (!document.getElementById('dollarCountContainer')) {
            // If the container doesn't exist, create it
            const container = document.createElement('div');
            container.id = 'dollarCountContainer';

            // Create a title bar for dragging
            const titleBar = document.createElement('div');
            titleBar.style.width = '100%';
            titleBar.style.height = '20px';
            titleBar.style.backgroundColor = '#ddd';
            titleBar.style.cursor = 'move';
            titleBar.innerText = 'Drag here';

            // Create a signature on the right side
            const signature = document.createElement('div');
            signature.style.float = 'right';
            signature.style.paddingRight = '5px';
            signature.style.color = '#00cc00'; // Green
            signature.innerHTML = 'By <a href="https://twitter.com/l1ackoder" target="_blank">@l1ackoder</a>';

            titleBar.appendChild(signature);
            container.appendChild(titleBar);

            // Create a text box to display the count and total bounty
            const textBox = document.createElement('input');
            textBox.type = 'text';

            // Check if the total value is greater than or equal to 1000, then display in "k" format
            if (totalValue >= 1000) {
                textBox.value = `Count: ${dollarCount} | Total: $${(totalValue / 1000).toFixed(2)}k`;
            } else {
                textBox.value = `Count: ${dollarCount} | Total: $${totalValue.toFixed(2)}`;
            }

            textBox.readOnly = true;
            container.appendChild(textBox);

            // Make the container draggable
            let isDragging = false;
            let offsetX, offsetY;

            titleBar.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - container.getBoundingClientRect().left;
                offsetY = e.clientY - container.getBoundingClientRect().top;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    container.style.left = e.clientX - offsetX + 'px';
                    container.style.top = e.clientY - offsetY + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Append the container to the body
            document.body.appendChild(container);
        } else {
            // If the container exists, update the text box content
            const textBox = document.querySelector('#dollarCountContainer input');

            // Check if the total value is greater than or equal to 1000, then display in "k" format
            if (totalValue >= 1000) {
                textBox.value = `Count: ${dollarCount} | Total: $${(totalValue / 1000).toFixed(2)}k`;
            } else {
                textBox.value = `Count: ${dollarCount} | Total: $${totalValue.toFixed(2)}`;
            }
        }
    }

    // Execute the countDollars function when the page has finished loading
    window.addEventListener('load', countDollars);

    // Listen for changes to the DOM (dynamic updates) and update the count
    const observer = new MutationObserver(countDollars);
    observer.observe(document.body, { subtree: true, childList: true });
})();