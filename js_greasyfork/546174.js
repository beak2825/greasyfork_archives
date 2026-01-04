// ==UserScript==
// @name         Torn — In Memory of PhantomReaper
// @namespace    https://torn.com/
// @version      1.0
// @description  Shows a simple memorial bar at the top of Torn in memory of PhantomReaper [2291318].
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546174/Torn%20%E2%80%94%20In%20Memory%20of%20PhantomReaper.user.js
// @updateURL https://update.greasyfork.org/scripts/546174/Torn%20%E2%80%94%20In%20Memory%20of%20PhantomReaper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Don't run inside iframes
  if (window.top !== window.self) return;

  function addBar() {
    if (document.getElementById("phantom-memorial-bar")) return;

    const bar = document.createElement("div");
    bar.id = "phantom-memorial-bar";
    bar.textContent = "💠 In memory of PhantomReaper [2291318] 💠";

    Object.assign(bar.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "2147483647",
      background: "linear-gradient(90deg,#121212,#1b1b1b)",
      color: "#e8e8e8",
      textAlign: "center",
      padding: "6px 10px",
      font: "600 13px/1.4 Inter, Arial, sans-serif",
      borderBottom: "1px solid #2e2e2e",
      letterSpacing: "0.3px",
      pointerEvents: "none"
    });

    document.body.style.paddingTop = "28px";
    document.body.appendChild(bar);
  }

  // Run when page is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addBar);
  } else {
    addBar();
  }
})();
