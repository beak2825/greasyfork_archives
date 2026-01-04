// ==UserScript==
// @name         Torn Bank Investment Calculator with Enhanced Features
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Calculates Torn bank investment profit with merits, TCB stock, and displays the shortest path to target amount with profit and time.
// @author       Jvmie
// @match        https://www.torn.com/bank.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529953/Torn%20Bank%20Investment%20Calculator%20with%20Enhanced%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/529953/Torn%20Bank%20Investment%20Calculator%20with%20Enhanced%20Features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CURRENT_VERSION = '3.6'; // Must match @version
    const SCRIPT_URL = 'https://raw.githubusercontent.com/ItzJamiie/torn-bank-calc/main/torn-bank-calc.user.js';

    // Function to check for updates (for compatibility with TornPDA)
    function checkForScriptUpdate() {
        fetch(SCRIPT_URL)
            .then(response => response.text())
            .then(text => {
                const versionMatch = text.match(/@version\s+([\d.]+)/);
                if (versionMatch && versionMatch[1] && versionMatch[1] !== CURRENT_VERSION) {
                    console.log(`Torn Bank Calc: New version ${versionMatch[1]} detected. Notify TornPDA to update.`);
                    // TornPDA may handle the update prompt; this log helps debugging
                }
            })
            .catch(err => console.error('Torn Bank Calc: Update check failed:', err));
    }

    setInterval(checkForScriptUpdate, 300000); // Check every 5 minutes

    let investmentOptions = [
        { period: 7, baseRate: 0.6889, label: '7 Days (0.69% base)' },
        { period: 14, baseRate: 0.800, label: '14 Days (0.80% base)' },
        { period: 30, baseRate: 0.833, label: '30 Days (0.83% base)' },
        { period: 60, baseRate: 0.953, label: '60 Days (0.95% base)' },
        { period: 90, baseRate: 0.953, label: '90 Days (0.95% base)' }
    ];

    const MAX_INVESTMENT = 2000000000;
    const VERSION = '3.6';

    const CHANGELOG = `
        <strong>Changelog:</strong>
        <ul>
            <li><strong>Version 3.6:</strong> Moved UI to the top of the webpage.</li>
            <li><strong>Version 3.5:</strong> Optimized for TornPDA update system.</li>
        </ul>
    `;

    function formatCurrency(value) {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}b`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    function parseInput(value) {
        value = value.trim().toLowerCase().replace(/[^0-9.kmb]/g, '');
        if (value.endsWith('k')) return parseFloat(value.replace('k', '')) * 1000;
        if (value.endsWith('m')) return parseFloat(value.replace('m', '')) * 1000000;
        if (value.endsWith('b')) return parseFloat(value.replace('b', '')) * 1000000000;
        return parseFloat(value) || 0;
    }

    function formatDays(days) {
        if (days === Infinity) return 'N/A (Cap Reached)';
        if (days === 0) return '0d';
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const daysRemain = days % 30;
        let result = '';
        if (years > 0) result += `${years}y `;
        if (months > 0 || years > 0) result += `${months}m `;
        result += `${daysRemain}d`;
        return result.trim();
    }

    function fetchDynamicBaseRates(merits) {
        try {
            const rateElements = document.querySelectorAll('.bar-label, .apr-value, [class*="apr"]');
            if (!rateElements.length) {
                console.warn('Torn Bank Calc: Using default rates.');
                return;
            }
            const aprValues = Array.from(rateElements).map(el => {
                const match = el.textContent.trim().match(/(\d+\.\d+)%/);
                return match ? parseFloat(match[1]) : null;
            }).filter(v => v !== null);
            if (aprValues.length >= 5) {
                const meritMultiplier = 1 + (merits * 0.05);
                const baseRates = aprValues.map(apr => (apr / 52 / meritMultiplier) * 100);
                investmentOptions.forEach((opt, i) => opt.baseRate = baseRates[i] || opt.baseRate);
                investmentOptions.forEach(opt => opt.label = `${opt.period} Days (${opt.baseRate.toFixed(2)}% base)`);
                console.log('Torn Bank Calc: Updated rates:', investmentOptions);
            } else {
                console.warn('Torn Bank Calc: Insufficient APR data.');
            }
        } catch (e) {
            console.error('Torn Bank Calc: Rate fetch error:', e);
        }
    }

    function showChangelogNotification() {
        const lastSeen = localStorage.getItem('tornBankCalcLastSeenVersion');
        if (lastSeen === VERSION) return;
        const div = document.createElement('div');
        div.id = 'torn-bank-calc-changelog';
        div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1c2526;border:1px solid #3e4a50;border-radius:5px;padding:10px;max-width:300px;color:#fff;font-family:Arial,sans-serif;font-size:14px;z-index:10000;box-shadow:0 2px 5px rgba(0,0,0,0.5)';
        div.innerHTML = `<div style="margin-bottom:10px;">${CHANGELOG}</div><button id="closeChangelogBtn" style="display:block;margin:0 auto;padding:5px 10px;background:#28a745;color:#fff;border:none;border-radius:3px;cursor:pointer">Close</button>`;
        document.body.appendChild(div);
        document.getElementById('closeChangelogBtn').addEventListener('click', () => {
            div.remove();
            localStorage.setItem('tornBankCalcLastSeenVersion', VERSION);
        });
    }

    function createCalculatorUI() {
        console.log('Torn Bank Calc: Attempting to create UI...');

        // Prioritize document.body to ensure top placement, with fallback containers
        let targetContainer = document.body; // Start with body for absolute top placement
        const fallbackContainers = [
            document.querySelector('#mainContainer .content-wrapper'),
            document.querySelector('.content-wrapper'),
            document.querySelector('#bankBlock'),
            document.querySelector('.content')
        ];
        // Use the first valid fallback if body insertion fails
        if (!targetContainer || targetContainer.children.length === 0) {
            for (let container of fallbackContainers) {
                if (container) {
                    targetContainer = container;
                    break;
                }
            }
        }

        if (!targetContainer) {
            console.error('Torn Bank Calc: Could not find target container. Aborting UI creation.');
            return;
        }

        if (document.getElementById('torn-bank-calc')) {
            console.log('Torn Bank Calc: UI already exists, skipping creation.');
            return;
        }

        const calcDiv = document.createElement('div');
        calcDiv.id = 'torn-bank-calc';
        calcDiv.style.marginTop = '20px';
        calcDiv.style.fontFamily = 'Arial, sans-serif';
        calcDiv.style.fontSize = '14px';
        calcDiv.style.maxWidth = '400px';
        calcDiv.style.overflowX = 'hidden';

        // Load saved preferences
        const savedMerits = localStorage.getItem('tornBankCalcMerits') || '0';
        const savedStockBonus = localStorage.getItem('tornBankCalcStockBonus') === 'true';

        const meritOptionsHTML = Array.from({ length: 11 }, (_, i) => 
            `<option value="${i}" ${i === parseInt(savedMerits) ? 'selected' : ''}>${i} Merits (+${i * 5}%)</option>`
        ).join('');

        calcDiv.innerHTML = `
            <details id="calcDetails" style="margin-bottom: 10px; border: 1px solid #2a3439; border-radius: 5px;">
                <summary style="cursor: pointer; padding: 10px; background: #28a745; border-radius: 3px; color: #fff; text-align: center; font-weight: bold;">Investment Calculator</summary>
                <div style="padding: 15px; background: #1c2526; border-radius: 0 0 3px 3px;">
                    <label style="display: block; margin-bottom: 5px; color: #d0d0d0;">Principal ($):</label>
                    <input type="text" id="principal" placeholder="Enter amount (e.g., 2000m)" style="width: 100%; padding: 5px; background: #2a3439; color: #fff; border: 1px solid #3e4a50; border-radius: 3px; margin-bottom: 10px;">
                    
                    <label style="display: block; margin-bottom: 5px; color: #d0d0d0;">Target Amount ($):</label>
                    <input type="text" id="targetAmount" placeholder="Enter target (e.g., 3000m)" style="width: 100%; padding: 5px; background: #2a3439; color: #fff; border: 1px solid #3e4a50; border-radius: 3px; margin-bottom: 10px;">
                    
                    <label style="display: block; margin-bottom: 5px; color: #d0d0d0;">Bank Merits:</label>
                    <select id="meritSelect" style="width: 100%; padding: 5px; background: #2a3439; color: #fff; border: 1px solid #3e4a50; border-radius: 3px; margin-bottom: 10px;">
                        ${meritOptionsHTML}
                    </select>
                    
                    <label style="display: block; margin-bottom: 10px; color: #d0d0d0;">
                        <input type="checkbox" id="stockBonus" style="vertical-align: middle; margin-right: 5px;" ${savedStockBonus ? 'checked' : ''}> Own TCB Stock (+10%)
                    </label>
                    
                    <button id="calculateBtn" style="width: 100%; padding: 8px; background: #28a745; color: #fff; border: none; border-radius: 3px; cursor: pointer;">Calculate</button>

                    <div id="result" style="margin-top: 15px;">
                        <label style="display: block; margin-top: 10px; color: #fff;">Shortest Path to Target:</label>
                        <table id="comparisonTable" style="width: 100%; max-width: 400px; border-collapse: collapse; margin-top: 10px; table-layout: fixed;">
                            <thead>
                                <tr style="background: #2a3439;">
                                    <th style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; width: 25%;">Period</th>
                                    <th style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; width: 25%;">Method</th>
                                    <th style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; width: 25%;">Time to Target</th>
                                    <th style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; width: 25%;">Profit</th>
                                </tr>
                            </thead>
                            <tbody id="comparisonTableBody">
                                <tr><td colspan="4" style="text-align: center; padding: 5px; color: #ffffff;">Enter values and calculate to compare</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </details>
        `;

        // Insert the calculator at the top of the target container (prioritizing body)
        targetContainer.prepend(calcDiv);

        // Add version number to bottom left corner
        const versionDiv = document.createElement('div');
        versionDiv.id = 'torn-bank-calc-version';
        versionDiv.style.position = 'fixed';
        versionDiv.style.bottom = '10px';
        versionDiv.style.left = '10px';
        versionDiv.style.color = '#ffffff';
        versionDiv.style.fontSize = '12px';
        versionDiv.style.fontFamily = 'Arial, sans-serif';
        versionDiv.style.zIndex = '1000';
        versionDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        versionDiv.style.padding = '2px 5px';
        versionDiv.style.borderRadius = '3px';
        versionDiv.innerHTML = `Torn Bank Calc V${VERSION}`;
        document.body.appendChild(versionDiv);

        console.log('Torn Bank Calc: Calculator UI added to the top of the page.');

        // Show changelog notification if version is new
        showChangelogNotification();

        // Collapse by default
        const details = document.getElementById('calcDetails');
        if (details) {
            details.open = false;
        }

        // Save preferences when changed
        const meritSelect = document.getElementById('meritSelect');
        const stockBonus = document.getElementById('stockBonus');
        if (meritSelect) {
            meritSelect.addEventListener('change', () => {
                localStorage.setItem('tornBankCalcMerits', meritSelect.value);
                fetchDynamicBaseRates(parseInt(meritSelect.value));
            });
        }
        if (stockBonus) {
            stockBonus.addEventListener('change', () => {
                localStorage.setItem('tornBankCalcStockBonus', stockBonus.checked);
            });
        }

        // Initial fetch with saved merits
        fetchDynamicBaseRates(parseInt(savedMerits));
    }

    function calculateTimeToTargetNoReinvest(principal, target, rate, period) {
        if (principal >= target) return { periods: 0, days: 0, profit: 0 };
        const ratePerPeriod = rate / 100;
        const profitPerPeriod = principal * ratePerPeriod;
        const periodsNeeded = Math.ceil((target - principal) / profitPerPeriod);
        return { periods: periodsNeeded, days: periodsNeeded * period, profit: periodsNeeded * profitPerPeriod };
    }

    function calculateTimeToTargetWithReinvest(principal, target, rate, period) {
        if (principal >= target) return { periods: 0, days: 0, profit: 0 };
        const ratePerPeriod = rate / 100;
        let amount = principal, periods = 0;
        while (amount < target) {
            let invest = Math.min(amount, MAX_INVESTMENT);
            amount += invest * ratePerPeriod;
            periods++;
            if (periods > 10000) return { periods: Infinity, days: Infinity, profit: 0 };
        }
        return { periods, days: periods * period, profit: amount - principal };
    }

    function calculateProfitAndProjection() {
        try {
            const principalInput = document.getElementById('principal').value.trim();
            let principal = parseInput(principalInput);
            if (principal < 1000) {
                throw new Error('Principal too low. Enter a valid amount (e.g., 2000m).');
            }

            const targetInput = document.getElementById('targetAmount').value.trim();
            let target = parseInput(targetInput);
            if (target <= principal) {
                throw new Error('Target amount must be greater than principal.');
            }

            const meritSelect = document.getElementById('meritSelect');
            const merits = meritSelect ? parseInt(meritSelect.value) : 0;
            const stockBonus = document.getElementById('stockBonus');
            const hasStockBonus = stockBonus ? stockBonus.checked : false;

            // Update base rates based on current merits
            fetchDynamicBaseRates(merits);

            // Update comparison table with shortest path
            const comparisonTableBody = document.getElementById('comparisonTableBody');
            if (comparisonTableBody) {
                updateComparisonTable(principal, target, merits, hasStockBonus);
            } else {
                throw new Error('Comparison table body not found.');
            }

            console.log('Torn Bank Calc: Principal:', principal, 'Target:', target, 'Merits:', merits, 'Stock Bonus:', hasStockBonus);
        } catch (e) {
            console.error('Torn Bank Calc Error:', e);
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
                resultDiv.innerHTML = `Error: ${e.message || 'Check inputs'}`;
            }
        }
    }

    function updateComparisonTable(principal, target, merits, hasStockBonus) {
        const tableBody = document.getElementById('comparisonTableBody');
        if (!tableBody) {
            console.error('Comparison table body not found.');
            return;
        }

        let shortestPath = null;
        let shortestDays = Infinity;

        // Evaluate each period for both reinvest and no-reinvest options
        investmentOptions.forEach(opt => {
            const meritMultiplier = 1 + (merits * 0.05);
            let effectiveRate = opt.baseRate * meritMultiplier;
            if (hasStockBonus) {
                effectiveRate *= 1.10;
            }
            const weeks = opt.period / 7;
            const ratePerPeriod = effectiveRate * weeks;

            // Calculate time to target without reinvestment
            const noReinvest = calculateTimeToTargetNoReinvest(principal, target, ratePerPeriod, opt.period);
            if (noReinvest.days < shortestDays) {
                shortestDays = noReinvest.days;
                shortestPath = {
                    period: opt.label,
                    method: 'No Reinvest',
                    days: noReinvest.days,
                    profit: noReinvest.profit
                };
            }

            // Calculate time to target with reinvestment
            const reinvest = calculateTimeToTargetWithReinvest(principal, target, ratePerPeriod, opt.period);
            if (reinvest.days < shortestDays) {
                shortestDays = reinvest.days;
                shortestPath = {
                    period: opt.label,
                    method: 'Reinvest',
                    days: reinvest.days,
                    profit: reinvest.profit
                };
            }
        });

        // Display the shortest path
        let row = '';
        if (shortestPath) {
            row = `
                <tr>
                    <td style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; text-align: center; width: 25%;">${shortestPath.period}</td>
                    <td style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; text-align: center; width: 25%;">${shortestPath.method}</td>
                    <td style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; text-align: center; width: 25%;">${formatDays(shortestPath.days)}</td>
                    <td style="padding: 5px; border: 1px solid #3e4a50; color: #ffffff; text-align: center; width: 25%;">${shortestPath.days === Infinity ? 'N/A' : formatCurrency(shortestPath.profit)}</td>
                </tr>
            `;
        } else {
            row = `<tr><td colspan="4" style="text-align: center; padding: 5px; color: #ffffff;">No valid path found</td></tr>`;
        }

        tableBody.innerHTML = row;
    }

    function init() {
        console.log('Torn Bank Calc: Initializing script...');
        createCalculatorUI();
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateProfitAndProjection);
            console.log('Torn Bank Calc: Calculate button event listener added.');
        } else {
            console.error('Torn Bank Calc: Calculate button not found after UI creation.');
        }
    }

    function waitForPageLoad() {
        console.log('Torn Bank Calc: Waiting for page load...');
        if (document.readyState === 'complete') {
            console.log('Torn Bank Calc: Page already loaded, initializing...');
            init();
        } else {
            window.addEventListener('load', () => {
                console.log('Torn Bank Calc: Page load event triggered, initializing...');
                init();
            });
            let attempts = 0;
            const maxAttempts = 10;
            const interval = setInterval(() => {
                attempts++;
                console.log(`Torn Bank Calc: Attempt ${attempts} to initialize...`);
                if (document.readyState === 'complete') {
                    clearInterval(interval);
                    init();
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.error('Torn Bank Calc: Max attempts reached, forcing initialization...');
                    init();
                }
            }, 1000);
        }
    }

    waitForPageLoad();
})();