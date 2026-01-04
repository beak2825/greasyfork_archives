// ==UserScript==
// @name        Remove PlayWire Auto Video
// @namespace   
// @include     *://*/*
// @exclude     *://*/wp-admin/*
// @grant       none
// @version     1.1
// @author      squonk
// @license     MIT
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @description 06/05/2022, 12:55:13
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/444561/Remove%20PlayWire%20Auto%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/444561/Remove%20PlayWire%20Auto%20Video.meta.js
// ==/UserScript==

$("#tyche_trendi_video_container").remove;


const observer = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((addedNode) => {
      if (addedNode.nodeType === 1 && addedNode.matches("div#tyche_trendi_video_container")) {
        addedNode.remove();
        observer.disconnect();
      }
    });
  });
});
observer.observe(document.documentElement, { childList: true, subtree: true });
