// ==UserScript==
// @name         Add a "Remove Selected" button
// @namespace    https://github.com/f1r3w4rr10r/fa-utils
// @version      1.1.0
// @description  This adds a second "Remove Selected" button to the top of the submission notifications pages.
// @author       f1r3w4rr10r
// @match        https://www.furaffinity.net/msg/submissions/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528540/Add%20a%20%22Remove%20Selected%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/528540/Add%20a%20%22Remove%20Selected%22%20button.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const topButtonsContainer = document.querySelector(
    "section.gallery-section .aligncenter",
  );
  if (!topButtonsContainer)
    throw new Error("Could not find the top buttons container.");

  const button = document.createElement("button");
  button.className = "button remove-checked standard";
  button.type = "submit";
  button.name = "messagecenter-action";
  button.value = "remove_checked";
  button.textContent = "Remove Selected";
  topButtonsContainer.appendChild(button);
})();
