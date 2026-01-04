// ==UserScript==
// @name         Chase QFX Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1.1
// @description  Automatically download QFX statements from Chase
// @match        https://*.chase.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545350/Chase%20QFX%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545350/Chase%20QFX%20Statement%20Downloader.meta.js
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
async function getByPoll(property, POLL_INTERVAL) {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      const el = property();
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
function trimAccountName(name) {
  return name.trim().replace(/[\s-.]+/g, "").replace(/[\u2122\u00AE\u00A9]/g, "");
}

// src/chase/lib.ts
var BANK_ID = "chase";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
async function addDownloadButton() {
  const container = await getElement("#navigation", POLL_INTERVAL);
  const CLASS = "my-download-btn";
  if (container.querySelector(`.${CLASS}`))
    return;
  const btn = document.createElement("button");
  btn.textContent = "Download QFX";
  btn.className = CLASS;
  btn.style.cssText = `
            padding: 8px 12px;
            margin: 12px 0px 0px 0px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: fit-content;
        `;
  btn.addEventListener("click", async () => {
    location.hash = "#/dashboard/accountDetails/downloadAccountTransactions/index";
    try {
      await fireDownloadProcess();
    } catch (err) {
      console.error(`[${BANK_ID} Downloader] Error:`, err);
    }
  });
  container.insertBefore(btn, container.firstChild);
}
async function fireDownloadProcess() {
  const requirejs = await getWindowProperty((window2) => window2.requirejs, POLL_INTERVAL);
  const sessionCache = await getByPoll(() => requirejs("blue-app/cache/sessionCache"), POLL_INTERVAL);
  const tokenList = await getByPoll(() => sessionCache.get("service-/svc/rl/accounts/secure/v1/csrf/token/list"), POLL_INTERVAL);
  const token = tokenList.response.csrfToken;
  const response = await easyRequest({
    url: "https://secure.chase.com/svc/rr/accounts/secure/v1/account/activity/download/options/list",
    method: "POST.url",
    headers: {
      "x-jpmc-csrf-token": "NONE",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  });
  for (const account of JSON.parse(response)["downloadAccountActivityOptions"]) {
    console.log(`${LOGGER_prefix} Processing account:`, account);
    const { accountId, summaryType, nickName, mask } = account;
    const routine = summaryType == "DDA" ? DDARoutine : CardRoutine;
    const [content, endDate] = await routine(accountId, token);
    await easyDownload({
      content,
      name: `${BANK_ID}_${trimAccountName(nickName)}_${mask}_${endDate}_YTD.qfx`,
      saveAs: true
    });
  }
}
async function DDARoutine(accountId, csrftoken) {
  const payload = new URLSearchParams;
  const [startDate, endDate] = getDateRange(new Date);
  const eStr = formatDateYYYYMMDD(endDate);
  payload.append("dateHi", eStr);
  payload.append("dateLo", formatDateYYYYMMDD(startDate));
  payload.append("statementPeriodId", "ALL");
  payload.append("transactionType", "ALL");
  payload.append("filterTranType", "ALL");
  payload.append("downloadType", "QFX");
  payload.append("accountId", accountId);
  payload.append("csrftoken", csrftoken);
  payload.append("submit", "Submit");
  const response = await easyRequest({
    url: "https://secure.chase.com/svc/rr/accounts/secure/v1/account/activity/download/dda/list",
    method: "POST.url",
    payload,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return [response, eStr];
}
async function CardRoutine(accountId, csrftoken) {
  const payload = new URLSearchParams;
  const [startDate, endDate] = getDateRange(new Date);
  payload.append("end-date", formatDateYYYYMMDD(endDate));
  payload.append("start-date", formatDateYYYYMMDD(startDate));
  payload.append("account-activity-download-type-code", "QFX");
  payload.append("digital-account-identifier", accountId);
  payload.append("csrftoken", csrftoken);
  payload.append("submit", "Submit");
  const response = await easyRequest({
    url: "https://secure.chase.com/svc/rr/accounts/secure/gateway/credit-card/transactions/inquiry-maintenance/digital-transaction-activity/v1/transaction-activities",
    method: "GET",
    payload
  });
  return [response, formatDateYYYYMMDD(endDate)];
}

// src/chase/index.ts
try {
  addDownloadButton();
  const observer = new MutationObserver(addDownloadButton);
  observer.observe(document.body, { childList: true, subtree: true });
} catch (err) {
  console.error("[Chase Downloader] Error:", err);
}


})();
