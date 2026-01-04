// ==UserScript==
// @name         WF QFX Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1
// @description  Automatically download QFX statements from WF
// @match        https://*.wellsfargo.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545328/WF%20QFX%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545328/WF%20QFX%20Statement%20Downloader.meta.js
// ==/UserScript==
(function () {
'use strict';

// src/common.ts
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

// src/wf/lib.ts
var BANK_ID = "wf";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
async function fireDownloadProcess() {
  const urls = await getWindowProperty((window2) => window2._wfPayload?.applicationData?.downloadAccountActivity?.urls, POLL_INTERVAL);
  const accounts = await getWindowProperty((window2) => window2._wfPayload?.applicationData?.downloadAccountActivity?.downloadAccountInfo?.allEligibleAccounts, POLL_INTERVAL);
  for (let i = 0;i < Math.min(urls.length, accounts.length); i++) {
    const urlObject = urls[i];
    const accountObject = accounts[i];
    console.log(`${LOGGER_prefix} Pair ${i}:`, { url: urlObject, account: accountObject });
    const url = urlObject["url"];
    const accountName = accountObject["displayName"];
    const accountId = accountObject["id"];
    const [payload, endDate] = await routine(accountId);
    const content = await easyRequest({
      method: "POST.form",
      url: `https://connect.secure.wellsfargo.com/services${url}`,
      payload
    });
    await easyDownload({
      content,
      name: `${BANK_ID}_${trimAccountName(accountName)}_${endDate}_YTD.qfx`,
      saveAs: true
    });
    console.log(`${LOGGER_prefix} File download`);
  }
}
async function routine(accountId) {
  const payload = new URLSearchParams;
  const [startDate, endDate] = getDateRange(new Date);
  payload.append("accountId", accountId);
  payload.append("fromDate", formatDateMMsDDsYYYY(startDate));
  payload.append("toDate", formatDateMMsDDsYYYY(endDate));
  payload.append("fileFormat", "quicken");
  return [payload, formatDateMMsDDsYYYY(endDate)];
}

// src/wf/index.ts
try {
  fireDownloadProcess();
} catch (err) {
  console.error("[WF Downloader] Error:", err);
}


})();
