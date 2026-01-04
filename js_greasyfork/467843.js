// ==UserScript==
// @name         Toggle Scrollbars
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Toggle the visiblity of scrollbars
// @author       atiabbz
// @match        *://*/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/467843/Toggle%20Scrollbars.user.js
// @updateURL https://update.greasyfork.org/scripts/467843/Toggle%20Scrollbars.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function injectStyle() {
    if (!document.querySelector("#hide-scrollbars")) {
      const style = document.createElement("style");
      style.id = "hide-scrollbars";
      style.innerHTML = `.hide-scrollbars::-webkit-scrollbar { display: none; }`;
      document.head.appendChild(style);
    }
  }

  document.onkeydown = function toggleScrollbars(e) {
    if (e.altKey && e.key === "s") {
      injectStyle();
      document.body.classList.toggle("hide-scrollbars");
    }
  };
})();
