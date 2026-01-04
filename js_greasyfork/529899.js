// ==UserScript==
// @name         OKX Contract Twitter Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add Twitter search buttons for contract addresses on OKX Web3 page
// @author       @dami16z(https://x.com/dami16z)
// @match        https://www.okx.com/zh-hans/web3*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529899/OKX%20Contract%20Twitter%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/529899/OKX%20Contract%20Twitter%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for the Twitter search button
    const style = document.createElement('style');
    style.textContent = `
        .twitter-search-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-left: 8px;
            cursor: pointer;
            color: #1DA1F2;
            background: transparent;
            border: none;
            padding: 0;
            font-size: 16px;
            transition: transform 0.2s ease;
        }
        .twitter-search-btn:hover {
            transform: scale(1.2);
        }
    `;
    document.head.appendChild(style);

    // Function to extract contract address from href
    function extractContractAddress(href) {
        const parts = href.split('/');
        return parts[parts.length - 1];
    }

    // Twitter search icon SVG
    const twitterIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2">
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
        </svg>
    `;

    // Function to add Twitter search buttons
    function addTwitterSearchButtons() {
        // Find all contract address elements
        const addressElements = document.querySelectorAll('.index_copy-address__p778v');
        addressElements.forEach(addressElement => {
            // Check if we've already added a button to this element
            if (addressElement.querySelector('.twitter-search-btn')) {
                return;
            }
            // Create the Twitter search button
            const twitterButton = document.createElement('button');
            twitterButton.className = 'twitter-search-btn';
            twitterButton.innerHTML = twitterIcon;
            twitterButton.title = '在Twitter上搜索此合约';
            // Find the contract address
            const addressText = addressElement.querySelector('span').textContent;
            const trimmedAddress = addressText.replace('...', '');
            // Get the full contract address from the parent anchor tag
            let fullAddress = '';
            const rowElement = addressElement.closest('a');
            if (rowElement) {
                const href = rowElement.getAttribute('href');
                fullAddress = extractContractAddress(href);
            }
            // Use the full address if available, otherwise use the trimmed address
            const searchAddress = fullAddress || trimmedAddress;
            // Add click event listener to open Twitter search in a new tab
            twitterButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://x.com/search?q=${searchAddress}`, '_blank');
            });
            // Add the button after the copy icon
            const copyIcon = addressElement.querySelector('.index_copy-icon__9sTmJ');
            if (copyIcon) {
                copyIcon.parentNode.parentNode.after(twitterButton);
            } else {
                // If copy icon not found, append to the address element
                addressElement.appendChild(twitterButton);
            }
        });
    }

    // Function to observe for changes in the DOM
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addTwitterSearchButtons();
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Run initially and observe for changes
    window.addEventListener('load', () => {
        setTimeout(() => {
            addTwitterSearchButtons();
            observeDOM();
        }, 1500); // Delay to ensure the page has loaded properly
    });

    // Run periodically to catch any missed elements
    setInterval(addTwitterSearchButtons, 3000);
})();