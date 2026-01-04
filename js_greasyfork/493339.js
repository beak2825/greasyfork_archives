// ==UserScript==
// @name         web helper
// @namespace    https://github.com/dingcang/tampermonkey-web-helper
// @version      0.0.3
// @description  网页助手
// @author       dc
// @match        *://*/*
// @run-at      document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493339/web%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/493339/web%20helper.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (location.host.includes("csdn")) {
    Object.defineProperty(window, "copyPopSwitch", {
      value: false,
      writable: false,
    });
  }

  if (location.host.includes("9ku")) {
    Object.defineProperty(window, "close", {
      value() {
        console.log("window close");
      },
      writable: false,
    });
  }

  Object.defineProperty(window, "DisableDevtool", {
    value() {
      console.log("window DisableDevtool", ...arguments);
    },
    writable: false,
  });
})();
