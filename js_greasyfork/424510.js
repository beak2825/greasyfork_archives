// ==UserScript==
// @name                 BAHAMUT Auto Dark Mode
// @name:zh-CN           巴哈姆特动画疯自动切换深色模式
// @name:zh-TW           巴哈姆特動畫瘋自動切換深色模式
// @namespace            http://tampermonkey.net/
// @version              0.3
// @description          Turn on/off dark mode automatically in ani.gamer.com.tw based on the color scheme of OS.
// @description:zh-CN    根据系统配色自动开启/关闭 ani.gamer.com.tw 的深色模式
// @description:zh-TW    根據系統配色自動開啟/關閉 ani.gamer.com.tw 的深色模式
// @author               Jiachen Chen
// @match                *://ani.gamer.com.tw/*
// @downloadURL https://update.greasyfork.org/scripts/424510/BAHAMUT%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/424510/BAHAMUT%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const htmlTag = document.getElementsByTagName("html")[0];
  const darkMode = document.getElementById("darkmode-moon");
  const lightMode = document.getElementById("darkmode-sun");

  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    if (darkMode.checked) {
      lightMode.click();
    }
  }

  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (e.matches && darkMode.checked) {
        lightMode.click();
      }
    });

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    if (lightMode.checked) {
      darkMode.click();
    }
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (e.matches && lightMode.checked) {
        darkMode.click();
      }
    });
})();
