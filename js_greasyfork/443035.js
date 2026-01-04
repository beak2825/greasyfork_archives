// ==UserScript==
// @name         WaniKani Community Details Keep Open State
// @namespace    https://github.com/patarapolw/wanikani-userscript
// @version      0.1.0
// @description  Keep [details] or <details> tags as open or close, and not changing with edits
// @author       polv
// @license      MIT
// @match        https://community.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443035/WaniKani%20Community%20Details%20Keep%20Open%20State.user.js
// @updateURL https://update.greasyfork.org/scripts/443035/WaniKani%20Community%20Details%20Keep%20Open%20State.meta.js
// ==/UserScript==

(() => {
  // src/shared/discourse.ts
  function getWindow() {
    return typeof unsafeWindow === "undefined" ? window : unsafeWindow;
  }

  // src/forum-details-open.ts
  var elPreview = null;
  var openKeys = /* @__PURE__ */ new Map();
  var EDITOR_PREVIEW_CLASS = "d-editor-preview";
  var obs = new MutationObserver((muts) => {
    muts.forEach((m) => {
      for (const n of m.addedNodes) {
        if (n instanceof HTMLElement && n.classList.contains(EDITOR_PREVIEW_CLASS)) {
          elPreview = n;
          openKeys.clear();
        }
      }
      for (const n of m.removedNodes) {
        if (n instanceof HTMLElement && n.classList.contains(EDITOR_PREVIEW_CLASS)) {
          elPreview = null;
        }
      }
    });
  });
  obs.observe(document.body, { childList: true, subtree: true });
  function getDetailsKey(d) {
    var _a;
    return ((_a = d.querySelector("summary")) == null ? void 0 : _a.innerHTML) || "";
  }
  var markdownIt = getWindow().require("pretty-text/engines/discourse-markdown-it");
  var oldCook = markdownIt.cook;
  markdownIt.cook = function(raw, opts) {
    let html = oldCook.bind(this)(raw, opts);
    if (elPreview) {
      const keys = /* @__PURE__ */ new Map();
      const makeKey = (key) => {
        const k0 = key;
        let i = keys.get(k0) || 0;
        if (!i) {
          key = JSON.stringify([key, ++i]);
        } else {
          key = JSON.stringify(key);
        }
        keys.set(k0, i);
        return key;
      };
      elPreview.querySelectorAll("details").forEach((details) => {
        let key = getDetailsKey(details);
        if (key) {
          openKeys.set(makeKey(key), details.open);
        }
      });
      keys.clear();
      const div = document.createElement("div");
      div.innerHTML = html;
      div.querySelectorAll("details").forEach((details) => {
        let key = getDetailsKey(details);
        if (key) {
          key = makeKey(key);
          if (details.hasAttribute("open"))
            return;
          const state = openKeys.get(key);
          if (typeof state === "boolean") {
            details.open = state;
          }
        }
      });
      html = div.innerHTML;
    }
    return html;
  };
})();
