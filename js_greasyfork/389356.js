// ==UserScript==
// @name         Backblaze B2 download keyboard shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download selected files by hitting the "d" key
// @author       kxlt (https://github.com/kxlt)
// @match        https://*.backblaze.com/b2_browse_files2.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389356/Backblaze%20B2%20download%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/389356/Backblaze%20B2%20download%20keyboard%20shortcut.meta.js
// ==/UserScript==

(function() {
  "use strict";

  document.addEventListener("keyup", function(event) {
    if (event.code === "KeyD") {
      triggerFileDownload();
    }
  });
})();

