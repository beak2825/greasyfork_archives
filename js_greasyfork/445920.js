// ==UserScript==
// @name        🐭️ MouseHunt - Item Links
// @description Adds a drop rate table from MHCT, links to the MouseHunt wiki, MHCT looter, and Markethunt, as well as various other features to the item view page.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/445920/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Item%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/445920/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Item%20Links.meta.js
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

  // src/modules/better-item-view/index.js
  var better_item_view_exports = {};
  __export(better_item_view_exports, {
    default: () => better_item_view_default
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
  var makeLink = (text, href, encodeAsSpace = false) => {
    if (encodeAsSpace) {
      href = href.replaceAll("_", "%20");
    }
    return `<a href="${href}" target="_mouse" class="mousehuntActionButton tiny"><span>${text}</span></a>`;
  };
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

  // src/utils/data.js
  var getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "X-MH-Improved": "true",
      "X-MH-Improved-Version": mhImprovedVersion || "unknown",
      "X-MH-Improved-Platform": mhImprovedPlatform || "unknown"
    };
  };

  // src/utils/events.js
  var runCallbacks = (settings, parentNode, callbacks) => {
    Object.keys(settings).forEach((key) => {
      if (parentNode && parentNode.classList && parentNode.classList.contains(settings[key].selector)) {
        settings[key].isVisible = true;
        if (callbacks[key] && callbacks[key].show) {
          callbacks[key].show();
        }
      } else if (settings[key].isVisible) {
        settings[key].isVisible = false;
        if (callbacks[key] && callbacks[key].hide) {
          callbacks[key].hide();
        }
      }
    });
    return settings;
  };
  var overlayMutationObserver = null;
  var overlayCallbacks = [];
  var onOverlayChange = (callbacks) => {
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
    overlayCallbacks.push(callbacks);
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

  // src/modules/better-item-view/settings/index.js
  var settings_default = () => __async(void 0, null, function* () {
    return [
      {
        id: "better-item-view.show-drop-rates",
        title: "Show drop rates",
        default: true
      },
      {
        id: "better-item-view.show-item-hover",
        title: "Show item details on hover (in journal)",
        default: true
      }
    ];
  });

  // src/modules/better-item-view/styles.css
  var styles_default = '.itemView-titleContainer{height:26px}.itemView-header-name{display:flex;align-items:center;justify-content:space-between}.mh-item-links{display:flex;justify-content:flex-end;margin-right:-10px}.mh-item-links a{margin-right:5px}.itemView-header-name .mh-item-links span{display:inline-block;font-size:11px;font-weight:400}.itemView-has-mhct .mouse-ar-wrapper{display:grid;grid-template-columns:150px auto 50px;place-items:center stretch;padding:5px;margin:5px 0;font-size:12px}.itemView-has-mhct .has-stages .mouse-ar-wrapper{grid-template-columns:110px 140px auto 50px}.itemView-has-mhct .mouse-ar-wrapper div{padding:0 2px}.itemView-has-mhct .mice-ar-wrapper{margin-right:10px}.mouse-ar-wrapper .stage{font-size:10px}.mouse-ar-wrapper .cheese{font-size:11px}.itemView-has-mhct .ar-header{display:flex;align-items:center;justify-content:space-between;height:26px;padding-bottom:2px;margin-top:10px;margin-bottom:10px;font-size:12px;font-weight:900;border-bottom:1px solid #ccc}.itemView-has-mhct .ar-link{font-size:9px}.itemView-has-mhct .rate{text-align:right}.itemView-has-mhct .mouse-ar-wrapper:nth-child(odd){background-color:#e7e7e7}.itemView-has-mhct .itemView-description{font-weight:500;line-height:19px}.itemView-action.crafting_item b{display:none}.itemView-action.crafting_item:before{content:"This can be used to craft other items!"}.itemViewContainer.map_piece .itemView-action-text.map_piece,.itemViewContainer.base .itemView-action-text.base,.itemViewContainer.weapon .itemView-actio-textn.weapon,.itemViewContainer.bait .itemView-action-text.bait,.itemViewContainer.trinket .itemView-action-text.trinket,.itemViewContainer.potion .itemView-action-text.potion,.itemViewContainer.readiness_item .itemView-action-text.readiness_item,.itemViewContainer.convertible .itemView-action-text.convertible,.itemViewContainer.torn_page .itemView-action-text.torn_page,.itemViewContainer.crafting_item .itemView-action-text.crafting_item,.itemViewContainer.collectible .itemView-action-text.collectible,.itemViewContainer.message_item .itemView-action-text.message_item,.itemViewContainer.bonus_loot .itemView-action-text.bonus_loot,.itemViewContainer.stat .itemView-action-text.stat,.itemViewContainer.quest .itemView-action-text.quest,.itemViewContainer.skin .itemView-action-text.skin{display:none!important}.itemViewContainer .shopCustomization .itemViewStatBlock-stat{display:flex;flex-direction:column;align-items:center}.itemViewContainer .itemViewStatBlock-stat{display:flex;flex-direction:row;align-items:center;justify-content:flex-start}.itemViewContainer .itemViewStatBlock-stat-value{flex:1;text-align:left}.itemViewContainer .itemViewStatBlock-stat.cheeseEffect{font-size:9px;text-align:center}.itemViewContainer .itemViewStatBlock.trinket .itemViewStatBlock-padding{display:flex;flex-direction:column;align-items:stretch;width:100px}.itemViewContainer .itemViewStatBlock.trinket{width:100px;font-size:13px}#overlayPopup.itemViewPopup #jsDialogClose{z-index:1}#overlayPopup.itemViewPopup .itemView-header-classification{right:25px}.itemView-actionContainer{display:flex;flex-wrap:wrap;gap:10px}.itemView-action{border-top:none}.itemViewContainer.potion .inventoryPage-item-recipeOptions li{width:365px}.itemView-character-image{width:auto;height:84px;margin-top:-15px;margin-left:-9px}.itemView-character-name{left:-11px;width:75px;font-size:15px}.itemView-padding{margin-left:70px}.itemView-thumbnail.large{margin-left:-15px}input.itemView-action-convert-quantity{width:50px}.itemViewPopup .itemViewStatBlock-padding{flex-direction:column}.itemView-character .itemView-character-image{transition:all .4s ease-out;transform-origin:bottom}.itemView-character:hover .itemView-character-image{transform:scale(1.2) rotate(-10deg) translate(5px)}.itemView-header-classification{visibility:hidden}.itemView-header-classification span{visibility:visible}.itemViewStatBlock-stat{display:flex;align-items:center}.itemView-sidebar-checklistItem:nth-child(1),.itemView-sidebar-checklistItem:nth-child(2),.itemView-sidebar-checklistItem.checked{display:block}.itemView-sidebar-checklistItem{background:url(https://www.mousehuntgame.com/images/icons/bad_idea.png) 1px 4px no-repeat;background-size:14px}.itemView-partsContainer{display:flex;flex-direction:column;align-items:stretch;padding-top:15px;padding-bottom:10px;margin-top:15px;border-top:1px solid #666}\n';

  // src/modules/better-item-view/index.js
  var getLinkMarkup = (name, id) => {
    return makeLink("MHCT", `https://www.mhct.win/loot.php?item=${id}`, true) + makeLink("Wiki", `https://mhwiki.hitgrab.com/wiki/index.php/${name}`);
  };
  var addLinks = (itemId) => {
    const title = document.querySelector(".itemView-header-name");
    if (!title) {
      return;
    }
    const currentLinks = document.querySelector(".mh-item-links");
    if (currentLinks) {
      currentLinks.remove();
    }
    const div = document.createElement("div");
    div.classList.add("mh-item-links");
    div.innerHTML = getLinkMarkup(title.innerText, itemId);
    title.append(div);
    const values = document.querySelector(".mouseView-values");
    const desc = document.querySelector(".mouseView-descriptionContainer");
    if (values && desc) {
      desc.insertBefore(values, desc.firstChild);
    }
  };
  var updateItemView = () => __async(void 0, null, function* () {
    const itemView = document.querySelector(".itemViewContainer");
    if (!itemView) {
      return;
    }
    const itemId = itemView.getAttribute("data-item-id");
    if (!itemId) {
      return;
    }
    const sidebar = document.querySelector(".itemView-sidebar");
    if (sidebar) {
      const crafting = document.querySelector(".itemView-action.crafting_item");
      if (crafting) {
        sidebar.append(crafting);
      }
      const smashing = document.querySelector(".itemView-partsContainer");
      if (smashing) {
        sidebar.append(smashing);
        if (smashing.getAttribute("data-has-changed-title")) {
          return;
        }
        const smashingTitle = smashing.querySelector("b");
        if (smashingTitle) {
          smashingTitle.innerText = "Hunter's Hammer to get:";
          smashing.setAttribute("data-has-changed-title", "true");
          smashing.innerHtml = smashing.innerHTML.replace("If you smash it, you'll get:", "");
        }
      }
    }
    addLinks(itemId);
    if (!getSetting("better-item-view.show-drop-rates", true)) {
      return;
    }
    const id = Number.parseInt(itemId, 10);
    const ignored = [
      2473,
      // Mina's gift
      823,
      // party charm
      803,
      // chrome charm
      420,
      // king's credits
      1980,
      // king's keys
      585
      // scrambles
    ];
    if (ignored.includes(id)) {
      return;
    }
    let mhctJson = yield getArForMouse(itemId, "item");
    if (!mhctJson || mhctJson === void 0) {
      return;
    }
    itemView.classList.add("mouseview-has-mhct");
    const container = itemView.querySelector(".itemView-padding");
    if (!container) {
      return;
    }
    const arWrapper = makeElement("div", "ar-wrapper");
    const title = makeElement("div", "ar-header");
    const titleText = makeElement("div", "ar-title", "Drop Rates", title);
    makeTooltip({
      appendTo: titleText,
      text: 'The best location and bait, according to data gathered by <a href="https://mhct.win/" target="_blank" rel="noopener noreferrer">MHCT</a>.'
    });
    const link = makeElement("a", "ar-link", "View on MHCT \u2192");
    link.href = `https://www.mhct.win/loot.php?item=${itemId}`;
    link.target = "_mhct";
    title.append(link);
    arWrapper.append(title);
    const itemsArWrapper = makeElement("div", "item-ar-wrapper");
    const hasStages = mhctJson.some((itemAr) => itemAr.stage);
    if (hasStages) {
      itemsArWrapper.classList.add("has-stages");
    }
    mhctJson = mhctJson.filter((itemAr) => Number.parseInt(itemAr.drop_pct, 10) > 0).slice(0, 10);
    mhctJson.forEach((itemAr) => {
      const dropPercent = Number.parseInt(itemAr.drop_pct, 10).toFixed(2);
      if (dropPercent !== "0.00") {
        const itemArWrapper = makeElement("div", "mouse-ar-wrapper");
        makeElement("div", "location", itemAr.location, itemArWrapper);
        if (hasStages) {
          makeElement("div", "stage", itemAr.stage, itemArWrapper);
        }
        makeElement("div", "cheese", itemAr.cheese, itemArWrapper);
        makeElement("div", "rate", `${dropPercent}%`, itemArWrapper);
        itemsArWrapper.append(itemArWrapper);
      }
    });
    if (mhctJson.length > 0) {
      arWrapper.append(itemsArWrapper);
      container.append(arWrapper);
    }
  });
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "better-item-view");
    if (getSetting("better-item-view.show-item-hover", true)) {
    }
    onOverlayChange({ item: { show: updateItemView } });
  });
  var better_item_view_default = {
    id: "better-item-view",
    name: "Better Item View",
    type: "better",
    default: true,
    description: "Updates the styles and shows drop rates, links to MHCT, and MH Wiki.",
    load: init,
    settings: settings_default
  };
  return __toCommonJS(better_item_view_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Item Links', 'https://greasyfork.org/en/scripts/445920-mousehunt-item-links');
