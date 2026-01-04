// ==UserScript==
// @name         通用自动签到与领取
// @namespace    snomiao@gmail.com
// @version      0.1
// @description  自用，rt
// @author       snomiao@gmail.com
// @match        http*://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439235/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E4%B8%8E%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/439235/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E4%B8%8E%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(() => {
  window.addEventListener("load", () =>
    [...document.querySelectorAll("a,button,div.btn")]
      .filter((e) => e.textContent.match(/签到|领取/))
      .forEach((e) => e.click())
  );
})();
