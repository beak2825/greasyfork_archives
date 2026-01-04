// ==UserScript==
// @name         Fluz
// @namespace    https://github.com/wall0313/tampermonkey_script
// @version      0.1.4
// @description  Fluz Power
// @match        https://power.fluz.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fluz.app
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498108/Fluz.user.js
// @updateURL https://update.greasyfork.org/scripts/498108/Fluz.meta.js
// ==/UserScript==

const accessToken = JSON.parse(localStorage.getItem("persist:auth")).accessToken.replace(/^\"/, "").replace(/\"$/, "");
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const requestCache = {};

// Helper function to make a request
function request(url, method) {
    return new Promise((resolve, reject) => {
        const key = `${method} ### ${url}`;
        if (requestCache[key]) {
            resolve(JSON.parse(requestCache[key]));
            return;
        }

        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: document.cookie,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    requestCache[key] = response.responseText;
                    resolve(JSON.parse(response.responseText));
                } else {
                    reject(new Error('Request failed with status ' + response.status));
                }
            },
            onerror: function (error) {
                reject(new Error('Network error'));
            }
        });
    });
}

async function addPendingGift() {
    const res = await request('https://power.fluz.app/api/v1/user/profile', 'GET');
    const pendingGiftBalance = res.balance.pending_gift_card_balance;

    if (!document.querySelector('.added-pending-balance')) {
        const elements = document.querySelectorAll('p.p-small');
        for (const ele of elements) {
            if (ele.textContent.includes('Current balance:')) {
                const newEle = document.createElement('p');
                newEle.className = 'p-small color-white added-pending-balance';
                newEle.textContent = `Pending balance: `;
                const newBalanceSpan = document.createElement('span');
                newBalanceSpan.textContent = `$${pendingGiftBalance}`;
                newBalanceSpan.style.color = 'yellow';
                newEle.appendChild(newBalanceSpan);
                ele.parentNode.appendChild(newEle);
                break;
            }
        }
    }
}

async function addVendorBalance() {
    const res = await request('https://power.fluz.app/api/v1/virtual-card/program-balance/HIGHNOTE', 'GET');
    if (!document.querySelector('.added-vendor-balance')) {
        const elements = document.querySelectorAll('header.card-header');
        for (const ele of elements) {
            if (ele.textContent.includes('Create a virtual card')) {
                const newEle = document.createElement('p');
                newEle.className = 'd-flex flex-column justify-content-start align-items-start flex-wrap card-header added-vendor-balance';
                newEle.style.color = 'black';
                newEle.style.fontWeight = '500';
                newEle.textContent = `Vendor balance:`;

                // Sutton
                const newSuttonDiv = document.createElement('div');
                const newSuttonBalanceSpan = document.createElement('span');
                newSuttonDiv.textContent = '- Sutton (450897, 536209): ';
                newSuttonDiv.style.color = 'black';
                newSuttonBalanceSpan.textContent = `${USDollar.format(res.vendorBalance.Sutton)}`
                newSuttonBalanceSpan.style.color = res.vendorBalance.Sutton > 50000 ? 'green' : 'red';
                newSuttonDiv.appendChild(newSuttonBalanceSpan);
                newEle.appendChild(newSuttonDiv);

                // CFSB
                const newCFSBDiv = document.createElement('div');
                const newCFSBBalanceSpan = document.createElement('span');
                newCFSBDiv.textContent = '- CFSB (462036, 537875): ';
                newCFSBDiv.style.color = 'black';
                newCFSBBalanceSpan.textContent = `${USDollar.format(res.vendorBalance.CFSB)}`;
                newCFSBBalanceSpan.style.color = res.vendorBalance.CFSB > 50000 ? 'green' : 'red';
                newCFSBDiv.appendChild(newCFSBBalanceSpan);
                newEle.appendChild(newCFSBDiv);

                // Visa
                /*const newVISADiv = document.createElement('div');
                const newVISABalanceSpan = document.createElement('span');
                newVISADiv.textContent = '- Visa (475436): ';
                newVISADiv.style.color = 'black';
                newVISABalanceSpan.textContent = `${USDollar.format(res.vendorBalance.Visa)}`;
                newVISABalanceSpan.style.color = res.vendorBalance.Visa > 50000 ? 'green' : 'red';
                newVISADiv.appendChild(newVISABalanceSpan);
                newEle.appendChild(newVISADiv);*/

                ele.parentElement.appendChild(newEle);
                break;
            }
        }
    }
}

async function addPurchaseTotal() {
    const recordLimit = 250;
    let currentPage = 1;
    let totalPage = 0;
    let totalAmountOfGCPurchased = {};
    while (currentPage === 1 || currentPage <= totalPage) {
        console.log('loading...');
        const res = await request(`https://power.fluz.app/api/v1/user/gift-card?limit=${recordLimit}&page=${currentPage}`, 'GET');
        if (totalPage === 0) {
            totalPage = res.totalPages;
        }
        for (const row of res.rows) {
            if (totalAmountOfGCPurchased[row.gift_card.merchant.name]) {
                totalAmountOfGCPurchased[row.gift_card.merchant.name] += row.purchase_amount;
            } else {
                totalAmountOfGCPurchased[row.gift_card.merchant.name] = row.purchase_amount;
            }
        }
        currentPage++;
    }
    console.log(totalAmountOfGCPurchased);
}

async function addTransferTotal() {
    const recordLimit = 250;
    let total_rows_transfer = [];
    let total_rows_cashback_withdraw = [];
    let currentPage = 1;
    let totalPage = 0;
    let depositDetails = {
        "total_cash_deposit_amount": 0,
        "total_cash_deposit_amount_available_all_time": 0,
        "total_cash_deposit_amount_pending": 0,
        "total_gcp_deposit_amount": 0,
        "total_gcp_deposit_amount_available_all_time": 0,
        "total_gcp_deposit_amount_pending": 0,
        "total_deposit_fee": 0,
        "total_withdraw_cashback_via_ach": 0
    };
    while (currentPage === 1 || currentPage <= totalPage) {
        console.log('loading...');
        const res = await request(`https://power.fluz.app/api/v1/user/cash-balance?limit=${recordLimit}&page=${currentPage}`, 'GET');
        if (totalPage === 0) {
            totalPage = res.totalPages;
        }
        for (const row of res.rows) {
            if (row.cash_balance_deposit_id && row.payment_method_sub_type === "CREDIT" && row.payment_method_type === "BANK_CARD") {
                if (row.cash_balance_deposit_type === "CASH_BALANCE") {
                    depositDetails.total_cash_deposit_amount += parseFloat(row.deposit_amount);
                    if (row.status === "AVAILABLE") {
                        depositDetails.total_cash_deposit_amount_available_all_time += parseFloat(row.deposit_amount);
                    }
                    if (row.status === "PENDING") {
                        depositDetails.total_cash_deposit_amount_pending += parseFloat(row.deposit_amount);
                    }
                } else if (row.cash_balance_deposit_type === "GIFT_CARD_BALANCE") {
                    depositDetails.total_gcp_deposit_amount += parseFloat(row.deposit_amount);
                    if (row.status === "AVAILABLE") {
                        depositDetails.total_gcp_deposit_amount_available_all_time += parseFloat(row.deposit_amount);
                    }
                    if (row.status === "PENDING") {
                        depositDetails.total_gcp_deposit_amount_pending += parseFloat(row.deposit_amount);
                    }
                }
                depositDetails.total_deposit_fee += parseFloat(row.deposit_fee);
                total_rows_transfer.push(row);
            } else if (row.withdraw_id && row.withdraw_method === "BANK_ACH" && row.withdraw_source === "REWARDS_BALANCE") {
                depositDetails.total_withdraw_cashback_via_ach += parseFloat(row.amount);
                total_rows_cashback_withdraw.push(row);
            }
        }
        currentPage++;
    }
    console.log(depositDetails);

    const csv_cashback = jsonToCsv(total_rows_cashback_withdraw);
    const downloanButtonDivCashback = document.createElement('div');
    downloanButtonDivCashback.className = 'd-flex flex-column justify-content-start align-items-start flex-wrap card-header';
    const downloanButtonCashback = document.createElement('button');
    const downloanButtonTextCashback = document.createTextNode("Download cashback.csv");
    downloanButtonCashback.onclick = function() {downloadBlob(csv_cashback, 'cashback.csv', 'text/csv;charset=utf-8;');}
    downloanButtonCashback.appendChild(downloanButtonTextCashback);
    downloanButtonDivCashback.appendChild(downloanButtonCashback);
    const elements = document.querySelectorAll('header.card-header');
    for (const ele of elements) {
        if (ele.textContent.includes('Transactions')) {
            ele.insertAdjacentElement('afterend', downloanButtonDivCashback);
        }
    }

    const csv = jsonToCsv(total_rows_transfer);
    const downloanButtonDiv = document.createElement('div');
    downloanButtonDiv.className = 'd-flex flex-column justify-content-start align-items-start flex-wrap card-header';
    const downloanButton = document.createElement('button');
    const downloanButtonText = document.createTextNode("Download transfer.csv");
    downloanButton.onclick = function() {downloadBlob(csv, 'transfer.csv', 'text/csv;charset=utf-8;');}
    downloanButton.appendChild(downloanButtonText);
    downloanButtonDiv.appendChild(downloanButton);
    for (const ele of elements) {
        if (ele.textContent.includes('Transactions')) {
            ele.insertAdjacentElement('afterend', downloanButtonDiv);
        }
    }
}

async function addVirtualCardsTotal() {
    const recordLimit = 5000;
    let total_rows = [];
    let currentPage = 1;
    let totalPage = 0;
    let virtualCardSpendDetails = {
        "total_vc_purchase_amount": 0,
        "total_vc_refund_amount": 0,
        "total_vc_cashback_amount": 0
    };
    while (currentPage === 1 || currentPage <= totalPage) {
        console.log('loading...');
        const res = await request(`https://power.fluz.app/api/v1/user/virtual-card/transactions?limit=${recordLimit}&page=${currentPage}&transaction_type=Purchase%2CRefund`, 'GET');
        if (totalPage === 0) {
            totalPage = res.totalPages;
        }
        total_rows = total_rows.concat(res.rows);
        for (const row of res.rows) {
            if (row.transaction_response_code === "APPROVED") {
                if (row.transaction_type === "PURCHASE") {
                    virtualCardSpendDetails.total_vc_purchase_amount += parseFloat(row.transaction_amount);
                    virtualCardSpendDetails.total_vc_cashback_amount += parseFloat(row.cashback);
                } else if (row.transaction_type === "REFUND") {
                    virtualCardSpendDetails.total_vc_refund_amount += parseFloat(row.transaction_amount);
                    virtualCardSpendDetails.total_vc_cashback_amount -= parseFloat(row.cashback);
                } else {
                    console.log(row);
                }
            } else {
                console.log(row);
            }
        }
        currentPage++;
    }
    console.log(virtualCardSpendDetails);
    const csv = jsonToCsv(total_rows);
    const downloanButtonDiv = document.createElement('div');
    downloanButtonDiv.className = 'd-flex flex-column justify-content-start align-items-start flex-wrap card-header';
    const downloanButton = document.createElement('button');
    const downloanButtonText = document.createTextNode("Download virtual_cards.csv");
    downloanButton.onclick = function() {downloadBlob(csv, 'virtual_cards.csv', 'text/csv;charset=utf-8;');}
    downloanButton.appendChild(downloanButtonText);
    downloanButtonDiv.appendChild(downloanButton);
    const elements = document.querySelectorAll('header.card-header');
    for (const ele of elements) {
        if (ele.textContent.includes('Transactions')) {
            ele.insertAdjacentElement('afterend', downloanButtonDiv);
        }
    }
}

async function modifyDOM(urlContent) {
    if (urlContent.includes('scheduled-gift-card-prepayment')) {
        waitForElm('header.card-header').then((elm) => {
            console.log('Element is addPendingGift');
            addPendingGift();
        });
    } else if (urlContent.includes('transactions/virtual-cards')) {
        waitForElm('header.card-header').then((elm) => {
            console.log('Element is addVirtualCardsTotal');
            addVirtualCardsTotal();
        });
    } else if (urlContent.includes('virtual-cards')) {
        waitForElm('header.card-header').then((elm) => {
            console.log('Element is addVendorBalance');
            addVendorBalance();
        });
    } else if (urlContent.includes('transactions/purchases')) {
        waitForElm('header.card-header').then((elm) => {
            console.log('Element is addPurchaseTotal');
            addPurchaseTotal();
        });
    } else if (urlContent.includes('transactions/transfers')) {
        waitForElm('header.card-header').then((elm) => {
            console.log('Element is addTransferTotal');
            addTransferTotal();
        });
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function jsonToCsv(items) {
    const header = Object.keys(items[0]);
    const headerString = header.join(',');
    // handle null or undefined values here
    const replacer = (key, value) => value ?? '';
    const rowItems = items.map((row) =>
                               header
                               .map((fieldName) => (JSON.stringify(row[fieldName], replacer)).replaceAll('"', ''))
                               .join(',')
                              );
    // join header and body, and break into separate lines
    const csv = [headerString, ...rowItems].join('\r\n');
    return csv;
}

function downloadBlob(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);

    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
}

(async function () {
    'use strict';
    modifyDOM(document.location.href);
    window.navigation.addEventListener("navigate", (event) => {
        modifyDOM(event.destination.url);
    })
})();
