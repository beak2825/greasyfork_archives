// ==UserScript==
// @name         F95Zone Ultimate Enhancer
// @version      4.1.5
// @icon         https://external-content.duckduckgo.com/iu/?u=https://f95zone.to/data/avatars/l/1963/1963870.jpg?1744969685
// @namespace    https://f95zone.to/threads/f95zone-latest.250836/
// @homepage     https://f95zone.to/threads/f95zone-latest.250836/
// @homepageURL  https://f95zone.to/threads/f95zone-latest.250836/
// @supportURL   https://f95zone.to/threads/forum-latest.250836/
// @author       X Death (creator and maintainer)
// @author       Edexal (enhancements)
// @match        https://f95zone.to/sam/latest_alpha/*
// @match        https://f95zone.to/threads/*
// @match        https://f95zone.to/masked/*
// @grant        GM.setValue
// @grant        GM.getValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @description  All-in-one powerhouse for F95Zone: Advanced thread highlighting & overlays, customizable tags/colors, wide layouts, auto latest refresh + notifications, seamless masked link skipping (direct on-click zap to hosts), image retry fixes, and more!
// @downloadURL https://update.greasyfork.org/scripts/546518/F95Zone%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/546518/F95Zone%20Ultimate%20Enhancer.meta.js
// ==/UserScript==
// ------------------------------------------------------------
// Built on 2025-12-21 04:13:48 UTC — AUTO-GENERATED, edit from /src and rebuild
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
    isImgRetryInjected: false,
    firstLoad: true,
    isMaskedLink: false,
    isMaskedLinkApplied: false,
    isProcessingTiles: false,
    isCrossTabSyncInitialized: false
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
    threadOverlayToggle: true
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
    metrics
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

  // src/storage/save.js
  async function saveConfigKeys(data) {
    const promises = Object.entries(data).map(([key, value]) => GM.setValue(key, value));
    await Promise.all(promises);
    if (debug) console.log("Config saved (keys)", data);
  }
  async function loadData() {
    let parsed = {};
    try {
      parsed = await GM.getValues(Object.keys(config)) ?? {};
    } catch (e) {
      debug && console.warn("loadData error:", e);
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
      metrics: mergeWithDefault(parsed.metrics, metrics)
    };
    if (!result.latestSettings.minVersion && result.latestSettings.minVersion !== 0) {
      result.latestSettings.minVersion = 0.5;
    }
    debug && console.log("loadData result:", result);
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
      debug && console.log("Latest settings migrated successfully");
    }
  }

  // src/template/ui.html?raw
  var ui_default = '<div id="toast-container"></div>\r\n\r\n<div class="modal-content">\r\n  <h2 style="text-align: center">CONFIG</h2>\r\n\r\n  <!-- General -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>General</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="global-settings-container"></div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- Latest page settings -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Latest page settings</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="latest-settings-warning"></div>\r\n        <div id="latest-settings-container"></div>\r\n        <div id="overlay-settings-container"></div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- Thread settings -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Thread settings</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="thread-settings-container"></div>\r\n        <div id="thread-overlay-settings-container"></div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- TAGS -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Tags</summary>\r\n\r\n      <div class="settings-wrapper">\r\n        <div id="tag-error-notif" class="modal-error-notif"></div>\r\n        <div id="tags-container">\r\n          <div id="search-container">\r\n            <input type="text" id="tags-search" placeholder="Search tags..." autocomplete="off" />\r\n            <ul id="search-results"></ul>\r\n            <div id="preffered-tags-list"></div>\r\n            <div id="excluded-tags-list"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n  <!-- COLORS -->\r\n  <div class="modal-settings-spacing">\r\n    <details class="config-list-details">\r\n      <summary>Color</summary>\r\n      <div class="settings-wrapper">\r\n        <div id="color-error-notif" class="modal-error-notif"></div>\r\n\r\n        <div id="color-container"></div>\r\n      </div>\r\n      <div class="centered-item">\r\n        <button id="reset-color" class="modal-btn">Reset color</button>\r\n      </div>\r\n    </details>\r\n  </div>\r\n  <hr class="thick-line" />\r\n\r\n  <!-- Close -->\r\n  <div class="centered-item">\r\n    <button id="close-modal" class="modal-btn">\u{1F5D9} Close</button>\r\n  </div>\r\n</div>\r\n';

  // src/template/css.css?raw
  var css_default = `:root {\r
  --completed-color: #388e3c;\r
  --onhold-color: #1976d2;\r
  --abandoned-color: #c9a300;\r
  --highVersion-color: #2e7d32;\r
  --invalidVersion-color: #a38400;\r
  --tileInfo-color: #9398a0;\r
  --tileHeader-color: #d9d9d9;\r
  --preferred-color: #7b1fa2;\r
  --preferred-text-color: #ffffff;\r
  --excluded-color: #b71c1c;\r
  --excluded-text-color: #ffffff;\r
  --neutral-color: #37383a;\r
  --neutral-text-color: #9398a0;\r
\r
  /* optional shadow toggles */\r
  --preferred-shadow: 0 0 2px 1px white;\r
  --excluded-shadow: 0 0 2px 1px white;\r
}\r
.modal-error-notif {\r
  display: none; /* hidden by default */\r
  background-color: #ffe5e5; /* soft red/pink */\r
  color: #b00020; /* dark red text */\r
  border: 1px solid #b00020;\r
  padding: 12px 16px;\r
  border-radius: 6px;\r
  margin-bottom: 12px;\r
  font-size: 14px;\r
  font-weight: 500;\r
}\r
.preferred {\r
  background-color: var(--preferred-color);\r
  font-weight: bold;\r
  color: var(--preferred-text-color);\r
}\r
.preffered-shadow {\r
  box-shadow: var(--preferred-shadow);\r
}\r
.excluded {\r
  background-color: var(--excluded-color);\r
  font-weight: bold;\r
  color: var(--excluded-text-color);\r
}\r
.excluded-shadow {\r
  box-shadow: var(--excluded-shadow);\r
}\r
.neutral {\r
  background-color: var(--neutral-color);\r
  font-weight: bold;\r
  color: var(--neutral-text-color);\r
}\r
.custom-overlay-reason {\r
  position: absolute;\r
  top: 4px;\r
  left: 4px;\r
  background: rgba(0, 0, 0, 0.7);\r
  color: white;\r
  padding: 2px 6px;\r
  font-size: 12px;\r
  border-radius: 4px;\r
  z-index: 2;\r
  pointer-events: none;\r
}\r
.centered-item {\r
  display: flex;\r
  justify-content: center;\r
  align-items: center;\r
  padding: 10px;\r
}\r
.settings-wrapper {\r
  padding: 10px;\r
  color: #ccc;\r
  font-size: 14px;\r
  line-height: 1.6;\r
}\r
div#latest-page_items-wrap_inner\r
  div.resource-tile\r
  a.resource-tile_link\r
  div.resource-tile_info\r
  div.resource-tile_info-meta {\r
  color: var(--tileInfo-color);\r
  font-weight: 600;\r
}\r
\r
div#latest-page_items-wrap_inner div.resource-tile a.resource-tile_link {\r
  color: var(--tileHeader-color);\r
}\r
.tag-btn {\r
  border: none;\r
  padding: 5px;\r
  margin: 0 2px;\r
  cursor: pointer;\r
  font-size: 14px;\r
  color: white;\r
  font-weight: bold;\r
  transition: background-color 0.2s ease;\r
}\r
\r
.tag-btn.excluded {\r
  background-color: var(--excluded-color);\r
  color: var(--excludedText-color);\r
}\r
\r
.tag-btn.preferred {\r
  background-color: var(--preferred-color);\r
  color: var(--preferredText-color);\r
}\r
\r
.tag-btn:hover {\r
  filter: brightness(1.1);\r
}\r
#toast-container {\r
  position: fixed;\r
  top: 20px;\r
  left: 50%;\r
  transform: translateX(-50%);\r
  z-index: 10000; /* above modal */\r
  display: flex;\r
  flex-direction: column;\r
  gap: 8px;\r
  pointer-events: none;\r
}\r
\r
.toast {\r
  padding: 10px;\r
  background-color: #333;\r
  color: #fff;\r
  border-radius: 8px;\r
  opacity: 0;\r
  transform: translateY(-10px);\r
  transition:\r
    opacity 0.3s ease,\r
    transform 0.3s ease;\r
}\r
\r
.toast.show {\r
  opacity: 1;\r
  transform: translateY(0);\r
}\r
\r
#tag-config-modal {\r
  display: none;\r
  position: fixed;\r
  z-index: 9999;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  background-color: rgba(0, 0, 0, 0.5);\r
}\r
/* Preferred tags container */\r
#preffered-tags-list {\r
  display: flex;\r
  flex-wrap: wrap;\r
  gap: 6px;\r
  margin-top: 8px;\r
}\r
\r
/* Preferred tag item */\r
.preferred-tag-item {\r
  display: inline-flex;\r
  align-items: center;\r
  background-color: var(--preferred-color);\r
  color: var(--preferredText-color);\r
  border-radius: 4px;\r
  font-size: 14px;\r
  font-weight: bold;\r
}\r
\r
.preferred-tag-item span {\r
  margin-right: 6px;\r
  margin-left: 6px;\r
}\r
\r
.preferred-tag-remove {\r
  background-color: #c15858;\r
  color: #fff;\r
  border: none;\r
  border-top-right-radius: 4px;\r
  border-bottom-right-radius: 4px;\r
\r
  padding: 10px;\r
  cursor: pointer;\r
  font-weight: bold;\r
  font-size: 12px;\r
}\r
\r
/* Excluded tags container */\r
.tag-actions {\r
  display: flex;\r
  gap: 5px;\r
}\r
#excluded-tags-list {\r
  display: flex;\r
  flex-wrap: wrap;\r
  gap: 6px;\r
  margin-top: 8px;\r
}\r
#search-container {\r
  position: relative;\r
  display: inline-block;\r
  min-height: 250px;\r
  width: 100%;\r
}\r
/* Excluded tag item */\r
.excluded-tag-item {\r
  display: inline-flex;\r
  align-items: center;\r
  background-color: var(--excluded-color);\r
  color: var(--excludedText-color);\r
  border-radius: 4px;\r
  font-size: 14px;\r
  font-weight: bold;\r
}\r
\r
.excluded-tag-item span {\r
  margin-right: 6px;\r
}\r
\r
.excluded-tag-remove {\r
  background-color: #c15858;\r
  color: #fff;\r
  border: none;\r
  padding: 10px;\r
  cursor: pointer;\r
  border-top-right-radius: 4px;\r
  border-bottom-right-radius: 4px;\r
  font-size: 12px;\r
  font-weight: bold;\r
}\r
\r
/* Individual list items */\r
#search-results li {\r
  padding: 6px 8px;\r
  cursor: pointer;\r
  color: #fff;\r
  background-color: #222;\r
\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
}\r
\r
#search-results li:hover {\r
  background-color: #333; /* slightly lighter on hover */\r
}\r
#tags-search {\r
  background-color: #222;\r
  color: #fff;\r
  border: 1px solid #555;\r
  border-radius: 4px;\r
  padding: 6px 8px;\r
  width: 100%;\r
}\r
\r
#tags-search:focus {\r
  outline: none;\r
  border: 1px solid #c15858;\r
}\r
#search-results {\r
  position: absolute;\r
  left: 0;\r
  right: 0;\r
  max-height: 200px;\r
  overflow-y: auto;\r
  background-color: #222; /* same as inputs */\r
  border: 1px solid #555; /* same border as input */\r
  border-radius: 4px;\r
  margin: 2px 0 0 0; /* small gap below input */\r
  padding: 0;\r
  list-style: none;\r
  display: none;\r
  z-index: 1000;\r
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* subtle shadow */\r
}\r
/* All text inputs, textareas, selects */\r
#tag-config-modal input,\r
#tag-config-modal textarea,\r
#tag-config-modal select {\r
  background-color: #222;\r
  color: #fff;\r
  border: 1px solid #555;\r
  border-radius: 4px;\r
}\r
#tag-config-modal input:focus,\r
#tag-config-modal textarea:focus,\r
#tag-config-modal select:focus {\r
  outline: none;\r
  border: 1px solid #c15858;\r
}\r
\r
/* Checkboxes and radios */\r
#tag-config-modal input[type="checkbox"],\r
#tag-config-modal input[type="radio"] {\r
  accent-color: #c15858;\r
  background-color: #222;\r
  border: 1px solid #555;\r
}\r
#tag-config-modal .config-color-input {\r
  border: 2px solid #3f4043;\r
  border-radius: 5px;\r
  padding: 2px;\r
  width: 40px;\r
  height: 28px;\r
  cursor: pointer;\r
  background-color: #181a1d;\r
}\r
\r
#tag-config-modal .config-color-input::-webkit-color-swatch-wrapper {\r
  padding: 0;\r
}\r
\r
#tag-config-modal .config-color-input::-webkit-color-swatch {\r
  border-radius: 4px;\r
  border: none;\r
}\r
\r
.modal-btn {\r
  background-color: #893839;\r
  color: white;\r
  border: 2px solid #893839;\r
  border-radius: 6px;\r
  padding: 8px 16px;\r
  font-weight: 600;\r
  font-size: 14px;\r
  cursor: pointer;\r
  transition:\r
    background-color 0.3s ease,\r
    border-color 0.3s ease;\r
  box-shadow: 0 4px 8px rgba(137, 56, 56, 0.5);\r
}\r
\r
.modal-btn:hover {\r
  background-color: #b94f4f;\r
  border-color: #b94f4f;\r
}\r
\r
.modal-btn:active {\r
  background-color: #6e2b2b;\r
  border-color: #6e2b2b;\r
  box-shadow: none;\r
}\r
.config-row {\r
  display: flex;\r
  align-items: center; /* vertically center everything */\r
  gap: 12px;\r
  margin: 8px 0;\r
  line-height: 1.4;\r
  user-select: none;\r
}\r
\r
/* Fixed-width label column (all labels perfectly aligned) */\r
.config-row label {\r
  flex: 0 0 180px; /* adjust 180px to your longest label */\r
  text-align: left;\r
  font-weight: 500;\r
  cursor: pointer;\r
  white-space: nowrap; /* prevent label wrap */\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
}\r
\r
/* Checkbox stays small and on the right */\r
.config-row input[type="checkbox"] {\r
  flex-shrink: 0;\r
  width: 18px;\r
  height: 18px;\r
  margin: 0;\r
  cursor: pointer;\r
  accent-color: #6e42d6; /* optional: nice purple accent */\r
}\r
\r
.config-row:hover {\r
  background: rgba(110, 66, 214, 0.05);\r
}\r
\r
#tag-config-button {\r
  position: fixed;\r
  bottom: 20px;\r
  right: 20px;\r
  left: 20px;\r
  padding: 8px 12px;\r
  font-size: 20px;\r
  z-index: 7;\r
  cursor: pointer;\r
  border: 2px inset #461616;\r
  background: #cc3131;\r
  color: white;\r
  border-radius: 8px;\r
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\r
  max-width: 70px;\r
  width: auto;\r
  opacity: 0.75;\r
  transition:\r
    opacity 1s ease,\r
    transform 0.5s ease;\r
}\r
\r
#tag-config-button:hover {\r
  opacity: 1;\r
}\r
\r
#tag-config-button:active {\r
  transform: scale(0.9);\r
}\r
\r
/* Hidden state that still allows hover */\r
#tag-config-button.hidden {\r
  opacity: 0;\r
  pointer-events: auto; /* stays interactive for hover */\r
  transition: opacity 0.3s ease;\r
}\r
\r
#tag-config-button.hidden:hover {\r
  opacity: 0.75; /* restores visible opacity on hover */\r
}\r
\r
/* Optional: for blinking effect */\r
.blink-hide {\r
  animation: blink-hidden 0.4s ease-in-out 3;\r
}\r
\r
#tag-config-modal .modal-content {\r
  background: black;\r
  border-radius: 10px;\r
  min-width: 300px;\r
  max-height: 80vh;\r
  overflow-y: scroll; /* always show vertical scrollbar */\r
  background: #191b1e;\r
  max-width: 400px;\r
  margin: 100px auto;\r
}\r
\r
#tag-config-modal.show {\r
  display: flex;\r
}\r
\r
.config-list-details {\r
  overflow: hidden;\r
  transition:\r
    border-width 1s,\r
    max-height 1s ease;\r
  max-height: 40px;\r
}\r
\r
.config-list-details[open] {\r
  border-width: 2px;\r
  max-height: 1300px;\r
}\r
.thick-line {\r
  border: none;\r
  height: 1px;\r
  background-color: #3f4043;\r
}\r
.config-list-details summary {\r
  text-align: center;\r
  background: #353535;\r
  border-radius: 8px;\r
  padding-top: 5px;\r
  padding-bottom: 5px;\r
  cursor: pointer;\r
}\r
\r
.config-tag-item {\r
  margin-left: 5px;\r
  cursor: pointer;\r
}\r
\r
.modal-settings-spacing {\r
  padding: 10px;\r
}\r
.no-max-width {\r
  max-width: none !important; /* or just max-width: unset; */\r
}\r
.config-label:hover {\r
  text-decoration: underline;\r
  text-decoration-style: dotted;\r
}\r
\r
/* Toast container */\r
.img-retry-toast {\r
  position: fixed;\r
  top: 20px;\r
  right: 20px;\r
  background: rgba(0, 0, 0, 0.85);\r
  color: #fff;\r
  padding: 10px 15px;\r
  border-radius: 8px;\r
  font-family: sans-serif;\r
  font-size: 13px;\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
  z-index: 99999;\r
  pointer-events: none;\r
}\r
\r
/* Spinner inside toast */\r
.img-retry-toast .img-retry-spinner {\r
  border: 2px solid #fff;\r
  border-top: 2px solid transparent;\r
  border-radius: 50%;\r
  width: 14px;\r
  height: 14px;\r
  display: inline-block;\r
  animation: img-retry-spin 1s linear infinite;\r
}\r
\r
/* Spinner animation */\r
@keyframes img-retry-spin {\r
  0% {\r
    transform: rotate(0deg);\r
  }\r
  100% {\r
    transform: rotate(360deg);\r
  }\r
}\r
\r
/* Stats inside toast */\r
.img-retry-toast .img-retry-stats {\r
  margin-left: 10px;\r
  opacity: 0.8;\r
}\r
\r
html.latest-wide .p-body-inner {\r
  max-width: none !important;\r
}\r
\r
html.latest-wide main#latest-page_main-wrap {\r
  width: 100% !important;\r
  max-width: none !important;\r
}\r
.config-header {\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
\r
  margin: 14px 0 10px;\r
  padding: 6px 0;\r
\r
  font-size: 0.95em;\r
  font-weight: 600;\r
  text-align: center;\r
\r
  color: #b0b3b8; /* subtle, non-dominant */\r
  letter-spacing: 0.04em;\r
  text-transform: uppercase;\r
\r
  user-select: none;\r
}\r
\r
/* Existing: Wide Latest Page \u2013 full width container */\r
html.latest-wide main#latest-page_main-wrap {\r
  width: 100% !important;\r
  max-width: none !important;\r
}\r
\r
/* New: Dense Adaptive Grid \u2013 overrides the shitty 30% minmax */\r
html.latest-dense .grid-normal {\r
  grid-template-columns: repeat(\r
    auto-fill,\r
    minmax(260px, 1fr)\r
  ) !important; /* Magic number \u2013 adaptive columns */\r
  gap: 20px !important; /* Keeps spacing clean */\r
}\r
\r
/* Polish: let cards breathe and fill the slot properly */\r
html.latest-dense .structItem.structItem--latest {\r
  max-width: none !important;\r
  width: 100% !important;\r
}\r
\r
/* Optional extra: slight card tightening if you want even more density */\r
html.latest-dense .structItem-cell.structItem-cell--main {\r
  padding: 12px !important; /* Default is bigger, this makes 'em snugger */\r
}\r
/* collapse signatures globally when enabled */\r
html.latest-signature-collapsed aside.message-signature {\r
  max-height: 0 !important;\r
  overflow: hidden !important;\r
\r
  padding-top: 0 !important;\r
  padding-bottom: 0 !important;\r
  margin-top: 0 !important;\r
  border-top: none !important;\r
\r
  opacity: 0;\r
  transition:\r
    max-height 0.25s ease,\r
    opacity 0.2s ease;\r
}\r
\r
/* expanded state (per message) */\r
html.latest-signature-collapsed aside.message-signature.latest-signature-expanded {\r
  max-height: 300px !important;\r
  overflow-y: auto !important;\r
\r
  padding-top: 10px !important;\r
  padding-bottom: 10px !important;\r
  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;\r
\r
  opacity: 1;\r
}\r
\r
/* toggle button */\r
.latest-signature-toggle {\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
\r
  width: 100%;\r
  margin: 6px 0 12px;\r
  padding: 6px 0;\r
\r
  border: none;\r
  border-radius: 0;\r
  background: transparent;\r
\r
  font-size: 1.2rem;\r
  color: #ec5555;\r
  cursor: pointer;\r
\r
  position: relative;\r
}\r
\r
/* separator lines */\r
.latest-signature-toggle::before,\r
.latest-signature-toggle::after {\r
  content: "";\r
  flex: 1;\r
  height: 1px;\r
  background: rgba(255, 255, 255, 0.12);\r
  margin: 0 10px;\r
}\r
\r
.latest-signature-toggle span {\r
  white-space: nowrap;\r
}\r
\r
/* mobile keeps forum behavior */\r
@media (max-width: 480px) {\r
  html.latest-signature-collapsed .latest-signature-toggle {\r
    display: none;\r
  }\r
}\r
@keyframes blink-hidden {\r
  0% {\r
    opacity: 1;\r
  }\r
  50% {\r
    opacity: 0;\r
  }\r
  100% {\r
    opacity: 1;\r
  }\r
}\r
`;

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
    if (!window.location.hostname === "f95zone.to") return;
    if (path.startsWith("/threads")) {
      state.isThread = true;
    } else if (path.startsWith("/sam/latest_alpha")) {
      state.isLatest = true;
    } else if (path.startsWith("/masked")) {
      state.isMaskedLink = true;
    }
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
      if (debug) console.log("updateTags: failed to find selector/dropdown");
      return;
    }
    selector.click();
    try {
      await waitFor(() => dropdown.querySelectorAll(".option").length > 0, 50, 3e3);
    } catch (err) {
      if (debug) console.log("updateTags: timeout waiting for options", err);
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
      saveConfigKeys({ tags: config.tags });
      if (debug) console.log("updateTags: tags updated", newTags);
    }
    checkTags();
    state.tagsUpdated = true;
    if (debug) console.log("updateTags: finished");
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
          window.open(targetUrl, "_blank");
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
    debug && console.log(versionText, versionNumber, match, isValidKeyword);
    const labelText = getLabelText(tile);
    const matchedTag = processTag(tile, config.preferredTags);
    const excludedTag = processTag(tile, config.excludedTags);
    debug && console.log(labelText, matchedTag, excludedTag);
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
    debug && console.log(tagIds);
    const matchedId = tagIds.find((id) => tags.some((tag) => tag === id));
    debug && console.log(matchedId);
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
      root.classList.add("latest-wide");
    } else {
      root.classList.remove("latest-wide");
    }
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
    debug && console.log("Resetting all tiles on Latest Updates page");
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
    console.log("Thread tag overlay disabled \u2014 tags back to vanilla");
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
      debug && console.log("Processing signature collapse", sig);
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
    if (!state.isThread || !config.threadSettings.threadOverlayToggle) return;
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
      debug && console.log(varName, config.color[key]);
    } else {
      for (const [k, value] of Object.entries(config.color)) {
        const varName = `--${k}-color`;
        document.documentElement.style.setProperty(varName, value);
        debug && console.log(varName, value);
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
    document.querySelectorAll(".p-body-inner").forEach((el) => el.classList.toggle("no-max-width", isWide));
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
      tooltip: "Automatically bypass the masked link intermediary page when accessing masked links",
      config: "threadSettings.skipMaskedLink",
      effects: {
        custom: () => toggleHijackMaskedLink(),
        toast: (v) => `Skip Masked Link ${v ? "enabled" : "disabled"}`
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
        saveConfigKeys({ preferredTags: config.preferredTags });
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
        saveConfigKeys({ excludedTags: config.excludedTags });
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
    const last = keys.pop();
    const target = keys.reduce((o, k) => o[k], obj);
    target[last] = value;
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
      setByPath(config, meta.config, newValue);
      saveConfigKeys(config);
      applyEffects(meta, newValue);
    });
    row.appendChild(label);
    row.appendChild(input);
    return row;
  }

  // src/renderer/settingsSection.js
  function renderSettingsSection(containerId, metaMap) {
    const container = document.getElementById(containerId);
    debug && console.log("Rendering settings section:", containerId, metaMap);
    if (!container) {
      debug && console.warn("Container not found:", containerId);
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
    try {
      await waitFor(() => document.getElementById("latest-page_items-wrap"));
      if (config.latestSettings.wideLatest) toggleWideLatestPage();
      watchAndUpdateTiles();
      if (config.latestSettings.denseLatestGrid) toggleDenseLatestGrid();
      processAllTiles();
      handleWebClick();
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
  }
  function initPageState() {
    if (state.isLatest) initLatestPage();
    if (state.isThread) initThreadPage();
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

  // src/main.js
  waitForBody(async () => {
    Object.assign(config, await loadData());
    migrateLatestSettings();
    detectPage();
    if (state.isMaskedLink) {
      if (config.threadSettings.skipMaskedLink) skipMaskedPage();
      return;
    }
    initUI();
    updateButtonVisibility();
    toggleCrossTabSync(config.globalSettings.enableCrossTabSync);
    initPageState();
  });
})();
