// ==UserScript==
// @name         ImmersionKit → Anki
// @namespace    immersionkit_to_anki
// @version      1.1.18
// @description  Add example images and audio from ImmersionKit's dictionary pages to your latest Anki note via AnkiConnect.
// @icon         https://vitejs.dev/logo.svg
// @match        https://www.immersionkit.com/*
// @connect      apiv2.immersionkit.com
// @connect      us-southeast-1.linodeobjects.com
// @connect      127.0.0.1
// @connect      localhost
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547691/ImmersionKit%20%E2%86%92%20Anki.user.js
// @updateURL https://update.greasyfork.org/scripts/547691/ImmersionKit%20%E2%86%92%20Anki.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const e = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  e(" .ik-anki-overlay.svelte-ny9p3g{position:fixed;inset:0;background:#00000073;z-index:999999;display:grid;place-items:center;padding:20px}.ik-anki-panel.svelte-ny9p3g{width:min(680px,100%);background:#0f1227;color:#e7e9f0;border-radius:12px;box-shadow:0 10px 30px #00000059;border:1px solid rgba(255,255,255,.08);display:grid;grid-template-rows:auto 1fr auto;overflow:hidden}header.svelte-ny9p3g{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08)}header.svelte-ny9p3g h2:where(.svelte-ny9p3g){margin:0;font-size:16px;font-weight:600}header.svelte-ny9p3g .icon:where(.svelte-ny9p3g){border:none;background:transparent;color:#c7cbe1;cursor:pointer;font-size:18px;line-height:1;padding:6px;border-radius:6px}header.svelte-ny9p3g .icon:where(.svelte-ny9p3g):hover{background:#ffffff0f}main.svelte-ny9p3g{padding:16px;display:grid;gap:12px}label.svelte-ny9p3g{font-size:12px;color:#aab0d0}input[type=text].svelte-ny9p3g,input[type=password].svelte-ny9p3g,input[type=number].svelte-ny9p3g{width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:#111533;color:#e7e9f0;outline:none}input.svelte-ny9p3g:focus{border-color:#6ea8fe;box-shadow:0 0 0 3px #6ea8fe26}.row.svelte-ny9p3g{display:grid;gap:12px;grid-template-columns:1fr 1fr}.col.checkbox.svelte-ny9p3g{display:flex;align-items:end;gap:8px}.test.svelte-ny9p3g{display:flex;align-items:center;gap:10px}.test.svelte-ny9p3g span:where(.svelte-ny9p3g){font-size:12px}.test.svelte-ny9p3g span.ok:where(.svelte-ny9p3g){color:#5dd39e}.test.svelte-ny9p3g span.fail:where(.svelte-ny9p3g){color:#ff6b6b}.alert.error.svelte-ny9p3g{background:#ff6b6b14;color:#ffb3b3;border:1px solid rgba(255,107,107,.35);padding:10px 12px;border-radius:8px}footer.svelte-ny9p3g{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid rgba(255,255,255,.08);background:#0c0f22}button.svelte-ny9p3g{cursor:pointer;border-radius:8px;padding:8px 14px;border:1px solid transparent;font-size:14px}.primary.svelte-ny9p3g{background:#6ea8fe;color:#071223;border-color:#6ea8fe}.primary.svelte-ny9p3g:hover{filter:brightness(1.05)}.ghost.svelte-ny9p3g{background:transparent;color:#c7cbe1;border-color:#fff3}.ghost.svelte-ny9p3g:hover{background:#ffffff0f}.secondary.svelte-ny9p3g{background:#2a2f52;color:#e7e9f0;border-color:#ffffff1f} ");

  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const modalCss = `.anki-feedback-pending {\r
    opacity: .7;\r
    pointer-events: none;\r
}\r
\r
.anki-feedback-success {\r
    color: #0a8f08 !important;\r
}\r
\r
.anki-feedback-error {\r
    color: #c62828 !important;\r
}\r
\r
.anki-modal-overlay {\r
    position: fixed;\r
    inset: 0;\r
    background: rgba(0, 0, 0, .45);\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    z-index: 99999;\r
}\r
\r
.anki-modal {\r
    background: #fff;\r
    border-radius: 10px;\r
    box-shadow: 0 10px 30px rgba(0, 0, 0, .2);\r
    width: min(560px, 92vw);\r
    max-height: 90vh;\r
    display: flex;\r
    flex-direction: column;\r
    overflow: hidden;\r
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;\r
}\r
\r
.anki-modal header {\r
    padding: 14px 18px;\r
    border-bottom: 1px solid #eee;\r
    font-weight: 600;\r
    font-size: 15px;\r
}\r
\r
.anki-modal main {\r
    padding: 16px 18px;\r
    overflow: auto;\r
    font-size: 14px;\r
    line-height: 1.5;\r
    color: #333;\r
}\r
\r
.anki-modal footer {\r
    padding: 12px 18px;\r
    border-top: 1px solid #eee;\r
    display: flex;\r
    gap: 10px;\r
    justify-content: flex-end;\r
    background: #fafafa;\r
}\r
\r
.anki-btn {\r
    appearance: none;\r
    border: 1px solid #ccc;\r
    background: #fff;\r
    border-radius: 8px;\r
    padding: 6px 12px;\r
    cursor: pointer;\r
    font-size: 14px;\r
}\r
\r
.anki-btn.primary {\r
    background: #2563eb;\r
    border-color: #2563eb;\r
    color: #fff;\r
}\r
\r
.anki-btn.danger {\r
    background: #c62828;\r
    border-color: #c62828;\r
    color: #fff;\r
}\r
\r
.anki-form {\r
    display: grid;\r
    grid-template-columns: 130px 1fr;\r
    gap: 10px 12px;\r
    align-items: center;\r
}\r
\r
.anki-form label {\r
    font-weight: 600;\r
    color: #444;\r
}\r
\r
.anki-form input[type="text"],\r
.anki-form input[type="number"],\r
.anki-form input[type="password"] {\r
    width: 100%;\r
    padding: 8px 10px;\r
    border: 1px solid #ddd;\r
    border-radius: 8px;\r
    font-size: 14px;\r
}\r
\r
.anki-form .row-span-2 {\r
    grid-column: 1 / -1\r
}\r
\r
.anki-kv {\r
    display: grid;\r
    grid-template-columns: 120px 1fr;\r
    gap: 8px 10px;\r
    margin-bottom: 8px\r
}\r
\r
.anki-kv .key {\r
    color: #555;\r
    font-weight: 600\r
}\r
\r
.anki-pre {\r
    background: #f7f7f9;\r
    border: 1px solid #eee;\r
    border-radius: 8px;\r
    padding: 10px;\r
    max-height: 180px;\r
    overflow: auto;\r
    white-space: pre-wrap;\r
    word-break: break-word;\r
}\r
\r
/* ============================================================================\r
   Play All Audio Control Bar\r
   ============================================================================ */\r
\r
.anki-playall-bar {\r
    position: sticky;\r
    top: 0;\r
    z-index: 1000;\r
    display: flex;\r
    align-items: center;\r
    gap: 8px;\r
    padding: 10px 14px;\r
    background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);\r
    border-radius: 10px;\r
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\r
    margin-bottom: 12px;\r
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;\r
}\r
\r
.anki-playall-btn {\r
    appearance: none;\r
    border: none;\r
    background: rgba(255, 255, 255, 0.15);\r
    color: #fff;\r
    border-radius: 8px;\r
    padding: 8px 14px;\r
    cursor: pointer;\r
    font-size: 13px;\r
    font-weight: 500;\r
    display: inline-flex;\r
    align-items: center;\r
    gap: 6px;\r
    transition: background 0.2s, transform 0.1s;\r
}\r
\r
.anki-playall-btn:hover {\r
    background: rgba(255, 255, 255, 0.25);\r
}\r
\r
.anki-playall-btn:active {\r
    transform: scale(0.97);\r
}\r
\r
.anki-playall-btn.primary {\r
    background: #4caf50;\r
}\r
\r
.anki-playall-btn.primary:hover {\r
    background: #5cbf60;\r
}\r
\r
.anki-playall-btn.warning {\r
    background: #ff9800;\r
}\r
\r
.anki-playall-btn.warning:hover {\r
    background: #ffaa22;\r
}\r
\r
.anki-playall-btn.danger {\r
    background: #f44336;\r
}\r
\r
.anki-playall-btn.danger:hover {\r
    background: #ff5544;\r
}\r
\r
.anki-playall-btn.active {\r
    background: #2196f3;\r
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.4);\r
}\r
\r
.anki-playall-progress {\r
    flex: 1;\r
    color: rgba(255, 255, 255, 0.9);\r
    font-size: 13px;\r
    text-align: center;\r
}\r
\r
.anki-playall-progress .current {\r
    font-weight: 600;\r
    color: #fff;\r
}\r
\r
.anki-playall-shortcuts {\r
    color: rgba(255, 255, 255, 0.6);\r
    font-size: 11px;\r
    margin-left: auto;\r
}\r
\r
.anki-playall-shortcuts kbd {\r
    display: inline-block;\r
    background: rgba(255, 255, 255, 0.15);\r
    border-radius: 4px;\r
    padding: 2px 6px;\r
    margin: 0 2px;\r
    font-family: monospace;\r
    font-size: 10px;\r
}\r
\r
/* ============================================================================\r
   Example Highlight Animation\r
   ============================================================================ */\r
\r
/* 当前播放项 - 醒目的进入动画 */\r
.anki-playall-highlight {\r
    position: relative;\r
    animation: anki-playall-enter 0.4s ease-out, anki-playall-pulse 1.5s ease-in-out 0.4s infinite;\r
    z-index: 5;\r
}\r
\r
.anki-playall-highlight::before {\r
    content: '';\r
    position: absolute;\r
    inset: -6px;\r
    border: 3px solid #2196f3;\r
    border-radius: 10px;\r
    pointer-events: none;\r
    box-shadow: 0 0 20px rgba(33, 150, 243, 0.5), inset 0 0 10px rgba(33, 150, 243, 0.1);\r
    animation: anki-playall-border-enter 0.4s ease-out, anki-playall-border-pulse 1.5s ease-in-out 0.4s infinite;\r
}\r
\r
/* 上一个播放项 - 淡出效果，保持短暂可见 */\r
.anki-playall-leaving {\r
    position: relative;\r
    animation: anki-playall-leave 0.8s ease-out forwards;\r
}\r
\r
.anki-playall-leaving::before {\r
    content: '';\r
    position: absolute;\r
    inset: -4px;\r
    border: 2px solid #90caf9;\r
    border-radius: 8px;\r
    pointer-events: none;\r
    animation: anki-playall-border-leave 0.8s ease-out forwards;\r
}\r
\r
/* 进入动画 - 缩放+闪烁 */\r
@keyframes anki-playall-enter {\r
    0% {\r
        transform: scale(0.98);\r
        background-color: rgba(33, 150, 243, 0.3);\r
    }\r
\r
    50% {\r
        transform: scale(1.01);\r
        background-color: rgba(33, 150, 243, 0.25);\r
    }\r
\r
    100% {\r
        transform: scale(1);\r
        background-color: rgba(33, 150, 243, 0.08);\r
    }\r
}\r
\r
@keyframes anki-playall-border-enter {\r
    0% {\r
        opacity: 0;\r
        transform: scale(0.95);\r
    }\r
\r
    50% {\r
        opacity: 1;\r
        box-shadow: 0 0 30px rgba(33, 150, 243, 0.8), inset 0 0 15px rgba(33, 150, 243, 0.2);\r
    }\r
\r
    100% {\r
        opacity: 1;\r
        transform: scale(1);\r
    }\r
}\r
\r
/* 离开动画 - 淡化 */\r
@keyframes anki-playall-leave {\r
    0% {\r
        background-color: rgba(144, 202, 249, 0.15);\r
    }\r
\r
    100% {\r
        background-color: transparent;\r
    }\r
}\r
\r
@keyframes anki-playall-border-leave {\r
    0% {\r
        opacity: 0.6;\r
    }\r
\r
    100% {\r
        opacity: 0;\r
    }\r
}\r
\r
/* 持续播放时的脉冲效果 */\r
@keyframes anki-playall-pulse {\r
\r
    0%,\r
    100% {\r
        background-color: rgba(33, 150, 243, 0.05);\r
    }\r
\r
    50% {\r
        background-color: rgba(33, 150, 243, 0.12);\r
    }\r
}\r
\r
@keyframes anki-playall-border-pulse {\r
\r
    0%,\r
    100% {\r
        opacity: 0.7;\r
        box-shadow: 0 0 15px rgba(33, 150, 243, 0.4), inset 0 0 8px rgba(33, 150, 243, 0.1);\r
    }\r
\r
    50% {\r
        opacity: 1;\r
        box-shadow: 0 0 25px rgba(33, 150, 243, 0.6), inset 0 0 12px rgba(33, 150, 243, 0.15);\r
    }\r
}\r
\r
/* ============================================================================\r
   Bookmark Styles\r
   ============================================================================ */\r
\r
.anki-playall-btn[data-action="bookmark"].active {\r
    background: #ff9800;\r
    box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.4);\r
}\r
\r
.anki-playall-bookmark-count {\r
    color: rgba(255, 255, 255, 0.9);\r
    font-size: 12px;\r
    padding: 0 8px;\r
}\r
\r
.anki-playall-bookmark-count .count {\r
    font-weight: 600;\r
    color: #ff9800;\r
}\r
\r
.anki-playall-bookmarked {\r
    position: relative;\r
}\r
\r
.anki-playall-bookmarked::after {\r
    content: '🔖';\r
    position: absolute;\r
    top: -8px;\r
    right: -8px;\r
    font-size: 18px;\r
    z-index: 10;\r
}`;
  function setButtonState(el, state2, text) {
    if (!el) return;
    const node = el;
    if (!node.dataset.ankiOriginalText) {
      node.dataset.ankiOriginalText = node.textContent || "";
    }
    node.classList.remove("anki-feedback-pending", "anki-feedback-success", "anki-feedback-error");
    if (state2 === "idle") {
      node.textContent = node.dataset.ankiOriginalText;
      if (node.tagName === "BUTTON") node.disabled = false;
      return;
    }
    if (state2 === "pending") {
      node.classList.add("anki-feedback-pending");
      if (node.tagName === "BUTTON") node.disabled = true;
      node.textContent = text || "添加中…";
      return;
    }
    if (state2 === "success") {
      node.classList.add("anki-feedback-success");
      if (node.tagName === "BUTTON") node.disabled = false;
      node.textContent = text || "已添加";
      return;
    }
    if (state2 === "error") {
      node.classList.add("anki-feedback-error");
      if (node.tagName === "BUTTON") node.disabled = false;
      node.textContent = text || "添加失败";
    }
  }
  function revertButtonState(el) {
    if (!el) return;
    const node = el;
    node.classList.remove("anki-feedback-pending", "anki-feedback-success", "anki-feedback-error");
    if (node.tagName === "BUTTON") node.disabled = false;
    node.textContent = node.dataset.ankiOriginalText || node.textContent;
  }
  function getSuccessText(mediaType) {
    return mediaType === "picture" ? "图片添加成功" : "音频添加成功";
  }
  function injectStyles() {
    const css = modalCss;
    if (typeof _GM_addStyle === "function") {
      _GM_addStyle(css);
    } else {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    }
  }
  function showModal(opts) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "anki-modal-overlay";
      const modal = document.createElement("div");
      modal.className = "anki-modal";
      modal.innerHTML = `
      <header>${opts.title || ""}</header>
      <main>${opts.html || ""}</main>
      <footer>
        ${opts.allowCancel === false ? "" : `<button class="anki-btn">${opts.cancelText || "取消"}</button>`}
        <button class="anki-btn ${opts.danger ? "danger" : "primary"}">${opts.confirmText || "确定"}</button>
      </footer>
    `;
      overlay.appendChild(modal);
      function cleanup() {
        overlay.remove();
      }
      function onResolve(val) {
        cleanup();
        resolve(val);
      }
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay && opts.allowCancel !== false) onResolve(false);
      });
      const footer = modal.querySelector("footer");
      const buttons = Array.from(footer.querySelectorAll("button"));
      const cancelBtn = buttons.length === 2 ? buttons[0] : null;
      const confirmBtn = buttons[buttons.length - 1];
      if (cancelBtn) cancelBtn.addEventListener("click", () => onResolve(false));
      confirmBtn.addEventListener("click", async () => {
        if (opts.onConfirm) {
          try {
            const ok = await opts.onConfirm(modal);
            if (ok === false) return;
          } catch {
          }
        }
        onResolve(true);
      });
      document.body.appendChild(overlay);
    });
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((window.__svelte ??= {}).v ??= new Set()).add(PUBLIC_VERSION);
  }
  let legacy_mode_flag = false;
  let tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }
  enable_legacy_mode_flag();
  const PROPS_IS_IMMUTABLE = 1;
  const PROPS_IS_RUNES = 1 << 1;
  const PROPS_IS_UPDATED = 1 << 2;
  const PROPS_IS_BINDABLE = 1 << 3;
  const PROPS_IS_LAZY_INITIAL = 1 << 4;
  const UNINITIALIZED = Symbol();
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
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
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
  const MANAGED_EFFECT = 1 << 24;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const CONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const EAGER_EFFECT = 1 << 17;
  const HEAD_EFFECT = 1 << 18;
  const EFFECT_PRESERVED = 1 << 19;
  const USER_EFFECT = 1 << 20;
  const WAS_MARKED = 1 << 15;
  const REACTION_IS_UPDATING = 1 << 21;
  const ASYNC = 1 << 22;
  const ERROR_VALUE = 1 << 23;
  const STATE_SYMBOL = Symbol("$state");
  const LEGACY_PROPS = Symbol("legacy props");
  const STALE_REACTION = new class StaleReactionError extends Error {
    name = "StaleReactionError";
    message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
  }();
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
  function svelte_boundary_reset_onerror() {
    {
      throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
    }
  }
  function select_multiple_invalid_value() {
    {
      console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
    }
  }
  function svelte_boundary_reset_noop() {
    {
      console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
    }
  }
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      i: false,
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
    context.i = true;
    component_context = context.p;
    return (
{}
    );
  }
  function is_runes() {
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
  }
  let micro_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0 && !is_flushing_sync) {
      var tasks = micro_tasks;
      queueMicrotask(() => {
        if (tasks === micro_tasks) run_micro_tasks();
      });
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    while (micro_tasks.length > 0) {
      run_micro_tasks();
    }
  }
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if ((effect2.f & EFFECT_RAN) === 0) {
      if ((effect2.f & BOUNDARY_EFFECT) === 0) {
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
        } catch (e) {
          error = e;
        }
      }
      effect2 = effect2.parent;
    }
    throw error;
  }
  const batches = new Set();
  let current_batch = null;
  let previous_batch = null;
  let batch_values = null;
  let queued_root_effects = [];
  let last_scheduled_effect = null;
  let is_flushing = false;
  let is_flushing_sync = false;
  class Batch {
    committed = false;
current = new Map();
previous = new Map();
#commit_callbacks = new Set();
#discard_callbacks = new Set();
#pending = 0;
#blocking_pending = 0;
#deferred = null;
#dirty_effects = new Set();
#maybe_dirty_effects = new Set();
skipped_effects = new Set();
    is_fork = false;
    is_deferred() {
      return this.is_fork || this.#blocking_pending > 0;
    }
process(root_effects) {
      queued_root_effects = [];
      previous_batch = null;
      this.apply();
      var target = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: []
      };
      for (const root2 of root_effects) {
        this.#traverse_effect_tree(root2, target);
      }
      if (!this.is_fork) {
        this.#resolve();
      }
      if (this.is_deferred()) {
        this.#defer_effects(target.effects);
        this.#defer_effects(target.render_effects);
      } else {
        previous_batch = this;
        current_batch = null;
        flush_queued_effects(target.render_effects);
        flush_queued_effects(target.effects);
        previous_batch = null;
        this.#deferred?.resolve();
      }
      batch_values = null;
    }
#traverse_effect_tree(root2, target) {
      root2.f ^= CLEAN;
      var effect2 = root2.first;
      while (effect2 !== null) {
        var flags2 = effect2.f;
        var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
        var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
        var skip = is_skippable_branch || (flags2 & INERT) !== 0 || this.skipped_effects.has(effect2);
        if ((effect2.f & BOUNDARY_EFFECT) !== 0 && effect2.b?.is_pending()) {
          target = {
            parent: target,
            effect: effect2,
            effects: [],
            render_effects: []
          };
        }
        if (!skip && effect2.fn !== null) {
          if (is_branch) {
            effect2.f ^= CLEAN;
          } else if ((flags2 & EFFECT) !== 0) {
            target.effects.push(effect2);
          } else if (is_dirty(effect2)) {
            if ((effect2.f & BLOCK_EFFECT) !== 0) this.#dirty_effects.add(effect2);
            update_effect(effect2);
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
          if (parent === target.effect) {
            this.#defer_effects(target.effects);
            this.#defer_effects(target.render_effects);
            target =
target.parent;
          }
          effect2 = parent.next;
          parent = parent.parent;
        }
      }
    }
#defer_effects(effects) {
      for (const e of effects) {
        if ((e.f & DIRTY) !== 0) {
          this.#dirty_effects.add(e);
        } else if ((e.f & MAYBE_DIRTY) !== 0) {
          this.#maybe_dirty_effects.add(e);
        }
        this.#clear_marked(e.deps);
        set_signal_status(e, CLEAN);
      }
    }
#clear_marked(deps) {
      if (deps === null) return;
      for (const dep of deps) {
        if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
          continue;
        }
        dep.f ^= WAS_MARKED;
        this.#clear_marked(
dep.deps
        );
      }
    }
capture(source2, value) {
      if (!this.previous.has(source2)) {
        this.previous.set(source2, value);
      }
      if ((source2.f & ERROR_VALUE) === 0) {
        this.current.set(source2, source2.v);
        batch_values?.set(source2, source2.v);
      }
    }
    activate() {
      current_batch = this;
      this.apply();
    }
    deactivate() {
      if (current_batch !== this) return;
      current_batch = null;
      batch_values = null;
    }
    flush() {
      this.activate();
      if (queued_root_effects.length > 0) {
        flush_effects();
        if (current_batch !== null && current_batch !== this) {
          return;
        }
      } else if (this.#pending === 0) {
        this.process([]);
      }
      this.deactivate();
    }
    discard() {
      for (const fn of this.#discard_callbacks) fn(this);
      this.#discard_callbacks.clear();
    }
    #resolve() {
      if (this.#blocking_pending === 0) {
        for (const fn of this.#commit_callbacks) fn();
        this.#commit_callbacks.clear();
      }
      if (this.#pending === 0) {
        this.#commit();
      }
    }
    #commit() {
      if (batches.size > 1) {
        this.previous.clear();
        var previous_batch_values = batch_values;
        var is_earlier = true;
        var dummy_target = {
          parent: null,
          effect: null,
          effects: [],
          render_effects: []
        };
        for (const batch of batches) {
          if (batch === this) {
            is_earlier = false;
            continue;
          }
          const sources = [];
          for (const [source2, value] of this.current) {
            if (batch.current.has(source2)) {
              if (is_earlier && value !== batch.current.get(source2)) {
                batch.current.set(source2, value);
              } else {
                continue;
              }
            }
            sources.push(source2);
          }
          if (sources.length === 0) {
            continue;
          }
          const others = [...batch.current.keys()].filter((s) => !this.current.has(s));
          if (others.length > 0) {
            var prev_queued_root_effects = queued_root_effects;
            queued_root_effects = [];
            const marked = new Set();
            const checked = new Map();
            for (const source2 of sources) {
              mark_effects(source2, others, marked, checked);
            }
            if (queued_root_effects.length > 0) {
              current_batch = batch;
              batch.apply();
              for (const root2 of queued_root_effects) {
                batch.#traverse_effect_tree(root2, dummy_target);
              }
              batch.deactivate();
            }
            queued_root_effects = prev_queued_root_effects;
          }
        }
        current_batch = null;
        batch_values = previous_batch_values;
      }
      this.committed = true;
      batches.delete(this);
    }
increment(blocking) {
      this.#pending += 1;
      if (blocking) this.#blocking_pending += 1;
    }
decrement(blocking) {
      this.#pending -= 1;
      if (blocking) this.#blocking_pending -= 1;
      this.revive();
    }
    revive() {
      for (const e of this.#dirty_effects) {
        this.#maybe_dirty_effects.delete(e);
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (const e of this.#maybe_dirty_effects) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
      this.flush();
    }
oncommit(fn) {
      this.#commit_callbacks.add(fn);
    }
ondiscard(fn) {
      this.#discard_callbacks.add(fn);
    }
    settled() {
      return (this.#deferred ??= deferred()).promise;
    }
    static ensure() {
      if (current_batch === null) {
        const batch = current_batch = new Batch();
        batches.add(current_batch);
        if (!is_flushing_sync) {
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
      queue_micro_task(task);
    }
    apply() {
      return;
    }
  }
  function flushSync(fn) {
    var was_flushing_sync = is_flushing_sync;
    is_flushing_sync = true;
    try {
      var result;
      if (fn) ;
      while (true) {
        flush_tasks();
        if (queued_root_effects.length === 0) {
          current_batch?.flush();
          if (queued_root_effects.length === 0) {
            last_scheduled_effect = null;
            return (
result
            );
          }
        }
        flush_effects();
      }
    } finally {
      is_flushing_sync = was_flushing_sync;
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
        if (DEV) ;
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
    var i = 0;
    while (i < length) {
      var effect2 = effects[i++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        eager_block_effects = new Set();
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes === null) {
          if (effect2.teardown === null && effect2.ac === null) {
            unlink_effect(effect2);
          } else {
            effect2.fn = null;
          }
        }
        if (eager_block_effects?.size > 0) {
          old_values.clear();
          for (const e of eager_block_effects) {
            if ((e.f & (DESTROYED | INERT)) !== 0) continue;
            const ordered_effects = [e];
            let ancestor = e.parent;
            while (ancestor !== null) {
              if (eager_block_effects.has(ancestor)) {
                eager_block_effects.delete(ancestor);
                ordered_effects.push(ancestor);
              }
              ancestor = ancestor.parent;
            }
            for (let j = ordered_effects.length - 1; j >= 0; j--) {
              const e2 = ordered_effects[j];
              if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
              update_effect(e2);
            }
          }
          eager_block_effects.clear();
        }
      }
    }
    eager_block_effects = null;
  }
  function mark_effects(value, sources, marked, checked) {
    if (marked.has(value)) return;
    marked.add(value);
    if (value.reactions !== null) {
      for (const reaction of value.reactions) {
        const flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark_effects(
reaction,
            sources,
            marked,
            checked
          );
        } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
          set_signal_status(reaction, DIRTY);
          schedule_effect(
reaction
          );
        }
      }
    }
  }
  function depends_on(reaction, sources, checked) {
    const depends = checked.get(reaction);
    if (depends !== void 0) return depends;
    if (reaction.deps !== null) {
      for (const dep of reaction.deps) {
        if (sources.includes(dep)) {
          return true;
        }
        if ((dep.f & DERIVED) !== 0 && depends_on(
dep,
          sources,
          checked
        )) {
          checked.set(
dep,
            true
          );
          return true;
        }
      }
    }
    checked.set(reaction, false);
    return false;
  }
  function schedule_effect(signal) {
    var effect2 = last_scheduled_effect = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags2 = effect2.f;
      if (is_flushing && effect2 === active_effect && (flags2 & BLOCK_EFFECT) !== 0 && (flags2 & HEAD_EFFECT) === 0) {
        return;
      }
      if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags2 & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  function createSubscriber(start) {
    let subscribers = 0;
    let version = source(0);
    let stop;
    return () => {
      if (effect_tracking()) {
        get(version);
        render_effect(() => {
          if (subscribers === 0) {
            stop = untrack(() => start(() => increment(version)));
          }
          subscribers += 1;
          return () => {
            queue_micro_task(() => {
              subscribers -= 1;
              if (subscribers === 0) {
                stop?.();
                stop = void 0;
                increment(version);
              }
            });
          };
        });
      }
    };
  }
  var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED | BOUNDARY_EFFECT;
  function boundary(node, props, children) {
    new Boundary(node, props, children);
  }
  class Boundary {
parent;
    #pending = false;
#anchor;
#hydrate_open = null;
#props;
#children;
#effect;
#main_effect = null;
#pending_effect = null;
#failed_effect = null;
#offscreen_fragment = null;
#pending_anchor = null;
    #local_pending_count = 0;
    #pending_count = 0;
    #is_creating_fallback = false;
#effect_pending = null;
    #effect_pending_subscriber = createSubscriber(() => {
      this.#effect_pending = source(this.#local_pending_count);
      return () => {
        this.#effect_pending = null;
      };
    });
constructor(node, props, children) {
      this.#anchor = node;
      this.#props = props;
      this.#children = children;
      this.parent =
active_effect.b;
      this.#pending = !!this.#props.pending;
      this.#effect = block(() => {
        active_effect.b = this;
        {
          var anchor = this.#get_anchor();
          try {
            this.#main_effect = branch(() => children(anchor));
          } catch (error) {
            this.error(error);
          }
          if (this.#pending_count > 0) {
            this.#show_pending_snippet();
          } else {
            this.#pending = false;
          }
        }
        return () => {
          this.#pending_anchor?.remove();
        };
      }, flags);
    }
    #hydrate_resolved_content() {
      try {
        this.#main_effect = branch(() => this.#children(this.#anchor));
      } catch (error) {
        this.error(error);
      }
      this.#pending = false;
    }
    #hydrate_pending_content() {
      const pending = this.#props.pending;
      if (!pending) {
        return;
      }
      this.#pending_effect = branch(() => pending(this.#anchor));
      Batch.enqueue(() => {
        var anchor = this.#get_anchor();
        this.#main_effect = this.#run(() => {
          Batch.ensure();
          return branch(() => this.#children(anchor));
        });
        if (this.#pending_count > 0) {
          this.#show_pending_snippet();
        } else {
          pause_effect(
this.#pending_effect,
            () => {
              this.#pending_effect = null;
            }
          );
          this.#pending = false;
        }
      });
    }
    #get_anchor() {
      var anchor = this.#anchor;
      if (this.#pending) {
        this.#pending_anchor = create_text();
        this.#anchor.before(this.#pending_anchor);
        anchor = this.#pending_anchor;
      }
      return anchor;
    }
is_pending() {
      return this.#pending || !!this.parent && this.parent.is_pending();
    }
    has_pending_snippet() {
      return !!this.#props.pending;
    }
#run(fn) {
      var previous_effect = active_effect;
      var previous_reaction = active_reaction;
      var previous_ctx = component_context;
      set_active_effect(this.#effect);
      set_active_reaction(this.#effect);
      set_component_context(this.#effect.ctx);
      try {
        return fn();
      } catch (e) {
        handle_error(e);
        return null;
      } finally {
        set_active_effect(previous_effect);
        set_active_reaction(previous_reaction);
        set_component_context(previous_ctx);
      }
    }
    #show_pending_snippet() {
      const pending = (
this.#props.pending
      );
      if (this.#main_effect !== null) {
        this.#offscreen_fragment = document.createDocumentFragment();
        this.#offscreen_fragment.append(
this.#pending_anchor
        );
        move_effect(this.#main_effect, this.#offscreen_fragment);
      }
      if (this.#pending_effect === null) {
        this.#pending_effect = branch(() => pending(this.#anchor));
      }
    }
#update_pending_count(d) {
      if (!this.has_pending_snippet()) {
        if (this.parent) {
          this.parent.#update_pending_count(d);
        }
        return;
      }
      this.#pending_count += d;
      if (this.#pending_count === 0) {
        this.#pending = false;
        if (this.#pending_effect) {
          pause_effect(this.#pending_effect, () => {
            this.#pending_effect = null;
          });
        }
        if (this.#offscreen_fragment) {
          this.#anchor.before(this.#offscreen_fragment);
          this.#offscreen_fragment = null;
        }
      }
    }
update_pending_count(d) {
      this.#update_pending_count(d);
      this.#local_pending_count += d;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    }
    get_effect_pending() {
      this.#effect_pending_subscriber();
      return get(
this.#effect_pending
      );
    }
error(error) {
      var onerror = this.#props.onerror;
      let failed = this.#props.failed;
      if (this.#is_creating_fallback || !onerror && !failed) {
        throw error;
      }
      if (this.#main_effect) {
        destroy_effect(this.#main_effect);
        this.#main_effect = null;
      }
      if (this.#pending_effect) {
        destroy_effect(this.#pending_effect);
        this.#pending_effect = null;
      }
      if (this.#failed_effect) {
        destroy_effect(this.#failed_effect);
        this.#failed_effect = null;
      }
      var did_reset = false;
      var calling_on_error = false;
      const reset = () => {
        if (did_reset) {
          svelte_boundary_reset_noop();
          return;
        }
        did_reset = true;
        if (calling_on_error) {
          svelte_boundary_reset_onerror();
        }
        Batch.ensure();
        this.#local_pending_count = 0;
        if (this.#failed_effect !== null) {
          pause_effect(this.#failed_effect, () => {
            this.#failed_effect = null;
          });
        }
        this.#pending = this.has_pending_snippet();
        this.#main_effect = this.#run(() => {
          this.#is_creating_fallback = false;
          return branch(() => this.#children(this.#anchor));
        });
        if (this.#pending_count > 0) {
          this.#show_pending_snippet();
        } else {
          this.#pending = false;
        }
      };
      var previous_reaction = active_reaction;
      try {
        set_active_reaction(null);
        calling_on_error = true;
        onerror?.(error, reset);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, this.#effect && this.#effect.parent);
      } finally {
        set_active_reaction(previous_reaction);
      }
      if (failed) {
        queue_micro_task(() => {
          this.#failed_effect = this.#run(() => {
            Batch.ensure();
            this.#is_creating_fallback = true;
            try {
              return branch(() => {
                failed(
                  this.#anchor,
                  () => error,
                  () => reset
                );
              });
            } catch (error2) {
              invoke_error_boundary(
                error2,
this.#effect.parent
              );
              return null;
            } finally {
              this.#is_creating_fallback = false;
            }
          });
        });
      }
    }
  }
  function flatten(blockers, sync, async, fn) {
    const d = is_runes() ? derived : derived_safe_equal;
    if (async.length === 0 && blockers.length === 0) {
      fn(sync.map(d));
      return;
    }
    var batch = current_batch;
    var parent = (
active_effect
    );
    var restore = capture();
    function run2() {
      Promise.all(async.map((expression) => async_derived(expression))).then((result) => {
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
        invoke_error_boundary(error, parent);
      });
    }
    if (blockers.length > 0) {
      Promise.all(blockers).then(() => {
        restore();
        try {
          return run2();
        } finally {
          batch?.deactivate();
          unset_context();
        }
      });
    } else {
      run2();
    }
  }
  function capture() {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    var previous_batch2 = current_batch;
    return function restore(activate_batch = true) {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
      if (activate_batch) previous_batch2?.activate();
    };
  }
  function unset_context() {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
  }
function derived(fn) {
    var flags2 = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
active_reaction
    ) : null;
    if (active_effect !== null) {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags2,
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
function async_derived(fn, location) {
    let parent = (
active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var boundary2 = (
parent.b
    );
    var promise = (

void 0
    );
    var signal = source(
UNINITIALIZED
    );
    var should_suspend = !active_reaction;
    var deferreds = new Map();
    async_effect(() => {
      var d = deferred();
      promise = d.promise;
      try {
        Promise.resolve(fn()).then(d.resolve, d.reject).then(() => {
          if (batch === current_batch && batch.committed) {
            batch.deactivate();
          }
          unset_context();
        });
      } catch (error) {
        d.reject(error);
        unset_context();
      }
      var batch = (
current_batch
      );
      if (should_suspend) {
        var blocking = !boundary2.is_pending();
        boundary2.update_pending_count(1);
        batch.increment(blocking);
        deferreds.get(batch)?.reject(STALE_REACTION);
        deferreds.delete(batch);
        deferreds.set(batch, d);
      }
      const handler = (value, error = void 0) => {
        batch.activate();
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
          for (const [b, d2] of deferreds) {
            deferreds.delete(b);
            if (b === batch) break;
            d2.reject(STALE_REACTION);
          }
        }
        if (should_suspend) {
          boundary2.update_pending_count(-1);
          batch.decrement(blocking);
        }
      };
      d.promise.then(handler, (e) => handler(null, e || "unknown"));
    });
    teardown(() => {
      for (const d of deferreds.values()) {
        d.reject(STALE_REACTION);
      }
    });
    return new Promise((fulfil) => {
      function next(p) {
        function go() {
          if (p === promise) {
            fulfil(signal);
          } else {
            next(promise);
          }
        }
        p.then(go, go);
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
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
effects[i]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (parent.f & DESTROYED) === 0 ? (
parent
        ) : null;
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
        derived2.f &= ~WAS_MARKED;
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
      if (!current_batch?.is_fork) {
        derived2.v = value;
      }
      derived2.wv = increment_write_version();
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_values !== null) {
      if (effect_tracking() || current_batch?.is_fork) {
        batch_values.set(derived2, value);
      }
    } else {
      var status = (derived2.f & CONNECTED) === 0 ? MAYBE_DIRTY : CLEAN;
      set_signal_status(derived2, status);
    }
  }
  let eager_effects = new Set();
  const old_values = new Map();
  let eager_effects_deferred = false;
  function source(v, stack) {
    var signal = {
      f: 0,
v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
function state(v, stack) {
    const s = source(v);
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
  function mutate(source2, value) {
    set(
      source2,
      untrack(() => get(source2))
    );
    return value;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null &&

(!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && !current_sources?.includes(source2)) {
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
        set_signal_status(source2, (source2.f & CONNECTED) !== 0 ? CLEAN : MAYBE_DIRTY);
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
      if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
        flush_eager_effects();
      }
    }
    return value;
  }
  function flush_eager_effects() {
    eager_effects_deferred = false;
    var prev_is_updating_effect = is_updating_effect;
    set_is_updating_effect(true);
    const inspects = Array.from(eager_effects);
    try {
      for (const effect2 of inspects) {
        if ((effect2.f & CLEAN) !== 0) {
          set_signal_status(effect2, MAYBE_DIRTY);
        }
        if (is_dirty(effect2)) {
          update_effect(effect2);
        }
      }
    } finally {
      set_is_updating_effect(prev_is_updating_effect);
    }
    eager_effects.clear();
  }
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      if (!runes && reaction === active_effect) continue;
      var not_dirty = (flags2 & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags2 & DERIVED) !== 0) {
        var derived2 = (
reaction
        );
        batch_values?.delete(derived2);
        if ((flags2 & WAS_MARKED) === 0) {
          if (flags2 & CONNECTED) {
            reaction.f |= WAS_MARKED;
          }
          mark_reactions(derived2, MAYBE_DIRTY);
        }
      } else if (not_dirty) {
        if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
          eager_block_effects.add(
reaction
          );
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
              var p = proxy(exists ? target[prop2] : UNINITIALIZED);
              var s2 = state(p);
              return s2;
            });
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v = get(s);
            return v === UNINITIALIZED ? void 0 : v;
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
                var p = has ? proxy(target[prop2]) : UNINITIALIZED;
                var s2 = state(p);
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
            for (var i = value2; i <
s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target) {
                other_s = with_parent(() => state(UNINITIALIZED));
                sources.set(i + "", other_s);
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
            var p = with_parent(() => proxy(value2));
            set(s, p);
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
              var n = Number(prop2);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
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
  function is(a, b) {
    return Object.is(get_proxied_value(a), get_proxied_value(b));
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
    return (
first_child_getter.call(node)
    );
  }
function get_next_sibling(node) {
    return (
next_sibling_getter.call(node)
    );
  }
  function child(node, is_text) {
    {
      return get_first_child(node);
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
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            if (!evt.defaultPrevented) {
              for (
                const e of
evt.target.elements
              ) {
                e.__on_r?.();
              }
            }
          });
        },
{ capture: true }
      );
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
  function listen_to_event_and_reset_event(element, event2, handler, on_reset = handler) {
    element.addEventListener(event2, () => without_reactive_context(handler));
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset(true);
      };
    } else {
      element.__on_r = () => on_reset(true);
    }
    add_form_reset_listener();
  }
  function validate_effect(rune) {
    if (active_effect === null) {
      if (active_reaction === null) {
        effect_orphan();
      }
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
  function create_effect(type, fn, sync) {
    var parent = active_effect;
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes: null,
      f: type | DIRTY | CONNECTED,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      wv: 0,
      ac: null
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e2) {
        destroy_effect(effect2);
        throw e2;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var e = effect2;
    if (sync && e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last &&
(e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
    if (e !== null) {
      e.parent = parent;
      if (parent !== null) {
        push_effect(e, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived2 = (
active_reaction
        );
        (derived2.effects ??= []).push(e);
      }
    }
    return effect2;
  }
  function effect_tracking() {
    return active_reaction !== null && !untracking;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var flags2 = (
active_effect.f
    );
    var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & EFFECT_RAN) === 0;
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
  function render_effect(fn, flags2 = 0) {
    return create_effect(RENDER_EFFECT | flags2, fn, true);
  }
  function template_effect(fn, sync = [], async = [], blockers = []) {
    flatten(blockers, sync, async, (values) => {
      create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
    });
  }
  function block(fn, flags2 = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags2, fn, true);
    return effect2;
  }
  function branch(fn) {
    return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true);
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
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
      remove_effect_dom(
        effect2.nodes.start,
effect2.nodes.end
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.nodes && effect2.nodes.t;
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
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : get_next_sibling(node);
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
  function pause_effect(effect2, callback, destroy = true) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    var fn = () => {
      if (destroy) destroy_effect(effect2);
      if (callback) callback();
    };
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
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition of t) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 ||


(child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
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
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition of t) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  function move_effect(effect2, fragment) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    while (node !== null) {
      var next = node === end ? null : get_next_sibling(node);
      fragment.append(node);
      node = next;
    }
  }
  let captured_signals = null;
  function capture_signals(fn) {
    var previous_captured_signals = captured_signals;
    try {
      captured_signals = new Set();
      untrack(fn);
      if (previous_captured_signals !== null) {
        for (var signal of captured_signals) {
          previous_captured_signals.add(signal);
        }
      }
      return captured_signals;
    } finally {
      captured_signals = previous_captured_signals;
    }
  }
  function invalidate_inner_signals(fn) {
    for (var signal of capture_signals(fn)) {
      internal_set(signal, signal.v);
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
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags2 = reaction.f;
    if ((flags2 & DIRTY) !== 0) {
      return true;
    }
    if (flags2 & DERIVED) {
      reaction.f &= ~WAS_MARKED;
    }
    if ((flags2 & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      if (dependencies !== null) {
        var length = dependencies.length;
        for (var i = 0; i < length; i++) {
          var dependency = dependencies[i];
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
      if ((flags2 & CONNECTED) !== 0 &&

batch_values === null) {
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
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
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
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags2 = reaction.f;
    new_deps =
null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
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
        var i;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
          for (i = skipped_deps; i < deps.length; i++) {
            (deps[i].reactions ??= []).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i <
untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
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
      if ((dependency.f & CONNECTED) !== 0) {
        dependency.f ^= CONNECTED;
        dependency.f &= ~WAS_MARKED;
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
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags2 = effect2.f;
    if ((flags2 & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
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
  async function tick() {
    await Promise.resolve();
    flushSync();
  }
  function get(signal) {
    var flags2 = signal.f;
    var is_derived = (flags2 & DERIVED) !== 0;
    captured_signals?.add(signal);
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
            } else if (!new_deps.includes(signal)) {
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
    }
    if (is_destroying_effect) {
      if (old_values.has(signal)) {
        return old_values.get(signal);
      }
      if (is_derived) {
        var derived2 = (
signal
        );
        var value = derived2.v;
        if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
          value = execute_derived(derived2);
        }
        old_values.set(derived2, value);
        return value;
      }
    } else if (is_derived && (!batch_values?.has(signal) || current_batch?.is_fork && !effect_tracking())) {
      derived2 =
signal;
      if (is_dirty(derived2)) {
        update_derived(derived2);
      }
      if (is_updating_effect && effect_tracking() && (derived2.f & CONNECTED) === 0) {
        reconnect(derived2);
      }
    }
    if (batch_values?.has(signal)) {
      return batch_values.get(signal);
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function reconnect(derived2) {
    if (derived2.deps === null) return;
    derived2.f ^= CONNECTED;
    for (const dep of derived2.deps) {
      (dep.reactions ??= []).push(derived2);
      if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
        reconnect(
dep
        );
      }
    }
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
        } catch (e) {
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
            } catch (e) {
            }
          }
        }
      }
    }
  }
  const all_registered_events = new Set();
  const root_event_handles = new Set();
  function create_event(event_name, dom, handler, options = {}) {
    function target_handler(event2) {
      if (!options.capture) {
        handle_event_propagation.call(dom, event2);
      }
      if (!event2.cancelBubble) {
        return without_reactive_context(() => {
          return handler?.call(this, event2);
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
  function event(event_name, dom, handler, capture2, passive) {
    var options = { capture: capture2, passive };
    var target_handler = create_event(event_name, dom, handler, options);
    if (dom === document.body ||
dom === window ||
dom === document ||
dom instanceof HTMLMediaElement) {
      teardown(() => {
        dom.removeEventListener(event_name, target_handler, options);
      });
    }
  }
  let last_propagated_event = null;
  function handle_event_propagation(event2) {
    var handler_element = this;
    var owner_document = (
handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = event2.composedPath?.() || [];
    var current_target = (
path[0] || event2.target
    );
    last_propagated_event = event2;
    var path_idx = 0;
    var handled_at = last_propagated_event === event2 && event2.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element ===
window)) {
        event2.__root = handler_element;
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
path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, "currentTarget", {
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

event2.target === current_target)) {
            delegated.call(current_target, event2);
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
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
      event2.__root = handler_element;
      delete event2.currentTarget;
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
    if (effect2.nodes === null) {
      effect2.nodes = { start, end, a: null, t: null };
    }
  }
function from_html(content, flags2) {
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        node =

get_first_child(node);
      }
      var clone = (
is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
dom
    );
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  function set_text(text, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text.__t ??= text.nodeValue)) {
      text.__t = str;
      text.nodeValue = str + "";
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
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive });
        var n = document_listeners.get(event_name);
        if (n === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount2 = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      boundary(
anchor_node,
        {
          pending: () => {
          }
        },
        (anchor_node2) => {
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
          component = Component(anchor_node2, props) || {};
          if (context) {
            pop();
          }
        }
      );
      return () => {
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n = (
document_listeners.get(event_name)
          );
          if (--n === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          anchor_node.parentNode?.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount2);
    return component;
  }
  let mounted_components = new WeakMap();
  function unmount(component, options) {
    const fn = mounted_components.get(component);
    if (fn) {
      mounted_components.delete(component);
      return fn(options);
    }
    return Promise.resolve();
  }
  class BranchManager {
anchor;
#batches = new Map();
#onscreen = new Map();
#offscreen = new Map();
#outroing = new Set();
#transition = true;
constructor(anchor, transition = true) {
      this.anchor = anchor;
      this.#transition = transition;
    }
    #commit = () => {
      var batch = (
current_batch
      );
      if (!this.#batches.has(batch)) return;
      var key = (
this.#batches.get(batch)
      );
      var onscreen = this.#onscreen.get(key);
      if (onscreen) {
        resume_effect(onscreen);
        this.#outroing.delete(key);
      } else {
        var offscreen = this.#offscreen.get(key);
        if (offscreen) {
          this.#onscreen.set(key, offscreen.effect);
          this.#offscreen.delete(key);
          offscreen.fragment.lastChild.remove();
          this.anchor.before(offscreen.fragment);
          onscreen = offscreen.effect;
        }
      }
      for (const [b, k] of this.#batches) {
        this.#batches.delete(b);
        if (b === batch) {
          break;
        }
        const offscreen2 = this.#offscreen.get(k);
        if (offscreen2) {
          destroy_effect(offscreen2.effect);
          this.#offscreen.delete(k);
        }
      }
      for (const [k, effect2] of this.#onscreen) {
        if (k === key || this.#outroing.has(k)) continue;
        const on_destroy = () => {
          const keys = Array.from(this.#batches.values());
          if (keys.includes(k)) {
            var fragment = document.createDocumentFragment();
            move_effect(effect2, fragment);
            fragment.append(create_text());
            this.#offscreen.set(k, { effect: effect2, fragment });
          } else {
            destroy_effect(effect2);
          }
          this.#outroing.delete(k);
          this.#onscreen.delete(k);
        };
        if (this.#transition || !onscreen) {
          this.#outroing.add(k);
          pause_effect(effect2, on_destroy, false);
        } else {
          on_destroy();
        }
      }
    };
#discard = (batch) => {
      this.#batches.delete(batch);
      const keys = Array.from(this.#batches.values());
      for (const [k, branch2] of this.#offscreen) {
        if (!keys.includes(k)) {
          destroy_effect(branch2.effect);
          this.#offscreen.delete(k);
        }
      }
    };
ensure(key, fn) {
      var batch = (
current_batch
      );
      if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
        {
          this.#onscreen.set(
            key,
            branch(() => fn(this.anchor))
          );
        }
      }
      this.#batches.set(batch, key);
      {
        this.#commit();
      }
    }
  }
  function if_block(node, fn, elseif = false) {
    var branches = new BranchManager(node);
    var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
    function update_branch(condition, fn2) {
      branches.ensure(condition, fn2);
    }
    block(() => {
      var has_branch = false;
      fn((fn2, flag = true) => {
        has_branch = true;
        update_branch(flag, fn2);
      });
      if (!has_branch) {
        update_branch(false, null);
      }
    }, flags2);
  }
  const whitespace = [..." 	\n\r\f \v\uFEFF"];
  function to_class(value, hash, directives) {
    var classname = "" + value;
    if (directives) {
      for (var key in directives) {
        if (directives[key]) {
          classname = classname ? classname + " " + key : key;
        } else if (classname.length) {
          var len = key.length;
          var a = 0;
          while ((a = classname.indexOf(key, a)) >= 0) {
            var b = a + len;
            if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
              classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash, next_classes);
      {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else {
          dom.className = next_class_name;
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
  function bind_select_value(select, get2, set2 = get2) {
    var batches2 = new WeakSet();
    var mounting = true;
    listen_to_event_and_reset_event(select, "change", (is_reset) => {
      var query = is_reset ? "[selected]" : ":checked";
      var value;
      if (select.multiple) {
        value = [].map.call(select.querySelectorAll(query), get_option_value);
      } else {
        var selected_option = select.querySelector(query) ??
select.querySelector("option:not([disabled])");
        value = selected_option && get_option_value(selected_option);
      }
      set2(value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
    });
    effect(() => {
      var value = get2();
      if (select === document.activeElement) {
        var batch = (
previous_batch ?? current_batch
        );
        if (batches2.has(batch)) {
          return;
        }
      }
      select_option(select, value, mounting);
      if (mounting && value === void 0) {
        var selected_option = select.querySelector(":checked");
        if (selected_option !== null) {
          value = get_option_value(selected_option);
          set2(value);
        }
      }
      select.__value = value;
      mounting = false;
    });
    init_select(select);
  }
  function get_option_value(option) {
    if ("__value" in option) {
      return option.__value;
    } else {
      return option.value;
    }
  }
  function bind_value(input, get2, set2 = get2) {
    var batches2 = new WeakSet();
    listen_to_event_and_reset_event(input, "input", async (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
      await tick();
      if (value !== (value = get2())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var length = input.value.length;
        input.value = value ?? "";
        if (end !== null) {
          var new_length = input.value.length;
          if (start === end && end === length && new_length > length) {
            input.selectionStart = new_length;
            input.selectionEnd = new_length;
          } else {
            input.selectionStart = start;
            input.selectionEnd = Math.min(end, new_length);
          }
        }
      }
    });
    if (



untrack(get2) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
      if (current_batch !== null) {
        batches2.add(current_batch);
      }
    }
    render_effect(() => {
      var value = get2();
      if (input === document.activeElement) {
        var batch = (
previous_batch ?? current_batch
        );
        if (batches2.has(batch)) {
          return;
        }
      }
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  function bind_checked(input, get2, set2 = get2) {
    listen_to_event_and_reset_event(input, "change", (is_reset) => {
      var value = is_reset ? input.defaultChecked : input.checked;
      set2(value);
    });
    if (


untrack(get2) == null
    ) {
      set2(input.checked);
    }
    render_effect(() => {
      var value = get2();
      input.checked = Boolean(value);
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function init$1(immutable = false) {
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
  function reactive_import(fn) {
    var s = source(0);
    return function() {
      if (arguments.length === 1) {
        set(s, get(s) + 1);
        return arguments[0];
      } else {
        get(s);
        return fn();
      }
    };
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
  function prop(props, key, flags2, fallback) {
    var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
    var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
    var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
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
      setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : void 0);
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
    if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
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
    var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
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
  const DEFAULTS = Object.freeze({
    ANKI_CONNECT_URL: "http://127.0.0.1:8765",
    ANKI_CONNECT_KEY: null,
    IMAGE_FIELD_NAME: "Picture",
    AUDIO_FIELD_NAME: "SentenceAudio",
    EXAMPLE_INDEX: 0,
    CONFIRM_OVERWRITE: true,
    TARGET_NOTE_MODE: "recent",
    CAPTURE_TIMEOUT_MS: 2e3,
    OPEN_EDITOR_KEY: "e"
  });
  function getConfig() {
    const savedOpenEditorKey = _GM_getValue?.("openEditorKey");
    return {
      ANKI_CONNECT_URL: _GM_getValue?.("ankiUrl") || DEFAULTS.ANKI_CONNECT_URL,
      ANKI_CONNECT_KEY: _GM_getValue?.("ankiKey") || DEFAULTS.ANKI_CONNECT_KEY,
      IMAGE_FIELD_NAME: _GM_getValue?.("imageField") || DEFAULTS.IMAGE_FIELD_NAME,
      AUDIO_FIELD_NAME: _GM_getValue?.("audioField") || DEFAULTS.AUDIO_FIELD_NAME,
      EXAMPLE_INDEX: Number(_GM_getValue?.("exampleIndex") ?? DEFAULTS.EXAMPLE_INDEX) || 0,
      CONFIRM_OVERWRITE: Boolean(_GM_getValue?.("confirmOverwrite") ?? DEFAULTS.CONFIRM_OVERWRITE),
      TARGET_NOTE_MODE: _GM_getValue?.("targetNoteMode") || DEFAULTS.TARGET_NOTE_MODE,
      CAPTURE_TIMEOUT_MS: DEFAULTS.CAPTURE_TIMEOUT_MS,
OPEN_EDITOR_KEY: typeof savedOpenEditorKey === "string" ? savedOpenEditorKey : DEFAULTS.OPEN_EDITOR_KEY
    };
  }
  const CONFIG = { ...DEFAULTS };
  function getSettings() {
    const config = getConfig();
    return {
      ankiUrl: config.ANKI_CONNECT_URL,
      ankiKey: config.ANKI_CONNECT_KEY || "",
      imageField: config.IMAGE_FIELD_NAME,
      audioField: config.AUDIO_FIELD_NAME,
      exampleIndex: config.EXAMPLE_INDEX,
      confirmOverwrite: config.CONFIRM_OVERWRITE,
      targetNoteMode: config.TARGET_NOTE_MODE,
      openEditorKey: config.OPEN_EDITOR_KEY
    };
  }
  function saveSettings(s) {
    const openEditorKey = (s.openEditorKey ?? "").trim();
    _GM_setValue?.("ankiUrl", s.ankiUrl.trim());
    _GM_setValue?.("ankiKey", s.ankiKey.trim());
    _GM_setValue?.("imageField", s.imageField.trim());
    _GM_setValue?.("audioField", s.audioField.trim());
    _GM_setValue?.("exampleIndex", Number.isFinite(s.exampleIndex) ? s.exampleIndex : 0);
    _GM_setValue?.("confirmOverwrite", !!s.confirmOverwrite);
    _GM_setValue?.("targetNoteMode", s.targetNoteMode === "selected" ? "selected" : "recent");
    _GM_setValue?.("openEditorKey", openEditorKey);
  }
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  function hasProp(obj, key) {
    return isObject(obj) && key in obj;
  }
  function invokeAnkiConnect(action, params = {}) {
    const config = getConfig();
    const payload = { action, version: 6, params };
    if (config.ANKI_CONNECT_KEY) payload.key = config.ANKI_CONNECT_KEY;
    const endpoints = [config.ANKI_CONNECT_URL, "http://localhost:8765"];
    console.log(`[AnkiConnect] 调用: action="${action}", params=`, params);
    return new Promise((resolve, reject) => {
      let tried = 0;
      function tryNext() {
        if (tried >= endpoints.length) {
          console.error("[AnkiConnect] 所有端点连接失败");
          reject(new Error("Failed to connect to AnkiConnect. Is Anki running?"));
          return;
        }
        const url = endpoints[tried++];
        console.log(`[AnkiConnect] 尝试连接: ${url} (尝试 ${tried}/${endpoints.length})`);
        _GM_xmlhttpRequest({
          method: "POST",
          url,
          data: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
          onload: (res) => {
            console.log(`[AnkiConnect] 响应状态: ${res.status}`);
            console.log(`[AnkiConnect] 响应原始内容 (前500字符):`, res.responseText.substring(0, 500));
            try {
              const data = JSON.parse(res.responseText);
              console.log(`[AnkiConnect] 解析后的数据:`, data);
              if (hasProp(data, "error") && hasProp(data, "result")) {
                const envelope = data;
                if (envelope.error) {
                  console.error(`[AnkiConnect] API错误: ${envelope.error}`);
                  reject(new Error(envelope.error));
                } else {
                  console.log(`[AnkiConnect] ✓ 成功: action="${action}"`, envelope.result);
                  resolve(envelope.result);
                }
              } else if (hasProp(data, "result")) {
                console.log(`[AnkiConnect] ✓ 成功: action="${action}"`, data.result);
                resolve(data.result);
              } else {
                console.log(`[AnkiConnect] ✓ 成功: action="${action}"`, data);
                resolve(data);
              }
            } catch (e) {
              console.error("[AnkiConnect] 解析响应失败:", e);
              console.error("[AnkiConnect] 错误堆栈:", e instanceof Error ? e.stack : String(e));
              console.error("[AnkiConnect] 响应内容:", res.responseText.substring(0, 500));
              reject(new Error("Failed to parse AnkiConnect response: " + e));
            }
          },
          onerror: (err) => {
            console.warn(`[AnkiConnect] 连接失败: ${url}`, err);
            tryNext();
          }
        });
      }
      tryNext();
    });
  }
  async function getMostRecentNoteId() {
    console.log("[AnkiConnect] 获取最近笔记ID...");
    const recentCards = await invokeAnkiConnect("findCards", { query: "added:1" });
    console.log(`[AnkiConnect] 找到 ${recentCards?.length || 0} 张最近添加的卡片`);
    if (!recentCards || recentCards.length === 0) {
      console.error("[AnkiConnect] 过去24小时内未添加卡片");
      throw new Error("No cards added in the last 24 hours");
    }
    const mostRecentCard = Math.max(...recentCards);
    console.log(`[AnkiConnect] 最近卡片ID: ${mostRecentCard}`);
    const noteIds = await invokeAnkiConnect("cardsToNotes", { cards: [mostRecentCard] });
    const noteId = Array.isArray(noteIds) ? noteIds[0] : noteIds;
    if (!noteId) {
      console.error("[AnkiConnect] 无法将卡片解析为笔记");
      throw new Error("Could not resolve card to note");
    }
    console.log(`[AnkiConnect] 最近笔记ID: ${noteId}`);
    return noteId;
  }
  async function getNoteInfo(noteId) {
    console.log(`[AnkiConnect] getNoteInfo: noteId=${noteId}`);
    const noteInfoList = await invokeAnkiConnect("notesInfo", { notes: [noteId] });
    console.log(`[AnkiConnect] getNoteInfo 返回数据:`, noteInfoList);
    const noteInfo = Array.isArray(noteInfoList) ? noteInfoList[0] : noteInfoList;
    console.log(`[AnkiConnect] getNoteInfo 解析后:`, noteInfo);
    return noteInfo || null;
  }
  async function ensureFieldOnNote(noteId, fieldName) {
    console.log(`[AnkiConnect] 验证字段: noteId=${noteId}, fieldName="${fieldName}"`);
    const noteInfoList = await invokeAnkiConnect("notesInfo", { notes: [noteId] });
    const noteInfo = Array.isArray(noteInfoList) ? noteInfoList[0] : noteInfoList;
    if (!noteInfo) {
      console.error(`[AnkiConnect] 未找到笔记: ${noteId}`);
      throw new Error(`Note ${noteId} not found`);
    }
    console.log(`[AnkiConnect] 笔记类型: ${noteInfo.modelName}`);
    console.log(`[AnkiConnect] 可用字段: ${Object.keys(noteInfo.fields || {}).join(", ")}`);
    if (!noteInfo.fields || !(fieldName in noteInfo.fields)) {
      console.error(`[AnkiConnect] 字段 "${fieldName}" 不存在于笔记上`);
      throw new Error(`Field "${fieldName}" does not exist on the note`);
    }
    console.log(`[AnkiConnect] ✓ 字段验证通过`);
  }
  async function attachMedia(noteId, mediaType, media, fieldName) {
    console.log(`[AnkiConnect] attachMedia 开始: noteId=${noteId}, mediaType=${mediaType}, url=${media.url}, filename=${media.filename}, field=${fieldName}`);
    try {
      console.log("[AnkiConnect] 步骤1: 下载媒体文件到 Anki...");
      const storedFilename = await invokeAnkiConnect("storeMediaFile", {
        filename: media.filename,
        url: media.url
      });
      console.log(`[AnkiConnect] 媒体文件已存储: ${storedFilename}`);
      let fieldValue = "";
      if (mediaType === "picture") {
        fieldValue = `<img src="${storedFilename}">`;
        console.log(`[AnkiConnect] 构建图片字段值: ${fieldValue}`);
      } else {
        fieldValue = `[sound:${storedFilename}]`;
        console.log(`[AnkiConnect] 构建音频字段值: ${fieldValue}`);
      }
      console.log("[AnkiConnect] 步骤2: 更新笔记字段...");
      await invokeAnkiConnect("updateNoteFields", {
        note: {
          id: noteId,
          fields: {
            [fieldName]: fieldValue
          }
        }
      });
      console.log("[AnkiConnect] 字段更新请求已发送");
      console.log("[AnkiConnect] 步骤3: 验证字段是否真的更新了...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      const updatedNoteInfo = await getNoteInfo(noteId);
      console.log("[AnkiConnect] 更新后的笔记信息:", updatedNoteInfo);
      const actualFieldValue = updatedNoteInfo?.fields?.[fieldName]?.value || "";
      console.log(`[AnkiConnect] 字段 "${fieldName}" 的实际值:`, actualFieldValue);
      if (!actualFieldValue || actualFieldValue.trim().length === 0) {
        console.error(`[AnkiConnect] ✗ 验证失败: 字段 "${fieldName}" 为空！`);
        throw new Error(`Field "${fieldName}" is still empty after update`);
      }
      console.log("[AnkiConnect] ✓ 验证通过: 字段已有内容");
      console.log("[AnkiConnect] ✓ 媒体附加成功");
    } catch (error) {
      console.error("[AnkiConnect] ✗ attachMedia 失败:", error);
      throw error;
    }
  }
  async function getSelectedNoteIds() {
    console.log("[AnkiConnect] 获取选中笔记ID...");
    const ids = await invokeAnkiConnect("guiSelectedNotes");
    const result = Array.isArray(ids) ? ids : [];
    console.log(`[AnkiConnect] 选中笔记数量: ${result.length}`, result);
    return result;
  }
  async function openNoteEditor(noteId) {
    await invokeAnkiConnect("guiEditNote", { note: noteId });
  }
  var $$_import_CONFIG = reactive_import(() => CONFIG);
  var root_1 = from_html(`<div class="alert error svelte-ny9p3g"> </div>`);
  var root_2 = from_html(`<span> </span>`);
  var root = from_html(`<div class="ik-anki-overlay svelte-ny9p3g" role="button" tabindex="0" aria-label="关闭设置覆盖层"><div class="ik-anki-panel svelte-ny9p3g" role="dialog" aria-modal="true"><header class="svelte-ny9p3g"><h2 class="svelte-ny9p3g">设置（ImmersionKit → Anki）</h2> <button class="icon svelte-ny9p3g" aria-label="关闭">✕</button></header> <main class="svelte-ny9p3g"><!> <label for="anki-url" class="svelte-ny9p3g">AnkiConnect URL</label> <input id="anki-url" type="text" placeholder="http://127.0.0.1:8765" class="svelte-ny9p3g"/> <label for="anki-key" class="svelte-ny9p3g">AnkiConnect Key</label> <input id="anki-key" type="password" placeholder="（可选）" class="svelte-ny9p3g"/> <div class="row svelte-ny9p3g"><div class="col"><label for="image-field" class="svelte-ny9p3g">图片字段名</label> <input id="image-field" type="text" class="svelte-ny9p3g"/></div> <div class="col"><label for="audio-field" class="svelte-ny9p3g">音频字段名</label> <input id="audio-field" type="text" class="svelte-ny9p3g"/></div></div> <div class="row svelte-ny9p3g"><div class="col"><label for="example-index" class="svelte-ny9p3g">示例索引</label> <input id="example-index" type="number" min="0" class="svelte-ny9p3g"/></div> <div class="col checkbox svelte-ny9p3g"><label class="svelte-ny9p3g"><input type="checkbox" class="svelte-ny9p3g"/> 覆盖前确认</label></div></div> <label for="open-editor-key" class="svelte-ny9p3g">添加后按快捷键打开编辑器（留空禁用）</label> <input id="open-editor-key" type="text" maxlength="16" placeholder="e" class="svelte-ny9p3g"/> <div class="row svelte-ny9p3g"><div class="col"><label for="target-mode" class="svelte-ny9p3g">目标笔记</label> <select id="target-mode"><option>最近添加的笔记</option><option>浏览器中选中的笔记</option></select></div></div> <div class="test svelte-ny9p3g"><button class="secondary svelte-ny9p3g"> </button> <!></div></main> <footer class="svelte-ny9p3g"><button class="ghost svelte-ny9p3g">取消</button> <button class="primary svelte-ny9p3g">保存</button></footer></div> <div class="ik-anki-focus-guard" aria-hidden="true" tabindex="-1"></div> <div class="ik-anki-focus-guard" aria-hidden="true" tabindex="-1"></div></div>`);
  function Settings($$anchor, $$props) {
    push($$props, false);
    let initial = prop($$props, "initial", 24, () => ({
      ankiUrl: $$_import_CONFIG().ANKI_CONNECT_URL,
      ankiKey: $$_import_CONFIG().ANKI_CONNECT_KEY || "",
      imageField: $$_import_CONFIG().IMAGE_FIELD_NAME,
      audioField: $$_import_CONFIG().AUDIO_FIELD_NAME,
      exampleIndex: $$_import_CONFIG().EXAMPLE_INDEX,
      confirmOverwrite: $$_import_CONFIG().CONFIRM_OVERWRITE,
      targetNoteMode: $$_import_CONFIG().TARGET_NOTE_MODE,
      openEditorKey: $$_import_CONFIG().OPEN_EDITOR_KEY
    }));
    let onClose = prop($$props, "onClose", 8, () => {
    });
    let state2 = mutable_source({ ...initial() });
    let testing = mutable_source(false);
    let testMessage = mutable_source("");
    let testOk = mutable_source(null);
    let error = mutable_source("");
    function validate() {
      set(error, "");
      if (!get(state2).ankiUrl || !/^https?:\/\//i.test(get(state2).ankiUrl)) {
        set(error, "AnkiConnect URL 无效");
        return false;
      }
      if (!Number.isFinite(get(state2).exampleIndex) || get(state2).exampleIndex < 0) {
        set(error, "示例索引必须为非负数");
        return false;
      }
      return true;
    }
    async function onSave() {
      if (!validate()) return;
      saveSettings({ ...get(state2) });
      onClose()();
    }
    async function onTest() {
      set(testOk, null);
      set(testMessage, "");
      set(testing, true);
      const prevUrl = $$_import_CONFIG().ANKI_CONNECT_URL;
      const prevKey = $$_import_CONFIG().ANKI_CONNECT_KEY;
      try {
        $$_import_CONFIG($$_import_CONFIG().ANKI_CONNECT_URL = get(state2).ankiUrl.trim());
        $$_import_CONFIG($$_import_CONFIG().ANKI_CONNECT_KEY = get(state2).ankiKey.trim() || null);
        const version = await invokeAnkiConnect("version");
        set(testOk, true);
        set(testMessage, `连接成功，版本 ${version}`);
      } catch (e) {
        set(testOk, false);
        set(testMessage, e instanceof Error ? e.message : "连接失败");
      } finally {
        $$_import_CONFIG($$_import_CONFIG().ANKI_CONNECT_URL = prevUrl);
        $$_import_CONFIG($$_import_CONFIG().ANKI_CONNECT_KEY = prevKey);
        set(testing, false);
      }
    }
    init$1();
    var div = root();
    var div_1 = child(div);
    var header = child(div_1);
    var button = sibling(child(header), 2);
    var main = sibling(header, 2);
    var node = child(main);
    {
      var consequent = ($$anchor2) => {
        var div_2 = root_1();
        var text = child(div_2);
        template_effect(() => set_text(text, get(error)));
        append($$anchor2, div_2);
      };
      if_block(node, ($$render) => {
        if (get(error)) $$render(consequent);
      });
    }
    var input = sibling(node, 4);
    var input_1 = sibling(input, 4);
    var div_3 = sibling(input_1, 2);
    var div_4 = child(div_3);
    var input_2 = sibling(child(div_4), 2);
    var div_5 = sibling(div_4, 2);
    var input_3 = sibling(child(div_5), 2);
    var div_6 = sibling(div_3, 2);
    var div_7 = child(div_6);
    var input_4 = sibling(child(div_7), 2);
    var div_8 = sibling(div_7, 2);
    var label = child(div_8);
    var input_5 = child(label);
    var input_6 = sibling(div_6, 4);
    var div_9 = sibling(input_6, 2);
    var div_10 = child(div_9);
    var select = sibling(child(div_10), 2);
    template_effect(() => {
      get(state2);
      invalidate_inner_signals(() => {
      });
    });
    var option = child(select);
    option.value = option.__value = "recent";
    var option_1 = sibling(option);
    option_1.value = option_1.__value = "selected";
    var div_11 = sibling(div_9, 2);
    var button_1 = child(div_11);
    var text_1 = child(button_1);
    var node_1 = sibling(button_1, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var span = root_2();
        let classes;
        var text_2 = child(span);
        template_effect(() => {
          classes = set_class(span, 1, "svelte-ny9p3g", null, classes, { ok: get(testOk), fail: !get(testOk) });
          set_text(text_2, get(testMessage));
        });
        append($$anchor2, span);
      };
      if_block(node_1, ($$render) => {
        if (get(testOk) !== null) $$render(consequent_1);
      });
    }
    var footer = sibling(main, 2);
    var button_2 = child(footer);
    var button_3 = sibling(button_2, 2);
    template_effect(() => {
      button_1.disabled = get(testing);
      set_text(text_1, get(testing) ? "测试中…" : "测试连接");
    });
    event("click", button, function(...$$args) {
      onClose()?.apply(this, $$args);
    });
    bind_value(input, () => get(state2).ankiUrl, ($$value) => mutate(state2, get(state2).ankiUrl = $$value));
    bind_value(input_1, () => get(state2).ankiKey, ($$value) => mutate(state2, get(state2).ankiKey = $$value));
    bind_value(input_2, () => get(state2).imageField, ($$value) => mutate(state2, get(state2).imageField = $$value));
    bind_value(input_3, () => get(state2).audioField, ($$value) => mutate(state2, get(state2).audioField = $$value));
    bind_value(input_4, () => get(state2).exampleIndex, ($$value) => mutate(state2, get(state2).exampleIndex = $$value));
    bind_checked(input_5, () => get(state2).confirmOverwrite, ($$value) => mutate(state2, get(state2).confirmOverwrite = $$value));
    bind_value(input_6, () => get(state2).openEditorKey, ($$value) => mutate(state2, get(state2).openEditorKey = $$value));
    bind_select_value(select, () => get(state2).targetNoteMode, ($$value) => mutate(state2, get(state2).targetNoteMode = $$value));
    event("click", button_1, onTest);
    event("click", button_2, function(...$$args) {
      onClose()?.apply(this, $$args);
    });
    event("click", button_3, onSave);
    event("click", div, (e) => {
      if (e.target === e.currentTarget) onClose()();
    });
    event("keydown", div, (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") onClose()();
    });
    append($$anchor, div);
    pop();
  }
  function openSettingsOverlay() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const app = mount(Settings, {
      target: container,
      props: {
        initial: getSettings(),
        onClose: () => {
          unmount(app);
          container.remove();
        }
      }
    });
  }
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  function resolveAbsoluteUrl(srcAttr) {
    try {
      return new URL(srcAttr, window.location.origin).href;
    } catch {
      return srcAttr;
    }
  }
  function filenameFromUrl(u, fallback) {
    try {
      const name = (new URL(u).pathname.split("/").pop() || "").split("?")[0];
      return decodeURIComponent(name) || fallback;
    } catch {
      const p = (u || "").split("/").pop() || "";
      return decodeURIComponent(p.split("?")[0]) || fallback;
    }
  }
  function isHttpUrl(text) {
    return typeof text === "string" && /^https?:\/\//i.test(text);
  }
  function $all(sel, root2 = document) {
    return Array.from(root2.querySelectorAll(sel));
  }
  function waitForElement(selector, timeoutMs = 1e4) {
    return new Promise((resolve) => {
      const existing = document.querySelector(selector);
      if (existing) {
        resolve(existing);
        return;
      }
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }, timeoutMs);
    });
  }
  function isTextInputTarget(target) {
    if (!target) return false;
    const el = target;
    const tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    return Boolean(el.isContentEditable);
  }
  function findSecondaryMenuFromTrigger(triggerEl) {
    if (!triggerEl) return null;
    const menu = triggerEl.closest(".ui.secondary.menu");
    if (menu) return menu;
    const container = triggerEl.closest("span.mobile.or.lower.hidden") || triggerEl.closest("span.mobile.only");
    if (container) {
      const m = container.querySelector(".ui.secondary.menu");
      if (m) return m;
    }
    return null;
  }
  function findShellAfterItemFromMenu(menu) {
    if (!menu) return null;
    const span = menu.closest("span.mobile.or.lower.hidden") || menu.closest("span.mobile.only");
    if (!span) return null;
    return span;
  }
  function findMiningAnchor(menu) {
    if (!menu) return null;
    const items = $all("a.item", menu);
    const a = items.find((el) => /mining/i.test((el.textContent || "").trim()));
    return a || null;
  }
  function findActiveMiningSegment(shell) {
    if (!shell) return null;
    return shell.querySelector("div.ui.segment.active.tab, div.ui.tab.segment.active, div.ui.segment.active") || null;
  }
  function findSoundButton(seg) {
    if (!seg) return null;
    const btns = $all("button.ui.basic.icon.left.labeled.button, button.ui.icon.button, button", seg);
    const b = btns.find(
      (el) => !!(el.querySelector("i.sound.icon") || /sound|audio/i.test((el.textContent || "").trim()))
    );
    return b || null;
  }
  async function captureAudioUrlFromMining(triggerEl) {
    const menu = findSecondaryMenuFromTrigger(triggerEl);
    if (!menu) return null;
    const miningA = findMiningAnchor(menu);
    if (!miningA) return null;
    if (!miningA.classList.contains("active")) {
      try {
        miningA.click();
      } catch {
      }
      await sleep(120);
    }
    const shell = findShellAfterItemFromMenu(menu);
    if (!shell) return null;
    const seg = findActiveMiningSegment(shell);
    if (!seg) return null;
    const soundBtn = findSoundButton(seg);
    if (!soundBtn) return null;
    const captured = { fromWriteText: null, fromCopy: null, done: false };
    const onCopy = (e) => {
      try {
        const t = e.clipboardData?.getData("text/plain");
        if (t && !captured.done) {
          captured.fromCopy = String(t);
          captured.done = true;
          cleanup();
        }
      } catch {
      }
    };
    document.addEventListener("copy", onCopy, true);
    const clip = navigator.clipboard;
    let restore = () => {
    };
    try {
      const orig = clip.writeText.bind(clip);
      clip.writeText = async function(text) {
        if (!captured.done && isHttpUrl(text)) {
          captured.fromWriteText = String(text);
          captured.done = true;
          cleanup();
        }
        try {
          return await orig(String(text ?? ""));
        } catch (e) {
          return Promise.reject(e);
        }
      };
      restore = () => {
        try {
          clip.writeText = orig;
        } catch {
        }
      };
    } catch {
      try {
        const proto = Object.getPrototypeOf(clip);
        const orig2 = proto.writeText.bind(clip);
        Object.defineProperty(proto, "writeText", {
          configurable: true,
          value: async function(text) {
            if (!captured.done && isHttpUrl(text)) {
              captured.fromWriteText = String(text);
              captured.done = true;
              cleanup();
            }
            try {
              return await orig2(String(text ?? ""));
            } catch (e) {
              return Promise.reject(e);
            }
          }
        });
        restore = () => {
          try {
            Object.defineProperty(Object.getPrototypeOf(clip), "writeText", { configurable: true, value: orig2 });
          } catch {
          }
        };
      } catch {
      }
    }
    function cleanup() {
      try {
        document.removeEventListener("copy", onCopy, true);
      } catch {
      }
      try {
        restore();
      } catch {
      }
    }
    try {
      soundBtn.click();
    } catch {
    }
    const t0 = performance.now();
    const { CAPTURE_TIMEOUT_MS } = getConfig();
    while (!captured.done && performance.now() - t0 < CAPTURE_TIMEOUT_MS) {
      await sleep(40);
    }
    cleanup();
    const finalUrl = captured.fromWriteText || captured.fromCopy;
    if (!finalUrl || !isHttpUrl(finalUrl)) return null;
    const filename = filenameFromUrl(finalUrl, "audio.mp3");
    return { url: finalUrl, filename };
  }
  const SELECTORS = {
EXAMPLES_CONTAINER: ".ui.divided.items",
SECONDARY_MENU: ".ui.secondary.menu",
NEXT_PAGE: [
      'a.icon.item[aria-label="Next item"]',
      "a.icon.item:has(i.right.chevron.icon)",
      ".ui.pagination.menu a.icon.item:last-child:not(.disabled)"
    ],
PLAYALL_HIGHLIGHT: ".anki-playall-highlight"
  };
  const CLASSES = {
    HIGHLIGHT: "anki-playall-highlight",
    LEAVING: "anki-playall-leaving",
    BOOKMARKED: "anki-playall-bookmarked"
  };
  function getExampleGroups() {
    const container = document.querySelector(SELECTORS.EXAMPLES_CONTAINER);
    if (!container) return [];
    const children = Array.from(container.children);
    const groups = [];
    for (let i = 0; i + 4 < children.length; i += 5) {
      groups.push({
        exampleDesktop: children[i],
        buttonSpanDesktop: children[i + 1],
        exampleMobile: children[i + 2],
        buttonSpanMobile: children[i + 3],
        contextMenu: children[i + 4],
        index: Math.floor(i / 5)
      });
    }
    return groups;
  }
  function getExampleItems() {
    const groups = getExampleGroups();
    return groups.map((g) => g.exampleDesktop);
  }
  function getExampleIndexFromMenu(menuEl) {
    const container = document.querySelector(SELECTORS.EXAMPLES_CONTAINER);
    if (!container) return 0;
    const children = Array.from(container.children);
    const spanIndex = children.findIndex((child2) => child2.contains(menuEl));
    if (spanIndex === -1) return 0;
    return Math.floor(spanIndex / 5);
  }
  function validatePageStructure() {
    const container = document.querySelector(SELECTORS.EXAMPLES_CONTAINER);
    if (!container) {
      return { valid: false, reason: `No ${SELECTORS.EXAMPLES_CONTAINER} container found` };
    }
    const children = Array.from(container.children);
    if (children.length === 0) {
      return { valid: false, reason: "Container is empty" };
    }
    if (children.length % 5 !== 0) {
      console.warn(`ImmersionKit → Anki: Unexpected children count: ${children.length} (expected multiple of 5)`);
    }
    if (children.length >= 5) {
      const firstExample = children[0];
      const firstButtonSpan = children[1];
      const hasExpectedPattern = firstExample?.classList.contains("item") && firstButtonSpan?.tagName === "SPAN" && firstButtonSpan?.querySelector(SELECTORS.SECONDARY_MENU);
      if (!hasExpectedPattern) {
        return { valid: false, reason: "Structure pattern mismatch" };
      }
    }
    return { valid: true };
  }
  class StateManager {
    state;
    listeners = new Set();
    constructor(initialState) {
      this.state = { ...initialState };
    }
getState() {
      return { ...this.state };
    }
setState(partial) {
      this.state = { ...this.state, ...partial };
      this.notifyListeners();
    }
subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }
notifyListeners() {
      const currentState = this.getState();
      for (const fn of this.listeners) {
        try {
          fn(currentState);
        } catch (e) {
          console.error("[StateManager] Listener error:", e);
        }
      }
    }
  }
  const stateManager = new StateManager({
    status: "idle",
    currentIndex: 0,
    totalOnPage: 0,
    loopEnabled: false,
    bookmarkedIndices: new Set(),
    wasSkipped: false
  });
  let currentAudio = null;
  let skipResolve = null;
  let shortcutRegistered = false;
  function onStateChange(fn) {
    return stateManager.subscribe(fn);
  }
  function getState() {
    const s = stateManager.getState();
    return {
      status: s.status,
      currentIndex: s.currentIndex,
      totalOnPage: s.totalOnPage,
      loopEnabled: s.loopEnabled,
      bookmarkedIndices: s.bookmarkedIndices
    };
  }
  function highlightExample(index) {
    const groups = getExampleGroups();
    const group = groups[index];
    if (!group) return;
    document.querySelectorAll(SELECTORS.PLAYALL_HIGHLIGHT).forEach((el) => {
      el.classList.remove(CLASSES.HIGHLIGHT);
      if (el !== group.exampleDesktop) {
        el.classList.add(CLASSES.LEAVING);
        setTimeout(() => {
          el.classList.remove(CLASSES.LEAVING);
        }, 800);
      }
    });
    document.querySelectorAll(`.${CLASSES.LEAVING}`).forEach((el) => {
      if (el === group.exampleDesktop) {
        el.classList.remove(CLASSES.LEAVING);
      }
    });
    group.exampleDesktop.classList.add(CLASSES.HIGHLIGHT);
    group.exampleDesktop.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function updateBookmarkVisuals() {
    const groups = getExampleGroups();
    const { bookmarkedIndices } = stateManager.getState();
    groups.forEach((group, idx) => {
      if (bookmarkedIndices.has(idx)) {
        group.exampleDesktop.classList.add(CLASSES.BOOKMARKED);
      } else {
        group.exampleDesktop.classList.remove(CLASSES.BOOKMARKED);
      }
    });
  }
  function clearHighlight() {
    document.querySelectorAll(SELECTORS.PLAYALL_HIGHLIGHT).forEach((el) => {
      el.classList.remove(CLASSES.HIGHLIGHT);
    });
  }
  function getNextPageButton() {
    for (const sel of SELECTORS.NEXT_PAGE) {
      const btn = document.querySelector(sel);
      if (btn && !btn.classList.contains("disabled")) {
        return btn;
      }
    }
    return null;
  }
  function waitForPageLoad(timeoutMs = 5e3) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const check = () => {
        const groups = getExampleGroups();
        if (groups.length > 0) {
          resolve(true);
          return;
        }
        if (Date.now() - startTime > timeoutMs) {
          resolve(false);
          return;
        }
        setTimeout(check, 200);
      };
      setTimeout(check, 300);
    });
  }
  async function goToNextPage() {
    const btn = getNextPageButton();
    if (!btn) return false;
    btn.click();
    return waitForPageLoad();
  }
  async function playAudioAtIndex(index) {
    const groups = getExampleGroups();
    if (index < 0 || index >= groups.length) return false;
    const group = groups[index];
    const triggerEl = group.buttonSpanDesktop;
    try {
      const captured = await captureAudioUrlFromMining(triggerEl);
      if (!captured || !captured.url) {
        console.warn(`[PlayAll] Could not capture audio for index ${index}`);
        return false;
      }
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      return new Promise((resolve) => {
        const audio = new Audio(captured.url);
        currentAudio = audio;
        const cleanup = () => {
          skipResolve = null;
          currentAudio = null;
        };
        skipResolve = () => {
          cleanup();
          resolve(true);
        };
        audio.addEventListener("ended", () => {
          cleanup();
          resolve(true);
        });
        audio.addEventListener("error", (e) => {
          console.error("[PlayAll] Audio error:", e);
          cleanup();
          resolve(false);
        });
        audio.play().catch((err) => {
          console.error("[PlayAll] Play failed:", err);
          cleanup();
          resolve(false);
        });
      });
    } catch (err) {
      console.error("[PlayAll] Error playing audio at index", index, err);
      return false;
    }
  }
  async function playLoop() {
    while (stateManager.getState().status === "playing") {
      const groups = getExampleGroups();
      stateManager.setState({ totalOnPage: groups.length });
      const state2 = stateManager.getState();
      if (state2.currentIndex >= groups.length) {
        const hasNextPage = await goToNextPage();
        if (hasNextPage) {
          stateManager.setState({ currentIndex: 0 });
          continue;
        } else {
          if (state2.loopEnabled) {
            stateManager.setState({ currentIndex: 0 });
            continue;
          } else {
            stateManager.setState({ status: "stopped", currentIndex: 0 });
            clearHighlight();
            return;
          }
        }
      }
      highlightExample(state2.currentIndex);
      await playAudioAtIndex(state2.currentIndex);
      if (stateManager.getState().status === "paused") {
        await new Promise((resolve) => {
          const unsubscribe = onStateChange((s) => {
            if (s.status !== "paused") {
              unsubscribe();
              resolve();
            }
          });
        });
        if (stateManager.getState().status === "stopped") {
          clearHighlight();
          return;
        }
      }
      if (stateManager.getState().status === "stopped") {
        clearHighlight();
        return;
      }
      const currentState = stateManager.getState();
      if (!currentState.wasSkipped) {
        stateManager.setState({ currentIndex: currentState.currentIndex + 1 });
      }
      stateManager.setState({ wasSkipped: false });
    }
  }
  function startPlayAll(fromIndex = 0) {
    if (stateManager.getState().status === "playing") return;
    stateManager.setState({
      status: "playing",
      currentIndex: fromIndex,
      totalOnPage: getExampleGroups().length
    });
    playLoop();
  }
  function pausePlayback() {
    if (stateManager.getState().status !== "playing") return;
    stateManager.setState({ status: "paused" });
    if (currentAudio) {
      currentAudio.pause();
    }
  }
  function resumePlayback() {
    if (stateManager.getState().status !== "paused") return;
    stateManager.setState({ status: "playing" });
    if (currentAudio) {
      currentAudio.play().catch(console.error);
    }
    playLoop();
  }
  function stopPlayback() {
    stateManager.setState({ status: "stopped", currentIndex: 0 });
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    clearHighlight();
  }
  function toggleLoop() {
    const { loopEnabled } = stateManager.getState();
    stateManager.setState({ loopEnabled: !loopEnabled });
  }
  function toggleBookmark() {
    const { currentIndex, bookmarkedIndices } = stateManager.getState();
    const newBookmarks = new Set(bookmarkedIndices);
    if (newBookmarks.has(currentIndex)) {
      newBookmarks.delete(currentIndex);
    } else {
      newBookmarks.add(currentIndex);
    }
    stateManager.setState({ bookmarkedIndices: newBookmarks });
    updateBookmarkVisuals();
  }
  function skipToNextBookmark() {
    const state2 = stateManager.getState();
    if (state2.status === "idle" || state2.status === "stopped") return;
    if (state2.bookmarkedIndices.size === 0) return;
    const sortedBookmarks = Array.from(state2.bookmarkedIndices).sort((a, b) => a - b);
    const nextBookmark = sortedBookmarks.find((idx) => idx > state2.currentIndex);
    if (nextBookmark !== void 0) {
      stateManager.setState({ wasSkipped: true, currentIndex: nextBookmark });
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      if (skipResolve) {
        skipResolve();
      }
    } else if (state2.loopEnabled && sortedBookmarks.length > 0) {
      stateManager.setState({ wasSkipped: true, currentIndex: sortedBookmarks[0] });
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      if (skipResolve) {
        skipResolve();
      }
    }
  }
  function skipToPrevBookmark() {
    const state2 = stateManager.getState();
    if (state2.status === "idle" || state2.status === "stopped") return;
    if (state2.bookmarkedIndices.size === 0) return;
    const sortedBookmarks = Array.from(state2.bookmarkedIndices).sort((a, b) => b - a);
    const prevBookmark = sortedBookmarks.find((idx) => idx < state2.currentIndex);
    if (prevBookmark !== void 0) {
      stateManager.setState({ wasSkipped: true, currentIndex: prevBookmark });
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      if (skipResolve) {
        skipResolve();
      }
    } else if (state2.loopEnabled && sortedBookmarks.length > 0) {
      stateManager.setState({ wasSkipped: true, currentIndex: sortedBookmarks[0] });
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      if (skipResolve) {
        skipResolve();
      }
    }
  }
  function skipToNext() {
    const state2 = stateManager.getState();
    if (state2.status === "idle" || state2.status === "stopped") return;
    stateManager.setState({ wasSkipped: true, currentIndex: state2.currentIndex + 1 });
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (skipResolve) {
      skipResolve();
    }
  }
  function skipToPrevious() {
    const state2 = stateManager.getState();
    if (state2.status === "idle" || state2.status === "stopped") return;
    const newIndex = state2.currentIndex > 0 ? state2.currentIndex - 1 : 0;
    stateManager.setState({ wasSkipped: true, currentIndex: newIndex });
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (skipResolve) {
      skipResolve();
    }
  }
  function handleKeydown(e) {
    if (isTextInputTarget(e.target)) {
      return;
    }
    const state2 = stateManager.getState();
    switch (e.key.toLowerCase()) {
      case " ":
        e.preventDefault();
        if (state2.status === "playing") {
          pausePlayback();
        } else if (state2.status === "paused") {
          resumePlayback();
        } else if (state2.status === "idle" || state2.status === "stopped") {
          startPlayAll(0);
        }
        break;
      case "escape":
        if (state2.status !== "idle" && state2.status !== "stopped") {
          e.preventDefault();
          stopPlayback();
        }
        break;
      case "arrowright":
        if (state2.status === "playing" || state2.status === "paused") {
          e.preventDefault();
          if (e.shiftKey) {
            skipToNextBookmark();
          } else {
            skipToNext();
          }
        }
        break;
      case "arrowleft":
        if (state2.status === "playing" || state2.status === "paused") {
          e.preventDefault();
          if (e.shiftKey) {
            skipToPrevBookmark();
          } else {
            skipToPrevious();
          }
        }
        break;
      case "l":
        e.preventDefault();
        toggleLoop();
        break;
      case "b":
        if (state2.status === "playing" || state2.status === "paused") {
          e.preventDefault();
          toggleBookmark();
        }
        break;
    }
  }
  function registerKeyboardShortcuts() {
    if (shortcutRegistered) return;
    window.addEventListener("keydown", handleKeydown);
    shortcutRegistered = true;
  }
  let barElement = null;
  function createControlBar() {
    const bar = document.createElement("div");
    bar.className = "anki-playall-bar";
    bar.id = "anki-playall-bar";
    bar.innerHTML = `
    <button class="anki-playall-btn primary" data-action="play" title="播放全部 (Space)">
      ▶ 播放全部
    </button>
    <button class="anki-playall-btn warning" data-action="pause" title="暂停 (Space)" style="display: none;">
      ⏸ 暂停
    </button>
    <button class="anki-playall-btn primary" data-action="resume" title="继续 (Space)" style="display: none;">
      ▶ 继续
    </button>
    <button class="anki-playall-btn danger" data-action="stop" title="停止 (Esc)" style="display: none;">
      ⏹ 停止
    </button>
    <button class="anki-playall-btn" data-action="prev" title="上一个 (←)" style="display: none;">
      ⏮
    </button>
    <button class="anki-playall-btn" data-action="next" title="下一个 (→)" style="display: none;">
      ⏭
    </button>
    <div class="anki-playall-progress" style="display: none;">
      <span class="current">0</span> / <span class="total">0</span>
    </div>
    <button class="anki-playall-btn" data-action="bookmark" title="标记当前 (B)" style="display: none;">
      🔖 标记
    </button>
    <button class="anki-playall-btn" data-action="prevBookmark" title="上一标记 (Shift+←)" style="display: none;">
      ⏮🔖
    </button>
    <button class="anki-playall-btn" data-action="nextBookmark" title="下一标记 (Shift+→)" style="display: none;">
      🔖⏭
    </button>
    <div class="anki-playall-bookmark-count" style="display: none;">
      <span class="count">0</span> 个标记
    </div>
    <button class="anki-playall-btn" data-action="loop" title="循环模式 (L)">
      🔁 循环
    </button>
    <div class="anki-playall-shortcuts">
      <kbd>Space</kbd> 播放/暂停
      <kbd>Esc</kbd> 停止
      <kbd>← →</kbd> 上/下一个
      <kbd>B</kbd> 标记
      <kbd>Shift+← →</kbd> 标记跳转
      <kbd>L</kbd> 循环
    </div>
  `;
    bar.querySelectorAll("button[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        switch (action) {
          case "play":
            startPlayAll(0);
            break;
          case "pause":
            pausePlayback();
            break;
          case "resume":
            resumePlayback();
            break;
          case "stop":
            stopPlayback();
            break;
          case "prev":
            skipToPrevious();
            break;
          case "next":
            skipToNext();
            break;
          case "loop":
            toggleLoop();
            break;
          case "bookmark":
            toggleBookmark();
            break;
          case "prevBookmark":
            skipToPrevBookmark();
            break;
          case "nextBookmark":
            skipToNextBookmark();
            break;
        }
      });
    });
    return bar;
  }
  function updateBarUI(state2) {
    if (!barElement) return;
    const playBtn = barElement.querySelector('[data-action="play"]');
    const pauseBtn = barElement.querySelector('[data-action="pause"]');
    const resumeBtn = barElement.querySelector('[data-action="resume"]');
    const stopBtn = barElement.querySelector('[data-action="stop"]');
    const prevBtn = barElement.querySelector('[data-action="prev"]');
    const nextBtn = barElement.querySelector('[data-action="next"]');
    const progress = barElement.querySelector(".anki-playall-progress");
    const loopBtn = barElement.querySelector('[data-action="loop"]');
    const bookmarkBtn = barElement.querySelector('[data-action="bookmark"]');
    const prevBookmarkBtn = barElement.querySelector('[data-action="prevBookmark"]');
    const nextBookmarkBtn = barElement.querySelector('[data-action="nextBookmark"]');
    const bookmarkCount = barElement.querySelector(".anki-playall-bookmark-count");
    playBtn.style.display = "none";
    pauseBtn.style.display = "none";
    resumeBtn.style.display = "none";
    stopBtn.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    progress.style.display = "none";
    bookmarkBtn.style.display = "none";
    prevBookmarkBtn.style.display = "none";
    nextBookmarkBtn.style.display = "none";
    bookmarkCount.style.display = "none";
    switch (state2.status) {
      case "idle":
      case "stopped":
        playBtn.style.display = "";
        break;
      case "playing":
        pauseBtn.style.display = "";
        stopBtn.style.display = "";
        prevBtn.style.display = "";
        nextBtn.style.display = "";
        progress.style.display = "";
        bookmarkBtn.style.display = "";
        prevBookmarkBtn.style.display = "";
        nextBookmarkBtn.style.display = "";
        bookmarkCount.style.display = "";
        break;
      case "paused":
        resumeBtn.style.display = "";
        stopBtn.style.display = "";
        prevBtn.style.display = "";
        nextBtn.style.display = "";
        progress.style.display = "";
        bookmarkBtn.style.display = "";
        prevBookmarkBtn.style.display = "";
        nextBookmarkBtn.style.display = "";
        bookmarkCount.style.display = "";
        break;
    }
    const currentSpan = progress.querySelector(".current");
    const totalSpan = progress.querySelector(".total");
    if (currentSpan) currentSpan.textContent = String(state2.currentIndex + 1);
    if (totalSpan) totalSpan.textContent = String(state2.totalOnPage);
    if (state2.loopEnabled) {
      loopBtn.classList.add("active");
    } else {
      loopBtn.classList.remove("active");
    }
    if (state2.bookmarkedIndices.has(state2.currentIndex)) {
      bookmarkBtn.classList.add("active");
    } else {
      bookmarkBtn.classList.remove("active");
    }
    const countSpan = bookmarkCount.querySelector(".count");
    if (countSpan) countSpan.textContent = String(state2.bookmarkedIndices.size);
  }
  function injectPlayAllBar() {
    if (document.getElementById("anki-playall-bar")) return;
    const container = document.querySelector(".ui.divided.items");
    if (!container || !container.parentElement) return;
    barElement = createControlBar();
    container.parentElement.insertBefore(barElement, container);
    onStateChange(updateBarUI);
    updateBarUI(getState());
    registerKeyboardShortcuts();
  }
  const LAST_ADDED_NOTE_EXPIRES_MS = 5 * 60 * 1e3;
  let lastAddedNoteId = null;
  let lastAddedAt = 0;
  let editorShortcutRegistered = false;
  async function handleEditorShortcut(e) {
    const config = getConfig();
    const shortcut = (config.OPEN_EDITOR_KEY || "").trim();
    if (!shortcut) return;
    if (isTextInputTarget(e.target)) return;
    if (!lastAddedNoteId) return;
    if (Date.now() - lastAddedAt > LAST_ADDED_NOTE_EXPIRES_MS) return;
    const pressed = (e.key || "").trim().toLowerCase();
    if (pressed !== shortcut.toLowerCase()) return;
    try {
      await openNoteEditor(lastAddedNoteId);
    } catch (err) {
      console.warn("[Anki] 打开编辑器失败", err);
    }
  }
  function registerEditorShortcutHandler() {
    if (editorShortcutRegistered) return;
    window.addEventListener("keydown", handleEditorShortcut);
    editorShortcutRegistered = true;
  }
  function setLastAddedNote(noteId) {
    if (!noteId || !Number.isFinite(noteId)) return;
    lastAddedNoteId = noteId;
    lastAddedAt = Date.now();
    registerEditorShortcutHandler();
  }
  function ensureOpenEditorControl(triggerEl, noteId) {
    if (!noteId || !Number.isFinite(noteId)) return;
    const idx = triggerEl.dataset.ankiIndex || "";
    const container = triggerEl.closest(".ui.secondary.menu");
    if (container) {
      let audioAnchor = null;
      if (triggerEl.dataset.anki === "audio") {
        audioAnchor = triggerEl;
      } else if (idx) {
        audioAnchor = container.querySelector(`a.item[data-anki="audio"][data-anki-index="${idx}"]`);
      } else {
        audioAnchor = container.querySelector('a.item[data-anki="audio"]');
      }
      if (audioAnchor) {
        let openAnchor = container.querySelector(`a.item[data-anki="open"][data-anki-index="${idx}"]`);
        if (!openAnchor) {
          openAnchor = document.createElement("a");
          openAnchor.className = "item";
          openAnchor.href = "#";
          openAnchor.dataset.anki = "open";
          if (idx) openAnchor.dataset.ankiIndex = idx;
          openAnchor.textContent = "打开";
          openAnchor.style.opacity = "0.7";
          openAnchor.style.fontSize = "90%";
          openAnchor.addEventListener("click", async (e) => {
            e.preventDefault();
            const idStr = e.currentTarget.dataset.ankiOpenId;
            const id = idStr ? Number(idStr) : NaN;
            if (Number.isFinite(id)) {
              try {
                await openNoteEditor(id);
              } catch {
              }
            }
          });
          audioAnchor.parentNode?.insertBefore(openAnchor, audioAnchor.nextSibling);
        }
        openAnchor.dataset.ankiOpenId = String(noteId);
        return;
      }
    }
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function findImageInfoAtIndex(index) {
    const items = getExampleItems();
    if (items.length === 0) return null;
    let idx = Number.isFinite(index) ? index : 0;
    if (idx < 0) idx = 0;
    if (idx >= items.length) idx = items.length - 1;
    const item = items[idx];
    if (!item) return null;
    const img = item.querySelector('div.ui.medium.image img.ui.image.clickableImage[src]:not([src=""])') || item.querySelector('div.ui.small.image img.ui.image[src]:not([src=""])') || item.querySelector('img[src]:not([src=""])');
    if (!img) {
      console.log(`[Anki] 例句 ${index}: 未找到图片元素`);
      return null;
    }
    const srcAttr = img.getAttribute("src") || "";
    const hasNonEmptySrcAttr = typeof srcAttr === "string" && srcAttr.trim().length > 0;
    if (!hasNonEmptySrcAttr) {
      console.log(`[Anki] 例句 ${index}: 图片 src 属性为空`);
      return null;
    }
    const absUrl = resolveAbsoluteUrl(srcAttr);
    const alt = (img.getAttribute("alt") || "").trim();
    const filename = filenameFromUrl(absUrl, alt ? `${alt}.jpg` : "image.jpg");
    console.log(`[Anki] 例句 ${index}: 找到图片 url=${absUrl}, filename=${filename}`);
    return { url: absUrl, filename };
  }
  function hasImageAtIndex(index) {
    return findImageInfoAtIndex(index) !== null;
  }
  async function addMediaToAnkiForIndex(mediaType, exampleIndex, triggerEl, options) {
    console.log(`[Anki] 开始添加媒体: type=${mediaType}, index=${exampleIndex}`);
    const groups = getExampleGroups();
    const items = getExampleItems();
    const maxIndex = Math.max(groups.length, items.length);
    console.log(`[Anki] 验证索引: index=${exampleIndex}, maxIndex=${maxIndex - 1}`);
    if (exampleIndex < 0 || exampleIndex >= maxIndex) {
      console.error(`ImmersionKit → Anki: Invalid example index: ${exampleIndex}, max: ${maxIndex - 1}`);
      if (triggerEl && !options?.skipButtonState) {
        setButtonState(triggerEl, "error", "索引错误");
        setTimeout(() => revertButtonState(triggerEl), 2e3);
      }
      return false;
    }
    const buttonEl = options?.skipButtonState ? void 0 : triggerEl;
    const allowEnsureOpen = !options?.skipEnsureOpen;
    try {
      if (buttonEl) setButtonState(buttonEl, "pending", "添加中…");
      let apiUrl = "";
      let filename = "";
      const fieldName = mediaType === "picture" ? CONFIG.IMAGE_FIELD_NAME : CONFIG.AUDIO_FIELD_NAME;
      console.log(`[Anki] 目标字段: ${fieldName}`);
      if (mediaType === "picture") {
        console.log("[Anki] 查找页面图片...");
        const info = findImageInfoAtIndex(exampleIndex);
        if (!info) {
          console.error("[Anki] 未找到页面图片");
          throw new Error("No in-page image found");
        }
        apiUrl = info.url;
        filename = info.filename;
        console.log(`[Anki] 找到图片: url=${apiUrl}, filename=${filename}`);
      } else if (mediaType === "audio") {
        console.log("[Anki] 尝试捕获音频URL...");
        const captured = await captureAudioUrlFromMining(triggerEl);
        if (!captured || !captured.url) {
          console.error("[Anki] 未能捕获音频URL");
          throw new Error("Could not capture audio URL from page");
        }
        apiUrl = captured.url;
        filename = captured.filename;
        console.log(`[Anki] 捕获到音频: url=${apiUrl}, filename=${filename}`);
      }
      console.log(`[Anki] 获取目标笔记 (mode=${CONFIG.TARGET_NOTE_MODE})...`);
      let targetNoteIds = [];
      if (CONFIG.TARGET_NOTE_MODE === "selected") {
        targetNoteIds = await getSelectedNoteIds();
        console.log(`[Anki] 获取到选中笔记: ${targetNoteIds.join(", ")}`);
        if (!Array.isArray(targetNoteIds) || targetNoteIds.length === 0) {
          console.error("[Anki] 未检测到选中笔记");
          throw new Error("未检测到选中笔记");
        }
      } else {
        const noteId = await getMostRecentNoteId();
        targetNoteIds = [noteId];
        console.log(`[Anki] 获取到最近笔记: ${noteId}`);
      }
      console.log(`[Anki] 开始向 ${targetNoteIds.length} 个笔记添加媒体...`);
      const successfulNoteIds = [];
      let successCount = 0;
      for (const noteId of targetNoteIds) {
        try {
          console.log(`[Anki] 处理笔记 ${noteId}...`);
          console.log(`[Anki] 即将调用 ensureFieldOnNote...`);
          await ensureFieldOnNote(noteId, fieldName);
          console.log(`[Anki] ensureFieldOnNote 完成`);
          console.log(`[Anki] 字段 "${fieldName}" 验证通过`);
          if (CONFIG.CONFIRM_OVERWRITE) {
            const info = await getNoteInfo(noteId);
            const model = info?.modelName || "";
            const existing = info?.fields?.[fieldName]?.value || "";
            const hasExisting = typeof existing === "string" && existing.trim().length > 0;
            if (hasExisting) {
              console.log(`[Anki] 字段已有内容，显示确认对话框`);
              const html = `
              <div class="anki-kv"><div class="key">Note ID</div><div>${noteId}</div></div>
              <div class="anki-kv"><div class="key">Note Type</div><div>${model || "未知"}</div></div>
              <div class="anki-kv"><div class="key">字段</div><div>${fieldName}</div></div>
              <div class="anki-kv row-span-2"><div class="key">原有内容</div><div><div class="anki-pre">${escapeHtml(existing)}</div></div></div>
              <div class="anki-kv"><div class="key">将添加</div><div>${filename}</div></div>
            `;
              const proceed = await showModal({
                title: "覆盖字段内容？",
                html,
                confirmText: "覆盖并添加",
                danger: true
              });
              if (!proceed) {
                console.log(`[Anki] 用户取消覆盖笔记 ${noteId}`);
                continue;
              }
              console.log(`[Anki] 用户确认覆盖笔记 ${noteId}`);
            }
          }
          console.log(`[Anki] 调用 attachMedia: noteId=${noteId}, mediaType=${mediaType}, url=${apiUrl}, filename=${filename}, field=${fieldName}`);
          await attachMedia(noteId, mediaType, { url: apiUrl, filename }, fieldName);
          console.log(`[Anki] ✓ 成功添加媒体到笔记 ${noteId}`);
          successCount++;
          successfulNoteIds.push(noteId);
        } catch (e) {
          console.error(`[Anki] ✗ 添加媒体到笔记 ${noteId} 失败:`, e);
          console.warn("Failed to add media to note", noteId, e);
          continue;
        }
      }
      console.log(`[Anki] 完成: ${successCount}/${targetNoteIds.length} 个笔记添加成功`);
      if (successCount > 0) {
        const noteToUse = successfulNoteIds[successfulNoteIds.length - 1] ?? targetNoteIds[0];
        if (noteToUse) setLastAddedNote(noteToUse);
        if (buttonEl) {
          const total = targetNoteIds.length;
          const text = total > 1 ? `已添加 ${successCount}/${total}` : getSuccessText(mediaType);
          setButtonState(buttonEl, "success", text);
          setTimeout(() => revertButtonState(buttonEl), 2e3);
        }
        if (allowEnsureOpen && triggerEl && noteToUse) {
          ensureOpenEditorControl(triggerEl, noteToUse);
        }
      } else if (buttonEl) {
        setButtonState(buttonEl, "error", "添加失败");
        setTimeout(() => revertButtonState(buttonEl), 2500);
      }
      return successCount > 0;
    } catch (err) {
      if (buttonEl) {
        setButtonState(buttonEl, "error", "添加失败");
        setTimeout(() => revertButtonState(buttonEl), 2500);
      }
      console.error("Failed to add " + mediaType, err);
      return false;
    }
  }
  async function addBothMediaToAnkiForIndex(exampleIndex, triggerEl) {
    const hasImage = hasImageAtIndex(exampleIndex);
    const buttonEl = triggerEl || void 0;
    if (buttonEl) setButtonState(buttonEl, "pending", "添加中…");
    let imageSuccess = false;
    let audioSuccess = false;
    if (hasImage) {
      try {
        if (buttonEl) setButtonState(buttonEl, "pending", "图片添加中…");
        imageSuccess = await addMediaToAnkiForIndex("picture", exampleIndex, triggerEl, {
          skipButtonState: true,
          skipEnsureOpen: true
        });
      } catch (err) {
        console.warn("Failed to add image:", err);
      }
    }
    try {
      if (buttonEl) {
        if (hasImage && imageSuccess) {
          setButtonState(buttonEl, "pending", "图片✓ 音频中…");
        } else {
          setButtonState(buttonEl, "pending", "音频添加中…");
        }
      }
      audioSuccess = await addMediaToAnkiForIndex("audio", exampleIndex, triggerEl, {
        skipButtonState: true,
        skipEnsureOpen: true
      });
    } catch (err) {
      console.warn("Failed to add audio:", err);
    }
    if (buttonEl) {
      if (hasImage && imageSuccess && audioSuccess) {
        setButtonState(buttonEl, "success", "已添加 2项");
        setTimeout(() => revertButtonState(buttonEl), 2e3);
      } else if (!hasImage && audioSuccess) {
        setButtonState(buttonEl, "success", "音频已添加");
        setTimeout(() => revertButtonState(buttonEl), 2e3);
      } else if (hasImage && imageSuccess && !audioSuccess) {
        setButtonState(buttonEl, "error", "仅图片成功");
        setTimeout(() => revertButtonState(buttonEl), 2500);
      } else if (hasImage && !imageSuccess && audioSuccess) {
        setButtonState(buttonEl, "error", "仅音频成功");
        setTimeout(() => revertButtonState(buttonEl), 2500);
      } else {
        setButtonState(buttonEl, "error", "添加失败");
        setTimeout(() => revertButtonState(buttonEl), 2500);
      }
    }
    if (triggerEl && hasImage && imageSuccess && audioSuccess) {
      const url = new URL(window.location.href);
      const keywordParam = url.searchParams.get("keyword");
      if (keywordParam) {
        try {
          let targetNoteIds = [];
          if (CONFIG.TARGET_NOTE_MODE === "selected") {
            targetNoteIds = await getSelectedNoteIds();
          } else {
            const noteId = await getMostRecentNoteId();
            targetNoteIds = [noteId];
          }
          if (targetNoteIds.length > 0) {
            ensureOpenEditorControl(triggerEl, targetNoteIds[0]);
          }
        } catch {
        }
      }
    }
  }
  function injectMenuButtons(menuEl, exampleIndex) {
    const showImage = hasImageAtIndex(exampleIndex);
    console.log(`[Anki] 例句 ${exampleIndex} 图片检测: ${showImage}`);
    function createAnkiMenuItem(label, key, index, onClickFn) {
      const a = document.createElement("a");
      a.className = "item";
      a.href = "#";
      a.dataset.anki = key;
      a.dataset.ankiIndex = String(index);
      a.textContent = label;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        onClickFn(e.currentTarget, index);
      });
      return a;
    }
    if (showImage && !menuEl.querySelector('a.item[data-anki="both"]')) {
      const bothItem = createAnkiMenuItem(
        "Anki Both",
        "both",
        exampleIndex,
        (el, i) => addBothMediaToAnkiForIndex(i, el)
      );
      menuEl.appendChild(bothItem);
    }
    if (showImage && !menuEl.querySelector('a.item[data-anki="image"]')) {
      const imgItem = createAnkiMenuItem(
        "Anki Image",
        "image",
        exampleIndex,
        (el, i) => addMediaToAnkiForIndex("picture", i, el)
      );
      menuEl.appendChild(imgItem);
    }
    if (!menuEl.querySelector('a.item[data-anki="audio"]')) {
      const audioItem = createAnkiMenuItem(
        "Anki Audio",
        "audio",
        exampleIndex,
        (el, i) => addMediaToAnkiForIndex("audio", i, el)
      );
      menuEl.appendChild(audioItem);
    }
  }
  let yahooShortcutRegistered = false;
  function handleYahooShortcut(e) {
    if (isTextInputTarget(e.target)) return;
    const pressed = (e.key || "").trim().toLowerCase();
    if (pressed !== "y") return;
    const url = new URL(window.location.href);
    const keyword = url.searchParams.get("keyword");
    if (!keyword) return;
    window.open(`https://news.yahoo.co.jp/search?p=${encodeURIComponent(keyword)}&ei=utf-8`, "_blank");
  }
  function registerYahooShortcut() {
    if (yahooShortcutRegistered) return;
    window.addEventListener("keydown", handleYahooShortcut);
    yahooShortcutRegistered = true;
  }
  function injectYahooSearchButton() {
    registerYahooShortcut();
    if (document.querySelector('[data-anki="yahoo-search"]')) return;
    const url = new URL(window.location.href);
    const keyword = url.searchParams.get("keyword");
    if (!keyword) return;
    const searchContainer = document.querySelector(".ui.fluid.right.action.left.icon.right.labeled.input.icon");
    if (!searchContainer) return;
    const yahooBtn = document.createElement("a");
    yahooBtn.className = "ui basic button";
    yahooBtn.href = `https://news.yahoo.co.jp/search?p=${encodeURIComponent(keyword)}&ei=utf-8`;
    yahooBtn.target = "_blank";
    yahooBtn.rel = "noopener noreferrer";
    yahooBtn.dataset.anki = "yahoo-search";
    yahooBtn.textContent = "Yahoo同词";
    yahooBtn.style.marginLeft = "8px";
    yahooBtn.style.whiteSpace = "nowrap";
    searchContainer.parentNode?.insertBefore(yahooBtn, searchContainer.nextSibling);
    console.log("[Anki] Yahoo同词按钮已添加到搜索框旁边");
  }
  function insertAnkiButtons() {
    let attempts = 0;
    const maxAttempts = 40;
    const interval = setInterval(() => {
      attempts++;
      const validation = validatePageStructure();
      if (!validation.valid) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.warn(`ImmersionKit → Anki: ${validation.reason}`);
        }
        return;
      }
      const groups = getExampleGroups();
      if (groups.length > 0) {
        clearInterval(interval);
        console.log(`ImmersionKit → Anki: Found ${groups.length} example groups`);
        groups.forEach((group) => {
          const menuDesktop = group.buttonSpanDesktop.querySelector(".ui.secondary.menu");
          if (menuDesktop) {
            injectMenuButtons(menuDesktop, group.index);
          }
          const menuMobile = group.buttonSpanMobile.querySelector(".ui.secondary.menu");
          if (menuMobile) {
            injectMenuButtons(menuMobile, group.index);
          }
        });
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn("ImmersionKit → Anki: Could not inject buttons after max attempts");
      }
    }, 500);
  }
  let menuObserver = null;
  function observeNewMenus() {
    if (menuObserver) return;
    menuObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches && n.matches(".ui.secondary.menu")) {
            const exampleIndex = getExampleIndexFromMenu(n);
            const groups = getExampleGroups();
            if (groups[exampleIndex]) {
              injectMenuButtons(n, exampleIndex);
            }
          }
          const nested = n.querySelectorAll?.(".ui.secondary.menu");
          if (nested && nested.length > 0) {
            nested.forEach((el) => {
              const exampleIndex = getExampleIndexFromMenu(el);
              const groups = getExampleGroups();
              if (groups[exampleIndex]) {
                injectMenuButtons(el, exampleIndex);
              }
            });
          }
        });
      }
    });
    menuObserver.observe(document.body, { childList: true, subtree: true });
  }
  let stylesInjected = false;
  function init() {
    if (!stylesInjected) {
      injectStyles();
      stylesInjected = true;
    }
    observeNewMenus();
    waitForElement(SELECTORS.EXAMPLES_CONTAINER).then(() => {
      insertAnkiButtons();
      injectPlayAllBar();
      injectYahooSearchButton();
    });
  }
  function isDictionaryPage(u) {
    const url = new URL(window.location.href);
    return url.pathname.startsWith("/dictionary");
  }
  let lastInitializedHref = null;
  function maybeInitForDictionary() {
    if (!isDictionaryPage()) return;
    const href = window.location.href;
    if (href === lastInitializedHref) return;
    lastInitializedHref = href;
    init();
  }
  function startUserscript() {
    const onReady = () => {
      maybeInitForDictionary();
      let lastHref = window.location.href;
      window.addEventListener("popstate", maybeInitForDictionary);
      window.addEventListener("hashchange", maybeInitForDictionary);
      setInterval(() => {
        const current = window.location.href;
        if (current !== lastHref) {
          lastHref = current;
          maybeInitForDictionary();
        }
      }, 400);
    };
    if (document.readyState === "complete") onReady();
    else window.addEventListener("load", onReady);
  }
  function registerMenu() {
    _GM_registerMenuCommand("设置（ImmersionKit → Anki）", () => {
      openSettingsOverlay();
    });
  }
  (function() {
    startUserscript();
    registerMenu();
  })();

})();