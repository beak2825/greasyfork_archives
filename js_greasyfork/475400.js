// ==UserScript==
// @name        外部播放器
// @namespace        jump player
// @author       tampermonkey
// @version      1.0.0
// @Default name
// @description  外部播放
// @description  zh-cn
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @license      自用
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475400/%E5%A4%96%E9%83%A8%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/475400/%E5%A4%96%E9%83%A8%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* eslint-disable no-redeclare, no-unused-vars, require-yield */
  /* global GM_info, GM, GM_registerMenuCommand */

  const $polyfills = {
    // 以下 polyfills 修改自 NullMonkey，使用 MPL-2.0 发布
    /* This Source Code Form is subject to the terms of the
     * Mozilla Public License, v. 2.0. If a copy of the MPL
     * was not distributed with this file, You can obtain
     * one at https://mozilla.org/MPL/2.0/. */
    GM_info: typeof GM_info == "object" ? GM_info : {},
    GM_registerMenuCommand:
      typeof GM_registerMenuCommand == "function"
        ? GM_registerMenuCommand
        : void 0,
    GM: typeof GM == "object" ? GM : {},
    // polyfills 结束
  };

  (function (tm) {
    "use strict";

    const player = "https://lemon399.gitlab.io/page/xp/xplayer.html";
    let count = 0;
    function getRes() {
      var _a;
      return (_a =
        window === null || window === void 0 ? void 0 : window.mbrowser) ===
        null || _a === void 0
        ? void 0
        : _a.getSniffMediaResource();
    }
    function setJump() {
      const result = getRes();
      if (result !== "{}") {
        location.assign(player + "?url=" + encodeURIComponent(result));
      }
    }
    if (location.hostname !== "lemon399.gitlab.io") {
      const int = setInterval(() => {
        const result = getRes();
        if (result !== "{}") {
          tm.GM_registerMenuCommand(`外部播放`, setJump);
          clearInterval(int);
        } else {
          if (count > 10) {
            clearInterval(int);
          }
          count++;
        }
      }, 500);
    }
  })($polyfills);
})();