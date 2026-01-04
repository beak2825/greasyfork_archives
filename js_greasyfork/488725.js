// ==UserScript==
// @name        CCAU - Pages Section
// @namespace   CCAU Suite
// @description Automate course copies
// @match       https://*.instructure.com/courses/*/pages
// @version     0.2.2
// @author      miruqi
// @icon        https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @grant       none
// @license     GPL-3.-or-later
// @downloadURL https://update.greasyfork.org/scripts/488725/CCAU%20-%20Pages%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/488725/CCAU%20-%20Pages%20Section.meta.js
// ==/UserScript==
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
    if (document.querySelector("#ccau_omnibox")) {
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
