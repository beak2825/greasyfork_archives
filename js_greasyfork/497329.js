// ==UserScript==
// @name         TC-Company-Alerts
// @namespace    Torn.A7X.CompanyAlerts
// @version      1.1.3
// @description  A script for Torn that displays a warning in the sidebar for companies when stock or bank balance is low
// @author       A7X [1823654]
// @match        https://www.torn.com/*
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497329/TC-Company-Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/497329/TC-Company-Alerts.meta.js
// ==/UserScript==

'use strict';

//Variables - Change these
const API_KEY = ''; //API key need to be a Limited Access key from the company owner
const DAY_THRESHOLD = 3; //Amount of days the stock should last before alert is triggered

//Code - Probably don't change this
GM.addStyle(`
.company-alerts {
    background-color: var(--default-bg-panel-color);
    border: 1px solid var(--default-border-color);
    border-radius: 5px;
    margin: 1px 0 3px;
    padding: 5px;
    color: red;
}
`);

async function fetchCompanyData() {
    try {
        const response = await fetch(`https://api.torn.com/company/?selections=detailed,stock&key=${API_KEY}`);
        const data = await response.json();

        const lowStocks = Object.entries(data.company_stock)
            .filter(([_, item]) => (item.in_stock + item.on_order) < DAY_THRESHOLD * item.sold_amount)
            .map(([name]) => name);

        const bankLow = data.company_detailed.company_bank < (data.company_detailed.advertising_budget * DAY_THRESHOLD);
        const stockLow = lowStocks.length > 0;

        if (bankLow || stockLow) {
            createAlertsDiv(bankLow, data.company_detailed.company_bank, stockLow, lowStocks);
        }
    } catch (error) {
        console.error('Error fetching company data:', error);
    }
}

function createAlertsDiv(bankLow, bankAmount, stockLow, lowStocks) {
    const alertsDiv = document.createElement('div');
    alertsDiv.className = 'company-alerts';
    alertsDiv.innerHTML = `
        ${bankLow ? `<p>Bank low: $${bankAmount.toLocaleString()}</p>` : ''}
        ${stockLow ? `<p>Stock low: ${lowStocks.join(', ')}</p>` : ''}
    `;
    document.getElementById('sidebar').insertBefore(alertsDiv, document.getElementById('sidebar').firstChild.nextSibling);
}

new MutationObserver((mutations, observer) => {
    if (document.getElementById('sidebar')) {
        fetchCompanyData();
        observer.disconnect();
    }
}).observe(document, { childList: true, subtree: true });