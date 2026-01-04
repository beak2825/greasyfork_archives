// ==UserScript==
// @name        Spy Optimizer
// @namespace   dev.talus
// @description Calculate optimal number of spies to send
// @version     1.0
// @author      Talus
// @license     GPL-3.0-or-later
// @match       https://politicsandwar.com/nation/espionage/eid=*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/512304/Spy%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/512304/Spy%20Optimizer.meta.js
// ==/UserScript==

(function() {
  // Wait until the DOM is fully loaded before running the script
  document.addEventListener("DOMContentLoaded", function() {

      function getOdds() {
          return Number(document.querySelector("#odds").innerText.substring(0, 5));
      }

      function trySpy(n) {
          document.querySelector("#spies").value = n;
          updateCostAndOdds();
      }

      function optimalSpy() {
          var attackingSpies = 30;
          trySpy(attackingSpies);
          for (var i = 1; i <= 5; i++) {
              var odds = getOdds();
              var adjust = Math.round(30 / Math.pow(2, i));
              if (odds === 99) {
                  attackingSpies -= adjust;
              } else {
                  attackingSpies += adjust;
              }
              trySpy(attackingSpies);
          }
          if (getOdds() < 99) {
              trySpy(attackingSpies + 1);
          }
      }

      // Set up event listeners for #level and #optype
      ["#level", "#optype"].forEach(function(selector) {
          var element = document.querySelector(selector);
          if (element) {
              element.addEventListener("change", function() {
                  optimalSpy();
              });
          }
      });

      optimalSpy();
  });
})();