// ==UserScript==
// @name        🐭️ MouseHunt - Ultimate Checkmark
// @description Track your progress towards the "Ultimate Checkmark".
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/461469/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Ultimate%20Checkmark.user.js
// @updateURL https://update.greasyfork.org/scripts/461469/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Ultimate%20Checkmark.meta.js
// ==/UserScript==

var mhui = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/modules/ultimate-checkmark/index.js
  var ultimate_checkmark_exports = {};
  __export(ultimate_checkmark_exports, {
    default: () => ultimate_checkmark_default
  });

  // src/utils/event-registry.js
  var eventsAdded = {};
  var onEvent = (event, callback, remove = false) => {
    if (!eventRegistry) {
      return;
    }
    const id = `${event}-${remove.toString()}-${callback.toString()}`;
    if (eventsAdded[id]) {
      return;
    }
    eventsAdded[id] = true;
    eventRegistry.addEventListener(event, callback, null, remove);
  };

  // src/utils/styles.js
  var addModuleStyles = (styles, identifier = "mh-improved-styles", replace = false) => {
    const existingStyles = document.querySelector(`#${identifier}`);
    styles = Array.isArray(styles) ? styles.join("\n") : styles;
    if (existingStyles) {
      if (replace) {
        existingStyles.innerHTML = styles;
      } else {
        existingStyles.innerHTML += styles;
      }
      return existingStyles;
    }
    const style = document.createElement("style");
    style.id = identifier;
    style.innerHTML = styles;
    document.head.append(style);
    return style;
  };
  var addStyles = (styles, module = false, identifier = "mh-improved-styles") => {
    if (!module) {
      throw new Error("Module ID is required for adding module styles.", module);
    }
    const key = `${identifier}-${module}`;
    let stylesEl = addModuleStyles(styles, key, true);
    onEvent(`mh-improved-settings-changed-${module}`, (enabled) => {
      if (enabled) {
        stylesEl = addModuleStyles(styles, key, true);
      } else if (stylesEl) {
        stylesEl.remove();
      }
    });
  };

  // src/utils/settings.js
  var getSettingDirect = (key = null, defaultValue = null, identifier = "mousehunt-improved-settings") => {
    const settings = JSON.parse(localStorage.getItem(identifier)) || {};
    if (!key) {
      return settings;
    }
    if (!key.includes(".")) {
      if (settings[key] === void 0) {
        return defaultValue;
      }
      return settings[key];
    }
    const groupAndKey = getGroupAndKey(key);
    if (!groupAndKey.group) {
      if (settings[groupAndKey.key] === void 0) {
        return defaultValue;
      }
      return settings[groupAndKey.key];
    }
    const groupSettings = settings[groupAndKey.group] || {};
    if (groupSettings[groupAndKey.key] === void 0) {
      return defaultValue;
    }
    return groupSettings[groupAndKey.key];
  };
  var getGroupAndKey = (key) => {
    const split = key.split(".");
    if (split.length === 1) {
      return {
        group: null,
        key: split[0]
      };
    }
    if (split[0] === "location-huds-enabled") {
      return {
        group: "location-huds-enabled",
        key: split[1]
      };
    }
    return {
      group: `${split[0]}-settings`,
      key: split[1]
    };
  };
  var getSetting = (key, defaultValue = false) => {
    return getSettingDirect(key, defaultValue, "mousehunt-improved-settings");
  };

  // src/utils/elements.js
  var makeElement = (tag, classes = "", text = "", appendTo = null) => {
    const element = document.createElement(tag);
    if (Array.isArray(classes)) {
      classes = classes.join(" ");
    }
    if (classes && classes.length) {
      element.className = classes;
    }
    element.innerHTML = text;
    if (appendTo) {
      appendTo.append(element);
      return appendTo;
    }
    return element;
  };

  // src/utils/db.js
  var database = (databaseName) => __async(void 0, null, function* () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(`mh-improved-${databaseName}`, 6);
      request.onerror = (event) => {
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(databaseName)) {
          db.createObjectStore(databaseName, { keyPath: "id" });
        }
      };
    });
  });
  var dbGet = (databaseName, id) => __async(void 0, null, function* () {
    const db = yield database(databaseName);
    const transaction = db.transaction(databaseName, "readonly");
    transaction.onerror = (event) => {
      throw new Error(event.target.error);
    };
    const objectStore = transaction.objectStore(databaseName);
    const request = objectStore.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  });
  var dbSet = (databaseName, data) => __async(void 0, null, function* () {
    const db = yield database(databaseName);
    const transaction = db.transaction(databaseName, "readwrite");
    const objectStore = transaction.objectStore(databaseName);
    data = {
      data,
      id: data.id || Date.now()
    };
    const request = objectStore.put(data);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  });
  var dbDelete = (databaseName, id) => __async(void 0, null, function* () {
    const db = yield database(databaseName);
    const transaction = db.transaction(databaseName, "readwrite");
    const objectStore = transaction.objectStore(databaseName);
    const request = objectStore.delete(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  });
  var dbDeleteAll = (databaseName) => __async(void 0, null, function* () {
    const db = yield database(databaseName);
    const transaction = db.transaction(databaseName, "readwrite");
    const objectStore = transaction.objectStore(databaseName);
    const request = objectStore.clear();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
      transaction.oncomplete = () => {
        db.close();
      };
    });
  });

  // src/utils/global.js
  var getGlobal = (key) => {
    if (window && window.mhui) {
      return window.mhui[key] || false;
    }
    if ("undefined" !== typeof app && app && app.mhui) {
      return app.mhui[key] || false;
    }
    return false;
  };

  // src/utils/debug.js
  var debuglog = (module, message, ...args) => {
    if (getSetting("debug.all", false) || getSetting(`debug.${module}`, false) || getGlobal("mh-improved-updating")) {
      console.log(
        `%cMH Improved %c${module}%c ${message}`,
        "color: #90588c; font-weight: 900",
        "color: #90588c; font-weight: 400",
        "color: inherit; font-weight: inherit",
        ...args
      );
    }
  };

  // src/utils/data.js
  var validDataFiles = /* @__PURE__ */ new Set([
    "effs",
    "environments-events",
    "environments",
    "item-thumbnails",
    "items-tradable",
    "m400-locations",
    "marketplace-hidden-items",
    "mice-groups",
    "mice-regions",
    "mice-thumbnails",
    "minlucks",
    "relic-hunter-hints",
    "scoreboards",
    "ultimate-checkmark",
    "upscaled-images",
    "wisdom"
  ]);
  var isValidDataFile = (file) => {
    return validDataFiles.has(file);
  };
  var getCacheExpiration = (key = null) => __async(void 0, null, function* () {
    return yield cacheGet(`expiration-${key}`, false);
  });
  var setCacheExpiration = (key) => __async(void 0, null, function* () {
    debuglog("utils-data", `Setting cache expiration for ${key}`);
    cacheSet(`expiration-${key}`, Date.now() + (Math.floor(Math.random() * 7) + 7) * 24 * 60 * 60 * 1e3);
  });
  var isCacheExpired = (key) => __async(void 0, null, function* () {
    const expiration = yield getCacheExpiration(key);
    if (!expiration) {
      return true;
    }
    return expiration.date < Date.now();
  });
  var fetchData = (key, retries = 0) => __async(void 0, null, function* () {
    try {
      const data = yield fetch(`https://api.mouse.rip/${key}`, {
        method: "GET",
        headers: getHeaders()
      });
      return yield data.json();
    } catch (error) {
      console.error(`Error fetching data for ${key}:`, error);
      if (retries >= 3) {
        return false;
      }
      yield new Promise((resolve) => setTimeout(resolve, 500 * retries));
      return fetchData(key, retries + 1);
    }
  });
  var getData = (key) => __async(void 0, null, function* () {
    if (!isValidDataFile(key)) {
      debuglog("utils-data", `Cannot get data for ${key}, invalid key`);
      return false;
    }
    const isExpired = yield isCacheExpired(key);
    if (!isExpired) {
      const cachedData = yield dataCacheGet(key, false);
      if (cachedData) {
        return cachedData;
      }
    }
    debuglog("utils-data", `Fetching data for ${key}\u2026`);
    const data = yield fetchData(key);
    debuglog("utils-data", `Fetched data for ${key}`, data);
    if (data) {
      dataCacheSet(key, data);
      setCacheExpiration(key);
    }
    return data;
  });
  var clearCaches = () => __async(void 0, null, function* () {
    validDataFiles.forEach((file) => {
      dbDelete("data", file);
    });
    dbDeleteAll("ar-cache");
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("mh-improved-cache")) {
        localStorage.removeItem(key);
      }
    }
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("mh-improved")) {
        sessionStorage.removeItem(key);
      }
    }
    yield dbDelete("cache", "expirations");
  });
  var getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "X-MH-Improved": "true",
      "X-MH-Improved-Version": mhImprovedVersion || "unknown",
      "X-MH-Improved-Platform": mhImprovedPlatform || "unknown"
    };
  };
  var sessionSet = (key, value, retry = false) => {
    if (getSetting("debug.no-cache")) {
      return;
    }
    key = `mh-improved-${key}`;
    const stringified = JSON.stringify(value);
    try {
      sessionStorage.setItem(key, stringified);
    } catch (error) {
      if ("QuotaExceededError" === error.name && !retry) {
        clearCaches();
        sessionSet(key, value, true);
      }
    }
  };
  var sessionGet = (key, defaultValue = false) => {
    if (getSetting("debug.no-cache")) {
      return defaultValue;
    }
    key = `mh-improved-${key}`;
    const value = sessionStorage.getItem(key);
    if (!value) {
      return defaultValue;
    }
    return JSON.parse(value);
  };
  var cacheSet = (key, value) => {
    dbSet("cache", { id: key, value });
  };
  var dataCacheSet = (key, value) => {
    dbSet("data", { id: key, value });
  };
  var cacheGetHelper = (key, defaultValue = false, db = "cache") => __async(void 0, null, function* () {
    var _a;
    const cached = yield dbGet(db, key);
    if (!((_a = cached == null ? void 0 : cached.data) == null ? void 0 : _a.value)) {
      return defaultValue;
    }
    return cached.data.value;
  });
  var cacheGet = (key, defaultValue = false) => __async(void 0, null, function* () {
    return yield cacheGetHelper(key, defaultValue, "cache");
  });
  var dataCacheGet = (key, defaultValue = false) => __async(void 0, null, function* () {
    return yield cacheGetHelper(key, defaultValue, "data");
  });

  // src/utils/page.js
  var getCurrentPage = () => {
    var _a, _b, _c, _d;
    if (!((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.getCurrentPage)) {
      return null;
    }
    const page = hg.utils.PageUtil.getCurrentPage();
    if (!page) {
      const query = ((_d = (_c = hg == null ? void 0 : hg.utils) == null ? void 0 : _c.PageUtil) == null ? void 0 : _d.getQueryParams()) || {};
      if ((query == null ? void 0 : query.switch_to) && "mobile" === query.switch_to) {
        return "camp";
      }
      return null;
    }
    return page.toLowerCase();
  };
  var getCurrentTab = () => {
    var _a, _b;
    if (!((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.getCurrentPageTab)) {
      return getCurrentPage();
    }
    const tab = hg.utils.PageUtil.getCurrentPageTab() || "";
    if (tab.length <= 0) {
      return getCurrentPage();
    }
    return tab.toLowerCase();
  };
  var getCurrentSubtab = () => {
    const subtab = hg.utils.PageUtil.getCurrentPageSubTab();
    if (!subtab || subtab.length <= 0) {
      return getCurrentTab();
    }
    return subtab.toLowerCase();
  };
  var isCurrentPage = (targetPage = null, targetTab = null, targetSubtab = null, forceCurrentPage = null, forceCurrentTab = null, forceCurrentSubtab = null) => {
    if (!targetPage) {
      return false;
    }
    const currentPage = forceCurrentPage || getCurrentPage();
    if (!targetTab) {
      return currentPage === targetPage;
    }
    const currentTab = forceCurrentTab || getCurrentTab();
    if (!targetSubtab) {
      return currentPage === targetPage && currentTab === targetTab;
    }
    const currentSubtab = forceCurrentSubtab || getCurrentSubtab();
    if (currentSubtab === currentTab) {
      return currentPage === targetPage && currentTab === targetTab;
    }
    return currentPage === targetPage && currentTab === targetTab && currentSubtab === targetSubtab;
  };

  // src/utils/events.js
  var callbacks = [];
  var hasAddedNavigationListener = false;
  var onNavigation = (callback, options = {}) => {
    const defaults = {
      page: false,
      tab: false,
      subtab: false,
      onLoad: true,
      anyTab: false,
      anySubtab: false
    };
    const { page, tab, subtab, onLoad, anyTab, anySubtab } = Object.assign(defaults, options);
    const bypassMatch = !page;
    if (onLoad && (bypassMatch || isCurrentPage(
      page,
      anyTab ? getCurrentTab() : tab,
      anySubtab ? getCurrentSubtab() : subtab
    ))) {
      callback();
    }
    callbacks.push({ callback, page, tab, subtab, bypassMatch });
    if (!hasAddedNavigationListener) {
      addNavigationListeners();
      hasAddedNavigationListener = true;
    }
  };
  var addNavigationListeners = () => {
    eventRegistry.addEventListener("set_page", (e) => {
      var _a;
      const tabs = ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.tabs) || {};
      const currentTab = Object.keys(tabs).find((key) => tabs[key].is_active_tab);
      const forceCurrentTab = currentTab == null ? void 0 : currentTab.type;
      callbacks.forEach(({ callback, page, tab, subtab, bypassMatch }) => {
        if (bypassMatch) {
          callback();
          return;
        }
        if (!subtab) {
          if (isCurrentPage(page, tab, false, getCurrentPage(), forceCurrentTab)) {
            callback();
          }
          return;
        }
        if ((currentTab == null ? void 0 : currentTab.subtabs) && (currentTab == null ? void 0 : currentTab.subtabs.length) > 0) {
          const forceSubtab = currentTab.subtabs.find((searchTab) => searchTab.is_active_subtab).subtab_type;
          if (isCurrentPage(page, tab, subtab, getCurrentPage(), forceCurrentTab, forceSubtab)) {
            callback();
          }
        }
      });
    });
    eventRegistry.addEventListener("set_tab", (e) => {
      callbacks.forEach(({ callback, page, tab, subtab, bypassMatch }) => {
        if (bypassMatch) {
          callback();
          return;
        }
        if (isCurrentPage(page, tab, subtab, getCurrentPage(), e.page_arguments.tab, e.page_arguments.sub_tab)) {
          callback();
        }
      });
    });
  };

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/utils/utils.js
  var isLoggedIn = () => {
    return user && user.user_id && "login" !== getCurrentPage();
  };
  var requests = {};
  var doRequest = (_0, ..._1) => __async(void 0, [_0, ..._1], function* (url, formData = {}, skipChecks = false) {
    var _a;
    if (!isLoggedIn()) {
      return;
    }
    if ("undefined" === typeof lastReadJournalEntryId || "undefined" === typeof user) {
      return;
    }
    if (!lastReadJournalEntryId || !user || !(user == null ? void 0 : user.unique_hash)) {
      return;
    }
    const requestKey = Object.keys(formData).length ? `${url}-${JSON.stringify(formData)}` : url;
    const timeRequested = Date.now();
    debuglog("utils-data", `Making request: ${requestKey} at ${timeRequested}`);
    if (requests[requestKey] && !skipChecks) {
      debuglog("utils-data", `Request already in progress: ${requestKey}`);
      if (requests[requestKey].in_progress) {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => __async(void 0, null, function* () {
            debuglog("utils-data", `Request timed out: ${requestKey}, starting new request`);
            clearInterval(interval);
            const newRequest = yield doRequest(url, formData, true);
            resolve(newRequest);
          }), 2500);
          const interval = setInterval(() => {
            debuglog("utils-data", `Checking if request is complete: ${requestKey}`);
            if (!requests[requestKey].in_progress) {
              debuglog("utils-data", `Returning saved response: ${requestKey}`);
              clearInterval(interval);
              clearTimeout(timeout);
              resolve(requests[requestKey].response);
            }
          }, 100);
        });
      } else if (requests[requestKey].time_requested > timeRequested - 350) {
        debuglog("utils-data", `Request already completed: ${requestKey}`);
        return requests[requestKey].response;
      }
    }
    debuglog("utils-data", `Starting request: ${requestKey}`);
    requests[requestKey] = {
      in_progress: true,
      time_requested: timeRequested
    };
    const form = new FormData();
    form.append("sn", "Hitgrab");
    form.append("hg_is_ajax", 1);
    form.append("last_read_journal_entry_id", lastReadJournalEntryId != null ? lastReadJournalEntryId : 0);
    form.append("uh", (_a = user == null ? void 0 : user.unique_hash) != null ? _a : "");
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    const requestBody = new URLSearchParams(form).toString();
    let response;
    let attempts = 0;
    while (!response && attempts < 3) {
      try {
        response = yield fetch(
          callbackurl ? callbackurl + url : "https://www.mousehuntgame.com/" + url,
          {
            method: "POST",
            body: requestBody,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed. Retrying...`, error);
      }
    }
    if (attempts >= 3) {
      console.error("Failed to fetch after maximum attempts");
    }
    let data;
    try {
      data = yield response.json();
    } catch (error) {
      console.error(`Error parsing response for ${url}:`, error, url, formData, response);
      return false;
    }
    requests[requestKey] = {
      time_requested: timeRequested,
      response: data
    };
    return data;
  });

  // src/modules/ultimate-checkmark/settings/index.js
  var settings_default = () => __async(void 0, null, function* () {
    const options = [];
    const categories2 = yield getData("ultimate-checkmark");
    categories2.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      return 1;
    });
    categories2.forEach((category) => {
      options.push({
        id: category.id,
        name: category.name,
        value: getSetting(`ultimate-checkmark.show-${category.id}`, true)
      });
    });
    return [{
      id: "ultimate-checkmark.show",
      title: "Ultimate Checkmark",
      default: [],
      description: "Adds more things collect on your Hunter profile.",
      settings: {
        type: "multi-toggle",
        options
      }
    }];
  });

  // src/modules/ultimate-checkmark/styles.css
  var styles_default = ".hunterProfileItemsView-categoryContent[data-category=chest] .hunterProfileItemsView-categoryContent-item.uncollected,.hunterProfileItemsView-categoryContent[data-category=airships] .hunterProfileItemsView-categoryContent-item.uncollected,.hunterProfileItemsView-categoryContent[data-category=currency] .hunterProfileItemsView-categoryContent-item.uncollected,.hunterProfileItemsView-categoryContent[data-category=equipment] .hunterProfileItemsView-categoryContent-item.uncollected,.hunterProfileItemsView-categoryContent[data-category=plankrun] .hunterProfileItemsView-categoryContent-item.uncollected{filter:grayscale(100%)}.hunterProfileItemsView-categoryContent[data-category=chest] .hunterProfileItemsView-categoryContent-item-padding .itemImage{background-size:contain}\n";

  // src/modules/ultimate-checkmark/index.js
  var categories;
  var getItems = (_0, _1, _2, ..._3) => __async(void 0, [_0, _1, _2, ..._3], function* (required, queryTab, queryTag, allItems = []) {
    var _a, _b;
    if (!allItems.length) {
      const cachedData = sessionGet("ultimate-checkmark") || "{}";
      let inventoryData = ((_a = cachedData[queryTab]) == null ? void 0 : _a.data) || null;
      const lastCachedTime = ((_b = cachedData[queryTab]) == null ? void 0 : _b.time) || 0;
      if (!inventoryData || Date.now() - lastCachedTime > 5 * 60 * 1e3) {
        inventoryData = yield doRequest("managers/ajax/pages/page.php", {
          page_class: "Inventory",
          "page_arguments[legacyMode]": "",
          "page_arguments[tab]": queryTab,
          "page_arguments[sub_tab]": "false"
        });
        cachedData[queryTab] = {
          data: inventoryData,
          time: Date.now()
        };
        sessionSet("ultimate-checkmark", cachedData);
      }
      const specialTab = inventoryData.page.tabs.find((tab) => queryTab === tab.type);
      if (!specialTab || !specialTab.subtabs || !specialTab.subtabs.length || !specialTab.subtabs[0].tags) {
        return [];
      }
      const owned = specialTab.subtabs[0].tags.filter((tag) => queryTag === tag.type);
      if (!owned || !owned.length || !owned[0].items) {
        return [];
      }
      allItems = owned[0].items;
    }
    required.forEach((requiredItem) => {
      const ownedItem = allItems.find((i) => i.type === requiredItem.type);
      if (!ownedItem) {
        allItems.push(requiredItem);
      }
    });
    allItems = allItems.map((item) => {
      const requiredItem = required.find((i) => i.type === item.type);
      return {
        item_id: item.item_id,
        type: item.type,
        name: item.name,
        thumbnail: item.thumbnail_gray || item.thumbnail,
        quantity: item.quantity || 0,
        quantity_formatted: item.quantity_formatted || "0",
        le: !requiredItem
      };
    });
    allItems.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return allItems;
  });
  var getProgress = (items, required) => {
    let le = 0;
    let requiredCompleted = 0;
    items.forEach((item) => {
      if (item.quantity <= 0) {
        return;
      }
      if (!item.le) {
        requiredCompleted++;
      } else if (item.le) {
        le++;
      }
    });
    return {
      checkmark: required.total >= requiredCompleted,
      completed: requiredCompleted,
      required: required.length,
      le
    };
  };
  var makeProgressString = (progress) => {
    const { completed, required, le } = progress;
    let text = `${completed} of ${required}`;
    if (le && le > 0) {
      text += ` (+${le} LE)`;
    }
    return text;
  };
  var makeCategory = (category, name, progress) => {
    const exists = document.querySelector(`.hunterProfileItemsView-category[data-category="${category}"]`);
    if (exists) {
      return;
    }
    const sidebar = document.querySelector(".hunterProfileItemsView-directory");
    if (!sidebar) {
      return;
    }
    const catSidebarCategory = makeElement("a", "hunterProfileItemsView-category");
    if (progress.completed === progress.required) {
      catSidebarCategory.classList.add("complete");
    }
    catSidebarCategory.title = name;
    catSidebarCategory.href = "#";
    catSidebarCategory.setAttribute("data-category", category);
    catSidebarCategory.addEventListener("click", () => {
      hg.views.HunterProfileItemsView.showCategory(category);
      return false;
    });
    const catSidebarCategoryMargin = makeElement("div", "hunterProfileItemsView-category-margin");
    makeElement("div", "hunterProfileItemsView-category-name", name, catSidebarCategoryMargin);
    makeElement("div", "hunterProfileItemsView-category-progress", makeProgressString(progress), catSidebarCategoryMargin);
    makeElement("div", "hunterProfileItemsView-category-status", "", catSidebarCategoryMargin);
    catSidebarCategory.append(catSidebarCategoryMargin);
    sidebar.append(catSidebarCategory);
  };
  var makeItem = (item) => {
    const { item_id, type, name, thumbnail, thumbnail_gray, quantity, quantity_formatted, le } = item;
    const itemDiv = makeElement("div", "hunterProfileItemsView-categoryContent-item");
    if (quantity > 0) {
      itemDiv.classList.add("collected");
      if (le) {
        itemDiv.classList.add("limited_edition");
      }
    } else {
      itemDiv.classList.add("uncollected");
      itemDiv.classList.add("hidden");
    }
    itemDiv.setAttribute("data-id", item_id);
    itemDiv.setAttribute("data-type", type);
    const itemPadding = makeElement("div", "hunterProfileItemsView-categoryContent-item-padding");
    itemPadding.addEventListener("click", () => {
      hg.views.ItemView.show(type);
    });
    const itemImage = makeElement("div", "itemImage");
    itemImage.style.backgroundImage = quantity > 0 && thumbnail_gray ? `url(${thumbnail_gray})` : `url(${thumbnail})`;
    if (quantity > 0) {
      makeElement("div", "quantity", quantity_formatted, itemImage);
    }
    const itemName = makeElement("div", "hunterProfileItemsView-categoryContent-item-name");
    makeElement("span", "", name, itemName);
    itemPadding.append(itemImage);
    itemPadding.append(itemName);
    itemDiv.append(itemPadding);
    return itemDiv;
  };
  var makeContent = (id, name, items, completed) => {
    const content = document.querySelector(".hunterProfileItemsView-content-padding");
    if (!content) {
      return;
    }
    const exists = document.querySelector(`.hunterProfileItemsView-categoryContent[data-category="${id}"]`);
    if (exists) {
      return;
    }
    const categoryDiv = makeElement("div", "hunterProfileItemsView-categoryContent");
    if (completed) {
      categoryDiv.classList.add("collected");
    }
    categoryDiv.setAttribute("data-category", id);
    const nameDiv = makeElement("div", "hunterProfileItemsView-categoryContent-name", name);
    const itemsDiv = document.createElement("div");
    items.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    items.forEach((item) => {
      itemsDiv.append(makeItem(item));
    });
    categoryDiv.append(nameDiv);
    categoryDiv.append(itemsDiv);
    content.append(categoryDiv);
  };
  var addCategoryAndItems = (required, type, subtype, key, name) => __async(void 0, null, function* () {
    const exists = document.querySelector(`.hunterProfileItemsView-category[data-category="${key}"]`);
    if (exists) {
      return;
    }
    const items = yield getItems(required, type, subtype);
    const progress = getProgress(items, required);
    makeCategory(key, name, progress);
    makeContent(key, name, items, progress.completed);
    return true;
  });
  var isOwnProfile = () => {
    var _a, _b;
    if (!((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.getQueryParams)) {
      return false;
    }
    const params = hg.utils.PageUtil.getQueryParams();
    if (!params || !params.snuid) {
      return false;
    }
    return params.snuid === user.sn_user_id;
  };
  var run = () => __async(void 0, null, function* () {
    var _a, _b;
    if (!categories) {
      categories = yield getData("ultimate-checkmark");
    }
    if (!("hunterprofile" === getCurrentPage() && "items" === getCurrentTab() && isOwnProfile())) {
      return;
    }
    if (!((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.getQueryParams)) {
      return;
    }
    for (const category of categories) {
      if (!getSetting(`ultimate-checkmark.show-${category.id}`, true)) {
        continue;
      }
      yield addCategoryAndItems(category.items, category.type, category.subtype, category.key, category.name);
    }
  });
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "ultimate-checkmark");
    onNavigation(run, {
      page: "hunterprofile",
      tab: "items"
    });
  });
  var ultimate_checkmark_default = {
    id: "ultimate-checkmark",
    type: "feature",
    alwaysLoad: true,
    load: init,
    settings: settings_default
  };
  return __toCommonJS(ultimate_checkmark_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Ultimate Checkmark', 'https://greasyfork.org/en/scripts/461469-mousehunt-ultimate-checkmark');
