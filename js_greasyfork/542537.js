// ==UserScript==
// @name         PSF Price Optimizer Enhanced compact
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Suggests optimal prices for PSF contracts based on company data
// @author       Chevy
// @match        https://www.torn.com/companies.php*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/542537/PSF%20Price%20Optimizer%20Enhanced%20compact.user.js
// @updateURL https://update.greasyfork.org/scripts/542537/PSF%20Price%20Optimizer%20Enhanced%20compact.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Log script start
    console.log('PSF Price Optimizer Enhanced script started at', new Date().toLocaleString());

    // Enhanced CSS styles for the optimizer panel
    GM_addStyle(`
        #price-optimizer {
            position: fixed;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #2c3e50, #3498db);
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            max-width: 300px;
            border: 1px solid #34495e;
        }
        #price-optimizer h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            text-align: center;
            border-bottom: 1px solid #34495e;
            padding-bottom: 5px;
        }
        #price-optimizer input {
            margin-top: 5px;
            padding: 5px;
            width: 120px;
            border: 1px solid #34495e;
            border-radius: 3px;
            background: #34495e;
            color: #fff;
        }
        #price-optimizer label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
            font-size: 11px;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            padding: 2px;
            border-radius: 3px;
            background: rgba(255,255,255,0.1);
        }
        .price-label {
            font-weight: bold;
            color: #f39c12;
        }
        .price-value {
            color: #2ecc71;
            font-weight: bold;
        }
        .company-stats {
            background: rgba(255,255,255,0.1);
            padding: 8px;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        .toggle-button {
            background: #e74c3c;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            margin-top: 5px;
        }
        .toggle-button:hover {
            background: #c0392b;
        }
        .refresh-button {
            background: #3498db;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 5px;
        }
        .refresh-button:hover {
            background: #2980b9;
        }
        #price-optimizer.minimized {
            height: 40px;
            overflow: hidden;
        }
        #price-optimizer.minimized .maximize-button {
            display: block;
        }
        .maximize-button {
            display: none;
            background: #27ae60;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            margin-top: 5px;
        }
        .maximize-button:hover {
            background: #229954;
        }
        .bus2700-checkbox {
            margin: 5px 0;
        }
        .bus2700-checkbox input[type="checkbox"] {
            width: auto;
            margin-right: 5px;
        }
        .log-container {
            margin-top: 10px;
            background: rgba(0,0,0,0.3);
            border-radius: 3px;
            padding: 8px;
            max-height: 150px;
            overflow-y: auto;
            font-size: 10px;
        }
        .log-entry {
            margin: 2px 0;
            padding: 2px;
            border-left: 2px solid #3498db;
            padding-left: 5px;
        }
        .log-timestamp {
            color: #bdc3c7;
            font-size: 9px;
        }
        .button-container {
            display: flex;
            gap: 5px;
            margin-top: 10px;
        }
        .price-inputs-dropdown {
            margin-top: 10px;
        }
        .dropdown-toggle {
            background: #8e44ad;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            width: 100%;
        }
        .dropdown-toggle:hover {
            background: #7d3c98;
        }
        .dropdown-content {
            display: none;
            margin-top: 5px;
            background: rgba(0,0,0,0.3);
            border-radius: 3px;
            padding: 8px;
        }
        .dropdown-content.show {
            display: block;
        }
    `);

    // Contract base prices and metadata (calibrated to user's current capabilities)
    const CONTRACT_DATA = {
        military: {
            basePrice: 26000000,  // Set to user's achievable target
            name: 'Military',
            description: 'High-value military contracts',
            dailyIncrement: 200000  // Conservative daily increase
        },
        protection: {
            basePrice: 4160000,   // Scaled proportionally (26M/18M * 3M)
            name: 'Protection',
            description: 'Standard protection services',
            dailyIncrement: 32000
        },
        training: {
            basePrice: 722000,    // Scaled proportionally (26M/18M * 500K)
            name: 'Training',
            description: 'Employee training programs',
            dailyIncrement: 5000
        },
        engagement: {
            basePrice: 11555000,  // Scaled proportionally (26M/18M * 8M)
            name: 'Engagement',
            description: 'Corporate engagement services',
            dailyIncrement: 90000
        }
    };

    // Calculate safe incremental price increases
    function calculateIncrementalIncrease(contractType, currentPrice) {
        const contract = CONTRACT_DATA[contractType];
        const targetPrice = contract.basePrice;
        const dailyIncrement = contract.dailyIncrement;

        // If no current price provided, start at 90% of base
        if (!currentPrice) {
            return Math.round(targetPrice * 0.9);
        }

        // If already at or above target, suggest maintaining current price
        if (currentPrice >= targetPrice) {
            return currentPrice;
        }

        // Calculate safe incremental increase
        const difference = targetPrice - currentPrice;
        const suggestedIncrease = Math.min(dailyIncrement, difference);
        const newPrice = currentPrice + suggestedIncrease;

        return Math.round(newPrice / 1000) * 1000; // Round to nearest thousand
    }
    function logAction(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp: timestamp,
            message: message
        };

        // Get existing logs
        let logs = GM_getValue('psfLogs', []);
        logs.push(logEntry);

        // Keep only last 50 log entries
        if (logs.length > 50) {
            logs = logs.slice(-50);
        }

        GM_setValue('psfLogs', logs);
        console.log(`[PSF Optimizer ${timestamp}] ${message}`);
    }

    // Create log display
    function createLogDisplay() {
        const container = document.createElement('div');
        container.className = 'log-container';
        container.style.display = 'none'; // Hidden by default

        const title = document.createElement('strong');
        title.textContent = 'Activity Log:';
        title.style.display = 'block';
        title.style.marginBottom = '5px';

        const logEntries = document.createElement('div');
        logEntries.id = 'log-entries';

        // Load existing logs
        const logs = GM_getValue('psfLogs', []);
        logs.slice(-10).forEach(log => { // Show last 10 entries
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `
                <span class="log-timestamp">${log.timestamp}</span><br>
                ${log.message}
            `;
            logEntries.appendChild(entry);
        });

        container.appendChild(title);
        container.appendChild(logEntries);
        return container;
    }

    // Create refresh button
    function createRefreshButton() {
        const button = document.createElement('button');
        button.className = 'refresh-button';
        button.textContent = 'Refresh';
        button.title = 'Refresh company data and recalculate prices';

        button.addEventListener('click', () => {
            logAction('Manual refresh triggered');
            updateOptimizer();
        });

        return button;
    }

    // Create log toggle button
    function createLogToggleButton() {
        const button = document.createElement('button');
        button.className = 'toggle-button';
        button.textContent = 'Show Log';
        button.style.background = '#9b59b6';
        button.style.fontSize = '10px';

        button.addEventListener('click', () => {
            const logContainer = document.querySelector('.log-container');
            if (logContainer.style.display === 'none') {
                logContainer.style.display = 'block';
                button.textContent = 'Hide Log';
                logAction('Log display opened');
            } else {
                logContainer.style.display = 'none';
                button.textContent = 'Show Log';
            }
        });

        return button;
    }

    // Collect company data from the page with improved selectors
    function getCompanyData() {
        let data = {
            employeeCount: 0,
            avgEfficiency: 100,
            advertising: GM_getValue('advertising', 1000000),
            lastUpdated: new Date().toISOString()
        };

        // Enhanced employee count detection
        const employeeSelectors = [
            '.total-employees',
            '.employee-count',
            '.employees-total',
            'span[class*="employee"]'
        ];

        for (const selector of employeeSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const count = parseInt(element.textContent.match(/\d+/)?.[0] || 0);
                if (count > 0) {
                    data.employeeCount = count;
                    logAction(`Found ${count} employees on page`);
                    break;
                }
            }
        }

        // Fallback to stored value if no employees found on page
        if (data.employeeCount === 0) {
            data.employeeCount = GM_getValue('employeeCount', 0);
            logAction(`Using stored employee count: ${data.employeeCount}`);
        }

        // Enhanced efficiency calculation with better error handling
        const employeeRows = document.querySelectorAll('.employees .employee, .employee-row, [class*="employee"]');
        if (employeeRows.length > 0) {
            let totalEfficiency = 0;
            let validCount = 0;

            employeeRows.forEach(row => {
                const efficiencySelectors = [
                    '.efficiency',
                    '.eff',
                    '[class*="efficiency"]',
                    '.employee-efficiency'
                ];

                for (const selector of efficiencySelectors) {
                    const element = row.querySelector(selector);
                    if (element) {
                        const effText = element.textContent || '';
                        const efficiency = parseFloat(effText.match(/\d+\.?\d*/)?.[0] || 100);
                        if (efficiency > 0 && efficiency <= 200) { // Sanity check
                            totalEfficiency += efficiency;
                            validCount++;
                            break;
                        }
                    }
                }
            });

            if (validCount > 0) {
                data.avgEfficiency = totalEfficiency / validCount;
                logAction(`Calculated efficiency from ${validCount} employees: ${data.avgEfficiency.toFixed(1)}%`);
            } else {
                data.avgEfficiency = GM_getValue('avgEfficiency', 100);
                logAction(`Using stored efficiency: ${data.avgEfficiency.toFixed(1)}%`);
            }
        } else {
            data.avgEfficiency = GM_getValue('avgEfficiency', 100);
            logAction(`No employee data found, using stored efficiency: ${data.avgEfficiency.toFixed(1)}%`);
        }

        console.log('Company data collected:', data);
        return data;
    }

    // Enhanced price parsing with better error handling
    function parsePrice(value) {
        if (!value) return null;

        // Remove all non-numeric characters except decimal points
        const cleaned = value.toString().replace(/[^\d.]/g, '');
        const parsed = parseFloat(cleaned);

        return (isNaN(parsed) || parsed < 0) ? null : parsed;
    }

    // Enhanced price calculation with incremental suggestions
    function calculateOptimalPrice(contractType, data) {
        const contract = CONTRACT_DATA[contractType];
        const basePrice = contract.basePrice;

        // Get stored current price for incremental calculation
        const currentPrice = GM_getValue(`current_${contractType}_price`, null);

        // Very conservative modifiers since we're targeting specific achievable prices
        const efficiencyModifier = Math.tanh((data.avgEfficiency - 100) / 200) * 0.1;  // Max 10% impact
        const employeeModifier = Math.min((data.employeeCount - 10) * 0.01, 0.05);     // Max 5% impact
        const advertisingModifier = Math.min(Math.log10(data.advertising / 1000000) * 0.02, 0.05); // Max 5% impact

        // Calculate target price with minimal adjustments
        let targetPrice = basePrice * (1 + efficiencyModifier + employeeModifier + advertisingModifier);

        // Apply BUS2700 pricing boost
        if (GM_getValue('hasBUS2700', false)) {
            targetPrice *= 1.05; // Conservative 5% boost
        }

        // Round to nearest thousand
        targetPrice = Math.round(targetPrice / 1000) * 1000;

        // Calculate incremental increase
        const incrementalPrice = calculateIncrementalIncrease(contractType, currentPrice);

        // Use the lower of target or incremental to be safe
        const finalPrice = Math.min(targetPrice, incrementalPrice);

        // Log the calculation details
        logAction(`${contract.name}: current=${currentPrice ? formatCurrency(currentPrice) : 'unknown'}, target=${formatCurrency(targetPrice)}, incremental=${formatCurrency(incrementalPrice)}, suggested=${formatCurrency(finalPrice)}`);

        return finalPrice;
    }

    // Create or get the optimizer panel
    function createOptimizerPanel() {
        let panel = document.getElementById('price-optimizer');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'price-optimizer';
            document.body.appendChild(panel);
        }
        return panel;
    }

    // Create enhanced advertising input with OK button
    function createAdInput(currentAd) {
        const container = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = 'Advertising Budget';

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.gap = '5px';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.step = 100000;
        input.value = currentAd;
        input.placeholder = 'Enter budget...';
        input.style.width = '100px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.className = 'toggle-button';
        okButton.style.margin = '0';
        okButton.style.padding = '3px 8px';
        okButton.style.fontSize = '10px';
        okButton.style.background = '#27ae60';

        const updateBudget = () => {
            const value = parseFloat(input.value) || 1000000;
            GM_setValue('advertising', value);
            updateOptimizer();
            logAction(`Updated advertising budget to ${formatCurrency(value)}`);
        };

        okButton.addEventListener('click', updateBudget);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') updateBudget();
        });

        inputContainer.appendChild(input);
        inputContainer.appendChild(okButton);
        container.appendChild(label);
        container.appendChild(inputContainer);
        return container;
    }

    // Create current price inputs dropdown
    function createCurrentPriceInputsDropdown() {
        const container = document.createElement('div');
        container.className = 'price-inputs-dropdown';

        const toggleButton = document.createElement('button');
        toggleButton.className = 'dropdown-toggle';
        toggleButton.textContent = 'Set Current Prices';

        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';

        const title = document.createElement('strong');
        title.textContent = 'Current Prices (for incremental increases):';
        title.style.display = 'block';
        title.style.marginBottom = '5px';
        title.style.fontSize = '11px';

        dropdownContent.appendChild(title);

        Object.keys(CONTRACT_DATA).forEach(contractType => {
            const contract = CONTRACT_DATA[contractType];
            const rowContainer = document.createElement('div');
            rowContainer.style.display = 'flex';
            rowContainer.style.alignItems = 'center';
            rowContainer.style.gap = '5px';
            rowContainer.style.marginBottom = '3px';

            const label = document.createElement('label');
            label.textContent = `${contract.name}:`;
            label.style.width = '60px';
            label.style.fontSize = '10px';
            label.style.margin = '0';

            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.step = 1000;
            input.value = GM_getValue(`current_${contractType}_price`, '');
            input.placeholder = 'Current price';
            input.style.width = '80px';
            input.style.fontSize = '10px';
            input.style.padding = '2px';

            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.className = 'toggle-button';
            okButton.style.margin = '0';
            okButton.style.padding = '2px 6px';
            okButton.style.fontSize = '9px';
            okButton.style.background = '#27ae60';

            okButton.addEventListener('click', () => {
                const value = parseFloat(input.value) || null;
                GM_setValue(`current_${contractType}_price`, value);
                logAction(`Updated current ${contract.name} price to ${value ? formatCurrency(value) : 'none'}`);
                updateOptimizer();
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    okButton.click();
                }
            });

            rowContainer.appendChild(label);
            rowContainer.appendChild(input);
            rowContainer.appendChild(okButton);
            dropdownContent.appendChild(rowContainer);
        });

        toggleButton.addEventListener('click', () => {
            dropdownContent.classList.toggle('show');
        });

        container.appendChild(toggleButton);
        container.appendChild(dropdownContent);
        return container;
    }

    function createBUS2700Checkbox() {
        const container = document.createElement('div');
        container.className = 'bus2700-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'bus2700-toggle';
        checkbox.checked = GM_getValue('hasBUS2700', false);

        const label = document.createElement('label');
        label.htmlFor = 'bus2700-toggle';
        label.textContent = 'BUS2700 Education (+12%)';
        label.style.display = 'inline';
        label.style.marginLeft = '5px';

        checkbox.addEventListener('change', () => {
            GM_setValue('hasBUS2700', checkbox.checked);
            logAction(`BUS2700 education ${checkbox.checked ? 'enabled' : 'disabled'}`);
            updateOptimizer();
        });

        container.appendChild(checkbox);
        container.appendChild(label);
        return container;
    }

    // Create minimize/maximize buttons
    function createToggleButtons() {
        const container = document.createElement('div');

        const minimizeButton = document.createElement('button');
        minimizeButton.className = 'toggle-button';
        minimizeButton.textContent = 'Minimize';

        const maximizeButton = document.createElement('button');
        maximizeButton.className = 'maximize-button';
        maximizeButton.textContent = 'Maximize';

        minimizeButton.addEventListener('click', () => {
            const panel = document.getElementById('price-optimizer');
            panel.classList.add('minimized');
        });

        maximizeButton.addEventListener('click', () => {
            const panel = document.getElementById('price-optimizer');
            panel.classList.remove('minimized');
        });

        container.appendChild(minimizeButton);
        container.appendChild(maximizeButton);
        return container;
    }

    // Format large numbers with proper currency formatting
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Enhanced optimizer panel update
    function updateOptimizer() {
        try {
            const data = getCompanyData();
            const panel = createOptimizerPanel();

            // Calculate optimal prices
            const optimalPrices = {};
            Object.keys(CONTRACT_DATA).forEach(contractType => {
                optimalPrices[contractType] = calculateOptimalPrice(contractType, data);
            });

            // Build the panel HTML
            panel.innerHTML = `
                <h3>PSF Price Optimizer</h3>
                <div class="company-stats">
                    <strong>Company Stats:</strong><br>
                    Employees: ${data.employeeCount}<br>
                    Avg Efficiency: ${data.avgEfficiency.toFixed(1)}%<br>
                    Ad Budget: ${formatCurrency(data.advertising)}
                </div>

                <div class="price-suggestions">
                    <strong>Suggested Prices:</strong><br>
                    ${Object.entries(optimalPrices).map(([type, price]) => {
                        const currentPrice = GM_getValue(`current_${type}_price`, null);
                        const dailyIncrease = CONTRACT_DATA[type].dailyIncrement;
                        const isIncremental = currentPrice && price > currentPrice;
                        const increaseAmount = isIncremental ? price - currentPrice : 0;

                        return `
                            <div class="price-row">
                                <span class="price-label">${CONTRACT_DATA[type].name}:</span>
                                <span class="price-value">${formatCurrency(price)}</span>
                                ${isIncremental ? `<span style="color: #f39c12; font-size: 9px;"> (+${formatCurrency(increaseAmount)})</span>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <div style="margin-top: 8px; font-size: 10px; color: #bdc3c7;">
                    <strong>Daily Safe Increases:</strong><br>
                    Military: +${formatCurrency(CONTRACT_DATA.military.dailyIncrement)} |
                    Protection: +${formatCurrency(CONTRACT_DATA.protection.dailyIncrement)}<br>
                    Training: +${formatCurrency(CONTRACT_DATA.training.dailyIncrement)} |
                    Engagement: +${formatCurrency(CONTRACT_DATA.engagement.dailyIncrement)}
                </div>

                <div style="margin-top: 10px;">
                    <em>Gradual increases prevent contract failures. Enter current prices below for incremental suggestions.</em>
                </div>
            `;

            // Add interactive elements
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const toggleButtons = createToggleButtons();
            const refreshButton = createRefreshButton();
            const logToggleButton = createLogToggleButton();

            buttonContainer.appendChild(toggleButtons);
            buttonContainer.appendChild(refreshButton);
            buttonContainer.appendChild(logToggleButton);

            panel.appendChild(createAdInput(data.advertising));
            panel.appendChild(createBUS2700Checkbox());
            panel.appendChild(createCurrentPriceInputsDropdown());
            panel.appendChild(buttonContainer);
            panel.appendChild(createLogDisplay());

            // Store updated data
            GM_setValue('avgEfficiency', data.avgEfficiency);
            GM_setValue('employeeCount', data.employeeCount);
            GM_setValue('lastUpdate', data.lastUpdated);

            logAction(`Prices updated - Military: ${formatCurrency(optimalPrices.military)}, Protection: ${formatCurrency(optimalPrices.protection)}, Training: ${formatCurrency(optimalPrices.training)}, Engagement: ${formatCurrency(optimalPrices.engagement)}`);
            console.log('Optimizer updated with prices:', optimalPrices);
        } catch (error) {
            console.error('Error in updateOptimizer:', error);
            logAction(`Error updating optimizer: ${error.message}`);

            // Display error message to user
            const panel = createOptimizerPanel();
            panel.innerHTML = `
                <h3>PSF Price Optimizer</h3>
                <div style="color: #e74c3c;">
                    Error loading company data. Please refresh the page.
                </div>
            `;
        }
    }

    // Initialize and run the optimizer with better timing
    function startOptimizer() {
        logAction('PSF Price Optimizer started');

        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    logAction('Page loaded, initializing optimizer');
                    updateOptimizer();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                logAction('Optimizer initializing on ready page');
                updateOptimizer();
            }, 1000);
        }

        // Set up periodic updates (every 5 minutes)
        setInterval(() => {
            logAction('Automatic refresh triggered');
            updateOptimizer();
        }, 300000);

        // Update when page visibility changes (user returns to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    logAction('Page became visible, refreshing data');
                    updateOptimizer();
                }, 500);
            }
        });
    }

    // Start the enhanced optimizer
    startOptimizer();
})();