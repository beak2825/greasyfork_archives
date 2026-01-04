// ==UserScript==
// @name        RBC export transactions as CSV
// @namespace   Violentmonkey Scripts
// @match       https://www1.royalbank.com/*
// @grant       GM.xmlHttpRequest
// @version     1.0.1
// @license     MIT
// @author      eaglesemanation
// @description Adds export buttons to Summary and Details pages. They will export transactions within certain timeframe into CSV, options are "This Month", "Last 3 Month", "All". This should provide better transaction description than what is provided by preexisting CSV export feature.
// @downloadURL https://update.greasyfork.org/scripts/512540/RBC%20export%20transactions%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/512540/RBC%20export%20transactions%20as%20CSV.meta.js
// ==/UserScript==

/**
 * @typedef {Object} PageInfo
 * @property {"summary" | "details" | null} pageType
 * @property {HTMLElement?} anchor - Element to which buttons will be "attached". Buttons should be inserted before it.
 * @property {string?} accountId
 */

/**
 * Figures out which paget we're currently on and where to attach buttons. Should not do any queries,
 * because it gets spammed executed by MutationObserver.
 *
 * @returns {PageInfo}
 */
function getPageInfo() {
  /**
   * @type PageInfo
   */
  let emptyInfo = {
    pageType: null,
    anchor: null,
    accountId: null,
  };
  let info = structuredClone(emptyInfo);

  let hashParts = window.location.hash.split("/");
  if (hashParts.length === 2 && hashParts[1] === "summary") {
    info.pageType = "summary";
    let anchor = document.querySelectorAll("#ribbon-statements");
    if (anchor.length !== 1) {
      return emptyInfo;
    }
    info.anchor = anchor[0];
  } else if (hashParts.length === 2 && hashParts[1].startsWith("details")) {
    info.pageType = "details";
    const hashKV = hashParts[1].split(";");
    for (const kv of hashKV) {
      const kvParts = kv.split("=");
      if (kvParts.length === 2 && kvParts[0] === "selectedAccount") {
        info.accountId = kvParts[1];
        break;
      }
    }
    let downloadButtons = document.querySelectorAll(
      `a[rbcportalsubmit="DownloadTransactions"], a[rbcportalsubmit="CC_Posted_Transactions_Download"]`,
    );
    if (downloadButtons.length !== 2) {
      return emptyInfo;
    }
    for (let button of downloadButtons) {
      for (let attr of button.attributes) {
        if (attr.name.startsWith("_ngcontent")) {
          info.anchor = button;
        }
      }
    }
    if (info.anchor === null) {
      return emptyInfo;
    }
  } else {
    // Didn't match any expected page
    return emptyInfo;
  }

  return info;
}

// ID for quickly verifying if buttons were already injected
const exportCsvId = "export-transactions-csv";

/**
 * Keeps button shown after rerenders and href changes
 *
 * @returns {Promise<void>}
 */
async function keepButtonShown() {
  // Early exit, to avoid unnecessary requests if already injected
  if (document.querySelector(`div#${exportCsvId}`)) {
    return;
  }

  const pageInfo = getPageInfo();
  if (!pageInfo.pageType) {
    return;
  }

  console.log("[csv-export] Adding buttons");
  addButtons(pageInfo);
}

(async function () {
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

/**
 * Stub, just forcing neovim to corectly highlight HTML syntax in literal
 */
function html(strings, ...values) {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
}

const downloadIcon = function (ngcontentAttr) {
  return html`
    <rbc-icon
      ${ngcontentAttr}=""
      name="download"
      size="s"
      class="download s rbc-icon"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 16 16"
        fit=""
        height="100%"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path
          fill-rule="evenodd"
          d="m11.905 9.356-3.555 3.5a.498.498 0 0 1-.7 0h-.001l-3.554-3.5a.5.5 0 1 1 .701-.712L7.5 11.306V.5a.5.5 0 0 1 1 0v10.806l2.704-2.662a.5.5 0 0 1 .701.712ZM15 9.5a.5.5 0 0 1 1 0V15a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 1 0V15h14V9.5Z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </rbc-icon>
  `;
};

/**
 * Attaches button row to anchor element. Should be synchronous to avoid attaching row twice, because Mutex is not cool enough for JS?
 *
 * @param {PageInfo} pageInfo
 * @returns {void}
 */
function addButtons(pageInfo) {
  let linkRow = document.createElement("div");
  linkRow.id = exportCsvId;
  linkRow.style.display = "flex";
  linkRow.style.alignItems = "baseline";
  linkRow.style.gap = "1em";
  linkRow.style.marginLeft = "auto";

  // Seems to be some sort of component CSS system, just copy attribute from adjasent node
  let ngcontentAttrName = "";
  for (let attr of pageInfo.anchor.attributes) {
    if (attr.name.startsWith("_ngcontent")) {
      ngcontentAttrName = attr.name;
    }
  }

  const now = new Date();
  const links = [
    {
      text: "This Month",
      fromDate: new Date(now.getFullYear(), now.getMonth(), 1),
    },
    {
      text: "3 Months",
      fromDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
    },
    {
      text: "All",
      fromDate: null,
    },
  ];

  for (const link of links) {
    let exportLink = document.createElement("a");
    exportLink.href = "JavaScript:void(0);"; // Makes browser believe that it's interactive, what a silly thing to do
    exportLink.className = "export-csv-button";
    exportLink.innerHTML = html`${downloadIcon(ngcontentAttrName)}
      <span
        ${pageInfo.pageType === "summary"
          ? `class="label label--shadowed"`
          : null}
        ${pageInfo.pageType === "details" ? `style="margin-left: 8px;"` : null}
        ${ngcontentAttrName}=""
      >
        ${link.text}
      </span>`;
    exportLink.setAttribute(ngcontentAttrName, "");
    exportLink.onclick = async () => {
      console.log("[csv-export] Fetching account details");
      let accountsInfo = await accountListSummary();
      /**
       * @type {Record<string, AccountSummary>}
       */
      let idToAccount = accountsInfo.reduce((acc, v) => {
        acc[v.accountId] = v;
        return acc;
      }, {});
      /**
       * @type {Record<string, Blob>}
       */
      let blobs = {};
      if (pageInfo.pageType === "summary") {
        for (let acc of accountsInfo) {
          let transactions = await accountTransactions(acc, link.fromDate);
          blobs[acc.accountId] = await transactionsToCsvBlob(transactions);
        }
      } else if (pageInfo.pageType === "details") {
        if (pageInfo.accountId === null) {
          throw "details page is missing selectedAccount argument";
        }
        let transactions = await accountTransactions(
          idToAccount[pageInfo.accountId],
          link.fromDate,
        );
        blobs[pageInfo.accountId] = await transactionsToCsvBlob(transactions);
      }
      saveBlobsToFiles(blobs, idToAccount, link.fromDate);
    };

    linkRow.appendChild(exportLink);
  }

  let anchorParent = pageInfo.anchor.parentNode;

  if (pageInfo.pageType === "details") {
    // Remove already existing download button
    pageInfo.anchor.innerHTML = "";
    anchorParent.insertBefore(linkRow, pageInfo.anchor);
  } else {
    let divider = document.createElement("div");
    divider.className = "mat-divider left-divider";
    divider.setAttribute(ngcontentAttrName, "");
    anchorParent.insertBefore(divider, pageInfo.anchor);
    anchorParent.insertBefore(linkRow, divider);
  }

  anchorParent.style.gap = "1em";
  pageInfo.anchor.style.marginLeft = "0";
}

/**
 * @typedef {Object} AccountListSummary
 *
 * @property {{accounts: [AccountSummary]}} depositAccounts
 * @property {{accounts: [AccountSummary]}} creditCards
 */

/**
 * @typedef {Object} AccountSummary
 *
 * @property {string} accountId
 * @property {string} accountNumber
 * @property {string} encryptedAccountNumber
 * @property {string} nickName
 * @property {{productName: string}} product
 * @property {"CREDIT" | "DEBIT"} type
 */

/**
 * Gets list of all types of accounts and their details
 *
 * @returns {Promise<[AccountSummary]>}
 */
async function accountListSummary() {
  let respJson = await GM.xmlHttpRequest({
    url: "https://www1.royalbank.com/sgw5/digital/product-summary-presentation-service-v3/v3/accountListSummary",
    method: "GET",
    responseType: "json",
    headers: {
      "content-type": "application/json",
    },
  });

  if (respJson.status !== 200) {
    throw `Failed to fetch account list: ${respJson.responseText}`;
  }
  /**
   * @type {AccountListSummary}
   */
  let resp = JSON.parse(respJson.responseText);
  if (resp.errorState.hasError === true) {
    throw `Failed to fetch account list: ${resp.errorState}`;
  }
  return resp.creditCards.accounts
    .map((v) => ({ ...v, type: "CREDIT" }))
    .concat(
      resp.depositAccounts.accounts.map((v) => ({
        ...v,
        type: "DEBIT",
      })),
    );
}

/**
 * Given Date returns yyyy-mm-dd
 *
 * @param {Date} date
 * @returns {string}
 */
function toDateString(date) {
  const offset = date.getTimezoneOffset();
  const dateWithOffset = new Date(date.getTime() - offset * 60 * 1000);
  return dateWithOffset.toISOString().split("T")[0];
}

/**
 * @param {Date} date
 * @param {number} years
 * @returns {Date}
 */
function dateSubstractYears(date, years) {
  let olderDate = new Date(date);
  olderDate.setFullYear(date.getFullYear() - years);
  return olderDate;
}

function getXSRFCookie() {
  let match = decodeURIComponent(document.cookie)
    .split(";")
    .map((v) => v.trim().split("=", 2))
    .filter(([key, _]) => key === "XSRF-TOKEN");
  if (match.length === 1) {
    return match[0][1];
  }
  return undefined;
}

/**
 * @typedef {Object} Transaction
 *
 * @property {number} amount
 * @property {"CREDIT" | "DEBIT"} creditDebitIndicator
 * @property {[string]} description
 * @property {string} bookingDate
 * @property {string} merchantName
 * @property {string} merchantCity
 */

/**
 * @param {AccountSummary} account
 * @param {Date?} fromDate
 */
async function accountTransactions(account, fromDate) {
  if (account.type === "CREDIT") {
    // TODO: Figure out what is actual limit for export, it might be related to date of card issue
    const fromDateWithDefault = fromDate ?? dateSubstractYears(new Date(), 4);
    return await creditAccountTransactions(
      account.encryptedAccountNumber,
      fromDateWithDefault,
    );
  } else if (account.type === "DEBIT") {
    const fromDateWithDefault = fromDate ?? dateSubstractYears(new Date(), 7);
    return await debitAccountTransactions(
      account.encryptedAccountNumber,
      fromDateWithDefault,
    );
  }
}

/**
 * Gets transactions for debit account
 *
 * @param {string} encryptedAccountNumber
 * @param {Date} fromDate
 * @returns {Promise<[Transaction]>}
 */
async function debitAccountTransactions(encryptedAccountNumber, fromDate) {
  const transactionFromDate = toDateString(fromDate);
  let transactions = [];
  let hasNextPage = true;
  let offsetKey = undefined;
  while (hasNextPage) {
    let respJson = await GM.xmlHttpRequest({
      url: `https://www1.royalbank.com/sgw5/digital/transaction-presentation-service-v3-dbb/v3/search/pda/account/${encodeURIComponent(encryptedAccountNumber)}`,
      method: "POST",
      responseType: "json",
      headers: {
        "content-type": "application/json",
        "X-XSRF-TOKEN": getXSRFCookie(),
      },
      data: JSON.stringify({
        transactionFromDate,
        transactionToDate: toDateString(new Date()),
        limit: 200,
        offsetKey,
      }),
    });

    if (respJson.status !== 200) {
      throw `Failed to fetch transactions: ${respJson.responseText}`;
    }
    let resp = JSON.parse(respJson.responseText);
    if (resp.hasError === true) {
      throw `Failed to fetch transactions: [${resp.errorLevel}] ${resp.errorDescription}`;
    }
    transactions = transactions.concat(resp.transactionList);
    if (transactions.length === 0) {
      break;
    }
    offsetKey = transactions[transactions.length - 1].transactionOffsetKey;
    hasNextPage = resp.totalMatches > transactions.length;
  }
  return transactions;
}

/**
 * Gets transactions for credit card
 *
 * @param {string} encryptedAccountNumber
 * @param {Date} fromDate
 * @returns {Promise<[Transaction]>}
 */
async function creditAccountTransactions(encryptedAccountNumber, fromDate) {
  const transactionFromDate = toDateString(fromDate);
  let transactions = [];
  let hasNextPage = true;
  let offsetKey = undefined;
  while (hasNextPage) {
    let respJson = await GM.xmlHttpRequest({
      url: `https://www1.royalbank.com/sgw5/digital/transaction-presentation-service-v3-dbb/v3/search/cc/posted/account/${encodeURIComponent(encryptedAccountNumber)}`,
      method: "POST",
      responseType: "json",
      headers: {
        "content-type": "application/json",
        "X-XSRF-TOKEN": getXSRFCookie(),
      },
      data: JSON.stringify({
        transactionFromDate,
        transactionToDate: toDateString(new Date()),
        limit: 200,
        offsetKey,
      }),
    });

    if (respJson.status !== 200) {
      throw `Failed to fetch transactions: ${respJson.responseText}`;
    }
    let resp = JSON.parse(respJson.responseText);
    if (resp.hasError === true) {
      throw `Failed to fetch transactions: [${resp.errorLevel}] ${resp.errorDescription}`;
    }
    transactions = transactions.concat(resp.transactionList);
    if (transactions.length === 0) {
      break;
    }
    offsetKey = transactions[transactions.length - 1].transactionOffsetKey;
    hasNextPage = resp.totalMatches > transactions.length;
  }
  return transactions;
}

/**
 * @param {[Transaction]} transactions
 * @returns {Promise<Blob>}
 */
async function transactionsToCsvBlob(transactions) {
  let csv = `"Date","Payee","Notes","Category","Amount"\n`;
  for (const transaction of transactions) {
    let payee = "unknown";
    let notes = transaction.description.join(" ");

    // Most transactions in RBC don't have category
    let category = "";

    const desc = transaction.description;
    if (transaction.merchantName !== null) {
      payee = transaction.merchantName;
      notes = transaction.merchantCity ?? transaction.merchantName;
    } else if (desc.length === 3 && desc[0].startsWith("e-Transfer")) {
      payee = desc[1];
      notes = `${desc[0]} [${desc[2]}]`;
    } else if (desc.length >= 1 && desc[0].toLowerCase().includes("fee")) {
      console.log(
        `[csv-export] ${transaction.bookingDate} transaction includes "fee" in its description: "${desc.join(" ")}"; setting payee to RBC. Please report on greasyfork.org in case of false positives.`,
      );
      payee = "RBC";
      notes = desc[0];
    } else if (
      desc.length === 1 &&
      desc[0].toLowerCase().endsWith("deposit interest")
    ) {
      payee = "RBC";
      notes = desc[0];
    } else if (desc.length === 2) {
      payee = desc[1];
      notes = desc[0];
    } else {
      console.log(
        `[csv-export] ${transaction.bookingDate} transaction has description that could not be parsed: "${desc.join(" ")}". If you beleive this description has identifiable payee - please report on greasyfork.org for assistanse.`,
      );
      console.log(transaction);
    }

    let amount = transaction.amount;
    if (transaction.creditDebitIndicator === "DEBIT") {
      amount = `-${amount}`;
    }

    // Transactions in RBC don't have category, skipping
    let entry = `"${transaction.bookingDate}","${payee}","${notes}","${category}","${amount}"`;
    csv += `${entry}\n`;
  }

  // Signals to some apps that file encoded with UTF-8
  const BOM = "\uFEFF";
  return new Blob([BOM, csv], { type: "text/csv;charset=utf-8" });
}

/**
 * @param {Record<string, Blob>}} accountBlobs
 * @param {Record<string, AccountInfo>} idToAccounts
 * @param {Date?} fromDate
 */
function saveBlobsToFiles(accountBlobs, idToAccounts, fromDate) {
  for (let acc in accountBlobs) {
    let blobUrl = URL.createObjectURL(accountBlobs[acc]);

    let now = new Date();
    let nowStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let timeFrame = "";
    if (fromDate) {
      timeFrame += `From ${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-${fromDate.getDate()} `;
    }
    timeFrame += `Up to ${nowStr}`;

    let link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${idToAccounts[acc].product.productName} Transactions ${timeFrame}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }
}
