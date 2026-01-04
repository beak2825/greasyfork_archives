// ==UserScript==
// @name               Universal Tool
// @name:zh-cn         万能工具
// @namespace          https://github.com/Ocyss/Tampermonkey
// @version            0.3.0
// @description        Specially written practical gadgets
// @description:zh-cn  专门编写实用小工具
// @icon               https://cdn-icons-png.flaticon.com/512/949/949339.png
// @match              *://*/*
// @connect            *
// @grant              CAT_userConfig
// @grant              GM.xmlHttpRequest
// @grant              GM_download
// @grant              GM_getValue
// @grant              GM_openInTab
// @grant              GM_registerMenuCommand
// @grant              GM_setClipboard
// @grant              GM_setValue
// @grant              unsafeWindow
// @grant              window.focus
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/506179/Universal%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/506179/Universal%20Tool.meta.js
// ==/UserScript==

/* ==UserConfig==
{OpenAI: {baseUrl: {title: baseUrl,type: text,default: https://api.openai.com/v1},apiKey: {title: apiKey,type: text},model: {title: model,type: text}}}
  ==/UserConfig== */



(function () {
  'use strict';

  function parseRawHeaders(h) {
    const s = h.trim();
    if (!s) {
      return new Headers();
    }
    const array = s.split("\r\n").map((value) => {
      let s2 = value.split(":");
      return [s2[0].trim(), s2[1].trim()];
    });
    return new Headers(array);
  }
  function parseGMResponse(req, res) {
    const headers = parseRawHeaders(res.responseHeaders);
    const body = typeof res.response === "string" ? new Blob([res.response], { type: headers.get("Content-Type") || "text/plain" }) : res.response;
    return new ResImpl(body, {
      statusCode: res.status,
      statusText: res.statusText,
      headers,
      finalUrl: res.finalUrl,
      redirected: res.finalUrl === req.url
    });
  }
  class ResImpl {
    constructor(body, init) {
      this.rawBody = body;
      this.init = init;
      this.body = body.stream();
      const { headers, statusCode, statusText, finalUrl, redirected } = init;
      this.headers = headers;
      this.status = statusCode;
      this.statusText = statusText;
      this.url = finalUrl;
      this.type = "basic";
      this.redirected = redirected;
      this._bodyUsed = false;
    }
    get bodyUsed() {
      return this._bodyUsed;
    }
    get ok() {
      return this.status < 300;
    }
    arrayBuffer() {
      if (this.bodyUsed) {
        throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");
      }
      this._bodyUsed = true;
      return this.rawBody.arrayBuffer();
    }
    blob() {
      if (this.bodyUsed) {
        throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");
      }
      this._bodyUsed = true;
      return Promise.resolve(this.rawBody.slice(0, this.rawBody.size, this.rawBody.type));
    }
    clone() {
      if (this.bodyUsed) {
        throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");
      }
      return new ResImpl(this.rawBody, this.init);
    }
    formData() {
      if (this.bodyUsed) {
        throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");
      }
      this._bodyUsed = true;
      return this.rawBody.text().then(decode);
    }
    async json() {
      if (this.bodyUsed) {
        throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");
      }
      this._bodyUsed = true;
      return JSON.parse(await this.rawBody.text());
    }
    text() {
      if (this.bodyUsed) {
        throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");
      }
      this._bodyUsed = true;
      return this.rawBody.text();
    }
    async bytes() {
      if (this.bodyUsed) {
        throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");
      }
      this._bodyUsed = true;
      return new Uint8Array(await this.rawBody.arrayBuffer());
    }
  }
  function decode(body) {
    const form = new FormData();
    body.trim().split("&").forEach(function(bytes) {
      if (bytes) {
        const split = bytes.split("=");
        const name = split.shift()?.replace(/\+/g, " ");
        const value = split.join("=").replace(/\+/g, " ");
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }
  async function GM_fetch(input, init) {
    const request = new Request(input, init);
    let data;
    if (init?.body) {
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
        headers: Object.fromEntries(new Headers(init?.headers).entries()),
        data,
        responseType: "blob",
        onload(res) {
          try {
            resolve(parseGMResponse(request, res));
          } catch (e) {
            reject(e);
          }
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
  var _GM_download = (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_openInTab = (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setClipboard = (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  async function GM_chat(msg, opt = {}) {
    const baseUrl = _GM_getValue("OpenAI.baseUrl");
    const apiKey = _GM_getValue("OpenAI.apiKey");
    const model = _GM_getValue("OpenAI.model");
    if (!baseUrl || !apiKey || !model) {
      try {
        CAT_userConfig();
      } catch (error) {
        throw Error(`GM_chat没有进行配置, ${error}`);
      }
    }
    const {
      stream = false,
      streamSplit = true,
      console: enableConsole = true
    } = opt;
    const messages = typeof msg === "string" ? [{ role: "user", content: msg }] : msg;
    const requestBody = {
      model,
      messages,
      stream
    };
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (stream) {
        return await handleStreamResponse(response, {
          streamSplit,
          enableConsole
        });
      } else {
        return await handleNormalResponse(response, { enableConsole });
      }
    } catch (error) {
      console.error("GM_chat 调用失败:", error);
      throw error;
    }
  }
  async function handleNormalResponse(response, { enableConsole }) {
    const data = await response.json();
    const message = data.choices[0].message.content;
    if (enableConsole) {
      console.log("OpenAI Response:", message);
    }
    return {
      message,
      usage: data.usage
    };
  }
  async function handleStreamResponse(response, {
    streamSplit,
    enableConsole
  }) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullMessage = "";
    let buffer = "";
    if (enableConsole && streamSplit) {
      console.group("OpenAI Stream Response:");
    }
    if (!reader) {
      throw new Error("reader is not defined");
    }
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta?.content;
              if (delta) {
                fullMessage += delta;
                if (enableConsole) {
                  const parts = delta.split("\n");
                  for (let i = 0; i < parts.length; i++) {
                    if (parts[i] || i < parts.length - 1) {
                      console.log(parts[i]);
                    }
                  }
                }
              }
            } catch (e) {
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      if (enableConsole && streamSplit) {
        console.groupEnd();
      }
    }
    return { message: fullMessage };
  }
  function createReactiveObject(initialState) {
    const state = { ...initialState };
    return new Proxy(state, {
      get(target, key) {
        return target[key];
      },
      set(target, key, value) {
        target[key] = value;
        return true;
      }
    });
  }
  function createToggleMenu(config) {
    const {
      menuName,
      onStart,
      onStop,
      persistent = true,
      textStart = "🔴/开始",
      textStop = "🟢/停止"
    } = config;
    const state = createReactiveObject({
      ...config.initialState ?? {},
      isRunning: config.defaultRunning ?? false
    });
    const id = `toggle_menu_name_${menuName}`;
    if (persistent) {
      state.isRunning = _GM_getValue(id, state.isRunning);
    }
    function updateMenuCommand() {
      if (state.isRunning) {
        _GM_registerMenuCommand(
          `${textStop}${menuName}`,
          () => {
            state.isRunning = false;
            if (persistent) {
              _GM_setValue(id, false);
            }
            onStop(state);
            updateMenuCommand();
          },
          {
            id
          }
        );
      } else {
        _GM_registerMenuCommand(
          `${textStart}${menuName}`,
          () => {
            state.isRunning = true;
            if (persistent) {
              _GM_setValue(id, true);
            }
            onStart(state);
            updateMenuCommand();
          },
          {
            id
          }
        );
      }
    }
    updateMenuCommand();
    if (state.isRunning) {
      onStart(state);
    }
  }
  const ut = {
    qe(selector, el) {
      return (el ?? document).querySelector(selector);
    },
    qes(selector, el) {
      return (el ?? document).querySelectorAll(selector);
    },
    qesMap(selector, key = "href", el = document) {
      return Array.from(el.querySelectorAll(selector)).map(
        (a) => a[key]
      );
    },
    qx(xpath, el = document) {
      return el.evaluate(xpath, el).iterateNext();
    },
    qxs(xpath, el = document) {
      const results = [];
      const query = el.evaluate(
        xpath,
        el.parentElement || el,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
      }
      return results;
    },
    clipboard: _GM_setClipboard,
    setValue: _GM_setValue,
    getValue: _GM_getValue,
    fetch: GM_fetch,
    chat: GM_chat,
    download(items, opt = {}) {
      const defaultLog = (name) => () => console.log(name);
      opt.saveAs ??= true;
      opt.onerror ??= defaultLog("onerror");
      opt.onprogress ??= defaultLog("onprogress");
      opt.ontimeout ??= defaultLog("ontimeout");
      opt.onload ??= defaultLog("onload");
      Array.from(items).forEach((item) => {
        _GM_download({
          ...opt,
          url: item.url,
          name: item.name
        });
      });
    }
  };
  _unsafeWindow.ut = ut;
  _GM_registerMenuCommand("🔍 搜索脚本", () => {
    const host = window.location.host;
    const hostName = Number.isNaN(host.substring(host.lastIndexOf("."))) ? host.substring(
      host.substring(0, host.lastIndexOf(".")).lastIndexOf(".") + 1
    ) : host;
    _GM_openInTab(
      `https://greasyfork.org/zh-CN/scripts/by-site/${hostName}?sort=updated`,
      {
        active: true,
        setParent: true
      }
    );
  });
  createToggleMenu({
    menuName: "平滑滚动",
    persistent: false,
    onStart: (state) => {
      const speed = parseFloat(
        prompt("请输入滚动速度（像素/秒）：", "50") ?? "50"
      );
      if (Number.isNaN(speed) || speed <= 0) {
        alert("请输入有效的速度值！");
        return;
      }
      let lastScrollTime = performance.now();
      let scrollAmount = 0;
      function scrollStep(timestamp) {
        if (!state.isRunning) return;
        const deltaTime = timestamp - lastScrollTime;
        lastScrollTime = timestamp;
        scrollAmount += speed * deltaTime / 1e3;
        const scrollDelta = Math.floor(scrollAmount);
        scrollAmount -= scrollDelta;
        window.scrollBy(0, scrollDelta);
        if (state.isRunning) {
          requestAnimationFrame(scrollStep);
        }
      }
      requestAnimationFrame(scrollStep);
    },
    onStop: () => {
      console.log("自动滚动已停止");
    }
  });
  createToggleMenu({
    menuName: "自然滚动",
    persistent: false,
    onStart: (state) => {
      state.scrollTimer = null;
      function randomScroll() {
        if (!state.isRunning) return;
        const scrollDistance = Math.floor(Math.random() * (window.innerHeight - 100)) + window.innerHeight / 3;
        const stayTime = Math.floor(Math.random() * 5e3) + 3e3;
        const startY = window.scrollY;
        const duration = 1e3;
        let startTime = null;
        function scrollStep(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const scrollDelta = Math.min(progress / duration, 1);
          window.scrollTo(0, startY + scrollDistance * scrollDelta);
          if (progress < duration) {
            requestAnimationFrame(scrollStep);
          } else {
            state.scrollTimer = window.setTimeout(randomScroll, stayTime);
          }
        }
        requestAnimationFrame(scrollStep);
      }
      randomScroll();
    },
    onStop: (state) => {
      if (state.scrollTimer) {
        clearTimeout(state.scrollTimer);
        state.scrollTimer = null;
      }
      console.log("模拟滚动已停止");
    }
  });
  createToggleMenu({
    menuName: "焦点劫持",
    textStart: "🔴/启用",
    textStop: "🟢/禁用",
    defaultRunning: true,
    onStart: (state) => {
      console.log( new Date());
      let allowFocus = false;
      const onMouseDown = () => {
        allowFocus = true;
        setTimeout(() => {
          allowFocus = false;
        }, 100);
      };
      const onBlur = (e) => {
        if (!allowFocus) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      };
      document.addEventListener("mousedown", onMouseDown, true);
      const origFocus = window.focus;
      window.focus = function() {
        if (allowFocus) return origFocus.apply(this, arguments);
      };
      window.addEventListener("blur", onBlur, true);
      state.cleanup = () => {
        document.removeEventListener("mousedown", onMouseDown, true);
        window.focus = origFocus;
        window.removeEventListener("blur", onBlur, true);
      };
      console.log("焦点劫持已启用");
    },
    onStop: (state) => {
      state.cleanup?.();
      console.log("焦点劫持已停止");
    }
  });

})();