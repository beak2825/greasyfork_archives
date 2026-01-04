// ==UserScript==
// @name        🐭️ MouseHunt - Minluck & Catch Rate Estimate
// @description View the minluck and catch rate estimate, right on the camp page.
// @version     2.1.1
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/449334/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Minluck%20%20Catch%20Rate%20Estimate.user.js
// @updateURL https://update.greasyfork.org/scripts/449334/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Minluck%20%20Catch%20Rate%20Estimate.meta.js
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

  // src/modules/catch-rate-estimate/index.js
  var catch_rate_estimate_exports = {};
  __export(catch_rate_estimate_exports, {
    default: () => catch_rate_estimate_default
  });

  // src/utils/event-registry.js
  var doEvent2 = (eventName, params) => {
    if (!eventRegistry) {
      return;
    }
    eventRegistry.doEvent(eventName, params);
  };
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
  var getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "X-MH-Improved": "true",
      "X-MH-Improved-Version": mhImprovedVersion || "unknown",
      "X-MH-Improved-Platform": mhImprovedPlatform || "unknown"
    };
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

  // src/utils/location.js
  var getCurrentLocation = () => {
    const location = (user == null ? void 0 : user.environment_type) || "";
    return location.toLowerCase();
  };

  // src/utils/horn.js
  var showHornMessage = (options) => {
    const huntersHornView = document.querySelector(".huntersHornView__messageContainer");
    if (!huntersHornView) {
      return;
    }
    const settings = {
      title: options.title || "Hunters Horn",
      text: options.text || "This is a message from the Hunters Horn",
      button: options.button || "OK",
      action: options.action || (() => {
      }),
      dismiss: options.dismiss || null,
      type: options.type || "recent_linked_turn",
      classname: options.classname || "",
      image: options.image || null,
      imageLink: options.imageLink || null,
      imageCallback: options.imageCallback || null
    };
    const backdrop = document.querySelector(".huntersHornView__backdrop");
    if (backdrop) {
      backdrop.classList.add("huntersHornView__backdrop--active");
    }
    const gameInfo = document.querySelector(".mousehuntHud-gameInfo");
    if (gameInfo) {
      gameInfo.classList.add("blur");
    }
    const messageWrapper = makeElement("div", ["huntersHornView__message huntersHornView__message--active", settings.classname]);
    const message = makeElement("div", ["huntersHornMessageView", `huntersHornMessageView--${settings.type}`]);
    makeElement("div", "huntersHornMessageView__title", settings.title, message);
    const content = makeElement("div", "huntersHornMessageView__content");
    if (settings.image) {
      const imgWrapper = makeElement("div", "huntersHornMessageView__friend");
      const img = makeElement("a", "huntersHornMessageView__friendProfilePic");
      if (settings.imageLink) {
        img.href = settings.imageLink;
      } else if (settings.imageCallback) {
        img.addEventListener("click", settings.imageCallback);
      } else {
        img.href = "#";
      }
      img.style.backgroundImage = `url(${settings.image})`;
      imgWrapper.append(img);
      content.append(imgWrapper);
    }
    makeElement("div", "huntersHornMessageView__text", settings.text, content);
    const buttonSpacer = makeElement("div", "huntersHornMessageView__buttonSpacer");
    const button = makeElement("button", "huntersHornMessageView__action");
    const buttonLabel = makeElement("div", "huntersHornMessageView__actionLabel");
    makeElement("span", "huntersHornMessageView__actionText", settings.button, buttonLabel);
    button.append(buttonLabel);
    button.addEventListener("click", () => {
      if (settings.action) {
        settings.action();
      }
      messageWrapper.innerHTML = "";
      backdrop.classList.remove("huntersHornView__backdrop--active");
      gameInfo.classList.remove("blur");
    });
    buttonSpacer.append(button);
    content.append(buttonSpacer);
    message.append(content);
    if (settings.dismiss) {
      const countdown = makeElement("button", ["huntersHornMessageView__countdown"]);
      makeElement("div", "huntersHornMessageView__countdownButtonImage", "", countdown);
      const svgMarkup = `<svg class="huntersHornMessageView__countdownSVG">
        <circle r="46%" cx="50%" cy="50%" class="huntersHornMessageView__countdownCircleTrack"></circle>
        <circle r="46%" cx="50%" cy="50%" class="huntersHornMessageView__countdownCircle" style="animation-duration: ${settings.dismiss}ms;"></circle>
    </svg>`;
      countdown.innerHTML += svgMarkup;
      countdown.addEventListener("click", () => {
        countdown.classList.add("huntersHornMessageView__countdown--complete");
        messageWrapper.innerHTML = "";
        backdrop.classList.remove("huntersHornView__backdrop--active");
        gameInfo.classList.remove("blur");
      });
      message.append(countdown);
    }
    messageWrapper.append(message);
    const existingMessages = huntersHornView.querySelector(".huntersHornView__message");
    if (existingMessages) {
      existingMessages.remove();
    }
    huntersHornView.append(messageWrapper);
    if (settings.dismiss) {
      setTimeout(() => {
        const countdown = messageWrapper.querySelector(".huntersHornMessageView__countdown");
        if (countdown) {
          countdown.classList.add("huntersHornMessageView__countdown--complete");
        }
        messageWrapper.innerHTML = "";
        backdrop.classList.remove("huntersHornView__backdrop--active");
        gameInfo.classList.remove("blur");
      }, settings.dismiss);
    }
  };

  // src/utils/events.js
  var requestCallbacks = {};
  var onRequestHolder = null;
  var onRequest = (url = null, callback = null, skipSuccess = false, ignore = []) => {
    url = "*" === url ? "*" : `managers/ajax/${url}`;
    if (ignore.includes(url)) {
      return;
    }
    if (!callback) {
      return;
    }
    if (!requestCallbacks[url]) {
      requestCallbacks[url] = [];
    }
    requestCallbacks[url].push({
      callback,
      skipSuccess
    });
    if (onRequestHolder) {
      return;
    }
    const req = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      this.addEventListener("load", function() {
        if (this.responseText) {
          let response = {};
          try {
            response = JSON.parse(this.responseText);
          } catch (e) {
            return;
          }
          Object.keys(requestCallbacks).forEach((key) => {
            if ("*" === key || this.responseURL.includes(key)) {
              requestCallbacks[key].forEach((item) => {
                if (item.callback && typeof item.callback === "function" && (item.skipSuccess || (response == null ? void 0 : response.success))) {
                  item.callback(response);
                }
              });
            }
          });
        }
      });
      Reflect.apply(req, this, arguments);
    };
    onRequestHolder = true;
  };
  var onTravel = (location, options) => {
    eventRegistry.addEventListener("travel_complete", () => onTravelCallback(location, options));
  };
  var onTravelCallback = (location, options) => {
    if (location && location !== getCurrentLocation()) {
      return;
    }
    if (options == null ? void 0 : options.shouldAddReminder) {
      showHornMessage({
        title: options.title || "",
        text: options.text || "",
        button: options.button || "Dismiss",
        action: options.action || null
      });
    }
    if (options.callback) {
      options.callback();
    }
  };
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

  // src/modules/catch-rate-estimate/data.js
  var miceEffs;
  var hasGottenEffs = false;
  var getMiceEffectiveness = () => __async(void 0, null, function* () {
    if (!hasGottenEffs) {
      miceEffs = yield getData("effs");
      hasGottenEffs = true;
    }
    const response = yield doRequest("managers/ajax/users/getmiceeffectiveness.php");
    return response == null ? void 0 : response.effectiveness;
  });
  var getMouse = (mouseId) => __async(void 0, null, function* () {
    if (!miceEffs || !hasGottenEffs) {
      miceEffs = yield getData("effs");
      hasGottenEffs = true;
    }
    const mouse = miceEffs.find((m) => m.type === mouseId);
    return mouse;
  });
  var getMousePower = (mouseId) => __async(void 0, null, function* () {
    var _a;
    const mouse = yield getMouse(mouseId);
    return (_a = mouse == null ? void 0 : mouse.effectivenesses) == null ? void 0 : _a.power;
  });
  var getMouseEffectiveness = (mouseId) => __async(void 0, null, function* () {
    const mouse = yield getMouse(mouseId);
    return mouse.effectivenesses[user.trap_power_type_name.toLowerCase()];
  });
  var getMinluck = (mousePower, effectiveness2) => __async(void 0, null, function* () {
    if (effectiveness2 === 0) {
      return "\u221E";
    }
    const minluck = Math.ceil(
      Math.ceil(Math.sqrt(mousePower / 2)) / Math.min(effectiveness2 / 100, 1.4)
    );
    const checkCatchRate = getCatchRate(mousePower, effectiveness2, 0, minluck);
    return checkCatchRate.rate === 1 ? minluck : minluck + 1;
  });
  var getPercent = (rate) => {
    if (rate === 1) {
      return "100%";
    }
    const percent = (rate * 100).toFixed(2);
    return `${percent}%`;
  };
  var getCatchRate = (mousePower, effectiveness2, power = null, luck = null) => {
    effectiveness2 = effectiveness2 / 100;
    if (null === power) {
      power = user.trap_power;
    }
    if (null === luck) {
      luck = user.trap_luck;
    }
    const rate = Math.min(
      1,
      (effectiveness2 * power + 2 * Math.pow(Math.floor(Math.min(effectiveness2, 1.4) * luck), 2)) / (effectiveness2 * power + mousePower)
    );
    return {
      rate,
      percent: getPercent(rate)
    };
  };

  // src/modules/catch-rate-estimate/styles.css
  var styles_default = '#mh-improved-cre{padding-right:5px;margin:5px 0;cursor:default}#mh-improved-cre table{width:100%}#mh-improved-cre thead{box-shadow:0 -1px #d3cecb inset}.mh-dark-mode #mh-improved-cre thead{box-shadow:0 -1px #5c5c5c inset}#mh-improved-cre table th{font-weight:700;text-align:center}#mh-improved-cre table th.name,#mh-improved-cre table:first-child{text-align:left}.mh-improved-cre-data{min-width:70px;text-align:center}.mh-improved-cre-data-good{color:#138f13}.mh-dark-mode .mh-improved-cre-data-good{color:#4fe54f}.mh-improved-cre-data-bad{color:#bb4646}.mh-dark-mode .mh-improved-cre-data-bad{color:#fb9b9b}.mh-improved-cre-name{padding-left:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mh-improved-cre-name a{color:inherit}#mh-improved-cre.cre-loading{display:flex;align-items:flex-end;justify-content:center;height:100%;min-height:50px;padding:20px 0;background-image:url(https://www.mousehuntgame.com/images/ui/loaders/drip_spinner.gif?asset_cache_version=2);background-repeat:no-repeat;background-position:center 10px;background-size:55px}#mh-improved-cre.cre-loading:after{position:absolute;right:0;bottom:-5px;left:0;font-weight:400;color:#926944;text-align:center;content:"Loading Catch Rate Estimator\\2026"}span.mh-improved-cre-no-mice{font-size:12px}\n';

  // src/modules/catch-rate-estimate/index.js
  var lastStats = [];
  var effectiveness = null;
  var isUpdating = false;
  var updateMinLucks = () => __async(void 0, null, function* () {
    if ("camp" !== getCurrentPage()) {
      return;
    }
    if (isUpdating) {
      return;
    }
    isUpdating = true;
    let minluckList = document.querySelector("#mh-improved-cre");
    if (!minluckList) {
      minluckList = makeElement("div", ["campPage-trap-trapEffectiveness", "cre-loading"]);
      minluckList.id = "mh-improved-cre";
      const statsContainer = document.querySelector(".trapSelectorView__trapStatSummaryContainer");
      if (!statsContainer) {
        isUpdating = false;
        return;
      }
      statsContainer.append(minluckList);
    }
    const currentStats = [
      user.trap_power,
      user.trap_luck,
      user.trap_attraction_bonus,
      user.trap_cheese_effect,
      user.trap_luck,
      user.trap_power,
      user.trap_power_bonus,
      user.trap_power_type_name,
      user.trinket_item_id,
      user.base_item_id,
      user.weapon_item_id,
      user.bait_item_id,
      user.environment_id
    ];
    if (currentStats !== lastStats) {
      effectiveness = yield getMiceEffectiveness();
      lastStats = currentStats;
    }
    if (!effectiveness) {
      isUpdating = false;
      return;
    }
    const miceIds = Object.values(effectiveness).flatMap(({ mice }) => mice).map((mouse) => {
      return {
        name: mouse.name,
        type: mouse.type
      };
    });
    yield renderList(miceIds);
    isUpdating = false;
  });
  var renderList = (list) => __async(void 0, null, function* () {
    let minluckList = document.querySelector("#mh-improved-cre");
    if (!minluckList) {
      minluckList = makeElement("div", "campPage-trap-trapEffectiveness");
      minluckList.id = "mh-improved-cre";
      const statsContainer = document.querySelector(".trapSelectorView__trapStatSummaryContainer");
      if (!statsContainer) {
        return;
      }
      statsContainer.append(minluckList);
      doEvent2("mh-improved-cre-list-rendered");
    }
    const existing = document.querySelector("#mh-improved-cre-table");
    if (existing) {
      existing.remove();
    }
    minluckList.classList.remove("cre-loading");
    const table = makeElement("table");
    table.id = "mh-improved-cre-table";
    const tableheader = makeElement("thead");
    makeElement("th", "name", "Mouse", tableheader);
    makeElement("th", "", "Minluck", tableheader);
    makeElement("th", "", "Catch Rate", tableheader);
    table.append(tableheader);
    const rows = [];
    for (const mouse of list) {
      const mousePower = yield getMousePower(mouse.type);
      const mouseEffectiveness = yield getMouseEffectiveness(mouse.type);
      const minluck = yield getMinluck(mousePower, mouseEffectiveness);
      const catchRate = yield getCatchRate(mousePower, mouseEffectiveness);
      const crClass = ["mh-improved-cre-data"];
      if (catchRate.rate * 100 >= 100) {
        crClass.push("mh-improved-cre-data-good");
      } else if (catchRate.rate * 100 <= 60) {
        crClass.push("mh-improved-cre-data-bad");
      }
      if (user.trap_luck >= minluck) {
        crClass.push("mh-improved-cre-data-minlucked");
      }
      rows.push({
        mouse: mouse.name,
        type: mouse.type,
        minluck,
        catchRateValue: catchRate.rate,
        catchRate: catchRate.percent,
        crClass
      });
    }
    rows.sort((a, b) => {
      if (a.catchRateValue !== b.catchRateValue) {
        return a.catchRateValue - b.catchRateValue;
      }
      return b.minluck - a.minluck;
    });
    if (rows.length === 0) {
      makeElement("span", "mh-improved-cre-no-mice", "No mice found.", table);
      minluckList.append(table);
      return;
    }
    rows.forEach(({ mouse, type, minluck, catchRate, crClass }) => {
      const row = makeElement("tr", "mh-improved-cre-row");
      const name = makeElement("td", "mh-improved-cre-name");
      const nameLink = makeElement("a", "", mouse);
      nameLink.addEventListener("click", (e) => {
        e.preventDefault();
        hg.views.MouseView.show(type);
      });
      name.append(nameLink);
      row.append(name);
      makeElement("td", crClass, minluck, row);
      makeElement("td", crClass, catchRate, row);
      table.append(row);
    });
    minluckList.append(table);
  });
  var main = () => __async(void 0, null, function* () {
    onNavigation(updateMinLucks, {
      page: "camp"
    });
    onRequest("*", updateMinLucks, false, ["users/getmiceeffectiveness.php"]);
    onTravel(null, { callback: updateMinLucks });
  });
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "catch-rate-estimate");
    setTimeout(main, 240);
  });
  var catch_rate_estimate_default = {
    id: "catch-rate-estimate",
    name: "Catch Rate Estimator & Minlucks",
    type: "feature",
    default: true,
    description: "Minluck and catch rate estimates.",
    order: 200,
    load: init
  };
  return __toCommonJS(catch_rate_estimate_exports);
})();
mhImprovedVersion = "0.0.0-userscript-cre"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Minluck & Catch Rate Estimate', 'https://greasyfork.org/en/scripts/449334-mousehunt-minluck-catch-rate-estimate');
