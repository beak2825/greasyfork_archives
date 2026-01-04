// ==UserScript==
// @name               Password Revealer
// @name:zh-CN         密码显示助手
// @name:zh-TW         密碼顯示助手
// @description        Password Field Content Via - Reveal On Focus / Preview On Hover / Toggle On Double-Click / Always Visible | Switch Display Mode Via Menu Or Shortcut (Meta/Ctrl+Alt+P)
// @description:zh-CN  密码输入框内容可聚焦即显 / 悬浮即览 / 双击切换 / 始终可见 | 通过菜单或快捷键（Meta/Ctrl+Alt+P）切换显示模式
// @description:zh-TW  密碼輸入框內容可聚焦即顯 / 懸停即覽 / 雙擊切換 / 始終可見 | 透過選單或快速鍵（Meta/Ctrl+Alt+P）切換顯示模式
// @version            1.5.0
// @icon               https://raw.githubusercontent.com/MiPoNianYou/UserScripts/main/Icons/Password-Revealer-Icon.svg
// @author             念柚
// @namespace          https://github.com/MiPoNianYou/UserScripts
// @supportURL         https://github.com/MiPoNianYou/UserScripts/issues
// @license            GPL-3.0
// @match              *://*/*
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_addStyle
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/532524/%E5%AF%86%E7%A0%81%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532524/%E5%AF%86%E7%A0%81%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const Config = {
    SCRIPT_SETTINGS: {
      UI_FONT_STACK: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      ANIMATION_DURATION_MS: 300,
      NOTIFICATION_VISIBILITY_DURATION_MS: 2000,
    },
    MODES: {
      FOCUS: "Focus",
      HOVER: "Hover",
      DBLCLICK: "DoubleClick",
      ALWAYS_SHOW: "AlwaysShow",
    },
    get VALID_MODES() {
      return [
        this.MODES.FOCUS,
        this.MODES.HOVER,
        this.MODES.DBLCLICK,
        this.MODES.ALWAYS_SHOW,
      ];
    },
    ELEMENT_IDS: {
      MODE_NOTIFICATION: "PasswordRevealerModeNotification",
    },
    CSS_CLASSES: {
      MODE_NOTIFICATION_VISIBLE: "pr-mode-notification--visible",
      BREATHING_DOT: "pr-breathing-dot",
      MODE_NOTIFICATION_MESSAGE: "pr-mode-notification-message",
    },
    ATTRIBUTES: {
      PROCESSED: "data-password-revealer-processed",
    },
    UI_TEXTS: {
      "zh-CN": {
        SCRIPT_TITLE: "密码显示助手",
        MENU_CMD_FOCUS: "「聚焦即显」模式",
        MENU_CMD_HOVER: "「悬浮即览」模式",
        MENU_CMD_DBLCLICK: "「双击切换」模式",
        MENU_CMD_ALWAYS_SHOW: "「始终可见」模式",
        ALERT_MSG_FOCUS: "模式已切换为「聚焦即显」",
        ALERT_MSG_HOVER: "模式已切换为「悬浮即览」",
        ALERT_MSG_DBLCLICK: "模式已切换为「双击切换」",
        ALERT_MSG_ALWAYS_SHOW: "模式已切换为「始终可见」",
      },
      "zh-TW": {
        SCRIPT_TITLE: "密碼顯示助手",
        MENU_CMD_FOCUS: "「聚焦即顯」模式",
        MENU_CMD_HOVER: "「懸停即覽」模式",
        MENU_CMD_DBLCLICK: "「雙擊切換」模式",
        MENU_CMD_ALWAYS_SHOW: "「始終可見」模式",
        ALERT_MSG_FOCUS: "模式已切換為「聚焦即顯」",
        ALERT_MSG_HOVER: "模式已切換為「懸停即覽」",
        ALERT_MSG_DBLCLICK: "模式已切換為「雙擊切換」",
        ALERT_MSG_ALWAYS_SHOW: "模式已切換為「始終可見」",
      },
      "en-US": {
        SCRIPT_TITLE: "Password Revealer",
        MENU_CMD_FOCUS: "「Reveal On Focus」Mode",
        MENU_CMD_HOVER: "「Preview On Hover」Mode",
        MENU_CMD_DBLCLICK: "「Toggle On Double-Click」Mode",
        MENU_CMD_ALWAYS_SHOW: "「Always Visible」Mode",
        ALERT_MSG_FOCUS: "Mode Switched To 「Reveal On Focus」",
        ALERT_MSG_HOVER: "Mode Switched To 「Preview On Hover」",
        ALERT_MSG_DBLCLICK: "Mode Switched To 「Toggle On Double-Click」",
        ALERT_MSG_ALWAYS_SHOW: "Mode Switched To 「Always Visible」",
      },
    },
    MODE_TO_MENU_TEXT_KEY_MAP: {
      ["Focus"]: "MENU_CMD_FOCUS",
      ["Hover"]: "MENU_CMD_HOVER",
      ["DoubleClick"]: "MENU_CMD_DBLCLICK",
      ["AlwaysShow"]: "MENU_CMD_ALWAYS_SHOW",
    },
    STORAGE_KEYS: {
      MODE_KEY: "PasswordDisplayMode",
    },
    MODE_TO_ALERT_MESSAGE_KEY_MAP: {
      ["Focus"]: "ALERT_MSG_FOCUS",
      ["Hover"]: "ALERT_MSG_HOVER",
      ["DoubleClick"]: "ALERT_MSG_DBLCLICK",
      ["AlwaysShow"]: "ALERT_MSG_ALWAYS_SHOW",
    },
  };

  const State = {
    currentMode: Config.MODES.FOCUS,
    currentLocale: "en-US",
    localizedStrings: Config.UI_TEXTS["en-US"],

    loadAndSetInitialState() {
      this.currentLocale = this.detectUserLanguage();
      this.localizedStrings =
        Config.UI_TEXTS[this.currentLocale] || Config.UI_TEXTS["en-US"];
      this.loadDisplayMode();
    },

    detectUserLanguage() {
      const languages = navigator.languages || [navigator.language];
      for (const lang of languages) {
        const langLower = lang.toLowerCase();
        if (langLower === "zh-cn") return "zh-CN";
        if (
          langLower === "zh-tw" ||
          langLower === "zh-hk" ||
          langLower === "zh-mo" ||
          langLower === "zh-hant"
        )
          return "zh-TW";
        if (langLower === "en-us") return "en-US";
        if (langLower.startsWith("zh-")) return "zh-CN";
        if (langLower.startsWith("en-")) return "en-US";
      }
      for (const lang of languages) {
        const langLower = lang.toLowerCase();
        if (langLower.startsWith("zh")) return "zh-CN";
        if (langLower.startsWith("en")) return "en-US";
      }
      return "en-US";
    },

    getLocalizedString(key, fallbackLang = "en-US") {
      const primaryLangData =
        this.localizedStrings || Config.UI_TEXTS[fallbackLang];
      const fallbackLangData = Config.UI_TEXTS[fallbackLang];
      return primaryLangData[key] ?? fallbackLangData[key] ?? `${key}?`;
    },

    loadDisplayMode() {
      let storedValue;
      try {
        storedValue = GM_getValue(
          Config.STORAGE_KEYS.MODE_KEY,
          Config.MODES.FOCUS
        );
      } catch (e) {
        storedValue = Config.MODES.FOCUS;
      }
      if (!Config.VALID_MODES.includes(storedValue)) {
        storedValue = Config.MODES.FOCUS;
      }
      this.currentMode = storedValue;
    },

    saveDisplayMode() {
      try {
        GM_setValue(Config.STORAGE_KEYS.MODE_KEY, this.currentMode);
      } catch (e) {}
    },

    setMode(newMode) {
      if (
        this.currentMode === newMode ||
        !Config.VALID_MODES.includes(newMode)
      ) {
        return false;
      }
      this.currentMode = newMode;
      this.saveDisplayMode();
      return true;
    },
  };

  const UserInterface = {
    notificationTimer: null,
    notificationRemovalTimer: null,
    registeredMenuCommandIds: [],

    injectCoreStyles() {
      const easeOutQuint = "cubic-bezier(0.23, 1, 0.32, 1)";
      const animationDuration = Config.SCRIPT_SETTINGS.ANIMATION_DURATION_MS;

      const baseCSS = `
          :root {
            --ctp-frappe-rosewater: rgb(242, 213, 207);
            --ctp-frappe-flamingo: rgb(238, 190, 190);
            --ctp-frappe-pink: rgb(244, 184, 228);
            --ctp-frappe-mauve: rgb(202, 158, 230);
            --ctp-frappe-red: rgb(231, 130, 132);
            --ctp-frappe-maroon: rgb(234, 153, 156);
            --ctp-frappe-peach: rgb(239, 159, 118);
            --ctp-frappe-yellow: rgb(229, 200, 144);
            --ctp-frappe-green: rgb(166, 209, 137);
            --ctp-frappe-teal: rgb(129, 200, 190);
            --ctp-frappe-sky: rgb(153, 209, 219);
            --ctp-frappe-sapphire: rgb(133, 193, 220);
            --ctp-frappe-blue: rgb(140, 170, 238);
            --ctp-frappe-lavender: rgb(186, 187, 241);
            --ctp-frappe-text: rgb(198, 208, 245);
            --ctp-frappe-subtext1: rgb(181, 191, 226);
            --ctp-frappe-subtext0: rgb(165, 173, 206);
            --ctp-frappe-overlay2: rgb(148, 156, 187);
            --ctp-frappe-overlay1: rgb(131, 139, 167);
            --ctp-frappe-overlay0: rgb(115, 121, 148);
            --ctp-frappe-surface2: rgb(98, 104, 128);
            --ctp-frappe-surface1: rgb(81, 87, 109);
            --ctp-frappe-surface0: rgb(65, 69, 89);
            --ctp-frappe-base: rgb(48, 52, 70);
            --ctp-frappe-mantle: rgb(41, 44, 60);
            --ctp-frappe-crust: rgb(35, 38, 52);

            --ctp-latte-rosewater: rgb(220, 138, 120);
            --ctp-latte-flamingo: rgb(221, 120, 120);
            --ctp-latte-pink: rgb(234, 118, 203);
            --ctp-latte-mauve: rgb(136, 57, 239);
            --ctp-latte-red: rgb(210, 15, 57);
            --ctp-latte-maroon: rgb(230, 69, 83);
            --ctp-latte-peach: rgb(254, 100, 11);
            --ctp-latte-yellow: rgb(223, 142, 29);
            --ctp-latte-green: rgb(64, 160, 43);
            --ctp-latte-teal: rgb(23, 146, 153);
            --ctp-latte-sky: rgb(4, 165, 229);
            --ctp-latte-sapphire: rgb(32, 159, 181);
            --ctp-latte-blue: rgb(30, 102, 245);
            --ctp-latte-lavender: rgb(114, 135, 253);
            --ctp-latte-text: rgb(76, 79, 105);
            --ctp-latte-subtext1: rgb(92, 95, 119);
            --ctp-latte-subtext0: rgb(108, 111, 133);
            --ctp-latte-overlay2: rgb(124, 127, 147);
            --ctp-latte-overlay1: rgb(140, 143, 161);
            --ctp-latte-overlay0: rgb(156, 160, 176);
            --ctp-latte-surface2: rgb(172, 176, 190);
            --ctp-latte-surface1: rgb(188, 192, 204);
            --ctp-latte-surface0: rgb(204, 208, 218);
            --ctp-latte-base: rgb(239, 241, 245);
            --ctp-latte-mantle: rgb(230, 233, 239);
            --ctp-latte-crust: rgb(220, 224, 232);

            --pr-notify-bg-dark: rgb(from var(--ctp-frappe-base) r g b / 0.85);
            --pr-notify-text-dark: var(--ctp-frappe-text);
            --pr-notify-border-dark: rgb(from var(--ctp-frappe-surface2) r g b / 0.25);
            --pr-notify-dot-color-dark: var(--ctp-frappe-green); /* Renamed from --ctp-frappe-green for clarity */
            --pr-notify-dot-glow-dark: rgb(from var(--ctp-frappe-green) r g b / 0.35); /* Glow for dot */


            --pr-notify-bg-light: rgb(from var(--ctp-latte-base) r g b / 0.85);
            --pr-notify-text-light: var(--ctp-latte-text);
            --pr-notify-border-light: rgb(from var(--ctp-latte-surface2) r g b / 0.25);
            --pr-notify-dot-color-light: var(--ctp-latte-green); /* Renamed from --ctp-latte-green for clarity */
            --pr-notify-dot-glow-light: rgb(from var(--ctp-latte-green) r g b / 0.35); /* Glow for dot */

            --pr-shadow-dark:
              0 1px 2px rgba(0, 0, 0, 0.1),
              0 6px 12px rgba(0, 0, 0, 0.2);
            --pr-shadow-light:
              0 1px 2px rgba(90, 90, 90, 0.06),
              0 6px 12px rgba(90, 90, 90, 0.12);
          }

          @keyframes pr-breathing-animation {
            0%, 100% {
              transform: scale(0.85);
              opacity: 0.7;
            }
            50% {
              transform: scale(1);
              opacity: 1;
            }
          }

          #${Config.ELEMENT_IDS.MODE_NOTIFICATION} {
            position: fixed;
            bottom: 20px;
            left: 50%;
            z-index: 2147483646;
            display: flex;
            align-items: center;
            padding: 10px 16px;
            border: 1px solid var(--pr-notify-border-dark);
            border-radius: 20px;
            background-color: var(--pr-notify-bg-dark);
            color: var(--pr-notify-text-dark);
            box-shadow: var(--pr-shadow-dark);
            box-sizing: border-box;
            opacity: 0;
            font-family: ${Config.SCRIPT_SETTINGS.UI_FONT_STACK};
            text-align: left;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            transform: translate(-50%, calc(100% + 40px));
            transition: transform ${animationDuration}ms ${easeOutQuint},
                        opacity ${animationDuration * 0.8}ms ${easeOutQuint};
          }

          #${Config.ELEMENT_IDS.MODE_NOTIFICATION}.${
        Config.CSS_CLASSES.MODE_NOTIFICATION_VISIBLE
      } {
            transform: translate(-50%, 0);
            opacity: 1;
          }

          #${Config.ELEMENT_IDS.MODE_NOTIFICATION} .${
        Config.CSS_CLASSES.BREATHING_DOT
      } {
            width: 8px;
            height: 8px;
            margin-right: 10px;
            border-radius: 50%;
            background-color: var(--pr-notify-dot-color-dark);
            box-shadow: 0 0 8px 3px var(--pr-notify-dot-glow-dark); /* Added glow */
            flex-shrink: 0;
            animation: pr-breathing-animation 2000ms ease-in-out infinite;
            /* No transition needed here as dot color doesn't change based on state for PR */
          }

          #${Config.ELEMENT_IDS.MODE_NOTIFICATION} .${
        Config.CSS_CLASSES.MODE_NOTIFICATION_MESSAGE
      } {
            color: var(--pr-notify-text-dark);
            font-size: 13px;
            font-weight: 500;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          @media (prefers-color-scheme: light) {
            #${Config.ELEMENT_IDS.MODE_NOTIFICATION} {
              border: 1px solid var(--pr-notify-border-light);
              background-color: var(--pr-notify-bg-light);
              color: var(--pr-notify-text-light);
              box-shadow: var(--pr-shadow-light);
            }
            #${Config.ELEMENT_IDS.MODE_NOTIFICATION} .${
        Config.CSS_CLASSES.BREATHING_DOT
      } {
               background-color: var(--pr-notify-dot-color-light);
               box-shadow: 0 0 8px 3px var(--pr-notify-dot-glow-light); /* Added glow for light mode */
            }
            #${Config.ELEMENT_IDS.MODE_NOTIFICATION} .${
        Config.CSS_CLASSES.MODE_NOTIFICATION_MESSAGE
      } {
              color: var(--pr-notify-text-light);
            }
          }
        `;
      try {
        GM_addStyle(baseCSS);
      } catch (e) {}
    },

    displayModeNotification(messageKey) {
      if (this.notificationTimer) clearTimeout(this.notificationTimer);
      if (this.notificationRemovalTimer)
        clearTimeout(this.notificationRemovalTimer);
      this.notificationTimer = null;
      this.notificationRemovalTimer = null;

      const message = State.getLocalizedString(messageKey) || messageKey;

      const renderNotification = () => {
        let notificationElement = document.getElementById(
          Config.ELEMENT_IDS.MODE_NOTIFICATION
        );
        if (!notificationElement && document.body) {
          notificationElement = document.createElement("div");
          notificationElement.id = Config.ELEMENT_IDS.MODE_NOTIFICATION;
          notificationElement.innerHTML = `
            <div class="${Config.CSS_CLASSES.BREATHING_DOT}"></div>
            <div class="${Config.CSS_CLASSES.MODE_NOTIFICATION_MESSAGE}"></div>
          `.trim();
          document.body.appendChild(notificationElement);
        } else if (!notificationElement) {
          return;
        }

        const messageElement = notificationElement.querySelector(
          `.${Config.CSS_CLASSES.MODE_NOTIFICATION_MESSAGE}`
        );

        if (messageElement) messageElement.textContent = message;

        // PR script's dot color does not change based on a disabled class,
        // so no need to add/remove a .disabled class here for the dot.
        // The glow is always based on the primary dot color (green).

        notificationElement.classList.remove(
          Config.CSS_CLASSES.MODE_NOTIFICATION_VISIBLE
        );
        void notificationElement.offsetWidth;

        requestAnimationFrame(() => {
          const currentElement = document.getElementById(
            Config.ELEMENT_IDS.MODE_NOTIFICATION
          );
          if (currentElement) {
            currentElement.classList.add(
              Config.CSS_CLASSES.MODE_NOTIFICATION_VISIBLE
            );
          }
        });

        this.notificationTimer = setTimeout(() => {
          const currentElement = document.getElementById(
            Config.ELEMENT_IDS.MODE_NOTIFICATION
          );
          if (currentElement) {
            currentElement.classList.remove(
              Config.CSS_CLASSES.MODE_NOTIFICATION_VISIBLE
            );
            this.notificationRemovalTimer = setTimeout(() => {
              document
                .getElementById(Config.ELEMENT_IDS.MODE_NOTIFICATION)
                ?.remove();
              this.notificationTimer = null;
              this.notificationRemovalTimer = null;
            }, Config.SCRIPT_SETTINGS.ANIMATION_DURATION_MS);
          } else {
            this.notificationTimer = null;
            this.notificationRemovalTimer = null;
          }
        }, Config.SCRIPT_SETTINGS.NOTIFICATION_VISIBILITY_DURATION_MS);
      };
      renderNotification();
    },

    updateUserScriptMenuCommands() {
      this.registeredMenuCommandIds.forEach((id) => {
        try {
          GM_unregisterMenuCommand(id);
        } catch (e) {}
      });
      this.registeredMenuCommandIds = [];

      Config.VALID_MODES.forEach((mode) => {
        const menuKey = Config.MODE_TO_MENU_TEXT_KEY_MAP[mode];
        const baseText = State.getLocalizedString(menuKey);
        const commandText =
          baseText + (mode === State.currentMode ? " ✅" : "");

        try {
          const commandId = GM_registerMenuCommand(commandText, () =>
            ScriptManager.setModeAndUpdate(mode)
          );
          this.registeredMenuCommandIds.push(commandId);
        } catch (e) {}
      });
    },
  };

  const InputManager = {
    processPasswordInput(input, mode) {
      if (
        !(input instanceof HTMLInputElement) ||
        input.type === "hidden" ||
        input.getAttribute(Config.ATTRIBUTES.PROCESSED) === mode
      ) {
        return;
      }

      if (mode === Config.MODES.ALWAYS_SHOW) {
        input.type = "text";
      } else {
        if (input.type !== "password") {
          input.type = "password";
        }
      }
      input.setAttribute(Config.ATTRIBUTES.PROCESSED, mode);
    },

    findAndProcessNewInputs(rootNode, mode) {
      if (!rootNode || typeof rootNode.querySelectorAll !== "function") return;
      try {
        const query = `input[type="password"]:not([${Config.ATTRIBUTES.PROCESSED}="${mode}"]), input[${Config.ATTRIBUTES.PROCESSED}]:not([${Config.ATTRIBUTES.PROCESSED}="${mode}"])`;
        rootNode.querySelectorAll(query).forEach((input) => {
          this.processPasswordInput(input, mode);
        });

        const elementsToCheckForShadow =
          rootNode === document ||
          rootNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
            ? rootNode.querySelectorAll("*")
            : [rootNode];

        elementsToCheckForShadow.forEach((el) => {
          if (
            el.shadowRoot &&
            typeof el.shadowRoot.querySelectorAll === "function"
          ) {
            this.findAndProcessNewInputs(el.shadowRoot, mode);
          }
        });
      } catch (e) {}
    },

    applyCurrentModeToAllInputs() {
      try {
        this.findAndProcessNewInputs(document, State.currentMode);
        document.querySelectorAll("*").forEach((el) => {
          if (el.shadowRoot) {
            this.findAndProcessNewInputs(el.shadowRoot, State.currentMode);
          }
        });
      } catch (e) {}
    },
  };

  const EventManager = {
    domMutationObserver: null,

    handleShowPasswordOnHover(event) {
      const input = event.target;
      if (
        State.currentMode === Config.MODES.HOVER &&
        input instanceof HTMLInputElement &&
        input.matches(
          `input[type="password"][${Config.ATTRIBUTES.PROCESSED}="${Config.MODES.HOVER}"]`
        )
      ) {
        input.type = "text";
      }
    },

    handleHidePasswordOnLeave(event) {
      const input = event.target;
      if (
        State.currentMode === Config.MODES.HOVER &&
        input instanceof HTMLInputElement &&
        input.matches(
          `input[type="text"][${Config.ATTRIBUTES.PROCESSED}="${Config.MODES.HOVER}"]`
        )
      ) {
        input.type = "password";
      }
    },

    handleTogglePasswordOnDoubleClick(event) {
      const input = event.target;
      if (
        State.currentMode === Config.MODES.DBLCLICK &&
        input instanceof HTMLInputElement &&
        input.matches(
          `input[${Config.ATTRIBUTES.PROCESSED}="${Config.MODES.DBLCLICK}"]`
        )
      ) {
        input.type = input.type === "password" ? "text" : "password";
      }
    },

    handleFocusIn(event) {
      const input = event.target;
      if (
        State.currentMode === Config.MODES.FOCUS &&
        input instanceof HTMLInputElement &&
        input.matches(
          `input[type="password"][${Config.ATTRIBUTES.PROCESSED}="${Config.MODES.FOCUS}"]`
        )
      ) {
        input.type = "text";
      }
    },

    handleFocusOut(event) {
      const input = event.target;
      if (
        State.currentMode === Config.MODES.FOCUS &&
        input instanceof HTMLInputElement &&
        input.matches(
          `input[type="text"][${Config.ATTRIBUTES.PROCESSED}="${Config.MODES.FOCUS}"]`
        )
      ) {
        input.type = "password";
      }
    },

    handleKeyboardShortcut(event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.altKey &&
        !event.shiftKey &&
        event.code === "KeyP"
      ) {
        event.preventDefault();
        event.stopPropagation();

        const currentIndex = Config.VALID_MODES.indexOf(State.currentMode);
        const nextIndex = (currentIndex + 1) % Config.VALID_MODES.length;
        const nextMode = Config.VALID_MODES[nextIndex];
        ScriptManager.setModeAndUpdate(nextMode);
      }
    },

    handleDOMMutation(mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            try {
              InputManager.findAndProcessNewInputs(node, State.currentMode);
            } catch (e) {}
          });
        } else if (
          mutation.type === "attributes" &&
          mutation.attributeName === "type"
        ) {
          const targetInput = mutation.target;
          if (
            targetInput.nodeType === Node.ELEMENT_NODE &&
            targetInput.matches &&
            targetInput.matches('input[type="password"]') &&
            targetInput.getAttribute(Config.ATTRIBUTES.PROCESSED) !==
              State.currentMode
          ) {
            try {
              InputManager.processPasswordInput(targetInput, State.currentMode);
            } catch (e) {}
          }
        }
      }
    },

    initializeDOMObserver() {
      if (this.domMutationObserver) return;

      const observerOptions = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["type"],
      };
      this.domMutationObserver = new MutationObserver(
        this.handleDOMMutation.bind(this)
      );

      if (document.body) {
        try {
          this.domMutationObserver.observe(document.body, observerOptions);
        } catch (error) {
          this.domMutationObserver = null;
        }
      } else {
        document.addEventListener(
          "DOMContentLoaded",
          () => {
            if (document.body) {
              try {
                this.domMutationObserver.observe(
                  document.body,
                  observerOptions
                );
              } catch (error) {
                this.domMutationObserver = null;
              }
            }
          },
          { once: true }
        );
      }
    },

    initializeGlobalEventListeners() {
      document.body.addEventListener(
        "mouseenter",
        this.handleShowPasswordOnHover.bind(this),
        true
      );
      document.body.addEventListener(
        "mouseleave",
        this.handleHidePasswordOnLeave.bind(this),
        true
      );
      document.body.addEventListener(
        "dblclick",
        this.handleTogglePasswordOnDoubleClick.bind(this)
      );
      document.addEventListener("focus", this.handleFocusIn.bind(this), true);
      document.addEventListener("blur", this.handleFocusOut.bind(this), true);
      document.addEventListener(
        "keydown",
        this.handleKeyboardShortcut.bind(this),
        true
      );
    },

    init() {
      this.initializeGlobalEventListeners();
      this.initializeDOMObserver();
    },
  };

  const ScriptManager = {
    init() {
      try {
        UserInterface.injectCoreStyles();
        State.loadAndSetInitialState();
        UserInterface.updateUserScriptMenuCommands();
        InputManager.applyCurrentModeToAllInputs();
        EventManager.init();
      } catch (error) {}
    },

    setModeAndUpdate(newMode) {
      if (State.setMode(newMode)) {
        const alertMessageKey =
          Config.MODE_TO_ALERT_MESSAGE_KEY_MAP[State.currentMode];
        UserInterface.displayModeNotification(alertMessageKey);
        InputManager.applyCurrentModeToAllInputs();
        UserInterface.updateUserScriptMenuCommands();
      }
    },
  };

  ScriptManager.init();
})();
