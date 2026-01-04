// ==UserScript==
// @name         奇安学堂-屏蔽切屏检测
// @match        https://s-xuexi.qianxin.com/*
// @match        https://xuexi.qianxin.com/*
// @run-at       document-start
// @grant        none
// @version      1.4.0
// @description  屏蔽奇安信内网平台奇安学堂的切屏检测功能
// @icon      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMC1jMDAwIDc5LjE3MWMyN2ZhYiwgMjAyMi8wOC8xNi0yMjozNTo0MSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNTBlZDFlZS1lZTFjLTRiN2UtYjZiNi1iZGM1YjA3OTA3YTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUZFQTlEMjQ0RUNDMTFFREIyQzg5QUIwNzIyNTBEREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUZFQTlEMjM0RUNDMTFFREIyQzg5QUIwNzIyNTBEREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjNTBlZDFlZS1lZTFjLTRiN2UtYjZiNi1iZGM1YjA3OTA3YTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzUwZWQxZWUtZWUxYy00YjdlLWI2YjYtYmRjNWIwNzkwN2Ew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
// @author       Houyuxi
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/495108/%E5%A5%87%E5%AE%89%E5%AD%A6%E5%A0%82-%E5%B1%8F%E8%94%BD%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495108/%E5%A5%87%E5%AE%89%E5%AD%A6%E5%A0%82-%E5%B1%8F%E8%94%BD%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

// === 基础事件拦截 ===
["visibilitychange", "blur", "focus", "focusin", "focusout",
 "pointerdown", "pointerup", "mousedown", "mouseup",
 "touchstart", "touchend"].forEach(event => {
  window.addEventListener(event, e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    return false;
  }, true);
});

// === 强制始终聚焦和可见 ===
const forceFocus = () => true;
document.hasFocus = forceFocus;
Object.defineProperty(document, "hidden", { get: () => false });
Object.defineProperty(document, "visibilityState", { get: () => "visible" });
Object.defineProperty(navigator, "userActivation", { get: () => ({ isActive: true }) });

// === 模拟持续活动 ===
function simulateActivity() {
  const evtOptions = { bubbles: true, cancelable: true, view: window };
  const events = [
    new MouseEvent("mousemove", evtOptions),
    new KeyboardEvent("keydown", { key: "Shift", ...evtOptions }),
    new Event("scroll", evtOptions)
  ];
  events.forEach(e => document.dispatchEvent(e));
}
setInterval(simulateActivity, 2000); // 2秒模拟一次

// === 劫持 requestAnimationFrame ===
const originalRAF = window.requestAnimationFrame;
window.requestAnimationFrame = function(cb) {
  return originalRAF.call(window, timestamp => {
    simulateActivity();
    cb(timestamp);
  });
};

// === 劫持 IntersectionObserver ===
const originalIO = window.IntersectionObserver;
window.IntersectionObserver = function(callback, options) {
  return new originalIO((entries, observer) => {
    const fakeEntries = entries.map(entry => ({ ...entry, isIntersecting: true, intersectionRatio: 1 }));
    callback(fakeEntries, observer);
  }, options);
};

// === 劫持 MutationObserver ===
const originalMO = window.MutationObserver;
window.MutationObserver = function(callback) {
  return new originalMO((mutations, observer) => {
    const fakeMutations = mutations.map(m => ({ ...m, addedNodes: [], removedNodes: [] }));
    callback(fakeMutations, observer);
  });
};

// === 防止控制台检测 ===
Object.defineProperty(window, 'console', {
  get: () => ({
    log: () => {}, warn: () => {}, error: () => {},
    info: () => {}, clear: () => {}, debug: () => {}
  })
});

// === 屏蔽 Web Worker 检测 ===
const OriginalWorker = window.Worker;
window.Worker = function(scriptURL, options) {
  const fakeWorker = new OriginalWorker(scriptURL, options);
  const fakePostMessage = fakeWorker.postMessage.bind(fakeWorker);
  fakeWorker.postMessage = function(msg) {
    // 屏蔽特定消息，可根据需求调整
    if (msg && msg.type && msg.type.includes("visibility")) return;
    return fakePostMessage(msg);
  };
  const fakeAddEventListener = fakeWorker.addEventListener.bind(fakeWorker);
  fakeWorker.addEventListener = function(type, listener, opts) {
    // 屏蔽特定 worker 消息监听
    if (type === "message") {
      const wrappedListener = function(e) {
        if (e.data && e.data.type && e.data.type.includes("visibility")) return;
        listener(e);
      };
      return fakeAddEventListener(type, wrappedListener, opts);
    }
    return fakeAddEventListener(type, listener, opts);
  };
  return fakeWorker;
};
