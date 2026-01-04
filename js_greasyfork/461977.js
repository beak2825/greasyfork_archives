// ==UserScript==
// @name           ING DiBa Comfort Tools
// @name:de        ING DiBa Komfort-Tools

// @description    A few tools to make the German DiBa sites more bearable. Refreshes login & stocks and tries to close ads.
// @description:de Ein paar Tools, um die DiBa-Webseiten erträglicher zu gestalten. Erneuert Login & Kurse und versucht, Werbung zu schließen.

// @version        0.3.2
// @author         Rsge
// @copyright      2023+, Jan G. (Rsge)
// @license        Mozilla Public License 2.0
// @icon           https://banking.ing.de/app/obligo/static/resource/icon-16x16-ver-34F56DF9647FC5EF3BBEFA31470B5827.png

// @namespace      https://github.com/Rsge
// @homepageURL    https://github.com/Rsge/ING-DiBa-Comfort-Tools
// @supportURL     https://github.com/Rsge/ING-DiBa-Comfort-Tools/issues

// @match          https://banking.ing.de/app/*
// @match          https://wertpapiere.ing.de/Investieren/*/Charts/*

// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/461977/ING%20DiBa%20Comfort%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/461977/ING%20DiBa%20Comfort%20Tools.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /*
   * Auto-Refreshers
   */
  let millisecondsToWait
  const minsToMSMult = 60 * 1000
  // Automatic login refresh.
  millisecondsToWait = Math.floor(4.5 * minsToMSMult);
  window.setInterval(function () {
    window.dispatchEvent(new CustomEvent("ingde-sn:reset-timer"));
  }, millisecondsToWait);
  // Automatic stocks refresh.
  millisecondsToWait = Math.floor(59 * minsToMSMult);
  window.setInterval(function() {
    window.dispatchEvent(new MouseEvent("mousemove"));
  }, millisecondsToWait);

  // (Try to) remove ad stuff.
  let blockedIDs = new Array("id40a63666", "id76b7d7414", "id81ce80b32", "id4bff0ea7", "id40a54bb5");
  let node
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      node = mutation.addedNodes[0];
      if (mutation.addedNodes[0] != null && blockedIDs.indexOf(node.id) != -1) {
        node.remove();
      }
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
