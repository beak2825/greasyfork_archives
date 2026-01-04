// ==UserScript==
// @name             斗鱼全民星推荐自动领取pro
// @namespace        http://tampermonkey.net/
// @version          2.0.9
// @author           ienone&Truthss
// @description      原版《斗鱼全民星推荐自动领取》的增强版(应该增强了……)在保留核心功能的基础上，引入了可视化管理面板
// @license          MIT
// @match            *://www.douyu.com/*
// @connect          list-www.douyu.com
// @grant            GM_addStyle
// @grant            GM_cookie
// @grant            GM_deleteValue
// @grant            GM_getValue
// @grant            GM_listValues
// @grant            GM_log
// @grant            GM_notification
// @grant            GM_openInTab
// @grant            GM_setValue
// @grant            GM_xmlhttpRequest
// @grant            window.close
// @run-at           document-idle
// @noframes
// @original-author  ysl-ovo (https://greasyfork.org/zh-CN/users/1453821-ysl-ovo)
// @downloadURL https://update.greasyfork.org/scripts/543589/%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96pro.user.js
// @updateURL https://update.greasyfork.org/scripts/543589/%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96pro.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  const CONFIG = {



SCRIPT_PREFIX: "[全民星推荐助手]",
CONTROL_ROOM_ID: "6657",
TEMP_CONTROL_ROOM_RID: "6979222",

POPUP_WAIT_TIMEOUT: 2e4,
PANEL_WAIT_TIMEOUT: 1e4,
ELEMENT_WAIT_TIMEOUT: 3e4,
RED_ENVELOPE_LOAD_TIMEOUT: 15e3,
MIN_DELAY: 1e3,
MAX_DELAY: 2500,
CLOSE_TAB_DELAY: 1500,
INITIAL_SCRIPT_DELAY: 3e3,
UNRESPONSIVE_TIMEOUT: 15 * 60 * 1e3,
SWITCHING_CLEANUP_TIMEOUT: 3e4,
HEALTHCHECK_INTERVAL: 1e4,
DISCONNECTED_GRACE_PERIOD: 1e4,
STATS_UPDATE_INTERVAL: 4e3,

DRAGGABLE_BUTTON_ID: "douyu-qmx-starter-button",
BUTTON_POS_STORAGE_KEY: "douyu_qmx_button_position",
MODAL_DISPLAY_MODE: "floating",

API_URL: "https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/square/list",
COIN_LIST_URL: "https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/coin/record/list",
API_RETRY_COUNT: 3,
API_RETRY_DELAY: 5e3,

MAX_WORKER_TABS: 24,
DAILY_LIMIT_ACTION: "CONTINUE_DORMANT",
AUTO_PAUSE_ENABLED: true,
AUTO_PAUSE_DELAY_AFTER_ACTION: 5e3,
CALIBRATION_MODE_ENABLED: false,
SHOW_STATS_IN_PANEL: false,

ENABLE_DANMU_PRO: false,
STATE_STORAGE_KEY: "douyu_qmx_dashboard_state",
DAILY_LIMIT_REACHED_KEY: "douyu_qmx_daily_limit_reached",
STATS_INFO_STORAGE_KEY: "douyu_qmx_stats",

DEFAULT_THEME: "dark",
    INJECT_TARGET_RETRIES: 10,
INJECT_TARGET_INTERVAL: 500,
API_ROOM_FETCH_COUNT: 10,
UI_FEEDBACK_DELAY: 2e3,
DRAG_BUTTON_DEFAULT_PADDING: 20,
CONVERT_LEGACY_POSITION: true,

SELECTORS: {
redEnvelopeContainer: 'div.activeItem__d6uUm, div[class*="activeItem"]',
clickableContainer: 'div.container__0Xsh2, div[class*="container__"]',
countdownTimer: 'div.boxContent__N0d-3, div[class*="boxContent"]',
statusHeadline: 'div.boxHeadline__GP-am, div[class*="boxHeadline"]',
boxIcon: 'div.boxIcon__H-44m, div[class*="boxIcon"]',
popupModal: 'div.LiveNewAnchorSupportT-pop--inner, div[class*="pop--inner"]',
singleBag: 'div.LiveNewAnchorSupportT-singleBag, div[class*="singleBag"]',
openButton: 'div.LiveNewAnchorSupportT-singleBag--btn, div[class*="singleBag--btn"]',
closeButton: 'div.LiveNewAnchorSupportT-pop--close, div[class*="pop--close"]',
criticalElement: "#js-player-video",
      pauseButton: '#js-player-controlbar [class*="left-"] i:nth-child(1), [class*="icon-pause"], .icon-c8be96',
rewardSuccessIndicator: '[class*="singleBagOpened"]',
limitReachedPopup: "div.dy-Message-custom-content.dy-Message-info",
      rankListContainer: "#layout-Player-aside > div.layout-Player-asideMainTop > div.layout-Player-rank",
      anchorName: 'h3.anchorName__6NXv9, h3[class*="anchorName"], div.Title-anchorName > h2.Title-anchorNameH2',
prizeContainer: 'div.LiveNewAnchorSupportT-singleBag--awards, div[class*="singleBag--awards"]',
      prizeItem: 'div.LiveNewAnchorSupportT-singleBag--prize, div[class*="singleBag--prize"]',
      prizeImage: "img",
      prizeCount: "span"
    },






DB_NAME: "DouyuDanmukuPro",
    DB_VERSION: 2,
    DB_STORE_NAME: "danmuku_templates",
SETTINGS_KEY_PREFIX: "dda_",
CSS_CLASSES: {
      POPUP: "dda-popup",
      POPUP_SHOW: "show",
      POPUP_CONTENT: "dda-popup-content",
      POPUP_ITEM: "dda-popup-item",
      POPUP_ITEM_ACTIVE: "dda-popup-item-active",
      POPUP_ITEM_TEXT: "dda-popup-item-text",
      POPUP_EMPTY: "dda-popup-empty",
      EMPTY_MESSAGE: "dda-empty-message"
    },
KEYBOARD: {
      ENTER: "Enter",
      ESCAPE: "Escape",
      ARROW_UP: "ArrowUp",
      ARROW_DOWN: "ArrowDown",
      ARROW_LEFT: "ArrowLeft",
      ARROW_RIGHT: "ArrowRight",
      TAB: "Tab",
      BACKSPACE: "Backspace"
    },
API: {
      BASE_URL: "https://api.example.com",
      TIMEOUT: 5e3,
      RETRY_ATTEMPTS: 3
    },
DEBUG: false,
LOG_LEVEL: "info",


minSearchLength: 1,
maxSuggestions: 10,
debounceDelay: 300,

sortBy: "relevance",
autoImportMaxPages: 5,
autoImportPageSize: 50,
autoImportSortByPopularity: true,

enterSelectionModeKey: "ArrowUp",
exitSelectionModeKey: "ArrowDown",
expandCandidatesKey: "ArrowUp",
navigationLeftKey: "ArrowLeft",
navigationRightKey: "ArrowRight",
selectKey: "Enter",
cancelKey: "Escape",

popupShowDelay: 100,
popupHideDelay: 200,
animationDuration: 200,

maxPopupHeight: 300,
itemHeight: 40,
maxCandidateWidth: 200,

capsule: {
      maxWidth: 150,
height: 24,
padding: 16,
margin: 16,
totalHeight: 40,
fontSize: 12,
itemsPerRow: 4,
singleRowMaxItems: 8,

preview: {
        enabled: true,
showDelay: 500,
hideDelay: 100,
maxWidth: 300,
animationDuration: 200,
keyboardShowDelay: 150,
verticalOffset: 8,
horizontalOffset: 0,
preferredPosition: "top"
}
    },
enableAutoComplete: true,
enableKeyboardShortcuts: true,
enableSelectionMode: true,
enableSound: false,

enableSync: false,
syncInterval: 3e5,

maxCacheSize: 1e3,
cacheExpireTime: 864e5
};
  const SettingsManager = {
    STORAGE_KEY: "douyu_qmx_user_settings",
get() {
      const userSettings = GM_getValue(this.STORAGE_KEY, {});
      const themeSetting = GM_getValue(
        "douyu_qmx_theme",
        CONFIG.DEFAULT_THEME
      );
      return Object.assign({}, CONFIG, userSettings, { THEME: themeSetting });
    },
save(settingsToSave) {
      if (Object.hasOwn(settingsToSave, "THEME")) {
        const theme = settingsToSave.THEME;
        GM_setValue("douyu_qmx_theme", theme);
        delete settingsToSave.THEME;
      }
      delete settingsToSave.OPEN_TAB_DELAY;
      GM_setValue(this.STORAGE_KEY, settingsToSave);
    },
update(newSettings) {
      Object.assign(SETTINGS, newSettings);
      const currentStored = GM_getValue(this.STORAGE_KEY, {});
      const mergedToSave = Object.assign({}, currentStored, newSettings);
      this.save(mergedToSave);
      window.dispatchEvent(new CustomEvent("qmx-settings-update", { detail: newSettings }));
    },
reset() {
      GM_deleteValue(this.STORAGE_KEY);
      GM_deleteValue("douyu_qmx_theme");
    }
  };
  const SETTINGS = SettingsManager.get();
  SETTINGS.THEME = GM_getValue("douyu_qmx_theme", SETTINGS.DEFAULT_THEME);
  const STATE = {
    isSwitchingRoom: false,
    lastActionTime: 0
  };
  const Utils = {
log(message) {
      const logMsg = `${SETTINGS.SCRIPT_PREFIX} ${message}`;
      try {
        GM_log(logMsg);
      } catch (e) {
        console.log(e);
        console.log(logMsg);
      }
    },
sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
getRandomDelay(min = SETTINGS.MIN_DELAY, max = SETTINGS.MAX_DELAY) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
getCurrentRoomId() {
      const url = window.location.href;
      let match = url.match(/douyu\.com\/(?:beta\/)?(\d+)/);
      if (match && match[1]) {
        return match[1];
      }
      match = url.match(/rid=(\d+)/);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    },
formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const paddedMinutes = String(minutes).padStart(2, "0");
      const paddedSeconds = String(seconds).padStart(2, "0");
      return `${paddedMinutes}:${paddedSeconds}`;
    },
getBeijingTime() {
      const now = new Date();
      const utcMillis = now.getTime();
      const beijingMillis = utcMillis + 8 * 60 * 60 * 1e3;
      return new Date(beijingMillis);
    },
formatDateAsBeijing(date) {
      const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1e3);
      const year = beijingDate.getUTCFullYear();
      const month = String(beijingDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(beijingDate.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
lockChecker: function(lockKey, callback, ...args) {
      if (GM_getValue(lockKey, false)) {
        setTimeout(() => callback(...args), 50);
        return false;
      }
      return true;
    },
setLocalValueWithLock: function(lockKey, storageKey, value, nickname) {
      try {
        GM_setValue(lockKey, true);
        GM_setValue(storageKey, value);
      } catch (e) {
        Utils.log(`[${nickname}-写] 严重错误：GM_setValue 写入失败！ 错误信息: ${e.message}`);
      } finally {
        GM_setValue(lockKey, false);
      }
    },
debounce(func, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },
throttle(func, delay) {
      let lastCall = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          return func.apply(this, args);
        }
      };
    },
isInLiveRoom() {
      const roomId = this.getCurrentRoomId();
      return roomId !== null && document.querySelector("[data-v-5aa519d2]");
    },
getElementPosition(element) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
      };
    },
safeExecute(func, context = "unknown") {
      try {
        return func();
      } catch (error) {
        this.log(`执行函数时出错 [${context}]: ${error.message}`, "error");
        return null;
      }
    },
generateId(prefix = "dda") {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
deepClone(obj) {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof Array) {
        return obj.map((item) => this.deepClone(item));
      }
      if (typeof obj === "object") {
        const cloned = {};
        for (const key in obj) {
          if (Object.hasOwn(obj, key)) {
            cloned[key] = this.deepClone(obj[key]);
          }
        }
        return cloned;
      }
    },
getElementWithRetry: async function(selector, parentNode = document, retries = 5, interval = 1e3) {
      let element = parentNode.querySelector(selector);
      if (element) {
        return element;
      }
      for (let i = 0; i < retries; i++) {
        await Utils.sleep(interval);
        element = parentNode.querySelector(selector);
        if (element) {
          return element;
        }
      }
      throw new Error(`无法找到元素: ${selector}，已重试 ${retries} 次`);
    }
  };
  function initHackTimer(workerScript) {
    try {
      var blob = new Blob([
        "                var fakeIdToId = {};                onmessage = function (event) {                    var data = event.data,                        name = data.name,                        fakeId = data.fakeId,                        time;                    if(data.hasOwnProperty('time')) {                        time = data.time;                    }                    switch (name) {                        case 'setInterval':                            fakeIdToId[fakeId] = setInterval(function () {                                postMessage({fakeId: fakeId});                            }, time);                            break;                        case 'clearInterval':                            if (fakeIdToId.hasOwnProperty (fakeId)) {                                clearInterval(fakeIdToId[fakeId]);                                delete fakeIdToId[fakeId];                            }                            break;                        case 'setTimeout':                            fakeIdToId[fakeId] = setTimeout(function () {                                postMessage({fakeId: fakeId});                                if (fakeIdToId.hasOwnProperty (fakeId)) {                                    delete fakeIdToId[fakeId];                                }                            }, time);                            break;                        case 'clearTimeout':                            if (fakeIdToId.hasOwnProperty (fakeId)) {                                clearTimeout(fakeIdToId[fakeId]);                                delete fakeIdToId[fakeId];                            }                            break;                    }                }                "
      ]);
      workerScript = window.URL.createObjectURL(blob);
    } catch (error) {
      Utils.log(error);
    }
    var worker, fakeIdToCallback = {}, lastFakeId = 0, maxFakeId = 2147483647, logPrefix = "HackTimer.js by turuslan: ";
    if (typeof Worker !== "undefined") {
      let getFakeId = function() {
        do {
          if (lastFakeId == maxFakeId) {
            lastFakeId = 0;
          } else {
            lastFakeId++;
          }
        } while (Object.hasOwn(fakeIdToCallback, lastFakeId));
        return lastFakeId;
      };
      try {
        worker = new Worker(workerScript);
        window.setInterval = function(callback, time) {
          var fakeId = getFakeId();
          fakeIdToCallback[fakeId] = {
            callback,
            parameters: Array.prototype.slice.call(arguments, 2)
          };
          worker.postMessage({
            name: "setInterval",
            fakeId,
            time
          });
          return fakeId;
        };
        window.clearInterval = function(fakeId) {
          if (Object.hasOwn(fakeIdToCallback, fakeId)) {
            delete fakeIdToCallback[fakeId];
            worker.postMessage({
              name: "clearInterval",
              fakeId
            });
          }
        };
        window.setTimeout = function(callback, time) {
          var fakeId = getFakeId();
          fakeIdToCallback[fakeId] = {
            callback,
            parameters: Array.prototype.slice.call(arguments, 2),
            isTimeout: true
          };
          worker.postMessage({
            name: "setTimeout",
            fakeId,
            time
          });
          return fakeId;
        };
        window.clearTimeout = function(fakeId) {
          if (Object.hasOwn(fakeIdToCallback, fakeId)) {
            delete fakeIdToCallback[fakeId];
            worker.postMessage({
              name: "clearTimeout",
              fakeId
            });
          }
        };
        worker.onmessage = function(event) {
          var data = event.data, fakeId = data.fakeId, request, parameters, callback;
          if (Object.hasOwn(fakeIdToCallback, fakeId)) {
            request = fakeIdToCallback[fakeId];
            callback = request.callback;
            parameters = request.parameters;
            if (Object.hasOwn(request, "isTimeout") && request.isTimeout) {
              delete fakeIdToCallback[fakeId];
            }
          }
          if (typeof callback === "string") {
            try {
              callback = new Function(callback);
            } catch (error) {
              console.log(logPrefix + "Error parsing callback code string: ", error);
            }
          }
          if (typeof callback === "function") {
            callback.apply(window, parameters);
          }
        };
        worker.onerror = function(event) {
          console.log(event);
        };
        console.log(logPrefix + "Initialisation succeeded");
      } catch (error) {
        console.log(logPrefix + "Initialisation failed");
        console.error(error);
      }
    } else {
      console.log(logPrefix + "Initialisation failed - HTML5 Web Worker is not supported");
    }
  }
  const ControlPanelRefactoredCss = ':root{color-scheme:light dark;--motion-easing: cubic-bezier(.4, 0, .2, 1);--status-color-waiting: #4CAF50;--status-color-claiming: #2196F3;--status-color-switching: #FFC107;--status-color-error: #F44336;--status-color-opening: #9C27B0;--status-color-dormant: #757575;--status-color-unresponsive: #FFA000;--status-color-disconnected: #BDBDBD;--status-color-stalled: #9af39dff}body[data-theme=dark]{--md-sys-color-primary: #D0BCFF;--md-sys-color-on-primary: #381E72;--md-sys-color-primary-container: #4F378B;--md-sys-color-on-primary-container: #EADDFF;--md-sys-color-surface-container: #211F26;--md-sys-color-on-surface: #E6E1E5;--md-sys-color-on-surface-variant: #CAC4D0;--md-sys-color-outline: #938F99;--md-sys-color-surface-bright: #36343B;--md-sys-color-tertiary: #EFB8C8;--md-sys-color-scrim: #000000;--surface-container-highest: #3D3B42}body[data-theme=light]{--md-sys-color-primary: #6750A4;--md-sys-color-on-primary: #FFFFFF;--md-sys-color-primary-container: #EADDFF;--md-sys-color-on-primary-container: #21005D;--md-sys-color-surface-container: #F3EDF7;--md-sys-color-surface-bright: #FEF7FF;--md-sys-color-on-surface: #1C1B1F;--md-sys-color-on-surface-variant: #49454F;--md-sys-color-outline: #79747E;--md-sys-color-tertiary: #7D5260;--md-sys-color-scrim: #000000;--surface-container-highest: #E6E0E9}.qmx-hidden{display:none!important}.qmx-modal-open-scroll-lock{overflow:hidden!important}.is-dragging{transition:none!important}.qmx-flex-center{display:flex;align-items:center;justify-content:center}.qmx-flex-between{display:flex;align-items:center;justify-content:space-between}.qmx-flex-column{display:flex;flex-direction:column}.qmx-modal-base{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);z-index:10001;background-color:var(--md-sys-color-surface-bright);color:var(--md-sys-color-on-surface);border-radius:28px;box-shadow:0 12px 32px #00000080;display:flex;flex-direction:column;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s,transform .3s}.qmx-modal-base.visible{opacity:1;visibility:visible;transform:translate(-50%,-50%) scale(1)}.qmx-backdrop{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:var(--md-sys-color-scrim);z-index:9998;opacity:0;visibility:hidden;transition:opacity .3s ease}.qmx-backdrop.visible{opacity:.5;visibility:visible}.qmx-btn{padding:10px 16px;border:1px solid var(--md-sys-color-outline);background-color:transparent;color:var(--md-sys-color-primary);border-radius:20px;font-size:14px;font-weight:500;cursor:pointer;transition:background-color .2s,transform .2s,box-shadow .2s;-webkit-user-select:none;user-select:none}.qmx-btn:hover{background-color:#d0bcff1a;transform:translateY(-2px);box-shadow:0 2px 4px #0000001a}.qmx-btn:active{transform:translateY(0) scale(.98);box-shadow:none}.qmx-btn:disabled{opacity:.5;cursor:not-allowed}.qmx-btn--primary{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);border:none}.qmx-btn--primary:hover{background-color:#c2b3ff;box-shadow:0 4px 8px #0003}.qmx-btn--danger{border-color:#f44336;color:#f44336}.qmx-btn--danger:hover{background-color:#f443361a}.qmx-btn--icon{width:36px;height:36px;padding:0;border-radius:50%;background-color:#d0bcff26;border:none;color:var(--md-sys-color-primary)}.qmx-btn--icon:hover{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);transform:scale(1.05) rotate(180deg)}.qmx-styled-list{list-style:none;padding-left:0}.qmx-styled-list li{position:relative;padding-left:20px;margin-bottom:8px}.qmx-styled-list li:before{content:"◆";position:absolute;left:0;top:2px;color:var(--md-sys-color-primary);font-size:12px}.qmx-scrollbar::-webkit-scrollbar{width:10px}.qmx-scrollbar::-webkit-scrollbar-track{background:var(--md-sys-color-surface-bright);border-radius:10px}.qmx-scrollbar::-webkit-scrollbar-thumb{background-color:var(--md-sys-color-primary);border-radius:10px;border:2px solid var(--md-sys-color-surface-bright)}.qmx-scrollbar::-webkit-scrollbar-thumb:hover{background-color:#e0d1ff}.qmx-input{background-color:var(--md-sys-color-surface-container);border:1px solid var(--md-sys-color-outline);color:var(--md-sys-color-on-surface);border-radius:8px;padding:12px;width:100%;box-sizing:border-box;transition:box-shadow .2s,border-color .2s}.qmx-input:hover{border-color:var(--md-sys-color-primary)}.qmx-input:focus{outline:none;border-color:var(--md-sys-color-primary);box-shadow:0 0 0 2px #d0bcff4d}.qmx-input[type=number]::-webkit-inner-spin-button,.qmx-input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.qmx-input[type=number]{margin-left:5px;margin-bottom:9px;-moz-appearance:textfield;appearance:textfield}.qmx-fieldset-unit{position:relative;padding:0;margin:0;border:1px solid var(--md-sys-color-outline);border-radius:8px;background-color:var(--md-sys-color-surface-container);transition:border-color .2s,box-shadow .2s;width:100%;box-sizing:border-box}.qmx-fieldset-unit:hover{border-color:var(--md-sys-color-primary)}.qmx-fieldset-unit:focus-within{border-color:var(--md-sys-color-primary);box-shadow:0 0 0 2px #d0bcff4d}.qmx-fieldset-unit input[type=number]{border:none;background:none;outline:none;box-shadow:none;color:var(--md-sys-color-on-surface);padding:3px 10px 4px;width:100%;box-sizing:border-box}.qmx-fieldset-unit legend{padding:0 6px;font-size:12px;color:var(--md-sys-color-on-surface-variant);margin-left:auto;margin-right:12px;text-align:right;pointer-events:none}.qmx-toggle{position:relative;display:inline-block;width:52px;height:30px}.qmx-toggle input{opacity:0;width:0;height:0}.qmx-toggle .slider{position:absolute;cursor:pointer;inset:0;background-color:var(--md-sys-color-surface-container);border:1px solid var(--md-sys-color-outline);border-radius:30px;transition:background-color .3s,border-color .3s}.qmx-toggle .slider:before{position:absolute;content:"";height:22px;width:22px;left:3px;bottom:3px;background-color:var(--md-sys-color-on-surface-variant);border-radius:50%;box-shadow:0 1px 3px #0003;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.qmx-toggle input:checked+.slider{background-color:var(--md-sys-color-primary);border-color:var(--md-sys-color-primary)}.qmx-toggle input:checked+.slider:before{background-color:var(--md-sys-color-on-primary);transform:translate(22px)}.qmx-toggle:hover .slider{border-color:var(--md-sys-color-primary)}.qmx-select{position:relative;width:100%}.qmx-select-styled{position:relative;padding:10px 30px 10px 12px;background-color:var(--md-sys-color-surface-container);border:1px solid var(--md-sys-color-outline);border-radius:8px;cursor:pointer;transition:all .2s;-webkit-user-select:none;user-select:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:inset 0 2px 4px #00000014}.qmx-select-styled:after{content:"";position:absolute;top:50%;right:12px;transform:translateY(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid var(--md-sys-color-on-surface-variant);transition:transform .3s ease}.qmx-select:hover .qmx-select-styled{border-color:var(--md-sys-color-primary)}.qmx-select.active .qmx-select-styled{border-color:var(--md-sys-color-primary);box-shadow:inset 0 3px 6px #0000001a,0 0 0 2px #d0bcff4d}.qmx-select.active .qmx-select-styled:after{transform:translateY(-50%) rotate(180deg)}.qmx-select-options{position:absolute;top:105%;left:0;right:0;z-index:10;background-color:var(--md-sys-color-surface-bright);border:1px solid var(--md-sys-color-outline);border-radius:8px;max-height:0;overflow:hidden;opacity:0;transform:translateY(-10px);transition:all .3s ease;padding:4px 0}.qmx-select.active .qmx-select-options{max-height:200px;opacity:1;transform:translateY(0)}.qmx-select-options div{padding:10px 12px;cursor:pointer;transition:background-color .2s}.qmx-select-options div:hover{background-color:#d0bcff1a}.qmx-select-options div.selected{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);font-weight:500}.qmx-range-slider-wrapper{display:flex;flex-direction:column;gap:8px}.qmx-range-slider-container{position:relative;height:24px;display:flex;align-items:center}.qmx-range-slider-container input[type=range]{position:absolute;width:100%;height:4px;-webkit-appearance:none;appearance:none;background:none;pointer-events:none;margin:0}.qmx-range-slider-container input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;pointer-events:auto;width:20px;height:20px;background-color:var(--md-sys-color-primary);border-radius:50%;cursor:grab;border:none;box-shadow:0 1px 3px #0000004d;transition:transform .2s}.qmx-range-slider-container input[type=range]::-webkit-slider-thumb:active{cursor:grabbing;transform:scale(1.1)}.qmx-range-slider-container input[type=range]::-moz-range-thumb{pointer-events:auto;width:20px;height:20px;background-color:var(--md-sys-color-primary);border-radius:50%;cursor:grab;border:none;box-shadow:0 1px 3px #0000004d;transition:transform .2s}.qmx-range-slider-container input[type=range]::-moz-range-thumb:active{cursor:grabbing;transform:scale(1.1)}.qmx-range-slider-track-container{position:absolute;width:100%;height:4px;background-color:var(--md-sys-color-surface-container);border-radius:2px}.qmx-range-slider-progress{position:absolute;height:100%;background-color:var(--md-sys-color-primary);border-radius:2px}.qmx-range-slider-values{font-size:14px;color:var(--md-sys-color-primary);text-align:center;font-weight:500}.qmx-tooltip-icon{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background-color:var(--md-sys-color-outline);color:var(--md-sys-color-surface-container);font-size:12px;font-weight:700;cursor:help;-webkit-user-select:none;user-select:none}#qmx-global-tooltip{position:fixed;background-color:var(--surface-container-highest);color:var(--md-sys-color-on-surface);padding:8px 12px;border-radius:8px;box-shadow:0 4px 12px #0003;font-size:12px;font-weight:400;line-height:1.5;z-index:10002;max-width:250px;opacity:0;visibility:hidden;transform:translateY(-5px);transition:opacity .2s ease,transform .2s ease,visibility .2s;pointer-events:none}#qmx-global-tooltip.visible{opacity:1;visibility:visible;transform:translateY(0)}.theme-switch{position:relative;display:block;width:60px;height:34px;cursor:pointer;transition:none}.theme-switch input{opacity:0;width:0;height:0}.theme-switch-wrapper{align-self:center}.slider-track{position:absolute;top:0;left:0;width:34px;height:34px;background-color:var(--surface-container-highest);border-radius:17px;box-shadow:inset 2px 2px 4px #0003,inset -2px -2px 4px #ffffff0d;transition:width .3s ease,left .3s ease,border-radius .3s ease,box-shadow .3s ease}.theme-switch:hover .slider-track{width:60px}.theme-switch input:checked+.slider-track{left:26px}.theme-switch:hover input:checked+.slider-track{left:0}.slider-dot{position:absolute;height:26px;width:26px;left:4px;top:4px;background-color:var(--md-sys-color-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 8px #0000004d;transition:transform .3s cubic-bezier(.4,0,.2,1),background-color .3s ease,box-shadow .3s ease}.theme-switch input:checked~.slider-dot{transform:translate(26px);background-color:var(--primary-container)}.slider-dot .icon{position:absolute;width:20px;height:20px;color:var(--md-sys-color-on-primary);transition:opacity .3s ease,transform .3s cubic-bezier(.4,0,.2,1)}.sun{opacity:1;transform:translateY(0) rotate(0)}.moon{opacity:0;transform:translateY(20px) rotate(-45deg)}.theme-switch input:checked~.slider-dot .sun{opacity:0;transform:translateY(-20px) rotate(45deg)}.theme-switch input:checked~.slider-dot .moon{opacity:1;transform:translateY(0) rotate(0);color:var(--md-sys-color-on-surface)}#douyu-qmx-starter-button{position:fixed;top:0;left:0;z-index:10000;background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);border:none;width:56px;height:56px;border-radius:16px;cursor:grab;box-shadow:0 4px 8px #0000004d;display:flex;align-items:center;justify-content:center;transform:translate3d(var(--tx, 0px),var(--ty, 0px),0) scale(1);transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .3s cubic-bezier(.4,0,.2,1);will-change:transform,opacity}#douyu-qmx-starter-button .icon{font-size:28px}#douyu-qmx-starter-button.hidden{opacity:0;transform:translate3d(var(--tx, 0px),var(--ty, 0px),0) scale(.5);pointer-events:none}#qmx-modal-container{background-color:var(--md-sys-color-surface-container);color:var(--md-sys-color-on-surface);display:flex;flex-direction:column}#qmx-modal-container.mode-floating,#qmx-modal-container.mode-centered{position:fixed;z-index:9999;width:335px;max-width:90vw;max-height:80vh;border-radius:28px;box-shadow:0 8px 24px #0006;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s,transform .2s ease-out;will-change:transform,opacity}#qmx-modal-container.visible{opacity:1;visibility:visible}#qmx-modal-container.mode-floating{top:0;left:0;transform:translate3d(var(--tx, 0px),var(--ty, 0px),0)}#qmx-modal-container.mode-floating .qmx-modal-header{cursor:move}#qmx-modal-container.mode-centered{top:50%;left:50%;transform:translate(-50%,-50%)}#qmx-modal-container.mode-inject-rank-list{position:relative;width:100%;flex:1;min-height:0;box-shadow:none;border-radius:0;transform:none!important}.qmx-modal-header{position:relative;padding:10px 20px 4px;font-size:20px;font-weight:400;color:var(--md-sys-color-on-surface);-webkit-user-select:none;user-select:none;display:flex;align-items:center;justify-content:space-between}.qmx-modal-close-icon{width:36px;height:36px;background-color:#d0bcff26;border:none;border-radius:50%;cursor:pointer;transition:background-color .2s,transform .2s;position:relative;flex-shrink:0}.qmx-modal-close-icon:hover{background-color:var(--md-sys-color-primary);transform:scale(1.05) rotate(180deg)}.qmx-modal-close-icon:before,.qmx-modal-close-icon:after{content:"";position:absolute;top:50%;left:50%;width:16px;height:2px;background-color:var(--md-sys-color-primary);transition:background-color .2s ease-in-out}.qmx-modal-close-icon:hover:before,.qmx-modal-close-icon:hover:after{background-color:var(--md-sys-color-on-primary)}.qmx-modal-close-icon:before{transform:translate(-50%,-50%) rotate(45deg)}.qmx-modal-close-icon:after{transform:translate(-50%,-50%) rotate(-45deg)}.qmx-modal-content{padding:0 24px;flex:1;min-height:0;display:flex;flex-direction:column}.qmx-modal-content h3{flex-shrink:0;font-size:16px;font-weight:500;color:var(--md-sys-color-on-surface-variant);margin:0 0 8px}.qmx-stats-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:4px 0;-webkit-user-select:none;user-select:none;transition:background-color .2s;border-radius:8px}.qmx-stats-header:hover{background-color:#ffffff0d}.qmx-stats-header h3{font-size:16px;font-weight:500;color:var(--md-sys-color-on-surface-variant);margin:8px 0}.qmx-stats-arrow{font-size:12px;color:var(--md-sys-color-on-surface-variant);transition:transform .3s ease}.qmx-stats-header.expanded .qmx-stats-arrow{transform:rotate(180deg)}.qmx-stats-container{position:relative;overflow:hidden;padding:0}.qmx-stats-toggle{position:relative;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-user-select:none;user-select:none;transition:all .3s cubic-bezier(.25,.46,.45,.94);margin:4px 24px;border-radius:10px}.qmx-stats-indicator{font-size:15px;color:var(--md-sys-color-on-surface-variant);transition:all .3s cubic-bezier(.25,.46,.45,.94);position:absolute;z-index:2}.qmx-stats-label{font-size:12px;color:var(--md-sys-color-on-surface-variant);opacity:0;transform:scale(.95);transition:all .3s cubic-bezier(.25,.46,.45,.94);position:absolute;z-index:1;white-space:nowrap}.qmx-stats-refresh{opacity:0;font-size:15px;transition:all .3s cubic-bezier(.25,.46,.45,.94);position:relative;background:transparent;border:none;color:var(--md-sys-color-on-surface-variant);padding:4px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer}.qmx-stats-refresh:hover{background-color:#ffffff1a;color:var(--md-sys-color-primary)}.qmx-stats-refresh svg{width:20px;height:20px}.qmx-stats-refresh.rotating{animation:rotate360 1s linear}@keyframes rotate360{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.qmx-stats-switcher{opacity:0;font-size:20px;transition:all .3s cubic-bezier(.25,.46,.45,.94);margin:8px 8px 12px}.qmx-stats-toggle:hover{background-color:#ffffff0d;margin:4px 24px 21px}.qmx-stats-toggle:hover .qmx-stats-indicator{transform:translateY(85%)}.qmx-stats-toggle:hover .qmx-stats-label{opacity:1;transform:scale(1)}.qmx-stats-toggle.expanded{height:28px;padding:0 12px;margin:6px 20px}.qmx-stats-toggle.expanded .qmx-stats-indicator{opacity:1;transform:rotate(180deg) scale(1.05);position:relative;margin:9px}.qmx-stats-toggle.expanded .qmx-stats-indicator.transitioning{opacity:0}.qmx-stats-toggle.expanded .qmx-stats-label{opacity:1;transform:scale(1.05);font-size:12px;font-weight:500;position:relative;transition:all .3s cubic-bezier(.25,.46,.45,.94);color:var(--md-sys-color-on-surface)}.qmx-stats-toggle.expanded .qmx-stats-label.transitioning{opacity:0}.qmx-stats-toggle.expanded .qmx-stats-refresh{opacity:1;cursor:pointer;transform:scale(1.05);margin:8px}.qmx-stats-toggle.expanded .qmx-stats-refresh.disabled{opacity:0;transform:translate(100%)}.qmx-stats-toggle.expanded .qmx-stats-switcher{cursor:pointer;opacity:1;position:absolute}.qmx-stats-toggle.expanded #qmx-stats-left{left:60px;transform:translate(-55px)}.qmx-stats-toggle.expanded #qmx-stats-right{right:60px;transform:translate(55px)}.qmx-stats-toggle.expanded .qmx-stats-switcher.disabled{cursor:not-allowed;color:#666}.qmx-stats-content{max-height:0;opacity:0;overflow:hidden;transition:max-height .3s cubic-bezier(.25,.46,.45,.94),opacity .2s cubic-bezier(.25,.46,.45,.94) .1s,padding .3s cubic-bezier(.25,.46,.45,.94);padding:0 24px}.qmx-stats-content.expanded{max-height:120px;opacity:1;padding:8px 24px 16px}.qmx-modal-stats{display:flex;gap:1px}.qmx-modal-stats-child{background-color:var(--md-sys-color-surface-bright);border-radius:12px;padding:12px 16px;margin-bottom:8px;display:flex;align-items:center;gap:8px;transition:background-color .2s,transform .3s ease,opacity .3s ease;width:88px;float:left;margin-left:2%}.qmx-stat-info-avg,.qmx-stat-info-total,.qmx-stat-info-receivedCount{display:flex;flex-direction:column;flex-grow:1;gap:4px;font-size:14px;overflow:hidden}.qmx-stat-header{display:flex;align-items:baseline;justify-content:center}.qmx-stat-nickname{font-weight:500;color:var(--md-sys-color-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:auto!important}.qmx-stat-details{opacity:1;display:flex;align-items:center;font-size:13px;color:var(--md-sys-color-on-surface-variant);transition:all .3s cubic-bezier(.25,.46,.45,.94);justify-content:center;flex-wrap:wrap}.qmx-stat-details.transitioning{opacity:0}.qmx-stat-stats{font-weight:500}#qmx-tab-list{overflow-y:auto;flex-grow:1;padding-right:4px;margin-right:-4px}.qmx-tab-list-item{background-color:var(--md-sys-color-surface-bright);border-radius:16px;padding:8px 16px 8px 18px;margin-bottom:8px;display:flex;align-items:center;gap:12px;transition:background-color .2s,transform .3s ease,opacity .3s ease;position:relative;overflow:hidden}.qmx-tab-list-item:hover{background-color:var(--surface-container-highest)}.qmx-item-enter{opacity:0;transform:translate(20px)}.qmx-item-enter-active{opacity:1;transform:translate(0)}.qmx-item-exit-active{position:absolute;opacity:0;transform:scale(.8);transition:all .3s ease;z-index:-1;pointer-events:none}.qmx-tab-status-dot{position:absolute;left:0;top:50%;transform:translateY(-50%);width:2px;height:28px;border-radius:0 4px 4px 0;transition:all .3s cubic-bezier(.25,.46,.45,.94);flex-shrink:0}.qmx-tab-list-item:hover .qmx-tab-status-dot{height:32px;width:3px}.qmx-tab-info{display:flex;flex-direction:column;flex-grow:1;gap:2px;font-size:14px;overflow:hidden;min-width:0}.qmx-tab-header{display:flex;align-items:center;justify-content:flex-start;height:auto;overflow:visible;margin-bottom:2px}.qmx-tab-identity{position:relative;display:inline-flex;align-items:center;gap:0;padding:2px 4px;border-radius:999px;border:1px solid var(--md-sys-color-on-surface-variant);background-color:var(--md-sys-color-surface-bright);color:var(--md-sys-color-on-surface);font-size:13px;font-weight:500;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,padding-left .2s ease;overflow:visible}.qmx-tab-identity:hover{padding-left:24px;border-color:var(--md-sys-color-primary);box-shadow:0 6px 16px #00000040}.qmx-tab-identity.copied{border-color:var(--status-color-waiting);box-shadow:0 0 0 2px #4caf5033}.qmx-tab-identity-icon{position:absolute;left:8px;top:50%;transform:translateY(-50%) translate(-100%);width:14px;height:14px;color:var(--md-sys-color-primary);opacity:0;transition:opacity .2s ease,transform .2s ease;pointer-events:none;z-index:10}.qmx-tab-identity:hover .qmx-tab-identity-icon{opacity:1;transform:translateY(-50%) translate(0);pointer-events:auto;cursor:pointer}.qmx-tab-identity-text{display:inline-flex;flex-direction:column;position:relative;overflow:hidden;pointer-events:none;min-width:0}.qmx-tab-identity-text span{transition:transform .25s ease,opacity .2s ease;white-space:nowrap;text-align:left}.qmx-tab-identity[data-state=nickname] .identity-roomid,.qmx-tab-identity[data-state=room] .identity-nickname{transform:translateY(-100%);opacity:0;position:absolute;left:0;top:0}.qmx-tab-identity[data-state=nickname] .identity-nickname,.qmx-tab-identity[data-state=room] .identity-roomid{position:relative;transform:translateY(0);opacity:1}.qmx-tab-details{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--md-sys-color-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qmx-tab-prizes{display:flex;align-items:center;gap:4px;margin-left:auto;padding:4px 8px;background-color:var(--md-sys-color-surface-container, rgba(0, 0, 0, .05));flex-shrink:0}.qmx-tab-prizes.single-prize{flex-direction:row;border-radius:100px}.qmx-tab-prizes.multi-prizes{flex-direction:column;border-radius:12px;min-width:70px;padding:6px 10px}.qmx-tab-prize-item{display:inline-flex;align-items:center;gap:4px;background:transparent;padding:0;border:none;line-height:1;color:var(--md-sys-color-on-surface);font-weight:500;font-size:11px}.qmx-tab-prize-item:hover{opacity:.8}.qmx-tab-prize-item svg{display:block;width:12px;height:12px;flex-shrink:0}.qmx-tab-prize-text{font-weight:600;white-space:nowrap;color:inherit;font-size:11px;display:flex;align-items:center}.qmx-tab-close-btn{flex-shrink:0;background-color:#d0bcff26;border:none;color:var(--md-sys-color-primary);cursor:pointer;padding:0;transition:background-color .2s,transform .2s,color .2s;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%}.qmx-tab-close-btn svg{width:14px;height:14px;stroke:currentColor;stroke-width:3}.qmx-tab-close-btn:hover{color:var(--md-sys-color-on-primary);background-color:var(--md-sys-color-primary);transform:scale(1.1) rotate(90deg)}.qmx-modal-footer{padding:16px 24px;display:flex;gap:8px}.qmx-modal-btn:hover{background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);transform:translateY(-2px);box-shadow:0 2px 4px #0000001a}.qmx-modal-btn.primary:hover{background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);box-shadow:0 4px 8px #0003}.qmx-modal-btn.danger{border-color:var(--status-color-error);color:var(--status-color-error)}.qmx-modal-btn.danger:hover{background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container)}.qmx-tab-header.show-id .qmx-tab-nickname{pointer-events:none!important}.qmx-tab-header.show-id .qmx-tab-room-id{pointer-events:auto!important}#qmx-settings-modal{width:500px;max-width:95vw}.qmx-settings-header{padding:12px 24px;border-bottom:1px solid var(--md-sys-color-outline);flex-shrink:0}.qmx-settings-tabs{display:flex;gap:8px}.qmx-settings-tabs .tab-link{padding:8px 16px;border:none;background:none;color:var(--md-sys-color-on-surface-variant);cursor:pointer;border-radius:8px;transition:background-color .2s,color .2s;font-size:14px}.qmx-settings-tabs .tab-link:hover{background-color:#ffffff0d}.qmx-settings-tabs .tab-link.active{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);font-weight:500}.qmx-settings-content{padding:16px 24px;flex-grow:1;overflow-y:auto;overflow-x:hidden;max-height:60vh;scrollbar-gutter:stable}.qmx-settings-content .tab-content{display:none}.qmx-settings-content .tab-content.active{display:block}.qmx-settings-footer{padding:16px 24px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--md-sys-color-outline);flex-shrink:0}.qmx-settings-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;align-items:start}.qmx-settings-item{display:flex;flex-direction:column;justify-content:center;gap:8px}.qmx-settings-item label{font-size:14px;font-weight:500;display:flex;align-items:center;gap:6px}.qmx-settings-item small{font-size:12px;color:var(--md-sys-color-on-surface-variant);opacity:.8}.qmx-settings-warning{padding:12px;background-color:#f4433633;border:1px solid #F44336;color:#efb8c8;border-radius:8px;grid-column:1 / -1}#tab-about{line-height:1.7;font-size:14px}#tab-about h4{color:var(--md-sys-color-primary);font-size:16px;font-weight:500;margin-top:20px;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid var(--md-sys-color-outline)}#tab-about h4:first-child{margin-top:0}#tab-about p{margin-bottom:10px;color:var(--md-sys-color-on-surface-variant)}#tab-about .version-tag{display:inline-block;background-color:var(--md-sys-color-tertiary);color:var(--md-sys-color-on-primary);padding:2px 8px;border-radius:12px;font-size:13px;font-weight:500;margin-left:8px}#tab-about a{color:var(--md-sys-color-tertiary);text-decoration:none;font-weight:500;transition:color .2s}#tab-about a:hover{color:#ffd6e1;text-decoration:underline}#qmx-notice-modal{width:450px;max-width:90vw}#qmx-notice-modal .qmx-modal-content{padding:16px 24px}#qmx-notice-modal .qmx-modal-content p{margin-bottom:12px;line-height:1.6;font-size:15px;color:var(--md-sys-color-on-surface-variant)}#qmx-notice-modal .qmx-modal-content ul{margin:12px 0;padding-left:20px}#qmx-notice-modal .qmx-modal-content li{margin-bottom:10px;position:relative;font-size:15px;line-height:1.6}#qmx-notice-modal .qmx-modal-content li:before{content:"◆";position:absolute;left:-18px;color:var(--md-sys-color-primary);font-size:12px}#qmx-notice-modal h3{font-size:20px;font-weight:500;margin:0}#qmx-notice-modal h4{color:var(--md-sys-color-primary);font-size:16px;font-weight:500;margin-top:16px;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--md-sys-color-outline)}#qmx-notice-modal .qmx-warning-text{background-color:#ffc1071a;border-left:4px solid #FFC107;padding:12px 16px;margin:16px 0;border-radius:4px;font-size:15px;line-height:1.6}#qmx-notice-modal .qmx-warning-text strong{color:#ff8f00}#qmx-notice-modal a{color:var(--md-sys-color-tertiary);text-decoration:none;font-weight:500;transition:color .2s}#qmx-notice-modal a:hover{color:#ffd6e1;text-decoration:underline}#qmx-modal-backdrop,#qmx-notice-backdrop{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:var(--md-sys-color-scrim);z-index:9998;opacity:0;visibility:hidden;transition:opacity .3s ease}#qmx-modal-backdrop.visible,#qmx-notice-backdrop.visible{opacity:.5;visibility:visible}#qmx-settings-modal,#qmx-notice-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);z-index:10001;background-color:var(--md-sys-color-surface-bright);color:var(--md-sys-color-on-surface);border-radius:28px;box-shadow:0 12px 32px #00000080;display:flex;flex-direction:column;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s,transform .3s}#qmx-settings-modal.visible,#qmx-notice-modal.visible{opacity:1;visibility:visible;transform:translate(-50%,-50%) scale(1)}.qmx-modal-btn{flex-grow:1;padding:10px 16px;border:1px solid var(--md-sys-color-outline);background-color:transparent;color:var(--md-sys-color-primary);border-radius:20px;font-size:14px;font-weight:500;cursor:pointer;transition:background-color .2s,transform .2s,box-shadow .2s;-webkit-user-select:none;user-select:none}.qmx-modal-btn:hover{background-color:#d0bcff1a;transform:translateY(-2px);box-shadow:0 2px 4px #0000001a}.qmx-modal-btn:active{transform:translateY(0) scale(.98);box-shadow:none}.qmx-modal-btn:disabled{opacity:.5;cursor:not-allowed}.qmx-modal-btn.primary{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);border:none}.qmx-modal-btn.primary:hover{background-color:#c2b3ff;box-shadow:0 4px 8px #0003}.qmx-modal-btn.danger{border-color:#f44336;color:#f44336}.qmx-modal-btn.danger:hover{background-color:#f443361a}.qmx-modal-content::-webkit-scrollbar,.qmx-settings-content::-webkit-scrollbar{width:10px}.qmx-modal-content::-webkit-scrollbar-track,.qmx-settings-content::-webkit-scrollbar-track{background:var(--md-sys-color-surface-bright);border-radius:10px}.qmx-modal-content::-webkit-scrollbar-thumb,.qmx-settings-content::-webkit-scrollbar-thumb{background-color:var(--md-sys-color-primary);border-radius:10px;border:2px solid var(--md-sys-color-surface-bright)}.qmx-modal-content::-webkit-scrollbar-thumb:hover,.qmx-settings-content::-webkit-scrollbar-thumb:hover{background-color:#e0d1ff}';
  importCSS(ControlPanelRefactoredCss);
  const statsPanelTemplate = `
    <div class="qmx-stats-container">
        <div class="qmx-stats-toggle" id="qmx-stats-toggle">
            <button id="qmx-stats-left" class="qmx-stats-switcher"><</button>
            <span class="qmx-stats-indicator">▼</span>
            <span class="qmx-stats-label">今日统计</span>
            <button class="qmx-stats-refresh">
                <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
            </button>
            <button id="qmx-stats-right" class="qmx-stats-switcher">></button>
        </div>
        <div class="qmx-stats-content" id="qmx-stats-content">
            <div class="qmx-modal-stats" id="qmx-stats-panel"></div>
        </div>
    </div>
`;
  const mainPanelTemplate = (maxTabs) => `
    <div class="qmx-modal-header">
        <span>控制中心</span>
        <button id="qmx-modal-close-btn" class="qmx-modal-close-icon" title="关闭"></button>
    </div>
    ${statsPanelTemplate}
    <div class="qmx-modal-content">
        <h3>监控面板 (<span id="qmx-active-tabs-count">0</span>/${maxTabs})</h3>
        <div id="qmx-tab-list"></div>
    </div>
    <div class="qmx-modal-footer">
        <button id="qmx-modal-settings-btn" class="qmx-modal-btn">设置</button>
        <button id="qmx-modal-close-all-btn" class="qmx-modal-btn danger">关闭所有</button>
        <button id="qmx-modal-open-btn" class="qmx-modal-btn primary">打开新房间</button>
    </div>
`;
  const createUnitInput = (id, label, settingsMeta) => {
    const meta = settingsMeta[id];
    return `
                <div class="qmx-settings-item">
                    <label for="${id}">
                        ${label}
                        <span class="qmx-tooltip-icon" data-tooltip-key="${id.replace("setting-", "")}">?</span>
                    </label>
                    <fieldset class="qmx-fieldset-unit">
                        <legend>${meta.unit}</legend>
                        <input type="number" class="qmx-input" id="${id}" value="${meta.value}">
                    </fieldset>
                </div>
            `;
  };
  const settingsPanelTemplate = (SETTINGS2) => {
    const settingsMeta = {
      "setting-initial-script-delay": { value: SETTINGS2.INITIAL_SCRIPT_DELAY / 1e3, unit: "秒" },
      "setting-auto-pause-delay": { value: SETTINGS2.AUTO_PAUSE_DELAY_AFTER_ACTION / 1e3, unit: "秒" },
      "setting-unresponsive-timeout": { value: SETTINGS2.UNRESPONSIVE_TIMEOUT / 6e4, unit: "分钟" },
      "setting-red-envelope-timeout": { value: SETTINGS2.RED_ENVELOPE_LOAD_TIMEOUT / 1e3, unit: "秒" },
      "setting-popup-wait-timeout": { value: SETTINGS2.POPUP_WAIT_TIMEOUT / 1e3, unit: "秒" },
      "setting-worker-loading-timeout": { value: SETTINGS2.ELEMENT_WAIT_TIMEOUT / 1e3, unit: "秒" },
      "setting-close-tab-delay": { value: SETTINGS2.CLOSE_TAB_DELAY / 1e3, unit: "秒" },
      "setting-api-retry-delay": { value: SETTINGS2.API_RETRY_DELAY / 1e3, unit: "秒" },
      "setting-switching-cleanup-timeout": { value: SETTINGS2.SWITCHING_CLEANUP_TIMEOUT / 1e3, unit: "秒" },
      "setting-healthcheck-interval": { value: SETTINGS2.HEALTHCHECK_INTERVAL / 1e3, unit: "秒" },
      "setting-disconnected-grace-period": { value: SETTINGS2.DISCONNECTED_GRACE_PERIOD / 1e3, unit: "秒" },
      "setting-stats-update-interval": { value: SETTINGS2.STATS_UPDATE_INTERVAL / 1e3, unit: "秒" }
    };
    return `
        <div class="qmx-settings-header">
            <div class="qmx-settings-tabs">
                <button class="tab-link active" data-tab="basic">基本设置</button>
                <button class="tab-link" data-tab="perf">性能与延迟</button>
                <button class="tab-link" data-tab="advanced">高级设置</button>
                ${""}
                <button class="tab-link" data-tab="about">关于</button>
                <!-- 主题模式切换开关 -->
                <div class="qmx-settings-item">
                    <div class="theme-switch-wrapper">
                        <label class="theme-switch">
                            <input type="checkbox" id="setting-theme-mode" ${SETTINGS2.THEME === "dark" ? "checked" : ""}>

                            <!-- 1. 背景轨道：只负责展开和收缩的动画 -->
                            <span class="slider-track"></span>

                            <!-- 2. 滑块圆点：只负责左右移动和图标切换 -->
                            <span class="slider-dot">
                                <span class="icon sun">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                </span>
                                <span class="icon moon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.51 1.713-6.636 4.398-8.552a.75.75 0 01.818.162z" clip-rule="evenodd"></path></svg>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="qmx-settings-content">
            <!-- ==================== Tab 1: 基本设置 ==================== -->
            <div id="tab-basic" class="tab-content active">
                <div class="qmx-settings-grid">
                    <div class="qmx-settings-item">
                        <label for="setting-control-room-id">控制室房间号 <span class="qmx-tooltip-icon" data-tooltip-key="control-room">?</span></label>
                        <input type="number" class="qmx-input" id="setting-control-room-id" value="${SETTINGS2.CONTROL_ROOM_ID}">
                    </div>
                    <!-- 新增：第二房间号设置 -->
                    <div class="qmx-settings-item">
                        <label for="setting-temp-control-room-id">第二房间号(RID) <span class="qmx-tooltip-icon" data-tooltip-key="temp-control-room">?</span></label>
                        <input type="number" class="qmx-input" id="setting-temp-control-room-id" value="${SETTINGS2.TEMP_CONTROL_ROOM_RID}">
                    </div>
                    <div class="qmx-settings-item">
                        <label>自动暂停后台视频 <span class="qmx-tooltip-icon" data-tooltip-key="auto-pause">?</span></label>
                        <label class="qmx-toggle">
                            <input type="checkbox" id="setting-auto-pause" ${SETTINGS2.AUTO_PAUSE_ENABLED ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="qmx-settings-item">
                        <label>展示数据统计 <span class="qmx-tooltip-icon" data-tooltip-key="stats-info">?</span></label>
                        <label class="qmx-toggle">
                            <input type="checkbox" id="setting-stats-info" ${SETTINGS2.SHOW_STATS_IN_PANEL ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="qmx-settings-item">
                        <label>启用校准模式 <span class="qmx-tooltip-icon" data-tooltip-key="calibration-mode">?</span></label>
                        <label class="qmx-toggle">
                            <input type="checkbox" id="setting-calibration-mode" ${SETTINGS2.CALIBRATION_MODE_ENABLED ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    ${""}
                    <div class="qmx-settings-item">
                        <label>达到上限后的行为</label>
                        <div class="qmx-select" data-target-id="setting-daily-limit-action">
                            <div class="qmx-select-styled"></div>
                            <div class="qmx-select-options"></div>
                            <select id="setting-daily-limit-action" style="display: none;">
                                <option value="STOP_ALL" ${SETTINGS2.DAILY_LIMIT_ACTION === "STOP_ALL" ? "selected" : ""}>直接关停所有任务</option>
                                <option value="CONTINUE_DORMANT" ${SETTINGS2.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT" ? "selected" : ""}>进入休眠模式，等待刷新</option>
                            </select>
                        </div>
                    </div>
                    <div class="qmx-settings-item">
                        <label>控制中心显示模式</label>
                        <div class="qmx-select" data-target-id="setting-modal-mode">
                            <div class="qmx-select-styled"></div>
                            <div class="qmx-select-options"></div>
                            <select id="setting-modal-mode" style="display: none;">
                                <option value="floating" ${SETTINGS2.MODAL_DISPLAY_MODE === "floating" ? "selected" : ""}>浮动窗口</option>
                                <option value="centered" ${SETTINGS2.MODAL_DISPLAY_MODE === "centered" ? "selected" : ""}>屏幕居中</option>
                                <option value="inject-rank-list" ${SETTINGS2.MODAL_DISPLAY_MODE === "inject-rank-list" ? "selected" : ""}>替换排行榜显示</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==================== Tab 2: 性能与延迟 ==================== -->
            <div id="tab-perf" class="tab-content">
                <div class="qmx-settings-grid">
                    ${createUnitInput("setting-initial-script-delay", "脚本初始启动延迟", settingsMeta)}
                    ${createUnitInput("setting-auto-pause-delay", "领取后暂停延迟", settingsMeta)}
                    ${createUnitInput("setting-unresponsive-timeout", "工作页失联超时", settingsMeta)}
                    ${createUnitInput("setting-red-envelope-timeout", "红包活动加载超时", settingsMeta)}
                    ${createUnitInput("setting-popup-wait-timeout", "红包弹窗等待超时", settingsMeta)}
                    ${createUnitInput("setting-worker-loading-timeout", "播放器加载超时", settingsMeta)}
                    ${createUnitInput("setting-close-tab-delay", "关闭标签页延迟", settingsMeta)}
                    ${createUnitInput("setting-switching-cleanup-timeout", "切换中状态兜底超时", settingsMeta)}
                    ${createUnitInput("setting-healthcheck-interval", "哨兵健康检查间隔", settingsMeta)}
                    ${createUnitInput("setting-disconnected-grace-period", "断开连接清理延迟", settingsMeta)}
                    ${createUnitInput("setting-api-retry-delay", "API重试延迟", settingsMeta)}
                    ${createUnitInput("setting-stats-update-interval", "统计信息更新间隔", settingsMeta)}
                    
                    <div class="qmx-settings-item" style="grid-column: 1 / -1;">
                        <label>模拟操作延迟范围 (秒) <span class="qmx-tooltip-icon" data-tooltip-key="range-delay">?</span></label>
                        <div class="qmx-range-slider-wrapper">
                            <div class="qmx-range-slider-container">
                                <div class="qmx-range-slider-track-container"><div class="qmx-range-slider-progress"></div></div>
                                <input type="range" id="setting-min-delay" min="0.1" max="5" step="0.1" value="${SETTINGS2.MIN_DELAY / 1e3}">
                                <input type="range" id="setting-max-delay" min="0.1" max="5" step="0.1" value="${SETTINGS2.MAX_DELAY / 1e3}">
                            </div>
                            <div class="qmx-range-slider-values"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==================== Tab 3: 高级设置 ==================== -->
            <div id="tab-advanced" class="tab-content">
                <div class="qmx-settings-grid">
                    <div class="qmx-settings-item">
                        <label for="setting-max-tabs">最大工作标签页数量 <span class="qmx-tooltip-icon" data-tooltip-key="max-worker-tabs">?</span></label>
                        <input type="number" class="qmx-input" id="setting-max-tabs" value="${SETTINGS2.MAX_WORKER_TABS}">
                    </div>
                    <div class="qmx-settings-item">
                        <label for="setting-api-fetch-count">单次API获取房间数 <span class="qmx-tooltip-icon" data-tooltip-key="api-room-fetch-count">?</span></label>
                        <input type="number" class="qmx-input" id="setting-api-fetch-count" value="${SETTINGS2.API_ROOM_FETCH_COUNT}">
                    </div>
                    <div class="qmx-settings-item">
                        <label for="setting-api-retry-count">API请求重试次数 <span class="qmx-tooltip-icon" data-tooltip-key="api-retry-count">?</span></label>
                        <input type="number" class="qmx-input" id="setting-api-retry-count" value="${SETTINGS2.API_RETRY_COUNT}">
                    </div>

                    

                    <!-- 新增：添加两个空的占位符，使网格平衡为 2x3 -->
                    <div class="qmx-settings-item"></div>
                    <div class="qmx-settings-item"></div>
                </div>
            </div>

            <!-- ==================== Tab 4: 弹幕助手 ==================== -->
            ${""}
            <!-- ==================== Tab 5: 关于 ==================== -->
            <div id="tab-about" class="tab-content">
                <!-- 调试工具 - 仅在开发时启用
                <h4>调试工具 <span style="color: #ff6b6b;">⚠️ 仅供测试使用</span></h4>
                <div class="qmx-settings-grid">
                    <div class="qmx-settings-item">
                        <label>模拟达到每日上限</label>
                        <button id="test-daily-limit-btn" class="qmx-modal-btn" style="background-color: #ff6b6b; color: white;">
                            设置为已达上限
                        </button>
                        <small style="color: #888; display: block; margin-top: 5px;">
                            点击后将模拟达到每日红包上限，触发休眠模式（如果启用）
                        </small>
                    </div>
                    <div class="qmx-settings-item">
                        <label>重置每日上限状态</label>
                        <button id="reset-daily-limit-btn" class="qmx-modal-btn">
                            重置上限状态
                        </button>
                        <small style="color: #888; display: block; margin-top: 5px;">
                            清除上限标记，恢复正常运行模式
                        </small>
                    </div>
                </div>
                -->
                
                <h4>关于脚本 <span class="version-tag">v2.0.9</span></h4>
                <h4>致谢</h4>
                <ul class="qmx-styled-list">
                    <li>本脚本基于<a href="https://greasyfork.org/zh-CN/users/1453821-ysl-ovo" target="_blank" rel="noopener noreferrer">ysl-ovo</a>的插件<a href="https://greasyfork.org/zh-CN/scripts/532514-%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96" target="_blank" rel="noopener noreferrer">《斗鱼全民星推荐自动领取》</a>
                        进行一些功能改进(也许)与界面美化，同样遵循MIT许可证开源。感谢原作者的分享</li>
                    <li>兼容斗鱼新版UI的相关功能与项目重构主要由<a href="https://github.com/Truthss" target="_blank" rel="noopener noreferrer">@Truthss</a> 贡献，非常感谢！</li>
                </ul>
                <h4>⚠️ 重要提示</h4>
                <ul class="qmx-styled-list">
                    <li><strong>斗鱼Ex插件冲突</strong>：如需使用本脚本抢红包，请暂时关闭斗鱼Ex插件，否则红包会消失。</li>
                    <li><strong>浏览器DNS设置</strong>：请在浏览器设置中搜索"DNS"，将"使用安全的DNS"选项关闭，否则红包也会消失。</li>
                    <li><strong>新版UI适配</strong>：控制面板"替换排行榜"模式暂不可用，请使用"浮动窗口"或"屏幕居中"模式。</li>
                    <li>启用统计功能需要把"油猴管理面板->设置->安全->允许脚本访问 Cookie"改为ALL！！</li>
                    <li>每天大概1000左右金币到上限。</li>
                </ul>
                <h4>脚本更新日志 (v2.0.9)</h4>
                <ul class="qmx-styled-list">
                    <li>【新增】全新统计面板：支持查看今日及最近7天的红包数量与金币总数。</li>
                    <li>【新增】奖励显示：控制面板现在可以直接显示每个红包的具体奖励信息（金币/荧光棒）。</li>
                    <li>【优化】设置体验升级：修改设置选项后不再需要刷新页面即可生效。</li>
                    <li>【优化】界面与布局：调整了控制面板样式，位置随窗口大小自动调整。</li>
                    <li>【修复】适配斗鱼新版直播间界面（部分功能受限）。</li>
                    <li>【修复】修复了重新打开控制页面时会残留已关闭的直播间信息的问题。</li>
                </ul>
                <h4>源码与社区</h4>
                <ul class="qmx-styled-list">
                    <li>可以在 <a href="https://github.com/ienone/douyu-qmx-pro/" target="_blank" rel="noopener noreferrer">GitHub</a> 查看本脚本源码</li>
                    <li>发现BUG或有功能建议，欢迎提交 <a href="https://github.com/ienone/douyu-qmx-pro/issues" target="_blank" rel="noopener noreferrer">Issue</a>（不过大概率不会修……）</li>
                    <li>如果你有能力进行改进，非常欢迎提交 <a href="https://github.com/ienone/douyu-qmx-pro/pulls" target="_blank" rel="noopener noreferrer">Pull Request</a>！</li>
                </ul>
            </div>
        </div>
        <div class="qmx-settings-footer">
            <button id="qmx-settings-cancel-btn" class="qmx-modal-btn">取消</button>
            <button id="qmx-settings-reset-btn" class="qmx-modal-btn danger">恢复默认</button>
            <button id="qmx-settings-save-btn" class="qmx-modal-btn primary">保存</button>
        </div>
        `;
  };
  const ThemeManager = {
applyTheme(theme) {
      document.body.setAttribute("data-theme", theme);
      SETTINGS.THEME = theme;
      GM_setValue("douyu_qmx_theme", theme);
    }
  };
  const GlobalState = {
get() {
      let state = GM_getValue(SETTINGS.STATE_STORAGE_KEY, { tabs: {} });
      if (!state || typeof state !== "object") {
        state = { tabs: {} };
      }
      return state;
    },
set(state) {
      const lockKey = "douyu_qmx_state_lock";
      if (!Utils.lockChecker(lockKey, () => this.set(), state)) {
        return;
      }
      Utils.setLocalValueWithLock(lockKey, SETTINGS.STATE_STORAGE_KEY, state, "更新全局状态");
    },
updateWorker(roomId, status, statusText, options = {}) {
      if (!roomId) return;
      const state = this.get();
      const oldTabData = state.tabs[roomId] || {};
      if (status === "DISCONNECTED" && oldTabData.status === "SWITCHING") {
        Utils.log(`[状态管理] 检测到正在切换的标签页已断开连接，判定为成功关闭，立即清理。`);
        this.removeWorker(roomId);
        return;
      }
      if (Object.keys(state.tabs).length === 0 && status === "SWITCHING") {
        Utils.log(`[状态管理] 检测到全局状态已清空，忽略残留的SWITCHING状态更新 (房间: ${roomId})`);
        return;
      }
      const updates = {
        status,
        statusText,
        lastUpdateTime: Date.now(),
        ...options
      };
      const newTabData = { ...oldTabData, ...updates };
      for (const key in newTabData) {
        if (newTabData[key] === null) {
          delete newTabData[key];
        }
      }
      state.tabs[roomId] = newTabData;
      this.set(state);
    },
removeWorker(roomId) {
      if (!roomId) return;
      const state = this.get();
      delete state.tabs[roomId];
      this.set(state);
    },
setDailyLimit(reached) {
      GM_setValue(SETTINGS.DAILY_LIMIT_REACHED_KEY, { reached, timestamp: Date.now() });
    },
getDailyLimit() {
      return GM_getValue(SETTINGS.DAILY_LIMIT_REACHED_KEY);
    }
  };
  var _GM_cookie = (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const DouyuAPI = {
getRooms(count, rid, retries = SETTINGS.API_RETRY_COUNT) {
      return new Promise((resolve, reject) => {
        const attempt = (remainingTries) => {
          Utils.log(`开始调用 API 获取房间列表... (剩余重试次数: ${remainingTries})`);
          _GM_xmlhttpRequest({
            method: "GET",
            url: `${SETTINGS.API_URL}?rid=${rid}`,
            headers: {
              Referer: "https://www.douyu.com/",
              "User-Agent": navigator.userAgent
            },
            responseType: "json",
            timeout: 1e4,
            onload: (response) => {
              if (response.status === 200 && response.response?.error === 0 && Array.isArray(response.response.data?.redBagList)) {
                const rooms = response.response.data.redBagList.map((item) => item.rid).filter(Boolean).slice(0, count * 2).map((rid2) => `https://www.douyu.com/${rid2}`);
                Utils.log(`API 成功返回 ${rooms.length} 个房间URL。`);
                resolve(rooms);
              } else {
                const errorMsg = `API 数据格式错误或失败: ${response.response?.msg || "未知错误"}`;
                Utils.log(errorMsg);
                if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                else reject(new Error(errorMsg));
              }
            },
            onerror: (error) => {
              const errorMsg = `API 请求网络错误: ${error.statusText || "未知"}`;
              Utils.log(errorMsg);
              if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
              else reject(new Error(errorMsg));
            },
            ontimeout: () => {
              const errorMsg = "API 请求超时";
              Utils.log(errorMsg);
              if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
              else reject(new Error(errorMsg));
            }
          });
        };
        const retry = (remainingTries, reason) => {
          Utils.log(`${reason}，将在 ${SETTINGS.API_RETRY_DELAY / 1e3} 秒后重试...`);
          setTimeout(() => attempt(remainingTries), SETTINGS.API_RETRY_DELAY);
        };
        attempt(retries);
      });
    },
getCookie: function(cookieName) {
      return new Promise((resolve, reject) => {
        _GM_cookie.list({ name: cookieName }, function(cookies, error) {
          if (error) {
            Utils.log(error);
            reject(error);
          } else if (cookies && cookies.length > 0) {
            resolve(cookies[0]);
          } else {
            resolve(null);
          }
        });
      });
    },
getCoinRecord: function(current, count, rid, retries = SETTINGS.API_RETRY_COUNT) {
      return new Promise((resolve, reject) => {
        this.getCookie("acf_auth").then((acfCookie) => {
          if (!acfCookie) {
            Utils.log("获取cookie错误");
            reject(new Error("获取cookie错误"));
            return;
          }
          const fullUrl = `${SETTINGS.COIN_LIST_URL}?current=${current}&pageSize=${count}&rid=${rid}`;
          const attempt = (remainingTries) => {
            Utils.log(
              `开始调用 API 获取金币历史列表... (剩余重试次数: ${remainingTries})`
            );
            _GM_xmlhttpRequest({
              method: "GET",
              url: fullUrl,
              headers: {
                Referer: "https://www.douyu.com/",
                "User-Agent": navigator.userAgent
              },
              cookie: acfCookie["value"],
              responseType: "json",
              timeout: 1e4,
              onload: (response) => {
                if (response.status === 200 && response.response?.error === 0 && Array.isArray(response.response.data.list)) {
                  const coinListData = response.response.data.list.filter(
                    (item) => item.opDirection === 1 && item.remark.includes("红包")
                  );
                  Utils.log(`API 成功返回 ${coinListData.length} 个红包记录。`);
                  resolve(coinListData);
                } else {
                  const errorMsg = `API 数据格式错误或失败: ${response.response?.msg || "未知错误"}`;
                  Utils.log(errorMsg);
                  if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                  else reject(new Error(errorMsg));
                }
              },
              onerror: (error) => {
                const errorMsg = `API 请求网络错误: ${error.statusText || "未知"}`;
                Utils.log(errorMsg);
                if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                else reject(new Error(errorMsg));
              },
              ontimeout: () => {
                const errorMsg = "API 请求超时";
                Utils.log(errorMsg);
                if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                else reject(new Error(errorMsg));
              }
            });
          };
          const retry = (remainingTries, reason) => {
            Utils.log(`${reason}，将在 ${SETTINGS.API_RETRY_DELAY / 1e3} 秒后重试...`);
            setTimeout(() => attempt(remainingTries), SETTINGS.API_RETRY_DELAY);
          };
          attempt(retries);
        }).catch((error) => {
          Utils.log(error);
          reject(error);
        });
      });
    }
  };
  let isGlobalClickListenerAdded = false;
  function activateCustomSelects(parentElement) {
    parentElement.querySelectorAll(".qmx-select").forEach((wrapper) => {
      const nativeSelect = wrapper.querySelector("select");
      const styledSelect = wrapper.querySelector(".qmx-select-styled");
      const optionsList = wrapper.querySelector(".qmx-select-options");
      styledSelect.textContent = nativeSelect.options[nativeSelect.selectedIndex].text;
      optionsList.innerHTML = "";
      for (const option of nativeSelect.options) {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = option.text;
        optionDiv.dataset.value = option.value;
        if (option.selected) {
          optionDiv.classList.add("selected");
        }
        optionsList.appendChild(optionDiv);
      }
      styledSelect.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".qmx-select.active").forEach((el) => {
          if (el !== wrapper) {
            el.classList.remove("active");
          }
        });
        wrapper.classList.toggle("active");
      });
      optionsList.querySelectorAll("div").forEach((optionDiv) => {
        optionDiv.addEventListener("click", () => {
          styledSelect.textContent = optionDiv.textContent;
          nativeSelect.value = optionDiv.dataset.value;
          optionsList.querySelector(".selected")?.classList.remove("selected");
          optionDiv.classList.add("selected");
          wrapper.classList.remove("active");
        });
      });
    });
    if (!isGlobalClickListenerAdded) {
      document.addEventListener("click", () => {
        document.querySelectorAll(".qmx-select.active").forEach((el) => {
          el.classList.remove("active");
        });
      });
      isGlobalClickListenerAdded = true;
    }
  }
  function activateRangeSlider(parentElement) {
    const wrapper = parentElement.querySelector(".qmx-range-slider-wrapper");
    if (!wrapper) {
      return;
    }
    const minSlider = wrapper.querySelector("#setting-min-delay");
    const maxSlider = wrapper.querySelector("#setting-max-delay");
    const sliderValues = wrapper.querySelector(".qmx-range-slider-values");
    const progress = wrapper.querySelector(".qmx-range-slider-progress");
    if (!minSlider || !maxSlider || !sliderValues || !progress) {
      console.error("范围滑块组件缺少必要的子元素 (min/max slider, values, progress)。");
      return;
    }
    function updateSliderView() {
      if (parseFloat(minSlider.value) > parseFloat(maxSlider.value)) {
        maxSlider.value = minSlider.value;
      }
      sliderValues.textContent = `${minSlider.value} s - ${maxSlider.value} s`;
      const minPercent = (minSlider.value - minSlider.min) / (minSlider.max - minSlider.min) * 100;
      const maxPercent = (maxSlider.value - maxSlider.min) / (maxSlider.max - minSlider.min) * 100;
      progress.style.left = `${minPercent}%`;
      progress.style.width = `${maxPercent - minPercent}%`;
    }
    minSlider.addEventListener("input", updateSliderView);
    maxSlider.addEventListener("input", updateSliderView);
    updateSliderView();
  }
  let tooltipElement = null;
  function _ensureTooltipElement() {
    if (!tooltipElement) {
      tooltipElement = document.createElement("div");
      tooltipElement.id = "qmx-global-tooltip";
      document.body.appendChild(tooltipElement);
    }
  }
  function activateToolTips(parentElement, tooltipData) {
    if (!parentElement || typeof tooltipData !== "object") {
      console.warn("[Tooltip] 调用失败：必须提供 parentElement 和 tooltipData。");
      return;
    }
    _ensureTooltipElement();
    parentElement.addEventListener("mouseover", (e) => {
      const trigger = e.target.closest(".qmx-tooltip-icon");
      if (!trigger) return;
      const key = trigger.dataset.tooltipKey;
      const text = tooltipData[key];
      if (text) {
        tooltipElement.textContent = text;
        const triggerRect = trigger.getBoundingClientRect();
        const left = triggerRect.left + triggerRect.width / 2;
        const top = triggerRect.top;
        tooltipElement.style.left = `${left}px`;
        tooltipElement.style.top = `${top}px`;
        tooltipElement.style.transform = `translate(-50%, calc(-100% - 8px))`;
        tooltipElement.classList.add("visible");
      }
    });
    parentElement.addEventListener("mouseout", (e) => {
      const trigger = e.target.closest(".qmx-tooltip-icon");
      if (trigger) {
        tooltipElement.classList.remove("visible");
      }
    });
  }
  const SettingsPanel = {

RELOAD_REQUIRED_KEYS: [
],
show() {
      const modal = document.getElementById("qmx-settings-modal");
      const allTooltips = {
        "control-room": "只有在此房间号的直播间中才能看到插件面板，看准了再改！(修改后不会立即刷新，下次进入该房间生效)",
        "temp-control-room": "备用的控制室房间号（真实RID），用于兼容特殊活动页或Topic页面。",
        "auto-pause": "自动暂停非控制直播间的视频播放，大幅降低资源占用。",
        "initial-script-delay": "页面加载后等待多久再运行脚本，可适当增加以确保页面完全加载。",
        "auto-pause-delay": "领取红包后等待多久再次尝试暂停视频。",
        "unresponsive-timeout": '工作页多久未汇报任何状态后，在面板上标记为"无响应"。',
        "red-envelope-timeout": "进入直播间后，最长等待多久来寻找红包活动，超时后将切换房间。（默认15秒）",
        "popup-wait-timeout": "点击红包后，等待领取弹窗出现的最长时间。注意：系统会在发现新红包时提前提取奖励信息。",
        "worker-loading-timeout": "新开的直播间卡在加载状态多久还没显示播放组件，被判定为加载失败或缓慢。",
        "range-delay": "脚本在每次点击等操作前后随机等待的时间范围，模拟真人行为。",
        "close-tab-delay": "旧页面在打开新页面后，等待多久再关闭自己，确保新页面已接管。",
        "switching-cleanup-timeout": "处于“切换中”状态的标签页，超过此时间后将被强行清理，避免残留。",
        "max-worker-tabs": "同时运行的直播间数量上限。",
        "api-room-fetch-count": "每次从API获取的房间数。增加可提高找到新房间的几率。",
        "api-retry-count": "获取房间列表失败时的重试次数。",
        "api-retry-delay": "API请求失败后，等待多久再重试。",
        "healthcheck-interval": "哨兵检查后台UI的频率。值越小，UI节流越快，但会增加资源占用。",
        "disconnected-grace-period": "刷新或关闭的标签页，在被彻底清理前等待重连的宽限时间。",
        "calibration-mode": "启用校准模式可提高倒计时精准度。注意：启用此项前请先关闭DouyuEx的 阻止P2P上传 功能",
        "stats-info": '此功能需要把"油猴管理面板->设置->安全->允许脚本访问 Cookie"改为ALL！！ 在控制面板中显示统计信息标签页，记录每日领取的红包数量和金币总额。',
        "stats-update-interval": "统计信息面板中数据更新的频率，值越小更新越及时，但会增加API使用次数。",
        "danmupro-mode": "启用斗鱼弹幕助手功能，可以在弹幕输入框中使用自动弹幕推荐等功能。"
      };
      modal.innerHTML = settingsPanelTemplate(SETTINGS);
      activateToolTips(modal, allTooltips);
      activateCustomSelects(modal);
      activateRangeSlider(modal);
      this.bindPanelEvents(modal);
      document.getElementById("qmx-modal-backdrop").classList.add("visible");
      modal.classList.add("visible");
      document.body.classList.add("qmx-modal-open-scroll-lock");
      this.updateSaveButtonState();
    },
hide() {
      const modal = document.getElementById("qmx-settings-modal");
      modal.classList.remove("visible");
      document.body.classList.remove("qmx-modal-open-scroll-lock");
      if (SETTINGS.MODAL_DISPLAY_MODE !== "centered" || !document.getElementById("qmx-modal-container").classList.contains("visible")) {
        document.getElementById("qmx-modal-backdrop").classList.remove("visible");
      }
    },
getSettingsFromUI() {
      return {
CONTROL_ROOM_ID: document.getElementById("setting-control-room-id").value,
        TEMP_CONTROL_ROOM_RID: document.getElementById("setting-temp-control-room-id").value,
        AUTO_PAUSE_ENABLED: document.getElementById("setting-auto-pause").checked,
...{},
        DAILY_LIMIT_ACTION: document.getElementById("setting-daily-limit-action").value,
        MODAL_DISPLAY_MODE: document.getElementById("setting-modal-mode").value,
        SHOW_STATS_IN_PANEL: document.getElementById("setting-stats-info").checked,
        THEME: document.getElementById("setting-theme-mode").checked ? "dark" : "light",

INITIAL_SCRIPT_DELAY: parseFloat(document.getElementById("setting-initial-script-delay").value) * 1e3,
        AUTO_PAUSE_DELAY_AFTER_ACTION: parseFloat(document.getElementById("setting-auto-pause-delay").value) * 1e3,
        SWITCHING_CLEANUP_TIMEOUT: parseFloat(document.getElementById("setting-switching-cleanup-timeout").value) * 1e3,
        UNRESPONSIVE_TIMEOUT: parseInt(document.getElementById("setting-unresponsive-timeout").value, 10) * 6e4,
        RED_ENVELOPE_LOAD_TIMEOUT: parseFloat(document.getElementById("setting-red-envelope-timeout").value) * 1e3,
        POPUP_WAIT_TIMEOUT: parseFloat(document.getElementById("setting-popup-wait-timeout").value) * 1e3,
        CALIBRATION_MODE_ENABLED: document.getElementById("setting-calibration-mode").checked,
        ELEMENT_WAIT_TIMEOUT: parseFloat(document.getElementById("setting-worker-loading-timeout").value) * 1e3,
        MIN_DELAY: parseFloat(document.getElementById("setting-min-delay").value) * 1e3,
        MAX_DELAY: parseFloat(document.getElementById("setting-max-delay").value) * 1e3,
        CLOSE_TAB_DELAY: parseFloat(document.getElementById("setting-close-tab-delay").value) * 1e3,
        HEALTHCHECK_INTERVAL: parseFloat(document.getElementById("setting-healthcheck-interval").value) * 1e3,
        DISCONNECTED_GRACE_PERIOD: parseFloat(document.getElementById("setting-disconnected-grace-period").value) * 1e3,
        STATS_UPDATE_INTERVAL: parseFloat(document.getElementById("setting-stats-update-interval").value) * 1e3,
MAX_WORKER_TABS: parseInt(document.getElementById("setting-max-tabs").value, 10),
        API_ROOM_FETCH_COUNT: parseInt(document.getElementById("setting-api-fetch-count").value, 10),
        API_RETRY_COUNT: parseInt(document.getElementById("setting-api-retry-count").value, 10),
        API_RETRY_DELAY: parseFloat(document.getElementById("setting-api-retry-delay").value) * 1e3
      };
    },
updateSaveButtonState() {
      const newSettings = this.getSettingsFromUI();
      let needReload = false;
      for (const key of Object.keys(newSettings)) {
        if (SETTINGS[key] !== newSettings[key]) {
          if (this.RELOAD_REQUIRED_KEYS.includes(key)) {
            needReload = true;
            break;
          }
        }
      }
      const saveBtn = document.getElementById("qmx-settings-save-btn");
      if (saveBtn) {
        if (saveBtn.textContent.includes("已保存")) return { newSettings, needReload };
        if (needReload) {
          saveBtn.textContent = "保存并刷新";
        } else {
          saveBtn.textContent = "保存";
        }
      }
      return { newSettings, needReload };
    },
save() {
      const { newSettings, needReload } = this.updateSaveButtonState();
      const existingUserSettings = GM_getValue(SettingsManager.STORAGE_KEY, {});
      const finalSettingsToSave = Object.assign(existingUserSettings, newSettings);
      delete finalSettingsToSave.OPEN_TAB_DELAY;
      SettingsManager.save(finalSettingsToSave);
      if (needReload) {
        window.location.reload();
      } else {
        SettingsManager.update(newSettings);
        const saveBtn = document.getElementById("qmx-settings-save-btn");
        if (saveBtn) {
          const originalText = saveBtn.textContent;
          saveBtn.textContent = "已保存~";
          saveBtn.style.backgroundColor = "var(--status-color-success, #4CAF50)";
          setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = "";
            this.hide();
            this.updateSaveButtonState();
          }, 600);
        } else {
          this.hide();
        }
      }
    },
bindPanelEvents(modal) {
      modal.querySelector("#qmx-settings-cancel-btn").onclick = () => this.hide();
      modal.querySelector("#qmx-settings-save-btn").onclick = () => this.save();
      modal.querySelector("#qmx-settings-reset-btn").onclick = () => {
        if (confirm("确定要恢复所有默认设置吗？此操作会刷新页面。")) {
          SettingsManager.reset();
          window.location.reload();
        }
      };
      const inputs = modal.querySelectorAll("input, select");
      inputs.forEach((input) => {
        input.addEventListener("change", () => this.updateSaveButtonState());
        input.addEventListener("input", () => this.updateSaveButtonState());
      });
      const customOptions = modal.querySelectorAll(".qmx-select-options div");
      customOptions.forEach((opt) => {
        opt.addEventListener("click", () => {
          setTimeout(() => this.updateSaveButtonState(), 10);
        });
      });
      modal.querySelectorAll(".tab-link").forEach((button) => {
        button.onclick = (e) => {
          const tabId = e.target.dataset.tab;
          modal.querySelector(".tab-link.active")?.classList.remove("active");
          modal.querySelector(".tab-content.active")?.classList.remove("active");
          e.target.classList.add("active");
          modal.querySelector(`#tab-${tabId}`).classList.add("active");
        };
      });
      const themeToggle = modal.querySelector("#setting-theme-mode");
      if (themeToggle) {
        themeToggle.addEventListener("change", (e) => {
          const newTheme = e.target.checked ? "dark" : "light";
          ThemeManager.applyTheme(newTheme);
          this.updateSaveButtonState();
        });
      }
    }

};
  const FirstTimeNotice = {
showCalibrationNotice() {
      const NOTICE_SHOWN_KEY = "douyu_qmx_calibration_notice_shown";
      const hasShownNotice = GM_getValue(NOTICE_SHOWN_KEY, false);
      if (!hasShownNotice) {
        const noticeHTML = `
                <div class="qmx-modal-header">
                    <h3>⚠️ 重要更新提示</h3>
                    <button id="qmx-notice-close-btn" class="qmx-modal-close-icon" title="关闭"></button>
                </div>
                <div class="qmx-modal-content">
                    <h4 style="color: var(--accent-color, #ff6b6b); margin-top: 0;">斗鱼网页UI更新说明</h4>
                    <p>斗鱼已更新直播间界面，脚本正在适配中。目前基本功能可用，但请注意：</p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>控制面板"替换排行榜"模式暂不可用</strong>，请使用"浮动窗口"或"屏幕居中"模式</li>
                        <li><strong>刚开始打开的几个工作标签页</strong>可能需要手动切换激活一下才能正常加载</li>
                        <li><strong>弹幕助手功能</strong>正在适配中，暂时可能无法使用</li>
                    </ul>
                    
                    <h4 style="color: var(--accent-color, #ff6b6b);">⚠️使用前必读</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>斗鱼Ex插件冲突</strong>：如需使用本脚本抢红包，请暂时关闭斗鱼Ex插件，否则红包会消失。后续会尝试沟通解决此问题</li>
                        <li><strong>浏览器DNS设置</strong>：请在浏览器设置中搜索"DNS"，将"使用安全的DNS"选项关闭，否则红包也会消失</li>
                    </ul>
                    
                    <h4 style="color: var(--status-color-success, #4CAF50);">✨ 新增功能</h4>
                    <p>控制面板现在会显示每个红包的具体奖励信息🎁</p>
                    <p>启用统计功能需要把"油猴管理面板->设置->安全->允许脚本访问 Cookie"改为ALL！！</p>
                    
                    <h4 style="margin-bottom: 5px;">⭐️点点star吧~</h4>
                    <p style="margin-top: 5px;">项目地址：<a href="https://github.com/ienone/douyu-qmx-pro" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color, #ff6b6b);">douyu-qmx-pro</a>，觉得好用请给个star🌟~~</p>
                </div>
                <div class="qmx-modal-footer">
                    <button id="qmx-notice-settings-btn" class="qmx-modal-btn">前往设置</button>
                    <button id="qmx-notice-ok-btn" class="qmx-modal-btn primary">我知道了</button>
                </div>
            `;
        const noticeContainer = document.createElement("div");
        noticeContainer.id = "qmx-notice-modal";
        noticeContainer.className = "visible mode-centered";
        noticeContainer.innerHTML = noticeHTML;
        const backdrop = document.createElement("div");
        backdrop.id = "qmx-notice-backdrop";
        backdrop.className = "visible";
        document.body.appendChild(backdrop);
        document.body.appendChild(noticeContainer);
        const closeNotice = () => {
          noticeContainer.classList.remove("visible");
          backdrop.classList.remove("visible");
          setTimeout(() => {
            noticeContainer.remove();
            backdrop.remove();
          }, 300);
          GM_setValue(NOTICE_SHOWN_KEY, true);
        };
        document.getElementById("qmx-notice-close-btn").onclick = closeNotice;
        document.getElementById("qmx-notice-ok-btn").onclick = closeNotice;
        document.getElementById("qmx-notice-settings-btn").onclick = () => {
          closeNotice();
          SettingsPanel.show();
        };
      }
    }
  };
  const typedSettings = SETTINGS;
  const globalValue = {
    currentDatePage: Utils.formatDateAsBeijing( new Date()),
updateIntervalID: void 0,
    statElements: new Map()
  };
  const StatsInfo = {
    init: async function() {
      let stats;
      try {
        stats = await Utils.getElementWithRetry(".qmx-stats-content");
      } catch (error) {
        Utils.log(`[数据统计] 初始化失败，错误: ${error}`);
        return;
      }
      const statsConfigs = [
        ["receivedCount", "已领个数"],
        ["total", "总金币"],
        ["avg", "平均每个"]
      ];
      for (const [name, nickname] of statsConfigs) {
        const element = this.initRender(name, nickname);
        stats.appendChild(element);
        try {
          const details = await Utils.getElementWithRetry(".qmx-stat-details", element);
          if (details) {
            globalValue.statElements.set(
              name,
              details
            );
          }
        } catch (error) {
          Utils.log(`[数据统计] 缓存元素获取失败: ${error}`);
        }
      }
      GM_setValue("douyu_qmx_stats_lock", false);
      this.ensureTodayDataExists();
      this.updateTodayData();
      await this.getCoinListUpdate();
      this.removeExpiredData();
      this.bindEvents();
      this.updateInterval();
      setInterval(() => {
        this.updateDataForDailyReset();
      }, 60 * 1e3);
    },
updateInterval: function() {
      if (globalValue.updateIntervalID) {
        clearInterval(globalValue.updateIntervalID);
        globalValue.updateIntervalID = void 0;
      }
      globalValue.updateIntervalID = setInterval(() => {
        this.checkUpdate();
      }, typedSettings.STATS_UPDATE_INTERVAL);
    },
destroy: function() {
      if (globalValue.updateIntervalID) {
        clearInterval(globalValue.updateIntervalID);
        globalValue.updateIntervalID = void 0;
      }
      globalValue.statElements.clear();
    },
ensureTodayDataExists: function() {
      const today = Utils.formatDateAsBeijing( new Date());
      let allData = GM_getValue(typedSettings.STATS_INFO_STORAGE_KEY, null);
      if (!allData || typeof allData !== "object") {
        allData = {};
      }
      if (!allData[today]) {
        allData[today] = {
          receivedCount: 0,
          avg: 0,
          total: 0
        };
        GM_setValue(typedSettings.STATS_INFO_STORAGE_KEY, allData);
      }
      return { allData, todayData: allData[today], today };
    },
bindEvents: function() {
      try {
        this.bindRefreshEvent();
        this.bindSwitcherLeft();
        this.bindSwitcherRight();
      } catch (e) {
        Utils.log(`[数据统计] 绑定事件异常: ${e}`);
        setTimeout(() => {
          this.bindEvents();
        }, 500);
      }
    },
bindRefreshEvent: function() {
      const refreshButton = document.querySelector(".qmx-stats-refresh");
      const today = Utils.formatDateAsBeijing( new Date());
      if (!refreshButton) {
        throw new Error("无法找到刷新按钮元素");
      }
      if (globalValue.currentDatePage !== today) {
        refreshButton.classList.add("disabled");
        refreshButton.onclick = null;
        return;
      }
      setTimeout(() => {
        refreshButton.classList.remove("disabled");
      }, 300);
      refreshButton.onclick = async (e) => {
        e.stopPropagation();
        void refreshButton.offsetWidth;
        refreshButton.classList.add("rotating");
        setTimeout(() => {
          refreshButton.classList.remove("rotating");
        }, 1e3);
        await this.getCoinListUpdate();
      };
    },
bindSwitcher: function(direction) {
      const { allData, today } = this.ensureTodayDataExists();
      globalValue.currentDatePage = globalValue.currentDatePage ?? today;
      const dateList = Object.keys(allData);
      const currentIndex = dateList.indexOf(globalValue.currentDatePage);
      const statsLable = document.querySelector(".qmx-stats-label");
      const indecator = document.querySelector(".qmx-stats-indicator");
      const button = document.querySelector(`#qmx-stats-${direction}`);
      if (!statsLable || !indecator || !button) {
        Utils.log("[数据统计] 切换按钮绑定失败，正在重试");
        setTimeout(() => {
          this.bindSwitcher(direction);
        }, 500);
        return;
      }
      const shouldDisableButton = direction === "left" ? dateList.length <= 1 || currentIndex - 1 < 0 : dateList.length <= 1 || currentIndex + 1 >= dateList.length;
      if (shouldDisableButton) {
        button.classList.add("disabled");
        button.onclick = null;
        return;
      }
      button.classList.remove("disabled");
      button.onclick = (e) => {
        e.stopPropagation();
        const newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex >= 0 && newIndex < dateList.length) {
          globalValue.currentDatePage = dateList[newIndex];
          this.refreshUI(allData[globalValue.currentDatePage]);
          this.bindEvents();
        }
        this.itemTransiton(indecator);
        if (globalValue.currentDatePage !== today) {
          this.contentTransition(statsLable, globalValue.currentDatePage);
        } else {
          this.contentTransition(statsLable, "今日统计");
        }
        if (globalValue.currentDatePage === today) {
          this.updateInterval();
          this.getCoinListUpdate();
        } else {
          clearInterval(globalValue.updateIntervalID);
          globalValue.updateIntervalID = void 0;
        }
      };
    },
bindSwitcherLeft: function() {
      this.bindSwitcher("left");
    },
bindSwitcherRight: function() {
      this.bindSwitcher("right");
    },
contentTransition: function(element, newText, duration = 300) {
      element.classList.add("transitioning");
      setTimeout(() => {
        element.textContent = newText;
        element.classList.remove("transitioning");
      }, duration);
    },
itemTransiton: function(element, duration = 300) {
      element.classList.add("transitioning");
      setTimeout(() => {
        element.classList.remove("transitioning");
      }, duration);
    },
initRender: function(name, nickname) {
      const newItem = document.createElement("div");
      newItem.className = "qmx-modal-stats-child";
      const className = "qmx-stat-info-" + name;
      newItem.innerHTML = `
                <div class=${className}>
                    <div class="qmx-stat-header">
                        <span class="qmx-stat-nickname">${nickname}</span>
                    </div>
                    <div class="qmx-stat-details">
                        <span class="qmx-stat-item">0</span>
                    </div>
                </div>
            `;
      return newItem;
    },
updateTodayData: function() {
      const { allData, todayData } = this.ensureTodayDataExists();
      if (!todayData) return;
      todayData.avg = todayData.receivedCount ? parseFloat((todayData.total / todayData.receivedCount).toFixed(2)) : 0;
      if (!Utils.lockChecker("douyu_qmx_stats_lock", this.updateTodayData.bind(this))) return;
      Utils.setLocalValueWithLock(
        "douyu_qmx_stats_lock",
        typedSettings.STATS_INFO_STORAGE_KEY,
        allData,
        "更新今日统计数据"
      );
      this.refreshUI(todayData);
    },
set: function(name, value) {
      const { allData, todayData } = this.ensureTodayDataExists();
      if (!todayData) return;
      todayData[name] = value;
      if (!Utils.lockChecker("douyu_qmx_stats_lock", this.set.bind(this), name, value)) return;
      Utils.setLocalValueWithLock(
        "douyu_qmx_stats_lock",
        typedSettings.STATS_INFO_STORAGE_KEY,
        allData,
        "更新统计数据"
      );
      this.refreshUI(todayData);
    },
getCoinListUpdate: async function() {
      const currentRoomId = Utils.getCurrentRoomId();
      if (!currentRoomId) {
        Utils.log("[统计] 无法获取当前房间ID，跳过金币记录更新。");
        return;
      }
      const coinList = await DouyuAPI.getCoinRecord(1, 100, currentRoomId, 3);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const filteredData = coinList.filter(
        (item) => item.createTime > startOfToday.getTime() / 1e3
      );
      const totalCoin = filteredData.reduce((sum, item) => sum + item.balanceDiff, 0);
      const updateList = [
        ["receivedCount", filteredData.length],
        ["total", totalCoin]
      ];
      updateList.forEach(([name, value]) => {
        this.set(name, value);
      });
      this.updateTodayData();
    },
refreshUI: function(todayData) {
      for (const key in todayData) {
        try {
          const typedKey = key;
          const element = globalValue.statElements.get(typedKey);
          if (!element) continue;
          this.contentTransition(element, todayData[typedKey].toString());
        } catch (e) {
          Utils.log(`[StatsInfo] UI刷新异常: ${e}`);
          continue;
        }
      }
    },
removeExpiredData: function() {
      const allData = this.ensureTodayDataExists().allData;
      const newAllData = Object.keys(allData).filter((dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateString);
        const diff = today.getTime() - date.getTime();
        const dayDiff = diff / (1e3 * 60 * 60 * 24);
        return dayDiff <= 6;
      }).reduce((obj, key) => {
        return Object.assign(obj, { [key]: allData[key] });
      }, {});
      GM_setValue(typedSettings.STATS_INFO_STORAGE_KEY, newAllData);
      Utils.log("[数据统计]：已清理过期数据");
    },
updateDataForDailyReset: function() {
      const allData = GM_getValue(
        typedSettings.STATS_INFO_STORAGE_KEY,
        null
      );
      if (!allData || typeof allData !== "object") {
        this.ensureTodayDataExists();
        this.updateTodayData();
        this.removeExpiredData();
        return;
      }
      const lastDate = Object.keys(allData).at(-1);
      const nowDate = Utils.formatDateAsBeijing( new Date());
      if (lastDate !== nowDate) {
        this.updateTodayData();
        this.removeExpiredData();
      }
    },
checkUpdate: function() {
      const state = GlobalState.get();
      const tabList = document.getElementById("qmx-tab-list");
      if (!tabList) return;
      const tabIds = Object.keys(state.tabs);
      tabIds.forEach((roomId) => {
        const tabData = state.tabs[roomId];
        const currentStatusText = tabData.statusText;
        if (typedSettings.SHOW_STATS_IN_PANEL) {
          if (currentStatusText.includes("领取到")) {
            this.getCoinListUpdate();
          }
        }
      });
    }
  };
  const ICONS = {
    GOLD: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#FFA000" stroke-width="2"/><text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="14" fill="#B8860B" font-weight="bold" font-family="Arial">¥</text></svg>`,
    STARLIGHT: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FF69B4" stroke="#FF1493" stroke-width="2"/></svg>`
  };
  const ControlPage = {
injectionTarget: null,
isPanelInjected: false,
commandChannel: null,
    modalContainer: null,

init() {
      Utils.log("当前是控制页面，开始设置UI...");
      this.commandChannel = new BroadcastChannel("douyu_qmx_commands");
      ThemeManager.applyTheme(SETTINGS.THEME);
      this.clearClosedTabs();
      this.createHTML();
      const qmxModalHeader = document.querySelector(".qmx-modal-header");
      if (SETTINGS.SHOW_STATS_IN_PANEL) {
        if (qmxModalHeader) {
          qmxModalHeader.style.padding = "10px 20px 0px 20px";
        }
        StatsInfo.init();
      } else {
        const statsContent = document.querySelector(".qmx-stats-container");
        if (statsContent && qmxModalHeader) {
          statsContent.remove();
          qmxModalHeader.style.padding = "10px 20px 4px 20px";
        }
      }
      this.applyModalMode();
      this.bindEvents();
      window.addEventListener("qmx-settings-update", (e) => {
        this.handleSettingsUpdate(e.detail);
      });
      setInterval(() => {
        this.renderDashboard();
        this.cleanupAndMonitorWorkers();
        this.checkInjectionState();
      }, 1e3);
      FirstTimeNotice.showCalibrationNotice();
      window.addEventListener("beforeunload", () => {
        if (this.commandChannel) {
          this.commandChannel.close();
        }
      });
      window.addEventListener("resize", () => {
        this.correctButtonPosition();
        this.correctModalPosition();
      });
    },
checkInjectionState() {
      if (SETTINGS.MODAL_DISPLAY_MODE === "inject-rank-list" && this.isPanelInjected) {
        if (this.modalContainer && !this.modalContainer.isConnected) {
          Utils.log("[监控] 检测到面板脱离DOM (可能是页面重绘)，正在重新注入...");
          this.isPanelInjected = false;
          this.applyModalMode();
        }
      }
    },
async handleSettingsUpdate(newSettings) {
      Utils.log("[ControlPage] 检测到设置更新，正在应用...");
      if (newSettings.MODAL_DISPLAY_MODE) {
        this.applyModalMode();
        this.correctModalPosition();
      }
      if (typeof newSettings.SHOW_STATS_IN_PANEL !== "undefined") {
        this.toggleStatsPanel(newSettings.SHOW_STATS_IN_PANEL);
      }
      if (newSettings.STATS_UPDATE_INTERVAL && SETTINGS.SHOW_STATS_IN_PANEL) {
        StatsInfo.updateInterval();
      }
    },
toggleStatsPanel(show) {
      const qmxModalHeader = document.querySelector(".qmx-modal-header");
      let statsContent = document.querySelector(".qmx-stats-container");
      if (show) {
        if (!statsContent) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = statsPanelTemplate;
          statsContent = tempDiv.firstElementChild;
          qmxModalHeader.after(statsContent);
          const statsToggle = document.getElementById("qmx-stats-toggle");
          const statsContentEl = document.getElementById("qmx-stats-content");
          if (statsToggle && statsContentEl) {
            statsToggle.addEventListener("click", () => {
              const isExpanded = statsToggle.classList.contains("expanded");
              if (isExpanded) {
                statsToggle.classList.remove("expanded");
                statsContentEl.classList.remove("expanded");
              } else {
                statsToggle.classList.add("expanded");
                statsContentEl.classList.add("expanded");
              }
            });
          }
        }
        if (qmxModalHeader) {
          qmxModalHeader.style.padding = "10px 20px 0px 20px";
        }
        StatsInfo.init();
      } else {
        if (statsContent) {
          statsContent.remove();
        }
        if (qmxModalHeader) {
          qmxModalHeader.style.padding = "10px 20px 4px 20px";
        }
        StatsInfo.destroy();
      }
    },
    createHTML() {
      Utils.log("创建UI的HTML结构...");
      const modalBackdrop = document.createElement("div");
      modalBackdrop.id = "qmx-modal-backdrop";
      const modalContainer = document.createElement("div");
      modalContainer.id = "qmx-modal-container";
      this.modalContainer = modalContainer;
      modalContainer.innerHTML = mainPanelTemplate(SETTINGS.MAX_WORKER_TABS);
      document.body.appendChild(modalBackdrop);
      document.body.appendChild(modalContainer);
      const mainButton = document.createElement("button");
      mainButton.id = SETTINGS.DRAGGABLE_BUTTON_ID;
      mainButton.innerHTML = `<span class="icon">🎁</span>`;
      document.body.appendChild(mainButton);
      const settingsModal = document.createElement("div");
      settingsModal.id = "qmx-settings-modal";
      document.body.appendChild(settingsModal);
      const globalTooltip = document.createElement("div");
      globalTooltip.id = "qmx-global-tooltip";
      document.body.appendChild(globalTooltip);
    },
cleanupAndMonitorWorkers() {
      const state = GlobalState.get();
      let stateModified = false;
      for (const roomId in state.tabs) {
        const tab = state.tabs[roomId];
        const timeSinceLastUpdate = Date.now() - tab.lastUpdateTime;
        if (tab.status === "DISCONNECTED" && timeSinceLastUpdate > SETTINGS.DISCONNECTED_GRACE_PERIOD) {
          Utils.log(
            `[监控] 任务 ${roomId} (已断开) 超过 ${SETTINGS.DISCONNECTED_GRACE_PERIOD / 1e3} 秒未重连，执行清理。`
          );
          delete state.tabs[roomId];
          stateModified = true;
          continue;
        }
        if (tab.status === "SWITCHING" && timeSinceLastUpdate > SETTINGS.SWITCHING_CLEANUP_TIMEOUT) {
          Utils.log(`[监控] 任务 ${roomId} (切换中) 已超时，判定为已关闭，执行清理。`);
          delete state.tabs[roomId];
          stateModified = true;
          continue;
        }
        if (timeSinceLastUpdate > SETTINGS.UNRESPONSIVE_TIMEOUT && tab.status !== "UNRESPONSIVE") {
          Utils.log(`[监控] 任务 ${roomId} 已失联超过 ${SETTINGS.UNRESPONSIVE_TIMEOUT / 6e4} 分钟，标记为无响应。`);
          tab.status = "UNRESPONSIVE";
          tab.statusText = "心跳失联，请点击激活或关闭此标签页";
          stateModified = true;
        }
      }
      if (stateModified) {
        GlobalState.set(state);
      }
    },
bindEvents() {
      Utils.log("为UI元素绑定事件...");
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      const modalContainer = document.getElementById("qmx-modal-container");
      const modalBackdrop = document.getElementById("qmx-modal-backdrop");
      const statsToggle = document.getElementById("qmx-stats-toggle");
      const statsContent = document.getElementById("qmx-stats-content");
      if (statsToggle && statsContent) {
        statsToggle.addEventListener("click", () => {
          const isExpanded = statsToggle.classList.contains("expanded");
          if (isExpanded) {
            statsToggle.classList.remove("expanded");
            statsContent.classList.remove("expanded");
          } else {
            statsToggle.classList.add("expanded");
            statsContent.classList.add("expanded");
          }
        });
      }
      this.setupDrag(mainButton, SETTINGS.BUTTON_POS_STORAGE_KEY, () => this.showPanel());
      const modalHeader = modalContainer.querySelector(".qmx-modal-header");
      this.setupDrag(modalContainer, "douyu_qmx_modal_position", null, modalHeader);
      document.getElementById("qmx-modal-close-btn").onclick = () => this.hidePanel();
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalContainer.classList.contains("visible")) {
          this.hidePanel();
        }
      });
      if (SETTINGS.MODAL_DISPLAY_MODE !== "inject-rank-list") {
        modalBackdrop.onclick = () => this.hidePanel();
      }
      document.getElementById("qmx-modal-open-btn").onclick = () => this.openOneNewTab();
      document.getElementById("qmx-modal-settings-btn").onclick = () => SettingsPanel.show();
      document.getElementById("qmx-modal-close-all-btn").onclick = async () => {
        if (confirm("确定要关闭所有工作标签页吗？")) {
          Utils.log("用户请求关闭所有标签页。");
          Utils.log("通过 BroadcastChannel 发出 CLOSE_ALL 指令...");
          this.commandChannel.postMessage({ action: "CLOSE_ALL", target: "*" });
          await new Promise((resolve) => setTimeout(resolve, 500));
          Utils.log("强制清空全局状态中的标签页列表...");
          let state = GlobalState.get();
          if (Object.keys(state.tabs).length > 0) {
            Utils.log(`清理前还有 ${Object.keys(state.tabs).length} 个标签页残留`);
            state.tabs = {};
            GlobalState.set(state);
          }
          this.renderDashboard();
          setTimeout(() => {
            state = GlobalState.get();
            if (Object.keys(state.tabs).length > 0) {
              Utils.log("检测到残留标签页，执行二次清理...");
              state.tabs = {};
              GlobalState.set(state);
              this.renderDashboard();
            }
          }, 1e3);
        }
      };
      document.getElementById("qmx-tab-list").addEventListener("click", (e) => {
        const closeButton = e.target.closest(".qmx-tab-close-btn");
        if (!closeButton) return;
        const roomItem = e.target.closest("[data-room-id]");
        const roomId = roomItem?.dataset.roomId;
        if (!roomId) return;
        Utils.log(`[控制中心] 用户请求关闭房间: ${roomId}。`);
        const state = GlobalState.get();
        delete state.tabs[roomId];
        GlobalState.set(state);
        Utils.log(`通过 BroadcastChannel 向 ${roomId} 发出 CLOSE 指令...`);
        this.commandChannel.postMessage({ action: "CLOSE", target: roomId });
        roomItem.style.opacity = "0";
        roomItem.style.transform = "scale(0.8)";
        roomItem.style.transition = "all 0.3s ease";
        setTimeout(() => roomItem.remove(), 300);
      });
    },
renderDashboard() {
      const state = GlobalState.get();
      const tabList = document.getElementById("qmx-tab-list");
      if (!tabList) return;
      const tabIds = Object.keys(state.tabs);
      document.getElementById("qmx-active-tabs-count").textContent = tabIds.length;
      const statusDisplayMap = {
        OPENING: "加载中",
        WAITING: "等待中",
        CLAIMING: "领取中",
        SWITCHING: "切换中",
        DORMANT: "休眠中",
        ERROR: "出错了",
        UNRESPONSIVE: "无响应",
        DISCONNECTED: "已断开",
        STALLED: "UI节流"
      };
      const existingRoomIds = new Set(
        Array.from(tabList.children).map((node) => node.dataset.roomId).filter(Boolean)
      );
      tabIds.forEach((roomId) => {
        const tabData = state.tabs[roomId];
        let existingItem = tabList.querySelector(`[data-room-id="${roomId}"]`);
        let currentStatusText = tabData.statusText;
        if (tabData.status === "WAITING" && tabData.countdown?.endTime && (!currentStatusText || currentStatusText.startsWith("倒计时") || currentStatusText === "寻找任务中...")) {
          const remainingSeconds = (tabData.countdown.endTime - Date.now()) / 1e3;
          if (remainingSeconds > 0) {
            currentStatusText = `倒计时 ${Utils.formatTime(remainingSeconds)}`;
          } else {
            currentStatusText = "等待开抢...";
          }
        }
        if (existingItem) {
          const nicknameEl = existingItem.querySelector(".identity-nickname") || existingItem.querySelector(".qmx-tab-nickname");
          const statusNameEl = existingItem.querySelector(".qmx-tab-status-name");
          const statusTextEl = existingItem.querySelector(".qmx-tab-status-text");
          const dotEl = existingItem.querySelector(".qmx-tab-status-dot");
          if (tabData.nickname && nicknameEl && nicknameEl.textContent !== tabData.nickname) {
            nicknameEl.textContent = tabData.nickname;
          }
          const newStatusName = `[${statusDisplayMap[tabData.status] || tabData.status}]`;
          if (statusNameEl.textContent !== newStatusName) {
            statusNameEl.textContent = newStatusName;
            dotEl.style.backgroundColor = `var(--status-color-${tabData.status.toLowerCase()}, #9E9E9E)`;
          }
          if (statusTextEl.textContent !== currentStatusText) {
            statusTextEl.textContent = currentStatusText;
          }
          let prizesContainer = existingItem.querySelector(".qmx-tab-prizes");
          const newPrizesHtml = this.generatePrizesHTML(tabData.prizes);
          if (newPrizesHtml) {
            if (!prizesContainer) {
              const closeBtn = existingItem.querySelector(".qmx-tab-close-btn");
              if (closeBtn) {
                closeBtn.insertAdjacentHTML("beforebegin", newPrizesHtml);
              } else {
                existingItem.insertAdjacentHTML("beforeend", newPrizesHtml);
              }
            } else {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = newPrizesHtml;
              const newContainer = tempDiv.firstElementChild;
              const oldLayoutClass = prizesContainer.classList.contains("multi-prizes") ? "multi-prizes" : "single-prize";
              const newLayoutClass = newContainer.classList.contains("multi-prizes") ? "multi-prizes" : "single-prize";
              const oldText = prizesContainer.textContent.trim();
              const newText = newContainer.textContent.trim();
              if (oldLayoutClass !== newLayoutClass || oldText !== newText) {
                prizesContainer.outerHTML = newPrizesHtml;
              }
            }
          } else if (prizesContainer) {
            prizesContainer.remove();
          }
        } else {
          const newItem = this.createTaskItem(roomId, tabData, statusDisplayMap, currentStatusText);
          tabList.appendChild(newItem);
          requestAnimationFrame(() => {
            newItem.classList.add("qmx-item-enter-active");
            setTimeout(() => newItem.classList.remove("qmx-item-enter"), 300);
          });
        }
      });
      existingRoomIds.forEach((roomId) => {
        if (!state.tabs[roomId]) {
          const itemToRemove = tabList.querySelector(`[data-room-id="${roomId}"]`);
          if (itemToRemove && !itemToRemove.classList.contains("qmx-item-exit-active")) {
            Utils.log(`[Render] 房间 ${roomId}: 在最新状态中已消失，执行移除。`);
            itemToRemove.classList.add("qmx-item-exit-active");
            setTimeout(() => itemToRemove.remove(), 300);
          }
        }
      });
      const emptyMsg = tabList.querySelector(".qmx-empty-list-msg");
      if (tabIds.length === 0) {
        if (!emptyMsg) {
          tabList.innerHTML = '<div class="qmx-tab-list-item qmx-empty-list-msg">没有正在运行的任务</div>';
        }
      } else if (emptyMsg) {
        emptyMsg.remove();
      }
      this.renderLimitStatus();
    },
renderLimitStatus() {
      let limitState = GlobalState.getDailyLimit();
      let limitMessageEl = document.getElementById("qmx-limit-message");
      const openBtn = document.getElementById("qmx-modal-open-btn");
      if (limitState?.reached && Utils.formatDateAsBeijing(new Date(limitState.timestamp)) !== Utils.formatDateAsBeijing( new Date())) {
        Utils.log("[控制中心] 新的一天，重置每日上限旗标。");
        GlobalState.setDailyLimit(false);
        limitState = null;
      }
      if (limitState?.reached) {
        if (!limitMessageEl) {
          limitMessageEl = document.createElement("div");
          limitMessageEl.id = "qmx-limit-message";
          limitMessageEl.style.cssText = "padding: 10px 24px; background-color: var(--status-color-error); color: white; font-weight: 500; text-align: center;";
          const header = document.querySelector(".qmx-modal-header");
          header.parentNode.insertBefore(limitMessageEl, header.nextSibling);
          document.querySelector(".qmx-modal-header").after(limitMessageEl);
        }
        if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
          limitMessageEl.textContent = "今日已达上限。任务休眠中，可新增标签页为明日准备。";
          openBtn.disabled = false;
          openBtn.textContent = "新增休眠标签页";
        } else {
          limitMessageEl.textContent = "今日已达上限。任务已全部停止。";
          openBtn.disabled = true;
          openBtn.textContent = "今日已达上限";
        }
      } else {
        if (limitMessageEl) limitMessageEl.remove();
        openBtn.disabled = false;
        openBtn.textContent = "打开新房间";
      }
    },
async openOneNewTab() {
      const openBtn = document.getElementById("qmx-modal-open-btn");
      if (openBtn.disabled) return;
      const state = GlobalState.get();
      const openedCount = Object.keys(state.tabs).length;
      if (openedCount >= SETTINGS.MAX_WORKER_TABS) {
        Utils.log(`已达到最大标签页数量 (${SETTINGS.MAX_WORKER_TABS})。`);
        return;
      }
      openBtn.disabled = true;
      openBtn.textContent = "正在查找...";
      try {
        const openedRoomIds = new Set(Object.keys(state.tabs));
        const apiRoomUrls = await DouyuAPI.getRooms(SETTINGS.API_ROOM_FETCH_COUNT, SETTINGS.CONTROL_ROOM_ID);
        const newUrl = apiRoomUrls.find((url) => {
          const rid = url.match(/\/(\d+)/)?.[1];
          return rid && !openedRoomIds.has(rid);
        });
        if (newUrl) {
          const newRoomId = newUrl.match(/\/(\d+)/)[1];
          const pendingWorkers = GM_getValue("qmx_pending_workers", []);
          pendingWorkers.push(newRoomId);
          GM_setValue("qmx_pending_workers", pendingWorkers);
          Utils.log(`已将房间 ${newRoomId} 加入待处理列表。`);
          GlobalState.updateWorker(newRoomId, "OPENING", "正在打开...");
          if (window.location.href.includes("/beta") || localStorage.getItem("newWebLive") !== "A") {
            localStorage.setItem("newWebLive", "A");
          }
          GM_openInTab(newUrl, { active: false, setParent: true });
          Utils.log(`打开指令已发送: ${newUrl}`);
        } else {
          Utils.log("未能找到新的、未打开的房间。");
          openBtn.textContent = "无新房间";
          await Utils.sleep(SETTINGS.UI_FEEDBACK_DELAY);
        }
      } catch (error) {
        Utils.log(`查找或打开房间时出错: ${error.message}`);
        openBtn.textContent = "查找出错";
        await Utils.sleep(SETTINGS.UI_FEEDBACK_DELAY);
      } finally {
        openBtn.disabled = false;
      }
    },
setupDrag(element, storageKey, onClick, handle = element) {
      let isMouseDown = false;
      let hasDragged = false;
      let startX, startY, initialX, initialY;
      const clickThreshold = 5;
      const setPosition = (x, y) => {
        element.style.setProperty("--tx", `${x}px`);
        element.style.setProperty("--ty", `${y}px`);
      };
      const savedPos = GM_getValue(storageKey);
      let currentRatio = null;
      if (savedPos) {
        if (typeof savedPos.ratioX === "number" && typeof savedPos.ratioY === "number") {
          currentRatio = savedPos;
        } else if (SETTINGS.CONVERT_LEGACY_POSITION && typeof savedPos.x === "number" && typeof savedPos.y === "number") {
          Utils.log(`[位置迁移] 发现旧的像素位置，正在转换为比例位置...`);
          const movableWidth = window.innerWidth - element.offsetWidth;
          const movableHeight = window.innerHeight - element.offsetHeight;
          currentRatio = {
            ratioX: Math.max(0, Math.min(1, savedPos.x / movableWidth)),
            ratioY: Math.max(0, Math.min(1, savedPos.y / movableHeight))
          };
          GM_setValue(storageKey, currentRatio);
        }
      }
      if (currentRatio) {
        const newX = currentRatio.ratioX * (window.innerWidth - element.offsetWidth);
        const newY = currentRatio.ratioY * (window.innerHeight - element.offsetHeight);
        setPosition(newX, newY);
      } else {
        if (element.id === SETTINGS.DRAGGABLE_BUTTON_ID) {
          const padding = SETTINGS.DRAG_BUTTON_DEFAULT_PADDING;
          const defaultX = window.innerWidth - element.offsetWidth - padding;
          const defaultY = padding;
          setPosition(defaultX, defaultY);
        } else {
          const defaultX = (window.innerWidth - element.offsetWidth) / 2;
          const defaultY = (window.innerHeight - element.offsetHeight) / 2;
          setPosition(defaultX, defaultY);
        }
      }
      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        isMouseDown = true;
        hasDragged = false;
        const rect = element.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialX = rect.left;
        initialY = rect.top;
        element.classList.add("is-dragging");
        handle.style.cursor = "grabbing";
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp, { once: true });
      };
      const onMouseMove = (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!hasDragged && Math.sqrt(dx * dx + dy * dy) > clickThreshold) {
          hasDragged = true;
        }
        let newX = initialX + dx;
        let newY = initialY + dy;
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        setPosition(newX, newY);
      };
      const onMouseUp = () => {
        isMouseDown = false;
        document.removeEventListener("mousemove", onMouseMove);
        element.classList.remove("is-dragging");
        handle.style.cursor = "grab";
        if (hasDragged) {
          const finalRect = element.getBoundingClientRect();
          const movableWidth = window.innerWidth - element.offsetWidth;
          const movableHeight = window.innerHeight - element.offsetHeight;
          const ratioX = movableWidth > 0 ? Math.max(0, Math.min(1, finalRect.left / movableWidth)) : 0;
          const ratioY = movableHeight > 0 ? Math.max(0, Math.min(1, finalRect.top / movableHeight)) : 0;
          GM_setValue(storageKey, { ratioX, ratioY });
        } else if (onClick && typeof onClick === "function") {
          onClick();
        }
      };
      handle.addEventListener("mousedown", onMouseDown);
    },
showPanel() {
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      const modalContainer = document.getElementById("qmx-modal-container");
      mainButton.classList.add("hidden");
      if (this.isPanelInjected) {
        this.injectionTarget.classList.add("qmx-hidden");
        modalContainer.classList.remove("qmx-hidden");
      } else {
        modalContainer.classList.add("visible");
        if (SETTINGS.MODAL_DISPLAY_MODE === "centered") {
          document.getElementById("qmx-modal-backdrop").classList.add("visible");
        }
      }
      Utils.log("控制面板已显示。");
    },
hidePanel() {
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      const modalContainer = document.getElementById("qmx-modal-container");
      mainButton.classList.remove("hidden");
      if (this.isPanelInjected) {
        modalContainer.classList.add("qmx-hidden");
        if (this.injectionTarget) {
          this.injectionTarget.classList.remove("qmx-hidden");
        }
      } else {
        modalContainer.classList.remove("visible");
        if (SETTINGS.MODAL_DISPLAY_MODE === "centered") {
          document.getElementById("qmx-modal-backdrop").classList.remove("visible");
        }
      }
      Utils.log("控制面板已隐藏。");
    },
createTaskItem(roomId, tabData, statusMap, statusText) {
      const newItem = document.createElement("div");
      newItem.className = "qmx-tab-list-item qmx-item-enter";
      newItem.dataset.roomId = roomId;
      const statusColor = `var(--status-color-${tabData.status.toLowerCase()}, #9E9E9E)`;
      const nickname = tabData.nickname || "加载中...";
      const statusName = statusMap[tabData.status] || tabData.status;
      const prizesHtml = this.generatePrizesHTML(tabData.prizes);
      newItem.innerHTML = `
                <div class="qmx-tab-status-dot" style="background-color: ${statusColor};"></div>
                <div class="qmx-tab-info">
                    <div class="qmx-tab-header">
                        <button class="qmx-tab-identity" type="button" data-state="nickname" title="点击切换或复制">
                            <span class="qmx-tab-identity-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" role="img" focusable="false">
                                    <path d="M8 7h3v2H8v9H6V9H3V7h3V4h2v3zm7 0h6v2h-6v9h-2V7h2z" fill="currentColor"></path>
                                </svg>
                            </span>
                            <span class="qmx-tab-identity-text">
                                <span class="identity-nickname">${nickname}</span>
                                <span class="identity-roomid">${roomId}</span>
                            </span>
                        </button>
                    </div>
                    <div class="qmx-tab-details">
                        <span class="qmx-tab-status-name">[${statusName}]</span>
                        <span class="qmx-tab-status-text">${statusText}</span>
                    </div>
                </div>
                ${prizesHtml}
                <button class="qmx-tab-close-btn" title="关闭该标签页">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
      const identityBtn = newItem.querySelector(".qmx-tab-identity");
      const nicknameSpan = identityBtn.querySelector(".identity-nickname");
      const roomIdSpan = identityBtn.querySelector(".identity-roomid");
      const iconSpan = identityBtn.querySelector(".qmx-tab-identity-icon");
      const setIdentityState = (state) => {
        identityBtn.dataset.state = state;
      };
      const copyIdentityValue = async (state) => {
        const value = state === "room" ? roomIdSpan.textContent.trim() : nicknameSpan.textContent.trim();
        const label = state === "room" ? "房间号" : "房间名";
        try {
          await navigator.clipboard.writeText(value);
          identityBtn.classList.add("copied");
          setTimeout(() => identityBtn.classList.remove("copied"), 300);
          Utils.log(`[房间号切换] 已复制${label}: ${value}`);
        } catch (err) {
          Utils.log(`[房间号切换] 复制失败: ${err.message}`);
        }
      };
      iconSpan.addEventListener("click", async (e) => {
        e.stopPropagation();
        const currentState = identityBtn.dataset.state === "room" ? "room" : "nickname";
        await copyIdentityValue(currentState);
      });
      identityBtn.addEventListener("click", (e) => {
        if (e.target.closest(".qmx-tab-identity-icon")) {
          return;
        }
        e.stopPropagation();
        const currentState = identityBtn.dataset.state === "room" ? "room" : "nickname";
        const nextState = currentState === "nickname" ? "room" : "nickname";
        setIdentityState(nextState);
      });
      identityBtn.addEventListener(
        "mouseenter",
        () => Utils.log(`[房间号切换] 鼠标悬停在房间胶囊: ${roomId}`),
        { once: true }
      );
      return newItem;
    },
generatePrizesHTML(prizes) {
      if (!prizes || !Array.isArray(prizes) || prizes.length === 0) return "";
      const layoutClass = prizes.length > 1 ? "multi-prizes" : "single-prize";
      return `<div class="qmx-tab-prizes ${layoutClass}">` + prizes.map((p, index) => {
        let icon = ICONS.GOLD;
        if (prizes.length === 2 && index === 1) {
          icon = ICONS.STARLIGHT;
        }
        return `<div class="qmx-tab-prize-item" title="${p.name || p.text}">
                    ${icon}
                    <span class="qmx-tab-prize-text">${p.text}</span>
                </div>`;
      }).join("") + `</div>`;
    },
applyModalMode() {
      const modalContainer = this.modalContainer || document.getElementById("qmx-modal-container");
      if (!modalContainer) return;
      const mode = SETTINGS.MODAL_DISPLAY_MODE;
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      Utils.log(`尝试应用模态框模式: ${mode}`);
      if (this.isPanelInjected && mode !== "inject-rank-list") {
        if (this.injectionTarget) {
          this.injectionTarget.classList.remove("qmx-hidden");
        }
        document.body.appendChild(modalContainer);
        this.isPanelInjected = false;
        this.injectionTarget = null;
        modalContainer.classList.remove("mode-inject-rank-list", "qmx-hidden");
        if (mainButton && mainButton.classList.contains("hidden")) {
          modalContainer.classList.add("visible");
        } else {
          modalContainer.classList.remove("visible");
        }
      }
      if (mode === "inject-rank-list") {
        const waitForTarget = (retries = SETTINGS.INJECT_TARGET_RETRIES, interval = SETTINGS.INJECT_TARGET_INTERVAL) => {
          const target = document.querySelector(SETTINGS.SELECTORS.rankListContainer);
          if (target) {
            if (this.isPanelInjected && this.injectionTarget === target && modalContainer.parentNode === target.parentNode) {
              return;
            }
            Utils.log("执行注入逻辑...");
            if (this.injectionTarget && this.injectionTarget !== target) {
              this.injectionTarget.classList.remove("qmx-hidden");
            }
            this.injectionTarget = target;
            this.isPanelInjected = true;
            target.parentNode.insertBefore(modalContainer, target.nextSibling);
            modalContainer.classList.add("mode-inject-rank-list");
            modalContainer.classList.remove("mode-centered", "mode-floating");
            if (mainButton && mainButton.classList.contains("hidden")) {
              modalContainer.classList.remove("qmx-hidden");
              this.injectionTarget.classList.add("qmx-hidden");
            } else {
              modalContainer.classList.add("qmx-hidden");
              this.injectionTarget.classList.remove("qmx-hidden");
            }
            modalContainer.classList.remove("visible");
          } else if (retries > 0) {
            setTimeout(() => waitForTarget(retries - 1, interval), interval);
          } else {
            Utils.log(`[注入失败] 未找到目标元素 "${SETTINGS.SELECTORS.rankListContainer}"。`);
            Utils.log("[降级] 自动切换到 'floating' 备用模式。");
            SETTINGS.MODAL_DISPLAY_MODE = "floating";
            this.applyModalMode();
          }
        };
        waitForTarget();
        return;
      }
      this.isPanelInjected = false;
      modalContainer.classList.remove("mode-inject-rank-list", "qmx-hidden");
      modalContainer.classList.remove("mode-centered", "mode-floating");
      modalContainer.classList.add(`mode-${mode}`);
    },
correctPosition(elementId, storageKey) {
      const element = document.getElementById(elementId);
      if (!element) return;
      const savedPos = GM_getValue(storageKey);
      if (savedPos && typeof savedPos.ratioX === "number" && typeof savedPos.ratioY === "number") {
        const newX = savedPos.ratioX * (window.innerWidth - element.offsetWidth);
        const newY = savedPos.ratioY * (window.innerHeight - element.offsetHeight);
        element.style.setProperty("--tx", `${newX}px`);
        element.style.setProperty("--ty", `${newY}px`);
      }
    },
correctButtonPosition() {
      this.correctPosition(SETTINGS.DRAGGABLE_BUTTON_ID, SETTINGS.BUTTON_POS_STORAGE_KEY);
    },
correctModalPosition() {
      if (SETTINGS.MODAL_DISPLAY_MODE !== "floating" || this.isPanelInjected) {
        return;
      }
      this.correctPosition("qmx-modal-container", "douyu_qmx_modal_position");
    },
clearClosedTabs() {
      const state = GlobalState.get();
      if (state.tabs && Object.keys(state.tabs).length > 0) {
        Utils.log("检测到残留的标签页状态，正在清空...");
        state.tabs = {};
        GlobalState.set(state);
        Utils.log("已清空残留的标签页状态");
      }
    }
  };
  const DOM = {
async findElement(selector, timeout = SETTINGS.PANEL_WAIT_TIMEOUT, parent = document, validator = null) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        const elements = parent.querySelectorAll(selector);
        for (const element of elements) {
          if (window.getComputedStyle(element).display === "none") {
            continue;
          }
          if (validator && !validator(element)) {
            continue;
          }
          return element;
        }
        await Utils.sleep(300);
      }
      Utils.log(`查找元素超时: ${selector}`);
      return null;
    },
async safeClick(element, description) {
      if (!element) {
        return false;
      }
      try {
        if (window.getComputedStyle(element).display === "none") {
          return false;
        }
        await Utils.sleep(Utils.getRandomDelay(SETTINGS.MIN_DELAY / 2, SETTINGS.MAX_DELAY / 2));
        element.click();
        await Utils.sleep(Utils.getRandomDelay());
        return true;
      } catch (error) {
        Utils.log(`[点击异常] ${description} 时发生错误: ${error.message}`);
        return false;
      }
    },
async checkForLimitPopup() {
      const limitPopup = await this.findElement(SETTINGS.SELECTORS.limitReachedPopup, 3e3);
      if (limitPopup && limitPopup.textContent.includes("已达上限")) {
        Utils.log("捕获到“已达上限”弹窗！");
        return true;
      }
      return false;
    }
  };
  const WorkerPage = {
healthCheckTimeoutId: null,
    currentTaskEndTime: null,
    lastHealthCheckTime: null,
    lastPageCountdown: null,
    stallLevel: 0,
remainingTimeMap: new Map(),
consecutiveStallCount: 0,
    previousDeviation: 0,

async init() {
      Utils.log("混合模式工作单元初始化...");
      const roomId = Utils.getCurrentRoomId();
      if (!roomId) {
        Utils.log("无法识别当前房间ID，脚本停止。");
        return;
      }
      GlobalState.updateWorker(roomId, "OPENING", "页面加载中...", { countdown: null, nickname: null });
      await Utils.sleep(1e3);
      this.startCommandListener(roomId);
      window.addEventListener("beforeunload", () => {
        GlobalState.updateWorker(Utils.getCurrentRoomId(), "DISCONNECTED", "连接已断开...");
        if (this.pauseSentinelInterval) {
          clearInterval(this.pauseSentinelInterval);
        }
      });
      Utils.log("正在等待页面关键元素 (#js-player-video) 加载...");
      const criticalElement = await DOM.findElement(SETTINGS.SELECTORS.criticalElement, SETTINGS.ELEMENT_WAIT_TIMEOUT);
      if (!criticalElement) {
        Utils.log("页面关键元素加载超时，此标签页可能无法正常工作，即将关闭。");
        await this.selfClose(roomId);
        return;
      }
      Utils.log("页面关键元素已加载。");
      Utils.log("开始检测 UI 版本 和红包活动...");
      if (window.location.href.includes("/beta")) {
        GlobalState.updateWorker(roomId, "OPENING", "切换旧版UI...");
        localStorage.setItem("newWebLive", "A");
        window.location.href = window.location.href.replace("/beta", "");
      }
      Utils.log("确认进入稳定工作状态，执行身份核销。");
      const pendingWorkers = GM_getValue("qmx_pending_workers", []);
      const myIndex = pendingWorkers.indexOf(roomId);
      if (myIndex > -1) {
        pendingWorkers.splice(myIndex, 1);
        GM_setValue("qmx_pending_workers", pendingWorkers);
        Utils.log(`房间 ${roomId} 已从待处理列表中移除。`);
      }
      const anchorNameElement = document.querySelector(SETTINGS.SELECTORS.anchorName);
      const nickname = anchorNameElement ? anchorNameElement.textContent.trim() : `房间${roomId}`;
      GlobalState.updateWorker(roomId, "WAITING", "寻找任务中...", { nickname, countdown: null });
      const limitState = GlobalState.getDailyLimit();
      if (limitState?.reached) {
        Utils.log("初始化检查：检测到全局上限旗标。");
        if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
          await this.enterDormantMode();
        } else {
          await this.selfClose(roomId);
        }
        return;
      }
      this.findAndExecuteNextTask(roomId);
      if (SETTINGS.AUTO_PAUSE_ENABLED) {
        this.pauseSentinelInterval = setInterval(() => this.autoPauseVideo(), 8e3);
      }
    },
    async findAndExecuteNextTask(roomId) {
      if (this.healthCheckTimeoutId) {
        clearTimeout(this.healthCheckTimeoutId);
        this.healthCheckTimeoutId = null;
      }
      this.stallLevel = 0;
      const limitState = GlobalState.getDailyLimit();
      if (limitState?.reached) {
        Utils.log(`[上限检查] 房间 ${roomId} 检测到已达每日上限。`);
        if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
          await this.enterDormantMode();
        } else {
          await this.selfClose(roomId);
        }
        return;
      }
      if (SETTINGS.AUTO_PAUSE_ENABLED) this.autoPauseVideo();
      Utils.log(`[调试] 开始在房间 ${roomId} 寻找红包...`);
      const outerContainers = document.querySelectorAll(SETTINGS.SELECTORS.redEnvelopeContainer);
      let redEnvelopeDiv = null;
      let statusText = "";
      let countdownText = "";
      let foundValidContainer = false;
      for (let i = 0; i < outerContainers.length; i++) {
        const outer = outerContainers[i];
        const hasBoxIcon = outer.querySelector(SETTINGS.SELECTORS.boxIcon);
        if (!hasBoxIcon) {
          continue;
        }
        foundValidContainer = true;
        const headlineElem = outer.querySelector(SETTINGS.SELECTORS.statusHeadline);
        const headline = headlineElem ? headlineElem.textContent.trim() : "";
        const contentElem = outer.querySelector(SETTINGS.SELECTORS.countdownTimer);
        const content = contentElem ? contentElem.textContent.trim() : "";
        Utils.log(`[调试] 容器 #${i} 标题: "${headline}" | 内容: "${content}"`);
        if (headline.includes("倒计时") && content.includes(":")) {
          redEnvelopeDiv = outer;
          statusText = headline;
          countdownText = content;
          break;
        } else if (headline.includes("可领取") || headline.includes("立即")) {
          redEnvelopeDiv = outer;
          statusText = headline;
          countdownText = "";
          break;
        }
        if (!redEnvelopeDiv) {
          redEnvelopeDiv = outer;
          statusText = headline;
          countdownText = content;
        }
      }
      if (!foundValidContainer) {
        Utils.log(`[调试] 初次查找未发现红包容器，等待 ${SETTINGS.RED_ENVELOPE_LOAD_TIMEOUT / 1e3} 秒后重新检查...`);
        const waitedDiv = await this.waitForRedEnvelopeContainer(SETTINGS.RED_ENVELOPE_LOAD_TIMEOUT);
        if (!waitedDiv) {
          Utils.log("[判断] 超时未找到红包容器，判定活动已结束。");
          GlobalState.updateWorker(roomId, "SWITCHING", "活动已结束, 切换中", { countdown: null });
          await this.switchRoom();
          return;
        }
        foundValidContainer = true;
        const headlineElem = waitedDiv.querySelector(SETTINGS.SELECTORS.statusHeadline);
        const contentElem = waitedDiv.querySelector(SETTINGS.SELECTORS.countdownTimer);
        statusText = headlineElem ? headlineElem.textContent.trim() : "";
        countdownText = contentElem ? contentElem.textContent.trim() : "";
        redEnvelopeDiv = waitedDiv;
      }
      if (countdownText.includes(":")) {
        const timeMatch = countdownText.match(/(\d+):(\d+)/);
        if (timeMatch) {
          const minutes = parseInt(timeMatch[1]);
          const seconds = parseInt(timeMatch[2]);
          const remainingSeconds = minutes * 60 + seconds;
          const currentCount = this.remainingTimeMap.get(remainingSeconds) || 0;
          this.remainingTimeMap.set(remainingSeconds, currentCount + 1);
          if (Array.from(this.remainingTimeMap.values()).some((value) => value > 3)) {
            GlobalState.updateWorker(roomId, "SWITCHING", "倒计时卡死, 切换中", { countdown: null });
            await this.switchRoom();
            return;
          }
          this.currentTaskEndTime = Date.now() + remainingSeconds * 1e3;
          Utils.log(`[任务] 识别到倒计时: ${timeMatch[0]}`);
          const prizes = await this.extractPrizeInfo(redEnvelopeDiv);
          GlobalState.updateWorker(roomId, "WAITING", `倒计时 ${timeMatch[0]}`, {
            countdown: { endTime: this.currentTaskEndTime },
            prizes
          });
          const wakeUpDelay = Math.max(0, remainingSeconds * 1e3 - 1500);
          setTimeout(() => this.claimAndRecheck(roomId), wakeUpDelay);
          this.startHealthChecks(roomId, redEnvelopeDiv);
        } else {
          Utils.log(`[错误] 无法解析时间: "${countdownText}"`);
          setTimeout(() => this.findAndExecuteNextTask(roomId), 5e3);
        }
      } else if (/可领取|立即/.test(statusText)) {
        Utils.log(`[任务] 检测到可领取状态: ${statusText}`);
        GlobalState.updateWorker(roomId, "CLAIMING", "立即领取中...");
        await this.claimAndRecheck(roomId);
      } else {
        Utils.log(`[警告] 红包容器存在但状态无法识别 - 标题: "${statusText}" | 内容: "${countdownText}"`);
        if (statusText.includes("已领完") || statusText.includes("已结束") || statusText.includes("已抢完")) {
          Utils.log("[判断] 红包已领完或活动已结束。");
          GlobalState.updateWorker(roomId, "SWITCHING", "红包已领完, 切换中", { countdown: null });
          await this.switchRoom();
        } else {
          GlobalState.updateWorker(roomId, "WAITING", `状态未知, 重试中...`, { countdown: null });
          setTimeout(() => this.findAndExecuteNextTask(roomId), 5e3);
        }
      }
    },
async extractPrizeInfo(redEnvelopeDiv) {
      try {
        Utils.log("[奖励提取] 开始提取奖励信息...");
        const clickableContainer = redEnvelopeDiv.querySelector(SETTINGS.SELECTORS.clickableContainer);
        if (!clickableContainer) {
          Utils.log("[奖励提取] 未找到可点击容器");
          return null;
        }
        if (!await DOM.safeClick(clickableContainer, "红包容器（提取奖励）")) {
          Utils.log("[奖励提取] 点击失败");
          return null;
        }
        const popup = await DOM.findElement(SETTINGS.SELECTORS.popupModal, 3e3);
        if (!popup) {
          Utils.log("[奖励提取] 弹窗未出现");
          return null;
        }
        await Utils.sleep(500);
        const prizes = [];
        const prizeContainer = popup.querySelector(SETTINGS.SELECTORS.prizeContainer);
        if (prizeContainer) {
          const prizeItems = prizeContainer.querySelectorAll(SETTINGS.SELECTORS.prizeItem);
          Utils.log(`[奖励提取] 找到 ${prizeItems.length} 个奖励项容器`);
          for (const item of prizeItems) {
            const imgElement = item.querySelector(SETTINGS.SELECTORS.prizeImage);
            const countElement = item.querySelector(SETTINGS.SELECTORS.prizeCount);
            if (imgElement && countElement && countElement.textContent.trim()) {
              const prizeData = {
                img: imgElement.src,
                text: countElement.textContent.trim(),
                name: imgElement.getAttribute("alt") || ""
              };
              Utils.log(`[奖励提取] ✓ 提取到奖励: ${prizeData.text}, 名称: ${prizeData.name}`);
              prizes.push(prizeData);
            } else {
              Utils.log(`[奖励提取] ✗ 跳过不完整项 - 图片: ${!!imgElement}, 数量: ${countElement ? `"${countElement.textContent.trim()}"` : "null"}`);
            }
          }
        } else {
          Utils.log("[奖励提取] 未找到奖励容器");
        }
        Utils.log(`[奖励提取] 成功提取 ${prizes.length} 个有效奖励`);
        const closeBtn = popup.querySelector(SETTINGS.SELECTORS.closeButton);
        if (closeBtn) {
          await DOM.safeClick(closeBtn, "关闭按钮（提取奖励）");
          await Utils.sleep(300);
        }
        return prizes.length > 0 ? prizes : null;
      } catch (error) {
        Utils.log(`[奖励提取] 提取失败: ${error.message}`);
        try {
          const closeBtn = document.querySelector(SETTINGS.SELECTORS.closeButton);
          if (closeBtn) {
            await DOM.safeClick(closeBtn, "关闭按钮（异常）");
          }
        } catch {
        }
        return null;
      }
    },
startHealthChecks(roomId, redEnvelopeDiv) {
      const CHECK_INTERVAL = SETTINGS.HEALTHCHECK_INTERVAL;
      const STALL_THRESHOLD = 4;
      const check = () => {
        const contentElem = redEnvelopeDiv.querySelector(SETTINGS.SELECTORS.countdownTimer);
        const headlineElem = redEnvelopeDiv.querySelector(SETTINGS.SELECTORS.statusHeadline);
        const currentPageContent = contentElem ? contentElem.textContent.trim() : "";
        const currentPageHeadline = headlineElem ? headlineElem.textContent.trim() : "";
        if (!currentPageHeadline.includes("倒计时") || !currentPageContent.includes(":")) {
          Utils.log("[哨兵] 检测到状态变化，停止监控。");
          return;
        }
        const scriptRemainingSeconds = (this.currentTaskEndTime - Date.now()) / 1e3;
        const timeMatch = currentPageContent.match(/(\d+):(\d+)/);
        if (!timeMatch) {
          Utils.log("[哨兵] 无法解析UI倒计时，跳过本次检查。");
          return;
        }
        const pMin = parseInt(timeMatch[1]);
        const pSec = parseInt(timeMatch[2]);
        const pageRemainingSeconds = pMin * 60 + pSec;
        const deviation = Math.abs(scriptRemainingSeconds - pageRemainingSeconds);
        const currentFormattedTime = Utils.formatTime(scriptRemainingSeconds);
        const pageFormattedTime = Utils.formatTime(pageRemainingSeconds);
        Utils.log(
          `[哨兵] 脚本倒计时: ${currentFormattedTime} | UI显示: ${pageFormattedTime} | 差值: ${deviation.toFixed(2)}秒`
        );
        Utils.log(`校准模式开启状态为 ${SETTINGS.CALIBRATION_MODE_ENABLED ? "开启" : "关闭"}`);
        if (SETTINGS.CALIBRATION_MODE_ENABLED) {
          if (deviation <= STALL_THRESHOLD) {
            const difference = scriptRemainingSeconds - pageRemainingSeconds;
            this.currentTaskEndTime = Date.now() + pageRemainingSeconds * 1e3;
            if (deviation > 0.1) {
              const direction = difference > 0 ? "慢" : "快";
              const calibrationMessage = `${direction}${deviation.toFixed(1)}秒, 已校准`;
              Utils.log(`[校准] ${calibrationMessage}。新倒计时: ${pageFormattedTime}`);
              GlobalState.updateWorker(roomId, "WAITING", calibrationMessage, {
                countdown: { endTime: this.currentTaskEndTime }
              });
              setTimeout(() => {
                if (this.currentTaskEndTime > Date.now()) {
                  GlobalState.updateWorker(roomId, "WAITING", `倒计时...`, {
                    countdown: { endTime: this.currentTaskEndTime }
                  });
                }
              }, 2500);
            } else {
              GlobalState.updateWorker(roomId, "WAITING", `倒计时...`, {
                countdown: { endTime: this.currentTaskEndTime }
              });
            }
            this.consecutiveStallCount = 0;
            this.previousDeviation = 0;
            this.stallLevel = 0;
          } else {
            const deviationIncreasing = deviation > this.previousDeviation;
            this.previousDeviation = deviation;
            if (deviationIncreasing) {
              this.consecutiveStallCount++;
              Utils.log(`[警告] 检测到UI卡顿第 ${this.consecutiveStallCount} 次，差值: ${deviation.toFixed(2)}秒`);
            } else {
              this.consecutiveStallCount = Math.max(0, this.consecutiveStallCount - 1);
            }
            if (this.consecutiveStallCount >= 3) {
              Utils.log(`[严重] 连续检测到卡顿且差值增大，判定为卡死状态。`);
              GlobalState.updateWorker(roomId, "SWITCHING", "倒计时卡死, 切换中", { countdown: null });
              clearTimeout(this.healthCheckTimeoutId);
              this.switchRoom();
              return;
            }
            this.stallLevel = 1;
            GlobalState.updateWorker(roomId, "ERROR", `UI卡顿 (${deviation.toFixed(1)}秒)`, {
              countdown: { endTime: this.currentTaskEndTime }
            });
          }
        } else {
          if (deviation > STALL_THRESHOLD) {
            if (this.stallLevel === 0) {
              Utils.log(`[哨兵] 检测到UI节流。脚本精确倒计时: ${currentFormattedTime} | UI显示: ${pageFormattedTime}`);
            }
            this.stallLevel = 1;
            GlobalState.updateWorker(roomId, "STALLED", `UI节流中...`, {
              countdown: { endTime: this.currentTaskEndTime }
            });
          } else {
            if (this.stallLevel > 0) {
              Utils.log("[哨兵] UI已从节流中恢复。");
              this.stallLevel = 0;
            }
            GlobalState.updateWorker(roomId, "WAITING", `倒计时 ${currentFormattedTime}`, {
              countdown: { endTime: this.currentTaskEndTime }
            });
          }
        }
        if (scriptRemainingSeconds > CHECK_INTERVAL / 1e3 + 1) {
          this.healthCheckTimeoutId = setTimeout(check, CHECK_INTERVAL);
        }
      };
      this.healthCheckTimeoutId = setTimeout(check, CHECK_INTERVAL);
    },
async claimAndRecheck(roomId) {
      if (this.healthCheckTimeoutId) {
        clearTimeout(this.healthCheckTimeoutId);
        this.healthCheckTimeoutId = null;
      }
      Utils.log(`[领取] 房间 ${roomId} 准备触发红包弹窗...`);
      GlobalState.updateWorker(roomId, "CLAIMING", "尝试打开红包...", { countdown: null });
      const outerContainers = document.querySelectorAll(SETTINGS.SELECTORS.redEnvelopeContainer);
      let targetBtn = null;
      for (const outer of outerContainers) {
        const hasBoxIcon = outer.querySelector(SETTINGS.SELECTORS.boxIcon);
        if (!hasBoxIcon) {
          continue;
        }
        const innerContainer = outer.querySelector(SETTINGS.SELECTORS.clickableContainer);
        if (!innerContainer) {
          continue;
        }
        const headlineElem = outer.querySelector(SETTINGS.SELECTORS.statusHeadline);
        const contentElem = outer.querySelector(SETTINGS.SELECTORS.countdownTimer);
        const headline = headlineElem ? headlineElem.textContent.trim() : "";
        const content = contentElem ? contentElem.textContent.trim() : "";
        if (headline.includes("倒计时") && content.includes(":") || headline.includes("可领取") || headline.includes("立即")) {
          targetBtn = innerContainer;
          Utils.log(`[领取] 锁定点击目标 - 标题: "${headline}" | 内容: "${content}"`);
          break;
        }
      }
      if (!targetBtn) {
        Utils.log("[领取] 未能锁定有效的点击目标，尝试兜底查找...");
        const outerDiv = await DOM.findElement(SETTINGS.SELECTORS.redEnvelopeContainer, 3e3);
        if (outerDiv) {
          targetBtn = outerDiv.querySelector(SETTINGS.SELECTORS.clickableContainer) || outerDiv;
        }
      }
      if (!await DOM.safeClick(targetBtn, "红包内层容器")) {
        Utils.log("[领取] 点击失败，重新寻找任务。");
        await Utils.sleep(2e3);
        this.findAndExecuteNextTask(roomId);
        return;
      }
      const popup = await DOM.findElement(SETTINGS.SELECTORS.popupModal, SETTINGS.POPUP_WAIT_TIMEOUT);
      if (!popup) {
        Utils.log("等待红包弹窗超时，重新寻找任务。");
        await Utils.sleep(2e3);
        this.findAndExecuteNextTask(roomId);
        return;
      }
      const singleBag = popup.querySelector(SETTINGS.SELECTORS.singleBag);
      const openBtn = singleBag ? singleBag.querySelector(SETTINGS.SELECTORS.openButton) : null;
      if (openBtn) {
        const btnText = openBtn.textContent.trim();
        Utils.log(`[领取] 找到打开按钮，文本: "${btnText}"`);
        if (/(\d+)秒后/.test(btnText)) {
          const waitMatch = btnText.match(/(\d+)秒后/);
          if (waitMatch) {
            const waitSeconds = parseInt(waitMatch[1]);
            Utils.log(`[领取] 按钮显示还需等待 ${waitSeconds} 秒，等待中...`);
            GlobalState.updateWorker(roomId, "CLAIMING", `等待 ${waitSeconds} 秒...`, { countdown: null });
            await Utils.sleep((waitSeconds + 1) * 1e3);
          }
        }
      }
      const clickTarget = openBtn || singleBag || popup;
      const targetName = openBtn ? "红包打开按钮" : singleBag ? "红包主体" : "红包弹窗";
      if (await DOM.safeClick(clickTarget, targetName)) {
        if (await DOM.checkForLimitPopup()) {
          GlobalState.setDailyLimit(true);
          Utils.log("检测到每日上限！");
          if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
            await this.enterDormantMode();
          } else {
            await this.selfClose(roomId);
          }
          return;
        }
        await Utils.sleep(1500);
        const successIndicator = await DOM.findElement(SETTINGS.SELECTORS.rewardSuccessIndicator, 3e3, popup);
        const reward = successIndicator ? "领取成功 " : "空包或失败";
        Utils.log(`领取操作完成，结果: ${reward}`);
        GlobalState.updateWorker(roomId, "WAITING", `领取到: ${reward}`, { countdown: null });
        const closeBtn = document.querySelector(SETTINGS.SELECTORS.closeButton);
        await DOM.safeClick(closeBtn, "关闭按钮");
      } else {
        Utils.log("[领取] 点击打开操作失败。");
      }
      STATE.lastActionTime = Date.now();
      Utils.log("操作完成，2秒后在本房间内寻找下一个任务...");
      await Utils.sleep(2e3);
      this.findAndExecuteNextTask(roomId);
    },
async autoPauseVideo() {
      if (STATE.isSwitchingRoom || Date.now() - STATE.lastActionTime < SETTINGS.AUTO_PAUSE_DELAY_AFTER_ACTION) {
        return;
      }
      let pauseBtn = document.querySelector(SETTINGS.SELECTORS.pauseButton);
      if (!pauseBtn) {
        const player = document.querySelector("#js-player-video");
        if (player) {
          player.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
          await Utils.sleep(500);
          pauseBtn = document.querySelector(SETTINGS.SELECTORS.pauseButton);
        }
      }
      if (pauseBtn) {
        const isPauseIcon = pauseBtn.innerHTML.includes("M9.5 7");
        if (isPauseIcon) {
          if (await DOM.safeClick(pauseBtn, "暂停按钮")) {
            Utils.log("视频已通过脚本暂停。");
          }
        }
      }
    },
async switchRoom() {
      if (this.healthCheckTimeoutId) {
        clearTimeout(this.healthCheckTimeoutId);
        this.healthCheckTimeoutId = null;
      }
      if (STATE.isSwitchingRoom) return;
      STATE.isSwitchingRoom = true;
      Utils.log("开始执行切换房间流程...");
      const currentRoomId = Utils.getCurrentRoomId();
      GlobalState.updateWorker(currentRoomId, "SWITCHING", "查找新房间...");
      try {
        const apiRoomUrls = await DouyuAPI.getRooms(SETTINGS.API_ROOM_FETCH_COUNT, currentRoomId);
        const currentState = GlobalState.get();
        const openedRoomIds = new Set(Object.keys(currentState.tabs));
        const nextUrl = apiRoomUrls.find((url) => {
          const rid = url.match(/\/(\d+)/)?.[1];
          return rid && !openedRoomIds.has(rid);
        });
        if (nextUrl) {
          Utils.log(`确定下一个房间链接: ${nextUrl}`);
          const nextRoomId = nextUrl.match(/\/(\d+)/)[1];
          const pendingWorkers = GM_getValue("qmx_pending_workers", []);
          pendingWorkers.push(nextRoomId);
          GM_setValue("qmx_pending_workers", pendingWorkers);
          Utils.log(`已将房间 ${nextRoomId} 加入待处理列表。`);
          if (window.location.href.includes("/beta") || localStorage.getItem("newWebLive") !== "A") {
            localStorage.setItem("newWebLive", "A");
          }
          GM_openInTab(nextUrl, { active: false, setParent: true });
          await Utils.sleep(SETTINGS.CLOSE_TAB_DELAY);
          await this.selfClose(currentRoomId);
        } else {
          Utils.log("API未能返回任何新的、未打开的房间，将关闭当前页。");
          await this.selfClose(currentRoomId);
        }
      } catch (error) {
        Utils.log(`切换房间时发生严重错误: ${error.message}`);
        await this.selfClose(currentRoomId);
      }
    },
async enterDormantMode() {
      const roomId = Utils.getCurrentRoomId();
      Utils.log(`[上限处理] 房间 ${roomId} 进入休眠模式。`);
      GlobalState.updateWorker(roomId, "DORMANT", "休眠中 (等待北京时间0点)", { countdown: null });
      const now = Utils.getBeijingTime();
      const tomorrow = new Date(now.getTime());
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 30, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      Utils.log(`将在 ${Math.round(msUntilMidnight / 1e3 / 60)} 分钟后自动刷新页面 (基于北京时间)。`);
      setTimeout(() => window.location.reload(), msUntilMidnight);
    },
async selfClose(roomId, fromCloseAll = false) {
      Utils.log(`本单元任务结束 (房间: ${roomId})，尝试更新状态并关闭。`);
      if (this.pauseSentinelInterval) {
        clearInterval(this.pauseSentinelInterval);
      }
      if (fromCloseAll) {
        Utils.log(`[关闭所有] 跳过状态更新，直接关闭标签页 (房间: ${roomId})`);
        GlobalState.removeWorker(roomId);
        await Utils.sleep(100);
        this.closeTab();
        return;
      }
      GlobalState.updateWorker(roomId, "SWITCHING", "任务结束，关闭中...");
      await Utils.sleep(100);
      GlobalState.removeWorker(roomId);
      await Utils.sleep(300);
      this.closeTab();
    },
closeTab() {
      try {
        window.close();
      } catch (e) {
        window.location.replace("about:blank");
        Utils.log(`关闭失败，故障为: ${e.message}`);
      }
    },

startCommandListener(roomId) {
      this.commandChannel = new BroadcastChannel("douyu_qmx_commands");
      Utils.log(`工作页 ${roomId} 已连接到指令广播频道。`);
      this.commandChannel.onmessage = (event) => {
        const { action, target } = event.data;
        if (target === roomId || target === "*") {
          Utils.log(`接收到广播指令: ${action} for target ${target}`);
          if (action === "CLOSE") {
            this.selfClose(roomId, false);
          } else if (action === "CLOSE_ALL") {
            this.selfClose(roomId, true);
          }
        }
      };
      window.addEventListener("beforeunload", () => {
        if (this.commandChannel) {
          this.commandChannel.close();
        }
      });
    },
async waitForRedEnvelopeContainer(timeout) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        const containers = document.querySelectorAll(SETTINGS.SELECTORS.redEnvelopeContainer);
        for (const container of containers) {
          const hasBoxIcon = container.querySelector(SETTINGS.SELECTORS.boxIcon);
          if (hasBoxIcon) {
            Utils.log(`[等待] 找到红包容器，耗时 ${Date.now() - startTime}ms`);
            return container;
          }
        }
        await Utils.sleep(300);
      }
      Utils.log(`[等待] 等待红包容器超时（${timeout}ms）`);
      return null;
    }
  };
  (function() {
    function main() {
      initHackTimer("HackTimerWorker.js");
      const currentUrl = window.location.href;
      const controlIds = [SETTINGS.CONTROL_ROOM_ID, SETTINGS.TEMP_CONTROL_ROOM_RID].filter(Boolean);
      Utils.log(`控制页识别ID列表: ${controlIds.join(", ")}`);
      const isControlRoom = controlIds.some(
        (id) => currentUrl.includes(`/${id}`) || currentUrl.includes(`/topic/`) && currentUrl.includes(`rid=${id}`)
      );
      if (isControlRoom) {
        ControlPage.init();
        return;
      }
      const roomId = Utils.getCurrentRoomId();
      if (roomId && (currentUrl.match(/douyu\.com\/(?:beta\/)?(\d+)/) || currentUrl.match(/douyu\.com\/(?:beta\/)?topic\/.*rid=(\d+)/))) {
        const globalTabs = GlobalState.get().tabs;
        const pendingWorkers = GM_getValue("qmx_pending_workers", []);
        if (Object.hasOwn(globalTabs, roomId) || pendingWorkers.includes(roomId)) {
          Utils.log(`[身份验证] 房间 ${roomId} 身份合法，授权初始化。`);
          const pendingIndex = pendingWorkers.indexOf(roomId);
          if (Object.hasOwn(globalTabs, roomId) && pendingIndex > -1) {
            pendingWorkers.splice(pendingIndex, 1);
            GM_setValue("qmx_pending_workers", pendingWorkers);
          }
          WorkerPage.init();
        } else {
          Utils.log(`[身份验证] 房间 ${roomId} 未在全局状态或待处理列表中，脚本不活动。`);
        }
      } else {
        Utils.log("当前页面非控制页或工作页，脚本不活动。");
      }
    }
    Utils.log(`脚本将在 ${SETTINGS.INITIAL_SCRIPT_DELAY / 1e3} 秒后开始初始化...`);
    setTimeout(main, SETTINGS.INITIAL_SCRIPT_DELAY);
  })();

})();