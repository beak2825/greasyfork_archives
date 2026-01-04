// ==UserScript==
// @name        No more popup
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      qeqeqe_player533_1025
// @description stops the pop up when you try to leave a website.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479401/No%20more%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/479401/No%20more%20popup.meta.js
// ==/UserScript==
window.addEventListener('beforeunload', function (event) {
  event.stopImmediatePropagation();
});