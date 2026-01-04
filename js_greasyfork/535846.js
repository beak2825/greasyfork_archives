// ==UserScript==
// @name         open-in-full-page
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  Open in full page
// @author       You
// @license       MIT
// @match        https://gitpd.paodingai.com/cheftin/*/issues*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/535846/open-in-full-page.user.js
// @updateURL https://update.greasyfork.org/scripts/535846/open-in-full-page.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 监听键盘事件，如果按下ctrl+j ,就打印当前页面的url
  document.addEventListener("keydown", function (event) {
    if (event.metaKey && event.key === "j") {
      const link = document.querySelector('[data-testid="work-item-drawer-link-button"]')
      if (link) {
        link.click();
      }
    }
  });
})();
