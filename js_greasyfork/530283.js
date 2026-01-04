// ==UserScript==
// @name         Elethor Combat Calculator
// @namespace    http://tampermonkey.net/
// @version      1.60
// @description  Calculate combat profit with uniform midas/extractor options.
// @author       Eugene
// @match        https://elethor.com/*
// @grant        GM_xmlhttpRequest
// @esversion   11
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/530283/Elethor%20Combat%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/530283/Elethor%20Combat%20Calculator.meta.js
// ==/UserScript==

/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

(function() {
    'use strict';

    const monsterData = {
        'Apex Nassul': { mobDrop: 'Ether Flux', itemId: 381, baseMobDropChance: 40.5, baseGoldDropChance: 100 },
        'Scarlet Merchant': { mobDrop: null, itemId: null, baseMobDropChance: 0, baseGoldDropChance: 100 },
        'Voidkin Artificier': { mobDrop: 'Void Artifact', itemId: 385, baseMobDropChance: 100, baseGoldDropChance: 100 },
        'Voidstalker': { mobDrop: 'Tattered Cowl', itemId: 386, baseMobDropChance: 40.5, baseGoldDropChance: 100 },
        'Tunnel Ambusher': { mobDrop: 'Carapace Segment', itemId: 387, baseMobDropChance: 40.5, baseGoldDropChance: 100 },
        'Elite Guard Broodmother': { mobDrop: 'Elite Guard Insignia', itemId: 388, baseMobDropChance: 40.5, baseGoldDropChance: 100 }
    };

    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Combat Calculator';
        button.style.cssText = "position: fixed; top: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; z-index: 1000;";
        document.body.appendChild(button);
        button.addEventListener('click', toggleCalculator);
    }

    function createCalculatorUI() {
        const container = document.createElement('div');
        container.id = 'combatCalculator';
        container.style.cssText = "display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: black; color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(255,255,255,0.5); z-index: 1001; max-height: 80vh; overflow-y: auto; min-width: 800px;";


        const title = document.createElement('h2');
        title.textContent = 'Combat Calculator';
        title.style.textAlign = 'center';

        const subtitle = document.createElement('h3');
        subtitle.style.textAlign = 'center';
        subtitle.innerHTML = 'Made by <a href="https://elethor.com/profile/49979" target="_blank">Eugene</a>';

        container.appendChild(title);
        container.appendChild(subtitle);

        // -- Uniform Settings Container --
        const uniformContainer = document.createElement('div');
        uniformContainer.id = 'uniformContainer';
        uniformContainer.style.cssText = "margin: 10px 0; padding: 10px; border: 1px solid white;";

        // Uniform Midas Checkbox
        const uniformMidasLabel = document.createElement('label');
        uniformMidasLabel.style.marginRight = '20px';
        const uniformMidasCheckbox = document.createElement('input');
        uniformMidasCheckbox.type = 'checkbox';
        uniformMidasCheckbox.id = 'uniformMidasCheckbox';
        uniformMidasLabel.appendChild(uniformMidasCheckbox);
        uniformMidasLabel.appendChild(document.createTextNode(' Uniform Midas'));
        uniformMidasCheckbox.addEventListener('change', function() {
            document.querySelectorAll('.midas-input').forEach(input => {
                input.disabled = this.checked;
                input.parentElement.classList.toggle('disabled-input', this.checked);
            });
        });
        uniformContainer.appendChild(uniformMidasLabel);

        // Uniform Extractor Checkbox
        const uniformExtractorLabel = document.createElement('label');
        const uniformExtractorCheckbox = document.createElement('input');
        uniformExtractorCheckbox.type = 'checkbox';
        uniformExtractorCheckbox.id = 'uniformExtractorCheckbox';
        uniformExtractorLabel.appendChild(uniformExtractorCheckbox);
        uniformExtractorLabel.appendChild(document.createTextNode(' Uniform Extractor'));
        uniformExtractorCheckbox.addEventListener('change', function() {
            document.querySelectorAll('.extractor-input').forEach(input => {
                input.disabled = this.checked;
                input.parentElement.classList.toggle('disabled-input', this.checked);
            });
        });
        uniformContainer.appendChild(uniformExtractorLabel);

        // Global Midas Input (hidden by default)
        const globalMidasContainer = document.createElement('div');
        globalMidasContainer.id = 'globalMidasContainer';
        globalMidasContainer.style.cssText = "display: none; margin-top: 10px;";
        const globalMidasLabel = document.createElement('label');
        globalMidasLabel.textContent = 'Global Midas %: ';
        const globalMidasInput = document.createElement('input');
        globalMidasInput.type = 'number';
        globalMidasInput.id = 'globalMidasInput';
        globalMidasInput.min = '0';
        globalMidasInput.style.cssText = "background-color: white; color: black;";
        globalMidasContainer.appendChild(globalMidasLabel);
        globalMidasContainer.appendChild(globalMidasInput);
        uniformContainer.appendChild(globalMidasContainer);

        // Global Extractor Input (hidden by default)
        const globalExtractorContainer = document.createElement('div');
        globalExtractorContainer.id = 'globalExtractorContainer';
        globalExtractorContainer.style.cssText = "display: none; margin-top: 10px;";
        const globalExtractorLabel = document.createElement('label');
        globalExtractorLabel.textContent = 'Global Extractor %: ';
        const globalExtractorInput = document.createElement('input');
        globalExtractorInput.type = 'number';
        globalExtractorInput.id = 'globalExtractorInput';
        globalExtractorInput.min = '0';
        globalExtractorInput.style.cssText = "background-color: white; color: black;";
        globalExtractorContainer.appendChild(globalExtractorLabel);
        globalExtractorContainer.appendChild(globalExtractorInput);
        uniformContainer.appendChild(globalExtractorContainer);

        // Event listeners for uniform checkboxes
        uniformMidasCheckbox.addEventListener('change', function() {
            if (this.checked) {
                globalMidasContainer.style.display = 'block';
                // Disable individual midas inputs
                document.querySelectorAll('.midas-input').forEach(input => {
                    input.disabled = true;
                    input.style.backgroundColor = '#f0f0f0';
                });
            } else {
                globalMidasContainer.style.display = 'none';
                // Enable individual midas inputs
                document.querySelectorAll('.midas-input').forEach(input => {
                    input.disabled = false;
                    input.style.backgroundColor = 'white';
                });
            }
        });

        uniformExtractorCheckbox.addEventListener('change', function() {
            if (this.checked) {
                globalExtractorContainer.style.display = 'block';
                // Disable individual extractor inputs
                document.querySelectorAll('.extractor-input').forEach(input => {
                    input.disabled = true;
                    input.style.backgroundColor = '#f0f0f0';
                });
            } else {
                globalExtractorContainer.style.display = 'none';
                document.querySelectorAll('.extractor-input').forEach(input => {
                    input.disabled = false;
                    input.style.backgroundColor = 'white';
                });
            }
        });

        container.appendChild(uniformContainer);
        const progressIndicator = document.createElement('div');
        progressIndicator.id = 'progressIndicator';
        progressIndicator.style.cssText = "margin-bottom: 10px; font-size: 14px;";
        container.appendChild(progressIndicator);
        // -------------------------------

        const monsterList = document.createElement('div');
        monsterList.style.marginTop = '20px';

        for (const monster in monsterData) {
            const row = createMonsterRow(monster, monsterData[monster]);
            monsterList.appendChild(row);
        }

        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Calculate';
        calculateButton.style.cssText = "background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px; width: 100%;";
        calculateButton.addEventListener('click', calculateGpA);

        container.appendChild(monsterList);
        container.appendChild(calculateButton);
        document.body.appendChild(container);

        // Add overlay
        const overlay = document.createElement('div');
        overlay.id = 'calculatorOverlay';
        overlay.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000;";
        overlay.addEventListener('click', toggleCalculator);
        document.body.appendChild(overlay);
    }

    function createMonsterRow(monsterName, data) {
        const row = document.createElement('div');
        // Add a class to easily identify monster rows
        row.classList.add('monster-row');
        row.style.cssText = "display: grid; grid-template-columns: 200px repeat(6, 1fr) 100px; gap: 10px; margin-bottom: 15px; align-items: center; color: white;";

        // Monster name
        const nameLabel = document.createElement('div');
        nameLabel.textContent = monsterName;
        row.appendChild(nameLabel);

        // Tier input
        const tierInput = document.createElement('input');
        tierInput.type = 'number';
        tierInput.min = '0';
        tierInput.max = '10000';
        tierInput.placeholder = 'Tier';
        tierInput.className = 'tier-input';
        tierInput.style.backgroundColor = 'white';
        tierInput.style.color = 'black';
        row.appendChild(tierInput);

        // Win rate input
        const winRateInput = document.createElement('input');
        winRateInput.type = 'number';
        winRateInput.min = '0';
        winRateInput.max = '100';
        winRateInput.placeholder = 'Win Rate %';
        winRateInput.className = 'winrate-input';
        winRateInput.style.backgroundColor = 'white';
        winRateInput.style.color = 'black';
        row.appendChild(winRateInput);

        // Price radio buttons
        const priceContainer = document.createElement('div');
        priceContainer.style.cssText = "display: flex; align-items: center; gap: 10px;";
        const priceLabel = document.createElement('span');
        priceLabel.textContent = 'Price: ';
        priceContainer.appendChild(priceLabel);

        const priceTypes = ['Buy price', 'Sell price', 'Manual'];
        priceTypes.forEach((type, index) => {
            const radioContainer = document.createElement('div');
            radioContainer.style.cssText = "display: flex; align-items: center; gap: 4px;";

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `price-${monsterName}`;
            radio.value = type.toLowerCase();
            radio.id = `${type.toLowerCase()}-${monsterName}`;
            radio.style.margin = '0';
            if (index === 0) radio.checked = true;

            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.textContent = type;
            label.style.margin = '0';

            radioContainer.appendChild(radio);
            radioContainer.appendChild(label);
            priceContainer.appendChild(radioContainer);
        });

        // Disable price options for Scarlet Merchant
        if (monsterName === 'Scarlet Merchant') {
            priceContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.disabled = true;
            });
        }

        row.appendChild(priceContainer);

        // Price input - always visible and persistent
        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.min = '0';
        priceInput.placeholder = monsterName === 'Scarlet Merchant' ? 'No mob drops' : 'Price';
        priceInput.className = 'price-input';
        priceInput.dataset.monster = monsterName;
        priceInput.style.backgroundColor = monsterName === 'Scarlet Merchant' ? '#f0f0f0' : 'white';
        priceInput.style.color = 'black';
        if (monsterName === 'Scarlet Merchant') {
            priceInput.disabled = true;
        }
        row.appendChild(priceInput);

        // Load saved values from localStorage if available
        const savedManualPrice = localStorage.getItem(`manual-price-${monsterName}`);
        const savedTier = localStorage.getItem(`tier-${monsterName}`);
        const savedWinRate = localStorage.getItem(`winrate-${monsterName}`);

        if (savedManualPrice) {
            priceInput.value = savedManualPrice;
        }
        if (savedTier) {
            tierInput.value = savedTier;
        }
        if (savedWinRate) {
            winRateInput.value = savedWinRate;
        }

        // Save tier and winrate to localStorage when they change
        tierInput.addEventListener('input', () => {
            localStorage.setItem(`tier-${monsterName}`, tierInput.value);
        });

        winRateInput.addEventListener('input', () => {
            localStorage.setItem(`winrate-${monsterName}`, winRateInput.value);
        });

        // Save manual price to localStorage when it changes
        priceInput.addEventListener('input', () => {
            if (priceContainer.querySelector('input[value="manual"]:checked')) {
                localStorage.setItem(`manual-price-${monsterName}`, priceInput.value);
            }
        });

        // Handle price input behavior based on radio selection
        priceContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
            // Load saved price type selection from localStorage
            const savedPriceType = localStorage.getItem(`price-type-${monsterName}`);
            if (savedPriceType && radio.value === savedPriceType) {
                radio.checked = true;
            }

            radio.addEventListener('change', () => {
                // Save price type selection to localStorage
                localStorage.setItem(`price-type-${monsterName}`, radio.value);

                if (radio.value === 'manual') {
                    priceInput.disabled = false;
                    priceInput.style.backgroundColor = 'white';
                    priceInput.placeholder = 'Enter price';
                    // Restore saved manual price if available
                    const savedPrice = localStorage.getItem(`manual-price-${monsterName}`);
                    if (savedPrice) {
                        priceInput.value = savedPrice;
                    }
                } else {
                    priceInput.disabled = true;
                    priceInput.style.backgroundColor = '#f0f0f0';
                    priceInput.placeholder = 'Fetching price...';
                    // If monster has an item, fetch the price immediately
                    if (data.itemId) {
                        fetchMarketData(data.itemId, radio.value === 'buy price' ? 'buy' : 'sell')
                            .then(price => {
                            priceInput.value = price;
                        })
                            .catch(error => {
                            console.error(`Error fetching price for ${monsterName}:`, error);
                            priceInput.placeholder = 'Error fetching price';
                        });
                    }
                }
            });
        });

        // Set initial state based on saved or default selection
        const selectedRadio = priceContainer.querySelector('input[type="radio"]:checked');
        if (selectedRadio.value === 'manual') {
            priceInput.disabled = false;
            priceInput.style.backgroundColor = 'white';
            priceInput.placeholder = 'Enter price';
        } else {
            priceInput.disabled = true;
            priceInput.style.backgroundColor = '#f0f0f0';
            priceInput.placeholder = 'Fetching price...';
            // If monster has an item, fetch the price immediately
            if (data.itemId) {
                fetchMarketData(data.itemId, selectedRadio.value === 'buy price' ? 'buy' : 'sell')
                    .then(price => {
                    priceInput.value = price;
                })
                    .catch(error => {
                    console.error(`Error fetching price for ${monsterName}:`, error);
                    priceInput.placeholder = 'Error fetching price';
                });
            }
        }

        // Midas percentage input
        const midasInput = document.createElement('input');
        midasInput.type = 'number';
        midasInput.min = '0';
        midasInput.placeholder = 'Midas %';
        midasInput.className = 'midas-input';
        midasInput.style.backgroundColor = 'white';
        midasInput.style.color = 'black';
        row.appendChild(midasInput);

        // Load saved Midas value
        const savedMidas = localStorage.getItem(`midas-${monsterName}`);
        if (savedMidas) {
            midasInput.value = savedMidas;
        }

        // Save Midas value when it changes
        midasInput.addEventListener('input', () => {
            localStorage.setItem(`midas-${monsterName}`, midasInput.value);
        });

        // Extractor percentage input
        const extractorInput = document.createElement('input');
        extractorInput.type = 'number';
        extractorInput.min = '0';
        extractorInput.placeholder = 'Extractor %';
        extractorInput.className = 'extractor-input';
        extractorInput.style.backgroundColor = 'white';
        extractorInput.style.color = 'black';
        row.appendChild(extractorInput);

        // Load saved Extractor value
        const savedExtractor = localStorage.getItem(`extractor-${monsterName}`);
        if (savedExtractor) {
            extractorInput.value = savedExtractor;
        }

        // Save Extractor value when it changes
        extractorInput.addEventListener('input', () => {
            localStorage.setItem(`extractor-${monsterName}`, extractorInput.value);
        });

        // GpA result
        const gpaResult = document.createElement('div');
        gpaResult.className = 'gpa-result';
        row.appendChild(gpaResult);

        return row;
    }

    async function fetchMarketData(itemId, priceType) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://elethor.com/game/market/listings?itemId=${itemId}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (!data || !Array.isArray(data)) {
                            throw new Error('Invalid market data received');
                        }

                        const relevantListings = data.filter(listing => listing.type === priceType);
                        if (relevantListings.length === 0) {
                            throw new Error(`No ${priceType} listings found`);
                        }

                        if (priceType === 'sell') {
                            resolve(Math.min(...relevantListings.map(listing => listing.price)));
                        } else {
                            resolve(Math.max(...relevantListings.map(listing => listing.price)));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function calculateTierMultiplier(tier, isGold, isScarletMerchant) {
        if (isGold) {
            if (isScarletMerchant) {
                return 1 + (tier * 0.2);
            } else {
                return 1 + (tier * 0.15);
            }
        } else {
            return 1 + (tier * 0.75);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function calculateGpA() {
        const progressIndicator = document.getElementById('progressIndicator');
        const rows = document.querySelectorAll('.monster-row');
        let maxGpA = -1;
        let maxGpARow = null;

        // Reset previous results
        document.querySelectorAll('.gpa-result').forEach(result => {
            result.textContent = '';
            result.style.color = '';
        });

        // Step 1: Refresh market prices
        progressIndicator.textContent = "Step 1: Refreshing market prices...";
        let totalMonsters = rows.length;
        let count = 0;
        for (const row of rows) {
            const monsterName = row.querySelector('div').textContent;
            progressIndicator.textContent = `Fetching price for ${monsterName} (${++count}/${totalMonsters})...`;

            const monsterInfo = monsterData[monsterName];
            const selectedPriceType = row.querySelector('input[type="radio"]:checked')?.value;
            const priceInput = row.querySelector('.price-input');

            if (monsterInfo.itemId && selectedPriceType !== 'manual') {
                try {
                    const price = await fetchMarketData(
                        monsterInfo.itemId,
                        selectedPriceType === 'buy price' ? 'buy' : 'sell'
                    );
                    priceInput.value = price;
                } catch (error) {
                    console.error(`Error refreshing price for ${monsterName}:`, error);
                }
            }
            // Optional small delay to help the UI update the text
            await sleep(50);
        }

        // Step 2: Calculate GPA for each monster
        progressIndicator.textContent = "Step 2: Calculating GPAs...";
        count = 0;
        for (const row of rows) {
            const monsterName = row.querySelector('div').textContent;
            progressIndicator.textContent = `Calculating GPA for ${monsterName} (${++count}/${totalMonsters})...`;

            const monsterInfo = monsterData[monsterName];
            const tier = parseFloat(row.querySelector('.tier-input').value) || 0;
            const winRate = parseFloat(row.querySelector('.winrate-input').value) || 0;
            let midasPercentage = parseFloat(row.querySelector('.midas-input').value) || 0;
            let extractorPercentage = parseFloat(row.querySelector('.extractor-input').value) || 0;

            // Override with global values if uniform mode is enabled
            const uniformMidas = document.getElementById('uniformMidasCheckbox').checked;
            const uniformExtractor = document.getElementById('uniformExtractorCheckbox').checked;
            if (uniformMidas) {
                midasPercentage = parseFloat(document.getElementById('globalMidasInput').value) || 0;
            }
            if (uniformExtractor) {
                extractorPercentage = parseFloat(document.getElementById('globalExtractorInput').value) || 0;
            }

            let mobDropPrice = 0;
            const selectedPriceType = row.querySelector('input[type="radio"]:checked')?.value;

            if (monsterInfo.itemId && selectedPriceType !== 'manual') {
                try {
                    mobDropPrice = await fetchMarketData(
                        monsterInfo.itemId,
                        selectedPriceType === 'buy price' ? 'buy' : 'sell'
                    );
                } catch (error) {
                    console.error(`Error fetching price for ${monsterName}:`, error);
                }
            } else if (selectedPriceType === 'manual') {
                mobDropPrice = parseFloat(row.querySelector('.price-input').value) || 0;
            }

            const mobDropMultiplier = calculateTierMultiplier(tier, false, false);
            const goldMultiplier = calculateTierMultiplier(tier, true, monsterName === 'Scarlet Merchant');

            // Determine the gold multiplier factor based on the monster
const goldMultiplierFactor = (monsterName === 'Scarlet Merchant') ? 40850 : 24400;

const gpa = (
    ((winRate / 100) * monsterInfo.baseMobDropChance * mobDropMultiplier / 100) * (1 + extractorPercentage / 100) * mobDropPrice +
    (((winRate / 100) * monsterInfo.baseGoldDropChance * goldMultiplier / 100) * (1 + midasPercentage / 100)) * goldMultiplierFactor
);


            const gpaResult = row.querySelector('.gpa-result');
            gpaResult.textContent = gpa.toFixed(2);

            if (gpa > maxGpA) {
                maxGpA = gpa;
                maxGpARow = row;
            }
            // Optional delay for UI responsiveness
            await sleep(50);
        }

        // Step 3: Compare and mark best GPA
        progressIndicator.textContent = "Step 3: Comparing GPAs...";
        if (maxGpARow) {
            const checkmark = '✓';
            maxGpARow.querySelector('.gpa-result').style.color = '#4CAF50';
            maxGpARow.querySelector('.gpa-result').textContent += ` ${checkmark}`;
        }

        // Final update
        progressIndicator.textContent = "Calculation complete!";
    }


    function toggleCalculator() {
        const calculator = document.getElementById('combatCalculator');
        const overlay = document.getElementById('calculatorOverlay');
        const isVisible = calculator.style.display === 'block';

        calculator.style.display = isVisible ? 'none' : 'block';
        overlay.style.display = isVisible ? 'none' : 'block';
    }

    // Initialize the calculator
    createButton();
    createCalculatorUI();
})();
