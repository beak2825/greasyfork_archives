// ==UserScript==
// @name         Disable tank upgrades
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pentagonis best ol
// @author       syntax
// @match        https://diep.io/
// @grant        none
// @license      syntax
// @downloadURL https://update.greasyfork.org/scripts/438648/Disable%20tank%20upgrades.user.js
// @updateURL https://update.greasyfork.org/scripts/438648/Disable%20tank%20upgrades.meta.js
// ==/UserScript==

// TANK UPGRADES: Shift+X to disable, Shift+F to enable (enabled by default)

var disableUpgrades = true;
var enableUpgrades = true;
document.addEventListener('keydown', function(event) {
  if (event.shiftKey == true){
    if (event.key == 'X'){
    disableUpgrades = !disableUpgrades;
    input.execute("ren_upgrades false");
    }
  }
  if (event.shiftKey == true) {
      if (event.key == 'F') {
          enableUpgrades = !enableUpgrades;
          input.execute("ren_upgrades true");
      }
  }
});