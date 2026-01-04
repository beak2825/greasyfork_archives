// ==UserScript==
// @name         lc-rating extension
// @namespace    https://github.com/Autumnal-Joy
// @version      1.0.0
// @author       AutJ
// @description  LC-Rating 扩展，为 LC-Rating 站点提供更多功能
// @license      MIT
// @copyright    Copyright (c) 2025-present AutJ and other contributors
// @homepage     https://github.com/Autumnal-Joy/lc-rating-extension
// @supportURL   https://github.com/Autumnal-Joy/lc-rating-extension/issues
// @match        https://huxulm.github.io/lc-rating/*
// @match        https://leetcode.cn/*
// @match        https://leetcode.com/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @connect      https://dav.jianguoyun.com/dav/
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531252/lc-rating%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/531252/lc-rating%20extension.meta.js
// ==/UserScript==

(function (require$$0, require$$0$1) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredReactJsxRuntime_production_min;
  function requireReactJsxRuntime_production_min() {
    if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
    hasRequiredReactJsxRuntime_production_min = 1;
    var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, g) {
      var b, d = {}, e = null, h = null;
      void 0 !== g && (e = "" + g);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (h = a.ref);
      for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
      return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
    }
    reactJsxRuntime_production_min.Fragment = l;
    reactJsxRuntime_production_min.jsx = q;
    reactJsxRuntime_production_min.jsxs = q;
    return reactJsxRuntime_production_min;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production_min();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  const LEETCODE_HOST = "leetcode.com";
  const LEETCODE_HOST_CN = "leetcode.cn";
  const LC_RATING_HOST = "huxulm.github.io";
  const EXTENSION_NAME = "lc-rating extension";
  const CROSS_TAB_PROGRESS_KEY = "progress";
  const LCRE_PING_EVENT = "lcre-ping-event";
  const LCRE_PONG_EVENT = "lcr-pong-event";
  const LCRE_PROGRESS_EVENT = "lcre-progress-event";
  class ClockTrigger {
    constructor(onTick, onTrigger, interval = 1e3) {
      __publicField(this, "timerId");
      __publicField(this, "isActive", false);
      __publicField(this, "trigger");
      __publicField(this, "on");
      __publicField(this, "off");
      this.onTick = onTick;
      this.onTrigger = onTrigger;
      this.interval = interval;
      this.trigger = () => {
        if (!this.isActive) return;
        this.isActive = false;
        this.stopTimer();
        this.onTrigger();
      };
      this.on = () => {
        if (this.isActive) return;
        this.isActive = true;
        this.startTimer();
      };
      this.off = () => {
        if (!this.isActive) return;
        this.isActive = false;
        this.stopTimer();
      };
    }
    startTimer() {
      this.timerId = window.setInterval(() => {
        this.onTick();
      }, this.interval);
    }
    stopTimer() {
      if (this.timerId) clearInterval(this.timerId);
    }
  }
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function wrap(fn2) {
    return (modName, ...args) => {
      const d = /* @__PURE__ */ new Date();
      const h = d.getHours().toString().padStart(2, "0");
      const m = d.getMinutes().toString().padStart(2, "0");
      const s = d.getSeconds().toString().padStart(2, "0");
      const ms = d.getMilliseconds().toString().padStart(3, "0");
      if (modName === void 0) {
        const parts = `%c[${EXTENSION_NAME}] [${h}:${m}:${s}::${ms}]`;
        fn2(parts, "color: #1b75d0", "", ...args);
      } else {
        const parts = `%c[${EXTENSION_NAME}] [${modName}] [${h}:${m}:${s}::${ms}]`;
        fn2(parts, "color: #1b75d0", "", ...args);
      }
    };
  }
  function check(w) {
    return w === _unsafeWindow && w.LCRE_DEBUG !== void 0;
  }
  class Logger {
    constructor(name, level) {
      __publicField(this, "name");
      __publicField(this, "logLevel");
      this.name = name;
      this.logLevel = level ?? 2;
    }
    setLevel(level) {
      this.logLevel = level;
    }
    logMessage(level, consoleFn, ...args) {
      if (check(_unsafeWindow) && _unsafeWindow.LCRE_DEBUG === false || this.logLevel < level) {
        return;
      }
      const wrapped = wrap(consoleFn);
      wrapped(this.name, ...args);
    }
    error(...args) {
      this.logMessage(0, console.error, ...args);
    }
    warn(...args) {
      this.logMessage(1, console.warn, ...args);
    }
    info(...args) {
      this.logMessage(2, console.info, ...args);
    }
    log(...args) {
      this.logMessage(2, console.log, ...args);
    }
    dir(...args) {
      this.logMessage(2, console.dir, ...args);
    }
    trace(...args) {
      this.logMessage(2, console.trace, ...args);
    }
    debug(...args) {
      this.logMessage(3, console.debug, ...args);
    }
  }
  const crossTabQueueStoragePrefix = "CrossTabQueue";
  const logger$5 = new Logger("CrossTabQueue", "0");
  class CrossTabQueue {
    constructor(key) {
      __publicField(this, "storageKey");
      __publicField(this, "listenerId");
      this.storageKey = `${crossTabQueueStoragePrefix}_${key}`;
    }
    updateData(updater) {
      logger$5.info(`Data updated for "${this.storageKey}"`);
      const oldData = _GM_getValue(this.storageKey, []);
      const newData = updater(oldData);
      _GM_setValue(this.storageKey, newData);
      logger$5.debug("Old data:", oldData);
      logger$5.debug("New data:", newData);
    }
    push(item) {
      this.updateData((current) => [...current, item]);
    }
    /** 订阅队列变化 */
    subscribe(callback) {
      logger$5.info(`Subscribed for "${this.storageKey}"`);
      try {
        const items = this.flushQueue();
        logger$5.debug("Initial items:", items);
        if (items.length > 0) callback(items);
      } catch (error) {
        logger$5.error(`"${this.storageKey}" initial processing failed:`, error);
      }
      this.listenerId = _GM_addValueChangeListener(this.storageKey, () => {
        logger$5.info(`Data changed for "${this.storageKey}"`);
        const items = this.flushQueue();
        if (items.length > 0) callback(items);
      });
    }
    unsubscribe() {
      if (this.listenerId) {
        logger$5.info(`Unsubscribed from "${this.storageKey}"`);
        _GM_removeValueChangeListener(this.listenerId);
      }
    }
    /** 获取并清空队列 */
    flushQueue() {
      logger$5.info(`Flushing queue for "${this.storageKey}"`);
      const currentData = _GM_getValue(this.storageKey, []);
      if (currentData.length === 0) return [];
      let flushedItems = [];
      this.updateData(() => {
        flushedItems = [...currentData];
        return [];
      });
      logger$5.debug("Flushed items:", flushedItems);
      return flushedItems;
    }
  }
  const optionKeys = ["AC", "WORKING"];
  function isProgressEventData(data) {
    return typeof data === "object" && data !== null && data !== void 0 && "problemSlug" in data && typeof data["problemSlug"] === "string" && "optionKey" in data && optionKeys.includes(data["optionKey"]);
  }
  const logger$4 = new Logger(
    "submissionReceiver",
    "0"
  );
  const sharedQueue$1 = new CrossTabQueue(CROSS_TAB_PROGRESS_KEY);
  function start() {
    logger$4.info("Starting submission receiver");
    sharedQueue$1.subscribe((items) => {
      items.forEach((item) => {
        if (isProgressEventData(item)) {
          logger$4.info("Received progress event data");
          logger$4.debug("data:", item);
          const event = new CustomEvent(LCRE_PROGRESS_EVENT, {
            detail: { data: item }
          });
          window.dispatchEvent(event);
        } else {
          logger$4.error("Received unknown item:", item);
        }
      });
    });
  }
  function stop() {
    sharedQueue$1.unsubscribe();
    logger$4.info(`Stopping submission receiver`);
  }
  const logger$3 = new Logger("LCRatingSide", "0");
  function LCRatingSide() {
    require$$0.useEffect(() => {
      logger$3.info(`Extension mounted`);
      return () => {
        logger$3.info(`Extension unmounted`);
      };
    }, []);
    require$$0.useEffect(() => {
      const trigger = new ClockTrigger(() => {
        logger$3.info("Send ping event to the page");
        window.dispatchEvent(new Event(LCRE_PING_EVENT));
      }, start);
      trigger.on();
      const handler = () => {
        logger$3.info("Received pong event from the page");
        trigger.trigger();
      };
      window.addEventListener(LCRE_PONG_EVENT, handler);
      return () => {
        trigger.off();
        stop();
        window.removeEventListener(LCRE_PONG_EVENT, handler);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  }
  function isSubmissonResponseData(data) {
    if (data.state === "STARTED") {
      return true;
    }
    if (data.state === "SUCCESS") {
      return data.status_msg === "Accepted" || data.status_msg === "Wrong Answer" || data.status_msg === "Runtime Error" || data.status_msg === "Time Limit Exceeded" || data.status_msg === "Compile Error";
    }
    return false;
  }
  const sharedQueue = new CrossTabQueue(CROSS_TAB_PROGRESS_KEY);
  const logger$2 = new Logger(
    "submissionExtractor",
    "0"
  );
  const reg = new RegExp("^https://leetcode.cn/problems/(.+)/submissions");
  async function fn(response) {
    var _a;
    logger$2.info("Starting handle submission response");
    logger$2.debug("Response", response);
    if (response.bodyUsed) {
      logger$2.error("Response body already used");
      return;
    }
    logger$2.info("Get submission response data");
    const respData = await response.json();
    if (!isSubmissonResponseData(respData)) {
      logger$2.error("Response data is not valid");
      return;
    }
    logger$2.debug("Response data", respData);
    if (respData.state !== "SUCCESS") {
      return;
    }
    logger$2.info("Push progress event data");
    const problemSlug = (_a = reg.exec(location.href)) == null ? void 0 : _a[1];
    if (problemSlug === void 0) {
      logger$2.error("Problem slug is undefined");
      return;
    }
    const overwrite = ["TODO", "WORKING"];
    let peData;
    if (respData.status_msg === "Accepted") {
      peData = {
        problemSlug,
        optionKey: "AC",
        overwrite
      };
    } else {
      peData = {
        problemSlug,
        optionKey: "WORKING",
        overwrite
      };
    }
    logger$2.debug("Progress event data", peData);
    sharedQueue.push(peData);
  }
  const problemSubmitRespUrlPattern = new RegExp(
    String.raw`^https://leetcode.cn/submissions/detail/\d+/check/`
  );
  function filter(responseHeader) {
    return problemSubmitRespUrlPattern.test(responseHeader.url) && responseHeader.ok;
  }
  const submissionExtractor = {
    fn,
    filter
  };
  const logger$1 = new Logger("FetchInterceptor", "0");
  class FetchInterceptor {
    constructor() {
      __publicField(this, "originalFetch");
      __publicField(this, "handlers", /* @__PURE__ */ new Set());
      this.originalFetch = window.fetch;
    }
    install() {
      if (window.fetch === this.originalFetch) {
        logger$1.info("Fetch interceptor installed");
        window.fetch = this.interceptFetch.bind(this);
        logger$1.debug("fetch", window.fetch);
      }
    }
    uninstall() {
      if (window.fetch === this.interceptFetch) {
        logger$1.info("Fetch interceptor uninstalled");
        window.fetch = this.originalFetch;
        logger$1.debug("fetch", window.fetch);
      }
    }
    addHandler(handler) {
      logger$1.info("Fetch interceptor handler added");
      if (this.handlers.size === 0) {
        this.install();
      }
      this.handlers.add(handler);
      logger$1.debug("handler", handler);
      logger$1.debug("handlers", this.handlers);
    }
    removeHandler(handler) {
      logger$1.info("Fetch interceptor handler removed");
      this.handlers.delete(handler);
      if (this.handlers.size === 0) {
        this.uninstall();
      }
      logger$1.debug("handler", handler);
      logger$1.debug("handlers", this.handlers);
    }
    async interceptFetch(...args) {
      logger$1.info("Fetch interceptor triggered");
      const originalResponse = await this.originalFetch.apply(window, args);
      [...this.handlers].map(async (handler) => {
        try {
          const match = handler.filter(originalResponse);
          if (!match) return;
          logger$1.info("Fetch interceptor handler match");
          logger$1.debug("handler", handler);
          const clonedResponse = originalResponse.clone();
          await handler.fn(clonedResponse);
        } catch (error) {
          const name = handler.fn.name || "<anonymous>";
          logger$1.error(`Handler ${name} error:`, error);
        }
      });
      return originalResponse;
    }
  }
  const fetchInterceptor = new FetchInterceptor();
  const logger = new Logger("LeetCodeSide", "0");
  function LeetCodeSide() {
    require$$0.useEffect(() => {
      logger.info(`Extension mounted`);
      return () => {
        logger.info(`Extension unmounted`);
      };
    }, []);
    require$$0.useEffect(() => {
      fetchInterceptor.addHandler(submissionExtractor);
      return () => {
        fetchInterceptor.removeHandler(submissionExtractor);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  }
  var client = {};
  var hasRequiredClient;
  function requireClient() {
    if (hasRequiredClient) return client;
    hasRequiredClient = 1;
    var m = require$$0$1;
    {
      client.createRoot = m.createRoot;
      client.hydrateRoot = m.hydrateRoot;
    }
    return client;
  }
  var clientExports = requireClient();
  const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
  ReactDOM.createRoot(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: (() => {
      if (location.hostname === LC_RATING_HOST || false) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(LCRatingSide, {});
      } else if (location.hostname === LEETCODE_HOST || location.hostname === LEETCODE_HOST_CN) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(LeetCodeSide, {});
      }
    })() })
  );

})(React, ReactDOM);