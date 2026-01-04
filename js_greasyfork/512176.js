// ==UserScript==
// @name         Prettify JSON Selection
// @namespace    vengut.github.io
// @version      2024-10-10
// @description  Adds a shortcut(Shift + Ctrl/Alt/Option + F) and context menu option to prettify code selection.
// @license      MIT
// @author       Venkat G
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/512176/Prettify%20JSON%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/512176/Prettify%20JSON%20Selection.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_registerMenuCommand("Prettify", prettifyJson);

  document.querySelector("body").addEventListener("keydown", (event) => {
    console.log(event.key);
    // Shift + Ctrl/Alt/Option + F
    if (event.shiftKey && (event.altKey && event.ctrlKey) && (event.key === "Ï" || event.key === "F")) {
      prettifyJson();
    }
  });

  function prettifyJson() {
    try {
      let text = "";

      // https://stackoverflow.com/a/5379408
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }

      const json = JSON.stringify(JSON.parse(text), null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    } catch (err) {}
  }
})();
