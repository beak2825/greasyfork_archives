// ==UserScript==
// @name         Custom Font
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  set font-family to all elements.
// @author       117503445
// @match        http*://*/*
// @exclude      http*://127.0*/*
// @exclude      http*://192.168*/*
// @grant        none
// @homepageURL https://greasyfork.org/zh-CN/scripts/415928-custom-font
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/415928/Custom%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/415928/Custom%20Font.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let change = () => {
    const elements = document.getElementsByTagName("*");
    for (const element of elements) {
      if (
        !element.className.toString().includes("icon") &&
        element.innerText != null
      ) {
        element.style.fontFamily =
          "UbuntuMono Nerd Font Mono,Microsoft YaHei Mono";
      }
    }
  };
  change();
  window.setInterval(change, 1000);
})();
