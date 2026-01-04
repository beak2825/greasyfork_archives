// ==UserScript==
// @name        Show account names
// @namespace   io.inp
// @match       https://www.esologs.com/reports/*
// @grant       none
// @version     1.2
// @author      Xandaros
// @license     BSD2
// @run-at      document-end
// @description Replaces all character names with account names
// @downloadURL https://update.greasyfork.org/scripts/483703/Show%20account%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/483703/Show%20account%20names.meta.js
// ==/UserScript==

function replaceNames(elem) {
  elem.contents().each(function(idx, inner) {
    if (inner.nodeType == 3) {
      // Text node
      for (let player of players) {
        if (player.type == "NPC" || player.anonymous) continue;
        if (inner.textContent.includes(player.displayName)) continue;
        inner.textContent = inner.textContent.replaceAll(player.name, player.displayName);
      }
    }
    replaceNames($(inner));
  });
}

window.setInterval(function() {
  replaceNames($("html"));
}, 2000);