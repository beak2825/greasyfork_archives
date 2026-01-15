// ==UserScript==
// @name         F95Zone Ultimate Enhancer
// @version      4.3.23
// @description  All-in-one F95Zone beast: thread highlighting, custom tags & colors, wide layout, auto-refresh latest, masked-link bypass, image fix, notifs & more
// @author       X Death
// @contributor  Edexal (GM storage, change listener & summarize UI element)
// @match        *://f95zone.to/*
// @match        *://buzzheavier.com/*
// @match        *://trashbytes.net/dl/*
// @match        *://gofile.io/d/*
// @icon         https://f95zone.to/data/avatars/l/1963/1963870.jpg
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @homepageURL  https://f95zone.to/threads/f95zone-latest.250836/
// @supportURL   https://f95zone.to/threads/f95zone-latest.250836/
// @source       https://github.com/Zenix-Al/f95-zone-highlighter
// @namespace https://f95zone.to/threads/f95zone-latest.250836/
// @downloadURL https://update.greasyfork.org/scripts/546518/F95Zone%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/546518/F95Zone%20Ultimate%20Enhancer.meta.js
// ==/UserScript==
// ------------------------------------------------------------
// Built on 2026-01-14 14:20:49 UTC — AUTO-GENERATED, edit from /src and rebuild
// ------------------------------------------------------------
(() => {
  // src/constants.js
  var debug = false;
  var state = {
    modalInjected: false,
    tagsUpdated: false,
    globalSettingsRendered: false,
    colorRendered: false,
    overlayRendered: false,
    threadSettingsRendered: false,
    isThread: false,
    isLatest: false,
    isDownloadPage: false,
    isDirectDownloadPage: false,
    isImgRetryInjected: false,
    isF95Zone: false,
    firstLoad: true,
    isMaskedLink: false,
    isMaskedLinkApplied: false,
    isProcessingTiles: false,
    isCrossTabSyncInitialized: false,
    isDirectDownloadHijackApplied: false,
    isDirectDownloadmsgHandlerApplied: false
  };
  var defaultColors = {
    completed: "#388e3c",
    onhold: "#1976d2",
    abandoned: "#c9a300",
    highVersion: "#2e7d32",
    invalidVersion: "#a38400",
    tileInfo: "#9398a0",
    tileHeader: "#d9d9d9",
    preferred: "#7b1fa2",
    preferredText: "#ffffff",
    excluded: "#b71c1c",
    excludedText: "#ffffff",
    neutral: "#37383a",
    neutralText: "#9398a0"
  };
  var defaultOverlaySettings = {
    completed: true,
    onhold: true,
    abandoned: true,
    highVersion: true,
    invalidVersion: true,
    preferred: true,
    excluded: true,
    overlayText: true
  };
  var defaultThreadSetting = {
    neutral: true,
    preferred: true,
    preferredShadow: true,
    excluded: true,
    excludedShadow: true,
    isWide: false,
    imgRetry: false,
    skipMaskedLink: true,
    collapseSignature: false,
    threadOverlayToggle: true,
    directDownloadLinks: true
  };
  var defaultLatestSettings = {
    autoRefresh: false,
    webNotif: false,
    minVersion: 0.5,
    wideLatest: false,
    denseLatestGrid: false,
    latestOverlayToggle: true
  };
  var metrics = {
    retried: 0,
    succeeded: 0,
    failed: 0,
    avgCache: 0,
    highest: 0,
    lowest: Infinity,
    mean: 0
  };
  var defaultGlobalSettings = {
    configVisibility: true,
    closeNotifOnClick: true,
    enableCrossTabSync: false
  };
  var config = {
    tags: [],
    preferredTags: [],
    excludedTags: [],
    color: [],
    overlaySettings: [],
    threadSettings: [],
    globalSettings: [],
    configVisibility: true,
    minVersion: 0.5,
    latestSettings: [],
    metrics,
    savedNotifID: null,
    processingDownload: false
  };
  var STATUS = Object.freeze({
    PREFERRED: "preferred",
    EXCLUDED: "excluded",
    NEUTRAL: "neutral",
    PREFFERED_SHADOW: "preffered-shadow",
    EXCLUDED_SHADOW: "excluded-shadow"
  });
  var crossTabKeys = {
    color: true,
    overlaySettings: true,
    threadSettings: true,
    latestSettings: true
  };
  var supportedHosts = [
    "buzzheavier.com",
    //"pixeldrain.com", // disabled because not working
    "gofile.io"
    //'mega.nz',
    //'anonfiles.com',
  ];
  var typeDownload = [
    {
      id: "buzzheavier.com",
      type: "iframe"
    },
    {
      id: "gofile.io",
      type: "normal"
    }
  ];
  var supportedDirectDownload = [
    {
      id: "buzzheavier.com",
      host: "trashbytes.net",
      pathStartsWith: "/dl/",
      btn: 'a[hx-get*="/download"]',
      directDownloadLink: /https:\/\/trashbytes\.net\/dl\/[\w-]+(?:\?.+)?/
    },
    {
      id: "gofile.io",
      host: "gofile.io"
    }
    // disabled because not working
    //{
    //  id: "pixeldrain.com",
    //  host: "pixeldrain.com",
    //  pathStartsWith: "/f/",
    //  btn: 'a[href*="/d/"]',
    //  directDownloadLink: /https:\/\/pixeldrain\.com\/d\/[\w-]+(?:\?.+)?/,
    //},
    //other hosts can be added here
  ];
  var cache = /* @__PURE__ */ new Map();
  var colorState = {
    PENDING: { color: "#FFA500" },
    SUCCESS: { color: "#4CAF50" },
    FAILED: { color: "#F44336" }
  };
  var timeoutMS = 8e3;
  var helpMessages = [
    "type /help if you're lost, or just moan really loud",
    "pro tip: don't nut before reading this",
    "i like futa. there, i said it. your turn",
    "this script runs on pure hornyposting energy",
    "close this modal or i'm gonna start describing my strap game",
    "404: chill not found",
    "if you're reading this you're already too deep",
    "send feet pics to continue",
    "bro just edge to the config screen like a normal person",
    "my safe word is 'more'",
    "tag your mom in the next notification",
    "error 69: too much horni detected",
    "i'm not saying step on me but\u2026 step on me",
    "this message will self-destruct after you cum",
    "futa supremacy 2026",
    "why are you still reading? go touch grass\u2026 or yourself",
    "config so clean it deserves to get railed",
    "what's that boring vanilla tags?",
    "you need more futa in your life",
    "if you can read this, you're not horny enough",
    "stay hydrated, stay horny",
    //actual helpful one
    "hover over options text to see detailed settings",
    "overlay colors can be customized in the color settings section",
    "direct download links are available in thread view for supported hosts",
    "not all links are masked",
    "enable cross-tab sync to keep settings consistent across tabs(experimental)",
    "auto-refresh in latest view is just clicking the website own feature",
    "latest notification require auto-refresh enabled",
    "you can add tags to preferred/excluded as much as you want"
  ];

  // src/utils/debugOutput.js
  function debugLog(feature, msg, obj = {}) {
    if (!debug) return;
    console.groupCollapsed(`[${feature}] ${msg}`);
    console.log(msg);
    if (Object.keys(obj).length > 0) {
      console.log(obj);
    }
    console.groupEnd();
  }

  // src/storage/save.js
  async function saveConfigKeys(updates, replace = false) {
    const promises = [];
    for (const [key, value] of Object.entries(updates)) {
      if (replace) {
        promises.push(GM.setValue(key, value));
      } else if (Array.isArray(value)) {
        let current = await GM.getValue(key, []) || [];
        const toAdd = Array.isArray(value) ? value : [value];
        const newList = [...current, ...toAdd.filter((x) => !current.includes(x))];
        promises.push(GM.setValue(key, newList));
      } else {
        promises.push(GM.setValue(key, value));
      }
    }
    await Promise.all(promises);
    debugLog("saveConfigKeys", `Config updated: ${JSON.stringify(updates)}`);
  }
  async function loadData() {
    let parsed = {};
    try {
      parsed = await GM.getValues(Object.keys(config)) ?? {};
    } catch (e) {
      debugLog("loadData", `Error loading data: ${e}`);
      parsed = {};
    }
    const mergeWithDefault = (saved, defaultObj) => {
      if (!saved || typeof saved !== "object") return { ...defaultObj };
      const result2 = { ...defaultObj };
      Object.keys(saved).forEach((key) => {
        if (key in result2) {
          result2[key] = saved[key];
        }
      });
      return result2;
    };
    const result = {
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      preferredTags: Array.isArray(parsed.preferredTags) ? parsed.preferredTags : [],
      excludedTags: Array.isArray(parsed.excludedTags) ? parsed.excludedTags : [],
      color: mergeWithDefault(parsed.color, defaultColors),
      overlaySettings: mergeWithDefault(parsed.overlaySettings, defaultOverlaySettings),
      threadSettings: mergeWithDefault(parsed.threadSettings, defaultThreadSetting),
      latestSettings: mergeWithDefault(parsed.latestSettings, defaultLatestSettings),
      globalSettings: mergeWithDefault(parsed.globalSettings, defaultGlobalSettings),
      // Backward compat: old flat minVersion → migrate to latestSettings
      // (safe even if latestSettings already exists)
      ...typeof parsed.minVersion === "number" && !parsed.latestSettings?.minVersion && {
        latestSettings: {
          ...parsed.latestSettings || defaultLatestSettings,
          minVersion: parsed.minVersion
        }
      },
      metrics: mergeWithDefault(parsed.metrics, metrics),
      savedNotifID: parsed.savedNotifID || null,
      processingDownload: parsed.processingDownload || false
    };
    if (!result.latestSettings.minVersion && result.latestSettings.minVersion !== 0) {
      result.latestSettings.minVersion = 0.5;
    }
    debugLog("loadData", `loadData result:`, result);
    return result;
  }

  // src/storage/migrate.js
  function migrateLatestSettings() {
    let migrated = false;
    if (typeof config.minVersion !== "undefined" && !config.latestSettings) {
      config.latestSettings = {
        autoRefresh: false,
        webNotif: false,
        minVersion: Number(config.minVersion) || 0.5
      };
      delete config.minVersion;
      migrated = true;
    }
    if (config.latestSettings && typeof config.latestSettings.minVersion === "undefined") {
      config.latestSettings.minVersion = 0.5;
      migrated = true;
    }
    const defaults = {
      autoRefresh: false,
      webNotif: false,
      minVersion: 0.5
    };
    let needsSave = false;
    Object.keys(defaults).forEach((key) => {
      if (!(key in config.latestSettings)) {
        config.latestSettings[key] = defaults[key];
        needsSave = true;
      }
    });
    if (migrated || needsSave) {
      saveConfigKeys({ latestSettings: config.latestSettings });
      debugLog("migrateLatestSettings", "Latest settings migrated successfully");
    }
  }

  // src/template/ui.html?raw
  var ui_default = '<div class="modal-content">\r\n  <h2 style="text-align: center">CONFIG</h2>\r\n\r\n  <!-- General -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>General</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="global-settings-container"></div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- Latest page settings -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Latest page settings</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="latest-settings-warning"></div>\r\n        <div id="latest-settings-container"></div>\r\n        <div id="overlay-settings-container"></div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- Thread settings -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Thread settings</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="thread-settings-container"></div>\r\n        <div id="thread-overlay-settings-container"></div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- TAGS -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Tags</summary>\r\n\r\n      <div class="settings-wrapper">\r\n        <div id="tag-error-notif" class="modal-error-notif"></div>\r\n        <div id="tags-container">\r\n          <div id="search-container">\r\n            <input type="text" id="tags-search" placeholder="Search tags..." autocomplete="off" />\r\n            <ul id="search-results"></ul>\r\n            <div id="preffered-tags-list"></div>\r\n            <div id="excluded-tags-list"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- COLORS -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Color</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="color-error-notif" class="modal-error-notif"></div>\r\n\r\n        <div id="color-container"></div>\r\n      </div>\r\n      <div class="centered-item">\r\n        <button id="reset-color" class="modal-btn">Reset color</button>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <div class="modal-footer-hint">\r\n    <span class="hint-text">Hover over options text to see detailed settings</span>\r\n  </div>\r\n  <!-- Close -->\r\n  <div class="centered-item">\r\n    <button id="close-modal" class="modal-btn">\u{1F5D9} Close</button>\r\n  </div>\r\n</div>\r\n';

  // src/template/css.css?raw
  var css_default = ':root {\r\n  --completed-color: #388e3c;\r\n  --onhold-color: #1976d2;\r\n  --abandoned-color: #c9a300;\r\n  --highVersion-color: #2e7d32;\r\n  --invalidVersion-color: #a38400;\r\n  --tileInfo-color: #9398a0;\r\n  --tileHeader-color: #d9d9d9;\r\n  --preferred-color: #7b1fa2;\r\n  --preferred-text-color: #ffffff;\r\n  --excluded-color: #b71c1c;\r\n  --excluded-text-color: #ffffff;\r\n  --neutral-color: #37383a;\r\n  --neutral-text-color: #9398a0;\r\n\r\n  \r\n  --preferred-shadow: 0 0 2px 1px white;\r\n  --excluded-shadow: 0 0 2px 1px white;\r\n}\r\n.modal-error-notif {\r\n  display: none; \r\n  background-color: #ffe5e5; \r\n  color: #b00020; \r\n  border: 1px solid #b00020;\r\n  padding: 12px 16px;\r\n  border-radius: 6px;\r\n  margin-bottom: 12px;\r\n  font-size: 14px;\r\n  font-weight: 500;\r\n}\r\n.preferred {\r\n  background-color: var(--preferred-color);\r\n  font-weight: bold;\r\n  color: var(--preferred-text-color);\r\n}\r\n.preffered-shadow {\r\n  box-shadow: var(--preferred-shadow);\r\n}\r\n.excluded {\r\n  background-color: var(--excluded-color);\r\n  font-weight: bold;\r\n  color: var(--excluded-text-color);\r\n}\r\n.excluded-shadow {\r\n  box-shadow: var(--excluded-shadow);\r\n}\r\n.neutral {\r\n  background-color: var(--neutral-color);\r\n  font-weight: bold;\r\n  color: var(--neutral-text-color);\r\n}\r\n.custom-overlay-reason {\r\n  position: absolute;\r\n  top: 4px;\r\n  left: 4px;\r\n  background: rgba(0, 0, 0, 0.7);\r\n  color: white;\r\n  padding: 2px 6px;\r\n  font-size: 12px;\r\n  border-radius: 4px;\r\n  z-index: 2;\r\n  pointer-events: none;\r\n}\r\n.centered-item {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  padding: 10px;\r\n}\r\n.settings-wrapper {\r\n  padding: 10px;\r\n  color: #ccc;\r\n  font-size: 14px;\r\n  line-height: 1.6;\r\n}\r\ndiv#latest-page_items-wrap_inner\r\n  div.resource-tile\r\n  a.resource-tile_link\r\n  div.resource-tile_info\r\n  div.resource-tile_info-meta {\r\n  color: var(--tileInfo-color);\r\n  font-weight: 600;\r\n}\r\n\r\ndiv#latest-page_items-wrap_inner div.resource-tile a.resource-tile_link {\r\n  color: var(--tileHeader-color);\r\n}\r\n.tag-btn {\r\n  border: none;\r\n  padding: 5px;\r\n  margin: 0 2px;\r\n  cursor: pointer;\r\n  font-size: 14px;\r\n  color: white;\r\n  font-weight: bold;\r\n  transition: background-color 0.2s ease;\r\n}\r\n\r\n.tag-btn.excluded {\r\n  background-color: var(--excluded-color);\r\n  color: var(--excludedText-color);\r\n}\r\n\r\n.tag-btn.preferred {\r\n  background-color: var(--preferred-color);\r\n  color: var(--preferredText-color);\r\n}\r\n\r\n.tag-btn:hover {\r\n  filter: brightness(1.1);\r\n}\r\n#toast-container {\r\n  position: fixed;\r\n  top: 20px;\r\n  left: 50%;\r\n  transform: translateX(-50%);\r\n  z-index: 10000; \r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 8px;\r\n  pointer-events: none;\r\n}\r\n\r\n.toast {\r\n  padding: 10px;\r\n  background-color: #333;\r\n  color: #fff;\r\n  border-radius: 8px;\r\n  opacity: 0;\r\n  transform: translateY(-10px);\r\n  transition:\r\n    opacity 0.3s ease,\r\n    transform 0.3s ease;\r\n}\r\n\r\n.toast.show {\r\n  opacity: 1;\r\n  transform: translateY(0);\r\n}\r\n\r\n#tag-config-modal {\r\n  display: none;\r\n  position: fixed;\r\n  z-index: 9999;\r\n  top: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0, 0, 0, 0.5);\r\n}\r\n\r\n#preffered-tags-list {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 6px;\r\n  margin-top: 8px;\r\n}\r\n\r\n\r\n.preferred-tag-item {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  background-color: var(--preferred-color);\r\n  color: var(--preferredText-color);\r\n  border-radius: 4px;\r\n  font-size: 14px;\r\n  font-weight: bold;\r\n}\r\n\r\n.preferred-tag-item span {\r\n  margin-right: 6px;\r\n  margin-left: 6px;\r\n}\r\n\r\n.preferred-tag-remove {\r\n  background-color: #c15858;\r\n  color: #fff;\r\n  border: none;\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 4px;\r\n\r\n  padding: 10px;\r\n  cursor: pointer;\r\n  font-weight: bold;\r\n  font-size: 12px;\r\n}\r\n\r\n\r\n.tag-actions {\r\n  display: flex;\r\n  gap: 5px;\r\n}\r\n#excluded-tags-list {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 6px;\r\n  margin-top: 8px;\r\n}\r\n#search-container {\r\n  position: relative;\r\n  display: inline-block;\r\n  min-height: 250px;\r\n  width: 100%;\r\n}\r\n\r\n.excluded-tag-item {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  background-color: var(--excluded-color);\r\n  color: var(--excludedText-color);\r\n  border-radius: 4px;\r\n  font-size: 14px;\r\n  font-weight: bold;\r\n}\r\n\r\n.excluded-tag-item span {\r\n  margin-right: 6px;\r\n}\r\n\r\n.excluded-tag-remove {\r\n  background-color: #c15858;\r\n  color: #fff;\r\n  border: none;\r\n  padding: 10px;\r\n  cursor: pointer;\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 4px;\r\n  font-size: 12px;\r\n  font-weight: bold;\r\n}\r\n\r\n\r\n#search-results li {\r\n  padding: 6px 8px;\r\n  cursor: pointer;\r\n  color: #fff;\r\n  background-color: #222;\r\n\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n}\r\n\r\n#search-results li:hover {\r\n  background-color: #333; \r\n}\r\n#tags-search {\r\n  background-color: #222;\r\n  color: #fff;\r\n  border: 1px solid #555;\r\n  border-radius: 4px;\r\n  padding: 6px 8px;\r\n  width: 100%;\r\n}\r\n\r\n#tags-search:focus {\r\n  outline: none;\r\n  border: 1px solid #c15858;\r\n}\r\n#search-results {\r\n  position: absolute;\r\n  left: 0;\r\n  right: 0;\r\n  max-height: 200px;\r\n  overflow-y: auto;\r\n  background-color: #222; \r\n  border: 1px solid #555; \r\n  border-radius: 4px;\r\n  margin: 2px 0 0 0; \r\n  padding: 0;\r\n  list-style: none;\r\n  display: none;\r\n  z-index: 1000;\r\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); \r\n}\r\n\r\n#tag-config-modal input,\r\n#tag-config-modal textarea,\r\n#tag-config-modal select {\r\n  background-color: #222;\r\n  color: #fff;\r\n  border: 1px solid #555;\r\n  border-radius: 4px;\r\n}\r\n#tag-config-modal input:focus,\r\n#tag-config-modal textarea:focus,\r\n#tag-config-modal select:focus {\r\n  outline: none;\r\n  border: 1px solid #c15858;\r\n}\r\n\r\n\r\n#tag-config-modal input[type="checkbox"],\r\n#tag-config-modal input[type="radio"] {\r\n  accent-color: #c15858;\r\n  background-color: #222;\r\n  border: 1px solid #555;\r\n}\r\n#tag-config-modal .config-color-input {\r\n  border: 2px solid #3f4043;\r\n  border-radius: 5px;\r\n  padding: 2px;\r\n  width: 40px;\r\n  height: 28px;\r\n  cursor: pointer;\r\n  background-color: #181a1d;\r\n}\r\n\r\n#tag-config-modal .config-color-input::-webkit-color-swatch-wrapper {\r\n  padding: 0;\r\n}\r\n\r\n#tag-config-modal .config-color-input::-webkit-color-swatch {\r\n  border-radius: 4px;\r\n  border: none;\r\n}\r\n\r\n.modal-btn {\r\n  background-color: #893839;\r\n  color: white;\r\n  border: 2px solid #893839;\r\n  border-radius: 6px;\r\n  padding: 8px 16px;\r\n  font-weight: 600;\r\n  font-size: 14px;\r\n  cursor: pointer;\r\n  transition:\r\n    background-color 0.3s ease,\r\n    border-color 0.3s ease;\r\n  box-shadow: 0 4px 8px rgba(137, 56, 56, 0.5);\r\n}\r\n\r\n.modal-btn:hover {\r\n  background-color: #b94f4f;\r\n  border-color: #b94f4f;\r\n}\r\n\r\n.modal-btn:active {\r\n  background-color: #6e2b2b;\r\n  border-color: #6e2b2b;\r\n  box-shadow: none;\r\n}\r\n.config-row {\r\n  display: flex;\r\n  align-items: center; \r\n  gap: 12px;\r\n  margin: 8px 0;\r\n  line-height: 1.4;\r\n  user-select: none;\r\n}\r\n\r\n\r\n.config-row label {\r\n  flex: 0 0 180px; \r\n  text-align: left;\r\n  font-weight: 500;\r\n  cursor: pointer;\r\n  white-space: nowrap; \r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n\r\n.config-row input[type="checkbox"] {\r\n  flex-shrink: 0;\r\n  width: 18px;\r\n  height: 18px;\r\n  margin: 0;\r\n  cursor: pointer;\r\n  accent-color: #6e42d6; \r\n}\r\n\r\n.config-row:hover {\r\n  background: rgba(110, 66, 214, 0.05);\r\n}\r\n\r\n#tag-config-button {\r\n  position: fixed;\r\n  bottom: 20px;\r\n  right: 20px;\r\n  left: 20px;\r\n  padding: 8px 12px;\r\n  font-size: 20px;\r\n  z-index: 7;\r\n  cursor: pointer;\r\n  border: 2px inset #461616;\r\n  background: #cc3131;\r\n  color: white;\r\n  border-radius: 8px;\r\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\r\n  max-width: 70px;\r\n  width: auto;\r\n  opacity: 0.75;\r\n  transition:\r\n    opacity 1s ease,\r\n    transform 0.5s ease;\r\n}\r\n\r\n#tag-config-button:hover {\r\n  opacity: 1;\r\n}\r\n\r\n#tag-config-button:active {\r\n  transform: scale(0.9);\r\n}\r\n\r\n\r\n#tag-config-button.hidden {\r\n  opacity: 0;\r\n  pointer-events: auto; \r\n  transition: opacity 0.3s ease;\r\n}\r\n\r\n#tag-config-button.hidden:hover {\r\n  opacity: 0.75; \r\n}\r\n\r\n\r\n.blink-hide {\r\n  animation: blink-hidden 0.4s ease-in-out 3;\r\n}\r\n\r\n#tag-config-modal .modal-content {\r\n  background: black;\r\n  border-radius: 10px;\r\n  min-width: 300px;\r\n  max-height: 80vh;\r\n  overflow-y: scroll; \r\n  background: #191b1e;\r\n  max-width: 400px;\r\n  margin: 100px auto;\r\n}\r\n\r\n#tag-config-modal.show {\r\n  display: flex;\r\n}\r\n\r\n.config-list-details {\r\n  overflow: hidden;\r\n  transition:\r\n    border-width 1s,\r\n    max-height 1s ease;\r\n  max-height: 40px;\r\n}\r\n\r\n.config-list-details[open] {\r\n  border-width: 2px;\r\n  max-height: 1300px;\r\n}\r\n.thick-line {\r\n  border: none;\r\n  height: 1px;\r\n  background-color: #3f4043;\r\n}\r\n.config-list-details summary {\r\n  text-align: center;\r\n  background: #353535;\r\n  border-radius: 8px;\r\n  padding-top: 5px;\r\n  padding-bottom: 5px;\r\n  cursor: pointer;\r\n}\r\n\r\n.config-tag-item {\r\n  margin-left: 5px;\r\n  cursor: pointer;\r\n}\r\n\r\n.modal-settings-spacing {\r\n  padding: 10px;\r\n}\r\n.no-max-width {\r\n  max-width: none !important; \r\n}\r\n.config-label:hover {\r\n  text-decoration: underline;\r\n  text-decoration-style: dotted;\r\n}\r\n\r\n\r\n.img-retry-toast {\r\n  position: fixed;\r\n  top: 20px;\r\n  right: 20px;\r\n  background: rgba(0, 0, 0, 0.85);\r\n  color: #fff;\r\n  padding: 10px 15px;\r\n  border-radius: 8px;\r\n  font-family: sans-serif;\r\n  font-size: 13px;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n  z-index: 99999;\r\n  pointer-events: none;\r\n}\r\n\r\n\r\n.img-retry-toast .img-retry-spinner {\r\n  border: 2px solid #fff;\r\n  border-top: 2px solid transparent;\r\n  border-radius: 50%;\r\n  width: 14px;\r\n  height: 14px;\r\n  display: inline-block;\r\n  animation: img-retry-spin 1s linear infinite;\r\n}\r\n\r\n\r\n@keyframes img-retry-spin {\r\n  0% {\r\n    transform: rotate(0deg);\r\n  }\r\n  100% {\r\n    transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n\r\n.img-retry-toast .img-retry-stats {\r\n  margin-left: 10px;\r\n  opacity: 0.8;\r\n}\r\n\r\n\r\n.p-body-inner {\r\n  max-width: 1220px; \r\n  padding-left: 20px;\r\n  padding-right: 20px;\r\n  padding-bottom: 20px;\r\n  padding-top: 20px;\r\n  transition:\r\n    padding-left 0.5s ease,\r\n    padding-right 0.5s ease,\r\n    max-width 0.6s ease;\r\n}\r\n\r\nhtml.latest-wide .p-body-inner {\r\n  padding-left: 0;\r\n  padding-right: 0;\r\n  max-width: none;\r\n}\r\n\r\n\r\nmain#latest-page_main-wrap {\r\n  width: 100%;\r\n  max-width: 1400px;\r\n  margin: 0 auto;\r\n  \r\n  transition: max-width 0.7s ease-out;\r\n  will-change: max-width;\r\n}\r\n\r\nhtml.latest-wide main#latest-page_main-wrap {\r\n  \r\n  max-width: 1430px; \r\n}\r\n\r\n\r\n@media (prefers-reduced-motion: reduce) {\r\n  main#latest-page_main-wrap,\r\n  .p-body-pageContent,\r\n  .structItemContainer {\r\n    transition: none !important;\r\n  }\r\n}\r\n\r\n\r\n.p-body-pageContent,\r\n.structItemContainer {\r\n  \r\n  transition:\r\n    opacity 0.5s ease,\r\n    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);\r\n  opacity: 1;\r\n  transform: scale(1);\r\n}\r\n\r\nhtml.latest-wide .p-body-pageContent,\r\nhtml.latest-wide .structItemContainer {\r\n  \r\n  transform: scale(1.01); \r\n}\r\n\r\n\r\n.hide-notices ul.notices.notices--block.js-notices {\r\n  display: none !important;\r\n}\r\n\r\n\r\n\r\n@media (prefers-reduced-motion: reduce) {\r\n  ul.notices.notices--block.js-notices {\r\n    transition: none !important;\r\n  }\r\n}\r\n.header-scroll .uix_headerContainer {\r\n  transition: transform 0.25s ease;\r\n  will-change: transform;\r\n}\r\n\r\n.header-scroll.header-hidden .uix_headerContainer {\r\n  transform: translateY(-100%);\r\n}\r\n\r\n\r\n.thread-scroll-hide .p-navSticky {\r\n  transition: transform 0.25s ease;\r\n  will-change: transform;\r\n}\r\n\r\n\r\n.thread-scroll-hide .p-navSticky.is-sticky {\r\n  transition: transform 0.25s ease;\r\n  will-change: transform;\r\n}\r\n\r\n.thread-scroll-hide.thread-header-hidden .p-navSticky.is-sticky {\r\n  transform: translateY(-100%);\r\n}\r\n\r\n.config-header {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n\r\n  margin: 14px 0 10px;\r\n  padding: 6px 0;\r\n\r\n  font-size: 0.95em;\r\n  font-weight: 600;\r\n  text-align: center;\r\n\r\n  color: #b0b3b8; \r\n  letter-spacing: 0.04em;\r\n  text-transform: uppercase;\r\n\r\n  user-select: none;\r\n}\r\n\r\n\r\n.grid-normal {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr)); \r\n  gap: 20px; \r\n  \r\n  will-change: gap;\r\n  transition:\r\n    grid-template-columns 0.5s ease,\r\n    gap 0.5s ease;\r\n}\r\n\r\n\r\n.structItem.structItem--latest {\r\n  width: 100%;\r\n  max-width: 33.333%; \r\n  transition:\r\n    max-width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),\r\n     width 0.45s ease-out;\r\n  box-sizing: border-box;\r\n  \r\n  will-change: max-width;\r\n}\r\n\r\n\r\nhtml.latest-dense .structItem.structItem--latest {\r\n  max-width: 260px; \r\n}\r\n\r\n\r\nhtml.latest-dense .grid-normal {\r\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important;\r\n  gap: 10px !important;\r\n}\r\n\r\n\r\nhtml.latest-dense .structItem.structItem--latest {\r\n  max-width: none !important; \r\n  width: 100% !important;\r\n}\r\n\r\n\r\nhtml.latest-dense .structItem-cell.structItem-cell--main {\r\n  padding: 12px !important;\r\n}\r\n\r\n\r\nhtml.latest-signature-collapsed aside.message-signature {\r\n  max-height: 0 !important;\r\n  overflow: hidden !important;\r\n\r\n  padding-top: 0 !important;\r\n  padding-bottom: 0 !important;\r\n  margin-top: 0 !important;\r\n  border-top: none !important;\r\n\r\n  opacity: 0;\r\n  transition:\r\n    max-height 0.25s ease,\r\n    opacity 0.2s ease;\r\n}\r\n\r\n\r\nhtml.latest-signature-collapsed aside.message-signature.latest-signature-expanded {\r\n  max-height: 300px !important;\r\n  overflow-y: auto !important;\r\n\r\n  padding-top: 10px !important;\r\n  padding-bottom: 10px !important;\r\n  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;\r\n\r\n  opacity: 1;\r\n}\r\n\r\n\r\n.latest-signature-toggle {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n\r\n  width: 100%;\r\n  margin: 6px 0 12px;\r\n  padding: 6px 0;\r\n\r\n  border: none;\r\n  border-radius: 0;\r\n  background: transparent;\r\n\r\n  font-size: 1.2rem;\r\n  color: #ec5555;\r\n  cursor: pointer;\r\n\r\n  position: relative;\r\n}\r\n\r\n\r\n.latest-signature-toggle::before,\r\n.latest-signature-toggle::after {\r\n  content: "";\r\n  flex: 1;\r\n  height: 1px;\r\n  background: rgba(255, 255, 255, 0.12);\r\n  margin: 0 10px;\r\n}\r\n\r\n.latest-signature-toggle span {\r\n  white-space: nowrap;\r\n}\r\n\r\n\r\n@media (max-width: 480px) {\r\n  html.latest-signature-collapsed .latest-signature-toggle {\r\n    display: none;\r\n  }\r\n}\r\n@keyframes blink-hidden {\r\n  0% {\r\n    opacity: 1;\r\n  }\r\n  50% {\r\n    opacity: 0;\r\n  }\r\n  100% {\r\n    opacity: 1;\r\n  }\r\n}\r\n\r\n.js-notice {\r\n  position: relative; \r\n  padding-right: 36px; \r\n}\r\n\r\n.js-notice-dismiss-btn {\r\n  position: absolute;\r\n  top: 50%;\r\n  right: 8px; \r\n  transform: translateY(-50%); \r\n\r\n  width: 24px;\r\n  height: 24px;\r\n  border-radius: 50%;\r\n  background: #ec5555;\r\n  color: white;\r\n  font-size: 18px;\r\n  font-weight: bold;\r\n  line-height: 1;\r\n  text-align: center;\r\n  border: none;\r\n  cursor: pointer;\r\n\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n\r\n  transition: all 0.2s ease;\r\n}\r\n\r\n.js-notice-dismiss-btn:hover {\r\n  background: #d43e3e; \r\n  transform: translateY(-50%) scale(1.1);\r\n}\r\n\r\n.js-notice-dismiss-btn:active {\r\n  transform: translateY(-50%) scale(0.95);\r\n}\r\n.modal-footer-hint {\r\n  position: absolute;\r\n  bottom: 12px; \r\n  left: 0;\r\n  right: 0;\r\n  text-align: center;\r\n  padding: 8px 16px;\r\n  font-size: 13px;\r\n  color: #ffffff;\r\n  opacity: 0.7;\r\n  pointer-events: none; \r\n  user-select: none;\r\n  transition: opacity 0.2s ease;\r\n}\r\n\r\n.modal-footer-hint:hover {\r\n  opacity: 1;\r\n  color: #ec5555; \r\n}\r\n\r\n.hint-text {\r\n  background: rgba(0, 0, 0, 0.4); \r\n  padding: 4px 12px;\r\n  border-radius: 12px;\r\n  backdrop-filter: blur(4px); \r\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);\r\n}\r\n';

  // src/cores/safety.js
  function checkTags() {
    const el = document.getElementById("tag-error-notif");
    if (!el) return;
    if (config.tags.length === 0) {
      el.textContent = "No tag detected, go to f95zone latest page and open this menu again.";
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }
  function colorErrorNotif(text) {
    const el = document.getElementById("color-error-notif");
    if (!el) return;
    el.textContent = text;
    if (text) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }
  function tagsErrorNotif(text) {
    const el = document.getElementById("tag-error-notif");
    if (!el) return;
    el.textContent = text;
    if (text) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }
  function checkOverlaySettings() {
    if (!config.latestSettings.latestOverlayToggle && !config.threadSettings.threadOverlayToggle) {
      colorErrorNotif("Both Latest and Thread overlay are disabled, nothing will be applied.");
      tagsErrorNotif("Both Latest and Thread overlay are disabled, nothing will be applied.");
    } else {
      colorErrorNotif("");
      tagsErrorNotif("");
    }
  }

  // src/helper/download/autoRetryDownload.js
  function autoRetryDownload(maxRetries = 99, host = "") {
    let retries = 0;
    let success = false;
    const originalUrl = location.href;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === "A" && (node.hasAttribute("download") || node.href?.startsWith("blob:") || node.href?.includes(".zip") || node.href?.includes(".rar"))) {
            debugLog("autoRetryDownload", `Detected download link on attempt ${retries + 1}`);
            success = true;
            observer.disconnect();
            return;
          }
          if (node.classList?.contains("progress") || node.textContent?.toLowerCase().includes("downloading")) {
            debugLog("autoRetryDownload", `Detected progress UI on attempt ${retries + 1}`);
            success = true;
            observer.disconnect();
            return;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const tryLoad = () => {
      if (success || retries >= maxRetries) {
        observer.disconnect();
        if (success) debugLog("autoRetryDownload", `Download started after ${retries} retries`);
        else debugLog("autoRetryDownload", `Gave up after ${maxRetries} retries`);
        return;
      }
      retries++;
      debugLog("autoRetryDownload", `Attempt ${retries}/${maxRetries} \u2014 ${originalUrl}`);
      GM_xmlhttpRequest({
        method: "HEAD",
        url: originalUrl,
        timeout: 1e4,
        // don't hang forever
        onload: (response) => {
          const status = response.status;
          debugLog("autoRetryDownload", `[HEAD] Status: ${status}`);
          if (status >= 200 && status < 300) {
            debugLog(
              "autoRetryDownload",
              `[HEAD] Server says OK \u2014 waiting for actual download trigger...`
            );
          } else {
            debugLog(
              "autoRetryDownload",
              `[HEAD] Bad status ${status} \u2014 reloading page to retry download`
            );
            location.reload();
          }
        },
        onerror: () => {
          debugLog("autoRetryDownload", "[HEAD] Request error \u2014 reloading page to retry download");
          location.reload();
        },
        ontimeout: () => {
          debugLog("autoRetryDownload", "[HEAD] Timeout \u2014 reloading page to retry download");
          location.reload();
        }
      });
    };
    tryLoad();
    setTimeout(() => {
      if (!success && retries < maxRetries) {
        debugLog("autoRetryDownload", "Timeout waiting for download signal \u2014 forcing retry");
        location.reload();
      }
    }, 6e4);
  }
  function getMatchingDirectDownloadConfig() {
    return supportedDirectDownload.find(
      (conf) => location.hostname.includes(conf.host) && location.pathname.startsWith(conf.pathStartsWith)
    );
  }
  function executeAutoRetry(host) {
    if (host) {
      debugLog(
        "autoRetryDownload",
        `[${host} Auto-Retry] Activated! Let's keep that download pounding...`
      );
      autoRetryDownload(8, host);
    }
  }

  // src/utils/waitFor.js
  function waitFor(conditionFn, interval = 50, timeout = 2e3) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (conditionFn()) {
          resolve(true);
        } else if (Date.now() - start > timeout) {
          reject(new Error("Timeout waiting for condition"));
        } else {
          setTimeout(check, interval);
        }
      };
      check();
    });
  }
  function detectPage() {
    const path = location.pathname;
    if (window.location.hostname.includes("f95zone.to")) {
      state.isF95Zone = true;
    }
    if (path.startsWith("/threads")) {
      state.isThread = true;
    } else if (path.startsWith("/sam/latest_alpha")) {
      state.isLatest = true;
    } else if (path.startsWith("/masked")) {
      state.isMaskedLink = true;
    } else {
      state.isDownloadPage = supportedHosts.find((host) => location.hostname.includes(host));
      state.isDirectDownloadPage = getMatchingDirectDownloadConfig() !== void 0;
    }
    debugLog(
      "PageDetect",
      `isF95Zone: ${state.isF95Zone}, isThread: ${state.isThread}, isLatest: ${state.isLatest}, isMaskedLink: ${state.isMaskedLink}, isDownloadPage: ${state.isDownloadPage}, isDirectDownloadPage: ${state.isDirectDownloadPage}`
    );
  }
  function waitForBody(callback) {
    if (document.body) {
      callback();
    } else {
      requestAnimationFrame(() => waitForBody(callback));
    }
  }

  // src/data/tags.js
  async function updateTags() {
    if (state.tagsUpdated) return;
    const selector = document.querySelector(".selectize-input.items.not-full");
    const dropdown = document.querySelector(".selectize-dropdown.single.filter-tags-select");
    if (!selector || !dropdown) {
      debugLog("Tag Update", "Failed to find selector or dropdown elements");
      return;
    }
    selector.click();
    try {
      await waitFor(() => dropdown.querySelectorAll(".option").length > 0, 50, 3e3);
    } catch (err) {
      debugLog("Tag Update", `"Timeout waiting for options", ${err}`);
      return;
    }
    const options = [...dropdown.querySelectorAll(".option")];
    const newTags = options.map((opt) => ({
      id: parseInt(opt.getAttribute("data-value")),
      name: opt.querySelector(".tag-name")?.textContent.trim() || ""
    }));
    const arraysAreDifferent = !(config.tags.length === newTags.length && config.tags.every(
      (tag, index) => tag.id === newTags[index].id && tag.name === newTags[index].name
    ));
    if (arraysAreDifferent) {
      config.tags = newTags;
      await GM.setValue("tags", config.tags);
      debugLog("Tag Update", `Tags updated: ${JSON.stringify(newTags)}`);
    }
    const validTagIds = new Set(newTags.map((t) => t.id));
    const pruneIds = (list) => Array.isArray(list) ? list.filter((id) => validTagIds.has(id)) : list;
    const newPreferred = pruneIds(config.preferredTags);
    const newExcluded = pruneIds(config.excludedTags);
    const changed = newPreferred.length !== config.preferredTags.length || newExcluded.length !== config.excludedTags.length;
    if (changed) {
      config.preferredTags = newPreferred;
      config.excludedTags = newExcluded;
      saveConfigKeys({
        preferredTags: newPreferred,
        excludedTags: newExcluded
      });
    }
    checkTags();
    state.tagsUpdated = true;
    debugLog("Tag Update", "Finished updating tags");
  }

  // src/helper/download/fileHostHelper.js
  function handleDownload(host) {
    if (window.top === window.self) return;
    if (config.threadSettings.directDownloadLinks === false) return;
    const hostInfo = supportedDirectDownload.find((h) => h.id === host);
    if (!hostInfo) return;
    const btnEl = hostInfo.btn;
    const dlLink = hostInfo.directDownloadLink;
    let exec = () => {
    };
    if (host === "buzzheavier.com") {
      exec = async () => {
        await handleBuzzshare(btnEl, dlLink);
      };
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", exec);
    } else {
      exec();
    }
  }
  async function handleBuzzshare(btnEl, dlLink) {
    function failedDownload() {
      window.parent.postMessage(
        {
          op: "FAILED",
          src: window.location.href,
          dest: null
        },
        "*"
      );
    }
    const btn = document.querySelector(btnEl);
    if (!btn) {
      failedDownload();
      return;
    }
    const endpoint = window.location.origin + btn.getAttribute("hx-get");
    try {
      const res = await fetch(endpoint, {
        headers: {
          "HX-Request": "true",
          "HX-Current-URL": window.location.href
        }
      });
      const text = await res.text();
      const match = text.match(dlLink);
      const header = res.headers.get("HX-Redirect");
      let dest = match ? match[0] : header && header.includes("trashbytes.net") ? header : null;
      if (!dest && res.url.includes("trashbytes.net")) dest = res.url;
      if (dest) {
        window.parent.postMessage(
          {
            op: "BH_RESOLVED",
            src: window.location.href,
            dest: dest.replace(/&amp;/g, "&")
          },
          "*"
        );
      }
      if (document.body.innerText.includes("This file could not be found.")) {
        failedDownload();
        return;
      }
    } catch (e) {
      console.error("[BH-Resolver] Fetch failed", e);
    }
  }

  // src/helper/download/gofile.js
  async function processGofileDownload() {
    if (!config.threadSettings.directDownloadLinks || !config.processingDownload) return;
    const AUTO_CLOSE_DELAY = 6e3;
    const waitForContentReady = (timeout = 2e4) => {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          const loading = document.querySelector("#filemanager_loading");
          const itemsList = document.querySelector("#filemanager_itemslist");
          const isReady = (!loading || getComputedStyle(loading).display === "none") && itemsList && itemsList.children.length > 0;
          if (isReady) {
            debugLog("GofileDownloader", "Content ready \u2014 itemsList has kids now \u{1F525}");
            resolve(true);
            return;
          }
          if (Date.now() - start > timeout) {
            reject(new Error("Timeout waiting for actual content to render \u{1F624}"));
            return;
          }
          setTimeout(check, 400);
        };
        check();
      });
    };
    try {
      debugLog("GofileDownloader", "Starting goFile auto-download process...");
      debugLog("GofileDownloader", "Waiting for loading spinner to fuck off...");
      await waitForContentReady();
      await new Promise((r) => setTimeout(r, 600));
      const alertEl = document.querySelector("#filemanager_alert");
      if (alertEl && getComputedStyle(alertEl).display !== "none") {
        debugLog("GofileDownloader", "Alert visible \u2014 file/folder taken down or restricted");
        alert("This shit got removed or blocked");
        await saveConfigKeys({ processingDownload: false });
        return;
      }
      const itemsList = document.querySelector("#filemanager_itemslist");
      if (!itemsList) {
        throw new Error("No #filemanager_itemslist found \u2014 page layout changed?");
      }
      const itemElements = itemsList.querySelectorAll("[data-item-id]");
      debugLog("GofileDownloader", `Found ${itemElements.length} item(s) with data-item-id`);
      if (itemElements.length === 0) {
        debugLog("GofileDownloader", "No downloadable items found ");
        await saveConfigKeys({ processingDownload: false });
        return;
      }
      if (itemElements.length > 1) {
        debugLog("GofileDownloader", "Multiple files detected \u2014 skipping auto-download for now");
        debugLog("GofileDownloader", "\u2192 Future plan: batch download or picker UI");
        await saveConfigKeys({ processingDownload: false });
        alert("Multiple files detected \u2014 download manually for now.");
        return;
      }
      const contentId = itemElements[0].getAttribute("data-item-id");
      if (!contentId) {
        throw new Error("data-item-id exists but is empty wtf");
      }
      debugLog("GofileDownloader", `Single file locked in: contentId = ${contentId}`);
      if (typeof unsafeWindow.downloadContent !== "function") {
        debugLog("GofileDownloader", "downloadContent is not a function \u2014 site updated?");
        alert("Can't find downloadContent \u2014 page probably changed.");
        await saveConfigKeys({ processingDownload: false });
        return;
      }
      debugLog("GofileDownloader", "Calling downloadContent()... hold tight");
      unsafeWindow.downloadContent(contentId);
      setTimeout(async () => {
        await saveConfigKeys({ processingDownload: false });
        debugLog("GofileDownloader", "Download triggered \u2014 resetting processing flag");
        try {
          debugLog("GofileDownloader", "Trying to auto-close tab... bye bitch");
          window.close();
        } catch (e) {
          console.warn("Close blocked (normal if last tab or not script-opened)", e);
          const msg = document.createElement("div");
          msg.innerHTML = `
          <div style="
            position: fixed; bottom: 20px; right: 20px; 
            background: #ec5555; color: white; 
            padding: 16px 24px; border-radius: 12px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.5); 
            z-index: 99999; font-weight: bold; font-size: 16px;
          ">
            Download started! You can close this tab now 
          </div>
        `;
          document.body.appendChild(msg.firstElementChild);
        }
      }, AUTO_CLOSE_DELAY);
    } catch (err) {
      debugLog("GofileDownloader", `Crashed hard: ${err.message}`);
      alert("Downloader died: " + err.message);
      await saveConfigKeys({ processingDownload: false });
    }
  }

  // src/helper/iframe.js
  function injectFrame(url, options = {}) {
    const {
      visible = false,
      // set true for debugging
      sandbox = "allow-scripts allow-same-origin allow-forms allow-downloads allow-popups",
      removeAfter = 3e4,
      // ms, auto-remove to not leak memory
      onLoad = null,
      onDownloadStart = null
      // optional callback when we detect download started
    } = options;
    const frame = document.createElement("iframe");
    Object.assign(frame.style, {
      position: "absolute",
      left: "-9999px",
      top: "-9999px",
      width: "1px",
      height: "1px",
      opacity: 0,
      pointerEvents: "none",
      border: "none",
      display: visible ? "block" : "none",
      visibility: visible ? "visible" : "hidden"
    });
    frame.setAttribute(
      "sandbox",
      sandbox || "allow-scripts allow-same-origin allow-forms allow-downloads allow-popups allow-modals"
    );
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.src = url;
    frame.onload = () => {
      debugLog("injectFrame", `Iframe loaded: ${url}`);
      if (onLoad) onLoad(frame);
      setTimeout(() => {
        try {
          const innerDoc = frame.contentDocument || frame.contentWindow?.document;
          if (innerDoc?.body?.innerHTML?.includes("download") || innerDoc?.querySelector("a[download]")) {
            debugLog("injectFrame", "Detected download UI inside frame");
            if (onDownloadStart) onDownloadStart();
          }
        } catch (e) {
        }
      }, 1500);
    };
    document.body.appendChild(frame);
    if (removeAfter > 0) {
      setTimeout(() => {
        if (frame.parentNode) {
          frame.parentNode.removeChild(frame);
          debugLog("injectFrame", `Auto-removed iframe after ${removeAfter}ms`);
        }
      }, removeAfter);
    }
    return frame;
  }

  // src/helper/download/openInNewTabHelper.js
  function openInNewTabHelper(url) {
    GM_openInTab(url, {
      active: false,
      // try to keep in background
      insert: true,
      // put at end of tab bar
      setParent: true
      // sometimes helps referrer
    });
  }

  // src/helper/download/hijackDownloadLink.js
  function isSupportedDownloadLink(urlString) {
    if (!urlString) return false;
    let url;
    try {
      url = new URL(urlString);
    } catch (err) {
      debugLog("HijackDownloadLink", `Invalid URL: ${urlString} - ${err}`);
      return false;
    }
    const linkHost = url.hostname.toLowerCase();
    if (linkHost.includes("f95zone.to")) return false;
    if (supportedHosts.some((h) => linkHost.includes(h) || linkHost.endsWith("." + h))) {
      return true;
    }
    if (supportedDirectDownload.some(
      (cfg) => linkHost.includes(cfg.host) || linkHost.endsWith("." + cfg.host)
    )) {
      return true;
    }
    return false;
  }
  function getSupportedLinkType(urlString) {
    if (!urlString) return null;
    let url;
    try {
      url = new URL(urlString);
    } catch {
      return null;
    }
    const linkHost = url.hostname.toLowerCase();
    if (supportedHosts.some((h) => linkHost.includes(h) || linkHost.endsWith("." + h))) {
      if (typeDownload.find((t) => t.id === linkHost)?.type === "iframe") {
        return "iframe";
      }
      return "normal";
    }
    if (supportedDirectDownload.some(
      (cfg) => linkHost.includes(cfg.host) || linkHost.endsWith("." + cfg.host)
    )) {
      return "direct";
    }
    return null;
  }
  var clickHandlerDD = null;
  function hicjackLink() {
    if (state.isDirectDownloadHijackApplied) return;
    state.isDirectDownloadHijackApplied = true;
    function handler(e) {
      const el = e.target.closest("a[href]");
      if (!el) return;
      const url = el.href.trim();
      if (!isSupportedDownloadLink(url)) return;
      debugLog("HijackDownloadLink", `Hijacking download link: ${url}`);
      e.preventDefault();
      const type = getSupportedLinkType(url);
      if (type == "iframe") {
        el.dataset.state = "pending";
        el.style.color = colorState.PENDING.color;
        const frame = injectFrame(url);
        const timer = setTimeout(() => {
          if (el.dataset.state !== "resolved") {
            el.dataset.state = "";
            el.style.color = colorState.FAILED.color;
            if (frame) frame.remove();
            cache.delete(url);
            window.open(url, "_blank");
          }
        }, timeoutMS);
        cache.set(url, { el, frame, timer });
      } else if (type == "direct") {
        showToast("Direct download started...");
        injectFrame(url, { onSuccess: () => showToast("Direct download initiated.") });
        setTimeout(() => {
          showToast("if download not started, open link in new tab.");
          showToast("Feedback appreciated to improve accuracy.");
        }, 8e3);
      } else if (type == "normal") {
        showToast("Processing download in new tab...");
        showToast("you'll alered if download starts or fails");
        saveConfigKeys({ processingDownload: true });
        setInterval(() => {
          saveConfigKeys({ processingDownload: false });
        }, 1e4);
        openInNewTabHelper(url);
      }
    }
    clickHandlerDD = handler;
    document.addEventListener("click", clickHandlerDD, true);
  }
  function disableHijackLink() {
    if (!state.isDirectDownloadHijackApplied) return;
    if (clickHandlerDD) {
      document.removeEventListener("click", clickHandlerDD, true);
      clickHandlerDD = null;
    }
    state.isDirectDownloadHijackApplied = false;
  }
  function toggleDirectDownloadHijack() {
    if (config.threadSettings.directDownloadLinks) {
      hicjackLink();
    } else {
      disableHijackLink();
    }
  }

  // src/helper/download/msgHandler.js
  var clickHandlerDDME = null;
  function handleMsgEvent() {
    if (state.isMsgEventHandlerApplied) return;
    state.isMsgEventHandlerApplied = true;
    function handler({ data }) {
      if (!data) return;
      if (data.op === "FAILED") {
        const { src: src2 } = data;
        const ctx2 = cache.get(src2);
        if (!ctx2) return;
        clearTimeout(ctx2.timer);
        Object.assign(ctx2.el.style, {
          color: colorState.FAILED.color,
          fontWeight: "bold",
          textDecoration: "none"
        });
        showToast("Download failed or file not found, open in new tab.");
        window.open(src2, "_blank");
        if (ctx2.frame) ctx2.frame.remove();
        cache.delete(src2);
        return;
      }
      if (data.op !== "BH_RESOLVED") return;
      const { src, dest } = data;
      const ctx = cache.get(src);
      if (!ctx) return;
      clearTimeout(ctx.timer);
      ctx.el.dataset.state = "resolved";
      if (dest) ctx.el.href = dest;
      Object.assign(ctx.el.style, {
        color: colorState.SUCCESS.color,
        fontWeight: "bold",
        textDecoration: "none"
      });
      if (ctx.frame) ctx.frame.remove();
      cache.delete(src);
      if (dest) {
        showToast("Direct download started...");
        injectFrame(dest, { onSuccess: () => showToast("Direct download initiated.") });
      }
    }
    clickHandlerDDME = handler;
    window.addEventListener("message", clickHandlerDDME);
  }
  function disableMsgEventHandler() {
    if (!state.isMsgEventHandlerApplied) return;
    if (clickHandlerDDME) {
      window.removeEventListener("message", clickHandlerDDME);
    }
    state.isMsgEventHandlerApplied = false;
  }
  function toggleMsgEventHandler() {
    if (config.threadSettings.directDownloadLinks) {
      handleMsgEvent();
    } else {
      disableMsgEventHandler();
    }
  }

  // src/helper/maskedLinkSkipper.js
  function skipMaskedPage() {
    if (!config.threadSettings.skipMaskedLink) return;
    if (!location.pathname.startsWith("/masked/") || location.pathname === "/masked/") return;
    const continueBtn = document.querySelector(".host_link");
    if (continueBtn) {
      continueBtn.click();
      return;
    }
    const $loading = document.getElementById("loading");
    const $captchaDiv = document.getElementById("captcha");
    const $error = document.getElementById("error");
    function handleError(title, message) {
      if ($error) $error.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
      if ($loading) $loading.style.display = "none";
    }
    if ($loading) $loading.style.display = "block";
    function sendRequest(token = "") {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", location.pathname, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.status === "ok") {
                location.href = res.msg;
              } else if (res.status === "captcha") {
                if ($captchaDiv) {
                  $captchaDiv.style.display = "block";
                  grecaptcha.render("captcha", {
                    theme: "dark",
                    sitekey: "6LcwQ5kUAAAAAAI-_CXQtlnhdMjmFDt-MruZ2gov",
                    callback: (t) => {
                      $captchaDiv.style.display = "none";
                      if ($loading) $loading.style.display = "block";
                      sendRequest(t);
                    }
                  });
                }
              } else {
                handleError("Error", res.msg || "Unknown");
              }
            } catch (e) {
              handleError("Bad Response", "Try refreshing");
              console.error("skipMaskedPage parse error:", e);
            }
          } else {
            handleError("Server Error", "Chill and retry");
          }
        }
      };
      xhr.send(`xhr=1&download=1${token ? "&captcha=" + token : ""}`);
    }
    sendRequest();
  }
  var clickHandler = null;
  var auxclickHandler = null;
  function hijackMaskedLinks() {
    if (location.pathname.startsWith("/masked/")) return;
    if (state.isMaskedLinkApplied) return;
    if (!config.threadSettings.skipMaskedLink) return;
    state.isMaskedLinkApplied = true;
    const handler = function(e) {
      if (e.button !== 0 && e.button !== 1) return;
      let link = e.target.closest('a[href^="/masked/"], a[href^="https://f95zone.to/masked/"]');
      if (!link) return;
      let href = link.getAttribute("href");
      if (href.startsWith("/masked/")) {
        href = "https://f95zone.to" + href;
      }
      const path = new URL(href).pathname;
      e.preventDefault();
      e.stopImmediatePropagation();
      showToast("Resolving masked link...");
      link.style.color = "#ffff00";
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://f95zone.to" + path, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          let targetUrl = href;
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.status === "ok" && data.msg) {
                showToast("Masked link resolved.");
                targetUrl = data.msg;
                link.href = targetUrl;
                link.style.color = "#00ff00";
              }
            } catch (_) {
              console.error("hijackMaskedLinks parse error:", _);
            }
          } else {
            link.style.color = "";
          }
          if (config.threadSettings.directDownloadLinks && isSupportedDownloadLink(targetUrl)) {
            const type = getSupportedLinkType(targetUrl);
            if (type === "iframe") {
              injectFrame(targetUrl);
            } else if (type === "direct") {
              showToast("Direct download started...");
              injectFrame(targetUrl, { onSuccess: () => showToast("Direct download initiated.") });
            } else if (type === "normal") {
              saveConfigKeys({ processingDownload: true });
              showToast("Processing download in new tab...");
              showToast("you'll alered if download starts or fails");
              openInNewTabHelper(targetUrl);
            }
          } else {
            showToast("resolving failed, opening link...");
            window.open(targetUrl, "_blank");
          }
        }
      };
      xhr.send("xhr=1&download=1");
    };
    clickHandler = handler;
    auxclickHandler = handler;
    document.addEventListener("click", handler, true);
    document.addEventListener("auxclick", handler, true);
  }
  function disableHijackMaskedLink() {
    if (!state.isMaskedLinkApplied) return;
    if (clickHandler) {
      document.removeEventListener("click", clickHandler, true);
      document.removeEventListener("auxclick", auxclickHandler, true);
      clickHandler = null;
      auxclickHandler = null;
    }
    state.isMaskedLinkApplied = false;
  }
  function toggleHijackMaskedLink() {
    if (config.threadSettings.skipMaskedLink) {
      hijackMaskedLinks();
    } else {
      disableHijackMaskedLink();
    }
  }

  // src/helper/notificationCloser.js
  function initNoticeDismissal() {
    if (!config.globalSettings.closeNotifOnClick) return;
    const notices = document.querySelectorAll(".js-notice");
    notices.forEach((notice) => {
      const id = notice.getAttribute("data-notice-id");
      if (!id) return;
      if (config.savedNotifID === parseInt(id)) {
        collapseNotice(notice);
        return;
      }
      const closeBtn = document.createElement("button");
      closeBtn.innerText = "\xD7";
      closeBtn.className = "js-notice-dismiss-btn";
      notice.appendChild(closeBtn);
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id2 = notice.getAttribute("data-notice-id");
        if (id2) {
          saveConfigKeys({ savedNotifID: parseInt(id2) });
        }
        collapseNotice(notice);
      });
    });
    debugLog("initNoticeDismissal", "Dismissal feature initialized");
  }
  function removeNoticeDismissal() {
    document.querySelectorAll(".js-notice-dismiss-btn").forEach((btn) => btn.remove());
    const notices = document.querySelectorAll(".js-notice");
    notices.forEach((notice) => {
      expandNotice(notice);
    });
    debugLog("removeNoticeDismissal", "Dismissal feature turned off \u2014 close buttons removed");
  }
  function toggleNoticeDismissal() {
    if (config.globalSettings.closeNotifOnClick) {
      initNoticeDismissal();
    } else {
      removeNoticeDismissal();
    }
  }
  function collapseNotice(notice) {
    if (!notice) return;
    if (notice.dataset._collapsed === "1") return;
    const style = window.getComputedStyle(notice);
    const height = notice.scrollHeight;
    const paddingTop = style.paddingTop;
    const paddingBottom = style.paddingBottom;
    const marginBottom = style.marginBottom;
    notice.style.boxSizing = "border-box";
    notice.style.maxHeight = height + "px";
    notice.style.paddingTop = paddingTop;
    notice.style.paddingBottom = paddingBottom;
    notice.style.marginBottom = marginBottom;
    notice.style.overflow = "hidden";
    notice.style.transition = "opacity 0.4s ease-out, max-height 0.45s ease-out, padding 0.4s ease-out, margin 0.4s ease-out";
    notice.offsetHeight;
    notice.style.opacity = "0";
    notice.style.maxHeight = "0";
    notice.style.paddingTop = "0";
    notice.style.paddingBottom = "0";
    notice.style.marginBottom = "0";
    notice.dataset._collapsed = "1";
    const onEnd = (e) => {
      if (e.target !== notice) return;
      notice.style.display = "none";
      notice.style.removeProperty("max-height");
      notice.style.removeProperty("overflow");
      notice.style.removeProperty("transition");
      notice.style.removeProperty("padding-top");
      notice.style.removeProperty("padding-bottom");
      notice.style.removeProperty("margin-bottom");
      notice.style.removeProperty("opacity");
      delete notice.dataset._collapsed;
      notice.removeEventListener("transitionend", onEnd);
    };
    notice.addEventListener("transitionend", onEnd);
  }
  function expandNotice(notice) {
    if (!notice) return;
    notice.style.removeProperty("display");
    notice.style.display = "";
    notice.style.removeProperty("max-height");
    notice.style.removeProperty("overflow");
    notice.style.removeProperty("transition");
    notice.style.removeProperty("padding-top");
    notice.style.removeProperty("padding-bottom");
    notice.style.removeProperty("margin-bottom");
    notice.style.removeProperty("opacity");
    delete notice.dataset._collapsed;
    notice.style.display = "block";
  }

  // src/helper/handleTextColor.js
  function getReadableTextColor(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#181a1d" : "#d9d9d9";
  }
  function getAverageHexColor(hexes) {
    let r = 0, g = 0, b = 0;
    hexes.forEach((hex) => {
      hex = hex.replace("#", "");
      r += parseInt(hex.slice(0, 2), 16);
      g += parseInt(hex.slice(2, 4), 16);
      b += parseInt(hex.slice(4, 6), 16);
    });
    r = Math.round(r / hexes.length);
    g = Math.round(g / hexes.length);
    b = Math.round(b / hexes.length);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  function getTextColorForGradient(gradientStr) {
    const hexes = gradientStr.match(/#([0-9a-f]{6})/gi);
    if (!hexes) return "#ffffff";
    const avg = getAverageHexColor(hexes);
    return getReadableTextColor(avg);
  }

  // src/helper/tileVerifier.js
  function verifyTilesAfterLoad(retryDelay = 2e3, maxRetries = 3) {
    let retries = 0;
    function checkTiles() {
      const tiles = document.getElementsByClassName("resource-tile");
      let hasModified = false;
      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].dataset.modified === "true") {
          hasModified = true;
          break;
        }
      }
      if (!hasModified) {
        console.warn("Tiles not modified yet, forcing manual trigger...");
        processAllTiles();
        retries++;
        if (retries < maxRetries) {
          setTimeout(checkTiles, retryDelay);
        } else {
          console.warn("Reached max retries, stopping verification.");
        }
      }
    }
    setTimeout(checkTiles, retryDelay);
  }

  // src/cores/latest.js
  function watchAndUpdateTiles() {
    const latestUpdateWrapper = document.getElementById("latest-page_items-wrap");
    if (!latestUpdateWrapper) return;
    const mutationObserver = new MutationObserver(() => {
      setTimeout(() => {
        handleWebClick();
      }, 100);
      processAllTiles();
    });
    const options = { childList: true, subtree: true };
    mutationObserver.observe(latestUpdateWrapper, options);
  }
  function processAllTiles(reset = false) {
    if (!config.latestSettings.latestOverlayToggle || !state.isLatest) return;
    const tiles = document.getElementsByClassName("resource-tile");
    if (!tiles.length || state.isProcessingTiles) {
      return;
    }
    state.isProcessingTiles = true;
    for (let i = 0; i < tiles.length; i++) {
      processTile(tiles[i], reset);
    }
    verifyTilesAfterLoad();
    state.isProcessingTiles = false;
  }
  function processTile(tile, reset = false) {
    if (tile.dataset.modified === "true" && !reset) return;
    if (reset) tile.dataset.modified = "";
    let isOverlayApplied = false;
    let colors = [];
    const body = tile.querySelector(".resource-tile_body");
    const versionText = getVersionText(tile);
    const match = versionText.match(/(\d+\.\d+)/);
    const versionNumber = match ? parseFloat(match[1]) : null;
    const isValidKeyword = ["full", "final"].some(
      (valid) => versionText.toLowerCase().includes(valid)
    );
    debugLog(
      "Tile Processing",
      `Version Text: ${versionText}, Version Number: ${versionNumber}, Match: ${match}, Is Valid Keyword: ${isValidKeyword}`
    );
    const labelText = getLabelText(tile);
    const matchedTag = processTag(tile, config.preferredTags);
    const excludedTag = processTag(tile, config.excludedTags);
    debugLog(
      "Tile Processing",
      `Label Text: ${labelText}, Matched Tag: ${matchedTag}, Excluded Tag: ${excludedTag}`
    );
    if (excludedTag && config.overlaySettings.excluded) {
      isOverlayApplied = addOverlayLabel(tile, excludedTag, isOverlayApplied);
      colors.push(config.color.excluded);
    }
    if (matchedTag && config.overlaySettings.preferred) {
      isOverlayApplied = addOverlayLabel(tile, matchedTag, isOverlayApplied);
      colors.push(config.color.preferred);
    }
    if (labelText === "completed" && config.overlaySettings.completed) {
      isOverlayApplied = addOverlayLabel(tile, "Completed", isOverlayApplied);
      colors.push(config.color.completed);
    } else if (labelText === "onhold" && config.overlaySettings.onhold) {
      isOverlayApplied = addOverlayLabel(tile, "On Hold", isOverlayApplied);
      colors.push(config.color.onhold);
    } else if (labelText === "abandoned" && config.overlaySettings.abandoned) {
      isOverlayApplied = addOverlayLabel(tile, "Abandoned", isOverlayApplied);
      colors.push(config.color.abandoned);
    }
    if (config.overlaySettings.highVersion && versionNumber !== null && versionNumber >= config.latestSettings.minVersion || isValidKeyword) {
      isOverlayApplied = addOverlayLabel(tile, "High Version", isOverlayApplied);
      colors.push(config.color.highVersion);
    } else if (versionNumber !== null && versionNumber < config.latestSettings.minVersion && config.overlaySettings.invalidVersion) {
      addOverlayLabel(tile, "Invalid Version", isOverlayApplied);
      colors.push(config.color.invalidVersion);
    }
    body.style.background = "";
    if (colors.length > 0) {
      const gradient = createSegmentedGradient(colors, "45deg");
      body.style.background = gradient;
      const textColor = getTextColorForGradient(gradient);
      body.style.color = textColor;
      const metas = body.querySelectorAll(".resource-tile_info-meta");
      metas.forEach((meta) => {
        meta.style.color = textColor;
        meta.style.fontWeight = "bold";
      });
    }
    tile.dataset.modified = "true";
  }
  function addOverlayLabel(tile, reasonText, isApplied) {
    if (isApplied || !config.overlaySettings.overlayText) {
      if (!config.overlaySettings.overlayText) {
        removeOverlayLabel();
      }
      return true;
    }
    const thumbWrap = tile.querySelector(".resource-tile_thumb-wrap");
    if (!thumbWrap) return false;
    let existingOverlay = thumbWrap.querySelector(".custom-overlay-reason");
    if (!existingOverlay) {
      existingOverlay = document.createElement("div");
      existingOverlay.className = "custom-overlay-reason";
      thumbWrap.prepend(existingOverlay);
    }
    existingOverlay.innerText = reasonText;
    return true;
  }
  function createSegmentedGradient(colors, direction = "to right") {
    if (!Array.isArray(colors) || colors.length === 0) return "";
    if (colors.length === 1) return colors[0];
    const segment = 100 / colors.length;
    return `linear-gradient(${direction}, ` + colors.map((color, i) => {
      const start = (i * segment).toFixed(2);
      const end = ((i + 1) * segment).toFixed(2);
      return `${color} ${start}% ${end}%`;
    }).join(", ") + `)`;
  }
  function removeOverlayLabel() {
    let existingOverlay = document.querySelector(".custom-overlay-reason");
    if (existingOverlay) {
      existingOverlay.remove();
    }
  }
  function getLabelText(tile) {
    const labelWrap = tile.querySelector(".resource-tile_label-wrap_right");
    const labelEl = labelWrap?.querySelector('[class^="label--"]');
    return labelEl?.innerHTML?.toLowerCase().trim() || "";
  }
  function processTag(tile, tags) {
    const tagIds = (tile.getAttribute("data-tags") || "").split(",").map((id) => parseInt(id.trim(), 10)).filter(Number.isFinite);
    debugLog("Tile Processing", `Tag IDs: ${tagIds}`);
    const matchedId = tagIds.find((id) => tags.some((tag) => tag === id));
    debugLog("Tile Processing", `Matched Tag ID: ${matchedId}`);
    if (!matchedId) return false;
    const matchedTag = config.tags.find((tag) => tag.id == matchedId);
    return matchedTag ? matchedTag.name : false;
  }
  function getVersionText(tile) {
    const versionEl = tile.querySelector(".resource-tile_label-version");
    return versionEl?.innerHTML?.toLowerCase().trim() || "";
  }
  function toggleWideLatestPage() {
    const root = document.documentElement;
    if (config.latestSettings.wideLatest) {
      root.classList.add("latest-wide", "hide-notices", "header-scroll");
      enableHeaderScrollBehavior();
    } else {
      root.classList.remove("latest-wide", "hide-notices", "header-scroll");
      disableHeaderScrollBehavior();
    }
  }
  var headerScrollHandler = null;
  function enableHeaderScrollBehavior() {
    if (headerScrollHandler) return;
    let lastScrollY = window.scrollY;
    headerScrollHandler = () => {
      const root = document.documentElement;
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 80) {
        root.classList.add("header-hidden");
      } else {
        root.classList.remove("header-hidden");
      }
      lastScrollY = currentY;
    };
    window.addEventListener("scroll", headerScrollHandler, { passive: true });
  }
  function disableHeaderScrollBehavior() {
    if (!headerScrollHandler) return;
    window.removeEventListener("scroll", headerScrollHandler);
    headerScrollHandler = null;
    document.documentElement.classList.remove("header-hidden");
  }
  function toggleDenseLatestGrid() {
    const root = document.documentElement;
    if (config.latestSettings.denseLatestGrid) {
      root.classList.add("latest-dense");
    } else {
      root.classList.remove("latest-dense");
    }
  }
  function resetAllTiles() {
    if (config.latestSettings.latestOverlayToggle || !state.isLatest) return;
    debugLog("Tile Processing", "Resetting all tiles on Latest Updates page");
    const tiles = document.getElementsByClassName("resource-tile");
    if (!tiles.length) return;
    for (let i = 0; i < tiles.length; i++) {
      resetTile(tiles[i]);
    }
  }
  function resetTile(tile) {
    if (tile.dataset.modified !== "true") return;
    const body = tile.querySelector(".resource-tile_body");
    if (!body) return;
    const overlays = tile.querySelectorAll(".resource-tile_overlay");
    overlays.forEach((overlay) => overlay.remove());
    body.removeAttribute("style");
    const metas = body.querySelectorAll(".resource-tile_info-meta");
    metas.forEach((meta) => meta.removeAttribute("style"));
    tile.dataset.modified = "";
  }
  function autoRefreshClick() {
    const autoRefreshBtn = document.getElementById("controls_auto-refresh");
    if (!autoRefreshBtn) return;
    const selected = autoRefreshBtn.classList.contains("selected");
    if (!selected && config.latestSettings.autoRefresh || selected && !config.latestSettings.autoRefresh) {
      autoRefreshBtn.click();
    }
  }
  function webNotifClick() {
    const webNotifBtn = document.getElementById("controls_notify");
    if (!webNotifBtn) return;
    const selected = webNotifBtn.classList.contains("selected");
    if (!selected && config.latestSettings.webNotif || selected && !config.latestSettings.webNotif) {
      webNotifBtn.click();
    }
  }
  function handleWebClick() {
    autoRefreshClick();
    webNotifClick();
  }

  // src/cores/thread.js
  function processThreadTags() {
    if (!state.isThread || !config.threadSettings.threadOverlayToggle) return;
    const tagList = document.querySelector(".js-tagList");
    if (!tagList) {
      return;
    }
    let tags = tagList.getElementsByClassName("tagItem");
    tags = Array.from(tags);
    tags.forEach((tag) => {
      processThreadTag(tag);
    });
  }
  function processThreadTag(tagElement) {
    const tagName = tagElement.innerHTML.trim();
    const preferredId = config.preferredTags.find(
      (id) => config.tags.find((t) => t.id === id && t.name === tagName)
    );
    const excludedId = config.excludedTags.find(
      (id) => config.tags.find((t) => t.id === id && t.name === tagName)
    );
    Object.values(STATUS).forEach((cls) => tagElement.classList.remove(cls));
    const { preferred, preferredShadow, excluded, excludedShadow, neutral } = config.threadSettings;
    if (preferredId && preferred) {
      tagElement.classList.add(STATUS.PREFERRED);
      preferredShadow && tagElement.classList.add(STATUS.PREFFERED_SHADOW);
      return;
    } else if (excludedId && excluded) {
      tagElement.classList.add(STATUS.EXCLUDED);
      excludedShadow && tagElement.classList.add(STATUS.EXCLUDED_SHADOW);
      return;
    } else if (neutral) {
      tagElement.classList.add(STATUS.NEUTRAL);
    }
  }
  function toggleThreadTagOverlay() {
    if (!state.isThread) return;
    if (config.threadSettings.threadOverlayToggle) {
      processThreadTags();
    } else {
      disableThreadTagOverlay();
    }
  }
  function disableThreadTagOverlay() {
    if (!state.isThread) return;
    const tagList = document.querySelector(".js-tagList");
    if (!tagList) return;
    const tags = tagList.getElementsByClassName("tagItem");
    Array.from(tags).forEach((tag) => {
      Object.values(STATUS).forEach((cls) => {
        tag.classList.remove(cls);
      });
    });
    debugLog("disableThreadTagOverlay", "Thread tag overlay disabled \u2014 tags back to vanilla");
  }
  function signatureCollapse() {
    if (!state.isThread) return;
    const enabled = !!config.threadSettings.collapseSignature;
    const root = document.documentElement;
    root.classList.toggle("latest-signature-collapsed", enabled);
    if (!enabled) {
      cleanup();
      return;
    }
    document.querySelectorAll("aside.message-signature").forEach((sig) => {
      debugLog("Processing signature collapse", sig);
      if (sig.dataset.latestProcessed) return;
      sig.dataset.latestProcessed = "1";
      const btn = document.createElement("button");
      btn.innerHTML = "<span>Show signature</span>";
      btn.className = "latest-signature-toggle";
      btn.type = "button";
      btn.addEventListener("click", () => {
        const expanded = sig.classList.toggle("latest-signature-expanded");
        btn.querySelector("span").textContent = expanded ? "Hide signature" : "Show signature";
      });
      sig.after(btn);
    });
  }
  function cleanup() {
    document.querySelectorAll(".latest-signature-toggle").forEach((b) => b.remove());
    document.querySelectorAll("aside.message-signature").forEach((sig) => {
      delete sig.dataset.latestProcessed;
      sig.classList.remove("latest-signature-expanded");
    });
  }

  // src/helper/createQueuedTask.js
  function createQueuedTask(fn, delay = 100) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
        timer = null;
      }, delay);
    };
  }

  // src/helper/tasksRegistry.js
  var queuedProcessAllTilesReset = createQueuedTask(() => {
    if (!config.latestSettings.latestOverlayToggle || !state.isLatest) return;
    processAllTiles(true);
  }, 100);
  var queuedProcessThreadTags = createQueuedTask(() => {
    if (!state.isThread) return;
    toggleThreadTagOverlay();
  }, 100);
  var queuedUpdateLatestUI = createQueuedTask(() => updateLatestUI());
  var queuedResetAllTiles = createQueuedTask(() => {
    if (!state.isLatest) return;
    resetAllTiles();
    return false;
  });
  var queuedProcessAllTiles = createQueuedTask(() => {
    if (!state.isLatest && !config.latestSettings.latestOverlayToggle) return;
    processAllTiles();
    return false;
  });

  // src/renderer/updateColorStyle.js
  function updateColorStyle(key) {
    if (key && config.color[key] !== void 0) {
      const varName = `--${key}-color`;
      document.documentElement.style.setProperty(varName, config.color[key]);
      debugLog("updateColorStyle", `Updated color for key: ${key} to ${config.color[key]}`);
    } else {
      for (const [k, value] of Object.entries(config.color)) {
        const varName = `--${k}-color`;
        document.documentElement.style.setProperty(varName, value);
        debugLog("updateColorStyle", `Updated color for key: ${k} to ${value}`);
      }
    }
    const preferredShadow = config.threadSettings.preferredShadow ? "0 0 2px 1px white" : "none";
    const excludedShadow = config.threadSettings.excludedShadow ? "0 0 2px 1px white" : "none";
    document.documentElement.style.setProperty("--preferred-shadow", preferredShadow);
    document.documentElement.style.setProperty("--excluded-shadow", excludedShadow);
  }

  // src/meta/colorSettings.js
  var executeBothQueuedTasks = () => {
    queuedProcessAllTilesReset();
    queuedProcessThreadTags();
  };
  function effectCompletedColor() {
    updateColorStyle("completedColor");
    executeBothQueuedTasks();
  }
  function effectOnHoldColor() {
    updateColorStyle("onholdColor");
    executeBothQueuedTasks();
  }
  function effectAbandonedColor() {
    updateColorStyle("abandonedColor");
    executeBothQueuedTasks();
  }
  function effectHighVersionColor() {
    updateColorStyle("highVersionColor");
    executeBothQueuedTasks();
  }
  function effectInvalidVersionColor() {
    updateColorStyle("invalidVersionColor");
    executeBothQueuedTasks();
  }
  function effectTileInfoColor() {
    updateColorStyle("tileInfoColor");
    executeBothQueuedTasks();
  }
  function effectTileHeaderColor() {
    updateColorStyle("tileHeaderColor");
    executeBothQueuedTasks();
  }
  function effectPreferredColor() {
    updateColorStyle("preferredColor");
    executeBothQueuedTasks();
  }
  function effectPreferredTextColor() {
    updateColorStyle("preferredTextColor");
    executeBothQueuedTasks();
  }
  function effectExcludedColor() {
    updateColorStyle("excludedColor");
    executeBothQueuedTasks();
  }
  function effectExcludedTextColor() {
    updateColorStyle("excludedTextColor");
    executeBothQueuedTasks();
  }
  function effectNeutralColor() {
    updateColorStyle("neutralColor");
    executeBothQueuedTasks();
  }
  function effectNeutralTextColor() {
    updateColorStyle("neutralTextColor");
    executeBothQueuedTasks();
  }
  var colorSettingsMeta = {
    completedColor: {
      type: "color",
      text: "Completed",
      config: "color.completed",
      effects: {
        custom: effectCompletedColor,
        toast: () => "Completed color updated"
      }
    },
    onholdColor: {
      type: "color",
      text: "On Hold",
      config: "color.onhold",
      effects: {
        custom: effectOnHoldColor,
        toast: () => "On Hold color updated"
      }
    },
    abandonedColor: {
      type: "color",
      text: "Abandoned",
      config: "color.abandoned",
      effects: {
        custom: effectAbandonedColor,
        toast: () => "Abandoned color updated"
      }
    },
    highVersionColor: {
      type: "color",
      text: "High Version",
      config: "color.highVersion",
      effects: {
        custom: effectHighVersionColor,
        toast: () => "High Version color updated"
      }
    },
    invalidVersionColor: {
      type: "color",
      text: "Invalid Version",
      config: "color.invalidVersion",
      effects: {
        custom: effectInvalidVersionColor,
        toast: () => "Invalid Version color updated"
      }
    },
    tileInfoColor: {
      type: "color",
      text: "Tile Info",
      config: "color.tileInfo",
      effects: {
        custom: effectTileInfoColor,
        toast: () => "Tile Info color updated"
      }
    },
    tileHeaderColor: {
      type: "color",
      text: "Tile Header",
      config: "color.tileHeader",
      effects: {
        custom: effectTileHeaderColor,
        toast: () => "Tile Header color updated"
      }
    },
    preferredColor: {
      type: "color",
      text: "Preferred",
      config: "color.preferred",
      before: "hr",
      effects: {
        custom: effectPreferredColor,
        toast: () => "Preferred color updated"
      }
    },
    preferredTextColor: {
      type: "color",
      text: "Preferred Text",
      config: "color.preferredText",
      effects: {
        custom: effectPreferredTextColor,
        toast: () => "Preferred Text color updated"
      }
    },
    excludedColor: {
      type: "color",
      text: "Excluded",
      config: "color.excluded",
      effects: {
        custom: effectExcludedColor,
        toast: () => "Excluded color updated"
      }
    },
    excludedTextColor: {
      type: "color",
      text: "Excluded Text",
      config: "color.excludedText",
      effects: {
        custom: effectExcludedTextColor,
        toast: () => "Excluded Text color updated"
      }
    },
    neutralColor: {
      type: "color",
      text: "Neutral",
      config: "color.neutral",
      effects: {
        custom: effectNeutralColor,
        toast: () => "Neutral color updated"
      }
    },
    neutralTextColor: {
      type: "color",
      text: "Neutral Text",
      config: "color.neutralText",
      effects: {
        custom: effectNeutralTextColor,
        toast: () => "Neutral Text color updated"
      }
    }
  };

  // src/renderer/applyEffects.js
  function applyEffects(meta, value) {
    if (meta.effects?.toast) {
      showToast(meta.effects.toast(value));
    }
    meta.effects?.custom?.(value);
  }

  // src/meta/overlaySettings.js
  var overlaySettingsMeta = {
    _header_visibility: {
      type: "header",
      text: "Overlay Visibility Settings"
    },
    completed: {
      type: "toggle",
      text: "Completed",
      tooltip: "Show overlay for completed threads",
      config: "overlaySettings.completed",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `Completed ${v ? "enabled" : "disabled"}`
      }
    },
    onhold: {
      type: "toggle",
      text: "On Hold",
      tooltip: "Show overlay for threads on hold",
      config: "overlaySettings.onhold",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `On Hold ${v ? "enabled" : "disabled"}`
      }
    },
    abandoned: {
      type: "toggle",
      text: "Abandoned",
      tooltip: "Show overlay for abandoned threads",
      config: "overlaySettings.abandoned",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `Abandoned ${v ? "enabled" : "disabled"}`
      }
    },
    highVersion: {
      type: "toggle",
      text: "High Version tag",
      tooltip: "Show overlay for game threads with higher version than your set minimum",
      config: "overlaySettings.highVersion",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `High Version ${v ? "enabled" : "disabled"}`
      }
    },
    invalidVersion: {
      type: "toggle",
      text: "Invalid Version tag",
      tooltip: "Show overlay for threads with invalid version format",
      config: "overlaySettings.invalidVersion",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `Invalid Version ${v ? "enabled" : "disabled"}`
      }
    },
    preferred: {
      type: "toggle",
      text: "Preferred",
      tooltip: "Show overlay for threads you've marked as preferred",
      config: "overlaySettings.preferred",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `Preferred ${v ? "enabled" : "disabled"}`
      }
    },
    excluded: {
      type: "toggle",
      text: "Excluded",
      tooltip: "Show overlay for threads you've marked as excluded",
      config: "overlaySettings.excluded",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `Excluded ${v ? "enabled" : "disabled"}`
      }
    },
    overlayText: {
      type: "toggle",
      text: "Text overlay on tiles",
      tooltip: "Display status text directly over the thread thumbnail",
      config: "overlaySettings.overlayText",
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `Overlay Text ${v ? "enabled" : "disabled"}`
      }
    }
  };
  var disabledOverlaySettingsMeta = {
    _header_visibility: {
      type: "header",
      text: "Overlay Settings is Disabled"
    }
  };

  // src/meta/latestSettings.js
  var effectOverlayToggle = () => {
    checkOverlaySettings();
    queuedUpdateLatestUI();
    if (!state.isLatest) return;
    if (!config.latestSettings.latestOverlayToggle) {
      queuedResetAllTiles();
    } else {
      queuedProcessAllTilesReset();
    }
  };
  var latestSettingsMeta = {
    autoRefresh: {
      type: "toggle",
      text: "Auto Refresh",
      tooltip: "Auto activate in site auto refresh for the Latest Updates page",
      config: "latestSettings.autoRefresh",
      effects: {
        custom: () => {
          state.isLatest && handleWebClick();
        },
        toast: (v) => `Auto Refresh ${v ? "enabled" : "disabled"}`
      }
    },
    webNotif: {
      type: "toggle",
      text: "Web Notifications",
      tooltip: "Auto activate in site web notifications for new threads (site might ask for permission)",
      config: "latestSettings.webNotif",
      effects: {
        custom: () => {
          state.isLatest && handleWebClick();
        },
        toast: (v) => `Web Notifications ${v ? "enabled" : "disabled"}`
      }
    },
    minVersion: {
      type: "number",
      text: "Minimum version overlay",
      tooltip: "Show overlay if thread version is below this value (e.g., 0.5 = version 0.5)",
      config: "latestSettings.minVersion",
      input: {
        min: 0,
        step: 0.1
      },
      effects: {
        custom: queuedProcessAllTilesReset,
        toast: (v) => `Min Version set to ${v}`
      }
    },
    wideLatest: {
      type: "toggle",
      text: "Wide Latest Page",
      tooltip: "Remove width limit on the Latest Updates page",
      config: "latestSettings.wideLatest",
      effects: {
        custom: () => {
          state.isLatest && toggleWideLatestPage();
        },
        toast: (v) => `Wide Latest Page ${v ? "enabled" : "disabled"}`
      }
    },
    denseLatestGrid: {
      type: "toggle",
      text: "Dense Latest Grid",
      tooltip: "Reduce spacing between thread tiles on the Latest Updates page",
      config: "latestSettings.denseLatestGrid",
      effects: {
        custom: () => {
          state.isLatest && toggleDenseLatestGrid();
        },
        toast: (v) => `Dense Latest Grid ${v ? "enabled" : "disabled"}`
      }
    },
    latestOverlayToggle: {
      type: "toggle",
      text: "Enable overlay",
      tooltip: "Show thread status overlay on the Latest Updates page",
      config: "latestSettings.latestOverlayToggle",
      effects: {
        custom: effectOverlayToggle,
        toast: (v) => `Latest page overlay ${v ? "enabled" : "disabled"}`
      }
    }
  };

  // src/cores/metrics.js
  function recordSuccess(img, duration, updateToast2) {
    config.metrics.succeeded++;
    config.metrics.avgCache = (config.metrics.avgCache * (config.metrics.succeeded - 1) + duration) / config.metrics.succeeded;
    config.metrics.highest = Math.max(config.metrics.highest, duration);
    config.metrics.lowest = Math.min(config.metrics.lowest, duration);
    config.metrics.mean = (config.metrics.highest + config.metrics.lowest) / 2;
    saveConfigKeys({ metrics: config.metrics });
    if (updateToast2) updateToast2();
  }
  function recordFail(updateToast2) {
    config.metrics.failed++;
    saveConfigKeys({ metrics: config.metrics });
    if (updateToast2) updateToast2();
  }

  // src/utils/notify.js
  function notify(title, body) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") new Notification(title, { body });
      });
    }
  }
  function notifyAllDone() {
    notify("Images Reloaded", "\u2705 All images have finished reloading.");
  }
  function notifyMaxAttempts(max) {
    notify("Reload Warning", `\u26A0\uFE0F Some images failed to reload after ${max} attempts. You may need to refresh.`);
  }

  // src/ui/toast.js
  var isUpdating = false;
  var pendingUpdate = false;
  var imgRetryTimeoutContainer;
  function updateToast(retryingImages, metrics2) {
    const imgRetryToastEl = document.querySelector(".img-retry-toast");
    if (!imgRetryToastEl) return;
    if (isUpdating) {
      pendingUpdate = true;
      return;
    }
    isUpdating = true;
    if (retryingImages.size === 0) {
      imgRetryToastEl.style.display = "none";
    } else {
      imgRetryToastEl.style.display = "flex";
      imgRetryToastEl.querySelector(".img-retry-count").textContent = retryingImages.size;
      imgRetryToastEl.querySelector(".img-retry-plural").textContent = retryingImages.size > 1 ? "s" : "";
      imgRetryToastEl.querySelector(".img-retry-succeeded").textContent = metrics2.succeeded;
      imgRetryToastEl.querySelector(".img-retry-failed").textContent = metrics2.failed;
      imgRetryToastEl.querySelector(".img-retry-avg").textContent = metrics2.avgCache.toFixed(1);
    }
    imgRetryTimeoutContainer = setTimeout(() => {
      isUpdating = false;
      if (pendingUpdate) {
        pendingUpdate = false;
        updateToast(retryingImages, metrics2);
      }
    }, 500);
  }

  // src/cores/retryLogic.js
  var notifInfo = {
    isErrorNotified: false,
    isCompleteNotified: false
  };
  function retryImage(img, start, retryingImages, MAX_ATTEMPTS, RETRY_DELAY) {
    function markDone(success = true, duration = null) {
      retryingImages.delete(img);
      img.dataset.retrying = "false";
      img.dataset.retryAttached = "true";
      if (success) recordSuccess(img, duration, () => updateToast(retryingImages, config.metrics));
      else recordFail(() => updateToast(retryingImages, config.metrics));
      updateToast(retryingImages, config.metrics);
      if (retryingImages.size === 0 && !notifInfo.isCompleteNotified) {
        notifInfo.isCompleteNotified = true;
        notifyAllDone();
      }
    }
    function doRetry(attempt = 0) {
      config.metrics.retried++;
      retryingImages.add(img);
      updateToast(retryingImages, config.metrics);
      img.src = img.dataset.originalSrc + "?retry=" + Date.now();
      setTimeout(() => {
        if (img.complete && img.naturalWidth > 0) {
          const duration = performance.now() - start;
          markDone(true, duration);
          return;
        }
        if (attempt >= MAX_ATTEMPTS && !notifInfo.isErrorNotified) {
          notifInfo.isErrorNotified = true;
          markDone(false);
          notifyMaxAttempts(MAX_ATTEMPTS);
        }
        doRetry(attempt + 1);
      }, RETRY_DELAY);
    }
    doRetry(0);
  }

  // src/template/imgRetryUi.html?raw
  var imgRetryUi_default = '<div id="img-retry-toast" class="img-retry-toast">\r\n  <span class="img-retry-spinner"></span>\r\n  Retrying <span class="img-retry-count">0</span> image<span class="img-retry-plural"></span>...\r\n  <div class="img-retry-stats">\r\n    Success: <span class="img-retry-succeeded">0</span> | Fail:\r\n    <span class="img-retry-failed">0</span> | Avg: <span class="img-retry-avg">0</span> ms\r\n  </div>\r\n</div>\r\n';

  // src/ui/imgRetryUi.js
  function injectUI() {
    if (document.getElementById("img-retry-toast")) return;
    const wrapper = document.createElement("div");
    wrapper.id = "image-retry-toast-wrapper";
    wrapper.innerHTML = imgRetryUi_default;
    document.body.appendChild(wrapper);
    const toastEl = document.getElementById("img-retry-toast");
    if (toastEl) {
      toastEl.style.display = "none";
    }
  }
  function destroyInjectedUI() {
    const wrapper = document.getElementById("image-retry-toast-wrapper");
    if (wrapper) {
      wrapper.remove();
    }
    const toastEl = document.getElementById("img-retry-toast");
    if (toastEl) {
      toastEl.style.display = "none";
      toastEl.remove();
    }
  }

  // src/cores/observer.js
  function observeDom(callback) {
    new MutationObserver(callback).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // src/cores/imageHandler.js
  var domObserver = null;
  function injectImageRepair() {
    if (!config.threadSettings.imgRetry) {
      destroyImageRepair();
      return;
    }
    if (config.isImgRetryInjected) return;
    config.isImgRetryInjected = true;
    const retryingImages = /* @__PURE__ */ new Set();
    function initImageRetry() {
      document.querySelectorAll("img").forEach((img) => handleImage(img, retryingImages));
      updateToast(retryingImages, config.metrics);
    }
    injectUI();
    initImageRetry();
    domObserver = observeDom(initImageRetry);
  }
  function handleImage(img, retryingImages) {
    if (!config.threadSettings.imgRetry || img.dataset.retryAttached || !img.src.startsWith("https://attachments.f95zone.to/")) {
      return;
    }
    img.dataset.originalSrc = img.dataset.originalSrc || img.src;
    const start = performance.now();
    const MAX_ATTEMPTS = 10;
    const RETRY_DELAY = 4e3;
    function handleSuccess() {
      const duration = performance.now() - start;
      retryingImages.delete(img);
      img.dataset.retrying = "false";
      img.dataset.retryAttached = "true";
      recordSuccess(img, duration);
      config.metrics.succeeded++;
      updateToast(retryingImages, config.metrics);
    }
    function handleError() {
      if (img.dataset.retrying !== "true") {
        img.dataset.retrying = "true";
        retryImage(img, start, retryingImages, MAX_ATTEMPTS, RETRY_DELAY);
      }
    }
    if (img.complete) {
      if (img.naturalWidth > 0) handleSuccess();
      else handleError();
    } else {
      img.addEventListener("load", handleSuccess, { once: true });
      img.addEventListener("error", handleError, { once: true });
    }
  }
  function destroyImageRepair() {
    if (!config.isImgRetryInjected) return;
    config.isImgRetryInjected = false;
    destroyInjectedUI();
    if (domObserver) {
      domObserver.disconnect();
      domObserver = null;
    }
  }

  // src/ui/wideForum.js
  function wideForum() {
    if (!state.isThread) return;
    const isWide = !!config.threadSettings.isWide;
    const root = document.documentElement;
    document.querySelectorAll(".p-body-inner").forEach((el) => el.classList.toggle("no-max-width", isWide));
    if (isWide) {
      root.classList.add("thread-scroll-hide");
      enableThreadHeaderScroll();
    } else {
      root.classList.remove("thread-scroll-hide");
      disableThreadHeaderScroll();
    }
  }
  var threadScrollHandler = null;
  function enableThreadHeaderScroll() {
    if (threadScrollHandler) return;
    let lastScrollY = window.scrollY;
    threadScrollHandler = () => {
      const root = document.documentElement;
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 120) {
        root.classList.add("thread-header-hidden");
      } else {
        root.classList.remove("thread-header-hidden");
      }
      lastScrollY = currentY;
    };
    window.addEventListener("scroll", threadScrollHandler, { passive: true });
  }
  function disableThreadHeaderScroll() {
    if (!threadScrollHandler) return;
    window.removeEventListener("scroll", threadScrollHandler);
    threadScrollHandler = null;
    document.documentElement.classList.remove("thread-header-hidden");
  }

  // src/meta/threadSettings.js
  var effectOverlayToggle2 = () => {
    updateThreadUI();
    checkOverlaySettings();
    if (!state.isThread) return;
    queuedProcessThreadTags();
  };
  var threadSettingsMeta = {
    skipMaskedLink: {
      type: "toggle",
      text: "Skip masked link page",
      tooltip: "Automatically bypass the masked link intermediary page when accessing masked links \n support with direct download features",
      config: "threadSettings.skipMaskedLink",
      effects: {
        custom: () => toggleHijackMaskedLink(),
        toast: (v) => `Skip Masked Link ${v ? "enabled" : "disabled"}`
      }
    },
    directDownloadLinks: {
      type: "toggle",
      text: "Direct Download Links",
      tooltip: "Enable direct download links for supported file hosts \n works independently outside of masked links",
      config: "threadSettings.directDownloadLinks",
      effects: {
        custom: () => {
          toggleDirectDownloadHijack();
          toggleMsgEventHandler();
        },
        toast: (v) => `Direct Download Links ${v ? "enabled" : "disabled"}`
      }
    },
    isWide: {
      type: "toggle",
      text: "Wide thread (full width)",
      tooltip: "Remove max-width restriction \u2014 makes thread use full screen width",
      config: "threadSettings.isWide",
      effects: {
        custom: wideForum,
        toast: (v) => `Wide Thread ${v ? "enabled" : "disabled"}`
      }
    },
    imgRetry: {
      type: "toggle",
      text: "Image Retry",
      tooltip: "Enable image retry for broken images in threads",
      config: "threadSettings.imgRetry",
      effects: {
        custom: injectImageRepair,
        toast: (v) => `Image Retry ${v ? "enabled" : "disabled"}`
      }
    },
    collapseableSignatures: {
      type: "toggle",
      text: "Collapsable Signatures",
      tooltip: "Make user signatures collapsable in threads",
      config: "threadSettings.collapseSignature",
      effects: {
        custom: signatureCollapse,
        toast: (v) => `Collapsable Signatures ${v ? "enabled" : "disabled"}`
      }
    },
    threadOverlayToggle: {
      type: "toggle",
      text: "Enable overlay",
      tooltip: "Show thread status overlay on thread pages",
      config: "threadSettings.threadOverlayToggle",
      effects: {
        custom: effectOverlayToggle2,
        toast: (v) => `Thread overlay ${v ? "enabled" : "disabled"}`
      }
    }
  };
  var threadOverlaySettingsMeta = {
    _header_visibility: {
      type: "header",
      text: "Thread Overlay Settings"
    },
    neutral: {
      type: "toggle",
      text: "Show Neutral overlay",
      tooltip: "Display neutral reaction buttons",
      config: "threadSettings.neutral",
      effects: {
        custom: queuedProcessThreadTags,
        toast: (v) => `Neutral ${v ? "enabled" : "disabled"}`
      }
    },
    preferred: {
      type: "toggle",
      text: "Show Preferred overlay",
      tooltip: "Display your preferred (favorited) overlay",
      config: "threadSettings.preferred",
      effects: {
        custom: queuedProcessThreadTags,
        toast: (v) => `Preferred ${v ? "enabled" : "disabled"}`
      }
    },
    preferredShadow: {
      type: "toggle",
      text: "Preferred overlay shadow",
      tooltip: "Add a subtle shadow effect to preferred overlay",
      config: "threadSettings.preferredShadow",
      effects: {
        custom: queuedProcessThreadTags,
        toast: (v) => `Preferred Shadow ${v ? "enabled" : "disabled"}`
      }
    },
    excluded: {
      type: "toggle",
      text: "Show Excluded overlay",
      tooltip: "Show overlay you've excluded",
      config: "threadSettings.excluded",
      effects: {
        custom: queuedProcessThreadTags,
        toast: (v) => `Excluded ${v ? "enabled" : "disabled"}`
      }
    },
    excludedShadow: {
      type: "toggle",
      text: "Show excluded overlay shadow",
      tooltip: "Add shadow to excluded overlay",
      config: "threadSettings.excludedShadow",
      effects: {
        custom: queuedProcessThreadTags,
        toast: (v) => `Excluded Shadow ${v ? "enabled" : "disabled"}`
      }
    }
  };
  var disabledThreadOverlayMeta = {
    _header_visibility: {
      type: "header",
      text: "Thread Overlay is disabled"
    }
  };

  // src/meta/metaRegistry.js
  var metaRegistry = {
    overlaySettings: overlaySettingsMeta,
    color: colorSettingsMeta,
    latestSettings: latestSettingsMeta,
    threadSettings: threadSettingsMeta
  };

  // src/storage/crossTabSync.js
  function initCrossTabSync() {
    Object.keys(crossTabKeys).forEach((key) => {
      GM_addValueChangeListener(key, (name, oldVal, newVal, remote) => {
        if (!remote) return;
        if (!config.latestSettings.enableCrossTabSync) return;
        state.isCrossTabSyncInitialized = true;
        handleSectionChange(key, oldVal, newVal);
      });
    });
  }
  function handleSectionChange(section, oldVal = {}, newVal = {}) {
    const metaMap = metaRegistry[section];
    if (!metaMap) return;
    Object.keys(newVal).forEach((subKey) => {
      if (oldVal?.[subKey] === newVal[subKey]) return;
      config[section][subKey] = newVal[subKey];
      const meta = metaMap[subKey];
      if (!meta) return;
      applyEffects(meta, newVal[subKey]);
    });
  }
  function disableCrossTabSync() {
    if (!state.isCrossTabSyncInitialized) return;
    Object.keys(crossTabKeys).forEach((key) => {
      GM_removeValueChangeListener(key);
    });
    state.isCrossTabSyncInitialized = false;
  }
  function toggleCrossTabSync(enabled) {
    if (enabled) {
      initCrossTabSync();
    } else {
      disableCrossTabSync();
    }
  }

  // src/meta/globalSettings.js
  var globalSettingsMeta = {
    configVisibility: {
      type: "toggle",
      text: "Show configuration button",
      tooltip: "Show or hide the configuration button on the page",
      config: "globalSettings.configVisibility",
      effects: {
        custom: updateButtonVisibility,
        toast: (v) => `Configuration menu ${v ? "shown" : "hidden"}`
      }
    },
    noticeDismissal: {
      type: "toggle",
      text: "Enable notification dismissal",
      tooltip: "Allow closing notifications by clicking a close button",
      config: "globalSettings.closeNotifOnClick",
      effects: {
        custom: () => {
          toggleNoticeDismissal();
        },
        toast: (v) => `Notification dismissal ${v ? "enabled" : "disabled"}`
      }
    },
    enableCrossTabSync: {
      type: "toggle",
      text: "Sync settings across tabs",
      tooltip: "Automatically apply changes made in other tabs(requires to refresh other tabs) experimental",
      config: "globalSettings.enableCrossTabSync",
      effects: {
        custom: () => {
          toggleCrossTabSync(config.globalSettings.enableCrossTabSync);
        },
        toast: (v) => `(experimental)Cross-tab settings sync ${v ? "enabled" : "disabled"}`
      }
    }
  };

  // src/renderer/searchTags.js
  function renderList(filteredTags) {
    const results = document.getElementById("search-results");
    const input = document.getElementById("tags-search");
    if (!results || !input) return;
    results.innerHTML = "";
    const visibleTags = filteredTags.filter(
      (tag) => !config.preferredTags.includes(tag.id) && !config.excludedTags.includes(tag.id)
    );
    if (visibleTags.length === 0) {
      results.style.display = "none";
      return;
    }
    visibleTags.forEach((tag) => {
      results.appendChild(createTagResultItem(tag, input, results));
    });
    results.style.display = "block";
  }
  function createTagResultItem(tag, input, results) {
    const li = document.createElement("li");
    li.className = "search-result-item";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = tag.name;
    const actions = document.createElement("div");
    actions.className = "tag-actions";
    actions.appendChild(
      createActionButton(
        "\u2713",
        "Add to preferred",
        "preferred",
        () => {
          if (!config.preferredTags.includes(tag.id)) {
            config.preferredTags.push(tag.id);
            renderPreferred();
            showToast(`${tag.name} added to preferred`);
            saveConfigKeys({ preferredTags: config.preferredTags });
            queuedProcessAllTilesReset();
            queuedProcessThreadTags();
          }
        },
        input,
        results
      )
    );
    actions.appendChild(
      createActionButton(
        "\u2717",
        "Add to excluded",
        "excluded",
        () => {
          if (!config.excludedTags.includes(tag.id)) {
            config.excludedTags.push(tag.id);
            renderExcluded();
            showToast(`${tag.name} added to exclusion`);
            saveConfigKeys({ excludedTags: config.excludedTags });
            queuedProcessAllTilesReset();
            queuedProcessThreadTags();
          }
        },
        input,
        results
      )
    );
    li.appendChild(nameSpan);
    li.appendChild(actions);
    return li;
  }
  function createActionButton(text, title, typeClass, onClick, input, results) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.title = title;
    btn.className = `tag-btn ${typeClass}`;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
      input.value = "";
      results.style.display = "none";
    });
    return btn;
  }
  function renderPreferred() {
    renderTagList({
      containerId: "preffered-tags-list",
      ids: config.preferredTags,
      itemClass: "preferred-tag-item",
      removeBtnClass: "preferred-tag-remove",
      onRemove: (index, tag) => {
        config.preferredTags.splice(index, 1);
        showToast(`${tag.name} removed from preferred`);
        saveConfigKeys({ preferredTags: config.preferredTags }, true);
        queuedProcessAllTilesReset();
        queuedProcessThreadTags();
      }
    });
  }
  function renderExcluded() {
    renderTagList({
      containerId: "excluded-tags-list",
      ids: config.excludedTags,
      itemClass: "excluded-tag-item",
      removeBtnClass: "excluded-tag-remove",
      onRemove: (index, tag) => {
        config.excludedTags.splice(index, 1);
        showToast(`${tag.name} removed from exclusion`);
        saveConfigKeys({ excludedTags: config.excludedTags }, true);
        queuedProcessAllTilesReset();
        queuedProcessThreadTags();
      }
    });
  }
  function renderTagList({ containerId, ids, itemClass, removeBtnClass, onRemove }) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    ids.forEach((id, index) => {
      const tag = config.tags.find((t) => t.id === id);
      if (!tag) return;
      container.appendChild(createTagListItem(tag, index, itemClass, removeBtnClass, onRemove));
    });
  }
  function createTagListItem(tag, index, itemClass, removeBtnClass, onRemove) {
    const item = document.createElement("div");
    item.className = `tag-list-item ${itemClass}`;
    const text = document.createElement("span");
    text.textContent = tag.name;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.className = `tag-remove-btn ${removeBtnClass}`;
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove(index, tag);
      if (itemClass.includes("preferred")) renderPreferred();
      else renderExcluded();
    });
    item.appendChild(text);
    item.appendChild(removeBtn);
    return item;
  }

  // src/helper/rendererHelper.js
  function getByPath(obj, path) {
    return path.split(".").reduce((o, k) => o?.[k], obj);
  }
  function setByPath(obj, path, value) {
    const keys = path.split(".");
    const firstKey = keys[0];
    const last = keys.pop();
    const target = keys.reduce((o, k) => o[k], obj);
    target[last] = value;
    return firstKey;
  }

  // src/renderer/createInput.js
  function createInput(meta, id) {
    const input = document.createElement("input");
    input.id = id;
    switch (meta.type) {
      case "toggle":
        input.type = "checkbox";
        break;
      case "number":
        input.type = "number";
        Object.assign(input, meta.input);
        break;
      case "color":
        input.type = "color";
        break;
      default:
        throw new Error(`Unknown input type: ${meta.type}`);
    }
    return input;
  }

  // src/renderer/createLabel.js
  function createLabel(meta, id) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = meta.text;
    if (meta.tooltip) {
      label.title = meta.tooltip;
    }
    return label;
  }

  // src/renderer/renderSetting.js
  function renderSetting(key, meta) {
    if (meta.type === "header") {
      const header = document.createElement("div");
      header.className = "config-header";
      header.textContent = meta.text;
      return header;
    }
    if (meta.type === "separator") {
      const hr = document.createElement("hr");
      hr.className = "config-separator";
      return hr;
    }
    const row = document.createElement("div");
    row.className = "config-row";
    const id = `setting-${key}`;
    const label = createLabel(meta, id);
    const input = createInput(meta, id);
    const value = getByPath(config, meta.config);
    if (meta.type === "toggle") {
      input.checked = Boolean(value);
    } else {
      input.value = value;
    }
    input.addEventListener("change", () => {
      const newValue = meta.type === "toggle" ? input.checked : input.value;
      const keyName = setByPath(config, meta.config, newValue);
      saveConfigKeys({
        [keyName]: config[keyName]
      });
      applyEffects(meta, newValue);
    });
    row.appendChild(label);
    row.appendChild(input);
    return row;
  }

  // src/renderer/settingsSection.js
  function renderSettingsSection(containerId, metaMap) {
    const container = document.getElementById(containerId);
    debugLog("SettingsSection", `Rendering settings section: ${containerId}`);
    if (!container) {
      debugLog("SettingsSection", `Container not found: ${containerId}`);
      return;
    }
    container.innerHTML = "";
    Object.entries(metaMap).forEach(([key, meta]) => {
      container.appendChild(renderSetting(key, meta));
    });
  }

  // src/cores/tags.js
  function updateSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    const results = document.getElementById("search-results");
    if (!query || !results) {
      if (results) results.style.display = "none";
      return;
    }
    const filteredTags = config.tags.filter((tag) => tag.name.toLowerCase().includes(query));
    renderList(filteredTags);
  }
  function showAllTags() {
    const results = document.getElementById("search-results");
    if (!results) return;
    renderList(config.tags);
    results.style.display = "block";
  }

  // src/renderer/reRenderSetting.js
  function reRenderSettingsSection(containerId, meta) {
    if (!clearContainer(containerId)) return;
    renderSettingsSection(containerId, meta);
  }
  function clearContainer(id) {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = "";
      return true;
    }
    return false;
  }

  // src/ui/listeners.js
  function injectListener() {
    setEventById("tags-search", updateSearch, "input");
    setEventById("close-modal", closeModal);
    setEventById("tags-search", showAllTags, "focus");
    setEventById("reset-color", resetColor);
    document.addEventListener("click", (e) => {
      const input = document.getElementById("tags-search");
      const results = document.getElementById("search-results");
      if (!input || !results) return;
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.style.display = "none";
      }
    });
  }
  function setEventById(idSelector, callback, eventType = "click") {
    const el = document.getElementById(idSelector);
    if (el) {
      el.addEventListener(eventType, callback);
    } else {
      console.warn(`setEventById: element with id "${idSelector}" not found.`);
    }
  }
  function resetColor() {
    if (confirm("Are you sure you want to reset all colors to default?")) {
      config.color = { ...defaultColors };
      updateColorStyle();
      saveConfigKeys({ color: config.color });
      if (config.latestSettings.latestOverlayToggle && state.isLatest) {
        queuedProcessAllTilesReset();
      } else if (config.threadSettings.threadOverlayToggle && state.isThread) {
        queuedProcessThreadTags();
      }
      reRenderSettingsSection("color-container", colorSettingsMeta);
      showToast("Colors have been reset to default");
    }
  }

  // src/cores/init.js
  function initUI() {
    injectCSS();
    injectButton();
    updateColorStyle();
  }
  function initModalUi() {
    if (!state.modalInjected) {
      state.modalInjected = true;
      injectModal();
      injectListener();
    }
    if (!state.globalSettingsRendered) {
      state.globalSettingsRendered = true;
      renderSettingsSection("global-settings-container", globalSettingsMeta);
    }
    if (!state.colorRendered) {
      state.colorRendered = true;
      renderSettingsSection("color-container", colorSettingsMeta);
    }
    if (!state.overlayRendered) {
      state.overlayRendered = true;
      updateLatestUI();
    }
    if (!state.threadSettingsRendered) {
      state.threadSettingsRendered = true;
      updateThreadUI();
    }
    renderPreferred();
    renderExcluded();
    updateTags();
    checkTags();
  }
  function updateLatestUI() {
    renderSettingsSection("latest-settings-container", latestSettingsMeta);
    if (config.latestSettings.latestOverlayToggle) {
      renderSettingsSection("overlay-settings-container", overlaySettingsMeta);
    } else {
      renderSettingsSection("overlay-settings-container", disabledOverlaySettingsMeta);
    }
  }
  function updateThreadUI() {
    renderSettingsSection("thread-settings-container", threadSettingsMeta);
    if (config.threadSettings.threadOverlayToggle) {
      renderSettingsSection("thread-overlay-settings-container", threadOverlaySettingsMeta);
    } else {
      renderSettingsSection("thread-overlay-settings-container", disabledThreadOverlayMeta);
    }
  }
  async function initLatestPage() {
    if (config.latestSettings.denseLatestGrid) toggleDenseLatestGrid();
    if (config.latestSettings.wideLatest) toggleWideLatestPage();
    try {
      await waitFor(() => document.getElementById("latest-page_items-wrap"));
      watchAndUpdateTiles();
      if (config.latestSettings.latestOverlayToggle) {
        processAllTiles();
      }
      if (config.latestSettings.autoRefresh || config.latestSettings.webNotif) {
        handleWebClick();
      }
    } catch {
      console.warn("Observer container not found on latest page");
    }
  }
  function initThreadPage() {
    if (config.threadSettings.threadOverlayToggle) processThreadTags();
    if (config.threadSettings.isWide) wideForum();
    if (config.threadSettings.imgRetry) injectImageRepair();
    if (config.threadSettings.collapseSignature) signatureCollapse();
    if (config.threadSettings.skipMaskedLink) hijackMaskedLinks();
    if (config.threadSettings.directDownloadLinks) {
      debugLog("Init", "Direct download links enabled");
      hicjackLink();
      handleMsgEvent();
    }
  }
  function initDownloadPage() {
    if (state.isDownloadPage === "buzzheavier.com") {
      handleDownload("buzzheavier.com");
    } else if (state.isDownloadPage === "gofile.io") {
      processGofileDownload();
    }
  }
  function initPageState() {
    if (state.isLatest) initLatestPage();
    if (state.isThread) initThreadPage();
    if (state.isDownloadPage) {
      debugLog("Init", `Download page detected: ${state.isDownloadPage}`);
      initDownloadPage();
    }
    if (state.isDirectDownloadPage) {
      executeAutoRetry(state.isDirectDownloadPage.host);
    }
    if (state.isF95Zone) {
      initNoticeDismissal();
    }
  }

  // src/ui/modal.js
  function injectButton() {
    const button = document.createElement("button");
    button.textContent = "\u2699";
    button.id = "tag-config-button";
    button.addEventListener("click", () => openModal());
    document.body.appendChild(button);
  }
  var MAX_TOASTS = 4;
  var TOAST_DURATION = 2e3;
  function showToast(message, duration = TOAST_DURATION) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    while (container.children.length > MAX_TOASTS) {
      container.firstElementChild.remove();
    }
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }
  function openModal() {
    initModalUi();
    changeHelpMsg();
    document.getElementById("tag-config-modal").style.display = "block";
  }
  function closeModal() {
    document.getElementById("tag-config-modal").style.display = "none";
  }
  function injectModal() {
    const modal = document.createElement("div");
    modal.id = "tag-config-modal";
    modal.innerHTML = `${ui_default}`;
    document.body.appendChild(modal);
    const visibility = document.getElementById("config-visibility");
    if (visibility) visibility.checked = config.configVisibility;
    const modalContent = modal.querySelector(".modal-content");
    modal.addEventListener("click", (e) => {
      if (!modalContent.contains(e.target)) {
        closeModal();
      }
    });
  }
  function injectCSS() {
    const hasStyle = document.head.lastElementChild.textContent.includes("#tag-config-button");
    const customCSS = hasStyle ? document.head.lastElementChild : document.createElement("style");
    customCSS.textContent = `${css_default}`;
    document.head.appendChild(customCSS);
  }
  function updateButtonVisibility() {
    const button = document.getElementById("tag-config-button");
    if (!button) return;
    if (config.globalSettings.configVisibility === false) {
      button.classList.add("blink-hide", "hover-reveal");
      const onEnd = () => {
        button.classList.remove("blink-hide");
        button.classList.add("hidden");
        button.removeEventListener("animationend", onEnd);
      };
      button.addEventListener("animationend", onEnd);
    } else {
      button.classList.remove("hidden", "blink-hide", "hover-reveal");
    }
  }
  var helpMsgInterval = null;
  function changeHelpMsg() {
    function getRandomStupidHelpMsg() {
      const randomIndex = Math.floor(Math.random() * helpMessages.length);
      return helpMessages[randomIndex];
    }
    const msg = getRandomStupidHelpMsg();
    debugLog("getRandomStupidHelpMsg", `Selected help message: ${msg}`);
    const hintSpan = document.querySelector(".modal-footer-hint  .hint-text");
    if (hintSpan) {
      hintSpan.textContent = msg;
    }
    if (!helpMsgInterval) {
      helpMsgInterval = setInterval(() => {
        const el = document.querySelector(".modal-footer-hint .hint-text");
        if (el) el.textContent = getRandomStupidHelpMsg();
      }, 12e3);
    }
  }

  // src/main.js
  waitForBody(async () => {
    Object.assign(config, await loadData());
    migrateLatestSettings();
    detectPage();
    if (state.isMaskedLink) {
      if (config.threadSettings.skipMaskedLink) skipMaskedPage();
      return;
    }
    if (state.isF95Zone) {
      initUI();
      updateButtonVisibility();
      toggleCrossTabSync(config.globalSettings.enableCrossTabSync);
    }
    initPageState();
  });
})();
