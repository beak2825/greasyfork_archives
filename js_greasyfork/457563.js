// ==UserScript==
// @name         破解切屏检测
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  破解所有网站的切屏检测
// @author       share121
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457563/%E7%A0%B4%E8%A7%A3%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457563/%E7%A0%B4%E8%A7%A3%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
["visibilitychange", "blur", "focus", "focusin", "focusout"].forEach((e) => {
  window.addEventListener(
    e,
    (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    true
  );
});
document.hasFocus = () => true;
Object.defineProperty(document, "hidden", {
  get() {
    return false;
  },
});