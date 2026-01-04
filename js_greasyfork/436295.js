// ==UserScript==
// @name         discord token logger
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  log the current users token to the console
// @license      MIT
// @author       nxxh ♥#0187
// @match        none
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436295/discord%20token%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/436295/discord%20token%20logger.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.dispatchEvent(new Event("beforeunload"));
  setTimeout(() => {
    console.log(window.open().localStorage.token);
  }, 4000);
})();