// ==UserScript==
// @name         Prev Next Page on Screen
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Clone and keep it fixed on the screen
// @author       king1x32
// @match        https://voz.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529349/Prev%20Next%20Page%20on%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/529349/Prev%20Next%20Page%20on%20Screen.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function cloneAndFixDiv() {
    const originalDiv = document.querySelector(".block-outer-main");
    if (originalDiv) {
      const clonedDiv = originalDiv.cloneNode(true);
      Object.assign(clonedDiv.style, {
        position: "fixed",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "auto",
        zIndex: "2147483647",
        backgroundColor: "transparent",
      });
      document.body.appendChild(clonedDiv);
    }
  }
  window.addEventListener("load", cloneAndFixDiv);
})();
