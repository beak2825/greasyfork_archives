// ==UserScript==
// @name         TubeInsights
// @namespace    https://github.com/exyezed/tube-insights
// @version      1.0.7
// @author       exyezed
// @description  A feature-rich and high-performance YouTube userscript, built on the InnerTube API — delivering advanced analytics, live stats, smart bookmarking, and seamless video/audio downloading without leaving YouTube.
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiNmZjYyN2QiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOCAzYTUgNSAwIDAgMSA1IDV2OGE1IDUgMCAwIDEgLTUgNWgtMTJhNSA1IDAgMCAxIC01IC01di04YTUgNSAwIDAgMSA1IC01em0tOSA2djZhMSAxIDAgMCAwIDEuNTE0IC44NTdsNSAtM2ExIDEgMCAwIDAgMCAtMS43MTRsLTUgLTNhMSAxIDAgMCAwIC0xLjUxNCAuODU3eiIgLz48L3N2Zz4=
// @supportURL   https://github.com/exyezed/tube-insights/issues
// @match        https://www.youtube.com/*
// @require      https://cdn.jsdelivr.net/npm/@preact/signals-core@1.12.1/dist/signals-core.min.js
// @require      https://cdn.jsdelivr.net/npm/browser-id3-writer@4.4.0/dist/browser-id3-writer.min.js
// @require      https://cdn.jsdelivr.net/npm/preact@10.27.2/dist/preact.min.js
// @require      https://cdn.jsdelivr.net/npm/preact@10.27.2/hooks/dist/hooks.umd.js
// @require      https://cdn.jsdelivr.net/npm/@preact/signals@2.5.0/dist/signals.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js
// @connect      api.livecounts.io
// @connect      cnv.cx
// @connect      mp3yt.is
// @connect      web.archive.org
// @connect      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/555046/TubeInsights.user.js
// @updateURL https://update.greasyfork.org/scripts/555046/TubeInsights.meta.js
// ==/UserScript==

(function (preact, signals, hooks, dayjs) {
  'use strict';

  const scriptRel = (function detectScriptRel() {
    const relList = typeof document !== "undefined" && document.createElement("link").relList;
    return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
  })();
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (deps && deps.length > 0) {
      let allSettled = function(promises$2) {
        return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
          status: "fulfilled",
          value: value$1
        }), (reason) => ({
          status: "rejected",
          reason
        }))));
      };
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
      const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
      promise = allSettled(deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) link.as = "script";
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) link.setAttribute("nonce", cspNonce);
        document.head.appendChild(link);
        if (isCss) return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej( new Error(`Unable to preload CSS for ${dep}`)));
        });
      }));
    }
    function handlePreloadError(err$2) {
      const e$1 = new Event("vite:preloadError", { cancelable: true });
      e$1.payload = err$2;
      window.dispatchEvent(e$1);
      if (!e$1.defaultPrevented) throw err$2;
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  var f = 0;
  function u(e, t, n, o, i, u2) {
    t || (t = {});
    var a, c, p = t;
    if ("ref" in p) for (c in p = {}, t) "ref" == c ? a = t[c] : p[c] = t[c];
    var l = { type: e, props: p, key: n, ref: a, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f, __i: -1, __u: 0, __source: i, __self: u2 };
    if ("function" == typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
    return preact.options.vnode && preact.options.vnode(l), l;
  }
  const STORAGE_KEYS = {
THEME: "tubeinsights-theme",
    PANEL_VISIBLE: "tubeinsights-panelVisible",
    ACTIVE_TAB: "tubeinsights-activeTab",
    PANEL_WIDTH: "tubeinsights-panelWidth",
MODULE_LOOP_VIDEO: "module-loop-video",
    MODULE_RETURN_DISLIKE: "module-return-dislike",
    MODULE_KEYBOARD_SHORTCUTS: "module-keyboard-shortcuts",
    MODULE_SCREENSHOT_VIDEO: "module-screenshot-video",
    MODULE_THUMBNAIL_DOWNLOAD: "module-thumbnail-download",
    MODULE_HIDE_PROGRESS_BAR: "module-hide-progress-bar",
MODULE_SCREENSHOT_FORMAT: "module-screenshot-format",
    MODULE_SCREENSHOT_QUALITY: "module-screenshot-quality",
    MODULE_LOOP_VIDEO_COUNT: "module-loop-video-count"
  };
  const STORAGE_DEFAULTS = {
    [STORAGE_KEYS.THEME]: "light",
    [STORAGE_KEYS.PANEL_VISIBLE]: "true",
    [STORAGE_KEYS.ACTIVE_TAB]: "insights",
    [STORAGE_KEYS.PANEL_WIDTH]: "350",
    [STORAGE_KEYS.MODULE_LOOP_VIDEO]: "true",
    [STORAGE_KEYS.MODULE_RETURN_DISLIKE]: "true",
    [STORAGE_KEYS.MODULE_KEYBOARD_SHORTCUTS]: "true",
    [STORAGE_KEYS.MODULE_SCREENSHOT_VIDEO]: "true",
    [STORAGE_KEYS.MODULE_THUMBNAIL_DOWNLOAD]: "true",
    [STORAGE_KEYS.MODULE_HIDE_PROGRESS_BAR]: "false",
    [STORAGE_KEYS.MODULE_SCREENSHOT_FORMAT]: "jpg",
    [STORAGE_KEYS.MODULE_SCREENSHOT_QUALITY]: "95",
    [STORAGE_KEYS.MODULE_LOOP_VIDEO_COUNT]: "0"
  };
  function getStorageDefault(key) {
    return STORAGE_DEFAULTS[key] || "";
  }
  class Logger {
    prefix;
    level;
    constructor(prefix, level = 1) {
      this.prefix = `[${prefix}]`;
      this.level = level;
    }
    debug(...args) {
      if (this.level <= 0) {
        console.debug(this.prefix, ...args);
      }
    }
    info(...args) {
      if (this.level <= 1) {
        console.info(this.prefix, ...args);
      }
    }
    warn(...args) {
      if (this.level <= 2) {
        console.warn(this.prefix, ...args);
      }
    }
    error(...args) {
      if (this.level <= 3) {
        console.error(this.prefix, ...args);
      }
    }
    time(label) {
      console.time(`${this.prefix} ${label}`);
    }
    timeEnd(label) {
      console.timeEnd(`${this.prefix} ${label}`);
    }
  }
  const logger = {
    tubeinsights: new Logger("TubeInsights"),
    youtube: new Logger("YouTube"),
    storage: new Logger("Storage")
  };
  const storage = {
async get(key, defaultValue) {
      try {
        if (typeof GM_getValue !== "undefined") {
          return GM_getValue(key, defaultValue || getStorageDefault(key) || "");
        } else {
          const value = localStorage.getItem(key);
          return value || defaultValue || getStorageDefault(key) || "";
        }
      } catch (error) {
        logger.storage.error("Failed to get storage value:", key, error);
        return defaultValue || getStorageDefault(key) || "";
      }
    },
async set(key, value) {
      try {
        if (typeof GM_setValue !== "undefined") {
          GM_setValue(key, value);
        } else {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        logger.storage.error("Failed to set storage value:", key, error);
      }
    },
async getBoolean(key, defaultValue = false) {
      const value = await this.get(key, String(defaultValue));
      return value === "true";
    },
async setBoolean(key, value) {
      await this.set(key, String(value));
    },
async getNumber(key, defaultValue = 0) {
      const value = await this.get(key, String(defaultValue));
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    },
async setNumber(key, value) {
      await this.set(key, String(value));
    },
async remove(key) {
      try {
        if (typeof GM_setValue !== "undefined") {
          GM_setValue(key, "");
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        logger.storage.error("Failed to remove storage value:", key, error);
      }
    },
async has(key) {
      const value = await this.get(key);
      return value !== "";
    }
  };
  const COBALT_DEFAULTS = {
    INSTANCE_URL: "https://cobalt.nichind.dev",
    FILENAME_STYLE: "basic"
  };
  const VIDEO_QUALITIES = [
    "144",
    "240",
    "360",
    "480",
    "720",
    "1080"
  ];
  const DDL_VIDEO_QUALITIES = [
    "144",
    "240",
    "360",
    "480",
    "720",
    "1080",
    "1440",
    "2160"
  ];
  const AUDIO_BITRATES = ["128", "256", "320"];
  const FILENAME_STYLES = [
    { value: "classic", label: "Classic" },
    { value: "pretty", label: "Pretty" },
    { value: "basic", label: "Basic" },
    { value: "nerdy", label: "Nerdy" }
  ];
  const SCREENSHOT_FORMATS = [
    { value: "jpg", label: "JPG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" }
  ];
  const SCREENSHOT_FILENAME_OPTIONS = [
    { value: "title", label: "Video Title" },
    { value: "videoId", label: "Video ID" }
  ];
  const isPanelVisible = signals.signal(true);
  const activeTab = signals.signal("insights");
  const currentTheme = signals.signal("light");
  const panelWidth = signals.signal(350);
  const saveChannelDialogData = signals.signal(null);
  const deleteChannelDialogData = signals.signal(null);
  const clearAllDialogOpen = signals.signal(false);
  const detailChannelDialogData = signals.signal(null);
  const subtitleDialogData = signals.signal(null);
  const moduleSettings = signals.signal({
    loopVideo: true,
    returnDislike: true,
    screenshotFormat: "jpg",
    screenshotFilename: "title",
    screenshotDownload: true,
    screenshotCopy: true,
    thumbnailDownload: true,
    hideProgressBar: false,
    countryFlags: false
  });
  const cobaltSettings = signals.signal({
    enabled: false,
    instanceUrl: COBALT_DEFAULTS.INSTANCE_URL,
    filenameStyle: COBALT_DEFAULTS.FILENAME_STYLE,
    preferredDubLang: "",
    debug: false
  });
  function togglePanel() {
    isPanelVisible.value = !isPanelVisible.value;
    storage.set("tubeinsights-panelVisible", isPanelVisible.value.toString());
  }
  function setActiveTab(tab) {
    activeTab.value = tab;
    storage.set("tubeinsights-activeTab", tab);
  }
  async function loadSettings() {
    const panelVisible = await storage.get("tubeinsights-panelVisible", "true");
    isPanelVisible.value = panelVisible === "true";
    const theme = await storage.get("tubeinsights-theme", "light");
    currentTheme.value = theme;
    const width = await storage.get("tubeinsights-panelWidth", "350");
    panelWidth.value = parseInt(width);
    const savedTab = await storage.get("tubeinsights-activeTab", "insights");
    if (savedTab === "insights" || savedTab === "livecount" || savedTab === "bookmark" || savedTab === "ddl" || savedTab === "settings") {
      activeTab.value = savedTab;
    }
    const loopVideo = await storage.get("module-loop-video", "true");
    const returnDislike = await storage.get("module-return-dislike", "true");
    const screenshotFormat = await storage.get("module-screenshot-format", "jpg");
    const screenshotFilename = await storage.get(
      "module-screenshot-filename",
      "title"
    );
    const screenshotDownload = await storage.get(
      "module-screenshot-download",
      "true"
    );
    const screenshotCopy = await storage.get("module-screenshot-copy", "true");
    const thumbnailDownload = await storage.get(
      "module-thumbnail-download",
      "true"
    );
    const hideProgressBar = await storage.get(
      "module-hide-progress-bar",
      "false"
    );
    const countryFlags = await storage.get("module-country-flags", "false");
    moduleSettings.value = {
      loopVideo: loopVideo === "true",
      returnDislike: returnDislike === "true",
      screenshotFormat,
      screenshotFilename,
      screenshotDownload: screenshotDownload === "true",
      screenshotCopy: screenshotCopy === "true",
      thumbnailDownload: thumbnailDownload === "true",
      hideProgressBar: hideProgressBar === "true",
      countryFlags: countryFlags === "true"
    };
    const cobaltEnabled = await storage.get("cobalt-enabled", "false");
    const cobaltInstanceUrl = await storage.get(
      "cobalt-instance-url",
      COBALT_DEFAULTS.INSTANCE_URL
    );
    const cobaltFilenameStyle = await storage.get(
      "cobalt-filename-style",
      "basic"
    );
    const cobaltPreferredDubLang = await storage.get(
      "cobalt-preferred-dub-lang",
      ""
    );
    const cobaltDebug = await storage.get("cobalt-debug", "false");
    cobaltSettings.value = {
      enabled: cobaltEnabled === "true",
      instanceUrl: cobaltInstanceUrl,
      filenameStyle: cobaltFilenameStyle,
      preferredDubLang: cobaltPreferredDubLang,
      debug: cobaltDebug === "true"
    };
  }
  function openSaveChannelDialog(data) {
    saveChannelDialogData.value = { ...data, isOpen: true };
  }
  function closeSaveChannelDialog() {
    saveChannelDialogData.value = null;
  }
  function openDeleteChannelDialog(channelId) {
    deleteChannelDialogData.value = { channelId, isOpen: true };
  }
  function closeDeleteChannelDialog() {
    deleteChannelDialogData.value = null;
  }
  function openClearAllDialog() {
    clearAllDialogOpen.value = true;
  }
  function closeClearAllDialog() {
    clearAllDialogOpen.value = false;
  }
  function openDetailChannelDialog(channel) {
    detailChannelDialogData.value = { channel, isOpen: true };
  }
  function closeDetailChannelDialog() {
    detailChannelDialogData.value = null;
  }
  function openSubtitleDialog(data) {
    subtitleDialogData.value = { ...data, isOpen: true };
  }
  function closeSubtitleDialog() {
    subtitleDialogData.value = null;
  }
  const index = Object.freeze( Object.defineProperty({
    __proto__: null,
    activeTab,
    clearAllDialogOpen,
    closeClearAllDialog,
    closeDeleteChannelDialog,
    closeDetailChannelDialog,
    closeSaveChannelDialog,
    closeSubtitleDialog,
    cobaltSettings,
    currentTheme,
    deleteChannelDialogData,
    detailChannelDialogData,
    isPanelVisible,
    loadSettings,
    moduleSettings,
    openClearAllDialog,
    openDeleteChannelDialog,
    openDetailChannelDialog,
    openSaveChannelDialog,
    openSubtitleDialog,
    panelWidth,
    saveChannelDialogData,
    setActiveTab,
    subtitleDialogData,
    togglePanel
  }, Symbol.toStringTag, { value: "Module" }));
  var defaultAttributes = {
    outline: {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    },
    filled: {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "currentColor",
      stroke: "none"
    }
  };
  const createPreactComponent = (type, iconName, iconNamePascal, iconNode) => {
    const Component = ({
      color = "currentColor",
      size = 24,
      stroke = 2,
      title,
      children,
      className = "",
      class: classes = "",
      style,
      ...rest
    }) => preact.h(
      "svg",
      {
        ...defaultAttributes[type],
        width: String(size),
        height: String(size),
        class: [`tabler-icon`, `tabler-icon-${iconName}`, classes, className].join(" "),
        ...type === "filled" ? {
          fill: color
        } : {
          "stroke-width": stroke,
          stroke: color
        },
        style,
        ...rest
      },
      [
        title && preact.h("title", {}, title),
        ...iconNode.map(([tag, attrs]) => preact.h(tag, attrs)),
        ...preact.toChildArray(children)
      ]
    );
    Component.displayName = `${iconNamePascal}`;
    return Component;
  };
  var IconAccessPoint = createPreactComponent("outline", "access-point", "AccessPoint", [["path", { "d": "M12 12l0 .01", "key": "svg-0" }], ["path", { "d": "M14.828 9.172a4 4 0 0 1 0 5.656", "key": "svg-1" }], ["path", { "d": "M17.657 6.343a8 8 0 0 1 0 11.314", "key": "svg-2" }], ["path", { "d": "M9.168 14.828a4 4 0 0 1 0 -5.656", "key": "svg-3" }], ["path", { "d": "M6.337 17.657a8 8 0 0 1 0 -11.314", "key": "svg-4" }]]);
  var IconBabyCarriage = createPreactComponent("outline", "baby-carriage", "BabyCarriage", [["path", { "d": "M8 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "key": "svg-0" }], ["path", { "d": "M18 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "key": "svg-1" }], ["path", { "d": "M2 5h2.5l1.632 4.897a6 6 0 0 0 5.693 4.103h2.675a5.5 5.5 0 0 0 0 -11h-.5v6", "key": "svg-2" }], ["path", { "d": "M6 9h14", "key": "svg-3" }], ["path", { "d": "M9 17l1 -3", "key": "svg-4" }], ["path", { "d": "M16 14l1 3", "key": "svg-5" }]]);
  var IconBadgeCc = createPreactComponent("outline", "badge-cc", "BadgeCc", [["path", { "d": "M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z", "key": "svg-0" }], ["path", { "d": "M10 10.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0", "key": "svg-1" }], ["path", { "d": "M17 10.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0", "key": "svg-2" }]]);
  var IconBookmark = createPreactComponent("outline", "bookmark", "Bookmark", [["path", { "d": "M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z", "key": "svg-0" }]]);
  var IconBrandGithub = createPreactComponent("outline", "brand-github", "BrandGithub", [["path", { "d": "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5", "key": "svg-0" }]]);
  var IconBug = createPreactComponent("outline", "bug", "Bug", [["path", { "d": "M9 9v-1a3 3 0 0 1 6 0v1", "key": "svg-0" }], ["path", { "d": "M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3", "key": "svg-1" }], ["path", { "d": "M3 13l4 0", "key": "svg-2" }], ["path", { "d": "M17 13l4 0", "key": "svg-3" }], ["path", { "d": "M12 20l0 -6", "key": "svg-4" }], ["path", { "d": "M4 19l3.35 -2", "key": "svg-5" }], ["path", { "d": "M20 19l-3.35 -2", "key": "svg-6" }], ["path", { "d": "M4 7l3.75 2.4", "key": "svg-7" }], ["path", { "d": "M20 7l-3.75 2.4", "key": "svg-8" }]]);
  var IconBuildingBank = createPreactComponent("outline", "building-bank", "BuildingBank", [["path", { "d": "M3 21l18 0", "key": "svg-0" }], ["path", { "d": "M3 10l18 0", "key": "svg-1" }], ["path", { "d": "M5 6l7 -3l7 3", "key": "svg-2" }], ["path", { "d": "M4 10l0 11", "key": "svg-3" }], ["path", { "d": "M20 10l0 11", "key": "svg-4" }], ["path", { "d": "M8 14l0 3", "key": "svg-5" }], ["path", { "d": "M12 14l0 3", "key": "svg-6" }], ["path", { "d": "M16 14l0 3", "key": "svg-7" }]]);
  var IconCamera = createPreactComponent("outline", "camera", "Camera", [["path", { "d": "M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2", "key": "svg-0" }], ["path", { "d": "M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", "key": "svg-1" }]]);
  var IconCategory = createPreactComponent("outline", "category", "Category", [["path", { "d": "M4 4h6v6h-6z", "key": "svg-0" }], ["path", { "d": "M14 4h6v6h-6z", "key": "svg-1" }], ["path", { "d": "M4 14h6v6h-6z", "key": "svg-2" }], ["path", { "d": "M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", "key": "svg-3" }]]);
  var IconCheck = createPreactComponent("outline", "check", "Check", [["path", { "d": "M5 12l5 5l10 -10", "key": "svg-0" }]]);
  var IconChevronLeft = createPreactComponent("outline", "chevron-left", "ChevronLeft", [["path", { "d": "M15 6l-6 6l6 6", "key": "svg-0" }]]);
  var IconChevronRight = createPreactComponent("outline", "chevron-right", "ChevronRight", [["path", { "d": "M9 6l6 6l-6 6", "key": "svg-0" }]]);
  var IconCircleCheck = createPreactComponent("outline", "circle-check", "CircleCheck", [["path", { "d": "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "key": "svg-0" }], ["path", { "d": "M9 12l2 2l4 -4", "key": "svg-1" }]]);
  var IconCircleX = createPreactComponent("outline", "circle-x", "CircleX", [["path", { "d": "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "key": "svg-0" }], ["path", { "d": "M10 10l4 4m0 -4l-4 4", "key": "svg-1" }]]);
  var IconClock = createPreactComponent("outline", "clock", "Clock", [["path", { "d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "key": "svg-0" }], ["path", { "d": "M12 7v5l3 3", "key": "svg-1" }]]);
  var IconCopy = createPreactComponent("outline", "copy", "Copy", [["path", { "d": "M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z", "key": "svg-0" }], ["path", { "d": "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1", "key": "svg-1" }]]);
  var IconCurrencyDollar = createPreactComponent("outline", "currency-dollar", "CurrencyDollar", [["path", { "d": "M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2", "key": "svg-0" }], ["path", { "d": "M12 3v3m0 12v3", "key": "svg-1" }]]);
  var IconDatabaseOff = createPreactComponent("outline", "database-off", "DatabaseOff", [["path", { "d": "M12.983 8.978c3.955 -.182 7.017 -1.446 7.017 -2.978c0 -1.657 -3.582 -3 -8 -3c-1.661 0 -3.204 .19 -4.483 .515m-2.783 1.228c-.471 .382 -.734 .808 -.734 1.257c0 1.22 1.944 2.271 4.734 2.74", "key": "svg-0" }], ["path", { "d": "M4 6v6c0 1.657 3.582 3 8 3c.986 0 1.93 -.067 2.802 -.19m3.187 -.82c1.251 -.53 2.011 -1.228 2.011 -1.99v-6", "key": "svg-1" }], ["path", { "d": "M4 12v6c0 1.657 3.582 3 8 3c3.217 0 5.991 -.712 7.261 -1.74m.739 -3.26v-4", "key": "svg-2" }], ["path", { "d": "M3 3l18 18", "key": "svg-3" }]]);
  var IconDeviceFloppy = createPreactComponent("outline", "device-floppy", "DeviceFloppy", [["path", { "d": "M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2", "key": "svg-0" }], ["path", { "d": "M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "key": "svg-1" }], ["path", { "d": "M14 4l0 4l-6 0l0 -4", "key": "svg-2" }]]);
  var IconDeviceMobile = createPreactComponent("outline", "device-mobile", "DeviceMobile", [["path", { "d": "M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14z", "key": "svg-0" }], ["path", { "d": "M11 4h2", "key": "svg-1" }], ["path", { "d": "M12 17v.01", "key": "svg-2" }]]);
  var IconDownload = createPreactComponent("outline", "download", "Download", [["path", { "d": "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2", "key": "svg-0" }], ["path", { "d": "M7 11l5 5l5 -5", "key": "svg-1" }], ["path", { "d": "M12 4l0 12", "key": "svg-2" }]]);
  var IconEye = createPreactComponent("outline", "eye", "Eye", [["path", { "d": "M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", "key": "svg-0" }], ["path", { "d": "M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6", "key": "svg-1" }]]);
  var IconFileExport = createPreactComponent("outline", "file-export", "FileExport", [["path", { "d": "M14 3v4a1 1 0 0 0 1 1h4", "key": "svg-0" }], ["path", { "d": "M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3", "key": "svg-1" }]]);
  var IconFileImport = createPreactComponent("outline", "file-import", "FileImport", [["path", { "d": "M14 3v4a1 1 0 0 0 1 1h4", "key": "svg-0" }], ["path", { "d": "M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3", "key": "svg-1" }]]);
  var IconHistory = createPreactComponent("outline", "history", "History", [["path", { "d": "M12 8l0 4l2 2", "key": "svg-0" }], ["path", { "d": "M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5", "key": "svg-1" }]]);
  var IconInfoCircle = createPreactComponent("outline", "info-circle", "InfoCircle", [["path", { "d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "key": "svg-0" }], ["path", { "d": "M12 9h.01", "key": "svg-1" }], ["path", { "d": "M11 12h1v4h1", "key": "svg-2" }]]);
  var IconMessage = createPreactComponent("outline", "message", "Message", [["path", { "d": "M8 9h8", "key": "svg-0" }], ["path", { "d": "M8 13h6", "key": "svg-1" }], ["path", { "d": "M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z", "key": "svg-2" }]]);
  var IconMovie = createPreactComponent("outline", "movie", "Movie", [["path", { "d": "M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z", "key": "svg-0" }], ["path", { "d": "M8 4l0 16", "key": "svg-1" }], ["path", { "d": "M16 4l0 16", "key": "svg-2" }], ["path", { "d": "M4 8l4 0", "key": "svg-3" }], ["path", { "d": "M4 16l4 0", "key": "svg-4" }], ["path", { "d": "M4 12l16 0", "key": "svg-5" }], ["path", { "d": "M16 8l4 0", "key": "svg-6" }], ["path", { "d": "M16 16l4 0", "key": "svg-7" }]]);
  var IconRefresh = createPreactComponent("outline", "refresh", "Refresh", [["path", { "d": "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4", "key": "svg-0" }], ["path", { "d": "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4", "key": "svg-1" }]]);
  var IconSettings = createPreactComponent("outline", "settings", "Settings", [["path", { "d": "M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z", "key": "svg-0" }], ["path", { "d": "M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", "key": "svg-1" }]]);
  var IconThumbDown = createPreactComponent("outline", "thumb-down", "ThumbDown", [["path", { "d": "M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3", "key": "svg-0" }]]);
  var IconThumbUp = createPreactComponent("outline", "thumb-up", "ThumbUp", [["path", { "d": "M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3", "key": "svg-0" }]]);
  var IconTrash = createPreactComponent("outline", "trash", "Trash", [["path", { "d": "M4 7l16 0", "key": "svg-0" }], ["path", { "d": "M10 11l0 6", "key": "svg-1" }], ["path", { "d": "M14 11l0 6", "key": "svg-2" }], ["path", { "d": "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12", "key": "svg-3" }], ["path", { "d": "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3", "key": "svg-4" }]]);
  var IconTrendingDown = createPreactComponent("outline", "trending-down", "TrendingDown", [["path", { "d": "M3 7l6 6l4 -4l8 8", "key": "svg-0" }], ["path", { "d": "M21 10l0 7l-7 0", "key": "svg-1" }]]);
  var IconTrendingUp = createPreactComponent("outline", "trending-up", "TrendingUp", [["path", { "d": "M3 17l6 -6l4 4l8 -8", "key": "svg-0" }], ["path", { "d": "M14 7l7 0l0 7", "key": "svg-1" }]]);
  var IconUsers = createPreactComponent("outline", "users", "Users", [["path", { "d": "M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "key": "svg-0" }], ["path", { "d": "M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2", "key": "svg-1" }], ["path", { "d": "M16 3.13a4 4 0 0 1 0 7.75", "key": "svg-2" }], ["path", { "d": "M21 21v-2a4 4 0 0 0 -3 -3.85", "key": "svg-3" }]]);
  var IconVideo = createPreactComponent("outline", "video", "Video", [["path", { "d": "M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z", "key": "svg-0" }], ["path", { "d": "M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z", "key": "svg-1" }]]);
  var IconWorld = createPreactComponent("outline", "world", "World", [["path", { "d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "key": "svg-0" }], ["path", { "d": "M3.6 9h16.8", "key": "svg-1" }], ["path", { "d": "M3.6 15h16.8", "key": "svg-2" }], ["path", { "d": "M11.5 3a17 17 0 0 0 0 18", "key": "svg-3" }], ["path", { "d": "M12.5 3a17 17 0 0 1 0 18", "key": "svg-4" }]]);
  var IconX = createPreactComponent("outline", "x", "X", [["path", { "d": "M18 6l-12 12", "key": "svg-0" }], ["path", { "d": "M6 6l12 12", "key": "svg-1" }]]);
  var IconBrandYoutubeFilled = createPreactComponent("filled", "brand-youtube-filled", "BrandYoutubeFilled", [["path", { "d": "M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z", "key": "svg-0" }]]);
  function FloatingButton() {
    return u(
      "button",
      {
        onClick: togglePanel,
        className: "btn btn-lg btn-square btn-secondary rounded-l-full rounded-r-none",
        style: {
          position: "absolute",
          top: "50%",
          left: "-30px",
          transform: "translateY(-50%)",
          zIndex: 10
        },
        children: isPanelVisible.value ? u(IconChevronRight, { size: 20 }) : u(IconChevronLeft, { size: 20 })
      }
    );
  }
  const ENCODED_INNERTUBE_API_KEY = "QUl6YVN5QU9fRkoyU2xxVThRNFNURUhMR0NpbHdfWTlfMTFxY1c4";
  function decodeApiKey(encoded) {
    return atob(encoded);
  }
  const API_CONFIG = {
    INNERTUBE_API_KEY: decodeApiKey(ENCODED_INNERTUBE_API_KEY),
    INNERTUBE_CLIENT_NAME: "WEB",
    INNERTUBE_CLIENT_VERSION: "2.20201209.01.00",
    BASE_URL: "https://www.youtube.com",
    I_END_POINT: "/youtubei/v1"
  };
  const API_ENDPOINTS = {
    TUBEINSIGHTS_BASE: "https://tubeinsights.exyezed.cc"
  };
  const {
    INNERTUBE_API_KEY,
    INNERTUBE_CLIENT_NAME,
    INNERTUBE_CLIENT_VERSION,
    BASE_URL,
    I_END_POINT
  } = API_CONFIG;
  const TAB_TYPE_PARAMS = {
    videos: "EgZ2aWRlb3PyBgQKAjoA",
    shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
    live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D"
  };
  class YouTubeService {
    channelId = null;
    channelHandle = null;
    isVideoPage() {
      const path = window.location.pathname;
      return path.startsWith("/watch") || path.startsWith("/shorts/");
    }
    isPlaylistPage() {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      return params.has("list");
    }
    getPlaylistIdFromURL() {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      return params.get("list");
    }
    getVideoIdFromURL() {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path.startsWith("/watch")) {
        const params = new URLSearchParams(search);
        const videoId = params.get("v");
        return videoId !== null ? videoId : null;
      }
      if (path.startsWith("/shorts/")) {
        const match = path.match(/\/shorts\/([^\/\?]+)/);
        return match && match[1] ? match[1] : null;
      }
      return null;
    }
    async getChannelId() {
      if (this.channelId) return this.channelId;
      try {
        const channelIdMatch = window.location.pathname.match(
          /\/channel\/(UC[^\/]+)/
        );
        if (channelIdMatch && channelIdMatch[1]) {
          this.channelId = channelIdMatch[1];
          await this.scrapeChannelHandle();
          return this.channelId;
        }
        const handle = this.getChannelHandleFromURL();
        if (!handle) return null;
        this.channelHandle = handle;
        const youtubeUrl = `https://www.youtube.com/@${handle}`;
        const response = await fetch(youtubeUrl);
        if (!response.ok) return null;
        const html = await response.text();
        let match = html.match(
          /<meta\s+itemprop="identifier"\s+content="(UC[^"]+)"/
        );
        if (match && match[1]) {
          this.channelId = match[1];
          return this.channelId;
        }
        match = html.match(
          /<link\s+rel="canonical"\s+href="https:\/\/www\.youtube\.com\/channel\/(UC[^"]+)"/
        );
        if (match && match[1]) {
          this.channelId = match[1];
          return this.channelId;
        }
        match = html.match(
          /https:\/\/www\.youtube\.com\/feeds\/videos\.xml\?channel_id=(UC[^"&]+)/
        );
        if (match && match[1]) {
          this.channelId = match[1];
          return this.channelId;
        }
        match = html.match(/["']browseId["']\s*:\s*["'](UC[^"']+)["']/);
        if (match && match[1]) {
          this.channelId = match[1];
          return this.channelId;
        }
      } catch (error) {
        logger.youtube.error("Error getting channel ID:", error);
      }
      return null;
    }
    async scrapeChannelHandle() {
      try {
        const html = document.documentElement.innerHTML;
        let match = html.match(
          /["']vanityChannelUrl["']\s*:\s*["']http[s]?:\/\/www\.youtube\.com\/@([^"']+)["']/
        );
        if (match && match[1]) {
          this.channelHandle = match[1];
          return;
        }
        match = html.match(
          /<link\s+rel="canonical"\s+href="https:\/\/www\.youtube\.com\/@([^"\/]+)"/
        );
        if (match && match[1]) {
          this.channelHandle = match[1];
          return;
        }
        this.channelHandle = this.channelId;
      } catch (error) {
        logger.youtube.error("Error scraping handle:", error);
        this.channelHandle = this.channelId;
      }
    }
    getChannelHandleFromURL() {
      const handleMatch = window.location.pathname.match(/^\/@([^\/]+)/);
      if (handleMatch && handleMatch[1]) {
        return handleMatch[1];
      }
      return null;
    }
    getChannelHandle() {
      return this.channelHandle;
    }
    clearCache() {
      this.channelId = null;
      this.channelHandle = null;
    }
    async fetchTabCount(tabType, onProgress) {
      const channelId = await this.getChannelId();
      if (!channelId) return { count: 0, views: 0 };
      let totalCount = 0;
      let totalViews = 0;
      let continuation = void 0;
      let pageCount = 0;
      const maxPages = 100;
      try {
        do {
          const params = TAB_TYPE_PARAMS[tabType];
          const response = await this.innerTubeRequest("/browse", {
            browseId: channelId,
            params,
            continuation
          });
          const items = this.parseTabData(tabType, response);
          const videoIds = this.parseVideoIds(items, tabType);
          const views = this.parseVideoViews(items, tabType);
          if (videoIds.length === 0 && pageCount > 0) {
            break;
          }
          totalCount += videoIds.length;
          totalViews += views.reduce((sum, view) => sum + view, 0);
          continuation = this.getContinuation(response, tabType);
          pageCount++;
          if (onProgress) {
            onProgress(totalCount, totalViews, !!continuation);
          }
          if (!continuation || pageCount >= maxPages) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        } while (continuation);
        return { count: totalCount, views: totalViews };
      } catch (error) {
        logger.youtube.error(
          `Error fetching ${tabType} at page ${pageCount}:`,
          error
        );
        return { count: totalCount > 0 ? totalCount : 0, views: totalViews };
      }
    }
    async innerTubeRequest(endpoint, data) {
      const url = `${BASE_URL}${I_END_POINT}${endpoint}?key=${INNERTUBE_API_KEY}&prettyPrint=false`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": INNERTUBE_CLIENT_VERSION,
          "Accept-Language": "en-US,en;q=0.9"
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: INNERTUBE_CLIENT_NAME,
              clientVersion: INNERTUBE_CLIENT_VERSION,
              hl: "en",
              gl: "US",
              utcOffsetMinutes: 0
            }
          },
          ...data
        })
      });
      return await response.json();
    }
    getContinuation(data, tabType) {
      if (tabType === "shorts") {
        const tab2 = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
          (t) => {
            return t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS[tabType];
          }
        );
        const contents = tab2?.tabRenderer?.content?.richGridRenderer?.contents || [];
        const continuationItem = contents.find(
          (c) => c.continuationItemRenderer
        );
        if (continuationItem) {
          return continuationItem.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        }
        const continuationItems = data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
        const contItem = continuationItems.find(
          (c) => c.continuationItemRenderer
        );
        if (contItem) {
          return contItem.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        }
        return void 0;
      }
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
        (t) => {
          return t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS[tabType];
        }
      );
      const items = tab?.tabRenderer?.content?.richGridRenderer?.contents || data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
      const continuation = items[items.length - 1];
      const renderer = continuation?.continuationItemRenderer;
      if (!renderer) return void 0;
      return renderer?.continuationEndpoint?.continuationCommand?.token;
    }
    parseTabData(tabType, data) {
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
        (t) => {
          return t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS[tabType];
        }
      );
      if (tabType === "shorts" && tab?.tabRenderer?.content?.richGridRenderer) {
        const contents = tab.tabRenderer.content.richGridRenderer.contents || [];
        return contents.map((c) => c.richItemRenderer?.content || c).filter((c) => c.shortsLockupViewModel || c.reelItemRenderer);
      }
      if (tabType === "shorts" && (data.onResponseReceivedActions || data.onResponseReceivedEndpoints)) {
        const continuationItems = data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
        return continuationItems.map((c) => c.richItemRenderer?.content || c).filter((c) => c.shortsLockupViewModel || c.reelItemRenderer);
      }
      return tab?.tabRenderer?.content?.richGridRenderer?.contents?.map(
        (c) => c.richItemRenderer?.content || c
      ) || data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems?.map(
        (c) => c.richItemRenderer?.content || c
      ) || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
    }
    parseVideoIds(items, tabType) {
      if (tabType === "shorts") {
        return items.filter((item) => item.shortsLockupViewModel || item.reelItemRenderer).map((item) => {
          const lockup = item.shortsLockupViewModel;
          if (lockup) {
            return lockup.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
          }
          const renderer = item.reelItemRenderer;
          return renderer.videoId;
        }).filter((id) => id);
      }
      return items.filter((item) => item.videoRenderer).map((item) => item.videoRenderer.videoId).filter((id) => id);
    }
    parseVideoViews(items, tabType) {
      if (tabType === "shorts") {
        return items.filter((item) => item.shortsLockupViewModel || item.reelItemRenderer).map((item) => {
          const lockup = item.shortsLockupViewModel;
          if (lockup) {
            const accessibilityText = lockup.accessibilityText || "";
            return this.parseViewCount(accessibilityText);
          }
          const renderer = item.reelItemRenderer;
          const viewCountText = renderer?.viewCountText?.simpleText || renderer?.viewCountText?.runs?.[0]?.text || renderer?.viewCountText?.accessibility?.accessibilityData?.label || "0";
          return this.parseViewCount(viewCountText);
        });
      }
      return items.filter((item) => item.videoRenderer).map((item) => {
        const viewCountText = item.videoRenderer?.viewCountText?.simpleText || item.videoRenderer?.viewCountText?.runs?.[0]?.text || "0";
        return this.parseViewCount(viewCountText);
      });
    }
    parseViewCount(viewText) {
      if (!viewText) return 0;
      const text = viewText.toLowerCase();
      const multipliers = {
        thousand: 1e3,
        million: 1e6,
        billion: 1e9,
        k: 1e3,
        m: 1e6,
        b: 1e9
      };
      const wordMatch = text.match(/([\d,.]+)\s*(thousand|million|billion)\s*/i);
      if (wordMatch && wordMatch[1] && wordMatch[2]) {
        const numberStr = wordMatch[1].replace(/,/g, "");
        const number = parseFloat(numberStr);
        if (!isNaN(number)) {
          const multiplierWord = wordMatch[2].toLowerCase();
          if (multipliers[multiplierWord]) {
            return Math.floor(number * multipliers[multiplierWord]);
          }
        }
      }
      const suffixMatch = text.match(/([\d,.]+)\s*([kmb])\b/i);
      if (suffixMatch && suffixMatch[1] && suffixMatch[2]) {
        const numberStr = suffixMatch[1].replace(/,/g, "");
        const number = parseFloat(numberStr);
        if (!isNaN(number)) {
          const suffix = suffixMatch[2].toLowerCase();
          if (multipliers[suffix]) {
            return Math.floor(number * multipliers[suffix]);
          }
        }
      }
      const plainMatch = text.match(/\b([\d,]+)\b/);
      if (plainMatch && plainMatch[1]) {
        const numberStr = plainMatch[1].replace(/,/g, "");
        const number = parseFloat(numberStr);
        if (!isNaN(number) && number > 0) {
          return Math.floor(number);
        }
      }
      return 0;
    }
async getAudioTracks(videoId) {
      try {
        const response = await this.innerTubeRequest("/player", {
          videoId
        });
        const videoTitle = response.videoDetails?.title || "video";
        const captions = response.captions?.playerCaptionsTracklistRenderer;
        const audioTracks = [];
        if (captions?.audioTracks) {
          captions.audioTracks.forEach((track, index2) => {
            const trackId = track.audioTrackId || `track-${index2}`;
            const langCode = trackId.split(".")[0];
            const langNames = {
              original: "original",
              en: "English (en)",
              "en-US": "English (en-US)",
              "en-GB": "English (en-GB)",
              es: "español (es)",
              "es-ES": "español (es-ES)",
              "es-419": "español (es-419)",
              pt: "português (pt)",
              "pt-BR": "português (pt-BR)",
              "pt-PT": "português (pt-PT)",
              fr: "français (fr)",
              "fr-FR": "français (fr-FR)",
              "fr-CA": "français (fr-CA)",
              ru: "русский (ru)",
              zh: "中文 (zh)",
              vi: "Tiếng Việt (vi)",
              hi: "हिन्दी (hi)",
              bn: "বাংলা (bn)",
              ja: "日本語 (ja)",
              af: "Afrikaans (af)",
              am: "አማርኛ (am)",
              ar: "العربية (ar)",
              as: "Assamese (as)",
              az: "azərbaycan (az)",
              be: "Belarusian (be)",
              bg: "български (bg)",
              bs: "bosanski (bs)",
              ca: "català (ca)",
              cs: "čeština (cs)",
              da: "dansk (da)",
              de: "Deutsch (de)",
              el: "Ελληνικά (el)",
              et: "eesti (et)",
              eu: "Basque (eu)",
              fa: "فارسی (fa)",
              fi: "suomi (fi)",
              fil: "Filipino (fil)",
              gl: "Galician (gl)",
              gu: "ગુજરાતી (gu)",
              hr: "hrvatski (hr)",
              hu: "magyar (hu)",
              hy: "Armenian (hy)",
              id: "Indonesia (id)",
              is: "Icelandic (is)",
              it: "italiano (it)",
              iw: "עברית (iw)",
              ka: "Georgian (ka)",
              kk: "Kazakh (kk)",
              ko: "한국어 (ko)",
              km: "Khmer (km)",
              kn: "ಕನ್ನಡ (kn)",
              ky: "Kyrgyz (ky)",
              lo: "Lao (lo)",
              lt: "lietuvių (lt)",
              lv: "latviešu (lv)",
              mk: "Macedonian (mk)",
              ml: "മലയാളം (ml)",
              mn: "Mongolian (mn)",
              mr: "मराठी (mr)",
              ms: "Melayu (ms)",
              my: "Burmese (my)",
              no: "norsk (no)",
              ne: "Nepali (ne)",
              nl: "Nederlands (nl)",
              or: "Odia (or)",
              pa: "ਪੰਜਾਬੀ (pa)",
              pl: "polski (pl)",
              ro: "română (ro)",
              si: "Sinhala (si)",
              sk: "slovenčina (sk)",
              sl: "slovenščina (sl)",
              sq: "Albanian (sq)",
              sr: "српски (sr)",
              sv: "svenska (sv)",
              sw: "Kiswahili (sw)",
              ta: "தமிழ் (ta)",
              te: "తెలుగు (te)",
              th: "ไทย (th)",
              tr: "Türkçe (tr)",
              uk: "українська (uk)",
              ur: "اردو (ur)",
              uz: "o'zbek (uz)",
              "zh-Hans": "简体中文 (zh-Hans)",
              "zh-Hant": "繁體中文 (zh-Hant)",
              "zh-CN": "中文（中国） (zh-CN)",
              "zh-HK": "中文（香港） (zh-HK)",
              "zh-TW": "中文（台灣） (zh-TW)",
              zu: "Zulu (zu)"
            };
            const baseLangCode = langCode.includes("-") ? langCode.split("-")[0] : langCode;
            const displayName = langNames[langCode] || langNames[baseLangCode] || `${langCode} (${langCode})`;
            const isDefault = index2 === (captions.defaultAudioTrackIndex || 0);
            audioTracks.push({
              id: trackId,
              displayName,
              languageCode: langCode,
              audioIsDefault: isDefault
            });
          });
        }
        return {
          videoId,
          videoTitle,
          audioTracks
        };
      } catch (error) {
        logger.youtube.error("Error getting audio tracks:", error);
        return null;
      }
    }
async fetchPlaylistVideos(playlistId, onProgress) {
      try {
        const allVideos = [];
        let continuationToken = void 0;
        let requestCount = 0;
        const maxRequests = 100;
        const initialResponse = await this.innerTubeRequest("/browse", {
          browseId: `VL${playlistId}`
        });
        const contents = initialResponse.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;
        if (contents) {
          contents.forEach((item) => {
            if (item.playlistVideoRenderer) {
              allVideos.push(item.playlistVideoRenderer);
            } else if (item.continuationItemRenderer) {
              const commands = item.continuationItemRenderer.continuationEndpoint?.commandExecutorCommand?.commands;
              if (commands) {
                for (const command of commands) {
                  if (command.continuationCommand?.token) {
                    continuationToken = command.continuationCommand.token;
                    break;
                  }
                }
              }
            }
          });
        }
        requestCount++;
        if (onProgress) {
          onProgress(allVideos.length, !!continuationToken);
        }
        while (continuationToken && requestCount < maxRequests) {
          const contResponse = await this.innerTubeRequest("/browse", {
            continuation: continuationToken
          });
          const contItems = contResponse.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems;
          if (!contItems) break;
          continuationToken = void 0;
          contItems.forEach((item) => {
            if (item.playlistVideoRenderer) {
              allVideos.push(item.playlistVideoRenderer);
            } else if (item.continuationItemRenderer) {
              const commands = item.continuationItemRenderer.continuationEndpoint?.commandExecutorCommand?.commands;
              if (commands) {
                for (const command of commands) {
                  if (command.continuationCommand?.token) {
                    continuationToken = command.continuationCommand.token;
                    break;
                  }
                }
              }
            }
          });
          requestCount++;
          if (onProgress) {
            onProgress(allVideos.length, !!continuationToken);
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return allVideos;
      } catch (error) {
        logger.youtube.error("Error fetching playlist videos:", error);
        return [];
      }
    }
async getSubtitles(videoId) {
      try {
        const response = await this.innerTubeRequest("/player", {
          videoId
        });
        const videoTitle = response.videoDetails?.title || "video";
        const captions = response.captions?.playerCaptionsTracklistRenderer;
        if (!captions) {
          return {
            videoId,
            videoTitle,
            subtitles: [],
            autoTransSubtitles: []
          };
        }
        const captionTracks = captions.captionTracks || [];
        const translationLanguages = captions.translationLanguages || [];
        const subtitles = captionTracks.map((track) => {
          let url = track.baseUrl;
          if (!url.includes("fmt=")) {
            url += "&fmt=srv1";
          }
          return {
            name: track.name?.simpleText || track.languageCode,
            languageCode: track.languageCode,
            url,
            isAutoGenerated: track.kind === "asr"
          };
        });
        const autoTransSubtitles = translationLanguages.map(
          (lang) => ({
            name: lang.languageName?.simpleText || lang.languageCode,
            languageCode: lang.languageCode,
            url: "",
isAutoGenerated: true
          })
        );
        return {
          videoId,
          videoTitle,
          subtitles,
          autoTransSubtitles
        };
      } catch (error) {
        logger.youtube.error("Error getting subtitles:", error);
        return null;
      }
    }
  }
  function CountryFlag({ countryCode, size = "md" }) {
    const sizeMap = {
      sm: 24,
      md: 32,
      lg: 40,
      xl: 48
    };
    const flagSize = sizeMap[size];
    const flagUrl = `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/${countryCode.toLowerCase()}.svg`;
    return u(
      "img",
      {
        src: flagUrl,
        alt: `${countryCode} flag`,
        width: flagSize,
        height: flagSize * 0.75,
        style: { display: "inline-block", verticalAlign: "middle" }
      }
    );
  }
  const countryNames = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BQ: "Bonaire, Sint Eustatius and Saba",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BV: "Bouvet Island",
    BR: "Brazil",
    IO: "British Indian Ocean Territory",
    BN: "Brunei Darussalam",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    CV: "Cabo Verde",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CX: "Christmas Island",
    CC: "Cocos Islands",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CD: "Congo, Democratic Republic of the",
    CK: "Cook Islands",
    CR: "Costa Rica",
    HR: "Croatia",
    CU: "Cuba",
    CW: "Curaçao",
    CY: "Cyprus",
    CZ: "Czechia",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    SZ: "Eswatini",
    ET: "Ethiopia",
    FK: "Falkland Islands",
    FO: "Faroe Islands",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GF: "French Guiana",
    PF: "French Polynesia",
    TF: "French Southern Territories",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Greece",
    GL: "Greenland",
    GD: "Grenada",
    GP: "Guadeloupe",
    GU: "Guam",
    GT: "Guatemala",
    GG: "Guernsey",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HM: "Heard Island and McDonald Islands",
    VA: "Holy See",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IM: "Isle of Man",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JE: "Jersey",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KP: "North Korea",
    KR: "South Korea",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Lao People's Democratic Republic",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MU: "Mauritius",
    YT: "Mayotte",
    MX: "Mexico",
    FM: "Micronesia",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MS: "Montserrat",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NC: "New Caledonia",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk Island",
    MK: "North Macedonia",
    MP: "Northern Mariana Islands",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestine, State of",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PN: "Pitcairn",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russian Federation",
    RW: "Rwanda",
    RE: "Réunion",
    BL: "Saint Barthélemy",
    SH: "Saint Helena, Ascension and Tristan da Cunha",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    MF: "Saint Martin",
    PM: "Saint Pierre and Miquelon",
    VC: "Saint Vincent and the Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome and Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SX: "Sint Maarten",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    GS: "South Georgia and the South Sandwich Islands",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SJ: "Svalbard and Jan Mayen",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syrian Arab Republic",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TC: "Turks and Caicos Islands",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UM: "United States Minor Outlying Islands",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Venezuela",
    VN: "Viet Nam",
    VG: "Virgin Islands",
    VI: "Virgin Islands",
    WF: "Wallis and Futuna",
    EH: "Western Sahara",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe"
  };
  const formatNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var relativeTime$2 = { exports: {} };
  var relativeTime$1 = relativeTime$2.exports;
  var hasRequiredRelativeTime;
  function requireRelativeTime() {
    if (hasRequiredRelativeTime) return relativeTime$2.exports;
    hasRequiredRelativeTime = 1;
    (function(module, exports$1) {
      !(function(r, e) {
        module.exports = e();
      })(relativeTime$1, (function() {
        return function(r, e, t) {
          r = r || {};
          var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
          function i(r2, e2, t2, o2) {
            return n.fromToBase(r2, e2, t2, o2);
          }
          t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u2) {
            for (var f2, a, s, l = i2.$locale().relativeTime || o, h2 = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h2.length, c = 0; c < m; c += 1) {
              var y = h2[c];
              y.d && (f2 = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
              var p = (r.rounding || Math.round)(Math.abs(f2));
              if (s = f2 > 0, p <= y.r || !y.r) {
                p <= 1 && c > 0 && (y = h2[c - 1]);
                var v = l[y.l];
                u2 && (p = u2("" + p)), a = "string" == typeof v ? v.replace("%d", p) : v(p, n2, y.l, s);
                break;
              }
            }
            if (n2) return a;
            var M = s ? l.future : l.past;
            return "function" == typeof M ? M(a) : M.replace("%s", a);
          }, n.to = function(r2, e2) {
            return i(r2, e2, this, true);
          }, n.from = function(r2, e2) {
            return i(r2, e2, this);
          };
          var d = function(r2) {
            return r2.$u ? t.utc() : t();
          };
          n.toNow = function(r2) {
            return this.to(d(this), r2);
          }, n.fromNow = function(r2) {
            return this.from(d(this), r2);
          };
        };
      }));
    })(relativeTime$2);
    return relativeTime$2.exports;
  }
  var relativeTimeExports = requireRelativeTime();
  const relativeTime = getDefaultExportFromCjs(relativeTimeExports);
  dayjs.extend(relativeTime);
  const CATEGORY_MAP = {
    "1": "Film & Animation",
    "2": "Autos & Vehicles",
    "10": "Music",
    "15": "Pets & Animals",
    "17": "Sports",
    "18": "Short Movies",
    "19": "Travel & Events",
    "20": "Gaming",
    "21": "Videoblogging",
    "22": "People & Blogs",
    "23": "Comedy",
    "24": "Entertainment",
    "25": "News & Politics",
    "26": "Howto & Style",
    "27": "Education",
    "28": "Science & Technology",
    "29": "Nonprofits & Activism",
    "30": "Movies",
    "31": "Anime/Animation",
    "32": "Action/Adventure",
    "33": "Classics",
    "34": "Comedy",
    "35": "Documentary",
    "36": "Drama",
    "37": "Family",
    "38": "Foreign",
    "39": "Horror",
    "40": "Sci-Fi/Fantasy",
    "41": "Thriller",
    "42": "Shorts",
    "43": "Shows",
    "44": "Trailers"
  };
  function InsightsTab() {
    const [channelId, setChannelId] = hooks.useState(null);
    const [channelHandle, setChannelHandle] = hooks.useState(null);
    const [channelInfo, setChannelInfo] = hooks.useState(null);
    const [videoId, setVideoId] = hooks.useState(null);
    const [videoInfo, setVideoInfo] = hooks.useState(null);
    const [dislikes, setDislikes2] = hooks.useState(0);
    const [monetization, setMonetization] = hooks.useState(null);
    const [loading, setLoading] = hooks.useState(false);
    const [tabs, setTabs] = hooks.useState([
      { type: "videos", label: "Videos", count: 0, views: 0, isLoading: false },
      { type: "shorts", label: "Shorts", count: 0, views: 0, isLoading: false },
      { type: "live", label: "Live", count: 0, views: 0, isLoading: false }
    ]);
    const [youtubeService2] = hooks.useState(() => new YouTubeService());
    const lastMonetizationCheckRef = hooks.useRef(null);
    const [copiedKeywords, setCopiedKeywords] = hooks.useState(false);
    const [copiedTopics, setCopiedTopics] = hooks.useState(false);
    const [copiedDescription, setCopiedDescription] = hooks.useState(false);
    const isChannelPage = () => {
      const path = window.location.pathname;
      return path.startsWith("/@") || path.startsWith("/channel/");
    };
    const isVideoPage = () => {
      return youtubeService2.isVideoPage();
    };
    const calculateAge = (publishedAt) => {
      const now = dayjs();
      const published = dayjs(publishedAt);
      const years = now.diff(published, "year");
      const months = now.diff(published, "month") % 12;
      const days = now.diff(published, "day") % 30;
      const hours = now.diff(published, "hour") % 24;
      const parts = [];
      if (years > 0) parts.push(`${years} yr`);
      if (months > 0) parts.push(`${months} mo`);
      if (days > 0 && years === 0) parts.push(`${days} d`);
      if (parts.length === 0 && hours > 0) parts.push(`${hours} hr`);
      return parts.join(" ") || "< 1 hr";
    };
    const formatDuration = (duration) => {
      if (duration === "P0D" || duration === "PT0S") {
        return "0:00";
      }
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return duration;
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const seconds = match[3] ? parseInt(match[3]) : 0;
      if (hours === 0 && minutes === 0 && seconds === 0) {
        return "0:00";
      }
      const parts = [];
      if (hours > 0)
        parts.push(`${hours}:${minutes.toString().padStart(2, "0")}`);
      else parts.push(minutes.toString());
      parts.push(seconds.toString().padStart(2, "0"));
      return parts.join(":");
    };
    const linkifyText = hooks.useMemo(() => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return (text) => {
        const parts = text.split(urlRegex);
        return parts.map((part, index2) => {
          if (part.match(urlRegex)) {
            return u(
              "a",
              {
                href: part,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline break-all",
                children: part
              },
              index2
            );
          }
          return part;
        });
      };
    }, []);
    const checkMonetizationAsync = async (urlOrId) => {
      if (lastMonetizationCheckRef.current === urlOrId) {
        return;
      }
      lastMonetizationCheckRef.current = urlOrId;
      try {
        const url = urlOrId.startsWith("http") ? urlOrId : `https://www.youtube.com/channel/${urlOrId}`;
        const monetizationResponse = await fetch(
          `https://tubeinsights.exyezed.cc/api/monetization?url=${encodeURIComponent(
          url
        )}`
        );
        if (monetizationResponse.ok) {
          const monetizationData = await monetizationResponse.json();
          const isMonetized = monetizationData.monetization || false;
          setMonetization(isMonetized);
        } else {
          setMonetization(null);
        }
      } catch (err) {
        console.error("Failed to check monetization:", err);
        setMonetization(null);
        lastMonetizationCheckRef.current = null;
      }
    };
    const fetchChannelData2 = async (id) => {
      setLoading(true);
      setMonetization(null);
      try {
        const response = await fetch(
          `https://tubeinsights.exyezed.cc/api/channels/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch channel info");
        const data = await response.json();
        if (data && data.items && data.items.length > 0) {
          const item = data.items[0];
          const snippet = item.snippet;
          const brandingSettings = item.brandingSettings;
          const statistics = item.statistics;
          const bannerUrl = brandingSettings?.image?.bannerExternalUrl;
          const info = {
            channelId: item.id,
            title: snippet.title,
            description: snippet.description,
            publishedAt: snippet.publishedAt,
            thumbnails: snippet.thumbnails,
            customUrl: snippet.customUrl,
            country: snippet.country,
            keywords: brandingSettings?.channel?.keywords?.split(" ") || [],
            bannerExternalUrl: bannerUrl ? `${bannerUrl}=s1600` : void 0,
            viewCount: statistics.viewCount,
            subscriberCount: statistics.subscriberCount,
            videoCount: statistics.videoCount,
            topicDetails: item.topicDetails
          };
          setChannelInfo(info);
          setLoading(false);
          checkMonetizationAsync(item.id);
        }
      } catch (err) {
        console.error("Failed to fetch channel info:", err);
        setLoading(false);
      }
    };
    const fetchVideoData2 = async (id) => {
      setLoading(true);
      setMonetization(null);
      setDislikes2(0);
      try {
        const response = await fetch(
          `https://tubeinsights.exyezed.cc/api/videos/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch video info");
        const data = await response.json();
        if (data && data.items && data.items.length > 0) {
          const item = data.items[0];
          const snippet = item.snippet;
          const contentDetails = item.contentDetails;
          const statistics = item.statistics;
          const status = item.status;
          let channelCountry;
          try {
            const channelResponse = await fetch(
              `https://tubeinsights.exyezed.cc/api/channels/${snippet.channelId}`
            );
            if (channelResponse.ok) {
              const channelData = await channelResponse.json();
              if (channelData && channelData.items && channelData.items.length > 0) {
                channelCountry = channelData.items[0].snippet.country;
              }
            }
          } catch {
          }
          const info = {
            videoId: item.id,
            title: snippet.title,
            description: snippet.description,
            publishedAt: snippet.publishedAt,
            thumbnails: snippet.thumbnails,
            channelTitle: snippet.channelTitle,
            channelId: snippet.channelId,
            categoryId: snippet.categoryId,
            duration: contentDetails.duration,
            viewCount: statistics.viewCount || "0",
            likeCount: statistics.likeCount || "0",
            commentCount: statistics.commentCount || "0",
            madeForKids: status.madeForKids || false,
            tags: snippet.tags || [],
            isLive: snippet.liveBroadcastContent === "live",
            channelCountry
          };
          setVideoInfo(info);
          setLoading(false);
          try {
            const dislikeResponse = await fetch(
              `https://returnyoutubedislikeapi.com/votes?videoId=${id}`
            );
            if (dislikeResponse.ok) {
              const dislikeData = await dislikeResponse.json();
              setDislikes2(dislikeData.dislikes || 0);
            }
          } catch {
            setDislikes2(0);
          }
          const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
          checkMonetizationAsync(videoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch video info:", err);
        setLoading(false);
      }
    };
    const loadChannelInfo = async () => {
      if (activeTab.value !== "insights") {
        return;
      }
      if (isVideoPage()) {
        const vId = youtubeService2.getVideoIdFromURL();
        if (vId !== videoId) {
          setVideoId(vId);
          setChannelId(null);
          setChannelHandle(null);
          setChannelInfo(null);
          setVideoInfo(null);
          setMonetization(null);
          lastMonetizationCheckRef.current = null;
          if (vId && isPanelVisible.value) {
            await fetchVideoData2(vId);
          }
        }
        return;
      }
      if (!isChannelPage()) {
        setChannelId(null);
        setChannelHandle(null);
        setChannelInfo(null);
        setVideoId(null);
        setVideoInfo(null);
        setDislikes2(0);
        setMonetization(null);
        lastMonetizationCheckRef.current = null;
        setTabs([
          {
            type: "videos",
            label: "Videos",
            count: 0,
            views: 0,
            isLoading: false
          },
          {
            type: "shorts",
            label: "Shorts",
            count: 0,
            views: 0,
            isLoading: false
          },
          { type: "live", label: "Live", count: 0, views: 0, isLoading: false }
        ]);
        return;
      }
      const id = await youtubeService2.getChannelId();
      const handle = youtubeService2.getChannelHandle();
      if (id !== channelId) {
        setChannelId(id);
        setChannelHandle(handle);
        setVideoId(null);
        setVideoInfo(null);
        setMonetization(null);
        lastMonetizationCheckRef.current = null;
        setTabs([
          {
            type: "videos",
            label: "Videos",
            count: 0,
            views: 0,
            isLoading: false
          },
          {
            type: "shorts",
            label: "Shorts",
            count: 0,
            views: 0,
            isLoading: false
          },
          { type: "live", label: "Live", count: 0, views: 0, isLoading: false }
        ]);
        if (id && isPanelVisible.value) {
          await fetchChannelData2(id);
        }
      }
    };
    const loadTabCounts = async () => {
      if (!channelId) return;
      setTabs((prev) => prev.map((t) => ({ ...t, isLoading: true })));
      await Promise.all(
        tabs.map(async (tab) => {
          const result = await youtubeService2.fetchTabCount(
            tab.type,
            (currentCount, currentViews, hasMore) => {
              setTabs(
                (prev) => prev.map(
                  (t) => t.type === tab.type ? {
                    ...t,
                    count: currentCount,
                    views: currentViews,
                    isLoading: hasMore
                  } : t
                )
              );
            }
          );
          setTabs(
            (prev) => prev.map(
              (t) => t.type === tab.type ? {
                ...t,
                count: result.count,
                views: result.views,
                isLoading: false
              } : t
            )
          );
        })
      );
    };
    hooks.useEffect(() => {
      if (activeTab.value !== "insights") {
        return;
      }
      loadChannelInfo();
      const checkUrlChange = () => {
        if (!isChannelPage() && !isVideoPage()) {
          if (channelId !== null || videoId !== null) {
            setChannelId(null);
            setChannelHandle(null);
            setChannelInfo(null);
            setVideoId(null);
            setVideoInfo(null);
            setDislikes2(0);
            setMonetization(null);
            lastMonetizationCheckRef.current = null;
            setTabs([
              {
                type: "videos",
                label: "Videos",
                count: 0,
                views: 0,
                isLoading: false
              },
              {
                type: "shorts",
                label: "Shorts",
                count: 0,
                views: 0,
                isLoading: false
              },
              {
                type: "live",
                label: "Live",
                count: 0,
                views: 0,
                isLoading: false
              }
            ]);
          }
          return;
        }
        const currentHandle = youtubeService2.getChannelHandleFromURL();
        const currentVideoId = youtubeService2.getVideoIdFromURL();
        if (currentHandle !== channelHandle || currentVideoId !== videoId) {
          youtubeService2.clearCache();
          loadChannelInfo();
        }
      };
      const intervalId = setInterval(checkUrlChange, 1e3);
      return () => clearInterval(intervalId);
    }, [channelHandle, videoId, activeTab.value]);
    hooks.useEffect(() => {
      if (channelId && activeTab.value === "insights" && isPanelVisible.value) {
        const hasLoadedCounts = tabs.some((tab) => tab.count > 0);
        if (!hasLoadedCounts) {
          loadTabCounts();
        }
      }
    }, [channelId, activeTab.value, isPanelVisible.value]);
    hooks.useEffect(() => {
      if (activeTab.value === "insights" && isPanelVisible.value && !loading) {
        if (channelId && !channelInfo) {
          fetchChannelData2(channelId);
        }
        if (videoId && !videoInfo) {
          fetchVideoData2(videoId);
        }
      }
    }, [
      activeTab.value,
      isPanelVisible.value,
      channelId,
      videoId,
      channelInfo,
      videoInfo
    ]);
    if (!isChannelPage() && !isVideoPage()) {
      return u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: "Navigate to a YouTube channel or video page to see insights" }) });
    }
    if (loading && !channelInfo && !videoInfo) {
      return u("div", { className: "text-center py-8", children: u("span", { className: "loading loading-spinner loading-lg" }) });
    }
    return u("div", { className: "space-y-4", children: [
      videoInfo && u(preact.Fragment, { children: [
        youtubeService2.isVideoPage() && window.location.pathname.startsWith("/shorts/") ? u("div", { className: "flex gap-2", children: ["oardefault", "oar1", "oar2", "oar3"].map((quality) => u(
          "a",
          {
            href: `https://i.ytimg.com/vi/${videoInfo.videoId}/${quality}.jpg`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex-1 rounded-lg overflow-hidden hover:opacity-80 transition-opacity",
            style: { aspectRatio: "9/16" },
            children: u(
              "img",
              {
                src: `https://i.ytimg.com/vi/${videoInfo.videoId}/${quality}.jpg`,
                alt: `${videoInfo.title} - ${quality}`,
                className: "w-full h-full object-cover"
              }
            )
          },
          quality
        )) }) : u(
          "a",
          {
            href: `https://i.ytimg.com/vi/${videoInfo.videoId}/maxresdefault.jpg`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "block aspect-video rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer",
            children: u(
              "img",
              {
                src: videoInfo.thumbnails?.high?.url || videoInfo.thumbnails?.medium?.url,
                alt: videoInfo.title,
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
u("div", { children: [
u("h2", { className: "text-xl font-semibold mb-2", children: videoInfo.title }),
u("div", { className: "text-xl opacity-60", children: [
            "Title Length: ",
            videoInfo.title.length,
            " characters"
          ] })
        ] }),
u("div", { children: [
u("div", { className: "flex items-center justify-between gap-2", children: [
u(
              "a",
              {
                href: `https://www.youtube.com/channel/${videoInfo.channelId}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary text-xl hover:underline font-semibold",
                children: videoInfo.channelTitle
              }
            ),
u(
              "a",
              {
                href: `https://tubeinsights.exyezed.cc/info/direct/${window.location.pathname.startsWith("/shorts/") ? "shorts" : "video"}/${videoInfo.videoId}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "btn btn-secondary btn-square",
                children: u(IconInfoCircle, { className: "size-[1.8em]" })
              }
            )
          ] }),
u(
            "a",
            {
              href: `https://www.youtube.com/watch?v=${videoInfo.videoId}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xl text-secondary font-mono hover:underline block",
              children: videoInfo.videoId
            }
          )
        ] }),
        videoInfo.channelCountry && u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "text-xl opacity-60 mb-2", children: "Country" }),
u("div", { className: "flex items-center gap-3", children: [
u(CountryFlag, { countryCode: videoInfo.channelCountry, size: "md" }),
u("span", { className: "text-xl", children: countryNames[videoInfo.channelCountry] || videoInfo.channelCountry })
          ] })
        ] }),
u("div", { className: "space-y-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconEye, { className: "w-8 h-8 text-primary" }),
u("div", { className: "text-xl opacity-60", children: "Views" })
            ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-primary", children: formatNumber(parseInt(videoInfo.viewCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(videoInfo.viewCount).toLocaleString() })
            ] })
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconThumbUp, { className: "w-8 h-8 text-success" }),
u("div", { className: "text-xl opacity-60", children: "Likes" })
            ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-success", children: formatNumber(parseInt(videoInfo.likeCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(videoInfo.likeCount).toLocaleString() })
            ] })
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconThumbDown, { className: "w-8 h-8 text-error" }),
u("div", { className: "text-xl opacity-60", children: "Dislikes" })
            ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-error", children: formatNumber(dislikes) }),
u("div", { className: "text-xl opacity-60", children: dislikes.toLocaleString() })
            ] })
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconMessage, { className: "w-8 h-8 text-info" }),
u("div", { className: "text-xl opacity-60", children: "Comments" })
            ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-info", children: formatNumber(parseInt(videoInfo.commentCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(videoInfo.commentCount).toLocaleString() })
            ] })
          ] }) })
        ] }),
u("div", { className: "space-y-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "flex items-center gap-3 mb-2", children: [
u(IconClock, { className: "w-8 h-8 text-secondary" }),
u("div", { className: "text-xl opacity-60", children: "Duration" })
            ] }),
u("div", { className: "text-2xl font-semibold text-secondary mb-2", children: formatDuration(videoInfo.duration) }),
u("div", { className: "text-xl opacity-60", children: [
              "Uploaded",
              " ",
              dayjs(videoInfo.publishedAt).format("MMM D, YYYY • HH:mm:ss")
            ] }),
u("div", { className: "text-xl text-secondary", children: [
              calculateAge(videoInfo.publishedAt),
              " ago"
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "flex items-center gap-3 mb-2", children: [
u(IconCategory, { className: "w-8 h-8 text-accent" }),
u("div", { className: "text-xl opacity-60", children: "Category" })
            ] }),
u("div", { className: "text-2xl text-accent", children: CATEGORY_MAP[videoInfo.categoryId] || "Unknown" })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                IconBabyCarriage,
                {
                  className: `w-8 h-8 ${videoInfo.madeForKids ? "text-success" : "text-error"}`
                }
              ),
u("div", { className: "text-xl opacity-60", children: "Made for Kids" })
            ] }),
u("div", { className: "text-right", children: videoInfo.madeForKids ? u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "w-6 h-6 text-success" }),
u("span", { className: "text-success font-semibold text-xl", children: "Yes" })
            ] }) : u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "w-6 h-6 text-error" }),
u("span", { className: "text-error font-semibold text-xl", children: "No" })
            ] }) })
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                IconCurrencyDollar,
                {
                  className: `w-8 h-8 ${monetization === null ? "text-base-content opacity-60" : monetization ? "text-success" : "text-error"}`
                }
              ),
u("div", { className: "text-xl opacity-60", children: "Monetization" })
            ] }),
u("div", { className: "text-right", children: monetization === null ? u("span", { className: "loading loading-spinner loading-sm" }) : monetization ? u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "w-6 h-6 text-success" }),
u("span", { className: "text-success font-semibold text-xl", children: "Enabled" })
            ] }) : u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "w-6 h-6 text-error" }),
u("span", { className: "text-error font-semibold text-xl", children: "Disabled" })
            ] }) })
          ] }) })
        ] }),
        videoInfo.tags && videoInfo.tags.length > 0 && u("div", { className: "collapse collapse-arrow bg-base-200", children: [
u("input", { type: "checkbox" }),
u("div", { className: "collapse-title text-xl", children: "Keywords" }),
u("div", { className: "collapse-content", children: u("div", { className: "flex items-start justify-between mb-3", children: [
u("div", { className: "flex flex-wrap gap-2 flex-1", children: videoInfo.tags.map((tag, idx) => u(
              "span",
              {
                className: "badge badge-primary badge-soft badge-xl",
                children: tag
              },
              idx
            )) }),
u(
              "button",
              {
                onClick: () => {
                  navigator.clipboard.writeText(videoInfo.tags.join(", "));
                  setCopiedKeywords(true);
                  setTimeout(() => setCopiedKeywords(false), 500);
                },
                className: "btn btn-square ml-3 shrink-0",
                children: copiedKeywords ? u(IconCircleCheck, { className: "size-[1.8em] text-success" }) : u(IconCopy, { className: "size-[1.8em]" })
              }
            )
          ] }) })
        ] }),
        videoInfo.description && u("div", { className: "collapse collapse-arrow bg-base-200", children: [
u("input", { type: "checkbox" }),
u("div", { className: "collapse-title text-xl", children: "Description" }),
u("div", { className: "collapse-content", children: u("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
u("p", { className: "text-xl whitespace-pre-wrap opacity-80 flex-1", children: linkifyText(videoInfo.description) }),
u(
              "button",
              {
                onClick: () => {
                  navigator.clipboard.writeText(videoInfo.description);
                  setCopiedDescription(true);
                  setTimeout(() => setCopiedDescription(false), 500);
                },
                className: "btn btn-square shrink-0",
                children: copiedDescription ? u(IconCircleCheck, { className: "size-[1.8em] text-success" }) : u(IconCopy, { className: "size-[1.8em]" })
              }
            )
          ] }) })
        ] })
      ] }),
      channelInfo && u(preact.Fragment, { children: [
        channelInfo.bannerExternalUrl && u(
          "a",
          {
            href: channelInfo.bannerExternalUrl.replace(/=s\d+$/, "=s0"),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "block h-32 overflow-hidden rounded-lg hover:opacity-80 transition-opacity cursor-pointer",
            children: u(
              "img",
              {
                src: channelInfo.bannerExternalUrl,
                alt: "Channel Banner",
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
u("div", { className: "flex items-center gap-4", children: [
          channelInfo.thumbnails?.high?.url && u(
            "a",
            {
              href: channelInfo.thumbnails.high.url.replace(/=s\d+/, "=s0"),
              target: "_blank",
              rel: "noopener noreferrer",
              className: "avatar hover:opacity-80 transition-opacity cursor-pointer",
              children: u("div", { className: "w-16 rounded-full", children: u(
                "img",
                {
                  src: channelInfo.thumbnails.high.url,
                  alt: channelInfo.title
                }
              ) })
            }
          ),
u("div", { className: "flex-1", children: [
u("div", { className: "flex items-center justify-between gap-2", children: [
u("h2", { className: "text-xl font-semibold", children: channelInfo.title }),
u("div", { className: "flex gap-2 shrink-0", children: [
u(
                  "button",
                  {
                    className: "btn btn-accent btn-square",
                    onClick: () => {
                      openSaveChannelDialog({
                        channelId: channelInfo.channelId,
                        title: channelInfo.title,
                        customUrl: channelInfo.customUrl,
                        thumbnailUrl: channelInfo.thumbnails?.high?.url || "",
                        country: channelInfo.country,
                        subscriberCount: channelInfo.subscriberCount,
                        videoCount: channelInfo.videoCount,
                        viewCount: channelInfo.viewCount
                      });
                    },
                    children: u(IconDeviceFloppy, { className: "size-[1.8em]" })
                  }
                ),
u(
                  "a",
                  {
                    href: `https://tubeinsights.exyezed.cc/info/direct/channel/${channelInfo.channelId}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "btn btn-secondary btn-square",
                    children: u(IconInfoCircle, { className: "size-[1.8em]" })
                  }
                )
              ] })
            ] }),
            channelInfo.customUrl && u(
              "a",
              {
                href: `https://www.youtube.com/${channelInfo.customUrl}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary text-xl hover:underline",
                children: channelInfo.customUrl
              }
            ),
u(
              "a",
              {
                href: `https://www.youtube.com/channel/${channelInfo.channelId}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-xl text-secondary font-mono hover:underline block",
                children: channelInfo.channelId
              }
            )
          ] })
        ] }),
u("div", { className: "space-y-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "text-xl opacity-60 mb-2", children: "Country" }),
u("div", { className: "flex items-center gap-3", children: [
              channelInfo.country && u(CountryFlag, { countryCode: channelInfo.country, size: "md" }),
u("span", { className: "text-xl", children: channelInfo.country ? countryNames[channelInfo.country] || channelInfo.country : "-" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "text-xl opacity-60 mb-2", children: "Created" }),
u("div", { className: "text-xl", children: [
u("span", { className: "text-primary", children: dayjs(channelInfo.publishedAt).format(
                "MMM D, YYYY • HH:mm:ss"
              ) }),
u("span", { className: "text-secondary ml-2", children: [
                "(",
                calculateAge(channelInfo.publishedAt),
                " ago)"
              ] })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                IconCurrencyDollar,
                {
                  className: `w-8 h-8 ${monetization === null ? "text-base-content opacity-60" : monetization ? "text-success" : "text-error"}`
                }
              ),
u("div", { className: "text-xl opacity-60", children: "Monetization" })
            ] }),
u("div", { className: "text-right", children: monetization === null ? u("span", { className: "loading loading-spinner loading-sm" }) : monetization ? u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "w-6 h-6 text-success" }),
u("span", { className: "text-success font-semibold text-xl", children: "Enabled" })
            ] }) : u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "w-6 h-6 text-error" }),
u("span", { className: "text-error font-semibold text-xl", children: "Disabled" })
            ] }) })
          ] }) })
        ] }),
u("div", { className: "space-y-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconUsers, { className: "w-8 h-8 text-primary" }),
u("div", { className: "text-xl opacity-60", children: "Subscribers" })
            ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-primary", children: formatNumber(parseInt(channelInfo.subscriberCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(channelInfo.subscriberCount).toLocaleString() })
            ] })
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconVideo, { className: "w-8 h-8 text-secondary" }),
u("div", { className: "text-xl opacity-60", children: "Total Videos" })
            ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-secondary", children: formatNumber(parseInt(channelInfo.videoCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(channelInfo.videoCount).toLocaleString() })
            ] })
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconEye, { className: "w-8 h-8 text-accent" }),
u("div", { className: "text-xl opacity-60", children: "Total Views" })
            ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-accent", children: formatNumber(parseInt(channelInfo.viewCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(channelInfo.viewCount).toLocaleString() })
            ] })
          ] }) })
        ] }),
        channelInfo.keywords && channelInfo.keywords.length > 0 && u("div", { className: "collapse collapse-arrow bg-base-200", children: [
u("input", { type: "checkbox" }),
u("div", { className: "collapse-title text-xl", children: "Keywords" }),
u("div", { className: "collapse-content", children: u("div", { className: "flex items-start justify-between mb-3", children: [
u("div", { className: "flex flex-wrap gap-2 flex-1", children: channelInfo.keywords.map((keyword, idx) => u(
              "span",
              {
                className: "badge badge-primary badge-soft badge-xl",
                children: keyword
              },
              idx
            )) }),
u(
              "button",
              {
                onClick: () => {
                  navigator.clipboard.writeText(
                    channelInfo.keywords.join(", ")
                  );
                  setCopiedKeywords(true);
                  setTimeout(() => setCopiedKeywords(false), 500);
                },
                className: "btn btn-square ml-3 shrink-0",
                children: copiedKeywords ? u(IconCircleCheck, { className: "size-[1.8em] text-success" }) : u(IconCopy, { className: "size-[1.8em]" })
              }
            )
          ] }) })
        ] }),
        channelInfo.topicDetails?.topicCategories && channelInfo.topicDetails.topicCategories.length > 0 && u("div", { className: "collapse collapse-arrow bg-base-200", children: [
u("input", { type: "checkbox" }),
u("div", { className: "collapse-title text-xl", children: "Topics" }),
u("div", { className: "collapse-content", children: u("div", { className: "flex items-start justify-between mb-3", children: [
u("div", { className: "flex flex-wrap gap-2 flex-1", children: channelInfo.topicDetails.topicCategories.map(
              (topic, idx) => u(
                "span",
                {
                  className: "badge badge-secondary badge-soft badge-xl",
                  children: topic.replace(
                    "https://en.wikipedia.org/wiki/",
                    ""
                  )
                },
                idx
              )
            ) }),
u(
              "button",
              {
                onClick: () => {
                  navigator.clipboard.writeText(
                    channelInfo.topicDetails.topicCategories.map(
                      (t) => t.replace("https://en.wikipedia.org/wiki/", "")
                    ).join(", ")
                  );
                  setCopiedTopics(true);
                  setTimeout(() => setCopiedTopics(false), 500);
                },
                className: "btn btn-square ml-3 shrink-0",
                children: copiedTopics ? u(IconCircleCheck, { className: "size-[1.8em] text-success" }) : u(IconCopy, { className: "size-[1.8em]" })
              }
            )
          ] }) })
        ] }),
        channelInfo.description && u("div", { className: "collapse collapse-arrow bg-base-200", children: [
u("input", { type: "checkbox" }),
u("div", { className: "collapse-title text-xl", children: "Description" }),
u("div", { className: "collapse-content", children: u("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
u("p", { className: "text-xl whitespace-pre-wrap opacity-80 flex-1", children: linkifyText(channelInfo.description) }),
u(
              "button",
              {
                onClick: () => {
                  navigator.clipboard.writeText(channelInfo.description);
                  setCopiedDescription(true);
                  setTimeout(() => setCopiedDescription(false), 500);
                },
                className: "btn btn-square shrink-0",
                children: copiedDescription ? u(IconCircleCheck, { className: "size-[1.8em] text-success" }) : u(IconCopy, { className: "size-[1.8em]" })
              }
            )
          ] }) })
        ] })
      ] }),
      channelInfo && !videoInfo && u(preact.Fragment, { children: [
u("div", { className: "space-y-3", children: [
u("h3", { className: "text-xl font-semibold", children: "Video Counts" }),
          tabs.map((tab) => {
            const getIcon = () => {
              switch (tab.type) {
                case "videos":
                  return IconMovie;
                case "shorts":
                  return IconDeviceMobile;
                case "live":
                  return IconAccessPoint;
                default:
                  return IconVideo;
              }
            };
            const Icon = getIcon();
            return u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                    "a",
                    {
                      href: `https://tubeinsights.exyezed.cc/direct/${tab.type}/${channelId}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "btn btn-primary btn-square",
                      children: u(Icon, { className: "size-[1.8em]" })
                    }
                  ),
u("span", { className: "text-xl", children: tab.label })
                ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-xl font-semibold", children: tab.count.toLocaleString() }),
u("div", { className: "text-lg text-secondary", children: formatNumber(tab.views) })
                ] })
              ] }),
              tab.isLoading && u("div", { className: "mt-2", children: u("progress", { className: "progress progress-primary w-full h-1" }) })
            ] }, tab.type);
          })
        ] }),
u("div", { className: "bg-primary text-primary-content rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("span", { className: "text-xl font-semibold", children: "Total Videos" }),
u("span", { className: "text-xl font-semibold", children: tabs.reduce((sum, tab) => sum + tab.count, 0).toLocaleString() })
        ] }) }),
u("div", { className: "bg-secondary text-secondary-content rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("span", { className: "text-xl font-semibold", children: "Total Views" }),
u("span", { className: "text-xl font-semibold", children: formatNumber(tabs.reduce((sum, tab) => sum + tab.views, 0)) })
        ] }) })
      ] })
    ] });
  }
  const LIVECOUNTS_API_URL = "https://api.livecounts.io/youtube-live-subscriber-counter/stats/";
  const LIVECOUNTS_VIDEO_API_URL = "https://api.livecounts.io/youtube-live-view-counter/stats/";
  const BACKEND_API_URL = "https://tubeinsights.exyezed.cc/api/channels/";
  const BACKEND_VIDEO_API_URL = "https://tubeinsights.exyezed.cc/api/videos/";
  const DISLIKE_API_URL = "https://returnyoutubedislikeapi.com/votes";
  async function fetchDislikes$1(videoId) {
    try {
      const response = await fetch(`${DISLIKE_API_URL}?videoId=${videoId}`);
      if (!response.ok) {
        return 0;
      }
      const data = await response.json();
      return data.dislikes || 0;
    } catch {
      return 0;
    }
  }
  async function fetchInitialStats(channelId) {
    try {
      const response = await fetch(`${BACKEND_API_URL}${channelId}/live-stats`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (!data || !data.status) {
        return null;
      }
      return {
        liveSubscriber: data.liveSubscriber,
        liveViews: data.liveViews,
        liveVideos: data.liveVideos
      };
    } catch (error) {
      console.error("Failed to fetch initial stats:", error);
      return null;
    }
  }
  async function fetchRealtimeStats(channelId) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${LIVECOUNTS_API_URL}${channelId}`,
        headers: {
          Origin: "https://livecounts.io",
          Referer: "https://livecounts.io/"
        },
        onload: function(response) {
          if (response.status === 200) {
            try {
              const data = JSON.parse(response.responseText);
              if (!data || typeof data.followerCount === "undefined" || !data.bottomOdos) {
                resolve(null);
                return;
              }
              resolve({
                liveSubscriber: data.followerCount,
                liveViews: data.bottomOdos[0],
                liveVideos: data.bottomOdos[1]
              });
            } catch (error) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        },
        onerror: function() {
          resolve(null);
        }
      });
    });
  }
  async function fetchInitialVideoStats(videoId) {
    try {
      const response = await fetch(
        `${BACKEND_VIDEO_API_URL}${videoId}/live-stats`
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (!data || !data.status) {
        return null;
      }
      const dislikeCount = await fetchDislikes$1(videoId);
      return {
        liveViews: data.liveViews,
        liveLikes: data.liveLikes,
        liveComments: data.liveComments,
        liveViewer: data.liveViewer || 0,
        dislikes: dislikeCount
      };
    } catch (error) {
      console.error("[TubeInsights] Failed to fetch initial video stats:", error);
      return null;
    }
  }
  async function fetchRealtimeVideoStats(videoId) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${LIVECOUNTS_VIDEO_API_URL}${videoId}`,
        headers: {
          Origin: "https://livecounts.io",
          Referer: "https://livecounts.io/"
        },
        onload: async function(response) {
          if (response.status === 200) {
            try {
              const data = JSON.parse(
                response.responseText
              );
              if (!data || !data.success || typeof data.followerCount === "undefined") {
                resolve(null);
                return;
              }
              const dislikeCount = await fetchDislikes$1(videoId);
              resolve({
                liveViews: data.followerCount,
                liveLikes: data.bottomOdos && data.bottomOdos[0] || 0,
                liveComments: data.bottomOdos && data.bottomOdos[2] || 0,
                liveViewer: data.viewerCount || 0,
                dislikes: dislikeCount
              });
            } catch (error) {
              console.error(
                "[TubeInsights] Video LiveCounts parse error:",
                error
              );
              resolve(null);
            }
          } else {
            resolve(null);
          }
        },
        onerror: function() {
          resolve(null);
        }
      });
    });
  }
  dayjs.extend(relativeTime);
  function LiveCountTab() {
    const [channelId, setChannelId] = hooks.useState(null);
    const [channelHandle, setChannelHandle] = hooks.useState(null);
    const [channelInfo, setChannelInfo] = hooks.useState(null);
    const [liveStats, setLiveStats] = hooks.useState(null);
    const [videoId, setVideoId] = hooks.useState(null);
    const [videoInfo, setVideoInfo] = hooks.useState(null);
    const [videoLiveStats, setVideoLiveStats] = hooks.useState(
      null
    );
    const [monetization, setMonetization] = hooks.useState(null);
    const [loading, setLoading] = hooks.useState(false);
    const [diffs, setDiffs] = hooks.useState({});
    const [videoDiffs, setVideoDiffs] = hooks.useState({});
    const [realtimeStatus, setRealtimeStatus] = hooks.useState("loading");
    const [, setChartData] = hooks.useState({
      subscribers: [],
      views: [],
      videos: [],
      timestamps: []
    });
    const [, setVideoChartData] = hooks.useState({
      views: [],
      likes: [],
      dislikes: [],
      comments: [],
      viewers: [],
      timestamps: []
    });
    const [youtubeService2] = hooks.useState(() => new YouTubeService());
    const intervalRef = hooks.useRef(null);
    const prevStatsRef = hooks.useRef(null);
    const prevVideoStatsRef = hooks.useRef(null);
    const lastMonetizationCheckRef = hooks.useRef(null);
    const errorCountRef = hooks.useRef(0);
    const isFetchingRef = hooks.useRef(false);
    const calculateAge = (publishedAt) => {
      const now = dayjs();
      const published = dayjs(publishedAt);
      const years = now.diff(published, "year");
      const months = now.diff(published, "month") % 12;
      const days = now.diff(published, "day") % 30;
      const hours = now.diff(published, "hour") % 24;
      const parts = [];
      if (years > 0) parts.push(`${years} yr`);
      if (months > 0) parts.push(`${months} mo`);
      if (days > 0 && years === 0) parts.push(`${days} d`);
      if (parts.length === 0 && hours > 0) parts.push(`${hours} hr`);
      return parts.join(" ") || "< 1 hr";
    };
    const isVideoPage = () => {
      return youtubeService2.isVideoPage();
    };
    const getVideoIdFromURL = () => {
      return youtubeService2.getVideoIdFromURL();
    };
    const checkMonetizationAsync = async (urlOrId) => {
      if (lastMonetizationCheckRef.current === urlOrId) {
        return;
      }
      lastMonetizationCheckRef.current = urlOrId;
      try {
        const url = urlOrId.startsWith("http") ? urlOrId : `https://www.youtube.com/channel/${urlOrId}`;
        const monetizationResponse = await fetch(
          `https://tubeinsights.exyezed.cc/api/monetization?url=${encodeURIComponent(
          url
        )}`
        );
        if (monetizationResponse.ok) {
          const monetizationData = await monetizationResponse.json();
          const isMonetized = monetizationData.monetization || false;
          setMonetization(isMonetized);
        } else {
          setMonetization(null);
        }
      } catch (err) {
        console.error("Failed to check monetization:", err);
        setMonetization(null);
        lastMonetizationCheckRef.current = null;
      }
    };
    const fetchLiveStats = async (id, isInitial = false) => {
      try {
        let newStats = null;
        if (isInitial) {
          setRealtimeStatus("loading");
          errorCountRef.current = 0;
          newStats = await fetchInitialStats(id);
        } else {
          newStats = await fetchRealtimeStats(id);
        }
        if (newStats) {
          const timestamp = dayjs().format("HH:mm:ss");
          setLiveStats(newStats);
          setRealtimeStatus("success");
          errorCountRef.current = 0;
          if (prevStatsRef.current) {
            const newDiffs = {
              liveSubscriber: newStats.liveSubscriber - prevStatsRef.current.liveSubscriber,
              liveViews: newStats.liveViews - prevStatsRef.current.liveViews,
              liveVideos: newStats.liveVideos - prevStatsRef.current.liveVideos
            };
            setDiffs(newDiffs);
          }
          prevStatsRef.current = newStats;
          setChartData((prev) => ({
            subscribers: [...prev.subscribers, newStats.liveSubscriber].slice(
              -30
            ),
            views: [...prev.views, newStats.liveViews].slice(-30),
            videos: [...prev.videos, newStats.liveVideos].slice(-30),
            timestamps: [...prev.timestamps, timestamp].slice(-30)
          }));
        } else {
          if (!isInitial) {
            errorCountRef.current++;
            setRealtimeStatus("error");
            if (errorCountRef.current >= 5 && intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch live stats:", err);
        if (!isInitial) {
          errorCountRef.current++;
          setRealtimeStatus("error");
          if (errorCountRef.current >= 5 && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    };
    const fetchVideoLiveStats = async (id, isInitial = false) => {
      try {
        let newStats = null;
        if (isInitial) {
          setRealtimeStatus("loading");
          errorCountRef.current = 0;
          newStats = await fetchInitialVideoStats(id);
        } else {
          newStats = await fetchRealtimeVideoStats(id);
        }
        if (newStats) {
          const timestamp = dayjs().format("HH:mm:ss");
          setVideoLiveStats(newStats);
          setRealtimeStatus("success");
          errorCountRef.current = 0;
          if (prevVideoStatsRef.current) {
            const newDiffs = {
              liveViews: newStats.liveViews - prevVideoStatsRef.current.liveViews,
              liveLikes: newStats.liveLikes - prevVideoStatsRef.current.liveLikes,
              liveComments: newStats.liveComments - prevVideoStatsRef.current.liveComments,
              liveViewer: newStats.liveViewer - prevVideoStatsRef.current.liveViewer,
              dislikes: newStats.dislikes - prevVideoStatsRef.current.dislikes
            };
            setVideoDiffs(newDiffs);
          }
          prevVideoStatsRef.current = newStats;
          setVideoChartData((prev) => ({
            views: [...prev.views, newStats.liveViews].slice(-30),
            likes: [...prev.likes, newStats.liveLikes].slice(-30),
            dislikes: [...prev.dislikes, newStats.dislikes].slice(-30),
            comments: [...prev.comments, newStats.liveComments].slice(-30),
            viewers: [...prev.viewers, newStats.liveViewer].slice(-30),
            timestamps: [...prev.timestamps, timestamp].slice(-30)
          }));
        } else {
          if (!isInitial) {
            errorCountRef.current++;
            setRealtimeStatus("error");
            if (errorCountRef.current >= 5 && intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch video live stats:", err);
        if (!isInitial) {
          errorCountRef.current++;
          setRealtimeStatus("error");
          if (errorCountRef.current >= 5 && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    };
    const fetchVideoData2 = async (id) => {
      setLoading(true);
      setMonetization(null);
      setVideoLiveStats(null);
      setVideoInfo(null);
      setVideoDiffs({});
      setVideoChartData({
        views: [],
        likes: [],
        dislikes: [],
        comments: [],
        viewers: [],
        timestamps: []
      });
      prevVideoStatsRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      try {
        const response = await fetch(
          `https://tubeinsights.exyezed.cc/api/videos/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch video info");
        const data = await response.json();
        if (data && data.items && data.items.length > 0) {
          const item = data.items[0];
          let channelCountry;
          try {
            const channelResponse = await fetch(
              `https://tubeinsights.exyezed.cc/api/channels/${item.snippet.channelId}`
            );
            if (channelResponse.ok) {
              const channelData = await channelResponse.json();
              if (channelData && channelData.items && channelData.items.length > 0) {
                channelCountry = channelData.items[0].snippet.country;
              }
            }
          } catch {
          }
          const info = {
            videoId: item.id,
            title: item.snippet.title,
            thumbnails: item.snippet.thumbnails,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            duration: item.contentDetails?.duration,
            categoryId: item.snippet.categoryId,
            madeForKids: item.status?.madeForKids || false,
            publishedAt: item.snippet.publishedAt,
            isLive: item.snippet.liveBroadcastContent === "live",
            channelCountry
          };
          setVideoInfo(info);
          setLoading(false);
          await fetchVideoLiveStats(item.id, true);
          startVideoPolling(item.id);
          const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;
          checkMonetizationAsync(videoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch video data:", err);
        setLoading(false);
      }
    };
    const fetchChannelData2 = async (id) => {
      setLoading(true);
      setMonetization(null);
      setLiveStats(null);
      setChannelInfo(null);
      setDiffs({});
      setChartData({ subscribers: [], views: [], videos: [], timestamps: [] });
      prevStatsRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      try {
        const response = await fetch(
          `https://tubeinsights.exyezed.cc/api/channels/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch channel info");
        const data = await response.json();
        if (data && data.items && data.items.length > 0) {
          const item = data.items[0];
          const snippet = item.snippet;
          const brandingSettings = item.brandingSettings;
          const bannerUrl = brandingSettings?.image?.bannerExternalUrl;
          const info = {
            channelId: item.id,
            title: snippet.title,
            description: snippet.description,
            publishedAt: snippet.publishedAt,
            thumbnails: snippet.thumbnails,
            customUrl: snippet.customUrl,
            country: snippet.country,
            bannerExternalUrl: bannerUrl ? `${bannerUrl}=s1600` : void 0
          };
          setChannelInfo(info);
          setLoading(false);
          await fetchLiveStats(item.id, true);
          startPolling(item.id);
          checkMonetizationAsync(item.id);
        }
      } catch (err) {
        console.error("Failed to fetch channel data:", err);
        setLoading(false);
      }
    };
    const isChannelPage = () => {
      const path = window.location.pathname;
      return path.startsWith("/@") || path.startsWith("/channel/");
    };
    const getChannelIdFromURL = async () => {
      return await youtubeService2.getChannelId();
    };
    const startPolling = (id) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        fetchLiveStats(id);
      }, 2e3);
    };
    const startVideoPolling = (id) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        fetchVideoLiveStats(id);
      }, 2e3);
    };
    const loadChannelData = async () => {
      if (activeTab.value !== "livecount") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      if (!isPanelVisible.value) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      if (!isChannelPage() && !isVideoPage()) {
        setChannelId(null);
        setChannelInfo(null);
        setLiveStats(null);
        setVideoId(null);
        setVideoInfo(null);
        setVideoLiveStats(null);
        setMonetization(null);
        setDiffs({});
        setVideoDiffs({});
        setChartData({ subscribers: [], views: [], videos: [], timestamps: [] });
        setVideoChartData({
          views: [],
          likes: [],
          dislikes: [],
          comments: [],
          viewers: [],
          timestamps: []
        });
        prevStatsRef.current = null;
        prevVideoStatsRef.current = null;
        lastMonetizationCheckRef.current = null;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      if (isFetchingRef.current) {
        return;
      }
      if (isVideoPage()) {
        const vId = getVideoIdFromURL();
        if (vId !== videoId) {
          isFetchingRef.current = true;
          setVideoId(vId);
          setChannelId(null);
          setChannelInfo(null);
          setLiveStats(null);
          setVideoInfo(null);
          setVideoLiveStats(null);
          setMonetization(null);
          lastMonetizationCheckRef.current = null;
          if (vId && isPanelVisible.value) {
            await fetchVideoData2(vId);
          }
          isFetchingRef.current = false;
        } else if (vId && !intervalRef.current && videoInfo && isPanelVisible.value) {
          startVideoPolling(vId);
        }
        return;
      }
      if (isChannelPage()) {
        const id = await getChannelIdFromURL();
        const handle = youtubeService2.getChannelHandle();
        if (id !== channelId) {
          isFetchingRef.current = true;
          setChannelId(id);
          setChannelHandle(handle);
          setVideoId(null);
          setVideoInfo(null);
          setVideoLiveStats(null);
          lastMonetizationCheckRef.current = null;
          if (id && isPanelVisible.value) {
            await fetchChannelData2(id);
          }
          isFetchingRef.current = false;
        } else if (id && !intervalRef.current && channelInfo && isPanelVisible.value) {
          startPolling(id);
        }
      }
    };
    hooks.useEffect(() => {
      if (activeTab.value !== "livecount") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      loadChannelData();
      const checkUrlChange = () => {
        if (!isChannelPage() && !isVideoPage()) {
          if (channelId !== null || videoId !== null) {
            setChannelId(null);
            setChannelHandle(null);
            setChannelInfo(null);
            setLiveStats(null);
            setVideoId(null);
            setVideoInfo(null);
            setVideoLiveStats(null);
            setMonetization(null);
            setDiffs({});
            setVideoDiffs({});
            setChartData({
              subscribers: [],
              views: [],
              videos: [],
              timestamps: []
            });
            setVideoChartData({
              views: [],
              likes: [],
              dislikes: [],
              comments: [],
              viewers: [],
              timestamps: []
            });
            prevStatsRef.current = null;
            prevVideoStatsRef.current = null;
            lastMonetizationCheckRef.current = null;
          }
          return;
        }
        const currentHandle = youtubeService2.getChannelHandleFromURL();
        const currentVideoId = youtubeService2.getVideoIdFromURL();
        if (currentHandle !== channelHandle || currentVideoId !== videoId) {
          youtubeService2.clearCache();
          loadChannelData();
        }
      };
      const intervalId = setInterval(checkUrlChange, 1e3);
      return () => {
        clearInterval(intervalId);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [channelHandle, videoId, activeTab.value]);
    hooks.useEffect(() => {
      if (activeTab.value === "livecount" && isPanelVisible.value && !isFetchingRef.current) {
        if (channelId && !channelInfo) {
          fetchChannelData2(channelId);
        }
        if (videoId && !videoInfo) {
          fetchVideoData2(videoId);
        }
      }
    }, [
      activeTab.value,
      isPanelVisible.value,
      channelId,
      videoId,
      channelInfo,
      videoInfo
    ]);
    const renderDiff = (key) => {
      const diff = diffs[key];
      if (!diff || diff === 0) return null;
      const isPositive = diff > 0;
      return u(
        "div",
        {
          className: `flex items-center gap-1 text-xl font-semibold ${isPositive ? "text-success" : "text-error"}`,
          children: [
            isPositive ? u(IconTrendingUp, { className: "w-6 h-6" }) : u(IconTrendingDown, { className: "w-6 h-6" }),
            isPositive ? "+" : "",
            formatNumber(Math.abs(diff))
          ]
        }
      );
    };
    const renderVideoDiff = (key) => {
      const diff = videoDiffs[key];
      if (!diff || diff === 0) return null;
      const isPositive = diff > 0;
      return u(
        "div",
        {
          className: `flex items-center gap-1 text-xl font-semibold ${isPositive ? "text-success" : "text-error"}`,
          children: [
            isPositive ? u(IconTrendingUp, { className: "w-6 h-6" }) : u(IconTrendingDown, { className: "w-6 h-6" }),
            isPositive ? "+" : "",
            formatNumber(Math.abs(diff))
          ]
        }
      );
    };
    if (!isChannelPage() && !isVideoPage()) {
      return u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: "Navigate to a YouTube channel or video page to see live count" }) });
    }
    if (loading && !channelInfo && !videoInfo) {
      return u("div", { className: "text-center py-8", children: u("span", { className: "loading loading-spinner loading-lg" }) });
    }
    return u("div", { className: "space-y-4", children: [
      videoInfo && videoLiveStats && u(preact.Fragment, { children: [
        window.location.pathname.startsWith("/shorts/") ? u("div", { className: "flex gap-2", children: ["oardefault", "oar1", "oar2", "oar3"].map((quality) => u(
          "a",
          {
            href: `https://i.ytimg.com/vi/${videoInfo.videoId}/${quality}.jpg`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex-1 rounded-lg overflow-hidden hover:opacity-80 transition-opacity",
            style: { aspectRatio: "9/16" },
            children: u(
              "img",
              {
                src: `https://i.ytimg.com/vi/${videoInfo.videoId}/${quality}.jpg`,
                alt: `${videoInfo.title} - ${quality}`,
                className: "w-full h-full object-cover"
              }
            )
          },
          quality
        )) }) : u(
          "a",
          {
            href: `https://i.ytimg.com/vi/${videoInfo.videoId}/maxresdefault.jpg`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "block aspect-video rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer",
            children: u(
              "img",
              {
                src: videoInfo.thumbnails?.high?.url || videoInfo.thumbnails?.medium?.url,
                alt: videoInfo.title,
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
u("div", { children: [
u("h2", { className: "text-xl font-semibold mb-2", children: videoInfo.title }),
u("div", { className: "text-xl opacity-60", children: [
            "Title Length: ",
            videoInfo.title.length,
            " characters"
          ] })
        ] }),
u("div", { children: [
u("div", { className: "flex items-center gap-2", children: u(
            "a",
            {
              href: `https://www.youtube.com/channel/${videoInfo.channelId}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-primary text-xl hover:underline font-semibold",
              children: videoInfo.channelTitle
            }
          ) }),
u(
            "a",
            {
              href: `https://www.youtube.com/watch?v=${videoInfo.videoId}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xl text-secondary font-mono hover:underline block",
              children: videoInfo.videoId
            }
          )
        ] }),
        videoInfo.channelCountry && u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "text-xl opacity-60 mb-2", children: "Country" }),
u("div", { className: "flex items-center gap-3", children: [
u(CountryFlag, { countryCode: videoInfo.channelCountry, size: "md" }),
u("span", { className: "text-xl", children: countryNames[videoInfo.channelCountry] || videoInfo.channelCountry })
          ] })
        ] }),
u("div", { className: "space-y-4", children: u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
              IconCurrencyDollar,
              {
                className: `w-8 h-8 ${monetization === null ? "text-base-content opacity-60" : monetization ? "text-success" : "text-error"}`
              }
            ),
u("div", { className: "text-xl opacity-60", children: "Monetization" })
          ] }),
u("div", { className: "text-right", children: monetization === null ? u("span", { className: "loading loading-spinner loading-sm" }) : monetization ? u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "w-6 h-6 text-success" }),
u("span", { className: "text-success font-semibold text-xl", children: "Enabled" })
          ] }) : u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "w-6 h-6 text-error" }),
u("span", { className: "text-error font-semibold text-xl", children: "Disabled" })
          ] }) })
        ] }) }) }),
u("div", { className: "space-y-4", children: [
u("h3", { className: "text-xl font-semibold", children: "Live Statistics" }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconEye, { className: "w-8 h-8 text-primary absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderVideoDiff("liveViews") }),
u("div", { className: "text-5xl font-semibold text-primary", children: formatNumber(videoLiveStats.liveViews) }),
u("div", { className: "text-xl opacity-60", children: videoLiveStats.liveViews.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Views" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconUsers, { className: "w-8 h-8 text-secondary absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderVideoDiff("liveViewer") }),
u("div", { className: "text-5xl font-semibold text-secondary", children: formatNumber(videoLiveStats.liveViewer) }),
u("div", { className: "text-xl opacity-60", children: videoLiveStats.liveViewer.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Viewers" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconThumbUp, { className: "w-8 h-8 text-success absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderVideoDiff("liveLikes") }),
u("div", { className: "text-5xl font-semibold text-success", children: formatNumber(videoLiveStats.liveLikes) }),
u("div", { className: "text-xl opacity-60", children: videoLiveStats.liveLikes.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Likes" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconThumbDown, { className: "w-8 h-8 text-error absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderVideoDiff("dislikes") }),
u("div", { className: "text-5xl font-semibold text-error", children: formatNumber(videoLiveStats.dislikes) }),
u("div", { className: "text-xl opacity-60", children: videoLiveStats.dislikes.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Dislikes" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconMessage, { className: "w-8 h-8 text-info absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderVideoDiff("liveComments") }),
u("div", { className: "text-5xl font-semibold text-info", children: formatNumber(videoLiveStats.liveComments) }),
u("div", { className: "text-xl opacity-60", children: videoLiveStats.liveComments.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Comments" })
            ] })
          ] })
        ] })
      ] }),
      channelInfo && liveStats && u(preact.Fragment, { children: [
        channelInfo.bannerExternalUrl && u(
          "a",
          {
            href: channelInfo.bannerExternalUrl.replace(/=s\d+$/, "=s0"),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "block h-32 overflow-hidden rounded-lg hover:opacity-80 transition-opacity cursor-pointer",
            children: u(
              "img",
              {
                src: channelInfo.bannerExternalUrl,
                alt: "Channel Banner",
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
u("div", { className: "flex items-center gap-4", children: [
          channelInfo.thumbnails?.high?.url && u(
            "a",
            {
              href: channelInfo.thumbnails.high.url.replace(/=s\d+/, "=s0"),
              target: "_blank",
              rel: "noopener noreferrer",
              className: "avatar hover:opacity-80 transition-opacity cursor-pointer",
              children: u("div", { className: "w-16 rounded-full", children: u(
                "img",
                {
                  src: channelInfo.thumbnails.high.url,
                  alt: channelInfo.title
                }
              ) })
            }
          ),
u("div", { className: "flex-1", children: [
u("h2", { className: "text-xl font-semibold", children: channelInfo.title }),
            channelInfo.customUrl && u(
              "a",
              {
                href: `https://www.youtube.com/${channelInfo.customUrl}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary text-xl hover:underline",
                children: channelInfo.customUrl
              }
            ),
u(
              "a",
              {
                href: `https://www.youtube.com/channel/${channelInfo.channelId}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-xl text-secondary font-mono hover:underline block",
                children: channelInfo.channelId
              }
            )
          ] })
        ] }),
u("div", { className: "space-y-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "text-xl opacity-60 mb-2", children: "Country" }),
u("div", { className: "flex items-center gap-3", children: [
              channelInfo.country && u(CountryFlag, { countryCode: channelInfo.country, size: "md" }),
u("span", { className: "text-xl", children: channelInfo.country ? countryNames[channelInfo.country] || channelInfo.country : "-" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "text-xl opacity-60 mb-2", children: "Created" }),
u("div", { className: "text-xl", children: [
u("span", { className: "text-primary", children: dayjs(channelInfo.publishedAt).format(
                "MMM D, YYYY • HH:mm:ss"
              ) }),
u("span", { className: "text-secondary ml-2", children: [
                "(",
                calculateAge(channelInfo.publishedAt),
                " ago)"
              ] })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                IconCurrencyDollar,
                {
                  className: `w-8 h-8 ${monetization === null ? "text-base-content opacity-60" : monetization ? "text-success" : "text-error"}`
                }
              ),
u("div", { className: "text-xl opacity-60", children: "Monetization" })
            ] }),
u("div", { className: "text-right", children: monetization === null ? u("span", { className: "loading loading-spinner loading-sm" }) : monetization ? u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "w-6 h-6 text-success" }),
u("span", { className: "text-success font-semibold text-xl", children: "Enabled" })
            ] }) : u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "w-6 h-6 text-error" }),
u("span", { className: "text-error font-semibold text-xl", children: "Disabled" })
            ] }) })
          ] }) })
        ] }),
u("div", { className: "space-y-4", children: [
u("h3", { className: "text-xl font-semibold", children: "Live Statistics" }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconUsers, { className: "w-8 h-8 text-primary absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderDiff("liveSubscriber") }),
u("div", { className: "text-5xl font-semibold text-primary", children: formatNumber(liveStats.liveSubscriber) }),
u("div", { className: "text-xl opacity-60", children: liveStats.liveSubscriber.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Subscribers" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconEye, { className: "w-8 h-8 text-secondary absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderDiff("liveViews") }),
u("div", { className: "text-5xl font-semibold text-secondary", children: formatNumber(liveStats.liveViews) }),
u("div", { className: "text-xl opacity-60", children: liveStats.liveViews.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Views" })
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-6 relative", children: [
u(IconVideo, { className: "w-8 h-8 text-accent absolute top-4 left-4" }),
u("div", { className: "inline-grid *:[grid-area:1/1] absolute top-4 right-4", children: [
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success animate-ping" : realtimeStatus === "error" ? "status-error animate-ping" : "status-warning animate-ping"}`
                }
              ),
u(
                "div",
                {
                  className: `status ${realtimeStatus === "success" ? "status-success" : realtimeStatus === "error" ? "status-error" : "status-warning"}`
                }
              )
            ] }),
u("div", { className: "flex flex-col items-center text-center gap-3", children: [
u("div", { className: "h-6 text-xl", children: renderDiff("liveVideos") }),
u("div", { className: "text-5xl font-semibold text-accent", children: formatNumber(liveStats.liveVideos) }),
u("div", { className: "text-xl opacity-60", children: liveStats.liveVideos.toLocaleString() }),
u("div", { className: "text-xl opacity-60", children: "Live Videos" })
            ] })
          ] })
        ] })
      ] })
    ] });
  }
  const DB_NAME = "TubeInsightsBookmarks";
  const DB_VERSION = 1;
  const STORE_NAME = "channels";
  class BookmarkDB {
    db = null;
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, {
              keyPath: "channelId"
            });
            store.createIndex("category", "category", { unique: false });
            store.createIndex("bookmarkedAt", "bookmarkedAt", { unique: false });
          }
        };
      });
    }
    async addChannel(channel) {
      if (!this.db) await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(channel);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    async getChannel(channelId) {
      if (!this.db) await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(channelId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    }
    async getAllChannels() {
      if (!this.db) await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    async deleteChannel(channelId) {
      if (!this.db) await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(channelId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    async clearAll() {
      if (!this.db) await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    async getCategories() {
      const channels = await this.getAllChannels();
      const categoryMap = new Map();
      channels.forEach((channel) => {
        const count = categoryMap.get(channel.category) || 0;
        categoryMap.set(channel.category, count + 1);
      });
      return Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count })).sort((a, b) => a.category.localeCompare(b.category));
    }
    async exportData() {
      const channels = await this.getAllChannels();
      return JSON.stringify(channels, null, 2);
    }
    async importData(jsonData) {
      const channels = JSON.parse(jsonData);
      for (const channel of channels) {
        await this.addChannel(channel);
      }
    }
  }
  const bookmarkDB = new BookmarkDB();
  let audioContext = null;
  const getAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  };
  const playErrorSound = () => {
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "square";
      osc1.frequency.setValueAtTime(400, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.1);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = "square";
      osc2.frequency.setValueAtTime(300, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.22);
    } catch (error) {
      console.error("Error playing error sound:", error);
    }
  };
  const playToggleSound = () => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (error) {
      console.error("Error playing toggle sound:", error);
    }
  };
  const playApplySound = () => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1e3, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (error) {
      console.error("Error playing apply sound:", error);
    }
  };
  const playThemeSelectSound = () => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(700, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        900,
        ctx.currentTime + 0.1
      );
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.12);
    } catch (error) {
      console.error("Error playing theme select sound:", error);
    }
  };
  function BookmarkTab() {
    const [channels, setChannels] = hooks.useState([]);
    const [filteredChannels, setFilteredChannels] = hooks.useState(
      []
    );
    const [categories, setCategories] = hooks.useState([]);
    const [selectedCategory, setSelectedCategory] = hooks.useState(() => {
      return localStorage.getItem("bookmark-selected-category") || "all";
    });
    const [currentPage, setCurrentPage] = hooks.useState(1);
    const [channelsPerPage, setChannelsPerPage] = hooks.useState(8);
    const [errorMessage, setErrorMessage] = hooks.useState("");
    hooks.useEffect(() => {
      loadData();
      loadPerPageSetting();
      const handleBookmarkUpdate = () => {
        loadData();
      };
      const handleSettingsUpdate = () => {
        loadPerPageSetting();
      };
      window.addEventListener("bookmark-updated", handleBookmarkUpdate);
      window.addEventListener("settings-updated", handleSettingsUpdate);
      return () => {
        window.removeEventListener("bookmark-updated", handleBookmarkUpdate);
        window.removeEventListener("settings-updated", handleSettingsUpdate);
      };
    }, []);
    const loadPerPageSetting = async () => {
      const perPage = await storage.get("bookmark-per-page", "8");
      setChannelsPerPage(parseInt(perPage));
      setCurrentPage(1);
    };
    hooks.useEffect(() => {
      localStorage.setItem("bookmark-selected-category", selectedCategory);
    }, [selectedCategory]);
    hooks.useEffect(() => {
      filterChannels();
    }, [channels, selectedCategory]);
    const loadData = async () => {
      const allChannels = await bookmarkDB.getAllChannels();
      allChannels.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt);
      setChannels(allChannels);
      const cats = await bookmarkDB.getCategories();
      setCategories(cats);
    };
    const filterChannels = () => {
      if (selectedCategory === "all") {
        setFilteredChannels(channels);
      } else {
        setFilteredChannels(
          channels.filter((ch) => ch.category === selectedCategory)
        );
      }
      setCurrentPage(1);
    };
    const handleExport = async () => {
      const jsonData = await bookmarkDB.exportData();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tubeinsights-bookmarks-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
    const handleImport = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const jsonData = event.target?.result;
            await bookmarkDB.importData(jsonData);
            loadData();
          } catch (err) {
            playErrorSound();
            setErrorMessage("Import failed: " + err);
            setTimeout(() => setErrorMessage(""), 1e3);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    };
    const totalPages = Math.ceil(filteredChannels.length / channelsPerPage);
    const startIndex = (currentPage - 1) * channelsPerPage;
    const endIndex = startIndex + channelsPerPage;
    const currentChannels = filteredChannels.slice(startIndex, endIndex);
    return u("div", { className: "space-y-4", children: [
u("div", { className: "flex gap-2 flex-wrap", children: [
u("div", { className: "tooltip tooltip-right", "data-tip": "Import bookmarks", children: u("button", { className: "btn btn-square btn-primary", onClick: handleImport, children: u(IconFileImport, { className: "size-[1.8em]" }) }) }),
u("div", { className: "tooltip tooltip-right", "data-tip": "Export bookmarks", children: u(
          "button",
          {
            className: "btn btn-square btn-secondary",
            onClick: handleExport,
            children: u(IconFileExport, { className: "size-[1.8em]" })
          }
        ) }),
u("div", { className: "tooltip tooltip-right", "data-tip": "Clear all bookmarks", children: u(
          "button",
          {
            className: "btn btn-square btn-error",
            onClick: openClearAllDialog,
            children: u(IconDatabaseOff, { className: "size-[1.8em]" })
          }
        ) }),
u("div", { className: "dropdown dropdown-end ml-auto", children: [
u("button", { tabIndex: 0, className: "btn", children: selectedCategory === "all" ? `All Categories (${channels.length})` : `${selectedCategory} (${categories.find((c) => c.category === selectedCategory)?.count || 0})` }),
u(
            "ul",
            {
              tabIndex: 0,
              className: "dropdown-content menu bg-base-200 rounded-box z-10 w-80 p-2 shadow-lg mt-1 text-lg max-h-128 overflow-y-auto",
              children: [
u("li", { children: u(
                  "button",
                  {
                    onClick: () => setSelectedCategory("all"),
                    className: "flex justify-between",
                    children: [
u("span", { children: "All Categories" }),
u("span", { className: "badge badge-info badge-lg", children: channels.length })
                    ]
                  }
                ) }),
                categories.map((cat) => u("li", { children: u(
                  "button",
                  {
                    onClick: () => setSelectedCategory(cat.category),
                    className: "flex justify-between",
                    children: [
u("span", { children: cat.category }),
u("span", { className: "badge badge-info badge-lg", children: cat.count })
                    ]
                  }
                ) }, cat.category))
              ]
            }
          )
        ] })
      ] }),
      errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
      ] }),
      currentChannels.length === 0 ? u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: "No bookmarked channels" }) }) : u(preact.Fragment, { children: [
u("div", { className: "space-y-3", children: currentChannels.map((channel) => u(
          "div",
          {
            className: "bg-base-200 rounded-lg p-4",
            children: u("div", { className: "flex items-center gap-3", children: [
u(
                "a",
                {
                  href: `https://www.youtube.com/channel/${channel.channelId}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "avatar hover:opacity-80 transition-opacity cursor-pointer shrink-0",
                  children: u("div", { className: "w-16 rounded-full", children: u("img", { src: channel.thumbnailUrl, alt: channel.title }) })
                }
              ),
u("div", { className: "flex-1 min-w-0", children: [
u("div", { className: "flex items-center gap-2 mb-1", children: u("h3", { className: "font-semibold text-lg truncate", children: channel.title }) }),
u("div", { className: "flex gap-4 text-lg mb-2", children: [
u("span", { className: "flex items-center gap-1 text-primary", children: [
u(IconUsers, { className: "size-[1.2em]" }),
                    formatNumber(parseInt(channel.subscriberCount))
                  ] }),
u("span", { className: "flex items-center gap-1 text-secondary", children: [
u(IconVideo, { className: "size-[1.2em]" }),
                    formatNumber(parseInt(channel.videoCount))
                  ] }),
u("span", { className: "flex items-center gap-1 text-accent", children: [
u(IconEye, { className: "size-[1.2em]" }),
                    formatNumber(parseInt(channel.viewCount))
                  ] })
                ] }),
u("div", { className: "badge badge-info badge-soft badge-lg", children: channel.category })
              ] }),
u("div", { className: "flex gap-2 shrink-0", children: [
u(
                  "button",
                  {
                    className: "btn btn-square",
                    onClick: () => openDetailChannelDialog(channel),
                    children: u(IconInfoCircle, { className: "size-[1.8em]" })
                  }
                ),
u(
                  "button",
                  {
                    className: "btn btn-square btn-error",
                    onClick: () => openDeleteChannelDialog(channel.channelId),
                    children: u(IconTrash, { className: "size-[1.8em]" })
                  }
                )
              ] })
            ] })
          },
          channel.channelId
        )) }),
        totalPages > 1 && u("div", { className: "flex justify-center", children: u("div", { className: "join", children: [
u(
            "button",
            {
              className: "join-item btn btn-lg",
              disabled: currentPage === 1,
              onClick: () => setCurrentPage(currentPage - 1),
              children: "«"
            }
          ),
u("button", { className: "join-item btn btn-lg", children: [
            currentPage,
            "/",
            totalPages
          ] }),
u(
            "button",
            {
              className: "join-item btn btn-lg",
              disabled: currentPage === totalPages,
              onClick: () => setCurrentPage(currentPage + 1),
              children: "»"
            }
          )
        ] }) })
      ] })
    ] });
  }
  function IconFileMp4({
    className,
    size = 24
  }) {
    return u(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 640 640",
        width: size,
        height: size,
        className,
        fill: "currentColor",
        children: u("path", { d: "M240 112L128 112C119.2 112 112 119.2 112 128L112 512C112 520.8 119.2 528 128 528L176 528L176 576L128 576C92.7 576 64 547.3 64 512L64 128C64 92.7 92.7 64 128 64L261.5 64C278.5 64 294.8 70.7 306.8 82.7L429.3 205.3C441.3 217.3 448 233.6 448 250.6L448 400.1L400 400.1L400 272.1L312 272.1C272.2 272.1 240 239.9 240 200.1L240 112.1zM380.1 224L288 131.9L288 200C288 213.3 298.7 224 312 224L380.1 224zM257.1 453.7L288 505.1L318.9 453.7C323.5 446 332.7 442.3 341.4 444.7C350.1 447.1 356 455 356 464L356 592C356 603 347 612 336 612C325 612 316 603 316 592L316 536.2L305.1 554.3C301.5 560.3 295 564 288 564C281 564 274.5 560.3 270.9 554.3L260 536.2L260 592C260 603 251 612 240 612C229 612 220 603 220 592L220 464C220 455 226 447.1 234.7 444.7C243.4 442.3 252.6 446 257.2 453.7zM400 444L432 444C465.1 444 492 470.9 492 504C492 537.1 465.1 564 432 564L420 564L420 592C420 603 411 612 400 612C389 612 380 603 380 592L380 464C380 453 389 444 400 444zM432 524C443 524 452 515 452 504C452 493 443 484 432 484L420 484L420 524L432 524zM513.9 542.1C510.1 538.3 508 533.3 508 528L508 464C508 453 517 444 528 444C539 444 548 453 548 464L548 508L572 508L572 464C572 453 581 444 592 444C603 444 612 453 612 464L612 592C612 603 603 612 592 612C581 612 572 603 572 592L572 548L528 548C522.7 548 517.6 545.9 513.9 542.1z" })
      }
    );
  }
  function IconFileMp3({
    className,
    size = 24
  }) {
    return u(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 640 640",
        width: size,
        height: size,
        className,
        fill: "currentColor",
        children: u("path", { d: "M240 112L128 112C119.2 112 112 119.2 112 128L112 512C112 520.8 119.2 528 128 528L176 528L176 576L128 576C92.7 576 64 547.3 64 512L64 128C64 92.7 92.7 64 128 64L261.5 64C278.5 64 294.8 70.7 306.8 82.7L429.3 205.3C441.3 217.3 448 233.6 448 250.6L448 400.1L400 400.1L400 272.1L312 272.1C272.2 272.1 240 239.9 240 200.1L240 112.1zM380.1 224L288 131.9L288 200C288 213.3 298.7 224 312 224L380.1 224zM257.1 453.7L288 505.1L318.9 453.7C323.5 446 332.7 442.3 341.4 444.7C350.1 447.1 356 455 356 464L356 592C356 603 347 612 336 612C325 612 316 603 316 592L316 536.2L305.1 554.3C301.5 560.3 295 564 288 564C281 564 274.5 560.3 270.9 554.3L260 536.2L260 592C260 603 251 612 240 612C229 612 220 603 220 592L220 464C220 455 226 447.1 234.7 444.7C243.4 442.3 252.6 446 257.2 453.7zM400 444L432 444C465.1 444 492 470.9 492 504C492 537.1 465.1 564 432 564L420 564L420 592C420 603 411 612 400 612C389 612 380 603 380 592L380 464C380 453 389 444 400 444zM432 524C443 524 452 515 452 504C452 493 443 484 432 484L420 484L420 524L432 524zM612 560C612 588.7 588.7 612 560 612L528 612C517 612 508 603 508 592C508 581 517 572 528 572L560 572C566.6 572 572 566.6 572 560C572 553.4 566.6 548 560 548L536 548C525 548 516 539 516 528C516 517 525 508 536 508L560 508C566.6 508 572 502.6 572 496C572 489.4 566.6 484 560 484L528 484C517 484 508 475 508 464C508 453 517 444 528 444L560 444C588.7 444 612 467.3 612 496C612 508.1 607.9 519.2 601 528C607.9 536.8 612 547.9 612 560z" })
      }
    );
  }
  function sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F\x7F]/g, "").replace(/\s+/g, " ").trim().substring(0, 200);
  }
  const ID3Writer = window.ID3Writer?.ID3Writer || window.ID3Writer;
  async function createSquareAlbumArt(thumbnailUrl, size = 1200) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const sourceWidth = img.width;
        const sourceHeight = img.height;
        const sourceAspect = sourceWidth / sourceHeight;
        let cropWidth;
        let cropHeight;
        let cropX;
        let cropY;
        if (sourceAspect > 1) {
          cropHeight = sourceHeight;
          cropWidth = sourceHeight;
          cropX = (sourceWidth - cropWidth) / 2;
          cropY = 0;
        } else {
          cropWidth = sourceWidth;
          cropHeight = sourceWidth;
          cropX = 0;
          cropY = (sourceHeight - cropHeight) / 2;
        }
        ctx.filter = "blur(40px)";
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          size,
          size
        );
        ctx.filter = "none";
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, size, size);
        const aspectRatio = 16 / 9;
        let drawWidth = size;
        let drawHeight = size / aspectRatio;
        let offsetX = 0;
        let offsetY = (size - drawHeight) / 2;
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.95
        );
      };
      img.onerror = () => {
        reject(new Error("Failed to load thumbnail"));
      };
      const videoId = extractVideoIdFromThumbnail(thumbnailUrl);
      img.src = videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : thumbnailUrl;
    });
  }
  function extractVideoIdFromThumbnail(url) {
    const match = url.match(/\/vi\/([^\/]+)\//);
    return match && match[1] ? match[1] : null;
  }
  async function embedAlbumArtToMP3(mp3Blob, albumArtBlob, metadata) {
    try {
      const mp3Buffer = await mp3Blob.arrayBuffer();
      const artBuffer = await albumArtBlob.arrayBuffer();
      const writer = new ID3Writer(mp3Buffer);
      writer.setFrame("TIT2", metadata.title);
      writer.setFrame("APIC", {
        type: 3,
data: artBuffer,
        description: "Cover"
      });
      writer.padding = 4096;
      writer.addTag();
      return new Blob([writer.arrayBuffer], { type: "audio/mpeg" });
    } catch (error) {
      console.error("[AlbumArt] Error embedding album art:", error);
      return mp3Blob;
    }
  }
  const API_KEY_URL = "https://cnv.cx/v2/sanity/key";
  const API_CONVERT_URL = "https://cnv.cx/v2/converter";
  const REQUEST_HEADERS = {
    "Content-Type": "application/json",
    Origin: "https://mp3yt.is",
    Accept: "*/*",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
  };
  function DDLTab() {
    const [youtubeService2] = hooks.useState(() => new YouTubeService());
    const [channelId, setChannelId] = hooks.useState(null);
    const [playlistId, setPlaylistId] = hooks.useState(null);
    const [playlistVideos, setPlaylistVideos] = hooks.useState([]);
    const [loadingPlaylist, setLoadingPlaylist] = hooks.useState(false);
    const [activeContentTab, setActiveContentTab] = hooks.useState("videos");
    const [format, setFormat] = hooks.useState("video");
    const [quality, setQuality] = hooks.useState("1080");
    const [audioBitrate, setAudioBitrate] = hooks.useState("128");
    const [embedThumbnail, setEmbedThumbnail] = hooks.useState(false);
    const [currentPageType, setCurrentPageType] = hooks.useState("channel");
    const [currentVideoId, setCurrentVideoId] = hooks.useState(null);
    const [currentVideoTitle, setCurrentVideoTitle] = hooks.useState("");
    const [currentVideoDuration, setCurrentVideoDuration] = hooks.useState("");
    const [currentVideoMaxQuality, setCurrentVideoMaxQuality] = hooks.useState("");
    const [loadingVideoInfo, setLoadingVideoInfo] = hooks.useState(false);
    const [recentlyWatchedVideos, setRecentlyWatchedVideos] = hooks.useState([]);
    const [loadingRecentVideos, setLoadingRecentVideos] = hooks.useState(true);
    const [previousVideoData, setPreviousVideoData] = hooks.useState(null);
    const [loadingSubtitles, setLoadingSubtitles] = hooks.useState(false);
    const [subtitleVideoId, setSubtitleVideoId] = hooks.useState(null);
    const [errorMessage, setErrorMessage] = hooks.useState("");
    const [videosCache, setVideosCache] = hooks.useState({
      videos: [],
      shorts: [],
      live: []
    });
    const [loadingCache, setLoadingCache] = hooks.useState({
      videos: false,
      shorts: false,
      live: false
    });
    const [currentPageCache, setCurrentPageCache] = hooks.useState({
      videos: 1,
      shorts: 1,
      live: 1
    });
    const [downloadingIds, setDownloadingIds] = hooks.useState( new Set());
    const [downloadProgress, setDownloadProgress] = hooks.useState({});
    const [selectedVideoIds, setSelectedVideoIds] = hooks.useState(
new Set()
    );
    const [downloadQueue, setDownloadQueue] = hooks.useState([]);
    const [isProcessingQueue, setIsProcessingQueue] = hooks.useState(false);
    const [failedDownloads, setFailedDownloads] = hooks.useState(
new Set()
    );
    const [totalDownloadedSize, setTotalDownloadedSize] = hooks.useState(0);
    const [completedDownloads, setCompletedDownloads] = hooks.useState(0);
    const [showFailedVideos, setShowFailedVideos] = hooks.useState(false);
    const [bulkDownloadCompleted, setBulkDownloadCompleted] = hooks.useState(false);
    const [successfulDownloads, setSuccessfulDownloads] = hooks.useState(0);
    const [successfulVideoIds, setSuccessfulVideoIds] = hooks.useState(
new Set()
    );
    const [videosPerPage, setVideosPerPage] = hooks.useState(8);
    const [abortControllers, setAbortControllers] = hooks.useState({
      videos: null,
      shorts: null,
      live: null
    });
    const formatBytes = (bytes) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    const videos = videosCache[activeContentTab];
    const loading = loadingCache[activeContentTab];
    const currentPage = currentPageCache[activeContentTab];
    const videoQualities = DDL_VIDEO_QUALITIES;
    const audioQualities = AUDIO_BITRATES;
    const isChannelPage = () => {
      const path = window.location.pathname;
      return path.startsWith("/@") || path.startsWith("/channel/");
    };
    const isWatchPage = () => {
      const path = window.location.pathname;
      return path === "/watch" || path.startsWith("/shorts/");
    };
    const isPlaylistPage = () => {
      return youtubeService2.isPlaylistPage();
    };
    const getVideoIdFromUrl = () => {
      const path = window.location.pathname;
      if (path.startsWith("/shorts/")) {
        return path.split("/shorts/")[1]?.split("?")[0] || null;
      }
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("v");
    };
    const getVideoTitle2 = () => {
      let titleElement = document.querySelector(
        "h1.ytd-watch-metadata yt-formatted-string"
      );
      if (!titleElement) {
        titleElement = document.querySelector("h2.reel-video-in-sequence-title");
      }
      if (!titleElement) {
        titleElement = document.querySelector("#shorts-player h2");
      }
      return titleElement?.textContent?.trim() || "video";
    };
    const fetchVideoInfo = async (videoId) => {
      setLoadingVideoInfo(true);
      try {
        const response = await innerTubeRequest("/youtubei/v1/player", {
          videoId
        });
        const title = response.videoDetails?.title;
        if (title) {
          setCurrentVideoTitle(title);
        }
        const lengthSeconds = response.videoDetails?.lengthSeconds;
        if (lengthSeconds) {
          const duration = formatDuration(parseInt(lengthSeconds));
          setCurrentVideoDuration(duration);
        }
        const adaptiveFormats = response.streamingData?.adaptiveFormats || [];
        const videoFormats = adaptiveFormats.filter(
          (f2) => f2.qualityLabel && f2.mimeType?.includes("video")
        );
        const audioFormats = adaptiveFormats.filter(
          (f2) => f2.mimeType?.includes("audio")
        );
        let qualityInfo = "";
        if (videoFormats.length > 0) {
          const sortedFormats = videoFormats.sort((a, b) => {
            const qualityA = parseInt(a.qualityLabel) || 0;
            const qualityB = parseInt(b.qualityLabel) || 0;
            return qualityB - qualityA;
          });
          const highestQuality = sortedFormats[0].qualityLabel;
          qualityInfo = `Max Quality: ${highestQuality}`;
        }
        if (audioFormats.length > 0) {
          const sortedAudio = audioFormats.sort((a, b) => {
            const bitrateA = a.bitrate || 0;
            const bitrateB = b.bitrate || 0;
            return bitrateB - bitrateA;
          });
          const highestAudioBitrate = Math.round(sortedAudio[0].bitrate / 1e3);
          const audioInfo = `Audio: ${highestAudioBitrate}kbps`;
          if (qualityInfo) {
            qualityInfo += ` / ${audioInfo}`;
          } else {
            qualityInfo = audioInfo;
          }
        }
        setCurrentVideoMaxQuality(qualityInfo || "Quality info unavailable");
      } catch (error) {
        console.error("[DDL] Error fetching video info:", error);
      } finally {
        setLoadingVideoInfo(false);
      }
    };
    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const secs = seconds % 60;
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };
    const fetchSubtitles = async (videoId) => {
      setLoadingSubtitles(true);
      setSubtitleVideoId(videoId);
      try {
        const result = await youtubeService2.getSubtitles(videoId);
        if (!result) {
          throw new Error("Failed to fetch subtitles from YouTube");
        }
        const videoTitle = result.videoTitle || currentVideoTitle || "video";
        if (result.subtitles.length === 0 && result.autoTransSubtitles.length === 0) {
          throw new Error("No subtitles available for this video");
        }
        const processedSubtitles = result.subtitles.map((sub) => {
          let downloadUrl = sub.url;
          if (!downloadUrl.includes("fmt=")) {
            downloadUrl += "&fmt=srv1";
          }
          return {
            name: sub.name,
            code: sub.languageCode,
            url: downloadUrl,
            isAutoGenerated: sub.isAutoGenerated,
download: {
              srt: downloadUrl,
              txt: downloadUrl,
              raw: downloadUrl
            }
          };
        });
        const baseTrack = result.subtitles[0];
        const processedAutoTrans = result.autoTransSubtitles.map((sub) => {
          const translatedUrl = baseTrack ? `${baseTrack.url}&tlang=${sub.languageCode}&fmt=srv1` : "";
          return {
            name: sub.name,
            code: sub.languageCode,
            url: translatedUrl,
            isAutoGenerated: true,
            download: {
              srt: translatedUrl,
              txt: translatedUrl,
              raw: translatedUrl
            }
          };
        });
        openSubtitleDialog({
          videoId,
          videoTitle,
          subtitles: processedSubtitles,
          autoTransSubtitles: processedAutoTrans
        });
      } catch (error) {
        console.error("[DDL] Error fetching subtitles:", error);
        playErrorSound();
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to fetch subtitles"
        );
        setTimeout(() => setErrorMessage(""), 3e3);
      } finally {
        setLoadingSubtitles(false);
      }
    };
    const loadChannelInfo = async () => {
      if (activeTab.value !== "ddl") {
        return;
      }
      if (!isChannelPage() && !isWatchPage() && !isPlaylistPage()) {
        setChannelId(null);
        setPlaylistId(null);
        setPlaylistVideos([]);
        setCurrentVideoId(null);
        setCurrentVideoTitle("");
        setCurrentVideoDuration("");
        setCurrentVideoMaxQuality("");
        setVideosCache({ videos: [], shorts: [], live: [] });
        setLoadingCache({ videos: false, shorts: false, live: false });
        setCurrentPageCache({ videos: 1, shorts: 1, live: 1 });
        return;
      }
      if (isPlaylistPage()) {
        const id = youtubeService2.getPlaylistIdFromURL();
        if (id !== playlistId) {
          setPlaylistId(id);
          setChannelId(null);
          setCurrentVideoId(null);
          setPlaylistVideos([]);
          setSelectedVideoIds( new Set());
          setDownloadQueue([]);
          setIsProcessingQueue(false);
          setFailedDownloads( new Set());
          setTotalDownloadedSize(0);
          setCompletedDownloads(0);
          setSuccessfulDownloads(0);
          setSuccessfulVideoIds( new Set());
          setBulkDownloadCompleted(false);
          setShowFailedVideos(false);
          if (id && isPanelVisible.value) {
            fetchPlaylistVideos(id);
          }
        }
        return;
      }
      if (isWatchPage()) {
        const videoId = getVideoIdFromUrl();
        if (videoId !== currentVideoId) {
          setCurrentVideoId(videoId);
          const title = getVideoTitle2();
          if (title && title !== "video") {
            setCurrentVideoTitle(title);
          } else {
            setCurrentVideoTitle("Loading...");
          }
          setCurrentVideoDuration("");
          setCurrentVideoMaxQuality("");
          if (videoId && isPanelVisible.value) {
            fetchVideoInfo(videoId);
          }
        } else if (videoId && !currentVideoTitle) {
          const title = getVideoTitle2();
          if (title && title !== "video") {
            setCurrentVideoTitle(title);
          }
        }
        setChannelId(null);
        setPlaylistId(null);
        return;
      }
      if (isChannelPage()) {
        const id = await youtubeService2.getChannelId();
        if (id !== channelId) {
          setChannelId(id);
          setPlaylistId(null);
          setCurrentVideoId(null);
          setVideosCache({ videos: [], shorts: [], live: [] });
          setLoadingCache({ videos: false, shorts: false, live: false });
          setCurrentPageCache({ videos: 1, shorts: 1, live: 1 });
          setSelectedVideoIds( new Set());
          setDownloadQueue([]);
          setIsProcessingQueue(false);
          setFailedDownloads( new Set());
          setTotalDownloadedSize(0);
          setCompletedDownloads(0);
          setSuccessfulDownloads(0);
          setSuccessfulVideoIds( new Set());
          setBulkDownloadCompleted(false);
          setShowFailedVideos(false);
        }
      }
    };
    const fetchPlaylistVideos = async (id) => {
      setLoadingPlaylist(true);
      try {
        const videos2 = await youtubeService2.fetchPlaylistVideos(id);
        const parsedVideos = videos2.map((item) => ({
          videoId: item.videoId,
          title: item.title?.runs?.[0]?.text || item.title?.simpleText || "Untitled",
          thumbnail: item.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
          duration: item.lengthText?.simpleText || "",
          publishedTime: item.publishedTimeText?.simpleText || ""
        }));
        setPlaylistVideos(parsedVideos);
      } catch (error) {
        console.error("[DDL] Error fetching playlist:", error);
        playErrorSound();
        setErrorMessage("Failed to fetch playlist videos");
        setTimeout(() => setErrorMessage(""), 3e3);
      } finally {
        setLoadingPlaylist(false);
      }
    };
    const fetchVideos = async (tabType) => {
      if (!channelId) return;
      if (abortControllers[tabType]) {
        abortControllers[tabType].abort();
      }
      const controller = new AbortController();
      setAbortControllers((prev) => ({ ...prev, [tabType]: controller }));
      setLoadingCache((prev) => ({ ...prev, [tabType]: true }));
      try {
        const allVideos = [];
        let continuation = void 0;
        let pageCount = 0;
        const maxPages = 100;
        const TAB_TYPE_PARAMS2 = {
          videos: "EgZ2aWRlb3PyBgQKAjoA",
          shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
          live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D"
        };
        do {
          if (controller.signal.aborted) {
            break;
          }
          if (activeTab.value !== "ddl" || !isPanelVisible.value) {
            break;
          }
          const params = TAB_TYPE_PARAMS2[tabType];
          const response = await innerTubeRequest(
            "/youtubei/v1/browse",
            {
              browseId: channelId,
              params,
              continuation
            },
            controller.signal
          );
          const items = parseTabData(tabType, response);
          const parsedVideos = parseVideos(items, tabType);
          allVideos.push(...parsedVideos);
          const filteredVideos2 = tabType === "live" ? allVideos.filter((v) => v.duration && v.duration !== "0:00") : allVideos;
          setVideosCache((prev) => ({ ...prev, [tabType]: filteredVideos2 }));
          continuation = getContinuation(response, tabType);
          pageCount++;
          if (!continuation || pageCount >= maxPages) break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        } while (continuation);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("[DDL] Error fetching videos:", error);
        }
      } finally {
        setLoadingCache((prev) => ({ ...prev, [tabType]: false }));
        setAbortControllers((prev) => ({ ...prev, [tabType]: null }));
      }
    };
    const innerTubeRequest = async (endpoint, data, signal2) => {
      const url = `${API_CONFIG.BASE_URL}${endpoint}?key=${API_CONFIG.INNERTUBE_API_KEY}&prettyPrint=false`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": API_CONFIG.INNERTUBE_CLIENT_VERSION
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: API_CONFIG.INNERTUBE_CLIENT_NAME,
              clientVersion: API_CONFIG.INNERTUBE_CLIENT_VERSION,
              hl: "en",
              gl: "US"
            }
          },
          ...data
        }),
        signal: signal2
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    };
    const getContinuation = (data, tabType) => {
      const TAB_TYPE_PARAMS2 = {
        videos: "EgZ2aWRlb3PyBgQKAjoA",
        shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
        live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D"
      };
      if (tabType === "shorts") {
        const tab2 = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
          (t) => t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS2[tabType]
        );
        const contents = tab2?.tabRenderer?.content?.richGridRenderer?.contents || [];
        const continuationItem = contents.find(
          (c) => c.continuationItemRenderer
        );
        if (continuationItem) {
          return continuationItem.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        }
        const continuationItems = data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
        const contItem = continuationItems.find(
          (c) => c.continuationItemRenderer
        );
        if (contItem) {
          return contItem.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        }
        return void 0;
      }
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
        (t) => t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS2[tabType]
      );
      const items = tab?.tabRenderer?.content?.richGridRenderer?.contents || data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
      const continuation = items[items.length - 1];
      const renderer = continuation?.continuationItemRenderer;
      if (!renderer) return void 0;
      return renderer?.continuationEndpoint?.continuationCommand?.token;
    };
    const parseTabData = (tabType, data) => {
      const TAB_TYPE_PARAMS2 = {
        videos: "EgZ2aWRlb3PyBgQKAjoA",
        shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
        live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D"
      };
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
        (t) => t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS2[tabType]
      );
      if (tabType === "shorts" && tab?.tabRenderer?.content?.richGridRenderer) {
        const contents = tab.tabRenderer.content.richGridRenderer.contents || [];
        return contents.map((c) => c.richItemRenderer?.content || c).filter((c) => c.shortsLockupViewModel || c.reelItemRenderer);
      }
      if (tabType === "shorts" && (data.onResponseReceivedActions || data.onResponseReceivedEndpoints)) {
        const continuationItems = data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
        return continuationItems.map((c) => c.richItemRenderer?.content || c).filter((c) => c.shortsLockupViewModel || c.reelItemRenderer);
      }
      if (tab?.tabRenderer?.content?.richGridRenderer?.contents) {
        const contents = tab.tabRenderer.content.richGridRenderer.contents;
        return contents.map((c) => c.richItemRenderer?.content || c);
      }
      if (data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems) {
        const items = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        return items.map((c) => c.richItemRenderer?.content || c);
      }
      if (data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems) {
        const items = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return items;
      }
      return [];
    };
    const parseVideos = (items, tabType) => {
      if (tabType === "shorts") {
        return items.filter((item) => item.shortsLockupViewModel || item.reelItemRenderer).map((item) => {
          const lockup = item.shortsLockupViewModel;
          if (lockup) {
            const videoId = lockup.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
            const title = lockup.overlayMetadata?.primaryText?.content || "Untitled";
            return {
              videoId,
              title,
              thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
            };
          }
          const renderer = item.reelItemRenderer;
          return {
            videoId: renderer.videoId,
            title: renderer.headline?.simpleText || "Untitled",
            thumbnail: `https://i.ytimg.com/vi/${renderer.videoId}/mqdefault.jpg`
          };
        }).filter((v) => v.videoId);
      }
      return items.filter((item) => item.videoRenderer).map((item) => {
        const renderer = item.videoRenderer;
        return {
          videoId: renderer.videoId,
          title: renderer.title?.runs?.[0]?.text || renderer.title?.simpleText || "Untitled",
          thumbnail: renderer.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${renderer.videoId}/mqdefault.jpg`,
          duration: renderer.lengthText?.simpleText || "",
          publishedTime: renderer.publishedTimeText?.simpleText || "",
          channelName: renderer.ownerText?.runs?.[0]?.text || renderer.shortBylineText?.runs?.[0]?.text || void 0
        };
      }).filter((v) => v.videoId);
    };
    const gmXmlHttpRequest = (options2) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          ...options2,
          onload: (response) => {
            if (options2.onload) options2.onload(response);
            resolve(response);
          },
          onerror: (error) => {
            if (options2.onerror) options2.onerror(error);
            reject(error);
          },
          ontimeout: () => {
            if (options2.ontimeout) options2.ontimeout();
            reject(new Error("Request timeout"));
          }
        });
      });
    };
    const downloadVideo = async (videoId, title) => {
      setDownloadingIds((prev) => new Set(prev).add(videoId));
      try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const keyResponse = await gmXmlHttpRequest({
          method: "GET",
          url: API_KEY_URL,
          headers: REQUEST_HEADERS
        });
        if (keyResponse.status !== 200) {
          throw new Error(`Failed to get API key: ${keyResponse.status}`);
        }
        const keyData = JSON.parse(keyResponse.responseText);
        if (!keyData || !keyData.key) {
          throw new Error("Failed to get API key");
        }
        const key = keyData.key;
        let payload;
        if (format === "video") {
          const codec = parseInt(quality) > 1080 ? "vp9" : "h264";
          payload = {
            link: videoUrl,
            format: "mp4",
            audioBitrate: "128",
            videoQuality: quality,
            filenameStyle: "pretty",
            vCodec: codec
          };
        } else {
          payload = {
            link: videoUrl,
            format: "mp3",
            audioBitrate,
            filenameStyle: "pretty"
          };
        }
        const customHeaders = {
          ...REQUEST_HEADERS,
          key
        };
        const downloadResponse = await gmXmlHttpRequest({
          method: "POST",
          url: API_CONVERT_URL,
          headers: customHeaders,
          data: JSON.stringify(payload)
        });
        if (downloadResponse.status !== 200) {
          throw new Error(`Conversion failed: ${downloadResponse.status}`);
        }
        const apiDownloadInfo = JSON.parse(downloadResponse.responseText);
        if (apiDownloadInfo.url) {
          await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: "GET",
              url: apiDownloadInfo.url,
              responseType: "blob",
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                Referer: "https://mp3yt.is/",
                Accept: "*/*"
              },
              onprogress: (progress) => {
                setDownloadProgress((prev) => ({
                  ...prev,
                  [videoId]: {
                    loaded: progress.loaded,
                    total: progress.total
                  }
                }));
              },
              onload: async (response) => {
                if (response.status === 200 && response.response) {
                  let blob = response.response;
                  if (blob.size === 0) {
                    reject(new Error("Downloaded file is 0 bytes"));
                    return;
                  }
                  if (format === "audio" && embedThumbnail) {
                    try {
                      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
                      const albumArt = await createSquareAlbumArt(thumbnailUrl);
                      blob = await embedAlbumArtToMP3(blob, albumArt, {
                        title
                      });
                    } catch (error) {
                      console.error("[DDL] Failed to embed album art:", error);
                    }
                  }
                  const blobUrl = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = blobUrl;
                  const filename = apiDownloadInfo.filename || `${title}.${format === "video" ? "mp4" : "mp3"}`;
                  a.download = sanitizeFilename(filename);
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(blobUrl);
                  setFailedDownloads((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(videoId);
                    return newSet;
                  });
                  setTotalDownloadedSize((prev) => prev + blob.size);
                  setCompletedDownloads((prev) => prev + 1);
                  setSuccessfulDownloads((prev) => prev + 1);
                  setSuccessfulVideoIds((prev) => new Set(prev).add(videoId));
                  resolve();
                } else {
                  reject(new Error(`Download failed: ${response.status}`));
                }
              },
              onerror: () => reject(new Error("Download failed")),
              ontimeout: () => reject(new Error("Download timeout"))
            });
          });
        } else {
          throw new Error("No download URL received");
        }
      } catch (error) {
        console.error("[DDL] Download error:", error);
        playErrorSound();
        setErrorMessage(`Failed to download: ${error}`);
        setTimeout(() => setErrorMessage(""), 1e3);
        setFailedDownloads((prev) => new Set(prev).add(videoId));
      } finally {
        setDownloadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        setDownloadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[videoId];
          return newProgress;
        });
      }
    };
    const processDownloadQueue = async () => {
      if (isProcessingQueue || downloadQueue.length === 0) return;
      setIsProcessingQueue(true);
      for (const videoId of downloadQueue) {
        let video;
        if (playlistVideos.length > 0) {
          video = playlistVideos.find((v) => v.videoId === videoId);
        }
        if (!video) {
          for (const type of ["videos", "shorts", "live"]) {
            video = videosCache[type].find((v) => v.videoId === videoId);
            if (video) break;
          }
        }
        if (video) {
          await downloadVideo(videoId, video.title);
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        }
      }
      setDownloadQueue([]);
      setIsProcessingQueue(false);
      setBulkDownloadCompleted(true);
    };
    const retryFailedDownloads = () => {
      const failedIds = Array.from(failedDownloads);
      setDownloadQueue(failedIds);
      setTotalDownloadedSize(0);
      setCompletedDownloads(0);
      setSuccessfulDownloads(0);
      setBulkDownloadCompleted(false);
    };
    const clearFailedDownloads = () => {
      setFailedDownloads( new Set());
      setBulkDownloadCompleted(false);
      setShowFailedVideos(false);
      setSelectedVideoIds( new Set());
      setTotalDownloadedSize(0);
      setCompletedDownloads(0);
      setSuccessfulDownloads(0);
      setSuccessfulVideoIds( new Set());
    };
    const startBulkDownload = () => {
      const selectedIds = Array.from(selectedVideoIds);
      setDownloadQueue(selectedIds);
      setTotalDownloadedSize(0);
      setCompletedDownloads(0);
      setSuccessfulDownloads(0);
      setBulkDownloadCompleted(false);
      setShowFailedVideos(false);
      setFailedDownloads( new Set());
      setSuccessfulVideoIds( new Set());
    };
    const toggleVideoSelection = (videoId) => {
      setSelectedVideoIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(videoId)) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
        }
        return newSet;
      });
    };
    const toggleSelectAll = (allVideos) => {
      const allSelected = allVideos.every(
        (v) => selectedVideoIds.has(v.videoId)
      );
      setSelectedVideoIds((prev) => {
        const newSet = new Set(prev);
        allVideos.forEach((v) => {
          if (allSelected) {
            newSet.delete(v.videoId);
          } else {
            newSet.add(v.videoId);
          }
        });
        return newSet;
      });
    };
    hooks.useEffect(() => {
      if (downloadQueue.length > 0 && !isProcessingQueue) {
        processDownloadQueue();
      }
    }, [downloadQueue]);
    hooks.useEffect(() => {
      let pageType = "channel";
      if (isWatchPage()) {
        pageType = "watch";
      } else if (isPlaylistPage()) {
        pageType = "playlist";
      }
      if (pageType !== currentPageType) {
        setCurrentPageType(pageType);
        loadDDLSettings();
      }
    }, [channelId, playlistId, currentVideoId]);
    hooks.useEffect(() => {
      if (activeTab.value !== "ddl") {
        Object.values(abortControllers).forEach((controller) => {
          if (controller) {
            controller.abort();
          }
        });
        return;
      }
      loadDDLSettings();
      loadChannelInfo();
      loadPerPageSetting();
      const checkUrlChange = () => {
        const currentHandle = youtubeService2.getChannelHandleFromURL();
        if (currentHandle !== youtubeService2.getChannelHandle()) {
          youtubeService2.clearCache();
          setChannelId(null);
          loadChannelInfo();
        }
        if (!isChannelPage() && !isWatchPage()) {
          if (currentVideoId !== null) {
            setCurrentVideoId(null);
            setCurrentVideoTitle("");
            setCurrentVideoDuration("");
            setCurrentVideoMaxQuality("");
          }
          return;
        }
        if (isWatchPage()) {
          const newVideoId = getVideoIdFromUrl();
          if (newVideoId && newVideoId !== currentVideoId) {
            setCurrentVideoId(newVideoId);
            const domTitle = getVideoTitle2();
            if (domTitle && domTitle !== "video") {
              setCurrentVideoTitle(domTitle);
            } else {
              setCurrentVideoTitle("Loading...");
            }
            setCurrentVideoDuration("");
            setCurrentVideoMaxQuality("");
            if (isPanelVisible.value) {
              fetchVideoInfo(newVideoId);
            }
          } else if (newVideoId && currentVideoId === newVideoId) {
            if (currentVideoTitle === "Loading..." || currentVideoTitle === "video") {
              const newTitle = getVideoTitle2();
              if (newTitle && newTitle !== "video") {
                setCurrentVideoTitle(newTitle);
              }
            }
          }
        }
      };
      const handleSettingsUpdate = () => {
        loadPerPageSetting();
      };
      window.addEventListener("settings-updated", handleSettingsUpdate);
      const intervalId = setInterval(checkUrlChange, 1e3);
      return () => {
        clearInterval(intervalId);
        window.removeEventListener("settings-updated", handleSettingsUpdate);
        Object.values(abortControllers).forEach((controller) => {
          if (controller) {
            controller.abort();
          }
        });
      };
    }, [activeTab.value, currentVideoId, currentVideoTitle]);
    const loadPerPageSetting = async () => {
      const perPage = await storage.get("ddl-per-page", "8");
      setVideosPerPage(parseInt(perPage));
    };
    const loadDDLSettings = async () => {
      let pageType = "channel";
      if (isWatchPage()) {
        pageType = "watch";
      } else if (isPlaylistPage()) {
        pageType = "playlist";
      }
      const contentTab = await storage.get("ddl-contentTab", "videos");
      setActiveContentTab(contentTab);
      const fmt = await storage.get(`ddl-format-${pageType}`, "video");
      setFormat(fmt);
      const qual = await storage.get(`ddl-videoQuality-${pageType}`, "1080");
      setQuality(qual);
      const bitrate = await storage.get(`ddl-audioBitrate-${pageType}`, "128");
      setAudioBitrate(bitrate);
      const embedThumb = await storage.get("ddl-embedThumbnail", "false");
      setEmbedThumbnail(embedThumb === "true");
      setLoadingRecentVideos(true);
      const recentlyWatched = await storage.get(
        "tubeinsights-recently-watched",
        ""
      );
      if (recentlyWatched) {
        try {
          const parsed = JSON.parse(recentlyWatched);
          if (Array.isArray(parsed)) {
            setRecentlyWatchedVideos(parsed);
          } else if (parsed && parsed.videoId) {
            setRecentlyWatchedVideos([parsed]);
          }
        } catch (e) {
          console.error("[DDL] Failed to parse recent videos:", e);
        }
      }
      setLoadingRecentVideos(false);
    };
    const saveRecentlyWatched = async (videoId, title, duration, maxQuality) => {
      const newVideo = { videoId, title, duration, maxQuality };
      const filtered = recentlyWatchedVideos.filter((v) => v.videoId !== videoId);
      const updated = [newVideo, ...filtered].slice(0, 5);
      setRecentlyWatchedVideos(updated);
      await storage.set("tubeinsights-recently-watched", JSON.stringify(updated));
    };
    hooks.useEffect(() => {
      if (channelId && activeTab.value === "ddl" && isPanelVisible.value && isChannelPage()) {
        if (videosCache.videos.length === 0 && !loadingCache.videos) {
          fetchVideos("videos");
        }
        if (videosCache.shorts.length === 0 && !loadingCache.shorts) {
          fetchVideos("shorts");
        }
        if (videosCache.live.length === 0 && !loadingCache.live) {
          fetchVideos("live");
        }
      }
    }, [channelId, activeTab.value, isPanelVisible.value]);
    hooks.useEffect(() => {
      if (playlistId && activeTab.value === "ddl" && isPanelVisible.value && isPlaylistPage() && playlistVideos.length === 0 && !loadingPlaylist) {
        fetchPlaylistVideos(playlistId);
      }
    }, [playlistId, activeTab.value, isPanelVisible.value]);
    hooks.useEffect(() => {
      if (activeTab.value === "ddl" && isPanelVisible.value && isWatchPage() && currentVideoId && !currentVideoDuration && !loadingVideoInfo) {
        fetchVideoInfo(currentVideoId);
      }
    }, [
      activeTab.value,
      isPanelVisible.value,
      currentVideoId,
      currentVideoDuration,
      loadingVideoInfo
    ]);
    hooks.useEffect(() => {
      const handleCacheCleared = () => {
        setRecentlyWatchedVideos([]);
        setLoadingRecentVideos(false);
      };
      window.addEventListener("cache-cleared", handleCacheCleared);
      return () => {
        window.removeEventListener("cache-cleared", handleCacheCleared);
      };
    }, []);
    hooks.useEffect(() => {
      if (isWatchPage() && currentVideoId && currentVideoTitle && currentVideoTitle !== "Loading..." && currentVideoDuration && currentVideoMaxQuality) {
        if (previousVideoData && previousVideoData.videoId !== currentVideoId) {
          saveRecentlyWatched(
            previousVideoData.videoId,
            previousVideoData.title,
            previousVideoData.duration,
            previousVideoData.maxQuality
          );
        }
        setPreviousVideoData({
          videoId: currentVideoId,
          title: currentVideoTitle,
          duration: currentVideoDuration,
          maxQuality: currentVideoMaxQuality
        });
      }
    }, [
      currentVideoId,
      currentVideoTitle,
      currentVideoDuration,
      currentVideoMaxQuality
    ]);
    if (isWatchPage() && currentVideoId) {
      return u("div", { className: "space-y-4", children: [
        errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
        ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "flex gap-2", children: [
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "video" ? "btn-secondary" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("video");
                  storage.set("ddl-format-watch", "video");
                },
                children: [
u(IconFileMp4, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Video" })
                ]
              }
            ),
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "audio" ? "btn-accent" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("audio");
                  storage.set("ddl-format-watch", "audio");
                },
                children: [
u(IconFileMp3, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Audio" })
                ]
              }
            )
          ] }),
          format === "video" ? u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: quality,
              onChange: (e) => {
                const value = e.target.value;
                setQuality(value);
                storage.set("ddl-videoQuality-watch", value);
              },
              children: videoQualities.map((q) => u("option", { value: q, children: [
                q,
                "p"
              ] }, q))
            }
          ) : u(preact.Fragment, { children: [
u("label", { className: "flex items-center gap-3 cursor-pointer", children: [
u(
                "input",
                {
                  type: "checkbox",
                  className: "checkbox checkbox-primary checkbox-lg",
                  checked: embedThumbnail,
                  onChange: (e) => {
                    const checked = e.target.checked;
                    setEmbedThumbnail(checked);
                    storage.set("ddl-embedThumbnail", checked.toString());
                  }
                }
              ),
u("span", { className: "text-xl", children: "Embed Thumbnail" })
            ] }),
u(
              "select",
              {
                className: "select select-bordered select-lg w-full text-xl",
                value: audioBitrate,
                onChange: (e) => {
                  const value = e.target.value;
                  setAudioBitrate(value);
                  storage.set("ddl-audioBitrate-watch", value);
                },
                children: audioQualities.map((q) => u("option", { value: q, children: [
                  q,
                  " kbps"
                ] }, q))
              }
            )
          ] })
        ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "w-full", children: u(
            "a",
            {
              href: `https://i.ytimg.com/vi/${currentVideoId}/maxresdefault.jpg`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block aspect-video rounded overflow-hidden relative hover:opacity-80 transition-opacity",
              children: [
u(
                  "img",
                  {
                    src: `https://i.ytimg.com/vi/${currentVideoId}/mqdefault.jpg`,
                    alt: currentVideoTitle,
                    className: "w-full h-full object-cover"
                  }
                ),
                currentVideoDuration && u("div", { className: "absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-lg font-semibold", children: currentVideoDuration })
              ]
            }
          ) }),
u("div", { className: "space-y-2", children: [
u("h3", { className: "text-xl font-semibold line-clamp-2", children: currentVideoTitle || "Current Video" }),
            loadingVideoInfo ? u("div", { className: "flex items-center gap-2", children: [
u("span", { className: "loading loading-spinner loading-sm" }),
u("span", { className: "text-lg opacity-60", children: "Loading info..." })
            ] }) : currentVideoMaxQuality && u("p", { className: "text-lg opacity-60", children: currentVideoMaxQuality })
          ] }),
          downloadingIds.has(currentVideoId) && u("div", { className: "space-y-1", children: [
u("progress", { className: "progress progress-primary w-full h-2" }),
            downloadProgress[currentVideoId] && u("p", { className: "text-lg opacity-60 text-center", children: [
              formatBytes(downloadProgress[currentVideoId].loaded),
              downloadProgress[currentVideoId].total > 0 && ` / ${formatBytes(
              downloadProgress[currentVideoId].total
            )}`
            ] })
          ] }),
          failedDownloads.has(currentVideoId) && u("div", { className: "flex justify-center", children: u("span", { className: "badge badge-error badge-lg", children: "Failed" }) }),
u("div", { className: "flex gap-2", children: [
u(
              "button",
              {
                className: "btn btn-lg btn-secondary",
                onClick: () => fetchSubtitles(currentVideoId),
                disabled: loadingSubtitles && subtitleVideoId === currentVideoId,
                children: loadingSubtitles && subtitleVideoId === currentVideoId ? u("span", { className: "loading loading-spinner loading-md" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
              }
            ),
u(
              "button",
              {
                className: "btn btn-lg btn-primary flex-1",
                onClick: () => downloadVideo(currentVideoId, currentVideoTitle),
                disabled: downloadingIds.has(currentVideoId),
                children: downloadingIds.has(currentVideoId) ? u(preact.Fragment, { children: [
u("span", { className: "loading loading-spinner loading-md" }),
u("span", { className: "text-xl", children: "Downloading..." })
                ] }) : failedDownloads.has(currentVideoId) ? u(preact.Fragment, { children: [
u(IconRefresh, { className: "size-[1.8em]" }),
u("span", { className: "text-xl", children: "Retry Download" })
                ] }) : u(preact.Fragment, { children: [
u(IconDownload, { className: "size-[1.8em]" }),
u("span", { className: "text-xl", children: "Download" })
                ] })
              }
            )
          ] })
        ] }),
        (loadingRecentVideos || recentlyWatchedVideos.some((v) => v.videoId !== currentVideoId)) && u(preact.Fragment, { children: [
u("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [
u(IconHistory, { className: "size-[1.2em]", size: 24 }),
            "Recent Videos"
          ] }),
u("div", { className: "divider my-0" }),
u("div", { className: "space-y-3", children: loadingRecentVideos ? (

u(preact.Fragment, { children: [...Array(5)].map((_, i) => u("div", { className: "bg-base-200 rounded-lg p-4", children: u(
              "div",
              {
                className: "flex gap-3 items-start",
                style: { minHeight: "68px" },
                children: [
u("div", { className: "skeleton w-[120px] aspect-video rounded shrink-0" }),
u("div", { className: "flex-1 space-y-2 min-w-0 pr-24", children: [
u("div", { className: "skeleton h-5 w-full" }),
u("div", { className: "skeleton h-5 w-3/4" })
                  ] }),
u("div", { className: "flex gap-2", children: [
u("div", { className: "skeleton h-12 w-12 rounded-lg" }),
u("div", { className: "skeleton h-12 w-12 rounded-lg" })
                  ] })
                ]
              }
            ) }, i)) })
          ) : recentlyWatchedVideos.filter((video) => video.videoId !== currentVideoId).map((video) => u(
            "div",
            {
              className: "bg-base-200 rounded-lg p-4",
              children: u(
                "div",
                {
                  className: "flex items-start gap-3 relative",
                  style: { minHeight: "68px" },
                  children: [
u("div", { className: "shrink-0", style: { width: "120px" }, children: [
u(
                        "a",
                        {
                          href: `https://www.youtube.com/watch?v=${video.videoId}`,
                          className: "block aspect-video rounded overflow-hidden mb-1 relative hover:opacity-80 transition-opacity",
                          children: [
u(
                              "img",
                              {
                                src: `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
                                alt: video.title,
                                className: "w-full h-full object-cover"
                              }
                            ),
                            video.duration && u("div", { className: "absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-sm font-semibold", children: video.duration })
                          ]
                        }
                      ),
                      downloadingIds.has(video.videoId) && u("div", { children: [
u("progress", { className: "progress progress-primary w-full h-1" }),
                        downloadProgress[video.videoId] && u("p", { className: "text-lg opacity-60 mt-1", children: formatBytes(
                          downloadProgress[video.videoId].loaded
                        ) })
                      ] }),
                      failedDownloads.has(video.videoId) && u("span", { className: "badge badge-error text-sm", children: "Failed" })
                    ] }),
u("div", { className: "flex-1 min-w-0 pr-24", children: [
u("h3", { className: "text-lg font-medium line-clamp-2", children: video.title }),
                      video.maxQuality && u("p", { className: "text-sm opacity-60 mt-1", children: video.maxQuality })
                    ] }),
u("div", { className: "absolute bottom-0 right-0 flex gap-2", children: [
u(
                        "button",
                        {
                          className: "btn btn-square btn-secondary",
                          onClick: () => fetchSubtitles(video.videoId),
                          disabled: loadingSubtitles && subtitleVideoId === video.videoId,
                          children: loadingSubtitles && subtitleVideoId === video.videoId ? u("span", { className: "loading loading-spinner loading-sm" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
                        }
                      ),
u(
                        "button",
                        {
                          className: "btn btn-square btn-primary",
                          onClick: () => downloadVideo(video.videoId, video.title),
                          disabled: downloadingIds.has(video.videoId),
                          children: downloadingIds.has(video.videoId) ? u("span", { className: "loading loading-spinner loading-sm" }) : failedDownloads.has(video.videoId) ? u(IconRefresh, { className: "size-[1.8em]" }) : u(IconDownload, { className: "size-[1.8em]" })
                        }
                      )
                    ] })
                  ]
                }
              )
            },
            video.videoId
          )) })
        ] })
      ] });
    }
    if (isPlaylistPage() && playlistId) {
      const filteredVideos2 = showFailedVideos ? playlistVideos.filter((v) => failedDownloads.has(v.videoId)) : playlistVideos;
      const totalPages2 = Math.ceil(filteredVideos2.length / videosPerPage);
      const startIndex2 = (currentPage - 1) * videosPerPage;
      const endIndex2 = startIndex2 + videosPerPage;
      const currentVideos2 = filteredVideos2.slice(startIndex2, endIndex2);
      return u("div", { className: "space-y-4", children: [
        errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
        ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "flex gap-2", children: [
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "video" ? "btn-secondary" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("video");
                  storage.set("ddl-format-playlist", "video");
                },
                children: [
u(IconFileMp4, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Video" })
                ]
              }
            ),
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "audio" ? "btn-accent" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("audio");
                  storage.set("ddl-format-playlist", "audio");
                },
                children: [
u(IconFileMp3, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Audio" })
                ]
              }
            )
          ] }),
          format === "video" ? u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: quality,
              onChange: (e) => {
                const value = e.target.value;
                setQuality(value);
                storage.set("ddl-videoQuality-playlist", value);
              },
              children: videoQualities.map((q) => u("option", { value: q, children: [
                q,
                "p"
              ] }, q))
            }
          ) : u(preact.Fragment, { children: [
u("label", { className: "flex items-center gap-3 cursor-pointer", children: [
u(
                "input",
                {
                  type: "checkbox",
                  className: "checkbox checkbox-primary checkbox-lg",
                  checked: embedThumbnail,
                  onChange: (e) => {
                    const checked = e.target.checked;
                    setEmbedThumbnail(checked);
                    storage.set("ddl-embedThumbnail", checked.toString());
                  }
                }
              ),
u("span", { className: "text-xl", children: "Embed Thumbnail" })
            ] }),
u(
              "select",
              {
                className: "select select-bordered select-lg w-full text-xl",
                value: audioBitrate,
                onChange: (e) => {
                  const value = e.target.value;
                  setAudioBitrate(value);
                  storage.set("ddl-audioBitrate-playlist", value);
                },
                children: audioQualities.map((q) => u("option", { value: q, children: [
                  q,
                  " kbps"
                ] }, q))
              }
            )
          ] })
        ] }),
        playlistVideos.length > 0 && u("div", { className: "space-y-3", children: [
u("div", { className: "flex items-center justify-between gap-3", children: [
u("label", { className: "flex items-center gap-2 cursor-pointer", children: [
u(
                "input",
                {
                  type: "checkbox",
                  className: "checkbox checkbox-primary checkbox-lg",
                  checked: playlistVideos.length > 0 && playlistVideos.every((v) => selectedVideoIds.has(v.videoId)),
                  onChange: () => toggleSelectAll(playlistVideos)
                }
              ),
u("span", { className: "text-xl", children: [
                "Select All (",
                playlistVideos.length.toLocaleString(),
                ")"
              ] })
            ] }),
            selectedVideoIds.size > 0 && u(
              "button",
              {
                className: "btn btn-primary",
                onClick: startBulkDownload,
                disabled: isProcessingQueue,
                children: isProcessingQueue ? u(preact.Fragment, { children: [
u("span", { className: "loading loading-spinner loading-md" }),
u("span", { children: "Downloading..." })
                ] }) : u("span", { children: [
                  "Download (",
                  selectedVideoIds.size.toLocaleString(),
                  ")"
                ] })
              }
            )
          ] }),
          isProcessingQueue && u("div", { className: "space-y-2", children: [
u(
              "progress",
              {
                className: "progress progress-primary w-full",
                value: completedDownloads,
                max: downloadQueue.length
              }
            ),
u("div", { className: "flex items-center justify-between", children: [
u("span", { className: "text-lg", children: formatBytes(totalDownloadedSize) }),
u("span", { className: "text-lg", children: [
                completedDownloads,
                "/",
                downloadQueue.length
              ] })
            ] })
          ] }),
          bulkDownloadCompleted && u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-start justify-between gap-4", children: [
u("div", { className: "flex-1", children: [
u("h3", { className: "text-lg font-semibold mb-3", children: "Download Summary" }),
u("div", { className: "space-y-2", children: [
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "size-5 text-success" }),
u("span", { className: "text-lg", children: [
                    "Success: ",
                    successfulDownloads,
                    " video",
                    successfulDownloads !== 1 ? "s" : ""
                  ] })
                ] }),
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "size-5 text-error" }),
u("span", { className: "text-lg", children: [
                    "Failed: ",
                    failedDownloads.size,
                    " video",
                    failedDownloads.size !== 1 ? "s" : ""
                  ] })
                ] })
              ] })
            ] }),
u("div", { className: "flex flex-col gap-2", children: [
u("div", { className: "flex gap-2 justify-end", children: [
u(
                  "div",
                  {
                    className: "tooltip tooltip-left",
                    "data-tip": showFailedVideos ? "Hide Failed" : "Show Failed",
                    children: u(
                      "button",
                      {
                        className: "btn btn-square btn-neutral",
                        onClick: () => setShowFailedVideos(!showFailedVideos),
                        children: u(IconEye, { className: "size-[1.8em]" })
                      }
                    )
                  }
                ),
u(
                  "div",
                  {
                    className: "tooltip tooltip-left",
                    "data-tip": "Clear Summary",
                    children: u(
                      "button",
                      {
                        className: "btn btn-square btn-error",
                        onClick: clearFailedDownloads,
                        children: u(IconCircleX, { className: "size-[1.8em]" })
                      }
                    )
                  }
                )
              ] }),
              failedDownloads.size > 0 && u(
                "button",
                {
                  className: "btn btn-primary",
                  onClick: retryFailedDownloads,
                  children: [
u(IconRefresh, { className: "size-[1.8em]" }),
u("span", { children: "Retry Failed" })
                  ]
                }
              )
            ] })
          ] }) })
        ] }),
        loadingPlaylist && playlistVideos.length === 0 && u("div", { className: "text-center py-8", children: [
u("span", { className: "loading loading-spinner loading-lg" }),
u("p", { className: "text-xl opacity-60 mt-4", children: "Loading playlist..." })
        ] }),
        playlistVideos.length > 0 && u(preact.Fragment, { children: [
u("div", { className: "space-y-3", children: currentVideos2.map((video) => {
            let bgClass = "bg-base-200";
            if (failedDownloads.has(video.videoId)) {
              bgClass = "bg-error/10";
            } else if (successfulVideoIds.has(video.videoId)) {
              bgClass = "bg-success/10";
            }
            return u(
              "div",
              {
                className: `${bgClass} rounded-lg p-4`,
                children: u(
                  "div",
                  {
                    className: "flex items-start gap-3 relative",
                    style: { minHeight: "68px" },
                    children: [
u("div", { className: "shrink-0", style: { width: "120px" }, children: [
u(
                          "a",
                          {
                            href: `https://www.youtube.com/watch?v=${video.videoId}`,
                            className: "block aspect-video rounded overflow-hidden mb-1 relative hover:opacity-80 transition-opacity",
                            children: [
u(
                                "img",
                                {
                                  src: video.thumbnail,
                                  alt: video.title,
                                  className: "w-full h-full object-cover"
                                }
                              ),
u("div", { className: "absolute top-1 left-1", children: u(
                                "input",
                                {
                                  type: "checkbox",
                                  className: "checkbox checkbox-primary checkbox-lg",
                                  checked: selectedVideoIds.has(video.videoId),
                                  onChange: () => toggleVideoSelection(video.videoId),
                                  onClick: (e) => e.stopPropagation()
                                }
                              ) }),
                              video.duration && u("div", { className: "absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-sm font-semibold", children: video.duration })
                            ]
                          }
                        ),
                        downloadingIds.has(video.videoId) && u("div", { children: [
u("progress", { className: "progress progress-primary w-full h-1" }),
                          downloadProgress[video.videoId] && u("p", { className: "text-lg opacity-60 mt-1", children: formatBytes(
                            downloadProgress[video.videoId].loaded
                          ) })
                        ] }),
                        failedDownloads.has(video.videoId) && u("span", { className: "badge badge-error text-sm", children: "Failed" }),
                        successfulVideoIds.has(video.videoId) && u("span", { className: "badge badge-success text-sm", children: "Success" })
                      ] }),
u("div", { className: "flex-1 min-w-0 pr-24", children: u("h3", { className: "text-lg font-medium line-clamp-2", children: video.title }) }),
u("div", { className: "absolute bottom-0 right-0 flex gap-2", children: [
u(
                          "button",
                          {
                            className: "btn btn-square btn-secondary",
                            onClick: () => fetchSubtitles(video.videoId),
                            disabled: loadingSubtitles && subtitleVideoId === video.videoId,
                            children: loadingSubtitles && subtitleVideoId === video.videoId ? u("span", { className: "loading loading-spinner loading-sm" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
                          }
                        ),
u(
                          "button",
                          {
                            className: "btn btn-square btn-primary",
                            onClick: () => downloadVideo(video.videoId, video.title),
                            disabled: downloadingIds.has(video.videoId),
                            children: downloadingIds.has(video.videoId) ? u("span", { className: "loading loading-spinner loading-sm" }) : failedDownloads.has(video.videoId) ? u(IconRefresh, { className: "size-[1.8em]" }) : u(IconDownload, { className: "size-[1.8em]" })
                          }
                        )
                      ] })
                    ]
                  }
                )
              },
              video.videoId
            );
          }) }),
          totalPages2 > 1 && u("div", { className: "flex justify-center", children: u("div", { className: "join", children: [
u(
              "button",
              {
                className: "join-item btn btn-lg",
                disabled: currentPage === 1,
                onClick: () => setCurrentPageCache((prev) => ({ ...prev, videos: currentPage - 1 })),
                children: "«"
              }
            ),
u("button", { className: "join-item btn btn-lg", children: [
              currentPage,
              "/",
              totalPages2
            ] }),
u(
              "button",
              {
                className: "join-item btn btn-lg",
                disabled: currentPage === totalPages2,
                onClick: () => setCurrentPageCache((prev) => ({ ...prev, videos: currentPage + 1 })),
                children: "»"
              }
            )
          ] }) })
        ] }),
        !loadingPlaylist && playlistVideos.length === 0 && u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: "No videos found in playlist" }) })
      ] });
    }
    if (!isChannelPage()) {
      return u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: "Navigate to a YouTube channel, playlist, or video to download" }) });
    }
    if (!channelId) {
      return u("div", { className: "text-center py-8", children: u("span", { className: "loading loading-spinner loading-lg" }) });
    }
    const filteredVideos = showFailedVideos ? videos.filter((v) => failedDownloads.has(v.videoId)) : videos;
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const currentVideos = filteredVideos.slice(startIndex, endIndex);
    return u("div", { className: "space-y-4", children: [
      errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
      ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "flex gap-2", children: [
u(
            "button",
            {
              className: `btn btn-lg flex-1 ${format === "video" ? "btn-secondary" : "btn-ghost"}`,
              onClick: () => {
                setFormat("video");
                storage.set("ddl-format-channel", "video");
              },
              children: [
u(IconFileMp4, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Video" })
              ]
            }
          ),
u(
            "button",
            {
              className: `btn btn-lg flex-1 ${format === "audio" ? "btn-accent" : "btn-ghost"}`,
              onClick: () => {
                setFormat("audio");
                storage.set("ddl-format-channel", "audio");
              },
              children: [
u(IconFileMp3, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Audio" })
              ]
            }
          )
        ] }),
        format === "video" ? u(
          "select",
          {
            className: "select select-bordered select-lg w-full text-xl",
            value: quality,
            onChange: (e) => {
              const value = e.target.value;
              setQuality(value);
              storage.set("ddl-videoQuality-channel", value);
            },
            children: videoQualities.map((q) => u("option", { value: q, children: [
              q,
              "p"
            ] }, q))
          }
        ) : u(preact.Fragment, { children: [
u("label", { className: "flex items-center gap-3 cursor-pointer", children: [
u(
              "input",
              {
                type: "checkbox",
                className: "checkbox checkbox-primary checkbox-lg",
                checked: embedThumbnail,
                onChange: (e) => {
                  const checked = e.target.checked;
                  setEmbedThumbnail(checked);
                  storage.set("ddl-embedThumbnail", checked.toString());
                }
              }
            ),
u("span", { className: "text-xl", children: "Embed Thumbnail" })
          ] }),
u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: audioBitrate,
              onChange: (e) => {
                const value = e.target.value;
                setAudioBitrate(value);
                storage.set("ddl-audioBitrate-channel", value);
              },
              children: audioQualities.map((q) => u("option", { value: q, children: [
                q,
                " kbps"
              ] }, q))
            }
          )
        ] })
      ] }),
u("div", { role: "tablist", className: "tabs tabs-border bg-base-200 text-xl h-14", children: [
u(
          "button",
          {
            role: "tab",
            className: `tab text-xl h-14 ${activeContentTab === "videos" ? "tab-active" : ""}`,
            onClick: () => {
              setActiveContentTab("videos");
              storage.set("ddl-contentTab", "videos");
            },
            children: [
              "Videos",
              " ",
              videosCache.videos.length > 0 && `(${videosCache.videos.length.toLocaleString()})`
            ]
          }
        ),
u(
          "button",
          {
            role: "tab",
            className: `tab text-xl h-14 ${activeContentTab === "shorts" ? "tab-active" : ""}`,
            onClick: () => {
              setActiveContentTab("shorts");
              storage.set("ddl-contentTab", "shorts");
            },
            children: [
              "Shorts",
              " ",
              videosCache.shorts.length > 0 && `(${videosCache.shorts.length.toLocaleString()})`
            ]
          }
        ),
u(
          "button",
          {
            role: "tab",
            className: `tab text-xl h-14 ${activeContentTab === "live" ? "tab-active" : ""}`,
            onClick: () => {
              setActiveContentTab("live");
              storage.set("ddl-contentTab", "live");
            },
            children: [
              "Live",
              " ",
              videosCache.live.length > 0 && `(${videosCache.live.length.toLocaleString()})`
            ]
          }
        )
      ] }),
      videos.length > 0 && u("div", { className: "space-y-3", children: [
u("div", { className: "flex items-center justify-between gap-3", children: [
u("label", { className: "flex items-center gap-2 cursor-pointer", children: [
u(
              "input",
              {
                type: "checkbox",
                className: "checkbox checkbox-primary checkbox-lg",
                checked: videos.length > 0 && videos.every((v) => selectedVideoIds.has(v.videoId)),
                onChange: () => toggleSelectAll(videos)
              }
            ),
u("span", { className: "text-xl", children: [
              "Select All (",
              videos.length.toLocaleString(),
              ")"
            ] })
          ] }),
          selectedVideoIds.size > 0 && u(
            "button",
            {
              className: "btn btn-primary",
              onClick: startBulkDownload,
              disabled: isProcessingQueue,
              children: isProcessingQueue ? u(preact.Fragment, { children: [
u("span", { className: "loading loading-spinner loading-md" }),
u("span", { children: "Downloading..." })
              ] }) : u("span", { children: [
                "Download (",
                selectedVideoIds.size.toLocaleString(),
                ")"
              ] })
            }
          )
        ] }),
        isProcessingQueue && u("div", { className: "space-y-2", children: [
u(
            "progress",
            {
              className: "progress progress-primary w-full",
              value: completedDownloads,
              max: downloadQueue.length
            }
          ),
u("div", { className: "flex items-center justify-between", children: [
u("span", { className: "text-lg", children: formatBytes(totalDownloadedSize) }),
u("span", { className: "text-lg", children: [
              completedDownloads,
              "/",
              downloadQueue.length
            ] })
          ] })
        ] }),
        bulkDownloadCompleted && u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-start justify-between gap-4", children: [
u("div", { className: "flex-1", children: [
u("h3", { className: "text-lg font-semibold mb-3", children: "Download Summary" }),
u("div", { className: "space-y-2", children: [
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "size-5 text-success" }),
u("span", { className: "text-lg", children: [
                  "Success: ",
                  successfulDownloads,
                  " video",
                  successfulDownloads !== 1 ? "s" : ""
                ] })
              ] }),
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "size-5 text-error" }),
u("span", { className: "text-lg", children: [
                  "Failed: ",
                  failedDownloads.size,
                  " video",
                  failedDownloads.size !== 1 ? "s" : ""
                ] })
              ] })
            ] })
          ] }),
u("div", { className: "flex flex-col gap-2", children: [
u("div", { className: "flex gap-2 justify-end", children: [
u(
                "div",
                {
                  className: "tooltip tooltip-left",
                  "data-tip": showFailedVideos ? "Hide Failed" : "Show Failed",
                  children: u(
                    "button",
                    {
                      className: "btn btn-square btn-neutral",
                      onClick: () => setShowFailedVideos(!showFailedVideos),
                      children: u(IconEye, { className: "size-[1.8em]" })
                    }
                  )
                }
              ),
u(
                "div",
                {
                  className: "tooltip tooltip-left",
                  "data-tip": "Clear Summary",
                  children: u(
                    "button",
                    {
                      className: "btn btn-square btn-error",
                      onClick: clearFailedDownloads,
                      children: u(IconCircleX, { className: "size-[1.8em]" })
                    }
                  )
                }
              )
            ] }),
            failedDownloads.size > 0 && u(
              "button",
              {
                className: "btn btn-primary",
                onClick: retryFailedDownloads,
                children: [
u(IconRefresh, { className: "size-[1.8em]" }),
u("span", { children: "Retry Failed" })
                ]
              }
            )
          ] })
        ] }) })
      ] }),
      loading && videos.length === 0 && u("div", { className: "text-center py-8", children: [
u("span", { className: "loading loading-spinner loading-lg" }),
u("p", { className: "text-xl opacity-60 mt-4", children: "Loading videos..." })
      ] }),
      videos.length > 0 && u(preact.Fragment, { children: [
u("div", { className: "space-y-3", children: currentVideos.map((video) => {
          let bgClass = "bg-base-200";
          if (failedDownloads.has(video.videoId)) {
            bgClass = "bg-error/10";
          } else if (successfulVideoIds.has(video.videoId)) {
            bgClass = "bg-success/10";
          }
          return u(
            "div",
            {
              className: `${bgClass} rounded-lg p-4`,
              children: u(
                "div",
                {
                  className: "flex items-start gap-3 relative",
                  style: { minHeight: "68px" },
                  children: [
u("div", { className: "shrink-0", style: { width: "120px" }, children: [
u(
                        "a",
                        {
                          href: `https://www.youtube.com/watch?v=${video.videoId}`,
                          className: "block aspect-video rounded overflow-hidden mb-1 relative hover:opacity-80 transition-opacity",
                          children: [
u(
                              "img",
                              {
                                src: video.thumbnail,
                                alt: video.title,
                                className: "w-full h-full object-cover"
                              }
                            ),
u("div", { className: "absolute top-1 left-1", children: u(
                              "input",
                              {
                                type: "checkbox",
                                className: "checkbox checkbox-primary checkbox-lg",
                                checked: selectedVideoIds.has(video.videoId),
                                onChange: () => toggleVideoSelection(video.videoId),
                                onClick: (e) => e.stopPropagation()
                              }
                            ) }),
                            video.duration && u("div", { className: "absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-sm font-semibold", children: video.duration })
                          ]
                        }
                      ),
                      downloadingIds.has(video.videoId) && u("div", { children: [
u("progress", { className: "progress progress-primary w-full h-1" }),
                        downloadProgress[video.videoId] && u("p", { className: "text-lg opacity-60 mt-1", children: formatBytes(
                          downloadProgress[video.videoId].loaded
                        ) })
                      ] }),
                      failedDownloads.has(video.videoId) && u("span", { className: "badge badge-error text-sm", children: "Failed" }),
                      successfulVideoIds.has(video.videoId) && u("span", { className: "badge badge-success text-sm", children: "Success" })
                    ] }),
u("div", { className: "flex-1 min-w-0 pr-24", children: u("h3", { className: "text-lg font-medium line-clamp-2", children: video.title }) }),
u("div", { className: "absolute bottom-0 right-0 flex gap-2", children: [
u(
                        "button",
                        {
                          className: "btn btn-square btn-secondary",
                          onClick: () => fetchSubtitles(video.videoId),
                          disabled: loadingSubtitles && subtitleVideoId === video.videoId,
                          children: loadingSubtitles && subtitleVideoId === video.videoId ? u("span", { className: "loading loading-spinner loading-sm" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
                        }
                      ),
u(
                        "button",
                        {
                          className: "btn btn-square btn-primary",
                          onClick: () => downloadVideo(video.videoId, video.title),
                          disabled: downloadingIds.has(video.videoId),
                          children: downloadingIds.has(video.videoId) ? u("span", { className: "loading loading-spinner loading-sm" }) : failedDownloads.has(video.videoId) ? u(IconRefresh, { className: "size-[1.8em]" }) : u(IconDownload, { className: "size-[1.8em]" })
                        }
                      )
                    ] })
                  ]
                }
              )
            },
            video.videoId
          );
        }) }),
        totalPages > 1 && u("div", { className: "flex justify-center", children: u("div", { className: "join", children: [
u(
            "button",
            {
              className: "join-item btn btn-lg",
              disabled: currentPage === 1,
              onClick: () => setCurrentPageCache((prev) => ({
                ...prev,
                [activeContentTab]: currentPage - 1
              })),
              children: "«"
            }
          ),
u("button", { className: "join-item btn btn-lg", children: [
            currentPage,
            "/",
            totalPages
          ] }),
u(
            "button",
            {
              className: "join-item btn btn-lg",
              disabled: currentPage === totalPages,
              onClick: () => setCurrentPageCache((prev) => ({
                ...prev,
                [activeContentTab]: currentPage + 1
              })),
              children: "»"
            }
          )
        ] }) })
      ] }),
      !loading && videos.length === 0 && u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: [
        "No ",
        activeContentTab,
        " found"
      ] }) })
    ] });
  }
  class CobaltService {
    instanceUrl;
    constructor(instanceUrl = COBALT_DEFAULTS.INSTANCE_URL) {
      this.instanceUrl = instanceUrl.replace(/\/$/, "");
    }
    setInstanceUrl(url) {
      this.instanceUrl = url.replace(/\/$/, "");
    }
    async process(options2) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: `${this.instanceUrl}/`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          data: JSON.stringify(options2),
          onload: (response) => {
            if (response.status === 200) {
              try {
                const data = JSON.parse(response.responseText);
                resolve(data);
              } catch (error) {
                reject(new Error("Failed to parse response"));
              }
            } else {
              reject(
                new Error(
                  `Cobalt API error: ${response.status} ${response.statusText}`
                )
              );
            }
          },
          onerror: () => reject(new Error("Network error")),
          ontimeout: () => reject(new Error("Request timeout"))
        });
      });
    }
    async getInstanceInfo() {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: `${this.instanceUrl}/`,
          headers: {
            Accept: "application/json"
          },
          onload: (response) => {
            if (response.status === 200) {
              try {
                const data = JSON.parse(response.responseText);
                resolve(data);
              } catch (error) {
                reject(new Error("Failed to parse response"));
              }
            } else {
              reject(
                new Error(`Failed to get instance info: ${response.status}`)
              );
            }
          },
          onerror: () => reject(new Error("Network error")),
          ontimeout: () => reject(new Error("Request timeout"))
        });
      });
    }
    async downloadFile(url, filename, onProgress) {
      return new Promise((resolve, reject) => {
        const finalUrl = url;
        GM_xmlhttpRequest({
          method: "GET",
          url: finalUrl,
          responseType: "blob",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            Accept: "*/*"
          },
          onprogress: (progress) => {
            if (onProgress) {
              onProgress(
                progress.loaded || 0,
                progress.lengthComputable ? progress.total : 0
              );
            }
          },
          onload: (response) => {
            if (response.status === 200 && response.response) {
              const blob = response.response;
              if (blob.size === 0) {
                reject(new Error("Downloaded file is 0 bytes"));
                return;
              }
              const blobUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = blobUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(blobUrl);
              resolve();
            } else if (response.status === 204) {
              const a = document.createElement("a");
              a.href = finalUrl;
              a.download = filename;
              a.style.display = "none";
              a.target = "_self";
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                document.body.removeChild(a);
              }, 100);
              resolve();
            } else {
              reject(new Error(`Download failed: ${response.status}`));
            }
          },
          onerror: () => reject(new Error("Download failed")),
          ontimeout: () => reject(new Error("Download timeout"))
        });
      });
    }
  }
  function IconFileAudio({
    className,
    size = 24
  }) {
    return u(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 640 640",
        width: size,
        height: size,
        className,
        fill: "currentColor",
        children: u("path", { d: "M269.7 225.1C255.2 142.6 183.1 80 96.4 80L96.4 80L88.4 80C75.1 80 64.4 69.3 64.4 56C64.4 42.7 75.1 32 88.4 32L96.4 32L96.4 32C204.1 32 294 107.9 315.5 209.1L362.5 256.1C376.6 270.1 384.4 289.2 384.4 309.1C384.4 346.8 356.6 377.9 320.4 383.2L320.4 488C320.4 536.6 281 576 232.4 576L88.4 576C75.1 576 64.4 565.3 64.4 552C64.4 538.7 75.1 528 88.4 528L232.4 528C254.5 528 272.4 510.1 272.4 488L272.4 480L198 473.8C185.8 472.8 176.4 462.6 176.4 450.4C176.4 439.6 183.7 430.2 194.2 427.6L272.4 408.1L272.4 360.1C272.4 346.8 283.1 336.1 296.4 336.1L309.5 336.1C324.4 336.1 336.4 324 336.4 309.2C336.4 302.1 333.6 295.2 328.5 290.2L276.3 238C272.8 234.5 270.5 230.1 269.6 225.2zM160.4 240C160.4 222.3 174.7 208 192.4 208C210.1 208 224.4 222.3 224.4 240C224.4 257.7 210.1 272 192.4 272C174.7 272 160.4 257.7 160.4 240zM508.4 289C517.8 279.6 533 279.6 542.3 289C632.9 379.6 632.9 526.5 542.3 617.1C532.9 626.5 517.7 626.5 508.4 617.1C499.1 607.7 499 592.5 508.4 583.2C580.3 511.3 580.3 394.8 508.4 323C499 313.6 499 298.4 508.4 289.1zM440.5 356.9C449.9 347.5 465.1 347.5 474.4 356.9C527.5 410 527.5 496.1 474.4 549.2C465 558.6 449.8 558.6 440.5 549.2C431.2 539.8 431.1 524.6 440.5 515.3C474.9 480.9 474.9 425.2 440.5 390.8C431.1 381.4 431.1 366.2 440.5 356.9z" })
      }
    );
  }
  const DUB_LANGUAGE_OPTIONS = [
    { value: "", label: "Original Audio" },
    { value: "en", label: "English (en)" },
    { value: "es", label: "español (es)" },
    { value: "pt", label: "português (pt)" },
    { value: "fr", label: "français (fr)" },
    { value: "ru", label: "русский (ru)" },
    { value: "zh", label: "中文 (zh)" },
    { value: "vi", label: "Tiếng Việt (vi)" },
    { value: "hi", label: "हिन्दी (hi)" },
    { value: "bn", label: "বাংলা (bn)" },
    { value: "ja", label: "日本語 (ja)" },
    { value: "af", label: "Afrikaans (af)" },
    { value: "am", label: "አማርኛ (am)" },
    { value: "ar", label: "العربية (ar)" },
    { value: "as", label: "Assamese (as)" },
    { value: "az", label: "azərbaycan (az)" },
    { value: "be", label: "Belarusian (be)" },
    { value: "bg", label: "български (bg)" },
    { value: "bs", label: "bosanski (bs)" },
    { value: "ca", label: "català (ca)" },
    { value: "cs", label: "čeština (cs)" },
    { value: "da", label: "dansk (da)" },
    { value: "de", label: "Deutsch (de)" },
    { value: "el", label: "Ελληνικά (el)" },
    { value: "et", label: "eesti (et)" },
    { value: "eu", label: "Basque (eu)" },
    { value: "fa", label: "فارسی (fa)" },
    { value: "fi", label: "suomi (fi)" },
    { value: "fil", label: "Filipino (fil)" },
    { value: "gl", label: "Galician (gl)" },
    { value: "gu", label: "ગુજરાતી (gu)" },
    { value: "hr", label: "hrvatski (hr)" },
    { value: "hu", label: "magyar (hu)" },
    { value: "hy", label: "Armenian (hy)" },
    { value: "id", label: "Indonesia (id)" },
    { value: "is", label: "Icelandic (is)" },
    { value: "it", label: "italiano (it)" },
    { value: "iw", label: "עברית (iw)" },
    { value: "ka", label: "Georgian (ka)" },
    { value: "kk", label: "Kazakh (kk)" },
    { value: "km", label: "Khmer (km)" },
    { value: "kn", label: "ಕನ್ನಡ (kn)" },
    { value: "ko", label: "한국어 (ko)" },
    { value: "ky", label: "Kyrgyz (ky)" },
    { value: "lo", label: "Lao (lo)" },
    { value: "lt", label: "lietuvių (lt)" },
    { value: "lv", label: "latviešu (lv)" },
    { value: "mk", label: "Macedonian (mk)" },
    { value: "ml", label: "മലയാളം (ml)" },
    { value: "mn", label: "Mongolian (mn)" },
    { value: "mr", label: "मराठी (mr)" },
    { value: "ms", label: "Melayu (ms)" },
    { value: "my", label: "Burmese (my)" },
    { value: "ne", label: "Nepali (ne)" },
    { value: "nl", label: "Nederlands (nl)" },
    { value: "no", label: "norsk (no)" },
    { value: "or", label: "Odia (or)" },
    { value: "pa", label: "ਪੰਜਾਬੀ (pa)" },
    { value: "pl", label: "polski (pl)" },
    { value: "ro", label: "română (ro)" },
    { value: "si", label: "Sinhala (si)" },
    { value: "sk", label: "slovenčina (sk)" },
    { value: "sl", label: "slovenščina (sl)" },
    { value: "sq", label: "Albanian (sq)" },
    { value: "sr", label: "српски (sr)" },
    { value: "sv", label: "svenska (sv)" },
    { value: "sw", label: "Kiswahili (sw)" },
    { value: "ta", label: "தமிழ் (ta)" },
    { value: "te", label: "తెలుగు (te)" },
    { value: "th", label: "ไทย (th)" },
    { value: "tr", label: "Türkçe (tr)" },
    { value: "uk", label: "українська (uk)" },
    { value: "ur", label: "اردو (ur)" },
    { value: "uz", label: "o'zbek (uz)" },
    { value: "zh-Hans", label: "简体中文 (zh-Hans)" },
    { value: "zh-Hant", label: "繁體中文 (zh-Hant)" },
    { value: "zh-CN", label: "中文（中国） (zh-CN)" },
    { value: "zh-HK", label: "中文（香港） (zh-HK)" },
    { value: "zh-TW", label: "中文（台灣） (zh-TW)" },
    { value: "zu", label: "Zulu (zu)" }
  ];
  function CobaltTab() {
    const [youtubeService2] = hooks.useState(() => new YouTubeService());
    const [cobaltService] = hooks.useState(
      () => new CobaltService(cobaltSettings.value.instanceUrl)
    );
    hooks.useEffect(() => {
      cobaltService.setInstanceUrl(cobaltSettings.value.instanceUrl);
    }, [cobaltSettings.value.instanceUrl, cobaltService]);
    const [channelId, setChannelId] = hooks.useState(null);
    const [playlistId, setPlaylistId] = hooks.useState(null);
    const [playlistVideos, setPlaylistVideos] = hooks.useState([]);
    const [loadingPlaylist, setLoadingPlaylist] = hooks.useState(false);
    const [activeContentTab, setActiveContentTab] = hooks.useState("videos");
    const [format, setFormat] = hooks.useState("video");
    const [quality, setQuality] = hooks.useState("1080");
    const [audioBitrate, setAudioBitrate] = hooks.useState("128");
    const [embedThumbnail, setEmbedThumbnail] = hooks.useState(false);
    const [currentVideoId, setCurrentVideoId] = hooks.useState(null);
    const [currentVideoTitle, setCurrentVideoTitle] = hooks.useState("");
    const [currentVideoDuration, setCurrentVideoDuration] = hooks.useState("");
    const [currentVideoMaxQuality, setCurrentVideoMaxQuality] = hooks.useState("");
    const [loadingVideoInfo, setLoadingVideoInfo] = hooks.useState(false);
    const [recentlyWatchedVideos, setRecentlyWatchedVideos] = hooks.useState([]);
    const [loadingRecentVideos, setLoadingRecentVideos] = hooks.useState(true);
    const [previousVideoData, setPreviousVideoData] = hooks.useState(null);
    const [audioTracks, setAudioTracks] = hooks.useState([]);
    const [selectedDubLang, setSelectedDubLang] = hooks.useState("");
    const [loadingAudioTracks, setLoadingAudioTracks] = hooks.useState(false);
    const [loadingSubtitles, setLoadingSubtitles] = hooks.useState(false);
    const [subtitleVideoId, setSubtitleVideoId] = hooks.useState(null);
    const [errorMessage, setErrorMessage] = hooks.useState("");
    const [videosCache, setVideosCache] = hooks.useState({
      videos: [],
      shorts: [],
      live: []
    });
    const [loadingCache, setLoadingCache] = hooks.useState({
      videos: false,
      shorts: false,
      live: false
    });
    const [currentPageCache, setCurrentPageCache] = hooks.useState({
      videos: 1,
      shorts: 1,
      live: 1
    });
    const [downloadingIds, setDownloadingIds] = hooks.useState( new Set());
    const [downloadProgress, setDownloadProgress] = hooks.useState({});
    const [selectedVideoIds, setSelectedVideoIds] = hooks.useState(
new Set()
    );
    const [downloadQueue, setDownloadQueue] = hooks.useState([]);
    const [isProcessingQueue, setIsProcessingQueue] = hooks.useState(false);
    const [failedDownloads, setFailedDownloads] = hooks.useState(
new Set()
    );
    const [totalDownloadedSize, setTotalDownloadedSize] = hooks.useState(0);
    const [completedDownloads, setCompletedDownloads] = hooks.useState(0);
    const [showFailedVideos, setShowFailedVideos] = hooks.useState(false);
    const [bulkDownloadCompleted, setBulkDownloadCompleted] = hooks.useState(false);
    const [successfulDownloads, setSuccessfulDownloads] = hooks.useState(0);
    const [successfulVideoIds, setSuccessfulVideoIds] = hooks.useState(
new Set()
    );
    const [bulkDubLang, setBulkDubLang] = hooks.useState("");
    const [videosPerPage, setVideosPerPage] = hooks.useState(8);
    const [abortControllers, setAbortControllers] = hooks.useState({
      videos: null,
      shorts: null,
      live: null
    });
    hooks.useEffect(() => {
      const preferredLang = cobaltSettings.value.preferredDubLang;
      setBulkDubLang(preferredLang);
      if (preferredLang && audioTracks.length > 0) {
        const preferredTrack = audioTracks.find(
          (t) => t.languageCode === preferredLang
        );
        if (preferredTrack) {
          setSelectedDubLang(preferredLang);
        }
      } else if (!preferredLang) {
        setSelectedDubLang("");
      }
    }, [cobaltSettings.value.preferredDubLang, audioTracks]);
    const formatBytes = (bytes) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    const videos = videosCache[activeContentTab];
    const loading = loadingCache[activeContentTab];
    const currentPage = currentPageCache[activeContentTab];
    const getAvailableQualities = () => {
      return VIDEO_QUALITIES;
    };
    const audioQualities = AUDIO_BITRATES;
    const isChannelPage = () => {
      const path = window.location.pathname;
      return path.startsWith("/@") || path.startsWith("/channel/");
    };
    const isWatchPage = () => {
      const path = window.location.pathname;
      return path === "/watch" || path.startsWith("/shorts/");
    };
    const isPlaylistPage = () => {
      return youtubeService2.isPlaylistPage();
    };
    const getVideoIdFromUrl = () => {
      const path = window.location.pathname;
      if (path.startsWith("/shorts/")) {
        return path.split("/shorts/")[1]?.split("?")[0] || null;
      }
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("v");
    };
    const getVideoTitle2 = () => {
      let titleElement = document.querySelector(
        "h1.ytd-watch-metadata yt-formatted-string"
      );
      if (!titleElement) {
        titleElement = document.querySelector("h2.reel-video-in-sequence-title");
      }
      if (!titleElement) {
        titleElement = document.querySelector("#shorts-player h2");
      }
      return titleElement?.textContent?.trim() || "video";
    };
    const fetchVideoInfo = async (videoId) => {
      setLoadingVideoInfo(true);
      try {
        const response = await innerTubeRequest("/youtubei/v1/player", {
          videoId
        });
        const title = response.videoDetails?.title;
        if (title) {
          setCurrentVideoTitle(title);
        }
        const lengthSeconds = response.videoDetails?.lengthSeconds;
        if (lengthSeconds) {
          const duration = formatDuration(parseInt(lengthSeconds));
          setCurrentVideoDuration(duration);
        }
        const adaptiveFormats = response.streamingData?.adaptiveFormats || [];
        const videoFormats = adaptiveFormats.filter(
          (f2) => f2.qualityLabel && f2.mimeType?.includes("video")
        );
        const audioFormats = adaptiveFormats.filter(
          (f2) => f2.mimeType?.includes("audio")
        );
        let qualityInfo = "";
        if (videoFormats.length > 0) {
          const sortedFormats = videoFormats.sort((a, b) => {
            const qualityA = parseInt(a.qualityLabel) || 0;
            const qualityB = parseInt(b.qualityLabel) || 0;
            return qualityB - qualityA;
          });
          const highestQuality = sortedFormats[0].qualityLabel;
          qualityInfo = `Max Quality: ${highestQuality}`;
        }
        if (audioFormats.length > 0) {
          const sortedAudio = audioFormats.sort((a, b) => {
            const bitrateA = a.bitrate || 0;
            const bitrateB = b.bitrate || 0;
            return bitrateB - bitrateA;
          });
          const highestAudioBitrate = Math.round(sortedAudio[0].bitrate / 1e3);
          const audioInfo = `Audio: ${highestAudioBitrate}kbps`;
          if (qualityInfo) {
            qualityInfo += ` / ${audioInfo}`;
          } else {
            qualityInfo = audioInfo;
          }
        }
        setCurrentVideoMaxQuality(qualityInfo || "Quality info unavailable");
      } catch (error) {
        console.error("[Cobalt] Error fetching video info:", error);
      } finally {
        setLoadingVideoInfo(false);
      }
    };
    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const secs = seconds % 60;
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };
    const fetchAudioTracks = async (videoId) => {
      setLoadingAudioTracks(true);
      try {
        const result = await youtubeService2.getAudioTracks(videoId);
        if (result && result.audioTracks.length > 0) {
          const filteredTracks = result.audioTracks.filter(
            (track) => !track.languageCode.startsWith("track-")
          );
          if (filteredTracks.length > 0) {
            setAudioTracks(filteredTracks);
            const preferredLang = cobaltSettings.value.preferredDubLang;
            if (preferredLang) {
              const preferredTrack = filteredTracks.find(
                (t) => t.languageCode === preferredLang
              );
              if (preferredTrack) {
                setSelectedDubLang(preferredLang);
              } else {
                setSelectedDubLang("");
              }
            } else {
              setSelectedDubLang("");
            }
          } else {
            setAudioTracks([]);
            setSelectedDubLang("");
          }
        } else {
          setAudioTracks([]);
          setSelectedDubLang("");
        }
      } catch (error) {
        console.error("[Cobalt] Error fetching audio tracks:", error);
        setAudioTracks([]);
        setSelectedDubLang("");
      } finally {
        setLoadingAudioTracks(false);
      }
    };
    const fetchSubtitlesForDialog = async (videoId) => {
      setLoadingSubtitles(true);
      setSubtitleVideoId(videoId);
      try {
        const result = await youtubeService2.getSubtitles(videoId);
        if (!result) {
          throw new Error("Failed to fetch subtitles from YouTube");
        }
        let videoTitle = result.videoTitle || currentVideoTitle || "video";
        if (videoTitle === "video" || videoTitle === "Loading...") {
          for (const type of ["videos", "shorts", "live"]) {
            const video = videosCache[type].find(
              (v) => v.videoId === videoId
            );
            if (video) {
              videoTitle = video.title;
              break;
            }
          }
        }
        if (result.subtitles.length === 0 && result.autoTransSubtitles.length === 0) {
          throw new Error("No subtitles available for this video");
        }
        const processedSubtitles = result.subtitles.map((sub) => {
          let downloadUrl = sub.url;
          if (!downloadUrl.includes("fmt=")) {
            downloadUrl += "&fmt=srv1";
          }
          return {
            name: sub.name,
            code: sub.languageCode,
            url: downloadUrl,
            isAutoGenerated: sub.isAutoGenerated,
            download: {
              srt: downloadUrl,
              txt: downloadUrl,
              raw: downloadUrl
            }
          };
        });
        const baseTrack = result.subtitles[0];
        const processedAutoTrans = result.autoTransSubtitles.map((sub) => {
          const translatedUrl = baseTrack ? `${baseTrack.url}&tlang=${sub.languageCode}&fmt=srv1` : "";
          return {
            name: sub.name,
            code: sub.languageCode,
            url: translatedUrl,
            isAutoGenerated: true,
            download: {
              srt: translatedUrl,
              txt: translatedUrl,
              raw: translatedUrl
            }
          };
        });
        openSubtitleDialog({
          videoId,
          videoTitle,
          subtitles: processedSubtitles,
          autoTransSubtitles: processedAutoTrans
        });
      } catch (error) {
        console.error("[Cobalt] Error fetching subtitles:", error);
        playErrorSound();
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to fetch subtitles"
        );
        setTimeout(() => setErrorMessage(""), 3e3);
      } finally {
        setLoadingSubtitles(false);
        setSubtitleVideoId(null);
      }
    };
    const loadChannelInfo = async () => {
      if (activeTab.value !== "ddl") {
        return;
      }
      if (!isChannelPage() && !isWatchPage() && !isPlaylistPage()) {
        setChannelId(null);
        setPlaylistId(null);
        setPlaylistVideos([]);
        setCurrentVideoId(null);
        setCurrentVideoTitle("");
        setCurrentVideoDuration("");
        setCurrentVideoMaxQuality("");
        setAudioTracks([]);
        setSelectedDubLang("");
        setVideosCache({ videos: [], shorts: [], live: [] });
        setLoadingCache({ videos: false, shorts: false, live: false });
        setCurrentPageCache({ videos: 1, shorts: 1, live: 1 });
        return;
      }
      if (isPlaylistPage()) {
        const id = youtubeService2.getPlaylistIdFromURL();
        if (id !== playlistId) {
          setPlaylistId(id);
          setChannelId(null);
          setCurrentVideoId(null);
          setPlaylistVideos([]);
          setSelectedVideoIds( new Set());
          setDownloadQueue([]);
          setIsProcessingQueue(false);
          setFailedDownloads( new Set());
          setTotalDownloadedSize(0);
          setCompletedDownloads(0);
          setSuccessfulDownloads(0);
          setSuccessfulVideoIds( new Set());
          setBulkDownloadCompleted(false);
          setShowFailedVideos(false);
          const savedFormat = await storage.get("cobalt-format-playlist");
          const savedQuality = await storage.get("cobalt-videoQuality-playlist");
          const savedBitrate = await storage.get("cobalt-audioBitrate-playlist");
          if (savedFormat) setFormat(savedFormat);
          if (savedQuality) setQuality(savedQuality);
          if (savedBitrate) setAudioBitrate(savedBitrate);
          if (id && isPanelVisible.value) {
            fetchPlaylistVideos(id);
          }
        }
        return;
      }
      if (isWatchPage()) {
        const videoId = getVideoIdFromUrl();
        if (videoId !== currentVideoId) {
          setCurrentVideoId(videoId);
          const title = getVideoTitle2();
          if (title && title !== "video") {
            setCurrentVideoTitle(title);
          } else {
            setCurrentVideoTitle("Loading...");
          }
          setCurrentVideoDuration("");
          setCurrentVideoMaxQuality("");
          const savedFormat = await storage.get("cobalt-format-watch");
          const savedQuality = await storage.get("cobalt-videoQuality-watch");
          const savedBitrate = await storage.get("cobalt-audioBitrate-watch");
          if (savedFormat) setFormat(savedFormat);
          if (savedQuality) setQuality(savedQuality);
          if (savedBitrate) setAudioBitrate(savedBitrate);
          if (videoId && isPanelVisible.value) {
            fetchVideoInfo(videoId);
            fetchAudioTracks(videoId);
          }
        } else if (videoId && !currentVideoTitle) {
          const title = getVideoTitle2();
          if (title && title !== "video") {
            setCurrentVideoTitle(title);
          }
        }
        setChannelId(null);
        setPlaylistId(null);
        return;
      }
      if (isChannelPage()) {
        const id = await youtubeService2.getChannelId();
        if (id !== channelId) {
          setChannelId(id);
          setPlaylistId(null);
          setCurrentVideoId(null);
          setVideosCache({ videos: [], shorts: [], live: [] });
          setLoadingCache({ videos: false, shorts: false, live: false });
          setCurrentPageCache({ videos: 1, shorts: 1, live: 1 });
          setSelectedVideoIds( new Set());
          setDownloadQueue([]);
          setIsProcessingQueue(false);
          setFailedDownloads( new Set());
          setTotalDownloadedSize(0);
          setCompletedDownloads(0);
          setSuccessfulDownloads(0);
          setSuccessfulVideoIds( new Set());
          setBulkDownloadCompleted(false);
          setShowFailedVideos(false);
          const savedFormat = await storage.get("cobalt-format-channel");
          const savedQuality = await storage.get("cobalt-videoQuality-channel");
          const savedBitrate = await storage.get("cobalt-audioBitrate-channel");
          if (savedFormat) setFormat(savedFormat);
          if (savedQuality) setQuality(savedQuality);
          if (savedBitrate) setAudioBitrate(savedBitrate);
          if (isPanelVisible.value && isChannelPage() && id) {
            setTimeout(() => {
              fetchVideos("videos", id);
              fetchVideos("shorts", id);
              fetchVideos("live", id);
            }, 100);
          }
        }
      }
    };
    const fetchPlaylistVideos = async (id) => {
      setLoadingPlaylist(true);
      try {
        const videos2 = await youtubeService2.fetchPlaylistVideos(id);
        const parsedVideos = videos2.map((item) => ({
          videoId: item.videoId,
          title: item.title?.runs?.[0]?.text || item.title?.simpleText || "Untitled",
          thumbnail: item.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
          duration: item.lengthText?.simpleText || "",
          publishedTime: item.publishedTimeText?.simpleText || ""
        }));
        setPlaylistVideos(parsedVideos);
      } catch (error) {
        console.error("[Cobalt] Error fetching playlist:", error);
        playErrorSound();
        setErrorMessage("Failed to fetch playlist videos");
        setTimeout(() => setErrorMessage(""), 3e3);
      } finally {
        setLoadingPlaylist(false);
      }
    };
    const fetchVideos = async (tabType, forceChannelId) => {
      const targetChannelId = forceChannelId || channelId;
      if (!targetChannelId) return;
      if (abortControllers[tabType]) {
        abortControllers[tabType].abort();
      }
      const controller = new AbortController();
      setAbortControllers((prev) => ({ ...prev, [tabType]: controller }));
      setLoadingCache((prev) => ({ ...prev, [tabType]: true }));
      try {
        const allVideos = [];
        let continuation = void 0;
        let pageCount = 0;
        const maxPages = 100;
        const TAB_TYPE_PARAMS2 = {
          videos: "EgZ2aWRlb3PyBgQKAjoA",
          shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
          live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D"
        };
        do {
          if (controller.signal.aborted) {
            break;
          }
          if (activeTab.value !== "ddl" || !isPanelVisible.value) {
            break;
          }
          const params = TAB_TYPE_PARAMS2[tabType];
          const response = await innerTubeRequest(
            "/youtubei/v1/browse",
            {
              browseId: targetChannelId,
              params,
              continuation
            },
            controller.signal
          );
          const items = parseTabData(tabType, response);
          const parsedVideos = parseVideos(items, tabType);
          allVideos.push(...parsedVideos);
          const filteredVideos2 = tabType === "live" ? allVideos.filter((v) => v.duration && v.duration !== "0:00") : allVideos;
          setVideosCache((prev) => ({ ...prev, [tabType]: filteredVideos2 }));
          continuation = getContinuation(response, tabType);
          pageCount++;
          if (!continuation || pageCount >= maxPages) break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        } while (continuation);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("[Cobalt] Error fetching videos:", error);
        }
      } finally {
        setLoadingCache((prev) => ({ ...prev, [tabType]: false }));
        setAbortControllers((prev) => ({ ...prev, [tabType]: null }));
      }
    };
    const innerTubeRequest = async (endpoint, data, signal2) => {
      const url = `${API_CONFIG.BASE_URL}${endpoint}?key=${API_CONFIG.INNERTUBE_API_KEY}&prettyPrint=false`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": API_CONFIG.INNERTUBE_CLIENT_VERSION
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: API_CONFIG.INNERTUBE_CLIENT_NAME,
              clientVersion: API_CONFIG.INNERTUBE_CLIENT_VERSION,
              hl: "en",
              gl: "US"
            }
          },
          ...data
        }),
        signal: signal2
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    };
    const getContinuation = (data, tabType) => {
      const TAB_TYPE_PARAMS2 = {
        videos: "EgZ2aWRlb3PyBgQKAjoA",
        shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
        live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D"
      };
      if (tabType === "shorts") {
        const tab2 = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
          (t) => t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS2[tabType]
        );
        const contents = tab2?.tabRenderer?.content?.richGridRenderer?.contents || [];
        const continuationItem = contents.find(
          (c) => c.continuationItemRenderer
        );
        if (continuationItem) {
          return continuationItem.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        }
        const continuationItems = data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
        const contItem = continuationItems.find(
          (c) => c.continuationItemRenderer
        );
        if (contItem) {
          return contItem.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
        }
        return void 0;
      }
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
        (t) => t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS2[tabType]
      );
      const items = tab?.tabRenderer?.content?.richGridRenderer?.contents || data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
      const continuation = items[items.length - 1];
      const renderer = continuation?.continuationItemRenderer;
      if (!renderer) return void 0;
      return renderer?.continuationEndpoint?.continuationCommand?.token;
    };
    const parseTabData = (tabType, data) => {
      const TAB_TYPE_PARAMS2 = {
        videos: "EgZ2aWRlb3PyBgQKAjoA",
        shorts: "EgZzaG9ydHPyBgUKA5oBAA%3D%3D",
        live: "EgdzdHJlYW1z8gYECgJ6AA%3D%3D"
      };
      const tab = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(
        (t) => t.tabRenderer?.endpoint?.browseEndpoint?.params === TAB_TYPE_PARAMS2[tabType]
      );
      if (tabType === "shorts" && tab?.tabRenderer?.content?.richGridRenderer) {
        const contents = tab.tabRenderer.content.richGridRenderer.contents || [];
        return contents.map((c) => c.richItemRenderer?.content || c).filter((c) => c.shortsLockupViewModel || c.reelItemRenderer);
      }
      if (tabType === "shorts" && (data.onResponseReceivedActions || data.onResponseReceivedEndpoints)) {
        const continuationItems = data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems || data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems || [];
        return continuationItems.map((c) => c.richItemRenderer?.content || c).filter((c) => c.shortsLockupViewModel || c.reelItemRenderer);
      }
      if (tab?.tabRenderer?.content?.richGridRenderer?.contents) {
        const contents = tab.tabRenderer.content.richGridRenderer.contents;
        return contents.map((c) => c.richItemRenderer?.content || c);
      }
      if (data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems) {
        const items = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
        return items.map((c) => c.richItemRenderer?.content || c);
      }
      if (data.onResponseReceivedEndpoints?.[0]?.appendContinuationItemsAction?.continuationItems) {
        const items = data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems;
        return items;
      }
      return [];
    };
    const parseVideos = (items, tabType) => {
      if (tabType === "shorts") {
        return items.filter((item) => item.shortsLockupViewModel || item.reelItemRenderer).map((item) => {
          const lockup = item.shortsLockupViewModel;
          if (lockup) {
            const videoId = lockup.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
            const title = lockup.overlayMetadata?.primaryText?.content || "Untitled";
            return {
              videoId,
              title,
              thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
            };
          }
          const renderer = item.reelItemRenderer;
          return {
            videoId: renderer.videoId,
            title: renderer.headline?.simpleText || "Untitled",
            thumbnail: `https://i.ytimg.com/vi/${renderer.videoId}/mqdefault.jpg`
          };
        }).filter((v) => v.videoId);
      }
      return items.filter((item) => item.videoRenderer).map((item) => {
        const renderer = item.videoRenderer;
        return {
          videoId: renderer.videoId,
          title: renderer.title?.runs?.[0]?.text || renderer.title?.simpleText || "Untitled",
          thumbnail: renderer.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${renderer.videoId}/mqdefault.jpg`,
          duration: renderer.lengthText?.simpleText || "",
          publishedTime: renderer.publishedTimeText?.simpleText || ""
        };
      }).filter((v) => v.videoId);
    };
    const downloadVideo = async (videoId, title, dubLang) => {
      setDownloadingIds((prev) => new Set(prev).add(videoId));
      try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const options2 = {
          url: videoUrl
        };
        const langToUse = dubLang !== void 0 ? dubLang : selectedDubLang;
        if (cobaltSettings.value.debug) {
          console.log(
            "[Cobalt Debug] Dub Lang - dubLang:",
            dubLang,
            "selectedDubLang:",
            selectedDubLang,
            "langToUse:",
            langToUse
          );
        }
        if (format === "video" && langToUse && langToUse !== "") {
          options2.youtubeDubLang = langToUse;
        }
        if (format === "video") {
          options2.videoQuality = String(quality);
        } else {
          options2.downloadMode = "audio";
          options2.audioFormat = "mp3";
          if (audioBitrate !== "128") {
            options2.audioBitrate = String(audioBitrate);
          }
        }
        options2.filenameStyle = cobaltSettings.value.filenameStyle;
        if (cobaltSettings.value.debug) {
          console.log("[Cobalt Debug] Request options:", options2);
        }
        const response = await cobaltService.process(options2);
        if (cobaltSettings.value.debug) {
          console.log("[Cobalt Debug] API Response:", response);
        }
        if (response.status === "error") {
          console.error("[Cobalt] Error details:", response.error);
          throw new Error(
            `${response.error.code}${response.error.context ? ` - ${JSON.stringify(response.error.context)}` : ""}`
          );
        }
        if (response.status === "tunnel" || response.status === "redirect") {
          const finalUrl = response.url;
          await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: "GET",
              url: finalUrl,
              responseType: "blob",
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                Referer: "https://www.youtube.com/",
                Accept: "*/*"
              },
              onprogress: (progress) => {
                setDownloadProgress((prev) => ({
                  ...prev,
                  [videoId]: {
                    loaded: progress.loaded || 0,
                    total: progress.lengthComputable ? progress.total : 0
                  }
                }));
              },
              onload: async (downloadResponse) => {
                if (downloadResponse.status === 204) {
                  resolve();
                  return;
                }
                if (downloadResponse.status === 200 && downloadResponse.response) {
                  let blob = downloadResponse.response;
                  if (blob.size === 0) {
                    reject(new Error("Downloaded file is 0 bytes"));
                    return;
                  }
                  if (format === "audio") {
                    try {
                      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
                      const albumArt = await createSquareAlbumArt(thumbnailUrl);
                      blob = await embedAlbumArtToMP3(blob, albumArt, {
                        title
                      });
                    } catch (error) {
                      console.error(
                        "[Cobalt] Failed to embed album art:",
                        error
                      );
                    }
                  }
                  const blobUrl = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = blobUrl;
                  a.download = sanitizeFilename(response.filename);
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(blobUrl);
                  setFailedDownloads((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(videoId);
                    return newSet;
                  });
                  setTotalDownloadedSize((prev) => prev + blob.size);
                  setCompletedDownloads((prev) => prev + 1);
                  setSuccessfulDownloads((prev) => prev + 1);
                  setSuccessfulVideoIds((prev) => new Set(prev).add(videoId));
                  resolve();
                } else {
                  reject(
                    new Error(`Blob download failed: ${downloadResponse.status}`)
                  );
                }
              },
              onerror: () => reject(new Error("Blob download failed")),
              ontimeout: () => reject(new Error("Blob download timeout"))
            });
          });
        }
      } catch (error) {
        console.error("[Cobalt] Download error:", error);
        playErrorSound();
        setErrorMessage(`Failed to download: ${error}`);
        setTimeout(() => setErrorMessage(""), 1e3);
        setFailedDownloads((prev) => new Set(prev).add(videoId));
      } finally {
        setDownloadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        setDownloadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[videoId];
          return newProgress;
        });
      }
    };
    const processDownloadQueue = async () => {
      if (isProcessingQueue || downloadQueue.length === 0) return;
      setIsProcessingQueue(true);
      for (const videoId of downloadQueue) {
        let video;
        if (playlistVideos.length > 0) {
          video = playlistVideos.find((v) => v.videoId === videoId);
        }
        if (!video) {
          for (const type of ["videos", "shorts", "live"]) {
            video = videosCache[type].find((v) => v.videoId === videoId);
            if (video) break;
          }
        }
        if (video) {
          await downloadVideo(videoId, video.title, bulkDubLang);
          await new Promise((resolve) => setTimeout(resolve, 1e3));
        }
      }
      setDownloadQueue([]);
      setIsProcessingQueue(false);
      setBulkDownloadCompleted(true);
    };
    const retryFailedDownloads = () => {
      const failedIds = Array.from(failedDownloads);
      setDownloadQueue(failedIds);
      setTotalDownloadedSize(0);
      setCompletedDownloads(0);
      setSuccessfulDownloads(0);
      setBulkDownloadCompleted(false);
    };
    const clearFailedDownloads = () => {
      setFailedDownloads( new Set());
      setBulkDownloadCompleted(false);
      setShowFailedVideos(false);
      setSelectedVideoIds( new Set());
      setTotalDownloadedSize(0);
      setCompletedDownloads(0);
      setSuccessfulDownloads(0);
      setSuccessfulVideoIds( new Set());
    };
    const startBulkDownload = () => {
      const selectedIds = Array.from(selectedVideoIds);
      setDownloadQueue(selectedIds);
      setTotalDownloadedSize(0);
      setCompletedDownloads(0);
      setSuccessfulDownloads(0);
      setBulkDownloadCompleted(false);
      setShowFailedVideos(false);
      setFailedDownloads( new Set());
      setSuccessfulVideoIds( new Set());
    };
    const toggleVideoSelection = (videoId) => {
      setSelectedVideoIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(videoId)) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
        }
        return newSet;
      });
    };
    const toggleSelectAll = (allVideos) => {
      const allSelected = allVideos.every(
        (v) => selectedVideoIds.has(v.videoId)
      );
      setSelectedVideoIds((prev) => {
        const newSet = new Set(prev);
        allVideos.forEach((v) => {
          if (allSelected) {
            newSet.delete(v.videoId);
          } else {
            newSet.add(v.videoId);
          }
        });
        return newSet;
      });
    };
    hooks.useEffect(() => {
      if (downloadQueue.length > 0 && !isProcessingQueue) {
        processDownloadQueue();
      }
    }, [downloadQueue]);
    hooks.useEffect(() => {
      if (activeTab.value !== "ddl") {
        Object.values(abortControllers).forEach((controller) => {
          if (controller) {
            controller.abort();
          }
        });
        return;
      }
      loadCobaltSettings();
      loadChannelInfo();
      loadPerPageSetting();
      const checkUrlChange = () => {
        const currentHandle = youtubeService2.getChannelHandleFromURL();
        if (currentHandle !== youtubeService2.getChannelHandle()) {
          youtubeService2.clearCache();
          setChannelId(null);
          loadChannelInfo();
        }
        if (!isChannelPage() && !isWatchPage()) {
          if (currentVideoId !== null) {
            setCurrentVideoId(null);
            setCurrentVideoTitle("");
            setCurrentVideoDuration("");
            setCurrentVideoMaxQuality("");
            setAudioTracks([]);
            setSelectedDubLang("");
          }
          return;
        }
        if (isWatchPage()) {
          const newVideoId = getVideoIdFromUrl();
          if (newVideoId && newVideoId !== currentVideoId) {
            setCurrentVideoId(newVideoId);
            const domTitle = getVideoTitle2();
            if (domTitle && domTitle !== "video") {
              setCurrentVideoTitle(domTitle);
            } else {
              setCurrentVideoTitle("Loading...");
            }
            setCurrentVideoDuration("");
            setCurrentVideoMaxQuality("");
            if (isPanelVisible.value) {
              fetchVideoInfo(newVideoId);
              fetchAudioTracks(newVideoId);
            }
          } else if (newVideoId && currentVideoId === newVideoId) {
            if (currentVideoTitle === "Loading..." || currentVideoTitle === "video") {
              const newTitle = getVideoTitle2();
              if (newTitle && newTitle !== "video") {
                setCurrentVideoTitle(newTitle);
              }
            }
          }
        }
      };
      const handleSettingsUpdate = () => {
        loadPerPageSetting();
      };
      window.addEventListener("settings-updated", handleSettingsUpdate);
      const intervalId = setInterval(checkUrlChange, 1e3);
      return () => {
        clearInterval(intervalId);
        window.removeEventListener("settings-updated", handleSettingsUpdate);
        Object.values(abortControllers).forEach((controller) => {
          if (controller) {
            controller.abort();
          }
        });
      };
    }, [activeTab.value, currentVideoId, currentVideoTitle]);
    const loadPerPageSetting = async () => {
      const perPage = await storage.get("ddl-per-page", "8");
      setVideosPerPage(parseInt(perPage));
    };
    const loadCobaltSettings = async () => {
      const pageType = isWatchPage() ? "watch" : "channel";
      const contentTab = await storage.get("cobalt-contentTab", "videos");
      setActiveContentTab(contentTab);
      const fmt = await storage.get(`cobalt-format-${pageType}`, "video");
      setFormat(fmt);
      const qual = await storage.get(`cobalt-videoQuality-${pageType}`, "1080");
      const availableQualities = VIDEO_QUALITIES;
      const validQuality = availableQualities.includes(qual) ? qual : "1080";
      setQuality(validQuality);
      if (validQuality !== qual) {
        await storage.set(`cobalt-videoQuality-${pageType}`, validQuality);
      }
      const bitrate = await storage.get(`cobalt-audioBitrate-${pageType}`, "128");
      setAudioBitrate(bitrate);
      setLoadingRecentVideos(true);
      const recentlyWatched = await storage.get(
        "tubeinsights-recently-watched",
        ""
      );
      if (recentlyWatched) {
        try {
          const parsed = JSON.parse(recentlyWatched);
          if (Array.isArray(parsed)) {
            setRecentlyWatchedVideos(parsed);
          } else if (parsed && parsed.videoId) {
            setRecentlyWatchedVideos([parsed]);
          }
        } catch (e) {
          console.error("[Cobalt] Failed to parse recent videos:", e);
        }
      }
      setLoadingRecentVideos(false);
    };
    const saveRecentlyWatched = async (videoId, title, duration, maxQuality) => {
      const newVideo = { videoId, title, duration, maxQuality };
      const filtered = recentlyWatchedVideos.filter((v) => v.videoId !== videoId);
      const updated = [newVideo, ...filtered].slice(0, 5);
      setRecentlyWatchedVideos(updated);
      await storage.set("tubeinsights-recently-watched", JSON.stringify(updated));
    };
    hooks.useEffect(() => {
      if (channelId && activeTab.value === "ddl" && isPanelVisible.value && isChannelPage()) {
        if (videosCache.videos.length === 0 && !loadingCache.videos) {
          fetchVideos("videos");
        }
        if (videosCache.shorts.length === 0 && !loadingCache.shorts) {
          fetchVideos("shorts");
        }
        if (videosCache.live.length === 0 && !loadingCache.live) {
          fetchVideos("live");
        }
      }
    }, [channelId, activeTab.value, isPanelVisible.value]);
    hooks.useEffect(() => {
      if (playlistId && activeTab.value === "ddl" && isPanelVisible.value && isPlaylistPage() && playlistVideos.length === 0 && !loadingPlaylist) {
        fetchPlaylistVideos(playlistId);
      }
    }, [playlistId, activeTab.value, isPanelVisible.value]);
    hooks.useEffect(() => {
      if (activeTab.value === "ddl" && isPanelVisible.value && isWatchPage() && currentVideoId && !currentVideoDuration && !loadingVideoInfo) {
        fetchVideoInfo(currentVideoId);
        fetchAudioTracks(currentVideoId);
      }
    }, [
      activeTab.value,
      isPanelVisible.value,
      currentVideoId,
      currentVideoDuration,
      loadingVideoInfo
    ]);
    hooks.useEffect(() => {
      const handleCacheCleared = () => {
        setRecentlyWatchedVideos([]);
        setLoadingRecentVideos(false);
      };
      window.addEventListener("cache-cleared", handleCacheCleared);
      return () => {
        window.removeEventListener("cache-cleared", handleCacheCleared);
      };
    }, []);
    hooks.useEffect(() => {
      if (isWatchPage() && currentVideoId && currentVideoTitle && currentVideoTitle !== "Loading..." && currentVideoDuration && currentVideoMaxQuality) {
        if (previousVideoData && previousVideoData.videoId !== currentVideoId) {
          saveRecentlyWatched(
            previousVideoData.videoId,
            previousVideoData.title,
            previousVideoData.duration,
            previousVideoData.maxQuality
          );
        }
        setPreviousVideoData({
          videoId: currentVideoId,
          title: currentVideoTitle,
          duration: currentVideoDuration,
          maxQuality: currentVideoMaxQuality
        });
      }
    }, [
      currentVideoId,
      currentVideoTitle,
      currentVideoDuration,
      currentVideoMaxQuality
    ]);
    if (isWatchPage() && currentVideoId) {
      return u("div", { className: "space-y-4", children: [
        errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
        ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "flex gap-2", children: [
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "video" ? "btn-secondary" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("video");
                  storage.set("cobalt-format-watch", "video");
                },
                children: [
u(IconFileMp4, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Video" })
                ]
              }
            ),
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "audio" ? "btn-accent" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("audio");
                  storage.set("cobalt-format-watch", "audio");
                },
                children: [
u(IconFileMp3, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Audio" })
                ]
              }
            )
          ] }),
          format === "video" ? u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: quality,
              onChange: (e) => {
                const value = e.target.value;
                setQuality(value);
                storage.set("cobalt-videoQuality-watch", value);
              },
              children: getAvailableQualities().map((q) => u("option", { value: q, children: [
                q,
                "p"
              ] }, q))
            }
          ) : u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: audioBitrate,
              onChange: (e) => {
                const value = e.target.value;
                setAudioBitrate(value);
                storage.set("cobalt-audioBitrate-watch", value);
              },
              children: audioQualities.map((q) => u("option", { value: q, children: [
                q,
                " kbps"
              ] }, q))
            }
          )
        ] }),
        format === "video" && u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("label", { className: "text-xl font-medium flex items-center gap-2", children: [
u(IconFileAudio, { className: "size-[1.2em]", size: 24 }),
            loadingAudioTracks ? u(preact.Fragment, { children: [
u("span", { className: "loading loading-spinner loading-sm" }),
u("span", { children: "Loading..." })
            ] }) : audioTracks.length > 0 ? "Dubbed Audio" : "Audio"
          ] }),
          loadingAudioTracks ? u("div", { className: "bg-base-300 rounded-lg px-4 py-3 text-xl", children: " " }) : audioTracks.length > 0 ? u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: selectedDubLang,
              onChange: (e) => {
                setSelectedDubLang(e.target.value);
              },
              children: [
u("option", { value: "", children: "Original Audio" }),
                audioTracks.map((track) => u("option", { value: track.languageCode, children: [
                  track.displayName,
                  " ",
                  track.audioIsDefault ? "(Default)" : ""
                ] }, track.languageCode))
              ]
            }
          ) : u("div", { className: "bg-base-300 rounded-lg px-4 py-3 text-xl", children: "Original Audio" })
        ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "w-full", children: u(
            "a",
            {
              href: `https://i.ytimg.com/vi/${currentVideoId}/maxresdefault.jpg`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block aspect-video rounded overflow-hidden relative hover:opacity-80 transition-opacity",
              children: [
u(
                  "img",
                  {
                    src: `https://i.ytimg.com/vi/${currentVideoId}/mqdefault.jpg`,
                    alt: currentVideoTitle,
                    className: "w-full h-full object-cover"
                  }
                ),
                currentVideoDuration && u("div", { className: "absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-lg font-semibold", children: currentVideoDuration })
              ]
            }
          ) }),
u("div", { className: "space-y-2", children: [
u("h3", { className: "text-xl font-semibold line-clamp-2", children: currentVideoTitle || "Current Video" }),
            loadingVideoInfo ? u("div", { className: "flex items-center gap-2", children: [
u("span", { className: "loading loading-spinner loading-sm" }),
u("span", { className: "text-lg opacity-60", children: "Loading info..." })
            ] }) : currentVideoMaxQuality && u("p", { className: "text-lg opacity-60", children: currentVideoMaxQuality })
          ] }),
          downloadingIds.has(currentVideoId) && u("div", { className: "space-y-1", children: [
u("progress", { className: "progress progress-primary w-full h-2" }),
            downloadProgress[currentVideoId] && u("p", { className: "text-lg opacity-60 text-center", children: [
              formatBytes(downloadProgress[currentVideoId].loaded),
              downloadProgress[currentVideoId].total > 0 && ` / ${formatBytes(
              downloadProgress[currentVideoId].total
            )}`
            ] })
          ] }),
          failedDownloads.has(currentVideoId) && u("div", { className: "flex justify-center", children: u("span", { className: "badge badge-error badge-lg", children: "Failed" }) }),
u("div", { className: "flex gap-2", children: [
u(
              "button",
              {
                className: "btn btn-lg btn-secondary",
                onClick: () => fetchSubtitlesForDialog(currentVideoId),
                disabled: loadingSubtitles && subtitleVideoId === currentVideoId,
                children: loadingSubtitles && subtitleVideoId === currentVideoId ? u("span", { className: "loading loading-spinner loading-md" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
              }
            ),
u(
              "button",
              {
                className: "btn btn-lg btn-primary flex-1",
                onClick: () => downloadVideo(
                  currentVideoId,
                  currentVideoTitle,
                  selectedDubLang
                ),
                disabled: downloadingIds.has(currentVideoId),
                children: downloadingIds.has(currentVideoId) ? u(preact.Fragment, { children: [
u("span", { className: "loading loading-spinner loading-md" }),
u("span", { className: "text-xl", children: "Downloading..." })
                ] }) : u(preact.Fragment, { children: [
u(IconDownload, { className: "size-[1.8em]" }),
u("span", { className: "text-xl", children: "Download" })
                ] })
              }
            )
          ] })
        ] }),
        (loadingRecentVideos || recentlyWatchedVideos.some((v) => v.videoId !== currentVideoId)) && u(preact.Fragment, { children: [
u("h3", { className: "text-xl font-semibold flex items-center gap-2", children: [
u(IconHistory, { className: "size-[1.2em]", size: 24 }),
            "Recent Videos"
          ] }),
u("div", { className: "divider my-0" }),
u("div", { className: "space-y-3", children: loadingRecentVideos ? (

u(preact.Fragment, { children: [...Array(5)].map((_, i) => u("div", { className: "bg-base-200 rounded-lg p-4", children: u(
              "div",
              {
                className: "flex gap-3 items-start",
                style: { minHeight: "68px" },
                children: [
u("div", { className: "skeleton w-[120px] aspect-video rounded shrink-0" }),
u("div", { className: "flex-1 space-y-2 min-w-0 pr-24", children: [
u("div", { className: "skeleton h-5 w-full" }),
u("div", { className: "skeleton h-5 w-3/4" })
                  ] }),
u("div", { className: "flex gap-2", children: [
u("div", { className: "skeleton h-12 w-12 rounded-lg" }),
u("div", { className: "skeleton h-12 w-12 rounded-lg" })
                  ] })
                ]
              }
            ) }, i)) })
          ) : recentlyWatchedVideos.filter((video) => video.videoId !== currentVideoId).map((video) => u(
            "div",
            {
              className: "bg-base-200 rounded-lg p-4",
              children: u(
                "div",
                {
                  className: "flex items-start gap-3 relative",
                  style: { minHeight: "68px" },
                  children: [
u("div", { className: "shrink-0", style: { width: "120px" }, children: [
u(
                        "a",
                        {
                          href: `https://www.youtube.com/watch?v=${video.videoId}`,
                          className: "block aspect-video rounded overflow-hidden mb-1 relative hover:opacity-80 transition-opacity",
                          children: [
u(
                              "img",
                              {
                                src: `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
                                alt: video.title,
                                className: "w-full h-full object-cover"
                              }
                            ),
                            video.duration && u("div", { className: "absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-sm font-semibold", children: video.duration })
                          ]
                        }
                      ),
                      downloadingIds.has(video.videoId) && u("div", { children: [
u("progress", { className: "progress progress-primary w-full h-1" }),
                        downloadProgress[video.videoId] && u("p", { className: "text-lg opacity-60 mt-1", children: formatBytes(
                          downloadProgress[video.videoId].loaded
                        ) })
                      ] }),
                      failedDownloads.has(video.videoId) && u("span", { className: "badge badge-error text-sm", children: "Failed" })
                    ] }),
u("div", { className: "flex-1 min-w-0 pr-24", children: [
u("h3", { className: "text-lg font-medium line-clamp-2", children: video.title }),
                      video.maxQuality && u("p", { className: "text-sm opacity-60 mt-1", children: video.maxQuality })
                    ] }),
u("div", { className: "absolute bottom-0 right-0 flex gap-2", children: [
u(
                        "button",
                        {
                          className: "btn btn-square btn-secondary",
                          onClick: () => fetchSubtitlesForDialog(video.videoId),
                          disabled: loadingSubtitles && subtitleVideoId === video.videoId,
                          children: loadingSubtitles && subtitleVideoId === video.videoId ? u("span", { className: "loading loading-spinner loading-sm" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
                        }
                      ),
u(
                        "button",
                        {
                          className: "btn btn-square btn-primary",
                          onClick: () => downloadVideo(
                            video.videoId,
                            video.title,
                            selectedDubLang
                          ),
                          disabled: downloadingIds.has(video.videoId),
                          children: downloadingIds.has(video.videoId) ? u("span", { className: "loading loading-spinner loading-sm" }) : failedDownloads.has(video.videoId) ? u(IconRefresh, { className: "size-[1.8em]" }) : u(IconDownload, { className: "size-[1.8em]" })
                        }
                      )
                    ] })
                  ]
                }
              )
            },
            video.videoId
          )) })
        ] }),
u("p", { className: "text-lg opacity-60 text-center", children: "Using Cobalt Instances" })
      ] });
    }
    if (isPlaylistPage() && playlistId) {
      const filteredVideos2 = showFailedVideos ? playlistVideos.filter((v) => failedDownloads.has(v.videoId)) : playlistVideos;
      const totalPages2 = Math.ceil(filteredVideos2.length / videosPerPage);
      const startIndex2 = (currentPage - 1) * videosPerPage;
      const endIndex2 = startIndex2 + videosPerPage;
      const currentVideos2 = filteredVideos2.slice(startIndex2, endIndex2);
      return u("div", { className: "space-y-4", children: [
        errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
        ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "flex gap-2", children: [
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "video" ? "btn-secondary" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("video");
                  storage.set("cobalt-format-playlist", "video");
                },
                children: [
u(IconFileMp4, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Video" })
                ]
              }
            ),
u(
              "button",
              {
                className: `btn btn-lg flex-1 ${format === "audio" ? "btn-accent" : "btn-ghost"}`,
                onClick: () => {
                  setFormat("audio");
                  storage.set("cobalt-format-playlist", "audio");
                },
                children: [
u(IconFileMp3, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Audio" })
                ]
              }
            )
          ] }),
          format === "video" ? u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: quality,
              onChange: (e) => {
                const value = e.target.value;
                setQuality(value);
                storage.set("cobalt-videoQuality-playlist", value);
              },
              children: getAvailableQualities().map((q) => u("option", { value: q, children: [
                q,
                "p"
              ] }, q))
            }
          ) : u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: audioBitrate,
              onChange: (e) => {
                const value = e.target.value;
                setAudioBitrate(value);
                storage.set("cobalt-audioBitrate-playlist", value);
              },
              children: audioQualities.map((q) => u("option", { value: q, children: [
                q,
                " kbps"
              ] }, q))
            }
          )
        ] }),
        format === "video" && u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("label", { className: "text-xl font-medium flex items-center gap-2 mb-3", children: [
u(IconFileAudio, { className: "size-[1.2em]", size: 24 }),
            "Dubbed Audio"
          ] }),
u(
            "select",
            {
              className: "select select-bordered select-lg w-full text-xl",
              value: bulkDubLang,
              onChange: (e) => {
                const value = e.target.value;
                setBulkDubLang(value);
              },
              children: DUB_LANGUAGE_OPTIONS.map((lang) => u("option", { value: lang.value, children: lang.label }, lang.value))
            }
          )
        ] }),
        playlistVideos.length > 0 && u("div", { className: "space-y-3", children: [
u("div", { className: "flex items-center justify-between gap-3", children: [
u("label", { className: "flex items-center gap-2 cursor-pointer", children: [
u(
                "input",
                {
                  type: "checkbox",
                  className: "checkbox checkbox-primary checkbox-lg",
                  checked: playlistVideos.length > 0 && playlistVideos.every((v) => selectedVideoIds.has(v.videoId)),
                  onChange: () => toggleSelectAll(playlistVideos)
                }
              ),
u("span", { className: "text-xl", children: [
                "Select All (",
                playlistVideos.length.toLocaleString(),
                ")"
              ] })
            ] }),
            selectedVideoIds.size > 0 && u(
              "button",
              {
                className: "btn btn-primary",
                onClick: startBulkDownload,
                disabled: isProcessingQueue,
                children: isProcessingQueue ? u(preact.Fragment, { children: [
u("span", { className: "loading loading-spinner loading-md" }),
u("span", { children: "Downloading..." })
                ] }) : u("span", { children: [
                  "Download (",
                  selectedVideoIds.size.toLocaleString(),
                  ")"
                ] })
              }
            )
          ] }),
          isProcessingQueue && u("div", { className: "space-y-2", children: [
u(
              "progress",
              {
                className: "progress progress-primary w-full",
                value: completedDownloads,
                max: downloadQueue.length
              }
            ),
u("div", { className: "flex items-center justify-between", children: [
u("span", { className: "text-lg", children: formatBytes(totalDownloadedSize) }),
u("span", { className: "text-lg", children: [
                completedDownloads,
                "/",
                downloadQueue.length
              ] })
            ] })
          ] }),
          bulkDownloadCompleted && u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-start justify-between gap-4", children: [
u("div", { className: "flex-1", children: [
u("h3", { className: "text-lg font-semibold mb-3", children: "Download Summary" }),
u("div", { className: "space-y-2", children: [
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "size-5 text-success" }),
u("span", { className: "text-lg", children: [
                    "Success: ",
                    successfulDownloads,
                    " video",
                    successfulDownloads !== 1 ? "s" : ""
                  ] })
                ] }),
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "size-5 text-error" }),
u("span", { className: "text-lg", children: [
                    "Failed: ",
                    failedDownloads.size,
                    " video",
                    failedDownloads.size !== 1 ? "s" : ""
                  ] })
                ] })
              ] })
            ] }),
u("div", { className: "flex flex-col gap-2", children: [
u("div", { className: "flex gap-2 justify-end", children: [
u(
                  "div",
                  {
                    className: "tooltip tooltip-left",
                    "data-tip": showFailedVideos ? "Hide Failed" : "Show Failed",
                    children: u(
                      "button",
                      {
                        className: "btn btn-square btn-neutral",
                        onClick: () => setShowFailedVideos(!showFailedVideos),
                        children: u(IconEye, { className: "size-[1.8em]" })
                      }
                    )
                  }
                ),
u(
                  "div",
                  {
                    className: "tooltip tooltip-left",
                    "data-tip": "Clear Summary",
                    children: u(
                      "button",
                      {
                        className: "btn btn-square btn-error",
                        onClick: clearFailedDownloads,
                        children: u(IconCircleX, { className: "size-[1.8em]" })
                      }
                    )
                  }
                )
              ] }),
              failedDownloads.size > 0 && u(
                "button",
                {
                  className: "btn btn-primary",
                  onClick: retryFailedDownloads,
                  children: [
u(IconRefresh, { className: "size-[1.8em]" }),
u("span", { children: "Retry Failed" })
                  ]
                }
              )
            ] })
          ] }) })
        ] }),
        loadingPlaylist && playlistVideos.length === 0 && u("div", { className: "text-center py-8", children: [
u("span", { className: "loading loading-spinner loading-lg" }),
u("p", { className: "text-xl opacity-60 mt-4", children: "Loading playlist..." })
        ] }),
        playlistVideos.length > 0 && u(preact.Fragment, { children: [
u("div", { className: "space-y-3", children: currentVideos2.map((video) => {
            let bgClass = "bg-base-200";
            if (failedDownloads.has(video.videoId)) {
              bgClass = "bg-error/10";
            } else if (successfulVideoIds.has(video.videoId)) {
              bgClass = "bg-success/10";
            }
            return u(
              "div",
              {
                className: `${bgClass} rounded-lg p-4`,
                children: u(
                  "div",
                  {
                    className: "flex items-start gap-3 relative",
                    style: { minHeight: "68px" },
                    children: [
u("div", { className: "shrink-0", style: { width: "120px" }, children: [
u(
                          "a",
                          {
                            href: `https://www.youtube.com/watch?v=${video.videoId}`,
                            className: "block aspect-video rounded overflow-hidden mb-1 relative hover:opacity-80 transition-opacity",
                            children: [
u(
                                "img",
                                {
                                  src: video.thumbnail,
                                  alt: video.title,
                                  className: "w-full h-full object-cover"
                                }
                              ),
u("div", { className: "absolute top-1 left-1", children: u(
                                "input",
                                {
                                  type: "checkbox",
                                  className: "checkbox checkbox-primary checkbox-lg",
                                  checked: selectedVideoIds.has(video.videoId),
                                  onChange: () => toggleVideoSelection(video.videoId),
                                  onClick: (e) => e.stopPropagation()
                                }
                              ) }),
                              video.duration && u("div", { className: "absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-sm font-semibold", children: video.duration })
                            ]
                          }
                        ),
                        downloadingIds.has(video.videoId) && u("div", { children: [
u("progress", { className: "progress progress-primary w-full h-1" }),
                          downloadProgress[video.videoId] && u("p", { className: "text-lg opacity-60 mt-1", children: formatBytes(
                            downloadProgress[video.videoId].loaded
                          ) })
                        ] }),
                        failedDownloads.has(video.videoId) && u("span", { className: "badge badge-error text-sm", children: "Failed" }),
                        successfulVideoIds.has(video.videoId) && u("span", { className: "badge badge-success text-sm", children: "Success" })
                      ] }),
u("div", { className: "flex-1 min-w-0 pr-24", children: u("h3", { className: "text-lg font-medium line-clamp-2", children: video.title }) }),
u("div", { className: "absolute bottom-0 right-0 flex gap-2", children: [
u(
                          "button",
                          {
                            className: "btn btn-square btn-secondary",
                            onClick: () => fetchSubtitlesForDialog(video.videoId),
                            disabled: loadingSubtitles && subtitleVideoId === video.videoId,
                            children: loadingSubtitles && subtitleVideoId === video.videoId ? u("span", { className: "loading loading-spinner loading-sm" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
                          }
                        ),
u(
                          "button",
                          {
                            className: "btn btn-square btn-primary",
                            onClick: () => downloadVideo(video.videoId, video.title, bulkDubLang),
                            disabled: downloadingIds.has(video.videoId),
                            children: downloadingIds.has(video.videoId) ? u("span", { className: "loading loading-spinner loading-sm" }) : failedDownloads.has(video.videoId) ? u(IconRefresh, { className: "size-[1.8em]" }) : u(IconDownload, { className: "size-[1.8em]" })
                          }
                        )
                      ] })
                    ]
                  }
                )
              },
              video.videoId
            );
          }) }),
          totalPages2 > 1 && u("div", { className: "flex justify-center", children: u("div", { className: "join", children: [
u(
              "button",
              {
                className: "join-item btn btn-lg",
                disabled: currentPage === 1,
                onClick: () => setCurrentPageCache((prev) => ({ ...prev, videos: currentPage - 1 })),
                children: "«"
              }
            ),
u("button", { className: "join-item btn btn-lg", children: [
              currentPage,
              "/",
              totalPages2
            ] }),
u(
              "button",
              {
                className: "join-item btn btn-lg",
                disabled: currentPage === totalPages2,
                onClick: () => setCurrentPageCache((prev) => ({ ...prev, videos: currentPage + 1 })),
                children: "»"
              }
            )
          ] }) })
        ] }),
        !loadingPlaylist && playlistVideos.length === 0 && u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: "No videos found in playlist" }) })
      ] });
    }
    if (!isChannelPage()) {
      return u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: "Navigate to a YouTube channel, playlist, or video to download" }) });
    }
    if (!channelId) {
      return u("div", { className: "text-center py-8", children: u("span", { className: "loading loading-spinner loading-lg" }) });
    }
    const filteredVideos = showFailedVideos ? videos.filter((v) => failedDownloads.has(v.videoId)) : videos;
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const currentVideos = filteredVideos.slice(startIndex, endIndex);
    return u("div", { className: "space-y-4", children: [
      errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
      ] }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3", children: [
u("div", { className: "flex gap-2", children: [
u(
            "button",
            {
              className: `btn btn-lg flex-1 ${format === "video" ? "btn-secondary" : "btn-ghost"}`,
              onClick: () => {
                setFormat("video");
                storage.set("cobalt-format-channel", "video");
              },
              children: [
u(IconFileMp4, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Video" })
              ]
            }
          ),
u(
            "button",
            {
              className: `btn btn-lg flex-1 ${format === "audio" ? "btn-accent" : "btn-ghost"}`,
              onClick: () => {
                setFormat("audio");
                storage.set("cobalt-format-channel", "audio");
              },
              children: [
u(IconFileMp3, { className: "size-[1.8em]", size: 28 }),
u("span", { className: "text-xl", children: "Audio" })
              ]
            }
          )
        ] }),
        format === "video" ? u(
          "select",
          {
            className: "select select-bordered select-lg w-full text-xl",
            value: quality,
            onChange: (e) => {
              const value = e.target.value;
              setQuality(value);
              storage.set("cobalt-videoQuality-channel", value);
            },
            children: getAvailableQualities().map((q) => u("option", { value: q, children: [
              q,
              "p"
            ] }, q))
          }
        ) : u(
          "select",
          {
            className: "select select-bordered select-lg w-full text-xl",
            value: audioBitrate,
            onChange: (e) => {
              const value = e.target.value;
              setAudioBitrate(value);
              storage.set("cobalt-audioBitrate-channel", value);
            },
            children: audioQualities.map((q) => u("option", { value: q, children: [
              q,
              " kbps"
            ] }, q))
          }
        )
      ] }),
      format === "video" && u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("label", { className: "text-xl font-medium flex items-center gap-2 mb-3", children: [
u(IconFileAudio, { className: "size-[1.2em]", size: 24 }),
          "Dubbed Audio"
        ] }),
u(
          "select",
          {
            className: "select select-bordered select-lg w-full text-xl",
            value: bulkDubLang,
            onChange: (e) => {
              const value = e.target.value;
              setBulkDubLang(value);
            },
            children: DUB_LANGUAGE_OPTIONS.map((lang) => u("option", { value: lang.value, children: lang.label }, lang.value))
          }
        )
      ] }),
u("div", { role: "tablist", className: "tabs tabs-border bg-base-200 text-xl h-14", children: [
u(
          "button",
          {
            role: "tab",
            className: `tab text-xl h-14 ${activeContentTab === "videos" ? "tab-active" : ""}`,
            onClick: () => {
              setActiveContentTab("videos");
              storage.set("cobalt-contentTab", "videos");
            },
            children: [
              "Videos",
              " ",
              videosCache.videos.length > 0 && `(${videosCache.videos.length.toLocaleString()})`
            ]
          }
        ),
u(
          "button",
          {
            role: "tab",
            className: `tab text-xl h-14 ${activeContentTab === "shorts" ? "tab-active" : ""}`,
            onClick: () => {
              setActiveContentTab("shorts");
              storage.set("cobalt-contentTab", "shorts");
            },
            children: [
              "Shorts",
              " ",
              videosCache.shorts.length > 0 && `(${videosCache.shorts.length.toLocaleString()})`
            ]
          }
        ),
u(
          "button",
          {
            role: "tab",
            className: `tab text-xl h-14 ${activeContentTab === "live" ? "tab-active" : ""}`,
            onClick: () => {
              setActiveContentTab("live");
              storage.set("cobalt-contentTab", "live");
            },
            children: [
              "Live",
              " ",
              videosCache.live.length > 0 && `(${videosCache.live.length.toLocaleString()})`
            ]
          }
        )
      ] }),
      videos.length > 0 && u("div", { className: "space-y-3", children: [
u("div", { className: "flex items-center justify-between gap-3", children: [
u("label", { className: "flex items-center gap-2 cursor-pointer", children: [
u(
              "input",
              {
                type: "checkbox",
                className: "checkbox checkbox-primary checkbox-lg",
                checked: videos.length > 0 && videos.every((v) => selectedVideoIds.has(v.videoId)),
                onChange: () => toggleSelectAll(videos)
              }
            ),
u("span", { className: "text-xl", children: [
              "Select All (",
              videos.length.toLocaleString(),
              ")"
            ] })
          ] }),
          selectedVideoIds.size > 0 && u(
            "button",
            {
              className: "btn btn-primary",
              onClick: startBulkDownload,
              disabled: isProcessingQueue,
              children: isProcessingQueue ? u(preact.Fragment, { children: [
u("span", { className: "loading loading-spinner loading-md" }),
u("span", { children: "Downloading..." })
              ] }) : u("span", { children: [
                "Download (",
                selectedVideoIds.size.toLocaleString(),
                ")"
              ] })
            }
          )
        ] }),
        isProcessingQueue && u("div", { className: "space-y-2", children: [
u(
            "progress",
            {
              className: "progress progress-primary w-full",
              value: completedDownloads,
              max: downloadQueue.length
            }
          ),
u("div", { className: "flex items-center justify-between", children: [
u("span", { className: "text-lg", children: formatBytes(totalDownloadedSize) }),
u("span", { className: "text-lg", children: [
              completedDownloads,
              "/",
              downloadQueue.length
            ] })
          ] })
        ] }),
        bulkDownloadCompleted && u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-start justify-between gap-4", children: [
u("div", { className: "flex-1", children: [
u("h3", { className: "text-lg font-semibold mb-3", children: "Download Summary" }),
u("div", { className: "space-y-2", children: [
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleCheck, { className: "size-5 text-success" }),
u("span", { className: "text-lg", children: [
                  "Success: ",
                  successfulDownloads,
                  " video",
                  successfulDownloads !== 1 ? "s" : ""
                ] })
              ] }),
u("div", { className: "flex items-center gap-2", children: [
u(IconCircleX, { className: "size-5 text-error" }),
u("span", { className: "text-lg", children: [
                  "Failed: ",
                  failedDownloads.size,
                  " video",
                  failedDownloads.size !== 1 ? "s" : ""
                ] })
              ] })
            ] })
          ] }),
u("div", { className: "flex flex-col gap-2", children: [
u("div", { className: "flex gap-2 justify-end", children: [
u(
                "div",
                {
                  className: "tooltip tooltip-left",
                  "data-tip": showFailedVideos ? "Hide Failed" : "Show Failed",
                  children: u(
                    "button",
                    {
                      className: "btn btn-square btn-neutral",
                      onClick: () => setShowFailedVideos(!showFailedVideos),
                      children: u(IconEye, { className: "size-[1.8em]" })
                    }
                  )
                }
              ),
u(
                "div",
                {
                  className: "tooltip tooltip-left",
                  "data-tip": "Clear Summary",
                  children: u(
                    "button",
                    {
                      className: "btn btn-square btn-error",
                      onClick: clearFailedDownloads,
                      children: u(IconCircleX, { className: "size-[1.8em]" })
                    }
                  )
                }
              )
            ] }),
            failedDownloads.size > 0 && u(
              "button",
              {
                className: "btn btn-primary",
                onClick: retryFailedDownloads,
                children: [
u(IconRefresh, { className: "size-[1.8em]" }),
u("span", { children: "Retry Failed" })
                ]
              }
            )
          ] })
        ] }) })
      ] }),
      loading && videos.length === 0 && u("div", { className: "text-center py-8", children: [
u("span", { className: "loading loading-spinner loading-lg" }),
u("p", { className: "text-xl opacity-60 mt-4", children: "Loading videos..." })
      ] }),
      videos.length > 0 && u(preact.Fragment, { children: [
u("div", { className: "space-y-3", children: currentVideos.map((video) => {
          let bgClass = "bg-base-200";
          if (failedDownloads.has(video.videoId)) {
            bgClass = "bg-error/10";
          } else if (successfulVideoIds.has(video.videoId)) {
            bgClass = "bg-success/10";
          }
          return u(
            "div",
            {
              className: `${bgClass} rounded-lg p-4`,
              children: u(
                "div",
                {
                  className: "flex items-start gap-3 relative",
                  style: { minHeight: "68px" },
                  children: [
u("div", { className: "shrink-0", style: { width: "120px" }, children: [
u(
                        "a",
                        {
                          href: `https://www.youtube.com/watch?v=${video.videoId}`,
                          className: "block aspect-video rounded overflow-hidden mb-1 relative hover:opacity-80 transition-opacity",
                          children: [
u(
                              "img",
                              {
                                src: video.thumbnail,
                                alt: video.title,
                                className: "w-full h-full object-cover"
                              }
                            ),
u("div", { className: "absolute top-1 left-1", children: u(
                              "input",
                              {
                                type: "checkbox",
                                className: "checkbox checkbox-primary checkbox-lg",
                                checked: selectedVideoIds.has(video.videoId),
                                onChange: () => toggleVideoSelection(video.videoId),
                                onClick: (e) => e.stopPropagation()
                              }
                            ) }),
                            video.duration && u("div", { className: "absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-sm font-semibold", children: video.duration })
                          ]
                        }
                      ),
                      downloadingIds.has(video.videoId) && u("div", { children: [
u("progress", { className: "progress progress-primary w-full h-1" }),
                        downloadProgress[video.videoId] && u("p", { className: "text-lg opacity-60 mt-1", children: formatBytes(
                          downloadProgress[video.videoId].loaded
                        ) })
                      ] }),
                      failedDownloads.has(video.videoId) && u("span", { className: "badge badge-error text-sm", children: "Failed" }),
                      successfulVideoIds.has(video.videoId) && u("span", { className: "badge badge-success text-sm", children: "Success" })
                    ] }),
u("div", { className: "flex-1 min-w-0 pr-24", children: u("h3", { className: "text-lg font-medium line-clamp-2", children: video.title }) }),
u("div", { className: "absolute bottom-0 right-0 flex gap-2", children: [
u(
                        "button",
                        {
                          className: "btn btn-square btn-secondary",
                          onClick: () => fetchSubtitlesForDialog(video.videoId),
                          disabled: loadingSubtitles && subtitleVideoId === video.videoId,
                          children: loadingSubtitles && subtitleVideoId === video.videoId ? u("span", { className: "loading loading-spinner loading-sm" }) : u(IconBadgeCc, { className: "size-[1.8em]" })
                        }
                      ),
u(
                        "button",
                        {
                          className: "btn btn-square btn-primary",
                          onClick: () => downloadVideo(
                            video.videoId,
                            video.title,
                            bulkDubLang
                          ),
                          disabled: downloadingIds.has(video.videoId),
                          children: downloadingIds.has(video.videoId) ? u("span", { className: "loading loading-spinner loading-sm" }) : u(IconDownload, { className: "size-[1.8em]" })
                        }
                      )
                    ] })
                  ]
                }
              )
            },
            video.videoId
          );
        }) }),
        totalPages > 1 && u("div", { className: "flex justify-center", children: u("div", { className: "join", children: [
u(
            "button",
            {
              className: "join-item btn btn-lg",
              disabled: currentPage === 1,
              onClick: () => setCurrentPageCache((prev) => ({
                ...prev,
                [activeContentTab]: currentPage - 1
              })),
              children: "«"
            }
          ),
u("button", { className: "join-item btn btn-lg", children: [
            currentPage,
            "/",
            totalPages
          ] }),
u(
            "button",
            {
              className: "join-item btn btn-lg",
              disabled: currentPage === totalPages,
              onClick: () => setCurrentPageCache((prev) => ({
                ...prev,
                [activeContentTab]: currentPage + 1
              })),
              children: "»"
            }
          )
        ] }) })
      ] }),
      !loading && videos.length === 0 && u("div", { className: "text-center py-8", children: u("p", { className: "text-xl opacity-60", children: [
        "No ",
        activeContentTab,
        " found"
      ] }) }),
u("p", { className: "text-lg opacity-60 text-center", children: "Using Cobalt Instances" })
    ] });
  }
  const THEMES = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "abyss",
    "caramellatte",
    "silk"
  ];
  function ThemeSelector() {
    const dropdownRef = hooks.useRef(null);
    return u("div", { className: "form-control", ref: dropdownRef, children: [
u("label", { className: "label", children: u("span", { className: "label-text text-xl font-medium", children: "Theme" }) }),
u("div", { className: "dropdown dropdown-end block w-full", children: [
u(
          "div",
          {
            tabIndex: 0,
            role: "button",
            className: "btn btn-sm gap-2 w-full justify-start text-xl h-auto min-h-12 py-2",
            children: [
u("div", { className: "bg-base-100 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1", children: [
u("div", { className: "bg-base-content size-1.5 rounded-full" }),
u("div", { className: "bg-primary size-1.5 rounded-full" }),
u("div", { className: "bg-secondary size-1.5 rounded-full" }),
u("div", { className: "bg-accent size-1.5 rounded-full" })
              ] }),
u("div", { className: "flex-1 truncate text-left capitalize text-xl", children: currentTheme.value }),
u(
                "svg",
                {
                  width: "20px",
                  height: "20px",
                  className: "size-5 fill-current opacity-60",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 2048 2048",
                  children: u("path", { d: "M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" })
                }
              )
            ]
          }
        ),
u(
          "div",
          {
            tabIndex: 0,
            className: "dropdown-content bg-base-200 text-base-content rounded-box mt-2 w-full max-h-96 overflow-y-auto border border-white/5 shadow-2xl outline outline-black/5",
            children: u("ul", { className: "menu w-full text-xl", children: [
u("li", { className: "menu-title text-xl", children: "Change Theme" }),
              THEMES.map((theme) => u("li", { children: u(
                "button",
                {
                  className: `gap-2 px-2 py-1.5 text-xl ${theme === currentTheme.value ? "[&_svg]:visible" : ""}`,
                  onClick: () => {
                    currentTheme.value = theme;
                    storage.set("tubeinsights-theme", theme);
                    playThemeSelectSound();
                    const activeElement = document.activeElement;
                    if (activeElement) {
                      activeElement.blur();
                    }
                    window.dispatchEvent(new CustomEvent("themeChanged"));
                  },
                  children: [
u(
                      "div",
                      {
                        "data-theme": theme,
                        className: "bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm",
                        children: [
u("div", { className: "bg-base-content size-1.5 rounded-full" }),
u("div", { className: "bg-primary size-1.5 rounded-full" }),
u("div", { className: "bg-secondary size-1.5 rounded-full" }),
u("div", { className: "bg-accent size-1.5 rounded-full" })
                        ]
                      }
                    ),
u("span", { className: "flex-1 truncate capitalize text-left text-xl", children: theme }),
u(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        className: "invisible h-5 w-5 shrink-0",
                        children: u("path", { d: "M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" })
                      }
                    )
                  ]
                }
              ) }, theme))
            ] })
          }
        )
      ] })
    ] });
  }
  function SettingsTab() {
    const [bookmarkPerPage, setBookmarkPerPage] = hooks.useState(10);
    const [ddlPerPage, setDdlPerPage] = hooks.useState(10);
    const [width, setWidth] = hooks.useState(350);
    const [showResetDialog, setShowResetDialog] = hooks.useState(false);
    const resetDialogRef = hooks.useRef(null);
    const [showClearCacheDialog, setShowClearCacheDialog] = hooks.useState(false);
    const clearCacheDialogRef = hooks.useRef(null);
    const [widthApplied, setWidthApplied] = hooks.useState(false);
    const [bookmarkApplied, setBookmarkApplied] = hooks.useState(false);
    const [ddlApplied, setDdlApplied] = hooks.useState(false);
    const [loopVideo, setLoopVideo] = hooks.useState(moduleSettings.value.loopVideo);
    const [returnDislike, setReturnDislike] = hooks.useState(
      moduleSettings.value.returnDislike
    );
    const [screenshotFormat, setScreenshotFormat] = hooks.useState(
      moduleSettings.value.screenshotFormat
    );
    const [screenshotFilename, setScreenshotFilename] = hooks.useState(
      moduleSettings.value.screenshotFilename
    );
    const [screenshotDownload, setScreenshotDownload] = hooks.useState(
      moduleSettings.value.screenshotDownload
    );
    const [screenshotCopy, setScreenshotCopy] = hooks.useState(
      moduleSettings.value.screenshotCopy
    );
    const [thumbnailDownload, setThumbnailDownload] = hooks.useState(
      moduleSettings.value.thumbnailDownload
    );
    const [hideProgressBar, setHideProgressBar] = hooks.useState(
      moduleSettings.value.hideProgressBar
    );
    const [countryFlags, setCountryFlags] = hooks.useState(
      moduleSettings.value.countryFlags
    );
    const [cobaltEnabled, setCobaltEnabled] = hooks.useState(
      cobaltSettings.value.enabled
    );
    const [cobaltInstanceUrl, setCobaltInstanceUrl] = hooks.useState(
      cobaltSettings.value.instanceUrl
    );
    const [cobaltFilenameStyle, setCobaltFilenameStyle] = hooks.useState(
      cobaltSettings.value.filenameStyle
    );
    const [cobaltPreferredDubLang, setCobaltPreferredDubLang] = hooks.useState(
      cobaltSettings.value.preferredDubLang
    );
    const [cobaltDebug, setCobaltDebug] = hooks.useState(cobaltSettings.value.debug);
    const [cobaltUrlApplied, setCobaltUrlApplied] = hooks.useState(false);
    hooks.useEffect(() => {
      loadSettings2();
    }, []);
    const loadSettings2 = async () => {
      const bookmark = await storage.get("bookmark-per-page", "10");
      setBookmarkPerPage(parseInt(bookmark));
      const ddl = await storage.get("ddl-per-page", "10");
      setDdlPerPage(parseInt(ddl));
      const savedWidth = await storage.get("tubeinsights-panelWidth", "350");
      setWidth(parseInt(savedWidth));
      const loopVideoSaved = await storage.get("module-loop-video", "true");
      setLoopVideo(loopVideoSaved === "true");
      const returnDislikeSaved = await storage.get(
        "module-return-dislike",
        "true"
      );
      setReturnDislike(returnDislikeSaved === "true");
      const screenshotFormatSaved = await storage.get(
        "module-screenshot-format",
        "jpg"
      );
      setScreenshotFormat(screenshotFormatSaved);
      const screenshotFilenameSaved = await storage.get(
        "module-screenshot-filename",
        "title"
      );
      setScreenshotFilename(screenshotFilenameSaved);
      const screenshotDownloadSaved = await storage.get(
        "module-screenshot-download",
        "true"
      );
      setScreenshotDownload(screenshotDownloadSaved === "true");
      const screenshotCopySaved = await storage.get(
        "module-screenshot-copy",
        "true"
      );
      setScreenshotCopy(screenshotCopySaved === "true");
      const thumbnailDownloadSaved = await storage.get(
        "module-thumbnail-download",
        "true"
      );
      setThumbnailDownload(thumbnailDownloadSaved === "true");
      const hideProgressBarSaved = await storage.get(
        "module-hide-progress-bar",
        "false"
      );
      setHideProgressBar(hideProgressBarSaved === "true");
      const countryFlagsSaved = await storage.get(
        "module-country-flags",
        "false"
      );
      setCountryFlags(countryFlagsSaved === "true");
      const cobaltEnabledSaved = await storage.get("cobalt-enabled", "false");
      setCobaltEnabled(cobaltEnabledSaved === "true");
      const cobaltInstanceUrlSaved = await storage.get(
        "cobalt-instance-url",
        COBALT_DEFAULTS.INSTANCE_URL
      );
      setCobaltInstanceUrl(cobaltInstanceUrlSaved);
      const cobaltFilenameStyleSaved = await storage.get(
        "cobalt-filename-style",
        "basic"
      );
      setCobaltFilenameStyle(
        cobaltFilenameStyleSaved
      );
      const cobaltPreferredDubLangSaved = await storage.get(
        "cobalt-preferred-dub-lang",
        ""
      );
      setCobaltPreferredDubLang(cobaltPreferredDubLangSaved);
      const cobaltDebugSaved = await storage.get("cobalt-debug", "false");
      setCobaltDebug(cobaltDebugSaved === "true");
    };
    const handleBookmarkPerPageChange = (value) => {
      setBookmarkPerPage(value);
      storage.set("bookmark-per-page", value.toString());
      window.dispatchEvent(new CustomEvent("settings-updated"));
      playApplySound();
      setBookmarkApplied(true);
      setTimeout(() => setBookmarkApplied(false), 500);
    };
    const handleDdlPerPageChange = (value) => {
      setDdlPerPage(value);
      storage.set("ddl-per-page", value.toString());
      window.dispatchEvent(new CustomEvent("settings-updated"));
      playApplySound();
      setDdlApplied(true);
      setTimeout(() => setDdlApplied(false), 500);
    };
    const handleWidthChange = (value) => {
      setWidth(value);
      panelWidth.value = value;
      storage.set("tubeinsights-panelWidth", value.toString());
      playApplySound();
      setWidthApplied(true);
      setTimeout(() => setWidthApplied(false), 500);
    };
    hooks.useEffect(() => {
      if (showResetDialog && resetDialogRef.current) {
        resetDialogRef.current.showModal();
      }
    }, [showResetDialog]);
    hooks.useEffect(() => {
      if (showClearCacheDialog && clearCacheDialogRef.current) {
        clearCacheDialogRef.current.showModal();
      }
    }, [showClearCacheDialog]);
    const handleLoopVideoToggle = (enabled) => {
      setLoopVideo(enabled);
      storage.set("module-loop-video", enabled.toString());
      moduleSettings.value = { ...moduleSettings.value, loopVideo: enabled };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playToggleSound();
    };
    const handleReturnDislikeToggle = (enabled) => {
      setReturnDislike(enabled);
      storage.set("module-return-dislike", enabled.toString());
      moduleSettings.value = { ...moduleSettings.value, returnDislike: enabled };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playToggleSound();
    };
    const handleScreenshotFormatChange = (format) => {
      setScreenshotFormat(format);
      storage.set("module-screenshot-format", format);
      moduleSettings.value = {
        ...moduleSettings.value,
        screenshotFormat: format
      };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playApplySound();
    };
    const handleScreenshotFilenameChange = (filename) => {
      setScreenshotFilename(filename);
      storage.set("module-screenshot-filename", filename);
      moduleSettings.value = {
        ...moduleSettings.value,
        screenshotFilename: filename
      };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playApplySound();
    };
    const handleScreenshotDownloadToggle = (enabled) => {
      setScreenshotDownload(enabled);
      storage.set("module-screenshot-download", enabled.toString());
      moduleSettings.value = {
        ...moduleSettings.value,
        screenshotDownload: enabled
      };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playToggleSound();
    };
    const handleScreenshotCopyToggle = (enabled) => {
      setScreenshotCopy(enabled);
      storage.set("module-screenshot-copy", enabled.toString());
      moduleSettings.value = { ...moduleSettings.value, screenshotCopy: enabled };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playToggleSound();
    };
    const handleThumbnailDownloadToggle = (enabled) => {
      setThumbnailDownload(enabled);
      storage.set("module-thumbnail-download", enabled.toString());
      moduleSettings.value = {
        ...moduleSettings.value,
        thumbnailDownload: enabled
      };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playToggleSound();
    };
    const handleHideProgressBarToggle = (enabled) => {
      setHideProgressBar(enabled);
      storage.set("module-hide-progress-bar", enabled.toString());
      moduleSettings.value = {
        ...moduleSettings.value,
        hideProgressBar: enabled
      };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playToggleSound();
    };
    const handleCountryFlagsToggle = (enabled) => {
      setCountryFlags(enabled);
      storage.set("module-country-flags", enabled.toString());
      moduleSettings.value = {
        ...moduleSettings.value,
        countryFlags: enabled
      };
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      playToggleSound();
    };
    const handleCobaltEnabledToggle = (checked) => {
      setCobaltEnabled(checked);
      storage.set("cobalt-enabled", checked.toString());
      cobaltSettings.value = {
        ...cobaltSettings.value,
        enabled: checked
      };
      playToggleSound();
      window.dispatchEvent(new CustomEvent("settings-updated"));
    };
    const handleCobaltInstanceUrlChange = (url) => {
      setCobaltInstanceUrl(url);
      storage.set("cobalt-instance-url", url);
      cobaltSettings.value = {
        ...cobaltSettings.value,
        instanceUrl: url
      };
      playApplySound();
      setCobaltUrlApplied(true);
      setTimeout(() => setCobaltUrlApplied(false), 500);
      window.dispatchEvent(new CustomEvent("settings-updated"));
    };
    const handleCobaltFilenameStyleChange = (style) => {
      setCobaltFilenameStyle(style);
      storage.set("cobalt-filename-style", style);
      cobaltSettings.value = {
        ...cobaltSettings.value,
        filenameStyle: style
      };
      window.dispatchEvent(new CustomEvent("settings-updated"));
    };
    const handleCobaltPreferredDubLangChange = (lang) => {
      setCobaltPreferredDubLang(lang);
      storage.set("cobalt-preferred-dub-lang", lang);
      cobaltSettings.value = {
        ...cobaltSettings.value,
        preferredDubLang: lang
      };
      window.dispatchEvent(new CustomEvent("settings-updated"));
    };
    const handleCobaltDebugToggle = (checked) => {
      setCobaltDebug(checked);
      storage.set("cobalt-debug", checked.toString());
      cobaltSettings.value = {
        ...cobaltSettings.value,
        debug: checked
      };
      playToggleSound();
      window.dispatchEvent(new CustomEvent("settings-updated"));
    };
    const handleClearCache = async () => {
      try {
        await storage.set("tubeinsights-recently-watched", "");
        window.dispatchEvent(new CustomEvent("cache-cleared"));
        clearCacheDialogRef.current?.close();
        setShowClearCacheDialog(false);
        playApplySound();
      } catch (error) {
        console.error("Failed to clear cache:", error);
      }
    };
    const handleResetDefaults = async () => {
      storage.set("bookmark-per-page", "8");
      storage.set("ddl-per-page", "8");
      storage.set("tubeinsights-panelWidth", "350");
      storage.set("tubeinsights-theme", "light");
      storage.set("ddl-contentTab", "videos");
      storage.set("ddl-format-watch", "video");
      storage.set("ddl-format-channel", "video");
      storage.set("ddl-format-playlist", "video");
      storage.set("ddl-videoQuality-watch", "1080");
      storage.set("ddl-videoQuality-channel", "1080");
      storage.set("ddl-videoQuality-playlist", "1080");
      storage.set("ddl-audioBitrate-watch", "128");
      storage.set("ddl-audioBitrate-channel", "128");
      storage.set("ddl-audioBitrate-playlist", "128");
      storage.set("ddl-embedThumbnail", "false");
      storage.set("cobalt-enabled", "false");
      storage.set("cobalt-instance-url", COBALT_DEFAULTS.INSTANCE_URL);
      storage.set("cobalt-filename-style", COBALT_DEFAULTS.FILENAME_STYLE);
      storage.set("cobalt-preferred-dub-lang", "");
      storage.set("cobalt-debug", "false");
      storage.set("cobalt-contentTab", "videos");
      storage.set("cobalt-format-watch", "video");
      storage.set("cobalt-format-channel", "video");
      storage.set("cobalt-videoQuality-watch", "1080");
      storage.set("cobalt-videoQuality-channel", "1080");
      storage.set("cobalt-audioBitrate-watch", "128");
      storage.set("cobalt-audioBitrate-channel", "128");
      storage.set("module-loop-video", "true");
      storage.set("module-return-dislike", "true");
      storage.set("module-screenshot-format", "jpg");
      storage.set("module-screenshot-filename", "title");
      storage.set("module-screenshot-download", "true");
      storage.set("module-screenshot-copy", "true");
      storage.set("module-thumbnail-download", "true");
      storage.set("module-hide-progress-bar", "false");
      storage.set("module-country-flags", "false");
      setBookmarkPerPage(8);
      setDdlPerPage(8);
      setWidth(350);
      panelWidth.value = 350;
      const { currentTheme: currentTheme2 } = await __vitePreload(async () => {
        const { currentTheme: currentTheme3 } = await Promise.resolve().then(() => index);
        return { currentTheme: currentTheme3 };
      }, void 0 );
      currentTheme2.value = "light";
      setLoopVideo(true);
      setReturnDislike(true);
      setScreenshotFormat("jpg");
      setScreenshotFilename("title");
      setScreenshotDownload(true);
      setScreenshotCopy(true);
      setThumbnailDownload(true);
      setHideProgressBar(false);
      setCountryFlags(false);
      moduleSettings.value = {
        loopVideo: true,
        returnDislike: true,
        screenshotFormat: "jpg",
        screenshotFilename: "title",
        screenshotDownload: true,
        screenshotCopy: true,
        thumbnailDownload: true,
        hideProgressBar: false,
        countryFlags: false
      };
      setCobaltEnabled(false);
      setCobaltInstanceUrl(COBALT_DEFAULTS.INSTANCE_URL);
      setCobaltFilenameStyle(COBALT_DEFAULTS.FILENAME_STYLE);
      setCobaltPreferredDubLang("");
      setCobaltDebug(false);
      cobaltSettings.value = {
        enabled: false,
        instanceUrl: COBALT_DEFAULTS.INSTANCE_URL,
        filenameStyle: COBALT_DEFAULTS.FILENAME_STYLE,
        preferredDubLang: "",
        debug: false
      };
      window.dispatchEvent(new CustomEvent("settings-updated"));
      window.dispatchEvent(new CustomEvent("module-settings-updated"));
      window.dispatchEvent(new CustomEvent("themeChanged"));
      resetDialogRef.current?.close();
      setShowResetDialog(false);
    };
    return u("div", { className: "space-y-6", children: [
u("div", { children: [
u("h3", { className: "text-xl font-semibold mb-4", children: "Appearance" }),
u("div", { className: "space-y-4", children: [
u(ThemeSelector, {}),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("label", { className: "text-xl font-medium mb-3 flex items-center gap-2", children: [
              "Panel Width",
u("div", { className: "tooltip", "data-tip": "Min: 300px, Max: 600px", children: u(IconInfoCircle, { size: 14 }) })
            ] }),
u("div", { className: "join w-full", children: [
u(
                "input",
                {
                  type: "number",
                  min: "300",
                  max: "600",
                  value: width,
                  onChange: (e) => setWidth(parseInt(e.target.value)),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      handleWidthChange(width);
                    }
                  },
                  className: "input input-bordered join-item flex-1 text-xl"
                }
              ),
u(
                "button",
                {
                  className: `btn join-item ${widthApplied ? "btn-success" : "btn-neutral"}`,
                  onClick: () => handleWidthChange(width),
                  children: widthApplied ? u(IconCheck, { className: "size-[1.8em]" }) : "Apply"
                }
              )
            ] })
          ] })
        ] })
      ] }),
u("div", { children: [
u("h3", { className: "text-xl font-semibold mb-4 flex items-center gap-2", children: [
          "Items Per Page",
u("div", { className: "tooltip", "data-tip": "Min: 5, Max: 50", children: u(IconInfoCircle, { size: 14 }) })
        ] }),
u("div", { className: "grid grid-cols-2 gap-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("label", { className: "text-xl font-medium mb-3 block", children: "Bookmark" }),
u("div", { className: "join w-full", children: [
u(
                "input",
                {
                  type: "number",
                  min: "5",
                  max: "50",
                  value: bookmarkPerPage,
                  onChange: (e) => setBookmarkPerPage(
                    parseInt(e.target.value)
                  ),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      handleBookmarkPerPageChange(bookmarkPerPage);
                    }
                  },
                  className: "input input-bordered join-item flex-1 text-xl"
                }
              ),
u(
                "button",
                {
                  className: `btn join-item ${bookmarkApplied ? "btn-success" : "btn-neutral"}`,
                  onClick: () => handleBookmarkPerPageChange(bookmarkPerPage),
                  children: bookmarkApplied ? u(IconCheck, { className: "size-[1.8em]" }) : "Apply"
                }
              )
            ] })
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("label", { className: "text-xl font-medium mb-3 block", children: [
              "DDL ",
u("span", { className: "text-sm opacity-60", children: "(Direct Download)" })
            ] }),
u("div", { className: "join w-full", children: [
u(
                "input",
                {
                  type: "number",
                  min: "5",
                  max: "50",
                  value: ddlPerPage,
                  onChange: (e) => setDdlPerPage(parseInt(e.target.value)),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      handleDdlPerPageChange(ddlPerPage);
                    }
                  },
                  className: "input input-bordered join-item flex-1 text-xl"
                }
              ),
u(
                "button",
                {
                  className: `btn join-item ${ddlApplied ? "btn-success" : "btn-neutral"}`,
                  onClick: () => handleDdlPerPageChange(ddlPerPage),
                  children: ddlApplied ? u(IconCheck, { className: "size-[1.8em]" }) : "Apply"
                }
              )
            ] })
          ] })
        ] })
      ] }),
u("div", { children: [
u("h3", { className: "text-xl font-semibold mb-4", children: "Image Download" }),
u("div", { className: "grid grid-cols-2 gap-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("label", { className: "text-xl font-medium block mb-3", children: "Image Format" }),
u(
              "select",
              {
                className: "select select-bordered w-full text-xl",
                value: screenshotFormat,
                onChange: (e) => handleScreenshotFormatChange(
                  e.target.value
                ),
                children: SCREENSHOT_FORMATS.map((format) => u("option", { value: format.value, children: format.label }, format.value))
              }
            )
          ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("label", { className: "text-xl font-medium block mb-3", children: "Filename" }),
u(
              "select",
              {
                className: "select select-bordered w-full text-xl",
                value: screenshotFilename,
                onChange: (e) => handleScreenshotFilenameChange(
                  e.target.value
                ),
                children: SCREENSHOT_FILENAME_OPTIONS.map((option) => u("option", { value: option.value, children: option.label }, option.value))
              }
            )
          ] })
        ] })
      ] }),
u("div", { children: [
u("h3", { className: "text-xl font-semibold mb-4", children: "Modules" }),
u("div", { className: "space-y-4", children: [
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u("path", { d: "M10.052 17.706c.34.977 1.632 1.427 2.43.59c.164-.17.326-.355.436-.519c.32-.48.455-1.113.504-1.73c.05-.628.016-1.302-.048-1.912a18.348 18.348 0 0 0-.241-1.583l-.01-.052h.883a3 3 0 0 0 2.952-3.537l-.684-3.762a4.5 4.5 0 0 0-5.612-3.536l-5.6 1.527A2.5 2.5 0 0 0 3.27 5.114l-.353 1.765c-.278 1.389.784 2.558 1.913 3.005c.323.127.614.289.84.49c1.707 1.513 2.325 2.723 3.385 4.849c.354.71.718 1.676.998 2.482Zm1.965-5.585v.002l.002.007l.007.031a14.204 14.204 0 0 1 .126.583c.076.39.167.92.227 1.496c.061.577.09 1.184.046 1.728c-.044.555-.16.985-.34 1.254c-.059.09-.171.222-.326.383c-.199.209-.628.16-.762-.227c-.283-.814-.664-1.83-1.048-2.601c-1.067-2.14-1.756-3.501-3.616-5.151a3.83 3.83 0 0 0-1.136-.672c-.88-.348-1.447-1.149-1.3-1.879l.352-1.765a1.5 1.5 0 0 1 1.077-1.153l5.6-1.527a3.5 3.5 0 0 1 4.364 2.75l.684 3.762a2 2 0 0 1-1.968 2.358h-1.505a.5.5 0 0 0-.484.621Z" })
                }
              ),
u("label", { className: "text-xl", children: "Return Dislike" })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: returnDislike,
                onChange: (e) => handleReturnDislikeToggle(
                  e.target.checked
                )
              }
            )
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u("path", { d: "M16.5 6.671c.116 0 .223.04.308.107l.067.063l.017.02a5 5 0 0 1-3.675 8.135L13 15H7a5.07 5.07 0 0 1-.303-.009l1.657 1.655a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057l-2.5-2.5a.5.5 0 0 1-.057-.638l.057-.07l2.5-2.5a.5.5 0 0 1 .765.638l-.057.07l-1.637 1.636l.14.008L7 14h6a4 4 0 0 0 3.11-6.516a.5.5 0 0 1 .39-.812Zm-4.854-4.025a.5.5 0 0 1 .638-.057l.07.057l2.5 2.5l.057.07a.5.5 0 0 1 0 .568l-.057.07l-2.5 2.5l-.07.057a.5.5 0 0 1-.568 0l-.07-.057l-.057-.07a.5.5 0 0 1 0-.568l.057-.07l1.637-1.636l-.14-.008L13 6H7a4 4 0 0 0-3.105 6.522a.5.5 0 1 1-.801.601a5 5 0 0 1 3.689-8.119L7 5h6c.102 0 .203.003.303.009l-1.657-1.655l-.057-.07a.5.5 0 0 1 .057-.638Z" })
                }
              ),
u("label", { className: "text-xl", children: "Loop Video" }),
u("div", { className: "flex gap-1 ml-2", children: [
u("kbd", { className: "kbd", children: "alt" }),
u("span", { children: "+" }),
u("kbd", { className: "kbd", children: "L" })
              ] })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: loopVideo,
                onChange: (e) => handleLoopVideoToggle(e.target.checked)
              }
            )
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u("path", { d: "M5.5 10a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9Zm-.896-6.396l-.897.896H5.25A2.75 2.75 0 0 1 8 7.25v.25a.5.5 0 0 1-1 0v-.25A1.75 1.75 0 0 0 5.25 5.5H3.707l.897.896a.5.5 0 1 1-.708.708L2.144 5.35a.498.498 0 0 1 .002-.705l1.75-1.75a.5.5 0 1 1 .708.708ZM3 10.4c.317.162.651.294 1 .393V14c0 .373.102.722.28 1.02l4.669-4.588a1.5 1.5 0 0 1 2.102 0l4.67 4.588A1.99 1.99 0 0 0 16 14V6a2 2 0 0 0-2-2h-3.207a5.466 5.466 0 0 0-.393-1H14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.6Zm11-2.9a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Zm-1 0a.5.5 0 1 0-1 0a.5.5 0 0 0 1 0Zm-8.012 8.226A1.99 1.99 0 0 0 6 16h8c.37 0 .715-.1 1.012-.274l-4.662-4.58a.5.5 0 0 0-.7 0l-4.662 4.58Z" })
                }
              ),
u("label", { className: "text-xl", children: "Download Thumbnail" }),
u("div", { className: "flex gap-1 ml-2", children: [
u("kbd", { className: "kbd", children: "alt" }),
u("span", { children: "+" }),
u("kbd", { className: "kbd", children: "T" })
              ] })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: thumbnailDownload,
                onChange: (e) => handleThumbnailDownloadToggle(
                  e.target.checked
                )
              }
            )
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u("path", { d: "M17 6.125v2.91A3.529 3.529 0 0 0 16.5 9H16V6.125a.965.965 0 0 0-.289-.711l-2.125-2.125A.962.962 0 0 0 13 3.008V5.5a1.507 1.507 0 0 1-.922 1.383A1.327 1.327 0 0 1 11.5 7h-4a1.507 1.507 0 0 1-1.383-.922A1.327 1.327 0 0 1 6 5.5V3H5a.972.972 0 0 0-.703.289a1.081 1.081 0 0 0-.219.32A.856.856 0 0 0 4 4v10a.972.972 0 0 0 .078.391c.052.118.123.226.211.32a.854.854 0 0 0 .313.211c.127.049.262.075.398.078v-4.5a1.507 1.507 0 0 1 .922-1.383c.181-.082.379-.122.578-.117h5.992a3.489 3.489 0 0 0-2.442 1H6.5a.505.505 0 0 0-.5.5V15h3v1H5a1.884 1.884 0 0 1-.758-.156a2.2 2.2 0 0 1-.64-.422A1.9 1.9 0 0 1 3 14.039V4c-.001-.26.052-.519.156-.758a2.2 2.2 0 0 1 .422-.642a1.9 1.9 0 0 1 .622-.436c.24-.105.499-.16.761-.164h7.914c.262 0 .523.05.766.148c.244.099.465.248.648.438l2.125 2.125c.186.185.332.405.43.648c.099.244.152.503.156.766ZM7 3v2.5a.505.505 0 0 0 .5.5h4a.505.505 0 0 0 .5-.5V3H7Zm3 9.5a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v4c0 .51-.152.983-.414 1.379l-3.025-3.025a1.5 1.5 0 0 0-2.122 0l-3.025 3.025A2.488 2.488 0 0 1 10 16.5v-4Zm7 .25a.75.75 0 1 0-1.5 0a.75.75 0 0 0 1.5 0Zm-5.879 5.836c.396.262.87.414 1.379.414h4c.51 0 .983-.152 1.379-.414l-3.025-3.025a.5.5 0 0 0-.708 0l-3.025 3.025Z" })
                }
              ),
u("label", { className: "text-xl", children: "Download Screenshot" }),
u("div", { className: "flex gap-1 ml-2", children: [
u("kbd", { className: "kbd", children: "alt" }),
u("span", { children: "+" }),
u("kbd", { className: "kbd", children: "S" })
              ] })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: screenshotDownload,
                onChange: (e) => handleScreenshotDownloadToggle(
                  e.target.checked
                )
              }
            )
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u("path", { d: "M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5V9h-1V4.5a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h3.535c.051.353.154.69.302 1H5.5A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585ZM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm1.5 9.5a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v4c0 .51-.152.983-.414 1.379l-3.025-3.025a1.5 1.5 0 0 0-2.122 0l-3.025 3.025A2.488 2.488 0 0 1 10 16.5v-4Zm7 .25a.75.75 0 1 0-1.5 0a.75.75 0 0 0 1.5 0Zm-5.879 5.836c.396.262.87.414 1.379.414h4c.51 0 .983-.152 1.379-.414l-3.025-3.025a.5.5 0 0 0-.708 0l-3.025 3.025Z" })
                }
              ),
u("label", { className: "text-xl", children: "Copy Screenshot" }),
u("div", { className: "flex gap-1 ml-2", children: [
u("kbd", { className: "kbd", children: "alt" }),
u("span", { children: "+" }),
u("kbd", { className: "kbd", children: "C" })
              ] })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: screenshotCopy,
                onChange: (e) => handleScreenshotCopyToggle(
                  e.target.checked
                )
              }
            )
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M2.854 2.146a.5.5 0 1 0-.708.708l.739.738A2.495 2.495 0 0 0 2 5.5v9A2.5 2.5 0 0 0 4.5 17h11c.241 0 .474-.034.695-.098l.951.952a.5.5 0 0 0 .708-.708l-15-15ZM15.293 16H4.5A1.5 1.5 0 0 1 3 14.5v-9c0-.489.234-.923.596-1.197L8 8.707v3.943a.5.5 0 0 0 .776.417l2.156-1.428L15.292 16ZM9.918 7.797l2.716 2.716l.142-.095a.5.5 0 0 0-.01-.84l-2.848-1.78ZM17 14.5c0 .117-.013.23-.039.34l.777.776A2.49 2.49 0 0 0 18 14.5v-9A2.5 2.5 0 0 0 15.5 3H5.121l1 1H15.5A1.5 1.5 0 0 1 17 5.5v9Z"
                    }
                  )
                }
              ),
u("label", { className: "text-xl", children: "Hide Resume Progress Bar" })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: hideProgressBar,
                onChange: (e) => handleHideProgressBarToggle(
                  e.target.checked
                )
              }
            )
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u("path", { fill: "currentColor", d: "M4.5 13h11a.5.5 0 0 0 .416-.777L13.101 8l2.815-4.223A.5.5 0 0 0 15.5 3H4a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 1 0V13Zm0-1V4h10.066l-2.482 3.723a.5.5 0 0 0 0 .554L14.566 12H4.5Z" })
                }
              ),
u("label", { className: "text-xl", children: "Country Flags" })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: countryFlags,
                onChange: (e) => handleCountryFlagsToggle(
                  e.target.checked
                )
              }
            )
          ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-3", children: [
u(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-6 h-6",
                  children: u(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M8.646 4.147a.5.5 0 0 1 .707-.001l5.484 5.465a.55.55 0 0 1 0 .779l-5.484 5.465a.5.5 0 0 1-.706-.708L13.812 10L8.647 4.854a.5.5 0 0 1-.001-.707Zm-4 0a.5.5 0 0 1 .707-.001l5.484 5.465a.55.55 0 0 1 0 .779l-5.484 5.465a.5.5 0 0 1-.706-.708L9.812 10L4.647 4.854a.5.5 0 0 1-.001-.707Z"
                    }
                  )
                }
              ),
u("label", { className: "text-xl", children: "Cobalt Instances" })
            ] }),
u(
              "input",
              {
                type: "checkbox",
                className: "toggle toggle-primary",
                checked: cobaltEnabled,
                onChange: (e) => handleCobaltEnabledToggle(
                  e.target.checked
                )
              }
            )
          ] }) }),
          cobaltEnabled && u(preact.Fragment, { children: [
u("div", { className: "bg-base rounded-lg px-4 pt-4", children: [
u("label", { className: "text-xl font-medium mb-3 block", children: "Instance URL" }),
u("div", { className: "join w-full", children: [
u(
                  "input",
                  {
                    type: "text",
                    className: "input input-bordered join-item flex-1 text-xl",
                    value: cobaltInstanceUrl,
                    onChange: (e) => setCobaltInstanceUrl(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        handleCobaltInstanceUrlChange(cobaltInstanceUrl);
                      }
                    },
                    placeholder: COBALT_DEFAULTS.INSTANCE_URL
                  }
                ),
u(
                  "button",
                  {
                    className: `btn join-item ${cobaltUrlApplied ? "btn-success" : "btn-neutral"}`,
                    onClick: () => handleCobaltInstanceUrlChange(cobaltInstanceUrl),
                    children: cobaltUrlApplied ? u(IconCheck, { className: "size-[1.8em]" }) : "Apply"
                  }
                )
              ] })
            ] }),
u("div", { className: "bg-base rounded-lg px-4 pt-4", children: [
u("label", { className: "text-xl font-medium block mb-3", children: "Filename Style" }),
u(
                "select",
                {
                  className: "select select-bordered w-full text-xl",
                  value: cobaltFilenameStyle,
                  onChange: (e) => handleCobaltFilenameStyleChange(
                    e.target.value
                  ),
                  children: FILENAME_STYLES.map((style) => u("option", { value: style.value, children: style.label }, style.value))
                }
              )
            ] }),
u("div", { className: "bg-base rounded-lg px-4 pt-4", children: [
u("label", { className: "text-xl font-medium block mb-3", children: "Preferred Dub Language" }),
u(
                "select",
                {
                  className: "select select-bordered w-full text-xl",
                  value: cobaltPreferredDubLang,
                  onChange: (e) => handleCobaltPreferredDubLangChange(
                    e.target.value
                  ),
                  children: DUB_LANGUAGE_OPTIONS.map((lang) => u("option", { value: lang.value, children: lang.label }, lang.value))
                }
              )
            ] }),
u("div", { className: "bg-base rounded-lg px-4 pt-4", children: u("div", { className: "flex items-center justify-between", children: [
u("label", { className: "text-xl font-medium block", children: "Debug Mode" }),
u(
                "input",
                {
                  type: "checkbox",
                  className: "toggle toggle-primary",
                  checked: cobaltDebug,
                  onChange: (e) => handleCobaltDebugToggle(
                    e.target.checked
                  )
                }
              )
            ] }) })
          ] })
        ] })
      ] }),
u("div", { children: [
u("h3", { className: "text-xl font-semibold mb-4", children: "Reset & Cleanup" }),
u("div", { className: "flex gap-3", children: [
u(
            "button",
            {
              className: "btn btn-error btn-lg",
              onClick: () => setShowResetDialog(true),
              children: "Reset Settings"
            }
          ),
u(
            "button",
            {
              className: "btn btn-warning btn-lg",
              onClick: () => setShowClearCacheDialog(true),
              children: "Clear Cache"
            }
          )
        ] })
      ] }),
      showResetDialog && u("dialog", { ref: resetDialogRef, className: "modal", children: [
u("div", { className: "modal-box max-w-xl", children: [
u("h3", { className: "font-semibold text-xl", children: "Reset to Default?" }),
u("p", { className: "py-4 text-xl", children: "This will reset all settings to their default values:" }),
u("ul", { className: "list-disc list-inside space-y-2 text-lg opacity-80 mb-4", children: [
u("li", { children: "Theme → Light" }),
u("li", { children: "Panel width → 350px" }),
u("li", { children: "Pagination → 8 items per page" }),
u("li", { children: "DDL video quality → 1080p" }),
u("li", { children: "DDL audio bitrate → 128kbps" }),
u("li", { children: "Cobalt settings → Default instance & disabled" }),
u("li", { children: "Module settings → Loop video, Return dislike, etc." }),
u("li", { children: "Screenshot settings → Format & filename" })
          ] }),
u("p", { className: "text-lg opacity-60", children: "This action cannot be undone." }),
u("div", { className: "modal-action", children: [
u("form", { method: "dialog", children: u(
              "button",
              {
                className: "btn btn-lg btn-ghost mr-2",
                onClick: () => {
                  resetDialogRef.current?.close();
                  setShowResetDialog(false);
                },
                children: "Cancel"
              }
            ) }),
u(
              "button",
              {
                className: "btn btn-lg btn-error",
                onClick: handleResetDefaults,
                children: "Reset"
              }
            )
          ] })
        ] }),
u("form", { method: "dialog", className: "modal-backdrop", children: u(
          "button",
          {
            onClick: () => {
              resetDialogRef.current?.close();
              setShowResetDialog(false);
            },
            children: "close"
          }
        ) })
      ] }),
      showClearCacheDialog && u("dialog", { ref: clearCacheDialogRef, className: "modal", children: [
u("div", { className: "modal-box max-w-xl", children: [
u("h3", { className: "font-semibold text-xl", children: "Clear Cache?" }),
u("p", { className: "py-4 text-xl", children: "This will clear all cached data:" }),
u("ul", { className: "list-disc list-inside space-y-2 text-lg opacity-80 mb-4", children: u("li", { children: "Recent Videos (up to 5 videos, shared across DDL & Cobalt)" }) }),
u("p", { className: "text-lg opacity-60", children: "This action cannot be undone." }),
u("div", { className: "modal-action", children: [
u("form", { method: "dialog", children: u(
              "button",
              {
                className: "btn btn-lg btn-ghost mr-2",
                onClick: () => {
                  clearCacheDialogRef.current?.close();
                  setShowClearCacheDialog(false);
                },
                children: "Cancel"
              }
            ) }),
u(
              "button",
              {
                className: "btn btn-lg btn-warning",
                onClick: handleClearCache,
                children: "Clear Cache"
              }
            )
          ] })
        ] }),
u("form", { method: "dialog", className: "modal-backdrop", children: u(
          "button",
          {
            onClick: () => {
              clearCacheDialogRef.current?.close();
              setShowClearCacheDialog(false);
            },
            children: "close"
          }
        ) })
      ] }),
u("div", { children: [
u("h3", { className: "text-xl font-semibold mb-4", children: "About" }),
u("div", { className: "bg-base-200 rounded-lg p-4 space-y-3 text-lg", children: [
u("p", { className: "opacity-60", children: "A feature-rich and high-performance YouTube userscript, built on the InnerTube API — delivering advanced analytics, live stats, smart bookmarking, and seamless video/audio downloading without leaving YouTube." }),
u("div", { className: "flex gap-4 pt-2", children: [
u(
              "a",
              {
                href: "https://exyezed.cc",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity",
                children: [
u(IconWorld, { size: 18 }),
u("span", { children: "Home" })
                ]
              }
            ),
u(
              "a",
              {
                href: "https://github.com/exyezed/tube-insights",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity",
                children: [
u(IconBrandGithub, { size: 18 }),
u("span", { children: "GitHub" })
                ]
              }
            ),
u(
              "a",
              {
                href: "https://github.com/exyezed/tube-insights/issues",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity",
                children: [
u(IconBug, { size: 18 }),
u("span", { children: "Report an Issue" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] });
  }
  const version = "1.0.7";
  const pkg = {
    version
  };
  function SidePanel() {
    return u(preact.Fragment, { children: u(
      "div",
      {
        className: `bg-base-100 shadow-xl ${isPanelVisible.value ? "" : "hidden"}`,
        style: {
          width: `${panelWidth.value}px`,
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          zIndex: 9999,
          transition: "transform 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          transform: isPanelVisible.value ? "translateX(0)" : "translateX(100%)"
        },
        children: [
u(FloatingButton, {}),
u("div", { className: "px-6 py-4 border-b border-base-300", children: u("div", { className: "flex items-center justify-between gap-3", children: [
u("div", { className: "flex items-center gap-3", children: [
u(IconBrandYoutubeFilled, { size: 32, className: "text-error" }),
u("h1", { className: "text-2xl font-semibold", children: "TubeInsights" }),
u("span", { className: "badge badge-warning badge-lg", children: [
                "v",
                pkg.version
              ] })
            ] }),
u(
              "button",
              {
                className: "opacity-60 hover:opacity-100 hover:text-primary transition-all cursor-pointer",
                onClick: () => setActiveTab("settings"),
                children: u(IconSettings, { size: 20 })
              }
            )
          ] }) }),
u(
            "div",
            {
              role: "tablist",
              className: "tabs tabs-border bg-base-200 text-xl h-14",
              children: [
u(
                  "button",
                  {
                    role: "tab",
                    className: `tab text-xl h-14 ${activeTab.value === "insights" ? "tab-active" : ""}`,
                    onClick: () => setActiveTab("insights"),
                    children: "Insights"
                  }
                ),
u(
                  "button",
                  {
                    role: "tab",
                    className: `tab text-xl h-14 ${activeTab.value === "livecount" ? "tab-active" : ""}`,
                    onClick: () => setActiveTab("livecount"),
                    children: "Live Count"
                  }
                ),
u(
                  "button",
                  {
                    role: "tab",
                    className: `tab text-xl h-14 ${activeTab.value === "bookmark" ? "tab-active" : ""}`,
                    onClick: () => setActiveTab("bookmark"),
                    children: "Bookmark"
                  }
                ),
u(
                  "button",
                  {
                    role: "tab",
                    className: `tab text-xl h-14 ${activeTab.value === "ddl" ? "tab-active" : ""}`,
                    onClick: () => setActiveTab("ddl"),
                    children: "DDL"
                  }
                )
              ]
            }
          ),
u(
            "div",
            {
              className: "flex-1 overflow-y-auto pt-4 pb-6",
              style: { position: "relative" },
              children: [
u(
                  "div",
                  {
                    className: "px-6",
                    style: {
                      display: activeTab.value === "insights" ? "block" : "none"
                    },
                    children: u(InsightsTab, {})
                  }
                ),
u(
                  "div",
                  {
                    className: "px-6",
                    style: {
                      display: activeTab.value === "livecount" ? "block" : "none"
                    },
                    children: u(LiveCountTab, {})
                  }
                ),
u(
                  "div",
                  {
                    className: "px-6",
                    style: {
                      display: activeTab.value === "bookmark" ? "block" : "none"
                    },
                    children: u(BookmarkTab, {})
                  }
                ),
u(
                  "div",
                  {
                    className: "px-6",
                    style: {
                      display: activeTab.value === "ddl" ? "block" : "none"
                    },
                    children: cobaltSettings.value.enabled ? u(CobaltTab, {}) : u(DDLTab, {})
                  }
                ),
u(
                  "div",
                  {
                    className: "px-6",
                    style: {
                      display: activeTab.value === "settings" ? "block" : "none"
                    },
                    children: u(SettingsTab, {})
                  }
                )
              ]
            }
          )
        ]
      }
    ) });
  }
  const ACCESS_KEY = "OFltSHRBdk1HeDFVaEVhNQ==";
  const SECRET_KEY = "NElLVEJTb05WSEdleEdOWg==";
  async function saveToWayback(url) {
    return new Promise((resolve) => {
      try {
        const accessKey = atob(ACCESS_KEY);
        const secretKey = atob(SECRET_KEY);
        const saveUrl = `https://web.archive.org/save/${url}`;
        if (typeof GM_xmlhttpRequest === "undefined") {
          console.warn(
            "[Wayback] GM_xmlhttpRequest not available, opening in new tab"
          );
          window.open(saveUrl, "_blank");
          resolve(true);
          return;
        }
        GM_xmlhttpRequest({
          method: "GET",
          url: saveUrl,
          headers: {
            Authorization: `LOW ${accessKey}:${secretKey}`
          },
          onload: (response) => {
            if (response.status >= 200 && response.status < 300) {
              console.log(`[Wayback] Successfully saved: ${url}`);
              resolve(true);
            } else {
              console.warn(`[Wayback] Failed to save: ${url}`, response.status);
              resolve(false);
            }
          },
          onerror: (error) => {
            console.error(`[Wayback] Error saving ${url}:`, error);
            resolve(false);
          },
          ontimeout: () => {
            console.warn(`[Wayback] Timeout saving ${url}`);
            resolve(false);
          }
        });
      } catch (error) {
        console.error(`[Wayback] Error saving ${url}:`, error);
        resolve(false);
      }
    });
  }
  async function saveChannelToWayback(channelId, customUrl) {
    const channelIdUrl = `https://www.youtube.com/channel/${channelId}`;
    const handleUrl = `https://www.youtube.com/${customUrl}`;
    Promise.all([saveToWayback(channelIdUrl), saveToWayback(handleUrl)]).catch(
      (error) => {
        console.error("[Wayback] Error saving channel:", error);
      }
    );
  }
  async function snapshotChannel(channelId, customUrl) {
    try {
      const channelIdUrl = `https://www.youtube.com/channel/${channelId}`;
      const handleUrl = `https://www.youtube.com/${customUrl}`;
      const [result1, result2] = await Promise.all([
        saveToWayback(channelIdUrl),
        saveToWayback(handleUrl)
      ]);
      if (result1 && result2) {
        return { success: true, message: "Snapshot created successfully!" };
      } else if (result1 || result2) {
        return { success: true, message: "Partial snapshot created" };
      } else {
        return { success: false, message: "Failed to create snapshot" };
      }
    } catch (error) {
      console.error("[Wayback] Error creating snapshot:", error);
      return { success: false, message: "Error creating snapshot" };
    }
  }
  function SaveChannelDialog({
    channelId,
    title,
    customUrl,
    thumbnailUrl,
    country,
    subscriberCount,
    videoCount,
    viewCount,
    isOpen,
    onSaved
  }) {
    const [category, setCategory] = hooks.useState("");
    const [existingCategories, setExistingCategories] = hooks.useState([]);
    const [showSavedFeedback, setShowSavedFeedback] = hooks.useState(false);
    const [errorMessage, setErrorMessage] = hooks.useState("");
    const dialogRef = hooks.useRef(null);
    hooks.useEffect(() => {
      loadCategories();
    }, []);
    hooks.useEffect(() => {
      if (isOpen && dialogRef.current) {
        dialogRef.current.showModal();
      }
    }, [isOpen]);
    const loadCategories = async () => {
      const categories = await bookmarkDB.getCategories();
      setExistingCategories(categories);
    };
    const handleSave = async () => {
      if (!category.trim()) {
        playErrorSound();
        setErrorMessage("Please enter a category");
        setTimeout(() => setErrorMessage(""), 1e3);
        return;
      }
      await bookmarkDB.addChannel({
        channelId,
        title,
        customUrl,
        thumbnailUrl,
        country,
        subscriberCount,
        videoCount,
        viewCount,
        category: category.trim(),
        bookmarkedAt: Date.now()
      });
      saveChannelToWayback(channelId, customUrl);
      setShowSavedFeedback(true);
      setTimeout(() => {
        setShowSavedFeedback(false);
        if (dialogRef.current) {
          dialogRef.current.close();
        }
        setCategory("");
        closeSaveChannelDialog();
        onSaved?.();
      }, 500);
    };
    return u("dialog", { ref: dialogRef, id: "save_channel_dialog", className: "modal", children: [
u("div", { className: "modal-box max-w-xl", children: [
u("h3", { className: "font-semibold text-xl mb-4", children: "Save Channel to Bookmarks" }),
        errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft mb-4", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
        ] }),
u("div", { className: "space-y-4", children: u("div", { children: [
u("label", { className: "label", children: u("span", { className: "label-text text-xl", children: "Category" }) }),
u(
            "input",
            {
              type: "text",
              placeholder: "Enter category name",
              className: "input input-lg input-bordered w-full",
              value: category,
              onInput: (e) => setCategory(e.target.value)
            }
          ),
          existingCategories.length > 0 && u(
            "select",
            {
              className: "select select-lg select-bordered w-full mt-4",
              onChange: (e) => setCategory(e.target.value),
              value: "",
              children: [
u("option", { value: "", disabled: true, children: "Or select existing category" }),
                existingCategories.map((cat) => u("option", { value: cat.category, children: [
                  cat.category,
                  " (",
                  cat.count,
                  ")"
                ] }, cat.category))
              ]
            }
          )
        ] }) }),
u("div", { className: "modal-action", children: [
u("form", { method: "dialog", children: u(
            "button",
            {
              className: "btn btn-lg btn-ghost mr-2",
              onClick: closeSaveChannelDialog,
              disabled: showSavedFeedback,
              children: "Cancel"
            }
          ) }),
u(
            "button",
            {
              className: "btn btn-lg btn-primary",
              onClick: handleSave,
              disabled: showSavedFeedback,
              children: showSavedFeedback ? "✓ Saved!" : "Save"
            }
          )
        ] })
      ] }),
u("form", { method: "dialog", className: "modal-backdrop", children: u("button", { onClick: closeSaveChannelDialog, children: "close" }) })
    ] });
  }
  function BookmarkDialogs({ onDataChange }) {
    const deleteDialogRef = hooks.useRef(null);
    const clearDialogRef = hooks.useRef(null);
    const detailDialogRef = hooks.useRef(null);
    const [isSnapshotting, setIsSnapshotting] = hooks.useState(false);
    const [snapshotMessage, setSnapshotMessage] = hooks.useState("");
    hooks.useEffect(() => {
      if (deleteChannelDialogData.value?.isOpen && deleteDialogRef.current) {
        deleteDialogRef.current.showModal();
      }
    }, [deleteChannelDialogData.value]);
    hooks.useEffect(() => {
      if (clearAllDialogOpen.value && clearDialogRef.current) {
        clearDialogRef.current.showModal();
      }
    }, [clearAllDialogOpen.value]);
    hooks.useEffect(() => {
      if (detailChannelDialogData.value?.isOpen && detailDialogRef.current) {
        detailDialogRef.current.showModal();
      }
    }, [detailChannelDialogData.value]);
    const handleDelete = async () => {
      if (!deleteChannelDialogData.value?.channelId) return;
      await bookmarkDB.deleteChannel(deleteChannelDialogData.value.channelId);
      deleteDialogRef.current?.close();
      closeDeleteChannelDialog();
      onDataChange();
    };
    const handleClearAll = async () => {
      await bookmarkDB.clearAll();
      clearDialogRef.current?.close();
      closeClearAllDialog();
      onDataChange();
    };
    const calculateAge = (timestamp) => {
      const now = Date.now();
      const diff = now - timestamp;
      const seconds = Math.floor(diff / 1e3);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);
      const parts = [];
      if (years > 0) parts.push(`${years} yr`);
      if (months % 12 > 0) parts.push(`${months % 12} mo`);
      if (parts.length === 0 && days > 0)
        parts.push(`${days} day${days > 1 ? "s" : ""}`);
      if (parts.length === 0 && hours > 0)
        parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
      if (parts.length === 0 && minutes > 0)
        parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
      if (parts.length === 0 && seconds > 0)
        parts.push(`${seconds} sec${seconds > 1 ? "s" : ""}`);
      return parts.length > 0 ? `${parts.join(" ")} ago` : "Just now";
    };
    const formatBookmarkDate = (timestamp) => {
      const date = new Date(timestamp);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${month} ${day}, ${year} • ${hours}:${minutes}:${seconds}`;
    };
    const handleSnapshot = async () => {
      if (!detailChannel || isSnapshotting) return;
      setIsSnapshotting(true);
      setSnapshotMessage("Creating snapshot...");
      const result = await snapshotChannel(
        detailChannel.channelId,
        detailChannel.customUrl
      );
      setSnapshotMessage(result.message);
      setIsSnapshotting(false);
      setTimeout(() => {
        setSnapshotMessage("");
      }, 3e3);
    };
    const detailChannel = detailChannelDialogData.value?.channel;
    return u(preact.Fragment, { children: [
      deleteChannelDialogData.value && u("dialog", { ref: deleteDialogRef, className: "modal", children: [
u("div", { className: "modal-box max-w-xl", children: [
u("h3", { className: "font-semibold text-xl", children: "Confirm Delete" }),
u("p", { className: "py-4 text-xl", children: "Are you sure you want to delete this channel from bookmarks?" }),
u("div", { className: "modal-action", children: [
u("form", { method: "dialog", children: u(
              "button",
              {
                className: "btn btn-lg btn-ghost mr-2",
                onClick: closeDeleteChannelDialog,
                children: "Cancel"
              }
            ) }),
u("button", { className: "btn btn-lg btn-error", onClick: handleDelete, children: "Delete" })
          ] })
        ] }),
u("form", { method: "dialog", className: "modal-backdrop", children: u("button", { onClick: closeDeleteChannelDialog, children: "close" }) })
      ] }),
      clearAllDialogOpen.value && u("dialog", { ref: clearDialogRef, className: "modal", children: [
u("div", { className: "modal-box max-w-xl", children: [
u("h3", { className: "font-semibold text-xl", children: "Confirm Clear All" }),
u("p", { className: "py-4 text-xl", children: "Are you sure you want to delete ALL bookmarked channels? This action cannot be undone." }),
u("div", { className: "modal-action", children: [
u("form", { method: "dialog", children: u(
              "button",
              {
                className: "btn btn-lg btn-ghost mr-2",
                onClick: closeClearAllDialog,
                children: "Cancel"
              }
            ) }),
u("button", { className: "btn btn-lg btn-error", onClick: handleClearAll, children: "Clear All" })
          ] })
        ] }),
u("form", { method: "dialog", className: "modal-backdrop", children: u("button", { onClick: closeClearAllDialog, children: "close" }) })
      ] }),
      detailChannel && u("dialog", { ref: detailDialogRef, className: "modal", children: [
u("div", { className: "modal-box max-w-2xl", children: [
u("form", { method: "dialog", children: u(
            "button",
            {
              className: "btn btn-circle btn-ghost absolute right-2 top-2 text-xl",
              onClick: closeDetailChannelDialog,
              children: "✕"
            }
          ) }),
u("h3", { className: "font-semibold text-xl mb-4", children: detailChannel.title }),
u("div", { className: "space-y-4", children: [
            snapshotMessage && u(
              "div",
              {
                role: "alert",
                className: `alert alert-soft ${snapshotMessage.includes("success") ? "alert-success" : snapshotMessage.includes("Creating") ? "alert-info" : "alert-warning"}`,
                children: u("div", { className: "flex flex-col gap-1", children: [
u("span", { className: "text-xl font-semibold", children: snapshotMessage }),
                  snapshotMessage.includes("Creating") && u("span", { className: "text-lg opacity-70", children: "You can close this dialog, the process runs in the background" })
                ] })
              }
            ),
u("div", { className: "flex items-center gap-3", children: [
u("div", { className: "avatar", children: u("div", { className: "w-16 rounded-full", children: u(
                "img",
                {
                  src: detailChannel.thumbnailUrl,
                  alt: detailChannel.title
                }
              ) }) }),
u("div", { className: "flex-1", children: [
u("div", { className: "flex items-center gap-2", children: [
u(
                    "a",
                    {
                      href: `https://www.youtube.com/${detailChannel.customUrl}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "text-primary text-xl hover:underline",
                      children: detailChannel.customUrl
                    }
                  ),
u(
                    "a",
                    {
                      href: `https://web.archive.org/web/*/https://www.youtube.com/${detailChannel.customUrl}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      children: u(IconBuildingBank, { className: "size-5 hover:text-primary" })
                    }
                  )
                ] }),
u("div", { className: "flex items-center gap-2", children: [
u(
                    "a",
                    {
                      href: `https://www.youtube.com/channel/${detailChannel.channelId}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "text-secondary text-xl font-mono hover:underline block",
                      children: detailChannel.channelId
                    }
                  ),
u(
                    "a",
                    {
                      href: `https://web.archive.org/web/*/https://www.youtube.com/channel/${detailChannel.channelId}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      children: u(IconBuildingBank, { className: "size-5 hover:text-secondary" })
                    }
                  )
                ] })
              ] }),
u(
                "button",
                {
                  onClick: handleSnapshot,
                  className: "btn btn-accent btn-square tooltip tooltip-left",
                  "data-tip": "Create new snapshot",
                  disabled: isSnapshotting,
                  children: isSnapshotting ? u("span", { className: "loading loading-spinner loading-md" }) : u(IconCamera, { className: "size-[1.8em]" })
                }
              ),
u(
                "a",
                {
                  href: `https://tubeinsights.exyezed.cc/info/direct/channel/${detailChannel.channelId}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "btn btn-secondary btn-square",
                  children: u(IconInfoCircle, { className: "size-[1.8em]" })
                }
              )
            ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "text-xl opacity-60 mb-2", children: "Country" }),
u("div", { className: "flex items-center gap-3", children: [
                detailChannel.country && u(
                  CountryFlag,
                  {
                    countryCode: detailChannel.country,
                    size: "md"
                  }
                ),
u("span", { className: "text-xl", children: detailChannel.country ? countryNames[detailChannel.country] || detailChannel.country : "-" })
              ] })
            ] }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-2 text-xl opacity-60", children: [
u(IconUsers, { className: "size-[1.2em]" }),
                "Subscribers"
              ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-primary", children: formatNumber(parseInt(detailChannel.subscriberCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(detailChannel.subscriberCount).toLocaleString() })
              ] })
            ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-2 text-xl opacity-60", children: [
u(IconVideo, { className: "size-[1.2em]" }),
                "Total Videos"
              ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-secondary", children: formatNumber(parseInt(detailChannel.videoCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(detailChannel.videoCount).toLocaleString() })
              ] })
            ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: u("div", { className: "flex items-center justify-between", children: [
u("div", { className: "flex items-center gap-2 text-xl opacity-60", children: [
u(IconEye, { className: "size-[1.2em]" }),
                "Total Views"
              ] }),
u("div", { className: "text-right", children: [
u("div", { className: "text-2xl font-semibold text-accent", children: formatNumber(parseInt(detailChannel.viewCount)) }),
u("div", { className: "text-xl opacity-60", children: parseInt(detailChannel.viewCount).toLocaleString() })
              ] })
            ] }) }),
u("div", { className: "bg-base-200 rounded-lg p-4", children: [
u("div", { className: "flex items-center gap-2 text-xl opacity-60 mb-2", children: [
u(IconBookmark, { className: "size-[1.2em]" }),
                "Bookmarked At"
              ] }),
u("div", { className: "text-xl", children: [
u("span", { className: "text-primary", children: formatBookmarkDate(detailChannel.bookmarkedAt) }),
u("span", { className: "text-secondary ml-2", children: [
                  "(",
                  calculateAge(detailChannel.bookmarkedAt),
                  ")"
                ] })
              ] })
            ] })
          ] })
        ] }),
u("form", { method: "dialog", className: "modal-backdrop", children: u("button", { onClick: closeDetailChannelDialog, children: "close" }) })
      ] })
    ] });
  }
  const languageToCountry = {
ab: "GE",
aa: "ET",
af: "ZA",
ak: "GH",
sq: "AL",
am: "ET",
ar: "SA",
hy: "AM",
as: "IN",
ay: "BO",
az: "AZ",

ba: "RU",
eu: "ES",
be: "BY",
bn: "BD",
bho: "IN",
bs: "BA",
br: "FR",
bg: "BG",
my: "MM",

ca: "ES",
ceb: "PH",
"zh-Hans": "CN",
"zh-Hant": "TW",
co: "FR",
hr: "HR",
cs: "CZ",

da: "DK",
dv: "MV",
nl: "NL",
dz: "BT",

en: "GB",
eo: "GB",
et: "EE",
ee: "GH",

fo: "FO",
fj: "FJ",
fil: "PH",
fi: "FI",
fr: "FR",

gaa: "GH",
gd: "GB",
gl: "ES",
ka: "GE",
de: "DE",
el: "GR",
gn: "PY",
gu: "IN",

ht: "HT",
ha: "NG",
haw: "US",
iw: "IL",
he: "IL",
hi: "IN",
hmn: "CN",
hu: "HU",

is: "IS",
ig: "NG",
id: "ID",
iu: "CA",
ga: "IE",
it: "IT",

ja: "JP",
jv: "ID",

kl: "GL",
kn: "IN",
kk: "KZ",
kha: "IN",
km: "KH",
rw: "RW",
ky: "KG",
rn: "BI",
ko: "KR",
kri: "SL",
ku: "IQ",

lo: "LA",
la: "VA",
lv: "LV",
ln: "CD",
lt: "LT",
lua: "CD",
lg: "UG",
luo: "KE",
lb: "LU",

mk: "MK",
mg: "MG",
ms: "MY",
ml: "IN",
mt: "MT",
gv: "IM",
mi: "NZ",
mr: "IN",
mn: "MN",
mfe: "MU",

ne: "NP",
new: "NP",
nso: "ZA",
no: "NO",
ny: "MW",

oc: "FR",
or: "IN",
om: "ET",
os: "GE",

pam: "PH",
pa: "IN",
ps: "AF",
fa: "IR",
pl: "PL",
pt: "BR",
"pt-PT": "PT",

qu: "PE",

ro: "RO",
ru: "RU",

sm: "WS",
sg: "CF",
sa: "IN",
sr: "RS",
crs: "SC",
sn: "ZW",
sd: "PK",
si: "LK",
sk: "SK",
sl: "SI",
so: "SO",
st: "LS",
es: "ES",
su: "ID",
sw: "KE",
ss: "SZ",
sv: "SE",

tg: "TJ",
ta: "IN",
tt: "RU",
te: "IN",
th: "TH",
bo: "CN",
ti: "ER",
to: "TO",
ts: "ZA",
tn: "BW",
tum: "MW",
tr: "TR",
tk: "TM",

ug: "CN",
uk: "UA",
ur: "PK",
uz: "UZ",

ve: "ZA",
vi: "VN",

war: "PH",
cy: "GB",
fy: "NL",
wo: "SN",

xh: "ZA",

yi: "IL",
yo: "NG",

zu: "ZA"
};
  function getCountryFromLanguage(languageCode) {
    if (languageToCountry[languageCode]) {
      return languageToCountry[languageCode];
    }
    if (languageCode.endsWith("_auto")) {
      const baseCode = languageCode.replace("_auto", "");
      if (languageToCountry[baseCode]) {
        return languageToCountry[baseCode];
      }
    }
    if (languageCode.endsWith("-auto")) {
      const baseCode = languageCode.replace("-auto", "");
      if (languageToCountry[baseCode]) {
        return languageToCountry[baseCode];
      }
    }
    return "GB";
  }
  function parseSubtitleXML(xml) {
    const cues = [];
    const textTagRegex = /<text\s+start="([^"]+)"\s+dur="([^"]+)"[^>]*>([\s\S]*?)<\/text>/gi;
    let match;
    while ((match = textTagRegex.exec(xml)) !== null) {
      const start = parseFloat(match[1] || "0");
      const duration = parseFloat(match[2] || "0");
      let text = match[3] || "";
      text = text.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
      text = decodeHTMLEntities(text.trim());
      cues.push({ start, duration, text });
    }
    return cues;
  }
  function decodeHTMLEntities(text) {
    const entities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&apos;": "'",
      "&nbsp;": " "
    };
    let decoded = text;
    for (const [entity, char] of Object.entries(entities)) {
      decoded = decoded.replace(new RegExp(entity, "g"), char);
    }
    decoded = decoded.replace(
      /&#(\d+);/g,
      (_, num) => String.fromCharCode(parseInt(num, 10))
    );
    decoded = decoded.replace(
      /&#x([0-9A-Fa-f]+);/g,
      (_, hex) => String.fromCharCode(parseInt(hex, 16))
    );
    return decoded;
  }
  function convertToSRT(cues) {
    let srt = "";
    cues.forEach((cue, index2) => {
      const startTime = formatSRTTime(cue.start);
      const endTime = formatSRTTime(cue.start + cue.duration);
      const text = cue.text.replace(/\n/g, " ").trim();
      srt += `${index2 + 1}
`;
      srt += `${startTime} --> ${endTime}
`;
      srt += `${text}

`;
    });
    return srt;
  }
  function formatSRTTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor(seconds % 1 * 1e3);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
  }
  function convertToTXT(cues) {
    return cues.map((cue) => cue.text.trim()).join("\n");
  }
  function SubtitleDialog() {
    const dialogRef = hooks.useRef(null);
    const [activeTab2, setActiveTab2] = hooks.useState("original");
    const [searchQuery, setSearchQuery] = hooks.useState("");
    const [downloadingIds, setDownloadingIds] = hooks.useState( new Set());
    const [successIds, setSuccessIds] = hooks.useState( new Set());
    const [errorMessage, setErrorMessage] = hooks.useState("");
    hooks.useEffect(() => {
      if (subtitleDialogData.value?.isOpen && dialogRef.current) {
        dialogRef.current.showModal();
        setActiveTab2("original");
        setSearchQuery("");
      }
    }, [subtitleDialogData.value]);
    if (!subtitleDialogData.value) return null;
    const { videoId, videoTitle, subtitles, autoTransSubtitles } = subtitleDialogData.value;
    const currentSubtitles = activeTab2 === "original" ? subtitles : autoTransSubtitles;
    const filteredSubtitles = currentSubtitles.filter(
      (sub) => sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const downloadSubtitle = async (url, filename, subtitleId, format) => {
      const sanitizedFilename = sanitizeFilename(filename);
      setDownloadingIds((prev) => new Set(prev).add(subtitleId));
      try {
        let xmlText;
        try {
          xmlText = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "text";
            xhr.onload = () => {
              if (xhr.status === 200) {
                if (xhr.responseText && xhr.responseText.length > 0) {
                  resolve(xhr.responseText);
                } else {
                  console.error("[Subtitle] Empty XHR body despite 200 OK");
                  console.error("[Subtitle] Try opening URL manually:", url);
                  reject(new Error("Empty XHR response"));
                }
              } else {
                reject(new Error(`XHR failed: ${xhr.status}`));
              }
            };
            xhr.onerror = () => reject(new Error("XHR network error"));
            xhr.send();
          });
        } catch (xhrError) {
          xmlText = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: "GET",
              url,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                Referer: "https://www.youtube.com/"
              },
              onload: (response) => {
                if (response.status !== 200) {
                  reject(new Error(`HTTP ${response.status}`));
                  return;
                }
                const text = response.responseText || response.response || "";
                if (!text || text.length === 0) {
                  console.error("[Subtitle] Empty GM response!");
                  reject(new Error("Empty response from YouTube"));
                  return;
                }
                resolve(text);
              },
              onerror: () => reject(new Error("GM network error")),
              ontimeout: () => reject(new Error("Request timeout"))
            });
          });
        }
        let content;
        if (format === "raw") {
          content = xmlText;
        } else {
          const cues = parseSubtitleXML(xmlText);
          if (format === "srt") {
            content = convertToSRT(cues);
          } else if (format === "txt") {
            content = convertToTXT(cues);
          } else {
            content = xmlText;
          }
        }
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = sanitizedFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        setDownloadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(subtitleId);
          return newSet;
        });
        setSuccessIds((prev) => new Set(prev).add(subtitleId));
        setTimeout(() => {
          setSuccessIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(subtitleId);
            return newSet;
          });
        }, 1500);
      } catch (error) {
        console.error("[Subtitle] Download error:", error);
        playErrorSound();
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to download subtitle"
        );
        setTimeout(() => setErrorMessage(""), 3e3);
        setDownloadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(subtitleId);
          return newSet;
        });
      }
    };
    const handleClose = () => {
      dialogRef.current?.close();
      closeSubtitleDialog();
    };
    return u("dialog", { ref: dialogRef, className: "modal", onClose: handleClose, children: [
u("div", { className: "modal-box w-11/12 max-w-2xl max-h-[80vh] flex flex-col p-0", children: [
u("div", { className: "flex items-center justify-between p-4 border-b border-base-300", children: [
u("h3", { className: "text-xl font-semibold", children: "Download Subtitles" }),
u("button", { className: "btn btn-ghost btn-circle", onClick: handleClose, children: u(IconX, { className: "size-6" }) })
        ] }),
u(
          "div",
          {
            role: "tablist",
            className: "tabs tabs-border bg-base-200 text-xl h-14",
            children: [
u(
                "button",
                {
                  role: "tab",
                  className: `tab text-xl h-14 cursor-pointer ${activeTab2 === "original" ? "tab-active" : ""}`,
                  onClick: () => setActiveTab2("original"),
                  children: [
                    "Original (",
                    subtitles.length,
                    ")"
                  ]
                }
              ),
u(
                "button",
                {
                  role: "tab",
                  className: `tab text-xl h-14 cursor-pointer ${activeTab2 === "auto" ? "tab-active" : ""}`,
                  onClick: () => setActiveTab2("auto"),
                  children: [
                    "Auto Translate (",
                    autoTransSubtitles.length,
                    ")"
                  ]
                }
              )
            ]
          }
        ),
u("div", { className: "p-4", children: u(
          "input",
          {
            type: "text",
            placeholder: "Search languages...",
            className: "input input-bordered input-lg w-full text-xl",
            value: searchQuery,
            onInput: (e) => setSearchQuery(e.target.value)
          }
        ) }),
        errorMessage && u("div", { role: "alert", className: "alert alert-error alert-soft mx-4", children: [
u(IconCircleX, { className: "size-6 shrink-0" }),
u("span", { className: "text-xl", children: errorMessage })
        ] }),
u("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: filteredSubtitles.length === 0 ? u("div", { className: "text-center py-8 text-xl opacity-60", children: searchQuery ? "No subtitles found" : "No subtitles available" }) : filteredSubtitles.map((sub) => {
          return u(
            "div",
            {
              className: "bg-base-200 rounded-lg p-4 flex items-center justify-between gap-3",
              children: [
u("div", { className: "flex items-center gap-3 flex-1", children: [
u(
                    CountryFlag,
                    {
                      countryCode: getCountryFromLanguage(sub.code),
                      size: "sm"
                    }
                  ),
u("span", { className: "text-xl font-medium", children: sub.name })
                ] }),
u("div", { className: "flex gap-2", children: ["srt", "txt", "raw"].map((format) => {
                  const subtitleId = `${activeTab2}-${sub.name}-${format}`;
                  const isDownloading = downloadingIds.has(subtitleId);
                  const isSuccess = successIds.has(subtitleId);
                  const buttonClass = format === "srt" ? "btn-primary" : format === "txt" ? "btn-secondary" : "btn-accent";
                  const fileExtension = format === "raw" ? "xml" : format;
                  return u(
                    "button",
                    {
                      className: `btn ${isSuccess ? "btn-success" : buttonClass}`,
                      onClick: () => downloadSubtitle(
                        sub.download[format],
                        `${videoTitle} - ${sub.name}.${fileExtension}`,
                        subtitleId,
                        format
                      ),
                      disabled: isDownloading || isSuccess,
                      children: isDownloading ? u("span", { className: "loading loading-spinner loading-md" }) : isSuccess ? u(IconCheck, { className: "size-[1.8em]" }) : u(preact.Fragment, { children: [
u(IconDownload, { className: "size-[1.8em]" }),
u("span", { children: format === "raw" ? "XML" : format.toUpperCase() })
                      ] })
                    },
                    format
                  );
                }) })
              ]
            },
            sub.name
          );
        }) })
      ] }),
u("form", { method: "dialog", className: "modal-backdrop", children: u("button", { onClick: handleClose, children: "close" }) })
    ] });
  }
  function App() {
    hooks.useEffect(() => {
      loadSettings();
    }, []);
    const handleBookmarkDataChange = () => {
      window.dispatchEvent(new CustomEvent("bookmark-updated"));
    };
    return u("div", { "data-theme": currentTheme.value, children: [
u(SidePanel, {}),
      saveChannelDialogData.value && u(
        SaveChannelDialog,
        {
          channelId: saveChannelDialogData.value.channelId,
          title: saveChannelDialogData.value.title,
          customUrl: saveChannelDialogData.value.customUrl,
          thumbnailUrl: saveChannelDialogData.value.thumbnailUrl,
          country: saveChannelDialogData.value.country,
          subscriberCount: saveChannelDialogData.value.subscriberCount,
          videoCount: saveChannelDialogData.value.videoCount,
          viewCount: saveChannelDialogData.value.viewCount,
          isOpen: saveChannelDialogData.value.isOpen,
          onSaved: () => {
            closeSaveChannelDialog();
            handleBookmarkDataChange();
          }
        }
      ),
u(BookmarkDialogs, { onDataChange: handleBookmarkDataChange }),
u(SubtitleDialog, {})
    ] });
  }
  const CLICK_DURATION = 500;
  const ICON_PATHS = {
    loop: "M16.5 6.671c.116 0 .223.04.308.107l.067.063l.017.02a5 5 0 0 1-3.675 8.135L13 15H7a5.07 5.07 0 0 1-.303-.009l1.657 1.655a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057l-2.5-2.5a.5.5 0 0 1-.057-.638l.057-.07l2.5-2.5a.5.5 0 0 1 .765.638l-.057.07l-1.637 1.636l.14.008L7 14h6a4 4 0 0 0 3.11-6.516a.5.5 0 0 1 .39-.812Zm-4.854-4.025a.5.5 0 0 1 .638-.057l.07.057l2.5 2.5l.057.07a.5.5 0 0 1 0 .568l-.057.07l-2.5 2.5l-.07.057a.5.5 0 0 1-.568 0l-.07-.057l-.057-.07a.5.5 0 0 1 0-.568l.057-.07l1.637-1.636l-.14-.008L13 6H7a4 4 0 0 0-3.105 6.522a.5.5 0 1 1-.801.601a5 5 0 0 1 3.689-8.119L7 5h6c.102 0 .203.003.303.009l-1.657-1.655l-.057-.07a.5.5 0 0 1 .057-.638Z",
    screenshot: "M17 6.125v2.91A3.529 3.529 0 0 0 16.5 9H16V6.125a.965.965 0 0 0-.289-.711l-2.125-2.125A.962.962 0 0 0 13 3.008V5.5a1.507 1.507 0 0 1-.922 1.383A1.327 1.327 0 0 1 11.5 7h-4a1.507 1.507 0 0 1-1.383-.922A1.327 1.327 0 0 1 6 5.5V3H5a.972.972 0 0 0-.703.289a1.081 1.081 0 0 0-.219.32A.856.856 0 0 0 4 4v10a.972.972 0 0 0 .078.391c.052.118.123.226.211.32a.854.854 0 0 0 .313.211c.127.049.262.075.398.078v-4.5a1.507 1.507 0 0 1 .922-1.383c.181-.082.379-.122.578-.117h5.992a3.489 3.489 0 0 0-2.442 1H6.5a.505.505 0 0 0-.5.5V15h3v1H5a1.884 1.884 0 0 1-.758-.156a2.2 2.2 0 0 1-.64-.422A1.9 1.9 0 0 1 3 14.039V4c-.001-.26.052-.519.156-.758a2.2 2.2 0 0 1 .422-.642a1.9 1.9 0 0 1 .622-.436c.24-.105.499-.16.761-.164h7.914c.262 0 .523.05.766.148c.244.099.465.248.648.438l2.125 2.125c.186.185.332.405.43.648c.099.244.152.503.156.766ZM7 3v2.5a.505.505 0 0 0 .5.5h4a.505.505 0 0 0 .5-.5V3H7Zm3 9.5a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v4c0 .51-.152.983-.414 1.379l-3.025-3.025a1.5 1.5 0 0 0-2.122 0l-3.025 3.025A2.488 2.488 0 0 1 10 16.5v-4Zm7 .25a.75.75 0 1 0-1.5 0a.75.75 0 0 0 1.5 0Zm-5.879 5.836c.396.262.87.414 1.379.414h4c.51 0 .983-.152 1.379-.414l-3.025-3.025a.5.5 0 0 0-.708 0l-3.025 3.025Z",
    copy: "M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5V9h-1V4.5a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h3.535c.051.353.154.69.302 1H5.5A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3h1.585ZM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm1.5 9.5a2.5 2.5 0 0 1 2.5-2.5h4a2.5 2.5 0 0 1 2.5 2.5v4c0 .51-.152.983-.414 1.379l-3.025-3.025a1.5 1.5 0 0 0-2.122 0l-3.025 3.025A2.488 2.488 0 0 1 10 16.5v-4Zm7 .25a.75.75 0 1 0-1.5 0a.75.75 0 0 0 1.5 0Zm-5.879 5.836c.396.262.87.414 1.379.414h4c.51 0 .983-.152 1.379-.414l-3.025-3.025a.5.5 0 0 0-.708 0l-3.025 3.025Z",
    checkCircle: "M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16Zm0 1a7 7 0 1 0 0 14a7 7 0 0 0 0-14Zm3.358 4.646a.5.5 0 0 1 .058.638l-.058.07l-4.004 4.004a.5.5 0 0 1-.638.058l-.07-.058l-2-2a.5.5 0 0 1 .638-.765l.07.058L9 11.298l3.651-3.652a.5.5 0 0 1 .707 0Z"
  };
  let tooltipElement = null;
  function initTooltip() {
    if (tooltipElement) return;
    tooltipElement = document.createElement("div");
    tooltipElement.className = "tubeinsights-tooltip";
    tooltipElement.style.cssText = `
    position: fixed;
    background: rgba(28, 28, 28, 0.9);
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-family: Roboto, Arial, sans-serif;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.1s ease;
    white-space: nowrap;
    backdrop-filter: blur(10px);
  `;
    document.body.appendChild(tooltipElement);
  }
  function showTooltip(button, text) {
    if (!tooltipElement) initTooltip();
    if (!tooltipElement) return;
    const rect = button.getBoundingClientRect();
    tooltipElement.textContent = text;
    tooltipElement.style.opacity = "0";
    tooltipElement.style.display = "block";
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const left = rect.left + (rect.width - tooltipRect.width) / 2;
    const top = rect.top - tooltipRect.height - 8;
    tooltipElement.style.left = `${left}px`;
    tooltipElement.style.top = `${top}px`;
    requestAnimationFrame(() => {
      if (tooltipElement) {
        tooltipElement.style.opacity = "1";
      }
    });
  }
  function hideTooltip() {
    if (!tooltipElement) return;
    tooltipElement.style.opacity = "0";
    setTimeout(() => {
      if (tooltipElement) {
        tooltipElement.style.display = "none";
      }
    }, 100);
  }
  function addTooltipToButton(button, text) {
    let timeoutId = null;
    button.addEventListener("mouseenter", () => {
      timeoutId = window.setTimeout(() => {
        showTooltip(button, text);
      }, 300);
    });
    button.addEventListener("mouseleave", () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      hideTooltip();
    });
    button.addEventListener("click", () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      hideTooltip();
    });
  }
  function cleanupTooltip() {
    if (tooltipElement) {
      tooltipElement.remove();
      tooltipElement = null;
    }
  }
  function createGradient(id, color1, color2) {
    const gradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    gradient.setAttribute("id", id);
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "100%");
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("style", `stop-color:${color1}`);
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("style", `stop-color:${color2}`);
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    return gradient;
  }
  function createIcon(viewBox, pathData, isShortsButton = false) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("height", "24px");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("width", "24px");
    svg.setAttribute("fill", "#e8eaed");
    if (!isShortsButton) {
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      defs.appendChild(createGradient("buttonGradient", "#f03", "#ff2791"));
      svg.appendChild(defs);
    }
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    svg.appendChild(path);
    return svg;
  }
  function addClickAnimation(button) {
    const path = button.querySelector("svg path");
    if (!path) return;
    const originalPath = path.getAttribute("d");
    if (!originalPath) return;
    path.setAttribute("d", ICON_PATHS.checkCircle);
    setTimeout(() => {
      path.setAttribute("d", originalPath);
    }, CLICK_DURATION);
  }
  function createButton(className, icon, onClick, tooltipText) {
    const button = document.createElement("a");
    button.classList.add("ytp-button", className);
    button.appendChild(icon);
    button.addEventListener("click", onClick);
    if (tooltipText) {
      button.setAttribute("aria-label", tooltipText);
      addTooltipToButton(button, tooltipText);
    }
    return button;
  }
  function waitForVideo() {
    return new Promise((resolve) => {
      const check = () => document.querySelector("video") ? resolve() : setTimeout(check, 100);
      check();
    });
  }
  const CSS$5 = `
  a.tubeinsights-loop-button {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
  }

  a.tubeinsights-loop-button svg {
      transition: transform 0.2s ease, fill 0.2s ease;
      display: block !important;
      margin: auto !important;
      vertical-align: middle !important;
  }

  a.tubeinsights-loop-button:hover svg {
      transform: scale(1.1);
  }

  a.tubeinsights-loop-button.active svg {
      fill: url(#buttonGradient);
  }
`;
  const loopVideoModule = {
    async init() {
      if (!moduleSettings.value.loopVideo) return;
      const rightControls = await this.waitForRightControls();
      if (!rightControls) return;
      this.insertButton(rightControls);
      this.addLoopObserver();
    },
    waitForRightControls() {
      return new Promise((resolve) => {
        let attempts = 0;
        const check = () => {
          const controls = document.querySelector("div.ytp-right-controls");
          if (controls) resolve(controls);
          else if (attempts++ >= 50) resolve(null);
          else setTimeout(check, 100);
        };
        check();
      });
    },
    insertButton(rightControls) {
      if (document.querySelector(".tubeinsights-loop-button")) return;
      const loopButton = createButton(
        "tubeinsights-loop-button",
        createIcon("0 0 20 20", ICON_PATHS.loop),
        () => {
          const video = document.querySelector("video");
          if (!video) return;
          video.loop = !video.loop;
          if (video.loop) video.play();
          loopButton.classList.toggle("active");
        },
        "Loop Video (Alt+L)"
      );
      rightControls.insertBefore(loopButton, rightControls.firstChild);
    },
    addLoopObserver() {
      const video = document.querySelector("video");
      if (!video) return;
      new MutationObserver(() => {
        const loopButton = document.querySelector(".tubeinsights-loop-button");
        const isLooped = video.hasAttribute("loop");
        const isActive = loopButton?.classList.contains("active");
        if (isLooped !== isActive) {
          loopButton?.classList.toggle("active");
        }
      }).observe(video, { attributes: true, attributeFilter: ["loop"] });
    },
    cleanup() {
      document.querySelector(".tubeinsights-loop-button")?.remove();
    }
  };
  const CSS$4 = ``;
  let dislikesValue = 0;
  let observer = null;
  function isShorts() {
    return window.location.pathname.startsWith("/shorts");
  }
  function getButtons() {
    if (isShorts()) {
      const activeReel = document.querySelector(
        "ytd-reel-video-renderer[is-active]"
      );
      if (activeReel) {
        const likeButton = activeReel.querySelector("#like-button");
        if (likeButton?.parentElement?.parentElement) {
          return likeButton.parentElement.parentElement;
        }
      }
      return document.querySelector("#like-button")?.parentElement?.parentElement || document.querySelector("like-button-view-model")?.parentElement || document.querySelector("ytd-reel-video-renderer[is-active] #actions") || null;
    }
    return document.querySelector(
      "ytd-menu-renderer.ytd-watch-metadata > div#top-level-buttons-computed"
    ) || document.querySelector(
      "ytd-menu-renderer.ytd-video-primary-info-renderer > div"
    ) || document.querySelector("#menu-container #top-level-buttons-computed");
  }
  function getDislikeButton() {
    if (isShorts()) {
      const activeReel = document.querySelector(
        "ytd-reel-video-renderer[is-active]"
      );
      if (activeReel) {
        const dislikeBtn = activeReel.querySelector("dislike-button-view-model") || activeReel.querySelector("#dislike-button");
        if (dislikeBtn) return dislikeBtn;
      }
      return document.querySelector("dislike-button-view-model") || document.querySelector("#dislike-button") || null;
    }
    const buttons = getButtons();
    if (!buttons) return null;
    const segmentedContainer = buttons.querySelector(
      "ytd-segmented-like-dislike-button-renderer"
    );
    if (segmentedContainer) {
      return document.querySelector("#segmented-dislike-button") || segmentedContainer.children[1] || null;
    }
    const dislikeViewModel = buttons.querySelector("dislike-button-view-model");
    if (dislikeViewModel) return dislikeViewModel;
    return buttons.children[1] || null;
  }
  function getDislikeTextContainer() {
    const dislikeButton = getDislikeButton();
    if (!dislikeButton) return null;
    if (isShorts()) {
      let textSpan = dislikeButton.querySelector(
        "span.yt-core-attributed-string"
      ) || dislikeButton.querySelector(
        ".yt-spec-button-shape-with-label__label span"
      ) || dislikeButton.querySelector("button span[role='text']");
      if (textSpan) {
        return textSpan;
      }
      const labelDiv = dislikeButton.querySelector(
        ".yt-spec-button-shape-with-label__label"
      );
      if (labelDiv) {
        textSpan = labelDiv.querySelector("span");
        if (textSpan) {
          return textSpan;
        }
      }
      return null;
    }
    let result = dislikeButton.querySelector("#text") || dislikeButton.querySelector("yt-formatted-string") || dislikeButton.querySelector("span[role='text']");
    if (!result) {
      const textSpan = document.createElement("span");
      textSpan.id = "text";
      textSpan.className = "yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap";
      textSpan.setAttribute("role", "text");
      textSpan.style.marginLeft = "6px";
      const button = dislikeButton.querySelector("button");
      if (button) {
        button.appendChild(textSpan);
        button.style.width = "auto";
        button.style.minWidth = "auto";
      }
      result = textSpan;
    }
    return result;
  }
  function setDislikes(dislikesCount) {
    const container = getDislikeTextContainer();
    if (container) {
      container.removeAttribute("is-empty");
      if (container.innerText !== dislikesCount) {
        container.innerText = dislikesCount;
      }
    }
  }
  function getVideoId() {
    const urlObject = new URL(window.location.href);
    const pathname = urlObject.pathname;
    if (pathname.startsWith("/clip")) {
      const meta = document.querySelector("meta[itemprop='videoId']") || document.querySelector("meta[itemprop='identifier']");
      return meta ? meta.content : null;
    } else if (pathname.startsWith("/shorts")) {
      return pathname.slice(8);
    }
    return urlObject.searchParams.get("v");
  }
  function roundDown(num) {
    if (num < 1e3) return num;
    const int = Math.floor(Math.log10(num) - 2);
    const decimal = int + (int % 3 ? 1 : 0);
    const value = Math.floor(num / 10 ** decimal);
    return value * 10 ** decimal;
  }
  function numberFormat(numberState) {
    const numberDisplay = roundDown(numberState);
    let userLocales = "en";
    if (document.documentElement.lang) {
      userLocales = document.documentElement.lang;
    } else if (navigator.language) {
      userLocales = navigator.language;
    }
    const formatter = Intl.NumberFormat(userLocales, {
      notation: "compact",
      compactDisplay: "short"
    });
    return formatter.format(numberDisplay);
  }
  async function fetchDislikes() {
    const videoId = getVideoId();
    if (!videoId) return;
    try {
      const response = await fetch(
        `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`
      );
      const json = await response.json();
      if (json && json.dislikes !== void 0) {
        dislikesValue = json.dislikes;
        setDislikes(numberFormat(dislikesValue));
      }
    } catch (error) {
      console.error("[Return Dislike] Failed to fetch dislikes:", error);
    }
  }
  function updateDislikes() {
    setDislikes(numberFormat(dislikesValue));
  }
  function setupDislikeObserver() {
    const dislikeButton = getDislikeButton();
    if (!dislikeButton || observer) return;
    observer = new MutationObserver(() => {
      updateDislikes();
    });
    observer.observe(dislikeButton, {
      attributes: true,
      subtree: true,
      childList: true
    });
  }
  const returnDislikeModule = {
    async init() {
      if (!moduleSettings.value.returnDislike) return;
      const maxAttempts = isShorts() ? 100 : 50;
      const pollInterval = isShorts() ? 100 : 50;
      let attempts = 0;
      const checkButton = setInterval(() => {
        const buttons = getButtons();
        const dislikeButton = getDislikeButton();
        if (buttons && dislikeButton || attempts++ >= maxAttempts) {
          clearInterval(checkButton);
          if (buttons && dislikeButton) {
            fetchDislikes();
            setupDislikeObserver();
          }
        }
      }, pollInterval);
    },
    cleanup() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      dislikesValue = 0;
      if (isShorts()) {
        const textContainer = getDislikeTextContainer();
        if (textContainer && textContainer.innerText !== "Dislike") {
          textContainer.innerText = "Dislike";
        }
      }
      const textSpans = document.querySelectorAll(
        "dislike-button-view-model #text, #segmented-dislike-button #text"
      );
      textSpans.forEach((span) => {
        if (span.id === "text" && !span.hasAttribute("is-empty")) {
          span.remove();
        }
      });
    }
  };
  const youtubeService$1 = new YouTubeService();
  const CSS$3 = `
  a.tubeinsights-save-screenshot-button,
  a.tubeinsights-copy-screenshot-button {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
  }

  a.tubeinsights-save-screenshot-button svg,
  a.tubeinsights-copy-screenshot-button svg {
      transition: transform 0.2s ease, fill 0.2s ease;
      display: block !important;
      margin: auto !important;
      vertical-align: middle !important;
  }

  a.tubeinsights-save-screenshot-button:hover svg,
  a.tubeinsights-copy-screenshot-button:hover svg {
      transform: scale(1.1);
  }

  .tubeinsights-shorts-save-button,
  .tubeinsights-shorts-copy-button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.3s;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      min-width: 48px;
      min-height: 48px;
      flex-shrink: 0;
  }

  .tubeinsights-shorts-save-button svg,
  .tubeinsights-shorts-copy-button svg {
      width: 28px;
      height: 28px;
      transition: transform 0.2s ease;
  }

  .tubeinsights-shorts-save-button:hover svg,
  .tubeinsights-shorts-copy-button:hover svg {
      transform: scale(1.1);
  }

  html[dark] .tubeinsights-shorts-save-button,
  html[dark] .tubeinsights-shorts-copy-button {
      background-color: rgba(255, 255, 255, 0.1);
  }

  html[dark] .tubeinsights-shorts-save-button:hover,
  html[dark] .tubeinsights-shorts-copy-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
  }

  html[dark] .tubeinsights-shorts-save-button svg path,
  html[dark] .tubeinsights-shorts-copy-button svg path {
      fill: white;
  }

  html:not([dark]) .tubeinsights-shorts-save-button,
  html:not([dark]) .tubeinsights-shorts-copy-button {
      background-color: rgba(0, 0, 0, 0.05);
  }

  html:not([dark]) .tubeinsights-shorts-save-button:hover,
  html:not([dark]) .tubeinsights-shorts-copy-button:hover {
      background-color: rgba(0, 0, 0, 0.1);
  }

  html:not([dark]) .tubeinsights-shorts-save-button svg path,
  html:not([dark]) .tubeinsights-shorts-copy-button svg path {
      fill: #030303;
  }
`;
  function formatTime(time) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 60);
    const timeStr = `${String(hours).padStart(2, "0")}${String(minutes).padStart(
    2,
    "0"
  )}${String(seconds).padStart(2, "0")}`;
    return `[${timeStr}] ${dateStr}`;
  }
  async function getVideoTitle$1() {
    const videoId = youtubeService$1.getVideoIdFromURL();
    if (!videoId) return "YouTube Video";
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.I_END_POINT}/player?key=${API_CONFIG.INNERTUBE_API_KEY}&prettyPrint=false`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": API_CONFIG.INNERTUBE_CLIENT_VERSION
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: API_CONFIG.INNERTUBE_CLIENT_NAME,
              clientVersion: API_CONFIG.INNERTUBE_CLIENT_VERSION,
              hl: "en",
              gl: "US"
            }
          },
          videoId
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.videoDetails?.title) return data.videoDetails.title;
      }
    } catch (error) {
      console.error("Failed to fetch video details from InnerTube:", error);
    }
    return videoId;
  }
  async function captureScreenshot(player, actions) {
    if (!player) return;
    const canvas = document.createElement("canvas");
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
    const { screenshotFormat, screenshotFilename } = moduleSettings.value;
    const extension = screenshotFormat === "jpg" ? "jpg" : screenshotFormat;
    let baseFilename;
    if (screenshotFilename === "videoId") {
      const videoId = youtubeService$1.getVideoIdFromURL();
      baseFilename = videoId || "YouTube Video";
    } else {
      baseFilename = await getVideoTitle$1();
    }
    const filename = sanitizeFilename(
      `${baseFilename} ${formatTime(player.currentTime)}.${extension}`
    );
    const mimeType = screenshotFormat === "jpg" ? "image/jpeg" : `image/${screenshotFormat}`;
    return new Promise((resolve) => {
      const copyMimeType = "image/png";
      if (actions.copy) {
        canvas.toBlob(async (copyBlob) => {
          if (!copyBlob) {
            console.error("Failed to create blob for clipboard");
            if (!actions.download) resolve();
            return;
          }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ [copyMimeType]: copyBlob })
            ]);
          } catch (error) {
            console.error("Failed to copy screenshot:", error);
          }
          if (!actions.download) {
            resolve();
          }
        }, copyMimeType);
      }
      if (actions.download) {
        canvas.toBlob(async (downloadBlob) => {
          if (!downloadBlob) {
            console.error("Failed to create blob for download");
            resolve();
            return;
          }
          try {
            const url = URL.createObjectURL(downloadBlob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
          } catch (error) {
            console.error("Failed to download screenshot:", error);
          }
          resolve();
        }, mimeType);
      }
      if (!actions.copy && !actions.download) {
        resolve();
      }
    });
  }
  const screenshotVideoModule = {
    async init() {
      const rightControls = await this.waitForRightControls();
      if (!rightControls) return;
      this.insertButtons(rightControls);
    },
    waitForRightControls() {
      return new Promise((resolve) => {
        let attempts = 0;
        const check = () => {
          const controls = document.querySelector("div.ytp-right-controls");
          if (controls) resolve(controls);
          else if (attempts++ >= 50) resolve(null);
          else setTimeout(check, 100);
        };
        check();
      });
    },
    insertButtons(rightControls) {
      if (moduleSettings.value.screenshotDownload && !document.querySelector(".tubeinsights-save-screenshot-button")) {
        const saveButton = createButton(
          "tubeinsights-save-screenshot-button",
          createIcon("0 0 20 20", ICON_PATHS.screenshot),
          async (e) => {
            addClickAnimation(e.currentTarget);
            const player = document.querySelector("video");
            if (player) {
              await captureScreenshot(player, { download: true, copy: false });
            }
          },
          "Download Screenshot (Alt+S)"
        );
        const thumbnailButton = document.querySelector(
          ".tubeinsights-thumbnail-download-button"
        );
        const loopButton = document.querySelector(".tubeinsights-loop-button");
        if (thumbnailButton && thumbnailButton.nextSibling) {
          rightControls.insertBefore(saveButton, thumbnailButton.nextSibling);
        } else if (thumbnailButton) {
          thumbnailButton.parentNode?.appendChild(saveButton);
        } else if (loopButton && loopButton.nextSibling) {
          rightControls.insertBefore(saveButton, loopButton.nextSibling);
        } else if (loopButton) {
          loopButton.parentNode?.appendChild(saveButton);
        } else {
          rightControls.insertBefore(saveButton, rightControls.firstChild);
        }
      }
      if (moduleSettings.value.screenshotCopy && !document.querySelector(".tubeinsights-copy-screenshot-button")) {
        const copyButton = createButton(
          "tubeinsights-copy-screenshot-button",
          createIcon("0 0 20 20", ICON_PATHS.copy),
          async (e) => {
            addClickAnimation(e.currentTarget);
            const player = document.querySelector("video");
            if (player) {
              await captureScreenshot(player, { download: false, copy: true });
            }
          },
          "Copy Screenshot (Alt+C)"
        );
        const saveButton = document.querySelector(
          ".tubeinsights-save-screenshot-button"
        );
        const thumbnailButton = document.querySelector(
          ".tubeinsights-thumbnail-download-button"
        );
        const loopButton = document.querySelector(".tubeinsights-loop-button");
        if (saveButton && saveButton.nextSibling) {
          rightControls.insertBefore(copyButton, saveButton.nextSibling);
        } else if (saveButton) {
          saveButton.parentNode?.appendChild(copyButton);
        } else if (thumbnailButton && thumbnailButton.nextSibling) {
          rightControls.insertBefore(copyButton, thumbnailButton.nextSibling);
        } else if (thumbnailButton) {
          thumbnailButton.parentNode?.appendChild(copyButton);
        } else if (loopButton && loopButton.nextSibling) {
          rightControls.insertBefore(copyButton, loopButton.nextSibling);
        } else if (loopButton) {
          loopButton.parentNode?.appendChild(copyButton);
        } else {
          rightControls.insertBefore(copyButton, rightControls.firstChild);
        }
      }
    },
    cleanup() {
      document.querySelector(".tubeinsights-save-screenshot-button")?.remove();
      document.querySelector(".tubeinsights-copy-screenshot-button")?.remove();
    }
  };
  const screenshotShortsModule = {
    init() {
      if (moduleSettings.value.screenshotDownload) this.insertButton("save");
      if (moduleSettings.value.screenshotCopy) this.insertButton("copy");
    },
    insertButton(type) {
      const className = `tubeinsights-shorts-${type}-button`;
      if (document.querySelector(`.${className}`)) return;
      const actionBar = document.querySelector(
        "ytd-reel-video-renderer[is-active] reel-action-bar-view-model"
      ) || document.querySelector(
        "ytd-reel-video-renderer[is-active] #actions #button-bar"
      );
      if (!actionBar) return;
      const isSave = type === "save";
      const button = document.createElement("div");
      button.className = className;
      button.appendChild(
        createIcon(
          "0 0 20 20",
          isSave ? ICON_PATHS.screenshot : ICON_PATHS.copy,
          true
        )
      );
      button.addEventListener("click", async (e) => {
        addClickAnimation(e.currentTarget);
        const player = document.querySelector(
          "ytd-reel-video-renderer[is-active] video"
        );
        if (player) {
          await captureScreenshot(player, { download: isSave, copy: !isSave });
        }
      });
      let refButton = null;
      if (isSave) {
        refButton = document.querySelector(
          "ytd-reel-video-renderer[is-active] like-button-view-model"
        );
      } else {
        refButton = document.querySelector(".tubeinsights-shorts-save-button");
        if (refButton) {
          refButton.parentNode?.insertBefore(button, refButton.nextSibling);
          return;
        } else {
          refButton = document.querySelector(
            "ytd-reel-video-renderer[is-active] like-button-view-model"
          );
        }
      }
      if (refButton) {
        actionBar.insertBefore(button, refButton);
      }
    },
    cleanup() {
      document.querySelector(".tubeinsights-shorts-save-button")?.remove();
      document.querySelector(".tubeinsights-shorts-copy-button")?.remove();
    }
  };
  const youtubeService = new YouTubeService();
  const CSS$2 = `
  a.tubeinsights-thumbnail-download-button {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
  }

  a.tubeinsights-thumbnail-download-button svg {
      transition: transform 0.2s ease, fill 0.2s ease;
      display: block !important;
      margin: auto !important;
      vertical-align: middle !important;
  }

  a.tubeinsights-thumbnail-download-button:hover svg {
      transform: scale(1.1);
  }
`;
  const ICON_PATH = "M5.5 10a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9Zm-.896-6.396l-.897.896H5.25A2.75 2.75 0 0 1 8 7.25v.25a.5.5 0 0 1-1 0v-.25A1.75 1.75 0 0 0 5.25 5.5H3.707l.897.896a.5.5 0 1 1-.708.708L2.144 5.35a.498.498 0 0 1 .002-.705l1.75-1.75a.5.5 0 1 1 .708.708ZM3 10.4c.317.162.651.294 1 .393V14c0 .373.102.722.28 1.02l4.669-4.588a1.5 1.5 0 0 1 2.102 0l4.67 4.588A1.99 1.99 0 0 0 16 14V6a2 2 0 0 0-2-2h-3.207a5.466 5.466 0 0 0-.393-1H14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.6Zm11-2.9a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Zm-1 0a.5.5 0 1 0-1 0a.5.5 0 0 0 1 0Zm-8.012 8.226A1.99 1.99 0 0 0 6 16h8c.37 0 .715-.1 1.012-.274l-4.662-4.58a.5.5 0 0 0-.7 0l-4.662 4.58Z";
  async function getVideoTitle() {
    const videoId = youtubeService.getVideoIdFromURL();
    if (!videoId) return "YouTube Video";
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.I_END_POINT}/player?key=${API_CONFIG.INNERTUBE_API_KEY}&prettyPrint=false`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": API_CONFIG.INNERTUBE_CLIENT_VERSION
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: API_CONFIG.INNERTUBE_CLIENT_NAME,
              clientVersion: API_CONFIG.INNERTUBE_CLIENT_VERSION,
              hl: "en",
              gl: "US"
            }
          },
          videoId
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.videoDetails?.title) return data.videoDetails.title;
      }
    } catch (error) {
      console.error("Failed to fetch video details from InnerTube:", error);
    }
    return videoId;
  }
  async function downloadThumbnail() {
    const videoId = youtubeService.getVideoIdFromURL();
    if (!videoId) return;
    const { screenshotFormat, screenshotFilename } = moduleSettings.value;
    const extension = screenshotFormat === "jpg" ? "jpg" : screenshotFormat;
    let baseFilename;
    if (screenshotFilename === "videoId") {
      baseFilename = videoId;
    } else {
      baseFilename = await getVideoTitle();
    }
    const filename = sanitizeFilename(`${baseFilename}.${extension}`);
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      if (screenshotFormat !== "jpg") {
        const img = new Image();
        const canvas = document.createElement("canvas");
        await new Promise((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }
            ctx.drawImage(img, 0, 0);
            const mimeType = screenshotFormat === "png" ? "image/png" : "image/webp";
            canvas.toBlob((convertedBlob) => {
              if (!convertedBlob) {
                reject(new Error("Failed to convert image"));
                return;
              }
              const url = URL.createObjectURL(convertedBlob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }, 100);
              resolve();
            }, mimeType);
          };
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = URL.createObjectURL(blob);
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error("Failed to download thumbnail:", error);
    }
  }
  const thumbnailDownloadModule = {
    async init() {
      if (!moduleSettings.value.thumbnailDownload) return;
      const rightControls = await this.waitForRightControls();
      if (!rightControls) return;
      this.insertButton(rightControls);
    },
    waitForRightControls() {
      return new Promise((resolve) => {
        let attempts = 0;
        const check = () => {
          const controls = document.querySelector("div.ytp-right-controls");
          if (controls) resolve(controls);
          else if (attempts++ >= 50) resolve(null);
          else setTimeout(check, 100);
        };
        check();
      });
    },
    insertButton(rightControls) {
      if (document.querySelector(".tubeinsights-thumbnail-download-button"))
        return;
      const thumbnailButton = createButton(
        "tubeinsights-thumbnail-download-button",
        createIcon("0 0 20 20", ICON_PATH),
        async (e) => {
          addClickAnimation(e.currentTarget);
          await downloadThumbnail();
        },
        "Download Thumbnail (Alt+T)"
      );
      const loopButton = document.querySelector(".tubeinsights-loop-button");
      if (loopButton && loopButton.nextSibling) {
        rightControls.insertBefore(thumbnailButton, loopButton.nextSibling);
      } else if (loopButton) {
        loopButton.parentNode?.appendChild(thumbnailButton);
      } else {
        rightControls.insertBefore(thumbnailButton, rightControls.firstChild);
      }
    },
    cleanup() {
      document.querySelector(".tubeinsights-thumbnail-download-button")?.remove();
    }
  };
  const CSS$1 = `
  /* Hide progress bar when enabled */
  body.tubeinsights-hide-progress-bar ytd-thumbnail-overlay-resume-playback-renderer,
  body.tubeinsights-hide-progress-bar yt-thumbnail-overlay-progress-bar-view-model {
      display: none !important;
  }
`;
  const hideProgressBarModule = {
    init() {
      this.updateProgressBarVisibility();
    },
    updateProgressBarVisibility() {
      if (moduleSettings.value.hideProgressBar) {
        document.body.classList.add("tubeinsights-hide-progress-bar");
      } else {
        document.body.classList.remove("tubeinsights-hide-progress-bar");
      }
    },
    cleanup() {
      document.body.classList.remove("tubeinsights-hide-progress-bar");
    }
  };
  async function fetchWithTimeout(url, options2 = {}) {
    const { timeout = 3e4, ...fetchOptions } = options2;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        const error = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: response.status
        };
        try {
          const errorData = await response.json();
          error.details = errorData;
        } catch {
        }
        return { success: false, error };
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: {
              message: "Request timeout",
              code: "TIMEOUT"
            }
          };
        }
        return {
          success: false,
          error: {
            message: error.message,
            details: error
          }
        };
      }
      return {
        success: false,
        error: {
          message: "Unknown error occurred",
          details: error
        }
      };
    }
  }
  async function fetchTubeInsights(endpoint, options2) {
    const url = `${API_ENDPOINTS.TUBEINSIGHTS_BASE}${endpoint}`;
    logger.tubeinsights.debug("Fetching:", url);
    const result = await fetchWithTimeout(url, options2);
    if (!result.success) {
      logger.tubeinsights.error("API Error:", result.error);
    }
    return result;
  }
  function fetchChannelData(channelId, options2) {
    return fetchTubeInsights(`/api/channels/${channelId}`, options2);
  }
  function fetchVideoData(videoId, options2) {
    return fetchTubeInsights(`/api/videos/${videoId}`, options2);
  }
  const CACHE_DURATION = 90 * 24 * 60 * 60 * 1e3;
  let currentChannelId = null;
  let currentChannelCountry = null;
  const CSS = `
  /* Country flag styles */
  .tubeinsights-country-flag {
    display: inline-block;
    margin-left: 8px;
    cursor: pointer;
    line-height: 1;
    position: relative;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s ease;
  }

  .tubeinsights-country-flag:hover {
    opacity: 0.8;
  }

  .tubeinsights-country-flag img {
    display: block;
    vertical-align: middle;
  }

  /* Channel page flag - larger, needs more adjustment */
  .tubeinsights-country-flag-channel {
    transform: translateY(2px);
  }

  /* Video page flag - smaller */
  .tubeinsights-country-flag-video {
    transform: translateY(2px);
  }

  /* Shorts page flag */
  .tubeinsights-country-flag-shorts {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  /* Loading spinner */
  .tubeinsights-country-flag-loading {
    display: inline-block;
    margin-left: 8px;
    line-height: 1;
    opacity: 0.6;
  }

  .tubeinsights-country-flag-loading svg {
    display: block;
    vertical-align: middle;
    animation: tubeinsights-flag-spin 1s linear infinite;
  }

  @keyframes tubeinsights-flag-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
  const getFlagIconUrl = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) return "";
    return `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/${countryCode.toLowerCase()}.svg`;
  };
  const getCountryName = (countryCode) => {
    return countryNames[countryCode.toUpperCase()] || countryCode;
  };
  const getCachedCountry = async (key) => {
    try {
      const cached = await storage.get(`country-flag-${key}`, "");
      if (!cached) return null;
      const cacheData = JSON.parse(cached);
      const now = Date.now();
      if (now - cacheData.timestamp < CACHE_DURATION) {
        return cacheData.country;
      }
      await storage.set(`country-flag-${key}`, "");
      return null;
    } catch (error) {
      return null;
    }
  };
  const setCachedCountry = async (key, country) => {
    try {
      const cacheData = {
        country,
        timestamp: Date.now()
      };
      await storage.set(`country-flag-${key}`, JSON.stringify(cacheData));
    } catch (error) {
    }
  };
  const getChannelCountry = async (channelId) => {
    try {
      if (currentChannelId === channelId && currentChannelCountry !== null) {
        return currentChannelCountry;
      }
      const cachedCountry = await getCachedCountry(channelId);
      if (cachedCountry !== null) {
        currentChannelId = channelId;
        currentChannelCountry = cachedCountry;
        return cachedCountry;
      }
      const result = await fetchChannelData(channelId);
      if (result.success) {
        const country = result.data?.items?.[0]?.snippet?.country;
        if (country) {
          await setCachedCountry(channelId, country);
          currentChannelId = channelId;
          currentChannelCountry = country;
          return country;
        }
      }
      currentChannelId = channelId;
      currentChannelCountry = "";
      return "";
    } catch (error) {
      console.error("[Country Flags] Error fetching channel country:", error);
      return "";
    }
  };
  const getVideoCountry = async (videoId) => {
    try {
      const result = await fetchVideoData(videoId);
      if (result.success) {
        const channelId = result.data?.items?.[0]?.snippet?.channelId;
        if (channelId) {
          return await getChannelCountry(channelId);
        }
      }
      return "";
    } catch (error) {
      console.error("[Country Flags] Error getting video country:", error);
      return "";
    }
  };
  const createLoadingSpinner = (size, isChannel) => {
    const spinner = document.createElement("span");
    spinner.className = `tubeinsights-country-flag-loading ${isChannel ? "tubeinsights-country-flag-channel" : "tubeinsights-country-flag-video"}`;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size.toString());
    svg.setAttribute("height", size.toString());
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const pathBg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathBg.setAttribute("stroke", "none");
    pathBg.setAttribute("d", "M0 0h24v24H0z");
    pathBg.setAttribute("fill", "none");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 3a9 9 0 1 0 9 9");
    svg.appendChild(pathBg);
    svg.appendChild(path);
    spinner.appendChild(svg);
    return spinner;
  };
  const addFlagToWatchTitle = async (retryCount = 0) => {
    if (!moduleSettings.value.countryFlags) return;
    const titleElement = document.querySelector(
      "ytd-watch-metadata h1.ytd-watch-metadata yt-formatted-string"
    );
    if (!titleElement) {
      if (retryCount < 5) {
        setTimeout(() => addFlagToWatchTitle(retryCount + 1), 200);
      }
      return;
    }
    if (titleElement.querySelector(".tubeinsights-country-flag")) {
      return;
    }
    const loadingSpinner = createLoadingSpinner(21, false);
    titleElement.appendChild(loadingSpinner);
    const youtubeService2 = new YouTubeService();
    const videoId = youtubeService2.getVideoIdFromURL();
    if (!videoId) {
      loadingSpinner.remove();
      return;
    }
    const country = await getVideoCountry(videoId);
    loadingSpinner.remove();
    if (!country) {
      return;
    }
    const flagUrl = getFlagIconUrl(country);
    if (!flagUrl) return;
    const countryName = getCountryName(country);
    const flagContainer = document.createElement("a");
    flagContainer.href = `https://www.google.com/maps/place/${encodeURIComponent(countryName)}`;
    flagContainer.target = "_blank";
    flagContainer.rel = "noopener noreferrer";
    flagContainer.className = "tubeinsights-country-flag tubeinsights-country-flag-video";
    const flagImg = document.createElement("img");
    flagImg.src = flagUrl;
    flagImg.alt = `${countryName} flag`;
    flagImg.width = 24;
    flagImg.height = 18;
    flagContainer.appendChild(flagImg);
    titleElement.appendChild(flagContainer);
    addTooltipToButton(flagContainer, countryName);
  };
  const addFlagToShortsPage = async (retryCount = 0) => {
    if (!moduleSettings.value.countryFlags) return;
    const channelNameElement = document.querySelector(
      "yt-reel-channel-bar-view-model .ytReelChannelBarViewModelChannelName"
    );
    if (!channelNameElement) {
      if (retryCount < 5) {
        setTimeout(() => addFlagToShortsPage(retryCount + 1), 200);
      }
      return;
    }
    if (channelNameElement.querySelector(".tubeinsights-country-flag")) {
      return;
    }
    const shortsIdMatch = window.location.pathname.match(/\/shorts\/([^\/]+)/);
    if (!shortsIdMatch) return;
    const shortsId = shortsIdMatch[1];
    if (!shortsId) return;
    const loadingSpinner = createLoadingSpinner(14, false);
    loadingSpinner.style.display = "inline-flex";
    loadingSpinner.style.alignItems = "center";
    channelNameElement.appendChild(loadingSpinner);
    const country = await getVideoCountry(shortsId);
    loadingSpinner.remove();
    if (!country) return;
    const flagUrl = getFlagIconUrl(country);
    if (!flagUrl) return;
    const countryName = getCountryName(country);
    const flagContainer = document.createElement("a");
    flagContainer.href = `https://www.google.com/maps/place/${encodeURIComponent(countryName)}`;
    flagContainer.target = "_blank";
    flagContainer.rel = "noopener noreferrer";
    flagContainer.className = "tubeinsights-country-flag tubeinsights-country-flag-shorts";
    const flagImg = document.createElement("img");
    flagImg.src = flagUrl;
    flagImg.alt = `${countryName} flag`;
    flagImg.width = 20;
    flagImg.height = 15;
    flagContainer.appendChild(flagImg);
    channelNameElement.appendChild(flagContainer);
    addTooltipToButton(flagContainer, countryName);
  };
  const addFlagToChannelTitle = async (retryCount = 0) => {
    if (!moduleSettings.value.countryFlags) return;
    const titleElement = document.querySelector(
      "yt-dynamic-text-view-model.yt-page-header-view-model__page-header-title h1 span.yt-core-attributed-string"
    );
    if (!titleElement) {
      if (retryCount < 5) {
        setTimeout(() => addFlagToChannelTitle(retryCount + 1), 200);
      }
      return;
    }
    const existingFlag = titleElement.querySelector(".tubeinsights-country-flag");
    if (existingFlag) {
      const flagElement = existingFlag;
      const isVisible = flagElement.offsetParent !== null;
      if (!isVisible) {
        existingFlag.remove();
      } else {
        return;
      }
    }
    const youtubeService2 = new YouTubeService();
    const channelId = await youtubeService2.getChannelId();
    if (!channelId) return;
    const loadingSpinner = createLoadingSpinner(32, true);
    titleElement.appendChild(loadingSpinner);
    const [country] = await Promise.all([
      getChannelCountry(channelId),
      new Promise((resolve) => setTimeout(resolve, 150))
]);
    loadingSpinner.remove();
    if (!country) return;
    const flagUrl = getFlagIconUrl(country);
    if (!flagUrl) return;
    const countryName = getCountryName(country);
    const flagContainer = document.createElement("a");
    flagContainer.href = `https://www.google.com/maps/place/${encodeURIComponent(countryName)}`;
    flagContainer.target = "_blank";
    flagContainer.rel = "noopener noreferrer";
    flagContainer.className = "tubeinsights-country-flag tubeinsights-country-flag-channel";
    const flagImg = document.createElement("img");
    flagImg.src = flagUrl;
    flagImg.alt = `${countryName} flag`;
    flagImg.width = 36;
    flagImg.height = 27;
    flagContainer.appendChild(flagImg);
    titleElement.appendChild(flagContainer);
    addTooltipToButton(flagContainer, countryName);
  };
  const removeFlags = () => {
    document.querySelectorAll(".tubeinsights-country-flag, .tubeinsights-country-flag-loading").forEach((el) => el.remove());
  };
  const resetChannelTracking = () => {
    currentChannelId = null;
    currentChannelCountry = null;
  };
  const countryFlagsModule = {
    init() {
      if (!moduleSettings.value.countryFlags) return;
      initTooltip();
      if (window.location.pathname.includes("/channel") || window.location.pathname.includes("/@")) {
        setTimeout(() => addFlagToChannelTitle(), 100);
      } else if (window.location.pathname.match(/^\/shorts\/[a-zA-Z0-9_-]{11}/)) {
        setTimeout(() => addFlagToShortsPage(), 100);
      } else if (window.location.pathname.includes("/watch")) {
        setTimeout(() => addFlagToWatchTitle(), 100);
      } else {
        resetChannelTracking();
      }
    },
    cleanup(force = false) {
      if (force) {
        removeFlags();
        cleanupTooltip();
        resetChannelTracking();
        return;
      }
      const isChannelPage = window.location.pathname.includes("/channel") || window.location.pathname.includes("/@");
      const isShortsVideoPage = window.location.pathname.match(/^\/shorts\/[a-zA-Z0-9_-]{11}/);
      if (!isChannelPage && !isShortsVideoPage) {
        removeFlags();
        cleanupTooltip();
        resetChannelTracking();
      }
    }
  };
  function triggerLoopVideo() {
    if (!moduleSettings.value.loopVideo) return;
    const loopButton = document.querySelector(
      ".tubeinsights-loop-button"
    );
    if (loopButton) {
      loopButton.click();
    }
  }
  function triggerDownloadScreenshot() {
    if (!moduleSettings.value.screenshotDownload) return;
    const downloadButton = document.querySelector(
      ".tubeinsights-save-screenshot-button"
    );
    if (downloadButton) {
      downloadButton.click();
    }
  }
  function triggerCopyScreenshot() {
    if (!moduleSettings.value.screenshotCopy) return;
    const copyButton = document.querySelector(
      ".tubeinsights-copy-screenshot-button"
    );
    if (copyButton) {
      copyButton.click();
    }
  }
  function triggerThumbnailDownload() {
    if (!moduleSettings.value.thumbnailDownload) return;
    const thumbnailButton = document.querySelector(
      ".tubeinsights-thumbnail-download-button"
    );
    if (thumbnailButton) {
      thumbnailButton.click();
    }
  }
  function handleKeyboardShortcut(event) {
    if (!event.altKey) return;
    const target = event.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }
    switch (event.key.toLowerCase()) {
      case "l":
        event.preventDefault();
        triggerLoopVideo();
        break;
      case "s":
        event.preventDefault();
        triggerDownloadScreenshot();
        break;
      case "c":
        event.preventDefault();
        triggerCopyScreenshot();
        break;
      case "t":
        event.preventDefault();
        triggerThumbnailDownload();
        break;
    }
  }
  function initKeyboardShortcuts() {
    document.addEventListener("keydown", handleKeyboardShortcut);
  }
  const ALL_CSS = `
${CSS$5}
${CSS$4}
${CSS$3}
${CSS$2}
${CSS$1}
${CSS}
`;
  function initializeFeatures() {
    loopVideoModule.init();
    returnDislikeModule.init();
    screenshotVideoModule.init();
    thumbnailDownloadModule.init();
    hideProgressBarModule.updateProgressBarVisibility();
    countryFlagsModule.init();
    if (window.location.pathname.includes("/shorts/")) {
      initializeShortsWithRetry();
    }
  }
  function initializeShortsWithRetry(attempts = 0, maxAttempts = 10) {
    screenshotShortsModule.init();
    if (attempts < maxAttempts) {
      setTimeout(() => {
        const hasButtons = document.querySelector(".tubeinsights-shorts-save-button") || document.querySelector(".tubeinsights-shorts-copy-button");
        if (!hasButtons && window.location.pathname.includes("/shorts/")) {
          initializeShortsWithRetry(attempts + 1, maxAttempts);
        }
      }, 100);
    }
  }
  function handleModuleSettingsUpdate() {
    loopVideoModule.cleanup();
    returnDislikeModule.cleanup();
    screenshotVideoModule.cleanup();
    thumbnailDownloadModule.cleanup();
    screenshotShortsModule.cleanup();
    hideProgressBarModule.updateProgressBarVisibility();
    countryFlagsModule.cleanup(true);
    initializeFeatures();
  }
  function initVideoModules() {
    let styleElement = document.getElementById(
      "tubeinsights-video-modules-style"
    );
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "tubeinsights-video-modules-style";
      document.head.append(styleElement);
    }
    styleElement.textContent = ALL_CSS;
    hideProgressBarModule.init();
    initKeyboardShortcuts();
    initTooltip();
    waitForVideo().then(initializeFeatures);
    window.addEventListener(
      "module-settings-updated",
      handleModuleSettingsUpdate
    );
    window.addEventListener("yt-navigate-finish", () => {
      loopVideoModule.cleanup();
      returnDislikeModule.cleanup();
      screenshotVideoModule.cleanup();
      thumbnailDownloadModule.cleanup();
      screenshotShortsModule.cleanup();
      countryFlagsModule.cleanup();
      if (window.location.pathname.includes("/shorts/")) {
        setTimeout(() => {
          returnDislikeModule.init();
          screenshotShortsModule.init();
          countryFlagsModule.init();
        }, 500);
      } else {
        waitForVideo().then(initializeFeatures);
      }
    });
    new MutationObserver((mutations) => {
      if (!window.location.pathname.includes("/shorts/")) return;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          const hasActionBar = Array.from(mutation.addedNodes).some(
            (node) => node instanceof Element && (node.matches("reel-action-bar-view-model") || node.querySelector("reel-action-bar-view-model") || node.matches("ytd-reel-video-renderer[is-active]") || node.querySelector("ytd-reel-video-renderer[is-active]"))
          );
          if (hasActionBar) {
            setTimeout(() => {
              returnDislikeModule.cleanup();
              returnDislikeModule.init();
              screenshotShortsModule.init();
            }, 50);
          }
        }
        if (mutation.type === "attributes" && mutation.attributeName === "is-active") {
          const target = mutation.target;
          if (target.matches("ytd-reel-video-renderer") && target.hasAttribute("is-active")) {
            setTimeout(() => {
              returnDislikeModule.cleanup();
              returnDislikeModule.init();
              screenshotShortsModule.init();
            }, 50);
          }
        }
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["is-active"]
    });
  }
  const styles = `@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-text-shadow-color:initial;--tw-text-shadow-alpha:100%}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-100:oklch(93.6% .032 17.717);--color-red-200:oklch(88.5% .062 18.334);--color-red-300:oklch(80.8% .114 19.571);--color-red-400:oklch(70.4% .191 22.216);--color-red-600:oklch(57.7% .245 27.325);--color-orange-400:oklch(75% .183 55.934);--color-orange-500:oklch(70.5% .213 47.604);--color-orange-600:oklch(64.6% .222 41.116);--color-orange-800:oklch(47% .157 37.304);--color-amber-300:oklch(87.9% .169 91.605);--color-yellow-100:oklch(97.3% .071 103.193);--color-yellow-400:oklch(85.2% .199 91.936);--color-yellow-600:oklch(68.1% .162 75.834);--color-lime-400:oklch(84.1% .238 128.85);--color-green-400:oklch(79.2% .209 151.711);--color-green-500:oklch(72.3% .219 149.579);--color-sky-400:oklch(74.6% .16 232.661);--color-sky-500:oklch(68.5% .169 237.323);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-200:oklch(88.2% .059 254.128);--color-blue-300:oklch(80.9% .105 251.813);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-blue-800:oklch(42.4% .199 265.638);--color-blue-900:oklch(37.9% .146 265.522);--color-indigo-500:oklch(58.5% .233 277.117);--color-indigo-600:oklch(51.1% .262 276.966);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-zinc-50:oklch(98.5% 0 0);--color-zinc-100:oklch(96.7% .001 286.375);--color-zinc-200:oklch(92% .004 286.32);--color-zinc-800:oklch(27.4% .006 286.033);--color-neutral-900:oklch(20.5% 0 0);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-xs:20rem;--container-sm:24rem;--container-md:28rem;--container-lg:32rem;--container-xl:36rem;--container-2xl:42rem;--container-3xl:48rem;--container-5xl:64rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-xl:1.25rem;--text-xl--line-height:calc(1.75/1.25);--text-2xl:1.5rem;--text-2xl--line-height:calc(2/1.5);--text-3xl:1.875rem;--text-3xl--line-height: 1.2 ;--text-4xl:2.25rem;--text-4xl--line-height:calc(2.5/2.25);--text-5xl:3rem;--text-5xl--line-height:1;--text-6xl:3.75rem;--text-6xl--line-height:1;--text-9xl:8rem;--text-9xl--line-height:1;--font-weight-thin:100;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-black:900;--tracking-wide:.025em;--tracking-wider:.05em;--tracking-widest:.1em;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--radius-2xl:1rem;--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-ping:ping 1s cubic-bezier(0,0,.2,1)infinite;--animate-bounce:bounce 1s infinite;--blur-lg:16px;--aspect-video:16/9;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}:where(:root),:root:has(input.theme-controller[value=light]:checked),[data-theme=light]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(98% 0 0);--color-base-300:oklch(95% 0 0);--color-base-content:oklch(21% .006 285.885);--color-primary:oklch(45% .24 277.023);--color-primary-content:oklch(93% .034 272.788);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}@media(prefers-color-scheme:dark){:root:not([data-theme]){color-scheme:dark;--color-base-100:oklch(25.33% .016 252.42);--color-base-200:oklch(23.26% .014 253.1);--color-base-300:oklch(21.15% .012 254.09);--color-base-content:oklch(97.807% .029 256.847);--color-primary:oklch(58% .233 277.117);--color-primary-content:oklch(96% .018 272.314);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}}:root:has(input.theme-controller[value=light]:checked),[data-theme=light]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(98% 0 0);--color-base-300:oklch(95% 0 0);--color-base-content:oklch(21% .006 285.885);--color-primary:oklch(45% .24 277.023);--color-primary-content:oklch(93% .034 272.788);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=dark]:checked),[data-theme=dark]{color-scheme:dark;--color-base-100:oklch(25.33% .016 252.42);--color-base-200:oklch(23.26% .014 253.1);--color-base-300:oklch(21.15% .012 254.09);--color-base-content:oklch(97.807% .029 256.847);--color-primary:oklch(58% .233 277.117);--color-primary-content:oklch(96% .018 272.314);--color-secondary:oklch(65% .241 354.308);--color-secondary-content:oklch(94% .028 342.258);--color-accent:oklch(77% .152 181.912);--color-accent-content:oklch(38% .063 188.416);--color-neutral:oklch(14% .005 285.823);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(71% .194 13.428);--color-error-content:oklch(27% .105 12.094);--radius-selector:.5rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=cupcake]:checked),[data-theme=cupcake]{color-scheme:light;--color-base-100:oklch(97.788% .004 56.375);--color-base-200:oklch(93.982% .007 61.449);--color-base-300:oklch(91.586% .006 53.44);--color-base-content:oklch(23.574% .066 313.189);--color-primary:oklch(85% .138 181.071);--color-primary-content:oklch(43% .078 188.216);--color-secondary:oklch(89% .061 343.231);--color-secondary-content:oklch(45% .187 3.815);--color-accent:oklch(90% .076 70.697);--color-accent-content:oklch(47% .157 37.304);--color-neutral:oklch(27% .006 286.033);--color-neutral-content:oklch(92% .004 286.32);--color-info:oklch(68% .169 237.323);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(69% .17 162.48);--color-success-content:oklch(26% .051 172.552);--color-warning:oklch(79% .184 86.047);--color-warning-content:oklch(28% .066 53.813);--color-error:oklch(64% .246 16.439);--color-error-content:oklch(27% .105 12.094);--radius-selector:1rem;--radius-field:2rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:2px;--depth:1;--noise:0}:root:has(input.theme-controller[value=bumblebee]:checked),[data-theme=bumblebee]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(97% 0 0);--color-base-300:oklch(92% 0 0);--color-base-content:oklch(20% 0 0);--color-primary:oklch(85% .199 91.936);--color-primary-content:oklch(42% .095 57.708);--color-secondary:oklch(75% .183 55.934);--color-secondary-content:oklch(40% .123 38.172);--color-accent:oklch(0% 0 0);--color-accent-content:oklch(100% 0 0);--color-neutral:oklch(37% .01 67.558);--color-neutral-content:oklch(92% .003 48.717);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(39% .09 240.876);--color-success:oklch(76% .177 163.223);--color-success-content:oklch(37% .077 168.94);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(70% .191 22.216);--color-error-content:oklch(39% .141 25.723);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=emerald]:checked),[data-theme=emerald]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(93% 0 0);--color-base-300:oklch(86% 0 0);--color-base-content:oklch(35.519% .032 262.988);--color-primary:oklch(76.662% .135 153.45);--color-primary-content:oklch(33.387% .04 162.24);--color-secondary:oklch(61.302% .202 261.294);--color-secondary-content:oklch(100% 0 0);--color-accent:oklch(72.772% .149 33.2);--color-accent-content:oklch(0% 0 0);--color-neutral:oklch(35.519% .032 262.988);--color-neutral-content:oklch(98.462% .001 247.838);--color-info:oklch(72.06% .191 231.6);--color-info-content:oklch(0% 0 0);--color-success:oklch(64.8% .15 160);--color-success-content:oklch(0% 0 0);--color-warning:oklch(84.71% .199 83.87);--color-warning-content:oklch(0% 0 0);--color-error:oklch(71.76% .221 22.18);--color-error-content:oklch(0% 0 0);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=corporate]:checked),[data-theme=corporate]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(93% 0 0);--color-base-300:oklch(86% 0 0);--color-base-content:oklch(22.389% .031 278.072);--color-primary:oklch(58% .158 241.966);--color-primary-content:oklch(100% 0 0);--color-secondary:oklch(55% .046 257.417);--color-secondary-content:oklch(100% 0 0);--color-accent:oklch(60% .118 184.704);--color-accent-content:oklch(100% 0 0);--color-neutral:oklch(0% 0 0);--color-neutral-content:oklch(100% 0 0);--color-info:oklch(60% .126 221.723);--color-info-content:oklch(100% 0 0);--color-success:oklch(62% .194 149.214);--color-success-content:oklch(100% 0 0);--color-warning:oklch(85% .199 91.936);--color-warning-content:oklch(0% 0 0);--color-error:oklch(70% .191 22.216);--color-error-content:oklch(0% 0 0);--radius-selector:.25rem;--radius-field:.25rem;--radius-box:.25rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=synthwave]:checked),[data-theme=synthwave]{color-scheme:dark;--color-base-100:oklch(15% .09 281.288);--color-base-200:oklch(20% .09 281.288);--color-base-300:oklch(25% .09 281.288);--color-base-content:oklch(78% .115 274.713);--color-primary:oklch(71% .202 349.761);--color-primary-content:oklch(28% .109 3.907);--color-secondary:oklch(82% .111 230.318);--color-secondary-content:oklch(29% .066 243.157);--color-accent:oklch(75% .183 55.934);--color-accent-content:oklch(26% .079 36.259);--color-neutral:oklch(45% .24 277.023);--color-neutral-content:oklch(87% .065 274.039);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(77% .152 181.912);--color-success-content:oklch(27% .046 192.524);--color-warning:oklch(90% .182 98.111);--color-warning-content:oklch(42% .095 57.708);--color-error:oklch(73.7% .121 32.639);--color-error-content:oklch(23.501% .096 290.329);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=retro]:checked),[data-theme=retro]{color-scheme:light;--color-base-100:oklch(91.637% .034 90.515);--color-base-200:oklch(88.272% .049 91.774);--color-base-300:oklch(84.133% .065 90.856);--color-base-content:oklch(41% .112 45.904);--color-primary:oklch(80% .114 19.571);--color-primary-content:oklch(39% .141 25.723);--color-secondary:oklch(92% .084 155.995);--color-secondary-content:oklch(44% .119 151.328);--color-accent:oklch(68% .162 75.834);--color-accent-content:oklch(41% .112 45.904);--color-neutral:oklch(44% .011 73.639);--color-neutral-content:oklch(86% .005 56.366);--color-info:oklch(58% .158 241.966);--color-info-content:oklch(96% .059 95.617);--color-success:oklch(51% .096 186.391);--color-success-content:oklch(96% .059 95.617);--color-warning:oklch(64% .222 41.116);--color-warning-content:oklch(96% .059 95.617);--color-error:oklch(70% .191 22.216);--color-error-content:oklch(40% .123 38.172);--radius-selector:.25rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=cyberpunk]:checked),[data-theme=cyberpunk]{color-scheme:light;--color-base-100:oklch(94.51% .179 104.32);--color-base-200:oklch(91.51% .179 104.32);--color-base-300:oklch(85.51% .179 104.32);--color-base-content:oklch(0% 0 0);--color-primary:oklch(74.22% .209 6.35);--color-primary-content:oklch(14.844% .041 6.35);--color-secondary:oklch(83.33% .184 204.72);--color-secondary-content:oklch(16.666% .036 204.72);--color-accent:oklch(71.86% .217 310.43);--color-accent-content:oklch(14.372% .043 310.43);--color-neutral:oklch(23.04% .065 269.31);--color-neutral-content:oklch(94.51% .179 104.32);--color-info:oklch(72.06% .191 231.6);--color-info-content:oklch(0% 0 0);--color-success:oklch(64.8% .15 160);--color-success-content:oklch(0% 0 0);--color-warning:oklch(84.71% .199 83.87);--color-warning-content:oklch(0% 0 0);--color-error:oklch(71.76% .221 22.18);--color-error-content:oklch(0% 0 0);--radius-selector:0rem;--radius-field:0rem;--radius-box:0rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=valentine]:checked),[data-theme=valentine]{color-scheme:light;--color-base-100:oklch(97% .014 343.198);--color-base-200:oklch(94% .028 342.258);--color-base-300:oklch(89% .061 343.231);--color-base-content:oklch(52% .223 3.958);--color-primary:oklch(65% .241 354.308);--color-primary-content:oklch(100% 0 0);--color-secondary:oklch(62% .265 303.9);--color-secondary-content:oklch(97% .014 308.299);--color-accent:oklch(82% .111 230.318);--color-accent-content:oklch(39% .09 240.876);--color-neutral:oklch(40% .153 2.432);--color-neutral-content:oklch(89% .061 343.231);--color-info:oklch(86% .127 207.078);--color-info-content:oklch(44% .11 240.79);--color-success:oklch(84% .143 164.978);--color-success-content:oklch(43% .095 166.913);--color-warning:oklch(75% .183 55.934);--color-warning-content:oklch(26% .079 36.259);--color-error:oklch(63% .237 25.331);--color-error-content:oklch(97% .013 17.38);--radius-selector:1rem;--radius-field:2rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=halloween]:checked),[data-theme=halloween]{color-scheme:dark;--color-base-100:oklch(21% .006 56.043);--color-base-200:oklch(14% .004 49.25);--color-base-300:oklch(0% 0 0);--color-base-content:oklch(84.955% 0 0);--color-primary:oklch(77.48% .204 60.62);--color-primary-content:oklch(19.693% .004 196.779);--color-secondary:oklch(45.98% .248 305.03);--color-secondary-content:oklch(89.196% .049 305.03);--color-accent:oklch(64.8% .223 136.073);--color-accent-content:oklch(0% 0 0);--color-neutral:oklch(24.371% .046 65.681);--color-neutral-content:oklch(84.874% .009 65.681);--color-info:oklch(54.615% .215 262.88);--color-info-content:oklch(90.923% .043 262.88);--color-success:oklch(62.705% .169 149.213);--color-success-content:oklch(12.541% .033 149.213);--color-warning:oklch(66.584% .157 58.318);--color-warning-content:oklch(13.316% .031 58.318);--color-error:oklch(65.72% .199 27.33);--color-error-content:oklch(13.144% .039 27.33);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=garden]:checked),[data-theme=garden]{color-scheme:light;--color-base-100:oklch(92.951% .002 17.197);--color-base-200:oklch(86.445% .002 17.197);--color-base-300:oklch(79.938% .001 17.197);--color-base-content:oklch(16.961% .001 17.32);--color-primary:oklch(62.45% .278 3.836);--color-primary-content:oklch(100% 0 0);--color-secondary:oklch(48.495% .11 355.095);--color-secondary-content:oklch(89.699% .022 355.095);--color-accent:oklch(56.273% .054 154.39);--color-accent-content:oklch(100% 0 0);--color-neutral:oklch(24.155% .049 89.07);--color-neutral-content:oklch(92.951% .002 17.197);--color-info:oklch(72.06% .191 231.6);--color-info-content:oklch(0% 0 0);--color-success:oklch(64.8% .15 160);--color-success-content:oklch(0% 0 0);--color-warning:oklch(84.71% .199 83.87);--color-warning-content:oklch(0% 0 0);--color-error:oklch(71.76% .221 22.18);--color-error-content:oklch(0% 0 0);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=forest]:checked),[data-theme=forest]{color-scheme:dark;--color-base-100:oklch(20.84% .008 17.911);--color-base-200:oklch(18.522% .007 17.911);--color-base-300:oklch(16.203% .007 17.911);--color-base-content:oklch(83.768% .001 17.911);--color-primary:oklch(68.628% .185 148.958);--color-primary-content:oklch(0% 0 0);--color-secondary:oklch(69.776% .135 168.327);--color-secondary-content:oklch(13.955% .027 168.327);--color-accent:oklch(70.628% .119 185.713);--color-accent-content:oklch(14.125% .023 185.713);--color-neutral:oklch(30.698% .039 171.364);--color-neutral-content:oklch(86.139% .007 171.364);--color-info:oklch(72.06% .191 231.6);--color-info-content:oklch(0% 0 0);--color-success:oklch(64.8% .15 160);--color-success-content:oklch(0% 0 0);--color-warning:oklch(84.71% .199 83.87);--color-warning-content:oklch(0% 0 0);--color-error:oklch(71.76% .221 22.18);--color-error-content:oklch(0% 0 0);--radius-selector:1rem;--radius-field:2rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=aqua]:checked),[data-theme=aqua]{color-scheme:dark;--color-base-100:oklch(37% .146 265.522);--color-base-200:oklch(28% .091 267.935);--color-base-300:oklch(22% .091 267.935);--color-base-content:oklch(90% .058 230.902);--color-primary:oklch(85.661% .144 198.645);--color-primary-content:oklch(40.124% .068 197.603);--color-secondary:oklch(60.682% .108 309.782);--color-secondary-content:oklch(96% .016 293.756);--color-accent:oklch(93.426% .102 94.555);--color-accent-content:oklch(18.685% .02 94.555);--color-neutral:oklch(27% .146 265.522);--color-neutral-content:oklch(80% .146 265.522);--color-info:oklch(54.615% .215 262.88);--color-info-content:oklch(90.923% .043 262.88);--color-success:oklch(62.705% .169 149.213);--color-success-content:oklch(12.541% .033 149.213);--color-warning:oklch(66.584% .157 58.318);--color-warning-content:oklch(27% .077 45.635);--color-error:oklch(73.95% .19 27.33);--color-error-content:oklch(14.79% .038 27.33);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=lofi]:checked),[data-theme=lofi]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(97% 0 0);--color-base-300:oklch(94% 0 0);--color-base-content:oklch(0% 0 0);--color-primary:oklch(15.906% 0 0);--color-primary-content:oklch(100% 0 0);--color-secondary:oklch(21.455% .001 17.278);--color-secondary-content:oklch(100% 0 0);--color-accent:oklch(26.861% 0 0);--color-accent-content:oklch(100% 0 0);--color-neutral:oklch(0% 0 0);--color-neutral-content:oklch(100% 0 0);--color-info:oklch(79.54% .103 205.9);--color-info-content:oklch(15.908% .02 205.9);--color-success:oklch(90.13% .153 164.14);--color-success-content:oklch(18.026% .03 164.14);--color-warning:oklch(88.37% .135 79.94);--color-warning-content:oklch(17.674% .027 79.94);--color-error:oklch(78.66% .15 28.47);--color-error-content:oklch(15.732% .03 28.47);--radius-selector:2rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=pastel]:checked),[data-theme=pastel]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(98.462% .001 247.838);--color-base-300:oklch(92.462% .001 247.838);--color-base-content:oklch(20% 0 0);--color-primary:oklch(90% .063 306.703);--color-primary-content:oklch(49% .265 301.924);--color-secondary:oklch(89% .058 10.001);--color-secondary-content:oklch(51% .222 16.935);--color-accent:oklch(90% .093 164.15);--color-accent-content:oklch(50% .118 165.612);--color-neutral:oklch(55% .046 257.417);--color-neutral-content:oklch(92% .013 255.508);--color-info:oklch(86% .127 207.078);--color-info-content:oklch(52% .105 223.128);--color-success:oklch(87% .15 154.449);--color-success-content:oklch(52% .154 150.069);--color-warning:oklch(83% .128 66.29);--color-warning-content:oklch(55% .195 38.402);--color-error:oklch(80% .114 19.571);--color-error-content:oklch(50% .213 27.518);--radius-selector:1rem;--radius-field:2rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:2px;--depth:0;--noise:0}:root:has(input.theme-controller[value=fantasy]:checked),[data-theme=fantasy]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(93% 0 0);--color-base-300:oklch(86% 0 0);--color-base-content:oklch(27.807% .029 256.847);--color-primary:oklch(37.45% .189 325.02);--color-primary-content:oklch(87.49% .037 325.02);--color-secondary:oklch(53.92% .162 241.36);--color-secondary-content:oklch(90.784% .032 241.36);--color-accent:oklch(75.98% .204 56.72);--color-accent-content:oklch(15.196% .04 56.72);--color-neutral:oklch(27.807% .029 256.847);--color-neutral-content:oklch(85.561% .005 256.847);--color-info:oklch(72.06% .191 231.6);--color-info-content:oklch(0% 0 0);--color-success:oklch(64.8% .15 160);--color-success-content:oklch(0% 0 0);--color-warning:oklch(84.71% .199 83.87);--color-warning-content:oklch(0% 0 0);--color-error:oklch(71.76% .221 22.18);--color-error-content:oklch(0% 0 0);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=wireframe]:checked),[data-theme=wireframe]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(97% 0 0);--color-base-300:oklch(94% 0 0);--color-base-content:oklch(20% 0 0);--color-primary:oklch(87% 0 0);--color-primary-content:oklch(26% 0 0);--color-secondary:oklch(87% 0 0);--color-secondary-content:oklch(26% 0 0);--color-accent:oklch(87% 0 0);--color-accent-content:oklch(26% 0 0);--color-neutral:oklch(87% 0 0);--color-neutral-content:oklch(26% 0 0);--color-info:oklch(44% .11 240.79);--color-info-content:oklch(90% .058 230.902);--color-success:oklch(43% .095 166.913);--color-success-content:oklch(90% .093 164.15);--color-warning:oklch(47% .137 46.201);--color-warning-content:oklch(92% .12 95.746);--color-error:oklch(44% .177 26.899);--color-error-content:oklch(88% .062 18.334);--radius-selector:0rem;--radius-field:.25rem;--radius-box:.25rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=black]:checked),[data-theme=black]{color-scheme:dark;--color-base-100:oklch(0% 0 0);--color-base-200:oklch(19% 0 0);--color-base-300:oklch(22% 0 0);--color-base-content:oklch(87.609% 0 0);--color-primary:oklch(35% 0 0);--color-primary-content:oklch(100% 0 0);--color-secondary:oklch(35% 0 0);--color-secondary-content:oklch(100% 0 0);--color-accent:oklch(35% 0 0);--color-accent-content:oklch(100% 0 0);--color-neutral:oklch(35% 0 0);--color-neutral-content:oklch(100% 0 0);--color-info:oklch(45.201% .313 264.052);--color-info-content:oklch(89.04% .062 264.052);--color-success:oklch(51.975% .176 142.495);--color-success-content:oklch(90.395% .035 142.495);--color-warning:oklch(96.798% .211 109.769);--color-warning-content:oklch(19.359% .042 109.769);--color-error:oklch(62.795% .257 29.233);--color-error-content:oklch(12.559% .051 29.233);--radius-selector:0rem;--radius-field:0rem;--radius-box:0rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=luxury]:checked),[data-theme=luxury]{color-scheme:dark;--color-base-100:oklch(14.076% .004 285.822);--color-base-200:oklch(20.219% .004 308.229);--color-base-300:oklch(23.219% .004 308.229);--color-base-content:oklch(75.687% .123 76.89);--color-primary:oklch(100% 0 0);--color-primary-content:oklch(20% 0 0);--color-secondary:oklch(27.581% .064 261.069);--color-secondary-content:oklch(85.516% .012 261.069);--color-accent:oklch(36.674% .051 338.825);--color-accent-content:oklch(87.334% .01 338.825);--color-neutral:oklch(24.27% .057 59.825);--color-neutral-content:oklch(93.203% .089 90.861);--color-info:oklch(79.061% .121 237.133);--color-info-content:oklch(15.812% .024 237.133);--color-success:oklch(78.119% .192 132.154);--color-success-content:oklch(15.623% .038 132.154);--color-warning:oklch(86.127% .136 102.891);--color-warning-content:oklch(17.225% .027 102.891);--color-error:oklch(71.753% .176 22.568);--color-error-content:oklch(14.35% .035 22.568);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=dracula]:checked),[data-theme=dracula]{color-scheme:dark;--color-base-100:oklch(28.822% .022 277.508);--color-base-200:oklch(26.805% .02 277.508);--color-base-300:oklch(24.787% .019 277.508);--color-base-content:oklch(97.747% .007 106.545);--color-primary:oklch(75.461% .183 346.812);--color-primary-content:oklch(15.092% .036 346.812);--color-secondary:oklch(74.202% .148 301.883);--color-secondary-content:oklch(14.84% .029 301.883);--color-accent:oklch(83.392% .124 66.558);--color-accent-content:oklch(16.678% .024 66.558);--color-neutral:oklch(39.445% .032 275.524);--color-neutral-content:oklch(87.889% .006 275.524);--color-info:oklch(88.263% .093 212.846);--color-info-content:oklch(17.652% .018 212.846);--color-success:oklch(87.099% .219 148.024);--color-success-content:oklch(17.419% .043 148.024);--color-warning:oklch(95.533% .134 112.757);--color-warning-content:oklch(19.106% .026 112.757);--color-error:oklch(68.22% .206 24.43);--color-error-content:oklch(13.644% .041 24.43);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=cmyk]:checked),[data-theme=cmyk]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(95% 0 0);--color-base-300:oklch(90% 0 0);--color-base-content:oklch(20% 0 0);--color-primary:oklch(71.772% .133 239.443);--color-primary-content:oklch(14.354% .026 239.443);--color-secondary:oklch(64.476% .202 359.339);--color-secondary-content:oklch(12.895% .04 359.339);--color-accent:oklch(94.228% .189 105.306);--color-accent-content:oklch(18.845% .037 105.306);--color-neutral:oklch(21.778% 0 0);--color-neutral-content:oklch(84.355% 0 0);--color-info:oklch(68.475% .094 217.284);--color-info-content:oklch(13.695% .018 217.284);--color-success:oklch(46.949% .162 321.406);--color-success-content:oklch(89.389% .032 321.406);--color-warning:oklch(71.236% .159 52.023);--color-warning-content:oklch(14.247% .031 52.023);--color-error:oklch(62.013% .208 28.717);--color-error-content:oklch(12.402% .041 28.717);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=autumn]:checked),[data-theme=autumn]{color-scheme:light;--color-base-100:oklch(95.814% 0 0);--color-base-200:oklch(89.107% 0 0);--color-base-300:oklch(82.4% 0 0);--color-base-content:oklch(19.162% 0 0);--color-primary:oklch(40.723% .161 17.53);--color-primary-content:oklch(88.144% .032 17.53);--color-secondary:oklch(61.676% .169 23.865);--color-secondary-content:oklch(12.335% .033 23.865);--color-accent:oklch(73.425% .094 60.729);--color-accent-content:oklch(14.685% .018 60.729);--color-neutral:oklch(54.367% .037 51.902);--color-neutral-content:oklch(90.873% .007 51.902);--color-info:oklch(69.224% .097 207.284);--color-info-content:oklch(13.844% .019 207.284);--color-success:oklch(60.995% .08 174.616);--color-success-content:oklch(12.199% .016 174.616);--color-warning:oklch(70.081% .164 56.844);--color-warning-content:oklch(14.016% .032 56.844);--color-error:oklch(53.07% .241 24.16);--color-error-content:oklch(90.614% .048 24.16);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=business]:checked),[data-theme=business]{color-scheme:dark;--color-base-100:oklch(24.353% 0 0);--color-base-200:oklch(22.648% 0 0);--color-base-300:oklch(20.944% 0 0);--color-base-content:oklch(84.87% 0 0);--color-primary:oklch(41.703% .099 251.473);--color-primary-content:oklch(88.34% .019 251.473);--color-secondary:oklch(64.092% .027 229.389);--color-secondary-content:oklch(12.818% .005 229.389);--color-accent:oklch(67.271% .167 35.791);--color-accent-content:oklch(13.454% .033 35.791);--color-neutral:oklch(27.441% .013 253.041);--color-neutral-content:oklch(85.488% .002 253.041);--color-info:oklch(62.616% .143 240.033);--color-info-content:oklch(12.523% .028 240.033);--color-success:oklch(70.226% .094 156.596);--color-success-content:oklch(14.045% .018 156.596);--color-warning:oklch(77.482% .115 81.519);--color-warning-content:oklch(15.496% .023 81.519);--color-error:oklch(51.61% .146 29.674);--color-error-content:oklch(90.322% .029 29.674);--radius-selector:0rem;--radius-field:.25rem;--radius-box:.25rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=acid]:checked),[data-theme=acid]{color-scheme:light;--color-base-100:oklch(98% 0 0);--color-base-200:oklch(95% 0 0);--color-base-300:oklch(91% 0 0);--color-base-content:oklch(0% 0 0);--color-primary:oklch(71.9% .357 330.759);--color-primary-content:oklch(14.38% .071 330.759);--color-secondary:oklch(73.37% .224 48.25);--color-secondary-content:oklch(14.674% .044 48.25);--color-accent:oklch(92.78% .264 122.962);--color-accent-content:oklch(18.556% .052 122.962);--color-neutral:oklch(21.31% .128 278.68);--color-neutral-content:oklch(84.262% .025 278.68);--color-info:oklch(60.72% .227 252.05);--color-info-content:oklch(12.144% .045 252.05);--color-success:oklch(85.72% .266 158.53);--color-success-content:oklch(17.144% .053 158.53);--color-warning:oklch(91.01% .212 100.5);--color-warning-content:oklch(18.202% .042 100.5);--color-error:oklch(64.84% .293 29.349);--color-error-content:oklch(12.968% .058 29.349);--radius-selector:1rem;--radius-field:1rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=lemonade]:checked),[data-theme=lemonade]{color-scheme:light;--color-base-100:oklch(98.71% .02 123.72);--color-base-200:oklch(91.8% .018 123.72);--color-base-300:oklch(84.89% .017 123.72);--color-base-content:oklch(19.742% .004 123.72);--color-primary:oklch(58.92% .199 134.6);--color-primary-content:oklch(11.784% .039 134.6);--color-secondary:oklch(77.75% .196 111.09);--color-secondary-content:oklch(15.55% .039 111.09);--color-accent:oklch(85.39% .201 100.73);--color-accent-content:oklch(17.078% .04 100.73);--color-neutral:oklch(30.98% .075 108.6);--color-neutral-content:oklch(86.196% .015 108.6);--color-info:oklch(86.19% .047 224.14);--color-info-content:oklch(17.238% .009 224.14);--color-success:oklch(86.19% .047 157.85);--color-success-content:oklch(17.238% .009 157.85);--color-warning:oklch(86.19% .047 102.15);--color-warning-content:oklch(17.238% .009 102.15);--color-error:oklch(86.19% .047 25.85);--color-error-content:oklch(17.238% .009 25.85);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=night]:checked),[data-theme=night]{color-scheme:dark;--color-base-100:oklch(20.768% .039 265.754);--color-base-200:oklch(19.314% .037 265.754);--color-base-300:oklch(17.86% .034 265.754);--color-base-content:oklch(84.153% .007 265.754);--color-primary:oklch(75.351% .138 232.661);--color-primary-content:oklch(15.07% .027 232.661);--color-secondary:oklch(68.011% .158 276.934);--color-secondary-content:oklch(13.602% .031 276.934);--color-accent:oklch(72.36% .176 350.048);--color-accent-content:oklch(14.472% .035 350.048);--color-neutral:oklch(27.949% .036 260.03);--color-neutral-content:oklch(85.589% .007 260.03);--color-info:oklch(68.455% .148 237.251);--color-info-content:oklch(0% 0 0);--color-success:oklch(78.452% .132 181.911);--color-success-content:oklch(15.69% .026 181.911);--color-warning:oklch(83.242% .139 82.95);--color-warning-content:oklch(16.648% .027 82.95);--color-error:oklch(71.785% .17 13.118);--color-error-content:oklch(14.357% .034 13.118);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=coffee]:checked),[data-theme=coffee]{color-scheme:dark;--color-base-100:oklch(24% .023 329.708);--color-base-200:oklch(21% .021 329.708);--color-base-300:oklch(16% .019 329.708);--color-base-content:oklch(72.354% .092 79.129);--color-primary:oklch(71.996% .123 62.756);--color-primary-content:oklch(14.399% .024 62.756);--color-secondary:oklch(34.465% .029 199.194);--color-secondary-content:oklch(86.893% .005 199.194);--color-accent:oklch(42.621% .074 224.389);--color-accent-content:oklch(88.524% .014 224.389);--color-neutral:oklch(16.51% .015 326.261);--color-neutral-content:oklch(83.302% .003 326.261);--color-info:oklch(79.49% .063 184.558);--color-info-content:oklch(15.898% .012 184.558);--color-success:oklch(74.722% .072 131.116);--color-success-content:oklch(14.944% .014 131.116);--color-warning:oklch(88.15% .14 87.722);--color-warning-content:oklch(17.63% .028 87.722);--color-error:oklch(77.318% .128 31.871);--color-error-content:oklch(15.463% .025 31.871);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=winter]:checked),[data-theme=winter]{color-scheme:light;--color-base-100:oklch(100% 0 0);--color-base-200:oklch(97.466% .011 259.822);--color-base-300:oklch(93.268% .016 262.751);--color-base-content:oklch(41.886% .053 255.824);--color-primary:oklch(56.86% .255 257.57);--color-primary-content:oklch(91.372% .051 257.57);--color-secondary:oklch(42.551% .161 282.339);--color-secondary-content:oklch(88.51% .032 282.339);--color-accent:oklch(59.939% .191 335.171);--color-accent-content:oklch(11.988% .038 335.171);--color-neutral:oklch(19.616% .063 257.651);--color-neutral-content:oklch(83.923% .012 257.651);--color-info:oklch(88.127% .085 214.515);--color-info-content:oklch(17.625% .017 214.515);--color-success:oklch(80.494% .077 197.823);--color-success-content:oklch(16.098% .015 197.823);--color-warning:oklch(89.172% .045 71.47);--color-warning-content:oklch(17.834% .009 71.47);--color-error:oklch(73.092% .11 20.076);--color-error-content:oklch(14.618% .022 20.076);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=dim]:checked),[data-theme=dim]{color-scheme:dark;--color-base-100:oklch(30.857% .023 264.149);--color-base-200:oklch(28.036% .019 264.182);--color-base-300:oklch(26.346% .018 262.177);--color-base-content:oklch(82.901% .031 222.959);--color-primary:oklch(86.133% .141 139.549);--color-primary-content:oklch(17.226% .028 139.549);--color-secondary:oklch(73.375% .165 35.353);--color-secondary-content:oklch(14.675% .033 35.353);--color-accent:oklch(74.229% .133 311.379);--color-accent-content:oklch(14.845% .026 311.379);--color-neutral:oklch(24.731% .02 264.094);--color-neutral-content:oklch(82.901% .031 222.959);--color-info:oklch(86.078% .142 206.182);--color-info-content:oklch(17.215% .028 206.182);--color-success:oklch(86.171% .142 166.534);--color-success-content:oklch(17.234% .028 166.534);--color-warning:oklch(86.163% .142 94.818);--color-warning-content:oklch(17.232% .028 94.818);--color-error:oklch(82.418% .099 33.756);--color-error-content:oklch(16.483% .019 33.756);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=nord]:checked),[data-theme=nord]{color-scheme:light;--color-base-100:oklch(95.127% .007 260.731);--color-base-200:oklch(93.299% .01 261.788);--color-base-300:oklch(89.925% .016 262.749);--color-base-content:oklch(32.437% .022 264.182);--color-primary:oklch(59.435% .077 254.027);--color-primary-content:oklch(11.887% .015 254.027);--color-secondary:oklch(69.651% .059 248.687);--color-secondary-content:oklch(13.93% .011 248.687);--color-accent:oklch(77.464% .062 217.469);--color-accent-content:oklch(15.492% .012 217.469);--color-neutral:oklch(45.229% .035 264.131);--color-neutral-content:oklch(89.925% .016 262.749);--color-info:oklch(69.207% .062 332.664);--color-info-content:oklch(13.841% .012 332.664);--color-success:oklch(76.827% .074 131.063);--color-success-content:oklch(15.365% .014 131.063);--color-warning:oklch(85.486% .089 84.093);--color-warning-content:oklch(17.097% .017 84.093);--color-error:oklch(60.61% .12 15.341);--color-error-content:oklch(12.122% .024 15.341);--radius-selector:1rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=sunset]:checked),[data-theme=sunset]{color-scheme:dark;--color-base-100:oklch(22% .019 237.69);--color-base-200:oklch(20% .019 237.69);--color-base-300:oklch(18% .019 237.69);--color-base-content:oklch(77.383% .043 245.096);--color-primary:oklch(74.703% .158 39.947);--color-primary-content:oklch(14.94% .031 39.947);--color-secondary:oklch(72.537% .177 2.72);--color-secondary-content:oklch(14.507% .035 2.72);--color-accent:oklch(71.294% .166 299.844);--color-accent-content:oklch(14.258% .033 299.844);--color-neutral:oklch(26% .019 237.69);--color-neutral-content:oklch(70% .019 237.69);--color-info:oklch(85.559% .085 206.015);--color-info-content:oklch(17.111% .017 206.015);--color-success:oklch(85.56% .085 144.778);--color-success-content:oklch(17.112% .017 144.778);--color-warning:oklch(85.569% .084 74.427);--color-warning-content:oklch(17.113% .016 74.427);--color-error:oklch(85.511% .078 16.886);--color-error-content:oklch(17.102% .015 16.886);--radius-selector:1rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:0;--noise:0}:root:has(input.theme-controller[value=caramellatte]:checked),[data-theme=caramellatte]{color-scheme:light;--color-base-100:oklch(98% .016 73.684);--color-base-200:oklch(95% .038 75.164);--color-base-300:oklch(90% .076 70.697);--color-base-content:oklch(40% .123 38.172);--color-primary:oklch(0% 0 0);--color-primary-content:oklch(100% 0 0);--color-secondary:oklch(22.45% .075 37.85);--color-secondary-content:oklch(90% .076 70.697);--color-accent:oklch(46.44% .111 37.85);--color-accent-content:oklch(90% .076 70.697);--color-neutral:oklch(55% .195 38.402);--color-neutral-content:oklch(98% .016 73.684);--color-info:oklch(42% .199 265.638);--color-info-content:oklch(90% .076 70.697);--color-success:oklch(43% .095 166.913);--color-success-content:oklch(90% .076 70.697);--color-warning:oklch(82% .189 84.429);--color-warning-content:oklch(41% .112 45.904);--color-error:oklch(70% .191 22.216);--color-error-content:oklch(39% .141 25.723);--radius-selector:2rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:2px;--depth:1;--noise:1}:root:has(input.theme-controller[value=abyss]:checked),[data-theme=abyss]{color-scheme:dark;--color-base-100:oklch(20% .08 209);--color-base-200:oklch(15% .08 209);--color-base-300:oklch(10% .08 209);--color-base-content:oklch(90% .076 70.697);--color-primary:oklch(92% .2653 125);--color-primary-content:oklch(50% .2653 125);--color-secondary:oklch(83.27% .0764 298.3);--color-secondary-content:oklch(43.27% .0764 298.3);--color-accent:oklch(43% 0 0);--color-accent-content:oklch(98% 0 0);--color-neutral:oklch(30% .08 209);--color-neutral-content:oklch(90% .076 70.697);--color-info:oklch(74% .16 232.661);--color-info-content:oklch(29% .066 243.157);--color-success:oklch(79% .209 151.711);--color-success-content:oklch(26% .065 152.934);--color-warning:oklch(84.8% .1962 84.62);--color-warning-content:oklch(44.8% .1962 84.62);--color-error:oklch(65% .1985 24.22);--color-error-content:oklch(27% .1985 24.22);--radius-selector:2rem;--radius-field:.25rem;--radius-box:.5rem;--size-selector:.25rem;--size-field:.25rem;--border:1px;--depth:1;--noise:0}:root:has(input.theme-controller[value=silk]:checked),[data-theme=silk]{color-scheme:light;--color-base-100:oklch(97% .0035 67.78);--color-base-200:oklch(95% .0081 61.42);--color-base-300:oklch(90% .0081 61.42);--color-base-content:oklch(40% .0081 61.42);--color-primary:oklch(23.27% .0249 284.3);--color-primary-content:oklch(94.22% .2505 117.44);--color-secondary:oklch(23.27% .0249 284.3);--color-secondary-content:oklch(73.92% .2135 50.94);--color-accent:oklch(23.27% .0249 284.3);--color-accent-content:oklch(88.92% .2061 189.9);--color-neutral:oklch(20% 0 0);--color-neutral-content:oklch(80% .0081 61.42);--color-info:oklch(80.39% .1148 241.68);--color-info-content:oklch(30.39% .1148 241.68);--color-success:oklch(83.92% .0901 136.87);--color-success-content:oklch(23.92% .0901 136.87);--color-warning:oklch(83.92% .1085 80);--color-warning-content:oklch(43.92% .1085 80);--color-error:oklch(75.1% .1814 22.37);--color-error-content:oklch(35.1% .1814 22.37);--radius-selector:2rem;--radius-field:.5rem;--radius-box:1rem;--size-selector:.25rem;--size-field:.25rem;--border:2px;--depth:1;--noise:0}:root{--fx-noise:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.34' numOctaves='4' stitchTiles='stitch'%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23a)' opacity='0.2'%3E%3C/rect%3E%3C/svg%3E");scrollbar-color:currentColor #0000}@supports (color:color-mix(in lab,red,red)){:root{scrollbar-color:color-mix(in oklch,currentColor 35%,#0000)#0000}}@property --radialprogress{syntax: "<percentage>"; inherits: true; initial-value: 0%;}:root:not(span){overflow:var(--page-overflow)}:root{--page-scroll-bg-on:linear-gradient(var(--root-bg),var(--root-bg))var(--root-bg)}@supports (color:color-mix(in lab,red,red)){:root{--page-scroll-bg-on:linear-gradient(var(--root-bg),var(--root-bg))color-mix(in srgb,var(--root-bg),oklch(0% 0 0) calc(var(--page-has-backdrop,0)*40%))}}:root{--page-scroll-transition-on:background-color .3s ease-out;transition:var(--page-scroll-transition);scrollbar-gutter:var(--page-scroll-gutter,unset);scrollbar-gutter:if(style(--page-has-scroll: 1): var(--page-scroll-gutter,unset); else: unset)}:root:root{background:var(--page-scroll-bg,var(--root-bg,var(--color-base-100)))}@keyframes set-page-has-scroll{0%,to{--page-has-scroll:1}}:root,[data-theme]{background-color:var(--root-bg,var(--color-base-100));color:var(--color-base-content)}:where(:root,[data-theme]){--root-bg:var(--color-base-100)}}@layer components;@layer utilities{@layer daisyui.l1.l2.l3{.diff{webkit-user-select:none;-webkit-user-select:none;user-select:none;direction:ltr;grid-template-rows:1fr 1.8rem 1fr;grid-template-columns:auto 1fr;width:100%;display:grid;position:relative;overflow:hidden;container-type:inline-size}.diff:focus-visible,.diff:has(.diff-item-1:focus-visible){outline-style:var(--tw-outline-style);outline-offset:1px;outline-width:2px;outline-color:var(--color-base-content)}.diff:focus-visible .diff-resizer{min-width:95cqi;max-width:95cqi}.diff:has(.diff-item-1:focus-visible){outline-style:var(--tw-outline-style);outline-offset:1px;outline-width:2px}.diff:has(.diff-item-1:focus-visible) .diff-resizer{min-width:5cqi;max-width:5cqi}@supports (-webkit-overflow-scrolling:touch) and (overflow:-webkit-paged-x){.diff:focus .diff-resizer{min-width:5cqi;max-width:5cqi}.diff:has(.diff-item-1:focus) .diff-resizer{min-width:95cqi;max-width:95cqi}}.modal{pointer-events:none;visibility:hidden;width:100%;max-width:none;height:100%;max-height:none;color:inherit;transition:visibility .3s allow-discrete,background-color .3s ease-out,opacity .1s ease-out;overscroll-behavior:contain;z-index:999;scrollbar-gutter:auto;background-color:#0000;place-items:center;margin:0;padding:0;display:grid;position:fixed;inset:0;overflow:clip}.modal::backdrop{display:none}:where(.drawer-side){overflow:hidden}.drawer-side{pointer-events:none;visibility:hidden;z-index:10;overscroll-behavior:contain;opacity:0;width:100%;transition:opacity .2s ease-out .1s allow-discrete,visibility .3s ease-out .1s allow-discrete;inset-inline-start:0;background-color:#0000;grid-template-rows:repeat(1,minmax(0,1fr));grid-template-columns:repeat(1,minmax(0,1fr));grid-row-start:1;grid-column-start:1;place-items:flex-start start;height:100dvh;display:grid;position:fixed;top:0}.drawer-side>.drawer-overlay{cursor:pointer;background-color:#0006;place-self:stretch stretch;position:sticky;top:0}.drawer-side>*{grid-row-start:1;grid-column-start:1}.drawer-side>:not(.drawer-overlay){will-change:transform;transition:translate .3s ease-out,width .2s ease-out;translate:-100%}[dir=rtl] :is(.drawer-side>:not(.drawer-overlay)){translate:100%}.fab{pointer-events:none;z-index:999;font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));white-space:nowrap;inset-inline-end:1rem;flex-direction:column-reverse;align-items:flex-end;gap:.5rem;display:flex;position:fixed;bottom:1rem}.fab>*{pointer-events:auto;align-items:center;gap:.5rem;display:flex}.fab>:hover,.fab>:has(:focus-visible){z-index:1}.fab>[tabindex]:first-child{transition-property:opacity,visibility,rotate;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);display:grid;position:relative}.fab .fab-close,.fab .fab-main-action{inset-inline-end:0;position:absolute;bottom:0}:is(.fab:focus-within:has(.fab-close),.fab:focus-within:has(.fab-main-action))>[tabindex]{opacity:0;rotate:90deg}.fab:focus-within>[tabindex]:first-child{pointer-events:none}.fab:focus-within>:nth-child(n+2){visibility:visible;--tw-scale-x:100%;--tw-scale-y:100%;--tw-scale-z:100%;scale:var(--tw-scale-x)var(--tw-scale-y);opacity:1}.fab>:nth-child(n+2){visibility:hidden;--tw-scale-x:80%;--tw-scale-y:80%;--tw-scale-z:80%;scale:var(--tw-scale-x)var(--tw-scale-y);opacity:0;transition-property:opacity,scale,visibility;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.fab>:nth-child(n+2).fab-main-action,.fab>:nth-child(n+2).fab-close{--tw-scale-x:100%;--tw-scale-y:100%;--tw-scale-z:100%;scale:var(--tw-scale-x)var(--tw-scale-y)}.fab>:nth-child(3){transition-delay:30ms}.fab>:nth-child(4){transition-delay:60ms}.fab>:nth-child(5){transition-delay:90ms}.fab>:nth-child(6){transition-delay:.12s}.drawer-open>.drawer-toggle:checked~.drawer-side{scrollbar-color:revert-layer}:root:has(.drawer-open>.drawer-toggle:checked){--page-overflow:revert-layer;--page-scroll-gutter:revert-layer;--page-scroll-bg:revert-layer;--page-scroll-transition:revert-layer;--page-has-backdrop:revert-layer;animation:revert-layer;animation-timeline:revert-layer}.drawer-toggle{appearance:none;opacity:0;width:0;height:0;position:fixed}:where(.drawer-toggle:checked~.drawer-side){scrollbar-color:currentColor oklch(0 0 0/calc(var(--page-has-backdrop,0)*.4))}@supports (color:color-mix(in lab,red,red)){:where(.drawer-toggle:checked~.drawer-side){scrollbar-color:color-mix(in oklch,currentColor 35%,#0000)oklch(0 0 0/calc(var(--page-has-backdrop,0)*.4))}}:where(:root:has(.drawer-toggle:checked)){--page-has-backdrop:1;--page-overflow:hidden;--page-scroll-bg:var(--page-scroll-bg-on);--page-scroll-gutter:stable;--page-scroll-transition:var(--page-scroll-transition-on);animation:forwards set-page-has-scroll;animation-timeline:scroll()}.tooltip{--tt-bg:var(--color-neutral);--tt-off: calc(100% + .5rem) ;--tt-tail: calc(100% + 1px + .25rem) ;display:inline-block;position:relative}.tooltip>.tooltip-content,.tooltip[data-tip]:before{border-radius:var(--radius-field);text-align:center;white-space:normal;max-width:20rem;color:var(--color-neutral-content);opacity:0;background-color:var(--tt-bg);pointer-events:none;z-index:2;--tw-content:attr(data-tip);content:var(--tw-content);width:max-content;padding-block:.25rem;padding-inline:.5rem;font-size:.875rem;line-height:1.25;position:absolute}.tooltip:after{opacity:0;background-color:var(--tt-bg);content:"";pointer-events:none;--mask-tooltip:url("data:image/svg+xml,%3Csvg width='10' height='4' viewBox='0 0 8 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.500009 1C3.5 1 3.00001 4 5.00001 4C7 4 6.5 1 9.5 1C10 1 10 0.499897 10 0H0C-1.99338e-08 0.5 0 1 0.500009 1Z' fill='black'/%3E%3C/svg%3E%0A");width:.625rem;height:.25rem;-webkit-mask-position:-1px 0;mask-position:-1px 0;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-image:var(--mask-tooltip);mask-image:var(--mask-tooltip);display:block;position:absolute}@media(prefers-reduced-motion:no-preference){.tooltip>.tooltip-content,.tooltip[data-tip]:before,.tooltip:after{transition:opacity .2s cubic-bezier(.4,0,.2,1) 75ms,transform .2s cubic-bezier(.4,0,.2,1) 75ms}}:is(.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))>.tooltip-content,:is(.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))[data-tip]:before,:is(.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible)):after{opacity:1;--tt-pos:0rem}@media(prefers-reduced-motion:no-preference){:is(.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))>.tooltip-content,:is(.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))[data-tip]:before,:is(.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible)):after{transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1)}}.tab{cursor:pointer;appearance:none;text-align:center;webkit-user-select:none;-webkit-user-select:none;user-select:none;flex-wrap:wrap;justify-content:center;align-items:center;display:inline-flex;position:relative}@media(hover:hover){.tab:hover{color:var(--color-base-content)}}.tab{--tab-p:.75rem;--tab-bg:var(--color-base-100);--tab-border-color:var(--color-base-300);--tab-radius-ss:0;--tab-radius-se:0;--tab-radius-es:0;--tab-radius-ee:0;--tab-order:0;--tab-radius-min:calc(.75rem - var(--border));--tab-radius-limit:min(var(--radius-field),var(--tab-radius-min));--tab-radius-grad:#0000 calc(69% - var(--border)),var(--tab-border-color)calc(calc(69% - var(--border)) + .25px),var(--tab-border-color)calc(calc(69% - var(--border)) + var(--border)),var(--tab-bg)calc(calc(69% - var(--border)) + var(--border) + .25px);order:var(--tab-order);height:var(--tab-height);border-color:#0000;padding-inline-start:var(--tab-p);padding-inline-end:var(--tab-p);font-size:.875rem}.tab:is(input[type=radio]){min-width:fit-content}.tab:is(input[type=radio]):after{--tw-content:attr(aria-label);content:var(--tw-content)}.tab:is(label){position:relative}.tab:is(label) input{cursor:pointer;appearance:none;opacity:0;position:absolute;inset:0}:is(.tab:checked,.tab:is(label:has(:checked)),.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]))+.tab-content{display:block}.tab:not(:checked,label:has(:checked),:hover,.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]){color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.tab:not(:checked,label:has(:checked),:hover,.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]){color:color-mix(in oklab,var(--color-base-content)50%,transparent)}}.tab:not(input):empty{cursor:default;flex-grow:1}.tab:focus{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.tab:focus{outline-offset:2px;outline:2px solid #0000}}.tab:focus-visible,.tab:is(label:has(:checked:focus-visible)){outline-offset:-5px;outline:2px solid}.tab[disabled]{pointer-events:none;opacity:.4}.menu{--menu-active-fg:var(--color-neutral-content);--menu-active-bg:var(--color-neutral);flex-flow:column wrap;width:fit-content;padding:.5rem;font-size:.875rem;display:flex}.menu :where(li ul){white-space:nowrap;margin-inline-start:1rem;padding-inline-start:.5rem;position:relative}.menu :where(li ul):before{background-color:var(--color-base-content);opacity:.1;width:var(--border);content:"";inset-inline-start:0;position:absolute;top:.75rem;bottom:.75rem}.menu :where(li>.menu-dropdown:not(.menu-dropdown-show)){display:none}.menu :where(li:not(.menu-title)>:not(ul,details,.menu-title,.btn)),.menu :where(li:not(.menu-title)>details>summary:not(.menu-title)){border-radius:var(--radius-field);text-align:start;text-wrap:balance;-webkit-user-select:none;user-select:none;grid-auto-columns:minmax(auto,max-content) auto max-content;grid-auto-flow:column;align-content:flex-start;align-items:center;gap:.5rem;padding-block:.375rem;padding-inline:.75rem;transition-property:color,background-color,box-shadow;transition-duration:.2s;transition-timing-function:cubic-bezier(0,0,.2,1);display:grid}.menu :where(li>details>summary){--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.menu :where(li>details>summary){outline-offset:2px;outline:2px solid #0000}}.menu :where(li>details>summary)::-webkit-details-marker{display:none}:is(.menu :where(li>details>summary),.menu :where(li>.menu-dropdown-toggle)):after{content:"";transform-origin:50%;pointer-events:none;justify-self:flex-end;width:.375rem;height:.375rem;transition-property:rotate,translate;transition-duration:.2s;display:block;translate:0 -1px;rotate:-135deg;box-shadow:inset 2px 2px}.menu details{interpolate-size:allow-keywords;overflow:hidden}.menu details::details-content{block-size:0}@media(prefers-reduced-motion:no-preference){.menu details::details-content{transition-behavior:allow-discrete;transition-property:block-size,content-visibility;transition-duration:.2s;transition-timing-function:cubic-bezier(0,0,.2,1)}}.menu details[open]::details-content{block-size:auto}.menu :where(li>details[open]>summary):after,.menu :where(li>.menu-dropdown-toggle.menu-dropdown-show):after{translate:0 1px;rotate:45deg}.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn).menu-focus,.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn):focus-visible{cursor:pointer;background-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn).menu-focus,.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn):focus-visible{background-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn).menu-focus,.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn):focus-visible{color:var(--color-base-content);--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn).menu-focus,.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title),li:not(.menu-title,.disabled)>details>summary:not(.menu-title)):not(.menu-active,:active,.btn):focus-visible{outline-offset:2px;outline:2px solid #0000}}.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title):not(.menu-active,:active,.btn):hover,li:not(.menu-title,.disabled)>details>summary:not(.menu-title):not(.menu-active,:active,.btn):hover){cursor:pointer;background-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title):not(.menu-active,:active,.btn):hover,li:not(.menu-title,.disabled)>details>summary:not(.menu-title):not(.menu-active,:active,.btn):hover){background-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title):not(.menu-active,:active,.btn):hover,li:not(.menu-title,.disabled)>details>summary:not(.menu-title):not(.menu-active,:active,.btn):hover){--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title):not(.menu-active,:active,.btn):hover,li:not(.menu-title,.disabled)>details>summary:not(.menu-title):not(.menu-active,:active,.btn):hover){outline-offset:2px;outline:2px solid #0000}}.menu :where(li:not(.menu-title,.disabled)>:not(ul,details,.menu-title):not(.menu-active,:active,.btn):hover,li:not(.menu-title,.disabled)>details>summary:not(.menu-title):not(.menu-active,:active,.btn):hover){box-shadow:inset 0 1px #00000003,inset 0 -1px #ffffff03}.menu :where(li:empty){background-color:var(--color-base-content);opacity:.1;height:1px;margin:.5rem 1rem}.menu :where(li){flex-flow:column wrap;flex-shrink:0;align-items:stretch;display:flex;position:relative}.menu :where(li) .badge{justify-self:flex-end}.menu :where(li)>:not(ul,.menu-title,details,.btn):active,.menu :where(li)>:not(ul,.menu-title,details,.btn).menu-active,.menu :where(li)>details>summary:active{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.menu :where(li)>:not(ul,.menu-title,details,.btn):active,.menu :where(li)>:not(ul,.menu-title,details,.btn).menu-active,.menu :where(li)>details>summary:active{outline-offset:2px;outline:2px solid #0000}}.menu :where(li)>:not(ul,.menu-title,details,.btn):active,.menu :where(li)>:not(ul,.menu-title,details,.btn).menu-active,.menu :where(li)>details>summary:active{color:var(--menu-active-fg);background-color:var(--menu-active-bg);background-size:auto,calc(var(--noise)*100%);background-image:none,var(--fx-noise)}:is(.menu :where(li)>:not(ul,.menu-title,details,.btn):active,.menu :where(li)>:not(ul,.menu-title,details,.btn).menu-active,.menu :where(li)>details>summary:active):not(:is(.menu :where(li)>:not(ul,.menu-title,details,.btn):active,.menu :where(li)>:not(ul,.menu-title,details,.btn).menu-active,.menu :where(li)>details>summary:active):active){box-shadow:0 2px calc(var(--depth)*3px) -2px var(--menu-active-bg)}.menu :where(li).menu-disabled{pointer-events:none;color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.menu :where(li).menu-disabled{color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.menu .dropdown:focus-within .menu-dropdown-toggle:after{translate:0 1px;rotate:45deg}.menu .dropdown-content{margin-top:.5rem;padding:.5rem}.menu .dropdown-content:before{display:none}.floating-label{display:block;position:relative}.floating-label input{display:block}.floating-label input::placeholder,.floating-label textarea::placeholder{transition:top .1s ease-out,translate .1s ease-out,scale .1s ease-out,opacity .1s ease-out}.floating-label>span{z-index:1;background-color:var(--color-base-100);opacity:0;inset-inline-start:.75rem;top:calc(var(--size-field,.25rem)*10/2);pointer-events:none;border-radius:2px;padding-inline:.25rem;font-size:.875rem;line-height:1;transition:top .1s ease-out,translate .1s ease-out,scale .1s ease-out,opacity .1s ease-out;position:absolute;translate:0 -50%}:is(.floating-label:focus-within,.floating-label:not(:has(input:placeholder-shown,textarea:placeholder-shown))) ::placeholder{opacity:0;pointer-events:auto;top:0;translate:-12.5% calc(-50% - .125em);scale:.75}:is(.floating-label:focus-within,.floating-label:not(:has(input:placeholder-shown,textarea:placeholder-shown)))>span{opacity:1;pointer-events:auto;z-index:2;top:0;translate:-12.5% calc(-50% - .125em);scale:.75}.floating-label:has(:disabled,[disabled])>span{opacity:0}.floating-label:has(.input-xs,.select-xs,.textarea-xs) span{top:calc(var(--size-field,.25rem)*6/2);font-size:.6875rem}.floating-label:has(.input-sm,.select-sm,.textarea-sm) span{top:calc(var(--size-field,.25rem)*8/2);font-size:.75rem}.floating-label:has(.input-md,.select-md,.textarea-md) span{top:calc(var(--size-field,.25rem)*10/2);font-size:.875rem}.floating-label:has(.input-lg,.select-lg,.textarea-lg) span{top:calc(var(--size-field,.25rem)*12/2);font-size:1.125rem}.floating-label:has(.input-xl,.select-xl,.textarea-xl) span{top:calc(var(--size-field,.25rem)*14/2);font-size:1.375rem}.diff-item-2{grid-row:1/span 3;grid-column-start:1;position:relative}.diff-item-2:after{pointer-events:none;z-index:2;background-color:var(--color-base-100);border-radius:3.40282e38px;position:absolute;top:50%;bottom:0;right:1px}@supports (color:color-mix(in lab,red,red)){.diff-item-2:after{background-color:color-mix(in oklab,var(--color-base-100)98%,transparent)}}.diff-item-2:after{border:2px solid var(--color-base-100);content:"";outline:1px solid var(--color-base-content);border:.5px solid #0000001f;width:1.2rem;height:1.8rem}@supports (color:color-mix(in lab,red,red)){.diff-item-2:after{outline:1px solid color-mix(in oklab,var(--color-base-content)10%,#0000)}}.diff-item-2:after{outline-offset:-3px;translate:50% -50%}.diff-item-2>*{pointer-events:none;object-fit:cover;object-position:center;width:100cqi;max-width:none;height:100%;position:absolute;top:0;bottom:0;left:0}@supports (-webkit-overflow-scrolling:touch) and (overflow:-webkit-paged-x){.diff-item-2:after{--tw-content:none;content:var(--tw-content)}}.pika-single:is(div){-webkit-user-select:none;user-select:none;z-index:999;color:var(--color-base-content);background-color:var(--color-base-100);border-radius:var(--radius-box);border:var(--border)solid var(--color-base-200);padding:.5rem;font-size:.75rem;display:inline-block;position:relative}.pika-single:is(div):before,.pika-single:is(div):after{content:"";display:table}.pika-single:is(div):after{clear:both}.pika-single:is(div).is-hidden{display:none}.pika-single:is(div).is-bound{position:absolute}.pika-single:is(div) .pika-lendar{css-float:left}.pika-single:is(div) .pika-title{text-align:center;position:relative}.pika-single:is(div) .pika-title select{cursor:pointer;z-index:999;opacity:0;margin:0;position:absolute;top:5px;left:0}.pika-single:is(div) .pika-label{z-index:999;background-color:var(--color-base-100);margin:0;padding:5px 3px;display:inline-block;position:relative;overflow:hidden}.pika-single:is(div) .pika-prev,.pika-single:is(div) .pika-next{cursor:pointer;color:#0000;border-radius:var(--radius-field);border:0;outline:none;width:2.25rem;height:2.25rem;font-size:1.2em;display:block;position:absolute;top:0}:is(.pika-single:is(div) .pika-prev,.pika-single:is(div) .pika-next):hover{background-color:var(--color-base-200)}:is(.pika-single:is(div) .pika-prev,.pika-single:is(div) .pika-next).is-disabled{cursor:default;opacity:.2}:is(.pika-single:is(div) .pika-prev,.pika-single:is(div) .pika-next):before{width:2.25rem;height:2.25rem;color:var(--color-base-content);line-height:2.25;display:inline-block}.pika-single:is(div) .pika-prev{left:0}.pika-single:is(div) .pika-prev:before{--tw-content:"‹";content:var(--tw-content)}.pika-single:is(div) .pika-next{right:0}.pika-single:is(div) .pika-next:before{--tw-content:"›";content:var(--tw-content)}.pika-single:is(div) .pika-select{display:inline-block}.pika-single:is(div) .pika-table{border-collapse:collapse;border-spacing:0;border:0;width:100%}.pika-single:is(div) .pika-table th,.pika-single:is(div) .pika-table td{padding:0}.pika-single:is(div) .pika-table th{opacity:.6;text-align:center;width:2.25rem;height:2.25rem}.pika-single:is(div) .pika-button{cursor:pointer;text-align:right;text-align:center;border:0;outline:none;width:2.25rem;height:2.25rem;margin:0;padding:5px;display:block}.pika-single:is(div) .pika-week{color:var(--color-base-content)}.pika-single:is(div) .is-today .pika-button{background:var(--color-primary);color:var(--color-primary-content)}:is(.pika-single:is(div) .is-selected,.pika-single:is(div) .has-event) .pika-button,:is(.pika-single:is(div) .is-selected,.pika-single:is(div) .has-event) .pika-button:hover{color:var(--color-base-100);background-color:var(--color-base-content);border-radius:var(--radius-field)}.pika-single:is(div) .has-event .pika-button,:is(.pika-single:is(div) .is-disabled,.pika-single:is(div) .is-inrange) .pika-button{background:var(--color-base-primary)}.pika-single:is(div) .is-startrange .pika-button,.pika-single:is(div) .is-endrange .pika-button{color:var(--color-base-100);background:var(--color-base-content);border-radius:var(--radius-field)}.pika-single:is(div) .is-disabled .pika-button{pointer-events:none;cursor:default;color:var(--color-base-content);opacity:.3}.pika-single:is(div) .is-outside-current-month .pika-button{color:var(--color-base-content);opacity:.3}.pika-single:is(div) .is-selection-disabled{pointer-events:none;cursor:default}.pika-single:is(div) .pika-button:hover,.pika-single:is(div) .pika-row.pick-whole-week:hover .pika-button{color:var(--color-base-content);background-color:var(--color-base-200);border-radius:var(--radius-field)}.pika-single:is(div) .pika-table abbr{font-weight:400;text-decoration:none}.diff-item-1{z-index:1;border-right:2px solid var(--color-base-100);grid-row:1/span 3;grid-column-start:1;position:relative;overflow:hidden}.diff-item-1:focus-visible{--tw-outline-style:none;outline-style:none}.diff-item-1>*{pointer-events:none;object-fit:cover;object-position:center;width:100cqi;max-width:none;height:100%;position:absolute;top:0;bottom:0;left:0}.dock{z-index:1;background-color:var(--color-base-100);color:currentColor;border-top:.5px solid var(--color-base-content);flex-direction:row;justify-content:space-around;align-items:center;width:100%;padding:.5rem;display:flex;position:fixed;bottom:0;left:0;right:0}@supports (color:color-mix(in lab,red,red)){.dock{border-top:.5px solid color-mix(in oklab,var(--color-base-content)5%,#0000)}}.dock{height:4rem;height:calc(4rem + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom)}.dock>*{cursor:pointer;border-radius:var(--radius-box);background-color:#0000;flex-direction:column;flex-shrink:1;flex-basis:100%;justify-content:center;align-items:center;gap:1px;max-width:8rem;height:100%;margin-bottom:.5rem;transition:opacity .2s ease-out;display:flex;position:relative}@media(hover:hover){.dock>:hover{opacity:.8}}:is(.dock>[aria-disabled=true],.dock>[disabled]),:is(.dock>[aria-disabled=true],.dock>[disabled]):hover{pointer-events:none;color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.dock>[aria-disabled=true],.dock>[disabled]),:is(.dock>[aria-disabled=true],.dock>[disabled]):hover{color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}:is(.dock>[aria-disabled=true],.dock>[disabled]),:is(.dock>[aria-disabled=true],.dock>[disabled]):hover{opacity:1}.dock>* .dock-label{font-size:.6875rem}.dock>:after{content:"";background-color:#0000;border-top:3px solid #0000;border-radius:3.40282e38px;width:1.5rem;height:.25rem;transition:background-color .1s ease-out,text-color .1s ease-out,width .1s ease-out;position:absolute;bottom:.2rem}.dropdown{position-area:var(--anchor-v,bottom)var(--anchor-h,span-right);display:inline-block;position:relative}.dropdown>:not(:has(~[class*=dropdown-content])):focus{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.dropdown>:not(:has(~[class*=dropdown-content])):focus{outline-offset:2px;outline:2px solid #0000}}.dropdown .dropdown-content{position:absolute}.dropdown.dropdown-close .dropdown-content,.dropdown:not(details,.dropdown-open,.dropdown-hover:hover,:focus-within) .dropdown-content,.dropdown.dropdown-hover:not(:hover) [tabindex]:first-child:focus:not(:focus-visible)~.dropdown-content{transform-origin:top;opacity:0;display:none;scale:95%}.dropdown[popover],.dropdown .dropdown-content{z-index:999}@media(prefers-reduced-motion:no-preference){.dropdown[popover],.dropdown .dropdown-content{transition-behavior:allow-discrete;transition-property:opacity,scale,display;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);animation:.2s dropdown}}@starting-style{.dropdown[popover],.dropdown .dropdown-content{opacity:0;scale:95%}}:is(.dropdown:not(.dropdown-close).dropdown-open,.dropdown:not(.dropdown-close):not(.dropdown-hover):focus,.dropdown:not(.dropdown-close):focus-within)>[tabindex]:first-child{pointer-events:none}:is(.dropdown:not(.dropdown-close).dropdown-open,.dropdown:not(.dropdown-close):not(.dropdown-hover):focus,.dropdown:not(.dropdown-close):focus-within) .dropdown-content,.dropdown:not(.dropdown-close).dropdown-hover:hover .dropdown-content{opacity:1;scale:100%}.dropdown:is(details) summary::-webkit-details-marker{display:none}.dropdown:where([popover]){background:0 0}.dropdown[popover]{color:inherit;position:fixed}@supports not (position-area:bottom){.dropdown[popover]{margin:auto}.dropdown[popover].dropdown-close{transform-origin:top;opacity:0;display:none;scale:95%}.dropdown[popover].dropdown-open:not(:popover-open){transform-origin:top;opacity:0;display:none;scale:95%}.dropdown[popover]::backdrop{background-color:oklab(0% none none/.3)}}:is(.dropdown[popover].dropdown-close,.dropdown[popover]:not(.dropdown-open,:popover-open)){transform-origin:top;opacity:0;display:none;scale:95%}:where(.btn){width:unset}.btn{cursor:pointer;text-align:center;vertical-align:middle;outline-offset:2px;webkit-user-select:none;-webkit-user-select:none;user-select:none;padding-inline:var(--btn-p);color:var(--btn-fg);--tw-prose-links:var(--btn-fg);height:var(--size);font-size:var(--fontsize,.875rem);outline-color:var(--btn-color,var(--color-base-content));background-color:var(--btn-bg);background-size:auto,calc(var(--noise)*100%);background-image:none,var(--btn-noise);border-width:var(--border);border-style:solid;border-color:var(--btn-border);text-shadow:0 .5px oklch(100% 0 0/calc(var(--depth)*.15));touch-action:manipulation;box-shadow:0 .5px 0 .5px oklch(100% 0 0/calc(var(--depth)*6%)) inset,var(--btn-shadow);--size:calc(var(--size-field,.25rem)*10);--btn-bg:var(--btn-color,var(--color-base-200));--btn-fg:var(--color-base-content);--btn-p:1rem;--btn-border:var(--btn-bg);border-start-start-radius:var(--join-ss,var(--radius-field));border-start-end-radius:var(--join-se,var(--radius-field));border-end-end-radius:var(--join-ee,var(--radius-field));border-end-start-radius:var(--join-es,var(--radius-field));flex-wrap:nowrap;flex-shrink:0;justify-content:center;align-items:center;gap:.375rem;font-weight:600;transition-property:color,background-color,border-color,box-shadow;transition-duration:.2s;transition-timing-function:cubic-bezier(0,0,.2,1);display:inline-flex}@supports (color:color-mix(in lab,red,red)){.btn{--btn-border:color-mix(in oklab,var(--btn-bg),#000 calc(var(--depth)*5%))}}.btn{--btn-shadow:0 3px 2px -2px var(--btn-bg),0 4px 3px -2px var(--btn-bg)}@supports (color:color-mix(in lab,red,red)){.btn{--btn-shadow:0 3px 2px -2px color-mix(in oklab,var(--btn-bg)calc(var(--depth)*30%),#0000),0 4px 3px -2px color-mix(in oklab,var(--btn-bg)calc(var(--depth)*30%),#0000)}}.btn{--btn-noise:var(--fx-noise)}@media(hover:hover){.btn:hover{--btn-bg:var(--btn-color,var(--color-base-200))}@supports (color:color-mix(in lab,red,red)){.btn:hover{--btn-bg:color-mix(in oklab,var(--btn-color,var(--color-base-200)),#000 7%)}}}.btn:focus-visible,.btn:has(:focus-visible){isolation:isolate;outline-width:2px;outline-style:solid}.btn:active:not(.btn-active){--btn-bg:var(--btn-color,var(--color-base-200));translate:0 .5px}@supports (color:color-mix(in lab,red,red)){.btn:active:not(.btn-active){--btn-bg:color-mix(in oklab,var(--btn-color,var(--color-base-200)),#000 5%)}}.btn:active:not(.btn-active){--btn-border:var(--btn-color,var(--color-base-200))}@supports (color:color-mix(in lab,red,red)){.btn:active:not(.btn-active){--btn-border:color-mix(in oklab,var(--btn-color,var(--color-base-200)),#000 7%)}}.btn:active:not(.btn-active){--btn-shadow:0 0 0 0 oklch(0% 0 0/0),0 0 0 0 oklch(0% 0 0/0)}.btn:is(input[type=checkbox],input[type=radio]){appearance:none}.btn:is(input[type=checkbox],input[type=radio])[aria-label]:after{--tw-content:attr(aria-label);content:var(--tw-content)}.btn:where(input:checked:not(.filter .btn)){--btn-color:var(--color-primary);--btn-fg:var(--color-primary-content);isolation:isolate}.loading{pointer-events:none;aspect-ratio:1;vertical-align:middle;width:calc(var(--size-selector,.25rem)*6);background-color:currentColor;display:inline-block;-webkit-mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='black' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform-origin='center'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 12 12' to='360 12 12' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dasharray' values='0,150;42,150;42,150' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dashoffset' values='0;-16;-59' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='black' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform-origin='center'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 12 12' to='360 12 12' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dasharray' values='0,150;42,150;42,150' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dashoffset' values='0;-16;-59' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");-webkit-mask-position:50%;mask-position:50%;-webkit-mask-size:100%;mask-size:100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.react-day-picker{-webkit-user-select:none;user-select:none;background-color:var(--color-base-100);border-radius:var(--radius-box);border:var(--border)solid var(--color-base-200);font-size:.75rem;display:inline-block;position:relative;overflow:clip}.react-day-picker[dir=rtl] .rdp-nav .rdp-chevron{transform-origin:50%;transform:rotate(180deg)}.react-day-picker *{box-sizing:border-box}.react-day-picker .rdp-day{text-align:center;width:2.25rem;height:2.25rem}.react-day-picker .rdp-day_button{cursor:pointer;font:inherit;color:inherit;border-radius:var(--radius-field);background:0 0;border:2px solid #0000;justify-content:center;align-items:center;width:2.25rem;height:2.25rem;margin:0;padding:0;display:flex}.react-day-picker .rdp-day_button:disabled{cursor:revert}.react-day-picker .rdp-day_button:hover{background-color:var(--color-base-200)}.react-day-picker .rdp-day_button:disabled:hover,.react-day-picker .rdp-day_button[aria-disabled=true]:hover{cursor:not-allowed;background-color:#0000}.react-day-picker .rdp-caption_label{z-index:1;white-space:nowrap;border:0;align-items:center;display:inline-flex;position:relative}.react-day-picker .rdp-button_next{border-radius:var(--radius-field)}.react-day-picker .rdp-button_next:hover{background-color:var(--color-base-200)}.react-day-picker .rdp-button_previous{border-radius:var(--radius-field)}.react-day-picker .rdp-button_previous:hover{background-color:var(--color-base-200)}.react-day-picker .rdp-button_next,.react-day-picker .rdp-button_previous{cursor:pointer;font:inherit;color:inherit;appearance:none;background:0 0;border:none;justify-content:center;align-items:center;width:2.25rem;height:2.25rem;margin:0;padding:0;display:inline-flex;position:relative}:is(.react-day-picker .rdp-button_next,.react-day-picker .rdp-button_previous):disabled,:is(.react-day-picker .rdp-button_next,.react-day-picker .rdp-button_previous)[aria-disabled=true]{cursor:revert;opacity:.5}:is(.react-day-picker .rdp-button_next,.react-day-picker .rdp-button_previous):disabled:hover,:is(.react-day-picker .rdp-button_next,.react-day-picker .rdp-button_previous)[aria-disabled=true]:hover{background-color:#0000}.react-day-picker .rdp-chevron{fill:var(--color-base-content);width:1rem;height:1rem;display:inline-block}.react-day-picker .rdp-dropdowns{align-items:center;gap:.5rem;display:inline-flex;position:relative}.react-day-picker .rdp-dropdown{z-index:2;opacity:0;appearance:none;cursor:inherit;line-height:inherit;border:none;width:100%;margin:0;padding:0;position:absolute;inset-block:0;inset-inline-start:0}.react-day-picker .rdp-dropdown:focus-visible~.rdp-caption_label{outline:5px auto highlight;outline:5px auto -webkit-focus-ring-color}.react-day-picker .rdp-dropdown_root{align-items:center;display:inline-flex;position:relative}.react-day-picker .rdp-dropdown_root[data-disabled=true] .rdp-chevron{opacity:.5}.react-day-picker .rdp-month_caption{height:2.75rem;font-size:.75rem;font-weight:inherit;place-content:center;display:flex}.react-day-picker .rdp-months{flex-wrap:wrap;gap:2rem;max-width:fit-content;padding:.5rem;display:flex;position:relative}.react-day-picker .rdp-month_grid{border-collapse:collapse}.react-day-picker .rdp-nav{inset-block-start:0;inset-inline-end:0;justify-content:space-between;align-items:center;width:100%;height:2.75rem;padding-inline:.5rem;display:flex;position:absolute;top:.25rem}.react-day-picker .rdp-weekday{opacity:.6;text-align:center;padding:.5rem 0;font-size:smaller;font-weight:500}.react-day-picker .rdp-week_number{opacity:.6;text-align:center;border:none;border-radius:100%;width:2.25rem;height:2.25rem;font-size:small;font-weight:400}.react-day-picker .rdp-today:not(.rdp-outside) .rdp-day_button{background:var(--color-primary);color:var(--color-primary-content)}.react-day-picker .rdp-selected{font-weight:inherit;font-size:.75rem}.react-day-picker .rdp-selected .rdp-day_button{color:var(--color-base-100);background-color:var(--color-base-content);border-radius:var(--radius-field);border:none}.react-day-picker .rdp-selected .rdp-day_button:hover{background-color:var(--color-base-content)}.react-day-picker .rdp-outside{opacity:.75}.react-day-picker .rdp-disabled{opacity:.5}.react-day-picker .rdp-hidden{visibility:hidden;color:var(--color-base-content)}.react-day-picker .rdp-range_start .rdp-day_button{border-radius:var(--radius-field)0 0 var(--radius-field);background-color:var(--color-base-content);color:var(--color-base-100)}.react-day-picker .rdp-range_middle{background-color:var(--color-base-200)}.react-day-picker .rdp-range_middle .rdp-day_button{border:unset;border-radius:unset;color:inherit}.react-day-picker .rdp-range_end{color:var(--color-base-content)}.react-day-picker .rdp-range_end .rdp-day_button{border-radius:0 var(--radius-field)var(--radius-field)0;background-color:var(--color-base-content);color:var(--color-base-100)}.react-day-picker .rdp-range_start.rdp-range_end{background:revert}.react-day-picker .rdp-focusable{cursor:pointer}.react-day-picker .rdp-footer{border-top:var(--border)solid var(--color-base-200);padding:.5rem}.countdown{display:inline-flex}.countdown>*{visibility:hidden;--value-v: mod(max(0,var(--value)),1000) ;--value-hundreds: round(to-zero,var(--value-v)/100,1) ;--value-tens: round(to-zero,mod(var(--value-v),100)/10,1) ;--value-ones: mod(var(--value-v),100) ;--show-hundreds:clamp(clamp(0,var(--digits,1) - 2,1),var(--value-hundreds),1);--show-tens:clamp(clamp(0,var(--digits,1) - 1,1),var(--value-tens) + var(--show-hundreds),1);--first-digits: round(to-zero,var(--value-v)/10,1) ;height:1em;width:calc(1ch + var(--show-tens)*1ch + var(--show-hundreds)*1ch);direction:ltr;transition:width .4s ease-out .2s;display:inline-block;position:relative;overflow-y:clip}.countdown>:before,.countdown>:after{visibility:visible;--tw-content:"00\\a 01\\a 02\\a 03\\a 04\\a 05\\a 06\\a 07\\a 08\\a 09\\a 10\\a 11\\a 12\\a 13\\a 14\\a 15\\a 16\\a 17\\a 18\\a 19\\a 20\\a 21\\a 22\\a 23\\a 24\\a 25\\a 26\\a 27\\a 28\\a 29\\a 30\\a 31\\a 32\\a 33\\a 34\\a 35\\a 36\\a 37\\a 38\\a 39\\a 40\\a 41\\a 42\\a 43\\a 44\\a 45\\a 46\\a 47\\a 48\\a 49\\a 50\\a 51\\a 52\\a 53\\a 54\\a 55\\a 56\\a 57\\a 58\\a 59\\a 60\\a 61\\a 62\\a 63\\a 64\\a 65\\a 66\\a 67\\a 68\\a 69\\a 70\\a 71\\a 72\\a 73\\a 74\\a 75\\a 76\\a 77\\a 78\\a 79\\a 80\\a 81\\a 82\\a 83\\a 84\\a 85\\a 86\\a 87\\a 88\\a 89\\a 90\\a 91\\a 92\\a 93\\a 94\\a 95\\a 96\\a 97\\a 98\\a 99\\a";content:var(--tw-content);font-variant-numeric:tabular-nums;white-space:pre;text-align:end;direction:rtl;transition:all 1s cubic-bezier(1,0,0,1),width .2s ease-out .2s,opacity .2s ease-out .2s;position:absolute;overflow-x:clip}.countdown>:before{width:calc(1ch + var(--show-hundreds)*1ch);top:calc(var(--first-digits)*-1em);opacity:var(--show-tens);inset-inline-end:0}.countdown>:after{width:1ch;top:calc(var(--value-ones)*-1em);inset-inline-start:0}.collapse{border-radius:var(--radius-box,1rem);isolation:isolate;grid-template-rows:max-content 0fr;grid-template-columns:minmax(0,1fr);width:100%;display:grid;position:relative;overflow:hidden}@media(prefers-reduced-motion:no-preference){.collapse{transition:grid-template-rows .2s}}.collapse>input:is([type=checkbox],[type=radio]){appearance:none;opacity:0;z-index:1;grid-row-start:1;grid-column-start:1;width:100%;min-height:1lh;padding:1rem;padding-inline-end:3rem;transition:background-color .2s ease-out}.collapse:is([open],[tabindex]:focus:not(.collapse-close),[tabindex]:focus-within:not(.collapse-close)),.collapse:not(.collapse-close):has(>input:is([type=checkbox],[type=radio]):checked){grid-template-rows:max-content 1fr}.collapse:is([open],[tabindex]:focus:not(.collapse-close),[tabindex]:focus-within:not(.collapse-close))>.collapse-content,.collapse:not(.collapse-close)>:where(input:is([type=checkbox],[type=radio]):checked~.collapse-content){content-visibility:visible;min-height:fit-content}@supports not (content-visibility:visible){.collapse:is([open],[tabindex]:focus:not(.collapse-close),[tabindex]:focus-within:not(.collapse-close))>.collapse-content,.collapse:not(.collapse-close)>:where(input:is([type=checkbox],[type=radio]):checked~.collapse-content){visibility:visible}}.collapse:focus-visible,.collapse:has(>input:is([type=checkbox],[type=radio]):focus-visible),.collapse:has(summary:focus-visible){outline-color:var(--color-base-content);outline-offset:2px;outline-width:2px;outline-style:solid}.collapse:not(.collapse-close)>input[type=checkbox],.collapse:not(.collapse-close)>input[type=radio]:not(:checked),.collapse:not(.collapse-close)>.collapse-title{cursor:pointer}:is(.collapse[tabindex]:focus:not(.collapse-close,.collapse[open]),.collapse[tabindex]:focus-within:not(.collapse-close,.collapse[open]))>.collapse-title{cursor:unset}.collapse:is([open],[tabindex]:focus:not(.collapse-close),[tabindex]:focus-within:not(.collapse-close))>:where(.collapse-content),.collapse:not(.collapse-close)>:where(input:is([type=checkbox],[type=radio]):checked~.collapse-content){padding-bottom:1rem}.collapse:is(details){width:100%}@media(prefers-reduced-motion:no-preference){.collapse:is(details)::details-content{transition:content-visibility .2s allow-discrete,visibility .2s allow-discrete,padding .2s ease-out,background-color .2s ease-out,height .2s;interpolate-size:allow-keywords;height:0}.collapse:is(details):where([open])::details-content{height:auto}}.collapse:is(details) summary{display:block;position:relative}.collapse:is(details) summary::-webkit-details-marker{display:none}.collapse:is(details)>.collapse-content{content-visibility:visible}.collapse:is(details) summary{outline:none}.collapse-content{content-visibility:hidden;min-height:0;cursor:unset;grid-row-start:2;grid-column-start:1;padding-left:1rem;padding-right:1rem}@supports not (content-visibility:hidden){.collapse-content{visibility:hidden}}@media(prefers-reduced-motion:no-preference){.collapse-content{transition:content-visibility .2s allow-discrete,visibility .2s allow-discrete,padding .2s ease-out,background-color .2s ease-out}}.validator-hint{visibility:hidden;margin-top:.5rem;font-size:.75rem}.validator:user-valid{--input-color:var(--color-success)}.validator:user-valid:focus{--input-color:var(--color-success)}.validator:user-valid:checked{--input-color:var(--color-success)}.validator:user-valid[aria-checked=true]{--input-color:var(--color-success)}.validator:user-valid:focus-within{--input-color:var(--color-success)}.validator:has(:user-valid){--input-color:var(--color-success)}.validator:has(:user-valid):focus{--input-color:var(--color-success)}.validator:has(:user-valid):checked{--input-color:var(--color-success)}.validator:has(:user-valid)[aria-checked=true]{--input-color:var(--color-success)}.validator:has(:user-valid):focus-within{--input-color:var(--color-success)}.validator:user-invalid{--input-color:var(--color-error)}.validator:user-invalid:focus{--input-color:var(--color-error)}.validator:user-invalid:checked{--input-color:var(--color-error)}.validator:user-invalid[aria-checked=true]{--input-color:var(--color-error)}.validator:user-invalid:focus-within{--input-color:var(--color-error)}.validator:user-invalid~.validator-hint{visibility:visible;color:var(--color-error)}.validator:has(:user-invalid){--input-color:var(--color-error)}.validator:has(:user-invalid):focus{--input-color:var(--color-error)}.validator:has(:user-invalid):checked{--input-color:var(--color-error)}.validator:has(:user-invalid)[aria-checked=true]{--input-color:var(--color-error)}.validator:has(:user-invalid):focus-within{--input-color:var(--color-error)}.validator:has(:user-invalid)~.validator-hint{visibility:visible;color:var(--color-error)}:is(.validator[aria-invalid]:not([aria-invalid=false]),.validator:has([aria-invalid]:not([aria-invalid=false]))),:is(.validator[aria-invalid]:not([aria-invalid=false]),.validator:has([aria-invalid]:not([aria-invalid=false]))):focus,:is(.validator[aria-invalid]:not([aria-invalid=false]),.validator:has([aria-invalid]:not([aria-invalid=false]))):checked,:is(.validator[aria-invalid]:not([aria-invalid=false]),.validator:has([aria-invalid]:not([aria-invalid=false])))[aria-checked=true],:is(.validator[aria-invalid]:not([aria-invalid=false]),.validator:has([aria-invalid]:not([aria-invalid=false]))):focus-within{--input-color:var(--color-error)}:is(.validator[aria-invalid]:not([aria-invalid=false]),.validator:has([aria-invalid]:not([aria-invalid=false])))~.validator-hint{visibility:visible;color:var(--color-error)}.radial-progress{height:var(--size);width:var(--size);vertical-align:middle;box-sizing:content-box;--value:0;--size:5rem;--thickness:calc(var(--size)/10);--radialprogress:calc(var(--value)*1%);background-color:#0000;border-radius:3.40282e38px;place-content:center;transition:--radialprogress .3s linear;display:inline-grid;position:relative}.radial-progress:before{content:"";background:radial-gradient(farthest-side,currentColor 98%,#0000)top/var(--thickness)var(--thickness)no-repeat,conic-gradient(currentColor var(--radialprogress),#0000 0);webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - var(--thickness)),#000 calc(100% + .5px - var(--thickness)));-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - var(--thickness)),#000 calc(100% + .5px - var(--thickness)));mask:radial-gradient(farthest-side,#0000 calc(100% - var(--thickness)),#000 calc(100% + .5px - var(--thickness)));border-radius:3.40282e38px;position:absolute;inset:0}.radial-progress:after{content:"";inset:calc(50% - var(--thickness)/2);transform:rotate(calc(var(--value)*3.6deg - 90deg))translate(calc(var(--size)/2 - 50%));background-color:currentColor;border-radius:3.40282e38px;transition:transform .3s linear;position:absolute}.list{flex-direction:column;font-size:.875rem;display:flex}.list .list-row{--list-grid-cols:minmax(0,auto)1fr;border-radius:var(--radius-box);word-break:break-word;grid-auto-flow:column;grid-template-columns:var(--list-grid-cols);gap:1rem;padding:1rem;display:grid;position:relative}:is(.list>:not(:last-child).list-row,.list>:not(:last-child) .list-row):after{content:"";border-bottom:var(--border)solid;inset-inline:var(--radius-box);border-color:var(--color-base-content);position:absolute;bottom:0}@supports (color:color-mix(in lab,red,red)){:is(.list>:not(:last-child).list-row,.list>:not(:last-child) .list-row):after{border-color:color-mix(in oklab,var(--color-base-content)5%,transparent)}}.toast{translate:var(--toast-x,0)var(--toast-y,0);inset-inline:auto 1rem;background-color:#0000;flex-direction:column;gap:.5rem;width:max-content;max-width:calc(100vw - 2rem);display:flex;position:fixed;top:auto;bottom:1rem}@media(prefers-reduced-motion:no-preference){.toast>*{animation:.25s ease-out toast}}.toggle{border:var(--border)solid currentColor;color:var(--input-color);cursor:pointer;appearance:none;vertical-align:middle;webkit-user-select:none;-webkit-user-select:none;user-select:none;--radius-selector-max:calc(var(--radius-selector) + var(--radius-selector) + var(--radius-selector));border-radius:calc(var(--radius-selector) + min(var(--toggle-p),var(--radius-selector-max)) + min(var(--border),var(--radius-selector-max)));padding:var(--toggle-p);flex-shrink:0;grid-template-columns:0fr 1fr 1fr;place-content:center;display:inline-grid;position:relative;box-shadow:inset 0 1px}@supports (color:color-mix(in lab,red,red)){.toggle{box-shadow:0 1px color-mix(in oklab,currentColor calc(var(--depth)*10%),#0000) inset}}.toggle{--input-color:var(--color-base-content);transition:color .3s,grid-template-columns .2s}@supports (color:color-mix(in lab,red,red)){.toggle{--input-color:color-mix(in oklab,var(--color-base-content)50%,#0000)}}.toggle{--toggle-p:calc(var(--size)*.125);--size:calc(var(--size-selector,.25rem)*6);width:calc((var(--size)*2) - (var(--border) + var(--toggle-p))*2);height:var(--size)}.toggle>*{z-index:1;cursor:pointer;appearance:none;background-color:#0000;border:none;grid-column:2/span 1;grid-row-start:1;height:100%;padding:.125rem;transition:opacity .2s,rotate .4s}.toggle>:focus{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.toggle>:focus{outline-offset:2px;outline:2px solid #0000}}.toggle>:nth-child(2){color:var(--color-base-100);rotate:none}.toggle>:nth-child(3){color:var(--color-base-100);opacity:0;rotate:-15deg}.toggle:has(:checked)>:nth-child(2){opacity:0;rotate:15deg}.toggle:has(:checked)>:nth-child(3){opacity:1;rotate:none}.toggle:before{aspect-ratio:1;border-radius:var(--radius-selector);--tw-content:"";content:var(--tw-content);height:100%;box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px currentColor;background-color:currentColor;grid-row-start:1;grid-column-start:2;transition:background-color .1s,translate .2s,inset-inline-start .2s;position:relative;inset-inline-start:0;translate:0}@supports (color:color-mix(in lab,red,red)){.toggle:before{box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px color-mix(in oklab,currentColor calc(var(--depth)*10%),#0000)}}.toggle:before{background-size:auto,calc(var(--noise)*100%);background-image:none,var(--fx-noise)}@media(forced-colors:active){.toggle:before{outline-style:var(--tw-outline-style);outline-offset:-1px;outline-width:1px}}@media print{.toggle:before{outline-offset:-1rem;outline:.25rem solid}}.toggle:focus-visible,.toggle:has(:focus-visible){outline-offset:2px;outline:2px solid}.toggle:checked,.toggle[aria-checked=true],.toggle:has(>input:checked){background-color:var(--color-base-100);--input-color:var(--color-base-content);grid-template-columns:1fr 1fr 0fr}:is(.toggle:checked,.toggle[aria-checked=true],.toggle:has(>input:checked)):before{background-color:currentColor}@starting-style{:is(.toggle:checked,.toggle[aria-checked=true],.toggle:has(>input:checked)):before{opacity:0}}.toggle:indeterminate{grid-template-columns:.5fr 1fr .5fr}.toggle:disabled{cursor:not-allowed;opacity:.3}.toggle:disabled:before{border:var(--border)solid currentColor;background-color:#0000}.input{cursor:text;border:var(--border)solid #0000;appearance:none;background-color:var(--color-base-100);vertical-align:middle;white-space:nowrap;width:clamp(3rem,20rem,100%);height:var(--size);font-size:max(var(--font-size,.875rem),.875rem);touch-action:manipulation;border-color:var(--input-color);box-shadow:0 1px var(--input-color) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset;border-start-start-radius:var(--join-ss,var(--radius-field));border-start-end-radius:var(--join-se,var(--radius-field));border-end-end-radius:var(--join-ee,var(--radius-field));border-end-start-radius:var(--join-es,var(--radius-field));flex-shrink:1;align-items:center;gap:.5rem;padding-inline:.75rem;display:inline-flex;position:relative}@supports (color:color-mix(in lab,red,red)){.input{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset}}.input{--size:calc(var(--size-field,.25rem)*10);--input-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.input{--input-color:color-mix(in oklab,var(--color-base-content)20%,#0000)}}.input:where(input){display:inline-flex}.input :where(input){appearance:none;background-color:#0000;border:none;width:100%;height:100%;display:inline-flex}.input :where(input):focus,.input :where(input):focus-within{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.input :where(input):focus,.input :where(input):focus-within{outline-offset:2px;outline:2px solid #0000}}.input :where(input[type=url]),.input :where(input[type=email]){direction:ltr}.input :where(input[type=date]){display:inline-flex}.input:focus,.input:focus-within{--input-color:var(--color-base-content);box-shadow:0 1px var(--input-color)}@supports (color:color-mix(in lab,red,red)){.input:focus,.input:focus-within{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000)}}.input:focus,.input:focus-within{outline:2px solid var(--input-color);outline-offset:2px;isolation:isolate;z-index:1}@media(pointer:coarse){@supports (-webkit-touch-callout:none){.input:focus,.input:focus-within{--font-size:1rem}}}.input:has(>input[disabled]),.input:is(:disabled,[disabled]),fieldset:disabled .input{cursor:not-allowed;border-color:var(--color-base-200);background-color:var(--color-base-200);color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.input:has(>input[disabled]),.input:is(:disabled,[disabled]),fieldset:disabled .input{color:color-mix(in oklab,var(--color-base-content)40%,transparent)}}:is(.input:has(>input[disabled]),.input:is(:disabled,[disabled]),fieldset:disabled .input)::placeholder{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.input:has(>input[disabled]),.input:is(:disabled,[disabled]),fieldset:disabled .input)::placeholder{color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.input:has(>input[disabled]),.input:is(:disabled,[disabled]),fieldset:disabled .input{box-shadow:none}.input:has(>input[disabled])>input[disabled]{cursor:not-allowed}.input::-webkit-date-and-time-value{text-align:inherit}.input[type=number]::-webkit-inner-spin-button{margin-block:-.75rem;margin-inline-end:-.75rem}.input::-webkit-calendar-picker-indicator{position:absolute;inset-inline-end:.75em}.input:has(>input[type=date]) :where(input[type=date]){webkit-appearance:none;appearance:none;display:inline-flex}.input:has(>input[type=date]) input[type=date]::-webkit-calendar-picker-indicator{cursor:pointer;width:1em;height:1em;position:absolute;inset-inline-end:.75em}.indicator{width:max-content;display:inline-flex;position:relative}.indicator :where(.indicator-item){z-index:1;white-space:nowrap;top:var(--indicator-t,0);bottom:var(--indicator-b,auto);left:var(--indicator-s,auto);right:var(--indicator-e,0);translate:var(--indicator-x,50%)var(--indicator-y,-50%);position:absolute}.table{border-collapse:separate;--tw-border-spacing-x: 0rem ;--tw-border-spacing-y: 0rem ;width:100%;border-spacing:var(--tw-border-spacing-x)var(--tw-border-spacing-y);border-radius:var(--radius-box);text-align:left;font-size:.875rem;position:relative}.table:where(:dir(rtl),[dir=rtl],[dir=rtl] *){text-align:right}@media(hover:hover){:is(.table tr.row-hover,.table tr.row-hover:nth-child(2n)):hover{background-color:var(--color-base-200)}}.table :where(th,td){vertical-align:middle;padding-block:.75rem;padding-inline:1rem}.table :where(thead,tfoot){white-space:nowrap;color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.table :where(thead,tfoot){color:color-mix(in oklab,var(--color-base-content)60%,transparent)}}.table :where(thead,tfoot){font-size:.875rem;font-weight:600}.table :where(tfoot tr:first-child :is(td,th)){border-top:var(--border)solid var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.table :where(tfoot tr:first-child :is(td,th)){border-top:var(--border)solid color-mix(in oklch,var(--color-base-content)5%,#0000)}}.table :where(.table-pin-rows thead tr){z-index:1;background-color:var(--color-base-100);position:sticky;top:0}.table :where(.table-pin-rows tfoot tr){z-index:1;background-color:var(--color-base-100);position:sticky;bottom:0}.table :where(.table-pin-cols tr th){background-color:var(--color-base-100);position:sticky;left:0;right:0}.table :where(thead tr :is(td,th),tbody tr:not(:last-child) :is(td,th)){border-bottom:var(--border)solid var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.table :where(thead tr :is(td,th),tbody tr:not(:last-child) :is(td,th)){border-bottom:var(--border)solid color-mix(in oklch,var(--color-base-content)5%,#0000)}}.steps{counter-reset:step;grid-auto-columns:1fr;grid-auto-flow:column;display:inline-grid;overflow:auto hidden}.steps .step{text-align:center;--step-bg:var(--color-base-300);--step-fg:var(--color-base-content);grid-template-rows:40px 1fr;grid-template-columns:auto;place-items:center;min-width:4rem;display:grid}.steps .step:before{width:100%;height:.5rem;color:var(--step-bg);background-color:var(--step-bg);content:"";border:1px solid;grid-row-start:1;grid-column-start:1;margin-inline-start:-100%;top:0}.steps .step>.step-icon,.steps .step:not(:has(.step-icon)):after{--tw-content:counter(step);content:var(--tw-content);counter-increment:step;z-index:1;color:var(--step-fg);background-color:var(--step-bg);border:1px solid var(--step-bg);border-radius:3.40282e38px;grid-row-start:1;grid-column-start:1;place-self:center;place-items:center;width:2rem;height:2rem;display:grid;position:relative}.steps .step:first-child:before{--tw-content:none;content:var(--tw-content)}.steps .step[data-content]:after{--tw-content:attr(data-content);content:var(--tw-content)}.range{appearance:none;webkit-appearance:none;--range-thumb:var(--color-base-100);--range-thumb-size:calc(var(--size-selector,.25rem)*6);--range-progress:currentColor;--range-fill:1;--range-p:.25rem;--range-bg:currentColor}@supports (color:color-mix(in lab,red,red)){.range{--range-bg:color-mix(in oklab,currentColor 10%,#0000)}}.range{cursor:pointer;vertical-align:middle;--radius-selector-max:calc(var(--radius-selector) + var(--radius-selector) + var(--radius-selector));border-radius:calc(var(--radius-selector) + min(var(--range-p),var(--radius-selector-max)));width:clamp(3rem,20rem,100%);height:var(--range-thumb-size);background-color:#0000;border:none;overflow:hidden}[dir=rtl] .range{--range-dir:-1}.range:focus{outline:none}.range:focus-visible{outline-offset:2px;outline:2px solid}.range::-webkit-slider-runnable-track{background-color:var(--range-bg);border-radius:var(--radius-selector);width:100%;height:calc(var(--range-thumb-size)*.5)}@media(forced-colors:active){.range::-webkit-slider-runnable-track{border:1px solid}.range::-moz-range-track{border:1px solid}}.range::-webkit-slider-thumb{box-sizing:border-box;border-radius:calc(var(--radius-selector) + min(var(--range-p),var(--radius-selector-max)));background-color:var(--range-thumb);height:var(--range-thumb-size);width:var(--range-thumb-size);border:var(--range-p)solid;appearance:none;webkit-appearance:none;color:var(--range-progress);box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px currentColor,0 0 0 2rem var(--range-thumb) inset,calc((var(--range-dir,1)*-100rem) - (var(--range-dir,1)*var(--range-thumb-size)/2)) 0 0 calc(100rem*var(--range-fill));position:relative;top:50%;transform:translateY(-50%)}@supports (color:color-mix(in lab,red,red)){.range::-webkit-slider-thumb{box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px color-mix(in oklab,currentColor calc(var(--depth)*10%),#0000),0 0 0 2rem var(--range-thumb) inset,calc((var(--range-dir,1)*-100rem) - (var(--range-dir,1)*var(--range-thumb-size)/2)) 0 0 calc(100rem*var(--range-fill))}}.range::-moz-range-track{background-color:var(--range-bg);border-radius:var(--radius-selector);width:100%;height:calc(var(--range-thumb-size)*.5)}.range::-moz-range-thumb{box-sizing:border-box;border-radius:calc(var(--radius-selector) + min(var(--range-p),var(--radius-selector-max)));height:var(--range-thumb-size);width:var(--range-thumb-size);border:var(--range-p)solid;color:var(--range-progress);box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px currentColor,0 0 0 2rem var(--range-thumb) inset,calc((var(--range-dir,1)*-100rem) - (var(--range-dir,1)*var(--range-thumb-size)/2)) 0 0 calc(100rem*var(--range-fill));background-color:currentColor;position:relative;top:50%}@supports (color:color-mix(in lab,red,red)){.range::-moz-range-thumb{box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px color-mix(in oklab,currentColor calc(var(--depth)*10%),#0000),0 0 0 2rem var(--range-thumb) inset,calc((var(--range-dir,1)*-100rem) - (var(--range-dir,1)*var(--range-thumb-size)/2)) 0 0 calc(100rem*var(--range-fill))}}.range:disabled{cursor:not-allowed;opacity:.3}.chat-bubble{border-radius:var(--radius-field);background-color:var(--color-base-300);width:fit-content;color:var(--color-base-content);grid-row-end:3;min-width:2.5rem;max-width:90%;min-height:2rem;padding-block:.5rem;padding-inline:1rem;display:block;position:relative}.chat-bubble:before{background-color:inherit;content:"";width:.75rem;height:.75rem;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-image:var(--mask-chat);mask-image:var(--mask-chat);position:absolute;bottom:0;-webkit-mask-position:0 -1px;mask-position:0 -1px;-webkit-mask-size:.8125rem;mask-size:.8125rem}.diff-resizer{isolation:isolate;z-index:2;resize:horizontal;opacity:0;cursor:ew-resize;transform-origin:100% 100%;clip-path:inset(calc(100% - .75rem) 0 0 calc(100% - .75rem));grid-row-start:2;grid-column-start:1;width:50cqi;min-width:1rem;max-width:calc(100cqi - 1rem);height:.75rem;transition:min-width .3s ease-out,max-width .3s ease-out;position:relative;overflow:hidden;transform:scaleY(5)translate(.32rem,50%)}.select{border:var(--border)solid #0000;appearance:none;background-color:var(--color-base-100);vertical-align:middle;width:clamp(3rem,20rem,100%);height:var(--size);touch-action:manipulation;white-space:nowrap;text-overflow:ellipsis;box-shadow:0 1px var(--input-color) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 20px) calc(1px + 50%),calc(100% - 16.1px) calc(1px + 50%);background-repeat:no-repeat;background-size:4px 4px,4px 4px;border-start-start-radius:var(--join-ss,var(--radius-field));border-start-end-radius:var(--join-se,var(--radius-field));border-end-end-radius:var(--join-ee,var(--radius-field));border-end-start-radius:var(--join-es,var(--radius-field));flex-shrink:1;align-items:center;gap:.375rem;padding-inline:.75rem 1.75rem;font-size:.875rem;display:inline-flex;position:relative;overflow:hidden}@supports (color:color-mix(in lab,red,red)){.select{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset}}.select{border-color:var(--input-color);--input-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.select{--input-color:color-mix(in oklab,var(--color-base-content)20%,#0000)}}.select{--size:calc(var(--size-field,.25rem)*10)}[dir=rtl] .select{background-position:12px calc(1px + 50%),16px calc(1px + 50%)}[dir=rtl] .select::picker(select){translate:.5rem}[dir=rtl] .select select::picker(select){translate:.5rem}.select[multiple]{background-image:none;height:auto;padding-block:.75rem;padding-inline-end:.75rem;overflow:auto}.select select{appearance:none;width:calc(100% + 2.75rem);height:calc(100% - calc(var(--border)*2));background:inherit;border-radius:inherit;border-style:none;align-items:center;margin-inline:-.75rem -1.75rem;padding-inline:.75rem 1.75rem}.select select:focus,.select select:focus-within{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.select select:focus,.select select:focus-within{outline-offset:2px;outline:2px solid #0000}}.select select:not(:last-child){background-image:none;margin-inline-end:-1.375rem}.select:focus,.select:focus-within{--input-color:var(--color-base-content);box-shadow:0 1px var(--input-color)}@supports (color:color-mix(in lab,red,red)){.select:focus,.select:focus-within{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000)}}.select:focus,.select:focus-within{outline:2px solid var(--input-color);outline-offset:2px;isolation:isolate;z-index:1}.select:has(>select[disabled]),.select:is(:disabled,[disabled]),fieldset:disabled .select{cursor:not-allowed;border-color:var(--color-base-200);background-color:var(--color-base-200);color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.select:has(>select[disabled]),.select:is(:disabled,[disabled]),fieldset:disabled .select{color:color-mix(in oklab,var(--color-base-content)40%,transparent)}}:is(.select:has(>select[disabled]),.select:is(:disabled,[disabled]),fieldset:disabled .select)::placeholder{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.select:has(>select[disabled]),.select:is(:disabled,[disabled]),fieldset:disabled .select)::placeholder{color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.select:has(>select[disabled])>select[disabled]{cursor:not-allowed}@supports (appearance:base-select){.select,.select select{appearance:base-select}:is(.select,.select select)::picker(select){appearance:base-select}}:is(.select,.select select)::picker(select){color:inherit;border:var(--border)solid var(--color-base-200);border-radius:var(--radius-box);background-color:inherit;max-height:min(24rem,70dvh);box-shadow:0 2px calc(var(--depth)*3px) -2px #0003;box-shadow:0 20px 25px -5px rgb(0 0 0/calc(var(--depth)*.1)),0 8px 10px -6px rgb(0 0 0/calc(var(--depth)*.1));margin-block:.5rem;margin-inline:.5rem;padding:.5rem;translate:-.5rem}:is(.select,.select select)::picker-icon{display:none}:is(.select,.select select) optgroup{padding-top:.5em}:is(.select,.select select) optgroup option:first-child{margin-top:.5em}:is(.select,.select select) option{border-radius:var(--radius-field);white-space:normal;padding-block:.375rem;padding-inline:.75rem;transition-property:color,background-color;transition-duration:.2s;transition-timing-function:cubic-bezier(0,0,.2,1)}:is(.select,.select select) option:not(:disabled):hover,:is(.select,.select select) option:not(:disabled):focus-visible{cursor:pointer;background-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.select,.select select) option:not(:disabled):hover,:is(.select,.select select) option:not(:disabled):focus-visible{background-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}:is(.select,.select select) option:not(:disabled):hover,:is(.select,.select select) option:not(:disabled):focus-visible{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){:is(.select,.select select) option:not(:disabled):hover,:is(.select,.select select) option:not(:disabled):focus-visible{outline-offset:2px;outline:2px solid #0000}}:is(.select,.select select) option:not(:disabled):active{background-color:var(--color-neutral);color:var(--color-neutral-content);box-shadow:0 2px calc(var(--depth)*3px) -2px var(--color-neutral)}.timeline{display:flex;position:relative}.timeline>li{grid-template-rows:var(--timeline-row-start,minmax(0,1fr))auto var(--timeline-row-end,minmax(0,1fr));grid-template-columns:var(--timeline-col-start,minmax(0,1fr))auto var(--timeline-col-end,minmax(0,1fr));flex-shrink:0;align-items:center;display:grid;position:relative}.timeline>li>hr{border:none;width:100%}.timeline>li>hr:first-child{grid-row-start:2;grid-column-start:1}.timeline>li>hr:last-child{grid-area:2/3/auto/none}@media print{.timeline>li>hr{border:.1px solid var(--color-base-300)}}.timeline :where(hr){background-color:var(--color-base-300);height:.25rem}.timeline:has(.timeline-middle hr):first-child{border-start-start-radius:0;border-start-end-radius:var(--radius-selector);border-end-end-radius:var(--radius-selector);border-end-start-radius:0}.timeline:has(.timeline-middle hr):last-child,.timeline:not(:has(.timeline-middle)) :first-child hr:last-child{border-start-start-radius:var(--radius-selector);border-start-end-radius:0;border-end-end-radius:0;border-end-start-radius:var(--radius-selector)}.timeline:not(:has(.timeline-middle)) :last-child hr:first-child{border-start-start-radius:0;border-start-end-radius:var(--radius-selector);border-end-end-radius:var(--radius-selector);border-end-start-radius:0}.swap{cursor:pointer;vertical-align:middle;webkit-user-select:none;-webkit-user-select:none;user-select:none;place-content:center;display:inline-grid;position:relative}.swap input{appearance:none;border:none}.swap>*{grid-row-start:1;grid-column-start:1}@media(prefers-reduced-motion:no-preference){.swap>*{transition-property:transform,rotate,opacity;transition-duration:.2s;transition-timing-function:cubic-bezier(0,0,.2,1)}}.swap .swap-on,.swap .swap-indeterminate,.swap input:indeterminate~.swap-on,.swap input:is(:checked,:indeterminate)~.swap-off{opacity:0}.swap input:checked~.swap-on,.swap input:indeterminate~.swap-indeterminate{opacity:1;backface-visibility:visible}.collapse-title{grid-row-start:1;grid-column-start:1;width:100%;min-height:1lh;padding:1rem;padding-inline-end:3rem;transition:background-color .2s ease-out;position:relative}.mockup-browser{border-radius:var(--radius-box);position:relative;overflow:auto hidden}.mockup-browser pre[data-prefix]:before{--tw-content:attr(data-prefix);content:var(--tw-content);text-align:right;display:inline-block}.mockup-browser .mockup-browser-toolbar{align-items:center;width:100%;margin-block:.75rem;padding-right:1.4em;display:inline-flex}.mockup-browser .mockup-browser-toolbar:where(:dir(rtl),[dir=rtl],[dir=rtl] *){flex-direction:row-reverse}.mockup-browser .mockup-browser-toolbar:before{content:"";aspect-ratio:1;opacity:.3;border-radius:3.40282e38px;height:.75rem;margin-right:4.8rem;display:inline-block;box-shadow:1.4em 0,2.8em 0,4.2em 0}.mockup-browser .mockup-browser-toolbar .input{background-color:var(--color-base-200);text-overflow:ellipsis;white-space:nowrap;direction:ltr;align-items:center;gap:.5rem;height:100%;margin-inline:auto;font-size:.75rem;display:flex;overflow:hidden}.mockup-browser .mockup-browser-toolbar .input:before{content:"";opacity:.5;background-color:currentColor;width:1rem;height:1rem;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z' clip-rule='evenodd' /%3E%3C/svg%3E") 50%/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z' clip-rule='evenodd' /%3E%3C/svg%3E") 50%/contain no-repeat}.mockup-code{border-radius:var(--radius-box);background-color:var(--color-neutral);color:var(--color-neutral-content);direction:ltr;padding-block:1.25rem;font-size:.875rem;position:relative;overflow:auto hidden}.mockup-code:before{content:"";opacity:.3;border-radius:3.40282e38px;width:.75rem;height:.75rem;margin-bottom:1rem;display:block;box-shadow:1.4em 0,2.8em 0,4.2em 0}.mockup-code pre{padding-right:1.25rem}.mockup-code pre:before{content:"";margin-right:2ch}.mockup-code pre[data-prefix]:before{--tw-content:attr(data-prefix);content:var(--tw-content);text-align:right;opacity:.5;width:2rem;display:inline-block}.mockup-window{border-radius:var(--radius-box);flex-direction:column;padding-top:1.25rem;display:flex;position:relative;overflow:auto hidden}.mockup-window:before{content:"";aspect-ratio:1;opacity:.3;border-radius:3.40282e38px;flex-shrink:0;align-self:flex-start;height:.75rem;margin-bottom:1rem;display:block;box-shadow:1.4em 0,2.8em 0,4.2em 0}[dir=rtl] .mockup-window:before{align-self:flex-end}.mockup-window pre[data-prefix]:before{--tw-content:attr(data-prefix);content:var(--tw-content);text-align:right;display:inline-block}.avatar{vertical-align:middle;display:inline-flex;position:relative}.avatar>div{aspect-ratio:1;display:block;overflow:hidden}.avatar img{object-fit:cover;width:100%;height:100%}.checkbox{border:var(--border)solid var(--input-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.checkbox{border:var(--border)solid var(--input-color,color-mix(in oklab,var(--color-base-content)20%,#0000))}}.checkbox{cursor:pointer;appearance:none;border-radius:var(--radius-selector);vertical-align:middle;color:var(--color-base-content);box-shadow:0 1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 0 #0000 inset,0 0 #0000;--size:calc(var(--size-selector,.25rem)*6);width:var(--size);height:var(--size);background-size:auto,calc(var(--noise)*100%);background-image:none,var(--fx-noise);flex-shrink:0;padding:.25rem;transition:background-color .2s,box-shadow .2s;display:inline-block;position:relative}.checkbox:before{--tw-content:"";content:var(--tw-content);opacity:0;clip-path:polygon(20% 100%,20% 80%,50% 80%,50% 80%,70% 80%,70% 100%);width:100%;height:100%;box-shadow:0 3px oklch(100% 0 0/calc(var(--depth)*.1)) inset;background-color:currentColor;font-size:1rem;line-height:.75;transition:clip-path .3s .1s,opacity .1s .1s,rotate .3s .1s,translate .3s .1s;display:block;rotate:45deg}.checkbox:focus-visible{outline:2px solid var(--input-color,currentColor);outline-offset:2px}.checkbox:checked,.checkbox[aria-checked=true]{background-color:var(--input-color,#0000);box-shadow:0 0 #0000 inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px oklch(0% 0 0/calc(var(--depth)*.1))}:is(.checkbox:checked,.checkbox[aria-checked=true]):before{clip-path:polygon(20% 100%,20% 80%,50% 80%,50% 0%,70% 0%,70% 100%);opacity:1}@media(forced-colors:active){:is(.checkbox:checked,.checkbox[aria-checked=true]):before{--tw-content:"✔︎";clip-path:none;background-color:#0000;rotate:none}}@media print{:is(.checkbox:checked,.checkbox[aria-checked=true]):before{--tw-content:"✔︎";clip-path:none;background-color:#0000;rotate:none}}.checkbox:indeterminate{background-color:var(--input-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.checkbox:indeterminate{background-color:var(--input-color,color-mix(in oklab,var(--color-base-content)20%,#0000))}}.checkbox:indeterminate:before{opacity:1;clip-path:polygon(20% 100%,20% 80%,50% 80%,50% 80%,80% 80%,80% 100%);translate:0 -35%;rotate:none}.checkbox\\!{border:var(--border)solid var(--input-color,var(--color-base-content))!important}@supports (color:color-mix(in lab,red,red)){.checkbox\\!{border:var(--border)solid var(--input-color,color-mix(in oklab,var(--color-base-content)20%,#0000))!important}}.checkbox\\!{cursor:pointer!important;appearance:none!important;border-radius:var(--radius-selector)!important;vertical-align:middle!important;color:var(--color-base-content)!important;box-shadow:0 1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 0 #0000 inset,0 0 #0000!important;--size:calc(var(--size-selector,.25rem)*6)!important;width:var(--size)!important;height:var(--size)!important;background-size:auto,calc(var(--noise)*100%)!important;background-image:none,var(--fx-noise)!important;flex-shrink:0!important;padding:.25rem!important;transition:background-color .2s,box-shadow .2s!important;display:inline-block!important;position:relative!important}.checkbox\\!:before{--tw-content:""!important;content:var(--tw-content)!important;opacity:0!important;clip-path:polygon(20% 100%,20% 80%,50% 80%,50% 80%,70% 80%,70% 100%)!important;width:100%!important;height:100%!important;box-shadow:0 3px oklch(100% 0 0/calc(var(--depth)*.1)) inset!important;background-color:currentColor!important;font-size:1rem!important;line-height:.75!important;transition:clip-path .3s .1s,opacity .1s .1s,rotate .3s .1s,translate .3s .1s!important;display:block!important;rotate:45deg!important}.checkbox\\!:focus-visible{outline:2px solid var(--input-color,currentColor)!important;outline-offset:2px!important}.checkbox\\!:checked,.checkbox\\![aria-checked=true]{background-color:var(--input-color,#0000)!important;box-shadow:0 0 #0000 inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px oklch(0% 0 0/calc(var(--depth)*.1))!important}:is(.checkbox\\!:checked,.checkbox\\![aria-checked=true]):before{clip-path:polygon(20% 100%,20% 80%,50% 80%,50% 0%,70% 0%,70% 100%)!important;opacity:1!important}@media(forced-colors:active){:is(.checkbox\\!:checked,.checkbox\\![aria-checked=true]):before{--tw-content:"✔︎"!important;clip-path:none!important;background-color:#0000!important;rotate:none!important}}@media print{:is(.checkbox\\!:checked,.checkbox\\![aria-checked=true]):before{--tw-content:"✔︎"!important;clip-path:none!important;background-color:#0000!important;rotate:none!important}}.checkbox\\!:indeterminate{background-color:var(--input-color,var(--color-base-content))!important}@supports (color:color-mix(in lab,red,red)){.checkbox\\!:indeterminate{background-color:var(--input-color,color-mix(in oklab,var(--color-base-content)20%,#0000))!important}}.checkbox\\!:indeterminate:before{opacity:1!important;clip-path:polygon(20% 100%,20% 80%,50% 80%,50% 80%,80% 80%,80% 100%)!important;translate:0 -35%!important;rotate:none!important}.radio{cursor:pointer;appearance:none;vertical-align:middle;border:var(--border)solid var(--input-color,currentColor);border-radius:3.40282e38px;flex-shrink:0;padding:.25rem;display:inline-block;position:relative}@supports (color:color-mix(in lab,red,red)){.radio{border:var(--border)solid var(--input-color,color-mix(in srgb,currentColor 20%,#0000))}}.radio{box-shadow:0 1px oklch(0% 0 0/calc(var(--depth)*.1)) inset;--size:calc(var(--size-selector,.25rem)*6);width:var(--size);height:var(--size);color:var(--input-color,currentColor)}.radio:before{--tw-content:"";content:var(--tw-content);background-size:auto,calc(var(--noise)*100%);background-image:none,var(--fx-noise);border-radius:3.40282e38px;width:100%;height:100%;display:block}.radio:focus-visible{outline:2px solid}.radio:checked,.radio[aria-checked=true]{background-color:var(--color-base-100);border-color:currentColor}@media(prefers-reduced-motion:no-preference){.radio:checked,.radio[aria-checked=true]{animation:.2s ease-out radio}}:is(.radio:checked,.radio[aria-checked=true]):before{box-shadow:0 -1px oklch(0% 0 0/calc(var(--depth)*.1)) inset,0 8px 0 -4px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px oklch(0% 0 0/calc(var(--depth)*.1));background-color:currentColor}@media(forced-colors:active){:is(.radio:checked,.radio[aria-checked=true]):before{outline-style:var(--tw-outline-style);outline-offset:-1px;outline-width:1px}}@media print{:is(.radio:checked,.radio[aria-checked=true]):before{outline-offset:-1rem;outline:.25rem solid}}.rating{vertical-align:middle;display:inline-flex;position:relative}.rating input{appearance:none;border:none}.rating :where(*){background-color:var(--color-base-content);opacity:.2;border-radius:0;width:1.5rem;height:1.5rem}@media(prefers-reduced-motion:no-preference){.rating :where(*){animation:.25s ease-out rating}}.rating :where(*):is(input){cursor:pointer}.rating .rating-hidden{background-color:#0000;width:.5rem}.rating input[type=radio]:checked{background-image:none}.rating :checked,.rating [aria-checked=true],.rating [aria-current=true],.rating :has(~:checked,~[aria-checked=true],~[aria-current=true]){opacity:1}.rating :focus-visible{scale:1.1}@media(prefers-reduced-motion:no-preference){.rating :focus-visible{transition:scale .2s ease-out}}.rating :active:focus{animation:none;scale:1.1}.navbar{align-items:center;width:100%;min-height:4rem;padding:.5rem;display:flex}.drawer{grid-auto-columns:max-content auto;width:100%;display:grid;position:relative}.card{border-radius:var(--radius-box);outline-offset:2px;outline:0 solid #0000;flex-direction:column;transition:outline .2s ease-in-out;display:flex;position:relative}.card:focus{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.card:focus{outline-offset:2px;outline:2px solid #0000}}.card:focus-visible{outline-color:currentColor}.card :where(figure:first-child){border-start-start-radius:inherit;border-start-end-radius:inherit;border-end-end-radius:unset;border-end-start-radius:unset;overflow:hidden}.card :where(figure:last-child){border-start-start-radius:unset;border-start-end-radius:unset;border-end-end-radius:inherit;border-end-start-radius:inherit;overflow:hidden}.card figure{justify-content:center;align-items:center;display:flex}.card:has(>input:is(input[type=checkbox],input[type=radio])){cursor:pointer;-webkit-user-select:none;user-select:none}.card:has(>:checked){outline:2px solid}.stats{border-radius:var(--radius-box);grid-auto-flow:column;display:inline-grid;position:relative;overflow-x:auto}.progress{appearance:none;border-radius:var(--radius-box);background-color:currentColor;width:100%;height:.5rem;position:relative;overflow:hidden}@supports (color:color-mix(in lab,red,red)){.progress{background-color:color-mix(in oklab,currentcolor 20%,transparent)}}.progress{color:var(--color-base-content)}.progress:indeterminate{background-image:repeating-linear-gradient(90deg,currentColor -1% 10%,#0000 10% 90%);background-position-x:15%;background-size:200%}@media(prefers-reduced-motion:no-preference){.progress:indeterminate{animation:5s ease-in-out infinite progress}}@supports ((-moz-appearance:none)){.progress:indeterminate::-moz-progress-bar{background-color:#0000}@media(prefers-reduced-motion:no-preference){.progress:indeterminate::-moz-progress-bar{background-image:repeating-linear-gradient(90deg,currentColor -1% 10%,#0000 10% 90%);background-position-x:15%;background-size:200%;animation:5s ease-in-out infinite progress}}.progress::-moz-progress-bar{border-radius:var(--radius-box);background-color:currentColor}}@supports ((-webkit-appearance:none)){.progress::-webkit-progress-bar{border-radius:var(--radius-box);background-color:#0000}.progress::-webkit-progress-value{border-radius:var(--radius-box);background-color:currentColor}}.modal-toggle{appearance:none;opacity:0;width:0;height:0;position:fixed}.file-input{cursor:pointer;border:var(--border)solid #0000;appearance:none;background-color:var(--color-base-100);vertical-align:middle;webkit-user-select:none;-webkit-user-select:none;user-select:none;width:clamp(3rem,20rem,100%);height:var(--size);border-color:var(--input-color);box-shadow:0 1px var(--input-color) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset;border-start-start-radius:var(--join-ss,var(--radius-field));border-start-end-radius:var(--join-se,var(--radius-field));border-end-end-radius:var(--join-ee,var(--radius-field));border-end-start-radius:var(--join-es,var(--radius-field));align-items:center;padding-inline-end:.75rem;font-size:.875rem;line-height:2;display:inline-flex}@supports (color:color-mix(in lab,red,red)){.file-input{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset}}.file-input{--size:calc(var(--size-field,.25rem)*10);--input-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.file-input{--input-color:color-mix(in oklab,var(--color-base-content)20%,#0000)}}.file-input::file-selector-button{cursor:pointer;webkit-user-select:none;-webkit-user-select:none;user-select:none;height:calc(100% + var(--border)*2);margin-inline-end:1rem;margin-block:calc(var(--border)*-1);color:var(--btn-fg);border-width:var(--border);border-style:solid;border-color:var(--btn-border);background-color:var(--btn-bg);background-size:calc(var(--noise)*100%);background-image:var(--btn-noise);text-shadow:0 .5px oklch(1 0 0/calc(var(--depth)*.15));box-shadow:0 .5px 0 .5px #fff inset,var(--btn-shadow);border-start-start-radius:calc(var(--join-ss,var(--radius-field) - var(--border)));border-end-start-radius:calc(var(--join-es,var(--radius-field) - var(--border)));margin-inline-start:calc(var(--border)*-1);padding-inline:1rem;font-size:.875rem;font-weight:600}@supports (color:color-mix(in lab,red,red)){.file-input::file-selector-button{box-shadow:0 .5px 0 .5px color-mix(in oklab,color-mix(in oklab,white 30%,var(--btn-bg))calc(var(--depth)*20%),#0000) inset,var(--btn-shadow)}}.file-input::file-selector-button{--size:calc(var(--size-field,.25rem)*10);--btn-bg:var(--btn-color,var(--color-base-200));--btn-fg:var(--color-base-content);--btn-border:var(--btn-bg)}@supports (color:color-mix(in lab,red,red)){.file-input::file-selector-button{--btn-border:color-mix(in oklab,var(--btn-bg),#000 5%)}}.file-input::file-selector-button{--btn-shadow:0 3px 2px -2px var(--btn-bg),0 4px 3px -2px var(--btn-bg)}@supports (color:color-mix(in lab,red,red)){.file-input::file-selector-button{--btn-shadow:0 3px 2px -2px color-mix(in oklab,var(--btn-bg)30%,#0000),0 4px 3px -2px color-mix(in oklab,var(--btn-bg)30%,#0000)}}.file-input::file-selector-button{--btn-noise:var(--fx-noise)}.file-input:focus{--input-color:var(--color-base-content);box-shadow:0 1px var(--input-color)}@supports (color:color-mix(in lab,red,red)){.file-input:focus{box-shadow:0 1px color-mix(in oklab,var(--input-color)10%,#0000)}}.file-input:focus{outline:2px solid var(--input-color);outline-offset:2px;isolation:isolate}.file-input:has(>input[disabled]),.file-input:is(:disabled,[disabled]){cursor:not-allowed;border-color:var(--color-base-200);background-color:var(--color-base-200)}:is(.file-input:has(>input[disabled]),.file-input:is(:disabled,[disabled]))::placeholder{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.file-input:has(>input[disabled]),.file-input:is(:disabled,[disabled]))::placeholder{color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.file-input:has(>input[disabled]),.file-input:is(:disabled,[disabled]){box-shadow:none;color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.file-input:has(>input[disabled]),.file-input:is(:disabled,[disabled]){color:color-mix(in oklch,var(--color-base-content)20%,#0000)}}:is(.file-input:has(>input[disabled]),.file-input:is(:disabled,[disabled]))::file-selector-button{cursor:not-allowed;border-color:var(--color-base-200);background-color:var(--color-base-200);--btn-border:#0000;--btn-noise:none;--btn-fg:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.file-input:has(>input[disabled]),.file-input:is(:disabled,[disabled]))::file-selector-button{--btn-fg:color-mix(in oklch,var(--color-base-content)20%,#0000)}}.hero-content{isolation:isolate;justify-content:center;align-items:center;gap:1rem;max-width:80rem;padding:1rem;display:flex}.textarea{border:var(--border)solid #0000;appearance:none;border-radius:var(--radius-field);background-color:var(--color-base-100);vertical-align:middle;width:clamp(3rem,20rem,100%);min-height:5rem;font-size:max(var(--font-size,.875rem),.875rem);touch-action:manipulation;border-color:var(--input-color);box-shadow:0 1px var(--input-color) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset;flex-shrink:1;padding-block:.5rem;padding-inline:.75rem}@supports (color:color-mix(in lab,red,red)){.textarea{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000) inset,0 -1px oklch(100% 0 0/calc(var(--depth)*.1)) inset}}.textarea{--input-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.textarea{--input-color:color-mix(in oklab,var(--color-base-content)20%,#0000)}}.textarea textarea{appearance:none;background-color:#0000;border:none}.textarea textarea:focus,.textarea textarea:focus-within{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.textarea textarea:focus,.textarea textarea:focus-within{outline-offset:2px;outline:2px solid #0000}}.textarea:focus,.textarea:focus-within{--input-color:var(--color-base-content);box-shadow:0 1px var(--input-color)}@supports (color:color-mix(in lab,red,red)){.textarea:focus,.textarea:focus-within{box-shadow:0 1px color-mix(in oklab,var(--input-color)calc(var(--depth)*10%),#0000)}}.textarea:focus,.textarea:focus-within{outline:2px solid var(--input-color);outline-offset:2px;isolation:isolate}@media(pointer:coarse){@supports (-webkit-touch-callout:none){.textarea:focus,.textarea:focus-within{--font-size:1rem}}}.textarea:has(>textarea[disabled]),.textarea:is(:disabled,[disabled]){cursor:not-allowed;border-color:var(--color-base-200);background-color:var(--color-base-200);color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.textarea:has(>textarea[disabled]),.textarea:is(:disabled,[disabled]){color:color-mix(in oklab,var(--color-base-content)40%,transparent)}}:is(.textarea:has(>textarea[disabled]),.textarea:is(:disabled,[disabled]))::placeholder{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:is(.textarea:has(>textarea[disabled]),.textarea:is(:disabled,[disabled]))::placeholder{color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.textarea:has(>textarea[disabled]),.textarea:is(:disabled,[disabled]){box-shadow:none}.textarea:has(>textarea[disabled])>textarea[disabled]{cursor:not-allowed}.mockup-phone-camera{z-index:1;background:#000;border-radius:17px;grid-area:1/1/1/1;width:28%;height:3.7%;margin-top:3%}.stack{grid-template-rows:3px 4px 1fr 4px 3px;grid-template-columns:3px 4px 1fr 4px 3px;display:inline-grid}.stack>*{width:100%;height:100%}.stack>:nth-child(n+2){opacity:.7;width:100%}.stack>:nth-child(2){z-index:2;opacity:.9}.stack>:first-child{z-index:3;width:100%}.modal-backdrop{color:#0000;z-index:-1;grid-row-start:1;grid-column-start:1;place-self:stretch stretch;display:grid}.modal-backdrop button{cursor:pointer}.tab-content{order:var(--tabcontent-order);--tabcontent-radius-ss:var(--radius-box);--tabcontent-radius-se:var(--radius-box);--tabcontent-radius-es:var(--radius-box);--tabcontent-radius-ee:var(--radius-box);--tabcontent-order:1;width:100%;height:calc(100% - var(--tab-height) + var(--border));margin:var(--tabcontent-margin);border-color:#0000;border-width:var(--border);border-start-start-radius:var(--tabcontent-radius-ss);border-start-end-radius:var(--tabcontent-radius-se);border-end-end-radius:var(--tabcontent-radius-ee);border-end-start-radius:var(--tabcontent-radius-es);display:none}.hover-gallery{--items:1;grid-template-columns:repeat(var(--items),1fr);gap:1px;width:100%;overflow:hidden}.hover-gallery,.hover-gallery:is(figure){display:inline-grid}.hover-gallery:has(>:nth-child(3)){--items:2}.hover-gallery:has(>:nth-child(4)){--items:3}.hover-gallery:has(>:nth-child(5)){--items:4}.hover-gallery:has(>:nth-child(6)){--items:5}.hover-gallery:has(>:nth-child(7)){--items:6}.hover-gallery:has(>:nth-child(8)){--items:7}.hover-gallery:has(>:nth-child(9)){--items:8}.hover-gallery:has(>:nth-child(10)){--items:9}.hover-gallery>*{opacity:0;object-fit:cover;grid-row:1;width:100%;height:100%}.hover-gallery>:first-child{opacity:1;grid-column:1/-1}.hover-gallery>:nth-child(2){grid-column:1}.hover-gallery>:nth-child(3){grid-column:2}.hover-gallery>:nth-child(4){grid-column:3}.hover-gallery>:nth-child(5){grid-column:4}.hover-gallery>:nth-child(6){grid-column:5}.hover-gallery>:nth-child(7){grid-column:6}.hover-gallery>:nth-child(8){grid-column:7}.hover-gallery>:nth-child(9){grid-column:8}.hover-gallery>:nth-child(10){grid-column:9}.hover-gallery>:nth-child(n+11){display:none}.hover-gallery>:hover{opacity:1;grid-column:1/-1}.hover-gallery:has(:hover)>:first-child{display:none}.mockup-phone-display{border-radius:54px;grid-area:1/1/1/1;width:100%;height:100%;overflow:hidden}@supports (corner-shape:superellipse(1.87)){.mockup-phone-display{corner-shape:superellipse(1.87);border-radius:101px}}.mockup-phone-display>img{object-fit:cover;width:100%;height:100%}.timeline-end{grid-area:3/1/4/4;place-self:flex-start center;margin:.25rem}.timeline-start{grid-area:1/1/2/4;place-self:flex-end center;margin:.25rem}.stat-figure{grid-row:1/span 3;grid-column-start:2;place-self:center flex-end}.hero{background-position:50%;background-size:cover;place-items:center;width:100%;display:grid}.hero>*{grid-row-start:1;grid-column-start:1}.hero-overlay{background-color:var(--color-neutral);grid-row-start:1;grid-column-start:1;width:100%;height:100%}@supports (color:color-mix(in lab,red,red)){.hero-overlay{background-color:color-mix(in oklab,var(--color-neutral)50%,transparent)}}.modal-box{background-color:var(--color-base-100);border-top-left-radius:var(--modal-tl,var(--radius-box));border-top-right-radius:var(--modal-tr,var(--radius-box));border-bottom-left-radius:var(--modal-bl,var(--radius-box));border-bottom-right-radius:var(--modal-br,var(--radius-box));opacity:0;overscroll-behavior:contain;grid-row-start:1;grid-column-start:1;width:91.6667%;max-width:32rem;max-height:100vh;padding:1.5rem;transition:translate .3s ease-out,scale .3s ease-out,opacity .2s ease-out 50ms,box-shadow .3s ease-out;overflow-y:auto;scale:95%;box-shadow:0 25px 50px -12px #00000040}.drawer-content{grid-row-start:1;grid-column-start:2;min-width:0}.timeline-middle{grid-row-start:2;grid-column-start:2}.stat-value{white-space:nowrap;grid-column-start:1;font-size:2rem;font-weight:800}.stat-desc{white-space:nowrap;color:var(--color-base-content);grid-column-start:1}@supports (color:color-mix(in lab,red,red)){.stat-desc{color:color-mix(in oklab,var(--color-base-content)60%,transparent)}}.stat-desc{font-size:.75rem}.stat-title{white-space:nowrap;color:var(--color-base-content);grid-column-start:1}@supports (color:color-mix(in lab,red,red)){.stat-title{color:color-mix(in oklab,var(--color-base-content)60%,transparent)}}.stat-title{font-size:.75rem}.stat-actions{white-space:nowrap;grid-column-start:1}.chat-image{grid-row:span 2/span 2;align-self:flex-end}.chat-footer{grid-row-start:3;gap:.25rem;font-size:.6875rem;display:flex}.chat-header{grid-row-start:1;gap:.25rem;font-size:.6875rem;display:flex}.divider{white-space:nowrap;height:1rem;margin:var(--divider-m,1rem 0);--divider-color:var(--color-base-content);flex-direction:row;align-self:stretch;align-items:center;display:flex}@supports (color:color-mix(in lab,red,red)){.divider{--divider-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}.divider:before,.divider:after{content:"";background-color:var(--divider-color);flex-grow:1;width:100%;height:.125rem}@media print{.divider:before,.divider:after{border:.5px solid}}.divider:not(:empty){gap:1rem}.filter{flex-wrap:wrap;display:flex}.filter input[type=radio]{width:auto}.filter input{opacity:1;transition:margin .1s,opacity .3s,padding .3s,border-width .1s;overflow:hidden;scale:1}.filter input:not(:last-child){margin-inline-end:.25rem}.filter input.filter-reset{aspect-ratio:1}.filter input.filter-reset:after{--tw-content:"×";content:var(--tw-content)}.filter:not(:has(input:checked:not(.filter-reset))) .filter-reset,.filter:not(:has(input:checked:not(.filter-reset))) input[type=reset],.filter:has(input:checked:not(.filter-reset)) input:not(:checked,.filter-reset,input[type=reset]){opacity:0;border-width:0;width:0;margin-inline:0;padding-inline:0;scale:0}.label{white-space:nowrap;color:currentColor;align-items:center;gap:.375rem;display:inline-flex}@supports (color:color-mix(in lab,red,red)){.label{color:color-mix(in oklab,currentcolor 60%,transparent)}}.label:has(input){cursor:pointer}.label:is(.input>*,.select>*){white-space:nowrap;height:calc(100% - .5rem);font-size:inherit;align-items:center;padding-inline:.75rem;display:flex}.label:is(.input>*,.select>*):first-child{border-inline-end:var(--border)solid currentColor;margin-inline:-.75rem .75rem}@supports (color:color-mix(in lab,red,red)){.label:is(.input>*,.select>*):first-child{border-inline-end:var(--border)solid color-mix(in oklab,currentColor 10%,#0000)}}.label:is(.input>*,.select>*):last-child{border-inline-start:var(--border)solid currentColor;margin-inline:.75rem -.75rem}@supports (color:color-mix(in lab,red,red)){.label:is(.input>*,.select>*):last-child{border-inline-start:var(--border)solid color-mix(in oklab,currentColor 10%,#0000)}}.modal-action{justify-content:flex-end;gap:.5rem;margin-top:1.5rem;display:flex}.breadcrumbs{max-width:100%;padding-block:.5rem;overflow-x:auto}.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol{white-space:nowrap;align-items:center;min-height:min-content;display:flex}:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li{align-items:center;display:flex}:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li>*{cursor:pointer;align-items:center;gap:.5rem;display:flex}@media(hover:hover){:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li>:hover{text-decoration-line:underline}}:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li>:focus{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li>:focus{outline-offset:2px;outline:2px solid #0000}}:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li>:focus-visible{outline-offset:2px;outline:2px solid}:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li+:before{content:"";opacity:.4;background-color:#0000;border-top:1px solid;border-right:1px solid;width:.375rem;height:.375rem;margin-left:.5rem;margin-right:.75rem;display:block;rotate:45deg}[dir=rtl] :is(:is(.breadcrumbs>menu,.breadcrumbs>ul,.breadcrumbs>ol)>li)+:before{rotate:-135deg}.fieldset-legend{color:var(--color-base-content);justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:-.25rem;padding-block:.5rem;font-weight:600;display:flex}.footer-title{text-transform:uppercase;opacity:.6;margin-bottom:.5rem;font-weight:600}.carousel-item{box-sizing:content-box;scroll-snap-align:start;flex:none;display:flex}.status{aspect-ratio:1;border-radius:var(--radius-selector);background-color:var(--color-base-content);width:.5rem;height:.5rem;display:inline-block}@supports (color:color-mix(in lab,red,red)){.status{background-color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.status{vertical-align:middle;color:#0000004d;background-position:50%;background-repeat:no-repeat}@supports (color:color-mix(in lab,red,red)){.status{color:color-mix(in oklab,var(--color-black)30%,transparent)}}.status{background-image:radial-gradient(circle at 35% 30%,oklch(1 0 0/calc(var(--depth)*.5)),#0000);box-shadow:0 2px 3px -1px}@supports (color:color-mix(in lab,red,red)){.status{box-shadow:0 2px 3px -1px color-mix(in oklab,currentColor calc(var(--depth)*100%),#0000)}}.mockup-phone{aspect-ratio:462/978;background-color:#000;border:5px solid #6b6b6b;border-radius:65px;justify-items:center;width:100%;max-width:462px;padding:6px;display:inline-grid;overflow:hidden}@supports (corner-shape:superellipse(1.45)){.mockup-phone{corner-shape:superellipse(1.45);border-radius:90px}}.badge{border-radius:var(--radius-selector);vertical-align:middle;color:var(--badge-fg);border:var(--border)solid var(--badge-color,var(--color-base-200));width:fit-content;padding-inline:calc(.25rem*3 - var(--border));background-size:auto,calc(var(--noise)*100%);background-image:none,var(--fx-noise);background-color:var(--badge-bg);--badge-bg:var(--badge-color,var(--color-base-100));--badge-fg:var(--color-base-content);--size:calc(var(--size-selector,.25rem)*6);height:var(--size);justify-content:center;align-items:center;gap:.5rem;font-size:.875rem;display:inline-flex}.kbd{border-radius:var(--radius-field);background-color:var(--color-base-200);vertical-align:middle;border:var(--border)solid var(--color-base-content);justify-content:center;align-items:center;padding-left:.5em;padding-right:.5em;display:inline-flex}@supports (color:color-mix(in lab,red,red)){.kbd{border:var(--border)solid color-mix(in srgb,var(--color-base-content)20%,#0000)}}.kbd{border-bottom:calc(var(--border) + 1px)solid var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.kbd{border-bottom:calc(var(--border) + 1px)solid color-mix(in srgb,var(--color-base-content)20%,#0000)}}.kbd{--size:calc(var(--size-selector,.25rem)*6);height:var(--size);min-width:var(--size);font-size:.875rem}.tabs{--tabs-height:auto;--tabs-direction:row;--tab-height:calc(var(--size-field,.25rem)*10);height:var(--tabs-height);flex-wrap:wrap;flex-direction:var(--tabs-direction);display:flex}.footer{grid-auto-flow:row;place-items:start;gap:2.5rem 1rem;width:100%;font-size:.875rem;line-height:1.25rem;display:grid}.footer>*{place-items:start;gap:.5rem;display:grid}.footer.footer-center{text-align:center;grid-auto-flow:column dense;place-items:center}.footer.footer-center>*{place-items:center}.stat{grid-template-columns:repeat(1,1fr);column-gap:1rem;width:100%;padding-block:1rem;padding-inline:1.5rem;display:inline-grid}.stat:not(:last-child){border-inline-end:var(--border)dashed currentColor}@supports (color:color-mix(in lab,red,red)){.stat:not(:last-child){border-inline-end:var(--border)dashed color-mix(in oklab,currentColor 10%,#0000)}}.stat:not(:last-child){border-block-end:none}.navbar-end{justify-content:flex-end;align-items:center;width:50%;display:inline-flex}.navbar-start{justify-content:flex-start;align-items:center;width:50%;display:inline-flex}.card-body{padding:var(--card-p,1.5rem);font-size:var(--card-fs,.875rem);flex-direction:column;flex:auto;gap:.5rem;display:flex}.card-body :where(p){flex-grow:1}.navbar-center{flex-shrink:0;align-items:center;display:inline-flex}.fab-flower{--position:0rem;display:grid}.fab-flower>:nth-child(-n+2){--position:0rem}.fab-flower>*{--degree:180deg;--flip-degree:calc(180deg - var(--degree));transform:translate(calc(cos(var(--degree))*var(--position)))translateY(calc(sin(var(--degree))*calc(-1*var(--position))));grid-area:1/1}[dir=rtl] :is(.fab-flower>*){transform:translate(calc(cos(var(--flip-degree))*var(--position)))translateY(calc(sin(var(--flip-degree))*calc(-1*var(--position))))}.fab-flower>:nth-child(n+7){display:none}.fab-flower:has(:nth-child(3)){--position:140%}.fab-flower:has(:nth-child(3))>:nth-child(3){--degree:135deg}.fab-flower:has(:nth-child(4)){--position:140%}.fab-flower:has(:nth-child(4))>:nth-child(3){--degree:165deg}.fab-flower:has(:nth-child(4))>:nth-child(4){--degree:105deg}.fab-flower:has(:nth-child(5)){--position:180%}.fab-flower:has(:nth-child(5))>:nth-child(3){--degree:180deg}.fab-flower:has(:nth-child(5))>:nth-child(4){--degree:135deg}.fab-flower:has(:nth-child(5))>:nth-child(5){--degree:90deg}.fab-flower:has(:nth-child(6)){--position:220%}.fab-flower:has(:nth-child(6))>:nth-child(3){--degree:180deg}.fab-flower:has(:nth-child(6))>:nth-child(4){--degree:150deg}.fab-flower:has(:nth-child(6))>:nth-child(5){--degree:120deg}.fab-flower:has(:nth-child(6))>:nth-child(6){--degree:90deg}.carousel{scroll-snap-type:x mandatory;scrollbar-width:none;display:inline-flex;overflow-x:scroll}@media(prefers-reduced-motion:no-preference){.carousel{scroll-behavior:smooth}}.carousel::-webkit-scrollbar{display:none}.alert{--alert-border-color:var(--color-base-200);border-radius:var(--radius-box);color:var(--color-base-content);background-color:var(--alert-color,var(--color-base-200));text-align:start;background-size:auto,calc(var(--noise)*100%);background-image:none,var(--fx-noise);box-shadow:0 3px 0 -2px oklch(100% 0 0/calc(var(--depth)*.08)) inset,0 1px #000,0 4px 3px -2px oklch(0% 0 0/calc(var(--depth)*.08));border-style:solid;grid-template-columns:auto;grid-auto-flow:column;justify-content:start;place-items:center start;gap:1rem;padding-block:.75rem;padding-inline:1rem;font-size:.875rem;line-height:1.25rem;display:grid}@supports (color:color-mix(in lab,red,red)){.alert{box-shadow:0 3px 0 -2px oklch(100% 0 0/calc(var(--depth)*.08)) inset,0 1px color-mix(in oklab,color-mix(in oklab,#000 20%,var(--alert-color,var(--color-base-200)))calc(var(--depth)*20%),#0000),0 4px 3px -2px oklch(0% 0 0/calc(var(--depth)*.08))}}.alert:has(:nth-child(2)){grid-template-columns:auto minmax(auto,1fr)}.fieldset{grid-template-columns:1fr;grid-auto-rows:max-content;gap:.375rem;padding-block:.25rem;font-size:.75rem;display:grid}.card-actions{flex-wrap:wrap;align-items:flex-start;gap:.5rem;display:flex}.card-title{font-size:var(--cardtitle-fs,1.125rem);align-items:center;gap:.5rem;font-weight:600;display:flex}.chat{--mask-chat:url("data:image/svg+xml,%3csvg width='13' height='13' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='M0 11.5004C0 13.0004 2 13.0004 2 13.0004H12H13V0.00036329L12.5 0C12.5 0 11.977 2.09572 11.8581 2.50033C11.6075 3.35237 10.9149 4.22374 9 5.50036C6 7.50036 0 10.0004 0 11.5004Z'/%3e%3c/svg%3e");column-gap:.75rem;padding-block:.25rem;display:grid}.avatar-group{display:flex;overflow:hidden}.avatar-group .avatar{border:4px solid var(--color-base-100);border-radius:3.40282e38px;overflow:hidden}.mask{vertical-align:middle;display:inline-block;-webkit-mask-position:50%;mask-position:50%;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}.cally{font-size:.7rem}.cally::part(container){-webkit-user-select:none;user-select:none;padding:.5rem 1rem}.cally ::part(th){block-size:auto;font-weight:400}.cally::part(header){direction:ltr}.cally ::part(head){opacity:.5;font-size:.7rem}.cally::part(button){border-radius:var(--radius-field);background:0 0;border:none;padding:.5rem}.cally::part(button):hover{background:var(--color-base-200)}.cally ::part(day){border-radius:var(--radius-field);font-size:.7rem}.cally ::part(button day today){background:var(--color-primary);color:var(--color-primary-content)}.cally ::part(selected){color:var(--color-base-100);background:var(--color-base-content);border-radius:var(--radius-field)}.cally ::part(range-inner){border-radius:0}.cally ::part(range-start){border-start-end-radius:0;border-end-end-radius:0}.cally ::part(range-end){border-start-start-radius:0;border-end-start-radius:0}.cally ::part(range-start range-end){border-radius:var(--radius-field)}.cally calendar-month{width:100%}.skeleton{border-radius:var(--radius-box);background-color:var(--color-base-300)}@media(prefers-reduced-motion:reduce){.skeleton{transition-duration:15s}}.skeleton{will-change:background-position;background-image:linear-gradient(105deg,#0000 0% 40%,var(--color-base-100)50%,#0000 60% 100%);background-position-x:-50%;background-size:200%}@media(prefers-reduced-motion:no-preference){.skeleton{animation:1.8s ease-in-out infinite skeleton}}.link{cursor:pointer;text-decoration-line:underline}.link:focus{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.link:focus{outline-offset:2px;outline:2px solid #0000}}.link:focus-visible{outline-offset:2px;outline:2px solid}.timeline-box{border:var(--border)solid;border-radius:var(--radius-box);border-color:var(--color-base-300);background-color:var(--color-base-100);padding-block:.5rem;padding-inline:1rem;font-size:.75rem;box-shadow:0 1px 2px #0000000d}.menu-title{color:var(--color-base-content);padding-block:.5rem;padding-inline:.75rem}@supports (color:color-mix(in lab,red,red)){.menu-title{color:color-mix(in oklab,var(--color-base-content)40%,transparent)}}.menu-title{font-size:.875rem;font-weight:600}.btn-accent{--btn-color:var(--color-accent);--btn-fg:var(--color-accent-content)}.btn-error{--btn-color:var(--color-error);--btn-fg:var(--color-error-content)}.btn-info{--btn-color:var(--color-info);--btn-fg:var(--color-info-content)}.btn-neutral{--btn-color:var(--color-neutral);--btn-fg:var(--color-neutral-content)}.btn-primary{--btn-color:var(--color-primary);--btn-fg:var(--color-primary-content)}.btn-secondary{--btn-color:var(--color-secondary);--btn-fg:var(--color-secondary-content)}.btn-success{--btn-color:var(--color-success);--btn-fg:var(--color-success-content)}.btn-warning{--btn-color:var(--color-warning);--btn-fg:var(--color-warning-content)}}@layer daisyui.l1.l2{.modal.modal-open,.modal[open],.modal:target,.modal-toggle:checked+.modal{pointer-events:auto;visibility:visible;opacity:1;transition:visibility 0s allow-discrete,background-color .3s ease-out,opacity .1s ease-out;background-color:#0006}:is(.modal.modal-open,.modal[open],.modal:target,.modal-toggle:checked+.modal) .modal-box{opacity:1;translate:0;scale:1}:root:has(:is(.modal.modal-open,.modal[open],.modal:target,.modal-toggle:checked+.modal)){--page-has-backdrop:1;--page-overflow:hidden;--page-scroll-bg:var(--page-scroll-bg-on);--page-scroll-gutter:stable;--page-scroll-transition:var(--page-scroll-transition-on);animation:forwards set-page-has-scroll;animation-timeline:scroll()}@starting-style{.modal.modal-open,.modal[open],.modal:target,.modal-toggle:checked+.modal{opacity:0}}.drawer-open>.drawer-side{overflow-y:auto}.drawer-open>.drawer-toggle{display:none}.drawer-open>.drawer-toggle~.drawer-side{pointer-events:auto;visibility:visible;overscroll-behavior:auto;opacity:1;width:auto;display:block;position:sticky}.drawer-open>.drawer-toggle~.drawer-side>.drawer-overlay{cursor:default;background-color:#0000}.drawer-open>.drawer-toggle~.drawer-side>:not(.drawer-overlay),[dir=rtl] :is(.drawer-open>.drawer-toggle~.drawer-side>:not(.drawer-overlay)){translate:0%}.drawer-open>.drawer-toggle:checked~.drawer-side{pointer-events:auto;visibility:visible}:where(.drawer-toggle:checked~.drawer-side){pointer-events:auto;visibility:visible;opacity:1;overflow-y:auto}:where(.drawer-toggle:checked~.drawer-side)>:not(.drawer-overlay){translate:0%}.drawer-toggle:focus-visible~.drawer-content label.drawer-button{outline-offset:2px;outline:2px solid}.tooltip>.tooltip-content,.tooltip[data-tip]:before{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-off)50%}.tooltip:after{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-tail)50%}.collapse-arrow>.collapse-title:after{width:.5rem;height:.5rem;display:block;position:absolute;transform:translateY(-100%)rotate(45deg)}@media(prefers-reduced-motion:no-preference){.collapse-arrow>.collapse-title:after{transition-property:all;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1)}}.collapse-arrow>.collapse-title:after{content:"";transform-origin:75% 75%;pointer-events:none;top:50%;inset-inline-end:1.4rem;box-shadow:2px 2px}.collapse-plus>.collapse-title:after{width:.5rem;height:.5rem;display:block;position:absolute}@media(prefers-reduced-motion:no-preference){.collapse-plus>.collapse-title:after{transition-property:all;transition-duration:.3s;transition-timing-function:cubic-bezier(.4,0,.2,1)}}.collapse-plus>.collapse-title:after{--tw-content:"+";content:var(--tw-content);pointer-events:none;top:.9rem;inset-inline-end:1.4rem}.btn:disabled:not(.btn-link,.btn-ghost){background-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.btn:disabled:not(.btn-link,.btn-ghost){background-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}.btn:disabled:not(.btn-link,.btn-ghost){box-shadow:none}.btn:disabled{pointer-events:none;--btn-border:#0000;--btn-noise:none;--btn-fg:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.btn:disabled{--btn-fg:color-mix(in oklch,var(--color-base-content)20%,#0000)}}.btn[disabled]:not(.btn-link,.btn-ghost){background-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.btn[disabled]:not(.btn-link,.btn-ghost){background-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}.btn[disabled]:not(.btn-link,.btn-ghost){box-shadow:none}.btn[disabled]{pointer-events:none;--btn-border:#0000;--btn-noise:none;--btn-fg:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.btn[disabled]{--btn-fg:color-mix(in oklch,var(--color-base-content)20%,#0000)}}.btn-disabled:not(.btn-link,.btn-ghost){background-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.btn-disabled:not(.btn-link,.btn-ghost){background-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}.btn-disabled:not(.btn-link,.btn-ghost){box-shadow:none}.btn-disabled{pointer-events:none;--btn-border:#0000;--btn-noise:none;--btn-fg:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.btn-disabled{--btn-fg:color-mix(in oklch,var(--color-base-content)20%,#0000)}}.tab-disabled{pointer-events:none;opacity:.4}@media(prefers-reduced-motion:no-preference){.collapse[open].collapse-arrow>.collapse-title:after,.collapse.collapse-open.collapse-arrow>.collapse-title:after{transform:translateY(-50%)rotate(225deg)}}.collapse.collapse-open.collapse-plus>.collapse-title:after{--tw-content:"−";content:var(--tw-content)}:is(.collapse[tabindex].collapse-arrow:focus:not(.collapse-close),.collapse.collapse-arrow[tabindex]:focus-within:not(.collapse-close))>.collapse-title:after,.collapse.collapse-arrow:not(.collapse-close)>input:is([type=checkbox],[type=radio]):checked~.collapse-title:after{transform:translateY(-50%)rotate(225deg)}.collapse[open].collapse-plus>.collapse-title:after,.collapse[tabindex].collapse-plus:focus:not(.collapse-close)>.collapse-title:after,.collapse.collapse-plus:not(.collapse-close)>input:is([type=checkbox],[type=radio]):checked~.collapse-title:after{--tw-content:"−";content:var(--tw-content)}.collapse-open{grid-template-rows:max-content 1fr}.collapse-open>.collapse-content{content-visibility:visible;min-height:fit-content;padding-bottom:1rem}@supports not (content-visibility:visible){.collapse-open>.collapse-content{visibility:visible}}.tabs-lift{--tabs-height:auto;--tabs-direction:row}.tabs-lift>.tab{--tab-border:0 0 var(--border)0;--tab-radius-ss:var(--tab-radius-limit);--tab-radius-se:var(--tab-radius-limit);--tab-radius-es:0;--tab-radius-ee:0;--tab-paddings:var(--border)var(--tab-p)0 var(--tab-p);--tab-border-colors:#0000 #0000 var(--tab-border-color)#0000;--tab-corner-width:calc(100% + var(--tab-radius-limit)*2);--tab-corner-height:var(--tab-radius-limit);--tab-corner-position:top left,top right;border-width:var(--tab-border);padding:var(--tab-paddings);border-color:var(--tab-border-colors);border-start-start-radius:var(--tab-radius-ss);border-start-end-radius:var(--tab-radius-se);border-end-end-radius:var(--tab-radius-ee);border-end-start-radius:var(--tab-radius-es)}.tabs-lift>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-lift>.tab:is(input:checked,label:has(:checked)){--tab-border:var(--border)var(--border)0 var(--border);--tab-border-colors:var(--tab-border-color)var(--tab-border-color)#0000 var(--tab-border-color);--tab-paddings:0 calc(var(--tab-p) - var(--border))var(--border)calc(var(--tab-p) - var(--border));--tab-inset:auto auto 0 auto;--radius-start:radial-gradient(circle at top left,var(--tab-radius-grad));--radius-end:radial-gradient(circle at top right,var(--tab-radius-grad));background-color:var(--tab-bg)}:is(.tabs-lift>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-lift>.tab:is(input:checked,label:has(:checked))):before{z-index:1;content:"";width:var(--tab-corner-width);height:var(--tab-corner-height);background-position:var(--tab-corner-position);background-image:var(--radius-start),var(--radius-end);background-size:var(--tab-radius-limit)var(--tab-radius-limit);inset:var(--tab-inset);background-repeat:no-repeat;display:block;position:absolute}:is(.tabs-lift>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-lift>.tab:is(input:checked,label:has(:checked))):first-child:before{--radius-start:none}[dir=rtl] :is(.tabs-lift>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-lift>.tab:is(input:checked,label:has(:checked))):first-child:before{transform:rotateY(180deg)}:is(.tabs-lift>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-lift>.tab:is(input:checked,label:has(:checked))):last-child:before{--radius-end:none}[dir=rtl] :is(.tabs-lift>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-lift>.tab:is(input:checked,label:has(:checked))):last-child:before{transform:rotateY(180deg)}.tabs-lift:has(>.tab-content)>.tab:first-child:not(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]){--tab-border-colors:var(--tab-border-color)var(--tab-border-color)#0000 var(--tab-border-color)}.tabs-lift>.tab-content{--tabcontent-margin:calc(-1*var(--border))0 0 0;--tabcontent-radius-ss:0;--tabcontent-radius-se:var(--radius-box);--tabcontent-radius-es:var(--radius-box);--tabcontent-radius-ee:var(--radius-box)}:is(.tabs-lift :checked,.tabs-lift label:has(:checked),.tabs-lift :is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]))+.tab-content:first-child,:is(.tabs-lift :checked,.tabs-lift label:has(:checked),.tabs-lift :is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]))+.tab-content:nth-child(n+3){--tabcontent-radius-ss:var(--radius-box)}.list .list-row:has(.list-col-grow:first-child){--list-grid-cols:1fr}.list .list-row:has(.list-col-grow:nth-child(2)){--list-grid-cols:minmax(0,auto)1fr}.list .list-row:has(.list-col-grow:nth-child(3)){--list-grid-cols:minmax(0,auto)minmax(0,auto)1fr}.list .list-row:has(.list-col-grow:nth-child(4)){--list-grid-cols:minmax(0,auto)minmax(0,auto)minmax(0,auto)1fr}.list .list-row:has(.list-col-grow:nth-child(5)){--list-grid-cols:minmax(0,auto)minmax(0,auto)minmax(0,auto)minmax(0,auto)1fr}.list .list-row:has(.list-col-grow:nth-child(6)){--list-grid-cols:minmax(0,auto)minmax(0,auto)minmax(0,auto)minmax(0,auto)minmax(0,auto)1fr}.list .list-row>:not(.list-col-wrap){grid-row-start:1}.avatar-offline:before{content:"";z-index:1;background-color:var(--color-base-300);outline:2px solid var(--color-base-100);border-radius:3.40282e38px;width:15%;height:15%;display:block;position:absolute;top:7%;right:7%}.avatar-online:before{content:"";z-index:1;background-color:var(--color-success);outline:2px solid var(--color-base-100);border-radius:3.40282e38px;width:15%;height:15%;display:block;position:absolute;top:7%;right:7%}.steps .step-neutral+.step-neutral:before,.steps .step-neutral:after,.steps .step-neutral>.step-icon{--step-bg:var(--color-neutral);--step-fg:var(--color-neutral-content)}.steps .step-primary+.step-primary:before,.steps .step-primary:after,.steps .step-primary>.step-icon{--step-bg:var(--color-primary);--step-fg:var(--color-primary-content)}.steps .step-secondary+.step-secondary:before,.steps .step-secondary:after,.steps .step-secondary>.step-icon{--step-bg:var(--color-secondary);--step-fg:var(--color-secondary-content)}.steps .step-accent+.step-accent:before,.steps .step-accent:after,.steps .step-accent>.step-icon{--step-bg:var(--color-accent);--step-fg:var(--color-accent-content)}.steps .step-info+.step-info:before,.steps .step-info:after,.steps .step-info>.step-icon{--step-bg:var(--color-info);--step-fg:var(--color-info-content)}.steps .step-success+.step-success:before,.steps .step-success:after,.steps .step-success>.step-icon{--step-bg:var(--color-success);--step-fg:var(--color-success-content)}.steps .step-warning+.step-warning:before,.steps .step-warning:after,.steps .step-warning>.step-icon{--step-bg:var(--color-warning);--step-fg:var(--color-warning-content)}.steps .step-error+.step-error:before,.steps .step-error:after,.steps .step-error>.step-icon{--step-bg:var(--color-error);--step-fg:var(--color-error-content)}.tabs-border>.tab{--tab-border-color:#0000 #0000 var(--tab-border-color)#0000;border-radius:var(--radius-field);position:relative}.tabs-border>.tab:before{content:"";background-color:var(--tab-border-color);border-radius:var(--radius-field);width:80%;height:3px;transition:background-color .2s;position:absolute;bottom:0;left:10%}:is(.tabs-border>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-border>.tab:is(input:checked),.tabs-border>.tab:is(label:has(:checked))):before{--tab-border-color:currentColor;border-top:3px solid}.image-full{display:grid}.image-full>*{grid-row-start:1;grid-column-start:1}.image-full>.card-body{color:var(--color-neutral-content);position:relative}.image-full :where(figure){border-radius:inherit;overflow:hidden}.image-full>figure img{object-fit:cover;filter:brightness(28%);height:100%}.menu-horizontal{flex-direction:row;display:inline-flex}.menu-horizontal>li:not(.menu-title)>details>ul{transform-origin:top;border-radius:var(--radius-box);background-color:var(--color-base-100);opacity:0;margin-inline-start:0;margin-top:1rem;padding-block:.5rem;padding-inline-end:.5rem;position:absolute;scale:95%;box-shadow:0 1px 3px #0000001a,0 1px 2px -1px #0000001a}@media(prefers-reduced-motion:no-preference){@starting-style{.menu-horizontal>li:not(.menu-title)>details>ul{opacity:0;scale:95%}}.menu-horizontal>li:not(.menu-title)>details>ul{transition-behavior:allow-discrete;transition-property:opacity,scale,display;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);animation:.2s menu}}.menu-horizontal>li:not(.menu-title)>details[open]>ul{opacity:1;scale:100%}.menu-horizontal>li>details>ul:before{--tw-content:none;content:var(--tw-content)}.menu-vertical{flex-direction:column;display:inline-flex}.menu-vertical>li:not(.menu-title)>details>ul{background-color:revert-layer;border-radius:revert-layer;animation:revert-layer;box-shadow:revert-layer;margin-inline-start:1rem;margin-top:0;padding-block:0;padding-inline-end:0;transition:revert-layer;position:relative}.checkbox:disabled{cursor:not-allowed;opacity:.2}.checkbox\\!:disabled{cursor:not-allowed!important;opacity:.2!important}.radio:disabled{cursor:not-allowed;opacity:.2}.rating.rating-xs :where(:not(.rating-hidden)){width:1rem;height:1rem}.rating.rating-sm :where(:not(.rating-hidden)){width:1.25rem;height:1.25rem}.rating.rating-md :where(:not(.rating-hidden)){width:1.5rem;height:1.5rem}.rating.rating-lg :where(:not(.rating-hidden)){width:1.75rem;height:1.75rem}.rating.rating-xl :where(:not(.rating-hidden)){width:2rem;height:2rem}:where(.navbar){position:relative}.tooltip-bottom>.tooltip-content,.tooltip-bottom[data-tip]:before{transform:translate(-50%)translateY(var(--tt-pos,-.25rem));inset:var(--tt-off)auto auto 50%}.tooltip-bottom:after{transform:translate(-50%)translateY(var(--tt-pos,-.25rem))rotate(180deg);inset:var(--tt-tail)auto auto 50%}.tooltip-left>.tooltip-content,.tooltip-left[data-tip]:before{transform:translate(calc(var(--tt-pos,.25rem) - .25rem))translateY(-50%);inset:50% var(--tt-off)auto auto}.tooltip-left:after{transform:translate(var(--tt-pos,.25rem))translateY(-50%)rotate(-90deg);inset:50% calc(var(--tt-tail) + 1px)auto auto}.tooltip-right>.tooltip-content,.tooltip-right[data-tip]:before{transform:translate(calc(var(--tt-pos,-.25rem) + .25rem))translateY(-50%);inset:50% auto auto var(--tt-off)}.tooltip-right:after{transform:translate(var(--tt-pos,-.25rem))translateY(-50%)rotate(90deg);inset:50% auto auto calc(var(--tt-tail) + 1px)}.tooltip-top>.tooltip-content,.tooltip-top[data-tip]:before{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-off)50%}.tooltip-top:after{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-tail)50%}.toast-center{--toast-x:-50%;inset-inline:50%}.toast-end{--toast-x:0;inset-inline:auto 1rem}.toast-start{--toast-x:0;inset-inline:1rem auto}.dropdown-right{--anchor-h:right;--anchor-v:span-bottom}.dropdown-right .dropdown-content{transform-origin:0;inset-inline-start:100%;top:0;bottom:auto}.chat-end{grid-template-columns:1fr auto;place-items:end}.chat-end .chat-header,.chat-end .chat-footer{grid-column-start:1}.chat-end .chat-image{grid-column-start:2}.chat-end .chat-bubble{border-end-end-radius:0;grid-column-start:1}.chat-end .chat-bubble:before{inset-inline-start:100%;transform:rotateY(180deg)}[dir=rtl] :is(.chat-end .chat-bubble):before{transform:rotateY(0)}.chat-start{grid-template-columns:auto 1fr;place-items:start}.chat-start .chat-header,.chat-start .chat-footer{grid-column-start:2}.chat-start .chat-image{grid-column-start:1}.chat-start .chat-bubble{border-end-start-radius:0;grid-column-start:2}.chat-start .chat-bubble:before{inset-inline-start:-.75rem;transform:rotateY(0)}[dir=rtl] :is(.chat-start .chat-bubble):before{transform:rotateY(180deg)}.dropdown-left{--anchor-h:left;--anchor-v:span-bottom}.dropdown-left .dropdown-content{transform-origin:100%;inset-inline-end:100%;top:0;bottom:auto}.dropdown-center{--anchor-h:center}.dropdown-center :where(.dropdown-content){inset-inline-end:50%;translate:50%}[dir=rtl] :is(.dropdown-center :where(.dropdown-content)){translate:-50%}.dropdown-center.dropdown-left{--anchor-h:left;--anchor-v:center}.dropdown-center.dropdown-left .dropdown-content{top:auto;bottom:50%;translate:0 50%}.dropdown-center.dropdown-right{--anchor-h:right;--anchor-v:center}.dropdown-center.dropdown-right .dropdown-content{top:auto;bottom:50%;translate:0 50%}.dropdown-end{--anchor-h:span-left}.dropdown-end :where(.dropdown-content){inset-inline-end:0;translate:0}[dir=rtl] :is(.dropdown-end :where(.dropdown-content)){translate:0}.dropdown-end.dropdown-left{--anchor-h:left;--anchor-v:span-top}.dropdown-end.dropdown-left .dropdown-content{top:auto;bottom:0}.dropdown-end.dropdown-right{--anchor-h:right;--anchor-v:span-top}.dropdown-end.dropdown-right .dropdown-content{top:auto;bottom:0}.dropdown-start{--anchor-h:span-right}.dropdown-start :where(.dropdown-content){inset-inline-end:auto;translate:0}[dir=rtl] :is(.dropdown-start :where(.dropdown-content)){translate:0}.dropdown-start.dropdown-left{--anchor-h:left;--anchor-v:span-bottom}.dropdown-start.dropdown-left .dropdown-content{top:0;bottom:auto}.dropdown-start.dropdown-right{--anchor-h:right;--anchor-v:span-bottom}.dropdown-start.dropdown-right .dropdown-content{top:0;bottom:auto}.dropdown-bottom{--anchor-v:bottom}.dropdown-bottom .dropdown-content{transform-origin:top;top:100%;bottom:auto}.dropdown-top{--anchor-v:top}.dropdown-top .dropdown-content{transform-origin:bottom;top:auto;bottom:100%}.toast-bottom{--toast-y:0;top:auto;bottom:1rem}.toast-middle{--toast-y:-50%;top:50%;bottom:auto}.toast-top{--toast-y:0;top:1rem;bottom:auto}.dock-sm{height:3.5rem;height:calc(3.5rem + env(safe-area-inset-bottom))}.dock-sm .dock-active:after{bottom:-.1rem}.dock-sm .dock-label{font-size:.625rem}.dock-lg{height:4.5rem;height:calc(4.5rem + env(safe-area-inset-bottom))}.dock-lg .dock-active:after{bottom:.4rem}.dock-lg .dock-label{font-size:.6875rem}.dock-xl{height:5rem;height:calc(5rem + env(safe-area-inset-bottom))}.dock-xl .dock-active:after{bottom:.4rem}.dock-xl .dock-label{font-size:.75rem}.dock-xs{height:3rem;height:calc(3rem + env(safe-area-inset-bottom))}.dock-xs .dock-active:after{bottom:-.1rem}.dock-xs .dock-label{font-size:.625rem}.btn-active{--btn-bg:var(--btn-color,var(--color-base-200))}@supports (color:color-mix(in lab,red,red)){.btn-active{--btn-bg:color-mix(in oklab,var(--btn-color,var(--color-base-200)),#000 7%)}}.btn-active{--btn-shadow:0 0 0 0 oklch(0% 0 0/0),0 0 0 0 oklch(0% 0 0/0);isolation:isolate}:is(.stack,.stack.stack-bottom)>*{grid-area:3/3/6/4}:is(.stack,.stack.stack-bottom)>:nth-child(2){grid-area:2/2/5/5}:is(.stack,.stack.stack-bottom)>:first-child{grid-area:1/1/4/6}.stack.stack-top>*{grid-area:1/3/4/4}.stack.stack-top>:nth-child(2){grid-area:2/2/5/5}.stack.stack-top>:first-child{grid-area:3/1/6/6}.stack.stack-start>*{grid-area:3/1/4/4}.stack.stack-start>:nth-child(2){grid-area:2/2/5/5}.stack.stack-start>:first-child{grid-area:1/3/6/6}.stack.stack-end>*{grid-area:3/3/4/6}.stack.stack-end>:nth-child(2){grid-area:2/2/5/5}.stack.stack-end>:first-child{grid-area:1/1/6/4}.timeline-horizontal{flex-direction:row}.timeline-horizontal>li{align-items:center}.timeline-horizontal>li>hr{width:100%;height:.25rem}.timeline-horizontal>li>hr:first-child{grid-row-start:2;grid-column-start:1}.timeline-horizontal>li>hr:last-child{grid-area:2/3/auto/none}.timeline-horizontal .timeline-start{grid-area:1/1/2/4;place-self:flex-end center}.timeline-horizontal .timeline-end{grid-area:3/1/4/4;place-self:flex-start center}.timeline-horizontal:has(.timeline-middle)>li>hr:first-child{border-start-start-radius:0;border-start-end-radius:var(--radius-selector);border-end-end-radius:var(--radius-selector);border-end-start-radius:0}.timeline-horizontal:has(.timeline-middle)>li>hr:last-child,.timeline-horizontal:not(:has(.timeline-middle)) :first-child>hr:last-child{border-start-start-radius:var(--radius-selector);border-start-end-radius:0;border-end-end-radius:0;border-end-start-radius:var(--radius-selector)}.timeline-horizontal:not(:has(.timeline-middle)) :last-child>hr:first-child{border-start-start-radius:0;border-start-end-radius:var(--radius-selector);border-end-end-radius:var(--radius-selector);border-end-start-radius:0}.timeline-vertical{flex-direction:column}.timeline-vertical>li{--timeline-row-start:minmax(0,1fr);--timeline-row-end:minmax(0,1fr);justify-items:center}.timeline-vertical>li>hr{width:.25rem;height:100%}.timeline-vertical>li>hr:first-child{grid-row-start:1;grid-column-start:2}.timeline-vertical>li>hr:last-child{grid-area:3/2/none}.timeline-vertical .timeline-start{grid-area:1/1/4/2;place-self:center flex-end}.timeline-vertical .timeline-end{grid-area:1/3/4/4;place-self:center flex-start}.timeline-vertical:has(.timeline-middle)>li>hr:first-child{border-top-left-radius:0;border-top-right-radius:0;border-bottom-right-radius:var(--radius-selector);border-bottom-left-radius:var(--radius-selector)}.timeline-vertical:has(.timeline-middle)>li>hr:last-child,.timeline-vertical:not(:has(.timeline-middle)) :first-child>hr:last-child{border-top-left-radius:var(--radius-selector);border-top-right-radius:var(--radius-selector);border-bottom-right-radius:0;border-bottom-left-radius:0}.timeline-vertical:not(:has(.timeline-middle)) :last-child>hr:first-child{border-top-left-radius:0;border-top-right-radius:0;border-bottom-right-radius:var(--radius-selector);border-bottom-left-radius:var(--radius-selector)}.timeline-vertical.timeline-snap-icon>li{--timeline-col-start:minmax(0,1fr);--timeline-row-start:.5rem}.timeline-compact{--timeline-row-start:0}.timeline-compact .timeline-start{grid-area:3/1/4/4;place-self:flex-start center}.timeline-compact li:has(.timeline-start) .timeline-end{grid-row-start:auto;grid-column-start:none}.timeline-compact.timeline-vertical>li{--timeline-col-start:0}.timeline-compact.timeline-vertical .timeline-start{grid-area:1/3/4/4;place-self:center flex-start}.timeline-compact.timeline-vertical li:has(.timeline-start) .timeline-end{grid-row-start:none;grid-column-start:auto}.drawer-end{grid-auto-columns:auto max-content}.drawer-end>.drawer-toggle~.drawer-content{grid-column-start:1}.drawer-end>.drawer-toggle~.drawer-side{grid-column-start:2;justify-items:end}.drawer-end>.drawer-toggle~.drawer-side>:not(.drawer-overlay){translate:100%}[dir=rtl] :is(.drawer-end>.drawer-toggle~.drawer-side>:not(.drawer-overlay)){translate:-100%}.drawer-end>.drawer-toggle:checked~.drawer-side>:not(.drawer-overlay){translate:0%}.list-col-wrap{grid-row-start:2}.file-input-ghost{box-shadow:none;background-color:#0000;border-color:#0000;transition:background-color .2s}.file-input-ghost::file-selector-button{cursor:pointer;webkit-user-select:none;-webkit-user-select:none;user-select:none;border-start-end-radius:calc(var(--join-ss,var(--radius-field) - var(--border)));border-end-end-radius:calc(var(--join-es,var(--radius-field) - var(--border)));height:100%;margin-block:0;margin-inline:0 1rem;padding-inline:1rem}.file-input-ghost:focus,.file-input-ghost:focus-within{background-color:var(--color-base-100);color:var(--color-base-content);box-shadow:none;border-color:#0000}.input-lg{--size:calc(var(--size-field,.25rem)*12);font-size:max(var(--font-size,1.125rem),1.125rem)}.input-lg[type=number]::-webkit-inner-spin-button{margin-block:-.75rem;margin-inline-end:-.75rem}.input-md{--size:calc(var(--size-field,.25rem)*10);font-size:max(var(--font-size,.875rem),.875rem)}.input-md[type=number]::-webkit-inner-spin-button{margin-block:-.75rem;margin-inline-end:-.75rem}.input-sm{--size:calc(var(--size-field,.25rem)*8);font-size:max(var(--font-size,.75rem),.75rem)}.input-sm[type=number]::-webkit-inner-spin-button{margin-block:-.5rem;margin-inline-end:-.75rem}.input-xl{--size:calc(var(--size-field,.25rem)*14);font-size:max(var(--font-size,1.375rem),1.375rem)}.input-xl[type=number]::-webkit-inner-spin-button{margin-block:-1rem;margin-inline-end:-.75rem}.input-xs{--size:calc(var(--size-field,.25rem)*6);font-size:max(var(--font-size,.6875rem),.6875rem)}.input-xs[type=number]::-webkit-inner-spin-button{margin-block:-.25rem;margin-inline-end:-.75rem}.steps-vertical{grid-auto-rows:1fr;grid-auto-flow:row}.steps-vertical .step{grid-template-rows:auto;grid-template-columns:40px 1fr;justify-items:start;gap:.5rem;min-height:4rem;display:grid}.steps-vertical .step:before{width:.5rem;height:100%;margin-inline-start:50%;translate:-50% -50%}[dir=rtl] :is(.steps-vertical .step):before{translate:50% -50%}.steps-horizontal{grid-auto-columns:1fr;grid-auto-flow:column;display:inline-grid;overflow:auto hidden}.steps-horizontal .step{text-align:center;grid-template-rows:40px 1fr;grid-template-columns:auto;place-items:center;min-width:4rem;display:grid}.steps-horizontal .step:before{width:100%;height:.5rem;margin-inline-start:-100%;translate:0}[dir=rtl] :is(.steps-horizontal .step):before{translate:0}.tabs-box{background-color:var(--color-base-200);--tabs-box-radius:calc(3*var(--radius-field));border-radius:calc(min(calc(var(--tab-height)/2),var(--radius-field)) + min(.25rem,var(--tabs-box-radius)));box-shadow:0 -.5px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 .5px oklch(0% 0 0/calc(var(--depth)*.05)) inset;padding:.25rem}.tabs-box>.tab{border-radius:var(--radius-field);border-style:none}.tabs-box>.tab:focus-visible,.tabs-box>.tab:is(label:has(:checked:focus-visible)){outline-offset:2px}.tabs-box>:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-box>:is(input:checked),.tabs-box>:is(label:has(:checked)){background-color:var(--tab-bg,var(--color-base-100));box-shadow:0 1px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px 1px -1px var(--color-neutral),0 1px 6px -4px var(--color-neutral)}@supports (color:color-mix(in lab,red,red)){.tabs-box>:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-box>:is(input:checked),.tabs-box>:is(label:has(:checked)){box-shadow:0 1px oklch(100% 0 0/calc(var(--depth)*.1)) inset,0 1px 1px -1px color-mix(in oklab,var(--color-neutral)calc(var(--depth)*50%),#0000),0 1px 6px -4px color-mix(in oklab,var(--color-neutral)calc(var(--depth)*100%),#0000)}}@media(forced-colors:active){.tabs-box>:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-box>:is(input:checked),.tabs-box>:is(label:has(:checked)){border:1px solid}}.tabs-box>.tab-content{height:calc(100% - var(--tab-height) + var(--border) - .5rem);border-radius:calc(min(calc(var(--tab-height)/2),var(--radius-field)) + min(.25rem,var(--tabs-box-radius)) - var(--border));margin-top:.25rem}.avatar-placeholder>div{justify-content:center;align-items:center;display:flex}.divider-end:after,.divider-start:before{display:none}.modal-bottom{place-items:end}.modal-bottom .modal-box{--modal-tl:var(--radius-box);--modal-tr:var(--radius-box);--modal-bl:0;--modal-br:0;width:100%;max-width:none;height:auto;max-height:calc(100vh - 5em);translate:0 100%;scale:1}.modal-end{place-items:end}.modal-end .modal-box{--modal-tl:var(--radius-box);--modal-tr:0;--modal-bl:var(--radius-box);--modal-br:0;width:auto;max-width:none;height:100vh;max-height:none;translate:100%;scale:1}.modal-middle{place-items:center}.modal-middle .modal-box{--modal-tl:var(--radius-box);--modal-tr:var(--radius-box);--modal-bl:var(--radius-box);--modal-br:var(--radius-box);width:91.6667%;max-width:32rem;height:auto;max-height:calc(100vh - 5em);translate:0 2%;scale:98%}.modal-start{place-items:start}.modal-start .modal-box{--modal-tl:0;--modal-tr:var(--radius-box);--modal-bl:0;--modal-br:var(--radius-box);width:auto;max-width:none;height:100vh;max-height:none;translate:-100%;scale:1}.modal-top{place-items:start}.modal-top .modal-box{--modal-tl:0;--modal-tr:0;--modal-bl:var(--radius-box);--modal-br:var(--radius-box);width:100%;max-width:none;height:auto;max-height:calc(100vh - 5em);translate:0 -100%;scale:1}.card-side{flex-direction:row;align-items:stretch}.card-side :where(figure:first-child){border-start-start-radius:inherit;border-start-end-radius:unset;border-end-end-radius:unset;border-end-start-radius:inherit;overflow:hidden}.card-side :where(figure:last-child){border-start-start-radius:unset;border-start-end-radius:inherit;border-end-end-radius:inherit;border-end-start-radius:unset;overflow:hidden}.card-side figure>*{max-width:unset}.card-side :where(figure>*){object-fit:cover;width:100%;height:100%}.divider-horizontal{--divider-m:0 1rem}.divider-horizontal.divider{flex-direction:column;width:1rem;height:auto}.divider-horizontal.divider:before,.divider-horizontal.divider:after{width:.125rem;height:100%}.divider-vertical{--divider-m:1rem 0}.divider-vertical.divider{flex-direction:row;width:auto;height:1rem}.divider-vertical.divider:before,.divider-vertical.divider:after{width:100%;height:.125rem}.btn-circle{width:var(--size);height:var(--size);border-radius:3.40282e38px;padding-inline:0}.btn-square{width:var(--size);height:var(--size);padding-inline:0}.status-lg{width:.75rem;height:.75rem}.status-md{width:.5rem;height:.5rem}.status-sm{width:.25rem;height:.25rem}.status-xl{width:1rem;height:1rem}.status-xs{width:.125rem;height:.125rem}.dock-md{height:4rem;height:calc(4rem + env(safe-area-inset-bottom))}.dock-md .dock-label{font-size:.6875rem}.btn-wide{width:100%;max-width:16rem}.dock-active:after{color:currentColor;background-color:currentColor;width:2.5rem}.rating-half.rating-xs :not(.rating-hidden){width:.5rem}.rating-half.rating-sm :not(.rating-hidden){width:.625rem}.rating-half.rating-md :not(.rating-hidden){width:.75rem}.rating-half.rating-lg :not(.rating-hidden){width:.875rem}.rating-half.rating-xl :not(.rating-hidden){width:1rem}.btn-block{width:100%}.loading-lg{width:calc(var(--size-selector,.25rem)*7)}.loading-md{width:calc(var(--size-selector,.25rem)*6)}.loading-sm{width:calc(var(--size-selector,.25rem)*5)}.loading-xl{width:calc(var(--size-selector,.25rem)*8)}.loading-xs{width:calc(var(--size-selector,.25rem)*4)}.swap-rotate .swap-on,.swap-rotate input:indeterminate~.swap-on{rotate:45deg}.swap-rotate input:is(:checked,:indeterminate)~.swap-on,.swap-rotate.swap-active .swap-on{rotate:none}.swap-rotate input:is(:checked,:indeterminate)~.swap-off,.swap-rotate.swap-active .swap-off{rotate:-45deg}.swap-flip{transform-style:preserve-3d;perspective:20rem}.swap-flip .swap-on,.swap-flip .swap-indeterminate,.swap-flip input:indeterminate~.swap-on{backface-visibility:hidden;transform:rotateY(180deg)}.swap-flip input:is(:checked,:indeterminate)~.swap-on,.swap-flip.swap-active .swap-on{transform:rotateY(0)}.swap-flip input:is(:checked,:indeterminate)~.swap-off,.swap-flip.swap-active .swap-off{backface-visibility:hidden;opacity:1;transform:rotateY(-180deg)}.carousel-horizontal{scroll-snap-type:x mandatory;flex-direction:row;overflow-x:scroll}.carousel-vertical{scroll-snap-type:y mandatory;flex-direction:column;overflow-y:scroll}.carousel-center .carousel-item{scroll-snap-align:center}.carousel-end .carousel-item{scroll-snap-align:end}.carousel-start .carousel-item{scroll-snap-align:start}.alert-horizontal{text-align:start;grid-template-columns:auto;grid-auto-flow:column;justify-content:start;justify-items:start}.alert-horizontal:has(:nth-child(2)){grid-template-columns:auto minmax(auto,1fr)}.alert-vertical{text-align:center;grid-template-columns:auto;grid-auto-flow:row;justify-content:center;justify-items:center}.alert-vertical:has(:nth-child(2)){grid-template-columns:auto}.stats-horizontal{grid-auto-flow:column;overflow-x:auto}.stats-horizontal .stat:not(:last-child){border-inline-end:var(--border)dashed currentColor}@supports (color:color-mix(in lab,red,red)){.stats-horizontal .stat:not(:last-child){border-inline-end:var(--border)dashed color-mix(in oklab,currentColor 10%,#0000)}}.stats-horizontal .stat:not(:last-child){border-block-end:none}.stats-vertical{grid-auto-flow:row;overflow-y:auto}.stats-vertical .stat:not(:last-child){border-inline-end:none;border-block-end:var(--border)dashed currentColor}@supports (color:color-mix(in lab,red,red)){.stats-vertical .stat:not(:last-child){border-block-end:var(--border)dashed color-mix(in oklab,currentColor 10%,#0000)}}.footer-horizontal{grid-auto-flow:column}.footer-horizontal.footer-center{grid-auto-flow:dense}.footer-vertical{grid-auto-flow:row}.footer-vertical.footer-center{grid-auto-flow:column dense}.menu-lg :where(li:not(.menu-title)>:not(ul,details,.menu-title)),.menu-lg :where(li:not(.menu-title)>details>summary:not(.menu-title)){border-radius:var(--radius-field);padding-block:.375rem;padding-inline:1rem;font-size:1.125rem}.menu-lg .menu-title{padding-block:.75rem;padding-inline:1.5rem}.menu-md :where(li:not(.menu-title)>:not(ul,details,.menu-title)),.menu-md :where(li:not(.menu-title)>details>summary:not(.menu-title)){border-radius:var(--radius-field);padding-block:.375rem;padding-inline:.75rem;font-size:.875rem}.menu-md .menu-title{padding-block:.5rem;padding-inline:.75rem}.menu-sm :where(li:not(.menu-title)>:not(ul,details,.menu-title)),.menu-sm :where(li:not(.menu-title)>details>summary:not(.menu-title)){border-radius:var(--radius-field);padding-block:.25rem;padding-inline:.625rem;font-size:.75rem}.menu-sm .menu-title{padding-block:.5rem;padding-inline:.75rem}.menu-xl :where(li:not(.menu-title)>:not(ul,details,.menu-title)),.menu-xl :where(li:not(.menu-title)>details>summary:not(.menu-title)){border-radius:var(--radius-field);padding-block:.375rem;padding-inline:1.25rem;font-size:1.375rem}.menu-xl .menu-title{padding-block:.75rem;padding-inline:1.5rem}.menu-xs :where(li:not(.menu-title)>:not(ul,details,.menu-title)),.menu-xs :where(li:not(.menu-title)>details>summary:not(.menu-title)){border-radius:var(--radius-field);padding-block:.25rem;padding-inline:.5rem;font-size:.6875rem}.menu-xs .menu-title{padding-block:.25rem;padding-inline:.5rem}.badge-dash{color:var(--badge-color);--badge-bg:#0000;background-image:none;border-style:dashed;border-color:currentColor}.badge-ghost{border-color:var(--color-base-200);background-color:var(--color-base-200);color:var(--color-base-content);background-image:none}.badge-soft{color:var(--badge-color,var(--color-base-content));background-color:var(--badge-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.badge-soft{background-color:color-mix(in oklab,var(--badge-color,var(--color-base-content))8%,var(--color-base-100))}}.badge-soft{border-color:var(--badge-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.badge-soft{border-color:color-mix(in oklab,var(--badge-color,var(--color-base-content))10%,var(--color-base-100))}}.badge-soft{background-image:none}.select-ghost{box-shadow:none;background-color:#0000;border-color:#0000;transition:background-color .2s}.select-ghost:focus,.select-ghost:focus-within{background-color:var(--color-base-100);color:var(--color-base-content);box-shadow:none;border-color:#0000}.input-ghost{box-shadow:none;background-color:#0000;border-color:#0000}.input-ghost:focus,.input-ghost:focus-within{background-color:var(--color-base-100);color:var(--color-base-content);box-shadow:none;border-color:#0000}.textarea-ghost{box-shadow:none;background-color:#0000;border-color:#0000}.textarea-ghost:focus,.textarea-ghost:focus-within{background-color:var(--color-base-100);color:var(--color-base-content);box-shadow:none;border-color:#0000}.badge-outline{color:var(--badge-color);--badge-bg:#0000;background-image:none;border-color:currentColor}:where(:not(ul,details,.menu-title,.btn)).menu-active{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){:where(:not(ul,details,.menu-title,.btn)).menu-active{outline-offset:2px;outline:2px solid #0000}}:where(:not(ul,details,.menu-title,.btn)).menu-active{color:var(--menu-active-fg);background-color:var(--menu-active-bg);background-size:auto,calc(var(--noise)*100%);background-image:none,var(--fx-noise)}.chat-bubble-accent{background-color:var(--color-accent);color:var(--color-accent-content)}.chat-bubble-error{background-color:var(--color-error);color:var(--color-error-content)}.chat-bubble-info{background-color:var(--color-info);color:var(--color-info-content)}.chat-bubble-neutral{background-color:var(--color-neutral);color:var(--color-neutral-content)}.chat-bubble-primary{background-color:var(--color-primary);color:var(--color-primary-content)}.chat-bubble-secondary{background-color:var(--color-secondary);color:var(--color-secondary-content)}.chat-bubble-success{background-color:var(--color-success);color:var(--color-success-content)}.chat-bubble-warning{background-color:var(--color-warning);color:var(--color-warning-content)}.status-accent{background-color:var(--color-accent);color:var(--color-accent)}.status-error{background-color:var(--color-error);color:var(--color-error)}.status-info{background-color:var(--color-info);color:var(--color-info)}.status-neutral{background-color:var(--color-neutral);color:var(--color-neutral)}.status-primary{background-color:var(--color-primary);color:var(--color-primary)}.status-secondary{background-color:var(--color-secondary);color:var(--color-secondary)}.status-success{background-color:var(--color-success);color:var(--color-success)}.status-warning{background-color:var(--color-warning);color:var(--color-warning)}.table-zebra tbody tr:where(:nth-child(2n)),.table-zebra tbody tr:where(:nth-child(2n)) :where(.table-pin-cols tr th){background-color:var(--color-base-200)}@media(hover:hover){:is(.table-zebra tbody tr.row-hover,.table-zebra tbody tr.row-hover:where(:nth-child(2n))):hover{background-color:var(--color-base-300)}}.divider-accent:before,.divider-accent:after{background-color:var(--color-accent)}.divider-error:before,.divider-error:after{background-color:var(--color-error)}.divider-info:before,.divider-info:after{background-color:var(--color-info)}.divider-neutral:before,.divider-neutral:after{background-color:var(--color-neutral)}.divider-primary:before,.divider-primary:after{background-color:var(--color-primary)}.divider-secondary:before,.divider-secondary:after{background-color:var(--color-secondary)}.divider-success:before,.divider-success:after{background-color:var(--color-success)}.divider-warning:before,.divider-warning:after{background-color:var(--color-warning)}.loading-ball{-webkit-mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='12' cy='5' rx='4' ry='4'%3E%3Canimate attributeName='cy' values='5;20;20.5;20;5' keyTimes='0;0.469;0.5;0.531;1' dur='.8s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1'/%3E%3Canimate attributeName='rx' values='4;4;4.8;4;4' keyTimes='0;0.469;0.5;0.531;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='ry' values='4;4;3;4;4' keyTimes='0;0.469;0.5;0.531;1' dur='.8s' repeatCount='indefinite'/%3E%3C/ellipse%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='12' cy='5' rx='4' ry='4'%3E%3Canimate attributeName='cy' values='5;20;20.5;20;5' keyTimes='0;0.469;0.5;0.531;1' dur='.8s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1'/%3E%3Canimate attributeName='rx' values='4;4;4.8;4;4' keyTimes='0;0.469;0.5;0.531;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='ry' values='4;4;3;4;4' keyTimes='0;0.469;0.5;0.531;1' dur='.8s' repeatCount='indefinite'/%3E%3C/ellipse%3E%3C/svg%3E")}.loading-bars{-webkit-mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect x='9' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3C/rect%3E%3Crect x='17' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3C/rect%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite'/%3E%3C/rect%3E%3Crect x='9' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.65s'/%3E%3C/rect%3E%3Crect x='17' y='1' width='6' height='22'%3E%3Canimate attributeName='y' values='1;5;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3Canimate attributeName='height' values='22;14;22' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3Canimate attributeName='opacity' values='1;0.2;1' keyTimes='0;0.938;1' dur='.8s' repeatCount='indefinite' begin='-0.5s'/%3E%3C/rect%3E%3C/svg%3E")}.loading-dots{-webkit-mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='12' r='3'%3E%3Canimate attributeName='cy' values='12;6;12;12' keyTimes='0;0.286;0.571;1' dur='1.05s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1'/%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='3'%3E%3Canimate attributeName='cy' values='12;6;12;12' keyTimes='0;0.286;0.571;1' dur='1.05s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1' begin='0.1s'/%3E%3C/circle%3E%3Ccircle cx='20' cy='12' r='3'%3E%3Canimate attributeName='cy' values='12;6;12;12' keyTimes='0;0.286;0.571;1' dur='1.05s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1' begin='0.2s'/%3E%3C/circle%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='12' r='3'%3E%3Canimate attributeName='cy' values='12;6;12;12' keyTimes='0;0.286;0.571;1' dur='1.05s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1'/%3E%3C/circle%3E%3Ccircle cx='12' cy='12' r='3'%3E%3Canimate attributeName='cy' values='12;6;12;12' keyTimes='0;0.286;0.571;1' dur='1.05s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1' begin='0.1s'/%3E%3C/circle%3E%3Ccircle cx='20' cy='12' r='3'%3E%3Canimate attributeName='cy' values='12;6;12;12' keyTimes='0;0.286;0.571;1' dur='1.05s' repeatCount='indefinite' keySplines='.33,0,.66,.33;.33,.66,.66,1' begin='0.2s'/%3E%3C/circle%3E%3C/svg%3E")}.loading-infinity{-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='shape-rendering:auto;' width='200px' height='200px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'%3E%3Cpath fill='none' stroke='black' stroke-width='10' stroke-dasharray='205.271 51.318' d='M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z' stroke-linecap='round' style='transform:scale(0.8);transform-origin:50px 50px'%3E%3Canimate attributeName='stroke-dashoffset' repeatCount='indefinite' dur='2s' keyTimes='0;1' values='0;256.589'/%3E%3C/path%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='shape-rendering:auto;' width='200px' height='200px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'%3E%3Cpath fill='none' stroke='black' stroke-width='10' stroke-dasharray='205.271 51.318' d='M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z' stroke-linecap='round' style='transform:scale(0.8);transform-origin:50px 50px'%3E%3Canimate attributeName='stroke-dashoffset' repeatCount='indefinite' dur='2s' keyTimes='0;1' values='0;256.589'/%3E%3C/path%3E%3C/svg%3E")}.loading-ring{-webkit-mask-image:url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg' stroke='white'%3E%3Cg fill='none' fill-rule='evenodd' stroke-width='2'%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='0s' dur='1.8s' values='1;20' calcMode='spline' keyTimes='0;1' keySplines='0.165,0.84,0.44,1' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-opacity' begin='0s' dur='1.8s' values='1;0' calcMode='spline' keyTimes='0;1' keySplines='0.3,0.61,0.355,1' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='-0.9s' dur='1.8s' values='1;20' calcMode='spline' keyTimes='0;1' keySplines='0.165,0.84,0.44,1' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-opacity' begin='-0.9s' dur='1.8s' values='1;0' calcMode='spline' keyTimes='0;1' keySplines='0.3,0.61,0.355,1' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg' stroke='white'%3E%3Cg fill='none' fill-rule='evenodd' stroke-width='2'%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='0s' dur='1.8s' values='1;20' calcMode='spline' keyTimes='0;1' keySplines='0.165,0.84,0.44,1' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-opacity' begin='0s' dur='1.8s' values='1;0' calcMode='spline' keyTimes='0;1' keySplines='0.3,0.61,0.355,1' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='-0.9s' dur='1.8s' values='1;20' calcMode='spline' keyTimes='0;1' keySplines='0.165,0.84,0.44,1' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-opacity' begin='-0.9s' dur='1.8s' values='1;0' calcMode='spline' keyTimes='0;1' keySplines='0.3,0.61,0.355,1' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")}.loading-spinner{-webkit-mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='black' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform-origin='center'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 12 12' to='360 12 12' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dasharray' values='0,150;42,150;42,150' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dashoffset' values='0;-16;-59' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='black' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform-origin='center'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 12 12' to='360 12 12' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dasharray' values='0,150;42,150;42,150' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3Canimate attributeName='stroke-dashoffset' values='0;-16;-59' keyTimes='0;0.475;1' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E")}.mask-circle{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle fill='black' cx='100' cy='100' r='100' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle fill='black' cx='100' cy='100' r='100' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-decagon{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='192' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 0 58.779 19.098 36.327 50v61.804l-36.327 50L96 200l-58.779-19.098-36.327-50V69.098l36.327-50z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='192' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 0 58.779 19.098 36.327 50v61.804l-36.327 50L96 200l-58.779-19.098-36.327-50V69.098l36.327-50z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-diamond{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m100 0 100 100-100 100L0 100z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m100 0 100 100-100 100L0 100z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-heart{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='200' height='185' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 184.606a15.384 15.384 0 0 1-8.653-2.678C53.565 156.28 37.205 138.695 28.182 127.7 8.952 104.264-.254 80.202.005 54.146.308 24.287 24.264 0 53.406 0c21.192 0 35.869 11.937 44.416 21.879a2.884 2.884 0 0 0 4.356 0C110.725 11.927 125.402 0 146.594 0c29.142 0 53.098 24.287 53.4 54.151.26 26.061-8.956 50.122-28.176 73.554-9.023 10.994-25.383 28.58-63.165 54.228a15.384 15.384 0 0 1-8.653 2.673Z' fill='black' fill-rule='nonzero'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='200' height='185' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 184.606a15.384 15.384 0 0 1-8.653-2.678C53.565 156.28 37.205 138.695 28.182 127.7 8.952 104.264-.254 80.202.005 54.146.308 24.287 24.264 0 53.406 0c21.192 0 35.869 11.937 44.416 21.879a2.884 2.884 0 0 0 4.356 0C110.725 11.927 125.402 0 146.594 0c29.142 0 53.098 24.287 53.4 54.151.26 26.061-8.956 50.122-28.176 73.554-9.023 10.994-25.383 28.58-63.165 54.228a15.384 15.384 0 0 1-8.653 2.673Z' fill='black' fill-rule='nonzero'/%3e%3c/svg%3e")}.mask-hexagon{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='182' height='201' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M.3 65.486c0-9.196 6.687-20.063 14.211-25.078l61.86-35.946c8.36-5.016 20.899-5.016 29.258 0l61.86 35.946c8.36 5.015 14.211 15.882 14.211 25.078v71.055c0 9.196-6.687 20.063-14.211 25.079l-61.86 35.945c-8.36 4.18-20.899 4.18-29.258 0L14.51 161.62C6.151 157.44.3 145.737.3 136.54V65.486Z' fill='black' fill-rule='nonzero'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='182' height='201' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M.3 65.486c0-9.196 6.687-20.063 14.211-25.078l61.86-35.946c8.36-5.016 20.899-5.016 29.258 0l61.86 35.946c8.36 5.015 14.211 15.882 14.211 25.078v71.055c0 9.196-6.687 20.063-14.211 25.079l-61.86 35.945c-8.36 4.18-20.899 4.18-29.258 0L14.51 161.62C6.151 157.44.3 145.737.3 136.54V65.486Z' fill='black' fill-rule='nonzero'/%3e%3c/svg%3e")}.mask-hexagon-2{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='200' height='182' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M64.786 181.4c-9.196 0-20.063-6.687-25.079-14.21L3.762 105.33c-5.016-8.36-5.016-20.9 0-29.259l35.945-61.86C44.723 5.851 55.59 0 64.786 0h71.055c9.196 0 20.063 6.688 25.079 14.211l35.945 61.86c4.18 8.36 4.18 20.899 0 29.258l-35.945 61.86c-4.18 8.36-15.883 14.211-25.079 14.211H64.786Z' fill='black' fill-rule='nonzero'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='200' height='182' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M64.786 181.4c-9.196 0-20.063-6.687-25.079-14.21L3.762 105.33c-5.016-8.36-5.016-20.9 0-29.259l35.945-61.86C44.723 5.851 55.59 0 64.786 0h71.055c9.196 0 20.063 6.688 25.079 14.211l35.945 61.86c4.18 8.36 4.18 20.899 0 29.258l-35.945 61.86c-4.18 8.36-15.883 14.211-25.079 14.211H64.786Z' fill='black' fill-rule='nonzero'/%3e%3c/svg%3e")}.mask-pentagon{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='192' height='181' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 0 95.106 69.098-36.327 111.804H37.22L.894 69.098z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='192' height='181' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 0 95.106 69.098-36.327 111.804H37.22L.894 69.098z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-squircle{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3e%3c/svg%3e")}.mask-star{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='192' height='180' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 137.263-58.779 42.024 22.163-68.389L.894 68.481l72.476-.243L96 0l22.63 68.238 72.476.243-58.49 42.417 22.163 68.389z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='192' height='180' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 137.263-58.779 42.024 22.163-68.389L.894 68.481l72.476-.243L96 0l22.63 68.238 72.476.243-58.49 42.417 22.163 68.389z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-star-2{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='192' height='180' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 153.044-58.779 26.243 7.02-63.513L.894 68.481l63.117-13.01L96 0l31.989 55.472 63.117 13.01-43.347 47.292 7.02 63.513z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='192' height='180' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m96 153.044-58.779 26.243 7.02-63.513L.894 68.481l63.117-13.01L96 0l31.989 55.472 63.117 13.01-43.347 47.292 7.02 63.513z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-triangle{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='174' height='149' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m87 148.476-86.603.185L43.86 74.423 87 0l43.14 74.423 43.463 74.238z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='174' height='149' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m87 148.476-86.603.185L43.86 74.423 87 0l43.14 74.423 43.463 74.238z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-triangle-2{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='174' height='150' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m87 .738 86.603-.184-43.463 74.238L87 149.214 43.86 74.792.397.554z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='174' height='150' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m87 .738 86.603-.184-43.463 74.238L87 149.214 43.86 74.792.397.554z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-triangle-3{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='150' height='174' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m149.369 87.107.185 86.603-74.239-43.463L.893 87.107l74.422-43.14L149.554.505z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='150' height='174' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m149.369 87.107.185 86.603-74.239-43.463L.893 87.107l74.422-43.14L149.554.505z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-triangle-4{-webkit-mask-image:url("data:image/svg+xml,%3csvg width='150' height='174' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='M.631 87.107.446.505l74.239 43.462 74.422 43.14-74.422 43.14L.446 173.71z' fill-rule='evenodd'/%3e%3c/svg%3e");mask-image:url("data:image/svg+xml,%3csvg width='150' height='174' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='M.631 87.107.446.505l74.239 43.462 74.422 43.14-74.422 43.14L.446 173.71z' fill-rule='evenodd'/%3e%3c/svg%3e")}.mask-half-1{-webkit-mask-position:0;mask-position:0;-webkit-mask-size:200%;mask-size:200%}.mask-half-1:where(:dir(rtl),[dir=rtl],[dir=rtl] *){-webkit-mask-position:100%;mask-position:100%}.mask-half-2{-webkit-mask-position:100%;mask-position:100%;-webkit-mask-size:200%;mask-size:200%}.mask-half-2:where(:dir(rtl),[dir=rtl],[dir=rtl] *){-webkit-mask-position:0;mask-position:0}.checkbox-lg{--size:calc(var(--size-selector,.25rem)*7);padding:.3125rem}.checkbox-md{--size:calc(var(--size-selector,.25rem)*6);padding:.25rem}.checkbox-sm{--size:calc(var(--size-selector,.25rem)*5);padding:.1875rem}.checkbox-xl{--size:calc(var(--size-selector,.25rem)*8);padding:.375rem}.checkbox-xs{--size:calc(var(--size-selector,.25rem)*4);padding:.125rem}.radio-lg{padding:.3125rem}.radio-lg[type=radio]{--size:calc(var(--size-selector,.25rem)*7)}.radio-md{padding:.25rem}.radio-md[type=radio]{--size:calc(var(--size-selector,.25rem)*6)}.radio-sm{padding:.1875rem}.radio-sm[type=radio]{--size:calc(var(--size-selector,.25rem)*5)}.radio-xl{padding:.375rem}.radio-xl[type=radio]{--size:calc(var(--size-selector,.25rem)*8)}.radio-xs{padding:.125rem}.radio-xs[type=radio]{--size:calc(var(--size-selector,.25rem)*4)}.select-lg{--size:calc(var(--size-field,.25rem)*12);font-size:1.125rem}.select-lg option{padding-block:.375rem;padding-inline:1rem}.select-md{--size:calc(var(--size-field,.25rem)*10);font-size:.875rem}.select-md option{padding-block:.375rem;padding-inline:.75rem}.select-sm{--size:calc(var(--size-field,.25rem)*8);font-size:.75rem}.select-sm option{padding-block:.25rem;padding-inline:.625rem}.select-xl{--size:calc(var(--size-field,.25rem)*14);font-size:1.375rem}.select-xl option{padding-block:.375rem;padding-inline:1.25rem}.select-xs{--size:calc(var(--size-field,.25rem)*6);font-size:.6875rem}.select-xs option{padding-block:.25rem;padding-inline:.5rem}.table-lg :not(thead,tfoot) tr{font-size:1.125rem}.table-lg :where(th,td){padding-block:1rem;padding-inline:1.25rem}.table-md :not(thead,tfoot) tr{font-size:.875rem}.table-md :where(th,td){padding-block:.75rem;padding-inline:1rem}.table-sm :not(thead,tfoot) tr{font-size:.75rem}.table-sm :where(th,td){padding-block:.5rem;padding-inline:.75rem}.table-xl :not(thead,tfoot) tr{font-size:1.375rem}.table-xl :where(th,td){padding-block:1.25rem;padding-inline:1.5rem}.table-xs :not(thead,tfoot) tr{font-size:.6875rem}.table-xs :where(th,td){padding-block:.25rem;padding-inline:.5rem}.badge-lg{--size:calc(var(--size-selector,.25rem)*7);padding-inline:calc(.25rem*3.5 - var(--border));font-size:1rem}.badge-md{--size:calc(var(--size-selector,.25rem)*6);padding-inline:calc(.25rem*3 - var(--border));font-size:.875rem}.badge-sm{--size:calc(var(--size-selector,.25rem)*5);padding-inline:calc(.25rem*2.5 - var(--border));font-size:.75rem}.badge-xl{--size:calc(var(--size-selector,.25rem)*8);padding-inline:calc(.25rem*4 - var(--border));font-size:1.125rem}.badge-xs{--size:calc(var(--size-selector,.25rem)*4);padding-inline:calc(.25rem*2 - var(--border));font-size:.625rem}.file-input-xl{--size:calc(var(--size-field,.25rem)*14);padding-inline-end:1.5rem;font-size:1.125rem;line-height:3rem}.file-input-xl::file-selector-button{font-size:1.375rem}.file-input-lg{--size:calc(var(--size-field,.25rem)*12);font-size:1.125rem;line-height:2.5rem}.file-input-lg::file-selector-button{font-size:1.125rem}.file-input-md{--size:calc(var(--size-field,.25rem)*10);font-size:.875rem;line-height:2}.file-input-md::file-selector-button{font-size:.875rem}.file-input-sm{--size:calc(var(--size-field,.25rem)*8);font-size:.75rem;line-height:1.5rem}.file-input-sm::file-selector-button{font-size:.75rem}.file-input-xs{--size:calc(var(--size-field,.25rem)*6);font-size:.6875rem;line-height:1rem}.file-input-xs::file-selector-button{font-size:.6875rem}.tabs-lg{--tab-height:calc(var(--size-field,.25rem)*12)}.tabs-lg>.tab{--tab-p:1rem;--tab-radius-min:calc(1.5rem - var(--border));font-size:1.125rem}.tabs-md{--tab-height:calc(var(--size-field,.25rem)*10)}.tabs-md>.tab{--tab-p:.75rem;--tab-radius-min:calc(.75rem - var(--border));font-size:.875rem}.tabs-sm{--tab-height:calc(var(--size-field,.25rem)*8)}.tabs-sm>.tab{--tab-p:.5rem;--tab-radius-min:calc(.5rem - var(--border));font-size:.875rem}.tabs-xl{--tab-height:calc(var(--size-field,.25rem)*14)}.tabs-xl>.tab{--tab-p:1.25rem;--tab-radius-min:calc(2rem - var(--border));font-size:1.125rem}.tabs-xs{--tab-height:calc(var(--size-field,.25rem)*6)}.tabs-xs>.tab{--tab-p:.375rem;--tab-radius-min:calc(.5rem - var(--border));font-size:.75rem}.kbd-lg{--size:calc(var(--size-selector,.25rem)*7);font-size:1rem}.kbd-md{--size:calc(var(--size-selector,.25rem)*6);font-size:.875rem}.kbd-sm{--size:calc(var(--size-selector,.25rem)*5);font-size:.75rem}.kbd-xl{--size:calc(var(--size-selector,.25rem)*8);font-size:1.125rem}.kbd-xs{--size:calc(var(--size-selector,.25rem)*4);font-size:.625rem}.textarea-lg{font-size:max(var(--font-size,1.125rem),1.125rem)}.textarea-md{font-size:max(var(--font-size,.875rem),.875rem)}.textarea-sm{font-size:max(var(--font-size,.75rem),.75rem)}.textarea-xl{font-size:max(var(--font-size,1.375rem),1.375rem)}.textarea-xs{font-size:max(var(--font-size,.6875rem),.6875rem)}.alert-error{color:var(--color-error-content);--alert-border-color:var(--color-error);--alert-color:var(--color-error)}.alert-info{color:var(--color-info-content);--alert-border-color:var(--color-info);--alert-color:var(--color-info)}.alert-success{color:var(--color-success-content);--alert-border-color:var(--color-success);--alert-color:var(--color-success)}.alert-warning{color:var(--color-warning-content);--alert-border-color:var(--color-warning);--alert-color:var(--color-warning)}.file-input-accent{--btn-color:var(--color-accent)}.file-input-accent::file-selector-button{color:var(--color-accent-content)}.file-input-accent,.file-input-accent:focus,.file-input-accent:focus-within{--input-color:var(--color-accent)}.file-input-error{--btn-color:var(--color-error)}.file-input-error::file-selector-button{color:var(--color-error-content)}.file-input-error,.file-input-error:focus,.file-input-error:focus-within{--input-color:var(--color-error)}.file-input-info{--btn-color:var(--color-info)}.file-input-info::file-selector-button{color:var(--color-info-content)}.file-input-info,.file-input-info:focus,.file-input-info:focus-within{--input-color:var(--color-info)}.file-input-neutral{--btn-color:var(--color-neutral)}.file-input-neutral::file-selector-button{color:var(--color-neutral-content)}.file-input-neutral,.file-input-neutral:focus,.file-input-neutral:focus-within{--input-color:var(--color-neutral)}.file-input-primary{--btn-color:var(--color-primary)}.file-input-primary::file-selector-button{color:var(--color-primary-content)}.file-input-primary,.file-input-primary:focus,.file-input-primary:focus-within{--input-color:var(--color-primary)}.file-input-secondary{--btn-color:var(--color-secondary)}.file-input-secondary::file-selector-button{color:var(--color-secondary-content)}.file-input-secondary,.file-input-secondary:focus,.file-input-secondary:focus-within{--input-color:var(--color-secondary)}.file-input-success{--btn-color:var(--color-success)}.file-input-success::file-selector-button{color:var(--color-success-content)}.file-input-success,.file-input-success:focus,.file-input-success:focus-within{--input-color:var(--color-success)}.file-input-warning{--btn-color:var(--color-warning)}.file-input-warning::file-selector-button{color:var(--color-warning-content)}.file-input-warning,.file-input-warning:focus,.file-input-warning:focus-within{--input-color:var(--color-warning)}.checkbox-accent{color:var(--color-accent-content);--input-color:var(--color-accent)}.checkbox-error{color:var(--color-error-content);--input-color:var(--color-error)}.checkbox-info{color:var(--color-info-content);--input-color:var(--color-info)}.checkbox-neutral{color:var(--color-neutral-content);--input-color:var(--color-neutral)}.checkbox-primary{color:var(--color-primary-content);--input-color:var(--color-primary)}.checkbox-secondary{color:var(--color-secondary-content);--input-color:var(--color-secondary)}.checkbox-success{color:var(--color-success-content);--input-color:var(--color-success)}.checkbox-warning{color:var(--color-warning-content);--input-color:var(--color-warning)}.link-accent{color:var(--color-accent)}@media(hover:hover){.link-accent:hover{color:var(--color-accent)}@supports (color:color-mix(in lab,red,red)){.link-accent:hover{color:color-mix(in oklab,var(--color-accent)80%,#000)}}}.link-error{color:var(--color-error)}@media(hover:hover){.link-error:hover{color:var(--color-error)}@supports (color:color-mix(in lab,red,red)){.link-error:hover{color:color-mix(in oklab,var(--color-error)80%,#000)}}}.link-info{color:var(--color-info)}@media(hover:hover){.link-info:hover{color:var(--color-info)}@supports (color:color-mix(in lab,red,red)){.link-info:hover{color:color-mix(in oklab,var(--color-info)80%,#000)}}}.link-neutral{color:var(--color-neutral)}@media(hover:hover){.link-neutral:hover{color:var(--color-neutral)}@supports (color:color-mix(in lab,red,red)){.link-neutral:hover{color:color-mix(in oklab,var(--color-neutral)80%,#000)}}}.link-primary{color:var(--color-primary)}@media(hover:hover){.link-primary:hover{color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.link-primary:hover{color:color-mix(in oklab,var(--color-primary)80%,#000)}}}.link-secondary{color:var(--color-secondary)}@media(hover:hover){.link-secondary:hover{color:var(--color-secondary)}@supports (color:color-mix(in lab,red,red)){.link-secondary:hover{color:color-mix(in oklab,var(--color-secondary)80%,#000)}}}.link-success{color:var(--color-success)}@media(hover:hover){.link-success:hover{color:var(--color-success)}@supports (color:color-mix(in lab,red,red)){.link-success:hover{color:color-mix(in oklab,var(--color-success)80%,#000)}}}.link-warning{color:var(--color-warning)}@media(hover:hover){.link-warning:hover{color:var(--color-warning)}@supports (color:color-mix(in lab,red,red)){.link-warning:hover{color:color-mix(in oklab,var(--color-warning)80%,#000)}}}.range-accent{color:var(--color-accent);--range-thumb:var(--color-accent-content)}.range-error{color:var(--color-error);--range-thumb:var(--color-error-content)}.range-info{color:var(--color-info);--range-thumb:var(--color-info-content)}.range-neutral{color:var(--color-neutral);--range-thumb:var(--color-neutral-content)}.range-primary{color:var(--color-primary);--range-thumb:var(--color-primary-content)}.range-secondary{color:var(--color-secondary);--range-thumb:var(--color-secondary-content)}.range-success{color:var(--color-success);--range-thumb:var(--color-success-content)}.range-warning{color:var(--color-warning);--range-thumb:var(--color-warning-content)}.tooltip-accent{--tt-bg:var(--color-accent)}.tooltip-accent>.tooltip-content,.tooltip-accent[data-tip]:before{color:var(--color-accent-content)}.tooltip-error{--tt-bg:var(--color-error)}.tooltip-error>.tooltip-content,.tooltip-error[data-tip]:before{color:var(--color-error-content)}.tooltip-info{--tt-bg:var(--color-info)}.tooltip-info>.tooltip-content,.tooltip-info[data-tip]:before{color:var(--color-info-content)}.tooltip-primary{--tt-bg:var(--color-primary)}.tooltip-primary>.tooltip-content,.tooltip-primary[data-tip]:before{color:var(--color-primary-content)}.tooltip-secondary{--tt-bg:var(--color-secondary)}.tooltip-secondary>.tooltip-content,.tooltip-secondary[data-tip]:before{color:var(--color-secondary-content)}.tooltip-success{--tt-bg:var(--color-success)}.tooltip-success>.tooltip-content,.tooltip-success[data-tip]:before{color:var(--color-success-content)}.tooltip-warning{--tt-bg:var(--color-warning)}.tooltip-warning>.tooltip-content,.tooltip-warning[data-tip]:before{color:var(--color-warning-content)}.progress-accent{color:var(--color-accent)}.progress-error{color:var(--color-error)}.progress-info{color:var(--color-info)}.progress-neutral{color:var(--color-neutral)}.progress-primary{color:var(--color-primary)}.progress-secondary{color:var(--color-secondary)}.progress-success{color:var(--color-success)}.progress-warning{color:var(--color-warning)}.link-hover{text-decoration-line:none}@media(hover:hover){.link-hover:hover{text-decoration-line:underline}}.swap-active .swap-off{opacity:0}.swap-active .swap-on{opacity:1}.tabs-bottom{--tabs-height:auto;--tabs-direction:row}.tabs-bottom>.tab{--tab-order:1;--tab-border:var(--border)0 0 0;--tab-radius-ss:0;--tab-radius-se:0;--tab-radius-es:var(--tab-radius-limit);--tab-radius-ee:var(--tab-radius-limit);--tab-border-colors:var(--tab-border-color)#0000 #0000 #0000;--tab-paddings:0 var(--tab-p)var(--border)var(--tab-p);--tab-corner-width:calc(100% + var(--tab-radius-limit)*2);--tab-corner-height:var(--tab-radius-limit);--tab-corner-position:top left,top right}.tabs-bottom>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-bottom>.tab:is(input:checked),.tabs-bottom>.tab:is(label:has(:checked)){--tab-border:0 var(--border)var(--border)var(--border);--tab-border-colors:#0000 var(--tab-border-color)var(--tab-border-color)var(--tab-border-color);--tab-paddings:var(--border)calc(var(--tab-p) - var(--border))0 calc(var(--tab-p) - var(--border));--tab-inset:0 auto auto auto;--radius-start:radial-gradient(circle at bottom left,var(--tab-radius-grad));--radius-end:radial-gradient(circle at bottom right,var(--tab-radius-grad))}.tabs-bottom:has(>.tab-content)>.tab:first-child:not(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]){--tab-border-colors:#0000 var(--tab-border-color)var(--tab-border-color)var(--tab-border-color)}.tabs-bottom>.tab-content{--tabcontent-order:0;--tabcontent-margin:0 0 calc(-1*var(--border))0;--tabcontent-radius-ss:var(--radius-box);--tabcontent-radius-se:var(--radius-box);--tabcontent-radius-es:0;--tabcontent-radius-ee:var(--radius-box)}:is(.tabs-bottom>:checked,.tabs-bottom>:is(label:has(:checked)),.tabs-bottom>:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]))+.tab-content:not(:nth-child(2)){--tabcontent-radius-es:var(--radius-box)}.tabs-top{--tabs-height:auto;--tabs-direction:row}.tabs-top>.tab{--tab-order:0;--tab-border:0 0 var(--border)0;--tab-radius-ss:var(--tab-radius-limit);--tab-radius-se:var(--tab-radius-limit);--tab-radius-es:0;--tab-radius-ee:0;--tab-paddings:var(--border)var(--tab-p)0 var(--tab-p);--tab-border-colors:#0000 #0000 var(--tab-border-color)#0000;--tab-corner-width:calc(100% + var(--tab-radius-limit)*2);--tab-corner-height:var(--tab-radius-limit);--tab-corner-position:top left,top right}.tabs-top>.tab:is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]):not(.tab-disabled,[disabled]),.tabs-top>.tab:is(input:checked),.tabs-top>.tab:is(label:has(:checked)){--tab-border:var(--border)var(--border)0 var(--border);--tab-border-colors:var(--tab-border-color)var(--tab-border-color)#0000 var(--tab-border-color);--tab-paddings:0 calc(var(--tab-p) - var(--border))var(--border)calc(var(--tab-p) - var(--border));--tab-inset:auto auto 0 auto;--radius-start:radial-gradient(circle at top left,var(--tab-radius-grad));--radius-end:radial-gradient(circle at top right,var(--tab-radius-grad))}.tabs-top:has(>.tab-content)>.tab:first-child:not(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]){--tab-border-colors:var(--tab-border-color)var(--tab-border-color)#0000 var(--tab-border-color)}.tabs-top>.tab-content{--tabcontent-order:1;--tabcontent-margin:calc(-1*var(--border))0 0 0;--tabcontent-radius-ss:0;--tabcontent-radius-se:var(--radius-box);--tabcontent-radius-es:var(--radius-box);--tabcontent-radius-ee:var(--radius-box)}:is(.tabs-top :checked,.tabs-top label:has(:checked),.tabs-top :is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]))+.tab-content:first-child,:is(.tabs-top :checked,.tabs-top label:has(:checked),.tabs-top :is(.tab-active,[aria-selected=true],[aria-current=true],[aria-current=page]))+.tab-content:nth-child(n+3){--tabcontent-radius-ss:var(--radius-box)}.indicator-end{--indicator-s:auto;--indicator-e:0;--indicator-x:50%}[dir=rtl] .indicator-end,.indicator-start{--indicator-s:0;--indicator-e:auto;--indicator-x:-50%}[dir=rtl] .indicator-start{--indicator-s:auto;--indicator-e:0;--indicator-x:50%}.indicator-center{--indicator-s:50%;--indicator-e:50%;--indicator-x:-50%}[dir=rtl] .indicator-center{--indicator-x:50%}.btn-lg{--fontsize:1.125rem;--btn-p:1.25rem;--size:calc(var(--size-field,.25rem)*12)}.btn-md{--fontsize:.875rem;--btn-p:1rem;--size:calc(var(--size-field,.25rem)*10)}.btn-sm{--fontsize:.75rem;--btn-p:.75rem;--size:calc(var(--size-field,.25rem)*8)}.btn-xl{--fontsize:1.375rem;--btn-p:1.5rem;--size:calc(var(--size-field,.25rem)*14)}.btn-xs{--fontsize:.6875rem;--btn-p:.5rem;--size:calc(var(--size-field,.25rem)*6)}.card-lg .card-body{--card-p:2rem;--card-fs:1rem}.card-lg .card-title{--cardtitle-fs:1.25rem}.card-md .card-body{--card-p:1.5rem;--card-fs:.875rem}.card-md .card-title{--cardtitle-fs:1.125rem}.card-sm .card-body{--card-p:1rem;--card-fs:.75rem}.card-sm .card-title{--cardtitle-fs:1rem}.card-xl .card-body{--card-p:2.5rem;--card-fs:1.125rem}.card-xl .card-title{--cardtitle-fs:1.375rem}.card-xs .card-body{--card-p:.5rem;--card-fs:.6875rem}.card-xs .card-title{--cardtitle-fs:.875rem}.indicator-bottom{--indicator-t:auto;--indicator-b:0;--indicator-y:50%}.indicator-middle{--indicator-t:50%;--indicator-b:50%;--indicator-y:-50%}.indicator-top{--indicator-t:0;--indicator-b:auto;--indicator-y:-50%}.badge-accent{--badge-color:var(--color-accent);--badge-fg:var(--color-accent-content)}.badge-error{--badge-color:var(--color-error);--badge-fg:var(--color-error-content)}.badge-info{--badge-color:var(--color-info);--badge-fg:var(--color-info-content)}.badge-neutral{--badge-color:var(--color-neutral);--badge-fg:var(--color-neutral-content)}.badge-primary{--badge-color:var(--color-primary);--badge-fg:var(--color-primary-content)}.badge-secondary{--badge-color:var(--color-secondary);--badge-fg:var(--color-secondary-content)}.badge-success{--badge-color:var(--color-success);--badge-fg:var(--color-success-content)}.badge-warning{--badge-color:var(--color-warning);--badge-fg:var(--color-warning-content)}.timeline-snap-icon>li{--timeline-col-start:.5rem;--timeline-row-start:minmax(0,1fr)}.card-border{border:var(--border)solid var(--color-base-200)}.card-dash{border:var(--border)dashed var(--color-base-200)}.input-accent,.input-accent:focus,.input-accent:focus-within{--input-color:var(--color-accent)}.input-error,.input-error:focus,.input-error:focus-within{--input-color:var(--color-error)}.input-info,.input-info:focus,.input-info:focus-within{--input-color:var(--color-info)}.input-neutral,.input-neutral:focus,.input-neutral:focus-within{--input-color:var(--color-neutral)}.input-primary,.input-primary:focus,.input-primary:focus-within{--input-color:var(--color-primary)}.input-secondary,.input-secondary:focus,.input-secondary:focus-within{--input-color:var(--color-secondary)}.input-success,.input-success:focus,.input-success:focus-within{--input-color:var(--color-success)}.input-warning,.input-warning:focus,.input-warning:focus-within{--input-color:var(--color-warning)}.radio-accent{--input-color:var(--color-accent)}.radio-error{--input-color:var(--color-error)}.radio-info{--input-color:var(--color-info)}.radio-neutral{--input-color:var(--color-neutral)}.radio-primary{--input-color:var(--color-primary)}.radio-secondary{--input-color:var(--color-secondary)}.radio-success{--input-color:var(--color-success)}.radio-warning{--input-color:var(--color-warning)}.range-lg{--range-thumb-size:calc(var(--size-selector,.25rem)*7)}.range-md{--range-thumb-size:calc(var(--size-selector,.25rem)*6)}.range-sm{--range-thumb-size:calc(var(--size-selector,.25rem)*5)}.range-xl{--range-thumb-size:calc(var(--size-selector,.25rem)*8)}.range-xs{--range-thumb-size:calc(var(--size-selector,.25rem)*4)}.select-accent,.select-accent:focus,.select-accent:focus-within{--input-color:var(--color-accent)}.select-error,.select-error:focus,.select-error:focus-within{--input-color:var(--color-error)}.select-info,.select-info:focus,.select-info:focus-within{--input-color:var(--color-info)}.select-neutral,.select-neutral:focus,.select-neutral:focus-within{--input-color:var(--color-neutral)}.select-primary,.select-primary:focus,.select-primary:focus-within{--input-color:var(--color-primary)}.select-secondary,.select-secondary:focus,.select-secondary:focus-within{--input-color:var(--color-secondary)}.select-success,.select-success:focus,.select-success:focus-within{--input-color:var(--color-success)}.select-warning,.select-warning:focus,.select-warning:focus-within{--input-color:var(--color-warning)}.textarea-accent,.textarea-accent:focus,.textarea-accent:focus-within{--input-color:var(--color-accent)}.textarea-error,.textarea-error:focus,.textarea-error:focus-within{--input-color:var(--color-error)}.textarea-info,.textarea-info:focus,.textarea-info:focus-within{--input-color:var(--color-info)}.textarea-neutral,.textarea-neutral:focus,.textarea-neutral:focus-within{--input-color:var(--color-neutral)}.textarea-primary,.textarea-primary:focus,.textarea-primary:focus-within{--input-color:var(--color-primary)}.textarea-secondary,.textarea-secondary:focus,.textarea-secondary:focus-within{--input-color:var(--color-secondary)}.textarea-success,.textarea-success:focus,.textarea-success:focus-within{--input-color:var(--color-success)}.textarea-warning,.textarea-warning:focus,.textarea-warning:focus-within{--input-color:var(--color-warning)}.toggle-accent:checked,.toggle-accent[aria-checked=true]{--input-color:var(--color-accent)}.toggle-error:checked,.toggle-error[aria-checked=true]{--input-color:var(--color-error)}.toggle-info:checked,.toggle-info[aria-checked=true]{--input-color:var(--color-info)}.toggle-lg[type=checkbox],.toggle-lg:has([type=checkbox]){--size:calc(var(--size-selector,.25rem)*7)}.toggle-md[type=checkbox],.toggle-md:has([type=checkbox]){--size:calc(var(--size-selector,.25rem)*6)}.toggle-neutral:checked,.toggle-neutral[aria-checked=true]{--input-color:var(--color-neutral)}.toggle-primary:checked,.toggle-primary[aria-checked=true]{--input-color:var(--color-primary)}.toggle-secondary:checked,.toggle-secondary[aria-checked=true]{--input-color:var(--color-secondary)}.toggle-sm[type=checkbox],.toggle-sm:has([type=checkbox]){--size:calc(var(--size-selector,.25rem)*5)}.toggle-success:checked,.toggle-success[aria-checked=true]{--input-color:var(--color-success)}.toggle-warning:checked,.toggle-warning[aria-checked=true]{--input-color:var(--color-warning)}.toggle-xl[type=checkbox],.toggle-xl:has([type=checkbox]){--size:calc(var(--size-selector,.25rem)*8)}.toggle-xs[type=checkbox],.toggle-xs:has([type=checkbox]){--size:calc(var(--size-selector,.25rem)*4)}}.pointer-events-none{pointer-events:none}.countdown.countdown{line-height:1em}.collapse:not(td,tr,colgroup){visibility:revert-layer}.validator:user-invalid~.validator-hint{display:revert-layer}.validator:has(:user-invalid)~.validator-hint{display:revert-layer}:is(.validator[aria-invalid]:not([aria-invalid=false]),.validator:has([aria-invalid]:not([aria-invalid=false])))~.validator-hint{display:revert-layer}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.inset-0{inset:calc(var(--spacing)*0)}.-start-1{inset-inline-start:calc(var(--spacing)*-1)}.start-0{inset-inline-start:calc(var(--spacing)*0)}.start-1{inset-inline-start:calc(var(--spacing)*1)}.start-full{inset-inline-start:100%}.end-0{inset-inline-end:calc(var(--spacing)*0)}.end-2{inset-inline-end:calc(var(--spacing)*2)}.end-4{inset-inline-end:calc(var(--spacing)*4)}.-top-7{top:calc(var(--spacing)*-7)}.top-0{top:calc(var(--spacing)*0)}.top-1{top:calc(var(--spacing)*1)}.top-1\\/2{top:50%}.top-1\\/3{top:33.3333%}.top-2{top:calc(var(--spacing)*2)}.top-4{top:calc(var(--spacing)*4)}.right-0{right:calc(var(--spacing)*0)}.right-1{right:calc(var(--spacing)*1)}.right-2{right:calc(var(--spacing)*2)}.right-4{right:calc(var(--spacing)*4)}.right-5{right:calc(var(--spacing)*5)}.-bottom-full{bottom:-100%}.bottom-0{bottom:calc(var(--spacing)*0)}.bottom-1{bottom:calc(var(--spacing)*1)}.bottom-2{bottom:calc(var(--spacing)*2)}.left-1{left:calc(var(--spacing)*1)}.left-4{left:calc(var(--spacing)*4)}.left-5{left:calc(var(--spacing)*5)}.z-1{z-index:1}.z-2{z-index:2}.z-3{z-index:3}.z-10{z-index:10}.z-1002{z-index:1002}.col-span-2{grid-column:span 2/span 2}.col-start-1{grid-column-start:1}.row-start-1{grid-row-start:1}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.m-0\\!{margin:calc(var(--spacing)*0)!important}.m-1{margin:calc(var(--spacing)*1)}.m-4{margin:calc(var(--spacing)*4)}.mx-1{margin-inline:calc(var(--spacing)*1)}.mx-2{margin-inline:calc(var(--spacing)*2)}.mx-4{margin-inline:calc(var(--spacing)*4)}.mx-10{margin-inline:calc(var(--spacing)*10)}.mx-auto{margin-inline:auto}.my-0{margin-block:calc(var(--spacing)*0)}.my-1{margin-block:calc(var(--spacing)*1)}.my-2{margin-block:calc(var(--spacing)*2)}.my-6{margin-block:calc(var(--spacing)*6)}.my-10{margin-block:calc(var(--spacing)*10)}.my-16{margin-block:calc(var(--spacing)*16)}.my-20{margin-block:calc(var(--spacing)*20)}.join-horizontal{flex-direction:row}.join-horizontal>.join-item:first-child,.join-horizontal :first-child:not(:last-child) .join-item{--join-ss:var(--radius-field);--join-se:0;--join-es:var(--radius-field);--join-ee:0}.join-horizontal>.join-item:last-child,.join-horizontal :last-child:not(:first-child) .join-item{--join-ss:0;--join-se:var(--radius-field);--join-es:0;--join-ee:var(--radius-field)}.join-horizontal>.join-item:only-child,.join-horizontal :only-child .join-item{--join-ss:var(--radius-field);--join-se:var(--radius-field);--join-es:var(--radius-field);--join-ee:var(--radius-field)}.join-horizontal .join-item:where(:not(:first-child)){margin-block-start:0;margin-inline-start:calc(var(--border,1px)*-1)}.join-vertical{flex-direction:column}.join-vertical>.join-item:first-child,.join-vertical :first-child:not(:last-child) .join-item{--join-ss:var(--radius-field);--join-se:var(--radius-field);--join-es:0;--join-ee:0}.join-vertical>.join-item:last-child,.join-vertical :last-child:not(:first-child) .join-item{--join-ss:0;--join-se:0;--join-es:var(--radius-field);--join-ee:var(--radius-field)}.join-vertical>.join-item:only-child,.join-vertical :only-child .join-item{--join-ss:var(--radius-field);--join-se:var(--radius-field);--join-es:var(--radius-field);--join-ee:var(--radius-field)}.join-vertical .join-item:where(:not(:first-child)){margin-block-start:calc(var(--border,1px)*-1);margin-inline-start:0}.join-item:where(:not(:first-child,:disabled,[disabled],.btn-disabled)){margin-block-start:0;margin-inline-start:calc(var(--border,1px)*-1)}.join-item:where(:is(:disabled,[disabled],.btn-disabled)){border-width:var(--border,1px)0 var(--border,1px)var(--border,1px)}.me-2{margin-inline-end:calc(var(--spacing)*2)}.-mt-1{margin-top:calc(var(--spacing)*-1)}.mt-0\\.5{margin-top:calc(var(--spacing)*.5)}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-3{margin-top:calc(var(--spacing)*3)}.mt-4{margin-top:calc(var(--spacing)*4)}.mt-6{margin-top:calc(var(--spacing)*6)}.mt-10{margin-top:calc(var(--spacing)*10)}.mt-12{margin-top:calc(var(--spacing)*12)}.mt-16{margin-top:calc(var(--spacing)*16)}.mt-32{margin-top:calc(var(--spacing)*32)}.mr-2{margin-right:calc(var(--spacing)*2)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-5{margin-bottom:calc(var(--spacing)*5)}.mb-6{margin-bottom:calc(var(--spacing)*6)}.mb-10{margin-bottom:calc(var(--spacing)*10)}.mb-16{margin-bottom:calc(var(--spacing)*16)}.mb-20{margin-bottom:calc(var(--spacing)*20)}.mb-28{margin-bottom:calc(var(--spacing)*28)}.mb-32{margin-bottom:calc(var(--spacing)*32)}.mb-40{margin-bottom:calc(var(--spacing)*40)}.mb-48{margin-bottom:calc(var(--spacing)*48)}.mb-72{margin-bottom:calc(var(--spacing)*72)}.ml-2{margin-left:calc(var(--spacing)*2)}.ml-3{margin-left:calc(var(--spacing)*3)}.ml-auto{margin-left:auto}.kbd{box-shadow:none}.alert{border-width:var(--border);border-color:var(--alert-border-color,var(--color-base-200))}.join{--join-ss:0;--join-se:0;--join-es:0;--join-ee:0;align-items:stretch;display:inline-flex}.join :where(.join-item){border-start-start-radius:var(--join-ss,0);border-start-end-radius:var(--join-se,0);border-end-end-radius:var(--join-ee,0);border-end-start-radius:var(--join-es,0)}.join :where(.join-item) *{--join-ss:var(--radius-field);--join-se:var(--radius-field);--join-es:var(--radius-field);--join-ee:var(--radius-field)}.join>.join-item:where(:first-child),.join :first-child:not(:last-child) :where(.join-item){--join-ss:var(--radius-field);--join-se:0;--join-es:var(--radius-field);--join-ee:0}.join>.join-item:where(:last-child),.join :last-child:not(:first-child) :where(.join-item){--join-ss:0;--join-se:var(--radius-field);--join-es:0;--join-ee:var(--radius-field)}.join>.join-item:where(:only-child),.join :only-child :where(.join-item){--join-ss:var(--radius-field);--join-se:var(--radius-field);--join-es:var(--radius-field);--join-ee:var(--radius-field)}.line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}:root .prose{--tw-prose-body:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-body:color-mix(in oklab,var(--color-base-content)80%,#0000)}}:root .prose{--tw-prose-headings:var(--color-base-content);--tw-prose-lead:var(--color-base-content);--tw-prose-links:var(--color-base-content);--tw-prose-bold:var(--color-base-content);--tw-prose-counters:var(--color-base-content);--tw-prose-bullets:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-bullets:color-mix(in oklab,var(--color-base-content)50%,#0000)}}:root .prose{--tw-prose-hr:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-hr:color-mix(in oklab,var(--color-base-content)20%,#0000)}}:root .prose{--tw-prose-quotes:var(--color-base-content);--tw-prose-quote-borders:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-quote-borders:color-mix(in oklab,var(--color-base-content)20%,#0000)}}:root .prose{--tw-prose-captions:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-captions:color-mix(in oklab,var(--color-base-content)50%,#0000)}}:root .prose{--tw-prose-code:var(--color-base-content);--tw-prose-pre-code:var(--color-neutral-content);--tw-prose-pre-bg:var(--color-neutral);--tw-prose-th-borders:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-th-borders:color-mix(in oklab,var(--color-base-content)50%,#0000)}}:root .prose{--tw-prose-td-borders:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-td-borders:color-mix(in oklab,var(--color-base-content)20%,#0000)}}:root .prose{--tw-prose-kbd:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){:root .prose{--tw-prose-kbd:color-mix(in oklab,var(--color-base-content)80%,#0000)}}:root .prose :where(code):not(pre>code){background-color:var(--color-base-200);border-radius:var(--radius-selector);border:var(--border)solid var(--color-base-300);font-weight:inherit;padding-block:.2em;padding-inline:.5em}:root .prose :where(code):not(pre>code):before,:root .prose :where(code):not(pre>code):after{display:none}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.table{display:table}.aspect-16\\/9{aspect-ratio:16/9}.aspect-\\[1600\\/650\\]{aspect-ratio:1600/650}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:var(--aspect-video)}.size-1\\.5{width:calc(var(--spacing)*1.5);height:calc(var(--spacing)*1.5)}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.size-5{width:calc(var(--spacing)*5);height:calc(var(--spacing)*5)}.size-6{width:calc(var(--spacing)*6);height:calc(var(--spacing)*6)}.size-10{width:calc(var(--spacing)*10);height:calc(var(--spacing)*10)}.size-28{width:calc(var(--spacing)*28);height:calc(var(--spacing)*28)}.size-\\[1\\.2em\\]{width:1.2em;height:1.2em}.size-\\[1\\.8em\\]{width:1.8em;height:1.8em}.size-\\[1em\\]{width:1em;height:1em}.size-full{width:100%;height:100%}.h-1{height:calc(var(--spacing)*1)}.h-2{height:calc(var(--spacing)*2)}.h-4{height:calc(var(--spacing)*4)}.h-5{height:calc(var(--spacing)*5)}.h-6{height:calc(var(--spacing)*6)}.h-8{height:calc(var(--spacing)*8)}.h-10{height:calc(var(--spacing)*10)}.h-12{height:calc(var(--spacing)*12)}.h-14{height:calc(var(--spacing)*14)}.h-16{height:calc(var(--spacing)*16)}.h-20{height:calc(var(--spacing)*20)}.h-24{height:calc(var(--spacing)*24)}.h-32{height:calc(var(--spacing)*32)}.h-36{height:calc(var(--spacing)*36)}.h-40{height:calc(var(--spacing)*40)}.h-42{height:calc(var(--spacing)*42)}.h-48{height:calc(var(--spacing)*48)}.h-52{height:calc(var(--spacing)*52)}.h-56{height:calc(var(--spacing)*56)}.h-64{height:calc(var(--spacing)*64)}.h-80{height:calc(var(--spacing)*80)}.h-96{height:calc(var(--spacing)*96)}.h-\\[1em\\]{height:1em}.h-\\[3\\.5rem\\]{height:3.5rem}.h-\\[320px\\]{height:320px}.h-\\[375px\\]{height:375px}.h-\\[414px\\]{height:414px}.h-\\[568px\\]{height:568px}.h-\\[667px\\]{height:667px}.h-\\[736px\\]{height:736px}.h-\\[812px\\]{height:812px}.h-\\[896px\\]{height:896px}.h-\\[1024px\\]{height:1024px}.h-auto{height:auto}.h-fit{height:fit-content}.h-full{height:100%}.h-px{height:1px}.max-h-96{max-height:calc(var(--spacing)*96)}.max-h-128{max-height:calc(var(--spacing)*128)}.max-h-\\[80vh\\]{max-height:80vh}.min-h-12{min-height:calc(var(--spacing)*12)}.min-h-\\[20rem\\]{min-height:20rem}.min-h-\\[30rem\\]{min-height:30rem}.min-h-full{min-height:100%}.min-h-screen{min-height:100vh}.w-1\\/2{width:50%}.w-2{width:calc(var(--spacing)*2)}.w-3\\/4{width:75%}.w-4{width:calc(var(--spacing)*4)}.w-5{width:calc(var(--spacing)*5)}.w-6{width:calc(var(--spacing)*6)}.w-8{width:calc(var(--spacing)*8)}.w-10{width:calc(var(--spacing)*10)}.w-11\\/12{width:91.6667%}.w-12{width:calc(var(--spacing)*12)}.w-16{width:calc(var(--spacing)*16)}.w-20{width:calc(var(--spacing)*20)}.w-24{width:calc(var(--spacing)*24)}.w-28{width:calc(var(--spacing)*28)}.w-32{width:calc(var(--spacing)*32)}.w-36{width:calc(var(--spacing)*36)}.w-40{width:calc(var(--spacing)*40)}.w-48{width:calc(var(--spacing)*48)}.w-52{width:calc(var(--spacing)*52)}.w-56{width:calc(var(--spacing)*56)}.w-60{width:calc(var(--spacing)*60)}.w-64{width:calc(var(--spacing)*64)}.w-80{width:calc(var(--spacing)*80)}.w-96{width:calc(var(--spacing)*96)}.w-\\[5\\.3rem\\]{width:5.3rem}.w-\\[5\\.8rem\\]{width:5.8rem}.w-\\[120px\\]{width:120px}.w-\\[320px\\]{width:320px}.w-\\[375px\\]{width:375px}.w-\\[414px\\]{width:414px}.w-\\[568px\\]{width:568px}.w-\\[667px\\]{width:667px}.w-\\[736px\\]{width:736px}.w-\\[812px\\]{width:812px}.w-\\[896px\\]{width:896px}.w-\\[1024px\\]{width:1024px}.w-full{width:100%}.w-lg{width:var(--container-lg)}.w-px{width:1px}.w-xs{width:var(--container-xs)}.max-w-2xl{max-width:var(--container-2xl)}.max-w-3xl{max-width:var(--container-3xl)}.max-w-5xl{max-width:var(--container-5xl)}.max-w-60{max-width:calc(var(--spacing)*60)}.max-w-lg{max-width:var(--container-lg)}.max-w-md{max-width:var(--container-md)}.max-w-none{max-width:none}.max-w-sm{max-width:var(--container-sm)}.max-w-xl{max-width:var(--container-xl)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-max{min-width:max-content}.flex-1{flex:1}.flex-none{flex:none}.flex-shrink,.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.translate-x-2{--tw-translate-x:calc(var(--spacing)*2);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-2{--tw-translate-y:calc(var(--spacing)*2);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-26{--tw-translate-y:calc(var(--spacing)*26);translate:var(--tw-translate-x)var(--tw-translate-y)}.scale-400{--tw-scale-x:400%;--tw-scale-y:400%;--tw-scale-z:400%;scale:var(--tw-scale-x)var(--tw-scale-y)}.-rotate-10{rotate:-10deg}.\\[transform\\:scaleY\\(\\.3\\)\\]{transform:scaleY(.3)}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.animate-bounce{animation:var(--animate-bounce)}.animate-ping{animation:var(--animate-ping)}.cursor-pointer{cursor:pointer}.list-inside{list-style-position:inside}.list-disc{list-style-type:disc}.appearance-none{appearance:none}.auto-cols-max{grid-auto-columns:max-content}.grid-flow-col{grid-auto-flow:column}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-rows-2{grid-template-rows:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.place-content-center{place-content:center}.place-items-center{place-items:center}.items-center{align-items:center}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-start{justify-content:flex-start}.gap-0\\.5{gap:calc(var(--spacing)*.5)}.gap-1{gap:calc(var(--spacing)*1)}.gap-2{gap:calc(var(--spacing)*2)}.gap-3{gap:calc(var(--spacing)*3)}.gap-4{gap:calc(var(--spacing)*4)}.gap-5{gap:calc(var(--spacing)*5)}.gap-6{gap:calc(var(--spacing)*6)}.gap-10{gap:calc(var(--spacing)*10)}.gap-12{gap:calc(var(--spacing)*12)}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*2)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*2)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*3)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*3)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*4)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*6)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*6)*calc(1 - var(--tw-space-y-reverse)))}.gap-x-1{column-gap:calc(var(--spacing)*1)}:where(.-space-x-6>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing)*-6)*var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing)*-6)*calc(1 - var(--tw-space-x-reverse)))}:where(.space-x-4>:not(:last-child)){--tw-space-x-reverse:0;margin-inline-start:calc(calc(var(--spacing)*4)*var(--tw-space-x-reverse));margin-inline-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-x-reverse)))}.gap-y-2{row-gap:calc(var(--spacing)*2)}:where(.divide-primary>:not(:last-child)){border-color:var(--color-primary)}.place-self-start{place-self:start}.justify-self-start{justify-self:flex-start}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-box{border-radius:var(--radius-box)}.rounded-field{border-radius:var(--radius-field)}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-none{border-radius:0}.rounded-selector{border-radius:var(--radius-selector)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.rounded-e-lg{border-start-end-radius:var(--radius-lg);border-end-end-radius:var(--radius-lg)}.rounded-se-box{border-start-end-radius:var(--radius-box)}.rounded-t-none{border-top-left-radius:0;border-top-right-radius:0}.rounded-l-full{border-top-left-radius:3.40282e38px;border-bottom-left-radius:3.40282e38px}.rounded-r-full{border-top-right-radius:3.40282e38px;border-bottom-right-radius:3.40282e38px}.rounded-r-none{border-top-right-radius:0;border-bottom-right-radius:0}.rounded-b-box{border-bottom-right-radius:var(--radius-box);border-bottom-left-radius:var(--radius-box)}.rounded-b-lg{border-bottom-right-radius:var(--radius-lg);border-bottom-left-radius:var(--radius-lg)}.border{border-style:var(--tw-border-style);border-width:1px}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-4{border-style:var(--tw-border-style);border-width:4px}.border-\\[length\\:var\\(--border\\)\\]{border-style:var(--tw-border-style);border-width:var(--border)}.border-s{border-inline-start-style:var(--tw-border-style);border-inline-start-width:1px}.border-s-0{border-inline-start-style:var(--tw-border-style);border-inline-start-width:0}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-t-0{border-top-style:var(--tw-border-style);border-top-width:0}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}@layer daisyui.l1{.alert-dash{color:var(--alert-color);box-shadow:none;background-color:#0000;background-image:none;border-style:dashed}.btn-dash:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn),:disabled,[disabled],.btn-disabled){--btn-shadow:"";--btn-bg:#0000;--btn-fg:var(--btn-color);--btn-border:var(--btn-color);--btn-noise:none}@media(hover:none){.btn-dash:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-shadow:"";--btn-bg:#0000;--btn-fg:var(--btn-color);--btn-border:var(--btn-color);--btn-noise:none}}.alert-outline{color:var(--alert-color);box-shadow:none;background-color:#0000;background-image:none}.alert-soft{color:var(--alert-color,var(--color-base-content));background:var(--alert-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.alert-soft{background:color-mix(in oklab,var(--alert-color,var(--color-base-content))8%,var(--color-base-100))}}.alert-soft{--alert-border-color:var(--alert-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.alert-soft{--alert-border-color:color-mix(in oklab,var(--alert-color,var(--color-base-content))10%,var(--color-base-100))}}.alert-soft{box-shadow:none;background-image:none}.btn-link{--btn-border:#0000;--btn-bg:#0000;--btn-noise:none;--btn-shadow:"";outline-color:currentColor;text-decoration-line:underline}.btn-link:not(.btn-disabled,.btn:disabled,.btn[disabled]){--btn-fg:var(--btn-color,var(--color-primary))}.btn-link:is(.btn-active,:hover,:active:focus,:focus-visible){--btn-border:#0000;--btn-bg:#0000}.btn-ghost:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn)){--btn-shadow:"";--btn-bg:#0000;--btn-border:#0000;--btn-noise:none}.btn-ghost:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn)):not(:disabled,[disabled],.btn-disabled){--btn-fg:var(--btn-color,currentColor);outline-color:currentColor}@media(hover:none){.btn-ghost:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-shadow:"";--btn-bg:#0000;--btn-fg:var(--btn-color,currentColor);--btn-border:#0000;--btn-noise:none;outline-color:currentColor}}.btn-outline:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn),:disabled,[disabled],.btn-disabled){--btn-shadow:"";--btn-bg:#0000;--btn-fg:var(--btn-color);--btn-border:var(--btn-color);--btn-noise:none}@media(hover:none){.btn-outline:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-shadow:"";--btn-bg:#0000;--btn-fg:var(--btn-color);--btn-border:var(--btn-color);--btn-noise:none}}.btn-soft:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn),:disabled,[disabled],.btn-disabled){--btn-shadow:"";--btn-fg:var(--btn-color,var(--color-base-content));--btn-bg:var(--btn-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.btn-soft:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn),:disabled,[disabled],.btn-disabled){--btn-bg:color-mix(in oklab,var(--btn-color,var(--color-base-content))8%,var(--color-base-100))}}.btn-soft:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn),:disabled,[disabled],.btn-disabled){--btn-border:var(--btn-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.btn-soft:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn),:disabled,[disabled],.btn-disabled){--btn-border:color-mix(in oklab,var(--btn-color,var(--color-base-content))10%,var(--color-base-100))}}.btn-soft:not(.btn-active,:hover,:active:focus,:focus-visible,input:checked:not(.filter .btn),:disabled,[disabled],.btn-disabled){--btn-noise:none}@media(hover:none){.btn-soft:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-shadow:"";--btn-fg:var(--btn-color,var(--color-base-content));--btn-bg:var(--btn-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.btn-soft:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-bg:color-mix(in oklab,var(--btn-color,var(--color-base-content))8%,var(--color-base-100))}}.btn-soft:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-border:var(--btn-color,var(--color-base-content))}@supports (color:color-mix(in lab,red,red)){.btn-soft:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-border:color-mix(in oklab,var(--btn-color,var(--color-base-content))10%,var(--color-base-100))}}.btn-soft:not(.btn-active,:active,:focus-visible,input:checked:not(.filter .btn)):hover{--btn-noise:none}}}.btn-dash{border-style:dashed}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-none{--tw-border-style:none;border-style:none}.border-\\[\\#00b544\\]{border-color:#00b544}.border-\\[\\#4eaa0c\\]{border-color:#4eaa0c}.border-\\[\\#005fd8\\]{border-color:#005fd8}.border-\\[\\#0059b3\\]{border-color:#0059b3}.border-\\[\\#35567b\\]{border-color:#35567b}.border-\\[\\#591660\\]{border-color:#591660}.border-\\[\\#e5e5e5\\]{border-color:#e5e5e5}.border-\\[\\#e17d00\\]{border-color:#e17d00}.border-\\[\\#f1d800\\]{border-color:#f1d800}.border-\\[\\#ff8938\\]{border-color:#ff8938}.border-base-300{border-color:var(--color-base-300)}.border-base-content,.border-base-content\\/5{border-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.border-base-content\\/5{border-color:color-mix(in oklab,var(--color-base-content)5%,transparent)}}.border-base-content\\/10{border-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.border-base-content\\/10{border-color:color-mix(in oklab,var(--color-base-content)10%,transparent)}}.border-base-content\\/20{border-color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.border-base-content\\/20{border-color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.border-black{border-color:var(--color-black)}.border-blue-300{border-color:var(--color-blue-300)}.border-blue-700{border-color:var(--color-blue-700)}.border-gray-200{border-color:var(--color-gray-200)}.border-indigo-600{border-color:var(--color-indigo-600)}.border-primary{border-color:var(--color-primary)}.border-primary-content\\/10{border-color:var(--color-primary-content)}@supports (color:color-mix(in lab,red,red)){.border-primary-content\\/10{border-color:color-mix(in oklab,var(--color-primary-content)10%,transparent)}}.border-red-300{border-color:var(--color-red-300)}.border-secondary{border-color:var(--color-secondary)}.border-sky-400{border-color:var(--color-sky-400)}.border-white\\/5{border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.border-white\\/5{border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.border-zinc-200{border-color:var(--color-zinc-200)}.glass{-webkit-backdrop-filter:blur(var(--glass-blur,40px));backdrop-filter:blur(var(--glass-blur,40px));background-color:#0000;background-image:linear-gradient(135deg,oklch(100% 0 0/var(--glass-opacity,30%)),#0000),linear-gradient(var(--glass-reflect-degree,100deg),oklch(100% 0 0/var(--glass-reflect-opacity,5%))25%,oklch(0% 0 0/0) 25%);box-shadow:0 0 0 1px oklch(100% 0 0/var(--glass-border-opacity,20%)) inset,0 0 0 2px #0000000d;text-shadow:0 1px oklch(0% 0 0/var(--glass-text-shadow-opacity,5%));border:none}.bg-\\[\\#1A77F2\\]{background-color:#1a77f2}.bg-\\[\\#2F2F2F\\]{background-color:#2f2f2f}.bg-\\[\\#03C755\\]{background-color:#03c755}.bg-\\[\\#5EBB2B\\]{background-color:#5ebb2b}.bg-\\[\\#0967C2\\]{background-color:#0967c2}.bg-\\[\\#47698F\\]{background-color:#47698f}.bg-\\[\\#622069\\]{background-color:#622069}.bg-\\[\\#FEE502\\]{background-color:#fee502}.bg-\\[\\#FF9900\\]{background-color:#f90}.bg-accent{background-color:var(--color-accent)}.bg-accent-content{background-color:var(--color-accent-content)}.bg-amber-300{background-color:var(--color-amber-300)}.bg-base-100{background-color:var(--color-base-100)}.bg-base-200{background-color:var(--color-base-200)}.bg-base-300{background-color:var(--color-base-300)}.bg-base-content{background-color:var(--color-base-content)}.bg-black{background-color:var(--color-black)}.bg-blue-100{background-color:var(--color-blue-100)}.bg-blue-600{background-color:var(--color-blue-600)}.bg-blue-700{background-color:var(--color-blue-700)}.bg-error{background-color:var(--color-error)}.bg-error-content{background-color:var(--color-error-content)}.bg-error\\/10{background-color:var(--color-error)}@supports (color:color-mix(in lab,red,red)){.bg-error\\/10{background-color:color-mix(in oklab,var(--color-error)10%,transparent)}}.bg-gray-800{background-color:var(--color-gray-800)}.bg-green-400{background-color:var(--color-green-400)}.bg-green-500{background-color:var(--color-green-500)}.bg-indigo-500{background-color:var(--color-indigo-500)}.bg-info{background-color:var(--color-info)}.bg-info-content{background-color:var(--color-info-content)}.bg-lime-400{background-color:var(--color-lime-400)}.bg-neutral{background-color:var(--color-neutral)}.bg-neutral-900{background-color:var(--color-neutral-900)}.bg-neutral-content{background-color:var(--color-neutral-content)}.bg-orange-400{background-color:var(--color-orange-400)}.bg-orange-600{background-color:var(--color-orange-600)}.bg-primary{background-color:var(--color-primary)}.bg-primary-content{background-color:var(--color-primary-content)}.bg-primary\\/50{background-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/50{background-color:color-mix(in oklab,var(--color-primary)50%,transparent)}}.bg-red-100{background-color:var(--color-red-100)}.bg-red-400{background-color:var(--color-red-400)}.bg-secondary{background-color:var(--color-secondary)}.bg-secondary-content{background-color:var(--color-secondary-content)}.bg-success{background-color:var(--color-success)}.bg-success-content{background-color:var(--color-success-content)}.bg-success\\/10{background-color:var(--color-success)}@supports (color:color-mix(in lab,red,red)){.bg-success\\/10{background-color:color-mix(in oklab,var(--color-success)10%,transparent)}}.bg-warning{background-color:var(--color-warning)}.bg-warning-content{background-color:var(--color-warning-content)}.bg-white{background-color:var(--color-white)}.bg-yellow-400{background-color:var(--color-yellow-400)}.bg-zinc-50{background-color:var(--color-zinc-50)}.bg-zinc-100{background-color:var(--color-zinc-100)}.from-primary{--tw-gradient-from:var(--color-primary);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.via-primary{--tw-gradient-via:var(--color-primary);--tw-gradient-via-stops:var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-via)var(--tw-gradient-via-position),var(--tw-gradient-to)var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-via-stops)}.to-primary{--tw-gradient-to:var(--color-primary);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.mask-circle{--tw-mask-radial-shape:circle}.fill-current{fill:currentColor}.fill-primary{fill:var(--color-primary)}.stroke-current{stroke:currentColor}.stroke-info{stroke:var(--color-info)}.stroke-primary{stroke:var(--color-primary)}.object-cover{object-fit:cover}.p-0{padding:calc(var(--spacing)*0)}.p-1{padding:calc(var(--spacing)*1)}.p-2{padding:calc(var(--spacing)*2)}.p-4{padding:calc(var(--spacing)*4)}.p-6{padding:calc(var(--spacing)*6)}.p-10{padding:calc(var(--spacing)*10)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-2\\.5{padding-inline:calc(var(--spacing)*2.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-6{padding-inline:calc(var(--spacing)*6)}.px-10{padding-inline:calc(var(--spacing)*10)}.px-12{padding-inline:calc(var(--spacing)*12)}.px-16{padding-inline:calc(var(--spacing)*16)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-3{padding-block:calc(var(--spacing)*3)}.py-4{padding-block:calc(var(--spacing)*4)}.py-6{padding-block:calc(var(--spacing)*6)}.py-8{padding-block:calc(var(--spacing)*8)}.py-10{padding-block:calc(var(--spacing)*10)}.ps-4{padding-inline-start:calc(var(--spacing)*4)}.ps-6{padding-inline-start:calc(var(--spacing)*6)}.pe-10{padding-inline-end:calc(var(--spacing)*10)}.pt-2{padding-top:calc(var(--spacing)*2)}.pt-4{padding-top:calc(var(--spacing)*4)}.pt-10{padding-top:calc(var(--spacing)*10)}.pt-12{padding-top:calc(var(--spacing)*12)}.pt-16{padding-top:calc(var(--spacing)*16)}.pt-32{padding-top:calc(var(--spacing)*32)}.pr-24{padding-right:calc(var(--spacing)*24)}.pb-2{padding-bottom:calc(var(--spacing)*2)}.pb-6{padding-bottom:calc(var(--spacing)*6)}.pb-8{padding-bottom:calc(var(--spacing)*8)}.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}.align-bottom{vertical-align:bottom}.font-mono{font-family:var(--font-mono)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-6xl{font-size:var(--text-6xl);line-height:var(--tw-leading,var(--text-6xl--line-height))}.text-9xl{font-size:var(--text-9xl);line-height:var(--tw-leading,var(--text-9xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.font-black{--tw-font-weight:var(--font-weight-black);font-weight:var(--font-weight-black)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.font-thin{--tw-font-weight:var(--font-weight-thin);font-weight:var(--font-weight-thin)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.tracking-wider{--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider)}.tracking-widest{--tw-tracking:var(--tracking-widest);letter-spacing:var(--tracking-widest)}.\\[text-wrap\\:balance\\]{text-wrap:balance}.break-all{word-break:break-all}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-wrap{white-space:pre-wrap}.text-\\[\\#181600\\]{color:#181600}.text-\\[color-mix\\(in_oklab\\,color-mix\\(in_oklab\\,white_40\\%\\,var\\(--color-neutral-content\\)\\)_20\\%\\,oklch\\(75\\%_0\\.3_173\\.24\\)\\)\\]{color:#fff}@supports (color:color-mix(in lab,red,red)){.text-\\[color-mix\\(in_oklab\\,color-mix\\(in_oklab\\,white_40\\%\\,var\\(--color-neutral-content\\)\\)_20\\%\\,oklch\\(75\\%_0\\.3_173\\.24\\)\\)\\]{color:color-mix(in oklab,color-mix(in oklab,white 40%,var(--color-neutral-content))20%,oklch(75% .3 173.24))}}.text-accent{color:var(--color-accent)}.text-accent-content{color:var(--color-accent-content)}.text-base-100{color:var(--color-base-100)}.text-base-content,.text-base-content\\/20{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.text-base-content\\/20{color:color-mix(in oklab,var(--color-base-content)20%,transparent)}}.text-base-content\\/30{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.text-base-content\\/30{color:color-mix(in oklab,var(--color-base-content)30%,transparent)}}.text-base-content\\/40{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.text-base-content\\/40{color:color-mix(in oklab,var(--color-base-content)40%,transparent)}}.text-base-content\\/50{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.text-base-content\\/50{color:color-mix(in oklab,var(--color-base-content)50%,transparent)}}.text-base-content\\/60{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.text-base-content\\/60{color:color-mix(in oklab,var(--color-base-content)60%,transparent)}}.text-base-content\\/70{color:var(--color-base-content)}@supports (color:color-mix(in lab,red,red)){.text-base-content\\/70{color:color-mix(in oklab,var(--color-base-content)70%,transparent)}}.text-black{color:var(--color-black)}.text-blue-200{color:var(--color-blue-200)}.text-blue-300{color:var(--color-blue-300)}.text-error{color:var(--color-error)}.text-info{color:var(--color-info)}.text-neutral{color:var(--color-neutral)}.text-neutral-content{color:var(--color-neutral-content)}.text-orange-400{color:var(--color-orange-400)}.text-primary{color:var(--color-primary)}.text-primary-content,.text-primary-content\\/50{color:var(--color-primary-content)}@supports (color:color-mix(in lab,red,red)){.text-primary-content\\/50{color:color-mix(in oklab,var(--color-primary-content)50%,transparent)}}.text-primary-content\\/60{color:var(--color-primary-content)}@supports (color:color-mix(in lab,red,red)){.text-primary-content\\/60{color:color-mix(in oklab,var(--color-primary-content)60%,transparent)}}.text-secondary{color:var(--color-secondary)}.text-secondary-content{color:var(--color-secondary-content)}.text-success{color:var(--color-success)}.text-warning{color:var(--color-warning)}.text-warning-content{color:var(--color-warning-content)}.text-white{color:var(--color-white)}.text-zinc-800{color:var(--color-zinc-800)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.uppercase{text-transform:uppercase}.italic{font-style:italic}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.line-through{text-decoration-line:line-through}.prose :where(.btn-link):not(:where([class~=not-prose],[class~=not-prose] *)){text-decoration-line:none}.underline{text-decoration-line:underline}.decoration-primary{-webkit-text-decoration-color:var(--color-primary);text-decoration-color:var(--color-primary)}.placeholder-primary::placeholder{color:var(--color-primary)}.caret-primary{caret-color:var(--color-primary)}.accent-primary{accent-color:var(--color-primary)}.opacity-5{opacity:.05}.opacity-30{opacity:.3}.opacity-40{opacity:.4}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.opacity-70{opacity:.7}.opacity-80{opacity:.8}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a),0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a),0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-2{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-primary{--tw-shadow-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.shadow-primary{--tw-shadow-color:color-mix(in oklab,var(--color-primary)var(--tw-shadow-alpha),transparent)}}.ring-primary{--tw-ring-color:var(--color-primary)}.ring-offset-2{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color)}.ring-offset-base-100{--tw-ring-offset-color:var(--color-base-100)}.ring-offset-primary{--tw-ring-offset-color:var(--color-primary)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.outline-black\\/5{outline-color:#0000000d}@supports (color:color-mix(in lab,red,red)){.outline-black\\/5{outline-color:color-mix(in oklab,var(--color-black)5%,transparent)}}.outline-primary{outline-color:var(--color-primary)}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.blur-lg{--tw-blur:blur(var(--blur-lg));filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.brightness-125{--tw-brightness:brightness(125%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.saturate-200{--tw-saturate:saturate(200%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.filter{filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-0{--tw-duration:0s;transition-duration:0s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.select-none{-webkit-user-select:none;user-select:none}.\\[--alert-color\\:blue\\]{--alert-color:blue}.\\[--range-bg\\:orange\\]{--range-bg:orange}.\\[--range-fill\\:0\\]{--range-fill:0}.\\[--range-thumb\\:blue\\]{--range-thumb:blue}.\\[--tab-bg\\:orange\\]{--tab-bg:orange}.\\[--tab-bg\\:var\\(--color-neutral\\)\\]{--tab-bg:var(--color-neutral)}.\\[--tab-border-color\\:red\\]{--tab-border-color:red}.\\[--tab-border-color\\:var\\(--color-neutral\\)\\]{--tab-border-color:var(--color-neutral)}.\\[--tglbg\\:var\\(--color-sky-500\\)\\]{--tglbg:var(--color-sky-500)}.\\[direction\\:ltr\\]{direction:ltr}.text-shadow-lg{text-shadow:0px 1px 2px var(--tw-text-shadow-color,#0000001a),0px 3px 2px var(--tw-text-shadow-color,#0000001a),0px 4px 8px var(--tw-text-shadow-color,#0000001a)}:is(.\\*\\:-ms-px>*){margin-inline-start:-1px}:is(.\\*\\:-mt-px>*){margin-top:-1px}:is(.\\*\\:grid>*){display:grid}:is(.\\*\\:place-content-center>*){place-content:center}:is(.\\*\\:bg-linear-80>*){--tw-gradient-position:80deg}@supports (background-image:linear-gradient(in lab,red,red)){:is(.\\*\\:bg-linear-80>*){--tw-gradient-position:80deg in oklab}}:is(.\\*\\:bg-linear-80>*){background-image:linear-gradient(var(--tw-gradient-stops))}:is(.\\*\\:from-white\\/10>*){--tw-gradient-from:#ffffff1a}@supports (color:color-mix(in lab,red,red)){:is(.\\*\\:from-white\\/10>*){--tw-gradient-from:color-mix(in oklab,var(--color-white)10%,transparent)}}:is(.\\*\\:from-white\\/10>*){--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}:is(.\\*\\:via-transparent>*){--tw-gradient-via:transparent;--tw-gradient-via-stops:var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-via)var(--tw-gradient-via-position),var(--tw-gradient-to)var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-via-stops)}:is(.\\*\\:to-black\\/10>*){--tw-gradient-to:#0000001a}@supports (color:color-mix(in lab,red,red)){:is(.\\*\\:to-black\\/10>*){--tw-gradient-to:color-mix(in oklab,var(--color-black)10%,transparent)}}:is(.\\*\\:to-black\\/10>*){--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}:is(.\\*\\:\\[grid-area\\:1\\/1\\]>*){grid-area:1/1}@media(hover:hover){.group-hover\\:scale-110:is(:where(.group):hover *){--tw-scale-x:110%;--tw-scale-y:110%;--tw-scale-z:110%;scale:var(--tw-scale-x)var(--tw-scale-y)}.group-hover\\:\\[transform\\:scaleY\\(\\.4\\)\\]:is(:where(.group):hover *){transform:scaleY(.4)}.group-hover\\:text-base-content:is(:where(.group):hover *){color:var(--color-base-content)}.group-hover\\:opacity-0:is(:where(.group):hover *){opacity:0}.group-hover\\:opacity-30:is(:where(.group):hover *){opacity:.3}.group-hover\\:duration-800:is(:where(.group):hover *){--tw-duration:.8s;transition-duration:.8s}}.peer-checked\\:bg-secondary:is(:where(.peer):checked~*){background-color:var(--color-secondary)}.peer-checked\\:text-secondary-content:is(:where(.peer):checked~*){color:var(--color-secondary-content)}.checked\\:border-blue-600:checked{border-color:var(--color-blue-600)}.checked\\:border-blue-800:checked{border-color:var(--color-blue-800)}.checked\\:border-orange-500:checked{border-color:var(--color-orange-500)}.checked\\:border-red-600:checked{border-color:var(--color-red-600)}.checked\\:border-yellow-400:checked{border-color:var(--color-yellow-400)}.checked\\:bg-blue-200:checked{background-color:var(--color-blue-200)}.checked\\:bg-blue-300:checked{background-color:var(--color-blue-300)}.checked\\:bg-orange-400:checked{background-color:var(--color-orange-400)}.checked\\:bg-red-200:checked{background-color:var(--color-red-200)}.checked\\:bg-yellow-100:checked{background-color:var(--color-yellow-100)}.checked\\:text-blue-600:checked{color:var(--color-blue-600)}.checked\\:text-neutral-content\\!:checked{color:var(--color-neutral-content)!important}.checked\\:text-orange-800:checked{color:var(--color-orange-800)}.checked\\:text-red-600:checked{color:var(--color-red-600)}.checked\\:text-yellow-600:checked{color:var(--color-yellow-600)}.checked\\:\\[--tglbg\\:var\\(--color-blue-900\\)\\]:checked{--tglbg:var(--color-blue-900)}@media(hover:hover){.hover\\:-translate-y-1:hover{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.hover\\:bg-base-300:hover{background-color:var(--color-base-300)}.hover\\:bg-gray-900:hover{background-color:var(--color-gray-900)}.hover\\:text-primary:hover{color:var(--color-primary)}.hover\\:text-secondary:hover{color:var(--color-secondary)}.hover\\:underline:hover{text-decoration-line:underline}@layer daisyui.l1.l2{.hover\\:swap-active:hover .swap-off{opacity:0}.hover\\:swap-active:hover .swap-on{opacity:1}}.hover\\:opacity-80:hover{opacity:.8}.hover\\:opacity-100:hover{opacity:1}.hover\\:shadow-md:hover{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a),0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}.focus\\:-translate-y-0\\.5:focus{--tw-translate-y:calc(var(--spacing)*-.5);translate:var(--tw-translate-x)var(--tw-translate-y)}.focus\\:bg-secondary:focus{background-color:var(--color-secondary)}.focus\\:text-secondary-content:focus{color:var(--color-secondary-content)}.focus\\:shadow-sm:focus{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}@media not all and (min-width:64rem){.max-lg\\:z-1002{z-index:1002}}@media not all and (min-width:48rem){@layer daisyui.l1.l2{.max-md\\:timeline-compact{--timeline-row-start:0}.max-md\\:timeline-compact .timeline-start{grid-area:3/1/4/4;place-self:flex-start center}.max-md\\:timeline-compact li:has(.timeline-start) .timeline-end{grid-row-start:auto;grid-column-start:none}.max-md\\:timeline-compact.timeline-vertical>li{--timeline-col-start:0}.max-md\\:timeline-compact.timeline-vertical .timeline-start{grid-area:1/3/4/4;place-self:center flex-start}.max-md\\:timeline-compact.timeline-vertical li:has(.timeline-start) .timeline-end{grid-row-start:none;grid-column-start:auto}}}@media not all and (min-width:40rem){@layer daisyui.l1.l2{.max-sm\\:tabs-sm{--tab-height:calc(var(--size-field,.25rem)*8)}.max-sm\\:tabs-sm>.tab{--tab-p:.5rem;--tab-radius-min:calc(.5rem - var(--border));font-size:.875rem}}}@media(min-width:40rem){@layer daisyui.l1.l2{.sm\\:modal-middle{place-items:center}.sm\\:modal-middle .modal-box{--modal-tl:var(--radius-box);--modal-tr:var(--radius-box);--modal-bl:var(--radius-box);--modal-br:var(--radius-box);width:91.6667%;max-width:32rem;height:auto;max-height:calc(100vh - 5em);translate:0 2%;scale:98%}.sm\\:alert-horizontal{text-align:start;grid-template-columns:auto;grid-auto-flow:column;justify-content:start;justify-items:start}.sm\\:alert-horizontal:has(:nth-child(2)){grid-template-columns:auto minmax(auto,1fr)}.sm\\:footer-horizontal{grid-auto-flow:column}.sm\\:footer-horizontal.footer-center{grid-auto-flow:dense}.sm\\:tabs-md{--tab-height:calc(var(--size-field,.25rem)*10)}.sm\\:tabs-md>.tab{--tab-p:.75rem;--tab-radius-min:calc(.75rem - var(--border));font-size:.875rem}.sm\\:btn-sm{--fontsize:.75rem;--btn-p:.75rem;--size:calc(var(--size-field,.25rem)*8)}.sm\\:indicator-middle{--indicator-t:50%;--indicator-b:50%;--indicator-y:-50%}}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}}@media(min-width:48rem){.md\\:join-horizontal{flex-direction:row}.md\\:join-horizontal>.join-item:first-child,.md\\:join-horizontal :first-child:not(:last-child) .join-item{--join-ss:var(--radius-field);--join-se:0;--join-es:var(--radius-field);--join-ee:0}.md\\:join-horizontal>.join-item:last-child,.md\\:join-horizontal :last-child:not(:first-child) .join-item{--join-ss:0;--join-se:var(--radius-field);--join-es:0;--join-ee:var(--radius-field)}.md\\:join-horizontal>.join-item:only-child,.md\\:join-horizontal :only-child .join-item{--join-ss:var(--radius-field);--join-se:var(--radius-field);--join-es:var(--radius-field);--join-ee:var(--radius-field)}.md\\:join-horizontal .join-item:where(:not(:first-child)){margin-block-start:0;margin-inline-start:calc(var(--border,1px)*-1)}.md\\:mb-10{margin-bottom:calc(var(--spacing)*10)}.md\\:w-52{width:calc(var(--spacing)*52)}.md\\:w-80{width:calc(var(--spacing)*80)}.md\\:w-auto{width:auto}@layer daisyui.l1.l2{.md\\:footer-horizontal{grid-auto-flow:column}.md\\:footer-horizontal.footer-center{grid-auto-flow:dense}.md\\:btn-md{--fontsize:.875rem;--btn-p:1rem;--size:calc(var(--size-field,.25rem)*10)}.md\\:indicator-bottom{--indicator-t:auto;--indicator-b:0;--indicator-y:50%}}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:place-self-center{place-self:center}.md\\:justify-self-end{justify-self:flex-end}.md\\:text-end{text-align:end}}@media(min-width:64rem){@layer daisyui.l1.l2.l3{.lg\\:drawer-open>.drawer-toggle:checked~.drawer-side{scrollbar-color:revert-layer}:root:has(.lg\\:drawer-open>.drawer-toggle:checked){--page-overflow:revert-layer;--page-scroll-gutter:revert-layer;--page-scroll-bg:revert-layer;--page-scroll-transition:revert-layer;--page-has-backdrop:revert-layer;animation:revert-layer;animation-timeline:revert-layer}.lg\\:tooltip{--tt-bg:var(--color-neutral);--tt-off: calc(100% + .5rem) ;--tt-tail: calc(100% + 1px + .25rem) ;display:inline-block;position:relative}.lg\\:tooltip>.tooltip-content,.lg\\:tooltip[data-tip]:before{border-radius:var(--radius-field);text-align:center;white-space:normal;max-width:20rem;color:var(--color-neutral-content);opacity:0;background-color:var(--tt-bg);pointer-events:none;z-index:2;--tw-content:attr(data-tip);content:var(--tw-content);width:max-content;padding-block:.25rem;padding-inline:.5rem;font-size:.875rem;line-height:1.25;position:absolute}.lg\\:tooltip:after{opacity:0;background-color:var(--tt-bg);content:"";pointer-events:none;--mask-tooltip:url("data:image/svg+xml,%3Csvg width='10' height='4' viewBox='0 0 8 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.500009 1C3.5 1 3.00001 4 5.00001 4C7 4 6.5 1 9.5 1C10 1 10 0.499897 10 0H0C-1.99338e-08 0.5 0 1 0.500009 1Z' fill='black'/%3E%3C/svg%3E%0A");width:.625rem;height:.25rem;-webkit-mask-position:-1px 0;mask-position:-1px 0;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-image:var(--mask-tooltip);mask-image:var(--mask-tooltip);display:block;position:absolute}@media(prefers-reduced-motion:no-preference){.lg\\:tooltip>.tooltip-content,.lg\\:tooltip[data-tip]:before,.lg\\:tooltip:after{transition:opacity .2s cubic-bezier(.4,0,.2,1) 75ms,transform .2s cubic-bezier(.4,0,.2,1) 75ms}}:is(.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))>.tooltip-content,:is(.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))[data-tip]:before,:is(.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible)):after{opacity:1;--tt-pos:0rem}@media(prefers-reduced-motion:no-preference){:is(.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))>.tooltip-content,:is(.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible))[data-tip]:before,:is(.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))).tooltip-open,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):hover,.lg\\:tooltip:is([data-tip]:not([data-tip=""]),:has(.tooltip-content:not(:empty))):has(:focus-visible)):after{transition:opacity .2s cubic-bezier(.4,0,.2,1),transform .2s cubic-bezier(.4,0,.2,1)}}}@layer daisyui.l1.l2{.lg\\:drawer-open>.drawer-side{overflow-y:auto}.lg\\:drawer-open>.drawer-toggle{display:none}.lg\\:drawer-open>.drawer-toggle~.drawer-side{pointer-events:auto;visibility:visible;overscroll-behavior:auto;opacity:1;width:auto;display:block;position:sticky}.lg\\:drawer-open>.drawer-toggle~.drawer-side>.drawer-overlay{cursor:default;background-color:#0000}.lg\\:drawer-open>.drawer-toggle~.drawer-side>:not(.drawer-overlay),[dir=rtl] :is(.lg\\:drawer-open>.drawer-toggle~.drawer-side>:not(.drawer-overlay)){translate:0%}.lg\\:drawer-open>.drawer-toggle:checked~.drawer-side{pointer-events:auto;visibility:visible}.lg\\:tooltip>.tooltip-content,.lg\\:tooltip[data-tip]:before{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-off)50%}.lg\\:tooltip:after{transform:translate(-50%)translateY(var(--tt-pos,.25rem));inset:auto auto var(--tt-tail)50%}.lg\\:menu-horizontal{flex-direction:row;display:inline-flex}.lg\\:menu-horizontal>li:not(.menu-title)>details>ul{transform-origin:top;border-radius:var(--radius-box);background-color:var(--color-base-100);opacity:0;margin-inline-start:0;margin-top:1rem;padding-block:.5rem;padding-inline-end:.5rem;position:absolute;scale:95%;box-shadow:0 1px 3px #0000001a,0 1px 2px -1px #0000001a}@media(prefers-reduced-motion:no-preference){@starting-style{.lg\\:menu-horizontal>li:not(.menu-title)>details>ul{opacity:0;scale:95%}}.lg\\:menu-horizontal>li:not(.menu-title)>details>ul{transition-behavior:allow-discrete;transition-property:opacity,scale,display;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);animation:.2s menu}}.lg\\:menu-horizontal>li:not(.menu-title)>details[open]>ul{opacity:1;scale:100%}.lg\\:menu-horizontal>li>details>ul:before{--tw-content:none;content:var(--tw-content)}.lg\\:timeline-horizontal{flex-direction:row}.lg\\:timeline-horizontal>li{align-items:center}.lg\\:timeline-horizontal>li>hr{width:100%;height:.25rem}.lg\\:timeline-horizontal>li>hr:first-child{grid-row-start:2;grid-column-start:1}.lg\\:timeline-horizontal>li>hr:last-child{grid-area:2/3/auto/none}.lg\\:timeline-horizontal .timeline-start{grid-area:1/1/2/4;place-self:flex-end center}.lg\\:timeline-horizontal .timeline-end{grid-area:3/1/4/4;place-self:flex-start center}.lg\\:timeline-horizontal:has(.timeline-middle)>li>hr:first-child{border-start-start-radius:0;border-start-end-radius:var(--radius-selector);border-end-end-radius:var(--radius-selector);border-end-start-radius:0}.lg\\:timeline-horizontal:has(.timeline-middle)>li>hr:last-child,.lg\\:timeline-horizontal:not(:has(.timeline-middle)) :first-child>hr:last-child{border-start-start-radius:var(--radius-selector);border-start-end-radius:0;border-end-end-radius:0;border-end-start-radius:var(--radius-selector)}.lg\\:timeline-horizontal:not(:has(.timeline-middle)) :last-child>hr:first-child{border-start-start-radius:0;border-start-end-radius:var(--radius-selector);border-end-end-radius:var(--radius-selector);border-end-start-radius:0}.lg\\:steps-horizontal{grid-auto-columns:1fr;grid-auto-flow:column;display:inline-grid;overflow:auto hidden}.lg\\:steps-horizontal .step{text-align:center;grid-template-rows:40px 1fr;grid-template-columns:auto;place-items:center;min-width:4rem;display:grid}.lg\\:steps-horizontal .step:before{width:100%;height:.5rem;margin-inline-start:-100%;translate:0}[dir=rtl] :is(.lg\\:steps-horizontal .step):before{translate:0}.lg\\:card-side{flex-direction:row;align-items:stretch}.lg\\:card-side :where(figure:first-child){border-start-start-radius:inherit;border-start-end-radius:unset;border-end-end-radius:unset;border-end-start-radius:inherit;overflow:hidden}.lg\\:card-side :where(figure:last-child){border-start-start-radius:unset;border-start-end-radius:inherit;border-end-end-radius:inherit;border-end-start-radius:unset;overflow:hidden}.lg\\:card-side figure>*{max-width:unset}.lg\\:card-side :where(figure>*){object-fit:cover;width:100%;height:100%}.lg\\:divider-horizontal{--divider-m:0 1rem}.lg\\:divider-horizontal.divider{flex-direction:column;width:1rem;height:auto}.lg\\:divider-horizontal.divider:before,.lg\\:divider-horizontal.divider:after{width:.125rem;height:100%}.lg\\:stats-horizontal{grid-auto-flow:column;overflow-x:auto}.lg\\:stats-horizontal .stat:not(:last-child){border-inline-end:var(--border)dashed currentColor}@supports (color:color-mix(in lab,red,red)){.lg\\:stats-horizontal .stat:not(:last-child){border-inline-end:var(--border)dashed color-mix(in oklab,currentColor 10%,#0000)}}.lg\\:stats-horizontal .stat:not(:last-child){border-block-end:none}.lg\\:indicator-center{--indicator-s:50%;--indicator-e:50%;--indicator-x:-50%}[dir=rtl] .lg\\:indicator-center{--indicator-x:50%}.lg\\:btn-lg{--fontsize:1.125rem;--btn-p:1.25rem;--size:calc(var(--size-field,.25rem)*12)}}.lg\\:mx-10{margin-inline:calc(var(--spacing)*10)}.lg\\:-my-6{margin-block:calc(var(--spacing)*-6)}.lg\\:join-horizontal{flex-direction:row}.lg\\:join-horizontal>.join-item:first-child,.lg\\:join-horizontal :first-child:not(:last-child) .join-item{--join-ss:var(--radius-field);--join-se:0;--join-es:var(--radius-field);--join-ee:0}.lg\\:join-horizontal>.join-item:last-child,.lg\\:join-horizontal :last-child:not(:first-child) .join-item{--join-ss:0;--join-se:var(--radius-field);--join-es:0;--join-ee:var(--radius-field)}.lg\\:join-horizontal>.join-item:only-child,.lg\\:join-horizontal :only-child .join-item{--join-ss:var(--radius-field);--join-se:var(--radius-field);--join-es:var(--radius-field);--join-ee:var(--radius-field)}.lg\\:join-horizontal .join-item:where(:not(:first-child)){margin-block-start:0;margin-inline-start:calc(var(--border,1px)*-1)}.lg\\:mb-10{margin-bottom:calc(var(--spacing)*10)}.lg\\:mb-64{margin-bottom:calc(var(--spacing)*64)}.lg\\:block{display:block}.lg\\:flex{display:flex}.lg\\:grid{display:grid}.lg\\:hidden{display:none}.lg\\:w-52{width:calc(var(--spacing)*52)}.lg\\:min-w-max{min-width:max-content}.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.lg\\:flex-row{flex-direction:row}.lg\\:flex-row-reverse{flex-direction:row-reverse}.lg\\:gap-10{gap:calc(var(--spacing)*10)}.lg\\:gap-x-6{column-gap:calc(var(--spacing)*6)}.lg\\:p-10{padding:calc(var(--spacing)*10)}.lg\\:py-16{padding-block:calc(var(--spacing)*16)}.lg\\:ps-6{padding-inline-start:calc(var(--spacing)*6)}.lg\\:pe-16{padding-inline-end:calc(var(--spacing)*16)}.lg\\:text-left{text-align:left}.lg\\:text-9xl{font-size:var(--text-9xl);line-height:var(--tw-leading,var(--text-9xl--line-height))}}@media(min-width:80rem){@layer daisyui.l1.l2{.xl\\:menu-horizontal{flex-direction:row;display:inline-flex}.xl\\:menu-horizontal>li:not(.menu-title)>details>ul{transform-origin:top;border-radius:var(--radius-box);background-color:var(--color-base-100);opacity:0;margin-inline-start:0;margin-top:1rem;padding-block:.5rem;padding-inline-end:.5rem;position:absolute;scale:95%;box-shadow:0 1px 3px #0000001a,0 1px 2px -1px #0000001a}@media(prefers-reduced-motion:no-preference){@starting-style{.xl\\:menu-horizontal>li:not(.menu-title)>details>ul{opacity:0;scale:95%}}.xl\\:menu-horizontal>li:not(.menu-title)>details>ul{transition-behavior:allow-discrete;transition-property:opacity,scale,display;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);animation:.2s menu}}.xl\\:menu-horizontal>li:not(.menu-title)>details[open]>ul{opacity:1;scale:100%}.xl\\:menu-horizontal>li>details>ul:before{--tw-content:none;content:var(--tw-content)}.xl\\:indicator-end{--indicator-s:auto;--indicator-e:0;--indicator-x:50%}[dir=rtl] .xl\\:indicator-end{--indicator-s:0;--indicator-e:auto;--indicator-x:-50%}.xl\\:btn-xl{--fontsize:1.375rem;--btn-p:1.5rem;--size:calc(var(--size-field,.25rem)*14)}}.xl\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(prefers-color-scheme:dark){.dark\\:p-10{padding:calc(var(--spacing)*10)}.dark\\:p-20{padding:calc(var(--spacing)*20)}}.\\[\\&_img\\]\\:size-16 img{width:calc(var(--spacing)*16);height:calc(var(--spacing)*16)}.\\[\\&_li\\>\\*\\]\\:rounded-none li>*{border-radius:0}.\\[\\&_svg\\]\\:visible svg{visibility:visible}.\\[\\&_svg\\]\\:size-16 svg{width:calc(var(--spacing)*16);height:calc(var(--spacing)*16)}}:host{font-family:Fira Code,monospace}@keyframes rating{0%,40%{filter:brightness(1.05)contrast(1.05);scale:1.1}}@keyframes dropdown{0%{opacity:0}}@keyframes radio{0%{padding:5px}50%{padding:3px}}@keyframes toast{0%{opacity:0;scale:.9}to{opacity:1;scale:1}}@keyframes rotator{89.9999%,to{--first-item-position:0 0%}90%,99.9999%{--first-item-position:0 calc(var(--items)*100%)}to{translate:0 -100%}}@keyframes skeleton{0%{background-position:150%}to{background-position:-50%}}@keyframes menu{0%{opacity:0}}@keyframes progress{50%{background-position-x:-115%}}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:"*";inherits:false}@property --tw-gradient-from{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:"*";inherits:false}@property --tw-gradient-via-stops{syntax:"*";inherits:false}@property --tw-gradient-from-position{syntax:"<length-percentage>";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:"<length-percentage>";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:"<length-percentage>";inherits:false;initial-value:100%}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-text-shadow-color{syntax:"*";inherits:false}@property --tw-text-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@keyframes ping{75%,to{opacity:0;transform:scale(2)}}@keyframes bounce{0%,to{animation-timing-function:cubic-bezier(.8,0,1,1);transform:translateY(-25%)}50%{animation-timing-function:cubic-bezier(0,0,.2,1);transform:none}}`;
  let mountPromise = null;
  let isMounted = false;
  async function mountApp() {
    if (isMounted) {
      return Promise.resolve();
    }
    if (mountPromise) {
      return mountPromise;
    }
    mountPromise = (async () => {
      if (isMounted) {
        return;
      }
      if (!document.getElementById("tubeinsights-font")) {
        const link = document.createElement("link");
        link.id = "tubeinsights-font";
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap";
        document.head.appendChild(link);
      }
      const savedTheme = await storage.get(
        "tubeinsights-theme",
        currentTheme.value
      );
      currentTheme.value = savedTheme;
      const savedPanelVisible = await storage.get(
        "tubeinsights-panelVisible",
        isPanelVisible.value.toString()
      );
      isPanelVisible.value = savedPanelVisible === "true";
      const savedTab = await storage.get("tubeinsights-activeTab", "insights");
      if (savedTab === "insights" || savedTab === "livecount" || savedTab === "bookmark" || savedTab === "ddl" || savedTab === "settings") {
        const { activeTab: activeTab2 } = await __vitePreload(async () => {
          const { activeTab: activeTab3 } = await Promise.resolve().then(() => index);
          return { activeTab: activeTab3 };
        }, void 0 );
        activeTab2.value = savedTab;
      }
      const rootId = "tubeinsights-root";
      const existingRoots = document.querySelectorAll(`#${rootId}`);
      if (existingRoots.length > 1) {
        existingRoots.forEach((el, index2) => {
          if (index2 > 0) {
            el.remove();
          }
        });
      }
      let root = document.getElementById(rootId);
      if (!root) {
        root = document.createElement("div");
        root.id = rootId;
        document.body.append(root);
      }
      let shadowRoot = root.shadowRoot;
      if (!shadowRoot) {
        shadowRoot = root.attachShadow({ mode: "open" });
        try {
          shadowRoot.adoptedStyleSheets = prepareStyles();
        } catch (e) {
          const styleElement = document.createElement("style");
          styleElement.textContent = styles.replace(/:root/gu, ":host");
          shadowRoot.appendChild(styleElement);
        }
      }
      if (!isMounted) {
        preact.render( u(App, {}), shadowRoot);
        isMounted = true;
        setTimeout(() => {
          initVideoModules();
        }, 500);
      }
    })();
    try {
      await mountPromise;
    } finally {
      mountPromise = null;
    }
  }
  function prepareStyles() {
    const shadowSheet = new CSSStyleSheet();
    shadowSheet.replaceSync(styles.replace(/:root/gu, ":host"));
    return [shadowSheet];
  }
  if (window.location.href.startsWith("https://www.youtube.com")) {
    const isLiveChat = window.location.pathname.startsWith("/live_chat");
    const isInIframe = window.self !== window.top;
    if (!isLiveChat && !isInIframe) {
      const initModulesEarly = async () => {
        const { moduleSettings: moduleSettings2 } = await __vitePreload(async () => {
          const { moduleSettings: moduleSettings3 } = await Promise.resolve().then(() => index);
          return { moduleSettings: moduleSettings3 };
        }, void 0 );
        const hideProgressBar = await storage.get(
          "module-hide-progress-bar",
          "false"
        );
        moduleSettings2.value = {
          ...moduleSettings2.value,
          hideProgressBar: hideProgressBar === "true"
        };
        if (hideProgressBar === "true") {
          document.body.classList.add("tubeinsights-hide-progress-bar");
        }
        if (!document.getElementById("tubeinsights-video-modules-style")) {
          const style = document.createElement("style");
          style.id = "tubeinsights-video-modules-style";
          style.textContent = `
          body.tubeinsights-hide-progress-bar ytd-thumbnail-overlay-resume-playback-renderer,
          body.tubeinsights-hide-progress-bar yt-thumbnail-overlay-progress-bar-view-model {
            display: none !important;
          }
        `;
          document.head.append(style);
        }
      };
      initModulesEarly();
      const scheduleMount = () => {
        if (!document.body) {
          requestAnimationFrame(scheduleMount);
          return;
        }
        requestAnimationFrame(() => {
          setTimeout(() => {
            void mountApp();
          }, 150);
        });
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", scheduleMount);
      } else {
        scheduleMount();
      }
    }
  }

})(preact, preactSignals, preactHooks, dayjs);