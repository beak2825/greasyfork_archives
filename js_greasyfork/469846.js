// ==UserScript==
// @name         select-to-copy
// @namespace    https://github.com/wChenonly/select-to-copy
// @version      0.0.6
// @author       wChenonly
// @description  Select to copy and use in the browser.
// @license      MIT
// @homepage     https://github.com/wChenonly/select-to-copy#readme
// @homepageURL  https://github.com/wChenonly/select-to-copy#readme
// @source       https://github.com/wChenonly/select-to-copy.git
// @supportURL   https://github.com/wChenonly/select-to-copy/issues
// @include      *://**/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/469846/select-to-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/469846/select-to-copy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  let text;
  const body = document.querySelector("body");
  body == null ? void 0 : body.addEventListener("mouseup", (e) => {
    var _a;
    if (((_a = e.target) == null ? void 0 : _a.isContentEditable) || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (_unsafeWindow.getSelection) {
      text = _unsafeWindow.getSelection();
    } else if (document.getSelection) {
      text = document.getSelection();
    }
    const v = text == null ? void 0 : text.toString();
    v && navigator.clipboard.writeText(v);
  });

})();
