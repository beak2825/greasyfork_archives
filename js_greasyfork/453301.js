// ==UserScript==
// @name        🐭️ MouseHunt - Journal Privacy
// @description Hides usernames from the journal entries on the journal page.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/453301/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Journal%20Privacy.user.js
// @updateURL https://update.greasyfork.org/scripts/453301/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Journal%20Privacy.meta.js
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

  // src/modules/journal-privacy/index.js
  var journal_privacy_exports = {};
  __export(journal_privacy_exports, {
    default: () => journal_privacy_default
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
  var onSettingsChange = (key, callback) => {
    onEvent("mh-improved-settings-changed", (args) => {
      if (args.key !== key) {
        return;
      }
      if (typeof callback === "function") {
        callback(args);
      } else if (typeof callback === "object") {
        if (args.value) {
          callback.enable(args);
        } else {
          callback.disable(args);
        }
      }
    });
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
  var onActivation = (module, callback) => {
    onEvent("mh-improved-settings-changed", ({ key, value }) => {
      if (key === module && value) {
        callback();
      }
    });
  };
  var onDeactivation = (module, callback) => {
    onEvent("mh-improved-settings-changed", ({ key, value }) => {
      if (key === module && !value) {
        callback();
      }
    });
  };

  // src/utils/links.js
  var addIconToMenu = (opts) => {
    const menu = document.querySelector(".mousehuntHeaderView-gameTabs .mousehuntHeaderView-dropdownContainer");
    if (!menu) {
      return;
    }
    const defaults = {
      id: "",
      classname: "",
      href: false,
      title: "",
      text: "",
      action: null,
      position: "prepend"
    };
    const settings = Object.assign({}, defaults, opts);
    if (!settings.classname) {
      settings.classname = settings.id;
    }
    const icon = makeElement("a", ["menuItem", settings.classname], settings.text);
    icon.id = settings.id;
    if (settings.href) {
      icon.href = settings.href;
      icon.title = settings.title;
    }
    if (settings.action) {
      icon.addEventListener("click", (e) => {
        settings.action(e, icon);
      });
    }
    if (settings.id) {
      const exists = document.querySelector(`#${settings.id}`);
      if (exists) {
        exists.replaceWith(icon);
        return;
      }
    }
    if ("prepend" === settings.position) {
      menu.prepend(icon);
    } else if ("append" === settings.position) {
      menu.append(icon);
    }
  };

  // src/utils/messages.js
  hadAddedErrorStyles = false;

  // src/utils/utils.js
  var bodyClasses = { added: [], removed: [] };
  var addBodyClass = (className, force = false) => {
    if (bodyClasses.removed.includes(className) || bodyClasses.added.includes(className)) {
      if (force) {
        bodyClasses.added.push(className);
        document.body.classList.add(className);
      }
      return;
    }
    bodyClasses.added.push(className);
    const addClass = () => {
      document.body.classList.add(className);
    };
    addClass();
    onNavigation(addClass);
    onTravel(null, {
      /**
       * Callback to add the class after travel.
       */
      callback: () => {
        setTimeout(addClass, 500);
      }
    });
  };
  var removeBodyClass = (className) => {
    bodyClasses.added = bodyClasses.added.filter((c) => c !== className);
    bodyClasses.removed.push(className);
    document.body.classList.remove(className);
  };

  // src/modules/journal-privacy/settings/index.js
  var settings_default = () => __async(void 0, null, function* () {
    return [
      {
        id: "journal-privacy.show-toggle-icon",
        title: "Show toggle icon in top menu",
        default: true
      }
    ];
  });

  // src/modules/journal-privacy/icon.css
  var icon_default = `.mousehuntHeaderView .menuItem.mousehunt-improved-journal-privacy-icon{display:flex;align-items:center;justify-content:center;width:20px;height:25px;padding:0;opacity:.5}.mousehuntHeaderView .menuItem.mousehunt-improved-journal-privacy-icon:hover{opacity:1}.mh-journal-privacy-enabled .mousehunt-improved-journal-privacy-icon:before,.mh-journal-privacy-disabled .mousehunt-improved-journal-privacy-icon:before{display:block;width:15px;height:15px;content:"";background-repeat:no-repeat;background-size:contain}.mh-journal-privacy-enabled .mousehunt-improved-journal-privacy-icon:before{background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" /></svg>')}.mh-journal-privacy-disabled .mousehunt-improved-journal-privacy-icon:before{background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clip-rule="evenodd" /><path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" /></svg>')}
`;

  // src/modules/journal-privacy/styles.css
  var styles_default = '.mh-journal-privacy-enabled #journalContainer .entry:not(.badge) a[href*="profile.php"],.mh-journal-privacy-enabled #journalContainer .entry.socialGift .journaltext a,.mh-journal-privacy-enabled #journalContainer .relicHunter_complete>.journalbody>.journaltext>b:nth-child(6),.mh-journal-privacy-enabled #journalContainer .wanted_poster-complete>.journalbody>.journaltext>b:nth-child(8),.mh-journal-privacy-enabled #journalContainer .journal__hunter-name,.mh-journal-privacy-enabled .mh-journal-privacy-name{display:inline-block;color:transparent;transition:color .3s}.mh-journal-privacy-enabled #journalContainer .entry:not(.badge) #friend-data-wrapper a[href*="profile.php"]{color:#000}.mh-journal-privacy-enabled #journalContainer .entry:not(.badge) a[href*="profile.php"]:hover,.mh-journal-privacy-enabled #journalContainer .entry:not(.badge) a[href*="profile.php"]:focus,.mh-journal-privacy-enabled #journalContainer .entry.socialGift .journaltext a:hover,.mh-journal-privacy-enabled #journalContainer .entry.socialGift .journaltext a:focus,.mh-journal-privacy-enabled #journalContainer .relicHunter_complete>.journalbody>.journaltext>b:nth-child(6):hover,.mh-journal-privacy-enabled #journalContainer .relicHunter_complete>.journalbody>.journaltext>b:nth-child(6):focus,.mh-journal-privacy-enabled #journalContainer .wanted_poster-complete>.journalbody>.journaltext>b:nth-child(8):hover,.mh-journal-privacy-enabled #journalContainer .wanted_poster-complete>.journalbody>.journaltext>b:nth-child(8):focus #journalContainer .journal__hunter-name:hover,.mh-journal-privacy-enabled #journalContainer .journal__hunter-name:focus,.mh-journal-privacy-enabled .mh-journal-privacy-name:hover,.mh-journal-privacy-enabled .mh-journal-privacy-name:focus{display:inline;color:#3b5998}\n';

  // src/modules/journal-privacy/index.js
  var applyClassToNames = () => {
    if (!isPrivacyEnabled) {
      return;
    }
    const entries = document.querySelectorAll("#journalContainer .entry.relicHunter_start .journaltext");
    if (!entries) {
      return;
    }
    entries.forEach((entry) => {
      if (!entry || !entry.textContent) {
        return;
      }
      if (entry.getAttribute("replaced") === "true") {
        return;
      }
      const match = entry.textContent.match(/(.*)( has joined the | has left the | used Rare Map Dust |, the map owner, has )/);
      if (match && match[1]) {
        const span = document.createElement("span");
        span.classList.add("mh-journal-privacy-name");
        span.textContent = match[1];
        entry.setAttribute("data-original", match[1]);
        entry.setAttribute("replaced", "true");
        entry.innerHTML = entry.innerHTML.replace(match[1], span.outerHTML);
      }
    });
  };
  var removeClassFromNames = () => {
    if (isPrivacyEnabled) {
      return;
    }
    const entries = document.querySelectorAll("#journalContainer .entry.relicHunter_start .journaltext");
    if (!entries) {
      return;
    }
    entries.forEach((entry) => {
      if (!entry || !entry.textContent) {
        return;
      }
      if (entry.getAttribute("replaced") !== "true") {
        return;
      }
      const span = entry.querySelector(".mh-journal-privacy-name");
      if (span) {
        entry.innerHTML = entry.innerHTML.replace(span.outerHTML, span.textContent);
        entry.removeAttribute("replaced");
      }
    });
  };
  var enablePrivacy = () => {
    addBodyClass("mh-journal-privacy-enabled", true);
    removeBodyClass("mh-journal-privacy-disabled");
    applyClassToNames();
  };
  var disablePrivacy = () => {
    removeBodyClass("mh-journal-privacy-enabled");
    addBodyClass("mh-journal-privacy-disabled", true);
    removeClassFromNames();
  };
  var addIcon = () => {
    if (!getSetting("journal-privacy.show-toggle-icon", false)) {
      return;
    }
    const existingIcon = document.querySelector("#mousehunt-improved-journal-privacy");
    if (existingIcon) {
      existingIcon.style.display = "";
      existingIcon.style.visibility = "";
      return;
    }
    addIconToMenu({
      id: "mousehunt-improved-journal-privacy",
      classname: "mousehunt-improved-journal-privacy-icon",
      title: "Toggle Journal Privacy",
      position: "prepend",
      action: () => {
        isPrivacyEnabled = !isPrivacyEnabled;
        if (isPrivacyEnabled) {
          disablePrivacy();
        } else {
          enablePrivacy();
        }
      }
    });
  };
  var removeIcon = () => {
    if (getSetting("journal-privacy.show-toggle-icon", false)) {
      return;
    }
    const icon = document.querySelector("#mousehunt-improved-journal-privacy");
    if (icon) {
      icon.style.display = "none";
      icon.style.visibility = "hidden";
    }
  };
  var isPrivacyEnabled = true;
  var init = () => __async(void 0, null, function* () {
    addStyles([styles_default, icon_default], "journal-privacy");
    enablePrivacy();
    if (getSetting("journal-privacy.show-toggle-icon", false)) {
      addIcon();
      disablePrivacy();
    }
    onRequest("pages/journal.php", applyClassToNames);
    onActivation(() => {
      addIcon();
      enablePrivacy();
    });
    onDeactivation(() => {
      removeIcon();
      disablePrivacy();
    });
    onSettingsChange("journal-privacy.show-toggle-icon", {
      enable: addIcon,
      disable: removeIcon
    });
  });
  var journal_privacy_default = {
    id: "journal-privacy",
    name: "Journal Privacy",
    type: "element-hiding",
    default: false,
    description: "Hides player names in the journal. Good for screenshots that won't dox them.",
    load: init,
    settings: settings_default
  };
  return __toCommonJS(journal_privacy_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('Journal Privacy', 'https://greasyfork.org/en/scripts/453301-mousehunt-journal-privacy');
