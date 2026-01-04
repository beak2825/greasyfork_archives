// ==UserScript==
// @name         Discover CSV Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1
// @description  Automatically download CSV statements from Discover
// @match        https://*.discover.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547157/Discover%20CSV%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547157/Discover%20CSV%20Statement%20Downloader.meta.js
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

// src/discover/lib.ts
var BANK_ID = "discover";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
async function addDownloadButton() {
  const container = await getElement("#print-container", POLL_INTERVAL);
  const CLASS = "my-download-btn";
  if (container.querySelector(`.${CLASS}`))
    return;
  const btn = document.createElement("button");
  btn.textContent = "Download CSV";
  btn.className = CLASS;
  btn.style.cssText = `
            padding: 4px 4px;
            margin: 12px 12px 0px 0px;
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
  container.insertBefore(btn, container.firstChild);
}
async function fireDownloadProcess() {
  const accountName = (await getElement(".account-name", POLL_INTERVAL)).textContent;
  const last_four = await getElement(".last-four-digits", POLL_INTERVAL);
  const lastFourDigits = (last_four.textContent || "").replace(/\D/g, "");
  console.log(`Account name: ${accountName}, Last four digits: ${lastFourDigits}`);
  const [content, endDate] = await routine();
  await easyDownload({
    content,
    name: `${BANK_ID}_${trimAccountName(accountName)}_${lastFourDigits}_${endDate}_12mo.csv`,
    saveAs: true
  });
}
async function routine() {
  const payload = new URLSearchParams;
  const [startDate, endDate] = getDateRange(new Date);
  const eStr = formatDateYYYYMMDD(endDate);
  payload.append("date", "all");
  payload.append("sortColumn", "trans_date");
  payload.append("grouping", "-1");
  payload.append("printView", "false");
  payload.append("sortOrder", "Y");
  payload.append("transaction", "-1");
  payload.append("printOption", "transactions");
  payload.append("way", "actvt");
  payload.append("includePend", "Y");
  payload.append("outputFormat", "csv");
  const response = await easyRequest({
    url: "https://card.discover.com/cardmembersvcs/statements/app/stmt.download",
    method: "GET",
    payload,
    headers: {}
  });
  return [response, eStr];
}

// src/discover/index.ts
try {
  addDownloadButton();
  const observer = new MutationObserver(addDownloadButton);
  observer.observe(document.body, { childList: true, subtree: true });
} catch (err) {
  console.error("[Discover Downloader] Error:", err);
}


})();
