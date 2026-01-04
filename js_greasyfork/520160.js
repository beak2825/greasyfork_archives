// ==UserScript==
// @name         TOTO - Win/Loss
// @namespace    https://greasyfork.org/en/users/2755-robotoilinc
// @author       RobotOilInc
// @version      1.1.0
// @license      MIT
// @description  Calculate your TOTO win/loss amount based on deposit/withdrawals
// @match        https://www.toto.nl/mijn/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      portal-spa-api.toto.nl
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toto.nl
// @downloadURL https://update.greasyfork.org/scripts/520160/TOTO%20-%20WinLoss.user.js
// @updateURL https://update.greasyfork.org/scripts/520160/TOTO%20-%20WinLoss.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    let currentRoute = '';

    const currentYear = new Date().getFullYear();
    const API_URL = "https://portal-spa-api.toto.nl/api/transactions";
    const QUERY_PARAMS = `?pageSize=100&from=${currentYear}-01-01T00%3A00%3A00.000Z&to=${currentYear}-12-31T23%3A59%3A59.000Z&filter=WALLET_ALL`;

    // Create and style the summary container
    function createSummaryContainer() {
        if (document.getElementById('summary-container')) return;

        const container = document.createElement('div');
        container.id = 'summary-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '100px',
            right: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
            zIndex: '1000',
        });

        container.innerHTML = `
      <div id="loading-spinner">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="spinner" style="
            width: 20px;
            height: 20px;
            border: 3px solid #ccc;
            border-top: 3px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;"></div>
          <span>Loading transactions...</span>
        </div>
      </div>
    `;

        document.body.appendChild(container);

        GM_addStyle(`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `);
    }

    // Remove summary container on navigation
    function removeSummaryContainer() {
        const container = document.getElementById('summary-container');
        if (container) container.remove();
    }

    // Fetch transactions securely with current credentials
    async function fetchTransactions() {
        const allTransactions = [];
        let nextPageId = null;

        do {
            const url = `${API_URL}${QUERY_PARAMS}${nextPageId ? `&pageId=${encodeURIComponent(nextPageId)}` : ''}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include', // Automatically send cookies
                });

                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                allTransactions.push(...(data.transactions || []));
                nextPageId = data.nextPageId;
            } catch (error) {
                console.error("Error fetching transactions:", error);
                break;
            }
        } while (nextPageId);

        return allTransactions;
    }

    // Calculate win/loss summary
    function calculateSummary(transactions) {
        const summary = transactions.reduce((acc, { amount, type }) => {
            if (type === "DEPOSIT") acc.totalDeposited += Math.abs(amount);
            if (type === "WITHDRAWAL_PENDING") acc.totalWithdrawn += Math.abs(amount);
            return acc;
        }, { totalDeposited: 0, totalWithdrawn: 0 });

        summary.profit = Math.abs(summary.totalWithdrawn - summary.totalDeposited);
        summary.profitType = summary.totalWithdrawn > summary.totalDeposited ? 'Profit' : 'Loss';
        return summary;
    }

    // Update the container with transaction summary
    function updateSummaryContainer({ totalDeposited, totalWithdrawn, profit, profitType }) {
        const container = document.getElementById('summary-container');
        if (container) {
            container.innerHTML = `
                <h3>Transaction Summary</h3>
                <p><em>Year to date</em></p>
                <p>
                    <dl style="margin: 0; padding: 0;">
                        <dt><strong>Total Deposited:</strong></dt>
                        <dd>€${(totalDeposited / 100).toFixed(2).replace('.', ',')}</dd>
                        <dt><strong>Total Withdrawn:</strong></dt>
                        <dd>€${(totalWithdrawn / 100).toFixed(2).replace('.', ',')}</dd>
                        <dt><strong>${profitType}:</strong></dt>
                        <dd>€${(profit / 100).toFixed(2).replace('.', ',')}</dd>
                    </dl>
                </p>
      `;
        }
    }

    async function initializeSummary() {
        const transactions = await fetchTransactions();
        const summary = calculateSummary(transactions);
        updateSummaryContainer(summary);
    }

    // Observe navigation and handle SPA routing
    function observeNavigation() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const path = window.location.pathname;
                    if (path.includes('/mijn/wallet/transacties')) {
                        if (currentRoute !== '/mijn/wallet/transacties') {
                            currentRoute = '/mijn/wallet/transacties';
                            createSummaryContainer();
                            initializeSummary();
                        }
                    } else {
                        if (currentRoute) {
                            removeSummaryContainer();
                            currentRoute = '';
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeNavigation();
})();