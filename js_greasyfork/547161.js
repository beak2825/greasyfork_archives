// ==UserScript==
// @name         Sofi CSV Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1
// @description  Automatically download CSV statements from Sofi
// @match        https://*.sofi.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547161/Sofi%20CSV%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547161/Sofi%20CSV%20Statement%20Downloader.meta.js
// ==/UserScript==
(function () {
'use strict';

// src/common.ts
function formatDateYYYYdMMdDD(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
function formatDateYYYYMMDD(date) {
  return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
}
function getRelDateRange(today, monthPushBack, endOnBusiness = false) {
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
  start = new Date(date.getFullYear(), date.getMonth() - monthPushBack, 1);
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

// src/sofi/lib.ts
var BANK_ID = "sofi";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
async function addDownloadButton() {
  const CLASS = "my-download-btn";
  if (document.querySelector(`.${CLASS}`))
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
  const nav = document.querySelector("nav");
  if (!nav)
    return;
  nav.insertBefore(btn, nav.lastChild);
  btn.addEventListener("click", async () => {
    try {
      await fireDownloadProcess();
    } catch (err) {
      console.error(`[${BANK_ID} Downloader] Error:`, err);
    }
  });
}
function getInArray(d, needs, to_be) {
  for (const item of d) {
    if (item[needs] === to_be)
      return item;
  }
  return null;
}
async function fireDownloadProcess() {
  const script = Array.from(document.scripts).find((s) => s.textContent?.startsWith("window.REACT_QUERY_STATE"));
  if (!script)
    throw new Error("REACT_QUERY_STATE script not found");
  const json = script.textContent?.slice(script.textContent.indexOf("{"), script.textContent.lastIndexOf("}") + 1);
  if (!json)
    throw new Error("REACT_QUERY_STATE JSON not found");
  const data = JSON.parse(json);
  const rows = getInArray(getInArray(getInArray(getInArray(data.queries, "queryHash", '["GET_HOME_ZONES"]').state.data.content, "type", "SURFACE_OVERLAY").data.zones, "type", "ZONE_GNG").data.sections, "type", "SECTION_LIST_EXPANDABLE").data.rows;
  const accounts = [];
  for (const row of rows) {
    for (const item of row.expanded?.data?.items || []) {
      const url = item.data.dynamicAction.data.url;
      const accountId = url.match(/\/(\d+)\/account-detail/);
      if (accountId)
        accounts.push(accountId[1]);
    }
  }
  for (const account_id of accounts) {
    console.log(`${LOGGER_prefix} Account id: ${account_id}`);
    const [content, endDate] = await routine(account_id);
    await easyDownload({
      content,
      name: `${BANK_ID}_${account_id}_${endDate}_YTD.csv`,
      saveAs: true
    });
  }
}
async function routine(account_id) {
  const [startDate, endDate] = getRelDateRange(new Date, 2);
  const eStr = formatDateYYYYMMDD(endDate);
  const payload = new URLSearchParams;
  payload.append("startDate", formatDateYYYYdMMdDD(startDate));
  payload.append("endDate", formatDateYYYYdMMdDD(endDate));
  console.log(`Payload:`, payload.toString());
  const response = await easyRequest({
    url: `https://www.sofi.com/money-transactions-hist-service/api/public/v1/accounts/transactions/export/${account_id}`,
    method: "GET",
    payload,
    headers: {
      Referer: "https://www.sofi.com/my/money/account/more/export-transaction-history"
    }
  });
  return [response, eStr];
}

// src/sofi/index.ts
try {
  addDownloadButton();
  const observer = new MutationObserver(addDownloadButton);
  observer.observe(document.body, { childList: true, subtree: true });
} catch (err) {
  console.error("[Sofi Downloader] Error:", err);
}


})();
