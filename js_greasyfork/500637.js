// ==UserScript==
// @name         TYLERS net_predict_movement = false
// @namespace    https://greasyfork.org/en/scripts/by-site/diep.io
// @version      2.1
// @description  Sets net_predict_movement = false
// @author       pinkthc
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      DV | Do not plagiarize.
// @downloadURL https://update.greasyfork.org/scripts/500637/TYLERS%20net_predict_movement%20%3D%20false.user.js
// @updateURL https://update.greasyfork.org/scripts/500637/TYLERS%20net_predict_movement%20%3D%20false.meta.js
// ==/UserScript==

(function() {
  function applySettings() {
      input.execute("net_predict_movement false");
  }

  function waitForGame() {
      if (window.input && input.execute) {
          applySettings();
      } else {
          setTimeout(waitForGame, 100);
      }
  }
  waitForGame();
})();