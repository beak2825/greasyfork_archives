// ==UserScript==
// @name        DGG - Auto refresh chat
// @namespace   Jaydr please stop
// @match       https://www.destiny.gg/bigscreen
// @match       https://www.destiny.gg/bigscreen*
// @match       https://www.destiny.gg/embed/chat
// @match       https://www.omniliberal.dev/bigscreen
// @match       https://www.omniliberal.dev/bigscreen*
// @match       https://www.omniliberal.dev/embed/chat
// @grant       none
// @version     0.1
// @author      mif
// @license     MIT
// @description 2024-11-21, refresh DGG chat periodically to disable Jaydr's crypto miner
// @downloadURL https://update.greasyfork.org/scripts/518392/DGG%20-%20Auto%20refresh%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/518392/DGG%20-%20Auto%20refresh%20chat.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var clicker = function () {
    var e = document.getElementById("refresh");
    if (e) {
      // console.log("Found Button");
      e.click();
      // document.getElementById("refresh").click()
    } else {
      // console.log("No Button found");
      location.replace(location.href);
    }
    // console.log("REFRESHING CHAT OOOO")
  };
  window.setInterval(clicker, 1000*60*60); // 1 ms * 60 seconds * 60 minutes = once per hour
})();