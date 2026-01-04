// ==UserScript==
// @name         Chub.AI Timeline - Followed users only
// @description  Only show cards from followed users, not tags
// @match        https://chub.ai/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @version      2025.08.09a
// @author       anden3
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/url#sha384-MW/Hes7CLT6ZD4zwzTUVdtXL/VaIDQ3uMFVuOx46Q0xILNG6vEueFrCaYNKw+YE3
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @namespace    https://greasyfork.org/users/1499640
// @downloadURL https://update.greasyfork.org/scripts/544097/ChubAI%20Timeline%20-%20Followed%20users%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/544097/ChubAI%20Timeline%20-%20Followed%20users%20only.meta.js
// ==/UserScript==

/* globals VM */
/* jshint esversion: 11 */

let API_KEY = "YOUR API KEY HERE";
const API_BASE = "https://inference.chub.ai/api";
const INTERNAL_API_BASE = "https://gateway.chub.ai";

(async function() {
  'use strict';
  
  // Acquire API key. First check localStorage, next cache, and last the hardcoded value.
  const localStorageAPIKey = localStorage.getItem("URQL_TOKEN");
 
  if (localStorageAPIKey !== null) {
    API_KEY = localStorageAPIKey;
    await GM.setValue("API_KEY", API_KEY);
  } else {
    const possiblyCachedAPIKey = await GM.getValue("API_KEY", null) ?? null;
 
    if (possiblyCachedAPIKey !== null) {
      API_KEY = possiblyCachedAPIKey;
    } else if (API_KEY !== "YOUR API KEY HERE") {
      await GM.setValue("API_KEY", API_KEY);
    } else {
      throw new Error("No API key could be located, please log in.");
    }
  }
  
  const { onNavigate } = VM;

  async function queryApi(url, queryParams = {}, method = "GET") {
    const searchParams = new URLSearchParams(queryParams);
    console.log(`${url}?${searchParams}`);

    const response = await fetch(`${url}?${searchParams}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "CH-API-KEY": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error !== undefined) {
      console.error(`API Query failed: ${result}`);
      throw new Error(result);
    }

    return result;
  }

  async function queryPublicApi(endpoint, queryParams = {}, method = "GET") {
    return await queryApi(`${API_BASE}/${endpoint}`, queryParams, method);
  }

  async function queryInternalApi(endpoint, queryParams = {}, method = "GET") {
    return await queryApi(`${INTERNAL_API_BASE}/${endpoint}`, queryParams, method);
  }


  async function getProfile() {
    return await queryInternalApi("api/account");
  }

  async function fetchTimeline(page) {
    const cards = await queryInternalApi("api/timeline/v1", { page, count: false });

    return cards.data.nodes.map(card => {
      const author = card.fullPath.split("/")[0];

      return {
        ...card,
        author,
      };
    });
  }

  async function fetchFollows() {
    const profile = await getProfile();
    
    if (profile.user_name === "You") {
      alert("The API key provided to this userscript (Chub.AI Timeline - Followed users only) is invalid.\nDisable this userscript if this alert is annoying.");
      throw new Error("API key failed to authenticate user, most likely invalid.");
    }

    let follows = {
      users: [],
      tags: [],
    };

    let page = 1;

    while (true) {
      let followData = await queryInternalApi(`api/follows/${profile.user_name}`, { page: page });

      if (followData.follows.length + followData.tag_follows.length === 0) {
        break;
      }

      follows.users.push(...followData.follows);
      follows.tags.push(...followData.tag_follows);

      page += 1;
      // Sleep
      await new Promise(r => setTimeout(r, 1000));
    }

    return follows;
  }

  async function getVisibleCards() {
    // Wait for cards to exist.
    try {
      await waitForElement("#chara-list", 5000);
    } catch {
      return [];
    }

    return Array.from(document.querySelectorAll("#chara-list > a"))
      .map(node => {
        const path = node.attributes.href.value;
        const fork = node.querySelector("a:has(.anticon-fork)")?.attributes?.href?.value ?? null;

        return {
          node,
          path,
          fork,
        }
      });
  }

  async function cacheIsStale(key, thresholdMs = 60 * 1000) {
    const lastCacheUpdate = await GM.getValue(key, null);

    if (lastCacheUpdate === null) {
      return true;
    }

    const msSinceUpdate = Math.max(new Date() - new Date(lastCacheUpdate), 0);
    return msSinceUpdate >= thresholdMs;
  }

  const DEFAULT_CACHE_OPTIONS = {
    staleThresholdMs: 60 * 1000,
    mappingFn: foo => foo,
  };

  // Tries from cache if fresh, else fetches values.
  async function getCachedCollection(
  cacheKey,
   fetchFn,
   cacheOptions,
   lastUpdateKey = `last${cacheKey}Update`,
  ) {
    const cache_options = {
      ...DEFAULT_CACHE_OPTIONS,
      ...cacheOptions,
    };
    
    const _cmd = GM_registerMenuCommand(`Update ${cacheKey}`, async _ev => {
      const values = cache_options.mappingFn(await fetchFn);
      await GM.setValue(cacheKey, values);
      await GM.setValue(lastUpdateKey, new Date().toISOString());
    }, {
      title: `Update Chub.AI ${cacheKey} cache`
    });

    const cachedValues = await GM.getValue(cacheKey, null) ?? null;

    if (cachedValues === null || await cacheIsStale(lastUpdateKey, cache_options.staleThresholdMs)) {
      const values = cache_options.mappingFn(await fetchFn());

      await GM.setValue(cacheKey, values);
      await GM.setValue(lastUpdateKey, new Date().toISOString());

      return values;
    } else {
      return cachedValues;
    }
  }

  async function getFollows() {
    let followsData = await getCachedCollection("follows", fetchFollows, {
      staleThresholdMs: 60 * 60 * 1000,
    });

    return {
      users: new Set(followsData.users.map(u => u.username)),
      tags: new Set(followsData.tags.map(t => t.tagname.toLowerCase())),
    };
  }

  async function isTimelineSelected() {
    await new Promise(r => setTimeout(r, 2000));
 
    // Wait for labels to exist.
    try {
      await waitForElement(".ant-select-selection-item", 2000);
    } catch {
      return false;
    }
 
    const selectedCategory = document.querySelector(".ant-select-selection-item")?.title ?? "";
    return selectedCategory === "Timeline";
  }

  async function timelineLoaded(page) {
    const follows = await getFollows();

    const cards = await fetchTimeline(page);
    const cardElements = await getVisibleCards();

    for (let i in cards) {
      const followingUser = follows.users.has(cards[i].author);

      if (!followingUser) {
        cardElements[i].node.style.display = "none";
      }
    }
  }

  async function handleNavigate() {
    console.log(window.location);

    if (window.location.pathname !== "/") {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    if ((urlParams.size === 0 && await isTimelineSelected()) || urlParams.get("segment") === "timeline") {
      timelineLoaded(parseInt(urlParams.get("page") ?? "1"));
    }
  }

  // Watch route change
  VM.onNavigate(handleNavigate);

  // Call it once for the initial state
  handleNavigate();

  // Source: https://stackoverflow.com/a/61511955
  function waitForElement(selector, timeout = -1) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      let timeoutPid;

      if (timeout >= 0) {
        timeoutPid = setTimeout(() => {
          observer.disconnect();
          reject(`Timed out after ${timeout} ms.`);
        }, timeout);
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          if (timeoutPid) {
            clearTimeout(timeoutPid);
          }

          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
})();

