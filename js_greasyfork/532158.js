// ==UserScript==
// @name               LeetCode Toolkit
// @name:zh-CN         LeetCode工具箱
// @namespace          https://github.com/eclipher/leetcode-toolkit
// @version            2.8.0
// @author             eclipher
// @description        Find & Save Editorial, Copy problem as Markdown or Download as Jupyter Notebook, Format on Save, Unlock IntelliSense, Display Problem Ratings and more.
// @description:zh-CN  复制题目为 Markdown | 下载为 Jupyter Notebook | 保存时自动格式化 | 免费自动补全 | 显示题目评分
// @license            MIT
// @icon               https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @homepage           https://github.com/eclipher/Userscripts/tree/main/userscripts/leetcode-toolkit
// @include            /https?:\/\/leetcode\.com\/problems\/.*/
// @include            /https?:\/\/leetcode\.cn\/problems\/.*/
// @include            /https?:\/\/leetcode\.com\/explore\/.*\/card\/.*/
// @exclude            *://leetcode.com/problems/*/post-solution/*
// @exclude            *://leetcode.cn/problems/*/post-solution/*
// @require            https://cdn.jsdelivr.net/npm/compressorjs@1.2.1
// @require            https://cdn.jsdelivr.net/npm/turndown@7.2.1/lib/turndown.browser.umd.js
// @resource           editorials  https://raw.githubusercontent.com/akhilkammila/leetcode-screenshotter/refs/heads/main/ReadMe.md
// @resource           ratings     https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/refs/heads/main/ratings.txt
// @connect            assets.leetcode.com
// @connect            *
// @grant              GM_addStyle
// @grant              GM_getResourceText
// @grant              GM_xmlhttpRequest
// @grant              unsafeWindow
// @grant              window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/532158/LeetCode%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/532158/LeetCode%20Toolkit.meta.js
// ==/UserScript==

(function (TurndownService, Compressor) {
  'use strict';

  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  const d=new Set;const e$3 = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  e$3(" div.svelte-4mbyk0{display:inline-flex;flex-wrap:wrap;gap:.4rem}button.svelte-ll0ynk,a.svelte-ll0ynk{color:#fff;background-color:var(--bg, #6c5ce7);box-shadow:0 3px 0 0 var(--shadow, #a29bfe);padding:5px 20px;font-size:.8rem;font-weight:500;border-radius:5px;transition:all ease .1s;display:inline-flex;align-items:center;gap:.25rem;-webkit-user-select:none;user-select:none}:is(button.svelte-ll0ynk,a.svelte-ll0ynk):active{transform:translateY(3px);box-shadow:0 0 0 0 var(--shadow, #a29bfe)}:is(button.svelte-ll0ynk,a.svelte-ll0ynk):disabled{pointer-events:none;opacity:50%} ");

  class GlobalState {
    #site;
    get site() {
      if (!this.#site) {
        const hostname = window.location.hostname;
        this.#site = hostname === "leetcode.cn" ? "cn" : "global";
      }
      return this.#site;
    }
  }
  const globalState = new GlobalState();
  var _GM_getResourceText = (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var _monkeyWindow = (() => window)();
  class FinderTimeoutError extends Error {
    name = this.constructor.name;
    constructor(item, timeout) {
      super();
      this.message = `"${item}" not found within timeout (${timeout}ms)`;
    }
  }
  function find(finderFn, {
    subject = document,
    observerOption = {
      childList: true,
      subtree: true
    },
    timeout = 5e3,
    itemName = "Item"
  }) {
    return new Promise((resolve, reject) => {
      const item = finderFn();
      if (item) return resolve(item);
      let timeoutId;
      const observer = new MutationObserver(() => {
        const item2 = finderFn();
        if (item2) {
          observer.disconnect();
          clearTimeout(timeoutId);
          return resolve(item2);
        }
      });
      observer.observe(subject, observerOption);
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          observer.disconnect();
          const error = new FinderTimeoutError(itemName, timeout);
          console.error(error);
          return reject(error);
        }, timeout);
      }
    });
  }
  async function findElement(selector, {
    finderType = "css",
    parent = document,
    timeout = 500,
    additionalRule
  } = {}) {
    const element = await find(
      () => {
        const el = finderType === "css" ? parent.querySelector(selector) : document.evaluate(
          selector,
          parent,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        if (additionalRule && el) {
          return additionalRule(el) ? el : null;
        } else {
          return el;
        }
      },
      {
        subject: parent,
        timeout,
        itemName: `Element ${selector}`
      }
    );
    return element;
  }
  function addIntellisense(editor) {
    const overrideOptions = {
      "bracketPairColorization.enabled": true,
      hover: { enabled: true },
      parameterHints: { enabled: true },
      quickSuggestions: true,
      selectionHighlight: true,
      suggest: {
        filterGraceful: true,
        preview: true,
        showColors: true,
        showConstants: true,
        showConstructors: true,
        showDeprecated: true,
        showEnumMembers: true,
        showEnums: true,
        showEvents: true,
        showFields: true,
        showFiles: true,
        showFolders: true,
        showFunctions: true,
        showIcons: true,
        showInterfaces: true,
        showIssues: true,
        showKeywords: true,
        showMethods: true,
        showModules: true,
        showOperators: true,
        showReferences: true,
        showSnippets: true,
        showStatusBar: true,
        showStructs: true,
        showTypeParameters: true,
        showUnits: true,
        showUsers: true,
        showValues: true,
        showVariables: true,
        showWords: true
      },
      suggestOnTriggerCharacters: true
    };
    editor.updateOptions(overrideOptions);
  }
  async function findMonacoEditor() {
    function getEditor() {
      return _unsafeWindow.monaco?.editor.getEditors().at(0);
    }
    const editor = await find(getEditor, {
      subject: document.head,
      observerOption: { childList: true },
      itemName: "Monaco Editor"
    });
    return editor;
  }
  var $ = Object.defineProperty;
  var b = (o) => {
    throw TypeError(o);
  };
  var B = (o, e2, t2) => e2 in o ? $(o, e2, { enumerable: true, configurable: true, writable: true, value: t2 }) : o[e2] = t2;
  var p = (o, e2, t2) => B(o, typeof e2 != "symbol" ? e2 + "" : e2, t2), v$1 = (o, e2, t2) => e2.has(o) || b("Cannot " + t2);
  var r$2 = (o, e2, t2) => (v$1(o, e2, "read from private field"), t2 ? t2.call(o) : e2.get(o)), f = (o, e2, t2) => e2.has(o) ? b("Cannot add the same private member more than once") : e2 instanceof WeakSet ? e2.add(o) : e2.set(o, t2), x = (o, e2, t2, s) => (v$1(o, e2, "write to private field"), e2.set(o, t2), t2), a = (o, e2, t2) => (v$1(o, e2, "access private method"), t2);
  const j = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert-icon lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
    loading: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'
  }, A = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  class T extends HTMLElement {
    constructor(t2, s) {
      super();
      p(this, "config");
      p(this, "rack");
      this.config = t2, this.rack = s;
    }
    render() {
      const { type: t2, title: s, message: n2, dismissible: d, unstyled: u, id: h } = this.config;
      if (this.className = `toast ${t2 || ""}`, this.dataset.styled = u ? "false" : "true", this.style.cssText = this.config.style || "", h && (this.id = h), n2 instanceof HTMLElement) {
        const m = document.createElement("slot");
        this.append(m), this.rack.append(n2), m.assign(n2);
      } else typeof n2 == "string" && (this.innerHTML = String.raw`
            ${t2 ? `<div class="toast-icon">${j[t2]}</div>` : ""}
            <div class="toast-content">
                ${s ? `<p class="toast-title">${s}</p>` : ""}
                <p class="toast-message">${n2}</p>
            </div>
            `, d && this.append(this.dismissButton));
    }
connectedCallback() {
      this.render(), setTimeout(() => this.classList.add("visible"), 0);
    }
    update(t2) {
      this.config = { ...this.config, ...t2 }, this.render(), this.classList.add("visible");
    }
    removeAfterAnimation() {
      this.classList.remove("visible"), this.addEventListener("transitionend", () => this.remove(), {
        once: true
      });
    }
    get dismissButton() {
      const t2 = document.createElement("template");
      return t2.innerHTML = String.raw`<button class="toast-close" aria-label="Close toast" type="button" data-action="dismiss">${A}</button>`, t2.content.firstElementChild;
    }
  }
  const H$1 = "*{box-sizing:border-box;margin:0;padding:0}.toast-container{inset:unset;border:none;background-color:transparent;overflow:clip;overflow-clip-margin:12px;display:flex;width:100%;max-width:360px;interpolate-size:allow-keywords;transition:.5s cubic-bezier(.215,.61,.355,1);transition-property:transform,translate;--space-to-screen: 20px}.toast-container.top{transform:translateY(var(--space-to-screen));flex-direction:column;--toast-initial-transform: translateY(-100%)}.toast-container.bottom{transform:translateY(calc(100vh - 100%));flex-direction:column-reverse;--toast-initial-transform: translateY(100%)}.toast-container.left{translate:calc(0% + var(--space-to-screen))}.toast-container.center{translate:calc(50vw - 50%)}.toast-container.right{translate:calc(100vw - 100% - var(--space-to-screen))}.toast{opacity:0;transition:all .5s cubic-bezier(.215,.61,.355,1);transform:var(--toast-initial-transform);height:0;overflow:hidden;margin-bottom:0;filter:blur(10px)}.toast.visible{opacity:1;transform:translateY(0);height:auto;filter:none;overflow:visible;margin-bottom:12px}.toast[data-styled=true]{display:flex;align-items:center;gap:12px;border-radius:8px;box-shadow:0 4px 12px #00000026;border-left:4px solid var(--accent-color);--background-color: white;--message-color: #333333;background-color:var(--background-color);color:var(--message-color)}@media (prefers-color-scheme: dark){.toast[data-styled=true]{--background-color: #333333;--message-color: #f0f0f0}}.toast[data-styled=true].visible{padding:16px}.toast[data-styled=true] .toast-icon{color:var(--accent-color);width:1.5rem;height:1.5rem;flex:none}.toast[data-styled=true] .toast-title{color:var(--accent-color);font-weight:600;font-size:1.125rem}.toast[data-styled=true] .toast-close{background:none;border:none;color:#999;cursor:pointer;line-height:1;width:1.5rem;height:1.5rem;flex:none}.toast-content{flex-grow:1}.toast.success{--accent-color: #4caf50}.toast.error{--accent-color: #f44336}.toast.info{--accent-color: #2196f3}.toast.warning{--accent-color: #ff9800}.toast.loading{--accent-color: var(--message-color)}.toast.loading>.toast-icon>svg{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}";
  var c;
  let M$1 = class M extends HTMLElement {
    constructor(t2 = "top-right") {
      super();
      f(this, c);
      x(this, c, document.createElement("div")), this.changePosition(t2);
    }
    connectedCallback() {
      const t2 = this.attachShadow({
        mode: "open",
        slotAssignment: "manual"
      }), s = document.createElement("style");
      s.textContent = H$1, t2.append(s), r$2(this, c).popover = "manual", t2.append(r$2(this, c)), r$2(this, c).showPopover();
    }
    changePosition(t2) {
      r$2(this, c).className = `toast-container ${t2.replace("-", " ")}`;
    }
    appendToast(t2) {
      r$2(this, c).append(t2);
    }
    get toasts() {
      return r$2(this, c).children;
    }
  };
  c = new WeakMap();
  function k$1(o, e2) {
    return typeof o == "function" ? o(e2) : o;
  }
  function C(o, e2) {
    customElements.get(o) || customElements.define(o, e2);
  }
  var l, i, E, L, y$1, w, g$1;
  class I {
    constructor(e2) {
      f(this, i);
      p(this, "defaultOptions", {
        durationMs: 5e3,
        dismissible: true,
        position: "top-right"
      });
      f(this, l);
      p(this, "toastTimeoutMap", new Map());
      p(this, "count", 0);
      C("toast-rack", M$1), C("toast-element", T), this.defaultOptions = { ...this.defaultOptions, ...e2 }, x(this, l, a(this, i, L).call(this, this.defaultOptions.position));
    }
    changePosition(e2) {
      r$2(this, l).changePosition(e2);
    }
    get isEmpty() {
      return r$2(this, l).toasts.length === 0;
    }
    dismissAll() {
      this.toastTimeoutMap.forEach((e2, t2) => this.dismiss(t2)), this.toastTimeoutMap.clear(), r$2(this, l).innerHTML = "";
    }
dismiss(e2) {
      const t2 = a(this, i, y$1).call(this, e2);
      if (!t2) {
        console.error("No toast found to dismiss with id:", e2);
        return;
      }
      const s = this.toastTimeoutMap.get(e2);
      s && (clearTimeout(s), this.toastTimeoutMap.delete(e2)), t2.removeAfterAnimation();
    }
toast(e2, t2 = {}) {
      return a(this, i, w).call(this, { ...t2, message: e2 });
    }
custom(e2, t2 = {}) {
      return a(this, i, w).call(this, { ...t2, message: e2, unstyled: true });
    }
    success(e2, t2) {
      return a(this, i, g$1).call(this, "success", { ...t2, message: e2 });
    }
    error(e2, t2) {
      return a(this, i, g$1).call(this, "error", { ...t2, message: e2 });
    }
    info(e2, t2) {
      return a(this, i, g$1).call(this, "info", { ...t2, message: e2 });
    }
    warning(e2, t2) {
      return a(this, i, g$1).call(this, "warning", { ...t2, message: e2 });
    }
loading(e2, t2) {
      return a(this, i, g$1).call(this, "loading", {
        durationMs: 1 / 0,
        dismissible: false,
        ...t2,
        message: e2
      });
    }
async promise(e2, t2, s = {}) {
      var u;
      const n2 = this.loading(t2.loading, {
        durationMs: 1 / 0,
...s
      }), d = k$1(e2);
      try {
        const h = await d, m = k$1(t2.success, h);
        this.success(m, { id: n2, ...s });
      } catch (h) {
        const m = k$1(t2.error, h);
        this.error(m, { id: n2, ...s });
      } finally {
        (u = t2.finally) == null || u.call(t2);
      }
      return n2;
    }
  }
  l = new WeakMap(), i = new WeakSet(), E = function() {
    return this.count++, `toast-${this.count}`;
  }, L = function(e2) {
    const t2 = document.querySelector("toast-rack");
    if (t2)
      return console.warn(
        "Toast container already exists. Using the existing one."
      ), t2;
    const s = new M$1(e2);
    return document.body.append(s), s;
  }, y$1 = function(e2) {
    return r$2(this, l).toasts.namedItem(e2);
  },
w = function(e2) {
    const t2 = {
      ...this.defaultOptions,
      ...e2,
      message: e2.message || ""
    };
    let s = null;
    const { id: n2, ...d } = t2;
    return n2 && (s = a(this, i, y$1).call(this, n2), s ? s.update(d) : console.warn(
      `Toast with id ${n2} not found, creating a new one.`
    )), s || (s = new T(
      { ...d, id: a(this, i, E).call(this) },
      r$2(this, l)
    ), r$2(this, l).appendToast(s)), t2.durationMs !== 1 / 0 && (clearTimeout(this.toastTimeoutMap.get(s.id)), this.toastTimeoutMap.set(
      s.id,
      setTimeout(() => this.dismiss(s.id), t2.durationMs)
    )), s.addEventListener("click", (u) => {
      u.target.closest("[data-action='dismiss']") && this.dismiss(s.id);
    }), s.id;
  }, g$1 = function(e2, t2) {
    return a(this, i, w).call(this, {
      ...t2,
      type: e2,
      title: t2.title ?? this.defaultOptions.title ?? e2[0].toUpperCase() + e2.slice(1)
    });
  };
  const CONFIG = {
    APP_NAME: "LeetCode Toolkit",
    EDITORIAL_READER_URL: "https://leetcode-editorial-reader.vercel.app"
  };
  const toaster = new I({
    title: CONFIG.APP_NAME,
    position: "top-center"
  });
  class ProblemPageState {
    editor = null;
slug = null;
    async patchMonacoEditor() {
      this.editor = await findMonacoEditor();
      this.enableFormatOnSave();
      addIntellisense(this.editor);
    }
    enableFormatOnSave() {
      document.addEventListener("keydown", async (e2) => {
        if (!(e2.ctrlKey && e2.key === "s")) return;
        try {
          await this.editor?.getAction("editor.action.formatDocument")?.run();
        } catch (err) {
          console.error(err);
          if (err instanceof Error) {
            toaster.error("Failed to format code:" + err.message);
          }
        }
      });
    }
  }
  const problemState = new ProblemPageState();
  function e$2(e2, t2, n2) {
    let r2 = (n3) => e2(n3, ...t2);
    return r2;
  }
  function t$1(t2, n2, r2) {
    let i2 = t2.length - n2.length;
    if (i2 === 0) return t2(...n2);
    if (i2 === 1) return e$2(t2, n2);
    throw Error(`Wrong number of arguments`);
  }
  function e$1(e2) {
    return e2 instanceof Promise;
  }
  const e = `	.
.\v.\f.\r. .. . . . . . . . . . . . . .\u2028.\u2029. . .　.\uFEFF`.split(`.`), t = new Set([`-`, `_`, ...e]), n$1 = (e2) => {
    let n2 = [], r2 = ``, i2 = () => {
      r2.length > 0 && (n2.push(r2), r2 = ``);
    };
    for (let n3 of e2) {
      if (t.has(n3)) {
        i2();
        continue;
      }
      if (/[a-z]$/u.test(r2) && /[A-Z]/u.test(n3)) i2();
      else if (/[A-Z][A-Z]$/u.test(r2) && /[a-z]/u.test(n3)) {
        let e3 = r2.slice(-1);
        r2 = r2.slice(0, -1), i2(), r2 = e3;
      } else /\d$/u.test(r2) !== /\d/u.test(n3) && i2();
      r2 += n3;
    }
    return i2(), n2;
  };
  function n(...t2) {
    return t$1(r$1, t2);
  }
  const r$1 = (e2) => n$1(e2).join(`-`).toLowerCase();
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  const noop = () => {
  };
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i2 = 0; i2 < arr.length; i2++) {
      arr[i2]();
    }
  }
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const UNOWNED = 1 << 8;
  const DISCONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const INSPECT_EFFECT = 1 << 17;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_PRESERVED = 1 << 19;
  const USER_EFFECT = 1 << 20;
  const REACTION_IS_UPDATING = 1 << 21;
  const ASYNC = 1 << 22;
  const ERROR_VALUE = 1 << 23;
  const STATE_SYMBOL = Symbol("$state");
  const LEGACY_PROPS = Symbol("legacy props");
  const LOADING_ATTR_SYMBOL = Symbol("");
  const STALE_REACTION = new class StaleReactionError extends Error {
    name = "StaleReactionError";
    message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
  }();
  function await_outside_boundary() {
    {
      throw new Error(`https://svelte.dev/e/await_outside_boundary`);
    }
  }
  function async_derived_orphan() {
    {
      throw new Error(`https://svelte.dev/e/async_derived_orphan`);
    }
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function props_invalid_value(key) {
    {
      throw new Error(`https://svelte.dev/e/props_invalid_value`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  const PROPS_IS_IMMUTABLE = 1;
  const PROPS_IS_RUNES = 1 << 1;
  const PROPS_IS_UPDATED = 1 << 2;
  const PROPS_IS_BINDABLE = 1 << 3;
  const PROPS_IS_LAZY_INITIAL = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  const ATTACHMENT_KEY = "@attach";
  function select_multiple_invalid_value() {
    {
      console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
    }
  }
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a2, b2) {
    return a2 != a2 ? b2 == b2 : a2 !== b2 || a2 !== null && typeof a2 === "object" || typeof a2 === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  let legacy_mode_flag = false;
  let tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      c: null,
      e: null,
      s: props,
      x: null,
      l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
    };
  }
  function pop(component) {
    var context = (
component_context
    );
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    component_context = context.p;
    return (
{}
    );
  }
  function is_runes() {
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
  }
  const adjustments = new WeakMap();
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if ((effect2.f & EFFECT_RAN) === 0) {
      if ((effect2.f & BOUNDARY_EFFECT) === 0) {
        if (!effect2.parent && error instanceof Error) {
          apply_adjustments(error);
        }
        throw error;
      }
      effect2.b.error(error);
    } else {
      invoke_error_boundary(error, effect2);
    }
  }
  function invoke_error_boundary(error, effect2) {
    while (effect2 !== null) {
      if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
        try {
          effect2.b.error(error);
          return;
        } catch (e2) {
          error = e2;
        }
      }
      effect2 = effect2.parent;
    }
    if (error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  function apply_adjustments(error) {
    const adjusted = adjustments.get(error);
    if (adjusted) {
      define_property(error, "message", {
        value: adjusted.message
      });
      define_property(error, "stack", {
        value: adjusted.stack
      });
    }
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks2 = micro_tasks;
    micro_tasks = [];
    run_all(tasks2);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0) {
      queueMicrotask(run_micro_tasks);
    }
    micro_tasks.push(fn);
  }
  function get_pending_boundary() {
    var boundary = (
active_effect.b
    );
    while (boundary !== null && !boundary.has_pending_snippet()) {
      boundary = boundary.parent;
    }
    if (boundary === null) {
      await_outside_boundary();
    }
    return boundary;
  }
function derived(fn) {
    var flags = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
active_reaction
    ) : null;
    if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags,
      fn,
      reactions: null,
      rv: 0,
      v: (
UNINITIALIZED
      ),
      wv: 0,
      parent: parent_derived ?? active_effect,
      ac: null
    };
    return signal;
  }
function async_derived(fn, location2) {
    let parent = (
active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var boundary = (
parent.b
    );
    var promise = (

void 0
    );
    var signal = source(
UNINITIALIZED
    );
    var prev = null;
    var should_suspend = !active_reaction;
    async_effect(() => {
      try {
        var p2 = fn();
        if (prev) Promise.resolve(p2).catch(() => {
        });
      } catch (error) {
        p2 = Promise.reject(error);
      }
      var r2 = () => p2;
      promise = prev?.then(r2, r2) ?? Promise.resolve(p2);
      prev = promise;
      var batch = (
current_batch
      );
      var pending = boundary.pending;
      if (should_suspend) {
        boundary.update_pending_count(1);
        if (!pending) batch.increment();
      }
      const handler = (value, error = void 0) => {
        prev = null;
        if (!pending) batch.activate();
        if (error) {
          if (error !== STALE_REACTION) {
            signal.f |= ERROR_VALUE;
            internal_set(signal, error);
          }
        } else {
          if ((signal.f & ERROR_VALUE) !== 0) {
            signal.f ^= ERROR_VALUE;
          }
          internal_set(signal, value);
        }
        if (should_suspend) {
          boundary.update_pending_count(-1);
          if (!pending) batch.decrement();
        }
        unset_context();
      };
      promise.then(handler, (e2) => handler(null, e2 || "unknown"));
      if (batch) {
        return () => {
          queueMicrotask(() => batch.neuter());
        };
      }
    });
    return new Promise((fulfil) => {
      function next(p2) {
        function go() {
          if (p2 === promise) {
            fulfil(signal);
          } else {
            next(promise);
          }
        }
        p2.then(go, go);
      }
      next(promise);
    });
  }
function derived_safe_equal(fn) {
    const signal = derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i2 = 0; i2 < effects.length; i2 += 1) {
        destroy_effect(
effects[i2]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (
parent
        );
      }
      parent = parent.parent;
    }
    return null;
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(get_derived_parent_effect(derived2));
    {
      try {
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
    if (is_destroying_effect) {
      return;
    }
    {
      var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
      set_signal_status(derived2, status);
    }
  }
  function flatten(sync, async, fn) {
    const d = is_runes() ? derived : derived_safe_equal;
    if (async.length === 0) {
      fn(sync.map(d));
      return;
    }
    var batch = current_batch;
    var parent = (
active_effect
    );
    var restore = capture();
    var boundary = get_pending_boundary();
    Promise.all(async.map((expression) => async_derived(expression))).then((result) => {
      batch?.activate();
      restore();
      try {
        fn([...sync.map(d), ...result]);
      } catch (error) {
        if ((parent.f & DESTROYED) === 0) {
          invoke_error_boundary(error, parent);
        }
      }
      batch?.deactivate();
      unset_context();
    }).catch((error) => {
      boundary.error(error);
    });
  }
  function capture() {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    var previous_batch = current_batch;
    return function restore() {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
      previous_batch?.activate();
    };
  }
  function unset_context() {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
  }
  const batches = new Set();
  let current_batch = null;
  let effect_pending_updates = new Set();
  let tasks = [];
  function dequeue() {
    const task = (
tasks.shift()
    );
    if (tasks.length > 0) {
      queueMicrotask(dequeue);
    }
    task();
  }
  let queued_root_effects = [];
  let last_scheduled_effect = null;
  let is_flushing = false;
  class Batch {
current = new Map();
#previous = new Map();
#callbacks = new Set();
#pending = 0;
#deferred = null;
#neutered = false;
#async_effects = [];
#boundary_async_effects = [];
#render_effects = [];
#effects = [];
#block_effects = [];
#dirty_effects = [];
#maybe_dirty_effects = [];
skipped_effects = new Set();
process(root_effects) {
      queued_root_effects = [];
      for (const root2 of root_effects) {
        this.#traverse_effect_tree(root2);
      }
      if (this.#async_effects.length === 0 && this.#pending === 0) {
        this.#commit();
        var render_effects = this.#render_effects;
        var effects = this.#effects;
        this.#render_effects = [];
        this.#effects = [];
        this.#block_effects = [];
        current_batch = null;
        flush_queued_effects(render_effects);
        flush_queued_effects(effects);
        if (current_batch === null) {
          current_batch = this;
        } else {
          batches.delete(this);
        }
        this.#deferred?.resolve();
      } else {
        this.#defer_effects(this.#render_effects);
        this.#defer_effects(this.#effects);
        this.#defer_effects(this.#block_effects);
      }
      for (const effect2 of this.#async_effects) {
        update_effect(effect2);
      }
      for (const effect2 of this.#boundary_async_effects) {
        update_effect(effect2);
      }
      this.#async_effects = [];
      this.#boundary_async_effects = [];
    }
#traverse_effect_tree(root2) {
      root2.f ^= CLEAN;
      var effect2 = root2.first;
      while (effect2 !== null) {
        var flags = effect2.f;
        var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
        var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
        var skip = is_skippable_branch || (flags & INERT) !== 0 || this.skipped_effects.has(effect2);
        if (!skip && effect2.fn !== null) {
          if (is_branch) {
            effect2.f ^= CLEAN;
          } else if ((flags & EFFECT) !== 0) {
            this.#effects.push(effect2);
          } else if ((flags & CLEAN) === 0) {
            if ((flags & ASYNC) !== 0) {
              var effects = effect2.b?.pending ? this.#boundary_async_effects : this.#async_effects;
              effects.push(effect2);
            } else if (is_dirty(effect2)) {
              if ((effect2.f & BLOCK_EFFECT) !== 0) this.#block_effects.push(effect2);
              update_effect(effect2);
            }
          }
          var child2 = effect2.first;
          if (child2 !== null) {
            effect2 = child2;
            continue;
          }
        }
        var parent = effect2.parent;
        effect2 = effect2.next;
        while (effect2 === null && parent !== null) {
          effect2 = parent.next;
          parent = parent.parent;
        }
      }
    }
#defer_effects(effects) {
      for (const e2 of effects) {
        const target = (e2.f & DIRTY) !== 0 ? this.#dirty_effects : this.#maybe_dirty_effects;
        target.push(e2);
        set_signal_status(e2, CLEAN);
      }
      effects.length = 0;
    }
capture(source2, value) {
      if (!this.#previous.has(source2)) {
        this.#previous.set(source2, value);
      }
      this.current.set(source2, source2.v);
    }
    activate() {
      current_batch = this;
    }
    deactivate() {
      current_batch = null;
      for (const update of effect_pending_updates) {
        effect_pending_updates.delete(update);
        update();
        if (current_batch !== null) {
          break;
        }
      }
    }
    neuter() {
      this.#neutered = true;
    }
    flush() {
      if (queued_root_effects.length > 0) {
        flush_effects();
      } else {
        this.#commit();
      }
      if (current_batch !== this) {
        return;
      }
      if (this.#pending === 0) {
        batches.delete(this);
      }
      this.deactivate();
    }
#commit() {
      if (!this.#neutered) {
        for (const fn of this.#callbacks) {
          fn();
        }
      }
      this.#callbacks.clear();
    }
    increment() {
      this.#pending += 1;
    }
    decrement() {
      this.#pending -= 1;
      if (this.#pending === 0) {
        for (const e2 of this.#dirty_effects) {
          set_signal_status(e2, DIRTY);
          schedule_effect(e2);
        }
        for (const e2 of this.#maybe_dirty_effects) {
          set_signal_status(e2, MAYBE_DIRTY);
          schedule_effect(e2);
        }
        this.#render_effects = [];
        this.#effects = [];
        this.flush();
      } else {
        this.deactivate();
      }
    }
add_callback(fn) {
      this.#callbacks.add(fn);
    }
    settled() {
      return (this.#deferred ??= deferred()).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = current_batch = new Batch();
        batches.add(current_batch);
        {
          Batch.enqueue(() => {
            if (current_batch !== batch) {
              return;
            }
            batch.flush();
          });
        }
      }
      return current_batch;
    }
static enqueue(task) {
      if (tasks.length === 0) {
        queueMicrotask(dequeue);
      }
      tasks.unshift(task);
    }
  }
  function flush_effects() {
    var was_updating_effect = is_updating_effect;
    is_flushing = true;
    try {
      var flush_count = 0;
      set_is_updating_effect(true);
      while (queued_root_effects.length > 0) {
        var batch = Batch.ensure();
        if (flush_count++ > 1e3) {
          var updates, entry;
          if (DEV) ;
          infinite_loop_guard();
        }
        batch.process(queued_root_effects);
        old_values.clear();
      }
    } finally {
      is_flushing = false;
      set_is_updating_effect(was_updating_effect);
      last_scheduled_effect = null;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      invoke_error_boundary(error, last_scheduled_effect);
    }
  }
  let eager_block_effects = null;
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i2 = 0;
    while (i2 < length) {
      var effect2 = effects[i2++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        eager_block_effects = [];
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
          if (effect2.teardown === null && effect2.ac === null) {
            unlink_effect(effect2);
          } else {
            effect2.fn = null;
          }
        }
        if (eager_block_effects?.length > 0) {
          old_values.clear();
          for (const e2 of eager_block_effects) {
            update_effect(e2);
          }
          eager_block_effects = [];
        }
      }
    }
    eager_block_effects = null;
  }
  function schedule_effect(signal) {
    var effect2 = last_scheduled_effect = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if (is_flushing && effect2 === active_effect && (flags & BLOCK_EFFECT) !== 0) {
        return;
      }
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  const old_values = new Map();
  function source(v2, stack) {
    var signal = {
      f: 0,
v: v2,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
function state(v2, stack) {
    const s = source(v2);
    push_reaction_value(s);
    return s;
  }
function mutable_source(initial_value, immutable = false, trackable = true) {
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
      (component_context.l.s ??= []).push(s);
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null &&

(!untracking || (active_reaction.f & INSPECT_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | INSPECT_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      var old_value = source2.v;
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else {
        old_values.set(source2, old_value);
      }
      source2.v = value;
      var batch = Batch.ensure();
      batch.capture(source2, old_value);
      if ((source2.f & DERIVED) !== 0) {
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(
source2
          );
        }
        set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
    }
    return value;
  }
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i2 = 0; i2 < length; i2++) {
      var reaction = reactions[i2];
      var flags = reaction.f;
      if (!runes && reaction === active_effect) continue;
      var not_dirty = (flags & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags & DERIVED) !== 0) {
        mark_reactions(
reaction,
          MAYBE_DIRTY
        );
      } else if (not_dirty) {
        if ((flags & BLOCK_EFFECT) !== 0) {
          if (eager_block_effects !== null) {
            eager_block_effects.push(
reaction
            );
          }
        }
        schedule_effect(
reaction
        );
      }
    }
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = new Map();
    var is_proxied_array = is_array(value);
    var version = state(0);
    var parent_version = update_version;
    var with_parent = (fn) => {
      if (update_version === parent_version) {
        return fn();
      }
      var reaction = active_reaction;
      var version2 = update_version;
      set_active_reaction(null);
      set_update_version(parent_version);
      var result = fn();
      set_active_reaction(reaction);
      set_update_version(version2);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", state(
value.length
      ));
    }
    return new Proxy(
value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop2);
          if (s === void 0) {
            s = with_parent(() => {
              var s2 = state(descriptor.value);
              sources.set(prop2, s2);
              return s2;
            });
          } else {
            set(s, descriptor.value, true);
          }
          return true;
        },
        deleteProperty(target, prop2) {
          var s = sources.get(prop2);
          if (s === void 0) {
            if (prop2 in target) {
              const s2 = with_parent(() => state(UNINITIALIZED));
              sources.set(prop2, s2);
              increment(version);
            }
          } else {
            set(s, UNINITIALIZED);
            increment(version);
          }
          return true;
        },
        get(target, prop2, receiver) {
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          var s = sources.get(prop2);
          var exists = prop2 in target;
          if (s === void 0 && (!exists || get_descriptor(target, prop2)?.writable)) {
            s = with_parent(() => {
              var p2 = proxy(exists ? target[prop2] : UNINITIALIZED);
              var s2 = state(p2);
              return s2;
            });
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v2 = get(s);
            return v2 === UNINITIALIZED ? void 0 : v2;
          }
          return Reflect.get(target, prop2, receiver);
        },
        getOwnPropertyDescriptor(target, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop2);
            if (s) descriptor.value = get(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2?.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop2) {
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop2);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop2);
          if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop2)?.writable)) {
            if (s === void 0) {
              s = with_parent(() => {
                var p2 = has ? proxy(target[prop2]) : UNINITIALIZED;
                var s2 = state(p2);
                return s2;
              });
              sources.set(prop2, s);
            }
            var value2 = get(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop2, value2, receiver) {
          var s = sources.get(prop2);
          var has = prop2 in target;
          if (is_proxied_array && prop2 === "length") {
            for (var i2 = value2; i2 <
s.v; i2 += 1) {
              var other_s = sources.get(i2 + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i2 in target) {
                other_s = with_parent(() => state(UNINITIALIZED));
                sources.set(i2 + "", other_s);
              }
            }
          }
          if (s === void 0) {
            if (!has || get_descriptor(target, prop2)?.writable) {
              s = with_parent(() => state(void 0));
              set(s, proxy(value2));
              sources.set(prop2, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            var p2 = with_parent(() => proxy(value2));
            set(s, p2);
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor?.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
sources.get("length")
              );
              var n2 = Number(prop2);
              if (Number.isInteger(n2) && n2 >= ls.v) {
                set(ls, n2 + 1);
              }
            }
            increment(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  function get_proxied_value(value) {
    try {
      if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
        return value[STATE_SYMBOL];
      }
    } catch {
    }
    return value;
  }
  function is(a2, b2) {
    return Object.is(get_proxied_value(a2), get_proxied_value(b2));
  }
  var $window;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype.__click = void 0;
      element_prototype.__className = void 0;
      element_prototype.__attributes = null;
      element_prototype.__style = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype.__t = void 0;
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
function get_first_child(node) {
    return first_child_getter.call(node);
  }
function get_next_sibling(node) {
    return next_sibling_getter.call(node);
  }
  function child(node, is_text) {
    {
      return get_first_child(node);
    }
  }
  function first_child(fragment, is_text) {
    {
      var first = (

get_first_child(
fragment
        )
      );
      if (first instanceof Comment && first.data === "") return get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling =

get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function autofocus(dom, value) {
    if (value) {
      const body = document.body;
      dom.autofocus = true;
      queue_micro_task(() => {
        if (document.activeElement === body) {
          dom.focus();
        }
      });
    }
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0 && active_effect === null) {
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn, sync, push2 = true) {
    var parent = active_effect;
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      transitions: null,
      wv: 0,
      ac: null
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e3) {
        destroy_effect(effect2);
        throw e3;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    if (push2) {
      var e2 = effect2;
      if (sync && e2.deps === null && e2.teardown === null && e2.nodes_start === null && e2.first === e2.last &&
(e2.f & EFFECT_PRESERVED) === 0) {
        e2 = e2.first;
      }
      if (e2 !== null) {
        e2.parent = parent;
        if (parent !== null) {
          push_effect(e2, parent);
        }
        if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
          var derived2 = (
active_reaction
          );
          (derived2.effects ??= []).push(e2);
        }
      }
    }
    return effect2;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var flags = (
active_effect.f
    );
    var defer = !active_reaction && (flags & BRANCH_EFFECT) !== 0 && (flags & EFFECT_RAN) === 0;
    if (defer) {
      var context = (
component_context
      );
      (context.e ??= []).push(fn);
    } else {
      return create_user_effect(fn);
    }
  }
  function create_user_effect(fn) {
    return create_effect(EFFECT | USER_EFFECT, fn, false);
  }
  function user_pre_effect(fn) {
    validate_effect();
    return create_effect(RENDER_EFFECT | USER_EFFECT, fn, true);
  }
  function component_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function async_effect(fn) {
    return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
  }
  function render_effect(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | flags, fn, true);
  }
  function template_effect(fn, sync = [], async = []) {
    flatten(sync, async, (values) => {
      create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
    });
  }
  function block(fn, flags = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags, fn, true);
    return effect2;
  }
  function branch(fn, push2 = true) {
    return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      const controller = effect2.ac;
      if (controller !== null) {
        without_reactive_context(() => {
          controller.abort(STALE_REACTION);
        });
      }
      var next = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null && effect2.nodes_end !== null) {
      remove_effect_dom(
        effect2.nodes_start,
effect2.nodes_end
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.transitions;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = effect2.ac = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : (

get_next_sibling(node)
      );
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next = effect2.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    run_out_transitions(transitions, () => {
      destroy_effect(effect2);
      if (callback) callback();
    });
  }
  function run_out_transitions(transitions, fn) {
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      set_signal_status(effect2, DIRTY);
      schedule_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  let is_updating_effect = false;
  function set_is_updating_effect(value) {
    is_updating_effect = value;
  }
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let current_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && true) {
      if (current_sources === null) {
        current_sources = [value];
      } else {
        current_sources.push(value);
      }
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let update_version = read_version;
  function set_update_version(value) {
    update_version = value;
  }
  let skip_reaction = false;
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i2;
        var dependency;
        var is_disconnected = (flags & DISCONNECTED) !== 0;
        var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
        var length = dependencies.length;
        if ((is_disconnected || is_unowned_connected) && (active_effect === null || (active_effect.f & DESTROYED) === 0)) {
          var derived2 = (
reaction
          );
          var parent = derived2.parent;
          for (i2 = 0; i2 < length; i2++) {
            dependency = dependencies[i2];
            if (is_disconnected || !dependency?.reactions?.includes(derived2)) {
              (dependency.reactions ??= []).push(derived2);
            }
          }
          if (is_disconnected) {
            derived2.f ^= DISCONNECTED;
          }
          if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
            derived2.f ^= UNOWNED;
          }
        }
        for (i2 = 0; i2 < length; i2++) {
          dependency = dependencies[i2];
          if (is_dirty(
dependency
          )) {
            update_derived(
dependency
            );
          }
          if (dependency.wv > reaction.wv) {
            return true;
          }
        }
      }
      if (!is_unowned || active_effect !== null && !skip_reaction) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (current_sources?.includes(signal)) {
      return;
    }
    for (var i2 = 0; i2 < reactions.length; i2++) {
      var reaction = reactions[i2];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags = reaction.f;
    new_deps =
null;
    skipped_deps = 0;
    untracked_writes = null;
    skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
    active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      without_reactive_context(() => {
        reaction.ac.abort(STALE_REACTION);
      });
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var fn = (
reaction.fn
      );
      var result = fn();
      var deps = reaction.deps;
      if (new_deps !== null) {
        var i2;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i2 = 0; i2 < new_deps.length; i2++) {
            deps[skipped_deps + i2] = new_deps[i2];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (!skip_reaction ||
(flags & DERIVED) !== 0 &&
reaction.reactions !== null) {
          for (i2 = skipped_deps; i2 < deps.length; i2++) {
            (deps[i2].reactions ??= []).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i2 = 0; i2 <
untracked_writes.length; i2++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i2],
reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(...
untracked_writes);
          }
        }
      }
      if ((reaction.f & ERROR_VALUE) !== 0) {
        reaction.f ^= ERROR_VALUE;
      }
      return result;
    } catch (error) {
      return handle_error(error);
    } finally {
      reaction.f ^= REACTION_IS_UPDATING;
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      current_sources = previous_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      update_version = previous_update_version;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index = index_of.call(reactions, signal);
      if (index !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 &&


(new_deps === null || !new_deps.includes(dependency))) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      destroy_derived_effects(
dependency
      );
      remove_reactions(
dependency,
        0
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i2 = start_index; i2 < dependencies.length; i2++) {
      remove_reaction(signal, dependencies[i2]);
    }
  }
  function update_effect(effect2) {
    var flags = effect2.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags & BLOCK_EFFECT) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      var dep;
      if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) ;
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  function get(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (!destroyed && !current_sources?.includes(signal)) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else if (!skip_reaction || !new_deps.includes(signal)) {
              new_deps.push(signal);
            }
          }
        } else {
          (active_reaction.deps ??= []).push(signal);
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!reactions.includes(active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    } else if (is_derived &&
signal.deps === null &&
signal.effects === null) {
      var derived2 = (
signal
      );
      var parent = derived2.parent;
      if (parent !== null && (parent.f & UNOWNED) === 0) {
        derived2.f ^= UNOWNED;
      }
    }
    if (is_destroying_effect) {
      if (old_values.has(signal)) {
        return old_values.get(signal);
      }
      if (is_derived) {
        derived2 =
signal;
        var value = derived2.v;
        if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
    } else if (is_derived) {
      derived2 =
signal;
      if (is_dirty(derived2)) {
        update_derived(derived2);
      }
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function depends_on_old_values(derived2) {
    if (derived2.v === UNINITIALIZED) return true;
    if (derived2.deps === null) return false;
    for (const dep of derived2.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
dep
      )) {
        return true;
      }
    }
    return false;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function deep_read_state(value) {
    if (typeof value !== "object" || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key in value) {
        const prop2 = value[key];
        if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
          deep_read(prop2);
        }
      }
    }
  }
  function deep_read(value, visited = new Set()) {
    if (typeof value === "object" && value !== null &&
!(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e2) {
        }
      }
      const proto = get_prototype_of(value);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
        const descriptors = get_descriptors(proto);
        for (let key in descriptors) {
          const get2 = descriptors[key].get;
          if (get2) {
            try {
              get2.call(value);
            } catch (e2) {
            }
          }
        }
      }
    }
  }
  function is_capture_event(name) {
    return name.endsWith("capture") && name !== "gotpointercapture" && name !== "lostpointercapture";
  }
  const DELEGATED_EVENTS = [
    "beforeinput",
    "click",
    "change",
    "dblclick",
    "contextmenu",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "pointerdown",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "touchend",
    "touchmove",
    "touchstart"
  ];
  function is_delegated(event_name) {
    return DELEGATED_EVENTS.includes(event_name);
  }
  const ATTRIBUTE_ALIASES = {
formnovalidate: "formNoValidate",
    ismap: "isMap",
    nomodule: "noModule",
    playsinline: "playsInline",
    readonly: "readOnly",
    defaultvalue: "defaultValue",
    defaultchecked: "defaultChecked",
    srcobject: "srcObject",
    novalidate: "noValidate",
    allowfullscreen: "allowFullscreen",
    disablepictureinpicture: "disablePictureInPicture",
    disableremoteplayback: "disableRemotePlayback"
  };
  function normalize_attribute(name) {
    name = name.toLowerCase();
    return ATTRIBUTE_ALIASES[name] ?? name;
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  const all_registered_events = new Set();
  const root_event_handles = new Set();
  function create_event(event_name, dom, handler, options = {}) {
    function target_handler(event) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event);
      }
      if (!event.cancelBubble) {
        return without_reactive_context(() => {
          return handler?.call(this, event);
        });
      }
    }
    if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
      queue_micro_task(() => {
        dom.addEventListener(event_name, target_handler, options);
      });
    } else {
      dom.addEventListener(event_name, target_handler, options);
    }
    return target_handler;
  }
  function delegate(events) {
    for (var i2 = 0; i2 < events.length; i2++) {
      all_registered_events.add(events[i2]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  let last_propagated_event = null;
  function handle_event_propagation(event) {
    var handler_element = this;
    var owner_document = (
handler_element.ownerDocument
    );
    var event_name = event.type;
    var path = event.composedPath?.() || [];
    var current_target = (
path[0] || event.target
    );
    last_propagated_event = event;
    var path_idx = 0;
    var handled_at = last_propagated_event === event && event.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element ===
window)) {
        event.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target =
path[path_idx] || event.target;
    if (current_target === handler_element) return;
    define_property(event, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode ||
current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated != null && (!
current_target.disabled ||

event.target === current_target)) {
            if (is_array(delegated)) {
              var [fn, ...data] = delegated;
              fn.apply(current_target, [event, ...data]);
            } else {
              delegated.call(current_target, event);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event.__root = handler_element;
      delete event.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function create_fragment_from_html(html) {
    var elem = document.createElement("template");
    elem.innerHTML = html.replaceAll("<!>", "<!---->");
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 = (
active_effect
    );
    if (effect2.nodes_start === null) {
      effect2.nodes_start = start;
      effect2.nodes_end = end;
    }
  }
function from_html(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node =

get_first_child(node);
      }
      var clone = (
use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (

get_first_child(clone)
        );
        var end = (
clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
function from_namespace(content, flags, ns = "svg") {
    var has_start = !content.startsWith("<!>");
    var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
    var node;
    return () => {
      if (!node) {
        var fragment = (
create_fragment_from_html(wrapped)
        );
        var root2 = (

get_first_child(fragment)
        );
        {
          node =

get_first_child(root2);
        }
      }
      var clone = (
node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
function from_svg(content, flags) {
    return from_namespace(content, flags, "svg");
  }
  function text(value = "") {
    {
      var t2 = create_text(value + "");
      assign_nodes(t2, t2);
      return t2;
    }
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
dom
    );
  }
  function set_text(text2, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text2.__t ??= text2.nodeValue)) {
      text2.__t = str;
      text2.nodeValue = str + "";
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const document_listeners = new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = new Set();
    var event_handle = (events2) => {
      for (var i2 = 0; i2 < events2.length; i2++) {
        var event_name = events2[i2];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive });
        var n2 = document_listeners.get(event_name);
        if (n2 === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n2 + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx = (
component_context
          );
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        component = Component(anchor_node, props) || {};
        if (context) {
          pop();
        }
      });
      return () => {
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n2 = (
document_listeners.get(event_name)
          );
          if (--n2 === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n2);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          anchor_node.parentNode?.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount);
    return component;
  }
  let mounted_components = new WeakMap();
  function if_block(node, fn, elseif = false) {
    var anchor = node;
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = UNINITIALIZED;
    var flags = elseif ? EFFECT_TRANSPARENT : 0;
    var has_branch = false;
    const set_branch = (fn2, flag = true) => {
      has_branch = true;
      update_branch(flag, fn2);
    };
    function commit() {
      var active = condition ? consequent_effect : alternate_effect;
      var inactive = condition ? alternate_effect : consequent_effect;
      if (active) {
        resume_effect(active);
      }
      if (inactive) {
        pause_effect(inactive, () => {
          if (condition) {
            alternate_effect = null;
          } else {
            consequent_effect = null;
          }
        });
      }
    }
    const update_branch = (new_condition, fn2) => {
      if (condition === (condition = new_condition)) return;
      var target = anchor;
      if (condition) {
        consequent_effect ??= fn2 && branch(() => fn2(target));
      } else {
        alternate_effect ??= fn2 && branch(() => fn2(target));
      }
      {
        commit();
      }
    };
    block(() => {
      has_branch = false;
      fn(set_branch);
      if (!has_branch) {
        update_branch(null, null);
      }
    }, flags);
  }
  function snippet(node, get_snippet, ...args) {
    var anchor = node;
    var snippet2 = noop;
    var snippet_effect;
    block(() => {
      if (snippet2 === (snippet2 = get_snippet())) return;
      if (snippet_effect) {
        destroy_effect(snippet_effect);
        snippet_effect = null;
      }
      snippet_effect = branch(() => (
snippet2(anchor, ...args)
      ));
    }, EFFECT_TRANSPARENT);
  }
  function attach(node, get_fn) {
    var fn = void 0;
    var e2;
    block(() => {
      if (fn !== (fn = get_fn())) {
        if (e2) {
          destroy_effect(e2);
          e2 = null;
        }
        if (fn) {
          e2 = branch(() => {
            effect(() => (
fn(node)
            ));
          });
        }
      }
    });
  }
  function r(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2) n2 += e2;
    else if ("object" == typeof e2) if (Array.isArray(e2)) {
      var o = e2.length;
      for (t2 = 0; t2 < o; t2++) e2[t2] && (f2 = r(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
    } else for (f2 in e2) e2[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx$1() {
    for (var e2, t2, f2 = 0, n2 = "", o = arguments.length; f2 < o; f2++) (e2 = arguments[f2]) && (t2 = r(e2)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function clsx(value) {
    if (typeof value === "object") {
      return clsx$1(value);
    } else {
      return value ?? "";
    }
  }
  const whitespace = [..." 	\n\r\f \v\uFEFF"];
  function to_class(value, hash, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash) {
      classname = classname ? classname + " " + hash : hash;
    }
    if (directives) {
      for (var key in directives) {
        if (directives[key]) {
          classname = classname ? classname + " " + key : key;
        } else if (classname.length) {
          var len = key.length;
          var a2 = 0;
          while ((a2 = classname.indexOf(key, a2)) >= 0) {
            var b2 = a2 + len;
            if ((a2 === 0 || whitespace.includes(classname[a2 - 1])) && (b2 === classname.length || whitespace.includes(classname[b2]))) {
              classname = (a2 === 0 ? "" : classname.substring(0, a2)) + classname.substring(b2 + 1);
            } else {
              a2 = b2;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
  }
  function append_styles(styles, important = false) {
    var separator = important ? " !important;" : ";";
    var css = "";
    for (var key in styles) {
      var value = styles[key];
      if (value != null && value !== "") {
        css += " " + key + ": " + value + separator;
      }
    }
    return css;
  }
  function to_css_name(name) {
    if (name[0] !== "-" || name[1] !== "-") {
      return name.toLowerCase();
    }
    return name;
  }
  function to_style(value, styles) {
    if (styles) {
      var new_style = "";
      var normal_styles;
      var important_styles;
      if (Array.isArray(styles)) {
        normal_styles = styles[0];
        important_styles = styles[1];
      } else {
        normal_styles = styles;
      }
      if (value) {
        value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
        var in_str = false;
        var in_apo = 0;
        var in_comment = false;
        var reserved_names = [];
        if (normal_styles) {
          reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
        }
        if (important_styles) {
          reserved_names.push(...Object.keys(important_styles).map(to_css_name));
        }
        var start_index = 0;
        var name_index = -1;
        const len = value.length;
        for (var i2 = 0; i2 < len; i2++) {
          var c2 = value[i2];
          if (in_comment) {
            if (c2 === "/" && value[i2 - 1] === "*") {
              in_comment = false;
            }
          } else if (in_str) {
            if (in_str === c2) {
              in_str = false;
            }
          } else if (c2 === "/" && value[i2 + 1] === "*") {
            in_comment = true;
          } else if (c2 === '"' || c2 === "'") {
            in_str = c2;
          } else if (c2 === "(") {
            in_apo++;
          } else if (c2 === ")") {
            in_apo--;
          }
          if (!in_comment && in_str === false && in_apo === 0) {
            if (c2 === ":" && name_index === -1) {
              name_index = i2;
            } else if (c2 === ";" || i2 === len - 1) {
              if (name_index !== -1) {
                var name = to_css_name(value.substring(start_index, name_index).trim());
                if (!reserved_names.includes(name)) {
                  if (c2 !== ";") {
                    i2++;
                  }
                  var property = value.substring(start_index, i2).trim();
                  new_style += " " + property + ";";
                }
              }
              start_index = i2 + 1;
              name_index = -1;
            }
          }
        }
      }
      if (normal_styles) {
        new_style += append_styles(normal_styles);
      }
      if (important_styles) {
        new_style += append_styles(important_styles, true);
      }
      new_style = new_style.trim();
      return new_style === "" ? null : new_style;
    }
    return value == null ? null : String(value);
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash, next_classes);
      {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else if (is_html) {
          dom.className = next_class_name;
        } else {
          dom.setAttribute("class", next_class_name);
        }
      }
      dom.__className = value;
    } else if (next_classes && prev_classes !== next_classes) {
      for (var key in next_classes) {
        var is_present = !!next_classes[key];
        if (prev_classes == null || is_present !== !!prev_classes[key]) {
          dom.classList.toggle(key, is_present);
        }
      }
    }
    return next_classes;
  }
  function update_styles(dom, prev = {}, next, priority) {
    for (var key in next) {
      var value = next[key];
      if (prev[key] !== value) {
        if (next[key] == null) {
          dom.style.removeProperty(key);
        } else {
          dom.style.setProperty(key, value, priority);
        }
      }
    }
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = dom.__style;
    if (prev !== value) {
      var next_style_attr = to_style(value, next_styles);
      {
        if (next_style_attr == null) {
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom.__style = value;
    } else if (next_styles) {
      if (Array.isArray(next_styles)) {
        update_styles(dom, prev_styles?.[0], next_styles[0]);
        update_styles(dom, prev_styles?.[1], next_styles[1], "important");
      } else {
        update_styles(dom, prev_styles, next_styles);
      }
    }
    return next_styles;
  }
  function select_option(select, value, mounting = false) {
    if (select.multiple) {
      if (value == void 0) {
        return;
      }
      if (!is_array(value)) {
        return select_multiple_invalid_value();
      }
      for (var option of select.options) {
        option.selected = value.includes(get_option_value(option));
      }
      return;
    }
    for (option of select.options) {
      var option_value = get_option_value(option);
      if (is(option_value, value)) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function init_select(select) {
    var observer = new MutationObserver(() => {
      select_option(select, select.__value);
    });
    observer.observe(select, {
childList: true,
      subtree: true,



attributes: true,
      attributeFilter: ["value"]
    });
    teardown(() => {
      observer.disconnect();
    });
  }
  function get_option_value(option) {
    if ("__value" in option) {
      return option.__value;
    } else {
      return option.value;
    }
  }
  const CLASS = Symbol("class");
  const STYLE = Symbol("style");
  const IS_CUSTOM_ELEMENT = Symbol("is custom element");
  const IS_HTML = Symbol("is html");
  function set_selected(element, selected) {
    if (selected) {
      if (!element.hasAttribute("selected")) {
        element.setAttribute("selected", "");
      }
    } else {
      element.removeAttribute("selected");
    }
  }
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function set_attributes(element, prev, next, css_hash, skip_warning = false) {
    var attributes = get_attributes(element);
    var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
    var preserve_attribute_case = !attributes[IS_HTML];
    var current = prev || {};
    var is_option_element = element.tagName === "OPTION";
    for (var key in prev) {
      if (!(key in next)) {
        next[key] = null;
      }
    }
    if (next.class) {
      next.class = clsx(next.class);
    } else if (css_hash || next[CLASS]) {
      next.class = null;
    }
    if (next[STYLE]) {
      next.style ??= null;
    }
    var setters = get_setters(element);
    for (const key2 in next) {
      let value = next[key2];
      if (is_option_element && key2 === "value" && value == null) {
        element.value = element.__value = "";
        current[key2] = value;
        continue;
      }
      if (key2 === "class") {
        var is_html = element.namespaceURI === "http://www.w3.org/1999/xhtml";
        set_class(element, is_html, value, css_hash, prev?.[CLASS], next[CLASS]);
        current[key2] = value;
        current[CLASS] = next[CLASS];
        continue;
      }
      if (key2 === "style") {
        set_style(element, value, prev?.[STYLE], next[STYLE]);
        current[key2] = value;
        current[STYLE] = next[STYLE];
        continue;
      }
      var prev_value = current[key2];
      if (value === prev_value && !(value === void 0 && element.hasAttribute(key2))) {
        continue;
      }
      current[key2] = value;
      var prefix = key2[0] + key2[1];
      if (prefix === "$$") continue;
      if (prefix === "on") {
        const opts = {};
        const event_handle_key = "$$" + key2;
        let event_name = key2.slice(2);
        var delegated = is_delegated(event_name);
        if (is_capture_event(event_name)) {
          event_name = event_name.slice(0, -7);
          opts.capture = true;
        }
        if (!delegated && prev_value) {
          if (value != null) continue;
          element.removeEventListener(event_name, current[event_handle_key], opts);
          current[event_handle_key] = null;
        }
        if (value != null) {
          if (!delegated) {
            let handle = function(evt) {
              current[key2].call(this, evt);
            };
            current[event_handle_key] = create_event(event_name, element, handle, opts);
          } else {
            element[`__${event_name}`] = value;
            delegate([event_name]);
          }
        } else if (delegated) {
          element[`__${event_name}`] = void 0;
        }
      } else if (key2 === "style") {
        set_attribute(element, key2, value);
      } else if (key2 === "autofocus") {
        autofocus(
element,
          Boolean(value)
        );
      } else if (!is_custom_element && (key2 === "__value" || key2 === "value" && value != null)) {
        element.value = element.__value = value;
      } else if (key2 === "selected" && is_option_element) {
        set_selected(
element,
          value
        );
      } else {
        var name = key2;
        if (!preserve_attribute_case) {
          name = normalize_attribute(name);
        }
        var is_default = name === "defaultValue" || name === "defaultChecked";
        if (value == null && !is_custom_element && !is_default) {
          attributes[key2] = null;
          if (name === "value" || name === "checked") {
            let input = (
element
            );
            const use_default = prev === void 0;
            if (name === "value") {
              let previous = input.defaultValue;
              input.removeAttribute(name);
              input.defaultValue = previous;
              input.value = input.__value = use_default ? previous : null;
            } else {
              let previous = input.defaultChecked;
              input.removeAttribute(name);
              input.defaultChecked = previous;
              input.checked = use_default ? previous : false;
            }
          } else {
            element.removeAttribute(key2);
          }
        } else if (is_default || setters.includes(name) && (is_custom_element || typeof value !== "string")) {
          element[name] = value;
          if (name in attributes) attributes[name] = UNINITIALIZED;
        } else if (typeof value !== "function") {
          set_attribute(element, name, value);
        }
      }
    }
    return current;
  }
  function attribute_effect(element, fn, sync = [], async = [], css_hash, skip_warning = false) {
    flatten(sync, async, (values) => {
      var prev = void 0;
      var effects = {};
      var is_select = element.nodeName === "SELECT";
      var inited = false;
      block(() => {
        var next = fn(...values.map(get));
        var current = set_attributes(element, prev, next, css_hash, skip_warning);
        if (inited && is_select && "value" in next) {
          select_option(
element,
            next.value
          );
        }
        for (let symbol of Object.getOwnPropertySymbols(effects)) {
          if (!next[symbol]) destroy_effect(effects[symbol]);
        }
        for (let symbol of Object.getOwnPropertySymbols(next)) {
          var n2 = next[symbol];
          if (symbol.description === ATTACHMENT_KEY && (!prev || n2 !== prev[symbol])) {
            if (effects[symbol]) destroy_effect(effects[symbol]);
            effects[symbol] = branch(() => attach(element, () => n2));
          }
          current[symbol] = n2;
        }
        prev = current;
      });
      if (is_select) {
        var select = (
element
        );
        effect(() => {
          select_option(
            select,
prev.value,
            true
          );
          init_select(select);
        });
      }
      inited = true;
    });
  }
  function get_attributes(element) {
    return (

element.__attributes ??= {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      }
    );
  }
  var setters_cache = new Map();
  function get_setters(element) {
    var cache_key = element.getAttribute("is") || element.nodeName;
    var setters = setters_cache.get(cache_key);
    if (setters) return setters;
    setters_cache.set(cache_key, setters = []);
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set) {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function is_bound_this(bound_value, element_or_component) {
    return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
  }
  function bind_this(element_or_component = {}, update, get_value, get_parts) {
    effect(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = [];
        untrack(() => {
          if (element_or_component !== get_value(...parts)) {
            update(element_or_component, ...parts);
            if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
              update(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        queue_micro_task(() => {
          if (parts && is_bound_this(get_value(...parts), element_or_component)) {
            update(null, ...parts);
          }
        });
      };
    });
    return element_or_component;
  }
  function init(immutable = false) {
    const context = (
component_context
    );
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version = 0;
      let prev = (
{}
      );
      const d = derived(() => {
        let changed = false;
        const props2 = context.s;
        for (const key in props2) {
          if (props2[key] !== prev[key]) {
            prev[key] = props2[key];
            changed = true;
          }
        }
        if (changed) version++;
        return version;
      });
      props = () => get(d);
    }
    if (callbacks.b.length) {
      user_pre_effect(() => {
        observe_all(context, props);
        run_all(callbacks.b);
      });
    }
    user_effect(() => {
      const fns = untrack(() => callbacks.m.map(run));
      return () => {
        for (const fn of fns) {
          if (typeof fn === "function") {
            fn();
          }
        }
      };
    });
    if (callbacks.a.length) {
      user_effect(() => {
        observe_all(context, props);
        run_all(callbacks.a);
      });
    }
  }
  function observe_all(context, props) {
    if (context.l.s) {
      for (const signal of context.l.s) get(signal);
    }
    props();
  }
  let is_store_binding = false;
  function capture_store_binding(fn) {
    var previous_is_store_binding = is_store_binding;
    try {
      is_store_binding = false;
      return [fn(), is_store_binding];
    } finally {
      is_store_binding = previous_is_store_binding;
    }
  }
  const rest_props_handler = {
    get(target, key) {
      if (target.exclude.includes(key)) return;
      return target.props[key];
    },
    set(target, key) {
      return false;
    },
    getOwnPropertyDescriptor(target, key) {
      if (target.exclude.includes(key)) return;
      if (key in target.props) {
        return {
          enumerable: true,
          configurable: true,
          value: target.props[key]
        };
      }
    },
    has(target, key) {
      if (target.exclude.includes(key)) return false;
      return key in target.props;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target.props).filter((key) => !target.exclude.includes(key));
    }
  };
function rest_props(props, exclude, name) {
    return new Proxy(
      { props, exclude },
      rest_props_handler
    );
  }
  function prop(props, key, flags, fallback) {
    var runes = !legacy_mode_flag || (flags & PROPS_IS_RUNES) !== 0;
    var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
    var lazy = (flags & PROPS_IS_LAZY_INITIAL) !== 0;
    var fallback_value = (
fallback
    );
    var fallback_dirty = true;
    var get_fallback = () => {
      if (fallback_dirty) {
        fallback_dirty = false;
        fallback_value = lazy ? untrack(
fallback
        ) : (
fallback
        );
      }
      return fallback_value;
    };
    var setter;
    if (bindable) {
      var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
      setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v2) => props[key] = v2 : void 0);
    }
    var initial_value;
    var is_store_sub = false;
    if (bindable) {
      [initial_value, is_store_sub] = capture_store_binding(() => (
props[key]
      ));
    } else {
      initial_value =
props[key];
    }
    if (initial_value === void 0 && fallback !== void 0) {
      initial_value = get_fallback();
      if (setter) {
        if (runes) props_invalid_value();
        setter(initial_value);
      }
    }
    var getter;
    if (runes) {
      getter = () => {
        var value = (
props[key]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    } else {
      getter = () => {
        var value = (
props[key]
        );
        if (value !== void 0) {
          fallback_value =
void 0;
        }
        return value === void 0 ? fallback_value : value;
      };
    }
    if (runes && (flags & PROPS_IS_UPDATED) === 0) {
      return getter;
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return (
(function(value, mutation) {
          if (arguments.length > 0) {
            if (!runes || !mutation || legacy_parent || is_store_sub) {
              setter(mutation ? getter() : value);
            }
            return value;
          }
          return getter();
        })
      );
    }
    var overridden = false;
    var d = ((flags & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
      overridden = false;
      return getter();
    });
    if (bindable) get(d);
    var parent_effect = (
active_effect
    );
    return (
(function(value, mutation) {
        if (arguments.length > 0) {
          const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
          set(d, new_value);
          overridden = true;
          if (fallback_value !== void 0) {
            fallback_value = new_value;
          }
          return value;
        }
        if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
          return d.v;
        }
        return get(d);
      })
    );
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((window.__svelte ??= {}).v ??= new Set()).add(PUBLIC_VERSION);
  }
  enable_legacy_mode_flag();
  var root = from_html(`<div><!></div>`);
  function ButtonGroup($$anchor, $$props) {
    let props = rest_props($$props, ["$$slots", "$$events", "$$legacy", "children"]);
    var div = root();
    attribute_effect(div, () => ({ ...props }), void 0, void 0, "svelte-4mbyk0");
    var node = child(div);
    snippet(node, () => $$props.children);
    append($$anchor, div);
  }
  const mouseClickEvents = ["mousedown", "mouseup", "click"];
  function simulateMouseClickReact(element) {
    mouseClickEvents.forEach(
      (mouseEventType) => element.dispatchEvent(
        new MouseEvent(mouseEventType, {
          view: _unsafeWindow,
          bubbles: true,
          cancelable: true,
          buttons: 1
        })
      )
    );
  }
  const loaderIcon = ($$anchor) => {
    var svg = root_1$3();
    append($$anchor, svg);
  };
  var root_1$3 = from_svg(`<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m4.2 1.8l2.9-2.9M18 12h4m-5.8 4.2l2.9 2.9M12 18v4m-7.1-2.9l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"></path></svg>`);
  var root_2 = from_html(`<a><!></a>`);
  var root_3 = from_html(`<button><!> <!></button>`);
  function Button($$anchor, $$props) {
    push($$props, true);
    let variant = prop($$props, "variant", 3, "purple"), type = prop($$props, "type", 3, "button"), ref = prop($$props, "ref", 15, null), restProps = rest_props($$props, [
      "$$slots",
      "$$events",
      "$$legacy",
      "onclick",
      "children",
      "variant",
      "type",
      "href",
      "ref"
    ]);
    const variants = {
      purple: "--bg: #6c5ce7; --shadow: #a29bfe",
      green: "--bg: #1ba13e; --shadow: #42de6e",
      orange: "--bg: #ffa116; --shadow: #fedd9b"
    };
    let loading = state(false);
    async function handleOnClick(e2) {
      if (!$$props.onclick) return;
      const returnValue = $$props.onclick(e2);
      if (e$1(returnValue)) {
        set(loading, true);
        await returnValue;
        set(loading, false);
      }
    }
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var a2 = root_2();
        attribute_effect(
          a2,
          () => ({
            style: variants[variant()],
            href: $$props.href,
            target: "_blank",
            ...restProps
          }),
          void 0,
          void 0,
          "svelte-ll0ynk"
        );
        var node_1 = child(a2);
        snippet(node_1, () => $$props.children ?? noop);
        bind_this(a2, ($$value) => ref($$value), () => ref());
        append($$anchor2, a2);
      };
      var alternate = ($$anchor2) => {
        var button = root_3();
        attribute_effect(
          button,
          () => ({
            style: variants[variant()],
            type: type(),
            disabled: get(loading),
            onclick: handleOnClick,
            ...restProps
          }),
          void 0,
          void 0,
          "svelte-ll0ynk"
        );
        var node_2 = child(button);
        {
          var consequent_1 = ($$anchor3) => {
            loaderIcon($$anchor3);
          };
          if_block(node_2, ($$render) => {
            if (get(loading)) $$render(consequent_1);
          });
        }
        var node_3 = sibling(node_2, 2);
        snippet(node_3, () => $$props.children ?? noop);
        bind_this(button, ($$value) => ref($$value), () => ref());
        append($$anchor2, button);
      };
      if_block(node, ($$render) => {
        if ($$props.href) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  async function copyText(text2) {
    try {
      await navigator.clipboard.writeText(text2);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
      }
      throw err;
    }
  }
  const getTitle = async () => {
    const descriptionTabButton = (await findElement("#description_tab")).closest(".flexlayout__tab_button");
    if (!descriptionTabButton?.classList.contains(".flexlayout__tab_button--selected")) {
      simulateMouseClickReact(descriptionTabButton);
    }
    return (await findElement(".text-title-large")).textContent ?? "";
  };
  function Copy_title($$anchor, $$props) {
    push($$props, false);
    async function copyTitle() {
      copyText(await getTitle());
      toaster.success(globalState.site === "cn" ? "已复制题目标题到剪贴板" : "Problem title copied to clipboard");
    }
    init();
    Button($$anchor, {
      onclick: copyTitle,
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text();
        template_effect(() => set_text(text$1, globalState.site === "cn" ? "复制标题" : "Copy Title"));
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  var turndownPluginGfm_cjs = {};
  var hasRequiredTurndownPluginGfm_cjs;
  function requireTurndownPluginGfm_cjs() {
    if (hasRequiredTurndownPluginGfm_cjs) return turndownPluginGfm_cjs;
    hasRequiredTurndownPluginGfm_cjs = 1;
    Object.defineProperty(turndownPluginGfm_cjs, "__esModule", { value: true });
    var highlightRegExp = /highlight-(?:text|source)-([a-z0-9]+)/;
    function highlightedCodeBlock(turndownService) {
      turndownService.addRule("highlightedCodeBlock", {
        filter: function(node) {
          var firstChild = node.firstChild;
          return node.nodeName === "DIV" && highlightRegExp.test(node.className) && firstChild && firstChild.nodeName === "PRE";
        },
        replacement: function(content, node, options) {
          var className = node.className || "";
          var language = (className.match(highlightRegExp) || [null, ""])[1];
          return "\n\n" + options.fence + language + "\n" + node.firstChild.textContent + "\n" + options.fence + "\n\n";
        }
      });
    }
    function strikethrough(turndownService) {
      turndownService.addRule("strikethrough", {
        filter: ["del", "s", "strike"],
        replacement: function(content) {
          return "~~" + content + "~~";
        }
      });
    }
    var indexOf = Array.prototype.indexOf;
    var every = Array.prototype.every;
    var rules = {};
    var alignMap = { left: ":---", right: "---:", center: ":---:" };
    let isCodeBlock_ = null;
    let options_ = null;
    const tableShouldBeSkippedCache_ = new WeakMap();
    function getAlignment(node) {
      return node ? (node.getAttribute("align") || node.style.textAlign || "").toLowerCase() : "";
    }
    function getBorder(alignment) {
      return alignment ? alignMap[alignment] : "---";
    }
    function getColumnAlignment(table, columnIndex) {
      var votes = {
        left: 0,
        right: 0,
        center: 0,
        "": 0
      };
      var align = "";
      for (var i2 = 0; i2 < table.rows.length; ++i2) {
        var row = table.rows[i2];
        if (columnIndex < row.childNodes.length) {
          var cellAlignment = getAlignment(row.childNodes[columnIndex]);
          ++votes[cellAlignment];
          if (votes[cellAlignment] > votes[align]) {
            align = cellAlignment;
          }
        }
      }
      return align;
    }
    rules.tableCell = {
      filter: ["th", "td"],
      replacement: function(content, node) {
        if (tableShouldBeSkipped(nodeParentTable(node))) return content;
        return cell(content, node);
      }
    };
    rules.tableRow = {
      filter: "tr",
      replacement: function(content, node) {
        const parentTable = nodeParentTable(node);
        if (tableShouldBeSkipped(parentTable)) return content;
        var borderCells = "";
        if (isHeadingRow(node)) {
          const colCount = tableColCount(parentTable);
          for (var i2 = 0; i2 < colCount; i2++) {
            const childNode = i2 < node.childNodes.length ? node.childNodes[i2] : null;
            var border = getBorder(getColumnAlignment(parentTable, i2));
            borderCells += cell(border, childNode, i2);
          }
        }
        return "\n" + content + (borderCells ? "\n" + borderCells : "");
      }
    };
    rules.table = {
      filter: function(node, options) {
        return node.nodeName === "TABLE";
      },
      replacement: function(content, node) {
        if (tableShouldBeHtml(node, options_)) {
          let html = node.outerHTML;
          let divParent = nodeParentDiv(node);
          if (divParent === null || !divParent.classList.contains("joplin-table-wrapper")) {
            return `

<div class="joplin-table-wrapper">${html}</div>

`;
          } else {
            return html;
          }
        } else {
          if (tableShouldBeSkipped(node)) return content;
          content = content.replace(/\n+/g, "\n");
          var secondLine = content.trim().split("\n");
          if (secondLine.length >= 2) secondLine = secondLine[1];
          var secondLineIsDivider = /\| :?---/.test(secondLine);
          var columnCount = tableColCount(node);
          var emptyHeader = "";
          if (columnCount && !secondLineIsDivider) {
            emptyHeader = "|" + "     |".repeat(columnCount) + "\n|";
            for (var columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
              emptyHeader += " " + getBorder(getColumnAlignment(node, columnIndex)) + " |";
            }
          }
          const captionContent = node.caption ? node.caption.textContent || "" : "";
          const caption = captionContent ? `${captionContent}

` : "";
          const tableContent = `${emptyHeader}${content}`.trimStart();
          return `

${caption}${tableContent}

`;
        }
      }
    };
    rules.tableCaption = {
      filter: ["caption"],
      replacement: () => ""
    };
    rules.tableColgroup = {
      filter: ["colgroup", "col"],
      replacement: () => ""
    };
    rules.tableSection = {
      filter: ["thead", "tbody", "tfoot"],
      replacement: function(content) {
        return content;
      }
    };
    function isHeadingRow(tr) {
      var parentNode = tr.parentNode;
      return parentNode.nodeName === "THEAD" || parentNode.firstChild === tr && (parentNode.nodeName === "TABLE" || isFirstTbody(parentNode)) && every.call(tr.childNodes, function(n2) {
        return n2.nodeName === "TH";
      });
    }
    function isFirstTbody(element) {
      var previousSibling = element.previousSibling;
      return element.nodeName === "TBODY" && (!previousSibling || previousSibling.nodeName === "THEAD" && /^\s*$/i.test(previousSibling.textContent));
    }
    function cell(content, node = null, index = null) {
      if (index === null) index = indexOf.call(node.parentNode.childNodes, node);
      var prefix = " ";
      if (index === 0) prefix = "| ";
      let filteredContent = content.trim().replace(/\n\r/g, "<br>").replace(/\n/g, "<br>");
      filteredContent = filteredContent.replace(/\|+/g, "\\|");
      while (filteredContent.length < 3) filteredContent += " ";
      if (node) filteredContent = handleColSpan(filteredContent, node, " ");
      return prefix + filteredContent + " |";
    }
    function nodeContainsTable(node) {
      if (!node.childNodes) return false;
      for (let i2 = 0; i2 < node.childNodes.length; i2++) {
        const child2 = node.childNodes[i2];
        if (child2.nodeName === "TABLE") return true;
        if (nodeContainsTable(child2)) return true;
      }
      return false;
    }
    const nodeContains = (node, types) => {
      if (!node.childNodes) return false;
      for (let i2 = 0; i2 < node.childNodes.length; i2++) {
        const child2 = node.childNodes[i2];
        if (types === "code" && isCodeBlock_ && isCodeBlock_(child2)) return true;
        if (types.includes(child2.nodeName)) return true;
        if (nodeContains(child2, types)) return true;
      }
      return false;
    };
    const tableShouldBeHtml = (tableNode, options) => {
      const possibleTags = [
        "UL",
        "OL",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "HR",
        "BLOCKQUOTE"
      ];
      if (options.preserveNestedTables) possibleTags.push("TABLE");
      return nodeContains(tableNode, "code") || nodeContains(tableNode, possibleTags);
    };
    function tableShouldBeSkipped(tableNode) {
      const cached = tableShouldBeSkippedCache_.get(tableNode);
      if (cached !== void 0) return cached;
      const result = tableShouldBeSkipped_(tableNode);
      tableShouldBeSkippedCache_.set(tableNode, result);
      return result;
    }
    function tableShouldBeSkipped_(tableNode) {
      if (!tableNode) return true;
      if (!tableNode.rows) return true;
      if (tableNode.rows.length === 1 && tableNode.rows[0].childNodes.length <= 1) return true;
      if (nodeContainsTable(tableNode)) return true;
      return false;
    }
    function nodeParentDiv(node) {
      let parent = node.parentNode;
      while (parent.nodeName !== "DIV") {
        parent = parent.parentNode;
        if (!parent) return null;
      }
      return parent;
    }
    function nodeParentTable(node) {
      let parent = node.parentNode;
      while (parent.nodeName !== "TABLE") {
        parent = parent.parentNode;
        if (!parent) return null;
      }
      return parent;
    }
    function handleColSpan(content, node, emptyChar) {
      const colspan = node.getAttribute("colspan") || 1;
      for (let i2 = 1; i2 < colspan; i2++) {
        content += " | " + emptyChar.repeat(3);
      }
      return content;
    }
    function tableColCount(node) {
      let maxColCount = 0;
      for (let i2 = 0; i2 < node.rows.length; i2++) {
        const row = node.rows[i2];
        const colCount = row.childNodes.length;
        if (colCount > maxColCount) maxColCount = colCount;
      }
      return maxColCount;
    }
    function tables(turndownService) {
      isCodeBlock_ = turndownService.isCodeBlock;
      options_ = turndownService.options;
      turndownService.keep(function(node) {
        if (node.nodeName === "TABLE" && tableShouldBeHtml(node, turndownService.options)) return true;
        return false;
      });
      for (var key in rules) turndownService.addRule(key, rules[key]);
    }
    function taskListItems(turndownService) {
      turndownService.addRule("taskListItems", {
        filter: function(node) {
          const parent = node.parentNode;
          const grandparent = parent.parentNode;
          return node.type === "checkbox" && (parent.nodeName === "LI" || parent.nodeName === "LABEL" && grandparent && grandparent.nodeName === "LI");
        },
        replacement: function(content, node) {
          return (node.checked ? "[x]" : "[ ]") + " ";
        }
      });
    }
    function gfm(turndownService) {
      turndownService.use([
        highlightedCodeBlock,
        strikethrough,
        tables,
        taskListItems
      ]);
    }
    turndownPluginGfm_cjs.gfm = gfm;
    turndownPluginGfm_cjs.highlightedCodeBlock = highlightedCodeBlock;
    turndownPluginGfm_cjs.strikethrough = strikethrough;
    turndownPluginGfm_cjs.tables = tables;
    turndownPluginGfm_cjs.taskListItems = taskListItems;
    return turndownPluginGfm_cjs;
  }
  var turndownPluginGfm_cjsExports = requireTurndownPluginGfm_cjs();
  var M2 = "__monkeyWindow-" + (() => {
    try {
      return new URL((_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('__entry.js', document.baseURI).href)).origin;
    } catch {
      return location.origin;
    }
  })(), y = document[M2] ?? window, g = y.GM, v = y.GM_xmlhttpRequest;
  function k(l2) {
    var e2;
    const t2 = new Headers(), a2 = l2.replace(/\r?\n[\t ]+/g, " ");
    for (const d of a2.split(/\r?\n/)) {
      const i2 = d.split(":"), o = (e2 = i2.shift()) == null ? void 0 : e2.trim();
      if (o) {
        const r2 = i2.join(":").trim();
        try {
          t2.append(o, r2);
        } catch (c2) {
          console.warn(`Response ${c2.message}`);
        }
      }
    }
    return t2;
  }
  const H = async (l2, t2) => {
    const a2 = v || g.xmlHttpRequest;
    if (typeof a2 != "function")
      throw new DOMException(
        "GM_xmlhttpRequest or GM.xmlHttpRequest is not granted.",
        "NotFoundError"
      );
    const e2 = new Request(l2, t2);
    if (e2.signal.aborted)
      throw new DOMException("Network request aborted.", "AbortError");
    const d = await e2.blob(), i2 = Object.fromEntries(e2.headers);
    return new Headers(void 0).forEach((o, r2) => {
      i2[r2] = o;
    }), new Promise((o, r2) => {
      let c2 = false;
      const R = new Promise((n2) => {
        const { abort: h } = a2({
          method: e2.method.toUpperCase(),
          url: e2.url || location.href,
          headers: i2,
          data: d.size ? d : void 0,
          redirect: e2.redirect,
          binary: true,
          nocache: e2.cache === "no-store",
          revalidate: e2.cache === "reload",
          timeout: 3e5,
          responseType: a2.RESPONSE_TYPE_STREAM ?? "blob",
          overrideMimeType: e2.headers.get("Content-Type") ?? void 0,
          anonymous: e2.credentials === "omit",
          onload: ({ response: s }) => {
            if (c2) {
              n2(null);
              return;
            }
            n2(s);
          },
          async onreadystatechange({
            readyState: s,
            responseHeaders: p2,
            status: b2,
            statusText: q,
            finalUrl: w2,
            response: E2
          }) {
            if (s === XMLHttpRequest.DONE)
              e2.signal.removeEventListener("abort", h);
            else if (s !== XMLHttpRequest.HEADERS_RECEIVED)
              return;
            if (c2) {
              n2(null);
              return;
            }
            const u = k(p2), f2 = e2.url !== w2, m = new Response(
              E2 instanceof ReadableStream ? E2 : await R,
              {
                headers: u,
                status: b2,
                statusText: q
              }
            );
            Object.defineProperties(m, {
              url: {
                value: w2
              },
              type: {
                value: "basic"
              },
              ...m.redirected !== f2 ? {
                redirected: {
                  value: f2
                }
              } : {},
...u.has("set-cookie") || u.has("set-cookie2") ? {
                headers: {
                  value: u
                }
              } : {}
            }), o(m), c2 = true;
          },
          onerror: ({ statusText: s, error: p2 }) => {
            r2(
              new TypeError(s || p2 || "Network request failed.")
            ), n2(null);
          },
          ontimeout() {
            r2(new TypeError("Network request timeout.")), n2(null);
          },
          onabort() {
            r2(new DOMException("Network request aborted.", "AbortError")), n2(null);
          }
        });
        e2.signal.addEventListener("abort", h);
      });
    });
  };
  async function compressImage(image) {
    return new Promise((resolve, reject) => {
      new Compressor(image, {
        success: resolve,
        error: reject
      });
    });
  }
  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }
  async function convertSrcToDataURL(src) {
    if (src.startsWith("data:")) {
      return src;
    }
    try {
      const response = await H(src);
      let blob = await response.blob();
      const incompressableTypes = ["image/gif", "image/svg+xml"];
      if (!incompressableTypes.includes(blob.type)) {
        blob = await compressImage(blob);
      }
      const dataURL = await blobToDataURL(blob);
      return dataURL;
    } catch (err) {
      console.error(`Failed to convert image: ${src}`, err);
      throw err;
    }
  }
  const imageCache = new Map();
  async function prefetchImages(node) {
    const images = Array.from(node.querySelectorAll("img"));
    const fetchPromises = images.map(async ({ src }) => {
      if (imageCache.has(src)) return;
      const dataURL = await convertSrcToDataURL(src);
      imageCache.set(src, dataURL);
    });
    await Promise.all(fetchPromises);
  }
  function createTurndownService() {
    const turndown2 = new TurndownService({
      emDelimiter: "*",
      bulletListMarker: "-"
    });
    turndown2.addRule("pre", {
      filter: ["pre"],
      replacement: (_content, node) => {
        const codeClass = node.firstElementChild?.className;
        const regex = /^language-(.+)$/;
        const language = codeClass?.match(regex)?.at(1) ?? "txt";
        return "\n```" + language + "\n" + node.textContent?.trim() + "\n```\n";
      }
    });
    turndown2.addRule("superscript", {
      filter: ["sup"],
      replacement: (content) => "^" + content
    });
    turndown2.addRule("paragraph", {
      filter: ["p"],
      replacement: (content) => "\n\n" + content + "\n\n"
    });
    turndown2.addRule("convert-img-src-to-base64", {
      filter: ["img"],
      replacement: (_content, node) => {
        const { src, alt } = node;
        const dataURL = imageCache.get(src);
        if (dataURL) {
          return `![${alt}](${dataURL})`;
        }
        return `![${alt}](${src})`;
      }
    });
    turndown2.use(turndownPluginGfm_cjsExports.tables);
    return turndown2;
  }
  async function htmlToMd(node, {
    turndownService = createTurndownService(),
    convertImage = true
  } = {}) {
    if (convertImage) await prefetchImages(node);
    const md = turndownService.turndown(node);
    if (convertImage) imageCache.clear();
    return md;
  }
  const getDescription = async (convertImage = true) => {
    const el = await findElement("div[data-track-load='description_content']");
    return htmlToMd(el, { convertImage });
  };
  function Copy_description($$anchor, $$props) {
    push($$props, false);
    async function copyDescription() {
      const desc = await getDescription(false);
      copyText(desc);
      toaster.success(globalState.site === "cn" ? "已复制题目描述到剪贴板" : "Problem description copied to clipboard");
    }
    init();
    Button($$anchor, {
      variant: "green",
      onclick: copyDescription,
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text();
        template_effect(() => set_text(text$1, globalState.site === "cn" ? "复制描述" : "Copy Description"));
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  function downloadFile(blob, filename, extension) {
    const url2 = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url2;
    a2.download = filename + "." + extension;
    document.body.appendChild(a2);
    a2.click();
    document.body.removeChild(a2);
    URL.revokeObjectURL(url2);
  }
  class NotebookBuilder {
    #cells = [];
    #metadata = {};
    #nbformat = 5;
    #nbformat_minor = 10;
    addMarkdown(content) {
      const md = {
        cell_type: "markdown",
        metadata: {},
        source: content
      };
      this.#cells.push(md);
      return this;
    }
addTitle(title, url2) {
      this.addMarkdown(`# [${title}](${url2})`);
      return this;
    }
    addSection(heading, content) {
      this.addMarkdown(`## ${heading}

 ${content ?? ""}`);
      return this;
    }
addHorizontalRule() {
      this.addMarkdown("---\n\n");
      return this;
    }
    addCode(content) {
      const code = {
        cell_type: "code",
        metadata: {},
        source: content,
        execution_count: null,
        outputs: []
      };
      this.#cells.push(code);
      return this;
    }
    setLanguage(language) {
      this.#metadata.language_info = {
        name: language
      };
      return this;
    }
    build() {
      return {
        metadata: this.#metadata,
        nbformat: this.#nbformat,
        nbformat_minor: this.#nbformat_minor,
        cells: this.#cells
      };
    }
    download(filename) {
      const notebook = this.build();
      const blob = new Blob([JSON.stringify(notebook)], {
        type: "application/x-ipynb+json"
      });
      downloadFile(blob, filename, "ipynb");
    }
  }
  function Download_as_jupyter($$anchor, $$props) {
    push($$props, false);
    async function saveAsJupyter() {
      const builder = new NotebookBuilder();
      const title = await getTitle();
      const url2 = window.location.href;
      const urlRegex = /^(https:\/\/(leetcode\.com|leetcode\.cn)\/problems\/[a-zA-Z0-9_-]+)/;
      const urlMatch = url2.match(urlRegex);
      builder.addTitle(title, urlMatch ? urlMatch[0] : url2);
      const description = await getDescription();
      builder.addSection(globalState.site === "cn" ? "题目描述" : "Description", description);
      builder.addHorizontalRule();
      builder.addSection(globalState.site === "cn" ? "解答" : "Solution");
      const code = problemState.editor?.getModel()?.getValue();
      if (!code) {
        toaster.error("Fail to retrieve current code in the editor");
      } else {
        builder.addCode(code);
      }
      const language = problemState.editor?.getModel()?.getLanguageId() ?? "python";
      builder.setLanguage(language);
      builder.download(title);
    }
    init();
    Button($$anchor, {
      variant: "orange",
      onclick: () => {
        toaster.promise(saveAsJupyter(), {
          loading: "Scraping problem description and code...",
          success: "Start downloading jupyter notebook...",
          error: "Something went wrong while scraping. See browser console for more detail."
        });
      },
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text();
        template_effect(() => set_text(text$1, globalState.site === "cn" ? "保存为 Jupyter Notebook" : "Save as Jupyter Notebook"));
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  var root_1$2 = from_html(`<!> <!> <!>`, 1);
  function DescriptionButttons($$anchor) {
    ButtonGroup($$anchor, {
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1$2();
        var node = first_child(fragment_1);
        Copy_title(node, {});
        var node_1 = sibling(node, 2);
        Copy_description(node_1, {});
        var node_2 = sibling(node_1, 2);
        Download_as_jupyter(node_2, {});
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true }
    });
  }
  const ratingsTxt = _GM_getResourceText("ratings");
  function getSlug(url2) {
    const pathParts = url2.pathname.split("/");
    if (pathParts.length < 3) return null;
    return pathParts[2];
  }
  function getRating(slugToSearch) {
    const lines = ratingsTxt.split("\n");
    for (const line of lines) {
      const parts = line.split("	");
      if (parts.length < 2) continue;
      const slug = parts[4];
      if (slug === slugToSearch) {
        return Math.round(parseFloat(parts[0]));
      }
    }
    return null;
  }
  async function getOrCreateRatingElement() {
    const difficultyEl = await findElement(
      "div[class*='text-difficulty']",
      { timeout: 5e3 }
    );
    const id = n(CONFIG.APP_NAME) + "-rating";
    const el = difficultyEl.querySelector(`#${id}`);
    if (el) {
      return el;
    } else {
      const span = document.createElement("span");
      span.id = id;
      difficultyEl.append(span);
      return span;
    }
  }
  async function appendRating() {
    const slug = getSlug(window.location);
    if (!slug) return;
    if (slug === problemState.slug) {
      return;
    }
    problemState.slug = slug;
    const rating = getRating(slug);
    if (rating) {
      console.log("got a rating for slug", slug, ":", rating);
    }
    const el = await getOrCreateRatingElement();
    el.textContent = rating?.toString() ?? "";
  }
  function initRatings() {
    appendRating();
    if (_monkeyWindow.onurlchange === null) {
      _monkeyWindow.addEventListener("urlchange", () => {
        appendRating();
      });
    }
  }
  async function initDescriptionTab() {
    const descriptionTab = await findElement(
      ".flexlayout__tab:has([data-track-load='description_content'])",
      {
        timeout: 0,
        additionalRule: (el) => el.style.display !== "none"
      }
    );
    const titleContainer = await findElement("div:has(> .text-title-large)", {
      parent: descriptionTab
    });
    const buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute(
      "id",
      n(CONFIG.APP_NAME) + "-description"
    );
    buttonsContainer.style.cssText = "display: contents;";
    titleContainer.parentElement?.before(buttonsContainer);
    mount(DescriptionButttons, {
      target: buttonsContainer
    });
    initRatings();
  }
  function Find_editorial_screenshot($$anchor, $$props) {
    push($$props, false);
    const editorialsMarkdown = _GM_getResourceText("editorials");
    function extractScreenshotLink(problemTitle) {
      const cleanTitle = problemTitle.trim();
      const headingPattern = new RegExp(`####\\s+\\[${cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]\\((.*?)\\)`, "i");
      const match = editorialsMarkdown.match(headingPattern);
      return match ? match[1] : null;
    }
    async function goToEditorialScreenshot() {
      const title = await getTitle();
      const link = extractScreenshotLink(title);
      if (link) {
        window.open(link, "_blank");
      } else {
        toaster.error(`Editorial screenshot not found for problem: ${title}`);
      }
    }
    init();
    Button($$anchor, {
      onclick: goToEditorialScreenshot,
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text("Find Screenshot");
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  const turndown = createTurndownService();
  turndown.addRule("remove-heading-link", {
    filter: (node) => node.nodeName === "A" && node.getAttribute("aria-hidden") === "true",
    replacement: () => ""
  });
  turndown.addRule("save-math-as-is", {
    filter: (node) => ["SPAN", "DIV"].includes(node.nodeName) && node.matches(".math, .maths, .math-tex"),
    replacement: (_content, node) => node.outerHTML
  });
  function waitForIframeToLoad(iframe) {
    return new Promise((resolve) => {
      if (iframe.src !== "about:blank") {
        const isSameOrigin = new URL(iframe.src).hostname === window.location.hostname;
        if (!isSameOrigin || iframe.contentWindow?.location?.href !== "about:blank" && iframe.contentWindow?.document.readyState == "complete") {
          resolve(void 0);
          return;
        }
      }
      console.log("wait for iframe to load...");
      iframe.contentWindow?.addEventListener("load", resolve, {
        once: true
      });
    });
  }
  const playgroundCache = new Map();
  async function prefetchPlayground(editorialEl) {
    const iframes = Array.from(editorialEl.querySelectorAll("iframe"));
    const promises = iframes.map(async (iframe) => {
      await waitForIframeToLoad(iframe);
      const { src, contentDocument } = iframe;
      if (!src.includes("playground")) return;
      console.log(iframe.contentWindow?.location?.href);
      const langTab = await findElement("div.lang-btn-set", {
        parent: contentDocument,
        timeout: 1e3
      });
      const textarea = contentDocument?.querySelector(
        "textarea[name='lc-codemirror']"
      );
      let result = `<MixedCodeBlock> 

`;
      Array.from(
        langTab.children
      ).forEach((button) => {
        let lang = button.textContent?.toLowerCase();
        if (lang === "python3") lang = "python";
        button.click();
        const code = textarea?.textContent;
        result += `\`\`\`${lang}
${code}
\`\`\`

`;
      });
      result += `</MixedCodeBlock>`;
      playgroundCache.set(src, result);
    });
    await Promise.all(promises);
  }
  turndown.addRule("save-code-playground", {
    filter: ["iframe"],
    replacement: (_content, node) => {
      const { src } = node;
      if (!src.includes("playground")) {
        return `<${src}>

<iframe width='100%' height='400' src=${src}></iframe>`;
      }
      return `[LeetCode Playground](${src})

` + (playgroundCache.get(src) ?? "");
    }
  });
  const slideCache = new Map();
  async function preFetchSlides(editorialEl) {
    const slideImages = editorialEl.querySelectorAll("img[alt='Current']");
    const promises = Array.from(slideImages).map(async (image) => {
      const slideContainer = image.parentElement?.parentElement;
      if (!slideContainer) {
        throw new Error("Slide container not found");
      }
      const slideNumIndicator = slideContainer.children[2].children[1];
      slideNumIndicator.setAttribute("data-skip-me-turndown", "true");
      const slidesCountStr = slideNumIndicator.textContent?.match(/\d+$/)?.[0];
      if (!slidesCountStr) {
        throw new Error("Slide count not found");
      }
      const nextSlideButton = slideContainer.querySelector("svg:nth-child(3)");
      if (!nextSlideButton) {
        throw new Error("Next slide button not found");
      }
      const firstSlideSrc = image.src;
      slideCache.set(firstSlideSrc, []);
      for (let i2 = 0; i2 < Number(slidesCountStr); i2++) {
        simulateMouseClickReact(nextSlideButton);
        const dataURL = await convertSrcToDataURL(image.src);
        slideCache.get(firstSlideSrc).push(dataURL);
      }
    });
    await Promise.all(promises);
  }
  turndown.addRule("save-slides", {
    filter: (node) => node.tagName === "IMG" && node.alt === "Current",
    replacement: (_content, node) => {
      const { src } = node;
      const dataURLs = slideCache.get(src);
      if (!dataURLs) return "";
      let res = `<Slides> 

`;
      dataURLs.forEach((dataURL, index) => {
        res += `![Slide ${index + 1}](${dataURL}) 
`;
      });
      res += `
</Slides>`;
      return res;
    }
  });
  turndown.addRule("save-details-as-is", {
    filter: ["details"],
    replacement: (_content, node) => {
      const { children } = node;
      [...children].forEach((child2) => {
        if (!child2.textContent) node.removeChild(child2);
      });
      return node.outerHTML;
    }
  });
  turndown.remove(
    (node) => node.getAttribute("data-skip-me-turndown") === "true"
  );
  async function scrapeEditorial(editorialEl) {
    await prefetchPlayground(editorialEl);
    await preFetchSlides(editorialEl);
    const editorial = await htmlToMd(editorialEl, {
      turndownService: turndown
    });
    playgroundCache.clear();
    slideCache.clear();
    return editorial;
  }
  async function downloadEditorial(editorialFinder, titleFinder) {
    toaster.promise(
      async () => {
        const editorialEl = await editorialFinder();
        const editorial = await scrapeEditorial(editorialEl);
        const title = await titleFinder();
        const blob = new Blob([`# ${title}

`, editorial], {
          type: "text/markdown; charset=UTF-8"
        });
        downloadFile(blob, title, "md");
      },
      {
        loading: "Scraping editorial...",
        success: "Editorial scraped. Downloading...",
        error: "Something went wrong while scraping. See browser console for more detail."
      }
    );
  }
  function Save_editorial($$anchor, $$props) {
    push($$props, false);
    async function findEditorial() {
      const editorialEl = await findElement(".flexlayout__tab:has(#editorial-quick-navigation) div.WRmCx", { timeout: 2e3 });
      return editorialEl;
    }
    init();
    Button($$anchor, {
      onclick: () => downloadEditorial(findEditorial, getTitle),
      variant: "orange",
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text("Save Editorial as Markdown");
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  function Read_saved_editorial($$anchor, $$props) {
    push($$props, false);
    init();
    Button($$anchor, {
      get href() {
        return CONFIG.EDITORIAL_READER_URL;
      },
      variant: "green",
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text("Read Saved Editorial");
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  var root_1$1 = from_html(`<!> <!> <!>`, 1);
  function EditorialButtons($$anchor) {
    ButtonGroup($$anchor, {
      style: "z-index: 10; position:relative; padding: 0.5rem",
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1$1();
        var node = first_child(fragment_1);
        Find_editorial_screenshot(node, {});
        var node_1 = sibling(node, 2);
        Save_editorial(node_1, {});
        var node_2 = sibling(node_1, 2);
        Read_saved_editorial(node_2, {});
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true }
    });
  }
  async function initEditorialTab() {
    const editorialTab = await findElement(
      ".flexlayout__tab:has(div.bg-blocker, #editorial-quick-navigation)",
      {
        timeout: 0,
        additionalRule: (el) => el.style.display !== "none"
      }
    );
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.cssText = "display: contents;";
    buttonsContainer.setAttribute(
      "id",
      n(CONFIG.APP_NAME) + "-editorial"
    );
    editorialTab.prepend(buttonsContainer);
    mount(EditorialButtons, {
      target: buttonsContainer
    });
  }
  function Copy_solution($$anchor, $$props) {
    push($$props, false);
    let buttonEl = mutable_source(null);
    async function copySolution() {
      const tab = get(buttonEl).closest("div.flexlayout__tab");
      const content = await findElement("div.WRmCx", { parent: tab });
      copyText(await htmlToMd(content));
      toaster.success(globalState.site === "cn" ? "已复制题解到剪贴板" : "Problem solution copied to clipboard");
    }
    init();
    Button($$anchor, {
      variant: "green",
      onclick: copySolution,
      get ref() {
        return get(buttonEl);
      },
      set ref($$value) {
        set(buttonEl, $$value);
      },
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text();
        template_effect(() => set_text(text$1, globalState.site === "cn" ? "复制题解为Markdown （实验性）" : "Copy Solution as Markdown (Experimental)"));
        append($$anchor2, text$1);
      },
      $$slots: { default: true },
      $$legacy: true
    });
    pop();
  }
  function SolutionButtons($$anchor) {
    ButtonGroup($$anchor, {
      style: "padding: 0.5rem;",
      children: ($$anchor2, $$slotProps) => {
        Copy_solution($$anchor2, {});
      },
      $$slots: { default: true }
    });
  }
  async function initSolutionsTab() {
    const allSolutionText = globalState.site === "cn" ? "全部题解" : "All Solutions";
    const solutionsTab = await findElement(
      `//div[@class='flexlayout__tab' and .//div[text()='${allSolutionText}']]`,
      {
        finderType: "xpath",
        timeout: 0,
        additionalRule: (el) => el.style.display !== "none"
      }
    );
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.cssText = "display: contents;";
    buttonsContainer.setAttribute(
      "id",
      n(CONFIG.APP_NAME) + "-solutions"
    );
    solutionsTab.prepend(buttonsContainer);
    mount(SolutionButtons, {
      target: buttonsContainer
    });
  }
  async function main$1() {
    const initPromises = [];
    initPromises.push(problemState.patchMonacoEditor());
    initPromises.push(initDescriptionTab());
    initPromises.push(initSolutionsTab());
    if (globalState.site === "global") {
      initPromises.push(initEditorialTab());
    }
    await Promise.all(initPromises);
  }
  function getElementIndex(element) {
    if (!element.parentNode) throw new Error("Element has no parent node");
    return Array.from(element.parentNode.children).indexOf(element);
  }
  function Save_explore_article($$anchor, $$props) {
    push($$props, false);
    async function findExploreEditorial() {
      return await findElement("div.block-markdown");
    }
    async function getExploreTitle() {
      const tocContainer = await findElement("div.list-group:not(.item-list-group)");
      const titleContainer = tocContainer.querySelector(".list-group-item .selected");
      if (!titleContainer) {
        throw new Error("Title container not found");
      }
      const title = titleContainer.querySelector(".title")?.textContent?.trim() ?? "";
      const articleNumber = getElementIndex(titleContainer) + 1;
      const chapterEl = titleContainer.closest("div.chapter-item");
      if (!chapterEl) {
        throw new Error("Chapter not found");
      }
      const chapterNumber = getElementIndex(chapterEl);
      return `${chapterNumber}.${articleNumber} ${title}`;
    }
    init();
    Button($$anchor, {
      onclick: () => downloadEditorial(findExploreEditorial, getExploreTitle),
      children: ($$anchor2, $$slotProps) => {
        var text$1 = text("Save Article as Markdown");
        append($$anchor2, text$1);
      },
      $$slots: { default: true }
    });
    pop();
  }
  var root_1 = from_html(`<!> <!>`, 1);
  function ExploreButtons($$anchor) {
    ButtonGroup($$anchor, {
      children: ($$anchor2, $$slotProps) => {
        var fragment_1 = root_1();
        var node = first_child(fragment_1);
        Save_explore_article(node, {});
        var node_1 = sibling(node, 2);
        Read_saved_editorial(node_1, {});
        append($$anchor2, fragment_1);
      },
      $$slots: { default: true }
    });
  }
  async function main() {
    const toolbar = await findElement("div.left-side", { timeout: 0 });
    const container = document.createElement("div");
    container.style.cssText = "display: contents;";
    toolbar.append(container);
    mount(ExploreButtons, {
      target: container
    });
  }
  const url = window.location.href;
  const problemPageRegex = /https?:\/\/leetcode\.com\/problems\/.*|https?:\/\/leetcode\.cn\/problems\/.*/;
  const explorePageRegex = /https?:\/\/leetcode\.com\/explore\/.*\/card\/.*/;
  if (problemPageRegex.test(url)) {
    main$1();
  } else if (explorePageRegex.test(url)) {
    main();
  }

})(TurndownService, Compressor);