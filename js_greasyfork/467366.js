// ==UserScript==
// @name         YouTube YCS Load all Items
// @namespace    juliSharowYouTubeYCSLoadAllItems
// @description  This script is for the YCS Chrome add on. It will spamclick the loadmore button to always load all entries. This makes it work well with my other script
// @version      1.0.0
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467366/YouTube%20YCS%20Load%20all%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/467366/YouTube%20YCS%20Load%20all%20Items.meta.js
// ==/UserScript==

const debug = false;
const buttonId = "ycs__show-more-button";

(async function (_undefined) {
  if (debug) console.debug("YouTube YCS Load all Items");
  async function loadAllItems() {
    let button = document.querySelector(`#${buttonId}`);
    if (!button) {
      if (debug) console.debug("button doesnt exist");
      return;
    }
    if (button.isUsed) {
      if (debug) console.debug("button is Used");
      return;
    }
    button.isUsed = true;
    while (document.querySelector(`#${buttonId}`)) {
      button.click();
      await new Promise((r) => setTimeout(r, 100));
      if (debug) console.debug("click", button);
    }
    if (debug) console.debug("finished Clicking");
    button.isUsed = false;
  }
  window.addEventListener("click", loadAllItems);
})();
