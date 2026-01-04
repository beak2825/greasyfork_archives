// ==UserScript==
// @name        NeoFinancial export transactions as CSV
// @namespace   Violentmonkey Scripts
// @match       https://member.neofinancial.com/*
// @grant       GM.xmlHttpRequest
// @version     1.4.1
// @license     MIT
// @author      eaglesemanation
// @description Adds a button to transactions page that exports all transactions into a CSV file. Developed for use with "Actual" budgeting tool, will probably work fine with any other importer.
// @downloadURL https://update.greasyfork.org/scripts/497956/NeoFinancial%20export%20transactions%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/497956/NeoFinancial%20export%20transactions%20as%20CSV.meta.js
// ==/UserScript==

/**
 * Type returned by GraphQL api for credit transactions
 *
 * @typedef {Object} Transaction
 * @property {string} description
 * @property {string} currency
 * @property {string} type
 * @property {string} status
 * @property {string} category
 * @property {number} amountCents
 * @property {string} authorizationProcessedAt
 * @property {MerchantDetails?} merchantDetails
 * @property {SourceInformation?} sourceInformation
 * @property {string?} transferContactName
 * @property {string?} etransferContactName
 * @property {string?} billPayVendorName
 */

/**
 * @typedef {Object} MerchantDetails
 * @property {string} description
 * @property {string} category
 */

/**
 * @typedef {Object} SourceInformation
 * @property {string} friendlyName
 */

/**
 * GraphQL query for credit account transactions
 */
const creditTransactionQuery = `
    query TransactionsList($input: CursorQueryInput!, $creditAccountId: ObjectID!) {
      user {
        creditAccount(id: $creditAccountId) {
          creditTransactionList(input: $input) {
            cursor
            hasNextPage
            results {
              description
              currency
              type
              status
              category
              merchantDetails {
                description
                category
              }
              sourceInformation {
                friendlyName
              }
              amountCents
              authorizationProcessedAt
            }
          }
        }
      }
    }
`;

/**
 * @param {string} accountId - credit account ID
 * @param {[any]?} filters
 * @returns {Promise<[Transaction]>}
 */
async function creditTransactions(accountId, filters) {
    if (!filters) {
        filters = [];
    }

    let transactions = [];
    let hasNextPage = true;
    let cursor = undefined;
    while (hasNextPage) {
        let respJson = await GM.xmlHttpRequest({
            url: "https://api.production.neofinancial.com/graphql",
            method: "POST",
            responseType: "json",
            headers: {
                "content-type": "application/json",
            },
            data: JSON.stringify({
                operationName: "TransactionsList",
                query: creditTransactionQuery,
                variables: {
                    creditAccountId: accountId,
                    input: {
                        cursor: cursor,
                        filter: filters,
                        limit: 1000,
                        sort: {
                            direction: "DESC",
                            field: "authorizationProcessedAt",
                        },
                    },
                },
            }),
        });

        let resp = JSON.parse(respJson.responseText);
        let transactionList = resp.data.user.creditAccount.creditTransactionList;
        hasNextPage = transactionList.hasNextPage;
        cursor = transactionList.cursor;
        transactions = transactions.concat(transactionList.results);
    }
    return transactions;
}

/**
 * GraphQL query for savings account transactions
 */
const savingsTransactionQuery = `
    fragment SavingsTransactionPurchaseFragment on SavingsTransactionPurchase {
      merchantDetails {
        description
        category
      }
      redemptions {
        totalRedeemed
        totalCount
      }
      dispute {
        id
        status
      }
    }

    fragment SavingsTransactionFundsTransferFragment on SavingsTransactionFundsTransfer {
      etransferContactName: transferContactName
    }

    fragment SavingsTransactionETransferFragment on SavingsTransactionETransfer {
      transferContactName
    }

    fragment SavingsTransactionBillPaymentFragment on SavingsTransactionBillPayment {
      billPayVendorName
    }

    fragment SavingsTransactionFeeFragment on SavingsTransactionFee {
      parentTransactionId
    }

    query FilteredSortedSavingsTransactionList($input: CursorQueryInput!, $savingsAccountId: ObjectID!) {
      user {
        savingsAccount(id: $savingsAccountId) {
          savingsTransactionList(input: $input) {
            cursor
            hasNextPage
            results {
              id
              amountCents
              authorizationProcessedAt
              category
              currency
              description
              type
              status
              completedAt
              ...SavingsTransactionPurchaseFragment
              ...SavingsTransactionFundsTransferFragment
              ...SavingsTransactionETransferFragment
              ...SavingsTransactionBillPaymentFragment
              ...SavingsTransactionFeeFragment
            }
          }
        }
      }
    }
`;

/**
 * @param {string} accountId - savings account ID
 * @param {[any]?} filters
 * @returns {Promise<[Transaction]>}
 */
async function savingsTransactions(accountId, filters) {
    if (!filters) {
        filters = [];
    }

    let transactions = [];
    let hasNextPage = true;
    let cursor = undefined;
    while (hasNextPage) {
        let respJson = await GM.xmlHttpRequest({
            url: "https://api.production.neofinancial.com/graphql",
            method: "POST",
            responseType: "json",
            headers: {
                "content-type": "application/json",
            },
            data: JSON.stringify({
                operationName: "FilteredSortedSavingsTransactionList",
                query: savingsTransactionQuery,
                variables: {
                    savingsAccountId: accountId,
                    input: {
                        cursor: cursor,
                        filter: filters,
                        limit: 1000,
                        sort: {
                            direction: "DESC",
                            field: "authorizationProcessedAt",
                        },
                    },
                },
            }),
        });

        let resp = JSON.parse(respJson.responseText);
        let transactionList = resp.data.user.savingsAccount.savingsTransactionList;
        hasNextPage = transactionList.hasNextPage;
        cursor = transactionList.cursor;
        transactions = transactions.concat(transactionList.results);
    }
    return transactions;
}

/**
 * GraphQL query for figuring out custom name of savings account
 */
const accountPersonalizationQuery = `
    query SavingsAccountPersonalization($savingsAccountId: ObjectID!) {
      user {
        savingsAccount(id: $savingsAccountId) {
          accountPersonalization {
            customizedName
          }
        }
      }
    }
`;

/**
 * @param {string} accountId - savings account ID
 * @returns {Promise<string>}
 */
async function savingsAccountName(accountId) {
    let respJson = await GM.xmlHttpRequest({
        url: "https://api.production.neofinancial.com/graphql",
        method: "POST",
        responseType: "json",
        headers: {
            "content-type": "application/json",
        },
        data: JSON.stringify({
            operationName: "SavingsAccountPersonalization",
            query: accountPersonalizationQuery,
            variables: {
                savingsAccountId: accountId,
            },
        }),
    });

    let resp = JSON.parse(respJson.responseText);
    return resp.data.user.savingsAccount.accountPersonalization.customizedName;
}

/**
 * @param {[Transaction]} transactions
 * @returns {Blob}
 */
function transactionsToCsvBlob(transactions) {
    let csv = `"Date","Payee","Notes","Category","Amount"\n`;
    for (const transaction of transactions) {
        let date = new Date(transaction.authorizationProcessedAt);
        // JS Date type is absolutly horible, I hope Temporal API will be better
        let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        let payee = null;
        let category = transaction.category;
        // Assume that transaction is a purchase by default
        let amountCents = -transaction.amountCents;

        switch (transaction.category) {
            case "PURCHASE":
                payee = transaction.merchantDetails.description;
                category = transaction.merchantDetails.category;
                break;
            case "NEO_STORE_PURCHASE":
                payee = "Neo Financial";
                category = "PURCHASE";
                break;
            case "REWARDS_ACCOUNT_CASH_OUT":
                payee = "Neo Financial";
                category = "PAYMENT";
                amountCents = transaction.amountCents;
                break;
            case "REFUND":
                payee = transaction.merchantDetails.description;
                category = transaction.merchantDetails.category;
                amountCents = transaction.amountCents;
                break;
            case "PAYMENT":
                payee = transaction.sourceInformation.friendlyName;
                amountCents = transaction.amountCents;
                break;
            case "WITHDRAWAL":
                if (transaction.description.search(/Payment to Credit/) !== -1) {
                    payee = "Neo Credit";
                } else if (transaction.merchantDetails) {
                    payee = transaction.merchantDetails.description;
                    category = transaction.merchantDetails.category;
                } else {
                    payee = transaction.transferContactName;
                }
                break;
            case "TRANSFER":
                if (transaction.transferContactName) {
                    payee = transaction.transferContactName;
                } else if (transaction.etransferContactName) {
                    payee = transaction.etransferContactName;
                }
                amountCents = transaction.amountCents;
                break;
            case "INTEREST":
                payee = "Neo Financial";
                category = "PAYMENT";
                amountCents = transaction.amountCents;
                break;
            case "DEPOSIT":
                if (transaction.description.search(/Reward Cashed Out/) !== -1) {
                    payee = "Neo Financial";
                    category = "PAYMENT";
                }
                amountCents = transaction.amountCents;
                break;
            default:
                console.log(
                    `[csv-export] ${dateStr} transaction [${transaction.category}] has unexpected category. Object logged below. Skipping`,
                );
                console.log(transaction);
                continue;
        }

        if (!payee) {
            console.log(
                `[csv-export] ${dateStr} transaction [${transaction.category}] could not figure out payee. Object logged below. Skipping`,
            );
            console.log(transaction);
            continue;
        }

        let amountCentsStr = amountCents.toString();
        let amount = "";
        // Insert decimal separator into a string to avoid any shenanigans with floating point numbers
        if (amountCentsStr.length > 2) {
            amount =
                amountCentsStr.substring(0, amountCentsStr.length - 2) +
                "." +
                amountCentsStr.substring(amountCentsStr.length - 2);
        } else if (amountCents < 10) {
            amount = `0.0${amountCentsStr}`;
        } else {
            amount = `0.${amountCentsStr}`;
        }

        let notes = transaction.description;

        let entry = `"${dateStr}","${payee}","${notes}","${category}","${amount}"`;

        // Transaction is not affecting balance, skipping
        if (!["CONFIRMED", "AUTHORIZED"].includes(transaction.status)) {
            // Catching unhandled status values.
            if (!["DECLINED"].includes(transaction.status)) {
                console.log(
                    `[csv-export] ${dateStr} transaction [${transaction.category}] from "${payee}" has unexpected status: ${transaction.status}. Object logged below. Skipping`,
                );
                console.log(transaction);
            }
            continue;
        }

        csv += `${entry}\n`;
    }

    // Signifies to some apps that file is UTF-8 encoded
    const BOM = "\uFEFF";
    return new Blob([BOM, csv], { type: "text/csv;charset=utf-8" });
}

// ID for quickly verifying if button was already injected
const exportCsvId = "export-transactions-csv";

/**
 * Copied style of a credit payment button
 *
 * @type {CSSStyleDeclaration}
 */
const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    outline: "0",
    border: "0",
    margin: "0",
    borderRadius: "4px",
    padding: "0rem 1rem",
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    color: "inherit",
    fontFamily: `TTCommons, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    fontWeight: "600",
    fontSize: "1rem",
    lineHeight: "1.25",
    letterSpacing: "0.02857em",
    minWidth: "64px",
    borderRadius: "4px",
    backgroundColor: "#EDEEEF",
    color: "#000000",
    height: "32px",
    width: "100%",
};

/**
 * Inserts a CSV export button next to transaction filters button
 *
 * @param {Element?} filtersElement
 * @param {AccountInfo?} accountInfo
 */
function addDownloadButtons(filtersElement, accountInfo) {
    if (!filtersElement || !accountInfo) {
        return;
    }

    let csvExportRow = document.createElement("div");
    csvExportRow.id = exportCsvId;
    csvExportRow.style.display = "flex";
    csvExportRow.style.alignItems = "center";
    csvExportRow.style.gap = "1em";

    let csvExportText = document.createElement("div");
    csvExportText.innerText = "Export as CSV:";
    csvExportText.style.fontFamily = buttonStyle.fontFamily;
    csvExportText.style.fontWeight = "400";
    csvExportRow.appendChild(csvExportText);

    const now = new Date();
    const buttons = [
        {
            text: "This Month",
            fromDate: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        {
            text: "Last 3 Months",
            fromDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
        },
        {
            text: "All",
            fromDate: null,
        },
    ];

    for (const button of buttons) {
        let filters = [];
        if (button.fromDate) {
            filters = [
                {
                    field: "authorizationProcessedAt",
                    operator: "GTE",
                    type: "DATE",
                    value: button.fromDate.toISOString(),
                },
            ];
        }

        let exportButton = document.createElement("button");
        exportButton.innerText = button.text;
        exportButton.onclick = saveBlobToFileCallback(
            accountInfo,
            filters,
            button.fromDate,
        );
        Object.assign(exportButton.style, buttonStyle);
        let exportButtonBox = document.createElement("div");
        exportButtonBox.className = "MuiBox-root";
        exportButtonBox.appendChild(exportButton);

        csvExportRow.appendChild(exportButtonBox);
    }

    filtersElement.insertBefore(csvExportRow, filtersElement.children[0]);
    filtersElement.style.alignItems = "center";
    filtersElement.style.justifyContent = "space-between";
    filtersElement.style.gap = "1em";
}

/**
 * @callback TransactionCallback
 * @param {string} accountId
 * @param {[any]} filters
 * @returns {Promise<[Transaction]>}
 */

/**
 * Creates a wraper function that calls to transaction callback, then downloads resulting blob as a file by
 * injecting anchor element into a body, clicking it and removing it.
 *
 * @param {AccountInfo} accountInfo
 * @param {[any]?} filters
 * @param {Date?} fromDate
 * @return {Function}
 */
function saveBlobToFileCallback(accountInfo, filters, fromDate) {
    if (!filters) {
        filters = [];
    }

    return async () => {
        console.log("[csv-export] Fetching Transactions");
        let blob = transactionsToCsvBlob(
            await accountInfo.transactionsCallback(accountInfo.id, filters),
        );
        console.log("[csv-export] Writing transactions into a file");
        let blobUrl = URL.createObjectURL(blob);

        let now = new Date();
        let nowStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        let timeFrame = "";
        if (fromDate) {
            timeFrame += `From ${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-${fromDate.getDate()} `;
        }
        timeFrame += `Up to ${nowStr}`;

        let link = document.createElement("a");
        link.href = blobUrl;
        link.download = `Neo ${accountInfo.name} Transactions ${timeFrame}.csv`;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    };
}

/**
 * Identifies if current page is a transactions page and returns apropriate button callback
 *
 * @typedef {Object} PageInfo
 * @property {boolean} isTransactionsPage
 * @property {string?} transactionFiltersQuery - CSS query for a place where to put a button
 * @property {AccountInfo?} accountInfo
 */

/**
 * @typedef {Object} AccountInfo
 * @property {string} id
 * @property {string} name
 * @property {"credit"|"savings"} type
 * @property {TransactionCallback} transactionsCallback
 */

/**
 * @returns {Promise<PageInfo>}
 */
async function detectPageType() {
    /**
     * @type {PageInfo}
     */
    let pageInfo = {
        isTransactionsPage: false,
        transactionFiltersQuery: null,
        accountInfo: null,
    };

    let pathParts = window.location.pathname.split("/");
    if (pathParts[pathParts.length - 1] !== "transactions") {
        return pageInfo;
    } else {
        pageInfo.isTransactionsPage = true;
    }

    let accountsIdx = pathParts.findIndex((v) => v === "accounts");

    let accountType = pathParts[accountsIdx + 1];
    let accountId = pathParts[accountsIdx + 2];

    // Handling different types of accounts
    if (accountType === "credit") {
        pageInfo.transactionFiltersQuery = `div:has(> button > svg > path[d="M3 17v2h6v-2zM3 5v2h10V5zm10 16v-2h8v-2h-8v-2h-2v6zM7 9v2H3v2h4v2h2V9zm14 4v-2H11v2zm-6-4h2V7h4V5h-4V3h-2z"])`;
        pageInfo.accountInfo = {
            id: accountId,
            type: accountType,
            // Looks like credit account cannot have custom name, hardcoding it
            name: "Credit",
            transactionsCallback: creditTransactions,
        };
    } else if (accountType === "savings") {
        pageInfo.transactionFiltersQuery = `div:has(> button > svg > path[d="M3 17v2h6v-2zM3 5v2h10V5zm10 16v-2h8v-2h-8v-2h-2v6zM7 9v2H3v2h4v2h2V9zm14 4v-2H11v2zm-6-4h2V7h4V5h-4V3h-2z"])`;
        pageInfo.accountInfo = {
            id: accountId,
            type: accountType,
            name: await savingsAccountName(accountId),
            transactionsCallback: savingsTransactions,
        };
    }

    if (pageInfo.accountInfo !== null) {
        console.log(`[csv-export] Transactions history page of type '${accountType}' detected`);
    }

    return pageInfo;
}

/**
 * Keeps button shown after rerenders and href changes
 * @returns {Promise<void>}
 */
async function keepButtonShown() {
    // Early exit, to avoid unnecessary requests if already injected
    if (document.querySelector(`div#${exportCsvId}`)) {
        return;
    }

    const pageInfo = await detectPageType();
    if (!pageInfo.isTransactionsPage) {
        return;
    }
    const transactionFilters = document.querySelector(
        pageInfo.transactionFiltersQuery,
    );
    if (!transactionFilters) {
        console.log("[csv-export] Could not find UI element specifying transaction history filters, aborting");
        return;
    }

    // Intentional duplicate, avoiding race condidion on detectPageType call
    if (document.querySelector(`div#${exportCsvId}`)) {
        return;
    }
    addDownloadButtons(transactionFilters, pageInfo.accountInfo);
}

(async function() {
    // Keeping track of DOM modifications to detect when "Transactions Filter" button will reappear
    const observer = new MutationObserver(async (mutations) => {
        for (const _ of mutations) {
            await keepButtonShown();
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    // Try running on load if there are no mutations for some reason
    window.addEventListener("load", async () => {
        await keepButtonShown();
    });
})();
