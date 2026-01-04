// ==UserScript==
// @name         GMGN Tools
// @namespace    https://github.com/Xuthics/GMGN-Tools
// @version      0.2
// @license MIT
// @description  Monitor new div elements on the gmgn.ai/meme page and log unseen data-row-keys
// @author       Xuthics
// @match        https://gmgn.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gmgn.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525743/GMGN%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/525743/GMGN%20Tools.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Load seenKeys and excludedKeys from local storage
    const seenKeys = JSON.parse(localStorage.getItem('seenKeys')) || {};
    const excludedKeys = JSON.parse(localStorage.getItem('excludedKeys')) || {};

    // Function to check and log new elements
    function checkNewElements() {
        const elements = document.querySelectorAll('div.g-table-tbody-virtual-holder-inner div.g-table-row');
        const currentTime = Date.now();

        elements.forEach(element => {
            const rowKey = element.getAttribute('data-row-key');
            if (rowKey && !excludedKeys[rowKey]) {
                const lastSeenTime = seenKeys[rowKey] || 0;

                // Check if the key is new or 10 minutes have passed since last seen
                if (!lastSeenTime || (currentTime - lastSeenTime) > 30 * 1000) {
                    check_token(rowKey, element).then(() => {
                        console.log(`New or reappeared element found with data-row-key: ${rowKey}`);
                        seenKeys[rowKey] = currentTime;
                        // Save updated seenKeys to local storage
                        localStorage.setItem('seenKeys', JSON.stringify(seenKeys));
                    }).catch(error => {
                        console.error(`Failed to fetch data for ${rowKey}:`, error);
                    });
                }
            } else if (excludedKeys[rowKey]) {
                element.style.display = 'none';
            }
        });
    }

    // Function to fetch token data and analyze it
    async function check_token(token, element) {
        // Check if the token contains an underscore
        const underscoreIndex = token.indexOf('_');

        // If an underscore is present, use the part after it
        if (underscoreIndex !== -1) {
            token = token.substring(underscoreIndex + 1);
        }
        const url = `https://gmgn.ai/defi/quotation/v1/tokens/top_holders/sol/${token}?limit=50&cost=20&orderby=amount_percentage&direction=desc`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Data analysis
        let dev_team_count = 0;
        let is_suspicious_count = 0;
        let self_transfer_count = 0;
        const addresses = data.data.map(item => item.address);

        data.data.forEach(item => {
            if (item.maker_token_tags.includes('dev_team')) {
                dev_team_count++;
            }
            if (item.is_suspicious) {
                is_suspicious_count++;
            }
            if (addresses.includes(item.native_transfer.from_address)) {
                self_transfer_count++;
            }
        });

        // Display results in HTML
        const stats = {
            'Dev': dev_team_count,
            'SUS': is_suspicious_count,
            'SeT': self_transfer_count
        };

        const targetElement = element.querySelector('.css-1c1kq07');
        if (targetElement) {
            Object.entries(stats).forEach(([key, value]) => {
                let existingStat = targetElement.querySelector(`div[data-key="${key}"]`);
                if (!existingStat) {
                    existingStat = document.createElement('div');
                    existingStat.setAttribute('data-key', key);
                    targetElement.appendChild(existingStat);
                }
                existingStat.textContent = `${key}: ${value}`;
                existingStat.className = value > 20 ? 'css-1x9rvdf' : 'css-8l1uvm';
            });

            // Add a hide button inside the css-1c1kq07 element
            let existingStat = targetElement.querySelector(`button[data-key="hide_btn"]`);
                if (!existingStat) {
                    const hideButton = document.createElement('button');
                    hideButton.textContent = 'Hide';
                    hideButton.style.marginLeft = '5px';
                    hideButton.style.backgroundColor = 'blue';
                    hideButton.style.color = 'white';
                    hideButton.setAttribute('data-key', "hide_btn");
                    hideButton.onclick = (e) => {
                        e.stopPropagation(); // Prevent link click
                        e.preventDefault(); // Prevent default action
                        element.style.display = 'none';
                        excludedKeys[token] = true;
                        localStorage.setItem('excludedKeys', JSON.stringify(excludedKeys));
                    };
                    targetElement.appendChild(hideButton);
                }
        }
    }

    // Set an interval to check for new elements every second
    setInterval(checkNewElements, 1000);
})();