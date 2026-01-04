// ==UserScript==
// @name       Roblox Layered Clothing Bypass
// @version     1.0
// @description A Tampermonkey script that bypasses Roblox layered clothing.
// @author      egg1112
// @match       https://www.roblox.com/*
// @grant       none
// @namespace https://greasyfork.org/users/1141542
// @downloadURL https://update.greasyfork.org/scripts/472197/Roblox%20Layered%20Clothing%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/472197/Roblox%20Layered%20Clothing%20Bypass.meta.js
// ==/UserScript==

(function() {
  // This function is called when the script is loaded.
  function onLoad() {
    // Get the element that contains the layered clothing data.
    var layeredClothingElement = document.getElementById("layeredClothing");

    // If the element exists, remove it.
    if (layeredClothingElement) {
      layeredClothingElement.remove();
    }
  }

  // This function is called when the script is unloaded.
  function onUnload() {
    // Do nothing here.
  }

  // Register the onLoad and onUnload functions.
  window.addEventListener("load", onLoad);
  window.addEventListener("unload", onUnload);
})();