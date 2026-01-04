// ==UserScript==
// @name         TORN: Better Chat
// @namespace    dekleinekobini.betterchat
// @version      3.1.0
// @author       DeKleineKobini [2114440]
// @description  Improvements to the usability of chats 2.0.
// @license      GPL-3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/478093/TORN%3A%20Better%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/478093/TORN%3A%20Better%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const CHAT_SELECTORS = Object.freeze({
    /*
     * Global
     */
    CHAT_ROOT_ID: "chatRoot",
    AVATAR_WRAPPER_CLASS: "avatar__avatar-status-wrapper___",
    /*
     * Chat Boxes
     */
    GROUP_MENU_DESKTOP_CLASS: "minimized-menus__desktop___",
    GROUP_MENU_MOBILE_CLASS: "minimized-menus__mobile___",
    GROUP_MENU_MOBILE_BUTTON_CLASS: "minimized-menus__mobile-button___",
    CHAT_LIST_CLASS: "chat-app__chat-list-chat-box-wrapper___",
    CHAT_LIST_GROUP_CHAT_CLASS: "minimized-menu-item___",
    CHAT_LIST_NOTEPAD_CLASS: "chat-note-button___",
    CHAT_LIST_SETTINGS_CLASS: "chat-setting-button___",
    CHAT_LIST_PEOPLE_CLASS: "chat-list-button___",
    CHAT_MESSAGE_COUNT_CLASS: "message-count___",
    CHAT_WRAPPER_WRAPPER_CLASS: "group-chat-box___",
    CHAT_WRAPPER_CLASS: "group-chat-box__chat-box-wrapper___",
    CHAT_HEADER_CLASS: "chat-box-header___",
    CHAT_HEADER_INFO_BUTTON_CLASS: "chat-box-header__info-btn___",
    CHAT_HEADER_INFO_CLASS: "chat-box-header__info___",
    CHAT_HEADER_AVATAR_CLASS: "chat-box-header__avatar___",
    CHAT_HEADER_MINIMIZE_ICON_CLASS: "minimize-icon",
    CHAT_HEADER_CLOSE_ICON_CLASS: "close-icon",
    CHAT_BODY_CLASS: "chat-box-body___",
    /*
     * Messages
     */
    COLOR_ERROR_CLASS: "color-chatError",
    MESSAGE_BODY_WRAPPER_CLASS: "chat-box-message___",
    MESSAGE_BODY_WRAPPER_SELF_CLASS: "chat-box-message--self___",
    MESSAGE_BODY_CLASS: "chat-box-message__box___",
    MESSAGE_BODY_SELF_CLASS: "chat-box-message__box--self___",
    MESSAGE_SENDER_CLASS: "chat-box-message__sender___",
    MESSAGE_MINIMIZED_BOX_AVATAR_CLASS: "minimized-chat-box__avatar___",
    MESSAGE_AVATAR_CLASS: "chat-box-message__avatar___",
    MESSAGE_CONTENT_WRAPPER_CLASS: "chat-box-message__message___",
    MESSAGE_SEND_BUTTON_CLASS: "chat-box-footer__send-icon-wrapper___",
    LAST_MESSAGE_TIMESTAMP_CLASS: "chat-box-body__lastmessage-timestamp___",
    /*
     * People Panel
     */
    PANEL_WRAPPER_CLASS: "chat-app__panel___",
    /*
     * People Panel
     */
    PEOPLE_PANEL_LOADING: "chat-tab__loader___",
    PEOPLE_PANEL_CLASS: "chat-tab___",
    PEOPLE_PANEL_CLOSE_BUTTON_ID: "_close_default_dark",
    PEOPLE_PANEL_SETTINGS_BUTTON_ID: "setting_default",
    PEOPLE_PANEL_HEADER_BUTTON: "chat-list-header__button___",
    PEOPLE_PANEL_TABS_WRAPPER_CLASS: "chat-list-header__tabs___",
    PEOPLE_PANEL_TAB_ACTIVE_CLASS: "chat-list-header__tab--active___",
    PEOPLE_PANEL_TAB_CONTENT_CLASS: "chat-tab-content___",
    PEOPLE_PANEL_MEMBER_CARD_CLASS: "member-card___",
    PEOPLE_PANEL_STATUS_ONLINE_CLASS: "online-status--online___",
    PEOPLE_PANEL_STATUS_IDLE_CLASS: "online-status--idle___",
    PEOPLE_PANEL_STATUS_OFFLINE_CLASS: "online-status--offline___",
    /*
     * Settings Panel
     */
    SETTINGS_PANEL_CLASS: "settings-panel___",
    SETTINGS_PANEL_HEADER_CLASS: "settings-header___",
    SETTINGS_PANEL_HEADER_TITLE_CLASS: "settings-header__text-container___",
    SETTINGS_PANEL_CLOSE_BUTTON_CLASS: "settings-header__close-button___"
  });
  function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }
  function isHTMLElement(node) {
    return isElement(node) && node instanceof HTMLElement;
  }
  function findByPartialClass(node, className, subSelector = "") {
    return node.querySelector(`[class*='${className}'] ${subSelector}`.trim());
  }
  function findAll(node, selector) {
    return [...node.querySelectorAll(selector)];
  }
  function findAllByPartialClass(node, className, subSelector = "") {
    return findAll(node, `[class*='${className}'] ${subSelector}`.trim());
  }
  async function findDelayed(node, findElement, timeout) {
    return new Promise((resolve, reject) => {
      const initialElement = findElement();
      if (initialElement) {
        resolve(initialElement);
        return;
      }
      const observer = new MutationObserver(() => {
        const element = findElement();
        element && (clearTimeout(timeoutId), observer.disconnect(), resolve(element));
      }), timeoutId = setTimeout(() => {
        observer.disconnect(), reject("Failed to find the element within the acceptable timeout.");
      }, timeout);
      observer.observe(node, { childList: true, subtree: true });
    });
  }
  async function findByPartialClassDelayed(node, className, subSelector = "", timeout = 5e3) {
    return findDelayed(node, () => findByPartialClass(node, className, subSelector), timeout);
  }
  async function findBySelectorDelayed(node, selector, timeout = 5e3) {
    return findDelayed(node, () => node.querySelector(selector), timeout);
  }
  function pluralize(word, amount) {
    return amount === 1 ? `${amount} ${word}` : `${amount} ${word}s`;
  }
  async function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }
  function mergeRecursive(input, otherObject) {
    const target = JSON.parse(JSON.stringify(input));
    return Object.entries(otherObject).forEach(([key, value]) => {
      try {
        typeof value == "object" && !Array.isArray(value) ? target[key] = mergeRecursive(input[key], value) : target[key] = value;
      } catch {
        target[key] = value;
      }
    }), target;
  }
  let currentPlayerName;
  function getCurrentPlayerName() {
    if (currentPlayerName)
      return currentPlayerName;
    const websocketElement = document.getElementById("websocketConnectionData");
    if (websocketElement) {
      const data = JSON.parse(websocketElement.textContent);
      return currentPlayerName = data.playername, data.playername;
    }
    const sidebarElement = findByPartialClass(document, "menu-value___");
    if (sidebarElement)
      return currentPlayerName = sidebarElement.textContent, sidebarElement.textContent;
    const attackerElement = document.querySelector(".user-name.left");
    if (attackerElement)
      return currentPlayerName = attackerElement.textContent, attackerElement.textContent;
    const chatSenderElement = document.querySelector(
      `[class*='${CHAT_SELECTORS.MESSAGE_BODY_WRAPPER_SELF_CLASS}'] [class*='${CHAT_SELECTORS.MESSAGE_SENDER_CLASS}']`
    );
    if (chatSenderElement) {
      let name = chatSenderElement.textContent;
      return name = name.substring(0, name.length - 1), currentPlayerName = name, name;
    }
    return console.warn("[Playground] Failed to get the current player's name."), "unknown current player";
  }
  function notNull(value) {
    return value != null;
  }
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  const TEXT_COLORS = {
    "torntools-green": "#7ca900"
  };
  function baseColor(color) {
    if (color in TEXT_COLORS)
      return TEXT_COLORS[color];
    return color;
  }
  function convertColor(color) {
    const base = baseColor(color);
    return base.length === 7 ? `${base}6e` : base;
  }
  const SETTINGS_KEY = "better-chat-settings";
  const DEFAULT_SETTINGS = {
    messages: {
      hideAvatars: true,
      compact: true,
      leftAlignedText: true,
      // left align all text, prefixed by the name (supports the mini-profile as well), even for private chats
      highlight: [
        // Colors can be specified as:
        // - hex color (include #, only full format = 6 numbers)
        // - custom colors (check below); "torntools-green"
        // Search is just text, except "%player%" where it used the current players name.
        { id: 0, color: "torntools-green", search: "%player%" }
      ],
      fontSize: {
        enabled: false,
        size: 12
      }
    },
    box: {
      groupRight: true,
      // opening chat logic to put private chat left of group chats
      hideAvatars: true,
      nameAutocomplete: false,
      mobileGroups: false
    },
    people: {
      sortOnStatus: true
    },
    accessibility: {
      describeButtons: true,
      presentationSender: true
    }
  };
  function loadSettings() {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    const settings2 = storedSettings ? JSON.parse(storedSettings) : {};
    return mergeRecursive(DEFAULT_SETTINGS, settings2);
  }
  function save() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
  function showSettingsIcon(panel) {
    if (panel.querySelector("#better-chat-settings-icon"))
      return;
    const icon = createScriptSettingsIcon();
    const closeButton = findByPartialClass(panel, CHAT_SELECTORS.SETTINGS_PANEL_CLOSE_BUTTON_CLASS);
    if (!closeButton)
      return;
    closeButton.insertAdjacentElement("beforebegin", icon);
  }
  function createScriptSettingsIcon() {
    const button = document.createElement("button");
    button.type = "button";
    button.ariaLabel = "Better Chat settings";
    button.textContent = "BS";
    button.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
        showScriptSettings();
      },
      { capture: true }
    );
    const icon = document.createElement("div");
    icon.id = "better-chat-settings-icon";
    icon.appendChild(button);
    return icon;
  }
  function showScriptSettings() {
    if (document.querySelector(".better-chat-settings-overlay"))
      return;
    const popup = createPopup();
    const overlay = createOverlay();
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    popup.focus();
  }
  function createPopup() {
    const popup = document.createElement("div");
    popup.classList.add("better-chat-settings-popup");
    popup.setAttribute("autofocus", "");
    popup.setAttribute("tabindex", "0");
    appendTitle("Better Chat - Settings");
    appendDescription("You can change your Better Chat settings here. Reload after changes to apply them.");
    appendSubtitle("Messages");
    appendCheckbox(
      "messages-hideAvatars",
      "Hide avatars in the messages.",
      () => settings.messages.hideAvatars,
      (newValue) => settings.messages.hideAvatars = newValue
    );
    appendCheckbox(
      "messages-compact",
      "Make the chat significantly compacter.",
      () => settings.messages.compact,
      (newValue) => settings.messages.compact = newValue
    );
    appendCheckbox(
      "messages-leftAlignedText",
      "Left align all messages.",
      () => settings.messages.leftAlignedText,
      (newValue) => settings.messages.leftAlignedText = newValue
    );
    {
      const inputId = `setting-font-size`;
      const checkbox = document.createElement("input");
      checkbox.checked = settings.messages.fontSize.enabled;
      checkbox.id = inputId;
      checkbox.type = "checkbox";
      checkbox.addEventListener(
        "change",
        () => {
          settings.messages.fontSize.enabled = checkbox.checked;
          save();
        },
        { capture: true }
      );
      const label = document.createElement("label");
      label.setAttribute("for", inputId);
      label.innerText = "Font size";
      const sizeInput = document.createElement("input");
      sizeInput.value = settings.messages.fontSize.size.toString();
      sizeInput.type = "number";
      sizeInput.addEventListener(
        "change",
        () => {
          settings.messages.fontSize.size = parseInt(sizeInput.value, 10);
          save();
        },
        { capture: true }
      );
      sizeInput.style.width = "40px";
      sizeInput.style.marginLeft = "2px";
      const section = document.createElement("section");
      section.appendChild(checkbox);
      section.appendChild(label);
      section.appendChild(sizeInput);
      popup.appendChild(section);
    }
    appendSubtitle("Boxes");
    appendCheckbox(
      "box-groupRight",
      "Move group chats to always be to the right of private chats.",
      () => settings.box.groupRight,
      (newValue) => settings.box.groupRight = newValue
    );
    appendCheckbox(
      "box-hideAvatars",
      "Hide avatars in the boxes.",
      () => settings.box.hideAvatars,
      (newValue) => settings.box.hideAvatars = newValue
    );
    appendCheckbox(
      "box-autocomplete",
      "Autocomplete when entering an message inside of a group box.",
      () => settings.box.nameAutocomplete,
      (newValue) => settings.box.nameAutocomplete = newValue
    );
    appendCheckbox(
      "box-mobileGroups",
      "Always show group chats on mobile.",
      () => settings.box.mobileGroups,
      (newValue) => settings.box.mobileGroups = newValue
    );
    appendSubtitle("Highlights");
    appendHighlightList(
      () => settings.messages.highlight,
      ({ search, color }) => {
        const removeIndex = settings.messages.highlight.findLastIndex((highlight) => highlight.search === search && highlight.color === color);
        settings.messages.highlight = settings.messages.highlight.filter((_, index) => index !== removeIndex);
      },
      (item) => settings.messages.highlight.push(item)
    );
    appendSubtitle("People");
    appendCheckbox(
      "people-sortOnStatus",
      "Sort players in the people tab based on status.",
      () => settings.people.sortOnStatus,
      (newValue) => settings.people.sortOnStatus = newValue
    );
    appendSubtitle("Accessibility");
    appendCheckbox(
      "accessibility-describeButtons",
      "Describe (most) buttons, for users with a screen reader.",
      () => settings.accessibility.describeButtons,
      (newValue) => settings.accessibility.describeButtons = newValue
    );
    appendCheckbox(
      "accessibility-presentationSender",
      "Don't read out the button role of the sender.",
      () => settings.accessibility.presentationSender,
      (newValue) => settings.accessibility.presentationSender = newValue
    );
    return popup;
    function appendTitle(title) {
      const titleElement = document.createElement("span");
      titleElement.classList.add("better-chat-settings-title");
      titleElement.textContent = title;
      const closeElement = document.createElement("button");
      closeElement.classList.add("better-chat-settings-close-popup");
      closeElement.textContent = "X";
      closeElement.addEventListener("click", () => {
        [...document.getElementsByClassName("better-chat-settings-overlay")].forEach((overlay) => overlay.remove());
      });
      closeElement.ariaLabel = "Close better chat settings";
      const titleWrapper = document.createElement("div");
      titleWrapper.classList.add("better-chat-settings-title-wrapper");
      titleWrapper.appendChild(titleElement);
      titleWrapper.appendChild(closeElement);
      popup.appendChild(titleWrapper);
    }
    function appendDescription(title) {
      const titleElement = document.createElement("span");
      titleElement.classList.add("better-chat-settings-description");
      titleElement.innerText = title;
      popup.appendChild(titleElement);
    }
    function appendSubtitle(title) {
      const titleElement = document.createElement("span");
      titleElement.classList.add("better-chat-settings-subtitle");
      titleElement.innerText = title;
      popup.appendChild(titleElement);
    }
    function appendCheckbox(id, labelText, valueGetter, valueSetter) {
      const inputId = `setting-${id}`;
      const input = document.createElement("input");
      input.checked = valueGetter();
      input.id = inputId;
      input.type = "checkbox";
      input.addEventListener(
        "change",
        () => {
          valueSetter(input.checked);
          save();
        },
        { capture: true }
      );
      const label = document.createElement("label");
      label.setAttribute("for", inputId);
      label.innerText = labelText;
      const section = document.createElement("section");
      section.appendChild(input);
      section.appendChild(label);
      popup.appendChild(section);
    }
    function appendHighlightList(valueGetter, valueRemover, valueAdder) {
      const list = document.createElement("ul");
      valueGetter().forEach((item) => appendRow(item));
      const addButton = document.createElement("button");
      addButton.textContent = "add";
      addButton.addEventListener("click", () => {
        const item = { search: "%player%", color: "#7ca900" };
        valueAdder(item);
        appendRow(item, true);
        save();
      });
      list.appendChild(addButton);
      popup.appendChild(list);
      function appendRow(item, beforeButton = false) {
        const itemElement = document.createElement("li");
        itemElement.classList.add("better-chat-settings-highlight-entry");
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Search...";
        searchInput.value = item.search;
        searchInput.addEventListener("change", () => {
          item.search = searchInput.value;
          save();
        });
        itemElement.appendChild(searchInput);
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = baseColor(item.color);
        colorInput.addEventListener("change", () => {
          item.color = colorInput.value;
          save();
        });
        itemElement.appendChild(colorInput);
        const removeButton = document.createElement("button");
        removeButton.textContent = "remove";
        removeButton.addEventListener("click", () => {
          itemElement.remove();
          valueRemover(item);
          save();
        });
        itemElement.appendChild(removeButton);
        if (beforeButton) {
          list.insertBefore(itemElement, addButton);
        } else {
          list.appendChild(itemElement);
        }
      }
    }
  }
  function createOverlay() {
    const overlay = document.createElement("div");
    overlay.classList.add("better-chat-settings-overlay");
    overlay.addEventListener(
      "click",
      (event) => {
        if (event.target !== overlay)
          return;
        overlay.remove();
      },
      { once: true }
    );
    return overlay;
  }
  const settings = loadSettings();
  class ScriptEventHandler {
    static onLoad() {
      new MutationObserver((_, observer) => {
        const group = findByPartialClass(document, CHAT_SELECTORS.CHAT_WRAPPER_WRAPPER_CLASS);
        if (!group)
          return;
        observer.disconnect();
        ScriptEventHandler.onChatLoad(group);
      }).observe(document, { childList: true, subtree: true });
      new MutationObserver((_, observer) => {
        const chatList = findByPartialClass(document, CHAT_SELECTORS.CHAT_LIST_CLASS);
        if (!chatList)
          return;
        ScriptEventHandler.handlePanel(chatList);
        new MutationObserver(() => ScriptEventHandler.handlePanel(chatList)).observe(chatList, { childList: true });
        observer.disconnect();
      }).observe(document, { childList: true, subtree: true });
      findBySelectorDelayed(document, "head").then(() => {
        StylingFeature.defaultStyles();
        StylingFeature.improveStyles();
        StylingFeature.mobileGroups();
        StylingFeature.hideAvatars();
        StylingFeature.compact();
        StylingFeature.groupRight();
        StylingFeature.leftAlignedText();
        StylingFeature.fontSize();
      }).catch((reason) => console.error("[BC] Failed to apply styles.", reason));
    }
    static onChatLoad(root) {
      root.childNodes.forEach((node) => ScriptEventHandler.onChatOpened(node));
      new MutationObserver(
        (mutations) => mutations.flatMap((mutation) => [...mutation.addedNodes]).filter(isHTMLElement).forEach(ScriptEventHandler.onChatOpened)
      ).observe(root, { childList: true });
      setInterval(ScriptEventHandler.onUnreadCountChange, 5e3);
      setTimeout(ScriptEventHandler.onUnreadCountChange, 1e3);
      ScriptEventHandler.onUnreadCountChange();
      AccessibilityFeature.describeRootPanels();
    }
    static onChatOpened(chat) {
      const bodyElement = findByPartialClass(chat, CHAT_SELECTORS.CHAT_BODY_CLASS);
      bodyElement.childNodes.forEach((node) => ScriptEventHandler.onMessageReceived(node));
      new MutationObserver((mutations) => {
        mutations.flatMap((mutation) => [...mutation.addedNodes]).filter(isHTMLElement).forEach(ScriptEventHandler.onMessageReceived);
      }).observe(chat, { childList: true });
      new MutationObserver(() => bodyElement.childNodes.forEach((node) => ScriptEventHandler.onMessageReceived(node))).observe(
        bodyElement,
        {
          childList: true
        }
      );
      AccessibilityFeature.describeChatButtons(chat);
      ChatGroupFeature.moveGroupRight(chat);
      ChatGroupFeature.nameAutocompletion(chat);
    }
    static onMessageReceived(message) {
      if (message.querySelector(`.${CHAT_SELECTORS.COLOR_ERROR_CLASS}`)) {
        return;
      }
      if (message instanceof HTMLElement && message.className.includes(CHAT_SELECTORS.LAST_MESSAGE_TIMESTAMP_CLASS)) {
        return;
      }
      const senderElement = findByPartialClass(message, CHAT_SELECTORS.MESSAGE_SENDER_CLASS);
      const currentPlayer = getCurrentPlayerName();
      let senderName = senderElement.textContent.substring(0, senderElement.textContent.length - 1);
      if (senderName === "newMessage") {
        senderElement.textContent = `${currentPlayer}:`;
        senderName = currentPlayer;
      }
      AccessibilityFeature.describeMessageButtons(message, senderName);
      MessageFeature.highlightMessages(message, senderName);
    }
    static onPeoplePanelLoad(panel) {
      AccessibilityFeature.appPanelAccessibility(panel);
    }
    static onSettingsPanelLoad(panel) {
      showSettingsIcon(panel);
    }
    static onPeopleListLoad(content) {
      PeopleStatusFeature.sortOnStatus(content);
    }
    static handlePanel(chatList) {
      var _a;
      const peoplePanel = (_a = chatList.querySelector(
        `[class*='${CHAT_SELECTORS.PANEL_WRAPPER_CLASS}'] [class*='${CHAT_SELECTORS.PEOPLE_PANEL_CLASS}']`
      )) == null ? void 0 : _a.parentElement;
      if (peoplePanel && !peoplePanel.querySelector(".better-chat-found")) {
        findByPartialClass(peoplePanel, CHAT_SELECTORS.PEOPLE_PANEL_CLASS).classList.add("better-chat-found");
        ScriptEventHandler.onPeoplePanelLoad(peoplePanel);
        new MutationObserver(() => {
          ScriptEventHandler.onPeoplePanelLoad(peoplePanel);
        }).observe(peoplePanel, { childList: true });
      }
      const settingsPanel = chatList.querySelector(`[class*='${CHAT_SELECTORS.PANEL_WRAPPER_CLASS}'] [class*='${CHAT_SELECTORS.SETTINGS_PANEL_CLASS}']`);
      if (settingsPanel && !settingsPanel.querySelector(".better-chat-found")) {
        settingsPanel.classList.add("better-chat-found");
        ScriptEventHandler.onSettingsPanelLoad(settingsPanel);
      }
      const tabSelector = findByPartialClass(chatList, CHAT_SELECTORS.PEOPLE_PANEL_TABS_WRAPPER_CLASS);
      const tabContent = findByPartialClass(chatList, CHAT_SELECTORS.PEOPLE_PANEL_TAB_CONTENT_CLASS);
      if (tabContent) {
        new MutationObserver((mutations) => {
          const hasRemovedLoader = mutations.flatMap((mutation) => [...mutation.removedNodes]).filter(isElement).map((node) => node.getAttribute("class")).filter(notNull).find((className) => className.includes(CHAT_SELECTORS.PEOPLE_PANEL_LOADING));
          if (!hasRemovedLoader)
            return;
          ScriptEventHandler.handlePanelTab(tabSelector, tabContent);
        }).observe(tabContent, { childList: true });
        new Promise(async (resolve, reject) => {
          let times = 0;
          let element;
          do {
            element = findByPartialClass(document, CHAT_SELECTORS.PEOPLE_PANEL_TAB_ACTIVE_CLASS);
            if (!element) {
              await sleep(100);
            }
          } while (!element && ++times < 1e3);
          if (element)
            resolve();
          else
            reject();
        }).then(() => {
          ScriptEventHandler.handlePanelTab(
            findByPartialClass(chatList, CHAT_SELECTORS.PEOPLE_PANEL_TABS_WRAPPER_CLASS),
            findByPartialClass(chatList, CHAT_SELECTORS.PEOPLE_PANEL_TAB_CONTENT_CLASS)
          );
        });
      }
    }
    static handlePanelTab(tabSelector, tabContent) {
      const activeTab = findByPartialClass(tabSelector, CHAT_SELECTORS.PEOPLE_PANEL_TAB_ACTIVE_CLASS).textContent.toLowerCase();
      if (activeTab !== "chats") {
        ScriptEventHandler.onPeopleListLoad(tabContent);
      }
    }
    static onUnreadCountChange() {
      AccessibilityFeature.describePeople();
      AccessibilityFeature.describeUnreadChats();
    }
  }
  class StylingFeature {
    static includeStyle(styleRules) {
      if (typeof _GM_addStyle !== "undefined") {
        _GM_addStyle(styleRules);
      } else {
        const styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.innerHTML = styleRules;
        document.head.appendChild(styleElement);
      }
    }
    static defaultStyles() {
      StylingFeature.includeStyle(`
            #better-chat-settings-icon {
                align-self: center;
            }

            #better-chat-settings-icon button {
                color: #f7f7f7;
            }

            .better-chat-settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.5);
                bottom: 0;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .better-chat-settings-popup {
                width: 300px;
                min-height: 300px;
                padding: 4px;
                overflow: auto;
                max-height: 100vh;
            }
            
            body:not(.dark-mode) .better-chat-settings-popup {
                background-color: #f7f7f7;
            }
            
            body.dark-mode .better-chat-settings-popup {
                background-color: #414141;
            }

            .better-chat-settings-title-wrapper {
                display: flex;
                justify-content: space-between;
            }

            .better-chat-settings-title {
                display: block;
                font-size: 1.25em;
                font-weight: bold;
                margin-bottom: 2px;
            }

            .better-chat-settings-close-popup {
                padding-inline: 5px;
            }

            .better-chat-settings-description {
                display: block;
                font-size: 0.9em;
                margin-bottom: 2px;
            }

            .better-chat-settings-subtitle {
                display: block;
                font-weight: bold;
                margin-bottom: 2px;
            }

            .better-chat-settings-subtitle:not(:first-child) {
                margin-top: 4px;
            }

            .better-chat-settings-popup > section {
                display: flex;
                align-items: center;
                gap: 2px;
                margin-bottom: 1px;
            }

            .better-chat-settings-popup button {
                cursor: pointer;
            }

            body.dark-mode .better-chat-settings-popup button {
                color: #ddd;
            }

            .better-chat-settings-highlight-entry {
                display: flex;
                gap: 4px;
            }
            
            [class*='${CHAT_SELECTORS.SETTINGS_PANEL_HEADER_CLASS}'] {
                justify-content: initial;
            }
            
            [class*='${CHAT_SELECTORS.SETTINGS_PANEL_HEADER_TITLE_CLASS}'] {
                flex-grow: 1;
            }
        `);
    }
    static improveStyles() {
      StylingFeature.includeStyle(`
            [class*='${CHAT_SELECTORS.MESSAGE_BODY_CLASS}'] {
                cursor: initial !important;
            }
        `);
    }
    static hideAvatars() {
      if (settings.messages.hideAvatars) {
        StylingFeature.includeStyle(`
                [class*='${CHAT_SELECTORS.MESSAGE_AVATAR_CLASS}'] {
                    display: none;
                }
            `);
      }
      if (settings.box.hideAvatars) {
        StylingFeature.includeStyle(`
                [class*='${CHAT_SELECTORS.CHAT_HEADER_AVATAR_CLASS}'] [class*='${CHAT_SELECTORS.AVATAR_WRAPPER_CLASS}'] > img,
                [class*='${CHAT_SELECTORS.MESSAGE_MINIMIZED_BOX_AVATAR_CLASS}'] [class*='${CHAT_SELECTORS.AVATAR_WRAPPER_CLASS}'] > img {
                    display: none;
                }
            `);
      }
    }
    static compact() {
      if (!settings.messages.compact)
        return;
      StylingFeature.includeStyle(`
            [class*='${CHAT_SELECTORS.MESSAGE_BODY_WRAPPER_CLASS}'] {
                margin-bottom: 0px !important;
            }

            [class*='${CHAT_SELECTORS.CHAT_BODY_CLASS}'] > div:last-child {
                margin-bottom: 8px !important;
            }
        `);
    }
    static groupRight() {
      if (!settings.box.groupRight)
        return;
      StylingFeature.includeStyle(`
            [class*='${CHAT_SELECTORS.CHAT_WRAPPER_WRAPPER_CLASS}'] {
                gap: 3px;
            }

            [class*='${CHAT_SELECTORS.CHAT_WRAPPER_CLASS}'] {
                margin-right: 0 !important;
            }
        `);
    }
    static leftAlignedText() {
      if (!settings.messages.leftAlignedText)
        return;
      StylingFeature.includeStyle(`
            [class*='${CHAT_SELECTORS.MESSAGE_SENDER_CLASS}'] {
                display: unset !important;
                font-weight: 700;
            }

            [class*='${CHAT_SELECTORS.MESSAGE_BODY_CLASS}'] [class*='${CHAT_SELECTORS.MESSAGE_SENDER_CLASS}'] {
                margin-right: 4px;
            }

            [class*='${CHAT_SELECTORS.MESSAGE_BODY_CLASS}'],
            [class*='${CHAT_SELECTORS.MESSAGE_BODY_SELF_CLASS}'] {
                background: none !important;
                border-radius: none !important;
                color: initial !important;
                padding: 0 !important;
            }

            [class*='${CHAT_SELECTORS.MESSAGE_BODY_WRAPPER_SELF_CLASS}'] {
                justify-content: normal !important;
            }

            [class*='${CHAT_SELECTORS.MESSAGE_CONTENT_WRAPPER_CLASS}'] {
                color: var(--chat-text-color) !important;
            }
        `);
    }
    static fontSize() {
      if (!settings.messages.fontSize.enabled)
        return;
      const { size } = settings.messages.fontSize;
      StylingFeature.includeStyle(`
            [class*='${CHAT_SELECTORS.MESSAGE_CONTENT_WRAPPER_CLASS}'],
            [class*='${CHAT_SELECTORS.MESSAGE_SENDER_CLASS}'] {
                font-size: ${size}px !important;
            }
            
            #${CHAT_SELECTORS.CHAT_ROOT_ID} {
                --torntools-chat-font-size: ${size}px;
            }
        `);
    }
    static mobileGroups() {
      if (!settings.box.mobileGroups)
        return;
      StylingFeature.includeStyle(`
            [class*='${CHAT_SELECTORS.GROUP_MENU_MOBILE_CLASS}'] {
                display: none !important;
            }
            
            [class*='${CHAT_SELECTORS.GROUP_MENU_DESKTOP_CLASS}'] {
                display: flex !important;
            }
        `);
    }
  }
  class AccessibilityFeature {
    static describeChatButtons(chat) {
      if (!settings.accessibility.describeButtons)
        return;
      findAll(chat, "button:not(.better-chat-described), *[role='button'][tabindex]").forEach((button) => AccessibilityFeature.describeChatButton(button));
    }
    static describeChatButton(button) {
      let description;
      const svg = button.querySelector("svg");
      if (svg) {
        const className = svg.getAttribute("class") || "";
        if (className.includes(CHAT_SELECTORS.CHAT_HEADER_MINIMIZE_ICON_CLASS)) {
          description = "Minimize this chat";
        } else if (className.includes(CHAT_SELECTORS.CHAT_HEADER_CLOSE_ICON_CLASS)) {
          description = "Close this chat";
        }
      }
      if (!description) {
        const className = button.getAttribute("class");
        if (className.includes(CHAT_SELECTORS.CHAT_HEADER_CLASS)) {
          description = false;
        } else if (className.includes(CHAT_SELECTORS.MESSAGE_SEND_BUTTON_CLASS)) {
          description = "Send your message";
        } else if (className.includes(CHAT_SELECTORS.CHAT_HEADER_INFO_BUTTON_CLASS)) {
          description = "Open possible actions";
        } else if (className.includes(CHAT_SELECTORS.CHAT_HEADER_INFO_CLASS)) {
          description = false;
        }
      }
      if (description)
        button.ariaLabel = description;
      else if (description === false)
        ;
      else
        console.warn("[Better Chat] Failed to describe this button.", button);
      button.classList.add("better-chat-described");
    }
    static appPanelAccessibility(panel) {
      findAllByPartialClass(panel, CHAT_SELECTORS.PEOPLE_PANEL_HEADER_BUTTON).forEach((button) => AccessibilityFeature.describeAppPanelButton(button));
    }
    static describeAppPanelButton(button) {
      let description;
      if (button.querySelector(`#${CHAT_SELECTORS.PEOPLE_PANEL_SETTINGS_BUTTON_ID}`)) {
        description = "Open chat settings";
      } else if (button.querySelector(`#${CHAT_SELECTORS.PEOPLE_PANEL_CLOSE_BUTTON_ID}`)) {
        description = "Close chat settings";
      } else
        console.warn("[Better Chat] Failed to describe this app panel button.", button);
      button.ariaLabel = description ?? null;
    }
    static describeMessageButtons(message, senderName) {
      if (!settings.accessibility.describeButtons)
        return;
      const senderElement = findByPartialClass(message, CHAT_SELECTORS.MESSAGE_SENDER_CLASS);
      if (settings.accessibility.presentationSender)
        ;
      else if (settings.accessibility.describeButtons) {
        senderElement.ariaLabel = `Open ${senderName}'s profile`;
      }
    }
    static describeRootPanels() {
      if (!settings.accessibility.describeButtons)
        return;
      findByPartialClassDelayed(document, CHAT_SELECTORS.CHAT_LIST_NOTEPAD_CLASS).then((notepadElement) => notepadElement.ariaLabel = "Open your notepad").catch((reason) => console.warn("[Better Chat] Failed to describe the notepad button.", reason));
      findByPartialClassDelayed(document, CHAT_SELECTORS.CHAT_LIST_SETTINGS_CLASS).then((settingsElement) => settingsElement.ariaLabel = "Open the chat settings").catch((reason) => console.warn("[Better Chat] Failed to describe the settings button.", reason));
      const mobileMenuElement = findByPartialClass(document, CHAT_SELECTORS.GROUP_MENU_MOBILE_CLASS);
      const mobileButtonElements = findAllByPartialClass(mobileMenuElement, CHAT_SELECTORS.GROUP_MENU_MOBILE_BUTTON_CLASS);
      mobileButtonElements.forEach((button, index) => {
        let description;
        if (index === 0) {
          description = "Faction chat";
        } else if (index === 1) {
          description = "Grouped chats";
        } else
          return;
        button.ariaLabel = description;
      });
    }
    static describePeople() {
      var _a;
      if (!settings.accessibility.describeButtons)
        return;
      const peopleElement = findByPartialClass(document, CHAT_SELECTORS.CHAT_LIST_PEOPLE_CLASS);
      const unreadMessages = parseInt(((_a = findByPartialClass(peopleElement, CHAT_SELECTORS.CHAT_MESSAGE_COUNT_CLASS)) == null ? void 0 : _a.textContent) || "0", 10);
      peopleElement.ariaLabel = `List all people | ${pluralize("unread message", unreadMessages)}`;
    }
    static describeUnreadChats() {
      if (!settings.accessibility.describeButtons)
        return;
      findAllByPartialClass(document, CHAT_SELECTORS.CHAT_LIST_GROUP_CHAT_CLASS).forEach((group) => {
        var _a;
        const unreadMessages = parseInt(((_a = findByPartialClass(group, CHAT_SELECTORS.CHAT_MESSAGE_COUNT_CLASS)) == null ? void 0 : _a.textContent) || "0", 10);
        const chatName = group.dataset.name || group.getAttribute("title") || "oops broken, please report";
        if (!group.dataset.name)
          group.dataset.name = chatName;
        if (unreadMessages > 0) {
          group.ariaLabel = `${chatName} | ${pluralize("unread message", unreadMessages)}`;
          group.removeAttribute("title");
        } else {
          group.ariaLabel = null;
          group.setAttribute("title", chatName);
        }
      });
    }
  }
  const _ChatGroupFeature = class _ChatGroupFeature {
    static moveGroupRight(chat) {
      if (!settings.box.groupRight)
        return;
      const avatarElement = findByPartialClass(chat, CHAT_SELECTORS.CHAT_HEADER_AVATAR_CLASS, "> *");
      const isGroup = avatarElement.tagName.toLowerCase() === "svg";
      if (isGroup) {
        chat.style.order = "1";
      }
    }
    static nameAutocompletion(chat) {
      if (!settings.box.nameAutocomplete)
        return;
      const avatarElement = findByPartialClass(chat, CHAT_SELECTORS.CHAT_HEADER_AVATAR_CLASS, "> *");
      const isGroup = avatarElement.tagName.toLowerCase() === "svg";
      if (!isGroup)
        return;
      const textarea = chat.querySelector("textarea");
      textarea.addEventListener("keydown", (event) => {
        if (event.code !== "Tab") {
          _ChatGroupFeature.currentUsername = null;
          _ChatGroupFeature.currentSearchValue = null;
          return;
        }
        event.preventDefault();
        const valueBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
        const searchValueMatch = valueBeforeCursor.match(/([^\w-]?)([\w-]*)$/);
        if (_ChatGroupFeature.currentSearchValue === null)
          _ChatGroupFeature.currentSearchValue = searchValueMatch[2].toLowerCase();
        const matchedUsernames = findAllByPartialClass(chat, CHAT_SELECTORS.MESSAGE_BODY_CLASS, "button a").map((message) => message.textContent.substring(0, message.textContent.length - 1)).filter(
          (username, index2, array) => array.indexOf(username) === index2 && username.toLowerCase().startsWith(_ChatGroupFeature.currentSearchValue || "")
        ).sort();
        if (!matchedUsernames.length)
          return;
        let index = _ChatGroupFeature.currentUsername !== null ? matchedUsernames.indexOf(_ChatGroupFeature.currentUsername) + 1 : 0;
        if (index > matchedUsernames.length - 1)
          index = 0;
        _ChatGroupFeature.currentUsername = matchedUsernames[index];
        const valueStart = (searchValueMatch.index || 0) + searchValueMatch[1].length;
        textarea.value = textarea.value.substring(0, valueStart) + _ChatGroupFeature.currentUsername + textarea.value.substring(valueBeforeCursor.length, textarea.value.length);
        const selectionIndex = valueStart + _ChatGroupFeature.currentUsername.length;
        textarea.setSelectionRange(selectionIndex, selectionIndex);
      });
    }
  };
  __publicField(_ChatGroupFeature, "currentUsername", null);
  __publicField(_ChatGroupFeature, "currentSearchValue", null);
  let ChatGroupFeature = _ChatGroupFeature;
  class MessageFeature {
    static highlightMessages(message, senderName) {
      if (!settings.messages.highlight.length)
        return;
      const highlights = MessageFeature.buildHighlights();
      MessageFeature.nameHighlight(message, highlights, senderName);
      MessageFeature.messageHighlight(message, highlights);
    }
    static buildHighlights() {
      return settings.messages.highlight.map(({ search, color }) => ({
        search: search.replaceAll("%player%", getCurrentPlayerName()),
        color: convertColor(color)
      }));
    }
    static nameHighlight(message, highlights, senderName) {
      const nameHighlight = highlights.find(({ search }) => senderName.toLowerCase() === search.toLowerCase());
      if (!nameHighlight)
        return;
      const senderElement = findByPartialClass(message, CHAT_SELECTORS.MESSAGE_SENDER_CLASS);
      senderElement.setAttribute("style", `background-color: ${nameHighlight.color} !important;`);
    }
    static messageHighlight(message, highlights) {
      const messageElement = findByPartialClass(message, CHAT_SELECTORS.MESSAGE_CONTENT_WRAPPER_CLASS);
      const messageHighlight = highlights.find(({ search }) => messageElement.textContent.toLowerCase().includes(search.toLowerCase()));
      if (!messageHighlight)
        return;
      const wrapperElement = findByPartialClass(message, CHAT_SELECTORS.MESSAGE_BODY_WRAPPER_CLASS);
      wrapperElement.setAttribute("style", `background-color: ${messageHighlight.color} !important;`);
    }
  }
  class PeopleStatusFeature {
    static sortOnStatus(list) {
      if (!settings.people.sortOnStatus)
        return;
      list.querySelectorAll(`:scope > [class*='${CHAT_SELECTORS.PEOPLE_PANEL_MEMBER_CARD_CLASS}']`).forEach((card) => {
        let order;
        if (findByPartialClass(card, CHAT_SELECTORS.PEOPLE_PANEL_STATUS_ONLINE_CLASS)) {
          order = "0";
        } else if (findByPartialClass(card, CHAT_SELECTORS.PEOPLE_PANEL_STATUS_IDLE_CLASS)) {
          order = "1";
        } else if (findByPartialClass(card, CHAT_SELECTORS.PEOPLE_PANEL_STATUS_OFFLINE_CLASS)) {
          order = "2";
        } else
          return;
        card.style.order = order;
      });
    }
  }
  (() => ScriptEventHandler.onLoad())();

})();