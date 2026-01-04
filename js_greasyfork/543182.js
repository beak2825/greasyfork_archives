// ==UserScript==
// @name         Torn Chain Payout Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculates payouts, generates reports, and manages API keys in compliance with Torn's ToS. Supports auto-config for Torn PDA.
// @match        https://www.torn.com/war.php?step=chainreport&chainID=*
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543182/Torn%20Chain%20Payout%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/543182/Torn%20Chain%20Payout%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- PROMISE-BASED GM STORAGE HELPERS ---
    const GM_get = (key, defaultValue) => new Promise(resolve => resolve(GM_getValue(key, defaultValue)));
    const GM_set = (key, value) => new Promise(resolve => resolve(GM_setValue(key, value)));
    const GM_del = (key) => new Promise(resolve => resolve(GM_deleteValue(key)));
    const API_KEY_STORAGE_KEY = 'chain_payout_api_key';

    // --- PDA DETECTION ---
    const isPDA = typeof window.flutter_inappwebview !== 'undefined' &&
                  typeof window.flutter_inappwebview.callHandler === 'function';

    // --- PAGE ROUTER ---
    if (window.location.href.includes('war.php?step=chainreport&chainID=')) {
        setupChainReportPage();
    } else if (window.location.href.includes('factions.php')) {
        setupFactionPage();
    }

    // =================================================================================
    // --- FACTION PAGE LOGIC ---
    // =================================================================================
    function setupFactionPage() {
        async function markPaidChains() {
            const newsList = document.querySelector('ul.listWrapper___lJjf7');
            if (!newsList) return;

            const chainLinks = newsList.querySelectorAll('p.message___RSW3S a[href*="chainID="]');
            for (const link of chainLinks) {
                try {
                    const chainID = new URL(link.href, window.location.origin).searchParams.get('chainID');
                    if (!chainID) continue;

                    const storageKey = `payout_status_${chainID}`;
                    const isPaid = await GM_get(storageKey, false);
                    const messageElement = link.parentElement;

                    if (messageElement) {
                        const existingIndicator = messageElement.querySelector('.paid-status-indicator');
                        if (isPaid && !existingIndicator) {
                            const paidSpan = document.createElement('span');
                            paidSpan.textContent = ' [PAID]';
                            paidSpan.style.color = '#4CAF50';
                            paidSpan.style.fontWeight = 'bold';
                            paidSpan.className = 'paid-status-indicator';
                            messageElement.appendChild(paidSpan);
                        } else if (!isPaid && existingIndicator) {
                            existingIndicator.remove();
                        }
                    }
                } catch (e) {
                    console.error("Torn Payout Script: Error processing chain link.", e);
                }
            }
        }

        function waitForElement(selector) {
            return new Promise(resolve => {
                if (document.querySelector(selector)) return resolve(document.querySelector(selector));
                const observer = new MutationObserver(() => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }

        waitForElement('#factions').then(factionsContainer => {
            const observer = new MutationObserver(() => {
                clearTimeout(window.factionNewsCheckTimeout);
                window.factionNewsCheckTimeout = setTimeout(markPaidChains, 250);
            });
            observer.observe(factionsContainer, { childList: true, subtree: true });
            markPaidChains();
        });
    }

    // =================================================================================
    // --- CHAIN REPORT PAGE LOGIC (UPDATED FOR API COMPLIANCE & PDA SUPPORT) ---
    // =================================================================================
    function setupChainReportPage() {
        const XANAX_COST = 840000;
        const ATTACKS_PER_XANAX = 10;
        const urlParams = new URLSearchParams(window.location.search);
        const chainID = urlParams.get('chainID');
        if (!chainID || isNaN(chainID)) return;

        const style = document.createElement('style');
        style.textContent = `
            /* Main Payout Container */
            #payout-container {
                background-color: #333; border-radius: 5px; padding: 15px; margin-top: 10px;
                border: 1px solid #222; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            #payout-container h2 {
                font-size: 1.1em; color: #ddd; font-weight: bold; padding-bottom: 10px;
                margin-bottom: 10px; border-bottom: 1px solid #444; margin-top: 0;
            }
            #payout-container > p { font-size: 0.9em; color: #bbb; margin: 0 0 15px 0; }
            #payout-container .payout-table-wrapper {
                overflow-x: auto; background-color: #2c2c2c; border: 1px solid #444;
                border-radius: 5px; margin-bottom: 15px;
            }
            #payout-container table { border-collapse: collapse; width: 100%; }
            #payout-container th {
                background-color: #4CAF50; color: white; padding: 10px; text-align: left;
                border-bottom: 2px solid #444; white-space: nowrap;
            }
            #payout-container td {
                padding: 8px; text-align: left; border-bottom: 1px solid #333; color: white;
                white-space: nowrap; cursor: pointer;
            }
            #payout-container td.cell-copied {
                background-color: #007bff !important; color: white !important;
                transition: background-color 0.1s ease-in-out;
            }
            #payout-container tr:nth-child(even) { background-color: #333; }
            #payout-container tr:hover { background-color: #3d3d3d; }
            #payout-container .total-row { font-weight: bold; background-color: #4CAF50; color: white; }
            #payout-container .total-row td { cursor: default; }
            #payout-container .button-group { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; }
            #payout-container .action-button {
                padding: 8px 16px; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9em;
            }
            #payout-container .close-button { background-color: #ff4444; }
            #payout-container .close-button:hover { background-color: #cc0000; }
            #payout-container .copy-button { background-color: #007bff; }
            #payout-container .copy-button:hover { background-color: #0056b3; }
            #payout-container .mark-paid-button { background-color: #ffc107; color: black; }
            #payout-container .mark-paid-button:hover { background-color: #d39e00; }
            #payout-container .mark-paid-button:disabled { background-color: #6c757d; cursor: not-allowed; }
            #payout-container .clickable-name { cursor: pointer; text-decoration: underline; color: #87ceeb; }
            #payout-container #paid-out-warning {
                color: #ffc107; font-weight: bold; font-size: 1em; text-align: center;
                padding: 10px; border: 1px solid #ffc107; border-radius: 5px; margin-bottom: 15px;
            }
            #payout-container #individual-report-container {
                margin-top: 10px; padding: 15px; border: 1px dashed #555; border-radius: 5px; background-color: #252525;
            }
            #payout-container #individual-report-container h4 { margin-top: 0; font-size: 1em; }

            /* API Key Management UI */
            #api-key-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.7); z-index: 9998;
                display: flex; align-items: center; justify-content: center;
            }
            #api-key-container {
                background-color: #333; border-radius: 5px; padding: 20px;
                border: 1px solid #222; box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                width: 90%; max-width: 650px; color: white;
            }
            #api-key-container h3 { margin-top: 0; color: #4CAF50; border-bottom: 1px solid #444; padding-bottom: 10px; }
            #api-key-container p { font-size: 0.9em; color: #ccc; }
            #api-key-container .tos-table { width: 100%; border-collapse: collapse; font-size: 0.8em; margin: 15px 0; }
            #api-key-container .tos-table th, #api-key-container .tos-table td { border: 1px solid #555; padding: 6px; text-align: left; }
            #api-key-container .tos-table th { background-color: #444; }
            #api-key-container .tos-table code { background: #222; padding: 2px 4px; border-radius: 3px; }
            #api-key-container input[type="password"] {
                width: 100%; padding: 8px; border-radius: 3px; border: 1px solid #555;
                background-color: #222; color: white; margin-bottom: 15px; box-sizing: border-box;
            }
            #api-key-container .api-button-group { display: flex; gap: 10px; justify-content: flex-end; }
            #api-key-container .api-button { padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; }
            #api-key-container .save-key { background-color: #4CAF50; color: white; }
            #api-key-container .clear-key { background-color: #f44336; color: white; }
            #api-key-container .cancel-key { background-color: #6c757d; color: white; }

            /* General UI Elements */
            .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #4CAF50; border-radius: 50%;
                width: 24px; height: 24px; animation: spin 1s linear infinite;
                position: fixed; bottom: 50px; left: 160px; z-index: 1001;
            }
            .fixed-button {
                position: fixed; bottom: 50px; z-index: 1000;
                color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);

        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Calculate Payout';
        calculateButton.className = 'fixed-button';
        calculateButton.style.left = '10px';
        calculateButton.style.backgroundColor = '#4CAF50';
        document.body.appendChild(calculateButton);

        const manageApiButton = document.createElement('button');
        manageApiButton.textContent = 'Manage API Key';
        manageApiButton.className = 'fixed-button';
        manageApiButton.style.left = '180px';
        manageApiButton.style.backgroundColor = '#007bff';
        document.body.appendChild(manageApiButton);

        const gmFetch = (url) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ method: 'GET', url: url, headers: { 'accept': 'application/json' }, onload: resolve, onerror: reject });
        });

        async function createApiManagementUI() {
            const existingUI = document.getElementById('api-key-overlay');
            if (existingUI) existingUI.remove();

            const overlay = document.createElement('div');
            overlay.id = 'api-key-overlay';

            const currentKey = await GM_get(API_KEY_STORAGE_KEY, '');

            overlay.innerHTML = `
                <div id="api-key-container">
                    <h3>API Key Management</h3>
                    <p>To calculate payouts, this script requires a Torn API key with 'Limited Access'. Your key is stored securely and locally in your browser and is never shared.</p>
                    <table class="tos-table">
                        <thead><tr><th>Data Storage</th><th>Data Sharing</th><th>Purpose of Use</th><th>Key Storage & Sharing</th><th>Key Access Level</th></tr></thead>
                        <tbody><tr>
                            <td>Only locally</td>
                            <td>Nobody</td>
                            <td>Non-malicious statistical analysis</td>
                            <td>Stored locally / Not shared</td>
                            <td>Limited Access: <code>faction (chainreport, balance)</code></td>
                        </tr></tbody>
                    </table>
                    <input type="password" id="api-key-input" placeholder="Enter your Limited Access API Key" value="${currentKey}">
                    <div class="api-button-group">
                        <button class="api-button cancel-key">Cancel</button>
                        <button class="api-button clear-key">Clear Key</button>
                        <button class="api-button save-key">Save Key</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            const apiKeyInput = overlay.querySelector('#api-key-input');
            if (isPDA && currentKey === '###PDA-APIKEY###') {
                apiKeyInput.disabled = true;
                const pdaNote = document.createElement('p');
                pdaNote.style.color = '#87ceeb';
                pdaNote.textContent = 'Using Torn PDA managed API key. To change, edit in Torn PDA settings.';
                apiKeyInput.insertAdjacentElement('afterend', pdaNote);
            }

            const closeUI = () => document.getElementById('api-key-overlay')?.remove();

            overlay.querySelector('.save-key').addEventListener('click', async () => {
                const newKey = overlay.querySelector('#api-key-input').value.trim();
                if (newKey) {
                    await GM_set(API_KEY_STORAGE_KEY, newKey);
                    alert('API Key saved!');
                    closeUI();
                } else {
                    alert('API Key cannot be empty. Use the "Clear Key" button to remove it.');
                }
            });

            overlay.querySelector('.clear-key').addEventListener('click', async () => {
                if (confirm('Are you sure you want to clear your stored API key?')) {
                    await GM_del(API_KEY_STORAGE_KEY);
                    alert('API Key cleared.');
                    closeUI();
                }
            });

            overlay.querySelector('.cancel-key').addEventListener('click', closeUI);
        }

        manageApiButton.addEventListener('click', createApiManagementUI);

        calculateButton.addEventListener('click', async () => {
            let apiKey = await GM_get(API_KEY_STORAGE_KEY, '');

            if (!apiKey) {
                if (isPDA) {
                    await GM_set(API_KEY_STORAGE_KEY, '###PDA-APIKEY###');
                    apiKey = '###PDA-APIKEY###';
                    alert('Torn PDA detected. API key has been automatically configured.');
                } else {
                    alert('No API key found. Please set your key first.');
                    await createApiManagementUI();
                    return;
                }
            }

            const bcrInput = prompt('Enter the Base Chain Reward (BCR) for performance payout (excluding Xanax costs):', '1000000');
            const BCR = parseFloat(bcrInput);
            if (isNaN(BCR) || BCR < 0) { alert('Invalid BCR value.'); return; }

            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            document.body.appendChild(spinner);

            try {
                const [chainResponse, balanceResponse] = await Promise.all([
                    gmFetch(`https://api.torn.com/v2/faction/${chainID}/chainreport?selections=&key=${apiKey}`),
                    gmFetch(`https://api.torn.com/v2/faction/balance?key=${apiKey}`)
                ]);

                const chainData = JSON.parse(chainResponse.responseText);
                if (chainData.error) { alert(`API Error (Chain Report): ${chainData.error.error}\n\nThis may be an invalid key or insufficient permissions. Click 'Manage API Key' to check.`); return; }
                const balanceData = JSON.parse(balanceResponse.responseText);
                if (balanceData.error) { alert(`API Error (Faction Balance): ${balanceData.error.error}`); return; }

                await calculateAndDisplayPayouts(chainData.chainreport, balanceData, BCR);
            } catch (error) {
                console.error('Torn Payout Script Error:', error);
                alert('A network error occurred. Check your API key and internet connection.');
            } finally {
                if (spinner && document.body.contains(spinner)) document.body.removeChild(spinner);
            }
        });

        async function calculateAndDisplayPayouts(chainReport, balanceData, BCR) {
            const attackers = chainReport.attackers;
            let totalICS = 0;

            const memberDataMap = new Map();
            if (balanceData?.balance?.members) {
                balanceData.balance.members.forEach(member => {
                    memberDataMap.set(member.id, { username: member.username, money: member.money });
                });
            }

            attackers.forEach(attacker => {
                attacker.ICS = (attacker.attacks.total * 5) + (attacker.respect.total * 100);
                totalICS += attacker.ICS;
                const memberInfo = memberDataMap.get(attacker.id);
                attacker.username = memberInfo?.username || `User #${attacker.id}`;
                attacker.currentBalance = memberInfo?.money ?? null;
            });

            let totalFinalPayout = 0;
            attackers.forEach(attacker => {
                attacker.performancePayout = totalICS > 0 ? (BCR * (attacker.ICS / totalICS)) : 0;
                attacker.xanaxReimbursement = (ATTACKS_PER_XANAX > 0 && XANAX_COST > 0) ? (attacker.attacks.total / ATTACKS_PER_XANAX) * XANAX_COST : 0;
                attacker.payout = attacker.performancePayout + attacker.xanaxReimbursement;
                attacker.newBalance = attacker.currentBalance !== null ? attacker.currentBalance + attacker.payout : null;
                totalFinalPayout += attacker.payout;
            });

            const existingContainer = document.getElementById('payout-container');
            if (existingContainer) existingContainer.remove();

            const payoutContainer = document.createElement('div');
            payoutContainer.id = 'payout-container';

            const reportWrapper = document.querySelector('div.chain-report-wrap.chainReportWp___G8B3E');
            if (reportWrapper) {
                reportWrapper.appendChild(payoutContainer);
            } else {
                const mainContainer = document.getElementById('mainContainer') || document.body;
                mainContainer.appendChild(payoutContainer);
            }

            const storageKey = `payout_status_${chainID}`;
            let isPaid = await GM_get(storageKey, false);

            payoutContainer.insertAdjacentHTML('beforeend', `
                <div id="paid-out-warning" style="display: ${isPaid ? 'block' : 'none'};"><strong>This chain has already been marked as paid out.</strong></div>
                <h2>Chain Payout Calculator</h2>
                <p>Base Chain Reward (BCR): ${formatCurrency(BCR)} | Xanax Reimbursement: ${formatCurrency(XANAX_COST)} per ${ATTACKS_PER_XANAX} attacks.</p>
            `);

            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'payout-table-wrapper';

            const table = document.createElement('table');
            table.innerHTML = `<thead><tr>
                <th>Player Name [ID]</th><th>Respect</th><th>Attacks</th><th>Final Payout</th><th>Current Balance</th><th>New Balance</th>
            </tr></thead>`;
            const tbody = document.createElement('tbody');

            attackers.forEach(attacker => {
                tbody.innerHTML += `
                    <tr>
                        <td class="clickable-name" data-id="${attacker.id}">${attacker.username} [${attacker.id}]</td>
                        <td>${attacker.respect.total.toFixed(2)}</td>
                        <td>${attacker.attacks.total}</td>
                        <td>${formatCurrency(attacker.payout)}</td>
                        <td>${attacker.currentBalance !== null ? formatCurrency(attacker.currentBalance) : 'N/A'}</td>
                        <td>${attacker.newBalance !== null ? formatCurrency(attacker.newBalance) : 'N/A'}</td>
                    </tr>
                `;
            });
            table.appendChild(tbody);
            table.insertAdjacentHTML('beforeend', `
                <tfoot><tr class="total-row">
                    <td colspan="3"><strong>Total Final Payout</strong></td>
                    <td><strong>${formatCurrency(totalFinalPayout)}</strong></td>
                    <td colspan="2"></td>
                </tr></tfoot>
            `);

            tableWrapper.appendChild(table);
            payoutContainer.appendChild(tableWrapper);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            payoutContainer.appendChild(buttonGroup);

            const copyBalancesButton = createButton('Copy Balances', 'action-button copy-button', () => {
                const text = attackers.filter(a => a.newBalance !== null).map(a => `${a.username} [${a.id}] New Balance: ${formatCurrency(a.newBalance)}`).join('\n');
                copyToClipboard(text, copyBalancesButton, 'Copy Balances');
            });

            const copyFactionEmailButton = createButton('Copy Faction Email', 'action-button copy-button', () => {
                const factionReportHTML = generateFactionWideReportHTML(attackers, chainReport, BCR, totalFinalPayout);
                copyToClipboard(factionReportHTML.replace(/\n\s*/g, ' ').trim(), copyFactionEmailButton, 'Copy Faction Email');
            });
            copyFactionEmailButton.style.backgroundColor = '#28a745';

            const markPaidButton = createButton('Mark as Paid', 'action-button mark-paid-button', async () => {
                await GM_set(storageKey, true);
                document.getElementById('paid-out-warning').style.display = 'block';
                markPaidButton.disabled = true;
                markPaidButton.textContent = 'Paid!';
            });
            markPaidButton.disabled = isPaid;

            const closeButton = createButton('Close', 'action-button close-button', () => payoutContainer.remove());
            buttonGroup.append(copyBalancesButton, copyFactionEmailButton, markPaidButton, closeButton);

            const individualReportContainer = document.createElement('div');
            individualReportContainer.id = 'individual-report-container';
            individualReportContainer.style.display = 'none';
            payoutContainer.appendChild(individualReportContainer);

            table.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('clickable-name')) {
                    const attackerId = parseInt(target.dataset.id, 10);
                    const attacker = attackers.find(a => a.id === attackerId);
                    generateIndividualReport(attacker, individualReportContainer, chainReport);
                } else {
                    handleTableCellClick(event);
                }
            });

            payoutContainer.scrollIntoView({ behavior: 'smooth' });
        }

        function handleTableCellClick(event) {
            const cell = event.target.closest('td');
            if (!cell || cell.closest('thead') || cell.closest('tfoot')) return;
            let valueToCopy = cell.textContent.trim();
            if (!valueToCopy || valueToCopy === 'N/A') return;
            if (valueToCopy.startsWith('$')) {
                valueToCopy = valueToCopy.replace(/[$,]/g, '');
            }
            navigator.clipboard.writeText(valueToCopy).then(() => {
                cell.classList.add('cell-copied');
                setTimeout(() => cell.classList.remove('cell-copied'), 1500);
            }).catch(err => {
                console.error('Torn Payout Script: Could not copy cell value.', err);
            });
        }

        function generateIndividualReport(attacker, container, chainReport) {
            container.style.display = 'block';
            container.innerHTML = `<h4>HTML Payout Report for ${attacker.username} [${attacker.id}]</h4>`;
            const isNewBalanceRowPresent = attacker.newBalance !== null;
            const tdBorderStyle = "1px solid #444";
            const tdNoBorderStyle = "none";
            const xanaxRowBottomBorder = isNewBalanceRowPresent ? tdBorderStyle : tdNoBorderStyle;
            const thStyleLeft = "background-color: #4CAF50; color: white; padding: 12px 15px; text-align: left; border-bottom: 1px solid #3c8e40; font-size: 1em;";
            const thStyleRight = "background-color: #4CAF50; color: white; padding: 12px 15px; text-align: right; border-bottom: 1px solid #3c8e40; font-size: 1em;";
            const tdStyleLeft = "padding: 10px 15px; text-align: left; color: #e0e0e0;";
            const tdStyleRight = "padding: 10px 15px; text-align: right; color: #e0e0e0;";
            const totalPayoutColor = "#76ff03";
            const reportHTML = `<div style="font-family: Arial, Helvetica, sans-serif; background-color: #1a1a1a; color: #e0e0e0; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid #333;"><h3 style="color: #e0e0e0; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-top: 0; margin-bottom: 20px; font-size: 1.4em; text-align: center;">Chain Payout Report</h3><p style="color: #e0e0e0; font-size: 1.1em; margin-bottom: 10px; line-height: 1.6;">Hi ${attacker.username},</p><p style="color: #cccccc; line-height: 1.6; margin-bottom: 15px;">Thank you for your contribution to chain ID: ${chainReport.id}. Here's your payout summary:</p><table style="width: 100%; border-collapse: collapse; background-color: #2c2c2c; color: #e0e0e0; margin-bottom: 20px; border: 1px solid #444; border-radius: 5px; overflow: hidden;"><thead><tr><th style="${thStyleLeft}">Description</th><th style="${thStyleRight}">Value</th></tr></thead><tbody><tr style="background-color: #2c2c2c;"><td style="${tdStyleLeft} border-bottom: ${tdBorderStyle};">Total Attacks</td><td style="${tdStyleRight} border-bottom: ${tdBorderStyle};">${attacker.attacks.total}</td></tr><tr style="background-color: #333333;"><td style="${tdStyleLeft} border-bottom: ${tdBorderStyle};">Total Respect Gained</td><td style="${tdStyleRight} border-bottom: ${tdBorderStyle};">${attacker.respect.total.toFixed(2)}</td></tr><tr style="background-color: #2c2c2c;"><td style="${tdStyleLeft} border-bottom: ${tdBorderStyle};">Performance Payout (ICS)</td><td style="${tdStyleRight} border-bottom: ${tdBorderStyle};">${formatCurrency(attacker.performancePayout)}</td></tr><tr style="background-color: #333333;"><td style="${tdStyleLeft} border-bottom: ${tdBorderStyle};">Xanax Reimbursement</td><td style="${tdStyleRight} border-bottom: ${tdBorderStyle};">${formatCurrency(attacker.xanaxReimbursement)}</td></tr><tr style="background-color: #2c2c2c; font-weight: bold;"><td style="${tdStyleLeft} border-bottom: ${xanaxRowBottomBorder};">Total Payout</td><td style="${tdStyleRight} border-bottom: ${xanaxRowBottomBorder}; color: ${totalPayoutColor};">${formatCurrency(attacker.payout)}</td></tr>${isNewBalanceRowPresent ? `<tr style="background-color: #333333;"><td style="${tdStyleLeft} border-bottom: ${tdNoBorderStyle};">New Faction Balance</td><td style="${tdStyleRight} border-bottom: ${tdNoBorderStyle};">${formatCurrency(attacker.newBalance)}</td></tr>` : ''}</tbody></table><p style="color: #cccccc; line-height: 1.6; margin-bottom: 15px;">The funds have been ${isNewBalanceRowPresent ? 'added to your faction balance' : 'sent to you'}. Keep up the great work!</p><p style="font-size: 0.85em; color: #999999; text-align: center; margin-top: 30px; margin-bottom: 0;"><em>This is an automated message generated by the Faction Payout Script.</em></p></div>`;
            container.insertAdjacentHTML('beforeend', reportHTML);
            const copyHtmlButton = createButton('Copy HTML for Mail', 'action-button copy-button', () => {
                copyToClipboard(reportHTML.replace(/\n\s*/g, ' ').trim(), copyHtmlButton, 'Copy HTML for Mail');
            });
            copyHtmlButton.style.marginTop = '10px';
            container.appendChild(copyHtmlButton);
            container.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }

        function generateFactionWideReportHTML(attackers, chainReport, bcr, totalChainFinalPayout) {
            const thStyleLeft = "background-color: #4CAF50; color: white; padding: 10px 12px; text-align: left; border-bottom: 1px solid #3c8e40; font-size: 0.95em;";
            const thStyleRight = "background-color: #4CAF50; color: white; padding: 10px 12px; text-align: right; border-bottom: 1px solid #3c8e40; font-size: 0.95em;";
            const tdStyleLeft = "padding: 8px 12px; text-align: left; color: #e0e0e0; border-bottom: 1px solid #444;";
            const tdStyleRight = "padding: 8px 12px; text-align: right; color: #e0e0e0; border-bottom: 1px solid #444;";
            const lastDataRowTdStyleLeft = "padding: 8px 12px; text-align: left; color: #e0e0e0; border-bottom: none;";
            const lastDataRowTdStyleRight = "padding: 8px 12px; text-align: right; color: #e0e0e0; border-bottom: none;";
            let attackersHtml = '';
            const numAttackers = attackers.length;
            if (numAttackers === 0) {
                attackersHtml = `<tr><td colspan="4" style="${tdStyleLeft} text-align: center; border-bottom: none;">No participants in this chain.</td></tr>`;
            } else {
                attackers.forEach((attacker, index) => {
                    const rowBackground = index % 2 === 0 ? '#2c2c2c' : '#333333';
                    attackersHtml += `<tr style="background-color: ${rowBackground};"><td style="${index === numAttackers - 1 ? lastDataRowTdStyleLeft : tdStyleLeft}">${attacker.username} [${attacker.id}]</td><td style="${index === numAttackers - 1 ? lastDataRowTdStyleRight : tdStyleRight}">${attacker.respect.total.toFixed(2)}</td><td style="${index === numAttackers - 1 ? lastDataRowTdStyleRight : tdStyleRight}">${attacker.attacks.total}</td><td style="${index === numAttackers - 1 ? lastDataRowTdStyleRight : tdStyleRight}; color: #76ff03;">${formatCurrency(attacker.payout)}</td></tr>`;
                });
            }
            const reportHTML = `<div style="font-family: Arial, Helvetica, sans-serif; background-color: #1a1a1a; color: #e0e0e0; padding: 20px; max-width: 700px; margin: 0 auto; border-radius: 8px; border: 1px solid #333;"><h3 style="color: #e0e0e0; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; margin-top: 0; margin-bottom: 20px; font-size: 1.4em; text-align: center;">Faction Chain Payout Summary</h3><p style="color: #cccccc; line-height: 1.6; margin-bottom: 15px;">Here's a summary of the payouts for our recent chain (ID: ${chainReport.id}), based on a BCR of ${formatCurrency(bcr)} and Xanax reimbursement of ${formatCurrency(XANAX_COST)} per ${ATTACKS_PER_XANAX} attacks.</p><table style="width: 100%; border-collapse: collapse; background-color: #2c2c2c; color: #e0e0e0; margin-bottom: 20px; border: 1px solid #444; border-radius: 5px; overflow: hidden;"><thead><tr><th style="${thStyleLeft}">Player Name [ID]</th><th style="${thStyleRight}">Respect</th><th style="${thStyleRight}">Attacks</th><th style="${thStyleRight}">Final Payout</th></tr></thead><tbody>${attackersHtml}${(totalChainFinalPayout > 0 && numAttackers > 0) ? `<tr style="background-color: #4CAF50; color: white; font-weight: bold;"><td colspan="3" style="padding: 10px 12px; text-align: left; border-top: 1px solid #3c8e40;"><strong>Total Payout Distributed</strong></td><td style="padding: 10px 12px; text-align: right; border-top: 1px solid #3c8e40;"><strong>${formatCurrency(totalChainFinalPayout)}</strong></td></tr>` : ''}</tbody></table><p style="color: #cccccc; line-height: 1.6;">Well done to all participants!</p><p style="font-size: 0.85em; color: #999999; text-align: center; margin-top: 30px; margin-bottom: 0;"><em>This is an automated message generated by the Faction Payout Script.</em></p></div>`;
            return reportHTML;
        }

        const formatCurrency = (num) => '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const createButton = (text, className, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.className = className;
            btn.addEventListener('click', onClick);
            return btn;
        };
        const copyToClipboard = (text, button, originalText) => {
            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => { button.textContent = originalText; }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                alert('Could not copy to clipboard.');
            });
        };
    }
})();