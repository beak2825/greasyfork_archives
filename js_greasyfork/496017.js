// ==UserScript==
// @name        Pages
// @namespace   CCAU
// @description Automate course copies
// @match       https://*.instructure.com/courses/*/pages
// @version     0.1.0
// @author      CIDT
// @grant       none
// @license     BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/496017/Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/496017/Pages.meta.js
// ==/UserScript==
"use strict";
(() => {
  // out/utils.js
  function clickButton(sel) {
    const element = document.querySelector(sel);
    const btn = element;
    btn?.click();
  }
  function log(msg) {
    console.log("[CCAU] " + msg);
  }
  function observeDOM(element, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(element, {
      childList: true
    });
    return observer;
  }

  // out/check.js
  function deleteAll() {
    const s = ".select-page-checkbox";
    const s2 = "#ccau_omnibox";
    const chk = document.querySelector(s2).checked;
    Array.from(document.querySelectorAll(s)).map((e) => e).forEach((box) => {
      const label = box.ariaLabel;
      if (box.checked !== chk && !label?.includes("University Information")) {
        box.click();
      }
    });
    if (chk) {
      clickButton(".delete_pages");
    }
  }
  function addButton() {
    const row = document.querySelector("thead");
    const slot = row?.children[0].children[0];
    const omniBox = document.createElement("input");
    omniBox.type = "checkbox";
    omniBox.id = "ccau_omnibox";
    omniBox.onclick = deleteAll;
    if (slot?.innerHTML.includes("ccau_omnibox")) {
      log("Omni-box already exists");
      return;
    }
    if (!row) {
      log("Row not found");
      return;
    }
    log("Adding omni-box");
    slot?.appendChild(omniBox);
  }

  // out/index.js
  observeDOM(document.body, () => {
    const msg0 = "This friendly creature sees all, however ";
    const msg1 = "it probably wont know what to do with it.";
    log(msg0 + msg1);
    setTimeout(addButton, 500);
  });
})();
