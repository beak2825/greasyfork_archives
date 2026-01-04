// ==UserScript==
// @name        Wealthsimple export transactions as CSV
// @namespace   Violentmonkey Scripts
// @match       https://my.wealthsimple.com/*
// @grant       GM.xmlHttpRequest
// @version     1.4
// @license     MIT
// @author      eaglesemanation
// @description Adds export buttons to Activity feed and to Account specific activity. They will export transactions within certain timeframe into CSV, options are "This Month", "Last 3 Month", "All". This should provide better transaction description than what is provided by preexisting CSV export feature.
// @downloadURL https://update.greasyfork.org/scripts/500403/Wealthsimple%20export%20transactions%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/500403/Wealthsimple%20export%20transactions%20as%20CSV.meta.js
// ==/UserScript==

/**
 * @callback ReadyPredicate
 * @returns {boolean}
 */

/**
 * @typedef {Object} PageInfo
 * @property {"account-details" | "activity" | null} pageType
 * @property {HTMLElement?} anchor - Element to which buttons will be "attached". Buttons should be inserted before it.
 * @property {ReadyPredicate?} readyPredicate - Verifies if ready to insert
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
    readyPredicate: null,
    accountsInfo: null,
  };
  let info = structuredClone(emptyInfo);

  let pathParts = window.location.pathname.split("/");
  if (pathParts.length === 4 && pathParts[2] === "account-details") {
    // All classes within HTML have been obfuscated/minified, using icons as a starting point, in hope that they don't change that much.
    const threeDotsSvgPath =
      "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z";
    const threeDotsButtonContainerQuery = `div:has(> div > button svg > path[d="${threeDotsSvgPath}"])`;

    info.pageType = "account-details";
    let anchor = document.querySelectorAll(threeDotsButtonContainerQuery);
    if (anchor.length !== 1) {
      return emptyInfo;
    }
    info.anchor = anchor[0];
    info.readyPredicate = () => info.anchor.parentNode.children.length >= 1;
  } else if (pathParts.length === 3 && pathParts[2] === "activity") {
    const threeLinesSvgPath = "M2 4h12M4.667 8h6.666m-4.666 4h2.666";
    const threeLinesButtonContainerQuery = `div:has(> button svg > path[d="${threeLinesSvgPath}"])`;

    info.pageType = "activity";
    let anchor = document.querySelectorAll(threeLinesButtonContainerQuery);
    if (anchor.length !== 1) {
      return emptyInfo;
    }
    info.anchor = anchor[0];
    info.readyPredicate = () => info.anchor.parentNode.children.length >= 1;
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
  if (!pageInfo.readyPredicate || !pageInfo.readyPredicate()) {
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
 * Stub, just forcing neovim to corectly highlight CSS syntax in literal
 */
function css(str) {
  return str;
}

const stylesheet = new CSSStyleSheet();
stylesheet.insertRule(css`
  .export-csv-button:hover {
    color: rgb(50, 48, 47);
    background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.04) 0%,
      rgba(0, 0, 0, 0.04) 100%
    );
  }
`);
stylesheet.insertRule(css`
  .export-csv-button {
    display: inline-flex;
    background: rgb(255, 255, 255);
    border: 1px solid rgb(228, 226, 225);
    border-radius: 4.5em;
    font-size: 16px;
    padding-left: 1em;
    padding-right: 1em;
    font-family: "FuturaPT-Demi";
    font-weight: unset;
  }
`);

/**
 * Attaches button row to anchor element. Should be syncronous to avoid attaching row twice, because Mutex is not cool enough for JS?
 *
 * @param {PageInfo} pageInfo
 * @returns {void}
 */
function addButtons(pageInfo) {
  document.adoptedStyleSheets = [stylesheet];

  let buttonRow = document.createElement("div");
  buttonRow.id = exportCsvId;
  buttonRow.style.display = "flex";
  buttonRow.style.alignItems = "baseline";
  buttonRow.style.gap = "1em";
  buttonRow.style.marginLeft = "auto";

  let buttonRowText = document.createElement("span");
  buttonRowText.innerText = "Export Transactions as CSV:";
  buttonRow.appendChild(buttonRowText);

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
    let exportButton = document.createElement("button");
    exportButton.innerText = button.text;
    exportButton.className = "export-csv-button";
    exportButton.onclick = async () => {
      console.log("[csv-export] Fetching account details");
      let accountsInfo = await accountFinancials();
      let accountNicknames = accountsInfo.reduce((acc, v) => {
        acc[v.id] = v.nickname;
        return acc;
      }, {});

      let transactions = [];

      console.log("[csv-export] Fetching transactions");
      if (pageInfo.pageType === "account-details") {
        let pathParts = window.location.pathname.split("/");
        accountIds = [pathParts[3]];
        transactions = await activityList(accountIds, button.fromDate);
      } else if (pageInfo.pageType === "activity") {
        let params = new URLSearchParams(window.location.search);
        let ids_param = params.get("account_ids");
        if (ids_param) {
          accountIds = ids_param.split(",");
        } else {
          accountIds = accountsInfo.map((acc) => acc.id);
        }
        transactions = await activityFeedItems(accountIds, button.fromDate);
      }

      let blobs = await transactionsToCsvBlobs(transactions, accountNicknames);
      saveBlobsToFiles(blobs, accountsInfo, button.fromDate);
    };

    buttonRow.appendChild(exportButton);
  }

  let anchorParent = pageInfo.anchor.parentNode;
  anchorParent.insertBefore(buttonRow, pageInfo.anchor);
  anchorParent.style.gap = "1em";
  pageInfo.anchor.style.marginLeft = "0";

  let currencyToggle = anchorParent.querySelector(
    `div:has(> ul > li > button)`,
  );
  if (currencyToggle) {
    // NOTE: Patch to currency toggle, for some reason it sets width="100%", and it's ugly
    for (const s of document.styleSheets) {
      for (const r of s.rules) {
        if (
          currencyToggle.matches(r.selectorText) &&
          r.style.width === "100%"
        ) {
          currencyToggle.classList.remove(r.selectorText.substring(1));
        }
      }
    }
    // NOTE: Swap with currency toggle, just looks nicer
    buttonRow.parentNode.insertBefore(buttonRow, currencyToggle);
  }
}

/**
 * @typedef {Object} OauthCookie
 * @property {string} access_token
 * @property {string} identity_canonical_id
 */

/**
 * @returns {OauthCookie}
 */
function getOauthCookie() {
  let decodedCookie = decodeURIComponent(document.cookie).split(";");
  for (let cookieKV of decodedCookie) {
    if (cookieKV.indexOf("_oauth2_access_v2") !== -1) {
      let [_, val] = cookieKV.split("=");
      return JSON.parse(val);
    }
  }
  return null;
}

/**
 * Subset of ActivityFeedItem type in GraphQL API
 *
 * @typedef {Object} Transaction
 * @property {string} accountId
 * @property {string} externalCanonicalId
 * @property {string} amount
 * @property {string} amountSign
 * @property {string} occurredAt
 * @property {string} type
 * @property {string} subType
 * @property {string?} eTransferEmail
 * @property {string?} eTransferName
 * @property {string?} assetSymbol
 * @property {string?} assetQuantity
 * @property {string?} aftOriginatorName
 * @property {string?} aftTransactionCategory
 * @property {string?} opposingAccountId
 * @property {string?} spendMerchant
 * @property {string?} billPayCompanyName
 * @property {string?} billPayPayeeNickname
 */

const activityFeedItemFragment = `
  fragment Activity on ActivityFeedItem {
    accountId
    externalCanonicalId
    amount
    amountSign
    occurredAt
    type
    subType
    eTransferEmail
    eTransferName
    assetSymbol
    assetQuantity
    aftOriginatorName
    aftTransactionCategory
    aftTransactionType
    canonicalId
    currency
    identityId
    institutionName
    p2pHandle
    p2pMessage
    spendMerchant
    securityId
    billPayCompanyName
    billPayPayeeNickname
    redactedExternalAccountNumber
    opposingAccountId
    status
    strikePrice
    contractType
    expiryDate
    chequeNumber
    provisionalCreditAmount
    primaryBlocker
    interestRate
    frequency
    counterAssetSymbol
    rewardProgram
    counterPartyCurrency
    counterPartyCurrencyAmount
    counterPartyName
    fxRate
    fees
    reference
  }
`;

const fetchActivityListQuery = `
  query FetchActivityList(
    $first: Int!
    $cursor: Cursor
    $accountIds: [String!]
    $types: [ActivityFeedItemType!]
    $subTypes: [ActivityFeedItemSubType!]
    $endDate: Datetime
    $securityIds: [String]
    $startDate: Datetime
    $legacyStatuses: [String]
  ) {
    activities(
      first: $first
      after: $cursor
      accountIds: $accountIds
      types: $types
      subTypes: $subTypes
      endDate: $endDate
      securityIds: $securityIds
      startDate: $startDate
      legacyStatuses: $legacyStatuses
    ) {
      edges {
        node {
          ...Activity
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * API used by account specific activity view.
 * Seems like it's just outdated API, will use it just as safetyguard
 *
 * @returns {Promise<[Transaction]>}
 */
async function activityList(accountIds, startDate) {
  let transactions = [];
  let hasNextPage = true;
  let cursor = undefined;
  while (hasNextPage) {
    let respJson = await GM.xmlHttpRequest({
      url: "https://my.wealthsimple.com/graphql",
      method: "POST",
      responseType: "json",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${getOauthCookie().access_token}`,
      },
      data: JSON.stringify({
        operationName: "FetchActivityList",
        query: `
            ${fetchActivityListQuery}
            ${activityFeedItemFragment}
        `,
        variables: {
          first: 100,
          cursor,
          startDate,
          endDate: new Date().toISOString(),
          accountIds,
        },
      }),
    });

    if (respJson.status !== 200) {
      throw `Failed to fetch transactions: ${respJson.responseText}`;
    }
    let resp = JSON.parse(respJson.responseText);
    let activities = resp.data.activities;
    hasNextPage = activities.pageInfo.hasNextPage;
    cursor = activities.pageInfo.endCursor;
    transactions = transactions.concat(activities.edges.map((e) => e.node));
  }
  return transactions;
}

const fetchActivityFeedItemsQuery = `
  query FetchActivityFeedItems(
    $first: Int
    $cursor: Cursor
    $condition: ActivityCondition
    $orderBy: [ActivitiesOrderBy!] = OCCURRED_AT_DESC
  ) {
    activityFeedItems(
      first: $first
      after: $cursor
      condition: $condition
      orderBy: $orderBy
    ) {
      edges {
        node {
          ...Activity
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * API used by activity feed page.
 * @returns {Promise<[Transaction]>}
 */
async function activityFeedItems(accountIds, startDate) {
  let transactions = [];
  let hasNextPage = true;
  let cursor = undefined;
  while (hasNextPage) {
    let respJson = await GM.xmlHttpRequest({
      url: "https://my.wealthsimple.com/graphql",
      method: "POST",
      responseType: "json",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${getOauthCookie().access_token}`,
      },
      data: JSON.stringify({
        operationName: "FetchActivityFeedItems",
        query: `
            ${fetchActivityFeedItemsQuery}
            ${activityFeedItemFragment}
        `,
        variables: {
          first: 100,
          cursor,
          condition: {
            startDate,
            accountIds,
            unifiedStatuses: ["COMPLETED"],
          },
        },
      }),
    });

    if (respJson.status !== 200) {
      throw `Failed to fetch transactions: ${respJson.responseText}`;
    }
    let resp = JSON.parse(respJson.responseText);
    let activities = resp.data.activityFeedItems;
    hasNextPage = activities.pageInfo.hasNextPage;
    cursor = activities.pageInfo.endCursor;
    transactions = transactions.concat(activities.edges.map((e) => e.node));
  }
  return transactions;
}

const fetchAllAccountFinancialsQuery = `
  query FetchAllAccountFinancials(
    $identityId: ID!
    $pageSize: Int = 25
    $cursor: String
  ) {
    identity(id: $identityId) {
      id
      accounts(filter: {}, first: $pageSize, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            ...Account
          }
        }
      }
    }
  }

  fragment Account on Account {
    id
    unifiedAccountType
    nickname
  }
`;

/**
 * @typedef {Object} AccountInfo
 * @property {string} id
 * @property {string} nickname
 */

/**
 * Query all accounts
 * @returns {Promise<[AccountInfo]>}
 */
async function accountFinancials() {
  let oauthCookie = getOauthCookie();
  let respJson = await GM.xmlHttpRequest({
    url: "https://my.wealthsimple.com/graphql",
    method: "POST",
    responseType: "json",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${oauthCookie.access_token}`,
    },
    data: JSON.stringify({
      operationName: "FetchAllAccountFinancials",
      query: fetchAllAccountFinancialsQuery,
      variables: {
        identityId: oauthCookie.identity_canonical_id,
        pageSize: 25,
      },
    }),
  });

  if (respJson.status !== 200) {
    throw `Failed to fetch account info: ${respJson.responseText}`;
  }
  let resp = JSON.parse(respJson.responseText);
  const self_directed_re = /^SELF_DIRECTED_(?<name>.*)/;
  let accounts = resp.data.identity.accounts.edges.map((e) => {
    let nickname = e.node.nickname;
    if (!nickname) {
      if (e.node.unifiedAccountType === "CASH") {
        nickname = "Cash";
      } else if (self_directed_re.test(e.node.unifiedAccountType)) {
        let found = e.node.unifiedAccountType.match(self_directed_re);
        nickname = found.groups.name;
        if (nickname === "CRYPTO") {
          nickname = "Crypto";
        } else if (nickname === "NON_REGISTERED") {
          nickname = "Non-registered";
        }
      } else {
        nickname = "Unknown";
      }
    }
    return {
      id: e.node.id,
      nickname,
    };
  });
  return accounts;
}

/**
 * @typedef {Object} TransferInfo
 * @property {string} id
 * @property {string} status
 * @property {{"bankAccount": BankInfo}} source
 * @property {{"bankAccount": BankInfo}} destination
 */

/**
 * @typedef {Object} BankInfo
 * @property {string} accountName
 * @property {string} accountNumber
 * @property {string} institutionName
 * @property {string} nickname
 */

const fetchFundsTransferQuery = `
  query FetchFundsTransfer($id: ID!) {
    fundsTransfer: funds_transfer(id: $id, include_cancelled: true) {
      id
      status
      source {
        ...BankAccountOwner
      }
      destination {
        ...BankAccountOwner
      }
    }
  }

  fragment BankAccountOwner on BankAccountOwner {
    bankAccount: bank_account {
      id
      institutionName: institution_name
      nickname
      ...CaBankAccount
      ...UsBankAccount
    }
  }

  fragment CaBankAccount on CaBankAccount {
    accountName: account_name
    accountNumber: account_number
  }

  fragment UsBankAccount on UsBankAccount {
    accountName: account_name
    accountNumber: account_number
  }
`;

/**
 * @param {string} transferId
 * @returns {Promise<TransferInfo>}
 */
async function fundsTransfer(transferId) {
  let respJson = await GM.xmlHttpRequest({
    url: "https://my.wealthsimple.com/graphql",
    method: "POST",
    responseType: "json",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${getOauthCookie().access_token}`,
    },
    data: JSON.stringify({
      operationName: "FetchFundsTransfer",
      query: fetchFundsTransferQuery,
      variables: {
        id: transferId,
      },
    }),
  });

  if (respJson.status !== 200) {
    throw `Failed to fetch transfer info: ${respJson.responseText}`;
  }
  let resp = JSON.parse(respJson.responseText);
  return resp.data.fundsTransfer;
}

/**
 * @param {[Transaction]} transactions
 * @param {{[string]: string}} accountNicknames
 * @returns {Promise<{[string]: Blob}>}
 */
async function transactionsToCsvBlobs(transactions, accountNicknames) {
  let accTransactions = transactions.reduce((acc, transaction) => {
    const id = transaction.accountId;
    (acc[id] = acc[id] || []).push(transaction);
    return acc;
  }, {});
  let accBlobs = {};
  for (let acc in accTransactions) {
    accBlobs[acc] = await accountTransactionsToCsvBlob(
      accTransactions[acc],
      accountNicknames,
    );
  }
  return accBlobs;
}

/**
 * @param {[Transaction]} transactions
 * @param {{[string]: string}} accountNicknames
 * @returns {Promise<Blob>}
 */
async function accountTransactionsToCsvBlob(transactions, accountNicknames) {
  let csv = `"Date","Payee","Notes","Category","Amount"\n`;
  for (const transaction of transactions) {
    let date = new Date(transaction.occurredAt);
    // JS Date type is absolutly horible, I hope Temporal API will be better
    let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    let payee = null;
    let notes = null;
    let type = transaction.type;
    if (transaction.subType) {
      type = `${type}/${transaction.subType}`;
    }

    // Most transactions in Wealthsimple don't have category, skipping
    let category = "";

    switch (type) {
      case "INTEREST": {
        payee = "Wealthsimple";
        notes = "Interest";
        break;
      }
      case "INTEREST/FPL_INTEREST": {
        payee = "Wealthsimple";
        notes = `Interest`;
        break;
      }
      case "REIMBURSEMENT/ATM": {
        payee = "Wealthsimple";
        notes = `ATM Reimbursement`;
        break;
      }
      case "P2P_PAYMENT/SEND": {
        payee = transaction.p2pHandle;
        notes = `ATM Reimbursement`;
        break;
      }
      case "DEPOSIT/E_TRANSFER": {
        payee = transaction.eTransferEmail;
        notes = `INTERAC e-Transfer from ${transaction.eTransferName}`;
        break;
      }
      case "WITHDRAWAL/E_TRANSFER": {
        payee = transaction.eTransferEmail;
        notes = `INTERAC e-Transfer to ${transaction.eTransferName}`;
        break;
      }
      case "DIVIDEND/DIY_DIVIDEND": {
        payee = transaction.assetSymbol;
        notes = `Received dividend from ${transaction.assetSymbol}`;
        break;
      }

      /*
       * Stock Transactions
       */
      case "DIY_BUY/DIVIDEND_REINVESTMENT": {
        payee = transaction.assetSymbol;
        notes = `Reinvested dividend into ${transaction.assetQuantity} ${transaction.assetSymbol}`;
        break;
      }
      case "DIY_BUY/MARKET_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol}`;
        break;
      }
      case "DIY_BUY/RECURRING_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol} using recurring order`;
        break;
      }
      case "DIY_BUY/LIMIT_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol} using limit order`;
        break;
      }
      case "DIY_BUY/FRACTIONAL_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol} using fractional order`;
        break;
      }
      case "DIY_SELL/MARKET_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Sold ${transaction.assetQuantity} ${transaction.assetSymbol} using market order`;
        break;
      }
      case "DIY_SELL/LIMIT_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Sold ${transaction.assetQuantity} ${transaction.assetSymbol} using limit order`;
        break;
      }
      case "DIY_SELL/FRACTIONAL_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Sold ${transaction.assetQuantity} ${transaction.assetSymbol} using fractional order`;
        break;
      }

      /*
       * Crypto Transactions
       */
      case "CRYPTO_BUY/MARKET_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol}`;
        break;
      }
      case "CRYPTO_BUY/RECURRING_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol} using recurring order`;
        break;
      }
      case "CRYPTO_BUY/LIMIT_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol} using limit order`;
        break;
      }
      case "CRYPTO_BUY/FRACTIONAL_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Bought ${transaction.assetQuantity} ${transaction.assetSymbol} using fractional order`;
        break;
      }
      case "CRYPTO_SELL/MARKET_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Sold ${transaction.assetQuantity} ${transaction.assetSymbol} using market order`;
        break;
      }
      case "CRYPTO_SELL/LIMIT_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Sold ${transaction.assetQuantity} ${transaction.assetSymbol} using limit order`;
        break;
      }
      case "CRYPTO_SELL/FRACTIONAL_ORDER": {
        payee = transaction.assetSymbol;
        notes = `Sold ${transaction.assetQuantity} ${transaction.assetSymbol} using fractional order`;
        break;
      }

      case "DEPOSIT/AFT": {
        payee = transaction.aftOriginatorName;
        notes = `Direct deposit from ${transaction.aftOriginatorName}`;
        category = transaction.aftTransactionCategory;
        break;
      }
      case "WITHDRAWAL/AFT": {
        payee = transaction.aftOriginatorName;
        notes = `Direct deposit to ${transaction.aftOriginatorName}`;
        category = transaction.aftTransactionCategory;
        break;
      }
      case "DEPOSIT/EFT": {
        let info = await fundsTransfer(transaction.externalCanonicalId);
        let bankInfo = info?.source?.bankAccount;
        if (!bankInfo) {
          console.error(
            "[csv-export] bankInfo was undefined in EFT withdraw:",
            transaction,
          );
          continue;
        }
        payee = `${bankInfo.institutionName} ${bankInfo.nickname || bankInfo.accountName} ${bankInfo.accountNumber || ""}`;
        notes = `Direct deposit from ${payee}`;
        break;
      }
      case "WITHDRAWAL/EFT": {
        let info = await fundsTransfer(transaction.externalCanonicalId);
        let bankInfo = info?.source?.bankAccount;
        if (!bankInfo) {
          console.error(
            "[csv-export] bankInfo was undefined in EFT withdraw:",
            transaction,
          );
          continue;
        }
        payee = `${bankInfo.institutionName} ${bankInfo.nickname || bankInfo.accountName} ${bankInfo.accountNumber || ""}`;
        notes = `Direct deposit to ${payee}`;
        break;
      }
      case "INTERNAL_TRANSFER/SOURCE": {
        payee = accountNicknames[transaction.opposingAccountId];
        notes = `Internal transfer to ${payee}`;
        break;
      }
      case "INTERNAL_TRANSFER/DESTINATION": {
        payee = accountNicknames[transaction.opposingAccountId];
        notes = `Internal transfer from ${payee}`;
        break;
      }
      case "SPEND/PREPAID": {
        payee = transaction.spendMerchant;
        notes = `Prepaid to ${payee}`;
        break;
      }
      case "WITHDRAWAL/BILL_PAY": {
        payee = transaction.billPayPayeeNickname;
        notes = `Bill payment to ${transaction.billPayCompanyName}`;
        category = "bill";
        break;
      }
      default: {
        console.error(
          `[csv-export] ${dateStr} transaction [${type}] has unexpected type, skipping it. Please report on greasyfork.org for assistanse.`,
        );
        console.log(transaction);
        continue;
      }
    }

    let amount = transaction.amount;
    if (transaction.amountSign === "negative") {
      amount = `-${amount}`;
    }

    let entry = `"${dateStr}","${payee}","${notes}","${category}","${amount}"`;
    csv += `${entry}\n`;
  }

  // Signals to some apps that file encoded with UTF-8
  const BOM = "\uFEFF";
  return new Blob([BOM, csv], { type: "text/csv;charset=utf-8" });
}

/**
 * @param {{[string]: Blob}} accountBlobs
 * @param {[AccountInfo]} accountsInfo
 * @param {Date?} fromDate
 */
function saveBlobsToFiles(accountBlobs, accountsInfo, fromDate) {
  let accToName = accountsInfo.reduce((accum, info) => {
    accum[info.id] = info.nickname;
    return accum;
  }, {});

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
    link.download = `Wealthsimple ${accToName[acc]} Transactions ${timeFrame}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }
}
