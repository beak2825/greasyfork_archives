// ==UserScript==
// @name         Disable Inavtive Detection (禁止后台检测)
// @namespace    https://ipidkun.com/
// @version      20241105.1
// @description  Some website detects user switching to other tabs, which can be disabled by this script. 有些网站会检测用户正处于后台，此脚本可以干掉这些检测。
// @author       ipid
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517539/Disable%20Inavtive%20Detection%20%28%E7%A6%81%E6%AD%A2%E5%90%8E%E5%8F%B0%E6%A3%80%E6%B5%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517539/Disable%20Inavtive%20Detection%20%28%E7%A6%81%E6%AD%A2%E5%90%8E%E5%8F%B0%E6%A3%80%E6%B5%8B%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function pinValue(obj, key, value) {
    try {
      Object.defineProperty(obj, key, {
        enumerable: false,
        configurable: false,

        get: () => {
          return value;
        },

        set: () => {},
      });
    } catch {}
  }

  function pinMethodReturnValue(obj, method, value) {
    try {
      obj[method] = () => value;
    } catch {}
  }

  function disableEvent(eventTarget, name) {
    try {
      eventTarget.addEventListener(
        name,
        (ev) => {
          try {
            ev.preventDefault();
          } catch {}
          try {
            ev.stopImmediatePropagation();
          } catch {}
        },
        { capture: true, passive: false }
      );
    } catch {}
  }

  pinValue(document, "hidden", false);
  pinValue(document, "webkitHidden", false);
  pinValue(document, "visibilityState", "visible");
  pinValue(document, "webkitVisibilityState", "visible");

  disableEvent(window, "blur");
  disableEvent(window, "pagehide");
  disableEvent(document, "visibilitychange");

  pinMethodReturnValue(document, "hasFocus", true);
})();
