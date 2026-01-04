// ==UserScript==
// @name         YouTube Anti Swear Word Filter
// @namespace    http://youtube.com/
// @version      1.1
// @license      MIT
// @description  This prevents you from swearing in the Youtube Comment Section
// @author       Magisatrate
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457292/YouTube%20Anti%20Swear%20Word%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/457292/YouTube%20Anti%20Swear%20Word%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const replacements = {
    "damn": "darn",
    "hell": "heck",
    "crap": "crud",
    "darn": "drat",
    "fu*k": "fudge",
    "shoot": "shucks",
    "sh*t": "shoot"
  };

  document.getElementById("contenteditable-root").addEventListener("input", function(event) {
    for (const [swearWord, replacement] of Object.entries(replacements)) {
      if (event.target.textContent.toLowerCase().includes(swearWord)) {
        event.target.textContent = event.target.textContent.toLowerCase().replace(swearWord, replacement);
      }
    }
  });

})();
