// ==UserScript==
// @name         Fidelity CSV Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1
// @description  Automatically download CSV statements from Fidelity
// @match        https://*.fidelity.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547162/Fidelity%20CSV%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547162/Fidelity%20CSV%20Statement%20Downloader.meta.js
// ==/UserScript==
(function () {
'use strict';

// src/common.ts
async function getElement(selector, POLL_INTERVAL) {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      let el;
      if (typeof selector === "string") {
        el = document.querySelector(selector);
      } else {
        el = Array.from(selector).map((s) => document.querySelector(s)).find(Boolean);
      }
      if (el) {
        clearInterval(check);
        resolve(el);
      }
    }, POLL_INTERVAL);
  });
}
async function getWindowProperty(property, POLL_INTERVAL) {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      const el = property(window.unsafeWindow);
      if (el) {
        clearInterval(check);
        resolve(el);
      }
    }, POLL_INTERVAL);
  });
}
function formatDateYYYYMMDD(date) {
  return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
}
function getDateRange(today, endOnBusiness = false) {
  let date = new Date(today);
  if (endOnBusiness) {
    if (date.getDay() === 0) {
      date.setDate(date.getDate() - 2);
    } else if (date.getDay() === 6) {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() - 1);
      if (date.getDay() === 0) {
        date.setDate(date.getDate() - 2);
      } else if (date.getDay() === 6) {
        date.setDate(date.getDate() - 1);
      }
    }
  }
  let start;
  if (date.getMonth() >= 2) {
    start = new Date(date.getFullYear(), 0, 1);
  } else {
    start = new Date(date.getFullYear() - 1, 6, 1);
  }
  return [start, date];
}
function GM_xmlhttpRequest_promise(pack) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({ ...pack, onload: resolve, onerror: reject });
  });
}
async function easyRequest({ url, method, payload, headers }) {
  function helper() {
    if (method === "GET") {
      const U = new URL(url);
      payload?.forEach((value, key) => U.searchParams.append(decodeURIComponent(key), decodeURIComponent(value)));
      return GM_xmlhttpRequest_promise({ method: "GET", url: U.toString(), headers });
    } else if (method === "POST.url") {
      return GM_xmlhttpRequest_promise({
        method: "POST",
        url,
        data: payload?.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded", ...headers }
      });
    } else if (method === "POST.form") {
      const formData = new FormData;
      payload?.forEach((value, key) => formData.append(decodeURIComponent(key), decodeURIComponent(value)));
      return GM_xmlhttpRequest_promise({ method: "POST", url, data: formData, headers });
    } else if (method === "POST.json") {
      const _headers = new Map(Object.entries(headers || {}));
      if (!(_headers.get("Content-Type") || _headers.has("content-type"))) {
        _headers.set("Content-Type", "application/json");
      }
      return GM_xmlhttpRequest_promise({
        method: "POST",
        url,
        data: JSON.stringify(payload),
        headers: Object.fromEntries(_headers)
      });
    }
    throw new Error(`Unsupported method: ${method}`);
  }
  const { status, responseText } = await helper();
  if (status !== 200) {
    throw new Error(`Request failed: ${status} ${responseText}`);
  }
  return responseText;
}
async function easyDownload({ content, name, saveAs = true }) {
  let type;
  if (name.endsWith(".qfx"))
    type = "application/x-qfx";
  else if (name.endsWith(".csv"))
    type = "text/csv";
  else
    type = "application/octet-stream";
  await GM_download_promise({
    url: URL.createObjectURL(new Blob([content.trim()], { type })),
    name,
    saveAs
  });
}
function GM_download_promise(option) {
  const { url, name, saveAs } = option;
  return new Promise((resolve, reject) => {
    GM_download({ url, name, saveAs, onload: resolve, onerror: reject });
  });
}

// src/fidelity/lib.ts
var BANK_ID = "fidelity";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
var cachedRequest = [];
async function hookGraphQL() {
  const unsafeWindow = await getWindowProperty((w) => w, POLL_INTERVAL);
  const origFetch = unsafeWindow.fetch;
  unsafeWindow.fetch = async (...args) => {
    const response = await origFetch(...args);
    const cloned = response.clone();
    cloned.json().then((text) => {
      if (typeof args[0] === "string" && args[0].includes("/ftgw/digital/webactivity/api/graphql") && JSON.parse(args[1]?.body?.toString() || "{}").operationName === "getTransactions") {
        cachedRequest.length = 0;
        const { headers, body } = args[1] || {};
        if (!headers || headers["downloader"] === undefined) {
          cachedRequest.push([args[0], headers, body?.toString()]);
          console.log(`${LOGGER_prefix} Hooked graphql query:`, args, text);
        }
      }
    });
    return response;
  };
}
async function addDownloadButton() {
  const container = (await getElement("#activity-order-search-bar-input", POLL_INTERVAL)).parentNode?.parentNode?.parentNode;
  const CLASS = "my-download-btn";
  if (container?.querySelector(`.${CLASS}`))
    return;
  const btn = document.createElement("button");
  btn.textContent = "Download CSV";
  btn.className = CLASS;
  btn.style.cssText = `
            padding: 4px 4px;
            margin: 0px 4px 0px 4px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: fit-content;
        `;
  btn.addEventListener("click", async () => {
    try {
      await fireDownloadProcess();
    } catch (err) {
      console.error(`[${BANK_ID} Downloader] Error:`, err);
    }
  });
  container?.appendChild(btn);
}
function generate_csv(data) {
  const header = "Run Date,Account,Account Number,Action,Symbol,Description,Type,Quantity,Price ($),Commission ($),Fees ($),Accrued Interest ($),Amount ($),Settlement Date";
  const csvData = {};
  for (const history of JSON.parse(data).data.getTransactions.historys) {
    const acctNum = history.acctNum;
    if (!csvData[acctNum]) {
      csvData[acctNum] = [header];
    }
    csvData[acctNum].push(history.brokCsvData);
  }
  return csvData;
}
async function fireDownloadProcess() {
  const [content, endDate] = await routine();
  const csv = generate_csv(content);
  for (const [account_id, rows] of Object.entries(csv)) {
    await easyDownload({
      content: rows.join(`
`),
      name: `${BANK_ID}_${account_id}_${endDate}_YTD.csv`,
      saveAs: true
    });
  }
}
async function routine() {
  const [startDate, endDate] = getDateRange(new Date, true);
  const eStr = formatDateYYYYMMDD(endDate);
  const searchCriteriaDetail = {
    acctHistSort: "DATE",
    hasBasketName: true,
    histSortDir: "D",
    timePeriod: 90,
    txnCat: null,
    txnFromDate: Math.round(startDate.getTime() / 1000).toString(),
    txnToDate: Math.round(endDate.getTime() / 1000).toString(),
    viewType: "NON_CORE"
  };
  if (cachedRequest.length == 0) {
    console.error(`${LOGGER_prefix} No cached request found`);
    throw new Error("No cached request found");
  }
  const [url, headers, body] = cachedRequest[0];
  const payload = JSON.parse(body);
  payload["variables"]["searchCriteriaDetail"] = searchCriteriaDetail;
  const response = await easyRequest({
    url,
    method: "POST.json",
    payload,
    headers: { ...headers, downloader: "true" }
  });
  return [response, eStr];
}

// src/fidelity/index.ts
try {
  addDownloadButton();
  hookGraphQL();
  const observer = new MutationObserver(addDownloadButton);
  observer.observe(document.body, { childList: true, subtree: true });
} catch (err) {
  console.error("[Fidelity Downloader] Error:", err);
}


})();
