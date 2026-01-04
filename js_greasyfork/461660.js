// ==UserScript==
// @name         tanhuazu-helper
// @namespace    tanhuazu-helper.xyjtyskfydhqss.none
// @version      0.1.4
// @author       xyjtyskfydhqss
// @description  tanhuazu.com 探花族论坛助手
// @license      MIT
// @icon         https://www.tanhuazu.com/favicon.ico
// @include      https://www.tanhuazu.com/*
// @include      https://tanhuazu.com/*
// @require      https://unpkg.com/react@18.2.0/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js
// @connect      self
// @connect      obdown.com
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/461660/tanhuazu-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/461660/tanhuazu-helper.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=e,document.head.appendChild(t)})(" ._preview-img-wrapper_1v8wn_1{z-index:500}._preview-img-wrapper_1v8wn_1 img{max-height:100%;max-width:100%}.tanhuazu-download-btn{position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;background-image:none;background-color:transparent;border:1px solid transparent;cursor:pointer;transition:all .2s cubic-bezier(.645,.045,.355,1);user-select:none;touch-action:manipulation;line-height:1.57142857;font-size:16px;height:40px;border-radius:8px;color:#fff;background-color:#1677ff;outline:none;position:absolute;left:calc(100% + 10px);width:100px;top:0;height:auto;width:auto;font-size:30px;padding:5px;display:flex;align-items:center;justify-content:center;text-decoration:none}.tanhuazu-download-btn:hover,.tanhuazu-download-btn:visited{text-decoration:none}.tanhuazu .block-body .message:first-child .message-attribution{font-size:30px}.tanhuazu .structItem.structItem--thread.last-clicked,.tanhuazu .block-row.last-clicked{background-color:#ff8c00;color:#fff}.tanhuazu .structItem.structItem--thread.last-clicked a,.tanhuazu .block-row.last-clicked a{color:#fff} ");

(function(require$$0, require$$0$1) {
  "use strict";
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var delayExports = {};
  var delay$2 = {
    get exports() {
      return delayExports;
    },
    set exports(v) {
      delayExports = v;
    }
  };
  const randomInteger = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
  const createAbortError = () => {
    const error = new Error("Delay aborted");
    error.name = "AbortError";
    return error;
  };
  const createDelay = ({ clearTimeout: defaultClear, setTimeout: set, willResolve }) => (ms, { value, signal } = {}) => {
    if (signal && signal.aborted) {
      return Promise.reject(createAbortError());
    }
    let timeoutId;
    let settle;
    let rejectFn;
    const clear = defaultClear || clearTimeout;
    const signalListener = () => {
      clear(timeoutId);
      rejectFn(createAbortError());
    };
    const cleanup = () => {
      if (signal) {
        signal.removeEventListener("abort", signalListener);
      }
    };
    const delayPromise = new Promise((resolve, reject) => {
      settle = () => {
        cleanup();
        if (willResolve) {
          resolve(value);
        } else {
          reject(value);
        }
      };
      rejectFn = reject;
      timeoutId = (set || setTimeout)(settle, ms);
    });
    if (signal) {
      signal.addEventListener("abort", signalListener, { once: true });
    }
    delayPromise.clear = () => {
      clear(timeoutId);
      timeoutId = null;
      settle();
    };
    return delayPromise;
  };
  const createWithTimers = (clearAndSet) => {
    const delay2 = createDelay({ ...clearAndSet, willResolve: true });
    delay2.reject = createDelay({ ...clearAndSet, willResolve: false });
    delay2.range = (minimum, maximum, options) => delay2(randomInteger(minimum, maximum), options);
    return delay2;
  };
  const delay$1 = createWithTimers();
  delay$1.createWithTimers = createWithTimers;
  delay$2.exports = delay$1;
  delayExports.default = delay$1;
  function idle() {
    return new Promise((resolve) => {
      requestIdleCallback(() => resolve(void 0));
    });
  }
  const APP_NAME = "tanhuazu-helper";
  function logWithLabel(...args) {
    const [msg, ...rest] = args;
    if (typeof msg === "string") {
      console.log(`[${APP_NAME}]: ${msg}`, ...rest);
    } else {
      console.log(`[${APP_NAME}]: `, msg, ...rest);
    }
  }
  async function handleReplyWait() {
    while (true) {
      await waitOverlayAndProcess();
      await delayExports(1e3);
    }
  }
  async function waitOverlayAndProcess() {
    let overlay;
    let msgEl;
    let title = "";
    let msg = "";
    const hasWarningOverlay = async () => {
      var _a, _b, _c;
      await idle();
      overlay = document.querySelector(
        ".overlay-container.is-active .overlay"
      );
      if (!overlay)
        return;
      title = ((_b = (_a = overlay.querySelector(".overlay-title")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) ?? "";
      msgEl = overlay == null ? void 0 : overlay.querySelector(
        ".overlay-content .blockMessage"
      );
      msg = ((_c = msgEl == null ? void 0 : msgEl.textContent) == null ? void 0 : _c.trim()) ?? "";
      if (title === "哎呀!我们遇到了一些问题。" && msg && msg.includes("您必须等待") && msg.includes("后才可以继续执行此操作")) {
        return true;
      }
    };
    while (!await hasWarningOverlay()) {
      await delayExports(500);
    }
    let seconds = Number(
      /您必须等待 (\d+) 秒后才可以继续执行此操作。/.exec(msg)[1]
    );
    if (!seconds || isNaN(seconds))
      return;
    while (seconds > 0) {
      if (!document.querySelector(".overlay-container.is-active .overlay")) {
        return;
      }
      await delayExports(1e3);
      seconds--;
      const rest = seconds >= 60 ? `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒` : `${seconds} 秒`;
      msgEl.textContent = `您必须等待 ${rest} 后才可以继续执行此操作。`;
    }
    await delayExports(1e3);
    GM_notification({
      title: "tanhuazu.com 可以继续操作了",
      text: document.title,
      onclick() {
        GM_openInTab(location.href, {
          active: true,
          insert: true
        });
      }
    });
  }
  function parseRawHeaders(h2) {
    const s2 = h2.trim();
    if (!s2) {
      return new Headers();
    }
    const array = s2.split("\r\n").map((value) => {
      let s3 = value.split(":");
      return [s3[0].trim(), s3[1].trim()];
    });
    return new Headers(array);
  }
  function parseGMResponse(res) {
    const r2 = new Response(res.response, {
      statusText: res.statusText,
      status: res.status,
      headers: parseRawHeaders(res.responseHeaders)
    });
    Object.defineProperty(r2, "url", {
      value: res.finalUrl
    });
    return r2;
  }
  async function GM_fetch(input, init) {
    const request = new Request(input, init);
    let data;
    if (init == null ? void 0 : init.body) {
      data = await request.text();
    }
    return await XHR(request, init, data);
  }
  function XHR(request, init, data) {
    return new Promise((resolve, reject) => {
      if (request.signal && request.signal.aborted) {
        return reject(new DOMException("Aborted", "AbortError"));
      }
      GM.xmlHttpRequest({
        url: request.url,
        method: gmXHRMethod(request.method.toUpperCase()),
        headers: Object.fromEntries(new Headers(init == null ? void 0 : init.headers).entries()),
        data,
        responseType: "blob",
        onload(res) {
          resolve(parseGMResponse(res));
        },
        onabort() {
          reject(new DOMException("Aborted", "AbortError"));
        },
        ontimeout() {
          reject(new TypeError("Network request failed, timeout"));
        },
        onerror(err) {
          reject(new TypeError("Failed to fetch: " + err.finalUrl));
        }
      });
    });
  }
  const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "TRACE", "OPTIONS", "CONNECT"];
  function includes(array, element) {
    return array.includes(element);
  }
  function gmXHRMethod(method) {
    if (includes(httpMethods, method)) {
      return method;
    }
    throw new Error(`unsupported http method ${method}`);
  }
  class HTTPError extends Error {
    constructor(response, request, options) {
      const code = response.status || response.status === 0 ? response.status : "";
      const title = response.statusText || "";
      const status = `${code} ${title}`.trim();
      const reason = status ? `status code ${status}` : "an unknown error";
      super(`Request failed with ${reason}`);
      Object.defineProperty(this, "response", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "request", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.name = "HTTPError";
      this.response = response;
      this.request = request;
      this.options = options;
    }
  }
  class TimeoutError extends Error {
    constructor(request) {
      super("Request timed out");
      Object.defineProperty(this, "request", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.name = "TimeoutError";
      this.request = request;
    }
  }
  const isObject$1 = (value) => value !== null && typeof value === "object";
  const validateAndMerge = (...sources) => {
    for (const source of sources) {
      if ((!isObject$1(source) || Array.isArray(source)) && typeof source !== "undefined") {
        throw new TypeError("The `options` argument must be an object");
      }
    }
    return deepMerge({}, ...sources);
  };
  const mergeHeaders = (source1 = {}, source2 = {}) => {
    const result = new globalThis.Headers(source1);
    const isHeadersInstance = source2 instanceof globalThis.Headers;
    const source = new globalThis.Headers(source2);
    for (const [key, value] of source.entries()) {
      if (isHeadersInstance && value === "undefined" || value === void 0) {
        result.delete(key);
      } else {
        result.set(key, value);
      }
    }
    return result;
  };
  const deepMerge = (...sources) => {
    let returnValue = {};
    let headers = {};
    for (const source of sources) {
      if (Array.isArray(source)) {
        if (!Array.isArray(returnValue)) {
          returnValue = [];
        }
        returnValue = [...returnValue, ...source];
      } else if (isObject$1(source)) {
        for (let [key, value] of Object.entries(source)) {
          if (isObject$1(value) && key in returnValue) {
            value = deepMerge(returnValue[key], value);
          }
          returnValue = { ...returnValue, [key]: value };
        }
        if (isObject$1(source.headers)) {
          headers = mergeHeaders(headers, source.headers);
          returnValue.headers = headers;
        }
      }
    }
    return returnValue;
  };
  const supportsRequestStreams = (() => {
    let duplexAccessed = false;
    let hasContentType = false;
    const supportsReadableStream = typeof globalThis.ReadableStream === "function";
    if (supportsReadableStream) {
      hasContentType = new globalThis.Request("https://a.com", {
        body: new globalThis.ReadableStream(),
        method: "POST",
        // @ts-expect-error - Types are outdated.
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
    }
    return duplexAccessed && !hasContentType;
  })();
  const supportsAbortController = typeof globalThis.AbortController === "function";
  const supportsResponseStreams = typeof globalThis.ReadableStream === "function";
  const supportsFormData = typeof globalThis.FormData === "function";
  const requestMethods = ["get", "post", "put", "patch", "head", "delete"];
  const responseTypes = {
    json: "application/json",
    text: "text/*",
    formData: "multipart/form-data",
    arrayBuffer: "*/*",
    blob: "*/*"
  };
  const maxSafeTimeout = 2147483647;
  const stop = Symbol("stop");
  const normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
  const retryMethods = ["get", "put", "head", "delete", "options", "trace"];
  const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
  const retryAfterStatusCodes = [413, 429, 503];
  const defaultRetryOptions = {
    limit: 2,
    methods: retryMethods,
    statusCodes: retryStatusCodes,
    afterStatusCodes: retryAfterStatusCodes,
    maxRetryAfter: Number.POSITIVE_INFINITY,
    backoffLimit: Number.POSITIVE_INFINITY
  };
  const normalizeRetryOptions = (retry = {}) => {
    if (typeof retry === "number") {
      return {
        ...defaultRetryOptions,
        limit: retry
      };
    }
    if (retry.methods && !Array.isArray(retry.methods)) {
      throw new Error("retry.methods must be an array");
    }
    if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
      throw new Error("retry.statusCodes must be an array");
    }
    return {
      ...defaultRetryOptions,
      ...retry,
      afterStatusCodes: retryAfterStatusCodes
    };
  };
  async function timeout(request, abortController, options) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (abortController) {
          abortController.abort();
        }
        reject(new TimeoutError(request));
      }, options.timeout);
      void options.fetch(request).then(resolve).catch(reject).then(() => {
        clearTimeout(timeoutId);
      });
    });
  }
  const isDomExceptionSupported = Boolean(globalThis.DOMException);
  function composeAbortError(signal) {
    if (isDomExceptionSupported) {
      return new DOMException((signal == null ? void 0 : signal.reason) ?? "The operation was aborted.", "AbortError");
    }
    const error = new Error((signal == null ? void 0 : signal.reason) ?? "The operation was aborted.");
    error.name = "AbortError";
    return error;
  }
  async function delay(ms, { signal }) {
    return new Promise((resolve, reject) => {
      if (signal) {
        if (signal.aborted) {
          reject(composeAbortError(signal));
          return;
        }
        signal.addEventListener("abort", handleAbort, { once: true });
      }
      function handleAbort() {
        reject(composeAbortError(signal));
        clearTimeout(timeoutId);
      }
      const timeoutId = setTimeout(() => {
        signal == null ? void 0 : signal.removeEventListener("abort", handleAbort);
        resolve();
      }, ms);
    });
  }
  class Ky {
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    static create(input, options) {
      const ky2 = new Ky(input, options);
      const fn = async () => {
        if (ky2._options.timeout > maxSafeTimeout) {
          throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
        }
        await Promise.resolve();
        let response = await ky2._fetch();
        for (const hook of ky2._options.hooks.afterResponse) {
          const modifiedResponse = await hook(ky2.request, ky2._options, ky2._decorateResponse(response.clone()));
          if (modifiedResponse instanceof globalThis.Response) {
            response = modifiedResponse;
          }
        }
        ky2._decorateResponse(response);
        if (!response.ok && ky2._options.throwHttpErrors) {
          let error = new HTTPError(response, ky2.request, ky2._options);
          for (const hook of ky2._options.hooks.beforeError) {
            error = await hook(error);
          }
          throw error;
        }
        if (ky2._options.onDownloadProgress) {
          if (typeof ky2._options.onDownloadProgress !== "function") {
            throw new TypeError("The `onDownloadProgress` option must be a function");
          }
          if (!supportsResponseStreams) {
            throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
          }
          return ky2._stream(response.clone(), ky2._options.onDownloadProgress);
        }
        return response;
      };
      const isRetriableMethod = ky2._options.retry.methods.includes(ky2.request.method.toLowerCase());
      const result = isRetriableMethod ? ky2._retry(fn) : fn();
      for (const [type, mimeType] of Object.entries(responseTypes)) {
        result[type] = async () => {
          ky2.request.headers.set("accept", ky2.request.headers.get("accept") || mimeType);
          const awaitedResult = await result;
          const response = awaitedResult.clone();
          if (type === "json") {
            if (response.status === 204) {
              return "";
            }
            const arrayBuffer = await response.clone().arrayBuffer();
            const responseSize = arrayBuffer.byteLength;
            if (responseSize === 0) {
              return "";
            }
            if (options.parseJson) {
              return options.parseJson(await response.text());
            }
          }
          return response[type]();
        };
      }
      return result;
    }
    // eslint-disable-next-line complexity
    constructor(input, options = {}) {
      Object.defineProperty(this, "request", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "abortController", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_retryCount", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      });
      Object.defineProperty(this, "_input", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "_options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this._input = input;
      this._options = {
        // TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
        credentials: this._input.credentials || "same-origin",
        ...options,
        headers: mergeHeaders(this._input.headers, options.headers),
        hooks: deepMerge({
          beforeRequest: [],
          beforeRetry: [],
          beforeError: [],
          afterResponse: []
        }, options.hooks),
        method: normalizeRequestMethod(options.method ?? this._input.method),
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        prefixUrl: String(options.prefixUrl || ""),
        retry: normalizeRetryOptions(options.retry),
        throwHttpErrors: options.throwHttpErrors !== false,
        timeout: typeof options.timeout === "undefined" ? 1e4 : options.timeout,
        fetch: options.fetch ?? globalThis.fetch.bind(globalThis)
      };
      if (typeof this._input !== "string" && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
        throw new TypeError("`input` must be a string, URL, or Request");
      }
      if (this._options.prefixUrl && typeof this._input === "string") {
        if (this._input.startsWith("/")) {
          throw new Error("`input` must not begin with a slash when using `prefixUrl`");
        }
        if (!this._options.prefixUrl.endsWith("/")) {
          this._options.prefixUrl += "/";
        }
        this._input = this._options.prefixUrl + this._input;
      }
      if (supportsAbortController) {
        this.abortController = new globalThis.AbortController();
        if (this._options.signal) {
          const originalSignal = this._options.signal;
          this._options.signal.addEventListener("abort", () => {
            this.abortController.abort(originalSignal.reason);
          });
        }
        this._options.signal = this.abortController.signal;
      }
      if (supportsRequestStreams) {
        this._options.duplex = "half";
      }
      this.request = new globalThis.Request(this._input, this._options);
      if (this._options.searchParams) {
        const textSearchParams = typeof this._options.searchParams === "string" ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString();
        const searchParams = "?" + textSearchParams;
        const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
        if ((supportsFormData && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"])) {
          this.request.headers.delete("content-type");
        }
        this.request = new globalThis.Request(new globalThis.Request(url, { ...this.request }), this._options);
      }
      if (this._options.json !== void 0) {
        this._options.body = JSON.stringify(this._options.json);
        this.request.headers.set("content-type", this._options.headers.get("content-type") ?? "application/json");
        this.request = new globalThis.Request(this.request, { body: this._options.body });
      }
    }
    _calculateRetryDelay(error) {
      this._retryCount++;
      if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
        if (error instanceof HTTPError) {
          if (!this._options.retry.statusCodes.includes(error.response.status)) {
            return 0;
          }
          const retryAfter = error.response.headers.get("Retry-After");
          if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
            let after = Number(retryAfter);
            if (Number.isNaN(after)) {
              after = Date.parse(retryAfter) - Date.now();
            } else {
              after *= 1e3;
            }
            if (typeof this._options.retry.maxRetryAfter !== "undefined" && after > this._options.retry.maxRetryAfter) {
              return 0;
            }
            return after;
          }
          if (error.response.status === 413) {
            return 0;
          }
        }
        const BACKOFF_FACTOR = 0.3;
        return Math.min(this._options.retry.backoffLimit, BACKOFF_FACTOR * 2 ** (this._retryCount - 1) * 1e3);
      }
      return 0;
    }
    _decorateResponse(response) {
      if (this._options.parseJson) {
        response.json = async () => this._options.parseJson(await response.text());
      }
      return response;
    }
    async _retry(fn) {
      try {
        return await fn();
      } catch (error) {
        const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
        if (ms !== 0 && this._retryCount > 0) {
          await delay(ms, { signal: this._options.signal });
          for (const hook of this._options.hooks.beforeRetry) {
            const hookResult = await hook({
              request: this.request,
              options: this._options,
              error,
              retryCount: this._retryCount
            });
            if (hookResult === stop) {
              return;
            }
          }
          return this._retry(fn);
        }
        throw error;
      }
    }
    async _fetch() {
      for (const hook of this._options.hooks.beforeRequest) {
        const result = await hook(this.request, this._options);
        if (result instanceof Request) {
          this.request = result;
          break;
        }
        if (result instanceof Response) {
          return result;
        }
      }
      if (this._options.timeout === false) {
        return this._options.fetch(this.request.clone());
      }
      return timeout(this.request.clone(), this.abortController, this._options);
    }
    /* istanbul ignore next */
    _stream(response, onDownloadProgress) {
      const totalBytes = Number(response.headers.get("content-length")) || 0;
      let transferredBytes = 0;
      if (response.status === 204) {
        if (onDownloadProgress) {
          onDownloadProgress({ percent: 1, totalBytes, transferredBytes }, new Uint8Array());
        }
        return new globalThis.Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
      return new globalThis.Response(new globalThis.ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          if (onDownloadProgress) {
            onDownloadProgress({ percent: 0, transferredBytes: 0, totalBytes }, new Uint8Array());
          }
          async function read() {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            if (onDownloadProgress) {
              transferredBytes += value.byteLength;
              const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
              onDownloadProgress({ percent, transferredBytes, totalBytes }, value);
            }
            controller.enqueue(value);
            await read();
          }
          await read();
        }
      }), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
  }
  /*! MIT License © Sindre Sorhus */
  const createInstance = (defaults) => {
    const ky2 = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
    for (const method of requestMethods) {
      ky2[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
    }
    ky2.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
    ky2.extend = (newDefaults) => createInstance(validateAndMerge(defaults, newDefaults));
    ky2.stop = stop;
    return ky2;
  };
  const ky = createInstance();
  const ky$1 = ky;
  const kyfetch = ky$1.extend({ fetch: GM_fetch });
  async function fetchMagnetLink() {
    var _a, _b, _c;
    const query = () => document.querySelector(
      `.block-body article.message .message-body a[href*="obdown.com"][href*=".torrent"]`
    );
    const timeout2 = performance.now() + 5e3;
    while (!query() && performance.now() < timeout2) {
      await delayExports(500);
    }
    const a2 = query();
    if (!a2)
      return;
    const torrentPageUrl = a2.getAttribute("href");
    if (!torrentPageUrl)
      return;
    console.log("[tanhuazu-helper]: torrent download page %s", torrentPageUrl);
    const html = await kyfetch.get(torrentPageUrl, {
      retry: 5
    }).text();
    const p2 = new DOMParser();
    const doc = p2.parseFromString(html, "text/html");
    const magnetSpan = Array.from(
      doc.querySelectorAll("span.text-secondary")
    ).filter((span) => {
      var _a2;
      return ((_a2 = span.textContent) == null ? void 0 : _a2.trim()) === "MAGENT";
    })[0];
    const magnet = (_b = (_a = magnetSpan == null ? void 0 : magnetSpan.nextElementSibling) == null ? void 0 : _a.querySelector(`a[href^="magnet:?xt="]`)) == null ? void 0 : _b.getAttribute("href");
    console.log("[tanhuazu-helper]: magnet link %s", magnet);
    if (!magnet)
      return;
    const firstMessage = document.querySelector(
      ".block-body article.message"
    );
    firstMessage.style.position = "relative";
    const btnShare = (_c = firstMessage.querySelector('a[aria-label="分享"]')) == null ? void 0 : _c.parentElement;
    const btnDl = document.createElement("li");
    btnDl.innerHTML = `
    <a href="${magnet}" class="message-attribution-gadget" title="磁力链接">
      <svg viewBox="64 64 896 896" focusable="false" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path></svg>
    </a>
  `;
    btnShare == null ? void 0 : btnShare.insertAdjacentElement("afterend", btnDl);
    btnShare == null ? void 0 : btnShare.remove();
    const createBtn = () => {
      const btn = document.createElement("a");
      btn.href = magnet;
      btn.innerHTML = `
      <svg viewBox="64 64 896 896" focusable="false" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path></svg>
      <span>下载</span>
    `;
      btn.className = "tanhuazu-download-btn";
      return btn;
    };
    const topBtn = createBtn();
    firstMessage.appendChild(topBtn);
    const bottomBtn = createBtn();
    bottomBtn.style.top = "unset";
    bottomBtn.style.bottom = "0";
    firstMessage.appendChild(bottomBtn);
  }
  var jsxRuntimeExports = {};
  var jsxRuntime = {
    get exports() {
      return jsxRuntimeExports;
    },
    set exports(v) {
      jsxRuntimeExports = v;
    }
  };
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
  var f$1 = require$$0, k$1 = Symbol.for("react.element"), l$2 = Symbol.for("react.fragment"), m$2 = Object.prototype.hasOwnProperty, n$2 = f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$2 = { key: true, ref: true, __self: true, __source: true };
  function q$1(c2, a2, g) {
    var b, d = {}, e2 = null, h2 = null;
    void 0 !== g && (e2 = "" + g);
    void 0 !== a2.key && (e2 = "" + a2.key);
    void 0 !== a2.ref && (h2 = a2.ref);
    for (b in a2)
      m$2.call(a2, b) && !p$2.hasOwnProperty(b) && (d[b] = a2[b]);
    if (c2 && c2.defaultProps)
      for (b in a2 = c2.defaultProps, a2)
        void 0 === d[b] && (d[b] = a2[b]);
    return { $$typeof: k$1, type: c2, key: e2, ref: h2, props: d, _owner: n$2.current };
  }
  reactJsxRuntime_production_min.Fragment = l$2;
  reactJsxRuntime_production_min.jsx = q$1;
  reactJsxRuntime_production_min.jsxs = q$1;
  (function(module) {
    {
      module.exports = reactJsxRuntime_production_min;
    }
  })(jsxRuntime);
  const jsx = jsxRuntimeExports.jsx;
  var createRoot;
  var m$1 = require$$0$1;
  {
    createRoot = m$1.createRoot;
    m$1.hydrateRoot;
  }
  const e$1 = Symbol(), t$1 = Symbol(), r$1 = "a", n$1 = "w";
  let o = (e2, t2) => new Proxy(e2, t2);
  const s = Object.getPrototypeOf, c = /* @__PURE__ */ new WeakMap(), l$1 = (e2) => e2 && (c.has(e2) ? c.get(e2) : s(e2) === Object.prototype || s(e2) === Array.prototype), f = (e2) => "object" == typeof e2 && null !== e2, i = (e2) => {
    if (Array.isArray(e2))
      return Array.from(e2);
    const t2 = Object.getOwnPropertyDescriptors(e2);
    return Object.values(t2).forEach((e3) => {
      e3.configurable = true;
    }), Object.create(s(e2), t2);
  }, u$1 = (e2) => e2[t$1] || e2, a = (s2, c2, f2, p2) => {
    if (!l$1(s2))
      return s2;
    let g = p2 && p2.get(s2);
    if (!g) {
      const e2 = u$1(s2);
      g = ((e3) => Object.values(Object.getOwnPropertyDescriptors(e3)).some((e4) => !e4.configurable && !e4.writable))(e2) ? [e2, i(e2)] : [e2], null == p2 || p2.set(s2, g);
    }
    const [y2, h2] = g;
    let w2 = f2 && f2.get(y2);
    return w2 && w2[1].f === !!h2 || (w2 = ((o2, s3) => {
      const c3 = { f: s3 };
      let l2 = false;
      const f3 = (e2, t2) => {
        if (!l2) {
          let s4 = c3[r$1].get(o2);
          if (s4 || (s4 = {}, c3[r$1].set(o2, s4)), e2 === n$1)
            s4[n$1] = true;
          else {
            let r2 = s4[e2];
            r2 || (r2 = /* @__PURE__ */ new Set(), s4[e2] = r2), r2.add(t2);
          }
        }
      }, i2 = { get: (e2, n2) => n2 === t$1 ? o2 : (f3("k", n2), a(Reflect.get(e2, n2), c3[r$1], c3.c)), has: (t2, n2) => n2 === e$1 ? (l2 = true, c3[r$1].delete(o2), true) : (f3("h", n2), Reflect.has(t2, n2)), getOwnPropertyDescriptor: (e2, t2) => (f3("o", t2), Reflect.getOwnPropertyDescriptor(e2, t2)), ownKeys: (e2) => (f3(n$1), Reflect.ownKeys(e2)) };
      return s3 && (i2.set = i2.deleteProperty = () => false), [i2, c3];
    })(y2, !!h2), w2[1].p = o(h2 || y2, w2[0]), f2 && f2.set(y2, w2)), w2[1][r$1] = c2, w2[1].c = f2, w2[1].p;
  }, p$1 = (e2, t2, r2, o2) => {
    if (Object.is(e2, t2))
      return false;
    if (!f(e2) || !f(t2))
      return true;
    const s2 = r2.get(u$1(e2));
    if (!s2)
      return true;
    if (o2) {
      const r3 = o2.get(e2);
      if (r3 && r3.n === t2)
        return r3.g;
      o2.set(e2, { n: t2, g: false });
    }
    let c2 = null;
    try {
      for (const r3 of s2.h || [])
        if (c2 = Reflect.has(e2, r3) !== Reflect.has(t2, r3), c2)
          return c2;
      if (true === s2[n$1]) {
        if (c2 = ((e3, t3) => {
          const r3 = Reflect.ownKeys(e3), n2 = Reflect.ownKeys(t3);
          return r3.length !== n2.length || r3.some((e4, t4) => e4 !== n2[t4]);
        })(e2, t2), c2)
          return c2;
      } else
        for (const r3 of s2.o || [])
          if (c2 = !!Reflect.getOwnPropertyDescriptor(e2, r3) != !!Reflect.getOwnPropertyDescriptor(t2, r3), c2)
            return c2;
      for (const n2 of s2.k || [])
        if (c2 = p$1(e2[n2], t2[n2], r2, o2), c2)
          return c2;
      return null === c2 && (c2 = true), c2;
    } finally {
      o2 && o2.set(e2, { n: t2, g: c2 });
    }
  }, y = (e2) => l$1(e2) && e2[t$1] || null, h$1 = (e2, t2 = true) => {
    c.set(e2, t2);
  }, w = (e2, t2, r2) => {
    const o2 = [], s2 = /* @__PURE__ */ new WeakSet(), c2 = (e3, l2) => {
      if (s2.has(e3))
        return;
      f(e3) && s2.add(e3);
      const i2 = f(e3) && t2.get(u$1(e3));
      if (i2) {
        var a2, p2;
        if (null == (a2 = i2.h) || a2.forEach((e4) => {
          const t3 = `:has(${String(e4)})`;
          o2.push(l2 ? [...l2, t3] : [t3]);
        }), true === i2[n$1]) {
          const e4 = ":ownKeys";
          o2.push(l2 ? [...l2, e4] : [e4]);
        } else {
          var g;
          null == (g = i2.o) || g.forEach((e4) => {
            const t3 = `:hasOwn(${String(e4)})`;
            o2.push(l2 ? [...l2, t3] : [t3]);
          });
        }
        null == (p2 = i2.k) || p2.forEach((t3) => {
          r2 && !("value" in (Object.getOwnPropertyDescriptor(e3, t3) || {})) || c2(e3[t3], l2 ? [...l2, t3] : [t3]);
        });
      } else
        l2 && o2.push(l2);
    };
    return c2(e2), o2;
  };
  const isObject = (x) => typeof x === "object" && x !== null;
  const proxyStateMap = /* @__PURE__ */ new WeakMap();
  const refSet = /* @__PURE__ */ new WeakSet();
  const buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
    switch (promise.status) {
      case "fulfilled":
        return promise.value;
      case "rejected":
        throw promise.reason;
      default:
        throw promise;
    }
  }, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
    const cache = snapCache.get(target);
    if ((cache == null ? void 0 : cache[0]) === version) {
      return cache[1];
    }
    const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
    h$1(snap, true);
    snapCache.set(target, [version, snap]);
    Reflect.ownKeys(target).forEach((key) => {
      if (Object.getOwnPropertyDescriptor(snap, key)) {
        return;
      }
      const value = Reflect.get(target, key);
      const desc = {
        value,
        enumerable: true,
        // This is intentional to avoid copying with proxy-compare.
        // It's still non-writable, so it avoids assigning a value.
        configurable: true
      };
      if (refSet.has(value)) {
        h$1(value, false);
      } else if (value instanceof Promise) {
        delete desc.value;
        desc.get = () => handlePromise(value);
      } else if (proxyStateMap.has(value)) {
        const [target2, ensureVersion] = proxyStateMap.get(
          value
        );
        desc.value = createSnapshot(
          target2,
          ensureVersion(),
          handlePromise
        );
      }
      Object.defineProperty(snap, key, desc);
    });
    return snap;
  }, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction = (initialObject) => {
    if (!isObject(initialObject)) {
      throw new Error("object required");
    }
    const found = proxyCache.get(initialObject);
    if (found) {
      return found;
    }
    let version = versionHolder[0];
    const listeners = /* @__PURE__ */ new Set();
    const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
      if (version !== nextVersion) {
        version = nextVersion;
        listeners.forEach((listener) => listener(op, nextVersion));
      }
    };
    let checkVersion = versionHolder[1];
    const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
      if (checkVersion !== nextCheckVersion && !listeners.size) {
        checkVersion = nextCheckVersion;
        propProxyStates.forEach(([propProxyState]) => {
          const propVersion = propProxyState[1](nextCheckVersion);
          if (propVersion > version) {
            version = propVersion;
          }
        });
      }
      return version;
    };
    const createPropListener = (prop) => (op, nextVersion) => {
      const newOp = [...op];
      newOp[1] = [prop, ...newOp[1]];
      notifyUpdate(newOp, nextVersion);
    };
    const propProxyStates = /* @__PURE__ */ new Map();
    const addPropListener = (prop, propProxyState) => {
      if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && propProxyStates.has(prop)) {
        throw new Error("prop listener already exists");
      }
      if (listeners.size) {
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      } else {
        propProxyStates.set(prop, [propProxyState]);
      }
    };
    const removePropListener = (prop) => {
      var _a;
      const entry = propProxyStates.get(prop);
      if (entry) {
        propProxyStates.delete(prop);
        (_a = entry[1]) == null ? void 0 : _a.call(entry);
      }
    };
    const addListener = (listener) => {
      listeners.add(listener);
      if (listeners.size === 1) {
        propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
          if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && prevRemove) {
            throw new Error("remove already exists");
          }
          const remove = propProxyState[3](createPropListener(prop));
          propProxyStates.set(prop, [propProxyState, remove]);
        });
      }
      const removeListener = () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          propProxyStates.forEach(([propProxyState, remove], prop) => {
            if (remove) {
              remove();
              propProxyStates.set(prop, [propProxyState]);
            }
          });
        }
      };
      return removeListener;
    };
    const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
    const handler = {
      deleteProperty(target, prop) {
        const prevValue = Reflect.get(target, prop);
        removePropListener(prop);
        const deleted = Reflect.deleteProperty(target, prop);
        if (deleted) {
          notifyUpdate(["delete", [prop], prevValue]);
        }
        return deleted;
      },
      set(target, prop, value, receiver) {
        const hasPrevValue = Reflect.has(target, prop);
        const prevValue = Reflect.get(target, prop, receiver);
        if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
          return true;
        }
        removePropListener(prop);
        if (isObject(value)) {
          value = y(value) || value;
        }
        let nextValue = value;
        if (value instanceof Promise) {
          value.then((v) => {
            value.status = "fulfilled";
            value.value = v;
            notifyUpdate(["resolve", [prop], v]);
          }).catch((e2) => {
            value.status = "rejected";
            value.reason = e2;
            notifyUpdate(["reject", [prop], e2]);
          });
        } else {
          if (!proxyStateMap.has(value) && canProxy(value)) {
            nextValue = proxyFunction(value);
          }
          const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
          if (childProxyState) {
            addPropListener(prop, childProxyState);
          }
        }
        Reflect.set(target, prop, nextValue, receiver);
        notifyUpdate(["set", [prop], value, prevValue]);
        return true;
      }
    };
    const proxyObject = newProxy(baseObject, handler);
    proxyCache.set(initialObject, proxyObject);
    const proxyState = [
      baseObject,
      ensureVersion,
      createSnapshot,
      addListener
    ];
    proxyStateMap.set(proxyObject, proxyState);
    Reflect.ownKeys(initialObject).forEach((key) => {
      const desc = Object.getOwnPropertyDescriptor(
        initialObject,
        key
      );
      if ("value" in desc) {
        proxyObject[key] = initialObject[key];
        delete desc.value;
        delete desc.writable;
      }
      Object.defineProperty(baseObject, key, desc);
    });
    return proxyObject;
  }) => [
    // public functions
    proxyFunction,
    // shared state
    proxyStateMap,
    refSet,
    // internal things
    objectIs,
    newProxy,
    canProxy,
    defaultHandlePromise,
    snapCache,
    createSnapshot,
    proxyCache,
    versionHolder
  ];
  const [defaultProxyFunction] = buildProxyFunction();
  function proxy(initialObject = {}) {
    return defaultProxyFunction(initialObject);
  }
  function subscribe(proxyObject, callback, notifyInSync) {
    const proxyState = proxyStateMap.get(proxyObject);
    if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && !proxyState) {
      console.warn("Please use proxy object");
    }
    let promise;
    const ops = [];
    const addListener = proxyState[3];
    let isListenerActive = false;
    const listener = (op) => {
      ops.push(op);
      if (notifyInSync) {
        callback(ops.splice(0));
        return;
      }
      if (!promise) {
        promise = Promise.resolve().then(() => {
          promise = void 0;
          if (isListenerActive) {
            callback(ops.splice(0));
          }
        });
      }
    };
    const removeListener = addListener(listener);
    isListenerActive = true;
    return () => {
      isListenerActive = false;
      removeListener();
    };
  }
  function snapshot(proxyObject, handlePromise) {
    const proxyState = proxyStateMap.get(proxyObject);
    if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production" && !proxyState) {
      console.warn("Please use proxy object");
    }
    const [target, ensureVersion, createSnapshot] = proxyState;
    return createSnapshot(target, ensureVersion(), handlePromise);
  }
  function ref(obj) {
    refSet.add(obj);
    return obj;
  }
  var shimExports = {};
  var shim = {
    get exports() {
      return shimExports;
    },
    set exports(v) {
      shimExports = v;
    }
  };
  var useSyncExternalStoreShim_production_min = {};
  /**
   * @license React
   * use-sync-external-store-shim.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var e = require$$0;
  function h(a2, b) {
    return a2 === b && (0 !== a2 || 1 / a2 === 1 / b) || a2 !== a2 && b !== b;
  }
  var k = "function" === typeof Object.is ? Object.is : h, l = e.useState, m = e.useEffect, n = e.useLayoutEffect, p = e.useDebugValue;
  function q(a2, b) {
    var d = b(), f2 = l({ inst: { value: d, getSnapshot: b } }), c2 = f2[0].inst, g = f2[1];
    n(function() {
      c2.value = d;
      c2.getSnapshot = b;
      r(c2) && g({ inst: c2 });
    }, [a2, d, b]);
    m(function() {
      r(c2) && g({ inst: c2 });
      return a2(function() {
        r(c2) && g({ inst: c2 });
      });
    }, [a2]);
    p(d);
    return d;
  }
  function r(a2) {
    var b = a2.getSnapshot;
    a2 = a2.value;
    try {
      var d = b();
      return !k(a2, d);
    } catch (f2) {
      return true;
    }
  }
  function t(a2, b) {
    return b();
  }
  var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
  useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u;
  (function(module) {
    {
      module.exports = useSyncExternalStoreShim_production_min;
    }
  })(shim);
  const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(shimExports);
  const { use } = require$$0;
  const { useSyncExternalStore } = useSyncExternalStoreExports;
  const useAffectedDebugValue = (state2, affected) => {
    const pathList = require$$0.useRef();
    require$$0.useEffect(() => {
      pathList.current = w(state2, affected, true);
    });
    require$$0.useDebugValue(pathList.current);
  };
  const targetCache = /* @__PURE__ */ new WeakMap();
  function useSnapshot(proxyObject, options) {
    const notifyInSync = options == null ? void 0 : options.sync;
    const lastSnapshot = require$$0.useRef();
    const lastAffected = require$$0.useRef();
    let inRender = true;
    const currSnapshot = useSyncExternalStore(
      require$$0.useCallback(
        (callback) => {
          const unsub = subscribe(proxyObject, callback, notifyInSync);
          callback();
          return unsub;
        },
        [proxyObject, notifyInSync]
      ),
      () => {
        const nextSnapshot = snapshot(proxyObject, use);
        try {
          if (!inRender && lastSnapshot.current && lastAffected.current && !p$1(
            lastSnapshot.current,
            nextSnapshot,
            lastAffected.current,
            /* @__PURE__ */ new WeakMap()
          )) {
            return lastSnapshot.current;
          }
        } catch (e2) {
        }
        return nextSnapshot;
      },
      () => snapshot(proxyObject, use)
    );
    inRender = false;
    const currAffected = /* @__PURE__ */ new WeakMap();
    require$$0.useEffect(() => {
      lastSnapshot.current = currSnapshot;
      lastAffected.current = currAffected;
    });
    if (({ "BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": false } && "production") !== "production") {
      useAffectedDebugValue(currSnapshot, currAffected);
    }
    const proxyCache = require$$0.useMemo(() => /* @__PURE__ */ new WeakMap(), []);
    return a(
      currSnapshot,
      currAffected,
      proxyCache,
      targetCache
    );
  }
  const previewImgWrapper = "_preview-img-wrapper_1v8wn_1";
  const styles = {
    previewImgWrapper
  };
  function showPreviewImgWhenHover(container) {
    if (!container)
      return;
    container.onmouseover = async (e2) => {
      const src = e2.target;
      if (src.tagName.toLowerCase() !== "a")
        return;
      const u2 = new URL(src.href, location.href);
      if (!u2.pathname.startsWith("/threads/"))
        return;
      const threadUrl = u2.pathname.split("/").slice(0, 3).join("/") + "/";
      logWithLabel("hover: %s", threadUrl);
      state.a = ref(src);
      state.threadUrl = threadUrl;
      const imgs = await getPreviewImg(threadUrl);
      logWithLabel("fetched imgs", imgs);
      if (state.threadUrl === threadUrl) {
        state.imgs = imgs;
      }
      if (!root) {
        const div = document.createElement("div");
        div.classList.add("preview-img-root");
        document.body.appendChild(div);
        root = createRoot(div);
        root.render(/* @__PURE__ */ jsx(PreviewImg, {}));
      }
    };
    container.onmouseout = function(e2) {
      state.a = void 0;
      state.threadUrl = "";
      state.imgs = [];
    };
  }
  async function getPreviewImg(threadUrl) {
    const html = await ky$1.get(threadUrl, { cache: "force-cache" }).text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const srcs = Array.from(
      doc.querySelectorAll(
        ".block-body .message:first-child .bbImageWrapper img"
      )
    ).map((img) => img.src);
    return srcs;
  }
  const state = proxy({
    threadUrl: "",
    a: void 0,
    imgs: []
  });
  function PreviewImg() {
    const { imgs, a: a2 } = useSnapshot(state);
    const x = require$$0.useMemo(() => {
      const rect = a2 == null ? void 0 : a2.getBoundingClientRect();
      const x2 = ((rect == null ? void 0 : rect.right) || 0) + 50;
      return x2;
    }, [a2]);
    if (!imgs.length)
      return null;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: styles.previewImgWrapper,
        style: {
          position: "fixed",
          left: x,
          top: 10,
          width: `calc(100vw - ${x}px - 20px)`,
          height: "calc(100vh - 20px)",
          overflow: "hidden"
        },
        children: imgs.slice(0, 1).map((src) => {
          return /* @__PURE__ */ jsx("img", { src, alt: "" }, src);
        })
      }
    );
  }
  let root;
  function postListMain() {
    const container = getThreadListContainer();
    if (!container)
      return;
    container.onclick = (e2) => {
      markLastClicked(e2);
      fixPostLink(e2);
    };
    showPreviewImgWhenHover(container);
  }
  function isSearchResultPage() {
    if (!/^\/search\/\d+\//.test(location.pathname))
      return false;
    const u2 = new URL(location.href);
    if (u2.searchParams.get("searchform") === "1")
      return false;
    return true;
  }
  function getThreadListContainer() {
    let el;
    if (el = document.querySelector(
      [
        '.block[data-type="thread"]',
        '.block[data-widget-key="whats_new_new_posts"]',
        // /what's new
        '.p-body-pageContent:has(> form[action^="/watched/threads"])'
        // /watched/threads
      ].join(",")
    )) {
      return el;
    }
    if (isSearchResultPage() && (el = document.querySelector(".p-body-pageContent"))) {
      return el;
    }
    if (el = document.querySelector(".p-body-pageContent")) {
      return el;
    }
  }
  function fixPostLink(e2) {
    const src = e2.target;
    if (src.tagName.toLowerCase() !== "a")
      return;
    const u2 = new URL(src.href, location.href);
    if (!u2.pathname.startsWith("/threads/"))
      return;
    if (u2.pathname.includes("unread")) {
      e2.preventDefault();
      const newLink = src.href.replace(/unread/, "");
      GM_openInTab(newLink);
    }
  }
  function markLastClicked(e2) {
    var _a;
    const lineSelector = ".structItem.structItem--thread, .block-row";
    const cur = e2.target.closest(lineSelector);
    cur == null ? void 0 : cur.classList.add("last-clicked");
    (_a = e2.currentTarget) == null ? void 0 : _a.querySelectorAll(lineSelector).forEach((item) => {
      item !== cur && item.classList.remove("last-clicked");
    });
  }
  const style = "";
  main();
  function main() {
    document.body.classList.add("tanhuazu");
    const p2 = location.pathname;
    if (p2.startsWith("/threads/")) {
      handleReplyWait();
      fetchMagnetLink();
      return;
    }
    if (p2.startsWith("/forums/") || // 论坛
    p2 === "/whats-new/" || // 最新消息
    p2.startsWith("/whats-new/posts/") || // 新帖
    p2.startsWith("/find-threads/") || // 查找主题(mine, 已回复, 未回复)
    p2.startsWith("/watched/threads") || // 关注主题
    isSearchResultPage() || // 搜索结果
    p2.startsWith("/tags/")) {
      return postListMain();
    }
  }
})(React, ReactDOM);
