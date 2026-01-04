// ==UserScript==
// @name         IBKR盈透证券自动深色模式
// @version      1.0.2
// @description  根据系统设置自动切换深色模式，深色用的是官方的样式
// @namespace    https://www.ibkr.com.cn/
// @match        https://www.ibkr.com.cn/portal*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ibkr.com.cn
// @author       bowencool
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/508799
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/cookie.js
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508799/IBKR%E7%9B%88%E9%80%8F%E8%AF%81%E5%88%B8%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/508799/IBKR%E7%9B%88%E9%80%8F%E8%AF%81%E5%88%B8%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  async function toggle(
    isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    const currentTheme = getCookie("IB_THEME")?.toLowerCase();
    console.log({ isDarkMode, currentTheme });
    if (isDarkMode) {
      if (currentTheme === "dark") return;
      (await waitForElementToExist(".one-head-menu button")).click();
      Array.from(document.querySelectorAll("button.one-user-btn"))
        .find((el) => ["Dark", "深色"].includes(el.textContent))
        ?.click();
    } else {
      if (currentTheme === "light") return;
      (await waitForElementToExist(".one-head-menu button")).click();
      Array.from(document.querySelectorAll("button.one-user-btn"))
        .find((el) => ["Light", "浅色"].includes(el.textContent))
        ?.click();
    }
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      toggle(e.matches);
    });

  toggle();
})();
