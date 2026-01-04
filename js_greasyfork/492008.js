// ==UserScript==
// @name        🐭️ MouseHunt - Better Send Supplies Testing
// @description Testing for Better Send Supplies
// @version     0.0.1
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/492008/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Send%20Supplies%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/492008/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Send%20Supplies%20Testing.meta.js
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

  // src/modules/better-send-supplies/index.js
  var better_send_supplies_exports = {};
  __export(better_send_supplies_exports, {
    default: () => better_send_supplies_default
  });

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
  var makeMathButton = (amount, opts) => {
    const {
      appendTo = null,
      input = null,
      maxQty = 0,
      classNames = []
    } = opts;
    const button = makeElement("a", ["mousehuntActionButton", "mh-improved-math-button", ...classNames]);
    const plusText = amount > 0 ? `+${amount}` : amount;
    const minusText = amount > 0 ? `-${amount}` : amount;
    const buttonText = makeElement("span", "", plusText);
    const updateButtonText = (e) => {
      const currentText = buttonText.innerText;
      if (e.shiftKey && currentText !== minusText) {
        buttonText.innerText = minusText;
      } else if (!e.shiftKey && currentText !== plusText) {
        buttonText.innerText = plusText;
      }
    };
    buttonText.addEventListener("mouseover", updateButtonText);
    window.addEventListener("keydown", updateButtonText);
    window.addEventListener("keyup", updateButtonText);
    button.append(buttonText);
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let current = Number.parseInt(input.value, 10);
      if (Number.isNaN(current)) {
        current = 0;
      }
      const tempAmount = e.shiftKey ? -amount : amount;
      if (current + tempAmount >= maxQty) {
        input.value = maxQty;
      } else if (current + tempAmount <= 0) {
        input.value = 0;
      } else {
        input.value = current + tempAmount;
      }
      const event = new Event("keyup");
      input.dispatchEvent(event);
    });
    if (appendTo) {
      appendTo.append(button);
    }
    return button;
  };
  var makeMathButtons = (amounts, opts) => {
    amounts.forEach((amount) => {
      makeMathButton(amount, opts);
    });
  };

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

  // src/utils/db.js
  var database = (databaseName) => __async(void 0, null, function* () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(`mh-improved-${databaseName}`, 7);
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
    "community-map-data",
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
    return stylesEl;
  };

  // src/utils/utils.js
  var getTradableItems = (valueKey = "all") => __async(void 0, null, function* () {
    const tradableItems = yield getData("items-tradable");
    tradableItems.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    if ("all" === valueKey) {
      return tradableItems;
    }
    const returnItems = [];
    for (const item of tradableItems) {
      returnItems.push({
        name: item.name,
        value: item[valueKey]
      });
    }
    return returnItems;
  });

  // src/modules/better-send-supplies/settings/index.js
  var settings_default = () => __async(void 0, null, function* () {
    const tradableItems = yield getTradableItems("truncated_name");
    tradableItems.unshift({
      name: "None",
      value: ""
    });
    return [{
      id: "better-send-supplies.pinned-items",
      title: "Pinned items",
      default: [
        {
          name: "SUPER|brie+",
          value: "SUPER|brie+"
        },
        {
          name: "Empowered SUPER|brie+",
          value: "Empowered SUPER|b..."
        },
        {
          name: "Rift Cherries",
          value: "Rift Cherries"
        },
        {
          name: "Rift-torn Roots",
          value: "Rift-torn Roots"
        },
        {
          name: "Sap-filled Thorns",
          value: "Sap-filled Thorns"
        }
      ],
      description: "Items to pin at the top of the send supplies page.",
      settings: {
        type: "multi-select",
        number: 5,
        options: tradableItems
      }
    }];
  });

  // src/modules/better-send-supplies/styles.css
  var styles_default = '#supplytransfer .tabContent.recipient .listContainer .actions{display:none}#supplytransfer .listContainer a.element.recipient{width:auto;height:auto;white-space:nowrap;background-color:#fff}#supplytransfer .tabContent.recipient .listContainer span.content{font-size:12px}#supplytransfer .listContainer a.element.item{width:auto;height:90px}#supplytransfer .listContainer a.element.item,#supplytransfer .listContainer a.element.recipient{border-radius:5px;box-shadow:0 1px 2px -2px #1f1f1f}#supplytransfer .listContainer a.element:hover,#supplytransfer .listContainer a.element.recipient:hover,#supplytransfer .listContainer a.element.item.pinned:hover,#supplytransfer .tabs .tab .image:hover,#supplytransfer .tabs .tab .image.empty:hover{border-color:#ccc;background-color:#d8f0ff;color:#3b5998}#supplytransfer .itemList a.element .quantity{bottom:20px}#supplytransfer .tabContent.item .listContainer{width:auto;margin-left:75px;grid-template-columns:1fr 1fr 1fr 1fr 1fr}#supplytransfer .categoryMenu{width:90px;padding-left:15px;background-color:#fff}#supplytransfer .categoryMenu a{margin-bottom:1px;font-size:12px;text-align:left}#supplytransfer .itemList a.element .itemImage img{width:60px;height:60px}#supplytransfer .listContainer a.element .details{font-size:11px}#supplytransfer .categoryMenu a:hover,#supplytransfer .categoryMenu a:focus,#supplytransfer .categoryMenu a:active{padding-left:5px;margin-left:-5px;text-decoration:none;background-color:#d8f0ff}.mhui-supply-search{display:flex;align-items:center;margin:5px 5px 15px;border-bottom:1px solid #ccc;padding-bottom:5px}#supplytransfer .drawer .tabContent .searchContainer{position:absolute;top:-5px;right:0}#supplytransfer .drawer .tabContent h2{font-size:14px;line-height:unset;border:none;margin-right:auto}#supplytransfer .listContainer a.element.item.hidden{display:none}.mhui-supply-sort-wrapper a,.mhui-supply-sort-wrapper img{width:35px;height:20px}.mhui-supply-sort-wrapper{display:flex;flex-direction:row;gap:5px;align-items:center;position:absolute;top:-3px;right:225px}.mhui-supply-sort-wrapper a{margin:0 4px;line-height:20px;text-align:center;text-decoration:none;border:1px solid #ccc;border-radius:3px;box-shadow:2px 2px 3px #cdc9c6 inset}.mhui-supply-sort-wrapper a:hover,.mhui-supply-sort-wrapper a.focus{background-color:#cac0b2}#supplytransfer .listContainer a.element.item.pinned{background-color:#aef5f7}.mhui-supply-quick-quantity-wrapper{display:flex;gap:10px;align-items:center;justify-content:center;margin:10px auto}.mhui-supply-quick-quantit-max{width:53px}.friendList.listContainer{padding-top:10px;margin-top:10px;border-top:1px solid #ccc}#supplytransfer .tabs .tab.recipient .image.empty:after,#supplytransfer .tabs .tab.item .image.empty:after{content:"";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#3b5998;cursor:pointer}#supplytransfer .tabs .tab.recipient .image.empty:after{content:"Select Friend"}#supplytransfer .tabs .tab.item .image.empty:after{content:"Select Item"}#supplytransfer .drawer .tabContent.confirm #supplytransfer-confirm-text{padding:0}#supplytransfer .tabs .tab.confirm{display:none}#supplytransfer .tabs .tab.recipient .image.empty,#supplytransfer .tabs .tab.item .image.empty{position:relative;background-image:none;margin-bottom:-20px}#supplytransfer .tabs .tab .image{background:#ccc;border:1px solid #eee}.PageSupplyTransfer .flexibleDialogWarmBrown{background:none;padding:0;box-shadow:none}#supplytransfer .drawer{width:unset;border:none;padding:5px}#supplytransfer .tabs{border:1px solid #ccc;padding:10px 10px 0;border-radius:5px;box-shadow:0 1px 2px -2px #1f1f1f;margin-top:53px}#supplytransfer .tabs .tab .image,#supplytransfer .tabs .tab .image.empty{border:1px solid #ccc;border-radius:5px;background-color:#eee}#supplytransfer .drawer .listContainer{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr;gap:5px 0}#supplytransfer .listContainer.friendList img{width:100%;height:auto;border:none;padding-bottom:5px;border-radius:3px}#supplytransfer .tabs .tab:hover{background:transparent}.tabContent.item{margin:-5px}form.mhui-supply-search-form{position:absolute;top:-5px;right:5px}span.mhui-supply-sort-label{color:#000}\n';

  // src/modules/better-send-supplies/index.js
  var processSearch = () => {
    const currentValue = document.querySelector("#mhui-supply-search-input");
    if (!currentValue.value) {
      items.forEach((item) => {
        item.classList.remove("hidden");
      });
    }
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(currentValue.value.toLowerCase())) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  };
  var addSearch = () => {
    const existing = document.querySelector(".mhui-supply-search-wrapper");
    if (existing) {
      return;
    }
    const container = document.querySelector("#supplytransfer .tabContent.item");
    if (!container) {
      return;
    }
    const form = makeElement("form", "mhui-supply-search-form");
    const label = makeElement("label", ["mhui-supply-search-label"]);
    label.setAttribute("for", "mhui-supply-search-input");
    makeElement("span", "", "Search: ", label);
    const input = makeElement("input", "mhui-supply-search-input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "mhui-supply-search-input");
    input.setAttribute("autocomplete", "off");
    input.addEventListener("keyup", processSearch);
    label.append(input);
    form.append(label);
    const titleWrapper = makeElement("div", "mhui-supply-search");
    const title = container.querySelector("h2");
    title.textContent = "Send Supplies";
    titleWrapper.append(title);
    titleWrapper.append(form);
    container.insertBefore(titleWrapper, container.firstChild);
    setTimeout(() => {
      input.focus();
    }, 100);
  };
  var asNum = (number) => {
    return Number.parseInt(number.replace(",", ""));
  };
  var resortItems = (sortType = "alpha") => {
    const container = document.querySelector("#supplytransfer .tabContent.item .listContainer");
    const items2 = container.querySelectorAll(".item");
    let sortSelector = ".quantity";
    if ("alpha" === sortType || "alpha-reverse" === sortType) {
      sortSelector = ".details";
    }
    const sorted = [...items2].sort((a, b) => {
      const aText = a.querySelector(sortSelector).textContent;
      const bText = b.querySelector(sortSelector).textContent;
      switch (sortType) {
        case "alpha":
          return aText.localeCompare(bText);
        case "alpha-reverse":
          return bText.localeCompare(aText);
        case "qty":
          return asNum(bText) - asNum(aText);
        case "qty-reverse":
          return asNum(aText) - asNum(bText);
      }
      return 0;
    });
    for (const item of sorted) {
      if (item.classList.contains("pinned")) {
        continue;
      }
      container.append(item);
    }
    currentSort = sortType;
  };
  var addSortButtons = () => {
    const existing = document.querySelector(".mhui-supply-sort-wrapper");
    if (existing) {
      return;
    }
    const container = document.querySelector(".mhui-supply-search");
    if (!container) {
      return;
    }
    const sortWrapper = makeElement("div", "mhui-supply-sort-wrapper");
    makeElement("span", "mhui-supply-sort-label", "Sort by:", sortWrapper);
    const alphaSortButton = makeElement("div", ["mousehuntActionButton", "tiny", "mhui-supply-sort-alphabetic"]);
    makeElement("span", "mousehuntActionButton-text", "Name", alphaSortButton);
    alphaSortButton.addEventListener("click", () => {
      resortItems(currentSort === "alpha" ? "alpha-reverse" : "alpha");
    });
    sortWrapper.append(alphaSortButton);
    const sortQtyButton = makeElement("div", ["mousehuntActionButton", "tiny", "mhui-supply-sort-quantity"]);
    makeElement("span", "mousehuntActionButton-text", "Quantity", sortQtyButton);
    sortQtyButton.addEventListener("click", () => {
      resortItems(currentSort === "qty" ? "qty-reverse" : "qty");
    });
    sortWrapper.append(sortQtyButton);
    container.insertBefore(sortWrapper, container.childNodes[1]);
  };
  var highlightFavoritedItems = () => {
    const itemsToPin = /* @__PURE__ */ new Set([
      getSetting("better-send-supplies.pinned-items-0", "SUPER|brie+"),
      getSetting("better-send-supplies.pinned-items-1", "Empowered SUPER|b..."),
      getSetting("better-send-supplies.pinned-items-2", "Rift Cherries"),
      getSetting("better-send-supplies.pinned-items-3", "Rift-torn Roots"),
      getSetting("better-send-supplies.pinned-items-4", "Sap-filled Thorns")
    ]);
    for (const item of items) {
      const details = item.querySelector(".details");
      if (itemsToPin.has(details.textContent)) {
        item.classList.add("pinned");
      }
    }
  };
  var addQuickQuantityButtons = () => {
    const input = document.querySelector("#supplytransfer-confirm-text input");
    if (!input) {
      return;
    }
    const maxquantity = document.querySelector("#supplytransfer-confirm-text .userQuantity");
    if (!maxquantity) {
      return;
    }
    const existing = document.querySelector(".mhui-supply-quick-quantity-wrapper");
    if (existing) {
      existing.remove();
    }
    const maxQty = Number.parseInt(maxquantity.textContent.split("You can send up to: ")[1].split(" ")[0].replace(",", ""));
    const wrapper = makeElement("div", "mhui-supply-quick-quantity-wrapper");
    makeMathButtons([1, 5, 10, 100], {
      appendTo: wrapper,
      input,
      maxQty,
      classNames: ["mhui-supply-quick-quantity", "gray", "small"]
    });
    const max = makeElement("button", ["mousehuntActionButton", "lightBlue", "small", "mhui-supply-quick-quantity", "mhui-supply-quick-quantit-max"]);
    const maxText = makeElement("span", "", "Max");
    max.addEventListener("click", () => {
      if (maxText.textContent === "Reset") {
        input.value = 0;
        maxText.textContent = "Max";
      } else {
        input.value = maxQty;
        maxText.textContent = "Reset";
      }
    });
    max.append(maxText);
    wrapper.append(max);
    input.parentNode.insertBefore(wrapper, input.nextSibling);
  };
  var items = [];
  var currentSort = null;
  var upgradeSendSupplies = (initial = false) => {
    const sendTo = document.querySelector("#supplytransfer .drawer .tabContent.recipient");
    const isChoosingUser = sendTo && sendTo.style.display !== "none";
    const sending = document.querySelector("#supplytransfer .drawer .tabContent.item");
    const isChoosingItem = sending && sending.style.display !== "none";
    if (isChoosingUser) {
      const users = document.querySelectorAll("#supplytransfer .friendList .element.recipient");
      for (const user2 of users) {
        user2.addEventListener("click", () => {
          upgradeSendSupplies();
        }, { once: true });
        const search = document.querySelector(".searchContainer input");
        if (search) {
          search.focus();
        }
      }
    } else if (isChoosingItem) {
      items = document.querySelectorAll("#supplytransfer .tabContent.item .listContainer .item");
      highlightFavoritedItems();
      if (initial || !hasSorted) {
        hasSorted = true;
        resortItems("alpha");
      }
      addSortButtons();
      const itemSearch = document.querySelector(".mhui-supply-search-input");
      if (itemSearch) {
        itemSearch.focus();
      }
    } else {
      addQuickQuantityButtons();
      const inputVal = document.querySelector("#supplytransfer-confirm-text input");
      if (inputVal) {
        inputVal.focus();
      }
    }
    sendTo.addEventListener("click", () => {
      upgradeSendSupplies();
    }, { once: true });
    sending.addEventListener("click", () => {
      upgradeSendSupplies();
    }, { once: true });
  };
  var hasSorted = false;
  var main = () => {
    addSearch();
    upgradeSendSupplies(true);
  };
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "better-send-supplies");
    onNavigation(main, {
      page: "supplytransfer"
    });
  });
  var better_send_supplies_default = {
    id: "better-send-supplies",
    name: "Better Send Supplies",
    type: "better",
    default: true,
    description: "Adds pinned items, search, and sorting to the Send Supplies page.",
    load: init,
    settings: settings_default
  };
  return __toCommonJS(better_send_supplies_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
