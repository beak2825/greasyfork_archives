// ==UserScript==
// @name        🐭️ MouseHunt - Better Mice
// @description Adds an attraction rate table from MHCT, links to the MouseHunt wiki and MHCT, as well as various other features to the mouse view page.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/449332/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Mice.user.js
// @updateURL https://update.greasyfork.org/scripts/449332/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Mice.meta.js
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

  // src/modules/better-mice/index.js
  var better_mice_exports = {};
  __export(better_mice_exports, {
    default: () => better_mice_default
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
  var addStylesDirect = (styles, identifier = "mh-utils-custom-styles", once = false) => {
    identifier = `mh-utils-${identifier}`;
    const existingStyles = document.querySelector(`#${identifier}`);
    if (existingStyles) {
      if (once) {
        return existingStyles;
      }
      existingStyles.innerHTML += styles;
      return existingStyles;
    }
    const style = document.createElement("style");
    style.id = identifier;
    style.innerHTML = styles;
    document.head.append(style);
    return style;
  };
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
  var saveSettingDirect = (key, value, identifier = "mousehunt-improved-settings") => {
    const settings = getSettingDirect(null, {}, identifier);
    const groupAndKey = getGroupAndKey(key);
    if (groupAndKey.group) {
      if (!settings[groupAndKey.group]) {
        settings[groupAndKey.group] = {};
      }
      settings[groupAndKey.group][groupAndKey.key] = value;
    } else {
      settings[key] = value;
    }
    localStorage.setItem(identifier, JSON.stringify(settings));
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
  var saveSetting = (key, value) => {
    saveSettingDirect(key, value, "mousehunt-improved-settings");
    return value;
  };

  // src/utils/styles/favorite-button.css
  var favorite_button_default = ".custom-favorite-button{top:0;right:0;display:inline-block;width:35px;height:35px;vertical-align:middle;background:url(https://www.mousehuntgame.com/images/ui/camp/trap/star_empty.png?asset_cache_version=2) 50% 50% no-repeat;background-size:90%;border-radius:50%}.custom-favorite-button-small{width:20px;height:20px}.custom-favorite-button:hover{background-color:#fff;background-image:url(https://www.mousehuntgame.com/images/ui/camp/trap/star_favorite.png?asset_cache_version=2);outline:2px solid #ccc}.custom-favorite-button.active{background-image:url(https://www.mousehuntgame.com/images/ui/camp/trap/star_favorite.png?asset_cache_version=2)}.custom-favorite-button.busy{background-image:url(https://www.mousehuntgame.com/images/ui/loaders/small_spinner.gif?asset_cache_version=2)}\n";

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
  var makeLink = (text, href, encodeAsSpace = false) => {
    if (encodeAsSpace) {
      href = href.replaceAll("_", "%20");
    }
    return `<a href="${href}" target="_mouse" class="mousehuntActionButton tiny"><span>${text}</span></a>`;
  };
  var makeFavoriteButton = (options) => __async(void 0, null, function* () {
    addStylesDirect(favorite_button_default, "mh-improved-styles-favorite-button", true);
    const {
      id = null,
      target = null,
      size = "small",
      state = false,
      isSetting = true,
      defaultState = false,
      onChange = null,
      onActivate = null,
      onDeactivate = null
    } = options;
    const existing = document.querySelector(`#${id}`);
    if (existing) {
      existing.remove();
    }
    const star = document.createElement("a");
    star.classList.add("custom-favorite-button");
    if (size === "small") {
      star.classList.add("custom-favorite-button-small");
    }
    star.id = id;
    star.setAttribute("data-item-id", id);
    star.setAttribute("href", "#");
    star.style.display = "inline-block";
    let currentSetting = false;
    currentSetting = isSetting ? getSetting(id, defaultState) : state;
    if (currentSetting) {
      star.classList.add("active");
    } else {
      star.classList.add("inactive");
    }
    star.addEventListener("click", (e) => __async(void 0, null, function* () {
      star.classList.add("busy");
      e.preventDefault();
      e.stopPropagation();
      const currentStar = e.target;
      const currentState = !currentStar.classList.contains("active");
      if (onChange !== null) {
        yield onChange(currentState);
      } else if (isSetting) {
        saveSetting(id, currentState);
      }
      currentStar.classList.remove("inactive");
      currentStar.classList.remove("active");
      if (currentState) {
        currentStar.classList.add("active");
        if (onActivate !== null) {
          yield onActivate(currentState);
        }
      } else {
        currentStar.classList.add("inactive");
        if (onDeactivate !== null) {
          yield onDeactivate(currentState);
        }
      }
      setTimeout(() => {
        currentStar.classList.remove("busy");
      }, 300);
    }));
    if (target) {
      target.append(star);
    }
    return star;
  });
  var makeTooltip = (options) => {
    if (!options.appendTo) {
      return false;
    }
    const { appendTo, className = "", text = "" } = options;
    const tooltip = makeElement("div", ["PreferencesPage__blackTooltip", "mh-improved-tooltip", className]);
    makeElement("span", "PreferencesPage__blackTooltipText", text, tooltip);
    appendTo.append(tooltip);
    return tooltip;
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
  var setPage = (page, ...args) => {
    var _a, _b;
    if ("wiki" === page.toLowerCase()) {
      doEvent("mh-improved-open-wiki");
      return;
    }
    page = page.charAt(0).toUpperCase() + page.slice(1);
    if ((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.setPage) {
      hg.utils.PageUtil.setPage(page, ...args);
    }
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
  var getRelicHunterLocation = () => {
    const cacheExpiry = 5 * 60 * 1e3;
    const cacheKey = "mh-improved-relic-hunter-location";
    let cached = sessionGet(cacheKey);
    if (cached) {
      cached = JSON.parse(cached);
    }
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    return fetch("https://rh-api.mouse.rip/", { headers: getHeaders() }).then((response) => response.json()).then((data) => {
      const expiry = Date.now() + cacheExpiry;
      sessionSet(cacheKey, JSON.stringify({ expiry, data }));
      return data;
    }).catch((error) => {
      console.error(error);
    });
  };

  // src/utils/events.js
  var runCallbacks = (settings, parentNode, callbacks2) => {
    Object.keys(settings).forEach((key) => {
      if (parentNode && parentNode.classList && parentNode.classList.contains(settings[key].selector)) {
        settings[key].isVisible = true;
        if (callbacks2[key] && callbacks2[key].show) {
          callbacks2[key].show();
        }
      } else if (settings[key].isVisible) {
        settings[key].isVisible = false;
        if (callbacks2[key] && callbacks2[key].hide) {
          callbacks2[key].hide();
        }
      }
    });
    return settings;
  };
  var overlayMutationObserver = null;
  var overlayCallbacks = [];
  var onOverlayChange = (callbacks2) => {
    let overlayData = {
      map: {
        isVisible: false,
        selector: "treasureMapPopup"
      },
      item: {
        isVisible: false,
        selector: "itemViewPopup"
      },
      mouse: {
        isVisible: false,
        selector: "mouseViewPopup"
      },
      image: {
        isVisible: false,
        selector: "largerImage"
      },
      convertible: {
        isVisible: false,
        selector: "convertibleOpenViewPopup"
      },
      adventureBook: {
        isVisible: false,
        selector: "adventureBookPopup"
      },
      marketplace: {
        isVisible: false,
        selector: "marketplaceViewPopup"
      },
      gifts: {
        isVisible: false,
        selector: "giftSelectorViewPopup"
      },
      support: {
        isVisible: false,
        selector: "supportPageContactUsForm"
      },
      premiumShop: {
        isVisible: false,
        selector: "MHCheckout"
      }
    };
    overlayCallbacks.push(callbacks2);
    if (overlayMutationObserver) {
      return;
    }
    overlayMutationObserver = true;
    const observer = new MutationObserver(() => {
      overlayCallbacks.forEach((callback) => {
        if (callback.change) {
          callback.change();
        }
        const overlayType = document.querySelector("#overlayPopup");
        if (overlayType && overlayType.classList.length <= 0) {
          return;
        }
        const overlayBg = document.querySelector("#overlayBg");
        if (overlayBg && overlayBg.classList.length > 0) {
          if (callback.show) {
            callback.show();
          }
        } else if (callback.hide) {
          callback.hide();
        }
        overlayData = runCallbacks(overlayData, overlayType, callback);
      });
    });
    const observeTarget = document.querySelector("#overlayPopup");
    if (observeTarget) {
      observer.observe(observeTarget, {
        attributes: true,
        attributeFilter: ["class"]
      });
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

  // src/utils/links.js
  var getCleanSubmenuLabel = (label) => {
    return label.toLowerCase().replaceAll(/[^\da-z]/g, "-");
  };
  var addSubmenuItem = (options) => {
    const settings = Object.assign({}, {
      id: null,
      menu: "kingdom",
      label: "",
      icon: "https://www.mousehuntgame.com/images/ui/hud/menu/special.png",
      href: "",
      class: "",
      callback: null,
      external: false
    }, options);
    const menuTarget = document.querySelector(`.mousehuntHud-menu .${settings.menu}`);
    if (!menuTarget) {
      return;
    }
    if (!menuTarget.classList.contains("hasChildren")) {
      menuTarget.classList.add("hasChildren");
    }
    let hasSubmenu = true;
    let submenu = menuTarget.querySelector("ul");
    if (!submenu) {
      hasSubmenu = false;
      submenu = document.createElement("ul");
    }
    const item = document.createElement("li");
    item.classList.add("custom-submenu-item");
    const label = settings.label.length > 0 ? settings.label : settings.id;
    const cleanLabel = getCleanSubmenuLabel(label);
    const exists = document.querySelector(`#custom-submenu-item-${cleanLabel}`);
    if (exists) {
      exists.remove();
    }
    item.id = settings.id ? `custom-submenu-item-${settings.id}` : `custom-submenu-item-${cleanLabel}`;
    if (settings.class) {
      const classes = settings.class.split(" ");
      item.classList.add(...classes);
    }
    const link = document.createElement("a");
    link.href = settings.href || "#";
    if (settings.callback) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        settings.callback();
      });
    }
    const icon = document.createElement("div");
    icon.classList.add("icon");
    icon.style = `background-image: url(${settings.icon});`;
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerHTML = settings.label;
    link.append(icon);
    link.append(name);
    if (settings.external) {
      const externalLinkIcon = document.createElement("div");
      externalLinkIcon.classList.add("external_icon");
      link.append(externalLinkIcon);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    item.append(link);
    submenu.append(item);
    if (!hasSubmenu) {
      menuTarget.append(submenu);
    }
  };

  // src/utils/maps.js
  var mapper = (key = false) => {
    if (key) {
      const mapperData = getGlobal("mapper");
      if (!mapperData || !mapperData[key]) {
        return false;
      }
      return mapperData[key];
    }
    return getGlobal("mapper");
  };
  var mapData = () => {
    const m = mapper();
    if (!m) {
      return {};
    }
    return m.mapData;
  };
  var getCachedValue = (key) => __async(void 0, null, function* () {
    var _a;
    const value = yield dbGet("ar-cache", key);
    if (!((_a = value == null ? void 0 : value.data) == null ? void 0 : _a.value)) {
      return null;
    }
    return value.data.value;
  });
  var setCachedValue = (key, value) => __async(void 0, null, function* () {
    yield dbSet("ar-cache", { id: key, value });
  });
  var getArForMouse = (id, type = "mouse") => __async(void 0, null, function* () {
    let mhctJson = [];
    const cacheKey = `${type}-${id}`;
    const cachedAr = yield getCachedValue(cacheKey);
    if (cachedAr) {
      return cachedAr;
    }
    const isItem = "item" === type;
    const mhctPath = isItem ? "mhct-item" : "mhct";
    let mhctData = [];
    const data = mapData() || {};
    const mapType = (data == null ? void 0 : data.map_type) || "";
    let url = `https://api.mouse.rip/${mhctPath}/${id}`;
    if (mapType.toLowerCase().includes("halloween")) {
      url = `https://api.mouse.rip/${mhctPath}/${id}-hlw_22`;
    }
    try {
      mhctData = yield fetch(url, { headers: getHeaders() });
    } catch (error) {
      console.error("Error fetching MHCT data:", error);
      yield new Promise((resolve) => setTimeout(resolve, 500));
      try {
        mhctData = yield fetch(url, { headers: getHeaders() });
      } catch (errorRetry) {
        console.error("Error fetching MHCT data:", errorRetry);
        return [];
      }
    }
    if (!mhctData.ok) {
      return [];
    }
    mhctJson = yield mhctData.json();
    if (!mhctJson || mhctJson.length === 0) {
      return [];
    }
    if (isItem) {
      for (const rate of mhctJson) {
        rate.rate = Number.parseInt(rate.drop_pct * 100);
        delete rate.drop_ct;
      }
    }
    if (mhctJson.error) {
      return [];
    }
    mhctJson = mhctJson.filter((rate) => {
      if (rate.rate === 0) {
        return false;
      }
      if (rate.rate === 9999) {
        rate.rate = 1e4;
      }
      return true;
    });
    yield setCachedValue(cacheKey, mhctJson);
    return mhctJson;
  });

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

  // src/modules/better-mice/mouse-page.js
  var makeKingsCrownsTab = () => {
    const tabContainer = document.querySelector(".mousehuntHud-page-tabHeader-container");
    if (!tabContainer) {
      return;
    }
    const existingTab = document.querySelector(".mousehuntHud-page-tabHeader.kings-crowns-tab");
    if (existingTab) {
      return;
    }
    const kingsCrownsTab = makeElement("a", ["mousehuntHud-page-tabHeader", "groups", "kings-crowns-tab"]);
    makeElement("span", "", "King's Crowns", kingsCrownsTab);
    kingsCrownsTab.setAttribute("data-tab", "kings_crowns");
    kingsCrownsTab.setAttribute("data-legacy-mode", "");
    kingsCrownsTab.setAttribute("onclick", "hg.utils.PageUtil.onclickPageTabHandler(this); return false;");
    tabContainer.append(kingsCrownsTab);
    return kingsCrownsTab;
  };
  var makeKingsCrownsTabContentContent = () => {
    const tabContentContainer = document.querySelector(".mousehuntHud-page-tabContentContainer");
    if (!tabContentContainer) {
      return;
    }
    const tabContent = makeElement("div", ["mousehuntHud-page-tabContent", "kings_crowns"]);
    tabContent.setAttribute("data-tab", "kings_crowns");
    tabContent.setAttribute("data-template-file", "AdversariesPage");
    makeElement("div", "mousehuntHud-page-tabContent-loading", "", tabContent);
    const subTabContent = makeElement("div", ["mousehuntHud-page-subTabContent", "all", "active"]);
    subTabContent.setAttribute("data-tab", "all");
    subTabContent.setAttribute("data-template-file", "AdversariesPage");
    subTabContent.setAttribute("data-template", "subtab");
    subTabContent.setAttribute("data-initialized", "");
    subTabContent.setAttribute("data-user-id", "");
    makeElement("div", "mouseCrownsView", "", subTabContent);
    tabContent.append(subTabContent);
    tabContentContainer.append(tabContent);
  };
  var makeMouseCrownSection = (type, mice, header = false, subheader = false) => {
    const wrapper = makeElement("div", ["kings-crown-section", "mouseCrownsView-group", type]);
    if (header) {
      const headerDiv = makeElement("div", "mouseCrownsView-group-header");
      makeElement("div", ["mouseCrownsView-crown", type], "", headerDiv);
      const name = makeElement("div", "mouseCrownsView-group-header-name");
      makeElement("b", false, header, headerDiv);
      if (subheader) {
        makeElement("div", "mouseCrownsView-group-header-subtitle", subheader, name);
      }
      headerDiv.append(name);
      wrapper.append(headerDiv);
    }
    const list = makeElement("div", "mouseCrownsView-group-mice");
    mice.forEach((mouse) => {
      if (!mouse.id) {
        return;
      }
      const mouseWrapper = makeElement("div", "mouseCrownsView-group-mouse");
      mouseWrapper.setAttribute("data-mouse-id", mouse.id);
      mouseWrapper.setAttribute("data-mouse-type", mouse.type);
      mouseWrapper.setAttribute("data-mouse-large", mouse.large);
      mouseWrapper.setAttribute("onclick", "hg.views.MouseCrownsView.showMouseImage(this); return false;");
      if (mouse.landscape) {
        mouseWrapper.classList.add("landscape");
      }
      const innerWrapper = makeElement("div", "mouseCrownsView-group-mouse-padding");
      const image = makeElement("div", ["mouseCrownsView-group-mouse-image", mouse.type]);
      image.setAttribute("data-image", mouse.image);
      image.setAttribute("data-loader", "mouse");
      image.setAttribute("style", `background-image: url("${mouse.image}");`);
      innerWrapper.append(image);
      makeElement("div", "mouseCrownsView-group-mouse-catches", mouse.num_catches, innerWrapper);
      const label = makeElement("div", "mouseCrownsView-group-mouse-label");
      const nameWrapper = makeElement("span", false, "");
      makeElement("div", "mouseCrownsView-group-mouse-name", mouse.name, nameWrapper);
      label.append(nameWrapper);
      innerWrapper.append(label);
      const favoriteButton = makeElement("div", "mouseCrownsView-group-mouse-favouriteButton");
      if (mouse.is_favourite) {
        favoriteButton.classList.add("active");
      }
      favoriteButton.setAttribute("data-mouse-id", mouse.id);
      favoriteButton.setAttribute("onclick", "hg.views.MouseCrownsView.toggleFavouriteHandler(event); return false;");
      innerWrapper.append(favoriteButton);
      mouseWrapper.append(innerWrapper);
      list.append(mouseWrapper);
    });
    wrapper.append(list);
    return wrapper;
  };
  var makeKingsCrownsTabContent = () => __async(void 0, null, function* () {
    var _a, _b, _c, _d;
    makeKingsCrownsTabContentContent();
    let crowns = [];
    const cachedCrowns = sessionGet("kings-crowns");
    const cachedCrownsTime = sessionGet("kings-crowns-time");
    if (cachedCrowns && cachedCrownsTime && Date.now() - cachedCrownsTime < 3e5) {
      crowns = JSON.parse(cachedCrowns);
    } else {
      const crownsReq = yield doRequest("managers/ajax/pages/page.php", {
        page_class: "HunterProfile",
        "page_arguments[tab]": "kings_crowns",
        "page_arguments[sub_tab]": false
      });
      crowns = ((_d = (_c = (_b = (_a = crownsReq == null ? void 0 : crownsReq.page) == null ? void 0 : _a.tabs) == null ? void 0 : _b.kings_crowns) == null ? void 0 : _c.subtabs[0]) == null ? void 0 : _d.mouse_crowns) || [];
      if (crowns.length <= 0) {
        return;
      }
      sessionSet("kings-crowns", crowns);
      sessionSet("kings-crownsTime", Date.now());
    }
    const tabInnerContent = document.querySelector(".mousehuntHud-page-tabContent.kings_crowns");
    if (!tabInnerContent) {
      return;
    }
    if (crowns.favourite_mice_count > 0) {
      const favorites = makeMouseCrownSection("favorites", crowns.favourite_mice);
      const existingFavorites = tabInnerContent.querySelector(".mouseCrownsView-group.favorites");
      if (existingFavorites) {
        existingFavorites.replaceWith(favorites);
      } else {
        tabInnerContent.append(favorites);
      }
    }
    crowns.badge_groups.forEach((group) => {
      var _a2, _b2;
      if (group.mice.length === 0) {
        return;
      }
      group.name = ((_a2 = group == null ? void 0 : group.name) == null ? void 0 : _a2.length) > 0 ? group.name : "No";
      group.catches = ((_b2 = group == null ? void 0 : group.catches) == null ? void 0 : _b2.length) > 0 ? group.catches : "0";
      const section = makeMouseCrownSection(group.type, group.mice, `${group.name} Crown (${group.count})`, `Earned at ${group.catches} catches`);
      const existingSection = tabInnerContent.querySelector(`.mouseCrownsView-group.${group.type}`);
      if (existingSection) {
        existingSection.replaceWith(section);
      } else {
        tabInnerContent.append(section);
      }
    });
  });
  var addKingsCrownsToMicePage = () => __async(void 0, null, function* () {
    makeKingsCrownsTab();
    makeKingsCrownsTabContent();
  });
  var parseImperialWeight = (weightText) => {
    const lbsSplit = weightText.innerText.split("lb.");
    const lbs = lbsSplit.length > 1 ? lbsSplit[0] : 0;
    const ozSplit = weightText.innerText.split("oz.");
    const oz = ozSplit.length > 1 ? ozSplit[0] : 0;
    return Number.parseInt(lbs) * 16 + Number.parseInt(oz);
  };
  var getSetRowValue = (row, type) => {
    let value = 0;
    value = row.getAttribute(`data-sort-value-${type}`);
    if (value) {
      return Number.parseInt(value);
    }
    const valueText = row.querySelector(`${getSelectorPrefix()} .mouseListView-categoryContent-subgroup-mouse-stats.${type}`);
    if (type === "average_weight" || type === "heaviest_catch") {
      if (valueText.innerText.includes("lb") || valueText.innerText.includes("oz")) {
        value = parseImperialWeight(valueText);
      } else if (valueText.innerText.includes("kg")) {
        value = valueText.innerText.replace("kg.", "");
      } else {
        value = 0;
      }
    } else {
      value = valueText.innerText ? valueText.innerText.replaceAll(",", "") || 0 : 0;
    }
    row.setAttribute(`data-sort-value-${type}`, value);
    return Number.parseInt(value);
  };
  var sortStats = (type, reverse = false) => {
    reverse = !reverse;
    let rows = document.querySelectorAll(`${getSelectorPrefix()} .active  .mouseListView-categoryContent-subgroup-mouse:not(:first-child)`);
    if (!rows.length) {
      return;
    }
    const headerRow = document.querySelector(`${getSelectorPrefix()} .active  .mouseListView-categoryContent-subgroup-mouse:first-child`);
    if (!headerRow) {
      return;
    }
    rows.forEach((row) => {
      getSetRowValue(row, type);
    });
    rows = [...rows].sort((a, b) => {
      const aVal = getSetRowValue(a, type);
      const bVal = getSetRowValue(b, type);
      if (aVal === bVal || type === "name") {
        const aNameEl = a.querySelector(".mouseListView-categoryContent-subgroup-mouse-stats.name");
        if (!aNameEl) {
          return 0;
        }
        const bNameEl = b.querySelector(".mouseListView-categoryContent-subgroup-mouse-stats.name");
        if (!bNameEl) {
          return 0;
        }
        const aName = aNameEl.innerText;
        const bName = bNameEl.innerText;
        if (aName === bName) {
          return 0;
        }
        return aName > bName ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    if (reverse) {
      rows = rows.reverse();
    }
    rows.forEach((row) => {
      row.parentNode.append(row);
    });
  };
  var addSortButton = (elements, type) => {
    elements.forEach((el) => {
      const sortButton = makeElement("div", ["sort-button", "unsorted"], "");
      el.addEventListener("click", () => {
        const otherSortButtons = el.parentNode.querySelectorAll(".sort-button");
        otherSortButtons.forEach((button) => {
          if (button !== sortButton) {
            button.classList.remove("reverse");
            button.classList.add("unsorted");
          }
        });
        if (sortButton.classList.contains("unsorted")) {
          sortButton.classList.remove("unsorted");
          sortStats(type);
          return;
        }
        if (sortButton.classList.contains("reverse")) {
          sortButton.classList.remove("reverse");
          sortStats(type);
          return;
        }
        sortButton.classList.add("reverse");
        sortStats(type, true);
      });
      el.append(sortButton);
    });
  };
  var getSelectorPrefix = () => {
    const currentTab = getCurrentTab();
    let currentSubtab = getCurrentSubtab();
    if (currentTab === currentSubtab) {
      currentSubtab = false;
    }
    return `.${currentTab} .mousehuntHud-page-subTabContent.active${currentSubtab ? `.${currentSubtab}` : ""}`;
  };
  var addSortingToCat = (cat, retries = 0) => {
    const cats = [
      "name",
      "catches",
      "misses",
      "average_weight",
      "heaviest_catch"
    ];
    const selector = `${getSelectorPrefix()} .mouseListView-categoryContent-category[data-category="${cat}"]`;
    const category = document.querySelector(selector);
    if (!category || category && category.classList.contains("loading")) {
      if (retries > 10) {
        return;
      }
      setTimeout(() => addSortingToCat(cat, retries + 1), 300);
      return;
    }
    if (category.getAttribute("data-added-sorting")) {
      return;
    }
    cats.forEach((mCat) => {
      const els = category.querySelectorAll(`${getSelectorPrefix()} .mouseListView-categoryContent-category.all.active .mouseListView-categoryContent-subgroup-mouse.header .mouseListView-categoryContent-subgroup-mouse-stats.${mCat}`);
      if (els.length) {
        addSortButton(els, mCat);
      }
    });
    category.setAttribute("data-added-sorting", true);
    const rows = category.querySelectorAll(`${getSelectorPrefix()} .mouseListView-categoryContent-subgroup-mouse:not(:first-child)`);
    if (!rows.length) {
      return;
    }
    rows.forEach((row) => {
      const catches = row.querySelector(`${getSelectorPrefix()} .mouseListView-categoryContent-subgroup-mouse-stats.catches`);
      if (!catches) {
        return;
      }
      const value = catches.innerText ? catches.innerText.replaceAll(",", "") || 0 : 0;
      if (value >= 2500) {
        row.classList.add("crown", "diamond");
      } else if (value >= 1e3) {
        row.classList.add("crown", "platinum");
      } else if (value >= 500) {
        row.classList.add("crown", "gold");
      } else if (value >= 100) {
        row.classList.add("crown", "silver");
      } else if (value >= 10) {
        row.classList.add("crown", "bronze");
      }
    });
  };
  var hasAddedSortingTabClickListeners = false;
  var addSortingTabClickListeners = () => {
    if (hasAddedSortingTabClickListeners) {
      return;
    }
    hasAddedSortingTabClickListeners = true;
    const _categoryClickHandler = hg.views.MouseListView.categoryClickHandler;
    hg.views.MouseListView.categoryClickHandler = (el) => {
      _categoryClickHandler(el);
      addSortingToCat(el.getAttribute("data-category"));
    };
  };
  var clickCurrentTab = () => {
    const activeTab = document.querySelector(".mousehuntHud-page-tabContent.active .mousehuntHud-page-subTabContent.active .mouseListView-categoryContainer.active a");
    if (!activeTab) {
      setTimeout(clickCurrentTab, 250);
      return;
    }
    addSortingToCat(activeTab.getAttribute("data-category"));
    hg.views.MouseListView.categoryClickHandler(activeTab);
  };
  var addSortingToStatsPage = () => {
    addSortingTabClickListeners();
    clickCurrentTab();
  };
  var mouse_page_default = () => __async(void 0, null, function* () {
    var _a, _b;
    if ("adversaries" === getCurrentPage() && getCurrentTab() === "kings_crowns") {
      addKingsCrownsToMicePage();
      const tab = document.querySelector(".mousehuntHud-page-tabHeader.kings-crowns-tab");
      if (tab && ((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.onclickPageTabHandler)) {
        hg.utils.PageUtil.onclickPageTabHandler(tab);
      }
    }
    onNavigation(addKingsCrownsToMicePage, {
      page: "adversaries"
    });
    onNavigation(addSortingToStatsPage, {
      page: "adversaries",
      tab: "your_stats",
      subtab: "group"
    });
    onNavigation(addSortingToStatsPage, {
      page: "adversaries",
      tab: "your_stats",
      subtab: "location"
    });
    onEvent("set_tab", () => {
      if ("your_stats" === getCurrentTab()) {
        addSortingToStatsPage();
      }
    });
    onNavigation(addSortingToStatsPage, {
      page: "hunterprofile",
      tab: "mice"
    });
  });

  // src/modules/better-mice/settings/index.js
  var settings_default = () => __async(void 0, null, function* () {
    return [
      {
        id: "better-mice.show-attraction-rates",
        title: "Show attraction rates",
        default: true
      },
      {
        id: "better-mice.show-mouse-hover",
        title: "Show mice details on hover (in journal)"
      },
      {
        id: "better-mice.show-sidebar",
        title: "Show available mice in sidebar",
        default: true
      }
    ];
  });

  // src/modules/better-mice/styles.css
  var styles_default = '.mouseView-titleContainer{height:26px}.mouseView-values{float:none;font-size:11px;line-height:unset}.mouseView-title{font-size:1.2em;line-height:24px}.mh-ui-mouse-links{display:inline-block;float:right;margin-right:15px}.mh-ui-mouse-links-map{display:flex;justify-content:center;padding-bottom:5px}.mh-ui-mouse-links a{margin-right:10px}.mh-ui-mouse-links-map a{margin:10px 10px 10px 0}.mouseview-title-group{font-size:11px}.mh-ui-mouse-links-map .mousehuntActionButton.tiny{margin:3px}.mouseView-movedContainer{display:flex;flex-flow:row wrap;gap:10px}.mouseview-has-mhct .mouseView-weaknessContainer{display:flex;flex-direction:column;align-items:center;width:90px}.mouseview-has-mhct .mouseView-categoryContent-subgroup-mouse-weaknesses{width:100%}.mouseview-has-mhct .mouseView-socialContainer{display:none}.mouseview-has-mhct .mouseView-statsContainer{display:flex;align-items:stretch;width:155px}.mouseview-has-mhct .mouseView-statsContainer-block-padding{display:flex;flex-direction:column;align-items:center;min-width:125px;padding:10px}.mouseview-has-mhct .mouseView-descriptionContainer{width:100%}.mouseView-categoryContent-subgroup-mouse-weaknesses-label{font-size:12px;font-weight:400;font-variant:none}.mouseview-has-mhct .mouseView-difficulty{display:none}.mouseview-has-mhct .mouse-ar-wrapper{display:grid;grid-template-columns:1fr 1fr 50px;gap:10px;place-items:center stretch;width:100%;padding:5px;margin:5px 0;font-size:12px}.mouseview-has-mhct .has-stages .mouse-ar-wrapper{grid-template-columns:3fr 2fr 2fr 50px}.mouseview-has-mhct .mouse-ar-wrapper div{padding:0 2px;font-size:12px}.mouseview-has-mhct .mice-ar-wrapper{margin-right:10px}.mouseview-has-mhct .mouse-ar-wrapper div.rate{font-size:13px}.mouseview-has-mhct .ar-header{display:flex;align-items:center;justify-content:space-between;height:26px;padding-bottom:2px;margin-top:10px;font-size:12px;font-weight:900;border-bottom:1px solid #ccc}.mouseview-has-mhct .ar-link{font-weight:400}.mouseview-has-mhct .rate{text-align:right}.mouseview-has-mhct .mouse-ar-wrapper:nth-child(odd){background-color:#e7e7e7}.mouseview-has-mhct .mouseView-description{font-weight:500;line-height:19px}.mh-ui-mouse-links-map-name{color:#3b5998;cursor:pointer}.treasureMapView-highlight-name{padding:5px 0 10px;font-weight:400;text-align:center}.mh-ui-mouse-links-map-name:hover{text-decoration:underline}.mh-ui-mouse-links-map .treasureMapView-highlight-group{text-align:center}.mouseView-image{box-shadow:none}.mouseView-image:hover{box-shadow:1px 1px 2px #e70}.mouseView a.custom-favorite-button,.mouseView a.custom-favorite-button-small{position:absolute;top:15px;left:15px;width:30px;height:30px;background-size:contain}#custom-submenu-item-king-s-crowns .icon{filter:sepia(1) brightness(.5)}.mouseView-statsContainer-block-padding abbr{text-decoration:none}.mouseView-statsContainer-block-padding{padding:5px}a.mouseListView-categoryContent-subgroup-mouse-thumb{position:relative}.crown .mouseListView-categoryContent-subgroup-mouse-thumb:after{position:absolute;top:-4px;left:-8px;z-index:2;width:20px;height:20px;content:"";background-color:#fdfdfa;background-size:contain;border:1px solid #929292;border-radius:50%}.crown.bronze .mouseListView-categoryContent-subgroup-mouse-thumb:after{background-image:url(https://www.mousehuntgame.com/images/ui/crowns/crown_bronze.png)}.crown.silver .mouseListView-categoryContent-subgroup-mouse-thumb:after{background-image:url(https://www.mousehuntgame.com/images/ui/crowns/crown_silver.png)}.crown.gold .mouseListView-categoryContent-subgroup-mouse-thumb:after{background-image:url(https://www.mousehuntgame.com/images/ui/crowns/crown_gold.png)}.crown.diamond .mouseListView-categoryContent-subgroup-mouse-thumb:after{background-image:url(https://www.mousehuntgame.com/images/ui/crowns/crown_diamond.png)}.crown.platinum .mouseListView-categoryContent-subgroup-mouse-thumb:after{background-image:url(https://www.mousehuntgame.com/images/ui/crowns/crown_platinum.png)}.mouseListView-categoryContent-subgroup-mouse-thumb,.mouseListView-categoryContent-subgroup-mouse .mouseListView-categoryContent-subgroup-mouse-margin{transition:.2s ease-in}.mouseListView-categoryContent-subgroup-mouse-thumb:hover{transform:scale(1.2)}a.mouseListView-categoryContent-subgroup-mouse:hover .mouseListView-categoryContent-subgroup-mouse-margin{background-size:contain}.mouseViewPopup .mouseView-image:hover{box-shadow:none;transform:scale(.95)}.mouseViewPopup .mouseView-image{margin-bottom:10px;transition:.2s ease-in}.mouseViewPopup .mouseView-descriptionContainer{display:grid;grid-template-columns:3fr 2fr;justify-items:stretch}.mouseViewPopup .mouseView-values{margin-left:0}.mouseViewPopup .mouseView-description{grid-column:span 2;padding-top:5px}.mouseViewPopup .mouseView-group.mouseview-title-group{text-align:right}img.minluck-power-type-img{width:20px}li.minluck-item{display:inline-flex;gap:3px;align-items:center;width:auto;padding:2px;margin:2px;font-size:12px;background-color:#f2f2f2;border:1px solid #ccc;border-radius:8px}ul.minluck-list{display:flex;flex-wrap:wrap;place-content:center flex-start;width:auto;margin-right:-5px}.minluck-title{display:flex;align-items:center;justify-content:space-between;padding-bottom:2px;margin-top:10px;margin-bottom:5px;font-size:12px;font-weight:900;border-bottom:1px solid #ccc}.mouseview-relicHunter{display:flex;align-items:center;justify-content:space-around;width:100%;padding:10px;font-size:15px;background-color:#edd1f3;border-radius:10px}\n';

  // src/modules/better-mice/index.js
  var getLinkMarkup = (name) => {
    return makeLink("MHCT AR", `https://www.mhct.win/attractions.php?mouse_name=${name}`) + makeLink("Wiki", `https://mhwiki.hitgrab.com/wiki/index.php/${name}`);
  };
  var addLinks = () => {
    const title = document.querySelector(".mouseView-title");
    if (!title) {
      return;
    }
    const currentLinks = document.querySelector(".mh-ui-mouse-links");
    if (currentLinks) {
      currentLinks.remove();
    }
    const div = document.createElement("div");
    div.classList.add("mh-ui-mouse-links");
    div.innerHTML = getLinkMarkup(title.innerText);
    title.parentNode.insertBefore(div, title);
    const values = document.querySelector(".mouseView-values");
    const desc = document.querySelector(".mouseView-descriptionContainer");
    if (values && desc) {
      desc.insertBefore(values, desc.firstChild);
    }
  };
  var isFavorite = (mouseId) => __async(void 0, null, function* () {
    var _a, _b, _c, _d, _e;
    const favorites = yield doRequest("managers/ajax/pages/page.php", {
      page_class: "HunterProfile",
      "page_arguments[tab]": "kings_crowns",
      "page_arguments[sub_tab]": false,
      "page_arguments[snuid]": window.user.sn_user_id
    });
    if (!((_e = (_d = (_c = (_b = (_a = favorites == null ? void 0 : favorites.page) == null ? void 0 : _a.tabs) == null ? void 0 : _b.kings_crowns) == null ? void 0 : _c.subtabs[0]) == null ? void 0 : _d.mouse_crowns) == null ? void 0 : _e.favourite_mice.length)) {
      return false;
    }
    return favorites.page.tabs.kings_crowns.subtabs[0].mouse_crowns.favourite_mice.some((mouse) => {
      return mouse.id && mouse.id === Number.parseInt(mouseId, 10);
    });
  });
  var addFavoriteButton = (mouseId, mouseView) => __async(void 0, null, function* () {
    const state = yield isFavorite(mouseId);
    const fave = yield makeFavoriteButton({
      target: mouseView,
      size: "large",
      isSetting: false,
      state,
      onChange: () => {
        doRequest("managers/ajax/mice/mouse_crowns.php", {
          action: "toggle_favourite",
          user_id: window.user.user_id,
          mouse_id: mouseId
        });
      }
    });
    mouseView.append(fave);
  });
  var addMinluck = (mouseId, mouseView) => __async(void 0, null, function* () {
    const appendTo = mouseView.querySelector(".mouseView-contentContainer");
    if (!appendTo) {
      return;
    }
    const minluckContainer = makeElement("div", "minluck-container");
    const titleText = makeElement("div", "minluck-title", "Minlucks");
    makeTooltip({
      appendTo: titleText,
      text: "If your current luck is above the minluck, you are guaranteed to catch the mouse if you attract it."
    });
    minluckContainer.append(titleText);
    const minluckList = makeElement("ul", "minluck-list");
    const minluck = minlucks.find((m) => m.id === Number.parseInt(mouseId, 10));
    const mouseMinlucks = (minluck == null ? void 0 : minluck.minlucks) || {};
    Object.keys(mouseMinlucks).forEach((powerType) => {
      if (!mouseMinlucks[powerType] || "\u221E" === mouseMinlucks[powerType]) {
        return;
      }
      const minluckItem = makeElement("li", "minluck-item");
      const powerTypeImg = makeElement("img", "minluck-power-type-img");
      powerTypeImg.src = `https://www.mousehuntgame.com/images/powertypes/${powerType.toLowerCase()}.png`;
      minluckItem.append(powerTypeImg);
      makeElement("div", "minluck-power-type-minluck", mouseMinlucks[powerType], minluckItem);
      minluckList.append(minluckItem);
    });
    minluckContainer.append(minluckList);
    appendTo.append(minluckContainer);
  });
  var addWisdom = (mouseId, mouseView) => __async(void 0, null, function* () {
    const values = mouseView.querySelector(".mouseView-values");
    if (!values) {
      return;
    }
    let wisdom = wisdoms.find((m) => m.id === Number.parseInt(mouseId, 10));
    wisdom = (wisdom == null ? void 0 : wisdom.wisdom) || 0;
    wisdom = wisdom.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
    makeElement("span", "wisdom-container", ` / ${wisdom} Wisdom`, values);
  });
  var updateMouseView = () => __async(void 0, null, function* () {
    const mouseView = document.querySelector("#overlayPopup .mouseView");
    if (!mouseView) {
      return;
    }
    const mouseId = mouseView.getAttribute("data-mouse-id");
    if (!mouseId) {
      return;
    }
    const name = mouseView.querySelector(".mouseView-title");
    if (!name) {
      return;
    }
    const catchesEl = document.querySelectorAll(".mouseView-statsContainer-block-padding td abbr");
    if (catchesEl && catchesEl.length > 0) {
      catchesEl.forEach((el) => {
        const catchesNumber = el.getAttribute("title").replace(" Catches", "").replace(" catches", "").replace(" Misses", "").replace(" misses", "").trim();
        if (catchesNumber) {
          el.innerText = catchesNumber;
        }
      });
    }
    addLinks();
    addFavoriteButton(mouseId, mouseView);
    addMinluck(mouseId, mouseView);
    addWisdom(mouseId, mouseView);
    mouseView.classList.add("mouseview-has-mhct");
    const group = document.querySelector(".mouseView-group");
    if (group) {
      group.classList.add("mouseview-title-group");
      const descContainer = document.querySelector(".mouseView-descriptionContainer");
      if (descContainer) {
        if (descContainer.childNodes.length > 1) {
          descContainer.insertBefore(group, descContainer.childNodes[1]);
        } else {
          descContainer.append(group);
        }
      }
    }
    const groupTitle = mouseView.querySelector(".mouseView-group.mouseview-title-group");
    if (groupTitle) {
      let newHtml = groupTitle.innerHTML.replace("Group: ", "");
      const subGroups = newHtml.split("(");
      if (subGroups.length > 1) {
        newHtml = `<span class="mouseview-group">${subGroups[0]}</span><span class="mouseview-subgroup">(${subGroups[1]}</span>`;
        groupTitle.classList.add("mouseview-title-group-has-subgroup");
      } else {
        newHtml = `<span class="mouseview-group">${newHtml}</span>`;
      }
      groupTitle.innerHTML = newHtml;
    }
    const container = mouseView.querySelector(".mouseView-contentContainer");
    if (!container) {
      return;
    }
    const imageContainer = mouseView.querySelector(".mouseView-imageContainer");
    if (imageContainer) {
      const movedContainer = makeElement("div", "mouseView-movedContainer");
      const statsContainer = mouseView.querySelector(".mouseView-statsContainer");
      if (statsContainer) {
        movedContainer.append(statsContainer);
      }
      const weaknessContainer = mouseView.querySelector(".mouseView-weaknessContainer");
      if (weaknessContainer) {
        movedContainer.append(weaknessContainer);
        const weaknesses = weaknessContainer.querySelectorAll(".mouseView-categoryContent-subgroup-mouse-weaknesses-padding");
        weaknesses.forEach((w) => {
          const weakness = w.querySelector(".mouseView-weakness");
          if (!weakness) {
            w.classList.add("mouseview-weakness-empty");
            w.classList.add("hidden");
          }
        });
      }
      if (401 === Number.parseInt(mouseId, 10)) {
        const location = yield getRelicHunterLocation();
        if (location && location.name) {
          const relicHunterBox = makeElement("div", ["mouseview-relicHunter", "mouseview-relicHunter"]);
          makeElement("div", "hint", location.name, relicHunterBox);
          const button = makeElement("div", ["mousehuntActionButton", "small"]);
          makeElement("span", "", "Travel", button);
          button.addEventListener("click", () => {
            app.pages.TravelPage.travel(location.id);
            setPage("Camp");
          });
          relicHunterBox.append(button);
          movedContainer.append(relicHunterBox);
        }
      }
      imageContainer.append(movedContainer);
    }
    if (!getSetting("better-mice.show-attraction-rates", true)) {
      return;
    }
    const arWrapper = makeElement("div", "ar-wrapper");
    const title = makeElement("div", "ar-header");
    const titleText = makeElement("div", "ar-title", "Attraction Rates", title);
    makeTooltip({
      appendTo: titleText,
      text: 'The best location and bait, according to data gathered by <a href="https://mhct.win/" target="_blank" rel="noopener noreferrer">MHCT</a>.'
    });
    const link = makeElement("a", "ar-link", "View on MHCT \u2192");
    link.href = `https://www.mhct.win/attractions.php?mouse_name=${name.innerText}`;
    link.target = "_mhct";
    title.append(link);
    arWrapper.append(title);
    let mhctJson = yield getArForMouse(mouseId, "mouse");
    if (!mhctJson || mhctJson === void 0 || mhctJson.length === 0 || "error" in mhctJson) {
      return;
    }
    mhctJson = mhctJson.slice(0, 15);
    const miceArWrapper = makeElement("div", "mice-ar-wrapper");
    const hasStages = mhctJson.some((mouseAr) => mouseAr.stage);
    if (hasStages) {
      miceArWrapper.classList.add("has-stages");
    }
    mhctJson.forEach((mouseAr) => {
      const mouseArWrapper = makeElement("div", "mouse-ar-wrapper");
      makeElement("div", "location", mouseAr.location, mouseArWrapper);
      if (hasStages) {
        makeElement("div", "stage", mouseAr.stage, mouseArWrapper);
      }
      makeElement("div", "cheese", mouseAr.cheese, mouseArWrapper);
      makeElement("div", "rate", `${(mouseAr.rate / 100).toFixed(2)}%`, mouseArWrapper);
      miceArWrapper.append(mouseArWrapper);
    });
    if (mhctJson.length > 0) {
      arWrapper.append(miceArWrapper);
      container.append(arWrapper);
    }
  });
  var _original;
  var replaceShowMouseImage = () => {
    if (_original) {
      return;
    }
    _original = hg.views.MouseCrownsView.showMouseImage;
    hg.views.MouseCrownsView.showMouseImage = (element) => {
      const type = element.getAttribute("data-mouse-type");
      if (type) {
        hg.views.MouseView.show(type);
        return;
      }
      _original(element);
    };
  };
  var main = () => __async(void 0, null, function* () {
    onOverlayChange({ mouse: { show: updateMouseView } });
    minlucks = yield getData("minlucks");
    wisdoms = yield getData("wisdom");
    addSubmenuItem({
      menu: "mice",
      label: "Groups",
      icon: "https://www.mousehuntgame.com/images/ui/hud/menu/mice.png?asset_cache_version=2",
      href: "https://www.mousehuntgame.com/adversaries.php?tab=groups"
    });
    addSubmenuItem({
      menu: "mice",
      label: "Regions",
      icon: "https://www.mousehuntgame.com/images/ui/hud/menu/travel.png?asset_cache_version=2",
      href: "https://www.mousehuntgame.com/adversaries.php?tab=regions"
    });
    addSubmenuItem({
      menu: "mice",
      label: "Your Stats",
      icon: "https://www.mousehuntgame.com/images/ui/hud/menu/special.png?asset_cache_version=2",
      href: "https://www.mousehuntgame.com/adversaries.php?tab=your_stats"
    });
    addSubmenuItem({
      menu: "mice",
      label: "King's Crowns",
      icon: "https://www.mousehuntgame.com/images/ui/crowns/crown_silver.png?asset_cache_version=2",
      href: "https://www.mousehuntgame.com/adversaries.php?tab=kings_crowns"
    });
  });
  var wisdoms;
  var minlucks;
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "better-mice");
    main();
    mouse_page_default();
    if (getSetting("better-mice.show-mouse-hover", true)) {
    }
    if (getSetting("better-mice.show-mice-sidebar", true)) {
    }
    replaceShowMouseImage();
  });
  var better_mice_default = {
    id: "better-mice",
    name: "Better Mice",
    type: "better",
    default: true,
    description: "Adds attraction rate stats and links to MHWiki and MHCT to mouse dialogs. Adds sorting to the mouse stats pages, and adds the King's Crown tab to the mouse pages.",
    load: init,
    settings: settings_default
  };
  return __toCommonJS(better_mice_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Better Mice', 'https://greasyfork.org/en/scripts/449332-mousehunt-mouse-links');
