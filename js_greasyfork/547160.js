// ==UserScript==
// @name         Venmo CSV Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1
// @description  Automatically download CSV statements from Venmo
// @match        https://*.venmo.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547160/Venmo%20CSV%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547160/Venmo%20CSV%20Statement%20Downloader.meta.js
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
function formatDateYYYYdMMdDD(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
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

// src/venmo/lib.ts
var BANK_ID = "venmo";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
async function addDownloadButton() {
  const logoButton = await getElement("a[class^='vLogoButton']", POLL_INTERVAL);
  const parent = logoButton.parentElement;
  if (!parent)
    return;
  const CLASS = "my-download-btn";
  if (parent.querySelector(`.${CLASS}`))
    return;
  const btn = document.createElement("button");
  btn.textContent = "Download CSV";
  btn.className = CLASS;
  btn.style.cssText = `
            padding: 8px 8px;
            margin: 8px 4px 8px 4px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: fit-content;
        `;
  parent.insertBefore(btn, logoButton.nextSibling);
  btn.addEventListener("click", async () => {
    try {
      await fireDownloadProcess();
    } catch (err) {
      console.error(`[${BANK_ID} Downloader] Error:`, err);
    }
  });
}
async function fireDownloadProcess() {
  const script = Array.from(document.querySelectorAll("script[src^='/_next/static/']")).find((el) => el instanceof HTMLScriptElement && el.src.endsWith("_buildManifest.js"));
  const next_id = script ? script.src.split("/")[5] : null;
  const profileId = await getWindowProperty((w) => w.__NEXT_DATA__?.props?.pageProps?.initialMobxState?.profileStore?.id, POLL_INTERVAL);
  console.log(`Profile ID: ${profileId}`);
  const [content, endDate] = await routine(profileId, next_id);
  await easyDownload({
    content,
    name: `${BANK_ID}_${profileId}_${endDate}_YTD.csv`,
    saveAs: true
  });
}
async function routine(profileId, next_id) {
  const [startDate, endDate] = getDateRange(new Date);
  const eStr = formatDateYYYYMMDD(endDate);
  const payload = new URLSearchParams;
  const year = new Date(endDate).getFullYear();
  payload.append("csv", "true");
  payload.append("profileId", profileId);
  payload.append("accountType", "personal");
  payload.append("referer", encodeURIComponent(`/statement?accountType=personal&month=${new Date(endDate).getMonth() + 1}&profileId=${profileId}&year=${year}`));
  payload.append("startDate", formatDateYYYYdMMdDD(startDate));
  payload.append("endDate", formatDateYYYYdMMdDD(endDate));
  payload.append("catchAll", "api");
  payload.append("catchAll", "statement");
  payload.append("catchAll", "download");
  console.log(`Payload:`, payload.toString());
  const response = await easyRequest({
    url: `https://account.venmo.com/_next/data/${next_id}/api/statement/download.json`,
    method: "GET",
    payload,
    headers: {}
  });
  return [response, eStr];
}

// src/venmo/index.ts
try {
  addDownloadButton();
  const observer = new MutationObserver(addDownloadButton);
  observer.observe(document.body, { childList: true, subtree: true });
} catch (err) {
  console.error("[Venmo Downloader] Error:", err);
}


})();
