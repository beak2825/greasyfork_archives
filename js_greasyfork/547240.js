// ==UserScript==
// @name         Wplace Live Chats
// @version      2.5.7
// @author       mininxd
// @description  Livechat for wplace.live
// @icon         https://wplace.org/favicon/favicon.svg
// @match        https://wplace.live/*
// @match        https://wplace.live
// @connect      wplace-live-chat-server.vercel.app
// @connect      backend.wplace.live
// @connect      wplace-livechat.vercel.app
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @changelogs   <strong>[+] </strong>Region Chat Improvement<br> <strong>[+] </strong>updated NPM dependencies
// @namespace https://greasyfork.org/users/1115073
// @downloadURL https://update.greasyfork.org/scripts/547240/Wplace%20Live%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/547240/Wplace%20Live%20Chats.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  const styleCss = '@import"https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap";@import"https://fonts.googleapis.com/icon?family=Material+Icons";:root{--primary-color: #0266d1;--secondary-color: #6c757d;--success-color: #58b700;--warning-color: #fecb01;--danger-color: #ea2600;--gray-color: #eaeaea;--background-color: #F2F3F5;--surface-color: #ffffff;--on-primary-color: #ffffff;--on-background-color: #212529;--on-surface-color: #495057;--on-surface-variant-color: #6c757d;--outline-color: #DCDDDE;--shadow-color: rgba(0, 0, 0, .1);--border-color: #0256e1}.livechat-container{font-family:Rubik,system-ui,-apple-system,sans-serif;position:fixed;z-index:10000}.livechat-fab{position:fixed;bottom:24vh;right:24px;background:var(--primary-color);color:var(--on-primary-color);border:1px var(--border-color) solid;width:40px;height:40px;border-radius:12px;cursor:pointer;box-shadow:0 4px 12px var(--shadow-color);transition:all .2s cubic-bezier(.4,0,.2,1);z-index:0;display:flex!important;align-items:center;justify-content:center;visibility:visible!important;opacity:1!important}.livechat-fab .material-icons{font-size:22px}.livechat-fab:hover{transform:translateY(-2px);box-shadow:0 6px 16px var(--shadow-color);background:#0069d9}.livechat-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:none;align-items:center;justify-content:center;z-index:10002}.livechat-modal.show{display:flex}.livechat-content{background:var(--background-color);border-radius:16px;width:400px;height:600px;max-width:90vw;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 12px 32px var(--shadow-color);overflow:hidden;border:1px solid var(--outline-color)}.livechat-header{background:var(--surface-color);color:var(--on-background-color);padding:12px 24px 0;display:flex;flex-direction:column;border-bottom:1px solid var(--outline-color)}.livechat-header-main{display:flex;justify-content:space-between;align-items:flex-start;width:100%;padding-bottom:12px}.livechat-header-actions{display:flex;gap:8px}.livechat-blocked-user-btn,.livechat-settings-btn,.livechat-moderation-btn{background:transparent;border:none;border-radius:12px;width:24px;height:24px;color:var(--on-surface-color);cursor:pointer;font-size:12px;transition:background .2s;display:flex;align-items:center;justify-content:center;position:relative}.livechat-settings-btn:hover{background:#0000000d}.livechat-stats-btn{background:transparent;border:none;border-radius:12px;width:28px;height:28px;color:var(--on-surface-color);cursor:pointer;font-size:16px;transition:background .2s;display:flex;align-items:center;justify-content:center;position:relative}.livechat-stats-btn:hover{background:#0000000d}.livechat-settings-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:none;align-items:center;justify-content:center;z-index:10003}.livechat-settings-content{background:var(--surface-color);color:var(--on-background-color);padding:16px;border-radius:16px;width:280px;max-width:80vw;box-shadow:0 12px 24px var(--shadow-color);position:relative;display:flex;flex-direction:column;gap:8px}.livechat-settings-content h4{margin-top:0;margin-bottom:8px;border-bottom:1px solid var(--outline-color);padding-bottom:8px}.setting-item{display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:5px 10px;border-radius:8px;transition:background-color .2s}.setting-item:hover{background-color:#0000000d}.m3-switch{position:relative;width:52px;height:32px;display:flex;align-items:center;transform:scale(.8)}.m3-switch input{opacity:0;width:0;height:0;position:absolute}.m3-switch-track{position:absolute;left:0;top:0;width:100%;height:100%;background-color:#e9ecef;border:2px solid var(--outline-color);border-radius:16px;transition:all .2s}.m3-switch-thumb-container{position:absolute;left:4px;top:50%;width:16px;height:16px;transform:translateY(-50%);transition:all .2s cubic-bezier(.4,0,.2,1);pointer-events:none}.m3-switch-thumb{width:100%;height:100%;border-radius:12px;background-color:var(--on-surface-variant-color);box-shadow:0 1px 3px var(--shadow-color);transition:all .2s}.m3-switch input:checked+.m3-switch-track{background-color:var(--primary-color);border-color:var(--primary-color)}.m3-switch input:checked~.m3-switch-thumb-container{transform:translate(20px,-50%);width:24px;height:24px}.m3-switch input:checked~.m3-switch-thumb-container .m3-switch-thumb{background-color:var(--on-primary-color)}.setting-item:hover .m3-switch-thumb{box-shadow:0 1px 5px #0003}.livechat-settings-close{position:absolute;top:8px;right:8px;background:transparent;border:none;border-radius:50%;width:32px;height:32px;color:var(--on-surface-variant-color);cursor:pointer;display:flex;align-items:center;justify-content:center;align-self:center}.livechat-settings-close:hover{background-color:#e9ecef}.livechat-tabs{display:flex;border-top:1px solid var(--outline-color);margin:0 -24px;padding:0 12px}.livechat-tab{padding:12px 16px;cursor:pointer;border-bottom:2px solid transparent;color:var(--secondary-color);transition:all .2s;font-size:14px;font-weight:500}.livechat-tab.active{color:var(--primary-color);border-bottom-color:var(--primary-color)}.livechat-tab:hover{color:var(--primary-color);background:#007bff0d}.livechat-user-info h3{margin:0 0 4px;font-size:18px;font-weight:500}.livechat-user-info .material-icons{font-size:16px;vertical-align:-3px;margin-right:4px}.cooldown-info-icon{cursor:pointer;font-size:14px!important;vertical-align:-2px!important;margin-left:2px;opacity:.7}.cooldown-info-icon:hover{opacity:1}.livechat-info-popup{position:fixed;background:#333;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;z-index:10004;pointer-events:none;opacity:0;transform:scale(.9);transition:opacity .2s,transform .2s}.livechat-info-popup.show{opacity:1;transform:scale(1)}.livechat-user-details{font-size:12px;opacity:.9;margin:2px 0}.livechat-close{background:transparent;border:none;border-radius:50%;width:28px;height:28px;color:var(--on-surface-color);cursor:pointer;font-size:16px;transition:background .2s;display:flex;align-items:center;justify-content:center}.livechat-close:hover{background:#0000000d}.livechat-messages{flex:1;padding:14px;overflow-y:auto;background:var(--background-color);scrollbar-width:thin;scrollbar-color:var(--primary-color) transparent}.livechat-messages::-webkit-scrollbar{width:6px}.livechat-messages::-webkit-scrollbar-thumb{background:var(--primary-color);border-radius:3px}.chat-message{margin-bottom:0;margin-top:12px;animation:slideIn .3s ease-out;display:flex;flex-direction:column;align-items:flex-start}.chat-message:first-child{margin-top:0}.chat-message.merged{margin-top:2px}.chat-message.own{align-items:flex-end}.message-author{display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:var(--secondary-color);margin-bottom:2px;margin-left:6px}.chat-message.own .message-author{margin-left:0;margin-right:6px}.message-pending{opacity:.7}.message-content{background:var(--surface-color);padding:4px 8px;border-radius:16px;box-shadow:0 2px 4px var(--shadow-color);border:1px solid var(--outline-color);font-size:14px;line-height:1.2;color:var(--on-background-color);min-width:75px;max-width:85%;overflow-wrap:break-word;word-break:break-word}.message-content.own{background:var(--primary-color);color:var(--on-primary-color);border-color:var(--primary-color)}.message-content.own .message-author{color:var(--on-primary-color)}.livechat-input-area{padding:12px 16px;background-color:var(--surface-color);display:flex;gap:8px;align-items:center;border-top:1px solid var(--outline-color)}.livechat-input-wrapper{flex:1;position:relative}.livechat-input{width:100%;box-sizing:border-box;border:2px solid var(--outline-color);border-radius:20px;padding:10px 16px;font-size:15px;font-family:Rubik,sans-serif;resize:none;min-height:24px;max-height:120px;background:var(--background-color);transition:border-color .2s;outline:none;overflow-y:hidden}.livechat-input:focus{border-color:var(--primary-color)}.livechat-input.input-error{border-color:#dc3545}.livechat-input:disabled{opacity:.7;cursor:not-allowed}.livechat-send{position:relative;-webkit-user-select:none;user-select:none;background:var(--primary-color);border:none;border-radius:50%;width:42px;height:42px;color:var(--on-primary-color);cursor:pointer;font-size:16px;transition:all .2s;display:flex;align-items:center;justify-content:center;transform:translateY(-3px);padding:5px}.livechat-send:hover:not(:disabled){box-shadow:0 2px 8px var(--shadow-color);background:#0069d9}.livechat-send:disabled{opacity:.5;cursor:not-allowed;background:var(--secondary-color)}.game-status{font-size:11px;background:#00000009;color:var(--on-surface-color);padding:4px 8px;border-radius:8px;margin-top:4px;display:inline-block}.message-timestamp{font-size:10px;opacity:.6;margin-top:4px;color:var(--on-surface-variant-color)}.message-content.own .message-timestamp{color:#fffc;text-align:right}.message-reply{background:#0000001a;border-radius:6px;padding:8px 10px;margin-bottom:8px;border-left:5px solid var(--success-color);display:flex;flex-direction:column;min-width:100px;box-sizing:border-box}.reply-indicator{color:var(--success-color);font-size:13px;font-weight:600;margin-bottom:4px;display:flex;align-items:center}.reply-indicator .material-icons{display:none}.reply-content{color:var(--on-surface-variant-color);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.8}.message-content.own .message-reply{background:#0003;border-left-color:#a5d6a7}.message-content.own .reply-indicator{color:#a5d6a7}.message-content.own .reply-content{color:#ffffffe6}.message-actions{display:none;margin-top:4px;margin-left:12px;gap:4px;align-items:center}.message-actions.show{display:flex}.message-actions .mod-btn,.message-actions .reply-btn{background:transparent;border:none;border-radius:50%;width:24px;height:24px;color:var(--on-surface-variant-color);cursor:pointer;font-size:14px;transition:all .2s;display:flex;align-items:center;justify-content:center;padding:0}.message-actions .reply-btn:hover{background:#0000000d;color:var(--primary-color)}.message-actions .reply-btn .material-icons{font-size:14px}.loading-indicator,.info-message{text-align:center;padding:20px;color:var(--on-surface-variant-color)}.info-message{background:#e9ecef;border-radius:12px;margin:16px;border:1px solid var(--outline-color)}.info-message i{font-size:24px;color:var(--primary-color);margin-bottom:8px;display:block}@keyframes slideIn{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.m3-progress-bar{position:relative;width:100%;height:4px;background-color:#e9ecef;border-radius:2px;overflow:hidden}.m3-progress-bar:before{content:"";position:absolute;top:0;left:0;height:100%;width:40%;background-color:var(--primary-color);border-radius:2px;animation:m3-progress-single-line 1.5s linear infinite}@keyframes m3-progress-single-line{0%{left:-40%}to{left:100%}}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.loading-spinner{animation:spin 1s linear infinite}@media(max-width:480px){.livechat-content{width:100%;height:100%;border-radius:0;max-width:100vw;max-height:100vh}.livechat-fab{bottom:20vh;right:1rem;display:flex!important;visibility:visible!important;opacity:1!important}}.livechat-stats-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:none;align-items:center;justify-content:center;z-index:10003}.livechat-stats-content{background:var(--surface-color);color:var(--on-background-color);padding:16px;border-radius:16px;width:280px;max-width:80vw;box-shadow:0 12px 24px var(--shadow-color);position:relative;display:flex;flex-direction:column;gap:8px}.livechat-stats-content h4{margin-top:0;margin-bottom:8px;border-bottom:1px solid var(--outline-color);padding-bottom:8px}.livechat-stats-close{position:absolute;top:8px;right:8px;background:transparent;border:none;border-radius:50%;width:32px;height:32px;color:var(--on-surface-variant-color);cursor:pointer;display:flex;align-items:center;justify-content:center;align-self:center}.livechat-stats-close:hover{background-color:#e9ecef}.livechat-settings-action-btn{background:#0000001a;text-align:center;padding:5px 10px;border-radius:8px}.chat-date-separator{display:flex;justify-content:center;margin:5px 0;font-size:12px;color:var(--on-surface-variant-color);opacity:.9}.chat-date-separator span{background-color:#0000001a;padding:4px 12px;border-radius:12px;font-weight:500}.livechat-moderation-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:none;align-items:center;justify-content:center;z-index:10003}.livechat-moderation-content{background:var(--surface-color);color:var(--on-background-color);padding:16px;border-radius:16px;width:320px;max-width:80vw;box-shadow:0 12px 24px var(--shadow-color);position:relative;display:flex;flex-direction:column;gap:16px}.livechat-moderation-content h4{margin-top:0;margin-bottom:8px;border-bottom:1px solid var(--outline-color);padding-bottom:8px}.livechat-moderation-content h5{margin:0 0 8px;font-size:14px;color:var(--on-surface-variant-color)}.moderation-section{border:1px solid var(--outline-color);border-radius:8px;padding:12px}.moderation-section input{width:100%;box-sizing:border-box;border:1px solid var(--outline-color);border-radius:8px;padding:8px;margin-bottom:8px;font-size:14px;background:var(--background-color)}.moderation-section button{width:100%;background:var(--primary-color);color:var(--on-primary-color);border:none;border-radius:8px;padding:8px;font-size:14px;cursor:pointer;transition:background .2s}.moderation-section button:hover{background:#0069d9}.livechat-moderation-close{position:absolute;top:8px;right:8px;background:transparent;border:none;border-radius:50%;width:32px;height:32px;color:var(--on-surface-variant-color);cursor:pointer;display:flex;align-items:center;justify-content:center;align-self:center}.livechat-moderation-close:hover{background-color:#e9ecef}';
  importCSS(styleCss);
  let userData = null;
  let regionData = null;
  let pixelData = null;
  let allianceData = null;
  let preloadedAllianceMessages = null;
  let currentChatRoom = "region";
  let displayedChatRoomId = null;
  const messageCache = new Map();
  function getMessagesFromCache(roomId) {
    if (messageCache.has(roomId)) {
      return messageCache.get(roomId);
    }
    try {
      const cached = GM_getValue(`wplace-chat-cache-${roomId}`, null);
      if (cached) {
        const parsed = JSON.parse(cached);
        messageCache.set(roomId, parsed);
        return parsed;
      }
    } catch (e) {
      console.error("Error reading cache from storage", e);
    }
    return null;
  }
  function setMessagesInCache(roomId, messages) {
    messageCache.set(roomId, messages);
    try {
      GM_setValue(`wplace-chat-cache-${roomId}`, JSON.stringify(messages));
    } catch (e) {
      console.error("Error saving cache to storage", e);
    }
  }
  function clearAllChatCache() {
    messageCache.clear();
    try {
      const keys = GM_listValues();
      keys.forEach((key) => {
        if (key.startsWith("wplace-chat-cache-")) {
          GM_deleteValue(key);
        }
      });
      if (false) ;
    } catch (e) {
      console.error("Error clearing cache", e);
    }
  }
  function getDisplayedChatRoomId() {
    return displayedChatRoomId;
  }
  function setDisplayedChatRoomId(id) {
    displayedChatRoomId = id;
  }
  function getPreloadedAllianceMessages() {
    return preloadedAllianceMessages;
  }
  function setPreloadedAllianceMessages(messages) {
    preloadedAllianceMessages = messages;
  }
  function getUserData() {
    return userData;
  }
  function setUserData(data) {
    userData = data;
  }
  function getRegionData() {
    return regionData;
  }
  function setRegionData(data) {
    regionData = data;
  }
  function getPixelData() {
    return pixelData;
  }
  function setPixelData(data) {
    pixelData = data;
  }
  function getAllianceData() {
    return allianceData;
  }
  function setAllianceData(data) {
    allianceData = data;
  }
  function getCurrentChatRoom() {
    return currentChatRoom;
  }
  function setCurrentChatRoom(room) {
    currentChatRoom = room;
  }
  let settings$1 = {
    enterToSend: true,
    lockChat: false,
    notifications: false
  };
  const getSettings = () => settings$1;
  const setSettings = (newSettings) => {
    settings$1 = { ...settings$1, ...newSettings };
    try {
      GM_setValue("wplace-chat-settings", JSON.stringify(settings$1));
    } catch (e) {
      console.error("Failed to save settings to GM_storage", e);
    }
  };
  const loadSettings = () => {
    try {
      const storedSettings = GM_getValue("wplace-chat-settings", null);
      if (storedSettings) {
        settings$1 = { ...settings$1, ...JSON.parse(storedSettings) };
      }
    } catch (e) {
      console.error("Failed to load settings from GM_storage", e);
    }
    return settings$1;
  };
  const debug$1 = false;
  const API_BASE = "https://wplace-live-chat-server.vercel.app";
  let regionDataPoller = null;
  let lastCheckedUrl = "";
  let lastRegionChangeTimestamp = 0;
  const REGION_CHANGE_COOLDOWN = 5e3;
  const fetchAPI = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        credentials: "include",
        ...options
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  };
  function fetchMessages(region) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        GM_xmlhttpRequest({
          method: "GET",
          url: `${API_BASE}/messages/${region}`,
          onload: function(response) {
            try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (e) {
              reject(e);
            }
          },
          onerror: function(error) {
            reject(error);
          }
        });
      }, 500);
    });
  }
  function connectToEvents(region, onMessage) {
    const url = `${API_BASE}/events/${region}`;
    const eventSource2 = new EventSource(url);
    eventSource2.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error("Error parsing SSE message:", e);
      }
    };
    eventSource2.onerror = function(err) {
      console.error("EventSource failed:", err);
    };
    return eventSource2;
  }
  function sendMessage(uid, name, message, region, replyToId2, avatar) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: `${API_BASE}/send`,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          uid: uid.toString(),
          name,
          messages: message,
          region,
          replyToId: replyToId2 || null,
          avatar: null
        }),
        onload: function(response) {
          try {
            const data = response.responseText ? JSON.parse(response.responseText) : {};
            if (response.status >= 200 && response.status < 300) {
              resolve(data);
            } else {
              reject({ status: response.status, ...data });
            }
          } catch (e) {
            if (response.status >= 200 && response.status < 300) {
              resolve({});
            } else {
              reject({ status: response.status, message: `HTTP ${response.status}` });
            }
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }
  async function checkForPixelUrl() {
    const resources = performance.getEntriesByType("resource");
    const pixelResource = resources.reverse().find((r) => r.name.includes("https://backend.wplace.live/s0/pixel/"));
    if (pixelResource && pixelResource.name !== lastCheckedUrl) {
      lastCheckedUrl = pixelResource.name;
      const now = Date.now();
      if (now - lastRegionChangeTimestamp < REGION_CHANGE_COOLDOWN) {
        const remaining = Math.ceil((REGION_CHANGE_COOLDOWN - (now - lastRegionChangeTimestamp)) / 1e3);
        document.dispatchEvent(new CustomEvent("regionChangeCooldown", { detail: { remaining } }));
        return;
      }
      const url = new URL(lastCheckedUrl);
      const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;
      try {
        const data = await fetchAPI(baseUrl);
        if (data && data.region && data.region.name) {
          const pathParts = url.pathname.split("/");
          const boardId = pathParts[pathParts.length - 1];
          const x = url.searchParams.get("x");
          const y = url.searchParams.get("y");
          const currentRegion = getRegionData();
          if (x && y && boardId) {
            const newRegionName = data.region.number ? `${data.region.name}_${data.region.number}` : `${data.region.name}`;
            if (!currentRegion || currentRegion.name !== newRegionName) {
              if (getSettings().lockChat && getCurrentChatRoom() === "region" && getRegionData()) {
                if (debug$1) ;
                return;
              }
              lastRegionChangeTimestamp = Date.now();
              data.region.name = newRegionName;
              setPixelData({ x, y, boardId });
              setRegionData(data.region);
              if (debug$1) ;
              document.dispatchEvent(new CustomEvent("regionDataFound"));
            }
          }
        }
      } catch (error) {
      }
    }
  }
  function startDataPolling() {
    if (!regionDataPoller) {
      regionDataPoller = setInterval(checkForPixelUrl, 1e3);
    }
  }
  function _assertThisInitialized$1(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _inheritsLoose$1(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  }, _defaults = {
    duration: 0.5,
    overwrite: false,
    delay: 0
  }, _suppressOverwrites, _reverting$1, _context$1, _bigNum$2 = 1e8, _tinyNum = 1 / _bigNum$2, _2PI = Math.PI * 2, _HALF_PI = _2PI / 4, _gsID = 0, _sqrt = Math.sqrt, _cos = Math.cos, _sin = Math.sin, _isString = function _isString2(value) {
    return typeof value === "string";
  }, _isFunction$1 = function _isFunction(value) {
    return typeof value === "function";
  }, _isNumber = function _isNumber2(value) {
    return typeof value === "number";
  }, _isUndefined$1 = function _isUndefined(value) {
    return typeof value === "undefined";
  }, _isObject$1 = function _isObject(value) {
    return typeof value === "object";
  }, _isNotFalse = function _isNotFalse2(value) {
    return value !== false;
  }, _windowExists$2 = function _windowExists() {
    return typeof window !== "undefined";
  }, _isFuncOrString = function _isFuncOrString2(value) {
    return _isFunction$1(value) || _isString(value);
  }, _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {
  }, _isArray$1 = Array.isArray, _randomExp = /random\([^)]+\)/g, _commaDelimExp = /,\s*/g, _strictNumExp = /(?:-?\.?\d|\.)+/gi, _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _relExp = /[+-]=-?[.\d]+/, _delimitedValueExp = /[^,'"\[\]\s]+/gi, _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _globalTimeline, _win$3, _coreInitted$1, _doc$3, _globals = {}, _installScope = {}, _coreReady, _install = function _install2(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap$1;
  }, _missingPlugin = function _missingPlugin2(property, value) {
    return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
  }, _warn = function _warn2(message, suppress) {
    return !suppress && console.warn(message);
  }, _addGlobal = function _addGlobal2(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
  }, _emptyFunc$1 = function _emptyFunc() {
    return 0;
  }, _startAtRevertConfig = {
    suppressEvents: true,
    isStart: true,
    kill: false
  }, _revertConfigNoKill = {
    suppressEvents: true,
    kill: false
  }, _revertConfig = {
    suppressEvents: true
  }, _reservedProps = {}, _lazyTweens = [], _lazyLookup = {}, _lastRenderedFrame, _plugins = {}, _effects = {}, _nextGCFrame = 30, _harnessPlugins = [], _callbackNames = "", _harness = function _harness2(targets) {
    var target = targets[0], harnessPlugin, i;
    _isObject$1(target) || _isFunction$1(target) || (targets = [targets]);
    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i = _harnessPlugins.length;
      while (i-- && !_harnessPlugins[i].targetTest(target)) {
      }
      harnessPlugin = _harnessPlugins[i];
    }
    i = targets.length;
    while (i--) {
      targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
    }
    return targets;
  }, _getCache = function _getCache2(target) {
    return target._gsap || _harness(toArray$1(target))[0]._gsap;
  }, _getProperty = function _getProperty2(target, property, v) {
    return (v = target[property]) && _isFunction$1(v) ? target[property]() : _isUndefined$1(v) && target.getAttribute && target.getAttribute(property) || v;
  }, _forEachName = function _forEachName2(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  }, _round$1 = function _round(value) {
    return Math.round(value * 1e5) / 1e5 || 0;
  }, _roundPrecise = function _roundPrecise2(value) {
    return Math.round(value * 1e7) / 1e7 || 0;
  }, _parseRelative = function _parseRelative2(start, value) {
    var operator = value.charAt(0), end = parseFloat(value.substr(2));
    start = parseFloat(start);
    return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
  }, _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
    var l = toFind.length, i = 0;
    for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l; ) {
    }
    return i < l;
  }, _lazyRender = function _lazyRender2() {
    var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
    _lazyLookup = {};
    _lazyTweens.length = 0;
    for (i = 0; i < l; i++) {
      tween = a[i];
      tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
    }
  }, _isRevertWorthy = function _isRevertWorthy2(animation) {
    return !!(animation._initted || animation._startAt || animation.add);
  }, _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
    _lazyTweens.length && !_reverting$1 && _lazyRender();
    animation.render(time, suppressEvents, !!(_reverting$1 && time < 0 && _isRevertWorthy(animation)));
    _lazyTweens.length && !_reverting$1 && _lazyRender();
  }, _numericIfPossible = function _numericIfPossible2(value) {
    var n = parseFloat(value);
    return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
  }, _passThrough = function _passThrough2(p) {
    return p;
  }, _setDefaults$1 = function _setDefaults(obj, defaults3) {
    for (var p in defaults3) {
      p in obj || (obj[p] = defaults3[p]);
    }
    return obj;
  }, _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
    return function(obj, defaults3) {
      for (var p in defaults3) {
        p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults3[p]);
      }
    };
  }, _merge = function _merge2(base, toMerge) {
    for (var p in toMerge) {
      base[p] = toMerge[p];
    }
    return base;
  }, _mergeDeep = function _mergeDeep2(base, toMerge) {
    for (var p in toMerge) {
      p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject$1(toMerge[p]) ? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
    }
    return base;
  }, _copyExcluding = function _copyExcluding2(obj, excluding) {
    var copy = {}, p;
    for (p in obj) {
      p in excluding || (copy[p] = obj[p]);
    }
    return copy;
  }, _inheritDefaults = function _inheritDefaults2(vars) {
    var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray$1(vars.keyframes)) : _setDefaults$1;
    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent || parent._dp;
      }
    }
    return vars;
  }, _arraysMatch = function _arraysMatch2(a1, a2) {
    var i = a1.length, match = i === a2.length;
    while (match && i-- && a1[i] === a2[i]) {
    }
    return i < 0;
  }, _addLinkedListItem = function _addLinkedListItem2(parent, child, firstProp, lastProp, sortBy) {
    var prev = parent[lastProp], t;
    if (sortBy) {
      t = child[sortBy];
      while (prev && prev[sortBy] > t) {
        prev = prev._prev;
      }
    }
    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }
    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }
    child._prev = prev;
    child.parent = child._dp = parent;
    return child;
  }, _removeLinkedListItem = function _removeLinkedListItem2(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = child._prev, next = child._next;
    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }
    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }
    child._next = child._prev = child.parent = null;
  }, _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
    child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
    child._act = 0;
  }, _uncache = function _uncache2(animation, child) {
    if (animation && (!child || child._end > animation._dur || child._start < 0)) {
      var a = animation;
      while (a) {
        a._dirty = 1;
        a = a.parent;
      }
    }
    return animation;
  }, _recacheAncestors = function _recacheAncestors2(animation) {
    var parent = animation.parent;
    while (parent && parent.parent) {
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }
    return animation;
  }, _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
    return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
  }, _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
  }, _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
    return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
  }, _animationCycle = function _animationCycle2(tTime, cycleDuration) {
    var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
    return tTime && whole === tTime ? whole - 1 : whole;
  }, _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
    return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
  }, _setEnd = function _setEnd2(animation) {
    return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
  }, _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
    var parent = animation._dp;
    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
      _setEnd(animation);
      parent._dirty || _uncache(parent, animation);
    }
    return animation;
  }, _postAddChecks = function _postAddChecks2(timeline2, child) {
    var t;
    if (child._time || !child._dur && child._initted || child._start < timeline2._time && (child._dur || !child.add)) {
      t = _parentToChildTotalTime(timeline2.rawTime(), child);
      if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
        child.render(t, true);
      }
    }
    if (_uncache(timeline2, child)._dp && timeline2._initted && timeline2._time >= timeline2._dur && timeline2._ts) {
      if (timeline2._dur < timeline2.duration()) {
        t = timeline2;
        while (t._dp) {
          t.rawTime() >= 0 && t.totalTime(t._tTime);
          t = t._dp;
        }
      }
      timeline2._zTime = -_tinyNum;
    }
  }, _addToTimeline = function _addToTimeline2(timeline2, child, position, skipChecks) {
    child.parent && _removeFromParent(child);
    child._start = _roundPrecise((_isNumber(position) ? position : position || timeline2 !== _globalTimeline ? _parsePosition(timeline2, position, child) : timeline2._time) + child._delay);
    child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
    _addLinkedListItem(timeline2, child, "_first", "_last", timeline2._sort ? "_start" : 0);
    _isFromOrFromStart(child) || (timeline2._recent = child);
    skipChecks || _postAddChecks(timeline2, child);
    timeline2._ts < 0 && _alignPlayhead(timeline2, timeline2._tTime);
    return timeline2;
  }, _scrollTrigger = function _scrollTrigger2(animation, trigger) {
    return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
  }, _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
    _initTween(tween, time, tTime);
    if (!tween._initted) {
      return 1;
    }
    if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
      _lazyTweens.push(tween);
      tween._lazy = [tTime, suppressEvents];
      return 1;
    }
  }, _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
    var parent = _ref.parent;
    return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent));
  }, _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
    var data = _ref2.data;
    return data === "isFromStart" || data === "isStart";
  }, _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
    var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = _animationCycle(tTime, repeatDelay);
      tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
      if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
        prevRatio = 1 - ratio;
        tween.vars.repeatRefresh && tween._initted && tween.invalidate();
      }
    }
    if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
        return;
      }
      prevIteration = tween._zTime;
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
      suppressEvents || (suppressEvents = totalTime && !prevIteration);
      tween.ratio = ratio;
      tween._from && (ratio = 1 - ratio);
      tween._time = 0;
      tween._tTime = tTime;
      pt = tween._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
      tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
      tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        ratio && _removeFromParent(tween, 1);
        if (!suppressEvents && !_reverting$1) {
          _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
          tween._prom && tween._prom();
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime;
    }
  }, _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
    var child;
    if (time > prevTime) {
      child = animation._first;
      while (child && child._start <= time) {
        if (child.data === "isPause" && child._start > prevTime) {
          return child;
        }
        child = child._next;
      }
    } else {
      child = animation._last;
      while (child && child._start >= time) {
        if (child.data === "isPause" && child._start < prevTime) {
          return child;
        }
        child = child._prev;
      }
    }
  }, _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
    var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
    totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
    animation._dur = dur;
    animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
    totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
    animation.parent && _setEnd(animation);
    skipUncache || _uncache(animation.parent, animation);
    return animation;
  }, _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
    return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
  }, _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc$1,
    totalDuration: _emptyFunc$1
  }, _parsePosition = function _parsePosition2(animation, position, percentAnimation) {
    var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum$2 ? recent.endTime(false) : animation._dur, i, offset, isPercent;
    if (_isString(position) && (isNaN(position) || position in labels)) {
      offset = position.charAt(0);
      isPercent = position.substr(-1) === "%";
      i = position.indexOf("=");
      if (offset === "<" || offset === ">") {
        i >= 0 && (position = position.replace(/=/, ""));
        return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
      }
      if (i < 0) {
        position in labels || (labels[position] = clippedDuration);
        return labels[position];
      }
      offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
      if (isPercent && percentAnimation) {
        offset = offset / 100 * (_isArray$1(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
      }
      return i > 1 ? _parsePosition2(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
    }
    return position == null ? clippedDuration : +position;
  }, _createTweenType = function _createTweenType2(type, params, timeline2) {
    var isLegacy = _isNumber(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
    isLegacy && (vars.duration = params[1]);
    vars.parent = timeline2;
    if (type) {
      irVars = vars;
      parent = timeline2;
      while (parent && !("immediateRender" in irVars)) {
        irVars = parent.vars.defaults || {};
        parent = _isNotFalse(parent.vars.inherit) && parent.parent;
      }
      vars.immediateRender = _isNotFalse(irVars.immediateRender);
      type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
    }
    return new Tween(params[0], vars, params[varsIndex + 1]);
  }, _conditionalReturn = function _conditionalReturn2(value, func) {
    return value || value === 0 ? func(value) : func;
  }, _clamp = function _clamp2(min, max, value) {
    return value < min ? min : value > max ? max : value;
  }, getUnit = function getUnit2(value, v) {
    return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
  }, clamp = function clamp2(min, max, value) {
    return _conditionalReturn(value, function(v) {
      return _clamp(min, max, v);
    });
  }, _slice = [].slice, _isArrayLike = function _isArrayLike2(value, nonEmpty) {
    return value && _isObject$1(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject$1(value[0])) && !value.nodeType && value !== _win$3;
  }, _flatten = function _flatten2(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }
    return ar.forEach(function(value) {
      var _accumulator;
      return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray$1(value)) : accumulator.push(value);
    }) || accumulator;
  }, toArray$1 = function toArray(value, scope, leaveStrings) {
    return _context$1 && !scope && _context$1.selector ? _context$1.selector(value) : _isString(value) && !leaveStrings && (_coreInitted$1 || !_wake()) ? _slice.call((scope || _doc$3).querySelectorAll(value), 0) : _isArray$1(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
  }, selector = function selector2(value) {
    value = toArray$1(value)[0] || _warn("Invalid scope") || {};
    return function(v) {
      var el = value.current || value.nativeElement || value;
      return toArray$1(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc$3.createElement("div") : value);
    };
  }, shuffle = function shuffle2(a) {
    return a.sort(function() {
      return 0.5 - Math.random();
    });
  }, distribute = function distribute2(v) {
    if (_isFunction$1(v)) {
      return v;
    }
    var vars = _isObject$1(v) ? v : {
      each: v
    }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
    if (_isString(from)) {
      ratioX = ratioY = {
        center: 0.5,
        edges: 0.5,
        end: 1
      }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }
    return function(i, target, a) {
      var l = (a || vars).length, distances = cache[l], originX, originY, x, y, d, j, max, min, wrapAt;
      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$2])[1];
        if (!wrapAt) {
          max = -_bigNum$2;
          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {
          }
          wrapAt < l && wrapAt--;
        }
        distances = cache[l] = [];
        originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt;
        originY = wrapAt === _bigNum$2 ? 0 : ratios ? l * ratioY / wrapAt - 0.5 : from / wrapAt | 0;
        max = 0;
        min = _bigNum$2;
        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX;
          y = originY - (j / wrapAt | 0);
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
          d > max && (max = d);
          d < min && (min = d);
        }
        from === "random" && shuffle(distances);
        distances.max = max - min;
        distances.min = min;
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
        distances.b = l < 0 ? base - l : base;
        distances.u = getUnit(vars.amount || vars.each) || 0;
        ease = ease && l < 0 ? _invertEase(ease) : ease;
      }
      l = (distances[i] - distances.min) / distances.max || 0;
      return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
    };
  }, _roundModifier = function _roundModifier2(v) {
    var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
    return function(raw) {
      var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
      return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
    };
  }, snap = function snap2(snapTo, value) {
    var isArray2 = _isArray$1(snapTo), radius, is2D;
    if (!isArray2 && _isObject$1(snapTo)) {
      radius = isArray2 = snapTo.radius || _bigNum$2;
      if (snapTo.values) {
        snapTo = toArray$1(snapTo.values);
        if (is2D = !_isNumber(snapTo[0])) {
          radius *= radius;
        }
      } else {
        snapTo = _roundModifier(snapTo.increment);
      }
    }
    return _conditionalReturn(value, !isArray2 ? _roundModifier(snapTo) : _isFunction$1(snapTo) ? function(raw) {
      is2D = snapTo(raw);
      return Math.abs(is2D - raw) <= radius ? is2D : raw;
    } : function(raw) {
      var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum$2, closest = 0, i = snapTo.length, dx, dy;
      while (i--) {
        if (is2D) {
          dx = snapTo[i].x - x;
          dy = snapTo[i].y - y;
          dx = dx * dx + dy * dy;
        } else {
          dx = Math.abs(snapTo[i] - x);
        }
        if (dx < min) {
          min = dx;
          closest = i;
        }
      }
      closest = !radius || min <= radius ? snapTo[closest] : raw;
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
    });
  }, random = function random2(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray$1(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
      return _isArray$1(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
    });
  }, pipe = function pipe2() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }
    return function(value) {
      return functions.reduce(function(v, f) {
        return f(v);
      }, value);
    };
  }, unitize = function unitize2(func, unit) {
    return function(value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  }, normalize = function normalize2(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  }, _wrapArray = function _wrapArray2(a, wrapper, value) {
    return _conditionalReturn(value, function(index) {
      return a[~~wrapper(index)];
    });
  }, wrap = function wrap2(min, max, value) {
    var range = max - min;
    return _isArray$1(min) ? _wrapArray(min, wrap2(0, min.length), max) : _conditionalReturn(value, function(value2) {
      return (range + (value2 - min) % range) % range + min;
    });
  }, wrapYoyo = function wrapYoyo2(min, max, value) {
    var range = max - min, total = range * 2;
    return _isArray$1(min) ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max) : _conditionalReturn(value, function(value2) {
      value2 = (total + (value2 - min) % total) % total || 0;
      return min + (value2 > range ? total - value2 : value2);
    });
  }, _replaceRandom = function _replaceRandom2(s) {
    return s.replace(_randomExp, function(match) {
      var arIndex = match.indexOf("[") + 1, values = match.substring(arIndex || 7, arIndex ? match.indexOf("]") : match.length - 1).split(_commaDelimExp);
      return random(arIndex ? values : +values[0], arIndex ? 0 : +values[1], +values[2] || 1e-5);
    });
  }, mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin, outRange = outMax - outMin;
    return _conditionalReturn(value, function(value2) {
      return outMin + ((value2 - inMin) / inRange * outRange || 0);
    });
  }, interpolate = function interpolate2(start, end, progress, mutate) {
    var func = isNaN(start + end) ? 0 : function(p2) {
      return (1 - p2) * start + p2 * end;
    };
    if (!func) {
      var isString2 = _isString(start), master = {}, p, i, interpolators, l, il;
      progress === true && (mutate = 1) && (progress = null);
      if (isString2) {
        start = {
          p: start
        };
        end = {
          p: end
        };
      } else if (_isArray$1(start) && !_isArray$1(end)) {
        interpolators = [];
        l = start.length;
        il = l - 2;
        for (i = 1; i < l; i++) {
          interpolators.push(interpolate2(start[i - 1], start[i]));
        }
        l--;
        func = function func2(p2) {
          p2 *= l;
          var i2 = Math.min(il, ~~p2);
          return interpolators[i2](p2 - i2);
        };
        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray$1(start) ? [] : {}, start);
      }
      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, "get", end[p]);
        }
        func = function func2(p2) {
          return _renderPropTweens(p2, master) || (isString2 ? start.p : start);
        };
      }
    }
    return _conditionalReturn(progress, func);
  }, _getLabelInDirection = function _getLabelInDirection2(timeline2, fromTime, backward) {
    var labels = timeline2.labels, min = _bigNum$2, p, distance, label;
    for (p in labels) {
      distance = labels[p] - fromTime;
      if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
        label = p;
        min = distance;
      }
    }
    return label;
  }, _callback = function _callback2(animation, type, executeLazyFirst) {
    var v = animation.vars, callback = v[type], prevContext = _context$1, context3 = animation._ctx, params, scope, result;
    if (!callback) {
      return;
    }
    params = v[type + "Params"];
    scope = v.callbackScope || animation;
    executeLazyFirst && _lazyTweens.length && _lazyRender();
    context3 && (_context$1 = context3);
    result = params ? callback.apply(scope, params) : callback.call(scope);
    _context$1 = prevContext;
    return result;
  }, _interrupt = function _interrupt2(animation) {
    _removeFromParent(animation);
    animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
    animation.progress() < 1 && _callback(animation, "onInterrupt");
    return animation;
  }, _quickTween, _registerPluginQueue = [], _createPlugin = function _createPlugin2(config3) {
    if (!config3) return;
    config3 = !config3.name && config3["default"] || config3;
    if (_windowExists$2() || config3.headless) {
      var name = config3.name, isFunc = _isFunction$1(config3), Plugin = name && !isFunc && config3.init ? function() {
        this._props = [];
      } : config3, instanceDefaults = {
        init: _emptyFunc$1,
        render: _renderPropTweens,
        add: _addPropTween,
        kill: _killPropTweensOf,
        modifier: _addPluginModifier,
        rawVars: 0
      }, statics = {
        targetTest: 0,
        get: 0,
        getSetter: _getSetter,
        aliases: {},
        register: 0
      };
      _wake();
      if (config3 !== Plugin) {
        if (_plugins[name]) {
          return;
        }
        _setDefaults$1(Plugin, _setDefaults$1(_copyExcluding(config3, instanceDefaults), statics));
        _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config3, statics)));
        _plugins[Plugin.prop = name] = Plugin;
        if (config3.targetTest) {
          _harnessPlugins.push(Plugin);
          _reservedProps[name] = 1;
        }
        name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
      }
      _addGlobal(name, Plugin);
      config3.register && config3.register(gsap$1, Plugin, PropTween);
    } else {
      _registerPluginQueue.push(config3);
    }
  }, _255 = 255, _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0]
  }, _hue = function _hue2(h, m1, m2) {
    h += h < 0 ? 1 : h > 1 ? -1 : 0;
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0;
  }, splitColor = function splitColor2(v, toHSL, forceAlpha) {
    var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r, g, b, h, s, l, max, min, d, wasHSL;
    if (!a) {
      if (v.substr(-1) === ",") {
        v = v.substr(0, v.length - 1);
      }
      if (_colorLookup[v]) {
        a = _colorLookup[v];
      } else if (v.charAt(0) === "#") {
        if (v.length < 6) {
          r = v.charAt(1);
          g = v.charAt(2);
          b = v.charAt(3);
          v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
        }
        if (v.length === 9) {
          a = parseInt(v.substr(1, 6), 16);
          return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
        }
        v = parseInt(v.substr(1), 16);
        a = [v >> 16, v >> 8 & _255, v & _255];
      } else if (v.substr(0, 3) === "hsl") {
        a = wasHSL = v.match(_strictNumExp);
        if (!toHSL) {
          h = +a[0] % 360 / 360;
          s = +a[1] / 100;
          l = +a[2] / 100;
          g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
          r = l * 2 - g;
          a.length > 3 && (a[3] *= 1);
          a[0] = _hue(h + 1 / 3, r, g);
          a[1] = _hue(h, r, g);
          a[2] = _hue(h - 1 / 3, r, g);
        } else if (~v.indexOf("=")) {
          a = v.match(_numExp);
          forceAlpha && a.length < 4 && (a[3] = 1);
          return a;
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent;
      }
      a = a.map(Number);
    }
    if (toHSL && !wasHSL) {
      r = a[0] / _255;
      g = a[1] / _255;
      b = a[2] / _255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
      }
      a[0] = ~~(h + 0.5);
      a[1] = ~~(s * 100 + 0.5);
      a[2] = ~~(l * 100 + 0.5);
    }
    forceAlpha && a.length < 4 && (a[3] = 1);
    return a;
  }, _colorOrderData = function _colorOrderData2(v) {
    var values = [], c = [], i = -1;
    v.split(_colorExp).forEach(function(v2) {
      var a = v2.match(_numWithUnitExp) || [];
      values.push.apply(values, a);
      c.push(i += a.length + 1);
    });
    values.c = c;
    return values;
  }, _formatColors = function _formatColors2(s, toHSL, orderMatchData) {
    var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
    if (!colors) {
      return s;
    }
    colors = colors.map(function(color) {
      return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
    });
    if (orderMatchData) {
      d = _colorOrderData(s);
      c = orderMatchData.c;
      if (c.join(result) !== d.c.join(result)) {
        shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
        l = shell.length - 1;
        for (; i < l; i++) {
          result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
        }
      }
    }
    if (!shell) {
      shell = s.split(_colorExp);
      l = shell.length - 1;
      for (; i < l; i++) {
        result += shell[i] + colors[i];
      }
    }
    return result + shell[l];
  }, _colorExp = (function() {
    var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
    for (p in _colorLookup) {
      s += "|" + p + "\\b";
    }
    return new RegExp(s + ")", "gi");
  })(), _hslExp = /hsl[a]?\(/, _colorStringFilter = function _colorStringFilter2(a) {
    var combined = a.join(" "), toHSL;
    _colorExp.lastIndex = 0;
    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a[1] = _formatColors(a[1], toHSL);
      a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
      return true;
    }
  }, _tickerActive, _ticker = (function() {
    var _getTime2 = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime2(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners2 = [], _id, _req, _raf, _self, _delta, _i, _tick = function _tick2(v) {
      var elapsed = _getTime2() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
      (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
      _lastUpdate += elapsed;
      time = _lastUpdate - _startTime;
      overlap = time - _nextTime;
      if (overlap > 0 || manual) {
        frame = ++_self.frame;
        _delta = time - _self.time * 1e3;
        _self.time = time = time / 1e3;
        _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
        dispatch = 1;
      }
      manual || (_id = _req(_tick2));
      if (dispatch) {
        for (_i = 0; _i < _listeners2.length; _i++) {
          _listeners2[_i](time, _delta, frame, v);
        }
      }
    };
    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1e3 / (fps || 60));
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted$1 && _windowExists$2()) {
            _win$3 = _coreInitted$1 = window;
            _doc$3 = _win$3.document || {};
            _globals.gsap = gsap$1;
            (_win$3.gsapVersions || (_win$3.gsapVersions = [])).push(gsap$1.version);
            _install(_installScope || _win$3.GreenSockGlobals || !_win$3.gsap && _win$3 || {});
            _registerPluginQueue.forEach(_createPlugin);
          }
          _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
          _id && _self.sleep();
          _req = _raf || function(f) {
            return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
          };
          _tickerActive = 1;
          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc$1;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || Infinity;
        _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
      },
      fps: function fps(_fps) {
        _gap = 1e3 / (_fps || 240);
        _nextTime = _self.time * 1e3 + _gap;
      },
      add: function add(callback, once, prioritize) {
        var func = once ? function(t, d, f, v) {
          callback(t, d, f, v);
          _self.remove(func);
        } : callback;
        _self.remove(callback);
        _listeners2[prioritize ? "unshift" : "push"](func);
        _wake();
        return func;
      },
      remove: function remove(callback, i) {
        ~(i = _listeners2.indexOf(callback)) && _listeners2.splice(i, 1) && _i >= i && _i--;
      },
      _listeners: _listeners2
    };
    return _self;
  })(), _wake = function _wake2() {
    return !_tickerActive && _ticker.wake();
  }, _easeMap = {}, _customEaseExp = /^[\d.\-M][\d.\-,\s]/, _quotesExp = /["']/g, _parseObjectInString = function _parseObjectInString2(value) {
    var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length, index, val, parsedVal;
    for (; i < l; i++) {
      val = split[i];
      index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
      key = val.substr(index + 1).trim();
    }
    return obj;
  }, _valueInParentheses = function _valueInParentheses2(value) {
    var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
    return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
  }, _configEaseFromString = function _configEaseFromString2(name) {
    var split = (name + "").split("("), ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
  }, _invertEase = function _invertEase2(ease) {
    return function(p) {
      return 1 - ease(1 - p);
    };
  }, _propagateYoyoEase = function _propagateYoyoEase2(timeline2, isYoyo) {
    var child = timeline2._first, ease;
    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase2(child, isYoyo);
      } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
        if (child.timeline) {
          _propagateYoyoEase2(child.timeline, isYoyo);
        } else {
          ease = child._ease;
          child._ease = child._yEase;
          child._yEase = ease;
          child._yoyo = isYoyo;
        }
      }
      child = child._next;
    }
  }, _parseEase = function _parseEase2(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction$1(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  }, _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut2(p) {
        return 1 - easeIn(1 - p);
      };
    }
    if (easeInOut === void 0) {
      easeInOut = function easeInOut2(p) {
        return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
      };
    }
    var ease = {
      easeIn,
      easeOut,
      easeInOut
    }, lowercaseName;
    _forEachName(names, function(name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
      for (var p in ease) {
        _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
      }
    });
    return ease;
  }, _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
    return function(p) {
      return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2;
    };
  }, _configElastic = function _configElastic2(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p) {
      return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
    }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);
    p2 = _2PI / p2;
    ease.config = function(amplitude2, period2) {
      return _configElastic2(type, amplitude2, period2);
    };
    return ease;
  }, _configBack = function _configBack2(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }
    var easeOut = function easeOut2(p) {
      return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
    }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
      return 1 - easeOut(1 - p);
    } : _easeInOutFromOut(easeOut);
    ease.config = function(overshoot2) {
      return _configBack2(type, overshoot2);
    };
    return ease;
  };
  _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i) {
    var power = i < 5 ? i + 1 : i;
    _insertEase(name + ",Power" + (power - 1), i ? function(p) {
      return Math.pow(p, power);
    } : function(p) {
      return p;
    }, function(p) {
      return 1 - Math.pow(1 - p, power);
    }, function(p) {
      return p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
    });
  });
  _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
  _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
  (function(n, c) {
    var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n * (p -= 2.25 / c) * p + 0.9375 : n * Math.pow(p - 2.625 / c, 2) + 0.984375;
    };
    _insertEase("Bounce", function(p) {
      return 1 - easeOut(1 - p);
    }, easeOut);
  })(7.5625, 2.75);
  _insertEase("Expo", function(p) {
    return Math.pow(2, 10 * (p - 1)) * p + p * p * p * p * p * p * (1 - p);
  });
  _insertEase("Circ", function(p) {
    return -(_sqrt(1 - p * p) - 1);
  });
  _insertEase("Sine", function(p) {
    return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
  });
  _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
  _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
    config: function config(steps, immediateStart) {
      if (steps === void 0) {
        steps = 1;
      }
      var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
      return function(p) {
        return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
      };
    }
  };
  _defaults.ease = _easeMap["quad.out"];
  _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
    return _callbackNames += name + "," + name + "Params,";
  });
  var GSCache = function GSCache2(target, harness) {
    this.id = _gsID++;
    target._gsap = this;
    this.target = target;
    this.harness = harness;
    this.get = harness ? harness.get : _getProperty;
    this.set = harness ? harness.getSetter : _getSetter;
  };
  var Animation = (function() {
    function Animation2(vars) {
      this.vars = vars;
      this._delay = +vars.delay || 0;
      if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
        this._rDelay = vars.repeatDelay || 0;
        this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
      }
      this._ts = 1;
      _setDuration(this, +vars.duration, 1, 1);
      this.data = vars.data;
      if (_context$1) {
        this._ctx = _context$1;
        _context$1.data.push(this);
      }
      _tickerActive || _ticker.wake();
    }
    var _proto = Animation2.prototype;
    _proto.delay = function delay(value) {
      if (value || value === 0) {
        this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
        this._delay = value;
        return this;
      }
      return this._delay;
    };
    _proto.duration = function duration(value) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
    };
    _proto.totalDuration = function totalDuration(value) {
      if (!arguments.length) {
        return this._tDur;
      }
      this._dirty = 0;
      return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
    };
    _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
      _wake();
      if (!arguments.length) {
        return this._tTime;
      }
      var parent = this._dp;
      if (parent && parent.smoothChildTiming && this._ts) {
        _alignPlayhead(this, _totalTime);
        !parent._dp || parent.parent || _postAddChecks(parent, this);
        while (parent && parent.parent) {
          if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
            parent.totalTime(parent._tTime, true);
          }
          parent = parent.parent;
        }
        if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
          _addToTimeline(this._dp, this, this._start - this._delay);
        }
      }
      if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !this._initted && this._dur && _totalTime || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
        this._ts || (this._pTime = _totalTime);
        _lazySafeRender(this, _totalTime, suppressEvents);
      }
      return this;
    };
    _proto.time = function time(value, suppressEvents) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
    };
    _proto.totalProgress = function totalProgress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    };
    _proto.progress = function progress(value, suppressEvents) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
    };
    _proto.iteration = function iteration(value, suppressEvents) {
      var cycleDuration = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
    };
    _proto.timeScale = function timeScale(value, suppressEvents) {
      if (!arguments.length) {
        return this._rts === -_tinyNum ? 0 : this._rts;
      }
      if (this._rts === value) {
        return this;
      }
      var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
      this._rts = +value || 0;
      this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
      this.totalTime(_clamp(-Math.abs(this._delay), this.totalDuration(), tTime), suppressEvents !== false);
      _setEnd(this);
      return _recacheAncestors(this);
    };
    _proto.paused = function paused(value) {
      if (!arguments.length) {
        return this._ps;
      }
      if (this._ps !== value) {
        this._ps = value;
        if (value) {
          this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
          this._ts = this._act = 0;
        } else {
          _wake();
          this._ts = this._rts;
          this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
        }
      }
      return this;
    };
    _proto.startTime = function startTime(value) {
      if (arguments.length) {
        this._start = _roundPrecise(value);
        var parent = this.parent || this._dp;
        parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, this._start - this._delay);
        return this;
      }
      return this._start;
    };
    _proto.endTime = function endTime(includeRepeats) {
      return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    };
    _proto.rawTime = function rawTime(wrapRepeats) {
      var parent = this.parent || this._dp;
      return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
    };
    _proto.revert = function revert(config3) {
      if (config3 === void 0) {
        config3 = _revertConfig;
      }
      var prevIsReverting = _reverting$1;
      _reverting$1 = config3;
      if (_isRevertWorthy(this)) {
        this.timeline && this.timeline.revert(config3);
        this.totalTime(-0.01, config3.suppressEvents);
      }
      this.data !== "nested" && config3.kill !== false && this.kill();
      _reverting$1 = prevIsReverting;
      return this;
    };
    _proto.globalTime = function globalTime(rawTime) {
      var animation = this, time = arguments.length ? rawTime : animation.rawTime();
      while (animation) {
        time = animation._start + time / (Math.abs(animation._ts) || 1);
        animation = animation._dp;
      }
      return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
    };
    _proto.repeat = function repeat(value) {
      if (arguments.length) {
        this._repeat = value === Infinity ? -2 : value;
        return _onUpdateTotalDuration(this);
      }
      return this._repeat === -2 ? Infinity : this._repeat;
    };
    _proto.repeatDelay = function repeatDelay(value) {
      if (arguments.length) {
        var time = this._time;
        this._rDelay = value;
        _onUpdateTotalDuration(this);
        return time ? this.time(time) : this;
      }
      return this._rDelay;
    };
    _proto.yoyo = function yoyo(value) {
      if (arguments.length) {
        this._yoyo = value;
        return this;
      }
      return this._yoyo;
    };
    _proto.seek = function seek(position, suppressEvents) {
      return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
    };
    _proto.restart = function restart(includeDelay, suppressEvents) {
      this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
      this._dur || (this._zTime = -_tinyNum);
      return this;
    };
    _proto.play = function play(from, suppressEvents) {
      from != null && this.seek(from, suppressEvents);
      return this.reversed(false).paused(false);
    };
    _proto.reverse = function reverse(from, suppressEvents) {
      from != null && this.seek(from || this.totalDuration(), suppressEvents);
      return this.reversed(true).paused(false);
    };
    _proto.pause = function pause(atTime, suppressEvents) {
      atTime != null && this.seek(atTime, suppressEvents);
      return this.paused(true);
    };
    _proto.resume = function resume() {
      return this.paused(false);
    };
    _proto.reversed = function reversed(value) {
      if (arguments.length) {
        !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
        return this;
      }
      return this._rts < 0;
    };
    _proto.invalidate = function invalidate() {
      this._initted = this._act = 0;
      this._zTime = -_tinyNum;
      return this;
    };
    _proto.isActive = function isActive() {
      var parent = this.parent || this._dp, start = this._start, rawTime;
      return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
    };
    _proto.eventCallback = function eventCallback(type, callback, params) {
      var vars = this.vars;
      if (arguments.length > 1) {
        if (!callback) {
          delete vars[type];
        } else {
          vars[type] = callback;
          params && (vars[type + "Params"] = params);
          type === "onUpdate" && (this._onUpdate = callback);
        }
        return this;
      }
      return vars[type];
    };
    _proto.then = function then(onFulfilled) {
      var self2 = this, prevProm = self2._prom;
      return new Promise(function(resolve) {
        var f = _isFunction$1(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve2() {
          var _then = self2.then;
          self2.then = null;
          prevProm && prevProm();
          _isFunction$1(f) && (f = f(self2)) && (f.then || f === self2) && (self2.then = _then);
          resolve(f);
          self2.then = _then;
        };
        if (self2._initted && self2.totalProgress() === 1 && self2._ts >= 0 || !self2._tTime && self2._ts < 0) {
          _resolve();
        } else {
          self2._prom = _resolve;
        }
      });
    };
    _proto.kill = function kill() {
      _interrupt(this);
    };
    return Animation2;
  })();
  _setDefaults$1(Animation.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: null,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -_tinyNum,
    _prom: 0,
    _ps: false,
    _rts: 1
  });
  var Timeline = (function(_Animation) {
    _inheritsLoose$1(Timeline2, _Animation);
    function Timeline2(vars, position) {
      var _this;
      if (vars === void 0) {
        vars = {};
      }
      _this = _Animation.call(this, vars) || this;
      _this.labels = {};
      _this.smoothChildTiming = !!vars.smoothChildTiming;
      _this.autoRemoveChildren = !!vars.autoRemoveChildren;
      _this._sort = _isNotFalse(vars.sortChildren);
      _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized$1(_this), position);
      vars.reversed && _this.reverse();
      vars.paused && _this.paused(true);
      vars.scrollTrigger && _scrollTrigger(_assertThisInitialized$1(_this), vars.scrollTrigger);
      return _this;
    }
    var _proto2 = Timeline2.prototype;
    _proto2.to = function to(targets, vars, position) {
      _createTweenType(0, arguments, this);
      return this;
    };
    _proto2.from = function from(targets, vars, position) {
      _createTweenType(1, arguments, this);
      return this;
    };
    _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
      _createTweenType(2, arguments, this);
      return this;
    };
    _proto2.set = function set(targets, vars, position) {
      vars.duration = 0;
      vars.parent = this;
      _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
      vars.immediateRender = !!vars.immediateRender;
      new Tween(targets, vars, _parsePosition(this, position), 1);
      return this;
    };
    _proto2.call = function call(callback, params, position) {
      return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
    };
    _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.duration = duration;
      vars.stagger = vars.stagger || stagger;
      vars.onComplete = onCompleteAll;
      vars.onCompleteParams = onCompleteAllParams;
      vars.parent = this;
      new Tween(targets, vars, _parsePosition(this, position));
      return this;
    };
    _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
      vars.runBackwards = 1;
      _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
      return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
    };
    _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
      toVars.startAt = fromVars;
      _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
      return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
    };
    _proto2.render = function render3(totalTime, suppressEvents, force) {
      var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
      this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
      if (tTime !== this._tTime || force || crossingStart) {
        if (prevTime !== this._time && dur) {
          tTime += this._time - prevTime;
          totalTime += this._time - prevTime;
        }
        time = tTime;
        prevStart = this._start;
        timeScale = this._ts;
        prevPaused = !timeScale;
        if (crossingStart) {
          dur || (prevTime = this._zTime);
          (totalTime || !suppressEvents) && (this._zTime = totalTime);
        }
        if (this._repeat) {
          yoyo = this._yoyo;
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && totalTime < 0) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration);
          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            prevIteration = _roundPrecise(tTime / cycleDuration);
            iteration = ~~prevIteration;
            if (iteration && iteration === prevIteration) {
              time = dur;
              iteration--;
            }
            time > dur && (time = dur);
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
          if (yoyo && iteration & 1) {
            time = dur - time;
            isYoyo = 1;
          }
          if (iteration !== prevIteration && !this._lock) {
            var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
            iteration < prevIteration && (rewinding = !rewinding);
            prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
            this._lock = 1;
            this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
            this._tTime = tTime;
            !suppressEvents && this.parent && _callback(this, "onRepeat");
            if (this.vars.repeatRefresh && !isYoyo) {
              this.invalidate()._lock = 1;
              prevIteration = iteration;
            }
            if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
              return this;
            }
            dur = this._dur;
            tDur = this._tDur;
            if (doesWrap) {
              this._lock = 2;
              prevTime = rewinding ? dur : -1e-4;
              this.render(prevTime, true);
              this.vars.repeatRefresh && !isYoyo && this.invalidate();
            }
            this._lock = 0;
            if (!this._ts && !prevPaused) {
              return this;
            }
            _propagateYoyoEase(this, isYoyo);
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2) {
          pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
          if (pauseTween) {
            tTime -= time - (time = pauseTween._start);
          }
        }
        this._tTime = tTime;
        this._time = time;
        this._act = !timeScale;
        if (!this._initted) {
          this._onUpdate = this.vars.onUpdate;
          this._initted = 1;
          this._zTime = totalTime;
          prevTime = 0;
        }
        if (!prevTime && tTime && dur && !suppressEvents && !prevIteration) {
          _callback(this, "onStart");
          if (this._tTime !== tTime) {
            return this;
          }
        }
        if (time >= prevTime && totalTime >= 0) {
          child = this._first;
          while (child) {
            next = child._next;
            if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = -_tinyNum);
                break;
              }
            }
            child = next;
          }
        } else {
          child = this._last;
          var adjustedTime = totalTime < 0 ? totalTime : time;
          while (child) {
            next = child._prev;
            if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
              if (child.parent !== this) {
                return this.render(totalTime, suppressEvents, force);
              }
              child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && _isRevertWorthy(child));
              if (time !== this._time || !this._ts && !prevPaused) {
                pauseTween = 0;
                next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                break;
              }
            }
            child = next;
          }
        }
        if (pauseTween && !suppressEvents) {
          this.pause();
          pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
          if (this._ts) {
            this._start = prevStart;
            _setEnd(this);
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
        if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
          if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
            if (!this._lock) {
              (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
              if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
                _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
                this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
              }
            }
          }
        }
      }
      return this;
    };
    _proto2.add = function add(child, position) {
      var _this2 = this;
      _isNumber(position) || (position = _parsePosition(this, position, child));
      if (!(child instanceof Animation)) {
        if (_isArray$1(child)) {
          child.forEach(function(obj) {
            return _this2.add(obj, position);
          });
          return this;
        }
        if (_isString(child)) {
          return this.addLabel(child, position);
        }
        if (_isFunction$1(child)) {
          child = Tween.delayedCall(0, child);
        } else {
          return this;
        }
      }
      return this !== child ? _addToTimeline(this, child, position) : this;
    };
    _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
      if (nested === void 0) {
        nested = true;
      }
      if (tweens === void 0) {
        tweens = true;
      }
      if (timelines === void 0) {
        timelines = true;
      }
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = -_bigNum$2;
      }
      var a = [], child = this._first;
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          if (child instanceof Tween) {
            tweens && a.push(child);
          } else {
            timelines && a.push(child);
            nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
          }
        }
        child = child._next;
      }
      return a;
    };
    _proto2.getById = function getById2(id) {
      var animations = this.getChildren(1, 1, 1), i = animations.length;
      while (i--) {
        if (animations[i].vars.id === id) {
          return animations[i];
        }
      }
    };
    _proto2.remove = function remove(child) {
      if (_isString(child)) {
        return this.removeLabel(child);
      }
      if (_isFunction$1(child)) {
        return this.killTweensOf(child);
      }
      child.parent === this && _removeLinkedListItem(this, child);
      if (child === this._recent) {
        this._recent = this._last;
      }
      return _uncache(this);
    };
    _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
      if (!arguments.length) {
        return this._tTime;
      }
      this._forcing = 1;
      if (!this._dp && this._ts) {
        this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
      }
      _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
      this._forcing = 0;
      return this;
    };
    _proto2.addLabel = function addLabel(label, position) {
      this.labels[label] = _parsePosition(this, position);
      return this;
    };
    _proto2.removeLabel = function removeLabel(label) {
      delete this.labels[label];
      return this;
    };
    _proto2.addPause = function addPause(position, callback, params) {
      var t = Tween.delayedCall(0, callback || _emptyFunc$1, params);
      t.data = "isPause";
      this._hasPause = 1;
      return _addToTimeline(this, t, _parsePosition(this, position));
    };
    _proto2.removePause = function removePause(position) {
      var child = this._first;
      position = _parsePosition(this, position);
      while (child) {
        if (child._start === position && child.data === "isPause") {
          _removeFromParent(child);
        }
        child = child._next;
      }
    };
    _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
      while (i--) {
        _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
      }
      return this;
    };
    _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
      var a = [], parsedTargets = toArray$1(targets), child = this._first, isGlobalTime = _isNumber(onlyActive), children;
      while (child) {
        if (child instanceof Tween) {
          if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
            a.push(child);
          }
        } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
          a.push.apply(a, children);
        }
        child = child._next;
      }
      return a;
    };
    _proto2.tweenTo = function tweenTo(position, vars) {
      vars = vars || {};
      var tl = this, endTime = _parsePosition(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults$1({
        ease: vars.ease || "none",
        lazy: false,
        immediateRender: false,
        time: endTime,
        overwrite: "auto",
        duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
        onStart: function onStart() {
          tl.pause();
          if (!initted) {
            var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
            tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
            initted = 1;
          }
          _onStart && _onStart.apply(tween, onStartParams || []);
        }
      }, vars));
      return immediateRender ? tween.render(0) : tween;
    };
    _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
      return this.tweenTo(toPosition, _setDefaults$1({
        startAt: {
          time: _parsePosition(this, fromPosition)
        }
      }, vars));
    };
    _proto2.recent = function recent() {
      return this._recent;
    };
    _proto2.nextLabel = function nextLabel(afterTime) {
      if (afterTime === void 0) {
        afterTime = this._time;
      }
      return _getLabelInDirection(this, _parsePosition(this, afterTime));
    };
    _proto2.previousLabel = function previousLabel(beforeTime) {
      if (beforeTime === void 0) {
        beforeTime = this._time;
      }
      return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
    };
    _proto2.currentLabel = function currentLabel(value) {
      return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
    };
    _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
      if (ignoreBeforeTime === void 0) {
        ignoreBeforeTime = 0;
      }
      var child = this._first, labels = this.labels, p;
      amount = _roundPrecise(amount);
      while (child) {
        if (child._start >= ignoreBeforeTime) {
          child._start += amount;
          child._end += amount;
        }
        child = child._next;
      }
      if (adjustLabels) {
        for (p in labels) {
          if (labels[p] >= ignoreBeforeTime) {
            labels[p] += amount;
          }
        }
      }
      return _uncache(this);
    };
    _proto2.invalidate = function invalidate(soft) {
      var child = this._first;
      this._lock = 0;
      while (child) {
        child.invalidate(soft);
        child = child._next;
      }
      return _Animation.prototype.invalidate.call(this, soft);
    };
    _proto2.clear = function clear(includeLabels) {
      if (includeLabels === void 0) {
        includeLabels = true;
      }
      var child = this._first, next;
      while (child) {
        next = child._next;
        this.remove(child);
        child = next;
      }
      this._dp && (this._time = this._tTime = this._pTime = 0);
      includeLabels && (this.labels = {});
      return _uncache(this);
    };
    _proto2.totalDuration = function totalDuration(value) {
      var max = 0, self2 = this, child = self2._last, prevStart = _bigNum$2, prev, start, parent;
      if (arguments.length) {
        return self2.timeScale((self2._repeat < 0 ? self2.duration() : self2.totalDuration()) / (self2.reversed() ? -value : value));
      }
      if (self2._dirty) {
        parent = self2.parent;
        while (child) {
          prev = child._prev;
          child._dirty && child.totalDuration();
          start = child._start;
          if (start > prevStart && self2._sort && child._ts && !self2._lock) {
            self2._lock = 1;
            _addToTimeline(self2, child, start - child._delay, 1)._lock = 0;
          } else {
            prevStart = start;
          }
          if (start < 0 && child._ts) {
            max -= start;
            if (!parent && !self2._dp || parent && parent.smoothChildTiming) {
              self2._start += _roundPrecise(start / self2._ts);
              self2._time -= start;
              self2._tTime -= start;
            }
            self2.shiftChildren(-start, false, -Infinity);
            prevStart = 0;
          }
          child._end > max && child._ts && (max = child._end);
          child = prev;
        }
        _setDuration(self2, self2 === _globalTimeline && self2._time > max ? self2._time : max, 1, 1);
        self2._dirty = 0;
      }
      return self2._tDur;
    };
    Timeline2.updateRoot = function updateRoot(time) {
      if (_globalTimeline._ts) {
        _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
        _lastRenderedFrame = _ticker.frame;
      }
      if (_ticker.frame >= _nextGCFrame) {
        _nextGCFrame += _config.autoSleep || 120;
        var child = _globalTimeline._first;
        if (!child || !child._ts) {
          if (_config.autoSleep && _ticker._listeners.length < 2) {
            while (child && !child._ts) {
              child = child._next;
            }
            child || _ticker.sleep();
          }
        }
      }
    };
    return Timeline2;
  })(Animation);
  _setDefaults$1(Timeline.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });
  var _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop, start, end, setter, stringFilter, funcParam) {
    var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";
    if (hasRandom = ~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }
    if (stringFilter) {
      a = [start, end];
      stringFilter(a, target, prop);
      start = a[0];
      end = a[1];
    }
    startNums = start.match(_complexStringNumExp) || [];
    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0];
      chunk = end.substring(index, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }
      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0;
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
s: startNum,
          c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0
        };
        index = _complexStringNumExp.lastIndex;
      }
    }
    pt.c = index < end.length ? end.substring(index, end.length) : "";
    pt.fp = funcParam;
    if (_relExp.test(end) || hasRandom) {
      pt.e = 0;
    }
    this._pt = pt;
    return pt;
  }, _addPropTween = function _addPropTween2(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
    _isFunction$1(end) && (end = end(index || 0, target, targets));
    var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction$1(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction$1(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction$1(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (end.charAt(1) === "=") {
        pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
        if (pt || pt === 0) {
          end = pt;
        }
      }
    }
    if (!optional || parsedStart !== end || _forceAllPropTweens) {
      if (!isNaN(parsedStart * end) && end !== "") {
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
        funcParam && (pt.fp = funcParam);
        modifier && pt.modifier(modifier, this, target);
        return this._pt = pt;
      }
      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
    }
  }, _processVars = function _processVars2(vars, index, target, targets, tween) {
    _isFunction$1(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
    if (!_isObject$1(vars) || vars.style && vars.nodeType || _isArray$1(vars) || _isTypedArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
    }
    var copy = {}, p;
    for (p in vars) {
      copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
    }
    return copy;
  }, _checkPlugin = function _checkPlugin2(property, vars, tween, index, target, targets) {
    var plugin, pt, ptLookup, i;
    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
        i = plugin._props.length;
        while (i--) {
          ptLookup[plugin._props[i]] = pt;
        }
      }
    }
    return plugin;
  }, _overwritingTween, _forceAllPropTweens, _initTween = function _initTween2(tween, time, tTime) {
    var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl = tween.timeline, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
    tl && (!keyframes || !ease) && (ease = "none");
    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }
    tween._from = !tl && !!vars.runBackwards;
    if (!tl || keyframes && !vars.stagger) {
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop];
      cleanVars = _copyExcluding(vars, _reservedProps);
      if (prevStartAt) {
        prevStartAt._zTime < 0 && prevStartAt.progress(1);
        time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
        prevStartAt._lazy = 0;
      }
      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults$1({
          data: "isStart",
          overwrite: false,
          parent,
          immediateRender: true,
          lazy: !prevStartAt && _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate: onUpdate && function() {
            return _callback(tween, "onUpdate");
          },
          stagger: 0
        }, startAt)));
        tween._startAt._dp = 0;
        tween._startAt._sat = tween;
        time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
        if (immediateRender) {
          if (dur && time <= 0 && tTime <= 0) {
            time && (tween._zTime = time);
            return;
          }
        }
      } else if (runBackwards && dur) {
        if (!prevStartAt) {
          time && (immediateRender = false);
          p = _setDefaults$1({
            overwrite: false,
            data: "isFromStart",
lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
            immediateRender,
stagger: 0,
            parent
}, cleanVars);
          harnessVars && (p[harness.prop] = harnessVars);
          _removeFromParent(tween._startAt = Tween.set(targets, p));
          tween._startAt._dp = 0;
          tween._startAt._sat = tween;
          time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
          tween._zTime = time;
          if (!immediateRender) {
            _initTween2(tween._startAt, _tinyNum, _tinyNum);
          } else if (!time) {
            return;
          }
        }
      }
      tween._pt = tween._ptCache = 0;
      lazy = dur && _isNotFalse(lazy) || lazy && !dur;
      for (i = 0; i < targets.length; i++) {
        target = targets[i];
        gsData = target._gsap || _harness(targets)[i]._gsap;
        tween._ptLookup[i] = ptLookup = {};
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
        index = fullTargets === targets ? i : fullTargets.indexOf(target);
        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
          plugin._props.forEach(function(name) {
            ptLookup[name] = pt;
          });
          plugin.priority && (hasPriority = 1);
        }
        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              plugin.priority && (hasPriority = 1);
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
            }
          }
        }
        tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween;
          _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
          overwritten = !tween.parent;
          _overwritingTween = 0;
        }
        tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
      }
      hasPriority && _sortPropTweensByPriority(tween);
      tween._onInit && tween._onInit(tween);
    }
    tween._onUpdate = onUpdate;
    tween._initted = (!tween._op || tween._pt) && !overwritten;
    keyframes && time <= 0 && tl.render(_bigNum$2, true, true);
  }, _updatePropTweens = function _updatePropTweens2(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
    var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
    if (!ptCache) {
      ptCache = tween._ptCache[property] = [];
      lookup = tween._ptLookup;
      i = tween._targets.length;
      while (i--) {
        pt = lookup[i][property];
        if (pt && pt.d && pt.d._pt) {
          pt = pt.d._pt;
          while (pt && pt.p !== property && pt.fp !== property) {
            pt = pt._next;
          }
        }
        if (!pt) {
          _forceAllPropTweens = 1;
          tween.vars[property] = "+=0";
          _initTween(tween, time);
          _forceAllPropTweens = 0;
          return skipRecursion ? _warn(property + " not eligible for reset") : 1;
        }
        ptCache.push(pt);
      }
    }
    i = ptCache.length;
    while (i--) {
      rootPT = ptCache[i];
      pt = rootPT._pt || rootPT;
      pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
      pt.c = value - pt.s;
      rootPT.e && (rootPT.e = _round$1(value) + getUnit(rootPT.e));
      rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
    }
  }, _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i, aliases;
    if (!propertyAliases) {
      return vars;
    }
    copy = _merge({}, vars);
    for (p in propertyAliases) {
      if (p in copy) {
        aliases = propertyAliases[p].split(",");
        i = aliases.length;
        while (i--) {
          copy[aliases[i]] = copy[p];
        }
      }
    }
    return copy;
  }, _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
    var ease = obj.ease || easeEach || "power1.inOut", p, a;
    if (_isArray$1(obj)) {
      a = allProps[prop] || (allProps[prop] = []);
      obj.forEach(function(value, i) {
        return a.push({
          t: i / (obj.length - 1) * 100,
          v: value,
          e: ease
        });
      });
    } else {
      for (p in obj) {
        a = allProps[p] || (allProps[p] = []);
        p === "ease" || a.push({
          t: parseFloat(prop),
          v: obj[p],
          e: ease
        });
      }
    }
  }, _parseFuncOrString = function _parseFuncOrString2(value, tween, i, target, targets) {
    return _isFunction$1(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
  }, _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", _staggerPropsToSkip = {};
  _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
    return _staggerPropsToSkip[name] = 1;
  });
  var Tween = (function(_Animation2) {
    _inheritsLoose$1(Tween2, _Animation2);
    function Tween2(targets, vars, position, skipInherit) {
      var _this3;
      if (typeof vars === "number") {
        position.duration = vars;
        vars = position;
        position = null;
      }
      _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
      var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults3 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray$1(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray$1(targets), tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
      _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
      _this3._ptLookup = [];
      _this3._overwrite = overwrite;
      if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        vars = _this3.vars;
        tl = _this3.timeline = new Timeline({
          data: "nested",
          defaults: defaults3 || {},
          targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
        });
        tl.kill();
        tl.parent = tl._dp = _assertThisInitialized$1(_this3);
        tl._start = 0;
        if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
          l = parsedTargets.length;
          staggerFunc = stagger && distribute(stagger);
          if (_isObject$1(stagger)) {
            for (p in stagger) {
              if (~_staggerTweenProps.indexOf(p)) {
                staggerVarsToMerge || (staggerVarsToMerge = {});
                staggerVarsToMerge[p] = stagger[p];
              }
            }
          }
          for (i = 0; i < l; i++) {
            copy = _copyExcluding(vars, _staggerPropsToSkip);
            copy.stagger = 0;
            yoyoEase && (copy.yoyoEase = yoyoEase);
            staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
            curTarget = parsedTargets[i];
            copy.duration = +_parseFuncOrString(duration, _assertThisInitialized$1(_this3), i, curTarget, parsedTargets);
            copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized$1(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
            if (!stagger && l === 1 && copy.delay) {
              _this3._delay = delay = copy.delay;
              _this3._start += delay;
              copy.delay = 0;
            }
            tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
            tl._ease = _easeMap.none;
          }
          tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
        } else if (keyframes) {
          _inheritDefaults(_setDefaults$1(tl.vars.defaults, {
            ease: "none"
          }));
          tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
          var time = 0, a, kf, v;
          if (_isArray$1(keyframes)) {
            keyframes.forEach(function(frame) {
              return tl.to(parsedTargets, frame, ">");
            });
            tl.duration();
          } else {
            copy = {};
            for (p in keyframes) {
              p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
            }
            for (p in copy) {
              a = copy[p].sort(function(a2, b) {
                return a2.t - b.t;
              });
              time = 0;
              for (i = 0; i < a.length; i++) {
                kf = a[i];
                v = {
                  ease: kf.e,
                  duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
                };
                v[p] = kf.v;
                tl.to(parsedTargets, v, time);
                time += v.duration;
              }
            }
            tl.duration() < duration && tl.to({}, {
              duration: duration - tl.duration()
            });
          }
        }
        duration || _this3.duration(duration = tl.duration());
      } else {
        _this3.timeline = 0;
      }
      if (overwrite === true && !_suppressOverwrites) {
        _overwritingTween = _assertThisInitialized$1(_this3);
        _globalTimeline.killTweensOf(parsedTargets);
        _overwritingTween = 0;
      }
      _addToTimeline(parent, _assertThisInitialized$1(_this3), position);
      vars.reversed && _this3.reverse();
      vars.paused && _this3.paused(true);
      if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized$1(_this3)) && parent.data !== "nested") {
        _this3._tTime = -_tinyNum;
        _this3.render(Math.max(0, -delay) || 0);
      }
      scrollTrigger && _scrollTrigger(_assertThisInitialized$1(_this3), scrollTrigger);
      return _this3;
    }
    var _proto3 = Tween2.prototype;
    _proto3.render = function render3(totalTime, suppressEvents, force) {
      var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline2, yoyoEase;
      if (!dur) {
        _renderZeroDurationTween(this, totalTime, suppressEvents, force);
      } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
        time = tTime;
        timeline2 = this.timeline;
        if (this._repeat) {
          cycleDuration = dur + this._rDelay;
          if (this._repeat < -1 && isNegative) {
            return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
          }
          time = _roundPrecise(tTime % cycleDuration);
          if (tTime === tDur) {
            iteration = this._repeat;
            time = dur;
          } else {
            prevIteration = _roundPrecise(tTime / cycleDuration);
            iteration = ~~prevIteration;
            if (iteration && iteration === prevIteration) {
              time = dur;
              iteration--;
            } else if (time > dur) {
              time = dur;
            }
          }
          isYoyo = this._yoyo && iteration & 1;
          if (isYoyo) {
            yoyoEase = this._yEase;
            time = dur - time;
          }
          prevIteration = _animationCycle(this._tTime, cycleDuration);
          if (time === prevTime && !force && this._initted && iteration === prevIteration) {
            this._tTime = tTime;
            return this;
          }
          if (iteration !== prevIteration) {
            timeline2 && this._yEase && _propagateYoyoEase(timeline2, isYoyo);
            if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
              this._lock = force = 1;
              this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
            }
          }
        }
        if (!this._initted) {
          if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
            this._tTime = 0;
            return this;
          }
          if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
            return this;
          }
          if (dur !== this._dur) {
            return this.render(totalTime, suppressEvents, force);
          }
        }
        this._tTime = tTime;
        this._time = time;
        if (!this._act && this._ts) {
          this._act = 1;
          this._lazy = 0;
        }
        this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
        if (this._from) {
          this.ratio = ratio = 1 - ratio;
        }
        if (!prevTime && tTime && !suppressEvents && !prevIteration) {
          _callback(this, "onStart");
          if (this._tTime !== tTime) {
            return this;
          }
        }
        pt = this._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        timeline2 && timeline2.render(totalTime < 0 ? totalTime : timeline2._dur * timeline2._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
        if (this._onUpdate && !suppressEvents) {
          isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
          _callback(this, "onUpdate");
        }
        this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
        if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
          isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
          (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
          if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
            _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
            this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
          }
        }
      }
      return this;
    };
    _proto3.targets = function targets() {
      return this._targets;
    };
    _proto3.invalidate = function invalidate(soft) {
      (!soft || !this.vars.runBackwards) && (this._startAt = 0);
      this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
      this._ptLookup = [];
      this.timeline && this.timeline.invalidate(soft);
      return _Animation2.prototype.invalidate.call(this, soft);
    };
    _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
      _tickerActive || _ticker.wake();
      this._ts || this.play();
      var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
      this._initted || _initTween(this, time);
      ratio = this._ease(time / this._dur);
      if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
        return this.resetTo(property, value, start, startIsRelative, 1);
      }
      _alignPlayhead(this, 0);
      this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
      return this.render(0);
    };
    _proto3.kill = function kill(targets, vars) {
      if (vars === void 0) {
        vars = "all";
      }
      if (!targets && (!vars || vars === "all")) {
        this._lazy = this._pt = 0;
        this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting$1);
        return this;
      }
      if (this.timeline) {
        var tDur = this.timeline.totalDuration();
        this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
        this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
        return this;
      }
      var parsedTargets = this._targets, killingTargets = targets ? toArray$1(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
      if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
        vars === "all" && (this._pt = 0);
        return _interrupt(this);
      }
      overwrittenProps = this._op = this._op || [];
      if (vars !== "all") {
        if (_isString(vars)) {
          p = {};
          _forEachName(vars, function(name) {
            return p[name] = 1;
          });
          vars = p;
        }
        vars = _addAliasesToVars(parsedTargets, vars);
      }
      i = parsedTargets.length;
      while (i--) {
        if (~killingTargets.indexOf(parsedTargets[i])) {
          curLookup = propTweenLookup[i];
          if (vars === "all") {
            overwrittenProps[i] = vars;
            props = curLookup;
            curOverwriteProps = {};
          } else {
            curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
            props = vars;
          }
          for (p in props) {
            pt = curLookup && curLookup[p];
            if (pt) {
              if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                _removeLinkedListItem(this, pt, "_pt");
              }
              delete curLookup[p];
            }
            if (curOverwriteProps !== "all") {
              curOverwriteProps[p] = 1;
            }
          }
        }
      }
      this._initted && !this._pt && firstPT && _interrupt(this);
      return this;
    };
    Tween2.to = function to(targets, vars) {
      return new Tween2(targets, vars, arguments[2]);
    };
    Tween2.from = function from(targets, vars) {
      return _createTweenType(1, arguments);
    };
    Tween2.delayedCall = function delayedCall(delay, callback, params, scope) {
      return new Tween2(callback, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope
      });
    };
    Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
      return _createTweenType(2, arguments);
    };
    Tween2.set = function set(targets, vars) {
      vars.duration = 0;
      vars.repeatDelay || (vars.repeat = 0);
      return new Tween2(targets, vars);
    };
    Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
      return _globalTimeline.killTweensOf(targets, props, onlyActive);
    };
    return Tween2;
  })(Animation);
  _setDefaults$1(Tween.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });
  _forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
    Tween[name] = function() {
      var tl = new Timeline(), params = _slice.call(arguments, 0);
      params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
      return tl[name].apply(tl, params);
    };
  });
  var _setterPlain = function _setterPlain2(target, property, value) {
    return target[property] = value;
  }, _setterFunc = function _setterFunc2(target, property, value) {
    return target[property](value);
  }, _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
    return target[property](data.fp, value);
  }, _setterAttribute = function _setterAttribute2(target, property, value) {
    return target.setAttribute(property, value);
  }, _getSetter = function _getSetter2(target, property) {
    return _isFunction$1(target[property]) ? _setterFunc : _isUndefined$1(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
  }, _renderPlain = function _renderPlain2(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
  }, _renderBoolean = function _renderBoolean2(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  }, _renderComplexString = function _renderComplexString2(ratio, data) {
    var pt = data._pt, s = "";
    if (!ratio && data.b) {
      s = data.b;
    } else if (ratio === 1 && data.e) {
      s = data.e;
    } else {
      while (pt) {
        s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
        pt = pt._next;
      }
      s += data.c;
    }
    data.set(data.t, data.p, s, data);
  }, _renderPropTweens = function _renderPropTweens2(ratio, data) {
    var pt = data._pt;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
  }, _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
    var pt = this._pt, next;
    while (pt) {
      next = pt._next;
      pt.p === property && pt.modifier(modifier, tween, target);
      pt = next;
    }
  }, _killPropTweensOf = function _killPropTweensOf2(property) {
    var pt = this._pt, hasNonDependentRemaining, next;
    while (pt) {
      next = pt._next;
      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, "_pt");
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1;
      }
      pt = next;
    }
    return !hasNonDependentRemaining;
  }, _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  }, _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
    var pt = parent._pt, next, pt2, first, last;
    while (pt) {
      next = pt._next;
      pt2 = first;
      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next;
      }
      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt;
      } else {
        first = pt;
      }
      if (pt._next = pt2) {
        pt2._prev = pt;
      } else {
        last = pt;
      }
      pt = next;
    }
    parent._pt = first;
  };
  var PropTween = (function() {
    function PropTween2(next, target, prop, start, change, renderer, data, setter, priority) {
      this.t = target;
      this.s = start;
      this.c = change;
      this.p = prop;
      this.r = renderer || _renderPlain;
      this.d = data || this;
      this.set = setter || _setterPlain;
      this.pr = priority || 0;
      this._next = next;
      if (next) {
        next._prev = this;
      }
    }
    var _proto4 = PropTween2.prototype;
    _proto4.modifier = function modifier(func, tween, target) {
      this.mSet = this.mSet || this.set;
      this.set = _setterWithModifier;
      this.m = func;
      this.mt = target;
      this.tween = tween;
    };
    return PropTween2;
  })();
  _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(name) {
    return _reservedProps[name] = 1;
  });
  _globals.TweenMax = _globals.TweenLite = Tween;
  _globals.TimelineLite = _globals.TimelineMax = Timeline;
  _globalTimeline = new Timeline({
    sortChildren: false,
    defaults: _defaults,
    autoRemoveChildren: true,
    id: "root",
    smoothChildTiming: true
  });
  _config.stringFilter = _colorStringFilter;
  var _media = [], _listeners = {}, _emptyArray = [], _lastMediaTime = 0, _contextID = 0, _dispatch = function _dispatch2(type) {
    return (_listeners[type] || _emptyArray).map(function(f) {
      return f();
    });
  }, _onMediaChange = function _onMediaChange2() {
    var time = Date.now(), matches = [];
    if (time - _lastMediaTime > 2) {
      _dispatch("matchMediaInit");
      _media.forEach(function(c) {
        var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
        for (p in queries) {
          match = _win$3.matchMedia(queries[p]).matches;
          match && (anyMatch = 1);
          if (match !== conditions[p]) {
            conditions[p] = match;
            toggled = 1;
          }
        }
        if (toggled) {
          c.revert();
          anyMatch && matches.push(c);
        }
      });
      _dispatch("matchMediaRevert");
      matches.forEach(function(c) {
        return c.onMatch(c, function(func) {
          return c.add(null, func);
        });
      });
      _lastMediaTime = time;
      _dispatch("matchMedia");
    }
  };
  var Context = (function() {
    function Context2(func, scope) {
      this.selector = scope && selector(scope);
      this.data = [];
      this._r = [];
      this.isReverted = false;
      this.id = _contextID++;
      func && this.add(func);
    }
    var _proto5 = Context2.prototype;
    _proto5.add = function add(name, func, scope) {
      if (_isFunction$1(name)) {
        scope = func;
        func = name;
        name = _isFunction$1;
      }
      var self2 = this, f = function f2() {
        var prev = _context$1, prevSelector = self2.selector, result;
        prev && prev !== self2 && prev.data.push(self2);
        scope && (self2.selector = selector(scope));
        _context$1 = self2;
        result = func.apply(self2, arguments);
        _isFunction$1(result) && self2._r.push(result);
        _context$1 = prev;
        self2.selector = prevSelector;
        self2.isReverted = false;
        return result;
      };
      self2.last = f;
      return name === _isFunction$1 ? f(self2, function(func2) {
        return self2.add(null, func2);
      }) : name ? self2[name] = f : f;
    };
    _proto5.ignore = function ignore(func) {
      var prev = _context$1;
      _context$1 = null;
      func(this);
      _context$1 = prev;
    };
    _proto5.getTweens = function getTweens() {
      var a = [];
      this.data.forEach(function(e) {
        return e instanceof Context2 ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
      });
      return a;
    };
    _proto5.clear = function clear() {
      this._r.length = this.data.length = 0;
    };
    _proto5.kill = function kill(revert, matchMedia2) {
      var _this4 = this;
      if (revert) {
        (function() {
          var tweens = _this4.getTweens(), i2 = _this4.data.length, t;
          while (i2--) {
            t = _this4.data[i2];
            if (t.data === "isFlip") {
              t.revert();
              t.getChildren(true, true, false).forEach(function(tween) {
                return tweens.splice(tweens.indexOf(tween), 1);
              });
            }
          }
          tweens.map(function(t2) {
            return {
              g: t2._dur || t2._delay || t2._sat && !t2._sat.vars.immediateRender ? t2.globalTime(0) : -Infinity,
              t: t2
            };
          }).sort(function(a, b) {
            return b.g - a.g || -Infinity;
          }).forEach(function(o) {
            return o.t.revert(revert);
          });
          i2 = _this4.data.length;
          while (i2--) {
            t = _this4.data[i2];
            if (t instanceof Timeline) {
              if (t.data !== "nested") {
                t.scrollTrigger && t.scrollTrigger.revert();
                t.kill();
              }
            } else {
              !(t instanceof Tween) && t.revert && t.revert(revert);
            }
          }
          _this4._r.forEach(function(f) {
            return f(revert, _this4);
          });
          _this4.isReverted = true;
        })();
      } else {
        this.data.forEach(function(e) {
          return e.kill && e.kill();
        });
      }
      this.clear();
      if (matchMedia2) {
        var i = _media.length;
        while (i--) {
          _media[i].id === this.id && _media.splice(i, 1);
        }
      }
    };
    _proto5.revert = function revert(config3) {
      this.kill(config3 || {});
    };
    return Context2;
  })();
  var MatchMedia = (function() {
    function MatchMedia2(scope) {
      this.contexts = [];
      this.scope = scope;
      _context$1 && _context$1.data.push(this);
    }
    var _proto6 = MatchMedia2.prototype;
    _proto6.add = function add(conditions, func, scope) {
      _isObject$1(conditions) || (conditions = {
        matches: conditions
      });
      var context3 = new Context(0, scope || this.scope), cond = context3.conditions = {}, mq, p, active;
      _context$1 && !context3.selector && (context3.selector = _context$1.selector);
      this.contexts.push(context3);
      func = context3.add("onMatch", func);
      context3.queries = conditions;
      for (p in conditions) {
        if (p === "all") {
          active = 1;
        } else {
          mq = _win$3.matchMedia(conditions[p]);
          if (mq) {
            _media.indexOf(context3) < 0 && _media.push(context3);
            (cond[p] = mq.matches) && (active = 1);
            mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
          }
        }
      }
      active && func(context3, function(f) {
        return context3.add(null, f);
      });
      return this;
    };
    _proto6.revert = function revert(config3) {
      this.kill(config3 || {});
    };
    _proto6.kill = function kill(revert) {
      this.contexts.forEach(function(c) {
        return c.kill(revert, true);
      });
    };
    return MatchMedia2;
  })();
  var _gsap = {
    registerPlugin: function registerPlugin() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      args.forEach(function(config3) {
        return _createPlugin(config3);
      });
    },
    timeline: function timeline(vars) {
      return new Timeline(vars);
    },
    getTweensOf: function getTweensOf(targets, onlyActive) {
      return _globalTimeline.getTweensOf(targets, onlyActive);
    },
    getProperty: function getProperty(target, property, unit, uncache) {
      _isString(target) && (target = toArray$1(target)[0]);
      var getter = _getCache(target || {}).get, format = unit ? _passThrough : _numericIfPossible;
      unit === "native" && (unit = "");
      return !target ? target : !property ? function(property2, unit2, uncache2) {
        return format((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit2, uncache2));
      } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    },
    quickSetter: function quickSetter(target, property, unit) {
      target = toArray$1(target);
      if (target.length > 1) {
        var setters = target.map(function(t) {
          return gsap$1.quickSetter(t, property, unit);
        }), l = setters.length;
        return function(value) {
          var i = l;
          while (i--) {
            setters[i](value);
          }
        };
      }
      target = target[0] || {};
      var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
        var p2 = new Plugin();
        _quickTween._pt = 0;
        p2.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
        p2.render(1, p2);
        _quickTween._pt && _renderPropTweens(1, _quickTween);
      } : cache.set(target, p);
      return Plugin ? setter : function(value) {
        return setter(target, p, unit ? value + unit : value, cache, 1);
      };
    },
    quickTo: function quickTo(target, property, vars) {
      var _setDefaults22;
      var tween = gsap$1.to(target, _setDefaults$1((_setDefaults22 = {}, _setDefaults22[property] = "+=0.1", _setDefaults22.paused = true, _setDefaults22.stagger = 0, _setDefaults22), vars || {})), func = function func2(value, start, startIsRelative) {
        return tween.resetTo(property, value, start, startIsRelative);
      };
      func.tween = tween;
      return func;
    },
    isTweening: function isTweening(targets) {
      return _globalTimeline.getTweensOf(targets, true).length > 0;
    },
    defaults: function defaults(value) {
      value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
      return _mergeDeep(_defaults, value || {});
    },
    config: function config2(value) {
      return _mergeDeep(_config, value || {});
    },
    registerEffect: function registerEffect(_ref3) {
      var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults3 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
      (plugins || "").split(",").forEach(function(pluginName) {
        return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
      });
      _effects[name] = function(targets, vars, tl) {
        return effect(toArray$1(targets), _setDefaults$1(vars || {}, defaults3), tl);
      };
      if (extendTimeline) {
        Timeline.prototype[name] = function(targets, vars, position) {
          return this.add(_effects[name](targets, _isObject$1(vars) ? vars : (position = vars) && {}, this), position);
        };
      }
    },
    registerEase: function registerEase(name, ease) {
      _easeMap[name] = _parseEase(ease);
    },
    parseEase: function parseEase(ease, defaultEase) {
      return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
    },
    getById: function getById(id) {
      return _globalTimeline.getById(id);
    },
    exportRoot: function exportRoot(vars, includeDelayedCalls) {
      if (vars === void 0) {
        vars = {};
      }
      var tl = new Timeline(vars), child, next;
      tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
      _globalTimeline.remove(tl);
      tl._dp = 0;
      tl._time = tl._tTime = _globalTimeline._time;
      child = _globalTimeline._first;
      while (child) {
        next = child._next;
        if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
          _addToTimeline(tl, child, child._start - child._delay);
        }
        child = next;
      }
      _addToTimeline(_globalTimeline, tl, 0);
      return tl;
    },
    context: function context(func, scope) {
      return func ? new Context(func, scope) : _context$1;
    },
    matchMedia: function matchMedia(scope) {
      return new MatchMedia(scope);
    },
    matchMediaRefresh: function matchMediaRefresh() {
      return _media.forEach(function(c) {
        var cond = c.conditions, found, p;
        for (p in cond) {
          if (cond[p]) {
            cond[p] = false;
            found = 1;
          }
        }
        found && c.revert();
      }) || _onMediaChange();
    },
    addEventListener: function addEventListener(type, callback) {
      var a = _listeners[type] || (_listeners[type] = []);
      ~a.indexOf(callback) || a.push(callback);
    },
    removeEventListener: function removeEventListener(type, callback) {
      var a = _listeners[type], i = a && a.indexOf(callback);
      i >= 0 && a.splice(i, 1);
    },
    utils: {
      wrap,
      wrapYoyo,
      distribute,
      random,
      snap,
      normalize,
      getUnit,
      clamp,
      splitColor,
      toArray: toArray$1,
      selector,
      mapRange,
      pipe,
      unitize,
      interpolate,
      shuffle
    },
    install: _install,
    effects: _effects,
    ticker: _ticker,
    updateRoot: Timeline.updateRoot,
    plugins: _plugins,
    globalTimeline: _globalTimeline,
    core: {
      PropTween,
      globals: _addGlobal,
      Tween,
      Timeline,
      Animation,
      getCache: _getCache,
      _removeLinkedListItem,
      reverting: function reverting() {
        return _reverting$1;
      },
      context: function context2(toAdd) {
        if (toAdd && _context$1) {
          _context$1.data.push(toAdd);
          toAdd._ctx = _context$1;
        }
        return _context$1;
      },
      suppressOverwrites: function suppressOverwrites(value) {
        return _suppressOverwrites = value;
      }
    }
  };
  _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
    return _gsap[name] = Tween[name];
  });
  _ticker.add(Timeline.updateRoot);
  _quickTween = _gsap.to({}, {
    duration: 0
  });
  var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
    var pt = plugin._pt;
    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next;
    }
    return pt;
  }, _addModifiers = function _addModifiers2(tween, modifiers) {
    var targets = tween._targets, p, i, pt;
    for (p in modifiers) {
      i = targets.length;
      while (i--) {
        pt = tween._ptLookup[i][p];
        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            pt = _getPluginPropTween(pt, p);
          }
          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
        }
      }
    }
  }, _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
    return {
      name,
      headless: 1,
      rawVars: 1,
init: function init4(target, vars, tween) {
        tween._onInit = function(tween2) {
          var temp, p;
          if (_isString(vars)) {
            temp = {};
            _forEachName(vars, function(name2) {
              return temp[name2] = 1;
            });
            vars = temp;
          }
          if (modifier) {
            temp = {};
            for (p in vars) {
              temp[p] = modifier(vars[p]);
            }
            vars = temp;
          }
          _addModifiers(tween2, vars);
        };
      }
    };
  };
  var gsap$1 = _gsap.registerPlugin({
    name: "attr",
    init: function init(target, vars, tween, index, targets) {
      var p, pt, v;
      this.tween = tween;
      for (p in vars) {
        v = target.getAttribute(p) || "";
        pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
        pt.op = p;
        pt.b = v;
        this._props.push(p);
      }
    },
    render: function render(ratio, data) {
      var pt = data._pt;
      while (pt) {
        _reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
        pt = pt._next;
      }
    }
  }, {
    name: "endArray",
    headless: 1,
    init: function init2(target, value) {
      var i = value.length;
      while (i--) {
        this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
      }
    }
  }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
  Tween.version = Timeline.version = gsap$1.version = "3.14.2";
  _coreReady = 1;
  _windowExists$2() && _wake();
  _easeMap.Power0;
  _easeMap.Power1;
  _easeMap.Power2;
  _easeMap.Power3;
  _easeMap.Power4;
  _easeMap.Linear;
  _easeMap.Quad;
  _easeMap.Cubic;
  _easeMap.Quart;
  _easeMap.Quint;
  _easeMap.Strong;
  _easeMap.Elastic;
  _easeMap.Back;
  _easeMap.SteppedEase;
  _easeMap.Bounce;
  _easeMap.Sine;
  _easeMap.Expo;
  _easeMap.Circ;
  var _win$2, _doc$2, _docElement$2, _pluginInitted, _tempDiv$1, _recentSetterPlugin, _reverting, _windowExists$1 = function _windowExists2() {
    return typeof window !== "undefined";
  }, _transformProps = {}, _RAD2DEG$1 = 180 / Math.PI, _DEG2RAD = Math.PI / 180, _atan2 = Math.atan2, _bigNum$1 = 1e8, _capsExp = /([A-Z])/g, _horizontalExp = /(left|right|width|margin|padding|x)/i, _complexExp = /[\s,\(]\S/, _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  }, _renderCSSProp = function _renderCSSProp2(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
  }, _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
  }, _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
    return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
  }, _renderCSSPropWithBeginningAndEnd = function _renderCSSPropWithBeginningAndEnd2(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
  }, _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
  }, _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  }, _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  }, _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
    return target.style[property] = value;
  }, _setterCSSProp = function _setterCSSProp2(target, property, value) {
    return target.style.setProperty(property, value);
  }, _setterTransform = function _setterTransform2(target, property, value) {
    return target._gsap[property] = value;
  }, _setterScale = function _setterScale2(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value;
  }, _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  }, _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  }, _transformProp$2 = "transform", _transformOriginProp$2 = _transformProp$2 + "Origin", _saveStyle = function _saveStyle2(property, isNotCSS) {
    var _this = this;
    var target = this.target, style2 = target.style, cache = target._gsap;
    if (property in _transformProps && style2) {
      this.tfm = this.tfm || {};
      if (property !== "transform") {
        property = _propertyAliases[property] || property;
        ~property.indexOf(",") ? property.split(",").forEach(function(a) {
          return _this.tfm[a] = _get(target, a);
        }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property);
        property === _transformOriginProp$2 && (this.tfm.zOrigin = cache.zOrigin);
      } else {
        return _propertyAliases.transform.split(",").forEach(function(p) {
          return _saveStyle2.call(_this, p, isNotCSS);
        });
      }
      if (this.props.indexOf(_transformProp$2) >= 0) {
        return;
      }
      if (cache.svg) {
        this.svgo = target.getAttribute("data-svg-origin");
        this.props.push(_transformOriginProp$2, isNotCSS, "");
      }
      property = _transformProp$2;
    }
    (style2 || isNotCSS) && this.props.push(property, isNotCSS, style2[property]);
  }, _removeIndependentTransforms = function _removeIndependentTransforms2(style2) {
    if (style2.translate) {
      style2.removeProperty("translate");
      style2.removeProperty("scale");
      style2.removeProperty("rotate");
    }
  }, _revertStyle = function _revertStyle2() {
    var props = this.props, target = this.target, style2 = target.style, cache = target._gsap, i, p;
    for (i = 0; i < props.length; i += 3) {
      if (!props[i + 1]) {
        props[i + 2] ? style2[props[i]] = props[i + 2] : style2.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
      } else if (props[i + 1] === 2) {
        target[props[i]](props[i + 2]);
      } else {
        target[props[i]] = props[i + 2];
      }
    }
    if (this.tfm) {
      for (p in this.tfm) {
        cache[p] = this.tfm[p];
      }
      if (cache.svg) {
        cache.renderTransform();
        target.setAttribute("data-svg-origin", this.svgo || "");
      }
      i = _reverting();
      if ((!i || !i.isStart) && !style2[_transformProp$2]) {
        _removeIndependentTransforms(style2);
        if (cache.zOrigin && style2[_transformOriginProp$2]) {
          style2[_transformOriginProp$2] += " " + cache.zOrigin + "px";
          cache.zOrigin = 0;
          cache.renderTransform();
        }
        cache.uncache = 1;
      }
    }
  }, _getStyleSaver$1 = function _getStyleSaver(target, properties) {
    var saver = {
      target,
      props: [],
      revert: _revertStyle,
      save: _saveStyle
    };
    target._gsap || gsap$1.core.getCache(target);
    properties && target.style && target.nodeType && properties.split(",").forEach(function(p) {
      return saver.save(p);
    });
    return saver;
  }, _supports3D$1, _createElement$1 = function _createElement(type, ns) {
    var e = _doc$2.createElementNS ? _doc$2.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$2.createElement(type);
    return e && e.style ? e : _doc$2.createElement(type);
  }, _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
    var cs = getComputedStyle(target);
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
  }, _prefixes = "O,Moz,ms,Ms,Webkit".split(","), _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
    var e = element || _tempDiv$1, s = e.style, i = 5;
    if (property in s && !preferPrefix) {
      return property;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    while (i-- && !(_prefixes[i] + property in s)) {
    }
    return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
  }, _initCore$1 = function _initCore() {
    if (_windowExists$1() && window.document) {
      _win$2 = window;
      _doc$2 = _win$2.document;
      _docElement$2 = _doc$2.documentElement;
      _tempDiv$1 = _createElement$1("div") || {
        style: {}
      };
      _createElement$1("div");
      _transformProp$2 = _checkPropPrefix(_transformProp$2);
      _transformOriginProp$2 = _transformProp$2 + "Origin";
      _tempDiv$1.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
      _supports3D$1 = !!_checkPropPrefix("perspective");
      _reverting = gsap$1.core.reverting;
      _pluginInitted = 1;
    }
  }, _getReparentedCloneBBox = function _getReparentedCloneBBox2(target) {
    var owner = target.ownerSVGElement, svg = _createElement$1("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), clone = target.cloneNode(true), bbox;
    clone.style.display = "block";
    svg.appendChild(clone);
    _docElement$2.appendChild(svg);
    try {
      bbox = clone.getBBox();
    } catch (e) {
    }
    svg.removeChild(clone);
    _docElement$2.removeChild(svg);
    return bbox;
  }, _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
    var i = attributesArray.length;
    while (i--) {
      if (target.hasAttribute(attributesArray[i])) {
        return target.getAttribute(attributesArray[i]);
      }
    }
  }, _getBBox = function _getBBox2(target) {
    var bounds, cloned;
    try {
      bounds = target.getBBox();
    } catch (error) {
      bounds = _getReparentedCloneBBox(target);
      cloned = 1;
    }
    bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target));
    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
      y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
      width: 0,
      height: 0
    } : bounds;
  }, _isSVG = function _isSVG2(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
  }, _removeProperty = function _removeProperty2(target, property) {
    if (property) {
      var style2 = target.style, first2Chars;
      if (property in _transformProps && property !== _transformOriginProp$2) {
        property = _transformProp$2;
      }
      if (style2.removeProperty) {
        first2Chars = property.substr(0, 2);
        if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
          property = "-" + property;
        }
        style2.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        style2.removeAttribute(property);
      }
    }
  }, _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
    var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
    plugin._pt = pt;
    pt.b = beginning;
    pt.e = end;
    plugin._props.push(property);
    return pt;
  }, _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1
  }, _nonStandardLayouts = {
    grid: 1,
    flex: 1
  }, _convertToUnit = function _convertToUnit2(target, property, value, unit) {
    var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style2 = _tempDiv$1.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent, cache, isSVG;
    if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue;
    }
    curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
    isSVG = target.getCTM && _isSVG(target);
    if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
      px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
      return _round$1(toPercent ? curValue / px * amount : curValue / 100 * px);
    }
    style2[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
    parent = unit !== "rem" && ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }
    if (!parent || parent === _doc$2 || !parent.appendChild) {
      parent = _doc$2.body;
    }
    cache = parent._gsap;
    if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) {
      return _round$1(curValue / cache.width * amount);
    } else {
      if (toPercent && (property === "height" || property === "width")) {
        var v = target.style[property];
        target.style[property] = amount + unit;
        px = target[measureProperty];
        v ? target.style[property] = v : _removeProperty(target, property);
      } else {
        (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style2.position = _getComputedProperty(target, "position"));
        parent === target && (style2.position = "static");
        parent.appendChild(_tempDiv$1);
        px = _tempDiv$1[measureProperty];
        parent.removeChild(_tempDiv$1);
        style2.position = "absolute";
      }
      if (horizontal && toPercent) {
        cache = _getCache(parent);
        cache.time = _ticker.time;
        cache.width = parent[measureProperty];
      }
    }
    return _round$1(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
  }, _get = function _get2(target, property, unit, uncache) {
    var value;
    _pluginInitted || _initCore$1();
    if (property in _propertyAliases && property !== "transform") {
      property = _propertyAliases[property];
      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }
    if (_transformProps[property] && property !== "transform") {
      value = _parseTransform(target, uncache);
      value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp$2)) + " " + value.zOrigin + "px";
    } else {
      value = target.style[property];
      if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
        value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
      }
    }
    return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
  }, _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop, start, end) {
    if (!start || start === "none") {
      var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
      if (s && s !== start) {
        prop = p;
        start = s;
      } else if (prop === "borderColor") {
        start = _getComputedProperty(target, "borderTopColor");
      }
    }
    var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
    pt.b = start;
    pt.e = end;
    start += "";
    end += "";
    if (end.substring(0, 6) === "var(--") {
      end = _getComputedProperty(target, end.substring(4, end.indexOf(")")));
    }
    if (end === "auto") {
      startValue = target.style[prop];
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
    }
    a = [start, end];
    _colorStringFilter(a);
    start = a[0];
    end = a[1];
    startValues = start.match(_numWithUnitExp) || [];
    endValues = end.match(_numWithUnitExp) || [];
    if (endValues.length) {
      while (result = _numWithUnitExp.exec(end)) {
        endValue = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
          color = 1;
        }
        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _numWithUnitExp.lastIndex - endUnit.length;
          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit;
            if (index === end.length) {
              end += endUnit;
              pt.e += endUnit;
            }
          }
          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          }
          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
s: startNum,
            c: endNum - startNum,
            m: color && color < 4 || prop === "zIndex" ? Math.round : 0
          };
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : "";
    } else {
      pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
    }
    _relExp.test(end) && (pt.e = 0);
    this._pt = pt;
    return pt;
  }, _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  }, _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
    var split = value.split(" "), x = split[0], y = split[1] || "50%";
    if (x === "top" || x === "bottom" || y === "left" || y === "right") {
      value = x;
      x = y;
      y = value;
    }
    split[0] = _keywordToPercent[x] || x;
    split[1] = _keywordToPercent[y] || y;
    return split.join(" ");
  }, _renderClearProps = function _renderClearProps2(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t, style2 = target.style, props = data.u, cache = target._gsap, prop, clearTransforms, i;
      if (props === "all" || props === true) {
        style2.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i = props.length;
        while (--i > -1) {
          prop = props[i];
          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop = prop === "transformOrigin" ? _transformOriginProp$2 : _transformProp$2;
          }
          _removeProperty(target, prop);
        }
      }
      if (clearTransforms) {
        _removeProperty(target, _transformProp$2);
        if (cache) {
          cache.svg && target.removeAttribute("transform");
          style2.scale = style2.rotate = style2.translate = "none";
          _parseTransform(target, 1);
          cache.uncache = 1;
          _removeIndependentTransforms(style2);
        }
      }
    }
  }, _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
        pt.u = endValue;
        pt.pr = -10;
        pt.tween = tween;
        plugin._props.push(property);
        return 1;
      }
    }
}, _identity2DMatrix = [1, 0, 0, 1, 0, 0], _rotationalProperties = {}, _isNullTransform = function _isNullTransform2(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  }, _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
    var matrixString = _getComputedProperty(target, _transformProp$2);
    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round$1);
  }, _getMatrix = function _getMatrix2(target, force2D) {
    var cache = target._gsap || _getCache(target), style2 = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix;
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement$2 && !cache.svg) {
      temp = style2.display;
      style2.display = "block";
      parent = target.parentNode;
      if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
        addedToDOM = 1;
        nextSibling = target.nextElementSibling;
        _docElement$2.appendChild(target);
      }
      matrix = _getComputedTransformMatrixAsArray(target);
      temp ? style2.display = temp : _removeProperty(target, "display");
      if (addedToDOM) {
        nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement$2.removeChild(target);
      }
    }
    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
  }, _applySVGOrigin = function _applySVGOrigin2(target, origin2, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    var cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin2.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
    } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
      x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
      y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
      xOrigin = x;
      yOrigin = y;
    }
    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }
    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin2;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp$2] = "0px 0px";
    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
    }
    target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
  }, _parseTransform = function _parseTransform2(target, uncache) {
    var cache = target._gsap || new GSCache(target);
    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }
    var style2 = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin2 = _getComputedProperty(target, _transformOriginProp$2) || "0", x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    if (cs.translate) {
      if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
        style2[_transformProp$2] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp$2] !== "none" ? cs[_transformProp$2] : "");
      }
      style2.scale = style2.rotate = style2.translate = "none";
    }
    matrix = _getMatrix(target, cache.svg);
    if (cache.svg) {
      if (cache.uncache) {
        t2 = target.getBBox();
        origin2 = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
        t1 = "";
      } else {
        t1 = !uncache && target.getAttribute("data-svg-origin");
      }
      _applySVGOrigin(target, t1 || origin2, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
    }
    xOrigin = cache.xOrigin || 0;
    yOrigin = cache.yOrigin || 0;
    if (matrix !== _identity2DMatrix) {
      a = matrix[0];
      b = matrix[1];
      c = matrix[2];
      d = matrix[3];
      x = a12 = matrix[4];
      y = a22 = matrix[5];
      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b);
        scaleY = Math.sqrt(d * d + c * c);
        rotation = a || b ? _atan2(b, a) * _RAD2DEG$1 : 0;
        skewX = c || d ? _atan2(c, d) * _RAD2DEG$1 + rotation : 0;
        skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c);
          y -= yOrigin - (xOrigin * b + yOrigin * d);
        }
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x = matrix[12];
        y = matrix[13];
        z = matrix[14];
        angle = _atan2(a32, a33);
        rotationX = angle * _RAD2DEG$1;
        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        }
        angle = _atan2(-c, a33);
        rotationY = angle * _RAD2DEG$1;
        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a * cos - a13 * sin;
          t2 = b * cos - a23 * sin;
          t3 = c * cos - a33 * sin;
          a43 = d * sin + a43 * cos;
          a = t1;
          b = t2;
          c = t3;
        }
        angle = _atan2(b, a);
        rotation = angle * _RAD2DEG$1;
        if (angle) {
          cos = Math.cos(angle);
          sin = Math.sin(angle);
          t1 = a * cos + b * sin;
          t2 = a12 * cos + a22 * sin;
          b = b * cos - a * sin;
          a22 = a22 * cos - a12 * sin;
          a = t1;
          a12 = t2;
        }
        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }
        scaleX = _round$1(Math.sqrt(a * a + b * b + c * c));
        scaleY = _round$1(Math.sqrt(a22 * a22 + a32 * a32));
        angle = _atan2(a12, a22);
        skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG$1 : 0;
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }
      if (cache.svg) {
        t1 = target.getAttribute("transform");
        cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp$2));
        t1 && target.setAttribute("transform", t1);
      }
    }
    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }
    uncache = uncache || cache.uncache;
    cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
    cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
    cache.z = z + px;
    cache.scaleX = _round$1(scaleX);
    cache.scaleY = _round$1(scaleY);
    cache.rotation = _round$1(rotation) + deg;
    cache.rotationX = _round$1(rotationX) + deg;
    cache.rotationY = _round$1(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective + px;
    if (cache.zOrigin = parseFloat(origin2.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
      style2[_transformOriginProp$2] = _firstTwoOnly(origin2);
    }
    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _config.force3D;
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D$1 ? _renderCSSTransforms : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  }, _firstTwoOnly = function _firstTwoOnly2(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  }, _addPxTranslate = function _addPxTranslate2(target, start, value) {
    var unit = getUnit(start);
    return _round$1(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
  }, _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;
    _renderCSSTransforms(ratio, cache);
  }, _zeroDeg = "0deg", _zeroPx = "0px", _endParenthesis = ") ", _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache) {
    var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
      angle = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle);
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
      y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
    }
    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }
    if (xPercent || yPercent) {
      transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
    }
    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
    }
    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }
    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }
    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }
    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }
    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }
    target.style[_transformProp$2] = transforms || "translate(0, 0)";
  }, _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache) {
    var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);
    if (skewY) {
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }
    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;
      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;
        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }
      a11 = _round$1(a11);
      a21 = _round$1(a21);
      a12 = _round$1(a12);
      a22 = _round$1(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }
    if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
      tx = _convertToUnit(target, "x", x, "px");
      ty = _convertToUnit(target, "y", y, "px");
    }
    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round$1(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = _round$1(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }
    if (xPercent || yPercent) {
      temp = target.getBBox();
      tx = _round$1(tx + xPercent / 100 * temp.width);
      ty = _round$1(ty + yPercent / 100 * temp.height);
    }
    temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
    target.setAttribute("transform", temp);
    forceCSS && (target.style[_transformProp$2] = temp);
  }, _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
    var cap = 360, isString2 = _isString(endValue), endNum = parseFloat(endValue) * (isString2 && ~endValue.indexOf("rad") ? _RAD2DEG$1 : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
    if (isString2) {
      direction = endValue.split("_")[1];
      if (direction === "short") {
        change %= cap;
        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }
      if (direction === "cw" && change < 0) {
        change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap;
      }
    }
    plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
    pt.e = finalValue;
    pt.u = "deg";
    plugin._props.push(property);
    return pt;
  }, _assign = function _assign2(target, source) {
    for (var p in source) {
      target[p] = source[p];
    }
    return target;
  }, _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
    var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style2 = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
    if (startCache.svg) {
      startValue = target.getAttribute("transform");
      target.setAttribute("transform", "");
      style2[_transformProp$2] = transforms;
      endCache = _parseTransform(target, 1);
      _removeProperty(target, _transformProp$2);
      target.setAttribute("transform", startValue);
    } else {
      startValue = getComputedStyle(target)[_transformProp$2];
      style2[_transformProp$2] = transforms;
      endCache = _parseTransform(target, 1);
      style2[_transformProp$2] = startValue;
    }
    for (p in _transformProps) {
      startValue = startCache[p];
      endValue = endCache[p];
      if (startValue !== endValue && exclude.indexOf(p) < 0) {
        startUnit = getUnit(startValue);
        endUnit = getUnit(endValue);
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
        plugin._pt.u = endUnit || 0;
        plugin._props.push(p);
      }
    }
    _assign(endCache, startCache);
  };
  _forEachName("padding,margin,Width,Radius", function(name, index) {
    var t = "Top", r = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function(side) {
      return index < 2 ? name + side : "border" + side + name;
    });
    _specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
      var a, vars;
      if (arguments.length < 4) {
        a = props.map(function(prop) {
          return _get(plugin, prop, property);
        });
        vars = a.join(" ");
        return vars.split(a[0]).length === 5 ? a[0] : vars;
      }
      a = (endValue + "").split(" ");
      vars = {};
      props.forEach(function(prop, i) {
        return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
      });
      plugin.init(target, vars, tween);
    };
  });
  var CSSPlugin = {
    name: "css",
    register: _initCore$1,
    targetTest: function targetTest(target) {
      return target.style && target.nodeType;
    },
    init: function init3(target, vars, tween, index, targets) {
      var props = this._props, style2 = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps, finalTransformValue;
      _pluginInitted || _initCore$1();
      this.styles = this.styles || _getStyleSaver$1(target);
      inlineProps = this.styles.props;
      this.tween = tween;
      for (p in vars) {
        if (p === "autoRound") {
          continue;
        }
        endValue = vars[p];
        if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
          continue;
        }
        type = typeof endValue;
        specialProp = _specialProps[p];
        if (type === "function") {
          endValue = endValue.call(tween, index, target, targets);
          type = typeof endValue;
        }
        if (type === "string" && ~endValue.indexOf("random(")) {
          endValue = _replaceRandom(endValue);
        }
        if (specialProp) {
          specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
        } else if (p.substr(0, 2) === "--") {
          startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
          endValue += "";
          _colorExp.lastIndex = 0;
          if (!_colorExp.test(startValue)) {
            startUnit = getUnit(startValue);
            endUnit = getUnit(endValue);
            endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
          }
          this.add(style2, "setProperty", startValue, endValue, index, targets, 0, 0, p);
          props.push(p);
          inlineProps.push(p, 0, style2[p]);
        } else if (type !== "undefined") {
          if (startAt && p in startAt) {
            startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
            _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
            getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
            (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
          } else {
            startValue = _get(target, p);
          }
          startNum = parseFloat(startValue);
          relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
          relative && (endValue = endValue.substr(2));
          endNum = parseFloat(endValue);
          if (p in _propertyAliases) {
            if (p === "autoAlpha") {
              if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                startNum = 0;
              }
              inlineProps.push("visibility", 0, style2.visibility);
              _addNonTweeningPT(this, style2, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
            }
            if (p !== "scale" && p !== "transform") {
              p = _propertyAliases[p];
              ~p.indexOf(",") && (p = p.split(",")[0]);
            }
          }
          isTransformRelated = p in _transformProps;
          if (isTransformRelated) {
            this.styles.save(p);
            finalTransformValue = endValue;
            if (type === "string" && endValue.substring(0, 6) === "var(--") {
              endValue = _getComputedProperty(target, endValue.substring(4, endValue.indexOf(")")));
              if (endValue.substring(0, 5) === "calc(") {
                var origPerspective = target.style.perspective;
                target.style.perspective = endValue;
                endValue = _getComputedProperty(target, "perspective");
                origPerspective ? target.style.perspective = origPerspective : _removeProperty(target, "perspective");
              }
              endNum = parseFloat(endValue);
            }
            if (!transformPropTween) {
              cache = target._gsap;
              cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
              smooth = vars.smoothOrigin !== false && cache.smooth;
              transformPropTween = this._pt = new PropTween(this._pt, style2, _transformProp$2, 0, 1, cache.renderTransform, cache, 0, -1);
              transformPropTween.dep = 1;
            }
            if (p === "scale") {
              this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
              this._pt.u = 0;
              props.push("scaleY", p);
              p += "X";
            } else if (p === "transformOrigin") {
              inlineProps.push(_transformOriginProp$2, 0, style2[_transformOriginProp$2]);
              endValue = _convertKeywordsToPercentages(endValue);
              if (cache.svg) {
                _applySVGOrigin(target, endValue, 0, smooth, 0, this);
              } else {
                endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
                _addNonTweeningPT(this, style2, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
              }
              continue;
            } else if (p === "svgOrigin") {
              _applySVGOrigin(target, endValue, 1, smooth, 0, this);
              continue;
            } else if (p in _rotationalProperties) {
              _addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
              continue;
            } else if (p === "smoothOrigin") {
              _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
              continue;
            } else if (p === "force3D") {
              cache[p] = endValue;
              continue;
            } else if (p === "transform") {
              _addRawTransformPTs(this, endValue, target);
              continue;
            }
          } else if (!(p in style2)) {
            p = _checkPropPrefix(p) || p;
          }
          if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style2) {
            startUnit = (startValue + "").substr((startNum + "").length);
            endNum || (endNum = 0);
            endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
            startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
            this._pt = new PropTween(this._pt, isTransformRelated ? cache : style2, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
            this._pt.u = endUnit || 0;
            if (isTransformRelated && finalTransformValue !== endValue) {
              this._pt.b = startValue;
              this._pt.e = finalTransformValue;
              this._pt.r = _renderCSSPropWithBeginningAndEnd;
            } else if (startUnit !== endUnit && endUnit !== "%") {
              this._pt.b = startValue;
              this._pt.r = _renderCSSPropWithBeginning;
            }
          } else if (!(p in style2)) {
            if (p in target) {
              this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
            } else if (p !== "parseTransform") {
              _missingPlugin(p, endValue);
              continue;
            }
          } else {
            _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
          }
          isTransformRelated || (p in style2 ? inlineProps.push(p, 0, style2[p]) : typeof target[p] === "function" ? inlineProps.push(p, 2, target[p]()) : inlineProps.push(p, 1, startValue || target[p]));
          props.push(p);
        }
      }
      hasPriority && _sortPropTweensByPriority(this);
    },
    render: function render2(ratio, data) {
      if (data.tween._time || !_reverting()) {
        var pt = data._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
      } else {
        data.styles.revert();
      }
    },
    get: _get,
    aliases: _propertyAliases,
    getSetter: function getSetter(target, property, plugin) {
      var p = _propertyAliases[property];
      p && p.indexOf(",") < 0 && (property = p);
      return property in _transformProps && property !== _transformOriginProp$2 && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined$1(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
    },
    core: {
      _removeProperty,
      _getMatrix
    }
  };
  gsap$1.utils.checkPrefix = _checkPropPrefix;
  gsap$1.core.getStyleSaver = _getStyleSaver$1;
  (function(positionAndScale, rotation, others, aliases) {
    var all3 = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
      _transformProps[name] = 1;
    });
    _forEachName(rotation, function(name) {
      _config.units[name] = "deg";
      _rotationalProperties[name] = 1;
    });
    _propertyAliases[all3[13]] = positionAndScale + "," + rotation;
    _forEachName(aliases, function(name) {
      var split = name.split(":");
      _propertyAliases[split[1]] = all3[split[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
  _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
    _config.units[name] = "px";
  });
  gsap$1.registerPlugin(CSSPlugin);
  var gsapWithCSS = gsap$1.registerPlugin(CSSPlugin) || gsap$1;
  gsapWithCSS.core.Tween;
  var _doc$1, _win$1, _docElement$1, _body$1, _divContainer, _svgContainer, _identityMatrix$1, _gEl, _transformProp$1 = "transform", _transformOriginProp$1 = _transformProp$1 + "Origin", _hasOffsetBug, _setDoc = function _setDoc2(element) {
    var doc = element.ownerDocument || element;
    if (!(_transformProp$1 in element.style) && "msTransform" in element.style) {
      _transformProp$1 = "msTransform";
      _transformOriginProp$1 = _transformProp$1 + "Origin";
    }
    while (doc.parentNode && (doc = doc.parentNode)) {
    }
    _win$1 = window;
    _identityMatrix$1 = new Matrix2D();
    if (doc) {
      _doc$1 = doc;
      _docElement$1 = doc.documentElement;
      _body$1 = doc.body;
      _gEl = _doc$1.createElementNS("http://www.w3.org/2000/svg", "g");
      _gEl.style.transform = "none";
      var d1 = doc.createElement("div"), d2 = doc.createElement("div"), root = doc && (doc.body || doc.firstElementChild);
      if (root && root.appendChild) {
        root.appendChild(d1);
        d1.appendChild(d2);
        d1.style.position = "static";
        d1.style.transform = "translate3d(0,0,1px)";
        _hasOffsetBug = d2.offsetParent !== d1;
        root.removeChild(d1);
      }
    }
    return doc;
  }, _forceNonZeroScale = function _forceNonZeroScale2(e) {
    var a, cache;
    while (e && e !== _body$1) {
      cache = e._gsap;
      cache && cache.uncache && cache.get(e, "x");
      if (cache && !cache.scaleX && !cache.scaleY && cache.renderTransform) {
        cache.scaleX = cache.scaleY = 1e-4;
        cache.renderTransform(1, cache);
        a ? a.push(cache) : a = [cache];
      }
      e = e.parentNode;
    }
    return a;
  }, _svgTemps = [], _divTemps = [], _getDocScrollTop$1 = function _getDocScrollTop() {
    return _win$1.pageYOffset || _doc$1.scrollTop || _docElement$1.scrollTop || _body$1.scrollTop || 0;
  }, _getDocScrollLeft$1 = function _getDocScrollLeft() {
    return _win$1.pageXOffset || _doc$1.scrollLeft || _docElement$1.scrollLeft || _body$1.scrollLeft || 0;
  }, _svgOwner = function _svgOwner2(element) {
    return element.ownerSVGElement || ((element.tagName + "").toLowerCase() === "svg" ? element : null);
  }, _isFixed$1 = function _isFixed(element) {
    if (_win$1.getComputedStyle(element).position === "fixed") {
      return true;
    }
    element = element.parentNode;
    if (element && element.nodeType === 1) {
      return _isFixed(element);
    }
  }, _createSibling = function _createSibling2(element, i) {
    if (element.parentNode && (_doc$1 || _setDoc(element))) {
      var svg = _svgOwner(element), ns = svg ? svg.getAttribute("xmlns") || "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml", type = svg ? i ? "rect" : "g" : "div", x = i !== 2 ? 0 : 100, y = i === 3 ? 100 : 0, css = {
        position: "absolute",
        display: "block",
        pointerEvents: "none",
        margin: "0",
        padding: "0"
      }, e = _doc$1.createElementNS ? _doc$1.createElementNS(ns.replace(/^https/, "http"), type) : _doc$1.createElement(type);
      if (i) {
        if (!svg) {
          if (!_divContainer) {
            _divContainer = _createSibling2(element);
            Object.assign(_divContainer.style, css);
          }
          Object.assign(e.style, css, {
            width: "0.1px",
            height: "0.1px",
            top: y + "px",
            left: x + "px"
          });
          _divContainer.appendChild(e);
        } else {
          _svgContainer || (_svgContainer = _createSibling2(element));
          e.setAttribute("width", 0.01);
          e.setAttribute("height", 0.01);
          e.setAttribute("transform", "translate(" + x + "," + y + ")");
          e.setAttribute("fill", "transparent");
          _svgContainer.appendChild(e);
        }
      }
      return e;
    }
    throw "Need document and parent.";
  }, _consolidate = function _consolidate2(m) {
    var c = new Matrix2D(), i = 0;
    for (; i < m.numberOfItems; i++) {
      c.multiply(m.getItem(i).matrix);
    }
    return c;
  }, _getCTM = function _getCTM2(svg) {
    var m = svg.getCTM(), transform;
    if (!m) {
      transform = svg.style[_transformProp$1];
      svg.style[_transformProp$1] = "none";
      svg.appendChild(_gEl);
      m = _gEl.getCTM();
      svg.removeChild(_gEl);
      transform ? svg.style[_transformProp$1] = transform : svg.style.removeProperty(_transformProp$1.replace(/([A-Z])/g, "-$1").toLowerCase());
    }
    return m || _identityMatrix$1.clone();
  }, _placeSiblings = function _placeSiblings2(element, adjustGOffset) {
    var svg = _svgOwner(element), isRootSVG = element === svg, siblings = svg ? _svgTemps : _divTemps, parent = element.parentNode, appendToEl = parent && !svg && parent.shadowRoot && parent.shadowRoot.appendChild ? parent.shadowRoot : parent, container, m, b, x, y, cs;
    if (element === _win$1) {
      return element;
    }
    siblings.length || siblings.push(_createSibling(element, 1), _createSibling(element, 2), _createSibling(element, 3));
    container = svg ? _svgContainer : _divContainer;
    if (svg) {
      if (isRootSVG) {
        b = _getCTM(element);
        x = -b.e / b.a;
        y = -b.f / b.d;
        m = _identityMatrix$1;
      } else if (element.getBBox) {
        b = element.getBBox();
        m = element.transform ? element.transform.baseVal : {};
        m = !m.numberOfItems ? _identityMatrix$1 : m.numberOfItems > 1 ? _consolidate(m) : m.getItem(0).matrix;
        x = m.a * b.x + m.c * b.y;
        y = m.b * b.x + m.d * b.y;
      } else {
        m = new Matrix2D();
        x = y = 0;
      }
      (isRootSVG || !element.getBoundingClientRect().width ? svg : parent).appendChild(container);
      container.setAttribute("transform", "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + (m.e + x) + "," + (m.f + y) + ")");
    } else {
      x = y = 0;
      if (_hasOffsetBug) {
        m = element.offsetParent;
        b = element;
        while (b && (b = b.parentNode) && b !== m && b.parentNode) {
          if ((_win$1.getComputedStyle(b)[_transformProp$1] + "").length > 4) {
            x = b.offsetLeft;
            y = b.offsetTop;
            b = 0;
          }
        }
      }
      cs = _win$1.getComputedStyle(element);
      if (cs.position !== "absolute" && cs.position !== "fixed") {
        m = element.offsetParent;
        while (parent && parent !== m) {
          x += parent.scrollLeft || 0;
          y += parent.scrollTop || 0;
          parent = parent.parentNode;
        }
      }
      b = container.style;
      b.top = element.offsetTop - y + "px";
      b.left = element.offsetLeft - x + "px";
      b[_transformProp$1] = cs[_transformProp$1];
      b[_transformOriginProp$1] = cs[_transformOriginProp$1];
      b.position = cs.position === "fixed" ? "fixed" : "absolute";
      appendToEl.appendChild(container);
    }
    return container;
  }, _setMatrix = function _setMatrix2(m, a, b, c, d, e, f) {
    m.a = a;
    m.b = b;
    m.c = c;
    m.d = d;
    m.e = e;
    m.f = f;
    return m;
  };
  var Matrix2D = (function() {
    function Matrix2D2(a, b, c, d, e, f) {
      if (a === void 0) {
        a = 1;
      }
      if (b === void 0) {
        b = 0;
      }
      if (c === void 0) {
        c = 0;
      }
      if (d === void 0) {
        d = 1;
      }
      if (e === void 0) {
        e = 0;
      }
      if (f === void 0) {
        f = 0;
      }
      _setMatrix(this, a, b, c, d, e, f);
    }
    var _proto = Matrix2D2.prototype;
    _proto.inverse = function inverse() {
      var a = this.a, b = this.b, c = this.c, d = this.d, e = this.e, f = this.f, determinant = a * d - b * c || 1e-10;
      return _setMatrix(this, d / determinant, -b / determinant, -c / determinant, a / determinant, (c * f - d * e) / determinant, -(a * f - b * e) / determinant);
    };
    _proto.multiply = function multiply(matrix) {
      var a = this.a, b = this.b, c = this.c, d = this.d, e = this.e, f = this.f, a2 = matrix.a, b2 = matrix.c, c2 = matrix.b, d2 = matrix.d, e2 = matrix.e, f2 = matrix.f;
      return _setMatrix(this, a2 * a + c2 * c, a2 * b + c2 * d, b2 * a + d2 * c, b2 * b + d2 * d, e + e2 * a + f2 * c, f + e2 * b + f2 * d);
    };
    _proto.clone = function clone() {
      return new Matrix2D2(this.a, this.b, this.c, this.d, this.e, this.f);
    };
    _proto.equals = function equals(matrix) {
      var a = this.a, b = this.b, c = this.c, d = this.d, e = this.e, f = this.f;
      return a === matrix.a && b === matrix.b && c === matrix.c && d === matrix.d && e === matrix.e && f === matrix.f;
    };
    _proto.apply = function apply(point, decoratee) {
      if (decoratee === void 0) {
        decoratee = {};
      }
      var x = point.x, y = point.y, a = this.a, b = this.b, c = this.c, d = this.d, e = this.e, f = this.f;
      decoratee.x = x * a + y * c + e || 0;
      decoratee.y = x * b + y * d + f || 0;
      return decoratee;
    };
    return Matrix2D2;
  })();
  function getGlobalMatrix(element, inverse, adjustGOffset, includeScrollInFixed) {
    if (!element || !element.parentNode || (_doc$1 || _setDoc(element)).documentElement === element) {
      return new Matrix2D();
    }
    var zeroScales = _forceNonZeroScale(element), svg = _svgOwner(element), temps = svg ? _svgTemps : _divTemps, container = _placeSiblings(element), b1 = temps[0].getBoundingClientRect(), b2 = temps[1].getBoundingClientRect(), b3 = temps[2].getBoundingClientRect(), parent = container.parentNode, isFixed = _isFixed$1(element), m = new Matrix2D((b2.left - b1.left) / 100, (b2.top - b1.top) / 100, (b3.left - b1.left) / 100, (b3.top - b1.top) / 100, b1.left + (isFixed ? 0 : _getDocScrollLeft$1()), b1.top + (isFixed ? 0 : _getDocScrollTop$1()));
    parent.removeChild(container);
    if (zeroScales) {
      b1 = zeroScales.length;
      while (b1--) {
        b2 = zeroScales[b1];
        b2.scaleX = b2.scaleY = 0;
        b2.renderTransform(1, b2);
      }
    }
    return inverse ? m.inverse() : m;
  }
  function _assertThisInitialized(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var gsap, _win, _doc, _docElement, _body, _tempDiv, _placeholderDiv, _coreInitted, _checkPrefix, _toArray, _supportsPassive, _isTouchDevice, _touchEventLookup, _isMultiTouching, _isAndroid, InertiaPlugin, _defaultCursor, _supportsPointer, _context, _getStyleSaver2, _dragCount = 0, _windowExists3 = function _windowExists4() {
    return typeof window !== "undefined";
  }, _getGSAP = function _getGSAP2() {
    return gsap || _windowExists3() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
  }, _isFunction2 = function _isFunction3(value) {
    return typeof value === "function";
  }, _isObject2 = function _isObject3(value) {
    return typeof value === "object";
  }, _isUndefined2 = function _isUndefined3(value) {
    return typeof value === "undefined";
  }, _emptyFunc2 = function _emptyFunc3() {
    return false;
  }, _transformProp = "transform", _transformOriginProp = "transformOrigin", _round2 = function _round3(value) {
    return Math.round(value * 1e4) / 1e4;
  }, _isArray = Array.isArray, _createElement2 = function _createElement3(type, ns) {
    var e = _doc.createElementNS ? _doc.createElementNS("http://www.w3.org/1999/xhtml".replace(/^https/, "http"), type) : _doc.createElement(type);
    return e.style ? e : _doc.createElement(type);
  }, _RAD2DEG = 180 / Math.PI, _bigNum = 1e20, _identityMatrix = new Matrix2D(), _getTime = Date.now || function() {
    return ( new Date()).getTime();
  }, _renderQueue = [], _lookup = {}, _lookupCount = 0, _clickableTagExp = /^(?:a|input|textarea|button|select)$/i, _lastDragTime = 0, _temp1 = {}, _windowProxy = {}, _copy = function _copy2(obj, factor) {
    var copy = {}, p;
    for (p in obj) {
      copy[p] = factor ? obj[p] * factor : obj[p];
    }
    return copy;
  }, _extend = function _extend2(obj, defaults3) {
    for (var p in defaults3) {
      if (!(p in obj)) {
        obj[p] = defaults3[p];
      }
    }
    return obj;
  }, _setTouchActionForAllDescendants = function _setTouchActionForAllDescendants2(elements, value) {
    var i = elements.length, children;
    while (i--) {
      value ? elements[i].style.touchAction = value : elements[i].style.removeProperty("touch-action");
      children = elements[i].children;
      children && children.length && _setTouchActionForAllDescendants2(children, value);
    }
  }, _renderQueueTick = function _renderQueueTick2() {
    return _renderQueue.forEach(function(func) {
      return func();
    });
  }, _addToRenderQueue = function _addToRenderQueue2(func) {
    _renderQueue.push(func);
    if (_renderQueue.length === 1) {
      gsap.ticker.add(_renderQueueTick);
    }
  }, _renderQueueTimeout = function _renderQueueTimeout2() {
    return !_renderQueue.length && gsap.ticker.remove(_renderQueueTick);
  }, _removeFromRenderQueue = function _removeFromRenderQueue2(func) {
    var i = _renderQueue.length;
    while (i--) {
      if (_renderQueue[i] === func) {
        _renderQueue.splice(i, 1);
      }
    }
    gsap.to(_renderQueueTimeout, {
      overwrite: true,
      delay: 15,
      duration: 0,
      onComplete: _renderQueueTimeout,
      data: "_draggable"
    });
  }, _setDefaults2 = function _setDefaults3(obj, defaults3) {
    for (var p in defaults3) {
      if (!(p in obj)) {
        obj[p] = defaults3[p];
      }
    }
    return obj;
  }, _addListener = function _addListener2(element, type, func, capture) {
    if (element.addEventListener) {
      var touchType = _touchEventLookup[type];
      capture = capture || (_supportsPassive ? {
        passive: false
      } : null);
      element.addEventListener(touchType || type, func, capture);
      touchType && type !== touchType && element.addEventListener(type, func, capture);
    }
  }, _removeListener = function _removeListener2(element, type, func, capture) {
    if (element.removeEventListener) {
      var touchType = _touchEventLookup[type];
      element.removeEventListener(touchType || type, func, capture);
      touchType && type !== touchType && element.removeEventListener(type, func, capture);
    }
  }, _preventDefault = function _preventDefault2(event) {
    event.preventDefault && event.preventDefault();
    event.preventManipulation && event.preventManipulation();
  }, _hasTouchID = function _hasTouchID2(list, ID) {
    var i = list.length;
    while (i--) {
      if (list[i].identifier === ID) {
        return true;
      }
    }
  }, _onMultiTouchDocumentEnd = function _onMultiTouchDocumentEnd2(event) {
    _isMultiTouching = event.touches && _dragCount < event.touches.length;
    _removeListener(event.target, "touchend", _onMultiTouchDocumentEnd2);
  }, _onMultiTouchDocument = function _onMultiTouchDocument2(event) {
    _isMultiTouching = event.touches && _dragCount < event.touches.length;
    _addListener(event.target, "touchend", _onMultiTouchDocumentEnd);
  }, _getDocScrollTop2 = function _getDocScrollTop3(doc) {
    return _win.pageYOffset || doc.scrollTop || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
  }, _getDocScrollLeft2 = function _getDocScrollLeft3(doc) {
    return _win.pageXOffset || doc.scrollLeft || doc.documentElement.scrollLeft || doc.body.scrollLeft || 0;
  }, _addScrollListener = function _addScrollListener2(e, callback) {
    _addListener(e, "scroll", callback);
    if (!_isRoot(e.parentNode)) {
      _addScrollListener2(e.parentNode, callback);
    }
  }, _removeScrollListener = function _removeScrollListener2(e, callback) {
    _removeListener(e, "scroll", callback);
    if (!_isRoot(e.parentNode)) {
      _removeScrollListener2(e.parentNode, callback);
    }
  }, _isRoot = function _isRoot2(e) {
    return !!(!e || e === _docElement || e.nodeType === 9 || e === _doc.body || e === _win || !e.nodeType || !e.parentNode);
  }, _getMaxScroll = function _getMaxScroll2(element, axis) {
    var dim = axis === "x" ? "Width" : "Height", scroll = "scroll" + dim, client = "client" + dim;
    return Math.max(0, _isRoot(element) ? Math.max(_docElement[scroll], _body[scroll]) - (_win["inner" + dim] || _docElement[client] || _body[client]) : element[scroll] - element[client]);
  }, _recordMaxScrolls = function _recordMaxScrolls2(e, skipCurrent) {
    var x = _getMaxScroll(e, "x"), y = _getMaxScroll(e, "y");
    if (_isRoot(e)) {
      e = _windowProxy;
    } else {
      _recordMaxScrolls2(e.parentNode, skipCurrent);
    }
    e._gsMaxScrollX = x;
    e._gsMaxScrollY = y;
    if (!skipCurrent) {
      e._gsScrollX = e.scrollLeft || 0;
      e._gsScrollY = e.scrollTop || 0;
    }
  }, _setStyle = function _setStyle2(element, property, value) {
    var style2 = element.style;
    if (!style2) {
      return;
    }
    if (_isUndefined2(style2[property])) {
      property = _checkPrefix(property, element) || property;
    }
    if (value == null) {
      style2.removeProperty && style2.removeProperty(property.replace(/([A-Z])/g, "-$1").toLowerCase());
    } else {
      style2[property] = value;
    }
  }, _getComputedStyle = function _getComputedStyle2(element) {
    return _win.getComputedStyle(element instanceof Element ? element : element.host || (element.parentNode || {}).host || element);
  }, _tempRect = {}, _parseRect = function _parseRect2(e) {
    if (e === _win) {
      _tempRect.left = _tempRect.top = 0;
      _tempRect.width = _tempRect.right = _docElement.clientWidth || e.innerWidth || _body.clientWidth || 0;
      _tempRect.height = _tempRect.bottom = (e.innerHeight || 0) - 20 < _docElement.clientHeight ? _docElement.clientHeight : e.innerHeight || _body.clientHeight || 0;
      return _tempRect;
    }
    var doc = e.ownerDocument || _doc, r = !_isUndefined2(e.pageX) ? {
      left: e.pageX - _getDocScrollLeft2(doc),
      top: e.pageY - _getDocScrollTop2(doc),
      right: e.pageX - _getDocScrollLeft2(doc) + 1,
      bottom: e.pageY - _getDocScrollTop2(doc) + 1
    } : !e.nodeType && !_isUndefined2(e.left) && !_isUndefined2(e.top) ? e : _toArray(e)[0].getBoundingClientRect();
    if (_isUndefined2(r.right) && !_isUndefined2(r.width)) {
      r.right = r.left + r.width;
      r.bottom = r.top + r.height;
    } else if (_isUndefined2(r.width)) {
      r = {
        width: r.right - r.left,
        height: r.bottom - r.top,
        right: r.right,
        left: r.left,
        bottom: r.bottom,
        top: r.top
      };
    }
    return r;
  }, _dispatchEvent = function _dispatchEvent2(target, type, callbackName) {
    var vars = target.vars, callback = vars[callbackName], listeners = target._listeners[type], result;
    if (_isFunction2(callback)) {
      result = callback.apply(vars.callbackScope || target, vars[callbackName + "Params"] || [target.pointerEvent]);
    }
    if (listeners && target.dispatchEvent(type) === false) {
      result = false;
    }
    return result;
  }, _getBounds = function _getBounds2(target, context3) {
    var e = _toArray(target)[0], top, left, offset;
    if (!e.nodeType && e !== _win) {
      if (!_isUndefined2(target.left)) {
        offset = {
          x: 0,
          y: 0
        };
        return {
          left: target.left - offset.x,
          top: target.top - offset.y,
          width: target.width,
          height: target.height
        };
      }
      left = target.min || target.minX || target.minRotation || 0;
      top = target.min || target.minY || 0;
      return {
        left,
        top,
        width: (target.max || target.maxX || target.maxRotation || 0) - left,
        height: (target.max || target.maxY || 0) - top
      };
    }
    return _getElementBounds(e, context3);
  }, _point1 = {}, _getElementBounds = function _getElementBounds2(element, context3) {
    context3 = _toArray(context3)[0];
    var isSVG = element.getBBox && element.ownerSVGElement, doc = element.ownerDocument || _doc, left, right, top, bottom, matrix, p1, p2, p3, p4, bbox, width, height, cs;
    if (element === _win) {
      top = _getDocScrollTop2(doc);
      left = _getDocScrollLeft2(doc);
      right = left + (doc.documentElement.clientWidth || element.innerWidth || doc.body.clientWidth || 0);
      bottom = top + ((element.innerHeight || 0) - 20 < doc.documentElement.clientHeight ? doc.documentElement.clientHeight : element.innerHeight || doc.body.clientHeight || 0);
    } else if (context3 === _win || _isUndefined2(context3)) {
      return element.getBoundingClientRect();
    } else {
      left = top = 0;
      if (isSVG) {
        bbox = element.getBBox();
        width = bbox.width;
        height = bbox.height;
      } else {
        if (element.viewBox && (bbox = element.viewBox.baseVal)) {
          left = bbox.x || 0;
          top = bbox.y || 0;
          width = bbox.width;
          height = bbox.height;
        }
        if (!width) {
          cs = _getComputedStyle(element);
          bbox = cs.boxSizing === "border-box";
          width = (parseFloat(cs.width) || element.clientWidth || 0) + (bbox ? 0 : parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth));
          height = (parseFloat(cs.height) || element.clientHeight || 0) + (bbox ? 0 : parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth));
        }
      }
      right = width;
      bottom = height;
    }
    if (element === context3) {
      return {
        left,
        top,
        width: right - left,
        height: bottom - top
      };
    }
    matrix = getGlobalMatrix(context3, true).multiply(getGlobalMatrix(element));
    p1 = matrix.apply({
      x: left,
      y: top
    });
    p2 = matrix.apply({
      x: right,
      y: top
    });
    p3 = matrix.apply({
      x: right,
      y: bottom
    });
    p4 = matrix.apply({
      x: left,
      y: bottom
    });
    left = Math.min(p1.x, p2.x, p3.x, p4.x);
    top = Math.min(p1.y, p2.y, p3.y, p4.y);
    return {
      left,
      top,
      width: Math.max(p1.x, p2.x, p3.x, p4.x) - left,
      height: Math.max(p1.y, p2.y, p3.y, p4.y) - top
    };
  }, _parseInertia = function _parseInertia2(draggable, snap3, max, min, factor, forceZeroVelocity) {
    var vars = {}, a, i, l;
    if (snap3) {
      if (factor !== 1 && snap3 instanceof Array) {
        vars.end = a = [];
        l = snap3.length;
        if (_isObject2(snap3[0])) {
          for (i = 0; i < l; i++) {
            a[i] = _copy(snap3[i], factor);
          }
        } else {
          for (i = 0; i < l; i++) {
            a[i] = snap3[i] * factor;
          }
        }
        max += 1.1;
        min -= 1.1;
      } else if (_isFunction2(snap3)) {
        vars.end = function(value) {
          var result = snap3.call(draggable, value), copy, p;
          if (factor !== 1) {
            if (_isObject2(result)) {
              copy = {};
              for (p in result) {
                copy[p] = result[p] * factor;
              }
              result = copy;
            } else {
              result *= factor;
            }
          }
          return result;
        };
      } else {
        vars.end = snap3;
      }
    }
    if (max || max === 0) {
      vars.max = max;
    }
    if (min || min === 0) {
      vars.min = min;
    }
    if (forceZeroVelocity) {
      vars.velocity = 0;
    }
    return vars;
  }, _isClickable = function _isClickable2(element) {
    var data;
    return !element || !element.getAttribute || element === _body ? false : (data = element.getAttribute("data-clickable")) === "true" || data !== "false" && (_clickableTagExp.test(element.nodeName + "") || element.getAttribute("contentEditable") === "true") ? true : _isClickable2(element.parentNode);
  }, _setSelectable = function _setSelectable2(elements, selectable) {
    var i = elements.length, e;
    while (i--) {
      e = elements[i];
      e.ondragstart = e.onselectstart = selectable ? null : _emptyFunc2;
      gsap.set(e, {
        lazy: true,
        userSelect: selectable ? "text" : "none"
      });
    }
  }, _isFixed2 = function _isFixed3(element) {
    if (_getComputedStyle(element).position === "fixed") {
      return true;
    }
    element = element.parentNode;
    if (element && element.nodeType === 1) {
      return _isFixed3(element);
    }
  }, _supports3D, _addPaddingBR, ScrollProxy = function ScrollProxy2(element, vars) {
    element = gsap.utils.toArray(element)[0];
    vars = vars || {};
    var content = document.createElement("div"), style2 = content.style, node = element.firstChild, offsetTop = 0, offsetLeft = 0, prevTop = element.scrollTop, prevLeft = element.scrollLeft, scrollWidth = element.scrollWidth, scrollHeight = element.scrollHeight, extraPadRight = 0, maxLeft = 0, maxTop = 0, elementWidth, elementHeight, contentHeight, nextNode, transformStart, transformEnd;
    if (_supports3D && vars.force3D !== false) {
      transformStart = "translate3d(";
      transformEnd = "px,0px)";
    } else if (_transformProp) {
      transformStart = "translate(";
      transformEnd = "px)";
    }
    this.scrollTop = function(value, force) {
      if (!arguments.length) {
        return -this.top();
      }
      this.top(-value, force);
    };
    this.scrollLeft = function(value, force) {
      if (!arguments.length) {
        return -this.left();
      }
      this.left(-value, force);
    };
    this.left = function(value, force) {
      if (!arguments.length) {
        return -(element.scrollLeft + offsetLeft);
      }
      var dif = element.scrollLeft - prevLeft, oldOffset = offsetLeft;
      if ((dif > 2 || dif < -2) && !force) {
        prevLeft = element.scrollLeft;
        gsap.killTweensOf(this, {
          left: 1,
          scrollLeft: 1
        });
        this.left(-prevLeft);
        if (vars.onKill) {
          vars.onKill();
        }
        return;
      }
      value = -value;
      if (value < 0) {
        offsetLeft = value - 0.5 | 0;
        value = 0;
      } else if (value > maxLeft) {
        offsetLeft = value - maxLeft | 0;
        value = maxLeft;
      } else {
        offsetLeft = 0;
      }
      if (offsetLeft || oldOffset) {
        if (!this._skip) {
          style2[_transformProp] = transformStart + -offsetLeft + "px," + -offsetTop + transformEnd;
        }
        if (offsetLeft + extraPadRight >= 0) {
          style2.paddingRight = offsetLeft + extraPadRight + "px";
        }
      }
      element.scrollLeft = value | 0;
      prevLeft = element.scrollLeft;
    };
    this.top = function(value, force) {
      if (!arguments.length) {
        return -(element.scrollTop + offsetTop);
      }
      var dif = element.scrollTop - prevTop, oldOffset = offsetTop;
      if ((dif > 2 || dif < -2) && !force) {
        prevTop = element.scrollTop;
        gsap.killTweensOf(this, {
          top: 1,
          scrollTop: 1
        });
        this.top(-prevTop);
        if (vars.onKill) {
          vars.onKill();
        }
        return;
      }
      value = -value;
      if (value < 0) {
        offsetTop = value - 0.5 | 0;
        value = 0;
      } else if (value > maxTop) {
        offsetTop = value - maxTop | 0;
        value = maxTop;
      } else {
        offsetTop = 0;
      }
      if (offsetTop || oldOffset) {
        if (!this._skip) {
          style2[_transformProp] = transformStart + -offsetLeft + "px," + -offsetTop + transformEnd;
        }
      }
      element.scrollTop = value | 0;
      prevTop = element.scrollTop;
    };
    this.maxScrollTop = function() {
      return maxTop;
    };
    this.maxScrollLeft = function() {
      return maxLeft;
    };
    this.disable = function() {
      node = content.firstChild;
      while (node) {
        nextNode = node.nextSibling;
        element.appendChild(node);
        node = nextNode;
      }
      if (element === content.parentNode) {
        element.removeChild(content);
      }
    };
    this.enable = function() {
      node = element.firstChild;
      if (node === content) {
        return;
      }
      while (node) {
        nextNode = node.nextSibling;
        content.appendChild(node);
        node = nextNode;
      }
      element.appendChild(content);
      this.calibrate();
    };
    this.calibrate = function(force) {
      var widthMatches = element.clientWidth === elementWidth, cs, x, y;
      prevTop = element.scrollTop;
      prevLeft = element.scrollLeft;
      if (widthMatches && element.clientHeight === elementHeight && content.offsetHeight === contentHeight && scrollWidth === element.scrollWidth && scrollHeight === element.scrollHeight && !force) {
        return;
      }
      if (offsetTop || offsetLeft) {
        x = this.left();
        y = this.top();
        this.left(-element.scrollLeft);
        this.top(-element.scrollTop);
      }
      cs = _getComputedStyle(element);
      if (!widthMatches || force) {
        style2.display = "block";
        style2.width = "auto";
        style2.paddingRight = "0px";
        extraPadRight = Math.max(0, element.scrollWidth - element.clientWidth);
        if (extraPadRight) {
          extraPadRight += parseFloat(cs.paddingLeft) + (_addPaddingBR ? parseFloat(cs.paddingRight) : 0);
        }
      }
      style2.display = "inline-block";
      style2.position = "relative";
      style2.overflow = "visible";
      style2.verticalAlign = "top";
      style2.boxSizing = "content-box";
      style2.width = "100%";
      style2.paddingRight = extraPadRight + "px";
      if (_addPaddingBR) {
        style2.paddingBottom = cs.paddingBottom;
      }
      elementWidth = element.clientWidth;
      elementHeight = element.clientHeight;
      scrollWidth = element.scrollWidth;
      scrollHeight = element.scrollHeight;
      maxLeft = element.scrollWidth - elementWidth;
      maxTop = element.scrollHeight - elementHeight;
      contentHeight = content.offsetHeight;
      style2.display = "block";
      if (x || y) {
        this.left(x);
        this.top(y);
      }
    };
    this.content = content;
    this.element = element;
    this._skip = false;
    this.enable();
  }, _initCore2 = function _initCore3(required) {
    if (_windowExists3() && document.body) {
      var nav = window && window.navigator;
      _win = window;
      _doc = document;
      _docElement = _doc.documentElement;
      _body = _doc.body;
      _tempDiv = _createElement2("div");
      _supportsPointer = !!window.PointerEvent;
      _placeholderDiv = _createElement2("div");
      _placeholderDiv.style.cssText = "visibility:hidden;height:1px;top:-1px;pointer-events:none;position:relative;clear:both;cursor:grab";
      _defaultCursor = _placeholderDiv.style.cursor === "grab" ? "grab" : "move";
      _isAndroid = nav && nav.userAgent.toLowerCase().indexOf("android") !== -1;
      _isTouchDevice = "ontouchstart" in _docElement && "orientation" in _win || nav && (nav.MaxTouchPoints > 0 || nav.msMaxTouchPoints > 0);
      _addPaddingBR = (function() {
        var div = _createElement2("div"), child = _createElement2("div"), childStyle = child.style, parent = _body, val;
        childStyle.display = "inline-block";
        childStyle.position = "relative";
        div.style.cssText = "width:90px;height:40px;padding:10px;overflow:auto;visibility:hidden";
        div.appendChild(child);
        parent.appendChild(div);
        val = child.offsetHeight + 18 > div.scrollHeight;
        parent.removeChild(div);
        return val;
      })();
      _touchEventLookup = (function(types) {
        var standard = types.split(","), converted = ("onpointerdown" in _tempDiv ? "pointerdown,pointermove,pointerup,pointercancel" : "onmspointerdown" in _tempDiv ? "MSPointerDown,MSPointerMove,MSPointerUp,MSPointerCancel" : types).split(","), obj = {}, i = 4;
        while (--i > -1) {
          obj[standard[i]] = converted[i];
          obj[converted[i]] = standard[i];
        }
        try {
          _docElement.addEventListener("test", null, Object.defineProperty({}, "passive", {
            get: function get() {
              _supportsPassive = 1;
            }
          }));
        } catch (e) {
        }
        return obj;
      })("touchstart,touchmove,touchend,touchcancel");
      _addListener(_doc, "touchcancel", _emptyFunc2);
      _addListener(_win, "touchmove", _emptyFunc2);
      _body && _body.addEventListener("touchstart", _emptyFunc2);
      _addListener(_doc, "contextmenu", function() {
        for (var p in _lookup) {
          if (_lookup[p].isPressed) {
            _lookup[p].endDrag();
          }
        }
      });
      gsap = _coreInitted = _getGSAP();
    }
    if (gsap) {
      InertiaPlugin = gsap.plugins.inertia;
      _context = gsap.core.context || function() {
      };
      _checkPrefix = gsap.utils.checkPrefix;
      _transformProp = _checkPrefix(_transformProp);
      _transformOriginProp = _checkPrefix(_transformOriginProp);
      _toArray = gsap.utils.toArray;
      _getStyleSaver2 = gsap.core.getStyleSaver;
      _supports3D = !!_checkPrefix("perspective");
    } else if (required) {
      console.warn("Please gsap.registerPlugin(Draggable)");
    }
  };
  var EventDispatcher = (function() {
    function EventDispatcher2(target) {
      this._listeners = {};
      this.target = target || this;
    }
    var _proto = EventDispatcher2.prototype;
    _proto.addEventListener = function addEventListener2(type, callback) {
      var list = this._listeners[type] || (this._listeners[type] = []);
      if (!~list.indexOf(callback)) {
        list.push(callback);
      }
    };
    _proto.removeEventListener = function removeEventListener2(type, callback) {
      var list = this._listeners[type], i = list && list.indexOf(callback);
      i >= 0 && list.splice(i, 1);
    };
    _proto.dispatchEvent = function dispatchEvent(type) {
      var _this = this;
      var result;
      (this._listeners[type] || []).forEach(function(callback) {
        return callback.call(_this, {
          type,
          target: _this.target
        }) === false && (result = false);
      });
      return result;
    };
    return EventDispatcher2;
  })();
  var Draggable = (function(_EventDispatcher) {
    _inheritsLoose(Draggable2, _EventDispatcher);
    function Draggable2(target, vars) {
      var _this2;
      _this2 = _EventDispatcher.call(this) || this;
      _coreInitted || _initCore2(1);
      target = _toArray(target)[0];
      _this2.styles = _getStyleSaver2 && _getStyleSaver2(target, "transform,left,top");
      if (!InertiaPlugin) {
        InertiaPlugin = gsap.plugins.inertia;
      }
      _this2.vars = vars = _copy(vars || {});
      _this2.target = target;
      _this2.x = _this2.y = _this2.rotation = 0;
      _this2.dragResistance = parseFloat(vars.dragResistance) || 0;
      _this2.edgeResistance = isNaN(vars.edgeResistance) ? 1 : parseFloat(vars.edgeResistance) || 0;
      _this2.lockAxis = vars.lockAxis;
      _this2.autoScroll = vars.autoScroll || 0;
      _this2.lockedAxis = null;
      _this2.allowEventDefault = !!vars.allowEventDefault;
      gsap.getProperty(target, "x");
      var type = (vars.type || "x,y").toLowerCase(), xyMode = ~type.indexOf("x") || ~type.indexOf("y"), rotationMode = type.indexOf("rotation") !== -1, xProp = rotationMode ? "rotation" : xyMode ? "x" : "left", yProp = xyMode ? "y" : "top", allowX = !!(~type.indexOf("x") || ~type.indexOf("left") || type === "scroll"), allowY = !!(~type.indexOf("y") || ~type.indexOf("top") || type === "scroll"), minimumMovement = vars.minimumMovement || 2, self2 = _assertThisInitialized(_this2), triggers = _toArray(vars.trigger || vars.handle || target), killProps = {}, dragEndTime = 0, checkAutoScrollBounds = false, autoScrollMarginTop = vars.autoScrollMarginTop || 40, autoScrollMarginRight = vars.autoScrollMarginRight || 40, autoScrollMarginBottom = vars.autoScrollMarginBottom || 40, autoScrollMarginLeft = vars.autoScrollMarginLeft || 40, isClickable = vars.clickableTest || _isClickable, clickTime = 0, gsCache = target._gsap || gsap.core.getCache(target), isFixed = _isFixed2(target), getPropAsNum = function getPropAsNum2(property, unit) {
        return parseFloat(gsCache.get(target, property, unit));
      }, ownerDoc = target.ownerDocument || _doc, enabled, scrollProxy, startPointerX, startPointerY, startElementX, startElementY, hasBounds, hasDragCallback, hasMoveCallback, maxX, minX, maxY, minY, touch, touchID, rotationOrigin, dirty, old, snapX, snapY, snapXY, isClicking, touchEventTarget, matrix, interrupted, allowNativeTouchScrolling, touchDragAxis, isDispatching, clickDispatch, trustedClickDispatch, isPreventingDefault, innerMatrix, dragged, onContextMenu = function onContextMenu2(e) {
        _preventDefault(e);
        e.stopImmediatePropagation && e.stopImmediatePropagation();
        return false;
      }, render3 = function render4(suppressEvents) {
        if (self2.autoScroll && self2.isDragging && (checkAutoScrollBounds || dirty)) {
          var e = target, autoScrollFactor = self2.autoScroll * 15, parent, isRoot, rect, pointerX, pointerY, changeX, changeY, gap;
          checkAutoScrollBounds = false;
          _windowProxy.scrollTop = _win.pageYOffset != null ? _win.pageYOffset : ownerDoc.documentElement.scrollTop != null ? ownerDoc.documentElement.scrollTop : ownerDoc.body.scrollTop;
          _windowProxy.scrollLeft = _win.pageXOffset != null ? _win.pageXOffset : ownerDoc.documentElement.scrollLeft != null ? ownerDoc.documentElement.scrollLeft : ownerDoc.body.scrollLeft;
          pointerX = self2.pointerX - _windowProxy.scrollLeft;
          pointerY = self2.pointerY - _windowProxy.scrollTop;
          while (e && !isRoot) {
            isRoot = _isRoot(e.parentNode);
            parent = isRoot ? _windowProxy : e.parentNode;
            rect = isRoot ? {
              bottom: Math.max(_docElement.clientHeight, _win.innerHeight || 0),
              right: Math.max(_docElement.clientWidth, _win.innerWidth || 0),
              left: 0,
              top: 0
            } : parent.getBoundingClientRect();
            changeX = changeY = 0;
            if (allowY) {
              gap = parent._gsMaxScrollY - parent.scrollTop;
              if (gap < 0) {
                changeY = gap;
              } else if (pointerY > rect.bottom - autoScrollMarginBottom && gap) {
                checkAutoScrollBounds = true;
                changeY = Math.min(gap, autoScrollFactor * (1 - Math.max(0, rect.bottom - pointerY) / autoScrollMarginBottom) | 0);
              } else if (pointerY < rect.top + autoScrollMarginTop && parent.scrollTop) {
                checkAutoScrollBounds = true;
                changeY = -Math.min(parent.scrollTop, autoScrollFactor * (1 - Math.max(0, pointerY - rect.top) / autoScrollMarginTop) | 0);
              }
              if (changeY) {
                parent.scrollTop += changeY;
              }
            }
            if (allowX) {
              gap = parent._gsMaxScrollX - parent.scrollLeft;
              if (gap < 0) {
                changeX = gap;
              } else if (pointerX > rect.right - autoScrollMarginRight && gap) {
                checkAutoScrollBounds = true;
                changeX = Math.min(gap, autoScrollFactor * (1 - Math.max(0, rect.right - pointerX) / autoScrollMarginRight) | 0);
              } else if (pointerX < rect.left + autoScrollMarginLeft && parent.scrollLeft) {
                checkAutoScrollBounds = true;
                changeX = -Math.min(parent.scrollLeft, autoScrollFactor * (1 - Math.max(0, pointerX - rect.left) / autoScrollMarginLeft) | 0);
              }
              if (changeX) {
                parent.scrollLeft += changeX;
              }
            }
            if (isRoot && (changeX || changeY)) {
              _win.scrollTo(parent.scrollLeft, parent.scrollTop);
              setPointerPosition(self2.pointerX + changeX, self2.pointerY + changeY);
            }
            e = parent;
          }
        }
        if (dirty) {
          var x = self2.x, y = self2.y;
          if (rotationMode) {
            self2.deltaX = x - parseFloat(gsCache.rotation);
            self2.rotation = x;
            gsCache.rotation = x + "deg";
            gsCache.renderTransform(1, gsCache);
          } else {
            if (scrollProxy) {
              if (allowY) {
                self2.deltaY = y - scrollProxy.top();
                scrollProxy.top(y);
              }
              if (allowX) {
                self2.deltaX = x - scrollProxy.left();
                scrollProxy.left(x);
              }
            } else if (xyMode) {
              if (allowY) {
                self2.deltaY = y - parseFloat(gsCache.y);
                gsCache.y = y + "px";
              }
              if (allowX) {
                self2.deltaX = x - parseFloat(gsCache.x);
                gsCache.x = x + "px";
              }
              gsCache.renderTransform(1, gsCache);
            } else {
              if (allowY) {
                self2.deltaY = y - parseFloat(target.style.top || 0);
                target.style.top = y + "px";
              }
              if (allowX) {
                self2.deltaX = x - parseFloat(target.style.left || 0);
                target.style.left = x + "px";
              }
            }
          }
          if (hasDragCallback && !suppressEvents && !isDispatching) {
            isDispatching = true;
            if (_dispatchEvent(self2, "drag", "onDrag") === false) {
              if (allowX) {
                self2.x -= self2.deltaX;
              }
              if (allowY) {
                self2.y -= self2.deltaY;
              }
              render4(true);
            }
            isDispatching = false;
          }
        }
        dirty = false;
      }, syncXY = function syncXY2(skipOnUpdate, skipSnap) {
        var x = self2.x, y = self2.y, snappedValue, cs;
        if (!target._gsap) {
          gsCache = gsap.core.getCache(target);
        }
        gsCache.uncache && gsap.getProperty(target, "x");
        if (xyMode) {
          self2.x = parseFloat(gsCache.x);
          self2.y = parseFloat(gsCache.y);
        } else if (rotationMode) {
          self2.x = self2.rotation = _round2(parseFloat(gsCache.rotation));
        } else if (scrollProxy) {
          self2.y = scrollProxy.top();
          self2.x = scrollProxy.left();
        } else {
          self2.y = parseFloat(target.style.top || (cs = _getComputedStyle(target)) && cs.top) || 0;
          self2.x = parseFloat(target.style.left || (cs || {}).left) || 0;
        }
        if ((snapX || snapY || snapXY) && !skipSnap && (self2.isDragging || self2.isThrowing)) {
          if (snapXY) {
            _temp1.x = self2.x;
            _temp1.y = self2.y;
            snappedValue = snapXY(_temp1);
            if (snappedValue.x !== self2.x) {
              self2.x = snappedValue.x;
              dirty = true;
            }
            if (snappedValue.y !== self2.y) {
              self2.y = snappedValue.y;
              dirty = true;
            }
          }
          if (snapX) {
            snappedValue = snapX(self2.x);
            if (snappedValue !== self2.x) {
              self2.x = snappedValue;
              if (rotationMode) {
                self2.rotation = snappedValue;
              }
              dirty = true;
            }
          }
          if (snapY) {
            snappedValue = snapY(self2.y);
            if (snappedValue !== self2.y) {
              self2.y = snappedValue;
            }
            dirty = true;
          }
        }
        dirty && render3(true);
        if (!skipOnUpdate) {
          self2.deltaX = self2.x - x;
          self2.deltaY = self2.y - y;
          _dispatchEvent(self2, "throwupdate", "onThrowUpdate");
        }
      }, buildSnapFunc = function buildSnapFunc2(snap3, min, max, factor) {
        if (min == null) {
          min = -_bigNum;
        }
        if (max == null) {
          max = _bigNum;
        }
        if (_isFunction2(snap3)) {
          return function(n) {
            var edgeTolerance = !self2.isPressed ? 1 : 1 - self2.edgeResistance;
            return snap3.call(self2, (n > max ? max + (n - max) * edgeTolerance : n < min ? min + (n - min) * edgeTolerance : n) * factor) * factor;
          };
        }
        if (_isArray(snap3)) {
          return function(n) {
            var i = snap3.length, closest = 0, absDif = _bigNum, val, dif;
            while (--i > -1) {
              val = snap3[i];
              dif = val - n;
              if (dif < 0) {
                dif = -dif;
              }
              if (dif < absDif && val >= min && val <= max) {
                closest = i;
                absDif = dif;
              }
            }
            return snap3[closest];
          };
        }
        return isNaN(snap3) ? function(n) {
          return n;
        } : function() {
          return snap3 * factor;
        };
      }, buildPointSnapFunc = function buildPointSnapFunc2(snap3, minX2, maxX2, minY2, maxY2, radius, factor) {
        radius = radius && radius < _bigNum ? radius * radius : _bigNum;
        if (_isFunction2(snap3)) {
          return function(point) {
            var edgeTolerance = !self2.isPressed ? 1 : 1 - self2.edgeResistance, x = point.x, y = point.y, result, dx, dy;
            point.x = x = x > maxX2 ? maxX2 + (x - maxX2) * edgeTolerance : x < minX2 ? minX2 + (x - minX2) * edgeTolerance : x;
            point.y = y = y > maxY2 ? maxY2 + (y - maxY2) * edgeTolerance : y < minY2 ? minY2 + (y - minY2) * edgeTolerance : y;
            result = snap3.call(self2, point);
            if (result !== point) {
              point.x = result.x;
              point.y = result.y;
            }
            if (factor !== 1) {
              point.x *= factor;
              point.y *= factor;
            }
            if (radius < _bigNum) {
              dx = point.x - x;
              dy = point.y - y;
              if (dx * dx + dy * dy > radius) {
                point.x = x;
                point.y = y;
              }
            }
            return point;
          };
        }
        if (_isArray(snap3)) {
          return function(p) {
            var i = snap3.length, closest = 0, minDist = _bigNum, x, y, point, dist;
            while (--i > -1) {
              point = snap3[i];
              x = point.x - p.x;
              y = point.y - p.y;
              dist = x * x + y * y;
              if (dist < minDist) {
                closest = i;
                minDist = dist;
              }
            }
            return minDist <= radius ? snap3[closest] : p;
          };
        }
        return function(n) {
          return n;
        };
      }, calculateBounds = function calculateBounds2() {
        var bounds, targetBounds, snap3, snapIsRaw;
        hasBounds = false;
        if (scrollProxy) {
          scrollProxy.calibrate();
          self2.minX = minX = -scrollProxy.maxScrollLeft();
          self2.minY = minY = -scrollProxy.maxScrollTop();
          self2.maxX = maxX = self2.maxY = maxY = 0;
          hasBounds = true;
        } else if (!!vars.bounds) {
          bounds = _getBounds(vars.bounds, target.parentNode);
          if (rotationMode) {
            self2.minX = minX = bounds.left;
            self2.maxX = maxX = bounds.left + bounds.width;
            self2.minY = minY = self2.maxY = maxY = 0;
          } else if (!_isUndefined2(vars.bounds.maxX) || !_isUndefined2(vars.bounds.maxY)) {
            bounds = vars.bounds;
            self2.minX = minX = bounds.minX;
            self2.minY = minY = bounds.minY;
            self2.maxX = maxX = bounds.maxX;
            self2.maxY = maxY = bounds.maxY;
          } else {
            targetBounds = _getBounds(target, target.parentNode);
            self2.minX = minX = Math.round(getPropAsNum(xProp, "px") + bounds.left - targetBounds.left);
            self2.minY = minY = Math.round(getPropAsNum(yProp, "px") + bounds.top - targetBounds.top);
            self2.maxX = maxX = Math.round(minX + (bounds.width - targetBounds.width));
            self2.maxY = maxY = Math.round(minY + (bounds.height - targetBounds.height));
          }
          if (minX > maxX) {
            self2.minX = maxX;
            self2.maxX = maxX = minX;
            minX = self2.minX;
          }
          if (minY > maxY) {
            self2.minY = maxY;
            self2.maxY = maxY = minY;
            minY = self2.minY;
          }
          if (rotationMode) {
            self2.minRotation = minX;
            self2.maxRotation = maxX;
          }
          hasBounds = true;
        }
        if (vars.liveSnap) {
          snap3 = vars.liveSnap === true ? vars.snap || {} : vars.liveSnap;
          snapIsRaw = _isArray(snap3) || _isFunction2(snap3);
          if (rotationMode) {
            snapX = buildSnapFunc(snapIsRaw ? snap3 : snap3.rotation, minX, maxX, 1);
            snapY = null;
          } else {
            if (snap3.points) {
              snapXY = buildPointSnapFunc(snapIsRaw ? snap3 : snap3.points, minX, maxX, minY, maxY, snap3.radius, scrollProxy ? -1 : 1);
            } else {
              if (allowX) {
                snapX = buildSnapFunc(snapIsRaw ? snap3 : snap3.x || snap3.left || snap3.scrollLeft, minX, maxX, scrollProxy ? -1 : 1);
              }
              if (allowY) {
                snapY = buildSnapFunc(snapIsRaw ? snap3 : snap3.y || snap3.top || snap3.scrollTop, minY, maxY, scrollProxy ? -1 : 1);
              }
            }
          }
        }
      }, onThrowComplete = function onThrowComplete2() {
        self2.isThrowing = false;
        _dispatchEvent(self2, "throwcomplete", "onThrowComplete");
      }, onThrowInterrupt = function onThrowInterrupt2() {
        self2.isThrowing = false;
      }, animate = function animate2(inertia, forceZeroVelocity) {
        var snap3, snapIsRaw, tween, overshootTolerance;
        if (inertia && InertiaPlugin) {
          if (inertia === true) {
            snap3 = vars.snap || vars.liveSnap || {};
            snapIsRaw = _isArray(snap3) || _isFunction2(snap3);
            inertia = {
              resistance: (vars.throwResistance || vars.resistance || 1e3) / (rotationMode ? 10 : 1)
            };
            if (rotationMode) {
              inertia.rotation = _parseInertia(self2, snapIsRaw ? snap3 : snap3.rotation, maxX, minX, 1, forceZeroVelocity);
            } else {
              if (allowX) {
                inertia[xProp] = _parseInertia(self2, snapIsRaw ? snap3 : snap3.points || snap3.x || snap3.left, maxX, minX, scrollProxy ? -1 : 1, forceZeroVelocity || self2.lockedAxis === "x");
              }
              if (allowY) {
                inertia[yProp] = _parseInertia(self2, snapIsRaw ? snap3 : snap3.points || snap3.y || snap3.top, maxY, minY, scrollProxy ? -1 : 1, forceZeroVelocity || self2.lockedAxis === "y");
              }
              if (snap3.points || _isArray(snap3) && _isObject2(snap3[0])) {
                inertia.linkedProps = xProp + "," + yProp;
                inertia.radius = snap3.radius;
              }
            }
          }
          self2.isThrowing = true;
          overshootTolerance = !isNaN(vars.overshootTolerance) ? vars.overshootTolerance : vars.edgeResistance === 1 ? 0 : 1 - self2.edgeResistance + 0.2;
          if (!inertia.duration) {
            inertia.duration = {
              max: Math.max(vars.minDuration || 0, "maxDuration" in vars ? vars.maxDuration : 2),
              min: !isNaN(vars.minDuration) ? vars.minDuration : overshootTolerance === 0 || _isObject2(inertia) && inertia.resistance > 1e3 ? 0 : 0.5,
              overshoot: overshootTolerance
            };
          }
          self2.tween = tween = gsap.to(scrollProxy || target, {
            inertia,
            data: "_draggable",
            inherit: false,
            onComplete: onThrowComplete,
            onInterrupt: onThrowInterrupt,
            onUpdate: vars.fastMode ? _dispatchEvent : syncXY,
            onUpdateParams: vars.fastMode ? [self2, "onthrowupdate", "onThrowUpdate"] : snap3 && snap3.radius ? [false, true] : []
          });
          if (!vars.fastMode) {
            if (scrollProxy) {
              scrollProxy._skip = true;
            }
            tween.render(1e9, true, true);
            syncXY(true, true);
            self2.endX = self2.x;
            self2.endY = self2.y;
            if (rotationMode) {
              self2.endRotation = self2.x;
            }
            tween.play(0);
            syncXY(true, true);
            if (scrollProxy) {
              scrollProxy._skip = false;
            }
          }
        } else if (hasBounds) {
          self2.applyBounds();
        }
      }, updateMatrix = function updateMatrix2(shiftStart) {
        var start = matrix, p;
        matrix = getGlobalMatrix(target.parentNode, true);
        if (shiftStart && self2.isPressed && !matrix.equals(start || new Matrix2D())) {
          p = start.inverse().apply({
            x: startPointerX,
            y: startPointerY
          });
          matrix.apply(p, p);
          startPointerX = p.x;
          startPointerY = p.y;
        }
        if (matrix.equals(_identityMatrix)) {
          matrix = null;
        }
      }, recordStartPositions = function recordStartPositions2() {
        var edgeTolerance = 1 - self2.edgeResistance, offsetX = isFixed ? _getDocScrollLeft2(ownerDoc) : 0, offsetY = isFixed ? _getDocScrollTop2(ownerDoc) : 0, parsedOrigin, x, y;
        if (xyMode) {
          gsCache.x = getPropAsNum(xProp, "px") + "px";
          gsCache.y = getPropAsNum(yProp, "px") + "px";
          gsCache.renderTransform();
        }
        updateMatrix(false);
        _point1.x = self2.pointerX - offsetX;
        _point1.y = self2.pointerY - offsetY;
        matrix && matrix.apply(_point1, _point1);
        startPointerX = _point1.x;
        startPointerY = _point1.y;
        if (dirty) {
          setPointerPosition(self2.pointerX, self2.pointerY);
          render3(true);
        }
        innerMatrix = getGlobalMatrix(target);
        if (scrollProxy) {
          calculateBounds();
          startElementY = scrollProxy.top();
          startElementX = scrollProxy.left();
        } else {
          if (isTweening2()) {
            syncXY(true, true);
            calculateBounds();
          } else {
            self2.applyBounds();
          }
          if (rotationMode) {
            parsedOrigin = target.ownerSVGElement ? [gsCache.xOrigin - target.getBBox().x, gsCache.yOrigin - target.getBBox().y] : (_getComputedStyle(target)[_transformOriginProp] || "0 0").split(" ");
            rotationOrigin = self2.rotationOrigin = getGlobalMatrix(target).apply({
              x: parseFloat(parsedOrigin[0]) || 0,
              y: parseFloat(parsedOrigin[1]) || 0
            });
            syncXY(true, true);
            x = self2.pointerX - rotationOrigin.x - offsetX;
            y = rotationOrigin.y - self2.pointerY + offsetY;
            startElementX = self2.x;
            startElementY = self2.y = Math.atan2(y, x) * _RAD2DEG;
          } else {
            startElementY = getPropAsNum(yProp, "px");
            startElementX = getPropAsNum(xProp, "px");
          }
        }
        if (hasBounds && edgeTolerance) {
          if (startElementX > maxX) {
            startElementX = maxX + (startElementX - maxX) / edgeTolerance;
          } else if (startElementX < minX) {
            startElementX = minX - (minX - startElementX) / edgeTolerance;
          }
          if (!rotationMode) {
            if (startElementY > maxY) {
              startElementY = maxY + (startElementY - maxY) / edgeTolerance;
            } else if (startElementY < minY) {
              startElementY = minY - (minY - startElementY) / edgeTolerance;
            }
          }
        }
        self2.startX = startElementX = _round2(startElementX);
        self2.startY = startElementY = _round2(startElementY);
      }, isTweening2 = function isTweening3() {
        return self2.tween && self2.tween.isActive();
      }, removePlaceholder = function removePlaceholder2() {
        if (_placeholderDiv.parentNode && !isTweening2() && !self2.isDragging) {
          _placeholderDiv.parentNode.removeChild(_placeholderDiv);
        }
      }, onPress = function onPress2(e, force) {
        var i;
        if (!enabled || self2.isPressed || !e || (e.type === "mousedown" || e.type === "pointerdown") && !force && _getTime() - clickTime < 30 && _touchEventLookup[self2.pointerEvent.type]) {
          isPreventingDefault && e && enabled && _preventDefault(e);
          return;
        }
        interrupted = isTweening2();
        dragged = false;
        self2.pointerEvent = e;
        if (_touchEventLookup[e.type]) {
          touchEventTarget = ~e.type.indexOf("touch") ? e.currentTarget || e.target : ownerDoc;
          _addListener(touchEventTarget, "touchend", onRelease);
          _addListener(touchEventTarget, "touchmove", onMove);
          _addListener(touchEventTarget, "touchcancel", onRelease);
          _addListener(ownerDoc, "touchstart", _onMultiTouchDocument);
        } else {
          touchEventTarget = null;
          _addListener(ownerDoc, "mousemove", onMove);
        }
        touchDragAxis = null;
        if (!_supportsPointer || !touchEventTarget) {
          _addListener(ownerDoc, "mouseup", onRelease);
          e && e.target && _addListener(e.target, "mouseup", onRelease);
        }
        isClicking = isClickable.call(self2, e.target) && vars.dragClickables === false && !force;
        if (isClicking) {
          _addListener(e.target, "change", onRelease);
          _dispatchEvent(self2, "pressInit", "onPressInit");
          _dispatchEvent(self2, "press", "onPress");
          _setSelectable(triggers, true);
          isPreventingDefault = false;
          return;
        }
        allowNativeTouchScrolling = !touchEventTarget || allowX === allowY || self2.vars.allowNativeTouchScrolling === false || self2.vars.allowContextMenu && e && (e.ctrlKey || e.which > 2) ? false : allowX ? "y" : "x";
        isPreventingDefault = !allowNativeTouchScrolling && !self2.allowEventDefault;
        if (isPreventingDefault) {
          _preventDefault(e);
          _addListener(_win, "touchforcechange", _preventDefault);
        }
        if (e.changedTouches) {
          e = touch = e.changedTouches[0];
          touchID = e.identifier;
        } else if (e.pointerId) {
          touchID = e.pointerId;
        } else {
          touch = touchID = null;
        }
        _dragCount++;
        _addToRenderQueue(render3);
        startPointerY = self2.pointerY = e.pageY;
        startPointerX = self2.pointerX = e.pageX;
        _dispatchEvent(self2, "pressInit", "onPressInit");
        if (allowNativeTouchScrolling || self2.autoScroll) {
          _recordMaxScrolls(target.parentNode);
        }
        if (target.parentNode && self2.autoScroll && !scrollProxy && !rotationMode && target.parentNode._gsMaxScrollX && !_placeholderDiv.parentNode && !target.getBBox) {
          _placeholderDiv.style.width = target.parentNode.scrollWidth + "px";
          target.parentNode.appendChild(_placeholderDiv);
        }
        recordStartPositions();
        self2.tween && self2.tween.kill();
        self2.isThrowing = false;
        gsap.killTweensOf(scrollProxy || target, killProps, true);
        scrollProxy && gsap.killTweensOf(target, {
          scrollTo: 1
        }, true);
        self2.tween = self2.lockedAxis = null;
        if (vars.zIndexBoost || !rotationMode && !scrollProxy && vars.zIndexBoost !== false) {
          target.style.zIndex = Draggable2.zIndex++;
        }
        self2.isPressed = true;
        hasDragCallback = !!(vars.onDrag || self2._listeners.drag);
        hasMoveCallback = !!(vars.onMove || self2._listeners.move);
        if (vars.cursor !== false || vars.activeCursor) {
          i = triggers.length;
          while (--i > -1) {
            gsap.set(triggers[i], {
              cursor: vars.activeCursor || vars.cursor || (_defaultCursor === "grab" ? "grabbing" : _defaultCursor)
            });
          }
        }
        _dispatchEvent(self2, "press", "onPress");
        InertiaPlugin && InertiaPlugin.track(scrollProxy || target, xyMode ? "x,y" : rotationMode ? "rotation" : "top,left");
      }, onMove = function onMove2(e) {
        var originalEvent = e, touches, pointerX, pointerY, i, dx, dy;
        if (!enabled || _isMultiTouching || !self2.isPressed || !e) {
          isPreventingDefault && e && enabled && _preventDefault(e);
          return;
        }
        self2.pointerEvent = e;
        touches = e.changedTouches;
        if (touches) {
          e = touches[0];
          if (e !== touch && e.identifier !== touchID) {
            i = touches.length;
            while (--i > -1 && (e = touches[i]).identifier !== touchID && e.target !== target) {
            }
            if (i < 0) {
              return;
            }
          }
        } else if (e.pointerId && touchID && e.pointerId !== touchID) {
          return;
        }
        if (touchEventTarget && allowNativeTouchScrolling && !touchDragAxis) {
          _point1.x = e.pageX - (isFixed ? _getDocScrollLeft2(ownerDoc) : 0);
          _point1.y = e.pageY - (isFixed ? _getDocScrollTop2(ownerDoc) : 0);
          matrix && matrix.apply(_point1, _point1);
          pointerX = _point1.x;
          pointerY = _point1.y;
          dx = Math.abs(pointerX - startPointerX);
          dy = Math.abs(pointerY - startPointerY);
          if (dx !== dy && (dx > minimumMovement || dy > minimumMovement) || _isAndroid && allowNativeTouchScrolling === touchDragAxis) {
            touchDragAxis = dx > dy && allowX ? "x" : "y";
            if (allowNativeTouchScrolling && touchDragAxis !== allowNativeTouchScrolling) {
              _addListener(_win, "touchforcechange", _preventDefault);
            }
            if (self2.vars.lockAxisOnTouchScroll !== false && allowX && allowY) {
              self2.lockedAxis = touchDragAxis === "x" ? "y" : "x";
              _isFunction2(self2.vars.onLockAxis) && self2.vars.onLockAxis.call(self2, originalEvent);
            }
            if (_isAndroid && allowNativeTouchScrolling === touchDragAxis) {
              onRelease(originalEvent);
              return;
            }
          }
        }
        if (!self2.allowEventDefault && (!allowNativeTouchScrolling || touchDragAxis && allowNativeTouchScrolling !== touchDragAxis) && originalEvent.cancelable !== false) {
          _preventDefault(originalEvent);
          isPreventingDefault = true;
        } else if (isPreventingDefault) {
          isPreventingDefault = false;
        }
        if (self2.autoScroll) {
          checkAutoScrollBounds = true;
        }
        setPointerPosition(e.pageX, e.pageY, hasMoveCallback);
      }, setPointerPosition = function setPointerPosition2(pointerX, pointerY, invokeOnMove) {
        var dragTolerance = 1 - self2.dragResistance, edgeTolerance = 1 - self2.edgeResistance, prevPointerX = self2.pointerX, prevPointerY = self2.pointerY, prevStartElementY = startElementY, prevX = self2.x, prevY = self2.y, prevEndX = self2.endX, prevEndY = self2.endY, prevEndRotation = self2.endRotation, prevDirty = dirty, xChange, yChange, x, y, dif, temp;
        self2.pointerX = pointerX;
        self2.pointerY = pointerY;
        if (isFixed) {
          pointerX -= _getDocScrollLeft2(ownerDoc);
          pointerY -= _getDocScrollTop2(ownerDoc);
        }
        if (rotationMode) {
          y = _round2(Math.atan2(rotationOrigin.y - pointerY, pointerX - rotationOrigin.x) * _RAD2DEG);
          dif = self2.y - y;
          if (dif > 180) {
            startElementY -= 360;
            self2.y = y;
          } else if (dif < -180) {
            startElementY += 360;
            self2.y = y;
          }
          if (matrix) {
            temp = pointerX * matrix.a + pointerY * matrix.c + matrix.e;
            pointerY = pointerX * matrix.b + pointerY * matrix.d + matrix.f;
            pointerX = temp;
          }
          if (self2.x !== startElementX || Math.max(Math.abs(startPointerX - pointerX), Math.abs(startPointerY - pointerY)) > minimumMovement) {
            self2.y = y;
            x = _round2(startElementX + (startElementY - y) * dragTolerance);
          } else {
            x = startElementX;
          }
        } else {
          if (matrix) {
            temp = pointerX * matrix.a + pointerY * matrix.c + matrix.e;
            pointerY = pointerX * matrix.b + pointerY * matrix.d + matrix.f;
            pointerX = temp;
          }
          yChange = pointerY - startPointerY;
          xChange = pointerX - startPointerX;
          if (yChange < minimumMovement && yChange > -minimumMovement) {
            yChange = 0;
          }
          if (xChange < minimumMovement && xChange > -minimumMovement) {
            xChange = 0;
          }
          if ((self2.lockAxis || self2.lockedAxis) && (xChange || yChange)) {
            temp = self2.lockedAxis;
            if (!temp) {
              self2.lockedAxis = temp = allowX && Math.abs(xChange) > Math.abs(yChange) ? "y" : allowY ? "x" : null;
              if (temp && _isFunction2(self2.vars.onLockAxis)) {
                self2.vars.onLockAxis.call(self2, self2.pointerEvent);
              }
            }
            if (temp === "y") {
              yChange = 0;
            } else if (temp === "x") {
              xChange = 0;
            }
          }
          x = _round2(startElementX + xChange * dragTolerance);
          y = _round2(startElementY + yChange * dragTolerance);
        }
        if ((snapX || snapY || snapXY) && (self2.x !== x || self2.y !== y && !rotationMode)) {
          if (snapXY) {
            _temp1.x = x;
            _temp1.y = y;
            temp = snapXY(_temp1);
            x = _round2(temp.x);
            y = _round2(temp.y);
          }
          if (snapX) {
            x = _round2(snapX(x));
          }
          if (snapY) {
            y = _round2(snapY(y));
          }
        }
        if (hasBounds) {
          if (x > maxX) {
            x = maxX + Math.round((x - maxX) * edgeTolerance);
          } else if (x < minX) {
            x = minX + Math.round((x - minX) * edgeTolerance);
          }
          if (!rotationMode) {
            if (y > maxY) {
              y = Math.round(maxY + (y - maxY) * edgeTolerance);
            } else if (y < minY) {
              y = Math.round(minY + (y - minY) * edgeTolerance);
            }
          }
        }
        if (self2.x !== x || self2.y !== y && !rotationMode) {
          if (rotationMode) {
            self2.endRotation = self2.x = self2.endX = _round2(x);
            dirty = true;
          } else {
            if (allowY) {
              self2.y = self2.endY = y;
              dirty = true;
            }
            if (allowX) {
              self2.x = self2.endX = x;
              dirty = true;
            }
          }
          if (!invokeOnMove || _dispatchEvent(self2, "move", "onMove") !== false) {
            if (!self2.isDragging && self2.isPressed) {
              self2.isDragging = dragged = true;
              _dispatchEvent(self2, "dragstart", "onDragStart");
            }
          } else {
            self2.pointerX = prevPointerX;
            self2.pointerY = prevPointerY;
            startElementY = prevStartElementY;
            self2.x = prevX;
            self2.y = prevY;
            self2.endX = prevEndX;
            self2.endY = prevEndY;
            self2.endRotation = prevEndRotation;
            dirty = prevDirty;
          }
        }
      }, onRelease = function onRelease2(e, force) {
        if (!enabled || !self2.isPressed || e && touchID != null && !force && (e.pointerId && e.pointerId !== touchID && e.target !== target || e.changedTouches && !_hasTouchID(e.changedTouches, touchID))) {
          isPreventingDefault && e && enabled && _preventDefault(e);
          return;
        }
        self2.isPressed = false;
        var originalEvent = e, wasDragging = self2.isDragging, isContextMenuRelease = self2.vars.allowContextMenu && e && (e.ctrlKey || e.which > 2), placeholderDelayedCall = gsap.delayedCall(1e-3, removePlaceholder), touches, i, syntheticEvent, eventTarget, syntheticClick;
        if (touchEventTarget) {
          _removeListener(touchEventTarget, "touchend", onRelease2);
          _removeListener(touchEventTarget, "touchmove", onMove);
          _removeListener(touchEventTarget, "touchcancel", onRelease2);
          _removeListener(ownerDoc, "touchstart", _onMultiTouchDocument);
        } else {
          _removeListener(ownerDoc, "mousemove", onMove);
        }
        _removeListener(_win, "touchforcechange", _preventDefault);
        if (!_supportsPointer || !touchEventTarget) {
          _removeListener(ownerDoc, "mouseup", onRelease2);
          e && e.target && _removeListener(e.target, "mouseup", onRelease2);
        }
        dirty = false;
        if (wasDragging) {
          dragEndTime = _lastDragTime = _getTime();
          self2.isDragging = false;
        }
        _removeFromRenderQueue(render3);
        if (isClicking && !isContextMenuRelease) {
          if (e) {
            _removeListener(e.target, "change", onRelease2);
            self2.pointerEvent = originalEvent;
          }
          _setSelectable(triggers, false);
          _dispatchEvent(self2, "release", "onRelease");
          _dispatchEvent(self2, "click", "onClick");
          isClicking = false;
          return;
        }
        i = triggers.length;
        while (--i > -1) {
          _setStyle(triggers[i], "cursor", vars.cursor || (vars.cursor !== false ? _defaultCursor : null));
        }
        _dragCount--;
        if (e) {
          touches = e.changedTouches;
          if (touches) {
            e = touches[0];
            if (e !== touch && e.identifier !== touchID) {
              i = touches.length;
              while (--i > -1 && (e = touches[i]).identifier !== touchID && e.target !== target) {
              }
              if (i < 0 && !force) {
                return;
              }
            }
          }
          self2.pointerEvent = originalEvent;
          self2.pointerX = e.pageX;
          self2.pointerY = e.pageY;
        }
        if (isContextMenuRelease && originalEvent) {
          _preventDefault(originalEvent);
          isPreventingDefault = true;
          _dispatchEvent(self2, "release", "onRelease");
        } else if (originalEvent && !wasDragging) {
          isPreventingDefault = false;
          if (interrupted && (vars.snap || vars.bounds)) {
            animate(vars.inertia || vars.throwProps);
          }
          _dispatchEvent(self2, "release", "onRelease");
          if ((!_isAndroid || originalEvent.type !== "touchmove") && originalEvent.type.indexOf("cancel") === -1) {
            _dispatchEvent(self2, "click", "onClick");
            if (_getTime() - clickTime < 300) {
              _dispatchEvent(self2, "doubleclick", "onDoubleClick");
            }
            eventTarget = originalEvent.target || target;
            clickTime = _getTime();
            syntheticClick = function syntheticClick2() {
              if (clickTime !== clickDispatch && self2.enabled() && !self2.isPressed && !originalEvent.defaultPrevented) {
                if (eventTarget.click) {
                  eventTarget.click();
                } else if (ownerDoc.createEvent) {
                  syntheticEvent = ownerDoc.createEvent("MouseEvents");
                  syntheticEvent.initMouseEvent("click", true, true, _win, 1, self2.pointerEvent.screenX, self2.pointerEvent.screenY, self2.pointerX, self2.pointerY, false, false, false, false, 0, null);
                  eventTarget.dispatchEvent(syntheticEvent);
                }
              }
            };
            if (!_isAndroid && !originalEvent.defaultPrevented) {
              gsap.delayedCall(0.05, syntheticClick);
            }
          }
        } else {
          animate(vars.inertia || vars.throwProps);
          if (!self2.allowEventDefault && originalEvent && (vars.dragClickables !== false || !isClickable.call(self2, originalEvent.target)) && wasDragging && (!allowNativeTouchScrolling || touchDragAxis && allowNativeTouchScrolling === touchDragAxis) && originalEvent.cancelable !== false) {
            isPreventingDefault = true;
            _preventDefault(originalEvent);
          } else {
            isPreventingDefault = false;
          }
          _dispatchEvent(self2, "release", "onRelease");
        }
        isTweening2() && placeholderDelayedCall.duration(self2.tween.duration());
        wasDragging && _dispatchEvent(self2, "dragend", "onDragEnd");
        return true;
      }, updateScroll = function updateScroll2(e) {
        if (e && self2.isDragging && !scrollProxy) {
          var parent = e.target || target.parentNode, deltaX = parent.scrollLeft - parent._gsScrollX, deltaY = parent.scrollTop - parent._gsScrollY;
          if (deltaX || deltaY) {
            if (matrix) {
              startPointerX -= deltaX * matrix.a + deltaY * matrix.c;
              startPointerY -= deltaY * matrix.d + deltaX * matrix.b;
            } else {
              startPointerX -= deltaX;
              startPointerY -= deltaY;
            }
            parent._gsScrollX += deltaX;
            parent._gsScrollY += deltaY;
            setPointerPosition(self2.pointerX, self2.pointerY);
          }
        }
      }, onClick = function onClick2(e) {
        var time = _getTime(), recentlyClicked = time - clickTime < 100, recentlyDragged = time - dragEndTime < 50, alreadyDispatched = recentlyClicked && clickDispatch === clickTime, defaultPrevented = self2.pointerEvent && self2.pointerEvent.defaultPrevented, alreadyDispatchedTrusted = recentlyClicked && trustedClickDispatch === clickTime, trusted = e.isTrusted || e.isTrusted == null && recentlyClicked && alreadyDispatched;
        if ((alreadyDispatched || recentlyDragged && self2.vars.suppressClickOnDrag !== false) && e.stopImmediatePropagation) {
          e.stopImmediatePropagation();
        }
        if (recentlyClicked && !(self2.pointerEvent && self2.pointerEvent.defaultPrevented) && (!alreadyDispatched || trusted && !alreadyDispatchedTrusted)) {
          if (trusted && alreadyDispatched) {
            trustedClickDispatch = clickTime;
          }
          clickDispatch = clickTime;
          return;
        }
        if (self2.isPressed || recentlyDragged || recentlyClicked) {
          if (!trusted || !e.detail || !recentlyClicked || defaultPrevented) {
            _preventDefault(e);
          }
        }
        if (!recentlyClicked && !recentlyDragged && !dragged) {
          e && e.target && (self2.pointerEvent = e);
          _dispatchEvent(self2, "click", "onClick");
        }
      }, localizePoint = function localizePoint2(p) {
        return matrix ? {
          x: p.x * matrix.a + p.y * matrix.c + matrix.e,
          y: p.x * matrix.b + p.y * matrix.d + matrix.f
        } : {
          x: p.x,
          y: p.y
        };
      };
      old = Draggable2.get(target);
      old && old.kill();
      _this2.startDrag = function(event, align) {
        var r1, r2, p1, p2;
        onPress(event || self2.pointerEvent, true);
        if (align && !self2.hitTest(event || self2.pointerEvent)) {
          r1 = _parseRect(event || self2.pointerEvent);
          r2 = _parseRect(target);
          p1 = localizePoint({
            x: r1.left + r1.width / 2,
            y: r1.top + r1.height / 2
          });
          p2 = localizePoint({
            x: r2.left + r2.width / 2,
            y: r2.top + r2.height / 2
          });
          startPointerX -= p1.x - p2.x;
          startPointerY -= p1.y - p2.y;
        }
        if (!self2.isDragging) {
          self2.isDragging = dragged = true;
          _dispatchEvent(self2, "dragstart", "onDragStart");
        }
      };
      _this2.drag = onMove;
      _this2.endDrag = function(e) {
        return onRelease(e || self2.pointerEvent, true);
      };
      _this2.timeSinceDrag = function() {
        return self2.isDragging ? 0 : (_getTime() - dragEndTime) / 1e3;
      };
      _this2.timeSinceClick = function() {
        return (_getTime() - clickTime) / 1e3;
      };
      _this2.hitTest = function(target2, threshold) {
        return Draggable2.hitTest(self2.target, target2, threshold);
      };
      _this2.getDirection = function(from, diagonalThreshold) {
        var mode = from === "velocity" && InertiaPlugin ? from : _isObject2(from) && !rotationMode ? "element" : "start", xChange, yChange, ratio, direction, r1, r2;
        if (mode === "element") {
          r1 = _parseRect(self2.target);
          r2 = _parseRect(from);
        }
        xChange = mode === "start" ? self2.x - startElementX : mode === "velocity" ? InertiaPlugin.getVelocity(target, xProp) : r1.left + r1.width / 2 - (r2.left + r2.width / 2);
        if (rotationMode) {
          return xChange < 0 ? "counter-clockwise" : "clockwise";
        } else {
          diagonalThreshold = diagonalThreshold || 2;
          yChange = mode === "start" ? self2.y - startElementY : mode === "velocity" ? InertiaPlugin.getVelocity(target, yProp) : r1.top + r1.height / 2 - (r2.top + r2.height / 2);
          ratio = Math.abs(xChange / yChange);
          direction = ratio < 1 / diagonalThreshold ? "" : xChange < 0 ? "left" : "right";
          if (ratio < diagonalThreshold) {
            if (direction !== "") {
              direction += "-";
            }
            direction += yChange < 0 ? "up" : "down";
          }
        }
        return direction;
      };
      _this2.applyBounds = function(newBounds, sticky) {
        var x, y, forceZeroVelocity, e, parent, isRoot;
        if (newBounds && vars.bounds !== newBounds) {
          vars.bounds = newBounds;
          return self2.update(true, sticky);
        }
        syncXY(true);
        calculateBounds();
        if (hasBounds && !isTweening2()) {
          x = self2.x;
          y = self2.y;
          if (x > maxX) {
            x = maxX;
          } else if (x < minX) {
            x = minX;
          }
          if (y > maxY) {
            y = maxY;
          } else if (y < minY) {
            y = minY;
          }
          if (self2.x !== x || self2.y !== y) {
            forceZeroVelocity = true;
            self2.x = self2.endX = x;
            if (rotationMode) {
              self2.endRotation = x;
            } else {
              self2.y = self2.endY = y;
            }
            dirty = true;
            render3(true);
            if (self2.autoScroll && !self2.isDragging) {
              _recordMaxScrolls(target.parentNode);
              e = target;
              _windowProxy.scrollTop = _win.pageYOffset != null ? _win.pageYOffset : ownerDoc.documentElement.scrollTop != null ? ownerDoc.documentElement.scrollTop : ownerDoc.body.scrollTop;
              _windowProxy.scrollLeft = _win.pageXOffset != null ? _win.pageXOffset : ownerDoc.documentElement.scrollLeft != null ? ownerDoc.documentElement.scrollLeft : ownerDoc.body.scrollLeft;
              while (e && !isRoot) {
                isRoot = _isRoot(e.parentNode);
                parent = isRoot ? _windowProxy : e.parentNode;
                if (allowY && parent.scrollTop > parent._gsMaxScrollY) {
                  parent.scrollTop = parent._gsMaxScrollY;
                }
                if (allowX && parent.scrollLeft > parent._gsMaxScrollX) {
                  parent.scrollLeft = parent._gsMaxScrollX;
                }
                e = parent;
              }
            }
          }
          if (self2.isThrowing && (forceZeroVelocity || self2.endX > maxX || self2.endX < minX || self2.endY > maxY || self2.endY < minY)) {
            animate(vars.inertia || vars.throwProps, forceZeroVelocity);
          }
        }
        return self2;
      };
      _this2.update = function(applyBounds, sticky, ignoreExternalChanges) {
        if (sticky && self2.isPressed) {
          if (rotationMode) {
            self2.x = self2.y = _round2(parseFloat(gsCache.rotation));
          } else {
            var m = getGlobalMatrix(target), p = innerMatrix.apply({
              x: self2.x - startElementX,
              y: self2.y - startElementY
            }), m2 = getGlobalMatrix(target.parentNode, true);
            m2.apply({
              x: m.e - p.x,
              y: m.f - p.y
            }, p);
            self2.x = _round2(self2.x - (p.x - m2.e));
            self2.y = _round2(self2.y - (p.y - m2.f));
          }
          render3(true);
          recordStartPositions();
        }
        var x = self2.x, y = self2.y;
        updateMatrix(!sticky);
        if (applyBounds) {
          self2.applyBounds();
        } else {
          dirty && ignoreExternalChanges && render3(true);
          syncXY(true);
        }
        if (sticky) {
          setPointerPosition(self2.pointerX, self2.pointerY);
          dirty && render3(true);
        }
        if (self2.isPressed && !sticky && (allowX && Math.abs(x - self2.x) > 0.01 || allowY && Math.abs(y - self2.y) > 0.01 && !rotationMode)) {
          recordStartPositions();
        }
        if (self2.autoScroll) {
          _recordMaxScrolls(target.parentNode, self2.isDragging);
          checkAutoScrollBounds = self2.isDragging;
          render3(true);
          _removeScrollListener(target, updateScroll);
          _addScrollListener(target, updateScroll);
        }
        return self2;
      };
      _this2.enable = function(type2) {
        var setVars = {
          lazy: true
        }, id, i, trigger;
        if (vars.cursor !== false) {
          setVars.cursor = vars.cursor || _defaultCursor;
        }
        if (gsap.utils.checkPrefix("touchCallout")) {
          setVars.touchCallout = "none";
        }
        if (type2 !== "soft") {
          _setTouchActionForAllDescendants(triggers, allowX === allowY ? "none" : vars.allowNativeTouchScrolling && target.scrollHeight === target.clientHeight === (target.scrollWidth === target.clientHeight) || vars.allowEventDefault ? "manipulation" : allowX ? "pan-y" : "pan-x");
          i = triggers.length;
          while (--i > -1) {
            trigger = triggers[i];
            _supportsPointer || _addListener(trigger, "mousedown", onPress);
            _addListener(trigger, "touchstart", onPress);
            _addListener(trigger, "click", onClick, true);
            gsap.set(trigger, setVars);
            if (trigger.getBBox && trigger.ownerSVGElement && allowX !== allowY) {
              gsap.set(trigger.ownerSVGElement, {
                touchAction: vars.allowNativeTouchScrolling || vars.allowEventDefault ? "manipulation" : allowX ? "pan-y" : "pan-x"
              });
            }
            vars.allowContextMenu || _addListener(trigger, "contextmenu", onContextMenu);
          }
          _setSelectable(triggers, false);
        }
        _addScrollListener(target, updateScroll);
        enabled = true;
        if (InertiaPlugin && type2 !== "soft") {
          InertiaPlugin.track(scrollProxy || target, xyMode ? "x,y" : rotationMode ? "rotation" : "top,left");
        }
        target._gsDragID = id = target._gsDragID || "d" + _lookupCount++;
        _lookup[id] = self2;
        if (scrollProxy) {
          scrollProxy.enable();
          scrollProxy.element._gsDragID = id;
        }
        (vars.bounds || rotationMode) && recordStartPositions();
        vars.bounds && self2.applyBounds();
        return self2;
      };
      _this2.disable = function(type2) {
        var dragging = self2.isDragging, i = triggers.length, trigger;
        while (--i > -1) {
          _setStyle(triggers[i], "cursor", null);
        }
        if (type2 !== "soft") {
          _setTouchActionForAllDescendants(triggers, null);
          i = triggers.length;
          while (--i > -1) {
            trigger = triggers[i];
            _setStyle(trigger, "touchCallout", null);
            _removeListener(trigger, "mousedown", onPress);
            _removeListener(trigger, "touchstart", onPress);
            _removeListener(trigger, "click", onClick, true);
            _removeListener(trigger, "contextmenu", onContextMenu);
          }
          _setSelectable(triggers, true);
          if (touchEventTarget) {
            _removeListener(touchEventTarget, "touchcancel", onRelease);
            _removeListener(touchEventTarget, "touchend", onRelease);
            _removeListener(touchEventTarget, "touchmove", onMove);
          }
          _removeListener(ownerDoc, "mouseup", onRelease);
          _removeListener(ownerDoc, "mousemove", onMove);
        }
        _removeScrollListener(target, updateScroll);
        enabled = false;
        if (InertiaPlugin && type2 !== "soft") {
          InertiaPlugin.untrack(scrollProxy || target, xyMode ? "x,y" : rotationMode ? "rotation" : "top,left");
          self2.tween && self2.tween.kill();
        }
        scrollProxy && scrollProxy.disable();
        _removeFromRenderQueue(render3);
        self2.isDragging = self2.isPressed = isClicking = false;
        dragging && _dispatchEvent(self2, "dragend", "onDragEnd");
        return self2;
      };
      _this2.enabled = function(value, type2) {
        return arguments.length ? value ? self2.enable(type2) : self2.disable(type2) : enabled;
      };
      _this2.kill = function() {
        self2.isThrowing = false;
        self2.tween && self2.tween.kill();
        self2.disable();
        gsap.set(triggers, {
          clearProps: "userSelect"
        });
        delete _lookup[target._gsDragID];
        return self2;
      };
      _this2.revert = function() {
        this.kill();
        this.styles && this.styles.revert();
      };
      if (~type.indexOf("scroll")) {
        scrollProxy = _this2.scrollProxy = new ScrollProxy(target, _extend({
          onKill: function onKill() {
            self2.isPressed && onRelease(null);
          }
        }, vars));
        target.style.overflowY = allowY && !_isTouchDevice ? "auto" : "hidden";
        target.style.overflowX = allowX && !_isTouchDevice ? "auto" : "hidden";
        target = scrollProxy.content;
      }
      if (rotationMode) {
        killProps.rotation = 1;
      } else {
        if (allowX) {
          killProps[xProp] = 1;
        }
        if (allowY) {
          killProps[yProp] = 1;
        }
      }
      gsCache.force3D = "force3D" in vars ? vars.force3D : true;
      _context(_assertThisInitialized(_this2));
      _this2.enable();
      return _this2;
    }
    Draggable2.register = function register(core) {
      gsap = core;
      _initCore2();
    };
    Draggable2.create = function create(targets, vars) {
      _coreInitted || _initCore2(true);
      return _toArray(targets).map(function(target) {
        return new Draggable2(target, vars);
      });
    };
    Draggable2.get = function get(target) {
      return _lookup[(_toArray(target)[0] || {})._gsDragID];
    };
    Draggable2.timeSinceDrag = function timeSinceDrag() {
      return (_getTime() - _lastDragTime) / 1e3;
    };
    Draggable2.hitTest = function hitTest(obj1, obj2, threshold) {
      if (obj1 === obj2) {
        return false;
      }
      var r1 = _parseRect(obj1), r2 = _parseRect(obj2), top = r1.top, left = r1.left, right = r1.right, bottom = r1.bottom, width = r1.width, height = r1.height, isOutside = r2.left > right || r2.right < left || r2.top > bottom || r2.bottom < top, overlap, area, isRatio;
      if (isOutside || !threshold) {
        return !isOutside;
      }
      isRatio = (threshold + "").indexOf("%") !== -1;
      threshold = parseFloat(threshold) || 0;
      overlap = {
        left: Math.max(left, r2.left),
        top: Math.max(top, r2.top)
      };
      overlap.width = Math.min(right, r2.right) - overlap.left;
      overlap.height = Math.min(bottom, r2.bottom) - overlap.top;
      if (overlap.width < 0 || overlap.height < 0) {
        return false;
      }
      if (isRatio) {
        threshold *= 0.01;
        area = overlap.width * overlap.height;
        return area >= width * height * threshold || area >= r2.width * r2.height * threshold;
      }
      return overlap.width > threshold && overlap.height > threshold;
    };
    return Draggable2;
  })(EventDispatcher);
  _setDefaults2(Draggable.prototype, {
    pointerX: 0,
    pointerY: 0,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    isDragging: false,
    isPressed: false
  });
  Draggable.zIndex = 1e3;
  Draggable.version = "3.14.2";
  _getGSAP() && gsap.registerPlugin(Draggable);
  function bind(fn, thisArg) {
    return function wrap3() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const { iterator, toStringTag } = Symbol;
  const kindOf = ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })( Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  const isString = typeOfTest("string");
  const isFunction$1 = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
  };
  const isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      return false;
    }
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction$1(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" ||
kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context3) => !isUndefined(context3) && context3 !== _global;
  function merge() {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray2 = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result;
    while ((result = _iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction$1(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction$1(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray: toArray2,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };
  function AxiosError$1(message, code, config3, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config3 && (this.config = config3);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError$1, Error, {
    toJSON: function toJSON() {
      return {
message: this.message,
        name: this.name,
description: this.description,
        number: this.number,
fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError$1.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$1, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError$1.from = (error, code, config3, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    const msg = error && error.message ? error.message : "Error";
    const errCode = code == null && error ? error.code : code;
    AxiosError$1.call(axiosError, msg, errCode, config3, request, response);
    if (error && axiosError.cause == null) {
      Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
    }
    axiosError.name = error && error.name || "Error";
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData$1(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (utils$1.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData$1(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" &&
self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window.location.href || "http://localhost";
  const utils = Object.freeze( Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = {
    ...utils,
    ...platform$1
  };
  function toURLEncodedForm(data, options) {
    return toFormData$1(data, new platform.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }
  function parsePropPath(name) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  const defaults2 = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$1.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData$1(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional2 = this.transitional || defaults2.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults2.headers[method] = {};
  });
  const ignoreDuplicateOf = utils$1.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context3, value, header, filter2, isHeaderNameFilter) {
    if (utils$1.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value)) return;
    if (utils$1.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils$1.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  let AxiosHeaders$1 = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils$1.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders$1);
  function transformData(fns, response) {
    const config3 = this || defaults2;
    const context3 = response || config3;
    const headers = AxiosHeaders$1.from(context3.headers);
    let data = context3.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config3, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }
  function isCancel$1(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError$1(message, config3, request) {
    AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config3, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError$1, AxiosError$1, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$1(
        "Request failed with status code " + response.status,
        [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;
  const cookies = platform.hasStandardBrowserEnv ? (
{
      write(name, value, expires, path, domain, secure, sameSite) {
        if (typeof document === "undefined") return;
        const cookie = [`${name}=${encodeURIComponent(value)}`];
        if (utils$1.isNumber(expires)) {
          cookie.push(`expires=${new Date(expires).toUTCString()}`);
        }
        if (utils$1.isString(path)) {
          cookie.push(`path=${path}`);
        }
        if (utils$1.isString(domain)) {
          cookie.push(`domain=${domain}`);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        if (utils$1.isString(sameSite)) {
          cookie.push(`SameSite=${sameSite}`);
        }
        document.cookie = cookie.join("; ");
      },
      read(name) {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5, "/");
      }
    }
  ) : (
{
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
  function mergeConfig$1(config1, config22) {
    config22 = config22 || {};
    const config3 = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config22) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils$1.forEach(Object.keys({ ...config1, ...config22 }), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config22[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
    });
    return config3;
  }
  const resolveConfig = (config3) => {
    const newConfig = mergeConfig$1({}, config3);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders$1.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config3.params, config3.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if (utils$1.isFunction(data.getHeaders)) {
        const formHeaders = data.getHeaders();
        const allowedHeaders = ["content-type", "content-length"];
        Object.entries(formHeaders).forEach(([key, val]) => {
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config3) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config2 = resolveConfig(config3);
      let requestData = _config2.data;
      const requestHeaders = AxiosHeaders$1.from(_config2.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config2;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config2.cancelToken && _config2.cancelToken.unsubscribe(onCanceled);
        _config2.signal && _config2.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config2.method.toUpperCase(), _config2.url, true);
      request.timeout = _config2.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders$1.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config3,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config3, request));
        request = null;
      };
      request.onerror = function handleError(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config3, request);
        err.event = event || null;
        reject(err);
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config2.timeout ? "timeout of " + _config2.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config2.transitional || transitionalDefaults;
        if (_config2.timeoutErrorMessage) {
          timeoutErrorMessage = _config2.timeoutErrorMessage;
        }
        reject(new AxiosError$1(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config3,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(_config2.withCredentials)) {
        request.withCredentials = !!_config2.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config2.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config2.cancelToken || _config2.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError$1(null, config3, request) : cancel);
          request.abort();
          request = null;
        };
        _config2.cancelToken && _config2.cancelToken.subscribe(onCanceled);
        if (_config2.signal) {
          _config2.signal.aborted ? onCanceled() : _config2.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config2.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config3));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$1.asap(unsubscribe);
      return signal;
    }
  };
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  const readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  const readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const { isFunction } = utils$1;
  const globalFetchAPI = (({ Request, Response }) => ({
    Request,
    Response
  }))(utils$1.global);
  const {
    ReadableStream: ReadableStream$1,
    TextEncoder
  } = utils$1.global;
  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  const factory = (env) => {
    env = utils$1.merge.call({
      skipUndefined: true
    }, globalFetchAPI, env);
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
    const isRequestSupported = isFunction(Request);
    const isResponseSupported = isFunction(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const hasContentType = new Request(platform.origin, {
        body: new ReadableStream$1(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = (res, config3) => {
          let method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config3);
        });
      });
    })();
    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }
      if (utils$1.isBlob(body)) {
        return body.size;
      }
      if (utils$1.isSpecCompliantForm(body)) {
        const _request = new Request(platform.origin, {
          method: "POST",
          body
        });
        return (await _request.arrayBuffer()).byteLength;
      }
      if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils$1.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils$1.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };
    const resolveBodyLength = async (headers, body) => {
      const length = utils$1.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    };
    return async (config3) => {
      let {
        url,
        method,
        data,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions
      } = resolveConfig(config3);
      let _fetch = envFetch || fetch;
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
      let request = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
          let _request = new Request(url, {
            method: "POST",
            body: data,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils$1.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        };
        request = isRequestSupported && new Request(url, resolvedOptions);
        let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config3);
        !isStreamResponse && unsubscribe && unsubscribe();
        return await new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders$1.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config: config3,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config3, request),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError$1.from(err, err && err.code, config3, request);
      }
    };
  };
  const seedCache = new Map();
  const getFetch = (config3) => {
    let env = config3 && config3.env || {};
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [
      Request,
      Response,
      fetch2
    ];
    let len = seeds.length, i = len, seed, target, map = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map.get(seed);
      target === void 0 && map.set(seed, target = i ? new Map() : factory(env));
      map = target;
    }
    return target;
  };
  getFetch();
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: {
      get: getFetch
    }
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  function getAdapter$1(adapters2, config3) {
    adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError$1(`Unknown adapter '${id}'`);
        }
      }
      if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config3)))) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError$1(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  }
  const adapters = {
getAdapter: getAdapter$1,
adapters: knownAdapters
  };
  function throwIfCancellationRequested(config3) {
    if (config3.cancelToken) {
      config3.cancelToken.throwIfRequested();
    }
    if (config3.signal && config3.signal.aborted) {
      throw new CanceledError$1(null, config3);
    }
  }
  function dispatchRequest(config3) {
    throwIfCancellationRequested(config3);
    config3.headers = AxiosHeaders$1.from(config3.headers);
    config3.data = transformData.call(
      config3,
      config3.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config3.method) !== -1) {
      config3.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config3.adapter || defaults2.adapter, config3);
    return adapter(config3).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config3);
      response.data = transformData.call(
        config3,
        config3.transformResponse,
        response
      );
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config3);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config3,
            config3.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION$1 = "1.13.2";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version2, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError$1(
          formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
          AxiosError$1.ERR_DEPRECATED
        );
      }
      if (version2 && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version2 + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError$1("option " + opt + " must be " + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  let Axios$1 = class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
async request(configOrUrl, config3) {
      try {
        return await this._request(configOrUrl, config3);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config3) {
      if (typeof configOrUrl === "string") {
        config3 = config3 || {};
        config3.url = configOrUrl;
      } else {
        config3 = configOrUrl || {};
      }
      config3 = mergeConfig$1(this.defaults, config3);
      const { transitional: transitional2, paramsSerializer, headers } = config3;
      if (transitional2 !== void 0) {
        validator.assertOptions(transitional2, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config3.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      if (config3.allowAbsoluteUrls !== void 0) ;
      else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config3.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config3.allowAbsoluteUrls = true;
      }
      validator.assertOptions(config3, {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      }, true);
      config3.method = (config3.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config3.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config3.headers = AxiosHeaders$1.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config3) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config3);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config3;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config3) {
      config3 = mergeConfig$1(this.defaults, config3);
      const fullPath = buildFullPath(config3.baseURL, config3.url, config3.allowAbsoluteUrls);
      return buildURL(fullPath, config3.params, config3.paramsSerializer);
    }
  };
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config3) {
      return this.request(mergeConfig$1(config3 || {}, {
        method,
        url,
        data: (config3 || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config3) {
        return this.request(mergeConfig$1(config3 || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  let CancelToken$1 = class CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config3, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError$1(message, config3, request);
        resolvePromise(token.reason);
      });
    }
throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
static source() {
      let cancel;
      const token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  function spread$1(callback) {
    return function wrap3(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError$1(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode$1 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
    HttpStatusCode$1[value] = key;
  });
  function createInstance(defaultConfig) {
    const context3 = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context3);
    utils$1.extend(instance, Axios$1.prototype, context3, { allOwnKeys: true });
    utils$1.extend(instance, context3, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults2);
  axios.Axios = Axios$1;
  axios.CanceledError = CanceledError$1;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel$1;
  axios.VERSION = VERSION$1;
  axios.toFormData = toFormData$1;
  axios.AxiosError = AxiosError$1;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread$1;
  axios.isAxiosError = isAxiosError$1;
  axios.mergeConfig = mergeConfig$1;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios.default = axios;
  const {
    Axios: Axios2,
    AxiosError,
    CanceledError,
    isCancel,
    CancelToken: CancelToken2,
    VERSION,
    all: all2,
    Cancel,
    isAxiosError,
    spread,
    toFormData,
    AxiosHeaders: AxiosHeaders2,
    HttpStatusCode,
    formToJSON,
    getAdapter,
    mergeConfig
  } = axios;
  const version = "2.5.7";
  let newVersion$1 = "";
  function compareVersions(v1, v2) {
    const p1 = v1.split(".").map(Number);
    const p2 = v2.split(".").map(Number);
    const len = Math.max(p1.length, p2.length);
    for (let i = 0; i < len; i++) {
      const n1 = p1[i] || 0;
      const n2 = p2[i] || 0;
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
    }
    return 0;
  }
  async function checkNewVersion() {
    try {
      const response = await axios.get(
        `https://wplace-livechat.vercel.app/wplace_livechat.user.js?t=${Date.now()}`,
        { responseType: "text" }
      );
      const match = response.data.match(/@version\s+([^\s]+)/i);
      if (!match) return "";
      newVersion$1 = match[1];
      const changelogs = (response.data.match(/\/\/ @changelogs\s+(.*)/g) || []).map((line) => line.replace("// @changelogs", "").trim()).join("");
      if (compareVersions(version, newVersion$1) < 0) {
        return `
        <span 
          class="system-messages" 
          role="alert"
          style="
            font-size: 12px;
            font-weight: 500;
            background: var(--warning-color);
            color: var(--on-background-color);
            padding: 2px 5px;
            border-radius: 5px;
            margin: 2px 0;
            display: inline-block;
          "
        >
          Update Available 
          <strong>${newVersion$1}</strong> 
          <a 
            href="https://wplace-livechat.vercel.app/wplace_livechat.user.js" 
            target="_blank" 
            rel="noopener noreferrer"
            style="
              color: var(--on-background-color);
              text-decoration: underline;
              margin-left: 4px;
            "
          >
            Press Here
          </a>
        </span>
        <span
        class="system-messages"
        role="alert"
          style="
            font-size: 12px;
            font-weight: 500;
            background: var(--gray-color);
            color: var(--on-background-color);
            padding: 2px 5px;
            border-radius: 5px;
            margin: 2px 0;
            display: inline-block;"
        >
        ${changelogs}
        </span>
      `;
      }
      return "";
    } catch (error) {
      console.error("[LiveChat System] Failed to check for updates", error);
      return "";
    }
  }
  const newVersion = await( checkNewVersion());
  gsapWithCSS.registerPlugin(Draggable);
  const fab = document.createElement("button");
  fab.className = "livechat-fab";
  const fabIcon = document.createElement("i");
  fabIcon.className = "material-icons";
  fabIcon.textContent = "chat";
  fab.appendChild(fabIcon);
  const notificationDot = document.createElement("span");
  notificationDot.className = "notification-dot";
  fab.appendChild(notificationDot);
  fab.style.display = "flex";
  fab.style.visibility = "visible";
  fab.style.opacity = "1";
  const ensureFABVisible = () => {
    if (fab && document.body.contains(fab)) {
      fab.style.display = "flex";
      fab.style.visibility = "visible";
      fab.style.opacity = "1";
    } else if (fab) {
      document.body.appendChild(fab);
    }
  };
  setInterval(ensureFABVisible, 1e4);
  Draggable.create(fab, {
    bounds: "body",
    allowEventDefault: true,
    force3D: true,
    inertia: true,
    cursor: "grab",
    zIndexBoost: false,
    onPress: function() {
      this.vars.cursor = "grabbing";
    },
    onRelease: function() {
      this.vars.cursor = "grab";
    }
  });
  const modal = document.createElement("div");
  modal.className = "livechat-modal";
  modal.innerHTML = `
    <div class="livechat-content">
        <div class="livechat-header">
            <div class="livechat-header-main">
                <div class="livechat-user-info" id="userInfo">
                    <h3><i class="material-icons">person</i> Loading...</h3>
                    <div class="livechat-user-details"><i class="material-icons">place</i> Region: ...</div>
                </div>
                    <div class="livechat-header-actions">
                        <button class="livechat-blocked-user-btn" style="display: none;"><i class="material-icons">person_off</i></button>
                        <button class="livechat-moderation-btn" style="display: none;"><i class="material-icons">shield</i></button>
                        <button class="livechat-settings-btn"><i class="material-icons">settings</i></button>
                        <button class="livechat-close"><i class="material-icons">close</i></button>
                    </div>
            </div>
            ${newVersion}
            <div class="livechat-tabs" id="chatTabs">
                </div>
        </div>
        <div class="livechat-messages" id="region-messages">
            <div class="loading-indicator">
                <div class="m3-progress-bar" style="width: 50%; margin: 0 auto;"></div>
                <div style="margin-top: 8px;">Loading...</div>
            </div>
        </div>
        <div class="livechat-messages" id="alliance-messages" style="display: none;">
             <div class="loading-indicator">
                <div class="m3-progress-bar" style="width: 50%; margin: 0 auto;"></div>
                <div style="margin-top: 8px;">Loading...</div>
            </div>
        </div>
        <div class="livechat-messages" id="global-messages" style="display: none;">
             <div class="loading-indicator">
                <div class="m3-progress-bar" style="width: 50%; margin: 0 auto;"></div>
                <div style="margin-top: 8px;">Loading...</div>
            </div>
        </div>
        ${""}
        <div class="livechat-input-area">
            <div class="livechat-input-wrapper">
                <textarea style="color:#000;" class="livechat-input" placeholder="Type your message..." rows="1" id="chatInput" disabled maxlength="128"></textarea>
            </div>
            <button class="livechat-send" id="sendButton" disabled>
                <i class="material-icons">send</i>
            </button>
        </div>
    </div>
`;
  document.body.appendChild(fab);
  document.body.appendChild(modal);
  const settingsModal = document.createElement("div");
  settingsModal.className = "livechat-settings-modal";
  settingsModal.style.display = "none";
  settingsModal.innerHTML = `
    <div class="livechat-settings-content">
        <h4>Chat Settings</h4>
        <label class="setting-item">
            <span>Press Enter to Send</span>
            <div class="m3-switch">
                <input type="checkbox" id="enter-to-send" />
                <div class="m3-switch-track"></div>
                <div class="m3-switch-thumb-container">
                    <div class="m3-switch-thumb"></div>
                </div>
            </div>
        </label>
        <label class="setting-item">
            <span>Lock Chat to Region</span>
            <div class="m3-switch">
                <input type="checkbox" id="lock-chat" />
                <div class="m3-switch-track"></div>
                <div class="m3-switch-thumb-container">
                    <div class="m3-switch-thumb"></div>
                </div>
            </div>
        </label>
        <label class="setting-item">
            <span>Chat Notifications</span>
            <div class="m3-switch">
                <input type="checkbox" id="notifications" />
                <div class="m3-switch-track"></div>
                <div class="m3-switch-thumb-container">
                    <div class="m3-switch-thumb"></div>
                </div>
            </div>
        </label>
        <button class="livechat-settings-close"><i class="material-icons">close</i></button>
    </div>
`;
  document.body.appendChild(settingsModal);
  const moderationModal = document.createElement("div");
  moderationModal.className = "livechat-moderation-modal";
  moderationModal.style.display = "none";
  moderationModal.innerHTML = `
    <div class="livechat-moderation-content">
        <h4>Moderation Panel</h4>
        <div class="moderation-section">
            <h5>Block User</h5>
            <input type="number" id="block-uid" placeholder="User UID" />
            <input type="text" id="block-reason" placeholder="Reason" />
            <label style="font-size:12px; color:var(--on-surface-color);" for="block-expired-at">Expiration Date</label>
            <input type="datetime-local" id="block-expired-at" placeholder="Expiration Date" />
            <button id="block-user-btn">Block User</button>
        </div>
        <div class="moderation-section" id="add-mod-section" style="display: none;">
            <h5>Add Moderator</h5>
            <input type="text" id="mod-uid" placeholder="User UID" />
            <input type="text" id="mod-name" placeholder="User Name" />
            <button id="add-mod-btn">Add Moderator</button>
        </div>
        <button class="livechat-moderation-close"><i class="material-icons">close</i></button>
    </div>
`;
  document.body.appendChild(moderationModal);
  const style = document.createElement("style");
  style.innerHTML = `
    .livechat-blocked-users-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
    }
    .blocked-user-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid #eee;
    }
    .blocked-user-item:last-child {
        border-bottom: none;
    }
    .blocked-user-info {
        flex-grow: 1;
        margin-right: 8px;
    }
    .blocked-user-uid {
        font-weight: bold;
        font-size: 14px;
    }
    .blocked-user-reason {
        font-size: 12px;
        color: #666;
    }
    .blocked-user-date {
        font-size: 11px;
        color: #888;
    }
    .unblock-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #4CAF50;
        padding: 4px;
    }
    .unblock-btn:hover {
        background: #f0f0f0;
        border-radius: 50%;
    }
    .notification-dot {
        position: absolute;
        top: -3px;
        right: -3px;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: red;
        display: none;
        z-index: 10;
    }
`;
  document.head.appendChild(style);
  const blockedUsersModal = document.createElement("div");
  blockedUsersModal.className = "livechat-blocked-users-modal";
  blockedUsersModal.style.display = "none";
  blockedUsersModal.innerHTML = `
    <div class="livechat-blocked-users-content" style="background: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; max-height: 80vh; display: flex; flex-direction: column; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <h4 style="margin-top: 0; margin-bottom: 16px;">Blocked Users</h4>
        <div id="blocked-users-list" class="blocked-users-list" style="overflow-y: auto; flex-grow: 1; border: 1px solid #eee; border-radius: 4px; padding: 8px;">
            <div class="loading-indicator">Loading...</div>
        </div>
        <button class="livechat-blocked-users-close" style="position: absolute; top: 12px; right: 12px; background: none; border: none; cursor: pointer; padding: 4px;"><i class="material-icons">close</i></button>
    </div>
`;
  document.body.appendChild(blockedUsersModal);
  const infoPopup = document.createElement("div");
  infoPopup.className = "livechat-info-popup";
  document.body.appendChild(infoPopup);
  const regionMessages = document.getElementById("region-messages");
  const allianceMessages = document.getElementById("alliance-messages");
  const globalMessages = document.getElementById("global-messages");
  const testMessages = document.getElementById("test-messages");
  const chatInput = document.getElementById("chatInput");
  const sendButton = document.getElementById("sendButton");
  const closeButton = modal.querySelector(".livechat-close");
  const moderationButton = modal.querySelector(".livechat-moderation-btn");
  const blockedUsersBtn = modal.querySelector(".livechat-blocked-user-btn");
  const settingsButton = modal.querySelector(".livechat-settings-btn");
  const settingsCloseButton = settingsModal.querySelector(".livechat-settings-close");
  const enterToSendCheckbox = document.getElementById("enter-to-send");
  const lockChatCheckbox = document.getElementById("lock-chat");
  const notificationsCheckbox = document.getElementById("notifications");
  const userInfo = document.getElementById("userInfo");
  const chatTabs = document.getElementById("chatTabs");
  const moderationCloseButton = moderationModal.querySelector(".livechat-moderation-close");
  const blockUserBtn = moderationModal.querySelector("#block-user-btn");
  moderationModal.querySelector("#block-expired-at");
  const addModBtn = moderationModal.querySelector("#add-mod-btn");
  const addModSection = moderationModal.querySelector("#add-mod-section");
  const blockedUsersCloseButton = blockedUsersModal.querySelector(".livechat-blocked-users-close");
  const blockedUsersList = blockedUsersModal.querySelector("#blocked-users-list");
  let replyToId = null;
  let replyToName = null;
  let replyToMessage = null;
  let isModerator = false;
  let cooldownInterval = null;
  let cooldownRemaining = 0;
  function setReplyTo(id, name, message) {
    replyToId = id;
    replyToName = name;
    replyToMessage = message;
  }
  function setIsModerator(value) {
    isModerator = value;
  }
  function setCooldownInterval(interval) {
    cooldownInterval = interval;
  }
  function setCooldownRemaining(remaining) {
    cooldownRemaining = remaining;
  }
  let isSendingMessage = false;
  function setIsSendingMessage(value) {
    isSendingMessage = value;
  }
  function escapeHTML(str) {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }
  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }
  function formatDateForSeparator(date) {
    const today = new Date();
    const yesterday = new Date(today);
    const locale = navigator.languages?.[0] || navigator.language || "en-US";
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, today)) {
      return "Today";
    }
    if (isSameDay(date, yesterday)) {
      return "Yesterday";
    }
    if (date.getFullYear() !== today.getFullYear()) {
      return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
    }
    return date.toLocaleDateString(locale, { day: "numeric", month: "long" });
  }
  function mergeMessages(cached, fetched) {
    const messageMap = new Map();
    if (cached) {
      cached.forEach((msg) => {
        if (msg.id) messageMap.set(msg.id, msg);
      });
    }
    if (fetched) {
      fetched.forEach((msg) => {
        if (msg.id) messageMap.set(msg.id, msg);
      });
    }
    return Array.from(messageMap.values()).sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }
  function showSystemMessage(message) {
    addMessageToChat("System", message, ( new Date()).toISOString(), false, void 0, void 0, void 0, void 0);
  }
  function validateFutureDate(expDate) {
    const selected = new Date(expDate);
    const now = new Date();
    if (!expDate || isNaN(selected.getTime())) return false;
    return selected > now;
  }
  function addMessageToChat(name, message, timestamp, isOwn = false, uid, replyToId2, replyToName2, replyToMessage2, id, replyToUid, allowHtml = false, isPending = false) {
    const currentChatRoom2 = getCurrentChatRoom();
    let messagesContainer;
    if (currentChatRoom2 === "region") {
      messagesContainer = regionMessages;
    } else if (currentChatRoom2 === "alliance") {
      messagesContainer = allianceMessages;
    } else if (currentChatRoom2 === "test" && testMessages) {
      messagesContainer = testMessages;
    } else {
      messagesContainer = globalMessages;
    }
    const lastElement = messagesContainer.lastElementChild;
    const currentMessageDate = new Date(timestamp);
    let shouldAddSeparator = false;
    if (!lastElement || !lastElement.classList.contains("chat-message")) {
      shouldAddSeparator = true;
    } else {
      const lastTimestamp = lastElement.dataset.timestamp;
      if (lastTimestamp) {
        const lastDate = new Date(lastTimestamp);
        if (!isSameDay(currentMessageDate, lastDate)) {
          shouldAddSeparator = true;
        }
      }
    }
    if (shouldAddSeparator) {
      const separator = document.createElement("div");
      separator.className = "chat-date-separator";
      separator.innerHTML = `<span>${formatDateForSeparator(currentMessageDate)}</span>`;
      messagesContainer.appendChild(separator);
    }
    const lastMessage = messagesContainer.lastElementChild;
    let isConsecutive = false;
    if (lastMessage && lastMessage.classList.contains("chat-message")) {
      const lastSender = lastMessage.dataset.sender;
      const lastUid = lastMessage.dataset.uid;
      if (uid && lastUid) {
        if (uid === lastUid) isConsecutive = true;
      } else if (name === lastSender) {
        isConsecutive = true;
      }
    }
    const messageDiv = document.createElement("div");
    messageDiv.className = "chat-message";
    if (isOwn) {
      messageDiv.classList.add("own");
    }
    if (isConsecutive) {
      messageDiv.classList.add("merged");
    }
    if (isPending) {
      messageDiv.classList.add("message-pending");
    }
    messageDiv.dataset.timestamp = timestamp;
    messageDiv.dataset.sender = name;
    messageDiv.dataset.messageContent = message;
    if (uid) messageDiv.dataset.uid = uid;
    if (id) messageDiv.dataset.id = id;
    if (replyToId2) messageDiv.dataset.replyToId = replyToId2;
    if (replyToUid) messageDiv.dataset.replyToUid = replyToUid;
    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const safeName = escapeHTML(name);
    const label = isOwn ? " (You)" : "";
    const displayName = isOwn ? `${safeName}${label}` : `${safeName}`;
    let authorHtml = `<div class="message-author">${displayName}</div>`;
    if (isConsecutive) {
      authorHtml = "";
    }
    let replyHtml = "";
    if (replyToId2 && replyToName2 && replyToMessage2) {
      const userData2 = getUserData();
      let rName = escapeHTML(replyToName2);
      if (replyToUid && userData2 && replyToUid.toString() === userData2.id.toString()) {
        rName = "You";
      }
      replyHtml = `
            <div class="message-reply">
                <div class="reply-indicator">
                    ${rName}
                </div>
                <div class="reply-content">${escapeHTML(replyToMessage2)}</div>
            </div>
        `;
    }
    messageDiv.innerHTML = `
        ${authorHtml}
        <div class="message-content ${isOwn ? "own" : ""}">
            ${replyHtml}
            ${allowHtml ? message : escapeHTML(message)}
            <div class="message-timestamp">${timeString}</div>
        </div>
        <div class="message-actions">
            <button class="reply-btn" title="Reply to this message">
                <i class="material-icons">reply</i>
            </button>
            ${isModerator ? `
            <button class="mod-btn" title="Moderate User">
                <i class="material-icons">shield</i>
            </button>` : ""}
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv;
  }
  function renderMessageList(messagesContainer, response, chatRoomName, pixelData2) {
    const userData2 = getUserData();
    messagesContainer.innerHTML = "";
    if (response && response.data && response.data.length > 0) {
      response.data.forEach((msg) => {
        const rId = msg.repliedTo ? msg.repliedTo.id : msg.replyToId;
        const rName = msg.repliedTo ? msg.repliedTo.name : msg.replyToName;
        const rMsg = msg.repliedTo ? msg.repliedTo.messages || msg.repliedTo.message : msg.replyToMessage;
        const rUid = msg.repliedTo ? msg.repliedTo.uid : msg.replyToUid;
        addMessageToChat(msg.name, msg.messages, msg.createdAt, msg.uid === userData2.id.toString(), msg.uid, rId, rName, rMsg, msg.id, rUid);
      });
    } else {
      let mainWelcomeText = `Welcome to ${chatRoomName} chat!`;
      let conversationText = "Be the first to start the conversation.";
      if (getCurrentChatRoom() === "region" && pixelData2) {
        const regionData2 = getRegionData();
        if (regionData2 && regionData2.number) {
          mainWelcomeText = `Welcome to ${chatRoomName}#${regionData2.number} Chat!`;
        } else {
          mainWelcomeText = `Welcome to ${chatRoomName} Region chat!`;
        }
        conversationText = `Be the first to start the conversation.`;
      }
      const welcomeMessage = `
            <div><strong>${mainWelcomeText}</strong></div>
            <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">${conversationText}</div>
        `;
      messagesContainer.innerHTML = `
            <div class="info-message">
                <i class="material-icons">chat</i>
                ${welcomeMessage}
            </div>
        `;
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  function renderBlockedUsersList(users) {
    blockedUsersList.innerHTML = "";
    if (!users || users.length === 0) {
      blockedUsersList.innerHTML = '<div style="padding: 16px; text-align: center; color: #888;">No blocked users found.</div>';
      return;
    }
    users.forEach((user) => {
      const item = document.createElement("div");
      item.className = "blocked-user-item";
      const date = new Date(user.expiredAt || user.createdAt);
      const dateString = date.toLocaleString();
      item.innerHTML = `
            <div class="blocked-user-info">
                <div class="blocked-user-uid">UID: ${user.uid}</div>
                <div class="blocked-user-reason">${user.reason ? `Reason: ${escapeHTML(user.reason)}` : "No reason provided"}</div>
                <div class="blocked-user-date">Expires: ${dateString}</div>
            </div>
            <button class="unblock-btn" data-uid="${user.uid}">
                <i class="material-icons">lock_open</i>
            </button>
        `;
      blockedUsersList.appendChild(item);
    });
    const unblockButtons = blockedUsersList.querySelectorAll(".unblock-btn");
    unblockButtons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const target = e.currentTarget;
        const uid = target.dataset.uid;
        if (uid) {
          await unblockUser(uid);
          const updatedUsers = await getBlockedUsers();
          renderBlockedUsersList(updatedUsers);
        }
      });
    });
  }
  function setupMessageActionsListener() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target.closest(".message-content")) {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        const messageContent = target.closest(".message-content");
        const messageDiv = messageContent.closest(".chat-message");
        const actions = messageDiv?.querySelector(".message-actions");
        if (actions) {
          document.querySelectorAll(".message-actions.show").forEach((el) => {
            if (el !== actions) el.classList.remove("show");
          });
          actions.classList.toggle("show");
        }
        return;
      }
      if (!target.closest(".message-actions")) {
        document.querySelectorAll(".message-actions.show").forEach((el) => {
          el.classList.remove("show");
        });
      }
      if (target.classList.contains("reply-btn") || target.closest(".reply-btn")) {
        const replyBtn = target.classList.contains("reply-btn") ? target : target.closest(".reply-btn");
        const messageElement = replyBtn.closest(".chat-message");
        if (messageElement) {
          const name = messageElement.dataset.sender;
          const messageContent = messageElement.dataset.messageContent;
          const uid = messageElement.dataset.uid;
          const msgId = messageElement.dataset.id;
          setReplyTo(msgId || uid || null, name || null, messageContent || null);
          if (chatInput && name) {
            chatInput.placeholder = `Replying to ${name}...`;
            chatInput.focus();
          }
        }
      }
      if (target.classList.contains("mod-btn") || target.closest(".mod-btn")) {
        const modBtn = target.classList.contains("mod-btn") ? target : target.closest(".mod-btn");
        const messageElement = modBtn.closest(".chat-message");
        if (messageElement) {
          const uid = messageElement.dataset.uid;
          const name = messageElement.dataset.sender;
          if (uid) {
            moderationModal.style.display = "flex";
            const blockUid = moderationModal.querySelector("#block-uid");
            const unblockUid = moderationModal.querySelector("#unblock-uid");
            const modUid = moderationModal.querySelector("#mod-uid");
            const modName = moderationModal.querySelector("#mod-name");
            if (blockUid) blockUid.value = uid;
            if (unblockUid) unblockUid.value = uid;
            if (modUid) modUid.value = uid;
            if (modName && name) modName.value = name;
          }
        }
      }
    });
  }
  async function checkModeratorStatus(userId) {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ uid: userId.toString() })
      });
      if (response.ok) {
        const role = await response.text();
        if (role) {
          setIsModerator(true);
          moderationButton.style.display = "flex";
          blockedUsersBtn.style.display = "flex";
          if (role === "super_admin") {
            addModSection.style.display = "block";
          } else {
            addModSection.style.display = "none";
          }
        } else {
          setIsModerator(false);
          moderationButton.style.display = "none";
          blockedUsersBtn.style.display = "none";
        }
      } else {
        setIsModerator(false);
        moderationButton.style.display = "none";
        blockedUsersBtn.style.display = "none";
      }
    } catch (error) {
      console.error("Failed to check moderator status", error);
      setIsModerator(false);
      moderationButton.style.display = "none";
      blockedUsersBtn.style.display = "none";
    }
  }
  async function getBlockedUsers() {
    const userData2 = getUserData();
    if (!userData2) {
      return [];
    }
    try {
      const response = await fetch(`${API_BASE}/moderation/blocked_users`, {
        method: "GET",
        headers: {
          "uid": userData2.id.toString(),
          "token": "check-status"
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      } else {
        if (response.status === 404) {
          const fallbackResponse = await fetch(`${API_BASE}/blocked_user`, {
            method: "GET",
            headers: {
              "uid": userData2.id.toString(),
              "token": "check-status"
            }
          });
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            return data.data || [];
          }
        }
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch blocked users", error);
      return [];
    }
  }
  async function blockUser(uid, reason, expiredAt) {
    const userData2 = getUserData();
    if (!userData2) {
      showSystemMessage("You must be logged in to moderate.");
      return;
    }
    let finalExpiredAt = expiredAt;
    if (!finalExpiredAt) {
      const date = new Date();
      date.setUTCHours(date.getUTCHours() + 1);
      finalExpiredAt = date.toISOString();
    }
    try {
      const response = await fetch(`${API_BASE}/moderation/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "uid": userData2.id.toString(),
          "token": "manual-action"
        },
        body: JSON.stringify({ uid, reason, expired_date: finalExpiredAt })
      });
      const result = await response.json();
      if (result.status === "success") {
        showSystemMessage(`User ${uid} has been blocked.`);
      } else {
        showSystemMessage(`Failed to block user: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      showSystemMessage("Failed to block user: Network error");
    }
  }
  async function unblockUser(uid) {
    const userData2 = getUserData();
    if (!userData2) {
      showSystemMessage("You must be logged in to moderate.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/moderation/unblock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "uid": userData2.id.toString(),
          "token": "manual-action"
        },
        body: JSON.stringify({ uid })
      });
      const result = await response.json();
      if (result.status === "success") {
        showSystemMessage(`User ${uid} has been unblocked.`);
      } else {
        showSystemMessage(`Failed to unblock user: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      showSystemMessage("Failed to unblock user: Network error");
    }
  }
  async function addModerator(uid, name, role) {
    const userData2 = getUserData();
    if (!userData2) {
      showSystemMessage("You must be logged in to moderate.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/moderation/add_mod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "uid": userData2.id.toString(),
          "token": "manual-action"
        },
        body: JSON.stringify({ uid, name, role })
      });
      const result = await response.json();
      if (result.status === "success") {
        showSystemMessage(`User ${name} has been added as a moderator.`);
      } else {
        showSystemMessage(`Failed to add moderator: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      showSystemMessage("Failed to add moderator: Network error");
    }
  }
  const debug = false;
  let eventSource = null;
  function startCooldownDisplay(duration) {
    if (cooldownInterval) clearInterval(cooldownInterval);
    setCooldownRemaining(duration);
    updateUserInfo();
    const interval = setInterval(() => {
      setCooldownRemaining(cooldownRemaining - 1);
      if (cooldownRemaining > 0) {
        updateUserInfo();
      } else {
        clearInterval(interval);
        setCooldownInterval(null);
        setCooldownRemaining(0);
        updateUserInfo();
      }
    }, 1e3);
    setCooldownInterval(interval);
  }
  async function preloadAllianceMessages() {
    const userData2 = getUserData();
    if (!userData2 || !userData2.allianceId) {
      return;
    }
    const chatRoomId = `alliance_${userData2.allianceId}`;
    try {
      const response = await fetchMessages(chatRoomId);
      if (response && response.data) {
        setPreloadedAllianceMessages(response);
        if (debug) ;
      }
    } catch (error) {
    }
  }
  async function initializeUserData() {
    try {
      const userData2 = await fetchAPI("https://backend.wplace.live/me");
      if (userData2) {
        setUserData(userData2);
        if (debug) ;
        checkModeratorStatus(userData2.id);
        if (userData2.allianceId) {
          try {
            const allianceData2 = await fetchAPI(`https://backend.wplace.live/alliance`);
            if (allianceData2) {
              setAllianceData(allianceData2);
              if (debug) ;
              preloadAllianceMessages();
            }
          } catch (error) {
            if (debug) ;
          }
        }
        updateUserInfo();
        return true;
      }
    } catch (error) {
    }
    return false;
  }
  function updateUserInfo() {
    const userData2 = getUserData();
    const regionData2 = getRegionData();
    const allianceData2 = getAllianceData();
    const pixelData2 = getPixelData();
    const currentChatRoom2 = getCurrentChatRoom();
    if (userData2) {
      let regionName = regionData2 ? regionData2.name.split("_")[0] : "No region";
      let allianceName = "";
      let allianceDetails = "";
      if (userData2.allianceId && allianceData2) {
        allianceName = `Alliance: ${allianceData2.name}`;
        let details = [];
        if (allianceData2.members) details.push(`${allianceData2.members} members`);
        if (allianceData2.pixelsPainted) details.push(`${allianceData2.pixelsPainted.toLocaleString()} pixels`);
        if (allianceData2.role) details.push(`Role: ${allianceData2.role}`);
        if (details.length > 0) {
          allianceDetails += `<div class="livechat-user-details"><i class="material-icons">group</i> ${details.join(" &bull; ")}</div>`;
        }
        if (allianceData2.description) {
          allianceDetails += `<div class="livechat-user-details" style="font-style: italic; opacity: 0.8;"><i class="material-icons">info</i> ${allianceData2.description}</div>`;
        }
      } else if (userData2.allianceId) {
        allianceName = `Alliance`;
      }
      let regionDisplay = "";
      if (currentChatRoom2 === "region") {
        if (pixelData2) {
          const line1 = regionData2 && regionData2.number ? `${regionName} #${regionData2.number}` : `${regionName}`;
          regionDisplay = `
                    <div class="livechat-user-details"><i class="material-icons">place</i> ${line1}</div>
                `;
        } else {
          regionDisplay = `<div class="livechat-user-details"><i class="material-icons">place</i> ${regionName}</div>`;
        }
      } else if (currentChatRoom2 === "alliance") {
        regionDisplay = `
                <div class="livechat-user-details"><i class="material-icons">group</i> ${allianceName}</div>
                ${allianceDetails}
            `;
      } else {
        regionDisplay = `
                <div class="livechat-user-details"><i class="material-icons">public</i> Global Chat</div>
            `;
      }
      userInfo.innerHTML = `
            <h3><i class="material-icons">person</i> ${userData2.name} <span style="font-weight: 300; font-size: 14px;">#${userData2.id}</span></h3>
            ${regionDisplay}
            <div style="display:flex;">
            <div style="margin-right:2px" class="game-status">Level ${Math.floor(userData2.level)}</div>
            <div style="margin-right:2px" class="game-status">Droplets ${Math.floor(userData2.droplets)}</div>
            </div>
        `;
      if (cooldownRemaining > 0) {
        const infoIcon = document.getElementById("cooldown-info");
        if (infoIcon) {
          infoIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            infoPopup.textContent = `You can change regions once cooldown.`;
            const rect = infoIcon.getBoundingClientRect();
            infoPopup.style.left = `${rect.left + window.scrollX}px`;
            infoPopup.style.top = `${rect.bottom + window.scrollY + 5}px`;
            infoPopup.classList.add("show");
            setTimeout(() => infoPopup.classList.remove("show"), 3e3);
          });
        }
      }
    } else {
      userInfo.innerHTML = `
            <h3><i class="material-icons">person</i> Loading...</h3>
            <div class="livechat-user-details"><i class="material-icons">place</i> Region: ...</div>
            <div class="game-status">Loading</div>
        `;
    }
    chatTabs.innerHTML = "";
    const globalTab = document.createElement("div");
    globalTab.className = "livechat-tab";
    globalTab.textContent = "Global";
    globalTab.dataset.room = "global";
    if (currentChatRoom2 === "global") globalTab.classList.add("active");
    chatTabs.appendChild(globalTab);
    const regionTab = document.createElement("div");
    regionTab.className = "livechat-tab";
    regionTab.textContent = "Region";
    regionTab.dataset.room = "region";
    if (currentChatRoom2 === "region") regionTab.classList.add("active");
    chatTabs.appendChild(regionTab);
    if (userData2 && userData2.allianceId) {
      const allianceTab = document.createElement("div");
      allianceTab.className = "livechat-tab";
      allianceTab.textContent = "Alliance";
      allianceTab.dataset.room = "alliance";
      if (currentChatRoom2 === "alliance") allianceTab.classList.add("active");
      chatTabs.appendChild(allianceTab);
    }
  }
  async function loadMessages() {
    const userData2 = getUserData();
    const regionData2 = getRegionData();
    const pixelData2 = getPixelData();
    const currentChatRoom2 = getCurrentChatRoom();
    const initialChatRoom = currentChatRoom2;
    let chatRoomId = null;
    let chatRoomName = "";
    let messagesContainer;
    if (currentChatRoom2 === "region") {
      messagesContainer = regionMessages;
    } else if (currentChatRoom2 === "alliance") {
      messagesContainer = allianceMessages;
    } else if (currentChatRoom2 === "test" && testMessages) {
      messagesContainer = testMessages;
    } else {
      messagesContainer = globalMessages;
    }
    if (currentChatRoom2 === "region") {
      if (!regionData2) {
        messagesContainer.innerHTML = `
                <div class="info-message">
                    <i class="material-icons">near_me</i>
                    <div><strong>Tap on a pixel to join a region's chat</strong></div>
                    <div style="font-size: 12px; margin-top: 8px; opacity: 0.75;">Click on any pixel on the canvas to join the regional chat for that area.</div>
                </div>
            `;
        chatInput.disabled = true;
        sendButton.disabled = true;
        return;
      }
      chatRoomId = regionData2.name;
      chatRoomName = regionData2.name.split("_")[0];
    } else if (currentChatRoom2 === "alliance") {
      if (!userData2 || !userData2.allianceId) {
        messagesContainer.innerHTML = `
                <div class="info-message">
                    <i class="material-icons">warning</i>
                    <div><strong>You are not in an alliance.</strong></div>
                </div>
            `;
        chatInput.disabled = true;
        sendButton.disabled = true;
        return;
      }
      chatRoomId = `alliance_${userData2.allianceId}`;
      chatRoomName = "Alliance Chat";
    } else if (currentChatRoom2 === "global") {
      chatRoomId = "global";
      chatRoomName = "Global Chat";
    } else if (currentChatRoom2 === "test") {
      chatRoomId = "test-channel";
      chatRoomName = "Test Chat";
    }
    if (!userData2) {
      messagesContainer.innerHTML = `
            <div class="info-message">
                <i class="material-icons">warning</i>
                <div><strong>Please log in to use chat</strong></div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">You need to be logged in to participate in chat.</div>
            </div>
        `;
      chatInput.disabled = true;
      sendButton.disabled = true;
      return;
    }
    if (chatRoomId && chatRoomId === getDisplayedChatRoomId()) {
      return;
    }
    const cachedMessages = getMessagesFromCache(chatRoomId);
    if (cachedMessages) {
      renderMessageList(messagesContainer, cachedMessages, chatRoomName, pixelData2);
      setDisplayedChatRoomId(chatRoomId);
      chatInput.disabled = false;
      sendButton.disabled = false;
      fetchMessages(chatRoomId).then((response) => {
        if (getCurrentChatRoom() !== initialChatRoom) {
          return;
        }
        if (response && response.data) {
          const currentCache = getMessagesFromCache(chatRoomId);
          const currentData = currentCache ? currentCache.data : [];
          const mergedData = mergeMessages(currentData, response.data);
          const hasChanges = JSON.stringify(currentData) !== JSON.stringify(mergedData);
          if (hasChanges) {
            const newResponse = { ...response, data: mergedData };
            setMessagesInCache(chatRoomId, newResponse);
            renderMessageList(messagesContainer, newResponse, chatRoomName, pixelData2);
          }
        }
      }).catch((err) => {
      });
    } else {
      messagesContainer.innerHTML = `
            <div class="loading-indicator">
                <div class="m3-progress-bar" style="width: 50%; margin: 0 auto;"></div>
                <div style="margin-top: 8px;">Loading...</div>
            </div>`;
      chatInput.disabled = true;
      sendButton.disabled = true;
      try {
        let response;
        const preloadedMessages = getPreloadedAllianceMessages();
        if (currentChatRoom2 === "alliance" && preloadedMessages) {
          if (debug) ;
          response = preloadedMessages;
          setPreloadedAllianceMessages(null);
        } else {
          response = await fetchMessages(chatRoomId);
        }
        if (getCurrentChatRoom() !== initialChatRoom) {
          if (debug) ;
          return;
        }
        setMessagesInCache(chatRoomId, response);
        renderMessageList(messagesContainer, response, chatRoomName, pixelData2);
        setDisplayedChatRoomId(chatRoomId);
        chatInput.disabled = false;
        sendButton.disabled = false;
      } catch (error) {
        setDisplayedChatRoomId(null);
        messagesContainer.innerHTML = `
                <div class="info-message">
                    <i class="material-icons">warning</i>
                    <div><strong>Failed to load messages</strong></div>
                    <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Please check your connection and try again.</div>
                </div>
            `;
        chatInput.disabled = true;
        sendButton.disabled = true;
      }
    }
  }
  function clearReplyState() {
    setReplyTo(null, null, null);
    if (chatInput) {
      chatInput.placeholder = "Type your message...";
    }
  }
  function clearChatInput() {
    if (chatInput) {
      chatInput.value = "";
    }
  }
  async function handleSendMessage() {
    const userData2 = getUserData();
    const regionData2 = getRegionData();
    const currentChatRoom2 = getCurrentChatRoom();
    if (!userData2 || sendButton.disabled) return;
    let chatRoomId = null;
    let messageRegion = null;
    if (currentChatRoom2 === "region") {
      if (!regionData2) {
        return;
      }
      chatRoomId = regionData2.name;
      messageRegion = regionData2.name;
    } else if (currentChatRoom2 === "alliance") {
      if (!userData2.allianceId) {
        return;
      }
      chatRoomId = `alliance_${userData2.allianceId}`;
      messageRegion = chatRoomId;
    } else if (currentChatRoom2 === "global") {
      chatRoomId = "global";
      messageRegion = "global";
    } else if (currentChatRoom2 === "test") {
      chatRoomId = "test-channel";
      messageRegion = "test-channel";
    }
    if (!chatRoomId || !messageRegion) return;
    const message = chatInput.value.trim();
    if (!message) return;
    setIsSendingMessage(true);
    sendButton.disabled = true;
    chatInput.disabled = true;
    sendButton.innerHTML = '<i class="material-icons loading-spinner">sync</i>';
    const tempId = `temp-${Date.now()}`;
    const timestamp = ( new Date()).toISOString();
    const currentReplyToId = replyToId;
    const currentReplyToName = replyToName;
    const currentReplyToMessage = replyToMessage;
    const optimisticMessageDiv = addMessageToChat(
      userData2.name,
      message,
      timestamp,
      true,
      userData2.id.toString(),
      currentReplyToId || void 0,
      currentReplyToName || void 0,
      currentReplyToMessage || void 0,
      tempId,
      void 0,
false,
      true
);
    chatInput.value = "";
    chatInput.style.height = "auto";
    clearReplyState();
    try {
      const response = await sendMessage(userData2.id, userData2.name, message, messageRegion, currentReplyToId);
      if (optimisticMessageDiv && response && response.id) {
        optimisticMessageDiv.classList.remove("message-pending");
        optimisticMessageDiv.dataset.id = response.id;
        if (response.createdAt) {
          optimisticMessageDiv.dataset.timestamp = response.createdAt;
        }
      } else if (optimisticMessageDiv) {
        optimisticMessageDiv.classList.remove("message-pending");
      }
      let countdown = 3;
      sendButton.innerHTML = `<span style="font-size: 14px; font-weight: 500;">${countdown}</span>`;
      chatInput.placeholder = `Please wait ${countdown} seconds...`;
      const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          sendButton.innerHTML = `<span style="font-size: 14px; font-weight: 500;">${countdown}</span>`;
          chatInput.placeholder = `Please wait ${countdown} seconds...`;
        } else {
          clearInterval(interval);
          setIsSendingMessage(false);
          sendButton.disabled = false;
          chatInput.disabled = false;
          sendButton.innerHTML = '<i class="material-icons">send</i>';
          chatInput.placeholder = "Type your message...";
        }
      }, 1e3);
    } catch (error) {
      if (optimisticMessageDiv) {
        optimisticMessageDiv.remove();
      }
      chatInput.value = message;
      if (error && error.status === 401 && error.error) {
        const reason = escapeHTML(error.reason || "No reason provided");
        const expiredAt = escapeHTML(error.expired_at ? new Date(error.expired_at).toLocaleString() : "Never");
        const msg = `You are blocked<br>Reason: ${reason}<br>Expires: ${expiredAt}`;
        addMessageToChat("System", msg, ( new Date()).toISOString(), false, void 0, void 0, void 0, void 0, void 0, void 0, true);
      } else {
        addMessageToChat("System", "Failed to send message. Please try again.", ( new Date()).toISOString(), false, void 0, void 0, void 0, void 0);
      }
      setIsSendingMessage(false);
      sendButton.disabled = false;
      chatInput.disabled = false;
      sendButton.innerHTML = '<i class="material-icons">send</i>';
    }
  }
  function disconnectFromEvents() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }
  function establishSseConnection() {
    disconnectFromEvents();
    const userData2 = getUserData();
    const regionData2 = getRegionData();
    const currentChatRoom2 = getCurrentChatRoom();
    let chatRoomId = null;
    if (currentChatRoom2 === "region") {
      if (!regionData2) return;
      chatRoomId = regionData2.name;
    } else if (currentChatRoom2 === "alliance") {
      if (!userData2 || !userData2.allianceId) return;
      chatRoomId = `alliance_${userData2.allianceId}`;
    } else if (currentChatRoom2 === "global") {
      chatRoomId = "global";
    } else if (currentChatRoom2 === "test") {
      chatRoomId = "test-channel";
    }
    if (chatRoomId && userData2) {
      const currentRoomId = chatRoomId;
      eventSource = connectToEvents(chatRoomId, (newMessage) => {
        if (debug) ;
        if (getSettings().notifications && document.hidden) {
          const shouldNotify = newMessage.region === "test-channel" ? debug : true;
          if (shouldNotify && Notification.permission === "granted") {
            let channelName = newMessage.region;
            if (channelName === "global") channelName = "Global Chat";
            else if (channelName.startsWith("alliance_")) channelName = "Alliance Chat";
            else if (channelName === "test-channel") channelName = "Test Chat";
            else {
              const parts = channelName.split("_");
              if (parts.length > 1 && !isNaN(parts[parts.length - 1])) {
                const num = parts.pop();
                channelName = `${parts.join(" ")} #${num}`;
              } else {
                channelName = channelName.replace(/_/g, " ");
              }
            }
            let bodyText = newMessage.messages;
            if (bodyText.length > 50) {
              bodyText = bodyText.substring(0, 50) + "...";
            }
            new Notification(`${newMessage.name} in ${channelName}`, {
              body: bodyText,
              icon: "https://wplace.live/favicon.ico"
            });
          }
        }
        if (newMessage.region === currentRoomId) {
          if (!modal.classList.contains("show")) {
            notificationDot.style.display = "block";
          }
          const existingMessage = document.querySelector(`.chat-message[data-id="${newMessage.id}"]`);
          if (existingMessage) {
            if (debug) ;
            return;
          }
          if (newMessage.uid === userData2.id.toString()) {
            const pendingMessages = document.querySelectorAll(".chat-message.message-pending");
            for (let i = 0; i < pendingMessages.length; i++) {
              const pm = pendingMessages[i];
              if (pm.dataset.messageContent === newMessage.messages) {
                pm.classList.remove("message-pending");
                pm.dataset.id = newMessage.id;
                pm.dataset.timestamp = newMessage.createdAt;
                return;
              }
            }
          }
          const rId = newMessage.repliedTo ? newMessage.repliedTo.id : newMessage.replyToId;
          const rName = newMessage.repliedTo ? newMessage.repliedTo.name : newMessage.replyToName;
          const rMsg = newMessage.repliedTo ? newMessage.repliedTo.messages || newMessage.repliedTo.message : newMessage.replyToMessage;
          const rUid = newMessage.repliedTo ? newMessage.repliedTo.uid : newMessage.replyToUid;
          addMessageToChat(newMessage.name, newMessage.messages, newMessage.createdAt, newMessage.uid === userData2.id.toString(), newMessage.uid, rId, rName, rMsg, newMessage.id, rUid);
          const cachedResponse = getMessagesFromCache(currentRoomId);
          if (cachedResponse && cachedResponse.data) {
            const newMsgData = {
              name: newMessage.name,
              messages: newMessage.messages,
              createdAt: newMessage.createdAt,
              uid: newMessage.uid
            };
            cachedResponse.data.push(newMsgData);
            setMessagesInCache(currentRoomId, cachedResponse);
            if (debug) ;
          }
        }
      });
    }
  }
  loadSettings();
  const settings = getSettings();
  enterToSendCheckbox.checked = settings.enterToSend;
  lockChatCheckbox.checked = settings.lockChat;
  notificationsCheckbox.checked = settings.notifications;
  setupMessageActionsListener();
  settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "flex";
  });
  settingsCloseButton.addEventListener("click", () => {
    settingsModal.style.display = "none";
  });
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = "none";
    }
  });
  moderationButton.addEventListener("click", () => {
    moderationModal.style.display = "flex";
  });
  moderationCloseButton.addEventListener("click", () => {
    moderationModal.style.display = "none";
  });
  moderationModal.addEventListener("click", (e) => {
    if (e.target === moderationModal) {
      moderationModal.style.display = "none";
    }
  });
  blockedUsersBtn.addEventListener("click", async () => {
    blockedUsersModal.style.display = "flex";
    const users = await getBlockedUsers();
    renderBlockedUsersList(users);
  });
  blockedUsersCloseButton.addEventListener("click", () => {
    blockedUsersModal.style.display = "none";
  });
  blockedUsersModal.addEventListener("click", (e) => {
    if (e.target === blockedUsersModal) {
      blockedUsersModal.style.display = "none";
    }
  });
  blockUserBtn.addEventListener("click", async () => {
    const uidInput = moderationModal.querySelector("#block-uid");
    const reasonInput = moderationModal.querySelector("#block-reason");
    const expiredInput = moderationModal.querySelector("#block-expired-at");
    const uid = uidInput.value.trim().toString();
    const reason = reasonInput.value.trim();
    if (!uid) {
      showSystemMessage("Please enter a UID to block");
      return;
    }
    if (!reason) {
      showSystemMessage("Please enter a reason for blocking");
      return;
    }
    if (validateFutureDate(expiredInput.value) == false) {
      showSystemMessage("Expiration must be a future date & time");
      return;
    }
    let expiredAt = void 0;
    if (expiredInput.value) {
      expiredAt = new Date(expiredInput.value).toISOString();
    }
    await blockUser(uid, reason, expiredAt);
    uidInput.value = "";
    reasonInput.value = "";
    expiredInput.value = "";
  });
  addModBtn.addEventListener("click", async () => {
    const uidInput = moderationModal.querySelector("#mod-uid");
    const nameInput = moderationModal.querySelector("#mod-name");
    const uid = uidInput.value.trim();
    const name = nameInput.value.trim();
    if (!uid || !name) {
      showSystemMessage("Please enter both UID and Name to add a moderator");
      return;
    }
    await addModerator(uid, name, "moderator");
    uidInput.value = "";
    nameInput.value = "";
  });
  enterToSendCheckbox.addEventListener("change", (e) => {
    setSettings({ enterToSend: e.target.checked });
  });
  lockChatCheckbox.addEventListener("change", (e) => {
    setSettings({ lockChat: e.target.checked });
  });
  notificationsCheckbox.addEventListener("change", (e) => {
    const checked = e.target.checked;
    setSettings({ notifications: checked });
    if (checked && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  });
  chatInput.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 80) + "px";
    const count = this.value.length;
    if (count > 128) {
      this.classList.add("input-error");
      sendButton.disabled = true;
    } else {
      this.classList.remove("input-error");
      sendButton.disabled = false;
    }
  });
  function handleTabClick(e) {
    if (isSendingMessage) return;
    const target = e.target;
    if (target.classList.contains("livechat-tab")) {
      const room = target.dataset.room;
      if (room && room !== getCurrentChatRoom()) {
        clearReplyState();
        clearChatInput();
        setCurrentChatRoom(room);
        GM_setValue("wplace-chat-last-room", room);
        if (room === "region") {
          regionMessages.style.display = "block";
          allianceMessages.style.display = "none";
          globalMessages.style.display = "none";
          if (testMessages) testMessages.style.display = "none";
        } else if (room === "alliance") {
          regionMessages.style.display = "none";
          allianceMessages.style.display = "block";
          globalMessages.style.display = "none";
          if (testMessages) testMessages.style.display = "none";
        } else if (room === "test") {
          regionMessages.style.display = "none";
          allianceMessages.style.display = "none";
          globalMessages.style.display = "none";
          if (testMessages) testMessages.style.display = "block";
        } else {
          regionMessages.style.display = "none";
          allianceMessages.style.display = "none";
          globalMessages.style.display = "block";
          if (testMessages) testMessages.style.display = "none";
        }
        updateUserInfo();
        loadMessages();
        establishSseConnection();
      }
    }
  }
  async function handleFabClick() {
    modal.classList.add("show");
    notificationDot.style.display = "none";
    clearAllChatCache();
    const userData2 = getUserData();
    if (!userData2) {
      await initializeUserData();
    }
    let lastRoom = GM_getValue("wplace-chat-last-room", null);
    if (lastRoom === "alliance" && userData2 && userData2.allianceId) {
      setCurrentChatRoom("alliance");
      regionMessages.style.display = "none";
      allianceMessages.style.display = "block";
      globalMessages.style.display = "none";
    } else if (lastRoom === "global") {
      setCurrentChatRoom("global");
      regionMessages.style.display = "none";
      allianceMessages.style.display = "none";
      globalMessages.style.display = "block";
      if (testMessages) testMessages.style.display = "none";
    } else {
      setCurrentChatRoom("region");
      regionMessages.style.display = "block";
      allianceMessages.style.display = "none";
      globalMessages.style.display = "none";
      if (testMessages) testMessages.style.display = "none";
    }
    updateUserInfo();
    await loadMessages();
    establishSseConnection();
  }
  document.addEventListener("regionDataFound", () => {
    if (modal.classList.contains("show")) {
      updateUserInfo();
      loadMessages();
      establishSseConnection();
    }
  });
  document.addEventListener("regionChangeCooldown", (e) => {
    if (modal.classList.contains("show")) {
      startCooldownDisplay(e.detail.remaining);
    }
  });
  fab.addEventListener("click", handleFabClick);
  chatTabs.addEventListener("click", handleTabClick);
  closeButton.addEventListener("click", () => {
    modal.classList.remove("show");
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
  sendButton.addEventListener("click", handleSendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (getSettings().enterToSend && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show") && !e.target.closest(".livechat-input")) {
      modal.classList.remove("show");
    }
  });
  setTimeout(() => {
    clearAllChatCache();
    initializeUserData();
    startDataPolling();
  }, 2e3);

})();