// ==UserScript==
// @name         Amex QFX Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1.1
// @description  Automatically download QFX statements from Amex
// @match        https://*.americanexpress.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545351/Amex%20QFX%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545351/Amex%20QFX%20Statement%20Downloader.meta.js
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
function formatDateYYYYdMMdDD(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
function GM_xmlhttpRequest_promise(pack) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({ ...pack, onload: resolve, onerror: reject });
  });
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

// src/amex/lib.ts
var BANK_ID = "amex";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
async function addDownloadButton() {
  const container = await getElement(["div.DynamicLayout"], POLL_INTERVAL);
  const CLASS = "my-download-btn";
  if (container.querySelector(`.${CLASS}`))
    return;
  const btn = document.createElement("button");
  btn.textContent = "Download QFX";
  btn.className = CLASS;
  btn.style.cssText = `
            padding: 8px 12px;
            margin: 0px 0px 12px 0px;
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
  const a = document.querySelector('a[title="Download your Statements"]');
  if (!a || !a.href) {
    console.error(`${LOGGER_prefix} Failed to find download link`);
    return;
  }
  const url = a.href;
  const match = url.match(/[?&]account_key=([^&]+)/);
  if (!match || match.length < 2 || !match[1]) {
    console.error(`${LOGGER_prefix} Failed to extract account_key`);
    return;
  }
  const accountKey = match[1];
  console.log(`${LOGGER_prefix} Extracted account_key:`, accountKey);
  const [payload, endDate] = await buildPayload(accountKey);
  const U = new URL("https://global.americanexpress.com/api/servicing/v1/financials/documents");
  payload?.forEach((value, key) => U.searchParams.append(decodeURIComponent(key), decodeURIComponent(value)));
  const { status, responseText: content } = await GM_xmlhttpRequest_promise({
    method: "GET",
    url: U.toString() + "&=",
    headers: {}
  });
  if (status !== 200) {
    throw new Error(`Request failed: ${status} ${content}`);
  }
  const acctIdMatch = content.match(/<ACCTID>(.*?)<\/ACCTID>/);
  if (!acctIdMatch || acctIdMatch.length < 2 || !acctIdMatch[1]) {
    console.error(`${LOGGER_prefix} Failed to extract ACCTID`);
    return;
  }
  let acctId = acctIdMatch[1].replace(/[^a-zA-Z0-9]/g, "");
  console.log(`${LOGGER_prefix} Extracted ACCTID:`, acctId);
  await easyDownload({
    content,
    name: `${BANK_ID}_${acctId}_${endDate}_80.qfx`,
    saveAs: true
  });
}
async function buildPayload(accountKey) {
  const payload = new URLSearchParams;
  const endDate = new Date;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 80);
  const eStr = formatDateYYYYdMMdDD(endDate);
  payload.append("end_date", eStr);
  payload.append("start_date", formatDateYYYYdMMdDD(startDate));
  payload.append("file_format", "quicken");
  payload.append("limit", "3000");
  payload.append("status", "posted");
  payload.append("account_key", accountKey);
  payload.append("client_id", "AmexAPI");
  return [payload, eStr];
}

// src/amex/index.ts
try {
  addDownloadButton();
  const observer = new MutationObserver(addDownloadButton);
  observer.observe(document.body, { childList: true, subtree: true });
} catch (err) {
  console.error("[Amex Downloader] Error:", err);
}


})();
