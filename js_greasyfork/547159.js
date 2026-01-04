// ==UserScript==
// @name         Wise CSV Statement Downloader
// @namespace    Violentmonkey Scripts
// @license      MIT
// @version      1.1
// @description  Automatically download CSV statements from Wise
// @match        https://*.wise.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/547159/Wise%20CSV%20Statement%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547159/Wise%20CSV%20Statement%20Downloader.meta.js
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
function easySetValue(key, value) {
  GM_setValue(key, value);
}
function easyGetValue(key) {
  return GM_getValue(key);
}
function trimAccountName(name) {
  return name.trim().replace(/[\s-.]+/g, "").replace(/[\u2122\u00AE\u00A9]/g, "");
}

// src/wise/lib.ts
var BANK_ID = "wise";
var LOGGER_prefix = `[${BANK_ID} Downloader]`;
var POLL_INTERVAL = 500;
async function hookOneTimeToken() {
  const unsafeWindow = await getWindowProperty((w) => w, POLL_INTERVAL);
  const origFetch = unsafeWindow.fetch;
  unsafeWindow.fetch = async (...args) => {
    const response = await origFetch(...args);
    const cloned = response.clone();
    cloned.json().then((text) => {
      if (typeof args[0] === "string" && args[0].startsWith("/gateway/identity/api/v1/one-time-token/status")) {
        easySetValue("wise_one_time_token", text.oneTimeTokenProperties.oneTimeToken);
        console.log(`${LOGGER_prefix} Hooked one-time-token: ${text.oneTimeTokenProperties.oneTimeToken}`);
        const accessToken = args[1].headers["X-Access-Token"];
        if (accessToken) {
          easySetValue("wise_xaccess_token", accessToken);
          console.log(`${LOGGER_prefix} Hooked x-access-token: ${accessToken}`);
        }
      }
    });
    return response;
  };
}
async function addDownloadButton() {
  const container = await getElement(".header-container", POLL_INTERVAL);
  const CLASS = "my-download-btn";
  if (container.querySelector(`.${CLASS}`))
    return;
  const passwordInput = document.createElement("input");
  passwordInput.id = "random-input-password";
  passwordInput.type = "password";
  passwordInput.placeholder = "input password to";
  passwordInput.style.cssText = `
            padding: 4px 4px;
            margin: 0px 4px 0px 4px;
        `;
  container.appendChild(passwordInput);
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
  btn.disabled = true;
  btn.addEventListener("click", async () => {
    try {
      await fireDownloadProcess();
    } catch (err) {
      console.error(`[${BANK_ID} Downloader] Error:`, err);
    }
  });
  passwordInput.addEventListener("input", () => {
    btn.disabled = !passwordInput.value;
  });
  container.appendChild(btn);
}
async function verify(password) {
  const token = easyGetValue("wise_one_time_token");
  await easyRequest({
    url: "https://wise.com/gateway/identity/api/v1/one-time-token/status",
    method: "GET",
    headers: { "one-time-token": token }
  });
  await easyRequest({
    url: "https://wise.com/gateway/identity/api/v1/one-time-token/password/verify",
    method: "POST.json",
    payload: {
      password
    },
    headers: { "one-time-token": token }
  });
  return token;
}
async function fireDownloadProcess() {
  const password = (await getElement("#random-input-password", POLL_INTERVAL)).value;
  console.log(`Password: ${password}`);
  const account_id = await getWindowProperty((w) => w?.__NEXT_DATA__?.props?.templateInitialProps?.selectedProfile?.id, POLL_INTERVAL);
  const account_type = await getWindowProperty((w) => w?.__NEXT_DATA__?.props?.templateInitialProps?.selectedProfile?.type, POLL_INTERVAL);
  console.log(`Account ID: ${account_id}, Account Type: ${account_type}`);
  const token = await verify(password);
  const [content, endDate] = await routine(account_id, token);
  await easyDownload({
    content,
    name: `${BANK_ID}_${trimAccountName(account_type)}_${account_id}_${endDate}_YTD.csv`,
    saveAs: true
  });
}
async function routine(account_id, token) {
  const [startDate, endDate] = getDateRange(new Date);
  const eStr = formatDateYYYYMMDD(endDate);
  const payload = {
    size: "10000",
    since: new Date(startDate).toISOString(),
    until: new Date(endDate).toISOString()
  };
  const response = await easyRequest({
    url: `https://wise.com/gateway/v1/profiles/${account_id}/activities/list/export/`,
    method: "POST.json",
    payload,
    headers: {
      "x-2fa-approval": token,
      "x-access-token": easyGetValue("wise_xaccess_token"),
      "x-visual-context": "personal::light",
      Referer: "https://wise.com/all-transactions"
    }
  });
  return [response, eStr];
}

// src/wise/index.ts
try {
  hookOneTimeToken();
  addDownloadButton();
  const observer = new MutationObserver(addDownloadButton);
  observer.observe(document.body, { childList: true, subtree: true });
} catch (err) {
  console.error("[Wise Downloader] Error:", err);
}


})();
