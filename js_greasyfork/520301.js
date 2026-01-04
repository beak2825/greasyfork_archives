// ==UserScript==
// @name         Remove Dropbox Popup
// @namespace    Violentmonkey Scripts
// @version      0.1.1
// @description  Hide the annoying Dropbox resubscribing notification popup for free plan users.
// @author       HAL
// @match        *://*.dropbox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520301/Remove%20Dropbox%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/520301/Remove%20Dropbox%20Popup.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
        .ReactModalPortal {
            display: none !important;
        }
    `;
  document.head.appendChild(style);
})();
