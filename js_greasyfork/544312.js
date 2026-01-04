// ==UserScript==
// @name         My Meralco Accounts Table
// @description  Creates a table view of account(s) with selectable and copyable text
// @namespace    https://github.com/rainniel/tampermonkey-scripts
// @supportURL   https://github.com/rainniel/tampermonkey-scripts/issues
// @version      1.1
// @author       Rainniel
// @license      MIT
// @match        https://mymeralco.com.ph/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mymeralco.com.ph
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544312/My%20Meralco%20Accounts%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/544312/My%20Meralco%20Accounts%20Table.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const accountsApi = 'https://api-morevamp.meco-soldel.com/production/bill/overview';

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        this._url = url;
        return originalOpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', function () {
            if (this._url.toLowerCase().startsWith(accountsApi.toLowerCase())) {
                let items;

                if (this.responseType === 'arraybuffer') {
                    try {
                        const decoder = new TextDecoder('utf-8');
                        const text = decoder.decode(this.response);
                        const json = JSON.parse(text);

                        if (json.result && Array.isArray(json.result)) {
                            items = json.result.map(item => ({
                                alias: item.alias,
                                can: item.cxe_can,
                                amount: item.amount,
                                due_date: item.due_date
                            }));
                        }
                    } catch (e) {
                        console.warn('Failed to decode or parse arraybuffer:', e);
                    }
                }

                showAccountsTable(items);
            }
        });
        return originalSend.apply(this, args);
    };

    let accountsDivInjected = false;
    let accountsDiv;
    let accountsTableBody;

    function injectAccountsDiv() {
        if (accountsDivInjected) return;

        const style = document.createElement('style');
        style.textContent = `
            div.accounts-div {
                display: none; position: fixed; bottom: 20px; right: 20px;
                background: #fff; border: 1px solid #ccc; border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15); z-index: 9999;
                color: #000; font-family: Arial, sans-serif; font-size: 14px;
                user-select: text !important; -webkit-user-select: text !important;
            }

            div.accounts-div-main {
                padding: 16px;
            }

            div.accounts-div-restore {
                display: none; align-items: center; justify-content: center; padding: 10px; cursor: pointer;
            }

            div.accounts-header {
                display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 0 10px 0;
            }

            div.accounts-title {
                font-weight: bold; font-size: 16px;
            }

            button.minimize-button {
                padding: 3px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; border: 1px solid #ccc; border-radius: 3px;
            }

            table.accounts-table {
                width: 100%; border-collapse: collapse;
            }

            th.default-heading {
                text-align: left; padding: 6px; border-bottom: 1px solid #ccc;
            }

            th.amount-heading {
                text-align: right; padding: 6px; border-bottom: 1px solid #ccc;
            }

            td.default-cell {
                padding: 6px;
            }

            td.right-cell {
                padding: 6px; text-align: right;
            }

            td.amount-cell {
                padding: 6px 0 6px 6px; text-align: right;
            }

            td.amount-button {
                padding: 6px 6px 6px 0;
            }

            button.amount-button {
                width:24px; height:24px; margin-left:6px; padding:0; display: flex; align-items: center; justify-content: center;
                cursor: pointer; font-size: 12px; border: 1px solid #ccc; border-radius: 3px;
            }

            tr.table-footer {
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);

        const div = document.createElement('div');
        div.innerHTML = `
            <div class="accounts-div" id="accounts-div">
                <div id="accounts-div-main" class="accounts-div-main">
                    <div class="accounts-header">
                        <div class="accounts-title">Accounts</div>
                        <div>
                            <button class="minimize-button" title="Minimize" onclick="showHideBox(false)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 512 512" fill="currentColor">
                                    <path d="M32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32h448c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <table class="accounts-table">
                        <thead>
                            <tr>
                                <th class="default-heading">Alias</th>
                                <th class="default-heading">CAN</th>
                                <th class="amount-heading" colspan="2">Amount</th>
                                <th class="default-heading">Due Date</th>
                            </tr>
                        </thead>
                        <tbody id="accounts-table-body"></tbody>
                    </table>
                </div>
                <div id="accounts-div-restore" class="accounts-div-restore" title="Show Accounts Table" onclick="showHideBox(true)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor">
                        <path d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625ZM21 9.375A.375.375 0 0 0 20.625 9h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5ZM10.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5ZM3.375 15h7.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h7.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 10.875 9h-7.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Z"></path>
                    </svg>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        accountsDiv = document.getElementById('accounts-div');
        accountsTableBody = document.getElementById('accounts-table-body');
        accountsDivInjected = true;
    }

    function showAccountsTable(items) {
        injectAccountsDiv();

        if (Array.isArray(items) && items.length > 0) {
            let tableBody = '';
            let totalAmount = 0;

            items.forEach(item => {
                totalAmount += fixAmount(item.amount);

                tableBody += `
                    <tr>
                        <td class="default-cell">${item.alias}</td>
                        <td class="right-cell">${item.can}</td>
                        <td class="amount-cell">${formatAmount(item.amount)}</td>
                        <td class="amount-button">
                            <button class="amount-button" title="Copy Amount" data-copy="${fixAmount(item.amount)}" onclick="navigator.clipboard.writeText(this.dataset.copy)">
                                <svg xmlns="http://www.w3.org/2000/svg" height="12px" width="12px" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path>
                                </svg>
                            </button>
                        </td>
                        <td class="default-cell">${formatDate(item.due_date)}</td>
                    </tr>
                `;
            });

            if (items.length > 1) {
                tableBody += `
                    <tr class="table-footer">
                        <td class="right-cell" colspan="2">Total</td>
                        <td class="amount-cell">${formatAmount(totalAmount)}</td>
                    </tr>
                `;
            }

            accountsTableBody.innerHTML = tableBody;
            accountsDiv.style.display = 'block';
        } else {
            accountsDiv.style.display = 'none';
            accountsTableBody.innerHTML = '';
        }
    }

    window.showHideBox = function (show) {
        if (show) {
            document.getElementById('accounts-div-restore').style.display = 'none';
            document.getElementById('accounts-div-main').style.display = 'block';
        } else {
            document.getElementById('accounts-div-main').style.display = 'none';
            document.getElementById('accounts-div-restore').style.display = 'flex';
        }
    };

    function fixAmount(amount) {
        const num = Number(amount);
        return isNaN(num) || num < 0 ? 0 : num;
    }

    function formatAmount(amount) {
        return fixAmount(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatDate(date) {
        if (typeof date === "string" && date.toLowerCase() === "immediately") {
            return "Immediately";
        }

        const newDate = new Date(date);
        if (isNaN(newDate.getTime())) return "None";

        return newDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
})();