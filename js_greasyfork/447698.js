// ==UserScript==
// @name         antd 官方文档自动深色模式
// @version      2.0.2
// @description  根据系统设置自动切换深色模式，深色用的是官方的样式
// @namespace    https://ant.design/
// @match        https://ant.design/*
// @match        https://ant-design.antgroup.com/*
// @match        https://ant-design.gitee.io/*
// @icon         https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg
// @author       bowencool
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/447698
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447698/antd%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/447698/antd%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";


  async function toggle(
    isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    const url = new URL(location.href);
    const currentTheme = url.searchParams.get("theme");

    console.log({ isDarkMode, currentTheme });
    if (isDarkMode) {
      if (currentTheme === "dark") return;
      // url.searchParams.set("theme", "dark")
      // location.href = url
    } else {
      if (currentTheme !== "dark") return;
      // url.searchParams.delete("theme")
      // location.href = url
    }
    (await waitForElementToExist('[aria-label="Theme Switcher"]')).click();
    (await waitForElementToExist("button:has([id^=Dark],[id^=Light])")).click();
  }
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      toggle(e.matches);
    });
  // toggle();

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const url = new URL(location.href);
  const currentTheme = url.searchParams.get("theme");

  console.log({ isDarkMode, currentTheme });
  if (isDarkMode) {
    if (currentTheme === "dark") return;
    url.searchParams.set("theme", "dark")
    location.href = url
  } else {
    if (currentTheme !== "dark") return;
    url.searchParams.delete("theme")
    location.href = url
  }
})();
