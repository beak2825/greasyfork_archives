// ==UserScript==
// @name               Universal Web Liberator
// @name:zh-CN         网页枷锁破除
// @name:zh-TW         網頁枷鎖破除
// @description        Disable webpage restrictions on Right-Click / Selection / Copy / Drag | Restore a seamless interactive experience | Tap the dynamic indicator in the bottom-right corner | Use the shortcut Meta/Ctrl+Alt+L | Toggle state via the userscript menu
// @description:zh-CN  解除网页右键菜单/选择文本/拷贝粘贴/拖拽内容限制 恢复自由交互体验 轻点右下角灵动指示器 | 使用快捷键 Meta/Ctrl+Alt+L | 脚本菜单切换状态
// @description:zh-TW  解除網頁右鍵選單/選取文字/複製貼上/拖曳內容限制 恢復自由互動體驗 輕點右下角靈動指示器 | 使用快捷鍵 Meta/Ctrl+Alt+L | 腳本選單切換狀態
// @version            1.5.5
// @icon               https://raw.githubusercontent.com/MiPoNianYou/UserScripts/main/Icons/Universal-Web-Liberator-Icon.svg
// @author             念柚
// @namespace          https://github.com/MiPoNianYou/UserScripts
// @supportURL         https://github.com/MiPoNianYou/UserScripts/issues
// @license            AGPL-3.0
// @match              *://*/*
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_deleteValue
// @grant              GM_addStyle
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/532010/%E7%BD%91%E9%A1%B5%E6%9E%B7%E9%94%81%E7%A0%B4%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/532010/%E7%BD%91%E9%A1%B5%E6%9E%B7%E9%94%81%E7%A0%B4%E9%99%A4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const UIManager = {
    ELEMENT_IDS: {
      STATUS_NOTIFICATION: "WebLiberatorStatusNotification",
      DYNAMIC_INDICATOR: "WebLiberatorDynamicIndicator",
      OVERRIDE_STYLE_SHEET: "WebLiberatorOverrideStyleSheet",
    },
    CSS_CLASSES: {
      STATUS_NOTIFICATION_VISIBLE: "wl-status-notification--visible",
      STATUS_NOTIFICATION_DISABLED: "wl-status-notification--disabled",
      BREATHING_DOT: "wl-breathing-dot",
      STATUS_NOTIFICATION_MESSAGE: "wl-status-notification-message",
      DYNAMIC_INDICATOR_EXPANDED: "wl-dynamic-indicator--expanded",
      DYNAMIC_INDICATOR_ACTIVE: "wl-dynamic-indicator--active",
    },
    SETTINGS: {
      UI_FONT_STACK: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      ANIMATION_EASING_QUINT: "cubic-bezier(0.23, 1, 0.32, 1)",
      ANIMATION_EASING_APPLE_STANDARD: "cubic-bezier(0, 0, 0.58, 1)",
      ANIMATION_DURATION_MS: 300,
      NOTIFICATION_VISIBILITY_DURATION_MS: 2000,
      INDICATOR_EXPANDED_DURATION_MS: 2000,
      INDICATOR_TRANSITION_DURATION_S: "0.25s",
      ICON_TRANSITION_DURATION_S: "0.2s",
      ICON_TRANSITION_DELAY_S: "0.1s",
    },
    STRINGS: {
      "zh-CN": {
        STATUS_ENABLED: "枷锁限制破除",
        STATUS_DISABLED: "枷锁限制恢复",
        MENU_CMD_ENABLED: "枷锁限制破除已启用 ✅",
        MENU_CMD_DISABLED: "枷锁限制破除已禁用 ❌",
      },
      "zh-TW": {
        STATUS_ENABLED: "枷鎖限制破除",
        STATUS_DISABLED: "枷鎖限制恢復",
        MENU_CMD_ENABLED: "枷鎖限制破除已啟用 ✅",
        MENU_CMD_DISABLED: "枷鎖限制破除已禁用 ❌",
      },
      "en-US": {
        STATUS_ENABLED: "Restrictions Bypassed",
        STATUS_DISABLED: "Restrictions Restored",
        MENU_CMD_ENABLED: "Restrictions Bypassed Activated ✅",
        MENU_CMD_DISABLED: "Restrictions Bypassed Deactivated ❌",
      },
    },
    SVG_ICONS: {
      DYNAMIC_INDICATOR:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82.129 104.736"><path d="M22.46 67.969h37.306c1.757 0 3.027-1.367 3.027-3.076 0-1.66-1.27-2.93-3.027-2.93H22.46c-1.758 0-3.076 1.27-3.076 2.93 0 1.709 1.318 3.076 3.076 3.076m0 14.648h17.628c1.758 0 3.027-1.27 3.027-2.93 0-1.709-1.27-3.076-3.027-3.076H22.46c-1.758 0-3.076 1.367-3.076 3.076 0 1.66 1.318 2.93 3.076 2.93m8.058-32.47h3.808c.342 0 .586.146.88.439l2.733 2.637c2.149 2.246 4.2 2.197 6.348 0l2.735-2.637c.293-.244.488-.44.878-.44h3.76c3.076 0 4.541-1.416 4.541-4.443v-3.809c0-.341.049-.634.342-.878l2.685-2.735c2.198-2.148 2.198-4.199 0-6.396l-2.685-2.686c-.293-.244-.342-.537-.342-.879v-3.808c0-3.076-1.416-4.492-4.54-4.492H47.9c-.391 0-.587-.196-.88-.391l-2.734-2.637c-2.148-2.246-4.2-2.197-6.347 0l-2.735 2.637c-.244.293-.537.39-.879.39h-3.808c-3.077 0-4.541 1.368-4.541 4.493v3.808c0 .342-.05.635-.342.88l-2.686 2.685c-2.197 2.197-2.197 4.248 0 6.396l2.686 2.735c.293.244.342.537.342.879v3.808c0 3.027 1.464 4.444 4.54 4.444m8.593-5.909c-.732 0-1.367-.341-2.002-1.123l-4.394-5.37c-.342-.392-.586-.929-.586-1.466 0-1.123.83-2.1 2.1-2.1.683 0 1.22.343 1.806 1.026l3.028 3.809 6.982-11.182c.39-.635 1.025-1.123 1.758-1.123 1.074 0 2.1.781 2.1 1.953 0 .537-.294 1.123-.538 1.514l-8.203 12.89c-.488.83-1.22 1.172-2.05 1.172M0 89.404c0 10.205 5.03 15.284 15.137 15.284h51.855c10.108 0 15.137-5.079 15.137-15.284V15.332C82.129 5.176 77.099 0 66.992 0H15.137C5.029 0 0 5.176 0 15.332Zm7.861-.146v-73.78c0-4.882 2.588-7.617 7.666-7.617h51.075c5.078 0 7.666 2.735 7.666 7.618v73.779c0 4.883-2.588 7.568-7.666 7.568H15.527c-5.078 0-7.666-2.685-7.666-7.568" fill="currentColor"/></svg>`.trim(),
    },
    statusNotificationTimer: null,
    statusNotificationRemovalTimer: null,
    dynamicIndicatorElement: null,
    indicatorCollapseTimer: null,
    userScriptMenuCommandId: null,

    injectCoreStyles() {
      const easeOutQuint = this.SETTINGS.ANIMATION_EASING_QUINT;
      const appleEaseOutStandard =
        this.SETTINGS.ANIMATION_EASING_APPLE_STANDARD;
      const animationDurationMs = this.SETTINGS.ANIMATION_DURATION_MS;
      const indicatorTransitionDuration =
        this.SETTINGS.INDICATOR_TRANSITION_DURATION_S;
      const iconTransitionDuration = this.SETTINGS.ICON_TRANSITION_DURATION_S;
      const iconTransitionDelay = this.SETTINGS.ICON_TRANSITION_DELAY_S;

      const baseCSS = `
        :root {
          --ctp-frappe-red: rgb(231, 130, 132);
          --ctp-frappe-green: rgb(166, 209, 137);
          --ctp-frappe-text: rgb(198, 208, 245);
          --ctp-frappe-surface1: rgb(81, 87, 109);
          --ctp-frappe-surface2: rgb(98, 104, 128);
          --ctp-frappe-base: rgb(48, 52, 70);
          --ctp-frappe-crust: rgb(35, 38, 52);

          --ctp-latte-red: rgb(210, 15, 57);
          --ctp-latte-green: rgb(64, 160, 43);
          --ctp-latte-text: rgb(76, 79, 105);
          --ctp-latte-overlay0: rgb(156, 160, 176);
          --ctp-latte-surface1: rgb(188, 192, 204);
          --ctp-latte-surface2: rgb(172, 176, 190);
          --ctp-latte-base: rgb(239, 241, 245);

          --wl-notify-bg-dark: rgb(from var(--ctp-frappe-base) r g b / 0.85);
          --wl-notify-text-dark: var(--ctp-frappe-text);
          --wl-notify-border-dark: rgb(from var(--ctp-frappe-surface2) r g b / 0.25);
          --wl-notify-dot-color-enabled-dark: var(--ctp-frappe-green);
          --wl-notify-dot-color-disabled-dark: var(--ctp-frappe-red);
          --wl-notify-dot-glow-enabled-dark: rgb(from var(--ctp-frappe-green) r g b / 0.35);
          --wl-notify-dot-glow-disabled-dark: rgb(from var(--ctp-frappe-red) r g b / 0.35);
          --wl-indicator-inactive-bg-dark: var(--ctp-frappe-surface2);
          --wl-indicator-inactive-opacity-dark: 0.55;
          --wl-indicator-hover-bg-dark: rgb(from var(--ctp-frappe-surface1) r g b / 0.5);
          --wl-indicator-expanded-bg-dark: rgb(from var(--ctp-frappe-base) r g b / 0.85);
          --wl-indicator-active-bg-dark: rgb(from var(--ctp-frappe-green) r g b / 0.88);
          --wl-indicator-border-dark: rgb(from var(--ctp-frappe-surface2) r g b / 0.2);
          --wl-icon-color-dark: var(--ctp-frappe-text);
          --wl-icon-active-color-dark: var(--ctp-frappe-crust);

          --wl-notify-bg-light: rgb(from var(--ctp-latte-base) r g b / 0.85);
          --wl-notify-text-light: var(--ctp-latte-text);
          --wl-notify-border-light: rgb(from var(--ctp-latte-surface2) r g b / 0.25);
          --wl-notify-dot-color-enabled-light: var(--ctp-latte-green);
          --wl-notify-dot-color-disabled-light: var(--ctp-latte-red);
          --wl-notify-dot-glow-enabled-light: rgb(from var(--ctp-latte-green) r g b / 0.35);
          --wl-notify-dot-glow-disabled-light: rgb(from var(--ctp-latte-red) r g b / 0.35);
          --wl-indicator-inactive-bg-light: var(--ctp-latte-overlay0);
          --wl-indicator-inactive-opacity-light: 0.65;
          --wl-indicator-hover-bg-light: rgb(from var(--ctp-latte-surface1) r g b / 0.5);
          --wl-indicator-expanded-bg-light: rgb(from var(--ctp-latte-base) r g b / 0.85);
          --wl-indicator-active-bg-light: rgb(from var(--ctp-latte-green) r g b / 0.88);
          --wl-indicator-border-light: rgb(from var(--ctp-latte-surface2) r g b / 0.2);
          --wl-icon-color-light: var(--ctp-latte-text);
          --wl-icon-active-color-light: var(--ctp-latte-base);

          --wl-shadow-dark:
            0 1px 2px rgba(0, 0, 0, 0.1),
            0 6px 12px rgba(0, 0, 0, 0.2);
          --wl-shadow-light:
            0 1px 2px rgba(90, 90, 90, 0.06),
            0 6px 12px rgba(90, 90, 90, 0.12);
        }

        @keyframes wl-breathing-animation {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }

        #${this.ELEMENT_IDS.STATUS_NOTIFICATION} {
          position: fixed;
          bottom: 20px;
          left: 50%;
          z-index: 2147483646;
          display: flex;
          align-items: center;
          padding: 10px 16px;
          border: 1px solid var(--wl-notify-border-dark);
          border-radius: 20px;
          background-color: var(--wl-notify-bg-dark);
          color: var(--wl-notify-text-dark);
          box-shadow: var(--wl-shadow-dark);
          box-sizing: border-box;
          opacity: 0;
          font-family: ${this.SETTINGS.UI_FONT_STACK};
          text-align: left;
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          transform: translate(-50%, calc(100% + 40px));
          transition: transform ${animationDurationMs}ms ${easeOutQuint},
                      opacity ${animationDurationMs * 0.8}ms ${easeOutQuint};
        }

        #${this.ELEMENT_IDS.STATUS_NOTIFICATION}.${
        this.CSS_CLASSES.STATUS_NOTIFICATION_VISIBLE
      } {
          transform: translate(-50%, 0);
          opacity: 1;
        }

        #${this.ELEMENT_IDS.STATUS_NOTIFICATION} .${
        this.CSS_CLASSES.BREATHING_DOT
      } {
          width: 8px;
          height: 8px;
          margin-right: 10px;
          border-radius: 50%;
          background-color: var(--wl-notify-dot-color-enabled-dark);
          box-shadow: 0 0 8px 3px var(--wl-notify-dot-glow-enabled-dark);
          flex-shrink: 0;
          animation: wl-breathing-animation 2000ms ease-in-out infinite;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        #${this.ELEMENT_IDS.STATUS_NOTIFICATION}.${
        this.CSS_CLASSES.STATUS_NOTIFICATION_DISABLED
      } .${this.CSS_CLASSES.BREATHING_DOT} {
          background-color: var(--wl-notify-dot-color-disabled-dark);
          box-shadow: 0 0 8px 3px var(--wl-notify-dot-glow-disabled-dark);
        }

        #${this.ELEMENT_IDS.STATUS_NOTIFICATION} .${
        this.CSS_CLASSES.STATUS_NOTIFICATION_MESSAGE
      } {
          color: var(--wl-notify-text-dark);
          font-size: 13px;
          font-weight: 500;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR} {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--wl-indicator-inactive-bg-dark);
          color: var(--wl-icon-color-dark);
          opacity: var(--wl-indicator-inactive-opacity-dark);
          overflow: hidden;
          cursor: pointer;
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          transition: width ${indicatorTransitionDuration} ${appleEaseOutStandard},
                      height ${indicatorTransitionDuration} ${appleEaseOutStandard},
                      opacity ${indicatorTransitionDuration} ${appleEaseOutStandard},
                      background-color ${indicatorTransitionDuration} ${appleEaseOutStandard},
                      color ${indicatorTransitionDuration} ${appleEaseOutStandard},
                      backdrop-filter ${indicatorTransitionDuration} ${appleEaseOutStandard},
                      box-shadow ${indicatorTransitionDuration} ${appleEaseOutStandard},
                      transform ${iconTransitionDuration} ${appleEaseOutStandard};
          user-select: none !important;
          -webkit-user-select: none !important;
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}:hover {
          background-color: var(--wl-indicator-hover-bg-dark);
          opacity: 0.8;
          transform: scale(1.1);
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_ACTIVE
      }:not(.${this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED}) {
           background-color: var(--wl-indicator-active-bg-dark);
           opacity: 0.6;
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED
      } {
          width: 40px;
          height: 40px;
          border: 1px solid var(--wl-indicator-border-dark);
          background-color: var(--wl-indicator-expanded-bg-dark);
          box-shadow: var(--wl-shadow-dark);
          opacity: 1;
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          transform: scale(1);
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED
      }:hover {
          transform: scale(1.08);
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED
      }.${this.CSS_CLASSES.DYNAMIC_INDICATOR_ACTIVE} {
          background-color: var(--wl-indicator-active-bg-dark);
          color: var(--wl-icon-active-color-dark);
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR} svg {
          display: block;
          width: 20px;
          height: 20px;
          opacity: 0;
          transform: scale(0.5);
          transition: opacity ${iconTransitionDuration} ${appleEaseOutStandard} ${iconTransitionDelay},
                      transform ${iconTransitionDuration} ${appleEaseOutStandard} ${iconTransitionDelay};
          pointer-events: none;
        }

        #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED
      } svg {
          opacity: 1;
          transform: scale(1);
        }

        @media (prefers-color-scheme: light) {
          #${this.ELEMENT_IDS.STATUS_NOTIFICATION} {
            border: 1px solid var(--wl-notify-border-light);
            background-color: var(--wl-notify-bg-light);
            color: var(--wl-notify-text-light);
          }

          #${this.ELEMENT_IDS.STATUS_NOTIFICATION} .${
        this.CSS_CLASSES.BREATHING_DOT
      } {
            background-color: var(--wl-notify-dot-color-enabled-light);
            box-shadow: 0 0 8px 3px var(--wl-notify-dot-glow-enabled-light);
          }

          #${this.ELEMENT_IDS.STATUS_NOTIFICATION}.${
        this.CSS_CLASSES.STATUS_NOTIFICATION_DISABLED
      } .${this.CSS_CLASSES.BREATHING_DOT} {
            background-color: var(--wl-notify-dot-color-disabled-light);
            box-shadow: 0 0 8px 3px var(--wl-notify-dot-glow-disabled-light);
          }

          #${this.ELEMENT_IDS.STATUS_NOTIFICATION} .${
        this.CSS_CLASSES.STATUS_NOTIFICATION_MESSAGE
      } {
            color: var(--wl-notify-text-light);
          }

          #${this.ELEMENT_IDS.DYNAMIC_INDICATOR} {
            background-color: var(--wl-indicator-inactive-bg-light);
            color: var(--wl-icon-color-light);
            opacity: var(--wl-indicator-inactive-opacity-light);
          }

          #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}:hover {
            background-color: var(--wl-indicator-hover-bg-light);
          }

          #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_ACTIVE
      }:not(.${this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED}) {
             background-color: var(--wl-indicator-active-bg-light);
             opacity: 0.6;
          }

          #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED
      } {
            border: 1px solid var(--wl-indicator-border-light);
            background-color: var(--wl-indicator-expanded-bg-light);
            box-shadow: var(--wl-shadow-light);
          }

          #${this.ELEMENT_IDS.DYNAMIC_INDICATOR}.${
        this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED
      }.${this.CSS_CLASSES.DYNAMIC_INDICATOR_ACTIVE} {
            background-color: var(--wl-indicator-active-bg-light);
            color: var(--wl-icon-active-color-light);
          }
        }
      `;
      try {
        GM_addStyle(baseCSS);
      } catch (e) {}
    },

    displayStatusNotification(statusMessageKey) {
      if (this.statusNotificationTimer)
        clearTimeout(this.statusNotificationTimer);
      if (this.statusNotificationRemovalTimer)
        clearTimeout(this.statusNotificationRemovalTimer);
      this.statusNotificationTimer = null;
      this.statusNotificationRemovalTimer = null;

      const message = StateManager.getLocalizedString(statusMessageKey);

      const renderNotification = () => {
        let notificationElement = document.getElementById(
          this.ELEMENT_IDS.STATUS_NOTIFICATION
        );
        if (!notificationElement && document.body) {
          notificationElement = document.createElement("div");
          notificationElement.id = this.ELEMENT_IDS.STATUS_NOTIFICATION;
          notificationElement.innerHTML = `
            <div class="${this.CSS_CLASSES.BREATHING_DOT}"></div>
            <div class="${this.CSS_CLASSES.STATUS_NOTIFICATION_MESSAGE}"></div>
          `.trim();
          document.body.appendChild(notificationElement);
        } else if (!notificationElement) {
          return;
        }

        if (!StateManager.isScriptActive) {
          notificationElement.classList.add(
            this.CSS_CLASSES.STATUS_NOTIFICATION_DISABLED
          );
        } else {
          notificationElement.classList.remove(
            this.CSS_CLASSES.STATUS_NOTIFICATION_DISABLED
          );
        }

        const messageElement = notificationElement.querySelector(
          `.${this.CSS_CLASSES.STATUS_NOTIFICATION_MESSAGE}`
        );
        if (messageElement) messageElement.textContent = message;

        notificationElement.classList.remove(
          this.CSS_CLASSES.STATUS_NOTIFICATION_VISIBLE
        );
        void notificationElement.offsetWidth;

        requestAnimationFrame(() => {
          const currentElement = document.getElementById(
            this.ELEMENT_IDS.STATUS_NOTIFICATION
          );
          if (currentElement) {
            currentElement.classList.add(
              this.CSS_CLASSES.STATUS_NOTIFICATION_VISIBLE
            );
          }
        });

        this.statusNotificationTimer = setTimeout(() => {
          const currentElement = document.getElementById(
            this.ELEMENT_IDS.STATUS_NOTIFICATION
          );
          if (currentElement) {
            currentElement.classList.remove(
              this.CSS_CLASSES.STATUS_NOTIFICATION_VISIBLE
            );
            this.statusNotificationRemovalTimer = setTimeout(() => {
              document
                .getElementById(this.ELEMENT_IDS.STATUS_NOTIFICATION)
                ?.remove();
              this.statusNotificationTimer = null;
              this.statusNotificationRemovalTimer = null;
            }, this.SETTINGS.ANIMATION_DURATION_MS);
          } else {
            this.statusNotificationTimer = null;
            this.statusNotificationRemovalTimer = null;
          }
        }, this.SETTINGS.NOTIFICATION_VISIBILITY_DURATION_MS);
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderNotification, {
          once: true,
        });
      } else {
        renderNotification();
      }
    },

    updateUserScriptMenuCommand() {
      if (this.userScriptMenuCommandId) {
        try {
          GM_unregisterMenuCommand(this.userScriptMenuCommandId);
        } catch (e) {}
        this.userScriptMenuCommandId = null;
      }
      const labelKey = StateManager.isScriptActive
        ? "MENU_CMD_ENABLED"
        : "MENU_CMD_DISABLED";
      const commandLabel = StateManager.getLocalizedString(labelKey);
      try {
        this.userScriptMenuCommandId = GM_registerMenuCommand(
          commandLabel,
          ScriptManager.toggleActivationWithDebounce
        );
      } catch (e) {
        this.userScriptMenuCommandId = null;
      }
    },

    createDynamicIndicator() {
      if (
        !document.body ||
        document.getElementById(this.ELEMENT_IDS.DYNAMIC_INDICATOR)
      ) {
        return;
      }
      this.dynamicIndicatorElement = document.createElement("div");
      this.dynamicIndicatorElement.id = this.ELEMENT_IDS.DYNAMIC_INDICATOR;
      this.dynamicIndicatorElement.innerHTML = this.SVG_ICONS.DYNAMIC_INDICATOR;
      document.body.appendChild(this.dynamicIndicatorElement);
      this.updateDynamicIndicatorStateVisuals();
      EventManager.bindDynamicIndicatorEvents(this.dynamicIndicatorElement);
    },

    ensureDynamicIndicatorExists() {
      if (
        this.dynamicIndicatorElement &&
        document.body?.contains(this.dynamicIndicatorElement)
      ) {
        this.updateDynamicIndicatorStateVisuals();
        return;
      }
      let existingIndicator = document.getElementById(
        this.ELEMENT_IDS.DYNAMIC_INDICATOR
      );
      if (existingIndicator) {
        this.dynamicIndicatorElement = existingIndicator;
        this.updateDynamicIndicatorStateVisuals();
        EventManager.bindDynamicIndicatorEvents(this.dynamicIndicatorElement);
        return;
      }
      if (document.body) {
        this.createDynamicIndicator();
      } else {
        document.addEventListener(
          "DOMContentLoaded",
          () => this.createDynamicIndicator(),
          { once: true }
        );
      }
    },

    updateDynamicIndicatorStateVisuals() {
      const indicator =
        this.dynamicIndicatorElement ||
        document.getElementById(this.ELEMENT_IDS.DYNAMIC_INDICATOR);
      if (indicator) {
        indicator.classList.toggle(
          this.CSS_CLASSES.DYNAMIC_INDICATOR_ACTIVE,
          StateManager.isScriptActive
        );
      }
    },

    expandAndCollapseDynamicIndicator() {
      const indicator =
        this.dynamicIndicatorElement ||
        document.getElementById(this.ELEMENT_IDS.DYNAMIC_INDICATOR);
      if (!indicator) return;
      clearTimeout(this.indicatorCollapseTimer);
      indicator.classList.remove(this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED);
      void indicator.offsetWidth;
      requestAnimationFrame(() => {
        indicator.classList.add(this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED);
        this.indicatorCollapseTimer = setTimeout(() => {
          indicator.classList.remove(
            this.CSS_CLASSES.DYNAMIC_INDICATOR_EXPANDED
          );
          this.indicatorCollapseTimer = null;
        }, this.SETTINGS.INDICATOR_EXPANDED_DURATION_MS);
      });
    },
  };

  const StateManager = {
    STORAGE_KEYS: {
      ACTIVATION_STATE_PREFIX: "webliberator_state_",
      STATE_ENABLED_VALUE: "enabled",
    },
    stateToggleDebounceMS: 200,
    defaultActivationState: false,
    isScriptActive: false,
    currentLocale: "en-US",
    localizedStrings: UIManager.STRINGS["en-US"],
    pageOrigin: window.location.origin,

    loadAndSetInitialState() {
      this.isScriptActive = this.defaultActivationState;
      this.currentLocale = this.detectUserLanguage();
      this.localizedStrings =
        UIManager.STRINGS[this.currentLocale] || UIManager.STRINGS["en-US"];
      this.loadActivationState();
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

        if (langLower.startsWith("zh")) return "zh-CN";
        if (langLower.startsWith("en")) return "en-US";
      }
      return "en-US";
    },
    getActivationStateStorageKey() {
      const origin = String(this.pageOrigin || "").replace(/\/$/, "");
      return `${this.STORAGE_KEYS.ACTIVATION_STATE_PREFIX}${origin}`;
    },
    loadActivationState() {
      const storageKey = this.getActivationStateStorageKey();
      let storedValue = null;
      try {
        storedValue = GM_getValue(storageKey, null);
      } catch (e) {}

      if (storedValue === this.STORAGE_KEYS.STATE_ENABLED_VALUE) {
        this.isScriptActive = true;
      } else if (storedValue === null) {
        this.isScriptActive = this.defaultActivationState;
      } else {
        this.isScriptActive = this.defaultActivationState;
        try {
          GM_deleteValue(storageKey);
        } catch (e) {}
      }
    },
    saveActivationState() {
      const storageKey = this.getActivationStateStorageKey();
      try {
        if (this.isScriptActive) {
          GM_setValue(storageKey, this.STORAGE_KEYS.STATE_ENABLED_VALUE);
        } else {
          GM_deleteValue(storageKey);
        }
      } catch (e) {}
    },
    toggleActivation() {
      this.isScriptActive = !this.isScriptActive;
      this.saveActivationState();
      return this.isScriptActive;
    },
    getLocalizedString(key) {
      return (
        this.localizedStrings[key] ??
        UIManager.STRINGS["en-US"][key] ??
        `${key}?`
      );
    },
  };

  const RestrictionManager = {
    RESTRICTION_OVERRIDES: {
      EVENTS_TO_INTERCEPT: [
        "contextmenu",
        "selectstart",
        "copy",
        "cut",
        "paste",
        "drag",
        "dragstart",
      ],
      INLINE_HANDLER_ATTRIBUTES_TO_CLEAR: [
        "onmousedown",
        "oncontextmenu",
        "onselect",
        "onselectstart",
        "oncopy",
        "oncut",
        "onpaste",
        "onbeforecopy",
        "onbeforecut",
        "onbeforepaste",
        "ondrag",
        "ondragstart",
      ],
    },
    overrideStyleSheetElement: null,
    applyOverrides() {
      this.injectRestrictionOverrideStyles();
      EventManager.registerEventInterceptors();
    },
    removeOverrides() {
      this.removeRestrictionOverrideStyles();
      EventManager.unregisterEventInterceptors();
    },
    injectRestrictionOverrideStyles() {
      if (
        this.overrideStyleSheetElement ||
        document.getElementById(UIManager.ELEMENT_IDS.OVERRIDE_STYLE_SHEET)
      )
        return;
      const css = `
        *, *::before, *::after {
          user-select: text !important; -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important;
          cursor: auto !important;
          -webkit-user-drag: auto !important; user-drag: auto !important;
        }
        body { cursor: auto !important; }
        ::selection { background-color: highlight !important; color: highlighttext !important; }
        ::-moz-selection { background-color: highlight !important; color: highlighttext !important; }
      `;
      this.overrideStyleSheetElement = document.createElement("style");
      this.overrideStyleSheetElement.id =
        UIManager.ELEMENT_IDS.OVERRIDE_STYLE_SHEET;
      this.overrideStyleSheetElement.textContent = css;
      (document.head || document.documentElement).appendChild(
        this.overrideStyleSheetElement
      );
    },
    removeRestrictionOverrideStyles() {
      this.overrideStyleSheetElement?.remove();
      this.overrideStyleSheetElement = null;
      document
        .getElementById(UIManager.ELEMENT_IDS.OVERRIDE_STYLE_SHEET)
        ?.remove();
    },
    clearElementInlineHandlers(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
      for (const prop of this.RESTRICTION_OVERRIDES
        .INLINE_HANDLER_ATTRIBUTES_TO_CLEAR) {
        if (
          prop in element &&
          (typeof element[prop] === "function" || element[prop] !== null)
        ) {
          try {
            element[prop] = null;
          } catch (e) {}
        }
        if (element.hasAttribute(prop)) {
          try {
            element.removeAttribute(prop);
          } catch (e) {}
        }
      }
    },
    handlersRecursively(rootNode) {
      if (!StateManager.isScriptActive || !rootNode) return;

      const processSingleNode = (element) => {
        if (element.nodeType !== Node.ELEMENT_NODE) return;

        if (
          element.closest(
            `#${UIManager.ELEMENT_IDS.DYNAMIC_INDICATOR}, #${UIManager.ELEMENT_IDS.STATUS_NOTIFICATION}`
          )
        ) {
          return;
        }

        this.clearElementInlineHandlers(element);

        if (element.shadowRoot?.mode === "open") {
          for (const childInShadow of Array.from(element.shadowRoot.children)) {
            processSingleNode(childInShadow);
          }
        }

        for (const child of Array.from(element.children)) {
          processSingleNode(child);
        }
      };

      try {
        if (
          rootNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
          rootNode.nodeType === Node.DOCUMENT_NODE
        ) {
          for (const child of Array.from(rootNode.children)) {
            processSingleNode(child);
          }
        } else if (rootNode.nodeType === Node.ELEMENT_NODE) {
          processSingleNode(rootNode);
        }
      } catch (error) {}
    },
  };

  const EventManager = {
    domMutationObserver: null,
    debouncedHandleDOMMutation: null,
    DOM_OBSERVER_DEBOUNCE_MS: 300,

    init() {
      this.debouncedHandleDOMMutation = this.debounce(
        this.handleDOMMutation.bind(this),
        this.DOM_OBSERVER_DEBOUNCE_MS
      );
      this.initializeGlobalKeyboardShortcutListener();
    },
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    bindDynamicIndicatorEvents(indicatorElement) {
      if (indicatorElement && !indicatorElement.dataset.listenerAttached) {
        indicatorElement.addEventListener(
          "click",
          this.handleDynamicIndicatorClick.bind(this)
        );
        indicatorElement.dataset.listenerAttached = "true";
      }
    },
    stopPropagationHandler(event) {
      event.stopImmediatePropagation();
    },
    registerEventInterceptors() {
      RestrictionManager.RESTRICTION_OVERRIDES.EVENTS_TO_INTERCEPT.forEach(
        (type) => {
          document.addEventListener(type, this.stopPropagationHandler, {
            capture: true,
            passive: false,
          });
        }
      );
    },
    unregisterEventInterceptors() {
      RestrictionManager.RESTRICTION_OVERRIDES.EVENTS_TO_INTERCEPT.forEach(
        (type) => {
          document.removeEventListener(type, this.stopPropagationHandler, {
            capture: true,
          });
        }
      );
    },
    handleDOMMutation(mutations) {
      if (!StateManager.isScriptActive) return;
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            RestrictionManager.handlersRecursively(node);
          }
        }
      }
    },
    initializeDOMObserver() {
      if (this.domMutationObserver || !document.documentElement) return;
      const observerOptions = { childList: true, subtree: true };
      this.domMutationObserver = new MutationObserver(
        this.debouncedHandleDOMMutation
      );
      try {
        this.domMutationObserver.observe(
          document.documentElement,
          observerOptions
        );
      } catch (error) {
        this.domMutationObserver = null;
      }
    },
    disconnectDOMObserver() {
      if (this.domMutationObserver) {
        this.domMutationObserver.disconnect();
        this.domMutationObserver = null;
      }
    },
    handleDynamicIndicatorClick(event) {
      event.stopPropagation();
      UIManager.expandAndCollapseDynamicIndicator();
      ScriptManager.toggleActivationWithDebounce();
    },
    handleKeyboardShortcut(event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.altKey &&
        event.code === "KeyL"
      ) {
        event.preventDefault();
        event.stopPropagation();
        ScriptManager.toggleActivationWithDebounce();
      }
    },
    initializeGlobalKeyboardShortcutListener() {
      document.addEventListener(
        "keydown",
        this.handleKeyboardShortcut.bind(this),
        { capture: true }
      );
    },
  };

  const ScriptManager = {
    init() {
      try {
        StateManager.loadAndSetInitialState();
        UIManager.injectCoreStyles();
        UIManager.ensureDynamicIndicatorExists();
        UIManager.updateUserScriptMenuCommand();

        if (StateManager.isScriptActive) {
          RestrictionManager.applyOverrides();
          RestrictionManager.handlersRecursively(
            document.documentElement
          );
          EventManager.initializeDOMObserver();
        }
        EventManager.init();
      } catch (error) {}
    },
    toggleActivation() {
      const isActiveNow = StateManager.toggleActivation();
      if (isActiveNow) {
        RestrictionManager.applyOverrides();
        RestrictionManager.handlersRecursively(
          document.documentElement
        );
        EventManager.initializeDOMObserver();
        UIManager.displayStatusNotification("STATUS_ENABLED");
      } else {
        RestrictionManager.removeOverrides();
        EventManager.disconnectDOMObserver();
        UIManager.displayStatusNotification("STATUS_DISABLED");
      }
      UIManager.updateUserScriptMenuCommand();
      UIManager.updateDynamicIndicatorStateVisuals();
    },
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    toggleActivationWithDebounce: null,
  };
  ScriptManager.toggleActivationWithDebounce = ScriptManager.debounce(
    ScriptManager.toggleActivation,
    StateManager.stateToggleDebounceMS
  );

  if (window.self === window.top) {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => ScriptManager.init(),
        { once: true }
      );
    } else {
      ScriptManager.init();
    }
  }
})();
