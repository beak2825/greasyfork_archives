// ==UserScript==
// @name         ProComponents 官方文档自动深色模式
// @version      0.1.3
// @description  根据系统设置自动切换深色模式，深色用的是官方的样式
// @namespace    https://procomponents.ant.design/
// @match        https://procomponents.ant.design/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=procomponents.ant.design
// @author       bowencool
// @license      MIT
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447700/ProComponents%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/447700/ProComponents%20%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function toggle(isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches) {
    const button = document.querySelector(".procomponents_dark_theme_view button")
    const currentTheme = button.getAttribute("aria-checked")
    console.log({ isDarkMode, currentTheme })
    if (isDarkMode) {
      if (currentTheme === "true") return
      button.click();
    } else {
      if (currentTheme === "false") return
      button.click();
    }
  }
  toggle()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    toggle(e.matches);
  });
})();