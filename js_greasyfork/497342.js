// ==UserScript==
// @name         No YouTube Short
// @namespace    https://github.com/zenpk/scripts-tampermonkey
// @version      0.1
// @description  Automatically change YouTube short videos to normal videos. **Refresh needed**.
// @author       zenpk
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497342/No%20YouTube%20Short.user.js
// @updateURL https://update.greasyfork.org/scripts/497342/No%20YouTube%20Short.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function changeUrl() {
    const url = window.location.href;
    if (url.includes("youtube.com/shorts/")) {
      window.location.href = url.replace("shorts/", "watch?v=");
    }
  }

  changeUrl();
})();
