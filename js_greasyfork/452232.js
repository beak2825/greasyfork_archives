// ==UserScript==
// @name        🐭️ MouseHunt - Better Travel / Travel Tweaks
// @description Makes the travel page better.
// @version     3.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/452232/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Travel%20%20Travel%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/452232/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Travel%20%20Travel%20Tweaks.meta.js
// ==/UserScript==

var mhui = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // src/modules/better-travel/index.js
  var better_travel_exports = {};
  __export(better_travel_exports, {
    default: () => better_travel_default
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
  var createPopup = (options) => {
    if ("undefined" === typeof jsDialog || !jsDialog) {
      return false;
    }
    const settings = Object.assign({}, {
      title: "",
      content: "",
      hasCloseButton: true,
      template: "default",
      show: true,
      className: ""
    }, options);
    const popup = new jsDialog();
    popup.setIsModal(!settings.hasCloseButton);
    popup.setTemplate(settings.template);
    popup.addToken("{*title*}", settings.title);
    popup.addToken("{*content*}", settings.content);
    popup.setAttributes({
      className: settings.className
    });
    if (settings.show) {
      popup.show();
    }
    return popup;
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
  var debug = (message, ...args) => {
    if (getSetting("debug.module", false) || getGlobal("mh-improved-updating") || getGlobal("mh-improved-debug")) {
      console.log(
        `%cMH Improved%c: ${message}`,
        "color: #90588c; font-weight: 900",
        "color: inherit; font-weight: inherit",
        ...args
      );
    }
  };
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
  var setTab = (tab, ...args) => {
    var _a, _b;
    if ((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.setPageTab) {
      hg.utils.PageUtil.setPageTab(tab, ...args);
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
  var getCurrentLocation = () => {
    const location = (user == null ? void 0 : user.environment_type) || "";
    return location.toLowerCase();
  };
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
  var getDialogMapping = () => {
    return {
      treasureMapPopup: "map",
      itemViewPopup: "item",
      mouseViewPopup: "mouse",
      largerImage: "image",
      convertibleOpenViewPopup: "convertible",
      adventureBookPopup: "adventureBook",
      marketplaceViewPopup: "marketplace",
      giftSelectorViewPopup: "gifts",
      supportPageContactUsForm: "support",
      MHCheckout: "premiumShop"
    };
  };
  var onDialogHide = (callback, overlay = null, once = false) => {
    eventRegistry.addEventListener("js_dialog_hide", () => {
      var _a, _b;
      const dialogType = ((_b = (_a = window == null ? void 0 : window.mhutils) == null ? void 0 : _a.lastDialog) == null ? void 0 : _b.overlay) || null;
      window.mhutils = window.mhutils ? __spreadProps(__spreadValues({}, window.mhutils), { lastDialog: null }) : null;
      if (!overlay) {
        return callback();
      }
      const dialogMapping = getDialogMapping();
      if (overlay === dialogType || overlay === dialogMapping[dialogType]) {
        return callback();
      }
    }, null, once);
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

  // src/utils/flags.js
  var getFlag = (flag) => {
    return getSetting(`experiments.${flag}`, getFlags().includes(flag));
  };
  var getFlags = () => {
    return getSetting("override-flags", "").toLowerCase().replaceAll(" ", "").split(",");
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
  var removeSubmenuItem = (id) => {
    id = getCleanSubmenuLabel(id);
    const item = document.querySelector(`#custom-submenu-item-${id}`);
    if (item) {
      item.remove();
    }
  };
  var addSubmenuDivider = (menu, className = "") => {
    addSubmenuItem({
      menu,
      id: `mh-improved-submenu-divider-${className}`,
      label: "",
      icon: "",
      href: "",
      class: `mh-improved-submenu-divider ${className}`
    });
  };

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/utils/user.js
  var normalizeTitle = (title = "") => {
    if (!title) {
      return "";
    }
    const normalizedTitle = title.toLowerCase().replaceAll(" ", "").replaceAll("/", "_").replaceAll("journeyman_journeywoman", "journeyman").replaceAll("journeywoman", "journeyman").replaceAll("lord_lady", "lord").replaceAll("lady", "lord").replaceAll("baron_baroness", "baron").replaceAll("baroness", "baron").replaceAll("count_countess", "count").replaceAll("countess", "count").replaceAll("grand_duke_grand_duchess", "grand_duke").replaceAll("grand_duchess", "grand_duke").replaceAll("archduke_archduchess", "archduke").replaceAll("archduchess", "archduke").replaceAll("duke_duchess", "duke").replaceAll("duke_dutchess", "duke").replaceAll("duchess", "duke").replaceAll("grand_duke", "grandduke").replaceAll("/", "").replaceAll(" ", "").toLowerCase();
    return normalizedTitle;
  };
  var isUserTitleAtLeast = (title) => {
    const titles = [
      "novice",
      "recruit",
      "apprentice",
      "initiate",
      "journeyman",
      "master",
      "grandmaster",
      "legendary",
      "hero",
      "knight",
      "lord",
      "baron",
      "count",
      "duke",
      "grandduke",
      "archduke",
      "viceroy",
      "elder",
      "sage",
      "fable"
    ];
    const titleIndex = titles.indexOf(normalizeTitle(user.title_name));
    const checkIndex = titles.indexOf(normalizeTitle(title));
    return titleIndex >= checkIndex;
  };

  // src/modules/better-travel/travel-utils.js
  var getTravelSetting = (settingName, defaultValue) => {
    return getSetting(`better-travel.${settingName}`, defaultValue);
  };
  var saveTravelSetting = (settingName, value) => {
    saveSetting(`better-travel.${settingName}`, value);
  };
  var travelTo = (location) => {
    const header = document.querySelector(".mousehuntHeaderView");
    if (header) {
      const existing = header.querySelector(".mh-improved-travel-message");
      if (existing) {
        existing.remove();
      }
      makeElement("div", ["mh-improved-travel-message", "travelPage-map-message"], "Traveling...", header);
    }
    app.pages.TravelPage.travel(location);
  };

  // src/modules/better-travel/reminders.js
  var addReminders = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E;
    const reminderOpts = {
      title: "Travel Reminder",
      dismiss: 4e3
    };
    switch (getCurrentLocation()) {
      case "rift_valour":
        if ((_b = (_a = user.quests) == null ? void 0 : _a.QuestRiftValour) == null ? void 0 : _b.is_fuel_enabled) {
          reminderOpts.text = "Champion's Fire is active.";
          reminderOpts.image = "https://www.mousehuntgame.com/images/items/stats/transparent_thumb/6622efd1db7028b30f48b15771138720.png?cv=2";
          reminderOpts.button = "Deactivate";
          reminderOpts.action = () => {
            const button = document.querySelector(".valourRiftHUD-fuelContainer-armButton");
            if (button) {
              button.click();
            }
          };
        }
        break;
      case "queso_river":
      case "queso_plains":
      case "queso_quarry":
      case "queso_geyser":
        if (((_d = (_c = user.quests) == null ? void 0 : _c.QuestQuesoCanyon) == null ? void 0 : _d.is_wild_tonic_active) || ((_f = (_e = user.quests) == null ? void 0 : _e.QuestQuesoGeyser) == null ? void 0 : _f.is_wild_tonic_enabled)) {
          reminderOpts.text = "Wild Tonic is active.";
          reminderOpts.image = "https://www.mousehuntgame.com/images/items/stats/transparent_thumb/b6b9f97a1ee3692fdff0b5a206adf7e1.png?cv=2";
          reminderOpts.button = "Deactivate";
          reminderOpts.action = () => {
            const button = document.querySelector(".quesoHUD-wildTonic-button");
            if (button) {
              button.click();
            }
          };
        }
        break;
      case "floating_islands":
        if ("launch_pad_island" === ((_i = (_h = (_g = user.quests) == null ? void 0 : _g.QuestFloatingIslands) == null ? void 0 : _h.hunting_site_atts) == null ? void 0 : _i.island_power_type)) {
          break;
        }
        if (!((_l = (_k = (_j = user.quests) == null ? void 0 : _j.QuestFloatingIslands) == null ? void 0 : _k.hunting_site_atts) == null ? void 0 : _l.is_fuel_enabled) && // BW not active.
        !(((_o = (_n = (_m = user.quests) == null ? void 0 : _m.QuestFloatingIslands) == null ? void 0 : _n.hunting_site_atts) == null ? void 0 : _o.is_vault_island) && // is SP.
        ((_s = (_r = (_q = (_p = user.quests) == null ? void 0 : _p.QuestFloatingIslands) == null ? void 0 : _q.hunting_site_atts) == null ? void 0 : _r.island_mod_panels[2]) == null ? void 0 : _s.is_complete))) {
          reminderOpts.text = "Bottled Wind is <strong>not</strong> active.";
          reminderOpts.image = "https://www.mousehuntgame.com/images/ui/hud/floating_islands/items/bottled_wind_stat_item.png?asset_cache_version=2";
          reminderOpts.button = "Activate";
          reminderOpts.action = () => {
            const button = document.querySelector(".floatingIslandsHUD-fuel-button");
            if (button) {
              button.click();
            }
          };
        }
        break;
      case "foreword_farm":
      case "prologue_pond":
      case "table_of_contents":
        if (((_u = (_t = user.quests) == null ? void 0 : _t.QuestProloguePond) == null ? void 0 : _u.is_fuel_enabled) || ((_w = (_v = user.quests) == null ? void 0 : _v.QuestForewordFarm) == null ? void 0 : _w.is_fuel_enabled) || ((_y = (_x = user.quests) == null ? void 0 : _x.QuestTableOfContents) == null ? void 0 : _y.is_fuel_enabled)) {
          reminderOpts.text = "Condensed Creativity is active.";
          reminderOpts.button = "Deactivate";
        } else {
          reminderOpts.text = "Condensed Creativity is <strong>not</strong> active.";
          reminderOpts.button = "Activate";
        }
        reminderOpts.image = "https://www.mousehuntgame.com/images/items/stats/transparent_thumb/4f5d55c1eff77474c7363f0e52d03e49.png?cv=2";
        reminderOpts.action = hg.views.HeadsUpDisplayFolkloreForestRegionView.toggleFuel;
        break;
      case "winter_hunt_grove":
      case "winter_hunt_workshop":
      case "winter_hunt_fortress":
        if (((_A = (_z = user.quests) == null ? void 0 : _z.QuestCinnamonTreeGrove) == null ? void 0 : _A.is_fuel_enabled) || ((_C = (_B = user.quests) == null ? void 0 : _B.QuestGolemWorkshop) == null ? void 0 : _C.is_fuel_enabled) || ((_E = (_D = user.quests) == null ? void 0 : _D.QuestIceFortress) == null ? void 0 : _E.is_fuel_enabled)) {
          reminderOpts.text = "Festive Spirit is active.";
          reminderOpts.button = "Deactivate";
        } else if ("winter_hunt_forest" === getCurrentLocation()) {
          reminderOpts.text = "Festive Spirit is <strong>not</strong> active.";
          reminderOpts.button = "Activate";
        }
        reminderOpts.image = "https://www.mousehuntgame.com/images/items/stats/large/cda292833fce3b65b7a6a38c000e8620.png?cv=2";
        reminderOpts.action = () => {
          const toggle = document.querySelector(".headsUpDisplayWinterHuntRegionView__fuelButton");
          if (toggle) {
            toggle.click();
          }
        };
    }
    if (reminderOpts.text) {
      showHornMessage(reminderOpts);
    }
  };
  var reminders_default = addReminders;

  // src/modules/better-travel/travel-menu.css
  var travel_menu_default = ".mh-improved-travel-window.greatWinterHuntGolemDestinationView{padding:10px 0}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__content{align-items:flex-start;margin-right:5px;background-color:transparent}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environmentsScroller{height:auto;min-height:425px;max-height:650px;padding:0 0 10px 5px;margin-right:-5px}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__regionEnvironments{gap:15px 6px;justify-content:space-evenly}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__regionsContainer{display:none}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__regionName{margin:10px 0;font-size:16px;text-align:center;border:none}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environment{width:150px;overflow:hidden;border:1px solid #b4a481;box-shadow:0 2px 2px #7e7e7e}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__regionGroup{margin:0}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environmentName{position:absolute;right:0;left:0;z-index:2;height:20px;background-color:#ffffffe5;border-radius:0;transition:all .2s ease-in-out}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environmentName span{padding:5px;text-align:center}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environmentImage{border-radius:0;transition:all .2s ease-in-out}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environment:hover .greatWinterHuntGolemDestinationView__environmentImage,.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environment:focus .greatWinterHuntGolemDestinationView__environmentImage{background-position-y:30%}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environment:hover .greatWinterHuntGolemDestinationView__environmentName,.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environment:focus .greatWinterHuntGolemDestinationView__environmentName{background-color:#fff}.mh-improved-travel-window .greatWinterHuntGolemDestinationView__environment[data-environment-type=train_station] .greatWinterHuntGolemDestinationView__environmentName span{font-size:10px}.mh-improved-travel-window-footer{position:absolute;bottom:20px;display:flex;gap:10px;align-items:center;width:330px}.mh-improved-travel-window-edit{padding:0 15px;font-weight:400;line-height:24px}.mh-improved-travel-window--editing{border-radius:5px;outline:3px solid #f37c7c}.mh-improved-travel-window-description,.mh-improved-travel-window-hidden{display:none}.mh-improved-travel-window--editing .mh-improved-travel-window-hidden{display:block;filter:grayscale(1);opacity:.4}.mh-improved-travel-window--editing .mh-improved-travel-window-description{display:inline-block}.mh-improved-travel-window-environment-icon{cursor:pointer}\n";

  // src/modules/better-travel/travel-window.js
  var getHiddenLocations = () => {
    return getTravelSetting("travel-window-hidden-locations", []);
  };
  var toggleLocation = (location) => {
    if (isLocationHidden(location)) {
      unhideLocation(location);
    } else {
      hideLocation(location);
    }
  };
  var hideLocation = (location) => {
    const hiddenLocations = getHiddenLocations();
    if (hiddenLocations.includes(location)) {
      return;
    }
    hiddenLocations.push(location);
    saveTravelSetting("travel-window-hidden-locations", hiddenLocations);
  };
  var unhideLocation = (location) => {
    const hiddenLocations = getHiddenLocations();
    if (!hiddenLocations.includes(location)) {
      return;
    }
    hiddenLocations.splice(hiddenLocations.indexOf(location), 1);
    saveTravelSetting("travel-window-hidden-locations", hiddenLocations);
  };
  var isLocationHidden = (location) => {
    const hiddenLocations = getHiddenLocations();
    return hiddenLocations.includes(location);
  };
  var openTravelWindow = () => __async(void 0, null, function* () {
    debug("Opening travel window");
    const regions = [
      { type: "gnawnia", name: "Gnawnia" },
      { type: "valour", name: "Valour" },
      { type: "whisker_woods", name: "Whisker Woods" },
      { type: "burroughs", name: "Burroughs" },
      { type: "furoma", name: "Furoma" },
      { type: "bristle_woods", name: "Bristle Woods" },
      { type: "tribal_isles", name: "Tribal Isles" },
      { type: "varmint_valley", name: "Varmint Valley" },
      { type: "desert", name: "Sandtail Desert" },
      { type: "rodentia", name: "Rodentia" },
      { type: "queso_canyon", name: "Queso Canyon" },
      { type: "zokor_zone", name: "Hollow Heights" },
      { type: "folklore_forest", name: "Folklore Forest" },
      { type: "riftopia", name: "Rift Plane" }
    ];
    environments = yield getData("environments");
    const eventEnvironments = yield getData("environments-events");
    environments = [...environments, ...eventEnvironments];
    const currentEnvironment = environments.find((e) => e.id === getCurrentLocation());
    const locationsToRemove = ["forbidden_grove"];
    environments = environments.map((env) => {
      if (!isUserTitleAtLeast(env.title)) {
        locationsToRemove.push(env.id);
      }
      return env;
    });
    environments = environments.filter((env) => !locationsToRemove.includes(env.id));
    let content = '<div class="mh-improved-travel-window greatWinterHuntGolemDestinationView"><div class="greatWinterHuntGolemDestinationView__content">';
    content += '<div class="greatWinterHuntGolemDestinationView__regionsContainer">';
    for (const region of regions) {
      let buttonClass = "greatWinterHuntGolemDestinationView__regionButton";
      if ((currentEnvironment == null ? void 0 : currentEnvironment.region) === (region == null ? void 0 : region.type)) {
        buttonClass += " greatWinterHuntGolemDestinationView__regionButton--active";
      }
      content += `<button class="${buttonClass}" data-region-type="${region.type}">${region.name}</button>`;
    }
    content += "</div>";
    const hasTitles = false;
    content += '<div class="greatWinterHuntGolemDestinationView__environmentsContainer"><div class="greatWinterHuntGolemDestinationView__environmentsScroller"><div class="greatWinterHuntGolemDestinationView__regionList">';
    if (!hasTitles) {
      content += `<div class="greatWinterHuntGolemDestinationView__regionGroup" data-region-type="all">
      <div class="greatWinterHuntGolemDestinationView__regionEnvironments">`;
    }
    for (const region of regions) {
      if (hasTitles) {
        content += `<div class="greatWinterHuntGolemDestinationView__regionGroup" data-region-type="${region.type}">
        <div class="greatWinterHuntGolemDestinationView__regionName">${region.name}</div>
        <div class="greatWinterHuntGolemDestinationView__regionEnvironments">`;
      }
      const regionEnvironments = environments.filter((e) => e.region === region.type);
      regionEnvironments.forEach((environment) => {
        let envButtonClass = "greatWinterHuntGolemDestinationView__environment";
        if (currentEnvironment.id === environment.id) {
          envButtonClass += " greatWinterHuntGolemDestinationView__environment--active";
        }
        if (isLocationHidden(environment.id)) {
          envButtonClass += " mh-improved-travel-window-hidden";
        }
        content += `<button class="${envButtonClass}" data-environment-type="${environment.id}">
        <div class="greatWinterHuntGolemDestinationView__environmentName">
            <span>${environment.name}</span>
        </div>
        <div class="greatWinterHuntGolemDestinationView__environmentImage" style="background-image:url(${environment.headerImage});" data-environment-type="${environment.id}"></div>
      </button>`;
      });
      if (hasTitles) {
        content += "</div></div>";
      }
    }
    if (!hasTitles) {
      content += "</div></div>";
    }
    content += "</div></div></div>";
    content += "</div>";
    content += `<div class="mh-improved-travel-window-footer">
    <div class="mh-improved-travel-window-edit mousehuntActionButton"><span>Edit</span></div>
    <div class="mh-improved-travel-window-description">Click on a location to toggle the visibility.</div>
  </div>`;
    content += "</div>";
    const popup = createPopup({
      id: "mh-improved-travel-window",
      title: "",
      content,
      className: "mh-improved-travel-window-popup jsDialogFixed",
      show: false
    });
    popup.setOffsetHeight(0);
    popup.setPersistentOffsetHeight(0);
    popup.setIsModal(false);
    popup.show();
    const travelWindow = document.querySelector(".mh-improved-travel-window");
    if (!travelWindow) {
      return;
    }
    const editButton = document.querySelector(".mh-improved-travel-window-edit");
    if (!editButton) {
      return;
    }
    const editButtonSpan = editButton.querySelector("span");
    if (!editButtonSpan) {
      return;
    }
    const environmentButtons = document.querySelectorAll(".greatWinterHuntGolemDestinationView__environment");
    if (!environmentButtons) {
      return;
    }
    editButton.addEventListener("click", () => {
      isEditing = !isEditing;
      if (isEditing) {
        travelWindow.classList.add("mh-improved-travel-window--editing");
        editButtonSpan.textContent = "Save";
        editButton.classList.add("active");
      } else {
        travelWindow.classList.remove("mh-improved-travel-window--editing");
        editButtonSpan.textContent = "Edit";
        editButton.classList.remove("active");
      }
    });
    environmentButtons.forEach((button) => {
      const environmentType = button.getAttribute("data-environment-type");
      button.addEventListener("click", () => {
        if (isEditing) {
          toggleLocation(environmentType);
          button.classList.toggle("mh-improved-travel-window-hidden");
        } else {
          debug(`Traveling to ${environmentType}`);
          travelTo(environmentType);
          setPage("Camp");
          popup.hide();
        }
      });
    });
    onDialogHide(() => {
      isEditing = false;
    });
  });
  var isEditing = false;
  var environments = [];
  var makeMenuItem = () => {
    addSubmenuItem({
      id: "mh-improved-travel-window",
      menu: "travel",
      label: "Travel Window",
      icon: "https://www.mousehuntgame.com/images/ui/hud/menu/special.png?asset_cache_version=2",
      callback: () => {
        openTravelWindow();
      }
    });
  };
  var addEnvironmentIconListener = () => {
    const environmentIcon = document.querySelector(".mousehuntHud-environmentIcon");
    if (!environmentIcon) {
      return;
    }
    environmentIcon.classList.add("mh-improved-travel-window-environment-icon");
    environmentIcon.title = "Open Travel Window";
    environmentIcon.addEventListener("click", () => {
      openTravelWindow();
    });
  };
  var travel_window_default = () => __async(void 0, null, function* () {
    addStyles(travel_menu_default, "better-travel-travel-window");
    makeMenuItem();
    if (getSetting("better-travel.travel-window-environment-icon", true)) {
      addEnvironmentIconListener();
    }
    onEvent("mh-improved-open-travel-window", openTravelWindow);
    environments = yield getData("environments");
  });

  // src/modules/better-travel/settings/index.js
  var settings_default = () => __async(void 0, null, function* () {
    return [
      {
        id: "better-travel.default-to-simple-travel",
        title: "Show Simple Travel tab by default",
        default: false,
        description: ""
      },
      {
        id: "better-travel.show-alphabetized-list",
        title: "Show alphabetized list on Simple Travel",
        default: false,
        description: ""
      },
      {
        id: "better-travel.show-reminders",
        title: "Show Travel Reminders",
        default: true,
        description: ""
      },
      {
        id: "better-travel.travel-window",
        title: "Travel Window",
        default: true,
        description: ""
      },
      {
        id: "better-travel.travel-window-environment-icon",
        title: "Environment icon opens Travel Window",
        default: true,
        description: ""
      }
    ];
  });

  // src/modules/better-travel/styles.css
  var styles_default = '.travelPage-map-spacer,.travelPage-map-simpleToggle,.mousehuntHud-page-tabContent.map.full .travelPage-map-simpleToggle.full,.mousehuntHud-page-tabContent.map.full .travelPage-map-prefix.full{display:none}.travelPage-regionMenu{width:22%;overflow:scroll}.travelPage-map-environment-detailContainer{left:22%;width:78%}.travelPage-regionMenu-environmentLink.active{color:#000;background:#a4cafc}.travelPage-regionMenu-stats{color:#4d4d4d;background-color:#d8d8d8}.travelPage-regionMenu-numFriends{padding:0;background:none}.travelPage-mapContainer.full{height:auto;min-height:800px;max-height:900px;border:none}.travelPage-map-imageContainer{width:78%}.travelPage-map-zoomContainer{bottom:300px;transform:scale(1.5)}.travelPage-map-image-environment-name{top:70px;z-index:15;font-size:22px;font-variant:none;text-shadow:1px 1px #000,0 0 10px #000,8px 12px 9px #000}.travelPage-map-image-environment.locked .travelPage-map-image-environment-status{z-index:1;opacity:.5}.travelPage-map-image-environment-star{z-index:10}.travelPage-map-image-environment-button{top:100px;transform:scale(1.2)}.travelPage-regionMenu-environmentLink.mystery{display:inline-block;color:#9e9e9e;pointer-events:none}.travelPage-regionMenu-item[data-region=riftopia],.travelPage-regionMenu-item[data-region=riftopia] .travelPage-regionMenu-item-contents{display:block!important}.travelPage-regionMenu-regionLink:hover,.travelPage-regionMenu-regionLink:focus{cursor:unset}#mh-simple-travel-page .travelPage-map-prefix{display:block}#mh-simple-travel-page .travelPage-regionMenu{display:grid;grid-template-columns:repeat(5,1fr);width:100%;margin-bottom:10px;overflow:visible;background-color:transparent}#mh-simple-travel-page .travelPage-regionMenu-item{box-sizing:border-box;margin:1px;background-color:#e2e2e2;border:1px solid #4c71b4}#mh-simple-travel-page .travelPage-regionMenu-item[data-region=gnawnia],#mh-simple-travel-page .travelPage-regionMenu-item[data-region=valour],#mh-simple-travel-page .travelPage-regionMenu-item[data-region=whisker_woods],#mh-simple-travel-page .travelPage-regionMenu-item[data-region=burroughs],#mh-simple-travel-page .travelPage-regionMenu-item[data-region=furoma]{min-height:215px}#mh-simple-travel-page .travelPage-regionMenu-item[data-region=riftopia]{min-height:250px}#mh-simple-travel-page .travelPage-regionMenu-environments{width:145px;padding-left:2px;box-shadow:none}#mh-simple-travel-page .travelPage-regionMenu-item-contents{overflow:visible!important}#mh-simple-travel-page .travelPage-regionMenu-environmentLink.active{color:#4e6081}#mh-simple-travel-page .travelPage-regionMenu-environmentLink:hover,#mh-simple-travel-page .travelPage-regionMenu-environmentLink:focus{color:#fff;background-color:#6383bf}.huntersHornView__messageContent strong{font-weight:900}#mh-simple-travel-page .travelPage-alpha-wrapper .travelPage-regionMenu{display:block;width:100%}#mh-simple-travel-page .travelPage-alpha-wrapper .travelPage-regionMenu-environments{display:flex;flex-flow:column wrap;align-items:stretch;justify-content:flex-start;width:754px;height:425px;padding:4px 1px}#mh-simple-travel-page .travelPage-alpha-wrapper a.travelPage-regionMenu-environmentLink{width:112px;margin-left:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mhui-region-travel-item .icon{border-radius:5px}.mousehuntHud-menu ul li ul li.mhui-region-travel-item a .icon{top:6px;left:3px;width:22px;height:22px}#mh-simple-travel-page .travelPage-regionMenu .travelPage-regionMenu-environmentLink.active.highlight{margin-right:-3px;border-right:1px solid #4c71b4}#mh-simple-travel-page .travelPage-alpha-wrapper .travelPage-regionMenu-environmentLink.active.highlight{margin-right:0;border-right:none;border-radius:3px}.travelPage-regionMenu-environmentLink.relic-hunter-is-here:after{position:absolute;top:5px;right:5px;display:none;width:20px;height:20px;content:"";background-image:url(https://www.mousehuntgame.com/images/mice/thumb/d6980f1b00ff8ec688804706cba9370c.gif?cv=2);background-repeat:no-repeat;background-size:contain;border-radius:5px}.travelPage-regionMenu-environments:hover .travelPage-regionMenu-environmentLink.relic-hunter-is-here:after,.travelPage-regionMenu-environments:focus .travelPage-regionMenu-environmentLink.relic-hunter-is-here:after,.travelPage-regionMenu-environmentLink.relic-hunter-is-here:hover:after,.travelPage-regionMenu-environmentLink.relic-hunter-is-here:focus:after{display:block}.travelPage-regionMenu-environmentLink.relic-hunter-is-here{background-color:#e0f2d5}.mousehuntHud-page-tabContent.simple-travel .travelPage-regionMenu-environmentLink.relic-hunter-is-here{margin:0;border:none;border-radius:6px;outline:1px solid #ccc}.travelPage-alpha-wrapper .relic-hunter-is-here .travelPage-regionMenu-environmentLink-image{margin-left:0}.travelPage-map-image-environment .map-relic-hunter-is-here-image{position:absolute;top:5px;left:5px;width:60px;height:60px;overflow:hidden;background:url(https://www.mousehuntgame.com/images/mice/thumb/d6980f1b00ff8ec688804706cba9370c.gif?cv=2);filter:hue-rotate(-326deg);background-repeat:no-repeat;background-size:contain;border-radius:50%;transform:rotate(-70deg)}.map-relic-hunter-is-here.travelPage-map-image-environment-pointer{top:41px;left:86px;z-index:9;filter:hue-rotate(326deg);transform:rotate(70deg)}#mh-simple-travel-page .first-letter:first-letter{font-size:12px;font-weight:900}#mh-simple-travel-page .travelPage-alpha-wrapper:hover .first-letter:first-letter{border-bottom:1px solid #4e6081}#mh-simple-travel-page .travelPage-regionMenu .travelPage-regionMenu-environmentLink.active.highlight.event-location,#mh-simple-travel-page .travelPage-regionMenu .travelPage-regionMenu-environmentLink.event-location{color:#c01dff}#mh-simple-travel-page .travelPage-regionMenu .travelPage-regionMenu-environmentLink.active.highlight.event-location:after,#mh-simple-travel-page .travelPage-regionMenu .travelPage-regionMenu-environmentLink.event-location:after{position:absolute;top:1px;left:4px;width:15px;height:15px;content:"";background-image:url(https://www.mousehuntgame.com/images/ui/camp/trap/star_favorite.png?asset_cache_version=2);filter:drop-shadow(0 0 1px #fff);background-repeat:no-repeat;background-size:contain}.travelPage-map-environment-detail-title .custom-favorite-button{margin-top:-1px;margin-left:10px}.mousehuntHud-menu ul li ul li.mh-improved-better-travel-favorites-divider{height:1px;pointer-events:none;background-color:#6c3d0e7f}.mh-improved-better-travel-favorite-location:after{position:absolute;top:6px;right:4px;bottom:0;display:block;width:20px;height:20px;content:"";background:url(https://www.mousehuntgame.com/images/ui/map/star_gold_320.png?asset_cache_version=2);background-size:contain;opacity:.3}.mh-improved-better-travel-favorite-location:hover:after,.mh-improved-better-travel-favorite-location:focus:after{opacity:.1}.mh-improved-better-travel-menu-item .name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mousehuntHud-environmentName{padding-top:0;margin-top:29px}.mh-improved-better-travel-region-location .icon{border:1px solid #9f9171;border-radius:3px}.mh-improved-travel-message.travelPage-map-message.active{top:46px;box-shadow:0 3px 6px -3px #333}.mh-improved-travel-message.travelPage-map-message .mousehuntActionButton{padding:3px 10px;font-size:11px}\n';

  // src/modules/better-travel/travel-menu-hiding.css
  var travel_menu_hiding_default = "ul.fast-travel-list>li:not(.custom-submenu-item){display:none}\n";

  // src/modules/better-travel/index.js
  var expandTravelRegions = () => {
    var _a, _b;
    if ("travel" !== getCurrentPage()) {
      return;
    }
    const hud = document.querySelector("#mousehuntHud");
    if (hud) {
      const hudHeight = hud.offsetHeight + 30;
      const map = document.querySelector(".travelPage-mapContainer.full");
      if (map) {
        map.style.height = `calc(100vh - ${hudHeight}px)`;
      }
    }
    const regionHeaders = document.querySelectorAll(".travelPage-regionMenu-regionLink");
    if (regionHeaders) {
      regionHeaders.forEach((regionHeader) => {
        regionHeader.setAttribute("onclick", "return false;");
      });
    }
    const travelAreas = document.querySelectorAll(".travelPage-regionMenu-item");
    if (travelAreas && travelAreas.length > 0) {
      travelAreas.forEach((area) => {
        area.classList.add("active");
        area.classList.remove("contracted");
      });
    }
    const locations = document.querySelectorAll(".travelPage-map-image-environment.active");
    if (locations && locations.length > 0) {
      locations.forEach((location) => {
        location.addEventListener("mouseover", () => {
          location.classList.add("highlight");
        });
        location.addEventListener("mouseout", () => {
          setTimeout(() => {
            location.classList.remove("highlight");
          }, 1e3);
        });
      });
    }
    if ((_b = (_a = app == null ? void 0 : app.pages) == null ? void 0 : _a.TravelPage) == null ? void 0 : _b.zoomOut) {
      setTimeout(() => {
        app.pages.TravelPage.zoomOut();
      }, 500);
    }
  };
  var travelClickHandler = (event) => {
    var _a, _b;
    if ((_b = (_a = app == null ? void 0 : app.pages) == null ? void 0 : _a.TravelPage) == null ? void 0 : _b.travel) {
      travelTo(event.target.getAttribute("data-environment"));
      setPage("Camp");
    }
  };
  var cloneRegionMenu = () => {
    const regionMenu = document.querySelector(".travelPage-regionMenu");
    if (!regionMenu) {
      return;
    }
    const regionMenuClone = regionMenu.cloneNode(true);
    const travelLinks = regionMenuClone.querySelectorAll(".travelPage-regionMenu-environmentLink");
    if (travelLinks && travelLinks.length > 0) {
      travelLinks.forEach((link) => {
        link.setAttribute("onclick", "return false;");
        link.addEventListener("click", travelClickHandler);
      });
    }
    return regionMenuClone;
  };
  var addTab = (id, label) => {
    if ("travel" !== getCurrentPage()) {
      return;
    }
    const exists = document.querySelector(`#mh-${id}-tab`);
    if (exists) {
      return;
    }
    const tabContainer = document.querySelector(".mousehuntHud-page-tabHeader-container");
    if (!tabContainer) {
      return;
    }
    const tab = makeElement("a", "mousehuntHud-page-tabHeader");
    tab.id = `mh-${id}-tab`;
    tab.setAttribute("data-tab", id);
    tab.setAttribute("onclick", "hg.utils.PageUtil.onclickPageTabHandler(this); return false;");
    makeElement("span", "", label, tab);
    tabContainer.append(tab);
  };
  var addPage = (id, content) => {
    if ("travel" !== getCurrentPage()) {
      return;
    }
    const exists = document.querySelector(`#mh-${id}-page`);
    if (exists) {
      return;
    }
    const pageContainer = document.querySelector(".mousehuntHud-page-tabContentContainer");
    if (!pageContainer) {
      return;
    }
    const page = makeElement("div", ["mousehuntHud-page-tabContent", id]);
    page.id = `mh-${id}-page`;
    page.setAttribute("data-tab", id);
    if (content) {
      page.append(content);
    } else {
      const blank = makeElement("div");
      page.append(blank);
    }
    pageContainer.append(page);
  };
  var addAlphabetizedList = (regionMenu) => {
    const alphaWrapper = makeElement("div", "travelPage-alpha-wrapper");
    const alphaContent = makeElement("div", "travelPage-regionMenu");
    const alphaHeader = makeElement("div", ["travelPage-regionMenu-item", "active"]);
    const alphaList = makeElement("div", "travelPage-regionMenu-item-contents");
    const alphaListContent = makeElement("div", "travelPage-regionMenu-environments");
    const links = regionMenu.querySelectorAll(".travelPage-regionMenu-environmentLink");
    const sortedLinks = [...links].sort((a, b) => {
      const aName = a.innerText;
      const bName = b.innerText;
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    });
    let lastLetter = "";
    sortedLinks.forEach((link) => {
      const linkClone = link.cloneNode(true);
      alphaListContent.append(linkClone);
      linkClone.addEventListener("click", travelClickHandler);
      const firstLetter = linkClone.innerText.charAt(0).toLowerCase();
      if (firstLetter !== lastLetter) {
        linkClone.classList.add("first-letter");
      }
      lastLetter = firstLetter;
      const environment = environments2.find((env) => {
        return env.id === link.getAttribute("data-environment");
      });
      if (!environment) {
        linkClone.classList.add("event-location");
      }
    });
    alphaList.append(alphaListContent);
    alphaHeader.append(alphaList);
    alphaContent.append(alphaHeader);
    alphaWrapper.append(alphaContent);
    return alphaWrapper;
  };
  var addSimpleTravelPage = () => {
    expandTravelRegions();
    const wrapper = makeElement("div", "travelPage-wrapper");
    if ("not-set" === getSetting("better-travel.default-to-simple-travel", "not-set")) {
      const settingTip = makeElement("div", ["travelPage-map-prefix", "simple-travel-tip"], 'You can set this as the default travel tab in the <a href="https://www.mousehuntgame.com/preferences.php?tab=mousehunt-improved-settings">MouseHunt Improved settings</a>.');
      wrapper.append(settingTip);
    }
    const regionMenu = cloneRegionMenu();
    if (getSetting("better-travel.show-alphabetized-list", false)) {
      wrapper.append(addAlphabetizedList(regionMenu));
    }
    wrapper.append(regionMenu);
    addPage("simple-travel", wrapper);
  };
  var addSimpleTravel = () => {
    if ("travel" !== getCurrentPage()) {
      return;
    }
    addTab("simple-travel", "Simple Travel");
    addSimpleTravelPage();
  };
  var getPreviousLocation = () => {
    const previousLocation = getSetting("better-travel.previous-location", false);
    if (previousLocation && previousLocation !== getCurrentLocation()) {
      return environments2.find((environment) => {
        return environment.id === previousLocation;
      });
    }
    return false;
  };
  var goToPreviousLocation = () => {
    const previousLocation = getPreviousLocation();
    if (previousLocation) {
      travelTo(previousLocation.id);
    }
  };
  var addToTravelDropdown = () => __async(void 0, null, function* () {
    const currentLocation = getCurrentLocation();
    const eventEnvironments = yield getData("environments-events");
    environments2.push(...eventEnvironments);
    let currentRegion = environments2.find((environment) => {
      return environment.id === currentLocation;
    });
    if (!currentRegion) {
      currentRegion = eventEnvironments.find((environment) => {
        return environment.id === currentLocation;
      });
      if (!currentRegion) {
        return;
      }
    }
    const otherRegions = environments2.filter((environment) => {
      if (!(environment == null ? void 0 : environment.region) || !(currentRegion == null ? void 0 : currentRegion.region)) {
        return false;
      }
      return environment.region === currentRegion.region;
    });
    otherRegions.splice(otherRegions.findIndex((environment) => {
      return environment.id === currentLocation;
    }), 1);
    const existingCustomSubmenuItems = document.querySelectorAll(".mh-improved-better-travel-menu-item");
    if (existingCustomSubmenuItems) {
      existingCustomSubmenuItems.forEach((item) => {
        item.remove();
      });
    }
    const previousLocation = getPreviousLocation();
    if (previousLocation) {
      addSubmenuItem({
        menu: "travel",
        label: `Back to ${previousLocation.name}`,
        icon: "https://www.mousehuntgame.com/images/ui/puzzle/refresh.png",
        callback: goToPreviousLocation,
        class: "mh-improved-better-travel-menu-item mh-improved-better-travel-previous-location"
      });
    }
    otherRegions.forEach((region) => {
      if (region.id === currentLocation) {
        return;
      }
      addSubmenuItem({
        menu: "travel",
        label: region.name,
        icon: region.image,
        callback: () => {
          travelTo(region.id);
        },
        class: "mh-improved-better-travel-menu-item mh-improved-better-travel-region-location"
      });
    });
    const favorites = getLocationFavorites();
    if (favorites && favorites.length > 0) {
      addSubmenuDivider("travel", "mh-improved-better-travel-favorites-divider");
      favorites.forEach((favorite) => {
        const favoriteRegion = environments2.find((environment) => {
          return environment.id === favorite;
        });
        if (favoriteRegion) {
          addSubmenuItem({
            menu: "travel",
            label: favoriteRegion.name,
            icon: favoriteRegion.image,
            callback: () => {
              travelTo(favoriteRegion.id);
            },
            class: "mh-improved-better-travel-menu-item mh-improved-better-travel-favorite-location"
          });
        }
      });
    }
  });
  var onTravelComplete = () => {
    onEvent("travel_complete", () => {
      saveTravelLocation();
      setTimeout(() => {
        if (getSetting("better-travel.show-reminders", true)) {
          reminders_default();
        }
        addToTravelDropdown();
      }, 250);
    });
  };
  var initSimpleTab = () => {
    if ("simple-travel" === getCurrentTab()) {
      const isActive = document.querySelector(".mousehuntHud-page-tabContent.simple-travel");
      if (!isActive || isActive && isActive.classList.contains("active")) {
        return;
      }
      setTab("simple-travel");
    }
  };
  var maybeSetTab = () => {
    if ("travel" !== getCurrentPage()) {
      return;
    }
    initSimpleTab();
    if ("map" !== getCurrentTab()) {
      return;
    }
    if (!getSetting("better-travel.default-to-simple-travel", false)) {
      return;
    }
    setTab("simple-travel");
  };
  var addRhToSimpleTravel = () => __async(void 0, null, function* () {
    const location = yield getRelicHunterLocation();
    if (!location) {
      return;
    }
    const travelLink = document.querySelectorAll(`.travelPage-regionMenu-environmentLink[data-environment="${location.id}"]`);
    if (!travelLink.length) {
      return;
    }
    travelLink.forEach((link) => {
      link.classList.add("relic-hunter-is-here");
    });
  });
  var addRhToMap = () => __async(void 0, null, function* () {
    const location = yield getRelicHunterLocation();
    if (!location) {
      return;
    }
    const mapLocation = document.querySelector(`.travelPage-map-image-environment[data-environment-type="${location.id}"]`);
    if (!mapLocation) {
      return;
    }
    const rh = makeElement("div", ["map-relic-hunter-is-here", "travelPage-map-image-environment-pointer"]);
    makeElement("div", ["map-relic-hunter-is-here-image", "travelPage-map-image-environment-pointer-image"], "", rh);
    mapLocation.append(rh);
  });
  var maybeDoMapView = () => {
    if ("travel" !== getCurrentPage()) {
      return;
    }
    if ("map" !== getCurrentTab()) {
      return;
    }
    expandTravelRegions();
    addRhToMap();
  };
  var _tabHandler = null;
  var listenTabChange = () => {
    var _a, _b;
    if (_tabHandler) {
      return;
    }
    if (!((_b = (_a = hg == null ? void 0 : hg.utils) == null ? void 0 : _a.PageUtil) == null ? void 0 : _b.onclickPageTabHandler)) {
      return;
    }
    _tabHandler = hg.utils.PageUtil.onclickPageTabHandler;
    hg.utils.PageUtil.onclickPageTabHandler = (tab) => {
      _tabHandler(tab);
      maybeDoMapView();
    };
  };
  var saveTravelLocation = () => {
    const isLocationDashboardRefreshing = sessionGet("doing-location-refresh", false);
    if (isLocationDashboardRefreshing) {
      return;
    }
    const previousLocation = getTravelSetting("current-location", "not-set");
    const currentLocation = getCurrentLocation();
    if (currentLocation === previousLocation) {
      return;
    }
    saveTravelSetting("previous-location", previousLocation);
    saveTravelSetting("current-location", currentLocation);
  };
  var getLocationFavorites = () => {
    const faves = getSetting("better-travel.favorites", []);
    return faves;
  };
  var isLocationFavorite = (type) => {
    return getLocationFavorites().includes(type);
  };
  var saveLocationFavorites = (favorites) => {
    saveTravelSetting("favorites", favorites);
  };
  var addToLocationFavorites = (type) => {
    if (!isLocationFavorite(type)) {
      const faves = getLocationFavorites();
      faves.push(type);
      saveLocationFavorites(faves);
    }
  };
  var removeFromLocationFavorites = (type) => {
    if (getLocationFavorites()) {
      const faves = getLocationFavorites();
      faves.splice(faves.indexOf(type), 1);
      saveLocationFavorites(faves);
    }
  };
  var addFavoriteButtonsToTravelPage = () => __async(void 0, null, function* () {
    const locations = document.querySelectorAll(".travelPage-map-environment-detailContainer .travelPage-map-environment-detail");
    if (!locations) {
      return;
    }
    const locationFavorites = getLocationFavorites();
    locations.forEach((location) => {
      const type = location.getAttribute("data-environment-type");
      if (!type) {
        return;
      }
      const isEventLocation = environments2.find((environment) => {
        return environment.id === type;
      });
      if (isEventLocation) {
        return;
      }
      const isFavorite = locationFavorites.includes(type);
      makeFavoriteButton({
        id: `better-travel-favorite-${type}`,
        target: location.querySelector(".travelPage-map-environment-detail-title"),
        size: "small",
        state: isFavorite,
        isSetting: false,
        defaultState: false,
        onActivate: () => {
          addToLocationFavorites(type);
          addToTravelDropdown();
        },
        onDeactivate: () => {
          removeFromLocationFavorites(type);
          removeSubmenuItem(type);
        }
      });
    });
  });
  var main = () => {
    if (getSetting("better-travel.travel-window", true)) {
      travel_window_default();
    }
    onNavigation(() => {
      addSimpleTravel();
      addRhToSimpleTravel();
      addFavoriteButtonsToTravelPage();
      maybeSetTab();
    }, {
      page: "travel"
    });
    listenTabChange();
    initSimpleTab();
    maybeDoMapView();
    onTravelComplete();
    saveTravelLocation();
    addToTravelDropdown();
    onEvent("mh-improved-goto-previous-location", goToPreviousLocation);
  };
  var environments2 = [];
  var init = () => __async(void 0, null, function* () {
    const stylesJoined = [styles_default];
    if (!getFlag("no-travel-menu-hiding")) {
      stylesJoined.push(travel_menu_hiding_default);
    }
    addStyles(stylesJoined, "better-travel");
    environments2 = yield getData("environments");
    main();
  });
  var better_travel_default = {
    id: "better-travel",
    name: "Better Travel",
    type: "better",
    default: true,
    description: 'Adds locations in the current region to the Travel dropdown menu, a "Simple Travel" tab with a grid of locations, an optional alphabetized list, an indicator for where the Relic Hunter is.',
    load: init,
    settings: settings_default
  };
  return __toCommonJS(better_travel_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Better Travel / Travel Tweaks', 'https://greasyfork.org/en/scripts/452232-mousehunt-travel-tweaks');
