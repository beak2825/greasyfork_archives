// ==UserScript==
// @name        🐭️ MouseHunt - No Sidebar
// @description Improve your MouseHunt experience. Please only use this when the extension is not available, like on mobile.
// @version     2.1.0
// @license     MIT
// @author      bradp
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mh-improved/icon-64.png
// @run-at      document-end
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/449491/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20No%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/449491/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20No%20Sidebar.meta.js
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

  // src/modules/hide-sidebar/index.js
  var hide_sidebar_exports = {};
  __export(hide_sidebar_exports, {
    default: () => hide_sidebar_default
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
  var onDeactivation = (module, callback) => {
    onEvent("mh-improved-settings-changed", ({ key, value }) => {
      if (key === module && !value) {
        callback();
      }
    });
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

  // src/modules/hide-sidebar/styles.css
  var styles_default = ".pageFrameView{-ms-grid-columns:[first] auto [content-start] 760px [content-end] auto [last];grid-template-columns:[first] auto [content-start] 760px [content-end] auto [last]}.pageFrameView .pageSidebarView-user{padding:0 0 10px;border-bottom:none}.pageSidebarView{display:none}.mousehuntHeaderView .menuItem.sidebar.dropdown{cursor:unset}.mousehuntHeaderView .menuItem.sidebar .dropdownContent{width:365px;padding:10px}.mousehuntHeaderView .menuItem.sidebar .dropdownContent a{display:unset;height:auto;padding:0;font-variant:none;border-bottom:none}.mousehuntHeaderView .menuItem.sidebar .dropdownContent a:hover,.mousehuntHeaderView .menuItem.sidebar .dropdownContent a:focus{text-decoration:underline;background-color:unset}.mousehuntHeaderView .menuItem.sidebar .dropdownContent a.pageSidebarView-user-image{width:30px;height:30px;padding:0;background-repeat:no-repeat;background-position:50% 50%;background-size:contain;border:1px solid #808080}.mousehuntHeaderView .menuItem.sidebar .dropdownContent .pageSidebarView-user a:nth-child(2){display:inline;padding:0;font-size:inherit;font-variant:none;color:#3b5998;border-bottom:none}.mousehuntHeaderView .menuItem.sidebar .dropdownContent .pageSidebarView-user br{display:none}.mousehuntHeaderView .menuItem.sidebar .dropdownContent a.pageSidebarView-user-logout{display:inline-block;float:right;height:auto;padding:5px 0;margin-right:10px;font-size:inherit;font-variant:none;color:#3b5998;border-bottom:none;border-radius:0}.scoreboardRankingsWrapper{display:grid;grid-template-columns:1fr 1fr;grid-gap:5px;line-height:14px}.scoreboardRelativeRankingTableView-table{padding-top:5px;background:#fff}.mousehuntHeaderView .menuItem.sidebar .dropdownContent .scoreboardRankingsWrapper a{font-size:9px;color:#3b5998;text-decoration:none;vertical-align:middle;border-radius:0}.mousehuntHeaderView .menuItem.sidebar .dropdownContent .scoreboardRankingsWrapper a:hover,.mousehuntHeaderView .menuItem.sidebar .dropdownContent .scoreboardRankingsWrapper a:focus,.mousehuntHeaderView .menuItem.sidebar .dropdownContent .scoreboardRankingsWrapper a:active{text-decoration:underline}\n";

  // src/modules/hide-sidebar/index.js
  var moveSidebar = () => {
    const menuTab = document.createElement("div");
    menuTab.classList.add("menuItem");
    menuTab.classList.add("dropdown");
    menuTab.classList.add("sidebar");
    menuTab.addEventListener("click", () => {
      menuTab.classList.toggle("expanded");
    });
    const menuTabTitle = document.createElement("span");
    menuTabTitle.innerText = "Sidebar";
    const menuTabArrow = document.createElement("div");
    menuTabArrow.classList.add("arrow");
    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdownContent");
    const sidebarUser = document.querySelector(".pageSidebarView-user");
    if (sidebarUser) {
      const sidebarUserClone = sidebarUser.cloneNode(true);
      dropdownContent.append(sidebarUserClone);
    }
    const scoreBoardRankings = document.querySelectorAll(".scoreboardRelativeRankingTableView-table");
    if (scoreBoardRankings) {
      const scoreBoardRankingWrapper = document.createElement("div");
      scoreBoardRankingWrapper.classList.add("scoreboardRankingsWrapper");
      scoreBoardRankings.forEach((scoreBoardRanking) => {
        const scoreBoardRankingClone = scoreBoardRanking.cloneNode(true);
        scoreBoardRankingWrapper.append(scoreBoardRankingClone);
      });
      dropdownContent.append(scoreBoardRankingWrapper);
    }
    menuTab.append(menuTabTitle);
    menuTab.append(menuTabArrow);
    menuTab.append(dropdownContent);
    const tabsContainer = document.querySelector(".mousehuntHeaderView-dropdownContainer");
    if (!tabsContainer) {
      return;
    }
    tabsContainer.insertBefore(menuTab, tabsContainer.lastChild);
  };
  var init = () => __async(void 0, null, function* () {
    addStyles(styles_default, "no-sidebar");
    addBodyClass("no-sidebar");
    moveSidebar();
    hg.views.PageFrameView.setShowSidebar(false);
    onDeactivation("no-sidebar", () => {
      hg.views.PageFrameView.setShowSidebar(true);
      const menuTab = document.querySelector(".menuItem.sidebar");
      if (menuTab) {
        menuTab.remove();
      }
    });
  });
  var hide_sidebar_default = {
    id: "no-sidebar",
    name: "Hide Sidebar",
    type: "element-hiding",
    default: true,
    description: "Hides the sidebar and adds a 'Sidebar' dropdown in the top menu.",
    load: init
  };
  return __toCommonJS(hide_sidebar_exports);
})();
mhImprovedVersion = "0.0.0-userscript;"
mhImprovedPlatform = "userscript";
mhui.default.load();
migrateUserscript('No Sidebar', 'https://greasyfork.org/en/scripts/449491-mousehunt-no-sidebar');
