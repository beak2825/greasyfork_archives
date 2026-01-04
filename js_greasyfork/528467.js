// ==UserScript==
// @name         Torn Market Highlight
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Highlights seller rows if the computed mug value (based on item price x available count and your mug merits/plunder value) is >= your set minimum mug value. For opportunities above threshold, it also checks the target’s company info (if they’re in a clothing store, mug value is adjusted). Also inserts a "Mugging" button that toggles a settings menu and displays the mug value under the seller’s name.
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @author       HuzGPT
// @downloadURL https://update.greasyfork.org/scripts/528467/Torn%20Market%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/528467/Torn%20Market%20Highlight.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    /**
     * Retrieves the stored API key and its last-check timestamp.
     * If no key is stored, it prompts the user.
     * If a key is stored but 24 hours have passed, it makes a test API call
     * to ensure the key is still valid. If invalid, it prompts for a new key.
     */
    async function getOrValidateApiKey() {
        const storageKey = 'tornApiKey';
        const timestampKey = 'tornApiKeyTimestamp';
        let storedKey = localStorage.getItem(storageKey);
        let storedTimestamp = localStorage.getItem(timestampKey);
        const now = Date.now();

        // If no key is stored, prompt the user.
        if (!storedKey) {
            storedKey = window.prompt("Please enter your Torn API key:", "");
            if (storedKey) {
                localStorage.setItem(storageKey, storedKey);
                localStorage.setItem(timestampKey, now.toString());
            } else {
                alert("No API key entered. API calls will not work.");
            }
            return storedKey;
        }

        // If 24 hours have passed since the last check, validate the key.
        if (!storedTimestamp || now - parseInt(storedTimestamp, 10) > 86400000) {
            try {
                // Use a test endpoint to validate the key.
                // The Torn API endpoint below returns basic global info if the key is valid.
                const response = await fetch(`https://api.torn.com/torn/?key=${storedKey}&selections=basic`);
                const data = await response.json();
                if (data.error) {
                    console.log("Stored API key appears to be invalid. Prompting for a new key.");
                    storedKey = window.prompt("Your stored Torn API key appears to be invalid. Please enter a new Torn API key:", "");
                    if (storedKey) {
                        localStorage.setItem(storageKey, storedKey);
                        localStorage.setItem(timestampKey, now.toString());
                    } else {
                        alert("No API key entered. API calls will not work.");
                    }
                } else {
                    // Key is valid; update the timestamp.
                    localStorage.setItem(timestampKey, now.toString());
                }
            } catch (e) {
                console.error("Error validating Torn API key:", e);
            }
        }
        return storedKey;
    }

    // Wait for a valid API key.
    const API_KEY = await getOrValidateApiKey();
    if (!API_KEY) {
        console.error("No valid API key provided. Aborting script execution.");
        return;
    }

    /**
     * Processes seller rows by reading the price and available count,
     * calculating the total item value, and computing the potential mug value
     * using the effective mug percentage (5% base plus bonus from merits, then increased by plunder).
     * Only rows where the computed mug value (or its adjusted value) is >= the stored minimum mug value are highlighted.
     *
     * For rows with computed mug value >= minimum:
     * - It fetches the user's Torn API data.
     * - If the user's status is "okay", it then checks the user's company info.
     *   If the user works for a company with company_type === 5 (clothing store),
     *   a 75% mugging protection is applied (i.e. effective mug value becomes 25% of computed mug value).
     * - The effective mug value is displayed in brackets directly under the person's name.
     * - Additionally, the script now calculates and displays an adjusted price per item,
     *   where the mug value is subtracted evenly across the available count.
     */
    function processSellerRows() {
        const rows = document.querySelectorAll('.sellerRow___AI0m6:not([data-processed])');
        console.log("Found", rows.length, "new seller rows to process.");
        rows.forEach(row => {
            // Mark the row as processed so it isn’t handled again.
            row.setAttribute('data-processed', 'true');

            // Grab the price element and available count element.
            const priceEl = row.querySelector('.price___Uwiv2');
            const availableEl = row.querySelector('.available___xegv_');
            if (!priceEl || !availableEl) {
                console.log("Missing price or available element in row:", row);
                return;
            }

            // Parse the price (remove $ and commas) and available count.
            const priceStr = priceEl.textContent;
            const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
            const availableStr = availableEl.textContent;
            const availableNum = parseInt(availableStr.replace(/[^0-9]/g, ""), 10);
            if (isNaN(priceNum) || isNaN(availableNum)) {
                console.log("Could not parse price or available number for row:", row);
                return;
            }
            const totalValue = priceNum * availableNum;

            // Get stored settings.
            let storedMinMugValue = localStorage.getItem('muggingMinValue') || "0";
            storedMinMugValue = storedMinMugValue.replace(/,/g, "");
            const minMugValue = parseFloat(storedMinMugValue);
            const merits = parseInt(localStorage.getItem('muggingMerits') || "0", 10);
            const plunder = parseFloat(localStorage.getItem('muggingPlunderValue') || "0");

            // Calculate effective mug percentage.
            // Base mug % is 5; each merit increases it by 5% of 5 (i.e. 0.25 per merit)
            // Then, the plunder value multiplies the computed percentage.
            const baseMug = 5;
            const effectiveMugPercentage = (baseMug + (merits * (baseMug * 0.05))) * (1 + plunder / 100);

            // Compute the mug value based on the effective mug percentage.
            const computedMugValue = totalValue * (effectiveMugPercentage / 100);

            // Log the unadjusted calculation.
            console.log(
                `Row: Total Value: $${totalValue.toLocaleString('en-US')}, ` +
                `Effective Mug %: ${effectiveMugPercentage.toFixed(2)}% ` +
                `(Base: ${baseMug}%, Merits: ${merits}, Plunder: ${plunder}%), ` +
                `Computed Mug Value: $${computedMugValue.toLocaleString('en-US')}`
            );

            // Only proceed with the API call for rows that meet the threshold.
            if (computedMugValue < minMugValue) {
                console.log("Computed mug value is below the minimum threshold. Skipping API call.");
                return;
            }

            // Extract the player's XID from the profile link.
            const profileLink = row.querySelector('a[href*="profiles.php?XID="]');
            if (!profileLink) {
                console.log("No profile link found in row:", row);
                return;
            }
            const urlParams = new URLSearchParams(profileLink.href.split('?')[1]);
            const xid = urlParams.get('XID');
            if (!xid) {
                console.log("No XID found in URL:", profileLink.href);
                return;
            }
            console.log("Processing XID:", xid);

            // Fetch the user's data from the Torn API using the API_KEY variable.
            fetch(`https://api.torn.com/user/${xid}?key=${API_KEY}&comment=TornAPI`)
                .then(response => response.json())
                .then(data => {
                    if (!(data.status && data.status.description && data.status.description.toLowerCase() === 'okay')) {
                        console.log(`XID ${xid} status is not okay:`, data.status);
                        return;
                    }

                    // Start with the computed mug value.
                    let effectiveMugValue = computedMugValue;

                    // Check if the user has a job and if their company_type is 5 (clothing store).
                    if (data.job && data.job.company_type === 5) {
                        effectiveMugValue = computedMugValue * 0.25;
                        console.log(
                            `User XID ${xid} is in a clothing store (${data.job.company_name}). ` +
                            `Adjusted mug value (with 75% protection): $${effectiveMugValue.toLocaleString('en-US')}`
                        );
                    } else {
                        console.log(`User XID ${xid} is not in a clothing store. Using full mug value.`);
                    }

                    // Display the mug value in brackets under the person's name.
                    const honorNameSpan = row.querySelector('.honorName___JWG9U');
                    if (honorNameSpan) {
                        const displayText = `($${Math.round(effectiveMugValue).toLocaleString('en-US')})`;
                        let mugDisplay = row.querySelector('.mugValueDisplay');
                        if (!mugDisplay) {
                            // Insert a <br> immediately after the name.
                            honorNameSpan.insertAdjacentHTML('afterend', '<br>');
                            // Create an inline span for the mug value.
                            mugDisplay = document.createElement('span');
                            mugDisplay.className = 'mugValueDisplay';
                            mugDisplay.style.fontSize = '0.9em';
                            mugDisplay.style.color = '#ccc';
                            // Ensure the mug value appears on its own line.
                            mugDisplay.style.display = 'block';
                            mugDisplay.style.textAlign = 'center';
                            mugDisplay.textContent = displayText;
                            // Insert the mug value span right after the <br> we just added.
                            honorNameSpan.nextSibling.insertAdjacentElement('afterend', mugDisplay);
                        } else {
                            mugDisplay.textContent = displayText;
                        }
                    }

                    // --- NEW CODE: Calculate and display the adjusted price per item ---
                    // This value is the original price per item minus the mug amount per item.
                    if (availableNum > 0) {
                        const newPricePerItem = priceNum - (effectiveMugValue / availableNum);
                        const newPriceFormatted = `$${Math.round(newPricePerItem).toLocaleString('en-US')}`;
                        let adjustedPriceDisplay = row.querySelector('.adjustedPriceDisplay');
                        if (!adjustedPriceDisplay) {
                            // Insert a <br> immediately after the original price element.
                            priceEl.insertAdjacentHTML('afterend', '<br>');
                            adjustedPriceDisplay = document.createElement('span');
                            adjustedPriceDisplay.className = 'adjustedPriceDisplay';
                            adjustedPriceDisplay.style.fontSize = '0.9em';
                            adjustedPriceDisplay.style.color = '#ccc';
                            adjustedPriceDisplay.style.display = 'block';
                            adjustedPriceDisplay.style.textAlign = 'center';
                            adjustedPriceDisplay.textContent = `Adjusted Price: ${newPriceFormatted}`;
                            priceEl.nextSibling.insertAdjacentElement('afterend', adjustedPriceDisplay);
                        } else {
                            adjustedPriceDisplay.textContent = `Adjusted Price: ${newPriceFormatted}`;
                        }
                    }
                    // ---------------------------------------------------------------------

                    // Only highlight the row if the final effective mug value meets the threshold.
                    if (effectiveMugValue >= minMugValue) {
                        row.style.backgroundColor = 'green';
                        console.log("Highlighting row because final mug value meets threshold.");
                    } else {
                        console.log("After adjustments, mug value is below threshold. Not highlighting row.");
                    }
                })
                .catch(error => console.error(`Error fetching data for XID ${xid}:`, error));
        });
    }

    /**
     * Inserts a new button (styled like Torn’s buttons) before the "Add Listings" button.
     * The button is labeled "Mugging" and toggles the settings menu when clicked.
     */
    function insertMuggingButton() {
        const container = document.querySelector('.linksContainer___LiOTN');
        if (!container) {
            console.log("Could not find the links container.");
            return;
        }
        if (document.getElementById('muggingButton')) return;

        const muggingBtn = document.createElement('a');
        muggingBtn.setAttribute('id', 'muggingButton');
        muggingBtn.setAttribute('role', 'button');
        muggingBtn.setAttribute('aria-labelledby', 'Mugging');
        muggingBtn.setAttribute('class', 'linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9');
        muggingBtn.setAttribute('target', '_self');
        muggingBtn.setAttribute('href', 'javascript:void(0);');

        muggingBtn.innerHTML = `
            <span class="iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV">
                <span style="margin-left: 10px; margin-right: 2px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17">
                        <g>
                            <path d="M9,1.5C5.41,1.5,2.5,4.41,2.5,8s2.91,6.5,6.5,6.5c2.24,0,4.21-1.16,5.38-2.88l-1.54-1.0
                            C12.97,11.87,11.04,13,9,13c-3.04,0-5.5-2.46-5.5-5.5S5.96,2,9,2s5.5,2.46,5.5,5.5H13l2.5,2.5L18,7.5h-2.03
                            C15.48,5.07,12.86,3,9,3z"></path>
                        </g>
                    </svg>
                </span>
            </span>
            <span class="linkTitle____NPyM">Mugging</span>
        `;

        const addListingsBtn = container.querySelector('a[aria-labelledby="Add Listings"]');
        if (addListingsBtn) {
            container.insertBefore(muggingBtn, addListingsBtn);
            console.log("Mugging button inserted.");
        } else {
            container.appendChild(muggingBtn);
            console.log("Mugging button appended.");
        }

        // Toggle the mugging settings menu on click.
        muggingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMuggingMenu(muggingBtn);
        });
    }

    /**
     * Creates the mugging settings menu and appends it to the document body.
     * The menu is hidden by default and will be positioned below the mugging button.
     * It now also auto‑formats the "Min Mug Value" input with commas on blur and allows abbreviated input.
     */
    function createMuggingMenu() {
        if (document.getElementById('muggingMenu')) return;

        const menu = document.createElement('div');
        menu.id = "muggingMenu";
        Object.assign(menu.style, {
            position: 'absolute',
            backgroundColor: '#222',
            border: '1px solid #555',
            borderRadius: '4px',
            padding: '10px',
            display: 'none',
            zIndex: 1000,
            width: '260px'
        });

        // Load stored values (or use defaults).
        const storedMin = localStorage.getItem('muggingMinValue') || '';
        const storedPlunder = localStorage.getItem('muggingPlunderValue') || 0;
        const storedMerits = localStorage.getItem('muggingMerits') || 0;

        menu.innerHTML = `
            <div style="color: #fff; font-weight: bold; margin-bottom: 8px;">Mugging Settings</div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <label for="minMugValue" style="color: #fff; font-size: 0.9em; width: 120px;">Min Mug Value:</label>
                <input type="text" id="minMugValue" value="${storedMin}" style="width: 80px; border: 1px solid #555; border-radius: 3px; padding: 2px 4px; background-color: #333; color: #fff;">
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <label for="plunderValue" style="color: #fff; font-size: 0.9em; width: 120px;">Plunder Value (%):</label>
                <input type="number" id="plunderValue" value="${storedPlunder}" style="width: 80px; border: 1px solid #555; border-radius: 3px; padding: 2px 4px; background-color: #333; color: #fff;">
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <label for="mugMerits" style="color: #fff; font-size: 0.9em; width: 120px;">Mug Merits (max 10):</label>
                <input type="number" id="mugMerits" value="${storedMerits}" min="0" max="10" style="width: 80px; border: 1px solid #555; border-radius: 3px; padding: 2px 4px; background-color: #333; color: #fff;">
            </div>
            <div style="text-align: right;">
                <button id="muggingApplyBtn" style="padding: 3px 8px; background-color: #555; color: #fff; border: none; border-radius: 3px; cursor: pointer;">
                    Apply
                </button>
            </div>
        `;
        document.body.appendChild(menu);

        // Set up auto-conversion and auto-formatting for the "Min Mug Value" input.
        const minMugInput = document.getElementById('minMugValue');
        minMugInput.addEventListener('input', () => {
            let value = minMugInput.value.trim();
            // Allow abbreviated input like 1k, 1m, 1b (case-insensitive)
            const regex = /^(\d+(\.\d+)?)([kKmMbB])$/;
            const match = value.match(regex);
            if (match) {
                let number = parseFloat(match[1]);
                let multiplier = 1;
                switch(match[3].toLowerCase()){
                    case 'k': multiplier = 1000; break;
                    case 'm': multiplier = 1000000; break;
                    case 'b': multiplier = 1000000000; break;
                }
                minMugInput.value = (number * multiplier).toString();
            }
        });
        // On blur, reformat the number with commas.
        minMugInput.addEventListener('blur', () => {
            let value = minMugInput.value.trim();
            let number = parseFloat(value.replace(/,/g, ""));
            if (!isNaN(number)) {
                 minMugInput.value = number.toLocaleString('en-US');
            }
        });

        // When the Apply button is clicked, store the settings (removing commas) and hide the menu.
        document.getElementById('muggingApplyBtn').addEventListener('click', (e) => {
            const minMugRaw = document.getElementById('minMugValue').value;
            const minMug = minMugRaw.replace(/,/g, "");
            const plunder = document.getElementById('plunderValue').value;
            const merits = document.getElementById('mugMerits').value;
            localStorage.setItem('muggingMinValue', minMug);
            localStorage.setItem('muggingPlunderValue', plunder);
            localStorage.setItem('muggingMerits', merits);
            alert(`Mugging settings saved:
Min Mug Value: $${parseFloat(minMug).toLocaleString('en-US')}
Plunder Value: ${plunder}%
Mug Merits: ${merits}`);
            menu.style.display = 'none';
            e.stopPropagation();
        });

        // Close the menu if clicking anywhere outside it or the mugging button.
        document.addEventListener('click', (e) => {
            const menuEl = document.getElementById('muggingMenu');
            const muggingBtn = document.getElementById('muggingButton');
            if (menuEl && menuEl.style.display === 'block' &&
                !menuEl.contains(e.target) && e.target !== muggingBtn) {
                menuEl.style.display = 'none';
            }
        });
    }

    /**
     * Toggles the display of the mugging settings menu.
     * Positions the menu just below the mugging button.
     */
    function toggleMuggingMenu(button) {
        const menu = document.getElementById('muggingMenu');
        if (!menu) return;
        if (menu.style.display === 'none' || menu.style.display === '') {
            const rect = button.getBoundingClientRect();
            menu.style.top = (rect.bottom + window.scrollY + 5) + 'px';
            menu.style.left = (rect.left + window.scrollX) + 'px';
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }

    // Run on window load.
    window.addEventListener("load", () => {
        processSellerRows();
        insertMuggingButton();
        createMuggingMenu();
    });

    // Set up a MutationObserver to process any new seller rows dynamically added.
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                processSellerRows();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
