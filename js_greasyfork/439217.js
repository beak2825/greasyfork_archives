// ==UserScript==
// @name         Khan Acadamy UI Enhance
// @namespace    https://userscript.snomiao.com/
// @version      0.0.1
// @description  1. Khan Acadamy dialogs force FullScreen, 2. Ctrl+Enter To confirm
// @author       snomiao@gmail.com
// @match        https://www.khanacademy.org/*
// @icon         https://www.google.com/s2/favicons?domain=khanacademy.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439217/Khan%20Acadamy%20UI%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/439217/Khan%20Acadamy%20UI%20Enhance.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const e = document.createElement("div");
  e.innerHTML = `
        <style>
            [role="dialog"] {
                width: 100% !important;
                height: 100% !important;
                max-height: 100% !important;
                max-width: 100% !important;
            }
        <style>`;
  document.addEventListener("keydown", (event) => {
    // ctrl+enter or Alt+Enter to click the confirm button
    if (
      (event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        event.key === "Enter") ||
      (!event.ctrlKey &&
        event.altKey &&
        !event.shiftKey &&
        event.key === "Enter")
    ) {
      var e =
        document.querySelector('[data-test-id="exercise-check-answer"]') ||
        document.querySelector('[data-test-id="exercise-next-question"]') ||
        document.querySelector('[data-test-id="modal-done-button"]') ||
        document.querySelector('[role="dialog"] [role="button"]');
      if (e) {
        e.click();
        e && event.preventDefault();
      }
    }
  });
  document.body.appendChild(e);
})();
