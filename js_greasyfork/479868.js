// ==UserScript==
// @name         FB Mobile - Clean my feeds
// @namespace    Violentmonkey Scripts
// @version      1.05
// @description  Removes Sponsored and Suggested posts from Facebook mobile chromium/react version
// @license      GNU General Public License v3.0
// @author       https://github.com/webdevsk
// @match        https://m.facebook.com/*
// @match        https://www.facebook.com/*
// @match        https://touch.facebook.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHZSURBVDiNnZFLSFRxFMa/c1/jjIzYpGEjxFQUCC5a9BKJIAtRzEXEFaJFZXRrIQMtk3a1lWo3iwqkTS0kZyGCA4VNFNEmWwU9MIoiscZp7jzuvf9zWogXogS9Z3fO4fv4feeQiCBKjY8M9Nca3lUtkhqAUnwNoPcUheC63b+z5qm3nmelIxGwkMMir+/MzJSNzYodZ7/ZolKXADoDAJsmSJXahpXiXxPThdlIBlCSFUh+rd1wBNvuttLu1sOGae7zYjy4Nt8QgXpoXbzf9/HVYNfi3O+KK5XP5V3rEti2rde3pHvyuVtFAMB8/JjWJLlEU0M7nlnE0e1fjGVqPgVg4b8E0rHnHoSeDY1mx/CCUiIyiVZdQ8YE7bVgdpCWCqrj6xIQ0Rtm/qlB3okXywHoDJcxAnWa0OPtpb8M8nPP06V6tVD3/Mqj2zcOApjA0/g5AU6HYl7llcAANP4WHnH6SfEQ65hPJuJdvh8cuDs165y8nO1bqiZb4KoyVhhYVoDLqxEDAwT+EBqwwAGwm4jQmmyGF/g3Y3pi+MLU2U9UCjKUwCga/BUmAT8CiDIAnRfCyI8LxSNCeABgh1uro+zWlq7YQ9v++WXe7GWDziu/bcS0+AQGvr8EgD/aK7uaswjePgAAAABJRU5ErkJggg==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479868/FB%20Mobile%20-%20Clean%20my%20feeds.user.js
// @updateURL https://update.greasyfork.org/scripts/479868/FB%20Mobile%20-%20Clean%20my%20feeds.meta.js
// ==/UserScript==

// src/config.ts
var devMode = false;
var bodyId = "app-body";
var screenRootSelector = "#screen-root";
var routeNodeSelector = "[data-screen-id]:first-child";
var postContainerSelector = "[data-pull-to-refresh-action-id]";
var possibleTargetsSelectorInPost = "span.f2:not(.a), span.f5, [style^='margin-top:9px; height:21px'] > .native-text";
var navBarSelector = "[role='tablist']";
var runScriptOn = ["feed"];
var showPlaceholder = true;
var theme = {
  textColor: "ffffff",
  iconColor: "e4e6eb",
  bgClassName: "bg-fallback",
  iconBgClassName: "icon-bg-fallback"
};

// src/lib/block-counter.ts
class BlockCounter {
  static instance = null;
  elm = null;
  whitelisted = 0;
  blacklisted = 0;
  constructor() {}
  static getInstance() {
    if (!BlockCounter.instance) {
      BlockCounter.instance = new BlockCounter;
    }
    return BlockCounter.instance;
  }
  register() {
    if (!this.elm) {
      this.elm = document.createElement("div");
      this.elm.id = "block-counter";
      document.body.appendChild(this.elm);
      if (devMode)
        console.log("block counter register successful");
    } else if (!document.body.contains(this.elm)) {
      document.body.appendChild(this.elm);
      if (devMode)
        console.log("block counter register successful");
    }
    this.render();
    return () => this.destroy();
  }
  render() {
    if (this.elm) {
      this.elm.innerHTML = `<p>Whitelisted: ${this.whitelisted}</p><p>Blacklisted: ${this.blacklisted}</p>`;
    }
  }
  destroy() {
    if (this.elm && document.body.contains(this.elm)) {
      this.elm.remove();
    }
  }
  increaseWhite() {
    this.whitelisted += 1;
    this.render();
  }
  increaseBlack() {
    this.blacklisted += 1;
    this.render();
  }
}

// src/lib/get-current-page.ts
var getCurrentPage = () => {
  return document.querySelector(`${navBarSelector} > [aria-selected="true"]`)?.getAttribute("aria-label")?.split(",")[0] ?? "unknown";
};

// src/lib/make-navbar-sticky.ts
var makeNavbarSticky = () => {
  const navbar = document.querySelector(navBarSelector);
  const screenRoot = document.querySelector(screenRootSelector);
  navbar.classList.add(theme.bgClassName);
  Object.assign(navbar.style, {
    position: "sticky",
    top: "-1px",
    zIndex: "1",
    insetInline: "0"
  });
  Object.assign(screenRoot.style, {
    overflow: "visible"
  });
};

// src/lib/menu-buttons-injector.ts
class MenuButtonsInjector {
  static instance = null;
  buttonsInjected = false;
  buttonElements = [];
  constructor() {}
  static getInstance() {
    if (!MenuButtonsInjector.instance) {
      MenuButtonsInjector.instance = new MenuButtonsInjector;
    }
    return MenuButtonsInjector.instance;
  }
  inject() {
    if (this.buttonsInjected) {
      console.warn("Menu buttons already injected");
      return () => {
        this.destroy();
      };
    }
    this.injectButtons();
    this.buttonsInjected = true;
    if (devMode)
      console.log("Menu buttons injected successfully");
    return () => {
      this.destroy();
    };
  }
  setupTabBarStyles() {
    const tabBarEle = document.querySelector('[role="tablist"]');
    if (tabBarEle) {
      tabBarEle.style.position = "sticky";
      tabBarEle.style.zIndex = "1";
      tabBarEle.style.top = "0";
    }
  }
  createButton(id, imgSrc) {
    const button = document.createElement("div");
    button.id = id;
    button.className = "customBtns";
    button.innerHTML = `
			<div class="${theme.iconBgClassName}">
				<img src="${imgSrc}">
			</div>
		`;
    return button;
  }
  injectButtons() {
    const titleBarEle = document.querySelector(".filler")?.nextElementSibling;
    if (!titleBarEle || !(titleBarEle instanceof HTMLElement)) {
      if (devMode)
        console.error("Title bar element not found");
      return;
    }
    const innerScreenText = document.querySelector("#screen-root .fixed-container.top .f2")?.textContent || "";
    if (innerScreenText)
      return;
    this.destroy();
    this.buttonElements = [];
    if (!document.getElementById("settingsBtn")) {
      const settingsBtn = this.createButton("settingsBtn", "https://static.xx.fbcdn.net/rsrc.php/v4/yC/r/FgGUIEUfnev.png");
      titleBarEle.after(settingsBtn);
      this.buttonElements.push(settingsBtn);
    }
    if (!document.getElementById("feedsBtn")) {
      const feedsBtn = this.createButton("feedsBtn", "https://static.xx.fbcdn.net/rsrc.php/v4/yB/r/Bc4BAjXDBat.png");
      titleBarEle.after(feedsBtn);
      this.buttonElements.push(feedsBtn);
    }
  }
  destroy() {
    if (!this.buttonsInjected)
      return;
    this.buttonElements.forEach((button) => {
      if (devMode)
        console.log("Removing button:", button);
      button.remove();
    });
    this.buttonElements = [];
    this.buttonsInjected = false;
  }
}

// src/utils/watch-for-selectors.ts
function watchForSelectors(selectors, callback, options = {}) {
  if (!Array.isArray(selectors))
    throw new Error("watchForSelectors: Selectors must be an array");
  if (!callback || typeof callback !== "function")
    throw new Error("watchForSelectors: Callback must be a function");
  if (typeof options !== "object")
    throw new Error("watchForSelectors: Options must be an object");
  if ("resolver" in options && typeof options.resolver !== "function")
    throw new Error("watchForSelectors: Resolver must be a function that resolves to boolean");
  const elements = selectors.map((selector) => document.querySelector(selector));
  if (options.resolver?.(elements) ?? elements.every((elm) => elm !== null)) {
    callback();
    return () => null;
  }
  const observer = new MutationObserver((_, observer2) => {
    const elements2 = selectors.map((selector) => document.querySelector(selector));
    if (options.resolver?.(elements2) ?? elements2.every((elm) => elm !== null)) {
      observer2.disconnect();
      callback();
    }
  });
  observer.observe(options.target ?? document, options.observerOptions ?? { childList: true, subtree: true });
  options.signal?.addEventListener("abort", () => {
    observer.disconnect();
  }, { once: true });
  return observer.disconnect.bind(observer);
}
function watchForSelectorsPromise(selectors, options = {}) {
  return new Promise((resolve, reject) => {
    watchForSelectors(selectors, resolve, options);
    options.signal?.addEventListener("abort", () => reject(new Error("Aborted by signal")));
  });
}

// src/lib/on-ready-for-scripting.ts
var onReadyForScripting = async (cb) => {
  let cleanupFn = null;
  const main = () => {
    if (devMode)
      console.log("Main node found. Running cleanup function and restarting...");
    cleanupFn?.();
    cleanupFn = cb();
  };
  await watchForSelectorsPromise([screenRootSelector]);
  onNavigation((routeNode) => {
    if (devMode) {
      console.log("onNavigation callback called");
      console.log("Current page: ", getCurrentPage());
    }
    if (!runScriptOn.some((page) => getCurrentPage() === page)) {
      if (devMode)
        console.log("Not on target pages. Terminating...");
      return () => null;
    }
    if (document.querySelector(postContainerSelector))
      main();
    const observer = new MutationObserver((mutationList) => {
      if (devMode)
        console.log("Main node detector mutation detected");
      for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.nodeType === Node.ELEMENT_NODE && node.matches(postContainerSelector)) {
            main();
          }
        }
      }
    });
    observer.observe(routeNode, {
      childList: true
    });
    return () => {
      cleanupFn?.();
      cleanupFn = null;
      observer.disconnect();
    };
  });
};
var onNavigation = async (cb) => {
  let cleanupFn = null;
  const screenRoot = document.querySelector(screenRootSelector);
  const initialRouteNode = screenRoot.querySelector(routeNodeSelector);
  if (initialRouteNode && initialRouteNode instanceof HTMLElement) {
    cleanupFn = cb(initialRouteNode);
  }
  new MutationObserver((mutationList) => {
    if (devMode)
      console.log("Running navigation mutation");
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement && node.nodeType === Node.ELEMENT_NODE && node.matches(routeNodeSelector)) {
          if (devMode)
            console.log("Navigation detected, ", node);
          cleanupFn?.();
          cleanupFn = cb(node);
        }
      }
    }
  }).observe(screenRoot, {
    childList: true
  });
};

// src/lib/register-auto-reload-after-idle.ts
function registerAutoReloadAfterIdle(minutes = 15) {
  let leaveTime = null;
  let ctrl = new AbortController;
  if (devMode)
    console.log("Auto reload after idle registered");
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      leaveTime = new Date;
    } else {
      if (!leaveTime)
        return;
      const currentTime = new Date;
      const timeDiff = (currentTime.getTime() - leaveTime.getTime()) / 60000;
      if (timeDiff > minutes)
        location.reload();
    }
  }, { signal: ctrl.signal });
  return () => {
    ctrl.abort();
    ctrl = new AbortController;
    if (devMode)
      console.log("Auto reload after idle unregistered", ctrl.signal);
    ctrl.signal.throwIfAborted();
  };
}

// src/data/keywords-per-language.ts
var keywordsPerLanguage = {
  placeholderMessage: {
    "en-US": "Removed",
    en: "Removed",
    bn: "বাতিল"
  },
  suggested: {
    "en-US": "Suggested",
    en: "Suggested",
    bn: "আপনার জন্য প্রস্তাবিত"
  },
  sponsored: {
    "en-US": "Sponsored",
    en: "Sponsored",
    bn: "স্পনসর্ড"
  },
  uncategorized: {
    "en-US": ["Join", "Follow"],
    en: ["Join", "Follow"],
    bn: ["ফলো করুন", "যোগ দিন"]
  },
  peopleYouMayKnow: {
    "en-US": "People You May Know",
    en: "People You May Know"
  },
  reels: {
    "en-US": "Reels",
    en: "Reels"
  }
};

// src/data/filters-database.ts
var filtersDatabase = {
  suggested: {
    title: "Suggested",
    description: "Removes un-needed algorithm suggested posts",
    icon: "\uDB86\uDD01",
    keywordsDB: keywordsPerLanguage.suggested
  },
  sponsored: {
    title: "Sponsored",
    description: "Removes annoying ads",
    icon: "\uDB86\uDC11",
    keywordsDB: keywordsPerLanguage.sponsored
  },
  reels: {
    title: "Reels",
    description: "Removes annoying short videos",
    icon: "\uDB80\uDF83",
    keywordsDB: keywordsPerLanguage.reels
  },
  peopleYouMayKnow: {
    title: "People You May Know",
    description: "Removes suggested friends",
    icon: "\uDB80\uDF8D",
    keywordsDB: keywordsPerLanguage.peopleYouMayKnow
  },
  uncategorized: {
    title: "Follow/Join",
    description: "Removes suggested pages with join/follow link",
    icon: "\uDB86\uDC02",
    keywordsDB: keywordsPerLanguage.uncategorized
  }
};
var filterTitlePerKeywordIndex = new Map(Object.entries(filtersDatabase).flatMap(([_category, { title, keywordsDB }]) => Object.values(keywordsDB).flatMap((keyword) => Array.isArray(keyword) ? keyword.map((k) => [k, title]) : [[keyword, title]])));

// src/lib/get-own-language-filters.ts
var getGlobalFilters = (obj) => Array.isArray(obj.en) ? obj.en : [obj.en];
var getOwnLangFilters = (obj) => navigator.languages.flatMap((lang) => obj[lang]);

// src/lib/purge-element.ts
var purgeElement = ({
  element,
  filter,
  reason,
  author,
  placeHolderMessage,
  sponsoredFilters
}) => {
  element.tabIndex = -1;
  element.dataset.purged = "true";
  element.dataset.reason = reason;
  if (showPlaceholder && !sponsoredFilters.includes(reason)) {
    element.dataset.actualHeight = "32";
    element.classList.add(theme.bgClassName);
    element.style.height = "2rem";
    const overlay = document.createElement("article");
    overlay.className = "placeholder";
    overlay.innerHTML = `<p style="color: ${theme.textColor}">${placeHolderMessage}: ${author} (${filter})</p>`;
    element.appendChild(overlay);
  } else {
    element.dataset.actualHeight = "0";
    element.dataset.forceHide = "true";
    element.style.height = "0rem";
    const { previousElementSibling: prevElm } = element;
    if (!(prevElm && prevElm instanceof HTMLElement) || prevElm.dataset.actualHeight !== "1")
      return;
    prevElm.style.marginTop = "0px";
    prevElm.style.height = "0px";
    prevElm.dataset.actualHeight = "0";
  }
  for (const image of element.querySelectorAll("img")) {
    image.dataset.src = image.src;
    image.removeAttribute("src");
    image.dataset.nulled = "true";
  }
};

// src/lib/spinner.ts
class Spinner {
  static instance = null;
  elm = null;
  isVisible = false;
  constructor() {}
  static getInstance() {
    if (!Spinner.instance) {
      Spinner.instance = new Spinner;
    }
    return Spinner.instance;
  }
  register() {
    if (!this.elm) {
      this.elm = document.createElement("div");
      this.elm.id = "spinner";
      this.elm.innerHTML = `<div class="spinner small animated"></div>`;
      document.body.appendChild(this.elm);
      if (devMode)
        console.log("Spinner register successful");
    } else if (!document.body.contains(this.elm)) {
      document.body.appendChild(this.elm);
      if (devMode)
        console.log("Spinner register successful");
    }
    return () => this.destroy();
  }
  destroy() {
    if (this.elm && document.body.contains(this.elm)) {
      this.elm.remove();
    }
  }
  show() {
    this.isVisible = true;
    if (this.elm) {
      this.elm.style.display = "block";
    }
  }
  hide() {
    this.isVisible = false;
    if (this.elm) {
      this.elm.style.display = "none";
    }
  }
}

// src/lib/whitelisted-filters-storage.ts
class WhitelistedFiltersStorage {
  storageKey = "whitelisted-filters";
  defaultValue = [];
  cache = [];
  static instance = null;
  listeners = new Set;
  notifyListeners(newValue) {
    for (const listener of this.listeners)
      listener(newValue);
  }
  constructor() {
    this.cache = GM_getValue(this.storageKey, this.defaultValue);
  }
  static getInstance() {
    if (!WhitelistedFiltersStorage.instance) {
      WhitelistedFiltersStorage.instance = new WhitelistedFiltersStorage;
    }
    return WhitelistedFiltersStorage.instance;
  }
  get() {
    return this.cache;
  }
  set(value) {
    if (!Array.isArray(value) || !value.every((val) => typeof val === "string")) {
      console.error("Invalid value set for whitelisted filters", value);
      return;
    }
    if (devMode)
      console.log("Set new filters", value);
    GM_setValue(this.storageKey, value);
    this.cache = value;
    this.notifyListeners(value);
  }
  onChange(cb) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

// src/lib/run-feeds-cleaner.ts
var runFeedsCleaner = () => {
  if (devMode)
    console.log("navigator.languages", navigator.languages);
  const root = document.querySelector(postContainerSelector);
  const whitelistedStorageInstance = WhitelistedFiltersStorage.getInstance();
  const allFilters = Object.keys(filtersDatabase);
  const whitelistedFilters = whitelistedStorageInstance.get();
  const activeFilters = [];
  const setActiveFilters = (whitelistedFilters2) => {
    activeFilters.length = 0;
    activeFilters.push(...new Set(allFilters.flatMap((filter) => whitelistedFilters2.includes(filter) ? [] : [
      ...getGlobalFilters(filtersDatabase[filter].keywordsDB),
      ...getOwnLangFilters(filtersDatabase[filter].keywordsDB)
    ]).filter((d) => d)));
  };
  setActiveFilters(whitelistedFilters);
  const unsubscribeFeedsChangeEvent = whitelistedStorageInstance.onChange(setActiveFilters);
  const sponsoredFilters = getOwnLangFilters(filtersDatabase.sponsored.keywordsDB);
  const [placeHolderMessage] = getGlobalFilters(keywordsPerLanguage.placeholderMessage);
  const checkElement = (element) => {
    if (element.dataset.purged === "true")
      return;
    let flagged = false;
    let matchedfilter;
    let reason;
    for (const span of element.querySelectorAll(possibleTargetsSelectorInPost)) {
      let done = false;
      for (const filter of activeFilters) {
        if (!span.textContent?.includes(filter))
          continue;
        flagged = true;
        matchedfilter = filterTitlePerKeywordIndex.get(filter);
        reason = span.innerHTML;
        if (devMode)
          console.log(`Flagged post containing: "${reason}" with filter: "${matchedfilter}"`);
        done = true;
        break;
      }
      if (done)
        break;
    }
    if (!flagged) {
      BlockCounter.getInstance().increaseWhite();
      return;
    }
    BlockCounter.getInstance().increaseBlack();
    purgeElement({
      element,
      reason,
      author: element.querySelector("span.f2")?.innerHTML ?? "",
      placeHolderMessage,
      sponsoredFilters,
      filter: matchedfilter
    });
  };
  if (devMode)
    console.log("Initial checking");
  for (const element of root.querySelectorAll("[data-tracking-duration-id]")) {
    checkElement(element);
  }
  if (devMode)
    console.log("Initial checking done");
  if (devMode)
    console.log("Mutation observer setup for new posts");
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length === 0)
        continue;
      if (devMode)
        console.log("Checking posts count:", mutation.addedNodes.length);
      Spinner.getInstance().show();
      for (const element of mutation.addedNodes) {
        if (!(element instanceof HTMLElement) || element.nodeType !== Node.ELEMENT_NODE)
          continue;
        if (!element.hasAttribute("data-tracking-duration-id"))
          continue;
        checkElement(element);
      }
      Spinner.getInstance().hide();
    }
  });
  observer.observe(root, {
    childList: true
  });
  if (devMode)
    console.log("Mutation observer setup for new posts done on", root);
  return () => {
    observer.disconnect();
    unsubscribeFeedsChangeEvent();
    if (devMode)
      console.log("Mutation observer for posts disconnected");
  };
};

// src/lib/settings-menu-injector.ts
var closeMenuIcon = "\uDB85\uDE73";

class SettingsMenuInjector {
  static instance;
  ctrl;
  overlayId = "settingsOverlay";
  constructor() {
    this.ctrl = new AbortController;
  }
  static getInstance() {
    if (!SettingsMenuInjector.instance) {
      SettingsMenuInjector.instance = new SettingsMenuInjector;
    }
    return SettingsMenuInjector.instance;
  }
  generateSettingsOverlay() {
    return `
<div id="${this.overlayId}" class="dialog-screen" style="color: ${theme.textColor}">
<div class="settings-container ${theme.bgClassName}">
<div class="settings-header">
	<div class="settings-title">FB Mobile - Clean my feeds</div>
	<div class="settings-description">Mark filters to hide posts</div>
</div>
<div class="settings-items">
      ${Object.entries(filtersDatabase).map(([filterType, item]) => {
      return `
    <label id="${filterType}Tile" class="settingsItem">
      <div class="settingsIcon native-text" style="color: ${theme.iconColor}"><span>${item.icon}</span></div>
      <div class="settingsLabelContainer">
        <span class="settingsLabel">${item.title}</span>
        <span class="settingsDescription" style="color: ${theme.iconColor}" >${item.description}</span>
      </div>
      <div class="settingsCheckboxContainer">
        <div class="fb-check">
          <input type="checkbox" name="${filterType}" ${WhitelistedFiltersStorage.getInstance().get().includes(filterType) ? "" : "checked"} />
          <span class="checkmark"></span>
        </div>
      </div>
    </label>`;
    }).join(`
`).concat(`
    <div id="closeMenuTile" class="settingsItem">
      <div class="settingsIcon native-text" style="color: ${theme.iconColor}"><span>${closeMenuIcon}</span></div>
      <div class="settingsLabelContainer">
        <span class="settingsLabel">Close Menu</span>
        <span class="settingsDescription" style="color: ${theme.iconColor}" >Changes take effect on newly retrieved posts</span>
      </div>
    </div>`)}
</div>
</div>
`;
  }
  handleCheckboxChange = (event) => {
    const target = event.target;
    if (!target.matches(`#${this.overlayId} input[type="checkbox"]`))
      return;
    const { name, checked } = target;
    if (!Object.keys(filtersDatabase).includes(name))
      return;
    const whiteListedFilters = WhitelistedFiltersStorage.getInstance().get();
    const isWhiteListed = whiteListedFilters.includes(name);
    if (!checked === isWhiteListed)
      return;
    WhitelistedFiltersStorage.getInstance().set(isWhiteListed ? whiteListedFilters.filter((filter) => filter !== name) : [...whiteListedFilters, name]);
  };
  handleDocumentClick = (event) => {
    const { target, x, y } = event;
    if (!(target instanceof HTMLElement))
      return;
    if (target.matches("#settingsBtn")) {
      this.show();
    } else if (target.matches("#closeMenuTile")) {
      this.hide();
    } else if (target.matches("#feedsBtn")) {
      document.querySelector('[aria-label="Facebook Menu"]')?.click();
      watchForSelectors(['[aria-label="Feeds"]'], () => {
        document.querySelector('[aria-label="Feeds"]').click();
      }, {
        signal: this.ctrl.signal,
        target: document.querySelector(screenRootSelector)
      });
    } else if (target.matches(`#${this.overlayId}`)) {
      const { left, right, top, bottom } = target.querySelector(".settings-container").getBoundingClientRect();
      if (!(x >= left && x <= right && y >= top && y <= bottom)) {
        this.hide();
      }
    }
  };
  setupEventListeners() {
    document.addEventListener("click", this.handleDocumentClick, {
      signal: this.ctrl.signal
    });
    document.addEventListener("change", this.handleCheckboxChange, {
      signal: this.ctrl.signal
    });
  }
  destroyEventListeners() {
    this.ctrl.signal.throwIfAborted();
    this.ctrl.abort();
  }
  inject() {
    if (devMode)
      console.log("SettingsMenuInjector inject called");
    this.ctrl = new AbortController;
    this.setupEventListeners();
    if (devMode)
      console.log("SettingsMenuInjector inject successful");
    return () => {
      if (devMode)
        console.log("SettingsMenuInjector cleanup called");
      this.hide();
      this.destroyEventListeners();
    };
  }
  show() {
    if (devMode)
      console.log("SettingsMenuInjector show called");
    if (document.getElementById(this.overlayId))
      return;
    document.body.insertAdjacentHTML("beforeend", this.generateSettingsOverlay());
  }
  hide() {
    if (devMode)
      console.log("SettingsMenuInjector hide called");
    document.getElementById(this.overlayId)?.remove();
  }
}

// src/lib/updateThemeConfigWhenPossible.ts
var updateThemeConfigWhenPossible = () => watchForSelectors([
  ".native-text:last-child",
  '[role="tablist"]>*:last-child .native-text',
  '[aria-label="Search Facebook"] [class*="bg-"]'
], () => {
  const bgClassName = document.querySelector('[role="tablist"]>*:last-child').classList.values().find((v) => v.startsWith("bg-"));
  const iconBgClassName = document.querySelector('[aria-label="Search Facebook"] [class*="bg-"]').classList.values().find((v) => v.startsWith("bg-"));
  if (!bgClassName || !iconBgClassName)
    return;
  theme.bgClassName = bgClassName;
  theme.iconBgClassName = iconBgClassName;
  theme.textColor = getComputedStyle(document.querySelector(".native-text:last-child")).color;
  theme.iconColor = getComputedStyle(document.querySelector('[role="tablist"]>*:last-child .native-text')).color;
  if (devMode)
    console.log("Theme assignment successful");
}, {
  target: document.querySelector(postContainerSelector)
});

// src/style.css
var style_default = '#fbpdoesntworkonmobilesite{display:none}.dialog-screen{background-color:#0000007f;flex-direction:column;justify-content:flex-end;display:flex;position:fixed;inset:0;overflow-y:auto}.settings-container{padding-block:2rem;padding-inline:.5rem;position:relative;& .settings-header{flex-direction:column;gap:.5rem;margin-bottom:1rem;padding:.5rem 1rem;display:flex;& .settings-title{font-size:1.5rem;font-weight:600}}& .settingsItem{grid-template-columns:max-content minmax(0,1fr) max-content;align-items:center;gap:.75rem;min-height:2.5rem;padding:.5rem;display:grid;& *{pointer-events:none}& .settingsIcon{font-size:1.5rem}& .settingsLabel{font-size:1rem;font-weight:600;display:block}& .settingsDescription{white-space:nowrap;text-overflow:ellipsis;width:100%;display:block;overflow:hidden}}}.bg-fallback:before{content:"";z-index:-1;background-color:#242526;width:100%;height:100%;position:absolute;top:0;left:0}.icon-bg-fallback:before{content:"";left:calc((100% - var(--diameter))/2);top:calc((100% - var(--diameter))/2);width:var(--diameter);height:var(--diameter);z-index:-1;background-color:#ffffff1a;border-radius:50%;position:absolute}.fb-check{cursor:pointer;user-select:none;vertical-align:middle;align-items:center;font-family:sans-serif;display:inline-flex;& input{display:none}& .checkmark{border:2px solid;border-radius:3px;width:18px;height:18px;transition:background-color .2s;position:relative}& input:checked+.checkmark{background-color:#1877f2}& input:checked+.checkmark:after{content:"";border:2px solid #fff;border-width:0 2px 2px 0;width:5px;height:10px;position:absolute;top:0;left:4px;transform:rotate(45deg)}}.customBtns{z-index:2;width:45px;height:43px;position:absolute;pointer-events:all!important;&#settingsBtn{left:calc(100dvw - 138px)}&#feedsBtn{left:calc(100dvw - 180px)}&>div{z-index:0;--diameter:35px;box-sizing:border-box;flex-direction:column;flex-shrink:0;width:35px;height:35px;margin-top:4px;margin-left:5px;display:flex;position:relative}& img{filter:grayscale();object-fit:contain;width:100%;height:100%;position:absolute}}div[data-purged=true]{pointer-events:none;height:32px;position:relative;overflow-y:hidden;&[data-force-hide=true]{pointer-events:none;height:0;overflow-y:hidden}&>div{display:none!important}& .placeholder{pointer-events:auto;place-items:center;padding-inline:.5rem;display:grid;position:absolute;inset:0;& p{text-overflow:ellipsis;white-space:nowrap;text-align:center;width:100%;overflow:hidden}}}#block-counter{z-index:99;color:#ddd;pointer-events:none;background:#323436;border-radius:.2rem;flex-wrap:wrap;gap:.5rem;padding:.5rem 1rem;font-size:.8rem;display:flex;position:fixed;top:0;left:0}#spinner{pointer-events:none;z-index:100;position:fixed;top:20px;left:16px}';

// src/utils/inject-console.ts
var consoleMethodsThatDontBreakWhenArgumentIsString = ["log", "error", "warn", "info", "debug", "trace"];
function injectConsole(prefix) {
  const originalConsole = globalThis.console;
  globalThis.console = new Proxy(originalConsole, {
    get(target, prop, receiver) {
      const method = Reflect.get(target, prop, receiver);
      return consoleMethodsThatDontBreakWhenArgumentIsString.some((propName) => propName === prop) ? method.bind(target, `[${prefix}]
`) : method;
    }
  });
}

// src/lib/remove-app-install-prompt.ts
var removeAppInstallPrompt = () => {
  const node = document.querySelector('[data-screen-id]:first-child [data-comp-id~="22222"]');
  if (!node) {
    if (devMode)
      console.log("App install prompt node status: ", node);
    return;
  }
  if (devMode)
    console.log("Setting styles for App install prompt");
  node.style.display = "none";
};

// src/index.ts
(() => {
  if (document.body.id !== bodyId) {
    console.error("ID 'app-body' not found.");
    return;
  }
  injectConsole("FB Mobile - Clean my feeds (UserScript)");
  GM_addStyle(style_default);
  onReadyForScripting(() => {
    console.log("Ready for scripting");
    removeAppInstallPrompt();
    const aborts = [
      updateThemeConfigWhenPossible(),
      ...devMode ? [BlockCounter.getInstance().register()] : [],
      ...getCurrentPage() === "feed" ? [
        MenuButtonsInjector.getInstance().inject(),
        SettingsMenuInjector.getInstance().inject()
      ] : [],
      runFeedsCleaner(),
      registerAutoReloadAfterIdle()
    ];
    makeNavbarSticky();
    return () => {
      console.log("Not Ready for scripting");
      aborts.forEach((abort) => abort?.());
      aborts.length = 0;
    };
  });
})();
