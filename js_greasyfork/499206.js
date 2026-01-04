// ==UserScript==
// @name         Omnivore Everything
// @namespace    Violentmonkey Scripts
// @version      0.10
// @description  save all browsing history to Omnivore
// @author       fankaidev
// @match        *://*/*
// @exclude      *://omnivore.app/*
// @exclude      *://cubox.pro/*
// @exclude      *://readwise.io/*
// @exclude      *://localhost:*/*
// @exclude      *://127.0.0.1:*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499206/Omnivore%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/499206/Omnivore%20Everything.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function uuid() {
    return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  }

  let hrefHistory = [];

  const omnivoreSchema = {
    saveUrl: `
      mutation SaveUrl($input: SaveUrlInput!) {
        saveUrl(input: $input) {
            ... on SaveSuccess {
                url
                clientRequestId
            }
            ... on SaveError {
                errorCodes
                message
            }
        }
      }`,
    savePage: `
      mutation SavePage($input: SavePageInput!) {
        savePage(input: $input) {
            ... on SaveSuccess {
                url
                clientRequestId
            }
            ... on SaveError {
                errorCodes
                message
            }
        }
      }`,
  };

  // Function to get or initialize global state
  function getGlobalState(key, defaultValue) {
    return GM_getValue(key, defaultValue);
  }

  // Function to update global state
  function updateGlobalState(key, value) {
    GM_setValue(key, value);
  }

  function getApiKey() {
    let apiKey = getGlobalState("omnivoreApiKey", null);
    if (!apiKey) {
      apiKey = prompt("[Omni] Please enter Omnivore API key:", "");
      if (apiKey) {
        updateGlobalState("omnivoreApiKey", apiKey);
      } else {
        console.error("[Omni] No API key provided. Script will not function correctly.");
      }
    }
    return apiKey;
  }

  function changeEndpoint() {
    let newApiKey = prompt("[Omni] Enter Omnivore API key:", getGlobalState("omnivoreApiKey", ""));
    if (newApiKey) {
      updateGlobalState("omnivoreApiKey", newApiKey);
      console.log("[Omni] API key updated to", newApiKey);
    }
  }

  function getBlacklistPattern() {
    let val = getGlobalState("blacklistPattern", null);
    if (!val) {
      val = `omnivore.app/.*|readwise.io/.*|cubox.pro/.*|localhost:.*|mail.google.com/.*`;
      updateGlobalState("blacklistPattern", val);
    }
    return new RegExp(val.trim());
  }

  function getWhitelistPattern() {
    let val = getGlobalState("whitelistPattern", null);
    if (!val) {
      val = ".*";
      updateGlobalState("whitelistPattern", val);
    }
    return new RegExp(val.trim());
  }

  function changeEndpoint() {
    let newApiKey = prompt("[Omni] Enter Omnivore API key:", getGlobalState("omnivoreApiKey", ""));
    if (newApiKey) {
      updateGlobalState("omnivoreApiKey", newApiKey);
      console.log("[Omni] API key updated to", newApiKey);
    }
  }

  function changeBlacklistPattern() {
    let newVal = prompt("[Omni] blacklist pattern in regex", getGlobalState("blacklistPattern", ""));
    if (newVal) {
      updateGlobalState("blacklistPattern", newVal);
      console.log("[Omni] blacklist patterns", newVal);
    }
  }

  function changeWhitelistPattern() {
    let newVal = prompt("[Omni] whitelist pattern in regex", getGlobalState("whitelistPattern", ""));
    if (newVal) {
      updateGlobalState("whitelistPattern", newVal);
      console.log("[Omni] whitelist patterns", newVal);
    }
  }

  GM_registerMenuCommand("Change Omnivore API key", changeEndpoint);
  GM_registerMenuCommand("Change blacklist pattern", changeBlacklistPattern);
  GM_registerMenuCommand("Change whitelist pattern", changeWhitelistPattern);

  function savePage(url) {
    const variables = {
      input: {
        url,
        title: document.title,
        originalContent: document.documentElement.outerHTML,
        source: "chrome",
        clientRequestId: uuid(),
      },
    };
    const apiKey = getApiKey();
    const apiUrl = "https://api-prod.omnivore.app/api/graphql";
    if (!apiKey || !apiUrl) {
      return;
    }
    GM_xmlhttpRequest({
      method: "POST",
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      data: JSON.stringify({ query: omnivoreSchema.savePage, variables }),
      onload: function (response) {
        if (response.status === 200) {
          console.log("[Omni] saved page to omnivore");
        } else {
          console.error("[Omni] Failed to save to omnivore", response.responseText);
        }
      },
      onerror: function (error) {
        console.error("Request failed:", error);
      },
    });
  }

  function saveUrl(url) {
    const variables = {
      input: {
        url,
        source: "chrome",
        clientRequestId: uuid(),
      },
    };
    const apiKey = getApiKey();
    const apiUrl = "https://api-prod.omnivore.app/api/graphql";
    if (!apiKey || !apiUrl) {
      return;
    }
    GM_xmlhttpRequest({
      method: "POST",
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      data: JSON.stringify({ query: omnivoreSchema.saveUrl, variables }),
      onload: function (response) {
        if (response.status === 200) {
          console.log("[Omni] saved url to omnivore");
        } else {
          console.error("[Omni] Failed to save to omnivore", response.responseText);
        }
      },
      onerror: function (error) {
        console.error("Request failed:", error);
      },
    });
  }

  function process() {
    const url = window.location.href.split("#")[0];
    if (hrefHistory.includes(url)) {
      console.log("[Omni] skip processed url", url);
      return;
    }
    console.log("[Omni] processing url", url);
    hrefHistory.push(url);

    const blacklistPattern = getBlacklistPattern();
    const whitelistPattern = getWhitelistPattern();
    if (!whitelistPattern.test(url)) {
      console.log("[Omni] ignore non-whitelisted url");
      return;
    }
    if (blacklistPattern.test(url)) {
      console.log("[Omni] ignore blacklisted url");
      return;
    }

    if (document.contentType === "application/pdf") {
      saveUrl(url);
    } else {
      savePage(url);
    }
  }

  function scheduleProcess() {
    if (window.self === window.top) {
      console.log(`[Omni] current href is`, window.location.href);
      setTimeout(() => {
        process();
      }, 5000);
    }
  }

  // Intercept pushState and replaceState
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    scheduleProcess();
  };

  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    scheduleProcess();
  };
  window.addEventListener("load", function () {
    scheduleProcess();
  });
  window.addEventListener("popstate", function (event) {
    scheduleProcess();
  });
})();
