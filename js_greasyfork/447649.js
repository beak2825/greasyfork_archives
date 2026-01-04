// ==UserScript==
// @name         滴答清单自动深色模式
// @version      1.0.7
// @description  根据系统设置自动切换深色模式，深色用的是官方的样式
// @namespace    https://dida365.com/
// @match        https://dida365.com/webapp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dida365.com
// @author       bowencool
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/447649
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447649/%E6%BB%B4%E7%AD%94%E6%B8%85%E5%8D%95%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/447649/%E6%BB%B4%E7%AD%94%E6%B8%85%E5%8D%95%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function toggle(
    isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    /* 有两个事件会触发，而且有循环，必须加判断 */
    const currentTheme = document.body.getAttribute("data-theme");
    console.log({ isDarkMode, currentTheme });
    if (isDarkMode) {
      if (currentTheme === "night-dark-theme") return;
      (await waitForElementToExist("#tl-bar-user")).click();
      (
        await waitForElementToExist(
          '.dropdown-menu [role="menuitem"] :has(.icon-setting-sidebar)'
        )
      ).click();
      (await waitForElementToExist('[data-tab="appearance"] a')).click();
      await sleep(200);
      (
        await waitForElementToExist('[data-id="night"]:not(:has(.select-tip))')
      ).click();
      await sleep(200);
      (
        await waitForElementToExist(
          "#settings-view div:has(> .icon-panel-close)"
        )
      ).click();
      localStorage.setItem("appTheme", "night");
      await sleep(200);
      document.querySelector(".icon-sidebar-sync")?.parentElement.click();
      // document.body.setAttribute("data-theme", "night-dark-theme");
      // document.body.classList.add("dark");
    } else {
      if (currentTheme !== "night-dark-theme") return;
      (await waitForElementToExist("#tl-bar-user")).click();
      (
        await waitForElementToExist(
          '.dropdown-menu [role="menuitem"] :has(.icon-setting-sidebar)'
        )
      ).click();
      (await waitForElementToExist('[data-tab="appearance"] a')).click();
      await sleep(200);
      (
        await waitForElementToExist('[data-id="grey"]:not(:has(.select-tip))')
      ).click();
      await sleep(200);
      (
        await waitForElementToExist(
          "#settings-view div:has(> .icon-panel-close)"
        )
      ).click();
      localStorage.setItem("appTheme", "grey");
      await sleep(200);
      document.querySelector(".icon-sidebar-sync")?.parentElement.click();
      // document.body.setAttribute("data-theme", "white-theme");
      // document.body.classList.remove("dark");
    }
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      toggle(e.matches);
    });

  const observer = new MutationObserver(() => {
    /* 页面半身是异步设置的，太傻逼了 */
    // if (!document.body.getAttribute("data-input-type")) return;
    const dataTheme = document.body.getAttribute("data-theme");
    if (!dataTheme) return;
    console.log(
      "attr changed",
      {
        dataTheme,
      },
      document.body.getAttribute("data-input-type")
    );
    observer.disconnect();
    console.log("disconnected.");
    // setTimeout(() => {
    toggle();
    // }, 100);
  });
  observer.observe(document.body, {
    attributes: true,
    childList: false,
    subtree: false,
  });
})();
