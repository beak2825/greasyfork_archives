// ==UserScript==
// @name         BOA QFX Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1
// @description  Automatically download QFX statements from BOA
// @match        https://*.bankofamerica.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545319/BOA%20QFX%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545319/BOA%20QFX%20Statement%20Downloader.meta.js
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
function formatDateMMsDDsYYYY(date) {
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
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

// src/boa/lib.ts
var BANK_ID = "boa";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
async function fireDownloadProcess(btn) {
  btn.click();
  await getElement("#downloadTxnForm", POLL_INTERVAL);
  console.log(`${LOGGER_prefix} Form detected, starting download...`);
  const token = getAccountToken();
  const [payload, endDate] = buildPayload(token);
  const accountName = getAccountName();
  const content = await easyRequest({
    method: "POST.url",
    url: "https://secure.bankofamerica.com/ogateway/addapi/v1/download/form/transaction",
    payload,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  await easyDownload({
    content,
    name: `${BANK_ID}_${accountName}_${endDate}_YTD.qfx`,
    saveAs: true
  });
  console.log(`${LOGGER_prefix} File download`);
}
function getAccountToken() {
  const form = document.querySelector("#downloadTxnForm");
  if (!form)
    throw new Error("Form not found");
  const tokenInput = form.querySelector('input[name="payload.accountToken"]');
  if (!tokenInput)
    throw new Error("Account token input not found");
  return tokenInput.value;
}
function buildPayload(token) {
  const payload = new URLSearchParams;
  const [startDate, endDate] = getDateRange(new Date, true);
  payload.append("payload.accountToken", token);
  payload.append("payload.locale", "en-us");
  payload.append("payload.txnSearchCriteria.txnPeriod", "custom range");
  payload.append("payload.txnSearchCriteria.startDate", formatDateMMsDDsYYYY(startDate));
  payload.append("payload.txnSearchCriteria.endDate", formatDateMMsDDsYYYY(endDate));
  payload.append("payload.txnSearchCriteria.fileType", "qfx");
  return [payload, formatDateMMsDDsYYYY(endDate)];
}
function getRawAccountName() {
  const el = document.querySelector("#account-displayname-label");
  if (!el)
    return "account";
  return el.textContent;
}
function getAccountName() {
  return trimAccountName(getRawAccountName());
}
async function injectButton() {
  const btn = await getElement("#download-transactions", POLL_INTERVAL);
  const qfxBtn = document.createElement("button");
  qfxBtn.textContent = "QFX";
  qfxBtn.style.cssText = "padding:3px 8px;margin:0px 0px 0px 4px;background:#0066cc;color:#fff;border:none;border-radius:4px;cursor:pointer;";
  qfxBtn.addEventListener("click", () => {
    try {
      fireDownloadProcess(btn);
    } catch (err) {
      console.error(`${LOGGER_prefix} Error:`, err);
    }
  });
  btn.parentElement?.insertBefore(qfxBtn, btn.nextSibling);
}

// src/boa/index.ts
try {
  injectButton();
} catch (err) {
  console.error("[BOA Downloader] Error:", err);
}


})();
